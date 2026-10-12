// Edge Function: server-enforced host moderation for SCHOLAVERUM SFU rooms.
// Do not expose LiveKit API secrets or room-admin grants to browsers.
const SB=(Deno.env.get('SUPABASE_URL')||'').replace(/\/+$/,'');
const ANON=Deno.env.get('SUPABASE_ANON_KEY')||Deno.env.get('SUPABASE_PUBLISHABLE_KEY')||'';
const LK=Deno.env.get('CONNECT_LIVEKIT_URL')||'';
const KEY=Deno.env.get('CONNECT_LIVEKIT_API_KEY')||'';
const SECRET=Deno.env.get('CONNECT_LIVEKIT_API_SECRET')||'';
const ORIGINS=new Set(['https://scholark-app-shawiel.onrender.com',
  ...(Deno.env.get('CONNECT_ALLOWED_ORIGINS')||'').split(',').map(x=>x.trim()).filter(Boolean)]);
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function response(req:Request,status:number,data:Record<string,unknown>){
  const origin=req.headers.get('origin')||'';
  const h:Record<string,string>={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
  if(ORIGINS.has(origin))h['Access-Control-Allow-Origin']=origin;
  return new Response(JSON.stringify(data),{status,headers:h});
}
const enc=(b:Uint8Array)=>{
  let s='';for(const n of b)s+=String.fromCharCode(n);
  return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
};
const json64=(x:unknown)=>enc(new TextEncoder().encode(JSON.stringify(x)));
async function sign(payload:Record<string,unknown>){
  const head=json64({alg:'HS256',typ:'JWT'}),body=json64(payload),data=head+'.'+body;
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(SECRET),
    {name:'HMAC',hash:'SHA-256'},false,['sign']);
  const mac=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(data));
  return data+'.'+enc(new Uint8Array(mac));
}
async function get(path:string,session:string){
  const r=await fetch(SB+path,{headers:{apikey:ANON,authorization:'Bearer '+session,
    accept:'application/json'},signal:AbortSignal.timeout(8000)});
  return {ok:r.ok,data:await r.json().catch(()=>null)};
}
Deno.serve(async(req:Request)=>{
  const origin=req.headers.get('origin')||'';
  if(origin&&!ORIGINS.has(origin))return response(req,403,{error:'origin_not_allowed'});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{
    'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS',
    'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Vary':'Origin'}});
  if(req.method!=='POST')return response(req,405,{error:'method_not_allowed'});
  const session=req.headers.get('authorization')?.match(/^Bearer\s+(\S+)$/i)?.[1]||'';
  if(!session)return response(req,401,{error:'sign_in_required'});
  let payload:unknown;try{payload=await req.json()}catch{return response(req,400,{error:'invalid_request'})}
  const data=payload as Record<string,unknown>||{};
  const room=typeof data.room_id==='string'?data.room_id:'';
  const target=typeof data.target_id==='string'?data.target_id:'';
  const action=typeof data.action==='string'?data.action:'';
  if(!UUID.test(room)||!['kick','end'].includes(action)||(action==='kick'&&!UUID.test(target)))
    return response(req,400,{error:'invalid_action'});
  if(!SB||!ANON||!LK||!KEY||!SECRET)return response(req,503,{error:'media_server_not_configured'});
  let apiUrl:URL;
  try{apiUrl=new URL(LK);if(apiUrl.protocol!=='wss:')throw Error('invalid')}catch{return response(req,503,{error:'media_url_invalid'})}
  try{
    const user=await get('/auth/v1/user',session);
    if(!user.ok||!UUID.test(user.data?.id||''))return response(req,401,{error:'invalid_session'});
    const roomResult=await get('/rest/v1/connect_rooms?select=id,owner_id,media_mode&id=eq.'+encodeURIComponent(room)+'&limit=1',session);
    if(!roomResult.ok)return response(req,503,{error:'room_check_unavailable'});
    const record=Array.isArray(roomResult.data)?roomResult.data[0]:null;
    if(!record||record.owner_id!==user.data.id||record.media_mode!=='sfu')
      return response(req,403,{error:'host_only'});
    if(action==='kick'&&target===user.data.id)return response(req,400,{error:'host_cannot_kick_self'});
    const roomName='scholaverum_'+room,now=Math.floor(Date.now()/1000);
    const grant=action==='end'?{roomCreate:true}:{roomAdmin:true,room:roomName};
    const jwt=await sign({iss:KEY,sub:user.data.id,iat:now,nbf:now-5,exp:now+60,video:grant});
    apiUrl.protocol='https:';
    apiUrl.pathname='/twirp/livekit.RoomService/'+(action==='end'?'DeleteRoom':'RemoveParticipant');
    apiUrl.search='';apiUrl.hash='';
    const body=action==='end'?{room:roomName}:{room:roomName,identity:target};
    const admin=await fetch(apiUrl.toString(),{method:'POST',
      headers:{authorization:'Bearer '+jwt,'content-type':'application/json'},
      body:JSON.stringify(body),signal:AbortSignal.timeout(8000)});
    // Treat already-absent media participants/rooms as successfully disconnected.
    // Database RPC still governs which users may join after the operation.
    if(!admin.ok&&admin.status!==404)return response(req,502,{error:'media_control_failed'});
    return response(req,200,{success:true,action});
  }catch{return response(req,503,{error:'media_control_unavailable'})}
});
