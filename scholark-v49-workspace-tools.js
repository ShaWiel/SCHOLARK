(() => {
  if (window.__SCHOLARK_V49_WORKSPACE_TOOLS__) return;
  window.__SCHOLARK_V49_WORKSPACE_TOOLS__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const toolLabels={
    tutor:['ai tutor','tutor ai'],
    education:['education & learning','educatie & leren','onderwijs & leren','education'],
    planner:['planner'],progress:['progress','voortgang'],goal:['goals','doelen','goal'],project:['my projects','mijn projecten','projects','projecten']
  };
  let activeNative=null, rescueTimer=null, schoolsDialog=null;

  const style=document.createElement('style');
  style.id='scholark-v49-style';
  style.textContent=`
    /* Book Studio is a standalone workspace tool, not a Studio AI mode. */
    #v41-studio-workspace .v41-mode[data-mode="book"],#v29-home-layer .v29-type[data-mode="book"],#v29-home-layer .v29-tab[data-mode="book"]{display:none!important}
    #v41-studio-workspace .v41-modes{grid-template-columns:repeat(5,minmax(0,1fr))!important}

    /* V49 owns native workspace rescue after the legacy navigation click. */
    body.v49-native-open #v48-dashboard{display:none!important}
    body.v49-native-open #v29-home-layer,body.v49-native-open #v28-home{display:none!important}
    body.v49-native-open [data-v30-legacy-home="1"],body.v49-native-open .v49-native-host{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    .v49-native-panel{position:fixed!important;left:var(--v49-left,258px)!important;top:0!important;right:0!important;bottom:0!important;z-index:2147481200!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;overflow:auto!important;background:#f4f3ef!important;margin:0!important;max-width:none!important;max-height:none!important;width:auto!important;height:auto!important;transform:none!important}

    /* Official workspace brand mark: SCHOLARK S + graduation cap. */
    #v48-sidebar .v48-logo{background:transparent!important;width:42px!important;height:42px!important;border-radius:0!important;overflow:visible!important;flex:0 0 42px!important}
    #v48-sidebar .v48-logo svg{width:42px;height:42px;display:block}

    #v49-sidebar-toggle{position:fixed;z-index:2147483301;top:86px;left:238px;width:34px;height:34px;border:1px solid rgba(255,255,255,.18);border-radius:11px;background:#17191f;color:#c9ff6a;box-shadow:0 10px 28px rgba(0,0,0,.22);cursor:pointer;font:950 20px/1 Inter;display:grid;place-items:center;transition:left .22s ease,transform .2s ease}
    #v49-sidebar-toggle:hover{transform:scale(1.04)}
    body.v49-sidebar-collapsed #v48-sidebar{width:76px!important;min-width:76px!important;max-width:76px!important;padding-left:8px!important;padding-right:8px!important}
    body.v49-sidebar-collapsed #v48-sidebar .v48-brand{justify-content:center;padding-left:0!important;padding-right:0!important}
    body.v49-sidebar-collapsed #v48-sidebar .v48-brand>div:last-child,body.v49-sidebar-collapsed #v48-sidebar .v48-nav span,body.v49-sidebar-collapsed #v48-sidebar .v48-nav-title,body.v49-sidebar-collapsed #v48-sidebar .v48-nav em,body.v49-sidebar-collapsed #v48-sidebar .v48-quality{display:none!important}
    body.v49-sidebar-collapsed #v48-sidebar .v48-nav{justify-content:center!important;padding:9px!important}
    body.v49-sidebar-collapsed #v48-sidebar .v48-nav i{width:32px!important;height:32px!important}
    body.v49-sidebar-collapsed #v48-dashboard{left:76px!important}
    body.v49-sidebar-collapsed .v49-native-panel{left:76px!important}
    body.v49-sidebar-collapsed #v49-sidebar-toggle{left:58px!important}
    body:not(.v49-sidebar-collapsed) #v49-sidebar-toggle{left:240px}
    @media(max-width:1050px){body:not(.v49-sidebar-collapsed) #v49-sidebar-toggle{left:202px}.v49-native-panel{left:220px!important}}
    @media(max-width:720px){#v49-sidebar-toggle{top:72px}body:not(.v49-sidebar-collapsed) #v49-sidebar-toggle{left:58px}.v49-native-panel{left:74px!important}}

    /* Worldwide study-aware school finder. */
    #v49-schools{position:fixed;inset:0;z-index:2147483645;background:rgba(8,9,13,.72);backdrop-filter:blur(12px);display:none;align-items:center;justify-content:center;padding:22px;font-family:Inter,system-ui,sans-serif}
    #v49-schools.open{display:flex}.v49-schoolbox{width:min(1050px,96vw);max-height:92vh;overflow:auto;border-radius:28px;background:#f7f6f1;color:#17191f;box-shadow:0 34px 110px rgba(0,0,0,.38);padding:26px;box-sizing:border-box}.v49-schoolhead{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.v49-schoolhead small{display:block;color:#6d5dfc;font:950 8px Inter;letter-spacing:.14em}.v49-schoolhead h2{font:950 34px/1 Inter;margin:6px 0 8px;letter-spacing:-.04em}.v49-schoolhead p{font:600 11px/1.5 Inter;color:#706c77;margin:0;max-width:720px}.v49-close{width:38px;height:38px;border:0;border-radius:50%;background:#e9e7ed;font-size:20px;cursor:pointer}.v49-schoolcontrols{display:grid;grid-template-columns:minmax(0,1fr) 190px auto;gap:8px;margin:18px 0 9px}.v49-schoolcontrols input,.v49-schoolcontrols select{border:1px solid rgba(23,25,31,.12);background:#fff;border-radius:13px;padding:12px 13px;font:700 11px Inter;outline:0}.v49-schoolcontrols button{border:0;border-radius:13px;background:#17191f;color:#fff;padding:12px 15px;font:900 10px Inter;cursor:pointer}.v49-schoolcontrols button span{color:#c9ff6a}.v49-loc{font:700 9px Inter;color:#777;margin-bottom:13px}.v49-results{display:grid;gap:9px}.v49-school{border:1px solid rgba(23,25,31,.09);background:#fff;border-radius:17px;padding:14px;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start}.v49-school h3{font:900 13px/1.2 Inter;margin:0 0 5px}.v49-school p{font:600 9.5px/1.45 Inter;color:#6f6a75;margin:2px 0}.v49-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.v49-tag{border-radius:999px;background:#f0edff;color:#5748d6;padding:5px 7px;font:850 7.5px Inter}.v49-tag.near{background:#efffcf;color:#425e10}.v49-links{display:grid;gap:6px;min-width:120px}.v49-links a{border-radius:10px;padding:8px 9px;background:#17191f;color:#fff;text-decoration:none;text-align:center;font:850 8px Inter}.v49-links a.alt{background:#eeecf4;color:#312d39}.v49-note{border-radius:13px;padding:10px 11px;background:#ece9ff;color:#4f466d;font:650 9px/1.45 Inter;margin-bottom:10px}.v49-loading{padding:22px;border-radius:15px;background:#fff;font:750 10px Inter;color:#666}.v49-error{padding:14px;border-radius:15px;background:#fff1ef;color:#7b332b;font:750 10px/1.45 Inter}
    @media(max-width:700px){.v49-schoolcontrols{grid-template-columns:1fr}.v49-school{grid-template-columns:1fr}.v49-links{grid-template-columns:1fr 1fr}.v49-schoolbox{padding:18px}}
  `;
  document.head.appendChild(style);

  function officialLogo(){return `<svg viewBox="0 0 48 48" aria-label="SCHOLARK logo" role="img"><rect x="3" y="5" width="42" height="40" rx="13" fill="#c9ff6a"/><path d="M31.7 17.2c-2.2-1.4-4.8-2.1-7.5-2.1-4.7 0-7.8 2.2-7.8 5.5 0 3.6 3 4.7 7.2 5.6 3.7.8 5.1 1.4 5.1 3 0 1.8-1.9 3-4.7 3-3 0-5.8-1-8.4-3l-3 4.2c3 2.6 7 4 11.3 4 5.8 0 9.7-2.7 9.7-7 0-3.9-2.8-5.1-7.4-6.1-3.8-.9-4.9-1.3-4.9-2.8 0-1.4 1.4-2.4 3.8-2.4 2.4 0 4.5.7 6.5 1.9l2.9-3.8Z" fill="#17191f"/><path d="M12 10.5 24 4.7l12 5.8-12 5.8-12-5.8Z" fill="#6d5dfc"/><path d="M17 13.4v4.4c4.4 2.5 9.6 2.5 14 0v-4.4l-7 3.4-7-3.4Z" fill="#5a4ad6"/><path d="M36 10.7v7.1" stroke="#6d5dfc" stroke-width="2" stroke-linecap="round"/><circle cx="36" cy="19.2" r="1.8" fill="#6d5dfc"/></svg>`;}

  function removeBookFromStudio(){
    $$('.v41-mode[data-mode="book"],.v29-type[data-mode="book"],.v29-tab[data-mode="book"]').forEach(el=>{el.remove();});
    const studio=$('#v41-studio-workspace');
    if(studio&&$('.v41-mode.active[data-mode="book"]',studio))$('.v41-mode[data-mode="presentation"]',studio)?.click();
  }

  function enhanceSidebar(){
    const side=$('#v48-sidebar');if(!side)return;
    const logo=$('.v48-logo',side);if(logo&&!logo.dataset.v49Logo){logo.dataset.v49Logo='1';logo.innerHTML=officialLogo();}
    let toggle=$('#v49-sidebar-toggle');if(!toggle){toggle=document.createElement('button');toggle.id='v49-sidebar-toggle';toggle.type='button';document.body.appendChild(toggle);toggle.onclick=()=>setCollapsed(!document.body.classList.contains('v49-sidebar-collapsed'));}
    setCollapsed(localStorage.getItem('scholark_v49_sidebar_collapsed')==='1',false);
  }
  function setCollapsed(on,save=true){document.body.classList.toggle('v49-sidebar-collapsed',!!on);const b=$('#v49-sidebar-toggle');if(b){b.textContent=on?'›':'‹';b.title=on?'Open sidebar':'Close sidebar';b.setAttribute('aria-label',b.title);}if(save)localStorage.setItem('scholark_v49_sidebar_collapsed',on?'1':'0');setNativeLeft();}
  function setNativeLeft(){document.documentElement.style.setProperty('--v49-left',document.body.classList.contains('v49-sidebar-collapsed')?'76px':(innerWidth<=1050?'220px':'258px'));}

  function forceMaxQuality(){
    localStorage.setItem('scholark_ai_quality','highest');localStorage.setItem('scholark_default_ai_quality','highest');localStorage.setItem('scholark_workspace_quality','highest');
    const q=$('#v41-quality');if(q&&[...q.options].some(o=>o.value==='highest'))q.value='highest';
    const d=$('#v45-depth');if(d&&[...d.options].some(o=>o.value==='expert'))d.value='expert';
    ['v45-strict','v45-research','v45-factcheck','v45-visuals','v45-autopolish','v41-citations','v41-sources'].forEach(id=>{const e=$('#'+id);if(e&&'checked'in e)e.checked=true;});
  }

  function isBadNative(el){return !el||el.closest('#v48-sidebar,#v48-dashboard,#v48-return-home,#v49-sidebar-toggle,#v29-home-layer,#v41-studio-workspace,#sv24-overlay,.v25-dialog,#v49-schools');}
  function nativeTrigger(id){
    const aliases=toolLabels[id]||[id];
    return $$('button,a,[role="button"],[tabindex]')
      .filter(el=>!isBadNative(el)&&text(el).length>0&&text(el).length<100)
      .map(el=>({el,t:lower(el),vis:!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)}))
      .filter(o=>aliases.some(a=>o.t===a||o.t===a+'s'||o.t.startsWith(a+' ')))
      .sort((a,b)=>(aliases.includes(a.t)?0:1)-(aliases.includes(b.t)?0:1)||(a.vis?0:1)-(b.vis?0:1))[0]?.el||null;
  }

  function clearNativePanel(){
    clearInterval(rescueTimer);rescueTimer=null;document.body.classList.remove('v49-native-open');
    if(activeNative){activeNative.classList.remove('v49-native-panel');activeNative.style.removeProperty('--v49-left');}
    activeNative=null;$$('.v49-native-host').forEach(el=>el.classList.remove('v49-native-host'));
  }

  function candidateFor(id){
    const aliases=toolLabels[id]||[id];
    const headings=$$('h1,h2,h3,h4,h5,[role="heading"],strong,b')
      .filter(el=>!isBadNative(el)&&aliases.some(a=>lower(el)===a||lower(el).startsWith(a+' ')));
    const scored=[];
    for(const h of headings){
      let cur=h;for(let depth=0;cur&&cur!==document.body&&depth<7;depth++,cur=cur.parentElement){
        if(isBadNative(cur))continue;const t=lower(cur),len=text(cur).length;
        const navHits=['dashboard','studio ai','ai tutor','education & learning','planner','progress','goals','my projects'].filter(x=>t.includes(x)).length;
        const interactive=cur.querySelectorAll('input,textarea,select,button,a,[role="button"],canvas,svg').length;
        const score=(navHits<=2?80:0)+(interactive?Math.min(interactive,10)*3:0)+(len>40&&len<12000?30:0)-depth*3-navHits*18;
        if(score>45)scored.push({el:cur,score,len,depth});
      }
    }
    if(!scored.length){
      $$('main,[role="main"],section').filter(el=>!isBadNative(el)).forEach(el=>{const t=lower(el);if(aliases.some(a=>t.includes(a))){const hits=['dashboard','studio ai','planner','progress','goals','my projects'].filter(x=>t.includes(x)).length;if(hits<=2)scored.push({el,score:35,len:text(el).length,depth:0});}});
    }
    return scored.sort((a,b)=>b.score-a.score||a.len-b.len)[0]?.el||null;
  }

  function unhideChain(panel){
    let cur=panel;for(let i=0;cur&&cur!==document.body&&i<8;i++,cur=cur.parentElement){
      if(cur.id==='v29-home-layer'||cur.id==='v41-studio-workspace')break;
      cur.hidden=false;cur.removeAttribute?.('aria-hidden');delete cur.dataset?.v30LegacyHome;delete cur.dataset?.v46RetiredPublicHome;
      ['display','visibility','opacity','pointer-events','transform','max-height','height'].forEach(p=>cur.style?.removeProperty(p));cur.classList.add('v49-native-host');
    }
  }

  function rescueNative(id){
    const panel=candidateFor(id);if(!panel)return false;
    if(activeNative&&activeNative!==panel)activeNative.classList.remove('v49-native-panel');
    activeNative=panel;unhideChain(panel);panel.classList.add('v49-native-panel');document.body.classList.add('v49-native-open');setNativeLeft();return true;
  }

  function openNative(id){
    clearNativePanel();forceMaxQuality();
    const trigger=nativeTrigger(id);if(!trigger)return false;
    try{trigger.click();}catch{return false;}
    history.replaceState(null,'',location.pathname+location.search+'#'+id);
    document.body.classList.add('v48-workspace');$('#v48-dashboard')?.setAttribute('hidden','');
    let tries=0;rescueTimer=setInterval(()=>{tries++;const ok=rescueNative(id);if(ok&&tries>=4){clearInterval(rescueTimer);rescueTimer=null;}else if(tries>=18){clearInterval(rescueTimer);rescueTimer=null;}},100);
    setTimeout(()=>rescueNative(id),35);return true;
  }

  function schoolDialog(){
    if(schoolsDialog)return schoolsDialog;
    schoolsDialog=document.createElement('div');schoolsDialog.id='v49-schools';schoolsDialog.innerHTML=`<div class="v49-schoolbox"><div class="v49-schoolhead"><div><small>SCHOLARK · SCHOOL FINDER</small><h2>Find schools for the study you actually want.</h2><p>Search near your real location or worldwide. Type any study, field or programme — the search is not limited to a fixed list.</p></div><button class="v49-close" aria-label="Close">×</button></div><div class="v49-schoolcontrols"><input id="v49-study" placeholder="What do you want to study? e.g. Law, Medicine, Aerospace Engineering"><select id="v49-scope"><option value="near">Near my real location</option><option value="world">Worldwide</option></select><button id="v49-search">Search with <span>SCHOLARK</span></button></div><div class="v49-loc" id="v49-loc">Choose a study first. Location is requested only for Near me.</div><div class="v49-note">Results combine nearby education places with worldwide academic-institution relevance. Always use “Check programme” to verify the exact degree on the institution’s own site.</div><div class="v49-results" id="v49-results"></div></div>`;document.body.appendChild(schoolsDialog);
    $('.v49-close',schoolsDialog).onclick=()=>schoolsDialog.classList.remove('open');schoolsDialog.onclick=e=>{if(e.target===schoolsDialog)schoolsDialog.classList.remove('open');};$('#v49-search',schoolsDialog).onclick=runSchoolSearch;return schoolsDialog;
  }
  function openSchools(){clearNativePanel();schoolDialog().classList.add('open');setTimeout(()=>$('#v49-study')?.focus(),60);history.replaceState(null,'',location.pathname+location.search+'#schools');}

  function getLocation(){return new Promise((resolve,reject)=>{if(!navigator.geolocation)return reject(new Error('Geolocation is not supported by this browser.'));navigator.geolocation.getCurrentPosition(p=>resolve({lat:p.coords.latitude,lon:p.coords.longitude,accuracy:p.coords.accuracy}),reject,{enableHighAccuracy:true,timeout:15000,maximumAge:300000});});}
  const rad=x=>x*Math.PI/180;
  function distanceKm(a,b,c,d){const R=6371,dp=rad(c-a),dl=rad(d-b),q=Math.sin(dp/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(dl/2)**2;return 2*R*Math.asin(Math.sqrt(q));}

  async function fetchJSON(url,timeout=14000){const ctrl=new AbortController(),tm=setTimeout(()=>ctrl.abort(),timeout);try{const r=await fetch(url,{signal:ctrl.signal,headers:{Accept:'application/json'}});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(tm);}}

  async function nearbyOsm(study,pos){
    if(!pos)return[];const radius=120000;const q=`[out:json][timeout:20];(node["amenity"~"university|college|school"](around:${radius},${pos.lat},${pos.lon});way["amenity"~"university|college|school"](around:${radius},${pos.lat},${pos.lon});relation["amenity"~"university|college|school"](around:${radius},${pos.lat},${pos.lon}););out center tags 45;`;
    const endpoints=['https://overpass.kumi.systems/api/interpreter?data=','https://overpass-api.de/api/interpreter?data=','https://overpass.nchc.org.tw/api/interpreter?data='];let data=null;
    for(const ep of endpoints){try{data=await fetchJSON(ep+encodeURIComponent(q),12000);if(data?.elements)break;}catch{}}
    if(!data?.elements)return[];const words=study.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(x=>x.length>2);
    return data.elements.map(e=>{const la=e.lat??e.center?.lat,lo=e.lon??e.center?.lon,t=e.tags||{};if(la==null||lo==null)return null;const hay=[t.name,t.description,t.subject,t.faculty,t.department,t.education,t.operator,t.website].filter(Boolean).join(' ').toLowerCase();const studyHits=words.reduce((n,w)=>n+(hay.includes(w)?1:0),0);return{name:t.name||'Education institution',lat:la,lon:lo,city:t['addr:city']||t['addr:town']||t['addr:village']||'',country:t['addr:country']||'',website:t.website||t['contact:website']||'',type:t.amenity||'education',distance:distanceKm(pos.lat,pos.lon,la,lo),studyHits,source:'Nearby map'};}).filter(Boolean).sort((a,b)=>(b.studyHits-a.studyHits)||(a.distance-b.distance)).slice(0,18);
  }

  async function openAlexStudy(study,pos){
    const base='https://api.openalex.org/works?search='+encodeURIComponent(study)+'&per-page=1&group_by=authorships.institutions.id';let j=null;
    try{j=await fetchJSON(base,14000);}catch{try{j=await fetchJSON(base.replace('group_by=','group-by='),14000);}catch{return[];}}
    const groups=j?.group_by||j?.['group-by']||[];const top=groups.filter(g=>g.key).slice(0,24);
    const details=await Promise.allSettled(top.map(async g=>{const id=String(g.key).split('/').pop();const x=await fetchJSON('https://api.openalex.org/institutions/'+encodeURIComponent(id),9000);const geo=x.geo||{};const la=geo.latitude,lo=geo.longitude;return{name:x.display_name||g.key_display_name||'Institution',lat:la,lon:lo,city:geo.city||'',country:geo.country||'',website:x.home_page_url||'',type:x.type||'institution',distance:pos&&Number.isFinite(la)&&Number.isFinite(lo)?distanceKm(pos.lat,pos.lon,la,lo):null,studyHits:Math.log10((g.count||1)+1),researchCount:g.count||0,source:'Global study relevance'};}));
    return details.filter(x=>x.status==='fulfilled').map(x=>x.value);
  }

  function mergeSchools(a,b){const out=[],seen=new Set();for(const x of [...a,...b]){const k=x.name.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();if(!k||seen.has(k))continue;seen.add(k);out.push(x);}return out;}
  function schoolScore(x,scope){let s=(x.studyHits||0)*18+Math.log10((x.researchCount||0)+1)*10;if(scope==='near'&&x.distance!=null)s+=Math.max(0,45-Math.min(45,x.distance/3));if(x.website)s+=4;return s;}
  function programSearchUrl(x,study){const q=`${x.name} ${study} degree programme bachelor master`;return 'https://www.google.com/search?q='+encodeURIComponent(q);}
  function mapUrl(x){return Number.isFinite(x.lat)&&Number.isFinite(x.lon)?`https://www.openstreetmap.org/?mlat=${x.lat}&mlon=${x.lon}#map=15/${x.lat}/${x.lon}`:'';}
  function renderSchoolResults(items,study,scope){const host=$('#v49-results');if(!items.length){host.innerHTML='<div class="v49-error">No usable matches came back from the school sources. Try a broader study name or switch between Near me and Worldwide.</div>';return;}host.innerHTML=items.slice(0,18).map(x=>{const loc=[x.city,x.country].filter(Boolean).join(', ')||'Location available from institution data';const dist=x.distance!=null?`${x.distance.toFixed(x.distance<10?1:0)} km away`:'';const relevance=x.researchCount?`${x.researchCount.toLocaleString()} study-related academic works`:(x.studyHits?`${x.studyHits} study keyword match${x.studyHits===1?'':'es'}`:'Institution match — verify programme');const web=x.website&&/^https?:/i.test(x.website)?x.website:'';return `<article class="v49-school"><div><h3>${esc(x.name)}</h3><p>${esc(loc)}</p><p>${esc(relevance)}</p><div class="v49-tags">${dist?`<span class="v49-tag near">${esc(dist)}</span>`:''}<span class="v49-tag">${esc(x.type||'education')}</span><span class="v49-tag">${esc(x.source)}</span></div></div><div class="v49-links">${web?`<a href="${esc(web)}" target="_blank" rel="noopener">Official site ↗</a>`:''}<a class="alt" href="${esc(programSearchUrl(x,study))}" target="_blank" rel="noopener">Check programme ↗</a>${mapUrl(x)?`<a class="alt" href="${esc(mapUrl(x))}" target="_blank" rel="noopener">Map ↗</a>`:''}</div></article>`;}).join('');}

  async function runSchoolSearch(){
    const study=$('#v49-study')?.value.trim(),scope=$('#v49-scope')?.value||'near',host=$('#v49-results'),loc=$('#v49-loc');if(!study){$('#v49-study')?.focus();host.innerHTML='<div class="v49-error">Tell SCHOLARK what you want to study first.</div>';return;}host.innerHTML='<div class="v49-loading">Searching education sources and matching institutions to your study…</div>';let pos=null;
    if(scope==='near'){loc.textContent='Requesting your real location…';try{pos=await getLocation();loc.textContent=`Location allowed · accuracy about ${Math.round(pos.accuracy||0)} m · searching nearby + study-relevant institutions.`;}catch(e){loc.textContent='Location was not available, so SCHOLARK will still show worldwide study matches.';}}
    else loc.textContent='Worldwide mode · no location permission needed.';
    const [osm,global]=await Promise.all([scope==='near'&&pos?nearbyOsm(study,pos):Promise.resolve([]),openAlexStudy(study,pos)]);let all=mergeSchools(osm,global);all.sort((a,b)=>schoolScore(b,scope)-schoolScore(a,scope));if(scope==='near'&&pos){const local=all.filter(x=>x.distance!=null&&x.distance<=250);if(local.length>=4)all=[...local,...all.filter(x=>!local.includes(x))];}renderSchoolResults(all,study,scope);
  }

  function interceptWorkspaceTools(e){
    const btn=e.target.closest('[data-v48-tool]');if(!btn)return;const id=btn.dataset.v48Tool;if(id==='schools'){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openSchools();return;}if(!['tutor','education','planner','progress','goal','project'].includes(id))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const ok=openNative(id);if(!ok){const host=$('#v48-dashboard');host?.removeAttribute('hidden');history.replaceState(null,'',location.pathname+location.search+'#dashboard');}
  }

  document.addEventListener('click',interceptWorkspaceTools,true);
  addEventListener('hashchange',()=>{const h=(location.hash||'').toLowerCase();if(!/tutor|education|planner|progress|goal|project/.test(h))clearNativePanel();setTimeout(()=>{enhanceSidebar();removeBookFromStudio();forceMaxQuality();},20);});
  addEventListener('resize',setNativeLeft);
  new MutationObserver(()=>{clearTimeout(window.__v49sync);window.__v49sync=setTimeout(()=>{enhanceSidebar();removeBookFromStudio();forceMaxQuality();if(document.body.classList.contains('v49-native-open')&&activeNative)unhideChain(activeNative);},80);}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  setInterval(()=>{enhanceSidebar();removeBookFromStudio();if(document.body.classList.contains('v48-workspace'))forceMaxQuality();},700);
  setTimeout(()=>{enhanceSidebar();removeBookFromStudio();forceMaxQuality();setNativeLeft();},40);
})();