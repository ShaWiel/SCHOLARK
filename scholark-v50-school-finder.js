(() => {
  if(window.__SCHOLARK_V50_SCHOOL_FINDER__)return;
  window.__SCHOLARK_V50_SCHOOL_FINDER__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let root=null,currentPos=null,renderedItems=[],renderOpts=null,visibleLimit=0,compareOpen=false;
  const PAGE_SIZE=80;
  const SAVED_KEY='scholark_saved_schools_v1';
  const savedIds=new Set((()=>{try{return JSON.parse(localStorage.getItem(SAVED_KEY)||'[]')}catch{return[]}})());
  const compareIds=new Set();
  const schoolId=x=>String(x?.name||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const persistSaved=()=>{try{localStorage.setItem(SAVED_KEY,JSON.stringify([...savedIds]))}catch{}};
  const isVerified=x=>!!(x?.official||x?.verifiedCurrent||x?.verifiedPublic||x?.db||/official|offici[eë]le|nuffic|minowc|verified|geverifieerd|school website/i.test(String(x?.source||'')));
  function schoolType(x){
    const hay=[x?.description,x?.tags?.denomination,x?.tags?.operator,x?.source].filter(Boolean).join(' ').toLowerCase();
    if(/international/.test(hay))return'international';
    if(/particulier|private/.test(hay))return'private';
    if(/openbaar|\bos\b|public/.test(hay))return'public';
    if(/rk|ebg|sanatan|hindoe|bijzonder|relig/.test(hay))return'special';
    return'other';
  }
  const STUDY_FIELD_LEVELS=new Set(['havo','vwo','mbo','hbo','wo','upper_secondary','vocational','higher','adult']);
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  function syncStudyField(){
    const level=$('#v50-level')?.value||'all',study=$('#v50-study'),controls=document.querySelector('#v50-school .v50-controls');
    if(!study||!controls)return false;
    const visible=STUDY_FIELD_LEVELS.has(level);
    study.hidden=!visible;study.disabled=!visible;study.setAttribute('aria-hidden',visible?'false':'true');
    controls.classList.toggle('v50-has-study',visible);
    return visible;
  }

  const css=document.createElement('style');css.id='scholark-v50-school-style';css.textContent=`
    #v50-school{position:fixed;inset:0;z-index:2147483647;background:#f4f3ef;display:none;padding:28px;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;scrollbar-gutter:stable;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;font-family:Inter,system-ui,sans-serif;box-sizing:border-box}#v50-school.open{display:block}.v50-box{width:min(1450px,100%);min-height:calc(100vh - 56px);margin:0 auto;background:#fff;color:#17191f;border-radius:28px;box-shadow:0 22px 70px rgba(31,27,63,.07);padding:28px;box-sizing:border-box}.v50-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.v50-head small{font:950 8px Inter;letter-spacing:.15em;color:#6d5dfc}.v50-head h2{font:950 clamp(34px,5vw,55px)/.96 Inter;margin:7px 0 9px;letter-spacing:-.05em}.v50-head p{font:600 11px/1.55 Inter;color:#706c77;max-width:850px;margin:0}.v50-x{display:none}.v50-controls{display:grid;grid-template-columns:1fr 1fr 1fr 210px 180px;gap:8px;margin:22px 0 8px}.v50-controls:not(.v50-has-study){grid-template-columns:1fr 1fr 1fr 210px}.v50-controls2{display:grid;grid-template-columns:1fr 180px 190px auto;gap:8px;margin-bottom:10px}.v50-controls input,.v50-controls select,.v50-controls2 input,.v50-controls2 select{border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:13px;padding:12px 13px;font:700 10.5px Inter;outline:0;box-sizing:border-box;width:100%}.v50-controls2 button,.v50-search{border:0;border-radius:13px;background:#17191f;color:#fff;padding:12px 15px;font:900 9px Inter;cursor:pointer;white-space:nowrap}.v50-controls2 button.secondary{background:#eceaf4;color:#312b3c}.v50-search span{color:#c9ff6a}.v50-location{font:700 9px/1.45 Inter;color:#777;margin:6px 0 12px}.v50-info{padding:11px 12px;border-radius:13px;background:#ece9ff;color:#51486f;font:650 9px/1.45 Inter;margin-bottom:13px}.v50-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:12px 0 8px;flex-wrap:wrap}.v50-toolbar strong{font:900 10px Inter}.v50-toolbar-actions{display:flex;gap:7px;flex-wrap:wrap}.v50-toolbar-actions button{border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:10px;padding:8px 10px;font:850 8px Inter;cursor:pointer}.v50-toolbar-actions button.active{background:#17191f;color:#fff}.v50-compare-panel{display:none;margin:10px 0 12px;padding:14px;border-radius:16px;background:#f8f7fb;border:1px solid rgba(23,25,31,.08)}.v50-compare-panel.open{display:block}.v50-compare-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}.v50-compare-card{background:#fff;border:1px solid rgba(23,25,31,.08);border-radius:13px;padding:11px}.v50-compare-card h4{margin:0 0 6px;font:900 11px Inter}.v50-compare-card p{margin:3px 0;font:650 8.5px/1.45 Inter;color:#666}.v50-metric{display:inline-flex;margin-top:7px;padding:6px 8px;border-radius:999px;background:#eaf7ee;color:#215b35;font:900 8px Inter}.v50-verified{background:#e8f0ff;color:#234f99}.v50-saved{background:#fff5cf;color:#6f5700}.v50-results{display:grid;gap:9px}.v50-row{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:17px;padding:14px;display:grid;grid-template-columns:1fr auto;gap:14px;box-shadow:0 8px 24px rgba(31,27,63,.025)}.v50-row h3{font:900 14px/1.2 Inter;margin:0 0 5px}.v50-row p{font:600 9.5px/1.45 Inter;color:#6e6974;margin:3px 0}.v50-rank{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-top:8px}.v50-score{font:950 9px Inter;padding:6px 8px;border-radius:999px;background:#17191f;color:#c9ff6a}.v50-grade{font:900 8px Inter;padding:6px 8px;border-radius:999px;background:#eef0f4;color:#4d4855}.v50-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.v50-tag{padding:5px 7px;border-radius:999px;background:#f0edff;color:#5748d6;font:850 7.5px Inter}.v50-tag.near{background:#efffcf;color:#405e0e}.v50-links{display:grid;gap:6px;min-width:135px;align-content:start}.v50-links a,.v50-links button{padding:8px 9px;border:0;border-radius:10px;text-decoration:none;text-align:center;background:#17191f;color:#fff;font:850 8px Inter;cursor:pointer}.v50-links a.alt,.v50-links button.alt{background:#eeecf4;color:#332e3a}.v50-review{grid-column:1/-1;margin-top:2px;padding:12px;border-radius:13px;background:#f8f7fb;border:1px solid rgba(23,25,31,.08);font:650 9px/1.5 Inter;color:#55505d}.v50-review b{font-weight:900;color:#2e2934}.v50-review ul{margin:7px 0 0;padding-left:18px}.v50-review-sources{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.v50-review-sources a{padding:5px 7px;border-radius:8px;background:#eeecff;color:#5144c7;text-decoration:none;font:850 7.5px Inter}.v50-more{width:100%;border:1px solid rgba(23,25,31,.1);background:#fff;border-radius:14px;padding:12px;font:900 9px Inter;cursor:pointer}.v50-state{padding:18px;border-radius:15px;background:#fafafa;color:#666;font:750 10px/1.5 Inter}.v50-state.err{background:#fff0ed;color:#7a332b}@media(max-width:950px){.v50-controls,.v50-controls2{grid-template-columns:1fr 1fr}.v50-row{grid-template-columns:1fr}}@media(max-width:620px){#v50-school{padding:12px}.v50-box{padding:17px;border-radius:20px}.v50-controls,.v50-controls2{grid-template-columns:1fr}.v50-links{grid-template-columns:1fr 1fr}}
  `;document.head.appendChild(css);

  const rad=x=>x*Math.PI/180;function dist(a,b,c,d){const R=6371,p=rad(c-a),q=rad(d-b),z=Math.sin(p/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(q/2)**2;return 2*R*Math.asin(Math.sqrt(z));}
  async function json(url,ms=12000){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal,headers:{Accept:'application/json'}});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json()}finally{clearTimeout(t)}}
  function geo(){return new Promise((res,rej)=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>res({lat:p.coords.latitude,lon:p.coords.longitude,accuracy:p.coords.accuracy}),rej,{enableHighAccuracy:true,timeout:12000,maximumAge:180000}):rej(new Error('No geolocation')))}
  async function reverse(pos){const u=`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${pos.lat}&lon=${pos.lon}`;return json(u,9000)}
  async function geocode(country,city){const q=[city,country].filter(Boolean).join(', '),u='https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q='+encodeURIComponent(q);const d=await json(u,9000);if(!d?.[0])throw new Error('Place not found');return{lat:+d[0].lat,lon:+d[0].lon,country:d[0].address?.country||country,countryCode:(d[0].address?.country_code||'').toUpperCase(),display:d[0].display_name||q}}
  async function dbSchools(country,city,level,study,pos){
    const req=cloud()?.publicRequest;if(!req)return[];
    try{
      const r=await req('/rest/v1/rpc/search_schools',{method:'POST',body:JSON.stringify({p_country:country,p_city:city||null,p_level:level||'all',p_study:study||null,p_limit:1000})});
      const rows=await r.json().catch(()=>[]);if(!r.ok||!Array.isArray(rows))return[];
      return rows.map(s=>{
        const lat=Number(s.latitude),lon=Number(s.longitude),has=Number.isFinite(lat)&&Number.isFinite(lon);
        const programmes=Array.isArray(s.programs)?s.programs.slice(0,4):[];
        const tuition=s.tuition_min!=null?(String(s.tuition_currency||'')+' '+Number(s.tuition_min).toLocaleString()+(s.tuition_max!=null?'–'+Number(s.tuition_max).toLocaleString():'')):'';
        return{name:s.name||'Education institution',description:[s.institution_type,s.address,s.city,programmes.length?'Programs: '+programmes.join(', '):'',tuition?'Tuition: '+tuition:''].filter(Boolean).join(' · '),lat:has?lat:null,lon:has?lon:null,distance:has&&pos?dist(pos.lat,pos.lon,lat,lon):null,website:s.website||'',source:s.source_name||'SCHOLARK school database',tags:{name:s.name,amenity:s.institution_type||'school',programs:programmes.join(' '),study_types:(s.study_types||[]).join(' ')},level:(s.institution_type||'school').toLowerCase(),db:true,verifiedAt:s.verified_at||null,requirements:s.entry_requirements||{},scholarships:s.scholarships||[]}
      });
    }catch{return[]}
  }

  function levelOf(t){
    const a=(t.amenity||'').toLowerCase(),n=(t.name||'').toLowerCase(),i=String(t['isced:level']||t.isced||'').toLowerCase();
    if(a==='kindergarten'||/preschool|pre-school|nursery|kleuterschool|kleuteronderwijs|peuterschool/.test(n))return'kindergarten';
    if(/\badekus\b|anton de kom|university|universiteit|faculty|faculty of/.test(n))return'wo';
    if(/\bhbo\b|hogeschool|university of applied sciences/.test(n))return'hbo';
    if(/\bnatin\b|\bimeao\b|kweekschool|\bmbo\b/.test(n))return'mbo';
    if(/\bvwo\b|atheneum|gymnasium/.test(n))return'vwo';
    if(/\bhavo\b/.test(n))return'havo';
    if(/\bmulo\b/.test(n))return'mulo';
    if(/\blbo\b/.test(n))return'lbo';
    if(a==='university')return'wo';
    if(a==='college'||/college|polytechnic/.test(n))return /technical|vocational|trade|beroeps|technisch/.test(n)?'mbo':'hbo';
    if(a==='language_school'||/adult education|continuing education|training centre|training center/.test(n))return'adult';
    if(/technical|vocational|trade school|beroeps|technisch/.test(n))return'vocational';
    if(/secondary|high school|lyceum|middelbare|voj|vos/.test(n)||/[23]/.test(i))return'secondary';
    if(/primary|elementary|basisschool|lagere school|glo/.test(n)||/1/.test(i))return'primary';
    if(a==='school')return'school';return'other';
  }
  const levelLabel={all:'All levels',kindergarten:'Kleuterschool / Kleuteronderwijs',primary:'Lagere school / Basisschool',mulo:'MULO',lbo:'LBO',havo:'HAVO',vwo:'VWO',mbo:'MBO',hbo:'HBO',wo:'WO / Universiteit',secondary:'Secondary school',upper_secondary:'Upper secondary',vocational:'Vocational / technical',higher:'College / university',adult:'Adult / professional',school:'School',other:'Education'};
  const UI_COPY={
    nl:{excellent:'Zeer sterke match',veryGood:'Sterke match',good:'Goede match',fair:'Redelijke match',low:'Beperkte match',verified:'Geverifieerde bron',save:'Bewaar',saved:'Bewaard',compare:'Vergelijk',remove:'Verwijder',source:'Bron',performance:'Prestatiegegeven',compareTitle:'Schoolvergelijking',noCompare:'Selecteer 2–4 scholen om ze naast elkaar te vergelijken.'},
    en:{excellent:'Excellent match',veryGood:'Very good match',good:'Good match',fair:'Fair match',low:'Limited match',verified:'Verified source',save:'Save',saved:'Saved',compare:'Compare',remove:'Remove',source:'Source',performance:'Performance data',compareTitle:'School comparison',noCompare:'Select 2–4 schools to compare them side by side.'},
    es:{excellent:'Coincidencia excelente',veryGood:'Coincidencia muy buena',good:'Buena coincidencia',fair:'Coincidencia razonable',low:'Coincidencia limitada',verified:'Fuente verificada',save:'Guardar',saved:'Guardado',compare:'Comparar',remove:'Quitar',source:'Fuente',performance:'Dato de rendimiento',compareTitle:'Comparación de escuelas',noCompare:'Selecciona 2–4 escuelas para compararlas.'},
    fr:{excellent:'Excellente correspondance',veryGood:'Très bonne correspondance',good:'Bonne correspondance',fair:'Correspondance correcte',low:'Correspondance limitée',verified:'Source vérifiée',save:'Enregistrer',saved:'Enregistrée',compare:'Comparer',remove:'Retirer',source:'Source',performance:'Donnée de performance',compareTitle:'Comparaison des écoles',noCompare:'Sélectionnez 2 à 4 écoles pour les comparer.'},
    de:{excellent:'Sehr starke Übereinstimmung',veryGood:'Starke Übereinstimmung',good:'Gute Übereinstimmung',fair:'Ordentliche Übereinstimmung',low:'Begrenzte Übereinstimmung',verified:'Verifizierte Quelle',save:'Speichern',saved:'Gespeichert',compare:'Vergleichen',remove:'Entfernen',source:'Quelle',performance:'Leistungsdaten',compareTitle:'Schulvergleich',noCompare:'Wählen Sie 2–4 Schulen zum Vergleich aus.'},
    pt:{excellent:'Correspondência excelente',veryGood:'Correspondência muito boa',good:'Boa correspondência',fair:'Correspondência razoável',low:'Correspondência limitada',verified:'Fonte verificada',save:'Salvar',saved:'Salvo',compare:'Comparar',remove:'Remover',source:'Fonte',performance:'Dado de desempenho',compareTitle:'Comparação de escolas',noCompare:'Selecione 2–4 escolas para comparar.'},
    it:{excellent:'Corrispondenza eccellente',veryGood:'Corrispondenza molto buona',good:'Buona corrispondenza',fair:'Corrispondenza discreta',low:'Corrispondenza limitata',verified:'Fonte verificata',save:'Salva',saved:'Salvata',compare:'Confronta',remove:'Rimuovi',source:'Fonte',performance:'Dato di rendimento',compareTitle:'Confronto scuole',noCompare:'Seleziona 2–4 scuole per confrontarle.'}
  };
  const ui=()=>UI_COPY[localStorage.getItem('scholark_ui_language')||'nl']||UI_COPY.nl;
  function levelMatch(found,wanted){if(wanted==='all')return 1;if(found===wanted)return 1;if(found==='school'&&['kindergarten','primary','mulo','lbo','havo','vwo','mbo','secondary'].includes(wanted))return .5;if(['hbo','wo'].includes(found)&&wanted==='higher')return .9;if(found==='higher'&&['hbo','wo'].includes(wanted))return .3;if(found==='mbo'&&wanted==='vocational')return .9;if(found==='vocational'&&wanted==='mbo')return .5;return .08}
  function words(s){return String(s||'').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(x=>x.length>2)}
  function nameMatch(x,q){
    const terms=words(q);if(!terms.length)return true;
    const hay=[x?.name,x?.description,x?.tags?.aliases,x?.tags?.operator].filter(Boolean).join(' ').toLowerCase();
    return terms.every(term=>hay.includes(term));
  }

  const OVERPASS_EPS=['https://overpass.kumi.systems/api/interpreter?data=','https://overpass-api.de/api/interpreter?data=','https://overpass.nchc.org.tw/api/interpreter?data='];
  async function overpassQuery(q,ms=20000){
    let d=null;for(const e of OVERPASS_EPS){try{d=await json(e+encodeURIComponent(q),ms);if(d?.elements?.length)break}catch{}}return d?.elements||[];
  }
  async function overpass(pos,radius){
    const km=Math.max(1,Math.min(700,Number(radius)||50));
    const q=`[out:json][timeout:28];(node["amenity"~"school|college|university|language_school"](around:${km*1000},${pos.lat},${pos.lon});way["amenity"~"school|college|university|language_school"](around:${km*1000},${pos.lat},${pos.lon});relation["amenity"~"school|college|university|language_school"](around:${km*1000},${pos.lat},${pos.lon}););out center tags 1200;`;
    return overpassQuery(q,22000);
  }
  async function overpassCountry(countryCode='SR',countryName='Suriname'){
    const iso=String(countryCode||'SR').toUpperCase().replace(/[^A-Z]/g,'').slice(0,2)||'SR',name=String(countryName||'Suriname').replace(/["\\]/g,'');
    if(iso==='SR'){
      const box='1.75,-58.25,6.25,-53.75';
      const q=`[out:json][timeout:35];(node["amenity"~"school|college|university|language_school"](${box});way["amenity"~"school|college|university|language_school"](${box});relation["amenity"~"school|college|university|language_school"](${box});node["building"="school"](${box});way["building"="school"](${box});relation["building"="school"](${box});node["office"="educational_institution"](${box});way["office"="educational_institution"](${box});relation["office"="educational_institution"](${box}););out center tags 1800;`;
      const rows=await overpassQuery(q,22000);if(rows.length)return rows;
    }
    const q=`[out:json][timeout:35];area["ISO3166-1"="${iso}"]["admin_level"="2"]->.country;(node["amenity"~"school|college|university|language_school"](area.country);way["amenity"~"school|college|university|language_school"](area.country);relation["amenity"~"school|college|university|language_school"](area.country);node["building"="school"](area.country);way["building"="school"](area.country);relation["building"="school"](area.country););out center tags 1800;`;
    const rows=await overpassQuery(q,22000);if(rows.length)return rows;
    const byName=`[out:json][timeout:30];area["name"="${name}"]["boundary"="administrative"]["admin_level"="2"]->.country;(node["amenity"~"school|college|university|language_school"](area.country);way["amenity"~"school|college|university|language_school"](area.country);relation["amenity"~"school|college|university|language_school"](area.country););out center tags 1800;`;
    return overpassQuery(byName,18000);
  }
  async function wikiGeo(pos,radius){const r=Math.min(10000,Math.max(1000,radius*1000)),u=`https://en.wikipedia.org/w/api.php?action=query&list=geosearch&format=json&origin=*&gslimit=50&gsradius=${r}&gscoord=${pos.lat}%7C${pos.lon}`;try{const j=await json(u,8000);return(j.query?.geosearch||[]).filter(x=>/school|university|college|academy|institute|polytechnic|lyceum|gymnasium/i.test(x.title)).map(x=>({name:x.title,lat:x.lat,lon:x.lon,distance:x.dist!=null?x.dist/1000:null,wiki:'https://en.wikipedia.org/?curid='+x.pageid,source:'Knowledge search',tags:{name:x.title,amenity:'school'}}))}catch{return[]}}

  function fromOsm(e,pos){const t=e.tags||{},lat=e.lat??e.center?.lat,lon=e.lon??e.center?.lon,name=t.name||t['name:en']||t.operator||t.ref||'';if(lat==null||lon==null||!String(name).trim())return null;return{name,description:[t.description,t.operator,t['addr:street'],t['addr:city']||t['addr:town']].filter(Boolean).join(' · '),lat,lon,distance:dist(pos.lat,pos.lon,lat,lon),website:t.website||t['contact:website']||'',phone:t.phone||t['contact:phone']||'',email:t.email||t['contact:email']||'',source:'OpenStreetMap',tags:t,level:levelOf(t)}}
  function merge(...sets){const out=[],seen=new Set();for(const x of sets.flat()){if(!x?.name)continue;const k=x.name.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}

  function score(x,opts){
    const lm=levelMatch(x.level||levelOf(x.tags||{}),opts.level);
    const levelScore=lm*55;
    const locationScore=x.distance==null?18:Math.max(0,22-(x.distance/Math.max(5,opts.radius))*22);
    const evidenceScore=(isVerified(x)?8:0)+(x.website?3:0)+(x.phone||x.email?2:0)+(x.description?2:0)+(x.db?2:0);
    const studyWords=words(opts.study),hay=[x.name,x.description,x.tags?.subject,x.tags?.faculty,x.tags?.department,x.tags?.education,x.tags?.operator].filter(Boolean).join(' ').toLowerCase(),studyHits=studyWords.reduce((n,w)=>n+(hay.includes(w)?1:0),0),studyScore=studyWords.length?Math.min(10,(studyHits/studyWords.length)*10):7;
    return Math.max(0,Math.min(100,Math.round(levelScore+locationScore+evidenceScore+studyScore)));
  }
  function grade(s){const t=ui();return s>=88?t.excellent:s>=76?t.veryGood:s>=62?t.good:s>=48?t.fair:t.low}
  function verify(x,study){return'https://www.google.com/search?q='+encodeURIComponent(`${x.name} ${study||''} official school reviews programmes`)}
  function map(x){return Number.isFinite(x.lat)&&Number.isFinite(x.lon)?`https://www.openstreetmap.org/?mlat=${x.lat}&mlon=${x.lon}#map=15/${x.lat}/${x.lon}`:''}

  function metricMarkup(x){
    const m=x?.metrics;if(!m)return'';
    if(Number.isFinite(Number(m.directPassRate))){
      const year=m.schoolYear?String(m.schoolYear):'';
      return '<span class="v50-metric">'+esc((year?year+' · ':'')+Number(m.directPassRate).toLocaleString(undefined,{maximumFractionDigits:1})+'% direct geslaagd')+'</span>';
    }
    return'';
  }
  function sourceLink(x){
    return x?.sourceUrl&&/^https?:/i.test(String(x.sourceUrl))?'<a class="alt" href="'+esc(x.sourceUrl)+'" target="_blank" rel="noopener">'+esc(ui().source)+' ↗</a>':'';
  }
  function comparePanel(){
    const panel=$('#v50-compare-panel');if(!panel)return;
    const selected=renderedItems.filter(x=>compareIds.has(schoolId(x))).slice(0,4),t=ui();
    panel.classList.toggle('open',compareOpen);
    if(!compareOpen)return;
    panel.innerHTML='<strong>'+esc(t.compareTitle)+'</strong>'+(selected.length<2?'<div class="v50-state">'+esc(t.noCompare)+'</div>':'<div class="v50-compare-grid">'+selected.map(x=>'<div class="v50-compare-card"><h4 data-sch-school-name="1">'+esc(x.name)+'</h4><p><b>'+esc(levelLabel[x.level]||'Education')+'</b></p><p>'+esc(x.description||'')+'</p><p>'+esc(x.source||'')+'</p>'+(isVerified(x)?'<span class="v50-tag v50-verified">'+esc(t.verified)+'</span>':'')+metricMarkup(x)+(x.phone?'<p>'+esc(x.phone)+'</p>':'')+'</div>').join('')+'</div>');
  }
  function reviewMarkup(x){
    const r=x?._review;if(!r)return '<div class="v50-review">Public reviews have not been loaded yet. Use <b>View reviews</b> to check current web sources for this school.</div>';
    if(r.loading)return '<div class="v50-review">Checking current public reviews and reputation…</div>';
    if(r.error)return '<div class="v50-review"><b>Review check unavailable.</b> '+esc(r.error)+'</div>';
    const findings=(r.findings||[]).slice(0,4),sources=(r.sources||[]).filter(s=>/^https?:/i.test(String(s.url||''))).slice(0,6);
    return '<div class="v50-review"><b>Public review summary</b><div>'+esc(r.summary||'No reliable review summary was returned.')+'</div>'+(findings.length?'<ul>'+findings.map(f=>'<li><b>'+esc(f.claim||'Finding')+':</b> '+esc(f.detail||'')+'</li>').join('')+'</ul>':'')+(sources.length?'<div class="v50-review-sources">'+sources.map(s=>'<a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.title||s.publisher||'Review source')+' ↗</a>').join('')+'</div>':'')+'<div style="margin-top:7px;color:#817b89">This is a web-sourced reputation check, not a SCHOLARK rating. Review quality and availability vary by school.</div></div>';
  }
  function paintResults(){
    const h=$('#v50-results'),items=renderedItems,opts=renderOpts;if(!h||!opts)return;
    const shown=items.slice(0,visibleLimit);
    h.innerHTML=shown.map((x,i)=>{const d=x.distance!=null?`${x.distance.toFixed(x.distance<10?1:0)} km away`:'',id=schoolId(x),t=ui(),saved=savedIds.has(id),compared=compareIds.has(id);return`<article class="v50-row"><div><h3 data-sch-school-name="1"><span data-sch-rank="1">${i+1}. </span><span data-sch-school-name-text="1">${esc(x.name)}</span></h3><p>${esc(x.description||'Education institution')}</p><div class="v50-rank"><span class="v50-score">Match ${x.score}%</span><span class="v50-grade">${grade(x.score)}</span><span class="v50-grade">${esc(levelLabel[x.level]||'Education')}</span>${isVerified(x)?`<span class="v50-tag v50-verified">${esc(t.verified)}</span>`:''}${saved?`<span class="v50-tag v50-saved">${esc(t.saved)}</span>`:''}</div>${metricMarkup(x)}<div class="v50-tags">${d?`<span class="v50-tag near">${esc(d)}</span>`:''}<span class="v50-tag">${esc(x.source)}</span>${opts.national?'<span class="v50-tag">Suriname nationwide</span>':''}${opts.study?`<span class="v50-tag">study interest optional</span>`:''}</div></div><div class="v50-links">${x.website&&/^https?:/i.test(x.website)?`<a href="${esc(x.website)}" target="_blank" rel="noopener">Official site ↗</a>`:''}${sourceLink(x)}<button class="alt" data-v50-save="${i}">${esc(saved?t.saved:t.save)}</button><button class="alt" data-v50-compare="${i}">${esc(compared?t.remove:t.compare)}</button><button class="alt" data-v50-review="${i}">View reviews</button><a class="alt" href="${esc(verify(x,opts.study))}" target="_blank" rel="noopener">Research school ↗</a>${map(x)?`<a class="alt" href="${esc(map(x))}" target="_blank" rel="noopener">Map ↗</a>`:''}${x.wiki?`<a class="alt" href="${esc(x.wiki)}" target="_blank" rel="noopener">About ↗</a>`:''}</div>${reviewMarkup(x)}</article>`}).join('');
    if(visibleLimit<items.length)h.insertAdjacentHTML('beforeend',`<button class="v50-more" id="v50-more">Show ${Math.min(PAGE_SIZE,items.length-visibleLimit)} more schools · ${items.length-visibleLimit} remaining</button>`);
    const cb=$('#v50-compare-btn');if(cb){cb.textContent=(ui().compare+' ('+compareIds.size+')');cb.classList.toggle('active',compareOpen)}
    comparePanel();
  }
  function render(items,opts){
    const h=$('#v50-results');
    items=(items||[]).filter(x=>(!opts.type||opts.type==='all'||schoolType(x)===opts.type)&&(!opts.verifiedOnly||isVerified(x)));
    if(!items.length){renderedItems=[];renderOpts=opts;h.innerHTML='<div class="v50-state err">No schools matched these filters. Try All types, turn off Verified only, or widen the search.</div>';$('#v50-count').textContent='0 schools';comparePanel();return}
    items.forEach(x=>x.score=score(x,opts));
    if(opts.sort==='distance')items.sort((a,b)=>(a.distance??9999)-(b.distance??9999)||b.score-a.score);
    else if(opts.sort==='name')items.sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
    else items.sort((a,b)=>b.score-a.score||String(a.name||'').localeCompare(String(b.name||'')));
    renderedItems=items;renderOpts=opts;visibleLimit=Math.min(PAGE_SIZE,items.length);
    const sortLabel=opts.sort==='distance'?'nearest first':opts.sort==='name'?'A–Z':'best match first';
    $('#v50-count').textContent=`${items.length} schools · ${opts.national?'nationwide Suriname coverage · ':''}${sortLabel}`;
    paintResults();
  }
  async function loadReviews(index){
    const x=renderedItems[index];if(!x||x._review?.loading)return;
    if(x._review&&!x._review.error){paintResults();return}
    x._review={loading:true};paintResults();
    try{
      const res=await fetch('/api/schools/reviews',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:x.name,country:renderOpts?.country||'',city:renderOpts?.city||''})});
      const data=await res.json().catch(()=>({}));if(!res.ok||!data?.ok)throw new Error(data?.error||'Public review search failed');
      const results=Array.isArray(data.results)?data.results:[];
      x._review={
        loading:false,
        summary:results.length?'SCHOLARK found '+results.length+' public review/reputation sources to inspect. Review snippets are shown below; open the sources for the full context.':'No reliable public review sources were returned for this school.',
        findings:results.filter(r=>r.snippet).slice(0,4).map(r=>({claim:r.title||'Public review source',detail:r.snippet})),
        sources:results.filter(r=>/^https?:/i.test(String(r.url||''))).map(r=>({title:r.title||'Review source',url:r.url,publisher:'Public web'}))
      };
    }catch(e){x._review={loading:false,error:String(e?.message||e||'Review search failed')}}
    paintResults();
  }

  function build(){
    if(root)return;root=document.createElement('div');root.id='v50-school';root.innerHTML=`<div class="v50-box"><div class="v50-head"><div><small>SCHOLARK · SCHOOLS NEAR ME</small><h2>Find the right schools around you.</h2><p>Search education from kleuter- and basisonderwijs through VOJ, VOS, MBO, HBO and university. Country is required; study/field is optional.</p></div><button class="v50-x">×</button></div>
    <div class="v50-controls"><input id="v50-country" placeholder="Country you are in or going to"><input id="v50-city" placeholder="City / area (recommended)"><input id="v50-name" placeholder="School name (optional)"><select id="v50-level"><option value="all">Alle niveaus</option><optgroup label="Basisonderwijs"><option value="kindergarten">Kleuterschool / Kleuteronderwijs · Leerjaar 1–2 · 4–6 jaar</option><option value="primary">Lagere school / Basisschool · Leerjaar 3–8 · 6–12 jaar</option></optgroup><optgroup label="Voortgezet Onderwijs Junioren (VOJ)"><option value="mulo">MULO · 12–16 jaar</option><option value="lbo">LBO · 12–16 jaar</option></optgroup><optgroup label="Voortgezet Onderwijs Senioren (VOS)"><option value="havo">HAVO · 16–18 jaar</option><option value="vwo">VWO · 16–19 jaar</option><option value="mbo">MBO · NATIN, IMEAO, Kweekschool · 16–20+ jaar</option></optgroup><optgroup label="Hoger Onderwijs"><option value="hbo">HBO · 18/19+ jaar</option><option value="wo">WO / Universiteit · AdeKUS · 19+ jaar</option></optgroup></select><input id="v50-study" placeholder="Study / field (optional)"></div>
    <div class="v50-controls2"><select id="v50-radius"><option value="10">Within 10 km</option><option value="25">Within 25 km</option><option value="50" selected>Within 50 km</option><option value="100">Within 100 km</option><option value="150">Within 150 km</option><option value="250">Within 250 km</option><option value="400">Within 400 km</option><option value="550">Within 550 km</option><option value="700">Within 700 km</option></select><select id="v50-type"><option value="all">All school types</option><option value="public">Public</option><option value="private">Private</option><option value="special">Special / religious</option><option value="international">International</option></select><select id="v50-sort"><option value="best" selected>Best match first</option><option value="distance">Nearest first</option><option value="name">Name A–Z</option></select><label class="secondary" style="display:flex;align-items:center;justify-content:center;gap:7px"><input type="checkbox" id="v50-verified"> Verified only</label><button class="secondary" id="v50-location-btn">Use my current location</button><button class="v50-search" id="v50-go">Search with <span>SCHOLARK</span></button></div>
    <div class="v50-location" id="v50-location">Enter the country you are in or travelling to. Add a city/area for much better nearby results, or use your real location.</div>
    <div class="v50-info">The SCHOLARK <b>match score measures fit with your search criteria — it is not a school-quality grade or academic ranking</b>. Exact level, location, verified source coverage and optional study relevance influence the score. Where reliable performance data exists, SCHOLARK shows that separately as a factual metric. <b>All levels + Suriname searches nationwide</b>, not just around Paramaribo.</div><div class="v50-toolbar"><strong id="v50-count">Ready to search</strong><div class="v50-toolbar-actions"><button id="v50-compare-btn">Compare (0)</button><button id="v50-saved-btn">Saved schools</button></div></div><div class="v50-compare-panel" id="v50-compare-panel"></div><div class="v50-results" id="v50-results"></div></div>`;
    document.body.appendChild(root);$('#v50-go').onclick=search;$('#v50-location-btn').onclick=useLocation;$('.v50-x',root).onclick=close;$('#v50-level').addEventListener('change',syncStudyField);syncStudyField();
    $('#v50-compare-btn').onclick=()=>{compareOpen=!compareOpen;comparePanel();paintResults()};
    $('#v50-saved-btn').onclick=()=>{if(!renderedItems.length)return;const only=renderedItems.filter(x=>savedIds.has(schoolId(x)));if(only.length)render(only,{...renderOpts,type:'all',verifiedOnly:false,sort:'name'})};
    $('#v50-results').addEventListener('click',e=>{
      const save=e.target.closest?.('[data-v50-save]');if(save){e.preventDefault();const x=renderedItems[+save.dataset.v50Save];if(x){const id=schoolId(x);savedIds.has(id)?savedIds.delete(id):savedIds.add(id);persistSaved();paintResults()}return}
      const compare=e.target.closest?.('[data-v50-compare]');if(compare){e.preventDefault();const x=renderedItems[+compare.dataset.v50Compare];if(x){const id=schoolId(x);if(compareIds.has(id))compareIds.delete(id);else if(compareIds.size<4)compareIds.add(id);compareOpen=true;paintResults()}return}
      const review=e.target.closest?.('[data-v50-review]');if(review){e.preventDefault();return loadReviews(+review.dataset.v50Review)}
      if(e.target.closest?.('#v50-more')){visibleLimit=Math.min(renderedItems.length,visibleLimit+PAGE_SIZE);paintResults()}
    });
  }

  async function useLocation(){
    const loc=$('#v50-location'),btn=$('#v50-location-btn');btn.disabled=true;loc.textContent='Requesting your current location…';
    try{currentPos=await geo();const r=await reverse(currentPos);const a=r.address||{};currentPos.countryCode=String(a.country_code||'').toUpperCase();currentPos.country=a.country||'';$('#v50-country').value=a.country||'';$('#v50-city').value=a.city||a.town||a.village||a.suburb||'';loc.textContent=`Current location ready · accuracy about ${Math.round(currentPos.accuracy||0)} m · ${r.display_name||''}`}
    catch{currentPos=null;loc.textContent='Your location could not be read. Enter country + city/area manually.'}finally{btn.disabled=false}
  }

  async function search(){
    const country=$('#v50-country').value.trim(),city=$('#v50-city').value.trim(),nameQuery=$('#v50-name')?.value.trim()||'',level=$('#v50-level').value,study=STUDY_FIELD_LEVELS.has($('#v50-level').value)?$('#v50-study').value.trim():'',radius=Math.min(700,Math.max(1,+$('#v50-radius').value||50)),type=$('#v50-type')?.value||'all',verifiedOnly=!!$('#v50-verified')?.checked,sort=$('#v50-sort').value||'best',h=$('#v50-results'),loc=$('#v50-location');
    if(!country){h.innerHTML='<div class="v50-state err">Tell SCHOLARK which country you are in or going to first.</div>';return $('#v50-country').focus()}
    window.__SCHOLARK_COUNTRY__?.set?.(country,'schools');
    h.innerHTML='<div class="v50-state">Finding schools through SCHOLARK server-side public sources…</div>';
    try{
      const payload={country,city,name:nameQuery,level,radius,lat:currentPos?.lat,lon:currentPos?.lon,countryCode:currentPos?.countryCode||''};
      const response=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      const live=await response.json().catch(()=>({}));
      if(!response.ok||!live?.ok)throw new Error(live?.error||'SCHOLARK school discovery route failed');
      const pos={lat:Number(live.center?.lat),lon:Number(live.center?.lon)};
      const db=await dbSchools(country,live.national?'':city,level,study,pos).catch(()=>[]);
      const items=merge(db,Array.isArray(live.schools)?live.schools:[]).filter(x=>x.level!=='early'&&nameMatch(x,nameQuery));
      const national=!!live.national;
      render(items,{country,city,nameQuery,level,study,radius:national?700:radius,type,verifiedOnly,sort,national});
      const sourceCount=(live.sourceStatus||[]).filter(x=>x.ok).reduce((n,x)=>n+(Number(x.count)||0),0);
      loc.textContent=national
        ? 'Nationwide Suriname search complete · '+items.length+' named education institutions'+(nameQuery?' matching “'+nameQuery+'”':'')+' · provider: '+(live.provider||'public school sources')+(sourceCount?' · '+sourceCount+' source records scanned':'')
        : 'School search complete around '+(live.center?.display||city||country)+' · '+items.length+' named education institutions'+(nameQuery?' matching “'+nameQuery+'”':'')+' · within '+radius+' km.';
      if(db.length)loc.textContent+=' · '+db.length+' curated SCHOLARK database matches merged.';
    }catch(serverError){
      console.warn('[SCHOLARK] server school search failed, trying browser fallback:',serverError);
      let pos=currentPos,countryCode=String(currentPos?.countryCode||'').toUpperCase(),geoResult=null;
      try{
        if(!pos||city){geoResult=await geocode(country,city);pos={lat:geoResult.lat,lon:geoResult.lon,countryCode:geoResult.countryCode};countryCode=geoResult.countryCode}
        const suriname=/^suriname$/i.test(country)||countryCode==='SR',national=suriname&&level==='all';
        const [db,raw,wiki]=await Promise.all([dbSchools(country,national?'':city,level,study,pos),national?overpassCountry(countryCode||'SR','Suriname'):overpass(pos,radius),national?Promise.resolve([]):wikiGeo(pos,radius)]);
        const local=raw.map(e=>fromOsm(e,pos)).filter(Boolean),wikiItems=wiki.map(x=>({...x,level:'school'})),items=merge(db,local,wikiItems).filter(x=>x.level!=='early'&&nameMatch(x,nameQuery));
        render(items,{country,city,nameQuery,level,study,radius:national?700:radius,type,verifiedOnly,sort,national});
        loc.textContent='Browser fallback used · '+items.length+' named education institutions found.';
      }catch(e){
        h.innerHTML='<div class="v50-state err">SCHOLARK could not reach the school data sources right now. The app itself is still responsive; retry this search in a moment.</div>';
        $('#v50-count').textContent='School source unavailable';
        loc.textContent='Server route and browser fallback both failed.';
      }
    }
  }

  function open(){build();root.classList.add('open');root.scrollTop=0;window.__SCHOLARK_COUNTRY__?.apply?.();syncStudyField();history.replaceState(null,'',location.pathname+location.search+'#schools');requestAnimationFrame(()=>$('#v50-country')?.focus())}
  function close(){root?.classList.remove('open')}
  window.__SCHOLARK_V50_SCHOOLS__={open,close,build,search,useLocation,syncStudyField,studyFieldLevels:[...STUDY_FIELD_LEVELS]};
  build();
})();