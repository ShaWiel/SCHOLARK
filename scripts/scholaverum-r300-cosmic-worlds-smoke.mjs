import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const errors=[];
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.__SCHOLAVERUM_R300_COSMOS__?.state?.()?.frames>0&&
 document.querySelector('#v300-cosmos-canvas')?.width>1200&&document.querySelector('.v299-logo')?.naturalWidth>0,null,{timeout:60000});
 const v=await page.evaluate(()=>{
  const hero=document.querySelector('#v280-hero').getBoundingClientRect(),
    bg=document.querySelector('#v300-cosmos-field').getBoundingClientRect(),
    logo=document.querySelector('.v299-logo');
  return {cover:bg.width/hero.width,vertical:bg.height/hero.height,
   logo:logo.getAttribute('src'),natural:logo.naturalWidth,
   state:window.__SCHOLAVERUM_R300_COSMOS__.state(),
   old:document.querySelectorAll('.v296-atom,.v292-sphere-stage,.v298-engine').length};
 });
 assert.ok(v.cover>.99&&v.vertical>.99,'cinematic nebula must cover complete hero');
 assert.equal(v.logo,'scholaverum-planet-crest-r300.webp');
 assert.ok(v.natural>90);assert.equal(v.old,0);
 assert.deepEqual(v.state.cosmicDetails,{distantPlanets:2,meteors:4,rocket:1,satellites:2});
 assert.equal(await page.locator('#v298-nav-what').count(),0,'fullscreen presentation removed');
 assert.equal(await page.locator('#v298-cinema').count(),0,'removed story never mounts');
 await page.setViewportSize({width:390,height:844});
 const m=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,width:document.querySelector('#v300-cosmos-field').getBoundingClientRect().width,hero:document.querySelector('#v280-hero').getBoundingClientRect().width}));
 assert.ok(m.overflow<=8&&m.width/m.hero>.99,'mobile full-bleed nebula');
 await ctx.close();
 const still=await browser.newContext({viewport:{width:1200,height:800},reducedMotion:'reduce'});
 const rp=await still.newPage();rp.on('pageerror',e=>errors.push(e.message));
 await rp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await rp.waitForFunction(()=>window.__SCHOLAVERUM_R300_COSMOS__?.state?.()?.frames>0,null,{timeout:60000});
 const before=await rp.evaluate(()=>window.__SCHOLAVERUM_R300_COSMOS__.state().frames);
 await rp.waitForTimeout(300);
 assert.equal(await rp.evaluate(()=>window.__SCHOLAVERUM_R300_COSMOS__.state().frames),before,'reduced motion is static');
 await still.close();assert.deepEqual(errors,[]);
 console.log('PASS r302 full-width nebula, distant planets, meteors, rocket, satellites, mobile and reduced motion');
}finally{await browser.close()}