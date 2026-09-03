(() => {
  if(window.__SCHOLARK_V92_FOUNDATION__)return;
  window.__SCHOLARK_V92_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)],clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const modern=new Set(['dashboard','studio','tutor','education','language','planner','progress','goal','project','files','schools','study','book','presentation','webpage','document','report','graphic','social']);
  const route=()=>String(location.hash||'').replace(/^#/,'').split('-')[0].toLowerCase();

  function reconcile(){
    const r=route();if(!modern.has(r))return;
    document.body.classList.add('v51-workspace');
    // R97+ is the single owner of route/surface repair. This older health layer
    // must not toggle route classes again after the active tool has painted.
    if(window.__SCHOLARK_FOUNDATION__?.repair){window.__SCHOLARK_FOUNDATION__.repair();return}
    // Minimal boot fallback only until the coordinator is available.
    if(r!=='schools')$('#v50-school')?.classList.remove('open');
    if(r!=='study')$('#v25-study')?.classList.remove('open');
    if(r!=='book')$('#v25-book')?.classList.remove('open');
  }

  async function endpoint(path){
    try{const r=await fetch(path,{cache:'no-store'});return {ok:r.ok,status:r.status}}catch(e){return {ok:false,error:clean(e?.message||e)}}
  }
  function duplicateIds(){
    const seen=new Set(),dups=new Set();$$('[id]').forEach(el=>{if(seen.has(el.id))dups.add(el.id);seen.add(el.id)});return [...dups].filter(x=>!/^v25-|^sv24-/.test(x)).slice(0,20)
  }
  async function selftest(){
    const r=route(),workspaceNeeded=modern.has(r)&&r!=='home';
    const checks={
      route:r,
      sidebar:!workspaceNeeded||!!$('#v51-sidebar'),
      workspaceMain:!workspaceNeeded||!!$('#v51-main'),
      learningApi:!['tutor','education','study'].includes(r)||!!window.__SCHOLARK_V62_LEARNING_API__,
      bookApi:r!=='book'||!!window.__SCHOLARK_V65_BOOK__,
      languageApi:r!=='language'||!!window.__SCHOLARK_V93_LANGUAGE__,
      cloudApi:!!window.__SCHOLARK_V72_CLOUD__||!workspaceNeeded||!!window.__SCHOLARK_RUNTIME__,
      i18n:!!window.__SCHOLARK_I18N__,
      countryFoundation:!!window.__SCHOLARK_COUNTRY__,
      performanceFoundation:!!window.__SCHOLARK_PERF__,
      testMode:!!window.__SCHOLARK_TEST_MODE__,
      runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[],
      duplicateIds:duplicateIds()
    };
    const [rootHealth,studio,learning,exporter,schools,research,media]=await Promise.all([
      endpoint('/api/health'),endpoint('/api/studio/health'),endpoint('/api/learning/health'),endpoint('/api/export/health'),
      endpoint('/api/schools/health'),endpoint('/api/studio/research/health'),endpoint('/api/studio/image/health')
    ]);
    checks.rootEndpoint=rootHealth;checks.studioEndpoint=studio;checks.learningEndpoint=learning;checks.exportEndpoint=exporter;
    checks.schoolsEndpoint=schools;checks.researchEndpoint=research;checks.mediaEndpoint=media;
    checks.i18nReport=window.__SCHOLARK_I18N__?.selftest?.()||null;
    const endpoints=[rootHealth,studio,learning,exporter,schools,research,media];
    const ok=checks.sidebar&&checks.workspaceMain&&checks.learningApi&&checks.bookApi&&checks.languageApi&&checks.i18n&&checks.countryFoundation&&checks.performanceFoundation&&endpoints.every(x=>x.ok)&&(checks.i18nReport?.ok!==false)&&checks.duplicateIds.length===0&&checks.runtimeErrors.length===0;
    const report={ok,at:new Date().toISOString(),route:r,checks};
    try{sessionStorage.setItem('scholark_foundation_health',JSON.stringify(report))}catch{}
    console[ok?'log':'warn']('[SCHOLARK] Client foundation self-test '+(ok?'PASS':'WARN'),report);
    return report;
  }

  addEventListener('hashchange',()=>{reconcile();setTimeout(reconcile,180)});
  addEventListener('popstate',()=>{reconcile();setTimeout(reconcile,180)});
  setTimeout(reconcile,180);setTimeout(selftest,2200);addEventListener('scholark-runtime-ready',()=>setTimeout(selftest,700));
  window.__SCHOLARK_HEALTH__={selftest,reconcile,last:()=>{try{return JSON.parse(sessionStorage.getItem('scholark_foundation_health')||'null')}catch{return null}}};
})();