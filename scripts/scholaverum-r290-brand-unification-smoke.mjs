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
 await page.waitForSelector('.v292-hero-art .v292-depth-spin',{state:'visible',timeout:30000});
 const hero=await page.evaluate(async()=>{
  const art=document.querySelector('#v280-editorial-home .v292-hero-art');
  const sphere=art?.querySelector('.v292-sphere-stage');
  const rot=sphere?.querySelector('.v292-depth-spin');
  const imgs=[...rot.querySelectorAll('.v292-sphere-face img')];
  await Promise.all(imgs.map(i=>i.decode()));
  const topbar=document.querySelector('.v55-brand-logo');
  const keyframes=[...document.styleSheets].flatMap(sheet=>{try{return [...sheet.cssRules]}catch{return []}}).filter(rule=>rule.name==='v292SphereSpinY');
  return {rendered:document.querySelectorAll('.v292-sphere-stage').length,
   oldBall:document.querySelectorAll('.v280-planet,.v288-branded-sphere,.v288-sphere-spin,.v291-official-logo-spin').length,
   legacyArtwork:[...document.querySelectorAll('#v280-hero img')].filter(i=>(i.getAttribute('src')||'').includes('scholaverum-logo-r246')).length,
   path:imgs.map(i=>i.getAttribute('src')),loaded:imgs.every(i=>i.naturalWidth>0),
   sphereDiameter:sphere.getBoundingClientRect().width,oldBallDiameter:art.getBoundingClientRect().width*.76,
   orbitCount:art.querySelectorAll('.v292-orbit').length,
   spin:getComputedStyle(rot).animationName,duration:getComputedStyle(rot).animationDuration,
   repeat:getComputedStyle(rot).animationIterationCount,
   volumetric:getComputedStyle(sphere.querySelector('.v292-sphere-volume')).borderRadius,
   keyframes:keyframes.map(x=>x.cssText).join('\n'),
   topbarSrc:topbar?.getAttribute('src')||null};
 });
 assert.equal(hero.rendered,1,'single compact official-logo sphere');
 assert.equal(hero.oldBall,0,'no old r246 gradient sphere or flat oversized artwork');
 assert.equal(hero.legacyArtwork,0,'old S image never returns to the homepage hero');
 assert.deepEqual(hero.path,[NEW,NEW],'both 3D faces use the approved official logo');
 assert.ok(hero.loaded,'the original official-logo asset decodes on both faces');
 assert.equal(hero.orbitCount,2,'the orbit motif remains attached to the branded sphere');
 assert.ok(Math.abs(hero.sphereDiameter-hero.oldBallDiameter)<=2,'new official sphere restores the old ball size');
 assert.ok(hero.sphereDiameter<hero.oldBallDiameter*1.03,'official sphere must not be oversized');
 assert.equal(hero.spin,'v292SphereSpinY','rotate the sphere on the front-to-back Y axis, never clockwise Z');
 assert.match(hero.keyframes,/rotateY\(360deg\)/,'full 360 degree 3D Y turn is explicitly defined');
 assert.doesNotMatch(hero.keyframes,/rotate\(360deg\)/,'no flat 2D rotation');
 assert.equal(hero.duration,'22s');
 assert.equal(hero.repeat,'infinite','3D sphere must turn continuously');
 assert.equal(hero.volumetric,'50%','sphere must remain rounded during the Y-axis turn');
 if(hero.topbarSrc)assert.equal(hero.topbarSrc,NEW,'topbar stays branded');
 const before=await page.locator('.v292-depth-spin').evaluate(el=>getComputedStyle(el).transform);
 await page.waitForTimeout(280);
 const after=await page.locator('.v292-depth-spin').evaluate(el=>getComputedStyle(el).transform);
 assert.notEqual(before,after,'3D sphere must genuinely rotate over time');
 await page.setViewportSize({width:390,height:844});
 const mob=await page.evaluate(()=>{
  const art=document.querySelector('.v292-hero-art'),sphere=art.querySelector('.v292-sphere-stage');
  return {sphere:sphere.getBoundingClientRect().width,oldDiameter:art.getBoundingClientRect().width*.76,
   duration:getComputedStyle(art.querySelector('.v292-depth-spin')).animationDuration,
   overflow:document.documentElement.scrollWidth-innerWidth};
 });
 assert.ok(Math.abs(mob.sphere-mob.oldDiameter)<2,'same compact visual proportion on mobile');
 assert.equal(mob.duration,'25s','mobile sphere rotation runs gently without stops');
 assert.ok(mob.overflow<=8,'mobile homepage has no horizontal scroll caused by 3D sphere');
 const reduced=await browser.newPage({viewport:{width:1100,height:800},reducedMotion:'reduce'});
 await reduced.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await reduced.waitForSelector('.v292-depth-spin',{state:'attached',timeout:30000});
 assert.equal(await reduced.locator('.v292-depth-spin').evaluate(el=>getComputedStyle(el).animationName),'none','accessible reduced-motion preference respected');
 await reduced.close();
 assert.deepEqual(errors,[],'branding change must not throw page errors');
 console.log('PASS r292 official brand: full-size unchanged Workspace branding and old-size official-logo sphere with a genuine infinite 360-degree Y-axis turn');
}finally{await browser.close()}
