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

let costAttempts=0,walletAttempts=0,chargeAttempts=0;
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
delete process.env.GEMINI_API_KEY;
delete process.env.OPENAI_API_KEY;
delete process.env.POLLINATIONS_API_KEY;

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
  check(arki.data?.provider==='scholark-local-fallback','ARKI resilience smoke expected local provider fallback without configured AI keys');
  check(costAttempts>=2&&walletAttempts>=2,'Credit preflight did not retry both transient network failures');

  const tutor=await call('tutor','Test resilient credit charge','credit-resilience-tutor-001');
  check(tutor.status===200&&tutor.data?.ok===true,'Tutor did not recover from transient credit charge failure: '+JSON.stringify(tutor));
  check(chargeAttempts>=2,'Credit charge did not retry after transient network failure');

  console.log('SCHOLARK CREDIT RESILIENCE SMOKE PASS',JSON.stringify({costAttempts,walletAttempts,chargeAttempts}));
}finally{
  await close(app);
  await close(supabase);
}
