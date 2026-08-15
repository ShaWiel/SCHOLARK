(() => {
  if (window.__SCHOLARK_V41_HOME_PRICING_DASHBOARD__) return;
  window.__SCHOLARK_V41_HOME_PRICING_DASHBOARD__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const workspace=()=>/dashboard|studio|presentation|document|report|poster|tutor|planner|progress|goal|project|education/.test((location.hash||'').toLowerCase());
  const home=()=>!workspace()&&!/pricing/.test((location.hash||'').toLowerCase());

  const style=document.createElement('style');
  style.id='scholark-v41-style';
  style.textContent=`
    #v41-home-pricing{max-width:1240px;margin:70px auto 90px;padding:0 28px;box-sizing:border-box;color:#17191f;position:relative;z-index:2}
    #v41-home-pricing[hidden]{display:none!important}
    .v41-head{text-align:center;max-width:790px;margin:0 auto 32px}.v41-head small{font:900 10px/1 Inter,system-ui;letter-spacing:.15em;color:#6d5dfc}.v41-head h2{font:950 clamp(38px,5vw,68px)/.95 Inter,system-ui;letter-spacing:-.05em;margin:10px 0 14px}.v41-head p{font:600 14px/1.55 Inter,system-ui;color:#716d78}
    .v41-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch}.v41-plan{position:relative;border-radius:30px;padding:28px;border:1px solid rgba(23,25,31,.12);background:#fff;box-shadow:0 22px 70px rgba(29,24,62,.08);min-height:650px;display:flex;flex-direction:column;transition:transform .35s ease,box-shadow .35s ease}.v41-plan.plus{background:#17191f;color:#fff}.v41-plan.pro{background:linear-gradient(155deg,#2a2357,#111319 68%);color:#fff;border:2px solid #c9ff6a;box-shadow:0 28px 85px rgba(46,34,101,.24)}.v41-plan.spot{transform:translateY(-10px) scale(1.012);box-shadow:0 30px 95px rgba(68,47,152,.25)}
    .v41-k{font:950 10px/1 Inter;letter-spacing:.14em;color:#7d7887}.plus .v41-k,.pro .v41-k{color:#c9ff6a}.v41-plan h3{font:950 30px/1 Inter;margin:13px 0 8px}.v41-desc{font:600 12px/1.5 Inter;opacity:.72;min-height:38px}.v41-price{font:950 52px/1 Inter;margin:24px 0 20px}.v41-price small{font:700 11px Inter;opacity:.62}.v41-trial{font:800 10px/1.45 Inter;margin:-8px 0 18px;color:#635e6c}.plus .v41-trial,.pro .v41-trial{color:#d7d3df}.v41-plan ul{list-style:none;padding:0;margin:0 0 24px}.v41-plan li{font:680 11.5px/1.45 Inter;padding:7px 0;border-bottom:1px solid rgba(130,130,140,.13)}.v41-plan li:before{content:'✓';font-weight:1000;margin-right:7px;color:#6d5dfc}.plus li:before,.pro li:before{color:#c9ff6a}.v41-plan button{margin-top:auto;border:0;border-radius:15px;padding:14px 16px;font:950 12px Inter,system-ui;cursor:pointer;background:#ececf1;color:#17191f}.plus button,.pro button{background:#c9ff6a;color:#111}.v41-most{position:absolute;right:18px;top:18px;background:#c9ff6a;color:#111;border-radius:999px;padding:7px 10px;font:950 8px Inter;letter-spacing:.06em;animation:v41pulse 2.5s ease-in-out infinite}@keyframes v41pulse{50%{transform:scale(1.06);box-shadow:0 0 0 8px rgba(201,255,106,.08)}}
    body.v41-public-home #v34-dashboard-entry{display:block!important;visibility:visible!important;opacity:1!important}
    body:not(.v41-public-home) #v34-dashboard-entry{display:none!important}
    @media(max-width:900px){.v41-grid{grid-template-columns:1fr}.v41-plan.spot{transform:none}#v41-home-pricing{padding:0 16px}}
  `;
  document.head.appendChild(style);

  const markup=()=>`<div class="v41-head"><small>SCHOLARK PLANS</small><h2>Kies hoeveel voorsprong je wilt.</h2><p>De prijzen staan nu vast op dezelfde SCHOLARK-homepage als de automatische demo’s. Pro bevat de volledige creator-, Future- en long-form ervaring.</p></div><div class="v41-grid">
    <article class="v41-plan"><div class="v41-k">FREE</div><h3>SCHOLARK Free</h3><div class="v41-desc">Voor dagelijks leren, oefenen en plannen.</div><div class="v41-price">$0 <small>/ month</small></div><div class="v41-trial">Geen betaalmethode nodig.</div><ul><li>AI Tutor</li><li>Adaptive practice & mastery</li><li>Planner, goals & study choice</li><li>100 AI text requests per day</li><li>8 AI images per day</li></ul><button data-plan="free">Start free</button></article>
    <article class="v41-plan plus"><div class="v41-k">PLUS</div><h3>SCHOLARK Plus</h3><div class="v41-desc">Voor creators die Studio AI regelmatig gebruiken.</div><div class="v41-price">$14.99 <small>/ month</small></div><div class="v41-trial">7 days free, then $14.99/month. Cancel anytime.</div><ul><li>Everything in Free</li><li>Presentation, Webpage, Document, Social & Graphic Studio</li><li>Max 4 active creations per Studio type</li><li>Natural Rewrite — 2 uses per day</li><li>Research with web sources</li><li>350 AI text requests per day</li><li>25 AI images per day</li></ul><button data-plan="plus">Start Plus free trial</button></article>
    <article class="v41-plan pro"><span class="v41-most">MOST POPULAR</span><div class="v41-k">PRO</div><h3>SCHOLARK Pro</h3><div class="v41-desc">Voor maximale AI-kwaliteit, grote projecten en een studievoorsprong.</div><div class="v41-price">$19.99 <small>/ month</small></div><div class="v41-trial">7 days free, then $19.99/month. Cancel anytime.</div><ul><li>Everything in Plus</li><li>Highest-quality SCHOLARK AI</li><li>Unlimited Studio creations + Natural Rewrite</li><li>Presentations up to 100 slides</li><li>Documents & reports up to 100 pages</li><li>Book Studio up to 900,000 words</li><li>All book/story genres + custom genre blends</li><li>Schools Near Me + Study Ahead</li><li>Advanced research & source checking</li><li>1,000 AI text requests per day</li><li>60 AI images per day</li></ul><button data-plan="pro">Start Pro free trial</button></article>
  </div>`;

  let spotTimer=null;
  function ensurePricing(){
    const layer=$('#v29-home-layer');
    if(!layer)return;
    let section=$('#v41-home-pricing');
    if(!section){
      section=document.createElement('section');section.id='v41-home-pricing';section.innerHTML=markup();
      layer.insertAdjacentElement('afterend',section);
      $$('[data-plan]',section).forEach(btn=>btn.onclick=()=>{const p=btn.dataset.plan;localStorage.setItem('scholark_selected_plan',p);location.hash=p==='free'?'dashboard':'pricing';});
      let i=0;spotTimer=setInterval(()=>{const cards=$$('.v41-plan',section);cards.forEach(c=>c.classList.remove('spot'));cards[(i++%2)+1]?.classList.add('spot');},3200);
    } else if(section.previousElementSibling!==layer) {
      layer.insertAdjacentElement('afterend',section);
    }
    section.hidden=!home();
  }

  function forceDashboardButton(){
    const btn=$('#v34-dashboard-entry');
    if(!btn)return;
    if(home()){
      try{sessionStorage.removeItem('scholark_dashboard_entry_used')}catch{}
      btn.hidden=false;
      btn.removeAttribute('hidden');
      btn.style.setProperty('display','block','important');
      btn.style.setProperty('visibility','visible','important');
      btn.style.setProperty('opacity','1','important');
    }else{
      btn.hidden=true;
      btn.style.setProperty('display','none','important');
    }
  }

  function wirePriceNav(){
    if(document.documentElement.dataset.v41PriceNav)return;
    document.documentElement.dataset.v41PriceNav='1';
    document.addEventListener('click',e=>{
      const el=e.target.closest('a,button,[role="button"]');if(!el||!home())return;
      if(/^(prijzen|pricing)$/i.test((el.textContent||'').trim())){
        e.preventDefault();ensurePricing();$('#v41-home-pricing')?.scrollIntoView({behavior:'smooth',block:'start'});
      }
    },true);
  }

  function sync(){
    document.body.classList.toggle('v41-public-home',home());
    ensurePricing();forceDashboardButton();wirePriceNav();
  }
  new MutationObserver(()=>{clearTimeout(window.__v41t);window.__v41t=setTimeout(sync,60)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','style','class']});
  addEventListener('hashchange',()=>setTimeout(sync,20));addEventListener('popstate',()=>setTimeout(sync,20));
  setInterval(sync,220);setTimeout(sync,80);
})();