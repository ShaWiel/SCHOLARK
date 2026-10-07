import { chromium, webkit } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const failures=[];
const results=[];
const check=(cond,msg)=>{if(!cond)failures.push(msg)};
const profiles=[
  {
    name:'iphone-webkit',
    browserType:webkit,
    context:{
      viewport:{width:390,height:844},
      screen:{width:390,height:844},
      deviceScaleFactor:3,
      isMobile:true,
      hasTouch:true,
      userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
    }
  },
  {
    name:'android-chromium',
    browserType:chromium,
    context:{
      viewport:{width:412,height:915},
      screen:{width:412,height:915},
      deviceScaleFactor:2.625,
      isMobile:true,
      hasTouch:true,
      userAgent:'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36'
    }
  }
];

async function visible(page,sel,timeout=8000){
  try{await page.waitForSelector(sel,{state:'visible',timeout});return true}catch{return false}
}
async function noCriticalDupes(page,label){
  const state=await page.evaluate(()=>({
    topbar:document.querySelectorAll('#v55-topbar').length,
    store:document.querySelectorAll('#v117-credit-store-page').length,
    main:document.querySelectorAll('#v51-main').length,
    side:document.querySelectorAll('#v51-sidebar').length,
    topActions:document.querySelectorAll('#v51-top-actions').length,
    sidebarActions:document.querySelectorAll('#v51-sidebar-actions').length,
    workspaceHelp:document.querySelectorAll('#v51-sidebar-actions #v116-workspace-help').length,
    language:document.querySelectorAll('#v55-language').length,
    storeHome:document.querySelectorAll('#v117-store-return-home').length,
    storeWorkspace:document.querySelectorAll('#v117-store-return-workspace').length,
    publicHelp:document.querySelectorAll('#v55-topbar .v116-public-actions').length,
    walletPanel:document.querySelectorAll('.v85-topbar-wallet-panel').length,
    storeBar:document.querySelectorAll('#v117-credit-store-page .v117-storebar').length,
    visibleTopbars:[...document.querySelectorAll('#v55-topbar,#v51-top-actions,.v117-storebar')].filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>0}).length
  }));
  check(Object.entries(state).filter(([k])=>k!=='visibleTopbars').every(([,n])=>n<=1),label+': duplicate critical surface '+JSON.stringify(state));
  check(state.storeBar===0,label+': duplicate internal Credit Store bar '+JSON.stringify(state));
  check(state.topActions===0,label+': obsolete Workspace topbar returned '+JSON.stringify(state));
  check(state.visibleTopbars<=1,label+': multiple visible topbar surfaces '+JSON.stringify(state));
}
async function checkViewport(page,label){
  const state=await page.evaluate(()=>({
    width:innerWidth,
    doc:document.documentElement.scrollWidth,
    body:document.body?.scrollWidth||0,
    touch:matchMedia('(pointer: coarse)').matches,
    topbarWidth:document.querySelector('#v55-topbar')?.getBoundingClientRect().width||0
  }));
  check(state.touch,label+': coarse/touch media query is not active');
  check(Math.max(state.doc,state.body)<=state.width+3,label+': document horizontally overflows mobile viewport '+JSON.stringify(state));
  check(!state.topbarWidth||state.topbarWidth<=state.width+3,label+': topbar exceeds viewport '+JSON.stringify(state));
}
async function geolocationOutcome(page){
  return page.evaluate(()=>new Promise(resolve=>{
    if(!navigator.geolocation)return resolve('unsupported');
    navigator.geolocation.getCurrentPosition(
      p=>resolve({ok:true,lat:Math.round(p.coords.latitude*1000)/1000,lng:Math.round(p.coords.longitude*1000)/1000}),
      e=>resolve({ok:false,code:e.code,message:e.message}),
      {enableHighAccuracy:false,timeout:2500,maximumAge:0}
    );
  }));
}

