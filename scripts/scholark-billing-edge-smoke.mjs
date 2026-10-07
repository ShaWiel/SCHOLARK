import http from 'node:http';
import crypto from 'node:crypto';

const nativeFetch=globalThis.fetch.bind(globalThis);
const USER='33333333-3333-4333-8333-333333333333';
const TX1='txn_'+('a'.repeat(26)),TX2='txn_'+('b'.repeat(26)),SUB='sub_'+('c'.repeat(26));
const PLUS='pri_'+('p'.repeat(26)),PRO='pri_'+('q'.repeat(26)),SECRET='scholark-edge-webhook-secret';
process.env.SUPABASE_URL='https://supabase.edge.test';
process.env.SUPABASE_PUBLISHABLE_KEY='sb_publishable_edge_test';
process.env.SUPABASE_SERVICE_ROLE_KEY='service_role_edge_test';
process.env.PADDLE_ENV='sandbox';
process.env.PADDLE_SANDBOX_CLIENT_TOKEN='test_edge_client_token';
process.env.PADDLE_SANDBOX_API_KEY='pdl_sdbx_apikey_edge_test';
process.env.PADDLE_SANDBOX_WEBHOOK_SECRET=SECRET;
process.env.PADDLE_SANDBOX_PLUS_PRICE_ID=PLUS;
process.env.PADDLE_SANDBOX_PRO_PRICE_ID=PRO;

const failures=[],events=new Set(),purchases=new Map(),transactions=new Map(),refundCalls=[];
let wallet={user_id:USER,plan:'free',balance:30,monthly_balance:30,topup_balance:0,monthly_allowance:30,cycle_started_at:new Date().toISOString()};
let subscription={user_id:USER,provider:'paddle',paddle_customer_id:'ctm_'+('d'.repeat(26)),paddle_subscription_id:SUB,paddle_transaction_id:null,plan:'plus',status:'active',price_id:PLUS,currency_code:'USD',current_period_start:'2026-10-01T00:00:00Z',current_period_end:'2026-11-01T00:00:00Z',cancel_at_period_end:false};
const check=(ok,msg)=>{if(!ok)failures.push(msg)};
const jsonResponse=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
const creditTransaction=(id)=>({id,status:'completed',subscription_id:null,currency_code:'USD',custom_data:{scholark_user_id:USER,scholark_purchase_type:'credit_pack',scholark_credit_pack:'starter'},items:[{price:{unit_price:{amount:'699',currency_code:'USD'}}}]});
transactions.set(TX1,creditTransaction(TX1));transactions.set(TX2,creditTransaction(TX2));

