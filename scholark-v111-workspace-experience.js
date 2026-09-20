(() => {
  if(window.__SCHOLARK_V111_WORKSPACE_EXPERIENCE__)return;
  window.__SCHOLARK_V111_WORKSPACE_EXPERIENCE__=true;

  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const core=()=>window.__SCHOLARK_WORKSPACE_CORE__;
  const route=()=>String(location.hash||'#dashboard').replace(/^#/,'').toLowerCase();
  const today=()=>new Date().toISOString().slice(0,10);
  let busy=false,raf=0;

  const style=document.createElement('style');style.id='scholark-v111-style';style.textContent=`
    .v111-live{margin:0 0 16px;border:1px solid rgba(23,25,31,.08);border-radius:24px;background:linear-gradient(145deg,#fbfaf6,#f1eefb);padding:17px;box-shadow:0 18px 55px rgba(31,27,63,.055);font-family:Inter,system-ui;color:#17191f}.v111-live *{box-sizing:border-box}
    .v111-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.v111-kicker{font:950 7px Inter;letter-spacing:.14em;color:#6d5dfc}.v111-top h2{font:950 24px/.98 Inter;margin:5px 0 0;letter-spacing:-.035em}.v111-top p{font:650 8px/1.45 Inter;color:#746f7b;max-width:720px;margin:6px 0 0}.v111-pill{border-radius:999px;background:#17191f;color:#c9ff6a;padding:7px 9px;font:900 6.5px Inter;white-space:nowrap}
    .v111-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:12px}.v111-kpi{background:#fff;border:1px solid rgba(23,25,31,.06);border-radius:13px;padding:10px}.v111-kpi b{display:block;font:950 18px Inter}.v111-kpi span{display:block;margin-top:3px;font:700 6.5px/1.3 Inter;color:#777}
    .v111-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:9px;margin-top:10px}.v111-card{background:#fff;border:1px solid rgba(23,25,31,.06);border-radius:15px;padding:12px}.v111-card.dark{background:#17191f;color:#fff}.v111-card.lime{background:#c9ff6a}.v111-card h3{font:950 10px Inter;margin:0 0 6px}.v111-card p{font:650 7px/1.45 Inter;color:#746f7b;margin:0}.v111-card.dark p{color:#d4d0db}.v111-card.lime p{color:#394113}.v111-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.v111-actions button{border:0;border-radius:9px;background:#eceaf4;color:#4b4357;padding:7px 9px;font:850 6.5px Inter;cursor:pointer}.v111-actions button.primary{background:#17191f;color:#c9ff6a}.v111-actions button.lime{background:#c9ff6a;color:#17191f}.v111-chiprow{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}.v111-chip{display:inline-flex;border-radius:999px;background:#efedff;color:#5b4ed1;padding:5px 7px;font:850 6px Inter}.v111-card.dark .v111-chip{background:rgba(255,255,255,.09);color:#fff}
    .v111-mastery{display:grid;gap:7px}.v111-topic header{display:flex;justify-content:space-between;font:850 6.3px Inter}.v111-bar{height:6px;border-radius:99px;background:#ece9ef;overflow:hidden;margin-top:4px}.v111-bar i{display:block;height:100%;border-radius:99px;background:#6d5dfc}.v111-topic.weak .v111-bar i{background:#ff8a7a}.v111-week{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}.v111-day{min-height:105px;background:#fff;border:1px solid rgba(23,25,31,.06);border-radius:11px;padding:7px}.v111-day>small{font:900 5.7px Inter;color:#7b7680}.v111-event{margin-top:5px;border-radius:6px;padding:5px;font:800 5.5px/1.25 Inter;background:#ece8ff;color:#5749c7}.v111-event.high{background:#17191f;color:#fff}.v111-event.review{background:#eaffbd;color:#344112}
    .v111-chart{height:92px;display:flex;align-items:end;gap:5px;margin-top:8px}.v111-chart i{flex:1;min-height:5px;border-radius:5px 5px 2px 2px;background:#dcd7ff;transition:height .2s ease}.v111-deadline{display:grid;gap:6px}.v111-deadline-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:8px;border-radius:9px;background:#f5f3f8;font:750 6.5px/1.35 Inter}.v111-deadline-row b{font-weight:900}.v111-deadline-row.overdue{background:#ffe9e5;color:#8b3830}
    .v111-project-form{display:grid;grid-template-columns:1.3fr 1fr auto;gap:6px;margin-top:8px}.v111-project-form input{min-width:0;border:1px solid rgba(23,25,31,.12);border-radius:9px;padding:8px;font:750 7px Inter}.v111-project-form button{border:0;border-radius:9px;background:#17191f;color:#c9ff6a;padding:8px 10px;font:900 6.5px Inter;cursor:pointer}.v111-projects{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:8px}.v111-project{border-radius:12px;background:#fff;border:1px solid rgba(23,25,31,.06);padding:10px}.v111-project b{display:block;font:900 8px Inter}.v111-project span{display:block;font:650 6px/1.35 Inter;color:#777;margin-top:4px}
    .v111-tutor-tools{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.v111-tutor-tools button{border:0;border-radius:999px;background:#fff;color:#514867;padding:5px 7px;font:850 6px Inter;cursor:pointer;box-shadow:0 0 0 1px rgba(23,25,31,.08)}.v111-tutor-tools button.good{background:#c9ff6a;color:#17191f}
    @media(max-width:850px){.v111-kpis{grid-template-columns:1fr 1fr}.v111-grid{grid-template-columns:1fr}.v111-week{grid-template-columns:1fr 1fr}.v111-projects{grid-template-columns:1fr 1fr}.v111-project-form{grid-template-columns:1fr}.v111-top{display:block}.v111-pill{display:inline-block;margin-top:8px}}@media(max-width:540px){.v111-projects{grid-template-columns:1fr}.v111-week{grid-template-columns:1fr}}
  `;document.head.appendChild(style);

  function rootFor(tool){
    if(tool==='ai')return $('#v107-ai');
    if(['tutor','education','planner','progress','goal'].includes(tool))return $('.v52-tool');
    if(['focus','flashcards','assignments'].includes(tool))return $('[data-tool="'+tool+'"]')||$('#v51-fallback');
    if(tool==='language')return $('.v93')||$('#v51-fallback');
    if(tool==='files')return $('.v86')||$('#v51-fallback');
    if(tool==='project')return $('#v51-fallback');
    if(tool==='schools')return $('#v50-school.open .v50-box')||$('#v50-school.open');
    if(tool==='study')return $('.v83')||$('.v62-study')||$('#v51-fallback');
    return null;
  }
  function panel(title,desc,body,pill='CONNECTED'){
    return '<section class="v111-live" data-v111-owner="r174"><div class="v111-top"><div><div class="v111-kicker">SCHOLARK · CONNECTED WORKSPACE</div><h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p></div><span class="v111-pill">'+esc(pill)+'</span></div>'+body+'</section>';
  }
  function kpi(value,label){return '<div class="v111-kpi"><b>'+esc(value)+'</b><span>'+esc(label)+'</span></div>'}
  function openArki(prompt){
    if(window.__SCHOLARK_V114_ORCHESTRATOR__?.handoff)return window.__SCHOLARK_V114_ORCHESTRATOR__.handoff('ai',{prompt});
    try{sessionStorage.setItem('scholark_v108_arki_prompt',prompt)}catch{}
    core()?.actions.open('ai');
  }
  function openTutor(prompt){
    if(window.__SCHOLARK_V114_ORCHESTRATOR__?.handoff)return window.__SCHOLARK_V114_ORCHESTRATOR__.handoff('tutor',{prompt});
    core()?.actions.open('tutor');
    setTimeout(()=>{const q=$('#v52-tutor-q');if(q){q.value=prompt;q.focus()}},160);
  }
  function answerNorm(value){return clean(value).toLowerCase().replace(/^[a-z]\s*[.):-]\s*/i,'').replace(/[“”"'!?.,;:()]/g,'').replace(/\s+/g,' ').trim()}
  function answerMatches(given,answer,choices=[]){
    const g=answerNorm(given);let a=answerNorm(answer);if(!g||!a)return false;
    if(/^[a-z]$/i.test(a)&&choices.length){const idx=a.charCodeAt(0)-97;if(choices[idx]!=null)a=answerNorm(choices[idx])}
    if(g===a||g.includes(a)||a.includes(g))return true;
    const aw=new Set(a.split(' ').filter(x=>x.length>2)),gw=new Set(g.split(' ').filter(x=>x.length>2));let hit=0;gw.forEach(x=>{if(aw.has(x))hit++});
    return !!gw.size&&hit/Math.max(1,Math.min(gw.size,aw.size))>=.6;
  }
  async function tutorQuickCheck(msg,topic,button){
    let zone=msg.querySelector('.v111-quick-check');if(zone)zone.remove();
    zone=document.createElement('div');zone.className='v111-quick-check';zone.style.cssText='margin-top:9px;padding:10px;border:1px solid rgba(23,25,31,.09);border-radius:12px;background:#fff;color:#17191f';
    zone.innerHTML='<b style="font:900 8px Inter">QUICK CHECK</b><p style="font:650 7px/1.4 Inter;color:#777">Generating one understanding question…</p>';msg.appendChild(zone);
    button.disabled=true;button.textContent='Building check…';
    try{
      const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'exam',subject:'AI Tutor',topics:[topic],count:1,difficulty:'medium',prompt:'Create one concise understanding check for this tutor lesson. Prefer multiple choice when appropriate.',context:clean(msg.innerText).slice(0,7000),level:localStorage.getItem('scholark_learning_level')||'student',language:window.__SCHOLARK_I18N__?.languageName?.(localStorage.getItem('scholark_ui_language')||'en')||'English'})});
      const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)throw new Error(d?.error||'Quick check unavailable');
      const q=d.result?.questions?.[0];if(!q)throw new Error('No question returned');
      const choices=q.choices||[];
      zone.innerHTML='<b style="font:900 8px Inter">QUICK CHECK</b><p style="font:800 8px/1.45 Inter;margin:7px 0">'+esc(q.prompt)+'</p>'+
        (choices.length?'<div style="display:grid;gap:5px">'+choices.map((x,i)=>'<button type="button" data-v111-qc-choice="'+esc(x)+'" style="border:1px solid rgba(23,25,31,.1);background:#f7f6f3;border-radius:8px;padding:7px;text-align:left;font:750 6.5px Inter;cursor:pointer">'+String.fromCharCode(65+i)+'. '+esc(x)+'</button>').join('')+'</div>':'<div style="display:flex;gap:5px"><input data-v111-qc-input placeholder="Your answer…" style="flex:1;border:1px solid rgba(23,25,31,.12);border-radius:8px;padding:7px;font:700 7px Inter"><button type="button" data-v111-qc-submit style="border:0;border-radius:8px;background:#17191f;color:#c9ff6a;padding:7px 9px;font:850 6.5px Inter">Check</button></div>')+'<div data-v111-qc-feedback style="margin-top:7px"></div>';
      const grade=given=>{
        if(zone.dataset.graded==='1')return;zone.dataset.graded='1';const ok=answerMatches(given,q.answer,choices),fb=zone.querySelector('[data-v111-qc-feedback]');
        if(fb)fb.innerHTML='<span class="v111-chip">'+(ok?'✓ Correct':'Needs review')+'</span><p style="font:650 6.5px/1.4 Inter;color:#777;margin:6px 0 0"><b>Answer:</b> '+esc(q.answer)+'<br>'+esc(q.explanation||'')+'</p>';
        const mastery=ok?82:35,status=ok?'Practising':'Learning';core()?.actions.upsertMastery({subject:'AI Tutor',topic:clean(q.topic)||topic,mastery,status,nextReviewAt:new Date(Date.now()+(ok?4:2)*86400000).toISOString()});
        core()?.record('tutor','quick_check',{topic:clean(q.topic)||topic,correct:ok});
        zone.querySelectorAll('button,input').forEach(x=>x.disabled=true);
      };
      zone.querySelectorAll('[data-v111-qc-choice]').forEach(b=>b.onclick=()=>grade(b.dataset.v111QcChoice));
      zone.querySelector('[data-v111-qc-submit]')?.addEventListener('click',()=>grade(zone.querySelector('[data-v111-qc-input]')?.value||''));
      button.textContent='Quick check ready';
    }catch(err){zone.innerHTML='<b style="font:900 8px Inter">QUICK CHECK</b><p style="font:650 7px Inter;color:#8b3830">Could not build the check. Try again.</p>';button.disabled=false;button.textContent='Quick check'}
  }

  async function generateCards(subject,topics=[],context=''){
    const api=core();if(!api)return 0;
    const body={mode:'flashcards',subject:subject||'SCHOLARK Review',topics:Array.isArray(topics)?topics:[topics],count:8,context:clean(context).slice(0,8000),level:localStorage.getItem('scholark_learning_level')||'student',language:window.__SCHOLARK_I18N__?.languageName?.(localStorage.getItem('scholark_ui_language')||'en')||'English'};
    const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
    const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)throw new Error(d?.error||'Could not generate flashcards');
    return api.actions.addFlashcards(d.result?.deck||subject||'SCHOLARK Review',d.result?.cards||[]);
  }
  function weekDays(){
    const out=[];const d=new Date();d.setHours(12,0,0,0);
    for(let i=0;i<5;i++){const x=new Date(d);x.setDate(d.getDate()+i);out.push({key:x.toISOString().slice(0,10),label:x.toLocaleDateString(undefined,{weekday:'short'}).toUpperCase()})}
    return out;
  }
  function plannerWeek(s){
    return '<div class="v111-week">'+weekDays().map(day=>{const items=s.planner.active.filter(x=>x.date===day.key).slice(0,3);return '<div class="v111-day"><small>'+esc(day.label)+'</small>'+(items.length?items.map(x=>'<div class="v111-event '+(x.priority==='high'?'high':x.type==='study'?'review':'')+'">'+esc(x.text)+(x.time?'<br>'+esc(x.time):'')+'</div>').join(''):'<div class="v111-event" style="opacity:.45">Open</div>')+'</div>'}).join('')+'</div>';
  }
  function masteryMap(s){
    const rows=s.mastery.all.slice().sort((a,b)=>a.mastery-b.mastery).slice(0,5);
    return '<div class="v111-mastery">'+(rows.length?rows.map(x=>'<div class="v111-topic '+(x.mastery<60?'weak':'')+'"><header><span>'+esc(x.subject+' · '+x.topic)+'</span><b>'+Math.round(x.mastery)+'%</b></header><div class="v111-bar"><i style="width:'+Math.round(x.mastery)+'%"></i></div></div>').join(''):'<p>No mastery data yet. Run a Diagnostic Check to build your learning map.</p>')+'</div>';
  }
  function dailyActivity(s){
    const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);let score=0;
      score+=s.focus.week.filter(x=>new Date(Number(x.endedAt||x.completedAt||x.startedAt)).toISOString().slice(0,10)===key).length*2;
      score+=s.flashcards.reviewed7d.filter(x=>new Date(x.lastReviewedAt).toISOString().slice(0,10)===key).length;
      score+=s.planner.done.filter(x=>x.completedAt&&new Date(x.completedAt).toISOString().slice(0,10)===key).length*2;
      days.push({key,label:d.toLocaleDateString(undefined,{weekday:'short'}),score});
    }
    const max=Math.max(1,...days.map(x=>x.score));
    return '<div class="v111-chart">'+days.map(x=>'<i title="'+esc(x.label)+'" style="height:'+Math.max(8,Math.round(x.score/max*100))+'%"></i>').join('')+'</div>';
  }
  function deadlines(s){
    const rows=[...s.assignments.active].sort((a,b)=>String(a.dueDate||'9999').localeCompare(String(b.dueDate||'9999'))).slice(0,5);
    return '<div class="v111-deadline">'+(rows.length?rows.map(x=>{const overdue=x.dueDate&&x.dueDate<today();return '<div class="v111-deadline-row '+(overdue?'overdue':'')+'"><div><b>'+esc(x.title)+'</b><br>'+esc(x.subject||x.type)+'</div><span>'+esc(x.dueDate||'No date')+' · '+x.progress+'%</span></div>'}).join(''):'<p>No active assignments.</p>')+'</div>';
  }

  function htmlFor(tool,s){
    const weak=s.mastery.weak[0],next=s.next;
    if(tool==='ai')return panel('Workspace context','ARKI can use your current goals, deadlines, mastery, flashcards and next action when workspace context is enabled.',
      '<div class="v111-kpis">'+kpi(s.goals.active.length,'Active goals')+kpi(s.mastery.weak.length,'Topics learning')+kpi(s.flashcards.due.length,'Flashcards due')+kpi(s.assignments.active.length,'Active assignments')+'</div><div class="v111-grid"><div class="v111-card dark"><h3>Next best action</h3><p>'+(next?esc(next.title+' — '+next.reason):'Your workspace is clear. Add a goal, assignment or learning topic to get a recommendation.')+'</p><div class="v111-actions">'+(next?'<button class="lime" data-v111-open="'+esc(next.tool)+'">Open '+esc(next.tool)+'</button>':'')+'</div></div><div class="v111-card"><h3>Connected signals</h3><div class="v111-chiprow">'+(weak?'<span class="v111-chip">Weak: '+esc(weak.topic)+'</span>':'')+'<span class="v111-chip">'+s.focus.minutes7d+' focus min</span><span class="v111-chip">'+s.planner.completion+'% planner</span><span class="v111-chip">'+s.activity.consistency+'% consistency</span></div></div></div>');
    if(tool==='tutor')return panel('Tutor learning loop','Explain → check understanding → practise → update Mastery. Tutor work can now feed the rest of your workspace.',
      '<div class="v111-grid"><div class="v111-card">'+masteryMap(s)+'</div><div class="v111-card dark"><h3>Practice queue</h3><p>'+(weak?'Your weakest current topic is '+esc(weak.topic)+' in '+esc(weak.subject)+'.':'Run a diagnostic or start a lesson to build a practice queue.')+'</p><div class="v111-actions">'+(weak?'<button class="lime" data-v111-tutor-weak>Practise weakest topic</button><button data-v111-cards-weak>Create flashcards</button>':'')+'</div></div></div>');
    if(tool==='education')return panel('Live mastery map','Diagnostics, mastery and spaced review now form one connected learning layer.',
      '<div class="v111-kpis">'+kpi(s.mastery.mastered.length,'Mastered')+kpi(s.mastery.weak.length,'Learning')+kpi(s.mastery.due.length,'Reviews due')+kpi(weak?Math.round(weak.mastery)+'%':'—','Weakest mastery')+'</div><div class="v111-grid"><div class="v111-card">'+masteryMap(s)+'</div><div class="v111-card lime"><h3>Recommended move</h3><p>'+(weak?'Practise '+esc(weak.topic)+' now, then reschedule it based on recall.':'Run a Diagnostic Check to identify what should enter Mastery.')+'</p><div class="v111-actions">'+(weak?'<button class="primary" data-v111-tutor-weak>Open in AI Tutor</button><button data-v111-plan-weak>Add review to Planner</button>':'')+'</div></div></div>');
    if(tool==='planner')return panel('Smart study week','Planner combines deadlines, goals, review work and focus blocks into one week view.',
      '<div class="v111-kpis">'+kpi(s.planner.active.length,'Open actions')+kpi(s.planner.dueToday.length,'Due today')+kpi(s.planner.overdue.length,'Overdue')+kpi(s.planner.completion+'%','Completion')+'</div><div class="v111-card" style="margin-top:10px">'+plannerWeek(s)+'</div><div class="v111-actions">'+(weak?'<button class="primary" data-v111-plan-weak>Plan weakest topic</button>':'')+'<button data-v111-open="focus">Open Focus Sessions</button></div>');
    if(tool==='focus')return panel('Focus performance','Focused blocks feed Progress and can stay connected to your Planner work.',
      '<div class="v111-kpis">'+kpi(s.focus.minutes7d,'Minutes · 7 days')+kpi(s.focus.week.length,'Sessions · 7 days')+kpi(s.planner.dueToday.length,'Planner due today')+kpi(s.activity.consistency+'%','Study consistency')+'</div><div class="v111-grid"><div class="v111-card">'+dailyActivity(s)+'</div><div class="v111-card dark"><h3>What to focus on</h3><p>'+(next?esc(next.title+' — '+next.reason):'Choose a Planner task or weak topic and start a focused block.')+'</p><div class="v111-actions"><button class="lime" data-v111-open="planner">Open Planner</button></div></div></div>');
    if(tool==='flashcards')return panel('Spaced repetition cockpit','Due cards, review history and weak topics stay connected to Tutor and Mastery.',
      '<div class="v111-kpis">'+kpi(s.flashcards.all.length,'Total cards')+kpi(s.flashcards.due.length,'Due now')+kpi(s.flashcards.reviewed7d.length,'Reviewed · 7 days')+kpi(new Set(s.flashcards.all.map(x=>x.deck)).size,'Decks')+'</div><div class="v111-grid"><div class="v111-card dark"><h3>Review queue</h3><p>'+(s.flashcards.due.length?'You have '+s.flashcards.due.length+' card'+(s.flashcards.due.length===1?'':'s')+' ready for active recall.':'Nothing is due right now. Strong cards are waiting for their next interval.')+'</p></div><div class="v111-card lime"><h3>Create from learning</h3><p>'+(weak?'Turn '+esc(weak.topic)+' into an 8-card spaced-repetition deck.':'Add a Mastery topic first, or build cards manually below.')+'</p><div class="v111-actions">'+(weak?'<button class="primary" data-v111-cards-weak>Generate 8 cards</button>':'')+'</div></div></div>');
    if(tool==='assignments')return panel('Assignment pipeline','Deadlines, progress, Planner steps and Tutor coaching stay connected.',
      '<div class="v111-kpis">'+kpi(s.assignments.active.length,'Active')+kpi(s.assignments.overdue.length,'Overdue')+kpi(s.assignments.all.filter(x=>x.status==='complete').length,'Completed')+kpi(s.assignments.active.filter(x=>x.dueDate&&x.dueDate>=today()&&x.dueDate<=new Date(Date.now()+7*86400000).toISOString().slice(0,10)).length,'Due within 7 days')+'</div><div class="v111-grid"><div class="v111-card">'+deadlines(s)+'</div><div class="v111-card dark"><h3>Connected workflow</h3><p>Break an assignment into Planner steps, use Focus Sessions to execute them, and ask AI Tutor when you get stuck.</p><div class="v111-actions"><button class="lime" data-v111-open="planner">Planner</button><button data-v111-open="tutor">AI Tutor</button></div></div></div>');
    if(tool==='progress')return panel('Learning analytics','Progress combines study activity instead of showing isolated counts.',
      '<div class="v111-kpis">'+kpi(s.focus.minutes7d,'Focus min · 7d')+kpi(s.planner.completion+'%','Planner done')+kpi(s.flashcards.reviewed7d.length,'Cards reviewed')+kpi(s.activity.consistency+'%','Consistency')+'</div><div class="v111-grid"><div class="v111-card"><h3>7-day activity</h3>'+dailyActivity(s)+'</div><div class="v111-card dark"><h3>Needs attention</h3><p>'+(weak?esc(weak.subject+' · '+weak.topic+' · '+Math.round(weak.mastery)+'% mastery'):'No weak topic is recorded yet.')+'</p><div class="v111-actions">'+(next?'<button class="lime" data-v111-open="'+esc(next.tool)+'">Next: '+esc(next.title)+'</button>':'')+'</div></div></div>');
    if(tool==='goal')return panel('Goal system','Goals become measurable when Planner actions, assignments and progress are linked to them.',
      '<div class="v111-kpis">'+kpi(s.goals.active.length,'Active goals')+kpi(s.goals.average+'%','Average progress')+kpi(s.goals.all.filter(x=>x.status==='complete').length,'Completed')+kpi(s.planner.active.filter(x=>x.goalId).length,'Linked actions')+'</div><div class="v111-grid"><div class="v111-card"><h3>Active goals</h3><div class="v111-chiprow">'+(s.goals.active.length?s.goals.active.slice(0,6).map(x=>'<span class="v111-chip">'+esc(x.text)+' · '+Math.max(0,Math.min(100,Number(x.progress)||0))+'%</span>').join(''):'<p>No active goals yet.</p>')+'</div></div><div class="v111-card lime"><h3>Make goals actionable</h3><p>Use “Plan with ARKI” below to turn a goal into concrete scheduled steps.</p></div></div>');
    if(tool==='language')return panel('Language progress','Language lessons can be continued with ARKI and connected to your overall learning rhythm.',
      '<div class="v111-kpis">'+kpi(s.language.lessons,'Lessons completed')+kpi(s.activity.consistency+'%','Study consistency')+kpi(s.focus.minutes7d,'Focus min · 7 days')+kpi(s.goals.active.length,'Active goals')+'</div><div class="v111-actions"><button class="primary" data-v111-lang-arki>Practise this lesson with ARKI</button><button data-v111-open="planner">Schedule language practice</button></div>');
    if(tool==='files')return panel('Turn files into action','Use the current Files & Notes result as context for ARKI, a study plan or flashcards.',
      '<div class="v111-actions"><button class="primary" data-v111-files-arki>Continue in ARKI</button><button data-v111-files-cards>Create flashcards</button><button data-v111-files-plan>Add study action to Planner</button></div>');
    if(tool==='project')return panel('Learning projects','Keep ongoing learning work together even while Studio AI is Coming Soon.',
      '<div class="v111-project-form"><input id="v111-project-title" placeholder="Project title"><input id="v111-project-subject" placeholder="Subject / area"><button data-v111-project-create>Create project</button></div><div class="v111-projects">'+(s.projects.length?s.projects.slice(0,9).map(x=>'<div class="v111-project"><b>'+esc(x.title)+'</b><span>'+esc(x.subject||x.type)+' · '+esc(x.status||'active')+'</span><div class="v111-actions"><button data-v111-project-plan="'+esc(x.id)+'">Plan work</button><button data-v111-project-toggle="'+esc(x.id)+'">'+(x.status==='complete'?'Reopen':'Complete')+'</button><button data-v111-project-delete="'+esc(x.id)+'">Delete</button></div></div>').join(''):'<div class="v111-project"><b>No learning projects yet</b><span>Create one above and connect it to your study workflow.</span></div>')+'</div>');
    if(tool==='schools')return panel('School discovery context','School discovery uses your selected country and education level and can continue into ARKI or Study Ahead.',
      '<div class="v111-kpis">'+kpi(window.__SCHOLARK_COUNTRY__?.displayName?.(window.__SCHOLARK_COUNTRY__?.current?.())||window.__SCHOLARK_COUNTRY__?.current?.()||'—','Country')+kpi(localStorage.getItem('scholark_learning_level')||'—','Learning level')+kpi(s.goals.active.length,'Active goals')+kpi(s.mastery.weak.length,'Learning topics')+'</div><div class="v111-actions"><button class="primary" data-v111-schools-arki>Compare with ARKI</button><button data-v111-open="study">Open Study Ahead</button></div>');
    if(tool==='study')return panel('Future-study connection','Study Ahead can feed goals, Planner and ARKI instead of living as a separate roadmap.',
      '<div class="v111-kpis">'+kpi(s.goals.active.length,'Active goals')+kpi(s.planner.active.length,'Planner actions')+kpi(s.mastery.weak.length,'Topics learning')+kpi(s.activity.consistency+'%','Consistency')+'</div><div class="v111-actions"><button class="primary" data-v111-study-plan>Add roadmap action to Planner</button><button data-v111-study-arki>Continue roadmap with ARKI</button></div>');
    return '';
  }

  function wire(panelEl,tool){
    if(!panelEl)return;
    $$('[data-v111-open]',panelEl).forEach(b=>b.onclick=()=>core()?.actions.open(b.dataset.v111Open));
    $('[data-v111-tutor-weak]',panelEl)?.addEventListener('click',()=>{const x=core()?.compute().mastery.weak[0];if(x)openTutor('Teach me '+x.topic+' in '+x.subject+'. Start with intuition, then test me with active recall and one application question.')});
    $('[data-v111-plan-weak]',panelEl)?.addEventListener('click',e=>{const x=core()?.compute().mastery.weak[0];if(!x)return;core().actions.addPlan({text:'Review · '+x.topic,type:'study',subject:x.subject,date:today(),duration:25,priority:'high'});e.currentTarget.textContent='✓ Added to Planner'});
    $('[data-v111-cards-weak]',panelEl)?.addEventListener('click',async e=>{const x=core()?.compute().mastery.weak[0];if(!x)return;e.currentTarget.disabled=true;e.currentTarget.textContent='Generating…';try{const n=await generateCards(x.subject,[x.topic]);e.currentTarget.textContent='✓ '+n+' cards added';core()?.record('flashcards','generated_from_mastery',{subject:x.subject,topic:x.topic,count:n})}catch(err){e.currentTarget.disabled=false;e.currentTarget.textContent='Try again'}});
    $('[data-v111-lang-arki]',panelEl)?.addEventListener('click',()=>{const r=rootFor('language');openArki('Help me practise this language lesson. Ask me questions, correct me and adapt the difficulty:\n\n'+clean(r?.innerText).slice(0,9000))});
    $('[data-v111-files-arki]',panelEl)?.addEventListener('click',()=>{const text=clean($('#v86-output')?.innerText);if(text)openArki('Use this Files & Notes result as context and help me work with it:\n\n'+text.slice(0,10000))});
    $('[data-v111-files-cards]',panelEl)?.addEventListener('click',async e=>{const text=clean($('#v86-output')?.innerText);if(!text)return;e.currentTarget.disabled=true;e.currentTarget.textContent='Generating…';try{const n=await generateCards('Files & Notes',[],text);e.currentTarget.textContent='✓ '+n+' cards added'}catch{e.currentTarget.disabled=false;e.currentTarget.textContent='Try again'}});
    $('[data-v111-files-plan]',panelEl)?.addEventListener('click',e=>{const text=clean($('#v86-output')?.innerText);if(!text)return;core()?.actions.addPlan({text:'Review Files & Notes result',type:'study',subject:text.slice(0,70),date:today(),duration:30,priority:'medium'});e.currentTarget.textContent='✓ Added to Planner'});
    $('[data-v111-project-create]',panelEl)?.addEventListener('click',()=>{const title=clean($('#v111-project-title')?.value),subject=clean($('#v111-project-subject')?.value);if(!title)return $('#v111-project-title')?.focus();core()?.actions.createProject({title,subject});refresh(true)});
    $('[data-v111-project-plan]',panelEl).forEach(b=>b.onclick=()=>{const p=core()?.data.learningProjects().find(x=>x.id===b.dataset.v111ProjectPlan);if(!p)return;core().actions.addPlan({text:'Work on · '+p.title,type:'study',subject:p.subject||p.title,date:today(),duration:45,priority:'medium'});b.textContent='✓ Planned'});
    $('[data-v111-project-toggle]',panelEl).forEach(b=>b.onclick=()=>{const p=core()?.data.learningProjects().find(x=>x.id===b.dataset.v111ProjectToggle);if(!p)return;core().actions.updateProject(p.id,{status:p.status==='complete'?'active':'complete'});refresh(true)});
    $('[data-v111-project-delete]',panelEl).forEach(b=>b.onclick=()=>{core()?.actions.deleteProject(b.dataset.v111ProjectDelete);refresh(true)});
    $('[data-v111-schools-arki]',panelEl)?.addEventListener('click',()=>{const r=rootFor('schools');openArki('Help me compare the school options currently shown in SCHOLARK. Consider my country, learning level and goals:\n\n'+clean(r?.innerText).slice(0,10000))});
    $('[data-v111-study-plan]',panelEl)?.addEventListener('click',e=>{const r=rootFor('study'),text=clean(r?.innerText).slice(0,140);core()?.actions.addPlan({text:'Continue Study Ahead roadmap',type:'study',subject:text,date:today(),duration:45,priority:'high'});e.currentTarget.textContent='✓ Added to Planner'});
    $('[data-v111-study-arki]',panelEl)?.addEventListener('click',()=>{const r=rootFor('study');openArki('Help me improve and act on this Study Ahead roadmap:\n\n'+clean(r?.innerText).slice(0,10000))});
  }

  function augmentTutorMessages(){
    if(route()!=='tutor')return;
    const chat=$('#v52-tutor-chat')||$('.v52-chat');if(!chat)return;
    const msgs=$$('.v52-msg.ai',chat);
    msgs.forEach((msg,i)=>{
      if(msg.dataset.v111Enhanced==='1'||msg.id==='v108-tutor-thinking')return;msg.dataset.v111Enhanced='1';
      const user=[...msg.parentElement.querySelectorAll('.v52-msg.user')].filter(x=>x.compareDocumentPosition(msg)&Node.DOCUMENT_POSITION_FOLLOWING).at(-1);
      const topic=clean(user?.innerText).slice(0,160)||'Tutor lesson';
      const tools=document.createElement('div');tools.className='v111-tutor-tools';
      tools.innerHTML='<button class="good" data-v111-understood>✓ Understood</button><button data-v111-review>Needs review</button><button data-v111-quick>Quick check</button><button data-v111-msg-cards>Create flashcards</button>';
      msg.appendChild(tools);
      $('[data-v111-understood]',tools).onclick=()=>{core()?.actions.upsertMastery({subject:'AI Tutor',topic,mastery:80,status:'Practising',nextReviewAt:new Date(Date.now()+4*86400000).toISOString()});tools.innerHTML='<span class="v111-chip">Saved to Mastery · 80%</span>'};
      $('[data-v111-review]',tools).onclick=()=>{core()?.actions.upsertMastery({subject:'AI Tutor',topic,mastery:35,status:'Learning',nextReviewAt:new Date(Date.now()+2*86400000).toISOString()});tools.innerHTML='<span class="v111-chip">Added to review queue</span>'};
      $('[data-v111-quick]',tools).onclick=e=>tutorQuickCheck(msg,topic,e.currentTarget);
      $('[data-v111-msg-cards]',tools).onclick=async e=>{e.currentTarget.disabled=true;e.currentTarget.textContent='Generating…';try{const n=await generateCards('AI Tutor',[topic],clean(msg.innerText));e.currentTarget.textContent='✓ '+n+' cards'}catch{e.currentTarget.disabled=false;e.currentTarget.textContent='Try again'}};
    });
  }

  function refresh(force=false){
    cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
      if(busy)return;const api=core();if(!api)return;const tool=route();const root=rootFor(tool);if(!root)return;
      const old=$(':scope > .v111-live',root)||$('.v111-live',root);
      if(old&&!force){augmentTutorMessages();return}
      busy=true;try{old?.remove();const html=htmlFor(tool,api.compute());if(html){root.insertAdjacentHTML('afterbegin',html);wire($('.v111-live',root),tool)}augmentTutorMessages()}finally{busy=false}
    })
  }
  const schedule=(force=false)=>[30,140,420].forEach(ms=>setTimeout(()=>refresh(force),ms));
  addEventListener('hashchange',()=>schedule(true));
  addEventListener('scholark-runtime-ready',()=>schedule(false));
  addEventListener('scholark-workspace-core-ready',()=>schedule(true));
  addEventListener('scholark-workspace-change',()=>schedule(true));
  addEventListener('scholark-country-change',()=>schedule(true));
  let observerTimer=0;
  const observer=new MutationObserver(()=>{
    clearTimeout(observerTimer);
    observerTimer=setTimeout(()=>refresh(false),140);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  schedule(true);

  window.__SCHOLARK_V111_EXPERIENCE__={version:'20260920-r174',refresh:()=>refresh(true),generateCards};
})();