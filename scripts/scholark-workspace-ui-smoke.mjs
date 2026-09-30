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

// Homepage topbar must keep the exact visual structure without first-paint flicker or competing headers.
await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:30000});
await page.evaluate(()=>localStorage.setItem('scholark_ui_language','nl'));
await page.reload({waitUntil:'domcontentloaded',timeout:30000});
const topbarStarted=Date.now();
check(await visible('#v55-topbar',5000),'Homepage topbar did not become visible');
const topbarReadyMs=Date.now()-topbarStarted;
check(topbarReadyMs<1800,`Homepage topbar took ${topbarReadyMs}ms to become visible`);
await page.waitForTimeout(220);
const topbarSamples=[];
for(let i=0;i<18;i++){
  topbarSamples.push(await page.evaluate(()=>{
    const bar=document.querySelector('#v55-topbar'),r=bar?.getBoundingClientRect(),cs=bar?getComputedStyle(bar):null;
    return {count:document.querySelectorAll('#v55-topbar').length,langCount:document.querySelectorAll('#v55-language').length,visible:!!bar&&cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0,top:r?.top??999,height:r?.height??0,width:r?.width??0};
  }));
  await page.waitForTimeout(55);
}
check(topbarSamples.every(x=>x.count===1&&x.langCount===1),'Homepage topbar/language selector duplicated during boot');
check(topbarSamples.every(x=>x.visible),'Homepage topbar disappeared during boot stabilization');
check(topbarSamples.every(x=>Math.abs(x.top)<1.5),'Homepage topbar moved away from the viewport top');
const topbarHeights=topbarSamples.map(x=>x.height).filter(Boolean),heightSpread=Math.max(...topbarHeights)-Math.min(...topbarHeights);
check(heightSpread<2.5,`Homepage topbar height jumped during boot: ${heightSpread.toFixed(1)}px`);
const competingHeaders=await page.evaluate(()=>{
  const bar=document.querySelector('#v55-topbar');
  return [...document.querySelectorAll('header,nav,[class*="header"],[class*="topbar"],[class*="nav"]')].filter(el=>{
    if(el===bar||el.closest('#v55-topbar,#v29-home-layer,#v51-sidebar,#v51-main'))return false;
    const r=el.getBoundingClientRect(),cs=getComputedStyle(el),t=(el.textContent||'').replace(/\s+/g,' ').trim();
    return r.width>Math.min(480,innerWidth*.65)&&r.height>=38&&r.height<170&&r.top<125&&cs.display!=='none'&&cs.visibility!=='hidden'&&(/scholark/i.test(t)||/account|sign in|login|inloggen|aanmelden/i.test(t));
  }).length;
});
check(competingHeaders===0,`Legacy/competing homepage header is visible alongside the SCHOLARK topbar: ${competingHeaders}`);
const languageCatalog=await page.evaluate(()=>({options:[...document.querySelectorAll('#v55-language option')].map(o=>o.value),report:window.__SCHOLARK_I18N__?.selftest?.()}));
check(languageCatalog.options.length===74,`Homepage language selector should expose 74 languages, got ${languageCatalog.options.length}`);
for(const code of ['ar','zh','hi','bn','ru','ja','ko','tr','pl','uk','ro','el','cs','sv','da','no','fi','hu','id','ms','vi','th','tl','sw','he','ur','fa','ta','te','pa'])check(languageCatalog.options.includes(code),`Missing added interface language: ${code}`);
check(languageCatalog.report?.ok===true&&languageCatalog.report?.count===74&&languageCatalog.report?.dynamicCount===67,'74-language i18n self-test failed');
await page.evaluate(()=>{window.__SCHOLARK_I18N__?.changeLanguage?.('ar')});
await page.waitForFunction(()=>document.querySelector('#v90-language-overlay')?.classList.contains('open')===true,{timeout:1000});
check(await page.evaluate(()=>document.documentElement.classList.contains('scholark-home-language-adapting')),'Homepage did not enter atomic language-adaptation mode');
check(await page.evaluate(()=>getComputedStyle(document.querySelector('#v29-home-layer')).visibility==='hidden'),'Homepage content remained visible while adaptive translation was mutating copy');
check((await page.locator('#v90-switch-copy').innerText()).includes('العربية'),'Adaptive Arabic switch did not show the Adapting SCHOLARK transition');
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='ar'&&document.documentElement.lang==='ar'&&document.documentElement.dir==='rtl',{timeout:4000});
await page.waitForFunction(()=>!document.documentElement.classList.contains('scholark-home-language-adapting')&&!document.querySelector('#v90-language-overlay')?.classList.contains('open'),{timeout:5000});
check(await page.evaluate(()=>getComputedStyle(document.querySelector('#v29-home-layer')).visibility!=='hidden'),'Homepage did not reveal after adaptive translation completed');
check((await page.locator('#v55-language').inputValue())==='ar','Arabic did not become the active homepage interface language');
await page.reload({waitUntil:'domcontentloaded',timeout:30000});
await page.waitForFunction(()=>!document.documentElement.classList.contains('scholark-prepaint'),{timeout:8000});
check(await page.evaluate(()=>document.documentElement.dataset.scholarkI18nReady==='ar'),'Adaptive language reload was revealed before Arabic locale preparation finished');
check(await page.evaluate(()=>getComputedStyle(document.querySelector('#v29-home-layer')).visibility!=='hidden'),'Adaptive-language homepage stayed hidden after reload preparation');
check(await page.locator('#v55-topbar').count()===1,'Adaptive-language reload duplicated the homepage topbar');
await page.evaluate(()=>{window.__SCHOLARK_I18N__?.changeLanguage?.('nl')});
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='nl'&&document.documentElement.lang==='nl'&&document.documentElement.dir==='ltr',{timeout:4000});
await page.waitForTimeout(180);
check((await page.locator('#v55-auth').innerText()).trim()==='Inloggen','Homepage auth action did not boot directly in Dutch');
await page.click('#v55-auth');
check(await visible('#v72-modal.open',3000),'Homepage sign-in action did not open SCHOLARK Cloud auth');
check(await page.locator('#v72-modal [data-tab="signin"]').count()===1,'Sign-in tab missing from SCHOLARK Cloud auth');
check(await page.locator('#v72-modal [data-tab="signup"]').count()===1,'Create-account tab missing from SCHOLARK Cloud auth');
check(await page.locator('#v72-modal input[type="email"]').count()===1,'Auth email field missing');
check(await page.locator('#v72-modal input[type="password"]').count()===1,'Auth password field missing');
await page.click('#v72-modal [data-tab="signup"]');
check(await page.locator('#v72-modal [data-tab="signup"]').evaluate(el=>el.classList.contains('active')),'Create-account tab did not activate');
check((await page.locator('#v72-modal input[type="password"]').getAttribute('autocomplete'))==='new-password','Create-account password field is not configured as a new password');
await page.click('#v72-modal .v72-x');
check(await page.locator('#v72-modal').evaluate(el=>!el.classList.contains('open')),'Auth modal did not close cleanly');

