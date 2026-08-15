(() => {
  if (window.__SCHOLARK_V38_HOME_PRICING_NAV__) return;
  window.__SCHOLARK_V38_HOME_PRICING_NAV__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const txt=e=>(e?.textContent||'').trim();

  const style=document.createElement('style');
  style.id='scholark-v38-style';
  style.textContent=`
    body.v36-workspace #sv24-home{display:none!important}
    #v38-home-pricing{max-width:1240px;margin:84px auto 70px;padding:0 28px;box-sizing:border-box;color:#17191f}
    .v38-price-head{text-align:center;max-width:760px;margin:0 auto 30px}.v38-price-head small{font:900 10px/1 Inter,system-ui;letter-spacing:.14em;color:#6d5dfc}.v38-price-head h2{font:950 clamp(38px,5vw,68px)/.95 Inter,system-ui;letter-spacing:-.05em;margin:10px 0 14px}.v38-price-head p{font:600 14px/1.55 Inter,system-ui;color:#716d78}
    .v38-price-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch}.v38-plan{position:relative;border-radius:30px;padding:28px;border:1px solid rgba(23,25,31,.12);background:#fff;box-shadow:0 22px 70px rgba(29,24,62,.08);min-height:650px;display:flex;flex-direction:column}.v38-plan.plus{background:#17191f;color:#fff}.v38-plan.pro{background:linear-gradient(155deg,#2a2357,#111319 68%);color:#fff;border:2px solid #c9ff6a;transform:translateY(-10px);box-shadow:0 28px 85px rgba(46,34,101,.24)}
    .v38-kicker{font:950 10px/1 Inter;letter-spacing:.14em;color:#7d7887}.plus .v38-kicker,.pro .v38-kicker{color:#c9ff6a}.v38-plan h3{font:950 30px/1 Inter;margin:13px 0 8px}.v38-desc{font:600 12px/1.5 Inter;opacity:.72;min-height:38px}.v38-price{font:950 52px/1 Inter;margin:24px 0 20px}.v38-price small{font:700 11px Inter;opacity:.62}.v38-trial{font:800 10px/1.45 Inter;margin:-8px 0 18px;color:#635e6c}.plus .v38-trial,.pro .v38-trial{color:#d7d3df}.v38-plan ul{list-style:none;padding:0;margin:0 0 24px}.v38-plan li{font:680 11.5px/1.45 Inter;padding:7px 0;border-bottom:1px solid rgba(130,130,140,.13)}.v38-plan li:before{content:'✓';font-weight:1000;margin-right:7px;color:#6d5dfc}.plus li:before,.pro li:before{color:#c9ff6a}.v38-plan button{margin-top:auto;border:0;border-radius:15px;padding:14px 16px;font:950 12px Inter;cursor:pointer;background:#ececf1;color:#17191f}.plus button,.pro button{background:#c9ff6a;color:#111}.v38-most{position:absolute;right:18px;top:18px;background:#c9ff6a;color:#111;border-radius:999px;padding:7px 10px;font:950 8px Inter;letter-spacing:.06em}
    .v36-shell-controls{position:static!important;inset:auto!important;margin:0 8px 0 0!important;display:inline-flex!important;align-items:center!important;gap:7px!important;vertical-align:middle!important}
    #v36-shell-home{position:static!important;inset:auto!important;transform:none!important;display:inline-flex!important;align-items:center!important;gap:6px!important;height:34px!important;margin:0!important;padding:0 11px!important;border-radius:999px!important;box-shadow:none!important;background:#232630!important;border:1px solid rgba(255,255,255,.14)!important;color:#fff!important;font:850 10px/1 Inter,system-ui!important}
    #v36-language{position:static!important;inset:auto!important;height:34px!important;margin:0!important;display:inline-block!important}
    @media(max-width:850px){.v38-price-grid{grid-template-columns:1fr}.v38-plan.pro{transform:none}#v38-home-pricing{padding:0 16px;margin-top:55px}}
  `;
  document.head.appendChild(style);

  function isWorkspace(){
    const h=(location.hash||'').toLowerCase();
    return h.includes('dashboard')||h.includes('studio')||h.includes('presentation')||h.includes('document')||h.includes('report')||h.includes('poster')||h.includes('tutor')||h.includes('planner')||h.includes('progress')||h.includes('goal')||h.includes('project')||h.includes('education');
  }
  function isPublicHome(){
    const layer=$('#v29-home-layer.v30-native-home');
    return !isWorkspace()&&!location.hash.includes('pricing')&&!!(layer&&!layer.hidden&&getComputedStyle(layer).display!=='none');
  }

  function findVisibleLanguageAnchor(){
    const names=['Nederlands','English','Español','Français','Deutsch','Português','Italiano','Sranan Tongo','العربية','हिन्दी','中文','日本語','한국어','Bahasa Indonesia','Türkçe','Polski','Kiswahili'];
    return $$('button,span,div,select').find(el=>{
      if(el.id==='v36-language'||el.closest('.v36-shell-controls')||el.closest('#v29-home-layer')) return false;
      if(!names.includes(txt(el))) return false;
      const r=el.getBoundingClientRect();
      return r.width>20&&r.height>15&&r.top<125&&r.right>innerWidth*.45;
    })||null;
  }

  function ensureWorkspaceHomePlacement(){
    if(!isWorkspace())return;
    $('#sv24-home')?.style.setProperty('display','none','important');

    let wrap=$('.v36-shell-controls');
    let home=$('#v36-shell-home');
    let lang=$('#v36-language');
    const anchor=findVisibleLanguageAnchor();

    if(!wrap && anchor){
      wrap=document.createElement('div');wrap.className='v36-shell-controls';
      home=document.createElement('button');home.id='v36-shell-home';home.type='button';home.innerHTML='⌂ <span>Home</span>';
      home.onclick=()=>{location.hash='';};
      lang=document.createElement('select');lang.id='v36-language';
      const langs=[['nl','Nederlands'],['en','English'],['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],['it','Italiano'],['srn','Sranan Tongo'],['ar','العربية'],['hi','हिन्दी'],['zh','中文'],['ja','日本語'],['ko','한국어'],['id','Bahasa Indonesia'],['tr','Türkçe'],['pl','Polski'],['sw','Kiswahili']];
      lang.innerHTML=langs.map(([v,n])=>`<option value="${v}">${n}</option>`).join('');
      lang.value=localStorage.getItem('scholark_ui_language')||'nl';
      lang.onchange=()=>{localStorage.setItem('scholark_ui_language',lang.value);document.documentElement.lang=lang.value;window.dispatchEvent(new CustomEvent('scholark-language-change',{detail:{code:lang.value}}));};
      wrap.append(home,lang);
      anchor.parentElement?.insertBefore(wrap,anchor);
      anchor.style.setProperty('display','none','important');
    } else if(wrap){
      if(home&&wrap.firstElementChild!==home)wrap.prepend(home);
      if(home&&lang&&home.nextElementSibling!==lang)home.insertAdjacentElement('afterend',lang);
      if(anchor&&wrap.parentElement!==anchor.parentElement)anchor.parentElement?.insertBefore(wrap,anchor);
      if(anchor)anchor.style.setProperty('display','none','important');
    }
  }

  function pricingMarkup(){
    return `<div class="v38-price-head"><small>SCHOLARK PLANS</small><h2>Kies hoeveel voorsprong je wilt.</h2><p>Start gratis of probeer Plus en Pro 7 dagen gratis. Pro is de volledige SCHOLARK creator-, Future- en long-form ervaring.</p></div>
      <div class="v38-price-grid">
        <article class="v38-plan"><div class="v38-kicker">FREE</div><h3>SCHOLARK Free</h3><div class="v38-desc">Voor dagelijks leren, oefenen en plannen.</div><div class="v38-price">$0 <small>/ month</small></div><div class="v38-trial">Geen betaalmethode nodig.</div><ul><li>AI Tutor</li><li>Adaptive practice & mastery</li><li>Planner, goals & study choice</li><li>100 AI text requests per day</li><li>8 AI images per day</li></ul><button data-plan="free">Start free</button></article>
        <article class="v38-plan plus"><div class="v38-kicker">PLUS</div><h3>SCHOLARK Plus</h3><div class="v38-desc">Voor creators die Studio AI regelmatig gebruiken.</div><div class="v38-price">$14.99 <small>/ month</small></div><div class="v38-trial">7 days free, then $14.99/month. Cancel anytime.</div><ul><li>Everything in Free</li><li>Presentation, Webpage, Document, Social & Graphic Studio</li><li>Max 4 active creations per Studio type</li><li>Natural Rewrite — 2 uses per day</li><li>Research with web sources</li><li>350 AI text requests per day</li><li>25 AI images per day</li></ul><button data-plan="plus">Start Plus free trial</button></article>
        <article class="v38-plan pro"><span class="v38-most">MOST POPULAR</span><div class="v38-kicker">PRO</div><h3>SCHOLARK Pro</h3><div class="v38-desc">Voor maximale AI-kwaliteit, grote projecten en een studievoorsprong.</div><div class="v38-price">$19.99 <small>/ month</small></div><div class="v38-trial">7 days free, then $19.99/month. Cancel anytime.</div><ul><li>Everything in Plus</li><li>Highest-quality SCHOLARK AI</li><li>Unlimited Studio creations</li><li>Unlimited Natural Rewrite</li><li>Presentations up to 100 slides</li><li>Documents & reports up to 100 pages</li><li>Book Studio up to 900,000 words</li><li>All book/story genres + custom genre blends</li><li>Schools Near Me + Study Ahead</li><li>Advanced research & source checking</li><li>1,000 AI text requests per day</li><li>60 AI images per day</li></ul><button data-plan="pro">Start Pro free trial</button></article>
      </div>`;
  }

  function injectHomePricing(){
    if(!isPublicHome()){ $('#v38-home-pricing')?.remove(); return; }
    if($('#v38-home-pricing'))return;
    const layer=$('#v29-home-layer');if(!layer)return;
    const section=document.createElement('section');section.id='v38-home-pricing';section.innerHTML=pricingMarkup();
    const finalCta=$('.v29-final,.v29-final-cta,[class*="final-cta"]',layer);
    if(finalCta)layer.insertBefore(section,finalCta);else layer.appendChild(section);
    $$('[data-plan]',section).forEach(btn=>btn.onclick=()=>{
      const plan=btn.dataset.plan;
      localStorage.setItem('scholark_selected_plan',plan);
      if(plan==='free'){location.hash='dashboard';return;}
      location.hash='pricing';
    });
  }

  function cleanup(){
    $('#v37-pro-suite')?.remove();
    if(isWorkspace())ensureWorkspaceHomePlacement();
    injectHomePricing();
  }

  new MutationObserver(()=>{clearTimeout(window.__v38t);window.__v38t=setTimeout(cleanup,70)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(cleanup,30));
  addEventListener('resize',()=>setTimeout(cleanup,60));
  setInterval(cleanup,600);setTimeout(cleanup,80);
})();