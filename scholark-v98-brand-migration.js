(() => {
  if(window.__SCHOLARK_V98_BRAND_MIGRATION__)return;
  window.__SCHOLARK_V98_BRAND_MIGRATION__=true;

  const PRODUCT='SCHOLAVERUM';
  const LOGO='/scholaverum-logo-r241.png';
  const LEGACY=/\bStudent\s*OS(?:\s*360)?\b/gi;
  const OLD_BRAND=/\bSCHOLARK\b/gi;
  const OLD_HOST=/studentos-360-shawiel-7vsm\.onrender\.com/gi;
  const OLD_MARKER=/\bSCHOLARK\b|Student\s*OS(?:\s*360)?/i;
  const OLD_LOGO=/student\s*os|studentos|scholark-logo|scholaverum-logo\.webp|scholaverum-logo\.png/i;
  let queued=false;

  function cleanString(value){
    return String(value??'')
      .replace(LEGACY,PRODUCT)
      .replace(OLD_BRAND,PRODUCT)
      .replace(OLD_HOST,'scholark-app-shawiel.onrender.com');
  }

  function cleanElement(el){
    if(!el||el.nodeType!==1||el.matches('script,style'))return;
    for(const attr of ['title','aria-label','placeholder','alt','data-title']){
      const v=el.getAttribute?.(attr);
      if(v&&OLD_MARKER.test(v))el.setAttribute(attr,cleanString(v));
    }
    if(el.tagName==='A'){
      const href=el.getAttribute('href');
      if(href&&/studentos-360-shawiel-7vsm/i.test(href))el.setAttribute('href',cleanString(href));
    }
    if(el.tagName==='IMG'){
      const src=el.getAttribute('src')||'',alt=el.getAttribute('alt')||'';
      if(OLD_LOGO.test(src)||OLD_MARKER.test(alt)){
        el.setAttribute('src',LOGO);
        el.setAttribute('alt',PRODUCT+' logo');
      }
    }
  }

  function scrubText(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let n;
    while((n=walker.nextNode())){
      const parent=n.parentElement;
      if(!parent||parent.matches('script,style,textarea,[contenteditable="true"],[contenteditable=""]'))continue;
      const v=n.nodeValue||'';
      if(OLD_MARKER.test(v))n.nodeValue=cleanString(v);
    }
  }

  function scrub(){
    queued=false;
    document.title=cleanString(document.title);
    document.querySelectorAll('meta[content]').forEach(m=>{
      const v=m.getAttribute('content')||'';
      if(OLD_MARKER.test(v)||/studentos-360-shawiel-7vsm/i.test(v))m.setAttribute('content',cleanString(v));
    });
    document.querySelectorAll('img,[title],[aria-label],[placeholder],[alt],[data-title],a[href*="studentos-360-shawiel-7vsm"]').forEach(cleanElement);
    scrubText(document.body);
  }

  function schedule(){
    if(queued)return;
    queued=true;
    (window.requestIdleCallback||((fn)=>setTimeout(fn,60)))(scrub,{timeout:220});
  }

  const mo=new MutationObserver(mutations=>{
    for(const m of mutations){
      if(m.type==='characterData'&&OLD_MARKER.test(m.target?.nodeValue||'')){schedule();return}
      if(m.type==='attributes'){
        const el=m.target,v=el?.getAttribute?.(m.attributeName)||'';
        if(OLD_MARKER.test(v)||(m.attributeName==='src'&&OLD_LOGO.test(v))){schedule();return}
      }
      for(const n of m.addedNodes||[]){
        if(n.nodeType===3&&OLD_MARKER.test(n.nodeValue||'')){schedule();return}
        if(n.nodeType===1&&(OLD_MARKER.test(n.textContent||'')||OLD_LOGO.test(n.getAttribute?.('src')||''))){schedule();return}
      }
    }
  });

  if(document.documentElement)mo.observe(document.documentElement,{
    subtree:true,childList:true,characterData:true,attributes:true,
    attributeFilter:['src','alt','title','aria-label','placeholder','data-title']
  });
  for(const event of [
    'hashchange','pageshow','scholark-runtime-ready','scholark-language-applied',
    'scholark-language-ready','scholark-language-complete','scholark:topbar-ready',
    'scholark:billing-changed','scholark:auth-changed','scholark-workspace-entry-ready'
  ]) addEventListener(event,schedule);

  [0,40,180,500,1200].forEach(ms=>setTimeout(schedule,ms));
  window.__SCHOLARK_BRAND__={name:PRODUCT,logo:LOGO,scrub:schedule,release:'r241-official-logo'};
})();
