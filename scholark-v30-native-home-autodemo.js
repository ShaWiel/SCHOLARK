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
    const tokens=['Dashboard','Education & Learning','ARKI','Planner','Progress'];
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

  const demoModes=['arki','tutor','education','planner','flashcards','progress'];
  const promptBanks={
    arki:{
      en:['Help me decide what to study today based on my goals and weak topics.'],
      nl:['Help me bepalen wat ik vandaag moet studeren op basis van mijn doelen en zwakke onderwerpen.'],
      es:['Ayúdame a decidir qué estudiar hoy según mis objetivos y temas débiles.'],
      fr:['Aide-moi à décider quoi étudier aujourd’hui selon mes objectifs et mes points faibles.'],
      de:['Hilf mir zu entscheiden, was ich heute anhand meiner Ziele und Schwächen lernen soll.'],
      pt:['Ajuda-me a decidir o que estudar hoje com base nos meus objetivos e tópicos fracos.'],
      it:['Aiutami a decidere cosa studiare oggi in base ai miei obiettivi e agli argomenti deboli.']
    },
    tutor:{
      en:['Explain photosynthesis like I am 13, then test me with one question.'],
      nl:['Leg fotosynthese uit alsof ik 13 ben en test me daarna met één vraag.'],
      es:['Explica la fotosíntesis como si tuviera 13 años y luego hazme una pregunta.'],
      fr:['Explique la photosynthèse comme si j’avais 13 ans, puis pose-moi une question.'],
      de:['Erkläre Fotosynthese so, als wäre ich 13, und teste mich danach mit einer Frage.'],
      pt:['Explica a fotossíntese como se eu tivesse 13 anos e depois faz-me uma pergunta.'],
      it:['Spiega la fotosintesi come se avessi 13 anni e poi fammi una domanda.']
    },
    education:{
      en:['Run a diagnostic on algebra and add my weak topics to Mastery.'],
      nl:['Doe een diagnostische check voor algebra en voeg mijn zwakke onderwerpen toe aan Mastery.'],
      es:['Haz un diagnóstico de álgebra y añade mis temas débiles a Mastery.'],
      fr:['Fais un diagnostic d’algèbre et ajoute mes points faibles à Mastery.'],
      de:['Führe eine Algebra-Diagnose durch und füge meine Schwachstellen zu Mastery hinzu.'],
      pt:['Faz um diagnóstico de álgebra e adiciona os meus tópicos fracos ao Mastery.'],
      it:['Fai una diagnostica di algebra e aggiungi gli argomenti deboli a Mastery.']
    },
    planner:{
      en:['Turn my Biology assignment and Friday deadline into a realistic study plan.'],
      nl:['Zet mijn biologie-opdracht met deadline vrijdag om in een realistisch studieplan.'],
      es:['Convierte mi tarea de Biología con fecha límite el viernes en un plan de estudio realista.'],
      fr:['Transforme mon devoir de biologie à rendre vendredi en un plan d’étude réaliste.'],
      de:['Mach aus meiner Biologie-Aufgabe mit Abgabe am Freitag einen realistischen Lernplan.'],
      pt:['Transforma o meu trabalho de Biologia com prazo na sexta-feira num plano de estudo realista.'],
      it:['Trasforma il mio compito di Biologia con scadenza venerdì in un piano di studio realistico.']
    },
    flashcards:{
      en:['Create a spaced-repetition flashcard deck for cell division.'],
      nl:['Maak een spaced-repetition flashcarddeck over celdeling.'],
      es:['Crea un mazo de tarjetas con repetición espaciada sobre división celular.'],
      fr:['Crée un jeu de flashcards à répétition espacée sur la division cellulaire.'],
      de:['Erstelle ein Karteikarten-Deck mit Spaced Repetition zur Zellteilung.'],
      pt:['Cria um baralho de flashcards com repetição espaçada sobre divisão celular.'],
      it:['Crea un mazzo di flashcard con ripetizione dilazionata sulla divisione cellulare.']
    },
    progress:{
      en:['Show my weak topics and tell me what I should focus on next.'],
      nl:['Laat mijn zwakke onderwerpen zien en vertel waarop ik me hierna moet focussen.'],
      es:['Muéstrame mis temas débiles y dime en qué debería concentrarme después.'],
      fr:['Montre mes points faibles et dis-moi sur quoi me concentrer ensuite.'],
      de:['Zeig mir meine Schwachstellen und sag mir, worauf ich mich als Nächstes konzentrieren soll.'],
      pt:['Mostra os meus tópicos fracos e diz-me em que devo focar a seguir.'],
      it:['Mostrami gli argomenti deboli e dimmi su cosa dovrei concentrarmi dopo.']
    }
  };
  const promptSteps=Object.fromEntries(demoModes.map(m=>[m,0]));
  let modeIndex=0, typingTimer=null, rotateTimer=null, statusTimer=null, pausedUntil=0, statusStep=0;

  function setAutoMode(mode){
    const layer=$('#v29-home-layer');if(!layer)return;
    if(window.__SCHOLARK_V29_HOME__?.setMode)window.__SCHOLARK_V29_HOME__.setMode(mode,'auto');
    else{
      const btn=$(`.v29-type[data-mode="${mode}"]`,layer)||$(`.v29-tab[data-mode="${mode}"]`,layer);btn?.click();
      Array.from(layer.querySelectorAll('.v29-type,.v29-tab')).forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
    }
    statusStep=0;animateQualitySteps(mode);autoType(mode);
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
    const language=uiLanguage(),bank=promptBanks[mode]?.[language]||promptBanks[mode]?.en||['Ask ARKI or open a SCHOLARK learning tool.'];
    const step=promptSteps[mode]||0,p=bank[step%bank.length];promptSteps[mode]=step+1;return p;
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

  function cycleCapabilities(){
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

  const tutorLines={
    en:[['AI TUTOR','“Explain photosynthesis like I am 13.” → Simplifying concept…'],['AI TUTOR','Quick check: “Why do plants need sunlight?” → adaptive question ready'],['AI TUTOR','Weak topic detected → adding a shorter practice set for tomorrow']],
    nl:[['AI TUTOR','“Leg fotosynthese uit alsof ik 13 ben.” → Concept vereenvoudigen…'],['AI TUTOR','Snelle check: “Waarom hebben planten zonlicht nodig?” → adaptieve vraag klaar'],['AI TUTOR','Zwak onderwerp gevonden → kortere oefenset voor morgen toevoegen']],
    es:[['TUTOR IA','“Explica la fotosíntesis como si tuviera 13 años.” → Simplificando…'],['TUTOR IA','Comprobación rápida: “¿Por qué necesitan luz solar las plantas?” → pregunta adaptativa lista'],['TUTOR IA','Tema débil detectado → añadiendo una práctica más corta para mañana']],
    fr:[['TUTEUR IA','« Explique la photosynthèse comme si j’avais 13 ans. » → Simplification…'],['TUTEUR IA','Vérification rapide : « Pourquoi les plantes ont-elles besoin de lumière ? » → question adaptative prête'],['TUTEUR IA','Sujet faible détecté → série d’exercices plus courte prévue pour demain']],
    de:[['KI-TUTOR','„Erkläre Fotosynthese so, als wäre ich 13.“ → Konzept wird vereinfacht…'],['KI-TUTOR','Kurzcheck: „Warum brauchen Pflanzen Sonnenlicht?“ → adaptive Frage bereit'],['KI-TUTOR','Schwaches Thema erkannt → kürzere Übung für morgen wird hinzugefügt']],
    pt:[['TUTOR DE IA','“Explica a fotossíntese como se eu tivesse 13 anos.” → A simplificar…'],['TUTOR DE IA','Verificação rápida: “Porque precisam as plantas de luz solar?” → pergunta adaptativa pronta'],['TUTOR DE IA','Tópico fraco detetado → prática mais curta adicionada para amanhã']],
    it:[['TUTOR IA','“Spiega la fotosintesi come se avessi 13 anni.” → Semplificazione…'],['TUTOR IA','Controllo rapido: “Perché le piante hanno bisogno della luce?” → domanda adattiva pronta'],['TUTOR IA','Argomento debole rilevato → aggiunta una pratica più breve per domani']]
  };
  const diagLines={
    en:[['DIAGNOSTICS','Scanning 12 skills…'],['DIAGNOSTICS','3 weak areas found → prioritizing practice'],['DIAGNOSTICS','Mastered topics moved to spaced review']],
    nl:[['DIAGNOSTIEK','12 vaardigheden scannen…'],['DIAGNOSTIEK','3 zwakke gebieden gevonden → oefening prioriteren'],['DIAGNOSTIEK','Beheerste onderwerpen naar gespreide herhaling verplaatst']],
    es:[['DIAGNÓSTICO','Analizando 12 habilidades…'],['DIAGNÓSTICO','3 áreas débiles encontradas → priorizando práctica'],['DIAGNÓSTICO','Temas dominados movidos a repaso espaciado']],
    fr:[['DIAGNOSTIC','Analyse de 12 compétences…'],['DIAGNOSTIC','3 points faibles trouvés → priorité à la pratique'],['DIAGNOSTIC','Sujets maîtrisés déplacés vers la révision espacée']],
    de:[['DIAGNOSE','12 Fähigkeiten werden geprüft…'],['DIAGNOSE','3 Schwachstellen gefunden → Übung wird priorisiert'],['DIAGNOSE','Beherrschte Themen in verteilte Wiederholung verschoben']],
    pt:[['DIAGNÓSTICO','A analisar 12 competências…'],['DIAGNÓSTICO','3 áreas fracas encontradas → prática priorizada'],['DIAGNÓSTICO','Tópicos dominados movidos para revisão espaçada']],
    it:[['DIAGNOSTICA','Analisi di 12 abilità…'],['DIAGNOSTICA','3 aree deboli trovate → pratica prioritaria'],['DIAGNOSTICA','Argomenti padroneggiati spostati nel ripasso dilazionato']]
  };
  let learnStep=0;
  function animateLearning(){
    const t=$('.v30-tutor-demo'),d=$('.v30-diagnostic-demo');if(!t||!d)return;
    const lc=uiLanguage(),tl=tutorLines[lc]||tutorLines.en,dl=diagLines[lc]||diagLines.en;
    const a=tl[learnStep%tl.length],b=dl[learnStep%dl.length];
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

  const modeStatus={
    arki:{
      en:['✦ Reading your question','○ Connecting context','↗ Preparing a useful answer'],
      nl:['✦ Je vraag begrijpen','○ Context koppelen','↗ Een bruikbaar antwoord maken']
    },
    tutor:{
      en:['✦ Adapting the explanation','○ Checking understanding','↗ Preparing practice'],
      nl:['✦ Uitleg aanpassen','○ Begrip controleren','↗ Oefening voorbereiden']
    },
    education:{
      en:['✦ Running diagnostic','○ Updating mastery','↗ Scheduling the right review'],
      nl:['✦ Diagnostiek uitvoeren','○ Mastery bijwerken','↗ Juiste herhaling plannen']
    },
    planner:{
      en:['✦ Checking goals & deadlines','○ Prioritizing tasks','↗ Building study blocks'],
      nl:['✦ Doelen & deadlines checken','○ Taken prioriteren','↗ Studieblokken maken']
    },
    flashcards:{
      en:['✦ Checking due cards','○ Spacing the next reviews','↗ Updating your deck'],
      nl:['✦ Kaarten controleren','○ Volgende reviews spreiden','↗ Deck bijwerken']
    },
    progress:{
      en:['✦ Reading recent activity','○ Finding weak areas','↗ Recommending next focus'],
      nl:['✦ Recente activiteit lezen','○ Zwakke punten vinden','↗ Volgende focus adviseren']
    }
  };
  function animateQualitySteps(mode=currentDemoMode()){
    const floats=$$('.v29-float');if(floats.length<3)return;
    const language=uiLanguage(),copy=modeStatus[mode]||modeStatus.arki,row=copy[language]||copy.en;
    const phase=statusStep%3;
    floats.slice(0,3).forEach((f,i)=>{
      const text=row[i]||'';
      const active=i===phase;
      f.textContent=(active?'✦ ':'')+text.replace(/^[✦○↗]\s*/,'');
      f.dataset.v30Mode=mode;
    });
    statusStep++;
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
  function currentDemoMode(){
    const apiMode=window.__SCHOLARK_V29_HOME__?.getMode?.();
    return demoModes.includes(apiMode)?apiMode:(demoModes[modeIndex]||'arki');
  }
  function startTimers(){
    const lite=document.documentElement.classList.contains('scholark-performance-safe');
    if(!rotateTimer)rotateTimer=setInterval(cycleCapabilities,lite?12000:9000);
    if(!statusTimer)statusTimer=setInterval(()=>{
      if(document.hidden||!isHome())return;
      animateLearning();animateFuture();animateQualitySteps();
    },lite?6500:4800);
  }
  function ensureDemo(){
    if(!isHome()||document.documentElement.classList.contains('scholark-runtime-loading')||document.documentElement.classList.contains('scholark-route-loading')||document.documentElement.classList.contains('scholark-language-switching')){stopDemo();return}
    mountNative();addLiveBadge();enhanceLearning();enhanceFuture();wirePause();
    const mode=currentDemoMode(),idx=demoModes.indexOf(mode);if(idx>=0)modeIndex=idx;
    if(!rotateTimer){
      setAutoMode(mode);
      animateLearning();animateFuture();animateQualitySteps();
    }
    startTimers();
  }
  function refreshLanguage(){
    if(!isHome())return;
    const mode=currentDemoMode(),idx=demoModes.indexOf(mode);if(idx>=0)modeIndex=idx;
    // Keep rotate/status timers and the current animation progress untouched.
    // Only replace language-sensitive text for the frame that is already visible.
    const input=$('#v29-prompt');
    if(input&&document.activeElement!==input){
      clearInterval(typingTimer);typingTimer=null;input.classList.remove('v30-typing-cursor');
      const language=uiLanguage(),bank=promptBanks[mode]?.[language]||promptBanks[mode]?.en||['Ask ARKI or open a SCHOLARK learning tool.'];
      const step=Math.max(0,(promptSteps[mode]||1)-1);
      input.value=bank[step%bank.length];resizePrompt(input);
    }
    const lc=uiLanguage(),schoolRows=schoolLiveLabels[lc]||schoolLiveLabels.en,aheadRows=aheadLiveLabels[lc]||aheadLiveLabels.en;
    const displayed=Math.max(0,futureStep-1)%4;
    const schoolLabel=$('.v30-school-live .v30-live-label'),caption=$('.v30-ahead-caption');
    if(schoolLabel)schoolLabel.textContent=schoolRows[displayed%schoolRows.length];
    if(caption)caption.textContent=aheadRows[displayed%aheadRows.length];
    animateQualitySteps(mode);
    window.__SCHOLARK_I18N__?.apply?.($('#v29-home-layer'));
    window.__SCHOLARK_HOME_FOUNDATION__?.repair?.();
  }

  function syncModeFrame(mode){
    if(!demoModes.includes(mode)||!isHome())return;
    const idx=demoModes.indexOf(mode);if(idx>=0)modeIndex=idx;
    statusStep=0;animateQualitySteps(mode);
    const input=$('#v29-prompt');
    if(input&&document.activeElement!==input){
      clearInterval(typingTimer);typingTimer=null;input.classList.remove('v30-typing-cursor');
      const language=uiLanguage(),bank=promptBanks[mode]?.[language]||promptBanks[mode]?.en||['Ask ARKI or open a SCHOLARK learning tool.'];
      input.value=bank[0];resizePrompt(input);
    }
  }

  function sync(){restoreLegacy();if(isHome())ensureDemo();else stopDemo();}
  addEventListener('hashchange',()=>setTimeout(sync,50));
  addEventListener('scholark-home-mode-change',e=>{const mode=e.detail?.mode,source=e.detail?.source||'manual';if(!mode||source==='auto')return;requestAnimationFrame(()=>syncModeFrame(mode))});
  addEventListener('popstate',()=>setTimeout(sync,50));
  addEventListener('scholark-language-ready',()=>{if(isHome())requestAnimationFrame(refreshLanguage)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopDemo();else sync()});
  setTimeout(sync,120);
  window.__SCHOLARK_V30_DEMO__={stop:stopDemo,start:ensureDemo,sync,refreshLanguage,resizePrompt,isRunning:()=>!!rotateTimer&&!!statusTimer,state:()=>({mode:currentDemoMode(),modeIndex,futureStep,learnStep,typing:!!typingTimer,rotating:!!rotateTimer,status:!!statusTimer})};
})();