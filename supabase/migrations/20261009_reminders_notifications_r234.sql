begin;

alter table public.notification_preferences
  add column if not exists payment_reminders boolean not null default true,
  add column if not exists device_onboarding_done boolean not null default false;

alter table public.notification_reminders
  drop constraint if exists notification_reminders_kind_check;
alter table public.notification_reminders
  add constraint notification_reminders_kind_check
  check (kind = any (array['study','task','assignment','homework','payment','update','custom']::text[]));

create unique index if not exists push_subscriptions_user_endpoint_uidx
  on public.push_subscriptions(user_id, endpoint);
create unique index if not exists notification_reminders_user_dedupe_uidx
  on public.notification_reminders(user_id, dedupe_key)
  where dedupe_key is not null;
create index if not exists notification_reminders_due_pending_idx
  on public.notification_reminders(due_at)
  where status='pending';
create index if not exists planner_tasks_due_open_idx
  on public.planner_tasks(due_at,user_id)
  where status in ('todo','doing') and due_at is not null;
create index if not exists billing_subscriptions_renewal_idx
  on public.billing_subscriptions(current_period_end,user_id)
  where status in ('active','past_due') and current_period_end is not null;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.notification_config(
  singleton boolean primary key default true check(singleton),
  vapid_public text not null,
  vapid_private text not null,
  dispatch_secret text not null,
  updated_at timestamptz not null default now()
);
revoke all on table private.notification_config from public, anon, authenticated;

create or replace function public.get_notification_dispatch_config()
returns jsonb
language sql
stable
security definer
set search_path=pg_catalog,private
as $$
  select jsonb_build_object(
    'vapid_public',vapid_public,
    'vapid_private',vapid_private,
    'dispatch_secret',dispatch_secret
  )
  from private.notification_config
  where singleton=true
  limit 1
$$;
revoke all on function public.get_notification_dispatch_config() from public, anon, authenticated;
grant execute on function public.get_notification_dispatch_config() to service_role;

commit;
