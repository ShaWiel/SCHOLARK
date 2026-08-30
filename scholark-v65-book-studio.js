(() => {
  if (window.__SCHOLARK_V65_BOOK_STUDIO__) return;
  window.__SCHOLARK_V65_BOOK_STUDIO__ = true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim(), uid=()=>Math.random().toString(36).slice(2,10);
  const STORE='scholark_v65_book';
  const state={book:null,index:0,busy:false};
  const GENRES=[
    'Adventure','Action','Romance','Contemporary Romance','Historical Romance','Romantic Comedy','Dark Romance','Paranormal Romance','Fantasy Romance',
    'Horror','Psychological Horror','Gothic Horror','Supernatural Horror','Cosmic Horror','Slasher','Dark Fantasy',
    'Fantasy','Epic Fantasy','Urban Fantasy','High Fantasy','Low Fantasy','Portal Fantasy','Fairy Tale / Retelling',
    'Science Fiction','Space Opera','Cyberpunk','Dystopian','Post-Apocalyptic','Time Travel','Alternate History',
    'Mystery','Cozy Mystery','Detective','Crime','Thriller','Psychological Thriller','Legal Thriller','Political Thriller','Spy / Espionage',
    'Suspense','Drama','Historical Fiction','Literary Fiction','Contemporary Fiction','Coming of Age','Family Saga','Satire','Humor / Comedy',
    'Young Adult','Middle Grade','Children’s','Picture Book','Poetry','Short Stories','Anthology',
    'Biography','Autobiography','Memoir','Self-Help','Personal Development','Business','Entrepreneurship','Leadership','Finance','True Crime',
    'History','Politics','Philosophy','Psychology','Sociology','Education','Science','Technology','Health & Wellness','Travel','Cookbook','Religion / Spirituality'
  ];
  const css=document.createElement('style'); css.id='scholark-v65-style';
  css.textContent=`
    .v65-book{max-width:1400px;margin:0 auto;padding:28px 30px 46px;font-family:Inter,system-ui;color:#17191f}.v65-k{font:950 8px Inter;letter-spacing:.15em;color:#6d5dfc}.v65-h{display:flex;justify-content:space-between;gap:22px}.v65-h h1{font:950 clamp(40px,5vw,64px)/.94 Inter;letter-spacing:-.055em;margin:8px 0 10px}.v65-h p{max-width:800px;color:#706c77;font:600 11px/1.55 Inter;margin:0}.v65-pill{background:#17191f;color:#c9ff6a;border-radius:999px;padding:9px 12px;font:900 8px Inter;height:max-content}
    .v65-form{margin-top:20px;background:#fff;border:1px solid #ebe9ee;border-radius:22px;padding:20px;display:grid;gap:9px}.v65-row{display:grid;grid-template-columns:1fr 1fr;gap:9px}.v65-form input,.v65-form select,.v65-form textarea{width:100%;box-sizing:border-box;border:1px solid #ddd9e2;background:#fafafa;border-radius:12px;padding:12px 13px;font:650 10px Inter}.v65-form textarea{min-height:105px;resize:vertical}.v65-btn{border:0;border-radius:12px;background:#17191f;color:#fff;padding:12px 14px;font:900 9px Inter;cursor:pointer}.v65-btn.primary{background:#c9ff6a;color:#151821}.v65-btn:disabled{opacity:.55;cursor:wait}.v65-status{font:750 9px/1.45 Inter;color:#655f6e}.v65-full{background:linear-gradient(120deg,#17191f,#352b73)!important;color:#fff!important}.v65-full span{color:#c9ff6a}.v65-progress{height:8px;border-radius:999px;background:#ece9f2;overflow:hidden;margin-top:8px}.v65-progress i{display:block;height:100%;background:linear-gradient(90deg,#6d5dfc,#c9ff6a);transition:width .25s ease}
    .v65-work{display:grid;grid-template-columns:250px minmax(0,1fr) 260px;gap:12px;margin-top:18px}.v65-nav,.v65-editor,.v65-coach{background:#fff;border:1px solid #ebe9ee;border-radius:20px;overflow:auto;max-height:76vh}.v65-nav{padding:10px}.v65-nav-title{padding:8px;font:900 8px Inter;letter-spacing:.12em;color:#77717e}.v65-ch{width:100%;border:0;background:transparent;border-radius:11px;padding:10px;text-align:left;cursor:pointer;margin-bottom:4px}.v65-ch.active{background:#17191f;color:#fff}.v65-ch small{display:block;font:800 7px Inter;color:#8c8792;margin-bottom:4px}.v65-ch.active small{color:#c9ff6a}.v65-ch b{font:850 10px/1.3 Inter}.v65-done{float:right;color:#c9ff6a}
    .v65-editor{padding:28px}.v65-editor h2{font:950 clamp(28px,4vw,46px)/.98 Inter;letter-spacing:-.045em;margin:5px 0 12px}.v65-syn{font:600 11px/1.6 Inter;color:#625d68}.v65-beats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:18px 0}.v65-beat{padding:13px;border-radius:13px;background:#f5f4f1;font:700 9px/1.4 Inter;color:#55505c}.v65-actions{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.v65-draft{border-top:1px solid #eee;padding-top:20px}.v65-sec{padding:15px 0;border-bottom:1px solid #eee}.v65-sec h4{font:900 16px/1.25 Georgia,serif;margin:0 0 9px}.v65-prose{font:400 15px/1.78 Georgia,serif;white-space:pre-wrap;outline:0}.v65-prose:focus{background:#fffdf6;border-radius:8px;padding:7px}.v65-empty{padding:24px;border:1px dashed #d9d5df;border-radius:15px;color:#77717e;font:650 10px/1.5 Inter}
    .v65-coach{padding:18px}.v65-coach h3{font:950 14px Inter;margin:0 0 10px}.v65-note{padding:13px;border-radius:14px;background:#eeecff;color:#4d4660;font:650 9px/1.5 Inter;margin-bottom:9px}.v65-note b{display:block;color:#332c4b;font:900 9px Inter;margin-bottom:5px}.v65-meta{font:800 7px Inter;color:#8b8591;text-transform:uppercase;letter-spacing:.08em}.v65-err{padding:12px;border-radius:12px;background:#fff0f0;color:#8b3030;font:750 9px/1.45 Inter}.v65-load{display:inline-flex;align-items:center;gap:8px;color:#6d5dfc}.v65-spin{width:13px;height:13px;border:2px solid #ddd8ff;border-top-color:#6d5dfc;border-radius:50%;animation:v65spin .7s linear infinite}@keyframes v65spin{to{transform:rotate(360deg)}}
    @media(max-width:1000px){.v65-work{grid-template-columns:210px 1fr}.v65-coach{grid-column:1/-1;max-height:none}}@media(max-width:720px){.v65-book{padding:22px 13px}.v65-h{display:block}.v65-pill{display:inline-block;margin-top:12px}.v65-row,.v65-work{grid-template-columns:1fr}.v65-nav{max-height:220px}.v65-editor{padding:18px}.v65-beats{grid-template-columns:1fr}}
  `; document.head.appendChild(css);

  function load(){try{state.book=JSON.parse(localStorage.getItem(STORE)||'null')}catch{state.book=null}}
  function save(){
    if(!state.book)return; state.book.updated=Date.now();
    try{
      localStorage.setItem(STORE,JSON.stringify(state.book));window.dispatchEvent(new CustomEvent('scholark:project-saved',{detail:{kind:'book',sourceId:state.book.id,title:state.book.name,prompt:state.book.concept||'',data:JSON.parse(JSON.stringify(state.book))}}));
      let h=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]');
      const x={bookId:state.book.id,project:state.book.name||state.book.plan?.title||'Untitled book',mode:'book',rawPrompt:state.book.concept,prompt:state.book.concept,at:state.book.updated};
      h=[x,...h.filter(v=>v.bookId!==state.book.id)].slice(0,40); localStorage.setItem('scholark_v45_history',JSON.stringify(h));
    }catch{}
  }
  async function call(mode,payload){
    const feature=mode==='book_chapter'?'book_chapter':'book_plan';
    await window.__SCHOLARK_CREDITS__?.authorize?.(feature);
    const ctrl=new AbortController(), timer=setTimeout(()=>ctrl.abort(),120000);
    try{
      const r=await fetch('/api/studio/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode,level:localStorage.getItem('scholark_learning_level')||'student',language:localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'auto',...payload}),signal:ctrl.signal});
      const d=await r.json().catch(()=>({})); if(!r.ok||!d?.ok||!d?.artifact)throw new Error(d?.error||'Book Studio AI is unavailable');
      await window.__SCHOLARK_CREDITS__?.consume?.(feature,{mode,tier:d.tier||'',provider:d.provider||'',model:d.model||''});
      return d;
    }finally{clearTimeout(timer)}
  }
  function shell(){
    document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open'); document.body.classList.add('v51-workspace');
    $('#v41-studio-workspace')?.setAttribute('hidden',''); $('#v25-book')?.classList.remove('open');
    $$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='book')); history.replaceState(null,'',location.pathname+location.search+'#book');
    const main=$('#v51-main'); if(!main)return null; main.classList.add('v52-fast-main'); main.style.setProperty('display','block','important');
    $$('.v51-page',main).forEach(p=>{p.classList.remove('active');p.style.display='none'});
    let p=$('[data-v51-page="fallback"]',main); if(!p){p=document.createElement('section');p.className='v51-page';p.dataset.v51Page='fallback';main.appendChild(p)} p.classList.add('active');p.style.display='block';p.style.padding='0';
    let h=$('#v51-fallback',p); if(!h){h=document.createElement('div');h.id='v51-fallback';p.appendChild(h)} return h;
  }
  function chapters(){return state.book?.plan?.sections||[]}
  function chapter(){return chapters()[state.index]||null}
  function values(){return {name:clean($('#v65-name')?.value),genre:clean($('#v65-genre')?.value),concept:clean($('#v65-concept')?.value),audience:clean($('#v65-audience')?.value),pov:$('#v65-pov')?.value||'third',targetWords:Math.max(5000,Math.min(150000,+($('#v65-words')?.value||80000))),chapterCount:Math.max(3,Math.min(30,+($('#v65-count')?.value||12))),language:$('#v65-language')?.value||state.book?.language||localStorage.getItem('scholark_ui_language')||'en'}}
  function planPrompt(v){const ln=window.__SCHOLARK_I18N__?.languageName?.(v.language)||v.language||'English';return 'Create a complete '+v.chapterCount+'-chapter book blueprint for: '+v.concept+'. Genre/type: '+(v.genre||'choose the best fit')+'. Audience: '+(v.audience||'infer it')+'. POV: '+v.pov+'. Target length: about '+v.targetWords+' words. Write the complete book plan in '+ln+'. Make every chapter specific, progressive and continuity-aware.'}

  function draftMarkup(d){return '<h3>Chapter manuscript</h3>'+(d.sections||[]).map((s,i)=>'<section class="v65-sec" data-v65-sec="'+i+'"><h4 contenteditable="true" data-v65-title>'+esc(s.title||'')+'</h4><div class="v65-prose" contenteditable="true" data-v65-body>'+esc(s.body||'')+'</div></section>').join('')}
  function syncDraft(){const d=state.book?.drafts?.[state.index];if(!d)return;$$('[data-v65-sec]').forEach((s,i)=>{if(!d.sections?.[i])return;d.sections[i].title=clean($('[data-v65-title]',s)?.innerText||d.sections[i].title);d.sections[i].body=String($('[data-v65-body]',s)?.innerText||d.sections[i].body).trim()});save()}
  function renderWorkspace(){
    const nav=$('#v65-nav'),ed=$('#v65-editor'),coach=$('#v65-coach'); if(!nav||!ed||!coach)return; const list=chapters(), ch=chapter();
    nav.innerHTML='<div class="v65-nav-title">CHAPTERS</div>'+list.map((s,i)=>'<button class="v65-ch '+(i===state.index?'active':'')+'" data-v65-ch="'+i+'"><small>CHAPTER '+(i+1)+(state.book.drafts?.[i]?' · WRITTEN':'')+'</small><b>'+esc(s.title||('Chapter '+(i+1)))+'</b>'+(state.book.drafts?.[i]?'<span class="v65-done">●</span>':'')+'</button>').join('');
    if(!ch){ed.innerHTML='<div class="v65-empty">Generate a book plan first.</div>';coach.innerHTML='<h3>Writing coach</h3><div class="v65-note">Continuity notes will appear here.</div>';return}
    const beats=(ch.bullets?.length?ch.bullets:(ch.points||[]).map(p=>p.heading||p.detail)).filter(Boolean), draft=state.book.drafts?.[state.index];
    ed.innerHTML='<div class="v65-k">CHAPTER '+(state.index+1)+'</div><h2>'+esc(ch.title)+'</h2><p class="v65-syn">'+esc(ch.body||ch.subtitle)+'</p>'+(beats.length?'<div class="v65-beats">'+beats.map(x=>'<div class="v65-beat">'+esc(x)+'</div>').join('')+'</div>':'')+'<div class="v65-actions"><button class="v65-btn primary" id="v65-draft">'+(draft?'Rewrite chapter':'Write chapter')+'</button><button class="v65-btn" id="v65-export-docx">Export DOCX</button><button class="v65-btn" id="v65-export-pdf">Export PDF</button></div><div id="v65-draft-host" class="v65-draft">'+(draft?draftMarkup(draft):'<div class="v65-empty">This chapter has not been written yet. Write it now or use Write remaining book to generate the manuscript.</div>')+'</div>';
    coach.innerHTML='<h3>Writing coach</h3><div class="v65-note"><b>Continuity & purpose</b>'+esc(ch.speakerNotes||'Keep this chapter consistent with the premise and surrounding chapters.')+'</div>'+(ch.visualBrief?'<div class="v65-note"><b>Mood / research direction</b>'+esc(ch.visualBrief)+'</div>':'')+'<div class="v65-meta">'+esc(state.book.provider||'AI')+' · '+esc(state.book.model||'')+'</div>';
    $$('[data-v65-ch]',nav).forEach(b=>b.onclick=()=>{syncDraft();state.index=+b.dataset.v65Ch;renderWorkspace()});
    $('#v65-draft').onclick=generateChapter; $('#v65-export-docx').onclick=()=>exportBook('docx'); $('#v65-export-pdf').onclick=()=>exportBook('pdf'); $$('.v65-prose,[data-v65-title]').forEach(x=>x.addEventListener('input',()=>{clearTimeout(window.__v65save);window.__v65save=setTimeout(syncDraft,180)}));
  }
  function render(){
    const h=shell(); if(!h)return; const b=state.book||{};
    h.innerHTML='<div class="v65-book"><div class="v65-h"><div><div class="v65-k">SCHOLARK · BOOK STUDIO</div><h1>Build the book, chapter by chapter.</h1><p>Plan the book, then let SCHOLARK write the full manuscript chapter by chapter with autosave, continuity context, editing and real DOCX/PDF export.</p></div><span class="v65-pill">BOOK STUDIO</span></div><div class="v65-form"><div class="v65-row"><input id="v65-name" placeholder="Working title (optional)" value="'+esc(b.name||'')+'"><select id="v65-genre"><option value="">Choose genre / type</option>'+GENRES.map(g=>'<option value="'+esc(g)+'">'+esc(g)+'</option>').join('')+'</select></div><textarea id="v65-concept" placeholder="Describe the book you want to create…">'+esc(b.concept||'')+'</textarea><div class="v65-row"><input id="v65-audience" placeholder="Audience (optional)" value="'+esc(b.audience||'')+'"><select id="v65-pov"><option value="third">Third person</option><option value="first">First person</option><option value="multi">Multiple POV</option><option value="na">Nonfiction / not applicable</option></select></div><div class="v65-row"><input id="v65-words" type="number" min="5000" max="150000" step="5000" value="'+(b.targetWords||80000)+'"><input id="v65-count" type="number" min="3" max="30" value="'+(b.chapterCount||12)+'"></div><div class="v81-field"><label>Book output language</label><select id="v65-language">'+((window.__SCHOLARK_OUTPUT_LANGS__||window.__SCHOLARK_I18N__?.langs||[[localStorage.getItem('scholark_ui_language')||'en',window.__SCHOLARK_I18N__?.nativeName?.(localStorage.getItem('scholark_ui_language')||'en')||'English']]).map(([v,n])=>'<option value="'+esc(v)+'">'+esc(n)+'</option>').join(''))+'</select></div><div class="v65-row"><button class="v65-btn primary" id="v65-plan">'+(b.plan?'Rebuild book plan with AI':'Create book plan with AI')+'</button><button class="v65-btn v65-full" id="v65-full" '+(b.plan?'':'disabled')+'><span>✦</span> Write remaining book</button></div><div class="v65-status" id="v65-status">'+(b.plan?'Plan saved. Select a chapter below.':'Start with your concept; SCHOLARK will build the chapter architecture.')+'</div></div><div class="v65-work"><aside class="v65-nav" id="v65-nav"></aside><main class="v65-editor" id="v65-editor"></main><aside class="v65-coach" id="v65-coach"></aside></div></div>';
    if(b.pov)$('#v65-pov').value=b.pov; const genreSel=$('#v65-genre');if(genreSel&&b.genre){const opt=[...genreSel.options].find(o=>String(o.value).toLowerCase()===String(b.genre).toLowerCase());if(opt)genreSel.value=opt.value} const langSel=$('#v65-language');if(langSel)langSel.value=b.language||localStorage.getItem('scholark_ui_language')||'en'; $('#v65-plan').onclick=generatePlan;const full=$('#v65-full');if(full)full.onclick=generateFullBook; renderWorkspace();
  }
  async function generatePlan(){
    if(state.busy)return; const v=values(),btn=$('#v65-plan'),status=$('#v65-status'); if(!v.concept){$('#v65-concept')?.focus();return} state.busy=true;btn.disabled=true;status.innerHTML='<span class="v65-load"><i class="v65-spin"></i>Architecting the book…</span>';
    try{const out=await call('book',{prompt:planPrompt(v),count:v.chapterCount,audience:v.audience,style:v.genre,language:window.__SCHOLARK_I18N__?.languageName?.(v.language)||v.language,settings:{targetWords:v.targetWords,pov:v.pov}});state.book={id:state.book?.id||uid(),...v,name:v.name||out.artifact.title||'Untitled book',plan:out.artifact,drafts:state.book?.drafts||{},provider:out.provider,model:out.model,created:state.book?.created||Date.now()};state.index=0;save();render()}catch(e){status.innerHTML='<div class="v65-err">'+esc(e?.message||'Generation failed')+'</div>';btn.disabled=false}finally{state.busy=false}
  }
  async function writeChapterAt(index,{refresh=true}={}){
    const list=chapters(),ch=list[index];if(!ch)throw new Error('Chapter not found');
    const map=list.map((s,i)=>(i+1)+'. '+s.title+': '+(s.body||s.subtitle||'')).join('\n');
    const prior=Object.keys(state.book?.drafts||{}).map(Number).filter(i=>i<index).sort((a,b)=>a-b).slice(-2).map(i=>{
      const d=state.book.drafts[i],tail=(d?.sections||[]).map(s=>s.body||'').join(' ').slice(-2400);
      return 'Previous chapter '+(i+1)+' ending/context: '+tail;
    }).join('\n');
    const targetPerChapter=Math.max(900,Math.round((Number(state.book.targetWords)||60000)/Math.max(1,list.length)));
    const prompt='Write Chapter '+(index+1)+', "'+ch.title+'", as finished publishable manuscript prose for the book "'+state.book.name+'". Concept: '+state.book.concept+'. Genre: '+state.book.genre+'. Audience: '+state.book.audience+'. POV: '+state.book.pov+'. Chapter plan: '+(ch.body||ch.subtitle||'')+'. Required beats: '+(ch.bullets||[]).join('; ')+'. Whole-book map for continuity:\n'+map+'\n'+prior+'\nTarget approximately '+targetPerChapter+' words for this chapter. Write the chapter itself, not an outline, draft note, explanation or placeholder. Use coherent scenes/sections, natural transitions, sensory/detail where appropriate, and preserve continuity.';
    const out=await call('book_chapter',{prompt,count:6,audience:state.book.audience,style:state.book.genre,language:window.__SCHOLARK_I18N__?.languageName?.(state.book.language||localStorage.getItem('scholark_ui_language')||'en')||state.book.language,settings:{targetWords:targetPerChapter,pov:state.book.pov,chapter:index+1,totalChapters:list.length}});
    state.book.drafts=state.book.drafts||{};state.book.drafts[index]=out.artifact;state.book.provider=out.provider;state.book.model=out.model;save();
    if(refresh){state.index=index;renderWorkspace()}
    return out;
  }
  async function generateChapter(){
    if(state.busy||!chapter())return;syncDraft();const host=$('#v65-draft-host'),btn=$('#v65-draft'),idx=state.index;state.busy=true;if(btn)btn.disabled=true;if(host)host.innerHTML='<span class="v65-load"><i class="v65-spin"></i>Writing finished manuscript prose…</span>';
    try{await writeChapterAt(idx,{refresh:true})}catch(e){if(host)host.innerHTML='<div class="v65-err">'+esc(e?.message||'Chapter generation failed')+'</div>';if(btn)btn.disabled=false}finally{state.busy=false}
  }
  async function generateFullBook(){
    if(state.busy||!state.book?.plan)return;syncDraft();const btn=$('#v65-full'),status=$('#v65-status'),list=chapters();state.busy=true;if(btn)btn.disabled=true;
    try{
      const pending=list.map((_,i)=>i).filter(i=>!state.book.drafts?.[i]);
      if(!pending.length){if(status)status.textContent='The full manuscript is already written. You can rewrite individual chapters or export the book.';return}
      for(let p=0;p<pending.length;p++){
        const idx=pending[p],pct=Math.round((p/pending.length)*100);
        if(status)status.innerHTML='<span class="v65-load"><i class="v65-spin"></i>Writing Chapter '+(idx+1)+' of '+list.length+'…</span><div class="v65-progress"><i style="width:'+pct+'%"></i></div><div>Completed chapters are saved automatically, so you can resume if generation is interrupted.</div>';
        await writeChapterAt(idx,{refresh:false});
      }
      state.index=pending[pending.length-1]||0;save();render();const s=$('#v65-status');if(s)s.innerHTML='<b>Full manuscript written.</b> Review chapters, rewrite anything you want, then export to DOCX or PDF.';
    }catch(e){
      if(status)status.innerHTML='<div class="v65-err">'+esc(e?.message||'Full-book generation stopped')+'</div><div>Completed chapters were saved. Press Write remaining book to resume.</div>';
    }finally{state.busy=false;const b=$('#v65-full');if(b)b.disabled=false}
  }
  async function exportBook(format='docx'){
    syncDraft();if(!state.book)return;
    const btn=format==='pdf'?$('#v65-export-pdf'):$('#v65-export-docx'),old=btn?.textContent;if(btn){btn.disabled=true;btn.textContent='Exporting…'}
    try{
      const r=await fetch('/api/export/document/'+format,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({kind:'book',book:state.book})});
      if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d?.error||('Export failed · HTTP '+r.status))}
      const blob=await r.blob(),cd=r.headers.get('content-disposition')||'',m=cd.match(/filename="?([^";]+)"?/i),fallback=(state.book.name||'scholark-book').replace(/[^a-z0-9-_]+/gi,'-').toLowerCase()+'.'+format,name=m?.[1]||fallback,u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1200);
    }catch(e){const host=$('#v65-draft-host');host?.insertAdjacentHTML('afterbegin','<div class="v65-err">'+esc(e?.message||'Export failed')+'</div>')}finally{if(btn){btn.disabled=false;btn.textContent=old}}
  }

  function open(){load();state.index=0;render()} function openSaved(book){state.book=book;state.index=0;save();render()}
  window.addEventListener('click',e=>{const b=e.target.closest?.('[data-v51-tool="book"]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open()},true);
  load(); if(String(location.hash).toLowerCase()==='#book')setTimeout(open,90);
  window.__SCHOLARK_V65_BOOK__={open,openSaved,get:()=>state.book};
})();