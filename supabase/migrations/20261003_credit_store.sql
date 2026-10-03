-- SCHOLARK Credit Store: persistent one-time top-up credits.
alter table public.credit_wallets
  add column if not exists monthly_balance numeric not null default 0,
  add column if not exists topup_balance numeric not null default 0;

update public.credit_wallets
set monthly_balance = greatest(balance,0),
    topup_balance = 0
where monthly_balance = 0
  and topup_balance = 0
  and balance > 0;

do $$
begin
  if not exists (select 1 from pg_constraint where conname='credit_wallets_monthly_balance_nonnegative') then
    alter table public.credit_wallets
      add constraint credit_wallets_monthly_balance_nonnegative check (monthly_balance >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname='credit_wallets_topup_balance_nonnegative') then
    alter table public.credit_wallets
      add constraint credit_wallets_topup_balance_nonnegative check (topup_balance >= 0);
  end if;
end $$;

create table if not exists public.credit_purchases (
  transaction_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  pack text not null,
  credits numeric not null check (credits > 0),
  amount_cents integer not null check (amount_cents > 0),
  currency_code text not null default 'USD',
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create index if not exists credit_purchases_user_created_idx
  on public.credit_purchases(user_id,created_at desc);

alter table public.credit_purchases enable row level security;
revoke all on table public.credit_purchases from anon, authenticated;
grant select on table public.credit_purchases to authenticated;
grant select,insert,update,delete on table public.credit_purchases to service_role;

drop policy if exists credit_purchases_read_own on public.credit_purchases;
create policy credit_purchases_read_own
  on public.credit_purchases
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = 'public','pg_temp'
as $$
begin
  insert into public.profiles(user_id, display_name)
  values(new.id, coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email,''),'@',1)))
  on conflict (user_id) do nothing;

  insert into public.credit_wallets(user_id,balance,monthly_balance,topup_balance,plan,monthly_allowance,cycle_started_at)
  values(new.id,30,30,0,'free',30,now())
  on conflict (user_id) do nothing;
  return new;
end
$$;

create or replace function public.consume_credits(
  p_amount numeric,
  p_feature text,
  p_meta jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = 'public','pg_temp'
as $$
declare
  uid uuid := auth.uid();
  w public.credit_wallets%rowtype;
  allowance numeric;
  available numeric;
  monthly_spent numeric;
  topup_spent numeric;
  new_monthly numeric;
  new_topup numeric;
  newbal numeric;
  previous_monthly numeric;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if p_amount <= 0 then raise exception 'invalid_amount'; end if;

  select * into w from public.credit_wallets where user_id=uid for update;
  if w.user_id is null then
    insert into public.credit_wallets(user_id,balance,monthly_balance,topup_balance,plan,monthly_allowance,cycle_started_at)
    values(uid,30,30,0,'free',30,now())
    returning * into w;
  end if;

  allowance := public.plan_credit_allowance(w.plan);

  if w.monthly_allowance is distinct from allowance then
    update public.credit_wallets
    set monthly_allowance=allowance, updated_at=now()
    where user_id=uid
    returning * into w;
  end if;

  if w.cycle_started_at + interval '1 month' <= now() then
    previous_monthly := greatest(coalesce(w.monthly_balance,0),0);
    update public.credit_wallets
      set monthly_balance=allowance,
          balance=allowance+greatest(coalesce(topup_balance,0),0),
          monthly_allowance=allowance,
          cycle_started_at=now(),
          updated_at=now()
      where user_id=uid
      returning * into w;

    insert into public.credit_ledger(user_id,delta,reason,feature,meta)
    values(
      uid,
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

  available := greatest(coalesce(w.monthly_balance,0),0) + greatest(coalesce(w.topup_balance,0),0);

  if w.balance is distinct from available then
    update public.credit_wallets
    set balance=available,updated_at=now()
    where user_id=uid
    returning * into w;
  end if;

  if available < p_amount then
    insert into public.usage_events(user_id,feature,event,success,credits,meta)
    values(
      uid,
      coalesce(nullif(p_feature,''),'unknown'),
      'blocked_insufficient_credits',
      false,
      0,
      coalesce(p_meta,'{}'::jsonb)
        || jsonb_build_object(
          'needed',p_amount,
          'balance',available,
          'monthly_balance',w.monthly_balance,
          'topup_balance',w.topup_balance
        )
    );
    return jsonb_build_object(
      'ok',false,
      'balance',available,
      'monthly_balance',w.monthly_balance,
      'topup_balance',w.topup_balance,
      'needed',p_amount,
      'code','insufficient_credits'
    );
  end if;

  monthly_spent := least(p_amount,greatest(coalesce(w.monthly_balance,0),0));
  topup_spent := p_amount-monthly_spent;
  new_monthly := greatest(coalesce(w.monthly_balance,0),0)-monthly_spent;
  new_topup := greatest(coalesce(w.topup_balance,0),0)-topup_spent;
  newbal := new_monthly+new_topup;

  update public.credit_wallets
  set monthly_balance=new_monthly,
      topup_balance=new_topup,
      balance=newbal,
      updated_at=now()
  where user_id=uid;

  insert into public.credit_ledger(user_id,delta,reason,feature,meta)
  values(
    uid,
    -p_amount,
    'usage',
    p_feature,
    coalesce(p_meta,'{}'::jsonb)
      || jsonb_build_object('monthly_spent',monthly_spent,'topup_spent',topup_spent)
  );

  insert into public.usage_events(user_id,feature,event,success,credits,meta)
  values(
    uid,
    coalesce(nullif(p_feature,''),'unknown'),
    'credit_consumed',
    true,
    p_amount,
    coalesce(p_meta,'{}'::jsonb)
      || jsonb_build_object('monthly_spent',monthly_spent,'topup_spent',topup_spent)
  );

  return jsonb_build_object(
    'ok',true,
    'balance',newbal,
    'monthly_balance',new_monthly,
    'topup_balance',new_topup,
    'spent',p_amount,
    'monthly_spent',monthly_spent,
    'topup_spent',topup_spent,
    'feature',p_feature
  );
end
$$;

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
set search_path = 'public','pg_temp'
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
    (p_pack='boost' and p_credits=250 and p_amount_cents=499)
    or (p_pack='power' and p_credits=750 and p_amount_cents=1199)
    or (p_pack='max' and p_credits=2000 and p_amount_cents=2499)
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

revoke all on function public.apply_credit_topup(uuid,text,text,numeric,integer,text) from public, anon, authenticated;
grant execute on function public.apply_credit_topup(uuid,text,text,numeric,integer,text) to service_role;
