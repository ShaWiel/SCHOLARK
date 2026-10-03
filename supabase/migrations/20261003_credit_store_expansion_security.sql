-- Credit Store expansion + least-privilege hardening.
-- Keep one-time top-up fulfillment server-controlled and make the public Data API surface explicit.

create or replace function public.apply_credit_topup(
  p_user_id uuid,
  p_transaction_id text,
  p_pack text,
  p_credits numeric,
  p_amount_cents integer,
  p_currency text default 'USD'
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  w public.credit_wallets%rowtype;
  existing public.credit_purchases%rowtype;
  allowance numeric;
  previous_monthly numeric;
  total numeric;
begin
  if p_user_id is null then raise exception 'invalid_user'; end if;
  if p_transaction_id !~ '^txn_[a-z0-9]{26}$' then raise exception 'invalid_transaction_id'; end if;
  if upper(coalesce(p_currency,'')) <> 'USD' then raise exception 'invalid_currency'; end if;

  if not (
    (p_pack='mini' and p_credits=100 and p_amount_cents=299)
    or (p_pack='starter' and p_credits=250 and p_amount_cents=699)
    or (p_pack='boost' and p_credits=750 and p_amount_cents=1699)
    or (p_pack='power' and p_credits=1500 and p_amount_cents=2999)
    or (p_pack='max' and p_credits=3000 and p_amount_cents=4999)
    or (p_pack='ultra' and p_credits=7500 and p_amount_cents=9999)
  ) then
    raise exception 'invalid_credit_pack';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('credit_topup:'||p_transaction_id,0));

  select * into existing
  from public.credit_purchases
  where transaction_id=p_transaction_id;

  if existing.transaction_id is not null then
    if existing.user_id<>p_user_id or existing.pack<>p_pack or existing.credits<>p_credits or existing.amount_cents<>p_amount_cents then
      raise exception 'credit_purchase_mismatch';
    end if;
    select * into w from public.credit_wallets where user_id=p_user_id;
    return jsonb_build_object(
      'ok',true,
      'idempotent',true,
      'transaction_id',p_transaction_id,
      'credits_added',0,
      'balance',coalesce(w.balance,0),
      'monthly_balance',coalesce(w.monthly_balance,0),
      'topup_balance',coalesce(w.topup_balance,0)
    );
  end if;

  select * into w from public.credit_wallets where user_id=p_user_id for update;
  if w.user_id is null then
    insert into public.credit_wallets(user_id,balance,monthly_balance,topup_balance,plan,monthly_allowance,cycle_started_at)
    values(p_user_id,30,30,0,'free',30,now())
    returning * into w;
  end if;

  allowance := public.plan_credit_allowance(w.plan);

  if w.cycle_started_at + interval '1 month' <= now() then
    previous_monthly := greatest(coalesce(w.monthly_balance,0),0);
    update public.credit_wallets
    set monthly_balance=allowance,
        monthly_allowance=allowance,
        balance=allowance+greatest(coalesce(topup_balance,0),0),
        cycle_started_at=now(),
        updated_at=now()
    where user_id=p_user_id
    returning * into w;

    insert into public.credit_ledger(user_id,delta,reason,feature,meta)
    values(
      p_user_id,
      allowance-previous_monthly,
      'monthly_cycle_reset',
      'monthly_allowance',
      jsonb_build_object(
        'plan',w.plan,
        'allowance',allowance,
        'expired_monthly',previous_monthly,
        'topup_preserved',w.topup_balance
      )
    );
  end if;

  insert into public.credit_purchases(transaction_id,user_id,pack,credits,amount_cents,currency_code,status)
  values(p_transaction_id,p_user_id,p_pack,p_credits,p_amount_cents,'USD','completed');

  update public.credit_wallets
  set topup_balance=greatest(coalesce(topup_balance,0),0)+p_credits,
      balance=greatest(coalesce(monthly_balance,0),0)+greatest(coalesce(topup_balance,0),0)+p_credits,
      updated_at=now()
  where user_id=p_user_id
  returning * into w;

  insert into public.credit_ledger(user_id,delta,reason,feature,meta)
  values(
    p_user_id,
    p_credits,
    'credit_topup',
    'credit_store',
    jsonb_build_object(
      'transaction_id',p_transaction_id,
      'pack',p_pack,
      'amount_cents',p_amount_cents,
      'currency','USD'
    )
  );

  total := greatest(coalesce(w.monthly_balance,0),0)+greatest(coalesce(w.topup_balance,0),0);

  return jsonb_build_object(
    'ok',true,
    'idempotent',false,
    'transaction_id',p_transaction_id,
    'credits_added',p_credits,
    'balance',total,
    'monthly_balance',w.monthly_balance,
    'topup_balance',w.topup_balance
  );
