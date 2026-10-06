(() => {
  if (window.__SCHOLARK_V119_FOUNDATION_POLISH__) return;
  window.__SCHOLARK_V119_FOUNDATION_POLISH__ = true;

  const html=document.documentElement;
  const route=()=>String(location.hash||'#home').replace(/^#/,'').split(/[?&]/)[0].toLowerCase()||'home';
  const isStore=()=>route()==='credit-store';
  const state={syncs:0,routeChanges:0,lastRoute:route(),online:navigator.onLine,startedAt:Date.now()};

  const css=document.createElement('style');
  css.id='scholark-v119-style';
  css.textContent=`
    :root{
      --sch-r218-ink:#17191f;
      --sch-r218-violet:#6d5dfc;
      --sch-r218-lime:#c9ff6a;
      --sch-r218-line:rgba(23,25,31,.085);
      --sch-r218-soft-shadow:0 18px 50px rgba(31,27,63,.075);
      --sch-r218-card-shadow:0 24px 70px rgba(31,27,63,.095);
    }
    html:not(.scholark-r218-store) #v55-topbar{
      border-bottom:1px solid rgba(23,25,31,.07)!important;
      box-shadow:0 10px 34px rgba(31,27,63,.055);
      backdrop-filter:blur(18px) saturate(1.08);
    }
    html:not(.scholark-r218-store) #v29-home-layer .v29-hero h1{
      letter-spacing:-.052em!important;
      text-wrap:balance;
    }
    html:not(.scholark-r218-store) #v29-home-layer .v29-hero p{
      line-height:1.62!important;
      text-wrap:pretty;
    }
    html:not(.scholark-r218-store) #v29-home-layer .v29-bento-card,
    html:not(.scholark-r218-store) #v29-home-layer .v29-studio,
    html:not(.scholark-r218-store) #v29-home-layer .v29-future-card,
    html:not(.scholark-r218-store) #v41-home-pricing .v41-plan{
      border-color:var(--sch-r218-line)!important;
      box-shadow:var(--sch-r218-soft-shadow)!important;
    }
    html:not(.scholark-r218-store) #v29-home-layer .v29-bento-card:hover,
    html:not(.scholark-r218-store) #v29-home-layer .v29-future-card:hover{
      transform:translateY(-3px);
      box-shadow:var(--sch-r218-card-shadow)!important;
    }
    html:not(.scholark-r218-store) #v29-home-layer button,
    html:not(.scholark-r218-store) #v55-topbar button,
    html:not(.scholark-r218-store) #v41-home-pricing button{
      border-radius:13px;
    }
    html:not(.scholark-r218-store) body.v51-workspace{
      background:
        radial-gradient(circle at 76% -8%,rgba(109,93,252,.105),transparent 30%),
        radial-gradient(circle at 18% 102%,rgba(201,255,106,.13),transparent 26%),
        linear-gradient(180deg,#f9f8f4,#f1f0ea)!important;
    }
    html:not(.scholark-r218-store) body.v51-workspace #v51-sidebar{
      border-right:1px solid rgba(255,255,255,.08);
      box-shadow:16px 0 54px rgba(10,12,18,.12)!important;
    }
    html:not(.scholark-r218-store) body.v51-workspace #v51-main{
      background:transparent!important;
      scroll-behavior:smooth;
    }
    html:not(.scholark-r218-store) body.v51-workspace .v51-nav{
      border-radius:13px!important;
      transition:background-color .16s ease,transform .16s ease,color .16s ease,box-shadow .16s ease!important;
    }
    html:not(.scholark-r218-store) body.v51-workspace .v51-nav:hover{
      transform:translateX(2px);
    }
    html:not(.scholark-r218-store) body.v51-workspace .v51-nav.active,
    html:not(.scholark-r218-store) body.v51-workspace .v51-nav[aria-current="page"]{
      box-shadow:0 10px 26px rgba(109,93,252,.15);
    }
    html:not(.scholark-r218-store) body.v51-workspace .v51-card,
    html:not(.scholark-r218-store) body.v51-workspace .v52-card,
    html:not(.scholark-r218-store) body.v51-workspace .v52-form,
    html:not(.scholark-r218-store) body.v51-workspace .v86-card,
    html:not(.scholark-r218-store) body.v51-workspace .v64-card,
    html:not(.scholark-r218-store) body.v51-workspace .v111-card{
      border-color:var(--sch-r218-line)!important;
      box-shadow:var(--sch-r218-soft-shadow)!important;
    }
    html:not(.scholark-r218-store) body.v51-workspace input,
    html:not(.scholark-r218-store) body.v51-workspace textarea,
    html:not(.scholark-r218-store) body.v51-workspace select{
      border-radius:12px!important;
    }
    html:not(.scholark-r218-store) body.v51-workspace input:focus,
    html:not(.scholark-r218-store) body.v51-workspace textarea:focus,
    html:not(.scholark-r218-store) body.v51-workspace select:focus{
      border-color:rgba(109,93,252,.45)!important;
      box-shadow:0 0 0 4px rgba(109,93,252,.09)!important;
    }
    html:not(.scholark-r218-store) body.v51-workspace button{
      text-rendering:optimizeLegibility;
    }
    html:not(.scholark-r218-store).scholark-r218-route-settle body.v51-workspace #v51-main,
    html:not(.scholark-r218-store).scholark-r218-route-settle #v29-home-layer{
      animation:schR218Settle .18s ease both;
    }
    html.scholark-r218-offline:not(.scholark-r218-store) #v55-topbar::after{
      content:'Offline';
      position:absolute;
      right:10px;
      bottom:-22px;
      padding:4px 8px;
      border-radius:999px;
      background:#17191f;
      color:#fff;
      font:700 10px/1 Inter,sans-serif;
      box-shadow:0 8px 20px rgba(0,0,0,.15);
    }
    @keyframes schR218Settle{from{opacity:.965;transform:translateY(2px)}to{opacity:1;transform:none}}
    @media(max-width:760px){
      html:not(.scholark-r218-store) body.v51-workspace #v51-main{scroll-behavior:auto}
      html:not(.scholark-r218-store) #v29-home-layer .v29-bento-card:hover,
      html:not(.scholark-r218-store) #v29-home-layer .v29-future-card:hover,
      html:not(.scholark-r218-store) body.v51-workspace .v51-nav:hover{transform:none}
    }
    @media(prefers-reduced-motion:reduce){
      html:not(.scholark-r218-store).scholark-r218-route-settle body.v51-workspace #v51-main,
      html:not(.scholark-r218-store).scholark-r218-route-settle #v29-home-layer{animation:none!important}
      html:not(.scholark-r218-store) body.v51-workspace #v51-main{scroll-behavior:auto}
    }
  `;
  document.head.appendChild(css);

  let settleTimer=0;
  function sync(reason='sync'){
    state.syncs++;
    const next=route();
    if(next!==state.lastRoute){state.routeChanges++;state.lastRoute=next}
    const store=next==='credit-store';
    html.classList.toggle('scholark-r218-store',store);
    state.online=navigator.onLine;
    html.classList.toggle('scholark-r218-offline',!state.online);
    if(!store&&reason!=='boot'){
      html.classList.remove('scholark-r218-route-settle');
      requestAnimationFrame(()=>{
        html.classList.add('scholark-r218-route-settle');
        clearTimeout(settleTimer);
        settleTimer=setTimeout(()=>html.classList.remove('scholark-r218-route-settle'),220);
      });
    }else{
      html.classList.remove('scholark-r218-route-settle');
    }
    html.dataset.scholarkPolish='r218';
  }

  function health(){
    const store=isStore();
    const hardening=window.__SCHOLARK_HARDENING__?.verify?.()||null;
    return {
      ok:!!document.getElementById('scholark-v119-style')&&(!document.body.classList.contains('v51-workspace')||hardening?.runtimeFailures?.length===0),
      release:'r218',
      route:route(),
      storeProtected:store?html.classList.contains('scholark-r218-store'):true,
      hardening,
      syncs:state.syncs,
      routeChanges:state.routeChanges,
      online:state.online,
      uptimeSeconds:Math.max(0,Math.round((Date.now()-state.startedAt)/1000))
    };
  }

  addEventListener('hashchange',()=>sync('route'));
  addEventListener('popstate',()=>sync('route'));
  addEventListener('online',()=>sync('network'));
  addEventListener('offline',()=>sync('network'));
  addEventListener('scholark-runtime-ready',()=>sync('runtime'));
  addEventListener('scholark-workspace-change',()=>sync('workspace'));
  addEventListener('pageshow',()=>sync('pageshow'));
  sync('boot');

  window.__SCHOLARK_R218__={health,sync,release:'r218'};
})();