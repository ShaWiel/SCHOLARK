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
async function checkWorkspaceSingletons(label){
  const state=await page.evaluate(()=>{
    const shown=el=>{if(!el)return false;const cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>.02&&r.width>0&&r.height>0};
    const ids=['v51-main','v51-sidebar','v51-top-actions','v51-home','v51-side-toggle'];
    const idCounts=Object.fromEntries(ids.map(id=>[id,document.querySelectorAll('#'+id).length]));
    const byParent={};
    [...document.querySelectorAll('.v111-live[data-v111-owner]')].forEach(el=>{const p=el.parentElement;if(!p)return;const key=p.id||p.className||p.tagName;byParent[key]=(byParent[key]||0)+1});
    const sidebarTools=[...document.querySelectorAll('#v51-sidebar [data-v51-tool]')].map(x=>x.dataset.v51Tool);
    const duplicateTools=[...new Set(sidebarTools.filter((x,i,a)=>a.indexOf(x)!==i))];
    return {
      idCounts,
      duplicateTools,
      languageBoxes:document.querySelectorAll('#v51-sidebar .v90-langbox').length,
      countryBoxes:document.querySelectorAll('#v51-sidebar #v96-side-country').length,
      workspaceHelp:document.querySelectorAll('#v51-top-actions #v116-workspace-help').length,
      standaloneWorkspaceSignout:[...document.querySelectorAll('button,a,[role="button"]')].filter(el=>!el.closest('#v89-account,#v72-modal,#v116-workspace-help')&&/^(sign\s*out|log\s*out|logout|uitloggen)$/i.test((el.textContent||'').trim())).length,
      onboarding:document.querySelectorAll('#v51-main #v116-onboarding').length,
      connectedBars:document.querySelectorAll('.v114-connect').length,
      visibleConnectedBars:[...document.querySelectorAll('.v114-connect')].filter(shown).length,
      experienceByParent:byParent,
      visibleExperience:[...document.querySelectorAll('.v111-live[data-v111-owner]')].filter(shown).length,
      emergency:document.querySelectorAll('#v53-emergency').length,
      emergencyVisible:[...document.querySelectorAll('#v53-emergency')].filter(shown).length,
      levelGroups:document.querySelectorAll('#v51-main [data-v51-page="dashboard"] .v51-level-cluster').length,
      levelIds:[...document.querySelectorAll('#v51-main [data-v51-page="dashboard"] [data-level]')].map(x=>x.dataset.level),
      hardening:window.__SCHOLARK_HARDENING__?.verify?.()||null,
      orchestration:window.__SCHOLARK_V114_ORCHESTRATOR__?.verify?.()||null,
      experience:window.__SCHOLARK_V111_EXPERIENCE__?.verify?.()||null
    };
  });
  check(Object.values(state.idCounts).every(n=>n===1),`${label}: canonical Workspace shell duplicated: ${JSON.stringify(state)}`);
  check(state.duplicateTools.length===0,`${label}: sidebar tools duplicated: ${JSON.stringify(state)}`);
  check(state.languageBoxes<=1&&state.countryBoxes<=1&&state.workspaceHelp<=1&&state.onboarding<=1,`${label}: Workspace controls duplicated: ${JSON.stringify(state)}`);
  check(state.standaloneWorkspaceSignout===0,`${label}: standalone Workspace Sign out action remains: ${JSON.stringify(state)}`);
  check(state.connectedBars<=1&&state.visibleConnectedBars<=1,`${label}: connected-flow bar duplicated: ${JSON.stringify(state)}`);
  check(Object.values(state.experienceByParent).every(n=>n<=1)&&state.visibleExperience<=1,`${label}: Workspace experience panel duplicated: ${JSON.stringify(state)}`);
  check(state.emergencyVisible===0,`${label}: emergency Workspace is visible beside primary shell: ${JSON.stringify(state)}`);
  check(new Set(state.levelIds).size===state.levelIds.length,`${label}: education level cards duplicated: ${JSON.stringify(state)}`);
  check(state.hardening?.ok!==false&&state.orchestration?.ok!==false&&state.experience?.ok!==false,`${label}: singleton health check failed: ${JSON.stringify(state)}`);
  return state;
}
async function checkTransitionSingletons(label){
  const state=await page.evaluate(()=>{
    const counts=sel=>document.querySelectorAll(sel).length;
    return {
      topbar:counts('#v55-topbar'),language:counts('#v55-language'),storeButton:counts('#v117-credit-store-button'),
      storeHome:counts('#v117-store-return-home'),storeWorkspace:counts('#v117-store-return-workspace'),
      auth:counts('#v55-auth'),account:counts('#v55-topbar .v55-account-wrap'),creditChip:counts('#v55-topbar .v85-topbar-credit'),
      storePage:counts('#v117-credit-store-page'),workspaceMain:counts('#v51-main'),workspaceSidebar:counts('#v51-sidebar'),
      wallet:counts('#v51-sidebar .v85-wallet'),dashCredit:counts('#v51-main [data-v51-page="dashboard"] .v85-dash'),
      langbox:counts('#v51-sidebar .v90-langbox'),country:counts('#v51-sidebar #v96-side-country'),
      topActions:counts('#v51-top-actions'),workspaceHelp:counts('#v51-top-actions #v116-workspace-help'),publicHelp:counts('#v55-topbar .v116-public-actions'),storeBar:counts('#v117-credit-store-page .v117-storebar'),sideActions:counts('#v51-sidebar .v116-side-actions'),onboarding:counts('#v51-main #v116-onboarding'),
      visibleTopbarSurfaces:[...document.querySelectorAll('#v55-topbar,#v51-top-actions,.v117-storebar')].filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>0}).length,
      connected:counts('.v114-connect'),storeClass:document.documentElement.classList.contains('v117-credit-store-route')||document.body.classList.contains('v117-credit-store-route')
    };
  });
  const maxOne=['topbar','language','storeButton','storeHome','storeWorkspace','auth','account','creditChip','storePage','workspaceMain','workspaceSidebar','wallet','dashCredit','langbox','country','topActions','workspaceHelp','publicHelp','onboarding','connected'];
  check(state.sideActions===0,label+': legacy Workspace sidebar help actions returned '+JSON.stringify(state));
  check(state.storeBar===0,label+': duplicate internal Credit Store bar returned '+JSON.stringify(state));
  check(state.visibleTopbarSurfaces<=1,label+': more than one topbar surface is visible '+JSON.stringify(state));
  check(maxOne.every(k=>state[k]<=1),label+': duplicate transition surfaces '+JSON.stringify(state));
  return state;
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
  await page.waitForTimeout(180);
  await checkWorkspaceSingletons('route '+id);
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
check(await page.locator('#v72-modal [data-v72-terms]').count()===1,'Create-account terms consent is missing');
check((await page.locator('#v72-modal').innerText()).includes('Privacy Notice & Product Terms'),'Create-account legal notice is missing');
await page.click('#v72-modal .v72-x');
check(await page.locator('#v72-modal').evaluate(el=>!el.classList.contains('open')),'Auth modal did not close cleanly');
check(await visible('#v117-credit-store-button',3000),'Credit Store action is missing from the homepage topbar');
check(await page.locator('#v85-store').count()===0,'Legacy Credit Store modal is still mounted');
await page.click('#v117-credit-store-button');
await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:3000});
check(await visible('#v117-credit-store-page',3000),'Dedicated Credit Store page did not open from the homepage topbar');
check(await visible('#v55-topbar',3000),'Homepage topbar disappeared on the Credit Store page');
check(await page.locator('#v117-credit-store-page [data-v117-pack]').count()===6,'Credit Store should expose exactly six top-up packs');
check(await page.locator('#v117-store-dock').count()===0,'Legacy Credit Store bottom navigation dock still exists');
check(await page.locator('#v117-credit-store-page .v117-storebar').count()===0,'Duplicate internal Credit Store navigation bar still exists');
check(await page.locator('#v51-top-actions').count()===0,'Workspace topbar leaked into Credit Store');
check(await page.locator('#v117-store-return-workspace').count()===1,'Credit Store Workspace return action is missing from the topbar');
check(await page.locator('#v117-store-return-home').count()===1,'Credit Store Homepage return action is missing from the topbar');
check(await visible('#v117-store-return-workspace',3000)&&await visible('#v117-store-return-home',3000),'Credit Store return actions are not visible');
check(await page.locator('#v55-topbar #v117-credit-store-button').count()===0,'Credit Store button should be removed from the store topbar');
check(await page.locator('#v55-topbar #v55-account').count()===0,'Account menu should be removed from the Credit Store topbar');
check(await page.locator('#v55-topbar #v55-auth').count()===0,'Sign out/auth action should be removed from the Credit Store topbar');
const storeTopbarText=(await page.locator('#v55-topbar').innerText()).replace(/\s+/g,' ');
check(!/\bAccount\b|Sign out|Log out|Feedback|Privacy\s*&?\s*Terms/i.test(storeTopbarText),'Credit Store topbar still exposes account/sign-out/feedback/privacy controls');
check(await page.locator('#v117-credit-store-page .v117-trust span').count()===3,'Credit Store trust/value strip is incomplete');
const storeText=(await page.locator('#v117-credit-store-page').innerText()).replace(/\s+/g,' ');
check(storeText.includes('100')&&storeText.includes('$2.99')&&storeText.includes('250')&&storeText.includes('$6.99')&&storeText.includes('750')&&storeText.includes('$16.99')&&storeText.includes('1,500')&&storeText.includes('$29.99')&&storeText.includes('3,000')&&storeText.includes('$49.99')&&storeText.includes('7,500')&&storeText.includes('$99.99'),'Credit Store pack amounts/prices are incomplete');
check(/subscription remains unchanged/i.test(storeText)&&/stay in your wallet until you use them/i.test(storeText),'Credit Store does not explain persistent one-time top-ups');
check(/Secure Paddle checkout/i.test(storeText)&&/Choose your top-up/i.test(storeText)&&/BEST VALUE/i.test(storeText),'Credit Store premium value/trust presentation is incomplete');
check(await page.evaluate(()=>getComputedStyle(document.querySelector('#v29-home-layer')).display==='none'),'Homepage content is still visible behind the dedicated Credit Store page');
await page.click('#v117-credit-store-page [data-v117-pack="mini"]');
check(await visible('#v72-modal.open',3000),'Unauthenticated credit purchase did not route to account authentication');
check(await page.evaluate(()=>sessionStorage.getItem('scholark_pending_credit_pack')==='mini'),'Pending credit pack was not preserved across authentication');
await page.click('#v72-modal .v72-x');
await page.evaluate(()=>sessionStorage.removeItem('scholark_pending_credit_pack'));
check(await visible('#v117-store-return-workspace',5000),'Credit Store Workspace return action disappeared after auth modal');
await page.click('#v117-store-return-workspace',{timeout:5000});
await page.waitForFunction(()=>location.hash==='#dashboard',{timeout:5000});
check(await visible('#v51-main [data-v51-page="dashboard"].active',12000),'Credit Store Workspace button did not enter the Workspace dashboard');
await page.evaluate(()=>{location.hash='home'});
await page.waitForFunction(()=>location.hash==='#home',{timeout:5000});
check(await visible('#v29-home-layer',8000),'Homepage did not recover after leaving Workspace');
check(await visible('#v117-credit-store-button',5000),'Credit Store topbar action did not recover after Workspace');
await page.click('#v117-credit-store-button');
await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
check(await visible('#v117-credit-store-page',8000),'Credit Store did not reopen from the homepage after Workspace');
await page.click('#v117-store-return-home');
await page.waitForFunction(()=>location.hash==='#home',{timeout:5000});
check(await page.locator('#v117-credit-store-page').evaluate(el=>el.hidden),'Credit Store page did not leave cleanly');
check(await visible('#v29-home-layer',5000),'Homepage did not recover after leaving Credit Store');
await checkTransitionSingletons('store-return-home initial');

