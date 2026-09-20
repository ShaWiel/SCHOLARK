(() => {
  if(window.__SCHOLARK_V83_STUDY_AHEAD_CLOUD__)return;
  window.__SCHOLARK_V83_STUDY_AHEAD_CLOUD__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim(), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let last=null,saved=[];
  const css=document.createElement('style');css.id='scholark-v83-style';css.textContent=`
    .v83-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.v83-actions button{border:0;border-radius:10px;background:#17191f;color:#fff;padding:10px 12px;font:900 8px Inter;cursor:pointer}.v83-actions button.alt{background:#ece9ff;color:#574bd1}.v83-actions button:disabled{opacity:.5}
    .v83-status{font:750 8px/1.4 Inter;color:#6558c8;margin-top:8px}.v83-saved{margin:12px 0;display:grid;gap:7px}.v83-saved-card{border:1px solid rgba(23,25,31,.09);background:#fff;border-radius:14px;padding:12px;text-align:left;cursor:pointer;width:100%}.v83-saved-card:hover{border-color:#6d5dfc;background:#f8f7ff}.v83-saved-card b{font:900 10px Inter}.v83-saved-card span{display:block;margin-top:4px;color:#77717e;font:650 8px/1.35 Inter}
  `;document.head.appendChild(css);
  async function ctx(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  function isoDay(offset){const d=new Date();d.setDate(d.getDate()+offset);d.setHours(18,0,0,0);return d.toISOString()}
  async function persist(detail){
    last=detail;localStorage.setItem('scholark_v83_study_ahead',JSON.stringify(detail));
    try{
      const x=await ctx();if(!x){decorate();return}
      const body={user_id:x.uid,field:clean(detail.field).slice(0,180),country:clean(detail.country)||null,target_school:clean(detail.targetSchool)||null,data:{schema:1,result:detail.result,context:detail.context||'',provider:detail.provider||'',model:detail.model||''},updated_at:new Date().toISOString()};
      const r=await x.c.request('/rest/v1/study_ahead?select=id,field,country,target_school,data,created_at,updated_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
      if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.message||'Could not save Study Ahead track')}
      await loadSaved();decorate('Saved to SCHOLARK Cloud.');
    }catch(e){decorate('Saved locally; cloud save failed: '+clean(e?.message||e))}
  }
  async function loadSaved(){
    try{
      const x=await ctx();if(!x){saved=[];renderSaved();return}
      const r=await x.c.request('/rest/v1/study_ahead?select=id,field,country,target_school,data,created_at,updated_at&order=updated_at.desc&limit=12',{method:'GET'});
      const d=await r.json().catch(()=>[]);if(r.ok)saved=Array.isArray(d)?d:[];renderSaved();
    }catch{}
  }
  function renderSaved(){
    const host=$('#v83-saved');if(!host)return;
    host.innerHTML=saved.length?'<div class="v52-kicker">SAVED STUDY AHEAD TRACKS</div><div class="v83-saved">'+saved.map((x,i)=>'<button type="button" class="v83-saved-card" data-v83-saved="'+i+'"><b>'+esc(x.field)+(x.target_school?' · '+esc(x.target_school):'')+'</b><span>'+esc(x.country||'')+(x.updated_at?' · '+esc(new Date(x.updated_at).toLocaleDateString()):'')+' · open track</span></button>').join('')+'</div>':'';
    $$('[data-v83-saved]',host).forEach(b=>b.onclick=()=>openSaved(saved[+b.dataset.v83Saved]));
  }
  function list(items){const a=(items||[]).filter(Boolean);return a.length?'<ul>'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':''}
  function renderTrack(detail){
    if(!detail?.result)return;last=detail;localStorage.setItem('scholark_v83_study_ahead',JSON.stringify(detail));
    const r=detail.result,out=$('#v62-study-results');if(!out)return;
    out.innerHTML='<div class="v62-answer-card"><h3>'+esc(r.title||detail.field||'Study Ahead')+'</h3><p>'+esc(r.overview||'')+'</p></div>'+
      '<div class="v62-row"><div class="v62-answer-card"><h4>Skills to build</h4>'+list(r.skills)+'</div><div class="v62-answer-card"><h4>Key subjects</h4>'+list(r.keySubjects)+'</div></div>'+
      '<div class="v62-row"><div class="v62-answer-card"><h4>Books & resources</h4>'+list(r.books)+'</div><div class="v62-answer-card"><h4>University preparation</h4>'+list(r.universityPrep)+'</div></div>'+
      '<div class="v62-answer-card"><h4>Career directions</h4>'+list(r.careers)+'</div><div class="v62-answer-card"><h4>Your roadmap</h4>'+((r.roadmap||[]).map(x=>'<p><b>'+esc(x.phase)+'</b></p>'+list(x.actions)).join(''))+'</div>';
    decorate('Track opened. Connect it to Tutor, Planner or Mastery when ready.');
    out.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function openSaved(row){if(!row)return;renderTrack({field:row.field,country:row.country||'',targetSchool:row.target_school||'',context:row.data?.context||'',result:row.data?.result||{},provider:row.data?.provider||'',model:row.data?.model||''})}
  function ensureSavedHost(){
    const h=$('.v62-study');if(!h||$('#v83-saved',h))return;
    const host=document.createElement('section');host.id='v83-saved';
    const form=$('.v62-form',h);form?.insertAdjacentElement('afterend',host);renderSaved();
  }
  function decorate(statusText=''){
    const out=$('#v62-study-results');if(!out||!last)return;
    let bar=$('#v83-actions',out);if(!bar){bar=document.createElement('div');bar.id='v83-actions';bar.innerHTML='<div class="v83-actions"><button type="button" data-v83="tutor">Start learning with AI Tutor</button><button type="button" data-v83="planner">Add roadmap to Planner</button><button type="button" class="alt" data-v83="mastery">Add key subjects to Mastery</button><button type="button" class="alt" data-v83="goal">Turn this into a Goal</button><button type="button" class="alt" data-v83="refresh">Save / refresh track</button></div><div class="v83-status"></div>';out.appendChild(bar);$$('[data-v83]',bar).forEach(b=>b.onclick=()=>action(b.dataset.v83,b))}
    $('.v83-status',bar).textContent=statusText||'Study Ahead is connected to your Planner and Mastery Map.';
  }
  async function action(type,btn){
    if(!last)return;btn.disabled=true;const st=$('#v83-actions .v83-status');if(st)st.textContent='Working…';
    try{
      if(type==='tutor'){
        const prompt='Teach me the foundations I should know before studying '+clean(last.field)+'. Start at my current level, explain everything step by step, use worked examples, and connect the lesson to these key subjects: '+(last.result?.keySubjects||[]).slice(0,8).join(', ')+'.';
        if(window.__SCHOLARK_V91__?.openTool)window.__SCHOLARK_V91__.openTool('tutor');else $('#v51-sidebar [data-v51-tool="tutor"]')?.click();
        setTimeout(()=>{const q=$('#v52-tutor-q');if(q){q.value=prompt;q.focus()}},180);return;
      }
      const x=await ctx();
      if(type==='refresh'){await persist(last);return}
      if(type==='planner'){
        const actions=[];for(const phase of last.result?.roadmap||[])for(const a of phase.actions||[])if(clean(a))actions.push({phase:phase.phase||'Study Ahead',text:clean(a)});
        if(!actions.length)throw new Error('This roadmap has no planner actions.');
        const api=window.__SCHOLARK_WORKSPACE_CORE__,before=api?.data?.planner?.().length||0,field=clean(last.field)||'Study Ahead';
        actions.slice(0,18).forEach((a,i)=>api?.actions?.addPlan?.({text:a.text,type:'study',subject:field,date:new Date(Date.now()+(1+i*2)*86400000).toISOString().slice(0,10),time:'',duration:45,priority:i<4?'high':'medium',goalId:'',sourceKey:'study:'+field.toLowerCase()+':'+clean(a.phase).toLowerCase()+':'+clean(a.text).toLowerCase()}));
        const added=Math.max(0,(api?.data?.planner?.().length||0)-before);if(x)window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadPlanner?.(true);
        if(st)st.textContent=(added||0)+' new Study Ahead action'+(added===1?'':'s')+' connected to Planner'+(x?' · Cloud sync queued':'')+'.';
      }else if(type==='mastery'){
        const topics=[...(last.result?.keySubjects||[]),...(last.result?.skills||[])].map(clean).filter(Boolean).slice(0,24);
        if(!topics.length)throw new Error('This roadmap has no mastery topics.');
        const api=window.__SCHOLARK_WORKSPACE_CORE__,subject=clean(last.field)||'Study Ahead',before=api?.data?.mastery?.().length||0;
        for(const topic of topics){const due=new Date();due.setDate(due.getDate()+1);api?.actions?.upsertMastery?.({subject,topic,status:'New',mastery:0,nextReviewAt:due.toISOString()})}
        const added=Math.max(0,(api?.data?.mastery?.().length||0)-before);if(x)window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadMastery?.(true);
        if(st)st.textContent=added+' new key subject'+(added===1?'':'s')+'/skill'+(added===1?'':'s')+' connected to Mastery'+(x?' · Cloud sync queued':'')+'.';
      }else if(type==='goal'){
        const text='Prepare for '+clean(last.field),api=window.__SCHOLARK_WORKSPACE_CORE__,before=api?.data?.goals?.().length||0;
        api?.actions?.addGoal?.({text,category:'school',date:'',measure:'Complete the Study Ahead roadmap and reach confident mastery of the key subjects.',sourceKey:'study-goal:'+clean(last.field).toLowerCase()});
        const added=(api?.data?.goals?.().length||0)>before;if(x)window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadGoals?.(true);if(st)st.textContent=added?'Study Ahead goal added to Goals.':'Study Ahead goal is already connected to Goals.';
      }
    }catch(e){if(st)st.textContent=clean(e?.message||e)}finally{btn.disabled=false}
  }
  addEventListener('scholark:study-ahead-generated',e=>{persist(e.detail||{});setTimeout(sync,80)});
  function sync(){if(location.hash.toLowerCase()==='#study'){ensureSavedHost();loadSaved();try{last=last||JSON.parse(localStorage.getItem('scholark_v83_study_ahead')||'null')}catch{}if(last)decorate()}}
  addEventListener('hashchange',()=>{setTimeout(sync,80);setTimeout(sync,280)});setTimeout(sync,300);
  function prefill(data={}){
    const apply=()=>{if($('#v62-field')&&data.field!==undefined)$('#v62-field').value=clean(data.field);if($('#v62-country')&&data.country!==undefined)$('#v62-country').value=clean(data.country);if($('#v62-school')&&data.targetSchool!==undefined)$('#v62-school').value=clean(data.targetSchool);if($('#v62-context')&&data.context!==undefined)$('#v62-context').value=clean(data.context);$('#v62-field')?.focus()};
    if(String(location.hash||'').toLowerCase()!=='#study')window.__SCHOLARK_WORKSPACE__?.openTool?.('study');setTimeout(apply,140);return true;
  }
  window.__SCHOLARK_V83_STUDY_AHEAD__={getCurrent:()=>last,prefill,refresh:sync,version:'20260920-r174'};
})();