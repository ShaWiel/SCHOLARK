-- Restore only the authenticated access required by the existing reminder UI.
-- Existing owner-only RLS policies remain in force.
grant select on public.notification_reminders to authenticated;
grant insert (user_id,kind,title,body,url,due_at,dedupe_key,status,updated_at) on public.notification_reminders to authenticated;
grant update (kind,title,body,url,due_at,status,updated_at,read_at) on public.notification_reminders to authenticated;
