import fs from 'node:fs';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(p,'utf8');
const docker=read('Dockerfile');
const guard=read('scholark-api-guard.mjs');
const security=read('scholark-security-foundation.mjs');
const auth=read('scholark-v72-cloud-projects.js');
const accountSecurity=read('scholark-v118-account-security.js');
const launch=read('scholark-v116-launch-foundation.js');
const reference=read('studio-reference-route.mjs');
const migration=read('supabase/migrations/20261006_security_foundation_r217.sql');

assert.match(docker,/scholark-security-foundation\.mjs/);
assert.match(docker,/scholark-v118-account-security\.js/);
assert.match(docker,/SCHOLARK_RELEASE=r217/);
assert.match(guard,/content-security-policy/);
assert.match(guard,/strictMutationOrigin:true/);
assert.match(guard,/SENSITIVE_QUERY_BLOCKED/);
assert.match(security,/STEP_UP_REQUIRED/);
assert.match(security,/DUPLICATE_ACTION_BLOCKED/);
assert.match(security,/rawIpStored:false/);
assert.match(security,/tokensStored:false/);
assert.match(security,/USER_RATE_LIMITED/);
assert.match(launch,/x-scholark-step-up/);
assert.match(auth,/gotrue_meta_security/);
assert.match(auth,/scholark_recovery_used_v1/);
assert.match(auth,/Too many sign-in attempts/);
assert.match(accountSecurity,/\/auth\/v1\/factors/);
assert.match(accountSecurity,/logout\?scope=others/);
assert.match(reference,/%PDF-/);
assert.match(reference,/ZIP_LIMIT/);
assert.match(migration,/as restrictive to authenticated/i);
assert.match(migration,/auth\.mfa_factors/);
assert.match(migration,/revoke all on table public\.security_events from anon, authenticated/i);

for (const file of fs.readdirSync('.').filter(x=>x.endsWith('.js'))) {
  const source=read(file);
  assert.ok(!source.includes('SUPABASE_SERVICE_ROLE_KEY'),file+' must not reference the Supabase service role key in browser JavaScript');
}
for (const file of fs.readdirSync('.').filter(x=>x.endsWith('.mjs'))) {
  const source=read(file);
  assert.ok(!/console\.(log|warn|error)\([^\n]*(SERVICE_ROLE_KEY|access_token|refresh_token|password)/i.test(source),file+' may log a secret');
  assert.ok(!/fetch\s*\(\s*(body|payload|data)\??\.(url|href)/i.test(source),file+' contains a possible user-controlled SSRF fetch');
}
console.log('SCHOLARK SECURITY CONTRACTS',JSON.stringify({ok:true,release:'r217'}));
