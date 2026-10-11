import http from 'node:http';

const listen=server=>new Promise((resolve,reject)=>{
  server.once('error',reject);
  server.listen(0,'127.0.0.1',()=>resolve(server.address().port));
});
const close=server=>new Promise(resolve=>server.close(()=>resolve()));
const check=(cond,msg)=>{if(!cond)throw new Error(msg)};
const reply=(res,status,body)=>{
  res.writeHead(status,{'content-type':'application/json'});
  res.end(JSON.stringify(body));
};

let costAttempts=0,walletAttempts=0,quotaAttempts=0,quotaConsumeAttempts=0,chargeAttempts=0;
const supabase=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://127.0.0.1');
  if(u.pathname==='/rest/v1/ai_feature_costs'){
    costAttempts++;
    if(costAttempts===1){req.socket.destroy();return}
    return reply(res,200,[{credits:1}]);
  }
  if(u.pathname==='/rest/v1/credit_wallets'){
    walletAttempts++;
    if(walletAttempts===1){req.socket.destroy();return}
    return reply(res,200,[{balance:100,plan:'free',monthly_allowance:100}]);
  }
  if(u.pathname==='/rest/v1/rpc/free_ai_quota_status'){
    quotaAttempts++;
    if(quotaAttempts===1){req.socket.destroy();return}
    return reply(res,200,{ok:true,quota:{limited:true,plan:'free',chatLimit:20,chatUsed:1,chatRemaining:19,attachmentLimit:15,attachmentUsed:0,attachmentRemaining:15,resetAt:new Date(Date.now()+86400000).toISOString()}});
  }
  if(u.pathname==='/rest/v1/rpc/consume_free_ai_quota_once'){
    quotaConsumeAttempts++;
    if(quotaConsumeAttempts===1){req.socket.destroy();return}
    return reply(res,200,{ok:true,idempotent:false,quota:{limited:true,plan:'free',chatLimit:20,chatUsed:2,chatRemaining:18,attachmentLimit:15,attachmentUsed:0,attachmentRemaining:15,resetAt:new Date(Date.now()+86400000).toISOString()}});
  }
  if(u.pathname==='/rest/v1/rpc/consume_feature_credits_once'){
    chargeAttempts++;
    if(chargeAttempts===1){req.socket.destroy();return}
    return reply(res,200,{ok:true,spent:1,balance:99,idempotent:false});
  }
  reply(res,404,{message:'mock route not found'});
});

const supaPort=await listen(supabase);
process.env.SCHOLARK_TEST_MODE='0';
process.env.SUPABASE_URL='http://127.0.0.1:'+supaPort;
process.env.SUPABASE_PUBLISHABLE_KEY='pk_credit_resilience_test';
process.env.GEMINI_API_KEY='mock-gemini-provider-key';
delete process.env.OPENAI_API_KEY;
delete process.env.POLLINATIONS_API_KEY;

// Exercise the real credits pipeline with a simulated *valid* AI response.
// Production must not count an offline placeholder as a successful paid answer.
const nativeFetch=globalThis.fetch.bind(globalThis);
globalThis.fetch=async(input,options={})=>{
  if(String(input).startsWith('https://generativelanguage.googleapis.com/')){
    const payload=JSON.parse(String(options.body||'{}'));
    let mode='general_ai';
    try{mode=JSON.parse(payload.contents?.[0]?.parts?.[0]?.text||'{}').mode||mode}catch{}
    const result=mode==='tutor'?{
      answer:'Review the requested lesson in stages and explain how to check each step.',
      summary:'Mock guided lesson for credit resilience',
      steps:['Understand the problem','Work through the evidence','Check the conclusion'],
      examples:[],keyPoints:['Verify each stage'],commonMistakes:['Skipping validation'],
      checks:['What does the result mean?'],followUp:'Try an example.',topic:'Credit resilience lesson'
    }:{title:'Credit resilience check',answer:'The mock Gemini response completed successfully, with a useful answer and the normal credit path.',suggestedFollowUps:['Explain the result']};
    return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(result)}]}}]}),{status:200,headers:{'content-type':'application/json'}});
  }
  return nativeFetch(input,options);
};

await import('../scholark-learning-route.mjs?credit-resilience='+Date.now());

const app=http.createServer((_req,res)=>reply(res,404,{ok:false,error:'unhandled'}));
const appPort=await listen(app);
const base='http://127.0.0.1:'+appPort;
const call=async(mode,prompt,id)=>{
  const r=await fetch(base+'/api/learning/generate',{
    method:'POST',
    headers:{
      'content-type':'application/json',
      'authorization':'Bearer test-user-token',
      'x-scholark-request-id':id
    },
    body:JSON.stringify({mode,prompt,language:'English',level:'student'})
  });
  const data=await r.json().catch(()=>({}));
  return{status:r.status,data};
};

try{
  const arki=await call('general_ai','Test resilient ARKI credit preflight','credit-resilience-arki-001');
  check(arki.status===200&&arki.data?.ok===true,'ARKI did not recover from transient credit preflight failure: '+JSON.stringify(arki));
  check(arki.data?.provider==='gemini','ARKI resilience smoke expected a validated Gemini response');
  check(costAttempts>=2&&walletAttempts>=2&&quotaAttempts>=2,'Credit/quota preflight did not retry all transient network failures');
  check(quotaConsumeAttempts>=2,'Zero-credit ARKI quota consumption did not retry after transient network failure');

  const tutor=await call('tutor','Test resilient credit charge','credit-resilience-tutor-001');
  check(tutor.status===200&&tutor.data?.ok===true,'Tutor did not recover from transient credit charge failure: '+JSON.stringify(tutor));
  check(chargeAttempts>=2,'Credit charge did not retry after transient network failure');

  console.log('SCHOLARK CREDIT RESILIENCE SMOKE PASS',JSON.stringify({costAttempts,walletAttempts,quotaAttempts,quotaConsumeAttempts,chargeAttempts}));
}finally{
  await close(app);
  await close(supabase);
}
