(() => {
  if (window.__SCHOLARK_V42_ROUTE_GUARD__) return;
  window.__SCHOLARK_V42_ROUTE_GUARD__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const workspaceHash=()=>/dashboard|studio|presentation|document|report|poster|tutor|planner|progress|goal|project|education|book|schools|study/.test((location.hash||'').toLowerCase());
  const publicHome=()=>!workspaceHash()&&!/pricing/.test((location.hash||'').toLowerCase());
  let cachedLegacy=null, priceTimer=null;

  const style=document.createElement('style');
  style.id='scholark-v42-style';
  style.textContent=`
    body.v42-home #sv24-home,body.v42-home #v36-shell-home,body.v42-home #v40-workspace-home,body.v42-home #v41-workspace-home,body.v42-home #v26-sidebar-toggle,body.v42-home #v41-sidebar-toggle{display:none!important}
    #v42-pricing{max-width:1240px;margin:86px auto 72px;padding:0 28px;box-sizing:border-box;color:#17191f}
    .v42-head{text-align:center;max-width:790px;margin:0 auto 30px}.v42-head small{font:900 10px/1 Inter;letter-spacing:.14em;color:#6d5dfc}.v42-head h2{font:950 clamp(38px,5vw,68px)/.95 Inter;margin:10px 0 14px;letter-spacing:-.05em}.v42-head p{font:600 14px/1.55 Inter;color:#716d78}
    .v42-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.v42-plan{position:relative;border-radius:30px;padding:28px;border:1px solid rgba(23,25,31,.12);background:#fff;box-shadow:0 22px 70px rgba(29,24,62,.08);min-height:650px;display:flex;flex-direction:column;transition:.4s ease}.v42-plan.plus{background:#17191f;color:#fff}.v42-plan.pro{background:linear-gradient(155deg,#2a2357,#111319 68%);color:#fff;border:2px solid #c9ff6a}.v42-plan.focus{transform:translateY(-10px) scale(1.012);box-shadow:0 30px 95px rgba(68,47,152,.24)}
    .v42-k{font:950 10px/1 Inter;letter-spacing:.14em;color:#7d7887}.plus .v42-k,.pro .v42-k{color:#c9ff6a}.v42-plan h3{font:950 30px/1 Inter;margin:13px 0 8px}.v42-d{font:600 12px/1.5 Inter;opacity:.72;min-height:38px}.v42-price{font:950 52px/1 Inter;margin:24px 0 20px}.v42-price small{font:700 11px Inter;opacity:.62}.v42-trial{font:800 10px/1.45 Inter;margin:-8px 0 18px;opacity:.75}.v42-plan ul{list-style:none;padding:0;margin:0 0 24px}.v42-plan li{font:680 11.5px/1.45 Inter;padding:7px 0;border-bottom:1px solid rgba(130,130,140,.13)}.v42-plan li:before{content:'✓';font-weight:1000;margin-right:7px;color:#6d5dfc}.plus li:before,.pro li:before{color:#c9ff6a}.v42-plan button{margin-top:auto;border:0;border-radius:15px;padding:14px 16px;font:950 12px Inter;cursor:pointer;background:#ececf1;color:#17191f}.plus button,.pro button{background:#c9ff6a;color:#111}.v42-most{position:absolute;right:18px;top:18px;background:#c9ff6a;color:#111;border-radius:999px;padding:7px 10px;font:950 8px Inter;animation:v42p 2.4s ease-in-out infinite}@keyframes v42p{50%{transform:scale(1.06);box-shadow:0 0 0 8px rgba(201,255,106,.08)}}
    @media(max-width:900px){.v42-grid{grid-template-columns:1fr}#v42-pricing{padding:0 16px}.v42-plan.focus{transform:none}}
  `;
  document.head.appendChild(style);

  function navHits(el){const t=lower(el);return ['dashboard','studio ai','ai tutor','planner','voortgang','progress','doelen','goals','onderwijs & leren','education & learning','mijn projecten','my projects'].reduce((n,x)=>n+(t.includes(x)?1:0),0);}
  function findSidebar(){return $$('aside,nav,section,div').filter(el=>!el.closest('#v29-home-layer')).map(el=>({el,h:navHits(el),n:el.querySelectorAll('*').length})).filter(o=>o.h>=4).sort((a,b)=>b.h-a.h||a.n-b.n)[0]?.el||null;}
  function rememberLegacy(){if(cachedLegacy&&document.contains(cachedLegacy))return cachedLegacy;cachedLegacy=$('[data-v30-legacy-home="1"]');if(cachedLegacy)return cachedLegacy;const side=findSidebar();if(side?.parentElement){const items=[...side.parentElement.children].filter(x=>x!==side&&x.id!=='v29-home-layer').map(el=>({el,len:text(el).length,n:el.querySelectorAll('*').length})).filter(o=>o.len>80||o.n>8).sort((a,b)=>b.len-a.len||b.n-a.n);cachedLegacy=items[0]?.el||null;}return cachedLegacy;}
  function reveal(el){let cur=el;while(cur&&cur!==document.body&&cur!==document.documentElement){cur.hidden=false;['display','visibility','opacity','pointer-events','transform','width','min-width','max-width','margin-left'].forEach(p=>cur.style.removeProperty(p));cur=cur.parentElement;}}
  function dashboardItem(side){return side&&$$('button,a,[role="button"],[tabindex],div,span',side).filter(el=>/^dashboard$/i.test(text(el))).sort((a,b)=>(['BUTTON','A'].includes(a.tagName)?0:1)-(['BUTTON','A'].includes(b.tagName)?0:1))[0];}

  function forceWorkspace(){
    document.body.classList.remove('v41-home','v40-public-home','v31-public-home','v42-home');
    const home=$('#v29-home-layer');if(home){home.hidden=true;home.style.setProperty('display','none','important');home.style.setProperty('visibility','hidden','important');}
    const legacy=rememberLegacy();
    $$('[data-v30-legacy-home="1"]').forEach(el=>delete el.dataset.v30LegacyHome);
    if(legacy){delete legacy.dataset.v30LegacyHome;reveal(legacy);legacy.style.setProperty('display','block','important');legacy.style.setProperty('visibility','visible','important');legacy.style.setProperty('opacity','1','important');}
    const side=findSidebar();if(side)reveal(side);
    const item=dashboardItem(side);if(item&&!item.dataset.v42clicked){item.dataset.v42clicked='1';try{item.click()}catch{}setTimeout(()=>delete item.dataset.v42clicked,250);}
    $('#v41-dashboard-entry')?.style.setProperty('display','none','important');
    return !!legacy||!!side;
  }

  function openDashboard(){
    rememberLegacy();
    history.replaceState(null,'',location.pathname+location.search+'#dashboard');
    let i=0;const tick=()=>{i++;forceWorkspace();if(i<12)setTimeout(tick,90);};tick();
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  function pricingMarkup(){return `<div class="v42-head"><small>SCHOLARK PLANS</small><h2>Kies hoeveel voorsprong je wilt.</h2><p>Vergelijk Free, Plus en Pro rechtstreeks op de levende SCHOLARK-homepage.</p></div><div class="v42-grid"><article class="v42-plan"><div class="v42-k">FREE</div><h3>SCHOLARK Free</h3><div class="v42-d">Voor dagelijks leren, oefenen en plannen.</div><div class="v42-price">$0 <small>/ month</small></div><div class="v42-trial">Geen betaalmethode nodig.</div><ul><li>AI Tutor</li><li>Adaptive practice & mastery</li><li>Planner, goals & study choice</li><li>100 AI text requests/day</li><li>8 AI images/day</li></ul><button data-v42-plan="free">Start free</button></article><article class="v42-plan plus"><div class="v42-k">PLUS</div><h3>SCHOLARK Plus</h3><div class="v42-d">Voor creators die Studio AI regelmatig gebruiken.</div><div class="v42-price">$14.99 <small>/ month</small></div><div class="v42-trial">7 days free, then $14.99/month.</div><ul><li>Everything in Free</li><li>Presentation, Webpage, Document, Social & Graphic</li><li>Max 4 active creations per Studio type</li><li>Natural Rewrite — 2/day</li><li>Research with web sources</li><li>350 AI text requests/day</li><li>25 AI images/day</li></ul><button data-v42-plan="plus">Start Plus free trial</button></article><article class="v42-plan pro"><span class="v42-most">MOST POPULAR</span><div class="v42-k">PRO</div><h3>SCHOLARK Pro</h3><div class="v42-d">Maximale AI-kwaliteit, grote projecten en studievoorsprong.</div><div class="v42-price">$19.99 <small>/ month</small></div><div class="v42-trial">7 days free, then $19.99/month.</div><ul><li>Everything in Plus</li><li>Highest-quality SCHOLARK AI</li><li>Unlimited Studio + Natural Rewrite</li><li>Presentations up to 100 slides</li><li>Documents/reports up to 100 pages</li><li>Book Studio up to 900,000 words</li><li>All genres + custom blends</li><li>Schools Near Me + Study Ahead</li><li>1,000 AI text requests/day</li><li>60 AI images/day</li></ul><button data-v42-plan="pro">Start Pro free trial</button></article></div>`;}
  function ensurePricing(){
    if(!publicHome())return;const layer=$('#v29-home-layer');if(!layer)return;const shell=$('.v29-shell',layer)||layer;
    let p=$('#v41-home-pricing')||$('#v42-pricing');
    if(!p){p=document.createElement('section');p.id='v42-pricing';p.innerHTML=pricingMarkup();const final=$('.v29-final,.v29-final-cta,[class*="final-cta"]',shell);final?shell.insertBefore(p,final):shell.appendChild(p);$$('[data-v42-plan]',p).forEach(b=>b.onclick=()=>{const plan=b.dataset.v42Plan;localStorage.setItem('scholark_selected_plan',plan);if(plan==='free')openDashboard();else location.hash='pricing';});}
    p.hidden=false;p.style.setProperty('display','block','important');p.style.setProperty('visibility','visible','important');p.style.setProperty('opacity','1','important');
    if(!priceTimer){let i=0;priceTimer=setInterval(()=>{const cards=$$('.v42-plan',p);if(!cards.length)return;cards.forEach(c=>c.classList.remove('focus'));cards[(i++%2)+1]?.classList.add('focus');},3000);}
  }

  function forceHome(){
    rememberLegacy();
    document.body.classList.add('v42-home','v41-home');
    const legacy=rememberLegacy();if(legacy){legacy.dataset.v30LegacyHome='1';legacy.hidden=true;legacy.style.setProperty('display','none','important');}
    const home=$('#v29-home-layer');if(home){home.hidden=false;home.style.setProperty('display','block','important');home.style.setProperty('visibility','visible','important');home.style.setProperty('opacity','1','important');}
    $('#v41-sidebar-toggle')?.remove();$('#v26-sidebar-toggle')?.remove();
    let btn=$('#v41-dashboard-entry');if(btn){btn.hidden=false;btn.style.setProperty('display','block','important');btn.style.setProperty('visibility','visible','important');btn.style.setProperty('opacity','1','important');btn.style.setProperty('pointer-events','auto','important');}
    ensurePricing();
  }

  function syncDashboardButton(){
    const btn=$('#v41-dashboard-entry');if(!btn)return;
    if(publicHome()){btn.hidden=false;btn.style.setProperty('display','block','important');btn.style.setProperty('visibility','visible','important');btn.style.setProperty('opacity','1','important');btn.style.setProperty('pointer-events','auto','important');}
    else btn.style.setProperty('display','none','important');
  }

  document.addEventListener('click',e=>{
    const dash=e.target.closest('#v41-dashboard-entry');if(dash&&publicHome()){e.preventDefault();e.stopImmediatePropagation();openDashboard();return;}
    const home=e.target.closest('#v41-workspace-home,#v40-workspace-home,#v36-shell-home');if(home&&workspaceHash()){e.preventDefault();e.stopImmediatePropagation();history.replaceState(null,'',location.pathname+location.search);forceHome();window.dispatchEvent(new HashChangeEvent('hashchange'));}
  },true);

  function sync(){
    if(publicHome()){forceHome();syncDashboardButton();}
    else if(workspaceHash()){forceWorkspace();syncDashboardButton();}
  }
  new MutationObserver(()=>{clearTimeout(window.__v42t);window.__v42t=setTimeout(sync,55)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','data-v30-legacy-home']});
  addEventListener('hashchange',()=>setTimeout(sync,10));addEventListener('popstate',()=>setTimeout(sync,10));setInterval(sync,450);setTimeout(sync,40);
})();