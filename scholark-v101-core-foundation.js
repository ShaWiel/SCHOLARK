(() => {
  const appPath = (() => {
    const p = String(location.pathname || '/').replace(/\/+$/, '') || '/';
    return p === '/' || p === '/index.html';
  })();
  if (!appPath || window.__SCHOLARK_V101_CORE_FOUNDATION__) return;
  window.__SCHOLARK_V101_CORE_FOUNDATION__ = true;

  const $ = (s, r = document) => r.querySelector(s);
  const RELEASE = 'r215';
  const STUDIO = new Set(['studio','presentation','webpage','document','report','graphic','social']);
  const INACTIVE = new Set(['studio','presentation','webpage','document','report','graphic','social','book']);
  const state = { lastRoute:'', routeEpoch:0, repairs:0, recoveries:0, duplicateRepairs:0, errors:[], lastRepairAt:0, schoolWheelBound:false };
  let repairing = false;
  let timer = 0;
  let watchdogTimer = 0;

  function routeInfo() {
    const raw = String(location.hash || '').toLowerCase().replace(/^#/, '').split(/[?&]/)[0].replace(/^\/+|\/+$/g,'');
    if(raw==='credit-store')return {raw,base:'credit-store',kind:'store'};
    const base = raw.split(/[\/-]/)[0] || 'home';
    if (!raw || ['home','pricing','start'].includes(base)) return { raw: raw || 'home', base, kind:'home' };
    if (INACTIVE.has(base)) return { raw, base, kind:'inactive' };
    if (STUDIO.has(base)) return { raw, base, kind:'studio' };
    return { raw, base, kind:base };
  }

  function isVisible(el, minW=100, minH=80) {
    if (!el || el.hidden || el.getAttribute('aria-hidden') === 'true') return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity || 1) <= .02) return false;
    const r = el.getBoundingClientRect();
    return r.width >= minW && r.height >= minH;
  }

  function rememberError(err, source='foundation') {
    const message = String(err?.message || err || '').trim();
    if (!message) return;
    state.errors.push({ at:Date.now(), source, message:message.slice(0,400) });
    if (state.errors.length > 16) state.errors.splice(0, state.errors.length - 16);
  }

  function releaseStaleSelectorLocks(force=false) {
    for (const sel of document.querySelectorAll('select[data-sch-select-interacting="1"]')) {
      if (!force && document.activeElement === sel) continue;
      delete sel.dataset.schSelectInteracting;
    }
  }

  const CRITICAL_SINGLETON_IDS = Object.freeze([
    'v55-topbar','v29-home-layer','v51-sidebar','v51-main','v51-sidebar-actions','v72-modal','v89-account',
    'v117-credit-store-page','v117-credit-store-button','v117-store-return-home','v117-store-return-workspace','v117-store-dock','v90-language-overlay',
    'v50-school','v25-study','v25-book','v41-studio-workspace','v58-suite','v57-deck','v57-present'
  ]);
  const CRITICAL_SINGLETON_SELECTORS = Object.freeze([
    ['#v55-topbar .v55-account-wrap','topbar-account'],
    ['#v55-topbar .v85-topbar-credit','topbar-credit'],
    ['#v51-sidebar .v85-wallet','workspace-credit-wallet'],
    ['.v85-topbar-wallet-panel','wallet-panel'],
    ['#v51-main [data-v51-page="dashboard"] .v85-dash','dashboard-credit-status'],
    ['#v51-sidebar .v90-langbox','workspace-language-box'],
    ['#v51-sidebar #v96-side-country','workspace-country-box'],
    ['#v51-sidebar-actions #v116-workspace-help','workspace-help-menu'],
    ['#v51-main #v116-onboarding','workspace-onboarding'],
    ['.v114-connect','connected-flow-bar']
  ]);

  function duplicateCriticalIds() {
    const out=[];
    for (const id of CRITICAL_SINGLETON_IDS) {
      const nodes=[...document.querySelectorAll('#'+CSS.escape(id))];
      if (nodes.length>1) out.push({id,count:nodes.length});
    }
    return out;
  }

  function duplicateCriticalSelectors(){
    const out=[];
    for(const [selector,name] of CRITICAL_SINGLETON_SELECTORS){
      const count=document.querySelectorAll(selector).length;
      if(count>1)out.push({selector,name,count});
    }
    return out;
  }

  function repairCriticalSelectorDuplicates(){
    let removed=0;
    for(const [selector] of CRITICAL_SINGLETON_SELECTORS){
      const nodes=[...document.querySelectorAll(selector)];
      if(nodes.length<=1)continue;
      let keep=nodes.find(el=>{const cs=getComputedStyle(el),r=el.getBoundingClientRect();return el.isConnected&&!el.hidden&&cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>1&&r.height>1})||nodes[0];
      for(const el of nodes){if(el===keep)continue;try{el.remove();removed++}catch{}}
    }
    return removed;
  }

  function repairCriticalDuplicates(info=routeInfo()) {
    let removed=0;
    for (const id of CRITICAL_SINGLETON_IDS) {
      const nodes=[...document.querySelectorAll('#'+CSS.escape(id))];
      if (nodes.length<=1) continue;
      let keep=nodes[0],best=-Infinity;
      for (const el of nodes) {
        const cs=getComputedStyle(el),r=el.getBoundingClientRect();
        let score=0;
        if(el.isConnected)score+=100;
        if(!el.hidden&&el.getAttribute('aria-hidden')!=='true'&&cs.display!=='none'&&cs.visibility!=='hidden')score+=30;
        if(r.width>1&&r.height>1)score+=10;
        if(info.kind==='store'&&(id==='v117-credit-store-page'||id==='v117-credit-store-button'||id==='v117-store-dock'))score+=15;
        if((info.kind==='home'||info.kind==='store')&&(id==='v55-topbar'||id==='v29-home-layer'))score+=12;
        if(info.kind!=='home'&&info.kind!=='store'&&(id==='v51-sidebar'||id==='v51-main'))score+=12;
        if(score>best){best=score;keep=el}
      }
      for (const el of nodes) {
        if(el===keep)continue;
        try{el.remove();removed++}catch{}
      }
    }
    removed+=repairCriticalSelectorDuplicates();
    if(removed)state.duplicateRepairs+=removed;
    return removed;
  }

  function closeForeign(info) {
    if (info.kind !== 'studio') {
      $('#v41-studio-workspace')?.setAttribute('hidden','');
      $('#v58-suite')?.classList.remove('open');
      $('#v57-deck')?.classList.remove('open');
      $('#v57-present')?.classList.remove('open');
      $('#sv24-overlay')?.classList.remove('open');
    }
    if (info.base !== 'schools') $('#v50-school')?.classList.remove('open');
    if (info.base !== 'study') $('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
  }

  function homeSurfaceHealthy() {
    if(document.documentElement.classList.contains('scholark-home-language-adapting')&&$('#v90-language-overlay.open'))return true;
    return isVisible($('#v29-home-layer'), 180, 150);
  }

  function previewHealthy() {
    try {
      if (window.__SCHOLARK_HOME_CINEMATICS__?.healthy) return window.__SCHOLARK_HOME_CINEMATICS__.healthy();
      if (window.__SCHOLARK_V32_PREVIEW__?.healthy) return window.__SCHOLARK_V32_PREVIEW__.healthy();
    } catch (e) { rememberError(e,'preview-health'); return false; }
    return true;
  }

  function scrollPricing(attempt=0) {
    if (routeInfo().base !== 'pricing') return;
    const section = $('#v41-home-pricing');
    if (section) {
      section.scrollIntoView?.({block:'start', behavior:attempt ? 'auto' : 'smooth'});
      return;
    }
    if (attempt < 8) setTimeout(() => scrollPricing(attempt + 1), 80 + attempt * 45);
  }

  function restoreHome(info, routeChanged=false) {
    document.body.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    document.body.classList.add('v55-public-home');
    const home = $('#v29-home-layer');
    if (home) {
      home.hidden = false;
      home.removeAttribute('aria-hidden');
      home.classList.add('v30-native-home');
      ['display','visibility','opacity','pointer-events'].forEach(p => home.style.removeProperty(p));
    }
    window.__SCHOLARK_V55_TOPBAR__?.sync?.();
    window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.();
    window.__SCHOLARK_V29_HOME__?.sync?.();
    if (!previewHealthy()) window.__SCHOLARK_HOME_CINEMATICS__?.repair?.();
    if (routeChanged && info.base === 'pricing') scrollPricing();
  }

  function syncWorkspace(info) {
    document.body.classList.add('v51-workspace');
    document.body.classList.remove('v55-public-home','v81-home');
    if (info.kind === 'studio') document.body.classList.add('v51-studio','v41-studio-open');
    else document.body.classList.remove('v51-studio','v41-studio-open');
    const lang = localStorage.getItem('scholark_ui_language') || 'nl';
    if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
    if(!document.documentElement.classList.contains('scholark-language-switching')){
      window.__SCHOLARK_COUNTRY__?.apply?.();
      window.__SCHOLARK_WORKSPACE__?.syncLanguage?.();
    }
  }

  function stabilizeSchools() {
    const overlay = $('#v50-school');
    if (!overlay) return;
    overlay.style.setProperty('height','100dvh','important');
    overlay.style.setProperty('max-height','100dvh','important');
    overlay.style.setProperty('overflow-y','auto','important');
    overlay.style.setProperty('overflow-x','hidden','important');
    overlay.style.setProperty('overscroll-behavior-y','contain','important');
    overlay.style.setProperty('touch-action','pan-y','important');
    if (overlay.dataset.v136Wheel === '1') return;
    overlay.dataset.v136Wheel = '1';
    overlay.addEventListener('wheel', e => {
      if (routeInfo().base !== 'schools' || !overlay.classList.contains('open')) return;
      if (e.target?.closest?.('select,input,textarea,[contenteditable="true"],[data-sch-select-interacting="1"]')) return;
      const max = overlay.scrollHeight - overlay.clientHeight;
      if (max <= 2) return;
      const before = overlay.scrollTop;
      overlay.scrollTop = Math.max(0, Math.min(max, before + e.deltaY));
      if (overlay.scrollTop !== before) e.preventDefault();
    }, { passive:false });
    state.schoolWheelBound = true;
  }

  function surfaceHealthy(info) {
    if (info.kind === 'home') return homeSurfaceHealthy();
    if (info.kind === 'store') return isVisible($('#v117-credit-store-page:not([hidden])'),240,180)&&isVisible($('#v55-topbar'),240,40);
    if (info.kind === 'inactive') return isVisible($('.v51-coming-soon'),180,120) || isVisible($('#v51-main'),180,120);
    if (info.kind === 'studio') {
      return isVisible($('#v41-studio-workspace:not([hidden])'),180,140) ||
        isVisible($('#v58-suite.open'),180,140) || isVisible($('#v57-deck.open'),180,140) || isVisible($('#v57-present.open'),180,140);
    }
    if (info.base === 'project') return isVisible($('#v51-fallback .v64-projects'),180,120);
    if (info.base === 'book') return isVisible($('#v51-fallback .v65-book'),180,120);
    if (info.base === 'schools') return isVisible($('#v50-school.open'),180,120);
    if (info.base === 'study') return isVisible($('#v25-study.open'),180,120) || isVisible($('.v62-study'),180,140) || isVisible($('.v62-study .v62-form'),180,120) || isVisible($('.v83'),120,80);
    if (info.base === 'language') return isVisible($('.v93'),120,80);
    return document.body.classList.contains('v51-workspace') && isVisible($('#v51-main'),180,120);
  }

  function openExpected(info) {
    const ws = window.__SCHOLARK_WORKSPACE__;
    if (info.kind === 'inactive') {
      ws?.setCollapsed?.(false,true);
      ws?.openTool?.(info.base==='book'?'book':'studio');
    } else if (info.kind === 'studio') {
      ws?.setCollapsed?.(false,true);
      window.__SCHOLARK_STUDIO_WORKSPACE__?.open?.(null,{route:false,fast:true});
    } else if (info.base === 'project') {
      ws?.setCollapsed?.(false,true);
      window.__SCHOLARK_V64_PROJECTS__?.open?.();
    } else if (info.base === 'book') {
      ws?.setCollapsed?.(false,true);
      window.__SCHOLARK_V65_BOOK__?.open?.();
    } else if (info.base === 'study') {
      window.__SCHOLARK_V62_LEARNING_API__?.openStudyAhead?.();
    } else if (info.base === 'language') {
      window.__SCHOLARK_V93_LANGUAGE__?.open?.();
    } else if (info.base === 'schools') {
      ws?.setCollapsed?.(false,true);
      ws?.openTool?.('schools');
      setTimeout(stabilizeSchools, 50);
    } else if (info.base !== 'dashboard') {
      ws?.openTool?.(info.base);
    }
  }

  async function recoverWorkspace(info, token) {
    try {
      state.recoveries++;
      const runtime = window.__SCHOLARK_RUNTIME__;
      if (runtime?.ensure) await runtime.ensure(info.kind === 'studio' ? 'studio' : info.base);
      if (token !== state.routeEpoch || routeInfo().raw !== info.raw) return;
      syncWorkspace(info);
      if (!surfaceHealthy(info)) openExpected(info);
      if (info.base === 'schools') setTimeout(stabilizeSchools, 80);
    } catch (e) { rememberError(e,'workspace-recovery'); }
  }

  function repair(reason='auto', force=false) {
    timer = 0;
    if (repairing) return;
    repairing = true;
    try {
      releaseStaleSelectorLocks(false);
      if(document.documentElement.classList.contains('scholark-language-switching')||document.documentElement.classList.contains('scholark-workspace-entering')){state.lastRepairAt=Date.now();return}
      const info = routeInfo();
      repairCriticalDuplicates(info);
      const routeChanged = state.lastRoute !== info.raw;
      if (routeChanged) { state.lastRoute = info.raw; state.routeEpoch++; }
      const token = state.routeEpoch;
      const adaptingHome=info.kind==='home'&&document.documentElement.classList.contains('scholark-home-language-adapting');
      if(!force&&!routeChanged&&!adaptingHome&&state.lastRepairAt&&Date.now()-state.lastRepairAt<900&&surfaceHealthy(info))return;
      if(adaptingHome){state.lastRepairAt=Date.now();return}
      closeForeign(info);
      if (info.kind === 'home') {
        if (force || routeChanged || !homeSurfaceHealthy()) restoreHome(info, routeChanged);
        else if (!previewHealthy()) window.__SCHOLARK_HOME_CINEMATICS__?.repair?.();
        if (info.base === 'pricing') scrollPricing();
      } else if(info.kind==='store'){
        document.body.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
        document.documentElement.classList.remove('v51-workspace-root');
        document.body.classList.add('v55-public-home');document.documentElement.classList.add('v55-public-home');
        window.__SCHOLARK_V55_TOPBAR__?.sync?.();window.__SCHOLARK_CREDIT_STORE__?.sync?.();
      } else {
        syncWorkspace(info);
        if (info.base === 'schools') stabilizeSchools();
        if (!surfaceHealthy(info)) recoverWorkspace(info, token);
      }
      state.repairs++;
      state.lastRepairAt = Date.now();
      document.documentElement.dataset.scholarkRelease = RELEASE;
    } catch (e) {
      rememberError(e,'repair');
      console.error('[SCHOLARK] Foundation repair error', e);
    } finally { repairing = false; }
  }

  function schedule(reason='auto', delay=0, force=false) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => requestAnimationFrame(() => repair(reason, force)), delay);
  }

  function health() {
    const info = routeInfo();
    const runtimeErrors = window.__SCHOLARK_RUNTIME__?.errors?.() || [];
    const i18nReport=window.__SCHOLARK_I18N__?.selftest?.()||null,countryApi=window.__SCHOLARK_COUNTRY__,schoolsApi=window.__SCHOLARK_V50_SCHOOLS__;
    const publicSurface=info.kind==='home'||info.kind==='store';
    const report = {
      release:RELEASE,
      route:info.raw,
      routeKind:info.kind,
      runtimeVersion:window.__SCHOLARK_RUNTIME__?.version || '',
      releaseAligned:String(window.__SCHOLARK_RUNTIME__?.version||'').endsWith('-'+RELEASE),
      runtimeErrors,
      surfaceHealthy:surfaceHealthy(info),
      connectedCore:publicSurface||!!window.__SCHOLARK_WORKSPACE_CORE__,
      connectedExperience:publicSurface||!!window.__SCHOLARK_V111_EXPERIENCE__,
      workspaceRootLocked:publicSurface||document.documentElement.classList.contains('v51-workspace-root'),
      localeControls:publicSurface||(!!document.querySelector('#v90-language')&&!!document.querySelector('#v96-side-country select')),
      language74:window.__SCHOLARK_I18N__?.count===74&&i18nReport?.ok===true&&!window.__SCHOLARK_I18N__?.langs?.some?.(([lc])=>lc==='srn'),
      languageResilience:i18nReport?.abortable===true&&i18nReport?.retryReady===true,
      languageCoverage:window.__SCHOLARK_I18N__?.coverage?.(620)||null,
      globalCountryRegistry:countryApi?.global===true&&Number(countryApi?.countryCount||0)>=195,
      globalSchools:info.base!=='schools'||(schoolsApi?.global===true&&countryApi?.global===true&&Number(countryApi?.countryCount||0)>=195),
      countryLevels:publicSurface||document.querySelectorAll('#v51-main .v51-levels [data-education-group]').length>0,
      visualSystem:publicSurface||!!window.__SCHOLARK_V112_VISUAL__,
      visualHealthy:publicSurface||info.kind==='dashboard'||window.__SCHOLARK_V112_VISUAL__?.verify?.().ok===true,
      orchestrator:publicSurface||!!window.__SCHOLARK_V114_ORCHESTRATOR__,
      orchestratorHealthy:publicSurface||window.__SCHOLARK_V114_ORCHESTRATOR__?.verify?.().ok===true,
      orchestratorSelftest:publicSurface||window.__SCHOLARK_V114_ORCHESTRATOR__?.selftest?.().ok===true,
      hardening:publicSurface||!!(window.__SCHOLARK_HARDENING__||window.__SCHOLARK_FOUNDATION_R176__||window.__SCHOLARK_FOUNDATION_R175__||window.__SCHOLARK_FOUNDATION_R174__||window.__SCHOLARK_FOUNDATION_R173__||window.__SCHOLARK_FOUNDATION_R172__),
      hardeningHealthy:publicSurface||(window.__SCHOLARK_HARDENING__||window.__SCHOLARK_FOUNDATION_R176__||window.__SCHOLARK_FOUNDATION_R175__||window.__SCHOLARK_FOUNDATION_R174__||window.__SCHOLARK_FOUNDATION_R173__||window.__SCHOLARK_FOUNDATION_R172__)?.verify?.().ok!==false,
      qualityMaxGone:!Array.from(document.querySelectorAll('.v52-pill,.v107-pill,[data-ai-quality],[data-quality-badge],.ai-quality-max')).some(el=>/QUALITY\s*[·•]?\s*MAX/i.test(String(el.textContent||''))),
      previewHealthy:info.kind !== 'home' || previewHealthy(),
      schoolsScrollable:info.base !== 'schools' || !$('#v50-school') || getComputedStyle($('#v50-school')).overflowY !== 'hidden',
      staleSelectorLocks:Array.from(document.querySelectorAll('select[data-sch-select-interacting="1"]')).filter(sel=>document.activeElement!==sel).length,
      duplicateCriticalIds:duplicateCriticalIds(),
      duplicateCriticalSelectors:duplicateCriticalSelectors(),
      duplicateRepairs:state.duplicateRepairs,
      repairs:state.repairs,
      recoveries:state.recoveries,
      localErrors:state.errors.slice(-8),
      lastRepairAt:state.lastRepairAt || null
    };
    report.ok = report.releaseAligned && !runtimeErrors.length && report.surfaceHealthy && report.connectedCore && report.connectedExperience && report.workspaceRootLocked && report.localeControls && report.language74 && report.languageResilience && report.globalCountryRegistry && report.globalSchools && report.countryLevels && report.visualSystem && report.visualHealthy && report.orchestrator && report.orchestratorHealthy && report.orchestratorSelftest && report.hardening && report.hardeningHealthy && report.qualityMaxGone && report.previewHealthy && report.schoolsScrollable && report.staleSelectorLocks===0 && report.duplicateCriticalIds.length===0 && report.duplicateCriticalSelectors.length===0;
    try { sessionStorage.setItem('scholark_core_health', JSON.stringify(report)); } catch {}
    return report;
  }

  addEventListener('hashchange', () => schedule('hashchange',0,true));
  addEventListener('popstate', () => schedule('popstate',0,true));
  addEventListener('pageshow', () => { releaseStaleSelectorLocks(true); schedule('pageshow',20,true); });
  addEventListener('focus', () => { releaseStaleSelectorLocks(false); schedule('focus',60,false); });
  addEventListener('online', () => schedule('online',100,false));
  addEventListener('scholark-runtime-ready', () => schedule('runtime-ready',0,true));
  addEventListener('scholark-language-complete', () => schedule('language',50,false));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { releaseStaleSelectorLocks(false); schedule('visible',60,false); } });

  function watchdogTick() {
    clearTimeout(watchdogTimer);
    let next=16000;
    try{
      if (document.hidden) next=30000;
      else if (document.documentElement.classList.contains('scholark-route-loading') || document.documentElement.classList.contains('scholark-home-language-adapting') || document.documentElement.classList.contains('scholark-language-switching') || document.documentElement.classList.contains('scholark-workspace-entering')) next=5000;
      else{
        const info=routeInfo();
        const duplicates=duplicateCriticalIds(),selectorDuplicates=duplicateCriticalSelectors();
        if(duplicates.length||selectorDuplicates.length){repairCriticalDuplicates(info);schedule('duplicate-watchdog',0,true);next=5000}
        else if(info.kind==='home'){
          if(!homeSurfaceHealthy()){schedule('home-watchdog',0,true);next=5000}
          else if(!previewHealthy()){window.__SCHOLARK_HOME_CINEMATICS__?.repair?.();next=8000}
        }else if(info.kind==='store'){
          if(!surfaceHealthy(info)){schedule('store-watchdog',0,true);next=5000}
        }else if(!surfaceHealthy(info)){schedule('workspace-watchdog',0,false);next=5000}
      }
    }catch(e){rememberError(e,'watchdog');next=8000}
    watchdogTimer=setTimeout(watchdogTick,next);
  }

  watchdogTimer=setTimeout(watchdogTick,7000);
  [0,140,650].forEach((ms,i) => setTimeout(() => schedule('boot-'+i,0,i===2), ms));

  window.__SCHOLARK_FOUNDATION__ = {
    release:RELEASE,
    repair:() => schedule('manual',0,true),
    recover:() => schedule('manual-recover',0,true),
    health,
    route:routeInfo,
    duplicateIds:duplicateCriticalIds,
    duplicateSelectors:duplicateCriticalSelectors,
    repairDuplicates:()=>repairCriticalDuplicates(routeInfo())
  };
})();