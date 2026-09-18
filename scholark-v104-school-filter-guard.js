(function scholarkSchoolFilterGuard(){
  if(window.__SCHOLARK_V104_SCHOOL_FILTER_GUARD__)return;
  window.__SCHOLARK_V104_SCHOOL_FILTER_GUARD__=true;

  const VERSION='20260918-school-filter-v4';
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const key=v=>clean(v).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const COUNTRY_CODES={suriname:'SR',netherlands:'NL',nederland:'NL','united states':'US',usa:'US','united kingdom':'GB',uk:'GB',germany:'DE',france:'FR',spain:'ES',portugal:'PT',italy:'IT',brazil:'BR',canada:'CA',australia:'AU',india:'IN','south africa':'ZA',guyana:'GY','trinidad & tobago':'TT',jamaica:'JM',belgium:'BE'};
  const aliases={'nederland':'netherlands','holland':'netherlands','verenigde staten':'united states','amerika':'united states','england':'united kingdom','duitsland':'germany','frankrijk':'france','spanje':'spain','italie':'italy','italië':'italy','brazilie':'brazil','brazilië':'brazil','australie':'australia','australië':'australia','zuid-afrika':'south africa','belgie':'belgium','belgië':'belgium'};
  const normalizeCountry=v=>{
    const via=window.__SCHOLARK_COUNTRY__?.normalize?.(clean(v));
    if(via)return key(via);
    const k=key(v);return key(aliases[k]||k);
  };
  const countryCode=v=>COUNTRY_CODES[normalizeCountry(v)]||COUNTRY_CODES[key(v)]||'';

  function classify(row={}){
    const text=key([row.name,row.school_name,row.institution_type,row.level,row.education_level,row.school_level,row.description,row.programs,row.study_types].filter(Boolean).join(' ')),out=new Set();
    if(/preschool|pre school|nursery|kindergarten|kleuterschool|kleuteronderwijs|kleuter|peuter|voorschool|early childhood/.test(text)){out.add('early');out.add('kindergarten')}
    if(/primary|elementary|basisschool|lagere school|\bglo\b/.test(text))out.add('primary');
    if(/\bmulo\b/.test(text)){out.add('lower_secondary');out.add('mulo')}
    if(/\blbo\b/.test(text)){out.add('lower_secondary');out.add('vocational');out.add('lbo')}
    if(/lower secondary|junior secondary|middle school|junior high|\bvoj\b/.test(text))out.add('lower_secondary');
    if(/\bhavo\b/.test(text)){out.add('upper_secondary');out.add('havo')}
    if(/\bvwo\b|atheneum|gymnasium/.test(text)){out.add('upper_secondary');out.add('vwo')}
    if(/\bnatin\b|\bimeao\b|kweekschool|\bmbo\b/.test(text)){out.add('upper_secondary');out.add('vocational');out.add('mbo')}
    if(/upper secondary|senior secondary|high school|sixth form|\bvos\b/.test(text))out.add('upper_secondary');
    if(/vocational|technical|trade school|beroeps|technisch|\bamto\b|tvet/.test(text))out.add('vocational');
    if(/\bhbo\b|hogeschool|university of applied sciences/.test(text)){out.add('higher');out.add('hbo')}
    if(/\badekus\b|anton de kom|university|universiteit|faculty|faculteit/.test(text)){out.add('higher');out.add('wo')}
    if(/higher education|tertiary|college/.test(text))out.add('higher');
    if(/adult education|adult learning|continuing education|professional learning/.test(text))out.add('adult');
    return out;
  }
  function levelMatches(row,wanted){
    wanted=clean(wanted).toLowerCase();if(!wanted||wanted==='all')return true;
    const levels=classify(row);if(!levels.size)return true;
    if(wanted==='secondary'||wanted==='lower_secondary')return levels.has('lower_secondary');
    if(wanted==='upper_secondary')return levels.has('upper_secondary');
    if(wanted==='vocational')return levels.has('vocational');
    if(wanted==='higher')return levels.has('higher');
    if(wanted==='kindergarten')return levels.has('kindergarten')||levels.has('early');
    if(['mulo','lbo','havo','vwo','mbo','hbo','wo'].includes(wanted))return levels.has(wanted);
    return levels.has(wanted);
  }
  function rowMatches(row,payload){
    const requestedCountry=clean(payload?.p_country),requestedCity=clean(payload?.p_city),wantedLevel=clean(payload?.p_level);
    if(requestedCountry){
      const rowCountry=clean(row?.country||row?.country_name),rowCode=clean(row?.country_code||row?.countryCode).toUpperCase(),wantCode=countryCode(requestedCountry);
      if(rowCountry&&normalizeCountry(rowCountry)!==normalizeCountry(requestedCountry))return false;
      if(rowCode&&wantCode&&rowCode!==wantCode)return false;
    }
    if(requestedCity){
      const target=key(requestedCity),places=[row?.city,row?.town,row?.district,row?.location].map(key).filter(Boolean);
      if(places.length&&!places.some(p=>p===target||p.includes(target)||target.includes(p)))return false;
    }
    return levelMatches(row,wantedLevel);
  }

  function patchCloud(){
    const cloud=window.__SCHOLARK_V72_CLOUD__;
    if(!cloud?.publicRequest||cloud.__v104SchoolStrict)return false;
    const original=cloud.publicRequest.bind(cloud);
    cloud.publicRequest=async function(path,opts={}){
      const response=await original(path,opts);
      if(!String(path||'').includes('/rest/v1/rpc/search_schools'))return response;
      let payload={};try{payload=JSON.parse(opts?.body||'{}')}catch{}
      let rows;try{rows=await response.clone().json()}catch{return response}
      if(!Array.isArray(rows))return response;
      const filtered=rows.filter(row=>rowMatches(row,payload));
      const headers=new Headers(response.headers);headers.delete('content-length');headers.set('content-type','application/json; charset=utf-8');headers.set('x-scholark-school-filter','strict-country-place-level-v1');
      return new Response(JSON.stringify(filtered),{status:response.status,statusText:response.statusText,headers});
    };
    cloud.__v104SchoolStrict=true;
    return true;
  }

  function patchLevelOptions(){
    const sel=document.querySelector('#v50-level');if(!sel)return false;
    // Country education is the single owner of visible level options.
    // Do not append generic options here because that can corrupt Suriname's exact taxonomy.
    window.__SCHOLARK_COUNTRY__?.apply?.();
    sel.dataset.v104StrictLevels=VERSION;
    return true;
  }
  function apply(){return {cloud:patchCloud(),levels:patchLevelOptions()}}
  const schoolRoute=()=>String(location.hash||'').toLowerCase().includes('schools');
  let retryTimer=null,retryCount=0;
  function kick(delay=0,reset=true){
    if(reset)retryCount=0;
    clearTimeout(retryTimer);
    retryTimer=setTimeout(function run(){
      const state=apply();
      if(schoolRoute()&&!state.levels&&retryCount++<12)retryTimer=setTimeout(run,180+retryCount*35);
    },delay);
  }

  // Event-driven only. The previous document-wide MutationObserver rewrote option
  // text from inside its own callback and could create a self-sustaining main-thread loop.
  ['hashchange','scholark-runtime-ready','scholark-country-change','scholark-language-applied','scholark-language-ready','scholark-language-complete'].forEach(ev=>addEventListener(ev,()=>kick(25,true)));
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-v51-tool="schools"],[data-future="schools"]'))kick(0,true)},true);
  [40,180,600].forEach(ms=>setTimeout(()=>kick(0,false),ms));
  window.__SCHOLARK_SCHOOL_FILTER__={version:VERSION,apply:()=>kick(0,true),documentWideObserver:false,maxRouteRetries:12};
})();