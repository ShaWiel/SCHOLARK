(() => {
  if(window.__SCHOLARK_V109_HOME_OWNER__)return;
  window.__SCHOLARK_V109_HOME_OWNER__=true;
  window.__SCHOLARK_HOME_OWNER_LOCK__='v29-active-learning';
  window.__SCHOLARK_HOME_V29_ONLY__=true;

  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const publicHome=()=>{const h=String(location.hash||'').toLowerCase();return (location.pathname==='/'||location.pathname==='')&&(h===''||h==='#home'||h==='#pricing'||h==='#start')};
  const retiredSelectors=[
    '#sv24-explainer','#sv24-launch','#sv24-home',
    '#v25-ad-studio','#v25-ad-future','#v25-pricing',
    '#v26-hero','#v26-pricing','#v28-home',
    '#v34-home-pricing','#v37-home-pricing','#v39-home-pricing','#v40-home-pricing',
    '.v25-premium'
  ];

  const style=document.createElement('style');
  style.id='scholark-v109-home-owner-style';
  style.textContent=`
    body.v55-public-home [data-v30-legacy-home="1"],
    html.v55-public-home [data-v30-legacy-home="1"],
    body.v31-public-home [data-v30-legacy-home="1"],
    ${retiredSelectors.map(s=>'body.v55-public-home '+s+',html.v55-public-home '+s+',body.v31-public-home '+s).join(',')}
    {display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
  `;
  document.head.appendChild(style);

  function prune(){
    if(!publicHome())return;
    document.body?.classList.add('v55-public-home');
    document.documentElement.classList.add('v55-public-home');
    retiredSelectors.forEach(sel=>$$(sel).forEach(el=>{if(el.closest('#v29-home-layer,#v41-home-pricing,#v55-topbar'))return;el.remove()}));
    const home=$('#v29-home-layer');
    if(home){home.hidden=false;home.removeAttribute('aria-hidden')}
    $$('[data-v30-legacy-home="1"]').forEach(el=>{
      if(el===home||el.closest('#v29-home-layer'))return;
      el.setAttribute('aria-hidden','true');
    });
  }

  function verify(){
    if(!publicHome())return {ok:true,home:false};
    const current=$('#v29-home-layer');
    const retiredVisible=retiredSelectors.some(sel=>$$(sel).some(el=>{
      const cs=getComputedStyle(el),r=el.getBoundingClientRect();
      return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>.01&&r.width>2&&r.height>2;
    }));
    const legacyVisible=$$('[data-v30-legacy-home="1"]').some(el=>{
      const cs=getComputedStyle(el),r=el.getBoundingClientRect();
      return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>.01&&r.width>2&&r.height>2;
    });
    return {ok:!!current&&!current.hidden&&!retiredVisible&&!legacyVisible,home:true,current:!!current,retiredVisible,legacyVisible,owner:window.__SCHOLARK_HOME_OWNER_LOCK__};
  }

  const schedule=()=>[0,80,260,700,1600].forEach(ms=>setTimeout(prune,ms));
  addEventListener('hashchange',schedule);addEventListener('popstate',schedule);addEventListener('pageshow',schedule);
  addEventListener('scholark-return-home',schedule);addEventListener('scholark-runtime-ready',schedule);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
  schedule();

  window.__SCHOLARK_V109_HOME__={prune,verify,owner:'v29-active-learning',legacyHomeLocked:true,release:'r168'};
})();