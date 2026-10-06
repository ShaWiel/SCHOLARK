const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const isLocal=/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(base);
if(!isLocal&&!/^(1|true|yes)$/i.test(String(process.env.SCHOLARK_CAPACITY_ALLOW_LIVE||''))){
  console.error('Refusing live capacity run without SCHOLARK_CAPACITY_ALLOW_LIVE=1');
  process.exit(2);
}
const stages=(process.env.SCHOLARK_CAPACITY_STAGES||'25,50,100').split(',').map(Number).filter(x=>x>0&&x<=100);
const waves=Math.max(1,Math.min(5,Number(process.env.SCHOLARK_CAPACITY_WAVES)||2));
const schoolBody={country:'Suriname',countryCode:'SR',city:'Paramaribo',level:'all',radius:25,lat:5.852,long:-55.2038,lon:-55.2038};
async function request(kind){
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),10000),t=performance.now();
  try{
    let r;
    if(kind==='schools')r=await fetch(base+'/api/schools/search',{method:'POST',headers:{'content-type':'application/json','user-agent':'SCHOLARK-capacity-smoke'},body:JSON.stringify(schoolBody),signal:ctrl.signal});
    else if(kind==='arki')r=await fetch(base+'/api/learning/generate',{method:'POST',headers:{'content-type':'application/json','x-scholark-request-id':'capacity-'+Date.now()+'-'+Math.random().toString(36).slice(2)},body:JSON.stringify({mode:'general_ai',language:'English',prompt:'Who owns SCHOLARK?',history:[]}),signal:ctrl.signal});
    else r=await fetch(base+kind,{cache:'no-store',headers:{'user-agent':'SCHOLARK-capacity-smoke'},signal:ctrl.signal});
    const body=await r.json().catch(()=>({}));
    return {ok:r.ok&&body?.ok!==false,status:r.status,ms:performance.now()-t,kind,code:body?.code||''};
  }catch(e){return {ok:false,status:0,ms:performance.now()-t,kind,error:String(e?.name||e)}}finally{clearTimeout(timer)}
}
await request('schools'); // warm external school sources once; staged traffic should hit SCHOLARK cache.
const mix=['/api/health','/api/launch/health','/api/learning/credit-health','schools','arki'];
const reports=[];
for(const concurrency of stages){
  const jobs=Array.from({length:concurrency*waves},(_,i)=>mix[i%mix.length]);
  let cursor=0;const results=[],started=Date.now();
  await Promise.all(Array.from({length:concurrency},async()=>{while(cursor<jobs.length){const i=cursor++;results.push(await request(jobs[i]))}}));
  const lat=results.map(x=>x.ms).sort((a,b)=>a-b),pct=q=>lat[Math.min(lat.length-1,Math.max(0,Math.ceil(lat.length*q)-1))]||0;
  const failures=results.filter(x=>!x.ok),byKind={};
  for(const row of results){const k=row.kind;(byKind[k]??={requests:0,failures:0,maxMs:0}).requests++;if(!row.ok)byKind[k].failures++;byKind[k].maxMs=Math.max(byKind[k].maxMs,Math.round(row.ms))}
  const report={concurrency,requests:results.length,elapsedMs:Date.now()-started,p50Ms:Math.round(pct(.5)),p95Ms:Math.round(pct(.95)),p99Ms:Math.round(pct(.99)),maxMs:Math.round(lat.at(-1)||0),failureRate:Number((failures.length/Math.max(1,results.length)).toFixed(4)),byKind,failures:failures.slice(0,10)};
  reports.push(report);console.log('SCHOLARK CAPACITY STAGE',JSON.stringify(report));
}
const bad=reports.some(r=>r.failureRate>.01||r.p95Ms>(isLocal?2500:4500)||r.maxMs>(isLocal?8000:10000));
console.log('SCHOLARK CAPACITY SUMMARY',JSON.stringify({ok:!bad,base,isLocal,stages,reports}));
if(bad)process.exitCode=1;
