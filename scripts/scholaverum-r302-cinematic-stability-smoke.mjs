import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});const errors=[];
try {
 const html=await (await browser.newPage()).request.get(base+'/');
 assert.equal(html.status(),200);
 const body=await html.text();
 assert.ok(body.includes('html.scholark-prepaint::before{animation:none!important'),'loading emblem is fixed and cannot shake');
 assert.ok(body.includes('scholaverum-planet-crest-r300.webp'),'new planet emblem preloaded');
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.__SCHOLAVERUM_R299_PLANET__?.state?.()?.frontOrbs&&
 document.querySelector('.v302-wordmark')&&document.querySelector('.v299-logo')?.naturalWidth>0,null,{timeout:60000});
 const state=await page.evaluate(()=>{
 const s=document.querySelector('.v299-universe'),word=s.querySelector('.v302-wordmark'),
  c=s.querySelector('.v301-front-orbs-canvas'),logo=s.querySelector('.v299-logo');
 return {engines:document.querySelectorAll('.v299-universe').length,word:word.textContent,
  alpha:getComputedStyle(word).opacity,front:+getComputedStyle(c).zIndex,
  logo:+getComputedStyle(logo).zIndex,old:document.querySelectorAll('.v298-engine,.v296-atom,.v292-sphere-stage').length,
  frontCount:document.querySelectorAll('.v301-front-orbs-canvas').length,
  controls:document.querySelectorAll('#v298-nav-what,[data-v298-action="open"],#v298-cinema').length,
  overlayAnimation:getComputedStyle(document.documentElement,'::before').animationName};
 });
 assert.equal(state.engines,1);assert.equal(state.word,'SCHOLAVERUM');
 assert.equal(state.frontCount,1);assert.ok(state.front>state.logo);
 assert.equal(state.old,0);assert.equal(state.controls,0);
 await page.locator('.v299-skip').click();
 await page.waitForFunction(()=>window.__SCHOLAVERUM_R299_PLANET__.state().phase==='idle',null,{timeout:14000});
 // Image difference verifies real visible movement, not an inert static decorative front layer.
 const pixels=async()=>page.evaluate(()=>{
  const c=document.querySelector('.v301-front-orbs-canvas'),w=c.width,h=c.height;
  const d=c.getContext('2d').getImageData(Math.floor(w*.1),Math.floor(h*.09),Math.max(2,Math.floor(w*.8)),Math.max(2,Math.floor(h*.79))).data;
  const result=[];for(let i=0;i<d.length;i+=43)result.push((d[i]<<8)+d[i+3]);return result;
 });
 const p1=await pixels();await page.waitForTimeout(1250);const p2=await pixels();
 let changes=0;for(let i=0;i<Math.min(p1.length,p2.length);i++)if(p1[i]!==p2[i])changes++;
 assert.ok(changes>30,'the five front feature balls must float visibly: '+changes);
 const t=await page.evaluate(()=>({state:window.__SCHOLAVERUM_R299_PLANET__.state(),label:getComputedStyle(document.querySelector('.v302-wordmark')).opacity}));
 assert.equal(t.state.moons,5);assert.equal(t.state.rings,4);assert.ok(Number(t.label)>.8,'SCHOLAVERUM wordmark is visible in idle');
 await page.evaluate(()=>location.hash='#dashboard');
 await page.waitForFunction(()=>!document.body.classList.contains('v280-home-rebuild'),null,{timeout:25000});
 await page.evaluate(()=>location.hash='#home');
 await page.waitForFunction(()=>document.body.classList.contains('v280-home-rebuild')&&document.querySelector('.v302-wordmark'),null,{timeout:25000});
 assert.equal(await page.locator('.v299-universe').count(),1,'route return must not duplicate hero');
 assert.equal(await page.locator('.v301-front-orbs-canvas').count(),1,'route return must not duplicate moon render loop');
 assert.equal(await page.locator('.v302-wordmark').count(),1,'one brand label after navigation');
 await context.close();
 const reduced=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const rp=await reduced.newPage();rp.on('pageerror',e=>errors.push(e.message));
 await rp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await rp.waitForFunction(()=>window.__SCHOLAVERUM_R299_PLANET__?.state?.()?.frontCanvas?.[0]>200,null,{timeout:60000});
 const first=await rp.evaluate(()=>window.__SCHOLAVERUM_R299_PLANET__.state().renderedFrames);
 await rp.waitForTimeout(300);
 assert.equal(await rp.evaluate(()=>window.__SCHOLAVERUM_R299_PLANET__.state().renderedFrames),first,'reduced-motion planet freezes');
 assert.ok((await rp.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=8,'mobile overflow');
 await reduced.close();
 assert.deepEqual(errors,[]);
 console.log('PASS r302: still loading emblem, living front feature moons, wordmark, no ghost globe, slideshow gone, stable route return, mobile');
}finally{await browser.close()}