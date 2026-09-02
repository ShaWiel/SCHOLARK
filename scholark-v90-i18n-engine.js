(() => {
  if(window.__SCHOLARK_V90_I18N__) return;
  window.__SCHOLARK_V90_I18N__=true;

  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const LANGS=[
    ['nl','Dutch','Dutch'],['en','English','English'],['es','Spanish','Spanish'],['fr','French','French'],
    ['de','Deutch','German'],['pt','Portugues','Portuguese'],['it','Italian','Italian']
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
  [
    ['Learn faster. Create better.','Leer sneller. Maak beter.','Aprende más rápido. Crea mejor.','Apprenez plus vite. Créez mieux.','Lerne schneller. Erstelle besser.','Aprenda mais rápido. Crie melhor.','Impara più velocemente. Crea meglio.'],
    ['Get ahead.','Loop vooruit.','Toma ventaja.','Prenez de l’avance.','Sei voraus.','Saia na frente.','Parti in vantaggio.'],
    ['SCHOLARK turns one idea into a full learning path, presentation, report, webpage, social concept, graphic or book structure — while helping you understand what comes next.','SCHOLARK verandert één idee in een volledig leerpad, presentatie, verslag, webpagina, social concept, graphic of boekstructuur — en helpt je begrijpen wat hierna komt.','SCHOLARK convierte una idea en una ruta completa de aprendizaje, presentación, informe, página web, concepto social, gráfico o estructura de libro, y te ayuda a entender qué sigue.','SCHOLARK transforme une idée en parcours d’apprentissage, présentation, rapport, page web, concept social, visuel ou structure de livre, tout en vous aidant à comprendre la suite.','SCHOLARK verwandelt eine Idee in einen vollständigen Lernpfad, eine Präsentation, einen Bericht, eine Webseite, ein Social-Konzept, eine Grafik oder Buchstruktur und zeigt dir, was als Nächstes kommt.','O SCHOLARK transforma uma ideia em uma trilha completa de aprendizagem, apresentação, relatório, página web, conceito social, gráfico ou estrutura de livro e ajuda você a entender o próximo passo.','SCHOLARK trasforma un’idea in un percorso completo di apprendimento, presentazione, report, pagina web, concept social, grafica o struttura di libro e ti aiuta a capire cosa viene dopo.'],
    ['Start with intent, not a blank page. SCHOLARK plans the structure, creates the first version and lets you refine only what matters.','Begin met je doel, niet met een lege pagina. SCHOLARK plant de structuur, maakt de eerste versie en laat je alleen verfijnen wat ertoe doet.','Empieza con una intención, no con una página en blanco. SCHOLARK planifica la estructura, crea la primera versión y te deja perfeccionar solo lo importante.','Commencez par l’intention, pas par une page blanche. SCHOLARK planifie la structure, crée la première version et vous laisse affiner uniquement l’essentiel.','Beginne mit dem Ziel, nicht mit einer leeren Seite. SCHOLARK plant die Struktur, erstellt die erste Version und lässt dich nur das Wesentliche verfeinern.','Comece com a intenção, não com uma página em branco. O SCHOLARK planeja a estrutura, cria a primeira versão e deixa você refinar apenas o que importa.','Parti dall’intento, non da una pagina vuota. SCHOLARK pianifica la struttura, crea la prima versione e ti lascia perfezionare solo ciò che conta.'],
    ['From prompt to polished deck.','Van prompt naar een afgewerkte presentatie.','De una instrucción a una presentación pulida.','Du prompt à une présentation aboutie.','Vom Prompt zur fertigen Präsentation.','Do prompt a uma apresentação pronta.','Dal prompt a una presentazione rifinita.'],
    ['Outline, narrative, slide copy, visuals, charts and design are assembled before you edit.','Opzet, verhaal, slidecopy, visuals, grafieken en design worden opgebouwd vóór je gaat bewerken.','Esquema, narrativa, texto de diapositivas, visuales, gráficos y diseño se ensamblan antes de editar.','Plan, narration, texte des diapositives, visuels, graphiques et design sont assemblés avant l’édition.','Gliederung, Erzählung, Folientexte, Visuals, Diagramme und Design werden vor der Bearbeitung zusammengestellt.','Estrutura, narrativa, texto dos slides, visuais, gráficos e design são montados antes da edição.','Scaletta, narrazione, testi, visual, grafici e design vengono assemblati prima della modifica.'],
    ['Complete first draft','Complete eerste versie','Primer borrador completo','Première version complète','Vollständiger erster Entwurf','Primeiro rascunho completo','Prima bozza completa'],
    ['Slide-by-slide regeneration','Per slide opnieuw genereren','Regeneración diapositiva por diapositiva','Régénération diapositive par diapositive','Folie für Folie neu generieren','Regeneração slide por slide','Rigenerazione slide per slide'],
    ['Research + citations','Onderzoek + bronvermeldingen','Investigación + citas','Recherche + citations','Recherche + Quellen','Pesquisa + citações','Ricerca + citazioni'],
    ['A complete presentation, not an empty editor.','Een complete presentatie, geen lege editor.','Una presentación completa, no un editor vacío.','Une présentation complète, pas un éditeur vide.','Eine komplette Präsentation, kein leerer Editor.','Uma apresentação completa, não um editor vazio.','Una presentazione completa, non un editor vuoto.'],
    ['Generate a real page, not wireframe filler.','Genereer een echte pagina, geen wireframe-opvulling.','Genera una página real, no relleno de wireframe.','Générez une vraie page, pas du remplissage de maquette.','Erstelle eine echte Seite statt Wireframe-Füllmaterial.','Gere uma página real, não preenchimento de wireframe.','Genera una pagina reale, non riempitivi da wireframe.'],
    ['Hero, sections, copy, CTA hierarchy and responsive structure are planned together.','Hero, secties, copy, CTA-hiërarchie en responsive structuur worden samen gepland.','Hero, secciones, texto, jerarquía de CTA y estructura adaptable se planifican juntos.','Hero, sections, textes, hiérarchie des CTA et structure responsive sont planifiés ensemble.','Hero, Abschnitte, Texte, CTA-Hierarchie und responsive Struktur werden gemeinsam geplant.','Hero, seções, texto, hierarquia de CTA e estrutura responsiva são planejados juntos.','Hero, sezioni, copy, gerarchia CTA e struttura responsive vengono pianificati insieme.'],
    ['Reports that already have structure and substance.','Verslagen die al structuur en inhoud hebben.','Informes con estructura y contenido desde el inicio.','Des rapports déjà structurés et substantiels.','Berichte mit Struktur und Substanz von Anfang an.','Relatórios que já têm estrutura e conteúdo.','Report già dotati di struttura e sostanza.'],
    ['Campaign thinking, not random captions.','Campagnedenken, geen willekeurige captions.','Pensamiento de campaña, no textos aleatorios.','Une logique de campagne, pas des légendes au hasard.','Kampagnendenken statt zufälliger Captions.','Pensamento de campanha, não legendas aleatórias.','Pensiero da campagna, non caption casuali.'],
    ['Posters, infographics and diagrams built around hierarchy.','Posters, infographics en diagrammen gebouwd rond hiërarchie.','Pósteres, infografías y diagramas construidos con jerarquía.','Affiches, infographies et diagrammes construits autour d’une hiérarchie claire.','Poster, Infografiken und Diagramme mit klarer Hierarchie.','Pôsteres, infográficos e diagramas construídos com hierarquia.','Poster, infografiche e diagrammi costruiti attorno alla gerarchia.'],
    ['Weak topics become tomorrow’s practice. Strong topics move into spaced review instead of disappearing.','Zwakke onderwerpen worden de oefening van morgen. Sterke onderwerpen gaan naar gespreide herhaling in plaats van te verdwijnen.','Los temas débiles se convierten en la práctica de mañana. Los fuertes pasan a repaso espaciado en lugar de desaparecer.','Les sujets faibles deviennent les exercices de demain. Les sujets maîtrisés passent en révision espacée au lieu de disparaître.','Schwache Themen werden zur Übung von morgen. Starke Themen wandern in die verteilte Wiederholung, statt zu verschwinden.','Tópicos fracos viram a prática de amanhã. Tópicos fortes entram em revisão espaçada em vez de desaparecer.','Gli argomenti deboli diventano la pratica di domani. Quelli forti passano al ripasso dilazionato invece di sparire.'],
    ['Explain, quiz, challenge and adapt to your level.','Leg uit, toets, daag uit en pas aan jouw niveau aan.','Explica, evalúa, desafía y se adapta a tu nivel.','Explique, interroge, stimule et s’adapte à votre niveau.','Erklärt, prüft, fordert und passt sich deinem Niveau an.','Explica, testa, desafia e se adapta ao seu nível.','Spiega, verifica, sfida e si adatta al tuo livello.'],
    ['Find what you do not know before wasting time reviewing what you already understand.','Ontdek wat je niet weet voordat je tijd verspilt aan het herhalen van wat je al begrijpt.','Descubre lo que no sabes antes de perder tiempo repasando lo que ya entiendes.','Identifiez ce que vous ne savez pas avant de perdre du temps à revoir ce que vous maîtrisez déjà.','Finde heraus, was du nicht weißt, bevor du Zeit mit bereits Verstandenem verschwendest.','Descubra o que você não sabe antes de perder tempo revisando o que já entende.','Scopri cosa non sai prima di perdere tempo a ripassare ciò che hai già capito.'],
    ['Goals, mastery, practice and revision all feed the same learning plan instead of living in separate screens.','Doelen, beheersing, oefenen en herhalen voeden allemaal hetzelfde leerplan in plaats van op losse schermen te leven.','Objetivos, dominio, práctica y repaso alimentan el mismo plan de aprendizaje en lugar de vivir en pantallas separadas.','Objectifs, maîtrise, pratique et révision alimentent le même plan d’apprentissage au lieu d’être séparés.','Ziele, Beherrschung, Übung und Wiederholung fließen in denselben Lernplan ein statt in getrennten Ansichten zu leben.','Metas, domínio, prática e revisão alimentam o mesmo plano de aprendizagem em vez de ficarem separados.','Obiettivi, padronanza, pratica e revisione alimentano lo stesso piano di apprendimento invece di restare separati.'],
    ['Find schools nearby, explore future studies and learn ahead so your first semester does not have to be your first exposure.','Vind scholen in de buurt, verken toekomstige studies en leer vooruit zodat je eerste semester niet je eerste kennismaking hoeft te zijn.','Encuentra escuelas cercanas, explora estudios futuros y aprende por adelantado para que tu primer semestre no sea tu primer contacto.','Trouvez des écoles proches, explorez vos futures études et prenez de l’avance afin que le premier semestre ne soit pas votre première découverte.','Finde Schulen in der Nähe, erkunde zukünftige Studiengänge und lerne voraus, damit dein erstes Semester nicht dein erster Kontakt ist.','Encontre escolas próximas, explore estudos futuros e aprenda antes para que o primeiro semestre não seja seu primeiro contato.','Trova scuole vicine, esplora studi futuri e impara in anticipo, così il primo semestre non sarà il primo contatto.'],
    ['Study Ahead explains what your future study may demand before you enroll.','Vooruit leren laat zien wat je toekomstige studie van je kan vragen voordat je je inschrijft.','Study Ahead te muestra lo que tus futuros estudios pueden exigirte antes de inscribirte.','Study Ahead vous montre ce que vos futures études peuvent exiger avant l’inscription.','Study Ahead zeigt dir, was dein zukünftiges Studium verlangen kann, bevor du dich einschreibst.','Study Ahead mostra o que seus futuros estudos podem exigir antes da matrícula.','Study Ahead mostra cosa potrebbero richiedere i tuoi futuri studi prima dell’iscrizione.'],
    ['Schools Near Me helps you find nearby education options around your location.','Scholen in de buurt helpt je onderwijsopties rond jouw locatie te vinden.','Schools Near Me te ayuda a encontrar opciones educativas cerca de tu ubicación.','Schools Near Me vous aide à trouver des options de formation près de votre position.','Schools Near Me hilft dir, Bildungsangebote in deiner Nähe zu finden.','Schools Near Me ajuda você a encontrar opções de ensino perto da sua localização.','Schools Near Me ti aiuta a trovare opzioni formative vicino alla tua posizione.'],
    ['Use your location to discover schools nearby and compare the options around you.','Gebruik je locatie om scholen in de buurt te ontdekken en opties te vergelijken.','Usa tu ubicación para descubrir escuelas cercanas y comparar opciones.','Utilisez votre position pour découvrir les écoles proches et comparer les options.','Nutze deinen Standort, um Schulen in der Nähe zu entdecken und Optionen zu vergleichen.','Use sua localização para descobrir escolas próximas e comparar opções.','Usa la tua posizione per scoprire scuole vicine e confrontare le opzioni.'],
    ['Choose a future study or career and build a learning head start before your first class.','Kies een toekomstige studie of carrière en bouw een leervoorsprong op vóór je eerste les.','Elige futuros estudios o una carrera y crea una ventaja de aprendizaje antes de tu primera clase.','Choisissez une future formation ou carrière et prenez de l’avance avant votre premier cours.','Wähle ein zukünftiges Studium oder eine Karriere und baue vor dem ersten Kurs einen Lernvorsprung auf.','Escolha um futuro curso ou carreira e construa uma vantagem de aprendizagem antes da primeira aula.','Scegli un futuro percorso di studi o carriera e crea un vantaggio prima della prima lezione.'],
    ['Learn, build, research, create and prepare for what comes next — in one place.','Leer, bouw, onderzoek, creëer en bereid je voor op wat hierna komt — op één plek.','Aprende, construye, investiga, crea y prepárate para lo que sigue, todo en un solo lugar.','Apprenez, construisez, recherchez, créez et préparez la suite — au même endroit.','Lerne, baue, recherchiere, erstelle und bereite dich auf das Kommende vor — an einem Ort.','Aprenda, construa, pesquise, crie e prepare-se para o que vem a seguir — em um só lugar.','Impara, costruisci, ricerca, crea e preparati a ciò che viene dopo — in un unico posto.'],
    ['AI LEARNING + CREATION OS','AI LEER- + CREATIE-OS','SISTEMA DE APRENDIZAJE + CREACIÓN IA','OS D’APPRENTISSAGE + CRÉATION IA','KI-LERN- + KREATIV-OS','OS DE APRENDIZAGEM + CRIAÇÃO IA','OS DI APPRENDIMENTO + CREAZIONE IA'],
    ['OPEN STUDIO AI →','OPEN STUDIO AI →','ABRIR STUDIO IA →','OUVRIR STUDIO IA →','KI-STUDIO ÖFFNEN →','ABRIR STUDIO IA →','APRI STUDIO IA →'],
    ['OPEN AI TUTOR →','OPEN AI TUTOR →','ABRIR TUTOR IA →','OUVRIR TUTEUR IA →','KI-TUTOR ÖFFNEN →','ABRIR TUTOR IA →','APRI TUTOR IA →'],
    ['OPEN EDUCATION & LEARNING →','OPEN EDUCATIE & LEREN →','ABRIR EDUCACIÓN Y APRENDIZAJE →','OUVRIR ÉDUCATION ET APPRENTISSAGE →','BILDUNG & LERNEN ÖFFNEN →','ABRIR EDUCAÇÃO E APRENDIZAGEM →','APRI ISTRUZIONE E APPRENDIMENTO →'],
    ['OPEN LANGUAGE LEARNER →','OPEN TALEN LEREN →','ABRIR APRENDIZAJE DE IDIOMAS →','OUVRIR APPRENTISSAGE DES LANGUES →','SPRACHEN LERNEN ÖFFNEN →','ABRIR APRENDER IDIOMAS →','APRI APPRENDIMENTO LINGUE →'],
    ['OPEN PLANNER →','OPEN PLANNER →','ABRIR PLANIFICADOR →','OUVRIR PLANIFICATEUR →','PLANER ÖFFNEN →','ABRIR PLANEJADOR →','APRI PIANIFICATORE →'],
    ['OPEN PROGRESS →','OPEN VOORTGANG →','ABRIR PROGRESO →','OUVRIR PROGRESSION →','FORTSCHRITT ÖFFNEN →','ABRIR PROGRESSO →','APRI PROGRESSO →'],
    ['OPEN GOALS →','OPEN DOELEN →','ABRIR OBJETIVOS →','OUVRIR OBJECTIFS →','ZIELE ÖFFNEN →','ABRIR METAS →','APRI OBIETTIVI →'],
    ['OPEN MY PROJECTS →','OPEN MIJN PROJECTEN →','ABRIR MIS PROYECTOS →','OUVRIR MES PROJETS →','MEINE PROJEKTE ÖFFNEN →','ABRIR MEUS PROJETOS →','APRI I MIEI PROGETTI →'],
    ['OPEN SCHOOLS NEAR ME →','OPEN SCHOLEN IN DE BUURT →','ABRIR ESCUELAS CERCA DE MÍ →','OUVRIR ÉCOLES À PROXIMITÉ →','SCHULEN IN MEINER NÄHE ÖFFNEN →','ABRIR ESCOLAS PERTO DE MIM →','APRI SCUOLE VICINO A ME →'],
    ['AI QUALITY · MAX','AI-KWALITEIT · MAX','CALIDAD IA · MÁX','QUALITÉ IA · MAX','KI-QUALITÄT · MAX','QUALIDADE IA · MÁX','QUALITÀ IA · MAX'],
    ['Highest available quality, expert depth, research, source checking and final polish.','Hoogst beschikbare kwaliteit, expert-diepte, onderzoek, broncontrole en eindafwerking.','Máxima calidad disponible, profundidad experta, investigación, verificación de fuentes y acabado final.','Meilleure qualité disponible, profondeur experte, recherche, vérification des sources et finition finale.','Höchste verfügbare Qualität, Expertentiefe, Recherche, Quellenprüfung und finaler Feinschliff.','Máxima qualidade disponível, profundidade especializada, pesquisa, verificação de fontes e acabamento final.','Massima qualità disponibile, profondità esperta, ricerca, verifica delle fonti e rifinitura finale.'],
    ['Every plan uses the same SCHOLARK foundation. Upgrade when you need heavier Studio creation, long-form work, future-study tools and higher usage limits.','Elk abonnement gebruikt dezelfde SCHOLARK-foundation. Upgrade wanneer je zwaardere Studio-creatie, lang werk, toekomststudietools en hogere gebruikslimieten nodig hebt.','Todos los planes usan la misma base de SCHOLARK. Mejora cuando necesites creación más pesada en Studio, trabajos largos, herramientas para estudios futuros y límites mayores.','Tous les forfaits utilisent la même base SCHOLARK. Passez à un niveau supérieur pour les créations Studio plus lourdes, les travaux longs, les outils d’orientation et des limites plus élevées.','Alle Tarife nutzen dieselbe SCHOLARK-Basis. Upgrade für umfangreichere Studio-Erstellung, lange Arbeiten, Zukunftsstudien-Tools und höhere Nutzungslimits.','Todos os planos usam a mesma base SCHOLARK. Faça upgrade quando precisar de criação mais pesada no Studio, trabalhos longos, ferramentas de estudos futuros e limites maiores.','Tutti i piani usano la stessa base SCHOLARK. Effettua l’upgrade per creazioni Studio più pesanti, lavori lunghi, strumenti per studi futuri e limiti maggiori.'],
    ['30 included AI credits/month','30 inbegrepen AI-credits/maand','30 créditos de IA incluidos/mes','30 crédits IA inclus/mois','30 enthaltene KI-Credits/Monat','30 créditos de IA incluídos/mês','30 crediti IA inclusi/mese'],
    ['Credits are spent only on AI-heavy actions','Credits worden alleen gebruikt voor AI-zware acties','Los créditos se gastan solo en acciones intensivas de IA','Les crédits ne sont dépensés que pour les actions IA lourdes','Credits werden nur für KI-intensive Aktionen verwendet','Os créditos são gastos apenas em ações intensivas de IA','I crediti vengono usati solo per azioni IA pesanti'],
    ['750 included AI credits/month','750 inbegrepen AI-credits/maand','750 créditos de IA incluidos/mes','750 crédits IA inclus/mois','750 enthaltene KI-Credits/Monat','750 créditos de IA incluídos/mês','750 crediti IA inclusi/mese'],
    ['2,500 included AI credits/month','2.500 inbegrepen AI-credits/maand','2.500 créditos de IA incluidos/mes','2 500 crédits IA inclus/mois','2.500 enthaltene KI-Credits/Monat','2.500 créditos de IA incluídos/mês','2.500 crediti IA inclusi/mese'],
    ['Higher fair-use limits','Hogere fair-use-limieten','Límites de uso justo más altos','Limites d’usage raisonnable plus élevées','Höhere Fair-Use-Limits','Limites de uso justo maiores','Limiti di fair use più elevati'],
    ['Priority access to stronger models for complex work','Voorrang tot sterkere modellen voor complex werk','Acceso prioritario a modelos más potentes para trabajos complejos','Accès prioritaire à des modèles plus puissants pour les travaux complexes','Prioritätszugriff auf stärkere Modelle für komplexe Aufgaben','Acesso prioritário a modelos mais fortes para trabalhos complexos','Accesso prioritario a modelli più potenti per lavori complessi'],
    ['Book Studio beta: architecture + chapter-by-chapter writing','Book Studio beta: architectuur + hoofdstuk-voor-hoofdstuk schrijven','Book Studio beta: arquitectura + escritura capítulo por capítulo','Book Studio bêta : architecture + rédaction chapitre par chapitre','Book Studio Beta: Architektur + kapitelweises Schreiben','Book Studio beta: arquitetura + escrita capítulo por capítulo','Book Studio beta: architettura + scrittura capitolo per capitolo'],
    ['Generous Studio + Natural Rewrite with fair-use guardrails','Ruime Studio + Natural Rewrite met fair-use-beveiliging','Studio generoso + Natural Rewrite con límites de uso justo','Studio généreux + Natural Rewrite avec garde-fous d’usage raisonnable','Großzügiges Studio + Natural Rewrite mit Fair-Use-Schutz','Studio generoso + Natural Rewrite com proteções de uso justo','Studio generoso + Natural Rewrite con protezioni di fair use'],
    ['Start Plus free trial','Start gratis proefperiode van Plus','Iniciar prueba gratuita de Plus','Démarrer l’essai gratuit Plus','Kostenlose Plus-Testphase starten','Iniciar teste grátis do Plus','Avvia prova gratuita Plus'],
    ['Start Pro free trial','Start gratis proefperiode van Pro','Iniciar prueba gratuita de Pro','Démarrer l’essai gratuit Pro','Kostenlose Pro-Testphase starten','Iniciar teste grátis do Pro','Avvia prova gratuita Pro'],
    ['7 days free, then $14.99/month. Cancel anytime.','7 dagen gratis, daarna $14,99/maand. Altijd opzegbaar.','7 días gratis, luego $14,99/mes. Cancela cuando quieras.','7 jours gratuits, puis 14,99 $/mois. Annulez à tout moment.','7 Tage kostenlos, danach 14,99 $/Monat. Jederzeit kündbar.','7 dias grátis, depois US$ 14,99/mês. Cancele quando quiser.','7 giorni gratis, poi 14,99 $/mese. Annulla quando vuoi.'],
    ['7 days free, then $19.99/month. Cancel anytime.','7 dagen gratis, daarna $19,99/maand. Altijd opzegbaar.','7 días gratis, luego $19,99/mes. Cancela cuando quieras.','7 jours gratuits, puis 19,99 $/mois. Annulez à tout moment.','7 Tage kostenlos, danach 19,99 $/Monat. Jederzeit kündbar.','7 dias grátis, depois US$ 19,99/mês. Cancele quando quiser.','7 giorni gratis, poi 19,99 $/mese. Annulla quando vuoi.']
  ].forEach(r=>add(...r));
  [
    ['Know the field before you enter it.','Ken het vakgebied voordat je eraan begint.','Conoce el campo antes de entrar en él.','Connaissez le domaine avant de vous y lancer.','Kenne das Fachgebiet, bevor du einsteigst.','Conheça a área antes de entrar nela.','Conosci il campo prima di entrarci.'],
    ['Tell SCHOLARK what you plan to study. Country and target school are optional; the roadmap focuses on knowledge, skills and preparation rather than inventing admissions rules.','Vertel SCHOLARK wat je van plan bent te studeren. Land en doelschool zijn optioneel; de roadmap richt zich op kennis, vaardigheden en voorbereiding in plaats van toelatingsregels te verzinnen.','Dile a SCHOLARK qué planeas estudiar. El país y la institución objetivo son opcionales; la hoja de ruta se centra en conocimientos, habilidades y preparación, no en inventar requisitos de admisión.','Dites à SCHOLARK ce que vous prévoyez d’étudier. Le pays et l’établissement visé sont facultatifs ; la feuille de route se concentre sur les connaissances, compétences et la préparation sans inventer de règles d’admission.','Sag SCHOLARK, was du studieren möchtest. Land und Zielschule sind optional; die Roadmap konzentriert sich auf Wissen, Fähigkeiten und Vorbereitung statt Zulassungsregeln zu erfinden.','Diga ao SCHOLARK o que pretende estudar. País e instituição-alvo são opcionais; o roteiro foca conhecimentos, competências e preparação em vez de inventar regras de admissão.','Dì a SCHOLARK cosa vuoi studiare. Paese e istituto di destinazione sono facoltativi; la roadmap si concentra su conoscenze, competenze e preparazione senza inventare regole di ammissione.'],
    ['Field of study, e.g. Law, Computer Science','Studierichting, bijv. Rechten, Informatica','Área de estudio, p. ej. Derecho, Informática','Domaine d’études, p. ex. Droit, Informatique','Studienfach, z. B. Jura, Informatik','Área de estudo, ex. Direito, Ciência da Computação','Campo di studio, es. Giurisprudenza, Informatica'],
    ['Country (optional)','Land (optioneel)','País (opcional)','Pays (facultatif)','Land (optional)','País (opcional)','Paese (facoltativo)'],
    ['Target university / school (optional)','Doeluniversiteit / school (optioneel)','Universidad / escuela objetivo (opcional)','Université / école visée (facultatif)','Zieluniversität / Schule (optional)','Universidade / escola-alvo (opcional)','Università / scuola di destinazione (facoltativa)'],
    ['Start from foundations','Begin bij de basis','Empezar desde las bases','Commencer par les bases','Mit den Grundlagen beginnen','Começar pelas bases','Parti dalle basi'],
    ['Anything SCHOLARK should know about your goals, strengths or current subjects (optional)','Alles wat SCHOLARK moet weten over je doelen, sterke punten of huidige vakken (optioneel)','Cualquier cosa que SCHOLARK deba saber sobre tus objetivos, fortalezas o materias actuales (opcional)','Tout ce que SCHOLARK devrait savoir sur vos objectifs, points forts ou matières actuelles (facultatif)','Alles, was SCHOLARK über deine Ziele, Stärken oder aktuellen Fächer wissen sollte (optional)','Qualquer coisa que o SCHOLARK deva saber sobre seus objetivos, pontos fortes ou disciplinas atuais (opcional)','Tutto ciò che SCHOLARK dovrebbe sapere su obiettivi, punti di forza o materie attuali (facoltativo)'],
    ['Build my Study Ahead roadmap','Bouw mijn Vooruit leren-roadmap','Crear mi hoja de ruta de preparación','Construire ma feuille de route Study Ahead','Meine Study-Ahead-Roadmap erstellen','Criar meu roteiro de Study Ahead','Crea la mia roadmap Study Ahead'],
    ['Study Ahead is connected to your Planner and Mastery Map.','Vooruit leren is gekoppeld aan je Planner en Mastery Map.','Study Ahead está conectado con tu Planificador y Mapa de dominio.','Study Ahead est connecté à votre Planificateur et à votre carte de maîtrise.','Study Ahead ist mit deinem Planer und deiner Mastery Map verbunden.','Study Ahead está conectado ao seu Planejador e Mapa de domínio.','Study Ahead è collegato al tuo Pianificatore e alla Mastery Map.'],
    ['Build the book, chapter by chapter.','Bouw het boek, hoofdstuk voor hoofdstuk.','Construye el libro, capítulo por capítulo.','Construisez le livre, chapitre par chapitre.','Baue das Buch Kapitel für Kapitel.','Construa o livro, capítulo por capítulo.','Costruisci il libro, capitolo per capitolo.'],
    ['Plan the book, then let SCHOLARK write the full manuscript chapter by chapter with autosave, continuity context, editing and real DOCX/PDF export.','Plan het boek en laat SCHOLARK daarna het volledige manuscript hoofdstuk voor hoofdstuk schrijven met automatisch opslaan, continuïteitscontext, bewerking en echte DOCX/PDF-export.','Planifica el libro y deja que SCHOLARK escriba el manuscrito completo capítulo por capítulo con guardado automático, contexto de continuidad, edición y exportación real a DOCX/PDF.','Planifiez le livre, puis laissez SCHOLARK rédiger le manuscrit complet chapitre par chapitre avec sauvegarde automatique, contexte de continuité, édition et export DOCX/PDF réel.','Plane das Buch und lass SCHOLARK anschließend das vollständige Manuskript Kapitel für Kapitel mit automatischem Speichern, Kontinuitätskontext, Bearbeitung und echtem DOCX/PDF-Export schreiben.','Planeje o livro e deixe o SCHOLARK escrever o manuscrito completo capítulo por capítulo com salvamento automático, contexto de continuidade, edição e exportação real para DOCX/PDF.','Pianifica il libro e lascia che SCHOLARK scriva il manoscritto completo capitolo per capitolo con salvataggio automatico, contesto di continuità, modifica ed esportazione reale DOCX/PDF.'],
    ['Working title (optional)','Werktitel (optioneel)','Título provisional (opcional)','Titre provisoire (facultatif)','Arbeitstitel (optional)','Título provisório (opcional)','Titolo provvisorio (facoltativo)'],
    ['Choose genre / type','Kies genre / type','Elige género / tipo','Choisir le genre / type','Genre / Typ auswählen','Escolha gênero / tipo','Scegli genere / tipo'],
    ['Describe the book you want to create…','Beschrijf het boek dat je wilt maken…','Describe el libro que quieres crear…','Décrivez le livre que vous voulez créer…','Beschreibe das Buch, das du erstellen möchtest…','Descreva o livro que deseja criar…','Descrivi il libro che vuoi creare…'],
    ['Audience (optional)','Doelgroep (optioneel)','Público (opcional)','Public (facultatif)','Zielgruppe (optional)','Público (opcional)','Pubblico (facoltativo)'],
    ['Book output language','Taal van het boek','Idioma de salida del libro','Langue de sortie du livre','Ausgabesprache des Buches','Idioma de saída do livro','Lingua di uscita del libro'],
    ['Third person','Derde persoon','Tercera persona','Troisième personne','Dritte Person','Terceira pessoa','Terza persona'],
    ['First person','Eerste persoon','Primera persona','Première personne','Erste Person','Primeira pessoa','Prima persona'],
    ['Multiple POV','Meerdere perspectieven','Múltiples puntos de vista','Points de vue multiples','Mehrere Perspektiven','Múltiplos pontos de vista','Punti di vista multipli'],
    ['Create book plan with AI','Maak boekplan met AI','Crear plan del libro con IA','Créer le plan du livre avec l’IA','Buchplan mit KI erstellen','Criar plano do livro com IA','Crea il piano del libro con IA'],
    ['Write remaining book','Schrijf de rest van het boek','Escribir el resto del libro','Écrire le reste du livre','Rest des Buches schreiben','Escrever o restante do livro','Scrivi il resto del libro'],
    ['Start with your concept; SCHOLARK will build the chapter architecture.','Begin met je concept; SCHOLARK bouwt de hoofdstukstructuur.','Empieza con tu concepto; SCHOLARK construirá la arquitectura de capítulos.','Commencez par votre concept ; SCHOLARK construira l’architecture des chapitres.','Beginne mit deinem Konzept; SCHOLARK erstellt die Kapitelarchitektur.','Comece com seu conceito; o SCHOLARK construirá a arquitetura dos capítulos.','Parti dal tuo concetto; SCHOLARK costruirà l’architettura dei capitoli.'],
    ['Generate a book plan first.','Genereer eerst een boekplan.','Genera primero un plan del libro.','Générez d’abord un plan du livre.','Erstelle zuerst einen Buchplan.','Gere primeiro um plano do livro.','Genera prima un piano del libro.'],
    ['CHAPTERS','HOOFDSTUKKEN','CAPÍTULOS','CHAPITRES','KAPITEL','CAPÍTULOS','CAPITOLI'],
    ['Writing coach','Schrijfcoach','Coach de escritura','Coach d’écriture','Schreibcoach','Coach de escrita','Coach di scrittura'],
    ['Continuity notes will appear here.','Continuïteitsnotities verschijnen hier.','Las notas de continuidad aparecerán aquí.','Les notes de continuité apparaîtront ici.','Kontinuitätsnotizen erscheinen hier.','As notas de continuidade aparecerão aqui.','Le note di continuità appariranno qui.']
  ].forEach(r=>add(...r));
  [
    ['SCHOLARK STUDIO AI','SCHOLARK STUDIO AI','SCHOLARK STUDIO IA','SCHOLARK STUDIO IA','SCHOLARK KI-STUDIO','SCHOLARK STUDIO IA','SCHOLARK STUDIO IA'],
    ['Create from a brief, not a blank page.','Maak vanuit een briefing, niet vanaf een lege pagina.','Crea a partir de un brief, no de una página en blanco.','Créez à partir d’un brief, pas d’une page blanche.','Erstelle aus einem Briefing statt von einer leeren Seite.','Crie a partir de um briefing, não de uma página em branco.','Crea da un brief, non da una pagina vuota.'],
    ['Structure, research, writing, design and quality control in one creator workspace.','Structuur, onderzoek, schrijven, design en kwaliteitscontrole in één creator-workspace.','Estructura, investigación, redacción, diseño y control de calidad en un solo espacio de creación.','Structure, recherche, rédaction, design et contrôle qualité dans un seul espace de création.','Struktur, Recherche, Schreiben, Design und Qualitätskontrolle in einem Creator-Arbeitsbereich.','Estrutura, pesquisa, escrita, design e controle de qualidade em um único espaço de criação.','Struttura, ricerca, scrittura, design e controllo qualità in un unico spazio creativo.'],
    ['Untitled project','Naamloos project','Proyecto sin título','Projet sans titre','Unbenanntes Projekt','Projeto sem título','Progetto senza titolo'],
    ['Saved','Opgeslagen','Guardado','Enregistré','Gespeichert','Salvo','Salvato'],
    ['Creation settings','Creatie-instellingen','Ajustes de creación','Paramètres de création','Erstellungseinstellungen','Configurações de criação','Impostazioni di creazione'],
    ['Output language','Uitvoertaal','Idioma de salida','Langue de sortie','Ausgabesprache','Idioma de saída','Lingua di output'],
    ['AI quality','AI-kwaliteit','Calidad de IA','Qualité IA','KI-Qualität','Qualidade da IA','Qualità IA'],
    ['Style / tone','Stijl / toon','Estilo / tono','Style / ton','Stil / Ton','Estilo / tom','Stile / tono'],
    ['Deep quality pipeline','Diepe kwaliteitspipeline','Pipeline de calidad profunda','Pipeline qualité approfondie','Tiefe Qualitätspipeline','Pipeline de qualidade profunda','Pipeline di qualità avanzata'],
    ['Describe exactly what you want SCHOLARK to create…','Beschrijf precies wat je wilt dat SCHOLARK maakt…','Describe exactamente lo que quieres que SCHOLARK cree…','Décrivez exactement ce que vous voulez que SCHOLARK crée…','Beschreibe genau, was SCHOLARK erstellen soll…','Descreva exatamente o que deseja que o SCHOLARK crie…','Descrivi esattamente cosa vuoi che SCHOLARK crei…'],
    ['Add references','Referenties toevoegen','Añadir referencias','Ajouter des références','Referenzen hinzufügen','Adicionar referências','Aggiungi riferimenti'],
    ['No reference files added','Geen referentiebestanden toegevoegd','No se añadieron archivos de referencia','Aucun fichier de référence ajouté','Keine Referenzdateien hinzugefügt','Nenhum arquivo de referência adicionado','Nessun file di riferimento aggiunto'],
    ['Build outline first','Bouw eerst de opzet','Crear primero el esquema','Construire d’abord le plan','Zuerst Gliederung erstellen','Criar primeiro o esboço','Crea prima la scaletta'],
    ['Generate complete first draft','Genereer volledige eerste versie','Generar primer borrador completo','Générer le premier brouillon complet','Vollständigen ersten Entwurf erstellen','Gerar primeiro rascunho completo','Genera la prima bozza completa'],
    ['Quality pipeline','Kwaliteitspipeline','Pipeline de calidad','Pipeline qualité','Qualitätspipeline','Pipeline de qualidade','Pipeline di qualità'],
    ['SCHOLARK plans before it drafts, then checks the result before you edit.','SCHOLARK plant voordat het schrijft en controleert daarna het resultaat voordat jij bewerkt.','SCHOLARK planifica antes de redactar y comprueba el resultado antes de que edites.','SCHOLARK planifie avant de rédiger, puis vérifie le résultat avant votre édition.','SCHOLARK plant vor dem Schreiben und prüft das Ergebnis vor deiner Bearbeitung.','O SCHOLARK planeja antes de escrever e verifica o resultado antes da edição.','SCHOLARK pianifica prima di scrivere e controlla il risultato prima della modifica.'],
    ['Live outline preview','Live voorbeeld van de opzet','Vista previa del esquema','Aperçu du plan en direct','Live-Gliederungsvorschau','Prévia do esboço ao vivo','Anteprima della scaletta'],
    ['Your outline will appear here.','Je opzet verschijnt hier.','Tu esquema aparecerá aquí.','Votre plan apparaîtra ici.','Deine Gliederung erscheint hier.','Seu esboço aparecerá aqui.','La tua scaletta apparirà qui.'],
    ['My Projects','Mijn projecten','Mis proyectos','Mes projets','Meine Projekte','Meus projetos','I miei progetti'],
    ['Open saved Studio work directly. Autosaves are deduplicated, so one project no longer appears over and over.','Open opgeslagen Studio-werk direct. Automatische opslagen worden ontdubbeld, zodat één project niet steeds opnieuw verschijnt.','Abre directamente trabajos guardados de Studio. Los autoguardados se deduplican para que un proyecto no aparezca repetido.','Ouvrez directement vos travaux Studio enregistrés. Les sauvegardes automatiques sont dédupliquées afin qu’un projet ne se répète pas.','Öffne gespeicherte Studio-Arbeiten direkt. Autosaves werden dedupliziert, damit ein Projekt nicht mehrfach erscheint.','Abra trabalhos salvos do Studio diretamente. Os salvamentos automáticos são deduplicados para que um projeto não apareça repetido.','Apri direttamente i lavori Studio salvati. I salvataggi automatici vengono deduplicati così un progetto non compare più volte.'],
    ['No saved projects yet. Create something in Studio AI and save it; it will appear here.','Nog geen opgeslagen projecten. Maak iets in Studio AI en sla het op; dan verschijnt het hier.','Aún no hay proyectos guardados. Crea algo en Studio AI y guárdalo; aparecerá aquí.','Aucun projet enregistré pour le moment. Créez quelque chose dans Studio AI et enregistrez-le ; il apparaîtra ici.','Noch keine gespeicherten Projekte. Erstelle etwas in Studio AI und speichere es; dann erscheint es hier.','Ainda não há projetos salvos. Crie algo no Studio AI e salve; ele aparecerá aqui.','Nessun progetto salvato. Crea qualcosa in Studio AI e salvalo; apparirà qui.'],
    ['Delete project','Project verwijderen','Eliminar proyecto','Supprimer le projet','Projekt löschen','Excluir projeto','Elimina progetto'],
    ['Saved SCHOLARK creation','Opgeslagen SCHOLARK-creatie','Creación SCHOLARK guardada','Création SCHOLARK enregistrée','Gespeicherte SCHOLARK-Erstellung','Criação SCHOLARK salva','Creazione SCHOLARK salvata']
  ].forEach(r=>add(...r));
  [
    ['Explore what to learn, track mastery, prepare for exams and choose evidence-based study methods — without duplicating Tutor or Planner.','Verken wat je moet leren, volg je beheersing, bereid je voor op examens en kies bewezen studiemethoden — zonder Tutor of Planner te dupliceren.','Explora qué aprender, sigue tu dominio, prepárate para exámenes y elige métodos de estudio basados en evidencia — sin duplicar Tutor ni Planner.','Explorez quoi apprendre, suivez votre maîtrise, préparez vos examens et choisissez des méthodes d’étude fondées sur des preuves — sans dupliquer Tutor ou Planner.','Erkunde, was du lernen solltest, verfolge deine Beherrschung, bereite dich auf Prüfungen vor und wähle evidenzbasierte Lernmethoden — ohne Tutor oder Planer zu duplizieren.','Explore o que aprender, acompanhe seu domínio, prepare-se para exames e escolha métodos de estudo baseados em evidências — sem duplicar Tutor ou Planner.','Esplora cosa imparare, monitora la padronanza, preparati agli esami e scegli metodi di studio basati su evidenze — senza duplicare Tutor o Planner.'],
    ['Map a subject into clear strands, units and learning priorities for your level.','Breng een vak in kaart met duidelijke domeinen, onderdelen en leerprioriteiten voor jouw niveau.','Organiza una asignatura en áreas, unidades y prioridades de aprendizaje claras para tu nivel.','Structurez une matière en domaines, unités et priorités d’apprentissage clairs pour votre niveau.','Gliedere ein Fach in klare Bereiche, Einheiten und Lernprioritäten für dein Niveau.','Organize uma disciplina em áreas, unidades e prioridades de aprendizagem claras para o seu nível.','Organizza una materia in aree, unità e priorità di apprendimento chiare per il tuo livello.'],
    ['Track topics as New, Learning, Practising or Mastered.','Volg onderwerpen als Nieuw, Aan het leren, Aan het oefenen of Beheerst.','Sigue los temas como Nuevo, Aprendiendo, Practicando o Dominado.','Suivez les sujets comme Nouveau, En apprentissage, En pratique ou Maîtrisé.','Verfolge Themen als Neu, Lernen, Üben oder Beherrscht.','Acompanhe tópicos como Novo, Aprendendo, Praticando ou Dominado.','Monitora gli argomenti come Nuovo, In apprendimento, In pratica o Padroneggiato.'],
    ['Break an upcoming exam into topics, question types and revision priorities.','Verdeel een aankomend examen in onderwerpen, vraagtypes en herhalingsprioriteiten.','Divide un próximo examen en temas, tipos de preguntas y prioridades de repaso.','Décomposez un examen à venir en sujets, types de questions et priorités de révision.','Teile eine bevorstehende Prüfung in Themen, Fragetypen und Wiederholungsprioritäten auf.','Divida um próximo exame em tópicos, tipos de perguntas e prioridades de revisão.','Suddividi un esame imminente in argomenti, tipi di domande e priorità di ripasso.'],
    ['Review weak topics at the right time instead of rereading everything.','Herhaal zwakke onderwerpen op het juiste moment in plaats van alles opnieuw te lezen.','Repasa los temas débiles en el momento adecuado en vez de releerlo todo.','Révisez les sujets faibles au bon moment au lieu de tout relire.','Wiederhole schwache Themen zum richtigen Zeitpunkt, statt alles erneut zu lesen.','Revise tópicos fracos no momento certo em vez de reler tudo.','Ripassa gli argomenti deboli al momento giusto invece di rileggere tutto.'],
    ['Use active recall, Feynman, blurting, interleaving and other study methods correctly.','Gebruik active recall, de Feynman-methode, blurting, interleaving en andere studiemethoden op de juiste manier.','Usa correctamente active recall, Feynman, blurting, interleaving y otros métodos de estudio.','Utilisez correctement le rappel actif, Feynman, le blurting, l’interleaving et d’autres méthodes d’étude.','Nutze Active Recall, Feynman, Blurting, Interleaving und andere Lernmethoden richtig.','Use active recall, Feynman, blurting, interleaving e outros métodos de estudo corretamente.','Usa correttamente active recall, Feynman, blurting, interleaving e altri metodi di studio.'],
    ['Subject, e.g. Biology, Math, History','Vak, bijv. Biologie, Wiskunde, Geschiedenis','Asignatura, p. ej. Biología, Matemáticas, Historia','Matière, p. ex. Biologie, Mathématiques, Histoire','Fach, z. B. Biologie, Mathematik, Geschichte','Disciplina, ex. Biologia, Matemática, História','Materia, es. Biologia, Matematica, Storia'],
    ['Country / curriculum (optional)','Land / curriculum (optioneel)','País / currículo (opcional)','Pays / programme scolaire (facultatif)','Land / Lehrplan (optional)','País / currículo (opcional)','Paese / curriculum (facoltativo)'],
    ['Build subject map','Maak vakoverzicht','Crear mapa de la asignatura','Créer la carte de la matière','Fachübersicht erstellen','Criar mapa da disciplina','Crea mappa della materia'],
    ['Topic or skill','Onderwerp of vaardigheid','Tema o habilidad','Sujet ou compétence','Thema oder Fähigkeit','Tópico ou habilidade','Argomento o abilità'],
    ['Add topic','Onderwerp toevoegen','Añadir tema','Ajouter un sujet','Thema hinzufügen','Adicionar tópico','Aggiungi argomento'],
    ['Exam / test name','Naam examen / toets','Nombre del examen / prueba','Nom de l’examen / test','Name der Prüfung / des Tests','Nome do exame / teste','Nome esame / test'],
    ['Topics or chapters, one per line','Onderwerpen of hoofdstukken, één per regel','Temas o capítulos, uno por línea','Sujets ou chapitres, un par ligne','Themen oder Kapitel, eines pro Zeile','Tópicos ou capítulos, um por linha','Argomenti o capitoli, uno per riga'],
    ['Build exam priorities','Maak examenprioriteiten','Crear prioridades del examen','Créer les priorités de l’examen','Prüfungsprioritäten erstellen','Criar prioridades do exame','Crea priorità per l’esame'],
    ['Choose a method to see how to use it properly.','Kies een methode om te zien hoe je die goed gebruikt.','Elige un método para ver cómo usarlo correctamente.','Choisissez une méthode pour voir comment bien l’utiliser.','Wähle eine Methode, um zu sehen, wie du sie richtig nutzt.','Escolha um método para ver como usá-lo corretamente.','Scegli un metodo per vedere come usarlo correttamente.'],
    ['Generate a short assessment to locate gaps. When you grade it, SCHOLARK sends the result into Progress, Mastery and the spaced-review schedule.','Maak een korte toets om hiaten te vinden. Wanneer je die beoordeelt, stuurt SCHOLARK het resultaat naar Voortgang, Beheersing en je schema voor gespreide herhaling.','Genera una evaluación corta para localizar lagunas. Al calificarla, SCHOLARK envía el resultado a Progreso, Dominio y al calendario de repaso espaciado.','Générez une courte évaluation pour repérer les lacunes. Une fois notée, SCHOLARK envoie le résultat vers Progression, Maîtrise et le calendrier de révision espacée.','Erstelle einen kurzen Test, um Lücken zu finden. Nach der Bewertung sendet SCHOLARK das Ergebnis an Fortschritt, Beherrschung und den Wiederholungsplan.','Gere uma avaliação curta para localizar lacunas. Ao corrigi-la, o SCHOLARK envia o resultado para Progresso, Domínio e o cronograma de revisão espaçada.','Genera una breve valutazione per individuare le lacune. Quando la valuti, SCHOLARK invia il risultato a Progresso, Padronanza e al programma di ripasso dilazionato.'],
    ['Subject, e.g. Mathematics','Vak, bijv. Wiskunde','Asignatura, p. ej. Matemáticas','Matière, p. ex. Mathématiques','Fach, z. B. Mathematik','Disciplina, ex. Matemática','Materia, es. Matematica'],
    ['Topics, comma separated','Onderwerpen, gescheiden door komma’s','Temas, separados por comas','Sujets, séparés par des virgules','Themen, durch Kommas getrennt','Tópicos, separados por vírgulas','Argomenti, separati da virgole'],
    ['Mixed difficulty','Gemengde moeilijkheid','Dificultad mixta','Difficulté mixte','Gemischter Schwierigkeitsgrad','Dificuldade mista','Difficoltà mista'],
    ['Topics become due based on your Mastery performance. Strong topics return later; weak topics return sooner.','Onderwerpen worden gepland op basis van je beheersing. Sterke onderwerpen komen later terug; zwakke onderwerpen eerder.','Los temas se programan según tu dominio. Los temas fuertes vuelven más tarde; los débiles, antes.','Les sujets reviennent selon votre niveau de maîtrise. Les sujets solides reviennent plus tard ; les faibles plus tôt.','Themen werden anhand deiner Beherrschung fällig. Starke Themen kehren später zurück, schwache früher.','Os tópicos vencem conforme seu domínio. Tópicos fortes voltam mais tarde; os fracos, mais cedo.','Gli argomenti tornano in base alla padronanza. Quelli forti più tardi; quelli deboli prima.'],
    ['Refresh queue','Wachtrij vernieuwen','Actualizar cola','Actualiser la file','Warteschlange aktualisieren','Atualizar fila','Aggiorna coda'],
    ['Loading reviews…','Herhalingen laden…','Cargando repasos…','Chargement des révisions…','Wiederholungen werden geladen…','Carregando revisões…','Caricamento ripassi…'],
    ['Sign in to use a cloud review schedule.','Log in om een cloudschema voor herhaling te gebruiken.','Inicia sesión para usar un calendario de repaso en la nube.','Connectez-vous pour utiliser un calendrier de révision dans le cloud.','Melde dich an, um einen Cloud-Wiederholungsplan zu nutzen.','Entre para usar um cronograma de revisão na nuvem.','Accedi per usare un programma di ripasso nel cloud.'],
    ['Your local Mastery Map still works, but spaced review is synced to your SCHOLARK account.','Je lokale Beheersingskaart blijft werken, maar gespreide herhaling wordt met je SCHOLARK-account gesynchroniseerd.','Tu Mapa de Dominio local sigue funcionando, pero el repaso espaciado se sincroniza con tu cuenta SCHOLARK.','Votre carte de maîtrise locale fonctionne toujours, mais la révision espacée est synchronisée avec votre compte SCHOLARK.','Deine lokale Beherrschungskarte funktioniert weiter, aber die verteilte Wiederholung wird mit deinem SCHOLARK-Konto synchronisiert.','Seu Mapa de Domínio local continua funcionando, mas a revisão espaçada é sincronizada com sua conta SCHOLARK.','La Mappa di Padronanza locale continua a funzionare, ma il ripasso dilazionato viene sincronizzato con il tuo account SCHOLARK.'],
    ['Build the book, chapter by chapter.','Bouw het boek, hoofdstuk voor hoofdstuk.','Construye el libro, capítulo por capítulo.','Construisez le livre, chapitre par chapitre.','Baue das Buch Kapitel für Kapitel.','Construa o livro, capítulo por capítulo.','Costruisci il libro, capitolo per capitolo.'],
    ['Plan the book, then let SCHOLARK write the full manuscript chapter by chapter with autosave, continuity context, editing and real DOCX/PDF export.','Plan het boek en laat SCHOLARK daarna het volledige manuscript hoofdstuk voor hoofdstuk schrijven met autosave, continuïteitscontext, bewerking en echte DOCX/PDF-export.','Planifica el libro y deja que SCHOLARK escriba el manuscrito completo capítulo por capítulo con guardado automático, contexto de continuidad, edición y exportación real a DOCX/PDF.','Planifiez le livre puis laissez SCHOLARK écrire le manuscrit complet chapitre par chapitre avec sauvegarde automatique, contexte de continuité, édition et véritable export DOCX/PDF.','Plane das Buch und lass SCHOLARK anschließend das vollständige Manuskript Kapitel für Kapitel schreiben – mit Autosave, Kontinuitätskontext, Bearbeitung und echtem DOCX/PDF-Export.','Planeje o livro e deixe o SCHOLARK escrever o manuscrito completo capítulo por capítulo com salvamento automático, contexto de continuidade, edição e exportação real em DOCX/PDF.','Pianifica il libro e lascia che SCHOLARK scriva il manoscritto completo capitolo per capitolo con salvataggio automatico, contesto di continuità, modifica ed esportazione reale DOCX/PDF.'],
    ['Choose genre / type','Kies genre / type','Elegir género / tipo','Choisir le genre / type','Genre / Typ wählen','Escolher gênero / tipo','Scegli genere / tipo'],
    ['Describe the book you want to create…','Beschrijf het boek dat je wilt maken…','Describe el libro que quieres crear…','Décrivez le livre que vous voulez créer…','Beschreibe das Buch, das du erstellen möchtest…','Descreva o livro que você quer criar…','Descrivi il libro che vuoi creare…'],
    ['Book output language','Taal van het boek','Idioma de salida del libro','Langue de sortie du livre','Ausgabesprache des Buches','Idioma de saída do livro','Lingua di output del libro'],
    ['Create book plan with AI','Maak boekplan met AI','Crear plan del libro con IA','Créer le plan du livre avec l’IA','Buchplan mit KI erstellen','Criar plano do livro com IA','Crea piano del libro con IA'],
    ['Rebuild book plan with AI','Bouw boekplan opnieuw met AI','Reconstruir plan del libro con IA','Reconstruire le plan du livre avec l’IA','Buchplan mit KI neu erstellen','Refazer plano do livro com IA','Ricrea piano del libro con IA'],
    ['Write remaining book','Schrijf de rest van het boek','Escribir el resto del libro','Écrire le reste du livre','Restliches Buch schreiben','Escrever o restante do livro','Scrivi il resto del libro'],
    ['Plan saved. Select a chapter below.','Plan opgeslagen. Kies hieronder een hoofdstuk.','Plan guardado. Selecciona un capítulo abajo.','Plan enregistré. Sélectionnez un chapitre ci-dessous.','Plan gespeichert. Wähle unten ein Kapitel.','Plano salvo. Selecione um capítulo abaixo.','Piano salvato. Seleziona un capitolo qui sotto.'],
    ['Start with your concept; SCHOLARK will build the chapter architecture.','Begin met je concept; SCHOLARK bouwt de hoofdstukstructuur.','Empieza con tu concepto; SCHOLARK construirá la arquitectura de capítulos.','Commencez par votre concept ; SCHOLARK construira l’architecture des chapitres.','Beginne mit deinem Konzept; SCHOLARK erstellt die Kapitelarchitektur.','Comece com seu conceito; o SCHOLARK criará a arquitetura dos capítulos.','Inizia dal tuo concept; SCHOLARK costruirà l’architettura dei capitoli.'],
    ['Generate a book plan first.','Maak eerst een boekplan.','Genera primero un plan del libro.','Générez d’abord un plan du livre.','Erstelle zuerst einen Buchplan.','Gere primeiro um plano do livro.','Genera prima un piano del libro.'],
    ['Continuity notes will appear here.','Continuïteitsnotities verschijnen hier.','Las notas de continuidad aparecerán aquí.','Les notes de continuité apparaîtront ici.','Kontinuitätsnotizen erscheinen hier.','As notas de continuidade aparecerão aqui.','Le note di continuità appariranno qui.'],
    ['Write chapter','Schrijf hoofdstuk','Escribir capítulo','Écrire le chapitre','Kapitel schreiben','Escrever capítulo','Scrivi capitolo'],
    ['Rewrite chapter','Herschrijf hoofdstuk','Reescribir capítulo','Réécrire le chapitre','Kapitel neu schreiben','Reescrever capítulo','Riscrivi capitolo'],
    ['This chapter has not been written yet. Write it now or use Write remaining book to generate the manuscript.','Dit hoofdstuk is nog niet geschreven. Schrijf het nu of gebruik Schrijf de rest van het boek om het manuscript te genereren.','Este capítulo aún no está escrito. Escríbelo ahora o usa Escribir el resto del libro para generar el manuscrito.','Ce chapitre n’est pas encore écrit. Écrivez-le maintenant ou utilisez Écrire le reste du livre pour générer le manuscrit.','Dieses Kapitel wurde noch nicht geschrieben. Schreibe es jetzt oder nutze Restliches Buch schreiben, um das Manuskript zu erzeugen.','Este capítulo ainda não foi escrito. Escreva-o agora ou use Escrever o restante do livro para gerar o manuscrito.','Questo capitolo non è ancora stato scritto. Scrivilo ora oppure usa Scrivi il resto del libro per generare il manoscritto.'],
    ['Keep this chapter consistent with the premise and surrounding chapters.','Houd dit hoofdstuk consistent met het uitgangspunt en de omliggende hoofdstukken.','Mantén este capítulo coherente con la premisa y los capítulos cercanos.','Gardez ce chapitre cohérent avec la prémisse et les chapitres voisins.','Halte dieses Kapitel konsistent mit der Prämisse und den umliegenden Kapiteln.','Mantenha este capítulo consistente com a premissa e os capítulos ao redor.','Mantieni questo capitolo coerente con la premessa e con i capitoli vicini.'],
    ['Open saved Studio work directly. Autosaves are deduplicated, so one project no longer appears over and over.','Open opgeslagen Studio-werk direct. Autosaves worden ontdubbeld, zodat één project niet steeds opnieuw verschijnt.','Abre directamente el trabajo guardado de Studio. Los guardados automáticos se deduplican para que un proyecto no aparezca repetido.','Ouvrez directement les travaux Studio enregistrés. Les sauvegardes automatiques sont dédupliquées afin qu’un projet n’apparaisse pas plusieurs fois.','Öffne gespeicherte Studio-Arbeiten direkt. Autosaves werden dedupliziert, damit ein Projekt nicht mehrfach erscheint.','Abra diretamente trabalhos salvos do Studio. Os salvamentos automáticos são deduplicados para que um projeto não apareça repetido.','Apri direttamente i lavori Studio salvati. I salvataggi automatici vengono deduplicati così un progetto non compare più volte.'],
    ['No saved projects yet. Create something in Studio AI and save it; it will appear here.','Nog geen opgeslagen projecten. Maak iets in Studio AI en sla het op; dan verschijnt het hier.','Aún no hay proyectos guardados. Crea algo en Studio AI y guárdalo; aparecerá aquí.','Aucun projet enregistré pour le moment. Créez quelque chose dans Studio AI et enregistrez-le ; il apparaîtra ici.','Noch keine gespeicherten Projekte. Erstelle etwas in Studio AI und speichere es; dann erscheint es hier.','Ainda não há projetos salvos. Crie algo no Studio AI e salve; ele aparecerá aqui.','Nessun progetto salvato. Crea qualcosa in Studio AI e salvalo; apparirà qui.'],
    ['Create from a brief, not a blank page.','Maak vanuit een briefing, niet vanaf een lege pagina.','Crea desde un brief, no desde una página en blanco.','Créez à partir d’un brief, pas d’une page blanche.','Erstelle aus einem Briefing statt von einer leeren Seite.','Crie a partir de um briefing, não de uma página em branco.','Crea da un brief, non da una pagina vuota.'],
    ['Structure, research, writing, design and quality control in one creator workspace.','Structuur, onderzoek, schrijven, design en kwaliteitscontrole in één creator-werkruimte.','Estructura, investigación, redacción, diseño y control de calidad en un solo espacio de creación.','Structure, recherche, rédaction, design et contrôle qualité dans un seul espace de création.','Struktur, Recherche, Schreiben, Design und Qualitätskontrolle in einem Creator-Arbeitsbereich.','Estrutura, pesquisa, redação, design e controle de qualidade em um único espaço de criação.','Struttura, ricerca, scrittura, design e controllo qualità in un unico spazio creativo.'],
    ['Creation settings','Creatie-instellingen','Ajustes de creación','Paramètres de création','Erstellungseinstellungen','Configurações de criação','Impostazioni di creazione'],
    ['Output language','Uitvoertaal','Idioma de salida','Langue de sortie','Ausgabesprache','Idioma de saída','Lingua di output'],
    ['AI quality','AI-kwaliteit','Calidad de IA','Qualité IA','KI-Qualität','Qualidade de IA','Qualità IA'],
    ['Style / tone','Stijl / toon','Estilo / tono','Style / ton','Stil / Ton','Estilo / tom','Stile / tono'],
    ['Describe exactly what you want SCHOLARK to create…','Beschrijf precies wat je wilt dat SCHOLARK maakt…','Describe exactamente lo que quieres que SCHOLARK cree…','Décrivez exactement ce que vous voulez que SCHOLARK crée…','Beschreibe genau, was SCHOLARK erstellen soll…','Descreva exatamente o que você quer que o SCHOLARK crie…','Descrivi esattamente cosa vuoi che SCHOLARK crei…'],
    ['Add references','Referenties toevoegen','Añadir referencias','Ajouter des références','Referenzen hinzufügen','Adicionar referências','Aggiungi riferimenti'],
    ['No reference files added','Geen referentiebestanden toegevoegd','No se añadieron archivos de referencia','Aucun fichier de référence ajouté','Keine Referenzdateien hinzugefügt','Nenhum arquivo de referência adicionado','Nessun file di riferimento aggiunto'],
    ['Build outline first','Maak eerst een outline','Crear primero el esquema','Créer d’abord le plan','Zuerst Gliederung erstellen','Criar primeiro o esboço','Crea prima la scaletta'],
    ['Generate complete first draft','Genereer volledige eerste versie','Generar primer borrador completo','Générer une première version complète','Vollständigen ersten Entwurf erstellen','Gerar primeiro rascunho completo','Genera una prima bozza completa'],
    ['Quality pipeline','Kwaliteitspipeline','Flujo de calidad','Pipeline qualité','Qualitätspipeline','Pipeline de qualidade','Pipeline di qualità']
  ].forEach(r=>add(...r));

  [
    ["Create from a brief, not a blank page.","Maak vanuit een briefing, niet vanaf een lege pagina.","Crea desde un brief, no desde una página en blanco.","Créez à partir d’un brief, pas d’une page blanche.","Erstelle aus einem Briefing statt von einer leeren Seite.","Crie a partir de um briefing, não de uma página em branco.","Crea partendo da un brief, non da una pagina vuota."],
    ["Structure, research, writing, design and quality control in one creator workspace.","Structuur, onderzoek, schrijven, ontwerp en kwaliteitscontrole in één creatiewerkruimte.","Estructura, investigación, redacción, diseño y control de calidad en un solo espacio creativo.","Structure, recherche, rédaction, design et contrôle qualité dans un seul espace de création.","Struktur, Recherche, Schreiben, Design und Qualitätskontrolle in einem Kreativbereich.","Estrutura, pesquisa, escrita, design e controlo de qualidade num único espaço de criação.","Struttura, ricerca, scrittura, design e controllo qualità in un unico spazio creativo."],
    ["Creation settings","Creatie-instellingen","Ajustes de creación","Paramètres de création","Erstellungseinstellungen","Definições de criação","Impostazioni di creazione"],
    ["Output language","Uitvoertaal","Idioma de salida","Langue de sortie","Ausgabesprache","Idioma de saída","Lingua di output"],
    ["AI quality","AI-kwaliteit","Calidad de IA","Qualité IA","KI-Qualität","Qualidade da IA","Qualità IA"],
    ["Style / tone","Stijl / toon","Estilo / tono","Style / ton","Stil / Ton","Estilo / tom","Stile / tono"],
    ["Deep / research-first","Diepgaand / onderzoek eerst","Profundo / investigación primero","Approfondi / recherche d’abord","Tiefgehend / Recherche zuerst","Profundo / pesquisa primeiro","Approfondito / ricerca prima"],
    ["Balanced","Gebalanceerd","Equilibrado","Équilibré","Ausgewogen","Equilibrado","Bilanciato"],
    ["Highest quality · PRO","Hoogste kwaliteit · PRO","Máxima calidad · PRO","Qualité maximale · PRO","Höchste Qualität · PRO","Qualidade máxima · PRO","Massima qualità · PRO"],
    ["Number of slides","Aantal slides","Número de diapositivas","Nombre de diapositives","Anzahl der Folien","Número de slides","Numero di slide"],
    ["Build outline first","Bouw eerst de outline","Crear primero el esquema","Construire d’abord le plan","Zuerst Gliederung erstellen","Criar primeiro o esboço","Crea prima la scaletta"],
    ["Generate complete first draft","Genereer volledige eerste versie","Generar el primer borrador completo","Générer le premier brouillon complet","Vollständigen ersten Entwurf erstellen","Gerar o primeiro rascunho completo","Genera la prima bozza completa"],
    ["Quality pipeline","Kwaliteitspipeline","Proceso de calidad","Pipeline qualité","Qualitätspipeline","Pipeline de qualidade","Pipeline qualità"],
    ["SCHOLARK plans before it drafts, then checks the result before you edit.","SCHOLARK plant vóór het schrijft en controleert daarna het resultaat voordat jij gaat bewerken.","SCHOLARK planifica antes de redactar y después revisa el resultado antes de que edites.","SCHOLARK planifie avant de rédiger, puis vérifie le résultat avant votre modification.","SCHOLARK plant vor dem Entwurf und prüft anschließend das Ergebnis vor deiner Bearbeitung.","O SCHOLARK planeia antes de escrever e depois verifica o resultado antes da sua edição.","SCHOLARK pianifica prima di scrivere e poi controlla il risultato prima delle tue modifiche."],
    ["Live outline preview","Live outline-voorbeeld","Vista previa del esquema","Aperçu du plan en direct","Live-Gliederungsvorschau","Pré-visualização do esboço","Anteprima live della scaletta"],
    ["Your outline will appear here.","Je outline verschijnt hier.","Tu esquema aparecerá aquí.","Votre plan apparaîtra ici.","Deine Gliederung erscheint hier.","O seu esboço aparecerá aqui.","La tua scaletta apparirà qui."],
    ["Describe exactly what you want SCHOLARK to create…","Beschrijf precies wat je wilt dat SCHOLARK maakt…","Describe exactamente qué quieres que SCHOLARK cree…","Décrivez exactement ce que vous voulez que SCHOLARK crée…","Beschreibe genau, was SCHOLARK erstellen soll…","Descreva exatamente o que quer que o SCHOLARK crie…","Descrivi esattamente cosa vuoi che SCHOLARK crei…"],
    ["Add references","Referenties toevoegen","Añadir referencias","Ajouter des références","Referenzen hinzufügen","Adicionar referências","Aggiungi riferimenti"],
    ["No reference files added","Geen referentiebestanden toegevoegd","No se añadieron archivos de referencia","Aucun fichier de référence ajouté","Keine Referenzdateien hinzugefügt","Nenhum ficheiro de referência adicionado","Nessun file di riferimento aggiunto"],
    ["Untitled project","Naamloos project","Proyecto sin título","Projet sans titre","Unbenanntes Projekt","Projeto sem título","Progetto senza titolo"],
    ["Saved","Opgeslagen","Guardado","Enregistré","Gespeichert","Guardado","Salvato"],
    ["Deep quality pipeline","Diepgaande kwaliteitspipeline","Proceso profundo de calidad","Pipeline qualité approfondi","Tiefgehende Qualitätspipeline","Pipeline de qualidade aprofundada","Pipeline qualità approfondita"],
    ["Complete decks, not empty slides.","Volledige decks, geen lege slides.","Presentaciones completas, no diapositivas vacías.","Des présentations complètes, pas des diapositives vides.","Vollständige Decks statt leerer Folien.","Apresentações completas, não slides vazios.","Presentazioni complete, non slide vuote."],
    ["Responsive pages with real structure.","Responsieve pagina’s met echte structuur.","Páginas responsivas con estructura real.","Des pages responsives avec une vraie structure.","Responsive Seiten mit echter Struktur.","Páginas responsivas com estrutura real.","Pagine responsive con una vera struttura."],
    ["Reports, essays and research documents.","Verslagen, essays en onderzoeksdocumenten.","Informes, ensayos y documentos de investigación.","Rapports, essais et documents de recherche.","Berichte, Essays und Forschungsdokumente.","Relatórios, ensaios e documentos de pesquisa.","Report, saggi e documenti di ricerca."],
    ["Campaigns, carousels and social content.","Campagnes, carrousels en social content.","Campañas, carruseles y contenido social.","Campagnes, carrousels et contenus sociaux.","Kampagnen, Karussells und Social Content.","Campanhas, carrosséis e conteúdo social.","Campagne, caroselli e contenuti social."],
    ["Posters, infographics and visual systems.","Posters, infographics en visuele systemen.","Pósteres, infografías y sistemas visuales.","Affiches, infographies et systèmes visuels.","Poster, Infografiken und visuelle Systeme.","Cartazes, infográficos e sistemas visuais.","Poster, infografiche e sistemi visivi."],
    ["Open saved Studio work directly. Autosaves are deduplicated, so one project no longer appears over and over.","Open opgeslagen Studio-werk direct. Autosaves worden ontdubbeld, zodat één project niet steeds opnieuw verschijnt.","Abre directamente el trabajo guardado de Studio. Los autoguardados se deduplican para que un proyecto no aparezca repetido.","Ouvrez directement les travaux Studio enregistrés. Les sauvegardes automatiques sont dédupliquées afin qu’un projet ne se répète plus.","Öffne gespeicherte Studio-Arbeiten direkt. Autosaves werden dedupliziert, damit ein Projekt nicht mehrfach erscheint.","Abra diretamente os trabalhos guardados do Studio. Os autosaves são desduplicados para que um projeto não apareça repetidamente.","Apri direttamente i lavori Studio salvati. I salvataggi automatici vengono deduplicati così un progetto non compare più volte."],
    ["No saved projects yet. Create something in Studio AI and save it; it will appear here.","Nog geen opgeslagen projecten. Maak iets in Studio AI en sla het op; daarna verschijnt het hier.","Aún no hay proyectos guardados. Crea algo en Studio AI y guárdalo; aparecerá aquí.","Aucun projet enregistré pour le moment. Créez quelque chose dans Studio AI et enregistrez-le ; il apparaîtra ici.","Noch keine gespeicherten Projekte. Erstelle etwas in Studio AI und speichere es; dann erscheint es hier.","Ainda não há projetos guardados. Crie algo no Studio AI e guarde; aparecerá aqui.","Nessun progetto salvato. Crea qualcosa in Studio AI e salvalo; apparirà qui."],
    ["Delete project","Project verwijderen","Eliminar proyecto","Supprimer le projet","Projekt löschen","Eliminar projeto","Elimina progetto"]
  ].forEach(r=>add(...r));

  [
    ['Curriculum Explorer','Curriculumverkenner','Explorador del currículo','Explorateur du programme','Lehrplan-Explorer','Explorador do currículo','Esplora curriculum'],
    ['Mastery Map','Beheersingskaart','Mapa de dominio','Carte de maîtrise','Beherrschungskarte','Mapa de domínio','Mappa di padronanza'],
    ['Exam Prep Center','Examenvoorbereidingscentrum','Centro de preparación de exámenes','Centre de préparation aux examens','Prüfungsvorbereitung','Centro de preparação para exames','Centro preparazione esami'],
    ['Diagnostic Check','Diagnostische controle','Diagnóstico','Diagnostic','Diagnose-Check','Diagnóstico','Controllo diagnostico'],
    ['Spaced Review Queue','Wachtrij voor gespreide herhaling','Cola de repaso espaciado','File de révision espacée','Warteschlange für verteilte Wiederholung','Fila de revisão espaçada','Coda di ripasso dilazionato'],
    ['Study Methods Lab','Lab voor studiemethoden','Laboratorio de métodos de estudio','Laboratoire des méthodes d’étude','Lernmethoden-Labor','Laboratório de métodos de estudo','Laboratorio dei metodi di studio'],
    ['Run diagnostic','Diagnose starten','Ejecutar diagnóstico','Lancer le diagnostic','Diagnose starten','Executar diagnóstico','Avvia diagnostica'],
    ['8 questions','8 vragen','8 preguntas','8 questions','8 Fragen','8 perguntas','8 domande'],
    ['12 questions','12 vragen','12 preguntas','12 questions','12 Fragen','12 perguntas','12 domande'],
    ['16 questions','16 vragen','16 preguntas','16 questions','16 Fragen','16 perguntas','16 domande'],
    ['Foundation','Basis','Fundamentos','Fondamentaux','Grundlagen','Fundamentos','Fondamenti'],
    ['Intermediate','Gemiddeld','Intermedio','Intermédiaire','Mittelstufe','Intermediário','Intermedio'],
    ['Challenge','Uitdaging','Desafío','Défi','Herausforderung','Desafio','Sfida'],
    ['Building a diagnostic at your current learning level…','Diagnose opbouwen op jouw huidige leerniveau…','Creando un diagnóstico para tu nivel actual…','Création d’un diagnostic adapté à votre niveau actuel…','Diagnose für dein aktuelles Lernniveau wird erstellt…','Criando um diagnóstico para o seu nível atual…','Creazione di una diagnostica per il tuo livello attuale…'],
    ['Question','Vraag','Pregunta','Question','Frage','Pergunta','Domanda'],
    ['Show answer','Toon antwoord','Mostrar respuesta','Afficher la réponse','Antwort anzeigen','Mostrar resposta','Mostra risposta'],
    ['Answer:','Antwoord:','Respuesta:','Réponse :','Antwort:','Resposta:','Risposta:'],
    ['Why:','Waarom:','Por qué:','Pourquoi :','Warum:','Por quê:','Perché:'],
    ['Grade each question after revealing the answer. SCHOLARK will turn the completed result into real Progress + Mastery data.','Beoordeel elke vraag nadat je het antwoord hebt bekeken. SCHOLARK zet het voltooide resultaat om in echte Voortgang- en Beheersingsdata.','Califica cada pregunta después de mostrar la respuesta. SCHOLARK convertirá el resultado completo en datos reales de Progreso y Dominio.','Évaluez chaque question après avoir affiché la réponse. SCHOLARK transformera le résultat final en véritables données de progression et de maîtrise.','Bewerte jede Frage nach dem Anzeigen der Antwort. SCHOLARK verwandelt das vollständige Ergebnis in echte Fortschritts- und Beherrschungsdaten.','Avalie cada pergunta depois de mostrar a resposta. O SCHOLARK transformará o resultado concluído em dados reais de Progresso e Domínio.','Valuta ogni domanda dopo aver mostrato la risposta. SCHOLARK trasformerà il risultato completato in dati reali di Progresso e Padronanza.']
  ].forEach(r=>add(...r));

  const RTL=new Set();
  const STATIC_KEYS=new Set(Object.values(STATIC_UI).flatMap(m=>Object.keys(m)));
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
    'AI Tutor with step-by-step lessons','Diagnostics, Mastery & Spaced Review','Planner, Goals & Progress','Files & Notes analysis','Language Learner: vocabulary, grammar, listening & speaking practice','7-language interface','30 included AI credits/month','Credits are spent only on AI-heavy actions',
    'Everything in Free','Studio AI: Presentation, Webpage, Document, Social & Graphic','Research + citations and web sources','Cloud projects + version history','Advanced Files & Notes: Ask Files, worksheets and study tools','Natural Rewrite + priority creation','750 included AI credits/month','Higher fair-use limits',
    'Everything in Plus','Highest-quality SCHOLARK AI','Generous Studio + Natural Rewrite with fair-use guardrails','Presentations up to 100 slides','Documents/reports up to 100 pages','Book Studio beta: architecture + chapter-by-chapter writing','All genres + custom blends','Schools Near Me + Study Ahead','2,500 included AI credits/month','Priority access to stronger models for complex work',
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
  let map=loadMap(code()),mapCode=code(),translating=false,unknownTimer=null,translationEpoch=0,applying=false;
  const textSource=new WeakMap(),attrSource=new WeakMap();
  const reverseStatic=new Map();
  for(const [lc,m] of Object.entries(STATIC_UI)){for(const [source,translated] of Object.entries(m||{})){reverseStatic.set(clean(source),source);if(clean(translated))reverseStatic.set(clean(translated),source)}}
  const canonicalSource=value=>reverseStatic.get(clean(value))||clean(value);
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
  const rememberText=n=>{if(!textSource.has(n))textSource.set(n,canonicalSource(n.nodeValue));return textSource.get(n)||canonicalSource(n.nodeValue)};
  const rememberAttrs=el=>{let o=attrSource.get(el);if(!o){o={};for(const a of ['placeholder','aria-label','title']){const v=clean(el.getAttribute?.(a));if(v)o[a]=canonicalSource(v)}attrSource.set(el,o)}return o};

  function eligibleText(s){
    const t=clean(s);if(!t||t.length<2||t.length>420)return false;
    if(/^https?:|^[\d\s.,:%+$€£¥/\-–—()]+$/.test(t))return false;
    const knownStatic=STATIC_KEYS.has(t);
    if(/^[A-Z0-9_\-.]{2,18}$/.test(t)&&!t.includes(' ')&&!knownStatic)return false;
    return /[\p{L}\p{N}]/u.test(t);
  }
  function protectedNode(el){
    return !!el?.closest?.('script,style,code,pre,[contenteditable="true"],input[type="password"],#v55-language,#v55-native-language,#v36-language,#v90-language,#v89-lang,#v55-language option,#v55-native-language option,#v36-language option,#v90-language option,#v89-lang option,.v52-msg.user,.v52-msg.ai,#v52-chat,.v93-ai,.v62-answer,.v62-results,#v86-output,.v65-prose,.v65-editor,[data-v65-body],[data-v65-title],.v57-slide,.v58-canvas,.v68-editor,.v75-doc-editor,.v76-canvas,.v77-page-preview');
  }
  function collectDom(limit=180){
    const out=new Set(),roots=typeof visibleRoots==='function'?visibleRoots():[document.body];
    for(const base of roots){
      if(!base||out.size>=limit)continue;
      const walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT);
      let n;while((n=walker.nextNode())&&out.size<limit){const el=n.parentElement,src=rememberText(n);if(!protectedNode(el)&&eligibleText(src))out.add(src)}
      Array.from(base.querySelectorAll('input[placeholder],textarea[placeholder],[aria-label],[title]')).forEach(el=>{if(out.size>=limit)return;const srcs=rememberAttrs(el);for(const a of ['placeholder','aria-label','title']){const t=clean(srcs[a]);if(eligibleText(t))out.add(t)}});
    }
    return [...out];
  }
  async function translateBatch(target,strings,onChunk,purpose='ui',primed=null){
    if(target==='en')return Object.fromEntries(strings.map(s=>[s,s]));
    const result={};
    const local=await deviceTranslate(target,strings,part=>{Object.assign(result,part);onChunk?.(part)},primed);
    if(!local.missing.length)return result;
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
    const c=code();document.documentElement.lang=c;document.documentElement.dir=RTL.has(c)?'rtl':'ltr';if(mapCode!==c){map=loadMap(c);mapCode=c;}
    const base=root?.nodeType===1?root:document;applying=true;
    try{
      const walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT);
      let n;while((n=walker.nextNode())){
        const src=rememberText(n),raw=n.nodeValue;
        if(c==='en'){
          if(clean(raw)===clean(src))continue;
          if(protectedNode(n.parentElement))continue;
          const lead=raw.match(/^\s*/)?.[0]||'',tail=raw.match(/\s*$/)?.[0]||'';n.nodeValue=lead+src+tail;continue;
        }
        const tr=map[src];if(!tr||clean(raw)===clean(tr))continue;
        if(protectedNode(n.parentElement))continue;
        const lead=raw.match(/^\s*/)?.[0]||'',tail=raw.match(/\s*$/)?.[0]||'';n.nodeValue=lead+tr+tail;
      }
      Array.from(base.querySelectorAll('input[placeholder],textarea[placeholder],[aria-label],[title]')).forEach(el=>{
        const srcs=rememberAttrs(el);for(const a of ['placeholder','aria-label','title']){
          const src=clean(srcs[a]);if(!src)continue;const tr=c==='en'?src:map[src];if(!tr)continue;
          if(clean(el.getAttribute(a))!==clean(tr))el.setAttribute(a,tr);
        }
      });
    }finally{applying=false}
  }
  async function translateCurrentPage(showOverlay=false){
    const target=code(),epoch=translationEpoch;
    if(target==='en'){upgradeSelectors();applyVisible();overlay.classList.remove('open');return}
    if(navigator.onLine===false){applyVisible();overlay.classList.remove('open');return}
    if(translating)return;translating=true;
    if(showOverlay){overlay.classList.add('open');$('#v90-switch-copy').textContent='Finishing '+nativeName(target)+' across SCHOLARK…'}
    try{
      for(let pass=0;pass<2&&epoch===translationEpoch;pass++){
        upgradeSelectors();applyVisible();
        const strings=[...new Set(collectDom(360))].filter(eligibleText);
        const missing=strings.filter(s=>!map[s]);
        if(!missing.length)break;
        const add=await translateBatch(target,missing,part=>{if(epoch!==translationEpoch)return;map={...map,...part};saveMap(target,map);applyVisible()});
        if(epoch!==translationEpoch)break;
        if(!Object.keys(add).length)break;
        map={...map,...add};saveMap(target,map);applyVisible();
        await new Promise(r=>setTimeout(r,20));
      }
    }catch(e){console.warn('[SCHOLARK] full-page localization:',clean(e?.message||e))}
    finally{
      translating=false;if(epoch===translationEpoch)applyVisible();
      if(showOverlay&&epoch===translationEpoch){overlay.style.opacity='0';setTimeout(()=>{overlay.classList.remove('open');overlay.style.removeProperty('opacity')},150)}
      try{sessionStorage.removeItem('scholark_i18n_pending')}catch{}
    }
  }
  async function fillUnknown(){return translateCurrentPage(false)}
  function scheduleUnknown(){
    if(code()==='en')return;
    clearTimeout(unknownTimer);unknownTimer=setTimeout(fillUnknown,420);
  }

  function upgradeSelectors(){
    const expected=LANGS.map(([v,n])=>[v,n]),options=expected.map(([v,n])=>'<option value="'+v+'">'+n+'</option>').join('');
    const normalize=sel=>{
      if(!sel)return null;
      const current=[...sel.options].map(o=>[String(o.value),clean(o.textContent)]);
      const exact=current.length===expected.length&&expected.every(([v,n],i)=>current[i]?.[0]===v&&current[i]?.[1]===n);
      if(!exact)sel.innerHTML=options;
      sel.dataset.v90='1';sel.onchange=null;
      const val=code();if([...sel.options].some(o=>o.value===val))sel.value=val;
      return sel;
    };
    [$('#v55-language'),$('#v36-language'),$('#v89-lang')].filter(Boolean).forEach(normalize);
    const side=$('#v51-sidebar');if(side){
      let box=$('.v90-langbox',side);if(!box){box=document.createElement('div');box.className='v90-langbox';box.innerHTML='<label>SCHOLARK LANGUAGE</label><select id="v90-language"></select>';$('.v85-wallet',side)?.insertAdjacentElement('beforebegin',box)||$('.v51-quality',side)?.insertAdjacentElement('beforebegin',box)}
      normalize($('#v90-language',box));
    }
  }

  function visibleRoots(){
    const h=String(location.hash||'').toLowerCase(),publicRoute=h===''||h==='#home'||h==='#pricing',roots=[];
    const push=el=>{if(el&&el.isConnected&&!roots.includes(el))roots.push(el)};
    push($('#v55-topbar'));
    if(publicRoute&&!document.body.classList.contains('v51-workspace')){
      push($('#v29-home-layer:not([hidden])'));
    }else{
      push($('#v51-sidebar'));push($('#v51-main'));
      // Route ownership is authoritative. A view may be mounting before its
      // "open" class/hidden state is finalized, so include the route root too.
      if(h.startsWith('#studio')||/^(#presentation|#webpage|#document|#report|#graphic|#social)/.test(h))push($('#v41-studio-workspace'));
      else push($('#v41-studio-workspace:not([hidden])'));
      if(h.startsWith('#schools'))push($('#v50-school'));else push($('#v50-school.open'));
      if(h.startsWith('#study'))push($('#v25-study'));else push($('#v25-study.open'));
      if(h.startsWith('#book'))push($('#v51-fallback .v65-book'));else push($('#v25-book.open'));
      if(h.startsWith('#project'))push($('#v51-fallback .v64-projects'));
      push($('#v51-fallback .v65-book'));push($('#v51-fallback .v64-projects'));
      push($('#v58-suite.open'));push($('#v57-deck.open'));push($('#v57-present.open'));
    }
    return roots.length?roots:[document.body];
  }
  function applyVisible(){visibleRoots().forEach(applyKnown)}

  let backgroundLanguageTimer=null;
  function scheduleLanguageCompletion(target,epoch){
    clearTimeout(backgroundLanguageTimer);
    const run=async()=>{
      if(epoch!==translationEpoch||code()!==target||target==='en')return;
      try{
        const strings=[...new Set(collectDom(260))].filter(eligibleText),missing=strings.filter(s=>!map[s]);
        if(!missing.length)return;
        const primed=primeDeviceTranslator(target);
        const add=await translateBatch(target,missing,part=>{
          if(epoch!==translationEpoch)return;
          map={...map,...part};saveMap(target,map);applyVisible();
        },'ui',primed);
        if(epoch===translationEpoch&&Object.keys(add).length){map={...map,...add};saveMap(target,map);applyVisible()}
        if(epoch===translationEpoch){
          upgradeSelectors();
          window.__SCHOLARK_WORKSPACE__?.syncLanguage?.(null,true);
          window.dispatchEvent(new CustomEvent('scholark-language-complete',{detail:{code:target}}));
        }
      }catch(e){console.warn('[SCHOLARK] background language completion:',clean(e?.message||e))}
    };
    const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,120));
    backgroundLanguageTimer=setTimeout(()=>idle(run,{timeout:650}),55);
  }

  async function changeLanguage(target){
    if(!LANGS.some(x=>x[0]===target))return;
    const epoch=++translationEpoch;
    const previous=code();
    window.__SCHOLARK_V30_DEMO__?.stop?.();
    document.documentElement.classList.add('scholark-language-switching');

    localStorage.setItem('scholark_ui_language',target);
    map=loadMap(target);mapCode=target;
    document.documentElement.lang=target;
    document.documentElement.dir=RTL.has(target)?'rtl':'ltr';

    // Critical path: no network, no model call, no full-screen wait.
    upgradeSelectors();
    applyVisible();
    window.__SCHOLARK_WORKSPACE__?.syncLanguage?.();
    window.dispatchEvent(new CustomEvent('scholark-language-applied',{detail:{code:target,previous}}));
    window.dispatchEvent(new CustomEvent('scholark-language-ready',{detail:{code:target,provider:target==='en'?'source':'instant-cache'}}));

    // Keep the overlay from delaying the UI even if an older module opened it.
    overlay.style.opacity='0';
    overlay.classList.remove('open');
    translating=false;
    setTimeout(()=>document.documentElement.classList.remove('scholark-language-switching'),20);

    if(target!=='en')scheduleLanguageCompletion(target,epoch);
    const resume=()=>{const h=String(location.hash||'').toLowerCase();if(h===''||h==='#home'||h==='#pricing')window.__SCHOLARK_V30_DEMO__?.start?.()};
    (window.requestIdleCallback||((fn)=>setTimeout(fn,120)))(resume,{timeout:350});
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
    upgradeSelectors();applyVisible();if(normalized!=='en')scheduleUnknown();
  }
  const pendingRoots=new Set();let mutationTimer=null,selectorPending=false;
  const activeRoot=()=>visibleRoots().find(r=>r!==$('#v55-topbar'))||visibleRoots()[0]||document.body;
  function flushMutations(){
    mutationTimer=null;
    const roots=[...pendingRoots];pendingRoots.clear();
    if(code()!=='en'){
      if(roots.length>18)applyKnown(activeRoot());
      else roots.forEach(r=>{if(r?.isConnected)applyKnown(r)});
    }
    if(selectorPending){selectorPending=false;upgradeSelectors()}
    if(code()!=='en')scheduleUnknown();
  }
  const obs=new MutationObserver(muts=>{
    for(const m of muts){
      if(!m.addedNodes?.length)continue;
      for(const n of m.addedNodes){
        const root=n.nodeType===1?n:n.parentElement;if(root)pendingRoots.add(root);
        if(n.nodeType===1&&(n.matches?.('select,#v51-sidebar,#v55-topbar,.v36-shell-controls')||n.querySelector?.('select,#v51-sidebar,#v55-topbar,.v36-shell-controls')))selectorPending=true;
      }
    }
    if(code()==='en'){
      pendingRoots.clear();
      if(selectorPending){clearTimeout(mutationTimer);mutationTimer=setTimeout(flushMutations,90)}
      return;
    }
    if(pendingRoots.size||selectorPending){clearTimeout(mutationTimer);mutationTimer=setTimeout(flushMutations,60)}
  });
  obs.observe(document.body||document.documentElement,{subtree:true,childList:true});
  addEventListener('hashchange',()=>setTimeout(()=>{upgradeSelectors();applyVisible();scheduleUnknown()},70));
  addEventListener('popstate',()=>setTimeout(()=>{upgradeSelectors();applyVisible();scheduleUnknown()},70));
  addEventListener('scholark-language-change',()=>setTimeout(boot,30));
  setTimeout(boot,80);

  function i18nSelftest(){
    const required=['Dashboard','Your learning & creation workspace.','Learn faster. Create better.','Get ahead.','Know where you are going before you get there.','SCHOLARK PLANS','Choose how much advantage you want.','Go to Workspace','AI QUALITY · MAX'];
    const localeCoverage={};
    for(const [lc] of LANGS){
      if(lc==='en'){localeCoverage[lc]=1;continue}
      const m=loadMap(lc),hit=required.filter(x=>clean(m[x])&&clean(m[x])!==x).length;
      localeCoverage[lc]=hit/required.length;
    }
    const ok=LANGS.length===7&&!LANGS.some(x=>x[0]==='srn')&&Object.values(localeCoverage).every(x=>x>=.88);
    const report={ok,count:LANGS.length,code:code(),localeCoverage};
    console[ok?'log':'warn']('[SCHOLARK] i18n self-test '+(ok?'PASS':'WARN'),report);
    return report;
  }
  window.__SCHOLARK_I18N__={langs:LANGS.map(x=>[x[0],x[1]]),languageName,nativeName,code,changeLanguage,apply:applyKnown,translateMissing:fillUnknown,translateCurrentPage,translateStrings,selftest:i18nSelftest,count:LANGS.length};
})();