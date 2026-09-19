(() => {
  if (window.__SCHOLARK_V51_WORKSPACE_SHELL__) return;
  window.__SCHOLARK_V51_WORKSPACE_SHELL__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const route=()=>String(location.hash||'').toLowerCase();
  const workspaceRoute=()=>/dashboard|studio|ai|tutor|education|language|planner|focus|flashcards|assignments|progress|goal|project|files|schools|study|book|presentation|webpage|document|report|graphic|social/.test(route());

  const LEVELS=[
    ['young','🧸','Young learner','Playful foundations, language and number sense'],
    ['primary','📚','Primary school','Math, language, exploration and smart practice'],
    ['secondary','🎒','Secondary school','Mastery, planning, study space and challenging subjects'],
    ['student','🎓','Student','Research, reports, presentations and study planning'],
    ['adult','💼','Adult','Digital skills, work skills and practical help']
  ];
  const SURINAME_LEVELS=[
    ['kindergarten','🧸','Kleuterschool / Kleuteronderwijs','Leerjaar 1–2 · 4–6 jaar','basic','young'],
    ['primary','📚','Lagere school / Basisschool','Leerjaar 3–8 · 6–12 jaar','basic','primary'],
    ['mulo','🎒','MULO','12–16 jaar','voj','secondary'],
    ['lbo','🛠️','LBO','12–16 jaar','voj','secondary'],
    ['havo','🎓','HAVO','16–18 jaar','vos','student'],
    ['vwo','🎓','VWO','16–19 jaar','vos','student'],
    ['mbo','🧰','MBO','NATIN, IMEAO, Kweekschool · 16–20+ jaar','vos','student'],
    ['hbo','🏫','HBO','18/19+ jaar','higher','adult'],
    ['wo','🏛️','WO / Universiteit','AdeKUS · 19+ jaar','higher','adult']
  ];
  const SURINAME_GROUPS=[
    {id:'basic',label:'Basisonderwijs',tone:'green'},
    {id:'voj',label:'VOJ',tone:'dark'},
    {id:'vos',label:'VOS',tone:'green'},
    {id:'higher',label:'Hoger Onderwijs',tone:'dark'}
  ];
  const SURINAME_GROUP_LABELS={
    nl:{basic:'Basisonderwijs',voj:'VOJ',vos:'VOS',higher:'Hoger Onderwijs'},
    en:{basic:'Primary Education',voj:'Lower Secondary (VOJ)',vos:'Upper Secondary (VOS)',higher:'Higher Education'},
    es:{basic:'Educación Primaria',voj:'Secundaria Inferior (VOJ)',vos:'Secundaria Superior (VOS)',higher:'Educación Superior'},
    fr:{basic:'Enseignement primaire',voj:'Secondaire inférieur (VOJ)',vos:'Secondaire supérieur (VOS)',higher:'Enseignement supérieur'},
    de:{basic:'Primarbildung',voj:'Sekundarstufe I (VOJ)',vos:'Sekundarstufe II (VOS)',higher:'Hochschulbildung'},
    pt:{basic:'Ensino primário',voj:'Ensino secundário inferior (VOJ)',vos:'Ensino secundário superior (VOS)',higher:'Ensino superior'},
    it:{basic:'Istruzione primaria',voj:'Secondaria inferiore (VOJ)',vos:'Secondaria superiore (VOS)',higher:'Istruzione superiore'}
  };
  const workspaceUiLang=()=>{const v=localStorage.getItem('scholark_ui_language')||'nl';return SURINAME_GROUP_LABELS[v]?v:'en'};
  const surinameGroupLabel=group=>SURINAME_GROUP_LABELS[workspaceUiLang()]?.[group.id]||group.label;

  const SURINAME_AI_LEVEL=Object.fromEntries(SURINAME_LEVELS.map(([id,,,,,ai])=>[id,ai]));
  const TOOLS=[
    ['dashboard','⌂','Dashboard'],['studio','✦','Studio AI'],['ai','✺','SCHOLARK AI'],['tutor','AI','AI Tutor'],['education','◎','Education & Learning'],['language','Aa','Language Learner'],['planner','▦','Planner'],['focus','◷','Focus Sessions'],['flashcards','▤','Flashcards'],['assignments','✓','Assignments'],['progress','↗','Progress'],['goal','◉','Goals'],['files','▣','Files & Notes'],['project','▧','My Projects']
  ];
  const PRO=[['schools','⌖','Schools Near Me','PRO'],['study','🚀','Study Ahead','PRO'],['book','📚','Book Studio','BETA']];
  const ALIASES={
    ai:['scholark ai','general ai','ai assistant'],tutor:['ai tutor','tutor ai','tutor'],education:['education & learning','educatie & leren','onderwijs & leren','education'],language:['language learner','language learning','talen leren','taal leren'],planner:['planner'],focus:['focus sessions','focus','concentratie'],flashcards:['flashcards','flash cards','kaartjes'],assignments:['assignments','assignment','opdrachten'],progress:['progress','voortgang'],goal:['goals','doelen','goal'],project:['my projects','mijn projecten','projects','projecten']
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

    #v51-main{position:fixed;z-index:2147482100;left:var(--v51-side);top:0;right:0;bottom:0;background:#f4f3ef;color:#17191f;overflow-y:auto;overflow-x:hidden;overscroll-behavior-y:contain;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;transition:left .24s ease;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    .v51-page{display:none;min-height:100%;padding:34px;box-sizing:border-box}.v51-page.active{display:block}.v51-shell{max-width:1450px;margin:0 auto}.v51-level-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 9px}.v51-level-label{font:900 8px Inter;letter-spacing:.14em;color:#716d7a;margin:0}.v51-level-scroll-controls{display:none;gap:6px;flex:0 0 auto}.v51-level-scroll-controls.visible{display:flex}.v51-level-scroll-controls button{width:31px;height:31px;border:1px solid rgba(23,25,31,.11);border-radius:10px;background:#fff;color:#17191f;font:950 17px/1 Inter;cursor:pointer;box-shadow:0 7px 20px rgba(31,27,63,.05)}.v51-level-scroll-controls button:hover{background:#f1efe9}.v51-levels{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:0 0 26px}.v51-levels.v51-levels-suriname{display:flex;align-items:stretch;gap:28px;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x proximity;scrollbar-gutter:stable;scrollbar-width:auto;padding:2px 2px 14px;margin-bottom:22px;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch}.v51-levels.v51-levels-suriname::-webkit-scrollbar{height:10px}.v51-levels.v51-levels-suriname::-webkit-scrollbar-track{background:#e9e7e1;border-radius:99px}.v51-levels.v51-levels-suriname::-webkit-scrollbar-thumb{background:#b7b2a9;border-radius:99px}.v51-level-cluster{flex:0 0 auto;scroll-snap-align:start;min-width:max-content;background:transparent!important;box-shadow:none!important;border:0!important}.v51-level-cluster-cards{background:transparent!important;box-shadow:none!important}.v51-level-cluster.dark{background:transparent!important;box-shadow:none!important}.v51-level-group{display:inline-flex;align-items:center;min-height:28px;padding:0 11px;border-radius:999px;margin:0 0 9px;font:950 8px/1 Inter;letter-spacing:.11em;text-transform:uppercase}.v51-level-cluster.green .v51-level-group{background:#c9ff6a;color:#17191f}.v51-level-cluster.dark .v51-level-group{background:linear-gradient(135deg,#1f2b5b 0%,#385294 52%,#172349 100%);color:#fff;box-shadow:0 9px 24px rgba(23,35,73,.22)}.v51-level-cluster-cards{display:flex;gap:10px;align-items:stretch}.v51-levels.v51-levels-suriname .v51-level{width:190px;flex:0 0 190px}.v51-level{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:17px;padding:13px 12px;text-align:left;cursor:pointer;min-height:88px;min-width:0}.v51-level.active{background:#17191f;color:#fff;border-color:#17191f}.v51-level b{display:block;font:900 10px/1.25 Inter;margin:7px 0 3px;overflow-wrap:anywhere}.v51-level small{display:block;font:600 7.5px/1.42 Inter;color:#817d87;overflow-wrap:anywhere}.v51-level.active small{color:#bcb8c5}.v51-levels.v51-levels-suriname .v51-level-cluster.green .v51-level{background:#c9ff6a;color:#17191f;border-color:rgba(113,145,42,.22)}.v51-levels.v51-levels-suriname .v51-level-cluster.green .v51-level small{color:#53601f}.v51-levels.v51-levels-suriname .v51-level-cluster.dark .v51-level{background:linear-gradient(135deg,#1f2b5b 0%,#385294 52%,#172349 100%);color:#fff;border-color:rgba(23,35,73,.30);box-shadow:0 12px 30px rgba(23,35,73,.18)}.v51-levels.v51-levels-suriname .v51-level-cluster.dark .v51-level small{color:rgba(255,255,255,.78)}.v51-levels.v51-levels-suriname .v51-level-cluster .v51-level.active{outline:3px solid rgba(23,25,31,.88);outline-offset:-3px}.v51-levels.v51-levels-suriname .v51-level-cluster.dark .v51-level.active{outline-color:rgba(255,255,255,.9)}.v51-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:24px;padding-right:118px}.v51-head small{display:block;color:#6d5dfc;font:950 9px Inter;letter-spacing:.15em;margin-bottom:8px}.v51-head h1{font:950 clamp(36px,5vw,60px)/.94 Inter;margin:0;letter-spacing:-.052em}.v51-head p{max-width:760px;color:#706c77;font:600 12px/1.55 Inter;margin:10px 0 0}.v51-badge{border-radius:999px;background:#17191f;color:#c9ff6a;padding:9px 12px;font:900 8.5px Inter;white-space:nowrap}.v51-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}.v51-card{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:22px;padding:19px;min-height:165px;text-align:left;cursor:pointer;box-shadow:0 17px 50px rgba(31,27,63,.045)}.v51-card.primary{grid-column:span 2;min-width:0;background:linear-gradient(145deg,#17191f,#30275d);color:#fff}.v51-card .icon{width:37px;height:37px;border-radius:12px;background:#eeecff;color:#5c4de0;display:grid;place-items:center;font:950 14px Inter}.v51-card.primary .icon{background:#c9ff6a;color:#17191f}.v51-card h3{font:950 20px/1.08 Inter;margin:16px 0 7px;overflow-wrap:anywhere}.v51-card p{font:600 10px/1.5 Inter;color:#77727d;margin:0;overflow-wrap:anywhere}.v51-card.primary p{color:#cac6d2}.v51-card b{display:inline-block;margin-top:16px;font:900 8.5px Inter;color:#6d5dfc}.v51-card.primary b{color:#c9ff6a}

    .v51-native-host{position:fixed!important;z-index:2147482150!important;left:var(--v51-side)!important;top:0!important;right:0!important;bottom:0!important;width:auto!important;height:auto!important;max-width:none!important;max-height:none!important;margin:0!important;transform:none!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior-y:contain!important;scrollbar-gutter:stable!important;-webkit-overflow-scrolling:touch;background:#f4f3ef!important;transition:left .24s ease!important}.v51-native-host[hidden]{display:block!important}
    body.v51-native #v51-main{display:none!important}
    body.v51-studio #v51-main{display:none!important}body.v51-studio #v41-studio-workspace{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:fixed!important;z-index:2147482150!important;left:var(--v51-side)!important;top:0!important;right:0!important;bottom:0!important;width:auto!important;height:auto!important;max-width:none!important;transition:left .24s ease!important}
    body.v51-studio #v41-studio-workspace .v41-mode[data-mode="book"]{display:none!important}

    body.v51-pro #v51-main{display:none!important}
    body.v51-schools #v50-school{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:fixed!important;z-index:2147482150!important;inset:0 0 0 var(--v51-side)!important;left:var(--v51-side)!important;top:0!important;right:0!important;bottom:0!important;width:auto!important;height:100dvh!important;max-height:100dvh!important;background:#f4f3ef!important;backdrop-filter:none!important;padding:34px!important;overflow-y:scroll!important;overflow-x:hidden!important;overscroll-behavior-y:contain!important;scrollbar-gutter:stable both-edges!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;transition:left .24s ease!important;align-items:flex-start!important;justify-content:flex-start!important;box-sizing:border-box!important}
    body.v51-schools #v50-school .v50-box{width:min(1450px,100%)!important;max-width:1450px!important;min-height:calc(100vh - 68px)!important;max-height:none!important;margin:0 auto!important;border-radius:28px!important;box-shadow:0 18px 60px rgba(31,27,63,.07)!important;background:#fff!important}
    body.v51-schools #v50-school .v50-x{display:none!important}
    body.v51-study #v25-study,body.v51-book #v25-book{display:none!important;visibility:hidden!important;pointer-events:none!important}

    .v51-fallback{max-width:1180px;margin:0 auto;padding:34px}.v51-fallback-card{background:#fff;border:1px solid rgba(23,25,31,.1);border-radius:24px;padding:24px;box-shadow:0 18px 55px rgba(31,27,63,.05)}.v51-fallback-card h2{font:950 32px/1 Inter;margin:0 0 10px}.v51-fallback-card p{font:600 12px/1.55 Inter;color:#706c77}.v51-fallback-card textarea,.v51-fallback-card input{width:100%;box-sizing:border-box;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:14px;padding:13px;font:650 12px Inter;outline:0;margin-top:10px}.v51-fallback-card textarea{min-height:150px;resize:vertical}.v51-fallback-card button{border:0;border-radius:13px;background:#17191f;color:#fff;padding:12px 15px;font:900 10px Inter;margin-top:10px;cursor:pointer}.v51-fallback-card button span{color:#c9ff6a}.v51-fallback-list{display:grid;gap:8px;margin-top:14px}.v51-fallback-item{padding:12px;border-radius:14px;background:#f5f4f1;font:700 10px/1.45 Inter;color:#504c57}
    @media(max-width:1180px){body:not(.v51-collapsed){--v51-side:220px}.v51-grid{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}.v51-card.primary{grid-column:1/-1}.v51-levels:not(.v51-levels-suriname){grid-template-columns:repeat(auto-fit,minmax(160px,1fr))}.v51-head{padding-right:0}}
    @media(max-width:720px){body:not(.v51-collapsed){--v51-side:74px}.v51-brand-copy,.v51-nav span,.v51-section,.v51-nav em,.v51-quality{display:none}.v51-brand{justify-content:center;padding-left:0;padding-right:0}.v51-nav{justify-content:center}.v51-nav i{width:32px;height:32px}.v51-page{padding:70px 13px 50px}.v51-level-top{align-items:flex-start}.v51-levels:not(.v51-levels-suriname){grid-template-columns:1fr 1fr}.v51-levels.v51-levels-suriname{gap:20px}.v51-levels.v51-levels-suriname .v51-level{width:170px;flex-basis:170px}.v51-grid{grid-template-columns:1fr}.v51-card.primary{grid-column:auto}#v51-home{top:12px;right:12px}}
  `;
  document.head.appendChild(style);

  let side,main,home,toggle,nativeHost=null,nativeTimer=null;
  const state={active:'dashboard'};

  function workspaceCountry(){const api=window.__SCHOLARK_COUNTRY__;const raw=api?.current?.()||localStorage.getItem('scholark_country')||'Suriname';const normalized=api?.normalize?.(raw)||raw;const key=String(normalized).trim().toLowerCase();return key==='sr'?'suriname':key}
  function dashboardLevels(){return workspaceCountry()==='suriname'?SURINAME_LEVELS:LEVELS}
  function levelId(){
    if(workspaceCountry()==='suriname'){
      const track=localStorage.getItem('scholark_education_track')||'';
      if(SURINAME_AI_LEVEL[track])return track;
      const ai=localStorage.getItem('scholark_learning_level')||'secondary';
      return ai==='young'?'kindergarten':ai==='primary'?'primary':ai==='student'?'havo':ai==='adult'?'hbo':'mulo';
    }
    return localStorage.getItem('scholark_learning_level')||'secondary';
  }
  function setLevel(id){
    if(workspaceCountry()==='suriname'&&SURINAME_AI_LEVEL[id]){
      const ai=SURINAME_AI_LEVEL[id];
      localStorage.setItem('scholark_learning_level',ai);
      localStorage.setItem('scholark_ai_audience_level',ai);
      localStorage.setItem('scholark_education_track',id);
      if(id==='vwo')localStorage.setItem('scholark_vwo_selected','1');else localStorage.removeItem('scholark_vwo_selected');
    }else{
      if(!LEVELS.some(x=>x[0]===id))id='secondary';
      localStorage.setItem('scholark_learning_level',id);
      localStorage.setItem('scholark_ai_audience_level',id);
      localStorage.removeItem('scholark_education_track');
      localStorage.removeItem('scholark_vwo_selected');
    }
    renderLevels();forceQuality();setTimeout(()=>window.__SCHOLARK_COUNTRY__?.apply?.(),0);
  }
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
    main=document.createElement('main');main.id='v51-main';main.innerHTML=`<section class="v51-page" data-v51-page="dashboard"><div class="v51-shell"><div class="v51-level-top"><div class="v51-level-label">CHOOSE HOW SCHOLARK SHOULD WORK & TEACH</div><div class="v51-level-scroll-controls"><button type="button" data-v51-level-scroll="-1" aria-label="Scroll education levels left">‹</button><button type="button" data-v51-level-scroll="1" aria-label="Scroll education levels right">›</button></div></div><div class="v51-levels"></div><div class="v51-head"><div><small>SCHOLARK WORKSPACE</small><h1>Your learning & creation workspace.</h1><p>Open the tool you need. Your selected level changes how SCHOLARK should explain, structure and challenge you, while every AI workflow uses the highest available quality.</p></div><span class="v51-badge">AI QUALITY · MAX</span></div><div class="v51-grid">${card('studio','✦','Studio AI','Create presentations, webpages, documents, social content and graphics from a structured brief.',true)}${card('ai','✺','SCHOLARK AI','Ask a general-purpose AI about almost anything: writing, coding, ideas, planning, knowledge, analysis and more.')}${card('tutor','AI','AI Tutor','Ask, learn, practice and get explanations adapted to your selected level.')}${card('education','◎','Education & Learning','Diagnostics, learning paths, mastery and study support in one place.')}${card('language','Aa','Language Learner','Learn vocabulary, grammar, pronunciation and conversation with adaptive lessons.')}${card('planner','▦','Planner','Organize goals, study sessions, deadlines and what to work on next.')}${card('focus','◷','Focus Sessions','Run focused study blocks, connect them to Planner tasks and track completed focus time.')}${card('flashcards','▤','Flashcards','Build spaced-repetition decks and review weak cards at the right time.')}${card('assignments','✓','Assignments','Track briefs and deadlines, break work into Planner steps and get AI Tutor guidance.')}${card('progress','↗','Progress','See what is improving, what is weak and where to focus next.')}${card('goal','◉','Goals','Set learning, school and creation goals and connect them to your plan.')}${card('files','▣','Files & Notes','Work with uploaded files, notes, summaries and extracted knowledge.')}${card('project','▧','My Projects','Return to saved Studio work, documents, research and ongoing projects.')}${card('study','🚀','Study Ahead','Prepare for a future field with an AI roadmap connected to Planner, Mastery and Goals.')}${card('schools','⌖','Schools Near Me','Find education options for the study you actually want.')}${card('book','📚','Book Studio','Build long-form books and structured manuscripts inside SCHOLARK.')}</div></div></section><section class="v51-page" data-v51-page="fallback"><div id="v51-fallback"></div></section>`;document.body.appendChild(main);
    $$('[data-v51-tool]',document).forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openTool(b.dataset.v51Tool)}));
    renderLevels();setCollapsed(localStorage.getItem('scholark_v51_collapsed')==='1',false);refreshLogo();
  }
  function card(id,ic,title,desc,primary=false){return `<button class="v51-card ${primary?'primary':''}" data-v51-tool="${id}"><span class="icon">${ic}</span><h3>${title}</h3><p>${desc}</p><b>OPEN ${title.toUpperCase()} →</b></button>`}
  function syncLevelScrollControls(){
    const host=$('.v51-levels',main),controls=$('.v51-level-scroll-controls',main);if(!host||!controls)return;
    controls.classList.toggle('visible',host.classList.contains('v51-levels-suriname')&&host.scrollWidth>host.clientWidth+8);
  }
  function wireLevelScroll(){
    const host=$('.v51-levels',main);if(!host)return;
    $$('.v51-level-scroll-controls [data-v51-level-scroll]',main).forEach(btn=>{
      if(btn.dataset.v51Wired==='1')return;btn.dataset.v51Wired='1';
      btn.onclick=()=>host.scrollBy({left:Number(btn.dataset.v51LevelScroll||1)*Math.max(320,host.clientWidth*.72),behavior:'smooth'});
    });
    if(host.dataset.v51ScrollWired!=='1'){
      host.dataset.v51ScrollWired='1';host.tabIndex=0;
      host.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();host.scrollBy({left:(e.key==='ArrowRight'?1:-1)*300,behavior:'smooth'})});
    }
    requestAnimationFrame(syncLevelScrollControls);
  }
  function renderLevels(){
    if(!side)return;const host=$('.v51-levels',main);if(!host)return;
    const rows=dashboardLevels(),selected=levelId(),suriname=workspaceCountry()==='suriname';
    host.classList.toggle('v51-levels-suriname',suriname);
    host.setAttribute('aria-label',suriname?'Suriname education levels. Scroll horizontally for more levels.':'Education levels');
    if(suriname){
      host.innerHTML=SURINAME_GROUPS.map(group=>{
        const cards=rows.filter(x=>x[4]===group.id).map(([id,ic,l,d])=>`<button class="v51-level ${id===selected?'active':''}" data-level="${id}" data-v96-i18n-owned="1"><span>${ic}</span><b>${l}</b><small>${d}</small></button>`).join('');
        return `<section class="v51-level-cluster ${group.tone}" data-v51-group="${group.id}" data-v96-i18n-owned="1" data-sch-i18n-owned="1"><div class="v51-level-group" data-sch-i18n-owned="1">${esc(surinameGroupLabel(group))}</div><div class="v51-level-cluster-cards">${cards}</div></section>`;
      }).join('');
    }else host.innerHTML=rows.map(([id,ic,l,d])=>`<button class="v51-level ${id===selected?'active':''}" data-level="${id}"><span>${ic}</span><b>${l}</b><small>${d}</small></button>`).join('');
    $$('[data-level]',host).forEach(b=>b.onclick=()=>setLevel(b.dataset.level));
    wireLevelScroll();
  }
  function setCollapsed(on,save=true){document.body.classList.toggle('v51-collapsed',!!on);if(toggle){toggle.textContent=on?'›':'‹';toggle.title=on?'Open sidebar':'Close sidebar';toggle.setAttribute('aria-label',toggle.title)}if(save)localStorage.setItem('scholark_v51_collapsed',on?'1':'0')}

  function setRoute(id){history.replaceState(null,'',location.pathname+location.search+'#'+id)}
  function clearModes(){document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');if(nativeHost){nativeHost.classList.remove('v51-native-host');nativeHost=null}clearInterval(nativeTimer);nativeTimer=null;$('#v41-studio-workspace')?.setAttribute('hidden','');$('#sv24-overlay')?.classList.remove('open');$('#v50-school')?.classList.remove('open');$('#v25-study')?.classList.remove('open');$('#v25-book')?.classList.remove('open');$('#v58-suite')?.classList.remove('open');$('#v57-deck')?.classList.remove('open');$('#v57-present')?.classList.remove('open');if(main){main.style.removeProperty('display');$$('.v51-page',main).forEach(p=>p.style.removeProperty('display'))}}
  function applyLanguageRoot(el){
    const i18n=window.__SCHOLARK_I18N__;if(!el||!i18n?.apply)return;
    // #v51-main and #v51-fallback are reused between tools. Caching by root
    // caused newly mounted panels to stay in English.
    i18n.apply(el);
  }
  function syncWorkspaceLanguage(root=null,force=false){
    const lang=localStorage.getItem('scholark_ui_language')||'nl',i18n=window.__SCHOLARK_I18N__;
    document.documentElement.lang=lang;
    i18n?.upgradeSelectors?.();
    const selector=$('#v90-language');if(selector&&[...selector.options].some(o=>o.value===lang))selector.value=lang;
    if(!force&&lang==='en'&&document.documentElement.dataset.scholarkWorkspaceLang==='en')return;
    const roots=[side,root||main,$('#v41-studio-workspace:not([hidden])'),$('#v50-school.open'),$('#v25-study.open'),$('#v51-fallback .v64-projects'),$('#v51-fallback .v65-book'),$('#v58-suite.open'),$('#v57-deck.open'),$('#v57-present.open')].filter(Boolean);
    [...new Set(roots)].forEach(applyLanguageRoot);
    document.documentElement.dataset.scholarkWorkspaceLang=lang;
    // #v41-language is the artifact OUTPUT language, not the SCHOLARK UI language.
    // Keep artifact output-language support independent from the 37-language SCHOLARK interface selector.
    const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,90));
    if(lang!=='en'){
      idle(()=>{if(workspaceRoute())i18n?.translateCurrentPage?.(false)},{timeout:320});
      setTimeout(()=>{if(workspaceRoute()&&(localStorage.getItem('scholark_ui_language')||'nl')===lang){i18n?.upgradeSelectors?.();i18n?.translateCurrentPage?.(false)}},320);
    }
  }
  function showPage(name){$$('.v51-page',main).forEach(p=>{p.style.removeProperty('display');p.classList.toggle('active',p.dataset.v51Page===name)});main.style.removeProperty('display')}
  function syncNav(id=state.active){$$('[data-v51-tool]',side).forEach(b=>b.classList.toggle('active',b.dataset.v51Tool===id))}

  function findLegacySidebar(){
    const labels=['dashboard','studio ai','ai tutor','education & learning','language learner','planner','progress','goals','my projects'];
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

  function showFallback(id){clearModes();setRoute(id);state.active=id;syncNav();showPage('fallback');const host=$('#v51-fallback');const title={ai:'SCHOLARK AI',tutor:'AI Tutor',education:'Education & Learning',planner:'Planner',progress:'Progress',goal:'Goals',project:'My Projects'}[id]||id;let body='';
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

  function openStudio(){
    setCollapsed(false,true);
    clearModes();forceQuality();state.active='studio';syncNav();setRoute('studio');
    const s=$('#v41-studio-workspace');
    if(s){
      const openedAt=performance.now();
      // First paint wins: show the already-built Studio immediately.
      s.hidden=false;s.removeAttribute('aria-hidden');document.body.classList.add('v51-studio','v41-studio-open');
      Array.from(s.querySelectorAll('.v41-mode[data-mode="book"]')).forEach(x=>x.remove());
      window.__SCHOLARK_STUDIO_WORKSPACE__?.open?.(null,{route:false,fast:true});
      const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,70));
      idle(()=>window.__SCHOLARK_RUNTIME__?.prefetchStudio?.(),{timeout:220});
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        const ms=Math.round((performance.now()-openedAt)*10)/10;
        try{sessionStorage.setItem('scholark_studio_first_paint_ms',String(ms))}catch{}
        window.dispatchEvent(new CustomEvent('scholark-route-painted',{detail:{route:'studio',ms}}));
        // Localize after first paint so translation traversal never delays opening Studio.
        syncWorkspaceLanguage(s);
      }));
      return
    }
    showFallback('studio')
  }
  function clickExternalTool(tool){const c=$$(`[data-tool="${tool}"]`).filter(el=>!el.closest('#v51-sidebar,#v51-main'))[0];if(c){try{c.click();return true}catch{}}return false}
  function openPro(id){
    setCollapsed(false,true);clearModes();forceQuality();state.active=id;syncNav();setRoute(id);document.body.classList.add('v51-pro','v51-'+id);
    if(id==='schools'){let t=$('[data-v50-school]');if(t){try{t.click()}catch{}}else{const old=$('[data-v48-tool="schools"]');try{old?.click()}catch{}}setTimeout(()=>{if(route()!=='#schools')return;const x=$('#v50-school');x?.classList.add('open');window.__SCHOLARK_I18N__?.apply?.(x)},35);return}
    if(id==='study'){
      $('#v25-study')?.classList.remove('open');
      const api=window.__SCHOLARK_V62_LEARNING_API__;if(api?.openStudyAhead){api.openStudyAhead();setTimeout(()=>{if(route()==='#study')window.__SCHOLARK_I18N__?.apply?.($('#v25-study'))},20);return}
      setTimeout(()=>{if(route()!=='#study')return;window.__SCHOLARK_V62_LEARNING_API__?.openStudyAhead?.();window.__SCHOLARK_I18N__?.apply?.($('#v25-study'))},60);return;
    }
    if(id==='book'){
      $('#v25-book')?.classList.remove('open');
      const api=window.__SCHOLARK_V65_BOOK__;if(api?.open){api.open();setTimeout(()=>{if(route()==='#book')window.__SCHOLARK_I18N__?.apply?.($('#v51-fallback'))},20);return}
      setTimeout(()=>{if(route()!=='#book')return;window.__SCHOLARK_V65_BOOK__?.open?.();window.__SCHOLARK_I18N__?.apply?.($('#v51-fallback'))},60);return;
    }
  }

  function openTool(id){
    build();document.body.classList.add('v51-workspace');forceQuality();state.active=id;syncNav();
    if(id==='dashboard'){clearModes();setRoute('dashboard');showPage('dashboard');syncWorkspaceLanguage(main);return}
    if(id==='studio'){openStudio();return}
    if(id==='ai'){
      setCollapsed(false,true);clearModes();setRoute('ai');showPage('fallback');state.active='ai';syncNav();
      const mount=()=>{if(route()!=='#ai')return false;const api=window.__SCHOLARK_V107_GENERAL_AI__;if(!api?.open)return false;api.open();syncWorkspaceLanguage($('#v51-fallback'));return true};
      if(mount())return;
      window.__SCHOLARK_RUNTIME__?.ensure?.('ai')?.then(()=>{if(!mount()&&route()==='#ai')showFallback('ai')});
      return
    }
    if(id==='language'){clearModes();setRoute('language');showPage('fallback');state.active='language';syncNav();if(window.__SCHOLARK_V93_LANGUAGE__?.open)window.__SCHOLARK_V93_LANGUAGE__.open();else setTimeout(()=>{if(route()==='#language')window.__SCHOLARK_V93_LANGUAGE__?.open?.()},100);syncWorkspaceLanguage(main);return}
    if(['tutor','education','planner','progress','goal'].includes(id)){
      setCollapsed(false,true);clearModes();setRoute(id);showPage('fallback');state.active=id;syncNav();
      const api=window.__SCHOLARK_V52_FAST__;if(api?.open)api.open(id);else setTimeout(()=>{if(route()==='#'+id)window.__SCHOLARK_V52_FAST__?.open?.(id)},30);
      syncWorkspaceLanguage(main);return
    }
    if(['focus','flashcards','assignments'].includes(id)){
      setCollapsed(false,true);clearModes();setRoute(id);showPage('fallback');state.active=id;syncNav();
      const mount=()=>{if(route()!=='#'+id)return false;const api=window.__SCHOLARK_V106_POWER__;if(!api?.open)return false;api.open(id);syncWorkspaceLanguage($('#v51-fallback'));return true};
      if(mount())return;
      window.__SCHOLARK_RUNTIME__?.ensure?.(id)?.then(()=>{if(!mount()&&route()==='#'+id)showFallback(id)});
      return
    }
    if(id==='files'){
      setCollapsed(false,true);clearModes();setRoute('files');showPage('fallback');state.active='files';syncNav();
      const mount=()=>{if(route()!=='#files')return false;const api=window.__SCHOLARK_V86_FILES__;if(!api?.open)return false;api.open();syncWorkspaceLanguage($('#v51-fallback'));return true};
      if(mount())return;
      window.__SCHOLARK_RUNTIME__?.ensure?.('files')?.then(()=>{if(!mount()&&route()==='#files')showFallback('files')});
      return
    }
    if(id==='project'){
      setCollapsed(false,true);clearModes();setRoute('project');showPage('fallback');
      const mount=()=>{
        if(route()!=='#project')return;
        const api=window.__SCHOLARK_V64_PROJECTS__;
        if(api?.open){api.open();syncWorkspaceLanguage($('#v51-fallback'));requestAnimationFrame(()=>{if(route()==='#project'&&!$('#v51-fallback .v64-projects'))window.__SCHOLARK_FOUNDATION__?.syncProjectSurface?.()});return true}
        return false;
      };
      const assertProject=()=>{
        if(route()!=='#project')return false;
        setCollapsed(false,true);
        const mounted=!!$('#v51-fallback .v64-projects');
        if(!mounted)mount();
        requestAnimationFrame(()=>{if(route()==='#project'){document.body.classList.remove('v51-collapsed');syncNav('project')}});
        return !!$('#v51-fallback .v64-projects');
      };
      if(mount()){requestAnimationFrame(assertProject);setTimeout(assertProject,90);return}
      window.__SCHOLARK_RUNTIME__?.ensure?.('project')?.then(()=>{if(!assertProject()&&route()==='#project')showFallback('project')});
      [30,90,220].forEach(ms=>setTimeout(assertProject,ms));
      return
    }
    if(['schools','study','book'].includes(id)){openPro(id);setTimeout(()=>syncWorkspaceLanguage(),25);return}
    openNative(id);setTimeout(()=>syncWorkspaceLanguage(),35)
  }
  function goHome(){
    clearModes();
    document.body.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    if(main){main.style.removeProperty('display');$$('.v51-page',main).forEach(p=>{p.style.removeProperty('display');p.classList.remove('active')});const fallback=$('#v51-fallback',main);if(fallback)fallback.innerHTML=''}
    const oldUrl=location.href;
    window.history.replaceState(null,'',location.pathname+location.search+'#home');
    const h=$('#v29-home-layer');
    if(h){h.hidden=false;h.removeAttribute('aria-hidden');h.classList.add('v30-native-home');['display','visibility','opacity','pointer-events','position','inset','top','left','right','bottom'].forEach(p=>h.style.removeProperty(p));h.scrollTop=0}
    document.body.classList.add('v55-public-home');
    window.__SCHOLARK_V55_TOPBAR__?.sync?.();
    window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.();
    window.dispatchEvent(new CustomEvent('scholark-return-home'));
    window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL:oldUrl,newURL:location.href}));
    window.scrollTo({top:0,behavior:'instant'});
    setTimeout(()=>{const home=$('#v29-home-layer');if(home){home.hidden=false;home.classList.add('v30-native-home');home.scrollTop=0}window.__SCHOLARK_V55_TOPBAR__?.sync?.();window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.();window.__SCHOLARK_V30_DEMO__?.sync?.();window.__SCHOLARK_FOUNDATION__?.repair?.();refreshLogo()},80);
    setTimeout(()=>window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.(),320)
  }

  function cleanConflicts(){
    build();$('#v49-sidebar-toggle')?.setAttribute('hidden','');$('#v48-sidebar')?.setAttribute('hidden','');$('#v48-dashboard')?.setAttribute('hidden','');$('#v48-return-home')?.setAttribute('hidden','');$$('#v41-studio-workspace .v41-mode[data-mode="book"],#v29-home-layer .v29-type[data-mode="book"],#v29-home-layer .v29-tab[data-mode="book"]').forEach(x=>x.remove());
    const active=workspaceRoute();document.body.classList.toggle('v51-workspace',active);if(!active){clearModes();return}
    forceQuality();const h=route();let id='dashboard';if(h.includes('studio')||h.includes('presentation')||h.includes('webpage')||h.includes('document')||h.includes('report')||h.includes('graphic')||h.includes('social'))id='studio';else if(h.includes('schools'))id='schools';else if(h.includes('study'))id='study';else if(h.includes('book'))id='book';else if(h==='#ai'||h.startsWith('#ai?'))id='ai';else if(h.includes('tutor'))id='tutor';else if(h.includes('education'))id='education';else if(h.includes('language'))id='language';else if(h.includes('planner'))id='planner';else if(h.includes('focus'))id='focus';else if(h.includes('flashcards'))id='flashcards';else if(h.includes('assignments'))id='assignments';else if(h.includes('progress'))id='progress';else if(h.includes('goal'))id='goal';else if(h.includes('project'))id='project';state.active=id;syncNav(id);if(id==='project'){setCollapsed(false,true);showPage('fallback');setTimeout(()=>{if(route()==='#project'){window.__SCHOLARK_V64_PROJECTS__?.open?.();syncWorkspaceLanguage($('#v51-fallback'))}},0)}else if(id==='dashboard'&&!document.body.classList.contains('v51-native')&&!document.body.classList.contains('v51-studio')&&!document.body.classList.contains('v51-pro'))showPage('dashboard');refreshLogo()
  }

  addEventListener('hashchange',()=>{setTimeout(cleanConflicts,40);setTimeout(()=>{refreshLogo();if(workspaceRoute())forceQuality()},220)});
  addEventListener('popstate',()=>setTimeout(cleanConflicts,40));
  addEventListener('resize',()=>setTimeout(cleanConflicts,100),{passive:true});
  addEventListener('scholark-language-applied',()=>{if(workspaceRoute())setTimeout(()=>{renderLevels();syncWorkspaceLanguage(null,true);window.__SCHOLARK_COUNTRY__?.apply?.()},0)});
  addEventListener('scholark-language-ready',()=>{if(workspaceRoute())setTimeout(()=>{renderLevels();syncWorkspaceLanguage(null,true);window.__SCHOLARK_COUNTRY__?.apply?.()},20)});
  addEventListener('scholark-language-complete',()=>{if(workspaceRoute())setTimeout(()=>{renderLevels();syncWorkspaceLanguage(null,true);window.__SCHOLARK_COUNTRY__?.apply?.()},10)});
  addEventListener('scholark-runtime-ready',()=>{if(workspaceRoute())setTimeout(()=>{renderLevels();window.__SCHOLARK_COUNTRY__?.apply?.();syncWorkspaceLanguage(null,true)},20)});
  addEventListener('scholark-country-change',()=>{renderLevels();setTimeout(()=>window.__SCHOLARK_COUNTRY__?.apply?.(),0)});
  addEventListener('resize',()=>requestAnimationFrame(syncLevelScrollControls));
  setTimeout(()=>{build();cleanConflicts();if(workspaceRoute())openTool((route().replace('#','').split('-')[0]||'dashboard'))},80);
  window.__SCHOLARK_WORKSPACE__={openTool,clearModes,setCollapsed,syncLanguage:syncWorkspaceLanguage,goHome,getActive:()=>state.active};
})();