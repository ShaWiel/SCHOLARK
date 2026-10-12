alter table public.connect_identities alter column searchable set default false;
-- Private-by-default applies to new profiles. Existing users keep their explicit choice.