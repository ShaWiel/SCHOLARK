-- SCHOLARK r218 MFA/RLS performance optimization.
-- Keeps the r217 opt-in MFA gate semantics while evaluating the uncorrelated
-- MFA/JWT predicate once per statement via an initPlan-friendly scalar SELECT.

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
          (select
            not exists (
              select 1 from auth.mfa_factors mf
              where mf.user_id = auth.uid() and mf.status = ''verified''
            )
            or coalesce(auth.jwt()->>''aal'',''aal1'') = ''aal2''
          )
        ) with check (
          (select
            not exists (
              select 1 from auth.mfa_factors mf
              where mf.user_id = auth.uid() and mf.status = ''verified''
            )
            or coalesce(auth.jwt()->>''aal'',''aal1'') = ''aal2''
          )
        )',
        'scholark_mfa_opt_in_guard', t
      );
    end if;
  end loop;
end $$;
