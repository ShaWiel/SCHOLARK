(() => {
  if (window.__SCHOLARK_V106_POWER_TOOLS__) return;
  window.__SCHOLARK_V106_POWER_TOOLS__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nowIso=()=>new Date().toISOString();
  const day=ms=>new Date(ms).toISOString().slice(0,10);
  const today=()=>day(Date.now());
  const uid=p=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);
  const read=(k,d=[])=>{try{const x=JSON.parse(localStorage.getItem(k)||'null');return x??d}catch{return d}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
  const PLAN_KEY='scholark_v51_planner';
  const FOCUS_KEY='scholark_v106_focus';
  const FOCUS_HISTORY='scholark_v106_focus_history';
  const CARD_KEY='scholark_v106_flashcards';
  const ASSIGN_KEY='scholark_v106_assignments';
  let focusTicker=null;

  const style=document.createElement('style');
  style.id='scholark-v106-style';
  style.textContent=`
    .v106{max-width:1220px;margin:0 auto;padding:34px;font-family:Inter,system-ui;color:#17191f}.v106-kicker{font:950 8px Inter;letter-spacing:.15em;color:#6d5dfc}.v106 h1{font:950 clamp(36px,5vw,58px)/.95 Inter;letter-spacing:-.05em;margin:8px 0 9px}.v106>p{font:600 11px/1.55 Inter;color:#716d78;max-width:820px;margin:0 0 18px}.v106-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.v106-card{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:22px;padding:18px;box-shadow:0 14px 45px rgba(31,27,63,.04)}.v106-card h2,.v106-card h3{margin:0 0 7px;font:950 17px/1.1 Inter}.v106-card p{font:600 9px/1.5 Inter;color:#74707b}.v106-form{display:grid;gap:8px}.v106-form input,.v106-form textarea,.v106-form select{width:100%;box-sizing:border-box;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:12px;padding:11px 12px;font:650 9px Inter;color:#17191f}.v106-form textarea{min-height:92px;resize:vertical}.v106-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.v106-row3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.v106-btn{border:0;border-radius:11px;background:#17191f;color:#fff;padding:11px 12px;font:900 8px Inter;cursor:pointer}.v106-btn.alt{background:#ece9ff;color:#5547ca}.v106-btn.lime{background:#c9ff6a;color:#17191f}.v106-btn:disabled{opacity:.5;cursor:not-allowed}.v106-list{display:grid;gap:8px;margin-top:10px}.v106-item{background:#f7f6f3;border:1px solid rgba(23,25,31,.06);border-radius:15px;padding:12px}.v106-item b{font:900 10px/1.35 Inter}.v106-meta{display:flex;gap:5px;flex-wrap:wrap;margin-top:6px}.v106-badge{display:inline-flex;border-radius:999px;background:#eceaf4;color:#5a5266;padding:4px 6px;font:850 7px Inter}.v106-badge.warn{background:#ffe8e5;color:#8d3b32}.v106-badge.ok{background:#e8f6dd;color:#446c31}.v106-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.v106-actions button{border:0;border-radius:9px;background:#eceaf4;color:#4e465c;padding:7px 8px;font:850 7px Inter;cursor:pointer}.v106-actions button.primary{background:#17191f;color:#c9ff6a}.v106-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:12px 0}.v106-stat{border-radius:14px;background:#f7f6f3;padding:12px}.v106-stat b{display:block;font:950 22px Inter}.v106-stat span{display:block;margin-top:3px;font:750 7px/1.4 Inter;color:#797481}.v106-focus-wrap{display:grid;grid-template-columns:1.1fr .9fr;gap:12px}.v106-timer{display:grid;place-items:center;min-height:275px;border-radius:24px;background:linear-gradient(145deg,#17191f,#30275d);color:#fff;text-align:center;padding:18px}.v106-timer time{display:block;font:950 clamp(54px,8vw,92px)/1 Inter;letter-spacing:-.06em}.v106-timer small{display:block;margin-top:8px;color:#c9ff6a;font:900 8px Inter;letter-spacing:.12em}.v106-duration{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.v106-duration button{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:999px;padding:8px 10px;font:850 8px Inter;cursor:pointer}.v106-duration button.active{background:#17191f;color:#c9ff6a}.v106-flash-stage{min-height:250px;display:grid;place-items:center;text-align:center;border-radius:20px;background:linear-gradient(135deg,#f6f4ff,#fff);border:1px solid #e7e2ff;padding:24px;cursor:pointer}.v106-flash-stage b{font:950 24px/1.15 Inter}.v106-flash-stage p{font:650 10px/1.5 Inter;color:#6e6878}.v106-rating{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}.v106-rating button{border:0;border-radius:10px;padding:10px 5px;font:850 7px Inter;cursor:pointer}.v106-rating button:nth-child(1){background:#ffe8e5}.v106-rating button:nth-child(2){background:#fff1d2}.v106-rating button:nth-child(3){background:#e8f6dd}.v106-rating button:nth-child(4){background:#e7efff}.v106-hidden{display:none!important}.v106-check{display:flex;gap:7px;align-items:flex-start;font:750 8px/1.4 Inter;color:#5d5863}.v106-check input{width:auto;margin-top:1px}.v106-empty{padding:14px;border-radius:13px;background:#f7f6f3;font:700 8px/1.5 Inter;color:#77717d}.v106-due{font:900 8px Inter;color:#8d3b32}.v106-assignment-title{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.v106-assignment-title strong{font:950 12px/1.25 Inter}.v106-progress{height:7px;background:#e9e7e2;border-radius:99px;overflow:hidden;margin-top:9px}.v106-progress i{display:block;height:100%;background:#6d5dfc;border-radius:inherit}.v106-progress-row{display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px}.v106-inline{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.v106-inline input[type="range"]{flex:1;min-width:140px}.v106-section-title{margin:18px 0 8px;font:950 11px Inter}.v106-link{border:0;background:none;color:#5d4ed3;padding:0;font:900 8px Inter;cursor:pointer}
    @media(max-width:850px){.v106-grid,.v106-focus-wrap{grid-template-columns:1fr}.v106-row,.v106-row3{grid-template-columns:1fr}.v106-stat-grid{grid-template-columns:1fr 1fr}.v106{padding:24px 14px}.v106-rating{grid-template-columns:1fr 1fr}}
  `;
  document.head.appendChild(style);

  function mount(){
    const host=$('#v51-fallback');if(!host)return null;
    host.innerHTML='<div class="v106" id="v106-root"></div>';
    return $('#v106-root');
  }
  function openTutor(prompt,assignmentId=''){
    try{sessionStorage.setItem('scholark_v106_pending_tutor',prompt);if(assignmentId)sessionStorage.setItem('scholark_v62_assignment_id',assignmentId)}catch{}
    window.__SCHOLARK_WORKSPACE__?.openTool?.('tutor');
    let tries=0;const timer=setInterval(()=>{tries++;const q=$('#v52-tutor-q');if(q){q.value=prompt;q.focus();clearInterval(timer)}else if(tries>=20)clearInterval(timer)},80);
  }
  function plannerObjects(){
    const raw=read(PLAN_KEY,[]);
    return raw.map((x,i)=>typeof x==='string'?{id:'legacy-'+i,text:x,status:'todo',date:'',time:'',type:'task',priority:'medium'}:{...x,id:x.id||'plan-'+i,text:x.text||x.title||'',status:x.status||'todo'});
  }
  function savePlanner(rows){write(PLAN_KEY,rows)}
  function daysUntil(date){
    if(!date)return null;
    const a=new Date(today()+'T00:00:00'),b=new Date(date+'T00:00:00');const d=Math.ceil((b-a)/86400000);
    return Number.isFinite(d)?d:null;
  }

  // ---------- Focus Sessions ----------
  function focusState(){
    const x=read(FOCUS_KEY,{});
    return {task:x.task||'',duration:Number(x.duration)||25,running:!!x.running,endAt:Number(x.endAt)||0,remaining:Number(x.remaining)||0,linkedPlannerId:x.linkedPlannerId||'',autoComplete:!!x.autoComplete,startedAt:Number(x.startedAt)||0};
  }
  function saveFocus(x){write(FOCUS_KEY,x)}
  function focusRemaining(x=focusState()){
    if(x.running&&x.endAt)return Math.max(0,x.endAt-Date.now());
    if(x.remaining>0)return x.remaining;
    return x.duration*60000;
  }
  function fmt(ms){
    const sec=Math.max(0,Math.ceil(ms/1000)),m=Math.floor(sec/60),s=sec%60;
    return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }
  function focusHistory(){return read(FOCUS_HISTORY,[])}
  function finishFocus(x){
    const elapsed=Math.max(1,Math.round((x.duration*60000)/60000));
    const h=focusHistory();h.push({id:uid('focus'),task:x.task||'Focus session',minutes:elapsed,startedAt:x.startedAt||Date.now()-x.duration*60000,endedAt:Date.now(),date:today()});write(FOCUS_HISTORY,h.slice(-250));
    let plannerCompleted=false;
    if(x.autoComplete&&x.linkedPlannerId){
      const api=window.__SCHOLARK_WORKSPACE_CORE__,updated=api?.actions?.completePlan?.(x.linkedPlannerId,true);
      if(updated)plannerCompleted=true;
      else{const p=plannerObjects(),row=p.find(z=>z.id===x.linkedPlannerId);if(row){row.status='done';row.completedAt=nowIso();savePlanner(p);plannerCompleted=true;window.dispatchEvent(new CustomEvent('scholark:workspace-cloud-refresh',{detail:{kind:'planner',source:'focus-r175'}}))}}
    }
    saveFocus({...x,running:false,endAt:0,remaining:0,startedAt:0});
    window.dispatchEvent(new CustomEvent('scholark:focus-complete',{detail:{task:x.task||'',minutes:elapsed,linkedPlannerId:x.linkedPlannerId||'',plannerCompleted}}));
  }
  function syncFocusView(){
    const x=focusState(),remaining=focusRemaining(x);
    if(x.running&&remaining<=0){
      finishFocus(x);
      const root=$('#v106-root');if(root?.dataset.tool==='focus')renderFocus();
      else{clearInterval(focusTicker);focusTicker=null}
      return
    }
    const root=$('#v106-root');if(!root||root.dataset.tool!=='focus')return;
    const timer=$('#v106-focus-time');if(timer)timer.textContent=fmt(remaining);
    const status=$('#v106-focus-status');if(status)status.textContent=x.running?'FOCUSING NOW':remaining<x.duration*60000?'PAUSED':'READY';
    const main=$('#v106-focus-main');if(main)main.textContent=x.running?'Pause':remaining<x.duration*60000?'Resume':'Start focus';
  }
  function startFocus(){
    const task=$('#v106-focus-task')?.value.trim()||'Focus session',duration=Number($('#v106-focus-duration')?.dataset.value)||25,linkedPlannerId=$('#v106-focus-link')?.value||'',autoComplete=!!$('#v106-focus-auto')?.checked;
    let x=focusState();const current=focusRemaining(x);
    if(x.running){x.running=false;x.remaining=current;x.endAt=0;saveFocus(x);syncFocusView();return}
    const remaining=x.remaining>0&&x.task===task?x.remaining:duration*60000;
    x={task,duration,running:true,endAt:Date.now()+remaining,remaining:0,linkedPlannerId,autoComplete,startedAt:x.startedAt||Date.now()};saveFocus(x);syncFocusView();
    clearInterval(focusTicker);focusTicker=setInterval(syncFocusView,1000);
  }
  function resetFocus(){
    const duration=Number($('#v106-focus-duration')?.dataset.value)||25,task=$('#v106-focus-task')?.value.trim()||'';
    saveFocus({task,duration,running:false,endAt:0,remaining:0,linkedPlannerId:$('#v106-focus-link')?.value||'',autoComplete:!!$('#v106-focus-auto')?.checked,startedAt:0});syncFocusView();
  }
  function renderFocus(){
    clearInterval(focusTicker);focusTicker=null;
    const root=mount();if(!root)return;root.dataset.tool='focus';
    const x=focusState(),hist=focusHistory(),todayRows=hist.filter(z=>z.date===today()),minutes=todayRows.reduce((n,z)=>n+(Number(z.minutes)||0),0),weekStart=Date.now()-6*86400000,week=hist.filter(z=>Number(z.endedAt)>=weekStart),planner=plannerObjects().filter(z=>z.status!=='done');
    root.innerHTML=`<div class="v106-kicker">SCHOLARK · FOCUS SESSIONS</div><h1>Turn a plan into focused work.</h1><p>Run distraction-light study blocks, connect them to Planner tasks and keep a simple record of how much focused work you actually complete.</p><div class="v106-stat-grid"><div class="v106-stat"><b>${minutes}</b><span>Focus minutes today</span></div><div class="v106-stat"><b>${todayRows.length}</b><span>Sessions today</span></div><div class="v106-stat"><b>${week.length}</b><span>Sessions in 7 days</span></div><div class="v106-stat"><b>${hist.reduce((n,z)=>n+(Number(z.minutes)||0),0)}</b><span>Total focus minutes</span></div></div><div class="v106-focus-wrap"><div class="v106-timer"><div><small id="v106-focus-status">READY</small><time id="v106-focus-time">${fmt(focusRemaining(x))}</time><div data-v106-user="1" style="font:750 9px Inter;color:#cbc7d4;margin-top:9px">${esc(x.task||'Choose one task and start')}</div></div></div><div class="v106-card"><h2>Session setup</h2><div class="v106-form"><input id="v106-focus-task" placeholder="What will you focus on?" value="${esc(x.task)}"><div class="v106-duration" id="v106-focus-duration" data-value="${x.duration}">${[15,25,45,60,90].map(n=>`<button type="button" data-min="${n}" class="${n===x.duration?'active':''}">${n} min</button>`).join('')}</div><input id="v106-focus-custom" type="number" min="5" max="240" step="5" placeholder="Custom minutes (5–240)"><select id="v106-focus-link"><option value="">No Planner task linked</option>${planner.map(p=>`<option data-v106-user="1" value="${esc(p.id)}" ${p.id===x.linkedPlannerId?'selected':''}>${esc(p.text)}</option>`).join('')}</select><label class="v106-check"><input id="v106-focus-auto" type="checkbox" ${x.autoComplete?'checked':''}> Mark the linked Planner task complete when this focus session finishes.</label><div class="v106-row"><button class="v106-btn lime" id="v106-focus-main">${x.running?'Pause':focusRemaining(x)<x.duration*60000?'Resume':'Start focus'}</button><button class="v106-btn alt" id="v106-focus-reset">Reset</button></div></div></div></div><div class="v106-section-title">Recent focus sessions</div><div class="v106-list">${hist.slice(-8).reverse().map(z=>`<div class="v106-item"><b data-v106-user="1">${esc(z.task||'Focus session')}</b><div class="v106-meta"><span class="v106-badge">${z.minutes} min</span><span class="v106-badge">${esc(z.date||'')}</span></div></div>`).join('')||'<div class="v106-empty">No completed focus sessions yet.</div>'}</div>`;
    document.querySelectorAll('#v106-focus-duration [data-min]').forEach(b=>b.onclick=()=>{const host=$('#v106-focus-duration');host.dataset.value=b.dataset.min;host.querySelectorAll('[data-min]').forEach(x=>x.classList.toggle('active',x===b));const cur=focusState();if(!cur.running){cur.duration=Number(b.dataset.min);cur.remaining=0;saveFocus(cur);syncFocusView()}});
    $('#v106-focus-custom').onchange=()=>{const n=Math.max(5,Math.min(240,Number($('#v106-focus-custom').value)||25)),host=$('#v106-focus-duration');host.dataset.value=String(n);host.querySelectorAll('[data-min]').forEach(x=>x.classList.remove('active'));const cur=focusState();if(!cur.running){cur.duration=n;cur.remaining=0;saveFocus(cur);syncFocusView()}};
    $('#v106-focus-main').onclick=startFocus;$('#v106-focus-reset').onclick=resetFocus;
    if(x.running)focusTicker=setInterval(syncFocusView,1000);
    syncFocusView();
  }

  // ---------- Flashcards ----------
  function cards(){return read(CARD_KEY,[]).map(x=>({...x,id:x.id||uid('card'),deck:x.deck||'General',front:x.front||'',back:x.back||'',dueAt:Number(x.dueAt)||0,interval:Number(x.interval)||0,reps:Number(x.reps)||0,ease:Number(x.ease)||2.5,lapses:Number(x.lapses)||0}))}
  function saveCards(a){write(CARD_KEY,a)}
  function dueCards(deck='all'){
    const now=Date.now();return cards().filter(c=>(deck==='all'||c.deck===deck)&&(!c.dueAt||c.dueAt<=now)).sort((a,b)=>(a.dueAt||0)-(b.dueAt||0));
  }
  function nextInterval(card,rating){
    const reps=Number(card.reps)||0,days=Math.max(0,Number(card.interval)||0),ease=Number(card.ease)||2.5;
    if(reps===0){
      if(rating==='again')return{ms:60000,label:'1m',days:0};
      if(rating==='hard')return{ms:6*60000,label:'6m',days:0};
      if(rating==='good')return{ms:2*86400000,label:'2d',days:2};
      return{ms:5*86400000,label:'5d',days:5};
    }
    if(rating==='again')return{ms:10*60000,label:'10m',days:0};
    if(rating==='hard'){const d=Math.max(1,Math.round(Math.max(1,days)*1.2));return{ms:d*86400000,label:d+'d',days:d}}
    if(rating==='good'){const d=Math.max(2,Math.round(Math.max(1,days)*ease));return{ms:d*86400000,label:d+'d',days:d}}
    const d=Math.max(5,Math.round(Math.max(2,days)*(ease+.15)));return{ms:d*86400000,label:d+'d',days:d};
  }
  function scheduleCard(card,rating){
    const now=Date.now(),next=nextInterval(card,rating);card.reps=(Number(card.reps)||0)+1;
    if(rating==='again'){card.lapses=(Number(card.lapses)||0)+1;card.ease=Math.max(1.3,(card.ease||2.5)-.2)}
    if(rating==='hard')card.ease=Math.max(1.3,(card.ease||2.5)-.08);
    if(rating==='easy')card.ease=Math.min(3.2,(card.ease||2.5)+.12);
    card.interval=next.days;card.dueAt=now+next.ms;card.lastRating=rating;card.lastReviewedAt=now;
    window.__SCHOLARK_WORKSPACE_CORE__?.record?.('flashcards','reviewed',{id:card.id,deck:card.deck,rating,next:next.label});
    return card;
  }
  function renderFlashcards(){
    const root=mount();if(!root)return;root.dataset.tool='flashcards';
    const all=cards(),decks=[...new Set(all.map(c=>c.deck).filter(Boolean))].sort(),due=dueCards();
    root.innerHTML=`<div class="v106-kicker">SCHOLARK · FLASHCARDS</div><h1>Build recall, not just familiarity.</h1><p>Create decks, import cards quickly and review only what is due. Ratings change when each card comes back so strong cards appear less often and weak cards return sooner.</p><div class="v106-stat-grid"><div class="v106-stat"><b>${all.length}</b><span>Total cards</span></div><div class="v106-stat"><b>${decks.length}</b><span>Decks</span></div><div class="v106-stat"><b>${due.length}</b><span>Due now</span></div><div class="v106-stat"><b>${all.filter(c=>c.reps>0).length}</b><span>Cards reviewed</span></div></div><div class="v106-grid"><div class="v106-card"><h2>Add cards</h2><div class="v106-form"><input id="v106-card-deck" placeholder="Deck name" value="General"><input id="v106-card-front" placeholder="Question / front"><textarea id="v106-card-back" placeholder="Answer / back"></textarea><button class="v106-btn" id="v106-card-add">Add flashcard</button><details><summary style="font:850 8px Inter;cursor:pointer">Import multiple cards</summary><textarea id="v106-card-import" placeholder="One card per line: Question :: Answer"></textarea><button class="v106-btn alt" id="v106-card-import-btn">Import cards</button></details></div></div><div class="v106-card"><h2>Study due cards</h2><div class="v106-form"><select id="v106-deck-filter"><option value="all">All decks</option>${decks.map(d=>`<option data-v106-user="1" value="${esc(d)}">${esc(d)}</option>`).join('')}</select><div class="v106-row"><button class="v106-btn lime" id="v106-study-start">Start due review (${due.length})</button><button class="v106-btn alt" id="v106-card-export">Export cards</button></div><label class="v106-check"><input id="v106-card-shuffle" type="checkbox"> Shuffle due cards before review.</label><div id="v106-study-zone" class="v106-empty">Choose a deck and start a review session.</div></div></div></div><div class="v106-section-title">Your flashcards</div><div class="v106-list" id="v106-card-list"></div>`;
    const drawList=()=>{const a=cards();$('#v106-card-list').innerHTML=a.length?a.slice().sort((x,y)=>x.deck.localeCompare(y.deck)||x.front.localeCompare(y.front)).map(c=>`<div class="v106-item"><b data-v106-user="1">${esc(c.front)}</b><p data-v106-user="1" style="margin:5px 0 0;font:650 8px/1.45 Inter;color:#716c78">${esc(c.back)}</p><div class="v106-meta"><span class="v106-badge" data-v106-user="1">${esc(c.deck)}</span><span class="v106-badge">${c.reps?c.interval+' day interval':'New'}</span><span class="v106-badge ${!c.dueAt||c.dueAt<=Date.now()?'warn':'ok'}">${!c.dueAt||c.dueAt<=Date.now()?'Due now':'Due '+day(c.dueAt)}</span></div><div class="v106-actions"><button data-card-tutor="${esc(c.id)}">Practice with AI Tutor</button><button data-card-del="${esc(c.id)}">Delete</button></div></div>`).join(''):'<div class="v106-empty">No flashcards yet. Add your first card above.</div>';
      $$('[data-card-del]',$('#v106-card-list')).forEach(b=>b.onclick=()=>{saveCards(cards().filter(c=>c.id!==b.dataset.cardDel));renderFlashcards()});
      $$('[data-card-tutor]',$('#v106-card-list')).forEach(b=>b.onclick=()=>{const c=cards().find(x=>x.id===b.dataset.cardTutor);if(c)openTutor('Quiz me on this flashcard without revealing the answer first: '+c.front+'. After I answer, compare it with: '+c.back)});
    };
    $('#v106-card-add').onclick=()=>{const front=$('#v106-card-front').value.trim(),back=$('#v106-card-back').value.trim(),deck=$('#v106-card-deck').value.trim()||'General';if(!front||!back)return;const a=cards();a.push({id:uid('card'),deck,front,back,dueAt:0,interval:0,reps:0,ease:2.5,lapses:0,createdAt:nowIso()});saveCards(a);$('#v106-card-front').value='';$('#v106-card-back').value='';renderFlashcards()};
    $('#v106-card-import-btn').onclick=()=>{const deck=$('#v106-card-deck').value.trim()||'General',lines=String($('#v106-card-import').value||'').split(/\n+/),a=cards();let n=0;for(const line of lines){const i=line.indexOf('::');if(i<1)continue;const front=line.slice(0,i).trim(),back=line.slice(i+2).trim();if(!front||!back)continue;a.push({id:uid('card'),deck,front,back,dueAt:0,interval:0,reps:0,ease:2.5,lapses:0,createdAt:nowIso()});n++}if(n){saveCards(a);renderFlashcards()}};
    $('#v106-card-export').onclick=()=>{const blob=new Blob([JSON.stringify(cards(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='scholark-flashcards.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),800)};
    $('#v106-study-start').onclick=()=>startCardReview($('#v106-deck-filter').value,!!$('#v106-card-shuffle')?.checked);
    drawList();
  }
  function startCardReview(deck,shuffle=false){
    const zone=$('#v106-study-zone');if(!zone)return;
    let queue=dueCards(deck),index=0,revealed=false;
    if(shuffle)queue=queue.map(x=>({x,r:Math.random()})).sort((a,b)=>a.r-b.r).map(o=>o.x);
    const draw=()=>{
      if(index>=queue.length){zone.className='v106-empty';zone.innerHTML='<b>Review complete.</b><br>You cleared all due cards in this session.';return}
      const c=queue[index];revealed=false;zone.className='';zone.innerHTML=`<div class="v106-flash-stage" id="v106-flip"><div><small data-v106-user="1" style="font:900 7px Inter;color:#6d5dfc">${esc(c.deck)} · ${index+1}/${queue.length}</small><b data-v106-user="1" id="v106-flash-main">${esc(c.front)}</b><p id="v106-flash-hint">Click to reveal answer</p></div></div><div class="v106-rating v106-hidden" id="v106-ratings"><button data-rate="again">Again <small>${nextInterval(c,'again').label}</small></button><button data-rate="hard">Hard <small>${nextInterval(c,'hard').label}</small></button><button data-rate="good">Good <small>${nextInterval(c,'good').label}</small></button><button data-rate="easy">Easy <small>${nextInterval(c,'easy').label}</small></button></div><div class="v106-actions"><button id="v106-flash-tutor">Ask AI Tutor about this</button></div>`;
      $('#v106-flip').onclick=()=>{if(revealed)return;revealed=true;$('#v106-flash-main').textContent=c.back;$('#v106-flash-hint').textContent='Rate how well you remembered it';$('#v106-ratings').classList.remove('v106-hidden')};
      $$('[data-rate]',$('#v106-ratings')).forEach(b=>b.onclick=()=>{const a=cards(),row=a.find(x=>x.id===c.id);if(row)scheduleCard(row,b.dataset.rate);saveCards(a);index++;draw()});
      $('#v106-flash-tutor').onclick=()=>openTutor('Teach me this flashcard concept and then test me: '+c.front+' — answer reference: '+c.back);
    };draw();
  }

  // ---------- Assignments ----------
  function assignments(){return read(ASSIGN_KEY,[]).map(x=>{const progress=Math.max(0,Math.min(100,Number(x.progress)||0));return {...x,id:x.id||uid('assign'),title:x.title||'',subject:x.subject||'',dueDate:x.dueDate||'',type:x.type||'assignment',priority:x.priority||'medium',instructions:x.instructions||'',status:x.status==='complete'||progress>=100?'complete':'active',progress,createdAt:x.createdAt||nowIso()}})}
  function saveAssignments(a){write(ASSIGN_KEY,a)}
  function planAssignment(a){
    const rows=plannerObjects(),existing=new Set(rows.map(x=>x.id)),due=a.dueDate?new Date(a.dueDate+'T18:00:00').getTime():Date.now()+7*86400000,start=Date.now(),span=Math.max(86400000,due-start),api=window.__SCHOLARK_WORKSPACE_CORE__;
    const steps=[
      ['Understand the brief and define the required outcome',0.03,'high',25],
      ['Research / collect sources and examples',0.18,'high',45],
      ['Create the first draft or solve the main problems',0.48,'high',60],
      ['Review, test and improve the work',0.76,'medium',45],
      ['Final check and submit',0.94,'high',25]
    ];
    let added=0;
    steps.forEach((s,i)=>{const id='assignment-'+a.id+'-'+i;if(existing.has(id))return;const row={id,text:s[0]+' · '+a.title,type:'task',subject:a.subject||a.title,date:day(Math.min(due,start+span*s[1])),time:'',duration:s[3],priority:s[2],goalId:'',sourceKey:'assignment:'+a.id+':'+i,status:'todo',createdAt:nowIso()};if(api?.actions?.addPlan)api.actions.addPlan(row);else rows.push(row);existing.add(id);added++});
    if(!api?.actions?.addPlan&&added){savePlanner(rows);window.dispatchEvent(new CustomEvent('scholark:workspace-cloud-refresh',{detail:{kind:'planner',source:'assignment-r175'}}))}
    return added;
  }
  function assignmentTutor(a){
    openTutor('Tell me exactly what I should do next for this assignment. Use its deadline, progress, subject, type and saved requirements. Explain the task simply, prioritise the work, break it into concrete steps, recommend the best study/work method, and tell me what I should do first today.',a.id);
  }
  function renderAssignments(){
    const root=mount();if(!root)return;root.dataset.tool='assignments';
    const all=assignments(),active=all.filter(a=>a.status!=='complete'),soon=active.filter(a=>{const d=daysUntil(a.dueDate);return d!=null&&d>=0&&d<=7}),overdue=active.filter(a=>{const d=daysUntil(a.dueDate);return d!=null&&d<0});
    root.innerHTML=`<div class="v106-kicker">SCHOLARK · ASSIGNMENTS</div><h1>Turn assignments into a workable plan.</h1><p>Track briefs and deadlines, break an assignment into Planner steps, monitor progress and send the full context to AI Tutor when you need guidance.</p><div class="v106-stat-grid"><div class="v106-stat"><b>${active.length}</b><span>Active assignments</span></div><div class="v106-stat"><b>${soon.length}</b><span>Due within 7 days</span></div><div class="v106-stat"><b>${overdue.length}</b><span>Overdue</span></div><div class="v106-stat"><b>${all.filter(a=>a.status==='complete').length}</b><span>Completed</span></div></div><div class="v106-card"><h2>Add an assignment</h2><div class="v106-form"><div class="v106-row3"><input id="v106-a-title" placeholder="Assignment / project title"><input id="v106-a-subject" placeholder="Subject / course"><select id="v106-a-type"><option value="assignment">Assignment</option><option value="project">Project</option><option value="essay">Essay / report</option><option value="presentation">Presentation</option><option value="exam">Exam / test</option></select></div><div class="v106-row3"><input id="v106-a-due" type="date"><input id="v106-a-progress" type="number" min="0" max="100" value="0" placeholder="Progress %"><select id="v106-a-priority"><option value="high">High priority</option><option value="medium" selected>Medium priority</option><option value="low">Low priority</option></select></div><textarea id="v106-a-info" placeholder="Requirements, rubric, instructions, topics or constraints"></textarea><button class="v106-btn" id="v106-a-add">Add assignment</button></div></div><div class="v106-section-title">Assignments</div><div class="v106-list" id="v106-a-list"></div>`;
    const draw=()=>{
      const pr={high:0,medium:1,low:2},a=assignments().sort((x,y)=>(x.status==='complete')-(y.status==='complete')||String(x.dueDate||'9999').localeCompare(String(y.dueDate||'9999'))||(pr[x.priority]??1)-(pr[y.priority]??1));saveAssignments(a);
      $('#v106-a-list').innerHTML=a.length?a.map(x=>{const d=daysUntil(x.dueDate),dueLabel=d==null?'No due date':d<0?Math.abs(d)+' day'+(Math.abs(d)===1?'':'s')+' overdue':d===0?'Due today':d+' day'+(d===1?'':'s')+' left';return `<div class="v106-item"><div class="v106-assignment-title"><div><strong data-v106-user="1">${esc(x.title)}</strong><div class="v106-meta"><span class="v106-badge">${esc(x.type)}</span>${x.subject?'<span class="v106-badge" data-v106-user="1">'+esc(x.subject)+'</span>':''}<span class="v106-badge ${x.priority==='high'?'warn':''}">${esc(x.priority)} priority</span><span class="v106-badge ${d!=null&&d<0?'warn':d!=null&&d<=3?'warn':'ok'}">${esc(dueLabel)}</span></div></div><span class="v106-badge ${x.status==='complete'?'ok':''}">${x.status==='complete'?'Complete':'Active'}</span></div>${x.instructions?'<p data-v106-user="1" style="margin:7px 0 0">'+esc(x.instructions)+'</p>':''}<div class="v106-progress-row"><div class="v106-progress"><i style="width:${x.progress}%"></i></div><b style="font:900 8px Inter">${x.progress}%</b></div><div class="v106-inline" style="margin-top:8px"><input type="range" min="0" max="100" step="5" value="${x.progress}" data-a-progress="${esc(x.id)}"><span style="font:800 7px Inter;color:#777">Update progress</span></div><div class="v106-actions"><button class="primary" data-a-plan="${esc(x.id)}">Break into Planner</button><button data-a-tutor="${esc(x.id)}">What should I do next?</button><button data-a-complete="${esc(x.id)}">${x.status==='complete'?'Reopen':'Complete'}</button><button data-a-del="${esc(x.id)}">Delete</button></div></div>`}).join(''):'<div class="v106-empty">No assignments yet. Add one above and SCHOLARK can connect it to Planner and AI Tutor.</div>';
      $$('[data-a-progress]',$('#v106-a-list')).forEach(el=>el.onchange=()=>{const arr=assignments(),x=arr.find(z=>z.id===el.dataset.aProgress);if(x){x.progress=Number(el.value)||0;if(x.progress>=100)x.status='complete';else if(x.status==='complete')x.status='active';saveAssignments(arr);draw()}});
      $$('[data-a-plan]',$('#v106-a-list')).forEach(b=>b.onclick=()=>{const x=assignments().find(z=>z.id===b.dataset.aPlan);if(!x)return;const n=planAssignment(x);b.textContent=n?'✓ '+n+' steps added':'✓ Already in Planner'});
      $$('[data-a-tutor]',$('#v106-a-list')).forEach(b=>b.onclick=()=>{const x=assignments().find(z=>z.id===b.dataset.aTutor);if(x)assignmentTutor(x)});
      $$('[data-a-complete]',$('#v106-a-list')).forEach(b=>b.onclick=()=>{const arr=assignments(),x=arr.find(z=>z.id===b.dataset.aComplete);if(x){x.status=x.status==='complete'?'active':'complete';x.progress=x.status==='complete'?100:Math.min(95,x.progress);saveAssignments(arr);draw()}});
      $$('[data-a-del]',$('#v106-a-list')).forEach(b=>b.onclick=()=>{saveAssignments(assignments().filter(x=>x.id!==b.dataset.aDel));draw()});
    };
    $('#v106-a-add').onclick=()=>{const title=$('#v106-a-title').value.trim();if(!title)return $('#v106-a-title').focus();const a=assignments();a.push({id:uid('assign'),title,subject:$('#v106-a-subject').value.trim(),type:$('#v106-a-type').value,priority:$('#v106-a-priority').value||'medium',dueDate:$('#v106-a-due').value,instructions:$('#v106-a-info').value.trim(),progress:Math.max(0,Math.min(100,Number($('#v106-a-progress').value)||0)),status:'active',createdAt:nowIso()});saveAssignments(a);renderAssignments()};draw();
  }

  function open(tool){
    if(!['focus','flashcards','assignments'].includes(tool))return false;
    clearInterval(focusTicker);focusTicker=null;
    if(tool==='focus')renderFocus();
    if(tool==='flashcards')renderFlashcards();
    if(tool==='assignments')renderAssignments();
    window.__SCHOLARK_I18N__?.apply?.($('#v51-fallback'));
    return true;
  }

  window.__SCHOLARK_V106_POWER__={
    open,
    focus:{state:focusState,history:focusHistory},
    flashcards:{all:cards,due:dueCards},
    assignments:{all:assignments,plan:planAssignment},
    version:'20260920-r175'
  };
})();