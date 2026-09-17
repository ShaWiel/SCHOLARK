import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const fail=[];
const ok=(cond,msg)=>{if(!cond)fail.push(msg)};
const RELEASE='r136';
const VERSION='20260910-r136';
const ROUTER='20260917-gemini-resilience-v3';
const SCHOOL_STRICT='20260917-school-country-levels-v3';

const runtime=read('scholark-runtime-loader.js');
const docker=read('Dockerfile');
const foundation=read('scholark-v101-core-foundation.js');
const prepaint=read('scholark-prepaint-head.html');
const gemini=read('scholark-gemini-primary.mjs');
const schoolResilience=read('scholark-school-resilience.mjs');
const schoolStrict=read('scholark-school-strict.mjs');
const schoolClient=read('scholark-v104-school-filter-guard.js');
const quiz=read('scholark-v102-language-quiz.js');
const nextLesson=read('scholark-v103-language-next-lesson.js');

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
ok(docker.includes('scholark-school-resilience.mjs'),'School resilience layer is not shipped');
ok(docker.includes('--import", "./scholark-school-resilience.mjs"'),'School resilience layer is not imported at runtime');
ok(docker.indexOf('./scholark-school-resilience.mjs')<docker.indexOf('./scholark-school-route.mjs'),'School resilience must load before school discovery route');
ok(schoolResilience.includes('photon.komoot.io')&&schoolResilience.includes('nominatim.openstreetmap.org'),'School geocoder fallback providers are incomplete');
ok(schoolResilience.includes("'/api/schools/resilience'")&&schoolResilience.includes('STATIC_PLACES'),'School geocoder health/static fallback is missing');
ok(docker.includes('scholark-school-strict.mjs'),'Strict country school route is not shipped');
ok(docker.includes('--import", "./scholark-school-strict.mjs"'),'Strict country school route is not imported');
ok(docker.indexOf('./scholark-school-route.mjs')<docker.indexOf('./scholark-school-strict.mjs'),'Strict school route must load after base school route');
ok(schoolStrict.includes(`VERSION='${SCHOOL_STRICT}'`),'Strict school route version is not current');
ok(schoolStrict.includes('ISO3166-1')&&schoolStrict.includes('(area.country)'),'Strict school route lacks country-boundary filtering');
ok(schoolStrict.includes('Lijst-met-Scholen-Suriname-1.xlsx')&&schoolStrict.includes('officialSurinameSchools'),'Strict school route lacks official Suriname roster enrichment');
ok(schoolStrict.includes("out.add('lower_secondary')")&&schoolStrict.includes("out.add('upper_secondary')")&&schoolStrict.includes("out.add('vocational')"),'Strict school education taxonomy is incomplete');
ok(schoolStrict.includes("wanted==='secondary'||wanted==='lower_secondary'")&&schoolStrict.includes("wanted==='upper_secondary'"),'Strict lower/upper secondary matching is missing');
ok(docker.includes('scholark-v104-school-filter-guard.js'),'School client filter guard is not copied');
ok(docker.includes('scholark-v104-school-filter-guard.js?v=20260917-school-filter-v1'),'School client filter guard is not injected');
ok(schoolClient.includes('/rest/v1/rpc/search_schools')&&schoolClient.includes('rowMatches'),'Curated school RPC country/place guard is missing');
ok(schoolClient.includes('option[value="upper_secondary"]')&&schoolClient.includes('Vocational / technical education'),'Improved school level selector is missing');
ok(docker.includes('ENV SCHOLARK_AI_PROVIDER=gemini'),'Gemini is not configured as the primary AI provider');
ok(docker.includes('ENV GEMINI_PRIMARY_MODEL=gemini-3.8-flash'),'Gemini 3.8 Flash is not the primary model');
ok(gemini.includes("'/api/studio/generate'")&&gemini.includes("'/api/learning/generate'"),'Gemini adapter does not scope Studio + Learning generation routes');
ok(gemini.includes("prop === 'SCHOLARK_TEST_MODE'")&&gemini.includes("return '0'"),'Gemini adapter does not safely bypass test mode for scoped AI routes');
ok(gemini.includes('GEMINI_FALLBACK_MODELS'),'Gemini fallback models are not configurable');
ok(gemini.includes('gemini-3.7-flash')&&gemini.includes('gemini-3.6-flash')&&gemini.includes('gemini-3.5-flash-lite'),'Gemini fallback chain is incomplete');
ok(gemini.includes('retryableStatuses')&&gemini.includes('503'),'Gemini overload retry protection is missing');
ok(gemini.includes(`ROUTER_VERSION = '${ROUTER}'`),'Gemini resilience router version is not current');
ok(gemini.includes('cooldownUntil')&&gemini.includes('markFailure')&&gemini.includes('markSuccess'),'Gemini circuit breaker is missing');
ok(gemini.includes('emergencyPollinations')&&gemini.includes('syntheticGeminiResponse'),'Emergency provider fallback is missing');
ok(prepaint.includes("p==='/index.html'")||prepaint.includes("p === '/index.html'"),'prepaint lacks static-page/app-path guard');
ok(/language\|planner/.test(prepaint)&&/project\|files\|schools/.test(prepaint),'prepaint workspace route list is incomplete');
ok(runtime.includes("path !== '/' && path !== '/index.html'"),'runtime lacks non-app path guard');
ok(foundation.includes("p === '/' || p === '/index.html'"),'foundation lacks non-app path guard');
ok(quiz.includes("querySelectorAll('.v93-choice')")&&quiz.includes('onChoiceClick')&&quiz.includes("feedback.textContent = '✓ Correct'")&&quiz.includes('HTMLButtonElement'),'Language Learner choices are not interactive');
ok(nextLesson.includes('startNext')&&nextLesson.includes('buildLesson'),'Language Learner next-lesson flow is incomplete');
ok(docker.includes('scholark-v102-language-quiz.js'),'Language quiz fix is not shipped');
ok(docker.includes('scholark-v103-language-next-lesson.js'),'Language next-lesson fix is not shipped');

const activeBlock=(runtime.match(/const ACTIVE = \[([\s\S]*?)\n  \];/)||[])[1]||'';
const active=[...activeBlock.matchAll(/'([^']+\.js)'/g)].map(m=>m[1]);
ok(active.length>40,'could not parse active runtime modules');
for(const file of active) ok(fs.existsSync(path.join(root,file)),`active runtime file missing: ${file}`);
for(const file of ['scholark-v100-home-cinematics.js','scholark-v101-core-foundation.js','scholark-v102-language-quiz.js','scholark-v103-language-next-lesson.js','scholark-v104-school-filter-guard.js','scholark-api-guard.mjs','scholark-gemini-primary.mjs','scholark-school-resilience.mjs','scholark-school-strict.mjs']) ok(fs.existsSync(path.join(root,file)),`direct runtime file missing: ${file}`);

const syntaxTargets=[...new Set([
  'scholark-runtime-loader.js','scholark-v100-home-cinematics.js','scholark-v101-core-foundation.js','scholark-v102-language-quiz.js','scholark-v103-language-next-lesson.js','scholark-v104-school-filter-guard.js','scholark-api-guard.mjs','scholark-gemini-primary.mjs','scholark-school-resilience.mjs','scholark-school-strict.mjs',
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
console.log(`SCHOLARK STATIC AUDIT PASS · ${RELEASE} · router ${ROUTER} · school ${SCHOOL_STRICT} · ${active.length} active runtime modules checked`);