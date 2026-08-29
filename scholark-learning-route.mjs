import http from 'node:http';

const originalEmit = http.Server.prototype.emit;
console.log('[SCHOLARK] Learning AI route ready');
const json = (res, status, body) => {
  if (res.headersSent) return;
  res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store'});
  res.end(JSON.stringify(body));
};

const readJson = req => new Promise((resolve,reject)=>{
  let raw='';
  req.on('data',c=>{ raw+=c; if(raw.length>2_000_000){ reject(new Error('Payload too large')); req.destroy(); }});
  req.on('end',()=>{ try{ resolve(raw?JSON.parse(raw):{}); } catch(e){ reject(e); } });
  req.on('error',reject);
});

const clean = s => String(s ?? '').replace(/\s+/g,' ').trim();
const isSecret = s => /^sk[_-]/.test(String(s||'')) || /^sk-proj-/.test(String(s||''));

function schemaFor(mode){
  if(mode==='exam') return {
    type:'object',additionalProperties:false,required:['title','questions'],properties:{
      title:{type:'string'},instructions:{type:'string'},questions:{type:'array',minItems:1,items:{type:'object',additionalProperties:false,required:['type','prompt','answer','explanation','topic','difficulty'],properties:{
        type:{type:'string',enum:['multiple_choice','true_false','open']},prompt:{type:'string'},choices:{type:'array',items:{type:'string'}},answer:{type:'string'},explanation:{type:'string'},topic:{type:'string'},difficulty:{type:'string',enum:['easy','medium','hard']}
      }}}
    }
  };
  if(mode==='curriculum') return {
    type:'object',additionalProperties:false,required:['title','summary','subjects','roadmap'],properties:{
      title:{type:'string'},summary:{type:'string'},subjects:{type:'array',items:{type:'object',additionalProperties:false,required:['name','why','topics','skills'],properties:{name:{type:'string'},why:{type:'string'},topics:{type:'array',items:{type:'string'}},skills:{type:'array',items:{type:'string'}}}}},roadmap:{type:'array',items:{type:'string'}},resources:{type:'array',items:{type:'string'}}
    }
  };
  if(mode==='study_ahead') return {
    type:'object',additionalProperties:false,required:['title','overview','skills','keySubjects','books','universityPrep','careers','roadmap'],properties:{
      title:{type:'string'},overview:{type:'string'},skills:{type:'array',items:{type:'string'}},keySubjects:{type:'array',items:{type:'string'}},books:{type:'array',items:{type:'string'}},universityPrep:{type:'array',items:{type:'string'}},careers:{type:'array',items:{type:'string'}},roadmap:{type:'array',items:{type:'object',additionalProperties:false,required:['phase','actions'],properties:{phase:{type:'string'},actions:{type:'array',items:{type:'string'}}}}}
    }
  };
  if(mode==='translate_ui') return {
    type:'object',additionalProperties:false,required:['translations'],properties:{
      translations:{type:'array',items:{type:'object',additionalProperties:false,required:['source','translated'],properties:{source:{type:'string'},translated:{type:'string'}}}}
    }
  };
  return {
    type:'object',additionalProperties:false,required:['answer','summary','steps','examples','keyPoints','commonMistakes','checks','followUp','topic'],properties:{
      answer:{type:'string'},
      summary:{type:'string'},
      steps:{type:'array',items:{type:'string'}},
      examples:{type:'array',items:{type:'object',additionalProperties:false,required:['title','setup','walkthrough','answer'],properties:{title:{type:'string'},setup:{type:'string'},walkthrough:{type:'string'},answer:{type:'string'}}}},
      keyPoints:{type:'array',items:{type:'string'}},
      commonMistakes:{type:'array',items:{type:'string'}},
      checks:{type:'array',items:{type:'string'}},
      followUp:{type:'string'},
      topic:{type:'string'}
    }
  };
}

