import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(path, 'utf8');
const migration = read('supabase/migrations/20261015_connect_rls_privacy_performance_r272.sql');
const ai = read('scholark-v107-general-ai.js');
const controls = read('scholark-v120-experience-controls.js');
const connect = read('scholark-v122-connect.js');
const runtime = read('scholark-runtime-loader.js');
const foundation = read('scholark-v101-core-foundation.js');
const docker = read('Dockerfile');

assert.match(migration, /m\.user_id\s*=\s*connect_identities\.user_id/,
  'Private Connect identities must be associated with the target identity, not any room member');
assert.doesNotMatch(migration.replace(/^--.*$/gm, ''), /m\.user_id\s*=\s*m\.user_id/,
  'Self-comparison reintroduces exposure of unrelated Connect identities');
assert.match(migration, /AND m\.left_at IS NULL\s+AND public\.connect_member/,
  'Room discovery must be limited to active shared membership');
for (const table of ['connect_blocks','connect_friends','connect_messages','connect_reports','connect_room_chat','connect_room_members','connect_rooms','connect_signals']) {
  assert.ok(migration.includes('ON public.' + table), table + ' requires safe RLS optimization');
}
assert.equal((migration.match(/CREATE INDEX IF NOT EXISTS/g) || []).length, 6,
  'All six missing foreign key support indexes are required');
assert.match(connect, /CONNECT_RELEASE_STATE='coming-soon'/,
  'Connect stays disabled until the actual launch');

assert.match(controls, /data-v120-copy-message="arki:/,
  'Retain existing ARKI copy controls rather than inserting duplicates');
assert.match(controls, /data-v120-copy-message="tutor:/,
  'Retain existing Tutor copy controls');

const a = ai.indexOf('  const withTimeout=');
const b = ai.indexOf('  async function resolvedSession', a);
assert.ok(a > 0 && b > a, 'ARKI session timeout helper missing');
let made = 0, cleared = 0;
const timer = ms => ms;
const schedule = (fn, ms) => { made++; return setTimeout(fn, ms) };
const cancel = id => { cleared++; clearTimeout(id) };
const withTimeout = vm.runInNewContext(ai.slice(a,b) + '\nwithTimeout', {
  Promise, Error, setTimeout: schedule, clearTimeout: cancel
});
assert.equal(await withTimeout(Promise.resolve('ok'), 1000), 'ok');
await assert.rejects(withTimeout(Promise.reject(new Error('denied')), 1000), /denied/);
assert.equal(made, 2);
assert.equal(cleared, 2, 'Successful and failed session checks must release their timers');

// Retain r272 behavioral regression tests while advancing the deployed release.
const release = 'r287-schools-mount-and-legacy-lock';
const cache = '20261017-' + release;
assert.ok(runtime.includes("const VERSION = '" + cache + "'"));
assert.ok(foundation.includes("const RELEASE = '" + release + "'"));
assert.ok(docker.includes('ENV SCHOLARK_RELEASE=' + release));
assert.ok(docker.includes('?v=' + cache));
console.log('SCHOLAVERUM r272 REGRESSION RETAINED IN r273: RLS identity privacy, indexes, ARKI timeout cleanup, copy compatibility, Coming Soon and runtime cache');
