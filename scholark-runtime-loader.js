(function runtimeLoader() {
  if (window.__SCHOLARK_RUNTIME_LOADER__) return;
  window.__SCHOLARK_RUNTIME_LOADER__ = true;
  window.__SCHOLARK_TEST_MODE__ = true;

  const VERSION = '20260902-r128';
  const ACTIVE = [
    'scholark-v24-ui.js','scholark-v25-enhancements.js','scholark-v27-voice-hotfix.js','scholark-v28-home-experience.js',
    'scholark-v29-home-overlay.js','scholark-v30-native-home-autodemo.js','scholark-v32-mode-preview.js','scholark-v33-preview-compat.js',
    'scholark-v35-pro-creator-limits.js','scholark-v36-workspace-i18n.js','scholark-v41-home-pricing-dashboard.js','scholark-v42-route-guard.js',
    'scholark-v43-studio-workspace.js','scholark-v45-studio-generation-brief.js','scholark-v50-school-finder.js','scholark-v51-workspace-shell.js',
    'scholark-v52-workspace-qa.js','scholark-v53-dashboard-bootstrap.js','scholark-v55-home-topbar-workspace-entry.js','scholark-v56-sidebar-cleanup.js',
    'scholark-v57-presentation-deck.js','scholark-v58-studio-artifact-suite.js','scholark-v59-studio-ai-engine.js','scholark-v60-presentation-ready.js',
    'scholark-v61-free-provider-messaging.js','scholark-v62-learning-ai.js','scholark-v63-presentation-visuals.js','scholark-v64-projects.js',
    'scholark-v65-book-studio.js','scholark-v66-presentation-ai-tools.js','scholark-v67-professional-exports.js','scholark-v68-slide-block-editor.js',
    'scholark-v69-reference-reader.js','scholark-v70-social-graphic-media.js','scholark-v71-research-agent.js','scholark-v72-cloud-projects.js',
    'scholark-v73-web-publishing.js','scholark-v74-presenter-pro.js','scholark-v75-document-pro.js','scholark-v76-graphic-canvas.js',
    'scholark-v77-webpage-pro.js','scholark-v78-artifact-sharing.js','scholark-v79-collaboration.js','scholark-v80-workspace-cloud.js',
    'scholark-v81-stability-foundation.js','scholark-v82-tutor-cloud.js','scholark-v83-study-ahead-cloud.js','scholark-v84-profile-cloud.js',
    'scholark-v85-credits-hud.js','scholark-v86-file-intelligence.js','scholark-v87-exam-mastery.js','scholark-v88-learning-engine.js',
    'scholark-v89-account-settings.js','scholark-v90-i18n-engine.js','scholark-v91-workspace-polish.js','scholark-v92-foundation-health.js',
    'scholark-v93-language-learner.js','scholark-v94-performance-foundation.js','scholark-v95-experience-polish.js','scholark-v96-country-education.js','scholark-v97-foundation-coordinator.js','scholark-v98-brand-migration.js','scholark-v99-home-foundation.js'
  ];
  const BASE = new Set([
    'scholark-v24-ui.js','scholark-v25-enhancements.js','scholark-v27-voice-hotfix.js','scholark-v32-mode-preview.js',
    'scholark-v33-preview-compat.js','scholark-v35-pro-creator-limits.js','scholark-v42-route-guard.js',
    'scholark-v55-home-topbar-workspace-entry.js','scholark-v81-stability-foundation.js','scholark-v90-i18n-engine.js',
    'scholark-v92-foundation-health.js','scholark-v94-performance-foundation.js','scholark-v95-experience-polish.js','scholark-v96-country-education.js','scholark-v97-foundation-coordinator.js','scholark-v98-brand-migration.js','scholark-v99-home-foundation.js'
  ]);
  const HOME = ['scholark-v28-home-experience.js','scholark-v29-home-overlay.js','scholark-v30-native-home-autodemo.js','scholark-v41-home-pricing-dashboard.js'];
  const WORKSPACE = [
    'scholark-v36-workspace-i18n.js','scholark-v43-studio-workspace.js','scholark-v51-workspace-shell.js','scholark-v52-workspace-qa.js','scholark-v53-dashboard-bootstrap.js',
    'scholark-v56-sidebar-cleanup.js','scholark-v61-free-provider-messaging.js','scholark-v64-projects.js','scholark-v72-cloud-projects.js','scholark-v80-workspace-cloud.js',
    'scholark-v84-profile-cloud.js','scholark-v85-credits-hud.js','scholark-v88-learning-engine.js','scholark-v89-account-settings.js',
    'scholark-v91-workspace-polish.js'
  ];
  const FEATURES = {
    studio:['scholark-v43-studio-workspace.js','scholark-v45-studio-generation-brief.js','scholark-v59-studio-ai-engine.js'],
    tutor:['scholark-v62-learning-ai.js','scholark-v82-tutor-cloud.js','scholark-v87-exam-mastery.js'],
    education:['scholark-v62-learning-ai.js','scholark-v82-tutor-cloud.js','scholark-v87-exam-mastery.js'],
    schools:['scholark-v50-school-finder.js'],
    study:['scholark-v62-learning-ai.js','scholark-v83-study-ahead-cloud.js'],
    language:['scholark-v93-language-learner.js'],
    files:['scholark-v69-reference-reader.js','scholark-v86-file-intelligence.js'],
    project:['scholark-v64-projects.js','scholark-v78-artifact-sharing.js','scholark-v79-collaboration.js'],
    book:['scholark-v65-book-studio.js','scholark-v67-professional-exports.js','scholark-v69-reference-reader.js']
  };
  const STUDIO_CORE=[...FEATURES.studio];
  const STUDIO_HEAVY=[
    'scholark-v57-presentation-deck.js','scholark-v58-studio-artifact-suite.js','scholark-v60-presentation-ready.js','scholark-v63-presentation-visuals.js',
    'scholark-v66-presentation-ai-tools.js','scholark-v67-professional-exports.js','scholark-v68-slide-block-editor.js','scholark-v69-reference-reader.js',
    'scholark-v70-social-graphic-media.js','scholark-v71-research-agent.js','scholark-v73-web-publishing.js','scholark-v74-presenter-pro.js',
    'scholark-v75-document-pro.js','scholark-v76-graphic-canvas.js','scholark-v77-webpage-pro.js','scholark-v78-artifact-sharing.js','scholark-v79-collaboration.js'
  ];

  const current = document.currentScript;
  const baseUrl = current?.src ? new URL('.', current.src) : new URL('.', location.href);
  const loaded = new Set(), errors = [], inflight = new Map(), preloaded = new Set();
  let foregroundChain = Promise.resolve(), backgroundChain = Promise.resolve(), replaying = false, busy = 0;
  const html = document.documentElement;
  const staticPage = /\/(privacy|terms|refunds|safety)(?:\.html)?$/i.test(location.pathname);

  const style = document.createElement('style');
  style.id = 'scholark-runtime-loader-style';
  style.textContent = 'html.scholark-route-loading::before{content:"";position:fixed;z-index:2147483647;top:0;left:0;height:2px;width:32%;background:#c9ff6a;box-shadow:0 0 14px rgba(201,255,106,.65);animation:schRuntimeLoad .75s ease-in-out infinite alternate;pointer-events:none}@keyframes schRuntimeLoad{from{transform:translateX(-35vw)}to{transform:translateX(330vw)}}';
  document.head.appendChild(style);

  function routeKey(hash = location.hash) {
    const h = String(hash || '').toLowerCase().replace(/^#/, '');
    if (!h || h === 'home' || h === 'pricing') return 'home';
    if (/^(presentation|webpage|document|report|graphic|social|studio)/.test(h)) return 'studio';
    for (const key of ['schools','study','book','tutor','education','language','files','project','planner','progress','goal']) if (h.startsWith(key)) return key;
    return 'dashboard';
  }
  function required(key) {
    const set = new Set(BASE);
    if (key === 'home') HOME.forEach(x => set.add(x));
    else {
      WORKSPACE.forEach(x => set.add(x));
      (FEATURES[key] || []).forEach(x => set.add(x));
    }
    return ACTIVE.filter(file => set.has(file));
  }
  function yieldMain() {
    try { if (globalThis.scheduler?.yield) return globalThis.scheduler.yield(); } catch {}
    return new Promise(resolve => setTimeout(resolve, 0));
  }
  function preloadOne(file){
    if(preloaded.has(file)||loaded.has(file))return;
    preloaded.add(file);
    const l=document.createElement('link');l.rel='preload';l.as='script';l.href=new URL(file+'?v='+VERSION,baseUrl).href;l.dataset.scholarkPreload=file;
    document.head.appendChild(l);
  }
  function preloadFiles(files){files.forEach(preloadOne)}
  function loadOne(file) {
    if (loaded.has(file)) return Promise.resolve(true);
    if (inflight.has(file)) return inflight.get(file);
    const promise=new Promise(resolve => {
      const s = document.createElement('script');
      s.async = false;
      s.dataset.scholarkModule = file;
      s.src = new URL(file + '?v=' + VERSION, baseUrl).href;
      s.onload = () => { loaded.add(file); inflight.delete(file); s.dataset.loaded = '1'; resolve(true); };
      s.onerror = () => { inflight.delete(file); errors.push(file); console.error('[SCHOLARK] Runtime module failed:', file); resolve(false); };
      document.head.appendChild(s);
    });
    inflight.set(file,promise);
    return promise;
  }
  function ensureFiles(files, indicator = false, background = false) {
    const run=async()=>{
      if (indicator) { busy++; html.classList.add('scholark-route-loading'); }
      try {
        for (const file of files) {
          if (loaded.has(file)) continue;
          await loadOne(file);
          await yieldMain();
        }
      } finally {
        if (indicator) {
          busy = Math.max(0, busy - 1);
          if (!busy) html.classList.remove('scholark-route-loading');
        }
      }
    };
    if(background){
      backgroundChain=backgroundChain.catch(()=>{}).then(run);
      return backgroundChain;
    }
    foregroundChain=foregroundChain.catch(()=>{}).then(run);
    return foregroundChain;
  }
  function ensure(key, indicator = false) {
    return ensureFiles(required(key), indicator, false);
  }
  function prewarmStudioCore(){
    preloadFiles(STUDIO_CORE);
    setTimeout(()=>ensureFiles(STUDIO_CORE,false,true),20);
  }
  function prefetchStudioHeavy(){
    // Cache heavy Studio modules without executing them. Background execution
    // used to block unrelated foreground routes such as My Projects.
    const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,320));
    idle(()=>preloadFiles(STUDIO_HEAVY),{timeout:900});
  }
  function toolKey(target) {
    const direct = target?.closest?.('[data-v51-tool]');
    if (direct?.dataset.v51Tool) return direct.dataset.v51Tool;
    const future = target?.closest?.('[data-future]');
    if (future?.dataset.future) return future.dataset.future === 'schools' ? 'schools' : 'study';
    if (target?.closest?.('#v55-workspace-entry,#v41-workspace-home,[data-workspace-entry]')) return 'dashboard';
    return '';
  }

  const warmTarget=e=>{
    const key=toolKey(e.target);
    if(key==='studio'){preloadFiles(STUDIO_CORE);ensureFiles(STUDIO_CORE,false,true)}
    else if(key==='project'){preloadFiles(FEATURES.project);ensureFiles(FEATURES.project,false,true)}
  };
  document.addEventListener('pointerover',warmTarget,{passive:true,capture:true});
  document.addEventListener('focusin',warmTarget,true);

  document.addEventListener('click', e => {
    if (replaying || staticPage) return;
    const generate=e.target.closest?.('#v41-studio-workspace .v41-generate');
    if(generate&&STUDIO_HEAVY.some(file=>!loaded.has(file))){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      ensureFiles(STUDIO_HEAVY,true).then(()=>{if(!generate.isConnected)return;replaying=true;try{generate.click()}finally{replaying=false}});
      return;
    }
    const key = toolKey(e.target);
    const target = e.target.closest?.('[data-v51-tool],[data-future],#v55-workspace-entry,#v41-workspace-home,[data-workspace-entry]');

    // Route-first loading: Studio and My Projects should paint their own shell
    // before optional engines, sharing or export modules finish loading.
    if(key==='studio'){
      if(!target)return;
      if(loaded.has('scholark-v43-studio-workspace.js')){
        if(STUDIO_CORE.some(file=>!loaded.has(file)))ensureFiles(STUDIO_CORE,false,true);
        prefetchStudioHeavy();
        return;
      }
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      ensureFiles(['scholark-v43-studio-workspace.js'],true,false).then(()=>{
        replaying=true;
        try{window.__SCHOLARK_WORKSPACE__?.openTool?.('studio')}finally{replaying=false}
        ensureFiles(STUDIO_CORE.filter(file=>file!=='scholark-v43-studio-workspace.js'),false,true);
        prefetchStudioHeavy();
      });
      return;
    }
    if(key==='project'){
      if(!target)return;
      if(loaded.has('scholark-v64-projects.js')){
        const rest=FEATURES.project.filter(file=>file!=='scholark-v64-projects.js'&&!loaded.has(file));
        if(rest.length)ensureFiles(rest,false,true);
        return;
      }
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      ensureFiles(['scholark-v64-projects.js'],true,false).then(()=>{
        replaying=true;
        try{window.__SCHOLARK_WORKSPACE__?.openTool?.('project')}finally{replaying=false}
        const rest=FEATURES.project.filter(file=>file!=='scholark-v64-projects.js');
        ensureFiles(rest,false,true);
      });
      return;
    }

    if (!key || !required(key).some(file => !loaded.has(file))) return;
    if (!target) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    ensure(key, true).then(() => {
      replaying = true;
      try {
        const workspace=window.__SCHOLARK_WORKSPACE__;
        if(target.isConnected)target.click();
        else if(workspace?.openTool&&key!=='home')workspace.openTool(key);
      } finally { replaying = false; }
    });
  }, true);

  addEventListener('hashchange', () => {
    if (staticPage) return;
    const key = routeKey();
    ensure(key, true).then(() => {
      if (key === 'home') window.__SCHOLARK_V30_DEMO__?.start?.();
      else prewarmStudioCore();
      if (key === 'studio') prefetchStudioHeavy();
    });
  });
  addEventListener('popstate', () => { if (!staticPage) ensure(routeKey(), true); });

  window.__SCHOLARK_RUNTIME__ = {
    version:VERSION, route:routeKey, ensure:key => ensure(key || routeKey(), true),
    prewarmStudio:prewarmStudioCore,prefetchStudio:prefetchStudioHeavy,
    loaded:() => [...loaded], errors:() => [...errors], activeCount:ACTIVE.length
  };

  (async () => {
    if (staticPage) return;
    preloadFiles([...STUDIO_CORE,...FEATURES.project]);
    html.classList.add('scholark-runtime-loading');
    const key = routeKey();
    await ensure(key, false);
    html.classList.remove('scholark-runtime-loading');
    if (key === 'home') { window.__SCHOLARK_V30_DEMO__?.start?.(); prewarmStudioCore(); }
    else prewarmStudioCore();
    if (key === 'studio') prefetchStudioHeavy();
    window.dispatchEvent(new CustomEvent('scholark-runtime-ready',{detail:{route:key,version:VERSION}}));
  })().catch(err => {
    html.classList.remove('scholark-runtime-loading','scholark-route-loading');
    console.error('[SCHOLARK] Runtime boot failed:', err);
  });
})();