globalThis.fetch=async(input,opts={})=>{
  const url=new URL(String(input));
  const method=String(opts.method||'GET').toUpperCase();
  const body=()=>{try{return JSON.parse(String(opts.body||'{}'))}catch{return{}}};

  if(url.hostname==='sandbox-api.paddle.com'){
    if(url.pathname.startsWith('/transactions/')){
      const id=decodeURIComponent(url.pathname.split('/').pop()||'');
      const t=transactions.get(id);return t?jsonResponse({data:t}):jsonResponse({error:{code:'not_found'}},404);
    }
    if(url.pathname.startsWith('/prices/')){
      const id=decodeURIComponent(url.pathname.split('/')[2]||''),amount=id===PRO?'1999':'1499';
      return jsonResponse({data:{id,status:'active',name:'SCHOLARK',billing_cycle:{interval:'month',frequency:1},trial_period:{interval:'day',frequency:7,requires_payment_method:true},unit_price:{amount,currency_code:'USD'},product:{id:'pro_'+('x'.repeat(26)),name:'SCHOLARK',description:'SCHOLARK plan'}}});
    }
    if(url.pathname==='/pricing-preview')return jsonResponse({data:{details:{line_items:[]}}});
    if(url.pathname==='/notification-settings'&&method==='GET')return jsonResponse({data:[{id:'ntf_'+('n'.repeat(26)),description:'SCHOLARK billing webhook',type:'url',destination:'https://scholark-app-shawiel.onrender.com/api/billing/webhook',active:true,traffic_source:'all',subscribed_events:['subscription.created','subscription.trialing','subscription.activated','subscription.updated','subscription.past_due','subscription.paused','subscription.resumed','subscription.canceled','transaction.completed','adjustment.created','adjustment.updated'],endpoint_secret_key:SECRET}]});
    if(url.pathname.startsWith('/notification-settings/'))return jsonResponse({data:{id:'ntf_'+('n'.repeat(26)),destination:'https://scholark-app-shawiel.onrender.com/api/billing/webhook',active:true,traffic_source:'all',subscribed_events:['subscription.created','subscription.trialing','subscription.activated','subscription.updated','subscription.past_due','subscription.paused','subscription.resumed','subscription.canceled','transaction.completed','adjustment.created','adjustment.updated'],endpoint_secret_key:SECRET}});
    return jsonResponse({data:{}});
  }

  if(url.hostname==='supabase.edge.test'){
    if(url.pathname==='/rest/v1/rpc/apply_credit_topup'){
      const b=body(),id=String(b.p_transaction_id||'');
      const old=purchases.get(id);
      if(old)return jsonResponse({ok:true,idempotent:true,transaction_id:id,credits_added:0,balance:wallet.balance,monthly_balance:wallet.monthly_balance,topup_balance:wallet.topup_balance});
      purchases.set(id,{transaction_id:id,user_id:b.p_user_id,pack:b.p_pack,credits:Number(b.p_credits),amount_cents:Number(b.p_amount_cents),status:'completed'});
      wallet.topup_balance+=Number(b.p_credits);wallet.balance=wallet.monthly_balance+wallet.topup_balance;
      return jsonResponse({ok:true,idempotent:false,transaction_id:id,credits_added:Number(b.p_credits),balance:wallet.balance,monthly_balance:wallet.monthly_balance,topup_balance:wallet.topup_balance});
    }
    if(url.pathname==='/rest/v1/rpc/reverse_credit_topup_full'){
      const b=body(),id=String(b.p_transaction_id||''),purchase=purchases.get(id);refundCalls.push({...b});
      if(!purchase)return jsonResponse({ok:false,code:'PURCHASE_NOT_FOUND'});
      if(purchase.status==='refunded')return jsonResponse({ok:true,idempotent:true,credits_reversed:0,unrecovered:0,balance:wallet.balance});
      if(Number(b.p_refund_amount_cents)<purchase.amount_cents)return jsonResponse({ok:false,code:'PARTIAL_REFUND_REVIEW_REQUIRED',refund_amount_cents:Number(b.p_refund_amount_cents),purchase_amount_cents:purchase.amount_cents});
      const reversed=Math.min(wallet.topup_balance,purchase.credits);wallet.topup_balance-=reversed;wallet.balance=wallet.monthly_balance+wallet.topup_balance;purchase.status='refunded';
      return jsonResponse({ok:true,idempotent:false,credits_reversed:reversed,unrecovered:purchase.credits-reversed,balance:wallet.balance,monthly_balance:wallet.monthly_balance,topup_balance:wallet.topup_balance});
    }
    if(url.pathname==='/rest/v1/billing_events'&&method==='POST'){
      const b=body(),id=String(b.event_id||'');if(events.has(id))return jsonResponse([]);events.add(id);return jsonResponse([b],201);
    }
    if(url.pathname==='/rest/v1/billing_subscriptions'&&method==='GET')return jsonResponse(subscription?[subscription]:[]);
    if(url.pathname==='/rest/v1/billing_subscriptions'&&method==='POST'){subscription={...subscription,...body()};return jsonResponse([],201)}
    if(url.pathname==='/rest/v1/credit_wallets'&&method==='GET')return jsonResponse([wallet]);
    if(url.pathname==='/rest/v1/credit_wallets'&&method==='POST'){wallet={...wallet,...body()};return jsonResponse([],201)}
    return jsonResponse([]);
  }
  return jsonResponse({error:'unexpected mock URL '+url.href},500);
};

await import('../scholark-billing-route.mjs?edge='+Date.now());
const server=http.createServer((req,res)=>{res.writeHead(404,{'content-type':'application/json'});res.end('{"ok":false}')});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port,base='http://127.0.0.1:'+port;

