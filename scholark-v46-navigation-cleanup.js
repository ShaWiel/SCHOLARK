(() => {
  if (window.__SCHOLARK_V46_COMPAT__) return;
  window.__SCHOLARK_V46_COMPAT__ = true;

  // V48 owns all homepage/workspace routing. V46 now only removes stale V46 artifacts.
  const cleanup=()=>{
    document.body?.classList.remove('v46-public-home','v46-workspace','v46-dashboard');
    document.getElementById('scholark-v46-navigation-style')?.remove();
    document.getElementById('v46-workspace-dashboard')?.remove();
    document.querySelectorAll('[data-v46-retired-public-home="1"]').forEach(el=>{
      delete el.dataset.v46RetiredPublicHome;
      el.hidden=false;
      el.removeAttribute('aria-hidden');
      ['display','visibility','opacity','pointer-events'].forEach(p=>el.style.removeProperty(p));
    });
  };
  cleanup();
  document.addEventListener('DOMContentLoaded',cleanup,{once:true});
})();