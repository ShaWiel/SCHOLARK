(() => {
  if (window.__SCHOLARK_V52_FAST_TOOLS__) return;
  window.__SCHOLARK_V52_FAST_TOOLS__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const FAST=['dashboard','studio','tutor','education','planner','progress','goal','project','schools'];

  const css=document.createElement('style');
  css.id='scholark-v52-fast-style';
  css.textContent=`
    #v51-sidebar [data-v51-tool],#v51-main [data-v51-tool]{touch-action:manipulation;transition:background .07s ease,color .07s ease,transform .06s ease!important}
    #v51-sidebar [data-v51-tool]:active,#v51-main [data-v51-tool]:active{transform:scale(.99)}
    #v51-main.v52-fast-main{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    .v52-tool{max-width:1280px;margin:0 auto;padding:32px;font-family:Inter,system-ui,sans-serif;color:#17191f;animation:v52in .07s ease-out both}
    @keyframes v52in{from{opacity:.75;transform:translateY(2px)}to{opacity:1;transform:none}}
    .v52-kicker{font:900 8px Inter;letter-spacing:.14em;color:#6d5dfc;margin-bottom:9px}.v52-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:22px}.v52-head h1{font:950 clamp(36px,5vw,58px)/.96 Inter;margin:0;letter-spacing:-.05em}.v52-head p{font:600 11px/1.55 Inter;color:#706c77;max-width:780px;margin:10px 0 0}.v52-pill{background:#17191f;color:#c9ff6a;border-radius:999px;padding:9px 12px;font:900 8px Inter;white-space:nowrap}
    .v52-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.v52-card{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:22px;padding:20px;box-shadow:0 16px 48px rgba(31,27,63,.045)}.v52-card h3{font:900 17px/1.05 Inter;margin:0 0 8px}.v52-card p{font:600 10px/1.5 Inter;color:#706c77;margin:0}.v52-card b.big{font:950 34px/1 Inter;display:block;margin-bottom:8px}
    .v52-form{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:22px;padding:20px;box-shadow:0 16px 48px rgba(31,27,63,.045)}.v52-form input,.v52-form textarea,.v52-form select{width:100%;box-sizing:border-box;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:13px;padding:12px 13px;font:650 11px Inter;outline:0}.v52-form textarea{min-height:130px;resize:vertical}.v52-row{display:grid;grid-template-columns:1fr 190px;gap:8px;margin-top:8px}.v52-btn{border:0;border-radius:13px;background:#17191f;color:#fff;padding:12px 15px;font:900 9px Inter;cursor:pointer}.v52-btn span{color:#c9ff6a}.v52-list{display:grid;gap:8px;margin-top:14px}.v52-item{background:#f5f4f1;border:1px solid rgba(23,25,31,.06);border-radius:14px;padding:12px;font:700 10px/1.45 Inter;color:#504c57}.v52-item button{float:right;border:0;background:transparent;cursor:pointer;font-size:14px}.v52-chat{display:grid;gap:8px;margin-top:14px}.v52-msg{max-width:82%;border-radius:15px;padding:12px 13px;font:650 10.5px/1.5 Inter}.v52-msg.user{justify-self:end;background:#17191f;color:#fff}.v52-msg.ai{justify-self:start;background:#eeecff;color:#40365e}
    .v52-action-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v52-action{border:1px solid rgba(23,25,31,.09);background:#fff;border-radius:18px;padding:17px;text-align:left;cursor:pointer;transition:border-color .07s ease,transform .06s ease}.v52-action:hover{border-color:#6d5dfc}.v52-action:active{transform:scale(.995)}.v52-action b{display:block;font:900 13px Inter;margin-bottom:5px}.v52-action span{font:600 9px/1.4 Inter;color:#777}.v52-detail{margin-top:12px}.v52-chiprow{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.v52-chip{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:999px;padding:8px 10px;font:800 8.5px Inter;cursor:pointer}.v52-chip.active{background:#17191f;color:#c9ff6a}.v52-status{display:inline-flex;padding:5px 7px;border-radius:999px;background:#eeecff;color:#5748d6;font:850 7.5px Inter;margin-left:6px}
    @media(max-width:850px){.v52-grid{grid-template-columns:1fr 1fr}.v52-row{grid-template-columns:1fr}.v52-head{display:block}.v52-pill{display:inline-block;margin-top:12px}}@media(max-width:620px){.v52-tool{padding:22px 13px}.v52-grid,.v52-action-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const route=id=>history.replaceState(null,'',location.pathname+location.search+'#'+id);

  function forceQuality(){
    localStorage.setItem('scholark_ai_quality','highest');
    localStorage.setItem('scholark_default_ai_quality','highest');
    localStorage.setItem('scholark_workspace_quality','highest');
    const q=$('#v41-quality');if(q&&[...q.options].some(o=>o.value==='highest'))q.value='highest';
    const d=$('#v45-depth');if(d&&[...d.options].some(o=>o.value==='expert'))d.value='expert';
    ['v45-strict','v45-research','v45-factcheck','v45-visuals','v45-autopolish','v41-citations','v41-sources'].forEach(id=>{const e=$('#'+id);if(e&&'checked'in e)e.checked=true});
  }

  function closeOtherViews(){
    document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    $('#v41-studio-workspace')?.setAttribute('hidden','');
    $('#sv24-overlay')?.classList.remove('open');
    $('#v50-school')?.classList.remove('open');
    $('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
    $$('.v51-native-host').forEach(el=>el.classList.remove('v51-native-host'));
  }

  function activateNav(id){$$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool===id))}

  function dashboardPage(){return $('[data-v51-page="dashboard"]',$('#v51-main'))}
  function cleanDashboard(){
    const dash=dashboardPage();if(!dash)return;
    const projectCard=$('[data-v51-tool="project"]',dash);if(projectCard)projectCard.remove();
    $$('[data-recent-project],.recent-projects,.project-history',dash).forEach(el=>el.remove());
  }

  function host(){
    const main=$('#v51-main');if(!main)return null;
    main.classList.add('v52-fast-main');main.style.removeProperty('display');
    $$('.v51-page',main).forEach(p=>{p.classList.remove('active');p.style.removeProperty('display')});
    let p=$('[data-v51-page="fallback"]',main);if(!p){p=document.createElement('section');p.className='v51-page';p.dataset.v51Page='fallback';main.appendChild(p)}
    p.classList.add('active');p.style.display='block';p.style.padding='0';
    let h=$('#v51-fallback',p);if(!h){h=document.createElement('div');h.id='v51-fallback';p.appendChild(h)}
    return h;
  }

  function shell(title,sub,body){return `<div class="v52-tool"><div class="v52-head"><div><div class="v52-kicker">SCHOLARK WORKSPACE</div><h1>${esc(title)}</h1><p>${esc(sub)}</p></div><span class="v52-pill">AI QUALITY · MAX</span></div>${body}</div>`}

  function openDashboard(){
    closeOtherViews();forceQuality();document.body.classList.add('v51-workspace');activateNav('dashboard');route('dashboard');cleanDashboard();
    const main=$('#v51-main');if(!main)return;main.classList.add('v52-fast-main');main.style.removeProperty('display');
    $$('.v51-page',main).forEach(p=>{const active=p.dataset.v51Page==='dashboard';p.classList.toggle('active',active);p.style.display=active?'block':''});
  }

  function openStudio(){
    closeOtherViews();forceQuality();document.body.classList.add('v51-workspace','v51-studio','v41-studio-open');activateNav('studio');route('studio');
    const main=$('#v51-main');if(main)main.style.setProperty('display','none','important');
    const studio=$('#v41-studio-workspace');if(!studio){openDashboard();return}
    studio.hidden=false;studio.removeAttribute('aria-hidden');studio.style.removeProperty('display');studio.style.removeProperty('visibility');studio.style.removeProperty('opacity');studio.style.removeProperty('pointer-events');
    $$('.v41-mode[data-mode="book"]',studio).forEach(x=>x.remove());
  }

  function renderTutor(){
    const h=host();if(!h)return;
    h.innerHTML=shell('AI Tutor','Ask, learn, practise and get explanations adapted to your selected learning level.',`<div class="v52-form"><textarea id="v52-tutor-q" placeholder="Ask SCHOLARK anything you want to learn..."></textarea><button class="v52-btn" id="v52-tutor-send">Ask <span>SCHOLARK AI</span></button><div class="v52-chat" id="v52-chat"><div class="v52-msg ai">I’m ready. Ask a question, paste a problem, or tell me what subject you want explained.</div></div></div>`);
    const q=$('#v52-tutor-q'),chat=$('#v52-chat');$('#v52-tutor-send').onclick=()=>{const v=q.value.trim();if(!v)return q.focus();chat.insertAdjacentHTML('beforeend',`<div class="v52-msg user">${esc(v)}</div>`);q.value='';const level=localStorage.getItem('scholark_learning_level')||'secondary';chat.insertAdjacentHTML('beforeend',`<div class="v52-msg ai"><b>SCHOLARK Tutor request prepared at ${esc(level)} level.</b><br>Your question stays in this workspace and is ready for the Tutor AI backend.</div>`)};
  }

  const eduKey='scholark_v52_mastery';
  function renderEducation(){
    const h=host();if(!h)return;
    h.innerHTML=shell('Education & Learning','Explore what to learn, track mastery, prepare for exams and choose evidence-based study methods — without duplicating Tutor or Planner.',`
      <div class="v52-action-grid">
        <button class="v52-action" data-edu="curriculum"><b>Curriculum Explorer</b><span>Map a subject into clear strands, units and learning priorities for your level.</span></button>
        <button class="v52-action" data-edu="mastery"><b>Mastery Map</b><span>Track topics as New, Learning, Practising or Mastered.</span></button>
        <button class="v52-action" data-edu="exam"><b>Exam Prep Center</b><span>Break an upcoming exam into topics, question types and revision priorities.</span></button>
        <button class="v52-action" data-edu="methods"><b>Study Methods Lab</b><span>Use active recall, Feynman, blurting, interleaving and other study methods correctly.</span></button>
      </div><div class="v52-detail" id="v52-edu-detail"></div>`);
    $$('[data-edu]',h).forEach(b=>b.onclick=()=>renderEducationModule(b.dataset.edu));
  }

  function renderEducationModule(type){
    const box=$('#v52-edu-detail');if(!box)return;
    if(type==='curriculum'){
      box.innerHTML=`<div class="v52-form"><h3>Curriculum Explorer</h3><div class="v52-row"><input id="v52-cur-subject" placeholder="Subject, e.g. Biology, Math, History"><input id="v52-cur-country" placeholder="Country / curriculum (optional)"></div><button class="v52-btn" id="v52-cur-build">Build subject map</button><div class="v52-list" id="v52-cur-out"></div></div>`;
      $('#v52-cur-build').onclick=()=>{const s=$('#v52-cur-subject').value.trim();if(!s)return $('#v52-cur-subject').focus();const level=localStorage.getItem('scholark_learning_level')||'secondary',country=$('#v52-cur-country').value.trim();localStorage.setItem('scholark_education_focus',JSON.stringify({subject:s,country,level}));$('#v52-cur-out').innerHTML=`<div class="v52-item"><b>${esc(s)} · ${esc(level)}</b><br>1. Foundations & vocabulary<br>2. Core concepts & relationships<br>3. Application & problem solving<br>4. Analysis / exam-style tasks<br>5. Mastery check & revision priorities${country?`<br><span class="v52-status">${esc(country)}</span>`:''}</div>`};
    } else if(type==='mastery'){
      box.innerHTML=`<div class="v52-form"><h3>Mastery Map</h3><div class="v52-row"><input id="v52-m-topic" placeholder="Topic or skill"><select id="v52-m-status"><option>New</option><option>Learning</option><option>Practising</option><option>Mastered</option></select></div><button class="v52-btn" id="v52-m-add">Add topic</button><div class="v52-list" id="v52-m-list"></div></div>`;
      const draw=()=>{const a=read(eduKey);$('#v52-m-list').innerHTML=a.length?a.map((x,i)=>`<div class="v52-item"><button data-del="${i}">×</button><b>${esc(x.topic)}</b><span class="v52-status">${esc(x.status)}</span></div>`).join(''):'<div class="v52-item">No mastery topics yet.</div>';$$('[data-del]',$('#v52-m-list')).forEach(b=>b.onclick=()=>{const a=read(eduKey);a.splice(+b.dataset.del,1);write(eduKey,a);draw()})};
      $('#v52-m-add').onclick=()=>{const t=$('#v52-m-topic').value.trim();if(!t)return $('#v52-m-topic').focus();const a=read(eduKey);a.push({topic:t,status:$('#v52-m-status').value});write(eduKey,a);$('#v52-m-topic').value='';draw()};draw();
    } else if(type==='exam'){
      box.innerHTML=`<div class="v52-form"><h3>Exam Prep Center</h3><div class="v52-row"><input id="v52-exam-name" placeholder="Exam / test name"><input id="v52-exam-date" type="date"></div><textarea id="v52-exam-topics" placeholder="Topics or chapters, one per line"></textarea><button class="v52-btn" id="v52-exam-build">Build exam priorities</button><div class="v52-list" id="v52-exam-out"></div></div>`;
      $('#v52-exam-build').onclick=()=>{const name=$('#v52-exam-name').value.trim()||'Upcoming exam',topics=$('#v52-exam-topics').value.split(/\n|,/).map(x=>x.trim()).filter(Boolean),date=$('#v52-exam-date').value;localStorage.setItem('scholark_exam_prep',JSON.stringify({name,date,topics}));$('#v52-exam-out').innerHTML=`<div class="v52-item"><b>${esc(name)}</b>${date?` · ${esc(date)}`:''}<br>${topics.length?topics.map((x,i)=>`${i+1}. ${esc(x)} — recall → practice → timed check`).join('<br>'):'Add topics to create revision priorities.'}</div>`};
    } else {
      const methods={recall:['Active Recall','Close the notes and retrieve the answer from memory before checking.'],feynman:['Feynman Technique','Explain the idea in simple language, find gaps, then rebuild the explanation.'],blurting:['Blurting','Write everything you remember, compare with the source, then target the missing pieces.'],interleave:['Interleaving','Mix related problem types so you practise choosing the correct method, not only repeating one pattern.'],dual:['Dual Coding','Pair concise words with meaningful diagrams, timelines, tables or concept maps.'],spaced:['Spaced Repetition','Revisit material after increasing gaps instead of massing the same topic in one session.'],pomodoro:['Pomodoro','Work in focused blocks with short breaks; use the break as a reset, not as a second task.'],cornell:['Cornell Notes','Split notes into main notes, cue questions and a compact summary so the page becomes a review tool.'],sq3r:['SQ3R','Survey, Question, Read, Recite and Review so reading becomes active retrieval instead of passive highlighting.'],leitner:['Leitner System','Move flashcards between review boxes based on recall strength so weak cards return sooner and mastered cards later.']};
      box.innerHTML=`<div class="v52-form"><h3>Study Methods Lab</h3><div class="v52-chiprow">${Object.entries(methods).map(([k,v])=>`<button class="v52-chip" data-method="${k}">${v[0]}</button>`).join('')}</div><div class="v52-list" id="v52-method-out"><div class="v52-item">Choose a method to see how to use it properly.</div></div></div>`;$$('[data-method]',box).forEach(b=>b.onclick=()=>{const m=methods[b.dataset.method];$$('[data-method]',box).forEach(x=>x.classList.toggle('active',x===b));$('#v52-method-out').innerHTML=`<div class="v52-item"><b>${m[0]}</b><br>${m[1]}<br><br><b>Best use:</b> combine it with a clear topic and a later self-check.</div>`});
    }
  }

  function renderPlanner(){const h=host();if(!h)return;h.innerHTML=shell('Planner','Organise study sessions, deadlines and next actions without leaving the workspace.',`<div class="v52-form"><input id="v52-plan" placeholder="Add a task, study session or deadline"><div class="v52-row"><input id="v52-plan-date" type="date"><button class="v52-btn" id="v52-plan-add">Add to planner</button></div><div class="v52-list" id="v52-plan-list"></div></div>`);const draw=()=>{const a=read('scholark_v51_planner');$('#v52-plan-list').innerHTML=a.length?a.map((x,i)=>`<div class="v52-item"><button data-del="${i}">×</button>${esc(typeof x==='string'?x:x.text)}${x.date?` · ${esc(x.date)}`:''}</div>`).join(''):'<div class="v52-item">No planner items yet.</div>';$$('[data-del]',$('#v52-plan-list')).forEach(b=>b.onclick=()=>{const a=read('scholark_v51_planner');a.splice(+b.dataset.del,1);write('scholark_v51_planner',a);draw()})};$('#v52-plan-add').onclick=()=>{const i=$('#v52-plan'),v=i.value.trim();if(!v)return i.focus();const a=read('scholark_v51_planner');a.push({text:v,date:$('#v52-plan-date').value});write('scholark_v51_planner',a);i.value='';draw()};draw()}

  function renderGoals(){const h=host();if(!h)return;h.innerHTML=shell('Goals','Set learning, school and creation goals and connect them to your plan.',`<div class="v52-form"><input id="v52-goal" placeholder="What do you want to achieve?"><div class="v52-row"><input id="v52-goal-date" type="date"><button class="v52-btn" id="v52-goal-add">Add goal</button></div><div class="v52-list" id="v52-goal-list"></div></div>`);const draw=()=>{const a=read('scholark_v51_goals');$('#v52-goal-list').innerHTML=a.length?a.map((x,i)=>`<div class="v52-item"><button data-del="${i}">×</button>◉ ${esc(typeof x==='string'?x:x.text)}${x.date?` · target ${esc(x.date)}`:''}</div>`).join(''):'<div class="v52-item">No goals yet.</div>';$$('[data-del]',$('#v52-goal-list')).forEach(b=>b.onclick=()=>{const a=read('scholark_v51_goals');a.splice(+b.dataset.del,1);write('scholark_v51_goals',a);draw()})};$('#v52-goal-add').onclick=()=>{const i=$('#v52-goal'),v=i.value.trim();if(!v)return i.focus();const a=read('scholark_v51_goals');a.push({text:v,date:$('#v52-goal-date').value});write('scholark_v51_goals',a);i.value='';draw()};draw()}

  function renderProgress(){const h=host();if(!h)return;const p=read('scholark_v51_planner'),g=read('scholark_v51_goals'),m=read(eduKey);h.innerHTML=shell('Progress','A fast overview of your current SCHOLARK learning activity.',`<div class="v52-grid"><div class="v52-card"><b class="big">${g.length}</b><h3>Active goals</h3><p>Goals currently saved in your workspace.</p></div><div class="v52-card"><b class="big">${p.length}</b><h3>Planned actions</h3><p>Study and deadline items in your planner.</p></div><div class="v52-card"><b class="big">${m.filter(x=>x.status==='Mastered').length}</b><h3>Mastered topics</h3><p>Topics marked Mastered in Education & Learning.</p></div></div>`)}

  function renderProjects(){const h=host();if(!h)return;let arr=[];try{arr=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]')}catch{}if(!arr.length){try{const x=JSON.parse(localStorage.getItem('scholark_v45_last_project')||'null');if(x)arr=[x]}catch{}}h.innerHTML=shell('My Projects','Return to saved Studio work, documents, research and ongoing creations.',`<div class="v52-list">${arr.length?arr.slice(0,30).map(x=>`<div class="v52-item"><b>${esc(x.project||x.mode||'Untitled project')}</b><br>${esc(x.rawPrompt||x.prompt||'Saved SCHOLARK creation')}</div>`).join(''):'<div class="v52-item">No saved Studio projects yet. Create something in Studio AI and it will appear here.</div>'}</div>`)}

  function openSchools(){
    closeOtherViews();forceQuality();document.body.classList.add('v51-workspace','v51-pro','v51-schools');activateNav('schools');route('schools');
    const api=window.__SCHOLARK_V50_SCHOOLS__;if(api?.open){api.open();return}
    const r=$('#v50-school');if(r){r.classList.add('open');return}
    const h=host();if(h)h.innerHTML=shell('Schools Near Me','Find nearby schools by country, level and optional study interest.',`<div class="v52-item">Loading the school finder…</div>`)
  }

  function openDirect(id){
    if(id==='dashboard')return openDashboard();if(id==='studio')return openStudio();if(id==='schools')return openSchools();
    closeOtherViews();forceQuality();document.body.classList.add('v51-workspace');activateNav(id);route(id);
    if(id==='tutor')renderTutor();else if(id==='education')renderEducation();else if(id==='planner')renderPlanner();else if(id==='progress')renderProgress();else if(id==='goal')renderGoals();else if(id==='project')renderProjects();
  }

  document.addEventListener('click',e=>{const b=e.target.closest('[data-v51-tool]');if(!b)return;const id=b.dataset.v51Tool;if(!FAST.includes(id))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openDirect(id)},true);

  function syncRoute(){const id=String(location.hash||'').replace(/^#/,'').toLowerCase();if(FAST.includes(id))openDirect(id)}
  addEventListener('hashchange',syncRoute);addEventListener('popstate',syncRoute);
  setTimeout(()=>{cleanDashboard();const id=String(location.hash||'').replace(/^#/,'').toLowerCase();if(FAST.includes(id))openDirect(id)},25);
})();