import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const errors=[];
const browser=await chromium.launch({headless:true});
try {
 const desktop=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const page=await desktop.newPage();
 page.on('pageerror',err=>errors.push(err.message));
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForTimeout(1800);
 const state=await page.evaluate(()=>({
  release:document.documentElement.dataset.scholarkRelease,
  root:!!document.querySelector('#v280-editorial-home'),
  hero:!!document.querySelector('#v280-hero'),
  dockButtons:document.querySelectorAll('#v280-hero .v306-journey').length,
  intro:!!document.querySelector('.v306-intro-track'),
  worldCanvas:!!document.querySelector('.v303-world-canvas'),
  brand:!!document.querySelector('#v280-hero .v299-logo, #v280-hero img[src*="scholaverum-official-"]'),
  dockStyle:document.querySelector('.v306-hero-dock')?getComputedStyle(document.querySelector('.v306-hero-dock')).display:null,
  scripts:[...document.scripts].map(x=>x.src.split('/').pop()).filter(x=>/v124|v128|v133/.test(x)),
  css:[...document.styleSheets].map(x=>x.href?.split('/').pop()).filter(x=>x&&/v124|v133/.test(x)),
  stylesheet:document.querySelector('#scholaverum-home-style')?.getAttribute('href')
 }));
 console.log('R306 VISIBLE HOME INITIAL STATE',JSON.stringify(state));
 await page.waitForFunction(()=>document.querySelectorAll('#v280-hero .v306-journey').length===4 &&
  document.querySelector('.v306-intro-track') && document.querySelector('.v303-world-canvas') &&
  document.querySelector('#v280-hero .v299-logo, #v280-hero img[src*="scholaverum-official-"]') &&
  getComputedStyle(document.querySelector('.v306-hero-dock')).display==='grid' &&
  document.documentElement.dataset.scholarkRelease==='r306-visible-homepage-redesign',null,{timeout:60000});
 const hero=await page.evaluate(()=>{
  const h=document.querySelector('#v280-hero'),buttons=[...document.querySelectorAll('.v306-journey')];
  const dock=document.querySelector('.v306-hero-dock');
  const intro=document.querySelector('.v306-intro-track');
  const app=document.querySelector('#v280-app-preview');
  const panel=document.querySelector('.v280-panel');
  const tools=[...document.querySelectorAll('.v280-tool')];
  return{
   release:document.documentElement.dataset.scholarkRelease,
   stylesheet:document.querySelector('#scholaverum-home-style')?.getAttribute('href'),
   hero:h.getBoundingClientRect().height,
   dockDisplay:getComputedStyle(dock).display,
   dockY:dock.getBoundingClientRect().top,
   dockButtons:buttons.length,
   routes:buttons.map(b=>b.dataset.v306Go),
   introHeight:intro.getBoundingClientRect().height,
   toolsLayout:getComputedStyle(document.querySelector('.v280-tools')).gridTemplateColumns.split(' ').length,
   toolRadius:getComputedStyle(tools[0]).borderTopLeftRadius,
   planCount:document.querySelectorAll('#v41-home-pricing .v41-plan').length,
   art:document.querySelector('#v280-hero .v280-hero-art')?.getBoundingClientRect().width,
   heroBrand:!!document.querySelector('#v280-hero .v299-logo, #v280-hero img[src*="scholaverum-official-"]'),
   app:!!app,
   panelBackground:getComputedStyle(panel).backgroundColor
  };
 });
 assert.equal(hero.release,'r306-visible-homepage-redesign');
 assert.match(hero.stylesheet||'',/20261031-r306/,'the browser must use the new r306 homepage styles, never cached r294');
 assert.equal(hero.dockDisplay,'grid');
 assert.equal(hero.dockButtons,4);
 assert.deepEqual(hero.routes,['ai','tutor','language','schools'],'all dock links lead to actual features');
 assert.ok(hero.dockY<970,'new navigation must be visible near first screen, not buried below folds');
 assert.ok(hero.introHeight>=550,'editorial learning path is a real illustrated section');
 assert.equal(hero.toolsLayout,3,'toolkit must be a redesigned 3-column gallery');
 assert.ok(Number.parseInt(hero.toolRadius,10)>=20,'rounded product cards replace original spreadsheet-style grid');
 assert.ok(hero.planCount>=2,'pricing remains visible and preserved');
 assert.ok(hero.heroBrand,'official logo remains intact');
 assert.ok(hero.art>450,'approved planet has not been lost');
 assert.ok(hero.app,'interactive workspace preview still exists');
 await page.locator('#v280-hero .v306-journey[data-v306-go="tutor"]').click();
 await page.waitForFunction(()=>location.hash.toLowerCase().includes('tutor'),null,{timeout:15000});
 await desktop.close();

 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 const mp=await mobile.newPage();mp.on('pageerror',err=>errors.push(err.message));
 await mp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await mp.waitForFunction(()=>document.querySelectorAll('.v306-journey').length===4 &&
  document.querySelector('.v306-intro-track') && document.querySelector('#v280-hero .v299-logo, #v280-hero img[src*="scholaverum-official-"]') &&
  getComputedStyle(document.querySelector('.v306-hero-dock')).gridTemplateColumns.split(' ').length===2,null,{timeout:60000});
 const m=await mp.evaluate(()=>({
  overflow:document.documentElement.scrollWidth-innerWidth,
  heroWidth:document.querySelector('#v280-hero').getBoundingClientRect().width,
  dockColumns:getComputedStyle(document.querySelector('.v306-hero-dock')).gridTemplateColumns.split(' ').length,
  dockHeight:document.querySelector('.v306-hero-dock').getBoundingClientRect().height,
  introHeight:document.querySelector('.v306-intro-track').getBoundingClientRect().height,
  brandCount:document.querySelectorAll('#v280-hero .v299-logo, #v280-hero img[src*="scholaverum-official-"]').length,
  toolkitColumns:getComputedStyle(document.querySelector('.v280-tools')).gridTemplateColumns.split(' ').length
 }));
 assert.ok(m.overflow<=8,'r306 must have no horizontal overflow '+JSON.stringify(m));
 assert.equal(m.dockColumns,2,'mobile first screen has 2-column feature navigation');
 assert.ok(m.dockHeight>=160,'mobile feature dock is genuinely present');
 assert.ok(m.introHeight>=350,'mobile intro illustration present');
 assert.ok(m.brandCount>=1,'approved hero logo is present in the spherical render');
 assert.equal(m.toolkitColumns,1,'mobile toolkit is a readable vertical stack');
 await mobile.close();
 assert.deepEqual(errors,[],'no frontend exceptions');
 console.log('PASS r306: first-screen visible navigation, full-homepage redesign, working links, preserved logo/pricing, mobile layout');
}finally{await browser.close()}
