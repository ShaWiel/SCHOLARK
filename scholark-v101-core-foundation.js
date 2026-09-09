(() => {
  if (window.__SCHOLARK_V101_CORE_FOUNDATION__) return;
  window.__SCHOLARK_V101_CORE_FOUNDATION__ = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RELEASE = 'r134';
  const PUBLIC = new Set(['', 'home', 'pricing', 'start']);
  const STUDIO = new Set(['studio', 'presentation', 'webpage', 'document', 'report', 'graphic', 'social']);
  const state = {
    repairs: 0,
    recoveries: 0,
    routeEpoch: 0,
    lastRoute: '',
    lastReason: 'boot',
    lastRepairAt: 0,
    pausedUntil: 0,
    repairTimes: [],
    errors: [],
    lastHealth: null
  };
  let scheduled = 0;
  let repairing = false;

  function routeInfo() {
    const raw = String(location.hash || '').toLowerCase().replace(/^#/, '').split(/[?&]/)[0].replace(/^\/+|\/+$/g, '');
    const base = raw.split(/[\/-]/)[0] || '';
    const kind = PUBLIC.has(base) ? 'home' : STUDIO.has(base) ? 'studio' : (base || 'home');
    return { raw: raw || 'home', base: base || 'home', kind };
  }

  function visible(el, minW = 70, minH = 45) {
    if (!el || el.hidden || el.getAttribute('aria-hidden') === 'true') return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity || 1) <= 0.02) return false;
    const r = el.getBoundingClientRect();
    return r.width >= minW && r.height >= minH;
  }

  function surfaceHealthy(info = routeInfo()) {
    if (document.documentElement.classList.contains('scholark-route-loading')) return true;
    if (info.kind === 'home') return visible($('#v29-home-layer'), 180, 160);
    if (info.kind === 'studio') {
      return visible($('#v41-studio-workspace:not([hidden])'), 180, 160) ||
        visible($('#v58-suite.open'), 180, 160) || visible($('#v57-deck.open'), 180, 160) || visible($('#v57-present.open'), 180, 160);
    }
    if (info.base === 'project') return visible($('#v51-fallback .v64-projects'), 180, 140);
    if (info.base === 'book') return visible($('#v51-fallback .v65-book'), 180, 140);
    if (info.base === 'schools') return visible($('#v50-school.open'), 180, 140);
    if (info.base === 'study') return visible($('#v25-study.open'), 180, 140) || visible($('#v62-field'), 140, 90) || visible($('.v83'), 140, 90);
    if (info.base === 'language') return visible($('.v93'), 140, 100);
    return document.body.classList.contains('v51-workspace') && visible($('#v51-main'), 180, 140);
  }

  function closeForeign(info = routeInfo()) {
    if (info.kind !== 'studio') {
      $('#v41-studio-workspace')?.setAttribute('hidden', '');
      $('#v58-suite')?.classList.remove('open');
      $('#v57-deck')?.classList.remove('open');
      $('#v57-present')?.classList.remove('open');
      $('#sv24-overlay')?.classList.remove('open');
    }
    if (info.base !== 'schools') $('#v50-school')?.classList.remove('open');
    if (info.base !== 'study') $('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
  }

  function syncHome(info, routeChanged) {
    document.body.classList.remove('v51-workspace', 'v51-collapsed', 'v51-native', 'v51-studio', 'v51-pro', 'v51-schools', 'v51-study', 'v51-book', 'v41-studio-open');
    document.body.classList.add('v55-public-home', 'v81-home');
    const home = $('#v29-home-layer');
    if (home) {
      home.hidden = false;
      home.removeAttribute('aria-hidden');
      home.classList.add('v30-native-home');
      ['display', 'visibility', 'opacity', 'pointer-events', 'position', 'inset', 'top', 'left', 'right', 'bottom'].forEach(p => home.style.removeProperty(p));
    }
    window.__SCHOLARK_V55_TOPBAR__?.sync?.();
    window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.();
    window.__SCHOLARK_V29_HOME__?.sync?.();
    if (window.__SCHOLARK_V32_PREVIEW__?.healthy?.() === false) window.__SCHOLARK_V32_PREVIEW__?.render?.(true);
    window.__SCHOLARK_V32_PREVIEW__?.ensure?.();
    window.__SCHOLARK_HOME_CINEMATICS__?.repair?.();
    window.__SCHOLARK_HOME_CINEMATICS__?.start?.();
    window.__SCHOLARK_V30_DEMO__?.sync?.();
    window.__SCHOLARK_V30_DEMO__?.start?.();
    if (routeChanged && info.base === 'pricing') {
      requestAnimationFrame(() => $('#v41-home-pricing')?.scrollIntoView?.({ block: 'start' }));
    }
  }

  function syncWorkspace(info) {
    document.body.classList.add('v51-workspace');
    document.body.classList.remove('v55-public-home', 'v81-home');
    if (info.kind === 'studio') document.body.classList.add('v51-studio', 'v41-studio-open');
    else document.body.classList.remove('v51-studio', 'v41-studio-open');
    const lang = localStorage.getItem('scholark_ui_language') || 'nl';
    if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
    window.__SCHOLARK_COUNTRY__?.apply?.();
    window.__SCHOLARK_WORKSPACE__?.syncLanguage?.();
  }

  function openExpected(info = routeInfo()) {
    if (surfaceHealthy(info)) return true;
    const ws = window.__SCHOLARK_WORKSPACE__;
    if (info.kind === 'studio') {
      ws?.setCollapsed?.(false, true);
      window.__SCHOLARK_STUDIO_WORKSPACE__?.open?.(null, { route: false, fast: true });
      if (!surfaceHealthy(info)) ws?.openTool?.('studio');
    } else if (info.base === 'project') {
      ws?.setCollapsed?.(false, true);
      window.__SCHOLARK_V64_PROJECTS__?.open?.();
      if (!surfaceHealthy(info)) ws?.openTool?.('project');
    } else if (info.base === 'book') {
      ws?.setCollapsed?.(false, true);
      window.__SCHOLARK_V65_BOOK__?.open?.();
      if (!surfaceHealthy(info)) ws?.openTool?.('book');
    } else if (info.base === 'study') {
      window.__SCHOLARK_V62_LEARNING_API__?.openStudyAhead?.();
      if (!surfaceHealthy(info)) ws?.openTool?.('study');
    } else if (info.base === 'language') {
      window.__SCHOLARK_V93_LANGUAGE__?.open?.();
      if (!surfaceHealthy(info)) ws?.openTool?.('language');
    } else if (info.base === 'schools') {
      ws?.openTool?.('schools');
    } else if (info.base !== 'dashboard' && info.kind !== 'home') {
      ws?.openTool?.(info.base);
    }
    return surfaceHealthy(info);
  }

  async function ensureRoute(info, token) {
    const runtime = window.__SCHOLARK_RUNTIME__;
    if (!runtime?.ensure) return false;
    try {
      await runtime.ensure(info.kind === 'home' ? 'home' : info.kind);
      if (token !== state.routeEpoch) return false;
      const now = routeInfo();
      if (now.raw !== info.raw) return false;
      if (info.kind === 'home') syncHome(info, false);
      else {
        syncWorkspace(info);
        openExpected(info);
      }
      return surfaceHealthy(info);
    } catch (e) {
      rememberError(e, 'ensureRoute');
      return false;
    }
  }

  function rememberError(error, source = 'foundation') {
    const message = String(error?.message || error || '').trim();
    if (!message) return;
    state.errors.push({ at: Date.now(), source, message: message.slice(0, 500) });
    if (state.errors.length > 20) state.errors.splice(0, state.errors.length - 20);
  }

  function duplicateIds() {
    const seen = new Set(), dupes = new Set();
    $$('[id]').forEach(el => seen.has(el.id) ? dupes.add(el.id) : seen.add(el.id));
    return [...dupes].filter(id => !/^v25-|^sv24-/.test(id)).slice(0, 30);
  }

  function foreignSurfaces(info = routeInfo()) {
    const out = [];
    if (info.kind !== 'studio' && $('#v41-studio-workspace:not([hidden])')) out.push('studio');
    if (info.base !== 'schools' && $('#v50-school.open')) out.push('schools');
    if (info.base !== 'study' && $('#v25-study.open')) out.push('study');
    if ($('#v25-book.open')) out.push('legacy-book');
    return out;
  }

  function quickHealthy(info = routeInfo()) {
    const runtimeErrors = window.__SCHOLARK_RUNTIME__?.errors?.() || [];
    return !runtimeErrors.length && !foreignSurfaces(info).length && surfaceHealthy(info);
  }

  function health() {
    const info = routeInfo();
    const runtimeErrors = window.__SCHOLARK_RUNTIME__?.errors?.() || [];
    const report = {
      ok: true,
      release: RELEASE,
      route: info.raw,
      routeKind: info.kind,
      runtimeVersion: window.__SCHOLARK_RUNTIME__?.version || '',
      runtimeErrors,
      localErrors: state.errors.slice(-10),
      duplicateIds: duplicateIds(),
      foreignSurfaces: foreignSurfaces(info),
      routeSurfaceHealthy: surfaceHealthy(info),
      repairs: state.repairs,
      recoveries: state.recoveries,
      pausedUntil: state.pausedUntil || null,
      lastReason: state.lastReason,
      lastRepairAt: state.lastRepairAt || null
    };
    report.ok = !report.runtimeErrors.length && !report.duplicateIds.length && !report.foreignSurfaces.length && report.routeSurfaceHealthy;
    state.lastHealth = report;
    try { sessionStorage.setItem('scholark_core_health', JSON.stringify(report)); } catch {}
    return report;
  }

  function tripCircuit(now) {
    state.repairTimes = state.repairTimes.filter(t => now - t < 10000);
    state.repairTimes.push(now);
    if (state.repairTimes.length <= 12) return false;
    state.pausedUntil = now + 5000;
    document.documentElement.classList.add('scholark-foundation-degraded');
    console.warn('[SCHOLARK] Foundation repair circuit paused for 5s to prevent a recovery loop.');
    setTimeout(() => {
      if (Date.now() >= state.pausedUntil) {
        state.pausedUntil = 0;
        state.repairTimes.length = 0;
        document.documentElement.classList.remove('scholark-foundation-degraded');
        schedule('circuit-resume', 0, true);
      }
    }, 5050);
    return true;
  }

  function repair(reason = 'auto', force = false) {
    scheduled = 0;
    const now = Date.now();
    if (repairing) return;
    if (!force && state.pausedUntil > now) return;
    if (!force && tripCircuit(now)) return;
    repairing = true;
    state.repairs++;
    state.lastReason = reason;
    state.lastRepairAt = now;
    try {
      const info = routeInfo();
      const routeChanged = state.lastRoute !== info.raw;
      if (routeChanged) {
        state.lastRoute = info.raw;
        state.routeEpoch++;
      }
      const token = state.routeEpoch;
      closeForeign(info);
      if (info.kind === 'home') syncHome(info, routeChanged);
      else syncWorkspace(info);
      document.documentElement.dataset.scholarkRelease = RELEASE;
      if (!surfaceHealthy(info) && !document.documentElement.classList.contains('scholark-route-loading')) {
        state.recoveries++;
        ensureRoute(info, token).then(ok => {
          if (!ok && token === state.routeEpoch) setTimeout(() => openExpected(info), 80);
        });
      }
      state.lastHealth = { ok: quickHealthy(info), route: info.raw, at: now };
    } catch (e) {
      rememberError(e, 'repair');
      console.error('[SCHOLARK] Foundation repair error', e);
    } finally {
      repairing = false;
    }
  }

  function schedule(reason = 'auto', delay = 0, force = false) {
    if (scheduled) clearTimeout(scheduled);
    scheduled = setTimeout(() => requestAnimationFrame(() => repair(reason, force)), delay);
  }

  async function diagnose() {
    const core = health();
    let deep = null;
    try {
      if (window.__SCHOLARK_HEALTH__?.selftest) deep = await window.__SCHOLARK_HEALTH__.selftest();
    } catch (e) {
      deep = { ok: false, error: String(e?.message || e) };
    }
    return { ...core, deep };
  }

  addEventListener('hashchange', () => schedule('hashchange', 0));
  addEventListener('popstate', () => schedule('popstate', 0));
  addEventListener('pageshow', () => schedule('pageshow', 20));
  addEventListener('focus', () => schedule('focus', 50));
  addEventListener('online', () => schedule('online', 80, true));
  addEventListener('scholark-runtime-ready', () => schedule('runtime-ready', 0));
  addEventListener('scholark-language-applied', () => schedule('language-applied', 30));
  addEventListener('scholark-language-complete', () => schedule('language-complete', 30));
  addEventListener('error', e => rememberError(e?.error || e?.message, 'window.error'));
  addEventListener('unhandledrejection', e => rememberError(e?.reason || 'Unhandled promise rejection', 'unhandledrejection'));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule('visible', 30); });

  const criticalSelector = '#v29-home-layer,#v41-studio-workspace,#v50-school,#v25-study,#v51-main,#v51-fallback,#v55-topbar';
  const observer = new MutationObserver(mutations => {
    if (repairing || document.hidden) return;
    const relevant = mutations.some(m => {
      const target = m.target?.nodeType === 1 ? m.target : m.target?.parentElement;
      if (target?.matches?.(criticalSelector) || target?.closest?.(criticalSelector)) return true;
      return [...(m.addedNodes || []), ...(m.removedNodes || [])].some(n => n?.nodeType === 1 && (n.matches?.(criticalSelector) || n.querySelector?.(criticalSelector)));
    });
    if (relevant) schedule('dom-invariant', 90);
  });
  if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden', 'aria-hidden'] });

  setInterval(() => {
    if (document.hidden || document.documentElement.classList.contains('scholark-route-loading')) return;
    if (!quickHealthy()) schedule('watchdog', 0);
  }, 4000);

  [0, 80, 250, 700, 1600].forEach((ms, i) => setTimeout(() => schedule('boot-' + i, 0, i === 4), ms));

  window.__SCHOLARK_FOUNDATION__ = {
    release: RELEASE,
    repair: () => schedule('manual', 0, true),
    recover: () => schedule('manual-recover', 0, true),
    health,
    diagnose,
    state: () => ({ ...state, errors: [...state.errors], repairTimes: [...state.repairTimes] }),
    pause: (ms = 15000) => { state.pausedUntil = Date.now() + Math.max(1000, Number(ms) || 15000); },
    resume: () => { state.pausedUntil = 0; state.repairTimes.length = 0; document.documentElement.classList.remove('scholark-foundation-degraded'); schedule('manual-resume', 0, true); }
  };
  dispatchEvent(new CustomEvent('scholark-foundation-ready', { detail: { release: RELEASE } }));
})();