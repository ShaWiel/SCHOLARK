-- r256: lower the Free-plan rolling attachment allowance from 30 to 15.
-- Chat allowance remains 20 turns per rolling 24-hour window.
-- Per-message attachment maximum remains 10.

create or replace function scholark_private.free_ai_quota_state_internal(
  p_attachment_count integer default 0,
  p_consume boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  uid uuid := auth.uid();
  plan_name text := 'free';
  row_exists boolean := false;
  started timestamptz;
  chats integer := 0;
  attachments integer := 0;
  requested_attachments integer := greatest(0, least(coalesce(p_attachment_count,0), 10));
  chat_limit constant integer := 20;
  attachment_limit constant integer := 15;
  quota jsonb;
begin
  if uid is null then raise exception 'not_authenticated'; end if;

  select coalesce(
    (
      select bs.plan
      from public.billing_subscriptions bs
      where bs.user_id=uid
        and bs.status in ('active','trialing')
        and bs.plan in ('plus','pro')
      limit 1
    ),
    (
      select cw.plan
      from public.credit_wallets cw
      where cw.user_id=uid
        and cw.plan in ('plus','pro')
      limit 1
    ),
    'free'
  ) into plan_name;

  if plan_name <> 'free' then
    return jsonb_build_object(
      'ok',true,
      'quota',jsonb_build_object(
        'limited',false,
        'plan',plan_name,
        'chatLimit',null,
        'chatUsed',null,
        'chatRemaining',null,
        'attachmentLimit',null,
        'attachmentUsed',null,
        'attachmentRemaining',null,
        'resetAt',null
      )
    );
  end if;

  perform pg_advisory_xact_lock(hashtextextended(uid::text || ':free-ai-quota',0));

  select w.window_started_at,w.chat_count,w.attachment_count
  into started,chats,attachments
  from public.free_ai_usage_windows w
  where w.user_id=uid
  for update;
  row_exists := found;

  if not row_exists or started <= now() - interval '24 hours' then
    started := now();
    chats := 0;
    attachments := 0;
  end if;

  quota := jsonb_build_object(
    'limited',true,
    'plan','free',
    'chatLimit',chat_limit,
    'chatUsed',chats,
    'chatRemaining',greatest(0,chat_limit-chats),
    'attachmentLimit',attachment_limit,
    'attachmentUsed',attachments,
    'attachmentRemaining',greatest(0,attachment_limit-attachments),
    'resetAt',started + interval '24 hours'
  );

  if chats >= chat_limit then
    return jsonb_build_object('ok',false,'code','free_daily_chat_limit','quota',quota);
  end if;

  if attachments + requested_attachments > attachment_limit then
    return jsonb_build_object('ok',false,'code','free_daily_attachment_limit','quota',quota);
  end if;

  if p_consume then
    chats := chats + 1;
    attachments := attachments + requested_attachments;

    insert into public.free_ai_usage_windows(user_id,window_started_at,chat_count,attachment_count,updated_at)
    values(uid,started,chats,attachments,now())
    on conflict (user_id) do update
      set window_started_at=excluded.window_started_at,
          chat_count=excluded.chat_count,
          attachment_count=excluded.attachment_count,
          updated_at=excluded.updated_at;

    quota := jsonb_build_object(
      'limited',true,
      'plan','free',
      'chatLimit',chat_limit,
      'chatUsed',chats,
      'chatRemaining',greatest(0,chat_limit-chats),
      'attachmentLimit',attachment_limit,
      'attachmentUsed',attachments,
      'attachmentRemaining',greatest(0,attachment_limit-attachments),
      'resetAt',started + interval '24 hours'
    );
  end if;

  return jsonb_build_object('ok',true,'quota',quota);
end
$function$;

revoke all on function scholark_private.free_ai_quota_state_internal(integer,boolean) from public, anon, authenticated;
