(() => {
  if(window.__SCHOLARK_V90_I18N__) return;
  window.__SCHOLARK_V90_I18N__=true;

  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const LANGS=[
    ['nl','Nederlands','Dutch'],['en','English','English'],['es','Español','Spanish'],['fr','Français','French'],['de','Deutsch','German'],
    ['pt','Português','Portuguese'],['it','Italiano','Italian'],['srn','Sranan Tongo','Sranan Tongo'],['ar','العربية','Arabic'],['hi','हिन्दी','Hindi'],
    ['zh','中文','Chinese'],['ja','日本語','Japanese'],['ko','한국어','Korean'],['id','Bahasa Indonesia','Indonesian'],['tr','Türkçe','Turkish'],
    ['pl','Polski','Polish'],['sw','Kiswahili','Swahili'],['ru','Русский','Russian'],['uk','Українська','Ukrainian'],['ro','Română','Romanian'],
    ['cs','Čeština','Czech'],['hu','Magyar','Hungarian'],['el','Ελληνικά','Greek'],['sv','Svenska','Swedish'],['da','Dansk','Danish'],
    ['no','Norsk','Norwegian'],['fi','Suomi','Finnish'],['th','ไทย','Thai'],['vi','Tiếng Việt','Vietnamese'],['ms','Bahasa Melayu','Malay'],
    ['fil','Filipino','Filipino'],['bn','বাংলা','Bengali'],['ur','اردو','Urdu'],['fa','فارسی','Persian'],['he','עברית','Hebrew'],
    ['ta','தமிழ்','Tamil'],['te','తెలుగు','Telugu'],['mr','मराठी','Marathi']
  ];
  const RTL=new Set(['ar','ur','fa','he']);
  const CORE=[
    'Dashboard','Studio AI','AI Tutor','Education & Learning','Planner','Progress','Goals','Files & Notes','My Projects','Schools Near Me','Study Ahead','Book Studio',
    'WORKSPACE','FUTURE & PRO','Return to homepage','AI QUALITY · MAX','Highest available quality, expert depth, research, source checking and final polish.',
    'CHOOSE HOW SCHOLARK SHOULD WORK & TEACH','Young learner','Primary school','VOJ & VOS','Student','Adult',
    'Your learning & creation workspace.','Open the tool you need. Your selected level changes how SCHOLARK should explain, structure and challenge you, while every AI workflow uses the highest available quality.',
    'Usage foundation','Sign in to keep usage, chats, projects and learning data attached to you.','Cloud wallet active · fair-use limits stay tied to your account.','Available AI credits','Plans & limits',
    'Create presentations, webpages, documents, social content and graphics from a structured brief.','Ask, learn, practice and get explanations adapted to your selected level.',
    'Diagnostics, learning paths, mastery and study support in one place.','Organize goals, study sessions, deadlines and what to work on next.',
    'See what is improving, what is weak and where to focus next.','Set learning, school and creation goals and connect them to your plan.',
    'Return to saved Studio work, documents, research and ongoing projects.','Find education options for the study you actually want.',
    'Know the field before you enter it.','Tell SCHOLARK what you plan to study. Country and target school are optional; the roadmap focuses on knowledge, skills and preparation rather than inventing admissions rules.',
    'Field of study, e.g. Law, Computer Science','Country (optional)','Target university / school (optional)','Start from foundations','I already know the basics',
    'Anything SCHOLARK should know about your goals, strengths or current subjects (optional)','Build my Study Ahead roadmap','Building roadmap…',
    'Skills to build','Key subjects','Books & resources','University preparation','Career directions','Your roadmap','Saved Study Ahead tracks',
    'Add roadmap to Planner','Add key subjects to Mastery','Save / refresh track','Study Ahead is connected to your Planner and Mastery Map.',
    'CHAT HISTORY','+ New chat','Local chat mode.','Sign in','to sync chat history across devices.','No saved chats yet.','Ask SCHOLARK anything you want to learn...','Ask SCHOLARK AI',
    'I’m ready. Ask a question, paste a problem, or tell me what subject you want explained.','Step-by-step method','Worked examples','Key points to remember','Common mistakes','Check yourself','Next step',
    'Upload once. Turn it into useful work.','PDF, DOCX, PPTX, TXT, Markdown, CSV, JSON and images can live in the workflow. Readable documents can immediately become summaries, explanations, quizzes, flashcards, notes, study plans or source material for Studio.',
    '+ Add files','Up to 8 files · max 10 MB each','Summarize','Explain','Quiz','Flashcards','Notes','Study plan','Send to Studio','Ready when you are.',
    'Upload study material, a report, slides, notes or data. SCHOLARK will keep the workflow grounded in what you supplied.','Working…','SCHOLARK is analyzing the uploaded material.',
    'Build the book, chapter by chapter.','Create the complete architecture first, then generate, edit, save and export real chapter drafts in the same workspace.',
    'Working title (optional)','Genre / type','Describe the book you want to create…','Audience (optional)','Third person','First person','Multiple POV','Nonfiction / not applicable',
    'Create book plan with AI','Rebuild book plan with AI','Start with your concept; SCHOLARK will build the chapter architecture.','CHAPTERS','Writing coach','Continuity & purpose','Mood / research direction',
    'Generate chapter draft','Regenerate chapter draft','Export DOCX','Export PDF','Architecting the book…','Writing the chapter…',
    'Curriculum Explorer','Mastery Map','Exam Prep Center','Diagnostic Check','Spaced Review Queue','Study Methods Lab',
    'Find what you know, what is weak and what should enter your Mastery Map next.','Review weak topics at the right time instead of rereading everything.',
    'Run diagnostic','Mixed difficulty','Foundation','Intermediate','Challenge','Refresh queue','You are caught up.','Review now',
    'Active Recall','Feynman Technique','Blurting','Interleaving','Dual Coding','Spaced Repetition','Pomodoro','Cornell Notes','SQ3R','Leitner System',
    'YOUR AI LEARNING + CREATION OS','Learn faster. Create better. Get ahead.','Describe what you want to learn or create…','Create with SCHOLARK AI',
    'One studio. Every format.','Start with intent, not a blank page. SCHOLARK plans the structure, creates the first version and lets you refine only what matters.',
    'A learning system that adapts to you.','Diagnostics, mastery, spaced repetition and AI tutoring work together instead of living in separate tools.',
    'Know where you are going before you get there.','Find schools nearby, explore future studies and learn ahead so your first semester does not have to be your first exposure.',
    'Your next advantage can start today.','Learn, build, research, create and prepare for what comes next — in one place.','Open SCHOLARK Studio',
    'prompt to first draft','creator formats','adaptive learning core','ways to keep improving','Presentation','Webpage','Document','Social','Graphic','Book Studio',
    'Mastery that moves with you.','Weak topics become tomorrow’s practice. Strong topics move into spaced review instead of disappearing.',
    'Explain, quiz, challenge and adapt to your level.','Diagnostics','Find what you do not know before wasting time reviewing what you already understand.',
    'Study plans that respond to progress.','Goals, mastery, practice and revision all feed the same learning plan instead of living in separate screens.',
    'Let the AI presenters explain','Explore nearby schools','Build my head start','LIVE PRODUCT DEMO','auto-cycling demo',
    'Research checked','Design assembled','Outline complete','Quality pass','Ready to edit',
    'Demo: scanning an 8 km radius…','Nearby school matches appear with distance + type.','Compare options → save the ones you want to explore.',
    'Goal selected: Law / Juridical Studies','Previewing first-year subjects + core skills…','Head-start plan ready: concepts to learn before semester 1.',
    'Profile & preferences','Your learning profile should follow you across devices and improve how SCHOLARK teaches and creates.','Display name','Role','Country','City','School / university','Study field','Learning level','Language','Important subjects / topics','Save profile','Open Workspace','New homepage'
  ];

  const css=document.createElement('style');css.id='scholark-v90-style';css.textContent=`
    #v90-language-overlay{position:fixed;inset:0;z-index:2147483647;display:none;place-items:center;background:rgba(11,13,18,.88);backdrop-filter:blur(12px);color:#fff;font-family:Inter,system-ui;padding:24px}
    #v90-language-overlay.open{display:grid}.v90-switch-card{width:min(560px,94vw);padding:28px;border-radius:24px;background:#17191f;border:1px solid rgba(255,255,255,.12);box-shadow:0 30px 100px rgba(0,0,0,.38)}
    .v90-switch-card small{display:block;font:950 8px Inter;letter-spacing:.14em;color:#c9ff6a}.v90-switch-card h2{font:950 30px/1 Inter;margin:10px 0}.v90-switch-card p{font:650 10px/1.55 Inter;color:#c8c4cf}.v90-progress{height:7px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden;margin-top:16px}.v90-progress i{display:block;height:100%;width:35%;background:#c9ff6a;border-radius:inherit;animation:v90move 1s ease-in-out infinite alternate}@keyframes v90move{to{transform:translateX(180%)}}
    .v90-langbox{margin:12px 8px 4px;padding:11px;border-radius:14px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08)}.v90-langbox label{display:block;margin-bottom:6px;font:900 6.8px Inter;letter-spacing:.13em;color:#8f8b98}.v90-langbox select{width:100%;border:1px solid rgba(255,255,255,.12);background:#22252e;color:#fff;border-radius:10px;padding:8px;font:800 8px Inter;outline:0}.v90-langbox option{background:#fff;color:#17191f}
    html[dir="rtl"] #v51-sidebar{left:auto;right:0}html[dir="rtl"] #v51-main{left:0;right:var(--v51-side)}html[dir="rtl"] #v51-side-toggle{left:auto;right:calc(var(--v51-side) - 16px)}html[dir="rtl"] .v51-nav{text-align:right}
  `;document.head.appendChild(css);

  const overlay=document.createElement('div');overlay.id='v90-language-overlay';overlay.innerHTML='<div class="v90-switch-card"><small>SCHOLARK LANGUAGE ENGINE</small><h2>Adapting SCHOLARK…</h2><p id="v90-switch-copy">Translating the homepage, workspace and live product demo before reload.</p><div class="v90-progress"><i></i></div></div>';document.body.appendChild(overlay);

  const code=()=>localStorage.getItem('scholark_ui_language')||'nl';
  const languageName=c=>LANGS.find(x=>x[0]===c)?.[2]||'English';
  const nativeName=c=>LANGS.find(x=>x[0]===c)?.[1]||'English';
  const key=c=>'scholark_v90_i18n_'+c;
  function loadMap(c){try{return JSON.parse(localStorage.getItem(key(c))||'{}')||{}}catch{return{}}}
  function saveMap(c,m){try{localStorage.setItem(key(c),JSON.stringify(m))}catch{}}
  let map=loadMap(code()),translating=false,unknownTimer=null;

  function eligibleText(s){
    const t=clean(s);if(!t||t.length<2||t.length>420)return false;
    if(/^https?:|^[\d\s.,:%+$€£¥/\-–—()]+$/.test(t))return false;
    if(/^[A-Z0-9_\-.]{2,18}$/.test(t)&&!t.includes(' '))return false;
    return /[A-Za-zÀ-žͰ-ϿЀ-ӿ]/.test(t);
  }
  function protectedNode(el){
    return !!el?.closest?.('script,style,code,pre,[contenteditable="true"],.v52-msg.user,.v65-prose,[data-v65-body],#v86-output .v62-solution,input[type="password"]');
  }
  function collectDom(limit=180){
    const out=new Set();
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let n;while((n=walker.nextNode())&&out.size<limit){const el=n.parentElement,t=clean(n.nodeValue);if(!protectedNode(el)&&eligibleText(t))out.add(t)}
    $$('input[placeholder],textarea[placeholder],[aria-label],[title]').forEach(el=>{for(const a of ['placeholder','aria-label','title']){const t=clean(el.getAttribute(a));if(eligibleText(t))out.add(t)}});
    return [...out];
  }
  async function translateBatch(target,strings){
    if(target==='en')return Object.fromEntries(strings.map(s=>[s,s]));
    const result={};
    for(let i=0;i<strings.length;i+=60){
      const chunk=strings.slice(i,i+60),ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),95000);
      try{
        const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'translate_ui',language:languageName(target),strings:chunk}),signal:ctrl.signal});
        const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)throw new Error(d?.error||'Translation failed');
        for(const x of d.result?.translations||[])if(chunk.includes(String(x.source||''))&&clean(x.translated))result[x.source]=x.translated;
      }finally{clearTimeout(timer)}
    }
    return result;
  }
  function applyKnown(root=document){
    const c=code();document.documentElement.lang=c;document.documentElement.dir=RTL.has(c)?'rtl':'ltr';
    map=loadMap(c);
    if(c==='en')return;
    const base=root.nodeType===1?root:document;
    const walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT);
    let n;while((n=walker.nextNode())){const el=n.parentElement;if(protectedNode(el))continue;const raw=n.nodeValue,t=clean(raw),tr=map[t];if(!tr||tr===t)continue;const lead=raw.match(/^\s*/)?.[0]||'',tail=raw.match(/\s*$/)?.[0]||'';n.nodeValue=lead+tr+tail}
    $$('input[placeholder],textarea[placeholder],[aria-label],[title]',base).forEach(el=>{for(const a of ['placeholder','aria-label','title']){const t=clean(el.getAttribute(a)),tr=map[t];if(tr)el.setAttribute(a,tr)}});
  }
  async function fillUnknown(){
    const c=code();if(c==='en'||translating||navigator.onLine===false)return;
    const missing=[...new Set([...CORE,...collectDom(140)])].filter(s=>eligibleText(s)&&!map[s]).slice(0,80);if(!missing.length)return;
    translating=true;
    try{const add=await translateBatch(c,missing);map={...map,...add};saveMap(c,map);applyKnown()}catch(e){console.warn('[SCHOLARK] background UI translation:',clean(e?.message||e))}finally{translating=false}
  }
  function scheduleUnknown(){clearTimeout(unknownTimer);unknownTimer=setTimeout(fillUnknown,700)}

  function upgradeSelectors(){
    const options=LANGS.map(([v,n])=>'<option value="'+v+'">'+n+'</option>').join('');
    for(const sel of [$('#v55-language'),$('#v36-language'),$('#v89-lang')].filter(Boolean)){
      const val=code();if(sel.dataset.v90!=='1'){sel.dataset.v90='1';sel.innerHTML=options}
      if([...sel.options].some(o=>o.value===val))sel.value=val;
    }
    const side=$('#v51-sidebar');if(side){
      let box=$('.v90-langbox',side);if(!box){box=document.createElement('div');box.className='v90-langbox';box.innerHTML='<label>SCHOLARK LANGUAGE</label><select id="v90-language"></select>';$('.v85-wallet',side)?.insertAdjacentElement('beforebegin',box)||$('.v51-quality',side)?.insertAdjacentElement('beforebegin',box)}
      const sel=$('#v90-language',box);if(sel&&sel.dataset.v90!=='1'){sel.dataset.v90='1';sel.innerHTML=options;sel.value=code();sel.onchange=()=>changeLanguage(sel.value)}
    }
  }

  async function changeLanguage(target){
    if(!LANGS.some(x=>x[0]===target))return;
    if(target===code()){applyKnown();return}
    overlay.classList.add('open');$('#v90-switch-copy').textContent='Preparing '+nativeName(target)+' across SCHOLARK. The page will reload when the interface is ready.';
    const existing=loadMap(target),strings=[...new Set([...CORE,...collectDom(220)])].filter(eligibleText),missing=strings.filter(s=>!existing[s]);
    let next={...existing};
    try{
      if(missing.length){const add=await translateBatch(target,missing);next={...next,...add};saveMap(target,next)}
    }catch(e){console.warn('[SCHOLARK] language pre-translation:',clean(e?.message||e))}
    localStorage.setItem('scholark_ui_language',target);document.documentElement.lang=target;document.documentElement.dir=RTL.has(target)?'rtl':'ltr';
    try{localStorage.setItem('scholark_language_changed_at',String(Date.now()))}catch{}
    location.reload();
  }

  document.addEventListener('change',e=>{
    const sel=e.target?.closest?.('#v55-language,#v36-language,#v90-language');if(!sel)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();changeLanguage(sel.value);
  },true);

  function boot(){
    document.documentElement.lang=code();document.documentElement.dir=RTL.has(code())?'rtl':'ltr';
    upgradeSelectors();applyKnown();scheduleUnknown();
  }
  const obs=new MutationObserver(muts=>{upgradeSelectors();for(const m of muts)for(const n of m.addedNodes||[])if(n.nodeType===1)applyKnown(n);scheduleUnknown()});
  obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
  addEventListener('focus',()=>{upgradeSelectors();applyKnown();scheduleUnknown()});addEventListener('scholark-language-change',()=>setTimeout(boot,20));
  setTimeout(boot,80);

  window.__SCHOLARK_I18N__={langs:LANGS.map(x=>[x[0],x[1]]),languageName,nativeName,code,changeLanguage,apply:applyKnown,translateMissing:fillUnknown};
})();