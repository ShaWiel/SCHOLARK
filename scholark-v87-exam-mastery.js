(() => {
  if(window.__SCHOLARK_V87_EXAM_MASTERY__)return;
  window.__SCHOLARK_V87_EXAM_MASTERY__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim(),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let exam=null,marks=new Map(),saved=false;

  const css=document.createElement('style');css.id='scholark-v87-style';css.textContent=`
    .v87-grade{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:9px;padding-top:9px;border-top:1px solid rgba(23,25,31,.08)}.v87-grade span{font:800 7px Inter;color:#7d7783}.v87-grade button{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:9px;padding:7px 9px;font:850 7.5px Inter;cursor:pointer}.v87-grade button.good.active{background:#e6f7dc;border-color:#8ccf68;color:#315b21}.v87-grade button.bad.active{background:#fff0ee;border-color:#e7a79f;color:#813c34}
    .v87-summary{margin-top:12px;padding:15px;border-radius:16px;background:#17191f;color:#fff}.v87-summary b{font:950 20px Inter;color:#c9ff6a}.v87-summary p{margin:6px 0 0;font:650 8.5px/1.45 Inter;color:#cbc7d2}.v87-summary small{display:block;margin-top:7px;font:750 7px Inter;color:#9892a1}
  `;document.head.appendChild(css);

  async function ctx(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  function questions(){return exam?.result?.questions||[]}
  function grade(i,value){
    marks.set(i,value);const host=$$('.v62-question')[i];if(host)$$('[data-v87-grade]',host).forEach(b=>b.classList.toggle('active',b.dataset.v87Grade===value));
    updateSummary();
  }
  function decorate(){
    if(!exam)return;const qs=$$('.v62-question');qs.forEach((host,i)=>{
      if(host.querySelector('.v87-grade'))return;
      const bar=document.createElement('div');bar.className='v87-grade';bar.innerHTML='<span>After checking the answer:</span><button type="button" class="good" data-v87-grade="correct">I got it right</button><button type="button" class="bad" data-v87-grade="incorrect">Needs work</button>';
      host.appendChild(bar);$$('[data-v87-grade]',bar).forEach(b=>b.onclick=()=>grade(i,b.dataset.v87Grade));
    });
    let sum=$('#v87-summary');if(!sum){sum=document.createElement('div');sum.id='v87-summary';sum.className='v87-summary';const out=$('#v52-exam-out .v62-answer')||$('#v52-exam-out');out?.appendChild(sum)}
    updateSummary();
  }
  function updateSummary(){
    const sum=$('#v87-summary');if(!sum||!exam)return;const total=questions().length,done=marks.size,correct=[...marks.values()].filter(x=>x==='correct').length,score=done?Math.round(correct/done*100):0;
    if(done<total){sum.innerHTML='<b>'+done+' / '+total+'</b><p>Grade each question after revealing the answer. SCHOLARK will turn the completed result into real Progress + Mastery data.</p>';return}
    sum.innerHTML='<b>'+score+'%</b><p>'+correct+' correct · '+(total-correct)+' needs work. Your result is '+(cloud()?.currentSession?.()?.user?.id?'being saved to your account and connected to Mastery.':'ready locally. Sign in to save it to Progress and Mastery.')+'</p><small>'+esc(exam.name||'Practice exam')+'</small>';
    if(!saved){saved=true;persist(correct,total,score)}
  }
  function nextDue(mastery){const days=mastery<35?1:mastery<60?3:mastery<80?7:14,d=new Date();d.setDate(d.getDate()+days);return {days,due:d.toISOString()}}
  async function ensureMastery(x,subject,topic,correctAdd,totalAdd){
    const filter='subject=eq.'+encodeURIComponent(subject)+'&topic=eq.'+encodeURIComponent(topic);
    let r=await x.c.request('/rest/v1/mastery_topics?select=id,attempts,correct,incorrect,mastery,streak&'+filter+'&limit=1',{method:'GET'}),d=await r.json().catch(()=>[]);if(!r.ok)return null;
    let row=Array.isArray(d)?d[0]:d,attempts=(Number(row?.attempts)||0)+totalAdd,correct=(Number(row?.correct)||0)+correctAdd,incorrect=Math.max(0,attempts-correct),accuracy=attempts?correct/attempts:0,confidence=Math.min(1,attempts/8),mastery=Math.round(accuracy*100*(.55+.45*confidence)),streak=correctAdd===totalAdd?(Number(row?.streak)||0)+1:0,next=nextDue(mastery);
    if(row?.id){
      const up=await x.c.request('/rest/v1/mastery_topics?id=eq.'+encodeURIComponent(row.id)+'&select=id,subject,topic,attempts,correct,incorrect,mastery,streak,last_practiced_at,next_review_at',{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({attempts,correct,incorrect,mastery,streak,last_practiced_at:new Date().toISOString(),next_review_at:next.due,updated_at:new Date().toISOString()})});const u=await up.json().catch(()=>[]);if(up.ok)row=Array.isArray(u)?u[0]:u;
    }else{
      const ins=await x.c.request('/rest/v1/mastery_topics?select=id,subject,topic,attempts,correct,incorrect,mastery,streak,last_practiced_at,next_review_at',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({user_id:x.uid,subject,topic,attempts,correct,incorrect,mastery,streak,last_practiced_at:new Date().toISOString(),next_review_at:next.due})});const u=await ins.json().catch(()=>[]);if(ins.ok)row=Array.isArray(u)?u[0]:u;
    }
    if(row?.id){
      const rr=await x.c.request('/rest/v1/spaced_reviews?select=id&mastery_topic_id=eq.'+encodeURIComponent(row.id)+'&order=updated_at.desc&limit=1',{method:'GET'}),rd=await rr.json().catch(()=>[]),existing=Array.isArray(rd)?rd[0]:rd,payload={due_at:next.due,interval_days:next.days,ease:mastery>=80?2.7:mastery>=60?2.5:2.2,repetitions:attempts,last_result:mastery>=80?'strong':mastery>=60?'developing':'learning',updated_at:new Date().toISOString()};
      if(existing?.id)await x.c.request('/rest/v1/spaced_reviews?id=eq.'+encodeURIComponent(existing.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(payload)});
      else await x.c.request('/rest/v1/spaced_reviews',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({user_id:x.uid,mastery_topic_id:row.id,...payload})});
    }
    return row;
  }
  async function persist(correct,total,score){
    const x=await ctx();if(!x)return;const duration=Math.max(1,Math.round((Date.now()-(exam.startedAt||Date.now()))/1000)),qs=questions();
    try{
      await x.c.request('/rest/v1/quiz_results',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({user_id:x.uid,subject:clean(exam.name)||null,topic:clean((exam.topics||[]).join(', '))||null,mode:'practice',correct,incorrect:total-correct,score,duration_seconds:duration,details:{difficulty:exam.difficulty||'',provider:exam.provider||'',model:exam.model||'',questions:qs.map((q,i)=>({topic:q.topic||'',result:marks.get(i)||''}))}})});
      const groups=new Map();qs.forEach((q,i)=>{const topic=clean(q.topic)||clean(exam.topics?.[0])||'General';const g=groups.get(topic)||{total:0,correct:0};g.total++;if(marks.get(i)==='correct')g.correct++;groups.set(topic,g)});
      for(const [topic,g] of groups)await ensureMastery(x,clean(exam.name)||'Practice',topic,g.correct,g.total);
      window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.loadMastery?.(false);window.__SCHOLARK_V80_WORKSPACE_CLOUD_API__?.syncProgress?.();
      const sum=$('#v87-summary small');if(sum)sum.textContent=(sum.textContent||'')+' · saved to Progress + Mastery';
    }catch(e){const sum=$('#v87-summary small');if(sum)sum.textContent=(sum.textContent||'')+' · cloud save failed: '+clean(e?.message||e)}
  }
  addEventListener('scholark:exam-generated',e=>{exam=e.detail||null;marks=new Map();saved=false;setTimeout(decorate,30)});
  // Exam generation emits scholark:exam-generated, so a page-wide observer is unnecessary.
  document.addEventListener('click',e=>{if(exam&&e.target.closest?.('#v52-exam-out'))setTimeout(decorate,30)},true);
})();