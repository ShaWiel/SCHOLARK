(() => {
  if (window.__SCHOLARK_V34_DASHBOARD_ENTRY__) return;
  window.__SCHOLARK_V34_DASHBOARD_ENTRY__ = true;

  const style=document.createElement('style');
  style.id='scholark-v34-dashboard-style';
  style.textContent=`
    #v34-dashboard-entry{position:fixed;top:18px;right:28px;z-index:1400;border:0;border-radius:14px;padding:11px 17px;background:#17191f;color:#fff;font:900 11px/1 Inter,system-ui;letter-spacing:.01em;box-shadow:0 12px 34px rgba(0,0,0,.18);cursor:pointer;transition:.2s ease;align-items:center}
    #v34-dashboard-entry:hover{transform:translateY(-2px);background:#25283a}
    #v34-dashboard-entry span{color:#c9ff6a;margin-right:6px}
    #v34-dashboard-entry[hidden]{display:none!important}
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
    const cs=getComputedStyle(layer);
    return !layer.hidden&&cs.display!=='none'&&cs.visibility!=='hidden';
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
    const btn=$('#v34-dashboard-entry');
    if(btn){btn.hidden=true;btn.style.setProperty('display','none','important');}
    const native=$$('button,a,[role="button"],[tabindex]')
      .filter(el=>el.id!=='v34-dashboard-entry'&&!el.closest('#v29-home-layer'))
      .find(el=>/^(open dashboard|dashboard openen)$/i.test(text(el)));
    revealWorkspace();
    if(native){try{native.click()}catch{}}
    activateDashboard();
  }

  function pricingMarkup(){return `<div class="v40-price-head"><small>SCHOLARK PLANS</small><h2>Kies hoeveel voorsprong je wilt.</h2><p>Start gratis of probeer Plus en Pro 7 dagen gratis. Vergelijk de plannen rechtstreeks op de SCHOLARK-homepage.</p></div><div class="v40-price-grid"><article class="v40-plan"><div class="v40-kicker">FREE</div><h3>SCHOLARK Free</h3><div class="v40-desc">Voor dagelijks leren, oefenen en plannen.</div><div class="v40-price">$0 <small>/ month</small></div><div class="v40-trial">Geen betaalmethode nodig.</div><ul><li>AI Tutor</li><li>Adaptive practice & mastery</li><li>Planner, goals & study choice</li><li>100 AI text requests per day</li><li>8 AI images per day</li></ul><button data-plan="free">Start free</button></article><article class="v40-plan plus"><div class="v40-kicker">PLUS</div><h3>SCHOLARK Plus</h3><div class="v40-desc">Voor creators die Studio AI regelmatig gebruiken.</div><div class="v40-price">$14.99 <small>/ month</small></div><div class="v40-trial">7 days free, then $14.99/month. Cancel anytime.</div><ul><li>Everything in Free</li><li>Presentation, Webpage, Document, Social & Graphic Studio</li><li>Max 4 active creations per Studio type</li><li>Natural Rewrite — 2 uses per day</li><li>Research with web sources</li><li>350 AI text requests per day</li><li>25 AI images per day</li></ul><button data-plan="plus">Start Plus free trial</button></article><article class="v40-plan pro"><span class="v40-most">MOST POPULAR</span><div class="v40-kicker">PRO</div><h3>SCHOLARK Pro</h3><div class="v40-desc">Voor maximale AI-kwaliteit, grote projecten en een studievoorsprong.</div><div class="v40-price">$19.99 <small>/ month</small></div><div class="v40-trial">7 days free, then $19.99/month. Cancel anytime.</div><ul><li>Everything in Plus</li><li>Highest-quality SCHOLARK AI</li><li>Unlimited Studio creations + Natural Rewrite</li><li>Presentations up to 100 slides</li><li>Documents & reports up to 100 pages</li><li>Book Studio up to 900,000 words</li><li>All book/story genres + custom genre blends</li><li>Schools Near Me + Study Ahead</li><li>Advanced research & source checking</li><li>1,000 AI text requests per day</li><li>60 AI images per day</li></ul><button data-plan="pro">Start Pro free trial</button></article></div>`;}

  function ensureHomePricing(){
    if(!onPublicHome())return;
    const layer=$('#v29-home-layer');if(!layer)return;
    let p=$('#v40-home-pricing');
    if(!p){
      p=document.createElement('section');p.id='v40-home-pricing';p.innerHTML=pricingMarkup();
      const shell=$('.v29-shell',layer)||layer;
      const final=$('.v29-final,.v29-final-cta,[class*="final-cta"]',shell)||[...shell.children].find(el=>/volgende voorsprong|next advantage|beginnen|start/i.test(text(el)))||null;
      if(final?.parentElement)final.parentElement.insertBefore(p,final);else shell.appendChild(p);
      $$('[data-plan]',p).forEach(b=>b.onclick=()=>{const plan=b.dataset.plan;localStorage.setItem('scholark_selected_plan',plan);location.hash=plan==='free'?'dashboard':'pricing';});
    }
    p.hidden=false;p.style.setProperty('display','block','important');p.style.setProperty('visibility','visible','important');p.style.setProperty('opacity','1','important');
  }

  function sync(){
    let btn=$('#v34-dashboard-entry');
    if(!btn){btn=document.createElement('button');btn.id='v34-dashboard-entry';btn.type='button';btn.innerHTML='<span>↗</span> Dashboard';btn.addEventListener('click',openDashboard);document.body.appendChild(btn);}
    const home=onPublicHome();
    btn.hidden=!home;
    if(home){
      try{sessionStorage.removeItem('scholark_dashboard_entry_used');}catch{}
      btn.style.setProperty('display','inline-flex','important');btn.style.setProperty('visibility','visible','important');btn.style.setProperty('opacity','1','important');
      ensureHomePricing();
    }else btn.style.setProperty('display','none','important');
  }

  document.addEventListener('click',e=>{
    if(!onPublicHome())return;
    const el=e.target.closest('a,button,[role="button"]');
    if(!el||!/^(prijzen|pricing|plans)$/i.test(text(el)))return;
    e.preventDefault();e.stopPropagation();ensureHomePricing();$('#v40-home-pricing')?.scrollIntoView({behavior:'smooth',block:'start'});
  },true);

  new MutationObserver(()=>{clearTimeout(window.__v34t);window.__v34t=setTimeout(sync,60)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,20));
  addEventListener('popstate',()=>setTimeout(sync,20));
  setInterval(sync,500);
  setTimeout(sync,40);
})();