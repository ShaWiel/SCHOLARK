-- Move credit privilege elevation behind the non-exposed scholark_private schema.
-- Public RPC wrappers remain the stable Data API surface but now execute as the caller.

create or replace function scholark_private.consume_feature_credits_internal(
  p_feature text,
  p_meta jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  c numeric;
begin
  if uid is null then raise exception 'not_authenticated'; end if;

  select credits into c
  from public.ai_feature_costs
  where feature=p_feature and active=true;

  if c is null then
    raise exception 'unknown_feature_cost';
  end if;

  return public.consume_credits(c,p_feature,coalesce(p_meta,'{}'::jsonb));
end
$$;

alter function public.consume_feature_credits(text,jsonb) security invoker;
alter function public.consume_feature_credits_once(text,text,jsonb) security invoker;

revoke all on schema scholark_private from public,anon;
grant usage on schema scholark_private to authenticated;

revoke execute on function scholark_private.consume_feature_credits_internal(text,jsonb) from public,anon;
revoke execute on function scholark_private.consume_feature_credits_once_internal(text,text,jsonb) from public,anon;
grant execute on function scholark_private.consume_feature_credits_internal(text,jsonb) to authenticated;
grant execute on function scholark_private.consume_feature_credits_once_internal(text,text,jsonb) to authenticated;
