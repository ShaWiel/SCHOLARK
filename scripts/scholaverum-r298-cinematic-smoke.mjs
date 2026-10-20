import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const errors=[];
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:900}});
 const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>document.querySelector('.v299-planet-canvas')?.width>300&&
 document.querySelectorAll('#v298-feature-gallery .v298-feature').length===4,null,{timeout:60000});
 assert.equal(await page.locator('#v298-nav-what').count(),0,'What is SCHOLAVERUM nav removed');
 assert.equal(await page.locator('#v298-cinema').count(),0,'old modal not mounted');
 assert.equal(await page.locator('[data-v298-action="open"]').count(),0,'no slideshow triggers');
 assert.equal(await page.locator('#v280-pricing-slot #v41-home-pricing').count(),1,'pricing preserved');
 assert.equal(await page.locator('#v298-feature-gallery .v298-feature').count(),4,'feature gallery remains');
 assert.equal(await page.locator('.v302-micro').count(),8,'each feature gets distinctive micro-details');
 assert.equal(await page.locator('.v298-feature').first().getAttribute('aria-current'),'true');
 await page.waitForTimeout(250);
 assert.equal(await page.locator('#v298-feature-gallery .v298-feature').count(),4);
 await page.setViewportSize({width:390,height:844});
 const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,cards:document.querySelectorAll('.v298-feature').length}));
 assert.ok(mobile.overflow<=8,'mobile viewport must fit: '+JSON.stringify(mobile));
 assert.equal(mobile.cards,4);
 const suppressed=await page.evaluate(()=>window.__SCHOLAVERUM_R298_CINEMA__?.open?.());
 assert.equal(suppressed,false,'programmatic open cannot resurrect removed fullscreen story');
 assert.equal(await page.locator('#v298-cinema').count(),0);
 await ctx.close();
 assert.deepEqual(errors,[],'no homepage script errors');
 console.log('PASS r302: public presentation removed, four rich animated homepage feature cards, pricing and mobile');
}finally{await browser.close()}