(() => {
  if (window.__SCHOLARK_V54_DASHBOARD_BRIDGE__) return;
  window.__SCHOLARK_V54_DASHBOARD_BRIDGE__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const isPublicHome=()=>!/(dashboard|studio|tutor|education|planner|progress|goal|project|schools|study|book|presentation|webpage|document|report|graphic|social)/i.test(location.hash||'');

  function revealDashboardNow(){
    const side=$('#v51-sidebar');
    const main=$('#v51-main');
    const page=$('#v51-main [data-v51-page="dashboard"]');
    if(!side||!main||!page)return false;

    document.body.classList.add('v51-workspace');
    document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v53-emergency');
    side.hidden=false;
    main.hidden=false;
    side.style.removeProperty('display');
    main.style.removeProperty('display');
    [...main.querySelectorAll('.v51-page')].forEach(p=>p.classList.toggle('active',p===page));
    const home=$('#v29-home-layer');
    if(home)home.hidden=true;
    return true;
  }

  function openDashboard(){
    const old=location.href;
    history.replaceState(null,'',location.pathname+location.search+'#dashboard');

    try{
      window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL:old,newURL:location.href}));
    }catch{
      window.dispatchEvent(new Event('hashchange'));
    }

    let tries=0;
    const activate=()=>{
      tries++;
      const button=$('#v51-sidebar [data-v51-tool="dashboard"]');
      if(button){
        try{button.click()}catch{}
        revealDashboardNow();
        return;
      }
      if(revealDashboardNow())return;
      if(tries<24)setTimeout(activate,50);
      else {
        try{window.dispatchEvent(new HashChangeEvent('hashchange'))}catch{}
      }
    };
    requestAnimationFrame(activate);
  }

  document.addEventListener('click',e=>{
    const button=e.target.closest('#v41-dashboard-entry');
    if(!button||!isPublicHome())return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openDashboard();
  },true);
})();