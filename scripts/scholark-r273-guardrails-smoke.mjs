import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(path, 'utf8');
const sql = read('supabase/migrations/20261016_connect_coming_soon_api_lockdown_r273.sql');
const billing = read('scholark-billing-route.mjs');
const runtime = read('scholark-runtime-loader.js');
const foundation = read('scholark-v101-core-foundation.js');
const docker = read('Dockerfile');

assert.match(sql, /left\(p\.proname,\s*8\)\s*=\s*'connect_'/);
assert.match(sql, /left\(c\.relname,\s*8\)\s*=\s*'connect_'/);
assert.match(sql, /REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated/);
assert.match(sql, /REVOKE ALL PRIVILEGES ON TABLE public\.%I FROM PUBLIC, anon, authenticated/);
assert.doesNotMatch(sql, /\bDROP\s+(TABLE|FUNCTION)\b/i, 'Do not delete existing Connect data');
assert.match(read('scholark-v122-connect.js'), /CONNECT_RELEASE_STATE='coming-soon'/);

const release = 'r288-orbital-brand-sphere';
assert.ok(runtime.includes("const VERSION = '20261017-" + release + "'"));
assert.ok(runtime.includes("connect:false,release:'" + release + "'"));
assert.ok(foundation.includes("const RELEASE = '" + release + "'"));
assert.ok(docker.includes('ENV SCHOLARK_RELEASE=' + release));
assert.ok(docker.includes('?v=20261017-' + release));

function extract(start, stop) {
  const a = billing.indexOf(start);
  const b = billing.indexOf(stop, a + start.length);
  assert.ok(a >= 0 && b > a, 'Missing production billing guardrail: ' + start);
  return billing.slice(a, b);
}

const preflightSource = extract('async function liveBillingPreflight()', 'function rebrandCatalogText');
assert.doesNotMatch(preflightSource, /repairCatalogBrandSet\s*\(/, 'Live preflight must not patch products or prices');
assert.match(preflightSource, /mode:'read_only'/);
const preflightEnv = {
  LIVE_PRICES: {plus:'pri_plus', pro:'pri_pro'},
  livePreflightHealth: {},
  liveCredentialShapes: () => true,
  livePaddle: async (path, opts) => {
    assert.equal(path, '/event-types');
    assert.equal(opts.method, 'GET');
    return {ok:true,json:async()=>({})};
  },
  verifyLiveCatalogPrice: async plan => ({ok:plan==='plus',reason:plan==='plus'?'':'unexpected_trial'}),
  repairCatalogBrandSet: () => { throw Error('Unexpected production catalog mutation'); },
  Date,
  Promise
};
const preflight = vm.runInNewContext(preflightSource + '\nliveBillingPreflight', preflightEnv);
const preflightResult = await preflight();
assert.equal(preflightResult.ok, false, 'Pro failure must block production switch');
assert.equal(preflightResult.brandRepair.mode, 'read_only');
assert.equal(preflightResult.pro.reason, 'unexpected_trial');

const webhookSource = extract('async function verifyWebhookDestination(', 'async function billingSelftest()');
assert.match(webhookSource, /if\(!row&&readOnly\)return/);
assert.match(webhookSource, /if\(needsRepair&&readOnly\)return/);
let writeAttempts = 0;
const mockPaddle = async (path, opts) => {
  if (opts?.method && opts.method !== 'GET') {
    writeAttempts++;
    throw Error('Production webhook may not be written during audit');
  }
  const active = !path.includes('active=false');
  return {ok:true,json:async()=>({data:active?[
    {id:'n_1',description:'SCHOLAVERUM billing webhook',destination:'https://incorrect.invalid/api/billing/webhook',
      type:'url',active:true,traffic_source:'all',subscribed_events:[]}
  ]:[]})};
};
const webhookEnv = {
  ENV:'production',
  WEBHOOK_URL:'https://scholark-app-shawiel.onrender.com/api/billing/webhook',
  WEBHOOK_SECRET:'test-secret',
  paddle:mockPaddle,
  Promise,
  String,
  Array,
  Set
};
const webhookAudit = vm.runInNewContext(webhookSource + '\nverifyWebhookDestination', webhookEnv);
const webhookResult = await webhookAudit();
assert.equal(webhookResult.ok,false);
assert.equal(webhookResult.reason,'webhook_needs_manual_repair');
assert.equal(writeAttempts,0,'Production audit must never PATCH/POST Paddle notification settings');

const productionAudit = extract('async function billingSelftest()', 'function allowance(');
assert.match(productionAudit, /ENV==='production'\?\{ok:true,repaired:false,mode:'read_only'\}:await repairCatalogBrandSet/);
assert.match(productionAudit, /verifyWebhookDestination\(\{readOnly:ENV==='production'\}\)/);
assert.match(billing, /reason=ok\?'':!active\?'price_inactive'/,
  'Price validation failures must include specific reasons instead of http_unknown');

console.log('SCHOLAVERUM r273 GUARDRAILS RETAINED IN r278: Connect API launch lock, release alignment, production Paddle audit is read-only and diagnostics are specific');
