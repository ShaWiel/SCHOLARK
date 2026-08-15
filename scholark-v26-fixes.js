(() => {
  if (window.__SCHOLARK_V26_FIXES__) return;
  window.__SCHOLARK_V26_FIXES__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const style=document.createElement('style');
  style.id='v26-style';
  style.textContent=`
    :root{--v26-lime:#c9ff6a;--v26-purple:#6d5dfc;--v26-dark:#111319;--v26-soft:#f4f1ff;--v26-line:rgba(20,22,28,.12)}
    #v26-sidebar-toggle{position:fixed;z-index:2147483642;top:92px;left:12px;width:38px;height:38px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:#17191f;color:#fff;box-shadow:0 12px 30px rgba(0,0,0,.25);cursor:pointer;font:900 18px Inter,system-ui;display:grid;place-items:center;transition:.25s ease}
    #v26-hero{margin:22px auto 28px;max-width:1180px;min-height:430px;border-radius:34px;overflow:hidden;position:relative;color:#fff;background:radial-gradient(circle at 78% 20%,rgba(201,255,106,.28),transparent 26%),radial-gradient(circle at 15% 80%,rgba(109,93,252,.32),transparent 32%),linear-gradient(135deg,#0d1017,#19182a 55%,#352877);box-shadow:0 30px 100px rgba(34,24,87,.22);box-sizing:border-box;padding:44px}
    #v26-hero:before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:34px 34px;mask-image:linear-gradient(to bottom,black,transparent)}
    .v26-hero-grid{position:relative;z-index:1;display:grid;grid-template-columns:1.05fr .95fr;gap:34px;align-items:center}.v26-eyebrow{display:inline-flex;gap:8px;align-items:center;padding:7px 10px;border:1px solid rgba(255,255,255,.14);border-radius:999px;color:var(--v26-lime);font:900 10px Inter;letter-spacing:.12em;text-transform:uppercase}.v26-hero-copy h1{font:900 clamp(42px,6vw,78px)/.93 Inter,system-ui;margin:17px 0 16px;letter-spacing:-.045em}.v26-hero-copy h1 span{color:var(--v26-lime)}.v26-hero-copy p{max-width:630px;color:#d9d8e1;font:560 15px/1.6 Inter}.v26-hero-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}.v26-hero-actions button{border-radius:999px;padding:13px 18px;font:900 12px Inter;cursor:pointer}.v26-primary{border:0;background:var(--v26-lime);color:#101319}.v26-secondary{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#fff}.v26-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.v26-chip{font:800 10px Inter;color:#d9d7e2;border:1px solid rgba(255,255,255,.12);padding:7px 9px;border-radius:999px;background:rgba(255,255,255,.04)}
    .v26-showcase{position:relative;min-height:330px}.v26-orbit{position:absolute;inset:0;border:1px solid rgba(255,255,255,.10);border-radius:50%;animation:v26spin 22s linear infinite}.v26-orbit.two{inset:45px;animation-direction:reverse;animation-duration:15s}.v26-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:170px;height:170px;border-radius:38px;background:linear-gradient(145deg,#fff,#ded8ff);box-shadow:0 26px 70px rgba(0,0,0,.35);display:grid;place-items:center;color:#17191f;text-align:center}.v26-center b{font:1000 26px Inter;display:block}.v26-center span{font:800 10px Inter;color:#635f6a}.v26-float{position:absolute;padding:12px 13px;border-radius:16px;background:rgba(255,255,255,.10);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.13);font:900 11px Inter;box-shadow:0 15px 35px rgba(0,0,0,.15)}.v26-f1{left:3%;top:8%}.v26-f2{right:1%;top:20%}.v26-f3{left:4%;bottom:12%}.v26-f4{right:5%;bottom:6%}@keyframes v26spin{to{transform:rotate(360deg)}}
    #v26-pricing{max-width:1240px;margin:18px auto 48px;padding:24px;box-sizing:border-box}.v26-price-title{text-align:center;margin:10px 0 28px}.v26-price-title h2{font:950 clamp(38px,5vw,64px)/.95 Inter;margin:0;letter-spacing:-.04em}.v26-price-title p{font:650 13px Inter;color:#706d77}.v26-price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.v26-plan{position:relative;min-height:650px;padding:28px;border:1px solid var(--v26-line);border-radius:30px;background:#fff;box-shadow:0 20px 70px rgba(31,24,69,.08)}.v26-plan.plus{background:#17191f;color:#fff}.v26-plan.pro{background:linear-gradient(155deg,#2a2357,#111319 65%);color:#fff;border:2px solid var(--v26-lime);transform:translateY(-10px);box-shadow:0 28px 80px rgba(51,38,112,.25)}.v26-plan .kicker{font:950 10px Inter;letter-spacing:.14em;color:#7b7882}.v26-plan.plus .kicker,.v26-plan.pro .kicker{color:var(--v26-lime)}.v26-plan h3{font:950 28px Inter;margin:12px 0 8px}.v26-plan .desc{font:600 12px/1.5 Inter;opacity:.72;min-height:38px}.v26-price{font:950 52px/1 Inter;margin:25px 0}.v26-price small{font:750 11px Inter;opacity:.62}.v26-plan ul{list-style:none;padding:0;margin:0 0 80px}.v26-plan li{font:680 11.5px/1.45 Inter;padding:7px 0;border-bottom:1px solid rgba(130,130,140,.13)}.v26-plan li:before{content:'✓';font-weight:1000;margin-right:7px;color:var(--v26-purple)}.v26-plan.plus li:before,.v26-plan.pro li:before{color:var(--v26-lime)}.v26-most{position:absolute;right:18px;top:18px;background:var(--v26-lime);color:#101319;border-radius:999px;padding:7px 10px;font:950 9px Inter;letter-spacing:.06em}.v26-plan .plan-btn{position:absolute;left:25px;right:25px;bottom:24px;padding:14px;border-radius:15px;border:0;background:#ececf1;font:950 12px Inter;cursor:pointer}.v26-plan.plus .plan-btn,.v26-plan.pro .plan-btn{background:var(--v26-lime);color:#111}
    .v26-voice-note{display:inline-flex;align-items:center;gap:7px;margin-left:8px;font:800 9px Inter;color:#777}.v26-voice-dot{width:7px;height:7px;border-radius:50%;background:#43d17c;box-shadow:0 0 0 4px rgba(67,209,124,.12)}
    @media(max-width:900px){.v26-hero-grid,.v26-price-grid{grid-template-columns:1fr}.v26-plan.pro{transform:none}.v26-showcase{min-height:280px}}
    @media(max-width:600px){#v26-hero{padding:28px 20px;border-radius:24px}.v26-hero-copy h1{font-size:46px}.v26-showcase{min-height:240px}.v26-float{font-size:9px}.v26-price-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function textOf(el){return (el?.textContent||'').trim();}
  function exactText(txt){return $$('h1,h2,h3,h4,strong,b,span,div').find(e=>textOf(e)===txt);}
  function detectLanguage(){
    const html=(document.documentElement.lang||'').toLowerCase();
    if(html.startsWith('nl')) return 'nl';
    if(html.startsWith('en')) return 'en';
    const visible=$$('button,a,span,div').filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;});
    if(visible.some(e=>/^(nederlands|dutch)$/i.test(textOf(e)))) return 'nl';
    if(visible.some(e=>/^(english|engels)$/i.test(textOf(e)))) return 'en';
    return 'en';
  }

  function findSidebar(){
    const tokens=['Dashboard','Education & Learning','Studio AI','Planner','Progress'];
    let best=null,score=-1;
    $$('aside,nav,section,div').forEach(el=>{
      const t=textOf(el); if(!t) return;
      const hits=tokens.filter(x=>t.includes(x)).length;
      if(hits<3) return;
      const r=el.getBoundingClientRect();
      if(r.width<120||r.width>460||r.height<300) return;
      const s=hits*1000-r.width;
      if(s>score){best=el;score=s;}
    });
    return best;
  }
  function setupSidebar(){
    if($('#v26-sidebar-toggle')) return;
    const side=findSidebar(); if(!side) return;
    const btn=document.createElement('button'); btn.id='v26-sidebar-toggle'; btn.setAttribute('aria-label','Toggle sidebar'); document.body.appendChild(btn);
    const next=side.nextElementSibling;
    const orig={display:side.style.display,transform:side.style.transform,width:side.style.width,minWidth:side.style.minWidth,opacity:side.style.opacity,pointer:side.style.pointerEvents,transition:side.style.transition,nextMargin:next?.style.marginLeft||'',nextWidth:next?.style.width||'',nextFlex:next?.style.flex||''};
    function apply(hidden){
      localStorage.setItem('scholark_sidebar_closed',hidden?'1':'0');
      if(hidden){
        side.style.transition='transform .25s ease,opacity .2s ease,width .25s ease';side.style.transform='translateX(-110%)';side.style.opacity='0';side.style.pointerEvents='none';side.style.width='0';side.style.minWidth='0';
        if(next){next.style.marginLeft='0';next.style.width='100%';next.style.flex='1 1 100%';}
        btn.textContent='☰';btn.style.left='12px';btn.title='Open sidebar';
      }else{
        Object.assign(side.style,{display:orig.display,transform:orig.transform,width:orig.width,minWidth:orig.minWidth,opacity:orig.opacity,pointerEvents:orig.pointer,transition:orig.transition});
        if(next){next.style.marginLeft=orig.nextMargin;next.style.width=orig.nextWidth;next.style.flex=orig.nextFlex;}
        const w=Math.max(160,side.getBoundingClientRect().width||260);btn.textContent='‹';btn.style.left=Math.max(12,w-20)+'px';btn.title='Sluit sidebar';
      }
    }
    let hidden=localStorage.getItem('scholark_sidebar_closed')==='1';apply(hidden);btn.onclick=()=>{hidden=!hidden;apply(hidden);};
  }

  function hasPricing(){return exactText('SCHOLARK Free')&&exactText('SCHOLARK Plus')&&exactText('SCHOLARK Pro');}
  function cardFor(title){
    let el=exactText(title); if(!el) return null;
    let cur=el;
    while(cur&&cur!==document.body){
      const t=textOf(cur);
      const hasButton=!!$('button,a',cur);
      const containsOthers=['SCHOLARK Free','SCHOLARK Plus','SCHOLARK Pro'].filter(x=>t.includes(x)).length;
      if(hasButton&&containsOthers===1&&t.includes(title)) return cur;
      cur=cur.parentElement;
    }
    return el.parentElement;
  }
  function priceCopy(lang){
    if(lang==='nl') return {
      title:'Kies hoeveel voorsprong je wilt.',sub:'Plus en Pro hebben 7 dagen gratis proefperiode. Pro is de volledige creator + future-learning ervaring.',
      freeDesc:'Voor leren, plannen en dagelijks AI-gebruik.',plusDesc:'Voor creëren, research en sneller werken.',proDesc:'Voor maximale AI-kwaliteit, creators en studenten die vooruit willen lopen.',
      free:['AI Tutor','Adaptive practice & mastery','Planner, doelen & studiekeuze','100 AI-tekstverzoeken per dag','8 AI-afbeeldingen per dag'],
      plus:['Alles in Free','Studio Builder: Presentatie, Webpagina, Document, Sociaal & Grafisch','Max 4 actieve creaties per Studio-type — verwijder er minimaal 1 om verder te gaan','Natural Rewrite — 2 keer per dag','Research met webbronnen','350 AI-tekstverzoeken per dag','25 AI-afbeeldingen per dag'],
      pro:['Alles in Plus','Hoogste kwaliteit SCHOLARK AI','MOST POPULAR','Onbeperkte Studio-creaties','Natural Rewrite volledig','Book Studio: boekideeën, lengte, structuur, hoofdstukken & schrijfcoaching','Study Ahead: leer alvast over je toekomstige studie en bouw een voorsprong op','Schools Near Me','Geavanceerde research & broncontrole','1.000 AI-tekstverzoeken per dag','60 AI-afbeeldingen per dag'],
      startFree:'Start gratis',startPlus:'Start Plus free trial',startPro:'Start Pro free trial',popular:'MOST POPULAR'
    };
    return {
      title:'Choose how far ahead you want to go.',sub:'Plus and Pro include a 7-day free trial. Pro is the full creator + future-learning experience.',
      freeDesc:'For learning, planning and everyday AI.',plusDesc:'For creating, research and faster workflows.',proDesc:'For maximum AI quality, creators and students who want to get ahead.',
      free:['AI Tutor','Adaptive practice & mastery','Planner, goals & study choice','100 AI text requests per day','8 AI images per day'],
      plus:['Everything in Free','Studio Builder: Presentation, Webpage, Document, Social & Graphic','Max 4 active creations per Studio type — delete at least 1 to continue','Natural Rewrite — 2 uses per day','Research with web sources','350 AI text requests per day','25 AI images per day'],
      pro:['Everything in Plus','Highest-quality SCHOLARK AI','Unlimited Studio creations','Full Natural Rewrite','Book Studio: ideas, length, structure, chapters & writing coaching','Study Ahead: learn your future study early and build an advantage','Schools Near Me','Advanced research & source checking','1,000 AI text requests per day','60 AI images per day'],
      startFree:'Start free',startPlus:'Start Plus free trial',startPro:'Start Pro free trial',popular:'MOST POPULAR'
    };
  }
  function injectPricing(){
    if(!hasPricing()) return;
    const lang=detectLanguage();
    const existing=$('#v26-pricing');
    if(existing&&existing.dataset.lang===lang) return;
    if(existing) existing.remove();
    const cards=['SCHOLARK Free','SCHOLARK Plus','SCHOLARK Pro'].map(cardFor);
    if(cards.some(x=>!x)) return;
    const legacyButtons=cards.map(c=>$('button,a',c));
    cards.forEach(c=>{c.dataset.v26OldPricing='1';c.style.display='none';});
    const c=priceCopy(lang);
    const sec=document.createElement('section');sec.id='v26-pricing';sec.dataset.lang=lang;
    const li=arr=>arr.map(x=>`<li>${esc(x)}</li>`).join('');
    sec.innerHTML=`<div class="v26-price-title"><h2>${esc(c.title)}</h2><p>${esc(c.sub)}</p></div><div class="v26-price-grid">
      <article class="v26-plan"><div class="kicker">FREE</div><h3>SCHOLARK Free</h3><div class="desc">${esc(c.freeDesc)}</div><div class="v26-price">$0 <small>/ month</small></div><ul>${li(c.free)}</ul><button class="plan-btn" data-plan="0">${esc(c.startFree)}</button></article>
      <article class="v26-plan plus"><div class="kicker">PLUS</div><h3>SCHOLARK Plus</h3><div class="desc">${esc(c.plusDesc)}</div><div class="v26-price">$14.99 <small>/ month</small></div><ul>${li(c.plus)}</ul><button class="plan-btn" data-plan="1">${esc(c.startPlus)}</button></article>
      <article class="v26-plan pro"><span class="v26-most">${esc(c.popular)}</span><div class="kicker">PRO</div><h3>SCHOLARK Pro</h3><div class="desc">${esc(c.proDesc)}</div><div class="v26-price">$19.99 <small>/ month</small></div><ul>${li(c.pro)}</ul><button class="plan-btn" data-plan="2">${esc(c.startPro)}</button></article>
    </div>`;
    cards[0].parentNode.insertBefore(sec,cards[0]);
    $$('.plan-btn',sec).forEach(b=>b.onclick=()=>legacyButtons[Number(b.dataset.plan)]?.click());
  }

  function isHomeView(){
    if(hasPricing()) return false;
    const t=textOf(document.body);
    return t.includes('Dashboard')&&t.includes('Studio AI')&&(t.includes('Education & Learning')||t.includes('My SCHOLARK'));
  }
  function injectHero(){
    if(!isHomeView()||$('#v26-hero')) return;
    const lang=detectLanguage();
    const copy=lang==='nl'?{
      eyebrow:'LEARN • CREATE • BUILD YOUR FUTURE',title:'Maak van één idee een <span>voorsprong.</span>',p:'SCHOLARK brengt leren, creëren, research, toekomstplanning en AI samen in één premium workspace. Geen leeg scherm. Geen losse tools. Van idee naar resultaat.',start:'Open SCHOLARK Studio',future:'Ontdek je toekomst'
    }:{eyebrow:'LEARN • CREATE • BUILD YOUR FUTURE',title:'Turn one idea into an <span>advantage.</span>',p:'SCHOLARK brings learning, creation, research, future planning and AI into one premium workspace. No blank screen. No disconnected tools. From idea to finished result.',start:'Open SCHOLARK Studio',future:'Explore your future'};
    const hero=document.createElement('section');hero.id='v26-hero';hero.dataset.lang=lang;hero.innerHTML=`<div class="v26-hero-grid"><div class="v26-hero-copy"><div class="v26-eyebrow">✦ ${copy.eyebrow}</div><h1>${copy.title}</h1><p>${esc(copy.p)}</p><div class="v26-hero-actions"><button class="v26-primary">${esc(copy.start)}</button><button class="v26-secondary">${esc(copy.future)}</button></div><div class="v26-chips"><span class="v26-chip">Presentations</span><span class="v26-chip">Reports</span><span class="v26-chip">Websites</span><span class="v26-chip">Books</span><span class="v26-chip">Study Ahead</span><span class="v26-chip">Schools Near Me</span></div></div><div class="v26-showcase"><div class="v26-orbit"></div><div class="v26-orbit two"></div><div class="v26-center"><div><b>S✦</b><span>SCHOLARK AI</span></div></div><div class="v26-float v26-f1">▣ Presentation</div><div class="v26-float v26-f2">▤ Webpage</div><div class="v26-float v26-f3">▧ Document</div><div class="v26-float v26-f4">◇ Future</div></div></div>`;
    const anchor=$('#v25-ad-future')||$('#v25-ad-studio')||$('#sv24-explainer');
    const host=anchor?.parentNode||$('main')||$('[role="main"]')||document.body;
    host.insertBefore(hero,anchor||host.firstChild);
    $('.v26-primary',hero).onclick=()=>$('#sv24-launch')?.click();
    $('.v26-secondary',hero).onclick=()=>{const ad=$('#v25-ad-future');if(ad)ad.scrollIntoView({behavior:'smooth',block:'center'});};
  }

  const presenterText={
    nl:{
      future:[['Maya','Je toekomst begint niet pas wanneer je bent ingeschreven. Met Study Ahead kun je nu al ontdekken wat je toekomstige studie vraagt en waar je alvast aan kunt werken.'],['Noah','Met Schools Near Me vind je scholen rondom jouw locatie, zodat je sneller ziet welke mogelijkheden dichtbij zijn.']],
      studio:[['Maya','In SCHOLARK Studio begin je niet met een leeg scherm. Beschrijf wat je wilt maken en SCHOLARK bouwt de eerste versie voor je.'],['Noah','Je kunt presentaties, webpagina’s, documenten, social content en graphics maken. Met Pro krijg je ook Book Studio en de hoogste AI-kwaliteit.']],
      play:'▶ Laat de AI-presenters uitleggen'
    },
    en:{
      future:[['Maya','Your future does not start only after you enroll. Study Ahead helps you understand what your future degree may require and what you can start learning now.'],['Noah','Schools Near Me helps you discover schools around your current location, so you can compare nearby options much faster.']],
      studio:[['Maya','In SCHOLARK Studio you never have to start from a blank screen. Describe what you want to create and SCHOLARK builds the first version for you.'],['Noah','Create presentations, webpages, documents, social content and graphics. With Pro, you also unlock Book Studio and the highest AI quality.']],
      play:'▶ Let the AI presenters explain'
    }
  };
  function pickVoices(prefix){
    const all=speechSynthesis.getVoices();
    const list=all.filter(v=>(v.lang||'').toLowerCase().startsWith(prefix));
    const quality=['natural','neural','online','premium','google','microsoft','samantha','jenny','aria','sonia','libby','ryan','guy','fenna','colette','maarten','xander'];
    return list.sort((a,b)=>{
      const score=v=>quality.reduce((n,k)=>n+((v.name||'').toLowerCase().includes(k)?3:0),0)+(v.localService?0:1);
      return score(b)-score(a);
    });
  }
  function speakPresenter(sec,kind){
    if(!('speechSynthesis' in window)) return;
    const lang=detectLanguage(), locale=lang==='nl'?'nl-NL':'en-US', lines=presenterText[lang][kind];
    speechSynthesis.cancel();
    const voices=pickVoices(lang);let i=0;
    function go(){
      if(i>=lines.length){$$('.v25-person',sec).forEach(x=>x.classList.remove('talking'));return;}
      const [name,text]=lines[i];
      const host=$(`[data-host="${name}"]`,sec);$$('.v25-person',sec).forEach(x=>x.classList.remove('talking'));host?.classList.add('talking');
      const u=new SpeechSynthesisUtterance(text);u.lang=locale;u.rate=lang==='nl'?.94:.96;u.pitch=i===0?1.04:.96;u.volume=1;
      if(voices.length) u.voice=voices[Math.min(i,voices.length-1)];
      u.onend=()=>{host?.classList.remove('talking');i++;setTimeout(go,140);};
      u.onerror=()=>{host?.classList.remove('talking');i++;go();};speechSynthesis.speak(u);
    }
    if(!speechSynthesis.getVoices().length){speechSynthesis.onvoiceschanged=()=>{speechSynthesis.onvoiceschanged=null;go();};setTimeout(()=>{if(i===0)go();},700);} else go();
  }
  function upgradePresenters(){
    ['future','studio'].forEach(kind=>{
      const sec=$('#v25-ad-'+kind);if(!sec)return;const lang=detectLanguage();const lines=presenterText[lang][kind];
      const persons=$$('.v25-person',sec);persons.forEach((p,i)=>{const cap=$('.v25-caption',p);if(cap&&lines[i])cap.innerHTML=`<b>${esc(lines[i][0])}</b>${esc(lines[i][1])}`;});
      let btn=$('.v25-play',sec);if(!btn)return;btn.textContent=presenterText[lang].play;
      if(btn.dataset.v26Voice==='1')return;
      const clone=btn.cloneNode(true);clone.dataset.v26Voice='1';clone.innerHTML=esc(presenterText[lang].play)+' <span class="v26-voice-note"><i class="v26-voice-dot"></i>'+esc(lang==='nl'?'stem past zich aan de taal aan':'voice follows site language')+'</span>';
      btn.replaceWith(clone);clone.onclick=()=>speakPresenter(sec,kind);
    });
  }

  let lastLang='';
  function sync(){
    setupSidebar();injectPricing();injectHero();upgradePresenters();
    const lang=detectLanguage();
    if(lastLang&&lastLang!==lang){$('#v26-pricing')?.remove();$('#v26-hero')?.remove();$$('[data-v26-old-pricing="1"]').forEach(x=>x.style.display='');}
    lastLang=lang;
  }
  const mo=new MutationObserver(()=>{clearTimeout(window.__v26SyncT);window.__v26SyncT=setTimeout(sync,120);});
  mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','lang']});
  window.addEventListener('hashchange',()=>setTimeout(sync,80));
  window.addEventListener('popstate',()=>setTimeout(sync,80));
  setInterval(sync,900);
  setTimeout(sync,50);
})();