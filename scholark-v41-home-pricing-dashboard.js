(() => {
  if (window.__SCHOLARK_V41_HOME_PRICING_DASHBOARD__) return;
  window.__SCHOLARK_V41_HOME_PRICING_DASHBOARD__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const workspaceHash=()=>/dashboard|studio|presentation|document|report|poster|tutor|planner|progress|goal|project|education/.test((location.hash||'').toLowerCase());
  const onHome=()=>!workspaceHash() && !/pricing/.test((location.hash||'').toLowerCase()) && !!$('#v29-home-layer');

  const css=document.createElement('style');
  css.id='scholark-v41-home-pricing-dashboard-style';
  css.textContent=`
    body.v40-public-home #v34-dashboard-entry{display:inline-flex!important;visibility:visible!important;opacity:1!important}
    #v40-home-pricing{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important}
  `;
  document.head.appendChild(css);

  function pricingMarkup(){return `<div class="v40-price-head"><small>SCHOLARK PLANS</small><h2>Kies hoeveel voorsprong je wilt.</h2><p>Start gratis of probeer Plus en Pro 7 dagen gratis. De plannen staan rechtstreeks op de SCHOLARK-homepage zodat je meteen kunt vergelijken wat je krijgt.</p></div><div class="v40-price-grid"><article class="v40-plan"><div class="v40-kicker">FREE</div><h3>SCHOLARK Free</h3><div class="v40-desc">Voor dagelijks leren, oefenen en plannen.</div><div class="v40-price">$0 <small>/ month</small></div><div class="v40-trial">Geen betaalmethode nodig.</div><ul><li>AI Tutor</li><li>Adaptive practice & mastery</li><li>Planner, goals & study choice</li><li>100 AI text requests per day</li><li>8 AI images per day</li></ul><button data-plan="free">Start free</button></article><article class="v40-plan plus"><div class="v40-kicker">PLUS</div><h3>SCHOLARK Plus</h3><div class="v40-desc">Voor creators die Studio AI regelmatig gebruiken.</div><div class="v40-price">$14.99 <small>/ month</small></div><div class="v40-trial">7 days free, then $14.99/month. Cancel anytime.</div><ul><li>Everything in Free</li><li>Presentation, Webpage, Document, Social & Graphic Studio</li><li>Max 4 active creations per Studio type</li><li>Natural Rewrite — 2 uses per day</li><li>Research with web sources</li><li>350 AI text requests per day</li><li>25 AI images per day</li></ul><button data-plan="plus">Start Plus free trial</button></article><article class="v40-plan pro"><span class="v40-most">MOST POPULAR</span><div class="v40-kicker">PRO</div><h3>SCHOLARK Pro</h3><div class="v40-desc">Voor maximale AI-kwaliteit, grote projecten en een studievoorsprong.</div><div class="v40-price">$19.99 <small>/ month</small></div><div class="v40-trial">7 days free, then $19.99/month. Cancel anytime.</div><ul><li>Everything in Plus</li><li>Highest-quality SCHOLARK AI</li><li>Unlimited Studio creations + Natural Rewrite</li><li>Presentations up to 100 slides</li><li>Documents & reports up to 100 pages</li><li>Book Studio up to 900,000 words</li><li>All book/story genres + custom genre blends</li><li>Schools Near Me + Study Ahead</li><li>Advanced research & source checking</li><li>1,000 AI text requests per day</li><li>60 AI images per day</li></ul><button data-plan="pro">Start Pro free trial</button></article></div>`;}

  function ensurePricing(){
    if(!onHome()) return;
    const layer=$('#v29-home-layer');
    if(!layer) return;
    let p=$('#v40-home-pricing');
    if(!p){
      p=document.createElement('section');
      p.id='v40-home-pricing';
      p.innerHTML=pricingMarkup();
      const shell=$('.v29-shell',layer)||layer;
      const final=$('.v29-final,.v29-final-cta,[class*="final-cta"]',shell)
        || [...shell.children].find(el=>/volgende voorsprong|next advantage|beginnen|start/i.test(text(el)))
        || null;
      if(final?.parentElement) final.parentElement.insertBefore(p,final);
      else shell.appendChild(p);
      $$('[data-plan]',p).forEach(b=>b.onclick=()=>{
        const plan=b.dataset.plan;
        localStorage.setItem('scholark_selected_plan',plan);
        location.hash=plan==='free'?'dashboard':'pricing';
      });
    }
    p.hidden=false;
    p.style.setProperty('display','block','important');
    p.style.setProperty('visibility','visible','important');
    p.style.setProperty('opacity','1','important');
  }

  function ensureDashboardAlways(){
    if(!onHome()) return;
    try{sessionStorage.removeItem('scholark_dashboard_entry_used');}catch{}
    const b=$('#v34-dashboard-entry');
    if(b){
      b.hidden=false;
      b.style.setProperty('display','inline-flex','important');
      b.style.setProperty('visibility','visible','important');
      b.style.setProperty('opacity','1','important');
    }
  }

  function wirePricingNav(){
    if(document.documentElement.dataset.v41PricingNav==='1') return;
    document.documentElement.dataset.v41PricingNav='1';
    document.addEventListener('click',e=>{
      if(!onHome()) return;
      const el=e.target.closest('a,button,[role="button"]');
      if(!el || !/^(prijzen|pricing|plans)$/i.test(text(el))) return;
      e.preventDefault();e.stopPropagation();
      ensurePricing();
      $('#v40-home-pricing')?.scrollIntoView({behavior:'smooth',block:'start'});
    },true);
  }

  function sync(){
    if(onHome()){
      document.body.classList.add('v40-public-home');
      ensurePricing();
      ensureDashboardAlways();
    }
  }

  wirePricingNav();
  new MutationObserver(()=>{clearTimeout(window.__v41sync);window.__v41sync=setTimeout(sync,60)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,20));
  addEventListener('popstate',()=>setTimeout(sync,20));
  setInterval(sync,500);
  setTimeout(sync,80);
})();