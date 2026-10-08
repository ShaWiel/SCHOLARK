(() => {
  if(window.__SCHOLARK_V120_EXPERIENCE_CONTROLS__)return;
  window.__SCHOLARK_V120_EXPERIENCE_CONTROLS__=true;

  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now=()=>new Date().toISOString();
  const uid=p=>(p||'id')+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
  const providerMark=/(^|\b)(gemini|pollinations|openai(?:-fast)?|gpt-5(?:\.[0-9]+)?(?:-[a-z]+)?|public-product-facts|scholark-test-engine)(\b|$)/i;
  const TUTOR_NAME_KEY='scholark_tutor_name_v1';
  let lastTutorName='AI Tutor';
  function tutorName(){const v=clean(localStorage.getItem(TUTOR_NAME_KEY)||'');return v.slice(0,24)||'AI Tutor'}
  function applyTutorName(root=document){
    const name=tutorName(),previous=lastTutorName;lastTutorName=name;
    for(const sel of ['#v51-sidebar','.v52-head','.v111-live','.v114-connect','#v120-tutorbar','#v52-tutor-send'])for(const host of $(sel,root)){
      const w=document.createTreeWalker(host,NodeFilter.SHOW_TEXT),nodes=[];while(w.nextNode())nodes.push(w.currentNode);
      for(const n of nodes){let t=n.nodeValue||'';t=t.replace(/Tutor learning loop/g,name+' learning loop').replace(/SCHOLARK Tutor/g,name).replace(/AI Tutor/g,name);if(previous&&previous!=='AI Tutor'&&previous!==name)t=t.replaceAll(previous,name);n.nodeValue=t}
    }
    const q=$('#v52-tutor-q',root)||$('#v52-tutor-q');if(q)q.placeholder='Ask '+name+' anything — or ask what you should do next for an assignment...';
    const send=$('#v52-tutor-send',root)||$('#v52-tutor-send');if(send)send.innerHTML='Ask <span>'+esc(name)+'</span>';
    const b=$('#v120-tutor-name',root)||$('#v120-tutor-name');if(b)b.textContent='Name: '+name
  }
  function chooseTutorName(){
    const raw=prompt('Choose a name for your AI Tutor (2–24 characters).',tutorName());if(raw==null)return;const next=clean(raw).replace(/[<>]/g,'').slice(0,24);
    if(next.length<2){toast('Use at least 2 characters');return}try{localStorage.setItem(TUTOR_NAME_KEY,next)}catch{}applyTutorName(document);window.dispatchEvent(new CustomEvent('scholark:tutor-name-changed',{detail:{name:next}}));toast('Tutor name updated')
  }
  window.__SCHOLARK_TUTOR_PROFILE__={name:tutorName,set:name=>{const next=clean(name).replace(/[<>]/g,'').slice(0,24);if(next.length<2)return false;localStorage.setItem(TUTOR_NAME_KEY,next);applyTutorName(document);return true},apply:applyTutorName};

  const style=document.createElement('style');style.id='scholark-v120-style';style.textContent=`
    .v120-actions{display:flex;align-items:center;gap:4px;margin-top:8px;flex-wrap:wrap}.v120-action{width:30px;height:30px;border:0;background:transparent;border-radius:9px;color:#5d5864;display:grid;place-items:center;font:850 13px Inter;cursor:pointer}.v120-action:hover,.v120-action.active{background:#eceaf2;color:#292631}.v120-menu-wrap{position:relative}.v120-menu{position:absolute;left:0;top:34px;z-index:30;width:205px;background:#fff;border:1px solid rgba(23,25,31,.1);border-radius:14px;box-shadow:0 18px 55px rgba(25,20,55,.18);padding:6px;display:none}.v120-menu.open{display:block}.v120-menu button{width:100%;border:0;background:transparent;border-radius:9px;padding:9px 10px;text-align:left;font:800 8px Inter;color:#322e38;cursor:pointer}.v120-menu button:hover{background:#f2f0f6}
    .v120-tutorbar{display:grid;grid-template-columns:minmax(280px,1.35fr) auto auto auto minmax(210px,1fr);gap:7px;align-items:center;margin-bottom:10px}.v120-tutorbar select,.v120-tutorbar button{height:38px;border:1px solid rgba(23,25,31,.1);border-radius:11px;background:#f8f7f5;padding:0 11px;font:850 8.5px Inter}.v120-tutorbar select{min-width:0;font-size:10px;font-weight:900;color:#292631;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.v120-tutor-progress{font:750 7.5px/1.35 Inter;color:#746e7a;text-align:right;min-width:0}.v120-tutor-msg{margin-top:7px}.v120-tutor-answer{white-space:pre-wrap}.v120-user-actions{display:flex;justify-content:flex-end;margin-top:5px}.v120-edit-user{border:0;background:transparent;color:inherit;opacity:.68;padding:2px 4px;font:850 7px Inter;cursor:pointer}.v120-editbox{display:grid;gap:7px;min-width:min(520px,70vw)}.v120-editbox textarea{width:100%;min-height:90px;box-sizing:border-box;border:1px solid rgba(23,25,31,.14);border-radius:11px;padding:10px;font:650 10px/1.5 Inter;resize:vertical}.v120-edit-actions{display:flex;gap:6px;justify-content:flex-end}.v120-edit-actions button{border:0;border-radius:9px;padding:7px 10px;font:850 7px Inter;cursor:pointer}.v120-edit-actions .save{background:#17191f;color:#c9ff6a}.v120-provider-hidden{display:none!important}
    .v120-toast{position:fixed;right:18px;bottom:18px;z-index:2147483646;background:#17191f;color:#fff;border-radius:12px;padding:10px 13px;font:800 8px Inter;box-shadow:0 16px 45px rgba(0,0,0,.24)}
    @media(max-width:900px){.v120-tutorbar{grid-template-columns:minmax(220px,1fr) auto auto}.v120-tutor-progress{grid-column:1/-1;text-align:left}}@media(max-width:620px){.v120-tutorbar{grid-template-columns:1fr 1fr}.v120-tutorbar select{grid-column:1/-1}.v120-tutor-progress{grid-column:1/-1}}
  `;document.head.appendChild(style);

  function toast(msg){let x=$('#v120-toast');if(!x){x=document.createElement('div');x.id='v120-toast';x.className='v120-toast';document.body.appendChild(x)}x.textContent=msg;clearTimeout(window.__v120toast);window.__v120toast=setTimeout(()=>x.remove(),1800)}
  async function copyText(text){try{await navigator.clipboard.writeText(String(text||''));toast('Copied')}catch{toast('Could not copy')}}
  function speak(text){if(!('speechSynthesis'in window)||!text)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text));u.lang=document.documentElement.lang||'en';speechSynthesis.speak(u)}catch{}}
  async function shareText(text,title='SCHOLARK'){const t=String(text||'');try{if(navigator.share){await navigator.share({title,text:t})}else await copyText(t)}catch{}}

  const FEEDBACK='scholark_v120_answer_feedback';
  function feedback(){try{return JSON.parse(localStorage.getItem(FEEDBACK)||'{}')||{}}catch{return{}}}
  function setFeedback(key,value){const x=feedback();if(value)x[key]=value;else delete x[key];try{localStorage.setItem(FEEDBACK,JSON.stringify(x))}catch{}}

  function actionMarkup(scope,key){
    const f=feedback()[key]||'';
    return '<div class="v120-actions" data-v120-scope="'+esc(scope)+'" data-v120-key="'+esc(key)+'">'+
      '<button class="v120-action" data-v120-do="copy" title="Copy" aria-label="Copy">⧉</button>'+
      '<button class="v120-action '+(f==='up'?'active':'')+'" data-v120-do="up" title="Helpful" aria-label="Helpful">👍</button>'+
      '<button class="v120-action '+(f==='down'?'active':'')+'" data-v120-do="down" title="Not helpful" aria-label="Not helpful">👎</button>'+
      '<button class="v120-action" data-v120-do="speak" title="Read aloud" aria-label="Read aloud">🔊</button>'+
      '<button class="v120-action" data-v120-do="share" title="Share" aria-label="Share">↗</button>'+
      '<span class="v120-menu-wrap"><button class="v120-action" data-v120-do="more" title="More" aria-label="More">⋮</button><span class="v120-menu"><button data-v120-menu="branch">Branch in new chat</button><button data-v120-menu="retry">Retry</button><button data-v120-menu="search">Search the web</button></span></span>'+
      '</div>';
  }

  function assistantTextFrom(host){return clean(host?.querySelector?.('.v120-tutor-answer')?.textContent||host?.querySelector?.(':scope > div')?.textContent||host?.textContent||'')}
  function latestUserTextBefore(host){let n=host?.previousElementSibling;while(n){if(n.classList?.contains('user'))return clean(n.textContent);n=n.previousElementSibling}return''}

  function decorateArki(){
    const api=window.__SCHOLARK_V107_GENERAL_AI__,box=$('#v107-thread');if(!api||!box)return;
    const chat=api.getCurrent?.(),assistants=(chat?.messages||[]).map((m,i)=>({m,i})).filter(x=>x.m.role==='assistant');
    const nodes=$$('.v107-msg.assistant',box).filter(x=>x.id!=='v107-thinking');
    nodes.forEach((node,ai)=>{
      if(node.querySelector('.v120-actions'))return;
      const row=assistants[ai];if(!row)return;
      node.dataset.v120Message=String(row.i);
      node.insertAdjacentHTML('beforeend',actionMarkup('arki',(chat?.id||'chat')+':'+row.i));
    });
  }
  function decorateArkiUsers(){
    const api=window.__SCHOLARK_V107_GENERAL_AI__,box=$('#v107-thread');if(!api||!box)return;
    const chat=api.getCurrent?.(),rows=(chat?.messages||[]).map((m,i)=>({m,i})).filter(x=>x.m.role==='user'),nodes=$('.v107-msg.user',box);
    nodes.forEach((node,n)=>{const row=rows[n];if(!row||node.querySelector('.v120-user-actions'))return;node.dataset.v120UserIndex=String(row.i);node.insertAdjacentHTML('beforeend','<div class="v120-user-actions"><button type="button" class="v120-edit-user" data-v120-edit-arki="'+row.i+'">Edit</button></div>')})
  }
  function startInlineEdit(node,text,onSave,onCancel){
    if(!node)return;node.innerHTML='<div class="v120-editbox"><textarea data-editing="1">'+esc(text||'')+'</textarea><div class="v120-edit-actions"><button type="button" class="save">Save & resend</button><button type="button" class="cancel">Cancel</button></div></div>';
    const ta=$('textarea',node);if(ta){ta.focus();ta.selectionStart=ta.selectionEnd=ta.value.length;ta.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();onCancel?.()}}}
    $('.cancel',node).onclick=()=>onCancel?.();$('.save',node).onclick=()=>{const next=String(ta?.value||'').trim();if(!next)return ta?.focus();onSave?.(next)}
  }
  function editArkiUser(index,node){const api=window.__SCHOLARK_V107_GENERAL_AI__,msg=api?.getCurrent?.()?.messages?.[index];if(!msg||msg.role!=='user')return;startInlineEdit(node,msg.content,next=>api?.editUserMessage?.(index,next),()=>api?.open?.())}
  function arkiAction(host,action){
    const api=window.__SCHOLARK_V107_GENERAL_AI__,chat=api?.getCurrent?.(),idx=Number(host.closest('.v107-msg')?.dataset.v120Message),msg=chat?.messages?.[idx],text=String(msg?.content||'');if(!msg)return;
    const key=host.dataset.v120Key;
    if(action==='copy')return copyText(text);
    if(action==='speak')return speak(text);
    if(action==='share')return shareText(text,'ARKI answer');
    if(action==='up'||action==='down'){const v=action==='up'?'up':'down',old=feedback()[key];setFeedback(key,old===v?'':v);host.querySelector('[data-v120-do="up"]')?.classList.toggle('active',old!==v&&v==='up');host.querySelector('[data-v120-do="down"]')?.classList.toggle('active',old!==v&&v==='down');return}
    if(action==='more'){host.querySelector('.v120-menu')?.classList.toggle('open');return}
  }
  function arkiMenu(host,action){
    const api=window.__SCHOLARK_V107_GENERAL_AI__,msgHost=host.closest('.v107-msg'),prompt=latestUserTextBefore(msgHost);
    host.querySelector('.v120-menu')?.classList.remove('open');
    if(action==='branch'){api?.prefill?.(prompt||'Continue from this answer',{newChat:true});return}
    if(action==='retry'){api?.prefill?.(prompt||'Please try that answer again.');setTimeout(()=>api?.send?.(),30);return}
    if(action==='search'){const q=prompt||assistantTextFrom(msgHost);if(q)window.open('https://www.google.com/search?q='+encodeURIComponent(q),'_blank','noopener,noreferrer')}
  }

  const TUTOR_KEY='scholark_v120_tutor_chats',TUTOR_ACTIVE='scholark_v120_tutor_active',TUTOR_PROGRESS='scholark_v120_tutor_progress';
  function tutorChats(){try{const x=JSON.parse(localStorage.getItem(TUTOR_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
  function saveTutorChats(rows){try{localStorage.setItem(TUTOR_KEY,JSON.stringify((rows||[]).slice(0,20).map(x=>({...x,messages:(x.messages||[]).slice(-50)}))))}catch{}}
  function tutorActive(){return localStorage.getItem(TUTOR_ACTIVE)||''}
  function setTutorActive(id){try{localStorage.setItem(TUTOR_ACTIVE,id)}catch{}}
  function newTutorChat(){const row={id:uid('tutor'),title:'New tutor chat',createdAt:now(),updatedAt:now(),messages:[]};const a=tutorChats();a.unshift(row);saveTutorChats(a);setTutorActive(row.id);syncTutorBackend(row);return row}
  function currentTutor(){const a=tutorChats(),id=tutorActive();return a.find(x=>x.id===id)||a[0]||newTutorChat()}
  function updateTutor(fn){const a=tutorChats(),id=tutorActive();let x=a.find(z=>z.id===id);if(!x){x=newTutorChat();return updateTutor(fn)}fn(x);x.updatedAt=now();a.sort((p,q)=>String(q.updatedAt).localeCompare(String(p.updatedAt)));saveTutorChats(a);return x}
  function syncTutorBackend(chat=currentTutor()){try{localStorage.setItem('scholark_v62_tutor_history',JSON.stringify((chat.messages||[]).map(m=>({role:m.role,text:m.text})).slice(-12)))}catch{}}
  function tutorProgress(){try{return JSON.parse(localStorage.getItem(TUTOR_PROGRESS)||'{}')||{}}catch{return{}}}
  function noteTutorProgress(topic,delta=0,review=false){const name=clean(topic)||'General';const p=tutorProgress(),k=name.toLowerCase(),x=p[k]||{topic:name,turns:0,helpful:0,reviews:0,lastSeen:0};x.turns++;x.helpful=Math.max(0,(Number(x.helpful)||0)+delta);if(review)x.reviews++;x.lastSeen=Date.now();p[k]=x;try{localStorage.setItem(TUTOR_PROGRESS,JSON.stringify(p))}catch{}return x}
  function tutorProgressText(chat=currentTutor()){const last=[...(chat.messages||[])].reverse().find(m=>m.role==='assistant'&&m.topic),p=tutorProgress(),x=last?p[String(last.topic).toLowerCase()]:null;return x?x.topic+' · '+x.turns+' tutor turn'+(x.turns===1?'':'s')+' · '+x.reviews+' review'+(x.reviews===1?'':'s'):'Progress starts when ARKI teaches a topic.'}
  function renderTutorChat(chat=currentTutor()){
    const box=$('#v52-chat');if(!box)return;
    if(!(chat.messages||[]).length){box.innerHTML='<div class="v52-msg ai">I’m ready. Ask a question, paste a problem, or choose an Assignment above and I’ll turn it into concrete next steps.</div>';return}
    box.innerHTML=(chat.messages||[]).map((m,i)=>'<div class="v52-msg '+(m.role==='user'?'user':'ai')+'" data-v120-tutor-index="'+i+'">'+(m.role==='assistant'?'<div class="v120-tutor-answer">'+esc(m.text).replace(/\n/g,'<br>')+'</div>'+actionMarkup('tutor',chat.id+':'+i):'<div class="v120-tutor-user-text">'+esc(m.text).replace(/\n/g,'<br>')+'</div><div class="v120-user-actions"><button type="button" class="v120-edit-user" data-v120-edit-tutor="'+i+'">Edit</button></div>')+'</div>').join('');
  }
  function refreshTutorBar(){
    const select=$('#v120-tutor-select'),progress=$('#v120-tutor-progress');if(select){const rows=tutorChats(),cur=currentTutor();select.innerHTML=rows.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===cur.id?'selected':'')+'>'+esc(x.title||'Tutor chat')+'</option>').join('')}if(progress)progress.textContent=tutorProgressText()
  }
  function decorateTutor(){
    const q=$('#v52-tutor-q');if(!q)return;const form=q.closest('.v52-form');if(!form)return;
    if(!$('#v120-tutorbar',form)){
      const bar=document.createElement('div');bar.className='v120-tutorbar';bar.id='v120-tutorbar';bar.innerHTML='<select id="v120-tutor-select" aria-label="Tutor chat"></select><button type="button" id="v120-tutor-new">+ New chat</button><button type="button" id="v120-tutor-review">Review topic</button><button type="button" id="v120-tutor-name">Name: '+esc(tutorName())+'</button><div class="v120-tutor-progress" id="v120-tutor-progress"></div>';form.insertBefore(bar,q);
      $('#v120-tutor-select',bar).onchange=e=>{setTutorActive(e.target.value);const c=currentTutor();syncTutorBackend(c);renderTutorChat(c);refreshTutorBar()};
      $('#v120-tutor-new',bar).onclick=()=>{newTutorChat();renderTutorChat();refreshTutorBar();q.value='';q.focus()};$('#v120-tutor-review',bar).onclick=startTutorReview;$('#v120-tutor-name',bar).onclick=chooseTutorName;
      renderTutorChat();refreshTutorBar();syncTutorBackend();applyTutorName(document);
    }
  }
  async function editTutorUser(index,node){
    const chat=currentTutor(),msg=chat.messages?.[index];if(!msg||msg.role!=='user')return;const oldText=String(msg.text||'');
    startInlineEdit(node,oldText,async next=>{await window.__SCHOLARK_V82_TUTOR_CLOUD_API__?.truncateFromUserText?.(oldText);updateTutor(x=>{x.messages=(x.messages||[]).slice(0,index)});syncTutorBackend();renderTutorChat();refreshTutorBar();const q=$('#v52-tutor-q');if(q){q.value=next;q.focus();$('#v52-tutor-send')?.click()}},()=>renderTutorChat(chat))
  }
  function decorateTutorUsers(){
    const chat=currentTutor(),rows=(chat.messages||[]).map((m,i)=>({m,i})).filter(x=>x.m.role==='user'),nodes=$$('#v52-chat .v52-msg.user').filter(n=>!n.dataset.v82MessageId);
    nodes.forEach((node,n)=>{const row=rows[n];if(!row||node.querySelector('.v120-user-actions'))return;node.dataset.v120TutorIndex=String(row.i);node.insertAdjacentHTML('beforeend','<div class="v120-user-actions"><button type="button" class="v120-edit-user" data-v120-edit-tutor="'+row.i+'">Edit</button></div>')})
  }
  function tutorAssistantHost(){return $$('#v52-chat .v52-msg.ai').filter(x=>!x.querySelector('.v62-loading')).at(-1)}
  function decorateLatestTutor(detail){
    const host=tutorAssistantHost();if(!host)return;const chat=currentTutor(),idx=(chat.messages||[]).length-1;host.dataset.v120TutorIndex=String(idx);
    if(!host.querySelector('.v120-actions'))host.insertAdjacentHTML('beforeend',actionMarkup('tutor',chat.id+':'+idx));
  }
  function tutorAction(host,action){
    const msgHost=host.closest('.v52-msg'),chat=currentTutor(),idx=Number(msgHost?.dataset.v120TutorIndex||msgHost?.dataset.v120TutorIndex),msg=chat.messages?.[idx],text=msg?.text||assistantTextFrom(msgHost),key=host.dataset.v120Key;
    if(action==='copy')return copyText(text);if(action==='speak')return speak(text);if(action==='share')return shareText(text,'SCHOLARK Tutor');
    if(action==='up'||action==='down'){const v=action==='up'?'up':'down',old=feedback()[key];setFeedback(key,old===v?'':v);if(msg?.topic)noteTutorProgress(msg.topic,v==='up'?1:-1,false);host.querySelector('[data-v120-do="up"]')?.classList.toggle('active',old!==v&&v==='up');host.querySelector('[data-v120-do="down"]')?.classList.toggle('active',old!==v&&v==='down');refreshTutorBar();return}
    if(action==='more'){host.querySelector('.v120-menu')?.classList.toggle('open')}
  }
  function tutorMenu(host,action){
    const msgHost=host.closest('.v52-msg'),chat=currentTutor(),idx=Number(msgHost?.dataset.v120TutorIndex),msg=chat.messages?.[idx],topic=clean(msg?.topic)||'this topic',q=$('#v52-tutor-q');host.querySelector('.v120-menu')?.classList.remove('open');
    if(action==='branch'){const row=newTutorChat();if(q){q.value='Continue teaching me about '+topic+' from a fresh angle at my current level.';q.focus()}refreshTutorBar();return}
    if(action==='retry'){const prev=[...(chat.messages||[]).slice(0,idx)].reverse().find(m=>m.role==='user');if(q){q.value=prev?.text||'Explain that again in a clearer way.';q.focus();$('#v52-tutor-send')?.click()}return}
    if(action==='search'){window.open('https://www.google.com/search?q='+encodeURIComponent(topic),'_blank','noopener,noreferrer');return}
  }
  function startTutorReview(){
    const chat=currentTutor(),last=[...(chat.messages||[])].reverse().find(m=>m.role==='assistant'&&m.topic),topic=clean(last?.topic)||'the topic we were studying',q=$('#v52-tutor-q');if(!q)return;
    noteTutorProgress(topic,0,true);q.value='Give me a repetition on '+topic+' at my current learning level. Test retrieval and application, not simple recognition. Mix this topic with older related material we already covered where useful, increase difficulty if I have been doing well, and explain my mistakes after I answer.';q.focus();$('#v52-tutor-send')?.click();refreshTutorBar();
  }

  function scrubProviderMarks(root=document){
    const state=$('#v107-state',root);if(state&&providerMark.test(clean(state.textContent)))state.textContent='Ready';
    $$('.v107-meta',root).forEach(meta=>{const button=meta.querySelector('button');const raw=clean(meta.textContent);if(providerMark.test(raw)){const time=raw.match(/\b\d{1,2}:\d{2}(?:\s?[AP]M)?\b/i)?.[0]||'';for(const n of [...meta.childNodes])if(n.nodeType===3)n.textContent=time?time+' ':''}});
    $$('[class*="meta"],[class*="provider"],[class*="model"],small',root).forEach(el=>{if(el.closest('.v107-msg>div:first-child,.v120-menu,.v120-actions'))return;const t=clean(el.textContent);if(t&&t.length<120&&providerMark.test(t)&&!/question\s+\d+/i.test(t))el.classList.add('v120-provider-hidden')});
  }

  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter')return;
    if(e.target?.id==='v107-q'){
      if(e.shiftKey||e.target.dataset.editing==='1')return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();window.__SCHOLARK_V107_GENERAL_AI__?.send?.();return
    }
    if(e.target?.id==='v52-tutor-q'){
      if(e.shiftKey||e.target.dataset.editing==='1')return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();$('#v52-tutor-send')?.click()
    }
  },true);

  document.addEventListener('click',e=>{
    const ea=e.target.closest?.('[data-v120-edit-arki]');if(ea){editArkiUser(Number(ea.dataset.v120EditArki),ea.closest('.v107-msg.user'));return}
    const et=e.target.closest?.('[data-v120-edit-tutor]');if(et){editTutorUser(Number(et.dataset.v120EditTutor),et.closest('.v52-msg.user'));return}
    const a=e.target.closest?.('[data-v120-do]');if(a){const host=a.closest('.v120-actions');if(!host)return;const scope=host.dataset.v120Scope;if(scope==='arki')arkiAction(host,a.dataset.v120Do);else tutorAction(host,a.dataset.v120Do);return}
    const m=e.target.closest?.('[data-v120-menu]');if(m){const host=m.closest('.v120-actions');if(host?.dataset.v120Scope==='arki')arkiMenu(host,m.dataset.v120Menu);else tutorMenu(host,m.dataset.v120Menu);return}
    if(e.target.closest?.('#v120-tutor-progress'))startTutorReview();
  },true);

  addEventListener('scholark:tutor-user',e=>{
    const prompt=clean(e.detail?.prompt);if(!prompt)return;updateTutor(x=>{if(!x.messages.length)x.title=prompt.slice(0,48);const last=x.messages.at(-1);if(!(last?.role==='user'&&last.text===prompt))x.messages.push({role:'user',text:prompt,at:now()})});refreshTutorBar();setTimeout(decorateTutorUsers,0)
  });
  addEventListener('scholark:tutor-assistant',e=>{
    const text=clean(e.detail?.answer),topic=clean(e.detail?.result?.topic)||clean(e.detail?.prompt).slice(0,80)||'General';if(!text)return;
    updateTutor(x=>x.messages.push({role:'assistant',text,topic,at:now()}));noteTutorProgress(topic,0,false);syncTutorBackend();decorateLatestTutor(e.detail);refreshTutorBar();scrubProviderMarks(document)
  });

  let observerQueued=false,observerNeedsArki=false,observerNeedsTutor=false;const observerRoots=new Set();
  function flushObserver(){
    observerQueued=false;
    if(observerNeedsArki){decorateArki();decorateArkiUsers()}
    if(observerNeedsTutor){decorateTutor();decorateTutorUsers();applyTutorName(document)}
    for(const root of [...observerRoots].slice(0,24))if(root?.isConnected)scrubProviderMarks(root);
    observerRoots.clear();observerNeedsArki=observerNeedsTutor=false
  }
  const observer=new MutationObserver(m=>{
    for(const x of m)for(const a of x.addedNodes){
      if(a.nodeType!==1)continue;
      observerRoots.add(a);
      if(a.matches?.('#v107-ai,.v107-msg')||a.querySelector?.('#v107-ai,.v107-msg'))observerNeedsArki=true;
      if(a.matches?.('#v52-tutor-q')||a.querySelector?.('#v52-tutor-q'))observerNeedsTutor=true
    }
    if((observerNeedsArki||observerNeedsTutor||observerRoots.size)&&!observerQueued){observerQueued=true;requestAnimationFrame(flushObserver)}
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  addEventListener('hashchange',()=>setTimeout(()=>{decorateArki();decorateArkiUsers();decorateTutor();decorateTutorUsers();applyTutorName(document);scrubProviderMarks(document)},60));
  addEventListener('scholark-tool-mounted',()=>setTimeout(()=>{decorateArki();decorateArkiUsers();decorateTutor();decorateTutorUsers();applyTutorName(document);scrubProviderMarks(document)},30));
  addEventListener('scholark:tutor-name-changed',()=>setTimeout(()=>applyTutorName(document),0));
  setTimeout(()=>{decorateArki();decorateArkiUsers();decorateTutor();decorateTutorUsers();applyTutorName(document);scrubProviderMarks(document)},180);

  window.__SCHOLARK_V120_EXPERIENCE__={health:()=>({ok:!!document.getElementById('scholark-v120-style'),arkiActions:true,enterToSend:true,tutorChats:true,tutorProgress:true,tutorNaming:true,messageEditing:true,providerUiHidden:true}),reviewTutorTopic:startTutorReview,release:'r228-experience'};
})();