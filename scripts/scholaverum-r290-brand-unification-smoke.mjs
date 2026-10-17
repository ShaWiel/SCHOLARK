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
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForSelector('.v291-official-hero-art .v291-official-logo-spin',{state:'visible',timeout:30000});
 const hero=await page.evaluate(async()=>{
  const art=document.querySelector('#v280-editorial-home .v291-official-hero-art');
  const rotor=art?.querySelector('.v291-official-logo-spin');
  const img=rotor?.querySelector('img');
  await img.decode();
  const topbar=document.querySelector('.v55-brand-logo');
  return {rendered:document.querySelectorAll('.v291-official-logo-spin').length,
    oldBall:document.querySelectorAll('.v280-planet,.v288-branded-sphere,.v288-sphere-spin').length,
    oldOrbits:art.querySelectorAll('.v280-orbit').length,
    path:img.getAttribute('src'),natural:img.naturalWidth,
    spin:getComputedStyle(rotor).animationName,
    duration:getComputedStyle(rotor).animationDuration,
    repeat:getComputedStyle(rotor).animationIterationCount,
    main:rotor.offsetWidth*.30,legacyDiameter:art.getBoundingClientRect().width*.76,
    topbarSrc:topbar?.getAttribute('src')||null};
 });
 assert.equal(hero.rendered,1,'new official hero logo is mounted once');
 assert.equal(hero.oldBall,0,'previous gradient ball and old S must be removed entirely');
 assert.equal(hero.oldOrbits,0,'no legacy orbit overlays');
 assert.equal(hero.path,NEW,'whole homepage hero uses approved official orbital image');
 assert.ok(hero.natural>0,'approved official artwork must load');
 assert.equal(hero.spin,'v291FullOfficialLogoTurn','entire official artwork must rotate, not just the S');
 assert.equal(hero.duration,'22s');
 assert.equal(hero.repeat,'infinite','rotation has no automatic stopping point');
 assert.ok(Math.abs(hero.main-hero.legacyDiameter)/hero.legacyDiameter<.10,'official center sphere must retain prior ball diameter');
 if(hero.topbarSrc)assert.equal(hero.topbarSrc,NEW,'topbar uses canonical official logo');
 const from=await page.locator('.v291-official-logo-spin').evaluate(el=>getComputedStyle(el).transform);
 await page.waitForTimeout(300);
 const to=await page.locator('.v291-official-logo-spin').evaluate(el=>getComputedStyle(el).transform);
 assert.notEqual(from,to,'logo must physically turn over time');
 const reduced=await browser.newPage({viewport:{width:1100,height:800},reducedMotion:'reduce'});
 await reduced.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await reduced.waitForSelector('.v291-official-logo-spin',{state:'attached',timeout:30000});
 assert.equal(await reduced.locator('.v291-official-logo-spin').evaluate(el=>getComputedStyle(el).animationName),'none');
 await reduced.close();
 assert.deepEqual(errors,[],'branding change must not throw page errors');
 console.log('PASS r291 unified official logo: Dashboard, sidebar, loading, PWA, topbar, and entire 360-degree rotating homepage artwork share new brand');
}finally{await browser.close()}
