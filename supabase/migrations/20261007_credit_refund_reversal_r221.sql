create or replace function public.reverse_credit_topup_full(
  p_user_id uuid,
  p_transaction_id text,
  p_event_id text,
  p_refund_amount_cents integer,
  p_reason text default 'refund'
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  purchase public.credit_purchases%rowtype;
  wallet public.credit_wallets%rowtype;
  reverse_amount numeric;
  unrecovered numeric;
begin
  if p_user_id is null then raise exception 'invalid_user'; end if;
  if p_transaction_id !~ '^txn_[a-z0-9]{26}$' then raise exception 'invalid_transaction_id'; end if;
  if coalesce(p_refund_amount_cents,0) <= 0 then raise exception 'invalid_refund_amount'; end if;
  perform pg_advisory_xact_lock(hashtextextended('credit_refund:'||p_transaction_id,0));
  select * into purchase from public.credit_purchases where transaction_id=p_transaction_id for update;
  if purchase.transaction_id is null then return jsonb_build_object('ok',false,'code','PURCHASE_NOT_FOUND'); end if;
  if purchase.user_id<>p_user_id then return jsonb_build_object('ok',false,'code','OWNER_MISMATCH'); end if;
  if purchase.status='refunded' then
    select * into wallet from public.credit_wallets where user_id=p_user_id;
    return jsonb_build_object('ok',true,'idempotent',true,'credits_reversed',0,'unrecovered',0,'balance',coalesce(wallet.balance,0));
  end if;
  if p_refund_amount_cents < purchase.amount_cents then
    return jsonb_build_object('ok',false,'code','PARTIAL_REFUND_REVIEW_REQUIRED','refund_amount_cents',p_refund_amount_cents,'purchase_amount_cents',purchase.amount_cents);
  end if;
  select * into wallet from public.credit_wallets where user_id=p_user_id for update;
  if wallet.user_id is null then
    update public.credit_purchases set status='refunded' where transaction_id=p_transaction_id;
    return jsonb_build_object('ok',true,'idempotent',false,'credits_reversed',0,'unrecovered',purchase.credits,'balance',0);
  end if;
  reverse_amount := least(greatest(coalesce(wallet.topup_balance,0),0), greatest(coalesce(purchase.credits,0),0));
  unrecovered := greatest(coalesce(purchase.credits,0)-reverse_amount,0);
  update public.credit_wallets
  set topup_balance=greatest(coalesce(topup_balance,0)-reverse_amount,0),
      balance=greatest(coalesce(monthly_balance,0),0)+greatest(coalesce(topup_balance,0)-reverse_amount,0),
      updated_at=now()
  where user_id=p_user_id
  returning * into wallet;
  update public.credit_purchases set status='refunded' where transaction_id=p_transaction_id;
  insert into public.credit_ledger(user_id,delta,reason,feature,meta)
  values(p_user_id,-reverse_amount,'credit_refund','credit_store',jsonb_build_object(
    'transaction_id',p_transaction_id,'event_id',coalesce(p_event_id,''),'reason',coalesce(p_reason,'refund'),
    'purchase_credits',purchase.credits,'credits_reversed',reverse_amount,'unrecovered',unrecovered,'refund_amount_cents',p_refund_amount_cents
  ));
  return jsonb_build_object('ok',true,'idempotent',false,'transaction_id',p_transaction_id,'credits_reversed',reverse_amount,'unrecovered',unrecovered,'balance',coalesce(wallet.balance,0),'monthly_balance',coalesce(wallet.monthly_balance,0),'topup_balance',coalesce(wallet.topup_balance,0));
end
$$;

revoke all on function public.reverse_credit_topup_full(uuid,text,text,integer,text) from public, anon, authenticated;
grant execute on function public.reverse_credit_topup_full(uuid,text,text,integer,text) to service_role;
