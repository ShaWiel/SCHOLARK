revoke execute on function public.publish_shared_artifact(uuid,text,text,jsonb) from public, anon;
revoke execute on function public.unpublish_shared_artifact(uuid) from public, anon;

grant execute on function public.publish_shared_artifact(uuid,text,text,jsonb) to authenticated, service_role;
grant execute on function public.unpublish_shared_artifact(uuid) to authenticated, service_role;

alter function public.consume_credits(numeric,text,jsonb) set search_path = public, pg_temp;
alter function public.handle_new_user() set search_path = public, pg_temp;
