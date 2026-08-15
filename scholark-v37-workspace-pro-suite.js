(() => {
  if (window.__SCHOLARK_V37_WORKSPACE_PRO_SUITE__) return;
  window.__SCHOLARK_V37_WORKSPACE_PRO_SUITE__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const txt=e=>(e?.textContent||'').trim();

  const css=document.createElement('style');
  css.id='scholark-v37-workspace-pro-style';
  css.textContent=`
    /* Put Home exactly in the workspace topbar, directly before the language control. */
    .v36-shell-controls{display:inline-flex!important;align-items:center!important;gap:8px!important;margin:0!important}
    #v36-shell-home{position:static!important;inset:auto!important;margin:0!important;height:34px!important;padding:0 12px!important;border-radius:999px!important;background:#232630!important;border:1px solid rgba(255,255,255,.14)!important;color:#fff!important;box-shadow:none!important;font:850 10px/1 Inter,system-ui!important;order:0!important}
    #v36-shell-home span{display:inline!important}
    #v36-language{position:static!important;margin:0!important;height:34px!important;order:1!important}

    #v37-sidebar-pro{margin:17px 10px 10px;padding-top:13px;border-top:1px solid rgba(255,255,255,.08)}
    #v37-sidebar-pro .v37-side-title{padding:0 10px 8px;color:#8d8997;font:900 8px/1 Inter,system-ui;letter-spacing:.14em;text-transform:uppercase}
    .v37-side-btn{width:100%;border:0;background:transparent;color:#dedbe5;border-radius:10px;padding:9px 10px;margin:2px 0;display:flex;align-items:center;gap:9px;text-align:left;cursor:pointer;font:750 10.5px/1.2 Inter,system-ui}
    .v37-side-btn:hover{background:rgba(201,255,106,.09);color:#fff}.v37-side-btn i{width:20px;height:20px;border-radius:7px;background:rgba(201,255,106,.12);display:grid;place-items:center;color:#c9ff6a;font-style:normal;font-size:11px}.v37-side-btn em{margin-left:auto;font:900 7px/1 Inter;background:#c9ff6a;color:#17191f;border-radius:999px;padding:4px 5px;font-style:normal}

    #v37-pro-suite{margin:24px 26px 28px;padding:24px;border-radius:26px;background:linear-gradient(145deg,#17191f,#292440 70%,#44388f);color:#fff;box-shadow:0 22px 60px rgba(22,18,51,.18);position:relative;overflow:hidden}
    #v37-pro-suite:after{content:'';position:absolute;width:260px;height:260px;border-radius:50%;right:-95px;top:-115px;background:#c9ff6a;opacity:.10}
    .v37-suite-head{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px}.v37-suite-head small{display:block;color:#c9ff6a;font:900 9px/1 Inter;letter-spacing:.14em;margin-bottom:7px}.v37-suite-head h2{margin:0;font:950 clamp(24px,3vw,38px)/1 Inter,system-ui;letter-spacing:-.04em}.v37-suite-head p{margin:8px 0 0;max-width:650px;color:#cbc8d6;font:600 11px/1.5 Inter,system-ui}.v37-pro-badge{white-space:nowrap;background:#c9ff6a;color:#17191f;border-radius:999px;padding:7px 10px;font:900 8px Inter}
    .v37-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
    .v37-card{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.07);color:#fff;border-radius:17px;padding:15px;text-align:left;min-height:132px;cursor:pointer;transition:.18s ease;position:relative;overflow:hidden}.v37-card:hover{transform:translateY(-2px);border-color:rgba(201,255,106,.35);background:rgba(255,255,255,.10)}.v37-card .ico{font-size:18px;margin-bottom:14px}.v37-card b{display:block;font:900 13px/1.15 Inter;margin-bottom:5px}.v37-card span{display:block;color:#bbb8c7;font:600 9px/1.45 Inter}.v37-card strong{display:block;color:#c9ff6a;font:950 20px/1 Inter;margin:8px 0 4px}.v37-card .mini{font:850 7px/1 Inter;color:#8d88a0;letter-spacing:.08em;text-transform:uppercase}
    .v37-wide{grid-column:span 2}.v37-wide .v37-inline{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.v37-pill{font:800 7.5px Inter!important;color:#17191f!important;background:#c9ff6a;border-radius:999px;padding:5px 7px;display:inline-block!important}
    @media(max-width:980px){.v37-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:620px){#v37-pro-suite{margin:16px 12px;padding:17px}.v37-grid{grid-template-columns:1fr}.v37-wide{grid-column:auto}.v37-suite-head{align-items:flex-start;flex-direction:column}}
  `;
  document.head.appendChild(css);

  function isWorkspace(){
    const h=(location.hash||'').toLowerCase();
    return h.includes('dashboard')||h.includes('studio')||h.includes('presentation')||h.includes('document')||h.includes('report')||h.includes('poster')||h.includes('tutor')||h.includes('planner')||h.includes('progress')||h.includes('goal')||h.includes('project')||h.includes('education');
  }

  function isDashboard(){ return (location.hash||'').toLowerCase().includes('dashboard'); }

  function findSidebar(){
    return $$('aside,nav,section,div').filter(el=>!el.closest('#v29-home-layer')).map(el=>({el,r:el.getBoundingClientRect(),t:txt(el)})).filter(o=>o.r.width>=150&&o.r.width<=380&&o.r.height>=350&&o.t.includes('Dashboard')&&(o.t.includes('Studio AI')||o.t.includes('AI Tutor'))).sort((a,b)=>a.r.width-b.r.width)[0]?.el||null;
  }

  function findWorkspaceMain(){
    const tagged=$('[data-v30-legacy-home="1"]');
    if(tagged&&tagged.getBoundingClientRect().width>500)return tagged;
    const activity=$$('h1,h2,h3,h4,div').find(el=>/Leeractiviteit|Learning activity|Wat je al hebt gedaan|What you have done/i.test(txt(el)));
    if(activity){
      let p=activity.parentElement;
      while(p&&p!==document.body){const r=p.getBoundingClientRect();if(r.width>650&&r.height>350)return p;p=p.parentElement;}
    }
    return $$('main,[role="main"],section').map(el=>({el,r:el.getBoundingClientRect()})).filter(o=>!o.el.closest('#v29-home-layer')&&o.r.width>600&&o.r.height>350).sort((a,b)=>(b.r.width*b.r.height)-(a.r.width*a.r.height))[0]?.el||null;
  }

  function ensureTopbarHomePosition(){
    if(!isWorkspace())return;
    const wrap=$('.v36-shell-controls'),home=$('#v36-shell-home'),lang=$('#v36-language');
    if(wrap&&home&&lang){
      if(wrap.firstElementChild!==home)wrap.prepend(home);
      if(home.nextElementSibling!==lang)home.insertAdjacentElement('afterend',lang);
      home.innerHTML='⌂ <span>Home</span>';
    }
  }

  function clickExistingSidebar(label){
    const sidebar=findSidebar();if(!sidebar)return false;
    const el=$$('button,a,[role="button"],div',sidebar).find(x=>new RegExp(label,'i').test(txt(x)));
    if(el){el.click();return true;}return false;
  }

  function openStudio(mode){
    let overlay=$('#sv24-overlay');
    if(!overlay){clickExistingSidebar('Studio AI');setTimeout(()=>openStudio(mode),250);return;}
    overlay.classList.add('open');
    const btn=$(`.sv24-mode[data-mode="${mode}"]`,overlay);btn?.click();
  }

  function openProTool(tool){
    const trigger=$(`[data-tool="${tool}"]`);
    if(trigger){trigger.click();return;}
    const overlay=$('#sv24-overlay');
    if(overlay){overlay.classList.add('open');setTimeout(()=>{const t=$(`[data-tool="${tool}"]`);t?.click();},80);}
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
    $('[data-v37="book"]',box).onclick=()=>openProTool('book');
    $('[data-v37="schools"]',box).onclick=()=>openProTool('schools');
    $('[data-v37="study"]',box).onclick=()=>openProTool('study');
  }

  function injectSuite(){
    if(!isDashboard())return;
    const main=findWorkspaceMain();if(!main||$('#v37-pro-suite',main))return;
    const s=document.createElement('section');s.id='v37-pro-suite';
    s.innerHTML=`
      <div class="v37-suite-head"><div><small>SCHOLARK PRO CREATOR SUITE</small><h2>Alles wat we aan Pro hebben toegevoegd.</h2><p>De nieuwe Studio- en Future-tools staan nu rechtstreeks in je workspace. Open een creator of Pro-tool vanaf hier, zonder terug te hoeven naar de publieke homepage.</p></div><div class="v37-pro-badge">PRO • $19.99 / month</div></div>
      <div class="v37-grid">
        <button class="v37-card" data-open="presentation"><div class="ico">▣</div><div class="mini">Presentation Studio</div><strong>100 dia’s</strong><b>Presentation Builder</b><span>Research, outline, visuals, design, regeneration en export in één workflow.</span></button>
        <button class="v37-card" data-open="document"><div class="ico">▧</div><div class="mini">Documents & reports</div><strong>100 pagina’s</strong><b>Document Builder</b><span>Verslagen, essays en research-documents met structuur, bronnen en continuity.</span></button>
        <button class="v37-card" data-open="book"><div class="ico">📚</div><div class="mini">Book Studio</div><strong>900.000 woorden</strong><b>Complete books</b><span>Story bible, chapters, pacing, continuity en writing coaching.</span></button>
        <button class="v37-card" data-open="genres"><div class="ico">✦</div><div class="mini">Genre engine</div><strong>Alle genres</strong><b>Stories zonder genregrens</b><span>Fantasy, romance, thriller, mystery, sci-fi, YA, memoir, non-fiction en custom genre blends.</span></button>
        <button class="v37-card" data-open="webpage"><div class="ico">▤</div><div class="mini">Studio creator</div><b>Webpage Builder</b><span>Complete responsive webpagina’s met structuur, copy en design.</span></button>
        <button class="v37-card" data-open="social"><div class="ico">▥</div><div class="mini">Studio creator</div><b>Social Builder</b><span>Carousels, posts, hooks, captions, CTA’s en visual direction.</span></button>
        <button class="v37-card" data-open="graphic"><div class="ico">◇</div><div class="mini">Studio creator</div><b>Graphic Builder</b><span>Posters, infographics, diagrams en andere visuele concepten.</span></button>
        <button class="v37-card" data-open="future"><div class="ico">⌖</div><div class="mini">SCHOLARK Future</div><b>Schools + Study Ahead</b><span>Vind scholen in de buurt en bereid je alvast voor op een toekomstige studie of carrière.</span></button>
        <div class="v37-card v37-wide"><div class="ico">AI</div><div class="mini">Pro intelligence</div><b>Highest-quality SCHOLARK AI</b><span>Pro combineert de creator-suite met de hoogste AI-kwaliteit, onbeperkte Natural Rewrite en geavanceerdere workflows.</span><div class="v37-inline"><span class="v37-pill">Unlimited Natural Rewrite</span><span class="v37-pill">Advanced Studio</span><span class="v37-pill">Future learning</span></div></div>
        <div class="v37-card v37-wide"><div class="ico">∞</div><div class="mini">Long-form consistency</div><b>Grote projecten blijven samenhangend</b><span>Grote presentaties, verslagen en boeken worden in gecontroleerde delen opgebouwd en daarna als één coherent project bijgehouden.</span><div class="v37-inline"><span class="v37-pill">Story bible</span><span class="v37-pill">Source continuity</span><span class="v37-pill">Section memory</span></div></div>
      </div>`;
    main.insertBefore(s,main.firstChild);

    $$('[data-open]',s).forEach(b=>b.onclick=()=>{
      const m=b.dataset.open;
      if(['presentation','document','webpage','social','graphic'].includes(m))openStudio(m);
      else if(m==='book'||m==='genres')openProTool('book');
      else if(m==='future')openProTool('schools');
    });
  }

  function sync(){
    if(!isWorkspace())return;
    ensureTopbarHomePosition();injectSidebar();injectSuite();
  }

  new MutationObserver(()=>{clearTimeout(window.__v37ws);window.__v37ws=setTimeout(sync,80)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,30));
  setInterval(sync,650);setTimeout(sync,60);
})();