-- Connect hardening: allow RLS helper execution, retain private profiles for friends,
-- rate-limit abuse and bound signaling storage.
grant execute on function public.connect_member(uuid,uuid) to authenticated;
drop policy "connect identities visible only when searchable" on public.connect_identities;
create policy "connect identities searchable and contacts" on public.connect_identities for select to authenticated using(
  user_id=auth.uid() or searchable
  or exists(select 1 from public.connect_friends f where f.status='accepted' and
    ((f.requester=user_id and f.recipient=auth.uid()) or (f.recipient=user_id and f.requester=auth.uid())))
  or exists(select 1 from public.connect_room_members m where m.user_id=user_id and m.left_at is null and public.connect_member(m.room_id,auth.uid()))
);
create index if not exists connect_signals_room_created_idx on public.connect_signals(room_id,created_at);
create index if not exists connect_messages_sender_created_idx on public.connect_messages(sender,created_at desc);
create index if not exists connect_room_chat_sender_created_idx on public.connect_room_chat(sender,created_at desc);
create or replace function public.connect_friend_request(p_target uuid)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); out_id uuid;
begin
if u is null then raise exception 'Sign in required'; end if;
if (select count(*) from public.connect_friends where requester=u and created_at>now()-interval '1 hour')>=16 then raise exception 'Too many friend requests. Try again later';end if;
if p_target=u or not exists(select 1 from public.connect_identities where user_id=p_target and searchable) then raise exception 'Person not available'; end if;
if exists(select 1 from public.connect_blocks where (blocker=u and blocked=p_target) or (blocker=p_target and blocked=u)) then raise exception 'Friend request unavailable'; end if;
select id into out_id from public.connect_friends where (requester=u and recipient=p_target) or (recipient=u and requester=p_target);
if out_id is null then
  insert into public.connect_friends(requester,recipient) values(u,p_target) returning id into out_id;
end if;
return out_id;
end $$;
create or replace function public.connect_send_message(p_target uuid,p_body text)
returns bigint language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); msg_id bigint; b text:=trim(p_body);
begin
if u is null or length(b) not between 1 and 2000 then raise exception 'Invalid message';end if;
if (select count(*) from public.connect_messages where sender=u and created_at>now()-interval '1 minute')>=24 then raise exception 'Slow down before sending more messages';end if;
if not exists(select 1 from public.connect_friends where status='accepted' and ((requester=u and recipient=p_target) or (recipient=u and requester=p_target))) then raise exception 'Only accepted friends can message';end if;
if exists(select 1 from public.connect_blocks where (blocker=u and blocked=p_target) or (blocker=p_target and blocked=u)) then raise exception 'Messaging unavailable';end if;
insert into public.connect_messages(sender,recipient,body) values(u,p_target,b) returning id into msg_id;
return msg_id;
end $$;
create or replace function public.connect_create_room(p_title text,p_kind text default 'meeting')
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); r public.connect_rooms;
begin
if u is null then raise exception 'Sign in required';end if;
if (select count(*) from public.connect_rooms where owner_id=u and active and expires_at>now())>=3 then raise exception 'Finish an active meeting before creating another';end if;
if not exists(select 1 from public.connect_identities where user_id=u) then raise exception 'Set up Connect profile first';end if;
if length(trim(p_title)) not between 1 and 100 or p_kind not in('meeting','study') then raise exception 'Invalid room';end if;
insert into public.connect_rooms(owner_id,title,kind) values(u,trim(p_title),p_kind) returning * into r;
insert into public.connect_room_members(room_id,user_id) values(r.id,u);
return jsonb_build_object('id',r.id,'invite_code',r.invite_code,'title',r.title,'kind',r.kind,'owner_id',r.owner_id,'max_participants',r.max_participants);
end $$;
create or replace function public.connect_room_message(p_room uuid,p_body text)
returns bigint language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); new_id bigint; b text:=trim(p_body);
begin
if length(b) not between 1 and 1500 or not public.connect_member(p_room,u) then raise exception 'Not an active room member';end if;
if (select count(*) from public.connect_room_chat where sender=u and created_at>now()-interval '1 minute')>=24 then raise exception 'Slow down before sending more chat messages';end if;
insert into public.connect_room_chat(room_id,sender,body) values(p_room,u,b) returning id into new_id;
return new_id;
end $$;
create or replace function public.connect_signal(p_room uuid,p_target uuid,p_kind text,p_payload jsonb)
returns bigint language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); new_id bigint;
begin
if u is null or u=p_target or p_kind not in('offer','answer','ice','bye','board') then raise exception 'Invalid signal';end if;
if not public.connect_member(p_room,u) or not public.connect_member(p_room,p_target) then raise exception 'Participant unavailable';end if;
if pg_column_size(p_payload)>90000 then raise exception 'Signal too large';end if;
if (select count(*) from public.connect_signals where sender=u and created_at>now()-interval '10 seconds')>=80 then raise exception 'Too many meeting updates';end if;
delete from public.connect_signals where room_id=p_room and created_at<now()-interval '1 day';
insert into public.connect_signals(room_id,sender,recipient,kind,payload) values(p_room,u,p_target,p_kind,coalesce(p_payload,'{}'::jsonb)) returning id into new_id;
return new_id;
end $$;
