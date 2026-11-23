import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const files = [
  ['scholaverum-notification-icon-192.png', 192],
  ['scholaverum-notification-badge-96.png', 96]
];
const signature = Buffer.from('89504e470d0a1a0a', 'hex');
const source = readFileSync('scholark-sw.js', 'utf8');
const client = readFileSync('scholark-v121-notifications.js', 'utf8');
const docker = readFileSync('Dockerfile', 'utf8');
assert.match(source, /SW_RELEASE='20261123-r311-notification-icons'/);
assert.match(client, /SW_VERSION='20261123-r311-notification-icons'/);
const origin = String(process.argv[2] || '').replace(/\\/$/, '');
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
    assert.match(String(res.headers.get('content-type')), /image\\/png/i, name + ' must be served as image/png');
    const deployed = Buffer.from(await res.arrayBuffer());
    assert.equal(createHash('sha256').update(deployed).digest('hex'), createHash('sha256').update(bytes).digest('hex'), 'Runtime asset bytes differ: ' + name);
  }
}
console.log('SCHOLAVERUM NOTIFICATION ICON SMOKE', JSON.stringify({ok:true,items:files.map(([name,size])=>({name,size})),runtime:!!origin}));
