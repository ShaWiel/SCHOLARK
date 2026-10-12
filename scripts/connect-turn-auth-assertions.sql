-- Isolated PostgreSQL TURN authorization checks; never run on real accounts.
do $turn$
declare
  granted boolean;
  n integer;
  room uuid := '10000000-0000-4000-8000-000000000009';
  host uuid := '00000000-0000-4000-8000-000000000001';
begin
  if not (select relrowsecurity from pg_class where oid='public.connect_turn_issuance_windows'::regclass) then
    raise exception 'TURN issuance quota RLS is disabled';
  end if;
  if has_table_privilege('authenticated','public.connect_turn_issuance_windows','SELECT') then
    raise exception 'Authenticated users must not read issuance quota';
  end if;
  if has_function_privilege('anon','public.connect_turn_issue_allowed(uuid)','EXECUTE') then
    raise exception 'Anonymous user has TURN authorization rights';
  end if;
  if not has_function_privilege('authenticated','public.connect_turn_issue_allowed(uuid)','EXECUTE') then
    raise exception 'Authenticated caller cannot request TURN';
  end if;

  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000010',true);
  if public.connect_turn_issue_allowed(room) then
    raise exception 'Non-member received TURN credentials';
  end if;
  perform set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000009',true);
  if public.connect_turn_issue_allowed(room) then
    raise exception 'Kicked participant received TURN credentials';
  end if;

  perform set_config('request.jwt.claim.sub',host::text,true);
  for n in 1..20 loop
    if not public.connect_turn_issue_allowed(room) then
      raise exception 'Valid member denied TURN request %',n;
    end if;
  end loop;
  if public.connect_turn_issue_allowed(room) then
    raise exception 'TURN request rate limit failed';
  end if;
  if (select grants from public.connect_turn_issuance_windows
    where user_id=host and window_start=date_trunc('hour',now())) <> 20 then
    raise exception 'TURN quota tracking inconsistent';
  end if;

  delete from public.connect_turn_issuance_windows where user_id=host;
  update public.connect_rooms set active=false where id=room;
  if public.connect_turn_issue_allowed(room) then
    raise exception 'Ended room still receives TURN access';
  end if;
  raise notice 'CONNECT TURN SECURITY QA PASS: private gate, 20/hour cap, kicked/non-members/ended rejected';
end $turn$;
