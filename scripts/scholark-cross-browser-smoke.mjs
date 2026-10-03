import { firefox, webkit } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const failures=[];
const check=(cond,msg)=>{if(!cond)failures.push(msg)};
const engines=[
  {name:'firefox',type:firefox,viewport:{width:1280,height:800},touch:false},
  {name:'webkit-desktop',type:webkit,viewport:{width:1280,height:800},touch:false},
  {name:'webkit-mobile',type:webkit,viewport:{width:390,height:844},touch:true}
];

async function settled(page){
  await page.waitForFunction(()=>!document.documentElement.classList.contains('scholark-workspace-entering')&&!document.documentElement.classList.contains('scholark-language-switching')&&!document.querySelector('#v90-language-overlay')?.classList.contains('open'),null,{timeout:12000});
}
async function shellState(page){
  return page.evaluate(()=>({
    main:document.querySelectorAll('#v51-main').length,
    sidebar:document.querySelectorAll('#v51-sidebar').length,
    home:document.querySelectorAll('#v51-home').length,
    toggle:document.querySelectorAll('#v51-side-toggle').length,
    duplicateTools:[...document.querySelectorAll('#v51-sidebar [data-v51-tool]')].map(x=>x.dataset.v51Tool).filter((x,i,a)=>a.indexOf(x)!==i),
    experience:document.querySelectorAll('.v111-live[data-v111-owner]').length,
    connected:document.querySelectorAll('.v114-connect').length,
    scrollWidth:document.documentElement.scrollWidth,
    width:innerWidth
  }));
}

