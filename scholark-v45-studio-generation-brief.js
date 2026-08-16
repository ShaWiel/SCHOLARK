(() => {
  if (window.__SCHOLARK_V45_STUDIO_GENERATION_BRIEF__) return;
  window.__SCHOLARK_V45_STUDIO_GENERATION_BRIEF__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const labelValue=id=>$('#'+id)?.value||'';
  const checked=id=>!!$('#'+id)?.checked;
  const currentMode=()=>$('.v41-mode.active')?.dataset.mode||'presentation';
  const state={outlinePrompt:'',outlineMode:'',referenceText:[],initialized:false};

  const style=document.createElement('style');
  style.id='scholark-v45-studio-style';
  style.textContent=`
    #v45-advanced{margin-top:15px;padding-top:15px;border-top:1px solid rgba(23,25,31,.09)}
    #v45-advanced h4{margin:0 0 10px;font:950 11px Inter,system-ui}.v45-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v45-field{margin-bottom:9px}.v45-field label{display:block;font:850 8.5px Inter;color:#6c6873;margin-bottom:5px}.v45-field select,.v45-field input{width:100%;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:10px;padding:8px 9px;font:700 10px Inter;outline:0}.v45-field input:focus,.v45-field select:focus{border-color:#6d5dfc;box-shadow:0 0 0 2px rgba(109,93,252,.10)}
    .v45-switches{display:grid;gap:6px;margin-top:8px}.v45-switch{display:flex;align-items:flex-start;gap:7px;font:700 9px/1.35 Inter;color:#514d57}.v45-switch input{margin-top:1px;accent-color:#6d5dfc}.v45-switch small{display:block;color:#8a8590;font:600 8px/1.35 Inter;margin-top:2px}
    #v45-readiness{margin:11px 0 2px;padding:10px 11px;border-radius:13px;background:#f2f0ff;border:1px solid rgba(109,93,252,.12);display:flex;align-items:center;justify-content:space-between;gap:12px}.v45-ready-copy b{display:block;font:900 9.5px Inter}.v45-ready-copy span{font:650 8.5px Inter;color:#777}.v45-ready-score{min-width:54px;text-align:center;border-radius:999px;background:#17191f;color:#c9ff6a;padding:6px 8px;font:900 8.5px Inter}
    #v41-outline-list{list-style:none;padding:0!important;margin:0!important;display:grid!important;gap:6px!important;max-height:330px;overflow:auto}.v45-outline-item{display:grid;grid-template-columns:22px 1fr auto;gap:6px;align-items:center;padding:6px!important;border:1px solid rgba(23,25,31,.08);border-radius:10px;background:#fafafa;color:#17191f!important}.v45-outline-num{width:22px;height:22px;display:grid;place-items:center;border-radius:7px;background:#eceaf3;font:900 7.5px Inter}.v45-outline-input{width:100%;min-width:0;border:0;background:transparent;font:700 8.5px/1.3 Inter;color:#403c45;outline:0}.v45-outline-actions{display:flex;gap:2px}.v45-outline-actions button{width:22px;height:22px;border:0;border-radius:7px;background:#ecebf0;color:#4f4b55;cursor:pointer;font:900 9px Inter}.v45-outline-actions button:hover{background:#17191f;color:#fff}.v45-outline-add{width:100%;margin-top:7px;border:1px dashed rgba(23,25,31,.15);background:#fff;border-radius:10px;padding:8px;font:850 8.5px Inter;cursor:pointer}.v45-outline-meta{font:650 8px/1.4 Inter;color:#8b8790;margin:6px 0 0}
    #v45-history{margin-top:14px;padding-top:13px;border-top:1px solid rgba(23,25,31,.09)}#v45-history h4{font:900 10px Inter;margin:0 0 7px}.v45-history-list{display:grid;gap:5px}.v45-history-item{border:0;background:#f5f4f1;border-radius:10px;padding:8px;text-align:left;cursor:pointer}.v45-history-item b{display:block;font:850 8.5px Inter;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v45-history-item span{font:650 7.5px Inter;color:#87828c}.v45-empty{font:650 8px Inter;color:#8a8590}
    .v45-reference-status{font:700 8px Inter;color:#6d5dfc}.v45-inline-note{margin-top:8px;padding:8px 10px;border-radius:10px;background:#17191f;color:#fff;font:650 8.5px/1.4 Inter}.v45-inline-note b{color:#c9ff6a}
    @media(max-width:760px){.v45-two{grid-template-columns:1fr}.v45-outline-item{grid-template-columns:22px 1fr}.v45-outline-actions{grid-column:2;justify-content:flex-end}}
  `;
  document.head.appendChild(style);

  function advancedMarkup(){return `
    <div id="v45-advanced">
      <h4>Advanced generation brief</h4>
      <div class="v45-two">
        <div class="v45-field"><label>Purpose</label><select id="v45-purpose"><option value="teach">Teach / explain</option><option value="persuade">Persuade</option><option value="inform">Inform</option><option value="sell">Sell / convert</option><option value="analyze">Analyze / compare</option><option value="inspire">Inspire</option><option value="entertain">Entertain</option><option value="custom">Custom / infer from prompt</option></select></div>
        <div class="v45-field"><label>Tone / voice</label><select id="v45-tone"><option>Professional</option><option>Academic</option><option>Clear and educational</option><option>Executive</option><option>Persuasive</option><option>Bold and energetic</option><option>Warm and human</option><option>Storytelling</option><option>Minimal and direct</option></select></div>
        <div class="v45-field"><label>Content depth</label><select id="v45-depth"><option value="standard">Standard</option><option value="deep" selected>Deep</option><option value="expert">Expert / highly detailed</option><option value="simple">Simple / beginner-friendly</option></select></div>
        <div class="v45-field"><label>Creative direction</label><select id="v45-creativity"><option value="controlled">Controlled</option><option value="balanced" selected>Balanced</option><option value="bold">Bold ideas</option><option value="surprise">Surprise me</option></select></div>
      </div>
      <div class="v45-field"><label>Brand / visual direction (optional)</label><input id="v45-brand" placeholder="e.g. dark premium, lime accents, clean editorial typography"></div>
      <div class="v45-switches">
        <label class="v45-switch"><input id="v45-strict" type="checkbox" checked><span><b>Strict prompt fidelity</b><small>Keep the exact topic, constraints and requested deliverables. Do not replace them with generic filler.</small></span></label>
        <label class="v45-switch"><input id="v45-research" type="checkbox" checked><span><b>Research when facts are needed</b><small>Use reliable sources where the connected creator supports research.</small></span></label>
        <label class="v45-switch"><input id="v45-factcheck" type="checkbox" checked><span><b>Fact-check before final output</b><small>Do not invent statistics, studies, quotes or URLs.</small></span></label>
        <label class="v45-switch"><input id="v45-visuals" type="checkbox" checked><span><b>AI visual intelligence</b><small>Choose charts, timelines, tables, diagrams or image-led layouts when they genuinely help.</small></span></label>
        <label class="v45-switch"><input id="v45-autopolish" type="checkbox" checked><span><b>Final polish pass</b><small>Check repetition, hierarchy, clarity, consistency and export readiness.</small></span></label>
      </div>
      <div class="v45-inline-note"><b>Generator-first:</b> the original request stays intact; SCHOLARK receives a structured production brief instead of a shallow one-line prompt.</div>
    </div>`;}

  function ensureAdvanced(root){
    const host=$('.v41-settings',root);if(!host||$('#v45-advanced',root))return;
    host.insertAdjacentHTML('beforeend',advancedMarkup());
    ['v45-purpose','v45-tone','v45-depth','v45-creativity','v45-brand','v45-strict','v45-research','v45-factcheck','v45-visuals','v45-autopolish'].forEach(id=>$('#'+id,root)?.addEventListener('input',()=>updateReadiness(root)));
  }

  function ensureReadiness(root){
    if($('#v45-readiness',root))return;
    const prompt=$('#v41-prompt',root);if(!prompt)return;
    prompt.insertAdjacentHTML('afterend','<div id="v45-readiness"><div class="v45-ready-copy"><b>Brief readiness</b><span id="v45-ready-detail">Add enough context for a stronger first draft.</span></div><span class="v45-ready-score" id="v45-ready-score">0 / 6</span></div>');
    prompt.addEventListener('input',()=>updateReadiness(root));
  }

  function updateReadiness(root){
    const prompt=$('#v41-prompt',root)?.value.trim()||'';
    const mode=currentMode();
    const checksList=[prompt.length>=20,!!labelValue('v45-purpose'),!!labelValue('v45-tone'),!!labelValue('v45-depth'),checked('v45-strict'),!!(labelValue('v41-count')||mode==='book')];
    const score=checksList.filter(Boolean).length;
    const scoreEl=$('#v45-ready-score',root),detail=$('#v45-ready-detail',root);
    if(scoreEl)scoreEl.textContent=`${score} / 6`;
    if(detail)detail.textContent=score===6?'Production brief is ready for generation.':score>=4?'Good brief. Add a little more detail for maximum fidelity.':'Add topic, purpose and output details before generating.';
  }

  function topicFromPrompt(raw){
    const clean=String(raw||'').replace(/\s+/g,' ').trim();
    if(!clean)return 'the requested topic';
    const first=clean.split(/[.!?\n]/)[0].replace(/^(create|make|build|write|design|maak|schrijf|bouw|ontwerp)\s+/i,'').trim();
    return first.length>72?first.slice(0,69)+'…':first;
  }

  function desiredOutlineCount(mode){
    const n=parseInt(labelValue('v41-count'),10)||0;
    if(mode==='presentation')return clamp(n||10,3,100);
    if(mode==='webpage')return clamp(n||8,3,20);
    if(mode==='social')return clamp(n||6,1,20);
    if(mode==='document'){
      const pages=clamp(n||10,1,100);return pages<=3?4:pages<=10?7:pages<=30?9:pages<=60?11:14;
    }
    if(mode==='book'){
      const words=parseInt(labelValue('v41-book-words'),10)||80000;return clamp(Math.round(words/4000),8,60);
    }
    return 6;
  }

  function smartOutline(mode,raw){
    const topic=topicFromPrompt(raw),count=desiredOutlineCount(mode),items=[];
    if(mode==='presentation'){
      const open=[`${topic} — title / opening`,`Why ${topic} matters`,`Context and framing`,`Key question / thesis`];
      const close=['Key takeaways','Conclusion / recommendation','Sources / Q&A'];
      const patterns=['Evidence & data','Core dimension','Case / example','Comparison','Counterargument','Visual analysis','Implications','What this means','Decision point','Recommendation'];
      for(const x of open){if(items.length<count-close.length)items.push(x);}
      let i=0;while(items.length<Math.max(1,count-close.length)){items.push(`${patterns[i%patterns.length]} ${Math.floor(i/patterns.length)+1}: ${topic}`);i++;}
      for(const x of close){if(items.length<count)items.push(x);}
      return items.slice(0,count);
    }
    if(mode==='webpage'){
      const base=[`Hero — ${topic}`,'Problem / context','Primary value proposition','Key benefits','Feature / content section','Proof / trust / evidence','How it works','Use case / example','FAQ','Primary CTA','Secondary CTA / next step','Footer / references'];
      while(items.length<count)items.push(base[items.length]||`Supporting section ${items.length+1} — ${topic}`);return items;
    }
    if(mode==='document'){
      const base=[`${topic} — title and scope`,'Executive summary / abstract','Introduction and central question','Background / literature / context','Method / approach','Main analysis I','Main analysis II','Evidence / findings','Discussion / counterarguments','Recommendations / implications','Conclusion','References / appendices'];
      return base.slice(0,count);
    }
    if(mode==='social'){
      for(let i=0;i<count;i++){const parts=['Hook / pattern interrupt','Core insight','Proof / example','Useful takeaway','Engagement moment','CTA'];items.push(`Piece ${i+1} — ${parts[i%parts.length]}: ${topic}`);}return items;
    }
    if(mode==='graphic')return [`Primary message — ${topic}`,'Visual hierarchy','Key information blocks','Supporting data / proof','Visual system / imagery','CTA / footer / source line'];
    if(mode==='book'){
      for(let i=0;i<count;i++){const phase=i<count*.2?'Setup':i<count*.5?'Development':i<count*.75?'Escalation':i<count-1?'Resolution':'Finale';items.push(`Chapter ${i+1} — ${phase}: ${topic}`);}return items;
    }
    return [`Opening — ${topic}`,'Context','Main content','Evidence / detail','Synthesis','Conclusion'];
  }

  function renderEditableOutline(root,items){
    const list=$('#v41-outline-list',root);if(!list)return;
    list.innerHTML=items.map((x,i)=>`<li class="v45-outline-item"><span class="v45-outline-num">${i+1}</span><input class="v45-outline-input" value="${esc(x)}" aria-label="Outline item ${i+1}"><span class="v45-outline-actions"><button type="button" data-move="up" title="Move up">↑</button><button type="button" data-move="down" title="Move down">↓</button><button type="button" data-remove="1" title="Remove">×</button></span></li>`).join('');
    const preview=$('.v41-outline-preview',root);
    let add=$('.v45-outline-add',preview);if(!add){add=document.createElement('button');add.type='button';add.className='v45-outline-add';add.textContent='+ Add outline item';preview.appendChild(add);add.onclick=()=>{const rows=$$('.v45-outline-item',list);const li=document.createElement('li');li.className='v45-outline-item';li.innerHTML=`<span class="v45-outline-num">${rows.length+1}</span><input class="v45-outline-input" value="New section" aria-label="New outline item"><span class="v45-outline-actions"><button type="button" data-move="up">↑</button><button type="button" data-move="down">↓</button><button type="button" data-remove="1">×</button></span>`;list.appendChild(li);renumberOutline(list);li.querySelector('input').focus();};}
    let meta=$('.v45-outline-meta',preview);if(!meta){meta=document.createElement('div');meta.className='v45-outline-meta';preview.appendChild(meta);}meta.textContent=`${items.length} editable outline items. Reorder, rename, remove or add before generation.`;
  }

  function renumberOutline(list){$$('.v45-outline-item',list).forEach((row,i)=>{$('.v45-outline-num',row).textContent=i+1;});const meta=$('.v45-outline-meta',list.closest('.v41-outline-preview'));if(meta)meta.textContent=`${$$('.v45-outline-item',list).length} editable outline items.`;}

  function bindOutlineEditing(root){
    const list=$('#v41-outline-list',root);if(!list||list.dataset.v45bound)return;list.dataset.v45bound='1';
    list.addEventListener('click',e=>{
      const btn=e.target.closest('button');if(!btn)return;const row=btn.closest('.v45-outline-item');if(!row)return;
      if(btn.dataset.remove){row.remove();renumberOutline(list);return;}
      if(btn.dataset.move==='up'&&row.previousElementSibling)list.insertBefore(row,row.previousElementSibling);
      if(btn.dataset.move==='down'&&row.nextElementSibling)list.insertBefore(row.nextElementSibling,row);
      renumberOutline(list);
    });
  }

  function buildOutline(root){
    const prompt=$('#v41-prompt',root),raw=prompt?.value.trim()||'';
    if(!raw){prompt?.focus();const s=$('#v41-status',root);if(s)s.textContent='Describe what you want to create first.';return;}
    const mode=currentMode(),items=smartOutline(mode,raw);state.outlinePrompt=raw;state.outlineMode=mode;renderEditableOutline(root,items);bindOutlineEditing(root);const s=$('#v41-status',root);if(s)s.textContent='Editable outline ready. Adjust it or generate the complete first draft.';
  }

  function outlineValues(root){return $$('.v45-outline-input',$('#v41-outline-list',root)).map(x=>x.value.trim()).filter(Boolean);}

  function readAdvanced(root){return {
    purpose:labelValue('v45-purpose'),tone:labelValue('v45-tone'),depth:labelValue('v45-depth'),creativity:labelValue('v45-creativity'),brand:labelValue('v45-brand').trim(),strict:checked('v45-strict'),research:checked('v45-research'),factcheck:checked('v45-factcheck'),visuals:checked('v45-visuals'),autopolish:checked('v45-autopolish')
  };}

  function collectIntent(root){
    const mode=currentMode(),rawPrompt=$('#v41-prompt',root)?.value.trim()||'';
    return {
      mode,rawPrompt,project:$('#v41-project-name',root)?.value.trim()||'Untitled project',language:labelValue('v41-language'),quality:labelValue('v41-quality'),style:labelValue('v41-style'),count:labelValue('v41-count'),ratio:labelValue('v41-ratio'),audience:labelValue('v41-audience'),citations:checked('v41-citations'),speakerNotes:checked('v41-notes'),webType:labelValue('v41-webtype'),seo:checked('v41-seo'),cta:checked('v41-cta'),documentType:labelValue('v41-doctype'),citationStyle:labelValue('v41-cite'),sources:checked('v41-sources'),platform:labelValue('v41-platform'),socialFormat:labelValue('v41-socialformat'),graphicType:labelValue('v41-graphictype'),genre:labelValue('v41-custom-genre').trim()||labelValue('v41-genre'),targetWords:labelValue('v41-book-words'),pov:labelValue('v41-pov'),chapterStrategy:labelValue('v41-chapters'),storyBible:checked('v41-storybible'),writingCoach:checked('v41-coach'),outline:outlineValues(root),advanced:readAdvanced(root),references:[...($('#v41-files',root)?.files||[])].map(f=>({name:f.name,size:f.size,type:f.type})),referenceText:state.referenceText,createdAt:Date.now()
    };
  }

  function modeRequirements(i){
    if(i.mode==='presentation')return [`Slides: ${i.count||'auto'}`,`Aspect ratio: ${i.ratio||'16:9'}`,`Audience: ${i.audience||'infer from prompt'}`,`Speaker notes: ${i.speakerNotes?'yes':'no'}`,`Citations: ${i.citations?'yes':'only if required'}`,'Use varied slide patterns: hero, comparison, data, timeline, process, quote, case study, argument/counterargument, summary when appropriate.','Do not repeat the same card layout on every slide.'];
    if(i.mode==='webpage')return [`Page type: ${i.webType||'custom'}`,`Sections: ${i.count||'auto'}`,`Layout: ${i.ratio||'responsive'}`,`SEO structure: ${i.seo?'yes':'no'}`,`CTA strategy: ${i.cta?'yes':'no'}`,'Return a complete responsive information architecture with real section copy and coherent user journey.'];
    if(i.mode==='document')return [`Document type: ${i.documentType||'report'}`,`Target length: ${i.count||'auto'} pages`,`Citation style: ${i.citationStyle||'APA'}`,`Research sources: ${i.sources?'yes':'only if required'}`,'Maintain argument and terminology consistency across all sections.','Include tables, frameworks or appendices only when they improve the document.'];
    if(i.mode==='social')return [`Platform: ${i.platform||'multi-platform'}`,`Format: ${i.socialFormat||'campaign'}`,`Deliverables: ${i.count||'auto'}`,'Generate hooks, complete copy, visual direction, captions and CTA as one campaign system.','Adapt length and behavior to the selected platform instead of recycling identical text.'];
    if(i.mode==='graphic')return [`Graphic type: ${i.graphicType||'poster'}`,`Canvas: ${i.ratio||'1:1'}`,`Variants: ${i.count||1}`,'Prioritize hierarchy, readability, contrast and intentional composition.','Do not treat a finished graphic as plain text placed in a box.'];
    return [`Genre / type: ${i.genre||'infer from prompt'}`,`Target words: ${i.targetWords||80000}`,`POV: ${i.pov||'auto'}`,`Chapter strategy: ${i.chapterStrategy||'auto'}`,`Story / knowledge bible: ${i.storyBible?'yes':'no'}`,`Writing coach: ${i.writingCoach?'yes':'no'}`,'Maintain continuity for characters, facts, world rules, terminology, timeline and unresolved threads.'];
  }

  function compileBrief(i){
    const a=i.advanced,lang=i.language||'nl',refs=i.references.length?i.references.map(r=>`${r.name} (${r.type||'file'}, ${Math.round(r.size/1024)} KB)`).join('; '):'none';
    const refText=i.referenceText.length?`\nREFERENCE EXCERPTS PROVIDED BY USER:\n${i.referenceText.map(r=>`--- ${r.name} ---\n${r.text}`).join('\n\n')}`:'';
    return `SCHOLARK STUDIO PRODUCTION BRIEF\n\nORIGINAL USER REQUEST — PRESERVE THIS EXACT INTENT:\n${i.rawPrompt}\n\nPROJECT:\n- Name: ${i.project}\n- Creation mode: ${i.mode}\n- Output language: ${lang}\n- Purpose: ${a.purpose||'infer from request'}\n- Audience: ${i.audience||'infer from request'}\n- Tone / voice: ${a.tone||'Professional'}\n- Content depth: ${a.depth||'deep'}\n- Visual style: ${i.style||'modern'}\n- Creative direction: ${a.creativity||'balanced'}\n- Brand / visual direction: ${a.brand||'none supplied'}\n- AI quality target: ${i.quality||'deep'}\n\nFORMAT REQUIREMENTS:\n${modeRequirements(i).map(x=>'- '+x).join('\n')}\n\nAPPROVED / EDITABLE OUTLINE:\n${(i.outline.length?i.outline:['Create the strongest logical outline for the exact request']).map((x,n)=>`${n+1}. ${x}`).join('\n')}\n\nRESEARCH & FIDELITY RULES:\n- Strict prompt fidelity: ${a.strict?'ON — never replace the user topic, people, data request or requested deliverables with generic filler.':'OFF — reasonable creative interpretation is allowed.'}\n- Research when factual claims need support: ${a.research?'ON':'OFF unless essential'}\n- Fact-check: ${a.factcheck?'ON — do not fabricate statistics, studies, quotations, citations or URLs. If unverified, omit or flag for review.':'Standard accuracy checks'}\n- Visual intelligence: ${a.visuals?'ON — choose charts, tables, timelines, diagrams, comparisons, images and layout patterns only when they add meaning.':'Minimal visuals'}\n- Final polish: ${a.autopolish?'ON — remove repetition, generic AI filler, weak headings, inconsistent hierarchy and unfinished placeholders before showing the result.':'Standard pass'}\n- Reference files: ${refs}\n\nQUALITY BAR:\n- Create a complete first version, not an empty template and not a list of instructions for the user.\n- Preserve the original topic and all explicit constraints.\n- Use specific, useful content rather than vague filler.\n- Keep a coherent narrative / information flow from beginning to end.\n- Use meaningful headings and intentional design variation.\n- Do not claim a source was checked unless it was actually available to the creator engine.\n- Before final output, review prompt adherence, accuracy, repetition, clarity, hierarchy and layout readiness.${refText}`;
  }

  async function readReferences(root){
    const files=[...($('#v41-files',root)?.files||[])];state.referenceText=[];
    const readable=/\.(txt|md|markdown|csv|json|html|htm|xml)$/i;
    for(const f of files){if(f.size<=600000&&(f.type.startsWith('text/')||readable.test(f.name))){try{const t=(await f.text()).slice(0,14000);state.referenceText.push({name:f.name,text:t});}catch{}}}
    let badge=$('#v45-reference-status',root);if(!badge){badge=document.createElement('span');badge.id='v45-reference-status';badge.className='v45-reference-status';$('#v41-file-names',root)?.insertAdjacentElement('afterend',badge);}if(badge)badge.textContent=state.referenceText.length?` · ${state.referenceText.length} text reference${state.referenceText.length===1?'':'s'} readable in brief`:files.length?' · binary files passed by name to connected creator':' ';updateReadiness(root);
  }

  function setPipeline(root,index,stateName){
    const steps=$$('.v41-step',root);steps.forEach((s,i)=>{s.classList.toggle('active',i===index&&stateName==='active');if(i<index||stateName==='done'&&i===index)s.classList.add('done');const st=$('span',s);if(st){if(i<index)st.textContent='prepared';else if(i===index)st.textContent=stateName==='done'?'prepared':'preparing';else st.textContent='queued';}});
  }

  function saveHistory(intent){
    let items=[];try{items=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]')}catch{}
    items.unshift({project:intent.project,mode:intent.mode,prompt:intent.rawPrompt,advanced:intent.advanced,count:intent.count,ratio:intent.ratio,at:Date.now()});items=items.slice(0,8);localStorage.setItem('scholark_v45_history',JSON.stringify(items));renderHistory();
  }

  function renderHistory(){
    const root=$('#v41-studio-workspace');if(!root)return;const pipe=$('.v41-pipeline',root);if(!pipe)return;let box=$('#v45-history',root);if(!box){box=document.createElement('div');box.id='v45-history';box.innerHTML='<h4>Recent Studio briefs</h4><div class="v45-history-list"></div>';pipe.appendChild(box);}let items=[];try{items=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]')}catch{}const list=$('.v45-history-list',box);list.innerHTML=items.length?items.map((x,i)=>`<button type="button" class="v45-history-item" data-history="${i}"><b>${esc(x.project||x.prompt||'Studio project')}</b><span>${esc(x.mode)} · ${new Date(x.at).toLocaleDateString()}</span></button>`).join(''):'<div class="v45-empty">Generated projects will appear here.</div>';$$('[data-history]',list).forEach(b=>b.onclick=()=>restoreHistory(items[+b.dataset.history]));
  }

  function restoreHistory(item){
    const root=$('#v41-studio-workspace');if(!root||!item)return;const modeBtn=$(`.v41-mode[data-mode="${item.mode}"]`,root);modeBtn?.click();setTimeout(()=>{const p=$('#v41-prompt',root);if(p)p.value=item.prompt||'';const name=$('#v41-project-name',root);if(name)name.value=item.project||'Untitled project';const set=(id,v)=>{const el=$('#'+id,root);if(el&&v!=null)el.value=v;};set('v41-count',item.count);set('v41-ratio',item.ratio);if(item.advanced){set('v45-purpose',item.advanced.purpose);set('v45-tone',item.advanced.tone);set('v45-depth',item.advanced.depth);set('v45-creativity',item.advanced.creativity);set('v45-brand',item.advanced.brand);['strict','research','factcheck','visuals','autopolish'].forEach(k=>{const el=$('#v45-'+k,root);if(el)el.checked=item.advanced[k]!==false;});}updateReadiness(root);buildOutline(root);},40);
  }

  function delegate(root,intent,compiled){
    localStorage.setItem('scholark_v45_last_project',JSON.stringify({...intent,compiledPrompt:compiled}));
    localStorage.setItem('scholark_v41_intent',JSON.stringify({...intent,prompt:compiled,compiledPrompt:compiled}));
    localStorage.setItem('scholark_v24_intent',JSON.stringify({mode:intent.mode,prompt:compiled,language:intent.language||'nl',style:intent.style,count:intent.count||intent.targetWords,ratio:intent.ratio,at:Date.now()}));
    if(intent.mode==='book'){
      localStorage.setItem('scholark_book_studio_settings',JSON.stringify({genre:intent.genre,targetWords:Number(intent.targetWords)||80000,pov:intent.pov,chapterStrategy:intent.chapterStrategy,storyBible:intent.storyBible,writingCoach:intent.writingCoach,productionBrief:compiled,updatedAt:Date.now()}));
      const trigger=document.querySelector('[data-tool="book"]');trigger?.click();setTimeout(()=>{const input=$('#v25-book .v25-input');if(input){input.value=compiled;input.dispatchEvent(new Event('input',{bubbles:true}));}},180);return;
    }
    const ov=$('#sv24-overlay');if(!ov){const s=$('#v41-status',root);if(s)s.textContent='Production brief saved, but the connected creator engine is unavailable on this screen.';return;}
    root.hidden=true;document.body.classList.remove('v41-studio-open');document.body.classList.add('v41-generating');ov.classList.add('open');
    const mode=$(`.sv24-mode[data-mode="${intent.mode}"]`,ov);mode?.click();
    const p=$('#sv24-prompt',ov);if(p){p.value=compiled;p.dispatchEvent(new Event('input',{bubbles:true}));}
    const cnt=$('#sv24-count',ov);if(cnt&&intent.count){const opt=[...cnt.options].find(o=>o.value===String(intent.count)||o.textContent.trim().startsWith(String(intent.count)));if(opt)cnt.value=opt.value;}
    const st=$('#sv24-style',ov);if(st&&intent.style){const opt=[...st.options].find(o=>o.value.toLowerCase().includes(intent.style.toLowerCase())||o.textContent.toLowerCase().includes(intent.style.toLowerCase()));if(opt)st.value=opt.value;}
    const gen=$('.sv24-generate',ov);if(gen)gen.click();
    setTimeout(()=>{document.body.classList.remove('v41-generating');if(ov.classList.contains('open'))ov.classList.remove('open');},900);
  }

  function generate(root){
    const p=$('#v41-prompt',root),status=$('#v41-status',root),raw=p?.value.trim()||'';if(!raw){p?.focus();if(status)status.textContent='Describe what you want to create first.';return;}
    if(state.outlinePrompt!==raw||state.outlineMode!==currentMode()||!$$('.v45-outline-input',root).length)buildOutline(root);
    const intent=collectIntent(root),compiled=compileBrief(intent);saveHistory(intent);if(status)status.textContent='Preparing your production brief for the creator engine…';
    let idx=0;const steps=$$('.v41-step',root);const timer=setInterval(()=>{setPipeline(root,idx,'active');idx++;if(idx>=steps.length){clearInterval(timer);steps.forEach(s=>{s.classList.remove('active');s.classList.add('done');const sp=$('span',s);if(sp)sp.textContent='prepared';});if(status)status.textContent='Brief prepared. Opening the connected creator engine…';setTimeout(()=>delegate(root,intent,compiled),100);}},180);
  }

  function bind(root){
    ensureAdvanced(root);ensureReadiness(root);bindOutlineEditing(root);renderHistory();updateReadiness(root);
    const outline=$('.v41-outline',root),generateBtn=$('.v41-generate',root);if(outline)outline.onclick=()=>buildOutline(root);if(generateBtn)generateBtn.onclick=()=>generate(root);
    const files=$('#v41-files',root);if(files&&!files.dataset.v45bound){files.dataset.v45bound='1';files.addEventListener('change',()=>readReferences(root));}
    const settings=$('#v41-settings-body',root);if(settings&&!settings.dataset.v45watch){settings.dataset.v45watch='1';new MutationObserver(()=>{ensureAdvanced(root);ensureReadiness(root);updateReadiness(root);state.outlinePrompt='';}).observe(settings,{childList:true,subtree:true});}
    const modes=$('.v41-modes',root);if(modes&&!modes.dataset.v45bound){modes.dataset.v45bound='1';modes.addEventListener('click',()=>{setTimeout(()=>{ensureAdvanced(root);ensureReadiness(root);const o=$('.v41-outline',root),g=$('.v41-generate',root);if(o)o.onclick=()=>buildOutline(root);if(g)g.onclick=()=>generate(root);updateReadiness(root);state.outlinePrompt='';},30);});}
  }

  const timer=setInterval(()=>{const root=$('#v41-studio-workspace');if(!root)return;clearInterval(timer);state.initialized=true;bind(root);new MutationObserver(()=>{ensureAdvanced(root);ensureReadiness(root);const o=$('.v41-outline',root),g=$('.v41-generate',root);if(o)o.onclick=()=>buildOutline(root);if(g)g.onclick=()=>generate(root);}).observe(root,{childList:true,subtree:true});},80);
})();