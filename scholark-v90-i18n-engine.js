(() => {
  if(window.__SCHOLARK_V90_I18N__) return;
  window.__SCHOLARK_V90_I18N__=true;

  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const LANGS=[
    ['nl','Nederlands','Dutch'],['en','English','English'],['es','Español','Spanish'],['fr','Français','French'],
    ['de','Deutsch','German'],['pt','Português','Portuguese'],['it','Italiano','Italian']
  ]

  const STATIC_UI={nl:{},es:{},fr:{},de:{},pt:{},it:{}};
  const add=(en,nl,es,fr,de,pt,it)=>{for(const [k,v] of Object.entries({nl,es,fr,de,pt,it}))if(v)STATIC_UI[k][en]=v};
  [
    ['Dashboard','Dashboard','Panel de control','Tableau de bord','Dashboard','Painel','Dashboard'],
    ['Studio AI','Studio AI','Studio IA','Studio IA','KI-Studio','Studio de IA','Studio IA'],
    ['AI Tutor','AI Tutor','Tutor de IA','Tuteur IA','KI-Tutor','Tutor de IA','Tutor IA'],
    ['Education & Learning','Educatie & Leren','Educación y aprendizaje','Éducation et apprentissage','Bildung & Lernen','Educação e aprendizagem','Istruzione e apprendimento'],
    ['Language Learner','Talen leren','Aprendizaje de idiomas','Apprentissage des langues','Sprachen lernen','Aprender idiomas','Apprendimento lingue'],
    ['Planner','Planner','Planificador','Planificateur','Planer','Planejador','Pianificatore'],
    ['Progress','Voortgang','Progreso','Progression','Fortschritt','Progresso','Progresso'],
    ['Goals','Doelen','Objetivos','Objectifs','Ziele','Metas','Obiettivi'],
    ['Files & Notes','Bestanden & Notities','Archivos y notas','Fichiers et notes','Dateien & Notizen','Arquivos e notas','File e note'],
    ['My Projects','Mijn projecten','Mis proyectos','Mes projets','Meine Projekte','Meus projetos','I miei progetti'],
    ['Schools Near Me','Scholen in de buurt','Escuelas cerca de mí','Écoles à proximité','Schulen in meiner Nähe','Escolas perto de mim','Scuole vicino a me'],
    ['Study Ahead','Vooruit leren','Prepárate con antelación','Prendre de l’avance','Vorauslernen','Estudar com antecedência','Studia in anticipo'],
    ['Book Studio','Boekstudio','Estudio de libros','Studio Livre','Buchstudio','Estúdio de livros','Studio Libro'],
    ['WORKSPACE','WERKRUIMTE','ESPACIO DE TRABAJO','ESPACE DE TRAVAIL','ARBEITSBEREICH','ESPAÇO DE TRABALHO','AREA DI LAVORO'],
    ['FUTURE & PRO','TOEKOMST & PRO','FUTURO & PRO','AVENIR & PRO','ZUKUNFT & PRO','FUTURO & PRO','FUTURO & PRO'],
    ['Return to homepage','Terug naar de homepage','Volver al inicio','Retour à l’accueil','Zur Startseite','Voltar ao início','Torna alla home'],
    ['CHOOSE HOW SCHOLARK SHOULD WORK & TEACH','KIES HOE SCHOLARK MOET WERKEN EN LESGEVEN','ELIGE CÓMO DEBE TRABAJAR Y ENSEÑAR SCHOLARK','CHOISISSEZ COMMENT SCHOLARK DOIT TRAVAILLER ET ENSEIGNER','WÄHLE, WIE SCHOLARK ARBEITEN UND LEHREN SOLL','ESCOLHA COMO O SCHOLARK DEVE TRABALHAR E ENSINAR','SCEGLI COME SCHOLARK DEVE LAVORARE E INSEGNARE'],
    ['Young learner','Jonge leerling','Estudiante joven','Jeune apprenant','Junger Lernender','Jovem aluno','Giovane studente'],
    ['Primary school','Basisschool','Primaria','École primaire','Grundschule','Ensino primário','Scuola primaria'],
    ['Student','Student','Estudiante','Étudiant','Student','Estudante','Studente'],
    ['Adult','Volwassene','Adulto','Adulte','Erwachsener','Adulto','Adulto'],
    ['Your learning & creation workspace.','Jouw leer- en creatiewerkruimte.','Tu espacio de aprendizaje y creación.','Votre espace d’apprentissage et de création.','Dein Lern- und Kreativbereich.','Seu espaço de aprendizagem e criação.','Il tuo spazio di apprendimento e creazione.'],
    ['Open the tool you need. Your selected level changes how SCHOLARK should explain, structure and challenge you, while every AI workflow uses the highest available quality.','Open de tool die je nodig hebt. Je gekozen niveau bepaalt hoe SCHOLARK uitlegt, structureert en je uitdaagt, terwijl elke AI-workflow de hoogst beschikbare kwaliteit gebruikt.','Abre la herramienta que necesites. El nivel seleccionado cambia cómo SCHOLARK explica, estructura y te desafía, mientras cada flujo de IA usa la máxima calidad disponible.','Ouvrez l’outil dont vous avez besoin. Le niveau choisi adapte les explications, la structure et le défi, tandis que chaque flux IA utilise la meilleure qualité disponible.','Öffne das benötigte Werkzeug. Dein Niveau bestimmt, wie SCHOLARK erklärt, strukturiert und fordert; jeder KI-Workflow nutzt die höchste verfügbare Qualität.','Abra a ferramenta que precisa. O nível escolhido ajusta como o SCHOLARK explica, estrutura e desafia, enquanto cada fluxo de IA usa a melhor qualidade disponível.','Apri lo strumento che ti serve. Il livello scelto adatta spiegazioni, struttura e difficoltà, mentre ogni flusso IA usa la migliore qualità disponibile.'],
    ['Create presentations, webpages, documents, social content and graphics from a structured brief.','Maak presentaties, webpagina’s, documenten, social content en graphics vanuit een gestructureerde briefing.','Crea presentaciones, páginas web, documentos, contenido social y gráficos a partir de un brief estructurado.','Créez des présentations, pages web, documents, contenus sociaux et visuels à partir d’un brief structuré.','Erstelle Präsentationen, Webseiten, Dokumente, Social Content und Grafiken aus einem strukturierten Briefing.','Crie apresentações, páginas web, documentos, conteúdo social e gráficos a partir de um briefing estruturado.','Crea presentazioni, pagine web, documenti, contenuti social e grafiche da un brief strutturato.'],
    ['Ask, learn, practice and get explanations adapted to your selected level.','Vraag, leer, oefen en krijg uitleg die past bij jouw gekozen niveau.','Pregunta, aprende, practica y recibe explicaciones adaptadas a tu nivel.','Posez des questions, apprenez, pratiquez et obtenez des explications adaptées à votre niveau.','Frage, lerne, übe und erhalte Erklärungen passend zu deinem Niveau.','Pergunte, aprenda, pratique e receba explicações adaptadas ao seu nível.','Chiedi, impara, esercitati e ricevi spiegazioni adatte al tuo livello.'],
    ['Diagnostics, learning paths, mastery and study support in one place.','Diagnostiek, leerpaden, beheersing en studieondersteuning op één plek.','Diagnósticos, rutas de aprendizaje, dominio y apoyo al estudio en un solo lugar.','Diagnostics, parcours d’apprentissage, maîtrise et soutien scolaire au même endroit.','Diagnostik, Lernpfade, Beherrschung und Lernhilfe an einem Ort.','Diagnósticos, trilhas de aprendizagem, domínio e apoio ao estudo em um só lugar.','Diagnostica, percorsi di apprendimento, padronanza e supporto allo studio in un unico posto.'],
    ['Learn vocabulary, grammar, pronunciation and conversation with adaptive lessons.','Leer woordenschat, grammatica, uitspraak en gesprekken met adaptieve lessen.','Aprende vocabulario, gramática, pronunciación y conversación con lecciones adaptativas.','Apprenez le vocabulaire, la grammaire, la prononciation et la conversation avec des leçons adaptatives.','Lerne Wortschatz, Grammatik, Aussprache und Konversation mit adaptiven Lektionen.','Aprenda vocabulário, gramática, pronúncia e conversação com aulas adaptativas.','Impara vocabolario, grammatica, pronuncia e conversazione con lezioni adattive.'],
    ['Organize goals, study sessions, deadlines and what to work on next.','Organiseer doelen, studiesessies, deadlines en wat je hierna moet aanpakken.','Organiza objetivos, sesiones de estudio, fechas límite y lo que debes trabajar después.','Organisez objectifs, séances d’étude, échéances et prochaines priorités.','Organisiere Ziele, Lernsitzungen, Fristen und deine nächsten Aufgaben.','Organize metas, sessões de estudo, prazos e o que fazer em seguida.','Organizza obiettivi, sessioni di studio, scadenze e prossime attività.'],
    ['See what is improving, what is weak and where to focus next.','Zie wat verbetert, wat zwak is en waar je je hierna op moet richten.','Mira qué mejora, qué está débil y dónde enfocarte después.','Voyez ce qui progresse, ce qui reste faible et où vous concentrer ensuite.','Sieh, was besser wird, wo Schwächen liegen und worauf du dich als Nächstes konzentrieren solltest.','Veja o que está melhorando, o que está fraco e onde focar depois.','Vedi cosa migliora, cosa è debole e dove concentrarti dopo.'],
    ['Set learning, school and creation goals and connect them to your plan.','Stel leer-, school- en creatiedoelen in en verbind ze met je plan.','Define objetivos de aprendizaje, escuela y creación y conéctalos con tu plan.','Fixez des objectifs d’apprentissage, scolaires et créatifs et reliez-les à votre plan.','Setze Lern-, Schul- und Kreativziele und verknüpfe sie mit deinem Plan.','Defina metas de aprendizagem, escola e criação e conecte-as ao seu plano.','Imposta obiettivi di apprendimento, scuola e creazione e collegali al tuo piano.'],
    ['Return to saved Studio work, documents, research and ongoing projects.','Ga terug naar opgeslagen Studio-werk, documenten, onderzoek en lopende projecten.','Vuelve a trabajos de Studio, documentos, investigaciones y proyectos guardados.','Retrouvez vos travaux Studio, documents, recherches et projets en cours enregistrés.','Kehre zu gespeicherten Studio-Arbeiten, Dokumenten, Recherchen und laufenden Projekten zurück.','Volte aos trabalhos do Studio, documentos, pesquisas e projetos salvos.','Torna ai lavori Studio, documenti, ricerche e progetti salvati.'],
    ['Find education options for the study you actually want.','Vind onderwijsopties voor de studie die je echt wilt doen.','Encuentra opciones educativas para los estudios que realmente quieres.','Trouvez des options d’études pour la formation que vous voulez vraiment suivre.','Finde Bildungsangebote für das Studium, das du wirklich willst.','Encontre opções de ensino para o curso que você realmente deseja.','Trova opzioni formative per il percorso di studi che vuoi davvero.'],
    ['YOUR AI LEARNING + CREATION OS','JOUW AI LEER- + CREATIE-OS','TU SISTEMA DE APRENDIZAJE + CREACIÓN CON IA','VOTRE OS D’APPRENTISSAGE + CRÉATION IA','DEIN KI-LERN- + KREATIV-OS','SEU OS DE APRENDIZAGEM + CRIAÇÃO COM IA','IL TUO OS DI APPRENDIMENTO + CREAZIONE IA'],
    ['Learn faster. Create better. Get ahead.','Leer sneller. Maak beter. Loop vooruit.','Aprende más rápido. Crea mejor. Toma ventaja.','Apprenez plus vite. Créez mieux. Prenez de l’avance.','Lerne schneller. Erstelle besser. Sei voraus.','Aprenda mais rápido. Crie melhor. Saia na frente.','Impara più velocemente. Crea meglio. Parti in vantaggio.'],
    ['Describe what you want to learn or create…','Beschrijf wat je wilt leren of maken…','Describe lo que quieres aprender o crear…','Décrivez ce que vous voulez apprendre ou créer…','Beschreibe, was du lernen oder erstellen möchtest…','Descreva o que você quer aprender ou criar…','Descrivi cosa vuoi imparare o creare…'],
    ['Create with SCHOLARK AI','Maak met SCHOLARK AI','Crear con SCHOLARK AI','Créer avec SCHOLARK AI','Mit SCHOLARK AI erstellen','Criar com SCHOLARK AI','Crea con SCHOLARK AI'],
    ['One studio. Every format.','Eén studio. Elk formaat.','Un estudio. Todos los formatos.','Un studio. Tous les formats.','Ein Studio. Jedes Format.','Um estúdio. Todos os formatos.','Uno studio. Ogni formato.'],
    ['A learning system that adapts to you.','Een leersysteem dat zich aan jou aanpast.','Un sistema de aprendizaje que se adapta a ti.','Un système d’apprentissage qui s’adapte à vous.','Ein Lernsystem, das sich an dich anpasst.','Um sistema de aprendizagem que se adapta a você.','Un sistema di apprendimento che si adatta a te.'],
    ['Know where you are going before you get there.','Weet waar je naartoe gaat vóór je er bent.','Sabe adónde vas antes de llegar.','Sachez où vous allez avant d’y arriver.','Wisse, wohin du gehst, bevor du dort bist.','Saiba para onde vai antes de chegar lá.','Sai dove stai andando prima di arrivarci.'],
    ['Your next advantage can start today.','Je volgende voorsprong kan vandaag beginnen.','Tu próxima ventaja puede empezar hoy.','Votre prochain avantage peut commencer aujourd’hui.','Dein nächster Vorsprung kann heute beginnen.','Sua próxima vantagem pode começar hoje.','Il tuo prossimo vantaggio può iniziare oggi.'],
    ['Open SCHOLARK Studio','Open SCHOLARK Studio','Abrir SCHOLARK Studio','Ouvrir SCHOLARK Studio','SCHOLARK Studio öffnen','Abrir SCHOLARK Studio','Apri SCHOLARK Studio'],
    ['Presentation','Presentatie','Presentación','Présentation','Präsentation','Apresentação','Presentazione'],
    ['Webpage','Webpagina','Página web','Page web','Webseite','Página web','Pagina web'],
    ['Document','Document','Documento','Document','Dokument','Documento','Documento'],
    ['Social','Social','Social','Social','Social','Social','Social'],
    ['Graphic','Graphic','Gráfico','Visuel','Grafik','Gráfico','Grafica'],
    ['Mastery that moves with you.','Beheersing die met je meegroeit.','Dominio que evoluciona contigo.','Une maîtrise qui progresse avec vous.','Beherrschung, die mit dir wächst.','Domínio que evolui com você.','Padronanza che cresce con te.'],
    ['Diagnostics','Diagnostiek','Diagnósticos','Diagnostics','Diagnostik','Diagnósticos','Diagnostica'],
    ['Study plans that respond to progress.','Studieplannen die reageren op je voortgang.','Planes de estudio que responden a tu progreso.','Des plans d’étude qui s’adaptent à vos progrès.','Lernpläne, die auf deinen Fortschritt reagieren.','Planos de estudo que respondem ao seu progresso.','Piani di studio che rispondono ai tuoi progressi.'],
    ['Let the AI presenters explain','Laat de AI-presentatoren het uitleggen','Deja que los presentadores de IA lo expliquen','Laissez les présentateurs IA expliquer','Lass die KI-Moderatoren erklären','Deixe os apresentadores de IA explicarem','Lascia spiegare ai presentatori IA'],
    ['Explore nearby schools','Verken scholen in de buurt','Explorar escuelas cercanas','Explorer les écoles à proximité','Schulen in der Nähe erkunden','Explorar escolas próximas','Esplora le scuole vicine'],
    ['Build my head start','Bouw mijn voorsprong','Crear mi ventaja inicial','Construire mon avance','Meinen Vorsprung aufbauen','Criar minha vantagem inicial','Costruisci il mio vantaggio'],
    ['Account','Account','Cuenta','Compte','Konto','Conta','Account'],
    ['Sign in','Inloggen','Iniciar sesión','Se connecter','Anmelden','Entrar','Accedi'],
    ['Sign out','Uitloggen','Cerrar sesión','Se déconnecter','Abmelden','Sair','Esci'],
    ['Plans & billing','Abonnementen & facturering','Planes y facturación','Offres et facturation','Tarife & Abrechnung','Planos e cobrança','Piani e fatturazione'],
    ['Go to Workspace','Ga naar Werkruimte','Ir al espacio de trabajo','Aller à l’espace de travail','Zum Arbeitsbereich','Ir para o espaço de trabalho','Vai all’area di lavoro'],
    ['Continue where you left off','Ga verder waar je was gebleven','Continúa donde lo dejaste','Reprendre là où vous vous étiez arrêté','Dort weitermachen, wo du aufgehört hast','Continue de onde parou','Continua da dove eri rimasto'],
    ['Continue →','Doorgaan →','Continuar →','Continuer →','Weiter →','Continuar →','Continua →'],
    ['Usage foundation','Gebruiksbasis','Base de uso','Base d’utilisation','Nutzungsbasis','Base de uso','Base di utilizzo'],
    ['Available AI credits','Beschikbare AI-credits','Créditos de IA disponibles','Crédits IA disponibles','Verfügbare KI-Credits','Créditos de IA disponíveis','Crediti IA disponibili'],
    ['SCHOLARK CREDITS','SCHOLARK CREDITS','CRÉDITOS SCHOLARK','CRÉDITS SCHOLARK','SCHOLARK CREDITS','CRÉDITOS SCHOLARK','CREDITI SCHOLARK'],
    ['Plans & limits','Abonnementen & limieten','Planes y límites','Offres et limites','Tarife & Limits','Planos e limites','Piani e limiti'],
    ['SCHOLARK PLANS','SCHOLARK ABONNEMENTEN','PLANES SCHOLARK','OFFRES SCHOLARK','SCHOLARK TARIFE','PLANOS SCHOLARK','PIANI SCHOLARK'],
    ['Choose how much advantage you want.','Kies hoeveel voorsprong je wilt.','Elige cuánta ventaja quieres.','Choisissez l’avance que vous souhaitez.','Wähle, wie viel Vorsprung du willst.','Escolha quanta vantagem você quer.','Scegli quanto vantaggio vuoi.'],
    ['Free','Gratis','Gratis','Gratuit','Kostenlos','Grátis','Gratis'],
    ['MOST POPULAR','MEEST POPULAIR','MÁS POPULAR','LE PLUS POPULAIRE','AM BELIEBTESTEN','MAIS POPULAR','PIÙ POPOLARE'],
    ['No payment method required.','Geen betaalmethode nodig.','No se requiere método de pago.','Aucun moyen de paiement requis.','Keine Zahlungsmethode erforderlich.','Nenhum método de pagamento necessário.','Nessun metodo di pagamento richiesto.'],
    ['Start free','Start gratis','Empezar gratis','Commencer gratuitement','Kostenlos starten','Começar grátis','Inizia gratis'],
    ['For everyday learning, practice and planning.','Voor dagelijks leren, oefenen en plannen.','Para aprender, practicar y planificar cada día.','Pour apprendre, pratiquer et planifier au quotidien.','Für tägliches Lernen, Üben und Planen.','Para aprender, praticar e planejar todos os dias.','Per imparare, esercitarsi e pianificare ogni giorno.'],
    ['Everything in Free','Alles uit Gratis','Todo lo de Gratis','Tout ce qui est inclus dans Gratuit','Alles aus Kostenlos','Tudo do Grátis','Tutto di Gratis'],
    ['Everything in Plus','Alles uit Plus','Todo lo de Plus','Tout ce qui est inclus dans Plus','Alles aus Plus','Tudo do Plus','Tutto di Plus'],
    ['7-language interface','Interface in 7 talen','Interfaz en 7 idiomas','Interface en 7 langues','Oberfläche in 7 Sprachen','Interface em 7 idiomas','Interfaccia in 7 lingue'],
    ['/ month','/ maand','/ mes','/ mois','/ Monat','/ mês','/ mese'],
    ['Ask Tutor','Vraag Tutor','Preguntar al Tutor','Demander au tuteur','Tutor fragen','Perguntar ao Tutor','Chiedi al Tutor'],
    ['Use my files','Gebruik mijn bestanden','Usar mis archivos','Utiliser mes fichiers','Meine Dateien verwenden','Usar meus arquivos','Usa i miei file'],
    ['Create in Studio','Maak in Studio','Crear en Studio','Créer dans Studio','Im Studio erstellen','Criar no Studio','Crea in Studio'],
    ['Run diagnostic','Diagnose starten','Iniciar diagnóstico','Lancer le diagnostic','Diagnose starten','Executar diagnóstico','Avvia diagnostica'],
    ['Target language','Doeltaal','Idioma objetivo','Langue cible','Zielsprache','Idioma de destino','Lingua di destinazione'],
    ['Support language','Ondersteuningstaal','Idioma de apoyo','Langue d’aide','Unterstützungssprache','Idioma de apoio','Lingua di supporto'],
    ['Current level','Huidig niveau','Nivel actual','Niveau actuel','Aktuelles Niveau','Nível atual','Livello attuale'],
    ['Learning goal','Leerdoel','Objetivo de aprendizaje','Objectif d’apprentissage','Lernziel','Objetivo de aprendizagem','Obiettivo di apprendimento'],
    ['Conversation','Gesprek','Conversación','Conversation','Konversation','Conversação','Conversazione'],
    ['Travel','Reizen','Viajes','Voyage','Reisen','Viagem','Viaggio'],
    ['School','School','Escuela','École','Schule','Escola','Scuola'],
    ['Work','Werk','Trabajo','Travail','Arbeit','Trabalho','Lavoro'],
    ['Grammar','Grammatica','Gramática','Grammaire','Grammatik','Gramática','Grammatica'],
    ['Vocabulary','Woordenschat','Vocabulario','Vocabulaire','Wortschatz','Vocabulário','Vocabolario'],
    ['Pronunciation','Uitspraak','Pronunciación','Prononciation','Aussprache','Pronúncia','Pronuncia']
  ].forEach(r=>add(...r));
  const RTL=new Set();
  const CORE=[
    'Dashboard','Studio AI','AI Tutor','Education & Learning','Planner','Progress','Goals','Files & Notes','My Projects','Schools Near Me','Study Ahead','Book Studio',
    'WORKSPACE','FUTURE & PRO','Return to homepage','AI QUALITY · MAX','Highest available quality, expert depth, research, source checking and final polish.',
    'CHOOSE HOW SCHOLARK SHOULD WORK & TEACH','Young learner','Primary school','VOJ & VOS','Student','Adult',
    'Your learning & creation workspace.','Open the tool you need. Your selected level changes how SCHOLARK should explain, structure and challenge you, while every AI workflow uses the highest available quality.',
    'Usage foundation','Sign in to keep usage, chats, projects and learning data attached to you.','Cloud wallet active · fair-use limits stay tied to your account.','Available AI credits','Plans & limits',
    'Create presentations, webpages, documents, social content and graphics from a structured brief.','Ask, learn, practice and get explanations adapted to your selected level.',
    'Diagnostics, learning paths, mastery and study support in one place.','Organize goals, study sessions, deadlines and what to work on next.',
    'See what is improving, what is weak and where to focus next.','Set learning, school and creation goals and connect them to your plan.',
    'Return to saved Studio work, documents, research and ongoing projects.','Find education options for the study you actually want.',
    'Know the field before you enter it.','Tell SCHOLARK what you plan to study. Country and target school are optional; the roadmap focuses on knowledge, skills and preparation rather than inventing admissions rules.',
    'Field of study, e.g. Law, Computer Science','Country (optional)','Target university / school (optional)','Start from foundations','I already know the basics',
    'Anything SCHOLARK should know about your goals, strengths or current subjects (optional)','Build my Study Ahead roadmap','Building roadmap…',
    'Skills to build','Key subjects','Books & resources','University preparation','Career directions','Your roadmap','Saved Study Ahead tracks',
    'Add roadmap to Planner','Add key subjects to Mastery','Save / refresh track','Study Ahead is connected to your Planner and Mastery Map.',
    'CHAT HISTORY','+ New chat','Local chat mode.','Sign in','to sync chat history across devices.','No saved chats yet.','Ask SCHOLARK anything you want to learn...','Ask SCHOLARK AI',
    'I’m ready. Ask a question, paste a problem, or tell me what subject you want explained.','Step-by-step method','Worked examples','Key points to remember','Common mistakes','Check yourself','Next step',
    'Upload once. Turn it into useful work.','PDF, DOCX, PPTX, TXT, Markdown, CSV, JSON and images can live in the workflow. Readable documents can immediately become summaries, explanations, quizzes, flashcards, notes, study plans or source material for Studio.',
    '+ Add files','Up to 8 files · max 10 MB each','Summarize','Explain','Quiz','Flashcards','Notes','Study plan','Send to Studio','Ready when you are.',
    'Upload study material, a report, slides, notes or data. SCHOLARK will keep the workflow grounded in what you supplied.','Working…','SCHOLARK is analyzing the uploaded material.',
    'Build the book, chapter by chapter.','Create the complete architecture first, then generate, edit, save and export real chapter drafts in the same workspace.',
    'Working title (optional)','Genre / type','Describe the book you want to create…','Audience (optional)','Third person','First person','Multiple POV','Nonfiction / not applicable',
    'Create book plan with AI','Rebuild book plan with AI','Start with your concept; SCHOLARK will build the chapter architecture.','CHAPTERS','Writing coach','Continuity & purpose','Mood / research direction',
    'Generate chapter draft','Regenerate chapter draft','Export DOCX','Export PDF','Architecting the book…','Writing the chapter…',
    'Curriculum Explorer','Mastery Map','Exam Prep Center','Diagnostic Check','Spaced Review Queue','Study Methods Lab',
    'Find what you know, what is weak and what should enter your Mastery Map next.','Review weak topics at the right time instead of rereading everything.',
    'Run diagnostic','Mixed difficulty','Foundation','Intermediate','Challenge','Refresh queue','You are caught up.','Review now',
    'Active Recall','Feynman Technique','Blurting','Interleaving','Dual Coding','Spaced Repetition','Pomodoro','Cornell Notes','SQ3R','Leitner System',
    'AI LEARNING + CREATION OS','Account','Sign in','Sign out','Plans & billing','Open Workspace',
    'YOUR AI LEARNING + CREATION OS','Learn faster. Create better.','Get ahead.','Learn faster. Create better. Get ahead.','Describe what you want to learn or create…','Create with SCHOLARK AI',
    'One studio. Every format.','Start with intent, not a blank page. SCHOLARK plans the structure, creates the first version and lets you refine only what matters.',
    'A learning system that adapts to you.','Diagnostics, mastery, spaced repetition and AI tutoring work together instead of living in separate tools.',
    'Know where you are going before you get there.','Find schools nearby, explore future studies and learn ahead so your first semester does not have to be your first exposure.',
    'Your next advantage can start today.','Learn, build, research, create and prepare for what comes next — in one place.','Open SCHOLARK Studio',
    'prompt to first draft','creator formats','adaptive learning core','ways to keep improving','Presentation','Webpage','Document','Social','Graphic','Book Studio',
    'From prompt to polished deck.','Outline, narrative, slide copy, visuals, charts and design are assembled before you edit.','Complete first draft','Slide-by-slide regeneration','Research + citations','PPTX / PDF export',
    'Generate a real page, not wireframe filler.','Hero, sections, copy, CTA hierarchy and responsive structure are planned together.','Landing pages','Portfolios','Project pages','Responsive layouts',
    'Reports that already have structure and substance.','SCHOLARK can plan the argument, research, sections, conclusion and references before drafting.','Reports & essays','Research-first writing','Section regeneration','DOCX / PDF export',
    'Campaign thinking, not random captions.','Hooks, captions, carousels, visual direction and CTA are generated as one campaign system.','Carousels','LinkedIn content','Short-form hooks','Campaign concepts',
    'Posters, infographics and diagrams built around hierarchy.','Copy, visual structure and design intent are created together so you start from a finished concept.','Posters','Infographics','Diagrams','Social graphics',
    'Turn an idea into a book you can actually finish.','Plan length, audience, chapters, paragraph flow, scenes and what should logically come next.','Book idea development','Chapter architecture','Writing coach','Continuation suggestions',
    'Structure','AI plans the logic first.','Draft','Content and design arrive together.','Improve','Regenerate only what needs work.','Export','Use the result outside SCHOLARK.',
    'Mastery that moves with you.','Weak topics become tomorrow’s practice. Strong topics move into spaced review instead of disappearing.',
    'Explain, quiz, challenge and adapt to your level.','Diagnostics','Find what you do not know before wasting time reviewing what you already understand.',
    'Study plans that respond to progress.','Goals, mastery, practice and revision all feed the same learning plan instead of living in separate screens.',
    'Let the AI presenters explain','Explore nearby schools','Build my head start','LIVE PRODUCT DEMO','auto-cycling demo',
    'Research checked','Design assembled','Outline complete','Quality pass','Ready to edit',
    'Demo: scanning an 8 km radius…','Nearby school matches appear with distance + type.','Compare options → save the ones you want to explore.',
    'Goal selected: Law / Juridical Studies','Previewing first-year subjects + core skills…','Head-start plan ready: concepts to learn before semester 1.',
    'AI TUTOR','Explain photosynthesis like I am 13.','Simplifying concept…','Quick check: Why do plants need sunlight?','adaptive question ready','Weak topic detected','adding a shorter practice set for tomorrow',
    '“Explain photosynthesis like I am 13.” → Simplifying concept…','Quick check: “Why do plants need sunlight?” → adaptive question ready','Weak topic detected → adding a shorter practice set for tomorrow',
    'DIAGNOSTICS','Scanning 12 skills…','3 weak areas found','prioritizing practice','Mastered topics moved to spaced review','3 weak areas found → prioritizing practice',
    'Profile & preferences','Your learning profile should follow you across devices and improve how SCHOLARK teaches and creates.','Display name','Role','Country','City','School / university','Study field','Learning level','Language','Important subjects / topics','Save profile','Open Workspace','New homepage',
    'Go to Workspace','Open your dashboard, Studio AI, Tutor, learning tools, planning, goals and Pro tools.','Continue where you left off','Continue →',
    'Ask Tutor','Deep explanation + examples','Use my files','Summaries, quizzes and notes','Run diagnostic','Find weak topics fast','Create in Studio','Build a polished artifact','Prepare for a future field',
    'Language Learner','Learn vocabulary, grammar, pronunciation and conversation with adaptive lessons.','Learn a language','Build a language lesson','Target language','Support language','Current level','Learning goal','Topic or situation','Conversation','Travel','School','Work','Grammar','Vocabulary','Pronunciation','Exam preparation',
    'Lesson complete','Listen','Practice speaking','Show answer','Hide answer','Vocabulary & phrases','Grammar made clear','Practice dialogue','Exercises','Culture tip','Next lesson','Your language progress','Lessons completed','Current streak','XP',
    'SCHOLARK PLANS','Choose how much advantage you want.','Free','Plus','Pro','SCHOLARK Free','SCHOLARK Plus','SCHOLARK Pro','MOST POPULAR','No payment method required.','Start free','Start Plus free trial','Start Pro free trial',
    'For everyday learning, practice and planning.','For learners and creators who use Studio AI regularly.','Maximum AI quality, large projects and future-study tools.',
    'AI Tutor with step-by-step lessons','Diagnostics, Mastery & Spaced Review','Planner, Goals & Progress','Files & Notes analysis','Language Learner: vocabulary, grammar, listening & speaking practice','7-language interface','100 AI text requests/day','8 AI images/day',
    'Everything in Free','Studio AI: Presentation, Webpage, Document, Social & Graphic','Research + citations and web sources','Cloud projects + version history','Advanced Files & Notes: Ask Files, worksheets and study tools','Natural Rewrite — 2/day','350 AI text requests/day','25 AI images/day',
    'Everything in Plus','Highest-quality SCHOLARK AI','Unlimited Studio + Natural Rewrite','Presentations up to 100 slides','Documents/reports up to 100 pages','Book Studio up to 900,000 words','All genres + custom blends','Schools Near Me + Study Ahead','1,000 AI text requests/day','60 AI images/day',
    '/ month','7 days free, then $14.99/month. Cancel anytime.','7 days free, then $19.99/month. Cancel anytime.','Plans & limits',
    'Presentation Builder','Webpage Builder','Document Builder','Social Builder','Graphic Builder','Research-first','Facts, structure and visuals are checked before the first draft is shown.','Evidence, narrative and strong slide logic generated together.',
    'GENERATOR-FIRST','LEARNING OS','SCHOLARK FUTURE','Study Ahead explains what your future study may demand before you enroll.','Schools Near Me helps you find nearby education options around your location.',
    'Use your location to discover schools nearby and compare the options around you.','Choose a future study or career and build a learning head start before your first class.'
  ];

  const css=document.createElement('style');css.id='scholark-v90-style';css.textContent=`
    #v90-language-overlay{position:fixed;inset:0;z-index:2147483647;display:none;place-items:center;background:rgba(11,13,18,.88);backdrop-filter:blur(12px);color:#fff;font-family:Inter,system-ui;padding:24px}
    #v90-language-overlay.open{display:grid}.v90-switch-card{width:min(560px,94vw);padding:28px;border-radius:24px;background:#17191f;border:1px solid rgba(255,255,255,.12);box-shadow:0 30px 100px rgba(0,0,0,.38)}
    .v90-switch-card small{display:block;font:950 8px Inter;letter-spacing:.14em;color:#c9ff6a}.v90-switch-card h2{font:950 30px/1 Inter;margin:10px 0}.v90-switch-card p{font:650 10px/1.55 Inter;color:#c8c4cf}.v90-progress{height:7px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden;margin-top:16px}.v90-progress i{display:block;height:100%;width:35%;background:#c9ff6a;border-radius:inherit;animation:v90move 1s ease-in-out infinite alternate}@keyframes v90move{to{transform:translateX(180%)}}
    .v90-langbox{margin:12px 8px 4px;padding:11px;border-radius:14px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08)}.v90-langbox label{display:block;margin-bottom:6px;font:900 6.8px Inter;letter-spacing:.13em;color:#8f8b98}.v90-langbox select{width:100%;border:1px solid rgba(255,255,255,.12);background:#22252e;color:#fff;border-radius:10px;padding:8px;font:800 8px Inter;outline:0}.v90-langbox option{background:#fff;color:#17191f}
    html[dir="rtl"] #v51-sidebar{left:auto;right:0}html[dir="rtl"] #v51-main{left:0;right:var(--v51-side)}html[dir="rtl"] #v51-side-toggle{left:auto;right:calc(var(--v51-side) - 16px)}html[dir="rtl"] .v51-nav{text-align:right}
  `;document.head.appendChild(css);

  const overlay=document.createElement('div');overlay.id='v90-language-overlay';overlay.innerHTML='<div class="v90-switch-card"><small>SCHOLARK LANGUAGE ENGINE</small><h2>Adapting SCHOLARK…</h2><p id="v90-switch-copy">Translating the homepage, workspace and live product demo before reload.</p><div class="v90-progress"><i></i></div></div>';document.body.appendChild(overlay);

  const code=()=>{const v=localStorage.getItem('scholark_ui_language')||'nl';return LANGS.some(x=>x[0]===v)?v:'nl'};
  const languageName=c=>LANGS.find(x=>x[0]===c)?.[2]||'English';
  const nativeName=c=>LANGS.find(x=>x[0]===c)?.[1]||'English';
  const CACHE_VERSION='v3-seven-ui';
  const key=c=>'scholark_v90_i18n_'+CACHE_VERSION+'_'+c;
  function loadMap(c){let saved={};try{saved=JSON.parse(localStorage.getItem(key(c))||'{}')||{}}catch{}return {...(STATIC_UI[c]||{}),...saved}}
  function saveMap(c,m){try{localStorage.setItem(key(c),JSON.stringify(m))}catch{}}
  let map=loadMap(code()),translating=false,unknownTimer=null,translationEpoch=0,applying=false;
  const textSource=new WeakMap(),attrSource=new WeakMap();
  const DEVICE_LANGS=new Set(['ar','bg','bn','cs','da','de','el','en','es','fi','fr','hi','hr','hu','id','it','he','ja','kn','ko','lt','mr','nl','no','pl','pt','ro','ru','sk','sl','sv','ta','te','th','tr','uk','vi','zh']);
  const deviceTranslators=new Map();
  function primeDeviceTranslator(target,onProgress){
    if(target==='en'||!DEVICE_LANGS.has(target)||!('Translator' in window))return null;
    if(deviceTranslators.has(target))return deviceTranslators.get(target);
    const options={sourceLanguage:'en',targetLanguage:target};
    let promise;
    try{
      promise=window.Translator.create({...options,monitor(m){m.addEventListener('downloadprogress',e=>{try{onProgress?.(Math.max(0,Math.min(100,Math.round(Number(e.loaded||0)*100))))}catch{}})}});
    }catch(e){return null}
    const guarded=Promise.resolve(promise).catch(e=>{deviceTranslators.delete(target);throw e});
    deviceTranslators.set(target,guarded);return guarded;
  }
  async function deviceTranslate(target,strings,onChunk,primed){
    const promise=primed||primeDeviceTranslator(target);if(!promise)return {translated:{},missing:[...strings]};
    let translator;try{translator=await promise}catch{return {translated:{},missing:[...strings]}}
    const translated={},queue=[...strings.entries()];
    const worker=async()=>{while(queue.length){const [,source]=queue.shift();try{const tr=clean(await translator.translate(source));if(tr&&tr!==source){translated[source]=tr;if(typeof onChunk==='function')onChunk({[source]:tr})}}catch{}}};
    await Promise.all(Array.from({length:Math.min(6,strings.length)},()=>worker()));
    return {translated,missing:strings.filter(s=>!translated[s])};
  }
  const rememberText=n=>{if(!textSource.has(n))textSource.set(n,clean(n.nodeValue));return textSource.get(n)||clean(n.nodeValue)};
  const rememberAttrs=el=>{let o=attrSource.get(el);if(!o){o={};for(const a of ['placeholder','aria-label','title']){const v=clean(el.getAttribute?.(a));if(v)o[a]=v}attrSource.set(el,o)}return o};

  function eligibleText(s){
    const t=clean(s);if(!t||t.length<2||t.length>420)return false;
    if(/^https?:|^[\d\s.,:%+$€£¥/\-–—()]+$/.test(t))return false;
    if(/^[A-Z0-9_\-.]{2,18}$/.test(t)&&!t.includes(' '))return false;
    return /[\p{L}\p{N}]/u.test(t);
  }
  function protectedNode(el){
    return !!el?.closest?.('script,style,code,pre,[contenteditable="true"],input[type="password"],.v52-msg.user,.v52-msg.ai,#v52-chat,.v93-ai,.v62-answer,.v62-results,#v86-output,.v65-prose,.v65-editor,[data-v65-body],[data-v65-title],.v57-slide,.v58-canvas,.v68-editor,.v75-doc-editor,.v76-canvas,.v77-page-preview');
  }
  function collectDom(limit=180){
    const out=new Set();
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let n;while((n=walker.nextNode())&&out.size<limit){const el=n.parentElement,src=rememberText(n);if(!protectedNode(el)&&eligibleText(src))out.add(src)}
    $$('input[placeholder],textarea[placeholder],[aria-label],[title]').forEach(el=>{const srcs=rememberAttrs(el);for(const a of ['placeholder','aria-label','title']){const t=clean(srcs[a]);if(eligibleText(t))out.add(t)}});
    return [...out];
  }
  async function translateBatch(target,strings,onChunk,purpose='ui',primed=null){
    if(target==='en')return Object.fromEntries(strings.map(s=>[s,s]));
    const result={};
    const local=await deviceTranslate(target,strings,part=>{Object.assign(result,part);onChunk?.(part)},primed);
    if(!local.missing.length||purpose==='ui'&&STATIC_UI[target])return result;
    const chunks=[];for(let i=0;i<local.missing.length;i+=70)chunks.push(local.missing.slice(i,i+70));
    let cursor=0;
    const worker=async()=>{
      while(cursor<chunks.length){
        const idx=cursor++,chunk=chunks[idx],ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),45000);
        try{
          const r=await fetch('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'translate_ui',language:languageName(target),languageCode:target,purpose,strings:chunk}),signal:ctrl.signal});
          const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok)continue;
          const part={};for(const x of d.result?.translations||[])if(chunk.includes(String(x.source||''))&&clean(x.translated)&&clean(x.translated)!==String(x.source||'')){result[x.source]=x.translated;part[x.source]=x.translated}
          if(Object.keys(part).length&&typeof onChunk==='function')onChunk(part);
        }catch(e){console.warn('[SCHOLARK] translation chunk '+(idx+1)+':',clean(e?.message||e))}finally{clearTimeout(timer)}
      }
    };
    await Promise.all(Array.from({length:Math.min(2,chunks.length)},()=>worker()));
    return result;
  }
  function applyKnown(root=document){
    const c=code();document.documentElement.lang=c;document.documentElement.dir=RTL.has(c)?'rtl':'ltr';map=loadMap(c);
    const base=root.nodeType===1?root:document;applying=true;
    try{
      const walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT);
      let n;while((n=walker.nextNode())){const el=n.parentElement;if(protectedNode(el))continue;const src=rememberText(n);if(!eligibleText(src))continue;const tr=c==='en'?src:(map[src]||src);const raw=n.nodeValue,lead=raw.match(/^\s*/)?.[0]||'',tail=raw.match(/\s*$/)?.[0]||'';if(clean(raw)!==clean(tr))n.nodeValue=lead+tr+tail}
      $$('input[placeholder],textarea[placeholder],[aria-label],[title]',base).forEach(el=>{const srcs=rememberAttrs(el);for(const a of ['placeholder','aria-label','title']){const src=clean(srcs[a]);if(!src)continue;const tr=c==='en'?src:(map[src]||src);if(clean(el.getAttribute(a))!==clean(tr))el.setAttribute(a,tr)}});
    }finally{applying=false}
  }
  async function translateCurrentPage(showOverlay=false){
    const target=code(),epoch=translationEpoch;if(navigator.onLine===false){applyKnown();overlay.classList.remove('open');return}
    if(target==='en'){applyKnown();overlay.classList.remove('open');return}
    if(translating)return;translating=true;
    if(showOverlay){overlay.classList.add('open');$('#v90-switch-copy').textContent='Finishing '+nativeName(target)+' across SCHOLARK…'}
    try{
      for(let pass=0;pass<3&&epoch===translationEpoch;pass++){
        upgradeSelectors();applyKnown();
        const strings=[...new Set(collectDom(1100))].filter(eligibleText);
        const missing=strings.filter(s=>!map[s]);
        if(!missing.length)break;
        const add=await translateBatch(target,missing,part=>{if(epoch!==translationEpoch)return;map={...map,...part};saveMap(target,map);applyKnown()});
        if(epoch!==translationEpoch)break;
        if(!Object.keys(add).length)break;
        map={...map,...add};saveMap(target,map);applyKnown();
        await new Promise(r=>setTimeout(r,70));
      }
    }catch(e){console.warn('[SCHOLARK] full-page localization:',clean(e?.message||e))}
    finally{
      translating=false;if(epoch===translationEpoch)applyKnown();
      if(showOverlay&&epoch===translationEpoch){overlay.style.opacity='0';setTimeout(()=>{overlay.classList.remove('open');overlay.style.removeProperty('opacity')},150)}
      try{sessionStorage.removeItem('scholark_i18n_pending')}catch{}
    }
  }
  async function fillUnknown(){return translateCurrentPage(false)}
  function scheduleUnknown(){clearTimeout(unknownTimer);unknownTimer=setTimeout(fillUnknown,180)}

  function upgradeSelectors(){
    const options=LANGS.map(([v,n])=>'<option value="'+v+'">'+n+'</option>').join('');
    for(const sel of [$('#v55-language'),$('#v36-language'),$('#v89-lang')].filter(Boolean)){
      const val=code();if(sel.dataset.v90!=='1'){sel.dataset.v90='1';sel.innerHTML=options}
      if([...sel.options].some(o=>o.value===val))sel.value=val;
    }
    for(const sel of [$('#v41-language'),$('#v65-language')].filter(Boolean)){
      if(sel.dataset.v90!=='1'){const val=sel.value||code();sel.dataset.v90='1';sel.innerHTML=options;if([...sel.options].some(o=>o.value===val))sel.value=val;else sel.value=code()}
    }
    const legacyStudio=$('#sv24-lang');if(legacyStudio&&legacyStudio.dataset.v90!=='1'){
      const oldValue=legacyStudio.value,name=languageName(code());legacyStudio.dataset.v90='1';legacyStudio.innerHTML=LANGS.map(([v,n,en])=>'<option value="'+en+'">'+n+'</option>').join('');legacyStudio.value=[...legacyStudio.options].some(o=>o.value===oldValue)?oldValue:name;
    }
    const side=$('#v51-sidebar');if(side){
      let box=$('.v90-langbox',side);if(!box){box=document.createElement('div');box.className='v90-langbox';box.innerHTML='<label>SCHOLARK LANGUAGE</label><select id="v90-language"></select>';$('.v85-wallet',side)?.insertAdjacentElement('beforebegin',box)||$('.v51-quality',side)?.insertAdjacentElement('beforebegin',box)}
      const sel=$('#v90-language',box);if(sel&&sel.dataset.v90!=='1'){sel.dataset.v90='1';sel.innerHTML=options;sel.value=code();sel.onchange=()=>changeLanguage(sel.value)}
    }
  }

  async function changeLanguage(target){
    if(!LANGS.some(x=>x[0]===target))return;
    const previous=code(),epoch=++translationEpoch;translating=true;
    overlay.classList.add('open');overlay.style.removeProperty('opacity');$('#v90-switch-copy').textContent='Switching SCHOLARK to '+nativeName(target)+'…';
    const primed=primeDeviceTranslator(target,p=>{$('#v90-switch-copy').textContent='Preparing '+nativeName(target)+' on this device… '+p+'%'});
    localStorage.setItem('scholark_ui_language',target);map=loadMap(target);
    document.documentElement.lang=target;document.documentElement.dir=RTL.has(target)?'rtl':'ltr';upgradeSelectors();applyKnown();
    window.dispatchEvent(new CustomEvent('scholark-language-applied',{detail:{code:target}}));
    if(target==='en'){translating=false;overlay.classList.remove('open');window.dispatchEvent(new CustomEvent('scholark-language-ready',{detail:{code:target,provider:'source',coverage:1}}));return}
    const strings=[...new Set(collectDom(1200))].filter(eligibleText),missing=strings.filter(s=>!map[s]),already=Math.max(0,strings.length-missing.length);
    try{
      let added=0;
      if(missing.length){
        const add=await translateBatch(target,missing,part=>{if(epoch!==translationEpoch)return;map={...map,...part};saveMap(target,map);applyKnown()},'ui',primed);
        added=Object.keys(add).length;if(epoch===translationEpoch){map={...map,...add};saveMap(target,map)}
      }
      if(epoch!==translationEpoch)return;
      const coverage=strings.length?Math.min(1,(already+added)/strings.length):1;
      if(!STATIC_UI[target]&&strings.length>=8&&coverage<.45){
        localStorage.setItem('scholark_ui_language',previous);map=loadMap(previous);document.documentElement.lang=previous;document.documentElement.dir=RTL.has(previous)?'rtl':'ltr';upgradeSelectors();applyKnown();
        window.dispatchEvent(new CustomEvent('scholark-language-failed',{detail:{requested:target,restored:previous,coverage}}));return;
      }
      applyKnown();window.dispatchEvent(new CustomEvent('scholark-language-ready',{detail:{code:target,coverage}}));
    }catch(e){
      console.warn('[SCHOLARK] language switch:',clean(e?.message||e));
      if(epoch===translationEpoch){localStorage.setItem('scholark_ui_language',previous);map=loadMap(previous);upgradeSelectors();applyKnown();window.dispatchEvent(new CustomEvent('scholark-language-failed',{detail:{requested:target,restored:previous,error:clean(e?.message||e)}}))}
    }finally{if(epoch===translationEpoch){translating=false;overlay.style.opacity='0';setTimeout(()=>{overlay.classList.remove('open');overlay.style.removeProperty('opacity')},150)}}
  }

  async function translateStrings(target,strings,purpose='content'){
    if(!LANGS.some(x=>x[0]===target))target='en';
    const src=[...new Set((strings||[]).map(clean).filter(eligibleText))];
    if(target==='en')return Object.fromEntries(src.map(s=>[s,s]));
    let m=loadMap(target),missing=src.filter(s=>!m[s]);
    if(missing.length){const add=await translateBatch(target,missing,null,purpose);m={...m,...add};saveMap(target,m)}
    return Object.fromEntries(src.map(s=>[s,m[s]||s]));
  }

  document.addEventListener('change',e=>{
    const sel=e.target?.closest?.('#v55-language,#v36-language,#v90-language,#v89-lang');if(!sel)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();changeLanguage(sel.value);
  },true);

  function boot(){
    const normalized=code();if(localStorage.getItem('scholark_ui_language')!==normalized)localStorage.setItem('scholark_ui_language',normalized);
    document.documentElement.lang=normalized;document.documentElement.dir=RTL.has(normalized)?'rtl':'ltr';
    upgradeSelectors();applyKnown();
    const cached=loadMap(normalized),needsInitial=normalized!=='en'&&Object.keys(cached).length<20;
    setTimeout(()=>translateCurrentPage(needsInitial),needsInitial?70:180);
    setTimeout(()=>translateCurrentPage(false),750);
  }
  const obs=new MutationObserver(muts=>{upgradeSelectors();for(const m of muts){if(m.type==='characterData'&&m.target?.parentElement){if(!applying)textSource.set(m.target,clean(m.target.nodeValue));applyKnown(m.target.parentElement)}for(const n of m.addedNodes||[]){if(n.nodeType===1)applyKnown(n);else if(n.nodeType===3&&n.parentElement)applyKnown(n.parentElement)}}scheduleUnknown()});
  obs.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
  addEventListener('focus',()=>{upgradeSelectors();applyKnown();scheduleUnknown()});addEventListener('scholark-language-change',()=>setTimeout(boot,20));
  setTimeout(boot,80);

  window.__SCHOLARK_I18N__={langs:LANGS.map(x=>[x[0],x[1]]),languageName,nativeName,code,changeLanguage,apply:applyKnown,translateMissing:fillUnknown,translateCurrentPage,translateStrings,count:LANGS.length};
})();