await page.evaluate(()=>{location.hash='pricing'});
await page.waitForFunction(()=>location.hash==='#pricing',{timeout:3000});
const plusCheckout='#v41-home-pricing .v41-plan.plus [data-plan="plus"]';
check(await visible(plusCheckout,5000),'Plus checkout action is not visible on Pricing');
await page.click(plusCheckout);
check(await visible('#v72-modal.open',3000),'Unauthenticated Plus checkout did not route to account authentication');
check(await page.evaluate(()=>sessionStorage.getItem('scholark_pending_plan')==='plus'),'Pending Plus plan was not preserved across authentication');
await page.click('#v72-modal .v72-x');
await page.evaluate(()=>{sessionStorage.removeItem('scholark_pending_plan');location.hash='home'});
await page.waitForFunction(()=>location.hash==='#home',{timeout:3000});
check(await visible('#v55-topbar',5000),'Homepage topbar did not recover after auth/checkout round-trip');
await page.selectOption('#v55-language','es');
await page.waitForFunction(()=>document.querySelector('#v90-language-overlay')?.classList.contains('open')===true,{timeout:1000});
check((await page.locator('#v90-switch-copy').innerText()).includes('Spanish'),'Static Spanish switch did not show the Adapting SCHOLARK transition');
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='es',{timeout:4000});
await page.waitForFunction(()=>!document.querySelector('#v90-language-overlay')?.classList.contains('open'),{timeout:4000});
check((await page.locator('#v55-account').innerText()).includes('Cuenta'),'Homepage Account label did not update cleanly to Spanish');
await page.selectOption('#v55-language','nl');
await page.waitForFunction(()=>document.querySelector('#v90-language-overlay')?.classList.contains('open')===true,{timeout:1000});
check((await page.locator('#v90-switch-copy').innerText()).includes('Dutch'),'Dutch switch did not show the Adapting SCHOLARK transition');
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='nl',{timeout:4000});
await page.waitForFunction(()=>!document.querySelector('#v90-language-overlay')?.classList.contains('open'),{timeout:4000});
check((await page.locator('#v55-auth').innerText()).trim()==='Inloggen','Homepage auth action did not return cleanly to Dutch');
const idleTopbarMutations=await page.evaluate(async()=>{
  const bar=document.querySelector('#v55-topbar');if(!bar)return 999;
  let count=0;const o=new MutationObserver(m=>count+=m.length);o.observe(bar,{subtree:true,childList:true,characterData:true,attributes:true});
  await new Promise(r=>setTimeout(r,700));o.disconnect();return count;
});
check(idleTopbarMutations<=1,`Homepage topbar kept mutating while idle: ${idleTopbarMutations} mutations`);
check(await visible('.v116-public-actions',5000),'Public privacy/feedback controls did not mount');
await page.waitForTimeout(120);
check(await page.locator('#v41-home-pricing .v115-env').count()>=2,'Sandbox checkout disclosure badges did not mount on paid plans');
check((await page.locator('#v41-home-pricing .v115-env').first().innerText()).includes('NO REAL CHARGE'),'Sandbox checkout disclosure is unclear');
await page.click('[data-v116-public-privacy]');
check(await visible('#v116-dialog.open',3000),'Privacy & terms dialog did not open');
check((await page.locator('#v116-dialog').getAttribute('role'))==='dialog'&&(await page.locator('#v116-dialog').getAttribute('aria-modal'))==='true','Privacy dialog accessibility semantics missing');
const privacyText=(await page.locator('#v116-dialog').innerText()).toLowerCase();
check(privacyText.includes('your data stays under your control')&&privacyText.includes('product terms')&&privacyText.includes('paddle'),'Privacy/product/billing notice is incomplete');
await page.keyboard.press('Escape');
check(await page.locator('#v116-dialog.open').count()===0,'Privacy dialog did not close with Escape');
await page.click('[data-v116-public-feedback]');
check(await visible('#v116-dialog.open .v116-feedback',3000),'Feedback dialog did not open');
await page.keyboard.press('Escape');
timings.push(['home-topbar-boot',topbarReadyMs]);

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
check(await page.locator('#v90-language option').count()===74,`Workspace language selector should expose 74 languages`);
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

// Atomic workspace-language switch: the visible workspace must be hidden until
// the new language has been fully applied and the layout has settled.
const atomicLanguageStart=await page.evaluate(()=>{
  window.__SCHOLARK_I18N__?.changeLanguage?.('es');
  const main=document.querySelector('#v51-main');
  return {
    switching:document.documentElement.classList.contains('scholark-language-switching'),
    visibility:main?getComputedStyle(main).visibility:'',
    overlay:document.querySelector('#v90-language-overlay')?.classList.contains('open')===true
  };
});
check(atomicLanguageStart.switching===true,'Workspace language switch did not enter atomic mode');
check(atomicLanguageStart.visibility==='hidden','Workspace stayed visible during atomic language replacement');
check(atomicLanguageStart.overlay===true,'Workspace language switch did not show transition overlay');
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='es'&&document.documentElement.dataset.scholarkI18nReady==='es'&&!document.documentElement.classList.contains('scholark-language-switching')&&!document.querySelector('#v90-language-overlay')?.classList.contains('open'),{timeout:6000});

// Stress stale-translation cancellation by switching faster than a normal user.
await page.evaluate(()=>{
  const api=window.__SCHOLARK_I18N__;
  const seq=['fr','de','pt','it','en','nl','fr','es'];
  seq.forEach((lc,i)=>setTimeout(()=>api?.changeLanguage?.(lc),i*14));
});
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='es'&&document.documentElement.lang==='es'&&document.documentElement.dataset.scholarkI18nReady==='es'&&!document.documentElement.classList.contains('scholark-language-switching')&&!document.querySelector('#v90-language-overlay')?.classList.contains('open'),{timeout:8000});
await page.waitForTimeout(140);
const languageLayout=await page.evaluate(()=>{
  const dash=document.querySelector('#v51-main [data-v51-page="dashboard"].active');
  const head=dash?.querySelector('.v51-head'),h1=head?.querySelector('h1'),grid=dash?.querySelector('.v51-grid'),main=document.querySelector('#v51-main');
  const visibleHuge=dash?[...dash.querySelectorAll('*')].filter(el=>{
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'&&parseFloat(cs.fontSize||'0')>72;
  }).map(el=>({tag:el.tagName,text:String(el.textContent||'').trim().slice(0,80),font:getComputedStyle(el).fontSize})):[];
  const hr=h1?.getBoundingClientRect(),gr=grid?.getBoundingClientRect();
  return {
    title:String(h1?.textContent||'').replace(/\s+/g,' ').trim(),
    h1Count:dash?.querySelectorAll('.v51-head h1').length||0,
    titleBottom:hr?.bottom||0,
    gridTop:gr?.top||0,
    visibleHuge,
    mainVisibility:main?getComputedStyle(main).visibility:'',
    switching:document.documentElement.classList.contains('scholark-language-switching'),
    ready:document.documentElement.dataset.scholarkI18nReady||'',
    overlay:document.querySelector('#v90-language-overlay')?.classList.contains('open')===true
  };
});
check(languageLayout.title==='Tu espacio de aprendizaje y creación.',`Rapid language switching left wrong dashboard title: ${languageLayout.title}`);
check(languageLayout.h1Count===1,`Dashboard headline duplicated after language stress: ${languageLayout.h1Count}`);
check(languageLayout.visibleHuge.length===0,`Oversized workspace text appeared after language stress: ${JSON.stringify(languageLayout.visibleHuge)}`);
check(languageLayout.titleBottom<=languageLayout.gridTop,`Translated dashboard headline overlaps tool grid: ${JSON.stringify(languageLayout)}`);
check(languageLayout.mainVisibility!=='hidden'&&!languageLayout.switching&&!languageLayout.overlay&&languageLayout.ready==='es',`Workspace did not settle after language stress: ${JSON.stringify(languageLayout)}`);

