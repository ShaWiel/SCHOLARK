(() => {
  if (window.__SCHOLARK_V41_ROUTER__) return;
  window.__SCHOLARK_V41_ROUTER__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const HOME_ID='v29-home-layer';

  const workspaceHash=()=>/dashboard|studio|presentation|document|report|poster|tutor|planner|progress|goal|project|education/.test((location.hash||'').toLowerCase());
  const publicHome=()=>!workspaceHash()&&!/pricing/.test((location.hash||'').toLowerCase());

  function navHits(el){
    const t=lower(el);
    const terms=['dashboard','studio ai','ai tutor','planner','voortgang','progress','doelen','goals','onderwijs & leren','education & learning','mijn projecten','my projects'];
    return terms.reduce((n,x)=>n+(t.includes(x)?1:0),0);
  }

  function findSidebarAny(){
    const c=$$('aside,nav,section,div')
      .filter(el=>!el.closest('#'+HOME_ID))
      .map(el=>({el,h:navHits(el),n:el.querySelectorAll('*').length,t:text(el).length}))
      .filter(o=>o.h>=4)
      .sort((a,b)=>b.h-a.h||a.n-b.n||a.t-b.t);
    if(!c[0]) return null;
    let shell=c[0].el,cur=shell;
    while(cur.parentElement&&cur.parentElement!==document.body){
      const p=cur.parentElement;
      if(navHits(p)>=4 && !p.closest('#'+HOME_ID) && p.querySelectorAll('*').length<600){shell=p;cur=p;continue;}
      break;
    }
    return shell;
  }

  function findMainAny(sidebar){
    const tagged=$('[data-v30-legacy-home="1"]');
    if(tagged&&!tagged.closest('#'+HOME_ID)) return tagged;
    if(sidebar?.parentElement){
      const sibs=[...sidebar.parentElement.children]
        .filter(el=>el!==sidebar&&el.id!==HOME_ID)
        .map(el=>({el,len:text(el).length,n:el.querySelectorAll('*').length}))
        .filter(o=>o.len>80||o.n>8)
        .sort((a,b)=>b.len-a.len||b.n-a.n);
      if(sibs[0]) return sibs[0].el;
    }
    return $('main,[role="main"]');
  }

  function findTopbarAny(){
    const terms=['nederlands','english','online','uitloggen','log out','focusmodus','focus mode','demo resetten','reset demo'];
    return $$('header,nav,section,div')
      .filter(el=>!el.closest('#'+HOME_ID))
      .map(el=>({el,h:terms.reduce((n,x)=>n+(lower(el).includes(x)?1:0),0),n:el.querySelectorAll('*').length}))
      .filter(o=>o.h>=2)
      .sort((a,b)=>b.h-a.h||a.n-b.n)[0]?.el||null;
  }

  function revealTree(el){
    let cur=el;
    while(cur&&cur!==document.body&&cur!==document.documentElement){
      cur.hidden=false;
      ['display','visibility','opacity','pointer-events','width','max-width','min-width','margin-left','transform'].forEach(p=>cur.style.removeProperty(p));
      cur=cur.parentElement;
    }
  }

  function restoreWorkspaceDom(){
    document.body.classList.remove('v31-public-home','v40-public-home','v40-sidebar-closed');
    const home=$('#'+HOME_ID);
    if(home){home.hidden=true;home.style.setProperty('display','none','important');home.style.setProperty('visibility','hidden','important');}

    $$('[data-v30-legacy-home="1"]').forEach(el=>{
      delete el.dataset.v30LegacyHome;
      revealTree(el);
      el.style.setProperty('display','block','important');
      el.style.setProperty('visibility','visible','important');
      el.style.setProperty('opacity','1','important');
    });

    const sidebar=findSidebarAny();
    const main=findMainAny(sidebar);
    const top=findTopbarAny();
    [sidebar,main,top].filter(Boolean).forEach(el=>{el.classList.remove('v40-workspace-only');revealTree(el);});
    if(sidebar){sidebar.style.removeProperty('display');sidebar.style.removeProperty('visibility');sidebar.style.removeProperty('opacity');}
    if(main){main.style.removeProperty('display');main.style.removeProperty('visibility');main.style.removeProperty('opacity');main.style.setProperty('min-height','300px');}
    return {sidebar,main,top};
  }

  function dashboardItem(sidebar){
    if(!sidebar) return null;
    return $$('button,a,[role="button"],[tabindex],div,span',sidebar)
      .filter(el=>/^dashboard$/i.test(text(el)))
      .sort((a,b)=>(['BUTTON','A'].includes(a.tagName)?0:1)-(['BUTTON','A'].includes(b.tagName)?0:1))[0]||null;
  }

  function openDashboard(){
    history.pushState(null,'',location.pathname+'#dashboard');
    let attempts=0;
    const run=()=>{
      attempts++;
      const {sidebar,main}=restoreWorkspaceDom();
      const item=dashboardItem(sidebar);
      if(item && !item.dataset.v41Clicked){
        item.dataset.v41Clicked='1';
        try{item.click()}catch{}
        setTimeout(()=>delete item.dataset.v41Clicked,200);
      }
      const ok=!!main && getComputedStyle(main).display!=='none';
      if(!ok && attempts<20) setTimeout(run,90);
    };
    run();
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  function showPublicHome(){
    history.pushState(null,'',location.pathname);
    document.body.classList.add('v40-public-home');
    document.body.classList.remove('v40-sidebar-closed');
    const home=$('#'+HOME_ID);
    if(home){home.hidden=false;home.style.setProperty('display','block','important');home.style.setProperty('visibility','visible','important');home.style.setProperty('opacity','1','important');}
    $('#v26-sidebar-toggle')?.style.setProperty('display','none','important');
    setTimeout(syncDashboardButton,20);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  function syncDashboardButton(){
    let btn=$('#v34-dashboard-entry');
    if(!btn) return;
    if(!btn.dataset.v41Owned){
      const clone=btn.cloneNode(true);
      btn.replaceWith(clone);
      btn=clone;
      btn.dataset.v41Owned='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openDashboard();});
    }
    const onHome=publicHome();
    btn.hidden=!onHome;
    if(onHome){
      btn.style.setProperty('display','inline-flex','important');
      btn.style.setProperty('visibility','visible','important');
      btn.style.setProperty('opacity','1','important');
      btn.style.setProperty('pointer-events','auto','important');
    }else btn.style.setProperty('display','none','important');
  }

  function wireHomeButtons(){
    $$('#v40-workspace-home,#v36-shell-home').forEach(btn=>{
      if(btn.dataset.v41Home) return;
      btn.dataset.v41Home='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showPublicHome();},true);
    });
  }

  window.SCHOLARK_ROUTER={openDashboard,showPublicHome,restoreWorkspaceDom};

  function sync(){
    syncDashboardButton();
    wireHomeButtons();
    if(workspaceHash()) restoreWorkspaceDom();
  }

  document.addEventListener('click',e=>{
    const dash=e.target.closest('#v34-dashboard-entry');
    if(dash&&publicHome()){e.preventDefault();e.stopImmediatePropagation();openDashboard();}
  },true);

  new MutationObserver(()=>{clearTimeout(window.__v41t);window.__v41t=setTimeout(sync,45)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','data-v30-legacy-home']});
  addEventListener('hashchange',()=>setTimeout(sync,10));
  addEventListener('popstate',()=>setTimeout(sync,10));
  setInterval(sync,400);
  setTimeout(sync,30);
})();