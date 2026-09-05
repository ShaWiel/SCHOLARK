(() => {
  if (window.__SCHOLARK_V101_CORE_FOUNDATION__) return;
  window.__SCHOLARK_V101_CORE_FOUNDATION__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const RELEASE='r133';
  const route=()=>String(location.hash||'#home').toLowerCase().replace(/^#/,'').split(/[\/-]/)[0]||'home';
  const studioRoutes=new Set(['studio','presentation','webpage','document','report','graphic','social']);
  let scheduled=0, repairing=false, lastRoute='';

  function closeForeign(r){
    if(!studioRoutes.has(r)){
      $('#v41-studio-workspace')?.setAttribute('hidden','');
      $('#v58-suite')?.classList.remove('open');
      $('#v57-deck')?.classList.remove('open');
      $('#v57-present')?.classList.remove('open');
    }
    if(r!=='schools') $('#v50-school')?.classList.remove('open');
    if(r!=='study') $('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
    if(r!=='home') document.body.classList.remove('v55-public-home');
  }

  function syncHome(){
    if(route()!=='home') return;
    document.body.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    document.body.classList.add('v55-public-home');
    const home=$('#v29-home-layer');
    if(home){home.hidden=false;home.removeAttribute('aria-hidden');['display','visibility','opacity','pointer-events'].forEach(p=>home.style.removeProperty(p));}
    window.__SCHOLARK_V55_TOPBAR__?.sync?.();
    window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.();
    window.__SCHOLARK_V29_HOME__?.sync?.();
    window.__SCHOLARK_V100_CINEMATICS__?.sync?.();
    window.__SCHOLARK_V32_PREVIEW__?.ensure?.();
    if(window.__SCHOLARK_V30_DEMO__?.isRunning?.()===false) window.__SCHOLARK_V30_DEMO__?.start?.();
  }

  function syncWorkspace(r){
    if(r==='home') return;
    document.body.classList.add('v51-workspace');
    document.body.classList.remove('v55-public-home');
    const lang=localStorage.getItem('scholark_ui_language')||'nl';
    if(document.documentElement.lang!==lang) document.documentElement.lang=lang;
    window.__SCHOLARK_COUNTRY__?.apply?.();
    window.__SCHOLARK_WORKSPACE__?.syncLanguage?.();
    if(r==='project'){
      window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);
      if(!$('#v51-fallback .v64-projects')) window.__SCHOLARK_V64_PROJECTS__?.open?.();
    }
    if(r==='book'){
      window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);
      if(!$('#v51-fallback .v65-book')) window.__SCHOLARK_V65_BOOK__?.open?.();
    }
    if(r==='studio'){
      window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);
      const s=$('#v41-studio-workspace');
      if(s?.hidden) window.__SCHOLARK_STUDIO_WORKSPACE__?.open?.(null,{route:false,fast:true});
    }
  }

  function repair(){
    scheduled=0;
    if(repairing) return;
    repairing=true;
    try{
      const r=route();
      closeForeign(r);
      if(r==='home') syncHome(); else syncWorkspace(r);
      lastRoute=r;
      document.documentElement.dataset.scholarkRelease=RELEASE;
    } finally { repairing=false; }
  }

  function schedule(delay=0){
    if(scheduled) clearTimeout(scheduled);
    scheduled=setTimeout(()=>requestAnimationFrame(repair),delay);
  }

  function duplicateIds(){
    const seen=new Set(),dupes=new Set();
    $$('[id]').forEach(el=>seen.has(el.id)?dupes.add(el.id):seen.add(el.id));
    return [...dupes];
  }

  function health(){
    const r=route();
    const runtimeVersion=window.__SCHOLARK_RUNTIME__?.version||'';
    const previewOk=r!=='home'||window.__SCHOLARK_V32_PREVIEW__?.healthy?.()===true;
    const foreign=[];
    if(!studioRoutes.has(r)&&$('#v41-studio-workspace:not([hidden])')) foreign.push('studio');
    if(r!=='schools'&&$('#v50-school.open')) foreign.push('schools');
    if(r!=='study'&&$('#v25-study.open')) foreign.push('study');
    const report={release:RELEASE,route:r,runtimeVersion,runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[],duplicateIds:duplicateIds(),previewOk,foreignSurfaces:foreign,lastRoute};
    report.ok=!report.runtimeErrors.length&&!report.duplicateIds.length&&previewOk&&!foreign.length;
    return report;
  }

  addEventListener('hashchange',()=>schedule(0));
  addEventListener('popstate',()=>schedule(0));
  addEventListener('pageshow',()=>schedule(20));
  addEventListener('focus',()=>schedule(40));
  addEventListener('scholark-runtime-ready',()=>schedule(0));
  addEventListener('scholark-language-applied',()=>schedule(20));
  addEventListener('scholark-language-complete',()=>schedule(20));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(20)});

  // Low-frequency safety pass: catches stale overlays without creating a render loop.
  setInterval(()=>{
    const h=health();
    if(!h.ok) schedule(0);
  },5000);

  [0,80,250,700,1600].forEach(ms=>setTimeout(()=>schedule(0),ms));
  window.__SCHOLARK_FOUNDATION__={release:RELEASE,repair:()=>schedule(0),health};
})();