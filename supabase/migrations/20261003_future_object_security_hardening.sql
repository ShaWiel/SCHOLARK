-- Future-object least privilege hardening for Supabase-managed DDL.
-- Existing objects are already RLS/least-privilege protected; this closes the
-- remaining default-ACL gap for objects created by supabase_admin.

alter default privileges for role supabase_admin in schema public revoke all on tables from anon,authenticated;
alter default privileges for role supabase_admin in schema public revoke execute on functions from public,anon,authenticated;
alter default privileges for role supabase_admin in schema public revoke all on sequences from anon,authenticated;

-- The RLS auto-enable event trigger already protects newly created public
-- tables. Its helper should not be callable through client roles.
revoke execute on function public.rls_auto_enable() from public,anon,authenticated;
