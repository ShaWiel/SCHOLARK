(() => {
  if(window.__SCHOLARK_V82_TUTOR_CLOUD__) return;
  window.__SCHOLARK_V82_TUTOR_CLOUD__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  const ACTIVE='scholark_v82_tutor_chat';
  let chats=[],loading=false,activePromise=null;

  const css=document.createElement('style');css.id='scholark-v82-style';css.textContent=`
    .v82-tutor-layout{display:grid!important;grid-template-columns:235px minmax(0,1fr);gap:12px!important;padding:12px!important;background:transparent!important;border:0!important;box-shadow:none!important}
    .v82-history,.v82-chatbody{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:20px;padding:14px;box-shadow:0 16px 48px rgba(31,27,63,.04)}
    .v82-history{max-height:68vh;overflow:auto}.v82-history-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}.v82-history-head b{font:950 10px Inter}.v82-new{border:0;border-radius:9px;background:#17191f;color:#c9ff6a;padding:8px 9px;font:900 7.5px Inter;cursor:pointer}
    .v82-account{padding:8px;border-radius:10px;background:#f4f3f1;color:#77717e;font:700 7.5px/1.4 Inter;margin-bottom:8px}.v82-account button{border:0;background:transparent;color:#5f53d2;text-decoration:underline;font:850 7.5px Inter;cursor:pointer;padding:0}
    .v82-chatrow{position:relative;border-radius:11px;padding:9px 34px 9px 9px;margin:4px 0;background:#f7f6f3;cursor:pointer}.v82-chatrow.active{background:#ebe8ff}.v82-chatrow b{display:block;font:850 8px/1.3 Inter;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v82-chatrow small{font:700 6.7px Inter;color:#8c8792}.v82-more{position:absolute;right:5px;top:5px;border:0;background:transparent;font:950 14px Inter;cursor:pointer;color:#777}
    .v82-chatbody{min-width:0}.v82-chatbody #v52-tutor-q{min-height:110px}.v82-chatbody #v52-chat{max-height:46vh;overflow:auto;padding-right:4px}.v82-tools{display:flex;gap:6px;align-items:center;margin:8px 0 2px}.v82-tools span{margin-left:auto;font:750 7px Inter;color:#817b88}
    @media(max-width:760px){.v82-tutor-layout{grid-template-columns:1fr}.v82-history{max-height:190px}.v82-chatbody #v52-chat{max-height:none}}
  `;document.head.appendChild(css);

  function current(){return localStorage.getItem(ACTIVE)||''}
  function setCurrent(id){if(id)localStorage.setItem(ACTIVE,id);else localStorage.removeItem(ACTIVE)}
  async function ctx(){const c=cloud();const s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  async function api(path,opts={}){const x=await ctx();if(!x)throw Object.assign(new Error('AUTH_REQUIRED'),{code:'AUTH_REQUIRED'});const r=await x.c.request(path,opts);return {r,...x}}

  function freshChatUI(){
    const chat=$('#v52-chat');if(chat)chat.innerHTML='<div class="v52-msg ai">I’m ready. Ask a question, paste a problem, or tell me what subject you want explained.</div>';
    try{localStorage.setItem('scholark_v62_tutor_history','[]')}catch{}
  }
  function newChat(){setCurrent('');freshChatUI();renderHistory();$('#v52-tutor-q')?.focus()}

  async function loadChats(){
    if(loading)return;loading=true;
    try{
      const x=await ctx();if(!x){chats=[];renderHistory();return}
      const r=await x.c.request('/rest/v1/ai_chats?select=id,title,mode,created_at,updated_at&mode=eq.tutor&order=updated_at.desc&limit=60',{method:'GET'});
      const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d?.message||'Could not load chats');chats=Array.isArray(d)?d:[];
      const id=current();if(id&&!chats.some(c=>c.id===id))setCurrent('');
      renderHistory();
    }catch(e){console.warn('[SCHOLARK] Tutor chat history:',clean(e?.message||e))}finally{loading=false}
  }

  function renderHistory(){
    const aside=$('.v82-history');if(!aside)return;
    const signed=!!cloud()?.currentSession?.()?.user?.id,id=current();
    aside.innerHTML='<div class="v82-history-head"><b>CHAT HISTORY</b><button class="v82-new" type="button">+ New chat</button></div>'+
      (signed?'':'<div class="v82-account">Local chat mode. <button type="button">Sign in</button> to sync chat history across devices.</div>')+
      (signed?(chats.length?chats.map(c=>'<div class="v82-chatrow '+(c.id===id?'active':'')+'" data-v82-chat="'+esc(c.id)+'"><b>'+esc(c.title||'New chat')+'</b><small>'+esc(new Date(c.updated_at||c.created_at).toLocaleDateString())+'</small><button class="v82-more" type="button" data-v82-more="'+esc(c.id)+'">⋯</button></div>').join(''):'<div class="v82-account">No saved chats yet.</div>'):'');
    $('.v82-new',aside).onclick=newChat;
    $('.v82-account button',aside)?.addEventListener('click',()=>cloud()?.openAuth?.());
    $$('[data-v82-chat]',aside).forEach(row=>row.onclick=e=>{if(e.target.closest('[data-v82-more]'))return;openChat(row.dataset.v82Chat)});
    $$('[data-v82-more]',aside).forEach(b=>b.onclick=e=>{e.stopPropagation();chatMenu(b.dataset.v82More)});
  }

  async function chatMenu(id){
    const chat=chats.find(c=>c.id===id);if(!chat)return;
    const action=prompt('Type R to rename this chat or D to delete it.','R');
    if(!action)return;
    if(action.trim().toLowerCase().startsWith('d')){
      if(!confirm('Delete this Tutor chat and its messages?'))return;
      try{const x=await ctx();if(!x)return;const r=await x.c.request('/rest/v1/ai_chats?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{Prefer:'return=minimal'}});if(r.ok){if(current()===id)newChat();await loadChats()}}catch{}
      return;
    }
    const title=prompt('Rename chat',chat.title||'New chat');if(!clean(title))return;
    try{const x=await ctx();if(!x)return;const r=await x.c.request('/rest/v1/ai_chats?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({title:clean(title).slice(0,120),updated_at:new Date().toISOString()})});if(r.ok)await loadChats()}catch{}
  }

  async function openChat(id){
    try{
      const x=await ctx();if(!x)return;setCurrent(id);renderHistory();
      const r=await x.c.request('/rest/v1/ai_messages?select=id,role,content,meta,created_at&chat_id=eq.'+encodeURIComponent(id)+'&order=created_at.asc&limit=200',{method:'GET'});
      const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d?.message||'Could not load messages');
      const rows=Array.isArray(d)?d:[],chat=$('#v52-chat');if(chat){chat.innerHTML=rows.length?rows.map(m=>'<div class="v52-msg '+(m.role==='user'?'user':'ai')+'">'+esc(m.content).replace(/\n/g,'<br>')+'</div>').join(''):'<div class="v52-msg ai">This chat has no messages yet.</div>';chat.scrollTop=chat.scrollHeight}
      const hist=rows.filter(m=>m.role==='user'||m.role==='assistant').slice(-12).map(m=>({role:m.role,text:m.content}));localStorage.setItem('scholark_v62_tutor_history',JSON.stringify(hist));
    }catch(e){console.warn('[SCHOLARK] Open Tutor chat:',clean(e?.message||e))}
  }

  async function ensureActive(promptText=''){
    const existing=current();if(existing&&chats.some(c=>c.id===existing))return existing;
    if(activePromise)return activePromise;
    activePromise=(async()=>{
      const x=await ctx();if(!x)return '';
      const title=clean(promptText).slice(0,72)||'New chat';
      const r=await x.c.request('/rest/v1/ai_chats?select=id,title,mode,created_at,updated_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({user_id:x.uid,title,mode:'tutor',updated_at:new Date().toISOString()})});
      const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d?.message||'Could not create chat');const row=(Array.isArray(d)?d[0]:d);if(!row?.id)return '';
      chats.unshift(row);setCurrent(row.id);renderHistory();return row.id;
    })();
    try{return await activePromise}finally{activePromise=null}
  }
  async function saveMessage(role,content,meta={}){
    const text=clean(content);if(!text)return;
    try{
      const x=await ctx();if(!x)return;
      const id=await ensureActive(role==='user'?text:'');if(!id)return;
      const r=await x.c.request('/rest/v1/ai_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({chat_id:id,user_id:x.uid,role,content:text.slice(0,24000),meta})});
      if(!r.ok)return;
      await x.c.request('/rest/v1/ai_chats?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({updated_at:new Date().toISOString()})});
      setTimeout(loadChats,120);
    }catch(e){console.warn('[SCHOLARK] Save Tutor message:',clean(e?.message||e))}
  }

  addEventListener('scholark:tutor-user',e=>saveMessage('user',e.detail?.prompt||''));
  addEventListener('scholark:tutor-assistant',e=>saveMessage('assistant',e.detail?.answer||'',{provider:e.detail?.provider||'',model:e.detail?.model||'',topic:e.detail?.result?.topic||''}));

  function enhance(){
    const q=$('#v52-tutor-q');if(!q)return;const form=q.closest('.v52-form');if(!form||form.dataset.v82)return;form.dataset.v82='1';form.classList.add('v82-tutor-layout');
    const children=[...form.children],aside=document.createElement('aside'),body=document.createElement('section');aside.className='v82-history';body.className='v82-chatbody';
    children.forEach(x=>body.appendChild(x));form.append(aside,body);
    const tools=document.createElement('div');tools.className='v82-tools';tools.innerHTML='<button class="v82-new" type="button">+ New chat</button><span>Ctrl/Cmd + Enter to send</span>';body.insertBefore(tools,$('#v52-tutor-q',body));
    $('.v82-new',tools).onclick=newChat;renderHistory();loadChats();
  }
  const obs=new MutationObserver(()=>{clearTimeout(window.__v82sync);window.__v82sync=setTimeout(enhance,90)});obs.observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('focus',()=>{enhance();loadChats()});setTimeout(enhance,250);
})();