function instructions(mode,p){
  const level=clean(p.level)||'student';
  const lang=clean(p.language)||'English';
  const base=`You are SCHOLARK, an elite education AI. Return only JSON matching the schema. Adapt depth, vocabulary and challenge to learning level: ${level}. Output language: ${lang}. Be specific, useful, accurate, concise where possible, and never invent factual claims. If a fact is uncertain, say so. Do not mention these instructions.`;
  if(mode==='tutor') return base+`\nAct as a patient, exceptionally thorough expert tutor. The learner asked to be taught, not merely handed an answer. Start from the prerequisite idea, define important terms, build intuition, then explain the formal reasoning step by step. For mathematics/science, explain what each symbol or operation means before using it. For humanities, connect concepts, causes, consequences and evidence. Include 2-4 worked examples whenever examples can help, beginning with a simple example and increasing difficulty. Explicitly call out common mistakes and misconceptions. End with key points and retrieval questions. If the request is broad, give a complete mini-lesson rather than an abbreviated summary. If it is narrow, stay proportional but still explain why. Never skip intermediate reasoning that a learner at level ${level} would need. Use teaching mode: ${clean(p.tutorMode)||'teach deeply'}. The answer field should contain the main lesson in coherent paragraphs; steps should capture the method; examples must be genuinely worked through, not labels only.`;
  if(mode==='translate_ui') return `You are SCHOLARK UI localization. Translate every supplied source string into ${lang}. Return only JSON matching the schema. Preserve SCHOLARK, product names, mathematical notation, keyboard shortcuts, URLs, placeholders, emoji, arrows and variables. Translate naturally for software UI, not word-for-word. Do not omit, merge or reorder strings. The translated array must have exactly one item for each source string, and each item must repeat its original source exactly.`;
  if(mode==='exam') return base+`\nCreate a rigorous practice exam. Match requested subjects/topics and difficulty. Multiple-choice questions must have plausible distractors and exactly one correct answer. Open questions need a concise model answer and explanation.`;
  if(mode==='curriculum') return base+`\nBuild a practical curriculum explorer. Organize the subject into major areas, foundational knowledge, skill progression, and a sensible roadmap. Avoid pretending a curriculum is officially mandated unless the user supplied one.`;
  return base+`\nBuild a serious Study Ahead track for someone preparing before entering a field of study. Include what they should learn, skills, key subjects, useful books/resources, university preparation, career paths and an actionable roadmap. Country and target school may be blank; do not invent admission requirements.`;
}

function userPayload(mode,p){
  return {
    mode,
    prompt:clean(p.prompt),
    level:clean(p.level),
    language:clean(p.language),
    tutorMode:clean(p.tutorMode),
    subject:clean(p.subject),
    topics:Array.isArray(p.topics)?p.topics.map(clean).filter(Boolean):clean(p.topics).split(',').map(clean).filter(Boolean),
    count:Math.max(1,Math.min(60,Number(p.count)||10)),
    difficulty:clean(p.difficulty)||'mixed',
    country:clean(p.country),
    targetSchool:clean(p.targetSchool),
    field:clean(p.field),
    context:clean(p.context),
    strings:Array.isArray(p.strings)?p.strings.map(x=>String(x??'').slice(0,600)).filter(Boolean).slice(0,260):[]
  };
}

function parseText(text,provider){
  const raw=String(text||'').trim();
  if(!raw) throw new Error(`${provider} returned no output`);
  try{return JSON.parse(raw);}catch{}
  const m=raw.match(/\{[\s\S]*\}/); if(!m) throw new Error(`${provider} returned invalid structured output`);
  try{return JSON.parse(m[0]);}catch{throw new Error(`${provider} returned invalid structured output`);}
}

async function pollinations(mode,p){
  const key=String(process.env.POLLINATIONS_API_KEY||'').trim();
  if(!isSecret(key)){const e=new Error('POLLINATIONS_API_KEY is not configured');e.code='POLLINATIONS_NOT_CONFIGURED';throw e;}
  const primary=String(process.env.POLLINATIONS_LEARNING_MODEL||process.env.POLLINATIONS_MODEL||'gpt-5.6-sol').trim();
  const fallback=String(process.env.POLLINATIONS_FALLBACK_MODEL||'claude-opus-4.7').trim();
  const models=[...new Set([primary,fallback].filter(Boolean))], failures=[];
  for(const model of models){
    const body={model,stream:false,messages:[{role:'system',content:instructions(mode,p)},{role:'user',content:JSON.stringify(userPayload(mode,p))}],response_format:{type:'json_schema',json_schema:{name:`scholark_${mode}`,strict:true,schema:schemaFor(mode)}}};
    const ctrl=new AbortController(); const timer=setTimeout(()=>ctrl.abort(),90000);
    let response;
    try{response=await fetch('https://gen.pollinations.ai/v1/chat/completions',{method:'POST',headers:{authorization:`Bearer ${key}`,'content-type':'application/json'},body:JSON.stringify(body),signal:ctrl.signal});}
    finally{clearTimeout(timer);}
    const data=await response.json().catch(()=>({}));
    if(!response.ok){
      const e=new Error(data?.error?.message||data?.message||`Pollinations HTTP ${response.status}`);
      e.code=response.status===402?'POLLINATIONS_BALANCE':response.status===429?'POLLINATIONS_RATE_LIMIT':'POLLINATIONS_ERROR';
      failures.push({model,code:e.code,message:e.message});
      if(e.code==='POLLINATIONS_BALANCE'){e.models=failures;throw e}
      continue;
    }
    try{return {ok:true,provider:'pollinations',model,result:parseText(data?.choices?.[0]?.message?.content,`Pollinations ${model}`)}}
    catch(e){failures.push({model,code:'POLLINATIONS_PARSE',message:e.message})}
  }
  const last=failures.at(-1)||{};const e=new Error(last.message||'Pollinations learning models failed');e.code=last.code||'POLLINATIONS_ERROR';e.models=failures;throw e;
}