// Reproduce the reported glitch: leave Workspace and return before old Home timers fire.
// Different delays exercise the old 80ms/220ms/320ms repair windows.
for(const delay of [8,24,72,140]){
  await page.evaluate(d=>{
    window.__SCHOLARK_WORKSPACE__?.goHome?.();
    setTimeout(()=>{location.hash='dashboard'},d);
  },delay);
  try{
    await page.waitForFunction(()=>location.hash==='#dashboard'&&document.body.classList.contains('v51-workspace')&&!document.documentElement.classList.contains('scholark-workspace-entering'),null,{timeout:5000});
  }catch(e){
    const diag=await page.evaluate(()=>({hash:location.hash,entry:window.__SCHOLARK_WORKSPACE__?.entryState?.(),html:[...document.documentElement.classList],body:[...document.body.classList]}));
    throw new Error('Rapid workspace re-entry did not settle: '+JSON.stringify(diag));
  }
  await page.waitForTimeout(380);
}
const reentryState=await page.evaluate(()=>{
  const dash=document.querySelector('#v51-main [data-v51-page="dashboard"].active');
  const h1=dash?.querySelector('.v51-head h1'),grid=dash?.querySelector('.v51-grid');
  const hr=h1?.getBoundingClientRect(),gr=grid?.getBoundingClientRect();
  const topbar=document.querySelector('#v55-topbar'),home=document.querySelector('#v29-home-layer');
  const huge=dash?[...dash.querySelectorAll('*')].filter(el=>{
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'&&parseFloat(cs.fontSize||'0')>72;
  }).map(el=>({tag:el.tagName,text:String(el.textContent||'').trim().slice(0,90),font:getComputedStyle(el).fontSize})):[];
  return {
    route:location.hash,
    title:String(h1?.textContent||'').replace(/\s+/g,' ').trim(),
    mainCount:document.querySelectorAll('#v51-main').length,
    sidebarCount:document.querySelectorAll('#v51-sidebar').length,
    h1Count:dash?.querySelectorAll('.v51-head h1').length||0,
    homeCount:document.querySelectorAll('#v29-home-layer').length,
    topbarDisplay:topbar?getComputedStyle(topbar).display:'',
    homeDisplay:home?getComputedStyle(home).display:'',
    bodyPublic:document.body.classList.contains('v55-public-home'),
    htmlPublic:document.documentElement.classList.contains('v55-public-home'),
    entering:document.documentElement.classList.contains('scholark-workspace-entering'),
    workspace:document.body.classList.contains('v51-workspace'),
    workspaceRoot:document.documentElement.classList.contains('v51-workspace-root'),
    huge,
    titleBottom:hr?.bottom||0,
    gridTop:gr?.top||0
  };
});
check(reentryState.route==='#dashboard'&&reentryState.workspace&&reentryState.workspaceRoot,`Rapid Workspace re-entry lost route ownership: ${JSON.stringify(reentryState)}`);
check(!reentryState.entering&&!reentryState.bodyPublic&&!reentryState.htmlPublic,`Home state leaked into Workspace after rapid re-entry: ${JSON.stringify(reentryState)}`);
check(reentryState.topbarDisplay==='none'&&reentryState.homeDisplay==='none',`Home UI remained visible over Workspace after rapid re-entry: ${JSON.stringify(reentryState)}`);
check(reentryState.mainCount===1&&reentryState.sidebarCount===1&&reentryState.homeCount===1&&reentryState.h1Count===1,`Workspace/home surfaces duplicated after rapid re-entry: ${JSON.stringify(reentryState)}`);
check(reentryState.title==='Tu espacio de aprendizaje y creación.',`Workspace title corrupted after Home round-trip: ${reentryState.title}`);
check(reentryState.huge.length===0&&reentryState.titleBottom<=reentryState.gridTop,`Workspace layout glitched after Home round-trip: ${JSON.stringify(reentryState)}`);

// Also exercise the actual Home CTA route once, not only direct hash return.
await page.click('#v51-home');
await page.waitForFunction(()=>location.hash==='#home'&&getComputedStyle(document.querySelector('#v55-topbar')).display!=='none',null,{timeout:5000});
await page.waitForSelector('#v55-workspace-cta .v55-entry',{state:'visible',timeout:5000});
await page.click('#v55-workspace-cta .v55-entry');
try{
  await page.waitForFunction(()=>location.hash==='#dashboard'&&document.body.classList.contains('v51-workspace')&&!document.documentElement.classList.contains('scholark-workspace-entering')&&getComputedStyle(document.querySelector('#v55-topbar')).display==='none',null,{timeout:6000});
}catch(e){
  const diag=await page.evaluate(()=>({hash:location.hash,entry:window.__SCHOLARK_WORKSPACE__?.entryState?.(),topbar:document.querySelector('#v55-topbar')?getComputedStyle(document.querySelector('#v55-topbar')).display:'missing',html:[...document.documentElement.classList],body:[...document.body.classList]}));
  throw new Error('Home CTA workspace re-entry did not settle: '+JSON.stringify(diag));
}
await page.waitForTimeout(360);
const ctaReentry=await page.evaluate(()=>{
  const dash=document.querySelector('#v51-main [data-v51-page="dashboard"].active'),h1=dash?.querySelector('.v51-head h1'),grid=dash?.querySelector('.v51-grid');
  const hr=h1?.getBoundingClientRect(),gr=grid?.getBoundingClientRect();
  return {
    title:String(h1?.textContent||'').replace(/\s+/g,' ').trim(),
    h1Count:dash?.querySelectorAll('.v51-head h1').length||0,
    topbar:getComputedStyle(document.querySelector('#v55-topbar')).display,
    home:getComputedStyle(document.querySelector('#v29-home-layer')).display,
    bodyPublic:document.body.classList.contains('v55-public-home'),
    htmlPublic:document.documentElement.classList.contains('v55-public-home'),
    titleBottom:hr?.bottom||0,gridTop:gr?.top||0
  };
});
check(ctaReentry.title==='Tu espacio de aprendizaje y creación.'&&ctaReentry.h1Count===1&&ctaReentry.topbar==='none'&&ctaReentry.home==='none'&&!ctaReentry.bodyPublic&&!ctaReentry.htmlPublic&&ctaReentry.titleBottom<=ctaReentry.gridTop,`Home CTA re-entry is not clean: ${JSON.stringify(ctaReentry)}`);

await page.selectOption('#v90-language','nl');
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='nl'&&document.documentElement.lang==='nl'&&document.documentElement.dataset.scholarkI18nReady==='nl'&&!document.documentElement.classList.contains('scholark-language-switching')&&!document.querySelector('#v90-language-overlay')?.classList.contains('open'),{timeout:6000});
await page.waitForTimeout(80);

