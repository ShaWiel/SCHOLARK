(() => {
  if(window.__SCHOLARK_V80_WORKSPACE_CLOUD__)return;
  window.__SCHOLARK_V80_WORKSPACE_CLOUD__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  const state={planner:[],goals:[],mastery:[],loading:new Set(),plannerView:'all'};
  const css=document.createElement('style');
  css.id='scholark-v80-style';
  css.textContent='.v80-sync-note{margin-top:9px;padding:8px 10px;border-radius:10px;background:#f1efff;color:#5b50c8;font:750 7.5px/1.4 Inter}.v80-sync-note.local{background:#f4f3f1;color:#77717e}.v80-cloud-tag{display:inline-flex;margin-left:6px;padding:3px 6px;border-radius:999px;background:#eaf7df;color:#55762f;font:850 6px Inter;vertical-align:middle}.v80-sync-note button{border:0;background:transparent;color:inherit;text-decoration:underline;font:inherit;cursor:pointer;padding:0}.v80-plan-controls{display:grid;grid-template-columns:1fr 120px 120px;gap:7px;margin-top:8px}.v80-plan-views{display:flex;gap:5px;flex-wrap:wrap;margin:10px 0}.v80-plan-view{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:999px;padding:7px 9px;font:850 7.5px Inter;cursor:pointer}.v80-plan-view.active{background:#17191f;color:#c9ff6a}.v80-plan-item{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:start}.v80-plan-check{border:1px solid rgba(23,25,31,.14);background:#fff;width:24px;height:24px;border-radius:8px;cursor:pointer}.v80-plan-check.done{background:#17191f;color:#c9ff6a}.v80-plan-meta{display:block;margin-top:4px;font:700 6.8px Inter;color:#8a8490}.v80-plan-item.done .v80-plan-title{text-decoration:line-through;opacity:.6}.v80-mastery-bar{height:6px;border-radius:99px;background:#ece9ef;overflow:hidden;margin-top:7px}.v80-mastery-bar i{display:block;height:100%;background:#6d5dfc}.v80-mastery-meta{display:block;margin-top:5px;font:700 6.8px Inter;color:#8a8490}.v80-del{border:0;background:transparent;cursor:pointer;font-size:14px;color:#8c3d3d}';
  document.head.appendChild(css);

  function localRead(k){try{const x=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
  function localWrite(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
  function dateOnly(v){if(!v)return'';try{return new Date(v).toISOString().slice(0,10)}catch{return String(v).slice(0,10)}}
  function dueIso(v){if(!v)return null;const d=new Date(v+'T12:00:00');return Number.isNaN(d.getTime())?null:d.toISOString()}
  function masteryStatus(v){const n=Number(v)||0;return n>=90?'Mastered':n>=50?'Practising':n>=15?'Learning':'New'}
  function masteryValue(s){return s==='Mastered'?100:s==='Practising'?70:s==='Learning'?35:0}
  async function ctx(){
    const c=cloud();if(!c)return null;
    const s=await c.session?.();if(!s?.user?.id)return null;
    return {c,s,uid:s.user.id};
  }
  function note(form,signed){
    if(!form)return;let n=$('.v80-sync-note',form);
    if(!n){n=document.createElement('div');n.className='v80-sync-note';form.appendChild(n)}
    n.classList.toggle('local',!signed);
    n.innerHTML=signed?'SCHOLARK Cloud sync is active on this workspace data.':'Local-only mode. <button type="button">Sign in</button> to sync this data across devices.';
    const b=$('button',n);if(b)b.onclick=()=>cloud()?.openAuth?.();
  }
  async function request(path,opts={}){const x=await ctx();if(!x)throw Object.assign(new Error('Sign in to SCHOLARK Cloud'),{code:'AUTH_REQUIRED'});const r=await x.c.request(path,opts);return {r,...x}}
  function sig(title,date){return clean(title).toLowerCase()+'|'+String(date||'')}
  const PLAN_META='__SCHOLARK_META__';
  function readPlanMeta(notes){
    const line=String(notes||'').split('\n').find(x=>x.startsWith(PLAN_META));if(!line)return{};
    try{const x=JSON.parse(line.slice(PLAN_META.length));return x&&typeof x==='object'?x:{}}catch{return{}}
  }
  function writePlanMeta(meta={}){
    const safe={type:clean(meta.type)||'task',time:clean(meta.time),goalId:clean(meta.goalId),sourceKey:clean(meta.sourceKey)};
    return PLAN_META+JSON.stringify(safe);
  }
  function localPlanSig(z){const key=clean(z?.sourceKey);return key?'key|'+key.toLowerCase():sig(z?.text,z?.date)}
  function cloudPlanSig(z){const key=clean(readPlanMeta(z?.notes).sourceKey);return key?'key|'+key.toLowerCase():sig(z?.title,dateOnly(z?.due_at))}
  function mirrorPlanner(rows=state.planner){
    const old=localRead('scholark_v51_planner'),bySig=new Map(old.map(x=>[localPlanSig(x),x]));
    const next=(rows||[]).map(z=>{const date=dateOnly(z.due_at),prev=bySig.get(cloudPlanSig(z))||{},meta=readPlanMeta(z.notes);return {...prev,id:prev.id||('cloud-plan-'+z.id),cloudId:z.id,text:clean(z.title),type:clean(meta.type)||prev.type||'task',subject:clean(z.subject||prev.subject),date,time:clean(meta.time)||prev.time||'',duration:Number(z.duration_minutes)||Number(prev.duration)||0,priority:z.priority||prev.priority||'medium',goalId:clean(meta.goalId)||prev.goalId||'',sourceKey:clean(meta.sourceKey)||prev.sourceKey||'',status:z.status==='done'?'done':'todo',source:z.source||prev.source||'cloud',completedAt:z.status==='done'?(prev.completedAt||z.updated_at||new Date().toISOString()):'',createdAt:prev.createdAt||z.created_at||new Date().toISOString(),updatedAt:z.updated_at||prev.updatedAt||''}});
    localWrite('scholark_v51_planner',next);return next;
  }
  function mirrorGoals(rows=state.goals){
    const old=localRead('scholark_v51_goals'),bySig=new Map(old.map(x=>[sig(typeof x==='string'?x:x?.text,typeof x==='string'?'':x?.date),typeof x==='string'?{text:x}:x]));
    const next=(rows||[]).map(z=>{const date=z.target_date||'',prev=bySig.get(sig(z.title,date))||{};return {...prev,id:prev.id||('cloud-goal-'+z.id),cloudId:z.id,text:clean(z.title),category:prev.category||'learning',date,measure:prev.measure||'',sourceKey:prev.sourceKey||'',progress:Math.max(Number(z.progress)||0,Number(prev.progress)||0),status:z.status==='complete'?'complete':'active',createdAt:prev.createdAt||z.created_at||new Date().toISOString(),updatedAt:z.updated_at||prev.updatedAt||''}});
    localWrite('scholark_v51_goals',next);return next;
  }
  function mirrorMasteryRows(rows=state.mastery){
    const old=localRead('scholark_v52_mastery'),bySig=new Map(old.map(x=>[sig(x?.topic,x?.subject),x]));
    const next=(rows||[]).map(z=>{const prev=bySig.get(sig(z.topic,z.subject))||{},m=Math.max(0,Math.min(100,Number(z.mastery)||0));return {...prev,id:prev.id||('cloud-mastery-'+z.id),cloudId:z.id,subject:clean(z.subject)||clean(prev.subject)||'General',topic:clean(z.topic),status:masteryStatus(m),mastery:m,nextReviewAt:z.next_review_at||prev.nextReviewAt||'',updatedAt:z.updated_at||prev.updatedAt||new Date().toISOString(),sourceKey:prev.sourceKey||'',source:prev.source||'cloud'}});
    localWrite('scholark_v52_mastery',next);return next;
  }

  function ensurePlannerControls(){
    const form=$('#v52-plan')?.closest('.v52-form');if(!form)return;
    $$('.v80-plan-controls',form).forEach(x=>x.remove());
    if(form.dataset.v80planner==='1')return;form.dataset.v80planner='1';
    const list=$('#v52-plan-list');if(list&&!$('.v80-plan-views',form)){const views=document.createElement('div');views.className='v80-plan-views';views.innerHTML=['all','today','tomorrow','week','upcoming','overdue','done'].map(v=>'<button type="button" class="v80-plan-view '+(v==='all'?'active':'')+'" data-v80-view="'+v+'">'+v[0].toUpperCase()+v.slice(1)+'</button>').join('');list.insertAdjacentElement('beforebegin',views);$$$('[data-v80-view]',views).forEach(b=>b.onclick=()=>{state.plannerView=b.dataset.v80View;$('[data-v80-view]',views).forEach(x=>x.classList.toggle('active',x===b));renderPlanner()})}
  }
  function plannerFiltered(){
    const today=new Date();today.setHours(0,0,0,0);const t=today.getTime();
    return state.planner.filter(z=>{const done=z.status==='done',d=z.due_at?new Date(z.due_at):null,day=d?new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime():null;
      if(state.plannerView==='done')return done;
      if(state.plannerView==='today')return !done&&day===t;
      if(state.plannerView==='tomorrow')return !done&&day===t+86400000;
      if(state.plannerView==='week')return !done&&day!=null&&day>=t&&day<=t+6*86400000;
      if(state.plannerView==='overdue')return !done&&day!=null&&day<t;
      if(state.plannerView==='upcoming')return !done&&(day==null||day>=t);
      return true;
    });
  }
  async function loadPlanner(migrate=true){
    if(state.loading.has('planner'))return;state.loading.add('planner');
    try{
      const x=await ctx(),form=$('#v52-plan')?.closest('.v52-form');ensurePlannerControls();note(form,!!x);
      if(!x)return;
      let r=await x.c.request('/rest/v1/planner_tasks?select=id,title,subject,notes,due_at,duration_minutes,status,priority,source,created_at,updated_at&order=created_at.asc&limit=250',{method:'GET'});
      let rows=await r.json().catch(()=>[]);if(!r.ok)throw new Error(rows?.message||'Could not load planner');
      rows=Array.isArray(rows)?rows:[];
      if(migrate){
        const seen=new Set(rows.map(cloudPlanSig));
        const pending=localRead('scholark_v51_planner').slice(0,100).map(z=>typeof z==='string'?{text:z,date:''}:z).filter(z=>clean(z?.text)).filter(z=>!seen.has(localPlanSig(z)));
        if(pending.length){
          const body=pending.map(z=>({user_id:x.uid,title:clean(z.text).slice(0,240),subject:clean(z.subject).slice(0,160)||null,notes:writePlanMeta({type:z.type,time:z.time,goalId:z.goalId,sourceKey:z.sourceKey}),due_at:dueIso(z.date),duration_minutes:Math.max(0,Math.min(240,Number(z.duration)||0)),priority:['high','medium','low'].includes(z.priority)?z.priority:'medium',status:z.status==='done'?'done':'todo',source:clean(z.source)||'manual'}));
          const ins=await x.c.request('/rest/v1/planner_tasks?select=id,title,subject,notes,due_at,duration_minutes,status,priority,source,created_at,updated_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
          if(ins.ok){const added=await ins.json().catch(()=>[]);rows=rows.concat(Array.isArray(added)?added:[])}
        }
      }
      state.planner=rows;mirrorPlanner();renderPlanner();
    }catch(e){console.warn('[SCHOLARK] Planner cloud sync:',clean(e?.message||e))}finally{state.loading.delete('planner')}
  }
  function renderPlanner(){
    const host=$('#v52-plan-list');if(!host||!awaitableSigned())return;ensurePlannerControls();const rows=plannerFiltered();
    host.innerHTML=rows.length?rows.map(z=>{const meta=readPlanMeta(z.notes);return '<div class="v52-item v80-plan-item '+(z.status==='done'?'done':'')+'"><button class="v80-plan-check '+(z.status==='done'?'done':'')+'" data-v80-plan-toggle="'+esc(z.id)+'">'+(z.status==='done'?'✓':'')+'</button><div><b class="v80-plan-title">'+esc(z.title)+'</b><span class="v80-plan-meta">'+esc(z.subject||'General')+(z.due_at?' · '+esc(dateOnly(z.due_at)):' · no deadline')+(meta.time?' · '+esc(meta.time):'')+' · '+esc(meta.type||'task')+' · '+esc(z.priority||'medium')+(z.duration_minutes?' · '+esc(z.duration_minutes)+' min':'')+'</span></div><button class="v80-del" data-v80-plan-del="'+esc(z.id)+'">×</button></div>'}).join(''):'<div class="v52-item">No '+esc(state.plannerView)+' planner items.</div>';
    $$('[data-v80-plan-del]',host).forEach(b=>b.onclick=()=>deletePlanner(b.dataset.v80PlanDel));
    $$('[data-v80-plan-toggle]',host).forEach(b=>b.onclick=()=>togglePlanner(b.dataset.v80PlanToggle));
  }
  function awaitableSigned(){return !!cloud()?.currentSession?.()?.access_token}
  async function addPlanner(){
    const input=$('#v52-plan'),title=clean(input?.value);if(!title){input?.focus();return}
    const date=$('#v52-plan-date')?.value||'',subject=clean($('#v52-plan-subject')?.value),type=$('#v52-plan-type')?.value||'task',goalId=$('#v52-plan-goal')?.value||'',time=$('#v52-plan-time')?.value||'',duration=Math.max(0,Math.min(240,Number($('#v52-plan-duration')?.value)||0)),priority=$('#v52-plan-priority')?.value||'medium',sourceKey='',x=await ctx();if(!x)return false;
    const payload={user_id:x.uid,title:title.slice(0,240),subject:subject.slice(0,160)||null,notes:writePlanMeta({type,time,goalId,sourceKey}),due_at:dueIso(date),duration_minutes:duration,priority,status:'todo',source:'manual'};
    const r=await x.c.request('/rest/v1/planner_tasks?select=id,title,subject,notes,due_at,duration_minutes,status,priority,source,created_at,updated_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});
    const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d?.message||'Could not add planner item');
    if(input)input.value='';state.planner.push(...(Array.isArray(d)?d:[d]).filter(Boolean));mirrorPlanner();renderPlanner();return true;
  }
  async function togglePlanner(id){
    const x=await ctx();if(!x)return;const item=state.planner.find(z=>z.id===id);if(!item)return;const status=item.status==='done'?'todo':'done';
    const r=await x.c.request('/rest/v1/planner_tasks?id=eq.'+encodeURIComponent(id)+'&select=id,title,subject,notes,due_at,duration_minutes,status,priority,source,created_at,updated_at',{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status,updated_at:new Date().toISOString()})});const d=await r.json().catch(()=>[]);if(!r.ok)return;const row=Array.isArray(d)?d[0]:d;if(row)state.planner=state.planner.map(z=>z.id===id?row:z);mirrorPlanner();renderPlanner();
  }
  async function deletePlanner(id){
    const x=await ctx();if(!x)return;const r=await x.c.request('/rest/v1/planner_tasks?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{Prefer:'return=minimal'}});if(!r.ok)return;
    state.planner=state.planner.filter(z=>z.id!==id);mirrorPlanner();renderPlanner();
  }

  async function loadGoals(migrate=true){
    if(state.loading.has('goals'))return;state.loading.add('goals');
    try{
      const x=await ctx(),form=$('#v52-goal')?.closest('.v52-form');note(form,!!x);if(!x)return;
      let r=await x.c.request('/rest/v1/goals?select=id,title,target_date,status,progress,created_at&order=created_at.asc&limit=250',{method:'GET'});
      let rows=await r.json().catch(()=>[]);if(!r.ok)throw new Error(rows?.message||'Could not load goals');rows=Array.isArray(rows)?rows:[];
      if(migrate){
        const seen=new Set(rows.map(z=>sig(z.title,z.target_date)));
        const pending=localRead('scholark_v51_goals').slice(0,100).map(z=>typeof z==='string'?{text:z,date:''}:z).filter(z=>clean(z?.text)).filter(z=>!seen.has(sig(z.text,z.date)));
        if(pending.length){
          const body=pending.map(z=>({user_id:x.uid,title:clean(z.text).slice(0,240),target_date:z.date||null,status:z.status==='complete'?'complete':'active',progress:Math.max(0,Math.min(100,Number(z.progress)||0))}));
          const ins=await x.c.request('/rest/v1/goals?select=id,title,target_date,status,progress,created_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
          if(ins.ok){const added=await ins.json().catch(()=>[]);rows=rows.concat(Array.isArray(added)?added:[])}
        }
      }
      state.goals=rows;mirrorGoals();renderGoals();
    }catch(e){console.warn('[SCHOLARK] Goal cloud sync:',clean(e?.message||e))}finally{state.loading.delete('goals')}
  }
  function renderGoals(){
    const host=$('#v52-goal-list');if(!host||!awaitableSigned())return;
    const locals=localRead('scholark_v51_goals'),byCloud=new Map(locals.filter(x=>x&&typeof x==='object'&&x.cloudId).map(x=>[String(x.cloudId),x]));
    host.innerHTML=state.goals.length?state.goals.map(z=>{const local=byCloud.get(String(z.id))||{},progress=Math.max(0,Math.min(100,Number(z.progress)||0)),done=z.status==='complete';return '<div class="v52-item"><div><b>◉ '+esc(z.title)+'</b><div class="v52-meta"><span class="v52-badge">'+esc(local.category||'learning')+'</span>'+(z.target_date?'<span class="v52-badge">Target '+esc(z.target_date)+'</span>':'')+'<span class="v52-badge goal">'+progress+'%</span><span class="v80-cloud-tag">CLOUD</span></div>'+(local.measure?'<div style="margin-top:6px">'+esc(local.measure)+'</div>':'')+'</div><div class="v52-inline-actions"><button data-v80-goal-dec="'+esc(z.id)+'">−10%</button><button data-v80-goal-inc="'+esc(z.id)+'">+10%</button><button data-v80-goal-complete="'+esc(z.id)+'">'+(done?'Reopen':'Complete')+'</button><button data-v80-goal-del="'+esc(z.id)+'">Delete</button></div></div>'}).join(''):'<div class="v52-item">No goals yet.</div>';
    $$('[data-v80-goal-dec]',host).forEach(b=>b.onclick=()=>adjustGoal(b.dataset.v80GoalDec,-10));
    $$('[data-v80-goal-inc]',host).forEach(b=>b.onclick=()=>adjustGoal(b.dataset.v80GoalInc,10));
    $$('[data-v80-goal-complete]',host).forEach(b=>b.onclick=()=>toggleGoal(b.dataset.v80GoalComplete));
    $$('[data-v80-goal-del]',host).forEach(b=>b.onclick=()=>deleteGoal(b.dataset.v80GoalDel));
  }
  async function addGoal(){
    const input=$('#v52-goal'),title=clean(input?.value);if(!title){input?.focus();return}
    const date=$('#v52-goal-date')?.value||null,category=$('#v52-goal-category')?.value||'learning',measure=clean($('#v52-goal-measure')?.value),x=await ctx();if(!x)return false;
    const r=await x.c.request('/rest/v1/goals?select=id,title,target_date,status,progress,created_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({user_id:x.uid,title:title.slice(0,240),target_date:date,status:'active',progress:0})});
    const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d?.message||'Could not add goal');
    const added=(Array.isArray(d)?d:[d]).filter(Boolean);if(input)input.value='';if($('#v52-goal-measure'))$('#v52-goal-measure').value='';
    if(added.length){const local=localRead('scholark_v51_goals'),known=new Set(local.map(z=>sig(typeof z==='string'?z:z?.text,typeof z==='string'?'':z?.date)));for(const row of added){const k=sig(row.title,row.target_date||'');if(!known.has(k)){local.push({id:'cloud-goal-'+row.id,cloudId:row.id,text:clean(row.title),category,date:row.target_date||'',measure,progress:Number(row.progress)||0,status:row.status==='complete'?'complete':'active',createdAt:row.created_at||new Date().toISOString()});known.add(k)}}localWrite('scholark_v51_goals',local)}
    state.goals.push(...added);mirrorGoals();renderGoals();return true;
  }
  async function patchGoal(id,patch){
    const x=await ctx();if(!x)return null;
    const body={...patch};const r=await x.c.request('/rest/v1/goals?id=eq.'+encodeURIComponent(id)+'&select=id,title,target_date,status,progress,created_at',{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(body)}),d=await r.json().catch(()=>[]);
    if(!r.ok)return null;const row=Array.isArray(d)?d[0]:d;if(row){state.goals=state.goals.map(z=>z.id===id?row:z);mirrorGoals();renderGoals()}return row;
  }
  async function adjustGoal(id,delta){const row=state.goals.find(z=>z.id===id);if(!row)return;const progress=Math.max(0,Math.min(100,(Number(row.progress)||0)+delta)),status=progress>=100?'complete':row.status==='complete'?'active':row.status;await patchGoal(id,{progress,status})}
  async function toggleGoal(id){const row=state.goals.find(z=>z.id===id);if(!row)return;const done=row.status!=='complete';await patchGoal(id,{status:done?'complete':'active',progress:done?100:Math.min(90,Number(row.progress)||0)})}
  async function deleteGoal(id){
    const x=await ctx();if(!x)return;const r=await x.c.request('/rest/v1/goals?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{Prefer:'return=minimal'}});if(!r.ok)return;
    state.goals=state.goals.filter(z=>z.id!==id);mirrorGoals();renderGoals();
  }

  function focusSubject(){try{return clean(JSON.parse(localStorage.getItem('scholark_education_focus')||'{}')?.subject)||'General'}catch{return'General'}}
  async function loadMastery(migrate=true){
    if(state.loading.has('mastery'))return;state.loading.add('mastery');
    try{
      const x=await ctx(),form=$('#v52-m-topic')?.closest('.v52-form');note(form,!!x);if(!x)return;
      let r=await x.c.request('/rest/v1/mastery_topics?select=id,subject,topic,mastery,attempts,correct,incorrect,streak,last_practiced_at,next_review_at,updated_at&order=updated_at.desc&limit=300',{method:'GET'});
      let rows=await r.json().catch(()=>[]);if(!r.ok)throw new Error(rows?.message||'Could not load mastery');rows=Array.isArray(rows)?rows:[];
      if(migrate){
        const seen=new Set(rows.map(z=>sig(z.topic,z.subject)));
        const pendingSeen=new Set(seen),pending=localRead('scholark_v52_mastery').slice(0,120).filter(z=>clean(z?.topic)).map(z=>({topic:clean(z.topic),status:z.status||'New',subject:clean(z.subject)||focusSubject(),mastery:Math.max(0,Math.min(100,Number(z.mastery)||masteryValue(z.status||'New'))),nextReviewAt:z.nextReviewAt||null})).filter(z=>{const k=sig(z.topic,z.subject);if(pendingSeen.has(k))return false;pendingSeen.add(k);return true});
        if(pending.length){
          const body=pending.map(z=>({user_id:x.uid,subject:z.subject.slice(0,160),topic:z.topic.slice(0,240),mastery:z.mastery,attempts:0,correct:0,incorrect:0,streak:0,next_review_at:z.nextReviewAt}));
          const ins=await x.c.request('/rest/v1/mastery_topics?select=id,subject,topic,mastery,attempts,correct,incorrect,streak,last_practiced_at,next_review_at,updated_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
          if(ins.ok){const added=await ins.json().catch(()=>[]);rows=rows.concat(Array.isArray(added)?added:[])}
        }
      }
      state.mastery=rows;mirrorMastery();renderMastery();
    }catch(e){console.warn('[SCHOLARK] Mastery cloud sync:',clean(e?.message||e))}finally{state.loading.delete('mastery')}
  }
  function mirrorMastery(){mirrorMasteryRows()}
  function renderMastery(){
    const host=$('#v52-m-list');if(!host||!awaitableSigned())return;
    host.innerHTML=state.mastery.length?state.mastery.map(z=>{const m=Math.max(0,Math.min(100,Number(z.mastery)||0)),acc=(Number(z.attempts)||0)>0?Math.round((Number(z.correct)||0)/(Number(z.attempts)||1)*100):null;return '<div class="v52-item"><div><b>'+esc(z.topic)+'</b><span class="v52-status">'+esc(masteryStatus(m))+'</span><span class="v80-cloud-tag">CLOUD</span><span class="v80-mastery-meta">'+esc(z.subject||'General')+' · Mastery '+Math.round(m)+'%'+(acc!=null?' · Accuracy '+acc+'%':' · no quiz data yet')+' · '+esc(z.attempts||0)+' attempts'+(z.streak?' · streak '+esc(z.streak):'')+(z.last_practiced_at?' · practised '+esc(new Date(z.last_practiced_at).toLocaleDateString()):'')+'</span><div class="v80-mastery-bar"><i style="width:'+m+'%"></i></div></div><div class="v52-inline-actions"><button class="primary" data-v80-mastery-practice="'+esc(z.id)+'">Practice</button><button data-v80-mastery-del="'+esc(z.id)+'">Delete</button></div></div>'}).join(''):'<div class="v52-item">No mastery topics yet.</div>';
    $$('[data-v80-mastery-practice]',host).forEach(b=>b.onclick=()=>{const z=state.mastery.find(x=>x.id===b.dataset.v80MasteryPractice);if(!z)return;const prompt='Help me practise '+z.topic+' in '+(z.subject||'General')+'. Start with active recall, then give me one application question.';if(window.__SCHOLARK_V114_ORCHESTRATOR__?.handoff)window.__SCHOLARK_V114_ORCHESTRATOR__.handoff('tutor',{prompt});else{window.__SCHOLARK_WORKSPACE__?.openTool?.('tutor');setTimeout(()=>{const q=$('#v52-tutor-q');if(q){q.value=prompt;q.focus()}},120)}});
    $$('[data-v80-mastery-del]',host).forEach(b=>b.onclick=()=>deleteMastery(b.dataset.v80MasteryDel));
  }
  async function addMastery(){
    const input=$('#v52-m-topic'),topic=clean(input?.value);if(!topic){input?.focus();return}
    const status=$('#v52-m-status')?.value||'New',subject=clean($('#v52-m-subject')?.value)||focusSubject(),x=await ctx();if(!x)return false;
    const existing=state.mastery.find(z=>clean(z.topic).toLowerCase()===topic.toLowerCase()&&clean(z.subject).toLowerCase()===subject.toLowerCase());
    let r,d;
    if(existing){
      r=await x.c.request('/rest/v1/mastery_topics?id=eq.'+encodeURIComponent(existing.id)+'&select=id,subject,topic,mastery,attempts,correct,incorrect,streak,last_practiced_at,next_review_at,updated_at',{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({mastery:masteryValue(status),updated_at:new Date().toISOString()})});
      d=await r.json().catch(()=>[]);if(r.ok){const row=Array.isArray(d)?d[0]:d;state.mastery=state.mastery.map(z=>z.id===existing.id&&row?row:z)}
    }else{
      r=await x.c.request('/rest/v1/mastery_topics?select=id,subject,topic,mastery,attempts,correct,incorrect,updated_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({user_id:x.uid,subject:subject.slice(0,160),topic:topic.slice(0,240),mastery:masteryValue(status),attempts:0,correct:0,incorrect:0,streak:0})});
      d=await r.json().catch(()=>[]);if(r.ok)state.mastery.unshift(...(Array.isArray(d)?d:[d]).filter(Boolean));
    }
    if(!r.ok)throw new Error(d?.message||'Could not save mastery topic');if(input)input.value='';mirrorMastery();renderMastery();return true;
  }
  async function deleteMastery(id){
    const x=await ctx();if(!x)return;const r=await x.c.request('/rest/v1/mastery_topics?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{Prefer:'return=minimal'}});if(!r.ok)return;
    state.mastery=state.mastery.filter(z=>z.id!==id);mirrorMastery();renderMastery();
  }

  async function syncProgress(){
    const cards=$$('#v51-fallback .v52-grid .v52-card');if(String(location.hash).toLowerCase()!=='#progress'||cards.length<3)return;
    const x=await ctx();if(!x)return;
    try{
      const [gr,pr,mr]=await Promise.all([
        x.c.request('/rest/v1/goals?select=id&status=eq.active&limit=500',{method:'GET'}),
        x.c.request('/rest/v1/planner_tasks?select=id&status=neq.done&limit=500',{method:'GET'}),
        x.c.request('/rest/v1/mastery_topics?select=id,mastery&mastery=gte.90&limit=500',{method:'GET'})
      ]);
      const [g,p,m]=await Promise.all([gr.json().catch(()=>[]),pr.json().catch(()=>[]),mr.json().catch(()=>[])]);
      if(gr.ok&&$('.big',cards[0]))$('.big',cards[0]).textContent=Array.isArray(g)?g.length:0;
      if(pr.ok&&$('.big',cards[1]))$('.big',cards[1]).textContent=Array.isArray(p)?p.length:0;
      if(mr.ok&&$('.big',cards[2]))$('.big',cards[2]).textContent=Array.isArray(m)?m.length:0;
      cards.forEach(c=>{if(!$('.v80-cloud-tag',c))c.querySelector('h3')?.insertAdjacentHTML('beforeend','<span class="v80-cloud-tag">CLOUD</span>')});
    }catch{}
  }

  document.addEventListener('click',async e=>{
    try{
      if(e.target.closest?.('#v52-plan-add')&&awaitableSigned()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();await addPlanner();return}
      if(e.target.closest?.('#v52-goal-add')&&awaitableSigned()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();await addGoal();return}
      if(e.target.closest?.('#v52-m-add')&&awaitableSigned()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();await addMastery();return}
    }catch(err){console.warn('[SCHOLARK] Workspace cloud action:',clean(err?.message||err))}
  },true);

  function sync(){
    if($('#v52-plan-list'))loadPlanner();
    if($('#v52-goal-list'))loadGoals();
    if($('#v52-m-list'))loadMastery();
    syncProgress();
  }
  addEventListener('hashchange',()=>{setTimeout(sync,120);setTimeout(sync,360)});
  addEventListener('scholark:workspace-cloud-refresh',()=>setTimeout(sync,80));
  setTimeout(sync,700);
  window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__={loadPlanner,loadGoals,loadMastery,syncProgress,mirrorPlanner,mirrorGoals,mirrorMastery:mirrorMasteryRows,version:'20260920-r175'};
})();