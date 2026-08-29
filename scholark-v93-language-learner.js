(() => {
  if(window.__SCHOLARK_V93_LANGUAGE_LEARNER__)return;
  window.__SCHOLARK_V93_LANGUAGE_LEARNER__=true;

  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const STORE='scholark_v93_language_progress',HISTORY='scholark_v93_language_lessons';
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let current=null,busy=false;

  const css=document.createElement('style');css.id='scholark-v93-style';css.textContent=`
    .v93{max-width:1480px;margin:0 auto;padding:34px 34px 70px;box-sizing:border-box;font-family:Inter,system-ui;color:#17191f}
    .v93-hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:18px;align-items:stretch}
    .v93-card{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:24px;padding:22px;box-shadow:0 18px 55px rgba(31,27,63,.05);min-width:0}
    .v93-intro{background:linear-gradient(145deg,#17191f,#312761);color:#fff;position:relative;overflow:hidden}.v93-intro:after{content:'';position:absolute;width:300px;height:300px;border-radius:50%;background:#c9ff6a;opacity:.08;right:-120px;top:-130px}
    .v93-kicker{font:950 8px/1 Inter;letter-spacing:.15em;color:#6d5dfc}.v93-intro .v93-kicker{color:#c9ff6a}.v93 h1{font:950 clamp(38px,5vw,64px)/.95 Inter;margin:10px 0 12px;letter-spacing:-.055em}.v93-intro p{max-width:760px;color:#d2cedc;font:650 11px/1.6 Inter}
    .v93-progress-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:20px}.v93-stat{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:13px}.v93-stat b{display:block;font:950 21px/1 Inter;color:#c9ff6a}.v93-stat span{display:block;margin-top:5px;font:700 7px/1.3 Inter;color:#c5c1ce}
    .v93-form{display:grid;gap:10px}.v93-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v93-field label{display:block;font:900 7.5px/1 Inter;letter-spacing:.08em;color:#77717e;margin:0 0 6px}.v93 input,.v93 select,.v93 textarea{width:100%;min-width:0;box-sizing:border-box;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:12px;padding:11px 12px;font:700 9px/1.35 Inter;color:#17191f;outline:0}.v93 textarea{min-height:82px;resize:vertical}.v93 input:focus,.v93 select:focus,.v93 textarea:focus{border-color:#6d5dfc;box-shadow:0 0 0 3px rgba(109,93,252,.1)}
    .v93-btn{border:0;border-radius:12px;background:#17191f;color:#fff;padding:12px 14px;font:900 8.5px Inter;cursor:pointer}.v93-btn.primary{background:#6d5dfc}.v93-btn.lime{background:#c9ff6a;color:#17191f}.v93-btn.ghost{background:#efedff;color:#594dcc}.v93-btn:disabled{opacity:.5;cursor:wait}
    .v93-status{min-height:16px;margin-top:7px;font:750 8px/1.4 Inter;color:#6257c6}.v93-results{display:grid;gap:12px;margin-top:18px}.v93-section{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:22px;padding:20px;min-width:0}.v93-section h2,.v93-section h3{margin:0 0 10px;font:950 22px/1 Inter;letter-spacing:-.035em}.v93-section p{font:650 9.5px/1.62 Inter;color:#5f5a66}.v93-objectives{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px}.v93-chip{padding:10px;border-radius:12px;background:#f3f1ff;font:750 8px/1.45 Inter;color:#5148a9}
    .v93-vocab{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:9px}.v93-word{border:1px solid rgba(23,25,31,.08);border-radius:16px;padding:14px;background:#fbfaf7}.v93-word strong{display:block;font:950 17px/1.15 Inter}.v93-word .v93-native{display:block;margin-top:5px;font:750 9px Inter;color:#6558c8}.v93-word small{display:block;margin-top:5px;color:#7a7580;font:700 7.5px/1.4 Inter}.v93-word p{margin:8px 0 0}.v93-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.v93-mini{border:0;border-radius:9px;background:#17191f;color:#fff;padding:7px 9px;font:850 7px Inter;cursor:pointer}.v93-mini.alt{background:#eae7ff;color:#5448c5}
    .v93-grammar{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:9px}.v93-grammar-card{border-radius:16px;background:#f6f4ef;padding:15px}.v93-grammar-card b{font:950 11px Inter}.v93-examples{margin:8px 0 0;padding-left:17px}.v93-examples li{font:700 8px/1.5 Inter;margin:4px 0}
    .v93-dialogue{display:grid;gap:7px}.v93-line{display:grid;grid-template-columns:80px minmax(0,1fr) auto;gap:10px;align-items:start;padding:11px;border-radius:14px;background:#f7f6f3}.v93-line b{font:900 8px Inter;color:#6d5dfc}.v93-line strong{display:block;font:850 10px/1.45 Inter}.v93-line span{display:block;margin-top:4px;font:650 8px/1.4 Inter;color:#777}
    .v93-exercise{border-top:1px solid #ece9e4;padding:14px 0}.v93-exercise:first-child{border-top:0}.v93-exercise b{font:900 9px/1.45 Inter}.v93-choices{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.v93-choice{padding:7px 9px;border-radius:9px;background:#f0eff7;font:750 7.5px Inter}.v93-answer{display:none;margin-top:9px;padding:10px;border-radius:10px;background:#ecffe1;font:700 8px/1.5 Inter}.v93-answer.open{display:block}
    .v93-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.v93-history{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px}.v93-history button{border:1px solid rgba(23,25,31,.08);background:#fff;border-radius:14px;padding:12px;text-align:left;cursor:pointer}.v93-history b{display:block;font:900 9px Inter}.v93-history span{display:block;margin-top:4px;font:650 7.5px/1.4 Inter;color:#777}
    .v93-pronounce{margin-top:8px;font:750 8px/1.4 Inter;color:#5e52c1}
    @media(max-width:1050px){.v93{padding:30px 20px 60px}.v93-hero{grid-template-columns:1fr}.v93-row{grid-template-columns:1fr 1fr}}@media(max-width:620px){.v93{padding:72px 12px 50px}.v93-row{grid-template-columns:1fr}.v93-progress-grid{grid-template-columns:1fr 1fr 1fr}.v93-line{grid-template-columns:1fr}.v93-line .v93-mini{justify-self:start}}
  `;document.head.appendChild(css);

  function langs(){return window.__SCHOLARK_I18N__?.langs||[['en','English'],['nl','Nederlands'],['es','Español'],['fr','Français']]}
  function langName(code){return window.__SCHOLARK_I18N__?.languageName?.(code)||langs().find(x=>x[0]===code)?.[1]||code}
  function uiCode(){return window.__SCHOLARK_I18N__?.code?.()||localStorage.getItem('scholark_ui_language')||'en'}
  function options(selected){return langs().map(([v,n])=>'<option value="'+esc(v)+'" '+(v===selected?'selected':'')+'>'+esc(n)+'</option>').join('')}
  function loadProgress(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}}
  function saveProgress(p){try{localStorage.setItem(STORE,JSON.stringify(p))}catch{}}
  function lessonHistory(){try{return JSON.parse(localStorage.getItem(HISTORY)||'[]')||[]}catch{return[]}}
  function saveHistory(row){let h=lessonHistory();h=[row,...h.filter(x=>x.id!==row.id)].slice(0,20);try{localStorage.setItem(HISTORY,JSON.stringify(h))}catch{}}

  async function ctx(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  async function loadCloudProgress(code){
    try{
      const x=await ctx();if(!x)return;
      const r=await x.c.request('/rest/v1/language_learning_progress?select=language_code,level,xp,streak,lessons_completed,last_topic,data,updated_at&user_id=eq.'+encodeURIComponent(x.uid)+'&language_code=eq.'+encodeURIComponent(code)+'&limit=1',{method:'GET'});
      const d=await r.json().catch(()=>[]),row=Array.isArray(d)?d[0]:d;if(!r.ok||!row)return;
      const p=loadProgress();p[code]={...(p[code]||{}),xp:Number(row.xp)||0,streak:Number(row.streak)||0,lessons:Number(row.lessons_completed)||0,level:row.level||p[code]?.level||'A1',lastTopic:row.last_topic||'',lastDay:row.data?.lastDay||p[code]?.lastDay||''};saveProgress(p);renderStats(code);
    }catch{}
  }
  async function pushCloudProgress(code){
    try{
      const x=await ctx();if(!x)return;const p=loadProgress()[code]||{};
      await x.c.request('/rest/v1/language_learning_progress?on_conflict=user_id,language_code',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:x.uid,language_code:code,level:p.level||'A1',xp:Number(p.xp)||0,streak:Number(p.streak)||0,lessons_completed:Number(p.lessons)||0,last_topic:p.lastTopic||null,data:{lastDay:p.lastDay||'',schema:1},updated_at:new Date().toISOString()})});
    }catch{}
  }

  function dayKey(d=new Date()){return d.toISOString().slice(0,10)}
  function daysBetween(a,b){if(!a||!b)return 99;return Math.round((new Date(b+'T00:00:00Z')-new Date(a+'T00:00:00Z'))/86400000)}
  function complete(){
    if(!current)return;const code=current.targetCode,p=loadProgress(),x=p[code]||{xp:0,streak:0,lessons:0,level:current.level||'A1'},today=dayKey(),gap=daysBetween(x.lastDay,today);
    if(x.lastCompletedLesson===current.id)return;
    x.xp=(Number(x.xp)||0)+100;x.lessons=(Number(x.lessons)||0)+1;x.streak=x.lastDay===today?(Number(x.streak)||1):gap===1?(Number(x.streak)||0)+1:1;x.lastDay=today;x.lastTopic=current.topic||'';x.level=current.level||x.level||'A1';x.lastCompletedLesson=current.id;p[code]=x;saveProgress(p);renderStats(code);pushCloudProgress(code);
    const st=$('#v93-status');if(st)st.textContent='Lesson complete · +100 XP. Your progress has been saved.';const b=$('#v93-complete');if(b){b.disabled=true;b.textContent='✓ Lesson complete'}
  }

  function renderStats(code){
    const p=loadProgress()[code]||{},host=$('#v93-stats');if(!host)return;
    host.innerHTML='<div class="v93-stat"><b>'+(Number(p.lessons)||0)+'</b><span>Lessons completed</span></div><div class="v93-stat"><b>'+(Number(p.streak)||0)+'</b><span>Current streak</span></div><div class="v93-stat"><b>'+(Number(p.xp)||0)+'</b><span>XP</span></div>';
    window.__SCHOLARK_I18N__?.apply?.(host);
  }

  function shell(){
    document.body.classList.add('v51-workspace');document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    $$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='language'));
    history.replaceState(null,'',location.pathname+location.search+'#language');
    const main=$('#v51-main');if(!main)return null;main.style.setProperty('display','block','important');$$('.v51-page',main).forEach(p=>{p.classList.remove('active');p.style.display='none'});
    let page=$('[data-v51-page="fallback"]',main);if(!page){page=document.createElement('section');page.className='v51-page';page.dataset.v51Page='fallback';main.appendChild(page)}page.classList.add('active');page.style.display='block';page.style.padding='0';
    let host=$('#v51-fallback',page);if(!host){host=document.createElement('div');host.id='v51-fallback';page.appendChild(host)}return host;
  }

  function open(){
    const host=shell();if(!host)return;const support=uiCode(),p=loadProgress(),lastTarget=localStorage.getItem('scholark_v93_target')||'es',level=p[lastTarget]?.level||'A1';
    host.innerHTML='<div class="v93"><div class="v93-hero"><section class="v93-card v93-intro"><div class="v93-kicker">SCHOLARK · LANGUAGE LEARNER</div><h1>Learn a language by actually using it.</h1><p>Build adaptive lessons with vocabulary, grammar, pronunciation, real dialogue and practice. SCHOLARK adjusts the lesson to your level and keeps your progress.</p><div class="v93-progress-grid" id="v93-stats"></div></section><section class="v93-card"><div class="v93-form"><div class="v93-row"><div class="v93-field"><label>Target language</label><select id="v93-target">'+options(lastTarget)+'</select></div><div class="v93-field"><label>Support language</label><select id="v93-support">'+options(support)+'</select></div></div><div class="v93-row"><div class="v93-field"><label>Current level</label><select id="v93-level"><option value="A0">A0 · Beginner from zero</option><option value="A1">A1 · Beginner</option><option value="A2">A2 · Elementary</option><option value="B1">B1 · Intermediate</option><option value="B2">B2 · Upper intermediate</option><option value="C1">C1 · Advanced</option><option value="C2">C2 · Near-native</option></select></div><div class="v93-field"><label>Learning goal</label><select id="v93-goal"><option>Conversation</option><option>Travel</option><option>School</option><option>Work</option><option>Grammar</option><option>Vocabulary</option><option>Pronunciation</option><option>Exam preparation</option></select></div></div><div class="v93-field"><label>Topic or situation</label><textarea id="v93-topic" placeholder="Example: ordering food, introducing myself, school vocabulary, job interview, past tense…"></textarea></div><button class="v93-btn primary" id="v93-build">Build a language lesson</button><div class="v93-status" id="v93-status"></div></div></section></div><div class="v93-results" id="v93-results"></div><section class="v93-section"><h3>Recent language lessons</h3><div class="v93-history" id="v93-history"></div></section></div>';
    const ls=$('#v93-level');if(ls&&[...ls.options].some(o=>o.value===level))ls.value=level;
    $('#v93-target').onchange=()=>{const code=$('#v93-target').value;localStorage.setItem('scholark_v93_target',code);renderStats(code);loadCloudProgress(code)};
    $('#v93-build').onclick=buildLesson;renderStats(lastTarget);loadCloudProgress(lastTarget);renderHistory();
    window.__SCHOLARK_I18N__?.apply?.(host);setTimeout(()=>window.__SCHOLARK_I18N__?.translateMissing?.(),60);
  }

  async function call(payload){
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),100000);
    try{
      const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'language_learning',...payload}),signal:ctrl.signal});
      const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok||!d.result)throw new Error(d?.error||'Language Learner AI is unavailable');return d;
    }finally{clearTimeout(timer)}
  }

  async function buildLesson(){
    if(busy)return;const targetCode=$('#v93-target').value,supportCode=$('#v93-support').value,level=$('#v93-level').value||'A1',goal=$('#v93-goal').value||'Conversation',topic=clean($('#v93-topic').value)||'practical everyday conversation',btn=$('#v93-build'),st=$('#v93-status');
    busy=true;btn.disabled=true;st.textContent='Building a complete '+langName(targetCode)+' lesson at '+level+' level…';
    try{
      const data=await call({targetLanguage:langName(targetCode),nativeLanguage:langName(supportCode),language:langName(supportCode),proficiency:level,learningGoal:goal,prompt:'Teach this topic or situation: '+topic+'. Include practical phrases, pronunciation, grammar, a realistic dialogue and exercises.',level:localStorage.getItem('scholark_learning_level')||'student'});
      current={id:'lang-'+Date.now().toString(36),targetCode,supportCode,level,goal,topic,result:data.result,provider:data.provider||'',model:data.model||'',at:Date.now()};
      saveHistory(current);renderLesson(current);renderHistory();localStorage.setItem('scholark_v93_target',targetCode);const p=loadProgress();p[targetCode]={...(p[targetCode]||{}),level,lastTopic:topic};saveProgress(p);renderStats(targetCode);pushCloudProgress(targetCode);st.textContent='Lesson ready. Listen, speak, practice and mark it complete when you finish.';
    }catch(e){st.textContent=clean(e?.message||e)}finally{busy=false;btn.disabled=false}
  }

  function ai(s){return '<span class="v93-ai">'+esc(s||'')+'</span>'}
  function list(items){return (items||[]).map(x=>'<div class="v93-chip">'+ai(x)+'</div>').join('')}
  function renderLesson(row){
    current=row;const r=row.result||{},out=$('#v93-results');if(!out)return;
    out.innerHTML='<section class="v93-section"><div class="v93-kicker">ADAPTIVE LESSON · '+esc(row.level||'A1')+'</div><h2>'+ai(r.title||'Language lesson')+'</h2><p>'+ai(r.overview||'')+'</p><div class="v93-objectives">'+list(r.objectives)+'</div></section>'+
      '<section class="v93-section"><h3>Vocabulary & phrases</h3><div class="v93-vocab">'+(r.vocabulary||[]).map((v,i)=>'<article class="v93-word"><strong class="v93-ai v93-target">'+esc(v.term||'')+'</strong><span class="v93-ai v93-native">'+esc(v.translation||'')+'</span><small class="v93-ai">Pronunciation: '+esc(v.pronunciation||'')+'</small><p><span class="v93-ai v93-target">'+esc(v.example||'')+'</span><br><span class="v93-ai v93-native">'+esc(v.exampleTranslation||'')+'</span></p><div class="v93-actions"><button class="v93-mini" data-v93-listen="'+i+'">Listen</button><button class="v93-mini alt" data-v93-practice="'+i+'">Practice speaking</button></div><div class="v93-pronounce" data-v93-feedback="'+i+'"></div></article>').join('')+'</div></section>'+
      '<section class="v93-section"><h3>Grammar made clear</h3><div class="v93-grammar">'+(r.grammar||[]).map(g=>'<article class="v93-grammar-card"><b>'+ai(g.point||'')+'</b><p>'+ai(g.explanation||'')+'</p><ul class="v93-examples">'+(g.examples||[]).map(x=>'<li>'+ai(x)+'</li>').join('')+'</ul></article>').join('')+'</div></section>'+
      '<section class="v93-section"><h3>Practice dialogue</h3><div class="v93-dialogue">'+(r.dialogue||[]).map((d,i)=>'<div class="v93-line"><b>'+ai(d.speaker||('Speaker '+(i+1)))+'</b><div><strong class="v93-ai v93-target">'+esc(d.target||'')+'</strong><span class="v93-ai v93-native">'+esc(d.native||'')+'</span></div><button class="v93-mini" data-v93-dialogue="'+i+'">Listen</button></div>').join('')+'</div></section>'+
      '<section class="v93-section"><h3>Exercises</h3><div>'+(r.exercises||[]).map((e,i)=>'<div class="v93-exercise"><b>'+String(i+1)+'. '+ai(e.prompt||'')+'</b>'+(e.choices?.length?'<div class="v93-choices">'+e.choices.map(x=>'<span class="v93-choice">'+ai(x)+'</span>').join('')+'</div>':'')+'<div class="v93-actions"><button class="v93-mini alt" data-v93-answer="'+i+'">Show answer</button></div><div class="v93-answer" data-v93-answer-box="'+i+'"><b>Answer:</b> '+ai(e.answer||'')+'<br><b>Why:</b> '+ai(e.explanation||'')+'</div></div>').join('')+'</div></section>'+
      '<section class="v93-section"><div class="v93-row"><div><h3>Culture tip</h3><p>'+ai(r.cultureTip||'')+'</p></div><div><h3>Next lesson</h3><p>'+ai(r.nextStep||'')+'</p></div></div><div class="v93-footer"><span class="v93-kicker">'+esc(row.provider||'AI')+' · '+esc(row.model||'')+'</span><button class="v93-btn lime" id="v93-complete">Lesson complete</button></div></section>';
    $$('[data-v93-listen]',out).forEach(b=>b.onclick=()=>speak((r.vocabulary||[])[+b.dataset.v93Listen]?.term||'',row.targetCode));
    $$('[data-v93-practice]',out).forEach(b=>b.onclick=()=>practice((r.vocabulary||[])[+b.dataset.v93Practice]?.term||'',row.targetCode,$('[data-v93-feedback="'+b.dataset.v93Practice+'"]',out)));
    $$('[data-v93-dialogue]',out).forEach(b=>b.onclick=()=>speak((r.dialogue||[])[+b.dataset.v93Dialogue]?.target||'',row.targetCode));
    $$('[data-v93-answer]',out).forEach(b=>b.onclick=()=>{const box=$('[data-v93-answer-box="'+b.dataset.v93Answer+'"]',out),open=box.classList.toggle('open');b.textContent=open?'Hide answer':'Show answer'});
    $('#v93-complete',out).onclick=complete;out.scrollIntoView({behavior:'smooth',block:'start'});window.__SCHOLARK_I18N__?.apply?.(out);
  }

  function speak(text,code){
    if(!text||!('speechSynthesis'in window))return;const voices=speechSynthesis.getVoices(),voice=voices.find(v=>(v.lang||'').toLowerCase().startsWith(String(code||'').toLowerCase()));speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=voice?.lang||code||'en';u.rate=.9;if(voice)u.voice=voice;speechSynthesis.speak(u);
  }

  function similarity(a,b){
    a=clean(a).toLowerCase();b=clean(b).toLowerCase();if(!a||!b)return 0;const m=a.length,n=b.length,d=Array.from({length:m+1},()=>Array(n+1).fill(0));for(let i=0;i<=m;i++)d[i][0]=i;for(let j=0;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return Math.max(0,Math.round((1-d[m][n]/Math.max(m,n))*100))
  }
  function practice(expected,code,host){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){if(host)host.textContent='Speech recognition is not supported in this browser. You can still use Listen and repeat aloud.';return}
    const rec=new SR();rec.lang=code||'en';rec.interimResults=false;rec.maxAlternatives=1;if(host)host.textContent='Listening… say: '+expected;
    rec.onresult=e=>{const heard=e.results?.[0]?.[0]?.transcript||'',score=similarity(expected,heard);if(host)host.textContent='Heard: “'+heard+'” · similarity '+score+'%'+(score>=85?' · excellent':score>=65?' · close, try once more':' · listen again and retry')};
    rec.onerror=()=>{if(host)host.textContent='Could not capture speech. Try again or use Listen first.'};try{rec.start()}catch{}
  }

  function renderHistory(){
    const host=$('#v93-history');if(!host)return;const h=lessonHistory();host.innerHTML=h.length?h.map((x,i)=>'<button type="button" data-v93-old="'+i+'"><b>'+esc(langName(x.targetCode))+' · '+esc(x.level||'A1')+'</b><span>'+esc(x.topic||x.result?.title||'Language lesson')+' · '+new Date(x.at||Date.now()).toLocaleDateString()+'</span></button>').join(''):'<div class="v93-chip">Your generated lessons will appear here.</div>';
    $$('[data-v93-old]',host).forEach(b=>b.onclick=()=>renderLesson(h[+b.dataset.v93Old]));window.__SCHOLARK_I18N__?.apply?.(host);
  }

  addEventListener('hashchange',()=>{if(location.hash.toLowerCase()==='#language')setTimeout(open,40)});
  setTimeout(()=>{if(location.hash.toLowerCase()==='#language')open()},260);
  window.__SCHOLARK_V93_LANGUAGE__={open,buildLesson};
})();