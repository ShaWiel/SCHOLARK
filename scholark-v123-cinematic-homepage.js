(() => {
  'use strict';
  if (window.__SCHOLAVERUM_R279_HOME__) return;
  window.__SCHOLAVERUM_R279_HOME__ = true;
  const doc = document;
  const $ = (selector, root = doc) => root.querySelector(selector);
  const $$ = (selector, root = doc) => Array.from(root.querySelectorAll(selector));
  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const route = () => String(location.hash || '').replace(/^#/, '').split(/[?&]/)[0].toLowerCase();
  const isLanding = () => (location.pathname === '/' || location.pathname === '/index.html') && ['', 'home', 'pricing', 'start'].includes(route());
  const lang = () => localStorage.getItem('scholark_ui_language') || doc.documentElement.lang || 'en';

  const style = doc.createElement('style');
  style.id = 'scholaverum-r279-cinematic-home-style';
  style.textContent = [
    'body.v123-cinematic-home{background:#edf0e8!important}',
    'body.v123-cinematic-home #v55-topbar{background:rgba(9,13,24,.96)!important;border-bottom:1px solid rgba(255,255,255,.1)!important;box-shadow:none!important}',
    'body.v123-cinematic-home #v55-topbar .v55-brand{flex-shrink:0}',
    '#v123-home-nav{display:flex;align-items:center;justify-content:center;gap:4px;flex:1 1 auto;min-width:0}',
    '#v123-home-nav[hidden]{display:none!important}',
    '#v123-home-nav button{background:transparent;color:#cbd0d9;border:0;border-radius:999px;white-space:nowrap;padding:10px 13px;cursor:pointer;font:750 11px/1.2 Inter,system-ui,sans-serif;transition:background .18s,color .18s}',
    '#v123-home-nav button:hover,#v123-home-nav button:focus-visible{background:rgba(255,255,255,.10);color:white;outline-offset:3px}',
    '#v123-home-nav button[aria-current="true"]{color:#d5fa8e;background:rgba(205,255,119,.1)}',
    '#v123-progress{position:fixed;z-index:2147483599;top:0;left:0;width:100%;height:3px;pointer-events:none;transform-origin:left center;transform:scaleX(0);background:linear-gradient(90deg,#c9ff6a,#a8df75,#8a7dff);box-shadow:0 0 12px rgba(201,255,106,.35)}',
    '#v29-home-layer.v30-native-home{background:linear-gradient(180deg,#edf0e8 0%,#f8f8f5 55%,#edf0e8 100%)!important;color:#111620}',
    '#v29-home-layer .v29-shell{max-width:1620px;padding:12px clamp(12px,2.3vw,38px) 80px}',
    '#v29-home-layer .v29-hero{isolation:isolate;min-height:min(800px,calc(100svh - 92px));padding:clamp(30px,4.6vw,78px);border:1px solid rgba(255,255,255,.08);border-radius:32px;background:radial-gradient(ellipse at 78% 52%,rgba(108,88,255,.22),transparent 44%),radial-gradient(circle at 85% 8%,rgba(201,255,106,.11),transparent 33%),linear-gradient(128deg,#090e18 4%,#101625 56%,#1a2141 100%);box-shadow:0 40px 110px rgba(10,19,33,.22)}',
    '#v29-home-layer .v29-hero::before{opacity:.55;mask-image:linear-gradient(to bottom,#000,transparent 95%);background-size:64px 64px}',
    '#v29-home-layer .v29-hero::after{content:"";position:absolute;right:-19%;top:-43%;width:min(900px,70vw);aspect-ratio:1;border:1px solid rgba(207,255,138,.12);border-radius:50%;box-shadow:0 0 0 82px rgba(207,255,138,.025),0 0 0 180px rgba(158,143,255,.02);pointer-events:none;z-index:0;transform:translate3d(var(--v123-x,0px),var(--v123-y,0px),0)}',
    '#v29-home-layer .v29-hero-grid{grid-template-columns:minmax(0,1.02fr) minmax(0,.98fr);min-height:610px;gap:clamp(28px,4vw,78px);align-items:center}',
    '#v29-home-layer .v29-hero-copy{min-width:0}',
    '#v29-home-layer .v29-pill{background:rgba(201,255,106,.07);border-color:rgba(201,255,106,.22);padding:10px 15px;letter-spacing:.18em;color:#d4ff91}',
    '#v29-home-layer .v29-hero h1{font:900 clamp(53px,6.35vw,112px)/.91 Inter,system-ui,sans-serif;letter-spacing:-.073em;margin:26px 0 24px;max-width:11.5ch;text-wrap:balance}',
    '#v29-home-layer .v29-hero h1 em{background:linear-gradient(110deg,#c9ff6a,#edffbc);color:transparent;background-clip:text;-webkit-background-clip:text}',
    '#v29-home-layer .v29-hero-copy>p{font-size:clamp(14px,1.14vw,18px);max-width:545px;line-height:1.7;color:#c3cbd8;font-weight:480}',
    '#v29-home-layer .v29-prompt{border-radius:19px;background:#f9faf7;border:1px solid rgba(255,255,255,.68);margin-top:29px;max-width:650px;padding:7px 7px 7px 13px;box-shadow:0 20px 70px rgba(0,0,0,.29);transition:box-shadow .2s,transform .2s}',
    '#v29-home-layer .v29-prompt:focus-within{box-shadow:0 0 0 3px rgba(201,255,106,.45),0 24px 76px rgba(0,0,0,.29);transform:translateY(-2px)}',
    '#v29-home-layer .v29-prompt textarea{font-size:13px;color:#171b24;font-weight:550;min-height:49px}',
    '#v29-home-layer .v29-prompt button{background:#c9ff6a;color:#121b19;border-radius:14px;padding:17px 19px;font-size:12px;min-height:50px}',
    '#v29-home-layer .v29-prompt button span{color:inherit}',
    '#v29-home-layer .v29-types{margin-top:16px;gap:6px}',
    '#v29-home-layer .v29-type{font-size:10px;padding:10px 13px;background:rgba(255,255,255,.035);border-color:rgba(255,255,255,.14);border-radius:12px}',
    '#v29-home-layer .v29-type.active,#v29-home-layer .v29-type:hover{background:#c9ff6a;border-color:#c9ff6a;color:#12171c}',
    '#v29-home-layer .v29-metrics{border-top:1px solid rgba(255,255,255,.14);padding-top:17px;margin-top:24px;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}',
    '#v29-home-layer .v29-metric{padding:10px 0;background:transparent;border:0;border-radius:0}',
    '#v29-home-layer .v29-metric b{font-size:17px;letter-spacing:-.03em}',
    '#v29-home-layer .v29-metric span{font-size:9px;color:#9aa5b8;line-height:1.5}',
    '#v29-home-layer .v29-visual{min-height:530px;filter:drop-shadow(0 35px 80px rgba(0,0,0,.12))}',
    '#v29-home-layer .v29-device{inset:36px 4px 25px 24px;border-radius:25px;background:#edf0eb;border:1px solid rgba(255,255,255,.7);box-shadow:0 42px 90px rgba(0,0,0,.46),0 0 90px rgba(164,154,255,.16)}',
    '#v29-home-layer .v29-device-top{height:47px;border-color:#e3e5e9}',
    '#v29-home-layer .v29-device-body{height:calc(100% - 47px)}',
    '#v29-home-layer .v29-float{border-radius:13px;border-color:rgba(204,255,115,.21);font-size:10px;box-shadow:0 18px 60px rgba(0,0,0,.35)}',
    '#v29-home-layer #v123-hero-cta{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:20px}',
    '#v29-home-layer .v123-secondary{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:42px;background:transparent;color:#eef5ee;border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:10px 17px;cursor:pointer;font-size:11px;font-weight:800;transition:.2s}',
    '#v29-home-layer .v123-secondary:hover{background:rgba(255,255,255,.12);transform:translateY(-2px)}',
    '#v29-home-layer .v123-microcopy{font-size:11px;font-weight:650;color:#aebac8;letter-spacing:.02em}',
    '#v29-home-layer .v123-section-label{display:block;font:850 10px/1.5 Inter,system-ui;letter-spacing:.22em;text-transform:uppercase;color:#687b55}',
    '#v29-home-layer .v123-story{position:relative;padding:clamp(90px,11vw,170px) clamp(5px,1.2vw,20px) clamp(40px,6vw,90px)}',
    '#v29-home-layer .v123-story-header{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:end;margin-bottom:36px}',
    '#v29-home-layer .v123-story-header h2{font:900 clamp(54px,7.3vw,116px)/.91 Inter,system-ui;letter-spacing:-.074em;max-width:900px;margin:16px 0 0;color:#101723;text-wrap:balance}',
    '#v29-home-layer .v123-story-header h2 em{color:#6254d4;font-style:normal}',
    '#v29-home-layer .v123-story-header p{font:520 clamp(15px,1.4vw,19px)/1.65 Inter,system-ui;color:#58606d;max-width:480px;margin:0 0 7px auto}',
    '#v29-home-layer .v123-story-grid{display:grid;grid-template-columns:1.18fr .91fr .91fr;gap:14px}',
    '#v29-home-layer .v123-story-card{position:relative;overflow:hidden;isolation:isolate;min-height:400px;padding:30px;border-radius:25px;background:#fff;border:1px solid rgba(16,22,34,.07);transition:transform .3s ease,box-shadow .3s ease}',
    '#v29-home-layer .v123-story-card:hover{transform:translateY(-7px);box-shadow:0 28px 70px rgba(28,34,51,.12)}',
    '#v29-home-layer .v123-story-card:first-child{background:#121827;color:#fff}',
    '#v29-home-layer .v123-story-card:nth-child(2){background:#dcfac0}',
    '#v29-home-layer .v123-story-card:last-child{background:#e8e6ff}',
    '#v29-home-layer .v123-card-number{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:13px;border:1px solid currentColor;font-size:12px;font-weight:850;opacity:.72}',
    '#v29-home-layer .v123-story-card h3{position:relative;z-index:2;font:900 clamp(27px,2.65vw,42px)/1.03 Inter,system-ui;letter-spacing:-.055em;max-width:410px;margin:45px 0 12px}',
    '#v29-home-layer .v123-story-card p{position:relative;z-index:2;font:550 12px/1.65 Inter,system-ui;max-width:300px;opacity:.76}',
    '#v29-home-layer .v123-orbit{position:absolute;right:-45px;bottom:-118px;width:340px;aspect-ratio:1;border:2px solid rgba(201,255,106,.3);border-radius:50%;box-shadow:0 0 0 40px rgba(201,255,106,.065),0 0 0 100px rgba(201,255,106,.03);pointer-events:none}',
    '#v29-home-layer .v123-orbit::before{content:"✦";position:absolute;top:5%;left:10%;font-size:55px;color:#c9ff6a;filter:drop-shadow(0 0 20px rgba(201,255,106,.44))}',
    '#v29-home-layer .v123-signal{position:absolute;right:-20px;bottom:-48px;width:255px;height:170px;transform:rotate(-19deg);border:17px solid rgba(19,55,27,.18);border-top-color:#192c27;border-radius:90px;box-shadow:0 -34px 0 -20px rgba(19,55,27,.3),0 30px 0 -23px rgba(19,55,27,.14);pointer-events:none}',
    '#v29-home-layer .v123-sphere{position:absolute;right:-30px;bottom:-100px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle at 28% 24%,#fff 0%,#bab4ff 23%,#6756d4 59%,#19194c 94%);box-shadow:inset -32px -18px 50px rgba(9,4,63,.45),0 42px 55px rgba(60,47,139,.16)}',
    '#v29-home-layer .v29-section{padding:clamp(76px,9vw,140px) clamp(6px,1vw,18px)}',
    '#v29-home-layer .v29-head{margin-bottom:40px;gap:50px}',
    '#v29-home-layer .v29-head h2{font-size:clamp(47px,6.4vw,92px);max-width:850px;letter-spacing:-.065em;color:#121825}',
    '#v29-home-layer .v29-head p{font-size:15px;line-height:1.7;color:#596372}',
    '#v29-home-layer .v29-kicker{letter-spacing:.2em;font-size:10px;color:#665ad5}',
    '#v29-home-layer .v29-studio{background:rgba(255,255,255,.9);padding:clamp(12px,2vw,26px);border-radius:30px;box-shadow:0 35px 90px rgba(40,45,66,.08)}',
    '#v29-home-layer .v29-tabs{gap:7px}',
    '#v29-home-layer .v29-tab{border-radius:14px;background:#f1f2ed;padding:16px}',
    '#v29-home-layer .v29-tab.active{background:#141b2b;color:#fff}',
    '#v29-home-layer .v29-stage-copy{background:#f1f3ed;border-radius:24px;padding:clamp(22px,3vw,40px)}',
    '#v29-home-layer .v29-stage-copy h3{font-size:clamp(32px,3.3vw,54px);line-height:1;max-width:560px}',
    '#v29-home-layer .v29-stage-copy p{font-size:14px;line-height:1.7}',
    '#v29-home-layer .v29-stage-preview{background:radial-gradient(circle at 80% 10%,#4b447b,transparent 50%),#101727;border-radius:24px}',
    '#v29-home-layer .v29-bento{gap:15px}',
    '#v29-home-layer .v29-bento-card{border-radius:25px}',
    '#v29-home-layer .v29-future{background:radial-gradient(ellipse at 75% 20%,rgba(121,107,255,.26),transparent 45%),#111825;border-radius:30px;padding:clamp(30px,4.5vw,74px)}',
    '#v29-home-layer .v29-future-copy h2{font-size:clamp(45px,5.9vw,85px)}',
    '#v29-home-layer .v29-final{border-radius:28px;background:linear-gradient(120deg,#141a2a,#222447 85%);padding:clamp(30px,4.5vw,70px)}',
    '#v29-home-layer .v29-final h2{font-size:clamp(44px,5.6vw,83px)}',
    '#v29-home-layer [data-v123-reveal]{opacity:1;transform:none}',
    'html.v123-motion-ready #v29-home-layer [data-v123-reveal]:not(.v123-visible){opacity:0;transform:translateY(26px)}',
    'html.v123-motion-ready #v29-home-layer [data-v123-reveal]{transition:opacity .72s ease,transform .72s cubic-bezier(.2,.7,.2,1)}',
    '@media(max-width:1250px){#v123-home-nav{gap:1px}#v123-home-nav button{padding:9px 8px;font-size:10px}#v29-home-layer .v29-hero-grid{gap:26px}#v29-home-layer .v29-hero h1{font-size:clamp(54px,6vw,80px)}}',
    '@media(max-width:1060px){#v123-home-nav{display:none}#v29-home-layer .v29-hero{min-height:auto}#v29-home-layer .v29-hero-grid{grid-template-columns:1fr;min-height:0}#v29-home-layer .v29-hero h1{max-width:13ch}#v29-home-layer .v29-visual{min-height:480px}#v29-home-layer .v123-story-header{grid-template-columns:1fr}#v29-home-layer .v123-story-header p{margin:0;max-width:660px}#v29-home-layer .v123-story-grid{grid-template-columns:1fr 1fr}#v29-home-layer .v123-story-card:first-child{grid-column:span 2}#v29-home-layer .v123-story-card{min-height:290px}}',
    '@media(max-width:640px){#v29-home-layer .v29-shell{padding:8px 10px 54px}#v29-home-layer .v29-hero{padding:32px 22px 25px;border-radius:22px}#v29-home-layer .v29-hero h1{font-size:clamp(47px,12.4vw,70px);letter-spacing:-.065em}#v29-home-layer .v29-hero-copy>p{font-size:13px}#v29-home-layer .v29-visual{min-height:355px;margin-top:8px}#v29-home-layer .v29-device{inset:20px 6px 23px 5px;transform:none;animation:none;border-radius:17px}#v29-home-layer .v29-preview{padding:12px}#v29-home-layer .v29-device-body{grid-template-columns:48px 1fr}#v29-home-layer .v29-mini{padding:8px 4px}#v29-home-layer .v29-float{font-size:8px;padding:8px}#v29-home-layer .v29-types{gap:6px}#v29-home-layer .v29-type{font-size:9px;padding:8px}#v29-home-layer .v29-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}#v29-home-layer .v29-prompt{flex-direction:column;align-items:stretch;padding:9px}#v29-home-layer .v29-prompt button{width:100%}#v29-home-layer .v123-story{padding:80px 4px 34px}#v29-home-layer .v123-story-header h2{font-size:clamp(45px,12vw,72px)}#v29-home-layer .v123-story-grid{grid-template-columns:1fr}#v29-home-layer .v123-story-card:first-child{grid-column:auto}#v29-home-layer .v123-story-card{min-height:305px;padding:25px}#v29-home-layer .v29-section{padding:74px 4px}#v29-home-layer .v29-head h2{font-size:clamp(43px,11.5vw,66px)}#v29-home-layer .v29-future{border-radius:22px;padding:26px 18px}#v29-home-layer .v29-final{margin-top:40px;border-radius:22px}}',
    '@media(prefers-reduced-motion:reduce){#v29-home-layer .v29-hero::after{transform:none!important}#v29-home-layer .v123-story-card,#v29-home-layer [data-v123-reveal],#v123-home-nav button{transition:none!important;animation:none!important;transform:none!important;opacity:1!important}#v29-home-layer .v29-glow,#v29-home-layer .v29-device,#v29-home-layer .v29-float{animation:none!important}}'
  ].join('\n');
  doc.head.appendChild(style);

  const BASE = {
    'nav.experience':'Experience',
    'nav.features':'Features',
    'nav.discover':'Discover',
    'nav.getStarted':'Get started',
    'hero.explore':'Explore the experience',
    'hero.note':'See what one connected learning space can do',
    'story.eyebrow':'A BETTER WAY TO LEARN',
    'story.headline':'Your potential. No limits.',
    'story.description':'From your first question to your next big milestone, everything connects in one place.',
    'story.oneTitle':'Ask. Understand. Create.',
    'story.oneBody':'Start with ARKI. Turn ideas, questions and difficult subjects into meaningful progress.',
    'story.twoTitle':'Practise with purpose.',
    'story.twoBody':'Your AI Tutor, flashcards and progress tools help you focus on what needs attention.',
    'story.threeTitle':'Know what comes next.',
    'story.threeBody':'Find schools, explore future studies and build momentum before the next chapter.'
  };
  const NL = {
    'nav.experience':'Ervaring','nav.features':'Functies','nav.discover':'Ontdek','nav.getStarted':'Beginnen',
    'hero.explore':'Ontdek de ervaring','hero.note':'Ontdek wat één verbonden leeromgeving kan doen',
    'story.eyebrow':'SLIMMER LEREN','story.headline':'Jouw potentieel. Geen grenzen.',
    'story.description':'Van je eerste vraag tot je volgende grote mijlpaal: alles komt samen op één plek.',
    'story.oneTitle':'Vraag. Begrijp. Creëer.','story.oneBody':'Begin met ARKI. Zet ideeën, vragen en moeilijke onderwerpen om in echte vooruitgang.',
    'story.twoTitle':'Oefen met een doel.','story.twoBody':'Je AI Tutor, flashcards en voortgangstools helpen je focussen op wat aandacht nodig heeft.',
    'story.threeTitle':'Weet wat er volgt.','story.threeBody':'Vind scholen, ontdek toekomstige studies en bereid je voor op je volgende stap.'
  };
  const translations = new Map([['en', BASE],['nl',NL]]);
  const pendingTranslations = new Map();
  let translationEpoch = 0;
  function setText(root, dictionary) {
    if (!root) return;
    $$('[data-v123-copy]',root).forEach(el => {
      const key = el.dataset.v123Copy;
      el.textContent = dictionary[key] || BASE[key] || '';
    });
  }
  async function translate() {
    const current = lang(), epoch = ++translationEpoch;
    const roots = [$('#v123-home-nav'),$('#v123-hero-cta'),$('#v123-story')];
    const fallback = translations.get(current) || BASE;
    roots.forEach(root => setText(root,fallback));
    if (translations.has(current)) return;
    const api = window.__SCHOLARK_I18N__;
    if (!api || typeof api.translateStrings !== 'function') {
      roots.forEach(root => { try { api?.apply?.(root); } catch {} });
      return;
    }
    try {
      if (!pendingTranslations.has(current)) {
        const pending = Promise.resolve(api.translateStrings(current, Object.values(BASE), 'r279_home_experience'));
        pendingTranslations.set(current,pending);
        pending.finally(()=>{ if(pendingTranslations.get(current)===pending) pendingTranslations.delete(current); }).catch(()=>{});
      }
      const translated = await pendingTranslations.get(current);
      if (epoch !== translationEpoch || current !== lang()) return;
      const out = {};
      Object.keys(BASE).forEach(key => { out[key] = translated?.[BASE[key]] || BASE[key]; });
      translations.set(current,out);
      roots.forEach(root => setText(root,out));
    } catch {
      // Translation failures must never interrupt the homepage or navigation.
    }
  }

  function scrollToSection(name) {
    const selector = {
      experience:'#v123-story',
      features:'#v29-studio',
      discover:'#v123-discover',
      getStarted:'#v29-final-open'
    }[name];
    const target = selector && $(selector);
    if (!target) return;
    target.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
  }
  function buildStory(layer) {
    if (!layer || $('#v123-story',layer)) return;
    const hero = $('.v29-hero',layer);
    if (!hero) return;
    const call = doc.createElement('div');
    call.id = 'v123-hero-cta';
    call.innerHTML = '<button class="v123-secondary" type="button" data-v123-scroll="experience"><span data-v123-copy="hero.explore">Explore the experience</span><span aria-hidden="true">↘</span></button><span class="v123-microcopy" data-v123-copy="hero.note">See what one connected learning space can do</span>';
    $('.v29-hero-copy',hero)?.appendChild(call);

    const story = doc.createElement('section');
    story.id = 'v123-story';
    story.className = 'v123-story';
    story.setAttribute('aria-labelledby','v123-story-title');
    story.innerHTML =
      '<div class="v123-story-header" data-v123-reveal><div><span class="v123-section-label" data-v123-copy="story.eyebrow">A BETTER WAY TO LEARN</span><h2 id="v123-story-title" data-v123-copy="story.headline">Your potential. No limits.</h2></div><p data-v123-copy="story.description">From your first question to your next big milestone, everything connects in one place.</p></div>'+
      '<div class="v123-story-grid">'+
      '<article class="v123-story-card" data-v123-reveal><span class="v123-card-number">01</span><h3 data-v123-copy="story.oneTitle">Ask. Understand. Create.</h3><p data-v123-copy="story.oneBody">Start with ARKI. Turn ideas, questions and difficult subjects into meaningful progress.</p><div class="v123-orbit" aria-hidden="true"></div></article>'+
      '<article class="v123-story-card" data-v123-reveal><span class="v123-card-number">02</span><h3 data-v123-copy="story.twoTitle">Practise with purpose.</h3><p data-v123-copy="story.twoBody">Your AI Tutor, flashcards and progress tools help you focus on what needs attention.</p><div class="v123-signal" aria-hidden="true"></div></article>'+
      '<article class="v123-story-card" data-v123-reveal><span class="v123-card-number">03</span><h3 data-v123-copy="story.threeTitle">Know what comes next.</h3><p data-v123-copy="story.threeBody">Find schools, explore future studies and build momentum before the next chapter.</p><div class="v123-sphere" aria-hidden="true"></div></article>'+
      '</div>';
    hero.insertAdjacentElement('afterend',story);
    const discover = $('.v29-future',layer)?.closest('section');
    if (discover && !discover.id) discover.id = 'v123-discover';
    $$('.v29-section .v29-head, .v29-final',layer).forEach(el=>el.setAttribute('data-v123-reveal',''));
  }

  function buildNavigation() {
    const bar = $('#v55-topbar');
    if (!bar || !isLanding() || $('#v123-home-nav',bar)) return;
    const nav = doc.createElement('nav');
    nav.id = 'v123-home-nav';
    nav.setAttribute('aria-label','Homepage sections');
    nav.innerHTML = [
      ['experience','nav.experience','Experience'],
      ['features','nav.features','Features'],
      ['discover','nav.discover','Discover'],
      ['getStarted','nav.getStarted','Get started']
    ].map(([id,key,label])=>'<button type="button" data-v123-scroll="'+id+'" data-v123-copy="'+key+'">'+label+'</button>').join('');
    const actions = $('.v55-actions',bar);
    if (actions) bar.insertBefore(nav,actions); else bar.appendChild(nav);
  }

  let observer = null;
  function reveal(layer) {
    if (observer || !layer || reduced() || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('v123-visible');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.09,rootMargin:'0px 0px 45px 0px'});
    $$('[data-v123-reveal]',layer).forEach(el=>observer.observe(el));
    doc.documentElement.classList.add('v123-motion-ready');
  }
  let progressFrame = 0;
  function refreshProgress() {
    progressFrame = 0;
    const p = $('#v123-progress');
    if (!p || !isLanding()) return;
    const maximum = Math.max(1,doc.documentElement.scrollHeight - innerHeight);
    p.style.transform = 'scaleX('+Math.max(0,Math.min(1,scrollY/maximum))+')';
    const checkpoints = ['getStarted','discover','features','experience'];
    let active = 'experience';
    for (const name of checkpoints) {
      const node = $(({getStarted:'#v29-final-open',discover:'#v123-discover',features:'#v29-studio',experience:'#v123-story'})[name]);
      if (node && node.getBoundingClientRect().top < innerHeight*.55) { active=name; break; }
    }
    $$('#v123-home-nav button').forEach(btn=>btn.setAttribute('aria-current',btn.dataset.v123Scroll===active?'true':'false'));
  }
  function queueProgress() {
    if (!progressFrame) progressFrame = requestAnimationFrame(refreshProgress);
  }
  let pointerAttached = false;
  function pointerVisual(layer) {
    if (pointerAttached || reduced() || !window.matchMedia?.('(pointer:fine)').matches) return;
    const hero = $('.v29-hero',layer);
    if (!hero) return;
    pointerAttached = true;
    let frame=0,x=0,y=0;
    hero.addEventListener('pointermove',event=>{
      const rect=hero.getBoundingClientRect();
      x=((event.clientX-rect.left)/rect.width-.5)*22;
      y=((event.clientY-rect.top)/rect.height-.5)*22;
      if (!frame) frame=requestAnimationFrame(()=>{
        frame=0;hero.style.setProperty('--v123-x',x.toFixed(1)+'px');hero.style.setProperty('--v123-y',y.toFixed(1)+'px');
      });
    },{passive:true});
    hero.addEventListener('pointerleave',()=>{
      hero.style.setProperty('--v123-x','0px');hero.style.setProperty('--v123-y','0px');
    },{passive:true});
  }
  function sync() {
    const active = isLanding();
    doc.body?.classList.toggle('v123-cinematic-home',active);
    const progress = $('#v123-progress') || (() => {
      const p = doc.createElement('div');p.id='v123-progress';p.setAttribute('aria-hidden','true');doc.body?.appendChild(p);return p;
    })();
    progress.hidden = !active;
    $('#v123-home-nav')?.toggleAttribute('hidden',!active);
    if (!active) return;
    const layer = $('#v29-home-layer');
    if (!layer || layer.hidden) return;
    buildStory(layer);
    buildNavigation();
    pointerVisual(layer);
    reveal(layer);
    translate();
    queueProgress();
  }
  doc.addEventListener('click',event=>{
    const control=event.target.closest?.('[data-v123-scroll]');
    if (control && isLanding()) {
      event.preventDefault();
      scrollToSection(control.dataset.v123Scroll);
    }
  });
  window.addEventListener('scroll',queueProgress,{passive:true});
  window.addEventListener('resize',queueProgress,{passive:true});
  ['scholark:topbar-ready','scholark-runtime-ready','scholark-return-home','scholark-route-painted'].forEach(name=>window.addEventListener(name,()=>setTimeout(sync,30)));
  ['scholark-language-ready','scholark-language-applied','scholark-language-change'].forEach(name=>window.addEventListener(name,()=>setTimeout(translate,80)));
  window.addEventListener('hashchange',()=>setTimeout(sync,80));
  window.addEventListener('pageshow',()=>setTimeout(sync,40));
  [80,400,1200].forEach(ms=>setTimeout(sync,ms));
  window.__SCHOLAVERUM_HOME_EXPERIENCE__={sync,scrollToSection,version:'r279'};
})();