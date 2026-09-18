import http from 'node:http';

const VERSION='20260918-school-suriname-taxonomy-v4';
const previousEmit=http.Server.prototype.emit;
const safeFetch=globalThis.fetch.bind(globalThis);
const OVERPASS=[
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass-api.de/api/interpreter'
];
const SR_OFFICIAL_URL='https://gov.sr/wp-content/uploads/2022/10/Lijst-met-Scholen-Suriname-1.xlsx';
const COUNTRY_CODES={
  suriname:'SR',netherlands:'NL',nederland:'NL','united states':'US',usa:'US','united kingdom':'GB',uk:'GB',
  germany:'DE',duitsland:'DE',france:'FR',frankrijk:'FR',spain:'ES',spanje:'ES',portugal:'PT',italy:'IT',
  italië:'IT',italie:'IT',brazil:'BR',brazilië:'BR',brazilie:'BR',canada:'CA',australia:'AU',australië:'AU',
  india:'IN','south africa':'ZA','zuid-afrika':'ZA',guyana:'GY','trinidad & tobago':'TT','trinidad and tobago':'TT',
  jamaica:'JM',belgium:'BE',belgië:'BE',belgie:'BE'
};
let officialCache=null;
let officialPromise=null;
const SURINAME_KNOWN_HIGHER=[
  {
    name:'Anton de Kom Universiteit van Suriname (AdeKUS)',
    description:'WO / Universiteit · AdeKUS · Paramaribo',
    lat:null,lon:null,distance:null,website:'',phone:'',email:'',
    source:'SCHOLARK Suriname education directory',
    level:'wo',levels:['higher','wo'],levelDetail:'higher,wo',
    official:false,tags:{city:'Paramaribo',district:'Paramaribo',education:'university',name:'Anton de Kom Universiteit van Suriname AdeKUS','addr:country':'SR'}
  }
];

