const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const paths=[
  '/api/health',
  '/api/guard/health',
  '/api/launch/health',
  '/api/launch/sources?country=Suriname',
  '/api/learning/health',
  '/api/schools/health',
  '/api/schools/resilience',
  '/api/billing/health'
];
const rounds=Math.max(8,Number(process.env.SCHOLARK_LOAD_ROUNDS)||20);
const concurrency=Math.max(4,Math.min(32,Number(process.env.SCHOLARK_LOAD_CONCURRENCY)||16));
const jobs=[];
for(let r=0;r<rounds;r++)for(const path of paths)jobs.push({r,path});
const latencies=[],failures=[];
let cursor=0,active=0,done=0;
const started=Date.now();
await new Promise(resolve=>{
  const pump=()=>{
    while(active<concurrency&&cursor<jobs.length){
      const job=jobs[cursor++];active++;
      const t=performance.now();
      const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),5000);
      fetch(base+job.path,{cache:'no-store',signal:ctrl.signal,headers:{'user-agent':'SCHOLARK-CI-load-smoke'}})
        .then(async res=>{
          const ms=performance.now()-t;latencies.push(ms);
          let body={};try{body=await res.json()}catch{}
          if(!res.ok||body?.ok===false)failures.push({path:job.path,status:res.status,code:body?.code||'',ms:Math.round(ms)});
        })
        .catch(err=>failures.push({path:job.path,status:0,error:String(err?.name||err),ms:Math.round(performance.now()-t)}))
        .finally(()=>{clearTimeout(timer);active--;done++;if(done===jobs.length)resolve();else pump()});
    }
  };
  pump();
});
latencies.sort((a,b)=>a-b);
const pct=q=>latencies[Math.min(latencies.length-1,Math.max(0,Math.ceil(latencies.length*q)-1))]||0;
const report={
  ok:failures.length===0,
  requests:jobs.length,
  concurrency,
  elapsedMs:Date.now()-started,
  p50Ms:Math.round(pct(.50)),
  p95Ms:Math.round(pct(.95)),
  p99Ms:Math.round(pct(.99)),
  maxMs:Math.round(latencies.at(-1)||0),
  failures:failures.slice(0,12)
};
console.log('SCHOLARK LOAD SMOKE',JSON.stringify(report));
if(failures.length)process.exitCode=1;
if(report.p95Ms>1500||report.maxMs>4000){console.error('Load latency budget exceeded');process.exitCode=1}