for(let cycle=1;cycle<=3;cycle++){
  check(await visible('#v117-credit-store-button',5000),'Cycle '+cycle+': Credit Store button missing on Home');
  await page.click('#v117-credit-store-button');
  await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
  check(await visible('#v117-credit-store-page',5000),'Cycle '+cycle+': Credit Store did not open');
  await checkTransitionSingletons('store-open cycle '+cycle);
  await page.click('#v117-store-return-home');
  await page.waitForFunction(()=>location.hash==='#home',{timeout:5000});
  check(await visible('#v29-home-layer',5000),'Cycle '+cycle+': Home did not recover');
  const homeCycle=await checkTransitionSingletons('store-home cycle '+cycle);
  check(!homeCycle.storeClass,'Cycle '+cycle+': stale Credit Store route class remained on Home');
}
for(let cycle=1;cycle<=2;cycle++){
  await page.click('#v117-credit-store-button');
  await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
  await page.click('#v117-store-return-workspace');
  await page.waitForFunction(()=>location.hash==='#dashboard',{timeout:5000});
  check(await visible('#v51-main [data-v51-page="dashboard"].active',10000),'Workspace return cycle '+cycle+' did not settle on Dashboard');
  const wsCycle=await checkTransitionSingletons('store-workspace cycle '+cycle);
  check(!wsCycle.storeClass,'Workspace return cycle '+cycle+': stale Credit Store route class remained');
  await page.evaluate(()=>{location.hash='home'});
  await page.waitForFunction(()=>location.hash==='#home',{timeout:5000});
  check(await visible('#v29-home-layer',8000),'Workspace return cycle '+cycle+': Home did not recover');
  await checkTransitionSingletons('workspace-home cycle '+cycle);
}


// Browser history + hard reload must not resurrect parked/duplicate Store or Workspace surfaces.
check(await visible('#v117-credit-store-button',5000),'History stress: Credit Store button missing on Home');
await page.click('#v117-credit-store-button');
await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
check(await visible('#v117-credit-store-page',5000),'History stress: Credit Store did not open');
await checkTransitionSingletons('history-store-open');

await page.goBack();
await page.waitForFunction(()=>location.hash==='#home',{timeout:5000});
check(await visible('#v29-home-layer',8000),'History stress: browser Back did not restore Home');
const historyBack=await checkTransitionSingletons('history-store-back');
check(!historyBack.storeClass,'History stress: browser Back left the Store route class active');

await page.goForward();
await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
check(await visible('#v117-credit-store-page',8000),'History stress: browser Forward did not restore Credit Store');
await checkTransitionSingletons('history-store-forward');

