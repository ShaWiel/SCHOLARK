import http from 'node:http';
import crypto from 'node:crypto';

const previousEmit=http.Server.prototype.emit;
const SB=String(process.env.SUPABASE_URL||'').replace(/\/+$/,'');
const PUB=String(process.env.SUPABASE_PUBLISHABLE_KEY||'').trim();
const SERVICE=String(process.env.SUPABASE_SERVICE_ROLE_KEY||'').trim();
const ENV=String(process.env.PADDLE_ENV||'sandbox').toLowerCase()==='production'?'production':'sandbox';
const API_BASE=ENV==='sandbox'?'https://sandbox-api.paddle.com':'https://api.paddle.com';
const CLIENT_TOKEN=String(process.env.PADDLE_CLIENT_TOKEN||'').trim();
const API_KEY=String(process.env.PADDLE_API_KEY||'').trim();
const WEBHOOK_SECRET=String(process.env.PADDLE_WEBHOOK_SECRET||'').trim();
const PRICES={plus:String(process.env.PADDLE_PLUS_PRICE_ID||'').trim(),pro:String(process.env.PADDLE_PRO_PRICE_ID||'').trim()};
const WEBHOOK_URL=String(process.env.PADDLE_WEBHOOK_URL||'https://scholark-app-shawiel.onrender.com/api/billing/webhook').trim();
let catalogHealth={checked:false,ok:false,environment:ENV};
const configured=()=>!!(SB&&PUB&&SERVICE&&CLIENT_TOKEN&&API_KEY&&WEBHOOK_SECRET&&/^pri_[a-z\d]{26}$/.test(PRICES.plus)&&/^pri_[a-z\d]{26}$/.test(PRICES.pro));
console.log('[SCHOLARK] Paddle billing route ready · '+ENV+' · '+(configured()?'configured':'awaiting credentials'));

