import http from 'node:http';

const originalEmit = http.Server.prototype.emit;
console.log('[SCHOLARK] Learning AI route ready');
const _polliPrefix=String(process.env.POLLINATIONS_API_KEY||'').startsWith('pk_')?'publishable':String(process.env.POLLINATIONS_API_KEY||'').startsWith('sk_')?'secret':'none';
console.log('[SCHOLARK] Pollinations key type '+_polliPrefix+' · translation model '+String(process.env.POLLINATIONS_TRANSLATION_MODEL||'openai-fast'));
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
const isSecret = s => /^(sk[_-]|sk-proj-|pk_)/.test(String(s||''));
const translationMemory=new Map();
const translationKey=(lang,source)=>String(lang||'').toLowerCase()+'\u0000'+String(source||'');
const LINGVA_INSTANCES=['https://translate.dr460nf1r3.org','https://lingva.garudalinux.org','https://translate.jae.fi'];
const LIBRE_INSTANCES=['https://libretranslate.de','https://translate.argosopentech.com','https://translate.api.skitzen.com'];
const LINGVA_CODE={fil:'tl',zh:'zh-CN'};
const lingvaTarget=code=>LINGVA_CODE[String(code||'').toLowerCase()]||String(code||'').toLowerCase();
async function lingvaOne(source,targetCode,start=0){
  const target=lingvaTarget(targetCode);if(!source||!target||target==='en')return source;
  let last=null;
  for(let step=0;step<LINGVA_INSTANCES.length;step++){
    const base=LINGVA_INSTANCES[(start+step)%LINGVA_INSTANCES.length],ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),7000);
    try{
      const url=base+'/api/v1/auto/'+encodeURIComponent(target)+'/'+encodeURIComponent(source);
      const r=await fetch(url,{headers:{accept:'application/json','user-agent':'SCHOLARK/1.0 UI-localization'},signal:ctrl.signal});
      const d=await r.json().catch(()=>({}));const tr=clean(d?.translation);
      if(r.ok&&tr&&tr!==source)return tr;
      last=new Error(d?.error||('HTTP '+r.status));
    }catch(e){last=e}finally{clearTimeout(timer)}
  }
  throw last||new Error('Lingva unavailable');
}
async function libreOne(source,targetCode,start=0){
  const target=String(targetCode||'').toLowerCase();if(!source||!target||target==='en')return source;
  let last=null;
  for(let step=0;step<LIBRE_INSTANCES.length;step++){
    const base=LIBRE_INSTANCES[(start+step)%LIBRE_INSTANCES.length],ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),7000);
    try{
      const r=await fetch(base+'/translate',{method:'POST',headers:{'content-type':'application/json',accept:'application/json','user-agent':'SCHOLARK/1.0 UI-localization'},body:JSON.stringify({q:source,source:'en',target,format:'text'}),signal:ctrl.signal});
      const d=await r.json().catch(()=>({}));const tr=clean(d?.translatedText);
      if(r.ok&&tr&&tr!==source)return tr;
      last=new Error(d?.error||('HTTP '+r.status));
    }catch(e){last=e}finally{clearTimeout(timer)}
  }
  throw last||new Error('LibreTranslate unavailable');
}
async function myMemoryOne(source,targetCode){
  const target=lingvaTarget(targetCode);if(!source||!target||target==='en')return source;
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),7000);
  try{
    const u=new URL('https://api.mymemory.translated.net/get');u.searchParams.set('q',source);u.searchParams.set('langpair','en|'+target);u.searchParams.set('mt','1');
    const r=await fetch(u,{headers:{accept:'application/json','user-agent':'SCHOLARK/1.0 UI-localization'},signal:ctrl.signal});
    const d=await r.json().catch(()=>({}));const tr=clean(d?.responseData?.translatedText);
    if(r.ok&&tr&&tr!==source&&String(d?.responseStatus||200)!=='403')return tr;
    throw new Error(d?.responseDetails||('HTTP '+r.status));
  }finally{clearTimeout(timer)}
}
async function freeOne(source,targetCode,start=0){
  try{return await myMemoryOne(source,targetCode)}catch{}
  try{return await libreOne(source,targetCode,start)}catch{}
  return lingvaOne(source,targetCode,start);
}
async function freeUiTranslate(strings,targetCode){
  const src=[...new Set((strings||[]).map(x=>String(x??'').slice(0,600)).filter(Boolean))],out={},queue=[...src.entries()];
  const worker=async()=>{while(queue.length){const [i,s]=queue.shift(),k=translationKey(targetCode,s),hit=translationMemory.get(k);if(hit){out[s]=hit;continue}try{const tr=await freeOne(s,targetCode,i);if(tr){out[s]=tr;translationMemory.set(k,tr)}}catch{}}};
  await Promise.all(Array.from({length:Math.min(4,src.length)},()=>worker()));
  return out;
}

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
  if(mode==='language_learning') return {
    type:'object',additionalProperties:false,required:['title','overview','objectives','vocabulary','grammar','dialogue','exercises','cultureTip','nextStep'],properties:{
      title:{type:'string'},overview:{type:'string'},objectives:{type:'array',items:{type:'string'}},
      vocabulary:{type:'array',items:{type:'object',additionalProperties:false,required:['term','translation','pronunciation','example','exampleTranslation'],properties:{term:{type:'string'},translation:{type:'string'},pronunciation:{type:'string'},example:{type:'string'},exampleTranslation:{type:'string'}}}},
      grammar:{type:'array',items:{type:'object',additionalProperties:false,required:['point','explanation','examples'],properties:{point:{type:'string'},explanation:{type:'string'},examples:{type:'array',items:{type:'string'}}}}},
      dialogue:{type:'array',items:{type:'object',additionalProperties:false,required:['speaker','target','native'],properties:{speaker:{type:'string'},target:{type:'string'},native:{type:'string'}}}},
      exercises:{type:'array',items:{type:'object',additionalProperties:false,required:['type','prompt','choices','answer','explanation'],properties:{type:{type:'string',enum:['multiple_choice','translate','fill_blank','short_answer']},prompt:{type:'string'},choices:{type:'array',items:{type:'string'}},answer:{type:'string'},explanation:{type:'string'}}}},
      cultureTip:{type:'string'},nextStep:{type:'string'}
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
  if(mode==='translate_ui') return `You are SCHOLARK UI localization. Translate every supplied source string completely into ${lang}. Return only JSON matching the schema. Preserve only the brand name SCHOLARK, mathematical notation, keyboard shortcuts, URLs, placeholders, emoji, arrows, file extensions and code variables. Translate tool labels such as Dashboard, AI Tutor, Book Studio, Study Ahead, Files & Notes, plan descriptions, buttons, badges, demo text and navigation labels naturally into ${lang}; do not leave English behind unless the string is a proper brand name. Translate naturally for software UI, not word-for-word. Do not omit, merge or reorder strings. The translations array must have exactly one item for each source string, and each item must repeat its original source exactly.`;
  if(mode==='language_learning') return base+`\nYou are SCHOLARK Language Learner, an adaptive language teacher. Target language: ${clean(p.targetLanguage)||clean(p.language)||'English'}. Learner's native/support language: ${clean(p.nativeLanguage)||'English'}. CEFR level: ${clean(p.proficiency)||'A1'}. Learning goal: ${clean(p.learningGoal)||'conversation'}. Build one complete, practical lesson that teaches usable language, not a shallow word list. Explain grammar in the learner's native/support language, but keep target-language examples authentic. Include 10-16 high-value vocabulary items with pronunciation guidance, at least 2 grammar points when appropriate, a natural dialogue, and 6-10 exercises. Keep difficulty aligned to the CEFR level. Do not invent pronunciation certainty for languages/scripts where romanization varies; label approximate guidance when needed. The lesson must be immediately teachable and useful.`;
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
    targetLanguage:clean(p.targetLanguage),
    nativeLanguage:clean(p.nativeLanguage),
    proficiency:clean(p.proficiency),
    learningGoal:clean(p.learningGoal),
    strings:Array.isArray(p.strings)?p.strings.map(x=>String(x??'').slice(0,600)).filter(Boolean).slice(0,900):[]
  };
}

