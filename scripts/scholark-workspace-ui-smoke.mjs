import { chromium } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const failures=[];
const timings=[];
const pageErrors=[];

page.on('pageerror',err=>pageErrors.push(String(err?.stack||err?.message||err)));
page.on('console',msg=>{
  if(msg.type()==='error' && /\[SCHOLARK\]|Uncaught|TypeError|ReferenceError/i.test(msg.text())) pageErrors.push(msg.text());
});

function check(cond,msg){if(!cond)failures.push(msg)}
async function visible(sel,timeout=7000){
  try{await page.waitForSelector(sel,{state:'visible',timeout});return true}catch{return false}
}
async function route(id,selector){
  const button=`#v51-sidebar [data-v51-tool="${id}"]`;
  check(await visible(button,5000),`Sidebar button missing: ${id}`);
  const started=Date.now();
  try{await page.click(button)}catch(e){failures.push(`Could not click ${id}: ${e.message}`);return}
  try{await page.waitForFunction(expected=>location.hash==='#'+expected,id,{timeout:5000})}catch{failures.push(`Route did not become #${id}`)}
  check(await visible(selector,7000),`${id} did not mount ${selector}`);
  const ms=Date.now()-started;timings.push([id,ms]);
  check(ms<5000,`${id} route took ${ms}ms (>5000ms)`);
  const active=await page.locator(button).evaluate(el=>el.classList.contains('active')).catch(()=>false);
  check(active,`Sidebar active state missing for ${id}`);
}

const bootStarted=Date.now();
await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:30000});
await page.evaluate(()=>{
  localStorage.setItem('scholark_country','Suriname');
  localStorage.setItem('scholark_ui_language','nl');
  localStorage.setItem('scholark_learning_level','secondary');
  localStorage.removeItem('scholark_education_track');
});
await page.reload({waitUntil:'domcontentloaded',timeout:30000});
check(await visible('#v51-main [data-v51-page="dashboard"].active',10000),'Dashboard did not become active');
check(await visible('.v51-levels.v51-levels-suriname',10000),'Suriname level strip did not mount');
const bootMs=Date.now()-bootStarted;timings.push(['dashboard-boot',bootMs]);check(bootMs<9000,`Dashboard boot took ${bootMs}ms (>9000ms)`);

const groups=await page.locator('.v51-levels.v51-levels-suriname [data-v51-group]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-v51-group')));
check(JSON.stringify(groups)===JSON.stringify(['basic','voj','vos','higher']),`Unexpected Suriname groups: ${groups.join(',')}`);
const levels=await page.locator('.v51-levels.v51-levels-suriname [data-level]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-level')));
for(const id of ['kindergarten','primary','mulo','lbo','havo','vwo','mbo','hbo','wo']) check(levels.includes(id),`Missing Suriname level: ${id}`);
const levelText=(await page.locator('.v51-levels.v51-levels-suriname').innerText()).toLowerCase();
for(const legacy of ['jonge leerling','middelbare school','volwassene']) check(!levelText.includes(legacy),`Legacy generic level leaked back: ${legacy}`);
check(await page.locator('[data-v51-group="voj"]').evaluate(el=>getComputedStyle(el).backgroundColor==='rgba(0, 0, 0, 0)'||getComputedStyle(el).backgroundColor==='transparent').catch(()=>false),'VOJ cluster wrapper is not transparent');
check(await page.locator('[data-v51-group="higher"]').evaluate(el=>getComputedStyle(el).backgroundColor==='rgba(0, 0, 0, 0)'||getComputedStyle(el).backgroundColor==='transparent').catch(()=>false),'Higher Education cluster wrapper is not transparent');

await page.click('.v51-level[data-level="mulo"]');
check(await page.evaluate(()=>localStorage.getItem('scholark_education_track')==='mulo'),'MULO selection did not persist');
check(await page.locator('.v51-level[data-level="mulo"]').evaluate(el=>el.classList.contains('active')),'MULO did not become active');

await route('studio','#v41-studio-workspace:not([hidden])');
check(await page.locator('#v41-prompt').count()===1,'Studio prompt missing');
await route('tutor','#v51-fallback .v52-tool');
check(await page.locator('#v52-tutor-q').count()===1,'AI Tutor input missing');
await route('education','#v51-fallback .v52-tool');
await route('language','#v51-fallback .v93');
check(await page.locator('#v93-build').count()===1,'Language lesson builder missing');
await route('planner','#v51-fallback .v52-tool');
check(await page.locator('#v52-plan-add').count()===1,'Planner add action missing');
await route('focus','#v106-root');
check(await page.locator('#v106-focus-main').count()===1,'Focus start button missing');
await route('flashcards','#v106-root');
check(await page.locator('#v106-card-add').count()===1,'Flashcard add button missing');
await route('assignments','#v106-root');
check(await page.locator('#v106-a-add').count()===1,'Assignment add button missing');
await route('progress','#v51-fallback .v52-tool');
await route('goal','#v51-fallback .v52-tool');
check(await page.locator('#v52-goal-add').count()===1,'Goal add button missing');
await route('files','#v51-fallback .v86');
check(await page.locator('#v86-files').count()===1,'Files upload input missing');
await route('project','#v51-fallback .v64-projects');
await route('schools','#v50-school.open');
check(await page.locator('#v50-level').count()===1,'School level selector missing');
await route('study','#v51-fallback .v62-study');
check(await page.locator('#v62-study-run').count()===1,'Study Ahead action missing');
await route('book','#v51-fallback .v65-book');
check(await page.locator('#v65-plan').count()===1,'Book Studio plan button missing');
await route('dashboard','#v51-main [data-v51-page="dashboard"].active');
check(await visible('.v51-levels.v51-levels-suriname',5000),'Suriname groups disappeared after workspace route round-trip');

const runtimeErrors=await page.evaluate(()=>window.__SCHOLARK_RUNTIME__?.errors?.()||[]);
check(runtimeErrors.length===0,'Runtime loader errors: '+runtimeErrors.join(', '));
const duplicateIds=await page.evaluate(()=>{
  const seen=new Set(),dups=[];document.querySelectorAll('[id]').forEach(el=>{if(seen.has(el.id)&&!dups.includes(el.id))dups.push(el.id);seen.add(el.id)});return dups.filter(x=>!/^v25-|^sv24-/.test(x));
});
check(duplicateIds.length===0,'Duplicate DOM ids: '+duplicateIds.join(', '));
if(pageErrors.length) failures.push('Browser errors: '+[...new Set(pageErrors)].slice(0,8).join(' | '));

console.log('\nSCHOLARK WORKSPACE UI SMOKE');
for(const [name,ms] of timings) console.log(` ✓ ${name}: ${ms}ms`);
if(failures.length){
  console.error('\nSCHOLARK WORKSPACE UI SMOKE FAILED');
  failures.forEach(x=>console.error(' - '+x));
  await browser.close();
  process.exit(1);
}
console.log(`\nSCHOLARK WORKSPACE UI SMOKE PASS · ${timings.length} timed flows`);
await browser.close();