await page.reload({waitUntil:'domcontentloaded',timeout:30000});
await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
check(await visible('#v117-credit-store-page',10000),'History stress: hard reload on Credit Store did not remount Store');
await checkTransitionSingletons('history-store-reload');

await page.click('#v117-store-return-workspace');
await page.waitForFunction(()=>location.hash==='#dashboard',{timeout:5000});
check(await visible('#v51-main [data-v51-page="dashboard"].active',12000),'History stress: Store did not return to Dashboard after reload');
await checkTransitionSingletons('history-workspace-after-store-reload');

await page.reload({waitUntil:'domcontentloaded',timeout:30000});
await page.waitForFunction(()=>location.hash==='#dashboard',{timeout:5000});
check(await visible('#v51-main [data-v51-page="dashboard"].active',12000),'History stress: hard reload on Dashboard did not remount Workspace');
await checkWorkspaceSingletons('history-dashboard-reload');
await checkTransitionSingletons('history-dashboard-reload-transition');

await page.goBack();
await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
check(await visible('#v117-credit-store-page',10000),'History stress: Back from reloaded Dashboard did not restore Credit Store');
await checkTransitionSingletons('history-back-to-store');

await page.goForward();
await page.waitForFunction(()=>location.hash==='#dashboard',{timeout:5000});
check(await visible('#v51-main [data-v51-page="dashboard"].active',12000),'History stress: Forward from Store did not restore Dashboard');
await checkWorkspaceSingletons('history-forward-dashboard');

await page.evaluate(()=>{location.hash='home'});
await page.waitForFunction(()=>location.hash==='#home',{timeout:5000});
check(await visible('#v29-home-layer',8000),'History stress: Home did not recover after browser history sequence');
await checkTransitionSingletons('history-final-home');

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
await page.evaluate(()=>{localStorage.setItem('scholark_supabase_session_v2',JSON.stringify({access_token:'ci-signed-in'}));window.__SCHOLARK_V55_TOPBAR__?.syncTopbarCopy?.()});
check(await page.locator('#v55-auth').evaluate(el=>el.hidden===true),'Signed-in top-level auth button should be hidden');
await page.click('#v55-account');
check(/Sign out|Uitloggen/i.test(await page.locator('#v55-topbar .v55-menu').innerText()),'Account menu does not own Sign out while signed in');
check(!/^(Sign out|Uitloggen)$/i.test((await page.locator('#v55-topbar > .v55-actions').innerText()).trim()),'Standalone top-level Sign out remains visible');
await page.evaluate(()=>{localStorage.removeItem('scholark_supabase_session_v2');window.__SCHOLARK_V55_TOPBAR__?.syncTopbarCopy?.()});
await page.keyboard.press('Escape');
const idleTopbarMutations=await page.evaluate(async()=>{
  const bar=document.querySelector('#v55-topbar');if(!bar)return 999;
  let count=0;const o=new MutationObserver(m=>count+=m.length);o.observe(bar,{subtree:true,childList:true,characterData:true,attributes:true});
  await new Promise(r=>setTimeout(r,700));o.disconnect();return count;
});
check(idleTopbarMutations<=1,`Homepage topbar kept mutating while idle: ${idleTopbarMutations} mutations`);
check(await visible('.v116-public-actions',5000),'Public Help & Support control did not mount');
check(await page.locator('.v116-public-help-toggle').count()===1,'Public Help & Support toggle should be a singleton');
check(await page.locator('[data-v116-public-support],[data-v116-public-feedback],[data-v116-public-privacy]').count()===0,'Legacy standalone public support/privacy/feedback actions remain');
await page.click('.v116-public-help-toggle');
check(await page.locator('.v116-public-help-menu [data-v116-public-help]').count()===4,'Public Help & Support menu should contain four actions');
const publicHelpText=(await page.locator('.v116-public-help-menu').innerText()).replace(/\s+/g,' ');
check(/Support/i.test(publicHelpText)&&/Feedback/i.test(publicHelpText)&&/Privacy\s*&\s*Terms/i.test(publicHelpText)&&/Service status/i.test(publicHelpText),'Public Help & Support menu content is incomplete');
await page.waitForTimeout(120);
check(await page.locator('#v41-home-pricing .v115-env').count()>=2,'Sandbox checkout disclosure badges did not mount on paid plans');
check((await page.locator('#v41-home-pricing .v115-env').first().innerText()).includes('NO REAL CHARGE'),'Sandbox checkout disclosure is unclear');
await page.click('[data-v116-public-help="privacy"]');
check(await visible('#v116-dialog.open',3000),'Privacy & terms dialog did not open from Help & Support');
check((await page.locator('#v116-dialog').getAttribute('role'))==='dialog'&&(await page.locator('#v116-dialog').getAttribute('aria-modal'))==='true','Privacy dialog accessibility semantics missing');
const privacyText=(await page.locator('#v116-dialog').innerText()).toLowerCase();
check(privacyText.includes('your data stays under your control')&&privacyText.includes('privacy notice')&&privacyText.includes('service providers & ai')&&privacyText.includes('retention, export & deletion')&&privacyText.includes('product terms')&&privacyText.includes('legal review status')&&privacyText.includes('paddle'),'Privacy/product/billing notice is incomplete');
await page.keyboard.press('Escape');
check(await page.locator('#v116-dialog.open').count()===0,'Privacy dialog did not close with Escape');
await page.click('.v116-public-help-toggle');
await page.click('[data-v116-public-help="support"]');
check(await visible('#v116-dialog.open .v116-feedback',3000),'Support dialog did not open from Help & Support');
check(await page.locator('#v116-dialog input[type="email"]').count()===1,'Support reply-email field missing');
await page.locator('#v116-dialog textarea').fill('CI support flow check');
await page.click('[data-v116-support-submit]');
await page.waitForFunction(()=>!document.querySelector('#v116-dialog')?.classList.contains('open'),{timeout:4000});
await page.click('.v116-public-help-toggle');
await page.click('[data-v116-public-help="feedback"]');
check(await visible('#v116-dialog.open .v116-feedback',3000),'Feedback dialog did not open from Help & Support');
await page.keyboard.press('Escape');
await page.click('.v116-public-help-toggle');
await page.click('[data-v116-public-help="service"]');
check(await visible('#v116-dialog.open',3000),'Service status did not open from Help & Support');
check(/service status|operational/i.test(await page.locator('#v116-dialog').innerText()),'Service status dialog content missing');
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
for(const delay of [0,1,8,24,72,140,260]){
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
  await checkWorkspaceSingletons('rapid re-entry '+delay+'ms');
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
check(reentryState.topbarDisplay===''&&reentryState.homeDisplay==='none',`Home UI remained visible over Workspace after rapid re-entry: ${JSON.stringify(reentryState)}`);
check(reentryState.mainCount===1&&reentryState.sidebarCount===1&&reentryState.homeCount===1&&reentryState.h1Count===1,`Workspace/home surfaces duplicated after rapid re-entry: ${JSON.stringify(reentryState)}`);
check(reentryState.title==='Tu espacio de aprendizaje y creación.',`Workspace title corrupted after Home round-trip: ${reentryState.title}`);
check(reentryState.huge.length===0&&reentryState.titleBottom<=reentryState.gridTop,`Workspace layout glitched after Home round-trip: ${JSON.stringify(reentryState)}`);

// Also exercise the actual Home CTA route once, not only direct hash return.
await page.click('#v51-home');
await page.waitForFunction(()=>location.hash==='#home'&&getComputedStyle(document.querySelector('#v55-topbar')).display!=='none',null,{timeout:5000});
await page.waitForSelector('#v55-workspace-cta .v55-entry',{state:'visible',timeout:5000});
await page.click('#v55-workspace-cta .v55-entry');
try{
  await page.waitForFunction(()=>location.hash==='#dashboard'&&document.body.classList.contains('v51-workspace')&&!document.documentElement.classList.contains('scholark-workspace-entering')&&!document.querySelector('#v55-topbar'),null,{timeout:6000});
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
    topbar:document.querySelector('#v55-topbar')?getComputedStyle(document.querySelector('#v55-topbar')).display:'missing',
    home:getComputedStyle(document.querySelector('#v29-home-layer')).display,
    bodyPublic:document.body.classList.contains('v55-public-home'),
    htmlPublic:document.documentElement.classList.contains('v55-public-home'),
    titleBottom:hr?.bottom||0,gridTop:gr?.top||0
  };
});
check(ctaReentry.title==='Tu espacio de aprendizaje y creación.'&&ctaReentry.h1Count===1&&ctaReentry.topbar==='missing'&&ctaReentry.home==='none'&&!ctaReentry.bodyPublic&&!ctaReentry.htmlPublic&&ctaReentry.titleBottom<=ctaReentry.gridTop,`Home CTA re-entry is not clean: ${JSON.stringify(ctaReentry)}`);

