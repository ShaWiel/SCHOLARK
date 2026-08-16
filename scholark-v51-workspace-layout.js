(() => {
  if(window.__SCHOLARK_V51_WORKSPACE_LAYOUT__)return;
  window.__SCHOLARK_V51_WORKSPACE_LAYOUT__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const hash=()=>String(location.hash||'').toLowerCase();
  const workspace=()=>/dashboard|studio|presentation|webpage|document|report|graphic|social|tutor|education|planner|progress|goal|project|schools|study|book/.test(hash());
  const left=()=>document.body.classList.contains('v49-sidebar-collapsed')?'0px':(innerWidth<=1050?'220px':'258px');

  const css=document.createElement('style');css.id='scholark-v51-layout-style';css.textContent=`
    /* Toggle exists only inside the workspace. */
    body:not(.v48-workspace) #v49-sidebar-toggle{display:none!important;visibility:hidden!important;pointer-events:none!important}
    body.v48-workspace #v49-sidebar-toggle{display:grid!important;visibility:visible!important;pointer-events:auto!important}

    /* Collapsed means fully gone: no black rail remains. */
    body.v49-sidebar-collapsed #v48-sidebar{
      width:0!important;min-width:0!important;max-width:0!important;padding:0!important;margin:0!important;
      transform:translateX(-110%)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;
      box-shadow:none!important;overflow:hidden!important;
    }
    body.v49-sidebar-collapsed #v49-sidebar-toggle{left:8px!important;top:86px!important}
    body.v49-sidebar-collapsed #v48-dashboard,
    body.v49-sidebar-collapsed #v41-studio-workspace,
    body.v49-sidebar-collapsed .v49-native-panel{left:0!important}
    body:not(.v49-sidebar-collapsed) #v49-sidebar-toggle{left:240px!important}
    @media(max-width:1050px){body:not(.v49-sidebar-collapsed) #v49-sidebar-toggle{left:202px!important}}
    @media(max-width:720px){body:not(.v49-sidebar-collapsed) #v49-sidebar-toggle{left:58px!important}body.v49-sidebar-collapsed #v49-sidebar-toggle{left:8px!important;top:72px!important}}

    /* Pro/Future tools are real workspace pages, not floating dark modals. */
    body.v51-pro-page #v50-school,
    body.v51-pro-page #v25-study,
    body.v51-pro-page #v25-book{
      position:fixed!important;left:var(--v51-left,258px)!important;top:0!important;right:0!important;bottom:0!important;inset:auto 0 0 var(--v51-left,258px)!important;
      z-index:2147481500!important;background:#f4f3ef!important;backdrop-filter:none!important;padding:0!important;
      align-items:stretch!important;justify-content:stretch!important;overflow:auto!important;
    }
    body.v51-pro-page #v50-school.open,
    body.v51-pro-page #v25-study.open,
    body.v51-pro-page #v25-book.open{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    body.v51-pro-page #v50-school .v50-box,
    body.v51-pro-page #v25-study .v25-box,
    body.v51-pro-page #v25-book .v25-box{
      width:min(1380px,100%)!important;max-width:1380px!important;min-height:100%!important;max-height:none!important;
      margin:0 auto!important;border-radius:0!important;box-shadow:none!important;background:#f4f3ef!important;padding:38px 38px 80px!important;box-sizing:border-box!important;
    }
    body.v51-pro-page #v50-school .v50-head,
    body.v51-pro-page #v25-study .v25-boxhead,
    body.v51-pro-page #v25-book .v25-boxhead{padding-right:150px!important}
    body.v51-pro-page #v50-school .v50-controls,
    body.v51-pro-page #v50-school .v50-info,
    body.v51-pro-page #v50-school .v50-results,
    body.v51-pro-page #v25-study .v25-content,
    body.v51-pro-page #v25-book .v25-content{
      background:#fff!important;border:1px solid rgba(23,25,31,.08)!important;border-radius:22px!important;box-shadow:0 18px 55px rgba(31,27,63,.045)!important;
    }
    body.v51-pro-page #v50-school .v50-controls{padding:16px!important;margin-top:24px!important}
    body.v51-pro-page #v50-school .v50-info{padding:13px 15px!important;margin:12px 0!important}
    body.v51-pro-page #v50-school .v50-results{padding:14px!important;min-height:220px!important}
    body.v51-pro-page #v25-study .v25-content,
    body.v51-pro-page #v25-book .v25-content{padding:20px!important;margin-top:22px!important;min-height:320px!important}
    body.v51-pro-page #v50-school .v50-x,
    body.v51-pro-page #v25-study .v25-close,
    body.v51-pro-page #v25-book .v25-close{display:none!important}
    body.v51-pro-page #v48-dashboard{display:none!important}
    body.v51-pro-page #v29-home-layer,body.v51-pro-page #v28-home{display:none!important}

    body.v49-sidebar-collapsed.v51-pro-page #v50-school,
    body.v49-sidebar-collapsed.v51-pro-page #v25-study,
    body.v49-sidebar-collapsed.v51-pro-page #v25-book{left:0!important;inset:auto 0 0 0!important}
    @media(max-width:1050px){body.v51-pro-page #v50-school,body.v51-pro-page #v25-study,body.v51-pro-page #v25-book{left:var(--v51-left,220px)!important;inset:auto 0 0 var(--v51-left,220px)!important}}
    @media(max-width:720px){body.v51-pro-page #v50-school .v50-box,body.v51-pro-page #v25-study .v25-box,body.v51-pro-page #v25-book .v25-box{padding:74px 16px 50px!important}body.v51-pro-page #v50-school .v50-head,body.v51-pro-page #v25-study .v25-boxhead,body.v51-pro-page #v25-book .v25-boxhead{padding-right:0!important}}
  `;document.head.appendChild(css);

  function setLeft(){document.documentElement.style.setProperty('--v51-left',left());}
  function toggleVisibility(){const b=$('#v49-sidebar-toggle');if(b){const active=workspace()&&document.body.classList.contains('v48-workspace');b.hidden=!active;b.style.display=active?'grid':'none';}}
  function normalizeToggle(){const b=$('#v49-sidebar-toggle');if(!b)return;const collapsed=document.body.classList.contains('v49-sidebar-collapsed');b.textContent=collapsed?'›':'‹';b.title=collapsed?'Open sidebar':'Close sidebar';b.setAttribute('aria-label',b.title);}

  function closeLegacyPro(){
    if(!hash().includes('schools'))$('#v50-school')?.classList.remove('open');
    if(!hash().includes('study'))$('#v25-study')?.classList.remove('open');
    if(!hash().includes('book'))$('#v25-book')?.classList.remove('open');
  }

  function ensureStudyPage(){
    const d=$('#v25-study');if(!d)return false;
    d.classList.add('open');
    if(!$('.v25-content',d)?.children.length){
      const trigger=$('[data-tool="study"]');try{trigger?.click()}catch{}
    }
    return true;
  }
  function ensureBookPage(){
    const d=$('#v25-book');if(!d)return false;
    d.classList.add('open');
    if(!$('.v25-content',d)?.children.length){
      const trigger=$('[data-tool="book"]');try{trigger?.click()}catch{}
    }
    return true;
  }
  function ensureSchoolsPage(){
    const d=$('#v50-school');if(d){d.classList.add('open');return true;}
    const trigger=$('[data-v50-school="1"],[data-v48-tool="schools"]');try{trigger?.click()}catch{}
    return false;
  }

  function syncProPage(){
    const h=hash(),isPro=/schools|study|book/.test(h);
    document.body.classList.toggle('v51-pro-page',isPro&&workspace());
    setLeft();toggleVisibility();normalizeToggle();
    if(!isPro){closeLegacyPro();return;}
    $('#v48-dashboard')?.setAttribute('hidden','');
    $('#v29-home-layer')?.setAttribute('hidden','');
    if(h.includes('schools'))ensureSchoolsPage();
    else if(h.includes('study'))ensureStudyPage();
    else if(h.includes('book'))ensureBookPage();
  }

  /* Capture Future & Pro navigation so it becomes a page immediately. */
  document.addEventListener('click',e=>{
    const b=e.target.closest('#v48-sidebar [data-v48-tool],#v48-dashboard [data-v48-tool],#v48-sidebar [data-v50-school]');if(!b)return;
    const id=b.dataset.v48Tool||(b.dataset.v50School?'schools':'');if(!['schools','study','book'].includes(id))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    history.pushState(null,'',location.pathname+location.search+'#'+id);window.dispatchEvent(new HashChangeEvent('hashchange'));
    setTimeout(syncProPage,0);
  },true);

  /* Old V49 toggle handler still owns persistence; V51 only fixes its geometry/state. */
  document.addEventListener('click',e=>{if(e.target.closest('#v49-sidebar-toggle'))setTimeout(()=>{setLeft();normalizeToggle();syncProPage();},0)},true);

  addEventListener('hashchange',()=>setTimeout(syncProPage,0));addEventListener('popstate',()=>setTimeout(syncProPage,0));addEventListener('resize',()=>{setLeft();syncProPage()});
  new MutationObserver(()=>{clearTimeout(window.__v51sync);window.__v51sync=setTimeout(syncProPage,60)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});
  setInterval(syncProPage,700);setTimeout(syncProPage,80);
})();