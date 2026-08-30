import http from 'node:http';

const originalEmit=http.Server.prototype.emit;
console.log('[SCHOLARK] School discovery route ready');
const cache=new Map();
const clean=v=>String(v??'').replace(/\u0000/g,'').replace(/\s+/g,' ').trim();
const json=(res,status,body)=>{if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(body))};
const readJson=req=>new Promise((resolve,reject)=>{let raw='',size=0;req.setEncoding('utf8');req.on('data',c=>{size+=Buffer.byteLength(c);if(size>200000){reject(new Error('Payload too large'));req.destroy();return}raw+=c});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch(e){reject(e)}});req.on('error',reject)});
const rad=x=>x*Math.PI/180;
function distance(a,b,c,d){const R=6371,p=rad(c-a),q=rad(d-b),z=Math.sin(p/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(q/2)**2;return 2*R*Math.asin(Math.sqrt(z))}
function decodeHtml(s=''){return String(s).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#x2F;/g,'/').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function timedFetch(url,init={},ms=22000){const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),ms);return fetch(url,{...init,signal:ctrl.signal}).finally(()=>clearTimeout(timer))}
async function geocode(country,city=''){const q=[city,country].filter(Boolean).join(', '),u=new URL('https://nominatim.openstreetmap.org/search');u.searchParams.set('format','jsonv2');u.searchParams.set('addressdetails','1');u.searchParams.set('limit','1');u.searchParams.set('q',q);const r=await timedFetch(u,{headers:{accept:'application/json','user-agent':'SCHOLARK/1.0 school-discovery'}},10000);if(!r.ok)throw new Error('Geocoder HTTP '+r.status);const d=await r.json();if(!d?.[0])throw new Error('Place not found');return{lat:+d[0].lat,lon:+d[0].lon,country:d[0].address?.country||country,countryCode:String(d[0].address?.country_code||'').toUpperCase(),display:d[0].display_name||q}}
const OVERPASS=['https://overpass.kumi.systems/api/interpreter','https://overpass.private.coffee/api/interpreter','https://overpass-api.de/api/interpreter'];
async function overpass(query){const failures=[];for(const endpoint of OVERPASS){try{const r=await timedFetch(endpoint,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded;charset=UTF-8',accept:'application/json','user-agent':'SCHOLARK/1.0 school-discovery'},body:'data='+encodeURIComponent(query)},30000);if(!r.ok){failures.push(endpoint+' HTTP '+r.status);continue}const d=await r.json().catch(()=>null);if(Array.isArray(d?.elements))return{elements:d.elements,endpoint};failures.push(endpoint+' invalid JSON')}catch(e){failures.push(endpoint+' '+String(e?.name==='AbortError'?'timeout':e?.message||e))}}const e=new Error('Public school map sources unavailable');e.failures=failures;throw e}
function levelOf(t={}){const a=clean(t.amenity).toLowerCase(),n=clean(t.name||t['name:en']||t.operator).toLowerCase(),i=clean(t['isced:level']||t.isced).toLowerCase();if(a==='kindergarten'||/preschool|pre-school|nursery|kleuterschool|peuterschool|voorschool/.test(n))return'early';if(a==='university'||/university|universiteit|faculty|faculteit/.test(n))return'higher';if(a==='college'||/college|polytechnic|hogeschool/.test(n))return/technical|vocational|trade|beroeps|technisch|natin|imeao/.test(n)?'vocational':'higher';if(a==='language_school'||/adult education|continuing education|training centre|training center/.test(n))return'adult';if(/technical|vocational|trade school|beroeps|technisch|natin|imeao/.test(n))return'vocational';if(/secondary|high school|lyceum|gymnasium|middelbare|voj|vos|mulo|lbo|havo|vwo/.test(n)||/[23]/.test(i))return'secondary';if(/primary|elementary|basisschool|glo/.test(n)||/1/.test(i))return'primary';if(a==='school'||t.building==='school')return'school';return'other'}
function normalized(e,pos){const t=e.tags||{},lat=Number(e.lat??e.center?.lat),lon=Number(e.lon??e.center?.lon),name=clean(t.name||t['name:en']||t.operator||t.ref);if(!name||!Number.isFinite(lat)||!Number.isFinite(lon))return null;return{name,description:[t.description,t.operator,t['addr:street'],t['addr:housenumber'],t['addr:city']||t['addr:town']||t['addr:village']].filter(Boolean).map(clean).join(' Â· '),lat,lon,distance:pos&&Number.isFinite(pos.lat)&&Number.isFinite(pos.lon)?distance(pos.lat,pos.lon,lat,lon):null,website:clean(t.website||t['contact:website']),phone:clean(t.phone||t['contact:phone']),email:clean(t.email||t['contact:email']),source:'OpenStreetMap',level:levelOf(t),tags:{amenity:t.amenity||'',operator:t.operator||'',isced:t['isced:level']||'',city:t['addr:city']||t['addr:town']||t['addr:village']||''}}}
function dedupe(rows,keyFn=x=>clean(x.name||x.title).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()){const out=[],seen=new Set();for(const x of rows){const k=keyFn(x);if(!k||seen.has(k))continue;seen.add(k);out.push(x)}return out}
async function nominatimFallback(country){const queries=/^suriname$/i.test(country)?['school Suriname','university Suriname','college Suriname','school Paramaribo Suriname','school Wanica Suriname','school Nickerie Suriname']:[`school ${country}`,`university ${country}`,`college ${country}`],rows=[];for(const q of queries){try{const u=new URL('https://nominatim.openstreetmap.org/search');u.searchParams.set('format','jsonv2');u.searchParams.set('addressdetails','1');u.searchParams.set('limit','50');u.searchParams.set('q',q);const r=await timedFetch(u,{headers:{accept:'application/json','user-agent':'SCHOLARK/1.0 school-discovery'}},9000);if(!r.ok)continue;const d=await r.json();for(const x of d||[]){const lat=+x.lat,lon=+x.lon,name=clean(x.name||String(x.display_name||'').split(',')[0]);if(name&&Number.isFinite(lat)&&Number.isFinite(lon))rows.push({name,description:clean(x.display_name),lat,lon,distance:null,website:'',phone:'',email:'',source:'OpenStreetMap search',level:/university/i.test(x.type||x.display_name)?'higher':'school',tags:{}})}}catch{}if(rows.length>=80)break}return dedupe(rows)}

const SR_OFFICIAL_SCHOOLS_URL='https://gov.sr/wp-content/uploads/2022/10/Lijst-met-Scholen-Suriname-1.xlsx';
let srOfficialCache=null;

function cellCol(ref=''){
  const letters=String(ref).match(/^[A-Z]+/i)?.[0]?.toUpperCase()||'';
  let n=0;for(const ch of letters)n=n*26+(ch.charCodeAt(0)-64);
  return Math.max(0,n-1);
}
function normHeader(v){return clean(v).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function xmlValue(raw){return decodeHtml(String(raw||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1'))}
function sharedStringsFrom(xml){
  return [...String(xml||'').matchAll(/<si\b[\s\S]*?<\/si>/gi)].map(m=>{
    const parts=[...m[0].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/gi)].map(x=>xmlValue(x[1]));
    return clean(parts.join(''));
  });
}
function rowCells(rowXml,shared){
  const out=[];
  for(const m of String(rowXml||'').matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/gi)){
    const attrs=m[1]||'',body=m[2]||'',ref=(attrs.match(/\br="([^"]+)"/i)||[])[1]||'',type=(attrs.match(/\bt="([^"]+)"/i)||[])[1]||'';
    let value='';
    if(type==='inlineStr')value=[...body.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/gi)].map(x=>xmlValue(x[1])).join(' ');
    else{
      const raw=(body.match(/<v>([\s\S]*?)<\/v>/i)||[])[1]??'';
      value=type==='s'?shared[Number(raw)]??'':xmlValue(raw);
    }
    out[cellCol(ref)]=clean(value);
  }
  return out;
}
function inferOfficialLevel(sheetName,name){
  const x=(clean(sheetName)+' '+clean(name)).toLowerCase();
  if(/kleuter|peuter|voorschool|preschool/.test(x))return'early';
  if(/\bglo\b|basis|primary|lagere/.test(x))return'primary';
  if(/natin|imeao|amto|lbo|technisch|technical|beroeps|vocational/.test(x))return'vocational';
  if(/mulo|voj|havo|vwo|vos|lyceum|secondary|middelbaar/.test(x))return'secondary';
  if(/univers|hogeschool|institute of higher|terti/.test(x))return'higher';
  return'school';
}
async function officialSurinameSchools(){
  if(srOfficialCache&&Date.now()-srOfficialCache.at<6*60*60*1000)return srOfficialCache.rows;
  try{
    const response=await timedFetch(SR_OFFICIAL_SCHOOLS_URL,{headers:{accept:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','user-agent':'SCHOLARK/1.0 official-school-list'}},18000);
    if(!response.ok)throw new Error('Official school list HTTP '+response.status);
    const buffer=Buffer.from(await response.arrayBuffer());
    if(buffer.length<1000||buffer.length>20*1024*1024)throw new Error('Official school list returned an unexpected file size');
    const mod=await import('jszip'),JSZip=mod.default||mod,zip=await JSZip.loadAsync(buffer,{checkCRC32:false});
    const sharedXml=await zip.file('xl/sharedStrings.xml')?.async('string').catch(()=>''),shared=sharedStringsFrom(sharedXml||'');
    const workbook=await zip.file('xl/workbook.xml')?.async('string'),rels=await zip.file('xl/_rels/workbook.xml.rels')?.async('string');
    if(!workbook||!rels)throw new Error('Official school workbook structure is incomplete');
    const targets={};
    for(const m of rels.matchAll(/<Relationship\b([^>]*)\/?>(?:<\/Relationship>)?/gi)){
      const attrs=m[1]||'',id=(attrs.match(/\bId="([^"]+)"/i)||[])[1],target=(attrs.match(/\bTarget="([^"]+)"/i)||[])[1];
      if(id&&target)targets[id]=target.replace(/^\//,'');
    }
    const sheets=[];
    for(const m of workbook.matchAll(/<sheet\b([^>]*)\/?>(?:<\/sheet>)?/gi)){
      const attrs=m[1]||'',name=xmlValue((attrs.match(/\bname="([^"]+)"/i)||[])[1]||''),rid=(attrs.match(/\br:id="([^"]+)"/i)||[])[1];
      let target=targets[rid]||'';if(target&&!target.startsWith('xl/'))target='xl/'+target.replace(/^\.\//,'');
      if(name&&target)sheets.push({name,target});
    }
    const rows=[];
    for(const sheet of sheets){
      const xml=await zip.file(sheet.target)?.async('string');if(!xml)continue;
      const parsed=[...xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/gi)].map(m=>rowCells(m[1],shared));
      let headerIndex=-1,header=[];
      for(let i=0;i<Math.min(parsed.length,25);i++){
        const normalized=parsed[i].map(normHeader);
        if(normalized.some(x=>/schoolnaam|school name|naam school/.test(x))||normalized.some(x=>x==='schoolcode')&&normalized.some(x=>/adres|address/.test(x))){headerIndex=i;header=normalized;break}
      }
      if(headerIndex<0)continue;
      const find=(patterns)=>header.findIndex(h=>patterns.some(p=>p.test(h)));
      const nameCol=find([/^schoolnaam$/,/^school name$/,/^naam school$/]),codeCol=find([/schoolcode/,/^code$/]),addressCol=find([/^adres$/,/address/]),districtCol=find([/district/]),phoneCol=find([/telefoon/,/contactnummer/,/phone/]),denomCol=find([/denominatie/,/religie/,/denomination/]);
      if(nameCol<0)continue;
      let lastDistrict='';
      for(let i=headerIndex+1;i<parsed.length;i++){
        const row=parsed[i],name=clean(row[nameCol]);if(!name||/^totaal|^total/i.test(name))continue;
        const district=clean(districtCol>=0?row[districtCol]:'')||lastDistrict;if(district)lastDistrict=district;
        const address=clean(addressCol>=0?row[addressCol]:'');
        const phone=clean(phoneCol>=0?row[phoneCol]:'');
        const denomination=clean(denomCol>=0?row[denomCol]:'');
        const code=clean(codeCol>=0?row[codeCol]:'');
        rows.push({
          name,
          description:[address,district,denomination,code?'Schoolcode '+code:''].filter(Boolean).join(' · '),
          lat:null,lon:null,distance:null,website:'',phone,email:'',
          source:'MinOWC official school list',sourceUrl:SR_OFFICIAL_SCHOOLS_URL,
          level:inferOfficialLevel(sheet.name,name),
          tags:{district,sheet:sheet.name,schoolcode:code,denomination}
        });
      }
    }
    const cleanRows=dedupe(rows);
    if(!cleanRows.length)throw new Error('Official school workbook contained no readable school rows');
    srOfficialCache={at:Date.now(),rows:cleanRows};
    console.log('[SCHOLARK] Official Suriname school list loaded count='+cleanRows.length);
    return cleanRows;
  }catch(e){
    console.warn('[SCHOLARK] Official Suriname school list unavailable: '+clean(e?.message||e));
    return [];
  }
}

async function discover(body){const country=clean(body.country||'Suriname')||'Suriname',city=clean(body.city),level=clean(body.level||'all').toLowerCase(),radius=Math.max(1,Math.min(700,Number(body.radius)||50));let lat=Number(body.lat),lon=Number(body.lon),countryCode=clean(body.countryCode).toUpperCase(),geo=null;if(!Number.isFinite(lat)||!Number.isFinite(lon)){geo=await geocode(country,city);lat=geo.lat;lon=geo.lon;countryCode=geo.countryCode}const suriname=/^suriname$/i.test(country)||countryCode==='SR',national=suriname&&level==='all',cacheKey=[country.toLowerCase(),city.toLowerCase(),level,radius,Math.round(lat*1000),Math.round(lon*1000),national].join('|'),hit=cache.get(cacheKey);if(hit&&Date.now()-hit.at<15*60*1000)return{...hit.value,cached:true};const around=Math.round(radius*1000),amenity='"kindergarten|school|college|university|language_school"';const query=national?`[out:json][timeout:30];(nwr["amenity"~${amenity}](1.75,-58.25,6.25,-53.75);nwr["building"="school"](1.75,-58.25,6.25,-53.75);nwr["office"="educational_institution"](1.75,-58.25,6.25,-53.75););out center tags;`:`[out:json][timeout:25];(nwr["amenity"~${amenity}](around:${around},${lat},${lon});nwr["building"="school"](around:${around},${lat},${lon}););out center tags;`;let rows=[],provider='OpenStreetMap Overpass',sourceStatus=[];const official=national?await officialSurinameSchools():[];if(national)sourceStatus.push({source:'MinOWC official school list',ok:official.length>0,count:official.length});try{const o=await overpass(query);sourceStatus.push({source:o.endpoint,ok:true,count:o.elements.length});rows=o.elements.map(e=>normalized(e,{lat,lon})).filter(Boolean)}catch(e){sourceStatus=(e.failures||[]).map(x=>({source:x,ok:false}))}if(!rows.length){const fallback=await nominatimFallback(country);rows=fallback.map(x=>({...x,distance:Number.isFinite(x.lat)&&Number.isFinite(x.lon)?distance(lat,lon,x.lat,x.lon):null}));provider='OpenStreetMap search fallback';sourceStatus.push({source:'Nominatim fallback',ok:rows.length>0,count:rows.length})}if(official.length){rows=dedupe([...official,...rows]);provider='MinOWC official school list + '+provider}else rows=dedupe(rows);if(level!=='all')rows=rows.filter(x=>x.level===level||x.level==='school'||(level==='higher'&&x.level==='vocational')||(level==='vocational'&&x.level==='higher'));if(!national)rows=rows.filter(x=>x.distance==null||x.distance<=radius+5);rows.sort((a,b)=>(a.distance??9999)-(b.distance??9999)||a.name.localeCompare(b.name));const value={ok:true,country,city,level,radius,national,center:{lat,lon,countryCode,display:geo?.display||''},provider,sourceStatus,count:rows.length,schools:rows.slice(0,1500)};cache.set(cacheKey,{at:Date.now(),value});return value}
async function reviewSearch(body){const name=clean(body.name).slice(0,220),country=clean(body.country||'Suriname').slice(0,100),city=clean(body.city).slice(0,100);if(!name)throw new Error('School name required');const q=[`"${name}"`,city,country,'reviews OR ervaringen OR rating'].filter(Boolean).join(' '),u='https://html.duckduckgo.com/html/?q='+encodeURIComponent(q),results=[];try{const r=await timedFetch(u,{headers:{accept:'text/html','user-agent':'Mozilla/5.0 SCHOLARK/1.0'}},12000),html=await r.text(),blocks=html.split(/result results_links|result results_links_deep/i).slice(1,12);for(const block of blocks){const href=(block.match(/class="result__a"[^>]*href="([^"]+)"/i)||[])[1]||'',title=decodeHtml((block.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/i)||[])[1]||''),snippet=decodeHtml((block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a?>/i)||[])[1]||'');let url=href;try{const parsed=new URL(href,'https://duckduckgo.com');url=parsed.searchParams.get('uddg')||parsed.href}catch{}if(title&&/^https?:/i.test(url))results.push({title,url,snippet})}}catch{}const direct=[{title:'Google review search',url:'https://www.google.com/search?q='+encodeURIComponent(name+' '+country+' reviews'),snippet:'Open current Google web and Maps-related review results.'},{title:'Facebook review search',url:'https://www.google.com/search?q='+encodeURIComponent('site:facebook.com '+name+' '+country+' reviews'),snippet:'Look for public Facebook pages, recommendations and community feedback.'}];return{ok:true,name,country,results:dedupe([...results,...direct],x=>clean(x.url).toLowerCase()).slice(0,10)}}
setTimeout(()=>{discover({country:'Suriname',city:'Paramaribo',level:'all',radius:700}).then(x=>console.log('[SCHOLARK] School discovery self-test '+(x.count>0?'PASS':'WARN')+' count='+x.count+' provider='+x.provider+' sources='+JSON.stringify(x.sourceStatus||[]))).catch(e=>console.error('[SCHOLARK] School discovery self-test FAIL '+clean(e?.message||e)))},4500);

http.Server.prototype.emit=function(event,...args){if(event!=='request')return originalEmit.call(this,event,...args);const[req,res]=args;let url;try{url=new URL(req.url||'/','http://localhost')}catch{return originalEmit.call(this,event,...args)}if(req.method==='GET'&&url.pathname==='/api/schools/health'){json(res,200,{ok:true,providers:['OpenStreetMap Overpass','OpenStreetMap Nominatim','DuckDuckGo review discovery'],cacheEntries:cache.size});return true}if(req.method==='POST'&&url.pathname==='/api/schools/search'){readJson(req).then(discover).then(x=>json(res,200,x)).catch(e=>json(res,502,{ok:false,error:clean(e?.message||e)}));return true}if(req.method==='POST'&&url.pathname==='/api/schools/reviews'){readJson(req).then(reviewSearch).then(x=>json(res,200,x)).catch(e=>json(res,502,{ok:false,error:clean(e?.message||e)}));return true}return originalEmit.call(this,event,...args)};