for(const profile of profiles){
  const browser=await profile.browserType.launch({headless:true});
  try{
    const context=await browser.newContext(profile.context);
    const page=await context.newPage();
    const pageErrors=[];
    page.on('pageerror',e=>pageErrors.push(String(e?.message||e)));
    page.on('console',m=>{if(m.type()==='error'&&/Uncaught|TypeError|ReferenceError|\[SCHOLARK\]/i.test(m.text()))pageErrors.push(m.text())});

    await context.clearPermissions();
    await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForFunction(()=>!document.documentElement.classList.contains('scholark-prepaint'),{timeout:10000}).catch(()=>{});
    check(await visible(page,'#v55-topbar'),profile.name+': homepage topbar missing');
    check(await visible(page,'#v117-credit-store-button'),profile.name+': Credit Store button missing');
    check(await visible(page,'.v116-public-help-toggle',5000),profile.name+': Help & Support toggle missing');
    check(await visible(page,'#v55-topbar .v85-topbar-credit',5000),profile.name+': Wallet topbar action missing');
    const mobileWalletLabel=(await page.locator('#v55-topbar .v85-topbar-credit').innerText()).replace(/\s+/g,' ').trim();
    check(/^\$\s*Wallet$/i.test(mobileWalletLabel)&&!/\d/.test(mobileWalletLabel),profile.name+': topbar should show Wallet instead of a raw credit balance');
    await page.click('#v55-topbar .v85-topbar-credit');
    check(await visible(page,'.v85-topbar-wallet-panel.open',3000),profile.name+': Wallet panel did not open');
    check(await page.locator('.v85-topbar-wallet-panel').count()===1,profile.name+': Wallet panel duplicated');
    await checkViewport(page,profile.name+' wallet');
    await page.keyboard.press('Escape');
    check(await page.locator('.v85-topbar-wallet-panel.open').count()===0,profile.name+': Wallet panel did not close with Escape');

    // Reproduce the mobile remount race repeatedly: a capture listener
    // replaces the clicked Wallet button before SCHOLARK's delegated document
    // handler sees the event. Recovery must be deterministic, not a one-run
    // timing success.
    for(let race=1;race<=3;race++){
      const sabotageEvent=race===1?'pointerdown':'click';
      await page.evaluate(eventType=>{
        const sabotage=e=>{
          const old=e.target?.closest?.('#v55-topbar .v85-topbar-credit');
          if(!old)return;
          const clone=old.cloneNode(true);
          old.replaceWith(clone);
        };
        window.addEventListener(eventType,sabotage,{capture:true,once:true});
      },sabotageEvent);
      await page.click('#v55-topbar .v85-topbar-credit');
      check(await visible(page,'.v85-topbar-wallet-panel.open',3000),profile.name+': Wallet remount-race recovery failed on cycle '+race+' ('+sabotageEvent+')');
      check(await page.locator('.v85-topbar-wallet-panel').count()===1,profile.name+': Wallet remount-race duplicated the panel on cycle '+race);
      await page.keyboard.press('Escape');
      check(await page.locator('.v85-topbar-wallet-panel.open').count()===0,profile.name+': Wallet remount-race did not close on cycle '+race);
    }
    check(await page.locator('.v116-public-help-menu [data-v116-public-help]').count()===4,profile.name+': Help & Support menu items incomplete');
    check(await page.locator('[data-v116-public-support],[data-v116-public-feedback],[data-v116-public-privacy]').count()===0,profile.name+': legacy standalone help actions remain');
    await checkViewport(page,profile.name+' home');
    await noCriticalDupes(page,profile.name+' home');

    const auth='#v55-auth';
    if(await visible(page,auth,3000)){
      await page.click(auth);
      check(await visible(page,'#v72-modal.open',3000),profile.name+': auth modal did not open');
      check(await page.locator('#v72-modal [data-tab="signin"]').count()===1,profile.name+': sign-in tab missing');
      check(await page.locator('#v72-modal [data-tab="signup"]').count()===1,profile.name+': sign-up tab missing');
      await page.click('#v72-modal [data-tab="signup"]');
      check(await page.locator('#v72-modal [data-tab="signup"]').evaluate(el=>el.classList.contains('active')).catch(()=>false),profile.name+': sign-up tab did not activate');
      check(await page.locator('#v72-modal [data-v72-terms]').count()===1,profile.name+': terms consent missing on mobile signup');
      await page.click('#v72-modal .v72-x');
    }

    const language='#v55-language';
    if(await visible(page,language,3000)){
      await page.selectOption(language,'es');
      await page.waitForFunction(()=>localStorage.getItem('scholark_ui_language')==='es',{timeout:5000});
      await page.waitForFunction(()=>!document.querySelector('#v90-language-overlay')?.classList.contains('open'),{timeout:6000}).catch(()=>{});
      check(await page.locator(language).inputValue()==='es',profile.name+': Spanish language switch did not settle');
      await page.selectOption(language,'ar');
      await page.waitForFunction(()=>document.documentElement.lang==='ar'&&document.documentElement.dir==='rtl',{timeout:5000});
      await page.waitForFunction(()=>!document.querySelector('#v90-language-overlay')?.classList.contains('open'),{timeout:6000}).catch(()=>{});
      check(await page.evaluate(()=>document.documentElement.dir==='rtl'),profile.name+': Arabic did not enable RTL');
      await page.selectOption(language,'en');
      await page.waitForFunction(()=>document.documentElement.lang==='en'&&document.documentElement.dir==='ltr',{timeout:5000});
    }

    await page.click('#v117-credit-store-button');
    await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
    check(await visible(page,'#v117-credit-store-page',6000),profile.name+': Credit Store did not open');
    check(await visible(page,'#v117-store-return-home',4000),profile.name+': Store home return missing');
    check(await visible(page,'#v117-store-return-workspace',4000),profile.name+': Store workspace return missing');
    check(await page.locator('#v51-top-actions').count()===0,profile.name+': Workspace topbar leaked into Credit Store');
    check(await page.locator('#v117-credit-store-page .v117-storebar').count()===0,profile.name+': duplicate internal Store bar remains');
    await checkViewport(page,profile.name+' store');
    await noCriticalDupes(page,profile.name+' store');

    await page.goBack();
    await page.waitForFunction(()=>location.hash==='#home',{timeout:5000});
    check(await visible(page,'#v29-home-layer',7000),profile.name+': Back from Store did not recover Home');
    await page.goForward();
    await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
    check(await visible(page,'#v117-credit-store-page',7000),profile.name+': Forward did not recover Store');
    await page.reload({waitUntil:'domcontentloaded',timeout:30000});
    check(await visible(page,'#v117-credit-store-page',9000),profile.name+': Store hard refresh failed');

    await page.click('#v117-store-return-workspace');
    await page.waitForFunction(()=>location.hash==='#dashboard',{timeout:5000});
    check(await visible(page,'#v51-main [data-v51-page="dashboard"].active',12000),profile.name+': Workspace dashboard did not open');
    check(await page.locator('#v51-top-actions').count()===0,profile.name+': Workspace should not have a topbar');
    check(await page.locator('#v55-topbar').count()===0,profile.name+': public topbar leaked into Workspace');
    check(await visible(page,'#v51-sidebar-actions',6000),profile.name+': Workspace sidebar actions missing');
    check(await page.locator('#v51-sidebar-actions #v51-help').count()===1&&await page.locator('#v51-sidebar-actions #v51-account').count()===1&&await page.locator('#v51-sidebar > #v51-home').count()===1&&await page.locator('#v51-sidebar-actions #v51-home').count()===0&&await page.locator('#v51-sidebar .v51-brand + #v51-home').count()===1,profile.name+': Workspace sidebar action ownership incomplete');
    await page.click('#v51-help');
    check(await page.locator('#v116-workspace-help [data-v116-help-action]').count()===4,profile.name+': Help & Support menu is incomplete');
    await page.keyboard.press('Escape');
    const mobileStandaloneSignout=await page.evaluate(()=>[...document.querySelectorAll('button,a,[role="button"]')].filter(el=>!el.closest('#v89-account,#v72-modal,#v116-workspace-help')&&/^(sign\s*out|log\s*out|logout|uitloggen)$/i.test((el.textContent||'').trim())).length);
    check(mobileStandaloneSignout===0,profile.name+': standalone Workspace Sign out remains');
    await checkViewport(page,profile.name+' dashboard');
    await noCriticalDupes(page,profile.name+' dashboard');

    await page.reload({waitUntil:'domcontentloaded',timeout:30000});
    check(await visible(page,'#v51-main [data-v51-page="dashboard"].active',12000),profile.name+': Workspace hard refresh failed');

    locationHash: {
      await page.evaluate(()=>{location.hash='ai'});
      await page.waitForTimeout(900);
      check(await page.locator('#v51-main').count()===1,profile.name+': ARKI route damaged Workspace shell');
      check(pageErrors.length===0,profile.name+': ARKI route emitted browser errors: '+pageErrors.join(' | '));
    }

    await page.evaluate(()=>{location.hash='schools'});
    await page.waitForTimeout(1200);
    check(await page.locator('#v50-school').count()<=1,profile.name+': School finder duplicated');
    const schoolSurface=await page.locator('#v50-school,[data-v51-page="schools"],[data-v51-page="school"]').first().isVisible().catch(()=>false);
    check(schoolSurface,profile.name+': Schools surface did not mount');
    const denied=await geolocationOutcome(page);
    check(denied==='unsupported'||denied?.ok===false,profile.name+': geolocation should be denied before permission grant');
    const manualFallback=await page.evaluate(()=>{
      const root=document.querySelector('#v50-school')||document.querySelector('[data-v51-page="schools"]')||document.querySelector('[data-v51-page="school"]');
      if(!root)return false;
      const controls=[...root.querySelectorAll('input,select,button')].filter(el=>{const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'});
      return controls.length>=2;
    });
    check(manualFallback,profile.name+': Schools manual fallback controls unavailable with GPS denied');

    await context.grantPermissions(['geolocation'],{origin:base});
    await context.setGeolocation({latitude:5.852,longitude:-55.203});
    await page.reload({waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForTimeout(900);
    const allowed=await geolocationOutcome(page);
    check(allowed?.ok===true,profile.name+': geolocation permission grant did not work after permission-state reload');
    check(await page.locator('#v51-main').count()<=1,profile.name+': reload after GPS grant duplicated Workspace');
    await checkViewport(page,profile.name+' schools-gps');

    const tapTargets=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(el=>{
      const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'
    }).slice(0,80).map(el=>({h:el.getBoundingClientRect().height,text:(el.textContent||'').trim().slice(0,40)})));
    const tiny=tapTargets.filter(x=>x.h>0&&x.h<34);
    check(tiny.length===0,profile.name+': found undersized mobile tap targets '+JSON.stringify(tiny.slice(0,8)));

    check(pageErrors.length===0,profile.name+': browser errors: '+pageErrors.join(' | '));
    results.push(profile.name+' PASS');
    await context.close();
  } finally {
    await browser.close();
  }
}

console.log('\nSCHOLARK MOBILE DEVICE EMULATION');
for(const r of results)console.log(' ✓ '+r);
if(failures.length){
  console.error('\nSCHOLARK MOBILE DEVICE EMULATION FAILED');
  failures.forEach(x=>console.error(' - '+x));
  process.exit(1);
}
console.log('SCHOLARK MOBILE DEVICE EMULATION PASS');
