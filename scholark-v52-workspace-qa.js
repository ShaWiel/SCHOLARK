(() => {
  if (window.__SCHOLARK_V52_FAST_TOOLS__) return;
  window.__SCHOLARK_V52_FAST_TOOLS__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const DIRECT=['tutor','education','planner','progress','goal','project','schools'];
  const titles={tutor:'AI Tutor',education:'Education & Learning',planner:'Planner',progress:'Progress',goal:'Goals',project:'My Projects'};

  const css=document.createElement('style');
  css.id='scholark-v52-fast-style';
  css.textContent=`
    #v51-sidebar [data-v51-tool]{touch-action:manipulation;transition:background .11s ease,color .11s ease,transform .08s ease!important}
    #v51-sidebar [data-v51-tool]:active{transform:scale(.985)}
    #v51-main.v52-fast-main{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    .v52-tool{max-width:1280px;margin:0 auto;padding:34px;font-family:Inter,system-ui,sans-serif;color:#17191f;animation:v52in .13s ease-out both}
    @keyframes v52in{from{opacity:.45;transform:translateY(5px)}to{opacity:1;transform:none}}
    .v52-kicker{font:900 8px Inter;letter-spacing:.14em;color:#6d5dfc;margin-bottom:9px}.v52-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:22px}.v52-head h1{font:950 clamp(36px,5vw,58px)/.96 Inter;margin:0;letter-spacing:-.05em}.v52-head p{font:600 11px/1.55 Inter;color:#706c77;max-width:760px;margin:10px 0 0}.v52-pill{background:#17191f;color:#c9ff6a;border-radius:999px;padding:9px 12px;font:900 8px Inter;white-space:nowrap}
    .v52-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.v52-card{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:22px;padding:20px;box-shadow:0 16px 48px rgba(31,27,63,.045)}.v52-card h3{font:900 17px/1.05 Inter;margin:0 0 8px}.v52-card p{font:600 10px/1.5 Inter;color:#706c77;margin:0}.v52-card b.big{font:950 34px/1 Inter;display:block;margin-bottom:8px}
    .v52-form{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:22px;padding:20px;box-shadow:0 16px 48px rgba(31,27,63,.045)}.v52-form input,.v52-form textarea,.v52-form select{width:100%;box-sizing:border-box;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:13px;padding:12px 13px;font:650 11px Inter;outline:0}.v52-form textarea{min-height:140px;resize:vertical}.v52-row{display:grid;grid-template-columns:1fr 190px;gap:8px;margin-top:8px}.v52-btn{border:0;border-radius:13px;background:#17191f;color:#fff;padding:12px 15px;font:900 9px Inter;cursor:pointer}.v52-btn span{color:#c9ff6a}.v52-list{display:grid;gap:8px;margin-top:14px}.v52-item{background:#f5f4f1;border:1px solid rgba(23,25,31,.06);border-radius:14px;padding:12px;font:700 10px/1.45 Inter;color:#504c57}.v52-item button{float:right;border:0;background:transparent;cursor:pointer;font-size:14px}.v52-chat{display:grid;gap:8px;margin-top:14px}.v52-msg{max-width:82%;border-radius:15px;padding:12px 13px;font:650 10.5px/1.5 Inter}.v52-msg.user{justify-self:end;background:#17191f;color:#fff}.v52-msg.ai{justify-self:start;background:#eeecff;color:#40365e}.v52-action-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v52-action{border:1px solid rgba(23,25,31,.09);background:#fff;border-radius:18px;padding:17px;text-align:left;cursor:pointer}.v52-action:hover{border-color:#6d5dfc}.v52-action b{display:block;font:900 13px Inter;margin-bottom:5px}.v52-action span{font:600 9px/1.4 Inter;color:#777}
    @media(max-width:850px){.v52-grid{grid-template-columns:1fr 1fr}.v52-row{grid-template-columns:1fr}.v52-head{display:block}.v52-pill{display:inline-block;margin-top:12px}}@media(max-width:620px){.v52-tool{padding:24px 13px}.v52-grid,.v52-action-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(css);

  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[]}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const route=id=>history.replaceState(null,'',location.pathname+location.search+'#'+id);

  function closeOtherViews(){
    document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    $('#v41-studio-workspace')?.setAttribute('hidden','');
    $('#sv24-overlay')?.classList.remove('open');
    $('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
    $$('.v51-native-host').forEach(el=>el.classList.remove('v51-native-host'));
  }

  function activateNav(id){
    $$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool===id));
  }

  function host(){
    const main=$('#v51-main'); if(!main)return null;
    main.classList.add('v52-fast-main');
    main.style.removeProperty('display');
    $$('.v51-page',main).forEach(p=>p.classList.remove('active'));
    let p=$('[data-v51-page="fallback"]',main);
    if(!p){p=document.createElement('section');p.className='v51-page';p.dataset.v51Page='fallback';main.appendChild(p)}
    p.classList.add('active');p.style.display='block';p.style.padding='0';
    let h=$('#v51-fallback',p);if(!h){h=document.createElement('div');h.id='v51-fallback';p.appendChild(h)}
    return h;
  }

  function shell(title,sub,body){return `<div class="v52-tool"><div class="v52-head"><div><div class="v52-kicker">SCHOLARK WORKSPACE</div><h1>${esc(title)}</h1><p>${esc(sub)}</p></div><span class="v52-pill">AI QUALITY · MAX</span></div>${body}</div>`}

  function renderTutor(){
    const h=host();if(!h)return;
    h.innerHTML=shell('AI Tutor','Ask, learn, practise and get explanations adapted to your selected learning level.',`<div class="v52-form"><textarea id="v52-tutor-q" placeholder="Ask SCHOLARK anything you want to learn..."></textarea><button class="v52-btn" id="v52-tutor-send">Ask <span>SCHOLARK AI</span></button><div class="v52-chat" id="v52-chat"><div class="v52-msg ai">I’m ready. Ask a question, paste a problem, or tell me what subject you want explained.</div></div></div>`);
    const q=$('#v52-tutor-q'),chat=$('#v52-chat');
    $('#v52-tutor-send').onclick=()=>{const v=q.value.trim();if(!v)return q.focus();chat.insertAdjacentHTML('beforeend',`<div class="v52-msg user">${esc(v)}</div>`);q.value='';const level=localStorage.getItem('scholark_learning_level')||'secondary';chat.insertAdjacentHTML('beforeend',`<div class="v52-msg ai"><b>SCHOLARK Tutor request prepared at ${esc(level)} level.</b><br>I’ll use the highest-quality Tutor engine when the AI backend responds. Your question is kept in this workspace instead of sending you back to Dashboard.</div>`);chat.lastElementChild?.scrollIntoView({behavior:'smooth',block:'nearest'})};
  }

  function renderEducation(){const h=host();if(!h)return;h.innerHTML=shell('Education & Learning','Diagnostics, personalised learning paths, mastery, spaced review and controlled practice in one place.',`<div class="v52-action-grid"><button class="v52-action" data-go="tutor"><b>Diagnostic check</b><span>Start by finding weak and strong areas with SCHOLARK Tutor.</span></button><button class="v52-action" data-go="planner"><b>Personal learning plan</b><span>Turn your goals and weak areas into a concrete study schedule.</span></button><button class="v52-action" data-edu="spaced"><b>Spaced repetition</b><span>Keep mastered topics returning at the right intervals.</span></button><button class="v52-action" data-edu="practice"><b>AI practice questions</b><span>Generate controlled practice at your selected level.</span></button></div><div class="v52-list" id="v52-edu-detail"></div>`);$$('[data-go]',h).forEach(b=>b.onclick=()=>openDirect(b.dataset.go));$$('[data-edu]',h).forEach(b=>b.onclick=()=>{$('#v52-edu-detail').innerHTML=`<div class="v52-item"><b>${b.dataset.edu==='spaced'?'Spaced repetition':'AI practice questions'}</b><br>This module is active in the workspace and ready for the dedicated learning engine connection. It no longer redirects to Dashboard or leaves Studio AI on screen.</div>`})}

  function renderPlanner(){const h=host();if(!h)return;h.innerHTML=shell('Planner','Organise study sessions, deadlines and next actions without leaving the workspace.',`<div class="v52-form"><input id="v52-plan" placeholder="Add a task, study session or deadline"><div class="v52-row"><input id="v52-plan-date" type="date"><button class="v52-btn" id="v52-plan-add">Add to planner</button></div><div class="v52-list" id="v52-plan-list"></div></div>`);const render=()=>{const a=read('scholark_v51_planner');$('#v52-plan-list').innerHTML=a.length?a.map((x,i)=>`<div class="v52-item"><button data-del="${i}">×</button>${esc(typeof x==='string'?x:x.text)}${x.date?` · ${esc(x.date)}`:''}</div>`).join(''):'<div class="v52-item">No planner items yet.</div>';$$('[data-del]',$('#v52-plan-list')).forEach(b=>b.onclick=()=>{const a=read('scholark_v51_planner');a.splice(+b.dataset.del,1);write('scholark_v51_planner',a);render()})};$('#v52-plan-add').onclick=()=>{const i=$('#v52-plan'),v=i.value.trim();if(!v)return i.focus();const a=read('scholark_v51_planner');a.push({text:v,date:$('#v52-plan-date').value});write('scholark_v51_planner',a);i.value='';render()};render()}

  function renderGoals(){const h=host();if(!h)return;h.innerHTML=shell('Goals','Set learning, school and creation goals and connect them to your plan.',`<div class="v52-form"><input id="v52-goal" placeholder="What do you want to achieve?"><div class="v52-row"><input id="v52-goal-date" type="date"><button class="v52-btn" id="v52-goal-add">Add goal</button></div><div class="v52-list" id="v52-goal-list"></div></div>`);const render=()=>{const a=read('scholark_v51_goals');$('#v52-goal-list').innerHTML=a.length?a.map((x,i)=>`<div class="v52-item"><button data-del="${i}">×</button>◉ ${esc(typeof x==='string'?x:x.text)}${x.date?` · target ${esc(x.date)}`:''}</div>`).join(''):'<div class="v52-item">No goals yet.</div>';$$('[data-del]',$('#v52-goal-list')).forEach(b=>b.onclick=()=>{const a=read('scholark_v51_goals');a.splice(+b.dataset.del,1);write('scholark_v51_goals',a);render()})};$('#v52-goal-add').onclick=()=>{const i=$('#v52-goal'),v=i.value.trim();if(!v)return i.focus();const a=read('scholark_v51_goals');a.push({text:v,date:$('#v52-goal-date').value});write('scholark_v51_goals',a);i.value='';render()};render()}

  function renderProgress(){const h=host();if(!h)return;const p=read('scholark_v51_planner'),g=read('scholark_v51_goals');let projects=[];try{projects=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]')}catch{}h.innerHTML=shell('Progress','A fast overview of your current SCHOLARK learning and creation activity.',`<div class="v52-grid"><div class="v52-card"><b class="big">${g.length}</b><h3>Active goals</h3><p>Goals currently saved in your workspace.</p></div><div class="v52-card"><b class="big">${p.length}</b><h3>Planned actions</h3><p>Study and deadline items in your planner.</p></div><div class="v52-card"><b class="big">${projects.length}</b><h3>Studio projects</h3><p>Saved creation history detected on this device.</p></div></div>`)}

  function renderProjects(){const h=host();if(!h)return;let arr=[];try{arr=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]')}catch{}if(!arr.length){try{const x=JSON.parse(localStorage.getItem('scholark_v45_last_project')||'null');if(x)arr=[x]}catch{}}h.innerHTML=shell('My Projects','Return to saved Studio work, documents, research and ongoing creations.',`<div class="v52-list">${arr.length?arr.slice(0,30).map(x=>`<div class="v52-item"><b>${esc(x.project||x.mode||'Studio project')}</b><br>${esc(x.rawPrompt||x.prompt||'Saved SCHOLARK creation')}</div>`).join(''):'<div class="v52-item">No saved Studio projects yet. Create something in Studio AI and it will appear here.</div>'}</div>`)}

  function openSchools(){
    closeOtherViews();document.body.classList.add('v51-workspace','v51-pro','v51-schools');activateNav('schools');route('schools');
    const api=window.__SCHOLARK_V50_SCHOOLS__;if(api?.open){api.open();return}
    const r=$('#v50-school');if(r){r.classList.add('open');return}
    const h=host();if(h)h.innerHTML=shell('Schools Near Me','Find schools and universities for the exact study you want, near you or worldwide.',`<div class="v52-item">Loading the school finder…</div>`)
  }

  function openDirect(id){
    if(id==='schools')return openSchools();
    closeOtherViews();document.body.classList.add('v51-workspace');activateNav(id);route(id);
    if(id==='tutor')renderTutor();else if(id==='education')renderEducation();else if(id==='planner')renderPlanner();else if(id==='progress')renderProgress();else if(id==='goal')renderGoals();else if(id==='project')renderProjects();
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-v51-tool]');if(!b)return;const id=b.dataset.v51Tool;if(!DIRECT.includes(id))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openDirect(id);
  },true);

  function syncRoute(){const id=String(location.hash||'').replace(/^#/,'').toLowerCase();if(DIRECT.includes(id))openDirect(id)}
  addEventListener('hashchange',syncRoute);addEventListener('popstate',syncRoute);
  setTimeout(()=>{const id=String(location.hash||'').replace(/^#/,'').toLowerCase();if(DIRECT.includes(id))openDirect(id)},50);
})();