(function countryEducationFoundation(){
  if(window.__SCHOLARK_COUNTRY_EDUCATION__)return;
  window.__SCHOLARK_COUNTRY_EDUCATION__=true;

  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const KEY='scholark_country';
  const GENERIC={
    label:'International / ISCED',
    stages:[
      ['young','🧸','Pre-primary · ISCED 0','Early childhood education before primary school.'],
      ['primary','📚','Primary · ISCED 1','Foundational literacy, numeracy and general learning.'],
      ['secondary','🎒','Lower secondary · ISCED 2','Broader subject learning and lower-secondary progression.'],
      ['student','🎓','Upper secondary · ISCED 3','General or vocational preparation before tertiary study or work.'],
      ['adult','🏛️','Higher education · ISCED 5–8','Short-cycle tertiary, bachelor, master and doctoral education.']
    ]
  };
  const SYSTEMS={
    Suriname:{label:'Suriname',stages:[
      ['young','🧸','Voorschools onderwijs','Vroege ontwikkeling en voorbereiding op het basisonderwijs.'],
      ['primary','📚','Primair · GLO','Gewoon Lager Onderwijs / basisonderwijs.'],
      ['secondary','🎒','Secundair I · VOJ','Juniorenonderwijs, waaronder o.a. MULO en LBO-routes.'],
      ['student','🎓','Secundair II · VOS','Seniorenonderwijs, waaronder HAVO/VWO en beroepsgerichte routes zoals NATIN/IMEAO.'],
      ['adult','🏛️','Tertiair / Hoger onderwijs','Hoger beroeps- en universitair onderwijs, waaronder AdeKUS en andere tertiaire instellingen.']
    ]},
    Netherlands:{label:'Netherlands',stages:[
      ['young','🧸','Voorschool / kinderopvang','Voor- en vroegschoolse ontwikkeling.'],
      ['primary','📚','Basisonderwijs','Groep 1–8.'],
      ['secondary','🎒','Voortgezet · VMBO/HAVO/VWO','Onderbouw en voortgezet onderwijs met verschillende leerwegen.'],
      ['student','🎓','Bovenbouw / MBO','Bovenbouw HAVO/VWO of middelbaar beroepsonderwijs.'],
      ['adult','🏛️','HBO / WO','Hoger beroepsonderwijs en wetenschappelijk onderwijs.']
    ]},
    'United States':{label:'United States',stages:[
      ['young','🧸','Pre-K / Kindergarten','Early childhood and kindergarten.'],
      ['primary','📚','Elementary School','Primary grades, commonly K–5 or K–6.'],
      ['secondary','🎒','Middle School','Lower-secondary grades, commonly 6–8.'],
      ['student','🎓','High School','Upper-secondary grades, commonly 9–12.'],
      ['adult','🏛️','College / University','Community college, undergraduate and graduate higher education.']
    ]},
    'United Kingdom':{label:'United Kingdom',stages:[
      ['young','🧸','Early Years','Nursery and Reception / early-years foundation.'],
      ['primary','📚','Primary School','Key Stages 1–2.'],
      ['secondary','🎒','Secondary / GCSE','Key Stages 3–4 and GCSE preparation.'],
      ['student','🎓','Sixth Form / College','A levels, vocational qualifications and further education.'],
      ['adult','🏛️','University / Higher Education','Undergraduate and postgraduate higher education.']
    ]},
    Germany:{label:'Germany',stages:[
      ['young','🧸','Kindergarten','Early childhood education.'],
      ['primary','📚','Grundschule','Primary education.'],
      ['secondary','🎒','Sekundarstufe I','Lower secondary across the German school pathways.'],
      ['student','🎓','Sekundarstufe II / Ausbildung','Upper secondary, Abitur pathways and vocational training.'],
      ['adult','🏛️','Hochschule / Universität','Higher education and advanced tertiary study.']
    ]},
    France:{label:'France',stages:[
      ['young','🧸','École maternelle','Pre-primary education.'],
      ['primary','📚','École primaire','Primary education.'],
      ['secondary','🎒','Collège','Lower secondary.'],
      ['student','🎓','Lycée','Upper secondary, including general, technological and vocational routes.'],
      ['adult','🏛️','Enseignement supérieur','University, grandes écoles and other higher education.']
    ]},
    Spain:{label:'Spain',stages:[
      ['young','🧸','Educación Infantil','Early childhood education.'],
      ['primary','📚','Educación Primaria','Primary education.'],
      ['secondary','🎒','ESO','Educación Secundaria Obligatoria.'],
      ['student','🎓','Bachillerato / FP','Upper-secondary academic or vocational preparation.'],
      ['adult','🏛️','Universidad / Superior','University and higher vocational education.']
    ]},
    Portugal:{label:'Portugal',stages:[
      ['young','🧸','Pré-escolar','Pre-school education.'],
      ['primary','📚','Ensino Básico · 1.º/2.º ciclo','Primary/basic education.'],
      ['secondary','🎒','Ensino Básico · 3.º ciclo','Lower-secondary/basic education.'],
      ['student','🎓','Secundário / Profissional','Upper secondary and professional routes.'],
      ['adult','🏛️','Ensino Superior','Polytechnic and university higher education.']
    ]},
    Italy:{label:'Italy',stages:[
      ['young','🧸','Scuola dell’infanzia','Early childhood education.'],
      ['primary','📚','Scuola primaria','Primary education.'],
      ['secondary','🎒','Secondaria di I grado','Lower secondary.'],
      ['student','🎓','Secondaria di II grado','Upper secondary, including licei and technical/vocational institutes.'],
      ['adult','🏛️','Università / Alta formazione','University and other tertiary education.']
    ]},
    Brazil:{label:'Brazil',stages:[
      ['young','🧸','Educação Infantil','Creche and pre-school.'],
      ['primary','📚','Ensino Fundamental I','Early years of fundamental education.'],
      ['secondary','🎒','Ensino Fundamental II','Later years of fundamental education.'],
      ['student','🎓','Ensino Médio / Técnico','Upper secondary and technical education.'],
      ['adult','🏛️','Ensino Superior','University and other higher education.']
    ]},
    Canada:{label:'Canada',stages:[
      ['young','🧸','Pre-school / Kindergarten','Early childhood; exact structure varies by province.'],
      ['primary','📚','Elementary School','Primary grades; province-specific.'],
      ['secondary','🎒','Middle / Junior High','Lower-secondary structure varies by province.'],
      ['student','🎓','Secondary / High School','Upper secondary leading to provincial diploma.'],
      ['adult','🏛️','College / University','College, polytechnic and university education.']
    ]},
    Australia:{label:'Australia',stages:[
      ['young','🧸','Early Learning / Kindergarten','Pre-school education; naming varies by state.'],
      ['primary','📚','Primary School','Foundation/Prep through primary years.'],
      ['secondary','🎒','Junior Secondary','Lower years of secondary school.'],
      ['student','🎓','Senior Secondary','Years 11–12 and state senior certificates.'],
      ['adult','🏛️','TAFE / University','Vocational and higher education.']
    ]},
    India:{label:'India',stages:[
      ['young','🧸','Pre-primary','Nursery / kindergarten.'],
      ['primary','📚','Primary','Primary schooling.'],
      ['secondary','🎒','Upper Primary / Secondary','Middle and secondary stages; board structure varies.'],
      ['student','🎓','Senior Secondary','Classes 11–12 / higher secondary.'],
      ['adult','🏛️','College / University','Undergraduate, postgraduate and professional higher education.']
    ]},
    'South Africa':{label:'South Africa',stages:[
      ['young','🧸','ECD / Grade R','Early childhood development and reception year.'],
      ['primary','📚','Primary · Foundation/Intermediate','Primary phases.'],
      ['secondary','🎒','Senior Phase','Lower-secondary progression.'],
      ['student','🎓','FET · Grades 10–12','Further Education and Training, ending with the NSC.'],
      ['adult','🏛️','TVET / University','Technical-vocational and university higher education.']
    ]},
    Guyana:{label:'Guyana',stages:[
      ['young','🧸','Nursery Education','Early childhood / nursery.'],
      ['primary','📚','Primary Education','Primary schooling.'],
      ['secondary','🎒','Secondary Education','Lower and general secondary education.'],
      ['student','🎓','Upper Secondary / Technical','CSEC/CAPE or technical-vocational preparation.'],
      ['adult','🏛️','Tertiary Education','College, technical and university education.']
    ]},
    'Trinidad & Tobago':{label:'Trinidad & Tobago',stages:[
      ['young','🧸','ECC/ECCE','Early childhood care and education.'],
      ['primary','📚','Primary Education','Primary schooling.'],
      ['secondary','🎒','Secondary · CSEC pathway','Secondary education leading toward CSEC.'],
      ['student','🎓','Sixth Form / Technical','CAPE, technical and vocational upper-secondary routes.'],
      ['adult','🏛️','Tertiary Education','College and university education.']
    ]},
    Jamaica:{label:'Jamaica',stages:[
      ['young','🧸','Early Childhood','Early childhood institutions.'],
      ['primary','📚','Primary Education','Primary schooling.'],
      ['secondary','🎒','Lower Secondary','Secondary progression toward CSEC.'],
      ['student','🎓','Upper Secondary / Sixth Form','CSEC/CAPE, sixth form and vocational options.'],
      ['adult','🏛️','Tertiary Education','College and university education.']
    ]},
    Belgium:{label:'Belgium',stages:[
      ['young','🧸','Kleuter / Maternelle','Pre-primary education; terminology depends on community.'],
      ['primary','📚','Lager / Primaire','Primary education.'],
      ['secondary','🎒','Secundair / Secondaire I','Lower secondary.'],
      ['student','🎓','Secundair / Secondaire II','Upper secondary general, technical or vocational routes.'],
      ['adult','🏛️','Hoger / Supérieur','University colleges and universities.']
    ]}
  };

  const aliases={
    'suriname':'Suriname','sr':'Suriname',
    'netherlands':'Netherlands','nederland':'Netherlands','holland':'Netherlands','nl':'Netherlands',
    'united states':'United States','usa':'United States','us':'United States','america':'United States',
    'united kingdom':'United Kingdom','uk':'United Kingdom','england':'United Kingdom','great britain':'United Kingdom',
    'germany':'Germany','deutschland':'Germany','duitsland':'Germany',
    'france':'France','frankrijk':'France',
    'spain':'Spain','spanje':'Spain',
    'portugal':'Portugal',
    'italy':'Italy','italie':'Italy','italië':'Italy',
    'brazil':'Brazil','brasil':'Brazil','brazilië':'Brazil','brazilie':'Brazil',
    'canada':'Canada','australia':'Australia','australië':'Australia',
    'india':'India','south africa':'South Africa','zuid-afrika':'South Africa',
    'guyana':'Guyana','trinidad and tobago':'Trinidad & Tobago','trinidad & tobago':'Trinidad & Tobago','trinidad':'Trinidad & Tobago',
    'jamaica':'Jamaica','belgium':'Belgium','belgie':'Belgium','belgië':'Belgium'
  };
  const countryList=Object.keys(SYSTEMS);
  const UI_LANGS=new Set(['nl','en','es','fr','de','pt','it']);
  const uiLang=()=>{const x=localStorage.getItem('scholark_ui_language')||'nl';return UI_LANGS.has(x)?x:'nl'};
  const COUNTRY_NAMES={
    Suriname:['Suriname','Suriname','Surinam','Suriname','Suriname','Suriname','Suriname'],
    Netherlands:['Nederland','Netherlands','Países Bajos','Pays-Bas','Niederlande','Países Baixos','Paesi Bassi'],
    'United States':['Verenigde Staten','United States','Estados Unidos','États-Unis','Vereinigte Staaten','Estados Unidos','Stati Uniti'],
    'United Kingdom':['Verenigd Koninkrijk','United Kingdom','Reino Unido','Royaume-Uni','Vereinigtes Königreich','Reino Unido','Regno Unito'],
    Germany:['Duitsland','Germany','Alemania','Allemagne','Deutschland','Alemanha','Germania'],
    France:['Frankrijk','France','Francia','France','Frankreich','França','Francia'],
    Spain:['Spanje','Spain','España','Espagne','Spanien','Espanha','Spagna'],
    Portugal:['Portugal','Portugal','Portugal','Portugal','Portugal','Portugal','Portogallo'],
    Italy:['Italië','Italy','Italia','Italie','Italien','Itália','Italia'],
    Brazil:['Brazilië','Brazil','Brasil','Brésil','Brasilien','Brasil','Brasile'],
    Canada:['Canada','Canada','Canadá','Canada','Kanada','Canadá','Canada'],
    Australia:['Australië','Australia','Australia','Australie','Australien','Austrália','Australia'],
    India:['India','India','India','Inde','Indien','Índia','India'],
    'South Africa':['Zuid-Afrika','South Africa','Sudáfrica','Afrique du Sud','Südafrika','África do Sul','Sudafrica'],
    Guyana:['Guyana','Guyana','Guyana','Guyana','Guyana','Guiana','Guyana'],
    'Trinidad & Tobago':['Trinidad en Tobago','Trinidad & Tobago','Trinidad y Tobago','Trinité-et-Tobago','Trinidad und Tobago','Trinidad e Tobago','Trinidad e Tobago'],
    Jamaica:['Jamaica','Jamaica','Jamaica','Jamaïque','Jamaika','Jamaica','Giamaica'],
    Belgium:['België','Belgium','Bélgica','Belgique','Belgien','Bélgica','Belgio']
  };
  const LANG_INDEX={nl:0,en:1,es:2,fr:3,de:4,pt:5,it:6};
  const countryName=c=>COUNTRY_NAMES[c]?.[LANG_INDEX[uiLang()]]||c;
  const LEVEL_COPY={
    nl:{young:['Voorschools onderwijs','Vroege ontwikkeling en voorbereiding op het basisonderwijs.'],primary:['Primair onderwijs','Basisvaardigheden voor taal, rekenen en algemeen leren.'],secondary:['Lager secundair onderwijs','De eerste secundaire fase binnen dit landelijke systeem.'],student:['Hoger secundair / beroepsonderwijs','Voorbereiding op vervolgstudie of werk.'],adult:['Hoger onderwijs','Tertiair, beroepsgericht en universitair onderwijs.'],all:'Alle niveaus',adultFilter:'Volwassenen / professioneel leren',system:'Onderwijssysteem',country:'Land',note:'landgebonden onderwijsniveaus',choose:'KIES JE ONDERWIJSNIVEAU'},
    en:{young:['Early childhood education','Early development and preparation for primary education.'],primary:['Primary education','Foundational literacy, numeracy and general learning.'],secondary:['Lower secondary education','The first secondary stage in this national system.'],student:['Upper secondary / vocational education','Preparation for further study or work.'],adult:['Higher education','Tertiary, professional and university education.'],all:'All levels',adultFilter:'Adult / professional learning',system:'Education system',country:'Country',note:'country-aware school stages',choose:'CHOOSE YOUR EDUCATION STAGE'},
    es:{young:['Educación infantil','Desarrollo temprano y preparación para primaria.'],primary:['Educación primaria','Competencias básicas de lengua, matemáticas y aprendizaje.'],secondary:['Educación secundaria inferior','Primera etapa secundaria del sistema nacional.'],student:['Secundaria superior / formación profesional','Preparación para estudios posteriores o trabajo.'],adult:['Educación superior','Educación terciaria, profesional y universitaria.'],all:'Todos los niveles',adultFilter:'Aprendizaje adulto / profesional',system:'Sistema educativo',country:'País',note:'niveles educativos adaptados al país',choose:'ELIGE TU NIVEL EDUCATIVO'},
    fr:{young:['Éducation de la petite enfance','Développement précoce et préparation au primaire.'],primary:['Enseignement primaire','Compétences fondamentales en langue, calcul et apprentissage.'],secondary:['Secondaire inférieur','Première étape secondaire du système national.'],student:['Secondaire supérieur / professionnel','Préparation aux études supérieures ou au travail.'],adult:['Enseignement supérieur','Enseignement tertiaire, professionnel et universitaire.'],all:'Tous les niveaux',adultFilter:'Formation adulte / professionnelle',system:'Système éducatif',country:'Pays',note:'niveaux scolaires adaptés au pays',choose:'CHOISISSEZ VOTRE NIVEAU D’ÉTUDES'},
    de:{young:['Frühkindliche Bildung','Frühe Entwicklung und Vorbereitung auf die Grundschule.'],primary:['Primarbildung','Grundlegende Sprach-, Rechen- und Lernkompetenzen.'],secondary:['Sekundarstufe I','Erste Sekundarstufe im nationalen Bildungssystem.'],student:['Sekundarstufe II / Berufsbildung','Vorbereitung auf Studium oder Arbeit.'],adult:['Hochschulbildung','Tertiäre, berufliche und universitäre Bildung.'],all:'Alle Stufen',adultFilter:'Erwachsenen- / Berufsbildung',system:'Bildungssystem',country:'Land',note:'länderspezifische Bildungsstufen',choose:'WÄHLE DEINE BILDUNGSSTUFE'},
    pt:{young:['Educação infantil','Desenvolvimento inicial e preparação para o ensino primário.'],primary:['Ensino primário','Competências básicas de literacia, numeracia e aprendizagem.'],secondary:['Ensino secundário inferior','Primeira etapa secundária do sistema nacional.'],student:['Ensino secundário superior / profissional','Preparação para estudos posteriores ou trabalho.'],adult:['Ensino superior','Ensino terciário, profissional e universitário.'],all:'Todos os níveis',adultFilter:'Aprendizagem adulta / profissional',system:'Sistema educativo',country:'País',note:'níveis de ensino adaptados ao país',choose:'ESCOLHA O SEU NÍVEL DE ENSINO'},
    it:{young:['Educazione della prima infanzia','Sviluppo iniziale e preparazione alla primaria.'],primary:['Istruzione primaria','Competenze fondamentali di lingua, matematica e apprendimento.'],secondary:['Secondaria inferiore','Prima fase secondaria del sistema nazionale.'],student:['Secondaria superiore / professionale','Preparazione a studi successivi o lavoro.'],adult:['Istruzione superiore','Istruzione terziaria, professionale e universitaria.'],all:'Tutti i livelli',adultFilter:'Apprendimento adulto / professionale',system:'Sistema educativo',country:'Paese',note:'livelli scolastici adattati al paese',choose:'SCEGLI IL TUO LIVELLO DI ISTRUZIONE'}
  };
  const OFFICIAL={
    Suriname:{primary:'GLO',secondary:'VOJ · MULO/LBO',student:'VOS · HAVO/VWO · NATIN/IMEAO',adult:'AdeKUS'},
    Netherlands:{primary:'groep 1–8',secondary:'VMBO/HAVO/VWO',student:'MBO · HAVO/VWO',adult:'HBO/WO'},
    'United States':{young:'Pre-K / K',primary:'K–5/6',secondary:'Grades 6–8',student:'Grades 9–12',adult:'College / University'},
    'United Kingdom':{young:'Early Years',primary:'KS1–2',secondary:'KS3–4 · GCSE',student:'Sixth Form · A levels',adult:'Higher Education'},
    Germany:{young:'Kindergarten',primary:'Grundschule',secondary:'Sekundarstufe I',student:'Sekundarstufe II · Ausbildung',adult:'Hochschule / Universität'},
    France:{young:'École maternelle',primary:'École primaire',secondary:'Collège',student:'Lycée',adult:'Enseignement supérieur'},
    Spain:{young:'Educación Infantil',primary:'Educación Primaria',secondary:'ESO',student:'Bachillerato / FP',adult:'Universidad / Superior'},
    Portugal:{young:'Pré-escolar',primary:'1.º/2.º ciclo',secondary:'3.º ciclo',student:'Secundário / Profissional',adult:'Ensino Superior'},
    Italy:{young:'Scuola dell’infanzia',primary:'Scuola primaria',secondary:'Secondaria di I grado',student:'Secondaria di II grado',adult:'Università'},
    Brazil:{young:'Educação Infantil',primary:'Ensino Fundamental I',secondary:'Ensino Fundamental II',student:'Ensino Médio / Técnico',adult:'Ensino Superior'},
    Canada:{young:'Kindergarten',primary:'Elementary',secondary:'Middle / Junior High',student:'Secondary / High School',adult:'College / University'},
    Australia:{young:'Kindergarten',primary:'Primary',secondary:'Junior Secondary',student:'Senior Secondary',adult:'TAFE / University'},
    India:{young:'Pre-primary',primary:'Primary',secondary:'Upper Primary / Secondary',student:'Senior Secondary',adult:'College / University'},
    'South Africa':{young:'ECD / Grade R',primary:'Foundation / Intermediate',secondary:'Senior Phase',student:'FET · Grades 10–12',adult:'TVET / University'},
    Guyana:{young:'Nursery',primary:'Primary',secondary:'Secondary',student:'CSEC/CAPE / Technical',adult:'Tertiary'},
    'Trinidad & Tobago':{young:'ECCE',primary:'Primary',secondary:'CSEC',student:'CAPE / Sixth Form',adult:'Tertiary'},
    Jamaica:{young:'Early Childhood',primary:'Primary',secondary:'Lower Secondary',student:'CSEC/CAPE / Sixth Form',adult:'Tertiary'},
    Belgium:{young:'Kleuter / Maternelle',primary:'Lager / Primaire',secondary:'Secundair / Secondaire I',student:'Secundair / Secondaire II',adult:'Hoger / Supérieur'}
  };
  const localizedStage=(id,country=currentCountry())=>{const ui=LEVEL_COPY[uiLang()]||LEVEL_COPY.en,row=ui[id]||['',''],official=OFFICIAL[country]?.[id];return {title:row[0]+(official?' · '+official:''),description:row[1]}};

  function normalizeCountry(value){
    const x=clean(value);if(!x)return '';
    const low=x.toLowerCase();
    const localized=Object.entries(COUNTRY_NAMES).find(([,names])=>names.some(n=>clean(n).toLowerCase()===low))?.[0];
    return aliases[low]||countryList.find(c=>c.toLowerCase()===low)||localized||x;
  }
  function currentCountry(){return normalizeCountry(localStorage.getItem(KEY)||'Suriname')||'Suriname'}
  function system(country=currentCountry()){const n=normalizeCountry(country);return SYSTEMS[n]||{...GENERIC,label:n||GENERIC.label}}
  function stage(id,country=currentCountry()){return system(country).stages.find(x=>x[0]===id)||GENERIC.stages.find(x=>x[0]===id)}
  function setCountry(value,source='ui'){
    const country=normalizeCountry(value);if(!country)return currentCountry();
    const previous=currentCountry();
    localStorage.setItem(KEY,country);
    document.documentElement.dataset.scholarkCountry=country;
    apply();
    if(previous!==country)window.dispatchEvent(new CustomEvent('scholark-country-change',{detail:{country,source,system:system(country).label}}));
    return country;
  }
  function countryOptions(selected){
    const known=[...countryList];
    if(selected&&!known.includes(selected))known.unshift(selected);
    return known.map(c=>'<option value="'+c.replace(/"/g,'&quot;')+'"'+(c===selected?' selected':'')+'>'+countryName(c)+'</option>').join('');
  }
  function ensureSidebarCountry(){
    const side=$('#v51-sidebar');if(!side)return;
    let box=$('#v96-side-country',side);
    if(!box){
      box=document.createElement('div');box.id='v96-side-country';box.dataset.v96I18nOwned='1';box.innerHTML='<small></small><select data-v96-i18n-owned="1"></select><span></span>';
      const before=$('.v51-quality',side);before?.insertAdjacentElement('beforebegin',box)||side.appendChild(box);
      $('select',box).addEventListener('change',e=>setCountry(e.target.value,'sidebar'));
    }
    const selected=currentCountry(),sel=$('select',box),ui=LEVEL_COPY[uiLang()]||LEVEL_COPY.en;
    const sm=$('small',box),sp=$('span',box);if(sm)sm.textContent=ui.country.toUpperCase();if(sp)sp.textContent=ui.note+'.';
    if(sel){sel.innerHTML=countryOptions(selected);sel.value=selected;sel.setAttribute('aria-label',ui.country)}
  }
  function ensureDashboardSelector(){
    const host=$('#v51-main [data-v51-page="dashboard"] .v51-levels')?.parentElement;
    if(!host)return;
    let wrap=$('#v96-country-context',host);
    if(!wrap){
      wrap=document.createElement('div');wrap.id='v96-country-context';wrap.dataset.v96I18nOwned='1';
      wrap.innerHTML='<div class="v96-country-copy"><b></b><span id="v96-system-note"></span></div><label><span class="v96-country-label"></span><select id="v96-country" data-v96-i18n-owned="1"></select></label>';
      const levels=$('.v51-levels',host);levels?.insertAdjacentElement('beforebegin',wrap);
      $('#v96-country',wrap).addEventListener('change',e=>setCountry(e.target.value,'dashboard'));
    }
    const c=currentCountry(),sel=$('#v96-country',wrap),ui=LEVEL_COPY[uiLang()]||LEVEL_COPY.en;
    if(sel){sel.innerHTML=countryOptions(c);sel.value=c;sel.setAttribute('aria-label',ui.country)}
    const title=$('.v96-country-copy b',wrap),label=$('.v96-country-label',wrap),note=$('#v96-system-note',wrap);
    if(title)title.textContent=ui.system;if(label)label.textContent=ui.country;if(note)note.textContent=countryName(c)+' · '+ui.note;
  }
  function applyLevels(){
    const c=currentCountry(),sys=system(c),ui=LEVEL_COPY[uiLang()]||LEVEL_COPY.en;
    $('.v51-level[data-level]').forEach(btn=>{
      const st=sys.stages.find(x=>x[0]===btn.dataset.level);if(!st)return;
      const icon=btn.querySelector(':scope > span'),title=btn.querySelector('b'),desc=btn.querySelector('small'),lc=localizedStage(btn.dataset.level,c);
      btn.dataset.v96I18nOwned='1';
      if(icon)icon.textContent=st[1];if(title)title.textContent=lc.title;if(desc)desc.textContent=lc.description;
      btn.dataset.countrySystem=sys.label;
    });
    const label=$('#v51-main [data-v51-page="dashboard"] .v51-level-label');
    if(label){label.dataset.v96I18nOwned='1';label.textContent=ui.choose+' · '+countryName(c).toUpperCase()}
  }
  function applySchoolLevels(){
    const sel=$('#v50-level');if(!sel)return;
    const c=currentCountry(),ui=LEVEL_COPY[uiLang()]||LEVEL_COPY.en;sel.dataset.v96I18nOwned='1';
    const labels={all:ui.all,early:localizedStage('young',c).title,primary:localizedStage('primary',c).title,secondary:localizedStage('secondary',c).title,vocational:localizedStage('student',c).title,higher:localizedStage('adult',c).title,adult:ui.adultFilter};
    for(const option of sel.options){if(labels[option.value])option.textContent=labels[option.value]}
  }
  function seedInputs(){
    const c=currentCountry();
    for(const el of [$('#v50-country'),$('#v62-country'),$('#v52-cur-country')]){
      if(el&&!clean(el.value))el.value=c;
    }
  }
  function observeCountryInputs(){
    if(document.documentElement.dataset.v96CountryWired)return;
    document.documentElement.dataset.v96CountryWired='1';
    document.addEventListener('change',e=>{
      const el=e.target;
      if(el?.matches?.('#v50-country,#v62-country,#v52-cur-country,[data-sch-country]')&&clean(el.value))setCountry(el.value,'tool');
    },true);
  }
  function apply(){
    document.documentElement.dataset.scholarkCountry=currentCountry();
    ensureSidebarCountry();ensureDashboardSelector();applyLevels();applySchoolLevels();seedInputs();
  }

  const style=document.createElement('style');style.id='scholark-v96-country-style';style.textContent=`
    #v96-side-country{margin:9px 8px 0;padding:10px;border-radius:13px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);color:#fff}#v96-side-country small{display:block;font:900 6.8px Inter;letter-spacing:.13em;color:#8f8b98}#v96-side-country select{width:100%;margin-top:7px;border:1px solid rgba(255,255,255,.12);background:#22252e;color:#fff;border-radius:9px;padding:8px;font:800 8px Inter;outline:0}#v96-side-country option{background:#fff;color:#17191f}#v96-side-country span{display:block;margin-top:6px;font:650 7px/1.35 Inter;color:#aaa6b2}
    #v96-country-context{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 0 14px;padding:12px 14px;border:1px solid rgba(23,25,31,.09);border-radius:16px;background:#fff;box-shadow:0 10px 28px rgba(31,27,63,.04)}
    #v96-country-context .v96-country-copy b{display:block;font:900 10px Inter;color:#17191f}#v96-country-context .v96-country-copy span{display:block;margin-top:4px;font:650 8px/1.35 Inter;color:#77717e}
    #v96-country-context label{display:flex;align-items:center;gap:8px;font:800 8px Inter;color:#6d6873}#v96-country{min-width:180px;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:11px;padding:9px 28px 9px 10px;font:800 9px Inter;outline:0}
    @media(max-width:720px){#v96-country-context{align-items:stretch;flex-direction:column}#v96-country-context label{justify-content:space-between}#v96-country{min-width:0;flex:1}}
  `;document.head.appendChild(style);

  observeCountryInputs();
  addEventListener('hashchange',()=>{setTimeout(apply,60);setTimeout(apply,260)});
  addEventListener('scholark-runtime-ready',()=>setTimeout(apply,60));
  addEventListener('scholark-language-applied',()=>apply());
  addEventListener('scholark-language-ready',()=>{apply();setTimeout(apply,80)});
  addEventListener('scholark-language-complete',()=>apply());
  [80,260,700].forEach(ms=>setTimeout(apply,ms));

  window.__SCHOLARK_COUNTRY__={current:currentCountry,set:setCountry,system,stage,normalize:normalizeCountry,displayName:countryName,localizedStage,language:uiLang,systems:SYSTEMS,apply};
})();
