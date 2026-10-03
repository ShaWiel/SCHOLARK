-- Defense in depth: user-owned RLS policies should target authenticated explicitly.
alter policy "own_rows" on public.ai_chats to authenticated;
alter policy "own_rows" on public.ai_messages to authenticated;
alter policy "insert_errors" on public.client_errors to authenticated;
alter policy "own_errors" on public.client_errors to authenticated;
alter policy "ledger_read_own" on public.credit_ledger to authenticated;
alter policy "wallet_read_own" on public.credit_wallets to authenticated;
alter policy "own_rows" on public.documents to authenticated;
alter policy "own_rows" on public.goals to authenticated;
alter policy "own_rows" on public.mastery_topics to authenticated;
alter policy "own_rows" on public.planner_tasks to authenticated;
alter policy "own_rows" on public.presentations to authenticated;
alter policy "own_rows" on public.profiles to authenticated;
alter policy "own_rows" on public.quiz_results to authenticated;
alter policy "own_rows" on public.spaced_reviews to authenticated;
alter policy "own_rows" on public.study_ahead to authenticated;
alter policy "own_usage" on public.usage_events to authenticated;
alter policy "own_rows" on public.user_files to authenticated;
