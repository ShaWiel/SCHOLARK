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

  function normalizeCountry(value){
    const x=clean(value);if(!x)return '';
    return aliases[x.toLowerCase()]||countryList.find(c=>c.toLowerCase()===x.toLowerCase())||x;
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
    return known.map(c=>'<option value="'+c.replace(/"/g,'&quot;')+'"'+(c===selected?' selected':'')+'>'+c+'</option>').join('');
  }
  function ensureDashboardSelector(){
    const host=$('#v51-main [data-v51-page="dashboard"] .v51-levels')?.parentElement;
    if(!host)return;
    let wrap=$('#v96-country-context',host);
    if(!wrap){
      wrap=document.createElement('div');wrap.id='v96-country-context';
      wrap.innerHTML='<div class="v96-country-copy"><b>Education system</b><span id="v96-system-note"></span></div><label>Country<select id="v96-country"></select></label>';
      const levels=$('.v51-levels',host);levels?.insertAdjacentElement('beforebegin',wrap);
      $('#v96-country',wrap).addEventListener('change',e=>setCountry(e.target.value,'dashboard'));
    }
    const c=currentCountry(),sel=$('#v96-country',wrap);
    if(sel){sel.innerHTML=countryOptions(c);sel.value=c}
    const note=$('#v96-system-note',wrap);if(note)note.textContent=system(c).label+' · country-aware school stages';
  }
  function applyLevels(){
    const c=currentCountry(),sys=system(c);
    $$('.v51-level[data-level]').forEach(btn=>{
      const st=sys.stages.find(x=>x[0]===btn.dataset.level);if(!st)return;
      const icon=btn.querySelector(':scope > span'),title=btn.querySelector('b'),desc=btn.querySelector('small');
      if(icon)icon.textContent=st[1];if(title)title.textContent=st[2];if(desc)desc.textContent=st[3];
      btn.dataset.countrySystem=sys.label;
    });
    const label=$('#v51-main [data-v51-page="dashboard"] .v51-level-label');
    if(label)label.textContent='CHOOSE YOUR EDUCATION STAGE · '+sys.label.toUpperCase();
  }
  function applySchoolLevels(){
    const sel=$('#v50-level');if(!sel)return;
    const stages=system(currentCountry()).stages;
    const labels={all:'All levels',early:stages[0]?.[2]||'Early childhood',primary:stages[1]?.[2]||'Primary',secondary:stages[2]?.[2]||'Lower secondary',vocational:stages[3]?.[2]||'Upper secondary / vocational',higher:stages[4]?.[2]||'Higher education',adult:'Adult / professional learning'};
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
    ensureDashboardSelector();applyLevels();applySchoolLevels();seedInputs();
  }

  const style=document.createElement('style');style.id='scholark-v96-country-style';style.textContent=`
    #v96-country-context{display:flex;align-items:center;justify-content:space-between;gap:14px;margin:0 0 14px;padding:12px 14px;border:1px solid rgba(23,25,31,.09);border-radius:16px;background:#fff;box-shadow:0 10px 28px rgba(31,27,63,.04)}
    #v96-country-context .v96-country-copy b{display:block;font:900 10px Inter;color:#17191f}#v96-country-context .v96-country-copy span{display:block;margin-top:4px;font:650 8px/1.35 Inter;color:#77717e}
    #v96-country-context label{display:flex;align-items:center;gap:8px;font:800 8px Inter;color:#6d6873}#v96-country{min-width:180px;border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:11px;padding:9px 28px 9px 10px;font:800 9px Inter;outline:0}
    @media(max-width:720px){#v96-country-context{align-items:stretch;flex-direction:column}#v96-country-context label{justify-content:space-between}#v96-country{min-width:0;flex:1}}
  `;document.head.appendChild(style);

  observeCountryInputs();
  addEventListener('hashchange',()=>{setTimeout(apply,60);setTimeout(apply,260)});
  addEventListener('scholark-runtime-ready',()=>setTimeout(apply,60));
  addEventListener('scholark-language-ready',()=>setTimeout(apply,80));
  [80,260,700].forEach(ms=>setTimeout(apply,ms));

  window.__SCHOLARK_COUNTRY__={current:currentCountry,set:setCountry,system,stage,normalize:normalizeCountry,systems:SYSTEMS,apply};
})();
