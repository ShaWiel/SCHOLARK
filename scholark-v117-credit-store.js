(() => {
  if(window.__SCHOLARK_V117_CREDIT_STORE__)return;
  window.__SCHOLARK_V117_CREDIT_STORE__=true;
  const $=(s,r=document)=>r.querySelector(s);
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const esc=s=>clean(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isStore=()=>window.__SCHOLARK_ROUTES__?.hash?.()==='credit-store'||String(location.hash||'').toLowerCase().replace(/^#/,'').split(/[?&]/)[0]==='credit-store';
  const session=()=>{try{return window.__SCHOLARK_V72_CLOUD__?.currentSession?.()||JSON.parse(localStorage.getItem('scholark_supabase_session_v2')||'null')}catch{return null}};
  const signed=()=>!!session()?.access_token;
  let page=null,button=null,busyPack='',statusMessage='',statusError=false,renderEpoch=0,routeActive=false;

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
    .v117-store-nav{height:38px;display:inline-flex;align-items:center;gap:7px;border:1px solid #c9ff6a;border-radius:12px;padding:0 11px;background:#c9ff6a;color:#17191f;cursor:pointer;font:950 8.5px/1 Inter,system-ui;white-space:nowrap;transition:transform .16s ease,box-shadow .16s ease}.v117-store-nav:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(201,255,106,.16)}.v117-store-nav[aria-current="page"]{box-shadow:inset 0 0 0 2px rgba(23,25,31,.16)}
    html.v117-credit-store-route #v29-home-layer,html.v117-credit-store-route #v41-home-pricing,html.v117-credit-store-route #v55-workspace-cta{display:none!important;visibility:hidden!important;pointer-events:none!important}
    #v117-credit-store-page{display:block;box-sizing:border-box;min-height:calc(100vh - 66px);margin-top:66px;padding:52px 26px 80px;background:radial-gradient(circle at 78% 8%,rgba(201,255,106,.2),transparent 25%),linear-gradient(180deg,#f8f8fb 0%,#f1f0f5 100%);color:#17191f;font-family:Inter,system-ui,sans-serif}
    #v117-credit-store-page[hidden]{display:none!important}.v117-shell{width:min(1180px,100%);margin:0 auto}.v117-back{border:0;background:transparent;color:#5e5864;padding:0 0 16px;font:850 9px Inter;cursor:pointer}.v117-hero{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(260px,.65fr);gap:24px;align-items:end}.v117-kicker{font:950 8px/1 Inter;letter-spacing:.16em;color:#6559c7}.v117-hero h1{margin:9px 0 12px;font:950 clamp(38px,6vw,70px)/.9 Inter;letter-spacing:-.055em}.v117-hero p{margin:0;max-width:760px;color:#6f6975;font:650 11px/1.65 Inter}.v117-wallet{background:#17191f;color:#fff;border-radius:22px;padding:18px;box-shadow:0 18px 46px rgba(23,25,31,.12)}.v117-wallet small{font:900 7px Inter;letter-spacing:.12em;color:#a8a4af}.v117-total{display:block;margin-top:7px;font:950 30px/1 Inter;color:#c9ff6a}.v117-split{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:13px}.v117-split div{padding:10px;border-radius:12px;background:rgba(255,255,255,.07)}.v117-split span{display:block;font:750 7px Inter;color:#aaa6b2}.v117-split b{display:block;margin-top:4px;font:900 12px Inter}.v117-packs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:32px}.v117-pack{position:relative;display:flex;flex-direction:column;min-height:250px;padding:20px;border:1px solid #e2dfe8;border-radius:22px;background:#fff;box-shadow:0 9px 30px rgba(32,28,44,.05)}.v117-pack.featured{border-color:#b5d86d;box-shadow:0 18px 44px rgba(106,135,47,.11)}.v117-pack small{font:950 7px Inter;letter-spacing:.12em;color:#6559c7}.v117-pack h2{margin:11px 0 2px;font:950 32px/1 Inter;letter-spacing:-.04em}.v117-pack .credits{font:750 8.5px Inter;color:#827b88}.v117-pack p{margin:14px 0 0;min-height:42px;font:650 9px/1.5 Inter;color:#77717c}.v117-price{margin-top:auto;padding-top:20px;font:950 27px/1 Inter}.v117-price span{font:750 8px Inter;color:#8a838f}.v117-buy{margin-top:12px;border:0;border-radius:12px;padding:12px 14px;background:#17191f;color:#fff;font:900 9px Inter;cursor:pointer}.v117-pack.featured .v117-buy{background:#c9ff6a;color:#17191f}.v117-buy:disabled{opacity:.55;cursor:progress}.v117-badge{position:absolute;right:12px;top:12px;border-radius:999px;padding:6px 8px;background:#17191f;color:#c9ff6a;font:900 6.5px Inter;letter-spacing:.08em}.v117-fine{display:grid;grid-template-columns:1.2fr .8fr;gap:12px;margin-top:18px}.v117-note,.v117-status{padding:14px 16px;border-radius:15px;font:750 8.5px/1.55 Inter}.v117-note{background:#eceaff;color:#5148a8}.v117-status{background:#fff;border:1px solid #e3e0e8;color:#625b68}.v117-status.error{background:#fff0ee;border-color:#f0b9b1;color:#8e3831}.v117-status.success{background:#f1fadf;border-color:#c7df98;color:#3e5f1f}
    @media(max-width:900px){#v117-credit-store-page{margin-top:62px;padding:38px 16px 64px}.v117-hero{grid-template-columns:1fr}.v117-packs{grid-template-columns:repeat(2,minmax(0,1fr))}.v117-fine{grid-template-columns:1fr}}
    @media(max-width:560px){#v117-credit-store-page{margin-top:108px;padding:28px 12px 56px}.v117-store-label{display:none}.v117-packs{grid-template-columns:1fr}.v117-pack{min-height:225px}.v117-hero h1{font-size:42px}.v117-split{grid-template-columns:1fr}}
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
  function routeStore(){if(!isStore()){location.hash='credit-store';syncRoute()}else syncRoute()}

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
    page=document.createElement('main');page.id='v117-credit-store-page';page.hidden=true;page.setAttribute('aria-label','SCHOLARK Credit Store');document.body.appendChild(page);
    page.addEventListener('click',e=>{
      const back=e.target.closest?.('[data-v117-home]');if(back){routeHome();return}
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
    page.innerHTML='<div class="v117-shell"><button type="button" class="v117-back" data-v117-home>← Back to homepage</button><section class="v117-hero"><div><div class="v117-kicker">SCHOLARK CREDIT STORE</div><h1>More credits when you need them.</h1><p>Top up without changing your subscription. SCHOLARK uses your monthly credits first. Purchased credits are kept separately and stay available until you use them.</p></div><aside class="v117-wallet"><small>'+esc(w.plan)+' PLAN · CREDIT WALLET</small><b class="v117-total">'+(signedIn?w.total.toLocaleString():'—')+'</b><div class="v117-split"><div><span>MONTHLY</span><b>'+(signedIn?w.monthly.toLocaleString():'—')+'</b></div><div><span>EXTRA</span><b>'+(signedIn?w.topup.toLocaleString():'—')+'</b></div></div></aside></section><section class="v117-packs">'+entries.map(([key,p])=>{const meta=PACK_COPY[key]||{eyebrow:'TOP-UP',note:'One-time SCHOLARK credit top-up.'},featured=key==='power',badge=key==='ultra'?'BEST RATE':featured?'BALANCED':'';return '<article class="v117-pack '+(featured?'featured':'')+'">'+(badge?'<span class="v117-badge">'+badge+'</span>':'')+'<small>'+esc(meta.eyebrow)+'</small><h2>'+Number(p.credits||0).toLocaleString()+'</h2><div class="credits">SCHOLARK credits</div><p>'+esc(meta.note)+'</p><div class="v117-price">$'+Number(p.price||0).toFixed(2)+' <span>USD · ONE TIME</span></div><button type="button" class="v117-buy" data-v117-pack="'+esc(key)+'" '+(busyPack?'disabled':'')+'>'+(busyPack===key?'Opening secure checkout…':'Buy '+Number(p.credits||0).toLocaleString()+' credits')+'</button></article>'}).join('')+'</section><section class="v117-fine"><div class="v117-note">Your subscription stays unchanged. Extra credits do not disappear at the end of your monthly billing cycle. Subscription plans remain the better recurring value.</div><div class="v117-status '+(statusError?'error':'')+(statusMessage.startsWith('✓')?' success':'')+'" role="status">'+esc(statusMessage||(cfg.environment==='sandbox'?'TEST MODE · Paddle sandbox is active. No real charge will be made.':'Secure one-time checkout is handled by Paddle.'))+'</div></section></div>';
    window.__SCHOLARK_I18N__?.apply?.(page);setTimeout(()=>window.__SCHOLARK_I18N__?.translateMissing?.(),50);
  }

  function syncRoute(){
    ensureButton();ensurePage();
    const store=isStore(),entering=store&&!routeActive;
    routeActive=store;
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
    if(d.state==='completed'){busyPack='';statusError=false;statusMessage='✓ '+Number(d.creditsAdded||0).toLocaleString()+' credits added to your account.';setTimeout(render,80)}
    else if(d.state==='error'){busyPack='';statusError=true;statusMessage=String(d.message||'Checkout failed. Please try again.');render()}
    else if(d.state==='closed'){busyPack='';statusError=false;statusMessage='';render()}
    else if(d.message){statusMessage=String(d.message);statusError=false;render()}
  });
  if(document.body)syncRoute();else addEventListener('DOMContentLoaded',syncRoute,{once:true});
  [120,480].forEach(ms=>setTimeout(syncRoute,ms));
  window.__SCHOLARK_CREDIT_STORE__={open:routeStore,close:routeHome,render,sync:syncRoute,isOpen:isStore,release:'r205'};
})();