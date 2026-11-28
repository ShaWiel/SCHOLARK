import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const files = [
  ['scholaverum-notification-icon-192.png', 192],
  ['scholaverum-notification-badge-96.png', 96]
];
const signature = Buffer.from('89504e470d0a1a0a', 'hex');
const source = readFileSync('scholark-sw.js', 'utf8');
const client = readFileSync('scholark-v121-notifications.js', 'utf8');
const docker = readFileSync('Dockerfile', 'utf8');
assert.match(source, /SW_RELEASE='20261125-r312-approved-orbital-logo'/);
assert.match(client, /SW_VERSION='20261125-r312-approved-orbital-logo'/);
const origin = String(process.argv[2] || '').replace(new RegExp('/$'), '');
for (const [name, size] of files) {
  const bytes = readFileSync(name);
  assert.ok(bytes.subarray(0, 8).equals(signature), name + ' must be a real PNG');
  assert.equal(bytes.toString('ascii', 12, 16), 'IHDR', name + ' must have an IHDR chunk');
  assert.equal(bytes.readUInt32BE(16), size, name + ' incorrect width');
  assert.equal(bytes.readUInt32BE(20), size, name + ' incorrect height');
  assert.ok(bytes.length > 200 && bytes.length < 35000, name + ' unexpected size');
  assert.ok(bytes.includes(Buffer.from('tRNS')), name + ' must preserve transparent notification padding');
  assert.ok(source.includes("'/" + name + "'"), 'Push SW missing ' + name);
  assert.ok(client.includes("'/" + name + "'"), 'Local probe missing ' + name);
  assert.ok(docker.includes('COPY ' + name + ' /app/' + name), 'Production Docker image missing ' + name);
  if (origin) {
    const res = await fetch(origin + '/' + name, {headers:{'cache-control':'no-cache'}});
    assert.equal(res.status, 200, name + ' HTTP ' + res.status);
    assert.ok(String(res.headers.get('content-type')).toLowerCase().includes('image/png'), name + ' must be served as image/png');
    const deployed = Buffer.from(await res.arrayBuffer());
    assert.equal(createHash('sha256').update(deployed).digest('hex'), createHash('sha256').update(bytes).digest('hex'), 'Runtime asset bytes differ: ' + name);
  }
}
// Exercise real service-worker event handlers with mocked browser APIs.
const handlers={},shown=[],opened=[],steps=[];
const originUrl='https://scholaverum.example';
const worker={
  location:{origin:originUrl},
  addEventListener:(name,fn)=>{handlers[name]=fn},
  registration:{showNotification:async(title,options)=>{shown.push({title,options})}},
  clients:{matchAll:async()=>[],openWindow:async url=>{opened.push(url)}}
};
vm.runInNewContext(source,{self:worker,URL,Date});
async function dispatch(name,event){
  let task;
  handlers[name]({...event,waitUntil:p=>{task=p}});
  await task;
}
await dispatch('push',{data:{json:()=>null}});
assert.equal(shown[0].title,'SCHOLAVERUM');
await dispatch('push',{data:{json:()=>({title:'Homework',tag:'task-1',url:'https://external.example/'})}});
assert.equal(shown[1].options.tag,'task-1');
assert.equal(shown[1].options.data.url,originUrl+'/#dashboard');
const target=originUrl+'/#assignments';
worker.clients.matchAll=async()=>[{url:originUrl+'/#dashboard',navigate:async url=>{steps.push('navigate:'+url);return {focus:async()=>steps.push('focus')}}}];
await dispatch('notificationclick',{notification:{data:{url:target},close:()=>steps.push('close')}});
assert.deepEqual(steps,['close','navigate:'+target,'focus']);
worker.clients.matchAll=async()=>[{url:target,focus:async()=>{throw Error('focus failed')},navigate:async()=>{throw Error('navigation failed')}}];
await dispatch('notificationclick',{notification:{data:{url:target},close:()=>{}}});
assert.equal(opened.at(-1),target);

