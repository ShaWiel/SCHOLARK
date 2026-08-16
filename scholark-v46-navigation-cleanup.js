(() => {
  if (window.__SCHOLARK_V46_NAVIGATION_CONTROLLER__) return;
  window.__SCHOLARK_V46_NAVIGATION_CONTROLLER__ = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const text = el => (el?.textContent || '').replace(/\s+/g, ' ').trim();
  const lower = el => text(el).toLowerCase();
  const hash = () => String(location.hash || '').toLowerCase();
  const isDashboard = () => /^#?dashboard(?:$|[/?&-])/.test(hash().replace(/^#/, '')) || hash() === '#dashboard';
  const isWorkspaceRoute = () => /dashboard|studio|presentation|document|report|poster|graphic|social|tutor|planner|progress|goal|project|education|book|schools|study/.test(hash());
  const isPublicHome = () => !isWorkspaceRoute() && !/pricing/.test(hash());

  const css = document.createElement('style');
  css.id = 'scholark-v46-navigation-style';
  css.textContent = `
    body.v46-public-home #v29-home-layer{
      display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;
      position:fixed!important;inset:0!important;top:0!important;left:0!important;right:0!important;bottom:0!important;
      width:100vw!important;height:100vh!important;max-width:none!important;min-height:100vh!important;
      overflow:auto!important;z-index:2147483000!important;background:#f5f4ef!important;
    }
    body.v46-workspace #v29-home-layer,
    body.v46-workspace #v28-home,
    body.v46-workspace [data-v46-retired-public-home="1"]{
      display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
    }
    body.v46-public-home [data-v46-retired-public-home="1"]{
      display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
    }
    body.v46-dashboard #v41-studio-workspace{
      display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
    }
    body.v46-dashboard #sv24-overlay.open{
      visibility:hidden!important;opacity:0!important;pointer-events:none!important;
    }
    #v46-workspace-dashboard{
      position:fixed;top:74px;right:0;bottom:0;left:0;z-index:720;background:#f4f3ef;color:#17191f;
      overflow:auto;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    }
    #v46-workspace-dashboard[hidden]{display:none!important}
    .v46-dash-shell{max-width:1420px;margin:0 auto;padding:34px 30px 80px}
    .v46-dash-top{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:26px}
    .v46-dash-top small{display:block;color:#6d5dfc;font:900 9px/1 Inter;letter-spacing:.14em;margin-bottom:8px}
    .v46-dash-top h1{font:950 clamp(34px,5vw,58px)/.94 Inter;margin:0;letter-spacing:-.05em}
    .v46-dash-top p{max-width:680px;color:#706c77;font:600 12px/1.55 Inter;margin:10px 0 0}
    .v46-status{border-radius:999px;background:#17191f;color:#c9ff6a;padding:9px 12px;font:900 9px/1 Inter;white-space:nowrap}
    .v46-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}
    .v46-card{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:23px;padding:20px;min-height:180px;text-align:left;cursor:pointer;box-shadow:0 18px 52px rgba(31,27,63,.05);transition:.2s}
    .v46-card:hover{transform:translateY(-3px);box-shadow:0 24px 66px rgba(31,27,63,.1)}
    .v46-card.primary{grid-column:span 2;background:linear-gradient(145deg,#17191f,#30275d);color:#fff;border-color:#17191f}
    .v46-card .ico{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#efedff;color:#5c4de0;font:950 15px Inter}
    .v46-card.primary .ico{background:#c9ff6a;color:#17191f}
    .v46-card h3{font:950 22px/1 Inter;margin:18px 0 8px;letter-spacing:-.03em}.v46-card p{font:600 10.5px/1.5 Inter;color:#77727d;margin:0}.v46-card.primary p{color:#c9c5d1}
    .v46-card b{display:inline-block;margin-top:18px;font:900 9px Inter;color:#6d5dfc}.v46-card.primary b{color:#c9ff6a}
    .v46-strip{margin-top:14px;border-radius:22px;background:#fff;border:1px solid rgba(23,25,31,.1);padding:18px;display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
    .v46-strip strong{font:900 12px Inter}.v46-strip span{font:650 10px Inter;color:#777}.v46-strip button{border:0;border-radius:12px;padding:10px 12px;background:#17191f;color:#fff;font:900 9px Inter;cursor:pointer}
    @media(max-width:1000px){.v46-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v46-card.primary{grid-column:span 2}}
    @media(max-width:640px){#v46-workspace-dashboard{top:64px}.v46-dash-shell{padding:24px 14px 60px}.v46-dash-top{display:block}.v46-status{display:inline-block;margin-top:14px}.v46-grid{grid-template-columns:1fr}.v46-card.primary{grid-column:auto}}
  `;
  document.head.appendChild(css);

  let internalLaunch = null;
  let retiredHome = null;
  let opening = false;
  let dashboardActivated = false;
  let routeTimer = null;

  function closeStudioHard() {
    const studio = $('#v41-studio-workspace');
    if (studio) {
      studio.hidden = true;
      studio.style.removeProperty('display');
      studio.style.removeProperty('visibility');
      studio.style.removeProperty('opacity');
      studio.style.removeProperty('pointer-events');
    }
    document.body.classList.remove('v41-studio-open');
    const legacy = $('#sv24-overlay');
    legacy?.classList.remove('open');
  }

  function findInternalDashboardLaunch() {
    if (internalLaunch && document.contains(internalLaunch)) return internalLaunch;
    const rx = /^(open|go to|enter|launch|start)\s+(the\s+)?(scholark\s+)?(dashboard|workspace)$|^(dashboard|workspace)\s+(openen|starten)$|^(open|start)\s+(dashboard|workspace)$/i;
    const candidates = $$('button,a,[role="button"],[tabindex]')
      .filter(el => !el.closest('#v29-home-layer') && !el.closest('#v41-studio-workspace') && el.id !== 'v41-dashboard-entry' && el.id !== 'v34-dashboard-entry')
      .filter(el => rx.test(text(el)) || /open dashboard|dashboard openen|open workspace|workspace openen/i.test(text(el)));
    internalLaunch = candidates.sort((a, b) => {
      const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
      const as = (['BUTTON','A'].includes(a.tagName) ? 0 : 10) + Math.abs(ar.top - 20);
      const bs = (['BUTTON','A'].includes(b.tagName) ? 0 : 10) + Math.abs(br.top - 20);
      return as - bs;
    })[0] || null;
    return internalLaunch;
  }

  function retireOldPublicHome() {
    const launch = findInternalDashboardLaunch();
    if (!launch) return null;
    if (retiredHome && document.contains(retiredHome)) return retiredHome;

    let cur = launch.parentElement;
    let best = null;
    while (cur && cur !== document.body && cur !== document.documentElement) {
      if (cur.id === 'v29-home-layer' || cur.id === 'v41-studio-workspace') break;
      const t = lower(cur);
      const r = cur.getBoundingClientRect();
      const homeish = /jouw hele leerwereld|leerwereld|learning world|open dashboard|dashboard openen|open workspace|workspace openen/.test(t);
      if (homeish && (r.width > 500 || cur.matches('main,[role="main"],section'))) best = cur;
      if (cur.matches('main,[role="main"]') && homeish) { best = cur; break; }
      cur = cur.parentElement;
    }
    retiredHome = best || launch.closest('main,[role="main"],section') || null;
    if (retiredHome && retiredHome !== document.body && retiredHome !== document.documentElement) {
      retiredHome.dataset.v46RetiredPublicHome = '1';
      retiredHome.setAttribute('aria-hidden', 'true');
    }
    return retiredHome;
  }

  function navScore(el) {
    const t = lower(el);
    return ['dashboard','studio ai','ai tutor','planner','voortgang','progress','doelen','goals','educatie & leren','education & learning','mijn projecten','my projects']
      .reduce((n, x) => n + (t.includes(x) ? 1 : 0), 0);
  }

  function findSidebar() {
    return $$('aside,nav,section,div')
      .filter(el => !el.closest('#v29-home-layer') && !el.closest('#v41-studio-workspace') && !el.closest('[data-v46-retired-public-home="1"]'))
      .map(el => ({ el, score: navScore(el), nodes: el.querySelectorAll('*').length, len: text(el).length, r: el.getBoundingClientRect() }))
      .filter(o => o.score >= 4 && o.len < 12000)
      .sort((a, b) => b.score - a.score || a.nodes - b.nodes || a.len - b.len)[0]?.el || null;
  }

  function unlock(el) {
    if (!el || el.id === 'v29-home-layer' || el.id === 'v41-studio-workspace' || el.dataset?.v46RetiredPublicHome === '1') return;
    el.hidden = false;
    el.removeAttribute?.('aria-hidden');
    ['display','visibility','opacity','pointer-events','transform','width','min-width','max-width','height','min-height','max-height','overflow','margin-left'].forEach(p => el.style?.removeProperty(p));
  }

  function revealWorkspaceShell() {
    const side = findSidebar();
    if (!side) return false;
    unlock(side);
    let parent = side.parentElement;
    let depth = 0;
    while (parent && parent !== document.body && depth < 4) {
      unlock(parent);
      const useful = [...parent.children].filter(el => el !== side && el.id !== 'v29-home-layer' && el.id !== 'v41-studio-workspace' && el.dataset?.v46RetiredPublicHome !== '1');
      useful.forEach(el => {
        if (el.matches('main,[role="main"]') || text(el).length > 80 || el.querySelector('main,[role="main"]')) unlock(el);
      });
      if (useful.some(el => el.matches('main,[role="main"]') || el.querySelector('main,[role="main"]'))) break;
      parent = parent.parentElement;
      depth++;
    }
    return true;
  }

  function dashboardItem() {
    const side = findSidebar();
    if (!side) return null;
    return $$('button,a,[role="button"],[tabindex]', side)
      .filter(el => /^dashboard$/i.test(text(el)))
      .sort((a,b) => (['BUTTON','A'].includes(a.tagName) ? 0 : 1) - (['BUTTON','A'].includes(b.tagName) ? 0 : 1))[0] || null;
  }

  function activateDashboardNav() {
    if (dashboardActivated) return true;
    const item = dashboardItem();
    if (!item) return false;
    dashboardActivated = true;
    try { item.click(); } catch {}
    return true;
  }

  function dedupePricing() {
    const keep = $('#v41-home-pricing') || $('#v29-home-layer #v41-home-pricing');
    ['#v42-pricing','#v40-home-pricing','#v39-home-pricing','#v37-home-pricing','#v34-home-pricing'].forEach(sel => $(sel)?.remove());
    const candidates = $$('section,div').filter(el => {
      if (el === keep || el.closest('#v41-studio-workspace')) return false;
      const t = lower(el);
      return t.includes('scholark free') && t.includes('scholark plus') && t.includes('scholark pro');
    }).sort((a,b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length);
    const seen = new Set();
    candidates.forEach(el => {
      if (keep && (el.contains(keep) || keep.contains(el))) return;
      if ([...seen].some(x => x.contains(el) || el.contains(x))) return;
      seen.add(el);
      el.remove();
    });
  }

  function ensureFallbackDashboard() {
    let root = $('#v46-workspace-dashboard');
    if (!root) {
      root = document.createElement('main');
      root.id = 'v46-workspace-dashboard';
      root.hidden = true;
      root.innerHTML = `<div class="v46-dash-shell">
        <div class="v46-dash-top"><div><small>SCHOLARK WORKSPACE</small><h1>Your learning & creation workspace.</h1><p>Open the tool you need without returning to the retired homepage. Dashboard is the hub; Studio AI, Tutor, planning, progress and education remain separate work areas.</p></div><span class="v46-status">WORKSPACE READY</span></div>
        <div class="v46-grid">
          <button class="v46-card primary" data-v46-route="studio"><span class="ico">✦</span><h3>Studio AI</h3><p>Create presentations, webpages, documents, social content, graphics and books from a structured brief.</p><b>OPEN STUDIO →</b></button>
          <button class="v46-card" data-v46-route="tutor"><span class="ico">AI</span><h3>AI Tutor</h3><p>Learn, ask, practice and get explanations adapted to your level.</p><b>OPEN TUTOR →</b></button>
          <button class="v46-card" data-v46-route="education"><span class="ico">◎</span><h3>Education & Learning</h3><p>Diagnostics, learning paths, mastery and study support in one place.</p><b>OPEN LEARNING →</b></button>
          <button class="v46-card" data-v46-route="planner"><span class="ico">▦</span><h3>Planner</h3><p>Organize goals, study sessions, deadlines and what to work on next.</p><b>OPEN PLANNER →</b></button>
          <button class="v46-card" data-v46-route="progress"><span class="ico">↗</span><h3>Progress</h3><p>See what is improving, what is weak and where to focus next.</p><b>VIEW PROGRESS →</b></button>
          <button class="v46-card" data-v46-route="goal"><span class="ico">◉</span><h3>Goals</h3><p>Set learning, school and creation goals and connect them to your plan.</p><b>OPEN GOALS →</b></button>
          <button class="v46-card" data-v46-route="project"><span class="ico">▧</span><h3>My Projects</h3><p>Return to saved Studio work, documents, research and ongoing projects.</p><b>OPEN PROJECTS →</b></button>
        </div>
        <div class="v46-strip"><div><strong>No old homepage in the workspace.</strong><span> Dashboard stays the hub and every creator opens as its own workspace view.</span></div><button data-v46-route="studio">Create something</button></div>
      </div>`;
      document.body.appendChild(root);
      $$('[data-v46-route]', root).forEach(btn => btn.onclick = () => openWorkspaceRoute(btn.dataset.v46Route));
    }
    return root;
  }

  function clickNavByRoute(route) {
    const side = findSidebar();
    if (!side) return false;
    const map = {
      studio: ['studio ai','ai studio'], tutor: ['ai tutor'], education: ['education & learning','educatie & leren','onderwijs & leren'],
      planner: ['planner'], progress: ['progress','voortgang'], goal: ['goals','doelen'], project: ['my projects','mijn projecten']
    };
    const names = map[route] || [route];
    const item = $$('button,a,[role="button"],[tabindex]', side).find(el => names.includes(lower(el)));
    if (!item) return false;
    try { item.click(); return true; } catch { return false; }
  }

  function openWorkspaceRoute(route) {
    ensureFallbackDashboard().hidden = true;
    if (route === 'studio') {
      const sideHit = clickNavByRoute('studio');
      if (!sideHit) location.hash = 'studio';
      return;
    }
    if (!clickNavByRoute(route)) location.hash = route;
  }

  function showPublicHome() {
    opening = false;
    dashboardActivated = false;
    closeStudioHard();
    retireOldPublicHome();
    dedupePricing();
    document.body.classList.add('v46-public-home');
    document.body.classList.remove('v46-workspace','v46-dashboard');
    const home = $('#v29-home-layer');
    if (home) {
      home.hidden = false;
      home.style.removeProperty('display');
      home.style.removeProperty('visibility');
      home.style.removeProperty('opacity');
    }
    const fallback = $('#v46-workspace-dashboard');
    if (fallback) fallback.hidden = true;
  }

  function enterWorkspace(triggerLaunch = true) {
    if (opening && triggerLaunch) return;
    opening = true;
    closeStudioHard();
    retireOldPublicHome();
    document.body.classList.remove('v46-public-home','v41-home','v40-public-home','v31-public-home','v42-home');
    document.body.classList.add('v46-workspace','v46-dashboard');

    const home = $('#v29-home-layer');
    if (home) home.hidden = true;

    const fallback = ensureFallbackDashboard();
    fallback.hidden = true;

    const launch = findInternalDashboardLaunch();
    if (triggerLaunch && launch && !launch.dataset.v46Launching) {
      launch.dataset.v46Launching = '1';
      try { launch.click(); } catch {}
      setTimeout(() => delete launch.dataset.v46Launching, 800);
    }

    history.replaceState(null, '', location.pathname + location.search + '#dashboard');

    let tries = 0;
    clearInterval(routeTimer);
    routeTimer = setInterval(() => {
      tries++;
      closeStudioHard();
      retireOldPublicHome();
      const ready = revealWorkspaceShell();
      if (ready) activateDashboardNav();
      if (ready && dashboardItem()) {
        clearInterval(routeTimer);
        opening = false;
        setTimeout(() => {
          const side = findSidebar();
          const visibleMain = $$('main,[role="main"]')
            .filter(el => el.id !== 'v29-home-layer' && el.id !== 'v46-workspace-dashboard' && !el.closest('[data-v46-retired-public-home="1"]'))
            .find(el => { const r = el.getBoundingClientRect(); return r.width > 400 && r.height > 240 && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden'; });
          fallback.hidden = !!visibleMain;
          if (!visibleMain && side) {
            const r = side.getBoundingClientRect();
            fallback.style.left = Math.max(0, Math.round(r.right)) + 'px';
          } else fallback.style.left = '0';
        }, 220);
      } else if (tries >= 24) {
        clearInterval(routeTimer);
        opening = false;
        fallback.hidden = false;
        const side = findSidebar();
        if (side) fallback.style.left = Math.max(0, Math.round(side.getBoundingClientRect().right)) + 'px';
      }
    }, 90);
  }

  function syncRoute() {
    $('#v28-home')?.remove();
    dedupePricing();
    retireOldPublicHome();

    if (isDashboard()) {
      document.body.classList.add('v46-workspace','v46-dashboard');
      document.body.classList.remove('v46-public-home');
      closeStudioHard();
      $('#v29-home-layer')?.setAttribute('hidden', '');
      revealWorkspaceShell();
      if (!findSidebar() && !opening) enterWorkspace(true);
      return;
    }

    if (isWorkspaceRoute()) {
      document.body.classList.add('v46-workspace');
      document.body.classList.remove('v46-public-home','v46-dashboard');
      $('#v29-home-layer')?.setAttribute('hidden', '');
      const fallback = $('#v46-workspace-dashboard'); if (fallback) fallback.hidden = true;
      revealWorkspaceShell();
      return;
    }

    if (isPublicHome()) showPublicHome();
  }

  document.addEventListener('click', e => {
    const target = e.target.closest('#v41-dashboard-entry,#v34-dashboard-entry,[data-open-dashboard]');
    if (!target || !isPublicHome()) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    enterWorkspace(true);
  }, true);

  document.addEventListener('click', e => {
    if (!isWorkspaceRoute()) return;
    const target = e.target.closest('button,a,[role="button"],[tabindex]');
    if (!target || target.closest('#v29-home-layer') || target.closest('#v41-studio-workspace')) return;
    if (/^dashboard$/i.test(text(target))) {
      closeStudioHard();
      document.body.classList.add('v46-dashboard');
      document.body.classList.remove('v41-studio-open');
      history.replaceState(null, '', location.pathname + location.search + '#dashboard');
      setTimeout(syncRoute, 0);
    }
  }, true);

  addEventListener('hashchange', () => {
    dashboardActivated = false;
    setTimeout(syncRoute, 10);
  });
  addEventListener('popstate', () => setTimeout(syncRoute, 10));

  new MutationObserver(() => {
    clearTimeout(window.__scholarkV46Sync);
    window.__scholarkV46Sync = setTimeout(syncRoute, 70);
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class','style','hidden'] });

  setInterval(syncRoute, 650);
  setTimeout(syncRoute, 60);
})();