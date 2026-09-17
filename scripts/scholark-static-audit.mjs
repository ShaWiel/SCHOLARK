import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const fail=[];
const ok=(cond,msg)=>{if(!cond)fail.push(msg)};
const RELEASE='r136';
const VERSION='20260910-r136';

const runtime=read('scholark-runtime-loader.js');
const docker=read('Dockerfile');
const foundation=read('scholark-v101-core-foundation.js');
const prepaint=read('scholark-prepaint-head.html');
const gemini=read('scholark-gemini-primary.mjs');

ok(runtime.includes(`const VERSION = '${VERSION}'`),'runtime VERSION is not '+VERSION);
ok(foundation.includes(`const RELEASE = '${RELEASE}'`),'foundation RELEASE is not '+RELEASE);
ok(docker.includes(`ENV SCHOLARK_RELEASE=${RELEASE}`),'Docker release is not '+RELEASE);
ok(docker.includes(`?v=${VERSION}`),'Docker cache key is not '+VERSION);
ok(!runtime.includes('scholark-v97-foundation-coordinator.js'),'deprecated V97 coordinator is still active');
ok(!docker.includes('scholark-v97-foundation-coordinator.js'),'deprecated V97 coordinator is still copied');
ok(docker.includes('scholark-api-guard.mjs'),'API guard is not shipped');
ok(docker.includes('--import", "./scholark-api-guard.mjs"'),'API guard is not imported at runtime');
ok(docker.includes('scholark-gemini-primary.mjs'),'Gemini primary adapter is not shipped');
ok(docker.includes('--import", "./scholark-gemini-primary.mjs"'),'Gemini primary adapter is not imported at runtime');
ok(docker.includes('ENV SCHOLARK_AI_PROVIDER=gemini'),'Gemini is not configured as the primary AI provider');
ok(docker.includes('ENV GEMINI_PRIMARY_MODEL=gemini-3.8-flash'),'Gemini 3.8 Flash is not the primary model');
ok(gemini.includes("'/api/studio/generate'")&&gemini.includes("'/api/learning/generate'"),'Gemini adapter does not scope Studio + Learning generation routes');
ok(gemini.includes("prop === 'SCHOLARK_TEST_MODE'")&&gemini.includes("return '0'"),'Gemini adapter does not safely bypass test mode for scoped AI routes');
ok(gemini.includes('GEMINI_FALLBACK_MODELS'),'Gemini fallback models are not configurable');
ok(gemini.includes('gemini-3.7-flash')&&gemini.includes('gemini-3.6-flash')&&gemini.includes('gemini-3.5-flash-lite'),'Gemini fallback chain is incomplete');
ok(gemini.includes('retryableStatuses')&&gemini.includes('503'),'Gemini overload retry protection is missing');
ok(gemini.includes("ROUTER_VERSION = '20260916-gemini-fallback-v1'"),'Gemini fallback router version is not current');
ok(prepaint.includes("p==='/index.html'")||prepaint.includes("p === '/index.html'"),'prepaint lacks static-page/app-path guard');
ok(/language\|planner/.test(prepaint)&&/project\|files\|schools/.test(prepaint),'prepaint workspace route list is incomplete');
ok(runtime.includes("path !== '/' && path !== '/index.html'"),'runtime lacks non-app path guard');
ok(foundation.includes("p === '/' || p === '/index.html'"),'foundation lacks non-app path guard');

const activeBlock=(runtime.match(/const ACTIVE = \[([\s\S]*?)\n  \];/)||[])[1]||'';
const active=[...activeBlock.matchAll(/'([^']+\.js)'/g)].map(m=>m[1]);
ok(active.length>40,'could not parse active runtime modules');
for(const file of active) ok(fs.existsSync(path.join(root,file)),`active runtime file missing: ${file}`);
for(const file of ['scholark-v100-home-cinematics.js','scholark-v101-core-foundation.js','scholark-api-guard.mjs','scholark-gemini-primary.mjs']) ok(fs.existsSync(path.join(root,file)),`direct runtime file missing: ${file}`);

const syntaxTargets=[...new Set([
  'scholark-runtime-loader.js','scholark-v100-home-cinematics.js','scholark-v101-core-foundation.js','scholark-api-guard.mjs','scholark-gemini-primary.mjs',
  'server-key-shim.mjs','studio-ai-route.mjs','studio-media-route.mjs','studio-export-route.mjs','studio-reference-route.mjs','studio-research-route.mjs','studio-public-page-route.mjs','studio-public-artifact-route.mjs','scholark-learning-route.mjs','scholark-school-route.mjs',
  ...active
])];
for(const file of syntaxTargets){
  if(!fs.existsSync(path.join(root,file)))continue;
  const r=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});
  if(r.status!==0)fail.push(`syntax failed: ${file}: ${(r.stderr||r.stdout||'').trim().split('\n').slice(-2).join(' ')}`);
}

if(fail.length){
  console.error('\nSCHOLARK STATIC AUDIT FAILED');
  fail.forEach(x=>console.error(' - '+x));
  process.exit(1);
}
console.log(`SCHOLARK STATIC AUDIT PASS · ${RELEASE} · ${active.length} active runtime modules checked`);