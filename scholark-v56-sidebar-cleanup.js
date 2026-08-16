(() => {
  if (window.__SCHOLARK_V56_SIDEBAR_CLEANUP__) return;
  window.__SCHOLARK_V56_SIDEBAR_CLEANUP__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const style=document.createElement('style');
  style.id='scholark-v56-style';
  style.textContent=`
    /* V51 already owns these three tools. Never show V41's duplicate Pro block. */
    #v41-sidebar-pro{display:none!important;visibility:hidden!important;pointer-events:none!important;height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}
    #v51-sidebar .v51-quality{display:none!important}

    /* Return Home belongs to the workspace sidebar, not the canvas. */
    #v51-sidebar #v51-home{
      position:static!important;z-index:auto!important;width:100%!important;height:auto!important;
      margin:0 0 12px!important;padding:10px 11px!important;border:1px solid rgba(255,255,255,.10)!important;
      border-radius:11px!important;background:rgba(255,255,255,.055)!important;color:#e8e6ed!important;
      box-shadow:none!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;
      gap:8px!important;text-align:left!important;font:800 9.5px/1.2 Inter,system-ui,sans-serif!important;cursor:pointer!important;
    }
    #v51-sidebar #v51-home:hover{background:rgba(201,255,106,.10)!important;color:#fff!important}
    #v51-sidebar #v51-home b{color:#c9ff6a!important;margin:0!important;font-size:12px!important}

    body.v51-collapsed #v51-home{display:none!important}
    @media(max-width:720px){
      #v51-sidebar #v51-home{justify-content:center!important;padding:10px 5px!important;font-size:0!important}
      #v51-sidebar #v51-home b{font-size:15px!important}
    }
  `;
  document.head.appendChild(style);

  function cleanup(){
    const side=$('#v51-sidebar');
    if(!side)return;

    // Remove the old duplicated V41 Pro section completely when it exists.
    $('#v41-sidebar-pro')?.remove();

    // Remove the large AI quality explainer card from the sidebar only.
    $$('.v51-quality',side).forEach(el=>el.remove());

    // Move the one existing Return to homepage control into the sidebar.
    const home=$('#v51-home');
    if(home && home.parentElement!==side){
      const brand=$('.v51-brand',side);
      if(brand)brand.insertAdjacentElement('afterend',home);
      else side.prepend(home);
    }
  }

  cleanup();
  document.addEventListener('DOMContentLoaded',cleanup,{once:true});
  new MutationObserver(()=>{
    clearTimeout(window.__scholarkV56Cleanup);
    window.__scholarkV56Cleanup=setTimeout(cleanup,40);
  }).observe(document.documentElement,{subtree:true,childList:true});
  setTimeout(cleanup,80);
})();