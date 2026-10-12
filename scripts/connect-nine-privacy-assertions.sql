-- Isolated r260/r261 behavioral checks; any failed assertion stops CI.
do $qa$
declare
  n integer; members integer; matches integer; attempts integer;
  room_id uuid:='10000000-0000-4000-8000-000000000001';
  uid uuid; ninth_denied boolean:=false; tenth_denied boolean:=false;
  kicked_denied boolean:=false; quota_denied boolean:=false; cap_denied boolean:=false;
  private_invite_denied boolean:=false;
begin
  -- Existing rooms must retain four seats; new rooms default to nine.
  if (select max_participants from public.connect_rooms where id=room_id)<>4 then
    raise exception 'Existing four-seat room cap was silently changed';
  end if;
  if (select column_default from information_schema.columns where table_schema='public' and table_name='connect_rooms' and column_name='max_participants')<>'9' then
    raise exception 'New room default not nine';
  end if;
  insert into public.connect_rooms(id,owner_id,title,kind,invite_code)
    values('10000000-0000-4000-8000-000000000009','00000000-0000-4000-8000-000000000001','Nine seats','meeting',repeat('b',40));
  room_id:='10000000-0000-4000-8000-000000000009';
  insert into public.connect_room_members(room_id,user_id)
    values(room_id,'00000000-0000-4000-8000-000000000001');

  for n in 2..9 loop
    uid:=('00000000-0000-4000-8000-'||lpad(n::text,12,'0'))::uuid;
    perform set_config('request.jwt.claim.sub',uid::text,true);
    perform public.connect_join_room(room_id,repeat('b',40));
  end loop;
  -- Qualified query below avoids SQL ambiguous var names.
  select count(*) into members from public.connect_room_members m where m.room_id='10000000-0000-4000-8000-000000000009' and m.left_at is null;
  if members<>9 then raise exception 'Expected nine admitted members, found %',members;end if;

  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000010',true);
  begin
    perform public.connect_join_room(room_id,repeat('b',40));
  exception when others then
    if sqlerrm like 'Meeting full%' then tenth_denied:=true; else raise;end if;
  end;
  if not tenth_denied then raise exception '10th participant was admitted';end if;

  -- Host kick must prevent returning with the original link.
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
  perform public.connect_end_room(room_id,'00000000-0000-4000-8000-000000000009');
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000009',true);
  begin
    perform public.connect_join_room(room_id,repeat('b',40));
  exception when others then
    if sqlerrm like 'The host removed%' then kicked_denied:=true; else raise;end if;
  end;
  if not kicked_denied then raise exception 'Removed participant rejoined with old link';end if;

  -- Screen share permits one active participant and renew/release.
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
  if not public.connect_screen_share(room_id,'claim') then raise exception 'Host could not claim screen';end if;
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000002',true);
  if public.connect_screen_share(room_id,'claim') then raise exception 'Second simultaneous sharer accepted';end if;
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
  if not public.connect_screen_share(room_id,'renew') or not public.connect_screen_share(room_id,'release') then
    raise exception 'Screen lease renew/release failed';
  end if;
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000002',true);
  if not public.connect_screen_share(room_id,'claim') then raise exception 'New sharer blocked after release';end if;

  -- Explicit consent is OFF until target opts in.
  if (select contact_discovery_enabled from public.connect_identities where user_id='00000000-0000-4000-8000-000000000013') then
    raise exception 'Contact discovery must default off';
  end if;
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000011',true);
  select count(*) into matches from public.connect_find_contacts(array['person13@example.test'],array[]::text[]);
  if matches<>0 then raise exception 'Found a profile without explicit consent';end if;
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000013',true);
  if not public.connect_set_contact_discovery(true) then raise exception 'Could not enable opt-in';end if;
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000011',true);
  select count(*) into matches from public.connect_find_contacts(array['person13@example.test'],array[]::text[]);
  if matches<>1 then raise exception 'Did not find confirmed and opted-in email';end if;

  -- Unverified target email must not match despite opt-in.
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000012',true);
  perform public.connect_set_contact_discovery(true);
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000011',true);
  select count(*) into matches from public.connect_find_contacts(array['person12@example.test'],array[]::text[]);
  if matches<>0 then raise exception 'Unverified target email was disclosed';end if;

  -- Private contact-only profiles cannot be friended by UUID guessing.
  delete from public.connect_contact_lookup_quota;
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000015',true);
  perform public.connect_set_contact_discovery(true);
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000011',true);
  begin
    perform public.connect_friend_request('00000000-0000-4000-8000-000000000015');
  exception when others then
    if sqlerrm like 'Person not available%' then private_invite_denied:=true;else raise;end if;
  end;
  if not private_invite_denied then raise exception 'Private profile request did not require a contacts match';end if;
  select count(*) into matches from public.connect_find_contacts(
    array[]::text[],array['+5978110015']::text[]);
  if matches<>1 then raise exception 'Verified opted-in phone not found';end if;
  if public.connect_friend_request('00000000-0000-4000-8000-000000000015') is null then
    raise exception 'Recent verified contact was not addable';
  end if;
  if not exists(select 1 from public.connect_contact_match_grants g
      where g.requester='00000000-0000-4000-8000-000000000011'
        and g.target='00000000-0000-4000-8000-000000000015'
        and g.expires_at>now()) then
    raise exception 'Private contacts match grant missing';
  end if;
  if not (select relrowsecurity from pg_class where oid='public.connect_contact_match_grants'::regclass) then
    raise exception 'Contacts match grants not private';
  end if;

  -- Reset QA quota (simulating next day) for additional security cases.
  delete from public.connect_contact_lookup_quota;
  insert into public.connect_blocks(blocker,blocked)
    values('00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000013');
  select count(*) into matches from public.connect_find_contacts(array['person13@example.test'],array[]::text[]);
  if matches<>0 then raise exception 'Blocked profile leaked via contact matching';end if;
  delete from public.connect_blocks;
  insert into public.connect_friends(requester,recipient,status)
    values('00000000-0000-4000-8000-000000000011','00000000-0000-4000-8000-000000000013','pending');
  select count(*) into matches from public.connect_find_contacts(array['person13@example.test'],array[]::text[]);
  if matches<>0 then raise exception 'Existing pending friend was suggested again';end if;
  delete from public.connect_friends;

  -- Verify revocation is immediate.
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000013',true);
  perform public.connect_set_contact_discovery(false);
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000011',true);
  select count(*) into matches from public.connect_find_contacts(array['person13@example.test'],array[]::text[]);
  if matches<>0 then raise exception 'Opt-out did not take effect';end if;

  -- At most 3 lookups per day/account.
  delete from public.connect_contact_lookup_quota;
  for n in 1..3 loop
    select count(*) into matches from public.connect_find_contacts(array['person13@example.test'],array[]::text[]);
  end loop;
  begin
    select count(*) into matches from public.connect_find_contacts(array['person13@example.test'],array[]::text[]);
  exception when others then
    if sqlerrm like 'Daily contacts search limit%' then quota_denied:=true; else raise; end if;
  end;
  if not quota_denied then raise exception 'Contact enumeration rate limit failed';end if;
  select q.attempts into attempts from public.connect_contact_lookup_quota q where q.user_id='00000000-0000-4000-8000-000000000011';
  if attempts<>3 then raise exception 'Contact lookup quota counted % attempts, expected three',attempts;end if;

  -- A client cannot request all matches in a giant batch.
  delete from public.connect_contact_lookup_quota;
  begin
    select count(*) into matches from public.connect_find_contacts(array_fill('person13@example.test'::text,array[31]),array[]::text[]);
  exception when others then
    if sqlerrm like 'Select up to 30%' then cap_denied:=true;else raise;end if;
  end;
  if not cap_denied then raise exception '31 identifiers were not rejected';end if;

  -- Returned data must NOT contain contact email/phone; quota table stores none.
  if exists(select 1 from information_schema.columns where table_schema='public'
    and table_name='connect_contact_lookup_quota' and column_name in ('email','phone','raw_contact','contact_name')) then
    raise exception 'Contact identifiers saved in quota table';
  end if;
  if exists(select 1 from information_schema.columns where table_schema='public'
    and table_name='connect_identities' and column_name='email') then
    raise exception 'Raw email unexpectedly added to searchable profile';
  end if;
  if not (select relrowsecurity from pg_class where oid='public.connect_contact_lookup_quota'::regclass) then
    raise exception 'Contact quota table has RLS disabled';
  end if;
  raise notice 'CONNECT 9+CONTACT PRIVACY QA PASS: 9 admitted, 10 denied, kicked user rejected, single sharer, verified opt-in, private invitation grant, block, revocation, rate limit';
end $qa$;
