-- Connect r261: consent-based contact discovery, with NO persistent address-book import.
-- Only the identifiers explicitly selected by a signed-in user are compared inside
-- a SECURITY DEFINER RPC. The raw inputs and unmatched contacts are never stored.
-- A match requires verified Supabase Auth email/phone AND target opt-in.

alter table public.connect_identities
  add column if not exists contact_discovery_enabled boolean not null default false;

create table if not exists public.connect_contact_lookup_quota (
  user_id uuid not null references auth.users(id) on delete cascade,
  lookup_day date not null,
  attempts smallint not null default 0 check(attempts between 0 and 3),
  primary key(user_id,lookup_day)
);
alter table public.connect_contact_lookup_quota enable row level security;
revoke all on public.connect_contact_lookup_quota from public,anon,authenticated;

create or replace function public.connect_set_contact_discovery(p_enabled boolean)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare caller_id uuid:=auth.uid();
begin
  if caller_id is null or p_enabled is null then raise exception 'Sign in and choose a contact visibility setting';end if;
  update public.connect_identities
    set contact_discovery_enabled=p_enabled where user_id=caller_id;
  if not found then raise exception 'Create your Connect profile first';end if;
  return p_enabled;
end $$;
revoke all on function public.connect_set_contact_discovery(boolean) from public,anon;
grant execute on function public.connect_set_contact_discovery(boolean) to authenticated;

-- SECURITY: only a bounded collection of exact, verified email/phone identifiers.
-- No partial matching, no public auth user enumeration, no raw contact storage.
-- Combined input limit: 30 identifiers/request, 3 requests/day/account.
create or replace function public.connect_find_contacts(
  p_emails text[] default '{}'::text[],
  p_phones text[] default '{}'::text[]
)
returns table(user_id uuid,handle text,display_name text)
language plpgsql security definer set search_path=public,pg_temp as $$
declare
  caller_id uuid:=auth.uid();
  email_values text[];
  phone_values text[];
  hits smallint;
  today_utc date:=(now() at time zone 'UTC')::date;
begin
  if caller_id is null then raise exception 'Sign in required';end if;
  if not exists(select 1 from public.connect_identities i where i.user_id=caller_id) then
    raise exception 'Create your Connect profile first';
  end if;
  if not exists(select 1 from auth.users u where u.id=caller_id
       and (u.email_confirmed_at is not null or u.phone_confirmed_at is not null)) then
    raise exception 'Verify your SCHOLAVERUM account before searching contacts';
  end if;
  if coalesce(cardinality(p_emails),0)+coalesce(cardinality(p_phones),0)>30 then
    raise exception 'Select up to 30 email addresses or phone numbers per search';
  end if;
  select coalesce(array_agg(distinct lower(btrim(t))),array[]::text[])
    into email_values from unnest(coalesce(p_emails,array[]::text[])) t
    where length(btrim(t)) between 6 and 254
      and btrim(t) ~* '^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$';
  select coalesce(array_agg(distinct btrim(t)),array[]::text[])
    into phone_values from unnest(coalesce(p_phones,array[]::text[])) t
    where btrim(t) ~ '^\+[1-9][0-9]{7,14}$';
  if cardinality(email_values)+cardinality(phone_values)=0 then
    raise exception 'Choose a contact with an email address or international phone number';
  end if;

  insert into public.connect_contact_lookup_quota(user_id,lookup_day,attempts)
    values(caller_id,today_utc,1)
  on conflict(user_id,lookup_day) do update
    set attempts=public.connect_contact_lookup_quota.attempts+1
    where public.connect_contact_lookup_quota.attempts<3
  returning attempts into hits;
  if hits is null then raise exception 'Daily contacts search limit reached. Try again tomorrow';end if;

  return query
    select i.user_id,i.handle,i.display_name
    from public.connect_identities i
    join auth.users u on u.id=i.user_id
    where i.contact_discovery_enabled is true
      and i.user_id<>caller_id
      and (
        (u.email_confirmed_at is not null and lower(btrim(u.email))=any(email_values))
        or (u.phone_confirmed_at is not null and btrim(u.phone)=any(phone_values))
      )
      and not exists(
        select 1 from public.connect_blocks b
        where (b.blocker=caller_id and b.blocked=i.user_id)
           or (b.blocked=caller_id and b.blocker=i.user_id)
      )
      and not exists(
        select 1 from public.connect_friends f
        where (f.requester=caller_id and f.recipient=i.user_id)
           or (f.recipient=caller_id and f.requester=i.user_id)
      )
    order by i.handle limit 30;
end $$;
revoke all on function public.connect_find_contacts(text[],text[]) from public,anon;
grant execute on function public.connect_find_contacts(text[],text[]) to authenticated;

-- Allow a user with contact discovery explicitly enabled to receive a friend
-- request after someone discovers them; keep friend request throttling/blocks.
create or replace function public.connect_friend_request(p_target uuid)
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); out_id uuid;
begin
  if u is null then raise exception 'Sign in required';end if;
  if (select count(*) from public.connect_friends where requester=u
      and created_at>now()-interval '1 hour')>=16 then
    raise exception 'Too many friend requests. Try again later';
  end if;
  if p_target=u or not exists(
      select 1 from public.connect_identities
      where user_id=p_target and (searchable or contact_discovery_enabled)
    ) then raise exception 'Person not available';end if;
  if exists(select 1 from public.connect_blocks where
      (blocker=u and blocked=p_target) or (blocker=p_target and blocked=u)) then
    raise exception 'Friend request unavailable';
  end if;
  select id into out_id from public.connect_friends where
    (requester=u and recipient=p_target) or (recipient=u and requester=p_target);
  if out_id is null then
    insert into public.connect_friends(requester,recipient)
      values(u,p_target) returning id into out_id;
  end if;
  return out_id;
end $$;
revoke all on function public.connect_friend_request(uuid) from public,anon;
grant execute on function public.connect_friend_request(uuid) to authenticated;
