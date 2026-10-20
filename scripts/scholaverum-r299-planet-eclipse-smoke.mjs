import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const errors=[];
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
 const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>document.querySelector('.v299-planet-canvas')?.width>400 &&
  window.__SCHOLAVERUM_R299_PLANET__?.state?.()?.renderedFrames>0,null,{timeout:60000});
 const initial=await page.evaluate(()=>window.__SCHOLAVERUM_R299_PLANET__.state());
 assert.equal(initial.mounted,true);
 assert.equal(initial.introMs,12000,'desktop plays full twelve-second intro');
 assert.equal(initial.rings,4);
 assert.equal(initial.moons,5);
 assert.ok(initial.canvas[0]>400,'planet rendered in device-scaled canvas');
 assert.equal(await page.locator('.v299-universe').count(),1,'canonical one planet engine');
 assert.equal(await page.locator('.v298-engine,.v296-atom,.v292-sphere-stage').count(),0,'retired spheres removed');
 assert.ok(await page.locator('.v299-skip').isVisible(),'cinematic can be skipped');
 await page.locator('.v299-skip').click();
 await page.waitForFunction(()=>window.__SCHOLAVERUM_R299_PLANET__.state().phase==='idle',null,{timeout:9000});
 assert.equal(await page.locator('.v299-skip').isVisible(),false);
 await page.waitForTimeout(160);
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('scholaverum_eclipse_seen')),'yes','session remembers reveal after skip');
 await page.evaluate(()=>location.hash='#dashboard');
 await page.waitForFunction(()=>!document.body.classList.contains('v280-home-rebuild'),null,{timeout:25000});
 await page.evaluate(()=>location.hash='#home');
 await page.waitForFunction(()=>document.body.classList.contains('v280-home-rebuild')&&
  document.querySelectorAll('.v299-universe').length===1,null,{timeout:25000});
 assert.equal(await page.locator('.v299-universe').count(),1,'SPA return mounts exactly one planet');
 assert.equal(await page.locator('.v298-engine').count(),0,'SPA return cannot resurrect old globe');
 await ctx.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'no-preference'});
 const mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));
 await mp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await mp.waitForFunction(()=>window.__SCHOLAVERUM_R299_PLANET__?.state?.()?.renderedFrames>0,null,{timeout:60000});
 const ms=await mp.evaluate(()=>({state:window.__SCHOLAVERUM_R299_PLANET__.state(),overflow:document.documentElement.scrollWidth-innerWidth,canvas:document.querySelector('.v299-planet-canvas')})); 
 assert.equal(ms.state.introMs,8000,'mobile cinematic intro is shorter');
 assert.ok(ms.state.canvas[0]>250&&ms.state.canvas[0]<1000,'mobile canvas scales reasonably');
 assert.ok(ms.overflow<=8,'mobile hero avoids horizontal overflow: '+ms.overflow);
 await mobile.close();
 const calm=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
 const rp=await calm.newPage();rp.on('pageerror',e=>errors.push(e.message));
 await rp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await rp.waitForFunction(()=>window.__SCHOLAVERUM_R299_PLANET__?.state?.()?.phase==='idle',null,{timeout:60000});
 const still=await rp.evaluate(()=>window.__SCHOLAVERUM_R299_PLANET__.state());
 assert.equal(still.reduced,true);assert.equal(still.phase,'idle','motion preferences skip eclipse reveal');
 const first=still.renderedFrames;await rp.waitForTimeout(300);
 assert.equal((await rp.evaluate(()=>window.__SCHOLAVERUM_R299_PLANET__.state())).renderedFrames,first,'reduced motion stops repeated frames');
 await calm.close();
 assert.deepEqual(errors,[],'planet cinematics must not throw page errors');
 console.log('PASS r299 Knowledge Planet Eclipse: 12s/8s, four rings, five moons, skip, SPA recovery, mobile, reduced motion');
}finally{await browser.close()}
