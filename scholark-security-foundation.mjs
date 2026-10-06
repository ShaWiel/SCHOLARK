import http from 'node:http';
import crypto from 'node:crypto';

const previousEmit=http.Server.prototype.emit;
const SB=String(process.env.SUPABASE_URL||'').replace(/\/+$/,'');
const PUB=String(process.env.SUPABASE_PUBLISHABLE_KEY||'').trim();
const SERVICE=String(process.env.SUPABASE_SERVICE_ROLE_KEY||'').trim();
const RELEASE=String(process.env.SCHOLARK_RELEASE||'dev');
const TEST_MODE=/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE||''));
const TURNSTILE_SITE_KEY=cleanEnv(process.env.TURNSTILE_SITE_KEY||process.env.CLOUDFLARE_TURNSTILE_SITE_KEY||'',200);
const STEP_TTL_SECONDS=Math.max(180,Math.min(900,Number(process.env.SCHOLARK_STEP_UP_TTL_SECONDS)||600));
const RECENT_AUTH_SECONDS=Math.max(180,Math.min(1800,Number(process.env.SCHOLARK_RECENT_AUTH_SECONDS)||600));
const STEP_SECRET=crypto.createHash('sha256').update(
  'SCHOLARK_STEP_UP_V1|'+String(process.env.SCHOLARK_STEP_UP_SECRET||'')+'|'+SERVICE
).digest();
const STARTED_AT=Date.now();
const userBuckets=new Map();
const actionLocks=new Map();
const authCache=new Map();
const USER_WINDOW_MS=5*60*1000;
const MAX_TRACKED=12000;
const SENSITIVE_ACTIONS=new Map([
  ['GET /api/account/export','export'],
  ['DELETE /api/account','delete']
]);
const USER_RULES=[
  {match:(m,p)=>m==='POST'&&p==='/api/studio/generate',limit:24},
  {match:(m,p)=>m==='POST'&&p==='/api/studio/image',limit:30},
  {match:(m,p)=>m==='POST'&&p==='/api/studio/research',limit:24},
  {match:(m,p)=>m==='POST'&&p.startsWith('/api/learning/'),limit:90},
  {match:(m,p)=>m==='POST'&&p.startsWith('/api/billing/'),limit:30}
];

