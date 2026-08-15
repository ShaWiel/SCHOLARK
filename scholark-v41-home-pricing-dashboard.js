(() => {
  if (window.__SCHOLARK_V41_STABLE_SHELL__) return;
  window.__SCHOLARK_V41_STABLE_SHELL__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const h=()=> (location.hash||'').toLowerCase();
  const workspace=()=>/dashboard|studio|presentation|document|report|poster|tutor|planner|progress|goal|project|education|book|schools|study/.test(h());
  const publicHome=()=>!workspace()&&!/pricing/.test(h());

  const style=document.createElement('style');
  style.id='scholark-v41-style';
  style.textContent=`
    #sv24-home,#sv24-launch,#v34-dashboard-entry,#v36-shell-home,#v40-workspace-home,#v26-sidebar-toggle,#v37-home-pricing,#v39-home-pricing,#v40-home-pricing,#v37-pro-suite{display:none!important}
    body.v41-home #v29-home-layer{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;inset:auto!important;z-index:auto!important;width:100%!important;min-height:100vh!important;overflow:visible!important}
    body.v41-home [data-v30-legacy-home="1"],body.v41-home .v41-workspace-shell{display:none!important}
    #v41-dashboard-entry{position:fixed;top:18px;right:28px;z-index:2147483642;border:0;border-radius:14px;padding:11px 17px;background:#17191f;color:#fff;font:900 11px/1 Inter,system-ui;box-shadow:0 12px 34px rgba(0,0,0,.18);cursor:pointer}
    #v41-dashboard-entry b{color:#c9ff6a;margin-right:6px}
    #v41-workspace-home{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 11px;margin:0 8px 0 0;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:#232630;color:#fff;font:850 10px/1 Inter,system-ui;cursor:pointer;white-space:nowrap}
    #v41-sidebar-toggle{position:fixed;z-index:2147483642;top:92px;width:38px;height:38px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:#17191f;color:#fff;box-shadow:0 12px 30px rgba(0,0,0,.25);cursor:pointer;font:900 18px Inter,system-ui;display:grid;place-items:center}
    body.v41-sidebar-closed .v41-sidebar-shell{display:none!important;width:0!important;min-width:0!important;max-width:0!important;overflow:hidden!important}
    body.v41-sidebar-closed .v41-workspace-main{margin-left:0!important;width:100%!important;max-width:none!important;flex:1 1 100%!important}
    #v41-home-pricing{max-width:1240px;margin:86px auto 72px;padding:0 28px;box-sizing:border-box;color:#17191f;display:block!important;visibility:visible!important;opacity:1!important}
    .v41-price-head{text-align:center;max-width:790px;margin:0 auto 30px}.v41-price-head small{font:900 10px/1 Inter;letter-spacing:.14em;color:#6d5dfc}.v41-price-head h2{font:950 clamp(38px,5vw,68px)/.95 Inter;margin:10px 0 14px;letter-spacing:-.05em}.v41-price-head p{font:600 14px/1.55 Inter;color:#716d78}
    .v41-price-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.v41-plan{position:relative;border-radius:30px;padding:28px;border:1px solid rgba(23,25,31,.12);background:#fff;box-shadow:0 22px 70px rgba(29,24,62,.08);min-height:650px;display:flex;flex-direction:column;transition:.4s ease}.v41-plan.plus{background:#17191f;color:#fff}.v41-plan.pro{background:linear-gradient(155deg,#2a2357,#111319 68%);color:#fff;border:2px solid #c9ff6a}.v41-plan.v41-focus{transform:translateY(-10px) scale(1.012);box-shadow:0 30px 95px rgba(68,47,152,.24)}
    .v41-kicker{font:950 10px/1 Inter;letter-spacing:.14em;color:#7d7887}.plus .v41-kicker,.pro .v41-kicker{color:#c9ff6a}.v41-plan h3{font:950 30px/1 Inter;margin:13px 0 8px}.v41-desc{font:600 12px/1.5 Inter;opacity:.72;min-height:38px}.v41-price{font:950 52px/1 Inter;margin:24px 0 20px}.v41-price small{font:700 11px Inter;opacity:.62}.v41-trial{font:800 10px/1.45 Inter;margin:-8px 0 18px;color:#635e6c}.plus .v41-trial,.pro .v41-trial{color:#d7d3df}.v41-plan ul{list-style:none;padding:0;margin:0 0 24px}.v41-plan li{font:680 11.5px/1.45 Inter;padding:7px 0;border-bottom:1px solid rgba(130,130,140,.13)}.v41-plan li:before{content:'✓';font-weight:1000;margin-right:7px;color:#6d5dfc}.plus li:before,.pro li:before{color:#c9ff6a}.v41-plan button{margin-top:auto;border:0;border-radius:15px;padding:14px 16px;font:950 12px Inter;cursor:pointer;background:#ececf1;color:#17191f}.plus button,.pro button{background:#c9ff6a;color:#111}.v41-most{position:absolute;right:18px;top:18px;background:#c9ff6a;color:#111;border-radius:999px;padding:7px 10px;font:950 8px Inter;animation:v41pulse 2.4s ease-in-out infinite}@keyframes v41pulse{50%{transform:scale(1.06);box-shadow:0 0 0 8px rgba(201,255,106,.08)}}
    #v41-sidebar-pro{margin:14px 10px 8px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08)}#v41-sidebar-pro .title{padding:0 10px 7px;color:#8d8997;font:900 8px/1 Inter;letter-spacing:.14em}.v41-side{width:100%;border:0;background:transparent;color:#dedbe5;border-radius:10px;padding:9px 10px;margin:2px 0;display:flex;align-items:center;gap:9px;text-align:left;cursor:pointer;font:750 10.5px/1.2 Inter}.v41-side:hover{background:rgba(201,255,106,.09);color:#fff}.v41-side em{margin-left:auto;font:900 7px Inter;background:#c9ff6a;color:#17191f;border-radius:999px;padding:4px 5px;font-style:normal}
    #v41-studio-note{margin:0 30px 14px;padding:12px 14px;border-radius:15px;background:linear-gradient(100deg,#17191f,#30275d);color:#fff;font:700 11px/1.45 Inter}.v41-lime{color:#c9ff6a;font-weight:900}#sv24-overlay .sv24-modes{grid-template-columns:repeat(6,minmax(0,1fr))!important}
    @media(max-width:900px){.v41-price-grid{grid-template-columns:1fr}#v41-home-pricing{padding:0 16px}.v41-plan.v41-focus{transform:none}#sv24-overlay .sv24-modes{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
  `;
  document.head.appendChild(style);

  const findLegacy=()=> $('[data-v30-legacy-home="1"]') || $$('main,section,div').find(el=>!el.closest('#v29-home-layer')&&/dashboard/i.test(text(el))&&el.getBoundingClientRect().width>500);
  function setHomeVisible(show){
    const layer=$('#v29-home-layer'); const legacy=findLegacy();
    document.body.classList.toggle('v41-home',show);
    if(layer){layer.hidden=!show;layer.style.setProperty('display',show?'block':'none','important');}
    if(legacy){legacy.classList.add('v41-workspace-shell');legacy.hidden=show;if(show)legacy.style.setProperty('display','none','important');else legacy.style.removeProperty('display');}
  }

  function ensureDashboardButton(){
    let b=$('#v41-dashboard-entry');
    if(!b){b=document.createElement('button');b.id='v41-dashboard-entry';b.innerHTML='<b>↗</b> Dashboard';b.onclick=()=>openWorkspace();document.body.appendChild(b);}
    b.hidden=!publicHome(); b.style.display=publicHome()?'block':'none';
  }

  function openWorkspace(){
    setHomeVisible(false);
    history.replaceState(null,'',location.pathname+location.search+'#dashboard');
    document.body.classList.remove('v41-home');
    setTimeout(()=>{
      const side=findSidebarInner(); const item=side&&$$('button,a,[role="button"],div',side).find(el=>/^dashboard$/i.test(text(el)));
      try{item?.click()}catch{}
      ensureWorkspaceChrome();
    },80);
  }

  function openHome(){
    history.replaceState(null,'',location.pathname+location.search);
    setHomeVisible(true);
    document.body.classList.remove('v41-sidebar-closed');
    $('#v41-sidebar-toggle')?.remove();
    ensurePricing(); ensureDashboardButton();
  }

  function findTopbar(){const terms=['uitloggen','log out','focusmodus','focus mode','demo resetten','reset demo'];return $$('header,nav,section,div').map(el=>({el,r:el.getBoundingClientRect(),t:lower(el)})).filter(o=>o.r.top<130&&o.r.height>=36&&o.r.height<=140&&o.r.width>innerWidth*.45&&terms.some(x=>o.t.includes(x))).sort((a,b)=>a.r.height-b.r.height)[0]?.el||null;}
  function findLanguage(top){return top&&$$('button,a,span,div,select',top).map(el=>({el,r:el.getBoundingClientRect(),t:lower(el)})).filter(o=>!/v41-workspace-home|v36-language/.test(o.el.id)&&o.r.width>25&&o.r.height>15&&/(nederlands|english|español|français|deutsch|português|italiano|sranan tongo|العربية|हिन्दी|中文|日本語|한국어|bahasa indonesia|türkçe|polski|kiswahili)/.test(o.t)).sort((a,b)=>a.r.width*a.r.height-b.r.width*b.r.height)[0]?.el;}
  function ensureWorkspaceHome(){
    if(!workspace())return;
    $('#sv24-home')?.remove();$('#v36-shell-home')?.remove();$('#v40-workspace-home')?.remove();
    const top=findTopbar(),lang=findLanguage(top);if(!top||!lang)return;
    let b=$('#v41-workspace-home');if(!b){b=document.createElement('button');b.id='v41-workspace-home';b.innerHTML='<span>⌂</span><span>Home</span>';b.onclick=openHome;}
    if(b.parentElement!==lang.parentElement||b.nextSibling!==lang)lang.parentElement?.insertBefore(b,lang);
  }

  function navScore(el){const t=lower(el),terms=['dashboard','studio ai','ai tutor','planner','voortgang','progress','doelen','goals','onderwijs & leren','education & learning','mijn projecten','my projects'];return terms.reduce((n,x)=>n+(t.includes(x)?1:0),0);}
  function findSidebarInner(){return $$('aside,nav,section,div').map(el=>({el,r:el.getBoundingClientRect(),score:navScore(el)})).filter(o=>o.score>=4&&o.r.width>=140&&o.r.width<=440&&o.r.height>=300&&o.r.left<120).sort((a,b)=>b.score-a.score||a.r.width-b.r.width)[0]?.el||null;}
  function findSidebarShell(inner){if(!inner)return null;let best=inner,cur=inner;while(cur.parentElement&&cur.parentElement!==document.body){const p=cur.parentElement,r=p.getBoundingClientRect();if(r.left<120&&r.width>=140&&r.width<=470&&r.height>=inner.getBoundingClientRect().height*.72){best=p;cur=p;}else break;}return best;}
  function findMain(shell){const p=shell?.parentElement;if(!p)return $('main,[role="main"]');return [...p.children].filter(x=>x!==shell).map(el=>({el,r:el.getBoundingClientRect()})).filter(o=>o.r.width>400&&o.r.height>250).sort((a,b)=>b.r.width-a.r.width)[0]?.el||$('main,[role="main"]');}
  function ensureSidebarToggle(){
    if(!workspace())return;
    const inner=findSidebarInner(),shell=findSidebarShell(inner);if(!shell)return;
    shell.classList.add('v41-sidebar-shell');const main=findMain(shell);main?.classList.add('v41-workspace-main');
    let b=$('#v41-sidebar-toggle');if(!b){b=document.createElement('button');b.id='v41-sidebar-toggle';document.body.appendChild(b);b.onclick=()=>{document.body.classList.toggle('v41-sidebar-closed');localStorage.setItem('scholark_sidebar_closed',document.body.classList.contains('v41-sidebar-closed')?'1':'0');syncSidebarButton();};}
    if(localStorage.getItem('scholark_sidebar_closed')==='1')document.body.classList.add('v41-sidebar-closed');
    syncSidebarButton();
  }
  function syncSidebarButton(){const b=$('#v41-sidebar-toggle'),shell=$('.v41-sidebar-shell');if(!b||!shell)return;const closed=document.body.classList.contains('v41-sidebar-closed');b.textContent=closed?'☰':'‹';b.title=closed?'Open sidebar':'Sluit sidebar';b.style.left=closed?'12px':Math.max(12,(shell.getBoundingClientRect().width||280)-20)+'px';}

  function openTool(tool){const d=$(`[data-tool="${tool}"]`);if(d){d.click();return;}$('#sv24-overlay')?.classList.add('open');setTimeout(()=>document.querySelector(`[data-tool="${tool}"]`)?.click(),120);}
  function ensureProTools(){const inner=findSidebarInner();if(!inner)return;let box=$('#v41-sidebar-pro');if(!box){box=document.createElement('div');box.id='v41-sidebar-pro';box.innerHTML='<div class="title">PRO TOOLS</div><button class="v41-side" data-v41="book">📚 <span>Book Studio</span><em>PRO</em></button><button class="v41-side" data-v41="schools">⌖ <span>Schools Near Me</span><em>PRO</em></button><button class="v41-side" data-v41="study">↗ <span>Study Ahead</span><em>PRO</em></button>';inner.appendChild(box);box.querySelector('[data-v41="book"]').onclick=()=>openTool('book');box.querySelector('[data-v41="schools"]').onclick=()=>openTool('schools');box.querySelector('[data-v41="study"]').onclick=()=>openTool('study');}}

  const counts={presentation:[5,10,15,20,30,40,50,60,75,100],document:[1,2,3,5,10,15,20,30,40,50,75,100]};
  const examples={presentation:['Maak een 25-dia presentatie met bronnen, grafieken, tijdlijn en speaker notes.','Bouw een 100-dia masterclass met hoofdstukken, citations en consistente visuals.'],webpage:['Bouw een complete responsive landing page met hero, features, testimonials, FAQ en CTA.','Maak een portfolio-site met meerdere secties en mobiel ontwerp.'],document:['Schrijf een research report met hoofdstukken, bronverwijzingen, tabellen en conclusie.','Maak een professioneel verslag tot 100 pagina’s met inhoudsopgave en bronnen.'],social:['Maak een 8-slide Instagram carousel met hook, story flow, CTA en caption.','Bouw een LinkedIn contentserie met visuals en copy.'],graphic:['Ontwerp een infographic met data, iconen en duidelijke visuele hiërarchie.','Maak een campagneposter met headline, CTA en passende visual direction.']};
  function replaceCount(mode){const s=$('#sv24-count');if(!s||!counts[mode])return;s.innerHTML=counts[mode].map(n=>`<option value="${n}">${n}${n===100?' — PRO max':''}</option>`).join('');}
  function replaceExamples(mode){const w=$('#sv24-overlay .sv24-examples');if(!w||!examples[mode])return;w.innerHTML=examples[mode].map(x=>`<button class="sv24-example">${x}</button>`).join('');$$('.sv24-example',w).forEach(b=>b.onclick=()=>{const p=$('#sv24-prompt');if(p)p.value=b.textContent;});}
  function ensureStudio(){
    const ov=$('#sv24-overlay');if(!ov)return;
    const modes=$('.sv24-modes',ov);if(!modes)return;
    if(!$('#v41-book-mode',modes)){const b=document.createElement('button');b.id='v41-book-mode';b.className='sv24-mode';b.dataset.mode='book';b.innerHTML='<b>📚</b>Book Studio';b.onclick=e=>{e.preventDefault();e.stopPropagation();ov.classList.remove('open');openTool('book');};modes.appendChild(b);}
    if(!$('#v41-studio-note',ov)){const n=document.createElement('div');n.id='v41-studio-note';n.innerHTML='<span class="v41-lime">PRO:</span> Presentaties tot 100 dia’s • documenten/verslagen tot 100 pagina’s • Book Studio tot 900.000 woorden • alle genres + custom genre blends.';$('.sv24-controls',ov)?.insertAdjacentElement('afterend',n);}
    $$('.sv24-mode',modes).forEach(b=>{if(b.dataset.v41)return;b.dataset.v41='1';b.addEventListener('click',()=>{const m=b.dataset.mode;if(m==='presentation'||m==='document')replaceCount(m);if(examples[m])replaceExamples(m);},true);});
    const a=$('.sv24-mode.active',modes)?.dataset.mode;if(a){if(counts[a])replaceCount(a);if(examples[a])replaceExamples(a);}
  }
  function interceptStudio(){if(document.documentElement.dataset.v41Studio)return;document.documentElement.dataset.v41Studio='1';document.addEventListener('click',e=>{const el=e.target.closest('button,a,[role="button"],div,span');if(!el||el.closest('#sv24-overlay'))return;if(/^studio ai$/i.test(text(el))){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();ensureStudio();$('#sv24-overlay')?.classList.add('open');}},true);}

  function priceMarkup(){return `<div class="v41-price-head"><small>SCHOLARK PLANS</small><h2>Kies hoeveel voorsprong je wilt.</h2><p>De prijzen horen bij dezelfde levende SCHOLARK-homepage. Pro is de volledige creator-, Future- en long-form ervaring.</p></div><div class="v41-price-grid"><article class="v41-plan"><div class="v41-kicker">FREE</div><h3>SCHOLARK Free</h3><div class="v41-desc">Voor dagelijks leren, oefenen en plannen.</div><div class="v41-price">$0 <small>/ month</small></div><div class="v41-trial">Geen betaalmethode nodig.</div><ul><li>AI Tutor</li><li>Adaptive practice & mastery</li><li>Planner, goals & study choice</li><li>100 AI text requests/day</li><li>8 AI images/day</li></ul><button data-plan="free">Start free</button></article><article class="v41-plan plus"><div class="v41-kicker">PLUS</div><h3>SCHOLARK Plus</h3><div class="v41-desc">Voor creators die Studio AI regelmatig gebruiken.</div><div class="v41-price">$14.99 <small>/ month</small></div><div class="v41-trial">7 days free, then $14.99/month.</div><ul><li>Everything in Free</li><li>Presentation, Webpage, Document, Social & Graphic</li><li>Max 4 active creations per Studio type</li><li>Natural Rewrite — 2/day</li><li>Research with web sources</li><li>350 AI text requests/day</li><li>25 AI images/day</li></ul><button data-plan="plus">Start Plus free trial</button></article><article class="v41-plan pro"><span class="v41-most">MOST POPULAR</span><div class="v41-kicker">PRO</div><h3>SCHOLARK Pro</h3><div class="v41-desc">Maximale AI-kwaliteit, grote projecten en studievoorsprong.</div><div class="v41-price">$19.99 <small>/ month</small></div><div class="v41-trial">7 days free, then $19.99/month.</div><ul><li>Everything in Plus</li><li>Highest-quality SCHOLARK AI</li><li>Unlimited Studio + Natural Rewrite</li><li>Presentations up to 100 slides</li><li>Documents/reports up to 100 pages</li><li>Book Studio up to 900,000 words</li><li>All genres + custom blends</li><li>Schools Near Me + Study Ahead</li><li>1,000 AI text requests/day</li><li>60 AI images/day</li></ul><button data-plan="pro">Start Pro free trial</button></article></div>`;}
  let priceTimer=null;
  function ensurePricing(){
    if(!publicHome())return;
    const layer=$('#v29-home-layer');if(!layer)return;
    let p=$('#v41-home-pricing');if(!p){p=document.createElement('section');p.id='v41-home-pricing';p.innerHTML=priceMarkup();const shell=$('.v29-shell',layer)||layer;const final=$('.v29-final,.v29-final-cta,[class*="final-cta"]',shell);final?shell.insertBefore(p,final):shell.appendChild(p);$$('[data-plan]',p).forEach(b=>b.onclick=()=>{localStorage.setItem('scholark_selected_plan',b.dataset.plan);location.hash=b.dataset.plan==='free'?'dashboard':'pricing';});}
    if(!priceTimer){let i=0;priceTimer=setInterval(()=>{const plans=$$('.v41-plan',p);plans.forEach(x=>x.classList.remove('v41-focus'));plans[i%plans.length]?.classList.add('v41-focus');i++;},2600);}
  }

  function wirePricingNav(){
    if(document.documentElement.dataset.v41PricingNav)return;
    document.documentElement.dataset.v41PricingNav='1';
    document.addEventListener('click',e=>{
      if(!publicHome())return;
      const el=e.target.closest('a,button,[role="button"],span');if(!el)return;
      if(/^(prijzen|pricing)$/i.test(text(el))){e.preventDefault();e.stopPropagation();ensurePricing();$('#v41-home-pricing')?.scrollIntoView({behavior:'smooth',block:'start'});}
    },true);
  }

  function ensureWorkspaceChrome(){if(!workspace())return;setHomeVisible(false);ensureWorkspaceHome();ensureSidebarToggle();ensureProTools();ensureStudio();}
  function sync(){
    if(publicHome()){setHomeVisible(true);$('#v41-workspace-home')?.remove();$('#v41-sidebar-toggle')?.remove();document.body.classList.remove('v41-sidebar-closed');ensureDashboardButton();ensurePricing();}
    else if(workspace()){ensureDashboardButton();ensureWorkspaceChrome();}
  }

  interceptStudio();wirePricingNav();
  new MutationObserver(()=>{clearTimeout(window.__v41sync);window.__v41sync=setTimeout(sync,70)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,20));addEventListener('resize',()=>setTimeout(sync,60));setInterval(sync,600);setTimeout(sync,50);
})();