await checkWorkspaceSingletons('Home CTA re-entry 1');
for(let cycle=2;cycle<=6;cycle++){
  await page.click('#v51-home');
  await page.waitForFunction(()=>location.hash==='#home'&&getComputedStyle(document.querySelector('#v55-topbar')).display!=='none',null,{timeout:5000});
  await page.waitForSelector('#v55-workspace-cta .v55-entry',{state:'visible',timeout:5000});
  await page.click('#v55-workspace-cta .v55-entry');
  try{
    await page.waitForFunction(()=>location.hash==='#dashboard'&&document.body.classList.contains('v51-workspace')&&!document.documentElement.classList.contains('scholark-workspace-entering')&&!document.querySelector('#v55-topbar'),null,{timeout:6000});
  }catch(e){
    const diag=await page.evaluate(cycle=>({
      cycle,
      hash:location.hash,
      entry:window.__SCHOLARK_WORKSPACE__?.entryState?.(),
      html:[...document.documentElement.classList],
      body:[...document.body.classList],
      topbar:document.querySelector('#v55-topbar')?getComputedStyle(document.querySelector('#v55-topbar')).display:'missing',
      home:document.querySelector('#v29-home-layer')?{display:getComputedStyle(document.querySelector('#v29-home-layer')).display,hidden:document.querySelector('#v29-home-layer').hidden,aria:document.querySelector('#v29-home-layer').getAttribute('aria-hidden')}:'missing',
      shell:window.__SCHOLARK_WORKSPACE__?.sanitize?.('ci-timeout')||null
    }),cycle);
    throw new Error('Home CTA repeated re-entry '+cycle+' did not settle: '+JSON.stringify(diag));
  }
  await page.waitForTimeout(420);
  await checkWorkspaceSingletons('Home CTA re-entry '+cycle);
}

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
await page.fill('#v107-q','Draft survives route changes');
await page.waitForTimeout(120);
await route('dashboard','#v51-main [data-v51-page="dashboard"].active');
await route('ai','#v107-ai');
check((await page.inputValue('#v107-q'))==='Draft survives route changes','ARKI draft did not survive Workspace remount');
await page.fill('#v107-q','What is 2 + 2?');
await page.click('#v107-send');
await page.waitForFunction(()=>[...document.querySelectorAll('.v107-msg.assistant')].some(x=>/2 \+ 2 = 4|\b4\b/.test(x.textContent||'')),{timeout:5000});
check(await page.evaluate(()=>{try{const a=JSON.parse(localStorage.getItem('scholark_v107_general_ai_chats')||'[]');return a.some(c=>(c.messages||[]).some(m=>m.role==='user'&&m.content==='What is 2 + 2?')&&(c.messages||[]).some(m=>m.role==='assistant'&&/4/.test(m.content||'')))}catch{return false}}),'ARKI chat did not persist both sides of the conversation');
check(await page.locator('[data-v107-copy]').count()>=1,'ARKI copy action missing after response');
await page.click('#v107-new');
check(await page.locator('.v107-welcome').count()===1,'ARKI new chat did not reset the conversation surface');

// Production-like dead-button regression: strip any element-local click handler by
// replacing the Ask button with a clone, and make the old client credit authorize
// call hang forever. ARKI must still send through delegated wiring and server-side
// credit enforcement.
let arkiDelegatedCalls=0;
await page.route('**/api/learning/generate',async route=>{
  const req=route.request();let body={};try{body=JSON.parse(req.postData()||'{}')}catch{}
  if(body.mode!=='general_ai'){await route.continue();return}
  arkiDelegatedCalls++;
  await new Promise(r=>setTimeout(r,120));
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,provider:'ci-delegated-click',model:'arki-remount-test',result:{title:'Delegated',answer:'ARKI delegated click survived the remount.',suggestedFollowUps:['Continue']},usage:{billingMode:'server',serverCharged:false,spent:0}})});
});
await page.evaluate(()=>{
  window.__schArkiDeadButtonOrig={test:window.__SCHOLARK_TEST_MODE__,cloud:window.__SCHOLARK_V72_CLOUD__,credits:window.__SCHOLARK_CREDITS__};
  window.__SCHOLARK_TEST_MODE__=false;
  window.__schArkiAuthorizeCalls=0;
  window.__SCHOLARK_V72_CLOUD__={
    currentSession:()=>({access_token:'fresh-delegated-token',user:{id:'ci-user'}}),
    session:async()=>({access_token:'fresh-delegated-token',user:{id:'ci-user'}}),
    refreshSession:async()=>({access_token:'fresh-delegated-token',user:{id:'ci-user'}}),
    openAuth:()=>{}
  };
  window.__SCHOLARK_CREDITS__={
    authorize:async()=>{window.__schArkiAuthorizeCalls++;return new Promise(()=>{})},
    load:()=>{}
  };
  const old=document.querySelector('#v107-send');
  old.replaceWith(old.cloneNode(true));
});
await page.fill('#v107-q','Test remounted Ask ARKI button');
await page.click('#v107-send');
await page.waitForFunction(()=>document.querySelector('#v107-state')?.textContent?.includes('ARKI')||document.querySelector('#v107-thinking'),null,{timeout:1200});
await page.waitForFunction(()=>[...document.querySelectorAll('.v107-msg.assistant')].some(x=>/delegated click survived/i.test(x.textContent||'')),null,{timeout:5000});
check(arkiDelegatedCalls===1,`Remounted Ask ARKI button should make exactly one AI request, got ${arkiDelegatedCalls}`);
check((await page.evaluate(()=>window.__schArkiAuthorizeCalls))===0,'ARKI still blocked on the legacy client-side credit authorize path');
await page.evaluate(()=>{const o=window.__schArkiDeadButtonOrig;window.__SCHOLARK_TEST_MODE__=o.test;window.__SCHOLARK_V72_CLOUD__=o.cloud;window.__SCHOLARK_CREDITS__=o.credits;delete window.__schArkiDeadButtonOrig;delete window.__schArkiAuthorizeCalls});
await page.unroute('**/api/learning/generate');
await page.click('#v107-new');

