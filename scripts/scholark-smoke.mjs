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
async function get(path){
  try{
    const {r,data}=await request(path,{},30000);
    check(r.ok,`${path} HTTP ${r.status}`);
    check(data?.ok===true,`${path} did not report ok=true`);
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
const geminiHealth=await get('/api/gemini/health');
if(geminiHealth){
  check(geminiHealth.routerVersion==='20260917-gemini-resilience-v3','Gemini router version mismatch');
  check(geminiHealth.primaryModel==='gemini-3.8-flash','Gemini primary model mismatch');
  check(Array.isArray(geminiHealth.fallbackModels)&&geminiHealth.fallbackModels.length>=3,'Gemini fallback chain incomplete');
  check(geminiHealth.modelHealth&&typeof geminiHealth.modelHealth==='object','Gemini circuit-breaker health missing');
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
}

console.log('\nSCHOLARK SMOKE RESULTS');
for(const line of results)console.log(' ✓',line);
if(failures.length){
  console.error('\nSCHOLARK SMOKE FAILED');
  for(const f of failures)console.error(' -',f);
  process.exit(1);
}
console.log(`\nSCHOLARK SMOKE PASS · ${results.length} checks`);
