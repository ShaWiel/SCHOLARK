(() => {
  if (window.__SCHOLARK_V34_DASHBOARD_ENTRY__) return;
  window.__SCHOLARK_V34_DASHBOARD_ENTRY__ = true;

  const style=document.createElement('style');
  style.id='scholark-v34-dashboard-style';
  style.textContent=`
    #v34-dashboard-entry{position:fixed;top:18px;right:28px;z-index:2147483646;border:0;border-radius:14px;padding:11px 17px;background:#17191f;color:#fff;font:900 11px/1 Inter,system-ui;letter-spacing:.01em;box-shadow:0 12px 34px rgba(0,0,0,.18);cursor:pointer;transition:.2s ease;align-items:center}
    #v34-dashboard-entry:hover{transform:translateY(-2px);background:#25283a}
    #v34-dashboard-entry span{color:#c9ff6a;margin-right:6px}
    #v34-dashboard-entry[hidden]{display:none!important}
    #v34-home-pricing{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;max-width:1240px!important;width:100%!important;margin:82px auto 72px!important;padding:0 28px!important;box-sizing:border-box!important;color:#17191f!important;overflow:visible!important}
    #v34-home-pricing .v34-price-head{text-align:center;max-width:780px;margin:0 auto 30px}.v34-price-head small{font:900 10px/1 Inter;letter-spacing:.14em;color:#6d5dfc}.v34-price-head h2{font:950 clamp(38px,5vw,68px)/.95 Inter;margin:10px 0 14px;letter-spacing:-.05em}.v34-price-head p{font:600 14px/1.55 Inter;color:#716d78}
    #v34-home-pricing .v34-price-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.v34-plan{position:relative;border-radius:30px;padding:28px;border:1px solid rgba(23,25,31,.12);background:#fff;box-shadow:0 22px 70px rgba(29,24,62,.08);min-height:650px;display:flex;flex-direction:column}.v34-plan.plus{background:#17191f;color:#fff}.v34-plan.pro{background:linear-gradient(155deg,#2a2357,#111319 68%);color:#fff;border:2px solid #c9ff6a;box-shadow:0 28px 85px rgba(46,34,101,.24);transform:translateY(-10px)}
    .v34-kicker{font:950 10px/1 Inter;letter-spacing:.14em;color:#7d7887}.plus .v34-kicker,.pro .v34-kicker{color:#c9ff6a}.v34-plan h3{font:950 30px/1 Inter;margin:13px 0 8px}.v34-desc{font:600 12px/1.5 Inter;opacity:.72;min-height:38px}.v34-price{font:950 52px/1 Inter;margin:24px 0 20px}.v34-price small{font:700 11px Inter;opacity:.62}.v34-trial{font:800 10px/1.45 Inter;margin:-8px 0 18px;color:#635e6c}.plus .v34-trial,.pro .v34-trial{color:#d7d3df}.v34-plan ul{list-style:none;padding:0;margin:0 0 24px}.v34-plan li{font:680 11.5px/1.45 Inter;padding:7px 0;border-bottom:1px solid rgba(130,130,140,.13)}.v34-plan li:before{content:'✓';font-weight:1000;margin-right:7px;color:#6d5dfc}.plus li:before,.pro li:before{color:#c9ff6a}.v34-plan button{margin-top:auto;border:0;border-radius:15px;padding:14px 16px;font:950 12px Inter;cursor:pointer;background:#ececf1;color:#17191f}.plus button,.pro button{background:#c9ff6a;color:#111}.v34-most{position:absolute;right:18px;top:18px;background:#c9ff6a;color:#111;border-radius:999px;padding:7px 10px;font:950 8px Inter;letter-spacing:.06em}
    @media(max-width:900px){#v34-home-pricing{padding:0 16px!important}.v34-price-grid{grid-template-columns:1fr!important}.v34-plan.pro{transform:none}}
    @media(max-width:640px){#v34-dashboard-entry{top:12px;right:12px;padding:10px 13px;font-size:10px}}
  `;
  document.head.appendChild(style);

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const workspaceHash=()=>/dashboard|studio|presentation|document|report|poster|tutor|planner|progress|goal|project|education/.test((location.hash||'').toLowerCase());

  function onPublicHome(){
    const layer=$('#v29-home-layer');
    if(!layer||workspaceHash()||/pricing/.test((location.hash||'').toLowerCase())) return false;
    return true;
  }

  function findSidebar(){
    const tokens=['Dashboard','Education & Learning','Studio AI','Planner','Progress','Onderwijs & Leren','Voortgang'];
    return $$('aside,nav,section,div')
      .filter(el=>!el.closest('#v29-home-layer'))
      .map(el=>({el,hits:tokens.filter(t=>(el.textContent||'').includes(t)).length,r:el.getBoundingClientRect()}))
      .filter(o=>o.hits>=3&&o.r.width>=120&&o.r.width<=480&&o.r.height>=250)
      .sort((a,b)=>b.hits-a.hits||a.r.width-b.r.width)[0]?.el||null;
  }

  function dashboardItem(sidebar){
    if(!sidebar)return null;
    return $$('button,a,[role="button"],[tabindex],div',sidebar)
      .filter(el=>/^Dashboard$/i.test(text(el)))
      .sort((a,b)=>(['BUTTON','A'].includes(a.tagName)?0:1)-(['BUTTON','A'].includes(b.tagName)?0:1))[0]||null;
  }

  function revealWorkspace(){
    const layer=$('#v29-home-layer');
    if(layer){layer.hidden=true;layer.style.setProperty('display','none','important');}
    const legacy=$('[data-v30-legacy-home="1"]');
    if(legacy){delete legacy.dataset.v30LegacyHome;legacy.style.removeProperty('display');legacy.hidden=false;}
    document.body?.classList.remove('v31-public-home','v40-public-home');
  }

  function activateDashboard(){
    revealWorkspace();
    if((location.hash||'').toLowerCase()!=='#dashboard')location.hash='dashboard';
    let attempts=0;
    const timer=setInterval(()=>{
      attempts++;
      revealWorkspace();
      const side=findSidebar(),item=dashboardItem(side);
      if(item){
        try{item.click()}catch{}
        if(side){side.style.removeProperty('display');side.style.removeProperty('visibility');side.style.removeProperty('opacity');}
        clearInterval(timer);
      }else if(attempts>=12)clearInterval(timer);
    },100);
  }

  function openDashboard(){
    revealWorkspace();
    activateDashboard();
  }

  function pricingMarkup(){return `<div class="v34-price-head"><small>SCHOLARK PLANS</small><h2>Kies hoeveel voorsprong je wilt.</h2><p>Start gratis of probeer Plus en Pro 7 dagen gratis. Vergelijk de plannen rechtstreeks op de SCHOLARK-homepage.</p></div><div class="v34-price-grid"><article class="v34-plan"><div class="v34-kicker">FREE</div><h3>SCHOLARK Free</h3><div class="v34-desc">Voor dagelijks leren, oefenen en plannen.</div><div class="v34-price">$0 <small>/ month</small></div><div class="v34-trial">Geen betaalmethode nodig.</div><ul><li>AI Tutor</li><li>Adaptive practice & mastery</li><li>Planner, goals & study choice</li><li>100 AI text requests per day</li><li>8 AI images per day</li></ul><button data-v34-plan="free">Start free</button></article><article class="v34-plan plus"><div class="v34-kicker">PLUS</div><h3>SCHOLARK Plus</h3><div class="v34-desc">Voor creators die Studio AI regelmatig gebruiken.</div><div class="v34-price">$14.99 <small>/ month</small></div><div class="v34-trial">7 days free, then $14.99/month. Cancel anytime.</div><ul><li>Everything in Free</li><li>Presentation, Webpage, Document, Social & Graphic Studio</li><li>Max 4 active creations per Studio type</li><li>Natural Rewrite — 2 uses per day</li><li>Research with web sources</li><li>350 AI text requests per day</li><li>25 AI images per day</li></ul><button data-v34-plan="plus">Start Plus free trial</button></article><article class="v34-plan pro"><span class="v34-most">MOST POPULAR</span><div class="v34-kicker">PRO</div><h3>SCHOLARK Pro</h3><div class="v34-desc">Voor maximale AI-kwaliteit, grote projecten en een studievoorsprong.</div><div class="v34-price">$19.99 <small>/ month</small></div><div class="v34-trial">7 days free, then $19.99/month. Cancel anytime.</div><ul><li>Everything in Plus</li><li>Highest-quality SCHOLARK AI</li><li>Unlimited Studio creations + Natural Rewrite</li><li>Presentations up to 100 slides</li><li>Documents & reports up to 100 pages</li><li>Book Studio up to 900,000 words</li><li>All book/story genres + custom genre blends</li><li>Schools Near Me + Study Ahead</li><li>Advanced research & source checking</li><li>1,000 AI text requests per day</li><li>60 AI images per day</li></ul><button data-v34-plan="pro">Start Pro free trial</button></article></div>`;}

  function ensureHomePricing(){
    if(!onPublicHome())return;
    const layer=$('#v29-home-layer');if(!layer)return;
    const shell=$('.v29-shell',layer)||layer;
    shell.style.setProperty('overflow','visible','important');
    let p=$('#v34-home-pricing');
    if(!p){
      p=document.createElement('section');p.id='v34-home-pricing';p.innerHTML=pricingMarkup();
    }
    if(p.parentElement!==shell){
      const final=$('.v29-final,.v29-final-cta,[class*="final-cta"]',shell)||[...shell.children].find(el=>/volgende voorsprong|next advantage|beginnen|start vandaag|start today/i.test(text(el)))||null;
      if(final?.parentElement===shell)shell.insertBefore(p,final);else shell.appendChild(p);
    }
    p.hidden=false;p.style.setProperty('display','block','important');p.style.setProperty('visibility','visible','important');p.style.setProperty('opacity','1','important');
    $$('[data-v34-plan]',p).forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.onclick=()=>{const plan=b.dataset.v34Plan;localStorage.setItem('scholark_selected_plan',plan);location.hash=plan==='free'?'dashboard':'pricing';};});
  }

  function sync(){
    let btn=$('#v34-dashboard-entry');
    if(!btn){btn=document.createElement('button');btn.id='v34-dashboard-entry';btn.type='button';btn.innerHTML='<span>↗</span> Dashboard';btn.addEventListener('click',openDashboard);document.body.appendChild(btn);}
    if(btn.parentElement!==document.body)document.body.appendChild(btn);
    const home=onPublicHome();
    btn.hidden=!home;
    if(home){
      btn.style.setProperty('display','inline-flex','important');btn.style.setProperty('visibility','visible','important');btn.style.setProperty('opacity','1','important');btn.style.setProperty('pointer-events','auto','important');
      ensureHomePricing();
    }else btn.style.setProperty('display','none','important');
  }

  document.addEventListener('click',e=>{
    if(!onPublicHome())return;
    const el=e.target.closest('a,button,[role="button"]');
    if(!el||!/^(prijzen|pricing|plans)$/i.test(text(el)))return;
    e.preventDefault();e.stopPropagation();ensureHomePricing();$('#v34-home-pricing')?.scrollIntoView({behavior:'smooth',block:'start'});
  },true);

  new MutationObserver(()=>{clearTimeout(window.__v34t);window.__v34t=setTimeout(sync,60)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,20));
  addEventListener('popstate',()=>setTimeout(sync,20));
  setInterval(sync,350);
  setTimeout(sync,40);
})();