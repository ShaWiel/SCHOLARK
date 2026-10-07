import http from 'node:http';
import crypto from 'node:crypto';
import webpush from 'web-push';

const previousEmit=http.Server.prototype.emit;
const safeFetch=globalThis.fetch.bind(globalThis);
const SB=String(process.env.SUPABASE_URL||'https://yhafbwdnnpvuedycdkll.supabase.co').replace(/\/$/,'');
const PUBLISHABLE=String(process.env.SUPABASE_PUBLISHABLE_KEY||'');
const SERVICE=String(process.env.SUPABASE_SERVICE_ROLE_KEY||'');
const VAPID_PUBLIC=String(process.env.VAPID_PUBLIC_KEY||'');
const VAPID_PRIVATE=String(process.env.VAPID_PRIVATE_KEY||'');
const VAPID_SUBJECT=String(process.env.VAPID_SUBJECT||'https://scholark-app-shawiel.onrender.com');
const DISPATCH_SECRET=String(process.env.SCHOLARK_NOTIFICATION_DISPATCH_SECRET||'');
const VERSION='20261007-push-v1';
const authCache=new Map();

if(VAPID_PUBLIC&&VAPID_PRIVATE){
  try{webpush.setVapidDetails(VAPID_SUBJECT,VAPID_PUBLIC,VAPID_PRIVATE)}catch(e){console.warn('[SCHOLARK] Push VAPID setup warning:',e?.message||e)}
}

