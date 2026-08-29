(() => {
  if (window.__SCHOLARK_V51_WORKSPACE_SHELL__) return;
  window.__SCHOLARK_V51_WORKSPACE_SHELL__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const route=()=>String(location.hash||'').toLowerCase();
  const workspaceRoute=()=>/dashboard|studio|tutor|education|planner|progress|goal|project|files|schools|study|book|presentation|webpage|document|report|graphic|social/.test(route());

  const LEVELS=[
    ['young','🧸','Young learner','Playful foundations, language and number sense'],
    ['primary','📚','Primary school','Math, language, exploration and smart practice'],
    ['secondary','🎒','VOJ & VOS','Mastery, planning, study space and challenging subjects'],
    ['student','🎓','Student','Research, reports, presentations and study planning'],
    ['adult','💼','Adult','Digital skills, work skills and practical help']
  ];
  const TOOLS=[
    ['dashboard','⌂','Dashboard'],['studio','✦','Studio AI'],['tutor','AI','AI Tutor'],['education','◎','Education & Learning'],['planner','▦','Planner'],['progress','↗','Progress'],['goal','◉','Goals'],['files','▣','Files & Notes'],['project','▧','My Projects']
  ];
  const PRO=[['schools','⌖','Schools Near Me','PRO'],['study','🚀','Study Ahead','PRO'],['book','📚','Book Studio','PRO']];
  const ALIASES={
    tutor:['ai tutor','tutor ai','tutor'],education:['education & learning','educatie & leren','onderwijs & leren','education'],planner:['planner'],progress:['progress','voortgang'],goal:['goals','doelen','goal'],project:['my projects','mijn projecten','projects','projecten']
  };

  const style=document.createElement('style');
  style.id='scholark-v51-style';
  style.textContent=`
    :root{--v51-side:258px}
    #v48-sidebar,#v48-dashboard,#v48-return-home,#v49-sidebar-toggle,#v41-sidebar-toggle,#v26-sidebar-toggle,#v41-workspace-home,#sv24-home,#sv24-launch{display:none!important;visibility:hidden!important;pointer-events:none!important}
    body:not(.v51-workspace) #v51-sidebar,body:not(.v51-workspace) #v51-side-toggle,body:not(.v51-workspace) #v51-home,body:not(.v51-workspace) #v51-main{display:none!important}
    body.v51-workspace #v29-home-layer,body.v51-workspace #v28-home{display:none!important;visibility:hidden!important;pointer-events:none!important}

    #v51-sidebar{position:fixed;z-index:2147483400;left:0;top:0;bottom:0;width:var(--v51-side);box-sizing:border-box;background:#151821;color:#fff;padding:18px 13px 16px;overflow:auto;box-shadow:18px 0 55px rgba(20,17,48,.10);transition:transform .24s ease,opacity .18s ease}
    #v51-sidebar *{box-sizing:border-box}.v51-brand{display:flex;align-items:center;gap:10px;padding:4px 9px 18px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:12px;min-height:54px}.v51-logo{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;overflow:hidden}.v51-logo img,.v51-logo svg,.v51-logo picture{display:block;max-width:100%;max-height:100%;width:auto;height:auto}.v51-brand-copy b{font:950 15px Inter,system-ui;letter-spacing:-.02em}.v51-brand-copy span{display:block;font:750 8px Inter,system-ui;color:#8f8b98;margin-top:3px;letter-spacing:.08em}.v51-section{padding:10px 10px 6px;font:900 7.5px/1 Inter;letter-spacing:.15em;color:#767281}.v51-nav{width:100%;border:0;background:transparent;color:#d8d5df;border-radius:11px;padding:10px;margin:2px 0;display:flex;align-items:center;gap:10px;text-align:left;cursor:pointer;font:800 10.5px/1.2 Inter}.v51-nav:hover,.v51-nav.active{background:rgba(201,255,106,.11);color:#fff}.v51-nav.active{box-shadow:inset 3px 0 #c9ff6a}.v51-nav i{width:24px;height:24px;border-radius:8px;background:rgba(255,255,255,.06);display:grid;place-items:center;font:900 10px Inter;font-style:normal}.v51-nav.active i{background:#c9ff6a;color:#151821}.v51-nav em{margin-left:auto;font:900 7px Inter;background:#c9ff6a;color:#151821;padding:4px 5px;border-radius:99px;font-style:normal}.v51-quality{margin-top:15px;padding:12px;border-radius:14px;background:linear-gradient(135deg,#28243f,#181a22);border:1px solid rgba(201,255,106,.16)}.v51-quality b{display:block;font:900 9px Inter;color:#c9ff6a}.v51-quality span{font:650 8px/1.4 Inter;color:#aaa6b2}
    #v51-side-toggle{position:fixed;z-index:2147483500;top:88px;left:calc(var(--v51-side) - 16px);width:34px;height:34px;border:1px solid rgba(255,255,255,.18);border-radius:11px;background:#17191f;color:#c9ff6a;box-shadow:0 10px 28px rgba(0,0,0,.22);cursor:pointer;font:950 20px/1 Inter;display:grid;place-items:center;transition:left .24s ease}
    #v51-home{position:fixed;z-index:2147483500;top:18px;right:28px;border:0;border-radius:14px;background:#17191f;color:#fff;padding:11px 15px;box-shadow:0 12px 34px rgba(0,0,0,.17);font:900 10px Inter;cursor:pointer}#v51-home b{color:#c9ff6a;margin-right:6px}
    body.v51-collapsed{--v51-side:0px}body.v51-collapsed #v51-sidebar{transform:translateX(-102%);opacity:0;visibility:hidden;pointer-events:none}body.v51-collapsed #v51-side-toggle{left:0;border-radius:0 11px 11px 0}

    #v51-main{position:fixed;z-index:2147482100;left:var(--v51-side);top:0;right:0;bottom:0;background:#f4f3ef;color:#17191f;overflow:auto;transition:left .24s ease;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .v51-page{display:none;min-height:100%;padding:34px;box-sizing:border-box}.v51-page.active{display:block}.v51-shell{max-width:1450px;margin:0 auto}.v51-level-label{font:900 8px Inter;letter-spacing:.14em;color:#716d7a;margin:0 0 8px}.v51-levels{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:0 130px 26px 0}.v51-level{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:17px;padding:11px 10px;text-align:left;cursor:pointer;min-height:76px}.v51-level.active{background:#17191f;color:#fff;border-color:#17191f}.v51-level b{display:block;font:900 10px Inter;margin:7px 0 3px}.v51-level small{display:block;font:600 7.5px/1.35 Inter;color:#817d87}.v51-level.active small{color:#bcb8c5}.v51-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:24px}.v51-head small{display:block;color:#6d5dfc;font:950 9px Inter;letter-spacing:.15em;margin-bottom:8px}.v51-head h1{font:950 clamp(36px,5vw,60px)/.94 Inter;margin:0;letter-spacing:-.052em}.v51-head p{max-width:760px;color:#706c77;font:600 12px/1.55 Inter;margin:10px 0 0}.v51-badge{border-radius:999px;background:#17191f;color:#c9ff6a;padding:9px 12px;font:900 8.5px Inter;white-space:nowrap}.v51-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.v51-card{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:22px;padding:19px;min-height:165px;text-align:left;cursor:pointer;box-shadow:0 17px 50px rgba(31,27,63,.045)}.v51-card.primary{grid-column:span 2;background:linear-gradient(145deg,#17191f,#30275d);color:#fff}.v51-card .icon{width:37px;height:37px;border-radius:12px;background:#eeecff;color:#5c4de0;display:grid;place-items:center;font:950 14px Inter}.v51-card.primary .icon{background:#c9ff6a;color:#17191f}.v51-card h3{font:950 20px/1 Inter;margin:16px 0 7px}.v51-card p{font:600 10px/1.48 Inter;color:#77727d;margin:0}.v51-card.primary p{color:#cac6d2}.v51-card b{display:inline-block;margin-top:16px;font:900 8.5px Inter;color:#6d5dfc}.v51-card.primary b{color:#c9ff6a}

    .v51-native-host{position:fixed!important;z-index:2147482150!important;left:var(--v51-side)!important;top:0!important;right:0!important;bottom:0!important;width:auto!important;height:auto!important;max-width:none!important;max-height:none!important;margin:0!important;transform:none!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;overflow:auto!important;background:#f4f3ef!important;transition:left .24s ease!important}.v51-native-host[hidden]{display:block!important}
    body.v51-native #v51-main{display:none!important}
    body.v51-studio #v51-main{display:none!important}body.v51-studio #v41-studio-workspace{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:fixed!important;z-index:2147482150!important;left:var(--v51-side)!important;top:0!important;right:0!important;bottom:0!important;width:auto!important;height:auto!important;max-width:none!important;transition:left .24s ease!important}
    body.v51-studio #v41-studio-workspace .v41-mode[data-mode="book"]{display:none!important}

    body.v51-pro #v51-main{display:none!important}
    body.v51-schools #v50-school{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:fixed!important;z-index:2147482150!important;left:var(--v51-side)!important;top:0!important;right:0!important;bottom:0!important;width:auto!important;height:auto!important;inset:auto 0 0 var(--v51-side)!important;background:#f4f3ef!important;backdrop-filter:none!important;padding:34px!important;overflow:auto!important;transition:left .24s ease!important;align-items:flex-start!important;justify-content:flex-start!important;box-sizing:border-box!important}
    body.v51-schools #v50-school .v50-box{width:min(1450px,100%)!important;max-width:1450px!important;min-height:calc(100vh - 68px)!important;max-height:none!important;margin:0 auto!important;border-radius:28px!important;box-shadow:0 18px 60px rgba(31,27,63,.07)!important;background:#fff!important}
    body.v51-schools #v50-school .v50-x{display:none!important}
    body.v51-study #v25-study,body.v51-book #v25-book{display:none!important;visibility:hidden!important;pointer-events:none!important}

    .v51-fallback{max-width:1180px;margin:0 auto;padding:34px}.v51-fallback-card{background:#fff;border:1px solid rgba(23,25,31,.1);border-radius:24px;padding:24px;box-shadow:0 18px 55px rgba(31,27,63,.05)}.v51-fallback-card h2{font:950 32px/1 Inter;margin:0 0 10px}.v51-fallback-card p{font:600 12px/1.55 Inter;color:#706c77}.v51-fallback-card textarea,.v51-fallback-card input{width:100%;box-sizing:border-box;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:14px;padding:13px;font:650 12px Inter;outline:0;margin-top:10px}.v51-fallback-card textarea{min-height:150px;resize:vertical}.v51-fallback-card button{border:0;border-radius:13px;background:#17191f;color:#fff;padding:12px 15px;font:900 10px Inter;margin-top:10px;cursor:pointer}.v51-fallback-card button span{color:#c9ff6a}.v51-fallback-list{display:grid;gap:8px;margin-top:14px}.v51-fallback-item{padding:12px;border-radius:14px;background:#f5f4f1;font:700 10px/1.45 Inter;color:#504c57}
    @media(max-width:1050px){body:not(.v51-collapsed){--v51-side:220px}.v51-grid{grid-template-columns:repeat(2,1fr)}.v51-card.primary{grid-column:span 2}.v51-levels{grid-template-columns:repeat(3,1fr);margin-right:0}}
    @media(max-width:720px){body:not(.v51-collapsed){--v51-side:74px}.v51-brand-copy,.v51-nav span,.v51-section,.v51-nav em,.v51-quality{display:none}.v51-brand{justify-content:center;padding-left:0;padding-right:0}.v51-nav{justify-content:center}.v51-nav i{width:32px;height:32px}.v51-page{padding:70px 13px 50px}.v51-levels{grid-template-columns:1fr 1fr}.v51-grid{grid-template-columns:1fr}.v51-card.primary{grid-column:auto}#v51-home{top:12px;right:12px}}
  `;
  document.head.appendChild(style);

  let side,main,home,toggle,nativeHost=null,nativeTimer=null;
  const state={active:'dashboard'};

  function levelId(){return localStorage.getItem('scholark_learning_level')||'secondary'}
  function setLevel(id){if(!LEVELS.some(x=>x[0]===id))id='secondary';localStorage.setItem('scholark_learning_level',id);localStorage.setItem('scholark_ai_audience_level',id);renderLevels();forceQuality()}
  function forceQuality(){localStorage.setItem('scholark_ai_quality','highest');localStorage.setItem('scholark_default_ai_quality','highest');localStorage.setItem('scholark_workspace_quality','highest');const q=$('#v41-quality');if(q&&[...q.options].some(o=>o.value==='highest'))q.value='highest';const d=$('#v45-depth');if(d&&[...d.options].some(o=>o.value==='expert'))d.value='expert';['v45-strict','v45-research','v45-factcheck','v45-visuals','v45-autopolish','v41-citations','v41-sources'].forEach(id=>{const e=$('#'+id);if(e&&'checked'in e)e.checked=true})}

  function officialLogoNode(){
    const bad=el=>el.closest?.('#v51-sidebar,#v48-sidebar,#v29-home-layer,#v41-studio-workspace');
    const direct=$$('img').find(img=>!bad(img)&&/scholark|logo/i.test((img.alt||'')+' '+(img.src||'')+' '+(img.className||'')));
    if(direct)return direct.cloneNode(true);
    const brands=$$('b,strong,span,div').filter(el=>!bad(el)&&/^scholark$/i.test(text(el)));
    for(const label of brands){let cur=label.parentElement;for(let i=0;cur&&cur!==document.body&&i<4;i++,cur=cur.parentElement){const mark=cur.querySelector('img,svg,picture');if(mark)return mark.cloneNode(true)}}
    return null;
  }
  function refreshLogo(){const host=$('.v51-logo',side);if(!host||host.dataset.ready)return;const mark=officialLogoNode();if(mark){host.innerHTML='';host.appendChild(mark);host.dataset.ready='1';return}host.innerHTML='<span style="font:950 11px Inter;color:#c9ff6a">SCHOLARK</span>';}

  function build(){
    if(side)return;
    side=document.createElement('aside');side.id='v51-sidebar';side.innerHTML=`<div class="v51-brand"><div class="v51-logo"></div><div class="v51-brand-copy"><b>SCHOLARK</b><span>WORKSPACE</span></div></div><div class="v51-section">WORKSPACE</div>${TOOLS.map(([id,ic,l])=>`<button class="v51-nav" data-v51-tool="${id}"><i>${ic}</i><span>${l}</span></button>`).join('')}<div class="v51-section">FUTURE & PRO</div>${PRO.map(([id,ic,l,b])=>`<button class="v51-nav" data-v51-tool="${id}"><i>${ic}</i><span>${l}</span><em>${b}</em></button>`).join('')}<div class="v51-quality"><b>AI QUALITY · MAX</b><span>Highest available quality, expert depth, research, source checking and final polish.</span></div>`;document.body.appendChild(side);
    toggle=document.createElement('button');toggle.id='v51-side-toggle';toggle.type='button';toggle.onclick=()=>setCollapsed(!document.body.classList.contains('v51-collapsed'));document.body.appendChild(toggle);
    home=document.createElement('button');home.id='v51-home';home.innerHTML='<b>⌂</b> Return to homepage';home.onclick=goHome;document.body.appendChild(home);
    main=document.createElement('main');main.id='v51-main';main.innerHTML=`<section class="v51-page" data-v51-page="dashboard"><div class="v51-shell"><div class="v51-level-label">CHOOSE HOW SCHOLARK SHOULD WORK & TEACH</div><div class="v51-levels"></div><div class="v51-head"><div><small>SCHOLARK WORKSPACE</small><h1>Your learning & creation workspace.</h1><p>Open the tool you need. Your selected level changes how SCHOLARK should explain, structure and challenge you, while every AI workflow uses the highest available quality.</p></div><span class="v51-badge">AI QUALITY · MAX</span></div><div class="v51-grid">${card('studio','✦','Studio AI','Create presentations, webpages, documents, social content and graphics from a structured brief.',true)}${card('tutor','AI','AI Tutor','Ask, learn, practice and get explanations adapted to your selected level.')}${card('education','◎','Education & Learning','Diagnostics, learning paths, mastery and study support in one place.')}${card('planner','▦','Planner','Organize goals, study sessions, deadlines and what to work on next.')}${card('progress','↗','Progress','See what is improving, what is weak and where to focus next.')}${card('goal','◉','Goals','Set learning, school and creation goals and connect them to your plan.')}${card('project','▧','My Projects','Return to saved Studio work, documents, research and ongoing projects.')}${card('schools','⌖','Schools Near Me','Find education options for the study you actually want.')}</div></div></section><section class="v51-page" data-v51-page="fallback"><div id="v51-fallback"></div></section>`;document.body.appendChild(main);
    $$('[data-v51-tool]',document).forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openTool(b.dataset.v51Tool)}));
    renderLevels();setCollapsed(localStorage.getItem('scholark_v51_collapsed')==='1',false);refreshLogo();
  }
  function card(id,ic,title,desc,primary=false){return `<button class="v51-card ${primary?'primary':''}" data-v51-tool="${id}"><span class="icon">${ic}</span><h3>${title}</h3><p>${desc}</p><b>OPEN ${title.toUpperCase()} →</b></button>`}
  function renderLevels(){if(!side)return;const host=$('.v51-levels',main);if(!host)return;host.innerHTML=LEVELS.map(([id,ic,l,d])=>`<button class="v51-level ${id===levelId()?'active':''}" data-level="${id}"><span>${ic}</span><b>${l}</b><small>${d}</small></button>`).join('');$$('[data-level]',host).forEach(b=>b.onclick=()=>setLevel(b.dataset.level))}
  function setCollapsed(on,save=true){document.body.classList.toggle('v51-collapsed',!!on);if(toggle){toggle.textContent=on?'›':'‹';toggle.title=on?'Open sidebar':'Close sidebar';toggle.setAttribute('aria-label',toggle.title)}if(save)localStorage.setItem('scholark_v51_collapsed',on?'1':'0')}

  function setRoute(id){history.replaceState(null,'',location.pathname+location.search+'#'+id)}
  function clearModes(){document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book');if(nativeHost){nativeHost.classList.remove('v51-native-host');nativeHost=null}clearInterval(nativeTimer);nativeTimer=null;$('#v41-studio-workspace')?.setAttribute('hidden','');$('#sv24-overlay')?.classList.remove('open');$('#v50-school')?.classList.remove('open');$('#v25-study')?.classList.remove('open');$('#v25-book')?.classList.remove('open')}
  function showPage(name){$$('.v51-page',main).forEach(p=>p.classList.toggle('active',p.dataset.v51Page===name));main.style.removeProperty('display')}
  function syncNav(id=state.active){$$('[data-v51-tool]',side).forEach(b=>b.classList.toggle('active',b.dataset.v51Tool===id))}

  function findLegacySidebar(){
    const labels=['dashboard','studio ai','ai tutor','education & learning','planner','progress','goals','my projects'];
    return $$('aside,nav,section,div').filter(el=>!el.closest('#v51-sidebar,#v48-sidebar,#v51-main,#v29-home-layer,#v41-studio-workspace,#v50-school,#v25-study,#v25-book')).map(el=>({el,h:labels.reduce((n,x)=>n+(lower(el).includes(x)?1:0),0),len:text(el).length,nodes:el.querySelectorAll('*').length,r:el.getBoundingClientRect()})).filter(o=>o.h>=5&&o.len<14000).sort((a,b)=>b.h-a.h||a.nodes-b.nodes||a.len-b.len)[0]?.el||null;
  }
  function legacyItem(sidebar,id){
    const aliases=ALIASES[id]||[id];
    const nodes=$$('button,a,[role="button"],[tabindex],div,span',sidebar).filter(el=>text(el).length>0&&text(el).length<90).map(el=>({el,t:lower(el),nodes:el.querySelectorAll('*').length,r:el.getBoundingClientRect()})).filter(o=>aliases.some(a=>o.t===a||o.t===a+'s'||o.t.startsWith(a+' '))).sort((a,b)=>{const ae=aliases.includes(a.t)?0:1,be=aliases.includes(b.t)?0:1;const at=['BUTTON','A'].includes(a.el.tagName)||a.el.getAttribute('role')==='button'?0:1,bt=['BUTTON','A'].includes(b.el.tagName)||b.el.getAttribute('role')==='button'?0:1;return ae-be||at-bt||a.nodes-b.nodes});
    const leaf=nodes[0]?.el;if(!leaf)return null;return leaf.closest('button,a,[role="button"],[tabindex]')||leaf;
  }
  function legacyContent(sidebar){
    let shell=sidebar;for(let i=0;i<4&&shell.parentElement&&shell.parentElement!==document.body;i++){const p=shell.parentElement,r=p.getBoundingClientRect();if(r.width>innerWidth*.55||p.querySelector('main,[role="main"]')){shell=p;break}shell=p}
    const siblings=shell.parentElement?[...shell.parentElement.children].filter(x=>x!==shell):[];
    let c=siblings.map(el=>({el,r:el.getBoundingClientRect(),txt:text(el).length})).filter(o=>o.r.width>320||o.el.matches('main,[role="main"]')||o.el.querySelector('main,[role="main"]')).sort((a,b)=>(b.r.width*b.r.height)-(a.r.width*a.r.height))[0]?.el;
    if(!c){const tagged=$$('[data-v30-legacy-home="1"],main,[role="main"]').filter(el=>!el.closest('#v51-main,#v29-home-layer,#v41-studio-workspace,#v50-school,#v25-study,#v25-book'));c=tagged.map(el=>({el,r:el.getBoundingClientRect()})).sort((a,b)=>(b.r.width*b.r.height)-(a.r.width*a.r.height))[0]?.el}
    return c||null;
  }
  function rescue(el){if(!el)return;delete el.dataset.v30LegacyHome;el.hidden=false;el.removeAttribute('aria-hidden');['display','visibility','opacity','pointer-events','transform','width','height','max-width','max-height','margin','margin-left'].forEach(p=>el.style.removeProperty(p));let p=el.parentElement,n=0;while(p&&p!==document.body&&n<3){p.hidden=false;p.removeAttribute('aria-hidden');['display','visibility','opacity','pointer-events'].forEach(x=>p.style.removeProperty(x));p=p.parentElement;n++}}
  function openNative(id){
    clearModes();forceQuality();const legacySide=findLegacySidebar();const item=legacySide&&legacyItem(legacySide,id);if(!legacySide||!item){showFallback(id);return}
    const before=legacyContent(legacySide);try{item.click()}catch{}setRoute(id);document.body.classList.add('v51-native');state.active=id;syncNav();let tries=0;nativeTimer=setInterval(()=>{tries++;const content=legacyContent(legacySide)||before;rescue(content);if(content){if(nativeHost&&nativeHost!==content)nativeHost.classList.remove('v51-native-host');nativeHost=content;content.classList.add('v51-native-host')}if(content&&tries>=8){clearInterval(nativeTimer);nativeTimer=null}else if(tries>=24){clearInterval(nativeTimer);nativeTimer=null;if(!nativeHost)showFallback(id)}},80)
  }

  function showFallback(id){clearModes();setRoute(id);state.active=id;syncNav();showPage('fallback');const host=$('#v51-fallback');const title={tutor:'AI Tutor',education:'Education & Learning',planner:'Planner',progress:'Progress',goal:'Goals',project:'My Projects'}[id]||id;let body='';
    if(id==='planner'){body=`<input id="v51-plan-input" placeholder="Add a study task or deadline"><button id="v51-plan-add">Add to planner</button><div class="v51-fallback-list" id="v51-plan-list"></div>`}
    else if(id==='goal'){body=`<input id="v51-goal-input" placeholder="Set a learning or school goal"><button id="v51-goal-add">Add goal</button><div class="v51-fallback-list" id="v51-goal-list"></div>`}
    else if(id==='progress'){body=`<div class="v51-fallback-list" id="v51-progress-list"></div>`}
    else if(id==='project'){body=`<div class="v51-fallback-list" id="v51-project-list"></div>`}
    else if(id==='education'){body=`<div class="v51-fallback-list"><div class="v51-fallback-item"><b>Diagnostics</b><br>Identify weak and strong areas before building a learning path.</div><div class="v51-fallback-item"><b>Personal learning path</b><br>Use your selected level (${esc(LEVELS.find(x=>x[0]===levelId())?.[2]||'VOJ & VOS')}) to adapt explanation and challenge.</div><div class="v51-fallback-item"><b>Spaced review</b><br>Keep mastered topics in review instead of restarting from zero.</div></div>`}
    else body=`<textarea id="v51-tutor-question" placeholder="Ask SCHOLARK anything you want to learn..."></textarea><button id="v51-tutor-send">Ask <span>SCHOLARK AI</span></button><div class="v51-fallback-list" id="v51-tutor-thread"><div class="v51-fallback-item">The native Tutor view could not be mounted. This rescue screen keeps your workspace usable while SCHOLARK reconnects to the original Tutor engine.</div></div>`;
    host.innerHTML=`<div class="v51-fallback"><div class="v51-fallback-card"><div class="v51-head"><div><small>SCHOLARK WORKSPACE</small><h2>${esc(title)}</h2><p>Workspace rescue view. SCHOLARK no longer sends you back to Dashboard when a legacy view is unavailable.</p></div><span class="v51-badge">AI QUALITY · MAX</span></div>${body}</div></div>`;wireFallback(id)
  }
  function readStore(k){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}}
  function writeStore(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function wireFallback(id){
    if(id==='planner'){const render=()=>{$('#v51-plan-list').innerHTML=readStore('scholark_v51_planner').map((x,i)=>`<button class="v51-fallback-item" data-i="${i}">□ ${esc(x)}</button>`).join('')||'<div class="v51-fallback-item">No planner items yet.</div>';$$('[data-i]',$('#v51-plan-list')).forEach(b=>b.onclick=()=>{const a=readStore('scholark_v51_planner');a.splice(+b.dataset.i,1);writeStore('scholark_v51_planner',a);render()})};$('#v51-plan-add').onclick=()=>{const i=$('#v51-plan-input'),v=i.value.trim();if(!v)return;const a=readStore('scholark_v51_planner');a.push(v);writeStore('scholark_v51_planner',a);i.value='';render()};render()}
    if(id==='goal'){const render=()=>{$('#v51-goal-list').innerHTML=readStore('scholark_v51_goals').map((x,i)=>`<button class="v51-fallback-item" data-i="${i}">◉ ${esc(x)}</button>`).join('')||'<div class="v51-fallback-item">No goals yet.</div>';$$('[data-i]',$('#v51-goal-list')).forEach(b=>b.onclick=()=>{const a=readStore('scholark_v51_goals');a.splice(+b.dataset.i,1);writeStore('scholark_v51_goals',a);render()})};$('#v51-goal-add').onclick=()=>{const i=$('#v51-goal-input'),v=i.value.trim();if(!v)return;const a=readStore('scholark_v51_goals');a.push(v);writeStore('scholark_v51_goals',a);i.value='';render()};render()}
    if(id==='progress'){const p=readStore('scholark_v51_planner'),g=readStore('scholark_v51_goals');$('#v51-progress-list').innerHTML=`<div class="v51-fallback-item"><b>${g.length}</b> active goals</div><div class="v51-fallback-item"><b>${p.length}</b> planned study actions</div><div class="v51-fallback-item">Native progress analytics will appear here when the original progress engine is available.</div>`}
    if(id==='project'){let arr=[];try{arr=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]')}catch{}if(!arr.length){try{const x=JSON.parse(localStorage.getItem('scholark_v45_last_project')||'null');if(x)arr=[x]}catch{}}$('#v51-project-list').innerHTML=arr.length?arr.slice(0,20).map(x=>`<div class="v51-fallback-item"><b>${esc(x.project||x.mode||'Studio project')}</b><br>${esc(x.rawPrompt||x.prompt||'Saved SCHOLARK creation')}</div>`).join(''):'<div class="v51-fallback-item">No saved Studio projects yet.</div>'}
  }

  function openStudio(){clearModes();forceQuality();state.active='studio';syncNav();setRoute('studio');const s=$('#v41-studio-workspace');if(s){s.hidden=false;s.removeAttribute('aria-hidden');document.body.classList.add('v51-studio','v41-studio-open');$$('.v41-mode[data-mode="book"]',s).forEach(x=>x.remove());return}showFallback('studio')}
  function clickExternalTool(tool){const c=$$(`[data-tool="${tool}"]`).filter(el=>!el.closest('#v51-sidebar,#v51-main'))[0];if(c){try{c.click();return true}catch{}}return false}
  function openPro(id){
    clearModes();forceQuality();state.active=id;syncNav();setRoute(id);document.body.classList.add('v51-pro','v51-'+id);
    if(id==='schools'){let t=$('[data-v50-school]');if(t){try{t.click()}catch{}}else{const old=$('[data-v48-tool="schools"]');try{old?.click()}catch{}}setTimeout(()=>$('#v50-school')?.classList.add('open'),80);return}
    if(id==='study'){
      $('#v25-study')?.classList.remove('open');
      const api=window.__SCHOLARK_V62_LEARNING_API__;if(api?.openStudyAhead){api.openStudyAhead();return}
      setTimeout(()=>window.__SCHOLARK_V62_LEARNING_API__?.openStudyAhead?.(),90);return;
    }
    if(id==='book'){
      $('#v25-book')?.classList.remove('open');
      const api=window.__SCHOLARK_V65_BOOK__;if(api?.open){api.open();return}
      setTimeout(()=>window.__SCHOLARK_V65_BOOK__?.open?.(),90);return;
    }
  }

  function openTool(id){build();document.body.classList.add('v51-workspace');forceQuality();state.active=id;syncNav();if(id==='dashboard'){clearModes();setRoute('dashboard');showPage('dashboard');return}if(id==='studio'){openStudio();return}if(['schools','study','book'].includes(id)){openPro(id);return}openNative(id)}
  function goHome(){
    clearModes();
    document.body.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    const oldUrl=location.href;
    history.replaceState(null,'',location.pathname+location.search+'#home');
    const h=$('#v29-home-layer');
    if(h){h.hidden=false;h.removeAttribute('aria-hidden');h.classList.add('v30-native-home');['display','visibility','opacity','pointer-events'].forEach(p=>h.style.removeProperty(p));h.scrollTop=0}
    document.body.classList.add('v55-public-home');
    window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL:oldUrl,newURL:location.href}));
    window.scrollTo({top:0,behavior:'instant'});
    setTimeout(()=>{const home=$('#v29-home-layer');if(home){home.hidden=false;home.classList.add('v30-native-home');home.scrollTop=0}refreshLogo()},80)
  }

  function cleanConflicts(){
    build();$('#v49-sidebar-toggle')?.setAttribute('hidden','');$('#v48-sidebar')?.setAttribute('hidden','');$('#v48-dashboard')?.setAttribute('hidden','');$('#v48-return-home')?.setAttribute('hidden','');$$('#v41-studio-workspace .v41-mode[data-mode="book"],#v29-home-layer .v29-type[data-mode="book"],#v29-home-layer .v29-tab[data-mode="book"]').forEach(x=>x.remove());
    const active=workspaceRoute();document.body.classList.toggle('v51-workspace',active);if(!active){clearModes();return}
    forceQuality();const h=route();let id='dashboard';if(h.includes('studio')||h.includes('presentation')||h.includes('webpage')||h.includes('document')||h.includes('report')||h.includes('graphic')||h.includes('social'))id='studio';else if(h.includes('schools'))id='schools';else if(h.includes('study'))id='study';else if(h.includes('book'))id='book';else if(h.includes('tutor'))id='tutor';else if(h.includes('education'))id='education';else if(h.includes('planner'))id='planner';else if(h.includes('progress'))id='progress';else if(h.includes('goal'))id='goal';else if(h.includes('project'))id='project';state.active=id;syncNav(id);if(id==='dashboard'&&!document.body.classList.contains('v51-native')&&!document.body.classList.contains('v51-studio')&&!document.body.classList.contains('v51-pro'))showPage('dashboard');refreshLogo()
  }

  addEventListener('hashchange',()=>setTimeout(cleanConflicts,20));addEventListener('popstate',()=>setTimeout(cleanConflicts,20));addEventListener('resize',()=>setTimeout(cleanConflicts,30));
  new MutationObserver(()=>{clearTimeout(window.__v51sync);window.__v51sync=setTimeout(()=>{refreshLogo();$$('#v41-studio-workspace .v41-mode[data-mode="book"]').forEach(x=>x.remove());if(workspaceRoute())forceQuality()},120)}).observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('focus',()=>{if(workspaceRoute()){forceQuality();refreshLogo();$('#v49-sidebar-toggle')?.setAttribute('hidden','')}});
  setTimeout(()=>{build();cleanConflicts();if(workspaceRoute())openTool((route().replace('#','').split('-')[0]||'dashboard'))},80);
})();