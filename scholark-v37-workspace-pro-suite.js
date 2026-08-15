(() => {
  if (window.__SCHOLARK_V37_WORKSPACE_PRO_SUITE__) return;
  window.__SCHOLARK_V37_WORKSPACE_PRO_SUITE__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const txt=e=>(e?.textContent||'').trim();

  const css=document.createElement('style');
  css.id='scholark-v37-workspace-pro-style';
  css.textContent=`
    body.v36-workspace #sv24-home{display:none!important}
    #v37-sidebar-pro{margin:17px 10px 10px;padding-top:13px;border-top:1px solid rgba(255,255,255,.08)}
    #v37-sidebar-pro .v37-side-title{padding:0 10px 8px;color:#8d8997;font:900 8px/1 Inter,system-ui;letter-spacing:.14em;text-transform:uppercase}
    .v37-side-btn{width:100%;border:0;background:transparent;color:#dedbe5;border-radius:10px;padding:9px 10px;margin:2px 0;display:flex;align-items:center;gap:9px;text-align:left;cursor:pointer;font:750 10.5px/1.2 Inter,system-ui}
    .v37-side-btn:hover{background:rgba(201,255,106,.09);color:#fff}.v37-side-btn i{width:20px;height:20px;border-radius:7px;background:rgba(201,255,106,.12);display:grid;place-items:center;color:#c9ff6a;font-style:normal;font-size:11px}.v37-side-btn em{margin-left:auto;font:900 7px/1 Inter;background:#c9ff6a;color:#17191f;border-radius:999px;padding:4px 5px;font-style:normal}
    .v36-shell-controls{position:static!important;inset:auto!important;margin:0 8px 0 0!important;display:inline-flex!important;align-items:center!important;gap:7px!important;vertical-align:middle!important}
    #v36-shell-home{position:static!important;inset:auto!important;transform:none!important;display:inline-flex!important;align-items:center!important;gap:6px!important;height:34px!important;margin:0!important;padding:0 11px!important;border-radius:999px!important;box-shadow:none!important;background:#232630!important;border:1px solid rgba(255,255,255,.14)!important;color:#fff!important;font:850 10px/1 Inter,system-ui!important}
    #v36-language{position:static!important;inset:auto!important;height:34px!important;margin:0!important;display:inline-block!important}
    #v37-home-pricing{max-width:1240px;margin:84px auto 70px;padding:0 28px;box-sizing:border-box;color:#17191f}
    .v37-ph{text-align:center;max-width:760px;margin:0 auto 30px}.v37-ph small{font:900 10px/1 Inter,system-ui;letter-spacing:.14em;color:#6d5dfc}.v37-ph h2{font:950 clamp(38px,5vw,68px)/.95 Inter,system-ui;letter-spacing:-.05em;margin:10px 0 14px}.v37-ph p{font:600 14px/1.55 Inter,system-ui;color:#716d78}
    .v37-pgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch}.v37-plan{position:relative;border-radius:30px;padding:28px;border:1px solid rgba(23,25,31,.12);background:#fff;box-shadow:0 22px 70px rgba(29,24,62,.08);min-height:650px;display:flex;flex-direction:column}.v37-plan.plus{background:#17191f;color:#fff}.v37-plan.pro{background:linear-gradient(155deg,#2a2357,#111319 68%);color:#fff;border:2px solid #c9ff6a;transform:translateY(-10px);box-shadow:0 28px 85px rgba(46,34,101,.24)}
    .v37-kicker{font:950 10px/1 Inter;letter-spacing:.14em;color:#7d7887}.plus .v37-kicker,.pro .v37-kicker{color:#c9ff6a}.v37-plan h3{font:950 30px/1 Inter;margin:13px 0 8px}.v37-desc{font:600 12px/1.5 Inter;opacity:.72;min-height:38px}.v37-price{font:950 52px/1 Inter;margin:24px 0 20px}.v37-price small{font:700 11px Inter;opacity:.62}.v37-trial{font:800 10px/1.45 Inter;margin:-8px 0 18px;color:#635e6c}.plus .v37-trial,.pro .v37-trial{color:#d7d3df}.v37-plan ul{list-style:none;padding:0;margin:0 0 24px}.v37-plan li{font:680 11.5px/1.45 Inter;padding:7px 0;border-bottom:1px solid rgba(130,130,140,.13)}.v37-plan li:before{content:'✓';font-weight:1000;margin-right:7px;color:#6d5dfc}.plus li:before,.pro li:before{color:#c9ff6a}.v37-plan button{margin-top:auto;border:0;border-radius:15px;padding:14px 16px;font:950 12px Inter;cursor:pointer;background:#ececf1;color:#17191f}.plus button,.pro button{background:#c9ff6a;color:#111}.v37-most{position:absolute;right:18px;top:18px;background:#c9ff6a;color:#111;border-radius:999px;padding:7px 10px;font:950 8px Inter;letter-spacing:.06em}
    @media(max-width:850px){.v37-pgrid{grid-template-columns:1fr}.v37-plan.pro{transform:none}#v37-home-pricing{padding:0 16px;margin-top:55px}}
  `;
  document.head.appendChild(css);

  function isWorkspace(){
    const h=(location.hash||'').toLowerCase();
    return h.includes('dashboard')||h.includes('studio')||h.includes('presentation')||h.includes('document')||h.includes('report')||h.includes('poster')||h.includes('tutor')||h.includes('planner')||h.includes('progress')||h.includes('goal')||h.includes('project')||h.includes('education');
  }
  function isPublicHome(){
    const layer=$('#v29-home-layer.v30-native-home');
    return !isWorkspace()&&!location.hash.includes('pricing')&&!!(layer&&!layer.hidden&&getComputedStyle(layer).display!=='none');
  }
  function findSidebar(){
    return $$('aside,nav,section,div').filter(el=>!el.closest('#v29-home-layer')).map(el=>({el,r:el.getBoundingClientRect(),t:txt(el)})).filter(o=>o.r.width>=150&&o.r.width<=380&&o.r.height>=350&&o.t.includes('Dashboard')&&(o.t.includes('Studio AI')||o.t.includes('AI Tutor'))).sort((a,b)=>a.r.width-b.r.width)[0]?.el||null;
  }

  function openProTool(tool){
    const trigger=$(`[data-tool="${tool}"]`);if(trigger){trigger.click();return;}
    const overlay=$('#sv24-overlay');if(overlay){overlay.classList.add('open');setTimeout(()=>document.querySelector(`[data-tool="${tool}"]`)?.click(),80);return;}
    const studio=$$('button,a,[role="button"],div').find(el=>/^Studio AI$/i.test(txt(el)));studio?.click();
    setTimeout(()=>{const ov=$('#sv24-overlay');ov?.classList.add('open');setTimeout(()=>document.querySelector(`[data-tool="${tool}"]`)?.click(),80);},220);
  }

  function injectSidebar(){
    if(!isWorkspace())return;
    const sidebar=findSidebar();if(!sidebar||$('#v37-sidebar-pro',sidebar))return;
    const box=document.createElement('div');box.id='v37-sidebar-pro';
    box.innerHTML=`<div class="v37-side-title">PRO TOOLS</div>
      <button class="v37-side-btn" data-v37="book"><i>📚</i><span>Book Studio</span><em>PRO</em></button>
      <button class="v37-side-btn" data-v37="schools"><i>⌖</i><span>Schools Near Me</span><em>PRO</em></button>
      <button class="v37-side-btn" data-v37="study"><i>↗</i><span>Study Ahead</span><em>PRO</em></button>`;
    sidebar.appendChild(box);
    $('[data-v37="book"]',box).onclick=()=>openProTool('book');$('[data-v37="schools"]',box).onclick=()=>openProTool('schools');$('[data-v37="study"]',box).onclick=()=>openProTool('study');
  }

  function findVisibleLanguageAnchor(){
    const names=['Nederlands','English','Español','Français','Deutsch','Português','Italiano','Sranan Tongo','العربية','हिन्दी','中文','日本語','한국어','Bahasa Indonesia','Türkçe','Polski','Kiswahili'];
    return $$('button,span,div,select').find(el=>{
      if(el.id==='v36-language'||el.closest('.v36-shell-controls')||el.closest('#v29-home-layer'))return false;
      if(!names.includes(txt(el)))return false;
      const r=el.getBoundingClientRect();return r.width>20&&r.height>15&&r.top<125&&r.right>innerWidth*.45;
    })||null;
  }

  function placeHomeBeforeLanguage(){
    if(!isWorkspace())return;
    const corner=$('#sv24-home');if(corner)corner.style.setProperty('display','none','important');
    const wrap=$('.v36-shell-controls'),home=$('#v36-shell-home'),lang=$('#v36-language'),anchor=findVisibleLanguageAnchor();
    if(wrap&&home&&lang){
      if(wrap.firstElementChild!==home)wrap.prepend(home);
      if(home.nextElementSibling!==lang)home.insertAdjacentElement('afterend',lang);
      if(anchor&&wrap.parentElement!==anchor.parentElement)anchor.parentElement?.insertBefore(wrap,anchor);
      if(anchor)anchor.style.setProperty('display','none','important');
      home.innerHTML='⌂ <span>Home</span>';
    }
  }

  function pricingMarkup(){return `<div class="v37-ph"><small>SCHOLARK PLANS</small><h2>Kies hoeveel voorsprong je wilt.</h2><p>Start gratis of probeer Plus en Pro 7 dagen gratis. Pro is de volledige SCHOLARK creator-, Future- en long-form ervaring.</p></div><div class="v37-pgrid">
    <article class="v37-plan"><div class="v37-kicker">FREE</div><h3>SCHOLARK Free</h3><div class="v37-desc">Voor dagelijks leren, oefenen en plannen.</div><div class="v37-price">$0 <small>/ month</small></div><div class="v37-trial">Geen betaalmethode nodig.</div><ul><li>AI Tutor</li><li>Adaptive practice & mastery</li><li>Planner, goals & study choice</li><li>100 AI text requests per day</li><li>8 AI images per day</li></ul><button data-plan="free">Start free</button></article>
    <article class="v37-plan plus"><div class="v37-kicker">PLUS</div><h3>SCHOLARK Plus</h3><div class="v37-desc">Voor creators die Studio AI regelmatig gebruiken.</div><div class="v37-price">$14.99 <small>/ month</small></div><div class="v37-trial">7 days free, then $14.99/month. Cancel anytime.</div><ul><li>Everything in Free</li><li>Presentation, Webpage, Document, Social & Graphic Studio</li><li>Max 4 active creations per Studio type</li><li>Natural Rewrite — 2 uses per day</li><li>Research with web sources</li><li>350 AI text requests per day</li><li>25 AI images per day</li></ul><button data-plan="plus">Start Plus free trial</button></article>
    <article class="v37-plan pro"><span class="v37-most">MOST POPULAR</span><div class="v37-kicker">PRO</div><h3>SCHOLARK Pro</h3><div class="v37-desc">Voor maximale AI-kwaliteit, grote projecten en een studievoorsprong.</div><div class="v37-price">$19.99 <small>/ month</small></div><div class="v37-trial">7 days free, then $19.99/month. Cancel anytime.</div><ul><li>Everything in Plus</li><li>Highest-quality SCHOLARK AI</li><li>Unlimited Studio creations</li><li>Unlimited Natural Rewrite</li><li>Presentations up to 100 slides</li><li>Documents & reports up to 100 pages</li><li>Book Studio up to 900,000 words</li><li>All book/story genres + custom genre blends</li><li>Schools Near Me + Study Ahead</li><li>Advanced research & source checking</li><li>1,000 AI text requests per day</li><li>60 AI images per day</li></ul><button data-plan="pro">Start Pro free trial</button></article></div>`;}

  function injectHomePricing(){
    if(!isPublicHome()){ $('#v37-home-pricing')?.remove();return; }
    if($('#v37-home-pricing'))return;
    const layer=$('#v29-home-layer');if(!layer)return;
    const s=document.createElement('section');s.id='v37-home-pricing';s.innerHTML=pricingMarkup();
    const finalCta=$('.v29-final,.v29-final-cta,[class*="final-cta"]',layer);if(finalCta)layer.insertBefore(s,finalCta);else layer.appendChild(s);
    $$('[data-plan]',s).forEach(btn=>btn.onclick=()=>{const p=btn.dataset.plan;localStorage.setItem('scholark_selected_plan',p);location.hash=p==='free'?'dashboard':'pricing';});
  }

  function cleanupOldSuite(){$('#v37-pro-suite')?.remove();}
  function sync(){cleanupOldSuite();injectSidebar();placeHomeBeforeLanguage();injectHomePricing();}
  new MutationObserver(()=>{clearTimeout(window.__v37ws);window.__v37ws=setTimeout(sync,80)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,30));addEventListener('resize',()=>setTimeout(sync,50));setInterval(sync,650);setTimeout(sync,60);
})();