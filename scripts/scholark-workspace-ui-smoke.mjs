import { chromium } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.addInitScript(()=>{
  window.__schLocaleWrites=[];
  const record=(kind,node,value)=>{
    try{
      const el=node?.nodeType===1?node:node?.parentElement;
      if(!el?.matches?.('.v51-level-group,#v50-level')&&!el?.closest?.('.v51-level-group,#v50-level'))return;
      window.__schLocaleWrites.push({kind,tag:el.tagName,id:el.id||'',cls:el.className||'',value:String(value??'').slice(0,160),stack:String(new Error().stack||'').split('\n').slice(2,8).join(' | ')});
      if(window.__schLocaleWrites.length>80)window.__schLocaleWrites.shift();
    }catch{}
  };
  for(const [proto,key] of [[Node.prototype,'textContent'],[Element.prototype,'innerHTML']]){
    const d=Object.getOwnPropertyDescriptor(proto,key);
    if(!d?.set||!d?.get)continue;
    Object.defineProperty(proto,key,{configurable:d.configurable,enumerable:d.enumerable,get:d.get,set:function(v){record(key,this,v);return d.set.call(this,v)}});
  }
  for(const [proto,key] of [[CharacterData.prototype,'data'],[Node.prototype,'nodeValue']]){
    const d=Object.getOwnPropertyDescriptor(proto,key);
    if(!d?.set||!d?.get)continue;
    Object.defineProperty(proto,key,{configurable:d.configurable,enumerable:d.enumerable,get:d.get,set:function(v){record(key,this,v);return d.set.call(this,v)}});
  }
});
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
  for(const key of [
    'scholark_v51_planner','scholark_v51_goals','scholark_v52_mastery',
    'scholark_v106_focus','scholark_v106_focus_history','scholark_v106_flashcards','scholark_v106_assignments'
  ]) localStorage.removeItem(key);
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

const localeExpect={
  nl:{basic:'Basisonderwijs',higher:'Hoger Onderwijs'},
  en:{basic:'Primary Education',higher:'Higher Education'},
  es:{basic:'Educación Primaria',higher:'Educación Superior'},
  fr:{basic:'Enseignement primaire',higher:'Enseignement supérieur'},
  de:{basic:'Primarbildung',higher:'Hochschulbildung'},
  pt:{basic:'Ensino primário',higher:'Ensino superior'},
  it:{basic:'Istruzione primaria',higher:'Istruzione superiore'}
};
for(const [code,expected] of Object.entries(localeExpect)){
  await page.selectOption('#v90-language',code);
  await page.waitForFunction(c=>localStorage.getItem('scholark_ui_language')===c&&document.documentElement.lang===c,code,{timeout:4000});
  await page.waitForTimeout(80);
  const localeState=await page.evaluate(()=>({stored:localStorage.getItem('scholark_ui_language'),html:document.documentElement.lang,country:window.__SCHOLARK_COUNTRY__?.current?.(),apiLang:window.__SCHOLARK_COUNTRY__?.language?.()}));
  const actual=await page.locator('.v51-levels.v51-levels-suriname [data-v51-group]').evaluateAll(nodes=>Object.fromEntries(nodes.map(n=>[n.getAttribute('data-v51-group'),n.querySelector('.v51-level-group')?.textContent?.trim()])));
  if(actual.basic!==expected.basic){
    const writes=await page.evaluate(()=>window.__schLocaleWrites?.slice(-14)||[]);
    failures.push(`Dashboard basic group language mismatch for ${code}: ${actual.basic} | state=${JSON.stringify(localeState)} | writes=${JSON.stringify(writes)}`);
  }
  check(actual.higher===expected.higher,`Dashboard higher group language mismatch for ${code}: ${actual.higher} | state=${JSON.stringify(localeState)}`);
}
await page.selectOption('#v90-language','nl');
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='nl'&&document.documentElement.lang==='nl',{timeout:4000});
await page.waitForTimeout(80);

