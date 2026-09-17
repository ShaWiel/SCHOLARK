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
  check(vwoHealth.hogendoornDetected===true,'Arthur Alex Hogendoorn Atheneum was not detected as VWO');
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
  await post('/api/schools/search',{country:'Suriname',city:'',level:'vwo',radius:700},'live:schools_suriname_vwo',d=>{
    check(d.strictCountry===true,'live VWO search did not enforce country boundary');
    check(d.center?.countryCode==='SR','live VWO search resolved outside Suriname');
    check(d.taxonomy?.vwo==='pre_university_vwo_atheneum_gymnasium','live VWO taxonomy is missing');
    const schools=Array.isArray(d.schools)?d.schools:[];
    check(schools.length>0,'live Suriname VWO search returned no schools');
    check(schools.every(s=>Array.isArray(s.levels)&&s.levels.includes('vwo')),'live VWO search leaked non-VWO schools');
    check(schools.some(s=>/hogendoorn.*atheneum|arthur.*hogendoorn/i.test(String(s.name||''))),'Arthur Alex Hogendoorn Atheneum is missing from live VWO results');
  },180000);
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