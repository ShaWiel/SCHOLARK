import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Lightweight contract emulator. This validates browser application behavior and
// eight-screen-recipient sending; it is NOT nine genuine networked devices.
const source=fs.readFileSync(new URL('../scholark-v122-connect.js',import.meta.url),'utf8');
const anchor='  window.__SCHOLARK_CONNECT__={';
assert.ok(source.includes(anchor),'Connect test hook anchor changed');
const program=source.replace(anchor,
  '  window.__TEST_CONNECT__={readVCF,readCSV,phoneE164,addDeviceContacts,clearDeviceContacts,wireDeviceContactDiscovery,runContactLookup,peer,shareScreen,stopScreen,enableIncomingAudio,state};\n'+anchor);
const uuid=n=>'00000000-0000-4000-8000-'+String(n).padStart(12,'0');
const elem=(id)=>({
  id,value:'',innerHTML:'',textContent:'',hidden:false,disabled:false,checked:false,dataset:{},
  classList:{toggle(){}},addEventListener(){},querySelector(){return null},
  querySelectorAll(){return []},click(){},getTracks(){return []}
});
const dom=new Map(),$=s=>{if(!dom.has(s))dom.set(s,elem(s));return dom.get(s)};
const calls=[],senders=[],videos=[],errors=[];
const incomingAudio=[];
let deferredContactResponse=null;
const mediaTrack={kind:'video',enabled:true,stop(){this.stopped=true}};
const capture={getVideoTracks:()=>[mediaTrack],getTracks:()=>[mediaTrack]};
const fakeNavigator={
  mediaDevices:{
    getUserMedia:async constraints=>{
      assert.equal(constraints.video,false,'Voice call attempted webcam permission');
      return {getAudioTracks:()=>[{kind:'audio'}],getTracks:()=>[{kind:'audio'}]};
    },
    getDisplayMedia:async c=>{
      assert.equal(c.video.frameRate.max,12);
      assert.equal(c.audio,false);
      return capture;
    }
  }
};
class FakePeer{
  constructor(){this.tracks=[];this.closed=false}
  addTrack(t){this.tracks.push(t)}
  addTransceiver(kind,options){
    assert.equal(kind,'video');assert.equal(options.direction,'sendrecv');
    const sender={track:null,replaceTrack:async t=>{sender.track=t;senders.push(t?.kind||null)}};
    this.__sender=sender;return {sender}
  }
  close(){this.closed=true}
  createDataChannel(){}
}
const response=body=>({ok:true,status:200,json:async()=>body});
const mockFetch=async(url,opts)=>{
  calls.push({url:String(url),method:opts?.method||'GET',body:opts?.body});
  if(String(url).endsWith('/rpc/connect_find_contacts')){
    if(deferredContactResponse)return deferredContactResponse;
    return response([{user_id:uuid(13),handle:'student13',display_name:'Student Thirteen'}]);
  }
  if(String(url).endsWith('/rpc/connect_screen_share'))return response(true);
  return response([]);
};
const sandbox={
  window:{__SCHOLARK_TEST_MODE__:true,
    __SCHOLARK_V72_CLOUD__:{currentSession:()=>({access_token:'QA_ONLY_TEST_SESSION',user:{id:uuid(1)}})},
    addEventListener(){}},
  document:{head:{appendChild(){}},createElement:()=>elem('created'),querySelector:$,querySelectorAll:selector=>selector==='audio[id^="v122-audio-"]'?incomingAudio:[],addEventListener(){}},
  navigator:fakeNavigator,console:{warn:(...args)=>errors.push(args.join(' '))},
  fetch:mockFetch,MediaStream:class{constructor(tracks){this.tracks=tracks}},
  RTCPeerConnection:FakePeer,URL,URLSearchParams,Date,Map,Set,Promise,
  setInterval:()=>0,clearInterval(){},setTimeout:()=>0,clearTimeout(){},
  confirm:()=>true
};
vm.runInNewContext(program,sandbox,{filename:'scholark-v122-connect.js'});
const test=sandbox.window.__TEST_CONNECT__;
assert.ok(test,'Connect QA functions were not exposed in simulation');

// iOS-style vCard import, folded lines and international phone.
const cards=test.readVCF('BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Student Thirteen\r\nEMAIL;TYPE=INTERNET:person13@example.test\r\nTEL;TYPE=CELL:+5978110013\r\nEND:VCARD\r\n');
assert.equal(cards.length,1);
assert.equal(cards[0].email[0],'person13@example.test');
assert.equal(cards[0].tel[0],'+5978110013');
// Cross-device CSV export, including quoted comma in a contact name.
const csv=test.readCSV('Full Name,Email 1 - Value,Phone 1 - Value\r\n"Student, Fifteen",person15@example.test,+5978110015\r\n');
assert.equal(csv.length,1);
assert.equal(csv[0].name,'Student, Fifteen');
assert.equal(csv[0].tel[0],'+5978110015');
assert.equal(test.phoneE164('08110015','+597'),'+5978110015');
assert.equal(test.phoneE164('not-a-number','+597'),'');

// Unsupported Contact Picker path must prompt import rather than request permission.
test.state.profile={contact_discovery_enabled:false};
test.wireDeviceContactDiscovery();
assert.equal($('#v122-contacts-visible').checked,false);
await $('#v122-pick').onclick();
assert.match($('#v122-status').textContent,/import|browser/i);

