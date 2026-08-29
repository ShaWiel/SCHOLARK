(() => {
  if (window.__SCHOLARK_V62_LEARNING_AI__) return;
  window.__SCHOLARK_V62_LEARNING_AI__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const LANG={nl:'Dutch',en:'English',es:'Spanish',fr:'French',de:'German',pt:'Portuguese',it:'Italian',srn:'Sranan Tongo',ar:'Arabic',hi:'Hindi',zh:'Chinese',ja:'Japanese',ko:'Korean',id:'Indonesian',tr:'Turkish',pl:'Polish',sw:'Swahili'};
  const level=()=>localStorage.getItem('scholark_learning_level')||'secondary';
  const language=()=>LANG[localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'en']||'English';

  const css=document.createElement('style');
  css.id='scholark-v62-style';
  css.textContent='.v62-loading{display:flex;align-items:center;gap:8px;color:#6d5dfc;font:800 9px Inter;margin-top:12px}.v62-spin{width:13px;height:13px;border:2px solid #ddd8ff;border-top-color:#6d5dfc;border-radius:50%;animation:v62spin .7s linear infinite}@keyframes v62spin{to{transform:rotate(360deg)}}.v62-answer{margin-top:12px;display:grid;gap:10px}.v62-answer-card{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:17px;padding:16px;box-shadow:0 12px 34px rgba(31,27,63,.035);font:650 10.5px/1.55 Inter;color:#4d4955}.v62-answer-card h3,.v62-answer-card h4{margin:0 0 8px;color:#17191f;font:900 14px/1.1 Inter}.v62-answer-card p{margin:0 0 8px}.v62-answer-card ul,.v62-answer-card ol{margin:7px 0 0;padding-left:19px}.v62-answer-card li{margin:5px 0}.v62-meta{font:800 7.5px Inter;color:#8a8592;text-transform:uppercase;letter-spacing:.08em}.v62-error{margin-top:12px;padding:12px 14px;border-radius:13px;background:#fff0f0;border:1px solid #ffd0d0;color:#8c3030;font:750 9.5px/1.45 Inter}.v62-question{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:16px;padding:15px;margin-top:9px}.v62-question h4{font:900 12px/1.35 Inter;margin:0 0 9px}.v62-choice{display:block;padding:7px 9px;border-radius:9px;background:#f6f5f2;margin:5px 0;font:650 9px Inter}.v62-reveal{border:0;background:#17191f;color:#fff;border-radius:9px;padding:8px 10px;font:850 8px Inter;cursor:pointer;margin-top:8px}.v62-solution{display:none;margin-top:9px;padding:10px;border-radius:10px;background:#eeecff;color:#443a61;font:650 9px/1.45 Inter}.v62-solution.open{display:block}.v62-study{max-width:1280px;margin:0 auto;padding:32px;font-family:Inter,system-ui;color:#17191f}.v62-study h1{font:950 clamp(38px,5vw,60px)/.95 Inter;letter-spacing:-.05em;margin:8px 0 10px}.v62-study>p{color:#706c77;font:600 11px/1.55 Inter;max-width:780px}.v62-form{margin-top:20px;background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:22px;padding:20px;display:grid;gap:9px}.v62-form input,.v62-form select,.v62-form textarea{width:100%;box-sizing:border-box;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:12px;padding:12px 13px;font:650 10.5px Inter}.v62-form textarea{min-height:95px;resize:vertical}.v62-row{display:grid;grid-template-columns:1fr 1fr;gap:9px}.v62-btn{border:0;border-radius:12px;background:#17191f;color:#fff;padding:12px 14px;font:900 9px Inter;cursor:pointer}.v62-btn:disabled{opacity:.55;cursor:wait}.v62-results{margin-top:14px;display:grid;gap:10px}@media(max-width:700px){.v62-row{grid-template-columns:1fr}.v62-study{padding:22px 13px}}';
  document.head.appendChild(css);

  async function call(mode,payload={}) {
    const ctrl=new AbortController();
    const timer=setTimeout(()=>ctrl.abort(),90000);
    try {
      const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode,level:level(),language:language(),...payload}),signal:ctrl.signal});
      const data=await r.json().catch(()=>({}));
      if(!r.ok||!data?.ok||!data?.result){const e=new Error(data?.error||'SCHOLARK learning AI is unavailable');e.code=data?.code;e.status=r.status;throw e}
      return data;
    } finally { clearTimeout(timer); }
  }

  function busy(btn,on,label){
    if(!btn)return;
    if(on){btn.dataset.v62Text=btn.textContent;btn.disabled=true;btn.textContent=label||'Working…'}
    else{btn.disabled=false;if(btn.dataset.v62Text)btn.textContent=btn.dataset.v62Text}
  }
  function error(host,e){
    if(!host)return;
    const msg=e?.name==='AbortError'?'The AI request took too long. Try again.':clean(e?.message||'Something went wrong.');
    host.innerHTML='<div class="v62-error"><b>Could not finish this request.</b><br>'+esc(msg)+'</div>';
  }
  function list(items,ordered=false){const a=(items||[]).filter(Boolean);if(!a.length)return'';return '<'+(ordered?'ol':'ul')+'>'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</'+(ordered?'ol':'ul')+'>';}

  function readTutorHistory(){try{return JSON.parse(localStorage.getItem('scholark_v62_tutor_history')||'[]')}catch{return[]}}
  function writeTutorHistory(a){try{localStorage.setItem('scholark_v62_tutor_history',JSON.stringify(a.slice(-12)))}catch{}}
  async function runTutor(){
    const q=$('#v52-tutor-q'),chat=$('#v52-chat'),btn=$('#v52-tutor-send');
    const prompt=clean(q?.value); if(!prompt){q?.focus();return}
    chat?.insertAdjacentHTML('beforeend','<div class="v52-msg user">'+esc(prompt)+'</div>');
    window.dispatchEvent(new CustomEvent('scholark:tutor-user',{detail:{prompt}}));
    if(q)q.value='';
    const wait=document.createElement('div');wait.className='v52-msg ai';wait.innerHTML='<span class="v62-loading"><i class="v62-spin"></i>SCHOLARK is thinking…</span>';chat?.appendChild(wait);
    busy(btn,true,'Thinking…');
    try{
      const hist=readTutorHistory();
      const context=hist.slice(-6).map(x=>x.role+': '+x.text).join('\n');
      const data=await call('tutor',{prompt,context,tutorMode:'teach'});
      const r=data.result;
      wait.innerHTML='<b>'+esc(r.topic||'SCHOLARK Tutor')+'</b><br>'+esc(r.answer||r.summary||'')+(r.steps?.length?'<br><br><b>How to work through it</b>'+list(r.steps,true):'')+(r.checks?.length?'<br><br><b>Check yourself</b>'+list(r.checks):'')+(r.followUp?'<br><br><b>Next:</b> '+esc(r.followUp):'')+'<div class="v62-meta">'+esc(data.provider||'AI')+' · '+esc(data.model||'')+'</div>';
      hist.push({role:'user',text:prompt},{role:'assistant',text:clean(r.answer||r.summary)});writeTutorHistory(hist);
      window.dispatchEvent(new CustomEvent('scholark:tutor-assistant',{detail:{prompt,answer:clean(r.answer||r.summary),result:r,provider:data.provider||'',model:data.model||''}}));
    }catch(e){wait.remove();const x=document.createElement('div');x.className='v52-msg ai';chat?.appendChild(x);error(x,e)}finally{busy(btn,false)}
  }

  async function runCurriculum(){
    const subject=clean($('#v52-cur-subject')?.value),country=clean($('#v52-cur-country')?.value),btn=$('#v52-cur-build'),out=$('#v52-cur-out');
    if(!subject){$('#v52-cur-subject')?.focus();return}
    busy(btn,true,'Building map…');if(out)out.innerHTML='<div class="v62-loading"><i class="v62-spin"></i>Mapping the subject with AI…</div>';
    try{
      const data=await call('curriculum',{subject,country,prompt:'Build a useful learning map for '+subject});const r=data.result;
      if(out)out.innerHTML='<div class="v62-answer"><div class="v62-answer-card"><h3>'+esc(r.title||subject)+'</h3><p>'+esc(r.summary||'')+'</p></div>'+
        (r.subjects||[]).map(s=>'<div class="v62-answer-card"><h4>'+esc(s.name)+'</h4><p>'+esc(s.why||'')+'</p><b>Topics</b>'+list(s.topics)+'<b>Skills</b>'+list(s.skills)+'</div>').join('')+
        '<div class="v62-answer-card"><h4>Learning roadmap</h4>'+list(r.roadmap,true)+(r.resources?.length?'<h4 style="margin-top:12px">Resources</h4>'+list(r.resources):'')+'<div class="v62-meta">'+esc(data.provider||'AI')+' · '+esc(data.model||'')+'</div></div></div>';
      localStorage.setItem('scholark_education_focus',JSON.stringify({subject,country,level:level(),result:r}));
    }catch(e){error(out,e)}finally{busy(btn,false)}
  }

  function ensureExamControls(){
    const box=$('#v52-exam-build')?.closest('.v52-form');if(!box||$('#v62-exam-count',box))return;
    const row=document.createElement('div');row.className='v52-row';row.innerHTML='<select id="v62-exam-count"><option value="8">8 questions</option><option value="12" selected>12 questions</option><option value="20">20 questions</option><option value="30">30 questions</option></select><select id="v62-exam-difficulty"><option value="mixed">Mixed difficulty</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>';
    box.insertBefore(row,$('#v52-exam-build'));
  }
  async function runExam(){
    ensureExamControls();
    const name=clean($('#v52-exam-name')?.value)||'Practice exam',topics=String($('#v52-exam-topics')?.value||'').split(/\n|,/).map(clean).filter(Boolean),btn=$('#v52-exam-build'),out=$('#v52-exam-out');
    if(!topics.length){$('#v52-exam-topics')?.focus();return}
    const count=Math.max(1,Math.min(30,Number($('#v62-exam-count')?.value)||12)),difficulty=$('#v62-exam-difficulty')?.value||'mixed';
    busy(btn,true,'Generating exam…');if(out)out.innerHTML='<div class="v62-loading"><i class="v62-spin"></i>Writing a real practice exam…</div>';
    try{
      const data=await call('exam',{prompt:name,subject:name,topics,count,difficulty});const r=data.result;
      if(out)out.innerHTML='<div class="v62-answer"><div class="v62-answer-card"><h3>'+esc(r.title||name)+'</h3><p>'+esc(r.instructions||'')+'</p></div>'+
        (r.questions||[]).map((q,i)=>'<div class="v62-question"><div class="v62-meta">Question '+(i+1)+' · '+esc(q.difficulty||'')+'</div><h4>'+esc(q.prompt)+'</h4>'+((q.choices||[]).map((c,j)=>'<span class="v62-choice">'+String.fromCharCode(65+j)+'. '+esc(c)+'</span>').join(''))+'<button class="v62-reveal" type="button">Show answer</button><div class="v62-solution"><b>Answer:</b> '+esc(q.answer)+'<br><b>Why:</b> '+esc(q.explanation||'')+'</div></div>').join('')+
        '<div class="v62-meta">'+esc(data.provider||'AI')+' · '+esc(data.model||'')+'</div></div>';
    }catch(e){error(out,e)}finally{busy(btn,false)}
  }

  function studyHost(){
    document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-book','v41-studio-open');
    document.body.classList.add('v51-workspace','v51-study');
    $('#v41-studio-workspace')?.setAttribute('hidden','');
    $('#v50-school')?.classList.remove('open');
    $('#v25-schools')?.classList.remove('open');
    $('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
    $('#sv24-overlay')?.classList.remove('open');
    $$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='study'));
    history.replaceState(null,'',location.pathname+location.search+'#study');
    const main=$('#v51-main');if(!main)return null;main.classList.add('v52-fast-main');main.style.setProperty('display','block','important');
    $$('.v51-page',main).forEach(p=>{p.classList.remove('active');p.style.display='none'});
    let p=$('[data-v51-page="fallback"]',main);if(!p){p=document.createElement('section');p.className='v51-page';p.dataset.v51Page='fallback';main.appendChild(p)}p.classList.add('active');p.style.display='block';p.style.padding='0';
    let h=$('#v51-fallback',p);if(!h){h=document.createElement('div');h.id='v51-fallback';p.appendChild(h)}return h;
  }
  function openStudyAhead(){
    const h=studyHost();if(!h)return;
    h.innerHTML='<div class="v62-study"><div class="v52-kicker">SCHOLARK · STUDY AHEAD</div><h1>Know the field before you enter it.</h1><p>Tell SCHOLARK what you plan to study. Country and target school are optional; the roadmap focuses on knowledge, skills and preparation rather than inventing admissions rules.</p><div class="v62-form"><div class="v62-row"><input id="v62-field" placeholder="Field of study, e.g. Law, Computer Science"><input id="v62-country" placeholder="Country (optional)"></div><div class="v62-row"><input id="v62-school" placeholder="Target university / school (optional)"><select id="v62-depth"><option value="foundation">Start from foundations</option><option value="advanced">I already know the basics</option></select></div><textarea id="v62-context" placeholder="Anything SCHOLARK should know about your goals, strengths or current subjects (optional)"></textarea><button id="v62-study-run" class="v62-btn">Build my Study Ahead roadmap</button></div><div id="v62-study-results" class="v62-results"></div></div>';
  }
  async function runStudyAhead(){
    const field=clean($('#v62-field')?.value),country=clean($('#v62-country')?.value),targetSchool=clean($('#v62-school')?.value),context=clean($('#v62-context')?.value),btn=$('#v62-study-run'),out=$('#v62-study-results');
    if(!field){$('#v62-field')?.focus();return}
    busy(btn,true,'Building roadmap…');if(out)out.innerHTML='<div class="v62-loading"><i class="v62-spin"></i>Researching the field and structuring your preparation…</div>';
    try{
      const data=await call('study_ahead',{field,country,targetSchool,context,prompt:'Prepare me to study '+field});const r=data.result;
      if(out)out.innerHTML='<div class="v62-answer-card"><h3>'+esc(r.title||field)+'</h3><p>'+esc(r.overview||'')+'</p></div>'+
        '<div class="v62-row"><div class="v62-answer-card"><h4>Skills to build</h4>'+list(r.skills)+'</div><div class="v62-answer-card"><h4>Key subjects</h4>'+list(r.keySubjects)+'</div></div>'+
        '<div class="v62-row"><div class="v62-answer-card"><h4>Books & resources</h4>'+list(r.books)+'</div><div class="v62-answer-card"><h4>University preparation</h4>'+list(r.universityPrep)+'</div></div>'+
        '<div class="v62-answer-card"><h4>Career directions</h4>'+list(r.careers)+'</div><div class="v62-answer-card"><h4>Your roadmap</h4>'+((r.roadmap||[]).map(x=>'<p><b>'+esc(x.phase)+'</b></p>'+list(x.actions)).join(''))+'<div class="v62-meta">'+esc(data.provider||'AI')+' · '+esc(data.model||'')+'</div></div>';
      window.dispatchEvent(new CustomEvent('scholark:study-ahead-generated',{detail:{field,country,targetSchool,context,result:r,provider:data.provider||'',model:data.model||''}}));
    }catch(e){error(out,e)}finally{busy(btn,false)}
  }

  document.addEventListener('click',e=>{
    const tutor=e.target.closest?.('#v52-tutor-send');if(tutor){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();runTutor();return}
    const cur=e.target.closest?.('#v52-cur-build');if(cur){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();runCurriculum();return}
    const exam=e.target.closest?.('#v52-exam-build');if(exam){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();runExam();return}
    const reveal=e.target.closest?.('.v62-reveal');if(reveal){const sol=reveal.nextElementSibling;sol?.classList.toggle('open');reveal.textContent=sol?.classList.contains('open')?'Hide answer':'Show answer';return}
    const study=e.target.closest?.('[data-v51-tool="study"]');if(study){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openStudyAhead();return}
    const run=e.target.closest?.('#v62-study-run');if(run){e.preventDefault();runStudyAhead()}
  },true);
  document.addEventListener('keydown',e=>{if(e.target?.id==='v52-tutor-q'&&(e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();runTutor()}});

  const sync=()=>{ensureExamControls();if(String(location.hash).toLowerCase()==='#study'&&!$('#v62-field'))openStudyAhead()};
  new MutationObserver(()=>{clearTimeout(window.__v62sync);window.__v62sync=setTimeout(sync,35)}).observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('hashchange',sync);setTimeout(sync,80);
})();