(function countryEducationFoundation(){
  if(window.__SCHOLARK_COUNTRY_EDUCATION__)return;
  window.__SCHOLARK_COUNTRY_EDUCATION__=true;

  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const KEY='scholark_country';
  const MANAGED_SELECTS='#v96-country,#v96-side-country select,#v50-level';
  let deferredApply=false,applyTimer=0;
  const isManagedSelect=el=>!!el?.matches?.(MANAGED_SELECTS);
  const selectBusy=sel=>!!sel&&sel.dataset.schSelectInteracting==='1';
  function releaseSelect(sel){
    if(!sel)return;
    delete sel.dataset.schSelectInteracting;
    if(deferredApply&&!$$(MANAGED_SELECTS).some(selectBusy)){deferredApply=false;scheduleApply(20)}
  }
  function wireStableSelect(sel){
    if(!sel||sel.dataset.v96StableSelect==='1')return sel;
    sel.dataset.v96StableSelect='1';
    const lock=()=>{sel.dataset.schSelectInteracting='1'};
    sel.addEventListener('pointerdown',lock,{passive:true});
    sel.addEventListener('focusin',lock);
    sel.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Enter'].includes(e.key)||e.altKey)lock();if(e.key==='Escape')setTimeout(()=>releaseSelect(sel),0)});
    sel.addEventListener('change',()=>setTimeout(()=>releaseSelect(sel),0));
    sel.addEventListener('blur',()=>setTimeout(()=>releaseSelect(sel),0));
    return sel;
  }
  function syncSelectOptions(sel,html,value,key,aria=''){
    if(!sel)return false;
    wireStableSelect(sel);
    if(aria)sel.setAttribute('aria-label',aria);
    if(selectBusy(sel)){
      deferredApply=true;
      sel.dataset.v96PendingKey=key;
      sel.dataset.v96PendingValue=value||'';
      return false;
    }
    if(sel.dataset.v96OptionsKey!==key){
      sel.innerHTML=html;
      sel.dataset.v96OptionsKey=key;
    }
    if(value!=null&&sel.value!==String(value))sel.value=String(value);
    delete sel.dataset.v96PendingKey;delete sel.dataset.v96PendingValue;
    return true;
  }
  function scheduleApply(delay=80){
    clearTimeout(applyTimer);
    const run=()=>{
      if(document.documentElement.classList.contains('scholark-language-switching')||document.documentElement.classList.contains('scholark-workspace-entering')){applyTimer=setTimeout(run,120);return}
      apply();
    };
    applyTimer=setTimeout(run,delay);
  }
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
      ['student','🎓','Secundair II · VOS','Seniorenonderwijs, waaronder HAVO en beroepsgerichte routes zoals NATIN/IMEAO. VWO staat als aparte onderwijsroute in SCHOLARK.'],
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
  const WORLD_CODES='AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PS PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW EH XK'.split(/\s+/);
  const englishRegions=typeof Intl!=='undefined'&&Intl.DisplayNames?new Intl.DisplayNames(['en'],{type:'region'}):null;
  const WORLD_COUNTRIES=WORLD_CODES.map(code=>({code,name:englishRegions?.of(code)||code})).filter(x=>x.name&&x.name!==x.code);
  const worldCodeByName=new Map(WORLD_COUNTRIES.map(x=>[x.name,x.code]));
  const worldNameByCode=new Map(WORLD_COUNTRIES.map(x=>[x.code,x.name]));
  const countryFromCode=code=>worldNameByCode.get(clean(code).toUpperCase())||'';
  const countryList=[...new Set([...Object.keys(SYSTEMS),...WORLD_COUNTRIES.map(x=>x.name)])].sort((a,b)=>a.localeCompare(b,'en'));
  const STATIC_UI_LANGS=new Set(['nl','en','es','fr','de','pt','it']);
  const uiLang=()=>{const x=localStorage.getItem('scholark_ui_language')||'nl';return window.__SCHOLARK_I18N__?.langs?.some?.(([code])=>code===x)?x:(STATIC_UI_LANGS.has(x)?x:'nl')};
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
  const COUNTRY_CODES={Suriname:'SR',Netherlands:'NL','United States':'US','United Kingdom':'GB',Germany:'DE',France:'FR',Spain:'ES',Portugal:'PT',Italy:'IT',Brazil:'BR',Canada:'CA',Australia:'AU',India:'IN','South Africa':'ZA',Guyana:'GY','Trinidad & Tobago':'TT',Jamaica:'JM',Belgium:'BE'};
  const P=(titles,groups,vocational='')=>({titles,groups,vocational});
  const NATIONAL_SCHEMES={
    spanish:P(
      ['Educación inicial / preescolar','Educación primaria / básica','Educación secundaria básica / ciclo básico','Educación media / bachillerato / técnica','Educación superior'],
      {basic:'Educación básica',voj:'Secundaria básica',vos:'Educación media',higher:'Educación superior'},
      'Formación profesional / técnica'
    ),
    portuguese:P(
      ['Educação pré-escolar','Ensino primário / básico','Ensino secundário · 1.º ciclo','Ensino secundário · 2.º ciclo / técnico','Ensino superior'],
      {basic:'Ensino básico',voj:'Ensino secundário I',vos:'Ensino secundário II',higher:'Ensino superior'},
      'Ensino técnico / profissional'
    ),
    french:P(
      ['Éducation préscolaire / maternelle','Enseignement primaire','Secondaire · 1er cycle / collège','Secondaire · 2e cycle / lycée / technique','Enseignement supérieur'],
      {basic:'Enseignement de base',voj:'Secondaire 1er cycle',vos:'Secondaire 2e cycle',higher:'Enseignement supérieur'},
      'Enseignement technique / professionnel'
    ),
    caribbean:P(
      ['Early Childhood / Nursery','Primary Education','Lower Secondary / CSEC preparation','Upper Secondary / CSEC · CAPE · Sixth Form','Tertiary Education'],
      {basic:'Primary Education',voj:'Lower Secondary',vos:'CSEC / CAPE / Sixth Form',higher:'Tertiary Education'},
      'TVET / Technical & Vocational'
    ),
    angloAfrica:P(
      ['ECD / Pre-primary','Primary Education','Junior / Lower Secondary','Senior / Upper Secondary / TVET','Tertiary / University'],
      {basic:'Basic Education',voj:'Junior Secondary',vos:'Senior Secondary / TVET',higher:'Tertiary Education'},
      'TVET / Technical & Vocational'
    ),
    pacific:P(
      ['Early Childhood Education','Primary School','Junior Secondary','Senior Secondary / TVET','Tertiary / Higher Education'],
      {basic:'Primary Education',voj:'Junior Secondary',vos:'Senior Secondary',higher:'Tertiary Education'},
      'TVET / Vocational Education'
    ),
    arabic:P(
      ['Rawda / Kindergarten','Ibtida’i / Primary','I’dadi / Intermediate','Thanawiya / Secondary / Technical','Higher Education / University'],
      {basic:'Basic Education',voj:'Intermediate / Preparatory',vos:'Secondary Education',higher:'Higher Education'},
      'Technical / Vocational Education'
    ),
    europe:P(
      ['Pre-primary / Kindergarten','Primary education','Lower secondary','Upper secondary / vocational','Higher education'],
      {basic:'Primary Education',voj:'Lower Secondary',vos:'Upper Secondary',higher:'Higher Education'},
      'Vocational education / training'
    ),
    southAsia:P(
      ['Pre-primary / ECE','Primary Education','Middle / Lower Secondary','Secondary / Higher Secondary / TVET','Higher Education'],
      {basic:'Basic Education',voj:'Middle / Lower Secondary',vos:'Secondary / Higher Secondary',higher:'Higher Education'},
      'Technical & Vocational Education'
    ),
    southeastAsia:P(
      ['Pre-primary / Kindergarten','Primary Education','Lower Secondary','Upper Secondary / Vocational','Higher Education'],
      {basic:'Basic Education',voj:'Lower Secondary',vos:'Upper Secondary / Vocational',higher:'Higher Education'},
      'Technical & Vocational Education'
    ),
    centralAsia:P(
      ['Mektepke deyingi / Preschool','Bastauysh / Primary','Negizgi orta / Basic secondary','Jalpy orta / College / TVET','Higher Education'],
      {basic:'General Education',voj:'Basic Secondary',vos:'Upper Secondary / TVET',higher:'Higher Education'},
      'Technical & Vocational Education'
    ),
    eastAfrica:P(
      ['Pre-primary / ECD','Primary Education','Lower Secondary','Upper Secondary / TVET','Higher Education'],
      {basic:'Basic Education',voj:'Lower Secondary',vos:'Upper Secondary / TVET',higher:'Higher Education'},
      'TVET / Vocational Education'
    )
  };

  const NATIONAL_SCHEME_CODES={};
  const useScheme=(name,codes)=>String(codes).trim().split(/\s+/).filter(Boolean).forEach(code=>NATIONAL_SCHEME_CODES[code]=name);
  useScheme('spanish','AR BO CL CO CR CU DO EC SV GQ GT HN MX NI PA PY PE UY VE');
  useScheme('portuguese','AO CV GW MZ ST TL');
  useScheme('french','BJ BF BI CM CF TD KM CG CD CI DJ GA GN MG ML MR NE SN TG HT');
  useScheme('caribbean','AG BS BB BZ DM GD KN LC VC');
  useScheme('angloAfrica','BW SZ GM GH KE LS LR MW MU NA NG SC SL SS UG ZM ZW');
  useScheme('pacific','FJ KI MH FM NR NZ PW PG WS SB TO TV VU');
  useScheme('arabic','DZ BH EG IQ JO KW LB LY MA OM PS QA SA SD SY TN AE YE EH');
  useScheme('europe','AL AD AM AT AZ BY BA BG HR CY CZ DK EE FI GE GR HU IE IS LV LI LT LU MT MD MC ME MK NO PL RO RU SM RS SK SI SE CH UA VA XK');
  useScheme('southAsia','AF BD BT MV NP PK LK');
  useScheme('southeastAsia','BN KH CN ID IR IL JP KP KR LA MY MN MM PH TH TR VN TW');
  useScheme('centralAsia','KZ KG TJ TM UZ');
  useScheme('eastAfrica','ER ET RW SO TZ');

  const NATIONAL_OVERRIDES={
    PA:P(
      ['Educación inicial / Preescolar','Educación primaria · Educación Básica General','Educación premedia · Educación Básica General','Educación media · Académica / Profesional y Técnica','Educación superior · Posmedia / universitaria'],
      {basic:'Educación Básica General',voj:'Premedia',vos:'Educación Media',higher:'Educación Superior'},
      'Educación profesional y técnica'
    ),
    AR:P(
      ['Nivel inicial','Educación primaria','Educación secundaria · ciclo básico','Educación secundaria · ciclo orientado / técnica','Educación superior'],
      {basic:'Educación obligatoria',voj:'Secundaria · ciclo básico',vos:'Secundaria · ciclo orientado',higher:'Educación Superior'},
      'Educación técnico-profesional'
    ),
    BO:P(
      ['Educación inicial en familia comunitaria','Primaria comunitaria vocacional','Secundaria comunitaria productiva · tramo inicial','Secundaria comunitaria productiva / Bachillerato Técnico Humanístico','Educación superior'],
      {basic:'Educación Regular',voj:'Secundaria Comunitaria Productiva',vos:'Bachillerato Técnico Humanístico',higher:'Educación Superior'},
      'Formación técnica y tecnológica'
    ),
    CL:P(
      ['Educación parvularia','Educación básica · 1.º–6.º','Educación básica 7.º–8.º / transición a media','Educación media · HC / TP','Educación superior'],
      {basic:'Educación Básica',voj:'7.º–8.º básico',vos:'Educación Media',higher:'Educación Superior'},
      'Educación media técnico-profesional'
    ),
    CO:P(
      ['Educación inicial / preescolar','Educación básica primaria','Educación básica secundaria','Educación media · académica / técnica','Educación superior'],
      {basic:'Educación Básica',voj:'Básica Secundaria',vos:'Educación Media',higher:'Educación Superior'},
      'Educación media técnica / ETDH'
    ),
    CR:P(
      ['Educación preescolar','Educación General Básica · I y II ciclos','Educación General Básica · III ciclo','Educación diversificada · académica / técnica','Educación superior'],
      {basic:'Educación General Básica',voj:'III Ciclo',vos:'Educación Diversificada',higher:'Educación Superior'},
      'Educación técnica profesional'
    ),
    CU:P(
      ['Primera infancia / Preescolar','Educación primaria','Secundaria básica','Preuniversitario / Educación Técnica y Profesional','Educación superior'],
      {basic:'Educación General',voj:'Secundaria Básica',vos:'Preuniversitario / ETP',higher:'Educación Superior'},
      'Educación Técnica y Profesional'
    ),
    DO:P(
      ['Nivel inicial','Nivel primario','Nivel secundario · primer ciclo','Nivel secundario · segundo ciclo / modalidades','Educación superior'],
      {basic:'Educación Primaria',voj:'Secundaria · Primer Ciclo',vos:'Secundaria · Segundo Ciclo',higher:'Educación Superior'},
      'Modalidad técnico-profesional'
    ),
    EC:P(
      ['Educación inicial','Educación General Básica · elemental / media','Educación General Básica · superior','Bachillerato General Unificado / técnico','Educación superior'],
      {basic:'Educación General Básica',voj:'EGB Superior',vos:'Bachillerato',higher:'Educación Superior'},
      'Bachillerato técnico'
    ),
    SV:P(
      ['Educación inicial / parvularia','Educación básica · 1.º y 2.º ciclos','Educación básica · 3.er ciclo','Educación media / bachillerato','Educación superior'],
      {basic:'Educación Básica',voj:'Tercer Ciclo',vos:'Educación Media',higher:'Educación Superior'},
      'Bachillerato técnico vocacional'
    ),
    GT:P(
      ['Educación inicial / preprimaria','Educación primaria','Ciclo básico','Ciclo diversificado · bachillerato / perito','Educación superior'],
      {basic:'Educación Primaria',voj:'Ciclo Básico',vos:'Ciclo Diversificado',higher:'Educación Superior'},
      'Formación técnica / ocupacional'
    ),
    HN:P(
      ['Educación prebásica','Educación básica · 1.º–6.º','Educación básica · 7.º–9.º','Educación media / bachillerato','Educación superior'],
      {basic:'Educación Básica',voj:'Tercer Ciclo',vos:'Educación Media',higher:'Educación Superior'},
      'Bachillerato técnico profesional'
    ),
    MX:P(
      ['Educación inicial / preescolar','Primaria','Secundaria','Educación media superior · bachillerato / profesional técnico','Educación superior'],
      {basic:'Educación Básica',voj:'Secundaria',vos:'Media Superior',higher:'Educación Superior'},
      'Profesional técnico / tecnológico'
    ),
    NI:P(
      ['Educación inicial / preescolar','Educación primaria','Educación secundaria · ciclo básico','Bachillerato / formación técnica','Educación superior'],
      {basic:'Educación Básica',voj:'Secundaria',vos:'Bachillerato',higher:'Educación Superior'},
      'Educación técnica'
    ),
    PY:P(
      ['Educación inicial','Educación Escolar Básica · 1.º/2.º ciclos','Educación Escolar Básica · 3.er ciclo','Educación media · bachillerato / técnica','Educación superior'],
      {basic:'Educación Escolar Básica',voj:'EEB · Tercer Ciclo',vos:'Educación Media',higher:'Educación Superior'},
      'Bachillerato técnico'
    ),
    PE:P(
      ['Educación inicial','Educación primaria · EBR','Educación secundaria · EBR','Secundaria / Educación técnico-productiva','Educación superior'],
      {basic:'Educación Básica Regular',voj:'Secundaria EBR',vos:'Secundaria / Técnica',higher:'Educación Superior'},
      'Educación técnico-productiva'
    ),
    UY:P(
      ['Educación inicial','Educación primaria','Educación media básica','Educación media superior · bachillerato / UTU','Educación terciaria'],
      {basic:'Educación Primaria',voj:'Media Básica',vos:'Media Superior',higher:'Educación Terciaria'},
      'Educación técnico-profesional · UTU'
    ),
    VE:P(
      ['Educación inicial','Educación primaria','Educación media general · tramo inicial','Educación media general / técnica','Educación universitaria'],
      {basic:'Educación Básica',voj:'Educación Media',vos:'Media General / Técnica',higher:'Educación Universitaria'},
      'Educación media técnica'
    ),

    AT:P(['Kindergarten','Volksschule','Sekundarstufe I · Mittelschule / AHS-Unterstufe','Sekundarstufe II · AHS/BHS/Berufsschule','Universität / Fachhochschule'],{basic:'Primarstufe',voj:'Sekundarstufe I',vos:'Sekundarstufe II',higher:'Tertiärbereich'},'Berufsbildung'),
    CH:P(['Kindergarten','Primarstufe','Sekundarstufe I','Sekundarstufe II · Gymnasium / Berufsbildung','Tertiärstufe · Universität / FH'],{basic:'Primarstufe',voj:'Sekundarstufe I',vos:'Sekundarstufe II',higher:'Tertiärstufe'},'Berufsbildung'),
    DK:P(['Dagtilbud / Børnehave','Folkeskole · indskoling/mellemtrin','Folkeskole · udskoling','Gymnasiale uddannelser / EUD','Videregående uddannelser'],{basic:'Folkeskole',voj:'Udskoling',vos:'Ungdomsuddannelser',higher:'Videregående uddannelser'},'Erhvervsuddannelser · EUD'),
    SE:P(['Förskola','Grundskola · tidigare år','Grundskola · senare år','Gymnasieskola / yrkesprogram','Högskola / universitet'],{basic:'Grundskola',voj:'Grundskolans senare år',vos:'Gymnasieskola',higher:'Högre utbildning'},'Yrkesutbildning'),
    NO:P(['Barnehage','Barneskole','Ungdomsskole','Videregående opplæring','Høyere utdanning'],{basic:'Grunnskole',voj:'Ungdomsskole',vos:'Videregående',higher:'Høyere utdanning'},'Yrkesfag'),
    FI:P(['Varhaiskasvatus / esiopetus','Perusopetus · vuosiluokat 1–6','Perusopetus · vuosiluokat 7–9','Lukio / ammatillinen koulutus','Korkeakoulutus'],{basic:'Perusopetus',voj:'Vuosiluokat 7–9',vos:'Toinen aste',higher:'Korkeakoulutus'},'Ammatillinen koulutus'),
    IS:P(['Leikskóli','Grunnskóli · yngri stig','Grunnskóli · unglingastig','Framhaldsskóli','Háskóli'],{basic:'Grunnskóli',voj:'Unglingastig',vos:'Framhaldsskóli',higher:'Háskólastig'},'Starfsnám'),
    EE:P(['Alusharidus','Põhikool · I–II kooliaste','Põhikool · III kooliaste','Gümnaasium / kutseõpe','Kõrgharidus'],{basic:'Põhiharidus',voj:'Põhikooli III aste',vos:'Gümnaasium / kutseõpe',higher:'Kõrgharidus'},'Kutseharidus'),
    LV:P(['Pirmsskolas izglītība','Sākumskola','Pamatizglītība','Vidējā / profesionālā izglītība','Augstākā izglītība'],{basic:'Pamatizglītība',voj:'Pamatizglītības otrais posms',vos:'Vidējā izglītība',higher:'Augstākā izglītība'},'Profesionālā izglītība'),
    LT:P(['Ikimokyklinis / priešmokyklinis ugdymas','Pradinis ugdymas','Pagrindinis ugdymas','Vidurinis / profesinis mokymas','Aukštasis mokslas'],{basic:'Pradinis ugdymas',voj:'Pagrindinis ugdymas',vos:'Vidurinis ugdymas',higher:'Aukštasis mokslas'},'Profesinis mokymas'),
    PL:P(['Wychowanie przedszkolne','Szkoła podstawowa · klasy 1–6','Szkoła podstawowa · klasy 7–8','Liceum / technikum / szkoła branżowa','Szkolnictwo wyższe'],{basic:'Szkoła podstawowa',voj:'Klasy 7–8',vos:'Szkoły ponadpodstawowe',higher:'Szkolnictwo wyższe'},'Technikum / szkoła branżowa'),
    CZ:P(['Mateřská škola','Základní škola · 1. stupeň','Základní škola · 2. stupeň','Gymnázium / střední škola / SOU','Vysoká škola'],{basic:'Základní vzdělávání',voj:'2. stupeň ZŠ',vos:'Střední vzdělávání',higher:'Vysoké školství'},'Střední odborné vzdělávání'),
    SK:P(['Materská škola','Základná škola · 1. stupeň','Základná škola · 2. stupeň','Gymnázium / stredná odborná škola','Vysoká škola'],{basic:'Základné vzdelávanie',voj:'2. stupeň ZŠ',vos:'Stredné vzdelávanie',higher:'Vysoké školstvo'},'Stredné odborné vzdelávanie'),
    HU:P(['Óvoda','Általános iskola · alsó tagozat','Általános iskola · felső tagozat','Gimnázium / technikum / szakképzés','Felsőoktatás'],{basic:'Általános iskola',voj:'Felső tagozat',vos:'Középfokú oktatás',higher:'Felsőoktatás'},'Szakképzés'),
    RO:P(['Educație timpurie','Învățământ primar','Învățământ gimnazial','Învățământ liceal / profesional','Învățământ superior'],{basic:'Învățământ primar',voj:'Gimnaziu',vos:'Liceal / profesional',higher:'Învățământ superior'},'Învățământ profesional'),
    GR:P(['Nipiagogeio · Νηπιαγωγείο','Dimotiko · Δημοτικό','Gymnasio · Γυμνάσιο','Lykeio / EPAL · Λύκειο / ΕΠΑΛ','Panepistimio · Πανεπιστήμιο'],{basic:'Dimotiko',voj:'Gymnasio',vos:'Lykeio / EPAL',higher:'Anotati Ekpaidefsi'},'EPAL · vocational upper secondary'),
    AL:P(['Arsimi parashkollor','Arsimi fillor','Arsimi i mesëm i ulët','Arsimi i mesëm i lartë / profesional','Arsimi i lartë'],{basic:'Arsimi bazë',voj:'I mesëm i ulët',vos:'I mesëm i lartë',higher:'Arsimi i lartë'},'Arsimi profesional'),
    HR:P(['Predškolski odgoj','Osnovna škola · razredna nastava','Osnovna škola · predmetna nastava','Gimnazija / strukovna škola','Visoko obrazovanje'],{basic:'Osnovno obrazovanje',voj:'Predmetna nastava',vos:'Srednje obrazovanje',higher:'Visoko obrazovanje'},'Strukovno obrazovanje'),
    SI:P(['Predšolska vzgoja','Osnovna šola · razredna stopnja','Osnovna šola · predmetna stopnja','Gimnazija / poklicno in strokovno','Visokošolsko izobraževanje'],{basic:'Osnovna šola',voj:'Predmetna stopnja',vos:'Srednje izobraževanje',higher:'Visokošolsko'},'Poklicno in strokovno izobraževanje'),
    RS:P(['Predškolsko vaspitanje','Osnovna škola · prvi ciklus','Osnovna škola · drugi ciklus','Gimnazija / stručna škola','Visoko obrazovanje'],{basic:'Osnovno obrazovanje',voj:'Drugi ciklus',vos:'Srednje obrazovanje',higher:'Visoko obrazovanje'},'Srednje stručno obrazovanje'),
    BA:P(['Predškolsko obrazovanje','Osnovna škola · razredna nastava','Osnovna škola · predmetna nastava','Gimnazija / srednja stručna škola','Visoko obrazovanje'],{basic:'Osnovno obrazovanje',voj:'Predmetna nastava',vos:'Srednje obrazovanje',higher:'Visoko obrazovanje'},'Stručno obrazovanje'),
    ME:P(['Predškolsko vaspitanje','Osnovna škola · prvi ciklus','Osnovna škola · drugi/treći ciklus','Gimnazija / stručna škola','Visoko obrazovanje'],{basic:'Osnovno obrazovanje',voj:'Viši ciklusi',vos:'Srednje obrazovanje',higher:'Visoko obrazovanje'},'Stručno obrazovanje'),
    MK:P(['Предучилишно / Preduchilisno','Основно образование / Osnovno','Lower secondary · osnovno viših razreda','Гимназиско / стручно образование','Високо образование'],{basic:'Osnovno obrazovanie',voj:'Lower secondary',vos:'Sredno obrazovanie',higher:'Visoko obrazovanie'},'Stručno obrazovanie'),
    BG:P(['Предучилищно образование','Начален етап','Прогимназиален етап','Гимназиален етап / професионално','Висше образование'],{basic:'Основно образование',voj:'Прогимназиален етап',vos:'Средно образование',higher:'Висше образование'},'Професионално образование'),
    UA:P(['Дошкільна освіта','Початкова освіта','Базова середня освіта','Профільна середня / професійна освіта','Вища освіта'],{basic:'Загальна середня освіта',voj:'Базова середня',vos:'Профільна середня',higher:'Вища освіта'},'Професійна освіта'),
    RU:P(['Дошкольное образование','Начальное общее образование','Основное общее образование','Среднее общее / СПО','Высшее образование'],{basic:'Общее образование',voj:'Основное общее',vos:'Среднее общее / СПО',higher:'Высшее образование'},'Среднее профессиональное образование'),
    MD:P(['Educație timpurie','Învățământ primar','Învățământ gimnazial','Învățământ liceal / profesional tehnic','Învățământ superior'],{basic:'Învățământ general',voj:'Gimnaziu',vos:'Liceu / profesional tehnic',higher:'Învățământ superior'},'Învățământ profesional tehnic'),
    AM:P(['Նախադպրոցական / Nakhadprotsakan','Տարրական / Elementary','Հիմնական դպրոց / Basic school','Ավագ դպրոց / vocational','Բարձրագույն կրթություն'],{basic:'General education',voj:'Basic school',vos:'High school / vocational',higher:'Higher education'},'Vocational education'),
    AZ:P(['Məktəbəqədər təhsil','İbtidai təhsil','Ümumi orta təhsil','Tam orta / peşə təhsili','Ali təhsil'],{basic:'Ümumi təhsil',voj:'Ümumi orta',vos:'Tam orta / peşə',higher:'Ali təhsil'},'Peşə təhsili'),
    GE:P(['სკოლამდელი / Preschool','დაწყებითი / Primary','საბაზო / Basic','საშუალო / პროფესიული','უმაღლესი განათლება'],{basic:'General education',voj:'Basic education',vos:'Secondary / vocational',higher:'Higher education'},'Vocational education'),
    BY:P(['Дашкольная адукацыя','Пачатковая адукацыя','Базавая сярэдняя адукацыя','Агульная сярэдняя / прафесійная','Вышэйшая адукацыя'],{basic:'Агульная адукацыя',voj:'Базавая сярэдняя',vos:'Сярэдняя / прафесійная',higher:'Вышэйшая адукацыя'},'Прафесійная адукацыя'),

    JP:P(['Yōchien / Hoikuen · 幼稚園/保育所','Shōgakkō · 小学校','Chūgakkō · 中学校','Kōtō gakkō / Kōsen · 高等学校/高専','Daigaku / Senmon gakkō · 大学/専門学校'],{basic:'Elementary Education',voj:'Lower Secondary',vos:'Upper Secondary',higher:'Higher Education'},'Specialized training / Kōsen'),
    CN:P(['Xuéqián jiàoyù · 学前教育','Xiǎoxué · 小学','Chūzhōng · 初中','Gāozhōng / Zhōngzhí · 高中/中职','Gāoděng jiàoyù · 高等教育'],{basic:'义务教育 · Primary',voj:'初中',vos:'高中 / 中职',higher:'高等教育'},'中等职业教育 · Zhongzhi'),
    KR:P(['Yuchiwon · 유치원','Chodeung-hakgyo · 초등학교','Junghakgyo · 중학교','Godeung-hakgyo · 고등학교','Daehak · 대학'],{basic:'초등교육',voj:'중학교',vos:'고등학교',higher:'고등교육'},'직업계고 / 전문대'),
    KP:P(['Kindergarten','Primary School','Junior Middle School','Senior Middle School / Vocational','University / College'],{basic:'Compulsory Education',voj:'Junior Middle',vos:'Senior Middle',higher:'Higher Education'},'Vocational education'),
    ID:P(['PAUD / TK','SD / MI','SMP / MTs','SMA / SMK / MA','Perguruan Tinggi'],{basic:'Pendidikan Dasar',voj:'SMP / MTs',vos:'SMA / SMK / MA',higher:'Pendidikan Tinggi'},'SMK · Pendidikan vokasi'),
    MY:P(['Prasekolah','Sekolah Rendah','Menengah Rendah','Menengah Atas / TVET','Pendidikan Tinggi'],{basic:'Pendidikan Rendah',voj:'Menengah Rendah',vos:'Menengah Atas',higher:'Pendidikan Tinggi'},'TVET'),
    SG:P(['Preschool','Primary School','Secondary School','Post-secondary · JC / Polytechnic / ITE','University / Higher Education'],{basic:'Primary Education',voj:'Secondary Education',vos:'Post-secondary',higher:'Higher Education'},'ITE / Polytechnic'),
    PH:P(['Kindergarten','Elementary · Grades 1–6','Junior High School · Grades 7–10','Senior High School · Grades 11–12 / TVET','Higher Education'],{basic:'Basic Education',voj:'Junior High School',vos:'Senior High School',higher:'Higher Education'},'TVET · TESDA'),
    TH:P(['Anuban · อนุบาล','Prathom · ประถมศึกษา','Mathayom Ton Ton · มัธยมต้น','Mathayom Ton Plai / Vocational · มัธยมปลาย','Higher Education · อุดมศึกษา'],{basic:'Basic Education',voj:'Lower Secondary',vos:'Upper Secondary / Vocational',higher:'Higher Education'},'Vocational Education'),
    VN:P(['Mầm non','Tiểu học','THCS · Trung học cơ sở','THPT / Giáo dục nghề nghiệp','Đại học / Cao đẳng'],{basic:'Giáo dục phổ thông',voj:'THCS',vos:'THPT / nghề nghiệp',higher:'Giáo dục đại học'},'Giáo dục nghề nghiệp'),
    BN:P(['Prasekolah','Pendidikan Rendah','Menengah Bawah','Menengah Atas / Sixth Form / Technical','Pendidikan Tinggi'],{basic:'Pendidikan Asas',voj:'Menengah Bawah',vos:'Menengah Atas',higher:'Pendidikan Tinggi'},'Pendidikan teknikal'),
    KH:P(['មត្តេយ្យ / Preschool','បឋមសិក្សា / Primary','មធ្យមសិក្សាបឋមភូមិ / Lower secondary','មធ្យមសិក្សាទុតិយភូមិ / Upper secondary / TVET','ឧត្តមសិក្សា / Higher education'],{basic:'Basic Education',voj:'Lower Secondary',vos:'Upper Secondary / TVET',higher:'Higher Education'},'Technical & Vocational Education'),
    LA:P(['ອະນຸບານ / Kindergarten','ປະຖົມ / Primary','ມັດທະຍົມຕົ້ນ / Lower secondary','ມັດທະຍົມປາຍ / Upper secondary / TVET','Higher Education'],{basic:'General Education',voj:'Lower Secondary',vos:'Upper Secondary',higher:'Higher Education'},'TVET'),
    MM:P(['Kindergarten','Primary School','Middle School','High School / TVET','University / College'],{basic:'Basic Education',voj:'Middle School',vos:'High School / TVET',higher:'Higher Education'},'Technical / vocational education'),
    TW:P(['幼兒園 · Kindergarten','國民小學 · Elementary','國民中學 · Junior High','高級中等學校 / 技職 · Senior High / TVE','大專校院 · Higher Education'],{basic:'國民教育',voj:'國民中學',vos:'高級中等教育',higher:'高等教育'},'技術及職業教育'),
    TR:P(['Okul öncesi','İlkokul','Ortaokul','Lise / Mesleki ve Teknik Eğitim','Yükseköğretim'],{basic:'Temel Eğitim',voj:'Ortaokul',vos:'Ortaöğretim',higher:'Yükseköğretim'},'Mesleki ve Teknik Eğitim'),
    IR:P(['Pish-dabestani · پیش‌دبستانی','Dabestan · دبستان','Motavaseteh-ye avval · متوسطه اول','Motavaseteh-ye dovom / Fanni · متوسطه دوم','Amozesh-e Ali · آموزش عالی'],{basic:'General Education',voj:'Lower Secondary',vos:'Upper Secondary / Technical',higher:'Higher Education'},'Fanni-o-herfei · Technical/Vocational'),
    AF:P(['Kudakistan / Preschool','Ibtidaiya · Primary','Motawasseta · Lower secondary','Thanawi / vocational · Upper secondary','Higher Education'],{basic:'General Education',voj:'Lower Secondary',vos:'Upper Secondary',higher:'Higher Education'},'Technical & vocational education'),
    BD:P(['Pre-primary','Primary · Class 1–5','Junior Secondary · Class 6–8','Secondary / Higher Secondary · SSC/HSC / TVET','Tertiary Education'],{basic:'Primary Education',voj:'Junior Secondary',vos:'SSC / HSC',higher:'Tertiary Education'},'Technical & Madrasah / TVET'),
    BT:P(['ECCD','Primary · PP–VI','Lower Secondary · VII–VIII','Middle / Higher Secondary · IX–XII / TVET','Tertiary Education'],{basic:'Basic Education',voj:'Lower Secondary',vos:'Middle / Higher Secondary',higher:'Tertiary Education'},'TVET'),
    NP:P(['ECD / Pre-primary','Basic Education · Grades 1–5','Basic Education · Grades 6–8','Secondary · Grades 9–12 / Technical','Higher Education'],{basic:'Basic Education',voj:'Basic · Grades 6–8',vos:'Secondary Education',higher:'Higher Education'},'Technical / vocational education'),
    PK:P(['Katchi / ECE','Primary · Grades 1–5','Middle · Grades 6–8','Secondary / Higher Secondary · SSC/HSSC','Higher Education'],{basic:'School Education',voj:'Middle School',vos:'SSC / HSSC',higher:'Higher Education'},'Technical & vocational education'),
    LK:P(['Pre-primary','Primary · Grades 1–5','Junior Secondary · Grades 6–9','Senior Secondary / GCE O/L–A/L / TVET','Higher Education'],{basic:'General Education',voj:'Junior Secondary',vos:'Senior Secondary',higher:'Higher Education'},'Technical & vocational education'),
    MV:P(['Foundation Stage','Primary · Key Stages 1–2','Lower Secondary · Key Stage 3','Higher Secondary / TVET','Higher Education'],{basic:'Basic Education',voj:'Lower Secondary',vos:'Higher Secondary',higher:'Higher Education'},'TVET'),
    IN:P(['Foundational Stage','Preparatory Stage','Middle Stage','Secondary Stage / Vocational','Higher Education'],{basic:'School Education · Foundational/Preparatory',voj:'Middle Stage',vos:'Secondary Stage',higher:'Higher Education'},'Vocational Education'),

    KZ:P(['Mektepke deyingi / Мектепке дейінгі','Bastauysh / Бастауыш','Negizgi orta / Негізгі орта','Jalpy orta / College / TVET','Joğary bilim / Жоғары білім'],{basic:'Jalpy bilim',voj:'Negizgi orta',vos:'Jalpy orta / TVET',higher:'Joğary bilim'},'Tehnikalyq jäne käsiptik bilim'),
    KG:P(['Mektepke cheyinki','Bashtalgych bilim','Negizgi jalpy bilim','Orto jalpy / kesiptik bilim','Jogorku bilim'],{basic:'Jalpy bilim',voj:'Negizgi jalpy',vos:'Orto jalpy / kesiptik',higher:'Jogorku bilim'},'Kesiptik bilim'),
    UZ:P(["Maktabgacha ta'lim","Boshlang'ich ta'lim","Umumiy o'rta ta'lim","O'rta maxsus / professional ta'lim","Oliy ta'lim"],{basic:"Umumiy ta'lim",voj:"Umumiy o'rta",vos:"Professional / upper secondary",higher:"Oliy ta'lim"},'Professional ta’lim'),
    TJ:P(['Таҳсилоти томактабӣ','Таҳсилоти ибтидоӣ','Таҳсилоти умумии асосӣ','Таҳсилоти миёнаи умумӣ / касбӣ','Таҳсилоти олии касбӣ'],{basic:'Таҳсилоти умумӣ',voj:'Умумии асосӣ',vos:'Миёна / касбӣ',higher:'Таҳсилоти олӣ'},'Таҳсилоти касбӣ'),
    TM:P(['Mekdebe çenli bilim','Başlangyç bilim','Esasy orta bilim','Doly orta / hünär bilimi','Ýokary bilim'],{basic:'Umumy bilim',voj:'Esasy orta',vos:'Doly orta / hünär',higher:'Ýokary bilim'},'Hünär bilimi'),

    KE:P(['Pre-primary · PP1–PP2','Lower / Upper Primary · Grades 1–6','Junior School · Grades 7–9','Senior School · Grades 10–12','Tertiary / University'],{basic:'Early Years & Primary',voj:'Junior School',vos:'Senior School',higher:'Tertiary Education'},'TVET'),
    NG:P(['ECCDE / Pre-primary','Primary · UBE','Junior Secondary · JSS','Senior Secondary · SSS / TVET','Tertiary Education'],{basic:'Universal Basic Education',voj:'Junior Secondary',vos:'Senior Secondary',higher:'Tertiary Education'},'Technical & Vocational Education'),
    GH:P(['Kindergarten · KG','Primary','Junior High School · JHS','Senior High School · SHS / TVET','Tertiary Education'],{basic:'Basic Education',voj:'Junior High School',vos:'Senior High / TVET',higher:'Tertiary Education'},'TVET'),
    UG:P(['Pre-primary / Nursery','Primary · P1–P7','Lower Secondary','Upper Secondary / TVET','Tertiary Education'],{basic:'Primary Education',voj:'Lower Secondary',vos:'Upper Secondary',higher:'Tertiary Education'},'BTVET / TVET'),
    TZ:P(['Pre-primary','Primary','Ordinary Secondary · O-Level','Advanced Secondary · A-Level / VET','Higher Education'],{basic:'Basic Education',voj:'O-Level',vos:'A-Level / VET',higher:'Higher Education'},'Vocational Education & Training'),
    RW:P(['Nursery','Primary','Lower Secondary','Upper Secondary / TVET','Higher Education'],{basic:'Basic Education',voj:'Lower Secondary',vos:'Upper Secondary / TVET',higher:'Higher Education'},'TVET'),
    ET:P(['Kindergarten / O-Class','Primary · Grades 1–6','Middle School · Grades 7–8','Secondary · Grades 9–12 / TVET','Higher Education'],{basic:'General Education',voj:'Middle School',vos:'Secondary / TVET',higher:'Higher Education'},'TVET'),
    ZM:P(['Early Childhood Education','Primary · Grades 1–7','Junior Secondary · Grades 8–9','Senior Secondary · Grades 10–12 / TEVET','Tertiary Education'],{basic:'Basic Education',voj:'Junior Secondary',vos:'Senior Secondary',higher:'Tertiary Education'},'TEVET'),
    ZW:P(['ECD','Primary · Grade 1–7','Junior Secondary · Forms 1–2','Senior Secondary · O-Level / A-Level / TVET','Tertiary Education'],{basic:'Primary Education',voj:'Junior Secondary',vos:'Senior Secondary',higher:'Tertiary Education'},'TVET'),

    DZ:P(['Éducation préparatoire','Enseignement primaire','Enseignement moyen','Enseignement secondaire / formation professionnelle','Enseignement supérieur'],{basic:'Enseignement fondamental',voj:'Enseignement moyen',vos:'Enseignement secondaire',higher:'Enseignement supérieur'},'Formation professionnelle'),
    MA:P(['Préscolaire','Enseignement primaire','Secondaire collégial','Secondaire qualifiant / formation professionnelle','Enseignement supérieur'],{basic:'Enseignement primaire',voj:'Secondaire collégial',vos:'Secondaire qualifiant',higher:'Enseignement supérieur'},'Formation professionnelle'),
    TN:P(['Préscolaire','Enseignement de base · 1er degré','Enseignement de base · 2e degré','Enseignement secondaire / formation professionnelle','Enseignement supérieur'],{basic:'Enseignement de base',voj:'2e degré de base',vos:'Secondaire',higher:'Enseignement supérieur'},'Formation professionnelle'),
    EG:P(['Kindergarten · KG','Primary Education','Preparatory Education','General / Technical Secondary','Higher Education'],{basic:'Basic Education',voj:'Preparatory',vos:'Secondary Education',higher:'Higher Education'},'Technical secondary education'),
    AE:P(['Kindergarten · KG1–KG2','Cycle 1 · Grades 1–4','Cycle 2 · Grades 5–8','Cycle 3 · Grades 9–12','Higher Education'],{basic:'Kindergarten & Cycle 1',voj:'Cycle 2',vos:'Cycle 3',higher:'Higher Education'},'Applied / technical education'),
    SA:P(['Kindergarten','Primary School','Intermediate School','Secondary School / Technical & Vocational','Higher Education'],{basic:'General Education',voj:'Intermediate',vos:'Secondary',higher:'Higher Education'},'Technical & Vocational Training'),
    IL:P(['Gan · גן','Beit sefer yesodi · יסודי','Hativat beinayim · חטיבת ביניים','Hativa elyona / technological · חטיבה עליונה','Higher Education · השכלה גבוהה'],{basic:'Yesodi · Primary',voj:'Hativat Beinayim',vos:'Hativa Elyona',higher:'Higher Education'},'Technological / vocational education'),
    IE:P(['Early Learning and Care / ECCE','Primary School','Junior Cycle','Senior Cycle / Further Education & Training','Higher Education'],{basic:'Primary Education',voj:'Junior Cycle',vos:'Senior Cycle / FET',higher:'Higher Education'},'Further Education & Training · FET'),
    MT:P(['Early Years / Kindergarten','Primary School','Middle School','Secondary / Post-secondary / VET','Tertiary Education'],{basic:'Primary Education',voj:'Middle School',vos:'Secondary / Post-secondary',higher:'Tertiary Education'},'Vocational Education & Training'),
    NZ:P(['Early Childhood Education · ECE','Primary / Intermediate School','Secondary · Years 9–10','Senior Secondary · NCEA / Vocational Pathways','Tertiary Education'],{basic:'Primary / Intermediate',voj:'Secondary · Years 9–10',vos:'Senior Secondary',higher:'Tertiary Education'},'Vocational Pathways / Institutes of Technology'),
    AD:P(['Educació infantil','Primera ensenyança','Segona ensenyança','Batxillerat / Formació Professional','Ensenyament superior'],{basic:'Primera ensenyança',voj:'Segona ensenyança',vos:'Batxillerat / FP',higher:'Ensenyament superior'},'Formació Professional'),
    LI:P(['Kindergarten','Primarschule','Sekundarstufe I · Oberschule / Realschule / Gymnasium','Sekundarstufe II / Berufsbildung','Hochschule / Universität'],{basic:'Primarstufe',voj:'Sekundarstufe I',vos:'Sekundarstufe II',higher:'Tertiärstufe'},'Berufsbildung'),
    LU:P(['Éducation précoce / préscolaire','Enseignement fondamental · cycles 2–4','Enseignement secondaire · classes inférieures','Secondaire classique/général / formation professionnelle','Enseignement supérieur'],{basic:'Enseignement fondamental',voj:'Secondaire inférieur',vos:'Secondaire supérieur',higher:'Enseignement supérieur'},'Formation professionnelle'),
    MC:P(['École maternelle','École élémentaire','Collège','Lycée général/technologique/professionnel','Enseignement supérieur'],{basic:'Enseignement primaire',voj:'Collège',vos:'Lycée',higher:'Enseignement supérieur'},'Lycée professionnel'),
    SM:P(["Scuola dell'infanzia",'Scuola elementare','Scuola media inferiore','Scuola secondaria superiore / CFP','Università / istruzione superiore'],{basic:'Scuola elementare',voj:'Scuola media inferiore',vos:'Secondaria superiore',higher:'Istruzione superiore'},'Centro di Formazione Professionale'),
    CY:P(['Prodimotiki / Νηπιαγωγείο','Dimotiko / Δημοτικό','Gymnasio / Γυμνάσιο','Lykeio / Techniki Scholi · Λύκειο / Τεχνική','Panepistimio / Higher Education'],{basic:'Dimotiko',voj:'Gymnasio',vos:'Lykeio / Technical',higher:'Higher Education'},'Technical & Vocational Education'),
    VA:P(['Early schooling follows Italian / international systems','Primary schooling via Italian / international institutions','Lower secondary via Italian / international institutions','Upper secondary via Italian / international institutions','Pontifical / higher education institutions'],{basic:'Schooling via external systems',voj:'Lower Secondary',vos:'Upper Secondary',higher:'Pontifical Higher Education'},'Vocational pathways follow host-system provision')
  };

  const EDUCATION_SOURCE_GLOBAL={name:'UNESCO Institute for Statistics · ISCED',url:'https://uis.unesco.org/en/glossary-term/levels-education',type:'international-framework',verification:'framework-only',official:true};
  const EDUCATION_SOURCES={
    Suriname:{name:'Ministerie van Onderwijs, Wetenschap en Cultuur · Suriname',url:'https://gov.sr/ministeries/ministerie-van-onderwijs-wetenschapen-cultuur/documenten/',type:'national-ministry',verification:'national-official',official:true}
  };
  const sourceBasis=country=>EDUCATION_SOURCES[normalizeCountry(country)]||EDUCATION_SOURCE_GLOBAL;
  const nationalProfile=(country)=>{
    const code=COUNTRY_CODES[country]||worldCodeByName.get(country)||'';
    return NATIONAL_OVERRIDES[code]||NATIONAL_SCHEMES[NATIONAL_SCHEME_CODES[code]]||null;
  };
  const profileSystem=(country,profile)=>{
    if(!profile)return null;
    const d={
      young:'National pre-primary / early-childhood stage.',
      primary:'National primary/basic stage.',
      secondary:'National lower-secondary stage.',
      student:'National upper-secondary, academic or vocational stage.',
      adult:'National tertiary/higher-education stage.'
    };
    const ids=['young','primary','secondary','student','adult'],icons=['🧸','📚','🎒','🎓','🏛️'];
    return {
      label:country,
      groups:profile.groups||null,
      vocational:profile.vocational||'',
      source:sourceBasis(country).name,
      sourceUrl:sourceBasis(country).url,
      sourceType:sourceBasis(country).type,
      sourceVerification:sourceBasis(country).verification,
      stages:ids.map((id,i)=>[id,icons[i],profile.titles[i],d[id]])
    };
  };

  const countryName=c=>{
    const lang=uiLang(),idx=LANG_INDEX[lang];
    if(idx!=null&&COUNTRY_NAMES[c]?.[idx])return COUNTRY_NAMES[c][idx];
    const region=COUNTRY_CODES[c]||worldCodeByName.get(c);
    if(region&&typeof Intl!=='undefined'&&Intl.DisplayNames){
      try{const v=new Intl.DisplayNames([lang],{type:'region'}).of(region);if(v)return v}catch{}
    }
    return c;
  };
  const LEVEL_COPY={
    nl:{young:['Voorschools onderwijs','Vroege ontwikkeling en voorbereiding op het basisonderwijs.'],primary:['Primair onderwijs','Basisvaardigheden voor taal, rekenen en algemeen leren.'],secondary:['Lager secundair onderwijs','De eerste secundaire fase binnen dit landelijke systeem.'],student:['Hoger secundair / beroepsonderwijs','Voorbereiding op vervolgstudie of werk.'],adult:['Hoger onderwijs','Tertiair, beroepsgericht en universitair onderwijs.'],all:'Alle niveaus',upperFilter:'Hoger secundair onderwijs',vocFilter:'Beroeps- / technisch onderwijs',adultFilter:'Volwassenen / professioneel leren',studyField:'Studie/richting (optioneel)',system:'Onderwijssysteem',country:'Land',note:'landgebonden onderwijsniveaus',choose:'KIES JE ONDERWIJSNIVEAU'},
    en:{young:['Early childhood education','Early development and preparation for primary education.'],primary:['Primary education','Foundational literacy, numeracy and general learning.'],secondary:['Lower secondary education','The first secondary stage in this national system.'],student:['Upper secondary / vocational education','Preparation for further study or work.'],adult:['Higher education','Tertiary, professional and university education.'],all:'All levels',upperFilter:'Upper secondary education',vocFilter:'Vocational / technical education',adultFilter:'Adult / professional learning',studyField:'Study / field (optional)',system:'Education system',country:'Country',note:'country-aware school stages',choose:'CHOOSE YOUR EDUCATION STAGE'},
    es:{young:['Educación infantil','Desarrollo temprano y preparación para primaria.'],primary:['Educación primaria','Competencias básicas de lengua, matemáticas y aprendizaje.'],secondary:['Educación secundaria inferior','Primera etapa secundaria del sistema nacional.'],student:['Secundaria superior / formación profesional','Preparación para estudios posteriores o trabajo.'],adult:['Educación superior','Educación terciaria, profesional y universitaria.'],all:'Todos los niveles',upperFilter:'Educación secundaria superior',vocFilter:'Formación profesional / técnica',adultFilter:'Aprendizaje adulto / profesional',studyField:'Estudio / área (opcional)',system:'Sistema educativo',country:'País',note:'niveles educativos adaptados al país',choose:'ELIGE TU NIVEL EDUCATIVO'},
    fr:{young:['Éducation de la petite enfance','Développement précoce et préparation au primaire.'],primary:['Enseignement primaire','Compétences fondamentales en langue, calcul et apprentissage.'],secondary:['Secondaire inférieur','Première étape secondaire du système national.'],student:['Secondaire supérieur / professionnel','Préparation aux études supérieures ou au travail.'],adult:['Enseignement supérieur','Enseignement tertiaire, professionnel et universitaire.'],all:'Tous les niveaux',upperFilter:'Secondaire supérieur',vocFilter:'Enseignement professionnel / technique',adultFilter:'Formation adulte / professionnelle',studyField:'Études / domaine (facultatif)',system:'Système éducatif',country:'Pays',note:'niveaux scolaires adaptés au pays',choose:'CHOISISSEZ VOTRE NIVEAU D’ÉTUDES'},
    de:{young:['Frühkindliche Bildung','Frühe Entwicklung und Vorbereitung auf die Grundschule.'],primary:['Primarbildung','Grundlegende Sprach-, Rechen- und Lernkompetenzen.'],secondary:['Sekundarstufe I','Erste Sekundarstufe im nationalen Bildungssystem.'],student:['Sekundarstufe II / Berufsbildung','Vorbereitung auf Studium oder Arbeit.'],adult:['Hochschulbildung','Tertiäre, berufliche und universitäre Bildung.'],all:'Alle Stufen',upperFilter:'Sekundarstufe II',vocFilter:'Berufs- / technische Bildung',adultFilter:'Erwachsenen- / Berufsbildung',studyField:'Studium / Fach (optional)',system:'Bildungssystem',country:'Land',note:'länderspezifische Bildungsstufen',choose:'WÄHLE DEINE BILDUNGSSTUFE'},
    pt:{young:['Educação infantil','Desenvolvimento inicial e preparação para o ensino primário.'],primary:['Ensino primário','Competências básicas de literacia, numeracia e aprendizagem.'],secondary:['Ensino secundário inferior','Primeira etapa secundária do sistema nacional.'],student:['Ensino secundário superior / profissional','Preparação para estudos posteriores ou trabalho.'],adult:['Ensino superior','Ensino terciário, profissional e universitário.'],all:'Todos os níveis',upperFilter:'Ensino secundário superior',vocFilter:'Ensino profissional / técnico',adultFilter:'Aprendizagem adulta / profissional',studyField:'Estudo / área (opcional)',system:'Sistema educativo',country:'País',note:'níveis de ensino adaptados ao país',choose:'ESCOLHA O SEU NÍVEL DE ENSINO'},
    it:{young:['Educazione della prima infanzia','Sviluppo iniziale e preparazione alla primaria.'],primary:['Istruzione primaria','Competenze fondamentali di lingua, matematica e apprendimento.'],secondary:['Secondaria inferiore','Prima fase secondaria del sistema nazionale.'],student:['Secondaria superiore / professionale','Preparazione a studi successivi o lavoro.'],adult:['Istruzione superiore','Istruzione terziaria, professionale e universitaria.'],all:'Tutti i livelli',upperFilter:'Secondaria superiore',vocFilter:'Istruzione professionale / tecnica',adultFilter:'Apprendimento adulto / professionale',studyField:'Studio / ambito (opzionale)',system:'Sistema educativo',country:'Paese',note:'livelli scolastici adattati al paese',choose:'SCEGLI IL TUO LIVELLO DI ISTRUZIONE'}
  };
  const GROUP_COPY={
    nl:{basic:'Basisonderwijs',voj:'Voortgezet Onderwijs Junioren (VOJ)',vos:'Voortgezet Onderwijs Senioren (VOS)',higher:'Hoger Onderwijs'},
    en:{basic:'Primary Education',voj:'Lower Secondary (VOJ)',vos:'Upper Secondary (VOS)',higher:'Higher Education'},
    es:{basic:'Educación Primaria',voj:'Secundaria Inferior (VOJ)',vos:'Secundaria Superior (VOS)',higher:'Educación Superior'},
    fr:{basic:'Enseignement primaire',voj:'Secondaire inférieur (VOJ)',vos:'Secondaire supérieur (VOS)',higher:'Enseignement supérieur'},
    de:{basic:'Primarbildung',voj:'Sekundarstufe I (VOJ)',vos:'Sekundarstufe II (VOS)',higher:'Hochschulbildung'},
    pt:{basic:'Ensino primário',voj:'Ensino secundário inferior (VOJ)',vos:'Ensino secundário superior (VOS)',higher:'Ensino superior'},
    it:{basic:'Istruzione primaria',voj:'Secondaria inferiore (VOJ)',vos:'Secondaria superiore (VOS)',higher:'Istruzione superiore'}
  };
  const UNIVERSAL_GROUP_COPY={
    nl:{basic:'Primair Onderwijs',voj:'Lager Secundair',vos:'Hoger Secundair',higher:'Hoger Onderwijs'},
    en:{basic:'Primary Education',voj:'Lower Secondary',vos:'Upper Secondary',higher:'Higher Education'},
    es:{basic:'Educación Primaria',voj:'Secundaria Inferior',vos:'Secundaria Superior',higher:'Educación Superior'},
    fr:{basic:'Enseignement primaire',voj:'Secondaire inférieur',vos:'Secondaire supérieur',higher:'Enseignement supérieur'},
    de:{basic:'Primarbildung',voj:'Sekundarstufe I',vos:'Sekundarstufe II',higher:'Hochschulbildung'},
    pt:{basic:'Ensino primário',voj:'Ensino secundário inferior',vos:'Ensino secundário superior',higher:'Ensino superior'},
    it:{basic:'Istruzione primaria',voj:'Secondaria inferiore',vos:'Secondaria superiore',higher:'Istruzione superiore'}
  };
  const groupCopy=()=>{if(currentCountry()==='Suriname')return GROUP_COPY[uiLang()]||GROUP_COPY.en;const national=system(currentCountry()).groups;if(national)return national;return UNIVERSAL_GROUP_COPY[uiLang()]||UNIVERSAL_GROUP_COPY.en};
  const OFFICIAL={
    Suriname:{primary:'GLO',secondary:'VOJ · MULO/LBO',student:'VOS · HAVO · NATIN/IMEAO',adult:'AdeKUS'},
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
  const SURINAME_TRACKS={
    kindergarten:{title:'Kleuterschool / Kleuteronderwijs',description:'Leerjaar 1–2 · 4–6 jaar',group:'Basisonderwijs',ai:'young',schoolLevel:'kindergarten'},
    primary:{title:'Lagere school / Basisschool',description:'Leerjaar 3–8 · 6–12 jaar',group:'Basisonderwijs',ai:'primary',schoolLevel:'primary'},
    mulo:{title:'MULO',description:'12–16 jaar',group:'Voortgezet Onderwijs Junioren (VOJ)',ai:'secondary',schoolLevel:'mulo'},
    lbo:{title:'LBO',description:'12–16 jaar',group:'Voortgezet Onderwijs Junioren (VOJ)',ai:'secondary',schoolLevel:'lbo'},
    havo:{title:'HAVO',description:'16–18 jaar',group:'Voortgezet Onderwijs Senioren (VOS)',ai:'student',schoolLevel:'havo'},
    vwo:{title:'VWO',description:'16–19 jaar',group:'Voortgezet Onderwijs Senioren (VOS)',ai:'student',schoolLevel:'vwo'},
    mbo:{title:'MBO',description:'NATIN, IMEAO, Kweekschool · 16–20+ jaar',group:'Voortgezet Onderwijs Senioren (VOS)',ai:'student',schoolLevel:'mbo'},
    hbo:{title:'HBO',description:'18/19+ jaar',group:'Hoger Onderwijs',ai:'adult',schoolLevel:'hbo'},
    wo:{title:'WO / Universiteit',description:'AdeKUS · 19+ jaar',group:'Hoger Onderwijs',ai:'adult',schoolLevel:'wo'}
  };
  const localizedStage=(id,country=currentCountry())=>{const ui=LEVEL_COPY[uiLang()]||LEVEL_COPY.en,row=ui[id]||['',''],st=system(country).stages.find(x=>x[0]===id);return {title:st?.[2]||row[0],description:row[1],national:true}};

  function normalizeCountry(value){
    const x=clean(value);if(!x)return '';
    const byCode=/^[a-z]{2}$/i.test(x)?countryFromCode(x):'';if(byCode)return byCode;
    const low=x.toLowerCase();
    const localized=Object.entries(COUNTRY_NAMES).find(([,names])=>names.some(n=>clean(n).toLowerCase()===low))?.[0];
    let worldLocalized='';
    if(!localized&&typeof Intl!=='undefined'&&Intl.DisplayNames){
      try{
        const dn=new Intl.DisplayNames([uiLang()],{type:'region'});
        const code=WORLD_CODES.find(code=>clean(dn.of(code)).toLowerCase()===low);
        if(code)worldLocalized=WORLD_COUNTRIES.find(x=>x.code===code)?.name||'';
      }catch{}
    }
    return aliases[low]||countryList.find(c=>c.toLowerCase()===low)||localized||worldLocalized||x;
  }
  function currentCountry(){return normalizeCountry(localStorage.getItem(KEY)||'Suriname')||'Suriname'}
  function system(country=currentCountry()){
    const n=normalizeCountry(country);
    if(n==='Suriname')return {...SYSTEMS.Suriname,source:sourceBasis(n).name,sourceUrl:sourceBasis(n).url,sourceType:sourceBasis(n).type,sourceVerification:sourceBasis(n).verification};
    const code=COUNTRY_CODES[n]||worldCodeByName.get(n)||'',override=NATIONAL_OVERRIDES[code]||null,explicit=SYSTEMS[n],prof=override||nationalProfile(n),generated=profileSystem(n,prof);
    if(override&&generated)return generated;
    if(generated&&explicit)return {...explicit,groups:generated.groups,vocational:generated.vocational,source:generated.source,sourceUrl:generated.sourceUrl};
    if(generated)return generated;
    if(explicit)return {...explicit,source:sourceBasis(n).name,sourceUrl:sourceBasis(n).url,sourceType:sourceBasis(n).type,sourceVerification:sourceBasis(n).verification};
    return {...GENERIC,label:n||GENERIC.label,source:sourceBasis(n).name,sourceUrl:sourceBasis(n).url,sourceType:sourceBasis(n).type,sourceVerification:sourceBasis(n).verification};
  }
  function validateProfiles(){
    const issues=[];
    for(const country of countryList){
      const sys=system(country),stages=Array.isArray(sys?.stages)?sys.stages:[],ids=stages.map(x=>x?.[0]);
      if(stages.length!==5)issues.push({country,code:'stage_count',count:stages.length});
      if(new Set(ids).size!==5)issues.push({country,code:'duplicate_stage_ids'});
      for(const id of ['young','primary','secondary','student','adult']){
        const row=stages.find(x=>x?.[0]===id);
        if(!row||!clean(row?.[2]))issues.push({country,code:'missing_stage',stage:id});
      }
      if(!/^https:\/\//i.test(String(sys?.sourceUrl||'')))issues.push({country,code:'missing_source_url'});
      if(!['national-official','framework-only'].includes(String(sys?.sourceVerification||'')))issues.push({country,code:'missing_source_verification'});
    }
    return {ok:issues.length===0,total:countryList.length,issues};
  }
  function stage(id,country=currentCountry()){return system(country).stages.find(x=>x[0]===id)||GENERIC.stages.find(x=>x[0]===id)}
  function setCountry(value,source='ui'){
    const country=normalizeCountry(value);if(!country)return currentCountry();
    const previous=currentCountry();
    localStorage.setItem(KEY,country);
    if(country!=='Suriname'){
      localStorage.removeItem('scholark_education_track');
      localStorage.removeItem('scholark_vwo_selected');
    }
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
      const before=[...side.querySelectorAll('.v51-section')].find(x=>clean(x.textContent).toUpperCase()==='COMING SOON');before?.insertAdjacentElement('beforebegin',box)||side.appendChild(box);
      $('select',box).addEventListener('change',e=>setCountry(e.target.value,'sidebar'));
    }
    const selected=currentCountry(),sel=$('select',box),ui=LEVEL_COPY[uiLang()]||LEVEL_COPY.en;
    const sm=$('small',box),sp=$('span',box);if(sm)sm.textContent=ui.country.toUpperCase();if(sp)sp.textContent=ui.note+'.';
    if(sel)syncSelectOptions(sel,countryOptions(selected),selected,'country|sidebar|'+uiLang()+'|'+selected,ui.country)
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
    if(sel)syncSelectOptions(sel,countryOptions(c),c,'country|dashboard|'+uiLang()+'|'+c,ui.country)
    const title=$('.v96-country-copy b',wrap),label=$('.v96-country-label',wrap),note=$('#v96-system-note',wrap);
    if(title)title.textContent=ui.system;if(label)label.textContent=ui.country;if(note)note.textContent=countryName(c)+' · '+ui.note;
  }
  function applyLevels(){
    const c=currentCountry(),sys=system(c),ui=LEVEL_COPY[uiLang()]||LEVEL_COPY.en;
    $$('.v51-level[data-level]').forEach(btn=>{
      const id=btn.dataset.level,icon=btn.querySelector(':scope > span'),title=btn.querySelector('b'),desc=btn.querySelector('small');
      btn.dataset.v96I18nOwned='1';
      if(c==='Suriname'&&SURINAME_TRACKS[id]){
        const row=SURINAME_TRACKS[id];
        if(title)title.textContent=row.title;if(desc)desc.textContent=row.description;
        btn.dataset.countrySystem='Suriname';btn.dataset.educationGroup=row.group;return;
      }
      const st=sys.stages.find(x=>x[0]===id);if(!st)return;
      const lc=localizedStage(id,c);
      if(icon)icon.textContent=st[1];if(title)title.textContent=lc.title;if(desc)desc.textContent=lc.description;
      btn.dataset.countrySystem=sys.label;btn.dataset.educationGroup=id==='young'||id==='primary'?'basic':id==='secondary'?'voj':id==='student'?'vos':'higher';
    });
    const label=$('#v51-main [data-v51-page="dashboard"] .v51-level-label');
    if(label){label.dataset.v96I18nOwned='1';label.textContent=ui.choose+' · '+countryName(c).toUpperCase()}
  }
  function applyGroupLabels(){
    const copy=groupCopy();
    document.querySelectorAll('.v51-level-cluster[data-v51-group]').forEach(cluster=>{
      const id=cluster.dataset.v51Group,label=$('.v51-level-group',cluster);
      cluster.dataset.schI18nOwned='1';
      if(label&&copy[id]){label.dataset.schI18nOwned='1';label.textContent=copy[id]}
    });
  }
  function applySchoolLevels(){
    const sel=$('#v50-level');if(!sel)return;
    const c=currentCountry(),ui=LEVEL_COPY[uiLang()]||LEVEL_COPY.en,current=sel.value||'all';
    sel.dataset.v96I18nOwned='1';sel.dataset.schI18nOwned='1';
    if(c==='Suriname'){
      const gc=groupCopy();
      const groups=[
        [gc.basic,['kindergarten','primary']],
        [gc.voj,['mulo','lbo']],
        [gc.vos,['havo','vwo','mbo']],
        [gc.higher,['hbo','wo']]
      ];
      const value=SURINAME_TRACKS[current]?current:'all';
      const html='<option value="all">'+ui.all+'</option>'+groups.map(([label,ids])=>'<optgroup label="'+label+'">'+ids.map(id=>{const x=SURINAME_TRACKS[id];return '<option value="'+id+'">'+x.title+' · '+x.description+'</option>'}).join('')+'</optgroup>').join('');
      syncSelectOptions(sel,html,value,'school-level|'+uiLang()+'|'+c+'|'+value);
    }else{
      const supportsVwo=c==='Netherlands',sys=system(c);
      const rows=[
        ['all',ui.all],
        ['primary',localizedStage('primary',c).title],
        ['secondary',localizedStage('secondary',c).title],
        ['upper_secondary',localizedStage('student',c).title],
        ...(supportsVwo?[['vwo','VWO']]:[]),
        ['vocational',sys.vocational||ui.vocFilter],
        ['higher',localizedStage('adult',c).title],
        ['adult',ui.adultFilter]
      ];
      const value=rows.some(([value])=>value===current)?current:'all';
      const html=rows.map(([value,label])=>'<option value="'+value+'">'+label+'</option>').join('');
      syncSelectOptions(sel,html,value,'school-level|'+uiLang()+'|'+c+'|'+value);
    }
    const study=$('#v50-study');
    if(study){study.dataset.v96I18nOwned='1';study.dataset.schI18nOwned='1';study.placeholder=ui.studyField}
    window.__SCHOLARK_V50_SCHOOLS__?.syncStudyField?.();
  }
  function seedInputs(){
    const c=currentCountry();
    for(const el of [$('#v50-country'),$('#v62-country'),$('#v52-cur-country')]){
      if(!el||document.activeElement===el||el.dataset.schSelectInteracting==='1')continue;
      if(clean(el.value)!==c)el.value=c;
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
    ensureSidebarCountry();ensureDashboardSelector();applyLevels();applyGroupLabels();applySchoolLevels();seedInputs();
    const lang=uiLang();
    if(!STATIC_UI_LANGS.has(lang))setTimeout(()=>window.__SCHOLARK_I18N__?.apply?.(document),0);
  }

  const style=document.createElement('style');style.id='scholark-v96-country-style';style.textContent=`
    #v96-side-country{margin:9px 8px 0;padding:10px;border-radius:13px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08);color:#fff}#v96-side-country small{display:block;font:900 6.8px Inter;letter-spacing:.13em;color:#8f8b98}#v96-side-country select{width:100%;margin-top:7px;border:1px solid rgba(255,255,255,.12);background:#22252e;color:#fff;border-radius:9px;padding:8px;font:800 8px Inter;outline:0}#v96-side-country option{background:#fff;color:#17191f}#v96-side-country span{display:block;margin-top:6px;font:650 7px/1.35 Inter;color:#aaa6b2}
    #v96-country-context{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 0 14px;padding:12px 14px;border:1px solid rgba(23,25,31,.09);border-radius:16px;background:#fff;box-shadow:0 10px 28px rgba(31,27,63,.04)}
    #v96-country-context .v96-country-copy b{display:block;font:900 10px Inter;color:#17191f}#v96-country-context .v96-country-copy span{display:block;margin-top:4px;font:650 8px/1.35 Inter;color:#77717e}
    #v96-country-context label{display:flex;align-items:center;gap:8px;font:800 8px Inter;color:#6d6873}#v96-country{min-width:180px;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:11px;padding:9px 28px 9px 10px;font:800 9px Inter;outline:0}
    @media(max-width:720px){#v96-country-context{align-items:stretch;flex-direction:column}#v96-country-context label{justify-content:space-between}#v96-country{min-width:0;flex:1}}
  `;document.head.appendChild(style);

  observeCountryInputs();
  let repairTimer=0;
  const repairObserver=new MutationObserver(mutations=>{
    const touched=mutations.some(m=>[...m.addedNodes,...m.removedNodes].some(n=>n?.nodeType===1&&(n.id==='v51-sidebar'||n.matches?.('#v51-sidebar,.v51-section')||n.querySelector?.('#v51-sidebar,.v51-section'))));
    if(!touched)return;
    clearTimeout(repairTimer);
    repairTimer=setTimeout(()=>{if(document.body.classList.contains('v51-workspace'))scheduleApply(30)},80);
  });
  repairObserver.observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('hashchange',()=>scheduleApply(90));
  addEventListener('scholark-runtime-ready',()=>scheduleApply(70));
  addEventListener('scholark-language-change',()=>scheduleApply(100));
  addEventListener('scholark-language-applied',()=>scheduleApply(120));
  addEventListener('scholark-language-ready',()=>scheduleApply(140));
  addEventListener('scholark-language-complete',()=>scheduleApply(160));
  [100,500].forEach(ms=>setTimeout(()=>scheduleApply(0),ms));

  window.__SCHOLARK_COUNTRY__={current:currentCountry,set:setCountry,system,stage,normalize:normalizeCountry,fromCode:countryFromCode,displayName:countryName,localizedStage,language:uiLang,systems:SYSTEMS,apply,surinameTracks:SURINAME_TRACKS,schoolLevelCopy:()=>LEVEL_COPY[uiLang()]||LEVEL_COPY.en,staticUiLanguages:[...STATIC_UI_LANGS],countries:[...countryList],countryCount:countryList.length,sourceBasis,validateProfiles,countryProfileCoverage:()=>({total:countryList.length,covered:countryList.filter(x=>x==='Suriname'||!!nationalProfile(x)||!!SYSTEMS[x]).length,missing:countryList.filter(x=>x!=='Suriname'&&!nationalProfile(x)&&!SYSTEMS[x])}),global:true};
})();
