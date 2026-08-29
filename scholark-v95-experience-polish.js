(() => {
  if(window.__SCHOLARK_V95_EXPERIENCE__)return;
  window.__SCHOLARK_V95_EXPERIENCE__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  document.documentElement.dataset.scholarkRelease='95';

  const css=document.createElement('style');css.id='scholark-v95-style';css.textContent=`
    :root{--sch-ease:cubic-bezier(.2,.75,.25,1);--sch-shadow:0 22px 65px rgba(31,27,63,.09);--sch-line:rgba(23,25,31,.09)}
    *{scrollbar-width:thin;scrollbar-color:rgba(109,93,252,.35) transparent}
    button,a,select,input,textarea{transition:border-color .18s ease,box-shadow .18s ease,transform .18s var(--sch-ease),background .18s ease}
    button:focus-visible,a:focus-visible,select:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid rgba(109,93,252,.28)!important;outline-offset:2px!important}
    #v29-home-layer{background:radial-gradient(circle at 88% 8%,rgba(109,93,252,.08),transparent 22%),linear-gradient(180deg,#f7f6f1,#f3f2ed 62%,#f7f6f1)}
    #v29-home-layer .v29-section,#v41-home-pricing,#v55-workspace-cta{scroll-margin-top:96px}
    #v29-home-layer .v29-studio,#v29-home-layer .v29-bento-card,#v41-home-pricing .v41-plan{box-shadow:var(--sch-shadow)}
    #v29-home-layer .v29-future{box-shadow:0 30px 90px rgba(31,24,86,.2)}
    #v29-home-layer .v29-type,#v29-home-layer .v29-tab,#v29-home-layer .v29-future-card button{min-height:42px}
    #v41-home-pricing{position:relative;isolation:isolate}
    #v41-home-pricing:before{content:'';position:absolute;z-index:-1;inset:-36px -12px;border-radius:40px;background:radial-gradient(circle at 50% 0,rgba(109,93,252,.08),transparent 50%);pointer-events:none}
    .v41-plan{border-color:var(--sch-line)!important}.v41-plan:hover{transform:translateY(-5px);box-shadow:0 32px 82px rgba(31,27,63,.14)!important}
    body.v51-workspace #v51-main{background:radial-gradient(circle at 82% 2%,rgba(109,93,252,.07),transparent 23%),linear-gradient(180deg,#faf9f5,#f5f4ef)}
    body.v51-workspace #v51-sidebar{box-shadow:16px 0 48px rgba(10,12,18,.13)}
    body.v51-workspace .v51-card,body.v51-workspace .v91-quick button,body.v51-workspace .v51-level{border:1px solid var(--sch-line);box-shadow:0 12px 34px rgba(31,27,63,.045)}
    body.v51-workspace .v51-card:hover,body.v51-workspace .v91-quick button:hover,body.v51-workspace .v51-level:hover{transform:translateY(-3px);box-shadow:0 20px 48px rgba(31,27,63,.09)}
    body.v51-workspace .v51-nav{border-radius:13px}.v51-nav.active{box-shadow:inset 3px 0 0 #c9ff6a}
    body.v51-workspace .v51-page{max-width:1560px;margin:0 auto}
    body.v51-workspace input,body.v51-workspace textarea,body.v51-workspace select{max-width:100%}
    .v95-reveal{opacity:0;transform:translateY(14px)}.v95-reveal.v95-in{opacity:1;transform:none;transition:opacity .45s var(--sch-ease),transform .45s var(--sch-ease)}
    .v95-toast{position:fixed;z-index:2147483600;right:18px;bottom:18px;max-width:min(420px,calc(100vw - 36px));padding:12px 14px;border-radius:14px;background:#17191f;color:#fff;box-shadow:0 20px 55px rgba(0,0,0,.28);font:750 9px/1.45 Inter;opacity:0;transform:translateY(10px);pointer-events:none;transition:.22s var(--sch-ease)}.v95-toast.open{opacity:1;transform:none}.v95-toast b{color:#c9ff6a}
    @media(max-width:900px){body.v51-workspace .v51-page{max-width:none}.v41-plan:hover,.v51-card:hover,.v91-quick button:hover{transform:none!important}}
    @media(prefers-reduced-motion:reduce){.v95-reveal,.v95-reveal.v95-in{opacity:1;transform:none;transition:none}.v41-plan:hover,.v51-card:hover,.v91-quick button:hover{transform:none!important}}
  `;document.head.appendChild(css);

  let toast=null,timer=null;
  function notify(message){
    if(!toast){toast=document.createElement('div');toast.className='v95-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.appendChild(toast)}
    toast.innerHTML=message;toast.classList.add('open');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('open'),2600);
  }

  const io='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v95-in');io.unobserve(e.target)}}),{rootMargin:'80px 0px',threshold:.05}):null;
  function reveal(){
    if(!io)return;$$('#v29-home-layer .v29-section,#v41-home-pricing,#v55-workspace-cta').forEach(el=>{if(el.dataset.v95Reveal)return;el.dataset.v95Reveal='1';el.classList.add('v95-reveal');io.observe(el)});
  }

  function harden(){
    if(localStorage.getItem('scholark_ui_language')==='srn')localStorage.setItem('scholark_ui_language','nl');
    $('option').forEach(o=>{const v=String(o.value||'').toLowerCase(),t=String(o.textContent||'').trim().toLowerCase();if(v==='srn'||t==='sranan tongo')o.remove()});
    reveal();
    $$('img').forEach(img=>{if(!img.decoding)img.decoding='async'});
    $$('[id$="status"],[class*="status"]').forEach(el=>{if(!el.getAttribute('aria-live'))el.setAttribute('aria-live','polite')});
    const h=(location.hash||'').toLowerCase();
    if((h===''||h==='#home'||h==='#pricing')&&$('#v41-home-pricing')){
      const p=$('#v41-home-pricing');p.hidden=false;p.style.removeProperty('display');p.style.removeProperty('visibility');p.style.removeProperty('opacity');
    }
  }

  addEventListener('scholark-language-ready',e=>notify('<b>Language ready:</b> '+(window.__SCHOLARK_I18N__?.nativeName?.(e.detail?.code)||e.detail?.code||'')));
  addEventListener('hashchange',()=>setTimeout(harden,40));addEventListener('resize',()=>setTimeout(harden,80),{passive:true});
  new MutationObserver(()=>{clearTimeout(window.__v95t);window.__v95t=setTimeout(harden,120)}).observe(document.documentElement,{subtree:true,childList:true});
  setTimeout(harden,180);
  window.__SCHOLARK_V95__={harden,notify};
})();