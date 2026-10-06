import { chromium } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const failures=[];
const check=(cond,msg)=>{if(!cond)failures.push(msg)};

try{
  const page=await browser.newPage({viewport:{width:1365,height:900}});
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e?.message||e)));
  page.on('console',m=>{if(m.type()==='error'&&/Uncaught|TypeError|ReferenceError/i.test(m.text()))pageErrors.push(m.text())});

  await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.__SCHOLARK_RUNTIME__&&window.__SCHOLARK_R218__,{timeout:15000});

  const home=await page.evaluate(()=>({
    release:window.__SCHOLARK_R218__?.release,
    polish:document.documentElement.dataset.scholarkPolish,
    storeClass:document.documentElement.classList.contains('scholark-r218-store'),
    runtimeVersion:window.__SCHOLARK_RUNTIME__?.version,
    preloadCap:window.__SCHOLARK_RUNTIME__?.preloadCap,
    yieldEvery:window.__SCHOLARK_RUNTIME__?.yieldEvery,
    style:!!document.querySelector('#scholark-v119-style')
  }));
  check(home.release==='r218','r218 polish API missing');
  check(home.polish==='r218'&&home.style,'r218 stylesheet not mounted');
  check(home.storeClass===false,'Store exclusion class incorrectly active on Home');
  check(home.runtimeVersion==='20261006-r218','runtime version is not r218');
  check(home.preloadCap===10&&home.yieldEvery===4,'runtime preload/yield tuning missing');

  await page.evaluate(()=>{location.hash='dashboard'});
  await page.waitForFunction(()=>document.body.classList.contains('v51-workspace')&&window.__SCHOLARK_HARDENING__,{timeout:15000});
  await page.waitForTimeout(350);

  const routes=['ai','tutor','education','planner','focus','flashcards','assignments','progress','goal','language','files','project','schools','study'];
  for(const route of routes){
    await page.evaluate(r=>{location.hash=r},route);
    await page.waitForFunction(r=>String(location.hash||'').replace(/^#/,'')===r,route,{timeout:5000});
    await page.waitForTimeout(180);
    const state=await page.evaluate(()=>({
      mains:document.querySelectorAll('#v51-main').length,
      sides:document.querySelectorAll('#v51-sidebar').length,
      hardening:window.__SCHOLARK_HARDENING__?.verify?.(),
      storeClass:document.documentElement.classList.contains('scholark-r218-store')
    }));
    check(state.mains===1&&state.sides<=1,route+': workspace shell duplicated');
    check(state.hardening?.observerLive===true,route+': foundation observer is not attached to a live root');
    check(state.storeClass===false,route+': Store exclusion class leaked into Workspace');
  }

  await page.evaluate(()=>{location.hash='credit-store'});
  await page.waitForFunction(()=>document.documentElement.classList.contains('scholark-r218-store'),{timeout:5000});
  const store=await page.evaluate(()=>({
    route:String(location.hash||''),
    storeClass:document.documentElement.classList.contains('scholark-r218-store'),
    styleText:document.querySelector('#scholark-v119-style')?.textContent||''
  }));
  check(store.route==='#credit-store'&&store.storeClass,'Credit Store exclusion did not activate');
  check(!/#v117|\.v117/.test(store.styleText),'r218 polish contains Credit Store selectors');

  await page.evaluate(()=>{location.hash='home'});
  await page.waitForFunction(()=>!document.documentElement.classList.contains('scholark-r218-store'),{timeout:5000});
  check(pageErrors.length===0,'browser errors: '+pageErrors.join(' | '));

  console.log('SCHOLARK R218 FOUNDATION/POLISH SMOKE',JSON.stringify({
    ok:failures.length===0,
    routesTested:routes.length,
    runtime:home.runtimeVersion,
    preloadCap:home.preloadCap,
    yieldEvery:home.yieldEvery
  }));
} finally {
  await browser.close();
}

if(failures.length){
  failures.forEach(x=>console.error(' - '+x));
  process.exit(1);
}
