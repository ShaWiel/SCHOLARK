-- SCHOLARK r225 · notification performance and RLS initplan tuning
create index if not exists notification_delivery_subscription_idx
  on public.notification_delivery_log(subscription_id);

create index if not exists planner_tasks_notification_due_idx
  on public.planner_tasks(status,due_at,user_id)
  where due_at is not null;

drop policy if exists "push subscriptions own select" on public.push_subscriptions;
create policy "push subscriptions own select"
  on public.push_subscriptions for select to authenticated
  using ((select auth.uid())=user_id);
drop policy if exists "push subscriptions own insert" on public.push_subscriptions;
create policy "push subscriptions own insert"
  on public.push_subscriptions for insert to authenticated
  with check ((select auth.uid())=user_id);
drop policy if exists "push subscriptions own update" on public.push_subscriptions;
create policy "push subscriptions own update"
  on public.push_subscriptions for update to authenticated
  using ((select auth.uid())=user_id)
  with check ((select auth.uid())=user_id);
drop policy if exists "push subscriptions own delete" on public.push_subscriptions;
create policy "push subscriptions own delete"
  on public.push_subscriptions for delete to authenticated
  using ((select auth.uid())=user_id);

drop policy if exists "notification preferences own select" on public.notification_preferences;
create policy "notification preferences own select"
  on public.notification_preferences for select to authenticated
  using ((select auth.uid())=user_id);
drop policy if exists "notification preferences own insert" on public.notification_preferences;
create policy "notification preferences own insert"
  on public.notification_preferences for insert to authenticated
  with check ((select auth.uid())=user_id);
drop policy if exists "notification preferences own update" on public.notification_preferences;
create policy "notification preferences own update"
  on public.notification_preferences for update to authenticated
  using ((select auth.uid())=user_id)
  with check ((select auth.uid())=user_id);
drop policy if exists "notification preferences own delete" on public.notification_preferences;
create policy "notification preferences own delete"
  on public.notification_preferences for delete to authenticated
  using ((select auth.uid())=user_id);

drop policy if exists "notification reminders own select" on public.notification_reminders;
create policy "notification reminders own select"
  on public.notification_reminders for select to authenticated
  using ((select auth.uid())=user_id);
drop policy if exists "notification reminders own insert" on public.notification_reminders;
create policy "notification reminders own insert"
  on public.notification_reminders for insert to authenticated
  with check ((select auth.uid())=user_id);
drop policy if exists "notification reminders own update" on public.notification_reminders;
create policy "notification reminders own update"
  on public.notification_reminders for update to authenticated
  using ((select auth.uid())=user_id)
  with check ((select auth.uid())=user_id);
drop policy if exists "notification reminders own delete" on public.notification_reminders;
create policy "notification reminders own delete"
  on public.notification_reminders for delete to authenticated
  using ((select auth.uid())=user_id);

drop policy if exists "notification delivery own select" on public.notification_delivery_log;
create policy "notification delivery own select"
  on public.notification_delivery_log for select to authenticated
  using ((select auth.uid())=user_id);
