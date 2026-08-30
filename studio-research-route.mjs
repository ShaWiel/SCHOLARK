import http from 'node:http';

const originalEmit=http.Server.prototype.emit;
console.log('[SCHOLARK] Research route ready');

const clean=v=>String(v??'').replace(/\u0000/g,'').trim();
const hasKey=v=>{const s=String(v||'').trim();return s.startsWith('sk_')&&s.length>12};
function json(res,status,obj){if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(obj))}
function readBody(req,limit=180000){return new Promise((resolve,reject)=>{let raw='',size=0;req.setEncoding('utf8');req.on('data',c=>{size+=Buffer.byteLength(c);if(size>limit){const e=new Error('Research request too large');e.code='PAYLOAD_TOO_LARGE';reject(e);req.destroy();return}raw+=c});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{const e=new Error('Invalid JSON');e.code='INVALID_JSON';reject(e)}});req.on('error',reject)})}
function parseJSON(raw){
  const s=clean(raw);if(!s)throw new Error('Research model returned no text');
  const a=s.indexOf('{'),b=s.lastIndexOf('}'),tries=[s,s.replace(/^```(?:json)?\s*/i,'').replace(/```\s*$/,''),a>=0&&b>a?s.slice(a,b+1):''];
  for(const t of tries){if(!t)continue;try{const x=JSON.parse(t);if(x&&typeof x==='object')return x}catch{}}
  throw new Error('Research model returned invalid structured data');
}
function source(x){
  if(!x)return null;
  if(typeof x==='string'){const m=x.match(/https?:\/\/[^\s]+/i),url=m?m[0].replace(/[),.;]+$/,''):'';return url?{title:clean(x.replace(url,'')).slice(0,180)||'Source',url,publisher:'',date:''}:null}
  const url=clean(x.url||x.link);if(!/^https?:\/\//i.test(url))return null;
  return {title:clean(x.title||x.name||x.publisher||'Source').slice(0,180),url,publisher:clean(x.publisher||x.site||'').slice(0,120),date:clean(x.date||x.published||'').slice(0,60)};
}
function normalize(x){
  const sources=(Array.isArray(x.sources)?x.sources:[]).map(source).filter(Boolean).slice(0,20);
  const findings=(Array.isArray(x.findings)?x.findings:[]).slice(0,18).map(f=>({claim:clean(f?.claim||f?.title).slice(0,600),detail:clean(f?.detail||f?.evidence||f?.explanation).slice(0,1800),sourceUrls:(Array.isArray(f?.sourceUrls)?f.sourceUrls:Array.isArray(f?.sources)?f.sources:[]).map(clean).filter(u=>/^https?:\/\//i.test(u)).slice(0,6),confidence:['high','medium','low'].includes(String(f?.confidence||'').toLowerCase())?String(f.confidence).toLowerCase():'medium'})).filter(f=>f.claim||f.detail);
  const cautions=(Array.isArray(x.cautions)?x.cautions:[]).map(clean).filter(Boolean).slice(0,10);
  if(findings.length&&!sources.length)cautions.unshift('Findings were returned without usable source URLs; treat them as unverified until sources are added.');
  return {summary:clean(x.summary).slice(0,5000),findings,sources,cautions,suggestedOutline:(Array.isArray(x.suggestedOutline)?x.suggestedOutline:[]).map(clean).filter(Boolean).slice(0,20)};
}
async function freeTestResearch(body){
  const query=clean(body?.query||body?.prompt).slice(0,8000);if(query.length<5){const e=new Error('Describe what SCHOLARK should research');e.code='QUERY_REQUIRED';throw e}
  const url='https://html.duckduckgo.com/html/?q='+encodeURIComponent(query),sources=[];
  try{
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);let response;
    try{response=await fetch(url,{headers:{accept:'text/html','user-agent':'Mozilla/5.0 SCHOLARK/1.0'},signal:ctrl.signal})}finally{clearTimeout(timer)}
    const html=await response.text(),blocks=html.split(/result results_links|result results_links_deep/i).slice(1,11);
    for(const block of blocks){
      const href=(block.match(/class="result__a"[^>]*href="([^"]+)"/i)||[])[1]||'',title=clean((block.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/i)||[])[1]||'').replace(/<[^>]+>/g,' '),snippet=clean((block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a?>/i)||[])[1]||'').replace(/<[^>]+>/g,' ');
      let resolved=href;try{const u=new URL(href,'https://duckduckgo.com');resolved=u.searchParams.get('uddg')||u.href}catch{}
      if(title&&/^https?:/i.test(resolved))sources.push({title,url:resolved,publisher:'Public web',date:'',snippet});
    }
  }catch{}
  const cleanSources=sources.slice(0,10);
  return {ok:true,provider:'scholark-test-search',model:'duckduckgo-live',result:{
    summary:cleanSources.length?'Testing-mode live search returned '+cleanSources.length+' public sources for review. SCHOLARK does not synthesize unsupported facts in zero-credit mode.':'No public source snippets were returned. Refine the query or open official sources manually.',
    findings:cleanSources.filter(x=>x.snippet).slice(0,8).map(x=>({claim:x.title,detail:x.snippet,sourceUrls:[x.url],confidence:'medium'})),
    sources:cleanSources.map(({snippet,...x})=>x),
    cautions:['Zero-credit testing mode shows search-source snippets instead of paid AI synthesis. Verify important claims in the linked sources.'],
    suggestedOutline:['Define the question','Review primary/official sources','Compare evidence','Note disagreements or uncertainty','Build a sourced conclusion']
  },researchedAt:new Date().toISOString()};
}
async function research(body){
  if(/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE||'')))return freeTestResearch(body);
  const key=String(process.env.POLLINATIONS_API_KEY||'').trim();if(!hasKey(key)){const e=new Error('POLLINATIONS_API_KEY is not configured');e.code='POLLINATIONS_NOT_CONFIGURED';throw e}
  const query=clean(body?.query||body?.prompt).slice(0,8000);if(query.length<5){const e=new Error('Describe what SCHOLARK should research');e.code='QUERY_REQUIRED';throw e}
  const model=clean(process.env.POLLINATIONS_RESEARCH_MODEL||'perplexity-fast')||'perplexity-fast';
  const language=clean(body?.language||'auto').slice(0,40),mode=clean(body?.mode||'project').slice(0,40);
  const schema={type:'object',additionalProperties:false,properties:{summary:{type:'string'},findings:{type:'array',items:{type:'object',additionalProperties:false,properties:{claim:{type:'string'},detail:{type:'string'},sourceUrls:{type:'array',items:{type:'string'}},confidence:{type:'string',enum:['high','medium','low']}},required:['claim','detail','sourceUrls','confidence']}},sources:{type:'array',items:{type:'object',additionalProperties:false,properties:{title:{type:'string'},url:{type:'string'},publisher:{type:'string'},date:{type:'string'}},required:['title','url','publisher','date']}},cautions:{type:'array',items:{type:'string'}},suggestedOutline:{type:'array',items:{type:'string'}}},required:['summary','findings','sources','cautions','suggestedOutline']};
  const system='You are SCHOLARK Research, a web-grounded research agent used before creating a '+mode+'. Search the live web for the exact topic. Prefer primary sources, official institutions, peer-reviewed or reputable research, and strong journalism when appropriate. Separate facts from interpretation. Never fabricate a URL, citation, statistic, date, quote or source. Every important current factual claim must be traceable to at least one real URL in sourceUrls and sources. If sources disagree, say so in cautions. Return concise research notes, not a finished artifact. Output language: '+language+'. Return JSON only.';
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),90000);let response;
  try{response=await fetch('https://gen.pollinations.ai/v1/chat/completions',{method:'POST',headers:{authorization:'Bearer '+key,'content-type':'application/json'},body:JSON.stringify({model,stream:false,messages:[{role:'system',content:system},{role:'user',content:query}],response_format:{type:'json_schema',json_schema:{name:'scholark_web_research',strict:true,schema}}}),signal:ctrl.signal})}finally{clearTimeout(timer)}
  const data=await response.json().catch(()=>({}));
  if(!response.ok){const e=new Error(data?.error?.message||data?.message||('Research provider returned HTTP '+response.status));e.code=response.status===402?'POLLINATIONS_BALANCE':response.status===429?'POLLINATIONS_RATE_LIMIT':'RESEARCH_PROVIDER_ERROR';throw e}
  return {ok:true,provider:'pollinations',model,result:normalize(parseJSON(data?.choices?.[0]?.message?.content)),researchedAt:new Date().toISOString()};
}

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return originalEmit.call(this,type,...args);const [req,res]=args;
  try{
    const url=new URL(req.url||'/','http://localhost');
    if(req.method==='GET'&&url.pathname==='/api/studio/research/health'){json(res,200,{ok:true,testMode:/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE||'')),configured:/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE||''))||hasKey(process.env.POLLINATIONS_API_KEY),model:clean(process.env.POLLINATIONS_RESEARCH_MODEL||'perplexity-fast')});return true}
    if(req.method==='POST'&&url.pathname==='/api/studio/research'){readBody(req).then(research).then(x=>json(res,200,x)).catch(e=>{const code=e?.code||'RESEARCH_FAILED',status=code==='POLLINATIONS_NOT_CONFIGURED'?503:code==='POLLINATIONS_BALANCE'?402:code==='POLLINATIONS_RATE_LIMIT'?429:code==='QUERY_REQUIRED'||code==='INVALID_JSON'?400:e?.name==='AbortError'?504:502;json(res,status,{ok:false,code,error:e?.name==='AbortError'?'Research timed out':String(e?.message||e)})});return true}
  }catch(e){json(res,500,{ok:false,code:'RESEARCH_ROUTE_ERROR',error:String(e?.message||e)});return true}
  return originalEmit.call(this,type,...args);
};
