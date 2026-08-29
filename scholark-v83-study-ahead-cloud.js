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
    $('[data-v83-saved]',host).forEach(b=>b.onclick=()=>openSaved(saved[+b.dataset.v83Saved]));
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
    let bar=$('#v83-actions',out);if(!bar){bar=document.createElement('div');bar.id='v83-actions';bar.innerHTML='<div class="v83-actions"><button type="button" data-v83="tutor">Start learning with AI Tutor</button><button type="button" data-v83="planner">Add roadmap to Planner</button><button type="button" class="alt" data-v83="mastery">Add key subjects to Mastery</button><button type="button" class="alt" data-v83="refresh">Save / refresh track</button></div><div class="v83-status"></div>';out.appendChild(bar);$$('[data-v83]',bar).forEach(b=>b.onclick=()=>action(b.dataset.v83,b))}
    $('.v83-status',bar).textContent=statusText||'Study Ahead is connected to your Planner and Mastery Map.';
  }
  async function action(type,btn){
    if(!last)return;btn.disabled=true;const st=$('#v83-actions .v83-status');if(st)st.textContent='Working…';
    try{
      if(type==='tutor'){
        const prompt='Teach me the foundations I should know before studying '+clean(last.field)+'. Start at my current level, explain everything step by step, use worked examples, and connect the lesson to these key subjects: '+(last.result?.keySubjects||[]).slice(0,8).join(', ')+'.';
        window.__SCHOLARK_V91__?.openTool?.('tutor')||$('#v51-sidebar [data-v51-tool="tutor"]')?.click();
        setTimeout(()=>{const q=$('#v52-tutor-q');if(q){q.value=prompt;q.focus()}},180);return;
      }
      const x=await ctx();if(!x){cloud()?.openAuth?.();throw new Error('Sign in to sync Study Ahead with Planner or Mastery.')}
      if(type==='refresh'){await persist(last);return}
      if(type==='planner'){
        const actions=[];for(const phase of last.result?.roadmap||[])for(const a of phase.actions||[])if(clean(a))actions.push({phase:phase.phase||'Study Ahead',text:clean(a)});
        const rows=actions.slice(0,18).map((a,i)=>({user_id:x.uid,title:a.text.slice(0,240),subject:clean(last.field).slice(0,160),notes:'Study Ahead · '+clean(a.phase).slice(0,160),due_at:isoDay(1+i*2),duration_minutes:45,priority:i<4?'high':'medium',status:'todo',source:'study_ahead'}));
        if(!rows.length)throw new Error('This roadmap has no planner actions.');
        const r=await x.c.request('/rest/v1/planner_tasks',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(rows)});if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.message||'Planner sync failed')}
        window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadPlanner?.(false);if(st)st.textContent=rows.length+' Study Ahead actions added to Planner.';
      }else if(type==='mastery'){
        const topics=[...(last.result?.keySubjects||[]),...(last.result?.skills||[])].map(clean).filter(Boolean).slice(0,24);
        if(!topics.length)throw new Error('This roadmap has no mastery topics.');
        const rows=topics.map(topic=>({user_id:x.uid,subject:clean(last.field).slice(0,160)||'Study Ahead',topic:topic.slice(0,240),mastery:0,attempts:0,correct:0,incorrect:0,streak:0}));
        const r=await x.c.request('/rest/v1/mastery_topics?on_conflict=user_id,subject,topic',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(rows)});if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.message||'Mastery sync failed')}
        window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadMastery?.(false);if(st)st.textContent=topics.length+' key subjects/skills connected to Mastery.';
      }
    }catch(e){if(st)st.textContent=clean(e?.message||e)}finally{btn.disabled=false}
  }
  addEventListener('scholark:study-ahead-generated',e=>persist(e.detail||{}));
  function sync(){if(location.hash.toLowerCase()==='#study'){ensureSavedHost();loadSaved();try{last=last||JSON.parse(localStorage.getItem('scholark_v83_study_ahead')||'null')}catch{}if(last)decorate()}}
  new MutationObserver(()=>{clearTimeout(window.__v83sync);window.__v83sync=setTimeout(sync,100)}).observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('hashchange',()=>setTimeout(sync,60));setTimeout(sync,300);
})();