// Verify assignment sync against delivered, pending and absent remote reminders.
const syncStart=client.indexOf('  async function syncAssignments(){'),syncEnd=client.indexOf('  function fmt(',syncStart);
assert.ok(syncStart>=0&&syncEnd>syncStart);
const date='2099-01-01',writes=[];
const records=[
  {id:'delivered',dedupe_key:'local-assignment:sent:'+date,status:'sent'},
  {id:'pending',dedupe_key:'local-assignment:active:'+date,status:'pending'},
  {id:'other-device',dedupe_key:'local-assignment:remote:'+date,status:'pending'},
  {id:'done',dedupe_key:'local-assignment:done:'+date,status:'pending'}
];
const assignments=[{id:'sent',dueDate:date},{id:'active',dueDate:date},{id:'new',dueDate:date},{id:'done',dueDate:date,status:'complete'},{id:'expired',dueDate:'2000-01-01'}];
let owner='user-a',readOk=true;
const cloudMock={currentSession:()=>({user:{id:owner}}),request:async(path,opts)=>{
  if(opts){writes.push({path,body:JSON.parse(opts.body)});return {ok:true}}
  return {ok:readOk,json:async()=>records};
}};
const context={uid:'user-a',c:cloudMock};
const sync=vm.runInNewContext(client.slice(syncStart,syncEnd)+'\nsyncAssignments',{
  ctx:async()=>context,load:async()=>({x:context,pref:{task_lead_minutes:60}}),
  localAssignments:()=>assignments,clean:(x,n)=>String(x??'').slice(0,n),syncTimer:0,clearTimeout:()=>{},Date,encodeURIComponent
});
await sync();
assert.equal(writes.length,3);
assert.ok(writes.some(w=>w.path.includes('id=eq.pending')&&w.path.includes('status=eq.pending')&&!('status' in w.body)));
assert.ok(writes.some(w=>w.body.dedupe_key==='local-assignment:new:'+date&&w.body.status==='pending'));
assert.ok(writes.some(w=>w.path.includes('id=eq.done')&&w.body.status==='cancelled'));
assert.ok(!writes.some(w=>w.path.includes('other-device')||w.path.includes('delivered')||w.body.dedupe_key?.includes('expired')));
writes.length=0;readOk=false;await sync();assert.equal(writes.length,0);
readOk=true;owner='user-b';await sync();assert.equal(writes.length,0);
// Read controls remain account-scoped and cannot mutate another user's local history.
const inboxStart=client.indexOf('  const inboxReadKey='),inboxEnd=client.indexOf('  async function load(){',inboxStart);
assert.ok(inboxStart>=0&&inboxEnd>inboxStart);
const store=new Map();let inboxOwner='user-a';
const inbox=vm.runInNewContext(client.slice(inboxStart,inboxEnd)+'\n({inboxRead,markInboxRead})',{
  cloud:()=>({currentSession:()=>({user:{id:inboxOwner}})}),
  localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)}
});
assert.ok(inbox.markInboxRead('user-a',['reminder-1']));
assert.ok(inbox.inboxRead('user-a').has('reminder-1'));
inboxOwner='user-b';
assert.equal(inbox.inboxRead('user-b').size,0);
assert.equal(inbox.markInboxRead('user-a',['reminder-2']),false);
assert.ok(!inbox.inboxRead('user-a').has('reminder-2'));
assert.ok(inbox.markInboxRead('user-b',Array.from({length:600},(_,i)=>'r'+i)));
assert.equal(inbox.inboxRead('user-b').size,500);
// Read updates must be sent only for the signed-in account and already-sent rows.
const syncReadStart=client.indexOf('  async function syncInboxRead('),syncReadEnd=client.indexOf('  async function load(){',syncReadStart);
assert.ok(syncReadStart>=0&&syncReadEnd>syncReadStart);
let readOwner='user-a';const readWrites=[];
const syncRead=vm.runInNewContext(client.slice(syncReadStart,syncReadEnd)+'\nsyncInboxRead',{
  cloud:()=>({currentSession:()=>({user:{id:readOwner}}),request:async(path,opts)=>{readWrites.push({path,opts});return {ok:true}}}),Date,encodeURIComponent
});
const reminderId='12345678-1234-1234-1234-123456789abc';
assert.equal(await syncRead('user-a',[reminderId,reminderId,'bad']),true);
assert.equal(readWrites.length,1);
assert.ok(readWrites[0].path.includes('user_id=eq.user-a&status=eq.sent&read_at=is.null'));
assert.ok(readWrites[0].path.endsWith('id=in.('+reminderId+')'));
assert.ok(JSON.parse(readWrites[0].opts.body).read_at);
readOwner='user-b';assert.equal(await syncRead('user-a',[reminderId]),false);assert.equal(readWrites.length,1);
console.log('SCHOLAVERUM NOTIFICATION ICON SMOKE', JSON.stringify({ok:true,items:files.map(([name,size])=>({name,size})),runtime:!!origin}));
