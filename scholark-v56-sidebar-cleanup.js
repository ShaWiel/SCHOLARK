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

    /* Homepage topbar: SCHOLARK dark navigation chrome. */
    #v55-topbar{
      background:rgba(12,14,19,.97)!important;
      border-bottom:1px solid rgba(255,255,255,.09)!important;
      color:#fff!important;
      box-shadow:0 12px 34px rgba(0,0,0,.18)!important;
    }
    #v55-topbar .v55-brand{color:#fff!important}
    #v55-topbar .v55-brand small{color:#9f9aa9!important}
    #v55-topbar .v55-brand-mark{
      width:42px!important;height:42px!important;border-radius:0!important;
      padding:0!important;background:transparent!important;color:transparent!important;
      overflow:hidden!important;display:grid!important;place-items:center!important;
      flex:0 0 42px!important;
    }
    #v55-topbar .v55-brand-mark img,
    #v55-topbar .v55-brand-mark svg,
    #v55-topbar .v55-brand-mark picture,
    #v55-topbar .v55-brand-mark canvas{
      display:block!important;max-width:100%!important;max-height:100%!important;width:auto!important;height:auto!important;
    }
    #v55-topbar .v55-select,#v55-topbar .v55-btn{
      background:#1b1e27!important;color:#f7f6fb!important;border-color:rgba(255,255,255,.11)!important;
    }
    #v55-topbar .v55-select option{background:#17191f!important;color:#fff!important}
    #v55-topbar .v55-btn:hover,#v55-topbar .v55-select:hover{background:#252934!important;border-color:rgba(201,255,106,.26)!important}
    #v55-topbar .v55-btn.dark{background:#c9ff6a!important;color:#111319!important;border-color:#c9ff6a!important}
    #v55-topbar .v55-btn.dark b{color:#111319!important}

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

  function syncTopbarLogo(){
    const source=$('#v51-sidebar .v51-logo');
    const target=$('#v55-topbar .v55-brand-mark');
    if(!source||!target)return;

    const html=source.innerHTML.trim();
    if(!html)return;

    const signature=html.replace(/\s+/g,' ');
    if(target.dataset.v56LogoSignature===signature)return;

    target.innerHTML='';
    [...source.childNodes].forEach(node=>target.appendChild(node.cloneNode(true)));
    target.dataset.v56LogoSignature=signature;
    target.dataset.v56OfficialLogo='1';
    target.setAttribute('aria-label','SCHOLARK logo');
  }

  function cleanup(){
    const side=$('#v51-sidebar');
    if(side){
      $('#v41-sidebar-pro')?.remove();
      $$('.v51-quality',side).forEach(el=>el.remove());
      const home=$('#v51-home');
      if(home && home.parentElement!==side){
        const brand=$('.v51-brand',side);
        if(brand)brand.insertAdjacentElement('afterend',home);
        else side.prepend(home);
      }
    }
    syncTopbarLogo();
  }

  cleanup();
  document.addEventListener('DOMContentLoaded',cleanup,{once:true});
  addEventListener('hashchange',()=>setTimeout(cleanup,120));
  addEventListener('scholark-language-ready',()=>setTimeout(cleanup,120));
  [80,500].forEach(ms=>setTimeout(cleanup,ms));
})();