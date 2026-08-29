(() => {
  if (window.__SCHOLARK_V53_DASHBOARD_BOOTSTRAP__) return;
  window.__SCHOLARK_V53_DASHBOARD_BOOTSTRAP__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const hash=()=>String(location.hash||'').toLowerCase();
  const workspaceRx=/dashboard|studio|tutor|education|language|planner|progress|goal|project|files|schools|study|book|presentation|webpage|document|report|graphic|social/;
  const isWorkspace=()=>workspaceRx.test(hash());
  const isDashboard=()=>hash()==='#dashboard';
  const isPublicHome=()=>!isWorkspace()&&!/pricing/.test(hash());

  const style=document.createElement('style');
  style.id='scholark-v53-style';
  style.textContent=`
    #v53-emergency{display:none}
    body.v53-emergency #v53-emergency{display:block;position:fixed;inset:0;z-index:2147483600;background:#f4f3ef;color:#17191f;font-family:Inter,system-ui,sans-serif;overflow:auto}
    .v53-side{position:fixed;left:0;top:0;bottom:0;width:258px;background:#151821;color:#fff;padding:18px 13px;box-sizing:border-box}
    .v53-brand{padding:8px 10px 18px;border-bottom:1px solid rgba(255,255,255,.08);font:950 16px Inter}.v53-brand small{display:block;margin-top:4px;color:#8f8b98;font:800 8px Inter;letter-spacing:.1em}
    .v53-nav{margin-top:14px;display:grid;gap:4px}.v53-nav button{border:0;background:transparent;color:#dddbe5;border-radius:11px;padding:11px 10px;text-align:left;font:800 10.5px Inter;cursor:pointer}.v53-nav button.active{background:rgba(201,255,106,.12);color:#fff;box-shadow:inset 3px 0 #c9ff6a}
    .v53-main{margin-left:258px;min-height:100vh;padding:34px;box-sizing:border-box}.v53-shell{max-width:1400px;margin:0 auto}.v53-kicker{font:900 8px Inter;letter-spacing:.14em;color:#6d5dfc}.v53-main h1{font:950 clamp(40px,5vw,62px)/.94 Inter;margin:10px 0 12px;letter-spacing:-.05em}.v53-main p{max-width:760px;color:#706c77;font:600 12px/1.55 Inter}.v53-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:24px}.v53-card{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:22px;padding:19px;min-height:160px;text-align:left;cursor:pointer;box-shadow:0 17px 50px rgba(31,27,63,.045)}.v53-card.primary{grid-column:span 2;background:linear-gradient(145deg,#17191f,#30275d);color:#fff}.v53-card h3{font:950 20px/1 Inter;margin:4px 0 8px}.v53-card p{font:600 10px/1.5 Inter;margin:0;color:#77727d}.v53-card.primary p{color:#cac6d2}.v53-card b{display:inline-block;margin-top:18px;color:#6d5dfc;font:900 8.5px Inter}.v53-card.primary b{color:#c9ff6a}
    @media(max-width:900px){.v53-grid{grid-template-columns:repeat(2,1fr)}.v53-card.primary{grid-column:span 2}}
    @media(max-width:640px){.v53-side{width:74px}.v53-brand{font-size:0}.v53-brand:before{content:'S';font:950 18px Inter;color:#c9ff6a}.v53-brand small,.v53-nav button{font-size:0}.v53-main{margin-left:74px;padding:22px 14px}.v53-grid{grid-template-columns:1fr}.v53-card.primary{grid-column:auto}}
  `;
  document.head.appendChild(style);

  function emitHashChange(oldURL){
    try{window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL,newURL:location.href}))}
    catch{window.dispatchEvent(new Event('hashchange'))}
  }

  function revealPrimaryDashboard(){
    if(!isDashboard())return false;
    const main=$('#v51-main'),side=$('#v51-sidebar'),page=$('#v51-main [data-v51-page="dashboard"]');
    if(!main||!side||!page)return false;

    document.body.classList.add('v51-workspace');
    document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v53-emergency','v41-home');
    main.hidden=false;side.hidden=false;
    main.style.removeProperty('display');side.style.removeProperty('display');
    $$('.v51-page',main).forEach(p=>p.classList.toggle('active',p===page));
    const home=$('#v29-home-layer');
    if(home){home.hidden=true;home.style.setProperty('display','none','important')}
    $('#v28-home')?.setAttribute('hidden','');
    return true;
  }

  function clickPrimaryDashboard(){
    const button=$('#v51-sidebar [data-v51-tool="dashboard"]');
    if(!button)return false;
    try{button.click()}catch{}
    return revealPrimaryDashboard();
  }

  function createEmergency(){
    if($('#v53-emergency'))return;
    const root=document.createElement('div');root.id='v53-emergency';
    root.innerHTML=`<aside class="v53-side"><div class="v53-brand">SCHOLARK<small>WORKSPACE</small></div><div class="v53-nav">
      <button class="active" data-v53-tool="dashboard">⌂ Dashboard</button><button data-v53-tool="studio">✦ Studio AI</button><button data-v53-tool="tutor">AI Tutor</button><button data-v53-tool="education">Education & Learning</button><button data-v53-tool="language">Language Learner</button><button data-v53-tool="planner">Planner</button><button data-v53-tool="progress">Progress</button><button data-v53-tool="goal">Goals</button><button data-v53-tool="project">My Projects</button><button data-v53-tool="schools">Schools Near Me</button><button data-v53-tool="study">Study Ahead</button><button data-v53-tool="book">Book Studio</button>
    </div></aside><main class="v53-main"><div class="v53-shell"><div class="v53-kicker">SCHOLARK WORKSPACE</div><h1>Your learning & creation workspace.</h1><p>The primary workspace is still initializing. This fail-safe prevents a white screen.</p><div class="v53-grid">
      <button class="v53-card primary" data-v53-tool="studio"><h3>Studio AI</h3><p>Create presentations, webpages, documents, social content and graphics.</p><b>OPEN STUDIO →</b></button>
      <button class="v53-card" data-v53-tool="tutor"><h3>AI Tutor</h3><p>Learn and practice with adaptive AI support.</p><b>OPEN TUTOR →</b></button>
      <button class="v53-card" data-v53-tool="education"><h3>Education & Learning</h3><p>Diagnostics, learning paths and mastery support.</p><b>OPEN LEARNING →</b></button><button class="v53-card" data-v53-tool="language"><h3>Language Learner</h3><p>Learn vocabulary, grammar, pronunciation and conversation.</p><b>LEARN A LANGUAGE →</b></button>
      <button class="v53-card" data-v53-tool="planner"><h3>Planner</h3><p>Plan study work, goals and deadlines.</p><b>OPEN PLANNER →</b></button>
      <button class="v53-card" data-v53-tool="progress"><h3>Progress</h3><p>Track what is improving and what needs focus.</p><b>VIEW PROGRESS →</b></button>
      <button class="v53-card" data-v53-tool="goal"><h3>Goals</h3><p>Set learning and school goals.</p><b>OPEN GOALS →</b></button>
    </div></div></main>`;
    document.body.appendChild(root);
    $$('[data-v53-tool]',root).forEach(btn=>btn.addEventListener('click',()=>{
      const id=btn.dataset.v53Tool;if(id==='dashboard')return;
      const old=location.href;history.replaceState(null,'',location.pathname+location.search+'#'+id);emitHashChange(old);
      setTimeout(()=>$('#v51-sidebar [data-v51-tool="'+id+'"]')?.click(),30);
    }));
  }

  function openDashboardFromHome(){
    const old=location.href;
    history.replaceState(null,'',location.pathname+location.search+'#dashboard');
    emitHashChange(old);

    let tries=0;
    const step=()=>{
      tries++;
      if(clickPrimaryDashboard()||revealPrimaryDashboard())return;
      if(tries<30){setTimeout(step,40);return}
      createEmergency();
      document.body.classList.add('v53-emergency');
      const home=$('#v29-home-layer');if(home)home.hidden=true;
    };
    requestAnimationFrame(step);
  }

  function schoolBridge(){
    if(!hash().includes('schools'))return;
    if($('#v50-school')){$('#v50-school').classList.add('open');return}
    if($('#v53-school-trigger'))return;
    const t=document.createElement('button');t.id='v53-school-trigger';t.hidden=true;t.dataset.v48Tool='schools';document.body.appendChild(t);
    setTimeout(()=>{const b=$('[data-v50-school="1"]')||t;if(b?.dataset.v50School==='1')try{b.click()}catch{}},220);
  }

  function sync(){
    if(!isWorkspace()){document.body.classList.remove('v53-emergency');return}
    if(isDashboard()){
      if(revealPrimaryDashboard())return;
      setTimeout(()=>{
        if(!isDashboard()||revealPrimaryDashboard())return;
        createEmergency();document.body.classList.add('v53-emergency');
        const home=$('#v29-home-layer');if(home)home.hidden=true;
      },500);
      return;
    }
    document.body.classList.remove('v53-emergency');schoolBridge();
  }

  // Capture the public-home Dashboard button BEFORE V41's old replaceState-only handler runs.
  document.addEventListener('click',e=>{
    const button=e.target.closest('#v41-dashboard-entry');
    if(!button||!isPublicHome())return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    openDashboardFromHome();
  },true);

  addEventListener('hashchange',()=>setTimeout(sync,10));
  addEventListener('popstate',()=>setTimeout(sync,10));
  document.addEventListener('DOMContentLoaded',sync,{once:true});
  setTimeout(sync,60);
})();