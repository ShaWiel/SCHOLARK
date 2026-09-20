(() => {
  if(window.__SCHOLARK_V114_ORCHESTRATOR__)return;
  window.__SCHOLARK_V114_ORCHESTRATOR__=true;

  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const core=()=>window.__SCHOLARK_WORKSPACE_CORE__;
  const today=()=>new Date().toISOString().slice(0,10);
  const ROUTES=new Set(['dashboard','ai','tutor','education','planner','focus','flashcards','assignments','progress','goal','language','files','project','schools','study']);
  const NAMES={dashboard:'Dashboard',ai:'ARKI',tutor:'AI Tutor',education:'Education & Learning',planner:'Planner',focus:'Focus Sessions',flashcards:'Flashcards',assignments:'Assignments',progress:'Progress',goal:'Goals',language:'Language Learner',files:'Files & Notes',project:'My Projects',schools:'Schools Near Me',study:'Study Ahead'};
  const HANDOFF='scholark_v114_handoff';
  let activeActions=new Map(),raf=0,mutationTimer=0,cloudTimer=0,consumeTimer=0,lastSignature='';

  const style=document.createElement('style');style.id='scholark-v114-style';style.textContent=[
    '.v114-connect{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 0 14px;padding:12px 14px;border-radius:18px;background:linear-gradient(120deg,#17191f,#27213e);color:#fff;box-shadow:0 16px 42px rgba(31,27,63,.12);font-family:Inter,system-ui;position:relative;overflow:hidden}',
    '.v114-connect:after{content:"";position:absolute;width:190px;height:190px;border-radius:50%;right:-95px;top:-110px;background:#c9ff6a;opacity:.08;pointer-events:none}',
    '.v114-copy{min-width:150px;position:relative;z-index:1}.v114-copy small{display:block;font:950 6.5px Inter;letter-spacing:.14em;color:#c9ff6a}.v114-copy b{display:block;margin-top:5px;font:900 9px/1.25 Inter}.v114-copy span{display:block;margin-top:3px;font:650 6.5px/1.3 Inter;color:#c8c5cf}',
    '.v114-actions{display:flex;align-items:center;justify-content:flex-end;gap:6px;flex-wrap:wrap;position:relative;z-index:1}.v114-actions button{border:1px solid rgba(255,255,255,.11);border-radius:10px;background:rgba(255,255,255,.08);color:#fff;padding:8px 9px;font:850 6.8px Inter;cursor:pointer;transition:transform .16s ease,background .16s ease}.v114-actions button:hover{transform:translateY(-1px);background:rgba(255,255,255,.14)}.v114-actions button.primary{background:#c9ff6a;color:#17191f;border-color:#c9ff6a}.v114-actions button:disabled{opacity:.45;cursor:not-allowed;transform:none}',
    '#v114-toast{position:fixed;right:18px;bottom:18px;z-index:2147483000;max-width:min(420px,calc(100vw - 36px));padding:11px 13px;border-radius:14px;background:#17191f;color:#fff;box-shadow:0 18px 55px rgba(0,0,0,.25);font:750 8px/1.45 Inter;opacity:0;transform:translateY(10px);pointer-events:none;transition:.18s ease}#v114-toast.open{opacity:1;transform:translateY(0)}#v114-toast.good{border-left:4px solid #c9ff6a}#v114-toast.warn{border-left:4px solid #ffb071}',
    '#v114-transition{position:fixed;left:50%;top:16px;z-index:2147483001;transform:translate(-50%,-16px);opacity:0;pointer-events:none;min-width:190px;max-width:calc(100vw - 36px);padding:9px 13px;border-radius:999px;background:#17191f;color:#fff;box-shadow:0 12px 35px rgba(0,0,0,.2);font:850 7.5px Inter;transition:.18s ease;text-align:center}#v114-transition.open{transform:translate(-50%,0);opacity:1}#v114-transition i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#c9ff6a;margin-right:7px;animation:v114pulse .8s ease-in-out infinite alternate}@keyframes v114pulse{to{opacity:.28;transform:scale(.8)}}',
    'html[dir="rtl"] #v114-toast{right:auto;left:18px}',
    '@media(max-width:760px){.v114-connect{align-items:flex-start;flex-direction:column}.v114-actions{justify-content:flex-start}.v114-copy{min-width:0}}',
    '@media(prefers-reduced-motion:reduce){.v114-actions button,#v114-toast,#v114-transition{transition:none!important}#v114-transition i{animation:none!important}}'
  ].join('');document.head.appendChild(style);

  $$('.v108-context').forEach(x=>x.remove());
  const toastEl=document.createElement('div');toastEl.id='v114-toast';document.body.appendChild(toastEl);
  const transitionEl=document.createElement('div');transitionEl.id='v114-transition';document.body.appendChild(transitionEl);

  function route(){return clean(String(location.hash||'#dashboard').replace(/^#/,'').split(/[?&/]/)[0]).toLowerCase()||'dashboard'}
  function hash(v){let h=2166136261,s=String(v||'');for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)}
  function rootFor(tool){
    if(tool==='dashboard')return $('[data-v51-page="dashboard"].active .v51-shell')||$('[data-v51-page="dashboard"] .v51-shell');
    if(tool==='ai')return $('#v107-ai');
    if(['tutor','education','planner','progress','goal'].includes(tool))return $('.v52-tool[data-v52-tool="'+tool+'"]');
    if(['focus','flashcards','assignments'].includes(tool))return $('#v106-root[data-tool="'+tool+'"]');
    if(tool==='language')return $('.v93');
    if(tool==='files')return $('.v86');
    if(tool==='project')return $('.v64-projects')||$('#v51-fallback');
    if(tool==='schools')return $('#v50-school.open .v50-box')||$('#v50-school.open');
    if(tool==='study')return $('.v62-study');
    return null;
  }
  function showToast(message,type='good'){
    clearTimeout(showToast.timer);toastEl.textContent=clean(message);toastEl.className='open '+type;showToast.timer=setTimeout(()=>{toastEl.className=''},2600)
  }
  function showTransition(to){
    transitionEl.innerHTML='<i></i>Connecting to '+esc(NAMES[to]||to)+'…';transitionEl.classList.add('open');
    clearTimeout(showTransition.timer);showTransition.timer=setTimeout(()=>transitionEl.classList.remove('open'),3200)
  }
  function hideTransition(){transitionEl.classList.remove('open')}
  function open(tool){tool=clean(tool).toLowerCase();if(tool&&tool!==route())showTransition(tool);core()?.actions?.open?.(tool);setTimeout(()=>{if(!readHandoff())hideTransition()},900)}
  function syncCloud(kind){
    clearTimeout(cloudTimer);cloudTimer=setTimeout(()=>{
      const api=window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__;
      if(kind==='planner')api?.loadPlanner?.(true);
      else if(kind==='goal')api?.loadGoals?.(true);
      else if(kind==='mastery')api?.loadMastery?.(true);
      window.dispatchEvent(new CustomEvent('scholark:workspace-cloud-refresh',{detail:{kind,source:'r174'}}));
    },420)
  }
  function sourceKey(prefix,text){return 'r174:'+prefix+':'+hash(clean(text).toLowerCase())}
  function safeJson(value){try{return JSON.stringify(value)}catch{return''}}
  function nextPlanner(){
    const rows=core()?.compute?.().planner.active||[];
    return rows.slice().sort((a,b)=>String(a.date||'9999').localeCompare(String(b.date||'9999'))||({high:0,medium:1,low:2}[a.priority]??1)-({high:0,medium:1,low:2}[b.priority]??1))[0]||null
  }
  function nextAssignment(){
    const rows=core()?.compute?.().assignments.active||[];
    return rows.slice().sort((a,b)=>String(a.dueDate||'9999').localeCompare(String(b.dueDate||'9999'))||({high:0,medium:1,low:2}[a.priority]??1)-({high:0,medium:1,low:2}[b.priority]??1))[0]||null
  }
  function weakTopic(){return core()?.compute?.().mastery.weak?.[0]||null}
  function arkiData(){
    const api=window.__SCHOLARK_V107_GENERAL_AI__,chat=api?.getCurrent?.(),msg=api?.lastAssistant?.();
    return {chat,text:clean(msg?.content||$('.v107-msg.assistant:last-of-type')?.innerText||'')};
  }
  function tutorData(){
    const chat=$('#v52-chat'),users=chat?$$('.v52-msg.user',chat):[],answers=chat?$$('.v52-msg.ai',chat):[],user=clean(users.at(-1)?.innerText||''),answer=clean(answers.at(-1)?.innerText||'');
    const weak=weakTopic(),topic=(user||weak?.topic||'Tutor review').slice(0,140);
    return {user,answer:answer.startsWith('I’m ready.')?'':answer,topic,subject:weak?.subject||'AI Tutor'};
  }
  function filesData(){
    const api=window.__SCHOLARK_V86_FILES__,state=api?.getState?.()||{},output=clean(api?.getOutput?.()||$('#v86-output')?.innerText||'');
    const ready=/^Ready when you are\.?/i.test(output);return {state,output:ready?'':output}
  }
  function studyData(){
    let row=window.__SCHOLARK_V83_STUDY_AHEAD__?.getCurrent?.()||null;
    if(!row)try{row=JSON.parse(localStorage.getItem('scholark_v83_study_ahead')||'null')}catch{}
    return row||null;
  }
  function schoolData(){return window.__SCHOLARK_V50_SCHOOLS__?.selection?.()||{country:clean($('#v50-country')?.value),city:clean($('#v50-city')?.value),study:clean($('#v50-study')?.value),results:[],compared:[]}}
  function languageData(){return window.__SCHOLARK_V93_LANGUAGE__?.getCurrent?.()||null}
  function activeProject(){return (core()?.data?.learningProjects?.()||[]).find(x=>x.status!=='complete')||null}

  async function generateCards(subject,topics=[],context=''){
    const x=window.__SCHOLARK_V111_EXPERIENCE__?.generateCards;if(typeof x==='function')return x(subject,topics,context);
    const body={mode:'flashcards',subject:subject||'SCHOLARK Review',topics:Array.isArray(topics)?topics:[topics],count:8,context:clean(context).slice(0,8000),level:localStorage.getItem('scholark_learning_level')||'student',language:window.__SCHOLARK_I18N__?.languageName?.(localStorage.getItem('scholark_ui_language')||'en')||'English'};
    const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),d=await r.json().catch(()=>({}));
    if(!r.ok||!d?.ok)throw new Error(d?.error||'Could not generate flashcards');
    return core()?.actions?.addFlashcards?.(d.result?.deck||subject,d.result?.cards||[])||0;
  }
  function addPlan(input,openAfter=true){
    const row=core()?.actions?.addPlan?.(input);if(!row)return null;syncCloud('planner');showToast('Added to Planner.');if(openAfter)open('planner');return row
  }
  function addGoal(input,openAfter=true){
    const row=core()?.actions?.addGoal?.(input);if(!row)return null;syncCloud('goal');showToast('Added to Goals.');if(openAfter)open('goal');return row
  }
  function prepareFocus(input){
    const row=core()?.actions?.prepareFocus?.(input);if(!row)return null;showToast('Focus session prepared.');open('focus');return row
  }
  function promptArki(prompt){return handoff('ai',{prompt:clean(prompt)})}
  function promptTutor(prompt){return handoff('tutor',{prompt:clean(prompt)})}

  function readHandoff(){try{const x=JSON.parse(sessionStorage.getItem(HANDOFF)||'null');return x&&typeof x==='object'?x:null}catch{return null}}
  function clearHandoff(id=''){try{const x=readHandoff();if(!id||x?.id===id)sessionStorage.removeItem(HANDOFF)}catch{}}
  function handoff(to,payload={}){
    to=clean(to).toLowerCase();if(!ROUTES.has(to))return false;
    const row={id:'handoff-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6),from:route(),to,payload:payload&&typeof payload==='object'?payload:{},at:Date.now(),expiresAt:Date.now()+5*60*1000};
    try{sessionStorage.setItem(HANDOFF,JSON.stringify(row))}catch{}
    core()?.record?.('workspace','handoff',{from:row.from,to:row.to,id:row.id});
    if(to==='focus'&&row.payload.focus)core()?.actions?.prepareFocus?.(row.payload.focus);
    showTransition(to);open(to);scheduleConsume(35);return true;
  }
  function applyHandoff(row){
    const p=row.payload||{},to=row.to;
    if(to==='ai'){
      const api=window.__SCHOLARK_V107_GENERAL_AI__;if(api?.prefill)return api.prefill(p.prompt||p.text||'');
      const q=$('#v107-q');if(!q)return false;q.value=clean(p.prompt||p.text);q.focus();return true;
    }
    if(to==='tutor'){
      const q=$('#v52-tutor-q');if(!q)return false;q.value=clean(p.prompt||p.text);q.dispatchEvent(new Event('input',{bubbles:true}));q.focus();return true;
    }
    if(to==='study'){
      const api=window.__SCHOLARK_V83_STUDY_AHEAD__;if(api?.prefill)return api.prefill(p);
      const field=$('#v62-field');if(!field)return false;if(p.field!==undefined)field.value=clean(p.field);if(p.country!==undefined&&$('#v62-country'))$('#v62-country').value=clean(p.country);if(p.targetSchool!==undefined&&$('#v62-school'))$('#v62-school').value=clean(p.targetSchool);if(p.context!==undefined&&$('#v62-context'))$('#v62-context').value=clean(p.context);field.focus();return true;
    }
    if(to==='schools'){
      const country=$('#v50-country');if(!country)return false;if(p.country!==undefined)country.value=clean(p.country);if(p.city!==undefined&&$('#v50-city'))$('#v50-city').value=clean(p.city);if(p.study!==undefined&&$('#v50-study'))$('#v50-study').value=clean(p.study);if(p.name!==undefined&&$('#v50-name'))$('#v50-name').value=clean(p.name);if(p.level!==undefined&&$('#v50-level')&&[...$('#v50-level').options].some(x=>x.value===p.level))$('#v50-level').value=p.level;window.__SCHOLARK_V50_SCHOOLS__?.syncStudyField?.();country.focus();return true;
    }
    if(to==='focus'){window.__SCHOLARK_V106_POWER__?.open?.('focus');return !!$('#v106-root[data-tool="focus"]')}
    if(to==='planner'){
      const q=$('#v52-plan');if(!q)return false;if(p.text!==undefined)q.value=clean(p.text);if(p.subject!==undefined&&$('#v52-plan-subject'))$('#v52-plan-subject').value=clean(p.subject);q.focus();return true;
    }
    if(to==='goal'){const q=$('#v52-goal');if(!q)return false;if(p.text!==undefined)q.value=clean(p.text);q.focus();return true}
    if(to==='language'){const q=$('#v93-topic');if(!q)return false;if(p.topic!==undefined)q.value=clean(p.topic);q.focus();return true}
    return !!rootFor(to);
  }
  function consume(){
    clearTimeout(consumeTimer);const row=readHandoff();if(!row)return false;
    if(Date.now()>Number(row.expiresAt||0)){clearHandoff(row.id);hideTransition();return false}
    if(route()!==row.to)return false;
    const ok=applyHandoff(row);if(ok){clearHandoff(row.id);hideTransition();showToast('Context carried into '+(NAMES[row.to]||row.to)+'.');return true}
    return false;
  }
  function scheduleConsume(delay=80,attempt=0){
    clearTimeout(consumeTimer);consumeTimer=setTimeout(()=>{if(consume())return;if(attempt<16&&readHandoff())scheduleConsume(Math.min(320,80+attempt*18),attempt+1);else hideTransition()},delay)
  }

  function actionsFor(tool){
    const s=core()?.compute?.()||{},actions=[];
    const add=(id,label,run,opt={})=>actions.push({id,label,run,primary:!!opt.primary,disabled:!!opt.disabled});
    if(tool==='dashboard'){
      const next=s.next;
      add('next','Do next best action',()=>next?open(next.tool):promptArki('Help me choose the most useful next action based on my SCHOLARK workspace.'),{primary:true});
      add('arki','Ask ARKI',()=>promptArki('Review my SCHOLARK workspace and tell me what deserves my attention next.'));
      add('planner','Planner',()=>open('planner'));add('progress','Progress',()=>open('progress'));return actions;
    }
    if(tool==='ai'){
      const x=arkiData(),title=clean(x.chat?.title||'ARKI work');
      add('tutor','Continue in AI Tutor',()=>promptTutor('Teach me the important ideas from this ARKI answer, then check my understanding:\n\n'+x.text),{primary:true,disabled:!x.text});
      add('cards','Make flashcards',async()=>{const n=await generateCards(title,[],x.text);showToast(n+' flashcards added.');open('flashcards')},{disabled:!x.text});
      add('plan','Add next action',()=>addPlan({text:'Act on · '+title.slice(0,110),type:'next_action',subject:'ARKI',date:today(),duration:30,priority:'medium',sourceKey:sourceKey('ai-plan',title+x.text.slice(0,400))}),{disabled:!x.text});
      add('project','Save as project',()=>{core()?.actions?.createProject?.({title,subject:'ARKI',notes:x.text.slice(0,6000),sourceKey:sourceKey('ai-project',title+x.text.slice(0,500))});showToast('Saved to My Projects.');open('project')},{disabled:!x.text});return actions;
    }
    if(tool==='tutor'){
      const x=tutorData(),text=x.answer||x.user;
      add('mastery','Save to Mastery',()=>{core()?.actions?.upsertMastery?.({subject:x.subject,topic:x.topic,mastery:55,status:'Learning',nextReviewAt:new Date(Date.now()+2*86400000).toISOString()});syncCloud('mastery');showToast('Saved to Mastery.')},{primary:true,disabled:!x.topic});
      add('cards','Create flashcards',async()=>{const n=await generateCards(x.subject,[x.topic],text);showToast(n+' flashcards added.');open('flashcards')},{disabled:!text});
      add('plan','Plan review',()=>addPlan({text:'Review · '+x.topic,type:'study',subject:x.subject,date:today(),duration:25,priority:'medium',sourceKey:sourceKey('tutor-plan',x.topic)}),{disabled:!x.topic});
      add('focus','Focus this',()=>prepareFocus({task:'Practise · '+x.topic,duration:25,autoComplete:false}),{disabled:!x.topic});return actions;
    }
    if(tool==='education'){
      const x=weakTopic();
      add('tutor','Practise weakest topic',()=>promptTutor('Help me practise '+x.topic+' in '+x.subject+'. Use active recall first, then one application question.'),{primary:true,disabled:!x});
      add('plan','Plan review',()=>addPlan({text:'Review · '+x.topic,type:'study',subject:x.subject,date:today(),duration:25,priority:'high',sourceKey:sourceKey('mastery-plan',x.id||x.subject+x.topic)}),{disabled:!x});
      add('cards','Create flashcards',async()=>{const n=await generateCards(x.subject,[x.topic]);showToast(n+' flashcards added.');open('flashcards')},{disabled:!x});
      add('focus','Focus weakest topic',()=>prepareFocus({task:'Review · '+x.topic,duration:25,autoComplete:false}),{disabled:!x});return actions;
    }
    if(tool==='planner'){
      const x=nextPlanner();
      add('focus','Focus next task',()=>prepareFocus({task:x.text,duration:x.duration||25,linkedPlannerId:x.id,autoComplete:true}),{primary:true,disabled:!x});
      add('arki','Reprioritise with ARKI',()=>promptArki('Reprioritise my current SCHOLARK Planner. Explain what I should do first and why. Workspace context:\n'+safeJson(core()?.context?.()||{})));
      add('assign','Assignments',()=>open('assignments'));add('goals','Goals',()=>open('goal'));return actions;
    }
    if(tool==='focus'){
      const x=core()?.read?.(core()?.keys?.focus,{})||{},task=clean(x.task);
      add('planner','Back to Planner',()=>open('planner'),{primary:true});add('progress','See Progress',()=>open('progress'));
      add('tutor','Tutor this task',()=>promptTutor('Coach me through this task one step at a time without doing the learning for me: '+task),{disabled:!task});
      add('cards','Review flashcards',()=>open('flashcards'));return actions;
    }
    if(tool==='flashcards'){
      const card=s.flashcards.due?.[0]||null;
      add('review','Tutor due card',()=>promptTutor('Quiz me on this flashcard without showing the answer first: '+card.front+'. Answer reference: '+card.back),{primary:true,disabled:!card});
      add('focus','Focus review',()=>prepareFocus({task:'Review '+s.flashcards.due.length+' due flashcards',duration:25,autoComplete:false}),{disabled:!s.flashcards.due.length});
      add('plan','Plan review',()=>addPlan({text:'Review due flashcards',type:'study',subject:'Flashcards',date:today(),duration:25,priority:'medium',sourceKey:'r174:flashcards:'+today()}),{disabled:!s.flashcards.due.length});
      add('progress','See Progress',()=>open('progress'));return actions;
    }
    if(tool==='assignments'){
      const x=nextAssignment();
      add('plan','Break into Planner',()=>{const n=window.__SCHOLARK_V106_POWER__?.assignments?.plan?.(x)||0;showToast(n?n+' Planner steps added.':'Planner steps already exist.');syncCloud('planner');open('planner')},{primary:true,disabled:!x});
      add('tutor','Ask AI Tutor',()=>promptTutor('Tell me exactly what to do next for this assignment. Use the deadline, progress and requirements. Assignment:\n'+safeJson(x)),{disabled:!x});
      add('focus','Focus first step',()=>{if(!x)return;window.__SCHOLARK_V106_POWER__?.assignments?.plan?.(x);const p=(core()?.data?.planner?.()||[]).find(z=>z.id==='assignment-'+x.id+'-0');prepareFocus({task:p?.text||('Work on · '+x.title),duration:p?.duration||25,linkedPlannerId:p?.id||'',autoComplete:!!p});syncCloud('planner')},{disabled:!x});
      add('progress','Progress',()=>open('progress'));return actions;
    }
    if(tool==='progress'){
      const next=s.next;
      add('next','Do next best action',()=>next?open(next.tool):open('planner'),{primary:true});
      add('focus','Start focused work',()=>{const p=nextPlanner(),w=weakTopic();if(p)prepareFocus({task:p.text,duration:p.duration||25,linkedPlannerId:p.id,autoComplete:true});else if(w)prepareFocus({task:'Review · '+w.topic,duration:25,autoComplete:false});else open('planner')});
      add('planner','Planner',()=>open('planner'));add('goals','Goals',()=>open('goal'));return actions;
    }
    if(tool==='goal'){
      const g=s.goals.active?.[0]||null;
      add('arki','Plan active goal with ARKI',()=>promptArki('Turn this goal into concrete, realistic next actions I can schedule in SCHOLARK Planner: '+g.text),{primary:true,disabled:!g});
      add('project','Create linked project',()=>{const p=core()?.actions?.createProject?.({title:g.text,subject:g.category||'Goal',goalId:g.id,sourceKey:sourceKey('goal-project',g.id||g.text)});showToast('Linked project ready.');open('project');return p},{disabled:!g});
      add('planner','Open Planner',()=>open('planner'));add('progress','See Progress',()=>open('progress'));return actions;
    }
    if(tool==='language'){
      const x=languageData(),target=x?.targetCode||localStorage.getItem('scholark_v93_target')||'';
      add('arki','Practise with ARKI',()=>promptArki('Practise this language lesson with me interactively. Correct me, keep the conversation going and adapt the difficulty. Lesson:\n'+clean($('.v93-results')?.innerText).slice(0,9000)),{primary:true,disabled:!x});
      add('cards','Vocabulary → Flashcards',()=>{const items=(x?.result?.vocabulary||[]).map(v=>({front:v.term,back:v.translation}));const n=core()?.actions?.addFlashcards?.((window.__SCHOLARK_I18N__?.languageName?.(target)||target)+' vocabulary',items)||0;showToast(n+' vocabulary cards added.');open('flashcards')},{disabled:!x?.result?.vocabulary?.length});
      add('plan','Schedule practice',()=>addPlan({text:'Language practice · '+(window.__SCHOLARK_I18N__?.languageName?.(target)||target||'Language'),type:'study',subject:'Language Learner',date:today(),duration:25,priority:'medium',sourceKey:'r174:language:'+target+':'+today()}),{disabled:!target});
      add('focus','Focus practice',()=>prepareFocus({task:'Language practice · '+(window.__SCHOLARK_I18N__?.languageName?.(target)||target||'Language'),duration:25,autoComplete:false}),{disabled:!target});return actions;
    }
    if(tool==='files'){
      const x=filesData(),text=x.output||clean(x.state?.text).slice(0,10000);
      add('arki','Continue in ARKI',()=>promptArki('Use this Files & Notes material as context and help me decide what to do next:\n\n'+text),{primary:true,disabled:!text});
      add('tutor','Learn with AI Tutor',()=>promptTutor('Teach me the important ideas in this Files & Notes material. Explain them clearly and check my understanding:\n\n'+text),{disabled:!text});
      add('cards','Create flashcards',async()=>{const n=await generateCards('Files & Notes',[],text);showToast(n+' flashcards added.');open('flashcards')},{disabled:!text});
      add('plan','Plan review',()=>addPlan({text:'Review Files & Notes material',type:'study',subject:(x.state?.files||[]).map(f=>f.name).slice(0,2).join(' · ')||'Files & Notes',date:today(),duration:30,priority:'medium',sourceKey:sourceKey('files-plan',text.slice(0,800))}),{disabled:!text});return actions;
    }
    if(tool==='project'){
      const p=activeProject();
      add('plan','Plan project work',()=>addPlan({text:'Work on · '+p.title,type:'study',subject:p.subject||p.title,date:today(),duration:45,priority:'medium',goalId:p.goalId||'',sourceKey:sourceKey('project-plan',p.id||p.title)}),{primary:true,disabled:!p});
      add('goal','Make it a Goal',()=>addGoal({text:p.title,category:'learning',sourceKey:sourceKey('project-goal',p.id||p.title)}),{disabled:!p});
      add('arki','Plan with ARKI',()=>promptArki('Help me plan this SCHOLARK project. Give me the clearest next milestone and concrete next actions. Project:\n'+safeJson(p)),{disabled:!p});
      add('focus','Focus project',()=>prepareFocus({task:'Work on · '+p.title,duration:45,autoComplete:false}),{disabled:!p});return actions;
    }
    if(tool==='schools'){
      const x=schoolData(),names=(x.compared?.length?x.compared:x.results||[]).slice(0,4).map(z=>z.name).filter(Boolean),school=names[0]||clean($('#v50-name')?.value);
      add('study','Send to Study Ahead',()=>handoff('study',{field:x.study||'',country:x.country||'',targetSchool:school||'',context:names.length?'I am comparing these schools: '+names.join(', '):''}),{primary:true});
      add('arki','Compare with ARKI',()=>promptArki('Help me compare these school options using my SCHOLARK goals and learning level. Country: '+(x.country||'')+'. Study interest: '+(x.study||'')+'. Schools: '+(names.join(', ')||'Use the visible school results in my workspace context.')));
      add('goal','Create school goal',()=>addGoal({text:'Choose my next school / study path'+(x.country?' in '+x.country:''),category:'school',sourceKey:sourceKey('school-goal',(x.country||'')+(x.study||''))}));
      add('project','Save comparison project',()=>{core()?.actions?.createProject?.({title:'School comparison'+(x.country?' · '+x.country:''),subject:x.study||'Education',notes:names.join('\n'),sourceKey:sourceKey('school-project',(x.country||'')+names.join('|'))});showToast('School comparison saved to My Projects.');open('project')});return actions;
    }
    if(tool==='study'){
      const x=studyData();
      add('planner','Roadmap → Planner',()=>{const b=$('[data-v83="planner"]');if(b)b.click();else if(x?.result?.roadmap?.[0]?.actions?.[0])addPlan({text:clean(x.result.roadmap[0].actions[0]),type:'study',subject:x.field||'Study Ahead',date:today(),duration:45,priority:'high',sourceKey:sourceKey('study-plan',x.field||'study')})},{primary:true,disabled:!x});
      add('tutor','Start with AI Tutor',()=>{const b=$('[data-v83="tutor"]');if(b)b.click();else promptTutor('Teach me the foundations I need before studying '+(x?.field||'this field')+'.')},{disabled:!x});
      add('goal','Turn into Goal',()=>{const b=$('[data-v83="goal"]');if(b)b.click();else if(x)addGoal({text:'Prepare for '+x.field,category:'school',sourceKey:sourceKey('study-goal',x.field)})},{disabled:!x});
      add('schools','Compare schools',()=>handoff('schools',{country:x?.country||'',study:x?.field||'',name:x?.targetSchool||''}),{disabled:!x});return actions;
    }
    return actions;
  }

  async function runAction(id,button){
    const a=activeActions.get(id);if(!a||a.disabled)return;
    button.disabled=true;const old=button.textContent;button.textContent='Working…';
    try{await a.run()}catch(e){console.warn('[SCHOLARK] connected action',id,e);showToast(clean(e?.message||e)||'That connection could not finish.','warn')}
    finally{if(button.isConnected){button.disabled=!!a.disabled;button.textContent=old}setTimeout(()=>refresh(true),80)}
  }
  function barSignature(tool,actions){
    const s=core()?.compute?.()||{};return [tool,actions.map(x=>x.id+':'+x.disabled).join('|'),s.planner?.active?.length||0,s.mastery?.weak?.length||0,s.flashcards?.due?.length||0,s.assignments?.active?.length||0,s.goals?.active?.length||0].join('~')
  }
  function refresh(force=false){
    cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
      const tool=route();if(!ROUTES.has(tool)){document.querySelectorAll('.v114-connect').forEach(x=>x.remove());return}
      $$('.v108-context').forEach(x=>x.remove());
      $$('.v114-connect').forEach(x=>{if(x.dataset.v114Route!==tool)x.remove()});
      const root=rootFor(tool);if(!root)return;
      const actions=actionsFor(tool).slice(0,4),sig=barSignature(tool,actions),existing=$('.v114-connect',root);
      if(!force&&existing&&existing.dataset.v114Signature===sig)return;
      activeActions=new Map(actions.map(x=>[x.id,x]));
      const bar=existing||document.createElement('section');bar.className='v114-connect';bar.dataset.v114Route=tool;bar.dataset.v114Signature=sig;
      bar.innerHTML='<div class="v114-copy"><small>SCHOLARK · CONNECTED FLOW</small><b>Continue without starting over.</b><span>Your context can move with you.</span></div><div class="v114-actions">'+actions.map((a,i)=>'<button type="button" data-v114-action="'+esc(a.id)+'" class="'+(a.primary||i===0?'primary':'')+'" '+(a.disabled?'disabled':'')+'>'+esc(a.label)+'</button>').join('')+'</div>';
      if(!existing){const anchor=$('.v111-live',root);if(anchor)anchor.insertAdjacentElement('afterend',bar);else root.prepend(bar)}
      $$('[data-v114-action]',bar).forEach(b=>b.onclick=()=>runAction(b.dataset.v114Action,b));
      window.__SCHOLARK_I18N__?.apply?.(bar);setTimeout(()=>window.__SCHOLARK_I18N__?.translateMissing?.(),80);
      if(!readHandoff())hideTransition();consume();
    })
  }

  const observer=new MutationObserver(muts=>{
    if(!document.body.classList.contains('v51-workspace')&&!$('#v50-school.open'))return;
    if(!muts.some(m=>m.addedNodes.length||m.removedNodes.length))return;
    clearTimeout(mutationTimer);mutationTimer=setTimeout(()=>refresh(false),150)
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('hashchange',()=>{if(readHandoff())showTransition(route());setTimeout(()=>refresh(true),55);scheduleConsume(65)});
  addEventListener('scholark-workspace-change',()=>setTimeout(()=>refresh(false),80));
  addEventListener('scholark-runtime-ready',()=>setTimeout(()=>{refresh(true);scheduleConsume(60)},70));
  addEventListener('scholark-language-ready',()=>setTimeout(()=>refresh(true),40));
  addEventListener('scholark:focus-complete',()=>setTimeout(()=>{refresh(true);open('progress')},220));
  setTimeout(()=>refresh(true),40);setTimeout(()=>refresh(true),220);

  function verify(){
    const tool=route(),workspace=ROUTES.has(tool),row=readHandoff(),bar=rootFor(tool)?.querySelector?.('.v114-connect');
    const stale=!!row&&Date.now()>Number(row.expiresAt||0),duplicates=$$('.v114-connect').filter(x=>x.dataset.v114Route===tool).length;
    const actionCount=bar?.querySelectorAll?.('[data-v114-action]').length||0;
    return {ok:!workspace||!!core()&&!!bar&&actionCount>=1&&actionCount<=4&&!stale&&duplicates<=1,release:'r175',tool,workspace,bar:!!bar,actionCount,staleHandoff:stale,duplicateBars:duplicates,pendingHandoff:row?{from:row.from,to:row.to,age:Date.now()-row.at}:null};
  }
  function selftest(){
    const expected=['dashboard','ai','tutor','education','planner','focus','flashcards','assignments','progress','goal','language','files','project','schools','study'];
    const missing=expected.filter(x=>!ROUTES.has(x)),coreReady=typeof core()?.actions?.prepareFocus==='function',runtimeReady=typeof window.__SCHOLARK_RUNTIME__?.ensure==='function';
    return {ok:ROUTES.size===expected.length&&!missing.length&&coreReady&&runtimeReady,routes:ROUTES.size,missing,coreReady,runtimeReady,lazyFeatureLoading:true,readOnly:true};
  }
  window.__SCHOLARK_V114_ORCHESTRATOR__={version:'20260920-r175',handoff,consume,refresh:()=>refresh(true),verify,selftest,actionsFor:(tool)=>actionsFor(tool).map(({id,label,disabled,primary})=>({id,label,disabled,primary}))};
})();