await page.evaluate(()=>window.__SCHOLARK_COUNTRY__?.set?.('Suriname','ci-palette'));
await page.waitForFunction(()=>window.__SCHOLARK_COUNTRY__?.current?.()==='Suriname'&&!!document.querySelector('.v51-levels.v51-levels-suriname [data-v51-group="higher"] .v51-level'),null,{timeout:5000});
try{await page.waitForFunction(()=>{const el=document.querySelector('.v51-levels.v51-levels-suriname [data-v51-group="higher"] .v51-level');if(!el||!el.isConnected||!el.getClientRects().length)return false;const bg=getComputedStyle(el).backgroundImage;return /31, 43, 91|56, 82, 148|23, 35, 73/.test(bg)},null,{timeout:5000})}catch{}
const darkGroupDiag=await page.locator('.v51-levels.v51-levels-suriname [data-v51-group="higher"] .v51-level').first().evaluate(el=>({background:getComputedStyle(el).backgroundImage,inline:el.getAttribute('style')||'',visible:!!el.getClientRects().length,country:window.__SCHOLARK_COUNTRY__?.current?.()}));
check(/31, 43, 91|56, 82, 148|23, 35, 73/.test(darkGroupDiag.background)||/#1f2b5b|#385294|#172349/i.test(darkGroupDiag.inline),`Higher Education cards do not use the requested dark navy palette: ${JSON.stringify(darkGroupDiag)}`);

const countryCoverage=await page.evaluate(()=>window.__SCHOLARK_COUNTRY__?.countryProfileCoverage?.()||null);
check(countryCoverage&&countryCoverage.missing?.length===0,`Country education profiles missing: ${countryCoverage?.missing?.join(', ')||'coverage API unavailable'}`);
check(Number(countryCoverage?.covered)===Number(countryCoverage?.total),`Country education coverage incomplete: ${countryCoverage?.covered}/${countryCoverage?.total}`);
const profileValidation=await page.evaluate(()=>window.__SCHOLARK_COUNTRY__?.validateProfiles?.()||null);
check(profileValidation?.ok===true&&profileValidation?.issues?.length===0,`Country profile validation failed: ${JSON.stringify(profileValidation?.issues?.slice(0,12)||profileValidation)}`);
const sourceValidation=await page.evaluate(()=>{
  const api=window.__SCHOLARK_COUNTRY__,bad=[];
  for(const country of api?.countries||[]){const s=api?.sourceBasis?.(country);if(!s?.name||!/^https:\/\//i.test(String(s?.url||'')))bad.push(country)}
  return bad;
});
check(sourceValidation.length===0,`Country source provenance missing: ${sourceValidation.slice(0,12).join(', ')}`);
check(await page.locator('#v96-country-context .v116-source').count()===1,'Dashboard education source link missing');
check((await page.locator('#v96-country-context .v116-source').getAttribute('data-source-verification'))==='national-official','Suriname source badge is not marked nationally verified');
const countryIntegrity=await page.evaluate(()=>{
  const api=window.__SCHOLARK_COUNTRY__,bad=[];
  for(const country of api?.countries||[]){
    const sys=api.system(country),stages=Array.isArray(sys?.stages)?sys.stages:[];
    const titles=stages.map(x=>String(x?.[2]||'').trim());
    if(country!=='Suriname'&&String(sys?.label||'').includes('International / ISCED'))bad.push(country+': international fallback');
    if(stages.length!==5)bad.push(country+': '+stages.length+' stages');
    if(titles.some(x=>!x))bad.push(country+': empty stage');
    if(titles.some(x=>/ISCED\s*[0-9]/i.test(x)))bad.push(country+': raw ISCED title');
  }
  return bad;
});
check(countryIntegrity.length===0,`Country education integrity failures: ${countryIntegrity.slice(0,12).join(' | ')}`);

async function selectEducationCountry(country,expectedTitles,expectedGroups=[]){
  await page.selectOption('#v96-country',{label:country}).catch(async()=>page.selectOption('#v96-country',country));
  await page.waitForFunction(c=>window.__SCHOLARK_COUNTRY__?.current?.()===c,country,{timeout:5000});
  await page.waitForTimeout(140);
  const titles=await page.locator('.v51-levels .v51-level b').allInnerTexts();
  for(const expected of expectedTitles)check(titles.some(x=>x.includes(expected)),`${country} education stage missing: ${expected} | got: ${titles.join(' | ')}`);
  const groups=await page.locator('.v51-levels .v51-level-group').allInnerTexts();
  for(const expected of expectedGroups)check(groups.some(x=>x.toLocaleLowerCase().includes(expected.toLocaleLowerCase())),`${country} education group missing: ${expected} | got: ${groups.join(' | ')}`);
  const fallback=['Early childhood education','Primary education','Lower secondary education','Upper secondary / vocational education','Higher education'];
  check(!fallback.every(x=>titles.some(t=>t.trim().toLowerCase()===x.toLowerCase())),`${country} fell back to generic international education labels`);
  const overlap=await page.evaluate(()=>{
    const cards=[...document.querySelectorAll('.v51-levels-global .v51-level')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0}).map(el=>({text:(el.querySelector('b')?.textContent||'').trim(),r:el.getBoundingClientRect()}));
    const bad=[];
    for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++){
      const a=cards[i].r,b=cards[j].r,w=Math.min(a.right,b.right)-Math.max(a.left,b.left),h=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
      if(w>2&&h>2)bad.push(cards[i].text+' <> '+cards[j].text);
    }
    return bad;
  });
  check(overlap.length===0,`${country} education cards overlap: ${overlap.join(', ')}`);
}

await selectEducationCountry('Panama',['Educación inicial / Preescolar','Educación primaria','Educación premedia','Educación media','Educación superior'],['Educación Básica General','Premedia','Educación Media','Educación Superior']);
await selectEducationCountry('Japan',['Yōchien','Shōgakkō','Chūgakkō','Kōtō gakkō','Daigaku']);
await selectEducationCountry('Kenya',['Pre-primary','Lower / Upper Primary','Junior School','Senior School','Tertiary / University']);
await page.selectOption('#v96-country','Suriname');
await page.waitForFunction(()=>window.__SCHOLARK_COUNTRY__?.current?.()==='Suriname',{timeout:5000});
await page.waitForTimeout(140);
check(await page.locator('.v51-levels.v51-levels-suriname [data-level]').count()===9,'Suriname 9-track education system did not restore after global country switching');
check(await page.locator('.v51-levels.v51-levels-global').count()===0,'Global education layout leaked into Suriname after country switching');

await page.click('.v51-level[data-level="mulo"]');
check(await page.evaluate(()=>localStorage.getItem('scholark_education_track')==='mulo'),'MULO selection did not persist');
check(await page.locator('.v51-level[data-level="mulo"]').evaluate(el=>el.classList.contains('active')),'MULO did not become active');

const studioComing=page.locator('#v51-sidebar [data-v51-tool="studio"]');
check(await studioComing.count()===1,'Studio AI Coming Soon entry missing');
check((await studioComing.getAttribute('data-v51-inactive'))==='1','Studio AI should remain feature-gated in R194');
check((await studioComing.innerText()).includes('COMING SOON'),'Studio AI feature gate is not visible to users');

await route('ai','#v107-ai');
check(await page.locator('#v107-q').count()===1,'ARKI prompt missing');
check(await page.locator('#v107-new').count()===1,'ARKI new-chat action missing');
check(await page.locator('#v107-deep').count()===1,'ARKI deep-answer control missing');
await page.fill('#v107-q','What is 2 + 2?');
await page.click('#v107-send');
await page.waitForFunction(()=>[...document.querySelectorAll('.v107-msg.assistant')].some(x=>/2 \+ 2 = 4|\b4\b/.test(x.textContent||'')),{timeout:5000});
check(await page.evaluate(()=>{try{const a=JSON.parse(localStorage.getItem('scholark_v107_general_ai_chats')||'[]');return a.some(c=>(c.messages||[]).some(m=>m.role==='user'&&m.content==='What is 2 + 2?')&&(c.messages||[]).some(m=>m.role==='assistant'&&/4/.test(m.content||'')))}catch{return false}}),'ARKI chat did not persist both sides of the conversation');
check(await page.locator('[data-v107-copy]').count()>=1,'ARKI copy action missing after response');
await page.click('#v107-new');
check(await page.locator('.v107-welcome').count()===1,'ARKI new chat did not reset the conversation surface');

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
check(await page.locator('#v52-plan-csv').count()===1,'Planner CSV export missing');
check(await page.locator('#v52-plan-ics').count()===1,'Planner calendar export missing');
check(await page.locator('#v52-plan-clear').count()===1,'Planner completed cleanup missing');
await page.fill('#v52-plan','Review biology notes');
await page.click('#v52-plan-add');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v51_planner')||'[]').some(x=>x.text==='Review biology notes')}catch{return false}}),'Planner item did not persist');

await route('focus','#v106-root');
check(await page.locator('#v106-focus-main').count()===1,'Focus start button missing');
check(await page.locator('#v106-focus-custom').count()===1,'Custom Focus duration missing');
await page.fill('#v106-focus-custom','35');
await page.locator('#v106-focus-custom').dispatchEvent('change');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v106_focus')||'{}').duration===35}catch{return false}}),'Custom Focus duration did not persist');
await page.fill('#v106-focus-task','Biology focus smoke');
await page.click('#v106-focus-main');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v106_focus')||'{}').running===true}catch{return false}}),'Focus session did not start');
await page.click('#v106-focus-main');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v106_focus')||'{}').running===false}catch{return false}}),'Focus session did not pause');

await route('flashcards','#v106-root');
check(await page.locator('#v106-card-add').count()===1,'Flashcard add button missing');
check(await page.locator('#v106-card-export').count()===1,'Flashcard export missing');
check(await page.locator('#v106-card-shuffle').count()===1,'Flashcard shuffle option missing');
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
check(await page.locator('#v106-a-priority').count()===1,'Assignment priority control missing');
await page.selectOption('#v106-a-priority','high');
await page.fill('#v106-a-title','Workspace smoke assignment');
await page.fill('#v106-a-subject','Biology');
await page.click('#v106-a-add');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v106_assignments')||'[]').some(x=>x.title==='Workspace smoke assignment'&&x.priority==='high')}catch{return false}}),'Assignment priority did not persist');
await page.click('[data-a-plan]');
check(await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('scholark_v51_planner')||'[]').some(x=>String(x.id||'').startsWith('assignment-'))}catch{return false}}),'Assignment did not create Planner steps');

