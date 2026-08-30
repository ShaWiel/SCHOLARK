(() => {
  if (window.__SCHOLARK_V30_NATIVE_HOME__) return;
  window.__SCHOLARK_V30_NATIVE_HOME__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const txt=e=>(e?.textContent||'').trim();

  const css=document.createElement('style');
  css.id='v30-native-home-style';
  css.textContent=`
    /* V30: V29 is no longer an overlay. It becomes the actual home content. */
    #v29-home-layer.v30-native-home{
      position:relative!important;inset:auto!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;
      z-index:auto!important;display:block!important;width:100%!important;max-width:none!important;min-width:0!important;min-height:100vh!important;
      overflow:visible!important;overscroll-behavior:auto!important;flex:1 1 auto!important;margin:0!important;
    }
    #v29-home-layer.v30-native-home[hidden]{display:none!important}
    [data-v30-legacy-home="1"]{display:none!important}
    .v30-live-badge{position:absolute;right:16px;top:14px;z-index:8;display:flex;align-items:center;gap:7px;padding:8px 10px;border-radius:999px;background:rgba(12,14,20,.84);backdrop-filter:blur(10px);color:#fff;font:900 9px Inter,system-ui;letter-spacing:.08em;box-shadow:0 10px 26px rgba(0,0,0,.2)}
    .v30-live-badge i{width:7px;height:7px;border-radius:50%;background:#c9ff6a;box-shadow:0 0 0 5px rgba(201,255,106,.13);animation:v30pulse 1.4s ease-in-out infinite}@keyframes v30pulse{50%{opacity:.35;transform:scale(.75)}}
    .v30-demo-status{margin-top:12px;padding:10px 12px;border-radius:13px;background:rgba(109,93,252,.09);border:1px solid rgba(109,93,252,.14);font:750 9.5px/1.4 Inter;color:#5d5680;min-height:38px;transition:.25s ease}
    .v29-future-card .v30-demo-status{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.1);color:#d9d6e4}
    .v30-step{display:inline-flex;align-items:center;gap:6px}.v30-step i{width:6px;height:6px;border-radius:50%;background:#c9ff6a}
    .v30-tutor-demo,.v30-diagnostic-demo{position:absolute;left:28px;right:28px;bottom:24px;border-radius:16px;padding:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);font:700 9.5px/1.45 Inter;color:#eee;min-height:58px;transition:.25s ease}
    .v30-diagnostic-demo{color:#14161b;background:rgba(255,255,255,.38);border-color:rgba(17,19,24,.08)}
    .v30-tutor-demo b,.v30-diagnostic-demo b{display:block;font-size:9px;letter-spacing:.08em;margin-bottom:4px;color:#c9ff6a}.v30-diagnostic-demo b{color:#3d347e}
    .v30-typing-cursor:after{content:'|';animation:v30blink .75s steps(1) infinite}@keyframes v30blink{50%{opacity:0}}
    .v30-auto-note{display:inline-flex;gap:7px;align-items:center;margin-left:8px;font-size:9px;font-weight:850;color:#817c8c}.v30-auto-note:before{content:'↻';color:#6d5dfc;font-size:12px}
    .v29-host{position:relative;overflow:hidden}.v29-host:after{content:'';position:absolute;left:50%;bottom:10px;width:14px;height:3px;border-radius:50%;background:#7a2b2b;transform:translateX(-50%);opacity:0}.v29-host.v30-speaking:after{opacity:1;animation:v30mouth .28s infinite alternate}@keyframes v30mouth{to{height:9px;border-radius:50%}}
    @media(max-width:980px){#v29-home-layer.v30-native-home{width:100%!important}}
  `;
  document.head.appendChild(css);

  function isHome(){
    const h=String(location.hash||'').toLowerCase();
    return (location.pathname==='/'||location.pathname==='') && (h===''||h==='#home'||h==='#pricing');
  }

  function findSidebar(){
    const tokens=['Dashboard','Education & Learning','Studio AI','Planner','Progress'];
    let best=null,score=-1;
    $$('aside,nav,section,div').forEach(el=>{
      if(el.id==='v29-home-layer'||el.closest('#v29-home-layer')) return;
      const t=txt(el);if(!t)return;
      const hits=tokens.filter(x=>t.includes(x)).length;if(hits<3)return;
      const r=el.getBoundingClientRect();if(r.width<120||r.width>460||r.height<280)return;
      const s=hits*1000-r.width;if(s>score){best=el;score=s;}
    });
    return best;
  }

  function findLegacyMain(layer){
    const sidebar=findSidebar();
    if(sidebar){
      let sib=sidebar.nextElementSibling;
      if(sib&&sib!==layer&&sib.getBoundingClientRect().width>260) return sib;
    }
    const mains=$$('main,[role="main"]')
      .filter(x=>x!==layer&&!x.closest('#v29-home-layer'))
      .map(x=>({x,r:x.getBoundingClientRect()}))
      .filter(o=>o.r.width>Math.min(560,innerWidth*.5)&&o.r.height>300&&o.r.bottom>80)
      .sort((a,b)=>(b.r.width*b.r.height)-(a.r.width*a.r.height));
    return mains[0]?.x||null;
  }

  let legacyMain=null, nativeParent=null, nativeNext=null;
  function mountNative(){
    const layer=$('#v29-home-layer');if(!layer||!isHome())return;
    if(layer.classList.contains('v30-native-home')) return;
    legacyMain=findLegacyMain(layer);
    if(legacyMain){
      nativeParent=legacyMain.parentNode;nativeNext=legacyMain.nextSibling;
      legacyMain.dataset.v30LegacyHome='1';
      nativeParent.insertBefore(layer,nativeNext);
    } else {
      // Fallback: still normal flow, never a fixed overlay.
      document.body.appendChild(layer);
    }
    layer.classList.add('v30-native-home');layer.hidden=false;
  }

  function restoreLegacy(){
    const layer=$('#v29-home-layer');
    if(isHome()){mountNative();if(legacyMain)legacyMain.dataset.v30LegacyHome='1';if(layer){layer.hidden=false;layer.classList.add('v30-native-home');}return;}
    if(legacyMain)delete legacyMain.dataset.v30LegacyHome;
    if(layer)layer.hidden=true;
  }

  const demoModes=['presentation','webpage','document','social','graphic','book'];
  const promptBanks={
    presentation:{
      en:['Build a 10-slide NBA GOAT debate with evidence, charts and a strong conclusion.','Create a presentation explaining climate change to secondary-school students with sources.'],
      nl:['Maak een 10-slide NBA GOAT debat met bewijs, grafieken en een sterke conclusie.','Maak een presentatie die klimaatverandering uitlegt aan middelbare scholieren met bronnen.'],
      es:['Crea una presentación de 10 diapositivas sobre el debate del mejor jugador de la NBA con pruebas y gráficos.','Crea una presentación sobre el cambio climático para estudiantes de secundaria con fuentes.'],
      fr:['Crée une présentation de 10 diapositives sur le débat du meilleur joueur NBA avec preuves et graphiques.','Crée une présentation sur le changement climatique pour des élèves du secondaire avec des sources.'],
      de:['Erstelle eine 10-Folien-Präsentation zur NBA-GOAT-Debatte mit Belegen und Diagrammen.','Erstelle eine Präsentation über den Klimawandel für Schüler mit Quellen.'],
      pt:['Cria uma apresentação de 10 slides sobre o debate do maior jogador da NBA com provas e gráficos.','Cria uma apresentação sobre alterações climáticas para estudantes do ensino secundário com fontes.'],
      it:['Crea una presentazione di 10 slide sul dibattito NBA GOAT con prove e grafici.','Crea una presentazione sul cambiamento climatico per studenti delle superiori con fonti.']
    },
    webpage:{
      en:['Create a landing page for a student tutoring startup with pricing and a clear CTA.','Build a modern portfolio website for a hospitality-management student.'],
      nl:['Maak een landingspagina voor een studenten-tutoring startup met prijzen en een duidelijke CTA.','Bouw een moderne portfolio-website voor een student Hospitality Management.'],
      es:['Crea una página de aterrizaje para una startup de tutoría estudiantil con precios y una CTA clara.','Crea un portafolio web moderno para un estudiante de gestión hotelera.'],
      fr:['Crée une landing page pour une startup de tutorat étudiant avec tarifs et CTA clair.','Crée un portfolio web moderne pour un étudiant en gestion hôtelière.'],
      de:['Erstelle eine Landingpage für ein Schüler-Nachhilfe-Startup mit Preisen und klarer Handlungsaufforderung.','Erstelle eine moderne Portfolio-Website für einen Hospitality-Management-Studenten.'],
      pt:['Cria uma landing page para uma startup de explicações com preços e uma CTA clara.','Cria um portefólio moderno para um estudante de gestão hoteleira.'],
      it:['Crea una landing page per una startup di tutoraggio con prezzi e una CTA chiara.','Crea un portfolio moderno per uno studente di hospitality management.']
    },
    document:{
      en:['Write a research-first report on renewable energy with citations and recommendations.','Draft a structured policy brief about responsible AI use in schools.'],
      nl:['Schrijf een research-first verslag over hernieuwbare energie met bronnen en aanbevelingen.','Maak een gestructureerde policy brief over verantwoord AI-gebruik op scholen.'],
      es:['Escribe un informe basado en investigación sobre energías renovables con citas y recomendaciones.','Redacta un informe de política sobre el uso responsable de la IA en las escuelas.'],
      fr:['Rédige un rapport fondé sur la recherche sur les énergies renouvelables avec citations et recommandations.','Rédige une note de politique sur l’utilisation responsable de l’IA à l’école.'],
      de:['Schreibe einen forschungsbasierten Bericht über erneuerbare Energien mit Quellen und Empfehlungen.','Entwirf ein Policy-Briefing zum verantwortungsvollen KI-Einsatz an Schulen.'],
      pt:['Escreve um relatório baseado em pesquisa sobre energia renovável com citações e recomendações.','Redige um policy brief sobre a utilização responsável de IA nas escolas.'],
      it:['Scrivi un rapporto basato sulla ricerca sulle energie rinnovabili con citazioni e raccomandazioni.','Prepara un policy brief sull’uso responsabile dell’IA nelle scuole.']
    },
    social:{
      en:['Create a 6-slide carousel about study habits with hook, caption and CTA.','Build a one-week social campaign for a school open day.'],
      nl:['Maak een carousel van 6 slides over studiegewoonten met hook, caption en CTA.','Bouw een social campagne van één week voor een open dag van een school.'],
      es:['Crea un carrusel de 6 diapositivas sobre hábitos de estudio con gancho, texto y CTA.','Crea una campaña social de una semana para una jornada de puertas abiertas escolar.'],
      fr:['Crée un carrousel de 6 slides sur les habitudes d’étude avec accroche, légende et CTA.','Crée une campagne sociale d’une semaine pour une journée portes ouvertes.'],
      de:['Erstelle ein 6-Slide-Karussell über Lerngewohnheiten mit Hook, Caption und CTA.','Erstelle eine einwöchige Social-Media-Kampagne für einen Tag der offenen Tür.'],
      pt:['Cria um carrossel de 6 slides sobre hábitos de estudo com hook, legenda e CTA.','Cria uma campanha social de uma semana para um dia aberto da escola.'],
      it:['Crea un carosello di 6 slide sulle abitudini di studio con hook, caption e CTA.','Crea una campagna social di una settimana per l’open day di una scuola.']
    },
    graphic:{
      en:['Design an infographic about exam preparation with seven practical steps.','Create a poster concept for a school festival with clear visual hierarchy.'],
      nl:['Ontwerp een infographic over examenvoorbereiding met zeven praktische stappen.','Maak een posterconcept voor een schoolfestival met duidelijke visuele hiërarchie.'],
      es:['Diseña una infografía sobre preparación para exámenes con siete pasos prácticos.','Crea un concepto de póster para un festival escolar con jerarquía visual clara.'],
      fr:['Conçois une infographie sur la préparation aux examens en sept étapes pratiques.','Crée un concept d’affiche pour un festival scolaire avec une hiérarchie visuelle claire.'],
      de:['Entwirf eine Infografik zur Prüfungsvorbereitung mit sieben praktischen Schritten.','Erstelle ein Plakatkonzept für ein Schulfestival mit klarer visueller Hierarchie.'],
      pt:['Cria um infográfico sobre preparação para exames com sete passos práticos.','Cria um conceito de cartaz para um festival escolar com hierarquia visual clara.'],
      it:['Progetta un’infografica sulla preparazione agli esami con sette passaggi pratici.','Crea un concept di poster per un festival scolastico con una chiara gerarchia visiva.']
    },
    book:{
      en:['Write a young-adult mystery novel with 18 chapters, recurring clues and a final reveal.','Plan and start a horror-romance novel with multiple POVs and a strong character arc.'],
      nl:['Schrijf een young-adult mysteryroman met 18 hoofdstukken, terugkerende aanwijzingen en een finale onthulling.','Plan en start een horror-romance boek met meerdere POV’s en een sterke karakterontwikkeling.'],
      es:['Escribe una novela de misterio juvenil de 18 capítulos con pistas recurrentes y una revelación final.','Planifica e inicia una novela de terror romántico con múltiples puntos de vista.'],
      fr:['Écris un roman mystère young adult de 18 chapitres avec indices récurrents et révélation finale.','Planifie et commence un roman d’horreur romantique avec plusieurs points de vue.'],
      de:['Schreibe einen Young-Adult-Mysteryroman mit 18 Kapiteln, wiederkehrenden Hinweisen und finaler Enthüllung.','Plane und beginne einen Horror-Romance-Roman mit mehreren Perspektiven.'],
      pt:['Escreve um romance mistério jovem-adulto com 18 capítulos, pistas recorrentes e uma revelação final.','Planeia e começa um romance de terror romântico com múltiplos pontos de vista.'],
      it:['Scrivi un romanzo mystery young adult di 18 capitoli con indizi ricorrenti e rivelazione finale.','Pianifica e inizia un romanzo horror-romance con punti di vista multipli.']
    }
  };
  const promptSteps=Object.fromEntries(demoModes.map(m=>[m,0]));
  let modeIndex=0, typingTimer=null, rotateTimer=null, statusTimer=null, pausedUntil=0;

  function setAutoMode(mode){
    const layer=$('#v29-home-layer');if(!layer)return;
    if(window.__SCHOLARK_V29_HOME__?.setMode)window.__SCHOLARK_V29_HOME__.setMode(mode);
    else{
      const btn=$(`.v29-type[data-mode="${mode}"]`,layer)||$(`.v29-tab[data-mode="${mode}"]`,layer);btn?.click();
      $('.v29-type,.v29-tab',layer).forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
    }
    autoType(mode);
  }

  function uiLanguage(){
    const raw=(window.__SCHOLARK_I18N__?.code?.()||localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'en').toLowerCase();
    return ['nl','en','es','fr','de','pt','it'].find(x=>raw.startsWith(x))||'en';
  }
  function nextPrompt(mode){
    const language=uiLanguage(),bank=promptBanks[mode]?.[language]||promptBanks[mode]?.en||['Create something useful with SCHOLARK.'];
    const step=promptSteps[mode]||0,p=bank[step%bank.length];promptSteps[mode]=step+1;return p;
  }
  function autoType(mode){
    const input=$('#v29-prompt');if(!input||document.activeElement===input||Date.now()<pausedUntil)return;
    clearInterval(typingTimer);input.value='';const p=nextPrompt(mode);
    if(document.documentElement.classList.contains('scholark-performance-safe')){input.classList.remove('v30-typing-cursor');input.value=p;return}
    input.classList.add('v30-typing-cursor');let i=0;
    typingTimer=setInterval(()=>{
      if(document.activeElement===input){clearInterval(typingTimer);input.classList.remove('v30-typing-cursor');return;}
      input.value=p.slice(0,++i);
      if(i>=p.length){clearInterval(typingTimer);input.classList.remove('v30-typing-cursor');}
    },42);
  }

  function cycleStudio(){
    if(Date.now()<pausedUntil)return;
    modeIndex=(modeIndex+1)%demoModes.length;setAutoMode(demoModes[modeIndex]);
  }

  function addLiveBadge(){
    const hero=$('.v29-hero');if(hero&&!$('.v30-live-badge',hero)){const b=document.createElement('div');b.className='v30-live-badge';b.innerHTML='<i></i> LIVE PRODUCT DEMO';hero.appendChild(b);}
    const studio=$('.v29-studio');if(studio&&!$('.v30-auto-note',studio)){const n=document.createElement('span');n.className='v30-auto-note';n.textContent='auto-cycling demo';studio.prepend(n);}
  }

  function enhanceLearning(){
    const cards=$$('.v29-bento-card');
    const tutor=cards.find(c=>/AI Tutor/i.test(txt(c)));const diag=cards.find(c=>/Diagnostics/i.test(txt(c)));
    if(tutor&&!$('.v30-tutor-demo',tutor)){const d=document.createElement('div');d.className='v30-tutor-demo';tutor.appendChild(d);}
    if(diag&&!$('.v30-diagnostic-demo',diag)){const d=document.createElement('div');d.className='v30-diagnostic-demo';diag.appendChild(d);}
  }

  const tutorLines=[
    ['AI TUTOR','“Explain photosynthesis like I am 13.” → Simplifying concept…'],
    ['AI TUTOR','Quick check: “Why do plants need sunlight?” → adaptive question ready'],
    ['AI TUTOR','Weak topic detected → adding a shorter practice set for tomorrow']
  ];
  const diagLines=[
    ['DIAGNOSTICS','Scanning 12 skills…'],['DIAGNOSTICS','3 weak areas found → prioritizing practice'],['DIAGNOSTICS','Mastered topics moved to spaced review']
  ];
  let learnStep=0;
  function animateLearning(){
    const t=$('.v30-tutor-demo'),d=$('.v30-diagnostic-demo');if(!t||!d)return;
    const a=tutorLines[learnStep%tutorLines.length],b=diagLines[learnStep%diagLines.length];
    t.innerHTML=`<b>${a[0]}</b>${a[1]}`;d.innerHTML=`<b>${b[0]}</b>${b[1]}`;learnStep++;
  }

  function enhanceFuture(){
    const cards=$$('.v29-future-card');
    cards.forEach(c=>{if(!$('.v30-demo-status',c)){const s=document.createElement('div');s.className='v30-demo-status';c.appendChild(s);}});
  }
  const schoolDemo=['<span class="v30-step"><i></i> Demo: scanning an 8 km radius…</span>','<span class="v30-step"><i></i> Nearby school matches appear with distance + type.</span>','<span class="v30-step"><i></i> Compare options → save the ones you want to explore.</span>'];
  const aheadDemo=['<span class="v30-step"><i></i> Goal selected: Law / Juridical Studies</span>','<span class="v30-step"><i></i> Previewing first-year subjects + core skills…</span>','<span class="v30-step"><i></i> Head-start plan ready: concepts to learn before semester 1.</span>'];
  let futureStep=0;
  function animateFuture(){
    const cards=$$('.v29-future-card');if(cards.length<2)return;
    const a=$('.v30-demo-status',cards[0]),b=$('.v30-demo-status',cards[1]);
    if(a)a.innerHTML=schoolDemo[futureStep%schoolDemo.length];if(b)b.innerHTML=aheadDemo[futureStep%aheadDemo.length];futureStep++;
  }

  function animateQualitySteps(){
    const floats=$$('.v29-float');if(floats.length<3)return;
    const steps=[['✦ Understanding prompt','○ Building outline','○ Quality pass'],['✓ Prompt understood','✦ Research + structure','○ Quality pass'],['✓ Outline complete','✓ Draft generated','✦ Quality pass'],['✓ Research checked','✓ Design assembled','✓ Ready to edit']];
    const row=steps[(futureStep)%steps.length];floats.slice(0,3).forEach((f,i)=>f.textContent=row[i]);
  }

  function animateHosts(){
    const hosts=$$('.v29-host');if(hosts.length<2)return;
    hosts.forEach(h=>h.classList.remove('v30-speaking'));hosts[futureStep%2].classList.add('v30-speaking');
  }

  function wirePause(){
    const layer=$('#v29-home-layer');if(!layer||layer.dataset.v30Wired)return;layer.dataset.v30Wired='1';
    layer.addEventListener('pointerdown',e=>{
      if(e.target.closest('.v29-type,.v29-tab,#v29-prompt')) pausedUntil=Date.now()+12000;
    },true);
    const input=$('#v29-prompt');input?.addEventListener('input',()=>{pausedUntil=Date.now()+20000;});
  }

  function stopDemo(){
    clearInterval(typingTimer);typingTimer=null;
    clearInterval(rotateTimer);rotateTimer=null;
    clearInterval(statusTimer);statusTimer=null;
    $('#v29-prompt')?.classList.remove('v30-typing-cursor');
  }
  function ensureDemo(){
    if(!isHome()||document.documentElement.classList.contains('scholark-runtime-loading')||document.documentElement.classList.contains('scholark-route-loading')||document.documentElement.classList.contains('scholark-language-switching')){stopDemo();return}
    mountNative();addLiveBadge();enhanceLearning();enhanceFuture();wirePause();
    const lite=document.documentElement.classList.contains('scholark-performance-safe');
    if(!rotateTimer){setAutoMode('presentation');rotateTimer=setInterval(cycleStudio,lite?12000:9000);}
    if(!statusTimer){animateLearning();animateFuture();animateQualitySteps();if(!lite)animateHosts();statusTimer=setInterval(()=>{if(document.hidden||!isHome())return;animateLearning();animateFuture();animateQualitySteps();if(!document.documentElement.classList.contains('scholark-performance-safe'))animateHosts();},lite?6500:4800);}
  }

  function sync(){restoreLegacy();if(isHome())ensureDemo();else stopDemo();}
  addEventListener('hashchange',()=>setTimeout(sync,50));
  addEventListener('popstate',()=>setTimeout(sync,50));
  addEventListener('scholark-language-ready',()=>{if(isHome())setTimeout(()=>setAutoMode(demoModes[modeIndex]||'presentation'),80)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopDemo();else sync()});
  setTimeout(sync,120);
  window.__SCHOLARK_V30_DEMO__={stop:stopDemo,start:ensureDemo,sync};
})();