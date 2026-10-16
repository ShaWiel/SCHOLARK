import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const arki=readFileSync('scholark-v107-general-ai.js','utf8');
const tutor=readFileSync('scholark-v62-learning-ai.js','utf8');
const controls=readFileSync('scholark-v120-experience-controls.js','utf8');
const between=(source,start,end)=>{
  const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
  assert.ok(a>=0&&b>a,'Missing source for '+start);
  return source.slice(a,b);
};

const alice='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const bob='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const state=new Map(),memoryStorage={
  getItem:key=>state.get(key)??null,
  setItem:(key,value)=>state.set(key,String(value)),
  removeItem:key=>state.delete(key)
};
let user=alice,ids=0;
const cloud={currentSession:()=>user==='guest'?null:{user:{id:user},access_token:'mock'}};
const browser={__SCHOLARK_V72_CLOUD__:cloud};
const setUser=id=>{
  user=id;
  memoryStorage.setItem('scholark_supabase_session_v2',id==='guest'?'null':JSON.stringify({user:{id},access_token:'mock'}));
};
setUser(alice);
memoryStorage.setItem('scholark_v107_general_ai_chats',JSON.stringify([{id:'unowned',messages:[{role:'user',content:'unattributed confidential chat'}]}]));
memoryStorage.setItem('scholark_v120_tutor_chats',JSON.stringify([{id:'unowned',messages:[{role:'user',text:'unattributed homework'}]}]));
memoryStorage.setItem('scholark_v62_tutor_history',JSON.stringify([{role:'user',text:'legacy sensitive history'}]));

const arkiSource=between(arki,'  function ownerId(){','  function outputLanguage(){');
const arkiApi=vm.runInNewContext(arkiSource+'\n({ownerId,read,write,createChat,getCurrent,update,readDraft,writeDraft})',{
  window:browser,localStorage:memoryStorage,sessionStorage:memoryStorage,
  KEY:'scholark_v107_general_ai_chats',ACTIVE:'scholark_v107_general_ai_active',DRAFT_KEY:'scholark_v107_general_ai_drafts',
  uid:()=>String(++ids),Date,JSON,String,Math
});
assert.equal(arkiApi.read().length,0,'Legacy unowned ARKI messages cannot be assigned to a signed-in user');
const aChat=arkiApi.createChat();
arkiApi.update(aChat.id,x=>x.messages.push({role:'user',content:'Alice private math problem'}));
arkiApi.writeDraft(aChat.id,'Alice private unfinished question');
setUser(bob);
assert.equal(arkiApi.read().length,0,'Bob must not see Alice ARKI history');
assert.equal(arkiApi.readDraft(aChat.id),'','Bob must not see Alice ARKI drafts');
const bChat=arkiApi.createChat();
arkiApi.update(bChat.id,x=>x.messages.push({role:'user',content:'Bob private economics question'}));
arkiApi.update(aChat.id,x=>x.messages.push({role:'assistant',content:'Delayed reply for Alice'}),alice);
assert.equal(arkiApi.read().length,1);
assert.ok(!JSON.stringify(arkiApi.read()).includes('Alice'),'Late Alice reply must stay out of Bob history');
setUser(alice);
assert.ok(JSON.stringify(arkiApi.read()).includes('Delayed reply for Alice'));
assert.ok(!JSON.stringify(arkiApi.read()).includes('Bob private economics'));
assert.equal(arkiApi.readDraft(aChat.id),'Alice private unfinished question');
setUser('guest');
assert.equal(arkiApi.read().length,0,'Guest cannot inherit existing signed-in or legacy history');

const tutorFunctions=between(tutor,'  function tutorOwner(){','  function readAssignments(){');
const tutorEnv={window:browser,localStorage:memoryStorage,JSON,String,Date,Math};
const tutorApi=vm.runInNewContext(tutorFunctions+'\n({tutorOwner,readTutorHistory,writeTutorHistory})',tutorEnv);
setUser(alice);
assert.equal(tutorApi.readTutorHistory().length,0,'Unscoped legacy Tutor context must not be attributed to Alice');
tutorApi.writeTutorHistory([{role:'user',text:'Alice exclusive exercise'}]);
setUser(bob);
assert.equal(tutorApi.readTutorHistory().length,0,'Bob must not inherit Alice tutoring context');
tutorApi.writeTutorHistory([{role:'user',text:'Bob exclusive exercise'}]);
setUser(alice);
assert.equal(tutorApi.readTutorHistory()[0]?.text,'Alice exclusive exercise');

const controlsOwner=between(controls,'  function accountOwner(){','  function actionMarkup(');
const controlsTutor=between(controls,"  const TUTOR_KEY='scholark_v120_tutor_chats'","  function tutorProgressText(");
const controlsEnv={window:browser,localStorage:memoryStorage,JSON,String,Date,Math,
  uid:()=>String(++ids),now:()=>new Date().toISOString(),clean:x=>String(x||'').trim()};
const controlsApi=vm.runInNewContext(controlsOwner+controlsTutor+
  '\n({tutorChats,currentTutor,updateTutor,syncTutorBackend,tutorProgress,noteTutorProgress,feedback,setFeedback})',controlsEnv);
