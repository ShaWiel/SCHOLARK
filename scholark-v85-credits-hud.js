(() => {
  if(window.__SCHOLARK_V85_CREDITS_HUD__)return;
  window.__SCHOLARK_V85_CREDITS_HUD__=true;
  const $=(s,r=document)=>r.querySelector(s),clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let wallet=null,busy=false,costs=null,lastToken='';

  const css=document.createElement('style');css.id='scholark-v85-style';css.textContent=`
    .v85-wallet{width:calc(100% - 16px);height:42px;margin:9px 8px 0;padding:0 10px;border-radius:12px;background:rgba(201,255,106,.08);border:1px solid rgba(201,255,106,.28);color:#fff;cursor:pointer;display:flex;align-items:center;gap:8px;text-align:left;font-family:Inter,system-ui;transition:.18s ease}.v85-wallet:hover,.v85-wallet[aria-expanded="true"]{background:rgba(201,255,106,.14);border-color:rgba(201,255,106,.46)}.v85-wallet .v85-wallet-symbol{width:22px;height:22px;border-radius:8px;display:grid;place-items:center;background:#c9ff6a;color:#17191f;font:950 11px/1 Inter;flex:0 0 22px}.v85-wallet b{margin:0;font:950 9.5px/1 Inter;color:#fff}
    .v85-topbar-credit{height:38px;display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(201,255,106,.28);border-radius:12px;padding:0 12px;background:rgba(201,255,106,.08);color:#fff;cursor:pointer;font-family:Inter,system-ui;white-space:nowrap}.v85-topbar-credit:hover,.v85-topbar-credit[aria-expanded="true"]{background:rgba(201,255,106,.14);border-color:rgba(201,255,106,.46)}.v85-topbar-credit .v85-wallet-symbol{width:22px;height:22px;border-radius:8px;display:grid;place-items:center;background:#c9ff6a;color:#17191f;font:950 11px/1 Inter}.v85-topbar-credit b{font:950 10px/1 Inter}.v85-topbar-credit[hidden]{display:none!important}
    .v85-topbar-wallet-panel{position:fixed;z-index:2147483650;width:min(300px,calc(100vw - 24px));padding:12px;border-radius:16px;background:#151821;color:#fff;border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 70px rgba(0,0,0,.3);display:none;font-family:Inter,system-ui}.v85-topbar-wallet-panel.open{display:block}.v85-topbar-wallet-panel .v85-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:2px 2px 10px}.v85-topbar-wallet-panel .v85-panel-head small{font:900 6.8px Inter;letter-spacing:.13em;color:#918c9a}.v85-topbar-wallet-panel .v85-panel-head strong{display:block;margin-top:4px;font:950 20px/1 Inter;color:#fff}.v85-topbar-wallet-panel .v85-panel-plan{padding:6px 8px;border-radius:999px;background:rgba(201,255,106,.1);color:#c9ff6a;font:900 6.5px Inter;letter-spacing:.08em}.v85-topbar-wallet-panel .v85-panel-grid{display:grid;grid-template-columns:1fr;gap:7px}.v85-topbar-wallet-panel .v85-panel-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px;border-radius:11px;background:rgba(255,255,255,.05)}.v85-topbar-wallet-panel .v85-panel-row span{font:750 7.5px Inter;color:#b9b4c0}.v85-topbar-wallet-panel .v85-panel-row b{font:950 10px Inter;color:#fff}.v85-topbar-wallet-panel .v85-panel-row.monthly b{color:#cfc7ff}.v85-topbar-wallet-panel .v85-panel-row.extra b{color:#c9ff6a}.v85-topbar-wallet-panel .v85-panel-note{display:block;margin:9px 2px 0;font:650 6.8px/1.45 Inter;color:#918c9a}.v85-topbar-wallet-panel .v85-panel-store{width:100%;margin-top:10px;border:0;border-radius:10px;background:#c9ff6a;color:#17191f;padding:9px 10px;font:900 7.5px Inter;cursor:pointer}
    .v85-dash{display:flex;gap:18px;align-items:center;justify-content:space-between;margin:0 0 18px;padding:14px 16px;background:#17191f;color:#fff;border-radius:16px;min-height:58px}.v85-dash>div{min-width:0;display:flex;flex-direction:column;gap:5px}.v85-dash b{display:block;font:950 12px/1.1 Inter}.v85-dash span{display:block;font:700 8px/1.45 Inter;color:#bdb8c5;max-width:760px}.v85-dash i{flex:0 0 auto;margin-left:auto;font:950 16px/1 Inter;color:#c9ff6a;font-style:normal;white-space:nowrap}
    @media(max-width:720px){.v85-dash{align-items:flex-start;flex-direction:column}.v85-dash i{margin-left:0}.v85-topbar-credit{padding:0 9px;gap:6px}.v85-wallet{width:42px;padding:0;justify-content:center;margin-left:auto;margin-right:auto}.v85-wallet b{display:none}.v85-topbar-wallet-panel{width:min(286px,calc(100vw - 20px))}}
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
  function creditStore(){if(window.__SCHOLARK_CREDIT_STORE__?.open)window.__SCHOLARK_CREDIT_STORE__.open();else location.hash='credit-store'}
  const signed=()=>!!currentSession()?.access_token;
  function walletParts(){
    if(!wallet)return{total:0,monthly:0,extra:0,allowance:0};
    const total=Math.max(0,Number(wallet.balance)||0),allowance=Math.max(0,Number(wallet.monthly_allowance)||0);
    const hasMonthly=wallet.monthly_balance!=null,hasExtra=wallet.topup_balance!=null;
    const monthly=hasMonthly?Math.max(0,Number(wallet.monthly_balance)||0):Math.min(total,allowance||total);
    const extra=hasExtra?Math.max(0,Number(wallet.topup_balance)||0):Math.max(0,total-monthly);
    return{total:Math.max(total,monthly+extra),monthly,extra,allowance};
  }
  let topbarWalletPanel=null,walletPanelAnchor=null,walletPanelSurface='';
  function walletTriggers(){return [...document.querySelectorAll('.v85-topbar-credit,.v85-wallet')]}
  function closeTopbarWallet(){
    walletTriggers().forEach(el=>el.setAttribute('aria-expanded','false'));
    walletPanelAnchor=null;walletPanelSurface='';
    if(topbarWalletPanel){topbarWalletPanel.classList.remove('open');topbarWalletPanel.setAttribute('aria-hidden','true')}
  }
  function replacementWalletAnchor(){
    if(walletPanelSurface==='workspace')return document.querySelector('#v51-sidebar .v85-wallet');
    if(walletPanelSurface==='topbar')return document.querySelector('#v55-topbar .v85-topbar-credit');
    return null;
  }
  function preserveWalletAnchor(){
    if(!topbarWalletPanel?.classList.contains('open'))return false;
    if(walletPanelAnchor?.isConnected)return true;
    const next=replacementWalletAnchor();
    if(!next)return false;
    walletPanelAnchor=next;bindWalletTrigger(next);next.setAttribute('aria-expanded','true');positionTopbarWallet(next);
    return true;
  }
  function positionTopbarWallet(trigger){
    if(!topbarWalletPanel||!trigger?.isConnected)return;
    const r=trigger.getBoundingClientRect(),gap=8,width=Math.min(300,Math.max(240,innerWidth-24)),sidebar=!!trigger.closest('#v51-sidebar');
    topbarWalletPanel.style.width=width+'px';
    let left;
    if(sidebar&&r.right+gap+width<=innerWidth-12)left=r.right+gap;
    else left=Math.max(12,Math.min(innerWidth-width-12,r.right-width));
    topbarWalletPanel.style.left=left+'px';
    topbarWalletPanel.style.top='12px';
    const height=Math.max(0,topbarWalletPanel.offsetHeight||0),maxTop=Math.max(12,innerHeight-height-12);
    const desired=sidebar?r.top:r.bottom+gap;
    topbarWalletPanel.style.top=Math.max(12,Math.min(maxTop,desired))+'px';
  }
  function walletPanelHtml(){
    const plan=clean(wallet?.plan||window.__SCHOLARK_BILLING__?.plan?.()||'free').toUpperCase();
    if(window.__SCHOLARK_TEST_MODE__)return '<div class="v85-panel-head"><div><small>SCHOLARK WALLET</small><strong>∞</strong></div><span class="v85-panel-plan">TEST</span></div><span class="v85-panel-note">Testing mode is active. Credits are not deducted.</span>';
    if(!signed())return '<div class="v85-panel-head"><div><small>SCHOLARK WALLET</small><strong>Sign in</strong></div><span class="v85-panel-plan">FREE</span></div><span class="v85-panel-note">Sign in to see your total, monthly and extra credits.</span>';
    if(!wallet)return '<div class="v85-panel-head"><div><small>SCHOLARK WALLET</small><strong>Loading…</strong></div><span class="v85-panel-plan">'+plan+'</span></div><span class="v85-panel-note">Syncing your credit wallet.</span>';
    const parts=walletParts();
    return '<div class="v85-panel-head"><div><small>SCHOLARK WALLET</small><strong>'+parts.total.toLocaleString()+' total</strong></div><span class="v85-panel-plan">'+plan+'</span></div><div class="v85-panel-grid"><div class="v85-panel-row monthly" data-v85-topbar-kind="monthly"><span>Monthly credits left</span><b>'+parts.monthly.toLocaleString()+(parts.allowance?' / '+parts.allowance.toLocaleString():'')+'</b></div><div class="v85-panel-row extra" data-v85-topbar-kind="extra"><span>Extra credits left</span><b>'+parts.extra.toLocaleString()+'</b></div><div class="v85-panel-row" data-v85-topbar-kind="total"><span>Total available</span><b>'+parts.total.toLocaleString()+'</b></div></div><span class="v85-panel-note">Monthly credits refresh with your plan cycle and are used first. Extra credits carry over until used.</span><button type="button" class="v85-panel-store">Open Credit Store</button>';
  }
  function ensureTopbarWalletPanel(){
    if(topbarWalletPanel?.isConnected)return topbarWalletPanel;
    document.querySelectorAll('.v85-topbar-wallet-panel').forEach(el=>el.remove());
    topbarWalletPanel=document.createElement('div');
    topbarWalletPanel.className='v85-topbar-wallet-panel';
    topbarWalletPanel.setAttribute('role','dialog');
    topbarWalletPanel.setAttribute('aria-label','SCHOLARK Wallet');
    topbarWalletPanel.setAttribute('aria-hidden','true');
    document.body.appendChild(topbarWalletPanel);
    topbarWalletPanel.addEventListener('click',e=>{const store=e.target.closest('.v85-panel-store');if(store){e.stopPropagation();closeTopbarWallet();creditStore()}});
    return topbarWalletPanel;
  }
  function bindWalletTrigger(trigger){
    if(!trigger)return;
    trigger.title='Open SCHOLARK Wallet';
    trigger.setAttribute('aria-label','Wallet · show total, monthly and extra SCHOLARK credits');
    if(!trigger.hasAttribute('aria-expanded'))trigger.setAttribute('aria-expanded','false');
  }
  function toggleWallet(trigger){
    if(!trigger?.isConnected)return;
    const panel=ensureTopbarWalletPanel(),same=panel.classList.contains('open')&&walletPanelAnchor===trigger;
    document.querySelector('.v55-account-wrap.open')?.classList.remove('open');
    document.querySelector('.v116-public-actions.open')?.classList.remove('open');
    closeTopbarWallet();
    if(same)return;
    panel.innerHTML=walletPanelHtml();
    panel.classList.add('open');
    panel.setAttribute('aria-hidden','false');
    walletPanelAnchor=trigger;
    walletPanelSurface=trigger.closest('#v51-sidebar')?'workspace':'topbar';
    trigger.setAttribute('aria-expanded','true');
    positionTopbarWallet(trigger);
  }
  function renderTopbar(){
    const actions=$('#v55-topbar .v55-actions');
    if(!actions)return;
    const chips=[...actions.querySelectorAll('.v85-topbar-credit')];chips.slice(1).forEach(el=>el.remove());
    let chip=chips[0]||null;
    if(!chip){
      chip=document.createElement('button');chip.type='button';chip.className='v85-topbar-credit';chip.dataset.schI18nOwned='1';
      const account=$('.v55-account-wrap',actions)||$('#v55-auth',actions);if(account)actions.insertBefore(chip,account);else actions.appendChild(chip);
    }
    chip.hidden=false;
    if(chip.dataset.v85WalletReady!=='1'){
      chip.innerHTML='<span class="v85-wallet-symbol" aria-hidden="true">$</span><b>Wallet</b>';
      chip.dataset.v85WalletReady='1';
    }
    bindWalletTrigger(chip);
    if(topbarWalletPanel?.classList.contains('open')&&walletPanelAnchor===chip){topbarWalletPanel.innerHTML=walletPanelHtml();positionTopbarWallet(chip)}
  }
  function renderWorkspaceWallet(){
    const side=$('#v51-sidebar');if(!side)return;
    let boxes=[...side.querySelectorAll('.v85-wallet')];boxes.slice(1).forEach(el=>el.remove());
    let box=boxes[0]||null;
    if(box&&box.tagName!=='BUTTON'){
      const next=document.createElement('button');box.replaceWith(next);box=next;
    }
    if(!box){
      box=document.createElement('button');
      const anchor=$('#v51-sidebar-actions',side)||$('.v51-quality',side)||$('.v90-langbox',side)||side.lastElementChild;
      if(anchor)anchor.insertAdjacentElement('beforebegin',box);else side.appendChild(box);
    }
    box.type='button';box.className='v85-wallet';box.dataset.schI18nOwned='1';
    if(box.dataset.v85WalletReady!=='1'){
      box.innerHTML='<span class="v85-wallet-symbol" aria-hidden="true">$</span><b>Wallet</b>';
      box.dataset.v85WalletReady='1';
    }
    bindWalletTrigger(box);
    if(topbarWalletPanel?.classList.contains('open')&&walletPanelAnchor===box){topbarWalletPanel.innerHTML=walletPanelHtml();positionTopbarWallet(box)}
  }

  function render(){
    renderTopbar();
    renderWorkspaceWallet();
    if(walletPanelAnchor&&!walletPanelAnchor.isConnected&&!preserveWalletAnchor())closeTopbarWallet();
    const dash=$('#v51-main [data-v51-page="dashboard"] .v51-shell');if(dash){
      let el=$('.v85-dash',dash);if(!el){el=document.createElement('div');el.className='v85-dash';$('.v51-head',dash)?.insertAdjacentElement('beforebegin',el)}
      if(el){const on=signed(),bal=wallet?Math.max(0,Number(wallet.balance)||0):null;el.innerHTML=window.__SCHOLARK_TEST_MODE__?'<div><b>Testing foundation</b><span>Zero-credit test mode is active.</span></div><i>FREE TESTING</i>':'<div><b>Usage foundation</b><span>'+(on?(wallet?'Cloud wallet active · fair-use limits stay tied to your account.':'Signed in · wallet activation pending.'):'Sign in to keep usage, chats, projects and learning data attached to you.')+'</span></div><i>'+(bal==null?'—':bal.toLocaleString()+' credits')+'</i>'}
    }
  }
  function sync(){render();if(cloud())loadCosts();load()}
  function checkSession(){const token=currentSession()?.access_token||'';if(token!==lastToken){lastToken=token;load()}}

  addEventListener('hashchange',()=>{closeTopbarWallet();setTimeout(render,80);setTimeout(load,220)});
  addEventListener('pageshow',()=>setTimeout(load,80));
  addEventListener('focus',()=>setTimeout(load,80));
  addEventListener('scholark-runtime-ready',()=>setTimeout(sync,60));
  addEventListener('scholark:auth-changed',()=>setTimeout(load,40));
  addEventListener('scholark:credits-changed',()=>setTimeout(load,40));
  addEventListener('scholark:billing-changed',()=>setTimeout(load,40));
  addEventListener('scholark-language-ready',()=>setTimeout(render,80));
  addEventListener('resize',()=>{if(topbarWalletPanel?.classList.contains('open')&&walletPanelAnchor?.isConnected)positionTopbarWallet(walletPanelAnchor)},{passive:true});
  document.addEventListener('click',e=>{
    const trigger=e.target.closest?.('.v85-topbar-credit,.v85-wallet');
    if(trigger){
      e.preventDefault();
      e.stopPropagation();
      toggleWallet(trigger);
      return;
    }
    if(!e.target.closest?.('.v85-topbar-wallet-panel'))closeTopbarWallet();
  },true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeTopbarWallet()});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkSession();else closeTopbarWallet()});
  setInterval(()=>{if(!document.hidden)checkSession()},10000);
  setTimeout(sync,500);

  window.__SCHOLARK_CREDITS__={load,render,wallet:()=>wallet,balance:()=>wallet?.balance??null,consume,authorize,quote,cost,release:'r215-wallet-everywhere'};
})();