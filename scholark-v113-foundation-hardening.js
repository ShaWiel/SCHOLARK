(() => {
  if(window.__SCHOLARK_V113_FOUNDATION__) return;
  window.__SCHOLARK_V113_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??"").replace(/\s+/g," ").trim();
  const route=()=>String(location.hash||"#home").replace(/^#/,"").split(/[?&]/)[0].toLowerCase()||"home";
  const workspaceRoutes=new Set(["dashboard","ai","tutor","education","planner","focus","flashcards","assignments","progress","goal","language","files","project","schools","study"]);
  const errors=[];let repairTimer=0,longTasks=0,lastRepair=0;
  const style=document.createElement("style");style.id="scholark-v113-style";style.textContent=[
    "html.v113-hidden body.v51-workspace *{animation-play-state:paused!important}",
    "body.v51-workspace .v112-native,body.v51-workspace .v112-feature-shell{min-width:0}",
    "body.v51-workspace img{max-width:100%;height:auto}",
    "body.v51-workspace [hidden]{display:none!important}",
    "body.v51-workspace #v51-main{overscroll-behavior:contain;scrollbar-gutter:stable}",
    "body.v51-workspace .v111-live{contain:layout style}",
    "@media(max-width:620px){body.v51-workspace #v51-main{scrollbar-gutter:auto}}"
  ].join("");document.head.appendChild(style);

  const safeStorage={
    get(key,fallback=null){try{const raw=localStorage.getItem(key);if(raw==null)return fallback;try{return JSON.parse(raw)}catch{return raw}}catch{return fallback}},
    set(key,value){try{localStorage.setItem(key,typeof value==="string"?value:JSON.stringify(value));return true}catch{return false}},
    remove(key){try{localStorage.removeItem(key);return true}catch{return false}}
  };
  async function fetchJson(url,options={},timeout=15000){
    const target=new URL(String(url||""),location.origin);
    if(target.origin!==location.origin)throw new Error("Cross-origin foundation requests are blocked");
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),Math.max(1000,timeout));
    try{
      const res=await fetch(target.href,{...options,credentials:"same-origin",signal:options.signal||ctrl.signal,headers:{Accept:"application/json",...(options.headers||{})}});
      const data=await res.json().catch(()=>null);
      if(!res.ok)throw new Error(data?.error||("HTTP "+res.status));
      return data;
    }finally{clearTimeout(timer)}
  }
  function recordError(kind,event){
    const msg=clean(event?.reason?.message||event?.message||event?.error?.message||event?.reason||"Unknown runtime error");
    const source=clean(event?.filename||event?.error?.stack||"").slice(0,600);
    if(!/scholark|v1\d\d|workspace|runtime/i.test(msg+" "+source))return;
    const item={kind,message:msg.slice(0,300),source,at:Date.now()};
    if(errors.some(x=>x.message===item.message&&Date.now()-x.at<5000))return;
    errors.unshift(item);if(errors.length>30)errors.length=30;
  }
  addEventListener("error",e=>recordError("error",e),true);
  addEventListener("unhandledrejection",e=>recordError("rejection",e));

  function secureLinks(root=document){
    $$('a[target="_blank"]',root).forEach(a=>{
      const rel=new Set(clean(a.getAttribute("rel")).split(" ").filter(Boolean));rel.add("noopener");rel.add("noreferrer");a.setAttribute("rel",[...rel].join(" "));
      const href=clean(a.getAttribute("href"));if(/^javascript:/i.test(href))a.removeAttribute("href");
    });
  }
  function removeDuplicateControls(){
    const langs=$$("#v51-sidebar .v90-langbox");if(langs.length>1)langs.slice(0,-1).forEach(x=>x.remove());
    const countries=$$("#v51-sidebar #v96-side-country");if(countries.length>1)countries.slice(0,-1).forEach(x=>x.remove());
    const byParent=new Map();$$("#v51-main .v111-live").forEach(el=>{const p=el.parentElement;if(!p)return;const rows=byParent.get(p)||[];rows.push(el);byParent.set(p,rows)});byParent.forEach(rows=>{if(rows.length>1)rows.slice(0,-1).forEach(x=>x.remove())});
  }
  function scrubQuality(root=document){
    $$(".v52-pill,.v107-pill,[data-ai-quality],[data-quality-badge],.ai-quality-max",root).forEach(el=>{
      const t=clean(el.textContent).toUpperCase().replace(/[·•]/g," ").replace(/\s+/g," ");
      if(t==="AI QUALITY MAX"||t==="QUALITY MAX"||t==="PRIORITY MAX")el.remove();
    });
  }
  function ensureScroll(){
    const r=route(),work=workspaceRoutes.has(r)||document.body.classList.contains("v51-workspace");
    document.documentElement.classList.toggle("v51-workspace-root",work);
    if(!work)document.documentElement.classList.remove("v112-background","v113-hidden");
  }
  function repair(force=false){
    const now=Date.now();if(!force&&now-lastRepair<90)return;lastRepair=now;
    const scope=$("#v51-main")||document.body;ensureScroll();removeDuplicateControls();scrubQuality(scope);
    const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,40));idle(()=>secureLinks(scope),{timeout:180});
    if(document.body.classList.contains("v51-workspace")){
      if(!$("#v90-language"))window.__SCHOLARK_I18N__?.upgradeSelectors?.();
      if(!$("#v96-side-country"))window.__SCHOLARK_COUNTRY__?.apply?.();
      if(workspaceRoutes.has(route())&&route()!=="dashboard")window.__SCHOLARK_V112_VISUAL__?.decorate?.();
      if(workspaceRoutes.has(route()))window.__SCHOLARK_V114_ORCHESTRATOR__?.refresh?.();
    }
  }
  function verify(){
    const r=route(),work=workspaceRoutes.has(r)||document.body.classList.contains("v51-workspace");
    const lang=$$("#v51-sidebar #v90-language").length,country=$$("#v51-sidebar #v96-side-country").length;
    const rootLocked=!work||document.documentElement.classList.contains("v51-workspace-root");
    const quality=$$(".v52-pill,.v107-pill,[data-ai-quality],[data-quality-badge],.ai-quality-max").some(el=>/QUALITY\s*[·•]?\s*MAX/i.test(clean(el.textContent)));
    const visualReport=window.__SCHOLARK_V112_VISUAL__?.verify?.()||null,visual=!work||r==="dashboard"||visualReport?.ok===true,unifiedFeature=!work||r==="dashboard"||visualReport?.unified===true;
    const orchestration=!work||!!window.__SCHOLARK_V114_ORCHESTRATOR__&&window.__SCHOLARK_V114_ORCHESTRATOR__?.verify?.().ok!==false;
    const owners=window.__SCHOLARK_ACTION_OWNERS__||{},learningOwnerNeeded=['tutor','education','study'].includes(r),educationOwnerNeeded=r==='education',eventOwnership=!learningOwnerNeeded||(owners.tutor==='v62'&&owners.curriculum==='v62'&&owners.exam==='v62'&&(!educationOwnerNeeded||(owners.diagnostic==='v108'&&owners.review==='v108')));
    const connectedBars=$$('.v114-connect').length,connectedSurfaceHealthy=!window.__SCHOLARK_V114_ORCHESTRATOR__||(connectedBars<=1&&$$('.v108-context').length===0);
    const i18n=window.__SCHOLARK_I18N__,i18nReport=i18n?.selftest?.()||null;
    const selectors=$$("#v55-language,#v36-language,#v90-language,#v89-lang"),selectorCounts=selectors.map(x=>x.options?.length||0);
    const languageRegistry=!!i18n&&i18n.count===74&&i18nReport?.ok===true&&!i18n.langs.some(([lc])=>lc==='srn');
    const selectorsHealthy=selectorCounts.every(n=>n===74);
    const coverage=i18n?.coverage?.(620)||null;
    const result={
      ok:rootLocked&&!quality&&lang<=1&&country<=1&&visual&&unifiedFeature&&orchestration&&eventOwnership&&connectedSurfaceHealthy&&languageRegistry&&selectorsHealthy,
      release:"r191",route:r,workspace:work,rootLocked,qualityBadge:quality,unifiedFeature,visualReport,
      languageControls:lang,countryControls:country,languageRegistry,selectorCounts,selectorsHealthy,coverage,visual,orchestration,eventOwnership,connectedBars,connectedSurfaceHealthy,longTasks,errorFree:errors.filter(x=>Date.now()-x.at<300000).length===0,runtimeErrors:errors.filter(x=>Date.now()-x.at<300000).slice(0,8),
      runtimeFailures:window.__SCHOLARK_RUNTIME__?.errors?.()||[]
    };
    result.ok=result.ok&&result.runtimeFailures.length===0;
    return result;
  }
  let observer;
  function startObserver(){
    if(observer)return;
    observer=new MutationObserver(muts=>{
      if(!muts.some(m=>m.addedNodes.length||m.removedNodes.length))return;
      clearTimeout(repairTimer);repairTimer=setTimeout(()=>repair(false),170);
    });
    const observerRoot=$("#v51-main")||document.body;observer.observe(observerRoot,{subtree:true,childList:true});
  }
  try{
    if("PerformanceObserver" in window){
      const po=new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.duration>120)longTasks++});
      po.observe({entryTypes:["longtask"]});
    }
  }catch{}
  document.addEventListener("visibilitychange",()=>{document.documentElement.classList.toggle("v113-hidden",document.hidden);if(!document.hidden)repair(true)});
  addEventListener("hashchange",()=>setTimeout(()=>repair(true),55));
  addEventListener("scholark-runtime-ready",()=>setTimeout(()=>repair(true),50));
  addEventListener("scholark-workspace-change",()=>setTimeout(()=>repair(false),60));
  addEventListener("online",()=>setTimeout(()=>window.__SCHOLARK_RUNTIME__?.retry?.(),250));
  startObserver();setTimeout(()=>repair(true),35);setTimeout(()=>repair(true),300);
  const foundationApi={version:"20260924-r191",repair:()=>repair(true),verify,errors:()=>errors.filter(x=>Date.now()-x.at<300000).slice(),safeStorage,fetchJson};
  window.__SCHOLARK_FOUNDATION_R176__=foundationApi;
  window.__SCHOLARK_FOUNDATION_R175__=foundationApi;
  window.__SCHOLARK_FOUNDATION_R174__=foundationApi;
  window.__SCHOLARK_FOUNDATION_R173__=foundationApi;
  window.__SCHOLARK_FOUNDATION_R172__=foundationApi;
})();