const darkGroupBackground=await page.locator('[data-v51-group="higher"] .v51-level').first().evaluate(el=>getComputedStyle(el).backgroundImage);
check(/31, 43, 91|56, 82, 148|23, 35, 73/.test(darkGroupBackground),`Higher Education cards do not use the requested dark navy palette: ${darkGroupBackground}`);

await page.click('.v51-level[data-level="mulo"]');
check(await page.evaluate(()=>localStorage.getItem('scholark_education_track')==='mulo'),'MULO selection did not persist');
check(await page.locator('.v51-level[data-level="mulo"]').evaluate(el=>el.classList.contains('active')),'MULO did not become active');

await route('studio','#v41-studio-workspace:not([hidden])');
check(await page.locator('#v41-prompt').count()===1,'Studio prompt missing');
await page.fill('#v41-prompt','Workspace smoke presentation');
check((await page.inputValue('#v41-prompt'))==='Workspace smoke presentation','Studio prompt is not editable');

await route('tutor','#v51-fallback .v52-tool');
check(await page.locator('#v52-tutor-q').count()===1,'AI Tutor input missing');
await page.fill('#v52-tutor-q','Explain photosynthesis in one sentence.');
await page.click('#v52-tutor-send');
check((await page.locator('.v52-msg.user').count())===1,'AI Tutor did not accept a user question');
check((await page.locator('.v52-msg.ai').count())>=2,'AI Tutor did not prepare a response state');

await route('education','#v51-fallback .v52-tool');
await page.click('[data-edu="mastery"]');
check(await visible('#v52-m-add',3000),'Education Mastery Map did not open');
await page.fill('#v52-m-subject','Biology');
await page.fill('#v52-m-topic','Photosynthesis');
await page.click('#v52-m-add');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v52_mastery')||'[]').some(x=>x.topic==='Photosynthesis')}catch{return false}}),'Education Mastery topic did not persist');

await route('language','#v51-fallback .v93');
check(await page.locator('#v93-build').count()===1,'Language lesson builder missing');

await route('planner','#v51-fallback .v52-tool');
check(await page.locator('#v52-plan-add').count()===1,'Planner add action missing');
await page.fill('#v52-plan','Review biology notes');
await page.click('#v52-plan-add');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v51_planner')||'[]').some(x=>x.text==='Review biology notes')}catch{return false}}),'Planner item did not persist');

await route('focus','#v106-root');
check(await page.locator('#v106-focus-main').count()===1,'Focus start button missing');
await page.fill('#v106-focus-task','Biology focus smoke');
await page.click('#v106-focus-main');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v106_focus')||'{}').running===true}catch{return false}}),'Focus session did not start');
await page.click('#v106-focus-main');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v106_focus')||'{}').running===false}catch{return false}}),'Focus session did not pause');

await route('flashcards','#v106-root');
check(await page.locator('#v106-card-add').count()===1,'Flashcard add button missing');
await page.fill('#v106-card-front','Capital of Suriname?');
await page.fill('#v106-card-back','Paramaribo');
await page.click('#v106-card-add');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v106_flashcards')||'[]').some(x=>x.front==='Capital of Suriname?')}catch{return false}}),'Flashcard did not persist');
await page.click('#v106-study-start');
check(await visible('#v106-flip',3000),'Flashcard review did not start');
await page.click('#v106-flip');
await page.click('[data-rate="good"]');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v106_flashcards')||'[]').some(x=>x.front==='Capital of Suriname?'&&Number(x.reps)>=1)}catch{return false}}),'Flashcard review rating did not persist');

await route('assignments','#v106-root');
check(await page.locator('#v106-a-add').count()===1,'Assignment add button missing');
await page.fill('#v106-a-title','Workspace smoke assignment');
await page.fill('#v106-a-subject','Biology');
await page.click('#v106-a-add');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v106_assignments')||'[]').some(x=>x.title==='Workspace smoke assignment')}catch{return false}}),'Assignment did not persist');
await page.click('[data-a-plan]');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v51_planner')||'[]').some(x=>String(x.id||'').startsWith('assignment-'))}catch{return false}}),'Assignment did not create Planner steps');

