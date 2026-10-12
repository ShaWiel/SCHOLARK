-- SCHOLAVERUM Connect: private friends, messaging and small-group native WebRTC meetings.
-- Independent from Google Meet, Teams, Skype and external conferencing applications.
create table if not exists public.connect_identities(
  user_id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique check (handle ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null check(length(display_name) between 1 and 60),
  searchable boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.connect_blocks(
  blocker uuid not null references auth.users(id) on delete cascade,
  blocked uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(blocker,blocked),
  check(blocker<>blocked)
);
create table if not exists public.connect_friends(
  id uuid primary key default gen_random_uuid(),
  requester uuid not null references auth.users(id) on delete cascade,
  recipient uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check(status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  check(requester<>recipient)
);
create unique index if not exists connect_friends_pair_idx on public.connect_friends(least(requester,recipient),greatest(requester,recipient));
create index if not exists connect_friends_recipient_idx on public.connect_friends(recipient,status);
create table if not exists public.connect_messages(
  id bigint generated always as identity primary key,
  sender uuid not null references auth.users(id) on delete cascade,
  recipient uuid not null references auth.users(id) on delete cascade,
  body text not null check(length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  check(sender<>recipient)
);
create index if not exists connect_messages_pair_idx on public.connect_messages(sender,recipient,created_at desc);
create table if not exists public.connect_rooms(
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check(length(title) between 1 and 100),
  kind text not null default 'meeting' check(kind in('meeting','study')),
  invite_code text not null unique default encode(gen_random_bytes(20),'hex'),
  active boolean not null default true,
  max_participants integer not null default 4 check(max_participants between 2 and 4),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now()+interval '12 hours'
);
create table if not exists public.connect_room_members(
  room_id uuid not null references public.connect_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  primary key(room_id,user_id)
);
create index if not exists connect_room_members_user_idx on public.connect_room_members(user_id,left_at);
create table if not exists public.connect_room_chat(
  id bigint generated always as identity primary key,
  room_id uuid not null references public.connect_rooms(id) on delete cascade,
  sender uuid not null references auth.users(id) on delete cascade,
  body text not null check(length(body) between 1 and 1500),
  created_at timestamptz not null default now()
);
create index if not exists connect_room_chat_room_idx on public.connect_room_chat(room_id,id desc);
create table if not exists public.connect_signals(
  id bigint generated always as identity primary key,
  room_id uuid not null references public.connect_rooms(id) on delete cascade,
  sender uuid not null references auth.users(id) on delete cascade,
  recipient uuid not null references auth.users(id) on delete cascade,
  kind text not null check(kind in('offer','answer','ice','bye','board')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check(sender<>recipient)
);
create index if not exists connect_signals_recipient_idx on public.connect_signals(recipient,id desc);
alter table public.connect_identities enable row level security;
alter table public.connect_blocks enable row level security;
alter table public.connect_friends enable row level security;
alter table public.connect_messages enable row level security;
alter table public.connect_rooms enable row level security;
alter table public.connect_room_members enable row level security;
alter table public.connect_room_chat enable row level security;
alter table public.connect_signals enable row level security;

create or replace function public.connect_member(p_room uuid,p_user uuid)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
select exists(select 1 from public.connect_room_members m join public.connect_rooms r on r.id=m.room_id
where m.room_id=p_room and m.user_id=p_user and m.left_at is null and r.active and r.expires_at>now())
$$;
revoke all on function public.connect_member(uuid,uuid) from public;

create policy "connect identities visible only when searchable" on public.connect_identities for select to authenticated
using (user_id=auth.uid() or searchable);
create policy "connect blocks own" on public.connect_blocks for select to authenticated using(blocker=auth.uid());
create policy "connect friendships participants" on public.connect_friends for select to authenticated
using (requester=auth.uid() or recipient=auth.uid());
create policy "connect direct messages participants" on public.connect_messages for select to authenticated
using(sender=auth.uid() or recipient=auth.uid());
create policy "connect rooms participants" on public.connect_rooms for select to authenticated
using(owner_id=auth.uid() or public.connect_member(id,auth.uid()));
create policy "connect membership participants" on public.connect_room_members for select to authenticated
using(public.connect_member(room_id,auth.uid()));
create policy "connect room chat members" on public.connect_room_chat for select to authenticated
using(public.connect_member(room_id,auth.uid()));
create policy "connect signals addressed recipient" on public.connect_signals for select to authenticated
using(recipient=auth.uid() and public.connect_member(room_id,auth.uid()));
grant select on public.connect_identities,public.connect_blocks,public.connect_friends,public.connect_messages,public.connect_rooms,public.connect_room_members,public.connect_room_chat,public.connect_signals to authenticated;
revoke insert,update,delete on public.connect_identities,public.connect_blocks,public.connect_friends,public.connect_messages,public.connect_rooms,public.connect_room_members,public.connect_room_chat,public.connect_signals from anon,authenticated;

create or replace function public.connect_register(p_handle text,p_name text,p_searchable boolean default true)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); h text:=lower(trim(p_handle)); n text:=trim(p_name); row public.connect_identities;
begin
if u is null then raise exception 'Sign in to use Connect' using errcode='28000'; end if;
if h !~ '^[a-z0-9_]{3,24}$' or length(n) not between 1 and 60 then raise exception 'Choose a valid handle (3–24 letters/numbers/underscores) and display name'; end if;
insert into public.connect_identities(user_id,handle,display_name,searchable) values(u,h,n,coalesce(p_searchable,true))
on conflict(user_id) do update set handle=excluded.handle,display_name=excluded.display_name,searchable=excluded.searchable returning * into row;
return jsonb_build_object('user_id',row.user_id,'handle',row.handle,'display_name',row.display_name,'searchable',row.searchable);
end $$;

create or replace function public.connect_find_people(p_query text)
returns table(user_id uuid,handle text,display_name text) language sql stable security definer set search_path=public,pg_temp as $$
select i.user_id,i.handle,i.display_name from public.connect_identities i
where auth.uid() is not null and length(trim(p_query))>=3 and i.searchable and i.user_id<>auth.uid()
and (i.handle ilike '%'||left(trim(p_query),32)||'%' or i.display_name ilike '%'||left(trim(p_query),32)||'%')
and not exists(select 1 from public.connect_blocks b where
(b.blocker=auth.uid() and b.blocked=i.user_id) or (b.blocked=auth.uid() and b.blocker=i.user_id))
order by case when i.handle=lower(trim(p_query)) then 0 else 1 end,i.handle limit 12
$$;

create or replace function public.connect_friend_request(p_target uuid)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); out_id uuid;
begin
if u is null then raise exception 'Sign in required'; end if;
if p_target=u or not exists(select 1 from public.connect_identities where user_id=p_target and searchable) then raise exception 'Person not available'; end if;
if exists(select 1 from public.connect_blocks where (blocker=u and blocked=p_target) or (blocker=p_target and blocked=u)) then raise exception 'Friend request unavailable'; end if;
select id into out_id from public.connect_friends where (requester=u and recipient=p_target) or (recipient=u and requester=p_target);
if out_id is null then
  insert into public.connect_friends(requester,recipient) values(u,p_target) returning id into out_id;
end if;
return out_id;
end $$;

create or replace function public.connect_friend_action(p_id uuid,p_action text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.connect_friends; u uuid:=auth.uid();
begin
select * into row from public.connect_friends where id=p_id for update;
if row.id is null or u not in (row.requester,row.recipient) then raise exception 'Friendship not found';end if;
if p_action='accept' and row.recipient=u and row.status='pending' then
  if exists(select 1 from public.connect_blocks where (blocker=u and blocked=row.requester) or (blocker=row.requester and blocked=u)) then raise exception 'Friendship unavailable';end if;
  update public.connect_friends set status='accepted',accepted_at=now() where id=p_id;
elsif p_action in('reject','remove','cancel') then
  delete from public.connect_friends where id=p_id;
else raise exception 'Action not permitted';end if;
return true;
end $$;

create or replace function public.connect_block(p_target uuid,p_block boolean default true)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid();
begin
if u is null or p_target=u then raise exception 'Invalid block target';end if;
if p_block then
  insert into public.connect_blocks(blocker,blocked) values(u,p_target) on conflict do nothing;
  delete from public.connect_friends where (requester=u and recipient=p_target) or (recipient=u and requester=p_target);
else
  delete from public.connect_blocks where blocker=u and blocked=p_target;
end if;
return true;
end $$;

create or replace function public.connect_send_message(p_target uuid,p_body text)
returns bigint language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); msg_id bigint; b text:=trim(p_body);
begin
if u is null or length(b) not between 1 and 2000 then raise exception 'Invalid message';end if;
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
if not exists(select 1 from public.connect_identities where user_id=u) then raise exception 'Set up Connect profile first';end if;
if length(trim(p_title)) not between 1 and 100 or p_kind not in('meeting','study') then raise exception 'Invalid room';end if;
insert into public.connect_rooms(owner_id,title,kind) values(u,trim(p_title),p_kind) returning * into r;
insert into public.connect_room_members(room_id,user_id) values(r.id,u);
return jsonb_build_object('id',r.id,'invite_code',r.invite_code,'title',r.title,'kind',r.kind,'owner_id',r.owner_id,'max_participants',r.max_participants);
end $$;

create or replace function public.connect_join_room(p_room uuid,p_code text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); r public.connect_rooms; present boolean;
begin
if u is null then raise exception 'Sign in required';end if;
if not exists(select 1 from public.connect_identities where user_id=u) then raise exception 'Set up Connect profile first';end if;
select * into r from public.connect_rooms where id=p_room for update;
if r.id is null or not r.active or r.expires_at<=now() or r.invite_code<>p_code then raise exception 'Meeting link expired or invalid';end if;
select exists(select 1 from public.connect_room_members where room_id=r.id and user_id=u and left_at is null) into present;
if not present and (select count(*) from public.connect_room_members where room_id=r.id and left_at is null)>=r.max_participants then raise exception 'Meeting full (maximum four people in this version)';end if;
insert into public.connect_room_members(room_id,user_id,joined_at,left_at) values(r.id,u,now(),null)
on conflict(room_id,user_id) do update set left_at=null,joined_at=now();
return jsonb_build_object('id',r.id,'invite_code',r.invite_code,'title',r.title,'kind',r.kind,'owner_id',r.owner_id,'max_participants',r.max_participants);
end $$;

create or replace function public.connect_leave_room(p_room uuid)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid();
begin
update public.connect_room_members set left_at=now() where room_id=p_room and user_id=u and left_at is null;
if exists(select 1 from public.connect_rooms where id=p_room and owner_id=u and active) then
  update public.connect_rooms set active=false where id=p_room;
end if;
return true;
end $$;

create or replace function public.connect_end_room(p_room uuid,p_kick uuid default null)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid();
begin
if not exists(select 1 from public.connect_rooms where id=p_room and owner_id=u and active) then raise exception 'Host only';end if;
if p_kick is null then update public.connect_rooms set active=false where id=p_room;
else if p_kick=u then raise exception 'Host cannot remove self; end meeting';end if;
  update public.connect_room_members set left_at=now() where room_id=p_room and user_id=p_kick;
end if;
return true;
end $$;

create or replace function public.connect_room_message(p_room uuid,p_body text)
returns bigint language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); new_id bigint; b text:=trim(p_body);
begin
if length(b) not between 1 and 1500 or not public.connect_member(p_room,u) then raise exception 'Not an active room member';end if;
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
insert into public.connect_signals(room_id,sender,recipient,kind,payload) values(p_room,u,p_target,p_kind,coalesce(p_payload,'{}'::jsonb)) returning id into new_id;
return new_id;
end $$;

revoke all on function public.connect_register(text,text,boolean),public.connect_find_people(text),public.connect_friend_request(uuid),public.connect_friend_action(uuid,text),public.connect_block(uuid,boolean),public.connect_send_message(uuid,text),public.connect_create_room(text,text),public.connect_join_room(uuid,text),public.connect_leave_room(uuid),public.connect_end_room(uuid,uuid),public.connect_room_message(uuid,text),public.connect_signal(uuid,uuid,text,jsonb) from public;
grant execute on function public.connect_register(text,text,boolean),public.connect_find_people(text),public.connect_friend_request(uuid),public.connect_friend_action(uuid,text),public.connect_block(uuid,boolean),public.connect_send_message(uuid,text),public.connect_create_room(text,text),public.connect_join_room(uuid,text),public.connect_leave_room(uuid),public.connect_end_room(uuid,uuid),public.connect_room_message(uuid,text),public.connect_signal(uuid,uuid,text,jsonb) to authenticated;