for(const cfg of engines){
  const browser=await cfg.type.launch({headless:true});
  const context=await browser.newContext({viewport:cfg.viewport,hasTouch:cfg.touch,isMobile:cfg.name==='webkit-mobile'});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e?.message||e)));
  page.on('console',m=>{if(m.type()==='error'&&/Uncaught|TypeError|ReferenceError|\[SCHOLARK\]/i.test(m.text()))pageErrors.push(m.text())});
  await page.addInitScript(()=>{localStorage.setItem('scholark_ui_language','nl');localStorage.setItem('scholark_country','Suriname');localStorage.setItem('scholark_learning_level','secondary')});
  try{
    await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForSelector('#v55-topbar',{state:'visible',timeout:10000});
    check(await page.locator('#v55-topbar').count()===1,cfg.name+': homepage topbar duplicated');
    check(await page.locator('#v117-credit-store-button').count()===1,cfg.name+': Credit Store topbar button missing');
    await page.click('#v117-credit-store-button');
    await page.waitForFunction(()=>location.hash==='#credit-store',{timeout:5000});
    await page.waitForSelector('#v117-credit-store-page',{state:'visible',timeout:8000});
    check(await page.locator('#v117-credit-store-page [data-v117-pack]').count()===6,cfg.name+': Credit Store pack grid incomplete');
    check(await page.locator('#v117-store-dock').count()===0,cfg.name+': legacy Credit Store dock still exists');
    check(await page.locator('#v117-store-return-workspace').count()===1&&await page.locator('#v117-store-return-home').count()===1,cfg.name+': Credit Store return topbar actions missing/duplicated');
    const storeLayout=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,w:innerWidth,topbar:getComputedStyle(document.querySelector('#v55-topbar')).display,home:getComputedStyle(document.querySelector('#v29-home-layer')).display,retHome:getComputedStyle(document.querySelector('#v117-store-return-home')).display,retWorkspace:getComputedStyle(document.querySelector('#v117-store-return-workspace')).display,storeButton:document.querySelector('#v55-topbar #v117-credit-store-button'),account:document.querySelector('#v55-topbar #v55-account'),auth:document.querySelector('#v55-topbar #v55-auth')}));
    check(storeLayout.sw<=storeLayout.w+2,cfg.name+': Credit Store creates horizontal overflow '+JSON.stringify(storeLayout));
    check(storeLayout.topbar!=='none'&&storeLayout.home==='none'&&storeLayout.retHome!=='none'&&storeLayout.retWorkspace!=='none'&&!storeLayout.storeButton&&!storeLayout.account&&!storeLayout.auth,cfg.name+': Credit Store topbar layering is incorrect '+JSON.stringify(storeLayout));
    await page.click('#v117-store-return-home');
    await page.waitForFunction(()=>location.hash==='#home',{timeout:5000});

    await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForSelector('#v51-main [data-v51-page="dashboard"].active',{state:'visible',timeout:12000});
    await settled(page);
    let state=await shellState(page);
    check(state.main===1&&state.sidebar===1&&state.home===1&&state.toggle===1,cfg.name+': Workspace singleton shell failed '+JSON.stringify(state));
    check(state.duplicateTools.length===0,cfg.name+': duplicate sidebar tools '+JSON.stringify(state.duplicateTools));
    check(state.scrollWidth<=state.width+4,cfg.name+': dashboard horizontal overflow '+JSON.stringify(state));

    await page.click('#v51-sidebar [data-v51-tool="ai"]');
    await page.waitForSelector('#v107-ai',{state:'visible',timeout:12000});
    await page.fill('#v107-q','What is 2 + 2?');
    await page.click('#v107-send');
    try{
      await page.waitForFunction(()=>document.querySelector('.v107-msg.assistant')&&!document.querySelector('#v107-thinking'),null,{timeout:15000});
    }catch{}
    const arki=await page.evaluate(()=>({
      replies:[...document.querySelectorAll('.v107-msg.assistant')].map(x=>(x.textContent||'').trim()).slice(-3),
      users:[...document.querySelectorAll('.v107-msg.user')].map(x=>(x.textContent||'').trim()).slice(-3),
      state:document.querySelector('#v107-state')?.textContent||'',
      sendDisabled:!!document.querySelector('#v107-send')?.disabled,
      inputDisabled:!!document.querySelector('#v107-q')?.disabled,
      thinking:!!document.querySelector('#v107-thinking'),
      testMode:!!window.__SCHOLARK_TEST_MODE__,
      runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[]
    }));
    check(arki.replies.some(x=>/\b4\b/.test(x)),cfg.name+': ARKI did not return the expected test answer '+JSON.stringify(arki));
    check(!arki.sendDisabled&&!arki.inputDisabled&&!arki.thinking,cfg.name+': ARKI did not settle its composer '+JSON.stringify(arki));

    const lang=page.locator('#v90-language');
    if(await lang.count()){
      await lang.selectOption('ar');
      await page.waitForFunction(()=>document.documentElement.lang==='ar'&&!document.documentElement.classList.contains('scholark-language-switching'),null,{timeout:10000});
      check((await page.evaluate(()=>document.documentElement.dir))==='rtl',cfg.name+': Arabic did not switch RTL');
      await lang.selectOption('nl');
      await page.waitForFunction(()=>document.documentElement.lang==='nl'&&!document.documentElement.classList.contains('scholark-language-switching'),null,{timeout:10000});
    }

    await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('schools'));
    await page.waitForSelector('#v50-school.open',{state:'visible',timeout:12000});
    const school=await page.evaluate(()=>({
      radius:[...document.querySelectorAll('#v50-radius option')].map(x=>x.value),
      cross:document.querySelectorAll('#v50-crossborder').length,
      crossChecked:document.querySelector('#v50-crossborder')?.checked,
      sw:document.documentElement.scrollWidth,w:innerWidth
    }));
    check(JSON.stringify(school.radius)===JSON.stringify(['auto','25','50','100','150','250']),cfg.name+': school radius contract mismatch '+JSON.stringify(school.radius));
    check(school.cross===1&&school.crossChecked===false,cfg.name+': cross-border opt-in default broken');
    check(school.sw<=school.w+4,cfg.name+': Schools Near Me overflow '+JSON.stringify(school));

    await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('study'));
    await page.waitForSelector('#v51-fallback .v62-study',{state:'visible',timeout:12000});
    const study=await page.evaluate(()=>({form:document.querySelectorAll('#v62-study-run').length,field:document.querySelectorAll('#v62-field').length,sw:document.documentElement.scrollWidth,w:innerWidth}));
    check(study.form===1&&study.field===1,cfg.name+': Study Ahead controls missing/duplicated '+JSON.stringify(study));
    check(study.sw<=study.w+4,cfg.name+': Study Ahead overflow '+JSON.stringify(study));

    // Re-entry regression: repeatedly leave the Workspace and immediately come back.
    for(let i=0;i<4;i++){
      await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:30000});
      await page.waitForSelector('#v55-topbar',{state:'visible',timeout:10000});
      await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:30000});
      await page.waitForSelector('#v51-main [data-v51-page="dashboard"].active',{state:'visible',timeout:12000});
      await settled(page);
      state=await shellState(page);
      check(state.main===1&&state.sidebar===1&&state.home===1&&state.toggle===1&&state.duplicateTools.length===0,cfg.name+': re-entry '+(i+1)+' duplicated Workspace '+JSON.stringify(state));
    }

    await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('files'));
    await page.waitForSelector('#v51-fallback .v86',{state:'visible',timeout:12000});
    await page.waitForTimeout(350);
    const files=await page.evaluate(()=>({
      files:document.querySelectorAll('#v51-fallback .v86').length,
      experience:document.querySelectorAll('.v111-live[data-v111-owner="files"]').length,
      visual:window.__SCHOLARK_V112_VISUAL__?.verify?.(),
      hardening:window.__SCHOLARK_V113_HARDENING__?.verify?.()
    }));
    check(files.files===1&&files.experience<=1,cfg.name+': Files remount duplicated '+JSON.stringify(files));
    check(files.visual?.ok!==false,cfg.name+': Files visual ownership unhealthy '+JSON.stringify(files.visual));
    check(files.hardening?.ok!==false,cfg.name+': Workspace hardening unhealthy '+JSON.stringify(files.hardening));

    check(pageErrors.length===0,cfg.name+': browser errors '+[...new Set(pageErrors)].slice(0,6).join(' | '));
    console.log('✓ '+cfg.name+' critical browser pass');
  }catch(e){
    failures.push(cfg.name+': '+String(e?.stack||e?.message||e));
  }finally{
    await context.close();
    await browser.close();
  }
}

if(failures.length){
  console.error('\nSCHOLARK CROSS-BROWSER SMOKE FAILED');
  failures.forEach(x=>console.error(' - '+x));
  process.exit(1);
}
console.log('\nSCHOLARK CROSS-BROWSER SMOKE PASS');
