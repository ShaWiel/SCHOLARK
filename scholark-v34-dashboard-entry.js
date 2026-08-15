(() => {
  if (window.__SCHOLARK_V34_DASHBOARD_ENTRY__) return;
  window.__SCHOLARK_V34_DASHBOARD_ENTRY__ = true;

  const USED_KEY='scholark_dashboard_entry_used';
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
  const visible=el=>{
    if(!el) return false;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0&&r.width>1&&r.height>1;
  };

  function wasUsed(){
    try{return sessionStorage.getItem(USED_KEY)==='1'}catch{return false}
  }
  function markUsed(){
    try{sessionStorage.setItem(USED_KEY,'1')}catch{}
  }

  function onPublicHome(){
    const layer=document.querySelector('#v29-home-layer.v30-native-home');
    return !!(layer && !layer.hidden && getComputedStyle(layer).display!=='none');
  }

  function findSidebar(){
    const tokens=['Dashboard','Education & Learning','Studio AI','Planner','Progress'];
    return $$('aside,nav,section,div')
      .filter(el=>!el.closest('#v29-home-layer'))
      .map(el=>({el,hits:tokens.filter(t=>(el.textContent||'').includes(t)).length,r:el.getBoundingClientRect()}))
      .filter(o=>o.hits>=3 && o.r.width>=120 && o.r.width<=480 && o.r.height>=250)
      .sort((a,b)=>b.hits-a.hits || a.r.width-b.r.width)[0]?.el||null;
  }

  function dashboardItem(sidebar){
    if(!sidebar) return null;
    return $$('button,a,[role="button"],[tabindex],div',sidebar)
      .filter(el=>/^Dashboard$/i.test(text(el)))
      .sort((a,b)=>{
        const aa=['BUTTON','A'].includes(a.tagName)?0:1;
        const bb=['BUTTON','A'].includes(b.tagName)?0:1;
        return aa-bb;
      })[0]||null;
  }

  function revealWorkspace(){
    // Stop showing the marketing/public home immediately.
    const layer=document.getElementById('v29-home-layer');
    if(layer){
      layer.hidden=true;
      layer.style.setProperty('display','none','important');
    }

    // Restore the original SCHOLARK application content that V30 hid on Home.
    const legacy=document.querySelector('[data-v30-legacy-home="1"]');
    if(legacy){
      delete legacy.dataset.v30LegacyHome;
      legacy.style.removeProperty('display');
      legacy.hidden=false;
    }

    document.body?.classList.remove('v31-public-home');
  }

  function activateDashboard(){
    revealWorkspace();
    if((location.hash||'').toLowerCase()!=='#dashboard') location.hash='dashboard';

    // Give the SPA one render cycle, then explicitly activate its real sidebar Dashboard item.
    let attempts=0;
    const timer=setInterval(()=>{
      attempts++;
      revealWorkspace();
      const side=findSidebar();
      const item=dashboardItem(side);
      if(item){
        try{item.click()}catch{}
        if(side){
          side.style.removeProperty('display');
          side.style.removeProperty('visibility');
          side.style.removeProperty('opacity');
        }
        clearInterval(timer);
      }else if(attempts>=12){
        clearInterval(timer);
      }
    },100);
  }

  function openDashboard(){
    markUsed();
    const btn=document.getElementById('v34-dashboard-entry');
    if(btn){btn.hidden=true;btn.style.setProperty('display','none','important');}

    // Prefer the app's own existing dashboard control when available.
    const native=$$('button,a,[role="button"],[tabindex]')
      .filter(el=>el.id!=='v34-dashboard-entry'&&!el.closest('#v29-home-layer'))
      .find(el=>/^(open dashboard|dashboard openen)$/i.test(text(el)));

    revealWorkspace();
    if(native){try{native.click()}catch{}}
    activateDashboard();
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

    // Once clicked, this entry button stays gone for the rest of this browser session.
    btn.hidden=wasUsed() || !onPublicHome();
    if(btn.hidden) btn.style.setProperty('display','none','important');
    else btn.style.removeProperty('display');
  }

  new MutationObserver(()=>{clearTimeout(window.__v34t);window.__v34t=setTimeout(sync,70)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,30));
  setInterval(sync,700);
  setTimeout(sync,40);
})();