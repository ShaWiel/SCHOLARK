-- SCHOLAVERUM Connect r262: one temporary TURN grant per authorized request.
-- This schema does not enable a media provider or charge for media traffic.
-- Private issuance quota is only reachable through this authenticated RPC.
create table if not exists public.connect_turn_issuance_windows (
  user_id uuid not null references auth.users(id) on delete cascade,
  window_start timestamptz not null,
  grants smallint not null default 0 check (grants between 0 and 20),
  primary key (user_id, window_start)
);
alter table public.connect_turn_issuance_windows enable row level security;
revoke all on table public.connect_turn_issuance_windows from public, anon, authenticated;

create or replace function public.connect_turn_issue_allowed(p_room uuid)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare
  caller_id uuid := auth.uid();
  hourly_start timestamptz := date_trunc('hour', now());
  issued smallint;
begin
  if caller_id is null or p_room is null or not public.connect_member(p_room, caller_id) then
    return false;
  end if;
  insert into public.connect_turn_issuance_windows(user_id,window_start,grants)
    values (caller_id,hourly_start,1)
  on conflict(user_id,window_start) do update
    set grants=public.connect_turn_issuance_windows.grants+1
    where public.connect_turn_issuance_windows.grants < 20
  returning grants into issued;
  return issued is not null;
end $$;

revoke all on function public.connect_turn_issue_allowed(uuid) from public,anon;
grant execute on function public.connect_turn_issue_allowed(uuid) to authenticated;
