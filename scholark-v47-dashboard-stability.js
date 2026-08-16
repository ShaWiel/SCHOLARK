(() => {
  if (window.__SCHOLARK_V47_DASHBOARD_STABILITY__) return;
  window.__SCHOLARK_V47_DASHBOARD_STABILITY__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const isDashboard=()=>String(location.hash||'').toLowerCase()==='#dashboard';

  const style=document.createElement('style');
  style.id='scholark-v47-dashboard-stability-style';
  style.textContent=`
    body.v47-dashboard #v46-workspace-dashboard{
      display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;
      z-index:2147482000!important;
    }
    body.v47-dashboard #v29-home-layer,
    body.v47-dashboard #v28-home,
    body.v47-dashboard [data-v46-retired-public-home="1"],
    body.v47-dashboard #v41-studio-workspace,
    body.v47-dashboard #sv24-overlay{
      display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;
    }
    body.v47-dashboard.v41-studio-open #v41-studio-workspace{display:none!important}
  `;
  document.head.appendChild(style);

  function findSidebar(){
    const terms=['dashboard','studio ai','ai tutor','planner','voortgang','progress','doelen','goals','education & learning','educatie & leren','mijn projecten','my projects'];
    return $$('aside,nav,section,div')
      .filter(el=>!el.closest('#v29-home-layer')&&!el.closest('#v41-studio-workspace')&&!el.closest('#v46-workspace-dashboard')&&!el.closest('[data-v46-retired-public-home="1"]'))
      .map(el=>({el,r:el.getBoundingClientRect(),score:terms.reduce((n,x)=>n+(lower(el).includes(x)?1:0),0)}))
      .filter(o=>o.score>=4)
      .sort((a,b)=>b.score-a.score||a.r.width-b.r.width)[0]?.el||null;
  }

  function findTopbarBottom(){
    const candidates=$$('header,nav,section,div')
      .filter(el=>!el.closest('#v29-home-layer')&&!el.closest('#v41-studio-workspace')&&!el.closest('#v46-workspace-dashboard'))
      .map(el=>({el,r:el.getBoundingClientRect(),t:lower(el)}))
      .filter(o=>o.r.top<25&&o.r.height>=38&&o.r.height<=140&&o.r.width>innerWidth*.45&&(o.t.includes('uitloggen')||o.t.includes('log out')||o.t.includes('focus')||o.t.includes('nederlands')||o.t.includes('english')))
      .sort((a,b)=>a.r.height-b.r.height);
    return Math.max(64,Math.round(candidates[0]?.r.bottom||74));
  }

  function closeStudio(){
    document.body.classList.remove('v41-studio-open');
    const studio=$('#v41-studio-workspace');
    if(studio){studio.hidden=true;studio.setAttribute('aria-hidden','true');}
    $('#sv24-overlay')?.classList.remove('open');
  }

  function hidePublicLayers(){
    ['#v29-home-layer','#v28-home'].forEach(sel=>{
      const el=$(sel);if(el){el.hidden=true;el.setAttribute('aria-hidden','true');}
    });
    $$('[data-v46-retired-public-home="1"]').forEach(el=>{el.hidden=true;el.setAttribute('aria-hidden','true');});
  }

  function positionDashboard(root){
    const side=findSidebar();
    const closed=document.body.classList.contains('v40-sidebar-closed')||document.body.classList.contains('v41-sidebar-closed')||localStorage.getItem('scholark_sidebar_closed')==='1';
    let left=0;
    if(side&&!closed){
      const r=side.getBoundingClientRect();
      if(r.width>100&&r.right>0&&r.right<innerWidth*.5)left=Math.max(0,Math.round(r.right));
    }
    root.style.setProperty('left',left+'px','important');
    root.style.setProperty('top',findTopbarBottom()+'px','important');
    root.style.setProperty('right','0','important');
    root.style.setProperty('bottom','0','important');
  }

  function keepDashboardAlive(){
    if(!isDashboard()){
      document.body.classList.remove('v47-dashboard');
      return;
    }

    document.body.classList.add('v47-dashboard','v46-workspace','v46-dashboard');
    document.body.classList.remove('v46-public-home','v41-home','v40-public-home','v31-public-home','v42-home');
    closeStudio();
    hidePublicLayers();

    const root=$('#v46-workspace-dashboard');
    if(!root)return;
    root.hidden=false;
    root.removeAttribute('aria-hidden');
    root.style.setProperty('display','block','important');
    root.style.setProperty('visibility','visible','important');
    root.style.setProperty('opacity','1','important');
    root.style.setProperty('pointer-events','auto','important');
    positionDashboard(root);
  }

  document.addEventListener('click',e=>{
    const target=e.target.closest('button,a,[role="button"],[tabindex]');
    if(!target||target.closest('#v46-workspace-dashboard'))return;
    if(/^dashboard$/i.test(text(target))){
      setTimeout(()=>{
        if(String(location.hash||'').toLowerCase()!=='#dashboard')history.replaceState(null,'',location.pathname+location.search+'#dashboard');
        keepDashboardAlive();
      },0);
    }
  },true);

  const observer=new MutationObserver(()=>{
    if(!isDashboard())return;
    clearTimeout(window.__scholarkV47Mutation);
    window.__scholarkV47Mutation=setTimeout(keepDashboardAlive,20);
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});

  addEventListener('hashchange',()=>setTimeout(keepDashboardAlive,0));
  addEventListener('popstate',()=>setTimeout(keepDashboardAlive,0));
  addEventListener('resize',()=>setTimeout(keepDashboardAlive,20));

  setInterval(keepDashboardAlive,250);
  setTimeout(keepDashboardAlive,30);
})();