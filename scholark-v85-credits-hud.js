(() => {
  if(window.__SCHOLARK_V85_CREDITS_HUD__)return;
  window.__SCHOLARK_V85_CREDITS_HUD__=true;
  const $=(s,r=document)=>r.querySelector(s),clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let wallet=null,busy=false;
  const css=document.createElement('style');css.id='scholark-v85-style';css.textContent=`
    .v85-wallet{margin:9px 8px 0;padding:11px;border-radius:14px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);color:#fff}.v85-wallet small{display:block;font:900 6.8px Inter;letter-spacing:.13em;color:#8f8b98}.v85-wallet b{display:block;margin-top:5px;font:950 18px/1 Inter}.v85-wallet span{display:block;margin-top:4px;font:650 7px/1.35 Inter;color:#aaa6b2}.v85-wallet button{margin-top:7px;border:0;border-radius:9px;background:#c9ff6a;color:#17191f;padding:7px 9px;font:900 7px Inter;cursor:pointer}.v85-low{color:#ffcf72!important}
    .v85-dash{display:flex;gap:8px;align-items:center;margin:0 130px 16px 0;padding:12px 14px;background:#17191f;color:#fff;border-radius:16px}.v85-dash b{font:950 12px Inter}.v85-dash span{font:700 8px Inter;color:#bdb8c5}.v85-dash i{margin-left:auto;font:950 16px Inter;color:#c9ff6a;font-style:normal}
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
  function sync(){render();load()}
  new MutationObserver(()=>{clearTimeout(window.__v85sync);window.__v85sync=setTimeout(render,120)}).observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('focus',load);addEventListener('hashchange',()=>setTimeout(render,80));setTimeout(sync,600);
})();