(() => {
  if (window.__SCHOLARK_V34_DASHBOARD_ENTRY__) return;
  window.__SCHOLARK_V34_DASHBOARD_ENTRY__ = true;

  const style=document.createElement('style');
  style.id='scholark-v34-dashboard-style';
  style.textContent=`
    #v34-dashboard-entry{position:fixed;top:18px;right:28px;z-index:1400;border:0;border-radius:14px;padding:11px 17px;background:#17191f;color:#fff;font:900 11px/1 Inter,system-ui;letter-spacing:.01em;box-shadow:0 12px 34px rgba(0,0,0,.18);cursor:pointer;transition:.2s ease}
    #v34-dashboard-entry:hover{transform:translateY(-2px);background:#25283a}
    #v34-dashboard-entry span{color:#c9ff6a;margin-right:6px}
    #v34-dashboard-entry[hidden]{display:none!important}
    @media(max-width:640px){#v34-dashboard-entry{top:12px;right:12px;padding:10px 13px;font-size:10px}}
  `;
  document.head.appendChild(style);

  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').trim();

  function onPublicHome(){
    const layer=document.querySelector('#v29-home-layer.v30-native-home');
    return !!(layer && !layer.hidden && getComputedStyle(layer).display!=='none');
  }

  function findDashboardTarget(){
    const candidates=$$('button,a,[role="button"],[tabindex]')
      .filter(el=>!el.closest('#v29-home-layer') && /^(dashboard|open dashboard|dashboard openen)$/i.test(text(el)));
    if(candidates.length) return candidates[0];

    const sidebar=$$('aside,nav,section,div').find(el=>{
      if(el.closest('#v29-home-layer')) return false;
      const t=text(el);
      const r=el.getBoundingClientRect();
      return r.width>=120&&r.width<=460&&r.height>=280&&t.includes('Dashboard')&&t.includes('Studio AI');
    });
    if(sidebar){
      const exact=$$('button,a,[role="button"],div',sidebar).find(el=>/^Dashboard$/i.test(text(el)));
      if(exact) return exact;
    }
    return null;
  }

  function openDashboard(){
    const target=findDashboardTarget();
    if(target){
      target.click();
      setTimeout(()=>{
        const layer=document.getElementById('v29-home-layer');
        if(layer) layer.hidden=true;
      },60);
      return;
    }

    // Safe fallback for this single-page build.
    const layer=document.getElementById('v29-home-layer');
    if(layer) layer.hidden=true;
    const legacy=document.querySelector('[data-v30-legacy-home="1"]');
    if(legacy){legacy.style.removeProperty('display');delete legacy.dataset.v30LegacyHome;}
    location.hash='dashboard';
  }

  function sync(){
    let btn=document.getElementById('v34-dashboard-entry');
    if(!btn){
      btn=document.createElement('button');
      btn.id='v34-dashboard-entry';
      btn.type='button';
      btn.innerHTML='<span>↗</span> Dashboard';
      btn.addEventListener('click',openDashboard);
      document.body.appendChild(btn);
    }
    btn.hidden=!onPublicHome();
  }

  new MutationObserver(()=>{clearTimeout(window.__v34t);window.__v34t=setTimeout(sync,70)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,30));
  setInterval(sync,700);
  setTimeout(sync,40);
})();