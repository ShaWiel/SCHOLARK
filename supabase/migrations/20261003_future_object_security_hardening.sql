-- Future-object security hardening.
-- Supabase does not permit changing supabase_admin default ACLs from this
-- connection, so enforce secure defaults at DDL time instead.

drop event trigger if exists ensure_rls;
drop function if exists public.rls_auto_enable();

create or replace function scholark_private.enforce_public_object_security()
returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  cmd record;
begin
  for cmd in
    select *
    from pg_event_trigger_ddl_commands()
    where schema_name='public'
  loop
    begin
      if cmd.object_type in ('table','partitioned table') then
        execute format('alter table if exists %s enable row level security',cmd.object_identity);
        execute format('revoke all privileges on table %s from anon, authenticated',cmd.object_identity);
      elsif cmd.object_type in ('view','materialized view') then
        execute format('revoke all privileges on table %s from anon, authenticated',cmd.object_identity);
      elsif cmd.object_type='sequence' then
        execute format('revoke all privileges on sequence %s from anon, authenticated',cmd.object_identity);
      elsif cmd.object_type='function' then
        execute format('revoke execute on function %s from public, anon, authenticated',cmd.object_identity);
      elsif cmd.object_type='procedure' then
        execute format('revoke execute on procedure %s from public, anon, authenticated',cmd.object_identity);
      end if;
    exception
      when others then
        raise log 'SCHOLARK public-object security guard skipped % (%): %',
          cmd.object_identity,cmd.object_type,sqlerrm;
    end;
  end loop;
end
$$;

revoke all on function scholark_private.enforce_public_object_security() from public,anon,authenticated;

create event trigger ensure_rls
on ddl_command_end
execute function scholark_private.enforce_public_object_security();