const clean=(v,n=600)=>String(v??'').replace(/\u0000/g,'').replace(/\s+/g,' ').trim().slice(0,n);
const json=(res,status,body)=>{
  if(res.headersSent)return;
  res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});
  res.end(JSON.stringify(body));
};
const readJson=(req,max=32768)=>new Promise((resolve,reject)=>{
  let raw='',size=0;req.setEncoding('utf8');
  req.on('data',c=>{size+=Buffer.byteLength(c);if(size>max){const e=new Error('REQUEST_TOO_LARGE');e.code='REQUEST_TOO_LARGE';reject(e);req.destroy();return}raw+=c});
  req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{const e=new Error('INVALID_JSON');e.code='INVALID_JSON';reject(e)}});
  req.on('error',reject);
});
function bearer(req){const h=String(req.headers?.authorization||'');return /^Bearer\s+/i.test(h)?h.replace(/^Bearer\s+/i,'').trim():''}
function tokenHash(token){return crypto.createHash('sha256').update(String(token||'')).digest('hex').slice(0,32)}
function safeEqual(a,b){const aa=Buffer.from(String(a||'')),bb=Buffer.from(String(b||''));return aa.length===bb.length&&aa.length>0&&crypto.timingSafeEqual(aa,bb)}
async function currentUser(req){
  const token=bearer(req);if(!token)return null;
  const key=tokenHash(token),cached=authCache.get(key);if(cached&&cached.expires>Date.now())return cached.user;
  const r=await safeFetch(SB+'/auth/v1/user',{headers:{apikey:PUBLISHABLE,authorization:'Bearer '+token,accept:'application/json'},cache:'no-store'});
  const u=await r.json().catch(()=>null);if(!r.ok||!u?.id)return null;
  const user={id:String(u.id),email:clean(u.email,240)};authCache.set(key,{user,expires:Date.now()+30000});return user;
}
function serviceHeaders(extra={}){return {apikey:SERVICE,authorization:'Bearer '+SERVICE,'content-type':'application/json',accept:'application/json',...extra}}
async function rest(path,opts={}){
  if(!SERVICE)throw new Error('SUPABASE_SERVICE_ROLE_KEY is unavailable');
  const r=await safeFetch(SB+'/rest/v1/'+path,{...opts,headers:{...serviceHeaders(),...(opts.headers||{})},cache:'no-store'});
  const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}
  if(!r.ok){const e=new Error(clean(data?.message||data?.error||data||('Supabase HTTP '+r.status),500));e.status=r.status;throw e}
  return data;
}
function validTime(v){return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(v||''))}
function validTimezone(v){try{new Intl.DateTimeFormat('en-US',{timeZone:v}).format(new Date());return true}catch{return false}}
function prefsDefaults(userId=''){return {user_id:userId,enabled:true,study_reminders:true,task_reminders:true,product_updates:false,study_time:'19:00:00',timezone:'UTC',task_lead_minutes:60,quiet_hours_start:'22:00:00',quiet_hours_end:'07:00:00'}}
function platformFromUA(ua=''){
  const s=String(ua);
  if(/iPhone|iPad|iPod/i.test(s))return'Apple iOS/iPadOS';
  if(/Android/i.test(s))return'Android';
  if(/Macintosh|Mac OS X/i.test(s))return'Apple macOS';
  if(/Windows/i.test(s))return'Windows';
  if(/Linux/i.test(s))return'Linux';
  return'Web device';
}
function subShape(row){return {endpoint:row.endpoint,keys:{p256dh:row.p256dh,auth:row.auth},expirationTime:row.expiration_time??null}}
async function subscriptions(userId){
  return await rest('push_subscriptions?select=id,endpoint,p256dh,auth,expiration_time,platform,device_label&user_id=eq.'+encodeURIComponent(userId)+'&enabled=eq.true&order=last_seen_at.desc&limit=20',{method:'GET'})||[];
}
async function deliveryExists(userId,subscriptionId,key){
  const rows=await rest('notification_delivery_log?select=id&user_id=eq.'+encodeURIComponent(userId)+'&subscription_id=eq.'+encodeURIComponent(subscriptionId)+'&dedupe_key=eq.'+encodeURIComponent(key)+'&status=eq.sent&limit=1',{method:'GET'});
  return Array.isArray(rows)&&rows.length>0;
}
async function logDelivery(userId,subscriptionId,key){
  await rest('notification_delivery_log?on_conflict=user_id,subscription_id,dedupe_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:userId,subscription_id:subscriptionId,dedupe_key:key,status:'sent',delivered_at:new Date().toISOString()})});
}
async function disableSubscription(id){
  await rest('push_subscriptions?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({enabled:false,updated_at:new Date().toISOString()})}).catch(()=>{});
}
async function sendUser(userId,key,payload){
  if(!VAPID_PUBLIC||!VAPID_PRIVATE)return {sent:0,configured:false};
  const subs=await subscriptions(userId);let sent=0,stale=0;
  for(const row of subs){
    try{
      if(await deliveryExists(userId,row.id,key))continue;
      await webpush.sendNotification(subShape(row),JSON.stringify(payload),{TTL:Math.max(60,Number(payload.ttl)||3600),urgency:payload.urgency||'normal'});
      await logDelivery(userId,row.id,key);sent++;
    }catch(e){
      const status=Number(e?.statusCode||e?.status||0);
      if(status===404||status===410){stale++;await disableSubscription(row.id)}
      else console.warn('[SCHOLARK] push send warning',status||'',clean(e?.message||e,240));
    }
  }
  return {sent,stale,configured:true};
}
function localParts(timeZone,date=new Date()){
  try{
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
    const x=Object.fromEntries(parts.map(p=>[p.type,p.value]));
    return {date:x.year+'-'+x.month+'-'+x.day,hour:Number(x.hour),minute:Number(x.minute),minutes:Number(x.hour)*60+Number(x.minute)};
  }catch{return null}
}
function clockMinutes(v){const m=String(v||'').match(/^(\d{2}):(\d{2})/);return m?Number(m[1])*60+Number(m[2]):null}
function quietNow(p,parts){
  const a=clockMinutes(p.quiet_hours_start),b=clockMinutes(p.quiet_hours_end),n=parts?.minutes;
  if(a==null||b==null||n==null||a===b)return false;
  return a<b?(n>=a&&n<b):(n>=a||n<b);
}
function dueStudy(p,parts){
  const target=clockMinutes(p.study_time),n=parts?.minutes;if(target==null||n==null)return false;
  let diff=n-target;if(diff<0)diff+=1440;
  return diff>=0&&diff<=5;
}
async function dispatch(){
  const now=new Date(),nowIso=now.toISOString(),maxIso=new Date(now.getTime()+24*60*60*1000).toISOString(),oldIso=new Date(now.getTime()-6*60*60*1000).toISOString();
  const prefRows=await rest('notification_preferences?select=user_id,enabled,study_reminders,task_reminders,product_updates,study_time,timezone,task_lead_minutes,quiet_hours_start,quiet_hours_end&enabled=eq.true&limit=5000',{method:'GET'})||[];
  const prefMap=new Map(prefRows.map(p=>[String(p.user_id),p]));
  let sent=0,attempted=0;

  for(const p of prefRows){
    const parts=localParts(p.timezone||'UTC',now);if(!parts||quietNow(p,parts))continue;
    if(p.study_reminders&&dueStudy(p,parts)){
      attempted++;
      const out=await sendUser(String(p.user_id),'study:'+parts.date,{title:'Time to study with SCHOLARK',body:'Keep your learning momentum going. Open SCHOLARK and continue your study plan.',url:'/#dashboard',tag:'scholark-study-'+parts.date,kind:'study',ttl:7200});
      sent+=out.sent||0;
    }
  }

  const tasks=await rest('planner_tasks?select=id,user_id,title,subject,due_at,status,source&status=in.(todo,doing)&due_at=gte.'+encodeURIComponent(oldIso)+'&due_at=lte.'+encodeURIComponent(maxIso)+'&order=due_at.asc&limit=2500',{method:'GET'})||[];
  for(const t of tasks){
    const p=prefMap.get(String(t.user_id));if(!p?.task_reminders||!t.due_at)continue;
    const parts=localParts(p.timezone||'UTC',now);if(!parts||quietNow(p,parts))continue;
    const due=new Date(t.due_at).getTime(),delta=Math.round((due-now.getTime())/60000),lead=Math.max(5,Math.min(1440,Number(p.task_lead_minutes)||60));
    if(delta>lead||delta < -360)continue;
    const assignment=/assignment|opdracht/i.test(String(t.source||'')+' '+String(t.title||''))?'assignment':'task';
    const when=delta<0?'This item is overdue.':delta<=5?'This is due now.':'Due in about '+(delta<60?delta+' minutes':Math.max(1,Math.round(delta/60))+' hours')+'.';
    const key='task:'+t.id+':'+String(t.due_at)+':'+lead;attempted++;
    const out=await sendUser(String(t.user_id),key,{title:(assignment==='assignment'?'Assignment':'Task')+': '+clean(t.title,120),body:when+(t.subject?' · '+clean(t.subject,80):''),url:'/#planner',tag:'scholark-task-'+t.id,kind:assignment,ttl:Math.max(900,Math.min(86400,(lead+60)*60)),urgency:delta<=30?'high':'normal'});
    sent+=out.sent||0;
  }

  const reminders=await rest('notification_reminders?select=id,user_id,kind,title,body,url,due_at,dedupe_key,status&status=eq.pending&due_at=lte.'+encodeURIComponent(nowIso)+'&order=due_at.asc&limit=500',{method:'GET'})||[];
  for(const r of reminders){
    const p=prefMap.get(String(r.user_id));if(!p)continue;
    if(r.kind==='update'&&!p.product_updates)continue;
    const parts=localParts(p.timezone||'UTC',now);if(parts&&quietNow(p,parts)&&r.kind!=='assignment')continue;
    const key=clean(r.dedupe_key,240)||'reminder:'+r.id;attempted++;
    const out=await sendUser(String(r.user_id),key,{title:clean(r.title,180),body:clean(r.body,600),url:clean(r.url,500)||'/#dashboard',tag:'scholark-reminder-'+r.id,kind:r.kind||'custom',ttl:86400});
    sent+=out.sent||0;
    if((out.sent||0)>0)await rest('notification_reminders?id=eq.'+encodeURIComponent(r.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'sent',sent_at:nowIso,updated_at:nowIso})});
  }
  return {ok:true,attempted,sent,preferences:prefRows.length,tasks:tasks.length,reminders:reminders.length,at:nowIso};
}

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return previousEmit.call(this,type,...args);
  const [req,res]=args;let url;try{url=new URL(req.url||'/','http://localhost')}catch{return previousEmit.call(this,type,...args)}
  const method=String(req.method||'GET').toUpperCase(),path=url.pathname;

  if(method==='GET'&&path==='/api/notifications/health'){
    json(res,200,{ok:true,version:VERSION,configured:!!(SERVICE&&VAPID_PUBLIC&&VAPID_PRIVATE&&DISPATCH_SECRET),webPush:!!(VAPID_PUBLIC&&VAPID_PRIVATE),database:!!SERVICE,schedulerSecret:!!DISPATCH_SECRET});
    return true;
  }
  if(method==='GET'&&path==='/api/notifications/config'){
    json(res,200,{ok:true,enabled:!!(VAPID_PUBLIC&&VAPID_PRIVATE&&SERVICE),publicKey:VAPID_PUBLIC||null,serviceWorker:'/scholark-sw.js',manifest:'/manifest.webmanifest',version:VERSION});
    return true;
  }
  if(method==='POST'&&path==='/api/notifications/dispatch'){
    const supplied=String(req.headers?.['x-scholark-dispatch-secret']||'');
    if(!DISPATCH_SECRET||!safeEqual(supplied,DISPATCH_SECRET)){json(res,403,{ok:false,code:'DISPATCH_FORBIDDEN'});return true}
    readJson(req,4096).catch(()=>({})).then(()=>dispatch()).then(x=>json(res,200,x)).catch(e=>json(res,503,{ok:false,code:'DISPATCH_FAILED',error:clean(e?.message||e,300)}));return true;
  }

  if(path.startsWith('/api/notifications/')){
    currentUser(req).then(async user=>{
      if(!user)return json(res,401,{ok:false,code:'AUTH_REQUIRED'});
      if(method==='GET'&&path==='/api/notifications/preferences'){
        const rows=await rest('notification_preferences?select=*&user_id=eq.'+encodeURIComponent(user.id)+'&limit=1',{method:'GET'});
        return json(res,200,{ok:true,preferences:Array.isArray(rows)&&rows[0]?rows[0]:prefsDefaults(user.id)});
      }
      if(method==='POST'&&path==='/api/notifications/preferences'){
        const body=await readJson(req,16384),old=prefsDefaults(user.id);
        const tz=clean(body.timezone,80),study=clean(body.study_time,8),qs=clean(body.quiet_hours_start,8),qe=clean(body.quiet_hours_end,8);
        const payload={...old,user_id:user.id,enabled:body.enabled!==false,study_reminders:body.study_reminders!==false,task_reminders:body.task_reminders!==false,product_updates:body.product_updates===true,study_time:validTime(study)?study+':00':'19:00:00',timezone:validTimezone(tz)?tz:'UTC',task_lead_minutes:Math.max(5,Math.min(1440,Number(body.task_lead_minutes)||60)),quiet_hours_start:validTime(qs)?qs+':00':'22:00:00',quiet_hours_end:validTime(qe)?qe+':00':'07:00:00',updated_at:new Date().toISOString()};
        const rows=await rest('notification_preferences?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(payload)});
        return json(res,200,{ok:true,preferences:Array.isArray(rows)?rows[0]:payload});
      }
      if(method==='POST'&&path==='/api/notifications/subscription'){
        const body=await readJson(req,32768),sub=body.subscription||body,endpoint=clean(sub.endpoint,4096),p256dh=clean(sub.keys?.p256dh,512),auth=clean(sub.keys?.auth,512);
        if(!/^https:\/\//i.test(endpoint)||!p256dh||!auth)return json(res,400,{ok:false,code:'INVALID_PUSH_SUBSCRIPTION'});
        const ua=clean(req.headers?.['user-agent'],500),payload={user_id:user.id,endpoint,p256dh,auth,expiration_time:Number.isFinite(Number(sub.expirationTime))?Number(sub.expirationTime):null,user_agent:ua,platform:clean(body.platform,80)||platformFromUA(ua),device_label:clean(body.deviceLabel,120)||platformFromUA(ua),enabled:true,last_seen_at:new Date().toISOString(),updated_at:new Date().toISOString()};
        const rows=await rest('push_subscriptions?on_conflict=user_id,endpoint',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(payload)});
        await rest('notification_preferences?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(prefsDefaults(user.id))}).catch(()=>{});
        return json(res,200,{ok:true,subscription:Array.isArray(rows)?rows[0]:null});
      }
      if(method==='POST'&&path==='/api/notifications/unsubscribe'){
        const body=await readJson(req,8192),endpoint=clean(body.endpoint,4096);if(!endpoint)return json(res,400,{ok:false,code:'ENDPOINT_REQUIRED'});
        await rest('push_subscriptions?user_id=eq.'+encodeURIComponent(user.id)+'&endpoint=eq.'+encodeURIComponent(endpoint),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({enabled:false,updated_at:new Date().toISOString()})});
        return json(res,200,{ok:true});
      }
      if(method==='POST'&&path==='/api/notifications/test'){
        const body=await readJson(req,8192),key='test:'+Date.now();
        const out=await sendUser(user.id,key,{title:'SCHOLARK notifications are ready',body:clean(body.body,220)||'Study reminders, due tasks and important SCHOLARK updates can now reach this device.',url:'/#dashboard',tag:'scholark-test',kind:'test',ttl:600,urgency:'normal'});
        return json(res,200,{ok:true,...out});
      }
      json(res,404,{ok:false,code:'NOTIFICATION_ROUTE_NOT_FOUND'});
    }).catch(e=>json(res,e?.code==='REQUEST_TOO_LARGE'?413:400,{ok:false,code:e?.code||'NOTIFICATION_REQUEST_FAILED',error:clean(e?.message||e,300)}));
    return true;
  }
  return previousEmit.call(this,type,...args);
};

setInterval(()=>{
  const now=Date.now();for(const [k,v] of authCache)if(v.expires<now)authCache.delete(k);
},60000).unref?.();

console.log('[SCHOLARK] Notification route ready · '+VERSION+' · web push '+(VAPID_PUBLIC&&VAPID_PRIVATE?'configured':'not configured'));
