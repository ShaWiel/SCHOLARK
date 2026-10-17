import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const NEW='/scholaverum-official-logo-r290.webp';
const ICON='/scholaverum-official-icon-r290.png';
const BALL='/scholaverum-logo-r246.png';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 const logo=await page.request.get(base+NEW);
 const icon=await page.request.get(base+ICON);
 assert.equal(logo.status(),200,'canonical logo is publicly served');
 assert.equal(icon.status(),200,'canonical install icon is publicly served');
 assert.match(logo.headers()['content-type']||'',/image\/webp/i);
 assert.match(icon.headers()['content-type']||'',/image\/png/i);
 const manifest=await (await page.request.get(base+'/scholark.webmanifest')).json();
 assert.equal(manifest.icons[0].src,ICON,'installed PWA uses approved official icon');
 const html=await (await page.request.get(base+'/#dashboard')).text();
 assert.ok(html.includes('href="'+NEW+'"'),'first-paint preloader must use official logo');
 assert.ok(html.includes('content="https://scholark-app-shawiel.onrender.com'+NEW+'"'),'social metadata must use the new official logo');
 assert.ok(html.includes(ICON),'favicon/apple icon must come from the new approved brand');
 await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForSelector('[data-workspace-layout="r285"] .v288-orbit-emblem img',{state:'visible',timeout:30000});
 await page.waitForFunction(()=>{
  const imgs=[document.querySelector('.v288-orbit-emblem img'),document.querySelector('#v51-sidebar .v51-logo img')];
  return imgs.every(x=>x?.complete&&x.naturalWidth>0);
 },null,{timeout:12000});
 const desktop=await page.evaluate(()=>{
  const dash=document.querySelector('.v288-orbit-emblem img');
  const side=document.querySelector('#v51-sidebar .v51-logo img');
  const urls=[dash?.getAttribute('src'),side?.getAttribute('src')];
  return {urls,description:dash?.alt||'',slogan:document.querySelectorAll('.v285-orbit-caption').length,main:document.querySelectorAll('#v51-main').length};
 });
 assert.deepEqual(desktop.urls,[NEW,NEW],'same approved logo is used in Dashboard and sidebar');
 assert.equal(desktop.slogan,0,'obsolete tagline stays removed');
 assert.equal(desktop.main,1,'Workspace singleton remains intact');
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(100);
 const mobile=await page.locator('.v288-orbit-emblem img').evaluate(el=>({width:el.getBoundingClientRect().width,natural:el.naturalWidth,display:getComputedStyle(el).display}));
 assert.ok(mobile.width>90&&mobile.natural>0&&mobile.display!=='none','official Dashboard brand remains visible on mobile');
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForSelector('.v288-branded-sphere .v288-sphere-spin',{state:'visible',timeout:30000});
 const hero=await page.evaluate(async()=>{
  const imgs=[...document.querySelectorAll('.v288-sphere-spin .v288-sphere-face img')];
  await Promise.all(imgs.map(x=>x.decode()));
  const legacy=[...document.images].filter(x=>(x.getAttribute('src')||'').includes('scholaverum-logo-r246.png')&&!x.closest('.v288-sphere-spin'));
  const topbar=document.querySelector('.v55-brand-logo');
  const rotor=document.querySelector('.v288-sphere-spin');
  return {ballUrls:imgs.map(x=>x.getAttribute('src')),loaded:imgs.every(x=>x.naturalWidth>0),extraLegacy:legacy.length,topbarSrc:topbar?.getAttribute('src')||null,spin:getComputedStyle(rotor).animationDuration};
 });
 assert.deepEqual(hero.ballUrls,[BALL,BALL],'homepage rotating sphere MUST keep the original logo');
 assert.ok(hero.loaded,'protected homepage sphere keeps original art');
 assert.equal(hero.extraLegacy,0,'no old brand is displayed outside the protected sphere');
 if(hero.topbarSrc)assert.equal(hero.topbarSrc,NEW,'public topbar uses official logo');
 assert.equal(hero.spin,'25s','mobile rotating sphere keeps its prior speed');
 const reduced=await browser.newPage({viewport:{width:1100,height:800},reducedMotion:'reduce'});
 await reduced.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await reduced.waitForSelector('.v288-sphere-spin',{state:'attached',timeout:30000});
 assert.equal(await reduced.locator('.v288-sphere-spin').evaluate(el=>getComputedStyle(el).animationName),'none');
 await reduced.close();
 assert.deepEqual(errors,[],'branding change must not throw page errors');
 console.log('PASS r290 official brand: Dashboard, sidebar, loading, favicon, PWA and topbar use new assets; original rotating homepage sphere remains unchanged');
}finally{await browser.close()}
