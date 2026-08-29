(() => {
  if(window.__SCHOLARK_V88_LEARNING_ENGINE__)return;
  window.__SCHOLARK_V88_LEARNING_ENGINE__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim(),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  const level=()=>localStorage.getItem('scholark_learning_level')||'secondary',language=()=>{const code=localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'en';return window.__SCHOLARK_I18N__?.languageName?.(code)||code||'English'};

  const css=document.createElement('style');css.id='scholark-v88-style';css.textContent=`
    .v88-form{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:22px;padding:20px}.v88-form h3{font:950 18px Inter;margin:0 0 7px}.v88-form p{font:650 9px/1.5 Inter;color:#706c77}.v88-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.v88-form input,.v88-form select{width:100%;box-sizing:border-box;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:12px;padding:12px;font:650 10px Inter}.v88-btn{border:0;border-radius:11px;background:#17191f;color:#fff;padding:11px 13px;font:900 8.5px Inter;cursor:pointer;margin-top:9px}.v88-btn:disabled{opacity:.5}.v88-status{margin-top:9px;font:750 8px/1.45 Inter;color:#6358c8}.v88-queue{display:grid;gap:7px;margin-top:10px}.v88-review{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;background:#f6f5f2;border-radius:13px;padding:11px}.v88-review b{display:block;font:900 10px Inter}.v88-review span{display:block;margin-top:4px;font:700 7px/1.4 Inter;color:#777}.v88-review button{border:0;border-radius:9px;background:#17191f;color:#c9ff6a;padding:8px 9px;font:900 7px Inter;cursor:pointer}.v88-exam{margin-top:12px}.v88-empty{padding:16px;border:1px dashed rgba(23,25,31,.15);border-radius:13px;color:#777;font:700 8px/1.5 Inter}
    @media(max-width:650px){.v88-row{grid-template-columns:1fr}.v88-review{grid-template-columns:1fr}}
  `;document.head.appendChild(css);

  async function ctx(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  async function ai(payload){
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),90000);
    try{const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'exam',level:level(),language:language(),...payload}),signal:ctrl.signal});const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok||!d.result)throw new Error(d?.error||'Diagnostic generation failed');return d}finally{clearTimeout(timer)}
  }
  function examMarkup(data,detail){
    const r=data.result||{},host=$('#v52-edu-detail');if(!host)return;
    host.innerHTML='<div class="v88-form"><h3>'+esc(r.title||detail.name)+'</h3><p>'+esc(r.instructions||'Answer first, then reveal and grade yourself.')+'</p><div class="v88-exam">'+
      (r.questions||[]).map((q,i)=>'<div class="v62-question"><div class="v62-meta">Question '+(i+1)+' · '+esc(q.difficulty||'')+'</div><h4>'+esc(q.prompt)+'</h4>'+((q.choices||[]).map((x,j)=>'<span class="v62-choice">'+String.fromCharCode(65+j)+'. '+esc(x)+'</span>').join(''))+'<button class="v62-reveal" type="button">Show answer</button><div class="v62-solution"><b>Answer:</b> '+esc(q.answer)+'<br><b>Why:</b> '+esc(q.explanation||'')+'</div></div>').join('')+
      '<div class="v62-meta">'+esc(data.provider||'AI')+' · '+esc(data.model||'')+'</div></div></div>';
    $$('.v62-reveal',host).forEach(b=>b.onclick=()=>{const sol=b.nextElementSibling;sol?.classList.toggle('open');b.textContent=sol?.classList.contains('open')?'Hide answer':'Show answer'});
    window.dispatchEvent(new CustomEvent('scholark:exam-generated',{detail:{...detail,result:r,provider:data.provider||'',model:data.model||'',startedAt:Date.now()}}));
  }

  function diagnostic(){
    const host=$('#v52-edu-detail');if(!host)return;
    host.innerHTML='<div class="v88-form"><h3>Diagnostic Check</h3><p>Generate a short assessment to locate gaps. When you grade it, SCHOLARK sends the result into Progress, Mastery and the spaced-review schedule.</p><div class="v88-row"><input id="v88-subject" placeholder="Subject, e.g. Mathematics"><input id="v88-topics" placeholder="Topics, comma separated"></div><div class="v88-row"><select id="v88-count"><option value="8">8 questions</option><option value="12" selected>12 questions</option><option value="16">16 questions</option></select><select id="v88-diff"><option value="mixed">Mixed difficulty</option><option value="easy">Foundation</option><option value="medium">Intermediate</option><option value="hard">Challenge</option></select></div><button class="v88-btn" id="v88-run">Run diagnostic</button><div class="v88-status" id="v88-status"></div></div>';
    $('#v88-run').onclick=async()=>{const subject=clean($('#v88-subject').value),topics=clean($('#v88-topics').value).split(',').map(clean).filter(Boolean),btn=$('#v88-run'),st=$('#v88-status');if(!subject&&!topics.length){$('#v88-subject').focus();return}btn.disabled=true;st.textContent='Building a diagnostic at your current learning level…';try{const name=subject||topics[0]||'Diagnostic',data=await ai({prompt:'Create a diagnostic assessment that distinguishes secure knowledge from weak areas. Do not make every question the same type.',subject:name,topics:topics.length?topics:[name],count:Number($('#v88-count').value)||12,difficulty:$('#v88-diff').value||'mixed'});examMarkup(data,{name:'Diagnostic · '+name,topics:topics.length?topics:[name],difficulty:$('#v88-diff').value||'mixed'})}catch(e){st.textContent=clean(e?.message||e)}finally{btn.disabled=false}}
  }

  async function queue(){
    const host=$('#v52-edu-detail');if(!host)return;host.innerHTML='<div class="v88-form"><h3>Spaced Review Queue</h3><p>Topics become due based on your Mastery performance. Strong topics return later; weak topics return sooner.</p><button class="v88-btn" id="v88-refresh">Refresh queue</button><div class="v88-status" id="v88-status">Loading reviews…</div><div class="v88-queue" id="v88-queue"></div></div>';$('#v88-refresh').onclick=queue;
    const x=await ctx();if(!x){$('#v88-status').textContent='Sign in to use a cloud review schedule.';$('#v88-queue').innerHTML='<div class="v88-empty">Your local Mastery Map still works, but spaced review is synced to your SCHOLARK account.</div>';return}
    try{
      const due=encodeURIComponent(new Date().toISOString()),r=await x.c.request('/rest/v1/spaced_reviews?select=id,mastery_topic_id,due_at,interval_days,ease,repetitions,last_result&due_at=lte.'+due+'&order=due_at.asc&limit=30',{method:'GET'}),rows=await r.json().catch(()=>[]);if(!r.ok)throw new Error(rows?.message||'Could not load reviews');const list=Array.isArray(rows)?rows:[];if(!list.length){$('#v88-status').textContent='You are caught up.';$('#v88-queue').innerHTML='<div class="v88-empty">No reviews are due right now. SCHOLARK will bring topics back when the schedule says they need reinforcement.</div>';return}
      const ids=[...new Set(list.map(z=>z.mastery_topic_id).filter(Boolean))],map=new Map();
      if(ids.length){const mr=await x.c.request('/rest/v1/mastery_topics?select=id,subject,topic,mastery,attempts,correct,incorrect,next_review_at&id=in.('+ids.join(',')+')',{method:'GET'}),md=await mr.json().catch(()=>[]);if(mr.ok)(Array.isArray(md)?md:[]).forEach(m=>map.set(m.id,m))}
      $('#v88-status').textContent=list.length+' review'+(list.length===1?' is':'s are')+' due.';
      $('#v88-queue').innerHTML=list.map(z=>{const m=map.get(z.mastery_topic_id)||{},mastery=Math.round(Number(m.mastery)||0);return '<div class="v88-review"><div><b>'+esc(m.topic||'Review topic')+'</b><span>'+esc(m.subject||'General')+' · mastery '+mastery+'% · interval '+esc(z.interval_days||1)+' day(s) · '+esc(z.last_result||'due')+'</span></div><button type="button" data-v88-review="'+esc(z.mastery_topic_id||'')+'">Review now</button></div>'}).join('');
      $$('[data-v88-review]',host).forEach(b=>b.onclick=()=>reviewTopic(map.get(b.dataset.v88Review)));
    }catch(e){$('#v88-status').textContent=clean(e?.message||e)}
  }
  async function reviewTopic(m){
    if(!m)return;const host=$('#v52-edu-detail');host.innerHTML='<div class="v88-form"><h3>Review · '+esc(m.topic)+'</h3><div class="v88-status">Generating a focused retrieval check…</div></div>';
    try{const data=await ai({prompt:'Create a focused spaced-repetition review. Test retrieval and application, not recognition only.',subject:m.subject||'Review',topics:[m.topic],count:5,difficulty:Number(m.mastery)>=75?'hard':Number(m.mastery)>=45?'medium':'mixed'});examMarkup(data,{name:m.subject||'Review',topics:[m.topic],difficulty:'spaced_review'})}catch(e){host.innerHTML='<div class="v88-form"><h3>Could not start review</h3><div class="v88-status">'+esc(e?.message||e)+'</div></div>'}
  }

  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-edu="diagnostic"],[data-edu="review"]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(b.dataset.edu==='diagnostic')diagnostic();else queue()},true);
})();