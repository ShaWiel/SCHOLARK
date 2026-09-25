(() => {
  if(window.__SCHOLARK_V92_FOUNDATION__)return;
  window.__SCHOLARK_V92_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const modern=new Set(['dashboard','studio','ai','tutor','education','language','planner','focus','flashcards','assignments','progress','goal','project','files','schools','study','book','presentation','webpage','document','report','graphic','social']);
  const inactive=new Set(['studio','presentation','webpage','document','report','graphic','social','book']);
  const route=()=>String(location.hash||'').replace(/^#/,'').split(/[\/-]/)[0].toLowerCase();
  let inflight=null,lastReport=null,lastRun=0,runtimeReady=false;

  function reconcile(){
    const r=route();if(!modern.has(r))return;
    document.body.classList.add('v51-workspace');
    if(inactive.has(r)){document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');$('#v41-studio-workspace')?.setAttribute('hidden','');$('#v25-book')?.classList.remove('open');setTimeout(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.(r==='book'?'book':'studio'),0);return}
    if(r!=='schools')$('#v50-school')?.classList.remove('open');
    if(r!=='study')$('#v25-study')?.classList.remove('open');
    if(r!=='book')$('#v25-book')?.classList.remove('open');
    if(r==='study'){
      $('#v25-study')?.classList.remove('open');
      document.body.classList.remove('v51-pro','v51-book','v51-schools');document.body.classList.add('v51-study');
      setTimeout(()=>{if(!$('#v62-field'))window.__SCHOLARK_V62_LEARNING_API__?.openStudyAhead?.()},120);
    }else if(r==='book'){
      $('#v25-book')?.classList.remove('open');document.body.classList.remove('v51-pro','v51-study','v51-schools');document.body.classList.add('v51-book');
      setTimeout(()=>{if(!$('.v65-book'))window.__SCHOLARK_V65_BOOK__?.open?.()},120);
    }else if(r==='files'){
      document.body.classList.remove('v51-pro','v51-study','v51-book','v51-schools');
      setTimeout(()=>{if(!$('.v86'))$('#v51-sidebar [data-v51-tool="files"]')?.click()},140);
    }else if(r==='language'){
      document.body.classList.remove('v51-pro','v51-study','v51-book','v51-schools');
      setTimeout(()=>{if(!$('.v93'))window.__SCHOLARK_V93_LANGUAGE__?.open?.()},140);
    }
  }

  async function endpoint(path){
    const c=new AbortController(),t=setTimeout(()=>c.abort(),8000);
    try{const r=await fetch(path,{cache:'no-store',signal:c.signal}),data=await r.clone().json().catch(()=>null);return {ok:r.ok,status:r.status,data}}
    catch(e){return {ok:false,error:e?.name==='AbortError'?'timeout':clean(e?.message||e),data:null}}
    finally{clearTimeout(t)}
  }
  function duplicateIds(){
    const seen=new Set(),dups=new Set();$$('[id]').forEach(el=>{if(seen.has(el.id))dups.add(el.id);else seen.add(el.id)});return [...dups].filter(x=>!/^v25-|^sv24-/.test(x)).slice(0,20)
  }

  async function runSelftest(){
    const r=route(),workspaceNeeded=modern.has(r);
    const checks={
      release:(window.__SCHOLARK_RUNTIME__?.version||document.documentElement.dataset.scholarkRelease||'unknown'),route:r||'home',online:navigator.onLine!==false,
      sidebar:!workspaceNeeded||!!$('#v51-sidebar'),workspaceMain:!workspaceNeeded||!!$('#v51-main'),
      learningApi:!['ai','tutor','education','study'].includes(r)||!!window.__SCHOLARK_V62_LEARNING_API__||r==='ai',
      bookApi:true,languageApi:r!=='language'||!!window.__SCHOLARK_V93_LANGUAGE__,language74:window.__SCHOLARK_I18N__?.count===74&&!window.__SCHOLARK_I18N__?.langs?.some?.(([lc])=>lc==='srn'),
      cloudApi:!workspaceNeeded||!!window.__SCHOLARK_V72_CLOUD__,connectedCore:!workspaceNeeded||!!window.__SCHOLARK_WORKSPACE_CORE__,connectedExperience:!workspaceNeeded||!!window.__SCHOLARK_V111_EXPERIENCE__,visualSystem:!workspaceNeeded||r==='dashboard'||!!window.__SCHOLARK_V112_VISUAL__,orchestrator:!workspaceNeeded||!!window.__SCHOLARK_V114_ORCHESTRATOR__,hardening:!!(window.__SCHOLARK_FOUNDATION_R176__||window.__SCHOLARK_FOUNDATION_R175__||window.__SCHOLARK_FOUNDATION_R174__||window.__SCHOLARK_FOUNDATION_R173__||window.__SCHOLARK_FOUNDATION_R172__),i18n:!!window.__SCHOLARK_I18N__,countryFoundation:!!window.__SCHOLARK_COUNTRY__,
      performanceFoundation:!!window.__SCHOLARK_PERF__,homeOwner:!window.__SCHOLARK_ROUTES__?.isHome?.()||window.__SCHOLARK_V109_HOME__?.verify?.().ok===true,runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[],duplicateIds:duplicateIds(),qualityMaxGone:!Array.from(document.querySelectorAll('.v52-pill,.v107-pill,[data-ai-quality],[data-quality-badge],.ai-quality-max')).some(el=>/QUALITY\s*[·•]?\s*MAX/i.test(clean(el.textContent)))
    };
    const paths=['/api/health','/api/guard/health','/api/learning/health','/api/export/health','/api/schools/health'];
    const results=checks.online?await Promise.all(paths.map(endpoint)):paths.map(()=>({ok:false,error:'offline'}));
    checks.endpoints=Object.fromEntries(paths.map((p,i)=>[p,results[i]]));
    const schoolHealth=checks.endpoints['/api/schools/health']?.data||{};
    checks.globalSchools=schoolHealth.global===true&&schoolHealth.countryWideWithoutCity===true&&schoolHealth.nearbyWithCoordinates===true&&schoolHealth.citySearch===true&&schoolHealth.dynamicCountryCodes===true;
    const i18n=window.__SCHOLARK_I18N__,langCode=i18n?.code?.()||document.documentElement.lang||'en',coverage=i18n?.coverage?.(620)||null;
    checks.languageReady=document.documentElement.dataset.scholarkI18nReady===langCode;
    checks.languageCoverage=coverage;
    checks.languageCoverageHealthy=langCode==='en'||!coverage||coverage.total<8||coverage.ratio>=0.78;
    checks.selectorLocks=$('select[data-sch-select-interacting="1"]').length;
    checks.selectorLocksHealthy=checks.selectorLocks===0||document.activeElement?.matches?.('select[data-sch-select-interacting="1"]');
    checks.i18nReport=i18n?.selftest?.()||null;
    const endpointOk=!checks.online||results.every(x=>x.ok);
    checks.orchestratorReport=window.__SCHOLARK_V114_ORCHESTRATOR__?.verify?.()||null;
    checks.orchestratorSelftest=window.__SCHOLARK_V114_ORCHESTRATOR__?.selftest?.()||null;
    checks.hardeningReport=(window.__SCHOLARK_FOUNDATION_R176__||window.__SCHOLARK_FOUNDATION_R175__||window.__SCHOLARK_FOUNDATION_R174__||window.__SCHOLARK_FOUNDATION_R173__||window.__SCHOLARK_FOUNDATION_R172__)?.verify?.()||null;
    const ok=checks.sidebar&&checks.workspaceMain&&checks.learningApi&&checks.bookApi&&checks.languageApi&&checks.language74&&checks.globalSchools&&checks.languageReady&&checks.languageCoverageHealthy&&checks.selectorLocksHealthy&&checks.cloudApi&&checks.connectedCore&&checks.connectedExperience&&checks.visualSystem&&checks.orchestrator&&checks.hardening&&checks.homeOwner&&checks.qualityMaxGone&&checks.i18n&&checks.countryFoundation&&checks.performanceFoundation&&endpointOk&&(checks.i18nReport?.ok!==false)&&(checks.orchestratorReport?.ok!==false)&&(checks.orchestratorSelftest?.ok!==false)&&(checks.hardeningReport?.ok!==false)&&!checks.duplicateIds.length&&!checks.runtimeErrors.length;
    const report={ok,at:new Date().toISOString(),route:r||'home',checks};
    lastReport=report;lastRun=Date.now();
    try{sessionStorage.setItem('scholark_foundation_health',JSON.stringify(report))}catch{}
    console[ok?'log':'warn']('[SCHOLARK] Client foundation self-test '+(ok?'PASS':'WARN'),report);
    return report;
  }

  function selftest(force=false){
    if(inflight)return inflight;
    if(!force&&lastReport&&Date.now()-lastRun<60000)return Promise.resolve(lastReport);
    inflight=runSelftest().finally(()=>{inflight=null});
    return inflight;
  }

  addEventListener('hashchange',()=>{reconcile();setTimeout(reconcile,180);setTimeout(()=>selftest(false),900)});
  addEventListener('popstate',()=>{reconcile();setTimeout(reconcile,180)});
  addEventListener('online',()=>setTimeout(()=>selftest(true),500));
  addEventListener('scholark-runtime-ready',()=>{runtimeReady=true;setTimeout(()=>selftest(false),700)});
  setTimeout(reconcile,180);
  setTimeout(()=>{if(!runtimeReady)selftest(false)},3200);
  window.__SCHOLARK_HEALTH__={selftest,reconcile,refresh:()=>selftest(true),last:()=>lastReport||(()=>{try{return JSON.parse(sessionStorage.getItem('scholark_foundation_health')||'null')}catch{return null}})()};
})();