function parseText(text,provider){
  const raw=String(text||'').trim();
  if(!raw) throw new Error(`${provider} returned no output`);
  try{return JSON.parse(raw);}catch{}
  const m=raw.match(/\{[\s\S]*\}/); if(!m) throw new Error(`${provider} returned invalid structured output`);
  try{return JSON.parse(m[0]);}catch{throw new Error(`${provider} returned invalid structured output`);}
}


function learningTier(mode,p={}){
  if(mode==='translate_ui')return'light';
  if(mode==='language_learning')return'light';
  if(mode==='tutor'){
    const q=clean(p.prompt||'');return q.length>1400||p.deep===true?'balanced':'light';
  }
  if(mode==='exam'||mode==='study_ahead'||mode==='curriculum')return'balanced';
  return'light';
}
function learningModels(mode,p={}){
  const tier=learningTier(mode,p);
  return{
    tier,
    pollinations:tier==='light'
      ? [process.env.POLLINATIONS_FAST_MODEL||'openai-fast',process.env.POLLINATIONS_BALANCED_MODEL||'gpt-5.6-terra']
      : [process.env.POLLINATIONS_BALANCED_MODEL||'gpt-5.6-terra',process.env.POLLINATIONS_PREMIUM_MODEL||process.env.POLLINATIONS_MODEL||'gpt-5.6-sol'],
    openai:tier==='light'?(process.env.OPENAI_FAST_MODEL||'gpt-5.6-luna'):(process.env.OPENAI_BALANCED_MODEL||'gpt-5.6-terra'),
    gemini:process.env.GEMINI_FAST_MODEL||'gemini-3.1-flash-lite'
  };
}
async function pollinations(mode,p){
  const key=String(process.env.POLLINATIONS_API_KEY||'').trim();
  if(!isSecret(key)){const e=new Error('POLLINATIONS_API_KEY is not configured');e.code='POLLINATIONS_NOT_CONFIGURED';throw e}
  const route=learningModels(mode,p),models=[...new Set(route.pollinations.map(String).filter(Boolean))],failures=[];
  for(const model of models){
    const body={model,stream:false,messages:[{role:'system',content:instructions(mode,p)},{role:'user',content:JSON.stringify(userPayload(mode,p))}],response_format:{type:'json_schema',json_schema:{name:`scholark_${mode}`,strict:true,schema:schemaFor(mode)}}};
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),90000);let response;
    try{response=await fetch('https://gen.pollinations.ai/v1/chat/completions',{method:'POST',headers:{authorization:`Bearer ${key}`,'content-type':'application/json'},body:JSON.stringify(body),signal:ctrl.signal})}finally{clearTimeout(timer)}
    const data=await response.json().catch(()=>({}));
    if(!response.ok){const e=new Error(data?.error?.message||data?.message||`Pollinations HTTP ${response.status}`);e.code=response.status===402?'POLLINATIONS_BALANCE':response.status===429?'POLLINATIONS_RATE_LIMIT':'POLLINATIONS_ERROR';failures.push({model,code:e.code,message:e.message});if(e.code==='POLLINATIONS_BALANCE')break;continue}
    try{return{ok:true,provider:'pollinations',model,tier:route.tier,result:parseText(data?.choices?.[0]?.message?.content,`Pollinations ${model}`)}}catch(e){failures.push({model,code:'POLLINATIONS_PARSE',message:e.message})}
  }
  const last=failures.at(-1)||{},e=new Error(last.message||'Pollinations learning models failed');e.code=last.code||'POLLINATIONS_ERROR';e.models=failures;throw e;
}
function extractOpenAI(data){
  if(typeof data?.output_text==='string')return data.output_text;
  for(const item of data?.output||[])for(const part of item?.content||[])if(part?.type==='output_text'&&typeof part.text==='string')return part.text;
  return'';
}
async function openai(mode,p){
  const key=String(process.env.OPENAI_API_KEY||'').trim();
  if(!/^sk-/.test(key)){const e=new Error('OPENAI_API_KEY is not configured');e.code='OPENAI_NOT_CONFIGURED';throw e}
  const route=learningModels(mode,p),model=route.openai,effort=route.tier==='light'?'low':'medium';
  const body={model,store:false,reasoning:{effort},text:{verbosity:(mode==='tutor'||mode==='language_learning')?'high':'medium',format:{type:'json_schema',name:`scholark_${mode}`,strict:true,schema:schemaFor(mode)}},input:[{role:'developer',content:[{type:'input_text',text:instructions(mode,p)}]},{role:'user',content:[{type:'input_text',text:JSON.stringify(userPayload(mode,p))}]}]};
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),90000);let response;
  try{response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{authorization:`Bearer ${key}`,'content-type':'application/json'},body:JSON.stringify(body),signal:ctrl.signal})}finally{clearTimeout(timer)}
  const data=await response.json().catch(()=>({}));
  if(!response.ok){const e=new Error(data?.error?.message||`OpenAI HTTP ${response.status}`);e.code=data?.error?.code||'OPENAI_ERROR';throw e}
  return{ok:true,provider:'openai',model,tier:route.tier,result:parseText(extractOpenAI(data),'OpenAI')};
}
async function gemini(mode,p){
  const key=String(process.env.GEMINI_API_KEY||'').trim();
  if(!key){const e=new Error('GEMINI_API_KEY is not configured');e.code='GEMINI_NOT_CONFIGURED';throw e}
  const route=learningModels(mode,p),model=route.gemini,ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),90000);let response;
  try{response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{method:'POST',headers:{'x-goog-api-key':key,'content-type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:instructions(mode,p)}]},contents:[{role:'user',parts:[{text:JSON.stringify(userPayload(mode,p))}]}],generationConfig:{responseMimeType:'application/json',responseJsonSchema:schemaFor(mode)}}),signal:ctrl.signal})}finally{clearTimeout(timer)}
  const data=await response.json().catch(()=>({}));
  if(!response.ok){const e=new Error(data?.error?.message||`Gemini HTTP ${response.status}`);e.code='GEMINI_ERROR';throw e}
  const text=data?.candidates?.[0]?.content?.parts?.map(x=>x.text||'').join('')||'';
  return{ok:true,provider:'gemini',model,tier:route.tier,result:parseText(text,'Gemini')};
}
function scholarkTestFallback(mode,p){
  const clean=x=>String(x??'').replace(/\s+/g,' ').trim();
  const field=clean(p.field||p.subject||p.prompt||'your subject');
  const country=clean(p.country||'');
  const level=clean(p.level||'student');
  const lower=field.toLowerCase();
  const subjectBank=/law|legal|rechten|jurid/.test(lower)
    ? ['Introduction to law','Legal systems & institutions','Constitutional law','Contract law','Criminal law','Legal research & writing']
    : /hospitality|hotel|tourism|horeca/.test(lower)
      ? ['Hospitality operations','Front office','Food & beverage','Housekeeping','Marketing','Revenue management']
      : /computer|software|ict|informatics|programming/.test(lower)
        ? ['Programming fundamentals','Algorithms & data structures','Computer systems','Databases','Networks','Software engineering']
        : /medicine|medical|geneesk|doctor/.test(lower)
          ? ['Biology','Chemistry','Anatomy','Physiology','Biochemistry','Public health']
          : /engineer|engineering|techn/.test(lower)
            ? ['Algebra & calculus','Physics','Materials','Engineering design','Programming','Statistics']
            : /business|management|marketing|finance|bedrijf/.test(lower)
              ? ['Accounting','Finance','Marketing','Management','Economics','Statistics']
              : ['Foundations','Core theory','Methods & evidence','Applications','Communication','Ethics'];
  const skills=['Academic reading','Critical thinking','Research','Structured writing','Problem solving','Time management','Communication','Digital study skills'];

  if(mode==='study_ahead'){
    return {ok:true,provider:'scholark-test-engine',model:'local-study-v1',tier:'test',result:{
      title:'Study Ahead · '+field,
      overview:'Testing mode is active, so this roadmap works without paid AI. It prepares you for '+field+(country?' in '+country:'')+' without inventing admission requirements.',
      skills,
      keySubjects:subjectBank,
      books:['A current introductory textbook for '+field,'An academic writing and study-skills guide','An official curriculum or programme page from your target institution'],
      universityPrep:['Check the official programme curriculum','Review prerequisite subjects','Build a weekly study routine','Practice academic reading and summarising','Create a glossary of core terms'],
      careers:['Entry-level roles connected to '+field,'Specialist roles after further study','Research / analysis roles','Public or private-sector applications'],
      roadmap:[
        {phase:'1 · Foundations',actions:['Learn the basic vocabulary of '+field,'Review prerequisite school subjects','Set a weekly study schedule']},
        {phase:'2 · Core knowledge',actions:subjectBank.slice(0,5).map(x=>'Learn the fundamentals of '+x)},
        {phase:'3 · Practice',actions:['Complete short practice tasks weekly','Explain key ideas without notes','Write one structured mini-assignment']},
        {phase:'4 · Readiness',actions:['Compare your knowledge with the target programme','Identify your three weakest areas','Plan your first 30 study days']}
      ]
    }};
  }

  if(mode==='curriculum'){
    return {ok:true,provider:'scholark-test-engine',model:'local-curriculum-v1',tier:'test',result:{
      title:field+' learning map',
      summary:'Practical testing curriculum at '+level+' level. It is not presented as an official national curriculum.',
      subjects:subjectBank.map((name,i)=>({name,why:'Builds '+(i<2?'foundational':'applied')+' knowledge for later topics.',topics:['Core terminology','Key concepts','Typical problems'],skills:['Explain','Apply','Self-check']})),
      roadmap:['Start with foundations','Practice every core topic','Mix recall with application','Review weak areas','Finish with a cumulative project'],
      resources:['Official school/ministry curriculum where available','A current introductory textbook','Teacher/course materials','Practice questions']
    }};
  }

  if(mode==='exam'){
    const count=Math.max(1,Math.min(20,Number(p.count)||10));
    return {ok:true,provider:'scholark-test-engine',model:'local-exam-v1',tier:'test',result:{
      title:field+' practice exam',
      instructions:'Testing-mode question set. Use it to validate the exam workflow without paid AI.',
      questions:Array.from({length:count},(_,i)=>({
        type:i%3===0?'multiple_choice':i%3===1?'true_false':'open',
        prompt:'Practice question '+(i+1)+': explain or apply one core idea from '+field+'.',
        choices:i%3===0?['Option A','Option B','Option C','Option D']:[],
        answer:'Verify the exact subject answer with your course material.',
        explanation:'This local test item validates the exam interface and result flow.',
        topic:field,
        difficulty:i%4===0?'hard':i%2===0?'medium':'easy'
      }))
    }};
  }

  if(mode==='language_learning'){
    const target=clean(p.targetLanguage||'English'),native=clean(p.nativeLanguage||'English');
    const banks={
      Spanish:[['Hola','Hello'],['Gracias','Thank you'],['Por favor','Please'],['¿Cómo estás?','How are you?'],['Me llamo…','My name is…']],
      Dutch:[['Hallo','Hello'],['Dank je','Thank you'],['Alsjeblieft','Please'],['Hoe gaat het?','How are you?'],['Ik heet…','My name is…']],
      French:[['Bonjour','Hello'],['Merci','Thank you'],['S’il vous plaît','Please'],['Comment ça va ?','How are you?'],['Je m’appelle…','My name is…']]
    };
    const rows=banks[target]||[['Hello','Greeting'],['Thank you','Polite thanks'],['Please','Polite request'],['How are you?','Basic question'],['My name is…','Introduction']];
    return {ok:true,provider:'scholark-test-engine',model:'local-language-v1',tier:'test',result:{
      title:target+' starter lesson',
      overview:'Testing-mode lesson that works without paid AI.',
      objectives:['Greet someone','Introduce yourself','Use basic polite expressions'],
      vocabulary:rows.map(([term,translation])=>({term,translation,pronunciation:'Use native audio for precise pronunciation.',example:term,exampleTranslation:translation})),
      grammar:[{point:'Basic sentence pattern',explanation:'Compare the target-language word order with '+native+'.',examples:rows.slice(0,3).map(x=>x[0])}],
      dialogue:[{speaker:'A',target:rows[0][0],native:rows[0][1]},{speaker:'B',target:rows[3][0],native:rows[3][1]}],
      exercises:rows.map(([term,translation],i)=>({type:i%2?'translate':'short_answer',prompt:'What does "'+term+'" mean?',choices:[],answer:translation,explanation:'Review the starter vocabulary.'})),
      cultureTip:'Usage can vary by country and region.',
      nextStep:'Practice a 30-second self-introduction.'
    }};
  }

  const q=clean(p.prompt||field);
  return {ok:true,provider:'scholark-test-engine',model:'local-tutor-v1',tier:'test',result:{
    answer:'Testing mode is active. Start by defining the key terms in "'+q+'", connect them to what you already know, and work through one small example before increasing difficulty.',
    summary:'No-cost test lesson for '+q+'.',
    steps:['Define key terms','Connect prior knowledge','Work a simple example','Try a harder example','Check and explain the result'],
    examples:[{title:'Starter example',setup:'Choose one simple case related to '+q+'.',walkthrough:'Write what is known, what is asked, and which concept applies. Work one step at a time.',answer:'Use the result to verify that the learning workflow is functioning.'}],
    keyPoints:['Understand before memorising','Use examples','Explain ideas in your own words'],
    commonMistakes:['Skipping definitions','Memorising without applying','Not checking the result'],
    checks:['Can you explain it without notes?','Can you apply it to a new example?'],
    followUp:'Ask a narrower question for a more focused test lesson.',
    topic:q
  }};
}

async function generate(mode,p){
  if(/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE||''))&&mode!=='translate_ui')return scholarkTestFallback(mode,p);
  const route=learningModels(mode,p),hasGemini=Boolean(String(process.env.GEMINI_API_KEY||'').trim()),hasPollinations=isSecret(process.env.POLLINATIONS_API_KEY),hasOpenAI=/^sk-/.test(String(process.env.OPENAI_API_KEY||'')),errors=[];
  const order=route.tier==='light'?[[hasGemini,gemini],[hasPollinations,pollinations],[hasOpenAI,openai]]:[[hasPollinations,pollinations],[hasOpenAI,openai],[hasGemini,gemini]];
  for(const [ok,fn] of order){if(!ok)continue;try{return await fn(mode,p)}catch(e){errors.push({provider:fn.name,code:e.code||'ERROR',message:e.message})}}
  const e=new Error(errors.length?errors.map(x=>`${x.provider}: ${x.message}`).join(' | '):'No learning AI provider configured');e.code='AI_ENGINE_UNAVAILABLE';e.details=errors;throw e;
}