// Production-like expired-session regression: the first ARKI request receives
// 401, then the client must force-refresh Supabase auth and replay once with
// the same idempotent request contract.
let arkiAuthCalls=0;
await page.route('**/api/learning/generate',async route=>{
  const req=route.request();let body={};try{body=JSON.parse(req.postData()||'{}')}catch{}
  if(body.mode!=='general_ai'){await route.continue();return}
  arkiAuthCalls++;
  const auth=String(req.headers().authorization||'');
  if(auth==='Bearer stale-arki-token'){
    await route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({ok:false,code:'AUTH_REQUIRED',error:'Session expired'})});return;
  }
  if(auth==='Bearer fresh-arki-token'){
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,provider:'ci-auth-refresh',model:'arki-session-test',result:{title:'Refreshed',answer:'ARKI answered after refreshing the expired session.',suggestedFollowUps:['Continue']},usage:{billingMode:'server',serverCharged:false,spent:0}})});return;
  }
  await route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({ok:false,error:'Unexpected auth token'})});
});
await page.evaluate(()=>{
  window.__schArkiOrig={test:window.__SCHOLARK_TEST_MODE__,cloud:window.__SCHOLARK_V72_CLOUD__,credits:window.__SCHOLARK_CREDITS__};
  let token='stale-arki-token';
  window.__schArkiRefreshes=0;
  window.__SCHOLARK_TEST_MODE__=false;
  window.__SCHOLARK_V72_CLOUD__={
    currentSession:()=>({access_token:token,user:{id:'ci-user'}}),
    session:async()=>({access_token:token,user:{id:'ci-user'}}),
    refreshSession:async()=>{window.__schArkiRefreshes++;token='fresh-arki-token';return{access_token:token,user:{id:'ci-user'}}},
    openAuth:()=>{}
  };
  window.__SCHOLARK_CREDITS__={authorize:async()=>{throw new Error('legacy authorize must not block ARKI')},load:()=>{}};
});
await page.fill('#v107-q','Test expired ARKI session');
await page.click('#v107-send');
await page.waitForFunction(()=>[...document.querySelectorAll('.v107-msg.assistant')].some(x=>/answered after refreshing/i.test(x.textContent||'')),{timeout:5000});
check(arkiAuthCalls===2,`ARKI expired-session recovery should make exactly 2 calls, got ${arkiAuthCalls}`);
check((await page.evaluate(()=>window.__schArkiRefreshes))===1,'ARKI did not force-refresh the expired session exactly once');
check((await page.locator('#v107-state').innerText()).includes('ci-auth-refresh'),'ARKI did not settle on the successful retry response');
await page.evaluate(()=>{const o=window.__schArkiOrig;window.__SCHOLARK_TEST_MODE__=o.test;window.__SCHOLARK_V72_CLOUD__=o.cloud;window.__SCHOLARK_CREDITS__=o.credits;delete window.__schArkiOrig;delete window.__schArkiRefreshes});
await page.unroute('**/api/learning/generate');

// Shared Workspace AI foundation must recover an expired session for every
// connected learning feature, not only ARKI.
let sharedAiCalls=0;
await page.route('**/api/learning/generate',async route=>{
  const req=route.request();let body={};try{body=JSON.parse(req.postData()||'{}')}catch{}
  if(body.mode!=='tutor'){await route.continue();return}
  sharedAiCalls++;
  const auth=String(req.headers().authorization||'');
  if(auth==='Bearer stale-shared-token'){
    await route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({ok:false,code:'AUTH_REQUIRED',error:'Expired'})});return;
  }
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,provider:'ci-shared-auth',model:'shared-ai-test',result:{answer:'Shared AI foundation recovered.',summary:'',steps:[],examples:[],keyPoints:[],commonMistakes:[],checks:[],followUp:'',topic:'test'},usage:{billingMode:'server',serverCharged:false,spent:0}})});
});
const sharedResult=await page.evaluate(async()=>{
  window.__schSharedOrig={test:window.__SCHOLARK_TEST_MODE__,cloud:window.__SCHOLARK_V72_CLOUD__,credits:window.__SCHOLARK_CREDITS__};
  let token='stale-shared-token';window.__schSharedRefreshes=0;
  window.__SCHOLARK_TEST_MODE__=false;
  window.__SCHOLARK_V72_CLOUD__={
    currentSession:()=>({access_token:token,user:{id:'ci-user'}}),
    session:async()=>({access_token:token,user:{id:'ci-user'}}),
    refreshSession:async()=>{window.__schSharedRefreshes++;token='fresh-shared-token';return{access_token:token,user:{id:'ci-user'}}},
    openAuth:()=>{}
  };
  window.__SCHOLARK_CREDITS__={authorize:async()=>({ok:true,cost:1,balance:100}),load:()=>{}};
  return window.__SCHOLARK_WORKSPACE_CORE__.ai.request('tutor',{prompt:'Shared auth test'},{timeoutMs:5000});
});
check(sharedResult?.result?.answer==='Shared AI foundation recovered.','Shared Workspace AI foundation did not return the retried response');
check(sharedAiCalls===2,`Shared AI auth recovery should make exactly 2 calls, got ${sharedAiCalls}`);
check((await page.evaluate(()=>window.__schSharedRefreshes))===1,'Shared Workspace AI foundation did not refresh exactly once');
await page.evaluate(()=>{const o=window.__schSharedOrig;window.__SCHOLARK_TEST_MODE__=o.test;window.__SCHOLARK_V72_CLOUD__=o.cloud;window.__SCHOLARK_CREDITS__=o.credits;delete window.__schSharedOrig;delete window.__schSharedRefreshes});
await page.unroute('**/api/learning/generate');

await route('tutor','#v51-fallback .v52-tool');
check(await page.locator('#v52-tutor-q').count()===1,'AI Tutor input missing');
await page.fill('#v52-tutor-q','Explain photosynthesis in one sentence.');
await page.click('#v52-tutor-send');
check((await page.locator('.v52-msg.user').count())===1,'AI Tutor did not accept a user question');
check((await page.locator('.v52-msg.ai').count())>=2,'AI Tutor did not prepare a response state');