await route('progress','#v51-fallback .v52-tool');
const progressText=(await page.locator('#v51-fallback .v52-tool').innerText()).toLowerCase();
check(progressText.includes('photosynthesis'),'Progress did not consume Mastery data');

await route('goal','#v51-fallback .v52-tool');
check(await page.locator('#v52-goal-add').count()===1,'Goal add button missing');
await page.fill('#v52-goal','Master biology');
await page.click('#v52-goal-add');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v51_goals')||'[]').some(x=>x.text==='Master biology')}catch{return false}}),'Goal did not persist');
await page.click('[data-goal-next]');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v51_planner')||'[]').some(x=>String(x.text||'').includes('Master biology'))}catch{return false}}),'Goal did not create a Planner next action');
await route('files','#v51-fallback .v86');
check(await page.locator('#v86-files').count()===1,'Files upload input missing');
await route('project','#v51-fallback .v64-projects');
await route('schools','#v50-school.open');
check(await page.locator('#v50-level').count()===1,'School level selector missing');
check(await page.locator('#v50-name').count()===1,'School-name search field missing');
await page.waitForTimeout(120);
check((await page.locator('#v50-name').getAttribute('placeholder'))==='Schoolnaam (optioneel)','School-name search placeholder did not localize to Dutch');
const polanenSearch=await page.evaluate(async()=>{
  const r=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country:'Suriname',city:'Paramaribo',name:'J.H.N. Polanen',level:'primary',radius:50})});
  return {status:r.status,data:await r.json().catch(()=>({}))};
});
check(polanenSearch.status===200&&polanenSearch.data?.ok===true,'J.H.N. Polanen API search failed');
const polanenRows=Array.isArray(polanenSearch.data?.schools)?polanenSearch.data.schools:[];
check(polanenRows.some(x=>/J\.H\.N\.?\s*Polanen/i.test(String(x.name||''))),'J.H.N. Polanenschool is still missing from primary-school search');
check(polanenRows.every(x=>Array.isArray(x.levels)&&x.levels.includes('primary')),'J.H.N. Polanen name search leaked non-primary results');
{
  const schoolAll=(await page.locator('#v50-level option[value="all"]').textContent()).trim();
  const schoolState=await page.evaluate(()=>({stored:localStorage.getItem('scholark_ui_language'),html:document.documentElement.lang,country:window.__SCHOLARK_COUNTRY__?.current?.(),apiLang:window.__SCHOLARK_COUNTRY__?.language?.()}));
  if(schoolAll!=='Alle niveaus'){
    const writes=await page.evaluate(()=>window.__schLocaleWrites?.slice(-18)||[]);
    failures.push(`Dutch school selector leaked another language: ${schoolAll} | state=${JSON.stringify(schoolState)} | writes=${JSON.stringify(writes)}`);
  }
}
await page.selectOption('#v90-language','es');
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='es'&&document.documentElement.lang==='es',{timeout:4000});
await page.waitForTimeout(100);
check((await page.locator('#v50-level option[value="all"]').textContent()).trim()==='Todos los niveles','Spanish school selector did not localize');
await page.selectOption('#v90-language','nl');
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='nl'&&document.documentElement.lang==='nl',{timeout:4000});
await page.waitForTimeout(100);
{
  const schoolAll=(await page.locator('#v50-level option[value="all"]').textContent()).trim();
  const schoolState=await page.evaluate(()=>({stored:localStorage.getItem('scholark_ui_language'),html:document.documentElement.lang,country:window.__SCHOLARK_COUNTRY__?.current?.(),apiLang:window.__SCHOLARK_COUNTRY__?.language?.()}));
  check(schoolAll==='Alle niveaus',`School selector kept stale Spanish after switching back to Dutch: ${schoolAll} | state=${JSON.stringify(schoolState)}`);
}
const schoolGroups=await page.locator('#v50-level optgroup').evaluateAll(nodes=>nodes.map(n=>n.label));
check(schoolGroups.includes('Basisonderwijs')&&schoolGroups.includes('Hoger Onderwijs'),'Dutch school optgroup labels are inconsistent after language round-trip');
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
