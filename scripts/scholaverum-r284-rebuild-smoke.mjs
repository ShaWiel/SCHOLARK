import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{
 localStorage.setItem('scholark_ui_language','en');
 window.__r284FlashViolations=[];
 const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0'&&r.width>2&&r.height>2};
 function inspect(){
  const h=location.hash.toLowerCase(),body=document.body;
  if(body&&!document.documentElement.classList.contains('scholark-prepaint')&&getComputedStyle(body).visibility!=='hidden'){
   const retired=document.querySelector('#v29-home-layer>.v29-shell'),old=document.querySelector('#onboarding');
   if(visible(retired)||visible(old))window.__r284FlashViolations.push({hash:h,kind:'retired-home-visible'});
   const main=document.querySelector('#v51-main');
   if(h==='#dashboard'&&body.classList.contains('v51-workspace')&&visible(main)&&getComputedStyle(main).backgroundColor==='rgba(0, 0, 0, 0)')window.__r284FlashViolations.push({hash:h,kind:'transparent-workspace'});
   window.__r284FlashViolations=window.__r284FlashViolations.slice(0,25);
  }
  requestAnimationFrame(inspect);
 }
 requestAnimationFrame(inspect);
});
const ready=async()=>page.waitForFunction(()=>!document.documentElement.classList.contains('scholark-prepaint')&&!document.documentElement.classList.contains('scholark-workspace-entering')&&window.__SCHOLARK_RUNTIME__?.errors?.().length===0,null,{timeout:25000});
const dashboard=async()=>{
 await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__?.openTool?.('dashboard')||(location.hash='#dashboard'));
 await page.waitForFunction(()=>location.hash==='#dashboard'&&document.querySelector('[data-v51-page="dashboard"].active [data-workspace-owner="r284"]'),null,{timeout:20000});
 await ready();
};
const open=async tool=>{
 await page.locator('#v51-sidebar [data-v51-tool="'+tool+'"]').click();
 await page.waitForFunction(t=>location.hash==='#'+t,tool,{timeout:15000});
};
try{
 for(const path of ['/','/index.html','/scholark-runtime-loader.js?v=stale','/scholark-sw.js?v=stale','/scholark-v51-workspace-shell.js']){
  const response=await context.request.get(base+path);
  assert.equal(response.status(),200,path+' must load');
  assert.match(response.headers()['cache-control']||'',/no-store|must-revalidate/,path+' must revalidate');
  assert.doesNotMatch(response.headers()['cache-control']||'',/immutable/,path+' must not remain frozen');
 }
 const asset=await context.request.get(base+'/scholark-v51-workspace-shell.js?v=20261017-r284-workspace-rebuild');
 assert.equal(asset.status(),200,'release-qualified modules must load');
 assert.match(await asset.text(),/data-workspace-owner=\"r284\"/,'release-qualified module must contain the canonical dashboard');

 await page.route('**/scholark-v124-editorial-home.js?*',async route=>{await new Promise(r=>setTimeout(r,650));await route.continue()});
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForSelector('#v280-hero',{state:'visible',timeout:25000});await ready();
 await page.waitForTimeout(850);
 assert.deepEqual(await page.evaluate(()=>window.__r284FlashViolations),[],'cold boot must never paint the retired homepage');
 assert.equal(await page.locator('#scholaverum-home-style').count(),1,'one canonical home stylesheet');
 assert.equal(await page.evaluate(()=>window.__SCHOLARK_V30_DEMO__?.isRunning?.()),false,'retired hidden demo must not keep animating');
 await page.unroute('**/scholark-v124-editorial-home.js?*');
 await page.evaluate(()=>location.hash='#credit-store');
 await page.waitForSelector('#v117-credit-store-page [data-v117-pack="mini"]',{state:'visible',timeout:15000});
 await page.waitForTimeout(700);
 assert.equal(await page.locator('#v117-credit-store-page').evaluate(el=>!!el.dataset.v30LegacyHome||!!el.dataset.v109Quarantined),false,'the live Credit Store must never be classified as retired Home content');
 await page.evaluate(()=>location.hash='#pricing');
 await page.waitForSelector('#v41-home-pricing [data-plan=\"plus\"]',{state:'visible',timeout:15000});
 assert.equal(await page.locator('#v41-home-pricing').evaluate(el=>el.parentElement===document.body),true,'Pricing must not live inside the retired homepage shell');
 await page.evaluate(()=>location.hash='#home');
 await page.waitForSelector('#v280-hero',{state:'visible',timeout:15000});


 await dashboard();
 const check=async()=>{
  const s=await page.evaluate(()=>{
   const main=document.querySelector('#v51-main'),desk=main.querySelector('[data-workspace-owner="r284"]'),head=desk.querySelector('.v51-head').getBoundingClientRect(),compose=desk.querySelector('.v284-composer').getBoundingClientRect(),overview=desk.querySelector('.v284-overview').getBoundingClientRect();
   return{main:document.querySelectorAll('#v51-main').length,sidebar:document.querySelectorAll('#v51-sidebar').length,desk:document.querySelectorAll('[data-workspace-owner="r284"]').length,heads:desk.querySelectorAll('.v51-head').length,cards:desk.querySelectorAll('.v51-card').length,opacity:getComputedStyle(main).backgroundColor,headBeforeCompose:head.bottom<=compose.top+1,composeBeforeOverview:compose.bottom<=overview.top+1,width:main.getBoundingClientRect().width,left:main.getBoundingClientRect().left,viewport:innerWidth,orchestrator:window.__SCHOLARK_V114_ORCHESTRATOR__?.verify?.()};
  });
  assert.equal(s.main,1);assert.equal(s.sidebar,1);assert.equal(s.desk,1);assert.equal(s.heads,1);assert.equal(s.cards,18);
  assert.notEqual(s.opacity,'rgba(0, 0, 0, 0)','the workspace must be opaque');
  assert.ok(s.headBeforeCompose&&s.composeBeforeOverview,'the new dashboard sections must not overlap');
  assert.ok(s.orchestrator?.ok,'the connected foundation must recognize the canonical dashboard');
  return s;
 };
 await check();
 await page.locator('#v284-prompt').fill('Explain opportunity cost using a simple example.');
 await page.locator('#v284-compose').evaluate(el=>el.requestSubmit());
 await page.waitForFunction(()=>location.hash==='#ai'&&document.querySelector('#v107-q')?.value.includes('opportunity cost'),null,{timeout:20000});
 assert.equal(await page.locator('#v107-ai').count(),1,'composer handoff mounts one ARKI');
 await dashboard();
 await page.locator('[data-v284-mode="tutor"]').click();
 await page.locator('#v284-prompt').fill('Help me understand fractions.');
 await page.locator('#v284-compose').evaluate(el=>el.requestSubmit());
 await page.waitForFunction(()=>location.hash==='#tutor'&&document.querySelector('#v52-tutor-q')?.value==='Help me understand fractions.',null,{timeout:25000});
 await dashboard();

 for(const [code,title] of [['nl','Wat ga jij vandaag ontdekken?'],['es','¿Qué descubrirás hoy?'],['en','What will you discover today?']]){
  await page.evaluate(c=>window.__SCHOLARK_I18N__.changeLanguage(c),code);
  await page.waitForFunction(t=>document.querySelector('#v284-title')?.textContent===t,title,{timeout:12000});
  await check();
 }
 await page.locator('.v284-level-picker>summary').click();
 await page.locator('[data-level="vwo"]').click();
 assert.equal(await page.evaluate(()=>localStorage.getItem('scholark_education_track')),'vwo','new level picker retains education behavior');
 await page.locator('.v284-level-picker>summary').click();

 await page.locator('#v284-prompt').fill('Keep this unfinished idea.');
 await page.evaluate(()=>{const root=document.querySelector('[data-workspace-owner="r284"]');root.appendChild(root.querySelector('.v51-head').cloneNode(true))});
 await page.waitForFunction(()=>document.querySelectorAll('[data-workspace-owner="r284"] .v51-head').length===1,null,{timeout:8000});
 assert.equal(await page.locator('#v284-prompt').inputValue(),'Keep this unfinished idea.','structural repair preserves the draft');
 await check();

 for(let i=0;i<4;i++){
  await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__.goHome());
  await page.waitForFunction(()=>location.hash==='#home'&&document.body.classList.contains('v280-home-rebuild'),null,{timeout:10000});
  await dashboard();await check();
 }
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(450);
 const mobile=await check();assert.ok(mobile.width>=300&&mobile.left<=70,'mobile workspace uses the full available width');
 assert.equal(await page.locator('#v284-prompt').evaluate(el=>el.getBoundingClientRect().width>=250),true,'mobile composer remains usable');
 await open('ai');await page.waitForSelector('#v107-ai .v107-compose textarea',{state:'visible',timeout:20000});
 await dashboard();
 await page.evaluate(()=>window.__SCHOLARK_WORKSPACE__.goHome());
 await page.waitForFunction(()=>document.body.classList.contains('v280-home-rebuild'),null,{timeout:10000});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.evaluate(()=>window.__SCHOLAVERUM_TOUR__.start());
 await page.waitForFunction(()=>window.__SCHOLAVERUM_TOUR__.state().running&&!window.__SCHOLAVERUM_TOUR__.state().transitioning,null,{timeout:8000});
 await page.locator('[data-tour="next"]').click();
 await page.waitForFunction(()=>window.__SCHOLAVERUM_TOUR__.state().transitioning,null,{timeout:5000});
 await page.waitForFunction(()=>!window.__SCHOLAVERUM_TOUR__.state().transitioning&&window.__SCHOLAVERUM_TOUR__.state().step===1,null,{timeout:8000});
 await page.locator('[data-tour="next"]').click();
 await page.locator('[data-tour="close"]').click();
 await page.waitForTimeout(1000);
 assert.deepEqual(await page.evaluate(()=>({running:window.__SCHOLAVERUM_TOUR__.state().running,transition:document.body.classList.contains('v284-tour-transition'),animations:document.getAnimations().filter(a=>a.effect?.target?.closest?.('#v282-tour')).length})),{running:false,transition:false,animations:0},'closing mid-transition cleans the presentation');
 assert.deepEqual(await page.evaluate(()=>window.__r284FlashViolations),[],'route, locale and resize stress must never expose a second surface');
 assert.deepEqual(errors,[],'no browser errors during the new user journeys');
 console.log('PASS r284: cache revalidation, cold-boot legacy lock, opaque single Workspace, assistant handoffs, translations, level picker, draft-safe repair, mobile layout and cinematic cancellation');
}catch(error){console.error('r284 diagnostics',await page.evaluate(()=>({hash:location.hash,body:document.body.className,pending:sessionStorage.getItem('scholark_v114_handoff'),tutor:document.querySelector('#v52-tutor-q')?.value,cards:[...document.querySelectorAll('[data-workspace-owner] .v51-card')].map(x=>x.dataset.v51Tool),mode:document.querySelector('[data-v284-mode][aria-pressed=\"true\"]')?.dataset.v284Mode,loaded:window.__SCHOLARK_RUNTIME__?.loaded?.(),errors:window.__r284FlashViolations})));throw error}finally{await browser.close()}
