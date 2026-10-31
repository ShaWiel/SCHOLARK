import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const errors=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const page=await context.newPage();
 page.on('pageerror',err=>errors.push(err.message));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.__SCHOLAVERUM_R303_WORLDS__?.version==='r305-cinematic-worlds-reimagined' &&
  document.querySelectorAll('.v303-world-canvas').length===4,null,{timeout:60000});
 const desktop=await page.evaluate(()=>{
  const grid=document.querySelector('#v298-feature-gallery'),cards=Array.from(grid.children);
  const graphic=cards[0].querySelector('.v298-feature-graphic');
  return{
   columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,
   graphicHeight:graphic.getBoundingClientRect().height,
   cardWidth:cards[0].getBoundingClientRect().width,
   sceneSize:cards.map(card=>[card.querySelector('canvas')?.width,card.querySelector('canvas')?.height]),
   oldDecor:getComputedStyle(cards[0].querySelector('.v298-glass-window')).display,
   worlds:cards.map(card=>card.dataset.v303World),
   release:window.__SCHOLARK_FEATURE_FLAGS__?.release,
  };
 });
 assert.equal(desktop.columns,2,'desktop features must be widescreen 2-column gallery');
 assert.ok(desktop.graphicHeight>=300,'cinematics must be visually dominant, not tiny icons '+desktop.graphicHeight);
 assert.ok(desktop.cardWidth>=420,'feature cards have cinematic horizontal width');
 assert.deepEqual(desktop.worlds,['arki','tutor','language','focus']);
 assert.equal(desktop.oldDecor,'none','old generic glass illustration no longer obscures scenes');
 assert.ok(desktop.sceneSize.every(([w,h])=>w>100&&h>100),'all four worlds render correctly');
 assert.equal(desktop.release,'r305-cinematic-worlds-reimagined');
 const cards=page.locator('#v298-feature-gallery .v298-feature');
 await cards.nth(0).scrollIntoViewIfNeeded();
 await page.waitForTimeout(250);
 const prior=await cards.nth(1).getAttribute('data-v305-last-draw');
 await page.waitForTimeout(460);
 const next=await cards.nth(1).getAttribute('data-v305-last-draw');
 assert.ok(Number(next)>Number(prior),'unselected on-screen worlds must animate instead of remaining frozen');
 await page.locator('[data-v303-world="tutor"]').hover();
 await page.waitForFunction(()=>document.querySelector('[data-v303-world="tutor"]')?.classList.contains('is-active'));
 await page.evaluate(()=>window.__SCHOLAVERUM_R303_WORLDS__.mount());
 assert.equal(await page.locator('.v303-world-canvas').count(),4,'repeated mounts do not duplicate the worlds');
 await context.close();

 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const mp=await mobile.newPage();mp.on('pageerror',err=>errors.push(err.message));
 await mp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await mp.waitForFunction(()=>window.__SCHOLAVERUM_R303_WORLDS__?.state?.()?.canvases===4,null,{timeout:60000});
 const small=await mp.evaluate(()=>{
  const grid=document.querySelector('#v298-feature-gallery');
  return {columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,overflow:document.documentElement.scrollWidth-innerWidth,
   graphics:[...grid.querySelectorAll('.v298-feature-graphic')].map(x=>x.getBoundingClientRect().height)};
 });
 assert.equal(small.columns,1,'mobile cinematics stack instead of turning into tiny tiles');
 assert.ok(small.graphics.every(h=>h>=250),'mobile cinematic illustrations remain substantial');
 assert.ok(small.overflow<=8,'mobile horizontal overflow '+small.overflow);
 await mobile.close();
 assert.deepEqual(errors,[],'no scene rendering errors');
 console.log('PASS r305: two-column cinematic gallery, unique full-frame worlds, simultaneous motion, mobile and stable mounts');
}finally{await browser.close()}
