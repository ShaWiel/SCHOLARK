(() => {
  if(window.__SCHOLARK_V81_STABILITY__) return;
  window.__SCHOLARK_V81_STABILITY__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const hash=()=>String(location.hash||'').toLowerCase();

  const css=document.createElement('style');
  css.id='scholark-v81-style';
  css.textContent=`
    #v81-net{position:fixed;z-index:2147483646;left:50%;top:12px;transform:translateX(-50%);display:none;align-items:center;gap:10px;max-width:min(720px,calc(100vw - 24px));padding:10px 13px;border-radius:999px;background:#17191f;color:#fff;box-shadow:0 14px 38px rgba(0,0,0,.24);font:800 9px/1.3 Inter,system-ui}
    #v81-net.show{display:flex}#v81-net.warn{background:#6e541f}#v81-net.err{background:#7f3030}#v81-net button{border:0;border-radius:999px;background:#c9ff6a;color:#17191f;padding:7px 10px;font:900 8px Inter;cursor:pointer}
    .v81-onboarding-fix{box-sizing:border-box!important;padding-top:96px!important;min-height:100vh!important}
    .v81-onboarding-fix .v81-onboarding-card{margin-top:0!important}
    .v65-form .v81-field{display:grid;gap:5px}.v65-form .v81-field>label{font:900 7.5px Inter;color:#6f6975;letter-spacing:.04em}
    body.v51-workspace #v29-home-layer{display:none!important}
    body.v81-home #v29-home-layer{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    body.v81-home [data-v30-legacy-home="1"]{display:none!important}
    @media(max-width:720px){.v81-onboarding-fix{padding-top:82px!important}.v65-h h1{font-size:clamp(34px,11vw,48px)!important}.v65-form{padding:15px!important}.v65-row{grid-template-columns:1fr!important}}
  `;
  document.head.appendChild(css);

  const banner=document.createElement('div');
  banner.id='v81-net';
  banner.innerHTML='<span></span><button type="button">Retry</button>';
  document.body.appendChild(banner);
  const msg=$('span',banner), retry=$('button',banner);

  function setBanner(text,type=''){
    msg.textContent=text||'';
    banner.className=text?'show '+type:'';
  }
  function networkState(){
    if(navigator.onLine===false) setBanner('You are offline. SCHOLARK will keep local work where possible and sync again when the connection returns.','warn');
    else if(banner.classList.contains('warn')) setBanner('Back online. Reconnecting SCHOLARK…');
    else if(!banner.classList.contains('err')) setBanner('');
  }
  retry.onclick=async()=>{
    setBanner('Checking SCHOLARK services…');
    try{
      const r=await fetch('/api/learning/health',{cache:'no-store'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      setBanner('SCHOLARK is connected again.');
      setTimeout(()=>setBanner(''),1400);
      window.dispatchEvent(new Event('focus'));
    }catch{setBanner('SCHOLARK could not reconnect yet. Your local work is still preserved.','err')}
  };
  addEventListener('online',networkState);addEventListener('offline',networkState);networkState();

  async function logError(message,stack='',context={}){
    try{
      const cloud=window.__SCHOLARK_V72_CLOUD__,s=cloud?.currentSession?.();
      if(!s?.user?.id||!cloud?.request) return;
      await cloud.request('/rest/v1/client_errors',{
        method:'POST',headers:{Prefer:'return=minimal'},
        body:JSON.stringify({user_id:s.user.id,message:clean(message).slice(0,1200),stack:String(stack||'').slice(0,12000),route:location.pathname+location.hash,user_agent:navigator.userAgent,severity:'error',context})
      });
    }catch{}
  }
  addEventListener('error',e=>{const m=clean(e?.message||e?.error?.message);if(m)logError(m,e?.error?.stack,{source:'window.error'})});
  addEventListener('unhandledrejection',e=>{const r=e?.reason;logError(clean(r?.message||r||'Unhandled promise rejection'),r?.stack,{source:'unhandledrejection'})});

  function closeLegacyOverlays(keep=''){
    const map={schools:['#v50-school','#v25-schools'],study:['#v25-study'],book:['#v25-book']};
    for(const [k,selectors] of Object.entries(map)){
      if(k===keep) continue;
      selectors.forEach(sel=>$(sel)?.classList.remove('open'));
    }
    if(keep!=='studio') $('#sv24-overlay')?.classList.remove('open');
    if(keep!=='studio') $('#v41-studio-workspace')?.setAttribute('hidden','');
  }

  function forceNewHome(){
    const h=hash();
    const home=!h||h==='#home'||h==='#start';
    document.body.classList.toggle('v81-home',home);
    if(!home) return;
    closeLegacyOverlays();
    document.body.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    const layer=$('#v29-home-layer');
    if(layer){
      layer.hidden=false;layer.removeAttribute('aria-hidden');layer.classList.add('v30-native-home');layer.scrollTop=0;
      ['display','visibility','opacity','pointer-events'].forEach(p=>layer.style.removeProperty(p));
    }
    $$('[data-v30-legacy-home="1"]').forEach(el=>el.style.setProperty('display','none','important'));
    document.body.classList.add('v55-public-home');
  }

  function routeCleanup(){
    const h=hash();
    if(h==='#study'){
      closeLegacyOverlays('study');
      $('#v50-school')?.classList.remove('open');
      document.body.classList.remove('v51-schools','v51-book');
      document.body.classList.add('v51-workspace','v51-study');
    }else if(h==='#schools'){
      closeLegacyOverlays('schools');
      document.body.classList.remove('v51-study','v51-book');
      document.body.classList.add('v51-workspace','v51-schools');
    }else if(h==='#book'){
      closeLegacyOverlays('book');
      $('#v50-school')?.classList.remove('open');
      document.body.classList.remove('v51-study','v51-schools');
      document.body.classList.add('v51-workspace','v51-book');
    }else if(h==='#dashboard'){
      closeLegacyOverlays();
    }
    forceNewHome();
  }

  document.addEventListener('click',e=>{
    const home=e.target.closest?.('#v51-home,#v48-return-home,[data-return-home]');
    if(!home)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    // The Workspace shell owns return-home cleanup. Calling the same route owner
    // preserves the homepage language selector, closes every stale overlay and
    // restarts the homepage cinematic consistently.
    const api=window.__SCHOLARK_WORKSPACE__;
    if(api?.goHome){api.goHome();return}
    const old=location.href;history.replaceState(null,'',location.pathname+location.search+'#home');
    dispatchEvent(new HashChangeEvent('hashchange',{oldURL:old,newURL:location.href}));
    forceNewHome();
    setTimeout(()=>{window.__SCHOLARK_V55_TOPBAR__?.sync?.();window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.()},40);
  },true);

  function fixOnboarding(){
    const heads=$$('h1,h2,h3');
    const h=heads.find(el=>/een paar vragen|a few questions|daarna wordt alles persoonlijk|then everything becomes personal/i.test(clean(el.textContent)));
    if(!h) return;
    let root=h.closest('main,section,[role="main"],.page,.screen,.view')||h.parentElement;
    if(!root) return;
    root.classList.add('v81-onboarding-fix');
    const card=$$('form,section,div',root).filter(el=>/maak mijn scholark|make my scholark|kies je leerfase|choose your learning/i.test(clean(el.textContent))).sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0];
    card?.classList.add('v81-onboarding-card');
  }

  function labelBookFields(){
    const form=$('.v65-form');if(!form||form.dataset.v81labels)return;form.dataset.v81labels='1';
    const fields=[
      ['#v65-name','Working title'],['#v65-genre','Genre / type'],['#v65-concept','Book concept'],['#v65-audience','Audience'],
      ['#v65-pov','Point of view'],['#v65-words','Target words'],['#v65-count','Chapter count']
    ];
    fields.forEach(([sel,label])=>{
      const el=$(sel,form);if(!el||el.parentElement?.classList.contains('v81-field'))return;
      const wrap=document.createElement('div');wrap.className='v81-field';
      const l=document.createElement('label');l.textContent=label;
      el.parentNode.insertBefore(wrap,el);wrap.append(l,el);
    });
  }

  function rescueBlankWorkspace(){
    if(!document.body.classList.contains('v51-workspace'))return;
    const h=hash();
    if(!/^#(dashboard|studio|tutor|education|language|planner|progress|goal|project|files|schools|study|book)$/.test(h))return;
    const candidates=[$('#v51-main'),$('#v41-studio-workspace'),$('#v50-school'),$('#v25-book'),$('.v93')].filter(Boolean);
    const visible=candidates.some(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>80&&r.height>80});
    if(!visible){
      console.warn('[SCHOLARK] Route rescue for '+h);
      const b=$('#v51-sidebar [data-v51-tool="'+h.slice(1)+'"]');b?.click();
    }
  }

  function sync(){
    routeCleanup();fixOnboarding();labelBookFields();
    clearTimeout(window.__v81blank);window.__v81blank=setTimeout(rescueBlankWorkspace,350);
  }
  addEventListener('hashchange',()=>{setTimeout(sync,40);setTimeout(sync,220)});
  addEventListener('popstate',()=>{setTimeout(sync,40);setTimeout(sync,220)});
  [120,600].forEach(ms=>setTimeout(sync,ms));
})();