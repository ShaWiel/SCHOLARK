(function scholarkSchoolVwo(){
  if(window.__SCHOLARK_V105_SCHOOL_VWO__)return;
  window.__SCHOLARK_V105_SCHOOL_VWO__=true;

  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const key=v=>clean(v).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const VWO_RX=/\bvwo\b|atheneum|gymnasium|voorbereidend wetenschappelijk|pre[- ]?university|preuniversit/i;
  const isVwoRow=row=>VWO_RX.test([
    row?.name,row?.school_name,row?.institution_type,row?.level,row?.education_level,row?.school_level,
    row?.description,row?.programs,row?.study_types,row?.tags?.name,row?.tags?.description,row?.tags?.sheet
  ].filter(Boolean).join(' '));

  const LABELS={
    nl:'VWO · Atheneum / Gymnasium',
    en:'VWO · Atheneum / Gymnasium',
    es:'VWO · Atheneum / Gymnasium',
    fr:'VWO · Atheneum / Gymnasium',
    de:'VWO · Atheneum / Gymnasium',
    pt:'VWO · Atheneum / Gymnasium',
    it:'VWO · Atheneum / Gymnasium'
  };

  function patchSelector(){
    const sel=document.querySelector('#v50-level');if(!sel)return false;
    let opt=sel.querySelector('option[value="vwo"]');
    if(!opt){
      opt=document.createElement('option');opt.value='vwo';
      const upper=sel.querySelector('option[value="upper_secondary"]');
      upper?.insertAdjacentElement('afterend',opt)||sel.appendChild(opt);
    }
    const lang=localStorage.getItem('scholark_ui_language')||'en';
    opt.textContent=LABELS[lang]||LABELS.en;
    sel.dataset.v105Vwo='1';
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
      const headers=new Headers(response.headers);headers.delete('content-length');headers.set('content-type','application/json; charset=utf-8');headers.set('x-scholark-school-vwo','vwo-atheneum-gymnasium-v1');
      return new Response(JSON.stringify(filtered),{status:response.status,statusText:response.statusText,headers});
    };
    cloud.__v105Vwo=true;
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

  function apply(){patchSelector();patchCurated();annotateResults()}
  const observer=new MutationObserver(()=>apply());observer.observe(document.documentElement,{childList:true,subtree:true});
  ['hashchange','scholark-runtime-ready','scholark-country-change','scholark-language-applied','scholark-language-ready','scholark-language-complete'].forEach(ev=>addEventListener(ev,()=>setTimeout(apply,30)));
  let attempts=0;const timer=setInterval(()=>{apply();if(++attempts>240&&window.__SCHOLARK_V72_CLOUD__?.__v105Vwo)clearInterval(timer)},250);
  [50,180,500,1200].forEach(ms=>setTimeout(apply,ms));
})();