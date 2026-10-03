(() => {
  if(window.__SCHOLARK_V117_CREDIT_STORE__)return;
  window.__SCHOLARK_V117_CREDIT_STORE__=true;
  const $=(s,r=document)=>r.querySelector(s);
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const esc=s=>clean(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isStore=()=>window.__SCHOLARK_ROUTES__?.hash?.()==='credit-store'||String(location.hash||'').toLowerCase().replace(/^#/,'').split(/[?&]/)[0]==='credit-store';
  const session=()=>{try{return window.__SCHOLARK_V72_CLOUD__?.currentSession?.()||JSON.parse(localStorage.getItem('scholark_supabase_session_v2')||'null')}catch{return null}};
  const signed=()=>!!session()?.access_token;
  let page=null,button=null,busyPack='',statusMessage='',statusError=false,renderEpoch=0,routeActive=false,surfaceGuardBusy=false,surfaceObserver=null;

  const PACK_COPY={
    mini:{eyebrow:'SMALL TOP-UP',note:'For a few extra AI actions.'},
    starter:{eyebrow:'LIGHT TOP-UP',note:'A little more room before your next refill.'},
    boost:{eyebrow:'FLEXIBLE',note:'Useful when a busy week uses more credits than expected.'},
    power:{eyebrow:'HEAVY USE',note:'For larger study, research and creation sessions.'},
    max:{eyebrow:'HIGH CAPACITY',note:'A substantial reserve without changing your plan.'},
    ultra:{eyebrow:'BEST CREDIT RATE',note:'The largest one-time reserve for intensive use.'}
  };

  const style=document.createElement('style');
  style.id='scholark-v117-style';
  style.textContent=`
    .v117-store-nav{height:40px;display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(201,255,106,.72);border-radius:13px;padding:0 13px;background:linear-gradient(135deg,#d7ff88,#bdf45d);color:#101820;cursor:pointer;font:900 10px/1 Inter,system-ui;white-space:nowrap;box-shadow:0 8px 24px rgba(201,255,106,.13);transition:transform .16s ease,box-shadow .16s ease}.v117-store-nav:hover{transform:translateY(-1px);box-shadow:0 12px 30px rgba(201,255,106,.2)}.v117-store-nav[aria-current="page"]{box-shadow:0 0 0 3px rgba(201,255,106,.14),0 10px 28px rgba(201,255,106,.16)}
    html.v117-credit-store-route #v29-home-layer,html.v117-credit-store-route #v41-home-pricing,html.v117-credit-store-route #v55-workspace-cta{display:none!important;visibility:hidden!important;pointer-events:none!important}html.v117-credit-store-route #v117-credit-store-page{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}html.v117-credit-store-route #v117-credit-store-page .v117-storebar{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    #v117-credit-store-page{display:block;box-sizing:border-box;min-height:calc(100vh - 66px);margin-top:66px;padding:34px 24px 76px;background:radial-gradient(circle at 84% 0%,rgba(119,92,255,.24),transparent 29%),radial-gradient(circle at 13% 20%,rgba(201,255,106,.12),transparent 26%),linear-gradient(160deg,#0d1723 0%,#111d2d 46%,#17152b 100%);color:#fff;font-family:Inter,system-ui,sans-serif;overflow:hidden;position:relative}
    #v117-credit-store-page::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:34px 34px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.7),transparent 72%);pointer-events:none}
    #v117-credit-store-page[hidden]{display:none!important}.v117-shell{position:relative;z-index:1;width:min(1220px,100%);margin:0 auto}
    .v117-storebar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px;padding:12px 14px 12px 18px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(255,255,255,.055);backdrop-filter:blur(18px);box-shadow:0 16px 50px rgba(0,0,0,.14)}.v117-storebrand{display:flex;align-items:center;gap:10px;min-width:0}.v117-storemark{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:#c9ff6a;color:#111923;font:950 15px Inter;box-shadow:0 8px 22px rgba(201,255,106,.16)}.v117-storebrand div{min-width:0}.v117-storebrand strong{display:block;font:900 12px/1.1 Inter}.v117-storebrand span{display:block;margin-top:3px;color:#9eaabb;font:700 9px/1.2 Inter;letter-spacing:.08em}.v117-nav-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.v117-route-btn{height:38px;border:1px solid rgba(255,255,255,.11);border-radius:12px;padding:0 13px;background:rgba(255,255,255,.06);color:#fff;font:850 10px Inter;cursor:pointer;transition:background .16s ease,transform .16s ease,border-color .16s ease}.v117-route-btn:hover{transform:translateY(-1px);background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2)}.v117-route-btn.primary{background:#c9ff6a;color:#101820;border-color:#c9ff6a}.v117-route-btn.primary:hover{background:#d5ff84}
    .v117-hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(300px,.75fr);gap:24px;align-items:stretch}.v117-hero-copy{padding:34px 4px 24px}.v117-kicker{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid rgba(201,255,106,.18);border-radius:999px;background:rgba(201,255,106,.08);font:900 10px/1 Inter;letter-spacing:.12em;color:#c9ff6a}.v117-kicker::before{content:"";width:6px;height:6px;border-radius:50%;background:#c9ff6a;box-shadow:0 0 12px rgba(201,255,106,.9)}.v117-hero h1{margin:18px 0 14px;max-width:760px;font:950 clamp(44px,6.5vw,78px)/.92 Inter;letter-spacing:-.06em}.v117-hero h1 em{font-style:normal;color:#c9ff6a}.v117-hero p{margin:0;max-width:730px;color:#b9c2ce;font:650 14px/1.72 Inter}.v117-trust{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}.v117-trust span{display:inline-flex;align-items:center;gap:7px;padding:8px 10px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.07);color:#dfe5eb;font:750 10px Inter}.v117-trust b{color:#c9ff6a;font-weight:950}
    .v117-wallet{position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;min-height:240px;border:1px solid rgba(255,255,255,.12);border-radius:26px;padding:24px;background:linear-gradient(150deg,rgba(255,255,255,.11),rgba(255,255,255,.045));box-shadow:0 24px 70px rgba(0,0,0,.22);backdrop-filter:blur(20px)}.v117-wallet::after{content:"";position:absolute;width:180px;height:180px;border-radius:50%;right:-70px;top:-74px;background:radial-gradient(circle,rgba(201,255,106,.2),transparent 68%);pointer-events:none}.v117-wallet-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.v117-wallet small{font:850 10px Inter;letter-spacing:.1em;color:#a9b5c3}.v117-plan-pill{padding:6px 9px;border-radius:999px;background:rgba(201,255,106,.1);color:#c9ff6a;font:900 9px Inter;border:1px solid rgba(201,255,106,.18)}.v117-total-label{margin-top:30px;color:#9faab8;font:750 10px Inter}.v117-total{display:block;margin-top:6px;font:950 48px/1 Inter;color:#fff;letter-spacing:-.05em}.v117-total-sub{margin-top:7px;color:#c9ff6a;font:800 10px Inter}.v117-split{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:20px}.v117-split div{padding:12px;border-radius:14px;background:rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.06)}.v117-split span{display:block;font:750 9px Inter;color:#97a3b2}.v117-split b{display:block;margin-top:5px;font:900 15px Inter}
    .v117-section-head{display:flex;align-items:end;justify-content:space-between;gap:14px;margin-top:42px;margin-bottom:14px}.v117-section-head h2{margin:0;font:950 24px/1 Inter;letter-spacing:-.035em}.v117-section-head p{margin:0;color:#98a5b5;font:700 10px/1.45 Inter;text-align:right}.v117-packs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.v117-pack{position:relative;display:flex;flex-direction:column;min-height:286px;padding:20px;border:1px solid rgba(255,255,255,.09);border-radius:23px;background:linear-gradient(170deg,rgba(255,255,255,.09),rgba(255,255,255,.045));box-shadow:0 18px 44px rgba(0,0,0,.14);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;overflow:hidden}.v117-pack::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,transparent,rgba(201,255,106,.45),transparent);opacity:.45}.v117-pack:hover{transform:translateY(-4px);border-color:rgba(201,255,106,.24);box-shadow:0 25px 60px rgba(0,0,0,.2)}.v117-pack.featured{background:linear-gradient(155deg,rgba(201,255,106,.14),rgba(255,255,255,.06) 45%,rgba(101,89,199,.14));border-color:rgba(201,255,106,.28)}.v117-pack small{font:900 9px Inter;letter-spacing:.12em;color:#c9ff6a}.v117-pack h3{margin:14px 0 3px;font:950 39px/1 Inter;letter-spacing:-.05em}.v117-pack .credits{font:750 10px Inter;color:#9ca8b7}.v117-pack p{margin:16px 0 0;min-height:46px;font:650 11px/1.55 Inter;color:#b8c1cc}.v117-value{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:14px;padding:9px 10px;border-radius:11px;background:rgba(0,0,0,.16);color:#aeb8c5;font:750 9px Inter}.v117-value b{color:#fff;font:900 9px Inter}.v117-price-row{display:flex;align-items:end;justify-content:space-between;gap:10px;margin-top:auto;padding-top:19px}.v117-price{font:950 28px/1 Inter;letter-spacing:-.04em}.v117-price span{display:block;margin-top:5px;font:750 8px Inter;color:#8f9baa;letter-spacing:.06em}.v117-buy{margin-top:13px;border:1px solid rgba(255,255,255,.1);border-radius:13px;padding:13px 14px;background:#fff;color:#101820;font:900 10px Inter;cursor:pointer;transition:transform .16s ease,background .16s ease,box-shadow .16s ease}.v117-buy:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(0,0,0,.18)}.v117-pack.featured .v117-buy{background:#c9ff6a;border-color:#c9ff6a}.v117-buy:disabled{opacity:.55;cursor:progress;transform:none}.v117-badge{position:absolute;right:12px;top:12px;border-radius:999px;padding:7px 9px;background:#c9ff6a;color:#101820;font:950 8px Inter;letter-spacing:.07em}.v117-badge.alt{background:#7566dd;color:#fff}
    .v117-footer-grid{display:grid;grid-template-columns:1.35fr .65fr;gap:12px;margin-top:18px}.v117-note,.v117-status{padding:16px 17px;border-radius:16px;font:700 10px/1.6 Inter}.v117-note{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.07);color:#adb8c5}.v117-note b{color:#fff}.v117-status{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);color:#dce3e9}.v117-status.error{background:rgba(168,52,45,.15);border-color:rgba(240,120,110,.24);color:#ffc8c2}.v117-status.success{background:rgba(116,157,52,.16);border-color:rgba(201,255,106,.25);color:#dfffab}
    @media(max-width:900px){#v117-credit-store-page{margin-top:62px;padding:26px 16px 64px}.v117-hero{grid-template-columns:1fr}.v117-hero-copy{padding:24px 2px 8px}.v117-packs{grid-template-columns:repeat(2,minmax(0,1fr))}.v117-footer-grid{grid-template-columns:1fr}.v117-section-head{align-items:flex-start;flex-direction:column}.v117-section-head p{text-align:left}}
    @media(max-width:560px){#v117-credit-store-page{margin-top:108px;padding:18px 12px 52px;scroll-padding-top:132px}.v117-store-label{display:none}.v117-storebar{align-items:flex-start;flex-direction:column;padding:13px}.v117-nav-actions{width:100%;display:grid;grid-template-columns:1fr 1fr}.v117-route-btn{width:100%;padding:0 9px}.v117-hero-copy{padding-top:18px}.v117-hero h1{font-size:45px}.v117-hero p{font-size:12.5px}.v117-wallet{min-height:218px;padding:19px}.v117-total{font-size:42px}.v117-packs{grid-template-columns:1fr}.v117-pack{min-height:270px}.v117-footer-grid{margin-top:14px}}
  `;
  document.head.appendChild(style);

  function wallet(){
    const w=window.__SCHOLARK_BILLING__?.status?.()?.wallet||window.__SCHOLARK_CREDITS__?.wallet?.()||null;
    const total=Math.max(0,Number(w?.balance)||0),allowance=Math.max(0,Number(w?.monthly_allowance)||0);
    const monthly=w?.monthly_balance==null?Math.min(total,allowance):Math.max(0,Number(w.monthly_balance)||0);
    const topup=w?.topup_balance==null?Math.max(0,total-monthly):Math.max(0,Number(w.topup_balance)||0);
    return{total,monthly,topup,plan:clean(w?.plan||window.__SCHOLARK_BILLING__?.plan?.()||'free').toUpperCase()};
  }
  function routeHome(){location.hash='home';syncRoute()}
  function routeWorkspace(){
    const ws=window.__SCHOLARK_WORKSPACE__;
    if(ws?.openTool){ws.openTool('dashboard');return}
    if(location.hash!=='#dashboard')location.hash='dashboard';
    else window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
  function routeStore(){if(!isStore()){location.hash='credit-store';syncRoute()}else syncRoute()}
  function restoreStoreSurface(){
    if(!isStore())return;
    ensureButton();ensurePage();
    routeActive=true;
    document.documentElement.classList.add('v117-credit-store-route','v55-public-home');
    document.body?.classList.add('v117-credit-store-route','v55-public-home');
    document.documentElement.classList.remove('v51-workspace-root');
    document.body?.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    page.hidden=false;
    page.removeAttribute('hidden');page.removeAttribute('aria-hidden');
    ['display','visibility','opacity','pointer-events'].forEach(p=>page.style.removeProperty(p));
    button?.setAttribute('aria-current','page');
  }

  function ensureButton(){
    const actions=$('#v55-topbar .v55-actions');if(!actions)return null;
    button=$('#v117-credit-store-button',actions);
    if(!button){
      button=document.createElement('button');button.id='v117-credit-store-button';button.type='button';button.className='v117-store-nav';
      button.innerHTML='<span aria-hidden="true">✦</span><span class="v117-store-label">Credit Store</span>';
      button.title='Buy extra SCHOLARK credits';button.setAttribute('aria-label','Credit Store · buy extra SCHOLARK credits');button.onclick=routeStore;
      const before=$('.v85-topbar-credit',actions)||$('.v55-account-wrap',actions)||$('#v55-auth',actions);
      before?actions.insertBefore(button,before):actions.appendChild(button);
    }
    button.setAttribute('aria-current',isStore()?'page':'false');
    return button;
  }

  function ensurePage(){
    page=$('#v117-credit-store-page');
    if(page)return page;
    page=document.createElement('main');page.id='v117-credit-store-page';page.hidden=true;page.setAttribute('aria-label','SCHOLARK Credit Store');
    page.innerHTML='<div class="v117-shell"><nav class="v117-storebar" aria-label="Credit Store navigation"><div class="v117-storebrand"><span class="v117-storemark">✦</span><div><strong>SCHOLARK Credit Store</strong><span>ONE-TIME CREDIT TOP-UPS</span></div></div><div class="v117-nav-actions"><button type="button" class="v117-route-btn primary" data-v117-workspace>← Workspace</button><button type="button" class="v117-route-btn" data-v117-home>Homepage</button></div></nav><div id="v117-store-content"></div></div>';
    document.body.appendChild(page);
    if(!surfaceObserver&&typeof MutationObserver==='function'){
      const guard=()=>{
        if(surfaceGuardBusy||!isStore()||!page?.isConnected)return;
        const cs=getComputedStyle(page),nav=$('.v117-storebar',page);
        const broken=page.hidden||page.getAttribute('aria-hidden')==='true'||cs.display==='none'||cs.visibility==='hidden'||
          document.body.classList.contains('v51-workspace')||document.documentElement.classList.contains('v51-workspace-root')||
          (nav&&(getComputedStyle(nav).display==='none'||getComputedStyle(nav).visibility==='hidden'));
        if(!broken)return;
        surfaceGuardBusy=true;
        try{restoreStoreSurface()}finally{surfaceGuardBusy=false}
      };
      surfaceObserver=new MutationObserver(()=>queueMicrotask(guard));
      surfaceObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
      surfaceObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
      surfaceObserver.observe(page,{attributes:true,attributeFilter:['hidden','aria-hidden','style','class']});
    }
    page.addEventListener('click',e=>{
      const home=e.target.closest?.('[data-v117-home]');if(home){routeHome();return}
      const workspace=e.target.closest?.('[data-v117-workspace]');if(workspace){routeWorkspace();return}
      const buy=e.target.closest?.('[data-v117-pack]');if(!buy)return;
      const pack=clean(buy.dataset.v117Pack).toLowerCase();busyPack=pack;statusMessage='Preparing secure checkout…';statusError=false;render();
      Promise.resolve(window.__SCHOLARK_BILLING__?.buyCredits?.(pack)).catch(err=>{busyPack='';statusError=true;statusMessage=String(err?.message||err||'Could not open checkout.');render()});
    });
    return page;
  }

  async function render(){
    if(!isStore())return;
    const epoch=++renderEpoch;
    ensureButton();ensurePage();
    let cfg={};
    try{cfg=await window.__SCHOLARK_BILLING__?.config?.()||{}}catch{}
    if(epoch!==renderEpoch||!isStore())return;
    const packs=cfg.creditPacks||{},entries=Object.entries(packs),w=wallet();
    const signedIn=signed();
    const per100=p=>Math.round((Number(p.price||0)/Math.max(1,Number(p.credits||1))*100)*100)/100;
    const content=$('#v117-store-content',page);if(!content)return;
    content.innerHTML='<section class="v117-hero"><div class="v117-hero-copy"><div class="v117-kicker">CREDIT STORE</div><h1>Top up. <em>Keep creating.</em></h1><p>Need more room before your monthly refill? Add extra SCHOLARK credits without changing your subscription. Monthly credits are used first; purchased credits stay in your wallet until you use them.</p><div class="v117-trust"><span><b>✓</b> One-time purchase</span><span><b>✓</b> Extra credits persist</span><span><b>✓</b> Secure Paddle checkout</span></div></div><aside class="v117-wallet"><div><div class="v117-wallet-head"><small>CREDIT WALLET</small><span class="v117-plan-pill">'+esc(w.plan)+' PLAN</span></div><div class="v117-total-label">TOTAL AVAILABLE</div><b class="v117-total">'+(signedIn?w.total.toLocaleString():'—')+'</b><div class="v117-total-sub">'+(signedIn?'Ready to use across SCHOLARK':'Sign in to see your balance')+'</div></div><div class="v117-split"><div><span>MONTHLY CREDITS</span><b>'+(signedIn?w.monthly.toLocaleString():'—')+'</b></div><div><span>EXTRA CREDITS</span><b>'+(signedIn?w.topup.toLocaleString():'—')+'</b></div></div></aside></section><div class="v117-section-head"><div><h2>Choose your top-up</h2></div><p>More credits = better one-time value.<br>Your subscription remains unchanged.</p></div><section class="v117-packs">'+entries.map(([key,p])=>{const meta=PACK_COPY[key]||{eyebrow:'TOP-UP',note:'One-time SCHOLARK credit top-up.'},featured=key==='power'||key==='ultra',badge=key==='ultra'?'<span class="v117-badge">BEST VALUE</span>':key==='power'?'<span class="v117-badge alt">POPULAR</span>':'';return '<article class="v117-pack '+(featured?'featured':'')+'">'+badge+'<small>'+esc(meta.eyebrow)+'</small><h3>'+Number(p.credits||0).toLocaleString()+'</h3><div class="credits">SCHOLARK credits</div><p>'+esc(meta.note)+'</p><div class="v117-value"><span>VALUE</span><b>$'+per100(p).toFixed(2)+' / 100 credits</b></div><div class="v117-price-row"><div class="v117-price">$'+Number(p.price||0).toFixed(2)+'<span>USD · ONE TIME</span></div></div><button type="button" class="v117-buy" data-v117-pack="'+esc(key)+'" '+(busyPack?'disabled':'')+'>'+(busyPack===key?'Opening secure checkout…':'Buy '+Number(p.credits||0).toLocaleString()+' credits')+'</button></article>'}).join('')+'</section><section class="v117-footer-grid"><div class="v117-note"><b>How SCHOLARK uses credits:</b> monthly credits are spent first. Extra credits remain separate and do not disappear when your monthly allowance refills. For recurring usage, Plus and Pro remain the better monthly value.</div><div class="v117-status '+(statusError?'error':'')+(statusMessage.startsWith('✓')?' success':'')+'" role="status">'+esc(statusMessage||(cfg.environment==='sandbox'?'TEST MODE · Paddle sandbox is active. No real charge will be made.':'Secure one-time checkout is handled by Paddle.'))+'</div></section>';
    window.__SCHOLARK_I18N__?.apply?.(page);setTimeout(()=>window.__SCHOLARK_I18N__?.translateMissing?.(),50);
  }

  function syncRoute(){
    ensureButton();ensurePage();
    const store=isStore(),entering=store&&!routeActive;
    routeActive=store;
    if(store&&document.body){
      // Store is a public surface. Clear any delayed Workspace ownership from
      // a previous dashboard visit before revealing the store again.
      document.body.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open','v81-home');
      document.documentElement.classList.remove('v51-workspace-root','scholark-workspace-entering');
      document.body.classList.add('v55-public-home');
      document.documentElement.classList.add('v55-public-home');
    }
    document.documentElement.classList.toggle('v117-credit-store-route',store);
    document.body?.classList.toggle('v117-credit-store-route',store);
    page.hidden=!store;
    button?.setAttribute('aria-current',store?'page':'false');
    if(store){
      render();
      if(entering){
        Promise.resolve(window.__SCHOLARK_BILLING__?.refresh?.())
          .then(()=>window.__SCHOLARK_CREDITS__?.load?.())
          .then(()=>{if(isStore())render()})
          .catch(()=>{});
      }
    }else{renderEpoch++;busyPack='';statusMessage='';statusError=false}
  }

  addEventListener('hashchange',()=>setTimeout(syncRoute,10));
  addEventListener('popstate',()=>setTimeout(syncRoute,10));
  addEventListener('pageshow',()=>setTimeout(syncRoute,30));
  addEventListener('scholark-runtime-ready',()=>{[20,160,600].forEach(ms=>setTimeout(syncRoute,ms))});
  addEventListener('scholark:auth-changed',()=>setTimeout(()=>{if(isStore())render();else ensureButton()},70));
  addEventListener('scholark:billing-changed',()=>setTimeout(()=>{if(isStore())render()},50));
  addEventListener('scholark-language-ready',()=>setTimeout(()=>{ensureButton();if(isStore())render()},100));
  addEventListener('scholark:credit-store-status',e=>{
    const d=e.detail||{};
    if(d.state==='completed'){busyPack='';statusError=false;statusMessage='✓ '+Number(d.creditsAdded||0).toLocaleString()+' credits added to your account.';restoreStoreSurface();setTimeout(render,80)}
    else if(d.state==='error'){busyPack='';statusError=true;statusMessage=String(d.message||'Checkout failed. Please try again.');restoreStoreSurface();render()}
    else if(d.state==='closed'){busyPack='';statusError=false;statusMessage='';restoreStoreSurface();render()}
    else if(d.state==='auth'){busyPack='';statusError=false;statusMessage=String(d.message||'Sign in or create your SCHOLARK account first.');restoreStoreSurface();render()}
    else if(d.message){statusMessage=String(d.message);statusError=false;restoreStoreSurface();render()}
  });
  document.addEventListener('click',e=>{
    if(!isStore())return;
    const closesAuth=e.target?.closest?.('#v72-modal .v72-x')||e.target?.id==='v72-modal';
    if(closesAuth){busyPack='';[0,80,240].forEach((ms,i)=>setTimeout(()=>{syncRoute();restoreStoreSurface();if(i===0)render()},ms))}
  },true);
  if(document.body)syncRoute();else addEventListener('DOMContentLoaded',syncRoute,{once:true});
  [120,480].forEach(ms=>setTimeout(syncRoute,ms));
  window.__SCHOLARK_CREDIT_STORE__={open:routeStore,close:routeHome,workspace:routeWorkspace,render,sync:syncRoute,restore:restoreStoreSurface,isOpen:isStore,stableNavigation:true,release:'r206'};
})();