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
 await page.waitForSelector('.v296-atom[data-status="ready"]',{state:'visible',timeout:30000});
 const hero=await page.evaluate(()=>{
  const art=document.querySelector('#v280-editorial-home .v280-hero-art');
  const atom=art?.querySelector('.v296-atom');
  const canvas=atom?.querySelector('.v296-ball');
  return {
   count:document.querySelectorAll('#v280-hero .v296-atom').length,
   oldBall:document.querySelectorAll('#v280-hero .v292-sphere-stage,#v280-hero .v294-globe-strip').length,
   diameter:atom?.getBoundingClientRect().width,
   oldDiameter:art?.getBoundingClientRect().width*.76,
   orbitCount:atom?.querySelectorAll('.v296-orbit-canvas').length,
   pixelSize:canvas?.width,spinAngle:canvas?.dataset.yaw,
   topbarSrc:document.querySelector('.v55-brand-logo')?.getAttribute('src')||null,
   heroCards:art?.querySelectorAll('.v280-floating').length
  };
 });
 assert.equal(hero.count,1,'exactly one approved spherical logo renderer');
 assert.equal(hero.oldBall,0,'old 48 flat rotating logo strips must be completely removed');
 assert.ok(Math.abs(hero.diameter-hero.oldDiameter)<=2,'central sphere retains the original compact proportions');
 assert.equal(hero.orbitCount,2,'two independently layered purple and lime orbital canvases');
 assert.ok(hero.pixelSize>0,'WebGL/CPU renderer must draw nonzero spherical pixels');
 assert.ok(hero.heroCards>=2,'preserve existing ARKI and AI Tutor cards');
 if(hero.topbarSrc)assert.equal(hero.topbarSrc,NEW,'topbar branding remains unchanged');
 const before=await page.locator('.v296-ball').getAttribute('data-yaw');
 await page.waitForTimeout(600);
 const after=await page.locator('.v296-ball').getAttribute('data-yaw');
 assert.notEqual(before,after,'UV texture must make observable Y-axis progress');
 await page.setViewportSize({width:390,height:844});
 const mobileHero=await page.evaluate(()=>{
  const art=document.querySelector('.v280-hero-art'),atom=art.querySelector('.v296-atom');
  return {count:document.querySelectorAll('#v280-hero .v296-atom').length,
   diameter:atom.getBoundingClientRect().width,overflow:document.documentElement.scrollWidth-innerWidth};
 });
 assert.equal(mobileHero.count,1,'responsive hero should not duplicate');
 assert.ok(mobileHero.diameter>100,'mobile globe remains visible and properly sized');
 assert.ok(mobileHero.overflow<=8,'mobile must not overflow horizontally');
 const hasGPU=await page.locator('.v296-ball').evaluate(el=>!!el.getContext('webgl'));
 if(hasGPU){
  await page.locator('.v296-ball').evaluate(el=>el.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
  await page.waitForFunction(()=>{
   const atom=document.querySelector('.v296-atom'),canvas=atom?.querySelector('.v296-ball');
   return atom?.dataset.status==='ready'&&!!canvas?.getContext('2d')&&canvas.width>0;
  },null,{timeout:12000});
  const cpuBefore=await page.locator('.v296-ball').getAttribute('data-yaw');
  await page.waitForTimeout(420);
  const cpuAfter=await page.locator('.v296-ball').getAttribute('data-yaw');
  assert.notEqual(cpuBefore,cpuAfter,'CPU failover must keep globe rotating after GPU context loss');
 }
 const memory=await page.evaluate(()=>{
  const c=document.querySelector('.v296-orbit-canvas');
  return {width:c.width,height:c.height};
 });
 assert.ok(memory.width<=1400&&memory.height<=1400,'orbit canvases must cap their GPU/CPU buffer allocation');
 const reduced=await browser.newPage({viewport:{width:1100,height:800},reducedMotion:'reduce'});
 await reduced.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await reduced.waitForSelector('.v296-atom[data-status="ready"]',{state:'visible',timeout:30000});
 assert.equal(await reduced.locator('.v296-ball').evaluate(el=>getComputedStyle(el).animationName),'none','accessibility freezes depth animation');
 const paused=await reduced.locator('.v296-ball').getAttribute('data-yaw');
 await reduced.waitForTimeout(320);
 assert.equal(await reduced.locator('.v296-ball').getAttribute('data-yaw'),paused,'accessibility freezes globe rotation');
 await reduced.close();
 assert.deepEqual(errors,[],'branding change must not throw page errors');
 console.log('PASS r296 official brand: actual spherical projection, enlarged purple/lime orbits, desktop/mobile and reduced motion');
}finally{await browser.close()}