await route('education','#v51-fallback .v52-tool');
try{
  await page.waitForSelector('#v51-fallback .v52-tool[data-v52-tool="education"] [data-edu="mastery"]',{state:'visible',timeout:5000});
}catch(e){
  const diag=await page.evaluate(()=>({
    hash:location.hash,
    active:window.__SCHOLARK_WORKSPACE__?.active?.(),
    fallback:String(document.querySelector('#v51-fallback')?.innerText||'').replace(/\s+/g,' ').slice(0,500),
    fastTool:document.querySelector('#v51-fallback .v52-tool')?.dataset?.v52Tool||'',
    fastApi:!!window.__SCHOLARK_V52_FAST__,
    shell:window.__SCHOLARK_WORKSPACE__?.sanitize?.('education-ci-timeout')||null
  }));
  throw new Error('Education route did not settle on its own surface: '+JSON.stringify(diag));
}
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
await page.locator('#v86-files').setInputFiles({name:'scholark-notes.txt',mimeType:'text/plain',buffer:Buffer.from('Photosynthesis converts light energy into chemical energy. Chlorophyll absorbs light and plants use carbon dioxide and water to make glucose and oxygen.')});
await page.waitForFunction(()=>/readable file/i.test(document.querySelector('#v86-status')?.textContent||''),null,{timeout:5000});
await page.click('[data-v86="summary"]');
await page.waitForFunction(()=>{const t=document.querySelector('#v86-output')?.textContent||'';return !/Working/.test(t)&&t.trim().length>20},{timeout:8000});
check((await page.locator('#v86-output').innerText()).trim().length>20,'Files & Notes AI result stayed empty');
check((await page.evaluate(()=>window.__SCHOLARK_V86_FILES__?.getState?.().files?.length))===1,'Files & Notes did not retain exactly one uploaded smoke file');
await route('project','#v51-fallback .v64-projects');
await route('schools','#v50-school.open');
// Schools Near Me real-location contract: permission allowed must populate a
// usable country/city, while permission denied must fail soft and preserve the
// manual country + city fallback.
await page.context().grantPermissions(['geolocation'],{origin:base});
await page.context().setGeolocation({latitude:5.8520,longitude:-55.2038});
await page.route('**/api/schools/location',async route=>{
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,display:'Paramaribo, Suriname',country:'Suriname',countryCode:'SR',city:'Paramaribo'})});
});
await page.click('#v50-location-btn');
await page.waitForFunction(()=>/Current location ready/i.test(document.querySelector('#v50-location')?.textContent||''),null,{timeout:5000});
check((await page.inputValue('#v50-country'))==='Suriname','GPS permission allow path did not populate Suriname');
check((await page.inputValue('#v50-city'))==='Paramaribo','GPS permission allow path did not populate Paramaribo');
await page.unroute('**/api/schools/location');
await page.context().clearPermissions();
await page.evaluate(()=>{
  const geo=navigator.geolocation;
  window.__schGeoOriginal=geo?.getCurrentPosition?.bind(geo);
  if(geo)geo.getCurrentPosition=(ok,err)=>queueMicrotask(()=>err?.({code:1,message:'Permission denied'}));
});
await page.click('#v50-location-btn');
await page.waitForFunction(()=>/could not be read/i.test(document.querySelector('#v50-location')?.textContent||''),null,{timeout:3000});
check((await page.locator('#v50-location').innerText()).includes('Enter country + city/area manually.'),'GPS denial did not expose the manual location fallback');
await page.fill('#v50-country','Suriname');
await page.fill('#v50-city','Paramaribo');
check((await page.inputValue('#v50-country'))==='Suriname'&&(await page.inputValue('#v50-city'))==='Paramaribo','Manual location fallback is not usable after GPS denial');
await page.evaluate(()=>{if(window.__schGeoOriginal&&navigator.geolocation)navigator.geolocation.getCurrentPosition=window.__schGeoOriginal;delete window.__schGeoOriginal});

check(await page.locator('#v50-level').count()===1,'School level selector missing');
check(await page.locator('#v50-name').count()===1,'School-name search field missing');
check(await page.locator('#v50-crossborder').count()===1,'Nearby-country opt-in is missing');
check((await page.locator('#v50-crossborder').isChecked())===false,'Nearby-country search must be opt-in, not default');
const radiusOptions=await page.locator('#v50-radius option').evaluateAll(nodes=>nodes.map(n=>n.value));
check(JSON.stringify(radiusOptions)===JSON.stringify(['auto','25','50','100','150','250']),`Schools Near Me radius options are not capped at 250 km: ${radiusOptions.join(',')}`);
check((await page.inputValue('#v50-radius'))==='auto','Schools Near Me should default to adaptive nearby radius');
await page.waitForTimeout(120);
check((await page.locator('#v50-name').getAttribute('placeholder'))==='Schoolnaam (optioneel)','School-name search placeholder did not localize to Dutch');
const polanenSearch=await page.evaluate(async()=>{
  const r=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country:'Suriname',city:'Paramaribo',name:'J.H.N. Polanen',level:'primary',radius:50})});
  return {status:r.status,data:await r.json().catch(()=>({}))};
});
check(polanenSearch.status===200&&polanenSearch.data?.ok===true,'J.H.N. Polanen API search failed');
check(polanenSearch.data?.strictCountry===true&&polanenSearch.data?.includeNearbyCountries!==true,'Default nearby school search did not preserve the selected country boundary');
const polanenCrossBorder=await page.evaluate(async()=>{
  const r=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country:'Suriname',city:'Paramaribo',name:'J.H.N. Polanen',level:'primary',radius:25,includeNearbyCountries:true})});
  return {status:r.status,data:await r.json().catch(()=>({}))};
});
check(polanenCrossBorder.status===200&&polanenCrossBorder.data?.ok===true,'Cross-border opt-in API search failed');
check(polanenCrossBorder.data?.strictCountry===false&&polanenCrossBorder.data?.includeNearbyCountries===true,'Cross-border opt-in was ignored by the school API');
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
  const r=await fetch('/api/schools/search',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({country:'Suriname',city:'',name:'Scholengemeenschap Moengotapoe',level:'mbo',radius:250})});
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
    firstYearReview:{readinessAreas:['Legal reading','Legal reasoning','Academic writing'],selfCheck:['Can I brief a short case?','Can I identify the issue and rule?','Can I compare two legal arguments?'],commonChallenges:['Heavy reading volume','Applying rules to unfamiliar facts'],beforeYouStart:['Brief three cases','Practice structured legal writing','Build a weekly reading routine']},
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
check(lawStudyText.includes('First-year readiness review')&&lawStudyText.includes('Can I brief a short case?'),'Law Study Ahead first-year readiness review did not render');
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
      firstYearReview:{readinessAreas:['Discrete mathematics','Programming','Computer systems'],selfCheck:['Can I trace a simple algorithm?','Can I debug a short program?','Can I explain binary and memory at a basic level?'],commonChallenges:['Abstract mathematical reasoning','Keeping up with programming practice'],beforeYouStart:['Review logic','Build one small program','Set up a weekly coding routine']},
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
check((await page.locator('#v62-study-results').innerText()).includes('First-year readiness review'),'Advanced Study Ahead first-year readiness review missing');
await page.click('[data-v83-focus-branch="Cybersecurity"]');
check((await page.inputValue('#v62-specialization'))==='Cybersecurity','Study Ahead branch focus did not populate specialization');

