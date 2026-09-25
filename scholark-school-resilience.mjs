import http from 'node:http';

const VERSION='20260925-school-resilience-v2';
const nativeFetch=globalThis.fetch.bind(globalThis);
const previousEmit=http.Server.prototype.emit;
const geocodeCache=new Map();
const TTL_MS=24*60*60*1000,GEOCODE_CACHE_MAX=500;
function cachePlace(key,place){geocodeCache.set(key,{at:Date.now(),place});while(geocodeCache.size>GEOCODE_CACHE_MAX)geocodeCache.delete(geocodeCache.keys().next().value)}
const retryable=new Set([408,425,429,500,502,503,504]);

const STATIC_PLACES=new Map([
  ['paramaribo, suriname',{lat:5.8520,lon:-55.2038,name:'Paramaribo',country:'Suriname',countryCode:'SR',display:'Paramaribo, Suriname'}],
  ['paramaribo suriname',{lat:5.8520,lon:-55.2038,name:'Paramaribo',country:'Suriname',countryCode:'SR',display:'Paramaribo, Suriname'}],
  ['suriname',{lat:3.9193,lon:-56.0278,name:'Suriname',country:'Suriname',countryCode:'SR',display:'Suriname'}],
]);

function clean(v){return String(v??'').replace(/\s+/g,' ').trim()}
function cacheKey(q){return clean(q).toLowerCase()}
function toNominatim(place){
  return [{
    lat:String(place.lat),lon:String(place.lon),
    name:place.name||'',display_name:place.display||[place.name,place.country].filter(Boolean).join(', '),
    address:{country:place.country||'',country_code:String(place.countryCode||'').toLowerCase()},
    type:'administrative',class:'place'
  }];
}
function synthetic(place,source='fallback'){
  return new Response(JSON.stringify(toNominatim(place)),{status:200,headers:{'content-type':'application/json; charset=utf-8','cache-control':'private, max-age=300','x-scholark-geocoder':source}});
}
function info(input){
  if(typeof input!=='string'&&!(input instanceof URL))return null;
  let u;try{u=new URL(String(input))}catch{return null}
  if(u.hostname!=='nominatim.openstreetmap.org'||u.pathname!=='/search')return null;
  if(String(u.searchParams.get('limit')||'')!=='1')return null;
  const q=clean(u.searchParams.get('q')||'');
  return q?{q,key:cacheKey(q)}:null;
}
function staticPlace(q){return STATIC_PLACES.get(cacheKey(q))||null}

async function photon(q){
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),7000);
  try{
    const u=new URL('https://photon.komoot.io/api/');u.searchParams.set('q',q);u.searchParams.set('limit','1');
    const r=await nativeFetch(u,{headers:{accept:'application/json','user-agent':'SCHOLARK/1.0 school-geocoder'},signal:ctrl.signal});
    if(!r.ok)throw new Error('Photon HTTP '+r.status);
    const d=await r.json().catch(()=>null),f=d?.features?.[0],coords=f?.geometry?.coordinates,p=f?.properties||{};
    const lon=Number(coords?.[0]),lat=Number(coords?.[1]);
    if(!Number.isFinite(lat)||!Number.isFinite(lon))throw new Error('Photon returned no place');
    return {lat,lon,name:clean(p.name||p.city||p.state||q),country:clean(p.country||''),countryCode:clean(p.countrycode||p.countryCode||'').toUpperCase(),display:[p.name||p.city,p.state,p.country].map(clean).filter(Boolean).join(', ')||q};
  }finally{clearTimeout(timer)}
}

let stats={cacheHits:0,staticHits:0,photonRecoveries:0,primarySuccesses:0,primaryFailures:0,lastFailure:null,lastRecovery:null};

globalThis.fetch=async function scholarkSchoolFetch(input,init){
  const request=info(input);
  if(!request)return nativeFetch(input,init);
  const now=Date.now(),cached=geocodeCache.get(request.key);
  if(cached&&now-cached.at<TTL_MS){stats.cacheHits++;return synthetic(cached.place,'cache')}

  const known=staticPlace(request.q);
  if(known){cachePlace(request.key,known);stats.staticHits++;return synthetic(known,'static')}

  let primary=null,lastError=null;
  try{
    primary=await nativeFetch(input,init);
    if(primary.ok){
      const data=await primary.clone().json().catch(()=>null),row=data?.[0];
      const lat=Number(row?.lat),lon=Number(row?.lon);
      if(Number.isFinite(lat)&&Number.isFinite(lon)){
        cachePlace(request.key,{lat,lon,name:clean(row?.name||request.q),country:clean(row?.address?.country||''),countryCode:clean(row?.address?.country_code||'').toUpperCase(),display:clean(row?.display_name||request.q)});
      }
      stats.primarySuccesses++;
      return primary;
    }
    if(!retryable.has(primary.status))return primary;
    stats.primaryFailures++;stats.lastFailure='HTTP '+primary.status;
  }catch(error){
    lastError=error;stats.primaryFailures++;stats.lastFailure=clean(error?.message||error);
  }

  try{
    const place=await photon(request.q);
    cachePlace(request.key,place);stats.photonRecoveries++;stats.lastRecovery=request.q;
    console.warn('[SCHOLARK] School geocoder recovered with Photon for '+request.q);
    return synthetic(place,'photon');
  }catch(error){
    const stale=geocodeCache.get(request.key);
    if(stale)return synthetic(stale.place,'stale-cache');
    if(primary)return primary;
    throw lastError||error;
  }
};

function json(res,status,body){if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(body))}
http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return previousEmit.call(this,type,...args);
  const [req,res]=args;let pathname='';try{pathname=new URL(req.url||'/','http://localhost').pathname}catch{return previousEmit.call(this,type,...args)}
  if(req.method==='GET'&&pathname==='/api/schools/resilience'){
    json(res,200,{ok:true,version:VERSION,cacheEntries:geocodeCache.size,providers:['OpenStreetMap Nominatim','Photon fallback','SCHOLARK static Suriname fallback'],stats:{...stats}});return true;
  }
  return previousEmit.call(this,type,...args);
};

console.log('[SCHOLARK] School geocoder resilience '+VERSION+' ready');
