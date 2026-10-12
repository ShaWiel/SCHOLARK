// Supabase Edge Function: connect-media-token
// The SFU API secret remains on the server. An authenticated member of an active
// explicitly-SFU room may obtain a short-lived, room-scoped LiveKit join token.
// Until CONNECT_LIVEKIT_* secrets and the rollout are configured, fail closed.
const SUPABASE_URL=(Deno.env.get('SUPABASE_URL')||'').replace(/\/+$/,'');
const ANON_KEY=Deno.env.get('SUPABASE_ANON_KEY')||Deno.env.get('SUPABASE_PUBLISHABLE_KEY')||'';
const MEDIA_URL=Deno.env.get('CONNECT_LIVEKIT_URL')||'';
const API_KEY=Deno.env.get('CONNECT_LIVEKIT_API_KEY')||'';
const API_SECRET=Deno.env.get('CONNECT_LIVEKIT_API_SECRET')||'';
const ALLOWED_ORIGINS=new Set([
  'https://scholark-app-shawiel.onrender.com',
  ...(Deno.env.get('CONNECT_ALLOWED_ORIGINS')||'').split(',').map(s=>s.trim()).filter(Boolean),
]);
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function respond(req:Request,status:number,data:Record<string,unknown>):Response {
  const origin=req.headers.get('origin')||'';
  const headers:Record<string,string>={
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff',
    'Vary':'Origin',
  };
  if(ALLOWED_ORIGINS.has(origin))headers['Access-Control-Allow-Origin']=origin;
  return new Response(JSON.stringify(data),{status,headers});
}
function b64url(bytes:Uint8Array):string{
  let text='';for(const b of bytes)text+=String.fromCharCode(b);
  return btoa(text).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
const encode=(value:unknown)=>b64url(new TextEncoder().encode(JSON.stringify(value)));
async function signJwt(payload:Record<string,unknown>):Promise<string>{
  const header=encode({alg:'HS256',typ:'JWT'});
  const body=encode(payload);
  const data=header+'.'+body;
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(API_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig=new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(data)));
  return data+'.'+b64url(sig);
}
async function supabase(path:string,accessToken:string):Promise<{ok:boolean,status:number,data:any}>{
  const response=await fetch(SUPABASE_URL+path,{
    headers:{'apikey':ANON_KEY,'authorization':'Bearer '+accessToken,'accept':'application/json'},
    signal:AbortSignal.timeout(8000),
  });
  return {ok:response.ok,status:response.status,data:await response.json().catch(()=>null)};
}
Deno.serve(async(req:Request):Promise<Response>=>{
  const origin=req.headers.get('origin')||'';
  if(origin&&!ALLOWED_ORIGINS.has(origin))return respond(req,403,{error:'origin_not_allowed'});
  if(req.method==='OPTIONS'){
    if(!origin)return respond(req,403,{error:'origin_required'});
    return new Response(null,{status:204,headers:{
      'Access-Control-Allow-Origin':origin,
      'Access-Control-Allow-Methods':'POST, OPTIONS',
      'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info',
      'Access-Control-Max-Age':'3600','Vary':'Origin',
    }});
  }
  if(req.method!=='POST')return respond(req,405,{error:'method_not_allowed'});
  if(!SUPABASE_URL||!ANON_KEY)return respond(req,503,{error:'auth_service_unavailable'});
  const token=req.headers.get('authorization')?.match(/^Bearer\s+(\S+)$/i)?.[1]||'';
  if(!token)return respond(req,401,{error:'sign_in_required'});
  let input:unknown;
  try{input=await req.json()}catch{return respond(req,400,{error:'invalid_json'})}
  const roomId=typeof input==='object'&&input!==null&&'room_id'in input
    ? String((input as {room_id:unknown}).room_id) : '';
  if(!UUID.test(roomId))return respond(req,400,{error:'invalid_room'});
  if(!MEDIA_URL||!API_KEY||!API_SECRET)return respond(req,503,{error:'media_server_not_configured'});
  try{
    const target=new URL(MEDIA_URL);
    if(target.protocol!=='wss:'||!target.hostname)return respond(req,503,{error:'media_server_invalid_configuration'});
    const user=await supabase('/auth/v1/user',token);
    if(!user.ok||!UUID.test(user.data?.id||''))return respond(req,401,{error:'invalid_session'});
    const id=encodeURIComponent(roomId),me=encodeURIComponent(user.data.id);
    // Both queries use the caller's bearer JWT, never a service-role database key.
    // Supabase RLS governs access; then we additionally check self-membership.
    const room=await supabase('/rest/v1/connect_rooms?select=id,media_mode,active,expires_at&id=eq.'+id+'&limit=1',token);
    if(!room.ok)return respond(req,503,{error:'membership_check_unavailable'});
    const r=Array.isArray(room.data)?room.data[0]:null;
    if(!r||r.active!==true||r.media_mode!=='sfu'||Date.parse(r.expires_at)<=Date.now()){
      return respond(req,403,{error:'sfu_room_unavailable'});
    }
    const member=await supabase('/rest/v1/connect_room_members?select=user_id&room_id=eq.'+id+'&user_id=eq.'+me+'&left_at=is.null&limit=1',token);
    if(!member.ok)return respond(req,503,{error:'membership_check_unavailable'});
    if(!Array.isArray(member.data)||member.data[0]?.user_id!==user.data.id){
      return respond(req,403,{error:'not_a_room_member'});
    }
    const now=Math.floor(Date.now()/1000);
    const roomName='scholaverum_'+roomId;
    const joinToken=await signJwt({
      iss:API_KEY,sub:user.data.id,iat:now,nbf:now-5,exp:now+120,
      video:{room:roomName,roomJoin:true,canPublish:true,canSubscribe:true,canPublishData:true},
    });
    return respond(req,200,{mode:'sfu',url:MEDIA_URL,room_name:roomName,token:joinToken,expires_in:120});
  }catch{
    return respond(req,503,{error:'media_authorization_unavailable'});
  }
});
