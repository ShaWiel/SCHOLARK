-- SCHOLARK r218 MFA/RLS documented opt-in form.
-- Mirrors Supabase's documented optional-MFA policy shape so auth helpers
-- are statement-initialized and verified-factor lookup remains restrictive.

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
          array[(select auth.jwt()->>''aal'')] <@ (
            select case
              when count(id) > 0 then array[''aal2'']
              else array[''aal1'',''aal2'']
            end
            from auth.mfa_factors
            where ((select auth.uid()) = user_id) and status = ''verified''
          )
        ) with check (
          array[(select auth.jwt()->>''aal'')] <@ (
            select case
              when count(id) > 0 then array[''aal2'']
              else array[''aal1'',''aal2'']
            end
            from auth.mfa_factors
            where ((select auth.uid()) = user_id) and status = ''verified''
          )
        )',
        'scholark_mfa_opt_in_guard', t
      );
    end if;
  end loop;
end $$;