function json(res,status,obj){if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(obj))}
function sameOrigin(req){const origin=String(req.headers?.origin||'').trim();if(!origin)return true;try{const a=new URL(origin).host.toLowerCase(),b=String(req.headers?.['x-forwarded-host']||req.headers?.host||'').split(',')[0].trim().toLowerCase();return !!b&&a===b}catch{return false}}
function readRaw(req,limit=1024*1024){return new Promise((resolve,reject)=>{const parts=[];let size=0;req.on('data',c=>{size+=c.length;if(size>limit){reject(new Error('request_too_large'));req.destroy();return}parts.push(c)});req.on('end',()=>resolve(Buffer.concat(parts).toString('utf8')));req.on('error',reject)})}
async function readJson(req){const raw=await readRaw(req,128*1024);try{return raw?JSON.parse(raw):{}}catch{throw new Error('invalid_json')}}
function bearer(req){const v=String(req.headers?.authorization||'');return /^Bearer\s+/i.test(v)?v.replace(/^Bearer\s+/i,'').trim():''}
async function currentUser(req){const token=bearer(req);if(!token||!SB||!PUB)return null;const r=await fetch(SB+'/auth/v1/user',{headers:{apikey:PUB,authorization:'Bearer '+token}});if(!r.ok)return null;const d=await r.json().catch(()=>null);return d?.id?d:null}
function serviceHeaders(extra={}){return {apikey:SERVICE,authorization:'Bearer '+SERVICE,'content-type':'application/json',accept:'application/json',...extra}}
async function sb(path,opts={}){return fetch(SB+path,{...opts,headers:{...serviceHeaders(),...(opts.headers||{})}})}
async function paddle(path,opts={}){return fetch(API_BASE+path,{...opts,headers:{authorization:'Bearer '+API_KEY,'content-type':'application/json',accept:'application/json',...(opts.headers||{})}})}
async function verifyCatalogPrice(plan,id,expectedAmount){
  const r=await paddle('/prices/'+encodeURIComponent(id),{method:'GET'}),d=await r.json().catch(()=>({})),p=d?.data||{};
  if(!r.ok)return {ok:false,http:r.status,reason:d?.error?.code||d?.error?.type||'price_read_failed'};
  const monthly=p?.billing_cycle?.interval==='month'&&Number(p?.billing_cycle?.frequency)===1;
  const trial7=p?.trial_period?.interval==='day'&&Number(p?.trial_period?.frequency)===7;
  const amount=String(p?.unit_price?.amount||''),currency=String(p?.unit_price?.currency_code||'');
  const active=p?.status==='active';
  return {ok:active&&monthly&&trial7&&amount===String(expectedAmount)&&currency==='USD',plan,id:p?.id||id,amount,currency,monthly,trial7,active,requiresPaymentMethod:p?.trial_period?.requires_payment_method!==false};
}
async function verifyWebhookDestination(){
  const required=new Set(['subscription.created','subscription.trialing','subscription.activated','subscription.updated','subscription.past_due','subscription.paused','subscription.resumed','subscription.canceled']);
  const r=await paddle('/notification-settings?active=true&per_page=200',{method:'GET'}),d=await r.json().catch(()=>({}));
  if(!r.ok)return {ok:false,verified:false,http:r.status,reason:d?.error?.code||d?.error?.type||'notification_settings_read_failed'};
  const row=(Array.isArray(d?.data)?d.data:[]).find(x=>String(x?.destination||'').replace(/\/+$/,'')===WEBHOOK_URL.replace(/\/+$/,''));
  if(!row)return {ok:false,verified:true,reason:'webhook_destination_missing'};
  const events=new Set((row.subscribed_events||[]).map(x=>String(x?.name||x||''))),missing=[...required].filter(x=>!events.has(x));
  const secretMatches=String(row.endpoint_secret_key||'')===WEBHOOK_SECRET;
  return {ok:!!row.active&&secretMatches&&!missing.length,verified:true,active:!!row.active,secretMatches,missingEvents:missing,destination:WEBHOOK_URL};
}
async function billingSelftest(){
  if(!configured()){catalogHealth={checked:true,ok:false,environment:ENV,reason:'credentials_or_prices_missing'};console.warn('[SCHOLARK] Paddle catalog self-test SKIP · billing credentials incomplete');return catalogHealth}
  try{
    const [plus,pro,webhook]=await Promise.all([verifyCatalogPrice('plus',PRICES.plus,1499),verifyCatalogPrice('pro',PRICES.pro,1999),verifyWebhookDestination()]);
    catalogHealth={checked:true,ok:!!plus.ok&&!!pro.ok&&!!webhook.ok,environment:ENV,plus,pro,webhook,checkedAt:new Date().toISOString()};
    const level=catalogHealth.ok?'log':'warn';
    console[level]('[SCHOLARK] Paddle catalog self-test '+(catalogHealth.ok?'PASS':'WARN')+' · Plus '+(plus.ok?'OK':'CHECK')+' · Pro '+(pro.ok?'OK':'CHECK')+' · webhook '+(webhook.ok?'OK':'CHECK'));
  }catch(e){catalogHealth={checked:true,ok:false,environment:ENV,reason:String(e?.message||e),checkedAt:new Date().toISOString()};console.warn('[SCHOLARK] Paddle catalog self-test WARN · '+catalogHealth.reason)}
  return catalogHealth;
}
function allowance(plan){return plan==='pro'?2500:plan==='plus'?750:30}
function planFromPrice(price){if(price&&price===PRICES.pro)return'pro';if(price&&price===PRICES.plus)return'plus';return''}
function parseSig(v){const out={ts:'',h1:[]};for(const part of String(v||'').split(';')){const [k,...rest]=part.split('=');const val=rest.join('=');if(k==='ts')out.ts=val;else if(k==='h1'&&val)out.h1.push(val)}return out}
function verifyWebhook(raw,header){if(!WEBHOOK_SECRET)return false;const p=parseSig(header),ts=Number(p.ts);if(!Number.isFinite(ts)||!p.h1.length||Math.abs(Date.now()/1000-ts)>300)return false;const expected=crypto.createHmac('sha256',WEBHOOK_SECRET).update(p.ts+':'+raw,'utf8').digest('hex');return p.h1.some(sig=>{try{return sig.length===expected.length&&crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected))}catch{return false}})}
async function getExistingSubscription(subscriptionId,userId=''){let path='/rest/v1/billing_subscriptions?select=*&limit=1';if(subscriptionId)path+='&paddle_subscription_id=eq.'+encodeURIComponent(subscriptionId);else if(userId)path+='&user_id=eq.'+encodeURIComponent(userId);const r=await sb(path,{method:'GET'}),d=await r.json().catch(()=>[]);return r.ok?(Array.isArray(d)?d[0]:d):null}
async function recordEvent(event,userId,subscriptionId){const payload={event_id:event.event_id,event_type:event.event_type,occurred_at:event.occurred_at||null,user_id:userId||null,subscription_id:subscriptionId||null,payload:event};const r=await sb('/rest/v1/billing_events?on_conflict=event_id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=representation'},body:JSON.stringify(payload)}),d=await r.json().catch(()=>[]);if(!r.ok&&r.status!==409)throw new Error('billing_event_store_failed');return Array.isArray(d)&&d.length>0}
async function syncWallet(userId,plan,activate,changed){const target=activate?plan:'free',a=allowance(target);let body={user_id:userId,plan:target,monthly_allowance:a,updated_at:new Date().toISOString()};if(changed){body.balance=a;body.cycle_started_at=new Date().toISOString()}const r=await sb('/rest/v1/credit_wallets?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});if(!r.ok)throw new Error('wallet_sync_failed')}
async function handleSubscriptionEvent(event){const data=event.data||{},subId=String(data.id||''),existing=await getExistingSubscription(subId);const custom=data.custom_data||{};const userId=String(custom.scholark_user_id||existing?.user_id||'');if(!/^[0-9a-f-]{36}$/i.test(userId))return;const item=Array.isArray(data.items)?data.items.find(x=>x?.price?.id)||data.items[0]:null,price=String(item?.price?.id||existing?.price_id||''),plan=planFromPrice(price)||existing?.plan||'free';const status=String(data.status||'inactive'),active=['active','trialing','past_due'].includes(status),changed=!existing||existing.plan!==plan||!['active','trialing','past_due'].includes(existing.status)&&active||['active','trialing','past_due'].includes(existing.status)&&!active;const fresh=await recordEvent(event,userId,subId);if(!fresh)return;const period=data.current_billing_period||{},cancel=String(data.scheduled_change?.action||'')==='cancel';const row={user_id:userId,provider:'paddle',paddle_customer_id:data.customer_id||existing?.paddle_customer_id||null,paddle_subscription_id:subId||existing?.paddle_subscription_id||null,paddle_transaction_id:data.transaction_id||existing?.paddle_transaction_id||null,plan,status:['trialing','active','past_due','paused','canceled'].includes(status)?status:'inactive',price_id:price||null,currency_code:data.currency_code||existing?.currency_code||null,current_period_start:period.starts_at||null,current_period_end:period.ends_at||null,cancel_at_period_end:cancel,last_event_id:event.event_id,updated_at:new Date().toISOString()};const r=await sb('/rest/v1/billing_subscriptions?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(row)});if(!r.ok)throw new Error('subscription_sync_failed');await syncWallet(userId,plan,active,changed)}
async function billingStatus(user){const r=await sb('/rest/v1/billing_subscriptions?select=plan,status,current_period_end,cancel_at_period_end,paddle_customer_id,paddle_subscription_id&user_id=eq.'+encodeURIComponent(user.id)+'&limit=1',{method:'GET'}),d=await r.json().catch(()=>[]);const sub=r.ok?(Array.isArray(d)?d[0]:d):null;const wr=await sb('/rest/v1/credit_wallets?select=plan,balance,monthly_allowance,cycle_started_at&user_id=eq.'+encodeURIComponent(user.id)+'&limit=1',{method:'GET'}),wd=await wr.json().catch(()=>[]),wallet=wr.ok?(Array.isArray(wd)?wd[0]:wd):null;return {ok:true,configured:configured(),environment:ENV,plan:wallet?.plan||sub?.plan||'free',subscription:sub||null,wallet:wallet||null}}

http.Server.prototype.emit=function(type,...args){if(type!=='request')return previousEmit.call(this,type,...args);const [req,res]=args;let url;try{url=new URL(req.url||'/','http://localhost')}catch{return previousEmit.call(this,type,...args)}
  if(req.method==='GET'&&url.pathname==='/api/billing/config'){json(res,200,{ok:true,provider:'paddle',environment:ENV,configured:configured(),clientToken:configured()?CLIENT_TOKEN:'',plans:{plus:14.99,pro:19.99},currency:'USD'});return true}
  if(req.method==='GET'&&url.pathname==='/api/billing/health'){json(res,200,{ok:true,provider:'paddle',environment:ENV,configured:configured(),prices:{plus:!!PRICES.plus,pro:!!PRICES.pro},webhookSecret:!!WEBHOOK_SECRET,apiKey:!!API_KEY,clientToken:!!CLIENT_TOKEN,catalog:catalogHealth});return true}
  if(req.method==='GET'&&url.pathname==='/api/billing/status'){currentUser(req).then(async user=>{if(!user)return json(res,401,{ok:false,code:'AUTH_REQUIRED'});json(res,200,await billingStatus(user))}).catch(e=>json(res,500,{ok:false,code:'BILLING_STATUS_FAILED',error:String(e.message||e)}));return true}
  if(req.method==='POST'&&url.pathname==='/api/billing/checkout'){if(!sameOrigin(req))return json(res,403,{ok:false,code:'CROSS_ORIGIN_BLOCKED'});Promise.all([currentUser(req),readJson(req)]).then(async([user,body])=>{if(!user)return json(res,401,{ok:false,code:'AUTH_REQUIRED'});if(!configured())return json(res,503,{ok:false,code:'BILLING_NOT_CONFIGURED',error:'Payments are not configured yet.'});const plan=String(body?.plan||'').toLowerCase();if(!['plus','pro'].includes(plan))return json(res,400,{ok:false,code:'INVALID_PLAN'});const price=PRICES[plan];const pr=await paddle('/transactions',{method:'POST',body:JSON.stringify({items:[{price_id:price,quantity:1}],collection_mode:'automatic',custom_data:{scholark_user_id:user.id,scholark_plan:plan}})}),pd=await pr.json().catch(()=>({}));if(!pr.ok||!pd?.data?.id)return json(res,502,{ok:false,code:'PADDLE_TRANSACTION_FAILED',error:pd?.error?.detail||pd?.error?.type||'Could not create checkout.'});json(res,200,{ok:true,transactionId:pd.data.id,environment:ENV})}).catch(e=>json(res,400,{ok:false,code:'CHECKOUT_FAILED',error:String(e.message||e)}));return true}
  if(req.method==='POST'&&url.pathname==='/api/billing/webhook'){readRaw(req,1024*1024).then(async raw=>{if(!verifyWebhook(raw,req.headers?.['paddle-signature']))return json(res,401,{ok:false,code:'INVALID_SIGNATURE'});const event=JSON.parse(raw);if(/^subscription\.(created|trialing|activated|updated|paused|resumed|canceled|past_due)$/.test(String(event.event_type||'')))await handleSubscriptionEvent(event);else await recordEvent(event,null,event?.data?.subscription_id||null);json(res,200,{ok:true})}).catch(e=>json(res,400,{ok:false,code:'WEBHOOK_FAILED',error:String(e.message||e)}));return true}
  return previousEmit.call(this,type,...args)
};

setTimeout(()=>billingSelftest().catch(()=>{}),1200).unref?.();