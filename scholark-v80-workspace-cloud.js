(() => {
  if(window.__SCHOLARK_V80_WORKSPACE_CLOUD__)return;
  window.__SCHOLARK_V80_WORKSPACE_CLOUD__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  const state={planner:[],goals:[],mastery:[],loading:new Set()};
  const css=document.createElement('style');
  css.id='scholark-v80-style';
  css.textContent='.v80-sync-note{margin-top:9px;padding:8px 10px;border-radius:10px;background:#f1efff;color:#5b50c8;font:750 7.5px/1.4 Inter}.v80-sync-note.local{background:#f4f3f1;color:#77717e}.v80-cloud-tag{display:inline-flex;margin-left:6px;padding:3px 6px;border-radius:999px;background:#eaf7df;color:#55762f;font:850 6px Inter;vertical-align:middle}.v80-sync-note button{border:0;background:transparent;color:inherit;text-decoration:underline;font:inherit;cursor:pointer;padding:0}';
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

  async function loadPlanner(migrate=true){
    if(state.loading.has('planner'))return;state.loading.add('planner');
    try{
      const x=await ctx(),form=$('#v52-plan')?.closest('.v52-form');note(form,!!x);
      if(!x)return;
      let r=await x.c.request('/rest/v1/planner_tasks?select=id,title,due_at,status,priority,created_at&order=created_at.asc&limit=250',{method:'GET'});
      let rows=await r.json().catch(()=>[]);if(!r.ok)throw new Error(rows?.message||'Could not load planner');
      rows=Array.isArray(rows)?rows:[];
      if(migrate){
        const seen=new Set(rows.map(z=>sig(z.title,dateOnly(z.due_at))));
        const pending=localRead('scholark_v51_planner').slice(0,100).map(z=>typeof z==='string'?{text:z,date:''}:z).filter(z=>clean(z?.text)).filter(z=>!seen.has(sig(z.text,z.date)));
        if(pending.length){
          const body=pending.map(z=>({user_id:x.uid,title:clean(z.text).slice(0,240),due_at:dueIso(z.date),priority:'medium',status:'todo',source:'manual'}));
          const ins=await x.c.request('/rest/v1/planner_tasks?select=id,title,due_at,status,priority,created_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
          if(ins.ok){const added=await ins.json().catch(()=>[]);rows=rows.concat(Array.isArray(added)?added:[])}
        }
      }
      state.planner=rows;localWrite('scholark_v51_planner',rows.map(z=>({text:z.title,date:dateOnly(z.due_at)})));renderPlanner();
    }catch(e){console.warn('[SCHOLARK] Planner cloud sync:',clean(e?.message||e))}finally{state.loading.delete('planner')}
  }
  function renderPlanner(){
    const host=$('#v52-plan-list');if(!host||!state.planner.length&&!(awaitableSigned()))return;
    host.innerHTML=state.planner.length?state.planner.map(z=>'<div class="v52-item"><button data-v80-plan-del="'+esc(z.id)+'">×</button>'+esc(z.title)+(z.due_at?' · '+esc(dateOnly(z.due_at)):'')+'<span class="v80-cloud-tag">CLOUD</span></div>').join(''):'<div class="v52-item">No planner items yet.</div>';
    $$('[data-v80-plan-del]',host).forEach(b=>b.onclick=()=>deletePlanner(b.dataset.v80PlanDel));
  }
  function awaitableSigned(){return !!cloud()?.currentSession?.()?.access_token}
  async function addPlanner(){
    const input=$('#v52-plan'),title=clean(input?.value);if(!title){input?.focus();return}
    const date=$('#v52-plan-date')?.value||'',x=await ctx();if(!x)return false;
    const r=await x.c.request('/rest/v1/planner_tasks?select=id,title,due_at,status,priority,created_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({user_id:x.uid,title:title.slice(0,240),due_at:dueIso(date),priority:'medium',status:'todo',source:'manual'})});
    const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d?.message||'Could not add planner item');
    if(input)input.value='';state.planner.push(...(Array.isArray(d)?d:[d]).filter(Boolean));localWrite('scholark_v51_planner',state.planner.map(z=>({text:z.title,date:dateOnly(z.due_at)})));renderPlanner();return true;
  }
  async function deletePlanner(id){
    const x=await ctx();if(!x)return;const r=await x.c.request('/rest/v1/planner_tasks?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{Prefer:'return=minimal'}});if(!r.ok)return;
    state.planner=state.planner.filter(z=>z.id!==id);localWrite('scholark_v51_planner',state.planner.map(z=>({text:z.title,date:dateOnly(z.due_at)})));renderPlanner();
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
          const body=pending.map(z=>({user_id:x.uid,title:clean(z.text).slice(0,240),target_date:z.date||null,status:'active',progress:0}));
          const ins=await x.c.request('/rest/v1/goals?select=id,title,target_date,status,progress,created_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
          if(ins.ok){const added=await ins.json().catch(()=>[]);rows=rows.concat(Array.isArray(added)?added:[])}
        }
      }
      state.goals=rows;localWrite('scholark_v51_goals',rows.map(z=>({text:z.title,date:z.target_date||''})));renderGoals();
    }catch(e){console.warn('[SCHOLARK] Goal cloud sync:',clean(e?.message||e))}finally{state.loading.delete('goals')}
  }
  function renderGoals(){
    const host=$('#v52-goal-list');if(!host||!awaitableSigned())return;
    host.innerHTML=state.goals.length?state.goals.map(z=>'<div class="v52-item"><button data-v80-goal-del="'+esc(z.id)+'">×</button>◉ '+esc(z.title)+(z.target_date?' · target '+esc(z.target_date):'')+'<span class="v80-cloud-tag">CLOUD</span></div>').join(''):'<div class="v52-item">No goals yet.</div>';
    $$('[data-v80-goal-del]',host).forEach(b=>b.onclick=()=>deleteGoal(b.dataset.v80GoalDel));
  }
  async function addGoal(){
    const input=$('#v52-goal'),title=clean(input?.value);if(!title){input?.focus();return}
    const date=$('#v52-goal-date')?.value||null,x=await ctx();if(!x)return false;
    const r=await x.c.request('/rest/v1/goals?select=id,title,target_date,status,progress,created_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({user_id:x.uid,title:title.slice(0,240),target_date:date,status:'active',progress:0})});
    const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d?.message||'Could not add goal');
    if(input)input.value='';state.goals.push(...(Array.isArray(d)?d:[d]).filter(Boolean));localWrite('scholark_v51_goals',state.goals.map(z=>({text:z.title,date:z.target_date||''})));renderGoals();return true;
  }
  async function deleteGoal(id){
    const x=await ctx();if(!x)return;const r=await x.c.request('/rest/v1/goals?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{Prefer:'return=minimal'}});if(!r.ok)return;
    state.goals=state.goals.filter(z=>z.id!==id);localWrite('scholark_v51_goals',state.goals.map(z=>({text:z.title,date:z.target_date||''})));renderGoals();
  }

  function focusSubject(){try{return clean(JSON.parse(localStorage.getItem('scholark_education_focus')||'{}')?.subject)||'General'}catch{return'General'}}
  async function loadMastery(migrate=true){
    if(state.loading.has('mastery'))return;state.loading.add('mastery');
    try{
      const x=await ctx(),form=$('#v52-m-topic')?.closest('.v52-form');note(form,!!x);if(!x)return;
      let r=await x.c.request('/rest/v1/mastery_topics?select=id,subject,topic,mastery,attempts,correct,incorrect,updated_at&order=updated_at.desc&limit=300',{method:'GET'});
      let rows=await r.json().catch(()=>[]);if(!r.ok)throw new Error(rows?.message||'Could not load mastery');rows=Array.isArray(rows)?rows:[];
      if(migrate){
        const seen=new Set(rows.map(z=>sig(z.topic,z.subject)));
        const pendingSeen=new Set(seen),pending=localRead('scholark_v52_mastery').slice(0,120).filter(z=>clean(z?.topic)).map(z=>({topic:clean(z.topic),status:z.status||'New',subject:clean(z.subject)||focusSubject()})).filter(z=>{const k=sig(z.topic,z.subject);if(pendingSeen.has(k))return false;pendingSeen.add(k);return true});
        if(pending.length){
          const body=pending.map(z=>({user_id:x.uid,subject:z.subject.slice(0,160),topic:z.topic.slice(0,240),mastery:masteryValue(z.status),attempts:0,correct:0,incorrect:0,streak:0}));
          const ins=await x.c.request('/rest/v1/mastery_topics?select=id,subject,topic,mastery,attempts,correct,incorrect,updated_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
          if(ins.ok){const added=await ins.json().catch(()=>[]);rows=rows.concat(Array.isArray(added)?added:[])}
        }
      }
      state.mastery=rows;mirrorMastery();renderMastery();
    }catch(e){console.warn('[SCHOLARK] Mastery cloud sync:',clean(e?.message||e))}finally{state.loading.delete('mastery')}
  }
  function mirrorMastery(){localWrite('scholark_v52_mastery',state.mastery.map(z=>({topic:z.topic,status:masteryStatus(z.mastery),subject:z.subject})))}
  function renderMastery(){
    const host=$('#v52-m-list');if(!host||!awaitableSigned())return;
    host.innerHTML=state.mastery.length?state.mastery.map(z=>'<div class="v52-item"><button data-v80-mastery-del="'+esc(z.id)+'">×</button><b>'+esc(z.topic)+'</b><span class="v52-status">'+esc(masteryStatus(z.mastery))+'</span><span class="v80-cloud-tag">CLOUD</span></div>').join(''):'<div class="v52-item">No mastery topics yet.</div>';
    $$('[data-v80-mastery-del]',host).forEach(b=>b.onclick=()=>deleteMastery(b.dataset.v80MasteryDel));
  }
  async function addMastery(){
    const input=$('#v52-m-topic'),topic=clean(input?.value);if(!topic){input?.focus();return}
    const status=$('#v52-m-status')?.value||'New',subject=focusSubject(),x=await ctx();if(!x)return false;
    const existing=state.mastery.find(z=>clean(z.topic).toLowerCase()===topic.toLowerCase()&&clean(z.subject).toLowerCase()===subject.toLowerCase());
    let r,d;
    if(existing){
      r=await x.c.request('/rest/v1/mastery_topics?id=eq.'+encodeURIComponent(existing.id)+'&select=id,subject,topic,mastery,attempts,correct,incorrect,updated_at',{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({mastery:masteryValue(status),updated_at:new Date().toISOString()})});
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
  const obs=new MutationObserver(()=>{clearTimeout(window.__v80sync);window.__v80sync=setTimeout(sync,120)});
  obs.observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('focus',sync);addEventListener('hashchange',()=>setTimeout(sync,80));setTimeout(sync,700);
  window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__={loadPlanner,loadGoals,loadMastery,syncProgress};
})();