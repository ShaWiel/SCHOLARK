(() => {
  if (window.__SCHOLARK_V101_CORE_FOUNDATION__) return;
  window.__SCHOLARK_V101_CORE_FOUNDATION__ = true;

  const $ = (s, r = document) => r.querySelector(s);
  const RELEASE = 'r135';
  const STUDIO = new Set(['studio','presentation','webpage','document','report','graphic','social']);
  const state = { lastRoute:'', routeEpoch:0, repairs:0, errors:[], lastRepairAt:0 };
  let repairing = false;
  let timer = 0;

  function routeInfo() {
    const raw = String(location.hash || '').toLowerCase().replace(/^#/, '').split(/[?&]/)[0].replace(/^\/+|\/+$/g,'');
    const base = raw.split(/[\/-]/)[0] || 'home';
    if (!raw || ['home','pricing','start'].includes(base)) return { raw: raw || 'home', base, kind:'home' };
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
    if (state.errors.length > 12) state.errors.splice(0, state.errors.length - 12);
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
    return isVisible($('#v29-home-layer'), 180, 150);
  }

  function previewHealthy() {
    if (window.__SCHOLARK_HOME_CINEMATICS__?.healthy) return window.__SCHOLARK_HOME_CINEMATICS__.healthy();
    if (window.__SCHOLARK_V32_PREVIEW__?.healthy) return window.__SCHOLARK_V32_PREVIEW__.healthy();
    return true;
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

    // Home cinematic recovery stays isolated from route cleanup. Do not continuously
    // rewrite the homepage DOM: that was the source of the R134 regression.
    if (!previewHealthy()) {
      window.__SCHOLARK_V32_PREVIEW__?.render?.(true);
      window.__SCHOLARK_V32_PREVIEW__?.ensure?.();
      window.__SCHOLARK_HOME_CINEMATICS__?.repair?.();
    }
    if (window.__SCHOLARK_V30_DEMO__?.isRunning?.() === false) window.__SCHOLARK_V30_DEMO__?.start?.();

    if (routeChanged && info.base === 'pricing') {
      setTimeout(() => $('#v41-home-pricing')?.scrollIntoView?.({block:'start'}), 40);
    }
  }

  function syncWorkspace(info) {
    document.body.classList.add('v51-workspace');
    document.body.classList.remove('v55-public-home','v81-home');
    if (info.kind === 'studio') document.body.classList.add('v51-studio','v41-studio-open');
    else document.body.classList.remove('v51-studio','v41-studio-open');

    const lang = localStorage.getItem('scholark_ui_language') || 'nl';
    if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
    window.__SCHOLARK_COUNTRY__?.apply?.();
    window.__SCHOLARK_WORKSPACE__?.syncLanguage?.();
  }

  function surfaceHealthy(info) {
    if (info.kind === 'home') return homeSurfaceHealthy();
    if (info.kind === 'studio') {
      return isVisible($('#v41-studio-workspace:not([hidden])'),180,140) ||
        isVisible($('#v58-suite.open'),180,140) || isVisible($('#v57-deck.open'),180,140) || isVisible($('#v57-present.open'),180,140);
    }
    if (info.base === 'project') return isVisible($('#v51-fallback .v64-projects'),180,120);
    if (info.base === 'book') return isVisible($('#v51-fallback .v65-book'),180,120);
    if (info.base === 'schools') return isVisible($('#v50-school.open'),180,120);
    if (info.base === 'study') return isVisible($('#v25-study.open'),180,120) || isVisible($('#v62-field'),120,80) || isVisible($('.v83'),120,80);
    if (info.base === 'language') return isVisible($('.v93'),120,80);
    return document.body.classList.contains('v51-workspace') && isVisible($('#v51-main'),180,120);
  }

  function openExpected(info) {
    const ws = window.__SCHOLARK_WORKSPACE__;
    if (info.kind === 'studio') {
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
      ws?.openTool?.('schools');
    }
  }

  async function recoverWorkspace(info, token) {
    try {
      const runtime = window.__SCHOLARK_RUNTIME__;
      if (runtime?.ensure) await runtime.ensure(info.kind === 'studio' ? 'studio' : info.base);
      if (token !== state.routeEpoch || routeInfo().raw !== info.raw) return;
      syncWorkspace(info);
      if (!surfaceHealthy(info)) openExpected(info);
    } catch (e) { rememberError(e,'workspace-recovery'); }
  }

  function repair(reason='auto', force=false) {
    timer = 0;
    if (repairing) return;
    repairing = true;
    try {
      const info = routeInfo();
      const routeChanged = state.lastRoute !== info.raw;
      if (routeChanged) { state.lastRoute = info.raw; state.routeEpoch++; }
      const token = state.routeEpoch;
      closeForeign(info);

      if (info.kind === 'home') {
        if (force || routeChanged || !homeSurfaceHealthy()) restoreHome(info, routeChanged);
        else if (!previewHealthy()) window.__SCHOLARK_HOME_CINEMATICS__?.repair?.();
      } else {
        syncWorkspace(info);
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
    const report = {
      release:RELEASE,
      route:info.raw,
      routeKind:info.kind,
      runtimeVersion:window.__SCHOLARK_RUNTIME__?.version || '',
      runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.() || [],
      surfaceHealthy:surfaceHealthy(info),
      previewHealthy:info.kind !== 'home' || previewHealthy(),
      repairs:state.repairs,
      localErrors:state.errors.slice(-8),
      lastRepairAt:state.lastRepairAt || null
    };
    report.ok = !report.runtimeErrors.length && report.surfaceHealthy && report.previewHealthy;
    return report;
  }

  addEventListener('hashchange', () => schedule('hashchange',0,true));
  addEventListener('popstate', () => schedule('popstate',0,true));
  addEventListener('pageshow', () => schedule('pageshow',20,true));
  addEventListener('focus', () => schedule('focus',60,false));
  addEventListener('online', () => schedule('online',100,false));
  addEventListener('scholark-runtime-ready', () => schedule('runtime-ready',0,true));
  addEventListener('scholark-language-complete', () => schedule('language',50,false));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule('visible',60,false); });

  // Passive watchdog only. It does not mutate a healthy homepage.
  setInterval(() => {
    if (document.hidden || document.documentElement.classList.contains('scholark-route-loading')) return;
    const info = routeInfo();
    if (info.kind === 'home') {
      if (!homeSurfaceHealthy()) schedule('home-watchdog',0,true);
      else if (!previewHealthy()) window.__SCHOLARK_HOME_CINEMATICS__?.repair?.();
    } else if (!surfaceHealthy(info)) schedule('workspace-watchdog',0,false);
  }, 7000);

  [0,100,400,1000].forEach((ms,i) => setTimeout(() => schedule('boot-'+i,0,i===3), ms));

  window.__SCHOLARK_FOUNDATION__ = {
    release:RELEASE,
    repair:() => schedule('manual',0,true),
    recover:() => schedule('manual-recover',0,true),
    health
  };
})();