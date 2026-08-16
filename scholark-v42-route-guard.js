(() => {
  if (window.__SCHOLARK_V42_ROUTE_GUARD_V3__) return;
  window.__SCHOLARK_V42_ROUTE_GUARD_V3__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const hash=()=>String(location.hash||'').toLowerCase();
  const workspace=()=>/dashboard|studio|presentation|document|report|poster|tutor|planner|progress|goal|project|education|book|schools|study/.test(hash());
  const publicHome=()=>!workspace()&&!/pricing/.test(hash());
  let dashboardClicked=false;

  const style=document.createElement('style');
  style.id='scholark-v42-route-style';
  style.textContent=`
    body.v42-workspace #v29-home-layer,
    body.v42-workspace #v28-home,
    body.v42-workspace #v41-dashboard-entry,
    body.v42-workspace #v34-dashboard-entry{display:none!important;visibility:hidden!important;pointer-events:none!important}
    body.v42-workspace [data-v30-legacy-home="1"]{display:revert!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
  `;
  document.head.appendChild(style);

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
    ['#v42-pricing','#v40-home-pricing','#v39-home-pricing','#v37-home-pricing','#v34-home-pricing'].forEach(sel=>{
      const el=$(sel);if(el&&el!==keep)el.remove();
    });
    const home=$('#v29-home-layer');if(!home)return;
    $$('section',home).forEach(section=>{
      if(section===keep)return;
      const t=text(section).toLowerCase();
      if(t.includes('scholark free')&&t.includes('scholark plus')&&t.includes('scholark pro'))section.remove();
    });
  }

  function unlock(el){
    if(!el)return;
    let cur=el;
    while(cur&&cur!==document.documentElement){
      cur.hidden=false;
      cur.removeAttribute?.('aria-hidden');
      if(cur.dataset){delete cur.dataset.v30LegacyHome;delete cur.dataset.v28OldHome;}
      ['display','visibility','opacity','pointer-events','transform','width','min-width','max-width','height','min-height','max-height','overflow','margin-left'].forEach(p=>cur.style?.removeProperty(p));
      if(cur===document.body)break;
      cur=cur.parentElement;
    }
  }

  function navScore(el){
    const t=text(el).toLowerCase();
    return ['dashboard','studio ai','ai tutor','planner','voortgang','progress','doelen','goals','onderwijs & leren','education & learning','mijn projecten','my projects']
      .reduce((n,x)=>n+(t.includes(x)?1:0),0);
  }

  function findSidebar(){
    const candidates=$$('aside,nav,section,div')
      .filter(el=>!el.closest('#v29-home-layer')&&el.id!=='v41-studio-workspace')
      .map(el=>({el,score:navScore(el),nodes:el.querySelectorAll('*').length,len:text(el).length}))
      .filter(o=>o.score>=4&&o.len<10000)
      .sort((a,b)=>b.score-a.score||a.nodes-b.nodes||a.len-b.len);
    return candidates[0]?.el||null;
  }

  function revealWorkspace(){
    document.body.classList.add('v42-workspace');
    document.body.classList.remove('v41-home','v40-public-home','v31-public-home','v42-home');

    const home=$('#v29-home-layer');
    if(home){home.hidden=true;home.style.setProperty('display','none','important');home.style.setProperty('visibility','hidden','important');}

    $$('[data-v30-legacy-home="1"],[data-v28-old-home="1"]').forEach(unlock);

    const side=findSidebar();
    if(side){
      unlock(side);
      let shell=side;
      while(shell.parentElement&&shell.parentElement!==document.body){
        const parent=shell.parentElement;
        const siblings=[...parent.children].filter(x=>x!==shell&&x.id!=='v29-home-layer');
        if(siblings.length){
          unlock(parent);
          siblings.forEach(s=>{if(text(s).length>20||s.matches('main,[role="main"]'))unlock(s);});
          break;
        }
        shell=parent;
      }
    }

    const mains=$$('main,[role="main"]')
      .filter(el=>el.id!=='v29-home-layer'&&!el.closest('#v29-home-layer'));
    mains.forEach(unlock);
  }

  function clickDashboardNav(){
    if(dashboardClicked)return;
    const side=findSidebar();if(!side)return;
    const item=$$('button,a,[role="button"],[tabindex]',side).find(el=>/^dashboard$/i.test(text(el)));
    if(!item)return;
    dashboardClicked=true;
    try{item.click()}catch{}
  }

  function cleanWorkspaceQuery(){
    const u=new URL(location.href);
    if(u.searchParams.get('_scholark_workspace')!=='1')return;
    u.searchParams.delete('_scholark_workspace');
    history.replaceState(null,'',u.pathname+(u.search?u.search:'')+'#dashboard');
  }

  function enterWorkspaceAfterLoad(){
    revealWorkspace();
    setTimeout(revealWorkspace,40);
    setTimeout(()=>{revealWorkspace();clickDashboardNav();},140);
    setTimeout(()=>{revealWorkspace();cleanWorkspaceQuery();},420);
  }

  function hardOpenDashboard(){
    sessionStorage.setItem('scholark_open_workspace','1');
    const u=new URL(location.href);
    u.hash='dashboard';
    u.searchParams.set('_scholark_workspace','1');
    location.assign(u.toString());
  }

  document.addEventListener('click',e=>{
    if(!publicHome())return;
    const target=e.target.closest('#v41-dashboard-entry,#v34-dashboard-entry,[data-open-dashboard]');
    if(!target)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    hardOpenDashboard();
  },true);

  function sync(){
    removeRetiredHome();
    dedupePricing();
    if(workspace())revealWorkspace();
    else document.body.classList.remove('v42-workspace');
  }

  if(workspace()||sessionStorage.getItem('scholark_open_workspace')==='1'){
    sessionStorage.removeItem('scholark_open_workspace');
    enterWorkspaceAfterLoad();
  }

  new MutationObserver(()=>{
    clearTimeout(window.__scholarkV42Clean);
    window.__scholarkV42Clean=setTimeout(sync,45);
  }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','data-v30-legacy-home']});

  addEventListener('hashchange',()=>{dashboardClicked=false;setTimeout(()=>{sync();if(workspace())enterWorkspaceAfterLoad();},15);});
  addEventListener('popstate',()=>setTimeout(sync,15));
  setInterval(sync,500);
  setTimeout(sync,25);
})();