-- r269: REST-facing wrapper remains SECURITY INVOKER.
-- The private function already authenticates with auth.uid(), enforces
-- user-owned credit requests and holds the row-level quota/idempotency lock.
-- Give only authenticated callers EXECUTE on the internal implementation,
-- without exposing the private schema as a PostgREST API.
revoke execute on function scholark_private.consume_feature_credits_once_internal(text,text,jsonb) from public, anon;
grant execute on function scholark_private.consume_feature_credits_once_internal(text,text,jsonb) to authenticated;

do $$
begin
  if not has_function_privilege('authenticated','scholark_private.consume_feature_credits_once_internal(text,text,jsonb)','EXECUTE') then
    raise exception 'r269: authenticated credit charge path is blocked';
  end if;
  if has_function_privilege('anon','scholark_private.consume_feature_credits_once_internal(text,text,jsonb)','EXECUTE') then
    raise exception 'r269: anonymous credit charge access must remain disabled';
  end if;
  if not has_function_privilege('authenticated','public.consume_feature_credits_once(text,text,jsonb)','EXECUTE') then
    raise exception 'r269: public authenticated credit wrapper must remain callable';
  end if;
end $$;