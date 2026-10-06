-- SCHOLARK r218 MFA/RLS initPlan correction.
-- Explicitly wrap every auth helper with SELECT so Postgres can evaluate
-- uncorrelated auth state once per statement instead of once per candidate row.

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
        'create policy %I on public.%I as restrictive to authenticated using (
          not exists (
            select 1 from auth.mfa_factors mf
            where mf.user_id = (select auth.uid()) and mf.status = ''verified''
          )
          or coalesce((select auth.jwt()->>''aal''),''aal1'') = ''aal2''
        ) with check (
          not exists (
            select 1 from auth.mfa_factors mf
            where mf.user_id = (select auth.uid()) and mf.status = ''verified''
          )
          or coalesce((select auth.jwt()->>''aal''),''aal1'') = ''aal2''
        )',
        'scholark_mfa_opt_in_guard', t
      );
    end if;
  end loop;
end $$;
