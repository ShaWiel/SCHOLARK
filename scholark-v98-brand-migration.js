(() => {
  if(window.__SCHOLARK_V98_BRAND_MIGRATION__)return;
  window.__SCHOLARK_V98_BRAND_MIGRATION__=true;

  const LEGACY=/\bStudent\s*OS(?:\s*360)?\b/gi;
  const OLD_HOST=/studentos-360-shawiel-7vsm\.onrender\.com/gi;
  let queued=false;

  function cleanString(value){
    return String(value??'').replace(LEGACY,'SCHOLARK').replace(OLD_HOST,'scholark-app-shawiel.onrender.com');
  }
  function cleanElement(el){
    if(!el||el.nodeType!==1)return;
    if(el.matches('input,textarea,[contenteditable="true"],[contenteditable=""],script,style'))return;

    for(const attr of ['title','aria-label','data-title']){
      const v=el.getAttribute?.(attr);if(v&&(/student\s*os/i.test(v)||/studentos-360-shawiel-7vsm/i.test(v)))el.setAttribute(attr,cleanString(v));
    }

    if(el.tagName==='A'){
      const href=el.getAttribute('href');if(href&&/studentos-360-shawiel-7vsm/i.test(href))el.setAttribute('href',cleanString(href));
    }
    if(el.tagName==='IMG'){
      const src=el.getAttribute('src')||'',alt=el.getAttribute('alt')||'';
      if(/student\s*os|studentos/i.test(src)||/student\s*os/i.test(alt)){
        el.setAttribute('src','/scholark-logo.png');
        el.setAttribute('alt','SCHOLARK logo');
      }
    }

    [...el.childNodes].forEach(n=>{
      if(n.nodeType!==3)return;
      const v=n.nodeValue||'';
      if(/student\s*os/i.test(v))n.nodeValue=cleanString(v);
    });
  }

  function scrub(){
    queued=false;
    document.title=cleanString(document.title);
    document.querySelectorAll('meta[content]').forEach(m=>{
      const v=m.getAttribute('content')||'';
      if(/student\s*os|studentos-360-shawiel-7vsm/i.test(v))m.setAttribute('content',cleanString(v));
    });
    document.querySelectorAll('header,nav,aside,#v55-topbar,#v51-sidebar,[class*="brand" i],[class*="logo" i],[id*="brand" i],[id*="logo" i],a[href*="studentos-360-shawiel-7vsm"],img').forEach(cleanElement);
  }

  function schedule(){
    if(queued)return;queued=true;
    (window.requestIdleCallback||((fn)=>setTimeout(fn,90)))(scrub,{timeout:350});
  }

  const mo=new MutationObserver(mutations=>{
    for(const m of mutations){
      if(m.type==='characterData'&&/student\s*os/i.test(m.target?.nodeValue||'')){schedule();return}
      for(const n of m.addedNodes||[]){
        if(n.nodeType===1&&(/student\s*os/i.test(n.textContent||'')||n.matches?.('header,nav,aside,img,[class*="brand" i],[class*="logo" i]'))){schedule();return}
      }
    }
  });

  if(document.documentElement)mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  addEventListener('hashchange',schedule);
  addEventListener('scholark-runtime-ready',schedule);
  [40,350,1200].forEach(ms=>setTimeout(schedule,ms));

  window.__SCHOLARK_BRAND__={scrub:schedule,release:'r114'};
})();
