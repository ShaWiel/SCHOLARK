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
    .v30-future-live{margin-top:14px;border-radius:16px;border:1px solid rgba(255,255,255,.1);background:rgba(9,12,20,.22);overflow:hidden;min-height:104px}
    .v30-school-map{position:relative;height:74px;background:radial-gradient(circle at 45% 45%,rgba(201,255,106,.11),transparent 34%),linear-gradient(135deg,rgba(255,255,255,.035),rgba(109,93,252,.09));overflow:hidden}
    .v30-school-map:before,.v30-school-map:after{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:22px 22px;opacity:.45}
    .v30-radar{position:absolute;left:48%;top:50%;width:18px;height:18px;border:2px solid #c9ff6a;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 0 rgba(201,255,106,.26);animation:v30radar 2.2s ease-out infinite}
    @keyframes v30radar{0%{box-shadow:0 0 0 0 rgba(201,255,106,.28)}75%,100%{box-shadow:0 0 0 38px rgba(201,255,106,0)}}
    .v30-pin{position:absolute;width:10px;height:10px;border-radius:50% 50% 50% 0;background:#fff;transform:rotate(-45deg);opacity:.28;transition:opacity .25s ease,transform .25s ease}.v30-pin:after{content:'';position:absolute;width:4px;height:4px;border-radius:50%;background:#5b4fe3;left:3px;top:3px}.v30-pin.active{opacity:1;transform:rotate(-45deg) scale(1.25)}.v30-pin.p1{left:22%;top:24%}.v30-pin.p2{left:70%;top:20%}.v30-pin.p3{left:68%;top:60%}.v30-pin.p4{left:30%;top:62%}
    .v30-live-label{padding:8px 10px;color:#ddd9e7;font:800 8.5px/1.25 Inter;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .v30-ahead-track{position:relative;height:72px;padding:18px 14px 0}.v30-ahead-line{height:5px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden}.v30-ahead-line i{display:block;height:100%;width:25%;border-radius:99px;background:linear-gradient(90deg,#7b68ff,#c9ff6a);transition:width .5s ease}.v30-ahead-dots{display:grid;grid-template-columns:repeat(4,1fr);margin-top:-9px}.v30-ahead-dots span{justify-self:center;width:11px;height:11px;border-radius:50%;background:#35323f;border:2px solid rgba(255,255,255,.2);transition:.25s ease}.v30-ahead-dots span.done,.v30-ahead-dots span.active{background:#c9ff6a;border-color:#c9ff6a}.v30-ahead-dots span.active{box-shadow:0 0 0 6px rgba(201,255,106,.11)}
    .v30-ahead-caption{padding:4px 10px 9px;color:#ddd9e7;font:800 8.5px/1.25 Inter}
    .v30-tutor-demo,.v30-diagnostic-demo{position:absolute;left:28px;right:28px;bottom:24px;border-radius:16px;padding:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);font:700 9.5px/1.45 Inter;color:#eee;min-height:58px;transition:.25s ease}
    .v30-diagnostic-demo{color:#14161b;background:rgba(255,255,255,.38);border-color:rgba(17,19,24,.08)}
    .v30-tutor-demo b,.v30-diagnostic-demo b{display:block;font-size:9px;letter-spacing:.08em;margin-bottom:4px;color:#c9ff6a}.v30-diagnostic-demo b{color:#3d347e}
    .v30-typing-cursor:after{content:'|';animation:v30blink .75s steps(1) infinite}@keyframes v30blink{50%{opacity:0}}
    .v30-auto-note{display:inline-flex;gap:7px;align-items:center;margin-left:8px;font-size:9px;font-weight:850;color:#817c8c}.v30-auto-note:before{content:'↻';color:#6d5dfc;font-size:12px}
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
      Array.from(layer.querySelectorAll('.v29-type,.v29-tab')).forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
    }
    autoType(mode);
  }

  function resizePrompt(input=$('#v29-prompt')){
    if(!input)return;
    input.style.height='auto';
    const next=Math.max(44,Math.min(128,input.scrollHeight||44));
    input.style.height=next+'px';
    input.style.overflowY=(input.scrollHeight||0)>128?'auto':'hidden';
  }

  function uiLanguage(){
    const raw=(window.__SCHOLARK_I18N__?.code?.()||localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'en').toLowerCase();
    return ['nl','en','es','fr','de','pt','it'].find(x=>raw.startsWith(x))||'en';
  }
  function nextPrompt(mode){
    const language=uiLanguage(),bank=promptBanks[mode]?.[language]||promptBanks[mode]?.en||['Create something useful with SCHOLARK.'];
    const step=promptSteps[mode]||0,p=bank[step%bank.length];promptSteps[mode]=step+1;return p;
  }
  function promptForCurrentStep(mode){
    const language=uiLanguage(),bank=promptBanks[mode]?.[language]||promptBanks[mode]?.en||['Create something useful with SCHOLARK.'];
    const step=Math.max(0,(promptSteps[mode]||1)-1);
    return bank[step%bank.length];
  }
  function autoType(mode){
    const input=$('#v29-prompt');if(!input||document.activeElement===input||Date.now()<pausedUntil)return;
    clearInterval(typingTimer);input.value='';resizePrompt(input);const p=nextPrompt(mode);
    if(document.documentElement.classList.contains('scholark-performance-safe')){input.classList.remove('v30-typing-cursor');input.value=p;resizePrompt(input);return}
    input.classList.add('v30-typing-cursor');let i=0;
    typingTimer=setInterval(()=>{
      if(document.activeElement===input){clearInterval(typingTimer);input.classList.remove('v30-typing-cursor');return;}
      input.value=p.slice(0,++i);resizePrompt(input);
      if(i>=p.length){clearInterval(typingTimer);input.classList.remove('v30-typing-cursor');resizePrompt(input);}
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
    const school=$('[data-v30-future-card="schools"]'),study=$('[data-v30-future-card="study"]');
    if(school&&!$('.v30-future-live',school)){
      const box=document.createElement('div');box.className='v30-future-live v30-school-live';
      box.innerHTML='<div class="v30-school-map"><span class="v30-radar"></span><i class="v30-pin p1 active"></i><i class="v30-pin p2"></i><i class="v30-pin p3"></i><i class="v30-pin p4"></i></div><div class="v30-live-label">Finding school matches around your area…</div>';
      school.appendChild(box);
    }
    if(study&&!$('.v30-future-live',study)){
      const box=document.createElement('div');box.className='v30-future-live v30-ahead-live';
      box.innerHTML='<div class="v30-ahead-track"><div class="v30-ahead-line"><i></i></div><div class="v30-ahead-dots"><span class="active"></span><span></span><span></span><span></span></div></div><div class="v30-ahead-caption">Foundation mapped · building your head start</div>';
      study.appendChild(box);
    }
  }
  const schoolLiveLabels={
    en:['Finding school matches around your area…','Comparing distance, level and study relevance…','Checking public school information…','Best-fit options ready to explore.'],
    nl:['Scholen in jouw omgeving zoeken…','Afstand, niveau en studierelevantie vergelijken…','Publieke schoolinformatie controleren…','Beste matches klaar om te bekijken.'],
    es:['Buscando escuelas en tu zona…','Comparando distancia, nivel y relevancia de estudio…','Verificando información pública de las escuelas…','Mejores opciones listas para explorar.'],
    fr:['Recherche des écoles autour de vous…','Comparaison de la distance, du niveau et de la pertinence…','Vérification des informations publiques…','Meilleures options prêtes à explorer.'],
    de:['Schulen in deiner Umgebung werden gesucht…','Entfernung, Niveau und Studienrelevanz werden verglichen…','Öffentliche Schulinformationen werden geprüft…','Beste Optionen sind bereit.'],
    pt:['A procurar escolas na tua zona…','A comparar distância, nível e relevância…','A verificar informação pública das escolas…','Melhores opções prontas para explorar.'],
    it:['Ricerca delle scuole nella tua zona…','Confronto di distanza, livello e pertinenza…','Verifica delle informazioni pubbliche…','Migliori opzioni pronte da esplorare.']
  };
  const aheadLiveLabels={
    en:['Foundation mapped · building your head start','Core subjects mapped · skills next','Practice path ready · sequencing milestones','Semester-ready roadmap assembled'],
    nl:['Basis in kaart · voorsprong wordt opgebouwd','Kernvakken in kaart · vaardigheden volgen','Oefenpad klaar · mijlpalen worden geordend','Roadmap voor semesterstart gereed'],
    es:['Base trazada · construyendo tu ventaja','Materias clave trazadas · siguen las habilidades','Ruta de práctica lista · ordenando hitos','Hoja de ruta lista para el semestre'],
    fr:['Fondations cartographiées · votre avance se construit','Matières clés cartographiées · compétences ensuite','Parcours de pratique prêt · jalons en cours','Feuille de route prête pour le semestre'],
    de:['Grundlagen erfasst · Vorsprung wird aufgebaut','Kernfächer erfasst · Fähigkeiten folgen','Übungspfad bereit · Meilensteine werden geordnet','Roadmap für den Semesterstart bereit'],
    pt:['Base mapeada · a construir a tua vantagem','Disciplinas centrais mapeadas · competências a seguir','Percurso de prática pronto · marcos em sequência','Roteiro pronto para o semestre'],
    it:['Fondamenta mappate · costruendo il tuo vantaggio','Materie chiave mappate · seguono le competenze','Percorso di pratica pronto · tappe in sequenza','Roadmap pronta per il semestre']
  };
  let futureStep=0;
  function animateFuture(){
    enhanceFuture();
    const pins=$$('.v30-school-live .v30-pin'),schoolLabel=$('.v30-school-live .v30-live-label');
    const lc=uiLanguage(),schoolRows=schoolLiveLabels[lc]||schoolLiveLabels.en,aheadRows=aheadLiveLabels[lc]||aheadLiveLabels.en;if(pins.length){pins.forEach((p,i)=>p.classList.toggle('active',i===futureStep%pins.length));if(schoolLabel)schoolLabel.textContent=schoolRows[futureStep%schoolRows.length]}
    const fill=$('.v30-ahead-line i'),dots=$$('.v30-ahead-dots span'),caption=$('.v30-ahead-caption'),stage=futureStep%4;
    if(fill)fill.style.width=[25,50,75,100][stage]+'%';
    dots.forEach((d,i)=>{d.classList.toggle('done',i<stage);d.classList.toggle('active',i===stage)});
    if(caption)caption.textContent=aheadRows[stage];
    futureStep++;
  }

  const qualitySteps={
    en:[['✦ Understanding prompt','○ Building outline','○ Quality pass'],['✓ Prompt understood','✦ Research + structure','○ Quality pass'],['✓ Outline complete','✓ Draft generated','✦ Quality pass'],['✓ Research checked','✓ Design assembled','✓ Ready to edit']],
    nl:[['✦ Prompt begrijpen','○ Opzet bouwen','○ Kwaliteitscheck'],['✓ Prompt begrepen','✦ Onderzoek + structuur','○ Kwaliteitscheck'],['✓ Opzet compleet','✓ Eerste versie gemaakt','✦ Kwaliteitscheck'],['✓ Onderzoek gecontroleerd','✓ Ontwerp samengesteld','✓ Klaar om te bewerken']],
    es:[['✦ Entendiendo el prompt','○ Creando esquema','○ Control de calidad'],['✓ Prompt entendido','✦ Investigación + estructura','○ Control de calidad'],['✓ Esquema completo','✓ Borrador generado','✦ Control de calidad'],['✓ Investigación revisada','✓ Diseño ensamblado','✓ Listo para editar']],
    fr:[['✦ Compréhension du prompt','○ Construction du plan','○ Contrôle qualité'],['✓ Prompt compris','✦ Recherche + structure','○ Contrôle qualité'],['✓ Plan terminé','✓ Brouillon généré','✦ Contrôle qualité'],['✓ Recherche vérifiée','✓ Design assemblé','✓ Prêt à modifier']],
    de:[['✦ Prompt verstehen','○ Gliederung erstellen','○ Qualitätsprüfung'],['✓ Prompt verstanden','✦ Recherche + Struktur','○ Qualitätsprüfung'],['✓ Gliederung fertig','✓ Entwurf erstellt','✦ Qualitätsprüfung'],['✓ Recherche geprüft','✓ Design zusammengestellt','✓ Bereit zum Bearbeiten']],
    pt:[['✦ A compreender o prompt','○ A criar estrutura','○ Verificação de qualidade'],['✓ Prompt compreendido','✦ Pesquisa + estrutura','○ Verificação de qualidade'],['✓ Estrutura concluída','✓ Rascunho gerado','✦ Verificação de qualidade'],['✓ Pesquisa verificada','✓ Design montado','✓ Pronto para editar']],
    it:[['✦ Comprensione del prompt','○ Creazione struttura','○ Controllo qualità'],['✓ Prompt compreso','✦ Ricerca + struttura','○ Controllo qualità'],['✓ Struttura completa','✓ Bozza generata','✦ Controllo qualità'],['✓ Ricerca verificata','✓ Design assemblato','✓ Pronto da modificare']]
  };
  function animateQualitySteps(){
    const floats=$('.v29-float');if(floats.length<3)return;
    const steps=qualitySteps[uiLanguage()]||qualitySteps.en;
    const row=steps[(futureStep)%steps.length];floats.slice(0,3).forEach((f,i)=>f.textContent=row[i]);
  }

  function refreshLanguage(){
    if(!isHome())return;
    const mode=window.__SCHOLARK_V29_HOME__?.getMode?.()||demoModes[modeIndex]||'presentation';
    const input=$('#v29-prompt');
    if(input&&document.activeElement!==input){
      clearInterval(typingTimer);typingTimer=null;
      input.classList.remove('v30-typing-cursor');
      input.value=promptForCurrentStep(mode);resizePrompt(input);
    }
    const schoolLabel=$('.v30-school-live .v30-live-label'),caption=$('.v30-ahead-caption');
    const lc=uiLanguage(),schoolRows=schoolLiveLabels[lc]||schoolLiveLabels.en,aheadRows=aheadLiveLabels[lc]||aheadLiveLabels.en;
    const displayed=Math.max(0,futureStep-1)%4;
    if(schoolLabel)schoolLabel.textContent=schoolRows[displayed%schoolRows.length];
    if(caption)caption.textContent=aheadRows[displayed%aheadRows.length];
    animateQualitySteps();
    window.__SCHOLARK_I18N__?.apply?.($('#v29-home-layer'));
  }


  function wirePause(){
    const layer=$('#v29-home-layer');if(!layer||layer.dataset.v30Wired)return;layer.dataset.v30Wired='1';
    layer.addEventListener('pointerdown',e=>{
      if(e.target.closest('.v29-type,.v29-tab,#v29-prompt')) pausedUntil=Date.now()+12000;
    },true);
    const input=$('#v29-prompt');input?.addEventListener('input',()=>{pausedUntil=Date.now()+20000;resizePrompt(input)});resizePrompt(input);
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
    if(!statusTimer){animateLearning();animateFuture();animateQualitySteps();statusTimer=setInterval(()=>{if(document.hidden||!isHome())return;animateLearning();animateFuture();animateQualitySteps();},lite?6500:4800);}
  }

  function sync(){restoreLegacy();if(isHome())ensureDemo();else stopDemo();}
  addEventListener('hashchange',()=>setTimeout(sync,50));
  addEventListener('popstate',()=>setTimeout(sync,50));
  addEventListener('scholark-language-ready',()=>{if(isHome())requestAnimationFrame(refreshLanguage)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopDemo();else sync()});
  setTimeout(sync,120);
  window.__SCHOLARK_V30_DEMO__={stop:stopDemo,start:ensureDemo,sync,resizePrompt,refreshLanguage};
})();