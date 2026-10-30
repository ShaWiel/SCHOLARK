import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const errors=[];
const sample=async page=>page.evaluate(()=>{
 const c=document.querySelector('#v303-theater-world');
 if(!c||!c.width||!c.height)return null;
 const ctx=c.getContext('2d',{willReadFrequently:true}),pixels=[];
 for(const [x,y] of [[.35,.35],[.5,.5],[.6,.6],[.42,.7]]){
  const p=ctx.getImageData(Math.round(c.width*x),Math.round(c.height*y),1,1).data;
  pixels.push(...Array.from(p));
 }
 return pixels;
});
try{
 const context=await browser.newContext({viewport:{width:1360,height:900}});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.__SCHOLAVERUM_R303_WORLDS__?.state?.()?.canvases===4 &&
  document.querySelector('#v303-theater-world')?.width>0,null,{timeout:60000});
 assert.equal(await page.evaluate(()=>window.__SCHOLAVERUM_R303_WORLDS__.version),
  'r304-cinematic-depth-stability','new cinematic engine active');
 assert.equal(await page.locator('.v303-world-canvas').count(),4);
 const mountsBefore=await page.evaluate(()=>window.__SCHOLAVERUM_R303_WORLDS__.state().mounts);
 await page.evaluate(()=>{for(let i=0;i<4;i++)window.__SCHOLAVERUM_R303_WORLDS__.mount()});
 assert.equal(await page.evaluate(()=>window.__SCHOLAVERUM_R303_WORLDS__.state().mounts),
  mountsBefore,'repeated mount must never add extra handlers');
 assert.equal(await page.locator('#v303-theater-world').count(),1);
 await page.locator('[data-v303-world="tutor"]').hover();
 await page.waitForFunction(()=>document.querySelector('[data-v303-world="tutor"]')?.classList.contains('is-active'));
 await page.waitForTimeout(6100);
 assert.equal(await page.locator('[data-v303-world="tutor"].is-active').count(),1,
  'auto-rotation must not override deliberate hover');
 await page.locator('#v280-demo').scrollIntoViewIfNeeded();
 await page.locator('[data-v280-tab="language"]').click();
 await page.waitForFunction(()=>document.querySelector('#v280-demo')?.dataset.v303World==='language');
 const language=await sample(page);
 await page.locator('[data-v280-tab="schools"]').click();
 await page.waitForFunction(()=>document.querySelector('#v280-demo')?.dataset.v303World==='schools');
 await page.waitForTimeout(130);
 const schools=await sample(page);
 assert.ok(language&&schools&&language.some((v,i)=>Math.abs(v-schools[i])>8),
  'schools and languages must be visually distinct world scenes');
 await page.setViewportSize({width:1190,height:850});
 await page.waitForTimeout(500);
 assert.equal(await page.locator('.v303-world-canvas').count(),4,'resize retains one canvas per card');
 assert.ok(await page.evaluate(()=>Array.from(document.querySelectorAll('.v303-world-canvas')).every(c=>c.width>0&&c.height>0)),
  'resize keeps raster canvases sized');
 assert.deepEqual(errors,[],'no cinematic JS errors');
 console.log('PASS r304: rich scenes, separate school atlas, stable hover, idempotent mounts, live resizing');
 await context.close();
}finally{await browser.close()}
