(() => {
  if(window.__SCHOLARK_V91_WORKSPACE_POLISH__)return;
  window.__SCHOLARK_V91_WORKSPACE_POLISH__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const tools=[
    ['dashboard','Dashboard','Overview, level, usage and quick actions'],
    ['studio','Studio AI','Presentations, documents, webpages, graphics and social'],
    ['tutor','AI Tutor','Deep explanations, examples and guided learning'],
    ['education','Education & Learning','Diagnostics, mastery, exams and spaced review'],
    ['planner','Planner','Tasks, deadlines and study sessions'],
    ['progress','Progress','See what is improving and what is weak'],
    ['goal','Goals','Learning, school and creation goals'],
    ['files','Files & Notes','Upload material and turn it into useful work'],
    ['project','My Projects','Saved Studio and cloud projects'],
    ['schools','Schools Near Me','Explore nearby education options'],
    ['study','Study Ahead','Prepare before starting a future field'],
    ['book','Book Studio','Plan, write, edit and export books']
  ];
  const css=document.createElement('style');css.id='scholark-v91-style';css.textContent=`
    #v51-main,.v51-native-host,#v41-studio-workspace,#v50-school{scrollbar-gutter:stable}
    #v51-main *,.v51-native-host *{overflow-wrap:anywhere}
    .v36-shell-controls{display:none!important}
    #v51-home{max-width:min(190px,30vw);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .v51-card,.v51-level,.v52-action,.v62-answer-card,.v86-card,.v65-nav,.v65-editor,.v65-coach{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
    .v51-card:hover,.v51-level:hover,.v52-action:hover{transform:translateY(-2px);box-shadow:0 20px 54px rgba(31,27,63,.09);border-color:rgba(109,93,252,.28)}
    .v51-card:focus-visible,.v51-nav:focus-visible,.v52-btn:focus-visible,.v62-btn:focus-visible,.v65-btn:focus-visible,.v86-actions button:focus-visible{outline:3px solid rgba(109,93,252,.28);outline-offset:2px}
    .v52-shell,.v62-study,.v65-book,.v86{width:min(100%,1480px);box-sizing:border-box}
    .v62-study{position:relative;z-index:3;min-height:100vh}.v62-study .v62-form{display:grid!important;visibility:visible!important;opacity:1!important;position:relative!important;z-index:5!important}
    body.v51-study #v51-main{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    body.v51-study #v25-study{display:none!important}
    body.v51-book #v51-main{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    body.v51-book #v25-book{display:none!important}
    .v82-tutor-layout{grid-template-columns:minmax(210px,260px) minmax(0,1fr)!important;align-items:start!important}.v82-chatbody{overflow:hidden}.v82-chatbody #v52-chat{max-height:58vh!important;scroll-behavior:smooth}.v82-chatbody .v52-msg.ai{white-space:normal;line-height:1.6}.v82-chatbody .v62-answer-card{margin:8px 0;max-width:none}.v82-chatbody .v62-answer-card p{white-space:pre-wrap}
    .v65-form .v81-field label{font-size:7.5px!important}.v65-form input,.v65-form select,.v65-form textarea{min-height:42px}
    .v86-output{overflow:auto;max-height:72vh}.v86-output .v62-question{white-space:normal}.v86-file{overflow-wrap:anywhere}
    .v91-quick{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:0 0 18px}.v91-quick button{border:1px solid rgba(23,25,31,.09);background:#fff;border-radius:14px;padding:12px;text-align:left;cursor:pointer;min-width:0}.v91-quick button b{display:block;font:900 9px Inter;color:#17191f}.v91-quick button span{display:block;margin-top:4px;font:650 7px/1.35 Inter;color:#777}.v91-quick button:hover{border-color:#6d5dfc;background:#f7f5ff}
    .v91-resume{margin:0 0 22px;padding:14px 16px;border-radius:17px;background:linear-gradient(135deg,#eeecff,#fbfaf7);border:1px solid rgba(109,93,252,.13);display:flex;align-items:center;justify-content:space-between;gap:14px}.v91-resume b{display:block;font:900 10px Inter}.v91-resume span{display:block;margin-top:4px;font:650 8px/1.4 Inter;color:#746f7b}.v91-resume button{border:0;border-radius:10px;background:#17191f;color:#c9ff6a;padding:9px 11px;font:900 8px Inter;cursor:pointer;white-space:nowrap}
    #v91-command{position:fixed;inset:0;z-index:2147483647;display:none;align-items:flex-start;justify-content:center;padding-top:min(16vh,150px);background:rgba(11,13,18,.64);backdrop-filter:blur(8px)}#v91-command.open{display:flex}
    .v91-command-card{width:min(680px,92vw);max-height:70vh;overflow:hidden;background:#fff;border-radius:22px;box-shadow:0 30px 110px rgba(0,0,0,.34);padding:12px}.v91-command-card input{width:100%;box-sizing:border-box;border:0;background:#f4f3f1;border-radius:14px;padding:15px;font:750 12px Inter;outline:0}.v91-results{max-height:52vh;overflow:auto;padding-top:8px}.v91-result{width:100%;border:0;background:transparent;border-radius:12px;padding:11px 12px;text-align:left;cursor:pointer}.v91-result:hover,.v91-result.active{background:#eeecff}.v91-result b{display:block;font:900 9px Inter}.v91-result span{display:block;margin-top:3px;color:#777;font:650 7.5px/1.35 Inter}.v91-hint{padding:7px 10px 2px;color:#888;font:700 7px Inter}
    @media(max-width:1000px){.v91-quick{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:720px){.v91-quick{grid-template-columns:1fr 1fr}.v91-resume{display:block}.v91-resume button{margin-top:10px}.v82-tutor-layout{grid-template-columns:1fr!important}}
  `;document.head.appendChild(css);

  const palette=document.createElement('div');palette.id='v91-command';palette.innerHTML='<div class="v91-command-card"><input id="v91-command-input" placeholder="Search SCHOLARK tools…"><div class="v91-results" id="v91-command-results"></div><div class="v91-hint">Enter to open · Esc to close · Ctrl/Cmd + K from anywhere in Workspace</div></div>';document.body.appendChild(palette);
  const input=$('#v91-command-input',palette),results=$('#v91-command-results',palette);let active=0,filtered=tools;

  function openTool(id){const b=$('#v51-sidebar [data-v51-tool="'+id+'"]');if(b){b.click();return}location.hash=id}
  function draw(){
    const q=clean(input.value).toLowerCase();filtered=tools.filter(x=>!q||x[1].toLowerCase().includes(q)||x[2].toLowerCase().includes(q)||x[0].includes(q));active=Math.min(active,Math.max(0,filtered.length-1));
    results.innerHTML=filtered.length?filtered.map((x,i)=>'<button class="v91-result '+(i===active?'active':'')+'" data-v91="'+x[0]+'"><b>'+x[1]+'</b><span>'+x[2]+'</span></button>').join(''):'<div class="v91-hint">No matching tool.</div>';
    $$('[data-v91]',results).forEach(b=>b.onclick=()=>{palette.classList.remove('open');openTool(b.dataset.v91)});
  }
  function openPalette(){if(!document.body.classList.contains('v51-workspace'))return;palette.classList.add('open');input.value='';active=0;draw();setTimeout(()=>input.focus(),20)}
  input.oninput=draw;input.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();active=Math.min(active+1,filtered.length-1);draw()}else if(e.key==='ArrowUp'){e.preventDefault();active=Math.max(0,active-1);draw()}else if(e.key==='Enter'&&filtered[active]){e.preventDefault();palette.classList.remove('open');openTool(filtered[active][0])}};
  palette.onclick=e=>{if(e.target===palette)palette.classList.remove('open')};
  addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette()}else if(e.key==='Escape')palette.classList.remove('open')});

  function lastActivity(){
    try{const h=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]');if(h?.[0])return {tool:'project',title:h[0].project||'Recent Studio project',desc:h[0].rawPrompt||h[0].prompt||'Continue your latest creation'}}
    catch{}
    try{const b=JSON.parse(localStorage.getItem('scholark_v65_book')||'null');if(b?.name||b?.concept)return {tool:'book',title:b.name||'Book Studio draft',desc:b.concept||'Continue writing your book'}}
    catch{}
    try{const s=JSON.parse(localStorage.getItem('scholark_v83_study_ahead')||'null');if(s?.field)return {tool:'study',title:'Study Ahead · '+s.field,desc:'Continue your future-study roadmap'}}
    catch{}
    return {tool:'files',title:'Start with your material',desc:'Upload notes, slides or a document and turn it into a study or creation workflow'};
  }
  function dashboard(){
    const shell=$('#v51-main [data-v51-page="dashboard"] .v51-shell');if(!shell)return;
    if(!$('.v91-quick',shell)){
      const q=document.createElement('div');q.className='v91-quick';q.innerHTML=[
        ['tutor','Ask Tutor','Deep explanation + examples'],['files','Use my files','Summaries, quizzes and notes'],['education','Run diagnostic','Find weak topics fast'],['studio','Create in Studio','Build a polished artifact'],['study','Study Ahead','Prepare for a future field']
      ].map(x=>'<button data-v91-q="'+x[0]+'"><b>'+x[1]+'</b><span>'+x[2]+'</span></button>').join('');
      const anchor=$('.v51-head',shell);anchor?.insertAdjacentElement('afterend',q);$$('[data-v91-q]',q).forEach(b=>b.onclick=()=>openTool(b.dataset.v91Q));
    }
    let r=$('.v91-resume',shell);if(!r){r=document.createElement('div');r.className='v91-resume';const q=$('.v91-quick',shell);q?.insertAdjacentElement('afterend',r)}
    if(r){const a=lastActivity();r.innerHTML='<div><b>Continue where you left off</b><span>'+a.title+' · '+a.desc+'</span></div><button type="button">Continue →</button>';r.querySelector('button').onclick=()=>openTool(a.tool)}
  }
  function sync(){
    dashboard();
    const study=location.hash.toLowerCase()==='#study';if(study){$('#v25-study')?.classList.remove('open');const form=$('.v62-study .v62-form');if(form){form.style.display='grid';form.style.visibility='visible';form.style.opacity='1'}}
  }
  new MutationObserver(()=>{clearTimeout(window.__v91sync);window.__v91sync=setTimeout(sync,90)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,40));setTimeout(sync,260);
  window.__SCHOLARK_V91__={openPalette,openTool};
})();