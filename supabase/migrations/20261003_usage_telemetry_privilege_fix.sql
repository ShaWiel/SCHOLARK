-- Preserve client performance telemetry without restoring broad usage-event privileges.
drop policy if exists "own_usage" on public.usage_events;

create policy "usage_select_own"
on public.usage_events
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "usage_insert_own"
on public.usage_events
for insert
to authenticated
with check ((select auth.uid()) = user_id);

revoke all privileges on table public.usage_events from authenticated;
grant select,insert on table public.usage_events to authenticated;
