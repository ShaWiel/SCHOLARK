(() => {
  if (window.__SCHOLARK_V42_ROUTE_GUARD_V2__) return;
  window.__SCHOLARK_V42_ROUTE_GUARD_V2__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const hash=()=>String(location.hash||'').toLowerCase();
  const workspace=()=>/dashboard|studio|presentation|document|report|poster|tutor|planner|progress|goal|project|education|book|schools|study/.test(hash());
  const publicHome=()=>!workspace()&&!/pricing/.test(hash());

  function removeRetiredHome(){
    $('#v28-home')?.remove();
    $('#v28-home-style')?.remove();
    $$('[data-v28-old-home="1"]').forEach(el=>{
      el.style.removeProperty('display');
      delete el.dataset.v28OldHome;
    });
  }

  function dedupePricing(){
    const keep=$('#v41-home-pricing');
    ['#v42-pricing','#v40-home-pricing','#v39-home-pricing','#v37-home-pricing'].forEach(sel=>{
      const el=$(sel);if(el&&el!==keep)el.remove();
    });
    const home=$('#v29-home-layer');
    if(!home)return;
    $$('section',home).forEach(section=>{
      if(section===keep)return;
      const t=text(section).toLowerCase();
      const isPlanSection=t.includes('scholark free')&&t.includes('scholark plus')&&t.includes('scholark pro');
      if(isPlanSection)section.remove();
    });
  }

  function revealWorkspaceShell(){
    document.body.classList.remove('v41-home','v40-public-home','v31-public-home','v42-home');
    const home=$('#v29-home-layer');
    if(home){
      home.hidden=true;
      home.style.setProperty('display','none','important');
      home.style.setProperty('visibility','hidden','important');
    }
    $$('[data-v30-legacy-home="1"]').forEach(el=>{
      delete el.dataset.v30LegacyHome;
      el.hidden=false;
      ['display','visibility','opacity','pointer-events','transform'].forEach(p=>el.style.removeProperty(p));
    });
    $('#v41-dashboard-entry')?.style.setProperty('display','none','important');
  }

  function findSidebar(){
    const terms=['dashboard','studio ai','ai tutor','planner','voortgang','progress','doelen','goals','onderwijs & leren','education & learning'];
    return $$('aside,nav,section,div')
      .filter(el=>!el.closest('#v29-home-layer'))
      .map(el=>({el,r:el.getBoundingClientRect(),score:terms.reduce((n,x)=>n+(text(el).toLowerCase().includes(x)?1:0),0)}))
      .filter(o=>o.score>=4&&o.r.width>=140&&o.r.width<=470&&o.r.height>=280)
      .sort((a,b)=>b.score-a.score||a.r.width-b.r.width)[0]?.el||null;
  }

  function clickDashboardItem(){
    const side=findSidebar();if(!side)return false;
    const item=$$('button,a,[role="button"],[tabindex],div,span',side)
      .filter(el=>/^dashboard$/i.test(text(el)))
      .sort((a,b)=>(['BUTTON','A'].includes(a.tagName)?0:1)-(['BUTTON','A'].includes(b.tagName)?0:1))[0];
    if(!item)return false;
    try{item.click();return true}catch{return false}
  }

  function openWorkspaceDirect(){
    removeRetiredHome();
    revealWorkspaceShell();
    history.replaceState(null,'',location.pathname+location.search+'#dashboard');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    let attempts=0;
    const tick=()=>{
      attempts++;
      revealWorkspaceShell();
      if(clickDashboardItem()||attempts>=12)return;
      setTimeout(tick,80);
    };
    tick();
  }

  document.addEventListener('click',e=>{
    if(!publicHome())return;
    const target=e.target.closest('#v41-dashboard-entry,#v34-dashboard-entry,[data-open-dashboard]');
    if(!target)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openWorkspaceDirect();
  },true);

  function sync(){
    removeRetiredHome();
    dedupePricing();
    if(workspace()) revealWorkspaceShell();
  }

  new MutationObserver(()=>{
    clearTimeout(window.__scholarkV42Clean);
    window.__scholarkV42Clean=setTimeout(sync,45);
  }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});

  addEventListener('hashchange',()=>setTimeout(sync,15));
  addEventListener('popstate',()=>setTimeout(sync,15));
  setInterval(sync,700);
  setTimeout(sync,30);
})();