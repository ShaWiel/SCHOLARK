(() => {
  if (window.__SCHOLARK_V31_NAV_CLEANUP__) return;
  window.__SCHOLARK_V31_NAV_CLEANUP__ = true;

  const style = document.createElement('style');
  style.id = 'scholark-v31-nav-cleanup-style';
  style.textContent = `
    /* V31: floating Studio launcher is removed from the UI everywhere. */
    #sv24-launch{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
    /* Home should never sit on top of the public SCHOLARK homepage. */
    body.v31-public-home #sv24-home{display:none!important}
  `;
  document.head.appendChild(style);

  const $all = (s) => [...document.querySelectorAll(s)];

  function isVisible(el){
    if(!el) return false;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity || 1) > 0 && r.width > 1 && r.height > 1;
  }

  function publicHomeActive(){
    const nativeHome = document.querySelector('#v29-home-layer.v30-native-home');
    if(nativeHome && !nativeHome.hidden && isVisible(nativeHome)) return true;
    const h = (location.hash || '').toLowerCase();
    return (location.pathname === '/' || location.pathname === '') && (!h || h === '#home' || h === '#start');
  }

  function dashboardContext(){
    if(publicHomeActive()) return false;
    const h = (location.hash || '').toLowerCase();
    if(h.includes('dashboard')) return true;
    const tokens = ['Dashboard','Education & Learning','Studio AI','Planner','Progress'];
    return $all('aside,nav,section,div').some(el => {
      if(!isVisible(el) || el.closest('#v29-home-layer')) return false;
      const t = (el.textContent || '');
      const hits = tokens.filter(x => t.includes(x)).length;
      const r = el.getBoundingClientRect();
      return hits >= 3 && r.width >= 120 && r.width <= 460 && r.height >= 280;
    });
  }

  function sync(){
    const launch = document.getElementById('sv24-launch');
    if(launch){
      launch.setAttribute('aria-hidden','true');
      launch.tabIndex = -1;
      launch.style.setProperty('display','none','important');
    }

    const onPublicHome = publicHomeActive();
    document.body?.classList.toggle('v31-public-home', onPublicHome);

    const home = document.getElementById('sv24-home');
    if(home){
      const show = dashboardContext();
      home.style.setProperty('display', show ? 'flex' : 'none', 'important');
      home.setAttribute('aria-hidden', show ? 'false' : 'true');
      home.tabIndex = show ? 0 : -1;
    }
  }

  const mo = new MutationObserver(() => {
    clearTimeout(window.__v31NavTimer);
    window.__v31NavTimer = setTimeout(sync, 80);
  });
  mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',() => setTimeout(sync,30));
  addEventListener('popstate',() => setTimeout(sync,30));
  setInterval(sync,700);
  setTimeout(sync,30);
})();