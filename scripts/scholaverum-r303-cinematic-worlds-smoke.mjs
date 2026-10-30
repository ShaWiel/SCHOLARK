import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const errors=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'no-preference'});
 const page=await context.newPage();
 page.on('pageerror',err=>errors.push(err.message));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.__SCHOLAVERUM_R303_WORLDS__?.state?.()?.canvases===4&&
 document.querySelector('#v303-theater-world')?.width>0,null,{timeout:60000});
 assert.equal(await page.locator('.v303-world-canvas').count(),4,'four 3D-like scenes mounted exactly once');
 assert.equal(await page.locator('#v303-theater-world').count(),1,'theater has exactly one world');
 const sample=await page.evaluate(()=>{
  const cards=Array.from(document.querySelectorAll('#v298-feature-gallery .v298-feature'));
  return cards.map(card=>{
   const canvas=card.querySelector('.v303-world-canvas');
   const x=canvas.getContext('2d',{willReadFrequently:true});
   let d=x.getImageData(Math.floor(canvas.width*.45),Math.floor(canvas.height*.5),1,1).data;
   return {key:card.dataset.v303World,width:canvas.width,height:canvas.height,
     pixels:[...d],role:card.getAttribute('role'),tab:card.tabIndex};
  });
 });
 assert.deepEqual(sample.map(s=>s.key),['arki','tutor','language','focus']);
 assert.ok(sample.every(s=>s.width>100&&s.height>100&&s.pixels[3]===255),'all scenes draw opaque real worlds');
 assert.equal(new Set(sample.map(s=>s.pixels.slice(0,3).join(','))).size,4,'four distinct colored world treatments');
 assert.ok(sample.every(s=>s.role==='button'&&s.tab===0),'gallery interactive using keyboard');
 await page.locator('[data-v303-world="tutor"]').hover();
 await page.waitForFunction(()=>document.querySelector('[data-v303-world="tutor"]')?.classList.contains('is-active'),null,{timeout:6000});
 await page.locator('[data-v303-world="language"]').focus();
 await page.waitForFunction(()=>document.querySelector('[data-v303-world="language"]')?.classList.contains('is-active'),null,{timeout:6000});
 await page.locator('#v280-demo').scrollIntoViewIfNeeded();
 await page.locator('[data-v280-tab="tutor"]').click();
 await page.waitForFunction(()=>document.querySelector('#v303-theater-world')?.width>300&&
 document.querySelector('#v280-demo')?.dataset.v303World==='tutor',null,{timeout:15000});
 await page.locator('[data-v280-tab="language"]').click();
 await page.waitForFunction(()=>document.querySelector('#v280-demo')?.dataset.v303World==='language',null,{timeout:15000});
 const previous=await page.evaluate(()=>window.__SCHOLAVERUM_R303_WORLDS__.state().frames);
 await page.waitForTimeout(250);
 assert.ok((await page.evaluate(()=>window.__SCHOLAVERUM_R303_WORLDS__.state().frames))>previous,'visible world moves');
 assert.equal(await page.locator('#v298-nav-what,#v298-cinema').count(),0,'retired presentation must stay removed');
 await page.evaluate(()=>location.hash='#dashboard');
 await page.waitForFunction(()=>!document.body.classList.contains('v280-home-rebuild'),null,{timeout:25000});
 await page.evaluate(()=>location.hash='#home');
 await page.waitForFunction(()=>document.body.classList.contains('v280-home-rebuild') &&
 document.querySelectorAll('.v303-world-canvas').length===4,null,{timeout:30000});
 assert.equal(await page.locator('.v303-world-canvas').count(),4,'route return does not double canvases');
 assert.equal(await page.locator('#v303-theater-world').count(),1,'route return preserves one theater canvas');
 await context.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const mp=await mobile.newPage();mp.on('pageerror',err=>errors.push(err.message));
 await mp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await mp.waitForFunction(()=>window.__SCHOLAVERUM_R303_WORLDS__?.state?.()?.canvases===4,null,{timeout:60000});
 const m=await mp.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,
   size:document.querySelector('.v303-world-canvas')?.width}));
 assert.ok(m.overflow<=8,'mobile full width no overflow '+JSON.stringify(m));
 assert.ok(m.size>70&&m.size<=820,'mobile world canvas has bounded raster size');
 await mobile.close();
 const calm=await browser.newContext({viewport:{width:1200,height:800},reducedMotion:'reduce'});
 const rp=await calm.newPage();rp.on('pageerror',err=>errors.push(err.message));
 await rp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await rp.waitForFunction(()=>window.__SCHOLAVERUM_R303_WORLDS__?.state?.()?.canvases===4,null,{timeout:60000});
 await rp.locator('#v298-discover').scrollIntoViewIfNeeded();await rp.waitForTimeout(450);
 const before=await rp.evaluate(()=>window.__SCHOLAVERUM_R303_WORLDS__.state().frames);
 await rp.waitForTimeout(350);
 assert.equal(await rp.evaluate(()=>window.__SCHOLAVERUM_R303_WORLDS__.state().frames),before,'reduced motion stops loop');
 await calm.close();
 assert.deepEqual(errors,[],'no homepage JavaScript exceptions');
 console.log('PASS r303: four independent cinematic universes, interactive gallery, live theater, route, mobile, reduced motion');
}finally{await browser.close()}