// Connected Workspace contract: ARKI must receive compact Files, Study Ahead
// and project context when the user enables workspace context.
await page.evaluate(()=>window.__SCHOLARK_WORKSPACE_CORE__?.actions?.createProject?.({title:'Cybersecurity preparation',subject:'Computer Science',type:'learning',sourceKey:'ci-connected-context'}));
let arkiConnectedContext=null;
await page.route('**/api/learning/generate',async route=>{
  const req=route.request();let body={};try{body=JSON.parse(req.postData()||'{}')}catch{}
  if(body.mode!=='general_ai'){await route.continue();return}
  try{arkiConnectedContext=JSON.parse(body.context||'{}')}catch{arkiConnectedContext={parseError:true,raw:String(body.context||'').slice(0,300)}}
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,provider:'ci-connected-context',model:'arki-context-test',result:{title:'Connected',answer:'I can use your connected SCHOLARK workspace context.',suggestedFollowUps:[]},usage:{billingMode:'test',serverCharged:false,spent:0}})});
});
await route('ai','#v107-ai');
if(!(await page.locator('#v107-context').isChecked()))await page.check('#v107-context');
await page.fill('#v107-q','What should I work on next using my workspace context?');
await page.click('#v107-send');
await page.waitForFunction(()=>[...document.querySelectorAll('.v107-msg.assistant')].some(x=>/connected SCHOLARK workspace context/i.test(x.textContent||'')),null,{timeout:5000});
check(!!arkiConnectedContext&&!arkiConnectedContext.parseError,'ARKI workspace context could not be parsed');
check(Array.isArray(arkiConnectedContext?.files?.names)&&arkiConnectedContext.files.names.includes('scholark-notes.txt'),`ARKI did not receive Files context: ${JSON.stringify(arkiConnectedContext?.files)}`);
check(arkiConnectedContext?.studyAhead?.field==='Computer Science'&&arkiConnectedContext?.studyAhead?.specialization==='Cybersecurity',`ARKI did not receive Study Ahead context: ${JSON.stringify(arkiConnectedContext?.studyAhead)}`);
check(Array.isArray(arkiConnectedContext?.projects)&&arkiConnectedContext.projects.some(x=>x.title==='Cybersecurity preparation'),'ARKI did not receive connected project context');
check(JSON.stringify(arkiConnectedContext).length<5000,'ARKI workspace context exceeded the compact backend context budget');
await page.unroute('**/api/learning/generate');

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

// Representative route-language matrix: exercise changed surfaces under RTL, CJK,
// Indic, African and static-European locales instead of validating Dashboard only.
await page.click('#v51-sidebar [data-v51-tool="schools"]');
await page.waitForSelector('#v50-school.open',{state:'visible',timeout:8000});
for(const code of ['ar','zh','hi','sw','fr']){
  await page.evaluate(async code=>window.__SCHOLARK_I18N__?.changeLanguage?.(code),code);
  await page.waitForFunction(code=>document.documentElement.lang===code&&!document.documentElement.classList.contains('scholark-language-switching')&&!document.querySelector('#v90-language-overlay')?.classList.contains('open'),code,{timeout:7000});
  const s=await page.evaluate(()=>({country:document.querySelectorAll('#v50-country').length,radius:document.querySelectorAll('#v50-radius').length,cross:document.querySelectorAll('#v50-crossborder').length,sw:document.documentElement.scrollWidth,w:innerWidth}));
  check(s.country===1&&s.radius===1&&s.cross===1,`Schools Near Me controls changed/duplicated in ${code}: ${JSON.stringify(s)}`);
  check(s.sw<=s.w+4,`Schools Near Me overflowed after ${code} switch: ${JSON.stringify(s)}`);
}
await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('study'));
await page.waitForSelector('#v51-fallback .v62-study',{state:'visible',timeout:8000});
for(const code of ['ar','zh','hi','sw','fr']){
  await page.evaluate(async code=>window.__SCHOLARK_I18N__?.changeLanguage?.(code),code);
  await page.waitForFunction(code=>document.documentElement.lang===code&&!document.documentElement.classList.contains('scholark-language-switching')&&!document.querySelector('#v90-language-overlay')?.classList.contains('open'),code,{timeout:7000});
  const s=await page.evaluate(()=>({form:document.querySelectorAll('#v62-study-run').length,field:document.querySelectorAll('#v62-field').length,panels:document.querySelectorAll('.v111-live[data-v111-owner]').length,sw:document.documentElement.scrollWidth,w:innerWidth}));
  check(s.form===1&&s.field===1&&s.panels<=1,`Study Ahead controls/panels changed or duplicated in ${code}: ${JSON.stringify(s)}`);
  check(s.sw<=s.w+4,`Study Ahead overflowed after ${code} switch: ${JSON.stringify(s)}`);
}
// Dynamic-language re-entry regression: keep Arabic active while leaving and
// immediately re-entering the Workspace. Locale ownership and singletons must
// survive the full document route lifecycle.
await page.evaluate(async()=>window.__SCHOLARK_I18N__?.changeLanguage?.('ar'));
await page.waitForFunction(()=>document.documentElement.lang==='ar'&&document.documentElement.dir==='rtl'&&document.documentElement.dataset.scholarkI18nReady==='ar'&&!document.documentElement.classList.contains('scholark-language-switching'),null,{timeout:8000});
await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:30000});
await page.waitForSelector('#v55-topbar',{state:'visible',timeout:10000});
await page.waitForFunction(()=>document.documentElement.lang==='ar'&&document.documentElement.dir==='rtl'&&document.documentElement.dataset.scholarkI18nReady==='ar',null,{timeout:9000});
await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:30000});
await page.waitForSelector('#v51-main [data-v51-page="dashboard"].active',{state:'visible',timeout:10000});
await page.waitForFunction(()=>document.documentElement.lang==='ar'&&document.documentElement.dir==='rtl'&&document.documentElement.dataset.scholarkI18nReady==='ar'&&!document.documentElement.classList.contains('scholark-workspace-entering')&&!document.documentElement.classList.contains('scholark-language-switching'),null,{timeout:10000});
const rtlReentry=await checkWorkspaceSingletons('Arabic language re-entry');
check(rtlReentry.idCounts['v51-main']===1&&rtlReentry.idCounts['v51-sidebar']===1&&rtlReentry.duplicateTools.length===0,`Arabic re-entry duplicated Workspace: ${JSON.stringify(rtlReentry)}`);
check(await page.locator('#v90-language').inputValue()==='ar','Arabic language selector state was lost after Home/Workspace re-entry');

await page.evaluate(async()=>window.__SCHOLARK_I18N__?.changeLanguage?.('nl'));
await page.waitForFunction(()=>document.documentElement.lang==='nl'&&!document.documentElement.classList.contains('scholark-language-switching'),null,{timeout:7000});
await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('dashboard'));
await page.waitForSelector('#v51-main [data-v51-page="dashboard"].active',{state:'visible',timeout:8000});

// Deliberately remove the Help action once. V51 must repair only the canonical
// topbar, then V116 must re-wrap Help & Support without duplicating Workspace.
await page.evaluate(()=>document.querySelector('#v51-help')?.remove());
await page.waitForFunction(()=>{
  const top=document.querySelector('#v51-top-actions');
  return top?.dataset.v51TopActionsReady==='1'&&!!top.querySelector('#v51-help')&&!!top.querySelector('#v51-account')&&!!top.querySelector('#v51-home');
},null,{timeout:5000});
await page.waitForFunction(()=>!!document.querySelector('#v51-top-actions #v116-workspace-help #v51-help'),null,{timeout:5000});
await page.waitForTimeout(140);