await route('progress','#v51-fallback .v52-tool');
try{await page.waitForFunction(()=>/photosynthesis/i.test(document.querySelector('#v51-fallback .v52-tool')?.textContent||''),{timeout:2500})}catch{}
const progressText=(await page.locator('#v51-fallback .v52-tool').innerText()).toLowerCase();
check(progressText.includes('photosynthesis'),'Progress did not consume Mastery data');
check(await page.locator('#v52-progress-export').count()===1,'Progress snapshot export missing');

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
const prakikiSearch=await page.evaluate(async()=>{
  const r=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country:'Suriname',city:'Paramaribo',name:'Prakiki',level:'kindergarten',radius:50})});
  return {status:r.status,data:await r.json().catch(()=>({}))};
});
check(prakikiSearch.status===200&&prakikiSearch.data?.ok===true,'Prakiki kindergarten search failed');
const prakikiRows=Array.isArray(prakikiSearch.data?.schools)?prakikiSearch.data.schools:[];
check(prakikiRows.some(x=>/Prakiki Kleuterschool/i.test(String(x.name||''))),'Prakiki Kleuterschool is missing from kindergarten search');
check(prakikiRows.every(x=>Array.isArray(x.levels)&&x.levels.includes('kindergarten')),'Prakiki name search leaked non-kindergarten results');
const currentSchoolCases=[
  {name:'NATIN Nickerie',city:'Nieuw Nickerie',level:'mbo',expect:/NATIN Nickerie/i},
  {name:'Waaldijk College',city:'Paramaribo',level:'lbo',expect:/Waaldijk College/i},
  {name:'Christelijk Pedagogisch Instituut',city:'Paramaribo',level:'mbo',expect:/Christelijk Pedagogisch Instituut/i},
  {name:'Surinaams Pedagogisch Instituut',city:'Paramaribo',level:'mbo',expect:/Surinaams Pedagogisch Instituut/i},
  {name:'Vocational College Suriname',city:'Paramaribo',level:'mbo',expect:/Vocational College Suriname/i},
  {name:'FHR Institute for Higher Education',city:'Paramaribo',level:'hbo',expect:/FHR Institute for Higher Education/i},
  {name:'Anton de Kom Universiteit van Suriname',city:'Paramaribo',level:'wo',expect:/Anton de Kom Universiteit/i}
];
for(const item of currentSchoolCases){
  const res=await page.evaluate(async item=>{
    const r=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country:'Suriname',city:item.city,name:item.name,level:item.level,radius:80})});
    return {status:r.status,data:await r.json().catch(()=>({}))};
  },item);
  check(res.status===200&&res.data?.ok===true,`Current school search failed for ${item.name}`);
  const rows=Array.isArray(res.data?.schools)?res.data.schools:[];
  check(rows.some(x=>item.expect.test(String(x.name||''))),`${item.name} is missing from ${item.level} search`);
  check(rows.every(x=>Array.isArray(x.levels)&&x.levels.includes(item.level)),`${item.name} search leaked a wrong education level`);
}
const moengoMbo=await page.evaluate(async()=>{
  const r=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country:'Suriname',city:'',name:'Scholengemeenschap Moengotapoe',level:'mbo',radius:700})});
  return {status:r.status,data:await r.json().catch(()=>({}))};
});
check(moengoMbo.status===200&&moengoMbo.data?.ok===true,'Scholengemeenschap Moengotapoe MBO search failed');
check((moengoMbo.data?.schools||[]).some(x=>/Scholengemeenschap Moengotapoe/i.test(String(x.name||''))&&(x.levels||[]).includes('mbo')),'Scholengemeenschap Moengotapoe is missing its current MBO classification');
const aahaSearch=await page.evaluate(async()=>{
  const r=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country:'Suriname',city:'Paramaribo',name:'A.H.A. Atheneum',level:'vwo',radius:50})});
  return {status:r.status,data:await r.json().catch(()=>({}))};
});
check(aahaSearch.status===200&&aahaSearch.data?.ok===true,'AAHA alias search failed');
const aahaRows=Array.isArray(aahaSearch.data?.schools)?aahaSearch.data.schools:[];
check(aahaRows.length===1,`AAHA alias search should canonicalize to one school, got ${aahaRows.length}`);
check(aahaRows[0]?.name==='Arthur Alex Hogendoorn Atheneum (AAHA)',`AAHA canonical name mismatch: ${aahaRows[0]?.name}`);
check(Number(aahaRows[0]?.metrics?.directPassRate)===93.5,'AAHA verified 2026 exam metric missing');

