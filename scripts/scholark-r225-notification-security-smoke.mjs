const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const fail=[];const check=(c,m)=>{if(!c)fail.push(m)};
async function get(path){const r=await fetch(base+path,{cache:'no-store'});const text=await r.text();let data=null;try{data=JSON.parse(text)}catch{}return{r,text,data}}
async function post(path,body={},headers={}){const r=await fetch(base+path,{method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(body)});const text=await r.text();let data=null;try{data=JSON.parse(text)}catch{}return{r,text,data}}

const manifest=await get('/manifest.webmanifest');
check(manifest.r.status===200,'manifest not served');
check(/SCHOLARK/.test(manifest.text)&&/"display"\s*:\s*"standalone"/.test(manifest.text),'manifest is incomplete');

const sw=await get('/scholark-sw.js');
check(sw.r.status===200,'service worker not served');
check(sw.text.includes("addEventListener('push'")&&sw.text.includes('showNotification')&&sw.text.includes("addEventListener('notificationclick'"),'push service worker contract missing');

const health=await get('/api/notifications/health');
check(health.r.status===200&&health.data?.ok===true,'notification health failed');
check(typeof health.data?.webPush==='boolean'&&typeof health.data?.database==='boolean','notification health capability flags missing');

const config=await get('/api/notifications/config');
check(config.r.status===200&&config.data?.ok===true,'notification config failed');
check(config.data?.serviceWorker==='/scholark-sw.js'&&config.data?.manifest==='/manifest.webmanifest','notification client asset config missing');

const prefs=await get('/api/notifications/preferences');
check(prefs.r.status===401,'unauthenticated notification preferences were not blocked');

const test=await post('/api/notifications/test',{});
check(test.r.status===401,'unauthenticated test push was not blocked');

const dispatch=await post('/api/notifications/dispatch',{source:'smoke'});
check(dispatch.r.status===403&&dispatch.data?.code==='DISPATCH_FORBIDDEN','notification dispatcher is not secret-protected');

const api=await get('/api/guard/health');
check(api.r.status===200&&api.data?.pushNotificationGuards===true&&api.data?.schoolDiscoveryGuards===true,'central school/push abuse guards missing');
check(String(api.r.headers.get('permissions-policy')||'').includes('publickey-credentials-get=(self)'),'Permissions-Policy account protection missing');

if(fail.length){console.error('SCHOLARK R225 NOTIFICATION SECURITY SMOKE FAILED');fail.forEach(x=>console.error(' - '+x));process.exit(1)}
console.log('SCHOLARK R225 NOTIFICATION SECURITY SMOKE PASS');
