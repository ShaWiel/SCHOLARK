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
      width:38px!important;height:38px!important;border-radius:12px!important;
      padding:0!important;background:transparent!important;color:transparent!important;
      overflow:visible!important;display:grid!important;place-items:center!important;
    }
    #v55-topbar .v55-brand-mark svg{display:block!important;width:38px!important;height:38px!important;overflow:visible!important}
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

  function scholarkLogoSvg(){
    return `<svg viewBox="0 0 64 64" role="img" aria-label="SCHOLARK logo" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="v56LogoBg" x1="7" y1="5" x2="57" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#c9ff6a"/>
          <stop offset=".46" stop-color="#a8ef68"/>
          <stop offset="1" stop-color="#7b67ff"/>
        </linearGradient>
        <linearGradient id="v56Cap" x1="20" y1="12" x2="49" y2="27" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7561ff"/>
          <stop offset="1" stop-color="#30275d"/>
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="17" fill="url(#v56LogoBg)"/>
      <path d="M40.8 23.7c-2.4-2.1-5.2-3.1-8.5-3.1-4.9 0-8 2-8 5 0 3.6 3.5 4.5 8.4 5.5 6.6 1.4 11.4 3.6 11.4 9.7 0 7-5.9 11.3-14.5 11.3-6.1 0-11-1.8-14.8-5.5l5.1-6.1c2.9 2.7 6.2 4 10 4 4.2 0 6.6-1.3 6.6-3.6 0-2.5-2.7-3.5-7.7-4.5-7-1.5-12-3.9-12-10.7 0-7.1 6.4-11.7 15.4-11.7 5.5 0 10.1 1.7 13.8 5l-5.4 5.7Z" fill="#111319"/>
      <path d="m18 16.1 15-7.4 15 7.4-15 7.4-15-7.4Z" fill="url(#v56Cap)"/>
      <path d="M23.5 19.2v5.7c4.8 3.5 14.2 3.5 19 0v-5.7L33 24l-9.5-4.8Z" fill="#30275d"/>
      <path d="M48 16.2v8.1" stroke="#c9ff6a" stroke-width="2.1" stroke-linecap="round"/>
      <circle cx="48" cy="26.5" r="2.2" fill="#c9ff6a"/>
    </svg>`;
  }

  function upgradeTopbar(){
    const mark=$('#v55-topbar .v55-brand-mark');
    if(!mark||mark.dataset.v56OfficialLogo==='1')return;
    mark.innerHTML=scholarkLogoSvg();
    mark.dataset.v56OfficialLogo='1';
    mark.setAttribute('aria-label','SCHOLARK');
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
    upgradeTopbar();
  }

  cleanup();
  document.addEventListener('DOMContentLoaded',cleanup,{once:true});
  new MutationObserver(()=>{
    clearTimeout(window.__scholarkV56Cleanup);
    window.__scholarkV56Cleanup=setTimeout(cleanup,40);
  }).observe(document.documentElement,{subtree:true,childList:true});
  setTimeout(cleanup,80);
})();