await page.fill('#v50-country','Suriname');
await page.fill('#v50-city','Paramaribo');
await page.fill('#v50-name','A.H.A. Atheneum');
await page.selectOption('#v50-level','vwo');
await page.click('#v50-go');
await page.waitForFunction(()=>/Arthur Alex Hogendoorn Atheneum \(AAHA\)/.test(document.querySelector('[data-sch-school-name-text="1"]')?.textContent||''),{timeout:5000});
const immutableSchoolName=(await page.locator('[data-sch-school-name-text="1"]').first().innerText()).trim();
check(immutableSchoolName==='Arthur Alex Hogendoorn Atheneum (AAHA)',`Rendered AAHA school name mismatch: ${immutableSchoolName}`);
await page.evaluate(name=>{
  const key='scholark_v90_i18n_v5-global37_es',m=JSON.parse(localStorage.getItem(key)||'{}');
  m[name]='NOMBRE TRADUCIDO QUE NO DEBE APARECER';
  localStorage.setItem(key,JSON.stringify(m));
},immutableSchoolName);
await page.selectOption('#v90-language','es');
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='es'&&!document.querySelector('#v90-language-overlay')?.classList.contains('open'),{timeout:5000});
check((await page.locator('[data-sch-school-name-text="1"]').first().innerText()).trim()===immutableSchoolName,'Official school name changed when SCHOLARK language changed');
await page.selectOption('#v90-language','nl');
await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='nl'&&!document.querySelector('#v90-language-overlay')?.classList.contains('open'),{timeout:5000});
await page.fill('#v50-name','');
await page.selectOption('#v50-level','all');

const adFontesSearch=await page.evaluate(async()=>{
  const r=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country:'Suriname',city:'Paramaribo',name:'Advontis',level:'vwo',radius:50})});
  return {status:r.status,data:await r.json().catch(()=>({}))};
});
check(adFontesSearch.status===200&&adFontesSearch.data?.ok===true,'Advontis alias search failed');
check((adFontesSearch.data?.schools||[]).some(x=>/Ad Fontes Lyceum/i.test(String(x.name||''))),'Advontis alias did not resolve to Ad Fontes Lyceum');

const kangoeroeSearch=await page.evaluate(async()=>{
  const r=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country:'Suriname',city:'Paramaribo',name:'Kangaroo',level:'all',radius:50})});
  return {status:r.status,data:await r.json().catch(()=>({}))};
});
check(kangoeroeSearch.status===200&&kangoeroeSearch.data?.ok===true,'Kangaroo alias search failed');
const kangoeroeNames=(kangoeroeSearch.data?.schools||[]).map(x=>String(x.name||''));
check(kangoeroeNames.some(x=>/Kangoeroe Community School/i.test(x)),'Kangoeroe Community School missing from Kangaroo alias search');
check(kangoeroeNames.some(x=>/Kangoeroe High/i.test(x)),'Kangoeroe High missing from Kangaroo alias search');

