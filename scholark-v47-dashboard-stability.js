(() => {
  if (window.__SCHOLARK_V47_COMPAT__) return;
  window.__SCHOLARK_V47_COMPAT__ = true;

  // V47's aggressive dashboard timer has been retired.
  // V48 owns workspace visibility, routing, sidebar and dashboard stability.
  const cleanup=()=>{
    document.body?.classList.remove('v47-dashboard');
    document.getElementById('scholark-v47-dashboard-stability-style')?.remove();
  };
  cleanup();
  document.addEventListener('DOMContentLoaded',cleanup,{once:true});
})();