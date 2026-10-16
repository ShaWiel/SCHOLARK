import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const guard = readFileSync('scholark-api-guard.mjs', 'utf8');
const start=guard.indexOf('function consumeBurst(client) {');
const end=guard.indexOf('function hardenServer(server)',start);
assert.ok(start>0 && end>start, 'AI burst rate limiter not found');
assert.match(guard,/maxBurstBuckets:MAX_BURST_BUCKETS,trackedBurstClients:burstBuckets.size/);
const source=guard.slice(start,end) + '\nconsumeBurst';
let now=10_000;
const state={
  burstBuckets:new Map(),
  Date:{now:()=>now},
  BURST_WINDOW_MS:60_000,
  EXPENSIVE_BURST_LIMIT:32,
  MAX_BURST_BUCKETS:10_000,
  Math
};
const burst=vm.runInNewContext(source,state,{filename:'scholark-api-guard.mjs'});
for(let i=0;i<11_500;i++){
  const result=burst('unique-user-'+i);
  assert.equal(result.allowed,true);
}
assert.ok(state.burstBuckets.size<=10_000,'Unique fake clients must not cause unbounded burst map growth');
const protectedKey='sustained-client';
for(let i=0;i<32;i++){
  const result=burst(protectedKey);
  assert.equal(result.allowed,true,'First 32 requests must remain allowed');
}
const rejected=burst(protectedKey);
assert.equal(rejected.allowed,false,'33rd request must still hit the burst limiter');
assert.ok(rejected.retryAfter>=1 && rejected.retryAfter<=60);
now+=61_000;
assert.equal(burst(protectedKey).allowed,true,'Burst usage must reset in the next window');
assert.ok(state.burstBuckets.size<=10_000,'Expired-key cleanup must retain memory bounds');
console.log('SCHOLAVERUM r275 API RATE MEMORY PASS: bounded burst buckets, real rate-limit behavior, window reset');
