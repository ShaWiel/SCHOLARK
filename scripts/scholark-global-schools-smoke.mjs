const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const failures=[];
const results=[];
const validSteps=new Set([25,50,100,250,500,700]);

async function request(path,body,attempt=1){
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),45000);
  try{
    const r=await fetch(base+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:ctrl.signal});
    const d=await r.json().catch(()=>({}));
    if((!r.ok||!d?.ok)&&attempt<2){await new Promise(x=>setTimeout(x,1200));return request(path,body,attempt+1)}
    return{status:r.status,data:d};
  }catch(e){
    if(attempt<2){await new Promise(x=>setTimeout(x,1200));return request(path,body,attempt+1)}
    return{status:0,data:{},error:String(e?.message||e)};
  }finally{clearTimeout(timer)}
}
function check(cond,msg){if(!cond)failures.push(msg)}

const cases=[
  {name:'New York',country:'United States',countryCode:'US',lat:40.7128,lon:-74.0060},
  {name:'Amsterdam',country:'Netherlands',countryCode:'NL',lat:52.3676,lon:4.9041},
  {name:'São Paulo',country:'Brazil',countryCode:'BR',lat:-23.5505,lon:-46.6333},
  {name:'Johannesburg',country:'South Africa',countryCode:'ZA',lat:-26.2041,lon:28.0473},
  {name:'Sydney',country:'Australia',countryCode:'AU',lat:-33.8688,lon:151.2093},
  {name:'Georgetown',country:'Guyana',countryCode:'GY',lat:6.8013,lon:-58.1551}
];

for(const x of cases){
  const {status,data,error}=await request('/api/schools/search',{
    country:x.country,countryCode:x.countryCode,city:'',lat:x.lat,lon:x.lon,
    level:'all',radius:25,autoRadius:true,includeNearbyCountries:false
  });
  check(status===200&&data?.ok===true,x.name+': school search failed '+status+' '+(error||data?.error||''));
  if(status!==200||!data?.ok)continue;
  check(data.searchMode==='coordinates',x.name+': exact coordinates were not used ('+data.searchMode+')');
  check(data.strictCountry===true&&data.includeNearbyCountries!==true,x.name+': same-country default not enforced');
  check(Number(data.radius)<=700,x.name+': radius exceeded 700 km ('+data.radius+')');
  const steps=Array.isArray(data.radiusStepsTried)?data.radiusStepsTried:[];
  check(steps.length>=1&&steps[0]===25&&steps.every(v=>validSteps.has(Number(v)))&&steps.every((v,i)=>i===0||Number(v)>=Number(steps[i-1])),x.name+': invalid adaptive radius steps '+JSON.stringify(steps));
  check(Number(data.count)>0&&Array.isArray(data.schools)&&data.schools.length>0,x.name+': no schools returned');
  check(data.distanceMode==='user-location',x.name+': distance mode was not user-location ('+data.distanceMode+')');
  check((data.schools||[]).some(s=>Number.isFinite(Number(s?.distance))),x.name+': school distances are missing');
  const explicitForeign=(data.schools||[]).filter(s=>{
    const code=String(s?.tags?.['addr:country']||s?.countryCode||'').trim().toUpperCase();
    return code&&code!==x.countryCode;
  });
  check(explicitForeign.length===0,x.name+': same-country search leaked explicit foreign schools '+explicitForeign.slice(0,3).map(s=>s.name).join(', '));
  results.push(x.name+' '+data.count+' schools · '+data.radius+' km · '+(data.provider||'provider'));
}

{
  const {status,data}=await request('/api/schools/search',{country:'Suriname',countryCode:'SR',city:'Paramaribo',lat:5.8520,lon:-55.2038,level:'all',radius:25,autoRadius:true,includeNearbyCountries:false});
  check(status===200&&data?.ok===true,'Suriname exact-location regression failed');
  if(data?.ok){
    check(data.searchMode==='coordinates','GPS did not take precedence over populated city field');
    check(data.distanceMode==='user-location','Suriname GPS search did not expose user-location distance mode');
    check((data.schools||[]).some(s=>Number.isFinite(Number(s?.distance))),'Suriname GPS search returned no school distances');
    check(Number(data.radius)<=700,'Suriname exact-location radius exceeded 700 km');
    const repeat=await request('/api/schools/search',{country:'Suriname',countryCode:'SR',city:'Paramaribo',lat:5.8520,lon:-55.2038,level:'all',radius:25,autoRadius:true,includeNearbyCountries:false});
    check(repeat.status===200&&repeat.data?.ok===true,'Repeated exact-location cache request failed');
    check(repeat.data?.cached===true,'Discovery cache did not serve repeated exact-location request');
    check(Number(repeat.data?.count)===Number(data.count),'Cached exact-location request changed the result count');
  }
}

{
  const {status,data}=await request('/api/schools/search',{country:'Netherlands',countryCode:'NL',lat:50.8514,lon:5.6909,city:'',level:'all',radius:999,autoRadius:false,includeNearbyCountries:true});
  check(status===200&&data?.ok===true,'Cross-border opt-in regression failed');
  if(data?.ok){
    check(data.strictCountry===false&&data.includeNearbyCountries===true,'Cross-border opt-in was not reflected by API');
    check(Number(data.radius)<=700&&Number(data.requestedRadius)<=700,'Cross-border request escaped 700 km cap ('+data.radius+'/'+data.requestedRadius+')');
  }
}

console.log('\nSCHOLARK GLOBAL SCHOOLS SMOKE');
results.forEach(x=>console.log(' ✓ '+x));
if(failures.length){
  console.error('\nSCHOLARK GLOBAL SCHOOLS SMOKE FAILED');
  failures.forEach(x=>console.error(' - '+x));
  process.exit(1);
}
console.log('\nSCHOLARK GLOBAL SCHOOLS SMOKE PASS');