end
$$;

-- Security-definer functions must not resolve application objects through a mutable search path.
alter function public.handle_new_user() set search_path = '';
alter function public.delete_scholark_user_data(uuid) set search_path = '';
alter function public.consume_credits(numeric,text,jsonb) set search_path = '';
alter function scholark_private.consume_feature_credits_internal(text,jsonb) set search_path = '';
alter function scholark_private.consume_feature_credits_once_internal(text,text,jsonb) set search_path = '';
alter function public.consume_feature_credits(text,jsonb) set search_path = '';
alter function public.consume_feature_credits_once(text,text,jsonb) set search_path = '';

-- Existing public tables: remove inherited blanket privileges first.
revoke all privileges on all tables in schema public from anon;
revoke all privileges on all tables in schema public from authenticated;

-- Anonymous surface: public catalog/search/share reads only.
grant select on table public.ai_feature_costs to anon;
grant select on table public.schools to anon;
grant select on table public.published_webpages to anon;
grant select on table public.shared_artifacts to anon;

-- Authenticated user-owned CRUD.
grant select,insert,update,delete on table
  public.ai_chats,
  public.ai_messages,
  public.documents,
  public.goals,
  public.language_learning_progress,
  public.mastery_topics,
  public.planner_tasks,
  public.presentations,
  public.profiles,
  public.projects,
  public.quiz_results,
  public.shared_artifacts,
  public.spaced_reviews,
  public.study_ahead,
  public.user_files
to authenticated;

grant select,insert,delete on table public.project_collaborators to authenticated;
grant select,insert,update,delete on table public.project_comments to authenticated;
grant select,insert,update,delete on table public.project_invites to authenticated;
grant select,insert,delete on table public.project_versions to authenticated;
grant select,insert,update,delete on table public.published_webpages to authenticated;

-- Read-only / append-only operational surfaces.
grant select on table public.ai_feature_costs to authenticated;
grant select on table public.billing_subscriptions to authenticated;
grant select,insert on table public.client_errors to authenticated;
grant select on table public.credit_ledger to authenticated;
grant select on table public.credit_purchases to authenticated;
grant select on table public.credit_request_ids to authenticated;
grant select on table public.credit_wallets to authenticated;
grant select,insert,delete on table public.feedback_submissions to authenticated;
grant select on table public.schools to authenticated;
grant select on table public.usage_events to authenticated;

-- Explicitly no client access to provider event records.
revoke all privileges on table public.billing_events from anon,authenticated;

-- Functions: opt-in only. Service-role privileges are intentionally left intact.
revoke execute on all functions in schema public from public,anon,authenticated;

grant execute on function public.plan_credit_allowance(text) to anon,authenticated;
grant execute on function public.search_schools(text,text,text,text,integer) to anon,authenticated;

grant execute on function public.consume_feature_credits(text,jsonb) to authenticated;
grant execute on function public.consume_feature_credits_once(text,text,jsonb) to authenticated;
grant execute on function public.dashboard_summary() to authenticated;
grant execute on function public.publish_shared_artifact(uuid,text,text,jsonb) to authenticated;
grant execute on function public.publish_webpage(uuid,text,text,text) to authenticated;
grant execute on function public.record_practice(text,text,boolean,text) to authenticated;
grant execute on function public.save_cloud_project(text,text,text,text,jsonb,boolean) to authenticated;
grant execute on function public.sync_due_reviews_to_planner() to authenticated;
grant execute on function public.unpublish_shared_artifact(uuid) to authenticated;
grant execute on function public.unpublish_webpage(uuid) to authenticated;

-- Prevent future public-schema objects from silently inheriting broad client privileges.
alter default privileges for role postgres in schema public revoke all on tables from anon,authenticated;
alter default privileges for role postgres in schema public revoke execute on functions from public,anon,authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon,authenticated;
