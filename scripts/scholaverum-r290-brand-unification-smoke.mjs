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
 await page.waitForSelector('.v299-planet-canvas',{state:'visible',timeout:35000});
 await page.waitForFunction(()=>{const c=document.querySelector('.v299-planet-canvas');return !!c&&c.width>300&&c.height>300},null,{timeout:20000});
 const hero=await page.evaluate(()=>{
  const art=document.querySelector('#v280-editorial-home .v280-hero-art'),engine=art?.querySelector('.v299-universe'),canvas=engine?.querySelector('canvas'),img=engine?.querySelector('img');
  return {engines:art?.querySelectorAll('.v299-universe').length,oldGlobe:art?.querySelectorAll('.v296-atom,.v292-sphere-stage').length,canvasWidth:canvas?.width,canvasHeight:canvas?.height,logo:img?.getAttribute('src'),heroCards:art?.querySelectorAll('.v280-floating').length,nav:!!document.querySelector('#v298-nav-what')};
 });
 assert.equal(hero.engines,1,'exactly one cinematic engine is mounted');
 assert.equal(hero.oldGlobe,0,'retired globe and flattened strips must not remain');
 assert.ok(hero.canvasWidth>300&&hero.canvasHeight>300,'orbital visuals render as a sharp canvas');
 assert.equal(hero.logo,ICON.slice(1),'retain the official brand icon within a new visual concept');
 assert.equal(hero.heroCards,2,'preserve ARKI and AI Tutor hero cards');
 assert.equal(hero.nav,true,'cinematic presentation entry is available');
 await page.setViewportSize({width:390,height:844});
 const mobileHero=await page.evaluate(()=>({
  count:document.querySelectorAll('#v280-hero .v299-universe').length,
  width:document.querySelector('.v299-universe')?.getBoundingClientRect().width,
  overflow:document.documentElement.scrollWidth-innerWidth
 }));
 assert.equal(mobileHero.count,1,'returning home should not duplicate the planetary cinematic engine');
 assert.ok(mobileHero.width>100,'mobile visual must stay visible');
 assert.ok(mobileHero.overflow<=8,'no mobile horizontal overflow');
 const reduced=await browser.newPage({viewport:{width:1100,height:800},reducedMotion:'reduce'});
 await reduced.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await reduced.waitForSelector('.v299-logo',{state:'visible',timeout:30000});
 assert.equal(await reduced.locator('.v299-logo').evaluate(el=>getComputedStyle(el).animationName),'none','reduced motion disables rotating image');
 await reduced.close();
 assert.deepEqual(errors,[],'branding and cinematic swap must not throw page errors');
 console.log('PASS r298 official brand: native logo, new eclipse planetary engine, workspace identity, reduced motion and responsive layout');
}finally{await browser.close()}
