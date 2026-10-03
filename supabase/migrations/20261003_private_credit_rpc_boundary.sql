-- Credit RPC boundary: authenticated users execute only the public wrappers.
-- The wrappers run with the function owner's rights, keep an empty search_path,
-- and the private implementation remains unreachable to client roles.

create or replace function public.consume_feature_credits(
  p_feature text,
  p_meta jsonb default '{}'::jsonb
)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select scholark_private.consume_feature_credits_internal(p_feature,p_meta)
$$;

create or replace function public.consume_feature_credits_once(
  p_feature text,
  p_request_id text,
  p_meta jsonb default '{}'::jsonb
)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select scholark_private.consume_feature_credits_once_internal(p_feature,p_request_id,p_meta)
$$;

revoke all on function scholark_private.consume_feature_credits_internal(text,jsonb) from public,anon,authenticated;
revoke all on function scholark_private.consume_feature_credits_once_internal(text,text,jsonb) from public,anon,authenticated;
revoke usage on schema scholark_private from public,anon,authenticated;

revoke all on function public.consume_feature_credits(text,jsonb) from public,anon,authenticated;
revoke all on function public.consume_feature_credits_once(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.consume_feature_credits(text,jsonb) to authenticated;
grant execute on function public.consume_feature_credits_once(text,text,jsonb) to authenticated;
