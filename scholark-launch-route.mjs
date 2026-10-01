import http from 'node:http';

const previousEmit=http.Server.prototype.emit;
const SB=String(process.env.SUPABASE_URL||'').replace(/\/+$/,'');
const PUB=String(process.env.SUPABASE_PUBLISHABLE_KEY||'').trim();
const SERVICE=String(process.env.SUPABASE_SERVICE_ROLE_KEY||'').trim();
const RELEASE=String(process.env.SCHOLARK_RELEASE||'dev');
const TEST_MODE=/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE||''));
const PADDLE_ENV=String(process.env.PADDLE_ENV||'sandbox').toLowerCase()==='production'?'production':'sandbox';
const SUPPORT_EMAIL=String(process.env.SCHOLARK_SUPPORT_EMAIL||'').trim().slice(0,240);
const LEGAL_NAME=String(process.env.SCHOLARK_LEGAL_NAME||'SCHOLARK').trim().slice(0,240)||'SCHOLARK';
const PRODUCT_STAGE=cleanEnv(process.env.SCHOLARK_PRODUCT_STAGE||'beta',40)||'beta';
const DEPLOY_TIER=cleanEnv(process.env.SCHOLARK_DEPLOY_TIER||'unknown',60)||'unknown';
const CAPACITY_VALIDATED=/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_CAPACITY_VALIDATED||''));
const LEAKED_PASSWORD_PROTECTION_VALIDATED=/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_LEAKED_PASSWORD_PROTECTION_VALIDATED||''));
const LIVE_BILLING_VALIDATED=/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_LIVE_BILLING_VALIDATED||''));
const LEGAL_REVIEW_VALIDATED=/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_LEGAL_REVIEW_VALIDATED||''));
const REAL_DEVICE_QA_VALIDATED=/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_REAL_DEVICE_QA_VALIDATED||''));
const LIVE_API_KEY=String(process.env.PADDLE_API_KEY||'').trim();
const LIVE_CLIENT_TOKEN=String(process.env.PADDLE_CLIENT_TOKEN||'').trim();
const LIVE_WEBHOOK_SECRET=String(process.env.PADDLE_WEBHOOK_SECRET||'').trim();
const LIVE_PLUS_PRICE=String(process.env.PADDLE_PLUS_PRICE_ID||'').trim();
const LIVE_PRO_PRICE=String(process.env.PADDLE_PRO_PRICE_ID||'').trim();
const STARTED_AT=Date.now();
const feedbackBuffer=[];
const feedbackRate=new Map();
const json=(res,status,body,extra={})=>{if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff',...extra});res.end(JSON.stringify(body))};
const clean=(v,max=500)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
function cleanEnv(v,max=120){return String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max)}
const bearer=req=>{const v=String(req.headers?.authorization||'');return /^Bearer\s+/i.test(v)?v.replace(/^Bearer\s+/i,'').trim():''};
const sameOrigin=req=>{const origin=String(req.headers?.origin||'').trim();if(!origin)return true;try{const a=new URL(origin).host.toLowerCase(),b=String(req.headers?.['x-forwarded-host']||req.headers?.host||'').split(',')[0].trim().toLowerCase();return !!b&&a===b}catch{return false}};
const timeoutSignal=ms=>{try{return AbortSignal.timeout(ms)}catch{return undefined}};
const readJson=(req,limit=16*1024)=>new Promise((resolve,reject)=>{let raw='';req.on('data',c=>{raw+=c;if(raw.length>limit){reject(Object.assign(new Error('request_too_large'),{code:'REQUEST_TOO_LARGE'}));req.destroy()}});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{reject(Object.assign(new Error('invalid_json'),{code:'INVALID_JSON'}))}});req.on('error',reject)});
const clientIp=req=>clean(String(req.headers?.['cf-connecting-ip']||req.headers?.['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0],120);
function serviceHeaders(extra={}){return {apikey:SERVICE,authorization:'Bearer '+SERVICE,'content-type':'application/json',accept:'application/json',...extra}}
async function sb(path,opts={}){return fetch(SB+path,{...opts,signal:opts.signal||timeoutSignal(10000),headers:{...serviceHeaders(),...(opts.headers||{})}})}
async function currentUser(req){
  const token=bearer(req);if(!token||!SB||!PUB)return null;
  const r=await fetch(SB+'/auth/v1/user',{headers:{apikey:PUB,authorization:'Bearer '+token},signal:timeoutSignal(8000)});
  if(!r.ok)return null;const d=await r.json().catch(()=>null);return d?.id?d:null;
}
function takeFeedback(req){
  const key=clientIp(req),now=Date.now(),windowMs=5*60*1000,limit=12;
  let row=feedbackRate.get(key);if(!row||now-row.at>windowMs)row={at:now,count:0};
  row.count++;feedbackRate.set(key,row);
  if(feedbackRate.size>5000){for(const k of feedbackRate.keys()){feedbackRate.delete(k);if(feedbackRate.size<=4500)break}}
  return row.count<=limit;
}
function safeMeta(input){
  const m=input&&typeof input==='object'?input:{},out={};
  for(const key of ['viewport','online','connection','module','kind','browser','platform','screen','source']){
    if(m[key]!=null)out[key]=clean(typeof m[key]==='string'?m[key]:JSON.stringify(m[key]),240);
  }
  return out;
}
const SOURCE_BASE=Object.freeze({
  global:[
    {name:'UNESCO Institute for Statistics · ISCED education levels',url:'https://uis.unesco.org/en/glossary-term/levels-education',type:'international-framework',official:true,verification:'framework-only'}
  ],
  Suriname:[
    {name:'Ministerie van Onderwijs, Wetenschap en Cultuur · Suriname',url:'https://gov.sr/ministeries/ministerie-van-onderwijs-wetenschapen-cultuur/',type:'national-ministry',official:true,verification:'national-official'},
    {name:'MinOWC · official documents and education policy',url:'https://gov.sr/ministeries/ministerie-van-onderwijs-wetenschapen-cultuur/documenten/',type:'national-documents',official:true,verification:'national-official'}
  ]
});
function educationSources(country){
  const c=clean(country,120)||'',national=SOURCE_BASE[c]||[],verification=national.length?'national-official':'framework-only';
  return {verification,sources:[...SOURCE_BASE.global,...national]};
}
const EXPORT_TABLES=[
  ['profiles','user_id'],['goals','user_id'],['planner_tasks','user_id'],['projects','user_id'],
  ['ai_chats','user_id'],['ai_messages','user_id'],['quiz_results','user_id'],['mastery_topics','user_id'],
  ['spaced_reviews','user_id'],['study_ahead','user_id'],['documents','user_id'],['presentations','user_id'],
  ['user_files','user_id'],['language_learning_progress','user_id'],['credit_wallets','user_id'],
  ['credit_ledger','user_id'],['usage_events','user_id'],['client_errors','user_id'],
  ['feedback_submissions','user_id'],['billing_subscriptions','user_id'],['billing_events','user_id'],['project_versions','user_id'],
  ['project_comments','user_id'],['shared_artifacts','owner_user_id'],['published_webpages','owner_user_id'],
  ['project_invites','owner_user_id']
];
async function tableRows(table,column,uid){
  const path='/rest/v1/'+encodeURIComponent(table)+'?select=*&'+encodeURIComponent(column)+'=eq.'+encodeURIComponent(uid)+'&limit=5000';
  const r=await sb(path,{method:'GET'}),d=await r.json().catch(()=>[]);
  if(!r.ok)return {ok:false,status:r.status,rows:[]};
  return {ok:true,status:r.status,rows:Array.isArray(d)?d:[]};
}
async function collaboratorRows(uid){
  const filter='(owner_user_id.eq.'+uid+',member_user_id.eq.'+uid+')';
  const r=await sb('/rest/v1/project_collaborators?select=*&or='+encodeURIComponent(filter)+'&limit=5000',{method:'GET'}),d=await r.json().catch(()=>[]);
  return {ok:r.ok,status:r.status,rows:r.ok&&Array.isArray(d)?d:[]};
}
async function exportAccount(user){
  const data={},failures=[];
  for(const [table,column] of EXPORT_TABLES){
    const r=await tableRows(table,column,user.id);data[table]=r.rows;if(!r.ok)failures.push({table,status:r.status});
  }
  const collab=await collaboratorRows(user.id);data.project_collaborators=collab.rows;if(!collab.ok)failures.push({table:'project_collaborators',status:collab.status});
  return {
    schema:1,product:'SCHOLARK',release:RELEASE,exportedAt:new Date().toISOString(),
    account:{id:user.id,email:user.email||null,created_at:user.created_at||null,last_sign_in_at:user.last_sign_in_at||null},
    data,failures,includedTables:Object.keys(data)
  };
}
async function activeBilling(userId){
  const r=await sb('/rest/v1/billing_subscriptions?select=plan,status,current_period_end,cancel_at_period_end,paddle_subscription_id&user_id=eq.'+encodeURIComponent(userId)+'&limit=1',{method:'GET'}),d=await r.json().catch(()=>[]);
  return r.ok?(Array.isArray(d)?d[0]:d):null;
}
async function deleteAuthUser(userId){
  const r=await fetch(SB+'/auth/v1/admin/users/'+encodeURIComponent(userId),{method:'DELETE',headers:{apikey:SERVICE,'content-type':'application/json',accept:'application/json'},signal:timeoutSignal(10000)});
  const d=await r.json().catch(()=>({}));
  return {ok:r.ok,status:r.status,body:d};
}
async function deleteUserData(userId){
  const r=await sb('/rest/v1/rpc/delete_scholark_user_data',{method:'POST',body:JSON.stringify({p_user_id:userId})});
  const d=await r.json().catch(()=>({}));
  return {ok:r.ok,status:r.status,body:d};
}

function launchHealth(){
  const mem=process.memoryUsage?.()||{};
  const liveBilling=PADDLE_ENV==='production';
  const liveCredentialShapes=/^pdl_live_apikey_/.test(LIVE_API_KEY)&&/^live_/.test(LIVE_CLIENT_TOKEN)&&!!LIVE_WEBHOOK_SECRET&&/^pri_[a-z\d]{26}$/.test(LIVE_PLUS_PRICE)&&/^pri_[a-z\d]{26}$/.test(LIVE_PRO_PRICE);
  const legalReady=!!SUPPORT_EMAIL&&LEGAL_REVIEW_VALIDATED;
  const nodeProduction=String(process.env.NODE_ENV||'').toLowerCase()==='production';
  const codeReady=nodeProduction&&!TEST_MODE;
  const blockers={
    testMode:TEST_MODE,
    nodeProduction:!nodeProduction,
    liveBillingEnvironment:!liveBilling,
    liveBillingCredentials:!liveCredentialShapes,
    liveBillingEndToEnd:!LIVE_BILLING_VALIDATED,
    supportContact:!SUPPORT_EMAIL,
    legalReview:!LEGAL_REVIEW_VALIDATED,
    productionCapacity:!CAPACITY_VALIDATED,
    realDeviceQa:!REAL_DEVICE_QA_VALIDATED,
    deployTier:DEPLOY_TIER==='unknown'||/free/i.test(DEPLOY_TIER),
    leakedPasswordProtection:!LEAKED_PASSWORD_PROTECTION_VALIDATED
  };
  const hardBlock=Object.values(blockers).some(v=>v===true);
  return {
    ok:true,release:RELEASE,nodeEnv:String(process.env.NODE_ENV||''),testMode:TEST_MODE,productStage:PRODUCT_STAGE,uptimeSeconds:Math.round(process.uptime()),
    runtime:{rssMB:Math.round((mem.rss||0)/1048576),heapUsedMB:Math.round((mem.heapUsed||0)/1048576)},
    foundation:{feedback:true,accountExport:true,accountDeletion:true,transactionalDataDeletion:true,sourceProvenance:true,observability:true,serverCreditPreflight:true,serverCreditIdempotency:true,sharedAiSessionRecovery:true,connectedWorkspaceContext:true,adaptiveSchoolRadiusKm:250,globalSchoolSampling:true,crossBrowserCi:['chromium','firefox','webkit'],accessibility:true,onboarding:true,languageQa:74},
    infrastructure:{provider:'render',deployTier:DEPLOY_TIER,productionCapacityValidated:CAPACITY_VALIDATED,realDeviceQaValidated:REAL_DEVICE_QA_VALIDATED},
    billing:{environment:PADDLE_ENV,liveEnvironment:liveBilling,liveCredentialShapes,liveEndToEndValidated:LIVE_BILLING_VALIDATED},
    security:{leakedPasswordProtectionValidated:LEAKED_PASSWORD_PROTECTION_VALIDATED,rlsExpected:true},
    legal:{product:LEGAL_NAME,supportContactConfigured:!!SUPPORT_EMAIL,supportEmail:SUPPORT_EMAIL||null,legalReviewValidated:LEGAL_REVIEW_VALIDATED,ready:legalReady},
    readiness:{codeReady,commerciallyReady:!hardBlock},
    blockers,
    publicCommercialLaunchReady:!hardBlock
  };
}

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return previousEmit.call(this,type,...args);
  const [req,res]=args;let url;try{url=new URL(req.url||'/','http://localhost')}catch{return previousEmit.call(this,type,...args)}

  if(req.method==='GET'&&url.pathname==='/api/launch/health'){json(res,200,launchHealth());return true}
  if(req.method==='GET'&&url.pathname==='/api/launch/sources'){
    const country=clean(url.searchParams.get('country'),120);
    const src=educationSources(country);
    json(res,200,{ok:true,country:country||null,verification:src.verification,sources:src.sources,policy:{
      currentAdmissions:'Use the current official institution or national education authority source before presenting admissions, tuition, deadlines or eligibility as current fact.',
      generatedGuidance:'AI-generated education guidance must be labeled as guidance and must not replace official admission requirements.',
      schoolNames:'School and institution names are preserved and never translated.'
    }});return true;
  }
  if(req.method==='POST'&&url.pathname==='/api/feedback'){
    if(!sameOrigin(req))return json(res,403,{ok:false,code:'CROSS_ORIGIN_BLOCKED'});
    if(!takeFeedback(req))return json(res,429,{ok:false,code:'RATE_LIMITED',error:'Too much feedback was submitted in a short time.'},{'retry-after':'300'});
    Promise.all([currentUser(req),readJson(req,12*1024)]).then(async([user,body])=>{
      const category=clean(body?.category,40).toLowerCase(),allowed=new Set(['general','bug','billing','schools','language','accessibility','privacy','other']);
      const message=clean(body?.message,2000);
      if(!allowed.has(category)||message.length<3)return json(res,400,{ok:false,code:'INVALID_FEEDBACK'});
      const row={user_id:user?.id||null,category,message,route:clean(body?.route,240)||null,release:clean(body?.release,80)||RELEASE,locale:clean(body?.locale,40)||null,metadata:safeMeta(body?.metadata)};
      if(TEST_MODE){feedbackBuffer.push({...row,created_at:new Date().toISOString()});while(feedbackBuffer.length>100)feedbackBuffer.shift();return json(res,201,{ok:true,testMode:true})}
      if(!SB||!SERVICE)return json(res,503,{ok:false,code:'FEEDBACK_UNAVAILABLE'});
      const r=await sb('/rest/v1/feedback_submissions',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(row)});
      if(!r.ok)return json(res,503,{ok:false,code:'FEEDBACK_STORE_FAILED'});
      json(res,201,{ok:true});
    }).catch(e=>json(res,e?.code==='REQUEST_TOO_LARGE'?413:400,{ok:false,code:e?.code||'FEEDBACK_FAILED'}));return true;
  }
  if(req.method==='GET'&&url.pathname==='/api/account/export'){
    if(!sameOrigin(req))return json(res,403,{ok:false,code:'CROSS_ORIGIN_BLOCKED'});
    currentUser(req).then(async user=>{
      if(!user)return json(res,401,{ok:false,code:'AUTH_REQUIRED'});
      if(!SB||!SERVICE)return json(res,503,{ok:false,code:'EXPORT_UNAVAILABLE'});
      const payload=await exportAccount(user);
      json(res,200,payload,{'content-disposition':'attachment; filename="scholark-data-export.json"'});
    }).catch(()=>json(res,500,{ok:false,code:'EXPORT_FAILED'}));return true;
  }
  if(req.method==='DELETE'&&url.pathname==='/api/account'){
    if(!sameOrigin(req))return json(res,403,{ok:false,code:'CROSS_ORIGIN_BLOCKED'});
    Promise.all([currentUser(req),readJson(req,4*1024)]).then(async([user,body])=>{
      if(!user)return json(res,401,{ok:false,code:'AUTH_REQUIRED'});
      if(clean(body?.confirm,20)!=='DELETE')return json(res,400,{ok:false,code:'CONFIRMATION_REQUIRED',error:'Type DELETE to confirm account deletion.'});
      if(TEST_MODE)return json(res,503,{ok:false,code:'ACCOUNT_DELETE_DISABLED_IN_TEST'});
      const billing=await activeBilling(user.id);
      if(billing&&['trialing','active','past_due','paused'].includes(String(billing.status||''))){
        return json(res,409,{ok:false,code:'ACTIVE_SUBSCRIPTION',error:'Manage or cancel the active subscription before deleting this SCHOLARK account.',manageBilling:true,plan:billing.plan,status:billing.status,currentPeriodEnd:billing.current_period_end||null});
      }
      const dataResult=await deleteUserData(user.id);
      if(!dataResult.ok)return json(res,500,{ok:false,code:'ACCOUNT_DATA_DELETE_FAILED',error:'SCHOLARK could not safely remove account data, so the account itself was not deleted.'});
      const result=await deleteAuthUser(user.id);
      if(!result.ok)return json(res,result.status===401||result.status===403?503:500,{ok:false,code:'ACCOUNT_DELETE_FAILED',dataDeleted:true,error:'Account data was removed, but the authentication account still needs cleanup.'});
      json(res,200,{ok:true,deleted:true,dataDeleted:true});
    }).catch(e=>json(res,e?.code==='REQUEST_TOO_LARGE'?413:400,{ok:false,code:e?.code||'ACCOUNT_DELETE_FAILED'}));return true;
  }

  return previousEmit.call(this,type,...args);
};

setInterval(()=>{const cutoff=Date.now()-10*60*1000;for(const [k,v] of feedbackRate)if(v.at<cutoff)feedbackRate.delete(k)},10*60*1000).unref?.();
console.log('[SCHOLARK] Launch foundation route ready · release '+RELEASE+' · Paddle '+PADDLE_ENV+' · test '+TEST_MODE);
