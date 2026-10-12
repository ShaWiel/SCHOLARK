-- Connect SFU rollout r259. OFF by default; no paid server is activated by this migration.
-- Old WebRTC mesh sessions remain untouched. SFU rooms opt in only after real network, TURN
-- and kick/end enforcement tests. Never enable SFU solely because an endpoint exists.

alter table public.connect_rooms
  add column if not exists media_mode text not null default 'mesh';
alter table public.connect_rooms drop constraint if exists connect_rooms_media_mode_check;
alter table public.connect_rooms
  add constraint connect_rooms_media_mode_check check (media_mode in ('mesh','sfu'));
alter table public.connect_rooms drop constraint if exists connect_rooms_max_participants_check;
alter table public.connect_rooms
  add constraint connect_rooms_max_participants_check check (max_participants between 2 and 100);

create table if not exists public.connect_media_rollout (
  singleton boolean primary key default true check(singleton),
  sfu_enabled boolean not null default false,
  sfu_capacity integer not null default 25 check(sfu_capacity between 2 and 100),
  modified_at timestamptz not null default now()
);
insert into public.connect_media_rollout(singleton,sfu_enabled,sfu_capacity)
values(true,false,25) on conflict(singleton) do nothing;
alter table public.connect_media_rollout enable row level security;
revoke all on public.connect_media_rollout from public,anon,authenticated;
-- SECURITY DEFINER connect_create_room reads the private flag. Clients cannot flip it.

create or replace function public.connect_create_room(p_title text,p_kind text default 'meeting')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare
  u uuid:=auth.uid();
  r public.connect_rooms;
  use_sfu boolean:=false;
  capacity integer:=25;
begin
  if u is null then raise exception 'Sign in required'; end if;
  if (select count(*) from public.connect_rooms
      where owner_id=u and active and expires_at>now())>=3 then
    raise exception 'Finish an active meeting before creating another';
  end if;
  if not exists(select 1 from public.connect_identities where user_id=u) then
    raise exception 'Set up Connect profile first';
  end if;
  if length(trim(p_title)) not between 1 and 100
      or p_kind not in('meeting','study') then raise exception 'Invalid room'; end if;
  select sfu_enabled,sfu_capacity into use_sfu,capacity
    from public.connect_media_rollout where singleton=true;
  insert into public.connect_rooms(owner_id,title,kind,media_mode,max_participants)
    values(u,trim(p_title),p_kind,
      case when coalesce(use_sfu,false) then 'sfu' else 'mesh' end,
      case when coalesce(use_sfu,false) then coalesce(capacity,25) else 4 end)
    returning * into r;
  insert into public.connect_room_members(room_id,user_id) values(r.id,u);
  return jsonb_build_object(
    'id',r.id,'invite_code',r.invite_code,'title',r.title,'kind',r.kind,
    'owner_id',r.owner_id,'media_mode',r.media_mode,'max_participants',r.max_participants);
end $$;

create or replace function public.connect_join_room(p_room uuid,p_code text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); r public.connect_rooms; present boolean;
begin
  if u is null then raise exception 'Sign in required';end if;
  if not exists(select 1 from public.connect_identities where user_id=u) then
    raise exception 'Set up Connect profile first';
  end if;
  select * into r from public.connect_rooms where id=p_room for update;
  if r.id is null or not r.active or r.expires_at<=now() or r.invite_code<>p_code then
    raise exception 'Meeting link expired or invalid';
  end if;
  select exists(select 1 from public.connect_room_members
    where room_id=r.id and user_id=u and left_at is null) into present;
  if not present and (select count(*) from public.connect_room_members
      where room_id=r.id and left_at is null)>=r.max_participants then
    raise exception 'Meeting full (maximum % people)',r.max_participants;
  end if;
  insert into public.connect_room_members(room_id,user_id,joined_at,left_at)
    values(r.id,u,now(),null)
    on conflict(room_id,user_id) do update set left_at=null,joined_at=now();
  return jsonb_build_object(
    'id',r.id,'invite_code',r.invite_code,'title',r.title,'kind',r.kind,
    'owner_id',r.owner_id,'media_mode',r.media_mode,'max_participants',r.max_participants);
end $$;
-- SFU must remain disabled until server-side host-kick/end synchronization is added.
