import http from 'node:http';

process.env.SCHOLARK_AI_LIVE='1';
process.env.SCHOLARK_AI_PROVIDER='gemini';
process.env.GEMINI_API_KEY='test-gemini-key';
process.env.GEMINI_PRIMARY_MODEL='gemini-primary-test';
process.env.GEMINI_FALLBACK_MODELS='gemini-fallback-test';
process.env.POLLINATIONS_API_KEY='sk_test_pollinations';
process.env.POLLINATIONS_BALANCED_MODEL='pollinations-emergency-test';

let scenario='fallback';
const calls=[];
globalThis.fetch=async(input,init={})=>{
  const url=new URL(String(input));
  if(url.hostname==='generativelanguage.googleapis.com'){
    const model=decodeURIComponent((url.pathname.match(/\/models\/([^/:]+):generateContent$/)||[])[1]||'');
    calls.push({scenario,provider:'gemini',model});
    if(scenario==='fallback'&&model==='gemini-fallback-test'){
      return new Response(JSON.stringify({candidates:[{content:{parts:[{text:'fallback model recovered'}]}}]}),{status:200,headers:{'content-type':'application/json'}});
    }
    return new Response(JSON.stringify({error:{message:'synthetic provider failure'}}),{status:503,headers:{'content-type':'application/json'}});
  }
  if(url.hostname==='gen.pollinations.ai'){
    calls.push({scenario,provider:'pollinations',model:'pollinations-emergency-test'});
    return new Response(JSON.stringify({choices:[{message:{content:'emergency provider recovered'}}]}),{status:200,headers:{'content-type':'application/json'}});
  }
  throw new Error('Unexpected network call '+url);
};

await import('../scholark-gemini-primary.mjs');

const server=http.createServer(async(req,res)=>{
  if(req.url!=='/api/learning/generate'){res.writeHead(404);res.end();return}
  try{
    const upstream=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-primary-test:generateContent?key=test',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:'test'}]}]})});
    const body=await upstream.json();
    res.writeHead(upstream.status,{'content-type':'application/json'});
    res.end(JSON.stringify({ok:upstream.ok,result:body}));
  }catch(e){
    res.writeHead(503,{'content-type':'application/json'});
    res.end(JSON.stringify({ok:false,error:String(e?.message||e)}));
  }
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
async function call(){
  return new Promise((resolve,reject)=>{
    const q=http.request({host:'127.0.0.1',port,path:'/api/learning/generate',method:'POST',headers:{'content-type':'application/json'}},res=>{
      let raw='';res.on('data',x=>raw+=x);res.on('end',()=>{try{resolve({status:res.statusCode,body:JSON.parse(raw)})}catch(e){reject(e)}})
    });
    q.on('error',reject);q.end('{}');
  });
}
const failures=[];
try{
  let out=await call();
  if(out.status!==200||out.body?.provider!=='gemini'||out.body?.model!=='gemini-fallback-test'||out.body?.fallbackUsed!==true)failures.push({case:'gemini fallback',out});

  scenario='emergency';
  out=await call();
  if(out.status!==200||out.body?.provider!=='pollinations'||out.body?.emergencyProvider!=='pollinations'||out.body?.fallbackUsed!==true)failures.push({case:'emergency provider',out});

  const health=await new Promise((resolve,reject)=>{
    http.get({host:'127.0.0.1',port,path:'/api/gemini/health'},res=>{let raw='';res.on('data',x=>raw+=x);res.on('end',()=>{try{resolve(JSON.parse(raw))}catch(e){reject(e)}})}).on('error',reject)
  });
  if(!health?.ok||health?.provider!=='gemini'||health?.fallbackEnabled!==true||health?.emergencyProviders?.pollinations!==true)failures.push({case:'provider health',health});

  console.log('SCHOLARK GEMINI ROUTER SMOKE',JSON.stringify({ok:failures.length===0,calls,failures}));
  if(failures.length)process.exitCode=1;
}finally{
  await new Promise(resolve=>server.close(resolve));
}
