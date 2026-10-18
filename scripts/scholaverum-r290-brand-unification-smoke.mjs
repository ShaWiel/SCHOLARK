import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const NEW='/scholaverum-official-logo-r290.webp';
const ICON='/scholaverum-official-icon-r290.png';
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
 assert.ok(html.includes('center/clamp(245px,31vw,380px) auto no-repeat'),'loading screen official emblem is slightly larger than previous build');
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
 await page.setViewportSize({width:1440,height:900});
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForSelector('#v294-globe',{state:'visible',timeout:30000});
 await page.waitForFunction(()=>/^ready/.test(document.querySelector('#v294-globe')?.dataset.globeStatus||''),null,{timeout:20000});
 const hero=await page.evaluate(()=>{
  const art=document.querySelector('.v294-hero-art'),sphere=art.querySelector('.v294-globe-stage'),
   shell=art.querySelector('.v294-globe-shell'),canvas=art.querySelector('#v294-globe');
  return {single:document.querySelectorAll('#v294-globe').length,
   old:document.querySelectorAll('.v280-planet,.v288-branded-sphere,.v288-sphere-spin,.v291-official-logo-spin,.v292-sphere-face,.v292-depth-spin').length,
   legacyArtwork:[...document.querySelectorAll('#v280-hero img')].filter(x=>(x.getAttribute('src')||'').includes('scholaverum-logo-r246')).length,
   logo:art.querySelector('.v294-globe-fallback')?.getAttribute('src'),
   sphereDiameter:sphere.getBoundingClientRect().width,oldBallDiameter:art.getBoundingClientRect().width*.76,
   orbitCount:art.querySelectorAll('.v294-orbit').length,
   paint:canvas.dataset.globeStatus,angle:canvas.dataset.globeYaw,
   depth:getComputedStyle(shell).animationName,topbar:document.querySelector('.v55-brand-logo')?.getAttribute('src')||null};
 });
 assert.equal(hero.single,1,'one continuously textured globe, no duplicate logo cards');
 assert.equal(hero.old,0,'do not restore old gradient sphere or flat rotating discs');
 assert.equal(hero.legacyArtwork,0,'the original S-cap asset must not reappear');
 assert.equal(hero.logo,NEW,'the shader texture and fallback are sourced from the official logo');
 assert.equal(hero.orbitCount,2,'approved orbit decoration surrounds the globe');
 assert.ok(Math.abs(hero.sphereDiameter-hero.oldBallDiameter)<=2,'globe matches original compact ball size');
 assert.ok(/^ready/.test(hero.paint),'GPU or canvas spherical renderer must be active');
 assert.equal(hero.depth,'v294GlobeEmerge','subtle 3D forward/back depth animation');
 if(hero.topbar)assert.equal(hero.topbar,NEW,'topbar branding remains official');
 const before=await page.locator('#v294-globe').getAttribute('data-globe-yaw');
 await page.waitForTimeout(550);
 const after=await page.locator('#v294-globe').getAttribute('data-globe-yaw');
 assert.notEqual(before,after,'globe must continuously rotate on the Y axis, not spin in 2D');
 await page.setViewportSize({width:390,height:844});
 const mob=await page.evaluate(()=>{
  const art=document.querySelector('.v294-hero-art'),sphere=art.querySelector('.v294-globe-stage');
  return {sphere:sphere.getBoundingClientRect().width,oldDiameter:art.getBoundingClientRect().width*.76,
    status:art.querySelector('canvas')?.dataset.globeStatus,overflow:document.documentElement.scrollWidth-innerWidth};
 });
 assert.ok(Math.abs(mob.sphere-mob.oldDiameter)<2,'globe stays compact on mobile');
 assert.ok(/^ready/.test(mob.status),'renderer survives responsive resize');
 assert.ok(mob.overflow<=8,'no horizontal overflow on mobile');
 const reduced=await browser.newPage({viewport:{width:1100,height:800},reducedMotion:'reduce'});
 await reduced.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await reduced.waitForFunction(()=>/^ready/.test(document.querySelector('#v294-globe')?.dataset.globeStatus||''),null,{timeout:20000});
 assert.equal(await reduced.locator('.v294-globe-shell').evaluate(el=>getComputedStyle(el).animationName),'none','reduced-motion freezes 3D depth effect');
 const paused=await reduced.locator('#v294-globe').getAttribute('data-globe-yaw');
 await reduced.waitForTimeout(250);
 assert.equal(await reduced.locator('#v294-globe').getAttribute('data-globe-yaw'),paused,'reduced-motion freezes globe rotation');
 await reduced.close();
 assert.deepEqual(errors,[],'branding change must not throw page errors');
 console.log('PASS r294 official brand: original-size spherical projection and 360-degree Y-axis turn');
}finally{await browser.close()}
