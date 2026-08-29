(() => {
  if(window.__SCHOLARK_V85_CREDITS_HUD__)return;
  window.__SCHOLARK_V85_CREDITS_HUD__=true;
  const $=(s,r=document)=>r.querySelector(s),clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let wallet=null,busy=false,costs=null;
  const css=document.createElement('style');css.id='scholark-v85-style';css.textContent=`
    .v85-wallet{margin:9px 8px 0;padding:11px;border-radius:14px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);color:#fff}.v85-wallet small{display:block;font:900 6.8px Inter;letter-spacing:.13em;color:#8f8b98}.v85-wallet b{display:block;margin-top:5px;font:950 18px/1 Inter}.v85-wallet span{display:block;margin-top:4px;font:650 7px/1.35 Inter;color:#aaa6b2}.v85-wallet button{margin-top:7px;border:0;border-radius:9px;background:#c9ff6a;color:#17191f;padding:7px 9px;font:900 7px Inter;cursor:pointer}.v85-low{color:#ffcf72!important}
    .v85-dash{display:flex;gap:18px;align-items:center;justify-content:space-between;margin:0 0 18px;padding:14px 16px;background:#17191f;color:#fff;border-radius:16px;min-height:58px}.v85-dash>div{min-width:0;display:flex;flex-direction:column;gap:5px}.v85-dash b{display:block;font:950 12px/1.1 Inter}.v85-dash span{display:block;font:700 8px/1.45 Inter;color:#bdb8c5;max-width:760px}.v85-dash i{flex:0 0 auto;margin-left:auto;font:950 16px/1 Inter;color:#c9ff6a;font-style:normal;white-space:nowrap}@media(max-width:720px){.v85-dash{align-items:flex-start;flex-direction:column}.v85-dash i{margin-left:0}}
  `;document.head.appendChild(css);
  async function ctx(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  async function load(){
    if(busy)return;busy=true;
    try{
      const x=await ctx();if(!x){wallet=null;render();return}
      const r=await x.c.request('/rest/v1/credit_wallets?select=balance,plan,monthly_allowance,cycle_started_at,updated_at&user_id=eq.'+encodeURIComponent(x.uid)+'&limit=1',{method:'GET'});
      const d=await r.json().catch(()=>[]);wallet=r.ok?(Array.isArray(d)?d[0]:d):null;render();
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
    const x=await ctx();
    if(!x)return{ok:true,guest:true,spent:0,balance:null};
    const r=await x.c.request('/rest/v1/rpc/consume_feature_credits',{method:'POST',body:JSON.stringify({p_feature:feature,p_meta:meta||{}})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok){const e=new Error(d?.message||'Could not verify SCHOLARK credits');e.code='CREDIT_CHECK_FAILED';throw e}
    if(d?.ok===false){const e=new Error('Not enough SCHOLARK credits for this action.');e.code=d.code||'INSUFFICIENT_CREDITS';e.balance=d.balance;e.needed=d.needed;throw e}
    await load();window.dispatchEvent(new CustomEvent('scholark:credits-changed',{detail:d}));return d;
  }
  async function quote(feature){return{feature,credits:await cost(feature),wallet}}
  async function authorize(feature){
    const x=await ctx();if(!x)return{ok:true,guest:true,cost:await cost(feature)};
    await load();const needed=await cost(feature),balance=Math.max(0,Number(wallet?.balance)||0);
    if(needed>0&&balance<needed){const e=new Error('Not enough SCHOLARK credits for this action.');e.code='INSUFFICIENT_CREDITS';e.balance=balance;e.needed=needed;throw e}
    return{ok:true,cost:needed,balance};
  }

  function pricing(){const old=location.href;history.replaceState(null,'',location.pathname+location.search+'#pricing');dispatchEvent(new HashChangeEvent('hashchange',{oldURL:old,newURL:location.href}))}
  function render(){
    const side=$('#v51-sidebar');if(side){
      let box=$('.v85-wallet',side);if(!box){box=document.createElement('div');box.className='v85-wallet';$('.v51-quality',side)?.insertAdjacentElement('beforebegin',box)}
      if(box){
        if(!cloud()?.currentSession?.()?.user?.id)box.innerHTML='<small>SCHOLARK CREDITS</small><b>—</b><span>Sign in to sync usage and plan limits.</span>';
        else if(wallet){const bal=Math.max(0,Number(wallet.balance)||0),low=bal<10;box.innerHTML='<small>SCHOLARK CREDITS · '+clean(wallet.plan||'free').toUpperCase()+'</small><b class="'+(low?'v85-low':'')+'">'+bal.toLocaleString()+'</b><span>'+(low?'Low balance — heavy AI actions may be limited.':'Available AI credits')+'</span><button type="button">Plans & limits</button>';box.querySelector('button').onclick=pricing}
        else box.innerHTML='<small>SCHOLARK CREDITS</small><b>—</b><span>Wallet is not active yet.</span><button type="button">Plans & limits</button>',box.querySelector('button').onclick=pricing;
      }
    }
    const dash=$('#v51-main [data-v51-page="dashboard"] .v51-shell');if(dash){
      let el=$('.v85-dash',dash);if(!el){el=document.createElement('div');el.className='v85-dash';$('.v51-head',dash)?.insertAdjacentElement('beforebegin',el)}
      if(el){const signed=!!cloud()?.currentSession?.()?.user?.id,bal=wallet?Math.max(0,Number(wallet.balance)||0):null;el.innerHTML='<div><b>Usage foundation</b><span>'+(signed?(wallet?'Cloud wallet active · fair-use limits stay tied to your account.':'Signed in · wallet activation pending.'):'Sign in to keep usage, chats, projects and learning data attached to you.')+'</span></div><i>'+(bal==null?'—':bal.toLocaleString()+' credits')+'</i>'}
    }
  }
  function sync(){render();loadCosts();load()}
  addEventListener('hashchange',()=>{setTimeout(render,100);setTimeout(render,320)});
  addEventListener('scholark:credits-changed',()=>{setTimeout(load,40);setTimeout(render,100)});
  addEventListener('scholark-language-ready',()=>setTimeout(render,100));
  setTimeout(sync,600);
})();