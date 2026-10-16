(() => {
  if(window.__SCHOLARK_V120_EXPERIENCE_CONTROLS__)return;
  window.__SCHOLARK_V120_EXPERIENCE_CONTROLS__=true;

  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const multiline=v=>String(v??'').replace(/\r\n?/g,'\n').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now=()=>new Date().toISOString();
  const uid=p=>(p||'id')+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
  const providerMark=/(^|\b)(gemini|pollinations|openai(?:-fast)?|gpt-5(?:\.[0-9]+)?(?:-[a-z]+)?|public-product-facts|scholark-test-engine)(\b|$)/i;
  const TUTOR_NAME_KEY='scholark_tutor_name_v1';
  let lastTutorName='AI Tutor';
  function tutorName(){const v=clean(localStorage.getItem(TUTOR_NAME_KEY)||'');return v.slice(0,24)||'AI Tutor'}
  function applyTutorName(root=document){
    const name=tutorName(),previous=lastTutorName;lastTutorName=name;
    for(const sel of ['#v51-sidebar [data-v51-tool="tutor"]','#v51-main [data-v51-tool="tutor"]','.v52-tool[data-v52-tool="tutor"] .v52-head','.v111-live','.v114-connect','#v120-tutorbar','#v52-tutor-send'])for(const host of $$(sel,root)){
      const w=document.createTreeWalker(host,NodeFilter.SHOW_TEXT),nodes=[];while(w.nextNode())nodes.push(w.currentNode);
      for(const n of nodes){let t=n.nodeValue||'';t=t.replace(/Tutor learning loop/g,name+' learning loop').replace(/SCHOLARK Tutor/g,name).replace(/AI Tutor/g,name);if(previous&&previous!=='AI Tutor'&&previous!==name)t=t.replaceAll(previous,name);n.nodeValue=t}
    }
    $$('#v51-sidebar [data-v51-tool="tutor"] span',root).forEach(x=>x.textContent=name);
    $$('#v51-main [data-v51-tool="tutor"] h3',root).forEach(x=>x.textContent=name);
    const heading=$('.v52-tool[data-v52-tool="tutor"] .v52-head h1',root)||$('.v52-tool[data-v52-tool="tutor"] .v52-head h1');if(heading)heading.textContent=name;
    const loop=$('.v52-tool[data-v52-tool="tutor"] .v111-live h2',root)||$('.v52-tool[data-v52-tool="tutor"] .v111-live h2');if(loop)loop.textContent=name+' learning loop';
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
    .v120-tutorbar{display:grid;grid-template-columns:minmax(0,1fr) max-content max-content max-content;gap:8px;align-items:center;width:100%;min-width:0;margin-bottom:12px}.v120-tutorbar>*{min-width:0;writing-mode:horizontal-tb!important;word-break:normal!important;overflow-wrap:normal!important}.v120-tutorbar select,.v120-tutorbar button{height:40px;border:1px solid rgba(23,25,31,.11);border-radius:11px;background:#fff;padding:0 12px;font:850 9px Inter;white-space:nowrap!important}.v120-tutorbar button{max-width:180px;overflow:hidden;text-overflow:ellipsis}.v120-tutorbar select{width:100%;font-size:11.5px;font-weight:950;color:#17191f;text-overflow:ellipsis;overflow:hidden;box-shadow:0 5px 18px rgba(31,27,63,.035)}.v120-tutor-progress{grid-column:1/-1;font:750 8px/1.4 Inter;color:#5f5967;text-align:right;min-width:0;white-space:normal}.v120-tutor-msg{margin-top:7px}.v120-tutor-answer{white-space:pre-wrap}.v120-user-actions{display:flex;justify-content:flex-end;margin-top:5px}.v120-edit-user{border:0;background:transparent;color:inherit;opacity:.68;padding:2px 4px;font:850 7px Inter;cursor:pointer}.v120-editbox{display:grid;gap:7px;min-width:min(520px,70vw)}.v120-editbox textarea{width:100%;min-height:90px;box-sizing:border-box;border:1px solid rgba(23,25,31,.14);border-radius:11px;padding:10px;font:650 10px/1.5 Inter;resize:vertical}.v120-edit-actions{display:flex;gap:6px;justify-content:flex-end}.v120-edit-actions button{border:0;border-radius:9px;padding:7px 10px;font:850 7px Inter;cursor:pointer}.v120-edit-actions .save{background:#17191f;color:#c9ff6a}.v120-provider-hidden{display:none!important}
    .v120-attach-wrap{position:relative;display:flex;align-items:center;gap:7px;min-width:0}.v120-attach-plus{width:38px;height:38px;flex:0 0 38px;border:1px solid rgba(23,25,31,.12);border-radius:50%;background:#fff;color:#17191f;font:500 23px/1 Inter;display:grid;place-items:center;cursor:pointer}.v120-attach-plus:hover,.v120-attach-plus[aria-expanded="true"]{background:#f1efff;border-color:rgba(109,93,252,.28);color:#5d4fd0}.v120-attach-plus:disabled{opacity:.42;cursor:not-allowed;background:#f4f3f5;color:#8e8993}.v120-attach-menu{position:absolute;left:0;bottom:46px;z-index:80;display:none;min-width:210px;padding:7px;background:#fff;border:1px solid rgba(23,25,31,.1);border-radius:16px;box-shadow:0 20px 60px rgba(25,20,55,.2)}.v120-attach-menu.open{display:grid;gap:3px}.v120-attach-menu button{border:0;background:transparent;border-radius:10px;padding:10px 11px;text-align:left;font:850 9px Inter;color:#2f2b35;cursor:pointer;white-space:nowrap!important}.v120-attach-menu button:hover{background:#f3f1f7}.v120-attach-menu b{display:inline-grid;place-items:center;width:23px;height:23px;margin-right:7px;border-radius:8px;background:#efedff;color:#5d4fd0;font:950 11px Inter}.v120-attach-input{display:none!important}.v120-attach-tray{display:flex;gap:6px;flex-wrap:wrap;min-width:0}.v120-attach-chip{display:inline-flex;align-items:center;gap:6px;max-width:210px;padding:5px 7px;border-radius:11px;background:#f2f0f7;border:1px solid rgba(23,25,31,.07);font:800 7.5px Inter;color:#4d4757}.v120-attach-chip img{width:28px;height:28px;border-radius:7px;object-fit:cover}.v120-attach-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v120-attach-chip button{border:0;background:transparent;color:#716b78;font:950 11px Inter;cursor:pointer;padding:0 2px}.v120-tutor-attachbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0}.v120-tutor-attachbar .v120-attach-tray{flex:1}.v120-attach-status{font:750 7px Inter;color:#756e7d}.v120-msg-attachments{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}.v120-msg-attachment{display:inline-flex;align-items:center;gap:5px;padding:5px 7px;border-radius:9px;background:rgba(255,255,255,.12);font:800 7px Inter}.v52-msg.ai .v120-msg-attachment{background:#ebe8ff;color:#51466a}.v107-msg.user .v120-msg-attachment{background:rgba(255,255,255,.12);color:#fff}#v107-ai .v107-composebar{flex-wrap:wrap}#v107-ai .v107-composebar .v107-state{min-width:120px}
    .v120-quota-banner{margin:9px 0 0;padding:10px 12px;border-radius:12px;background:#f5f3ff;border:1px solid rgba(109,93,252,.18);color:#4f4766;font:750 8.5px/1.45 Inter}.v120-quota-banner strong{color:#2f2943;font-weight:950}.v120-quota-banner.blocked{background:#fff4ee;border-color:#ffd8c5;color:#78462f}.v120-quota-banner[hidden]{display:none!important}.v120-quota-banner .v120-quota-upgrade{border:0;background:transparent;color:#5e50d6;font:900 8px Inter;padding:0 0 0 6px;cursor:pointer;text-decoration:underline}.v120-quota-note{opacity:.82}
    @media(max-width:620px){.v120-attach-menu{position:fixed;left:16px;right:16px;bottom:88px;min-width:0}.v120-tutor-attachbar{align-items:flex-start}.v120-attach-tray{flex-basis:calc(100% - 48px)}.v120-quota-banner{font-size:8px}}
    .v120-toast{position:fixed;right:18px;bottom:18px;z-index:2147483646;background:#17191f;color:#fff;border-radius:12px;padding:10px 13px;font:800 8px Inter;box-shadow:0 16px 45px rgba(0,0,0,.24)}
    @media(max-width:900px){.v120-tutorbar{grid-template-columns:1fr 1fr}.v120-tutorbar select{grid-column:1/-1}.v120-tutorbar button{width:100%;max-width:none}.v120-tutorbar #v120-tutor-name{grid-column:1/-1}.v120-tutor-progress{grid-column:1/-1;text-align:left}}@media(max-width:620px){.v120-tutorbar{gap:7px}.v120-tutorbar select{font-size:11px}.v120-tutorbar select,.v120-tutorbar button{height:44px}.v120-tutor-progress{font-size:7.5px}}
  `;document.head.appendChild(style);

  function toast(msg){let x=$('#v120-toast');if(!x){x=document.createElement('div');x.id='v120-toast';x.className='v120-toast';document.body.appendChild(x)}x.textContent=msg;clearTimeout(window.__v120toast);window.__v120toast=setTimeout(()=>x.remove(),1800)}
  async function copyText(text){
    const value=String(text??'');
    if(!value){toast('Nothing to copy');return false}
    try{
      if(!navigator.clipboard?.writeText)throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(value);toast('Copied');return true;
    }catch{
      // Some browsers and embedded views reject Clipboard API permissions.
      // Fallback to a user-gesture copy without exporting data to a server.
      const active=document.activeElement,field=document.createElement('textarea');
      field.value=value;field.setAttribute('readonly','');field.setAttribute('aria-hidden','true');
      field.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(field);field.focus();field.select();
      let copied=false;try{copied=!!document.execCommand?.('copy')}catch{}
      field.remove();try{active?.focus?.({preventScroll:true})}catch{}
      toast(copied?'Copied':'Copy unavailable: select the text and press Ctrl+C');
      return copied;
    }
  }
  function speak(text){if(!('speechSynthesis'in window)||!text)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text));u.lang=document.documentElement.lang||'en';speechSynthesis.speak(u)}catch{}}
  async function shareText(text,title='SCHOLARK'){const t=String(text||'');try{if(navigator.share){await navigator.share({title,text:t})}else await copyText(t)}catch{}}

  const ATTACHMENT_LIMIT=10,ATTACHMENT_IMAGE_CHARS=540000;
  const attachmentState={arki:{items:[],pending:0},tutor:{items:[],pending:0}};
  let attachmentEpoch=0;
  const attachmentExt=f=>String(f?.name||'').split('.').pop().toLowerCase();
  const attachmentTextFile=f=>String(f?.type||'').startsWith('text/')||['txt','md','markdown','csv','json','html','htm','xml'].includes(attachmentExt(f));
  const attachmentBase64=f=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>{const v=String(r.result||''),i=v.indexOf(',');resolve(i>=0?v.slice(i+1):v)};r.onerror=()=>reject(r.error||new Error('Could not read file'));r.readAsDataURL(f)});
  const loadImage=f=>new Promise((resolve,reject)=>{const url=URL.createObjectURL(f),img=new Image();img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('This image format could not be opened.'))};img.src=url});
  async function attachmentImage(file){
    if(file.size>15*1024*1024)throw new Error(file.name+' is over the 15 MB image limit.');
    const img=await loadImage(file),max=1600,baseRatio=Math.min(1,max/Math.max(img.naturalWidth||1,img.naturalHeight||1)),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx)throw new Error('Image processing is unavailable in this browser.');
    let url='',data='';
    for(const shrink of [1,.88,.76,.66,.56,.48]){
      canvas.width=Math.max(1,Math.round((img.naturalWidth||1)*baseRatio*shrink));canvas.height=Math.max(1,Math.round((img.naturalHeight||1)*baseRatio*shrink));
      ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
      for(const q of [.82,.7,.58,.48]){url=canvas.toDataURL('image/jpeg',q);data=url.slice(url.indexOf(',')+1);if(data.length<=ATTACHMENT_IMAGE_CHARS)break}
      if(data.length<=ATTACHMENT_IMAGE_CHARS)break
    }
    if(data.length>ATTACHMENT_IMAGE_CHARS)throw new Error(file.name+' is still too large after safe compression.');
    return{kind:'image',name:String(file.name||'photo.jpg').slice(0,180),type:'image/jpeg',data,preview:url,detail:canvas.width+'×'+canvas.height}
  }
  async function attachmentDocument(file){
    if(file.size>10*1024*1024)throw new Error(file.name+' is over the 10 MB file limit.');
    const ext=attachmentExt(file),name=String(file.name||'file').slice(0,180),type=String(file.type||ext).slice(0,120);
    if(attachmentTextFile(file)){const text=(await file.text()).slice(0,30000);return{kind:'file',name,type,text,detail:text.length+' characters'}}
    if(['pdf','docx','pptx'].includes(ext)){
      const r=await fetch('/api/studio/reference/extract',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,type,size:file.size,data:await attachmentBase64(file)})});
      const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok||!String(d.text||'').trim())throw new Error(d?.error||('Could not read '+name));
      const text=String(d.text||'').slice(0,30000);return{kind:'file',name,type,text,detail:d.pages?d.pages+' pages':d.slides?d.slides+' slides':text.length+' characters'}
    }
    if(String(file.type||'').startsWith('image/'))return attachmentImage(file);
    throw new Error('Unsupported file: '+name)
  }
  const attachmentPublic=x=>x?{kind:x.kind,name:x.name,type:x.type,...(x.kind==='image'?{data:x.data}:{text:x.text})}:null;
  const attachmentMeta=x=>x?{kind:x.kind,name:x.name,type:x.type,detail:x.detail||''}:null;
  function attachmentMessageMarkup(items=[]){return items.length?'<div class="v120-msg-attachments">'+items.map(x=>'<span class="v120-msg-attachment">'+(x.kind==='image'?'▧':'⌕')+' '+esc(x.name||'attachment')+'</span>').join('')+'</div>':''}
  function attachmentRoot(scope){return scope==='arki'?$('#v107-ai .v107-composebar'):$('#v52-tutor-q')?.closest('.v52-form')}
  function renderAttachmentTray(scope){
    const root=attachmentRoot(scope),tray=root?.querySelector?.('[data-v120-attach-tray="'+scope+'"]'),status=root?.querySelector?.('[data-v120-attach-status="'+scope+'"]'),st=attachmentState[scope];if(!tray||!st)return;
    tray.innerHTML=st.items.map((x,i)=>'<span class="v120-attach-chip">'+(x.preview?'<img alt="" src="'+esc(x.preview)+'">':'<b>'+(x.kind==='image'?'▧':'⌕')+'</b>')+'<span>'+esc(x.name)+'</span><button type="button" data-v120-attach-remove="'+scope+':'+i+'" aria-label="Remove '+esc(x.name)+'">×</button></span>').join('');
    if(status)status.textContent=st.pending?'Preparing '+st.pending+' attachment'+(st.pending===1?'':'s')+'…':(st.items.length?st.items.length+'/'+ATTACHMENT_LIMIT+' attached':'')
  }
  function attachmentMarkup(scope){
    const wrap=document.createElement('div');wrap.className='v120-attach-wrap';wrap.id='v120-attach-'+scope;
    wrap.innerHTML='<button type="button" class="v120-attach-plus" data-v120-attach-plus="'+scope+'" aria-label="Add photos, camera or files" aria-expanded="false">+</button><div class="v120-attach-menu" data-v120-attach-menu="'+scope+'"><button type="button" data-v120-attach-pick="'+scope+':photos"><b>▧</b>Photos</button><button type="button" data-v120-attach-pick="'+scope+':camera"><b>◉</b>Camera</button><button type="button" data-v120-attach-pick="'+scope+':files"><b>⌕</b>Files</button></div><input class="v120-attach-input" data-v120-attach-input="'+scope+':photos" type="file" accept="image/*" multiple><input class="v120-attach-input" data-v120-attach-input="'+scope+':camera" type="file" accept="image/*" capture="environment"><input class="v120-attach-input" data-v120-attach-input="'+scope+':files" type="file" accept=".pdf,.docx,.pptx,.txt,.md,.markdown,.csv,.json,.html,.htm,.xml,text/*">';
    wrap.querySelectorAll('[data-v120-attach-input]').forEach(input=>input.onchange=async()=>{
      const files=[...(input.files||[])],st=attachmentState[scope],taskEpoch=attachmentEpoch;input.value='';if(!files.length||!st)return;
      const perMessageRoom=Math.max(0,ATTACHMENT_LIMIT-st.items.length-st.pending),dailyRemaining=quotaState.quota?.limited?Math.max(0,Number(quotaState.quota?.attachmentRemaining)||0):ATTACHMENT_LIMIT,room=Math.max(0,Math.min(perMessageRoom,dailyRemaining));
      if(!room){toast(quotaState.quota?.limited&&dailyRemaining<=0?'Free attachment limit reached for this 24-hour window':'Maximum '+ATTACHMENT_LIMIT+' attachments per message');applyQuotaScope(scope);return}
      const selected=files.slice(0,room);if(files.length>room)toast('Only the first '+room+' file'+(room===1?'':'s')+' fit — maximum '+ATTACHMENT_LIMIT+' per message and within your remaining upload allowance');st.pending+=selected.length;renderAttachmentTray(scope);
      for(const file of selected){
        if(taskEpoch!==attachmentEpoch)break;
        try{
          const item=String(file.type||'').startsWith('image/')?await attachmentImage(file):await attachmentDocument(file);
          if(taskEpoch===attachmentEpoch)st.items.push(item);
        }catch(err){if(taskEpoch===attachmentEpoch)toast(clean(err?.message||err))}
        finally{if(taskEpoch===attachmentEpoch){st.pending=Math.max(0,st.pending-1);renderAttachmentTray(scope)}}
      }
    });
    return wrap
  }
  function ensureAttachmentUi(scope){
    if(scope==='arki'){
      const bar=$('#v107-ai .v107-composebar');if(!bar)return;if(!$('#v120-attach-arki',bar))bar.insertBefore(attachmentMarkup('arki'),bar.firstChild);
      let tray=$('[data-v120-attach-tray="arki"]',bar);if(!tray){tray=document.createElement('div');tray.className='v120-attach-tray';tray.dataset.v120AttachTray='arki';bar.insertBefore(tray,$('#v107-state',bar)||$('#v107-send',bar))}
      if(!$('[data-v120-attach-status="arki"]',bar)){const st=document.createElement('span');st.className='v120-attach-status';st.dataset.v120AttachStatus='arki';bar.insertBefore(st,$('#v107-state',bar)||$('#v107-send',bar))}
    }else{
      const q=$('#v52-tutor-q'),form=q?.closest('.v52-form');if(!form)return;
      if(!$('#v120-tutor-attachbar',form)){const row=document.createElement('div');row.id='v120-tutor-attachbar';row.className='v120-tutor-attachbar';row.appendChild(attachmentMarkup('tutor'));const tray=document.createElement('div');tray.className='v120-attach-tray';tray.dataset.v120AttachTray='tutor';row.appendChild(tray);const st=document.createElement('span');st.className='v120-attach-status';st.dataset.v120AttachStatus='tutor';row.appendChild(st);form.insertBefore(row,$('#v52-tutor-send',form))}
    }
    renderAttachmentTray(scope);ensureQuotaBanner(scope);applyQuotaScope(scope);refreshQuota(false)
  }
  function clearAttachments(scope){const st=attachmentState[scope];if(st){st.items=[];renderAttachmentTray(scope)}}
  function attachmentApiGet(scope){return (attachmentState[scope]?.items||[]).map(attachmentPublic).filter(Boolean)}
  function attachmentApiMeta(scope){return (attachmentState[scope]?.items||[]).map(attachmentMeta).filter(Boolean)}
  window.__SCHOLARK_CHAT_ATTACHMENTS__={get:attachmentApiGet,meta:attachmentApiMeta,clear:clearAttachments,busy:scope=>(attachmentState[scope]?.pending||0)>0,ensure:ensureAttachmentUi,messageMarkup:attachmentMessageMarkup,limit:ATTACHMENT_LIMIT};

  const quotaState={quota:null,code:'',retryUntil:0,lastLoaded:0,loading:null,timer:0};
  function quotaResetText(value){const t=Date.parse(String(value||''));if(!Number.isFinite(t))return'';return new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',month:'short',day:'numeric'}).format(new Date(t))}
  function quotaDisabled(el,blocked){
    if(!el)return;
    if(blocked){if(!el.disabled)el.dataset.v120QuotaDisabled='1';el.disabled=true}
    else if(el.dataset.v120QuotaDisabled==='1'){delete el.dataset.v120QuotaDisabled;el.disabled=false}
  }
  function ensureQuotaBanner(scope){
    if(scope==='arki'){
      const compose=$('#v107-ai .v107-compose');if(!compose)return null;let b=$('[data-v120-quota="arki"]',compose);if(!b){b=document.createElement('div');b.className='v120-quota-banner';b.dataset.v120Quota='arki';b.hidden=true;compose.appendChild(b)}return b
    }
    const form=$('#v52-tutor-q')?.closest('.v52-form');if(!form)return null;let b=$('[data-v120-quota="tutor"]',form);if(!b){b=document.createElement('div');b.className='v120-quota-banner';b.dataset.v120Quota='tutor';b.hidden=true;form.appendChild(b)}return b
  }
  function applyQuotaScope(scope){
    const q=quotaState.quota,code=String(quotaState.code||''),temporary=quotaState.retryUntil>Date.now(),banner=ensureQuotaBanner(scope);
    const chatRemaining=Number(q?.chatRemaining),attachmentRemaining=Number(q?.attachmentRemaining),limited=!!q?.limited;
    const chatBlocked=temporary||code==='FREE_DAILY_CHAT_LIMIT'||(limited&&Number.isFinite(chatRemaining)&&chatRemaining<=0);
    const attachmentBlocked=chatBlocked||code==='FREE_DAILY_ATTACHMENT_LIMIT'||(limited&&Number.isFinite(attachmentRemaining)&&attachmentRemaining<=0);
    const send=scope==='arki'?$('#v107-send'):$('#v52-tutor-send'),plus=$('[data-v120-attach-plus="'+scope+'"]');
    quotaDisabled(send,chatBlocked);quotaDisabled(plus,attachmentBlocked);
    if(!banner)return;
    const reset=quotaResetText(q?.resetAt),resetText=reset?' <span class="v120-quota-note">Resets '+esc(reset)+'.</span>':'';
    let html='',blocked=false;
    if(temporary){
      const seconds=Math.max(1,Math.ceil((quotaState.retryUntil-Date.now())/1000));
      html='<strong>Too many requests right now.</strong> Try again in about '+Math.max(1,Math.ceil(seconds/60))+' minute'+(seconds>60?'s':'')+'.';blocked=true
    }else if(chatBlocked){
      html='<strong>Free daily chat limit reached.</strong> Free includes '+esc(q?.chatLimit??20)+' ARKI / AI Tutor messages per 24-hour window.'+resetText+'<button type="button" class="v120-quota-upgrade" data-v120-upgrade>View plans</button>';blocked=true
    }else if(attachmentBlocked){
      html='<strong>Free attachment limit reached.</strong> Free includes '+esc(q?.attachmentLimit??15)+' photo, camera or file uploads per 24-hour window. You can keep chatting without uploads.'+resetText+'<button type="button" class="v120-quota-upgrade" data-v120-upgrade>View plans</button>';blocked=true
    }else if(limited&&((Number.isFinite(chatRemaining)&&chatRemaining<=3)||(Number.isFinite(attachmentRemaining)&&attachmentRemaining<=5))){
      html='<strong>Free usage remaining:</strong> '+Math.max(0,chatRemaining)+' chat message'+(chatRemaining===1?'':'s')+' · '+Math.max(0,attachmentRemaining)+' upload'+(attachmentRemaining===1?'':'s')+'.'+resetText
    }
    banner.hidden=!html;banner.classList.toggle('blocked',blocked);banner.innerHTML=html;
    banner.querySelector('[data-v120-upgrade]')?.addEventListener('click',()=>{location.hash='#pricing'})
  }
  function applyQuota(quota,code='',retryAfter=0){
    if(quota&&typeof quota==='object')quotaState.quota=quota;
    quotaState.code=String(code||'').toUpperCase();
    const temporaryCodes=new Set(['USER_RATE_LIMITED','RATE_LIMITED','BURST_RATE_LIMITED','CLIENT_CONCURRENCY_LIMIT']);
    quotaState.retryUntil=temporaryCodes.has(quotaState.code)&&Number(retryAfter)>0?Date.now()+Number(retryAfter)*1000:0;
    for(const scope of ['arki','tutor'])applyQuotaScope(scope);
    clearTimeout(quotaState.timer);
    if(quotaState.retryUntil>Date.now())quotaState.timer=setTimeout(()=>{quotaState.code='';quotaState.retryUntil=0;for(const scope of ['arki','tutor'])applyQuotaScope(scope)},Math.max(250,quotaState.retryUntil-Date.now()+250))
  }
  async function refreshQuota(force=false){
    if(window.__SCHOLARK_TEST_MODE__)return;
    const nowMs=Date.now();if(!force&&quotaState.lastLoaded&&nowMs-quotaState.lastLoaded<60000)return;if(quotaState.loading)return quotaState.loading;
    const requestOwner=accountOwner();
    quotaState.loading=(async()=>{
      try{
        const session=window.__SCHOLARK_V72_CLOUD__?.currentSession?.()||await window.__SCHOLARK_V72_CLOUD__?.session?.();if(!session?.access_token)return;
        const r=await fetch('/api/learning/quota-status',{headers:{authorization:'Bearer '+session.access_token,accept:'application/json'}});
        const d=await r.json().catch(()=>({}));if(requestOwner===accountOwner()&&r.ok&&d?.ok){quotaState.lastLoaded=Date.now();applyQuota(d.quota||null,d.code||'',Number(r.headers.get('retry-after'))||0)}
      }catch{}finally{if(requestOwner===accountOwner())quotaState.loading=null}
    })();return quotaState.loading
  }
  window.__SCHOLARK_CHAT_QUOTA__={apply:applyQuota,refresh:refreshQuota,sync:()=>{for(const scope of ['arki','tutor'])applyQuotaScope(scope)},state:()=>({...quotaState}),limits:{attachmentsPerMessage:ATTACHMENT_LIMIT}};

  function accountOwner(){
    try{
      const live=window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.user?.id;
      const saved=JSON.parse(localStorage.getItem('scholark_supabase_session_v2')||'null')?.user?.id;
      const id=String(live||saved||'guest');
      return /^[a-zA-Z0-9-]{8,128}$/.test(id)?id:'guest';
    }catch{return 'guest'}
  }
  const profileKey=(base,owner=accountOwner())=>base+':account:'+owner;
  const FEEDBACK='scholark_v120_answer_feedback';
  function feedback(){try{return JSON.parse(localStorage.getItem(profileKey(FEEDBACK))||'{}')||{}}catch{return{}}}
  function setFeedback(key,value){const x=feedback();if(value)x[key]=value;else delete x[key];try{localStorage.setItem(profileKey(FEEDBACK),JSON.stringify(x))}catch{}}

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
    ensureAttachmentUi('arki');
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
    const chat=api.getCurrent?.(),rows=(chat?.messages||[]).map((m,i)=>({m,i})).filter(x=>x.m.role==='user'),nodes=$$('.v107-msg.user',box);
    nodes.forEach((node,n)=>{const row=rows[n];if(!row||node.querySelector('.v120-user-actions'))return;node.dataset.v120UserIndex=String(row.i);node.insertAdjacentHTML('beforeend','<div class="v120-user-actions"><button type="button" class="v120-edit-user" data-v120-copy-message="arki:'+row.i+'" aria-label="Copy your ARKI message">Copy</button><button type="button" class="v120-edit-user" data-v120-edit-arki="'+row.i+'">Edit</button></div>')})
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
  let tutorProfileOwner=accountOwner();
  function tutorChats(owner=accountOwner()){try{const x=JSON.parse(localStorage.getItem(profileKey(TUTOR_KEY,owner))||'[]');return Array.isArray(x)?x:[]}catch{return[]}}
  function saveTutorChats(rows,owner=accountOwner()){try{localStorage.setItem(profileKey(TUTOR_KEY,owner),JSON.stringify((rows||[]).slice(0,20).map(x=>({...x,messages:(x.messages||[]).slice(-50)}))))}catch{}}
  function tutorActive(owner=accountOwner()){return localStorage.getItem(profileKey(TUTOR_ACTIVE,owner))||''}
  function setTutorActive(id,owner=accountOwner()){try{localStorage.setItem(profileKey(TUTOR_ACTIVE,owner),id)}catch{}}
  function newTutorChat(owner=accountOwner()){const row={id:uid('tutor'),title:'New tutor chat',createdAt:now(),updatedAt:now(),messages:[]};const a=tutorChats(owner);a.unshift(row);saveTutorChats(a,owner);setTutorActive(row.id,owner);syncTutorBackend(row,owner);return row}
  function currentTutor(owner=accountOwner()){const a=tutorChats(owner),id=tutorActive(owner);return a.find(x=>x.id===id)||a[0]||newTutorChat(owner)}
  function updateTutor(fn,owner=accountOwner()){const a=tutorChats(owner),id=tutorActive(owner);let x=a.find(z=>z.id===id);if(!x){newTutorChat(owner);return updateTutor(fn,owner)}fn(x);x.updatedAt=now();a.sort((p,q)=>String(q.updatedAt).localeCompare(String(p.updatedAt)));saveTutorChats(a,owner);return x}
  function syncTutorBackend(chat=currentTutor(),owner=accountOwner()){try{localStorage.setItem(profileKey('scholark_v62_tutor_history',owner),JSON.stringify((chat.messages||[]).map(m=>({role:m.role,text:m.text})).slice(-12)))}catch{}}
  function tutorProgress(){try{return JSON.parse(localStorage.getItem(profileKey(TUTOR_PROGRESS))||'{}')||{}}catch{return{}}}
  function noteTutorProgress(topic,delta=0,review=false){const name=clean(topic)||'General';const p=tutorProgress(),k=name.toLowerCase(),x=p[k]||{topic:name,turns:0,helpful:0,reviews:0,lastSeen:0};x.turns++;x.helpful=Math.max(0,(Number(x.helpful)||0)+delta);if(review)x.reviews++;x.lastSeen=Date.now();p[k]=x;try{localStorage.setItem(profileKey(TUTOR_PROGRESS),JSON.stringify(p))}catch{}return x}
  function tutorProgressText(chat=currentTutor()){const last=[...(chat.messages||[])].reverse().find(m=>m.role==='assistant'&&m.topic),p=tutorProgress(),x=last?p[String(last.topic).toLowerCase()]:null;return x?x.topic+' · '+x.turns+' tutor turn'+(x.turns===1?'':'s')+' · '+x.reviews+' review'+(x.reviews===1?'':'s'):'Progress starts when ARKI teaches a topic.'}
  function renameTutorChat(){
    const chat=currentTutor(),raw=prompt('Rename Tutor chat',chat.title||'Tutor chat');if(raw==null)return false;
    const title=clean(raw).replace(/[<>]/g,'').slice(0,80);if(!title)return false;
    updateTutor(x=>{x.title=title});refreshTutorBar();
    try{const p=window.__SCHOLARK_V82_TUTOR_CLOUD_API__?.renameCurrent?.(title);p?.catch?.(()=>{})}catch{}
    toast('Tutor chat renamed');return true
  }
  function renderTutorChat(chat=currentTutor()){
    const box=$('#v52-chat');if(!box)return;
    if(!(chat.messages||[]).length){box.innerHTML='<div class="v52-msg ai">I’m ready. Ask a question, paste a problem, or choose an Assignment above and I’ll turn it into concrete next steps.</div>';return}
    box.innerHTML=(chat.messages||[]).map((m,i)=>'<div class="v52-msg '+(m.role==='user'?'user':'ai')+'" data-v120-tutor-index="'+i+'">'+(m.role==='assistant'?'<div class="v120-tutor-answer">'+esc(m.text).replace(/\n/g,'<br>')+'</div>'+actionMarkup('tutor',chat.id+':'+i):'<div class="v120-tutor-user-text">'+esc(m.text).replace(/\n/g,'<br>')+'</div>'+attachmentMessageMarkup(m.attachments||[])+'<div class="v120-user-actions"><button type="button" class="v120-edit-user" data-v120-copy-message="tutor:'+i+'" aria-label="Copy your AI Tutor message">Copy</button><button type="button" class="v120-edit-user" data-v120-edit-tutor="'+i+'">Edit</button></div>')+'</div>').join('');
  }
  function refreshTutorBar(){
    const select=$('#v120-tutor-select'),progress=$('#v120-tutor-progress');if(select){const rows=tutorChats(),cur=currentTutor();select.innerHTML=rows.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===cur.id?'selected':'')+'>'+esc(x.title||'Tutor chat')+'</option>').join('');select.title=cur.title||'Tutor chat';select.setAttribute('aria-label','Current Tutor chat: '+(cur.title||'Tutor chat'))}if(progress)progress.textContent=tutorProgressText()
  }
  function decorateTutor(){
    const q=$('#v52-tutor-q');if(!q)return;const form=q.closest('.v52-form');if(!form)return;ensureAttachmentUi('tutor');
    if(!$('#v120-tutorbar',form)){
      const bar=document.createElement('div');bar.className='v120-tutorbar';bar.id='v120-tutorbar';bar.innerHTML='<select id="v120-tutor-select" aria-label="Tutor chat"></select><button type="button" id="v120-tutor-rename">Rename chat</button><button type="button" id="v120-tutor-review">Review topic</button><button type="button" id="v120-tutor-name">Name: '+esc(tutorName())+'</button><div class="v120-tutor-progress" id="v120-tutor-progress"></div>';form.insertBefore(bar,q);
      $('#v120-tutor-select',bar).onchange=e=>{setTutorActive(e.target.value);const c=currentTutor();syncTutorBackend(c);renderTutorChat(c);refreshTutorBar()};
      $('#v120-tutor-rename',bar).onclick=renameTutorChat;$('#v120-tutor-review',bar).onclick=startTutorReview;$('#v120-tutor-name',bar).onclick=chooseTutorName;
      renderTutorChat();refreshTutorBar();syncTutorBackend();applyTutorName(document);
    }
    if(!$('#v120-tutor-tasks',form)){
      const tasks=document.createElement('div');tasks.id='v120-tutor-tasks';
      tasks.setAttribute('aria-label','Tutor learning activities');
      tasks.style.cssText='display:flex;flex-wrap:wrap;gap:7px;margin:8px 0 10px';
      const options=[
        ['Teach step by step','Explain this topic step by step at my level, with a worked example: '],
        ['Check my work','Review my work. Identify mistakes, explain why, and help me correct them: '],
        ['Quiz me','Quiz me on this topic, then explain my mistakes after I answer: '],
        ['Study plan','Create a realistic study plan with milestones and review sessions for: '],
        ['Exam practice','Prepare me for an exam with practice questions and worked solutions about: ']
      ];
      tasks.innerHTML=options.map(([title],i)=>'<button type="button" data-v120-tutor-task="'+i+'" style="border:1px solid #dcd9ea;border-radius:999px;background:#f8f7ff;color:#423765;padding:7px 10px;cursor:pointer;font:750 10px Inter,system-ui">'+esc(title)+'</button>').join('');
      tasks.addEventListener('click',event=>{
        const button=event.target.closest('[data-v120-tutor-task]');if(!button)return;
        const selected=options[Number(button.dataset.v120TutorTask)];if(!selected)return;
        const current=String(q.value||'').trim();
        q.value=selected[1]+current;
        q.dispatchEvent(new Event('input',{bubbles:true}));
        q.focus();
      });
      form.insertBefore(tasks,q);
    }
  }
  async function editTutorUser(index,node){
    const chat=currentTutor(),msg=chat.messages?.[index];if(!msg||msg.role!=='user')return;const oldText=String(msg.text||'');
    startInlineEdit(node,oldText,async next=>{await window.__SCHOLARK_V82_TUTOR_CLOUD_API__?.truncateFromUserText?.(oldText);updateTutor(x=>{x.messages=(x.messages||[]).slice(0,index)});syncTutorBackend();renderTutorChat();refreshTutorBar();const q=$('#v52-tutor-q');if(q){q.value=next;q.focus();$('#v52-tutor-send')?.click()}},()=>renderTutorChat(chat))
  }
  function decorateTutorUsers(){
    const chat=currentTutor(),rows=(chat.messages||[]).map((m,i)=>({m,i})).filter(x=>x.m.role==='user'),nodes=$$('#v52-chat .v52-msg.user').filter(n=>!n.dataset.v82MessageId);
    nodes.forEach((node,n)=>{const row=rows[n];if(!row||node.querySelector('.v120-user-actions'))return;node.dataset.v120TutorIndex=String(row.i);node.insertAdjacentHTML('beforeend','<div class="v120-user-actions"><button type="button" class="v120-edit-user" data-v120-copy-message="tutor:'+row.i+'" aria-label="Copy your AI Tutor message">Copy</button><button type="button" class="v120-edit-user" data-v120-edit-tutor="'+row.i+'">Edit</button></div>')})
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
    const plus=e.target.closest?.('[data-v120-attach-plus]');if(plus){const scope=plus.dataset.v120AttachPlus,menu=document.querySelector('[data-v120-attach-menu="'+scope+'"]'),open=!menu?.classList.contains('open');document.querySelectorAll('.v120-attach-menu.open').forEach(x=>x.classList.remove('open'));document.querySelectorAll('[data-v120-attach-plus]').forEach(x=>x.setAttribute('aria-expanded','false'));menu?.classList.toggle('open',open);plus.setAttribute('aria-expanded',open?'true':'false');return}
    const pick=e.target.closest?.('[data-v120-attach-pick]');if(pick){const [scope,kind]=String(pick.dataset.v120AttachPick||'').split(':'),root=attachmentRoot(scope),input=root?.querySelector?.('[data-v120-attach-input="'+scope+':'+kind+'"]');root?.querySelector?.('[data-v120-attach-menu="'+scope+'"]')?.classList.remove('open');root?.querySelector?.('[data-v120-attach-plus="'+scope+'"]')?.setAttribute('aria-expanded','false');input?.click();return}
    const remove=e.target.closest?.('[data-v120-attach-remove]');if(remove){const [scope,index]=String(remove.dataset.v120AttachRemove||'').split(':'),st=attachmentState[scope];if(st){st.items.splice(Number(index)||0,1);renderAttachmentTray(scope)}return}
    if(!e.target.closest?.('.v120-attach-wrap')){document.querySelectorAll('.v120-attach-menu.open').forEach(x=>x.classList.remove('open'));document.querySelectorAll('[data-v120-attach-plus]').forEach(x=>x.setAttribute('aria-expanded','false'))}
    const copying=e.target.closest?.('[data-v120-copy-message]');if(copying){
      const [scope,rawIndex]=String(copying.dataset.v120CopyMessage||'').split(':');
      const index=Number(rawIndex),messages=scope==='arki'?window.__SCHOLARK_V107_GENERAL_AI__?.getCurrent?.()?.messages:scope==='tutor'?currentTutor()?.messages:null;
      const msg=Number.isSafeInteger(index)&&index>=0?messages?.[index]:null;
      if(msg?.role==='user')void copyText(msg.content??msg.text);
      return;
    }
    const ea=e.target.closest?.('[data-v120-edit-arki]');if(ea){editArkiUser(Number(ea.dataset.v120EditArki),ea.closest('.v107-msg.user'));return}
    const et=e.target.closest?.('[data-v120-edit-tutor]');if(et){editTutorUser(Number(et.dataset.v120EditTutor),et.closest('.v52-msg.user'));return}
    const a=e.target.closest?.('[data-v120-do]');if(a){const host=a.closest('.v120-actions');if(!host)return;const scope=host.dataset.v120Scope;if(scope==='arki')arkiAction(host,a.dataset.v120Do);else tutorAction(host,a.dataset.v120Do);return}
    const m=e.target.closest?.('[data-v120-menu]');if(m){const host=m.closest('.v120-actions');if(host?.dataset.v120Scope==='arki')arkiMenu(host,m.dataset.v120Menu);else tutorMenu(host,m.dataset.v120Menu);return}
    if(e.target.closest?.('[data-v120-upgrade]')){location.hash='#pricing';return}
    if(e.target.closest?.('#v120-tutor-progress'))startTutorReview();
  },true);

  addEventListener('scholark:tutor-user',e=>{
    const prompt=clean(e.detail?.prompt),attachments=Array.isArray(e.detail?.attachments)?e.detail.attachments.slice(0,10):[];if(!prompt&&!attachments.length)return;updateTutor(x=>{if(!x.messages.length)x.title=(prompt||attachments[0]?.name||'Attached material').slice(0,48);const last=x.messages.at(-1);if(!(last?.role==='user'&&last.text===prompt))x.messages.push({role:'user',text:prompt,attachments,at:now()})});refreshTutorBar();setTimeout(decorateTutorUsers,0)
  });
  addEventListener('scholark:tutor-assistant',e=>{
    const text=multiline(e.detail?.answer),topic=clean(e.detail?.result?.topic)||clean(e.detail?.prompt).slice(0,80)||'General';if(!text)return;
    if(e.detail?.quota)applyQuota(e.detail.quota,'',0);
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
  const tutorHostSelector='#v51-sidebar [data-v51-tool="tutor"],#v51-main [data-v51-tool="tutor"],.v52-tool[data-v52-tool="tutor"] .v52-head,.v111-live,.v114-connect,#v120-tutorbar,#v52-tutor-send';
  const observer=new MutationObserver(m=>{
    for(const x of m){
      if(x.type==='characterData'){if(x.target?.parentElement?.closest?.(tutorHostSelector))observerNeedsTutor=true;continue}
      for(const a of x.addedNodes){
        if(a.nodeType!==1)continue;
        observerRoots.add(a);
        if(a.matches?.('#v107-ai,.v107-msg')||a.querySelector?.('#v107-ai,.v107-msg'))observerNeedsArki=true;
        if(a.matches?.('#v52-tutor-q,'+tutorHostSelector)||a.querySelector?.('#v52-tutor-q,'+tutorHostSelector))observerNeedsTutor=true
      }
    }
    if((observerNeedsArki||observerNeedsTutor||observerRoots.size)&&!observerQueued){observerQueued=true;requestAnimationFrame(flushObserver)}
  });
  observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});

  addEventListener('scholark:auth-changed',()=>{
    const next=accountOwner();if(tutorProfileOwner===next)return;
    tutorProfileOwner=next;
    // Invalidate ongoing file processing so a previous user's photo/document
    // cannot appear in a newly signed-in account after an async extraction.
    attachmentEpoch++;
    for(const scope of ['arki','tutor']){
      const st=attachmentState[scope];st.items=[];st.pending=0;renderAttachmentTray(scope);
      document.querySelectorAll('[data-v120-attach-menu="'+scope+'"]').forEach(menu=>menu.classList.remove('open'));
    }
    clearTimeout(quotaState.timer);quotaState.quota=null;quotaState.code='';quotaState.retryUntil=0;quotaState.lastLoaded=0;quotaState.loading=null;
    if($('#v120-tutorbar')){const chat=currentTutor();syncTutorBackend(chat);renderTutorChat(chat);refreshTutorBar()}
    for(const scope of ['arki','tutor'])applyQuotaScope(scope);
    refreshQuota(true);
  });
  addEventListener('scholark:arki-rendered',()=>{decorateArki();decorateArkiUsers();scrubProviderMarks($('#v107-thread')||document)});
  addEventListener('hashchange',()=>setTimeout(()=>{decorateArki();decorateArkiUsers();decorateTutor();decorateTutorUsers();applyTutorName(document);scrubProviderMarks(document)},60));
  addEventListener('scholark-tool-mounted',()=>setTimeout(()=>{decorateArki();decorateArkiUsers();decorateTutor();decorateTutorUsers();applyTutorName(document);scrubProviderMarks(document)},30));
  addEventListener('scholark:tutor-name-changed',()=>setTimeout(()=>applyTutorName(document),0));
  addEventListener('scholark-language-applied',()=>requestAnimationFrame(()=>applyTutorName(document)));
  addEventListener('scholark-language-ready',()=>requestAnimationFrame(()=>applyTutorName(document)));
  addEventListener('storage',e=>{if(e.key===TUTOR_NAME_KEY)requestAnimationFrame(()=>applyTutorName(document))});
  setTimeout(()=>{decorateArki();decorateArkiUsers();decorateTutor();decorateTutorUsers();applyTutorName(document);scrubProviderMarks(document)},180);

  window.__SCHOLARK_V120_EXPERIENCE__={health:()=>({ok:!!document.getElementById('scholark-v120-style'),arkiActions:true,enterToSend:true,tutorChats:true,tutorProgress:true,tutorNaming:true,messageEditing:true,attachments:true,attachmentLimit:ATTACHMENT_LIMIT,freeDailyQuotaUi:true,providerUiHidden:true}),reviewTutorTopic:startTutorReview,release:'r256-free-attachment-15'};
})();