import { createClient } from "jsr:@supabase/supabase-js@2";
import webpushPkg from "npm:web-push@3.6.7";

const webpush:any=webpushPkg;
const SUPABASE_URL=Deno.env.get("SUPABASE_URL")||"";
const SERVICE_KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const sb=createClient(SUPABASE_URL,SERVICE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const SITE="https://scholark-app-shawiel.onrender.com";
const j=(body:any,status=200)=>new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});

function safeEq(a:string,b:string){if(!a||!b||a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
function hhmm(v:any){const m=String(v||"").match(/^(\d{1,2}):(\d{2})/);return m?Math.min(1439,Math.max(0,Number(m[1])*60+Number(m[2]))):0}
function localMinutes(tz:string){try{const parts=new Intl.DateTimeFormat("en-GB",{timeZone:tz||"UTC",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());return Number(parts.find(x=>x.type==="hour")?.value||0)*60+Number(parts.find(x=>x.type==="minute")?.value||0)}catch{return new Date().getUTCHours()*60+new Date().getUTCMinutes()}}
function quiet(p:any){const now=localMinutes(p?.timezone||"UTC"),a=hhmm(p?.quiet_hours_start||"22:00"),b=hhmm(p?.quiet_hours_end||"07:00");return a===b?false:(a<b?now>=a&&now<b:now>=a||now<b)}
function safeUrl(v:any){const s=String(v||"/#dashboard").trim();return s.startsWith("/")&&!s.startsWith("//")?s:"/#dashboard"}
async function config(){const {data,error}=await sb.rpc("get_notification_dispatch_config");if(error||!data)throw new Error("notification_config_unavailable");return data}
async function prefs(uid:string){const {data}=await sb.from("notification_preferences").select("*").eq("user_id",uid).maybeSingle();return data||{enabled:true,task_reminders:true,payment_reminders:true,timezone:"UTC",task_lead_minutes:60,quiet_hours_start:"22:00",quiet_hours_end:"07:00"}}
async function alreadySent(uid:string,key:string){const {data}=await sb.from("notification_delivery_log").select("id").eq("user_id",uid).eq("dedupe_key",key).eq("status","sent").limit(1);return !!data?.length}
async function pushUser(uid:string,key:string,payload:any,cfg:any){
  if(await alreadySent(uid,key))return {sent:0,skipped:true};
  const {data:subs}=await sb.from("push_subscriptions").select("id,endpoint,p256dh,auth").eq("user_id",uid).eq("enabled",true).limit(25);
  if(!subs?.length)return {sent:0,noDevices:true};
  webpush.setVapidDetails(SITE,cfg.vapid_public,cfg.vapid_private);
  let sent=0;
  for(const sub of subs){
    try{
      await webpush.sendNotification({endpoint:sub.endpoint,keys:{p256dh:sub.p256dh,auth:sub.auth}},JSON.stringify(payload),{TTL:3600,urgency:"normal"});
      sent++;
      await sb.from("notification_delivery_log").insert({user_id:uid,subscription_id:sub.id,dedupe_key:key,status:"sent"});
    }catch(e:any){
      const code=Number(e?.statusCode||e?.status||0);
      if(code===404||code===410)await sb.from("push_subscriptions").update({enabled:false,updated_at:new Date().toISOString()}).eq("id",sub.id);
      await sb.from("notification_delivery_log").insert({user_id:uid,subscription_id:sub.id,dedupe_key:key,status:"failed",error:String(e?.message||e).slice(0,500)});
    }
  }
  return {sent};
}
async function dispatchCustom(cfg:any){
  const now=new Date();
  const {data:rows}=await sb.from("notification_reminders").select("id,user_id,kind,title,body,url,due_at,dedupe_key").eq("status","pending").lte("due_at",now.toISOString()).order("due_at").limit(300);
  let sent=0;
  for(const r of rows||[]){
    const p=await prefs(r.user_id);if(p.enabled===false||quiet(p))continue;
    if(r.kind==="payment"&&p.payment_reminders===false)continue;
    if(["task","assignment","homework"].includes(r.kind)&&p.task_reminders===false)continue;
    const key=r.dedupe_key||("reminder:"+r.id);
    const out=await pushUser(r.user_id,key,{title:r.title||"SCHOLARK reminder",body:r.body||"",url:safeUrl(r.url),tag:key,kind:r.kind},cfg);
    if(out.sent>0){sent+=out.sent;await sb.from("notification_reminders").update({status:"sent",sent_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",r.id)}
  }
  return sent;
}
function plannerType(notes:any){const s=String(notes||"");const m=s.match(/"type"\s*:\s*"([^"]+)"/i);return String(m?.[1]||"task").toLowerCase()}
async function dispatchPlanner(cfg:any){
  const now=Date.now(),until=new Date(now+24*60*60*1000).toISOString(),from=new Date(now-60*60*1000).toISOString();
  const {data:rows}=await sb.from("planner_tasks").select("id,user_id,title,subject,notes,due_at,status").in("status",["todo","doing"]).not("due_at","is",null).gte("due_at",from).lte("due_at",until).limit(500);
  let sent=0;
  for(const r of rows||[]){
    const p=await prefs(r.user_id);if(p.enabled===false||p.task_reminders===false||quiet(p))continue;
    const due=new Date(r.due_at).getTime(),lead=Math.max(5,Math.min(1440,Number(p.task_lead_minutes)||60))*60000;
    if(now<due-lead||now>due+15*60000)continue;
    const type=plannerType(r.notes),kind=type==="homework"?"homework":"task",key="planner:"+r.id+":"+r.due_at+":"+Math.round(lead/60000);
    const out=await pushUser(r.user_id,key,{title:kind==="homework"?"Homework reminder":"Task reminder",body:(r.title||"Study task")+(r.subject?" · "+r.subject:""),url:"/#planner",tag:key,kind},cfg);sent+=out.sent||0;
  }
  return sent;
}
async function dispatchPayments(cfg:any){
  const now=Date.now(),until=new Date(now+4*24*60*60*1000).toISOString();
  const {data:rows}=await sb.from("billing_subscriptions").select("user_id,plan,status,current_period_end,paddle_subscription_id").in("status",["active","past_due"]).not("current_period_end","is",null).lte("current_period_end",until).limit(500);
  let sent=0;
  for(const r of rows||[]){
    const p=await prefs(r.user_id);if(p.enabled===false||p.payment_reminders===false||quiet(p))continue;
    const end=new Date(r.current_period_end).getTime(),remaining=end-now;
    let key="",title="",body="";
    if(r.status==="past_due"){const day=new Date().toISOString().slice(0,10);key="payment:past-due:"+String(r.paddle_subscription_id||r.user_id)+":"+day;title="SCHOLARK payment needs attention";body="Your "+String(r.plan||"paid")+" plan payment is past due. Open billing to review it."}
    else if(remaining>0&&remaining<=24*60*60*1000){key="payment:1d:"+String(r.paddle_subscription_id||r.user_id)+":"+r.current_period_end;title="SCHOLARK payment reminder";body="Your "+String(r.plan||"paid")+" plan is scheduled to renew within 24 hours."}
    else if(remaining>24*60*60*1000&&remaining<=72*60*60*1000){key="payment:3d:"+String(r.paddle_subscription_id||r.user_id)+":"+r.current_period_end;title="SCHOLARK payment reminder";body="Your "+String(r.plan||"paid")+" plan is scheduled to renew within 3 days."}
    if(!key)continue;
    const out=await pushUser(r.user_id,key,{title,body,url:"/#home",tag:key,kind:"payment"},cfg);sent+=out.sent||0;
  }
  return sent;
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response(null,{headers:{"access-control-allow-origin":SITE,"access-control-allow-headers":"content-type,x-scholark-dispatch-key"}});
  if(req.method!=="POST")return j({ok:false,code:"METHOD_NOT_ALLOWED"},405);
  try{
    const cfg=await config(),key=req.headers.get("x-scholark-dispatch-key")||"";
    if(!safeEq(key,String(cfg.dispatch_secret||"")))return j({ok:false,code:"UNAUTHORIZED"},401);
    const [custom,planner,payments]=await Promise.all([dispatchCustom(cfg),dispatchPlanner(cfg),dispatchPayments(cfg)]);
    return j({ok:true,custom,planner,payments,at:new Date().toISOString()});
  }catch(e:any){return j({ok:false,code:"DISPATCH_FAILED",error:String(e?.message||e).slice(0,300)},500)}
});
