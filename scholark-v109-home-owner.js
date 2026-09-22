(() => {
  if(window.__SCHOLARK_V109_HOME_OWNER__)return;
  window.__SCHOLARK_V109_HOME_OWNER__=true;
  window.__SCHOLARK_HOME_OWNER_LOCK__='v29-active-learning';
  window.__SCHOLARK_HOME_V29_ONLY__=true;

  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const publicHome=()=>window.__SCHOLARK_ROUTES__?.isHome?.()??(()=>{const p=String(location.pathname||'/').replace(/\/+$/,'')||'/',h=String(location.hash||'').toLowerCase().replace(/^#/,'').split(/[?&]/)[0].replace(/\/+$/,'');return (p==='/'||p==='/index.html')&&['','home','pricing','start'].includes(h)})();
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
    ${retiredSelectors.map(s=>'body.v55-public-home '+s+',html.v55-public-home '+s+',body.v31-public-home '+s).join(',')},
    body.v55-public-home [data-v109-quarantined="1"],html.v55-public-home [data-v109-quarantined="1"]
    {display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
  `;
  document.head.appendChild(style);

  const legacyMarkerSelector=[...retiredSelectors,'#v26-hero','[id^="v25-ad-"]','[data-v30-legacy-home="1"]'].join(',');
  function releaseQuarantine(){
    $$('[data-v109-quarantined="1"]').forEach(el=>{delete el.dataset.v109Quarantined;el.removeAttribute('aria-hidden')});
  }
  function quarantineLegacy(root=document){
    if(!publicHome())return 0;let count=0;
    const markers=[];
    if(root?.nodeType===1&&root.matches?.(legacyMarkerSelector))markers.push(root);
    if(root?.querySelectorAll)markers.push(...root.querySelectorAll(legacyMarkerSelector));
    const seen=new Set();
    markers.forEach(marker=>{
      if(!marker?.isConnected||seen.has(marker))return;seen.add(marker);
      if(marker.closest?.('#v29-home-layer,#v41-home-pricing,#v55-topbar'))return;
      let target=marker.matches?.('main,[role="main"]')?marker:marker.closest?.('main,[role="main"]');
      if(!target||target.closest?.('#v29-home-layer,#v41-home-pricing,#v55-topbar'))target=marker;
      if(target.id==='v51-main'||target.closest?.('#v51-sidebar,#v51-main,#v53-emergency'))return;
      target.dataset.v109Quarantined='1';target.setAttribute('aria-hidden','true');count++;
    });
    return count;
  }
  function prune(){
    if(!publicHome()){releaseQuarantine();return}
    document.body?.classList.add('v55-public-home');
    document.documentElement.classList.add('v55-public-home');
    window.__SCHOLARK_V29_HOME__?.sync?.();
    window.__SCHOLARK_V30_DEMO__?.sync?.();
    retiredSelectors.forEach(sel=>$$(sel).forEach(el=>{if(el.closest('#v29-home-layer,#v41-home-pricing,#v55-topbar'))return;el.remove()}));
    quarantineLegacy(document.body||document);
    const homes=$$('#v29-home-layer');
    homes.slice(1).forEach(el=>el.remove());
    const home=homes[0]||$('#v29-home-layer');
    if(home){home.hidden=false;home.removeAttribute('aria-hidden');home.classList.add('v30-native-home')}
    $$('[data-v30-legacy-home="1"]').forEach(el=>{
      if(el===home||el.closest('#v29-home-layer'))return;
      el.setAttribute('aria-hidden','true');
    });
    window.__SCHOLARK_V55_TOPBAR__?.sync?.();
  }

  function verify(){
    if(!publicHome())return {ok:true,home:false};
    const current=$('#v29-home-layer'),canonicalCount=$('#v29-home-layer').length;
    const retiredVisible=retiredSelectors.some(sel=>$$(sel).some(el=>{
      const cs=getComputedStyle(el),r=el.getBoundingClientRect();
      return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>.01&&r.width>2&&r.height>2;
    }));
    const legacyVisible=$$('[data-v30-legacy-home="1"]').some(el=>{
      const cs=getComputedStyle(el),r=el.getBoundingClientRect();
      return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>.01&&r.width>2&&r.height>2;
    });
    const quarantinedVisible=$('[data-v109-quarantined="1"]').some(el=>{const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>.01&&r.width>2&&r.height>2});
    return {ok:canonicalCount===1&&!!current&&!current.hidden&&!retiredVisible&&!legacyVisible&&!quarantinedVisible,home:true,current:!!current,canonicalCount,retiredVisible,legacyVisible,quarantinedVisible,owner:window.__SCHOLARK_HOME_OWNER_LOCK__};
  }

  let guardTimer=0;const schedule=()=>[0,60,180,500,1200].forEach(ms=>setTimeout(prune,ms));
  const guard=new MutationObserver(muts=>{if(!publicHome())return;let relevant=false;for(const m of muts){for(const n of m.addedNodes){if(n?.nodeType!==1)continue;if(n.id==='v29-home-layer'||n.matches?.(legacyMarkerSelector)||n.querySelector?.(legacyMarkerSelector)){relevant=true;break}}if(relevant||[...m.removedNodes].some(n=>n?.id==='v29-home-layer'))break}if(relevant){clearTimeout(guardTimer);guardTimer=setTimeout(prune,25)}});
  const startGuard=()=>{if(document.body)guard.observe(document.body,{childList:true,subtree:true});else addEventListener('DOMContentLoaded',()=>guard.observe(document.body,{childList:true,subtree:true}),{once:true})};startGuard();
  addEventListener('hashchange',schedule);addEventListener('popstate',schedule);addEventListener('pageshow',schedule);
  addEventListener('scholark-return-home',schedule);addEventListener('scholark-runtime-ready',schedule);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
  schedule();

  window.__SCHOLARK_V109_HOME__={prune,verify,quarantineLegacy,owner:'v29-active-learning',legacyHomeLocked:true,release:'r177'};
})();