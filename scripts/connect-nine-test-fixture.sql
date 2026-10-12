-- QA-only, isolated PostgreSQL fixture. NOT a production migration.
create schema auth;
create role anon nologin;
create role authenticated nologin;
create table auth.users(
  id uuid primary key, email text, email_confirmed_at timestamptz,
  phone text, phone_confirmed_at timestamptz
);
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
create table public.connect_identities(
  user_id uuid primary key references auth.users(id),handle text not null,
  display_name text not null,searchable boolean not null default false
);
create table public.connect_rooms(
  id uuid primary key,owner_id uuid references auth.users(id),
  title text not null,kind text not null,invite_code text not null,
  active boolean not null default true,expires_at timestamptz not null default now()+interval '12 hours',
  max_participants integer not null default 4 constraint connect_rooms_max_participants_check check(max_participants between 2 and 4)
);
create table public.connect_room_members(
  room_id uuid references public.connect_rooms(id),user_id uuid references auth.users(id),
  joined_at timestamptz default now(),left_at timestamptz,
  primary key(room_id,user_id)
);
create table public.connect_friends(
  id uuid primary key default gen_random_uuid(),requester uuid,recipient uuid,
  status text default 'pending',created_at timestamptz default now()
);
create table public.connect_blocks(blocker uuid,blocked uuid,primary key(blocker,blocked));
create or replace function public.connect_member(p_room uuid,p_user uuid)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
  select exists(select 1 from public.connect_room_members m
    join public.connect_rooms r on r.id=m.room_id
    where m.room_id=p_room and m.user_id=p_user and m.left_at is null and r.active and r.expires_at>now())
$$;
insert into auth.users(id,email,email_confirmed_at,phone,phone_confirmed_at)
select ('00000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid,
       'person'||n||'@example.test',
       case when n=12 then null else now() end,
       '+597811'||lpad(n::text,4,'0'),
       case when n=15 then now() else null end
from generate_series(1,18) n;
insert into public.connect_identities(user_id,handle,display_name,searchable)
select id,'user_'||right(id::text,4),'Test '||right(id::text,4),false from auth.users;
insert into public.connect_rooms(id,owner_id,title,kind,invite_code,max_participants)
values('10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','Nine-way QA room','meeting',repeat('a',40),4);
insert into public.connect_room_members(room_id,user_id)
values('10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001');
