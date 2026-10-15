import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const core=readFileSync('scholark-v110-workspace-core.js','utf8');

const source=readFileSync('scholark-v72-cloud-projects.js','utf8');
const arki=readFileSync('scholark-v107-general-ai.js','utf8');
const core=readFileSync('scholark-v110-workspace-core.js','utf8');
const start=source.indexOf('  function loadSession(){');
const end=source.indexOf('  async function publicFetch(',start);
assert.ok(start>0&&end>start,'Could not isolate central cloud auth methods');
const epoch=()=>Math.floor(Date.now()/1000);
const storage=new Map(),localStorage={
  getItem:key=>storage.has(key)?storage.get(key):null,
  setItem:(key,value)=>storage.set(key,String(value)),
  removeItem:key=>storage.delete(key)
};
const initial=(access,refresh,expires=epoch()-10,user='u1')=>({access_token:access,refresh_token:refresh,expires_at:expires,user:{id:user}});
const success=data=>({ok:true,status:200,json:async()=>data});
let fetchCalls=[],fetchImpl=async()=>{throw Error('unexpected fetch')};
let queue=Promise.resolve();
const navigator={locks:{request:(_key,_options,fn)=>{const task=queue.then(fn);queue=task.catch(()=>{});return task}}};
const sandbox={localStorage,SESSION:'scholark_supabase_session_v2',state:{session:null},SB:'https://example.supabase.co',KEY:'test-publishable',fetch:(...args)=>{fetchCalls.push(args);return fetchImpl(...args)},navigator,AbortController,Date,Math,Promise,JSON,setTimeout,clearTimeout,queueMicrotask,CustomEvent:class CustomEvent{constructor(name,props){this.type=name;this.detail=props.detail}},window:{dispatchEvent(){}}};
const api=vm.runInNewContext(source.slice(start,end)+'\n({loadSession,saveSession,refresh,session,apiFetch,sessionRefreshState:()=>refreshIssue})',sandbox);
const set=s=>{storage.set(sandbox.SESSION,JSON.stringify(s));api.loadSession()};
const get=()=>JSON.parse(storage.get(sandbox.SESSION)||'null');
const wait=ms=>new Promise(done=>setTimeout(done,ms));

set(initial('valid','rt0',epoch()+3600));
fetchCalls=[];
assert.equal((await api.session()).access_token,'valid');
assert.equal(fetchCalls.length,0,'Fresh tokens must not cause a refresh');

set(initial('expired','rt1'));
fetchCalls=[];
fetchImpl=async()=>success(initial('renewed','rt2',epoch()+3600));
const concurrent=await Promise.all([api.session(),api.session(),api.session()]);
assert.ok(concurrent.every(s=>s?.access_token==='renewed'),'Concurrent callers must share a successful token');
assert.equal(fetchCalls.length,1,'Only one rotating refresh token may be spent');

set(initial('stale','rt3'));
fetchCalls=[];
fetchImpl=async()=>{throw Error('temporary DNS failure')};
assert.equal(await api.session(),null);
assert.equal(get().refresh_token,'rt3','Temporary network outage must preserve stored refresh token');
assert.equal(api.sessionRefreshState(),'temporary');
fetchImpl=async()=>success(initial('recovered','rt4',epoch()+3600));
assert.equal((await api.session())?.access_token,'recovered','Session must recover on next request without sign-in');

set(initial('invalid','rt5'));
fetchImpl=async()=>({ok:false,status:400,json:async()=>({error_code:'invalid_grant'})});
assert.equal(await api.session(),null);
assert.equal(get(),null,'Definitively invalid refresh tokens must clear the session');

set(initial('slow','rt6'));
let resolveRefresh;
fetchImpl=()=>new Promise(resolve=>{resolveRefresh=resolve});
const pending=api.refresh();
await wait(5);
api.saveSession(null);
resolveRefresh(success(initial('would-resurrect','rt7',epoch()+3600)));
assert.equal(await pending,null,'Sign-out during refresh must not recreate the old account');
assert.equal(get(),null);

set(initial('other-old','rt8'));
fetchImpl=()=>new Promise(resolve=>{resolveRefresh=resolve});
const switching=api.refresh();
await wait(5);
set(initial('other-new','rt9',epoch()+3600,'u2'));
resolveRefresh(success(initial('previous-account','rt10',epoch()+3600,'u1')));
assert.equal((await switching)?.user?.id,'u2','A rotated account switch token must win over a slow response');
assert.equal(get()?.user?.id,'u2','Do not cross-contaminate switched accounts');

assert.ok(arki.includes('await withTimeout(cloud.session()')&&!arki.includes('if(!force&&current?.access_token)return current'),'ARKI must check token expiry, not reuse cached access tokens');
assert.ok(core.includes('SESSION_REFRESH_TEMPORARY')&&core.includes('The server enforces feature credits and limits atomically'),'Tutor must use central refresh and server-authoritative credits');

const aiStart=core.indexOf('  const AI_FEATURES='),aiEnd=core.indexOf('  function record(',aiStart);
assert.ok(aiStart>0&&aiEnd>aiStart,'Could not isolate shared authenticated Tutor AI request');
let activeToken='initial-ai',calls=[],refreshed=0,preflightCalled=false;
const testCloud={
  async session(){return {access_token:activeToken}},
  async refreshSession(){refreshed++;activeToken='refreshed-ai';return {access_token:activeToken}},
  sessionRefreshState(){return 'temporary'}
};
const shared=vm.runInNewContext(core.slice(aiStart,aiEnd)+'\n({aiRequest})',{
  window:{__SCHOLARK_V72_CLOUD__:testCloud,__SCHOLARK_CREDITS__:{authorize(){preflightCalled=true;throw Error('Legacy wallet preflight called')},load(){}},__SCHOLARK_CHAT_QUOTA__:{apply(){}},__SCHOLARK_I18N__:{languageName:()=> 'Dutch'}},
  localStorage:{getItem:()=>null},document:{documentElement:{lang:'nl'}},clean:x=>String(x||'').trim(),uid:()=> 'request-id-1',
  fetch:async(_url,opts)=>{calls.push(opts);return calls.length===1?{ok:false,status:401,headers:{get:()=>null},json:async()=>({code:'AUTH_REQUIRED',error:'Expired'})}:{ok:true,status:200,headers:{get:()=>null},json:async()=>({ok:true,result:{answer:'Goed',steps:['Uitleg']}})}},
  AbortController,setTimeout,clearTimeout,Math,Number,String,JSON,Promise
});
const tutorResult=await shared.aiRequest('tutor',{prompt:'Leg de stelling van Pythagoras met tussenstappen uit'});
assert.equal(tutorResult.result.answer,'Goed');
assert.equal(calls.length,2,'Tutor must retry exactly once after 401');
assert.equal(refreshed,1,'Tutor must request a fresh session on unauthorized responses');
assert.ok(calls[0].headers.authorization==='Bearer initial-ai'&&calls[1].headers.authorization==='Bearer refreshed-ai','Tutor must use the refreshed authorization header');
assert.equal(calls[0].headers['x-scholark-request-id'],calls[1].headers['x-scholark-request-id'],'Tutor must preserve server-side credit idempotency across retry');
assert.equal(preflightCalled,false,'Tutor must not block on stale client credit preflight');
console.log('SCHOLAVERUM SESSION RECOVERY PASS: fresh, parallel, network outage, recovery, revocation, logout, account switching, ARKI and Tutor');
