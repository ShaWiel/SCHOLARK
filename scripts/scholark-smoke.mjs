const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const live=process.argv.includes('--live');
const failures=[];
const results=[];

async function request(path,opts={},timeout=60000){
  const ctrl=new AbortController();
  const timer=setTimeout(()=>ctrl.abort(),timeout);
  try{
    const r=await fetch(base+path,{...opts,signal:ctrl.signal,headers:{accept:'application/json',...(opts.headers||{})}});
    const text=await r.text();
    let data;try{data=JSON.parse(text)}catch{data={raw:text}}
    return {r,data};
  }finally{clearTimeout(timer)}
}
function check(cond,msg){if(!cond)failures.push(msg)}
async function get(path,{requireOk=true}={}){
  try{
    const {r,data}=await request(path,{},30000);
    check(r.ok,`${path} HTTP ${r.status}`);
    if(requireOk)check(data?.ok===true,`${path} did not report ok=true`);
    results.push(`${path} ${r.status}`);
    return data;
  }catch(e){failures.push(`${path} threw ${e?.message||e}`);return null}
}
async function post(path,body,label,validator,timeout=90000){
  try{
    const {r,data}=await request(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)},timeout);
    check(r.ok,`${label} HTTP ${r.status}: ${data?.error||data?.raw||''}`);
    check(data?.ok===true,`${label} did not report ok=true`);
    if(r.ok&&data?.ok===true&&validator)validator(data);
    results.push(`${label} ${r.status} ${data?.provider||''}/${data?.model||''}`.trim());
    return data;
  }catch(e){failures.push(`${label} threw ${e?.message||e}`);return null}
}
async function postTransient(path,body,label,validator,timeout=90000,attempts=3){
  let lastStatus=0,lastData=null,lastError=null;
  for(let attempt=1;attempt<=attempts;attempt++){
    try{
      const {r,data}=await request(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)},timeout);
      lastStatus=r.status;lastData=data;
      if(r.ok&&data?.ok===true){
        if(validator)validator(data);
        results.push(`${label} ${r.status} attempt=${attempt}`);
        return data;
      }
      if(![502,503,504].includes(r.status))break;
    }catch(e){lastError=e}
    if(attempt<attempts)await new Promise(r=>setTimeout(r,1200*attempt));
  }
  if(lastError)failures.push(`${label} threw ${lastError?.message||lastError}`);
  else{
    failures.push(`${label} HTTP ${lastStatus}: ${lastData?.error||lastData?.raw||''}`);
    if(lastData?.ok!==true)failures.push(`${label} did not report ok=true`);
  }
  results.push(`${label} ${lastStatus||'error'}`);
  return lastData;
}

await get('/api/health');
await get('/api/guard/health');
const studioHealth=await get('/api/studio/health');
const learningHealth=await get('/api/learning/health');
const schoolHealth=await get('/api/schools/health');
const schoolResilience=await get('/api/schools/resilience');
const vwoHealth=live?await get('/api/schools/vwo-health'):null;
const geminiHealth=await get('/api/gemini/health',{requireOk:live});
if(schoolHealth){
  check(Array.isArray(schoolHealth.providers)&&schoolHealth.providers.length>=2,'School discovery providers missing');
  check(schoolHealth.strictCountry===true,'School search is not enforcing strict country boundaries');
  check(schoolHealth.version==='20260917-school-country-levels-v3','School country/level search version mismatch');
  check(/lower secondary/i.test(String(schoolHealth.levels?.secondary||'')),'Lower-secondary taxonomy missing');
  check(/upper secondary/i.test(String(schoolHealth.levels?.upper_secondary||'')),'Upper-secondary taxonomy missing');
  check(/vwo|atheneum/i.test(String(schoolHealth.levels?.vwo||'')),'VWO taxonomy missing');
  check(/vocational/i.test(String(schoolHealth.levels?.vocational||'')),'Vocational taxonomy missing');
  check(/higher education only/i.test(String(schoolHealth.levels?.higher||'')),'Higher-education taxonomy is not strict');
  check(schoolHealth.officialRoster?.configured===true,'Official Suriname school roster is not configured');
}
if(vwoHealth){
  check(vwoHealth.vwoEnabled===true,'VWO school discovery is not enabled');
  check(Number(vwoHealth.vwoCount)>0,'No VWO schools were detected in the official Suriname roster');
}
if(schoolResilience){
  check(schoolResilience.version==='20260917-school-resilience-v1','School resilience version mismatch');
  check(Array.isArray(schoolResilience.providers)&&schoolResilience.providers.some(x=>/Photon/i.test(x)),'School Photon fallback missing');
}
if(geminiHealth){
  check(geminiHealth.routerVersion==='20260917-gemini-resilience-v3','Gemini router version mismatch');
  check(geminiHealth.primaryModel==='gemini-3.8-flash','Gemini primary model mismatch');
  check(Array.isArray(geminiHealth.fallbackModels)&&geminiHealth.fallbackModels.length>=3,'Gemini fallback chain incomplete');
  check(geminiHealth.modelHealth&&typeof geminiHealth.modelHealth==='object','Gemini circuit-breaker health missing');
  check(geminiHealth.emergencyProviders&&typeof geminiHealth.emergencyProviders==='object','Emergency provider health missing');
}