// Supported mobile Contact Picker must explicitly select contacts on a button action.
fakeNavigator.contacts={select:async(columns,options)=>{
  assert.ok(columns.includes('name')&&columns.includes('email')&&columns.includes('tel'));
  assert.equal(options.multiple,true);
  return [{name:['Student Thirteen'],email:['person13@example.test'],tel:['+5978110013']}];
}};
await $('#v122-pick').onclick();
assert.equal(test.state.contacts.length,1);
assert.equal(test.state.contactPicked.size,0,'Contacts must not auto-upload');
test.state.contactPicked.add(0);
await test.runContactLookup();
const req=calls.find(c=>c.url.endsWith('/rpc/connect_find_contacts'));
assert.ok(req,'Selected lookup was not sent');
assert.deepEqual(JSON.parse(req.body),{p_emails:['person13@example.test'],p_phones:['+5978110013']});
assert.ok(!req.body.includes('Student Thirteen'),'A contact name was uploaded');
assert.equal(test.state.contacts.length,0,'Raw contacts not cleared after lookup');
assert.equal(test.state.contactMatches.length,1,'Expected opted-in match from mocked RPC');
test.clearDeviceContacts();
assert.equal(test.state.contactMatches.length,0,'Clear must remove display matches');

// A lookup response arriving AFTER clearing data must never restore contact matches.
test.state.me={id:uuid(1)};
test.addDeviceContacts([{name:['Old account contact'],email:['old@example.test']}]);
test.state.contactPicked.add(0);
let resolveResponse;
deferredContactResponse=new Promise(resolve=>{resolveResponse=resolve});
const pendingCleared=test.runContactLookup();
assert.equal(test.state.contactBusy,true);
test.clearDeviceContacts();
resolveResponse(response([{user_id:uuid(99),handle:'stale',display_name:'Stale Contact'}]));
await pendingCleared;
assert.equal(test.state.contacts.length,0);
assert.equal(test.state.contactMatches.length,0,'Delayed contact results leaked after clear');
assert.equal(test.state.contactBusy,false,'Clear should release lookup busy state');
deferredContactResponse=null;

// A response from the previous account must be ignored after switching profiles.
test.addDeviceContacts([{name:['Previous user'],email:['previous@example.test']}]);
test.state.contactPicked.add(0);
deferredContactResponse=new Promise(resolve=>{resolveResponse=resolve});
const pendingSwitch=test.runContactLookup();
test.state.me={id:uuid(2)};
resolveResponse(response([{user_id:uuid(98),handle:'old_account',display_name:'Old Account Match'}]));
await pendingSwitch;
assert.equal(test.state.contactMatches.length,0,'Prior account matches surfaced after account switch');
test.clearDeviceContacts();
test.state.me={id:uuid(1)};
deferredContactResponse=null;

// Delayed device picker completion after leaving Connect must not restore contacts.
let releasePicker;
fakeNavigator.contacts.select=()=>new Promise(resolve=>{releasePicker=resolve});
const delayedPicker=$('#v122-pick').onclick();
test.clearDeviceContacts();
releasePicker([{name:['Sensitive old contact'],email:['sensitive@example.test']}]);
await delayedPicker;
assert.equal(test.state.contacts.length,0,'Picker exposed contacts after workspace data was cleared');

// One simulated participant with eight mocked peers (nine seats including self).
test.state.room={id:uuid(99)};
test.state.me={id:uuid(1)};
test.state.local={getAudioTracks:()=>[{kind:'audio'}],getTracks:()=>[{kind:'audio'}]};
for(let id=2;id<=9;id++)await test.peer(uuid(id),false);
assert.equal(test.state.peers.size,8);
for(const pc of test.state.peers.values()){
  assert.equal(pc.tracks.length,1,'Peer should send audio only until sharing');
  assert.equal(pc.tracks[0].kind,'audio');
  assert.equal(pc.__sender.track,null,'Camera track should not exist');
}
await test.shareScreen();
assert.equal(test.state.screen,capture);
assert.equal(test.state.screenOwner,uuid(1));
assert.equal([...test.state.peers.values()].filter(pc=>pc.__sender.track===mediaTrack).length,8,
  'One screensharer must send to eight peer receivers');
test.stopScreen();
assert.equal(test.state.screen,null);
assert.equal([...test.state.peers.values()].filter(pc=>pc.__sender.track!==null).length,0);

// A blocked autoplay stream must be recoverable through an explicit call action.
let soundPlays=0;
incomingAudio.push({play:async()=>{soundPlays++}});
assert.equal(await test.enableIncomingAudio(),true);
assert.equal(soundPlays,1,'Explicit enable-sound action did not retry remote audio');
assert.match($('#v122-status').textContent,/Incoming audio enabled/);
incomingAudio[0].play=async()=>{throw Error('Autoplay denied')};
assert.equal(await test.enableIncomingAudio(),false);
assert.match($('#v122-status').textContent,/remains blocked/);
incomingAudio.length=0;

console.log('CONNECT ISOLATED DEVICE QA PASS: Android picker simulation; iOS/Desktop vCard/CSV; privacy selection and stale-response isolation; mocked 9-seat audio and 8 screen recipients.');
