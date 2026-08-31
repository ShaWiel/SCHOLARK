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
    $('#sv24-overlay')?.classList.remove('open');
    const home=$('#v29-home-layer');
    if(home){
      home.hidden=false;home.removeAttribute('aria-hidden');home.classList.add('v30-native-home');
      ['display','visibility','opacity','pointer-events','position','inset','top','left','right','bottom'].forEach(p=>home.style.removeProperty(p));
    }
    queueCinematics();
  }

  function syncProjectSurface(){
    if(route()!=='project')return;
    document.body.classList.add('v51-workspace');document.body.classList.remove('v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    $('#v41-studio-workspace')?.setAttribute('hidden','');$('#sv24-overlay')?.classList.remove('open');$('#v50-school')?.classList.remove('open');$('#v25-study')?.classList.remove('open');$('#v25-book')?.classList.remove('open');$('#v58-suite')?.classList.remove('open');$('#v57-deck')?.classList.remove('open');$('#v57-present')?.classList.remove('open');
    const native=$('.v51-native-host');if(native)native.classList.remove('v51-native-host');
    const main=$('#v51-main');if(main)main.style.setProperty('display','block','important');
    if(window.__SCHOLARK_V64_PROJECTS__?.open){
      setTimeout(()=>{if(route()==='project')window.__SCHOLARK_V64_PROJECTS__?.open?.()},0);
    }
  }

  function syncStudioSurface(){
    if(route()!=='studio')return;
    document.body.classList.add('v51-workspace','v51-studio','v41-studio-open');
    document.body.classList.remove('v51-pro','v51-schools','v51-study','v51-book');
    $('#sv24-overlay')?.classList.remove('open');$('#v50-school')?.classList.remove('open');$('#v25-study')?.classList.remove('open');$('#v25-book')?.classList.remove('open');
    const studio=$('#v41-studio-workspace');if(studio){studio.hidden=false;studio.removeAttribute('aria-hidden')}
    window.__SCHOLARK_STUDIO_WORKSPACE__?.open?.(null,{route:false});
  }

  let languageRepairTimer=null;
  function syncWorkspaceLanguage(){
    if(route()==='home')return;
    clearTimeout(languageRepairTimer);
    languageRepairTimer=setTimeout(()=>{
      const target=localStorage.getItem('scholark_ui_language')||'nl';
      if(document.documentElement.lang!==target)document.documentElement.lang=target;
      const roots=[$('#v51-sidebar'),$('#v51-main'),$('#v41-studio-workspace:not([hidden])'),$('#v50-school.open'),$('#v25-study.open'),$('#v51-fallback .v65-book'),$('#v51-fallback .v64-projects')].filter(Boolean);
      roots.forEach(r=>window.__SCHOLARK_I18N__?.apply?.(r));
      const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,180));
      idle(()=>window.__SCHOLARK_I18N__?.translateCurrentPage?.(false),{timeout:700});
    },15);
  }

  function syncBookSurface(){
    if(route()!=='book')return;
    document.body.classList.add('v51-workspace');
    document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v41-studio-open');
    $('#v41-studio-workspace')?.setAttribute('hidden','');
    $('#sv24-overlay')?.classList.remove('open');
    $('#v50-school')?.classList.remove('open');
    $('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
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

  function health(){
    const r=route(),school=$('#v50-school');
    const main=$('#v51-main'),topLogo=$('#v55-topbar .v55-brand-logo'),activeMode=$('#v29-home-layer .v29-type.active[data-mode],#v29-home-layer .v29-tab.active[data-mode]')?.dataset.mode||'',previewMode=$('#v29-home-layer .v32-preview-shell')?.dataset.v32Mode||'';
    const report={
      ok:true,
      release:'r120',
      route:r,
      runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[],
      duplicateIds:duplicateIds(),
      projectApi:!!window.__SCHOLARK_V64_PROJECTS__?.ready,
      projectMounted:r!=='project'||!!$('#v51-fallback .v64-projects'),
      projectSurfaceClear:r!=='project'||(!document.body.classList.contains('v51-schools')&&!document.body.classList.contains('v51-study')&&!document.body.classList.contains('v51-studio')&&!$('#v50-school')?.classList.contains('open')&&!$('#v25-study')?.classList.contains('open')),
      projectSidebarVisible:r!=='project'||!document.body.classList.contains('v51-collapsed'),
      studioMounted:r!=='studio'||!!$('#v41-studio-workspace:not([hidden])'),
      workspaceLanguage:r==='home'||document.documentElement.lang===(localStorage.getItem('scholark_ui_language')||'nl'),
      bookApi:!!window.__SCHOLARK_V65_BOOK__,
      bookMounted:r!=='book'||!!$('#v51-fallback .v65-book'),
      bookSurfaceClear:r!=='book'||(!document.body.classList.contains('v51-schools')&&!document.body.classList.contains('v51-study')&&!document.body.classList.contains('v51-studio')&&!$('#v50-school')?.classList.contains('open')&&!$('#v25-study')?.classList.contains('open')),
      schoolApi:!!window.__SCHOLARK_V50_SCHOOL_FINDER__,
      schoolScrollable:r!=='schools'||!!school&&(school.scrollHeight>school.clientHeight?getComputedStyle(school).overflowY!=='hidden':true),
      homeWorkspaceLeak:r!=='home'||!main||getComputedStyle(main).display==='none',
      officialTopbarLogo:r!=='home'||!$('#v55-topbar')||!!topLogo&&/scholark-logo\.png/i.test(topLogo.getAttribute('src')||''),
      homeLanguageSelector:r!=='home'||!!$('#v55-language')&&$('#v55-language').options.length===7&&getComputedStyle($('#v55-language')).display!=='none'&&getComputedStyle($('#v55-language')).visibility!=='hidden',
      cinematicSync:r!=='home'||!activeMode||!previewMode||activeMode===previewMode
    };
    if(r==='home'&&!report.homeLanguageSelector){window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.();report.homeLanguageSelector=!!$('#v55-language')&&$('#v55-language').options.length===7}
    report.ok=report.runtimeErrors.length===0&&report.duplicateIds.length===0&&report.schoolScrollable&&report.homeWorkspaceLeak&&report.officialTopbarLogo&&report.homeLanguageSelector&&report.cinematicSync&&report.projectMounted&&report.projectSurfaceClear&&report.projectSidebarVisible&&report.studioMounted&&report.workspaceLanguage&&report.bookMounted&&report.bookSurfaceClear;
    try{sessionStorage.setItem('scholark_foundation_r120',JSON.stringify(report))}catch{}
    console[report.ok?'log':'warn']('[SCHOLARK] Foundation R120 '+(report.ok?'PASS':'WARN'),report);
    return report;
  }

  addEventListener('scholark-language-applied',()=>{syncWorkspaceLanguage();setTimeout(repair,20)});
  addEventListener('scholark-language-ready',()=>{syncWorkspaceLanguage();setTimeout(health,160)});
  addEventListener('hashchange',()=>{setTimeout(repair,35);setTimeout(health,500)});
  addEventListener('popstate',()=>setTimeout(repair,35));
  addEventListener('scholark-runtime-ready',()=>{setTimeout(repair,60);setTimeout(health,800)});
  addEventListener('resize',()=>setTimeout(repair,120),{passive:true});
  [120,500,1400].forEach(ms=>setTimeout(repair,ms));
  setTimeout(health,2200);
  window.__SCHOLARK_FOUNDATION__={repair,health,resetHomeSurface,syncProjectSurface,syncStudioSurface,syncWorkspaceLanguage,syncBookSurface,release:'r120'};
})();
