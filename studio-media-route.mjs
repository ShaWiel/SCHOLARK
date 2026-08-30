import http from 'node:http';
import crypto from 'node:crypto';

const originalEmit = http.Server.prototype.emit;
console.log('[SCHOLARK] Studio media route ready');

const cache = new Map();
const CACHE_LIMIT = 24;

function secret(v){const s=String(v||'').trim();return s.startsWith('sk_')&&s.length>12}
function json(res,status,obj){if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(obj))}
function readBody(req,limit=180000){
  return new Promise((resolve,reject)=>{
    let raw='',size=0;
    req.setEncoding('utf8');
    req.on('data',chunk=>{size+=Buffer.byteLength(chunk);if(size>limit){reject(Object.assign(new Error('Request too large'),{code:'PAYLOAD_TOO_LARGE'}));req.destroy();return}raw+=chunk});
    req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{reject(Object.assign(new Error('Invalid JSON'),{code:'INVALID_JSON'}))}});
    req.on('error',reject);
  });
}
function clamp(n,min,max,fallback){n=Number(n);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.round(n))):fallback}
function safeModel(v){const s=String(v||'').trim().toLowerCase();return /^[a-z0-9][a-z0-9._-]{0,60}$/.test(s)?s:''}
function cachePut(key,item){
  cache.set(key,item);
  while(cache.size>CACHE_LIMIT)cache.delete(cache.keys().next().value);
}
function imageKey(model,prompt,width,height,seed){return crypto.createHash('sha256').update([model,prompt,width,height,seed].join('|')).digest('hex')}

function testImage(body){
  const prompt=String(body?.prompt||'SCHOLARK visual').replace(/\s+/g,' ').trim().slice(0,220);
  if(prompt.length<4){const e=new Error('A visual prompt is required');e.code='PROMPT_REQUIRED';throw e}
  const width=clamp(body?.width,512,1920,1280),height=clamp(body?.height,512,1920,720),seed=clamp(body?.seed,0,2147483646,1);
  const safe=prompt.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#151821"/><stop offset="1" stop-color="#3d327b"/></linearGradient></defs><rect width="100%" height="100%" rx="36" fill="url(#g)"/><circle cx="'+Math.round(width*.82)+'" cy="'+Math.round(height*.2)+'" r="'+Math.round(Math.min(width,height)*.14)+'" fill="#c9ff6a" opacity=".18"/><text x="7%" y="43%" fill="#c9ff6a" font-family="Arial,sans-serif" font-size="'+Math.round(Math.max(20,width*.025))+'" font-weight="700">SCHOLARK TEST VISUAL</text><text x="7%" y="53%" fill="white" font-family="Arial,sans-serif" font-size="'+Math.round(Math.max(18,width*.02))+'">'+safe+'</text><text x="7%" y="62%" fill="#c9c7d3" font-family="Arial,sans-serif" font-size="'+Math.round(Math.max(14,width*.012))+'">Zero-credit placeholder · replace with final generated media later</text></svg>';
  return {buffer:Buffer.from(svg),type:'image/svg+xml',model:'local-svg-test',width,height,seed,prompt,cached:false};
}
async function generateImage(body){
  if(/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE||'')))return testImage(body);
  const key=String(process.env.POLLINATIONS_API_KEY||'').trim();
  if(!secret(key)){const e=new Error('POLLINATIONS_API_KEY is not configured');e.code='POLLINATIONS_NOT_CONFIGURED';throw e}
  const prompt=String(body?.prompt||'').replace(/\s+/g,' ').trim().slice(0,3500);
  if(prompt.length<4){const e=new Error('A visual prompt is required');e.code='PROMPT_REQUIRED';throw e}
  const model=safeModel(body?.model)||safeModel(process.env.POLLINATIONS_IMAGE_MODEL)||'flux';
  const width=clamp(body?.width,512,1920,1280),height=clamp(body?.height,512,1920,720);
  const seed=clamp(body?.seed,0,2147483646,Math.floor(Math.random()*2147483646));
  const keyHash=imageKey(model,prompt,width,height,seed);
  if(cache.has(keyHash))return {...cache.get(keyHash),cached:true};

  const url=new URL('https://gen.pollinations.ai/image/'+encodeURIComponent(prompt));
  url.searchParams.set('model',model);
  url.searchParams.set('width',String(width));
  url.searchParams.set('height',String(height));
  url.searchParams.set('seed',String(seed));

  const ctrl=new AbortController();
  const timer=setTimeout(()=>ctrl.abort(),120000);
  let response;
  try{
    response=await fetch(url,{headers:{authorization:`Bearer ${key}`,accept:'image/*'},signal:ctrl.signal});
  }finally{clearTimeout(timer)}
  const type=String(response.headers.get('content-type')||'').split(';')[0].trim();
  if(!response.ok||!type.startsWith('image/')){
    let detail='';
    try{detail=(await response.text()).slice(0,500)}catch{}
    const e=new Error(detail||`Pollinations image generation returned HTTP ${response.status}`);
    e.code=response.status===402?'POLLINATIONS_BALANCE':response.status===429?'POLLINATIONS_RATE_LIMIT':'POLLINATIONS_IMAGE_ERROR';
    e.status=response.status;
    throw e;
  }
  const array=await response.arrayBuffer();
  if(array.byteLength>14*1024*1024){const e=new Error('Generated image is too large');e.code='IMAGE_TOO_LARGE';throw e}
  const item={buffer:Buffer.from(array),type:type||'image/jpeg',model,width,height,seed,prompt};
  cachePut(keyHash,item);
  return {...item,cached:false};
}

http.Server.prototype.emit = function(type,...args){
  if(type!=='request')return originalEmit.call(this,type,...args);
  const [req,res]=args;
  try{
    const url=new URL(req.url||'/', 'http://localhost');
    if(req.method==='GET'&&url.pathname==='/api/studio/image/health'){
      const testMode=/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE||'')),configured=testMode||secret(process.env.POLLINATIONS_API_KEY);
      json(res,200,{ok:true,testMode,configured,model:safeModel(process.env.POLLINATIONS_IMAGE_MODEL)||'flux',cacheEntries:cache.size});
      return true;
    }
    if(req.method==='POST'&&url.pathname==='/api/studio/image'){
      readBody(req).then(generateImage).then(out=>{
        if(res.headersSent)return;
        res.writeHead(200,{
          'content-type':out.type,
          'content-length':String(out.buffer.length),
          'cache-control':'private, max-age=31536000, immutable',
          'x-scholark-image-model':out.model,
          'x-scholark-image-seed':String(out.seed),
          'x-scholark-image-cache':out.cached?'hit':'miss'
        });
        res.end(out.buffer);
      }).catch(error=>{
        const code=error?.code||'IMAGE_GENERATION_FAILED';
        const status=code==='POLLINATIONS_NOT_CONFIGURED'?503:code==='PROMPT_REQUIRED'||code==='INVALID_JSON'?400:code==='PAYLOAD_TOO_LARGE'||code==='IMAGE_TOO_LARGE'?413:code==='POLLINATIONS_BALANCE'?402:code==='POLLINATIONS_RATE_LIMIT'?429:error?.name==='AbortError'?504:502;
        json(res,status,{ok:false,code,error:error?.name==='AbortError'?'Image generation timed out':String(error?.message||'Image generation failed')});
      });
      return true;
    }
  }catch(error){
    json(res,500,{ok:false,code:'MEDIA_ROUTE_ERROR',error:String(error?.message||error)});
    return true;
  }
  return originalEmit.call(this,type,...args);
};