const clean=v=>String(v??'').replace(/\u0000/g,'').replace(/\s+/g,' ').trim();
const low=v=>clean(v).toLowerCase();
const key=v=>low(v).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
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
  const vwoLike=/\bvwo\b|atheneum|gymnasium|voorbereidend wetenschappelijk|pre[- ]?university|preuniversit/.test(text);
  const kindergartenLike=a==='kindergarten'||digits.has('0')||/preschool|pre-school|nursery|kindergarten|kleuterschool|kleuteronderwijs|kleuter|peuter|voorschool|early childhood|maternelle|infantil/.test(text);
  if(kindergartenLike){out.add('early');out.add('kindergarten')}
  if(digits.has('1')||/primary|elementary|basisschool|lagere school|\bglo\b|grundschule|école primaire|primaria/.test(text))out.add('primary');
  if(/\bmulo\b/.test(text)){out.add('lower_secondary');out.add('mulo')}
  if(/\blbo\b/.test(text)){out.add('lower_secondary');out.add('vocational');out.add('lbo')}
  if(digits.has('2')||/lower secondary|junior secondary|middle school|junior high|sekundarstufe i|collège|secondaria di i|\bvoj\b|secundair i|secondary i|senior phase/.test(text))out.add('lower_secondary');
  if(/\bhavo\b/.test(text)){out.add('upper_secondary');out.add('havo')}
  if(vwoLike){out.add('upper_secondary');out.add('vwo')}
  if(/\bnatin\b|\bimeao\b|kweekschool|\bmbo\b/.test(text)){out.add('upper_secondary');out.add('vocational');out.add('mbo')}
  if(digits.has('3')||digits.has('4')||/upper secondary|senior secondary|high school|sixth form|sekundarstufe ii|lycée|secondaria di ii|\bvos\b|grades? 9|grades? 10|grades? 11|grades? 12|fet\b/.test(text))out.add('upper_secondary');
  if(/technical|vocational|trade school|trade college|beroeps|technisch|polytechnic|\btvet\b|\bamto\b|ausbildung|profissional|professional institute/.test(text))out.add('vocational');
  if(/\bhbo\b|hogeschool|university of applied sciences/.test(text)){out.add('higher');out.add('hbo')}
  if(/\badekus\b|anton de kom|a?dekus|university|universiteit|université|universität|universidad|università|faculty|faculteit/.test(text)){out.add('higher');out.add('wo')}
  if(digits.has('5')||digits.has('6')||digits.has('7')||digits.has('8')||/higher education|tertiary education|college of|institute of higher/.test(text))out.add('higher');
  if(a==='college'&&!out.has('upper_secondary'))out.add('higher');
  if(a==='language_school'||/adult education|adult learning|continuing education|training centre|training center|professional learning/.test(text))out.add('adult');
  if(a==='school'&&!out.size)out.add('school');
  return[...out];
}
function matchesLevel(levels,wanted){
  if(wanted==='all')return true;
  const set=new Set(levels||[]);
  if(wanted==='secondary'||wanted==='lower_secondary')return set.has('lower_secondary');
  if(wanted==='upper_secondary')return set.has('upper_secondary');
  if(wanted==='vocational')return set.has('upper_secondary')||(set.has('vocational')&&!set.has('lower_secondary'));
  if(wanted==='higher')return set.has('higher');
  if(wanted==='adult')return set.has('adult');
  if(wanted==='primary')return set.has('primary');
  if(wanted==='early'||wanted==='kindergarten')return set.has('kindergarten')||set.has('early');
  if(['mulo','lbo','havo','vwo','mbo','hbo','wo'].includes(wanted))return set.has(wanted);
  return set.has(wanted);
}
function publicLevel(levels){
  const s=new Set(levels||[]);
  if(s.has('wo'))return'wo';
  if(s.has('hbo'))return'hbo';
  if(s.has('mbo'))return'mbo';
  if(s.has('vwo'))return'vwo';
  if(s.has('havo'))return'havo';
  if(s.has('lbo'))return'lbo';
  if(s.has('mulo'))return'mulo';
  if(s.has('kindergarten'))return'kindergarten';
  if(s.has('higher'))return'higher';
  if(s.has('upper_secondary'))return'upper_secondary';
  if(s.has('lower_secondary'))return'secondary';
  if(s.has('vocational'))return'vocational';
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

function decodeHtml(s=''){return String(s).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#x2F;/g,'/').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function cellCol(ref=''){const letters=String(ref).match(/^[A-Z]+/i)?.[0]?.toUpperCase()||'';let n=0;for(const ch of letters)n=n*26+(ch.charCodeAt(0)-64);return Math.max(0,n-1)}
function normHeader(v){return key(v)}
function xmlValue(raw){return decodeHtml(String(raw||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1'))}
function sharedStringsFrom(xml){return[...String(xml||'').matchAll(/<si\b[\s\S]*?<\/si>/gi)].map(m=>clean([...m[0].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/gi)].map(x=>xmlValue(x[1])).join('')))}
function rowCells(rowXml,shared){const out=[];for(const m of String(rowXml||'').matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/gi)){const attrs=m[1]||'',body=m[2]||'',ref=(attrs.match(/\br="([^"]+)"/i)||[])[1]||'',type=(attrs.match(/\bt="([^"]+)"/i)||[])[1]||'';let value='';if(type==='inlineStr')value=[...body.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/gi)].map(x=>xmlValue(x[1])).join(' ');else{const raw=(body.match(/<v>([\s\S]*?)<\/v>/i)||[])[1]??'';value=type==='s'?shared[Number(raw)]??'':xmlValue(raw)}out[cellCol(ref)]=clean(value)}return out}
async function officialSurinameSchools(){
  if(officialCache&&Date.now()-officialCache.at<6*60*60*1000)return officialCache.rows;
  if(officialPromise)return officialPromise;
  officialPromise=(async()=>{
    try{
      const response=await timedFetch(SR_OFFICIAL_URL,{headers:{accept:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','user-agent':'SCHOLARK/1.0 strict-school-roster'}},16000);
      if(!response.ok)throw new Error('Official school roster HTTP '+response.status);
      const buffer=Buffer.from(await response.arrayBuffer());if(buffer.length<1000||buffer.length>20*1024*1024)throw new Error('Official school roster returned an unexpected file size');
      const mod=await import('jszip'),JSZip=mod.default||mod,zip=await JSZip.loadAsync(buffer,{checkCRC32:false});
      const sharedXml=await zip.file('xl/sharedStrings.xml')?.async('string').catch(()=>''),shared=sharedStringsFrom(sharedXml||''),workbook=await zip.file('xl/workbook.xml')?.async('string'),rels=await zip.file('xl/_rels/workbook.xml.rels')?.async('string');
      if(!workbook||!rels)throw new Error('Official school workbook structure is incomplete');
      const targets={};for(const m of rels.matchAll(/<Relationship\b([^>]*)\/?>(?:<\/Relationship>)?/gi)){const attrs=m[1]||'',id=(attrs.match(/\bId="([^"]+)"/i)||[])[1],target=(attrs.match(/\bTarget="([^"]+)"/i)||[])[1];if(id&&target)targets[id]=target.replace(/^\//,'')}
      const sheets=[];for(const m of workbook.matchAll(/<sheet\b([^>]*)\/?>(?:<\/sheet>)?/gi)){const attrs=m[1]||'',name=xmlValue((attrs.match(/\bname="([^"]+)"/i)||[])[1]||''),rid=(attrs.match(/\br:id="([^"]+)"/i)||[])[1];let target=targets[rid]||'';if(target&&!target.startsWith('xl/'))target='xl/'+target.replace(/^\.\//,'');if(name&&target)sheets.push({name,target})}
      const rows=[];
      for(const sheet of sheets){
        const xml=await zip.file(sheet.target)?.async('string');if(!xml)continue;
        const parsed=[...xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/gi)].map(m=>rowCells(m[1],shared));let headerIndex=-1,header=[];
        for(let i=0;i<Math.min(parsed.length,25);i++){const normalized=parsed[i].map(normHeader);if(normalized.some(x=>/schoolnaam|school name|naam school/.test(x))||(normalized.some(x=>x==='schoolcode')&&normalized.some(x=>/adres|address/.test(x)))){headerIndex=i;header=normalized;break}}
        if(headerIndex<0)continue;
        const find=patterns=>header.findIndex(h=>patterns.some(p=>p.test(h))),nameCol=find([/^schoolnaam$/,/^school name$/,/^naam school$/]),codeCol=find([/schoolcode/,/^code$/]),addressCol=find([/^adres$/,/address/]),districtCol=find([/district/]),phoneCol=find([/telefoon/,/contactnummer/,/phone/]),denomCol=find([/denominatie/,/religie/,/denomination/]);
        if(nameCol<0)continue;let lastDistrict='';
        for(let i=headerIndex+1;i<parsed.length;i++){
          const row=parsed[i],name=clean(row[nameCol]);if(!name||/^totaal|^total/i.test(name))continue;
          const district=clean(districtCol>=0?row[districtCol]:'')||lastDistrict;if(district)lastDistrict=district;
          const address=clean(addressCol>=0?row[addressCol]:''),phone=clean(phoneCol>=0?row[phoneCol]:''),denomination=clean(denomCol>=0?row[denomCol]:''),code=clean(codeCol>=0?row[codeCol]:'');
          const description=[address,district,denomination,code?'Schoolcode '+code:''].filter(Boolean).join(' · '),tags={district,sheet:sheet.name,schoolcode:code,denomination},levels=levelSet({...tags,name},description);
          rows.push({name,description,lat:null,lon:null,distance:null,website:'',phone,email:'',source:'MinOWC official school list',sourceUrl:SR_OFFICIAL_URL,level:publicLevel(levels),levels,levelDetail:levels.join(','),official:true,tags});
        }
      }
      const cleanRows=mergeRows(rows);if(!cleanRows.length)throw new Error('Official school workbook contained no readable school rows');
      officialCache={at:Date.now(),rows:cleanRows};console.log('[SCHOLARK] Strict school official Suriname roster ready · '+cleanRows.length+' records');return cleanRows;
    }catch(e){console.warn('[SCHOLARK] Strict school official roster unavailable: '+clean(e?.message||e));return[]}
    finally{officialPromise=null}
  })();
  return officialPromise;
}
function officialLocationMatch(row,city){
  if(!city)return true;const c=key(city),district=key(row.tags?.district),hay=key([row.name,row.description,row.tags?.district].filter(Boolean).join(' '));
  if(!c)return true;if(district===c)return true;if(hay.includes(c))return true;if(c.length>=5&&district&&(c.includes(district)||district.includes(c)))return true;return false;
}
function mergeRows(rows){
  const map=new Map();
  for(const row of rows){const k=key(row?.name);if(!k)continue;const prev=map.get(k);if(!prev){map.set(k,{...row,levels:[...new Set(row.levels||[])]});continue}
    const levels=[...new Set([...(prev.levels||[]),...(row.levels||[])])],lat=Number.isFinite(Number(prev.lat))?prev.lat:row.lat,lon=Number.isFinite(Number(prev.lon))?prev.lon:row.lon,d=prev.distance!=null?prev.distance:row.distance;
    map.set(k,{...prev,...row,lat,lon,distance:d,website:prev.website||row.website||'',phone:prev.phone||row.phone||'',email:prev.email||row.email||'',description:prev.official?prev.description:(row.official?row.description:prev.description||row.description),source:prev.source===row.source?prev.source:[prev.source,row.source].filter(Boolean).join(' + '),official:!!(prev.official||row.official),tags:{...(prev.tags||{}),...(row.tags||{})},levels,level:publicLevel(levels),levelDetail:levels.join(',')});
  }
  return[...map.values()];
}

async function overpass(query){
  const failures=[];
  for(const endpoint of OVERPASS){
    try{const r=await timedFetch(endpoint,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded;charset=UTF-8',accept:'application/json','user-agent':'SCHOLARK/1.0 strict-school-search'},body:'data='+encodeURIComponent(query)},18000);if(!r.ok){failures.push(endpoint+' HTTP '+r.status);continue}const d=await r.json().catch(()=>null);if(Array.isArray(d?.elements))return{elements:d.elements,endpoint};failures.push(endpoint+' invalid JSON')}catch(e){failures.push(endpoint+' '+clean(e?.name==='AbortError'?'timeout':e?.message||e))}
  }
  const e=new Error('Strict country school sources unavailable');e.failures=failures;throw e;
}
function countryAreaQuery(country,countryCode,pos,radius,national){
  const iso=clean(countryCode).toUpperCase().replace(/[^A-Z]/g,'').slice(0,2),safeName=clean(country).replace(/["\\]/g,''),scope=national?'(area.country)':`(area.country)(around:${Math.round(radius*1000)},${pos.lat},${pos.lon})`;
  const area=iso?`area["ISO3166-1"="${iso}"]["admin_level"="2"]->.country;`:`area["name"="${safeName}"]["boundary"="administrative"]["admin_level"="2"]->.country;`;
  return`[out:json][timeout:18];${area}(nwr["amenity"~"kindergarten|school|college|university|language_school"]${scope};nwr["building"="school"]${scope};nwr["office"="educational_institution"]${scope};);out center tags 1800;`;
}

async function discover(body){
  const country=clean(body.country||'Suriname')||'Suriname',city=clean(body.city),level=clean(body.level||'all').toLowerCase(),radius=Math.max(1,Math.min(700,Number(body.radius)||50)),center=await resolveCenter(body,country,city);
  if(!Number.isFinite(center.lat)||!Number.isFinite(center.lon))throw new Error('Selected place could not be resolved');
  const countryCode=center.countryCode||expectedCode(country),national=/^suriname$/i.test(country)&&!city,query=countryAreaQuery(country,countryCode,center,radius,national),sourceStatus=[];
  const officialPromiseForRequest=/^suriname$/i.test(country)?officialSurinameSchools():Promise.resolve([]);
  let rows=[],provider='OpenStreetMap country-boundary search';
  try{const o=await overpass(query);sourceStatus.push({source:o.endpoint,ok:true,count:o.elements.length});rows=o.elements.map(e=>normalized(e,center)).filter(Boolean)}catch(e){sourceStatus.push(...(e.failures||[]).map(source=>({source,ok:false})));rows=[]}
  if(!national)rows=rows.filter(x=>x.distance<=radius+1);
  const officialAll=await officialPromiseForRequest,official=officialAll.filter(x=>officialLocationMatch(x,city));
  if(official.length){rows=mergeRows([...official,...rows]);provider='MinOWC official school list + '+provider;sourceStatus.unshift({source:'MinOWC official school list',ok:true,count:official.length})}else rows=mergeRows(rows);
  if(/^suriname$/i.test(country)){
    const known=SURINAME_KNOWN_HIGHER.filter(x=>officialLocationMatch(x,city));
    rows=mergeRows([...known,...rows]);
    if(known.length)sourceStatus.unshift({source:'SCHOLARK Suriname education directory',ok:true,count:known.length});
  }
  rows=rows.filter(x=>matchesLevel(x.levels,level));
  rows.sort((a,b)=>(a.distance??9999)-(b.distance??9999)||a.name.localeCompare(b.name));
  console.log(`[SCHOLARK] Strict school search ${country}${city?', '+city:''} · level ${level} · ${rows.length} matches · country ${countryCode||'unknown'} · official ${official.length}`);
  return{ok:true,strictCountry:true,country,city,level,radius,national,center:{lat:center.lat,lon:center.lon,countryCode,display:center.display},provider,sourceStatus,count:rows.length,schools:rows.slice(0,1500),taxonomy:{version:VERSION,kindergarten:'kleuteronderwijs_leerjaar_1_2',primary:'lagere_school_basisschool_leerjaar_3_8',mulo:'voj_mulo',lbo:'voj_lbo',havo:'vos_havo',vwo:'vos_vwo',mbo:'vos_mbo_natin_imeao_kweekschool',hbo:'higher_professional_hbo',wo:'university_wo_adekus',secondary:'lower_secondary',lower_secondary:'lower_secondary',upper_secondary:'upper_secondary',vocational:'vocational_generic',higher:'higher_generic',genericSchoolMatchesSpecific:false}};
}

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return previousEmit.call(this,type,...args);
  const[req,res]=args;let pathname='';try{pathname=new URL(req.url||'/','http://localhost').pathname}catch{return previousEmit.call(this,type,...args)}
  if(req.method==='GET'&&pathname==='/api/schools/health'){
    json(res,200,{ok:true,strictCountry:true,version:VERSION,providers:['OpenStreetMap country-boundary search','MinOWC official Suriname school list','Photon geocoder fallback'],levels:{kindergarten:'Kleuterschool / Kleuteronderwijs · Leerjaar 1–2 · 4–6 jaar',primary:'Lagere school / Basisschool · Leerjaar 3–8 · 6–12 jaar',mulo:'VOJ · MULO · 12–16 jaar',lbo:'VOJ · LBO · 12–16 jaar',havo:'VOS · HAVO · 16–18 jaar',vwo:'VOS · VWO · 16–19 jaar',mbo:'VOS · MBO · NATIN / IMEAO / Kweekschool · 16–20+ jaar',hbo:'Hoger Onderwijs · HBO · 18/19+ jaar',wo:'Hoger Onderwijs · WO / Universiteit · AdeKUS · 19+ jaar',early:'ISCED 0 / early childhood',secondary:'lower secondary / VOJ',upper_secondary:'upper secondary / VOS',vocational:'vocational generic',higher:'higher education generic',adult:'adult/professional learning'},officialRoster:{configured:true,cached:!!officialCache,count:officialCache?.rows?.length||0}});return true;
  }
  if(req.method==='GET'&&pathname==='/api/schools/vwo-health'){
    officialSurinameSchools().then(rows=>{
      const vwo=rows.filter(x=>matchesLevel(x.levels,'vwo'));
      const hogendoorn=vwo.filter(x=>/hogendoorn\s+atheneum/i.test(clean(x.name))||/arthur.*hogendoorn/i.test(clean(x.name)));
      json(res,200,{ok:true,version:VERSION,vwoEnabled:true,vwoCount:vwo.length,hogendoornDetected:hogendoorn.length>0,hogendoorn:hogendoorn.slice(0,5).map(x=>({name:x.name,levels:x.levels,source:x.source}))});
    }).catch(e=>json(res,503,{ok:false,vwoEnabled:true,error:clean(e?.message||e),version:VERSION}));return true;
  }
  if(req.method==='POST'&&pathname==='/api/schools/search'){
    readJson(req).then(discover).then(x=>json(res,200,x)).catch(e=>json(res,400,{ok:false,strictCountry:true,error:clean(e?.message||e),version:VERSION}));return true;
  }
  return previousEmit.call(this,type,...args);
};

setTimeout(()=>officialSurinameSchools().catch(()=>{}),2200);
console.log('[SCHOLARK] Strict school country + level search '+VERSION+' ready');