http.Server.prototype.emit = function(event,...args){
  if(event!=='request') return originalEmit.call(this,event,...args);
  const [req,res]=args;
  let url; try{url=new URL(req.url,'http://localhost');}catch{return originalEmit.call(this,event,...args);}
  if(url.pathname==='/api/learning/health'){
    json(res,200,{ok:true,testMode:/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE||'')),pollinations:isSecret(process.env.POLLINATIONS_API_KEY),openai:/^sk-/.test(String(process.env.OPENAI_API_KEY||'')),gemini:Boolean(String(process.env.GEMINI_API_KEY||'').trim()),routing:{fast:{pollinations:String(process.env.POLLINATIONS_FAST_MODEL||'openai-fast'),openai:String(process.env.OPENAI_FAST_MODEL||'gpt-5.6-luna'),gemini:String(process.env.GEMINI_FAST_MODEL||'gemini-3.1-flash-lite')},balanced:{pollinations:String(process.env.POLLINATIONS_BALANCED_MODEL||'gpt-5.6-terra'),openai:String(process.env.OPENAI_BALANCED_MODEL||'gpt-5.6-terra')}},translationCache:translationMemory.size});
    return true;
  }
  if(url.pathname!=='/api/learning/generate') return originalEmit.call(this,event,...args);
  if(req.method!=='POST'){json(res,405,{ok:false,error:'Method not allowed'});return true;}
  (async()=>{
    try{
      const p=await readJson(req); const mode=clean(p.mode||'tutor').toLowerCase();
      if(!['tutor','exam','curriculum','study_ahead','translate_ui','language_learning'].includes(mode)) return json(res,400,{ok:false,error:'Unsupported learning mode'});
      if(mode==='tutor'&&!clean(p.prompt)) return json(res,400,{ok:false,error:'Prompt required'});
      if(mode==='translate_ui'&&(!Array.isArray(p.strings)||!p.strings.length)) return json(res,400,{ok:false,error:'Strings required'});
      if(mode==='language_learning'&&!clean(p.targetLanguage)) return json(res,400,{ok:false,error:'Target language required'});
      if(mode==='translate_ui'){
        const language=clean(p.language)||'English',languageCode=clean(p.languageCode)||'',purpose=clean(p.purpose||'ui').toLowerCase();
        const strings=[...new Set((p.strings||[]).map(x=>String(x??'').slice(0,600)).filter(Boolean))].slice(0,900);
        const cached={},missing=[];
        for(const source of strings){
          const hit=translationMemory.get(translationKey(languageCode||language,source));
          if(hit)cached[source]=hit; else missing.push(source);
        }
        let provider='memory',model='translation-memory',remaining=[...missing];
        if(remaining.length&&purpose==='ui'&&languageCode){
          const free=await freeUiTranslate(remaining,languageCode);
          for(const [source,translated] of Object.entries(free)){if(clean(translated)){cached[source]=translated;translationMemory.set(translationKey(languageCode||language,source),translated)}}
          remaining=remaining.filter(s=>!cached[s]);
          if(Object.keys(free).length){provider='lingva';model='public-ui-translation'}
        }
        if(remaining.length){
          const testMode=/^(1|true|yes|on)$/i.test(String(process.env.SCHOLARK_TEST_MODE||''));
          if(!testMode){
            try{
              const out=await generate(mode,{...p,language,strings:remaining});
              provider=out.provider||provider;model=out.model||model;
              for(const row of out.result?.translations||[]){
                const source=String(row?.source||''),translated=clean(row?.translated);
                if(source&&translated){translationMemory.set(translationKey(languageCode||language,source),translated);cached[source]=translated}
              }
            }catch(e){
              if(!Object.keys(cached).length)throw e;
            }
          }else if(!Object.keys(cached).length){
            provider='zero-credit-ui';model='free-ui-translation';
          }
        }
        const translations=strings.map(source=>({source,translated:cached[source]||source}));
        const translatedCount=translations.filter(x=>clean(x.translated)&&x.translated!==x.source).length;
        json(res,200,{ok:true,provider,model,result:{translations},cacheHits:strings.length-missing.length,translated:translatedCount,untranslated:strings.length-translatedCount});
        return;
      }
      const out=await generate(mode,p); json(res,200,out);
    }catch(e){json(res,e.code==='AI_ENGINE_UNAVAILABLE'?503:500,{ok:false,code:e.code||'LEARNING_ERROR',error:e.message,details:e.details||undefined});}
  })();
  return true;
};
