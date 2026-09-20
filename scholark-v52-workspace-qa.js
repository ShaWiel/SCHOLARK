(() => {
  if (window.__SCHOLARK_V52_FAST_TOOLS__) return;
  window.__SCHOLARK_V52_FAST_TOOLS__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // V51 is the single route owner for Studio, My Projects and Pro/Future tools.
  // V52 only handles lightweight native learning views directly.
  const FAST=['dashboard','tutor','education','planner','progress','goal'];

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
    .v52-row3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:8px}.v52-row4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:8px}.v52-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:12px 0}.v52-mini-card{background:#f7f6f3;border:1px solid rgba(23,25,31,.06);border-radius:14px;padding:12px}.v52-mini-card b{display:block;font:950 20px Inter}.v52-mini-card span{display:block;margin-top:4px;font:700 7.5px/1.4 Inter;color:#777}.v52-next{margin:12px 0;padding:14px;border-radius:16px;background:#17191f;color:#fff}.v52-next b{display:block;font:900 10px Inter;color:#c9ff6a}.v52-next span{display:block;margin-top:5px;font:650 8.5px/1.45 Inter;color:#d3cfdb}.v52-task{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center}.v52-task.done{opacity:.62}.v52-task.done .v52-task-title{text-decoration:line-through}.v52-task-title{font:900 10px/1.35 Inter;color:#302c35}.v52-meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px}.v52-badge{display:inline-flex;padding:4px 6px;border-radius:999px;background:#e9e7f3;color:#595267;font:850 7px/1 Inter}.v52-badge.high{background:#ffe8e5;color:#8b3830}.v52-badge.goal{background:#e7f7dc;color:#3f6e28}.v52-inline-actions{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end}.v52-inline-actions button{float:none!important;border:0;border-radius:9px;background:#eceaf4;color:#443d52;padding:7px 8px;font:850 7px Inter;cursor:pointer}.v52-inline-actions button.primary{background:#17191f;color:#c9ff6a}.v52-goal-progress{height:7px;background:#e9e7e2;border-radius:99px;overflow:hidden;margin-top:9px}.v52-goal-progress i{display:block;height:100%;background:#6d5dfc;border-radius:inherit}.v52-goal-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center}.v52-method-steps{counter-reset:step}.v52-method-step{margin-top:6px;padding:8px 10px;border-radius:10px;background:#fff;border:1px solid rgba(23,25,31,.08);font:700 8px/1.45 Inter}.v52-focus-list{display:grid;gap:8px;margin-top:12px}

    @media(max-width:850px){.v52-grid{grid-template-columns:1fr 1fr}.v52-row,.v52-row3,.v52-row4{grid-template-columns:1fr}.v52-summary{grid-template-columns:1fr 1fr}.v52-head{display:block}.v52-pill{display:inline-block;margin-top:12px}}@media(max-width:620px){.v52-tool{padding:22px 13px}.v52-grid,.v52-action-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const route=id=>history.replaceState(null,'',location.pathname+location.search+'#'+id);
  const PLAN_KEY='scholark_v51_planner',GOAL_KEY='scholark_v51_goals',eduKey='scholark_v52_mastery',ASSIGN_KEY='scholark_v106_assignments';
  const uid=prefix=>prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
  const today=()=>new Date().toISOString().slice(0,10);
  const toTime=x=>{if(!x?.date)return Number.MAX_SAFE_INTEGER;const t=new Date(x.date+'T'+(x.time||'23:59')+':00').getTime();return Number.isFinite(t)?t:Number.MAX_SAFE_INTEGER};
  const priorityRank={high:0,medium:1,low:2};
  const normalizePlan=x=>typeof x==='string'?{id:uid('legacy-plan'),text:x,type:'task',subject:'',date:'',time:'',duration:0,priority:'medium',goalId:'',status:'todo',createdAt:new Date().toISOString()}:{id:x.id||uid('plan'),text:x.text||x.title||'',type:x.type||'task',subject:x.subject||'',date:x.date||'',time:x.time||'',duration:Number(x.duration)||0,priority:x.priority||'medium',goalId:x.goalId||'',status:x.status==='done'?'done':'todo',createdAt:x.createdAt||new Date().toISOString(),completedAt:x.completedAt||''};
  const plans=()=>read(PLAN_KEY).map(normalizePlan);
  const savePlans=a=>write(PLAN_KEY,a.map(normalizePlan));
  const normalizeGoal=x=>typeof x==='string'?{id:uid('legacy-goal'),text:x,category:'learning',date:'',measure:'',progress:0,status:'active',createdAt:new Date().toISOString()}:{id:x.id||uid('goal'),text:x.text||x.title||'',category:x.category||'learning',date:x.date||'',measure:x.measure||'',progress:Math.max(0,Math.min(100,Number(x.progress)||0)),status:x.status==='complete'||Number(x.progress)>=100?'complete':'active',createdAt:x.createdAt||new Date().toISOString(),completedAt:x.completedAt||''};
  const goals=()=>read(GOAL_KEY).map(normalizeGoal);
  const saveGoals=a=>write(GOAL_KEY,a.map(normalizeGoal));
  const reviewDays=status=>status==='Mastered'?14:status==='Practising'?4:status==='Learning'?2:1;
  const nextReview=status=>{const d=new Date();d.setDate(d.getDate()+reviewDays(status));return d.toISOString()};
  const mastery=()=>read(eduKey).map(x=>({...x,id:x.id||uid('mastery'),subject:x.subject||'General',topic:x.topic||'',status:x.status||'New',mastery:Number.isFinite(Number(x.mastery))?Number(x.mastery):({New:0,Learning:35,Practising:65,Mastered:100}[x.status]||0),nextReviewAt:x.nextReviewAt||nextReview(x.status||'New'),updatedAt:x.updatedAt||new Date().toISOString()}));
  const saveMastery=a=>write(eduKey,a);
  const assignments=()=>read(ASSIGN_KEY).map(x=>({...x,id:x.id||uid('assignment'),title:x.title||'',subject:x.subject||'',type:x.type||'assignment',dueDate:x.dueDate||'',instructions:x.instructions||'',progress:Math.max(0,Math.min(100,Number(x.progress)||0)),status:x.status==='complete'||Number(x.progress)>=100?'complete':'active'}));
  const assignmentDue=x=>{if(!x?.dueDate)return'No due date';const todayAt=new Date(today()+'T00:00:00').getTime(),due=new Date(x.dueDate+'T00:00:00').getTime(),d=Math.ceil((due-todayAt)/86400000);return d<0?Math.abs(d)+' day'+(Math.abs(d)===1?'':'s')+' overdue':d===0?'Due today':d===1?'Due tomorrow':'Due in '+d+' days'};
  function addPlan(row){const a=plans();a.push(normalizePlan({id:uid('plan'),status:'todo',createdAt:new Date().toISOString(),...row}));savePlans(a);return a[a.length-1]}
  function linkedTasks(goalId){return plans().filter(x=>x.goalId===goalId)}
  function goalProgress(g){const linked=linkedTasks(g.id),taskProgress=linked.length?Math.round(linked.filter(x=>x.status==='done').length/linked.length*100):0;return Math.max(Number(g.progress)||0,taskProgress)}
  function tutorPrompt(prompt){window.__SCHOLARK_WORKSPACE__?.openTool?.('tutor');setTimeout(()=>{const q=$('#v52-tutor-q');if(q){q.value=prompt;q.focus()}},120)}
  function downloadText(name,text,type='text/plain'){const blob=new Blob([text],{type:type+';charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800)}
  const csvCell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  function plannerCsv(){const rows=[['Task','Type','Subject','Date','Time','Duration','Priority','Status'],...plans().map(x=>[x.text,x.type,x.subject,x.date,x.time,x.duration,x.priority,x.status])];return rows.map(r=>r.map(csvCell).join(',')).join('\n')}
  function plannerIcs(){const fmt=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');const events=plans().filter(x=>x.date&&x.status!=='done').map(x=>{const start=new Date(x.date+'T'+(x.time||'09:00')+':00'),mins=Math.max(15,Number(x.duration)||45),end=new Date(start.getTime()+mins*60000);return ['BEGIN:VEVENT','UID:'+x.id+'@scholark','DTSTAMP:'+fmt(new Date()),'DTSTART:'+fmt(start),'DTEND:'+fmt(end),'SUMMARY:'+String(x.text||'SCHOLARK task').replace(/[\n,;]/g,' '),'DESCRIPTION:'+[x.subject,x.type,x.priority+' priority'].filter(Boolean).join(' · ').replace(/[\n,;]/g,' '),'END:VEVENT'].join('\r\n')});return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//SCHOLARK//Planner//EN',...events,'END:VCALENDAR'].join('\r\n')}


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

  function shell(title,sub,body){return `<div class="v52-tool"><div class="v52-head"><div><div class="v52-kicker">SCHOLARK WORKSPACE</div><h1>${esc(title)}</h1><p>${esc(sub)}</p></div></div>${body}</div>`}

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
    const active=assignments().filter(x=>x.status!=='complete').sort((a,b)=>String(a.dueDate||'9999').localeCompare(String(b.dueDate||'9999'))).slice(0,6);
    const assignmentPanel=active.length?`<div class="v52-form" style="margin-bottom:12px"><h3 style="margin:0 0 5px">Assignment Coach</h3><p style="margin:0 0 10px">SCHOLARK can read the assignments saved in your Workspace, compare deadlines and progress, and tell you exactly what to work on next.</p><div class="v52-list">${active.map(x=>`<div class="v52-item v52-task"><div><div class="v52-task-title" data-v106-user="1">${esc(x.title)}</div><div class="v52-meta">${x.subject?'<span class="v52-badge" data-v106-user="1">'+esc(x.subject)+'</span>':''}<span class="v52-badge">${esc(assignmentDue(x))}</span><span class="v52-badge">${x.progress}% done</span></div></div><div class="v52-inline-actions"><button class="primary" data-tutor-assignment="${esc(x.id)}">What should I do?</button></div></div>`).join('')}</div><button class="v52-btn" id="v52-tutor-all-assignments" style="margin-top:10px">Prioritise all my assignments</button></div>`:''; 
    h.innerHTML=shell('AI Tutor','Ask, learn, practise, or let SCHOLARK coach you through your saved assignments at your selected learning level.',assignmentPanel+`<div class="v52-form"><textarea id="v52-tutor-q" placeholder="Ask SCHOLARK anything — or ask what you should do next for an assignment..."></textarea><button class="v52-btn" id="v52-tutor-send">Ask <span>ARKI</span></button><div class="v52-chat" id="v52-chat"><div class="v52-msg ai">I’m ready. Ask a question, paste a problem, or choose an Assignment above and I’ll turn it into concrete next steps.</div></div></div>`);
    const q=$('#v52-tutor-q'),chat=$('#v52-chat');$('#v52-tutor-send').onclick=()=>{const v=q.value.trim();if(!v)return q.focus();chat.insertAdjacentHTML('beforeend',`<div class="v52-msg user">${esc(v)}</div>`);q.value='';const level=localStorage.getItem('scholark_learning_level')||'secondary';chat.insertAdjacentHTML('beforeend',`<div class="v52-msg ai"><b>SCHOLARK Tutor request prepared at ${esc(level)} level.</b><br>Your question stays in this workspace and is ready for the Tutor AI backend.</div>`)};
    $$('[data-tutor-assignment]',h).forEach(b=>b.onclick=()=>{const x=active.find(a=>a.id===b.dataset.tutorAssignment);if(!x)return;try{sessionStorage.setItem('scholark_v62_assignment_id',x.id)}catch{}q.value='Tell me exactly what I should do next for this assignment. Prioritise the work, explain the task in simple terms, break it into concrete steps, and tell me what to do first today.';$('#v52-tutor-send').click()});
    $('#v52-tutor-all-assignments')?.addEventListener('click',()=>{try{sessionStorage.removeItem('scholark_v62_assignment_id')}catch{}q.value='Look at all my active assignments. Tell me which one I should work on first and why, then give me a realistic order and the next concrete action for each assignment.';$('#v52-tutor-send').click()});
    try{const pending=sessionStorage.getItem('scholark_v106_pending_tutor')||sessionStorage.getItem('scholark_v62_pending_tutor_prompt');if(pending){q.value=pending;sessionStorage.removeItem('scholark_v106_pending_tutor');sessionStorage.removeItem('scholark_v62_pending_tutor_prompt');setTimeout(()=>$('#v52-tutor-send')?.click(),40)}}catch{}
  }

  function renderEducation(){
    const h=host();if(!h)return;
    h.innerHTML=shell('Education & Learning','Explore what to learn, track mastery, prepare for exams and choose evidence-based study methods — without duplicating Tutor or Planner.',`
      <div class="v52-action-grid">
        <button class="v52-action" data-edu="curriculum"><b>Curriculum Explorer</b><span>Map a subject into clear strands, units and learning priorities for your level.</span></button>
        <button class="v52-action" data-edu="mastery"><b>Mastery Map</b><span>Track topics as New, Learning, Practising or Mastered.</span></button>
        <button class="v52-action" data-edu="exam"><b>Exam Prep Center</b><span>Break an upcoming exam into topics, question types and revision priorities.</span></button>
        <button class="v52-action" data-edu="diagnostic"><b>Diagnostic Check</b><span>Find what you know, what is weak and what should enter your Mastery Map next.</span></button>
        <button class="v52-action" data-edu="review"><b>Spaced Review Queue</b><span>Review weak topics at the right time instead of rereading everything.</span></button>
        <button class="v52-action" data-edu="methods"><b>Study Methods Lab</b><span>Use active recall, Feynman, blurting, interleaving and other study methods correctly.</span></button>
      </div><div class="v52-detail" id="v52-edu-detail"></div>`);
    $$('[data-edu]',h).forEach(b=>b.onclick=()=>renderEducationModule(b.dataset.edu));
  }

  function renderEducationModule(type){
    const box=$('#v52-edu-detail');if(!box)return;
    if(type==='curriculum'){
      box.innerHTML=`<div class="v52-form"><h3>Curriculum Explorer</h3><p>Build an AI-generated subject map at your selected level, then turn the priorities into mastery topics.</p><div class="v52-row"><input id="v52-cur-subject" placeholder="Subject, e.g. Biology, Math, History"><input id="v52-cur-country" placeholder="Country / curriculum (optional)"></div><button class="v52-btn" id="v52-cur-build">Build subject map with ARKI</button><div class="v52-list" id="v52-cur-out"></div></div>`;
    } else if(type==='mastery'){
      box.innerHTML=`<div class="v52-form"><h3>Mastery Map</h3><p>Track each topic, schedule its next review and jump directly into Tutor practice.</p><div class="v52-row3"><input id="v52-m-subject" placeholder="Subject"><input id="v52-m-topic" placeholder="Topic or skill"><select id="v52-m-status"><option>New</option><option>Learning</option><option>Practising</option><option>Mastered</option></select></div><button class="v52-btn" id="v52-m-add">Add topic</button><div class="v52-list" id="v52-m-list"></div></div>`;
      const draw=()=>{
        const a=mastery();saveMastery(a);
        $('#v52-m-list').innerHTML=a.length?a.map((x,i)=>`<div class="v52-item v52-goal-card"><div><b>${esc(x.topic)}</b><div class="v52-meta"><span class="v52-badge">${esc(x.subject||'General')}</span><span class="v52-badge">${esc(x.status)}</span><span class="v52-badge">Next review ${esc(String(x.nextReviewAt||'').slice(0,10))}</span></div><div class="v52-goal-progress"><i style="width:${Math.max(0,Math.min(100,Number(x.mastery)||0))}%"></i></div></div><div class="v52-inline-actions"><select data-m-status="${i}" aria-label="Mastery status"><option ${x.status==='New'?'selected':''}>New</option><option ${x.status==='Learning'?'selected':''}>Learning</option><option ${x.status==='Practising'?'selected':''}>Practising</option><option ${x.status==='Mastered'?'selected':''}>Mastered</option></select><button class="primary" data-m-tutor="${i}">Practice</button><button data-m-del="${i}">Delete</button></div></div>`).join(''):'<div class="v52-item">No mastery topics yet. Add a topic or run a Diagnostic Check.</div>';
        $$('[data-m-status]',$('#v52-m-list')).forEach(sel=>sel.onchange=()=>{const a=mastery(),x=a[+sel.dataset.mStatus];if(!x)return;x.status=sel.value;x.mastery={New:0,Learning:35,Practising:65,Mastered:100}[sel.value]||0;x.nextReviewAt=nextReview(sel.value);x.updatedAt=new Date().toISOString();saveMastery(a);draw()});
        $$('[data-m-tutor]',$('#v52-m-list')).forEach(b=>b.onclick=()=>{const x=mastery()[+b.dataset.mTutor];if(x)tutorPrompt('Help me practise '+x.topic+' in '+x.subject+'. Start with active recall, then give me a worked example and a short check.')});
        $$('[data-m-del]',$('#v52-m-list')).forEach(b=>b.onclick=()=>{const a=mastery();a.splice(+b.dataset.mDel,1);saveMastery(a);draw()});
      };
      $('#v52-m-add').onclick=()=>{const topic=$('#v52-m-topic').value.trim();if(!topic)return $('#v52-m-topic').focus();const status=$('#v52-m-status').value||'New',a=mastery();a.push({id:uid('mastery'),subject:$('#v52-m-subject').value.trim()||'General',topic,status,mastery:{New:0,Learning:35,Practising:65,Mastered:100}[status]||0,nextReviewAt:nextReview(status),updatedAt:new Date().toISOString()});saveMastery(a);$('#v52-m-topic').value='';draw()};draw();
    } else if(type==='exam'){
      box.innerHTML=`<div class="v52-form"><h3>Exam Prep Center</h3><p>Turn a real exam into AI-generated questions and revision priorities, then grade yourself so the results feed Mastery.</p><div class="v52-row"><input id="v52-exam-name" placeholder="Exam / test name"><input id="v52-exam-date" type="date"></div><textarea id="v52-exam-topics" placeholder="Topics or chapters, one per line"></textarea><button class="v52-btn" id="v52-exam-build">Build exam prep with ARKI</button><div class="v52-list" id="v52-exam-out"></div></div>`;
    } else if(type==='methods'){
      const methods={
        recall:{name:'Active Recall',desc:'Close the notes and retrieve from memory before checking.',best:['Biology','History','Law','Medicine / Anatomy','Languages','Theory-heavy subjects'],example:'Biology example: close your notes and answer “What are the inputs, outputs and purpose of photosynthesis?” from memory. Then check the textbook and rewrite only what you missed.',steps:['Write 3–5 questions from the topic.','Answer without looking at notes.','Check only after answering.','Mark gaps and retest them later.']},
        feynman:{name:'Feynman Technique',desc:'Explain the idea simply, find gaps, then rebuild it.',best:['Physics','Biology','Economics','Law','Psychology','Concept-heavy subjects'],example:'Economics example: explain inflation to a 12-year-old without using the word “inflation” in the definition. If you get stuck explaining why prices rise, that is the gap to study.',steps:['Choose one concept.','Explain it as if teaching a beginner.','Circle jargon or gaps you cannot explain.','Return to the source, fix gaps and explain again.']},
        blurting:{name:'Blurting',desc:'Write everything you remember, then target what is missing.',best:['History','Biology','Geography','Sociology','Business','Content-heavy subjects'],example:'History example: after studying the causes of World War I, close everything and write every cause, alliance and trigger you remember. Compare with your source and highlight missing links.',steps:['Study briefly, then close the source.','Write everything you can recall.','Compare with the source.','Turn missing points into review questions.']},
        interleave:{name:'Interleaving',desc:'Mix related problem types so you practise choosing the right method.',best:['Mathematics','Physics','Chemistry calculations','Accounting','Statistics'],example:'Math example: instead of doing 15 quadratic equations in a row, mix quadratics, simultaneous equations, percentages and graphs so you must first decide which method applies.',steps:['Choose 2–4 related topics.','Mix question types instead of blocking one type.','Name the method before solving.','Review why each method was chosen.']},
        dual:{name:'Dual Coding',desc:'Pair concise words with a meaningful visual representation.',best:['Biology','Anatomy','Geography','History timelines','Processes and systems'],example:'Anatomy example: draw the heart with arrows for blood flow, then label each chamber and add one short sentence explaining what happens there.',steps:['Reduce the topic to key ideas.','Create a diagram, timeline, table or concept map.','Connect each visual element to a short explanation.','Recall the topic using only the visual.']},
        spaced:{name:'Spaced Repetition',desc:'Revisit material after increasing gaps instead of cramming it once.',best:['Languages','Anatomy','Medical terminology','Law definitions','Chemistry','History dates and facts'],example:'Spanish example: review 20 vocabulary cards today, weak cards tomorrow, remembered cards in 3–4 days, then extend the interval when recall stays strong.',steps:['Review today.','Review weak points tomorrow.','Review again after 3–4 days.','Increase the gap only when retrieval is strong.']},
        pomodoro:{name:'Pomodoro',desc:'Use a focused work block and a real break.',best:['Essay writing','Reading','Coding','Research','Assignments','Any subject when concentration is the problem'],example:'Assignment example: spend one 25-minute block finding and reading two good sources, take a 5-minute break, then use the next block to draft only the introduction.',steps:['Choose one concrete task.','Work without switching tasks for 25 minutes.','Take a 5 minute break.','After four cycles, take a longer break.']},
        cornell:{name:'Cornell Notes',desc:'Turn notes into a self-testing page.',best:['History','Biology','Law','Sociology','Business','Lecture-heavy courses'],example:'Sociology example: write lecture notes on socialisation in the main column, put questions such as “What is primary socialisation?” in the cue column, then answer those cues with the notes covered.',steps:['Take concise notes in the main column.','Write cue questions beside them.','Add a short summary at the bottom.','Cover the notes and answer the cue questions.']},
        sq3r:{name:'SQ3R',desc:'Survey, Question, Read, Recite and Review.',best:['History','Sociology','Law','Biology textbooks','Long theory chapters'],example:'Textbook example: scan a chapter on cell division, turn headings into questions such as “What happens in metaphase?”, read for those answers, then close the book and recite them.',steps:['Survey headings and summaries.','Turn headings into questions.','Read to answer those questions.','Recite answers without looking.','Review the questions later.']},
        leitner:{name:'Leitner System',desc:'Move flashcards through boxes based on recall strength.',best:['Languages','Anatomy','Chemistry formulas','Legal terms','Definitions and factual recall'],example:'Anatomy example: put every bone-name card in Box 1. Correct cards move to Box 2 and appear less often; any missed card goes back to Box 1 for faster review.',steps:['Create concise question-answer cards.','Start every card in Box 1.','Move correct cards to a later box.','Return missed cards to an earlier box.']},
        practice:{name:'Practice Testing',desc:'Use realistic questions before the real test so you practise retrieval and application under exam-like conditions.',best:['Mathematics','Physics','Chemistry','Accounting','Exam-based courses','Standardised tests'],example:'Physics example: do five unseen mechanics questions without notes and under a time limit. Mark them, classify every error, then redo only the question types you missed.',steps:['Choose unseen questions or a past paper.','Work without notes and use a realistic time limit.','Mark answers and classify each error.','Restudy the weak skill, then attempt a fresh question.']},
        elaborate:{name:'Elaborative Interrogation',desc:'Keep asking why a fact or relationship is true and connect the answer to prior knowledge.',best:['History','Biology','Economics','Sociology','Geography','Cause-and-effect topics'],example:'History example: instead of memorising “the Treaty of Versailles caused resentment,” ask why each term created resentment and how that connected to later political developments.',steps:['Choose one fact or claim.','Ask “Why is this true?” or “How does this connect?”','Answer using evidence and prior knowledge.','Check the explanation and correct weak links.']}
      };
      box.innerHTML=`<div class="v52-form"><h3>Study Methods Lab</h3><p>Choose a method to see how it works, a concrete example, the subjects it fits best, and how to apply it to your own topic.</p><input id="v52-method-topic" placeholder="Your subject or topic, e.g. Biology — photosynthesis"><div class="v52-chiprow">${Object.entries(methods).map(([k,m])=>`<button class="v52-chip" data-method="${k}">${m.name}</button>`).join('')}</div><div class="v52-list" id="v52-method-out"><div class="v52-item">Choose a method to see when to use it, an example and an actionable protocol.</div></div></div>`;
      $$('[data-method]',box).forEach(b=>b.onclick=()=>{const m=methods[b.dataset.method];$$('[data-method]',box).forEach(x=>x.classList.toggle('active',x===b));$('#v52-method-out').innerHTML=`<div class="v52-item"><b>${m.name}</b><br>${m.desc}<div class="v52-meta" style="margin-top:9px"><span class="v52-badge goal">BEST FOR</span>${m.best.map(x=>`<span class="v52-badge">${esc(x)}</span>`).join('')}</div><div style="margin-top:10px;padding:11px;border-radius:11px;background:#eeecff"><b>Example</b><br><span style="font:700 8.5px/1.5 Inter">${esc(m.example)}</span></div><div class="v52-method-steps">${m.steps.map((x,i)=>`<div class="v52-method-step">${i+1}. ${esc(x)}</div>`).join('')}</div><div class="v52-inline-actions" style="justify-content:flex-start;margin-top:10px"><button class="primary" id="v52-method-tutor">Show me with my topic</button><button id="v52-method-plan">Add this study session to Planner</button></div></div>`;$('#v52-method-plan').onclick=()=>{const topic=$('#v52-method-topic').value.trim()||'Study session';addPlan({text:m.name+' · '+topic,type:'study',subject:topic,date:today(),duration:m.name==='Pomodoro'?25:45,priority:'medium'});$('#v52-method-plan').textContent='✓ Added to Planner'};$('#v52-method-tutor').onclick=()=>{const topic=$('#v52-method-topic').value.trim()||m.best[0];tutorPrompt('Show me exactly how to use the '+m.name+' to study '+topic+'. Give me a worked example using that topic, then a short practice activity I can do now.')};});

    }
  }

  function renderPlanner(){
    const h=host();if(!h)return;
    const goalOptions=()=>'<option value="">No linked goal</option>'+goals().filter(g=>g.status!=='complete').map(g=>'<option value="'+esc(g.id)+'">'+esc(g.text)+'</option>').join('');
    h.innerHTML=shell('Planner','Organise study sessions, deadlines and next actions without leaving the workspace.',`<div class="v52-form"><input id="v52-plan" placeholder="What do you need to do?"><div class="v52-row3"><select id="v52-plan-type"><option value="task">Task</option><option value="study">Study session</option><option value="deadline">Deadline</option><option value="next_action">Next action</option></select><input id="v52-plan-subject" placeholder="Subject / project (optional)"><select id="v52-plan-goal">${goalOptions()}</select></div><div class="v52-row4"><input id="v52-plan-date" type="date"><input id="v52-plan-time" type="time"><select id="v52-plan-duration"><option value="0">No duration</option><option value="25">25 min</option><option value="45" selected>45 min</option><option value="60">60 min</option><option value="90">90 min</option></select><select id="v52-plan-priority"><option value="high">High priority</option><option value="medium" selected>Medium priority</option><option value="low">Low priority</option></select></div><button class="v52-btn" id="v52-plan-add">Add to planner</button><div class="v52-inline-actions" style="justify-content:flex-start;margin-top:8px"><button id="v52-plan-csv">Export CSV</button><button id="v52-plan-ics">Export calendar (.ics)</button><button id="v52-plan-clear">Clear completed</button></div><div id="v52-plan-summary"></div><div id="v52-plan-next"></div><div class="v52-list" id="v52-plan-list"></div></div>`);
    const draw=()=>{
      let a=plans();savePlans(a);
      const active=a.filter(x=>x.status!=='done'),done=a.filter(x=>x.status==='done'),todayKey=today(),overdue=active.filter(x=>x.date&&x.date<todayKey).length,dueToday=active.filter(x=>x.date===todayKey).length;
      $('#v52-plan-summary').innerHTML=`<div class="v52-summary"><div class="v52-mini-card"><b>${active.length}</b><span>Open actions</span></div><div class="v52-mini-card"><b>${dueToday}</b><span>Due today</span></div><div class="v52-mini-card"><b>${overdue}</b><span>Overdue</span></div><div class="v52-mini-card"><b>${done.length}</b><span>Completed</span></div></div>`;
      const sorted=[...a].sort((x,y)=>(x.status==='done')-(y.status==='done')||toTime(x)-toTime(y)||(priorityRank[x.priority]??1)-(priorityRank[y.priority]??1));
      const next=sorted.find(x=>x.status!=='done');
      $('#v52-plan-next').innerHTML=next?`<div class="v52-next"><b>NEXT ACTION</b><span>${esc(next.text)}${next.date?' · '+esc(next.date):''}${next.time?' '+esc(next.time):''}</span></div>`:'';
      const gs=new Map(goals().map(g=>[g.id,g.text]));
      $('#v52-plan-list').innerHTML=sorted.length?sorted.map(x=>`<div class="v52-item v52-task ${x.status==='done'?'done':''}"><div><div class="v52-task-title">${esc(x.text)}</div><div class="v52-meta"><span class="v52-badge">${esc(x.type.replace('_',' '))}</span>${x.subject?'<span class="v52-badge">'+esc(x.subject)+'</span>':''}${x.date?'<span class="v52-badge">'+esc(x.date)+(x.time?' · '+esc(x.time):'')+'</span>':''}${x.duration?'<span class="v52-badge">'+x.duration+' min</span>':''}<span class="v52-badge ${x.priority==='high'?'high':''}">${esc(x.priority)} priority</span>${x.goalId&&gs.get(x.goalId)?'<span class="v52-badge goal">Goal · '+esc(gs.get(x.goalId))+'</span>':''}</div></div><div class="v52-inline-actions"><button class="primary" data-plan-toggle="${esc(x.id)}">${x.status==='done'?'Undo':'Complete'}</button><button data-plan-del="${esc(x.id)}">Delete</button></div></div>`).join(''):'<div class="v52-item">No planner items yet. Add a task, study session, deadline or next action above.</div>';
      $$('[data-plan-toggle]',$('#v52-plan-list')).forEach(b=>b.onclick=()=>{const a=plans(),x=a.find(z=>z.id===b.dataset.planToggle);if(!x)return;x.status=x.status==='done'?'todo':'done';x.completedAt=x.status==='done'?new Date().toISOString():'';savePlans(a);draw()});
      $$('[data-plan-del]',$('#v52-plan-list')).forEach(b=>b.onclick=()=>{savePlans(plans().filter(x=>x.id!==b.dataset.planDel));draw()});
    };
    $('#v52-plan-add').onclick=()=>{const input=$('#v52-plan'),text=input.value.trim();if(!text)return input.focus();addPlan({text,type:$('#v52-plan-type').value,subject:$('#v52-plan-subject').value.trim(),goalId:$('#v52-plan-goal').value,date:$('#v52-plan-date').value,time:$('#v52-plan-time').value,duration:Number($('#v52-plan-duration').value)||0,priority:$('#v52-plan-priority').value});input.value='';draw()};
    $('#v52-plan-csv').onclick=()=>downloadText('scholark-planner.csv',plannerCsv(),'text/csv');
    $('#v52-plan-ics').onclick=()=>downloadText('scholark-planner.ics',plannerIcs(),'text/calendar');
    $('#v52-plan-clear').onclick=()=>{savePlans(plans().filter(x=>x.status!=='done'));draw()};
    draw()
  }

  function renderGoals(){
    const h=host();if(!h)return;
    h.innerHTML=shell('Goals','Set learning, school and creation goals and connect them to your plan.',`<div class="v52-form"><input id="v52-goal" placeholder="What do you want to achieve?"><div class="v52-row3"><select id="v52-goal-category"><option value="learning">Learning goal</option><option value="school">School goal</option><option value="creation">Creation goal</option><option value="career">Career / future goal</option></select><input id="v52-goal-date" type="date"><input id="v52-goal-measure" placeholder="How will you know it is achieved?"></div><button class="v52-btn" id="v52-goal-add">Add goal</button><div class="v52-list" id="v52-goal-list"></div></div>`);
    const draw=()=>{
      const a=goals();saveGoals(a);
      $('#v52-goal-list').innerHTML=a.length?a.map(g=>{const progress=goalProgress(g),tasks=linkedTasks(g.id),done=tasks.filter(x=>x.status==='done').length;return `<div class="v52-item v52-goal-card"><div><b>${esc(g.text)}</b><div class="v52-meta"><span class="v52-badge">${esc(g.category)}</span>${g.date?'<span class="v52-badge">Target '+esc(g.date)+'</span>':''}<span class="v52-badge goal">${done}/${tasks.length} linked actions done</span></div>${g.measure?'<div style="margin-top:6px">'+esc(g.measure)+'</div>':''}<div class="v52-goal-progress"><i style="width:${progress}%"></i></div><div style="margin-top:5px;font:800 7px Inter;color:#777">${progress}% progress</div></div><div class="v52-inline-actions"><button data-goal-dec="${esc(g.id)}">−10%</button><button data-goal-inc="${esc(g.id)}">+10%</button><button class="primary" data-goal-next="${esc(g.id)}">Add next action</button><button data-goal-complete="${esc(g.id)}">${g.status==='complete'?'Reopen':'Complete'}</button><button data-goal-del="${esc(g.id)}">Delete</button></div></div>`}).join(''):'<div class="v52-item">No goals yet. Create a learning, school or creation goal and connect actions to it.</div>';
      const mutate=(id,fn)=>{const a=goals(),g=a.find(x=>x.id===id);if(!g)return;fn(g);saveGoals(a);draw()};
      $$('[data-goal-inc]',$('#v52-goal-list')).forEach(b=>b.onclick=()=>mutate(b.dataset.goalInc,g=>{g.progress=Math.min(100,(Number(g.progress)||0)+10);if(g.progress>=100){g.status='complete';g.completedAt=new Date().toISOString()}}));
      $$('[data-goal-dec]',$('#v52-goal-list')).forEach(b=>b.onclick=()=>mutate(b.dataset.goalDec,g=>{g.progress=Math.max(0,(Number(g.progress)||0)-10);if(g.progress<100)g.status='active'}));
      $$('[data-goal-complete]',$('#v52-goal-list')).forEach(b=>b.onclick=()=>mutate(b.dataset.goalComplete,g=>{const done=g.status!=='complete';g.status=done?'complete':'active';g.progress=done?100:Math.min(90,Number(g.progress)||0);g.completedAt=done?new Date().toISOString():''}));
      $$('[data-goal-next]',$('#v52-goal-list')).forEach(b=>b.onclick=()=>{const g=goals().find(x=>x.id===b.dataset.goalNext);if(!g)return;addPlan({text:'Next action · '+g.text,type:'next_action',subject:g.category,goalId:g.id,date:today(),priority:'high'});b.textContent='✓ Added to Planner'});
      $$('[data-goal-del]',$('#v52-goal-list')).forEach(b=>b.onclick=()=>{saveGoals(goals().filter(x=>x.id!==b.dataset.goalDel));draw()});
    };
    $('#v52-goal-add').onclick=()=>{const i=$('#v52-goal'),text=i.value.trim();if(!text)return i.focus();const a=goals();a.push({id:uid('goal'),text,category:$('#v52-goal-category').value,date:$('#v52-goal-date').value,measure:$('#v52-goal-measure').value.trim(),progress:0,status:'active',createdAt:new Date().toISOString()});saveGoals(a);i.value='';$('#v52-goal-measure').value='';draw()};draw()
  }

  function renderProgress(){
    const h=host();if(!h)return;const p=plans(),g=goals(),m=mastery(),activeGoals=g.filter(x=>x.status!=='complete'),goalAvg=g.length?Math.round(g.reduce((n,x)=>n+goalProgress(x),0)/g.length):0,doneP=p.filter(x=>x.status==='done'),openP=p.filter(x=>x.status!=='done'),overdue=openP.filter(x=>x.date&&x.date<today()),mastered=m.filter(x=>x.status==='Mastered'),weak=m.filter(x=>x.status!=='Mastered').sort((a,b)=>(a.mastery||0)-(b.mastery||0)),lang=(()=>{try{return JSON.parse(localStorage.getItem('scholark_v93_language_progress')||'{}')||{}}catch{return{}}})(),lessons=Object.values(lang).reduce((n,x)=>n+(Number(x.lessons)||0),0),streak=Math.max(0,...Object.values(lang).map(x=>Number(x.streak)||0));
    const next=overdue[0]||openP.sort((a,b)=>toTime(a)-toTime(b))[0];
    h.innerHTML=shell('Progress','See what is improving, what is weak and where to focus next.',`<div class="v52-inline-actions" style="justify-content:flex-start;margin-bottom:10px"><button id="v52-progress-export">Export progress snapshot</button></div><div class="v52-summary"><div class="v52-mini-card"><b>${goalAvg}%</b><span>Average goal progress</span></div><div class="v52-mini-card"><b>${doneP.length}</b><span>Completed planner actions</span></div><div class="v52-mini-card"><b>${mastered.length}</b><span>Mastered topics</span></div><div class="v52-mini-card"><b>${lessons}</b><span>Language lessons · streak ${streak}</span></div></div><div class="v52-grid"><div class="v52-card"><h3>What is improving</h3><p>${mastered.length?mastered.slice(0,5).map(x=>esc(x.topic)).join(' · '):'Mark topics as Mastered after successful practice and they will appear here.'}</p></div><div class="v52-card"><h3>What needs attention</h3><p>${weak.length?weak.slice(0,5).map(x=>esc(x.topic)+' ('+Math.round(Number(x.mastery)||0)+'%)').join(' · '):'Run a Diagnostic Check or add topics to Mastery to identify weak areas.'}</p></div><div class="v52-card"><h3>Where to focus next</h3><p>${next?esc(next.text)+(next.date?' · '+esc(next.date):''):weak[0]?'Review '+esc(weak[0].topic):activeGoals[0]?'Take one action toward '+esc(activeGoals[0].text):'Add a goal or planner action to create your next focus.'}</p></div></div>${overdue.length?'<div class="v52-next"><b>'+overdue.length+' OVERDUE ACTION'+(overdue.length===1?'':'S')+'</b><span>'+overdue.slice(0,4).map(x=>esc(x.text)).join(' · ')+'</span></div>':''}<div class="v52-focus-list">${activeGoals.slice(0,5).map(x=>'<div class="v52-item"><b>'+esc(x.text)+'</b><span class="v52-status">'+goalProgress(x)+'%</span></div>').join('')}</div>`)
    $('#v52-progress-export')?.addEventListener('click',()=>{const snapshot={generatedAt:new Date().toISOString(),goals:g.map(x=>({goal:x.text,progress:goalProgress(x),status:x.status})),planner:{completed:doneP.length,open:openP.length,overdue:overdue.length},mastery:m.map(x=>({subject:x.subject,topic:x.topic,status:x.status,mastery:x.mastery})),language:{lessons,streak}};downloadText('scholark-progress.json',JSON.stringify(snapshot,null,2),'application/json')})
  }

  function renderProjects(){const h=host();if(!h)return;let arr=[];try{arr=JSON.parse(localStorage.getItem('scholark_v110_learning_projects')||'[]')}catch{}h.innerHTML=shell('My Projects','Keep learning projects, research and ongoing work connected to Goals and Planner.',`<div class="v52-list">${arr.length?arr.slice(0,30).map(x=>`<div class="v52-item"><b>${esc(x.title||'Untitled project')}</b><br>${esc(x.subject||x.notes||'Connected learning project')}</div>`).join(''):'<div class="v52-item">No learning projects yet. Create one in My Projects to organize ongoing work.</div>'}</div>`)}

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

  // Sidebar navigation is owned by V51. V52 exposes the fast native views
  // without capture-phase interception, preventing stale overlays and route races.
  function syncRoute(){const id=String(location.hash||'').replace(/^#/,'').toLowerCase();if(FAST.includes(id))openDirect(id)}
  // V51 is the single route owner. Avoid duplicate hash/popstate handlers that
  // can remount the same tool twice during navigation.
  setTimeout(()=>{cleanDashboard();const id=String(location.hash||'').replace(/^#/,'').toLowerCase();if(FAST.includes(id)&&document.body.classList.contains('v51-workspace'))openDirect(id)},120);
  window.__SCHOLARK_V52_FAST__={open:openDirect,sync:syncRoute,tools:[...FAST]};
})();