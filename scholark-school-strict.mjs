import http from 'node:http';

const VERSION='20260917-school-country-levels-v2';
const previousEmit=http.Server.prototype.emit;
const safeFetch=globalThis.fetch.bind(globalThis);
const PORT=Number(process.env.PORT||10000);
const OVERPASS=[
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass-api.de/api/interpreter'
];
const COUNTRY_CODES={
  suriname:'SR',netherlands:'NL',nederland:'NL','united states':'US',usa:'US','united kingdom':'GB',uk:'GB',
  germany:'DE',duitsland:'DE',france:'FR',frankrijk:'FR',spain:'ES',spanje:'ES',portugal:'PT',italy:'IT',
  italië:'IT',italie:'IT',brazil:'BR',brazilië:'BR',brazilie:'BR',canada:'CA',australia:'AU',australië:'AU',
  india:'IN','south africa':'ZA','zuid-afrika':'ZA',guyana:'GY','trinidad & tobago':'TT','trinidad and tobago':'TT',
  jamaica:'JM',belgium:'BE',belgië:'BE',belgie:'BE'
};

const clean=v=>String(v??'').replace(/\u0000/g,'').replace(/\s+/g,' ').trim();
const low=v=>clean(v).toLowerCase();
const json=(res,status,body)=>{if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(body))};
const readJson=req=>new Promise((resolve,reject)=>{let raw='',size=0;req.setEncoding('utf8');req.on('data',c=>{size+=Buffer.byteLength(c);if(size>200000){reject(new Error('Payload too large'));req.destroy();return}raw+=c});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch(e){reject(e)}});req.on('error',reject)});
const rad=x=>x*Math.PI/180;
function distance(a,b,c,d){const R=6371,p=rad(c-a),q=rad(d-b),z=Math.sin(p/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(q/2)**2;return 2*R*Math.asin(Math.sqrt(z))}
function expectedCode(country){return COUNTRY_CODES[low(country)]||''}
function sameCode(a,b){return clean(a).toUpperCase()&&clean(a).toUpperCase()===clean(b).toUpperCase()}

async function timedFetch(url,init={},ms=22000){const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),ms);try{return await safeFetch(url,{...init,signal:ctrl.signal})}finally{clearTimeout(timer)}}
async function geocode(country,city=''){
  const q=[city,country].filter(Boolean).join(', '),u=new URL('https://nominatim.openstreetmap.org/search');
  u.searchParams.set('format','jsonv2');u.searchParams.set('addressdetails','1');u.searchParams.set('limit','1');u.searchParams.set('q',q);
  const r=await timedFetch(u,{headers:{accept:'application/json','user-agent':'SCHOLARK/1.0 strict-school-search'}},9000);
  if(!r.ok)throw new Error('Geocoder HTTP '+r.status);
  const d=await r.json().catch(()=>null),row=d?.[0];if(!row)throw new Error('Place not found in selected country');
  const code=clean(row.address?.country_code).toUpperCase(),expected=expectedCode(country);
  if(expected&&code&&!sameCode(expected,code))throw new Error('The selected city/area is not in '+country);
  return{lat:Number(row.lat),lon:Number(row.lon),country:clean(row.address?.country||country),countryCode:code||expected,display:clean(row.display_name||q)};
}
async function resolveCenter(body,country,city){
  if(city)return geocode(country,city);
  const lat=Number(body.lat),lon=Number(body.lon),provided=clean(body.countryCode).toUpperCase(),expected=expectedCode(country);
  if(Number.isFinite(lat)&&Number.isFinite(lon)&&provided&&(!expected||sameCode(provided,expected))){return{lat,lon,country,countryCode:provided,display:country}}
  return geocode(country,'');
}