check(await page.locator('#v50-type').count()===1,'School-type filter missing');
check(await page.locator('#v50-verified').count()===1,'Verified-only filter missing');
check(await page.locator('#v50-compare-btn').count()===1,'School comparison control missing');
check(await page.locator('#v50-saved-btn').count()===1,'Saved-schools control missing');
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
const lawStudyAheadResponse={
  ok:true,provider:'ci-mock',model:'study-ahead-law',tier:'balanced',
  result:{
    title:'Law Study Ahead',overview:'Preparation for studying law.',
    branchMap:[
      {name:'Public Law',summary:'Law governing the state and public institutions.',specializations:['Constitutional Law','Administrative Law'],foundationTopics:['Sources of law','Constitutional structure'],starterSkills:['Case reading','Legal reasoning'],careerExamples:['Public-sector lawyer','Policy adviser']},
      {name:'Private Law',summary:'Law governing relationships between private persons and organizations.',specializations:['Contract Law','Property Law'],foundationTopics:['Obligations','Legal persons'],starterSkills:['Issue spotting','Argument writing'],careerExamples:['Private-practice lawyer','Legal counsel']},
      {name:'Criminal Law',summary:'Law concerning offences, responsibility and punishment.',specializations:['Substantive Criminal Law','Criminal Procedure'],foundationTopics:['Elements of offences','Procedure'],starterSkills:['Case analysis','Evidence reasoning'],careerExamples:['Prosecutor','Criminal lawyer']},
      {name:'International Law',summary:'Rules governing states and cross-border legal relationships.',specializations:['Public International Law','International Human Rights'],foundationTopics:['Treaties','Jurisdiction'],starterSkills:['Treaty reading','Comparative analysis'],careerExamples:['International legal adviser','NGO legal officer']}
    ],
    recommendedSpecialization:{name:'Explore before choosing',why:'No specialization preference was supplied.',prerequisites:['Legal reasoning','Academic reading'],nextSteps:['Compare branches','Read introductory cases']},
    skills:['Legal reasoning','Academic writing'],keySubjects:['Introduction to Law','Legal Research'],
    books:[
      {title:'Learning the Law',author:'Glanville Williams',level:'starter',why:'Introduces legal study and reasoning.',readingOrder:1},
      {title:'The Rule of Law',author:'Tom Bingham',level:'foundation',why:'Introduces a core legal principle.',readingOrder:2},
      {title:'Letters to a Law Student',author:'Nicholas J. McBride',level:'starter',why:'Practical preparation for law study.',readingOrder:3},
      {title:'An Introduction to Law',author:'Phil Harris',level:'foundation',why:'Broad introduction to legal systems and concepts.',readingOrder:4}
    ],
    learningResources:[{type:'open course',name:'Introductory law lectures',purpose:'Preview legal reasoning and core concepts'}],
    starterProjects:[{title:'Brief a court decision',difficulty:'starter',outcome:'Produce a one-page case brief.',skills:['Case reading','Issue spotting']},{title:'Compare two legal arguments',difficulty:'starter',outcome:'Write a structured comparison.',skills:['Argument analysis']}],
    tools:[{name:'Case brief template',purpose:'Structure facts, issue, rule, analysis and holding.',priority:'learn-now'}],
    universityPrep:['Practice academic reading','Learn basic citation habits'],
    firstYearPreview:[{topic:'Legal Method',whyItMatters:'Builds the reasoning method used across law subjects.'},{topic:'Constitutional Law',whyItMatters:'Introduces the structure and limits of public power.'},{topic:'Contract Law',whyItMatters:'Introduces enforceable agreements and obligations.'}],
    careers:['Legal counsel','Attorney','Policy adviser'],
    weeklyPlan:[{block:'Reading',focus:'Read and brief one case',minutes:60},{block:'Writing',focus:'Write one structured legal argument',minutes:60},{block:'Exploration',focus:'Compare two branches of law',minutes:60}],
    roadmap:[{phase:'Foundation',goal:'Understand legal systems and reasoning',actions:['Learn sources of law','Practice case briefs'],milestone:'Brief a case independently'},{phase:'Skills',goal:'Build legal reading and writing',actions:['Write issue-rule-analysis conclusions'],milestone:'Complete three structured analyses'},{phase:'Preview',goal:'Prepare for first-year subjects',actions:['Preview constitutional and contract law'],milestone:'Explain the purpose of three first-year subjects'}],
    questionsToExplore:['Do I prefer disputes between private parties or public-law questions?','Do I enjoy case analysis, policy questions, or cross-border issues most?']
  }
};
lawStudyAheadResponse.result.branchMap=lawStudyAheadResponse.result.branchMap.map((x,i)=>({
  ...x,
  whatYouDo:i===0?'Analyse constitutional structures, public powers and administrative decisions.':'Study and apply the rules, reasoning and evidence used in this branch of law.',
  typicalTasks:i===0?['Read constitutional cases','Review government decisions']:['Read cases','Research legal rules','Build structured arguments'],
  goodFitIf:i===0?['You enjoy public institutions and rights','You like policy questions']:['You enjoy close reading','You like structured argument']
}));
await page.route('**/api/learning/generate',async route=>{
  const req=route.request();
  if(req.method()==='POST'){
    let payload={};try{payload=JSON.parse(req.postData()||'{}')}catch{}
    if(payload.mode==='study_ahead'){await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(lawStudyAheadResponse)});return}
  }
  await route.continue();
});
await page.fill('#v62-field','Law');
await page.fill('#v62-specialization','');
await page.selectOption('#v62-horizon','flexible');
await page.selectOption('#v62-weekly-hours','4');
await page.selectOption('#v62-focus','balanced');
await page.fill('#v62-context','');
await page.click('#v62-study-run');
await page.waitForSelector('#v62-study-results .v62-branch',{state:'visible',timeout:5000});
check(await page.locator('#v62-study-results .v62-error').count()===0,'Law Study Ahead generation rendered an error');
check(await page.locator('#v62-study-results .v62-branch').count()===4,'Law Study Ahead branch map did not render after clicking Build');
const lawStudyText=await page.locator('#v62-study-results').innerText();
check(lawStudyText.includes('Learning the Law'),'Law Study Ahead reading path did not render after clicking Build');
check(lawStudyText.includes('Introductory law lectures'),'Law Study Ahead learning resources did not render after clicking Build');
check(lawStudyText.includes('Brief a court decision'),'Law Study Ahead starter projects did not render after clicking Build');
check(lawStudyText.includes('Legal Method'),'Law Study Ahead first-year preview did not render after clicking Build');
check(lawStudyText.includes('Do I prefer disputes between private parties'),'Law Study Ahead exploration questions did not render after clicking Build');
const lawStudyTextLower=lawStudyText.toLocaleLowerCase();
check(lawStudyTextLower.includes('what you actually do')&&lawStudyTextLower.includes('typical tasks')&&lawStudyTextLower.includes('good fit if'),'Law Study Ahead branch intelligence is not visible');
await page.click('[data-v62-focus-branch="Public Law"]');
check((await page.inputValue('#v62-specialization'))==='Public Law','Generated Study Ahead branch action did not populate specialization');
await page.unroute('**/api/learning/generate');
for(const id of ['#v62-specialization','#v62-horizon','#v62-weekly-hours','#v62-focus'])check(await page.locator(id).count()===1,'Advanced Study Ahead control missing: '+id);
await page.fill('#v62-field','Computer Science');
await page.fill('#v62-specialization','Cybersecurity');
await page.selectOption('#v62-horizon','3 months');
await page.selectOption('#v62-weekly-hours','6');
await page.selectOption('#v62-focus','projects-practical');
await page.fill('#v62-context','I want to build practical projects before university.');
await page.waitForTimeout(180);
await route('dashboard','#v51-main [data-v51-page="dashboard"].active');
await route('study','#v51-fallback .v62-study');
check((await page.inputValue('#v62-field'))==='Computer Science','Study Ahead field draft did not survive remount');
check((await page.inputValue('#v62-specialization'))==='Cybersecurity','Study Ahead specialization draft did not survive remount');
check((await page.inputValue('#v62-horizon'))==='3 months','Study Ahead horizon draft did not survive remount');
check((await page.inputValue('#v62-weekly-hours'))==='6','Study Ahead weekly-hours draft did not survive remount');
check((await page.inputValue('#v62-focus'))==='projects-practical','Study Ahead focus draft did not survive remount');
check((await page.inputValue('#v62-context')).includes('practical projects'),'Study Ahead context draft did not survive remount');
await page.evaluate(()=>window.__SCHOLARK_V83_STUDY_AHEAD__?.prefill?.({field:'Medicine',specialization:'Cardiology',horizon:'12 months',weeklyHours:'8',studyFocus:'books-theory'}));
await page.waitForTimeout(220);
check((await page.inputValue('#v62-field'))==='Medicine','Study Ahead prefill did not set field');
check((await page.inputValue('#v62-specialization'))==='Cardiology','Study Ahead prefill did not set specialization');
check((await page.inputValue('#v62-horizon'))==='12 months','Study Ahead prefill did not set horizon');
check((await page.inputValue('#v62-weekly-hours'))==='8','Study Ahead prefill did not set weekly hours');
check((await page.inputValue('#v62-focus'))==='books-theory','Study Ahead prefill did not set learning focus');
await page.evaluate(()=>{
  window.__SCHOLARK_V83_STUDY_AHEAD__?.openTrack?.({
    field:'Computer Science',specialization:'Cybersecurity',country:'Suriname',horizon:'6 months',weeklyHours:'6',studyFocus:'projects-practical',
    result:{
      title:'Computer Science Study Ahead',overview:'Advanced preparation track.',
      branchMap:[{name:'Cybersecurity',summary:'Protect systems, networks and information.',specializations:['Application Security','Network Security'],foundationTopics:['Computer Networks','Operating Systems'],starterSkills:['Linux','Scripting'],careerExamples:['Security Analyst','Security Engineer']}],
      recommendedSpecialization:{name:'Cybersecurity',why:'Matches the selected focus.',prerequisites:['Networking'],nextSteps:['Learn Linux']},
      skills:['Programming'],keySubjects:['Algorithms'],
      books:[{title:'Computer Networking: A Top-Down Approach',author:'James F. Kurose and Keith W. Ross',level:'foundation',why:'Networking foundation.',readingOrder:1}],
      learningResources:[{type:'documentation',name:'MDN Web Docs',purpose:'Reference practice'}],
      starterProjects:[{title:'Build a simple port scanner',difficulty:'starter',outcome:'Practice sockets and networking.',skills:['Networking']}],
      tools:[{name:'Git',purpose:'Version control',priority:'learn-now'}],
      universityPrep:['Review discrete mathematics'],
      firstYearPreview:[{topic:'Discrete Mathematics',whyItMatters:'Supports algorithms and logic.'}],
      careers:['Security Engineer'],
      weeklyPlan:[{block:'Block 1',focus:'Networking foundations',minutes:60},{block:'Block 2',focus:'Linux practice',minutes:60},{block:'Block 3',focus:'Programming project',minutes:90}],
      roadmap:[{phase:'Foundation',goal:'Build core knowledge',actions:['Study networking'],milestone:'Explain TCP/IP clearly'},{phase:'Practice',goal:'Apply skills',actions:['Build a small project'],milestone:'Finish one project'},{phase:'Preview',goal:'Prepare for first year',actions:['Review discrete math'],milestone:'Complete a diagnostic'}],
      questionsToExplore:['Do I prefer offensive or defensive security?']
    }
  });
});
await page.waitForTimeout(80);
check(await page.locator('#v62-study-results .v62-branch').count()===1,'Advanced Study Ahead branch map did not render');
check(await page.locator('#v83-actions [data-v83="reading"]').count()===1,'Study Ahead reading-plan action missing');
check(await page.locator('#v83-actions [data-v83="projects"]').count()===1,'Study Ahead project-plan action missing');
check((await page.locator('#v62-study-results').innerText()).includes('First-year preview'),'Advanced Study Ahead first-year preview missing');
await page.click('[data-v83-focus-branch="Cybersecurity"]');
check((await page.inputValue('#v62-specialization'))==='Cybersecurity','Study Ahead branch focus did not populate specialization');
const bookComing=page.locator('#v51-sidebar [data-v51-tool="book"]');
check(await bookComing.count()===1,'Book Studio Coming Soon entry missing');
check((await bookComing.getAttribute('data-v51-inactive'))==='1','Book Studio should remain feature-gated in R194');
check((await bookComing.innerText()).includes('COMING SOON'),'Book Studio feature gate is not visible to users');
await route('dashboard','#v51-main [data-v51-page="dashboard"].active');
check(await visible('.v51-levels.v51-levels-suriname',5000),'Suriname groups disappeared after workspace route round-trip');

