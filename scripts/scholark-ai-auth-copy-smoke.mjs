import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const route=readFileSync('scholark-learning-route.mjs','utf8');
const copy=readFileSync('scholark-v120-experience-controls.js','utf8');
const migration=readFileSync('supabase/migrations/20261015_credit_internal_auth_grant_r269.sql','utf8');
assert.ok(migration.includes('grant execute on function scholark_private.consume_feature_credits_once_internal(text,text,jsonb) to authenticated'),'Must grant private authenticated credit debit RPC');
assert.ok(migration.includes('from public, anon'),'Must not allow anonymous credits');
assert.ok(!route.includes("Your SCHOLAVERUM session has expired. Sign in again."),'Permission denied must never masquerade as expired session');

const first=route.indexOf('async function fetchFreeQuotaStatus('),last=route.indexOf('const isSecret',first);
assert.ok(first>0&&last>first,'Credit route extraction failed');
let cost=200,wallet=200,quota=200,charge=200;
const response=(status,json)=>({ok:status>=200&&status<300,status,json:async()=>json});
const fakeFetch=async(url,_opts,label)=>{
  if(label==='feature-cost')return response(cost,[{credits:1}]);
  if(label==='wallet')return response(wallet,[{balance:55,plan:'plus',monthly_allowance:100}]);
  if(label==='free-ai-quota-status')return response(quota,{ok:true,quota:{plan:'plus'}});
  if(label==='charge')return response(charge,{ok:true,spent:1,balance:54});
  if(label==='free-ai-quota-consume')return response(charge,{ok:true,spent:0,balance:55});
  throw Error('Unexpected credit service: '+label);
};
const api=vm.runInNewContext(route.slice(first,last)+'\n({fetchFreeQuotaStatus,authorizeLearningCredits,chargeLearningCredits})',{
  TEST_MODE:false,SUPABASE_URL:'https://example.supabase.co',PUB:'test-public-key',
  CREDIT_MODE_FEATURE:{tutor:'tutor_message',general_ai:'general_ai'},
  CHAT_ATTACHMENT_LIMIT:10,
  bearer:req=>String(req.headers.authorization||'').replace(/^Bearer /,''),
  creditRequestId:req=>req.headers['x-scholark-request-id'],
  clean:x=>String(x??'').trim(),
  resilientCreditFetch:fakeFetch,networkCode:()=> 'NETWORK_ERROR',
  console:{warn(){}},Math,Number,JSON,Object,Array,String,Promise,encodeURIComponent
});
const req={headers:{authorization:'Bearer valid-test-jwt','x-scholark-request-id':'credit-r269-tests'}};
const payload={prompt:'Explain Pythagoras',attachments:[]};
let preflight=await api.authorizeLearningCredits(req,'tutor',payload);
assert.equal(preflight.ok,true,'Authenticated credits must pass healthy preflight');
let debit=await api.chargeLearningCredits(req,'tutor',payload,{provider:'gemini',model:'test'});
assert.equal(debit.ok,true,'Credit charge must succeed with an authorized private RPC');

wallet=403;
preflight=await api.authorizeLearningCredits(req,'tutor',payload);
assert.equal(preflight.http,503,'Wallet 403 must be service-denied, not invalid token');
assert.equal(preflight.code,'CREDIT_SERVICE_FORBIDDEN');
wallet=200;quota=403;
preflight=await api.authorizeLearningCredits(req,'tutor',payload);
assert.equal(preflight.code,'CREDIT_SERVICE_FORBIDDEN','Quota 403 must not be reported as login expired');
quota=200;cost=401;
preflight=await api.authorizeLearningCredits(req,'tutor',payload);
assert.equal(preflight.http,401,'True credit auth 401 should permit refresh retry');
cost=200;charge=403;
debit=await api.chargeLearningCredits(req,'tutor',payload,{provider:'gemini',model:'test'});
assert.equal(debit.code,'CREDIT_SERVICE_FORBIDDEN','RPC grants must not be disguised as invalid login');
assert.equal(debit.http,503);
charge=401;
debit=await api.chargeLearningCredits(req,'tutor',payload,{provider:'gemini',model:'test'});
assert.equal(debit.http,401);
charge=200;

const p=copy.indexOf('  async function copyText('),q=copy.indexOf('  function speak(',p);
assert.ok(p>0&&q>p);
let captured='',notified=[],fallbackCalls=0;
const document={
  activeElement:{focus(){}},
  body:{appendChild(node){node.parentNode=this}},
  createElement(){return{style:{cssText:''},setAttribute(){},focus(){},select(){},remove(){}}},
  execCommand(cmd){assert.equal(cmd,'copy');fallbackCalls++;return true}
};
let clipboard={writeText:async text=>{captured=text}};
let t=vm.runInNewContext(copy.slice(p,q)+'\n({copyText})',{navigator:{clipboard},document,toast:x=>notified.push(x),String,Promise});
assert.equal(await t.copyText('a² + b² = c²\nBC = a√2'),true);
assert.equal(captured,'a² + b² = c²\nBC = a√2','Copy must preserve full math and line breaks');
clipboard.writeText=async()=>{throw Error('Permission denied')};
assert.equal(await t.copyText('Copieer deze uitleg'),true,'Fallback must copy if clipboard access is rejected');
assert.equal(fallbackCalls,1);
assert.ok(copy.includes('data-v120-copy-message="arki:')&&copy.includes('data-v120-copy-message="tutor:'),'Own ARKI and Tutor messages must have copy actions');
assert.ok(copy.includes("if(action==='copy')return copyText(text)"),'AI answers must have copy actions');
console.log('SCHOLAVERUM AI CREDIT AUTH AND COPY PASS: auth 401 vs permission 403, secured RPC, multiline copy, blocked clipboard fallback');
