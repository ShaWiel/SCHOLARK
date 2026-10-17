(() => {
  if(window.__SCHOLARK_V83_STUDY_AHEAD_CLOUD__)return;
  window.__SCHOLARK_V83_STUDY_AHEAD_CLOUD__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim(), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let last=null,saved=[],savedEpoch=0,studyOwner='',deleting=false,openedTrackId=null,savedNotice='';
  const css=document.createElement('style');css.id='scholark-v83-style';css.textContent=`
    .v83-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.v83-actions button{border:0;border-radius:10px;background:#17191f;color:#fff;padding:10px 12px;font:900 8px Inter;cursor:pointer}.v83-actions button.alt{background:#ece9ff;color:#574bd1}.v83-actions button:disabled{opacity:.5}
    .v83-status{font:750 8px/1.4 Inter;color:#6558c8;margin-top:8px}
    #v83-saved{margin:16px 0 22px;padding:17px;border:1px solid #d4daea;border-radius:17px;background:#f7f8fc;color:#232b40}
    .v83-saved-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}.v83-saved-head .v52-kicker{margin:0}
    .v83-saved{display:grid;gap:9px}.v83-saved-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:stretch;gap:8px;min-width:0}
    .v83-saved-card{border:1px solid #dde1ec;background:#fff;border-radius:12px;padding:14px;text-align:left;cursor:pointer;width:100%;min-width:0;color:#232b40}
    .v83-saved-card:hover,.v83-saved-card:focus-visible{border-color:#8675c5;background:#f4f0ff}.v83-saved-card b{display:block;font:800 12px/1.4 Inter,system-ui;overflow-wrap:anywhere}.v83-saved-card span{display:block;margin-top:5px;color:#687085;font:550 11px/1.45 Inter,system-ui}
    .v83-remove,.v83-remove-all{border:1px solid #d7b5c0;border-radius:11px;background:#fff7f8;color:#8c2d48;cursor:pointer;font:750 11px Inter,system-ui;padding:12px;min-height:44px}
    .v83-remove:hover,.v83-remove-all:hover{background:#fce6eb;border-color:#b66280}.v83-remove:disabled,.v83-remove-all:disabled{opacity:.45;cursor:not-allowed}
    .v83-saved-notice{min-height:18px;margin:10px 0 0;font:550 11px/1.5 Inter,system-ui;color:#6b587f;overflow-wrap:anywhere}
    .v83-empty{margin:0;font:550 12px/1.5 Inter,system-ui;color:#748096}
    @media(max-width:520px){#v83-saved{padding:12px}.v83-saved-row{grid-template-columns:minmax(0,1fr)}.v83-remove{justify-self:start}.v83-saved-head{align-items:flex-start}}
  `;document.head.appendChild(css);
  async function ctx(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  function isoDay(offset){const d=new Date();d.setDate(d.getDate()+offset);d.setHours(18,0,0,0);return d.toISOString()}
  function notice(message){savedNotice=clean(message);renderSaved()}
  async function persist(detail){
    last=detail;openedTrackId=null;
    try{localStorage.setItem('scholark_v83_study_ahead',JSON.stringify(detail))}catch{}
    try{
      const x=await ctx();if(!x){decorate('Saved on this device. Sign in to save study plans to the cloud.');return}
      const body={user_id:x.uid,field:clean(detail.field).slice(0,180),country:clean(detail.country)||null,target_school:clean(detail.targetSchool)||null,data:{schema:2,result:detail.result,context:detail.context||'',specialization:detail.specialization||'',depth:detail.depth||'foundation',horizon:detail.horizon||'',weeklyHours:detail.weeklyHours||'',studyFocus:detail.studyFocus||'balanced',provider:detail.provider||'',model:detail.model||''},updated_at:new Date().toISOString()};
      const r=await x.c.request('/rest/v1/study_ahead?select=id,field,country,target_school,data,created_at,updated_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
      if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.message||'Could not save Study Ahead track')}
      await loadSaved();decorate('Saved to SCHOLAVERUM Cloud.');
    }catch(e){decorate('Saved locally; cloud save failed: '+clean(e?.message||e))}
  }
  async function loadSaved(){
    if(deleting)return;
    const epoch=++savedEpoch;
    try{
      const x=await ctx();
      if(epoch!==savedEpoch)return;
      const uid=x?.uid||'';
      if(studyOwner!==uid){studyOwner=uid;saved=[];savedNotice='';openedTrackId=null}
      if(!x){renderSaved();return}
      const r=await x.c.request('/rest/v1/study_ahead?select=id,field,country,target_school,data,created_at,updated_at&user_id=eq.'+encodeURIComponent(uid)+'&order=updated_at.desc&limit=100',{method:'GET'});
      const d=await r.json().catch(()=>[]);
      if(epoch!==savedEpoch||studyOwner!==uid)return;
      if(!r.ok)throw new Error(d?.message||'Could not load saved studies');
      saved=Array.isArray(d)?d:[];renderSaved();
    }catch(e){if(epoch===savedEpoch)notice('Could not refresh saved studies: '+clean(e?.message||e))}
  }
  function renderSaved(){
    const host=$('#v83-saved');if(!host)return;
    host.innerHTML='<div class="v83-saved-head"><div class="v52-kicker">SAVED STUDY AHEAD TRACKS</div>'+
      (saved.length?'<button type="button" class="v83-remove-all" data-v83-remove-all '+(deleting?'disabled':'')+'>Remove all</button>':'')+'</div>'+
      (saved.length?'<div class="v83-saved">'+saved.map((x,i)=>'<div class="v83-saved-row"><button type="button" class="v83-saved-card" data-v83-saved="'+i+'" '+(deleting?'disabled':'')+'><b>'+esc(x.field||'Study')+(x.data?.specialization?' · '+esc(x.data.specialization):'')+(x.target_school?' · '+esc(x.target_school):'')+'</b><span>'+esc(x.country||'')+(x.data?.horizon?' · '+esc(x.data.horizon):'')+(x.updated_at?' · '+esc(new Date(x.updated_at).toLocaleDateString()):'')+' · Open study</span></button><button type="button" class="v83-remove" data-v83-remove="'+i+'" aria-label="Remove '+esc(x.field||'study')+'" '+(deleting?'disabled':'')+'>Remove</button></div>').join('')+'</div>':
      '<p class="v83-empty">'+(studyOwner?'No saved studies yet. New Study Ahead plans will appear here.':'Sign in to see and manage your saved studies.')+'</p>')+
      '<p class="v83-saved-notice" role="status" aria-live="polite">'+esc(savedNotice)+'</p>';
    $$('[data-v83-saved]',host).forEach(b=>b.onclick=()=>openSaved(saved[Number(b.dataset.v83Saved)]));
    $$('[data-v83-remove]',host).forEach(b=>b.onclick=()=>removeSaved(saved[Number(b.dataset.v83Remove)]));
    const all=$('[data-v83-remove-all]',host);if(all)all.onclick=()=>removeAllSaved();
  }
  function clearOpenedTrack(id=null){
    if(id!==null&&String(openedTrackId)!==String(id))return;
    openedTrackId=null;last=null;
    try{localStorage.removeItem('scholark_v83_study_ahead')}catch{}
    const out=$('#v62-study-results');if(out)out.replaceChildren();
  }
  async function deleteCloud(path,uid){
    const x=await ctx();if(!x||x.uid!==uid)throw new Error('Your session changed. Sign in again.');
    const r=await x.c.request('/rest/v1/study_ahead?'+path+'&user_id=eq.'+encodeURIComponent(uid)+'&select=id',{method:'DELETE',headers:{Prefer:'return=representation'}});
    const d=await r.json().catch(()=>[]);
    if(!r.ok)throw new Error(d?.message||'Could not remove saved study');
    if(!Array.isArray(d)||!d.length)throw new Error('No saved studies were removed. Refresh and try again.');
    return d;
  }
  async function removeSaved(row){
    if(deleting||!row?.id||!studyOwner)return;
    const uid=studyOwner;deleting=true;savedEpoch++;notice('Removing study…');
    try{
      await deleteCloud('id=eq.'+encodeURIComponent(row.id),uid);
      if(studyOwner!==uid)throw new Error('Account changed while removing the study');
      saved=saved.filter(x=>x.id!==row.id);
      clearOpenedTrack(row.id);
      notice('Study removed from your saved plans.');
    }catch(e){notice('Remove failed: '+clean(e?.message||e))}
    finally{deleting=false;renderSaved()}
  }
  async function removeAllSaved(){
    if(deleting||!saved.length||!studyOwner)return;
    if(!window.confirm('Remove ALL saved Study Ahead plans from your account? This cannot be undone.'))return;
    const uid=studyOwner;deleting=true;savedEpoch++;notice('Removing all saved studies…');
    try{
      await deleteCloud('id=not.is.null',uid);
      if(studyOwner!==uid)throw new Error('Account changed while removing studies');
      saved=[];clearOpenedTrack();notice('All saved Study Ahead plans have been removed.');
    }catch(e){notice('Remove all failed: '+clean(e?.message||e));}
    finally{deleting=false;renderSaved()}
  }
  function list(items){const a=(items||[]).filter(Boolean);return a.length?'<ul>'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':''}
  function legacyEmpty(label){return '<div class="v62-study-line"><b>'+esc(label||'More detail')+'</b><span>This saved track predates the advanced Study Ahead format. Rebuild the track once to populate this section with full details.</span></div>'}
  function books(items){
    const a=Array.isArray(items)?items.slice():[];
    if(!a.length)return '<div class="v62-study-table">'+legacyEmpty('Reading path')+'</div>';
    return a.sort((x,y)=>(Number(x?.readingOrder)||99)-(Number(y?.readingOrder)||99)).map((x,i)=>{
      if(typeof x==='string')return '<div class="v62-book"><strong>'+esc((i+1)+'. '+x)+'</strong><small>Legacy recommendation</small><div>Rebuild this track for author, level and reading-order detail.</div></div>';
      return '<div class="v62-book"><strong>'+esc((x.readingOrder?x.readingOrder+'. ':'')+(x.title||''))+'</strong><small>'+esc(x.author||'')+(x.level?' · '+esc(x.level):'')+'</small><div>'+esc(x.why||'')+'</div></div>';
    }).join('')
  }
  function rows(items,titleKey='name',detailKey='purpose'){
    const a=Array.isArray(items)?items:[];
    if(!a.length)return '<div class="v62-study-table">'+legacyEmpty('Advanced detail')+'</div>';
    return '<div class="v62-study-table">'+a.map(x=>typeof x==='string'?'<div class="v62-study-line"><b>'+esc(x)+'</b><span>Rebuild the track for expanded guidance.</span></div>':'<div class="v62-study-line"><b>'+esc(x?.[titleKey]||'')+'</b><span>'+esc(x?.[detailKey]||'')+'</span></div>').join('')+'</div>'
  }
  function firstYearReview(review){
    const r=review&&typeof review==='object'?review:{},sections=[
      ['Readiness areas',r.readinessAreas],
      ['Self-check before you start',r.selfCheck],
      ['Common first-year challenges',r.commonChallenges],
      ['Before classes begin',r.beforeYouStart]
    ];
    if(!sections.some(([,items])=>Array.isArray(items)&&items.length))return '<div class="v62-study-table">'+legacyEmpty('First-year readiness review')+'</div>';
    return '<div class="v62-study-grid">'+sections.map(([title,items])=>'<div><b>'+esc(title)+'</b>'+list(items)+'</div>').join('')+'</div>'
  }
  function branches(items){
    const a=Array.isArray(items)?items:[];
    if(!a.length)return '<div class="v62-study-table">'+legacyEmpty('Branches & specializations')+'</div>';
    return '<div class="v62-branch-grid">'+a.map(x=>'<div class="v62-branch"><h4>'+esc(x.name||'')+'</h4><p>'+esc(x.summary||'')+'</p>'+(x.whatYouDo?'<div><b>What you actually do</b><p>'+esc(x.whatYouDo)+'</p></div>':'')+'<div><b>Specializations</b><div class="v62-pillrow">'+(x.specializations||[]).map(v=>'<span class="v62-pill">'+esc(v)+'</span>').join('')+'</div></div><div><b>Foundation topics</b>'+list(x.foundationTopics)+'</div><div><b>Typical tasks</b>'+list(x.typicalTasks)+'</div><div><b>Good fit if</b>'+list(x.goodFitIf)+'</div><div><b>Starter skills</b>'+list(x.starterSkills)+'</div><div><b>Career examples</b>'+list(x.careerExamples)+'</div><button type="button" data-v83-focus-branch="'+esc(x.name||'')+'">Use this branch as my focus</button></div>').join('')+'</div>'
  }
  function renderTrack(detail){
    if(!detail?.result)return;last=detail;localStorage.setItem('scholark_v83_study_ahead',JSON.stringify(detail));
    const r=detail.result,out=$('#v62-study-results');if(!out)return;
    const advanced=Array.isArray(r.branchMap)&&r.branchMap.length;
    out.innerHTML=advanced
      ? '<div class="v62-answer-card"><h3>'+esc(r.title||detail.field||'Study Ahead')+'</h3><p>'+esc(r.overview||'')+'</p></div>'+
        '<div class="v62-answer-card"><h4>Branches & specializations</h4>'+branches(r.branchMap)+'</div>'+
        '<div class="v62-answer-card"><h4>Recommended specialization focus</h4><p><b>'+esc(r.recommendedSpecialization?.name||detail.specialization||'Explore first')+'</b></p><p>'+esc(r.recommendedSpecialization?.why||'')+'</p><div class="v62-study-grid"><div><b>Prerequisites</b>'+list(r.recommendedSpecialization?.prerequisites)+'</div><div><b>Next steps</b>'+list(r.recommendedSpecialization?.nextSteps)+'</div></div></div>'+
        '<div class="v62-study-grid"><div class="v62-answer-card"><h4>Skills to build</h4>'+list(r.skills)+'</div><div class="v62-answer-card"><h4>Key subjects</h4>'+list(r.keySubjects)+'</div></div>'+
        '<div class="v62-study-grid"><div class="v62-answer-card"><h4>Reading path</h4>'+books(r.books)+'</div><div class="v62-answer-card"><h4>Learning resources</h4>'+rows(r.learningResources,'name','purpose')+'</div></div>'+
        '<div class="v62-study-grid"><div class="v62-answer-card"><h4>Starter projects / practice</h4>'+rows(r.starterProjects,'title','outcome')+'</div><div class="v62-answer-card"><h4>Tools, software & methods</h4>'+rows(r.tools,'name','purpose')+'</div></div>'+
        '<div class="v62-study-grid"><div class="v62-answer-card"><h4>First-year preview</h4>'+rows(r.firstYearPreview,'topic','whyItMatters')+'</div><div class="v62-answer-card"><h4>University preparation</h4>'+list(r.universityPrep)+'</div></div>'+
        '<div class="v62-answer-card"><h4>First-year readiness review</h4>'+firstYearReview(r.firstYearReview)+'</div>'+
        '<div class="v62-study-grid"><div class="v62-answer-card"><h4>Career directions</h4>'+list(r.careers)+'</div><div class="v62-answer-card"><h4>Questions to explore</h4>'+list(r.questionsToExplore)+'</div></div>'+
        '<div class="v62-answer-card"><h4>Weekly preparation plan</h4>'+(r.weeklyPlan||[]).map(x=>'<div class="v62-study-line"><b>'+esc(x.block||'Study block')+' · '+esc(x.minutes||0)+' min</b><span>'+esc(x.focus||'')+'</span></div>').join('')+'</div>'+
        '<div class="v62-answer-card"><h4>Your roadmap</h4>'+((r.roadmap||[]).map(x=>'<div class="v62-book"><strong>'+esc(x.phase||'Phase')+'</strong><small>'+esc(x.goal||'')+'</small>'+list(x.actions)+(x.milestone?'<p><b>Milestone:</b> '+esc(x.milestone)+'</p>':'')+'</div>').join(''))+'</div>'
      : '<div class="v62-answer-card"><h3>'+esc(r.title||detail.field||'Study Ahead')+'</h3><p>'+esc(r.overview||'')+'</p></div>'+
        '<div class="v62-row"><div class="v62-answer-card"><h4>Skills to build</h4>'+list(r.skills)+'</div><div class="v62-answer-card"><h4>Key subjects</h4>'+list(r.keySubjects)+'</div></div>'+
        '<div class="v62-row"><div class="v62-answer-card"><h4>Books & resources</h4>'+list(r.books)+'</div><div class="v62-answer-card"><h4>University preparation</h4>'+list(r.universityPrep)+'</div></div>'+
        '<div class="v62-answer-card"><h4>Career directions</h4>'+list(r.careers)+'</div><div class="v62-answer-card"><h4>Your roadmap</h4>'+((r.roadmap||[]).map(x=>'<p><b>'+esc(x.phase)+'</b></p>'+list(x.actions)).join(''))+'</div>';
    Array.from(out.querySelectorAll('[data-v83-focus-branch]')).forEach(b=>b.onclick=()=>{const v=clean(b.dataset.v83FocusBranch);if($('#v62-specialization'))$('#v62-specialization').value=v;$('#v62-specialization')?.scrollIntoView({behavior:'smooth',block:'center'});$('#v62-specialization')?.focus()});
    decorate('Track opened. Connect it to Tutor, Planner, reading, projects or Mastery when ready.');
    out.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function openSaved(row){if(!row)return;openedTrackId=row.id;renderTrack({field:row.field,country:row.country||'',targetSchool:row.target_school||'',specialization:row.data?.specialization||'',depth:row.data?.depth||'foundation',horizon:row.data?.horizon||'',weeklyHours:row.data?.weeklyHours||'',studyFocus:row.data?.studyFocus||'balanced',context:row.data?.context||'',result:row.data?.result||{},provider:row.data?.provider||'',model:row.data?.model||''})}
  function ensureSavedHost(){
    const h=$('.v62-study');if(!h||$('#v83-saved',h))return;
    const host=document.createElement('section');host.id='v83-saved';
    const form=$('.v62-form',h);form?.insertAdjacentElement('afterend',host);renderSaved();
  }
  function decorate(statusText=''){
    const out=$('#v62-study-results');if(!out||!last)return;
    let bar=$('#v83-actions',out);if(!bar){bar=document.createElement('div');bar.id='v83-actions';bar.innerHTML='<div class="v83-actions"><button type="button" data-v83="tutor">Start learning with AI Tutor</button><button type="button" data-v83="planner">Add roadmap to Planner</button><button type="button" data-v83="reading">Add reading plan</button><button type="button" data-v83="projects">Add projects to Planner</button><button type="button" class="alt" data-v83="mastery">Add key subjects to Mastery</button><button type="button" class="alt" data-v83="goal">Turn this into a Goal</button><button type="button" class="alt" data-v83="refresh">Save / refresh track</button></div><div class="v83-status"></div>';out.appendChild(bar);$$('[data-v83]',bar).forEach(b=>b.onclick=()=>action(b.dataset.v83,b))}
    $('.v83-status',bar).textContent=statusText||'Study Ahead is connected to your Planner and Mastery Map.';
  }
  async function action(type,btn){
    if(!last)return;btn.disabled=true;const st=$('#v83-actions .v83-status');if(st)st.textContent='Working…';
    try{
      if(type==='tutor'){
        const prompt='Teach me the foundations I should know before studying '+clean(last.field)+(last.specialization?' with a focus on '+clean(last.specialization):'')+'. Start at my current level, explain everything step by step, use worked examples, and connect the lesson to these key subjects: '+(last.result?.keySubjects||[]).slice(0,8).join(', ')+'.';
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
        const added=Math.max(0,(api?.data?.planner?.().length||0)-before);if(x)window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadPlanner?.(true,true);
        if(st)st.textContent=(added||0)+' new Study Ahead action'+(added===1?'':'s')+' connected to Planner'+(x?' · Cloud sync queued':'')+'.';
      }else if(type==='reading'){
        const api=window.__SCHOLARK_WORKSPACE_CORE__,field=clean(last.field)||'Study Ahead',before=api?.data?.planner?.().length||0;
        const reading=(last.result?.books||[]).slice().sort((a,b)=>(Number(a?.readingOrder)||99)-(Number(b?.readingOrder)||99)).slice(0,12);
        if(!reading.length)throw new Error('This track has no structured reading plan yet.');
        reading.forEach((book,i)=>api?.actions?.addPlan?.({text:'Read: '+clean(book.title)+(book.author?' — '+clean(book.author):''),type:'study',subject:field,date:new Date(Date.now()+(2+i*4)*86400000).toISOString().slice(0,10),time:'',duration:45,priority:i<3?'high':'medium',goalId:'',sourceKey:'study-reading:'+field.toLowerCase()+':'+clean(book.title).toLowerCase()}));
        const added=Math.max(0,(api?.data?.planner?.().length||0)-before);if(x)window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadPlanner?.(true,true);if(st)st.textContent=added+' reading item'+(added===1?'':'s')+' added to Planner.';
      }else if(type==='projects'){
        const api=window.__SCHOLARK_WORKSPACE_CORE__,field=clean(last.field)||'Study Ahead',before=api?.data?.planner?.().length||0,projects=(last.result?.starterProjects||[]).slice(0,8);
        if(!projects.length)throw new Error('This track has no starter projects yet.');
        projects.forEach((project,i)=>api?.actions?.addPlan?.({text:'Project: '+clean(project.title),type:'study',subject:field,date:new Date(Date.now()+(5+i*7)*86400000).toISOString().slice(0,10),time:'',duration:90,priority:i<2?'high':'medium',goalId:'',sourceKey:'study-project:'+field.toLowerCase()+':'+clean(project.title).toLowerCase()}));
        const added=Math.max(0,(api?.data?.planner?.().length||0)-before);if(x)window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadPlanner?.(true,true);if(st)st.textContent=added+' starter project'+(added===1?'':'s')+' added to Planner.';
      }else if(type==='mastery'){
        const focusBranch=(last.result?.branchMap||[]).find(x=>clean(x?.name).toLowerCase()===clean(last.specialization||last.result?.recommendedSpecialization?.name).toLowerCase());const topics=[...(last.result?.keySubjects||[]),...(last.result?.skills||[]),...(last.result?.recommendedSpecialization?.prerequisites||[]),...(focusBranch?.foundationTopics||[])].map(clean).filter(Boolean).slice(0,30);
        if(!topics.length)throw new Error('This roadmap has no mastery topics.');
        const api=window.__SCHOLARK_WORKSPACE_CORE__,subject=clean(last.field)||'Study Ahead',before=api?.data?.mastery?.().length||0;
        for(const topic of topics){const due=new Date();due.setDate(due.getDate()+1);api?.actions?.upsertMastery?.({subject,topic,status:'New',mastery:0,nextReviewAt:due.toISOString()})}
        const added=Math.max(0,(api?.data?.mastery?.().length||0)-before);if(x)window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadMastery?.(true,true);
        if(st)st.textContent=added+' new key subject'+(added===1?'':'s')+'/skill'+(added===1?'':'s')+' connected to Mastery'+(x?' · Cloud sync queued':'')+'.';
      }else if(type==='goal'){
        const text='Prepare for '+clean(last.field)+(last.specialization?' · '+clean(last.specialization):''),api=window.__SCHOLARK_WORKSPACE_CORE__,before=api?.data?.goals?.().length||0;
        api?.actions?.addGoal?.({text,category:'school',date:'',measure:'Complete the Study Ahead roadmap, reading path and starter projects, and reach confident mastery of the key subjects.',sourceKey:'study-goal:'+clean(last.field).toLowerCase()+':'+clean(last.specialization||'general').toLowerCase()});
        const added=(api?.data?.goals?.().length||0)>before;if(x)window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadGoals?.(true,true);if(st)st.textContent=added?'Study Ahead goal added to Goals.':'Study Ahead goal is already connected to Goals.';
      }
    }catch(e){if(st)st.textContent=clean(e?.message||e)}finally{btn.disabled=false}
  }
  addEventListener('scholark:study-ahead-generated',e=>{persist(e.detail||{});setTimeout(sync,80)});
  function sync(){if(location.hash.toLowerCase()==='#study'){ensureSavedHost();loadSaved();try{last=last||JSON.parse(localStorage.getItem('scholark_v83_study_ahead')||'null')}catch{}if(last)decorate()}}
  addEventListener('hashchange',()=>{setTimeout(sync,80);setTimeout(sync,280)});
  addEventListener('scholark:auth-changed',()=>{savedEpoch++;saved=[];studyOwner='';openedTrackId=null;last=null;savedNotice='';try{localStorage.removeItem('scholark_v83_study_ahead')}catch{}renderSaved();if(location.hash.toLowerCase()==='#study')setTimeout(loadSaved,40)});
  setTimeout(sync,300);
  function prefill(data={}){
    const apply=()=>{if($('#v62-field')&&data.field!==undefined)$('#v62-field').value=clean(data.field);if($('#v62-country')&&data.country!==undefined)$('#v62-country').value=clean(data.country);if($('#v62-school')&&data.targetSchool!==undefined)$('#v62-school').value=clean(data.targetSchool);if($('#v62-specialization')&&data.specialization!==undefined)$('#v62-specialization').value=clean(data.specialization);if($('#v62-context')&&data.context!==undefined)$('#v62-context').value=clean(data.context);if($('#v62-horizon')&&data.horizon&&[...$('#v62-horizon').options].some(o=>o.value===data.horizon))$('#v62-horizon').value=data.horizon;if($('#v62-weekly-hours')&&data.weeklyHours&&[...$('#v62-weekly-hours').options].some(o=>o.value===String(data.weeklyHours)))$('#v62-weekly-hours').value=String(data.weeklyHours);if($('#v62-focus')&&data.studyFocus&&[...$('#v62-focus').options].some(o=>o.value===data.studyFocus))$('#v62-focus').value=data.studyFocus;$('#v62-field')?.focus()};
    if(String(location.hash||'').toLowerCase()!=='#study')window.__SCHOLARK_WORKSPACE__?.openTool?.('study');setTimeout(apply,140);return true;
  }
  window.__SCHOLARK_V83_STUDY_AHEAD__={getCurrent:()=>last,prefill,openTrack:renderTrack,refresh:sync,version:'20261017-r286'};
})();