(() => {
  if(window.__SCHOLARK_V50_SCHOOL_FINDER__)return;
  window.__SCHOLARK_V50_SCHOOL_FINDER__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let root=null,currentPos=null;

  const css=document.createElement('style');css.id='scholark-v50-school-style';css.textContent=`
    #v50-school{position:fixed;inset:0;z-index:2147483647;background:#f4f3ef;display:none;padding:28px;overflow:auto;font-family:Inter,system-ui,sans-serif;box-sizing:border-box}#v50-school.open{display:block}.v50-box{width:min(1450px,100%);min-height:calc(100vh - 56px);margin:0 auto;background:#fff;color:#17191f;border-radius:28px;box-shadow:0 22px 70px rgba(31,27,63,.07);padding:28px;box-sizing:border-box}.v50-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.v50-head small{font:950 8px Inter;letter-spacing:.15em;color:#6d5dfc}.v50-head h2{font:950 clamp(34px,5vw,55px)/.96 Inter;margin:7px 0 9px;letter-spacing:-.05em}.v50-head p{font:600 11px/1.55 Inter;color:#706c77;max-width:850px;margin:0}.v50-x{display:none}.v50-controls{display:grid;grid-template-columns:1fr 1fr 210px 180px;gap:8px;margin:22px 0 8px}.v50-controls2{display:grid;grid-template-columns:1fr 180px 190px auto;gap:8px;margin-bottom:10px}.v50-controls input,.v50-controls select,.v50-controls2 input,.v50-controls2 select{border:1px solid rgba(23,25,31,.12);background:#fafafa;border-radius:13px;padding:12px 13px;font:700 10.5px Inter;outline:0;box-sizing:border-box;width:100%}.v50-controls2 button,.v50-search{border:0;border-radius:13px;background:#17191f;color:#fff;padding:12px 15px;font:900 9px Inter;cursor:pointer;white-space:nowrap}.v50-controls2 button.secondary{background:#eceaf4;color:#312b3c}.v50-search span{color:#c9ff6a}.v50-location{font:700 9px/1.45 Inter;color:#777;margin:6px 0 12px}.v50-info{padding:11px 12px;border-radius:13px;background:#ece9ff;color:#51486f;font:650 9px/1.45 Inter;margin-bottom:13px}.v50-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:12px 0 8px}.v50-toolbar strong{font:900 10px Inter}.v50-results{display:grid;gap:9px}.v50-row{background:#fff;border:1px solid rgba(23,25,31,.09);border-radius:17px;padding:14px;display:grid;grid-template-columns:1fr auto;gap:14px;box-shadow:0 8px 24px rgba(31,27,63,.025)}.v50-row h3{font:900 14px/1.2 Inter;margin:0 0 5px}.v50-row p{font:600 9.5px/1.45 Inter;color:#6e6974;margin:3px 0}.v50-rank{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-top:8px}.v50-score{font:950 9px Inter;padding:6px 8px;border-radius:999px;background:#17191f;color:#c9ff6a}.v50-grade{font:900 8px Inter;padding:6px 8px;border-radius:999px;background:#eef0f4;color:#4d4855}.v50-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.v50-tag{padding:5px 7px;border-radius:999px;background:#f0edff;color:#5748d6;font:850 7.5px Inter}.v50-tag.near{background:#efffcf;color:#405e0e}.v50-links{display:grid;gap:6px;min-width:135px;align-content:start}.v50-links a{padding:8px 9px;border-radius:10px;text-decoration:none;text-align:center;background:#17191f;color:#fff;font:850 8px Inter}.v50-links a.alt{background:#eeecf4;color:#332e3a}.v50-state{padding:18px;border-radius:15px;background:#fafafa;color:#666;font:750 10px/1.5 Inter}.v50-state.err{background:#fff0ed;color:#7a332b}@media(max-width:950px){.v50-controls,.v50-controls2{grid-template-columns:1fr 1fr}.v50-row{grid-template-columns:1fr}}@media(max-width:620px){#v50-school{padding:12px}.v50-box{padding:17px;border-radius:20px}.v50-controls,.v50-controls2{grid-template-columns:1fr}.v50-links{grid-template-columns:1fr 1fr}}
  `;document.head.appendChild(css);

  const rad=x=>x*Math.PI/180;function dist(a,b,c,d){const R=6371,p=rad(c-a),q=rad(d-b),z=Math.sin(p/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(q/2)**2;return 2*R*Math.asin(Math.sqrt(z));}
  async function json(url,ms=12000){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal,headers:{Accept:'application/json'}});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json()}finally{clearTimeout(t)}}
  function geo(){return new Promise((res,rej)=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>res({lat:p.coords.latitude,lon:p.coords.longitude,accuracy:p.coords.accuracy}),rej,{enableHighAccuracy:true,timeout:12000,maximumAge:180000}):rej(new Error('No geolocation')))}
  async function reverse(pos){const u=`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${pos.lat}&lon=${pos.lon}`;return json(u,9000)}
  async function geocode(country,city){const q=[city,country].filter(Boolean).join(', '),u='https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q='+encodeURIComponent(q);const d=await json(u,9000);if(!d?.[0])throw new Error('Place not found');return{lat:+d[0].lat,lon:+d[0].lon,country:d[0].address?.country||country,countryCode:(d[0].address?.country_code||'').toUpperCase(),display:d[0].display_name||q}}

  function levelOf(t){
    const a=(t.amenity||'').toLowerCase(),n=(t.name||'').toLowerCase(),i=String(t['isced:level']||t.isced||'').toLowerCase();
    if(a==='kindergarten'||/preschool|pre-school|nursery|kleuterschool|peuterschool/.test(n))return'early';
    if(a==='university'||/university|universiteit|faculty|faculty of/.test(n))return'higher';
    if(a==='college'||/college|polytechnic|hogeschool/.test(n))return /technical|vocational|trade|beroeps|technisch/.test(n)?'vocational':'higher';
    if(a==='language_school'||/adult education|continuing education|training centre|training center/.test(n))return'adult';
    if(/technical|vocational|trade school|beroeps|technisch/.test(n))return'vocational';
    if(/secondary|high school|lyceum|gymnasium|middelbare|voj|vos|mulo|lbo/.test(n)||/[23]/.test(i))return'secondary';
    if(/primary|elementary|basisschool|glo/.test(n)||/1/.test(i))return'primary';
    if(a==='school')return'school';return'other';
  }
  const levelLabel={all:'All levels',early:'Early childhood',primary:'Primary school',secondary:'Secondary school',vocational:'Vocational / technical',higher:'College / university',adult:'Adult / professional',school:'School',other:'Education'};
  function levelMatch(found,wanted){if(wanted==='all')return 1;if(found===wanted)return 1;if(found==='school'&&['primary','secondary'].includes(wanted))return .65;if(found==='higher'&&wanted==='vocational')return .35;if(found==='vocational'&&wanted==='higher')return .35;return .08}
  function words(s){return String(s||'').toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(x=>x.length>2)}

  async function overpass(pos,radius){
    const q=`[out:json][timeout:18];(node["amenity"~"kindergarten|school|college|university|language_school"](around:${radius*1000},${pos.lat},${pos.lon});way["amenity"~"kindergarten|school|college|university|language_school"](around:${radius*1000},${pos.lat},${pos.lon});relation["amenity"~"kindergarten|school|college|university|language_school"](around:${radius*1000},${pos.lat},${pos.lon}););out center tags 120;`,eps=['https://overpass.kumi.systems/api/interpreter?data=','https://overpass-api.de/api/interpreter?data=','https://overpass.nchc.org.tw/api/interpreter?data='];let d=null;for(const e of eps){try{d=await json(e+encodeURIComponent(q),11000);if(d?.elements?.length)break}catch{}}return d?.elements||[];
  }
  async function wikiGeo(pos,radius){const r=Math.min(10000,Math.max(1000,radius*1000)),u=`https://en.wikipedia.org/w/api.php?action=query&list=geosearch&format=json&origin=*&gslimit=50&gsradius=${r}&gscoord=${pos.lat}%7C${pos.lon}`;try{const j=await json(u,8000);return(j.query?.geosearch||[]).filter(x=>/school|university|college|academy|institute|polytechnic|lyceum|gymnasium/i.test(x.title)).map(x=>({name:x.title,lat:x.lat,lon:x.lon,distance:x.dist!=null?x.dist/1000:null,wiki:'https://en.wikipedia.org/?curid='+x.pageid,source:'Knowledge search',tags:{name:x.title,amenity:'school'}}))}catch{return[]}}

  function fromOsm(e,pos){const t=e.tags||{},lat=e.lat??e.center?.lat,lon=e.lon??e.center?.lon;if(lat==null||lon==null)return null;return{name:t.name||'Education institution',description:[t.description,t.operator,t['addr:street'],t['addr:city']||t['addr:town']].filter(Boolean).join(' · '),lat,lon,distance:dist(pos.lat,pos.lon,lat,lon),website:t.website||t['contact:website']||'',phone:t.phone||t['contact:phone']||'',email:t.email||t['contact:email']||'',source:'OpenStreetMap',tags:t,level:levelOf(t)}}
  function merge(...sets){const out=[],seen=new Set();for(const x of sets.flat()){if(!x?.name)continue;const k=x.name.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}

  function score(x,opts){
    const lm=levelMatch(x.level||levelOf(x.tags||{}),opts.level),distanceScore=x.distance==null?8:Math.max(0,35-(x.distance/Math.max(5,opts.radius))*35),meta=(x.website?8:0)+(x.phone||x.email?4:0)+(x.description?3:0),studyWords=words(opts.study),hay=[x.name,x.description,x.tags?.subject,x.tags?.faculty,x.tags?.department,x.tags?.education,x.tags?.operator].filter(Boolean).join(' ').toLowerCase(),studyHits=studyWords.reduce((n,w)=>n+(hay.includes(w)?1:0),0),studyScore=studyWords.length?Math.min(12,(studyHits/studyWords.length)*12):8;
    return Math.max(0,Math.min(100,Math.round(lm*38+distanceScore+meta+studyScore)));
  }
  function grade(s){return s>=80?'Excellent match':s>=66?'Very good match':s>=52?'Good match':s>=38?'Fair match':'Low match'}
  function verify(x,study){return'https://www.google.com/search?q='+encodeURIComponent(`${x.name} ${study||''} official school reviews programmes`)}
  function map(x){return Number.isFinite(x.lat)&&Number.isFinite(x.lon)?`https://www.openstreetmap.org/?mlat=${x.lat}&mlon=${x.lon}#map=15/${x.lat}/${x.lon}`:''}

  function render(items,opts){
    const h=$('#v50-results');if(!items.length){h.innerHTML='<div class="v50-state err">No schools were returned for this area. Try a larger radius, another city/area, or All levels.</div>';return}
    items.forEach(x=>x.score=score(x,opts));items.sort((a,b)=>opts.sort==='best'?b.score-a.score:a.score-b.score);
    $('#v50-count').textContent=`${items.length} schools · ${opts.sort==='best'?'best match first':'worst → best match'}`;
    h.innerHTML=items.slice(0,60).map((x,i)=>{const d=x.distance!=null?`${x.distance.toFixed(x.distance<10?1:0)} km away`:'';return`<article class="v50-row"><div><h3>${opts.sort==='best'?i+1:items.length-i}. ${esc(x.name)}</h3><p>${esc(x.description||'Education institution')}</p><div class="v50-rank"><span class="v50-score">${x.score}/100</span><span class="v50-grade">${grade(x.score)}</span><span class="v50-grade">${esc(levelLabel[x.level]||'Education')}</span></div><div class="v50-tags">${d?`<span class="v50-tag near">${esc(d)}</span>`:''}<span class="v50-tag">${esc(x.source)}</span>${opts.study?`<span class="v50-tag">study interest optional</span>`:''}</div></div><div class="v50-links">${x.website&&/^https?:/i.test(x.website)?`<a href="${esc(x.website)}" target="_blank" rel="noopener">Official site ↗</a>`:''}<a class="alt" href="${esc(verify(x,opts.study))}" target="_blank" rel="noopener">Research school ↗</a>${map(x)?`<a class="alt" href="${esc(map(x))}" target="_blank" rel="noopener">Map ↗</a>`:''}${x.wiki?`<a class="alt" href="${esc(x.wiki)}" target="_blank" rel="noopener">About ↗</a>`:''}</div></article>`}).join('');
  }

  function build(){
    if(root)return;root=document.createElement('div');root.id='v50-school';root.innerHTML=`<div class="v50-box"><div class="v50-head"><div><small>SCHOLARK · SCHOOLS NEAR ME</small><h2>Find the right schools around you.</h2><p>Search every education level — from early childhood and primary school to secondary, vocational, university and adult learning. Country is required; study/field is optional.</p></div><button class="v50-x">×</button></div>
    <div class="v50-controls"><input id="v50-country" placeholder="Country you are in or going to"><input id="v50-city" placeholder="City / area (recommended)"><select id="v50-level"><option value="all">All levels</option><option value="early">Early childhood</option><option value="primary">Primary school</option><option value="secondary">Secondary school</option><option value="vocational">Vocational / technical</option><option value="higher">College / university</option><option value="adult">Adult / professional</option></select><input id="v50-study" placeholder="Study / field (optional)"></div>
    <div class="v50-controls2"><select id="v50-radius"><option value="10">Within 10 km</option><option value="25">Within 25 km</option><option value="50" selected>Within 50 km</option><option value="100">Within 100 km</option><option value="150">Within 150 km</option></select><select id="v50-sort"><option value="worst">Worst → best match</option><option value="best">Best match first</option></select><button class="secondary" id="v50-location-btn">Use my current location</button><button class="v50-search" id="v50-go">Search with <span>SCHOLARK</span></button></div>
    <div class="v50-location" id="v50-location">Enter the country you are in or travelling to. Add a city/area for much better nearby results, or use your real location.</div>
    <div class="v50-info">The SCHOLARK score is a <b>fit score, not an official academic-quality ranking</b>. It uses requested level, distance, available school/contact information and optional study relevance. Always check official school information before deciding.</div><div class="v50-toolbar"><strong id="v50-count">Ready to search</strong></div><div class="v50-results" id="v50-results"></div></div>`;
    document.body.appendChild(root);$('#v50-go').onclick=search;$('#v50-location-btn').onclick=useLocation;$('.v50-x',root).onclick=close;
  }

  async function useLocation(){
    const loc=$('#v50-location'),btn=$('#v50-location-btn');btn.disabled=true;loc.textContent='Requesting your current location…';
    try{currentPos=await geo();const r=await reverse(currentPos);const a=r.address||{};$('#v50-country').value=a.country||'';$('#v50-city').value=a.city||a.town||a.village||a.suburb||'';loc.textContent=`Current location ready · accuracy about ${Math.round(currentPos.accuracy||0)} m · ${r.display_name||''}`}
    catch{currentPos=null;loc.textContent='Your location could not be read. Enter country + city/area manually.'}finally{btn.disabled=false}
  }

  async function search(){
    const country=$('#v50-country').value.trim(),city=$('#v50-city').value.trim(),level=$('#v50-level').value,study=$('#v50-study').value.trim(),radius=+$ ('#v50-radius').value||50,sort=$('#v50-sort').value,h=$('#v50-results'),loc=$('#v50-location');
    if(!country){h.innerHTML='<div class="v50-state err">Tell SCHOLARK which country you are in or going to first.</div>';return $('#v50-country').focus()}
    h.innerHTML='<div class="v50-state">Finding schools and calculating fit scores…</div>';
    let pos=currentPos;
    try{if(!pos||city){const g=await geocode(country,city);pos={lat:g.lat,lon:g.lon};loc.textContent=`Searching around ${g.display}.`}else loc.textContent=`Searching around your current location in ${country}.`;const [raw,wiki]=await Promise.all([overpass(pos,radius),wikiGeo(pos,radius)]);const local=raw.map(e=>fromOsm(e,pos)).filter(Boolean),wikiItems=wiki.map(x=>({...x,level:'school'})),items=merge(local,wikiItems);render(items,{country,city,level,study,radius,sort})}
    catch(e){h.innerHTML='<div class="v50-state err">The school sources did not respond correctly. Try again, add a city/area, or reduce the search radius.</div>';loc.textContent='Search could not be completed.'}
  }

  function open(){build();root.classList.add('open');history.replaceState(null,'',location.pathname+location.search+'#schools');requestAnimationFrame(()=>$('#v50-country')?.focus())}
  function close(){root?.classList.remove('open')}
  window.__SCHOLARK_V50_SCHOOLS__={open,close,build,search,useLocation};
  build();
})();