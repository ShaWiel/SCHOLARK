import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const errors=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(String(e.message)));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>document.querySelector('.v301-front-orbs-canvas')?.width>300 &&
  window.__SCHOLAVERUM_R300_COSMOS__?.state?.()?.frames>0 &&
  window.__SCHOLAVERUM_R299_PLANET__?.state?.()?.renderedFrames>0,null,{timeout:60000});
 const diag=await page.evaluate(()=>{
  const stage=document.querySelector('.v299-universe'),front=document.querySelector('.v301-front-orbs-canvas'),
   logo=stage.querySelector('.v299-logo'),behind=stage.querySelector('.v299-planet-canvas');
  const info=window.__SCHOLAVERUM_R299_PLANET__.state();
  const cosmos=window.__SCHOLAVERUM_R300_COSMOS__.state();
  return {count:document.querySelectorAll('.v299-universe').length,
   frontCount:document.querySelectorAll('.v301-front-orbs-canvas').length,
   logo:logo?.getAttribute('src'),size:[front.width,front.height],
   order:[+getComputedStyle(behind).zIndex,+getComputedStyle(logo).zIndex,+getComputedStyle(front).zIndex],
   info,cosmos};
 });
 assert.equal(diag.count,1,'one hero planet engine');
 assert.equal(diag.frontCount,1,'one dedicated orbit foreground');
 assert.deepEqual(diag.order,[1,3,5],'the feature moons render above the S logo');
 assert.equal(diag.logo,'scholaverum-planet-crest-r300.webp','retain purple and lime logo');
 assert.ok(diag.info.frontOrbs&&diag.info.frontCanvas[0]>300,'front moon canvas is active');
 assert.equal(diag.info.moons,5);assert.equal(diag.info.rings,4);
 assert.deepEqual(diag.cosmos.cosmicDetails,{distantPlanets:2,meteors:4,rocket:1,satellites:2});
 // Intro skip reveals all five moon orbs, while their center mark remains unobstructed.
 await page.locator('.v299-skip').click();
 await page.waitForFunction(()=>window.__SCHOLAVERUM_R299_PLANET__.state().phase==='idle',null,{timeout:15000});
 const foreground=await page.evaluate(()=>{
  const canvas=document.querySelector('.v301-front-orbs-canvas'),el=document.querySelector('.v299-universe');
  const c=canvas.getContext('2d'),width=el.getBoundingClientRect().width,height=el.getBoundingClientRect().height;
  const ratio=canvas.width/width,R=Math.min(width,height)*.275;
  const centerX=width*.5,centerY=height*.52;
  const x=(centerX+.64*R*1.24)*ratio,y=(centerY-.74*R*1.24*.91)*ratio;
  const px=c.getImageData(Math.floor(x),Math.floor(y),1,1).data;
  const mark=c.getImageData(Math.floor(centerX*ratio),Math.floor(centerY*ratio),1,1).data;
  // Count pixels with alpha in upper-right quadrant, validating actual orbit rendering.
  const img=c.getImageData(Math.floor(canvas.width*.56),Math.floor(canvas.height*.12),
   Math.max(1,Math.floor(canvas.width*.35)),Math.max(1,Math.floor(canvas.height*.4))).data;
  let count=0;for(let j=3;j<img.length;j+=16)if(img[j]>10)count++;
  return {frontPixels:count,logoCenterAlpha:mark[3],sampleAlpha:px[3]};
 });
 assert.ok(foreground.frontPixels>20,'visible feature moons are drawn into their foreground layer');
 assert.equal(foreground.logoCenterAlpha,0,'the center graduation S is unobstructed');
 await page.evaluate(()=>location.hash='#dashboard');
 await page.waitForFunction(()=>document.body.classList.contains('v51-workspace'),null,{timeout:25000});
 await page.evaluate(()=>location.hash='#home');
 await page.waitForFunction(()=>document.body.classList.contains('v280-home-rebuild')&&
 document.querySelector('.v301-front-orbs-canvas')?.width>300,null,{timeout:25000});
 assert.equal(await page.locator('.v299-universe').count(),1,'route changes never duplicate the planet');
 assert.equal(await page.locator('.v301-front-orbs-canvas').count(),1,'route changes never duplicate the foreground');
 await page.locator('.v299-skip').count();
 await context.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(String(e.message)));
 await mp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await mp.waitForFunction(()=>window.__SCHOLAVERUM_R299_PLANET__?.state?.()?.frontOrbs &&
 document.querySelector('.v301-front-orbs-canvas')?.width>230,null,{timeout:60000});
 const m=await mp.evaluate(()=>({orbs:document.querySelectorAll('.v301-front-orbs-canvas').length,overflow:document.documentElement.scrollWidth-innerWidth}));
 assert.equal(m.orbs,1);assert.ok(m.overflow<=8,'mobile foreground must not create horizontal overflow');
 await mobile.close();
 const reduce=await browser.newContext({viewport:{width:1180,height:800},reducedMotion:'reduce'});
 const rp=await reduce.newPage();rp.on('pageerror',e=>errors.push(String(e.message)));
 await rp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await rp.waitForFunction(()=>window.__SCHOLAVERUM_R299_PLANET__?.state?.()?.frontCanvas?.[0]>250,null,{timeout:60000});
 const before=await rp.evaluate(()=>window.__SCHOLAVERUM_R299_PLANET__.state().renderedFrames);
 await rp.waitForTimeout(300);
 const after=await rp.evaluate(()=>window.__SCHOLAVERUM_R299_PLANET__.state().renderedFrames);
 assert.equal(before,after,'reduced-motion orbit is still');
 await reduce.close();
 assert.deepEqual(errors,[],'no browser errors on page, routes or animation');
 console.log('PASS r301: foreground feature-orbits in front of logo, four rings, full-color cosmos, spacecraft, meteors, route stability, mobile, reduced motion');
}finally{await browser.close()}