check(await page.locator('#v51-top-actions').count()===1,'Workspace topbar actions missing');
check(await page.locator('#v55-topbar').count()===0,'Public/Home topbar leaked into Workspace');
check(await page.locator('#v51-top-actions #v51-help').count()===1,'Workspace Help & Support action missing');
check(await page.locator('#v51-top-actions #v51-account').count()===1,'Workspace Account action missing');
check(await page.locator('#v51-top-actions #v51-home').count()===1,'Workspace Return to homepage action missing');
check(await page.locator('#v51-sidebar .v116-side-actions').count()===0,'Legacy Workspace sidebar support/privacy controls remain');
check(await page.locator('#v51-help').getAttribute('aria-expanded')==='false','Workspace Help & Support should start closed');
await page.click('#v51-help');
check(await page.locator('#v116-workspace-help').evaluate(el=>el.classList.contains('open')),'Workspace Help & Support menu did not open');
check(await page.locator('#v116-workspace-help [data-v116-help-action]').count()===4,'Help & Support menu should contain Support, Feedback, Privacy & Terms and Service status');
const helpText=(await page.locator('#v116-workspace-help .v116-help-menu').innerText()).replace(/\s+/g,' ');
check(/Support/i.test(helpText)&&/Feedback/i.test(helpText)&&/Privacy\s*&\s*Terms/i.test(helpText)&&/Service status/i.test(helpText),'Help & Support menu content is incomplete');
await page.keyboard.press('Escape');
check(!(await page.locator('#v116-workspace-help').evaluate(el=>el.classList.contains('open'))),'Workspace Help & Support menu did not close with Escape');
const standaloneSignout=await page.evaluate(()=>[...document.querySelectorAll('button,a,[role="button"]')].filter(el=>!el.closest('#v89-account,#v72-modal,#v116-workspace-help')&&/^(sign\s*out|log\s*out|logout|uitloggen)$/i.test((el.textContent||'').trim())).length);
check(standaloneSignout===0,'Standalone Sign out remains in Workspace topbar');
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
  await mobile.waitForFunction(()=>document.querySelectorAll('.v116-public-help-toggle').length===1,null,{timeout:5000});
  const homeMobile=await mobile.evaluate(()=>({sw:document.documentElement.scrollWidth,w:innerWidth,topLevelHelp:document.querySelectorAll('.v116-public-help-toggle').length,helpItems:document.querySelectorAll('.v116-public-help-menu [data-v116-public-help]').length,topbars:[...document.querySelectorAll('#v55-topbar,#v51-top-actions,.v117-storebar')].filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'}).length}));
  check(homeMobile.sw<=homeMobile.w+4,`Mobile homepage has horizontal overflow: ${JSON.stringify(homeMobile)}`);
  check(homeMobile.topLevelHelp===1&&homeMobile.helpItems===4,'Mobile Help & Support grouping is incomplete');
  check(homeMobile.topbars===1,'Mobile Home shows multiple topbar surfaces');
  await mobile.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:30000});
  await mobile.waitForSelector('#v51-main [data-v51-page="dashboard"].active',{state:'visible',timeout:10000});
  await mobile.waitForFunction(()=>!document.documentElement.classList.contains('scholark-workspace-entering'),null,{timeout:6000});
  const mobileState=await mobile.evaluate(()=>{
    const visibleButtons=[...document.querySelectorAll('#v51-main [data-v51-page="dashboard"].active button,#v51-top-actions button')].filter(x=>{const r=x.getBoundingClientRect(),cs=getComputedStyle(x);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'}).map(x=>({text:(x.textContent||'').trim().slice(0,40),h:x.getBoundingClientRect().height}));
    const main=document.querySelector('#v51-main'),h1=document.querySelector('#v51-main [data-v51-page="dashboard"].active .v51-head h1');
    return {sw:document.documentElement.scrollWidth,w:innerWidth,mainVisible:main?getComputedStyle(main).visibility:'',titleFont:h1?parseFloat(getComputedStyle(h1).fontSize):0,smallTargets:visibleButtons.filter(x=>x.h<42).slice(0,10)};
  });
  check(mobileState.sw<=mobileState.w+4,`Mobile Workspace has horizontal overflow: ${JSON.stringify(mobileState)}`);
  check(mobileState.mainVisible!=='hidden'&&mobileState.titleFont<=60,'Mobile Workspace did not settle cleanly');
  check(mobileState.smallTargets.length===0,`Touch targets below ~44px remain: ${JSON.stringify(mobileState.smallTargets)}`);
  timings.push(['mobile-touch-pass',0]);
}catch(e){failures.push('Mobile/touch QA threw '+String(e?.message||e))}finally{await mobileContext.close()}

// Responsive regression matrix for changed full-screen/workspace surfaces.
for(const cfg of [
  {name:'tablet',width:820,height:1180,touch:true},
  {name:'compact-laptop',width:1280,height:720,touch:false}
]){
  const ctx=await browser.newContext({viewport:{width:cfg.width,height:cfg.height},hasTouch:cfg.touch});
  const p=await ctx.newPage();
  await p.addInitScript(()=>{localStorage.setItem('scholark_ui_language','nl');localStorage.setItem('scholark_country','Suriname');localStorage.setItem('scholark_learning_level','secondary')});
  try{
    await p.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:30000});
    await p.waitForSelector('#v51-main [data-v51-page="dashboard"].active',{state:'visible',timeout:10000});
    await p.waitForFunction(()=>!document.documentElement.classList.contains('scholark-workspace-entering'),null,{timeout:6000});
    const baseLayout=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,w:innerWidth,main:document.querySelectorAll('#v51-main').length,sidebar:document.querySelectorAll('#v51-sidebar').length}));
    check(baseLayout.sw<=baseLayout.w+4,`${cfg.name} dashboard has horizontal overflow: ${JSON.stringify(baseLayout)}`);
    check(baseLayout.main===1&&baseLayout.sidebar===1,`${cfg.name} dashboard duplicated Workspace shell`);

    await p.click('#v51-sidebar [data-v51-tool="schools"]');
    await p.waitForSelector('#v50-school.open',{state:'visible',timeout:10000});
    const schoolLayout=await p.evaluate(()=>{
      const el=document.querySelector('#v50-school'),box=el?.querySelector('.v50-box'),r=box?.getBoundingClientRect();
      return {doc:document.documentElement.scrollWidth,w:innerWidth,school:el?.scrollWidth||0,client:el?.clientWidth||0,boxRight:r?.right||0,cross:document.querySelectorAll('#v50-crossborder').length,radius:document.querySelectorAll('#v50-radius').length};
    });
    check(schoolLayout.doc<=schoolLayout.w+4&&schoolLayout.school<=schoolLayout.client+4&&schoolLayout.boxRight<=schoolLayout.w+4,`${cfg.name} Schools Near Me overflows: ${JSON.stringify(schoolLayout)}`);
    check(schoolLayout.cross===1&&schoolLayout.radius===1,`${cfg.name} Schools Near Me controls duplicated or missing`);

    await p.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('study'));
    await p.waitForSelector('#v51-fallback .v62-study',{state:'visible',timeout:10000});
    const studyLayout=await p.evaluate(()=>{
      const el=document.querySelector('#v51-fallback .v62-study'),r=el?.getBoundingClientRect();
      return {doc:document.documentElement.scrollWidth,w:innerWidth,right:r?.right||0,forms:document.querySelectorAll('#v62-study-run').length,experience:document.querySelectorAll('.v111-live[data-v111-owner]').length};
    });
    check(studyLayout.doc<=studyLayout.w+4&&studyLayout.right<=studyLayout.w+4,`${cfg.name} Study Ahead overflows: ${JSON.stringify(studyLayout)}`);
    check(studyLayout.forms===1&&studyLayout.experience<=1,`${cfg.name} Study Ahead duplicated controls/panels: ${JSON.stringify(studyLayout)}`);
    timings.push([cfg.name+'-responsive-pass',0]);
  }catch(e){failures.push(cfg.name+' responsive QA threw '+String(e?.message||e))}finally{await ctx.close()}
}

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
