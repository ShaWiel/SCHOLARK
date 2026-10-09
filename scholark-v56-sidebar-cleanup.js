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

    /* Homepage topbar: SCHOLAVERUM dark navigation chrome. */
    #v55-topbar{
      background:rgba(12,14,19,.97)!important;
      border-bottom:1px solid rgba(255,255,255,.09)!important;
      color:#fff!important;
      box-shadow:0 12px 34px rgba(0,0,0,.18)!important;
    }
    #v55-topbar .v55-brand{color:#fff!important}
    #v55-topbar .v55-brand small{color:#9f9aa9!important}
    #v55-topbar .v55-brand-logo{
      display:block!important;width:64px!important;height:48px!important;
      object-fit:contain!important;object-position:center!important;
      flex:0 0 64px!important;background:transparent!important;
    }
    #v55-topbar .v55-select,#v55-topbar .v55-btn{
      background:#1b1e27!important;color:#f7f6fb!important;border-color:rgba(255,255,255,.11)!important;
    }
    #v55-topbar .v55-select option{background:#17191f!important;color:#fff!important}
    #v55-topbar .v55-btn:hover,#v55-topbar .v55-select:hover{background:#252934!important;border-color:rgba(201,255,106,.26)!important}
    #v55-topbar .v55-btn.dark{background:#c9ff6a!important;color:#111319!important;border-color:#c9ff6a!important}
    #v55-topbar .v55-btn.dark b{color:#111319!important}

    /* V51 owns Home as a first-class sidebar navigation row. */
    #v51-sidebar #v51-home{position:static!important;z-index:auto!important}
    body.v51-collapsed #v51-home{display:none!important}
  `;
  document.head.appendChild(style);

  function cleanup(){
    const side=$('#v51-sidebar');
    if(side){
      $('#v41-sidebar-pro')?.remove();
      $$('.v51-quality',side).forEach(el=>el.remove());
      const home=$('#v51-home',side)||$('#v51-home');
      if(home){
        home.classList.add('v51-nav','v51-home-nav');
        const brand=$('.v51-brand',side);
        if(brand&&home.previousElementSibling!==brand)brand.insertAdjacentElement('afterend',home);
        else if(!brand&&home.parentElement!==side)side.prepend(home);
      }
    }
  }

  cleanup();
  document.addEventListener('DOMContentLoaded',cleanup,{once:true});
  addEventListener('hashchange',()=>setTimeout(cleanup,120));
  addEventListener('scholark-language-ready',()=>setTimeout(cleanup,120));
  [80,500].forEach(ms=>setTimeout(cleanup,ms));
})();