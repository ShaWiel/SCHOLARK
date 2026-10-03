create or replace function public.delete_scholark_user_data(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = 'public','pg_temp'
as $$
declare
  deleted_total bigint := 0;
  n bigint := 0;
begin
  if p_user_id is null then
    raise exception 'user id required';
  end if;

  delete from public.project_comments where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.project_collaborators where member_user_id=p_user_id or owner_user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.project_invites where owner_user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.project_versions where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.shared_artifacts where owner_user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.published_webpages where owner_user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;

  delete from public.ai_messages where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.ai_chats where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.spaced_reviews where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.mastery_topics where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.planner_tasks where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.goals where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.quiz_results where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.study_ahead where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.language_learning_progress where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;

  delete from public.documents where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.presentations where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.user_files where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.projects where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;

  delete from public.client_errors where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.usage_events where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.feedback_submissions where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.credit_request_ids where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.credit_purchases where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.credit_ledger where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.credit_wallets where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.billing_events where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.billing_subscriptions where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;
  delete from public.profiles where user_id=p_user_id; get diagnostics n = row_count; deleted_total := deleted_total+n;

  return jsonb_build_object('ok',true,'deleted_rows',deleted_total);
end;
$$;