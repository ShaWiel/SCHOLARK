(() => {
  if (window.__SCHOLARK_V42_COMPAT_CLEANUP__) return;
  window.__SCHOLARK_V42_COMPAT_CLEANUP__ = true;

  // Routing is owned by V46. V42 now only removes stale artifacts left by older builds.
  const cleanup = () => {
    document.getElementById('v42-pricing')?.remove();
    document.getElementById('v34-home-pricing')?.remove();
    document.getElementById('v40-home-pricing')?.remove();
    document.getElementById('v39-home-pricing')?.remove();
    document.getElementById('v37-home-pricing')?.remove();

    const u = new URL(location.href);
    if (u.searchParams.has('_scholark_workspace')) {
      u.searchParams.delete('_scholark_workspace');
      history.replaceState(null, '', u.pathname + (u.search || '') + (u.hash || ''));
    }
    sessionStorage.removeItem('scholark_open_workspace');
  };

  cleanup();
  addEventListener('hashchange', cleanup);
  new MutationObserver(() => {
    clearTimeout(window.__scholarkV42Compat);
    window.__scholarkV42Compat = setTimeout(cleanup, 120);
  }).observe(document.documentElement, { subtree: true, childList: true });
})();