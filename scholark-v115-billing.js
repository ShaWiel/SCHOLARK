(() => {
  if(window.__SCHOLARK_V115_BILLING__)return;
  window.__SCHOLARK_V115_BILLING__=true;
  const $=(s,r=document)=>r.querySelector(s);
  let config=null,state={plan:'free',subscription:null,wallet:null},paddleReady=null;
  let active={plan:'',button:null,label:'',loaded:false,fallbackTried:false,method:'',session:null,P:null};

  const session=()=>{try{return window.__SCHOLARK_V72_CLOUD__?.currentSession?.()||JSON.parse(localStorage.getItem('scholark_supabase_session_v2')||'null')}catch{return null}};
  const token=()=>session()?.access_token||'';
  function jwtSub(t){try{const p=String(t||'').split('.')[1];if(!p)return'';return JSON.parse(atob(p.replace(/-/g,'+').replace(/_/g,'/')))?.sub||''}catch{return''}}
  const userId=s=>String(s?.user?.id||jwtSub(s?.access_token)||'');
  const userEmail=s=>String(s?.user?.email||'').trim();

  function preconnect(){
    if(document.querySelector('link[data-sch-paddle-preconnect]'))return;
    for(const href of ['https://cdn.paddle.com','https://checkout.paddle.com']){
      const l=document.createElement('link');l.rel='preconnect';l.href=href;l.crossOrigin='anonymous';l.dataset.schPaddlePreconnect='1';document.head.appendChild(l);
    }
  }
  preconnect();

  const card=plan=>document.querySelector('#v41-home-pricing .v41-plan.'+plan);
  const button=plan=>card(plan)?.querySelector('[data-plan="'+plan+'"]')||null;
  function statusNode(plan){
    const c=card(plan);if(!c)return null;
    let el=c.querySelector('.v115-card-status');
    if(!el){el=document.createElement('div');el.className='v115-card-status';el.setAttribute('role','status');const b=button(plan);b?.insertAdjacentElement('afterend',el)}
    return el;
  }
  function message(plan,text='',err=false){
    const el=statusNode(plan);if(!el)return;
    el.textContent=text;el.hidden=!text;el.classList.toggle('error',!!err);
  }
  function setBusy(plan,busy,label='Opening secure checkout…'){
    const b=button(plan);if(!b)return;
    if(busy){
      if(!b.dataset.v115Label)b.dataset.v115Label=b.textContent;
      b.disabled=true;b.setAttribute('aria-busy','true');b.textContent=label;
    }else{
      b.disabled=false;b.removeAttribute('aria-busy');
      if(b.dataset.v115Label)b.textContent=b.dataset.v115Label;
    }
  }
  function resetActive(keepMessage=false){
    if(active.plan)setBusy(active.plan,false);
    if(active.plan&&!keepMessage)message(active.plan,'');
    active={plan:'',button:null,label:'',loaded:false,fallbackTried:false,method:'',session:null,P:null};
  }

  const style=document.createElement('style');style.id='scholark-v115-style';style.textContent=`
    #v41-home-pricing .v41-plan [data-plan][disabled]{opacity:.72;cursor:progress;transform:none!important}
    #v41-home-pricing .v115-card-status{margin-top:9px;padding:9px 10px;border-radius:10px;background:rgba(201,255,106,.11);border:1px solid rgba(201,255,106,.2);font:750 9px/1.4 Inter,system-ui;color:inherit}
    #v41-home-pricing .v115-card-status.error{background:#fff0ee;border-color:#f4b8af;color:#8b352f}
    #v41-home-pricing .plus .v115-card-status.error,#v41-home-pricing .pro .v115-card-status.error{background:rgba(255,102,92,.13);border-color:rgba(255,140,130,.26);color:#ffd8d2}
  `;document.head.appendChild(style);

  async function getConfig(){if(config)return config;const r=await fetch('/api/billing/config',{cache:'no-store'}),d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)throw new Error(d?.error||'Could not load payment configuration');config=d;return d}
  async function refresh(){
    const t=token();if(!t){state={plan:'free',subscription:null,wallet:null};return state}
    try{
      const r=await fetch('/api/billing/status',{cache:'no-store',headers:{authorization:'Bearer '+t}}),d=await r.json().catch(()=>({}));
      if(r.ok&&d?.ok){
        state={plan:d.plan||'free',subscription:d.subscription||null,wallet:d.wallet||null};
        localStorage.setItem('scholark_selected_plan',state.plan);
        window.dispatchEvent(new CustomEvent('scholark:billing-changed',{detail:state}));
        window.dispatchEvent(new CustomEvent('scholark:credits-changed',{detail:{billing:true}}));
      }
    }catch{}
    return state;
  }
  function loadScript(){
    if(window.Paddle)return Promise.resolve(window.Paddle);
    return new Promise((resolve,reject)=>{
      let x=$('script[data-sch-paddle]');
      if(x){x.addEventListener('load',()=>resolve(window.Paddle),{once:true});x.addEventListener('error',()=>reject(new Error('Could not load secure Paddle checkout')),{once:true});return}
      x=document.createElement('script');x.src='https://cdn.paddle.com/paddle/v2/paddle.js';x.async=true;x.dataset.schPaddle='1';
      x.onload=()=>window.Paddle?resolve(window.Paddle):reject(new Error('Paddle checkout did not initialize'));
      x.onerror=()=>reject(new Error('Could not load secure Paddle checkout'));
      document.head.appendChild(x);
    });
  }
  async function finalize(transactionId,plan,attempt=0){
    const s=session();if(!s?.access_token||!transactionId)return false;
    const r=await fetch('/api/billing/finalize',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+s.access_token},body:JSON.stringify({transactionId})}),d=await r.json().catch(()=>({}));
    if(r.status===202&&d?.pending&&attempt<4){await new Promise(x=>setTimeout(x,650+attempt*350));return finalize(transactionId,plan,attempt+1)}
    if(!r.ok||!d?.ok)throw new Error(d?.error||d?.code||'Payment succeeded but plan activation is still processing.');
    await refresh();await window.__SCHOLARK_CREDITS__?.load?.();
    message(plan,'✓ '+String(plan).toUpperCase()+' is active. Your credits have been updated.');
    setBusy(plan,false);setTimeout(()=>message(plan,''),6500);
    return true;
  }
  async function handlePaddleEvent(e){
    const name=String(e?.name||''),plan=active.plan;
    if(!plan)return;
    if(name==='checkout.loaded'){
      active.loaded=true;setBusy(plan,true,'Secure checkout open');message(plan,'Secure Paddle checkout opened.');
      return;
    }
    if(name==='checkout.closed'){resetActive();return}
    if(name==='checkout.completed'){
      const txn=String(e?.data?.transaction_id||'');
      message(plan,'Payment received. Activating your SCHOLARK plan…');
      try{await finalize(txn,plan)}catch(err){setBusy(plan,false);message(plan,String(err?.message||err),true)}
      return;
    }
    if(name==='checkout.error'||name==='checkout.payment.failed'||name==='checkout.payment.error'){
      if(!active.loaded&&!active.fallbackTried&&active.P&&active.session){
        active.fallbackTried=true;
        message(plan,'Direct checkout could not open. Retrying securely…');
        try{await serverFallback(plan,active.P,active.session);return}catch{}
      }
      setBusy(plan,false);message(plan,'Paddle could not open or complete checkout. Please try again.',true);
    }
  }
  async function initPaddle(){
    if(window.__SCHOLARK_PADDLE_READY__)return window.__SCHOLARK_PADDLE_READY__;
    if(paddleReady)return paddleReady;
    paddleReady=(async()=>{
      const c=await getConfig();if(!c?.configured)throw new Error('Payments are not configured yet.');
      const P=await loadScript();
      if(c.environment==='sandbox')P.Environment.set('sandbox');
      if(!window.__SCHOLARK_PADDLE_INITIALIZED__){
        P.Initialize({token:c.clientToken,eventCallback:handlePaddleEvent});
        window.__SCHOLARK_PADDLE_INITIALIZED__=true;
      }else{
        try{P.Update({eventCallback:handlePaddleEvent})}catch{}
      }
      window.__SCHOLARK_PADDLE_READY__=P;return P;
    })().catch(e=>{paddleReady=null;throw e});
    return paddleReady;
  }
  function paddleLocale(){
    const c=String(document.documentElement.lang||'en').toLowerCase().split('-')[0];
    return new Set(['en','de','es','fr','it','nl','pl','pt','sv','ja']).has(c)?c:'en';
  }
  async function serverFallback(plan,P,s){
    active.method='transaction';
    const r=await fetch('/api/billing/checkout',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+s.access_token},body:JSON.stringify({plan})}),d=await r.json().catch(()=>({}));
    if(!r.ok||!d?.transactionId)throw new Error(d?.error||'Could not create secure checkout transaction');
    P.Checkout.open({transactionId:d.transactionId,settings:{displayMode:'overlay',theme:'light',locale:paddleLocale(),variant:'one-page'}});
  }
  async function choose(plan){
    plan=String(plan||'').toLowerCase();
    if(plan==='free'){location.hash='dashboard';return}
    if(!['plus','pro'].includes(plan))return;
    if(active.plan){message(plan,'A checkout is already opening.');return}
    const s=session();
    if(!s?.access_token){
      sessionStorage.setItem('scholark_pending_plan',plan);
      message(plan,'Sign in or create your SCHOLARK account first.',true);
      window.__SCHOLARK_V72_CLOUD__?.openAuth?.('signin')||$('#v55-auth')?.click();
      return;
    }
    setBusy(plan,true);message(plan,'Preparing secure checkout…');
    try{
      const [c,P]=await Promise.all([getConfig(),initPaddle()]);
      const priceId=String(c?.priceIds?.[plan]||'');
      if(!/^pri_[a-z\d]{26}$/.test(priceId))throw new Error('This plan is not connected to a valid Paddle price.');
      const uid=userId(s);if(!uid)throw new Error('Could not verify your SCHOLARK account.');
      active={plan,button:button(plan),label:button(plan)?.dataset.v115Label||'',loaded:false,fallbackTried:false,method:'direct',session:s,P};
      const opts={items:[{priceId,quantity:1}],customData:{scholark_user_id:uid,scholark_plan:plan},settings:{displayMode:'overlay',theme:'light',locale:paddleLocale(),variant:'one-page'}};
      const email=userEmail(s);if(email)opts.customer={email};
      P.Checkout.open(opts);
      setTimeout(()=>{if(active.plan===plan&&!active.loaded)message(plan,'Opening Paddle secure checkout…')},900);
      setTimeout(async()=>{if(active.plan!==plan||active.loaded||active.fallbackTried||active.method!=='direct')return;active.fallbackTried=true;message(plan,'Checkout is taking longer than expected. Retrying securely…');try{await serverFallback(plan,P,s)}catch(err){setBusy(plan,false);message(plan,String(err?.message||err),true);resetActive(true)}},5000);
    }catch(err){
      try{
        const P=active.P||await initPaddle();
        active={plan,button:button(plan),label:button(plan)?.dataset.v115Label||'',loaded:false,fallbackTried:true,method:'transaction',session:s,P};
        message(plan,'Retrying with secure transaction checkout…');
        await serverFallback(plan,P,s);
      }catch(fallbackErr){
        setBusy(plan,false);
        message(plan,String(fallbackErr?.message||err?.message||fallbackErr||err),true);
        resetActive(true);
      }
    }
  }
  function resumePending(){const plan=sessionStorage.getItem('scholark_pending_plan');if(!plan||!token())return;sessionStorage.removeItem('scholark_pending_plan');setTimeout(()=>choose(plan),120)}
  function paidButtonFrom(e){const b=e.target.closest?.('#v41-home-pricing [data-plan]');return b&&['plus','pro'].includes(String(b.dataset.plan||''))?b:null}
  function wire(){
    document.addEventListener('click',e=>{const b=paidButtonFrom(e);if(!b)return;e.preventDefault();e.stopPropagation();choose(b.dataset.plan)},true);
    document.addEventListener('pointerover',e=>{if(paidButtonFrom(e))initPaddle().catch(()=>{})},{passive:true,capture:true});
    document.addEventListener('focusin',e=>{if(paidButtonFrom(e))initPaddle().catch(()=>{})},true);
  }
  addEventListener('scholark-runtime-ready',()=>{refresh().then(resumePending);getConfig().catch(()=>{})});
  addEventListener('scholark:auth-changed',()=>{refresh().then(resumePending)});
  addEventListener('pageshow',()=>refresh());
  wire();setTimeout(()=>{refresh();getConfig().catch(()=>{})},450);
  window.__SCHOLARK_BILLING__={choose,refresh,plan:()=>state.plan,status:()=>state,config:()=>getConfig(),prewarm:()=>initPaddle(),release:'r186'};
})();