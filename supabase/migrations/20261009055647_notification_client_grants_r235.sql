begin;

-- Notification tables are client-accessible only for signed-in users.
-- Object grants allow the Data API request to reach RLS; RLS remains the row-level boundary.
alter table public.push_subscriptions enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notification_reminders enable row level security;
alter table public.notification_delivery_log enable row level security;

revoke all on table public.push_subscriptions from anon;
revoke all on table public.notification_preferences from anon;
revoke all on table public.notification_reminders from anon;
revoke all on table public.notification_delivery_log from anon;

grant select, insert, update, delete on table public.push_subscriptions to authenticated;
grant select, insert, update, delete on table public.notification_preferences to authenticated;
grant select, insert, update, delete on table public.notification_reminders to authenticated;

-- Delivery records are readable by their owner through RLS but remain server-written.
revoke insert, update, delete on table public.notification_delivery_log from authenticated;
grant select on table public.notification_delivery_log to authenticated;

commit;
