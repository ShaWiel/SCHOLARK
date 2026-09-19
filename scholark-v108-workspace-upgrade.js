(() => {
  if(window.__SCHOLARK_V108_WORKSPACE_UPGRADE__)return;
  window.__SCHOLARK_V108_WORKSPACE_UPGRADE__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const read=(k,d=[])=>{try{const x=JSON.parse(localStorage.getItem(k)||'null');return x??d}catch{return d}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
  const today=()=>new Date().toISOString().slice(0,10);
  const uid=p=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
  const PLAN='scholark_v51_planner',GOALS='scholark_v51_goals',MASTER='scholark_v52_mastery',ASSIGN='scholark_v106_assignments',FOCUS='scholark_v106_focus',FOCUS_H='scholark_v106_focus_history',CARDS='scholark_v106_flashcards';
  const state={curriculum:null,exam:null,diagnostic:null,busy:false};
  window.__SCHOLARK_FEATURE_FLAGS__=Object.assign({},window.__SCHOLARK_FEATURE_FLAGS__||{},{studio:false,book:false,release:'r169'});

  const css=document.createElement('style');css.id='scholark-v108-style';css.textContent=`
    .v108-tools{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.v108-tools button{border:0;border-radius:10px;background:#eceaf4;color:#4e465c;padding:8px 10px;font:850 7.5px Inter;cursor:pointer}.v108-tools button.primary{background:#17191f;color:#c9ff6a}
    .v108-smart{margin:10px 0;padding:13px;border-radius:16px;background:#f7f6f3;border:1px solid rgba(23,25,31,.07)}.v108-smart b{font:900 9px Inter}.v108-smart p{font:650 8px/1.45 Inter;color:#716c78;margin:5px 0 0}.v108-question{padding:12px;border-radius:13px;background:#fff;border:1px solid rgba(23,25,31,.08);margin:7px 0}.v108-question h4{font:900 10px/1.4 Inter;margin:0 0 7px}.v108-answer{display:none;margin-top:8px;padding:9px;border-radius:10px;background:#eeecff;font:650 8px/1.45 Inter}.v108-answer.open{display:block}.v108-context{margin:10px 0;padding:10px 12px;border-radius:14px;background:#17191f;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:10px}.v108-context span{font:700 8px/1.4 Inter;color:#d7d3df}.v108-context button{border:0;border-radius:9px;background:#c9ff6a;color:#17191f;padding:8px 10px;font:900 7px Inter;cursor:pointer}
  `;document.head.appendChild(css);

  function outputLanguage(){const code=localStorage.getItem('scholark_ui_language')||'en';return window.__SCHOLARK_I18N__?.languageName?.(code)||code}
  async function ai(mode,payload={}){
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),45000);
    try{
      const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode,level:localStorage.getItem('scholark_learning_level')||'student',language:outputLanguage(),...payload}),signal:ctrl.signal});
      const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)throw new Error(d?.error||'AI request failed');return d;
    }finally{clearTimeout(timer)}
  }
  function openTool(id){window.__SCHOLARK_WORKSPACE__?.openTool?.(id)}
  function openArki(prompt){
    try{sessionStorage.setItem('scholark_v108_arki_prompt',prompt)}catch{}
    openTool('ai');
    const fill=()=>{const q=$('#v107-q');if(!q)return false;q.value=prompt;q.focus();return true};
    setTimeout(fill,40);setTimeout(fill,180);
  }
  function applyArkiPending(){
    if(String(location.hash||'').toLowerCase()!=='#ai')return;
    let p='';try{p=sessionStorage.getItem('scholark_v108_arki_prompt')||''}catch{}
    if(!p)return;const q=$('#v107-q');if(!q)return;q.value=p;q.focus();try{sessionStorage.removeItem('scholark_v108_arki_prompt')}catch{}
  }
  function mastery(){return read(MASTER,[])}
  function saveMastery(a){write(MASTER,a)}
  function addMastery(subject,topic,status='Learning'){
    subject=clean(subject)||'General';topic=clean(topic);if(!topic)return;
    const a=mastery(),existing=a.find(x=>clean(x.topic).toLowerCase()===topic.toLowerCase()&&clean(x.subject).toLowerCase()===subject.toLowerCase());
    const days=status==='Mastered'?14:status==='Practising'?4:2,next=new Date(Date.now()+days*86400000).toISOString();
    if(existing){existing.status=status;existing.mastery={New:0,Learning:35,Practising:65,Mastered:100}[status]||35;existing.nextReviewAt=next;existing.updatedAt=new Date().toISOString()}
    else a.push({id:uid('mastery'),subject,topic,status,mastery:{New:0,Learning:35,Practising:65,Mastered:100}[status]||35,nextReviewAt:next,updatedAt:new Date().toISOString()});
    saveMastery(a);
  }
  function plans(){return read(PLAN,[]).map((x,i)=>typeof x==='string'?{id:'legacy-'+i,text:x,status:'todo',priority:'medium'}:{...x,id:x.id||'plan-'+i,text:x.text||x.title||'',status:x.status||'todo'})}
  function savePlans(a){write(PLAN,a)}
  function addPlan(text,opt={}){
    const a=plans();a.push({id:uid('plan'),text:clean(text),type:opt.type||'next_action',subject:opt.subject||'',date:opt.date||'',time:opt.time||'',duration:Number(opt.duration)||45,priority:opt.priority||'medium',goalId:opt.goalId||'',status:'todo',createdAt:new Date().toISOString()});savePlans(a);
  }
  function focusFromPlan(id){
    const x=plans().find(z=>z.id===id);if(!x)return;
    write(FOCUS,{task:x.text,duration:Number(x.duration)||25,running:false,endAt:0,remaining:0,linkedPlannerId:x.id,autoComplete:true,startedAt:0});openTool('focus');
  }
  function tutorText(r){
    return [r?.answer,r?.summary,(r?.steps||[]).length?'\nNext steps:\n'+r.steps.map((x,i)=>(i+1)+'. '+x).join('\n'):'',(r?.keyPoints||[]).length?'\nKey points:\n- '+r.keyPoints.join('\n- '):'',r?.followUp?'\nNext: '+r.followUp:''].filter(Boolean).join('\n\n');
  }

  async function sendTutor(e){
    const q=$('#v52-tutor-q'),chat=$('#v52-chat'),btn=$('#v52-tutor-send');if(!q||!chat||!btn)return;
    const prompt=q.value.trim();if(!prompt)return q.focus();e?.preventDefault?.();e?.stopImmediatePropagation?.();
    if(state.busy)return;state.busy=true;btn.disabled=true;
    chat.insertAdjacentHTML('beforeend','<div class="v52-msg user">'+esc(prompt)+'</div>');q.value='';
    const thinking=document.createElement('div');thinking.className='v52-msg ai';thinking.id='v108-tutor-thinking';thinking.textContent='ARKI is working…';chat.appendChild(thinking);
    let assignmentId='';try{assignmentId=sessionStorage.getItem('scholark_v62_assignment_id')||''}catch{}
    const all=read(ASSIGN,[]),ctx=assignmentId?all.filter(x=>x.id===assignmentId):[];
    try{
      const d=await ai('tutor',{prompt,tutorMode:ctx.length?'assignment_coach':'teach',assignmentContext:ctx,deep:true,context:JSON.stringify(window.__SCHOLARK_WORKSPACE_CORE__?.context?.()||{})});
      thinking.remove();chat.insertAdjacentHTML('beforeend','<div class="v52-msg ai">'+esc(tutorText(d.result)).replace(/\n/g,'<br>')+'<div class="v52-meta">'+esc(d.provider||'ARKI')+(d.model?' · '+esc(d.model):'')+'</div></div>');
      try{sessionStorage.removeItem('scholark_v62_assignment_id')}catch{}
    }catch(err){thinking.textContent='Could not finish: '+String(err?.message||err)}
    finally{state.busy=false;btn.disabled=false;chat.scrollTop=chat.scrollHeight;q.focus()}
  }

  function renderDiagnostic(){
    const box=$('#v52-edu-detail');if(!box)return;
    box.innerHTML='<div class="v52-form"><h3>Diagnostic Check</h3><p>Generate a short diagnostic, reveal the answers and send weak topics straight into Mastery.</p><div class="v52-row"><input id="v108-diag-subject" placeholder="Subject"><input id="v108-diag-topics" placeholder="Topics, separated by commas"></div><button class="v52-btn" id="v108-diag-build">Run diagnostic with ARKI</button><div class="v52-list" id="v108-diag-out"></div></div>';
  }
  function renderReview(){
    const box=$('#v52-edu-detail');if(!box)return;
    const now=Date.now(),due=mastery().filter(x=>!x.nextReviewAt||new Date(x.nextReviewAt).getTime()<=now).sort((a,b)=>(Number(a.mastery)||0)-(Number(b.mastery)||0));
    box.innerHTML='<div class="v52-form"><h3>Spaced Review Queue</h3><p>Review the topics that are due now. Practice sends the topic to AI Tutor; Reviewed reschedules it; Mastered moves it to a longer interval.</p><div class="v52-list">'+(due.length?due.map(x=>'<div class="v52-item v52-task"><div><b>'+esc(x.topic)+'</b><div class="v52-meta"><span class="v52-badge">'+esc(x.subject||'General')+'</span><span class="v52-badge">'+Math.round(Number(x.mastery)||0)+'%</span></div></div><div class="v52-inline-actions"><button class="primary" data-v108-review-practice="'+esc(x.id)+'">Practice</button><button data-v108-review-done="'+esc(x.id)+'">Reviewed</button><button data-v108-review-master="'+esc(x.id)+'">Mastered</button></div></div>').join(''):'<div class="v52-item">Nothing is due right now. Keep learning or add topics to Mastery.</div>')+'</div></div>';
  }
  async function buildCurriculum(btn){
    const subject=clean($('#v52-cur-subject')?.value),country=clean($('#v52-cur-country')?.value);if(!subject)return $('#v52-cur-subject')?.focus();
    btn.disabled=true;btn.textContent='Building…';const out=$('#v52-cur-out');out.innerHTML='<div class="v52-item">ARKI is building the learning map…</div>';
    try{
      const d=await ai('curriculum',{subject,prompt:'Build a practical learning map for '+subject,country});state.curriculum=d.result;
      out.innerHTML=(d.result?.subjects||[]).map(s=>'<div class="v52-item"><b>'+esc(s.name)+'</b><br>'+esc(s.why||'')+'<div class="v52-meta">'+(s.topics||[]).slice(0,6).map(t=>'<span class="v52-badge">'+esc(t)+'</span>').join('')+'</div></div>').join('')+'<div class="v108-tools"><button class="primary" id="v108-cur-master">Add priority topics to Mastery</button><button id="v108-cur-plan">Add roadmap to Planner</button></div>';
    }catch(err){out.innerHTML='<div class="v52-item">Could not build the map: '+esc(err?.message||err)+'</div>'}finally{btn.disabled=false;btn.textContent='Build subject map with ARKI'}
  }
  function diagNorm(value){return clean(value).toLowerCase().replace(/^[a-z]\s*[.):-]\s*/i,'').replace(/[“”"'!?.,;:()]/g,'').replace(/\s+/g,' ').trim()}
  function diagCorrect(given,answer,choices=[]){
    const a=diagNorm(answer),g=diagNorm(given);if(!a||!g)return false;
    if(a===g||a.includes(g)||g.includes(a))return true;
    const aw=new Set(a.split(' ').filter(x=>x.length>2)),gw=new Set(g.split(' ').filter(x=>x.length>2));
    if(!aw.size||!gw.size)return false;let hit=0;gw.forEach(x=>{if(aw.has(x))hit++});
    return hit/Math.max(1,Math.min(aw.size,gw.size))>=.6;
  }

  async function buildExam(btn,diagnostic=false){
    const subject=diagnostic?clean($('#v108-diag-subject')?.value):clean($('#v52-exam-name')?.value)||'Practice exam';
    const raw=diagnostic?clean($('#v108-diag-topics')?.value):clean($('#v52-exam-topics')?.value);
    const topics=raw.split(/[\n,]+/).map(clean).filter(Boolean);if(!subject&&!topics.length)return;
    btn.disabled=true;const out=$(diagnostic?'#v108-diag-out':'#v52-exam-out');out.innerHTML='<div class="v52-item">Generating questions…</div>';
    try{
      const d=await ai('exam',{subject,prompt:(diagnostic?'Diagnostic check: ':'Practice exam: ')+subject,topics,count:diagnostic?8:12,difficulty:'mixed',context:diagnostic?JSON.stringify(window.__SCHOLARK_WORKSPACE_CORE__?.context?.()||{}):''});
      if(diagnostic)state.diagnostic=d.result;else state.exam=d.result;
      const qs=d.result?.questions||[];
      if(diagnostic){
        out.innerHTML='<div class="v108-smart"><b>DIAGNOSTIC READY</b><p>Answer every question, then grade it. SCHOLARK will update Mastery automatically from the result.</p></div>'+
          qs.map((q,i)=>'<div class="v108-question" data-v108-diag-q="'+i+'"><h4>'+(i+1)+'. '+esc(q.prompt)+'</h4>'+
            ((q.choices||[]).length?'<div style="display:grid;gap:6px">'+q.choices.map((x,j)=>'<label style="display:flex;align-items:flex-start;gap:7px;padding:8px 9px;border:1px solid rgba(23,25,31,.09);border-radius:10px;background:#fff;font:700 8px/1.4 Inter;cursor:pointer"><input type="radio" name="v108-diag-'+i+'" value="'+esc(x)+'" style="margin-top:2px">'+String.fromCharCode(65+j)+'. '+esc(x)+'</label>').join('')+'</div>':'<textarea data-v108-diag-answer="'+i+'" placeholder="Write your answer…" style="width:100%;box-sizing:border-box;min-height:78px;margin-top:7px;border:1px solid rgba(23,25,31,.12);border-radius:11px;padding:10px;font:650 9px/1.45 Inter"></textarea>')+
            '<div class="v108-answer"><b>Answer:</b> '+esc(q.answer)+'<br><b>Why:</b> '+esc(q.explanation||'')+'</div><div data-v108-diag-feedback="'+i+'" style="margin-top:8px"></div></div>').join('')+
          '<div id="v108-diag-score"></div><div class="v108-tools"><button class="primary" id="v108-diag-grade">Grade diagnostic</button><button id="v108-diag-show">Show all answers</button></div>';
      }else{
        out.innerHTML=qs.map((q,i)=>'<div class="v108-question"><h4>'+(i+1)+'. '+esc(q.prompt)+'</h4>'+((q.choices||[]).length?'<div>'+q.choices.map((x,j)=>'<div style="font:650 8px/1.5 Inter">'+String.fromCharCode(65+j)+'. '+esc(x)+'</div>').join('')+'</div>':'')+'<div class="v108-tools"><button data-v108-reveal>Show answer</button></div><div class="v108-answer"><b>Answer:</b> '+esc(q.answer)+'<br><b>Why:</b> '+esc(q.explanation||'')+'</div></div>').join('')+'<div class="v108-tools"><button class="primary" data-v108-exam-mastery="exam">Add topics to Mastery</button></div>';
      }
    }catch(err){out.innerHTML='<div class="v52-item">Could not generate questions: '+esc(err?.message||err)+'</div>'}finally{btn.disabled=false}
  }

  function enhancePlanner(){
    if(String(location.hash||'').toLowerCase()!=='#planner')return;
    const list=$('#v52-plan-list');if(!list)return;
    $$('.v52-item',list).forEach(item=>{if(item.querySelector('[data-v108-plan-focus]'))return;const t=item.querySelector('[data-plan-toggle]');if(!t)return;const b=document.createElement('button');b.textContent='Start focus';b.dataset.v108PlanFocus=t.dataset.planToggle;b.className='primary';t.parentElement?.prepend(b)});
    const form=list.closest('.v52-form');if(form&&!$('#v108-planner-smart',form)){const active=plans().filter(x=>x.status!=='done').sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'));const box=document.createElement('div');box.id='v108-planner-smart';box.className='v108-smart';box.innerHTML='<b>SMART TODAY</b><p>'+(active.length?esc(active.slice(0,3).map(x=>x.text).join(' · ')):'Your planner is clear. Add the next action that matters most.')+'</p>';form.insertBefore(box,list)}
  }
  function enhanceGoals(){
    if(String(location.hash||'').toLowerCase()!=='#goal')return;
    $$('#v52-goal-list .v52-item').forEach(item=>{if(item.querySelector('[data-v108-goal-plan]'))return;const n=item.querySelector('[data-goal-next]');if(!n)return;const b=document.createElement('button');b.textContent='Plan with ARKI';b.dataset.v108GoalPlan=n.dataset.goalNext;b.className='primary';n.parentElement?.insertBefore(b,n)})
  }
  function enhanceProgress(){
    if(String(location.hash||'').toLowerCase()!=='#progress'||$('#v108-progress-extra'))return;
    const summary=$('.v52-summary');if(!summary)return;
    const hist=read(FOCUS_H,[]),week=hist.filter(x=>Number(x.endedAt)>=Date.now()-7*86400000),minutes=week.reduce((n,x)=>n+(Number(x.minutes)||0),0);
    const cards=read(CARDS,[]),due=cards.filter(x=>!x.dueAt||Number(x.dueAt)<=Date.now()).length,assign=read(ASSIGN,[]),active=assign.filter(x=>x.status!=='complete'&&Number(x.progress)!==100).length,p=plans(),done=p.filter(x=>x.status==='done').length,rate=p.length?Math.round(done/p.length*100):0;
    const extra=document.createElement('div');extra.id='v108-progress-extra';extra.innerHTML='<div class="v52-summary"><div class="v52-mini-card"><b>'+minutes+'</b><span>Focus minutes · 7 days</span></div><div class="v52-mini-card"><b>'+due+'</b><span>Flashcards due</span></div><div class="v52-mini-card"><b>'+active+'</b><span>Active assignments</span></div><div class="v52-mini-card"><b>'+rate+'%</b><span>Planner completion</span></div></div><div class="v108-tools"><button class="primary" data-v108-open="focus">Start focus</button><button data-v108-open="flashcards">Review cards</button><button data-v108-open="assignments">Assignments</button></div>';summary.after(extra)
  }
  function enhanceProjects(){
    const root=$('.v64-projects');if(!root||$('#v108-project-tools',root))return;
    const tools=document.createElement('div');tools.id='v108-project-tools';tools.className='v108-tools';tools.innerHTML='<input id="v108-project-search" placeholder="Search projects…" style="flex:1;min-width:190px;border:1px solid rgba(23,25,31,.12);border-radius:10px;padding:9px 10px"><button id="v108-project-export">Export backup</button>';root.querySelector('p')?.after(tools);
    $('#v108-project-search',root).oninput=e=>{const q=clean(e.target.value).toLowerCase();$$('.v64-card',root).forEach(c=>c.style.display=!q||clean(c.innerText).toLowerCase().includes(q)?'':'none')};
    $('#v108-project-export',root).onclick=()=>download('scholark-projects-backup.json',JSON.stringify(window.__SCHOLARK_V64_PROJECTS__?.list?.()||read('scholark_v45_history',[]),null,2),'application/json');
  }
  function enhanceFiles(){
    if(String(location.hash||'').toLowerCase()!=='#files')return;const tools=$('.v86-tools');if(!tools||$('#v108-files-arki',tools))return;
    const b=document.createElement('button');b.id='v108-files-arki';b.textContent='Send result to ARKI';b.onclick=()=>{const t=clean($('#v86-output')?.innerText);if(t)openArki('Use this Files & Notes result as context and help me work with it:\n\n'+t.slice(0,12000))};tools.appendChild(b)
  }
  function enhancePower(){
    const root=$('#v106-root');if(!root)return;
    if(root.dataset.tool==='focus'&&!$('#v108-focus-export',root)){const b=document.createElement('button');b.id='v108-focus-export';b.className='v106-btn alt';b.textContent='Export focus history';b.onclick=()=>download('scholark-focus-history.json',JSON.stringify(read(FOCUS_H,[]),null,2),'application/json');root.appendChild(b)}
    if(root.dataset.tool==='flashcards'&&!$('#v108-card-csv',root)){const b=document.createElement('button');b.id='v108-card-csv';b.className='v106-btn alt';b.textContent='Export CSV';b.onclick=()=>{const rows=[['Deck','Front','Back','Reps','Interval'],...read(CARDS,[]).map(x=>[x.deck,x.front,x.back,x.reps,x.interval])];download('scholark-flashcards.csv',rows.map(r=>r.map(csv).join(',')).join('\n'),'text/csv')};root.appendChild(b)}
    if(root.dataset.tool==='assignments'&&!$('#v108-assign-export',root)){const b=document.createElement('button');b.id='v108-assign-export';b.className='v106-btn alt';b.textContent='Export assignments';b.onclick=()=>download('scholark-assignments.json',JSON.stringify(read(ASSIGN,[]),null,2),'application/json');root.appendChild(b)}
  }
  function enhanceContext(){
    const h=String(location.hash||'').toLowerCase();
    let root,label,prefix;
    if(h==='#language'){root=$('.v93');label='Ask ARKI about this lesson';prefix='Help me understand or practise this language lesson:'}
    else if(h==='#study'){root=$('.v83')||$('.v62-study');label='Ask ARKI about this roadmap';prefix='Help me improve and act on this Study Ahead roadmap:'}
    else if(h==='#schools'){root=$('#v50-school.open .v50-box')||$('#v50-school.open');label='Ask ARKI to compare what I see';prefix='Help me compare the school options currently shown in SCHOLARK:'}
    if(!root||root.querySelector('.v108-context'))return;
    const bar=document.createElement('div');bar.className='v108-context';bar.innerHTML='<span>Continue this tool with ARKI for deeper questions, planning or comparison.</span><button>'+label+'</button>';bar.querySelector('button').onclick=()=>openArki(prefix+'\n\n'+clean(root.innerText).slice(0,12000));root.prepend(bar)
  }
  function download(name,text,type='text/plain'){const blob=new Blob([text],{type:type+';charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
  const csv=v=>'"'+String(v??'').replace(/"/g,'""')+'"';

  async function goalPlan(btn,id){
    const g=read(GOALS,[]).find(x=>x.id===id);if(!g)return;btn.disabled=true;btn.textContent='Planning…';
    try{const d=await ai('tutor',{prompt:'Break this goal into 3 to 5 concrete next actions that can be scheduled: '+clean(g.text),tutorMode:'teach',context:JSON.stringify(window.__SCHOLARK_WORKSPACE_CORE__?.context?.()||{})});const steps=(d.result?.steps||[]).slice(0,5);steps.forEach((s,i)=>addPlan(s,{type:'next_action',subject:g.category||'',goalId:g.id,date:i===0?today():'',priority:i===0?'high':'medium'}));btn.textContent='✓ Added to Planner'}catch{btn.textContent='Try again';btn.disabled=false}
  }

  document.addEventListener('click',e=>{
    const target=e.target.closest?.('button,[data-edu]');if(!target)return;
    if(target.id==='v52-tutor-send'){sendTutor(e);return}
    if(target.matches('[data-edu="diagnostic"]')){e.preventDefault();e.stopImmediatePropagation();renderDiagnostic();return}
    if(target.matches('[data-edu="review"]')){e.preventDefault();e.stopImmediatePropagation();renderReview();return}
    if(target.id==='v52-cur-build'){e.preventDefault();e.stopImmediatePropagation();buildCurriculum(target);return}
    if(target.id==='v52-exam-build'){e.preventDefault();e.stopImmediatePropagation();buildExam(target,false);return}
    if(target.id==='v108-diag-build'){buildExam(target,true);return}
    if(target.id==='v108-diag-show'){e.preventDefault();$('#v108-diag-out .v108-answer').forEach(a=>a.classList.add('open'));target.textContent='Answers shown';return}
    if(target.id==='v108-diag-grade'){
      e.preventDefault();const r=state.diagnostic,qs=r?.questions||[];if(!qs.length)return;
      let correct=0,answered=0;const subject=clean($('#v108-diag-subject')?.value)||'Diagnostic';
      qs.forEach((q,i)=>{
        const box=$('[data-v108-diag-q="'+i+'"]'),choice=box?.querySelector('input[type="radio"]:checked'),text=box?.querySelector('[data-v108-diag-answer="'+i+'"]'),given=choice?.value||text?.value||'',ok=diagCorrect(given,q.answer,q.choices||[]);
        if(clean(given))answered++;if(ok)correct++;
        const topic=clean(q.topic)||subject,feedback=$('[data-v108-diag-feedback="'+i+'"]');
        if(feedback)feedback.innerHTML='<span class="v52-badge '+(ok?'goal':'high')+'">'+(ok?'✓ Correct':'Needs review')+'</span>';
        const masteryValue=ok?78:35,status=ok?'Practising':'Learning',next=new Date(Date.now()+(ok?4:2)*86400000).toISOString();
        if(window.__SCHOLARK_WORKSPACE_CORE__?.actions?.upsertMastery)window.__SCHOLARK_WORKSPACE_CORE__.actions.upsertMastery({subject,topic,mastery:masteryValue,status,nextReviewAt:next});
        else addMastery(subject,topic,status);
      });
      const score=Math.round(correct/Math.max(1,qs.length)*100),scoreBox=$('#v108-diag-score');
      if(scoreBox)scoreBox.innerHTML='<div class="v108-smart"><b>DIAGNOSTIC SCORE · '+score+'%</b><p>'+correct+' of '+qs.length+' correct · '+answered+' answered. Weak topics were added to Mastery and stronger topics were scheduled for later review.</p></div>';
      target.textContent='✓ Graded · '+score+'%';target.disabled=true;window.__SCHOLARK_WORKSPACE_CORE__?.record?.('education','diagnostic_graded',{subject,score,correct,total:qs.length});return
    }
    if(target.matches('[data-v108-reveal]')){const a=target.closest('.v108-question')?.querySelector('.v108-answer');a?.classList.toggle('open');target.textContent=a?.classList.contains('open')?'Hide answer':'Show answer';return}
    if(target.dataset.v108Weak){addMastery(clean($('#v108-diag-subject')?.value)||'Diagnostic',target.dataset.v108Weak,'Learning');target.textContent='✓ Added to Mastery';return}
    if(target.dataset.v108ExamMastery){const r=target.dataset.v108ExamMastery==='diagnostic'?state.diagnostic:state.exam;(r?.questions||[]).forEach(q=>addMastery(clean($('#v108-diag-subject')?.value)||clean($('#v52-exam-name')?.value)||'Exam',q.topic||'Core topic','Learning'));target.textContent='✓ Topics added';return}
    if(target.id==='v108-cur-master'){(state.curriculum?.subjects||[]).forEach(s=>(s.topics||[]).slice(0,3).forEach(t=>addMastery(s.name,t,'Learning')));target.textContent='✓ Added to Mastery';return}
    if(target.id==='v108-cur-plan'){(state.curriculum?.roadmap||[]).slice(0,6).forEach((x,i)=>addPlan(x,{type:'study',subject:clean($('#v52-cur-subject')?.value),priority:i===0?'high':'medium'}));target.textContent='✓ Added to Planner';return}
    if(target.dataset.v108ReviewPractice){const x=mastery().find(z=>z.id===target.dataset.v108ReviewPractice);if(x){openTool('tutor');setTimeout(()=>{const q=$('#v52-tutor-q');if(q){q.value='Help me practise '+x.topic+' in '+x.subject+'. Use active recall first, then application.';q.focus()}},100)}return}
    if(target.dataset.v108ReviewDone||target.dataset.v108ReviewMaster){const id=target.dataset.v108ReviewDone||target.dataset.v108ReviewMaster,a=mastery(),x=a.find(z=>z.id===id);if(x){const mastered=!!target.dataset.v108ReviewMaster;x.status=mastered?'Mastered':'Practising';x.mastery=mastered?100:Math.max(65,Number(x.mastery)||0);x.nextReviewAt=new Date(Date.now()+(mastered?14:4)*86400000).toISOString();x.updatedAt=new Date().toISOString();saveMastery(a);renderReview()}return}
    if(target.dataset.v108PlanFocus){focusFromPlan(target.dataset.v108PlanFocus);return}
    if(target.dataset.v108GoalPlan){goalPlan(target,target.dataset.v108GoalPlan);return}
    if(target.dataset.v108Open){openTool(target.dataset.v108Open);return}
  },true);

  let raf=0;function enhance(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{applyArkiPending();enhancePlanner();enhanceGoals();enhanceProgress();enhanceProjects();enhanceFiles();enhancePower();enhanceContext()})}
  const mo=new MutationObserver(enhance);mo.observe(document.body,{childList:true,subtree:true});
  addEventListener('hashchange',enhance);addEventListener('popstate',enhance);addEventListener('scholark-runtime-ready',enhance);setTimeout(enhance,120);
  window.__SCHOLARK_V108_UPGRADE__={version:'20260919-r169',enhance,ai,features:window.__SCHOLARK_FEATURE_FLAGS__};
})();