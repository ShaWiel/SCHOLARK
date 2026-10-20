import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const errs=[];
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'no-preference'});
 const page=await ctx.newPage();page.on('pageerror',e=>errs.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('scholark_ui_language','nl'));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>!!window.__SCHOLAVERUM_R298_CINEMA__&&
   !!document.querySelector('#v298-nav-what')&&
   document.querySelector('.v298-engine-canvas')?.width>0&&
   document.querySelectorAll('#v298-feature-gallery .v298-feature').length===4,null,{timeout:60000});
 assert.equal(await page.locator('.v298-engine').count(),1,'one canonical orbital engine');
 assert.equal(await page.locator('.v296-atom,.v292-sphere-stage').count(),0,'retired sphere not mounted');
 assert.equal(await page.locator('#v298-nav-what').innerText(),'Wat is SCHOLAVERUM','requested Dutch nav label');
 assert.equal(await page.locator('#v280-pricing-slot #v41-home-pricing').count(),1,'pricing cards remain canonical');
 await page.locator('#v298-nav-what').click();
 await page.waitForFunction(()=>window.__SCHOLAVERUM_R298_CINEMA__?.state?.()?.open&&
   document.querySelector('#v298-cinema .v298-story-canvas')?.width>0,null,{timeout:18000});
 const first=await page.evaluate(()=>({
   stage:document.querySelector('#v298-cinema')?.getAttribute('role'),
   modal:document.querySelector('#v298-cinema')?.getAttribute('aria-modal'),
   scenes:window.__SCHOLAVERUM_R298_CINEMA__.state().scenes,
   canvas:[document.querySelector('.v298-story-canvas')?.width,document.querySelector('.v298-story-canvas')?.height],
   step:window.__SCHOLAVERUM_R298_CINEMA__.state().index,
   screen:!!document.querySelector('.v298-story-preview'),
   locked:getComputedStyle(document.body).overflow
 }));
 assert.equal(first.stage,'dialog');assert.equal(first.modal,'true');
 assert.equal(first.scenes,8,'eight dedicated Workspace product scenes');
 assert.equal(first.step,0);assert.ok(first.screen);
 assert.ok(first.canvas[0]>=1400&&first.canvas[1]>=800,'display-resolution browser graphics');
 assert.equal(first.locked,'hidden','the cinematic experience locks background scrolling');
 await page.locator('[data-v298-action=next]').click();
 assert.equal(await page.evaluate(()=>window.__SCHOLAVERUM_R298_CINEMA__.state().index),1);
 assert.ok((await page.locator('.v298-story-preview').innerText()).includes('WORKSPACE'),'Workspace screenshot is a real distinct scene');
 await page.keyboard.press('ArrowRight');
 assert.equal(await page.evaluate(()=>window.__SCHOLAVERUM_R298_CINEMA__.state().index),2);
 await page.locator('[data-v298-action=play]').click();
 assert.equal(await page.evaluate(()=>window.__SCHOLAVERUM_R298_CINEMA__.state().playing),false);
 await page.waitForTimeout(330);
 assert.equal(await page.evaluate(()=>window.__SCHOLAVERUM_R298_CINEMA__.state().index),2,'pause must not advance scenes');
 await page.locator('[data-v298-jump="7"]').click();
 assert.equal(await page.locator('.v298-story-enter').isVisible(),true,'final scene offers direct workspace entry');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#v298-cinema').isVisible(),false);
 assert.equal(await page.evaluate(()=>document.body.style.overflow),'','close restores scroll state');
 await page.setViewportSize({width:390,height:844});
 await page.locator('#v298-nav-what').waitFor({state:'visible'});
 const mobile=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth,nav:document.querySelector('#v298-nav-what')?.getBoundingClientRect().width,gallery:document.querySelectorAll('#v298-feature-gallery .v298-feature').length}));
 assert.ok(mobile.width-mobile.viewport<=8,'mobile homepage has no horizontal overflow: '+JSON.stringify(mobile));
 assert.ok(mobile.nav>70,'cinematic nav must remain accessible on mobile');assert.equal(mobile.gallery,4);
 await page.locator('#v298-nav-what').click();
 assert.equal(await page.locator('#v298-cinema').isVisible(),true);
 const mobileStory=await page.evaluate(()=>({width:document.querySelector('#v298-cinema').scrollWidth,height:document.querySelector('#v298-cinema').scrollHeight,viewport:innerWidth,display:innerHeight}));
 assert.ok(mobileStory.width-mobileStory.viewport<=8,'mobile presentation width must fit');
 await page.locator('[data-v298-action=close]').click();
 assert.equal(await page.locator('#v298-cinema').isVisible(),false);
 await ctx.close();
 const pixelContext=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:2,reducedMotion:'reduce'});
 const high=await pixelContext.newPage();high.on('pageerror',e=>errs.push(e.message));
 await high.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await high.waitForSelector('#v298-nav-what',{state:'visible',timeout:60000});
 await high.locator('#v298-nav-what').click();
 await high.waitForFunction(()=>document.querySelector('.v298-story-canvas')?.width>=3800,null,{timeout:12000});
 const res=await high.evaluate(()=>({
   canvas:[document.querySelector('.v298-story-canvas').width,document.querySelector('.v298-story-canvas').height],
   paused:window.__SCHOLAVERUM_R298_CINEMA__.state().playing,
   emblemAnimation:getComputedStyle(document.querySelector('.v298-core img')).animationName
 }));
 assert.ok(res.canvas[0]>=3800&&res.canvas[1]>=2100,'2x 1080p display creates native ~4K render target: '+res.canvas);
 assert.equal(res.paused,false,'reduced-motion slideshow must not automatically advance');
 assert.equal(res.emblemAnimation,'none','reduced-motion orbital imagery stays static');
 await pixelContext.close();
 assert.deepEqual(errs,[],'new cinematics must have no page errors');
 console.log('PASS r298: nav, 8 cinematic scenes, dialog keyboard control, pause, branding, pricing isolation, mobile and native 4K rendering');
}finally{await browser.close()}
