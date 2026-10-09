(() => {
  if(window.__SCHOLARK_NOTIFICATIONS__)return;
  const RELEASE='r236-notifications';
  const VAPID_PUBLIC='BCZr66dMfGomd-lDQTaglxhFbjYCd4vZ55AKZ_Nwp_p4WC4P-UCCyOG9WL_0Nnes_HD4eCdQIi3igZ2I4kgREqA';
  const ASSIGN_KEY='scholark_v106_assignments',ONBOARD_KEY='scholark_notification_onboarding_pending';
  const $=(s,r=document)=>r?.querySelector?.(s)||null,$$=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=(s,n=240)=>String(s??'').replace(/\s+/g,' ').trim().slice(0,n);
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let syncTimer=0,onboardTimer=0;

  const css=document.createElement('style');css.id='scholark-v121-style';css.textContent=`
    .v121{max-width:1180px;margin:0 auto;padding:32px;font-family:Inter,system-ui;color:#17191f}.v121-k{font:950 8px Inter;letter-spacing:.15em;color:#6d5dfc}.v121 h1{font:950 clamp(38px,5vw,60px)/.94 Inter;letter-spacing:-.055em;margin:8px 0}.v121>p{font:600 11px/1.6 Inter;color:#716d78;max-width:850px;margin:0 0 18px}.v121-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:12px}.v121-card{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:22px;padding:18px;box-shadow:0 14px 45px rgba(31,27,63,.04)}.v121-card h2{font:950 17px Inter;margin:0 0 7px}.v121-card p{font:600 9px/1.5 Inter;color:#74707b;margin:0 0 10px}.v121-state{display:flex;gap:7px;flex-wrap:wrap;margin:9px 0}.v121-pill{padding:6px 8px;border-radius:99px;background:#f0eef8;color:#5e566b;font:850 7.5px Inter}.v121-pill.ok{background:#e9f8de;color:#406d2b}.v121-pill.warn{background:#fff0d9;color:#875512}.v121-btn{border:0;border-radius:11px;background:#17191f;color:#fff;padding:11px 13px;font:900 8.5px Inter;cursor:pointer}.v121-btn.alt{background:#ece9ff;color:#5547ca}.v121-btn.danger{background:#fff0ed;color:#9a4034}.v121-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.v121-form{display:grid;gap:8px}.v121-form input,.v121-form select{width:100%;box-sizing:border-box;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:12px;padding:11px 12px;font:650 9px Inter}.v121-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v121-list{display:grid;gap:8px;margin-top:11px}.v121-item{border:1px solid rgba(23,25,31,.08);background:#faf9f7;border-radius:14px;padding:11px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px;align-items:center}.v121-item b{font:900 9px Inter}.v121-item span{display:block;margin-top:4px;font:650 7.5px/1.4 Inter;color:#777}.v121-settings{display:grid;gap:8px}.v121-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid rgba(23,25,31,.08);border-radius:13px;padding:10px 11px}.v121-toggle b{font:850 8.5px Inter}.v121-toggle input{width:18px;height:18px}.v121-note{margin-top:10px;padding:10px 11px;border-radius:12px;background:#f3f1ff;color:#655b86;font:700 8px/1.5 Inter}.v121-status{margin-top:9px;min-height:18px;font:750 8px/1.4 Inter;color:#5c527a}.v121-onboard{position:fixed;inset:0;z-index:2147483646;background:rgba(16,14,24,.62);display:none;place-items:center;padding:18px}.v121-onboard.open{display:grid}.v121-onboard-card{width:min(540px,100%);background:#fff;border-radius:24px;padding:24px;box-shadow:0 30px 100px rgba(0,0,0,.3)}.v121-onboard-card h2{font:950 28px/1 Inter;margin:8px 0}.v121-onboard-card p{font:650 10px/1.6;color:#6e6875}.v121-onboard-card small{font:900 7.5px Inter;letter-spacing:.12em;color:#6d5dfc}
    @media(max-width:820px){.v121-grid{grid-template-columns:1fr}.v121{padding:24px 14px}}@media(max-width:520px){.v121-row{grid-template-columns:1fr}}
  `;document.head.appendChild(css);

  const supported=()=>isSecureContext&&'serviceWorker'in navigator&&'PushManager'in window&&'Notification'in window;
  const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent||'');
  const standalone=()=>matchMedia?.('(display-mode: standalone)')?.matches||navigator.standalone===true;
  const timezone=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}catch{return'UTC'}};
  const uaPlatform=()=>clean(navigator.userAgentData?.platform||navigator.platform||'Device',80);
  const browserName=()=>{const u=navigator.userAgent||'';return /Edg\//.test(u)?'Edge':/Firefox\//.test(u)?'Firefox':/CriOS|Chrome\//.test(u)?'Chrome':/Safari\//.test(u)?'Safari':'Browser'};
  const deviceLabel=()=>browserName()+' on '+uaPlatform();
  const b64Key=s=>{const pad='='.repeat((4-s.length%4)%4),raw=atob((s+pad).replace(/-/g,'+').replace(/_/g,'/')),a=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)a[i]=raw.charCodeAt(i);return a};
  async function ctx(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  async function req(path,opts={}){const x=await ctx();if(!x)throw new Error('Sign in to SCHOLARK first.');const r=await x.c.request(path,opts),d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.message||d?.error||'Notification request failed.');return {x,d,r}}
  async function sw(){if(!supported())throw new Error('Push notifications are not supported in this browser.');await navigator.serviceWorker.register('/scholark-sw.js',{scope:'/'});return navigator.serviceWorker.ready}
  async function subscription(){if(!supported())return null;try{return(await navigator.serviceWorker.ready).pushManager.getSubscription()}catch{return null}}
  async function currentDeviceReady(){if(!supported()||Notification.permission!=='granted')return false;return !!(await subscription())}
  async function ensureReminderDelivery(){
    if(!supported())return {linked:false,message:'This browser cannot receive Web Push, but the reminder can still sync to your other linked devices.'};
    if(Notification.permission==='denied')return {linked:false,message:'Notifications are blocked on this device. The reminder is saved for any other linked devices.'};
    if(Notification.permission==='default'){try{await linkDevice();return {linked:true,message:' This device is now linked too.'}}catch(e){return {linked:false,message:' '+clean(e?.message||e,220)}}}
    if(await currentDeviceReady())return {linked:true,message:''};
    try{await linkDevice();return {linked:true,message:' This device is now linked too.'}}catch(e){return {linked:false,message:' '+clean(e?.message||e,220)}}
  }
  async function linkDevice(){
    const c=cloud(),cached=c?.currentSession?.();
    if(!cached?.user?.id){c?.openAuth?.('signin');throw new Error('Sign in, then link this device.')}
    if(!supported())throw new Error('This browser does not support web push notifications.');
    if(isIOS()&&!standalone())throw new Error('On iPhone/iPad, add SCHOLARK to your Home Screen first, open it from there, then link this device.');
    let permission=Notification.permission;
    if(permission==='default')permission=await Notification.requestPermission();
    if(permission!=='granted')throw new Error('Notification permission is blocked. Allow notifications for SCHOLARK in your browser/device settings, then try again.');
    const x=await ctx();if(!x)throw new Error('Your SCHOLARK session expired. Sign in and try again.');
    const reg=await sw();let sub=await reg.pushManager.getSubscription();
    if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64Key(VAPID_PUBLIC)});
    const j=sub.toJSON(),body={user_id:x.uid,endpoint:j.endpoint,p256dh:j.keys?.p256dh||'',auth:j.keys?.auth||'',expiration_time:j.expirationTime||null,user_agent:(navigator.userAgent||'').slice(0,500),platform:uaPlatform(),device_label:deviceLabel(),enabled:true,last_seen_at:new Date().toISOString(),updated_at:new Date().toISOString()};
    const r=await x.c.request('/rest/v1/push_subscriptions?on_conflict=user_id,endpoint&select=id,device_label,platform,enabled,last_seen_at',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(body)});
    if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d?.message||'Could not link this device.')}
    await savePrefs({device_onboarding_done:true,timezone:timezone()});
    try{localStorage.removeItem(ONBOARD_KEY)}catch{}
    return true
  }
  async function savePrefs(patch){
    const x=await ctx();if(!x)return false;
    const body={user_id:x.uid,timezone:timezone(),updated_at:new Date().toISOString(),...patch};
    const r=await x.c.request('/rest/v1/notification_preferences?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});
    return r.ok
  }
  async function load(){
    const x=await ctx();if(!x)return null;
    const [p,d,r]=await Promise.all([
      x.c.request('/rest/v1/notification_preferences?select=*&user_id=eq.'+encodeURIComponent(x.uid)+'&limit=1'),
      x.c.request('/rest/v1/push_subscriptions?select=id,device_label,platform,enabled,last_seen_at,created_at&user_id=eq.'+encodeURIComponent(x.uid)+'&order=last_seen_at.desc'),
      x.c.request('/rest/v1/notification_reminders?select=id,kind,title,body,url,due_at,status,created_at&user_id=eq.'+encodeURIComponent(x.uid)+'&status=eq.pending&order=due_at.asc&limit=100')
    ]);
    const pd=await p.json().catch(()=>[]),dd=await d.json().catch(()=>[]),rd=await r.json().catch(()=>[]);
    const pref=(Array.isArray(pd)?pd[0]:pd)||{enabled:true,study_reminders:true,task_reminders:true,payment_reminders:true,timezone:timezone(),task_lead_minutes:60,quiet_hours_start:'22:00:00',quiet_hours_end:'07:00:00'};
    return {x,pref,devices:Array.isArray(dd)?dd:[],reminders:Array.isArray(rd)?rd:[]}
  }
  async function createReminder({title,body='',kind='custom',when,url='/#reminders',dedupeKey=null}){
    const x=await ctx();if(!x)throw new Error('Sign in first.');
    const dt=new Date(when);if(!title||!Number.isFinite(dt.getTime())||dt.getTime()<Date.now()-60000)throw new Error('Choose a valid reminder time.');
    const payload={user_id:x.uid,kind:['study','task','assignment','homework','payment','update','custom'].includes(kind)?kind:'custom',title:clean(title,180),body:clean(body,600),url:safeUrl(url),due_at:dt.toISOString(),dedupe_key:dedupeKey,status:'pending',updated_at:new Date().toISOString()};
    const r=await x.c.request('/rest/v1/notification_reminders',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)}),d=await r.json().catch(()=>null);
    if(!r.ok)throw new Error(d?.message||'Could not save reminder.');return d
  }
  function safeUrl(v){const s=String(v||'/#reminders');return s.startsWith('/')&&!s.startsWith('//')?s:'/#reminders'}
  async function cancelReminder(id){const x=await ctx();if(!x)return;await x.c.request('/rest/v1/notification_reminders?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'cancelled',updated_at:new Date().toISOString()})})}
  async function unlinkDevice(id){const x=await ctx();if(!x)return;await x.c.request('/rest/v1/push_subscriptions?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{Prefer:'return=minimal'}})}
  function localAssignments(){try{const a=JSON.parse(localStorage.getItem(ASSIGN_KEY)||'[]');return Array.isArray(a)?a:[]}catch{return[]}}
  async function syncAssignments(){
    clearTimeout(syncTimer);
    const x=await ctx();if(!x)return;
    const s=await load();if(!s)return;
    const lead=Math.max(5,Math.min(1440,Number(s.pref.task_lead_minutes)||60)),active=localAssignments().filter(a=>a&&a.status!=='complete'&&a.dueDate&&a.id);
    const existingReq=await x.c.request('/rest/v1/notification_reminders?select=id,dedupe_key,status&user_id=eq.'+encodeURIComponent(x.uid)+'&dedupe_key=like.local-assignment:%');
    const existing=await existingReq.json().catch(()=>[]),want=new Set();
    for(const a of active){
      const due=new Date(a.dueDate+'T18:00:00');if(!Number.isFinite(due.getTime()))continue;
      let remind=new Date(due.getTime()-lead*60000);if(remind.getTime()<Date.now()&&due.getTime()>Date.now())remind=new Date(Date.now()+60000);
      const key='local-assignment:'+clean(a.id,90)+':'+a.dueDate;want.add(key);
      const old=(Array.isArray(existing)?existing:[]).find(r=>r.dedupe_key===key);
      const kind=String(a.type||'assignment').toLowerCase()==='homework'?'homework':'assignment',payload={kind,title:(kind==='homework'?'Homework reminder · ':'Assignment reminder · ')+clean(a.title,130),body:[clean(a.subject,100),clean(a.instructions,260)].filter(Boolean).join(' · '),url:'/#assignments',due_at:remind.toISOString(),status:'pending',updated_at:new Date().toISOString()};
      if(old)await x.c.request('/rest/v1/notification_reminders?id=eq.'+encodeURIComponent(old.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(payload)});
      else await x.c.request('/rest/v1/notification_reminders',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({user_id:x.uid,dedupe_key:key,...payload})});
    }
    for(const old of Array.isArray(existing)?existing:[])if(!want.has(old.dedupe_key)&&old.status==='pending')await cancelReminder(old.id);
  }
  function fmt(v){try{return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(v))}catch{return String(v||'')}}
  async function open(){
    const host=$('#v51-fallback');if(!host)return;
    const s=await load();
    if(!s){host.innerHTML='<div class="v121"><div class="v121-k">SCHOLARK · REMINDERS</div><h1>Reminders & notifications.</h1><p>Sign in to link devices and keep reminders synced.</p><button class="v121-btn" id="v121-signin">Sign in / Create account</button></div>';$('#v121-signin').onclick=()=>cloud()?.openAuth?.('signin');return}
    const perm=supported()?Notification.permission:'unsupported',linked=s.devices.filter(x=>x.enabled).length;
    const iosHelp=isIOS()&&!standalone()?'<div class="v121-note">iPhone/iPad: add SCHOLARK to your Home Screen and open it there before linking push notifications.</div>':'';
    host.innerHTML=`<div class="v121"><div class="v121-k">SCHOLARK · REMINDERS</div><h1>Stay ahead without keeping SCHOLARK open.</h1><p>Link the devices you use, set your own reminders and let SCHOLARK remind you about tasks, homework, assignments and upcoming payments.</p>
      <div class="v121-grid"><section class="v121-card"><h2>Devices</h2><p>Link one or more devices to the same SCHOLARK account. Each phone, tablet, laptop or PC is linked separately: open SCHOLARK on that device, sign in and choose “Link this device”.</p><div class="v121-state"><span class="v121-pill ${linked?'ok':'warn'}">${linked} linked device${linked===1?'':'s'}</span><span class="v121-pill ${perm==='granted'?'ok':'warn'}">Permission: ${esc(perm)}</span></div><div class="v121-actions"><button class="v121-btn" id="v121-link">Link this device</button><button class="v121-btn alt" id="v121-test">Queue test notification</button></div>${iosHelp}<div class="v121-note">Smartwatches usually mirror notifications from the linked phone when watch notification mirroring is enabled.</div><div class="v121-list" id="v121-devices">${s.devices.length?s.devices.map(d=>'<div class="v121-item"><div><b>'+esc(d.device_label||d.platform||'Linked device')+'</b><span>Last seen '+esc(fmt(d.last_seen_at))+(d.enabled?' · enabled':' · disabled')+'</span></div><button class="v121-btn danger" data-v121-unlink="'+esc(d.id)+'">Unlink</button></div>').join(''):'<div class="v121-item"><div><b>No linked devices yet</b><span>Link this device to receive push reminders.</span></div></div>'}</div></section>
      <section class="v121-card"><h2>Set a reminder</h2><div class="v121-form"><input id="v121-title" placeholder="What should SCHOLARK remind you about?"><div class="v121-row"><input id="v121-date" type="date"><input id="v121-time" type="time"></div><select id="v121-kind"><option value="custom">General reminder</option><option value="study">Study reminder</option><option value="homework">Homework</option><option value="assignment">Assignment</option></select><button class="v121-btn" id="v121-create">Set reminder</button></div><div class="v121-status" id="v121-status"></div><div class="v121-list" id="v121-reminders">${s.reminders.length?s.reminders.map(r=>'<div class="v121-item"><div><b>'+esc(r.title)+'</b><span>'+esc(r.kind)+' · '+esc(fmt(r.due_at))+'</span></div><button class="v121-btn danger" data-v121-cancel="'+esc(r.id)+'">Cancel</button></div>').join(''):'<div class="v121-item"><div><b>No pending reminders</b><span>Create one above whenever you need it.</span></div></div>'}</div></section>
      <section class="v121-card"><h2>Automatic reminders</h2><div class="v121-settings"><label class="v121-toggle"><b>Notifications enabled</b><input id="v121-enabled" type="checkbox" ${s.pref.enabled!==false?'checked':''}></label><label class="v121-toggle"><b>Assignments, homework & Planner tasks</b><input id="v121-task" type="checkbox" ${s.pref.task_reminders!==false?'checked':''}></label><label class="v121-toggle"><b>Payment & renewal reminders</b><input id="v121-payment" type="checkbox" ${s.pref.payment_reminders!==false?'checked':''}></label><label class="v121-toggle"><b>Study reminders</b><input id="v121-study" type="checkbox" ${s.pref.study_reminders!==false?'checked':''}></label><div class="v121-row"><label class="v121-form"><span>Daily study time</span><input id="v121-study-time" type="time" value="${esc(String(s.pref.study_time||'19:00').slice(0,5))}"></label><label class="v121-form"><span>Remind before task</span><select id="v121-lead">${[[15,'15 minutes'],[30,'30 minutes'],[60,'1 hour'],[120,'2 hours'],[1440,'1 day']].map(x=>'<option value="'+x[0]+'" '+(Number(s.pref.task_lead_minutes)===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')}</select></label><label class="v121-form"><span>Timezone</span><input value="${esc(timezone())}" disabled></label></div><div class="v121-row"><label class="v121-form"><span>Quiet hours start</span><input id="v121-quiet-start" type="time" value="${esc(String(s.pref.quiet_hours_start||'22:00').slice(0,5))}"></label><label class="v121-form"><span>Quiet hours end</span><input id="v121-quiet-end" type="time" value="${esc(String(s.pref.quiet_hours_end||'07:00').slice(0,5))}"></label></div><button class="v121-btn alt" id="v121-save">Save notification settings</button></div></section>
      <section class="v121-card"><h2>How device linking works</h2><p>SCHOLARK never links a device silently. Browser notification permission is only requested after you press “Link this device”. You can unlink any device here at any time.</p><div class="v121-note">Android, Windows, macOS and most modern desktop/mobile browsers support Web Push. On iPhone/iPad, Web Push works from an installed Home Screen web app. A smartwatch normally receives the phone’s mirrored notification rather than registering directly with the website.</div></section></div></div>`;
    const st=$('#v121-status');
    $('#v121-link').onclick=async e=>{e.currentTarget.disabled=true;st.textContent='Linking this device…';try{await linkDevice();st.textContent='Device linked. SCHOLARK can now send notifications here.';setTimeout(open,450)}catch(err){st.textContent=clean(err?.message||err,300)}finally{e.currentTarget.disabled=false}};
    $('#v121-test').onclick=async e=>{e.currentTarget.disabled=true;try{await createReminder({title:'SCHOLARK test notification',body:'Your linked device is ready for reminders.',kind:'custom',when:new Date(Date.now()+5000),url:'/#reminders'});st.textContent='Test notification queued. It should arrive shortly after the next notification check.';setTimeout(open,600)}catch(err){st.textContent=clean(err?.message||err,300)}finally{e.currentTarget.disabled=false}};
    $('#v121-create').onclick=async e=>{const title=clean($('#v121-title').value,180),date=$('#v121-date').value,time=$('#v121-time').value||'18:00';if(!title||!date){st.textContent='Add a reminder title and date.';return}e.currentTarget.disabled=true;try{const delivery=await ensureReminderDelivery();await createReminder({title,kind:$('#v121-kind').value,when:new Date(date+'T'+time+':00'),url:'/#reminders'});st.textContent='Reminder saved.'+(delivery.message||'');setTimeout(open,700)}catch(err){st.textContent=clean(err?.message||err,300)}finally{e.currentTarget.disabled=false}};
    $$('[data-v121-cancel]').forEach(b=>b.onclick=async()=>{await cancelReminder(b.dataset.v121Cancel);open()});
    $$('[data-v121-unlink]').forEach(b=>b.onclick=async()=>{await unlinkDevice(b.dataset.v121Unlink);open()});
    $('#v121-save').onclick=async()=>{await savePrefs({enabled:$('#v121-enabled').checked,task_reminders:$('#v121-task').checked,payment_reminders:$('#v121-payment').checked,study_reminders:$('#v121-study').checked,study_time:$('#v121-study-time').value||'19:00',task_lead_minutes:Number($('#v121-lead').value)||60,quiet_hours_start:$('#v121-quiet-start').value||'22:00',quiet_hours_end:$('#v121-quiet-end').value||'07:00',timezone:timezone()});st.textContent='Notification settings saved.';scheduleAssignmentSync(100)};
    const tomorrow=new Date(Date.now()+86400000);$('#v121-date').value=tomorrow.toISOString().slice(0,10);$('#v121-time').value='18:00';
  }
  function offerDeviceLink(){
    clearTimeout(onboardTimer);onboardTimer=setTimeout(async()=>{
      const x=await ctx();if(!x)return;let pending=false;try{pending=localStorage.getItem(ONBOARD_KEY)==='1'}catch{}if(!pending)return;
      let modal=$('#v121-onboard');if(!modal){modal=document.createElement('div');modal.id='v121-onboard';modal.className='v121-onboard';document.body.appendChild(modal)}
      modal.innerHTML='<div class="v121-onboard-card"><small>SCHOLARK DEVICES</small><h2>Link one or more devices for reminders?</h2><p>Link this device now so SCHOLARK can remind you about homework, assignments, reminders you create yourself and upcoming payments. You can link more phones, tablets, laptops or PCs later by signing in to the same account on each device.</p><div class="v121-actions"><button class="v121-btn" data-v121-onboard-link>Link this device</button><button class="v121-btn alt" data-v121-onboard-later>Not now</button></div><div class="v121-status"></div></div>';modal.classList.add('open');
      $('[data-v121-onboard-later]',modal).onclick=()=>{try{localStorage.removeItem(ONBOARD_KEY)}catch{};modal.classList.remove('open')};
      $('[data-v121-onboard-link]',modal).onclick=async e=>{const st=$('.v121-status',modal);e.currentTarget.disabled=true;try{await linkDevice();st.textContent='Device linked.';setTimeout(()=>modal.classList.remove('open'),550)}catch(err){st.textContent=clean(err?.message||err,300);e.currentTarget.disabled=false}};
    },500)
  }
  function scheduleAssignmentSync(ms=600){clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncAssignments().catch(()=>{}),ms)}
  addEventListener('scholark:assignments-changed',()=>scheduleAssignmentSync(450));
  addEventListener('scholark:notification-onboarding',()=>offerDeviceLink());
  addEventListener('scholark:auth-changed',e=>{if(e.detail?.signedIn){offerDeviceLink();scheduleAssignmentSync(900)}});
  addEventListener('scholark-runtime-ready',()=>{sw().catch(()=>{});setTimeout(()=>{offerDeviceLink();scheduleAssignmentSync(1600)},900)},{once:true});
  window.__SCHOLARK_NOTIFICATIONS__={open,linkDevice,currentDeviceReady,offerDeviceLink,syncAssignments,createReminder,release:RELEASE};
})();