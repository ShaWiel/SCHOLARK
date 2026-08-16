(() => {
  if(window.__SCHOLARK_V51_LAYOUT_COMPAT__)return;
  window.__SCHOLARK_V51_LAYOUT_COMPAT__=true;
  // The previous V51 layout depended on V48/V49 and ran its own sync loop.
  // V51 Workspace Shell now owns all visible workspace geometry and routing.
  const cleanup=()=>{
    document.body?.classList.remove('v51-pro-page');
    document.getElementById('scholark-v51-layout-style')?.remove();
    document.documentElement.style.removeProperty('--v51-left');
  };
  cleanup();
  document.addEventListener('DOMContentLoaded',cleanup,{once:true});
})();