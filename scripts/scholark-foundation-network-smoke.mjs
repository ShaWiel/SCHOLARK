import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const foundation=readFileSync('scholark-v113-foundation-hardening.js','utf8');
const start=foundation.indexOf('  async function fetchJson(');
const end=foundation.indexOf('  function recordError(',start);
assert.ok(start>0&&end>start,'Foundation fetch helper changed without test update');

let signals=[],calls=0;
const request=(url,options)=>{
  calls++;signals.push(options.signal);
  assert.equal(options.credentials,'same-origin','Only same-origin cookies permitted');
  return new Promise((resolve,reject)=>{
    if(options.signal.aborted){reject(Object.assign(new Error('Aborted'),{name:'AbortError'}));return}
    options.signal.addEventListener('abort',()=>reject(Object.assign(new Error('Aborted'),{name:'AbortError'})),{once:true});
  });
};
const api=vm.runInNewContext(foundation.slice(start,end)+'\n({fetchJson})',{fetch:request,location:{origin:'https://scholaverum.example'},URL,AbortController,Math,Number,setTimeout,clearTimeout,Error});
await assert.rejects(api.fetchJson('https://outside.example/api/test'),/Cross-origin foundation requests/);
assert.equal(calls,0,'Cross-origin request must not reach fetch');

const controller=new AbortController();
const external=api.fetchJson('/api/health',{signal:controller.signal},60000);
controller.abort();
await assert.rejects(external,/Aborted/);
assert.equal(signals.at(-1).aborted,true,'Caller abort signal must forward into the bounded network request');

const started=Date.now();
await assert.rejects(api.fetchJson('/api/health',{},1),/Aborted/);
assert.ok(Date.now()-started<1900,'A request must time out even without caller-controlled cancellation');
console.log('SCHOLAVERUM FOUNDATION NETWORK RESILIENCE PASS: same-origin, external abort, bounded timeout');
