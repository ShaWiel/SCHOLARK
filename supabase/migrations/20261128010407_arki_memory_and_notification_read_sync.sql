create table public.arki_personal_memory (
 user_id uuid primary key references auth.users(id) on delete cascade,
 memory_text text not null default '' check (char_length(memory_text)<=2000),
 updated_at timestamptz not null default now()
);
alter table public.arki_personal_memory enable row level security;
revoke all on public.arki_personal_memory from public, anon, authenticated;
grant select, insert, update, delete on public.arki_personal_memory to authenticated;
create policy arki_memory_select on public.arki_personal_memory for select to authenticated using ((select auth.uid())=user_id);
create policy arki_memory_insert on public.arki_personal_memory for insert to authenticated with check ((select auth.uid())=user_id);
create policy arki_memory_update on public.arki_personal_memory for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy arki_memory_delete on public.arki_personal_memory for delete to authenticated using ((select auth.uid())=user_id);
alter table public.notification_reminders add column if not exists read_at timestamptz;
