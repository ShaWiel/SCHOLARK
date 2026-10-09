import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const base=String(process.argv[2]||'https://scholark-app-shawiel.onrender.com').replace(/\/$/,'');
const failures=[];
const results=[];
const LANGUAGE_SETTLE_TIMEOUT=22000;
const check=(cond,msg)=>{if(!cond)failures.push(msg);else results.push(msg)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const json=async(path,opts={})=>{
  const r=await fetch(base+path,opts);
  const data=await r.json().catch(()=>({}));
  return {r,data};
};

const localRuntime=readFileSync(new URL('../scholark-runtime-loader.js',import.meta.url),'utf8');
const localVersion=(localRuntime.match(/const VERSION = '([^']+)'/)||[])[1]||'';
const runtimeRes=await fetch(base+'/scholark-runtime-loader.js?live-prelaunch='+Date.now());
const runtimeText=await runtimeRes.text();
const liveVersion=(runtimeText.match(/const VERSION = '([^']+)'/)||[])[1]||'';
check(runtimeRes.ok&&localVersion&&liveVersion===localVersion,'live runtime matches repository release '+localVersion);

const homeRes=await fetch(base+'/?live-prelaunch='+Date.now());
check(homeRes.ok,'live homepage returns HTTP success');
const pushSwRes=await fetch(base+'/scholark-sw.js?live-prelaunch='+Date.now()),pushSwText=await pushSwRes.text();
check(pushSwRes.ok&&pushSwText.includes("addEventListener('push'")&&pushSwText.includes("notificationclick"),'live push service worker is shipped');
const manifestRes=await fetch(base+'/scholark.webmanifest?live-prelaunch='+Date.now()),manifestText=await manifestRes.text();
check(manifestRes.ok&&manifestText.includes('"display": "standalone"')&&manifestText.includes('"start_url": "/#home"'),'live SCHOLARK web manifest is shipped');
const csp=String(homeRes.headers.get('content-security-policy')||'');
check(/frame-ancestors 'none'/.test(csp)&&/base-uri 'self'/.test(csp),'live homepage CSP keeps frame/base protections');

const learningHealth=await json('/api/learning/health');
check(learningHealth.r.ok&&learningHealth.data?.ok===true,'live learning health is green');
check(learningHealth.data?.authRequiredForAI===true,'live AI requires an authenticated SCHOLARK account');
check(learningHealth.data?.generalAi?.sessionRefreshAwareClient===true,'live ARKI session-refresh contract is active');
check(String(learningHealth.r.headers.get('cache-control')||'').includes('no-store'),'live API responses are no-store');

const securityConfig=await json('/api/security/config');
check(securityConfig.r.ok&&securityConfig.data?.turnstile?.enabled===true&&String(securityConfig.data?.turnstile?.siteKey||'').startsWith('0x'),'live Cloudflare Turnstile client configuration is enabled');
const launchHealth=await json('/api/launch/health');
check(launchHealth.r.ok&&launchHealth.data?.foundation?.featureFreeze===true&&launchHealth.data?.readiness?.featureFreeze===true,'live launch feature freeze is active');
check(launchHealth.data?.foundation?.multiAccountSwitching===true&&launchHealth.data?.foundation?.privateProfilePhotos===true&&launchHealth.data?.foundation?.paymentRefundReversal===true,'live prelaunch account/payment capabilities are advertised');

const geminiHealth=await json('/api/gemini/health');
check(geminiHealth.r.ok&&geminiHealth.data?.ok===true&&geminiHealth.data?.configured===true,'live primary AI resilience router is configured');

const accountExport=await json('/api/account/export');
check(accountExport.r.status===401&&accountExport.data?.code==='AUTH_REQUIRED','live account export blocks unauthenticated access');
const accountDelete=await json('/api/account',{method:'DELETE',headers:{'content-type':'application/json'},body:JSON.stringify({confirm:'DELETE'})});
check(accountDelete.r.status===401&&accountDelete.data?.code==='AUTH_REQUIRED','live account deletion blocks unauthenticated access');
const unauthAi=await json('/api/learning/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'general_ai',prompt:'Who owns SCHOLARK?',language:'English'})});
check(unauthAi.r.status===401&&unauthAi.data?.code==='AUTH_REQUIRED','live ARKI API blocks unauthenticated generation');
const crossOrigin=await json('/api/feedback',{method:'POST',headers:{'content-type':'application/json','origin':'https://cross-origin.invalid','sec-fetch-site':'cross-site'},body:JSON.stringify({category:'bug',message:'prelaunch cross-origin smoke'})});
check(crossOrigin.r.status===403&&crossOrigin.data?.code==='CROSS_ORIGIN_BLOCKED','live cross-origin mutation is blocked');

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:1365,height:900}});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e?.message||e)));

  await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForSelector('#v55-topbar',{state:'visible',timeout:15000});
  check(await page.locator('#v55-topbar').count()===1,'live Home mounts one canonical topbar');
  await page.waitForFunction(()=>document.querySelectorAll('#v55-topbar .v85-topbar-credit').length===1,null,{timeout:5000});
  check(await page.locator('#v55-topbar .v85-topbar-credit').count()===1,'live Home exposes one Wallet action');

  await page.click('#v55-topbar .v85-topbar-credit');
  await page.waitForSelector('.v85-topbar-wallet-panel.open',{state:'visible',timeout:5000});
  check(await page.locator('.v85-topbar-wallet-panel').count()===1,'live Wallet opens without duplication');
  await page.keyboard.press('Escape');

  // Representative live locale pass. The full 74-language matrix runs in the
  // release gate; this verifies the real deployed translation lifecycle.
  for(const code of ['nl','en','es','fr','pt','de','ar','hi','zh','ja']){
    console.log('LIVE LOCALE '+code+' start');
    await page.evaluate(c=>{window.__SCHOLARK_I18N__?.changeLanguage?.(c)},code);
    await page.waitForFunction(c=>localStorage.getItem('scholark_ui_language')===c&&document.documentElement.lang===c&&!document.documentElement.classList.contains('scholark-language-switching')&&!document.querySelector('#v90-language-overlay')?.classList.contains('open'),code,{timeout:LANGUAGE_SETTLE_TIMEOUT});
    console.log('LIVE LOCALE '+code+' ready');
    const state=await page.evaluate(()=>({topbars:document.querySelectorAll('#v55-topbar').length,lang:document.documentElement.lang,dir:document.documentElement.dir,sw:document.documentElement.scrollWidth,w:innerWidth}));
    check(state.topbars===1&&state.lang===code,'live locale '+code+' settles without duplicate Home UI');
    check(state.sw<=state.w+6,'live locale '+code+' does not create horizontal overflow');
    if(code==='ar')check(state.dir==='rtl','live Arabic switches document direction to RTL');
  }
  await page.evaluate(()=>{window.__SCHOLARK_I18N__?.changeLanguage?.('nl')});

  await page.evaluate(()=>localStorage.setItem('scholark_remembered_accounts_v1',JSON.stringify([
    {id:'11111111-1111-4111-8111-111111111111',email:'first-account@example.test',displayName:'First Account',avatarPath:'',lastUsedAt:2},
    {id:'22222222-2222-4222-8222-222222222222',email:'second-account@example.test',displayName:'Second Account',avatarPath:'',lastUsedAt:1}
  ])));
  await page.click('#v55-auth');
  await page.waitForSelector('#v72-modal.open',{state:'visible',timeout:5000});
  check(await page.locator('#v72-modal [data-tab="signin"]').count()===1&&await page.locator('#v72-modal [data-tab="signup"]').count()===1,'live auth exposes sign-in and create-account flows');
  check(await page.locator('#v72-modal .v72-remembered-account').count()===2,'live auth exposes remembered-account chooser without storing extra sessions');
  await page.locator('#v72-modal [data-v72-account-email="first-account@example.test"]').click();
  check(await page.locator('#v72-modal input[type="email"]').inputValue()==='first-account@example.test','live remembered-account chooser prefills the selected identity');
  const sentinel='SCHOLARK-LIVE-SMOKE-PASSWORD-NOT-STORED-9x!';
  await page.fill('#v72-modal input[type="email"]','qa-do-not-submit@example.invalid');
  await page.fill('#v72-modal input[type="password"]',sentinel);
  const passwordStored=await page.evaluate(s=>{
    for(const store of [localStorage,sessionStorage]){
      for(let i=0;i<store.length;i++){const k=store.key(i);if(String(store.getItem(k)||'').includes(s))return true}
    }
    return false;
  },sentinel);
  check(passwordStored===false,'live auth does not persist an unsubmitted password in browser storage');
  await page.click('#v72-modal .v72-x');
  await page.evaluate(()=>localStorage.removeItem('scholark_remembered_accounts_v1'));

  await page.click('#v117-credit-store-button');
  await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
  await page.waitForSelector('#v117-credit-store-page',{state:'visible',timeout:8000});
  check(await page.locator('#v117-credit-store-page [data-v117-pack]').count()===6,'live Credit Store exposes six packs');
  check(await page.locator('#v117-store-return-workspace').count()===1,'live Credit Store exposes Return to Workspace');
  await page.click('#v117-store-return-workspace');
  await page.waitForSelector('#v51-main [data-v51-page="dashboard"].active',{state:'visible',timeout:15000});
  check(await page.locator('#v51-main').count()===1&&await page.locator('#v51-sidebar').count()===1,'live Workspace mounts one canonical shell');

  await page.click('#v51-sidebar .v85-wallet');
  await page.waitForSelector('.v85-topbar-wallet-panel.open',{state:'visible',timeout:5000});
  check(await page.locator('.v85-topbar-wallet-panel').count()===1,'live Workspace Wallet opens without duplication');
  await page.keyboard.press('Escape');

  await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('ai'));
  await page.waitForSelector('#v107-ai',{state:'visible',timeout:12000});
  check(await page.locator('#v107-q').count()===1&&await page.locator('#v107-send').count()===1,'live ARKI UI is mounted and Ask action is available');

  await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('language'));
  try{
    await page.waitForSelector('#v51-fallback .v93',{state:'visible',timeout:12000});
  }catch{
    await page.evaluate(()=>{location.hash='#language';window.dispatchEvent(new HashChangeEvent('hashchange'));window.__SCHOLARK_WORKSPACE__?.openTool?.('language')});
    await page.waitForSelector('#v51-fallback .v93',{state:'visible',timeout:12000});
  }
  check(await page.locator('#v93-build').count()===1&&await page.locator('[data-v93-preset]').count()>=5,'live Language Learner is complete');

  await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('reminders'));
  await page.waitForSelector('#v51-fallback .v121',{state:'visible',timeout:12000});
  check(await page.locator('#v51-sidebar [data-v51-tool="reminders"]').count()===1,'live Reminders route is present once');
  check(await page.evaluate(()=>window.__SCHOLARK_NOTIFICATIONS__?.release==='r235-notifications'),'live Reminders runtime is initialized');

  await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('schools'));
  await page.waitForSelector('#v50-school.open',{state:'visible',timeout:12000});
  check(await page.locator('#v50-country').count()===1&&await page.locator('#v50-radius').count()===1,'live Schools Near Me mounts canonical controls');

  // Reproduce the historical locale/re-entry failure against production.
  await page.evaluate(()=>{window.__SCHOLARK_I18N__?.changeLanguage?.('ar')});
  await page.waitForFunction(()=>document.documentElement.lang==='ar'&&document.documentElement.dir==='rtl'&&!document.documentElement.classList.contains('scholark-language-switching'),null,{timeout:LANGUAGE_SETTLE_TIMEOUT});
  await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForSelector('#v55-topbar',{state:'visible',timeout:15000});
  await page.waitForFunction(()=>document.documentElement.lang==='ar'&&document.documentElement.dir==='rtl',null,{timeout:LANGUAGE_SETTLE_TIMEOUT});
  await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForSelector('#v51-main [data-v51-page="dashboard"].active',{state:'visible',timeout:15000});
  await page.waitForFunction(()=>document.documentElement.lang==='ar'&&document.documentElement.dir==='rtl'&&!document.documentElement.classList.contains('scholark-workspace-entering')&&!document.documentElement.classList.contains('scholark-language-switching'),null,{timeout:LANGUAGE_SETTLE_TIMEOUT});
  const reentry=await page.evaluate(()=>({
    main:document.querySelectorAll('#v51-main').length,
    sidebar:document.querySelectorAll('#v51-sidebar').length,
    langbox:document.querySelectorAll('#v51-sidebar .v90-langbox').length,
    wallet:document.querySelectorAll('#v51-sidebar .v85-wallet').length,
    h1:document.querySelectorAll('#v51-main [data-v51-page="dashboard"].active .v51-head h1').length
  }));
  check(reentry.main===1&&reentry.sidebar===1&&reentry.langbox===1&&reentry.wallet===1&&reentry.h1===1,'live Arabic Home/Workspace re-entry remains duplicate-free');
  await page.evaluate(()=>{window.__SCHOLARK_I18N__?.changeLanguage?.('nl')});

  await sleep(300);
  check(pageErrors.filter(x=>/TypeError|ReferenceError|SyntaxError/i.test(x)).length===0,'live browser flow has no uncaught JavaScript errors');
}finally{
  await browser.close();
}

console.log('\nSCHOLARK LIVE PRELAUNCH SMOKE');
for(const r of results)console.log(' ✓ '+r);
if(failures.length){
  console.error('\nSCHOLARK LIVE PRELAUNCH SMOKE FAILED');
  for(const f of failures)console.error(' - '+f);
  process.exit(1);
}
console.log('\nSCHOLARK LIVE PRELAUNCH SMOKE PASS · '+results.length+' checks');
