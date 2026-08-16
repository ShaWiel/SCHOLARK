(() => {
  if (window.__SCHOLARK_V47_COMPAT__) return;
  window.__SCHOLARK_V47_COMPAT__ = true;

  // V48 owns workspace visibility, routing and sidebar state.
  const style=document.createElement('style');
  style.id='scholark-v47-v48-compat-style';
  style.textContent=`
    body.v48-workspace #v48-sidebar.v41-sidebar-shell,
    body.v48-workspace #v48-sidebar.v40-sidebar-shell{
      display:block!important;width:258px!important;min-width:258px!important;max-width:258px!important;
      transform:none!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;
    }
    body.v48-workspace #v48-dashboard.v41-workspace-main,
    body.v48-workspace #v48-dashboard.v40-workspace-main{
      margin-left:0!important;width:auto!important;max-width:none!important;flex:none!important;
    }
    body.v48-workspace [data-v30-legacy-home="1"]{
      visibility:visible!important;opacity:1!important;pointer-events:auto!important;
    }
    @media(max-width:1050px){body.v48-workspace #v48-sidebar.v41-sidebar-shell,body.v48-workspace #v48-sidebar.v40-sidebar-shell{width:220px!important;min-width:220px!important;max-width:220px!important}}
    @media(max-width:720px){body.v48-workspace #v48-sidebar.v41-sidebar-shell,body.v48-workspace #v48-sidebar.v40-sidebar-shell{width:74px!important;min-width:74px!important;max-width:74px!important}}
  `;
  document.head.appendChild(style);

  const cleanup=()=>{
    document.body?.classList.remove('v47-dashboard');
    document.getElementById('scholark-v47-dashboard-stability-style')?.remove();
    if(document.body?.classList.contains('v48-workspace')){
      document.body.classList.remove('v41-sidebar-closed','v40-sidebar-closed');
      localStorage.setItem('scholark_sidebar_closed','0');
    }
  };
  cleanup();
  document.addEventListener('DOMContentLoaded',cleanup,{once:true});
  addEventListener('hashchange',()=>setTimeout(cleanup,0));
  setInterval(()=>{if(document.body?.classList.contains('v48-workspace'))cleanup();},900);
})();