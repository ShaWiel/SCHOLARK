import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const rows=[];
try{
  for(const viewport of [{width:1280,height:820,name:'desktop'},{width:390,height:844,name:'mobile'}]){
    const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
    await context.addInitScript(()=>{
      try{
        localStorage.setItem('scholark_ui_language','nl');
        for(const key of Object.keys(localStorage)){
          if(key.startsWith('scholark_v90_i18n_')&&key.endsWith('_sw'))localStorage.removeItem(key);
        }
      }catch{}
    });
    const page=await context.newPage();
    let intercepted=0;
    await page.route('**/api/learning/generate',async route=>{
      let body={};try{body=route.request().postDataJSON()||{}}catch{}
      if(body?.mode==='translate_ui'){
        intercepted++;
        // Deliberately stall the translation API longer than the desired
        // transition. An aborted request may be closed before this finishes.
        await new Promise(r=>setTimeout(r,2700));
        try{await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({ok:false,error:'simulated slow provider'})})}catch{}
        return;
      }
      await route.continue().catch(()=>{});
    });
    await page.goto(base+'/#home',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>!!window.__SCHOLARK_I18N__,null,{timeout:15000});
    const measured=await page.evaluate(async()=>{
      const api=window.__SCHOLARK_I18N__;
      const t=performance.now();
      await api.changeLanguage('sw');
      const elapsed=performance.now()-t;
      const main=document.querySelector('#v29-home-layer');
      return {elapsed,code:api.code(),ready:document.documentElement.dataset.scholarkI18nReady,overlayOpen:document.querySelector('#v90-language-overlay')?.classList.contains('open'),overlayPointer:getComputedStyle(document.querySelector('#v90-language-overlay')).pointerEvents,homeVisible:!main||getComputedStyle(main).visibility!=='hidden',switching:document.documentElement.classList.contains('scholark-language-switching')};
    });
    assert.equal(measured.code,'sw',viewport.name+': requested language not selected');
    assert.equal(measured.ready,'sw',viewport.name+': language transition did not release');
    assert.ok(measured.elapsed<1700,viewport.name+': language switch blocked '+Math.round(measured.elapsed)+'ms');
    assert.equal(measured.overlayOpen,false,viewport.name+': status indicator remained open');
    assert.equal(measured.overlayPointer,'none',viewport.name+': overlay intercepts input');
    assert.ok(measured.homeVisible&&!measured.switching,viewport.name+': UI hidden or locked after changing language');
    // Ensure the mocked *slow* provider was really requested. A cache-only
    // smoke pass would otherwise give false confidence.
    for(let tries=0;tries<12&&intercepted===0;tries++)await page.waitForTimeout(160);
    assert.ok(intercepted>0,viewport.name+': no delayed translation request was exercised');

    // Switching again before a slow provider returns must abort old work.
    const rapid=await page.evaluate(async()=>{
      const api=window.__SCHOLARK_I18N__;
      const actions=['fr','de','ar','nl'].map((c,i)=>new Promise(resolve=>setTimeout(()=>resolve(api.changeLanguage(c)),i*20)));
      await Promise.all(actions);
      return {code:api.code(),ready:document.documentElement.dataset.scholarkI18nReady,dir:document.documentElement.dir,switching:document.documentElement.classList.contains('scholark-language-switching')};
    });
    assert.equal(rapid.code,'nl',viewport.name+': stale translation overwrote the final selection');
    assert.equal(rapid.ready,'nl',viewport.name+': final locale did not settle');
    assert.equal(rapid.dir,'ltr',viewport.name+': RTL direction persisted');
    assert.equal(rapid.switching,false,viewport.name+': locale switching flag got stuck');

    // Reproduce the prior r274 race deterministically: a second caller waits
    // for an in-progress German switch, then Dutch supersedes it. The old
    // waiter must NOT restart German after its 1.6-second coalescing timeout.
    const coalesced=await page.evaluate(async()=>{
      const api=window.__SCHOLARK_I18N__;
      const original=api.changeLanguage('de');
      const oldWaiter=api.changeLanguage('de');
      await new Promise(resolve=>setTimeout(resolve,70));
      const newest=api.changeLanguage('nl');
      await Promise.all([original,oldWaiter,newest]);
      return {code:api.code(),ready:document.documentElement.dataset.scholarkI18nReady,
        dir:document.documentElement.dir,switching:document.documentElement.classList.contains('scholark-language-switching')};
    });
    assert.equal(coalesced.code,'nl',viewport.name+': old coalesced request reversed the newest language intent');
    assert.equal(coalesced.ready,'nl',viewport.name+': stale waiter replaced final readiness');
    assert.equal(coalesced.dir,'ltr',viewport.name+': stale waiter restored RTL direction');
    assert.equal(coalesced.switching,false,viewport.name+': stale waiter left switching indicator active');
    rows.push({viewport:viewport.name,elapsedMs:Math.round(measured.elapsed),finalCode:coalesced.code,slowRequests:intercepted,staleIntentProtected:true});
    await context.close();
  }
  console.log('SCHOLAVERUM NONBLOCKING LANGUAGE SMOKE PASS',JSON.stringify(rows));
}finally{await browser.close()}