function signature(raw){const ts=String(Math.floor(Date.now()/1000)),h1=crypto.createHmac('sha256',SECRET).update(ts+':'+raw,'utf8').digest('hex');return 'ts='+ts+';h1='+h1}
async function webhook(event,valid=true){
  const raw=JSON.stringify(event),r=await nativeFetch(base+'/api/billing/webhook',{method:'POST',headers:{'content-type':'application/json','paddle-signature':valid?signature(raw):'ts=0;h1=invalid'},body:raw}),data=await r.json().catch(()=>({}));return{r,data}
}
const event=(id,type,data)=>({event_id:id,event_type:type,occurred_at:new Date().toISOString(),data});

try{
  let out=await webhook(event('evt_bad','transaction.completed',transactions.get(TX1)),false);
  check(out.r.status===401&&out.data?.code==='INVALID_SIGNATURE','invalid webhook signature was not rejected');

  const completed=event('evt_topup_1','transaction.completed',transactions.get(TX1));
  out=await webhook(completed);
  check(out.r.status===200&&out.data?.ok===true,'completed credit webhook failed');
  check(wallet.topup_balance===250&&wallet.balance===280,'completed credit purchase did not add exactly 250 top-up credits');

  out=await webhook(completed);
  check(out.r.status===200,'duplicate completed webhook failed');
  check(wallet.topup_balance===250&&wallet.balance===280,'duplicate completed webhook double-credited wallet');

  const refund=event('evt_refund_1','adjustment.created',{id:'adj_'+('r'.repeat(26)),action:'refund',status:'approved',transaction_id:TX1,totals:{total:'699'}});
  out=await webhook(refund);
  check(out.r.status===200&&wallet.topup_balance===0&&wallet.balance===30,'full refund did not reverse purchased credits while preserving monthly credits');
  const firstRefundCalls=refundCalls.length;
  out=await webhook(refund);
  check(out.r.status===200&&wallet.topup_balance===0&&wallet.balance===30,'duplicate refund changed the wallet twice');
  check(refundCalls.length===firstRefundCalls+1,'duplicate refund did not reach the idempotent reversal guard');

  out=await webhook(event('evt_topup_2','transaction.completed',transactions.get(TX2)));
  check(out.r.status===200&&wallet.topup_balance===250,'second top-up setup failed');
  const beforePartial=wallet.topup_balance;
  out=await webhook(event('evt_partial_2','adjustment.updated',{id:'adj_'+('s'.repeat(26)),action:'refund',status:'approved',transaction_id:TX2,totals:{total:'200'}}));
  check(out.r.status===200,'partial refund webhook should be accepted for manual review');
  check(wallet.topup_balance===beforePartial,'partial refund automatically deducted an unsafe amount');
  check(events.has('evt_partial_2'),'partial refund manual-review event was not recorded');

  wallet={...wallet,plan:'plus',monthly_balance:750,monthly_allowance:750,topup_balance:250,balance:1000};
  subscription={...subscription,status:'active',plan:'plus',price_id:PLUS};
  out=await webhook(event('evt_cancel_1','subscription.canceled',{id:SUB,status:'canceled',customer_id:subscription.paddle_customer_id,transaction_id:null,currency_code:'USD',custom_data:{scholark_user_id:USER},items:[{price:{id:PLUS}}],current_billing_period:{starts_at:'2026-10-01T00:00:00Z',ends_at:'2026-11-01T00:00:00Z'},scheduled_change:null}));
  check(out.r.status===200,'subscription cancellation webhook failed');
  check(subscription.status==='canceled'&&subscription.plan==='plus','subscription cancellation state was not persisted');
  check(wallet.plan==='free'&&wallet.monthly_balance===30&&wallet.topup_balance===250&&wallet.balance===280,'subscription cancellation did not downgrade monthly credits while preserving purchased top-up credits');

  check(failures.length===0,'');
  console.log('SCHOLARK BILLING EDGE SMOKE',JSON.stringify({ok:failures.length===0,events:events.size,purchases:purchases.size,refundCalls:refundCalls.length,wallet}));
} finally {
  await new Promise(resolve=>server.close(resolve));
  globalThis.fetch=nativeFetch;
}
if(failures.length){failures.filter(Boolean).forEach(x=>console.error(' - '+x));process.exit(1)}
