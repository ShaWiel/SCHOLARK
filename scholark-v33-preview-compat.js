(() => {
  if (window.__SCHOLARK_V33_PREVIEW_COMPAT__) return;
  window.__SCHOLARK_V33_PREVIEW_COMPAT__ = true;
  function sync(){
    const title=document.querySelector('.v29-preview .v32-title');
    if(title && title.id!=='v29-preview-title') title.id='v29-preview-title';
  }
  addEventListener('hashchange',()=>setTimeout(sync,100));
  [40,500].forEach(ms=>setTimeout(sync,ms));
})();