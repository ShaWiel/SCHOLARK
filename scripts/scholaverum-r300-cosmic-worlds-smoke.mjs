import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const errors=[];
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'no-preference'});
 const page=await ctx.newPage();page.on('pageerror',e=>errors.push(String(e.message)));
 await page.addInitScript(()=>localStorage.setItem('scholark_ui_language','nl'));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.__SCHOLAVERUM_R300_COSMOS__?.state?.()?.frames>0 &&
   document.querySelector('#v300-cosmos-canvas')?.width>1200&&
   document.querySelector('.v299-logo')?.naturalWidth>0,null,{timeout:60000});
 const main=await page.evaluate(()=>{
  const host=document.querySelector('#v280-hero'),bg=document.querySelector('#v300-cosmos-field'),
    logo=document.querySelector('.v299-logo'),planet=document.querySelector('.v299-universe');
  const hr=host.getBoundingClientRect(),br=bg.getBoundingClientRect(),
    state=window.__SCHOLAVERUM_R300_COSMOS__.state();
  return {widthRatio:br.width/hr.width,heightRatio:br.height/hr.height,
    logo:logo?.getAttribute('src'),natural:[logo?.naturalWidth,logo?.naturalHeight],
    old:document.querySelectorAll('.v298-engine,.v296-atom,.v292-sphere-stage').length,
    canvas:[document.querySelector('#v300-cosmos-canvas')?.width,document.querySelector('#v300-cosmos-canvas')?.height],
    planet:!!planet,state,hasPlans:!!document.querySelector('#v280-pricing-slot #v41-home-pricing')};
 });
 assert.ok(main.widthRatio>.99&&main.heightRatio>.99,'nebula covers the entire hero, not only behind planet '+JSON.stringify(main));
 assert.equal(main.logo,'scholaverum-planet-crest-r300.webp','use the exact user-provided new graduation S');
 assert.ok(main.natural[0]>90&&main.natural[1]>110,'brand image decoded successfully');
 assert.equal(main.old,0,'the old hero logo sphere is retired');
 assert.ok(main.planet&&main.hasPlans,'hero and existing plans preserved');
 assert.equal(main.state.scenes,8);
 const asset=await page.request.get(base+'/scholaverum-planet-crest-r300.webp');
 assert.equal(asset.status(),200);assert.match(asset.headers()['content-type']||'',/image\/webp/);
 await page.locator('#v298-nav-what').click();
 await page.waitForFunction(()=>document.querySelector('#v300-story-world')?.width>=1400 &&
   document.querySelector('#v298-cinema')?.dataset.cosmicScene==='vision',null,{timeout:20000});
 const first=await page.evaluate(()=>{
  const c=document.querySelector('#v300-story-world');let x=c.getContext('2d');
  return {size:[c.width,c.height],sample:Array.from(x.getImageData(Math.round(c.width*.73),Math.round(c.height*.44),1,1).data),
  scene:document.querySelector('#v298-cinema').dataset.cosmicScene,screen:!!document.querySelector('.v298-story-preview')};
 });
 assert.equal(first.scene,'vision');assert.ok(first.screen);
 await page.locator('[data-v298-action="next"]').click();
 await page.waitForFunction(()=>document.querySelector('#v298-cinema')?.dataset.cosmicScene==='workspace',null,{timeout:9000});
 const second=await page.evaluate(()=>{
  const c=document.querySelector('#v300-story-world');const d=c.getContext('2d').getImageData(Math.round(c.width*.73),Math.round(c.height*.44),1,1).data;
  return {scene:document.querySelector('#v298-cinema').dataset.cosmicScene,sample:Array.from(d)};
 });
 assert.equal(second.scene,'workspace');
 assert.notDeepEqual(first.sample,second.sample,'each cinematic scene has its own space backdrop');
 await page.locator('[data-v298-jump="4"]').click();
 await page.waitForFunction(()=>document.querySelector('#v298-cinema')?.dataset.cosmicScene==='language',null,{timeout:9000});
 await page.locator('[data-v298-jump="6"]').click();
 await page.waitForFunction(()=>document.querySelector('#v298-cinema')?.dataset.cosmicScene==='schools',null,{timeout:9000});
 await page.keyboard.press('Escape');assert.equal(await page.locator('#v298-cinema').isVisible(),false);
 await page.setViewportSize({width:390,height:844});
 const mob=await page.evaluate(()=>{
  const h=document.querySelector('#v280-hero').getBoundingClientRect(),b=document.querySelector('#v300-cosmos-field').getBoundingClientRect();
  return {ratio:b.width/h.width,overflow:document.documentElement.scrollWidth-innerWidth,logo:document.querySelector('.v299-logo')?.naturalWidth};
 });
 assert.ok(mob.ratio>.99&&mob.overflow<=8&&mob.logo>90,'mobile full hero cosmos and crisp logo without overflow '+JSON.stringify(mob));
 await ctx.close();
 const calm=await browser.newContext({viewport:{width:1200,height:800},reducedMotion:'reduce'});
 const rp=await calm.newPage();rp.on('pageerror',e=>errors.push(String(e.message)));
 await rp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await rp.waitForFunction(()=>window.__SCHOLAVERUM_R300_COSMOS__?.state?.()?.frames>0,null,{timeout:60000});
 const before=await rp.evaluate(()=>window.__SCHOLAVERUM_R300_COSMOS__.state().frames);
 await rp.waitForTimeout(360);
 const after=await rp.evaluate(()=>window.__SCHOLAVERUM_R300_COSMOS__.state().frames);
 assert.equal(after,before,'reduced motion background is static');
 await rp.locator('#v298-nav-what').click();
 await rp.waitForFunction(()=>document.querySelector('#v300-story-world')?.width>900,null,{timeout:15000});
 assert.equal(await rp.locator('.v298-story-preview').evaluate(n=>getComputedStyle(n).transform),'none','reduce presentation 3D motion for accessibility');
 await calm.close();
 assert.deepEqual(errors,[],'no uncaught browser exceptions');
 console.log('PASS r300: full-bleed 3D cosmos, original image logo, eight cinematic worlds, responsive mobile and reduced motion');
}finally{await browser.close()}
