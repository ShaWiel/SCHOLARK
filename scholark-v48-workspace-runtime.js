(() => {
  if (window.__SCHOLARK_V48_WORKSPACE_RUNTIME__) return;
  window.__SCHOLARK_V48_WORKSPACE_RUNTIME__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const route=()=>String(location.hash||'').toLowerCase();
  const workspaceRoute=()=>/dashboard|studio|presentation|webpage|document|report|poster|graphic|social|tutor|planner|progress|goal|project|education|book|schools|study/.test(route());
  const dashboardRoute=()=>route()==='#dashboard';

  const LEVELS=[
    ['young','🧸','Young learner','Playful foundations, language and number sense'],
    ['primary','📚','Primary school','Math, language, exploration and smart practice'],
    ['secondary','🎒','VOJ & VOS','Mastery, planning, study space and challenging subjects'],
    ['student','🎓','Student','Research, reports, presentations and study planning'],
    ['adult','💼','Adult','Digital skills, work skills and practical help']
  ];

  const style=document.createElement('style');
  style.id='scholark-v48-workspace-style';
  style.textContent=`
    body.v48-workspace #v29-home-layer,body.v48-workspace #v28-home{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
    body.v48-workspace #v46-workspace-dashboard{display:none!important;visibility:hidden!important;pointer-events:none!important}
    body.v48-workspace #v41-workspace-home,body.v48-workspace #v40-workspace-home,body.v48-workspace #v36-shell-home,body.v48-workspace #v26-sidebar-toggle,body.v48-workspace #v41-sidebar-toggle{display:none!important}
    body.v48-workspace #v41-sidebar-pro,body.v48-workspace #v40-sidebar-pro,body.v48-workspace #v37-sidebar-pro{display:none!important}
    #v48-sidebar{position:fixed;z-index:2147482200;left:0;top:0;bottom:0;width:258px;background:#151821;color:#fff;padding:18px 13px 16px;box-sizing:border-box;overflow:auto;box-shadow:18px 0 55px rgba(20,17,48,.10)}
    #v48-sidebar[hidden]{display:none!important}.v48-brand{display:flex;align-items:center;gap:10px;padding:5px 9px 18px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:12px}.v48-logo{width:36px;height:36px;border-radius:12px;background:#c9ff6a;color:#151821;display:grid;place-items:center;font:1000 16px Inter}.v48-brand b{font:950 15px Inter;letter-spacing:-.02em}.v48-brand span{display:block;font:750 8px Inter;color:#8f8b98;margin-top:3px;letter-spacing:.08em}
    .v48-nav-title{padding:10px 10px 6px;font:900 7.5px/1 Inter;letter-spacing:.15em;color:#767281}.v48-nav{width:100%;border:0;background:transparent;color:#d8d5df;border-radius:11px;padding:10px 10px;margin:2px 0;display:flex;align-items:center;gap:10px;text-align:left;cursor:pointer;font:800 10.5px/1.2 Inter}.v48-nav:hover,.v48-nav.active{background:rgba(201,255,106,.11);color:#fff}.v48-nav.active{box-shadow:inset 3px 0 #c9ff6a}.v48-nav i{width:22px;height:22px;border-radius:8px;background:rgba(255,255,255,.06);display:grid;place-items:center;font-style:normal;font-size:11px}.v48-nav.active i{background:#c9ff6a;color:#151821}.v48-nav em{margin-left:auto;font:900 7px Inter;background:#c9ff6a;color:#151821;padding:4px 5px;border-radius:99px;font-style:normal}.v48-quality{margin-top:15px;padding:12px;border-radius:14px;background:linear-gradient(135deg,#28243f,#181a22);border:1px solid rgba(201,255,106,.16)}.v48-quality b{display:block;font:900 9px Inter;color:#c9ff6a}.v48-quality span{font:650 8px/1.4 Inter;color:#aaa6b2}
    #v48-return-home{position:fixed;z-index:2147483300;top:18px;right:28px;border:0;border-radius:14px;background:#17191f;color:#fff;padding:11px 15px;box-shadow:0 12px 34px rgba(0,0,0,.17);font:900 10px Inter;cursor:pointer;display:flex;align-items:center;gap:7px}#v48-return-home:hover{transform:translateY(-1px)}#v48-return-home span{color:#c9ff6a}#v48-return-home[hidden]{display:none!important}
    #v48-dashboard{position:fixed;z-index:2147481200;left:258px;top:0;right:0;bottom:0;overflow:auto;background:#f4f3ef;color:#17191f;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}#v48-dashboard[hidden]{display:none!important}.v48-shell{max-width:1450px;margin:0 auto;padding:34px 34px 80px}.v48-level-label{font:900 8px/1 Inter;letter-spacing:.14em;color:#716d7a;margin:0 0 8px}.v48-levels{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:0 130px 26px 0}.v48-level{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:17px;padding:11px 10px;text-align:left;cursor:pointer;min-height:76px;transition:.2s}.v48-level:hover{transform:translateY(-2px)}.v48-level.active{background:#17191f;color:#fff;border-color:#17191f;box-shadow:0 14px 35px rgba(23,25,31,.15)}.v48-level .ico{font-size:16px}.v48-level b{display:block;font:900 10px Inter;margin:7px 0 3px}.v48-level small{display:block;font:600 7.5px/1.35 Inter;color:#817d87}.v48-level.active small{color:#bcb8c5}.v48-level.active .ico{filter:none}
    .v48-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:24px}.v48-head .eyebrow{display:block;color:#6d5dfc;font:950 9px/1 Inter;letter-spacing:.15em;margin-bottom:8px}.v48-head h1{font:950 clamp(36px,5vw,60px)/.94 Inter;margin:0;letter-spacing:-.052em}.v48-head p{max-width:720px;color:#706c77;font:600 12px/1.55 Inter;margin:10px 0 0}.v48-max{border-radius:999px;background:#17191f;color:#c9ff6a;padding:9px 12px;font:900 8.5px Inter;white-space:nowrap}
    .v48-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.v48-card{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:22px;padding:19px;min-height:165px;text-align:left;cursor:pointer;box-shadow:0 17px 50px rgba(31,27,63,.045);transition:.2s}.v48-card:hover{transform:translateY(-3px);box-shadow:0 23px 65px rgba(31,27,63,.09)}.v48-card.primary{grid-column:span 2;background:linear-gradient(145deg,#17191f,#30275d);color:#fff;border-color:#17191f}.v48-card .icon{width:37px;height:37px;border-radius:12px;background:#eeecff;color:#5c4de0;display:grid;place-items:center;font:950 14px Inter}.v48-card.primary .icon{background:#c9ff6a;color:#17191f}.v48-card h3{font:950 20px/1 Inter;margin:16px 0 7px;letter-spacing:-.03em}.v48-card p{font:600 10px/1.48 Inter;color:#77727d;margin:0}.v48-card.primary p{color:#cac6d2}.v48-card b{display:inline-block;margin-top:16px;font:900 8.5px Inter;color:#6d5dfc}.v48-card.primary b{color:#c9ff6a}
    .v48-native-status{position:fixed;z-index:2147482190;left:278px;bottom:18px;display:none;border-radius:999px;background:#17191f;color:#fff;padding:9px 12px;font:800 8.5px Inter;box-shadow:0 12px 30px rgba(0,0,0,.18)}.v48-native-status.show{display:block}.v48-native-status b{color:#c9ff6a}
    @media(max-width:1050px){#v48-sidebar{width:220px}#v48-dashboard{left:220px}.v48-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v48-card.primary{grid-column:span 2}.v48-levels{grid-template-columns:repeat(3,1fr);margin-right:0}}
    @media(max-width:720px){#v48-sidebar{width:74px;padding:14px 8px}.v48-brand b,.v48-brand span,.v48-nav span,.v48-nav-title,.v48-nav em,.v48-quality{display:none}.v48-brand{justify-content:center;padding-left:0;padding-right:0}.v48-nav{justify-content:center;padding:10px}.v48-nav i{width:30px;height:30px}#v48-dashboard{left:74px}.v48-shell{padding:72px 13px 60px}.v48-levels{grid-template-columns:1fr 1fr;margin-right:0}.v48-grid{grid-template-columns:1fr}.v48-card.primary{grid-column:auto}#v48-return-home{top:12px;right:12px}.v48-native-status{left:86px}}
  `;
  document.head.appendChild(style);

  const toolDefs=[
    ['dashboard','⌂','Dashboard'],['studio','✦','Studio AI'],['tutor','AI','AI Tutor'],['education','◎','Education & Learning'],['planner','▦','Planner'],['progress','↗','Progress'],['goal','◉','Goals'],['project','▧','My Projects']
  ];
  const futureDefs=[['schools','⌖','Schools Near Me','PRO'],['study','🚀','Study Ahead','PRO'],['book','📚','Book Studio','PRO']];
  const aliases={
    tutor:['ai tutor','tutor ai','tutor'],education:['education & learning','educatie & leren','onderwijs & leren','education'],planner:['planner','planer'],progress:['progress','voortgang'],goal:['goals','doelen','goal'],project:['my projects','mijn projecten','projects','projecten']
  };
  const creatorAliases={presentation:['presentation','presentations','presentatie','presentaties'],webpage:['webpage','web page','website','webpagina'],document:['report','reports','document','documents','verslag','verslagen'],social:['social','sociaal'],graphic:['poster','designer','graphic','graphics','grafisch']};

  let sidebar=null,dashboard=null,homeBtn=null,statusEl=null;
  let nativeGenerateBusy=false;

  function levelId(){return localStorage.getItem('scholark_learning_level')||'secondary';}
  function levelInfo(){return LEVELS.find(x=>x[0]===levelId())||LEVELS[2];}
  function setLevel(id){
    if(!LEVELS.some(x=>x[0]===id))id='secondary';
    localStorage.setItem('scholark_learning_level',id);
    localStorage.setItem('scholark_ai_audience_level',id);
    renderLevels();applyMaxQuality();
    window.dispatchEvent(new CustomEvent('scholark-level-change',{detail:{id,label:levelInfo()[2],description:levelInfo()[3]}}));
  }

  function applyMaxQuality(){
    localStorage.setItem('scholark_ai_quality','highest');
    localStorage.setItem('scholark_default_ai_quality','highest');
    localStorage.setItem('scholark_workspace_quality','highest');
    const q=$('#v41-quality');if(q&&[...q.options].some(o=>o.value==='highest')){q.value='highest';q.dispatchEvent(new Event('change',{bubbles:true}));}
    const depth=$('#v45-depth');if(depth&&[...depth.options].some(o=>o.value==='expert'))depth.value='expert';
    ['v45-strict','v45-research','v45-factcheck','v45-visuals','v45-autopolish','v41-citations','v41-sources'].forEach(id=>{const el=$('#'+id);if(el&&'checked'in el)el.checked=true;});
    const audience=$('#v41-audience');if(audience&&!audience.value)audience.value=levelInfo()[2];
  }

  function buildChrome(){
    if(!sidebar){
      sidebar=document.createElement('aside');sidebar.id='v48-sidebar';sidebar.innerHTML=`<div class="v48-brand"><div class="v48-logo">S</div><div><b>SCHOLARK</b><span>WORKSPACE</span></div></div><div class="v48-nav-title">WORKSPACE</div>${toolDefs.map(([id,ic,label])=>`<button class="v48-nav" data-v48-tool="${id}"><i>${ic}</i><span>${label}</span></button>`).join('')}<div class="v48-nav-title">FUTURE & PRO</div>${futureDefs.map(([id,ic,label,b])=>`<button class="v48-nav" data-v48-tool="${id}"><i>${ic}</i><span>${label}</span><em>${b}</em></button>`).join('')}<div class="v48-quality"><b>AI QUALITY · MAX</b><span>Highest available quality, expert depth, research, fact-checking and final polish are forced on workspace AI flows.</span></div>`;document.body.appendChild(sidebar);$$('[data-v48-tool]',sidebar).forEach(b=>b.onclick=()=>openTool(b.dataset.v48Tool));
    }
    if(!homeBtn){homeBtn=document.createElement('button');homeBtn.id='v48-return-home';homeBtn.innerHTML='<span>⌂</span> Return to homepage';homeBtn.onclick=goHome;document.body.appendChild(homeBtn);}
    if(!statusEl){statusEl=document.createElement('div');statusEl.className='v48-native-status';document.body.appendChild(statusEl);}
    if(!dashboard){
      dashboard=document.createElement('main');dashboard.id='v48-dashboard';dashboard.innerHTML=`<div class="v48-shell"><div class="v48-level-label">CHOOSE HOW SCHOLARK SHOULD WORK & TEACH</div><div class="v48-levels"></div><div class="v48-head"><div><span class="eyebrow">SCHOLARK WORKSPACE</span><h1>Your learning & creation workspace.</h1><p>Open the tool you need. Your selected level changes how SCHOLARK should explain, structure and challenge you, while every AI workflow uses the highest available quality.</p></div><span class="v48-max">AI QUALITY · MAX</span></div><div class="v48-grid"><button class="v48-card primary" data-v48-tool="studio"><span class="icon">✦</span><h3>Studio AI</h3><p>Create presentations, webpages, documents, social content, graphics and books from a structured brief.</p><b>OPEN STUDIO →</b></button><button class="v48-card" data-v48-tool="tutor"><span class="icon">AI</span><h3>AI Tutor</h3><p>Ask, learn, practice and get explanations adapted to your selected level.</p><b>OPEN TUTOR →</b></button><button class="v48-card" data-v48-tool="education"><span class="icon">◎</span><h3>Education & Learning</h3><p>Diagnostics, learning paths, mastery and study support in one place.</p><b>OPEN LEARNING →</b></button><button class="v48-card" data-v48-tool="planner"><span class="icon">▦</span><h3>Planner</h3><p>Organize goals, study sessions, deadlines and what to work on next.</p><b>OPEN PLANNER →</b></button><button class="v48-card" data-v48-tool="progress"><span class="icon">↗</span><h3>Progress</h3><p>See what is improving, what is weak and where to focus next.</p><b>VIEW PROGRESS →</b></button><button class="v48-card" data-v48-tool="goal"><span class="icon">◉</span><h3>Goals</h3><p>Set learning, school and creation goals and connect them to your plan.</p><b>OPEN GOALS →</b></button><button class="v48-card" data-v48-tool="project"><span class="icon">▧</span><h3>My Projects</h3><p>Return to saved Studio work, documents, research and ongoing projects.</p><b>OPEN PROJECTS →</b></button><button class="v48-card" data-v48-tool="schools"><span class="icon">⌖</span><h3>Schools Near Me</h3><p>Use your location to find nearby education options.</p><b>FIND SCHOOLS →</b></button></div></div>`;document.body.appendChild(dashboard);$$('[data-v48-tool]',dashboard).forEach(b=>b.onclick=()=>openTool(b.dataset.v48Tool));
    }
    renderLevels();
  }

  function renderLevels(){
    if(!dashboard)return;const wrap=$('.v48-levels',dashboard);if(!wrap)return;const selected=levelId();wrap.innerHTML=LEVELS.map(([id,ic,label,desc])=>`<button class="v48-level ${id===selected?'active':''}" data-level="${id}"><span class="ico">${ic}</span><b>${label}</b><small>${desc}</small></button>`).join('');$$('[data-level]',wrap).forEach(b=>b.onclick=()=>setLevel(b.dataset.level));
  }

  function showStatus(message){if(!statusEl)return;statusEl.innerHTML=message;statusEl.classList.add('show');clearTimeout(window.__v48status);window.__v48status=setTimeout(()=>statusEl.classList.remove('show'),2600);}

  function closeTransient(){
    document.body.classList.remove('v41-studio-open','v41-generating');
    const studio=$('#v41-studio-workspace');if(studio){studio.hidden=true;studio.removeAttribute('aria-hidden');}
    $('#sv24-overlay')?.classList.remove('open');
    $$('.v25-dialog.open').forEach(d=>d.classList.remove('open'));
  }

  function restoreNativeHosts(){
    $$('[data-v46-retired-public-home="1"]').forEach(el=>{delete el.dataset.v46RetiredPublicHome;el.hidden=false;el.removeAttribute('aria-hidden');['display','visibility','opacity','pointer-events'].forEach(p=>el.style.removeProperty(p));});
    $$('[data-v30-legacy-home="1"]').forEach(el=>{delete el.dataset.v30LegacyHome;el.hidden=false;['display','visibility','opacity','pointer-events'].forEach(p=>el.style.removeProperty(p));});
  }

  function setHash(h){const next='#'+h.replace(/^#/,'');if(location.hash===next){window.dispatchEvent(new HashChangeEvent('hashchange'));return;}history.pushState(null,'',location.pathname+location.search+next);window.dispatchEvent(new HashChangeEvent('hashchange'));}

  function nativeClickable(aliasesList){
    const bad=el=>el.closest('#v48-sidebar,#v48-dashboard,#v48-return-home,#v29-home-layer,#v41-studio-workspace,#sv24-overlay,.v25-dialog');
    const arr=$$('button,a,[role="button"],[tabindex]').filter(el=>!bad(el)&&text(el).length>0&&text(el).length<90);
    return arr.map(el=>({el,t:lower(el),r:el.getBoundingClientRect()})).filter(o=>aliasesList.some(a=>o.t===a||o.t===a+'s'||o.t.startsWith(a+' '))).sort((a,b)=>{const ae=aliasesList.includes(a.t)?0:1,be=aliasesList.includes(b.t)?0:1;const av=a.r.width>0&&a.r.height>0?0:1,bv=b.r.width>0&&b.r.height>0?0:1;return ae-be||av-bv||((['BUTTON','A'].includes(a.el.tagName)?0:1)-(['BUTTON','A'].includes(b.el.tagName)?0:1));})[0]?.el||null;
  }

  function openNativeArea(id){
    restoreNativeHosts();const target=nativeClickable(aliases[id]||[id]);if(!target){showStatus(`<b>${id.toUpperCase()}</b> · native control not found yet`);return false;}try{target.click();}catch{return false}return true;
  }

  function openStudio(mode){
    restoreNativeHosts();setHash(mode&&mode!=='studio'?'studio-'+mode:'studio');
    const root=$('#v41-studio-workspace');if(root){root.hidden=false;document.body.classList.add('v41-studio-open');if(mode&&mode!=='studio')setTimeout(()=>$(`.v41-mode[data-mode="${mode}"]`,root)?.click(),60);}
    applyMaxQuality();
  }

  function openProTool(id){
    restoreNativeHosts();const trigger=$(`[data-tool="${id}"]`);if(trigger){try{trigger.click();setHash(id);return true}catch{}}
    showStatus(`<b>${id.toUpperCase()}</b> · tool handler unavailable`);return false;
  }

  function openTool(id){
    buildChrome();applyMaxQuality();
    if(id==='dashboard'){closeTransient();setHash('dashboard');sync();return;}
    if(id==='studio'){openStudio();syncNav();return;}
    if(id==='schools'||id==='study'||id==='book'){openProTool(id);syncNav();return;}
    closeTransient();const ok=openNativeArea(id);setHash(id);dashboard.hidden=true;syncNav();if(!ok)setTimeout(()=>openNativeArea(id),220);
  }

  function goHome(){
    closeTransient();document.body.classList.remove('v48-workspace','v46-workspace','v46-dashboard','v41-home','v40-public-home','v31-public-home');
    if(sidebar)sidebar.hidden=true;if(dashboard)dashboard.hidden=true;if(homeBtn)homeBtn.hidden=true;
    history.pushState(null,'',location.pathname+location.search);window.dispatchEvent(new HashChangeEvent('hashchange'));
    const home=$('#v29-home-layer');if(home){home.hidden=false;home.removeAttribute('aria-hidden');home.style.removeProperty('display');home.style.removeProperty('visibility');home.scrollTop=0;}
    scrollTo({top:0,behavior:'instant'});
  }

  function syncNav(){
    if(!sidebar)return;const h=route();let current='dashboard';if(h.includes('studio')||h.includes('presentation')||h.includes('webpage')||h.includes('document')||h.includes('report')||h.includes('graphic')||h.includes('social'))current='studio';else if(h.includes('schools'))current='schools';else if(h.includes('study'))current='study';else if(h.includes('book'))current='book';else if(h.includes('tutor'))current='tutor';else if(h.includes('education'))current='education';else if(h.includes('planner'))current='planner';else if(h.includes('progress'))current='progress';else if(h.includes('goal'))current='goal';else if(h.includes('project'))current='project';$$('[data-v48-tool]',sidebar).forEach(b=>b.classList.toggle('active',b.dataset.v48Tool===current));
  }

  function sync(){
    buildChrome();applyMaxQuality();
    const active=workspaceRoute();document.body.classList.toggle('v48-workspace',active);
    sidebar.hidden=!active;homeBtn.hidden=!active;
    $('#v46-workspace-dashboard')?.setAttribute('hidden','');
    $('#v46-workspace-dashboard .v46-strip')?.remove();
    $('#v29-home-layer')?.toggleAttribute('hidden',active);
    $('#v28-home')?.setAttribute('hidden','');
    if(!active){dashboard.hidden=true;syncNav();return;}
    document.body.classList.remove('v46-public-home','v41-home','v40-public-home','v31-public-home','v42-home','v47-dashboard');
    if(dashboardRoute()){
      closeTransient();dashboard.hidden=false;
    }else{
      dashboard.hidden=true;restoreNativeHosts();
    }
    $$(`#v48-sidebar #v41-sidebar-pro,#v48-sidebar #v40-sidebar-pro,#v48-sidebar #v37-sidebar-pro`).forEach(x=>x.remove());
    syncNav();
  }

  function creatorMode(){
    let data=null;try{data=JSON.parse(localStorage.getItem('scholark_v24_intent')||'null')}catch{}const active=$('#sv24-overlay .sv24-mode.active')?.dataset.mode;return active||data?.mode||'presentation';
  }

  function creatorPrompt(){
    const p=$('#sv24-prompt');let value=p?.value.trim()||'';const level=levelInfo();const marker='SCHOLARK WORK/LEARNING LEVEL:';if(value&&!value.includes(marker))value+=`\n\n${marker} ${level[2]} — ${level[3]}.\nAI QUALITY: Use the highest available reasoning/writing/design quality. Research when facts are needed, fact-check claims, preserve prompt constraints, maximize clarity and do a final polish pass.`;if(p)p.value=value;return value;
  }

  function nativeCreatorTrigger(mode){return nativeClickable(creatorAliases[mode]||[mode]);}

  function visible(el){if(!el)return false;const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>15&&r.height>15&&s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0';}

  function fillNativeCreator(promptText,mode,attempt=0){
    const fields=$$('textarea,input[type="text"],input:not([type])').filter(el=>!el.closest('#v48-sidebar,#v48-dashboard,#v29-home-layer,#v41-studio-workspace,#sv24-overlay,.v25-dialog')&&visible(el));
    const target=fields.find(el=>/topic|onderwerp|prompt|beschrijf|describe|what|idea|title|subject/i.test((el.placeholder||'')+' '+(el.name||'')+' '+(el.getAttribute('aria-label')||'')))||fields[0];
    if(!target&&attempt<6){setTimeout(()=>fillNativeCreator(promptText,mode,attempt+1),220);return;}
    if(!target){nativeGenerateBusy=false;showStatus('<b>STUDIO AI</b> · creator editor opened, but prompt field was not detected');return;}
    target.value=promptText;target.dispatchEvent(new Event('input',{bubbles:true}));target.dispatchEvent(new Event('change',{bubbles:true}));
    const scope=target.closest('main,section,article,[role="dialog"],div')||document;
    const buttons=$$('button,a,[role="button"]',scope).filter(el=>!el.closest('#v48-sidebar,#v48-dashboard,#v41-studio-workspace,#sv24-overlay')&&visible(el));
    const gen=buttons.find(el=>/^(generate|create|start|build|maak|genereer|creëer)(\s|$)|generate with ai|create with ai|start generation|maak met ai/i.test(text(el))&&!/cancel|annuleer|close|sluiten/i.test(text(el)));
    if(gen){setTimeout(()=>{try{gen.click();showStatus(`<b>STUDIO AI</b> · ${mode} generation started at MAX quality`)}catch{}nativeGenerateBusy=false;},120);}else{nativeGenerateBusy=false;showStatus('<b>STUDIO AI</b> · prompt filled in the native creator');}
  }

  function runNativeCreator(e){
    if(nativeGenerateBusy)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    applyMaxQuality();nativeGenerateBusy=true;const mode=creatorMode(),promptText=creatorPrompt();
    if(mode==='book'){nativeGenerateBusy=false;openProTool('book');setTimeout(()=>{const input=$('#v25-book .v25-input');if(input){input.value=promptText;input.dispatchEvent(new Event('input',{bubbles:true}));}},160);return;}
    restoreNativeHosts();const trigger=nativeCreatorTrigger(mode);
    if(!trigger){nativeGenerateBusy=false;const root=$('#v41-studio-workspace');if(root){root.hidden=false;document.body.classList.add('v41-studio-open');const s=$('#v41-status',root);if(s)s.textContent='Native creator engine not found. Studio stayed open instead of returning to Dashboard.';}showStatus('<b>STUDIO AI</b> · native creator engine not found');return;}
    $('#sv24-overlay')?.classList.remove('open');document.body.classList.remove('v41-generating');
    try{trigger.click();}catch{nativeGenerateBusy=false;return;}
    const dest=mode==='presentation'?'presentation':mode==='document'?'document':mode==='webpage'?'webpage':mode==='graphic'?'graphic':'social';setHash(dest);setTimeout(()=>fillNativeCreator(promptText,mode),300);
  }

  document.addEventListener('click',e=>{
    const gen=e.target.closest('.sv24-generate');if(gen){runNativeCreator(e);return;}
    const top=e.target.closest('#v41-studio-workspace .v41-generate');if(top){applyMaxQuality();const audience=$('#v41-audience');if(audience&&!audience.value)audience.value=levelInfo()[2];}
  },true);

  document.addEventListener('click',e=>{
    if(!workspaceRoute())return;const el=e.target.closest('button,a,[role="button"]');if(!el||el.closest('#v48-sidebar,#v48-dashboard,#v48-return-home'))return;if(/^dashboard$/i.test(text(el))){e.preventDefault();e.stopPropagation();setHash('dashboard');setTimeout(sync,0);}
  },true);

  addEventListener('hashchange',()=>setTimeout(sync,10));addEventListener('popstate',()=>setTimeout(sync,10));addEventListener('resize',()=>setTimeout(sync,30));
  new MutationObserver(()=>{clearTimeout(window.__v48sync);window.__v48sync=setTimeout(sync,90);}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});
  setInterval(()=>{if(workspaceRoute())sync();else applyMaxQuality();},700);
  setTimeout(sync,50);
})();