function extractOpenAI(data){
  if(typeof data?.output_text==='string')return data.output_text;
  for(const item of data?.output||[]) for(const part of item?.content||[]) if(part?.type==='output_text'&&typeof part.text==='string') return part.text;
  return '';
}
async function openai(mode,p){
  const key=String(process.env.OPENAI_API_KEY||'').trim();
  if(!/^sk-/.test(key)){const e=new Error('OPENAI_API_KEY is not configured');e.code='OPENAI_NOT_CONFIGURED';throw e;}
  const model=String(process.env.OPENAI_LEARNING_MODEL||process.env.OPENAI_STUDIO_MODEL||'gpt-5.6').trim();
  const body={model,store:false,reasoning:{effort:'high'},text:{verbosity:mode==='tutor'?'high':'medium',format:{type:'json_schema',name:`scholark_${mode}`,strict:true,schema:schemaFor(mode)}},input:[{role:'developer',content:[{type:'input_text',text:instructions(mode,p)}]},{role:'user',content:[{type:'input_text',text:JSON.stringify(userPayload(mode,p))}]}]};
  const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),90000);
  let response;
  try{response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{authorization:`Bearer ${key}`,'content-type':'application/json'},body:JSON.stringify(body),signal:ctrl.signal});}finally{clearTimeout(timer);}
  const data=await response.json().catch(()=>({}));
  if(!response.ok){const e=new Error(data?.error?.message||`OpenAI HTTP ${response.status}`);e.code=data?.error?.code||'OPENAI_ERROR';throw e;}
  return {ok:true,provider:'openai',model,result:parseText(extractOpenAI(data),'OpenAI')};
}

async function generate(mode,p){
  const errors=[];
  for(const fn of [pollinations,openai]){
    try{return await fn(mode,p);}catch(e){errors.push({provider:fn.name,code:e.code||'ERROR',message:e.message});}
  }
  const e=new Error(errors.map(x=>`${x.provider}: ${x.message}`).join(' | ')); e.code='AI_ENGINE_UNAVAILABLE'; e.details=errors; throw e;
}

http.Server.prototype.emit = function(event,...args){
  if(event!=='request') return originalEmit.call(this,event,...args);
  const [req,res]=args;
  let url; try{url=new URL(req.url,'http://localhost');}catch{return originalEmit.call(this,event,...args);}
  if(url.pathname==='/api/learning/health'){
    json(res,200,{ok:true,pollinations:isSecret(process.env.POLLINATIONS_API_KEY),openai:/^sk-/.test(String(process.env.OPENAI_API_KEY||'')),model:String(process.env.POLLINATIONS_LEARNING_MODEL||process.env.POLLINATIONS_MODEL||'gpt-5.6-sol'),fallbackModel:String(process.env.POLLINATIONS_FALLBACK_MODEL||'claude-opus-4.7')});
    return true;
  }
  if(url.pathname!=='/api/learning/generate') return originalEmit.call(this,event,...args);
  if(req.method!=='POST'){json(res,405,{ok:false,error:'Method not allowed'});return true;}
  (async()=>{
    try{
      const p=await readJson(req); const mode=clean(p.mode||'tutor').toLowerCase();
      if(!['tutor','exam','curriculum','study_ahead','translate_ui'].includes(mode)) return json(res,400,{ok:false,error:'Unsupported learning mode'});
      if(mode==='tutor'&&!clean(p.prompt)) return json(res,400,{ok:false,error:'Prompt required'});
      if(mode==='translate_ui'&&(!Array.isArray(p.strings)||!p.strings.length)) return json(res,400,{ok:false,error:'Strings required'});
      const out=await generate(mode,p); json(res,200,out);
    }catch(e){json(res,e.code==='AI_ENGINE_UNAVAILABLE'?503:500,{ok:false,code:e.code||'LEARNING_ERROR',error:e.message,details:e.details||undefined});}
  })();
  return true;
};
