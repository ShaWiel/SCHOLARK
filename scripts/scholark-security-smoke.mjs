import assert from 'node:assert/strict';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const health=await fetch(base+'/api/security/health').then(async r=>({status:r.status,body:await r.json()}));
assert.equal(health.status,200);
assert.equal(health.body?.ok,true);
assert.equal(health.body?.stepUp?.sessionBound,true);
assert.equal(health.body?.abuse?.perIp,true);
assert.equal(health.body?.abuse?.perUser,true);
assert.equal(health.body?.events?.rawIpStored,false);
assert.equal(health.body?.events?.tokensStored,false);
assert.equal(health.body?.failClosed,true);

const method=await fetch(base+'/api/security/step-up',{method:'DELETE',headers:{'content-type':'application/json'},body:'{}'});
assert.equal(method.status,405);

const unauth=await fetch(base+'/api/account/export');
assert.ok([401,428].includes(unauth.status),'sensitive account export must fail closed without auth/step-up');

console.log('SCHOLARK SECURITY SMOKE',JSON.stringify({ok:true,health:health.body.version,unauthStatus:unauth.status}));
