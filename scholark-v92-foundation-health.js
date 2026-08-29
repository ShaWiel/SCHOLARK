(() => {
  if(window.__SCHOLARK_V92_FOUNDATION__)return;
  window.__SCHOLARK_V92_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)],clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const modern=new Set(['dashboard','studio','tutor','education','language','planner','progress','goal','project','files','schools','study','book']);
  const route=()=>String(location.hash||'').replace(/^#/,'').split('-')[0].toLowerCase();

  function reconcile(){
    const r=route();if(!modern.has(r))return;
    document.body.classList.add('v51-workspace');
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
    try{const r=await fetch(path,{cache:'no-store'});return {ok:r.ok,status:r.status}}catch(e){return {ok:false,error:clean(e?.message||e)}}
  }
  function duplicateIds(){
    const seen=new Set(),dups=new Set();$$('[id]').forEach(el=>{if(seen.has(el.id))dups.add(el.id);seen.add(el.id)});return [...dups].filter(x=>!/^v25-|^sv24-/.test(x)).slice(0,20)
  }
  async function selftest(){
    const checks={
      sidebar:!!$('#v51-sidebar'),workspaceMain:!!$('#v51-main'),
      learningApi:!!window.__SCHOLARK_V62_LEARNING_API__,bookApi:!!window.__SCHOLARK_V65_BOOK__,
      cloudApi:!!window.__SCHOLARK_V72_CLOUD__,i18n:!!window.__SCHOLARK_I18N__,workspacePolish:!!window.__SCHOLARK_V91__,languageLearner:!!window.__SCHOLARK_V93_LANGUAGE__,performanceFoundation:!!window.__SCHOLARK_PERF__,
      duplicateIds:duplicateIds()
    };
    const [learning,exporter]=await Promise.all([endpoint('/api/learning/health'),endpoint('/api/export/health')]);
    checks.learningEndpoint=learning;checks.exportEndpoint=exporter;
    const ok=checks.sidebar&&checks.workspaceMain&&checks.learningApi&&checks.bookApi&&checks.i18n&&learning.ok&&exporter.ok&&checks.duplicateIds.length===0;
    const report={ok,at:new Date().toISOString(),route:route(),checks};
    try{sessionStorage.setItem('scholark_foundation_health',JSON.stringify(report))}catch{}
    console[ok?'log':'warn']('[SCHOLARK] Client foundation self-test '+(ok?'PASS':'WARN'),report);
    return report;
  }
  addEventListener('hashchange',()=>{reconcile();setTimeout(reconcile,180)});addEventListener('popstate',reconcile);addEventListener('focus',reconcile);
  new MutationObserver(()=>{clearTimeout(window.__v92reconcile);window.__v92reconcile=setTimeout(reconcile,110)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
  setTimeout(reconcile,180);setTimeout(selftest,1400);
  window.__SCHOLARK_HEALTH__={selftest,reconcile,last:()=>{try{return JSON.parse(sessionStorage.getItem('scholark_foundation_health')||'null')}catch{return null}}};
})();