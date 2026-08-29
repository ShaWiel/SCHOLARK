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
    ['ta','தமிழ்','Tamil'],['te','తెలుగు','Telugu'],['mr','मराठी','Marathi'],
    ['af','Afrikaans','Afrikaans'],['sq','Shqip','Albanian'],['hy','Հայերեն','Armenian'],['az','Azərbaycan dili','Azerbaijani'],['eu','Euskara','Basque'],
    ['be','Беларуская','Belarusian'],['bs','Bosanski','Bosnian'],['bg','Български','Bulgarian'],['ca','Català','Catalan'],['hr','Hrvatski','Croatian'],
    ['et','Eesti','Estonian'],['ka','ქართული','Georgian'],['gu','ગુજરાતી','Gujarati'],['ht','Kreyòl ayisyen','Haitian Creole'],['ha','Hausa','Hausa'],
    ['is','Íslenska','Icelandic'],['ga','Gaeilge','Irish'],['jv','Basa Jawa','Javanese'],['kn','ಕನ್ನಡ','Kannada'],['kk','Қазақ тілі','Kazakh'],
    ['km','ខ្មែរ','Khmer'],['lo','ລາວ','Lao'],['lv','Latviešu','Latvian'],['lt','Lietuvių','Lithuanian'],['mk','Македонски','Macedonian'],
    ['ml','മലയാളം','Malayalam'],['mt','Malti','Maltese'],['mn','Монгол','Mongolian'],['ne','नेपाली','Nepali'],['ps','پښتو','Pashto'],
    ['pa','ਪੰਜਾਬੀ','Punjabi'],['sr','Српски','Serbian'],['sk','Slovenčina','Slovak'],['sl','Slovenščina','Slovenian'],['so','Soomaali','Somali'],
    ['su','Basa Sunda','Sundanese'],['yo','Yorùbá','Yoruba'],['zu','isiZulu','Zulu'],['xh','isiXhosa','Xhosa'],['am','አማርኛ','Amharic'],
    ['my','မြန်မာ','Burmese'],['si','සිංහල','Sinhala'],['uz','Oʻzbekcha','Uzbek'],['cy','Cymraeg','Welsh'],['gl','Galego','Galician'],
    ['ceb','Cebuano','Cebuano'],['eo','Esperanto','Esperanto'],['gd','Gàidhlig','Scottish Gaelic'],['ku','Kurdî','Kurdish'],['ky','Кыргызча','Kyrgyz']
  ];
  const RTL=new Set(['ar','ur','fa','he','ps']);
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
    'AI LEARNING + CREATION OS','Account','Sign in','Sign out','Plans & billing','Open Workspace',
    'YOUR AI LEARNING + CREATION OS','Learn faster. Create better.','Get ahead.','Learn faster. Create better. Get ahead.','Describe what you want to learn or create…','Create with SCHOLARK AI',
    'One studio. Every format.','Start with intent, not a blank page. SCHOLARK plans the structure, creates the first version and lets you refine only what matters.',
    'A learning system that adapts to you.','Diagnostics, mastery, spaced repetition and AI tutoring work together instead of living in separate tools.',
    'Know where you are going before you get there.','Find schools nearby, explore future studies and learn ahead so your first semester does not have to be your first exposure.',
    'Your next advantage can start today.','Learn, build, research, create and prepare for what comes next — in one place.','Open SCHOLARK Studio',
    'prompt to first draft','creator formats','adaptive learning core','ways to keep improving','Presentation','Webpage','Document','Social','Graphic','Book Studio',
    'From prompt to polished deck.','Outline, narrative, slide copy, visuals, charts and design are assembled before you edit.','Complete first draft','Slide-by-slide regeneration','Research + citations','PPTX / PDF export',
    'Generate a real page, not wireframe filler.','Hero, sections, copy, CTA hierarchy and responsive structure are planned together.','Landing pages','Portfolios','Project pages','Responsive layouts',
    'Reports that already have structure and substance.','SCHOLARK can plan the argument, research, sections, conclusion and references before drafting.','Reports & essays','Research-first writing','Section regeneration','DOCX / PDF export',
    'Campaign thinking, not random captions.','Hooks, captions, carousels, visual direction and CTA are generated as one campaign system.','Carousels','LinkedIn content','Short-form hooks','Campaign concepts',
    'Posters, infographics and diagrams built around hierarchy.','Copy, visual structure and design intent are created together so you start from a finished concept.','Posters','Infographics','Diagrams','Social graphics',
    'Turn an idea into a book you can actually finish.','Plan length, audience, chapters, paragraph flow, scenes and what should logically come next.','Book idea development','Chapter architecture','Writing coach','Continuation suggestions',
    'Structure','AI plans the logic first.','Draft','Content and design arrive together.','Improve','Regenerate only what needs work.','Export','Use the result outside SCHOLARK.',
    'Mastery that moves with you.','Weak topics become tomorrow’s practice. Strong topics move into spaced review instead of disappearing.',
    'Explain, quiz, challenge and adapt to your level.','Diagnostics','Find what you do not know before wasting time reviewing what you already understand.',
    'Study plans that respond to progress.','Goals, mastery, practice and revision all feed the same learning plan instead of living in separate screens.',
    'Let the AI presenters explain','Explore nearby schools','Build my head start','LIVE PRODUCT DEMO','auto-cycling demo',
    'Research checked','Design assembled','Outline complete','Quality pass','Ready to edit',
    'Demo: scanning an 8 km radius…','Nearby school matches appear with distance + type.','Compare options → save the ones you want to explore.',
    'Goal selected: Law / Juridical Studies','Previewing first-year subjects + core skills…','Head-start plan ready: concepts to learn before semester 1.',
    'AI TUTOR','Explain photosynthesis like I am 13.','Simplifying concept…','Quick check: Why do plants need sunlight?','adaptive question ready','Weak topic detected','adding a shorter practice set for tomorrow',
    '“Explain photosynthesis like I am 13.” → Simplifying concept…','Quick check: “Why do plants need sunlight?” → adaptive question ready','Weak topic detected → adding a shorter practice set for tomorrow',
    'DIAGNOSTICS','Scanning 12 skills…','3 weak areas found','prioritizing practice','Mastered topics moved to spaced review','3 weak areas found → prioritizing practice',
    'Profile & preferences','Your learning profile should follow you across devices and improve how SCHOLARK teaches and creates.','Display name','Role','Country','City','School / university','Study field','Learning level','Language','Important subjects / topics','Save profile','Open Workspace','New homepage',
    'Go to Workspace','Open your dashboard, Studio AI, Tutor, learning tools, planning, goals and Pro tools.','Continue where you left off','Continue →',
    'Ask Tutor','Deep explanation + examples','Use my files','Summaries, quizzes and notes','Run diagnostic','Find weak topics fast','Create in Studio','Build a polished artifact','Prepare for a future field',
    'Language Learner','Learn vocabulary, grammar, pronunciation and conversation with adaptive lessons.','Learn a language','Build a language lesson','Target language','Support language','Current level','Learning goal','Topic or situation','Conversation','Travel','School','Work','Grammar','Vocabulary','Pronunciation','Exam preparation',
    'Lesson complete','Listen','Practice speaking','Show answer','Hide answer','Vocabulary & phrases','Grammar made clear','Practice dialogue','Exercises','Culture tip','Next lesson','Your language progress','Lessons completed','Current streak','XP',
    'SCHOLARK PLANS','Choose how much advantage you want.','Free','Plus','Pro','SCHOLARK Free','SCHOLARK Plus','SCHOLARK Pro','MOST POPULAR','No payment method required.','Start free','Start Plus free trial','Start Pro free trial',
    'For everyday learning, practice and planning.','For learners and creators who use Studio AI regularly.','Maximum AI quality, large projects and future-study tools.',
    'AI Tutor with step-by-step lessons','Diagnostics, Mastery & Spaced Review','Planner, Goals & Progress','Files & Notes analysis','Language Learner basics','88-language interface','100 AI text requests/day','8 AI images/day',
    'Everything in Free','Studio AI: Presentation, Webpage, Document, Social & Graphic','Research + citations and web sources','Cloud projects + version history','Advanced Files & Notes: Ask Files, worksheets and study tools','Natural Rewrite — 2/day','350 AI text requests/day','25 AI images/day',
    'Everything in Plus','Highest-quality SCHOLARK AI','Unlimited Studio + Natural Rewrite','Presentations up to 100 slides','Documents/reports up to 100 pages','Book Studio up to 900,000 words','All genres + custom blends','Schools Near Me + Study Ahead','Advanced Language Learner: conversation + pronunciation practice','1,000 AI text requests/day','60 AI images/day',
    '/ month','7 days free, then $14.99/month. Cancel anytime.','7 days free, then $19.99/month. Cancel anytime.','Plans & limits',
    'Presentation Builder','Webpage Builder','Document Builder','Social Builder','Graphic Builder','Research-first','Facts, structure and visuals are checked before the first draft is shown.','Evidence, narrative and strong slide logic generated together.',
    'GENERATOR-FIRST','LEARNING OS','SCHOLARK FUTURE','Study Ahead explains what your future study may demand before you enroll.','Schools Near Me helps you find nearby education options around your location.',
    'Use your location to discover schools nearby and compare the options around you.','Choose a future study or career and build a learning head start before your first class.'
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
  const CACHE_VERSION='v2-complete-ui';
  const key=c=>'scholark_v90_i18n_'+CACHE_VERSION+'_'+c;
  function loadMap(c){try{return JSON.parse(localStorage.getItem(key(c))||'{}')||{}}catch{return{}}}
  function saveMap(c,m){try{localStorage.setItem(key(c),JSON.stringify(m))}catch{}}
  let map=loadMap(code()),translating=false,unknownTimer=null;

  function eligibleText(s){
    const t=clean(s);if(!t||t.length<2||t.length>420)return false;
    if(/^https?:|^[\d\s.,:%+$€£¥/\-–—()]+$/.test(t))return false;
    if(/^[A-Z0-9_\-.]{2,18}$/.test(t)&&!t.includes(' '))return false;
    return /[\p{L}\p{N}]/u.test(t);
  }
  function protectedNode(el){
    return !!el?.closest?.('script,style,code,pre,[contenteditable="true"],input[type="password"],.v52-msg.user,.v52-msg.ai,#v52-chat,.v93-ai,.v62-answer,.v62-results,#v86-output,.v65-prose,.v65-editor,[data-v65-body],[data-v65-title],.v57-slide,.v58-canvas,.v68-editor,.v75-doc-editor,.v76-canvas,.v77-page-preview');
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
    const chunks=[];for(let i=0;i<strings.length;i+=90)chunks.push(strings.slice(i,i+90));
    const result={};let cursor=0;
    const worker=async()=>{
      while(cursor<chunks.length){
        const idx=cursor++,chunk=chunks[idx],ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),50000);
        try{
          const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'translate_ui',language:languageName(target),strings:chunk}),signal:ctrl.signal});
          const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)continue;
          for(const x of d.result?.translations||[])if(chunk.includes(String(x.source||''))&&clean(x.translated))result[x.source]=x.translated;
        }catch(e){console.warn('[SCHOLARK] translation chunk '+(idx+1)+':',clean(e?.message||e))}finally{clearTimeout(timer)}
      }
    };
    await Promise.all(Array.from({length:Math.min(5,chunks.length)},()=>worker()));
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
  async function translateCurrentPage(showOverlay=false){
    const target=code();if(target==='en'||navigator.onLine===false){applyKnown();overlay.classList.remove('open');return}
    if(translating)return;translating=true;
    if(showOverlay){overlay.classList.add('open');$('#v90-switch-copy').textContent='Finishing '+nativeName(target)+' across the entire SCHOLARK interface…'}
    try{
      for(let pass=0;pass<3;pass++){
        upgradeSelectors();applyKnown();
        const translated=new Set(Object.values(map)),strings=[...new Set([...CORE,...collectDom(900)])].filter(eligibleText);
        const missing=strings.filter(s=>!map[s]&&!translated.has(s));
        if(!missing.length)break;
        const add=await translateBatch(target,missing);if(!Object.keys(add).length)break;
        map={...map,...add};saveMap(target,map);applyKnown();
        await new Promise(r=>setTimeout(r,90));
      }
    }catch(e){console.warn('[SCHOLARK] full-page localization:',clean(e?.message||e))}
    finally{
      translating=false;applyKnown();
      if(showOverlay){overlay.style.opacity='0';setTimeout(()=>{overlay.classList.remove('open');overlay.style.removeProperty('opacity')},180)}
      try{sessionStorage.removeItem('scholark_i18n_pending')}catch{}
    }
  }
  async function fillUnknown(){return translateCurrentPage(false)}
  function scheduleUnknown(){clearTimeout(unknownTimer);unknownTimer=setTimeout(fillUnknown,180)}

  function upgradeSelectors(){
    const options=LANGS.map(([v,n])=>'<option value="'+v+'">'+n+'</option>').join('');
    for(const sel of [$('#v55-language'),$('#v36-language'),$('#v89-lang')].filter(Boolean)){
      const val=code();if(sel.dataset.v90!=='1'){sel.dataset.v90='1';sel.innerHTML=options}
      if([...sel.options].some(o=>o.value===val))sel.value=val;
    }
    for(const sel of [$('#v41-language'),$('#v65-language')].filter(Boolean)){
      if(sel.dataset.v90!=='1'){const val=sel.value||code();sel.dataset.v90='1';sel.innerHTML=options;if([...sel.options].some(o=>o.value===val))sel.value=val;else sel.value=code()}
    }
    const legacyStudio=$('#sv24-lang');if(legacyStudio&&legacyStudio.dataset.v90!=='1'){
      const oldValue=legacyStudio.value,name=languageName(code());legacyStudio.dataset.v90='1';legacyStudio.innerHTML=LANGS.map(([v,n,en])=>'<option value="'+en+'">'+n+'</option>').join('');legacyStudio.value=[...legacyStudio.options].some(o=>o.value===oldValue)?oldValue:name;
    }
    const side=$('#v51-sidebar');if(side){
      let box=$('.v90-langbox',side);if(!box){box=document.createElement('div');box.className='v90-langbox';box.innerHTML='<label>SCHOLARK LANGUAGE</label><select id="v90-language"></select>';$('.v85-wallet',side)?.insertAdjacentElement('beforebegin',box)||$('.v51-quality',side)?.insertAdjacentElement('beforebegin',box)}
      const sel=$('#v90-language',box);if(sel&&sel.dataset.v90!=='1'){sel.dataset.v90='1';sel.innerHTML=options;sel.value=code();sel.onchange=()=>changeLanguage(sel.value)}
    }
  }

  async function changeLanguage(target){
    if(!LANGS.some(x=>x[0]===target))return;
    if(target===code()){applyKnown();translateCurrentPage(false);return}
    overlay.classList.add('open');overlay.style.removeProperty('opacity');
    $('#v90-switch-copy').textContent='Preparing '+nativeName(target)+' across the homepage, Workspace, pricing and live demos…';
    const existing=loadMap(target),strings=[...new Set([...CORE,...collectDom(1000)])].filter(eligibleText),missing=strings.filter(s=>!existing[s]&&!Object.values(existing).includes(s));
    try{
      if(missing.length){const add=await translateBatch(target,missing);saveMap(target,{...existing,...add})}
    }catch(e){console.warn('[SCHOLARK] language pre-translation:',clean(e?.message||e))}
    localStorage.setItem('scholark_ui_language',target);document.documentElement.lang=target;document.documentElement.dir=RTL.has(target)?'rtl':'ltr';
    try{localStorage.setItem('scholark_language_changed_at',String(Date.now()));sessionStorage.setItem('scholark_i18n_pending','1')}catch{}
    location.reload();
  }

  document.addEventListener('change',e=>{
    const sel=e.target?.closest?.('#v55-language,#v36-language,#v90-language,#v89-lang');if(!sel)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();changeLanguage(sel.value);
  },true);

  function boot(){
    document.documentElement.lang=code();document.documentElement.dir=RTL.has(code())?'rtl':'ltr';
    upgradeSelectors();applyKnown();
    const cached=loadMap(code()),needsInitial=code()!=='en'&&Object.keys(cached).length<40;
    const pending=sessionStorage.getItem('scholark_i18n_pending')==='1'||needsInitial;
    if(pending){overlay.classList.add('open');$('#v90-switch-copy').textContent='Finishing '+nativeName(code())+' across the entire SCHOLARK interface…'}
    setTimeout(()=>translateCurrentPage(pending),pending?60:220);
    setTimeout(()=>translateCurrentPage(false),700);
  }
  const obs=new MutationObserver(muts=>{upgradeSelectors();for(const m of muts){if(m.type==='characterData'&&m.target?.parentElement)applyKnown(m.target.parentElement);for(const n of m.addedNodes||[]){if(n.nodeType===1)applyKnown(n);else if(n.nodeType===3&&n.parentElement)applyKnown(n.parentElement)}}scheduleUnknown()});
  obs.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
  addEventListener('focus',()=>{upgradeSelectors();applyKnown();scheduleUnknown()});addEventListener('scholark-language-change',()=>setTimeout(boot,20));
  setTimeout(boot,80);

  window.__SCHOLARK_I18N__={langs:LANGS.map(x=>[x[0],x[1]]),languageName,nativeName,code,changeLanguage,apply:applyKnown,translateMissing:fillUnknown,translateCurrentPage,count:LANGS.length};
})();