-- r255: authoritative rolling Free-plan chat and attachment quotas.
-- Free users receive 20 ARKI/AI Tutor turns and 30 uploads per rolling 24-hour window.
-- Plus/Pro bypass the daily Free cap. All clients still enforce max 10 attachments/message.

create table if not exists public.free_ai_usage_windows (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null default now(),
  chat_count integer not null default 0 check (chat_count >= 0),
  attachment_count integer not null default 0 check (attachment_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.free_ai_usage_windows enable row level security;
revoke all on table public.free_ai_usage_windows from anon, authenticated;

create table if not exists public.free_ai_quota_request_ids (
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id text not null check (char_length(request_id) between 8 and 120),
  result jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, request_id)
);

alter table public.free_ai_quota_request_ids enable row level security;
revoke all on table public.free_ai_quota_request_ids from anon, authenticated;

create index if not exists free_ai_quota_request_created_idx
  on public.free_ai_quota_request_ids(created_at);

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
  attachment_limit constant integer := 30;
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

create or replace function public.free_ai_quota_status(p_attachment_count integer default 0)
returns jsonb
language sql
security definer
set search_path to ''
as $function$
  select scholark_private.free_ai_quota_state_internal(p_attachment_count,false)
$function$;

revoke all on function public.free_ai_quota_status(integer) from public, anon;
grant execute on function public.free_ai_quota_status(integer) to authenticated, service_role;

create or replace function scholark_private.consume_free_ai_quota_once_internal(
  p_request_id text,
  p_attachment_count integer default 0,
  p_meta jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  uid uuid := auth.uid();
  existing jsonb;
  quota_result jsonb;
  event_name text;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if p_request_id is null or char_length(p_request_id) < 8 or char_length(p_request_id) > 120 then
    raise exception 'invalid_request_id';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(uid::text || ':free-ai-quota-only:' || p_request_id,0));

  select result into existing
  from public.free_ai_quota_request_ids
  where user_id=uid and request_id=p_request_id;

  if existing is not null then
    return existing || jsonb_build_object('idempotent',true);
  end if;

  quota_result := scholark_private.free_ai_quota_state_internal(p_attachment_count,true);

  insert into public.free_ai_quota_request_ids(user_id,request_id,result)
  values(uid,p_request_id,quota_result)
  on conflict (user_id,request_id) do update set result=excluded.result;

  event_name := case when coalesce((quota_result->>'ok')::boolean,false)
    then 'free_daily_quota_consumed'
    else 'blocked_free_daily_limit'
  end;

  insert into public.usage_events(user_id,feature,event,success,credits,meta)
  values(
    uid,
    'general_ai',
    event_name,
    coalesce((quota_result->>'ok')::boolean,false),
    0,
    coalesce(p_meta,'{}'::jsonb)
      || jsonb_build_object('request_id',p_request_id,'quota',quota_result->'quota')
  );

  return quota_result || jsonb_build_object('idempotent',false);
end
$function$;

revoke all on function scholark_private.consume_free_ai_quota_once_internal(text,integer,jsonb) from public, anon, authenticated;

create or replace function public.consume_free_ai_quota_once(
  p_request_id text,
  p_attachment_count integer default 0,
  p_meta jsonb default '{}'::jsonb
)
returns jsonb
language sql
security definer
set search_path to ''
as $function$
  select scholark_private.consume_free_ai_quota_once_internal(p_request_id,p_attachment_count,p_meta)
$function$;

revoke all on function public.consume_free_ai_quota_once(text,integer,jsonb) from public, anon;
grant execute on function public.consume_free_ai_quota_once(text,integer,jsonb) to authenticated, service_role;

create or replace function scholark_private.consume_feature_credits_once_internal(
  p_feature text,
  p_request_id text,
  p_meta jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  uid uuid := auth.uid();
  existing jsonb;
  charged jsonb;
  quota_result jsonb;
  requested_attachments integer := greatest(0, least(coalesce((p_meta->>'attachment_count')::integer,0),10));
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if p_request_id is null or char_length(p_request_id) < 8 or char_length(p_request_id) > 120 then
    raise exception 'invalid_request_id';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(uid::text || ':' || p_request_id,0));

  select result into existing
  from public.credit_request_ids
  where user_id=uid and request_id=p_request_id;

  if existing is not null then
    return existing || jsonb_build_object('idempotent',true);
  end if;

  insert into public.credit_request_ids(user_id,request_id,feature)
  values(uid,p_request_id,p_feature)
  on conflict (user_id,request_id) do nothing;

  if p_feature in ('general_ai','tutor_message') then
    quota_result := scholark_private.free_ai_quota_state_internal(requested_attachments,false);
    if not coalesce((quota_result->>'ok')::boolean,false) then
      update public.credit_request_ids
      set result=quota_result
      where user_id=uid and request_id=p_request_id;

      insert into public.usage_events(user_id,feature,event,success,credits,meta)
      values(
        uid,p_feature,'blocked_free_daily_limit',false,0,
        coalesce(p_meta,'{}'::jsonb)
          || jsonb_build_object('request_id',p_request_id,'quota',quota_result->'quota')
      );

      return quota_result || jsonb_build_object('idempotent',false);
    end if;
  end if;

  charged := scholark_private.consume_feature_credits_internal(
    p_feature,
    coalesce(p_meta,'{}'::jsonb) || jsonb_build_object('request_id',p_request_id)
  );

  if coalesce((charged->>'ok')::boolean,false) and p_feature in ('general_ai','tutor_message') then
    quota_result := scholark_private.free_ai_quota_state_internal(requested_attachments,true);
    if not coalesce((quota_result->>'ok')::boolean,false) then
      raise exception 'free_quota_state_changed';
    end if;
    charged := charged || jsonb_build_object('quota',quota_result->'quota');
  end if;

  update public.credit_request_ids
  set result=charged
  where user_id=uid and request_id=p_request_id;

  return charged || jsonb_build_object('idempotent',false);
end
$function$;

revoke all on function scholark_private.consume_feature_credits_once_internal(text,text,jsonb) from public, anon, authenticated;