if(!live){
  check(studioHealth?.testMode===true,'Local Studio smoke must run in test mode');
  check(learningHealth?.testMode===true,'Local Learning smoke must run in test mode');
  const studioModes=['presentation','webpage','document','social','graphic'];
  for(const mode of studioModes){
    await post('/api/studio/generate',{mode,prompt:`SCHOLARK smoke test for ${mode}`,count:mode==='presentation'?3:2,language:'English'},`studio:${mode}`,d=>{
      check(d.artifact&&Array.isArray(d.artifact.sections)&&d.artifact.sections.length>0,`studio:${mode} returned no sections`);
    },45000);
  }
  const learningCases=[
    ['tutor',{mode:'tutor',prompt:'Explain gravity briefly.',level:'student',language:'English'}],
    ['exam',{mode:'exam',prompt:'Create a short mathematics practice exam.',subject:'Mathematics',count:3,language:'English'}],
    ['curriculum',{mode:'curriculum',prompt:'Build a short biology learning roadmap.',subject:'Biology',language:'English'}],
    ['study_ahead',{mode:'study_ahead',prompt:'Prepare for computer science.',field:'Computer Science',language:'English'}],
    ['language_learning',{mode:'language_learning',prompt:'Teach beginner greetings.',targetLanguage:'Spanish',nativeLanguage:'English',proficiency:'A1',learningGoal:'conversation',language:'English'}],
  ];
  for(const [mode,body] of learningCases){
    await post('/api/learning/generate',body,`learning:${mode}`,d=>{
      check(d.result&&typeof d.result==='object',`learning:${mode} returned no structured result`);
    },45000);
  }
}else{
  check(geminiHealth?.liveEnabled===true,'Live Gemini router is not enabled');
  check(geminiHealth?.configured===true,'Live Gemini key is not configured');
  await post('/api/schools/search',{country:'Suriname',city:'Paramaribo',level:'secondary',radius:100},'live:schools_suriname_lower_secondary',d=>{
    check(d.strictCountry===true,'live school search did not enforce country boundary');
    check(d.center?.countryCode==='SR','live school search resolved outside Suriname');
    check(d.taxonomy?.secondary==='lower_secondary','live school search taxonomy is not lower-secondary strict');
    const schools=Array.isArray(d.schools)?d.schools:[];
    check(schools.length>0,'live Suriname lower-secondary search returned no schools');
    check(schools.every(s=>Array.isArray(s.levels)&&s.levels.includes('lower_secondary')),'live lower-secondary search leaked other education levels');
    const explicitForeign=schools.filter(s=>{const c=String(s.tags?.['addr:country']||'').trim().toUpperCase();return c&&c!=='SR'&&c!=='SURINAME'});
    check(explicitForeign.length===0,'live Suriname search returned explicitly foreign schools');
    check(Array.isArray(d.sourceStatus)&&d.sourceStatus.some(s=>/MinOWC official school list/i.test(String(s.source||''))&&s.ok===true),'official Suriname school roster was not used');
  },180000);
  await postTransient('/api/schools/search',{country:'Suriname',city:'',level:'vwo',radius:700},'live:schools_suriname_vwo',d=>{
    check(d.strictCountry===true,'live VWO search did not enforce country boundary');
    check(d.center?.countryCode==='SR','live VWO search resolved outside Suriname');
    check(d.taxonomy?.vwo==='pre_university_vwo_atheneum_gymnasium','live VWO taxonomy is missing');
    const schools=Array.isArray(d.schools)?d.schools:[];
    check(schools.length>0,'live Suriname VWO search returned no schools');
    check(schools.every(s=>Array.isArray(s.levels)&&s.levels.includes('vwo')),'live VWO search leaked non-VWO schools');
  },180000);
  try{
    const {r,data}=await request('/scholark-v105-school-vwo.js?v=20260918-school-vwo-v6',{},30000);
    const src=String(data?.raw||'');
    check(r.ok,'live VWO frontend module HTTP '+r.status);
    check(src.includes("const VERSION='20260918-school-vwo-v6'"),'live VWO frontend module is stale');
    check(src.includes('Arthur Alex Hogendoorn Atheneum'),'live VWO frontend module is missing Hogendoorn Atheneum fallback');
    check(src.includes('patchServerFetch')&&src.includes("level:'vwo'"),'live VWO frontend module is not patching VWO search results');
    check(src.includes("opt.textContent='VWO'"),'Schools Near Me VWO label is not exactly VWO');
    check(src.includes("dashboardStage:'native-v51'"),'Dashboard VWO stage is missing');
    check(src.includes('separateDashboardVwoLabel'),'Dashboard combined VOS/HAVO card still owns the VWO label');
    check(src.includes('documentWideObserver:false'),'VWO performance guard is missing');
    check(!src.includes('bootObserver.observe(root'),'VWO module still has a document-wide boot observer');
    results.push(`live:vwo_frontend ${r.status}`);
  }catch(e){failures.push(`live:vwo_frontend threw ${e?.message||e}`)}
  try{
    const [shellRes,filterRes,homeRes]=await Promise.all([
      request('/scholark-v51-workspace-shell.js?v=20260918-r141',{},30000),
      request('/scholark-v104-school-filter-guard.js?v=20260918-school-filter-v3',{},30000),
      request('/scholark-v99-home-foundation.js?v=20260918-r141',{},30000)
    ]);
    const shell=String(shellRes.data?.raw||''),filter=String(filterRes.data?.raw||''),home=String(homeRes.data?.raw||'');
    check(shellRes.r.ok&&shell.includes("['vwo','🎓','VWO'"),'live workspace shell is missing native VWO');
    check(shell.includes('dashboardLevels()')&&shell.includes("scholark_education_track')==='vwo'"),'live native VWO selection wiring is missing');
    check(filterRes.r.ok&&filter.includes("20260918-school-filter-v3"),'live school filter guard is stale');
    check(filter.includes('documentWideObserver:false')&&!filter.includes('observer.observe(document.documentElement')&&!filter.includes('setInterval('),'live school filter still has a runaway mutation/poll loop');
    check(homeRes.r.ok&&home.includes('documentWideObserver:false')&&!home.includes('obs.observe(document.body'),'live home foundation still watches the full DOM');
    results.push(`live:responsive_foundation ${shellRes.r.status}/${filterRes.r.status}/${homeRes.r.status}`);
  }catch(e){failures.push(`live:responsive_foundation threw ${e?.message||e}`)}
  try{
    const [i18nRes,countryRes,schoolRes]=await Promise.all([
      request('/scholark-v90-i18n-engine.js?v=20260918-r141',{},30000),
      request('/scholark-v96-country-education.js?v=20260918-r141',{},30000),
      request('/scholark-v50-school-finder.js?v=20260918-r141',{},30000)
    ]);
    const i18n=String(i18nRes.data?.raw||''),country=String(countryRes.data?.raw||''),school=String(schoolRes.data?.raw||'');
    check(i18nRes.r.ok&&i18n.includes("CACHE_VERSION='v4-seven-ui'"),'live i18n cache version is stale');
    check(i18n.includes('rebuildReverseKnown')&&i18n.includes('reverseKnown.get(clean(value))'),'live i18n canonicalization guard is missing');
    check(countryRes.r.ok&&country.includes("all:'Alle niveaus'")&&country.includes("all:'Todos los niveles'"),'live school language dictionary is incomplete');
    check(country.includes("studyField:'Studie/richting (optioneel)'")&&country.includes("['upper_secondary',ui.upperFilter+upperSuffix]"),'live school locale owner is incomplete');
    check(schoolRes.r.ok&&school.includes("STUDY_FIELD_LEVELS=new Set(['upper_secondary','vwo','vocational','higher','adult'])"),'live study-field level rule is missing');
    check(school.includes("study.hidden=!visible")&&school.includes("study.disabled=!visible"),'live study-field visibility logic is missing');
    results.push(`live:language_study_foundation ${i18nRes.r.status}/${countryRes.r.status}/${schoolRes.r.status}`);
  }catch(e){failures.push(`live:language_study_foundation threw ${e?.message||e}`)}
  try{
    const [toolsRes,examRes,reviewRes,studyRes,learnRes,langRes,quizRes,schoolFinderRes,countryRes]=await Promise.all([
      request('/scholark-v52-workspace-qa.js?v=20260918-r141',{},30000),
      request('/scholark-v87-exam-mastery.js?v=20260918-r141',{},30000),
      request('/scholark-v88-learning-engine.js?v=20260918-r141',{},30000),
      request('/scholark-v83-study-ahead-cloud.js?v=20260918-r141',{},30000),
      request('/scholark-v62-learning-ai.js?v=20260918-r141',{},30000),
      request('/scholark-v93-language-learner.js?v=20260918-r141',{},30000),
      request('/scholark-v102-language-quiz.js?v=20260918-language-choice-v3',{},30000),
      request('/scholark-v50-school-finder.js?v=20260918-r141',{},30000),
      request('/scholark-v96-country-education.js?v=20260918-r141',{},30000)
    ]);
    const tools=String(toolsRes.data?.raw||''),exam=String(examRes.data?.raw||''),review=String(reviewRes.data?.raw||''),study=String(studyRes.data?.raw||''),learn=String(learnRes.data?.raw||''),lang=String(langRes.data?.raw||''),quiz=String(quizRes.data?.raw||''),school=String(schoolFinderRes.data?.raw||''),country=String(countryRes.data?.raw||'');
    check(toolsRes.r.ok&&tools.includes('Open actions')&&tools.includes('Due today')&&tools.includes('NEXT ACTION'),'live Planner workflow is incomplete');
    check(tools.includes('Add next action')&&tools.includes('linked actions done')&&tools.includes('Average goal progress'),'live Goals/Progress integration is incomplete');
    check(tools.includes('Next review')&&tools.includes("data-m-tutor")&&tools.includes('Add this study session to Planner'),'live Education & Learning actions are incomplete');
    check(examRes.r.ok&&exam.includes('saveLocalMastery(groups)')&&exam.includes('saved locally to Progress + Mastery'),'live diagnostic local mastery persistence is missing');
    check(reviewRes.r.ok&&review.includes('localReviewRows')&&review.includes('renderLocalQueue'),'live local spaced review is missing');
    check(studyRes.r.ok&&study.includes('data-v83="goal"')&&study.includes("scholark_v51_planner")&&study.includes("scholark_v52_mastery"),'live Study Ahead integration is incomplete');
    check(learnRes.r.ok&&learn.includes('const depthInstruction=')&&learn.includes("depth,prompt:'Prepare me to study '"),'live Study Ahead depth is not functional');
    check(learn.includes("STUDY_DRAFT_KEY='scholark_v62_study_draft'")&&learn.includes('restoreStudyDraft();bindStudyDraft();return live'),'live Study Ahead draft preservation is missing');
    check(learn.includes("const live=$('.v62-study',h)")&&learn.includes("if(live&&$('#v62-field',live))"),'live Study Ahead idempotent mount is missing');
    check(langRes.r.ok&&lang.includes('Exercise accuracy')&&lang.includes('adaptive=accuracy==null'),'live Language Learner adaptation is missing');
    check(quizRes.r.ok&&quiz.includes("20260918-language-choice-v3")&&quiz.includes('scholark:language-choice'),'live Language Learner choice telemetry is stale');
    check(schoolFinderRes.r.ok&&!school.includes('<option value="early">')&&school.includes("filter(x=>x.level!=='early')"),'Early childhood is still exposed by Schools Near Me');
    check(countryRes.r.ok&&!country.includes("['early',localizedStage('young',c).title]"),'Early childhood remains in the country-aware school selector');
    results.push(`live:expanded_learning_workflows ${toolsRes.r.status}/${examRes.r.status}/${reviewRes.r.status}/${studyRes.r.status}/${learnRes.r.status}/${langRes.r.status}/${quizRes.r.status}/${schoolFinderRes.r.status}`);
  }catch(e){failures.push(`live:expanded_learning_workflows threw ${e?.message||e}`)}
  try{
    const [powerRes,shellRes,runtimeRes,prepaintRes]=await Promise.all([
      request('/scholark-v106-workspace-power-tools.js?v=20260918-r141',{},30000),
      request('/scholark-v51-workspace-shell.js?v=20260918-r141',{},30000),
      request('/scholark-runtime-loader.js?v=20260918-r141',{},30000),
      request('/',{},30000)
    ]);
    const power=String(powerRes.data?.raw||''),shell=String(shellRes.data?.raw||''),runtime=String(runtimeRes.data?.raw||''),home=String(prepaintRes.data?.raw||'');
    check(powerRes.r.ok&&power.includes("version:'20260918-workspace-power-v1'"),'live workspace power tools are missing/stale');
    check(power.includes("FOCUS_KEY='scholark_v106_focus'")&&power.includes('setInterval(syncFocusView,1000)')&&power.includes('clearInterval(focusTicker)'),'live Focus Sessions lifecycle is incomplete');
    check(power.includes('scheduleCard(card,rating)')&&power.includes("rating==='again'")&&power.includes("rating==='easy'"),'live Flashcards spaced scheduling is incomplete');
    check(power.includes('Break into Planner')&&power.includes('Open in AI Tutor')&&power.includes("id='assignment-'"),'live Assignments integration is incomplete');
    check(shellRes.r.ok&&shell.includes("['focus','◷','Focus Sessions']")&&shell.includes("['flashcards','▤','Flashcards']")&&shell.includes("['assignments','✓','Assignments']"),'live workspace navigation lacks new tools');
    check(shell.includes("card('focus','◷','Focus Sessions'")&&shell.includes("card('flashcards','▤','Flashcards'")&&shell.includes("card('assignments','✓','Assignments'"),'live Dashboard lacks new tool cards');
    check(runtimeRes.r.ok&&runtime.includes("focus:['scholark-v106-workspace-power-tools.js']")&&runtime.includes("assignments:['scholark-v106-workspace-power-tools.js']"),'live runtime is not lazy-routing power tools');
    check(prepaintRes.r.ok&&home.includes('focus|flashcards|assignments'),'live prepaint is not protecting new workspace routes');
    check(power.includes('data-v106-user="1"'),'live power tools are not marking user content for localization isolation');
    results.push(`live:workspace_power_tools ${powerRes.r.status}/${shellRes.r.status}/${runtimeRes.r.status}/${prepaintRes.r.status}`);
  }catch(e){failures.push(`live:workspace_power_tools threw ${e?.message||e}`)}
  const acceptedProvider=d=>check(['gemini','pollinations'].includes(d.provider),`unexpected live AI provider ${d.provider}`);
  await post('/api/learning/generate',{mode:'tutor',prompt:'Explain photosynthesis in one concise paragraph.',level:'student',language:'English'},'live:tutor',d=>{
    acceptedProvider(d);check(d.result&&typeof d.result.answer==='string'&&d.result.answer.length>20,'live:tutor returned no lesson');
  },180000);
  await post('/api/learning/generate',{mode:'language_learning',prompt:'Teach beginner greetings.',targetLanguage:'Spanish',nativeLanguage:'English',proficiency:'A1',learningGoal:'conversation',language:'English'},'live:language_learning',d=>{
    acceptedProvider(d);check(Array.isArray(d.result?.exercises)&&d.result.exercises.length>0,'live:language_learning returned no exercises');
  },180000);
  await post('/api/studio/generate',{mode:'presentation',prompt:'Create a two-slide mini presentation about effective study habits.',count:2,language:'English'},'live:studio_presentation',d=>{
    acceptedProvider(d);check(Array.isArray(d.artifact?.sections)&&d.artifact.sections.length>=2,'live:studio_presentation returned too few slides');
  },220000);
}

console.log('\nSCHOLARK SMOKE RESULTS');
for(const line of results)console.log(' ✓',line);
if(failures.length){
  console.error('\nSCHOLARK SMOKE FAILED');
  for(const f of failures)console.error(' -',f);
  process.exit(1);
}
console.log(`\nSCHOLARK SMOKE PASS · ${results.length} checks`);