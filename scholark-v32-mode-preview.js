(() => {
  if (window.__SCHOLARK_V32_MODE_PREVIEW__) return;
  window.__SCHOLARK_V32_MODE_PREVIEW__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const style=document.createElement('style');
  style.id='scholark-v32-mode-preview-style';
  style.textContent=`
    /* Public homepage is a self-running product showcase. */
    body.v31-public-home #v29-create,
    body.v31-public-home #v29-open-studio,
    body.v31-public-home #v29-final-open,
    body.v31-public-home #sv24-launch{display:none!important;visibility:hidden!important;pointer-events:none!important}
    body.v31-public-home .v29-prompt{padding:10px 16px!important}
    body.v31-public-home .v29-prompt input{padding-right:12px!important;cursor:default!important}

    .v32-preview-shell{height:100%;display:flex;flex-direction:column;gap:11px;animation:v32fade .38s ease}
    .v32-preview-shell *{box-sizing:border-box}
    @keyframes v32fade{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
    .v32-label{font:900 8px/1 Inter,system-ui;letter-spacing:.13em;color:#78747f;text-transform:uppercase}
    .v32-title{font:950 25px/.98 Inter,system-ui;letter-spacing:-.045em;color:#15161b}
    .v32-sub{font:650 8px/1.45 Inter,system-ui;color:#6d6973;max-width:94%}
    .v32-pane{flex:1;min-height:0;border-radius:15px;overflow:hidden;position:relative}

    /* Presentation */
    .v32-deck{display:grid;grid-template-columns:70px 1fr;gap:10px;background:#ece9f8;padding:10px}
    .v32-slides{display:grid;gap:6px}.v32-slide-thumb{height:38px;border-radius:6px;background:#292440}.v32-slide-thumb.active{background:#c9ff6a;box-shadow:0 0 0 2px #6d5dfc inset}
    .v32-slide-main{background:#27223f;color:white;border-radius:12px;padding:14px;display:grid;grid-template-columns:1fr .75fr;gap:10px}
    .v32-slide-main h5{font:950 18px/1 Inter;margin:0 0 6px}.v32-slide-main p{font:600 7px/1.45 Inter;color:#d6d2e0}.v32-chart{display:flex;align-items:end;gap:5px;height:82px;padding:8px;background:rgba(255,255,255,.06);border-radius:9px}.v32-chart i{flex:1;border-radius:4px 4px 2px 2px;background:#9b8cff;animation:v32bar 2.4s ease-in-out infinite}.v32-chart i:nth-child(1){height:32%}.v32-chart i:nth-child(2){height:76%;animation-delay:.15s}.v32-chart i:nth-child(3){height:54%;animation-delay:.3s}.v32-chart i:nth-child(4){height:93%;animation-delay:.45s}@keyframes v32bar{50%{transform:scaleY(.76);transform-origin:bottom}}

    /* Webpage */
    .v32-web{background:#fff;border:1px solid #dedbe7;padding:10px;display:flex;flex-direction:column}.v32-webnav{height:21px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eee;font:850 6px Inter}.v32-webnav b{font-size:8px}.v32-webnav span{word-spacing:7px;color:#777}.v32-webhero{display:grid;grid-template-columns:1fr .72fr;gap:10px;align-items:center;flex:1;padding:12px 5px}.v32-webhero h5{font:950 20px/.95 Inter;margin:0 0 6px}.v32-webhero p{font:600 7px/1.4 Inter;color:#6e6b73}.v32-webcta{display:inline-block;background:#17191f;color:#fff;border-radius:999px;padding:6px 9px;font:850 6px Inter;margin-top:5px}.v32-webart{height:105px;border-radius:16px;background:radial-gradient(circle at 70% 25%,#c9ff6a,transparent 34%),linear-gradient(145deg,#6d5dfc,#241f4e);position:relative;overflow:hidden}.v32-webart:after{content:'';position:absolute;inset:22px;border-radius:12px;background:rgba(255,255,255,.14);backdrop-filter:blur(5px);animation:v32float 3s ease-in-out infinite}@keyframes v32float{50%{transform:translateY(-6px)}}

    /* Document */
    .v32-doc{background:#e6e4ea;padding:10px;display:grid;place-items:center}.v32-page{width:82%;height:100%;background:white;border-radius:5px;box-shadow:0 12px 28px rgba(0,0,0,.14);padding:14px}.v32-page h5{font:950 15px/1.05 Inter;margin:0 0 3px}.v32-byline{font:700 6px Inter;color:#8a8690;margin-bottom:10px}.v32-section{font:900 7px Inter;margin:7px 0 4px}.v32-lines{display:grid;gap:3px}.v32-lines i{height:3px;border-radius:99px;background:#d8d5dd}.v32-lines i:nth-child(2){width:93%}.v32-lines i:nth-child(3){width:78%}.v32-cite{margin-top:9px;border-left:3px solid #6d5dfc;background:#f0edff;padding:6px;font:700 6px/1.35 Inter;color:#504a67}

    /* Social */
    .v32-social{background:linear-gradient(145deg,#17191f,#352c75);padding:12px;display:grid;grid-template-columns:.8fr 1.2fr;gap:10px;color:#fff}.v32-phone{border:4px solid #111319;border-radius:22px;background:#f8f6ef;padding:7px;color:#111;transform:rotate(-3deg);box-shadow:0 15px 30px rgba(0,0,0,.28)}.v32-post{height:100%;border-radius:13px;background:linear-gradient(155deg,#c9ff6a,#e9ffc1);padding:10px;display:flex;flex-direction:column;justify-content:space-between}.v32-post b{font:950 16px/.95 Inter}.v32-post small{font:800 6px Inter}.v32-social-copy{padding:10px 4px}.v32-social-copy h5{font:950 17px/1 Inter;margin:0 0 7px}.v32-social-copy p{font:600 7px/1.5 Inter;color:#d4d1dd}.v32-pills{display:flex;gap:4px;flex-wrap:wrap;margin-top:9px}.v32-pills i{font:800 5.5px Inter;font-style:normal;padding:4px 6px;border-radius:99px;background:rgba(255,255,255,.1)}

    /* Graphic */
    .v32-graphic{background:#f0eee8;padding:10px;display:grid;place-items:center}.v32-poster{height:100%;width:72%;border-radius:12px;background:linear-gradient(165deg,#14161b 0 56%,#c9ff6a 56%);color:#fff;padding:14px;position:relative;box-shadow:0 14px 28px rgba(0,0,0,.18)}.v32-poster .num{font:950 40px/.85 Inter;color:#c9ff6a}.v32-poster h5{font:950 17px/.95 Inter;margin:5px 0}.v32-poster p{font:650 6.5px/1.45 Inter;max-width:80%;color:#ddd}.v32-poster .tag{position:absolute;right:10px;bottom:10px;background:#111319;color:#c9ff6a;border-radius:99px;padding:5px 7px;font:900 5px Inter}

    /* Book */
    .v32-book{background:linear-gradient(145deg,#ebe7f9,#f9f7f0);padding:10px;display:grid;grid-template-columns:.72fr 1.28fr;gap:10px}.v32-cover{border-radius:11px;background:linear-gradient(160deg,#151821,#3c327d);color:#fff;padding:11px;display:flex;flex-direction:column;justify-content:flex-end;box-shadow:0 10px 24px rgba(0,0,0,.18)}.v32-cover small{font:850 6px Inter;color:#c9ff6a}.v32-cover b{font:950 18px/.95 Inter;margin-top:4px}.v32-outline{background:#fff;border-radius:11px;padding:10px}.v32-outline h5{font:950 10px Inter;margin:0 0 7px}.v32-chapter{padding:5px 0;border-bottom:1px solid #eee;font:750 6.5px Inter;display:flex;justify-content:space-between}.v32-chapter em{font-style:normal;color:#6d5dfc;font-weight:900}.v32-next{margin-top:7px;background:#efffcf;border-radius:7px;padding:6px;font:750 6px/1.35 Inter;color:#444}
  `;
  document.head.appendChild(style);

  const data={
    presentation:{title:'Presentation Builder',label:'SCHOLARK STUDIO • PRESENTATION',sub:'A complete deck is being structured, researched and designed.',html:`<div class="v32-pane v32-deck"><div class="v32-slides"><div class="v32-slide-thumb active"></div><div class="v32-slide-thumb"></div><div class="v32-slide-thumb"></div><div class="v32-slide-thumb"></div></div><div class="v32-slide-main"><div><h5>NBA GOAT Debate</h5><p>Evidence-led argument comparing era, peak, longevity and playoff impact.</p><p><b>Slide 4 • Peak dominance</b></p></div><div class="v32-chart"><i></i><i></i><i></i><i></i></div></div></div>`},
    webpage:{title:'Webpage Builder',label:'SCHOLARK STUDIO • WEBPAGE',sub:'Copy, hierarchy, sections and responsive structure are assembled together.',html:`<div class="v32-pane v32-web"><div class="v32-webnav"><b>BrightMind</b><span>ABOUT  PROGRAMS  CONTACT</span></div><div class="v32-webhero"><div><h5>Study smarter. Go further.</h5><p>Personal tutoring, adaptive practice and clear study plans built around your goals.</p><span class="v32-webcta">Start learning →</span></div><div class="v32-webart"></div></div></div>`},
    document:{title:'Document Builder',label:'SCHOLARK STUDIO • DOCUMENT',sub:'Outline, evidence, argument flow and citations are built before final polish.',html:`<div class="v32-pane v32-doc"><div class="v32-page"><h5>Renewable Energy Report</h5><div class="v32-byline">Research draft • 1,850 words • citations enabled</div><div class="v32-section">1. Introduction</div><div class="v32-lines"><i></i><i></i><i></i></div><div class="v32-section">2. Solar and wind adoption</div><div class="v32-lines"><i></i><i></i><i></i></div><div class="v32-cite">Evidence check: cost, capacity and adoption claims linked to sources.</div></div></div>`},
    social:{title:'Social Builder',label:'SCHOLARK STUDIO • SOCIAL',sub:'Campaign concept, hook, carousel logic, caption and CTA move as one system.',html:`<div class="v32-pane v32-social"><div class="v32-phone"><div class="v32-post"><small>SLIDE 1 / 6</small><b>5 study habits that actually stick.</b><small>SWIPE →</small></div></div><div class="v32-social-copy"><h5>Study Habit Carousel</h5><p>Hook, slide sequence, caption and visual direction are generated together.</p><div class="v32-pills"><i>HOOK</i><i>CAROUSEL</i><i>CAPTION</i><i>CTA</i></div></div></div>`},
    graphic:{title:'Graphic Builder',label:'SCHOLARK STUDIO • GRAPHIC',sub:'Information hierarchy and visual design are composed into one finished concept.',html:`<div class="v32-pane v32-graphic"><div class="v32-poster"><div class="num">7</div><h5>Days to exam.</h5><p>A focused revision plan: diagnose, prioritize, practice, review.</p><span class="tag">EXAM PREP</span></div></div>`},
    book:{title:'Book Studio',label:'SCHOLARK STUDIO • BOOK',sub:'Concept, length, chapters, pacing and what should come next are planned together.',html:`<div class="v32-pane v32-book"><div class="v32-cover"><small>YOUNG ADULT MYSTERY</small><b>The Last Light</b></div><div class="v32-outline"><h5>18-chapter structure</h5><div class="v32-chapter"><span>01 • The signal</span><em>1,900w</em></div><div class="v32-chapter"><span>02 • No one believes her</span><em>2,100w</em></div><div class="v32-chapter"><span>03 • The locked room</span><em>2,250w</em></div><div class="v32-next">Next paragraph idea: reveal a small contradiction, not the answer — increase suspicion before the first major clue.</div></div></div>`}
  };

  function currentMode(){
    const active=$('.v29-type.active[data-mode]')||$('.v29-tab.active[data-mode]');
    return active?.dataset.mode||'presentation';
  }

  let lastMode='';
  function render(){
    const host=$('.v29-preview');
    if(!host) return;
    const mode=currentMode();
    if(mode===lastMode && $('.v32-preview-shell',host)) return;
    const d=data[mode]||data.presentation;
    host.innerHTML=`<div class="v32-preview-shell"><div class="v32-label">${d.label}</div><div class="v32-title">${d.title}</div><div class="v32-sub">${d.sub}</div>${d.html}</div>`;
    lastMode=mode;
  }

  function cleanPublicHome(){
    const onHome=document.body?.classList.contains('v31-public-home') || !!document.querySelector('#v29-home-layer.v30-native-home:not([hidden])');
    if(!onHome) return;

    const home=document.getElementById('sv24-home');
    if(home) home.style.setProperty('display','none','important');

    ['sv24-launch','v29-create','v29-open-studio','v29-final-open'].forEach(id=>{
      const el=document.getElementById(id);
      if(el){el.style.setProperty('display','none','important');el.setAttribute('aria-hidden','true');el.tabIndex=-1;}
    });

    const prompt=$('#v29-prompt');
    if(prompt){prompt.readOnly=true;prompt.setAttribute('aria-label','Automatic SCHOLARK capability demo');}
  }

  function sync(){cleanPublicHome();render();}
  addEventListener('hashchange',()=>setTimeout(sync,80));
  addEventListener('scholark-language-ready',()=>setTimeout(sync,80));
  [80,500].forEach(ms=>setTimeout(sync,ms));
})();