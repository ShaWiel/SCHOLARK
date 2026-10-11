-- r255 follow-up: bind idempotent AI request IDs to feature + attachment count.
-- This prevents replaying the same request ID with different quota semantics.

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
  requested_attachments integer := greatest(0, least(coalesce(p_attachment_count,0),10));
  request_signature jsonb;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if p_request_id is null or char_length(p_request_id) < 8 or char_length(p_request_id) > 120 then
    raise exception 'invalid_request_id';
  end if;

  request_signature := jsonb_build_object(
    'feature','general_ai_free_quota',
    'attachmentCount',requested_attachments
  );

  perform pg_advisory_xact_lock(hashtextextended(uid::text || ':free-ai-quota-only:' || p_request_id,0));

  select result into existing
  from public.free_ai_quota_request_ids
  where user_id=uid and request_id=p_request_id;

  if existing is not null then
    if existing->'requestSignature' is null or existing->'requestSignature' <> request_signature then
      return jsonb_build_object('ok',false,'code','request_id_mismatch','idempotent',false);
    end if;
    return existing || jsonb_build_object('idempotent',true);
  end if;

  quota_result := scholark_private.free_ai_quota_state_internal(requested_attachments,true)
    || jsonb_build_object('requestSignature',request_signature);

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
  existing_feature text;
  charged jsonb;
  quota_result jsonb;
  raw_attachment_count text := coalesce(p_meta->>'attachment_count','');
  requested_attachments integer := 0;
  request_signature jsonb;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if p_request_id is null or char_length(p_request_id) < 8 or char_length(p_request_id) > 120 then
    raise exception 'invalid_request_id';
  end if;

  if raw_attachment_count ~ '^[0-9]+$' then
    requested_attachments := greatest(0,least(raw_attachment_count::integer,10));
  end if;

  request_signature := jsonb_build_object(
    'feature',coalesce(p_feature,''),
    'attachmentCount',
      case when p_feature in ('general_ai','tutor_message') then requested_attachments else 0 end
  );

  perform pg_advisory_xact_lock(hashtextextended(uid::text || ':' || p_request_id,0));

  select result,feature into existing,existing_feature
  from public.credit_request_ids
  where user_id=uid and request_id=p_request_id;

  if existing is not null then
    if existing_feature is distinct from p_feature
       or existing->'requestSignature' is null
       or existing->'requestSignature' <> request_signature then
      return jsonb_build_object('ok',false,'code','request_id_mismatch','idempotent',false);
    end if;
    return existing || jsonb_build_object('idempotent',true);
  end if;

  insert into public.credit_request_ids(user_id,request_id,feature)
  values(uid,p_request_id,p_feature)
  on conflict (user_id,request_id) do nothing;

  if p_feature in ('general_ai','tutor_message') then
    quota_result := scholark_private.free_ai_quota_state_internal(requested_attachments,false);
    if not coalesce((quota_result->>'ok')::boolean,false) then
      quota_result := quota_result || jsonb_build_object('requestSignature',request_signature);

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

  charged := charged || jsonb_build_object('requestSignature',request_signature);

  update public.credit_request_ids
  set result=charged
  where user_id=uid and request_id=p_request_id;

  return charged || jsonb_build_object('idempotent',false);
end
$function$;

revoke all on function scholark_private.consume_feature_credits_once_internal(text,text,jsonb) from public, anon, authenticated;
