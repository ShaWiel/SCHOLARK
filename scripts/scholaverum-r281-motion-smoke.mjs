import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const origin=process.argv[2]||'http://127.0.0.1:10000';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const pageErrors=[];
page.on('pageerror',err=>pageErrors.push(err.message));
await page.addInitScript(()=>localStorage.setItem('scholark_ui_language','en'));

try{
 await page.goto(origin+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>document.body.classList.contains('v280-home-rebuild')&&
  !!window.__SCHOLAVERUM_R280_HOME__&&
  !!document.querySelector('#v280-hero.v281-inview')&&
  !!document.querySelector('.v296-atom[data-status="ready"]'),null,{timeout:60000});
 const started=await page.evaluate(()=>{
  const planet=document.querySelector('.v296-ball'),headline=document.querySelector('#v280-headline > span'),
        orbit=document.querySelector('.v296-front'),stage=document.querySelector('#v280-app-preview .v280-app-inner'),
        hero=document.querySelector('#v280-hero');
  return {planet:planet.dataset.yaw,play:getComputedStyle(planet).animationPlayState,
          orbit:getComputedStyle(orbit).animationName,headline:getComputedStyle(headline).animationName,
          stage:getComputedStyle(stage).animationName,heroClass:hero.classList.contains('v281-inview'),
          version:window.__SCHOLAVERUM_R280_HOME__?.version};
 });
 assert.equal(started.version,'r281-motion-home');
 assert.ok(started.planet!==undefined,'official logo is mapped onto the globe texture');
 assert.equal(started.play,'running','visible planet motion should run');
 assert.equal(started.orbit,'none','orbit canvas and central globe never use a flat 2D clockwise spin');
 assert.equal(started.headline,'v281HeadlineRise','hero headline should animate on arrival');
 assert.equal(started.stage,'v281SceneReveal','product theater needs scene transitions');

 const before=await page.locator('.v296-ball').getAttribute('data-yaw');
 await page.waitForTimeout(600);
 const after=await page.locator('.v296-ball').getAttribute('data-yaw');
 assert.notEqual(after,before,'official full-circle logo must visibly rotate between frames');

 await page.locator('#v280-tab-tutor').click();
 assert.equal(await page.locator('#v280-tab-tutor').getAttribute('aria-selected'),'true');
 assert.equal(await page.locator('#v280-app-preview .v280-app-inner').evaluate(el=>getComputedStyle(el).animationName),'v281SceneReveal');

 await page.evaluate(()=>scrollTo(0,Math.floor(document.querySelector('#v280-hero').offsetHeight*.45)));
 await page.waitForTimeout(240);
 const parallax=await page.evaluate(()=>document.querySelector('#v280-hero').style.getPropertyValue('--v281-parallax'));
 assert.ok(parseFloat(parallax)<0,'hero visual should react to scrolling: '+parallax);

 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForTimeout(120);
 const calm=await page.evaluate(()=>{
  const planet=document.querySelector('.v296-ball'),h=document.querySelector('#v280-headline>span'),tape=document.querySelector('.v280-tape-inner');
  return {planet:planet.dataset.yaw,depth:getComputedStyle(planet).animationName,headline:getComputedStyle(h).animationName,
          tape:getComputedStyle(tape).animationName,art:getComputedStyle(document.querySelector('.v280-hero-art')).transform};
 });
 assert.equal(calm.depth,'none','reduced motion must stop depth animation');
 const frozen=await page.locator('.v296-ball').getAttribute('data-yaw');
 await page.waitForTimeout(300);
 assert.equal(await page.locator('.v296-ball').getAttribute('data-yaw'),frozen,'reduced motion freezes Y-axis movement');
 assert.equal(calm.headline,'none','reduced motion must stop typography');
 assert.equal(calm.tape,'none','reduced motion must stop marquees');
 assert.equal(calm.art,'none','reduced motion must disable scroll parallax');

 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'no-preference'});
 const mobile=await page.evaluate(()=>{
  const float=document.querySelector('.v280-floating.top');
  return {overflow:document.documentElement.scrollWidth-innerWidth,
    float:getComputedStyle(float).animationName,
    heroWidth:document.querySelector('#v280-hero').getBoundingClientRect().width};
 });
 assert.ok(mobile.overflow<=8,'motion must not cause mobile horizontal overflow: '+mobile.overflow);
 assert.equal(mobile.float,'none','limit heavy floating-card animation on small screens');
 assert.ok(mobile.heroWidth<=392,'hero should still fit the viewport');

 await page.locator('#v280-hero [data-v280-route="ai"]').click();
 await page.waitForFunction(()=>location.hash==='#ai'&&!document.body.classList.contains('v280-home-rebuild'),null,{timeout:20000});
 const isolated=await page.evaluate(()=>document.body.classList.contains('v281-motion-paused'));
 assert.ok(isolated,'motion must pause after navigating into Workspace');
 await page.evaluate(()=>location.hash='#home');
 await page.waitForFunction(()=>document.body.classList.contains('v280-home-rebuild')&&
     !!document.querySelector('#v280-hero'),null,{timeout:20000});
 assert.equal(await page.locator('#v280-hero').count(),1,'return home must not duplicate cinematic hero');
 assert.deepEqual(pageErrors,[],'new animation code must not generate uncaught errors');
 console.log('PASS r281 animation: real motion, hero entrance, scene transition, parallax, reduced motion, mobile, route isolation');
}finally{await browser.close()}
