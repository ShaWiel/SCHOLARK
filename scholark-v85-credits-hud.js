(() => {
  if(window.__SCHOLARK_V85_CREDITS_HUD__)return;
  window.__SCHOLARK_V85_CREDITS_HUD__=true;
  const $=(s,r=document)=>r.querySelector(s),clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let wallet=null,busy=false,costs=null,lastToken='';

  const css=document.createElement('style');css.id='scholark-v85-style';css.textContent=`
    .v85-wallet{margin:9px 8px 0;padding:11px;border-radius:14px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);color:#fff}.v85-wallet small{display:block;font:900 6.8px Inter;letter-spacing:.13em;color:#8f8b98}.v85-wallet b{display:block;margin-top:5px;font:950 18px/1 Inter}.v85-wallet span{display:block;margin-top:4px;font:650 7px/1.35 Inter;color:#aaa6b2}.v85-wallet button{margin-top:7px;border:0;border-radius:9px;background:#c9ff6a;color:#17191f;padding:7px 9px;font:900 7px Inter;cursor:pointer}.v85-low{color:#ffcf72!important}.v85-meter{height:4px;margin-top:8px;border-radius:99px;background:rgba(255,255,255,.09);overflow:hidden}.v85-meter i{display:block;height:100%;border-radius:inherit;background:#c9ff6a}
    .v85-topbar-credit{height:38px;display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(201,255,106,.28);border-radius:12px;padding:0 10px;background:rgba(201,255,106,.08);color:#fff;cursor:pointer;font-family:Inter,system-ui;white-space:nowrap}.v85-topbar-credit:hover{background:rgba(201,255,106,.14)}.v85-topbar-credit .v85-star{color:#c9ff6a;font-size:12px}.v85-topbar-credit b{font:950 10px/1 Inter}.v85-topbar-credit em{font:900 6.5px/1 Inter;letter-spacing:.09em;font-style:normal;color:#c9ff6a}.v85-topbar-credit[hidden]{display:none!important}
    .v85-dash{display:flex;gap:18px;align-items:center;justify-content:space-between;margin:0 0 18px;padding:14px 16px;background:#17191f;color:#fff;border-radius:16px;min-height:58px}.v85-dash>div{min-width:0;display:flex;flex-direction:column;gap:5px}.v85-dash b{display:block;font:950 12px/1.1 Inter}.v85-dash span{display:block;font:700 8px/1.45 Inter;color:#bdb8c5;max-width:760px}.v85-dash i{flex:0 0 auto;margin-left:auto;font:950 16px/1 Inter;color:#c9ff6a;font-style:normal;white-space:nowrap}
    @media(max-width:720px){.v85-dash{align-items:flex-start;flex-direction:column}.v85-dash i{margin-left:0}.v85-topbar-credit{padding:0 8px;gap:5px}.v85-topbar-credit em{display:none}}
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
          const r=await x.c.request('/rest/v1/credit_wallets?select=balance,plan,monthly_allowance,cycle_started_at,updated_at&user_id=eq.'+encodeURIComponent(x.uid)+'&limit=1',{method:'GET'});
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
    const r=await x.c.request('/rest/v1/rpc/consume_feature_credits',{method:'POST',body:JSON.stringify({p_feature:feature,p_meta:meta||{}})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok){const e=new Error(d?.message||'Could not verify SCHOLARK credits');e.code='CREDIT_CHECK_FAILED';throw e}
    if(d?.ok===false){const e=new Error('Not enough SCHOLARK credits for this action.');e.code=d.code||'INSUFFICIENT_CREDITS';e.balance=d.balance;e.needed=d.needed;throw e}
    await load();window.dispatchEvent(new CustomEvent('scholark:credits-changed',{detail:d}));return d;
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
  function renderTopbar(){
    const actions=$('#v55-topbar .v55-actions');if(!actions)return;
    let chip=$('.v85-topbar-credit',actions);
    if(!chip){
      chip=document.createElement('button');chip.type='button';chip.className='v85-topbar-credit';chip.dataset.schI18nOwned='1';chip.onclick=()=>{if(signed())pricing();else window.__SCHOLARK_V72_CLOUD__?.openAuth?.('signin')};
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
          const bal=Math.max(0,Number(wallet.balance)||0),allowance=Math.max(0,Number(wallet.monthly_allowance)||0),low=bal<10,pct=allowance?Math.max(0,Math.min(100,bal/allowance*100)):0,plan=clean(wallet.plan||'free').toUpperCase();
          box.innerHTML='<small>SCHOLARK CREDITS · '+plan+'</small><b class="'+(low?'v85-low':'')+'">'+bal.toLocaleString()+(allowance?' / '+allowance.toLocaleString():'')+'</b><span>'+(low?'Low balance — heavy AI actions may be limited.':'Available credit balance')+'</span>'+(allowance?'<div class="v85-meter" aria-hidden="true"><i style="width:'+pct.toFixed(1)+'%"></i></div>':'')+'<button type="button">Plans & limits</button>';
          box.querySelector('button').onclick=pricing;
        }else{box.innerHTML='<small>SCHOLARK CREDITS</small><b>…</b><span>Loading your credit balance.</span><button type="button">Plans & limits</button>';box.querySelector('button').onclick=pricing}
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
  addEventListener('scholark-language-ready',()=>setTimeout(render,80));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkSession()});
  setInterval(()=>{if(!document.hidden)checkSession()},2000);
  setTimeout(sync,500);

  window.__SCHOLARK_CREDITS__={load,render,wallet:()=>wallet,balance:()=>wallet?.balance??null,consume,authorize,quote,cost,release:'r181'};
})();