(() => {
  if(window.__SCHOLARK_V86_FILE_INTELLIGENCE__)return;
  window.__SCHOLARK_V86_FILE_INTELLIGENCE__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim(),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state={files:[],text:'',busy:false};
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  const css=document.createElement('style');css.id='scholark-v86-style';css.textContent=`
    .v86{max-width:1280px;margin:0 auto;padding:32px;font-family:Inter,system-ui;color:#17191f}.v86 h1{font:950 clamp(38px,5vw,60px)/.95 Inter;letter-spacing:-.05em;margin:8px 0 10px}.v86>p{font:600 11px/1.55 Inter;color:#706c77;max-width:820px}
    .v86-grid{display:grid;grid-template-columns:360px minmax(0,1fr);gap:12px;margin-top:20px}.v86-card{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:22px;padding:18px;box-shadow:0 16px 48px rgba(31,27,63,.04)}
    .v86-drop{display:block;border:2px dashed #d7d3df;border-radius:18px;padding:28px 18px;text-align:center;cursor:pointer;background:#fafafa}.v86-drop b{display:block;font:950 14px Inter}.v86-drop span{display:block;margin-top:7px;font:650 8px/1.45 Inter;color:#777}.v86-drop input{display:none}.v86-list{display:grid;gap:6px;margin-top:10px}.v86-file{padding:9px;border-radius:10px;background:#f5f4f1;font:750 8px/1.35 Inter}.v86-file small{display:block;color:#888;font:650 6.8px Inter;margin-top:3px}
    .v86-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:12px}.v86-ask{display:grid;grid-template-columns:1fr auto;gap:7px;margin-top:10px}.v86-ask input{min-width:0;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:11px;padding:10px 11px;font:700 8.5px Inter}.v86-ask button{border:0;border-radius:11px;background:#6d5dfc;color:#fff;padding:10px 12px;font:900 8px Inter;cursor:pointer}.v86-tools{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.v86-tools button{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:9px;padding:7px 9px;font:850 7px Inter;cursor:pointer}.v86-stat{margin-top:8px;font:750 7px/1.4 Inter;color:#777}.v86-actions button{border:0;border-radius:11px;background:#17191f;color:#fff;padding:11px 9px;font:900 8px Inter;cursor:pointer}.v86-actions button.alt{background:#ece9ff;color:#574bd1}.v86-actions button:disabled{opacity:.45;cursor:not-allowed}.v86-status{margin-top:10px;min-height:18px;font:750 8px/1.4 Inter;color:#6559c8}.v86-output{min-height:420px;white-space:pre-wrap;font:650 10px/1.6 Inter;color:#4e4956}.v86-output h3{font:950 18px Inter;color:#17191f;margin:0 0 12px}.v86-output .v86-meta{margin-top:14px;font:800 7px Inter;color:#8b8591;text-transform:uppercase;letter-spacing:.08em}
    @media(max-width:820px){.v86{padding:22px 13px}.v86-grid{grid-template-columns:1fr}.v86-actions{grid-template-columns:1fr 1fr}}
  `;document.head.appendChild(css);

  async function session(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  function ext(f){return String(f?.name||'').split('.').pop().toLowerCase()}
  function textType(f){return f.type.startsWith('text/')||['txt','md','markdown','csv','json','html','htm','xml'].includes(ext(f))}
  async function b64(f){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const s=String(r.result||''),i=s.indexOf(',');res(i>=0?s.slice(i+1):s)};r.onerror=()=>rej(r.error);r.readAsDataURL(f)})}
  async function readOne(f){
    if(f.size>10*1024*1024)throw new Error(f.name+' is over the 10 MB limit.');
    if(textType(f)){const t=(await f.text()).slice(0,40000);return {name:f.name,type:f.type||ext(f),text:t,detail:t.length+' characters'}}
    if(['pdf','docx','pptx'].includes(ext(f))){
      const r=await fetch('/api/studio/reference/extract',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:f.name,type:f.type,size:f.size,data:await b64(f)})});
      const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)throw new Error(d?.error||('Could not read '+f.name));return {name:f.name,type:f.type||ext(f),text:String(d.text||'').slice(0,50000),detail:d.pages?d.pages+' pages':d.slides?d.slides+' slides':(d.chars||0)+' characters'}
    }
    if(f.type.startsWith('image/'))return {name:f.name,type:f.type,text:'',detail:'Image asset · ready to keep with the project'};
    throw new Error('Unsupported file: '+f.name);
  }
  async function remember(meta){
    try{const x=await session();if(!x)return;await x.c.request('/rest/v1/user_files',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({user_id:x.uid,name:meta.name,mime_type:meta.type||null,size_bytes:meta.size||null,meta:{source:'files_notes',readable:!!meta.text,detail:meta.detail||''}})})}catch{}
  }
  async function process(files){
    if(state.busy)return;state.busy=true;status('Reading files…');state.files=[];state.text='';
    try{
      for(const f of [...files].slice(0,8)){try{const x=await readOne(f);x.size=f.size;state.files.push(x);if(x.text)state.text+=(state.text?'\n\n':'')+'--- '+x.name+' ---\n'+x.text;remember(x)}catch(e){state.files.push({name:f.name,type:f.type,detail:clean(e?.message||e),error:true})}}
      state.text=state.text.slice(0,80000);renderFiles();const readable=state.files.filter(x=>x.text);status(readable.length+' readable file(s) ready for SCHOLARK AI.');const stat=$('#v86-stat');if(stat)stat.textContent=readable.reduce((n,x)=>n+(x.text?.length||0),0).toLocaleString()+' characters grounded across '+state.files.length+' file(s).';enableActions();
    }finally{state.busy=false}
  }
  function status(t){const x=$('#v86-status');if(x)x.textContent=t||''}
  function renderFiles(){const h=$('#v86-list');if(h)h.innerHTML=state.files.length?state.files.map(x=>'<div class="v86-file">'+esc(x.name)+'<small>'+esc(x.detail||x.type||'file')+'</small></div>').join(''):'<div class="v86-file">No files loaded yet.</div>'}
  function enableActions(){$$('#v86-actions button').forEach(b=>{b.disabled=!state.text&&b.dataset.v86!=='studio'})}
  async function ai(mode,payload){
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),90000);
    try{const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode,level:localStorage.getItem('scholark_learning_level')||'student',language:window.__SCHOLARK_I18N__?.languageName?.(localStorage.getItem('scholark_ui_language')||'en')||localStorage.getItem('scholark_ui_language')||'English',...payload}),signal:ctrl.signal});const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)throw new Error(d?.error||'AI request failed');return d}finally{clearTimeout(timer)}
  }
  function tutorText(r){return [r.answer,r.summary,(r.steps||[]).length?'\nStep by step:\n'+r.steps.map((x,i)=>(i+1)+'. '+x).join('\n'):'',(r.examples||[]).length?'\nWorked examples:\n'+r.examples.map((x,i)=>(i+1)+'. '+x.title+'\n'+x.setup+'\n'+x.walkthrough+'\nAnswer: '+x.answer).join('\n\n'):'',(r.keyPoints||[]).length?'\nKey points:\n- '+r.keyPoints.join('\n- '):'',(r.commonMistakes||[]).length?'\nCommon mistakes:\n- '+r.commonMistakes.join('\n- '):'',(r.checks||[]).length?'\nCheck yourself:\n- '+r.checks.join('\n- '):'',r.followUp?'\nNext: '+r.followUp:''].filter(Boolean).join('\n\n')}
  async function action(kind,btn){
    if(kind==='studio'){if(state.text)window.__SCHOLARK_V45_BRIEF__?.mergeReference?.({name:'Files & Notes bundle',text:state.text});localStorage.setItem('scholark_v24_intent',JSON.stringify({mode:'presentation',prompt:'Create a strong presentation using the attached Files & Notes references.',at:Date.now()}));location.hash='studio';setTimeout(()=>$('#v51-sidebar [data-v51-tool="studio"]')?.click(),40);return}
    if(kind==='ask'&&!clean($('#v86-question')?.value)){$('#v86-question')?.focus();return}if(!state.text)return;btn.disabled=true;const out=$('#v86-output');out.innerHTML='<h3>Working…</h3>SCHOLARK is analyzing the uploaded material.';
    try{
      let data,title;
      const context=state.text.slice(0,60000);
      if(kind==='quiz'){data=await ai('exam',{prompt:'Create a rigorous practice quiz based only on the uploaded material.',subject:'Uploaded material',topics:['Uploaded material'],count:12,difficulty:'mixed',context});title='Practice quiz';const r=data.result;out.innerHTML='<h3>'+esc(r.title||title)+'</h3><div>'+esc(r.instructions||'Answer first, then reveal and grade yourself.')+'</div><div class="v88-exam">'+(r.questions||[]).map((q,i)=>'<div class="v62-question"><div class="v62-meta">Question '+(i+1)+' · '+esc(q.difficulty||'')+'</div><h4>'+esc(q.prompt)+'</h4>'+((q.choices||[]).map((x,j)=>'<span class="v62-choice">'+String.fromCharCode(65+j)+'. '+esc(x)+'</span>').join(''))+'<button class="v62-reveal" type="button">Show answer</button><div class="v62-solution"><b>Answer:</b> '+esc(q.answer)+'<br><b>Why:</b> '+esc(q.explanation||'')+'</div></div>').join('')+'<div class="v86-meta">'+esc(data.provider||'AI')+' · '+esc(data.model||'')+'</div></div>';$$('.v62-reveal',out).forEach(b=>b.onclick=()=>{const sol=b.nextElementSibling;sol?.classList.toggle('open');b.textContent=sol?.classList.contains('open')?'Hide answer':'Show answer'});window.dispatchEvent(new CustomEvent('scholark:exam-generated',{detail:{name:'Files & Notes',topics:['Uploaded material'],difficulty:'mixed',result:r,provider:data.provider||'',model:data.model||'',startedAt:Date.now()}}));return}
      const prompts={
        summary:'Summarize the uploaded material accurately. Preserve the important facts, structure and conclusions. Do not invent anything not in the material.',
        explain:'Explain the uploaded material like an expert tutor. Identify the hardest concepts and explain them step by step.',
        flashcards:'Turn the uploaded material into high-quality active-recall flashcards. Use clear Question: / Answer: pairs and cover the most important material.',
        notes:'Create structured study notes from the uploaded material with headings, key ideas, definitions, examples and a concise recap.',
        plan:'Create a practical study plan for mastering the uploaded material using active recall and spaced repetition.',
        concepts:'Extract the most important concepts, definitions, formulas, relationships and misconceptions from the uploaded material. Organize them by priority and cite the source file name in brackets when possible.',
        worksheet:'Create a rigorous worksheet based only on the uploaded material. Include a mix of recall, application and reasoning tasks, then provide a compact answer key at the end.',
        ask:'Answer this question using the uploaded material as the primary source. Be explicit when the material does not contain enough information. Cite source file names in brackets when useful: '+clean($('#v86-question')?.value)
      };
      data=await ai('tutor',{prompt:prompts[kind],context,tutorMode:'teach'});title={summary:'Summary',explain:'Explanation',flashcards:'Flashcards',notes:'Study notes',plan:'Study plan',concepts:'Key concepts',worksheet:'Worksheet',ask:'Answer from files'}[kind]||'Result';
      out.innerHTML='<h3>'+esc(title)+'</h3>'+esc(tutorText(data.result))+'<div class="v86-meta">'+esc(data.provider||'AI')+' · '+esc(data.model||'')+'</div>';
    }catch(e){out.innerHTML='<h3>Could not finish</h3>'+esc(e?.name==='AbortError'?'The request timed out. Try again.':e?.message||e)}finally{btn.disabled=false}
  }
  function render(){
    document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');document.body.classList.add('v51-workspace');
    $('#v50-school')?.classList.remove('open');$('#v25-study')?.classList.remove('open');$('#v25-book')?.classList.remove('open');$('#v41-studio-workspace')?.setAttribute('hidden','');
    const main=$('#v51-main');if(!main)return;main.style.setProperty('display','block','important');$$('.v51-page',main).forEach(p=>{p.classList.remove('active');p.style.display='none'});let p=$('[data-v51-page="fallback"]',main);if(!p)return;p.classList.add('active');p.style.display='block';p.style.padding='0';const h=$('#v51-fallback',p);if(!h)return;
    h.innerHTML='<div class="v86"><div class="v52-kicker">SCHOLARK · FILE INTELLIGENCE</div><h1>Upload once. Turn it into useful work.</h1><p>PDF, DOCX, PPTX, TXT, Markdown, CSV, JSON and images can live in the workflow. Readable documents can immediately become summaries, explanations, quizzes, flashcards, notes, study plans or source material for Studio.</p><div class="v86-grid"><section class="v86-card"><label class="v86-drop"><b>＋ Add files</b><span>Up to 8 files · max 10 MB each</span><input id="v86-files" type="file" multiple accept=".pdf,.docx,.pptx,.txt,.md,.markdown,.csv,.json,.html,.htm,.xml,image/*"></label><div class="v86-list" id="v86-list"></div><div class="v86-actions" id="v86-actions"><button data-v86="summary">Summarize</button><button data-v86="explain">Explain</button><button data-v86="quiz">Quiz</button><button class="alt" data-v86="flashcards">Flashcards</button><button class="alt" data-v86="notes">Notes</button><button class="alt" data-v86="plan">Study plan</button><button class="alt" data-v86="concepts">Key concepts</button><button class="alt" data-v86="worksheet">Worksheet</button><button data-v86="studio">Send to Studio</button></div><div class="v86-ask"><input id="v86-question" placeholder="Ask a question about the uploaded material…"><button type="button" data-v86="ask">Ask files</button></div><div class="v86-tools"><button type="button" id="v86-copy">Copy result</button><button type="button" id="v86-clear">Clear files</button></div><div class="v86-stat" id="v86-stat"></div><div class="v86-status" id="v86-status"></div></section><section class="v86-card v86-output" id="v86-output"><h3>Ready when you are.</h3>Upload study material, a report, slides, notes or data. SCHOLARK will keep the workflow grounded in what you supplied.</section></div></div>';
    $('#v86-files').onchange=e=>process(e.target.files);$$('[data-v86]').forEach(b=>b.onclick=()=>action(b.dataset.v86,b));$('#v86-copy').onclick=async()=>{const text=clean($('#v86-output')?.innerText);if(text)try{await navigator.clipboard.writeText(text);status('Result copied to clipboard.')}catch{status('Copy is not available in this browser.')}};$('#v86-clear').onclick=()=>{state.files=[];state.text='';renderFiles();enableActions();$('#v86-output').innerHTML='<h3>Ready when you are.</h3>Upload study material, a report, slides, notes or data. SCHOLARK will keep the workflow grounded in what you supplied.';status('Files cleared.');const s=$('#v86-stat');if(s)s.textContent=''};renderFiles();enableActions();$$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='files'));
  }
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-v51-tool="files"]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();history.replaceState(null,'',location.pathname+location.search+'#files');render()},true);
  function sync(){if(location.hash.toLowerCase()==='#files')render()}
  addEventListener('hashchange',()=>setTimeout(sync,30));setTimeout(sync,180);
})();