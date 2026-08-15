(() => {
  if (window.__SCHOLARK_V40_STABLE_SHELL__) return;
  window.__SCHOLARK_V40_STABLE_SHELL__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const workspaceHash=()=>/dashboard|studio|presentation|document|report|poster|tutor|planner|progress|goal|project|education/.test((location.hash||'').toLowerCase());
  const publicHome=()=>!workspaceHash()&&!/pricing/.test((location.hash||'').toLowerCase());

  const LANGS=[['nl','Nederlands'],['en','English'],['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],['it','Italiano'],['srn','Sranan Tongo'],['ar','العربية'],['hi','हिन्दी'],['zh','中文'],['ja','日本語'],['ko','한국어'],['id','Bahasa Indonesia'],['tr','Türkçe'],['pl','Polski'],['sw','Kiswahili']];
  const LANG_NAMES=LANGS.map(x=>x[1].toLowerCase());

  const style=document.createElement('style');
  style.id='scholark-v40-style';
  style.textContent=`
    #sv24-home,#sv24-launch,#v37-sidebar-pro,#v39-sidebar-pro,#v37-home-pricing,#v39-home-pricing,#v39-top-controls{display:none!important}
    body.v40-public-home #v26-sidebar-toggle,body.v40-public-home #v40-workspace-home{display:none!important}
    body.v40-public-home #v29-home-layer{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;inset:auto!important;z-index:auto!important;width:100%!important;min-height:100vh!important;overflow:visible!important}
    body.v40-public-home .v40-workspace-only{display:none!important}
    body.v40-sidebar-closed .v40-sidebar-shell{display:none!important;width:0!important;min-width:0!important;max-width:0!important;overflow:hidden!important}
    body.v40-sidebar-closed .v40-workspace-main{margin-left:0!important;width:100%!important;max-width:none!important;flex:1 1 100%!important}
    #v40-workspace-home{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 11px;margin:0 8px 0 0;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:#232630;color:#fff;font:850 10px/1 Inter,system-ui;cursor:pointer;white-space:nowrap}
    #v40-workspace-home .house{font-size:13px;line-height:1}
    #v26-sidebar-toggle{position:fixed!important;z-index:2147483642!important;top:92px;width:38px;height:38px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:#17191f;color:#fff;box-shadow:0 12px 30px rgba(0,0,0,.25);cursor:pointer;font:900 18px Inter,system-ui;display:grid;place-items:center}
    #v40-home-pricing{max-width:1240px;margin:82px auto 72px;padding:0 28px;box-sizing:border-box;color:#17191f}
    .v40-price-head{text-align:center;max-width:780px;margin:0 auto 30px}.v40-price-head small{font:900 10px/1 Inter;letter-spacing:.14em;color:#6d5dfc}.v40-price-head h2{font:950 clamp(38px,5vw,68px)/.95 Inter;margin:10px 0 14px;letter-spacing:-.05em}.v40-price-head p{font:600 14px/1.55 Inter;color:#716d78}
    .v40-price-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.v40-plan{position:relative;border-radius:30px;padding:28px;border:1px solid rgba(23,25,31,.12);background:#fff;box-shadow:0 22px 70px rgba(29,24,62,.08);min-height:650px;display:flex;flex-direction:column;transition:.35s ease}.v40-plan.plus{background:#17191f;color:#fff}.v40-plan.pro{background:linear-gradient(155deg,#2a2357,#111319 68%);color:#fff;border:2px solid #c9ff6a;box-shadow:0 28px 85px rgba(46,34,101,.24)}.v40-plan.v40-spotlight{transform:translateY(-10px) scale(1.012);box-shadow:0 30px 95px rgba(68,47,152,.24)}
    .v40-kicker{font:950 10px/1 Inter;letter-spacing:.14em;color:#7d7887}.plus .v40-kicker,.pro .v40-kicker{color:#c9ff6a}.v40-plan h3{font:950 30px/1 Inter;margin:13px 0 8px}.v40-desc{font:600 12px/1.5 Inter;opacity:.72;min-height:38px}.v40-price{font:950 52px/1 Inter;margin:24px 0 20px}.v40-price small{font:700 11px Inter;opacity:.62}.v40-trial{font:800 10px/1.45 Inter;margin:-8px 0 18px;color:#635e6c}.plus .v40-trial,.pro .v40-trial{color:#d7d3df}.v40-plan ul{list-style:none;padding:0;margin:0 0 24px}.v40-plan li{font:680 11.5px/1.45 Inter;padding:7px 0;border-bottom:1px solid rgba(130,130,140,.13)}.v40-plan li:before{content:'✓';font-weight:1000;margin-right:7px;color:#6d5dfc}.plus li:before,.pro li:before{color:#c9ff6a}.v40-plan button{margin-top:auto;border:0;border-radius:15px;padding:14px 16px;font:950 12px Inter;cursor:pointer;background:#ececf1;color:#17191f}.plus button,.pro button{background:#c9ff6a;color:#111}.v40-most{position:absolute;right:18px;top:18px;background:#c9ff6a;color:#111;border-radius:999px;padding:7px 10px;font:950 8px Inter;letter-spacing:.06em;animation:v40pulse 2.4s ease-in-out infinite}@keyframes v40pulse{50%{transform:scale(1.06);box-shadow:0 0 0 8px rgba(201,255,106,.08)}}
    #v40-sidebar-pro{margin:14px 10px 8px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08)}#v40-sidebar-pro .title{padding:0 10px 7px;color:#8d8997;font:900 8px/1 Inter;letter-spacing:.14em}.v40-side-btn{width:100%;border:0;background:transparent;color:#dedbe5;border-radius:10px;padding:9px 10px;margin:2px 0;display:flex;align-items:center;gap:9px;text-align:left;cursor:pointer;font:750 10.5px/1.2 Inter}.v40-side-btn:hover{background:rgba(201,255,106,.09);color:#fff}.v40-side-btn em{margin-left:auto;font:900 7px Inter;background:#c9ff6a;color:#17191f;border-radius:999px;padding:4px 5px;font-style:normal}
    #v40-studio-note{margin:0 30px 14px;padding:12px 14px;border-radius:15px;background:linear-gradient(100deg,#17191f,#30275d);color:#fff;font:700 11px/1.45 Inter}.v40-lime{color:#c9ff6a;font-weight:900}#sv24-overlay .sv24-modes{grid-template-columns:repeat(6,minmax(0,1fr))!important}
    @media(max-width:900px){.v40-price-grid{grid-template-columns:1fr}#v40-home-pricing{padding:0 16px}.v40-plan.v40-spotlight{transform:none}#sv24-overlay .sv24-modes{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
  `;
  document.head.appendChild(style);

  $('#sv24-home')?.remove();
  $('#sv24-launch')?.remove();

  const state={sidebar:null,main:null,topbar:null,homeLayer:null,pricingTimer:null};

  function scoreNav(el){const t=lower(el);return ['dashboard','studio ai','ai tutor','planner','voortgang','progress','doelen','goals','onderwijs & leren','education & learning','mijn projecten','my projects'].reduce((n,x)=>n+(t.includes(x)?1:0),0)}
  function findSidebar(){
    const candidates=$$('aside,nav,section,div').map(el=>({el,r:el.getBoundingClientRect(),s:scoreNav(el),t:lower(el)})).filter(o=>o.s>=4&&o.r.left<90&&o.r.width>=170&&o.r.width<=430&&o.r.height>Math.min(420,innerHeight*.55));
    candidates.sort((a,b)=>(b.r.height*b.r.width)-(a.r.height*a.r.width));
    if(!candidates[0])return null;
    let shell=candidates[0].el,cur=shell;
    while(cur.parentElement&&cur.parentElement!==document.body){const p=cur.parentElement,r=p.getBoundingClientRect();if(r.left<90&&r.width>=170&&r.width<=450&&r.height>=shell.getBoundingClientRect().height*.9&&scoreNav(p)>=4){shell=p;cur=p;}else break;}
    return shell;
  }
  function findMain(side){
    if(!side)return $('main,[role="main"]');
    const p=side.parentElement;if(p){const c=[...p.children].filter(x=>x!==side&&x.id!=='v29-home-layer').map(el=>({el,r:el.getBoundingClientRect()})).filter(o=>o.r.width>400&&o.r.height>300).sort((a,b)=>b.r.width-a.r.width);if(c[0])return c[0].el;}
    return $('main,[role="main"]');
  }
  function findTopbar(){
    const terms=['uitloggen','log out','focusmodus','focus mode','demo resetten','reset demo','online'];
    return $$('header,nav,section,div').map(el=>({el,r:el.getBoundingClientRect(),t:lower(el)})).filter(o=>o.r.top<110&&o.r.width>innerWidth*.55&&o.r.height>=40&&o.r.height<=135&&terms.filter(x=>o.t.includes(x)).length>=2).sort((a,b)=>a.r.height-b.r.height)[0]?.el||null;
  }
  function findLanguage(top){
    if(!top)return null;
    const select=$('#v36-language',top);if(select)return select;
    return $$('select,button,a,span,div',top).map(el=>({el,r:el.getBoundingClientRect(),t:lower(el)})).filter(o=>o.r.width>28&&o.r.height>15&&LANG_NAMES.some(n=>o.t===n||o.t.endsWith(' '+n)||o.t.includes(n))).sort((a,b)=>(a.r.width*a.r.height)-(b.r.width*b.r.height))[0]?.el||null;
  }
  function cacheWorkspace(){
    state.sidebar=findSidebar()||state.sidebar;state.main=findMain(state.sidebar)||state.main;state.topbar=findTopbar()||state.topbar;state.homeLayer=$('#v29-home-layer')||state.homeLayer;
    state.sidebar?.classList.add('v40-sidebar-shell','v40-workspace-only');state.main?.classList.add('v40-workspace-main','v40-workspace-only');state.topbar?.classList.add('v40-workspace-only');
  }

  function ensureHomeButton(){
    if(!workspaceHash())return;
    cacheWorkspace();
    $('#sv24-home')?.remove();
    $$('#v36-shell-home').forEach(x=>x.remove());
    let btn=$('#v40-workspace-home');if(!btn){btn=document.createElement('button');btn.id='v40-workspace-home';btn.type='button';btn.innerHTML='<span class="house">⌂</span><span>Home</span>';btn.onclick=goHome;}
    const lang=findLanguage(state.topbar);
    if(lang?.parentElement){if(btn.parentElement!==lang.parentElement||btn.nextSibling!==lang)lang.parentElement.insertBefore(btn,lang);}
    else if(state.topbar&&!btn.parentElement)state.topbar.insertBefore(btn,state.topbar.firstChild);
  }

  function setupSidebar(){
    if(!workspaceHash())return;cacheWorkspace();if(!state.sidebar)return;
    let old=$('#v26-sidebar-toggle');if(old&&!old.dataset.v40owned){const n=old.cloneNode(false);n.id='v26-sidebar-toggle';old.replaceWith(n);old=n;}if(!old){old=document.createElement('button');old.id='v26-sidebar-toggle';document.body.appendChild(old);}old.dataset.v40owned='1';
    const apply=closed=>{document.body.classList.toggle('v40-sidebar-closed',closed);localStorage.setItem('scholark_sidebar_closed',closed?'1':'0');if(!closed){['display','transform','opacity','pointer-events','width','min-width','max-width','flex','flex-basis','overflow'].forEach(k=>state.sidebar.style.removeProperty(k));if(state.main)['margin-left','width','max-width','flex','flex-basis'].forEach(k=>state.main.style.removeProperty(k));}old.textContent=closed?'☰':'‹';old.title=closed?'Open sidebar':'Sluit sidebar';old.style.left=closed?'12px':Math.max(12,(state.sidebar.getBoundingClientRect().width||280)-20)+'px';};
    old.onclick=e=>{e.preventDefault();e.stopPropagation();apply(!document.body.classList.contains('v40-sidebar-closed'));};
    apply(localStorage.getItem('scholark_sidebar_closed')==='1');
  }

  function ensureLanguageOptions(){
    const sel=$('#v36-language');if(!sel)return;
    const existing=[...sel.options].map(o=>o.value);if(LANGS.every(([v])=>existing.includes(v)))return;
    const current=sel.value||localStorage.getItem('scholark_ui_language')||'nl';sel.innerHTML=LANGS.map(([v,n])=>`<option value="${v}">${n}</option>`).join('');sel.value=LANGS.some(([v])=>v===current)?current:'nl';
  }

  function openProTool(tool){const direct=$(`[data-tool="${tool}"]`);if(direct){direct.click();return;}const ov=$('#sv24-overlay');if(ov){ov.classList.add('open');setTimeout(()=>document.querySelector(`[data-tool="${tool}"]`)?.click(),80);}}
  function injectProTools(){
    if(!workspaceHash())return;cacheWorkspace();if(!state.sidebar)return;let inner=$$('nav,section,div',state.sidebar).filter(x=>scoreNav(x)>=4).sort((a,b)=>scoreNav(b)-scoreNav(a))[0]||state.sidebar;let box=$('#v40-sidebar-pro');if(box&&box.parentElement!==inner){box.remove();box=null;}if(box)return;box=document.createElement('div');box.id='v40-sidebar-pro';box.innerHTML='<div class="title">PRO TOOLS</div><button class="v40-side-btn" data-v40="book">📚 <span>Book Studio</span><em>PRO</em></button><button class="v40-side-btn" data-v40="schools">⌖ <span>Schools Near Me</span><em>PRO</em></button><button class="v40-side-btn" data-v40="study">↗ <span>Study Ahead</span><em>PRO</em></button>';inner.appendChild(box);$('[data-v40="book"]',box).onclick=()=>openProTool('book');$('[data-v40="schools"]',box).onclick=()=>openProTool('schools');$('[data-v40="study"]',box).onclick=()=>openProTool('study');
  }

  const EXAMPLES={
    presentation:['Maak een 25-dia presentatie over klimaatverandering met betrouwbare bronnen, grafieken, tijdlijn en conclusie.','Bouw een NBA GOAT-debat met statistieken, argumenten voor/tegen, visuals en een sterke eindconclusie.','Maak een universitaire pitchdeck met speaker notes, citations en een consistente visuele stijl.'],
    webpage:['Bouw een complete responsive landing page met hero, features, testimonials, FAQ en CTA.','Maak een portfolio-website met meerdere secties, projecten, over-mij en contact.','Maak een schoolproject-webpagina met bronnen, visuals en interactieve secties.'],
    document:['Schrijf een volledig onderzoeksverslag van 30 pagina’s met inhoudsopgave, hoofdstukken, bronverwijzingen en conclusie.','Maak een professioneel business report met executive summary, analyse, tabellen en aanbevelingen.','Schrijf een academisch essay met argumenten, tegenargumenten en gecontroleerde bronnen.'],
    social:['Maak een 8-slide Instagram carousel met hook, kernpunten, visuals en CTA.','Maak een LinkedIn-campagne met posts, carousels en captions voor een productlaunch.','Bouw een TikTok/Instagram contentserie met hooks, scripts, captions en shot-ideeën.'],
    graphic:['Ontwerp een high-impact poster met duidelijke hiërarchie, visuals, datum, locatie en CTA.','Maak een infographic met data, iconen, grafieken en korte uitleg.','Maak een professioneel procesdiagram met stappen, beslispunten en labels.']
  };
  function setCount(mode){const c=$('#sv24-count');if(!c)return;if(mode==='presentation'){c.innerHTML=[5,10,15,20,30,40,50,60,75,100].map(n=>`<option value="${n}">${n} dia’s${n===100?' — PRO max':''}</option>`).join('');}else if(mode==='document'){c.innerHTML=[1,2,3,5,10,15,20,30,40,50,75,100].map(n=>`<option value="${n}">${n} pagina’s${n===100?' — PRO max':''}</option>`).join('');}}
  function enhanceStudio(mode){
    const ov=$('#sv24-overlay');if(!ov)return;const modes=$('.sv24-modes',ov);if(!modes)return;
    let b=$('#v40-book-mode',modes);if(!b){b=document.createElement('button');b.id='v40-book-mode';b.className='sv24-mode';b.dataset.mode='book';b.innerHTML='<b>📚</b>Book Studio';b.onclick=e=>{e.preventDefault();e.stopPropagation();ov.classList.remove('open');openProTool('book');};modes.appendChild(b);}
    const modal=$('.sv24-modal',ov);if(modal&&!$('#v40-studio-note',modal)){const n=document.createElement('div');n.id='v40-studio-note';n.innerHTML='<span class="v40-lime">PRO:</span> presentaties tot 100 dia’s • documenten/verslagen tot 100 pagina’s • Book Studio tot 900.000 woorden • alle genres + custom genre blends.';modal.insertBefore(n,$('.sv24-body',ov));}
    const active=mode||$('.sv24-mode.active',modes)?.dataset.mode||'presentation';if(active!=='book'&&EXAMPLES[active]){const ex=$('.sv24-examples',ov);if(ex){ex.innerHTML=EXAMPLES[active].map(x=>`<button class="sv24-example">${x}</button>`).join('');$$('.sv24-example',ex).forEach(x=>x.onclick=()=>{const p=$('#sv24-prompt');p.value=x.textContent;p.focus();});}setCount(active);}
  }

  function interceptStudio(){
    if(document.documentElement.dataset.v40Studio)return;document.documentElement.dataset.v40Studio='1';
    document.addEventListener('click',e=>{
      if(publicHome()||e.target.closest('#sv24-overlay'))return;
      let el=e.target;let matched=null;for(let i=0;el&&i<6;el=el.parentElement,i++){if(/^(studio ai|ai studio)$/i.test(text(el))){matched=el;break;}if(state.sidebar&&el===state.sidebar)break;}
      if(!matched)return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      const ov=$('#sv24-overlay');if(ov){enhanceStudio('presentation');ov.classList.add('open');}
    },true);
    document.addEventListener('click',e=>{const m=e.target.closest('.sv24-mode');if(m&&m.dataset.mode!=='book')setTimeout(()=>enhanceStudio(m.dataset.mode),25);},true);
  }

  function pricingMarkup(){return `<div class="v40-price-head"><small>SCHOLARK PLANS</small><h2>Kies hoeveel voorsprong je wilt.</h2><p>De prijzen horen bij dezelfde levende SCHOLARK-homepage. Plus en Pro hebben een 7-daagse proefperiode; Pro bevat de volledige creator-, Future- en long-form ervaring.</p></div><div class="v40-price-grid"><article class="v40-plan"><div class="v40-kicker">FREE</div><h3>SCHOLARK Free</h3><div class="v40-desc">Voor dagelijks leren, oefenen en plannen.</div><div class="v40-price">$0 <small>/ month</small></div><div class="v40-trial">Geen betaalmethode nodig.</div><ul><li>AI Tutor</li><li>Adaptive practice & mastery</li><li>Planner, goals & study choice</li><li>100 AI text requests per day</li><li>8 AI images per day</li></ul><button data-plan="free">Start free</button></article><article class="v40-plan plus"><div class="v40-kicker">PLUS</div><h3>SCHOLARK Plus</h3><div class="v40-desc">Voor creators die Studio AI regelmatig gebruiken.</div><div class="v40-price">$14.99 <small>/ month</small></div><div class="v40-trial">7 days free, then $14.99/month. Cancel anytime.</div><ul><li>Everything in Free</li><li>Presentation, Webpage, Document, Social & Graphic Studio</li><li>Max 4 active creations per Studio type</li><li>Natural Rewrite — 2 uses per day</li><li>Research with web sources</li><li>350 AI text requests per day</li><li>25 AI images per day</li></ul><button data-plan="plus">Start Plus free trial</button></article><article class="v40-plan pro"><span class="v40-most">MOST POPULAR</span><div class="v40-kicker">PRO</div><h3>SCHOLARK Pro</h3><div class="v40-desc">Voor maximale AI-kwaliteit, grote projecten en een studievoorsprong.</div><div class="v40-price">$19.99 <small>/ month</small></div><div class="v40-trial">7 days free, then $19.99/month. Cancel anytime.</div><ul><li>Everything in Plus</li><li>Highest-quality SCHOLARK AI</li><li>Unlimited Studio creations + Natural Rewrite</li><li>Presentations up to 100 slides</li><li>Documents & reports up to 100 pages</li><li>Book Studio up to 900,000 words</li><li>All book/story genres + custom genre blends</li><li>Schools Near Me + Study Ahead</li><li>Advanced research & source checking</li><li>1,000 AI text requests per day</li><li>60 AI images per day</li></ul><button data-plan="pro">Start Pro free trial</button></article></div>`;}
  function ensurePricing(){
    const layer=$('#v29-home-layer');if(!layer)return;let p=$('#v40-home-pricing');if(!p){p=document.createElement('section');p.id='v40-home-pricing';p.innerHTML=pricingMarkup();const final=$('.v29-final,.v29-final-cta,[class*="final-cta"]',layer);if(final)layer.insertBefore(p,final);else layer.appendChild(p);$$('[data-plan]',p).forEach(b=>b.onclick=()=>{const plan=b.dataset.plan;localStorage.setItem('scholark_selected_plan',plan);location.hash=plan==='free'?'dashboard':'pricing';});}
    if(!state.pricingTimer){let i=0;state.pricingTimer=setInterval(()=>{const cards=$$('.v40-plan',p);cards.forEach(x=>x.classList.remove('v40-spotlight'));cards[(i++%2)+1]?.classList.add('v40-spotlight');},3200);}
  }

  function hideWorkspaceForHome(){cacheWorkspace();document.body.classList.add('v40-public-home');document.body.classList.remove('v40-sidebar-closed');$('#v26-sidebar-toggle')?.style.setProperty('display','none','important');$('#v40-workspace-home')?.style.setProperty('display','none','important');const layer=$('#v29-home-layer');if(layer){if(layer.parentElement!==document.body)document.body.appendChild(layer);layer.hidden=false;layer.style.setProperty('display','block','important');layer.style.setProperty('visibility','visible','important');layer.style.setProperty('opacity','1','important');}ensurePricing();}
  function showWorkspace(){document.body.classList.remove('v40-public-home');cacheWorkspace();if(state.sidebar)state.sidebar.classList.remove('v40-workspace-only');if(state.main)state.main.classList.remove('v40-workspace-only');if(state.topbar)state.topbar.classList.remove('v40-workspace-only');const layer=$('#v29-home-layer');if(layer){layer.hidden=true;layer.style.setProperty('display','none','important');}$('#v26-sidebar-toggle')?.style.removeProperty('display');ensureHomeButton();ensureLanguageOptions();setupSidebar();injectProTools();enhanceStudio();}
  function goHome(){history.pushState(null,'',location.pathname);hideWorkspaceForHome();scrollTo({top:0,behavior:'instant'});}

  function sync(){
    $('#sv24-home')?.remove();$('#sv24-launch')?.remove();$('#v37-home-pricing')?.remove();$('#v39-home-pricing')?.remove();
    if(publicHome())hideWorkspaceForHome();else if(workspaceHash())showWorkspace();
  }

  interceptStudio();
  new MutationObserver(()=>{clearTimeout(window.__v40sync);window.__v40sync=setTimeout(sync,80)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,20));addEventListener('popstate',()=>setTimeout(sync,20));addEventListener('resize',()=>setTimeout(sync,60));
  setInterval(sync,700);setTimeout(sync,120);
})();
