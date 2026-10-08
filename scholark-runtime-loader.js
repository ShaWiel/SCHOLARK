(function runtimeLoader() {
  const path = String(location.pathname || '/').replace(/\/+$/, '') || '/';
  if (path !== '/' && path !== '/index.html') return;
  if (window.__SCHOLARK_RUNTIME_LOADER__) return;
  window.__SCHOLARK_RUNTIME_LOADER__ = true;
  window.__SCHOLARK_TEST_MODE__ = /^(localhost|127\.0\.0\.1)$/i.test(String(location.hostname||''));
  const appPath = () => { const p=String(location.pathname||'/').replace(/\/+$/,'')||'/'; return p==='/'||p==='/index.html'; };
  const authCallbackHash = (hash=location.hash) => /(^|&)access_token=/.test(String(hash||'').replace(/^#/,''));
  const pendingAuthCallback = () => {
    if(authCallbackHash()) return true;
    try{return authCallbackHash(sessionStorage.getItem('scholark_auth_callback_hash_v1')||'')}catch{return false}
  };
  // Preserve Supabase's fragment callback before any route/home repair can rewrite location.hash.
  // V72 consumes and clears this one-shot value after restoring the authenticated session.
  try {
    const initialAuthHash=String(location.hash||'');
    if(authCallbackHash(initialAuthHash)) sessionStorage.setItem('scholark_auth_callback_hash_v1',initialAuthHash);
  } catch {}
  const routeHash = () => authCallbackHash() ? 'home' : String(location.hash||'').toLowerCase().replace(/^#/,'').split(/[?&]/)[0].replace(/\/+$/,'');
  const creditStore = () => appPath() && routeHash()==='credit-store';
  const landingHome = () => appPath() && ['', 'home', 'pricing', 'start'].includes(routeHash());
  const publicHome = () => landingHome() || creditStore();
  window.__SCHOLARK_ROUTES__ = Object.freeze({isAppPath:appPath,hash:routeHash,isHome:publicHome,isLanding:landingHome,isCreditStore:creditStore,homeKeys:Object.freeze(['home','pricing','start','credit-store'])});
  window.__SCHOLARK_FEATURE_FLAGS__ = Object.assign({},window.__SCHOLARK_FEATURE_FLAGS__||{},{studio:false,book:false,release:'r221'});

  const VERSION = '20261007-r221';
  const ASSET_VERSION = file => ({
    'scholark-v55-home-topbar-workspace-entry.js':'20261008-v55-profile-r225',
    'scholark-v93-language-learner.js':'20261008-v93-adaptive-library-r226',
    'scholark-v106-workspace-power-tools.js':'20261008-v106-focus-r226',
    'scholark-v107-general-ai.js':'20261008-v107-context-safe-r227',
    'scholark-v110-workspace-core.js':'20261008-v110-context-safe-r227',
    'scholark-v120-experience-controls.js':'20261008-v120-r226',
    'scholark-v85-credits-hud.js':'20261008-v85-wallet-r224'
  })[file] || VERSION;
  const ACTIVE = [
    'scholark-v29-home-overlay.js','scholark-v30-native-home-autodemo.js','scholark-v32-mode-preview.js','scholark-v33-preview-compat.js',
    'scholark-v36-workspace-i18n.js','scholark-v41-home-pricing-dashboard.js','scholark-v42-route-guard.js',
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
    'scholark-v93-language-learner.js','scholark-v102-language-quiz.js','scholark-v103-language-next-lesson.js','scholark-v94-performance-foundation.js','scholark-v95-experience-polish.js','scholark-v96-country-education.js','scholark-v110-workspace-core.js','scholark-v106-workspace-power-tools.js','scholark-v107-general-ai.js','scholark-v108-workspace-upgrade.js','scholark-v111-workspace-experience.js','scholark-v112-workspace-visual-system.js','scholark-v114-workspace-orchestrator.js','scholark-v113-foundation-hardening.js','scholark-v109-home-owner.js',
    'scholark-v98-brand-migration.js','scholark-v99-home-foundation.js','scholark-v115-billing.js','scholark-v116-launch-foundation.js','scholark-v117-credit-store.js','scholark-v118-account-security.js','scholark-v119-foundation-polish.js','scholark-v120-experience-controls.js'
  ];
  const BASE = new Set([
    'scholark-v42-route-guard.js',
    'scholark-v72-cloud-projects.js','scholark-v81-stability-foundation.js','scholark-v85-credits-hud.js','scholark-v90-i18n-engine.js',
    'scholark-v92-foundation-health.js','scholark-v94-performance-foundation.js','scholark-v95-experience-polish.js','scholark-v96-country-education.js',
    'scholark-v98-brand-migration.js','scholark-v115-billing.js','scholark-v116-launch-foundation.js','scholark-v118-account-security.js','scholark-v119-foundation-polish.js'
  ]);
  const HOME = ['scholark-v32-mode-preview.js','scholark-v33-preview-compat.js','scholark-v109-home-owner.js','scholark-v29-home-overlay.js','scholark-v30-native-home-autodemo.js','scholark-v41-home-pricing-dashboard.js','scholark-v55-home-topbar-workspace-entry.js','scholark-v99-home-foundation.js','scholark-v117-credit-store.js'];
  const WORKSPACE = [
    'scholark-v36-workspace-i18n.js','scholark-v51-workspace-shell.js','scholark-v53-dashboard-bootstrap.js',
    'scholark-v56-sidebar-cleanup.js','scholark-v61-free-provider-messaging.js','scholark-v72-cloud-projects.js','scholark-v80-workspace-cloud.js',
    'scholark-v85-credits-hud.js','scholark-v110-workspace-core.js','scholark-v108-workspace-upgrade.js','scholark-v111-workspace-experience.js','scholark-v112-workspace-visual-system.js','scholark-v114-workspace-orchestrator.js','scholark-v113-foundation-hardening.js','scholark-v120-experience-controls.js'
  ];
  const WORKSPACE_IDLE = ['scholark-v84-profile-cloud.js','scholark-v89-account-settings.js','scholark-v91-workspace-polish.js'];
  const FEATURES = {
    studio:[],
    ai:['scholark-v107-general-ai.js'],
    tutor:['scholark-v52-workspace-qa.js','scholark-v62-learning-ai.js','scholark-v82-tutor-cloud.js','scholark-v87-exam-mastery.js'],
    education:['scholark-v52-workspace-qa.js','scholark-v62-learning-ai.js','scholark-v82-tutor-cloud.js','scholark-v87-exam-mastery.js','scholark-v88-learning-engine.js'],
    planner:['scholark-v52-workspace-qa.js'],
    progress:['scholark-v52-workspace-qa.js'],
    goal:['scholark-v52-workspace-qa.js'],
    schools:['scholark-v50-school-finder.js'],
    study:['scholark-v62-learning-ai.js','scholark-v83-study-ahead-cloud.js'],
    language:['scholark-v93-language-learner.js','scholark-v102-language-quiz.js','scholark-v103-language-next-lesson.js'],
    files:['scholark-v69-reference-reader.js','scholark-v86-file-intelligence.js'],
    project:['scholark-v64-projects.js','scholark-v78-artifact-sharing.js','scholark-v79-collaboration.js'],
    book:[],
    focus:['scholark-v106-workspace-power-tools.js'],
    flashcards:['scholark-v106-workspace-power-tools.js'],
    assignments:['scholark-v106-workspace-power-tools.js']
  };
  const STUDIO_CORE = [];
  const STUDIO_HEAVY = [];

  const current = document.currentScript;
  const baseUrl = current?.src ? new URL('.', current.src) : new URL('.', location.href);
  const loaded = new Set(), inflight = new Map(), preloaded = new Set(), failures = new Map();
  let foregroundChain = Promise.resolve(true), backgroundChain = Promise.resolve(true), replaying = false, busy = 0, routeLoadTimer = 0, routeLoadEpoch = 0;
  const html = document.documentElement;

  if (!document.getElementById('scholark-runtime-loader-style')) {
    const style = document.createElement('style');
    style.id = 'scholark-runtime-loader-style';
    style.textContent = 'html.scholark-route-loading::before{content:"";position:fixed;z-index:2147483647;top:0;left:0;height:2px;width:32%;background:#c9ff6a;box-shadow:0 0 14px rgba(201,255,106,.65);animation:schRuntimeLoad .75s ease-in-out infinite alternate;pointer-events:none}@keyframes schRuntimeLoad{from{transform:translateX(-35vw)}to{transform:translateX(330vw)}}';
    document.head.appendChild(style);
  }

  function routeKey(hash = location.hash) {
    if (authCallbackHash(hash)) return 'home';
    const h = String(hash || '').toLowerCase().replace(/^#/, '').split(/[?&]/)[0];
    if (!h || h === 'home' || h === 'pricing' || h === 'start' || h === 'credit-store') return 'home';
    if (/^(presentation|webpage|document|report|graphic|social|studio)/.test(h)) return 'studio';
    for (const key of ['schools','study','book','ai','tutor','education','language','files','project','planner','focus','flashcards','assignments','progress','goal']) if (h.startsWith(key)) return key;
    return 'dashboard';
  }

  const LOCALE_FIRST=['scholark-v90-i18n-engine.js','scholark-v96-country-education.js','scholark-v110-workspace-core.js'];
  const HOME_FIRST=['scholark-v55-home-topbar-workspace-entry.js','scholark-v109-home-owner.js','scholark-v72-cloud-projects.js'];
  function required(key) {
    const set = new Set(BASE);
    if (key === 'home') HOME.forEach(x => set.add(x));
    else {
      WORKSPACE.forEach(x => set.add(x));
      (FEATURES[key] || []).forEach(x => set.add(x));
    }
    const chosen=ACTIVE.filter(file => set.has(file));
    const authFirst=(key==='home'&&pendingAuthCallback())?['scholark-v72-cloud-projects.js']:[];
    const first=[...authFirst,...LOCALE_FIRST,...((key==='home')?HOME_FIRST:[])].filter((file,i,a)=>chosen.includes(file)&&a.indexOf(file)===i);
    const ordered=[...first,...chosen.filter(file=>!first.includes(file))];
    if(key!=='home'){
      const tail=['scholark-v111-workspace-experience.js','scholark-v112-workspace-visual-system.js','scholark-v114-workspace-orchestrator.js','scholark-v113-foundation-hardening.js'];
      return [...ordered.filter(x=>!tail.includes(x)),...tail.filter(x=>ordered.includes(x))];
    }
    return ordered;
  }

  function yieldMain() {
    try { if (globalThis.scheduler?.yield) return globalThis.scheduler.yield(); } catch {}
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  function preloadOne(file) {
    if (preloaded.has(file) || loaded.has(file)) return;
    preloaded.add(file);
    const l = document.createElement('link');
    l.rel = 'preload'; l.as = 'script'; l.fetchPriority='high'; l.href = new URL(file + '?v=' + ASSET_VERSION(file), baseUrl).href;
    l.dataset.scholarkPreload = file;
    document.head.appendChild(l);
  }
  const uniqueFiles=files=>[...new Set((files||[]).filter(Boolean))];
  const PRELOAD_CAP=10, YIELD_EVERY=4;
  function preloadFiles(files,limit=PRELOAD_CAP) { uniqueFiles(files).slice(0,Math.max(0,limit)).forEach(preloadOne); }

  function oneAttempt(file, attempt) {
    return new Promise(resolve => {
      const s = document.createElement('script');
      let settled = false;
      const finish = ok => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        if (!ok) s.remove();
        resolve(ok);
      };
      const timeout = setTimeout(() => finish(false), 15000);
      s.async = false;
      s.dataset.scholarkModule = file;
      s.dataset.scholarkAttempt = String(attempt);
      s.src = new URL(file + '?v=' + ASSET_VERSION(file) + (attempt===1?'':'&retry='+attempt), baseUrl).href;
      s.onload = () => finish(true);
      s.onerror = () => finish(false);
      document.head.appendChild(s);
    });
  }

  function loadOne(file) {
    if (loaded.has(file)) return Promise.resolve(true);
    if (inflight.has(file)) return inflight.get(file);
    const promise = (async () => {
      for (let attempt = 1; attempt <= 3; attempt++) {
        if (attempt > 1) await new Promise(r => setTimeout(r, 180 * attempt));
        const ok = await oneAttempt(file, attempt);
        if (ok) {
          loaded.add(file);
          failures.delete(file);
          return true;
        }
      }
      failures.set(file, { at:Date.now(), attempts:3 });
      console.error('[SCHOLARK] Runtime module failed after retries:', file);
      return false;
    })().finally(() => inflight.delete(file));
    inflight.set(file, promise);
    return promise;
  }

  function ensureFiles(files, indicator=false, background=false) {
    files=uniqueFiles(files);
    const run = async () => {
      let allOk = true;
      if (indicator) { busy++; html.classList.add('scholark-route-loading'); }
      try {
        let burst=0;
        for (const file of files) {
          if (loaded.has(file)) continue;
          if (!await loadOne(file)) allOk = false;
          if (++burst>=YIELD_EVERY) { burst=0; await yieldMain(); }
        }
        return allOk;
      } finally {
        if (indicator) {
          busy = Math.max(0, busy - 1);
          if (!busy) html.classList.remove('scholark-route-loading');
        }
      }
    };
    if (background) {
      backgroundChain = backgroundChain.catch(() => false).then(run);
      return backgroundChain;
    }
    foregroundChain = foregroundChain.catch(() => false).then(run);
    return foregroundChain;
  }

  function ensure(key, indicator=false) {
    const files=required(key);
    preloadFiles(files);
    return ensureFiles(files, indicator, false);
  }
  function prewarmStudioCore() {
    preloadFiles(STUDIO_CORE);
    setTimeout(() => ensureFiles(STUDIO_CORE, false, true), 20);
  }
  let workspaceIdleScheduled=false;
  function prewarmWorkspaceIdle(){
    if(workspaceIdleScheduled)return;
    workspaceIdleScheduled=true;
    const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,450));
    idle(()=>{
      preloadFiles(WORKSPACE_IDLE);
      ensureFiles(WORKSPACE_IDLE,false,true);
    },{timeout:1400});
  }
  function prefetchStudioHeavy() {
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 320));
    idle(() => preloadFiles(STUDIO_HEAVY), {timeout:900});
  }

  function toolKey(target) {
    const direct = target?.closest?.('[data-v51-tool]');
    if (direct?.dataset.v51Tool) return direct.dataset.v51Tool;
    const future = target?.closest?.('[data-future]');
    if (future?.dataset.future) return future.dataset.future === 'schools' ? 'schools' : 'study';
    if (target?.closest?.('#v55-workspace-entry,#v41-workspace-home,[data-workspace-entry]')) return 'dashboard';
    return '';
  }

  const warmTarget = e => {
    const key = toolKey(e.target);
    if (key === 'studio') { preloadFiles(STUDIO_CORE); ensureFiles(STUDIO_CORE, false, true); }
    else if (key === 'project') { preloadFiles(FEATURES.project); ensureFiles(FEATURES.project, false, true); }
  };
  document.addEventListener('pointerover', warmTarget, {passive:true,capture:true});
  document.addEventListener('focusin', warmTarget, true);

  document.addEventListener('click', e => {
    if (replaying) return;
    const account=e.target.closest?.('#v51-account,[data-v55-account="manage"]');
    if(account&&!loaded.has('scholark-v89-account-settings.js')){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      ensureFiles(['scholark-v89-account-settings.js'],true).then(ok=>{
        if(!ok||!account.isConnected)return;
        replaying=true;try{account.click()}finally{replaying=false}
      });
      return;
    }
    const generate = e.target.closest?.('#v41-studio-workspace .v41-generate');
    if (generate && STUDIO_HEAVY.some(file => !loaded.has(file))) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      ensureFiles(STUDIO_HEAVY, true).then(ok => {
        if (!ok || !generate.isConnected) return;
        replaying = true; try { generate.click(); } finally { replaying = false; }
      });
      return;
    }

    const key = toolKey(e.target);
    const target = e.target.closest?.('[data-v51-tool],[data-future],#v55-workspace-entry,#v41-workspace-home,[data-workspace-entry]');
    if (!key || !target) return;

    if (key === 'studio' && !loaded.has('scholark-v43-studio-workspace.js')) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      ensureFiles(['scholark-v43-studio-workspace.js'], true).then(ok => {
        if (!ok) return;
        replaying = true; try { window.__SCHOLARK_WORKSPACE__?.openTool?.('studio'); } finally { replaying = false; }
        ensureFiles(STUDIO_CORE.filter(f => f !== 'scholark-v43-studio-workspace.js'), false, true);
        prefetchStudioHeavy();
      });
      return;
    }

    if (key === 'project' && !loaded.has('scholark-v64-projects.js')) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      ensureFiles(['scholark-v64-projects.js'], true).then(ok => {
        if (!ok) return;
        replaying = true; try { window.__SCHOLARK_WORKSPACE__?.openTool?.('project'); } finally { replaying = false; }
        ensureFiles(FEATURES.project.filter(f => f !== 'scholark-v64-projects.js'), false, true);
      });
      return;
    }

    if (!required(key).some(file => !loaded.has(file))) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    ensure(key, true).then(ok => {
      if (!ok) return;
      replaying = true;
      try {
        if (target.isConnected) target.click();
        else if (key !== 'home') window.__SCHOLARK_WORKSPACE__?.openTool?.(key);
      } finally { replaying = false; }
    });
  }, true);

  function afterRouteLoad(key) {
    if (key === 'home') window.__SCHOLARK_V30_DEMO__?.start?.();
    else {
      prewarmStudioCore();
      prewarmWorkspaceIdle();
    }
    if (key === 'studio') prefetchStudioHeavy();
  }

  function scheduleRouteLoad(delay=0) {
    const epoch=++routeLoadEpoch;
    clearTimeout(routeLoadTimer);
    routeLoadTimer=setTimeout(async()=>{
      const key=routeKey();
      const ok=await ensure(key,true);
      if(epoch!==routeLoadEpoch||key!==routeKey())return;
      if(ok)afterRouteLoad(key);
    },Math.max(0,delay));
  }

  addEventListener('hashchange', () => scheduleRouteLoad(0));
  addEventListener('popstate', () => scheduleRouteLoad(18));
  addEventListener('online', () => {
    if (!failures.size) return;
    ensure(routeKey(), true).then(ok => { if (ok) window.__SCHOLARK_FOUNDATION__?.recover?.(); });
  });

  window.__SCHOLARK_RUNTIME__ = {
    version:VERSION,
    route:routeKey,
    ensure:key => ensure(key || routeKey(), true),
    prewarmStudio:prewarmStudioCore,
    prefetchStudio:prefetchStudioHeavy,
    loaded:() => [...loaded],
    errors:() => [...failures.keys()],
    failures:() => Object.fromEntries(failures),
    retry:() => ensure(routeKey(), true),
    activeCount:ACTIVE.length,
    preloadCap:PRELOAD_CAP,
    yieldEvery:YIELD_EVERY
  };

  (async () => {
    html.classList.add('scholark-runtime-loading');
    const key = routeKey();
    preloadFiles(required(key));
    await ensure(key, false);
    html.classList.remove('scholark-runtime-loading');
    afterRouteLoad(key);
    window.dispatchEvent(new CustomEvent('scholark-runtime-ready',{detail:{route:key,version:VERSION,errors:[...failures.keys()]}}));
  })().catch(err => {
    html.classList.remove('scholark-runtime-loading','scholark-route-loading');
    console.error('[SCHOLARK] Runtime boot failed:', err);
  });
})();