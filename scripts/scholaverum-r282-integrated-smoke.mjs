import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const origin=process.argv[2]||'http://127.0.0.1:10000';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1360,height:840},reducedMotion:'reduce'});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{
 localStorage.setItem('scholark_ui_language','en');
 localStorage.setItem('scholark_saved_schools_v1',JSON.stringify(['example school one','example school two']));
 localStorage.setItem('scholark_v93_language_lessons',JSON.stringify([
  {id:'tour-test-1',targetCode:'es',kind:'lesson',level:'A1',topic:'Basics',at:Date.now()-3600000},
  {id:'tour-test-2',targetCode:'es',kind:'review',level:'A1',topic:'Exam',at:Date.now()}
 ]));
 window.confirm=()=>true;
});
try{
 await page.goto(origin+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.__SCHOLAVERUM_TOUR__&&document.querySelector('#v280-hero [data-v280-scroll="v280-intro"]'),null,{timeout:60000});
 await page.locator('#v280-hero [data-v280-scroll="v280-intro"]').click();
 await page.waitForFunction(()=>window.__SCHOLAVERUM_TOUR__?.state().running&&
   document.querySelector('#v282-tour')?.hidden===false,null,{timeout:12000});
 assert.match(await page.locator('#v282-heading').innerText(),/learning|SCHOLAVERUM|Welcome/i);
 await page.locator('#v282-tour [data-tour="next"]').click();
 assert.equal(await page.evaluate(()=>window.__SCHOLAVERUM_TOUR__.state().step),1);
 await page.locator('#v282-tour [data-tour="pause"]').click();
 assert.equal(await page.evaluate(()=>window.__SCHOLAVERUM_TOUR__.state().paused),true);
 await page.locator('#v282-tour [data-tour="next"]').click();
 assert.equal(await page.evaluate(()=>window.__SCHOLAVERUM_TOUR__.state().step),2);
 await page.locator('#v282-tour [data-tour="close"]').click();
 assert.equal(await page.locator('#v282-tour').isHidden(),true);
 assert.equal(await page.evaluate(()=>window.__SCHOLAVERUM_TOUR__.state().running),false);

 await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('dashboard')||(location.hash='#dashboard'));
 await page.waitForFunction(()=>location.hash==='#dashboard'&&document.body.classList.contains('v51-workspace')&&
  document.querySelector('#v51-main [data-v51-page="dashboard"].active .v51-grid'),null,{timeout:25000});
 await page.waitForTimeout(600);
 const dashboard=await page.evaluate(()=>{
  const main=document.querySelector('#v51-main'),shell=main?.querySelector('[data-v51-page="dashboard"].active .v51-shell');
  const a=shell?.querySelector('.v51-levels')?.getBoundingClientRect(),b=shell?.querySelector('.v51-head')?.getBoundingClientRect(),c=shell?.querySelector('.v51-grid')?.getBoundingClientRect();
  return {mainCount:document.querySelectorAll('#v51-main').length,
   sidebarCount:document.querySelectorAll('#v51-sidebar').length,
   dashCount:main?.querySelectorAll('[data-v51-page="dashboard"]').length,
   css:[...document.styleSheets].some(s=>s.href?.includes('scholark-v126-workspace-integrity.css')),
   levelBeforeHeading:a&&b?a.bottom<=b.top+15:false,
   headingBeforeGrid:b&&c?b.bottom<=c.top+15:false};
 });
 assert.equal(dashboard.mainCount,1,'one Workspace main');
 assert.equal(dashboard.sidebarCount,1,'one sidebar');
 assert.equal(dashboard.dashCount,1,'one dashboard');
 assert.ok(dashboard.css,'new layout CSS must be served');
 assert.ok(dashboard.levelBeforeHeading,'education-level cards overlap headline');
 assert.ok(dashboard.headingBeforeGrid,'headline overlaps dashboard cards');

 await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('language'));
 await page.waitForFunction(()=>location.hash==='#language'&&window.__SCHOLARK_V93_LANGUAGE__?.openSavedLibrary,null,{timeout:25000});
 await page.evaluate(()=>window.__SCHOLARK_V93_LANGUAGE__.openSavedLibrary());
 await page.waitForSelector('#v93-library-delete-all',{state:'visible',timeout:12000});
 assert.equal(await page.locator('.v93-library-row').count(),2);
 await page.locator('#v93-library-delete-all').click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('scholark_v93_language_lessons')||'[]').length),0);
 assert.equal(await page.locator('.v93-library-row').count(),0);

 await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('schools'));
 await page.waitForFunction(()=>location.hash==='#schools'&&document.querySelector('#v50-saved-btn'),null,{timeout:25000});
 await page.locator('#v50-saved-btn').click();
 assert.equal(await page.locator('#v50-saved-panel [data-v50-remove-saved]').count(),2);
 await page.locator('#v50-saved-panel [data-v50-remove-saved]').first().click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('scholark_saved_schools_v1')||'[]').length),1);
 await page.locator('#v50-clear-saved-btn').click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('scholark_saved_schools_v1')||'[]').length),0);
 assert.deepEqual(errors,[],'no uncaught browser errors');
 console.log('PASS r282 tour, workspace layout isolation, language bulk delete and saved schools controls');
}finally{await browser.close()}
