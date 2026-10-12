-- SCHOLAVERUM Connect: authenticated read needs table grant AND row-level access.
-- Keep identities invisible to anonymous visitors; RLS limits signed-in lookup
-- to own profile, explicitly searchable profiles, friends and current co-members.
grant select on table public.connect_identities to authenticated;
revoke all on table public.connect_identities from anon;