const clean=(v,max=240)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
function cleanEnv(v,max=240){return String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max)}
const bearer=req=>{const v=String(req.headers?.authorization||'');return /^Bearer\s+/i.test(v)?v.replace(/^Bearer\s+/i,'').trim():''};
const timeoutSignal=ms=>{try{return AbortSignal.timeout(ms)}catch{return undefined}};
const b64url=v=>Buffer.from(v).toString('base64url');
const safeEqual=(a,b)=>{try{const x=Buffer.from(String(a||'')),y=Buffer.from(String(b||''));return x.length===y.length&&crypto.timingSafeEqual(x,y)}catch{return false}};
function json(res,status,body,extra={}){if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff',...extra});res.end(JSON.stringify(body))}
function readJson(req,limit=4096){return new Promise((resolve,reject)=>{let raw='',size=0;req.setEncoding('utf8');req.on('data',c=>{size+=Buffer.byteLength(c);if(size>limit){reject(Object.assign(new Error('request_too_large'),{code:'REQUEST_TOO_LARGE'}));req.destroy();return}raw+=c});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{reject(Object.assign(new Error('invalid_json'),{code:'INVALID_JSON'}))}});req.on('error',reject)})}
function sameOrigin(req){const site=String(req.headers?.['sec-fetch-site']||'').toLowerCase();if(site==='cross-site')return false;const origin=String(req.headers?.origin||'').trim();if(!origin)return true;try{const oh=new URL(origin).host.toLowerCase(),host=String(req.headers?.['x-forwarded-host']||req.headers?.host||'').split(',')[0].trim().toLowerCase();return !!host&&oh===host}catch{return false}}
function sourceIp(req){return clean(String(req.headers?.['cf-connecting-ip']||req.headers?.['x-real-ip']||req.headers?.['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0],120)}
function ipHash(req){return crypto.createHmac('sha256',STEP_SECRET).update(sourceIp(req)).digest('hex').slice(0,32)}
function sessionHash(value){const v=clean(value,160);return v?crypto.createHmac('sha256',STEP_SECRET).update(v).digest('hex').slice(0,32):null}
function tokenHash(token){return crypto.createHash('sha256').update(String(token||'')).digest('hex').slice(0,32)}
function parseJwt(token){try{const p=String(token).split('.')[1];return p?JSON.parse(Buffer.from(p,'base64url').toString('utf8')):{}}catch{return{}}}
function hasVerifiedMfa(user){return Array.isArray(user?.factors)&&user.factors.some(f=>String(f?.status||'').toLowerCase()==='verified'&&['totp','phone'].includes(String(f?.factor_type||f?.type||'').toLowerCase()))}
function freshestAuth(claims){const rows=Array.isArray(claims?.amr)?claims.amr:[];let latest=0,method='';for(const row of rows){const ts=Number(row?.timestamp||0);if(ts>latest){latest=ts;method=clean(row?.method,40)}}return {timestamp:latest,method}}
function authIsRecent(claims){const a=freshestAuth(claims);return !!a.timestamp&&(Math.floor(Date.now()/1000)-a.timestamp)<=RECENT_AUTH_SECONDS}
function sessionId(claims){return clean(claims?.session_id||claims?.sid||'',120)}
function serviceHeaders(extra={}){return {apikey:SERVICE,authorization:'Bearer '+SERVICE,'content-type':'application/json',accept:'application/json',...extra}}
async function currentContext(req){
  const token=bearer(req);if(!token||!SB||!PUB)return null;
  const key=tokenHash(token),cached=authCache.get(key);
  if(cached&&cached.expires>Date.now())return cached.ctx;
  const r=await fetch(SB+'/auth/v1/user',{headers:{apikey:PUB,authorization:'Bearer '+token},signal:timeoutSignal(7000)});
  if(!r.ok)return null;
  const user=await r.json().catch(()=>null);if(!user?.id)return null;
  const claims=parseJwt(token);
  const ctx={user,claims,token,uid:user.id,aal:clean(claims?.aal||'aal1',16)||'aal1',sessionId:sessionId(claims),mfaEnrolled:hasVerifiedMfa(user),recentAuth:authIsRecent(claims)};
  authCache.set(key,{ctx,expires:Date.now()+15000});
  if(authCache.size>2500){for(const k of authCache.keys()){authCache.delete(k);if(authCache.size<=2200)break}}
  return ctx;
}
function eventMeta(input){const src=input&&typeof input==='object'?input:{},out={};for(const k of ['action','method','aal','code','provider','feature','reason']){if(src[k]!=null)out[k]=clean(src[k],120)}return out}
async function logEvent(req,{userId=null,eventType,outcome='blocked',route='',risk='medium',sessionId=null,metadata={}}={}){
  if(!SB||!SERVICE||TEST_MODE)return;
  const row={user_id:userId,event_type:clean(eventType,80)||'security_event',outcome:['allowed','blocked','failed','observed'].includes(outcome)?outcome:'observed',route:clean(route||req?.url,180)||null,risk_level:['low','medium','high','critical'].includes(risk)?risk:'medium',ip_hash:req?ipHash(req):null,session_id:sessionId?crypto.createHmac('sha256',STEP_SECRET).update(String(sessionId)).digest('hex').slice(0,32):null,metadata:eventMeta(metadata),release:RELEASE};
  try{const r=await fetch(SB+'/rest/v1/security_events',{method:'POST',headers:serviceHeaders({Prefer:'return=minimal'}),body:JSON.stringify(row),signal:timeoutSignal(4000)});if(!r.ok){const fallback={user_id:userId,feature:'security',event:row.event_type,duration_ms:0,success:row.outcome==='allowed',credits:0,meta:{route:row.route,risk:row.risk_level,outcome:row.outcome,ip_hash:row.ip_hash,release:RELEASE,...row.metadata}};await fetch(SB+'/rest/v1/usage_events',{method:'POST',headers:serviceHeaders({Prefer:'return=minimal'}),body:JSON.stringify(fallback),signal:timeoutSignal(4000)})}}catch{}
}
function consumeUser(key,path,limit){
  const now=Date.now(),bucketKey=key+'|'+path;
  if(!userBuckets.has(bucketKey)&&userBuckets.size>=MAX_TRACKED){let n=0;for(const k of userBuckets.keys()){userBuckets.delete(k);if(++n>=1000)break}}
  let b=userBuckets.get(bucketKey);if(!b||now-b.started>=USER_WINDOW_MS)b={started:now,count:0};b.count++;userBuckets.set(bucketKey,b);
  return {allowed:b.count<=limit,retryAfter:Math.max(1,Math.ceil((USER_WINDOW_MS-(now-b.started))/1000)),remaining:Math.max(0,limit-b.count)};
}
function signStep(payload){
  const body=b64url(JSON.stringify(payload)),sig=crypto.createHmac('sha256',STEP_SECRET).update(body).digest('base64url');
  return body+'.'+sig;
}
function verifyStep(raw,ctx,action){
  try{
    const [body,sig]=String(raw||'').split('.');if(!body||!sig)return false;
    const expected=crypto.createHmac('sha256',STEP_SECRET).update(body).digest('base64url');if(!safeEqual(sig,expected))return false;
    const p=JSON.parse(Buffer.from(body,'base64url').toString('utf8')),now=Math.floor(Date.now()/1000);
    return p?.v===1&&p?.uid===ctx.uid&&p?.action===action&&Number(p?.exp||0)>now&&Number(p?.iat||0)<=now+15&&(!ctx.sessionId||!p?.sid||p.sid===ctx.sessionId);
  }catch{return false}
}
function actionKey(ctx,req,url){return ctx.uid+'|'+(ctx.sessionId||tokenHash(ctx.token))+'|'+req.method+'|'+url.pathname}
function takeActionLock(key,ttlMs){const now=Date.now(),until=actionLocks.get(key)||0;if(until>now)return false;actionLocks.set(key,now+ttlMs);return true}
function releaseActionLater(key,delay=1600){setTimeout(()=>actionLocks.delete(key),delay).unref?.()}
function challengeReason(ctx){
  if(ctx.mfaEnrolled&&ctx.aal!=='aal2')return 'MFA_REQUIRED';
  if(!ctx.recentAuth)return 'RECENT_AUTH_REQUIRED';
  return '';
}
function securityHealth(){
  return {ok:true,release:RELEASE,version:'20261006-security-r217',uptimeSeconds:Math.round((Date.now()-STARTED_AT)/1000),stepUp:{enabled:!!SERVICE,ttlSeconds:STEP_TTL_SECONDS,recentAuthSeconds:RECENT_AUTH_SECONDS,mfaAware:true,sessionBound:true},abuse:{perIp:true,perUser:true,userWindowSeconds:USER_WINDOW_MS/1000,trackedUserBuckets:userBuckets.size},events:{enabled:!!SERVICE,rawIpStored:false,tokensStored:false,sessionIdsHashed:true,fallback:'usage_events'},turnstile:{clientConfigured:!!TURNSTILE_SITE_KEY,supabaseValidationRequired:true},sensitiveActions:{export:true,delete:true,idempotencyLocks:true},failClosed:true};
}

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return previousEmit.call(this,type,...args);
  const [req,res]=args;let url;try{url=new URL(req.url||'/','http://localhost')}catch{return previousEmit.call(this,type,...args)}
  const method=String(req.method||'GET').toUpperCase();

  if(method==='GET'&&url.pathname==='/api/security/health'){json(res,200,securityHealth());return true}
  if(method==='GET'&&url.pathname==='/api/security/config'){json(res,200,{ok:true,turnstile:{enabled:!!TURNSTILE_SITE_KEY,siteKey:TURNSTILE_SITE_KEY||null,validation:'supabase-auth'}});return true}

  if(url.pathname.startsWith('/api/security/')&&!['GET','POST'].includes(method)){json(res,405,{ok:false,code:'METHOD_NOT_ALLOWED'},{allow:'GET, POST'});return true}

  if(method==='POST'&&url.pathname==='/api/security/step-up'){
    if(!sameOrigin(req)){logEvent(req,{eventType:'step_up_origin',risk:'high'});json(res,403,{ok:false,code:'CROSS_ORIGIN_BLOCKED'});return true}
    Promise.all([currentContext(req),readJson(req,4096)]).then(([ctx,body])=>{
      if(!ctx){logEvent(req,{eventType:'step_up_auth',risk:'high'});return json(res,401,{ok:false,code:'AUTH_REQUIRED'})}
      const action=clean(body?.action,40);if(!['export','delete','password','security','sessions'].includes(action))return json(res,400,{ok:false,code:'INVALID_STEP_UP_ACTION'});
      const reason=challengeReason(ctx);if(reason){logEvent(req,{userId:ctx.uid,eventType:'step_up_required',risk:'high',sessionId:ctx.sessionId,metadata:{action,aal:ctx.aal,code:reason}});return json(res,428,{ok:false,code:reason,mfaEnrolled:ctx.mfaEnrolled,aal:ctx.aal})}
      const now=Math.floor(Date.now()/1000),proof=signStep({v:1,uid:ctx.uid,sid:ctx.sessionId||'',action,aal:ctx.aal,iat:now,exp:now+STEP_TTL_SECONDS});
      logEvent(req,{userId:ctx.uid,eventType:'step_up_issued',outcome:'allowed',risk:'low',sessionId:ctx.sessionId,metadata:{action,aal:ctx.aal}});
      json(res,200,{ok:true,proof,action,aal:ctx.aal,expiresAt:(now+STEP_TTL_SECONDS)*1000});
    }).catch(e=>json(res,e?.code==='REQUEST_TOO_LARGE'?413:400,{ok:false,code:e?.code||'STEP_UP_FAILED'}));
    return true;
  }

  const action=SENSITIVE_ACTIONS.get(method+' '+url.pathname);
  if(action){
    if(!sameOrigin(req)){logEvent(req,{eventType:'sensitive_origin',risk:'critical',route:url.pathname});json(res,403,{ok:false,code:'CROSS_ORIGIN_BLOCKED'});return true}
    currentContext(req).then(ctx=>{
      if(!ctx){logEvent(req,{eventType:'sensitive_auth',risk:'critical',route:url.pathname});json(res,401,{ok:false,code:'AUTH_REQUIRED'});return}
      const proof=String(req.headers?.['x-scholark-step-up']||'');
      if(!verifyStep(proof,ctx,action)){logEvent(req,{userId:ctx.uid,eventType:'step_up_invalid',risk:'high',route:url.pathname,sessionId:ctx.sessionId,metadata:{action,aal:ctx.aal}});json(res,428,{ok:false,code:'STEP_UP_REQUIRED',action,mfaEnrolled:ctx.mfaEnrolled,aal:ctx.aal});return}
      const key=actionKey(ctx,req,url);if(!takeActionLock(key,action==='delete'?30000:5000)){logEvent(req,{userId:ctx.uid,eventType:'duplicate_sensitive_action',risk:'medium',route:url.pathname,sessionId:ctx.sessionId,metadata:{action}});json(res,409,{ok:false,code:'DUPLICATE_ACTION_BLOCKED'});return}
      const release=()=>releaseActionLater(key,action==='delete'?30000:1200);res.once('finish',release);res.once('close',release);
      logEvent(req,{userId:ctx.uid,eventType:'sensitive_action',outcome:'allowed',risk:'medium',route:url.pathname,sessionId:ctx.sessionId,metadata:{action,aal:ctx.aal}});
      try{previousEmit.call(this,type,...args)}catch(e){actionLocks.delete(key);throw e}
    }).catch(()=>json(res,503,{ok:false,code:'SECURITY_VALIDATION_UNAVAILABLE'}));
    return true;
  }

  const userRule=USER_RULES.find(r=>r.match(method,url.pathname));
  if(userRule&&!TEST_MODE){
    const token=bearer(req);
    if(token){
      const claims=parseJwt(token),sub=clean(claims?.sub,80);
      if(sub){
        const rate=consumeUser('uid:'+sub,url.pathname,userRule.limit);
        res.setHeader('x-scholark-user-ratelimit-limit',String(userRule.limit));
        res.setHeader('x-scholark-user-ratelimit-remaining',String(rate.remaining));
        if(!rate.allowed){logEvent(req,{userId:/^[0-9a-f-]{36}$/i.test(sub)?sub:null,eventType:'user_rate_limit',risk:'medium',route:url.pathname,metadata:{feature:url.pathname}});json(res,429,{ok:false,code:'USER_RATE_LIMITED',error:'Too many requests for this account. Please wait and try again.'},{'retry-after':String(rate.retryAfter)});return true}
      }
    }
  }

  return previousEmit.call(this,type,...args);
};

setInterval(()=>{
  const cutoff=Date.now()-USER_WINDOW_MS*2;
  for(const [k,b] of userBuckets)if(b.started<cutoff)userBuckets.delete(k);
  const now=Date.now();for(const [k,v] of actionLocks)if(v<now)actionLocks.delete(k);
  for(const [k,v] of authCache)if(v.expires<now)authCache.delete(k);
},USER_WINDOW_MS).unref?.();

console.log('[SCHOLARK] Security foundation ready · '+RELEASE+' · step-up '+(SERVICE?'enabled':'unavailable'));
