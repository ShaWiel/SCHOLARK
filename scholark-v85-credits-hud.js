(() => {
  if(window.__SCHOLARK_V85_CREDITS_HUD__)return;
  window.__SCHOLARK_V85_CREDITS_HUD__=true;
  const $=(s,r=document)=>r.querySelector(s),clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let wallet=null,busy=false,costs=null,lastToken='',storeModal=null;

  const css=document.createElement('style');css.id='scholark-v85-style';css.textContent=`
    .v85-wallet{margin:9px 8px 0;padding:11px;border-radius:14px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);color:#fff}.v85-wallet small{display:block;font:900 6.8px Inter;letter-spacing:.13em;color:#8f8b98}.v85-wallet b{display:block;margin-top:5px;font:950 18px/1 Inter}.v85-wallet span{display:block;margin-top:4px;font:650 7px/1.35 Inter;color:#aaa6b2}.v85-wallet button{margin-top:7px;border:0;border-radius:9px;background:#c9ff6a;color:#17191f;padding:7px 9px;font:900 7px Inter;cursor:pointer}.v85-low{color:#ffcf72!important}.v85-meter{height:4px;margin-top:8px;border-radius:99px;background:rgba(255,255,255,.09);overflow:hidden}.v85-meter i{display:block;height:100%;border-radius:inherit;background:#c9ff6a}
    .v85-topbar-credit,.v85-store-btn{height:38px;display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(201,255,106,.28);border-radius:12px;padding:0 10px;background:rgba(201,255,106,.08);color:#fff;cursor:pointer;font-family:Inter,system-ui;white-space:nowrap}.v85-topbar-credit:hover,.v85-store-btn:hover{background:rgba(201,255,106,.14)}.v85-store-btn{background:#c9ff6a;color:#17191f;border-color:#c9ff6a;font:900 8px Inter}.v85-store-btn span:first-child{font-size:12px}.v85-topbar-credit .v85-star{color:#c9ff6a;font-size:12px}.v85-topbar-credit b{font:950 10px/1 Inter}.v85-topbar-credit em{font:900 6.5px/1 Inter;letter-spacing:.09em;font-style:normal;color:#c9ff6a}.v85-topbar-credit[hidden]{display:none!important}
    #v85-store{position:fixed;inset:0;z-index:2147483646;background:rgba(8,13,21,.76);backdrop-filter:blur(12px);display:none;place-items:center;padding:22px;font-family:Inter,system-ui}#v85-store.open{display:grid}.v85-store-card{width:min(980px,96vw);max-height:90vh;overflow:auto;background:#f8f8fb;border-radius:28px;padding:24px;box-shadow:0 34px 110px rgba(0,0,0,.34);color:#17191f}.v85-store-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.v85-store-head small{display:block;font:950 7px Inter;letter-spacing:.14em;color:#6758d8}.v85-store-head h2{margin:6px 0 7px;font:950 clamp(28px,4vw,44px)/.95 Inter;letter-spacing:-.045em}.v85-store-head p{margin:0;max-width:720px;font:650 10px/1.55 Inter;color:#6f6975}.v85-store-x{border:0;border-radius:12px;width:38px;height:38px;background:#eceaf1;font:950 16px Inter;cursor:pointer}.v85-store-balance{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:18px 0}.v85-store-stat{background:#17191f;color:#fff;border-radius:16px;padding:14px}.v85-store-stat small{display:block;font:850 7px Inter;letter-spacing:.1em;color:#aaa4b4}.v85-store-stat b{display:block;margin-top:5px;font:950 20px Inter}.v85-store-packs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.v85-pack{position:relative;background:#fff;border:1px solid #e7e4ec;border-radius:20px;padding:18px;min-height:210px;display:flex;flex-direction:column}.v85-pack.featured{border-color:#b8df6c;box-shadow:0 14px 38px rgba(96,122,45,.11)}.v85-pack-tag{position:absolute;right:12px;top:12px;border-radius:999px;padding:5px 7px;background:#17191f;color:#c9ff6a;font:900 6px Inter;letter-spacing:.08em}.v85-pack small{font:900 7px Inter;color:#6e61d8;letter-spacing:.11em}.v85-pack h3{margin:10px 0 3px;font:950 28px/1 Inter}.v85-pack p{margin:0;color:#77717c;font:650 9px/1.45 Inter}.v85-pack .v85-price{margin-top:auto;padding-top:18px;font:950 24px Inter}.v85-pack .v85-price span{font:700 9px Inter;color:#817a87}.v85-pack button{margin-top:10px;border:0;border-radius:12px;padding:11px;background:#17191f;color:#fff;font:900 9px Inter;cursor:pointer}.v85-pack.featured button{background:#c9ff6a;color:#17191f}.v85-store-note{margin-top:13px;padding:12px 14px;border-radius:13px;background:#eeecff;color:#5149a7;font:750 8.5px/1.45 Inter}.v85-store-status{min-height:18px;margin-top:10px;font:800 8.5px/1.4 Inter;color:#5d51c4}.v85-store-status.error{color:#9b3c35}.v85-pack button:disabled{opacity:.55;cursor:progress}
    .v85-dash{display:flex;gap:18px;align-items:center;justify-content:space-between;margin:0 0 18px;padding:14px 16px;background:#17191f;color:#fff;border-radius:16px;min-height:58px}.v85-dash>div{min-width:0;display:flex;flex-direction:column;gap:5px}.v85-dash b{display:block;font:950 12px/1.1 Inter}.v85-dash span{display:block;font:700 8px/1.45 Inter;color:#bdb8c5;max-width:760px}.v85-dash i{flex:0 0 auto;margin-left:auto;font:950 16px/1 Inter;color:#c9ff6a;font-style:normal;white-space:nowrap}
    @media(max-width:720px){.v85-dash{align-items:flex-start;flex-direction:column}.v85-dash i{margin-left:0}.v85-topbar-credit,.v85-store-btn{padding:0 8px;gap:5px}.v85-topbar-credit em,.v85-store-label{display:none}.v85-store-packs{grid-template-columns:1fr}.v85-store-balance{grid-template-columns:1fr 1fr}.v85-store-stat:last-child{grid-column:1/-1}.v85-store-card{padding:18px;border-radius:22px}}
  `;document.head.appendChild(css);

  function currentSession(){
    try{
      const live=cloud()?.currentSession?.();if(live?.access_token)return live;
      const local=JSON.parse(localStorage.getItem('scholark_supabase_session_v2')||'null');
      return local?.access_token?local:null;
    }catch{return null}
  }
  async function ctx(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  async function load(){
    if(busy)return;busy=true;
    try{
      const s=currentSession();lastToken=s?.access_token||'';
      if(!s?.access_token){wallet=null;render();return}
      let resolved=null;
      try{
        const r=await fetch('/api/billing/status',{cache:'no-store',headers:{authorization:'Bearer '+s.access_token}});
        const d=await r.json().catch(()=>({}));
        if(r.ok&&d?.ok)resolved=d.wallet||null;
      }catch{}
      if(!resolved){
        const x=await ctx();
        if(x){
          const r=await x.c.request('/rest/v1/credit_wallets?select=balance,monthly_balance,topup_balance,plan,monthly_allowance,cycle_started_at,updated_at&user_id=eq.'+encodeURIComponent(x.uid)+'&limit=1',{method:'GET'});
          const d=await r.json().catch(()=>[]);if(r.ok)resolved=Array.isArray(d)?d[0]:d;
        }
      }
      wallet=resolved;render();
    }catch{wallet=null;render()}finally{busy=false}
  }
  async function loadCosts(){
    if(costs)return costs;
    try{
      const r=await cloud()?.publicRequest?.('/rest/v1/ai_feature_costs?select=feature,credits,category,description&active=is.true&order=credits.asc',{method:'GET'});
      const d=await r?.json?.().catch(()=>[]);if(r?.ok&&Array.isArray(d))costs=Object.fromEntries(d.map(x=>[x.feature,{credits:Number(x.credits)||0,category:x.category||'ai',description:x.description||''}]));
    }catch{}
    return costs||{};
  }
  async function cost(feature){const m=await loadCosts();return Number(m?.[feature]?.credits)||0}
  async function consume(feature,meta={}){
    if(window.__SCHOLARK_TEST_MODE__)return{ok:true,testMode:true,spent:0,balance:wallet?.balance??null};
    const x=await ctx();if(!x)return{ok:true,guest:true,spent:0,balance:null};
    const requestId=(globalThis.crypto?.randomUUID?.()||('sch-credit-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12))).replace(/[^a-zA-Z0-9._:-]/g,'');
    const safeMeta={...(meta||{}),client_request_id:requestId};
    const r=await x.c.request('/rest/v1/rpc/consume_feature_credits_once',{method:'POST',body:JSON.stringify({p_feature:feature,p_request_id:requestId,p_meta:safeMeta})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok){const e=new Error(d?.message||'Could not verify SCHOLARK credits');e.code='CREDIT_CHECK_FAILED';throw e}
    if(d?.ok===false){const e=new Error('Not enough SCHOLARK credits for this action.');e.code=d.code||'INSUFFICIENT_CREDITS';e.balance=d.balance;e.needed=d.needed;throw e}
    await load();window.dispatchEvent(new CustomEvent('scholark:credits-changed',{detail:{...d,requestId}}));return {...d,requestId};
  }
  async function quote(feature){return{feature,credits:await cost(feature),wallet}}
  async function authorize(feature){
    if(window.__SCHOLARK_TEST_MODE__)return{ok:true,testMode:true,cost:0,balance:wallet?.balance??null};
    const x=await ctx();if(!x)return{ok:true,guest:true,cost:await cost(feature)};
    await load();const needed=await cost(feature),balance=Math.max(0,Number(wallet?.balance)||0);
    if(needed>0&&balance<needed){const e=new Error('Not enough SCHOLARK credits for this action.');e.code='INSUFFICIENT_CREDITS';e.balance=balance;e.needed=needed;throw e}
    return{ok:true,cost:needed,balance};
  }

  function pricing(){const old=location.href;history.replaceState(null,'',location.pathname+location.search+'#pricing');dispatchEvent(new HashChangeEvent('hashchange',{oldURL:old,newURL:location.href}))}
  const signed=()=>!!currentSession()?.access_token;
  function walletParts(){
    const allowance=Math.max(0,Number(wallet?.monthly_allowance)||0),total=Math.max(0,Number(wallet?.balance)||0);
    const monthly=wallet?.monthly_balance==null?Math.min(total,allowance):Math.max(0,Number(wallet.monthly_balance)||0);
    const topup=wallet?.topup_balance==null?Math.max(0,total-monthly):Math.max(0,Number(wallet.topup_balance)||0);
    return{allowance,total,monthly,topup};
  }
  function closeStore(){storeModal?.classList.remove('open')}
  async function openStore(){
    if(!storeModal){
      storeModal=document.createElement('div');
      storeModal.id='v85-store';
      storeModal.setAttribute('role','dialog');
      storeModal.setAttribute('aria-modal','true');
      document.body.appendChild(storeModal);
      storeModal.addEventListener('click',e=>{
        if(e.target===storeModal||e.target.closest?.('.v85-store-x'))closeStore();
        const b=e.target.closest?.('[data-v85-pack]');
        if(!b)return;
        const pack=b.dataset.v85Pack;
        b.disabled=true;
        const st=$('.v85-store-status',storeModal);
        if(st){st.textContent='Preparing secure checkout…';st.classList.remove('error')}
        Promise.resolve(window.__SCHOLARK_BILLING__?.buyCredits?.(pack)).catch(err=>{
          b.disabled=false;
          if(st){st.textContent=String(err?.message||err);st.classList.add('error')}
        });
      });
    }
    let cfg={};
    try{cfg=await window.__SCHOLARK_BILLING__?.config?.()||{}}catch{}
    const packs=cfg.creditPacks||{
      boost:{credits:250,price:4.99,label:'Boost'},
      power:{credits:750,price:11.99,label:'Power'},
      max:{credits:2000,price:24.99,label:'Max'}
    },w=walletParts(),entries=Object.entries(packs);
    storeModal.innerHTML='<div class="v85-store-card"><div class="v85-store-head"><div><small>SCHOLARK CREDIT STORE</small><h2>Keep creating. Top up anytime.</h2><p>Used your monthly credits early? Buy extra credits without changing your plan. Monthly credits are used first; purchased credits stay on your account until you use them.</p></div><button class="v85-store-x" aria-label="Close">×</button></div><div class="v85-store-balance"><div class="v85-store-stat"><small>TOTAL AVAILABLE</small><b>'+(signed()?w.total.toLocaleString():'—')+'</b></div><div class="v85-store-stat"><small>MONTHLY CREDITS</small><b>'+(signed()?w.monthly.toLocaleString():'—')+'</b></div><div class="v85-store-stat"><small>EXTRA CREDITS</small><b>'+(signed()?w.topup.toLocaleString():'—')+'</b></div></div><div class="v85-store-packs">'+entries.map(([key,p])=>'<article class="v85-pack '+(key==='power'?'featured':'')+'">'+(key==='power'?'<span class="v85-pack-tag">POPULAR</span>':key==='max'?'<span class="v85-pack-tag">BEST VALUE</span>':'')+'<small>'+clean(p.label||key).toUpperCase()+'</small><h3>'+Number(p.credits||0).toLocaleString()+'</h3><p>SCHOLARK credits · one-time top-up</p><div class="v85-price">$'+Number(p.price||0).toFixed(2)+' <span>USD</span></div><button type="button" data-v85-pack="'+key+'">Buy '+Number(p.credits||0).toLocaleString()+' credits</button></article>').join('')+'</div><div class="v85-store-note">One-time purchase. Your subscription stays unchanged. Purchased credits are separate from the monthly refill and do not disappear at the end of your billing month.</div><div class="v85-store-status" role="status">'+(cfg.environment==='sandbox'?'TEST MODE · Paddle sandbox checkout. No real charge will be made.':'')+'</div></div>';
    storeModal.classList.add('open');
    window.__SCHOLARK_I18N__?.apply?.(storeModal);
    setTimeout(()=>window.__SCHOLARK_I18N__?.translateMissing?.(),50);
  }
  function renderTopbar(){
    const actions=$('#v55-topbar .v55-actions');if(!actions)return;
    let store=$('#v85-credit-store-button',actions);
    if(!store){
      store=document.createElement('button');store.id='v85-credit-store-button';store.type='button';store.className='v85-store-btn';
      store.innerHTML='<span aria-hidden="true">✦</span><span class="v85-store-label">Credit Store</span>';
      store.title='Buy extra SCHOLARK credits';store.onclick=openStore;
      const account=$('.v55-account-wrap',actions)||$('#v55-auth',actions);
      if(account)actions.insertBefore(store,account);else actions.appendChild(store);
    }
    let chip=$('.v85-topbar-credit',actions);
    if(!chip){
      chip=document.createElement('button');chip.type='button';chip.className='v85-topbar-credit';chip.dataset.schI18nOwned='1';chip.onclick=openStore;
      const account=$('.v55-account-wrap',actions)||$('#v55-auth',actions);if(account)actions.insertBefore(chip,account);else actions.appendChild(chip);
    }
    const on=signed();
    chip.hidden=false;
    if(!on&&!window.__SCHOLARK_TEST_MODE__){chip.innerHTML='<span class="v85-star" aria-hidden="true">✦</span><b>—</b><em>FREE</em>';chip.title='Sign in to see your SCHOLARK credit balance';chip.setAttribute('aria-label',chip.title);return}
    if(window.__SCHOLARK_TEST_MODE__){chip.innerHTML='<span class="v85-star">✦</span><b>∞</b><em>TEST</em>';chip.title='SCHOLARK test credits';return}
    const bal=wallet?Math.max(0,Number(wallet.balance)||0):null,plan=clean(wallet?.plan||window.__SCHOLARK_BILLING__?.plan?.()||'free').toUpperCase();
    chip.innerHTML='<span class="v85-star" aria-hidden="true">✦</span><b>'+(bal==null?'…':bal.toLocaleString())+'</b><em>'+plan+'</em>';
    chip.title=(bal==null?'Loading':bal.toLocaleString())+' SCHOLARK credits · '+plan;
    chip.setAttribute('aria-label',chip.title);
  }
  function render(){
    renderTopbar();
    const side=$('#v51-sidebar');if(side){
      let box=$('.v85-wallet',side);
      if(!box){
        box=document.createElement('div');box.className='v85-wallet';
        const anchor=$('.v51-quality',side)||$('.v90-langbox',side)||side.lastElementChild;
        if(anchor)anchor.insertAdjacentElement('beforebegin',box);else side.appendChild(box);
      }
      if(box){
        if(window.__SCHOLARK_TEST_MODE__)box.innerHTML='<small>SCHOLARK TEST MODE</small><b>∞</b><span>AI credits are not deducted while product test mode is active.</span>';
        else if(!signed())box.innerHTML='<small>SCHOLARK CREDITS</small><b>—</b><span>Sign in to see and sync your credit balance.</span>';
        else if(wallet){
          const p=walletParts(),bal=p.total,allowance=p.allowance,low=bal<10,pct=allowance?Math.max(0,Math.min(100,p.monthly/allowance*100)):0,plan=clean(wallet.plan||'free').toUpperCase();
          box.innerHTML='<small>SCHOLARK CREDITS · '+plan+'</small><b class="'+(low?'v85-low':'')+'">'+bal.toLocaleString()+'</b><span>'+p.monthly.toLocaleString()+' monthly · '+p.topup.toLocaleString()+' extra</span>'+(allowance?'<div class="v85-meter" aria-hidden="true"><i style="width:'+pct.toFixed(1)+'%"></i></div>':'')+'<button type="button">Credit Store</button>';
          box.querySelector('button').onclick=openStore;
        }else{box.innerHTML='<small>SCHOLARK CREDITS</small><b>…</b><span>Loading your credit balance.</span><button type="button">Credit Store</button>';box.querySelector('button').onclick=openStore}
      }
    }
    const dash=$('#v51-main [data-v51-page="dashboard"] .v51-shell');if(dash){
      let el=$('.v85-dash',dash);if(!el){el=document.createElement('div');el.className='v85-dash';$('.v51-head',dash)?.insertAdjacentElement('beforebegin',el)}
      if(el){const on=signed(),bal=wallet?Math.max(0,Number(wallet.balance)||0):null;el.innerHTML=window.__SCHOLARK_TEST_MODE__?'<div><b>Testing foundation</b><span>Zero-credit test mode is active.</span></div><i>FREE TESTING</i>':'<div><b>Usage foundation</b><span>'+(on?(wallet?'Cloud wallet active · fair-use limits stay tied to your account.':'Signed in · wallet activation pending.'):'Sign in to keep usage, chats, projects and learning data attached to you.')+'</span></div><i>'+(bal==null?'—':bal.toLocaleString()+' credits')+'</i>'}
    }
  }
  function sync(){render();if(cloud())loadCosts();load()}
  function checkSession(){const token=currentSession()?.access_token||'';if(token!==lastToken){lastToken=token;load()}}

  addEventListener('hashchange',()=>{setTimeout(render,80);setTimeout(load,220)});
  addEventListener('pageshow',()=>setTimeout(load,80));
  addEventListener('focus',()=>setTimeout(load,80));
  addEventListener('scholark-runtime-ready',()=>setTimeout(sync,60));
  addEventListener('scholark:auth-changed',()=>setTimeout(load,40));
  addEventListener('scholark:credits-changed',()=>setTimeout(load,40));
  addEventListener('scholark:billing-changed',()=>setTimeout(load,40));
  addEventListener('scholark:credit-store-status',e=>{
    const d=e.detail||{},st=storeModal&&$('.v85-store-status',storeModal);
    if(st){
      st.classList.toggle('error',d.state==='error');
      st.textContent=d.state==='completed'?'✓ '+Number(d.creditsAdded||0).toLocaleString()+' credits added to your account.':d.message||({preparing:'Preparing secure checkout…',open:'Secure Paddle checkout opened.',processing:'Payment received. Adding your credits…',auth:'Sign in to continue.',closed:''}[d.state]||'');
      storeModal.querySelectorAll('[data-v85-pack]').forEach(b=>b.disabled=['preparing','open','processing'].includes(d.state));
    }
    if(d.state==='completed'){
      load().then(()=>{if(storeModal?.classList.contains('open'))openStore()});
      window.dispatchEvent(new CustomEvent('scholark:credits-changed',{detail:{creditStore:true}}));
    }
  });
  addEventListener('scholark-language-ready',()=>setTimeout(render,80));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkSession()});
  setInterval(()=>{if(!document.hidden)checkSession()},10000);
  setTimeout(sync,500);

  window.__SCHOLARK_CREDITS__={load,render,openStore,wallet:()=>wallet,balance:()=>wallet?.balance??null,monthlyBalance:()=>walletParts().monthly,topupBalance:()=>walletParts().topup,consume,authorize,quote,cost,release:'r205-credit-store'};
})();