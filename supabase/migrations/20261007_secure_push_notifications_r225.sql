-- SCHOLARK r225 · secure cross-device notifications
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  expiration_time bigint,
  user_agent text,
  platform text,
  device_label text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique(user_id, endpoint)
);
create index if not exists push_subscriptions_user_enabled_idx on public.push_subscriptions(user_id, enabled);
alter table public.push_subscriptions enable row level security;
drop policy if exists "push subscriptions own select" on public.push_subscriptions;
create policy "push subscriptions own select" on public.push_subscriptions for select to authenticated using (auth.uid()=user_id);
drop policy if exists "push subscriptions own insert" on public.push_subscriptions;
create policy "push subscriptions own insert" on public.push_subscriptions for insert to authenticated with check (auth.uid()=user_id);
drop policy if exists "push subscriptions own update" on public.push_subscriptions;
create policy "push subscriptions own update" on public.push_subscriptions for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
drop policy if exists "push subscriptions own delete" on public.push_subscriptions;
create policy "push subscriptions own delete" on public.push_subscriptions for delete to authenticated using (auth.uid()=user_id);

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  study_reminders boolean not null default true,
  task_reminders boolean not null default true,
  product_updates boolean not null default false,
  study_time time not null default '19:00',
  timezone text not null default 'UTC',
  task_lead_minutes integer not null default 60 check(task_lead_minutes between 5 and 1440),
  quiet_hours_start time not null default '22:00',
  quiet_hours_end time not null default '07:00',
  updated_at timestamptz not null default now()
);
alter table public.notification_preferences enable row level security;
drop policy if exists "notification preferences own select" on public.notification_preferences;
create policy "notification preferences own select" on public.notification_preferences for select to authenticated using(auth.uid()=user_id);
drop policy if exists "notification preferences own insert" on public.notification_preferences;
create policy "notification preferences own insert" on public.notification_preferences for insert to authenticated with check(auth.uid()=user_id);
drop policy if exists "notification preferences own update" on public.notification_preferences;
create policy "notification preferences own update" on public.notification_preferences for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
drop policy if exists "notification preferences own delete" on public.notification_preferences;
create policy "notification preferences own delete" on public.notification_preferences for delete to authenticated using(auth.uid()=user_id);

create table if not exists public.notification_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'custom' check(kind in('study','task','assignment','update','custom')),
  title text not null check(char_length(title) between 1 and 180),
  body text not null default '' check(char_length(body)<=600),
  url text not null default '/#dashboard' check(char_length(url)<=500),
  due_at timestamptz not null,
  dedupe_key text,
  status text not null default 'pending' check(status in('pending','sent','cancelled')),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,dedupe_key)
);
create index if not exists notification_reminders_due_idx on public.notification_reminders(status,due_at);
create index if not exists notification_reminders_user_due_idx on public.notification_reminders(user_id,due_at);
alter table public.notification_reminders enable row level security;
drop policy if exists "notification reminders own select" on public.notification_reminders;
create policy "notification reminders own select" on public.notification_reminders for select to authenticated using(auth.uid()=user_id);
drop policy if exists "notification reminders own insert" on public.notification_reminders;
create policy "notification reminders own insert" on public.notification_reminders for insert to authenticated with check(auth.uid()=user_id);
drop policy if exists "notification reminders own update" on public.notification_reminders;
create policy "notification reminders own update" on public.notification_reminders for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
drop policy if exists "notification reminders own delete" on public.notification_reminders;
create policy "notification reminders own delete" on public.notification_reminders for delete to authenticated using(auth.uid()=user_id);

create table if not exists public.notification_delivery_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid references public.push_subscriptions(id) on delete cascade,
  dedupe_key text not null,
  status text not null default 'sent' check(status in('sent','failed')),
  error text,
  delivered_at timestamptz not null default now(),
  unique(user_id,subscription_id,dedupe_key)
);
create index if not exists notification_delivery_user_idx on public.notification_delivery_log(user_id,delivered_at desc);
alter table public.notification_delivery_log enable row level security;
drop policy if exists "notification delivery own select" on public.notification_delivery_log;
create policy "notification delivery own select" on public.notification_delivery_log for select to authenticated using(auth.uid()=user_id);
revoke insert,update,delete on public.notification_delivery_log from authenticated,anon;