// Full 74-language route/layout pass. Dynamic languages use the local deterministic
// test translator in CI, while static languages also exercise their real translation maps.
const languageMatrix=await page.evaluate(async()=>{
  const api=window.__SCHOLARK_I18N__,langs=api?.langs||[],rtl=new Set(api?.rtlCodes||[]),issues=[];
  for(const row of langs){
    const code=row[0];
    try{await api.changeLanguage(code)}catch(e){issues.push(code+': change failed '+String(e?.message||e));continue}
    const dash=document.querySelector('#v51-main [data-v51-page="dashboard"].active'),h1=dash?.querySelector('.v51-head h1'),grid=dash?.querySelector('.v51-grid');
    const hr=h1?.getBoundingClientRect(),gr=grid?.getBoundingClientRect(),font=parseFloat(h1?getComputedStyle(h1).fontSize:'0')||0;
    if(document.documentElement.lang!==code)issues.push(code+': html lang='+document.documentElement.lang);
    if((document.documentElement.dir==='rtl')!==rtl.has(code))issues.push(code+': dir='+document.documentElement.dir);
    if(document.documentElement.classList.contains('scholark-language-switching'))issues.push(code+': switch lock remained');
    if(document.querySelector('#v90-language-overlay')?.classList.contains('open'))issues.push(code+': overlay remained');
    if(font>72)issues.push(code+': oversized title '+font);
    if(hr&&gr&&hr.bottom>gr.top+2)issues.push(code+': title overlaps grid');
    if((dash?.querySelectorAll('.v51-head h1').length||0)!==1)issues.push(code+': duplicate dashboard title');
  }
  await api.changeLanguage('nl');
  return {count:langs.length,issues};
});
check(languageMatrix.count===74,`Language matrix expected 74 languages, got ${languageMatrix.count}`);
check(languageMatrix.issues.length===0,`74-language layout pass failed: ${languageMatrix.issues.slice(0,15).join(' | ')}`);

check(await page.locator('.v116-side-actions').count()===1,'Workspace privacy/feedback controls missing');
check(await page.locator('#v116-onboarding').count()<=1,'Onboarding duplicated in Workspace');
const runtimeErrors=await page.evaluate(()=>window.__SCHOLARK_RUNTIME__?.errors?.()||[]);
check(runtimeErrors.length===0,'Runtime loader errors: '+runtimeErrors.join(', '));
const duplicateIds=await page.evaluate(()=>{
  const seen=new Set(),dups=[];document.querySelectorAll('[id]').forEach(el=>{if(seen.has(el.id)&&!dups.includes(el.id))dups.push(el.id);seen.add(el.id)});return dups.filter(x=>!/^v25-|^sv24-/.test(x));
});
check(duplicateIds.length===0,'Duplicate DOM ids: '+duplicateIds.join(', '));
if(pageErrors.length) failures.push('Browser errors: '+[...new Set(pageErrors)].slice(0,8).join(' | '));

// Mobile/touch launch pass.
const mobileContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const mobile=await mobileContext.newPage();
await mobile.addInitScript(()=>{localStorage.setItem('scholark_ui_language','nl');localStorage.setItem('scholark_country','Suriname');localStorage.setItem('scholark_learning_level','secondary')});
try{
  await mobile.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:30000});
  await mobile.waitForSelector('#v55-topbar',{state:'visible',timeout:8000});
  const homeMobile=await mobile.evaluate(()=>({sw:document.documentElement.scrollWidth,w:innerWidth,actions:document.querySelectorAll('.v116-public-actions button').length}));
  check(homeMobile.sw<=homeMobile.w+4,`Mobile homepage has horizontal overflow: ${JSON.stringify(homeMobile)}`);
  check(homeMobile.actions===2,'Mobile public privacy/feedback actions missing');
  await mobile.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:30000});
  await mobile.waitForSelector('#v51-main [data-v51-page="dashboard"].active',{state:'visible',timeout:10000});
  await mobile.waitForFunction(()=>!document.documentElement.classList.contains('scholark-workspace-entering'),null,{timeout:6000});
  const mobileState=await mobile.evaluate(()=>{
    const visibleButtons=[...document.querySelectorAll('#v51-main [data-v51-page="dashboard"].active button,.v116-side-actions button')].filter(x=>{const r=x.getBoundingClientRect(),cs=getComputedStyle(x);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'}).map(x=>({text:(x.textContent||'').trim().slice(0,40),h:x.getBoundingClientRect().height}));
    const main=document.querySelector('#v51-main'),h1=document.querySelector('#v51-main [data-v51-page="dashboard"].active .v51-head h1');
    return {sw:document.documentElement.scrollWidth,w:innerWidth,mainVisible:main?getComputedStyle(main).visibility:'',titleFont:h1?parseFloat(getComputedStyle(h1).fontSize):0,smallTargets:visibleButtons.filter(x=>x.h<42).slice(0,10)};
  });
  check(mobileState.sw<=mobileState.w+4,`Mobile Workspace has horizontal overflow: ${JSON.stringify(mobileState)}`);
  check(mobileState.mainVisible!=='hidden'&&mobileState.titleFont<=60,'Mobile Workspace did not settle cleanly');
  check(mobileState.smallTargets.length===0,`Touch targets below ~44px remain: ${JSON.stringify(mobileState.smallTargets)}`);
  timings.push(['mobile-touch-pass',0]);
}catch(e){failures.push('Mobile/touch QA threw '+String(e?.message||e))}finally{await mobileContext.close()}

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