function levelSet(tags={},extra=''){
  const a=low(tags.amenity),n=low(tags.name||tags['name:en']||tags.operator),i=low(tags['isced:level']||tags.isced),sheet=low(tags.sheet),text=[n,low(extra),low(tags.education),low(tags.description),sheet].join(' '),out=new Set();
  const digits=new Set((i.match(/[0-8]/g)||[]));
  if(a==='kindergarten'||digits.has('0')||/preschool|pre-school|nursery|kindergarten|kleuter|peuter|voorschool|early childhood|maternelle|infantil/.test(text))out.add('early');
  if(digits.has('1')||/primary|elementary|basisschool|lagere school|\bglo\b|grundschule|école primaire|primaria/.test(text))out.add('primary');
  if(digits.has('2')||/lower secondary|junior secondary|middle school|junior high|sekundarstufe i|collège|secondaria di i|\bvoj\b|\bmulo\b|secundair i|secondary i|senior phase/.test(text))out.add('lower_secondary');
  if(digits.has('3')||digits.has('4')||/upper secondary|senior secondary|high school|sixth form|sekundarstufe ii|lycée|secondaria di ii|\bvos\b|\bhavo\b|\bvwo\b|grades? 9|grades? 10|grades? 11|grades? 12|fet\b/.test(text))out.add('upper_secondary');
  if(/technical|vocational|trade school|trade college|beroeps|technisch|polytechnic|\btvet\b|\bnatin\b|\bimeao\b|\bamto\b|\blbo\b|\bmbo\b|ausbildung|profissional|professional institute/.test(text))out.add('vocational');
  if(a==='university'||digits.has('5')||digits.has('6')||digits.has('7')||digits.has('8')||/university|universiteit|université|universität|universidad|università|faculty|faculteit|hogeschool|higher education|tertiary education|college of|institute of higher/.test(text))out.add('higher');
  if(a==='college'&&!out.has('upper_secondary'))out.add('higher');
  if(a==='language_school'||/adult education|adult learning|continuing education|training centre|training center|professional learning/.test(text))out.add('adult');
  if(a==='school'&&!out.size)out.add('school');
  return[...out];
}
function matchesLevel(levels,wanted){
  if(wanted==='all')return true;
  const set=new Set(levels||[]);
  if(wanted==='secondary')return set.has('lower_secondary');
  if(wanted==='vocational')return set.has('upper_secondary')||set.has('vocational');
  if(wanted==='higher')return set.has('higher');
  if(wanted==='adult')return set.has('adult');
  if(wanted==='primary')return set.has('primary');
  if(wanted==='early')return set.has('early');
  return set.has(wanted);
}
function publicLevel(levels){
  const s=new Set(levels||[]);
  if(s.has('higher'))return'higher';
  if(s.has('upper_secondary')||s.has('vocational'))return'vocational';
  if(s.has('lower_secondary'))return'secondary';
  if(s.has('primary'))return'primary';
  if(s.has('early'))return'early';
  if(s.has('adult'))return'adult';
  return'school';
}
function normalized(e,pos){
  const t=e.tags||{},lat=Number(e.lat??e.center?.lat),lon=Number(e.lon??e.center?.lon),name=clean(t.name||t['name:en']||t.operator||t.ref);
  if(!name||!Number.isFinite(lat)||!Number.isFinite(lon))return null;
  const description=[t.description,t.operator,t['addr:street'],t['addr:housenumber'],t['addr:city']||t['addr:town']||t['addr:village']].filter(Boolean).map(clean).join(' · '),levels=levelSet({...t,name},description);
  return{name,description,lat,lon,distance:distance(pos.lat,pos.lon,lat,lon),website:clean(t.website||t['contact:website']),phone:clean(t.phone||t['contact:phone']),email:clean(t.email||t['contact:email']),source:'OpenStreetMap',level:publicLevel(levels),levels,levelDetail:levels.join(','),tags:{...t}};
}
function officialRow(row){const levels=levelSet({...(row.tags||{}),name:row.name},row.description||'');return{...row,levels,level:publicLevel(levels),levelDetail:levels.join(',')}}
function dedupe(rows){const out=[],seen=new Set();for(const x of rows){const k=low(x?.name).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}

async function overpass(query){
  const failures=[];
  for(const endpoint of OVERPASS){
    try{const r=await timedFetch(endpoint,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded;charset=UTF-8',accept:'application/json','user-agent':'SCHOLARK/1.0 strict-school-search'},body:'data='+encodeURIComponent(query)},18000);if(!r.ok){failures.push(endpoint+' HTTP '+r.status);continue}const d=await r.json().catch(()=>null);if(Array.isArray(d?.elements))return{elements:d.elements,endpoint};failures.push(endpoint+' invalid JSON')}catch(e){failures.push(endpoint+' '+clean(e?.name==='AbortError'?'timeout':e?.message||e))}
  }
  const e=new Error('Strict country school sources unavailable');e.failures=failures;throw e;
}
function countryAreaQuery(country,countryCode,pos,radius,national){
  const iso=clean(countryCode).toUpperCase().replace(/[^A-Z]/g,'').slice(0,2),safeName=clean(country).replace(/["\\]/g,''),around=`(around:${Math.round(radius*1000)},${pos.lat},${pos.lon})`,scope=national?'(area.country)':`(area.country)${around}`;
  const area=iso?`area["ISO3166-1"="${iso}"]["admin_level"="2"]->.country;`:`area["name"="${safeName}"]["boundary"="administrative"]["admin_level"="2"]->.country;`;
  return`[out:json][timeout:18];${area}(nwr${scope}["amenity"~"kindergarten|school|college|university|language_school"];nwr${scope}["building"="school"];nwr${scope}["office"="educational_institution"];);out center tags 1800;`;
}
async function baseSearch(body){
  try{const r=await timedFetch(`http://127.0.0.1:${PORT}/api/schools/search`,{method:'POST',headers:{'content-type':'application/json','x-scholark-school-base':'1'},body:JSON.stringify(body)},45000);return await r.json().catch(()=>null)}catch{return null}
}

async function discover(body){
  const country=clean(body.country||'Suriname')||'Suriname',city=clean(body.city),level=clean(body.level||'all').toLowerCase(),radius=Math.max(1,Math.min(700,Number(body.radius)||50)),center=await resolveCenter(body,country,city);
  if(!Number.isFinite(center.lat)||!Number.isFinite(center.lon))throw new Error('Selected place could not be resolved');
  const countryCode=center.countryCode||expectedCode(country),national=/^suriname$/i.test(country)&&!city,query=countryAreaQuery(country,countryCode,center,radius,national),sourceStatus=[];
  let rows=[],provider='OpenStreetMap country-boundary search';
  try{const o=await overpass(query);sourceStatus.push({source:o.endpoint,ok:true,count:o.elements.length});rows=o.elements.map(e=>normalized(e,center)).filter(Boolean)}catch(e){sourceStatus.push(...(e.failures||[]).map(source=>({source,ok:false})));rows=[]}
  rows=rows.filter(x=>matchesLevel(x.levels,level));
  if(!national)rows=rows.filter(x=>x.distance<=radius+1);

  if(/^suriname$/i.test(country)&&!city){
    const base=await baseSearch({country:'Suriname',city:'',level:'all',radius:700});
    const official=(base?.schools||[]).filter(x=>String(x.source||'').startsWith('MinOWC official school list')).map(officialRow).filter(x=>matchesLevel(x.levels,level));
    if(official.length){rows=dedupe([...official,...rows]);provider='MinOWC official school list + '+provider;sourceStatus.unshift({source:'MinOWC official school list',ok:true,count:official.length})}
  }

  rows=dedupe(rows).sort((a,b)=>(a.distance??9999)-(b.distance??9999)||a.name.localeCompare(b.name));
  console.log(`[SCHOLARK] Strict school search ${country}${city?', '+city:''} · level ${level} · ${rows.length} matches · country ${countryCode||'unknown'}`);
  return{ok:true,strictCountry:true,country,city,level,radius,national,center:{lat:center.lat,lon:center.lon,countryCode,display:center.display},provider,sourceStatus,count:rows.length,schools:rows.slice(0,1500),taxonomy:{version:VERSION,secondary:'lower_secondary',vocational:'upper_secondary_or_vocational',higher:'higher_only',genericSchoolMatchesSpecific:false}};
}

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return previousEmit.call(this,type,...args);
  const[req,res]=args;let pathname='';try{pathname=new URL(req.url||'/','http://localhost').pathname}catch{return previousEmit.call(this,type,...args)}
  if(req.headers?.['x-scholark-school-base']==='1')return previousEmit.call(this,type,...args);
  if(req.method==='GET'&&pathname==='/api/schools/health'){
    json(res,200,{ok:true,strictCountry:true,version:VERSION,providers:['OpenStreetMap country-boundary search','MinOWC official Suriname school list','Photon geocoder fallback'],levels:{early:'ISCED 0 / early childhood',primary:'ISCED 1 / primary',secondary:'lower secondary only',vocational:'upper secondary or vocational/technical',higher:'higher education only',adult:'adult/professional learning'}});return true;
  }
  if(req.method==='POST'&&pathname==='/api/schools/search'){
    readJson(req).then(discover).then(x=>json(res,200,x)).catch(e=>json(res,400,{ok:false,strictCountry:true,error:clean(e?.message||e),version:VERSION}));return true;
  }
  return previousEmit.call(this,type,...args);
};

console.log('[SCHOLARK] Strict school country + level search '+VERSION+' ready');