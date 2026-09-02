(() => {
  if(window.__SCHOLARK_V97_FOUNDATION__)return;
  window.__SCHOLARK_V97_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const route=()=>String(location.hash||'#home').toLowerCase().replace(/^#/,'').split('-')[0]||'home';
  let repairing=false,schoolWheelBound=false,cinematicQueued=false;

  function bindSchoolWheel(){
    const overlay=$('#v50-school');
    if(!overlay||overlay.dataset.v97Wheel==='1')return;
    overlay.dataset.v97Wheel='1';
    overlay.addEventListener('wheel',e=>{
      if(!document.body.classList.contains('v51-schools'))return;
      const max=overlay.scrollHeight-overlay.clientHeight;
      if(max<=2)return;
      const before=overlay.scrollTop;
      overlay.scrollTop=Math.max(0,Math.min(max,before+e.deltaY));
      if(overlay.scrollTop!==before)e.preventDefault();
    },{passive:false});
  }

  function duplicateIds(){
    const seen=new Set(),dupes=[];
    $$('[id]').forEach(el=>{if(seen.has(el.id))dupes.push(el.id);else seen.add(el.id)});
    return [...new Set(dupes)];
  }

  function queueCinematics(){
    if(cinematicQueued)return;cinematicQueued=true;
    requestAnimationFrame(()=>{cinematicQueued=false;window.__SCHOLARK_V30_DEMO__?.sync?.();window.__SCHOLARK_V32_PREVIEW__?.render?.()});
  }

  function resetHomeSurface(){
    document.body.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    document.body.classList.add('v55-public-home');
    window.__SCHOLARK_V55_TOPBAR__?.sync?.();
    window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.();
    const main=$('#v51-main');
    if(main){
      main.style.removeProperty('display');
      $$('.v51-page',main).forEach(p=>{p.style.removeProperty('display');p.classList.remove('active')});
    }
    $('#v41-studio-workspace')?.setAttribute('hidden','');
    $('#v50-school')?.classList.remove('open');
    $('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
    $('#sv24-overlay')?.classList.remove('open');
    $('#v58-suite')?.classList.remove('open');
    $('#v57-deck')?.classList.remove('open');
    $('#v57-present')?.classList.remove('open');
    const home=$('#v29-home-layer');
    if(home){
      home.hidden=false;home.removeAttribute('aria-hidden');home.classList.add('v30-native-home');
      ['display','visibility','opacity','pointer-events','position','inset','top','left','right','bottom'].forEach(p=>home.style.removeProperty(p));
    }
    queueCinematics();
  }

  function syncProjectSurface(){
    if(route()!=='project')return;
    localStorage.setItem('scholark_v51_collapsed','0');window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);
    document.body.classList.add('v51-workspace');document.body.classList.remove('v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    $('#v41-studio-workspace')?.setAttribute('hidden','');$('#sv24-overlay')?.classList.remove('open');$('#v50-school')?.classList.remove('open');$('#v25-study')?.classList.remove('open');$('#v25-book')?.classList.remove('open');$('#v58-suite')?.classList.remove('open');$('#v57-deck')?.classList.remove('open');$('#v57-present')?.classList.remove('open');
    const native=$('.v51-native-host');if(native)native.classList.remove('v51-native-host');
    const main=$('#v51-main');if(main)main.style.setProperty('display','block','important');
    const mount=()=>{if(route()!=='project')return false;const api=window.__SCHOLARK_V64_PROJECTS__;if(!api?.open)return false;api.open();window.__SCHOLARK_WORKSPACE__?.syncLanguage?.($('#v51-fallback'));return true};
    if(!mount())window.__SCHOLARK_RUNTIME__?.ensure?.('project')?.then(()=>mount());
  }

  function syncStudioSurface(){
    if(route()!=='studio')return;
    localStorage.setItem('scholark_v51_collapsed','0');window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);document.body.classList.remove('v51-collapsed');
    document.body.classList.add('v51-workspace','v51-studio','v41-studio-open');
    document.body.classList.remove('v51-pro','v51-schools','v51-study','v51-book');
    $('#sv24-overlay')?.classList.remove('open');$('#v50-school')?.classList.remove('open');$('#v25-study')?.classList.remove('open');$('#v25-book')?.classList.remove('open');$('#v58-suite')?.classList.remove('open');$('#v57-deck')?.classList.remove('open');$('#v57-present')?.classList.remove('open');
    const show=()=>{if(route()!=='studio')return false;const studio=$('#v41-studio-workspace');if(!studio)return false;studio.hidden=false;studio.removeAttribute('aria-hidden');window.__SCHOLARK_STUDIO_WORKSPACE__?.open?.(null,{route:false,fast:true});window.__SCHOLARK_WORKSPACE__?.syncLanguage?.(studio);return true};
    if(!show())window.__SCHOLARK_RUNTIME__?.ensure?.('studio')?.then(()=>show());
  }

  let languageRepairTimer=null;
  function syncWorkspaceLanguage(){
    if(route()==='home')return;
    clearTimeout(languageRepairTimer);
    languageRepairTimer=setTimeout(()=>{
      if(window.__SCHOLARK_WORKSPACE__?.syncLanguage){window.__SCHOLARK_WORKSPACE__.syncLanguage();return}
      const target=localStorage.getItem('scholark_ui_language')||'nl';
      if(document.documentElement.lang!==target)document.documentElement.lang=target;
      const roots=[$('#v51-sidebar'),$('#v51-main'),$('#v41-studio-workspace:not([hidden])'),$('#v50-school.open'),$('#v25-study.open'),$('#v51-fallback .v65-book'),$('#v51-fallback .v64-projects'),$('#v58-suite.open'),$('#v57-deck.open'),$('#v57-present.open')].filter(Boolean);
      roots.forEach(r=>window.__SCHOLARK_I18N__?.apply?.(r));
    },10);
  }

  const STUDIO_ROUTES=new Set(['studio','presentation','webpage','document','report','graphic','social']);
  function foreignSurfaceConflicts(r=route()){
    const open=(sel)=>!!$(sel)?.classList?.contains('open');
    const studioVisible=!!$('#v41-studio-workspace:not([hidden])');
    const conflicts=[];
    if(!STUDIO_ROUTES.has(r)&&studioVisible)conflicts.push('studio');
    if(r!=='schools'&&open('#v50-school'))conflicts.push('schools');
    if(r!=='study'&&open('#v25-study'))conflicts.push('study');
    if(open('#v25-book'))conflicts.push('legacy-book');
    if(!STUDIO_ROUTES.has(r)&&open('#v58-suite'))conflicts.push('artifact-suite');
    if(!STUDIO_ROUTES.has(r)&&open('#v57-deck'))conflicts.push('presentation-deck');
    if(!STUDIO_ROUTES.has(r)&&open('#v57-present'))conflicts.push('presenter');
    return [...new Set(conflicts)];
  }
  function repairForeignSurfaces(r=route()){
    const conflicts=foreignSurfaceConflicts(r);
    if(!conflicts.length)return conflicts;
    if(!STUDIO_ROUTES.has(r))$('#v41-studio-workspace')?.setAttribute('hidden','');
    if(r!=='schools')$('#v50-school')?.classList.remove('open');
    if(r!=='study')$('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
    if(!STUDIO_ROUTES.has(r)){
      $('#v58-suite')?.classList.remove('open');
      $('#v57-deck')?.classList.remove('open');
      $('#v57-present')?.classList.remove('open');
    }
    return foreignSurfaceConflicts(r);
  }

  function syncBookSurface(){
    if(route()!=='book')return;
    localStorage.setItem('scholark_v51_collapsed','0');window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);
    document.body.classList.add('v51-workspace');
    document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v41-studio-open');
    $('#v41-studio-workspace')?.setAttribute('hidden','');
    $('#sv24-overlay')?.classList.remove('open');
    $('#v50-school')?.classList.remove('open');
    $('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
    $('#v58-suite')?.classList.remove('open');$('#v57-deck')?.classList.remove('open');$('#v57-present')?.classList.remove('open');
    const native=$('.v51-native-host');if(native)native.classList.remove('v51-native-host');
    const main=$('#v51-main');if(main)main.style.setProperty('display','block','important');
    if(window.__SCHOLARK_V65_BOOK__?.open&&!$('#v51-fallback .v65-book')){
      setTimeout(()=>{if(route()==='book')window.__SCHOLARK_V65_BOOK__?.open?.()},0);
    }
  }

  function repair(){
    if(repairing)return;
    repairing=true;
    try{
      const r=route();
      repairForeignSurfaces(r);
      if(r==='schools'){
        const overlay=$('#v50-school');
        if(overlay){
          overlay.style.setProperty('inset','0 0 0 var(--v51-side)','important');
          overlay.style.setProperty('height','100dvh','important');
          overlay.style.setProperty('max-height','100dvh','important');
          overlay.style.setProperty('overflow-y','scroll','important');
          overlay.style.setProperty('overflow-x','hidden','important');
          overlay.style.setProperty('touch-action','pan-y','important');
          bindSchoolWheel();
        }
      }
      if(r==='project')syncProjectSurface();
      if(r==='studio')syncStudioSurface();
      if(r==='book')syncBookSurface();
      if(r!=='home')syncWorkspaceLanguage();
      if(r==='home'){
        resetHomeSurface();
        $$('[data-v55-suppressed="1"]').forEach(el=>{if(getComputedStyle(el).display!=='none')el.style.setProperty('display','none','important')});
      }
    }finally{repairing=false}
  }

  function criticalLanguageLeaks(){
    const selected=localStorage.getItem('scholark_ui_language')||'nl';
    if(selected==='en'||route()==='home')return [];
    const roots=[$('#v51-sidebar'),$('#v51-main'),$('#v41-studio-workspace:not([hidden])'),$('#v50-school.open'),$('#v25-study.open'),$('#v51-fallback .v65-book'),$('#v51-fallback .v64-projects')].filter(Boolean);
    const text=roots.map(x=>x.innerText||x.textContent||'').join('\n');
    const phrases=[
      'Explore what to learn, track mastery',
      'Map a subject into clear strands',
      'Build the book, chapter by chapter.',
      'Plan the book, then let SCHOLARK write',
      'Create from a brief, not a blank page.',
      'Creation settings',
      'Output language',
      'Quality pipeline',
      'Build outline first',
      'No reference files added',
      'Open saved Studio work directly.',
      'No saved projects yet.',
      'Delete project',
      'Curriculum Explorer',
      'Mastery Map',
      'Exam Prep Center',
      'Diagnostic Check',
      'Spaced Review Queue',
      'Study Methods Lab',
      'Run diagnostic'
    ];
    return phrases.filter(p=>text.includes(p));
  }

  const UI_LANGUAGE_OPTIONS=[['nl','Dutch'],['en','English'],['es','Spanish'],['fr','French'],['de','Deutch'],['pt','Portugues'],['it','Italian']];
  function languageSelectorExact(sel){
    if(!sel)return false;
    const rows=[...sel.options].map(o=>[String(o.value||''),String(o.textContent||'').trim()]);
    return rows.length===UI_LANGUAGE_OPTIONS.length&&UI_LANGUAGE_OPTIONS.every(([v,n],i)=>rows[i]?.[0]===v&&rows[i]?.[1]===n);
  }

  function health(){
    const r=route(),school=$('#v50-school');
    const main=$('#v51-main'),topLogo=$('#v55-topbar .v55-brand-logo'),activeMode=$('#v29-home-layer .v29-type.active[data-mode],#v29-home-layer .v29-tab.active[data-mode]')?.dataset.mode||'',previewMode=$('#v29-home-layer .v32-preview-shell')?.dataset.v32Mode||'';
    const report={
      ok:true,
      release:'r126',
      route:r,
      runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[],
      duplicateIds:duplicateIds(),
      foreignSurfaceConflicts:foreignSurfaceConflicts(r),
      projectApi:!!window.__SCHOLARK_V64_PROJECTS__?.ready,
      projectMounted:r!=='project'||!!$('#v51-fallback .v64-projects'),
      projectSurfaceClear:r!=='project'||(!document.body.classList.contains('v51-schools')&&!document.body.classList.contains('v51-study')&&!document.body.classList.contains('v51-studio')&&!$('#v50-school')?.classList.contains('open')&&!$('#v25-study')?.classList.contains('open')&&!$('#v58-suite')?.classList.contains('open')&&!$('#v57-deck')?.classList.contains('open')&&!$('#v57-present')?.classList.contains('open')),
      projectSidebarVisible:r!=='project'||!document.body.classList.contains('v51-collapsed'),
      projectMainVisible:r!=='project'||!!main&&getComputedStyle(main).display!=='none',
      projectNavActive:r!=='project'||!!$('#v51-sidebar [data-v51-tool="project"].active'),
      studioMounted:r!=='studio'||!!$('#v41-studio-workspace:not([hidden])'),
      studioSidebarVisible:r!=='studio'||!document.body.classList.contains('v51-collapsed'),
      studioNavActive:r!=='studio'||!!$('#v51-sidebar [data-v51-tool="studio"].active'),
      studioSurfaceClear:r!=='studio'||(!$('#v50-school')?.classList.contains('open')&&!$('#v25-study')?.classList.contains('open')&&!$('#v25-book')?.classList.contains('open')),
      studioFirstPaintMs:Number(sessionStorage.getItem('scholark_studio_first_paint_ms')||0)||null,
      workspaceLanguage:r==='home'||document.documentElement.lang===(localStorage.getItem('scholark_ui_language')||'nl'),
      workspaceLanguageSelector:r==='home'||languageSelectorExact($('#v90-language'))&&$('#v90-language').value===(localStorage.getItem('scholark_ui_language')||'nl'),
      criticalLanguageLeaks:criticalLanguageLeaks(),
      bookApi:!!window.__SCHOLARK_V65_BOOK__,
      bookMounted:r!=='book'||!!$('#v51-fallback .v65-book'),
      bookSurfaceClear:r!=='book'||(!document.body.classList.contains('v51-schools')&&!document.body.classList.contains('v51-study')&&!document.body.classList.contains('v51-studio')&&!$('#v50-school')?.classList.contains('open')&&!$('#v25-study')?.classList.contains('open')),
      schoolApi:!!window.__SCHOLARK_V50_SCHOOL_FINDER__,
      schoolScrollable:r!=='schools'||!!school&&(school.scrollHeight>school.clientHeight?getComputedStyle(school).overflowY!=='hidden':true),
      homeWorkspaceLeak:r!=='home'||!main||getComputedStyle(main).display==='none',
      officialTopbarLogo:r!=='home'||!$('#v55-topbar')||!!topLogo&&/scholark-logo\.png/i.test(topLogo.getAttribute('src')||''),
      homeLanguageSelector:r!=='home'||languageSelectorExact($('#v55-language'))&&getComputedStyle($('#v55-language')).display!=='none'&&getComputedStyle($('#v55-language')).visibility!=='hidden',
      cinematicSync:r!=='home'||!activeMode||!previewMode||activeMode===previewMode
    };
    if(r==='home'&&!report.homeLanguageSelector){window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.();window.__SCHOLARK_I18N__?.upgradeSelectors?.();report.homeLanguageSelector=languageSelectorExact($('#v55-language'))}
    if(report.criticalLanguageLeaks.length){syncWorkspaceLanguage();window.__SCHOLARK_I18N__?.translateCurrentPage?.(false)}
    if(report.foreignSurfaceConflicts.length){repairForeignSurfaces(r);report.foreignSurfaceConflicts=foreignSurfaceConflicts(r)}
    report.ok=report.runtimeErrors.length===0&&report.duplicateIds.length===0&&report.foreignSurfaceConflicts.length===0&&report.schoolScrollable&&report.homeWorkspaceLeak&&report.officialTopbarLogo&&report.homeLanguageSelector&&report.cinematicSync&&report.projectMounted&&report.projectSurfaceClear&&report.projectSidebarVisible&&report.projectMainVisible&&report.projectNavActive&&report.studioMounted&&report.studioSidebarVisible&&report.studioNavActive&&report.studioSurfaceClear&&report.workspaceLanguage&&report.workspaceLanguageSelector&&report.criticalLanguageLeaks.length===0&&report.bookMounted&&report.bookSurfaceClear;
    try{sessionStorage.setItem('scholark_foundation_r126',JSON.stringify(report))}catch{}
    console[report.ok?'log':'warn']('[SCHOLARK] Foundation R126 '+(report.ok?'PASS':'WARN'),report);
    return report;
  }

  let invariantTimer=null,invariantObserver=null;
  function bindRouteInvariantObserver(){
    if(invariantObserver)return;
    invariantObserver=new MutationObserver(muts=>{
      const r=route();if(!['project','studio','book','home'].includes(r))return;
      const relevant=muts.some(m=>m.target===document.body||['v50-school','v25-study','v25-book','v41-studio-workspace','v51-main','v58-suite','v57-deck','v57-present'].includes(m.target?.id));
      if(!relevant)return;
      clearTimeout(invariantTimer);invariantTimer=setTimeout(repair,0);
    });
    invariantObserver.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class','hidden']});
  }

  addEventListener('scholark-language-applied',()=>{syncWorkspaceLanguage();setTimeout(repair,20)});
  addEventListener('scholark-language-ready',()=>{syncWorkspaceLanguage();setTimeout(health,160)});
  addEventListener('scholark-language-complete',()=>{syncWorkspaceLanguage();setTimeout(()=>{repair();health()},40)});
  addEventListener('scholark-route-painted',e=>{if(e.detail?.route==='studio')setTimeout(health,40)});
  addEventListener('hashchange',()=>{setTimeout(repair,35);setTimeout(health,500)});
  addEventListener('popstate',()=>setTimeout(repair,35));
  addEventListener('scholark-runtime-ready',()=>{bindRouteInvariantObserver();setTimeout(repair,60);setTimeout(health,800)});
  addEventListener('resize',()=>setTimeout(repair,120),{passive:true});
  [120,500,1400].forEach(ms=>setTimeout(()=>{bindRouteInvariantObserver();repair()},ms));
  setTimeout(health,2200);
  window.__SCHOLARK_FOUNDATION__={repair,health,resetHomeSurface,syncProjectSurface,syncStudioSurface,syncWorkspaceLanguage,syncBookSurface,repairForeignSurfaces,foreignSurfaceConflicts,release:'r126'};
})();
