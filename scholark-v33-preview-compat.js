(() => {
  if (window.__SCHOLARK_V33_PREVIEW_COMPAT__) return;
  window.__SCHOLARK_V33_PREVIEW_COMPAT__ = true;
  function sync(){
    const title=document.querySelector('.v29-preview .v32-title');
    if(title && title.id!=='v29-preview-title') title.id='v29-preview-title';
  }
  new MutationObserver(()=>{clearTimeout(window.__v33t);window.__v33t=setTimeout(sync,20);}).observe(document.documentElement,{subtree:true,childList:true});
  setInterval(sync,200);
  setTimeout(sync,20);
})();