-- SCHOLARK r218 MFA/RLS cached private gate.
-- The policy calls one STABLE private function through a scalar SELECT.
-- The function is SECURITY DEFINER only so authenticated clients never receive
-- direct privileges on auth.mfa_factors; search_path is pinned to empty.

create schema if not exists scholark_private;

create or replace function scholark_private.mfa_access_allowed()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    array[(select auth.jwt()->>'aal')] <@ (
      select case
        when count(id) > 0 then array['aal2']
        else array['aal1','aal2']
      end
      from auth.mfa_factors
      where user_id = (select auth.uid())
        and status = 'verified'
    );
$$;

revoke all on function scholark_private.mfa_access_allowed() from public;
revoke all on function scholark_private.mfa_access_allowed() from anon;
grant execute on function scholark_private.mfa_access_allowed() to authenticated, service_role;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','goals','planner_tasks','projects','ai_chats','ai_messages','quiz_results',
    'mastery_topics','spaced_reviews','study_ahead','documents','presentations','user_files',
    'language_learning_progress','credit_wallets','credit_purchases'
  ]
  loop
    if to_regclass('public.'||quote_ident(t)) is not null then
      execute format('drop policy if exists %I on public.%I', 'scholark_mfa_opt_in_guard', t);
      execute format(
        'create policy %I on public.%I as restrictive to authenticated
          using ((select scholark_private.mfa_access_allowed()) is true)
          with check ((select scholark_private.mfa_access_allowed()) is true)',
        'scholark_mfa_opt_in_guard', t
      );
    end if;
  end loop;
end $$;

comment on function scholark_private.mfa_access_allowed() is
  'SCHOLARK optional-MFA RLS gate. Private STABLE function; aal2 required only when the current user has a verified MFA factor.';