setUser(alice);
const aliceTutor=controlsApi.currentTutor();
controlsApi.updateTutor(x=>x.messages.push({role:'user',text:'Alice Tutor chat'}));
controlsApi.syncTutorBackend(controlsApi.currentTutor());
controlsApi.noteTutorProgress('Algebra',1,true);
controlsApi.setFeedback('message:0','up');
assert.equal(tutorApi.readTutorHistory()[0]?.text,'Alice Tutor chat','Tutor history API must agree across UI modules');
setUser(bob);
assert.equal(controlsApi.tutorChats().length,0,'Bob cannot browse Alice Tutor conversations');
assert.equal(tutorApi.readTutorHistory().length,1,'Existing Bob context remains isolated');
assert.equal(controlsApi.feedback()['message:0'],undefined,'Alice rating must not leak to Bob');
assert.equal(controlsApi.tutorProgress()['algebra'],undefined,'Alice learning progress must not leak to Bob');
controlsApi.updateTutor(x=>x.messages.push({role:'user',text:'Bob Tutor chat'}));
setUser(alice);
assert.equal(controlsApi.currentTutor().id,aliceTutor.id);
assert.ok(JSON.stringify(controlsApi.tutorChats()).includes('Alice Tutor chat'));
assert.ok(!JSON.stringify(controlsApi.tutorChats()).includes('Bob Tutor chat'));

assert.match(arki,/addEventListener\('scholark:auth-changed'/);
assert.match(arki,/responseOwner=ownerId\(\)/);
assert.match(arki,/responseOwner\);if\(viewOwner===responseOwner/);
assert.match(tutor,/if\(tutorInFlight\)return/);
assert.match(tutor,/writeTutorHistory\(hist,requestOwner\)/);
assert.match(tutor,/if\(tutorOwner\(\)===requestOwner\)window.dispatchEvent/);
assert.match(tutor,/addEventListener\('scholark:auth-changed'/);
assert.match(controls,/taskEpoch===attachmentEpoch\)st.items.push/);
assert.match(controls,/attachmentEpoch\+\+/);
assert.match(controls,/requestOwner===accountOwner\(\)&&r.ok&&d\?\.ok/);
assert.match(controls,/clearTimeout\(quotaState.timer\);quotaState.quota=null/);

// The Tutor frontend must not charge twice when Enter and the send button
// arrive in the same event-loop turn.
const tutorSendSource=between(tutor,'  async function runTutor(){','  async function runCurriculum(){');
let replyResolve,serverCalls=0,userBubbles=0,assistantEvents=0;
const answer=new Promise(resolve=>replyResolve=resolve);
const promptField={value:'Explain Newton laws',focus(){}},submit={disabled:false,textContent:'Ask'};
const chatBox={insertAdjacentHTML(){userBubbles++},appendChild(){}};
const tempNode=()=>({innerHTML:'',isConnected:true,remove(){},querySelector:()=>null});
const sendContext={...tutorEnv,
  document:{createElement:tempNode},
  $:selector=>selector==='#v52-tutor-q'?promptField:selector==='#v52-chat'?chatBox:selector==='#v52-tutor-send'?submit:null,
  multiline:x=>String(x||'').trim(),clean:x=>String(x||'').trim(),esc:x=>String(x||''),
  window:{...browser,dispatchEvent(event){if(event.type==='scholark:tutor-assistant')assistantEvents++},
    __SCHOLARK_CHAT_ATTACHMENTS__:{get:()=>[],meta:()=>[],busy:()=>false,clear(){}},
    __SCHOLARK_CHAT_QUOTA__:{sync(){},refresh(){},apply(){}}},
  CustomEvent:class {constructor(type,options){this.type=type;this.detail=options?.detail}},
  assignmentContextFor:()=>({intent:false,rows:[]}),
  call:async()=>{serverCalls++;return answer},
  tutorPlain:()=> 'Physics principles',tutorHtml:()=>'<div>Physics principles</div>',
  busy:(btn,on)=>{btn.disabled=on},
  error(){},setTimeout:()=>1,clearTimeout:()=>{},
  readTutorHistory:tutorApi.readTutorHistory,writeTutorHistory:tutorApi.writeTutorHistory,
  tutorOwner:tutorApi.tutorOwner,tutorInFlight:false
};
setUser(alice);
const tutorRunner=vm.runInNewContext(tutorSendSource+'\n({runTutor,pending:()=>tutorInFlight})',sendContext);
const doTutor=tutorRunner.runTutor;
const first=doTutor();
const second=doTutor();
assert.equal(serverCalls,1,'Simultaneous Tutor submission must only call the AI once');
assert.equal(userBubbles,1,'One Tutor user bubble per actual request');
replyResolve({result:{answer:'Force equals mass times acceleration'},provider:'mock',model:'mock'});
await Promise.all([first,second]);
assert.equal(assistantEvents,1,'One assistant response event per Tutor request');
assert.equal(tutorRunner.pending(),false,'Tutor must unlock when AI finishes');
assert.ok(tutorApi.readTutorHistory(alice).some(m=>m.text.includes('Physics principles')));
console.log('SCHOLAVERUM r277 ARKI/TUTOR ACCOUNT ISOLATION PASS: separate chats, drafts, tutoring context, feedback/progress; no legacy leak, pinned late replies, bounded submission concurrency and attachment invalidation');
