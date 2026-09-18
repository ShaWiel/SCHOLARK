(function scholarkSchoolVwo(){
  if(window.__SCHOLARK_V105_SCHOOL_VWO__)return;
  window.__SCHOLARK_V105_SCHOOL_VWO__=true;

  const VERSION='20260918-school-vwo-v6';
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const key=v=>clean(v).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const VWO_RX=/\bvwo\b|atheneum|gymnasium|voorbereidend wetenschappelijk|pre[- ]?university|preuniversit/i;
  const HOGENDOORN_NAME='Arthur Alex Hogendoorn Atheneum';
  const HOGENDOORN={
    name:HOGENDOORN_NAME,
    school_name:HOGENDOORN_NAME,
    institution_type:'Private VWO / Atheneum',
    description:'Paramaribo · Particuliere VWO-school · Atheneum',
    country:'Suriname',country_code:'SR',city:'Paramaribo',district:'Paramaribo',
    lat:null,lon:null,distance:null,website:'',phone:'',email:'',
    source:'SCHOLARK verified public VWO directory',
    sourceUrl:'https://sun.sr/nieuws/lokaal/currie-resultaten-vwo-en-havo-examens-beter-dan-vorig-jaar?id=44345',
    level:'vwo',education_level:'vwo',levels:['upper_secondary','vwo'],levelDetail:'upper_secondary,vwo',
    tags:{name:HOGENDOORN_NAME,district:'Paramaribo',city:'Paramaribo',sheet:'Private VWO','addr:country':'SR'},
    verifiedPublic:true
  };
  const isVwoRow=row=>VWO_RX.test([
    row?.name,row?.school_name,row?.institution_type,row?.level,row?.education_level,row?.school_level,
    row?.description,row?.programs,row?.study_types,row?.tags?.name,row?.tags?.description,row?.tags?.sheet
  ].filter(Boolean).join(' '));
  const shouldIncludeHogendoorn=(country,city)=>key(country)==='suriname'&&(!key(city)||key(city)==='paramaribo'||key(city).includes('paramaribo'));
  const hasHogendoorn=rows=>(rows||[]).some(row=>/hogendoorn.*atheneum|arthur.*hogendoorn/i.test(clean(row?.name||row?.school_name)));
  const currentCountry=()=>window.__SCHOLARK_COUNTRY__?.current?.()||localStorage.getItem('scholark_country')||'Suriname';
  const isSuriname=()=>['suriname','sr'].includes(key(currentCountry()));

  const VWO_DESCRIPTION={
    nl:'Voorbereidend wetenschappelijk onderwijs.',
    en:'Pre-university secondary education.',
    es:'Educación secundaria preuniversitaria.',
    fr:'Enseignement secondaire préuniversitaire.',
    de:'Voruniversitäre Sekundarbildung.',
    pt:'Ensino secundário pré-universitário.',
    it:'Istruzione secondaria pre-universitaria.'
  };
  const uiLang=()=>localStorage.getItem('scholark_ui_language')||'en';

  let scheduled=false;
  let dashboardObserver=null;
  let dashboardHost=null;
  let resultsObserver=null;
  let resultsHost=null;

  function scheduleApply(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;apply()});
  }

  function patchSelector(){
    const sel=document.querySelector('#v50-level');if(!sel)return false;
    const allowed=['suriname','netherlands'].includes(key(currentCountry()));
    let opt=sel.querySelector('option[value="vwo"]');
    if(!allowed){opt?.remove();return true}
    if(!opt){
      opt=document.createElement('option');opt.value='vwo';
      const upper=sel.querySelector('option[value="upper_secondary"]');
      if(upper)upper.insertAdjacentElement('afterend',opt);else sel.appendChild(opt);
      queueMicrotask(()=>window.__SCHOLARK_COUNTRY__?.apply?.());
    }
    if(opt.textContent!=='VWO')opt.textContent='VWO';
    if(sel.dataset.v105Vwo!==VERSION)sel.dataset.v105Vwo=VERSION;
    return true;
  }

  function patchServerFetch(){
    if(window.__SCHOLARK_V105_VWO_FETCH__)return true;
    const original=window.fetch.bind(window);
    window.fetch=async function(input,opts={}){
      const url=typeof input==='string'?input:clean(input?.url);
      if(!String(url).includes('/api/schools/search'))return original(input,opts);
      let payload={};try{payload=JSON.parse(opts?.body||'{}')}catch{}
      if(clean(payload?.level).toLowerCase()!=='vwo')return original(input,opts);
      const response=await original(input,opts);
      let data;try{data=await response.clone().json()}catch{return response}
      if(!response.ok||!data?.ok||!Array.isArray(data.schools))return response;
      const schools=data.schools.filter(isVwoRow);
      if(shouldIncludeHogendoorn(payload.country,payload.city)&&!hasHogendoorn(schools))schools.push({...HOGENDOORN});
      data.schools=schools;data.count=schools.length;data.taxonomy={...(data.taxonomy||{}),vwo:'pre_university_vwo_atheneum_gymnasium'};
      const headers=new Headers(response.headers);headers.delete('content-length');headers.set('content-type','application/json; charset=utf-8');headers.set('x-scholark-school-vwo',VERSION);
      return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers});
    };
    window.__SCHOLARK_V105_VWO_FETCH__=true;
    return true;
  }

  function patchCurated(){
    const cloud=window.__SCHOLARK_V72_CLOUD__;
    if(!cloud?.publicRequest||!cloud.__v104SchoolStrict||cloud.__v105Vwo)return false;
    const original=cloud.publicRequest.bind(cloud);
    cloud.publicRequest=async function(path,opts={}){
      if(!String(path||'').includes('/rest/v1/rpc/search_schools'))return original(path,opts);
      let payload={};try{payload=JSON.parse(opts?.body||'{}')}catch{}
      if(clean(payload?.p_level).toLowerCase()!=='vwo')return original(path,opts);
      const rewritten={...payload,p_level:'all'};
      const response=await original(path,{...opts,body:JSON.stringify(rewritten)});
      let rows;try{rows=await response.clone().json()}catch{return response}
      if(!Array.isArray(rows))return response;
      const filtered=rows.filter(isVwoRow);
      if(shouldIncludeHogendoorn(payload.p_country,payload.p_city)&&!hasHogendoorn(filtered))filtered.push({...HOGENDOORN});
      const headers=new Headers(response.headers);headers.delete('content-length');headers.set('content-type','application/json; charset=utf-8');headers.set('x-scholark-school-vwo',VERSION);
      return new Response(JSON.stringify(filtered),{status:response.status,statusText:response.statusText,headers});
    };
    cloud.__v105Vwo=true;
    return true;
  }

  function setVwoActive(button){
    const host=button?.closest('.v51-levels');if(!host)return;
    host.querySelectorAll('.v51-level').forEach(x=>x.classList.toggle('active',x===button));
  }

  function separateDashboardVwoLabel(){
    if(!isSuriname())return;
    const student=document.querySelector('#v51-main [data-v51-page="dashboard"] .v51-level[data-level="student"] b');
    if(!student)return;
    const next=clean(student.textContent)
      .replace(/\s*\/\s*VWO\b/gi,'')
      .replace(/\bVWO\s*\/\s*/gi,'')
      .replace(/\s*·\s*VWO\b/gi,'');
    if(next&&next!==student.textContent)student.textContent=next;
  }

  function ensureDashboardVwo(){
    const host=document.querySelector('#v51-main [data-v51-page="dashboard"] .v51-levels');
    if(!host)return false;
    if(!isSuriname()){
      host.querySelector('[data-v105-vwo-stage="1"]')?.remove();
      return true;
    }
    let button=host.querySelector('.v51-level[data-level="vwo"],[data-v105-vwo-stage="1"]');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.className='v51-level';
      button.dataset.level='vwo';
      button.dataset.v105VwoStage='1';
      button.innerHTML='<span>🎓</span><b>VWO</b><small></small>';
      const student=host.querySelector('.v51-level[data-level="student"]');
      if(student)student.insertAdjacentElement('afterend',button);else host.appendChild(button);
      button.addEventListener('click',()=>{
        localStorage.setItem('scholark_learning_level','student');
        localStorage.setItem('scholark_ai_audience_level','student');
        localStorage.setItem('scholark_education_track','vwo');
        localStorage.setItem('scholark_vwo_selected','1');
        setVwoActive(button);
        window.dispatchEvent(new CustomEvent('scholark-vwo-selected',{detail:{level:'vwo',aiLevel:'student',country:'Suriname'}}));
      });
    }
    const title=button.querySelector('b'),desc=button.querySelector('small');
    if(title&&title.textContent!=='VWO')title.textContent='VWO';
    const description=VWO_DESCRIPTION[uiLang()]||VWO_DESCRIPTION.en;
    if(desc&&desc.textContent!==description)desc.textContent=description;
    const selected=localStorage.getItem('scholark_education_track')==='vwo'&&localStorage.getItem('scholark_learning_level')==='student';
    if(selected)setVwoActive(button);else button.classList.remove('active');
    return true;
  }

  function annotateResults(){
    if(document.querySelector('#v50-level')?.value!=='vwo')return;
    document.querySelectorAll('#v50-results .v50-row').forEach(row=>{
      const h=row.querySelector('h3');if(!h||row.querySelector('.v105-vwo-tag'))return;
      if(VWO_RX.test(row.textContent||'')){
        const tags=row.querySelector('.v50-tags');
        if(tags){const badge=document.createElement('span');badge.className='v50-tag v105-vwo-tag';badge.textContent='VWO';tags.prepend(badge)}
      }
    });
  }

  function wireTargetObservers(){
    const nextDashboard=document.querySelector('#v51-main [data-v51-page="dashboard"] .v51-levels');
    if(nextDashboard&&nextDashboard!==dashboardHost){
      dashboardObserver?.disconnect();dashboardHost=nextDashboard;
      dashboardObserver=new MutationObserver(()=>scheduleApply());
      dashboardObserver.observe(nextDashboard,{childList:true});
    }
    const nextResults=document.querySelector('#v50-results');
    if(nextResults&&nextResults!==resultsHost){
      resultsObserver?.disconnect();resultsHost=nextResults;
      resultsObserver=new MutationObserver(()=>scheduleApply());
      resultsObserver.observe(nextResults,{childList:true,subtree:true});
    }
  }

  function apply(){
    patchSelector();patchServerFetch();patchCurated();separateDashboardVwoLabel();ensureDashboardVwo();annotateResults();wireTargetObservers();
  }

  document.addEventListener('click',e=>{
    const existing=e.target?.closest?.('#v51-main .v51-level[data-level]');
    if(existing&&!existing.matches('[data-v105-vwo-stage="1"],[data-level="vwo"]')){
      if(localStorage.getItem('scholark_education_track')==='vwo'){
        localStorage.removeItem('scholark_education_track');
        localStorage.removeItem('scholark_vwo_selected');
        scheduleApply();
      }
    }
  },true);

  ['hashchange','scholark-runtime-ready','scholark-country-change','scholark-language-applied','scholark-language-ready','scholark-language-complete'].forEach(ev=>addEventListener(ev,()=>setTimeout(scheduleApply,30)));

  // No document-wide MutationObserver: the workspace can mount many nodes quickly and
  // observing the whole page can make Chrome report "Page Unresponsive". A bounded
  // boot poll plus narrow dashboard/results observers is enough to catch late mounts.
  let attempts=0;
  const bootTimer=setInterval(()=>{scheduleApply();if(++attempts>=12)clearInterval(bootTimer)},500);
  [20,100,260,700,1500,3000].forEach(ms=>setTimeout(scheduleApply,ms));

  window.__SCHOLARK_VWO__={version:VERSION,apply:()=>scheduleApply(),schoolLabel:'VWO',dashboardStage:'native-v51',performanceGuard:'targeted-observers',documentWideObserver:false};
})();