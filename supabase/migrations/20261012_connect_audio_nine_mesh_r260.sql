-- SCHOLAVERUM Connect r260: nine-seat voice-call mesh with optional screen sharing.
-- This migration is staged, not applied to production until acceptance testing.
-- No webcam, SFU, hosted TURN or paid media provider is required.
-- Existing active four-seat rooms retain their original cap.
alter table public.connect_rooms
  drop constraint if exists connect_rooms_max_participants_check;

alter table public.connect_rooms
  add constraint connect_rooms_max_participants_check
  check (max_participants between 2 and 9);

alter table public.connect_rooms
  alter column max_participants set default 9;

alter table public.connect_rooms
  add column if not exists screen_share_owner uuid,
  add column if not exists screen_share_expires_at timestamptz;

-- Keep the old authenticated invite, active membership, concurrency and
-- per-room admission checks. The room is row-locked to stop race overfilling.
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

-- Room-scoped screen sharing lease: one cooperative, authenticated client
-- receives the right to publish its display-media track at any moment.
-- A 45-second renewable lease recovers after an abrupt network disconnect.
-- WebRTC peers are end-to-end transport, so hostile modified clients still
-- require separate moderation; do not claim server-side media enforcement.
create or replace function public.connect_screen_share(p_room uuid,p_action text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); r public.connect_rooms;
begin
  if u is null or p_action not in ('claim','renew','release') then
    raise exception 'Invalid screen share request';
  end if;

  select * into r from public.connect_rooms where id=p_room for update;
  if r.id is null then return false;end if;

  -- Allow current share owner to release even when the room just ended.
  if p_action='release' then
    if r.screen_share_owner=u then
      update public.connect_rooms set screen_share_owner=null,
        screen_share_expires_at=null where id=p_room;
      return true;
    end if;
    return false;
  end if;

  if not r.active or r.expires_at<=now() or not public.connect_member(p_room,u) then
    return false;
  end if;

  if p_action='renew' then
    if r.screen_share_owner=u and r.screen_share_expires_at>now() then
      update public.connect_rooms set screen_share_expires_at=now()+interval '45 seconds'
        where id=p_room;
      return true;
    end if;
    return false;
  end if;

  if r.screen_share_owner is null
    or r.screen_share_owner=u
    or r.screen_share_expires_at is null
    or r.screen_share_expires_at<=now()
    or not exists(select 1 from public.connect_room_members m
      where m.room_id=p_room and m.user_id=r.screen_share_owner and m.left_at is null)
  then
    update public.connect_rooms set screen_share_owner=u,
      screen_share_expires_at=now()+interval '45 seconds' where id=p_room;
    return true;
  end if;
  return false;
end $$;

revoke all on function public.connect_screen_share(uuid,text) from public,anon;
grant execute on function public.connect_screen_share(uuid,text) to authenticated;
