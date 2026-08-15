(() => {
  if (window.__SCHOLARK_V36_DASHBOARD_ROUTER_FIX__) return;
  window.__SCHOLARK_V36_DASHBOARD_ROUTER_FIX__ = true;

  const isDashboard = () => (location.hash || '').toLowerCase().includes('dashboard');
  let workspace = null;
  let workspaceDisplay = '';

  function findWorkspace() {
    const tagged = document.querySelector('[data-v30-legacy-home="1"]');
    if (tagged) return tagged;
    const sidebar = [...document.querySelectorAll('aside,nav,section,div')].find(el => {
      if (el.closest('#v29-home-layer')) return false;
      const t = (el.textContent || '');
      const r = el.getBoundingClientRect();
      return r.width >= 120 && r.width <= 460 && r.height >= 280 && t.includes('Dashboard') && t.includes('Studio AI');
    });
    return sidebar?.nextElementSibling || document.querySelector('main,[role="main"]');
  }

  function forceSidebarOpen() {
    localStorage.setItem('scholark_sidebar_closed', '0');
    const toggle = document.getElementById('v26-sidebar-toggle');
    if (!toggle) return;
    const wantsOpen = toggle.textContent.trim() === '☰' || /open sidebar/i.test(toggle.title || '');
    if (wantsOpen) toggle.click();
  }

  function enterDashboard() {
    document.body?.classList.add('v36-dashboard-route');

    const publicHome = document.getElementById('v29-home-layer');
    if (publicHome) {
      publicHome.hidden = true;
      publicHome.style.setProperty('display', 'none', 'important');
    }

    workspace = workspace || findWorkspace();
    if (workspace) {
      // Temporarily remove V30's marker to recover the workspace's real display mode.
      if (workspace.dataset?.v30LegacyHome === '1') delete workspace.dataset.v30LegacyHome;
      workspace.hidden = false;
      workspace.style.removeProperty('display');
      const recovered = getComputedStyle(workspace).display;
      if (recovered && recovered !== 'none') workspaceDisplay = recovered;
      workspace.style.setProperty('display', workspaceDisplay || 'block', 'important');
      workspace.style.setProperty('visibility', 'visible', 'important');
      workspace.style.setProperty('opacity', '1', 'important');
      workspace.style.setProperty('pointer-events', 'auto', 'important');
    }

    forceSidebarOpen();

    const dashEntry = document.getElementById('v34-dashboard-entry');
    if (dashEntry) dashEntry.hidden = true;
  }

  function leaveDashboard() {
    document.body?.classList.remove('v36-dashboard-route');
    if (workspace) {
      workspace.style.removeProperty('display');
      workspace.style.removeProperty('visibility');
      workspace.style.removeProperty('opacity');
      workspace.style.removeProperty('pointer-events');
    }
  }

  function sync() {
    if (isDashboard()) enterDashboard();
    else leaveDashboard();
  }

  new MutationObserver(() => {
    clearTimeout(window.__v36sync);
    window.__v36sync = setTimeout(sync, 25);
  }).observe(document.documentElement, {subtree:true, childList:true, attributes:true, attributeFilter:['class','style','hidden','data-v30-legacy-home']});

  addEventListener('hashchange', () => setTimeout(sync, 0));
  addEventListener('popstate', () => setTimeout(sync, 0));
  setInterval(sync, 180);
  setTimeout(sync, 20);
})();