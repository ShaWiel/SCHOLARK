-- Connect r260: voice-only WebRTC mesh with optional screen sharing.
-- Deliberately no camera capture, SFU, or paid TURN dependency.
-- New rooms have eight seats (including host); existing active rooms keep their
-- original limit so no ongoing call is silently changed.
alter table public.connect_rooms
  drop constraint if exists connect_rooms_max_participants_check;

alter table public.connect_rooms
  add constraint connect_rooms_max_participants_check
  check (max_participants between 2 and 8);

alter table public.connect_rooms
  alter column max_participants set default 8;

-- Preserve row lock, private invitation checks, authenticated profile check and
-- active membership cap; only the hard-coded four-person message is changed.
create or replace function public.connect_join_room(p_room uuid,p_code text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); r public.connect_rooms; present boolean;
begin
  if u is null then raise exception 'Sign in required';end if;
  if not exists(select 1 from public.connect_identities where user_id=u) then raise exception 'Set up Connect profile first';end if;
  select * into r from public.connect_rooms where id=p_room for update;
  if r.id is null or not r.active or r.expires_at<=now() or r.invite_code<>p_code then
    raise exception 'Meeting link expired or invalid';
  end if;
  select exists(select 1 from public.connect_room_members where room_id=r.id and user_id=u and left_at is null) into present;
  if not present and (select count(*) from public.connect_room_members where room_id=r.id and left_at is null)>=r.max_participants then
    raise exception 'Meeting full (maximum % people)',r.max_participants;
  end if;
  insert into public.connect_room_members(room_id,user_id,joined_at,left_at) values(r.id,u,now(),null)
  on conflict(room_id,user_id) do update set left_at=null,joined_at=now();
  return jsonb_build_object('id',r.id,'invite_code',r.invite_code,'title',r.title,'kind',r.kind,
    'owner_id',r.owner_id,'max_participants',r.max_participants);
end $$;

revoke all on function public.connect_join_room(uuid,text) from public,anon;
grant execute on function public.connect_join_room(uuid,text) to authenticated;
