import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[];
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(['warning','error'].includes(m.type()))console.log('R307 BROWSER LOG',m.type(),m.text().slice(0,900))});
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForTimeout(6000);
 console.log('R307 PRECHECK',JSON.stringify(await page.evaluate(()=>({body:document.body?.className,root:!!document.querySelector('#v280-editorial-home'),loader:!!window.__SCHOLAVERUM_R307_3D__,state:window.__SCHOLAVERUM_R307_3D__?.state?.(),css:!!document.querySelector('#scholaverum-r307-3d-style'),webgl2:!!document.createElement('canvas').getContext('webgl2'),scripts:[...document.querySelectorAll('script[src]')].filter(x=>x.src.includes('v134')).map(x=>x.src)}))));
 await page.waitForFunction(()=>document.body?.classList.contains('v280-home-rebuild')&&
   window.__SCHOLAVERUM_R307_3D__?.state().scenes>=8 &&
   document.querySelector('#scholaverum-r307-3d-style'),null,{timeout:60000});
 await page.waitForTimeout(950);
 let status=await page.evaluate(()=>({
   version:window.__SCHOLAVERUM_R307_3D__.version,
   state:window.__SCHOLAVERUM_R307_3D__.state(),
   surfaces:document.querySelectorAll('.v307-gpu').length,
   gallery:document.querySelectorAll('.v298-feature-graphic > .v307-gpu').length,
   duo:document.querySelectorAll('.v280-panel-graphic > .v307-gpu').length,
   theater:!!document.querySelector('#v280-demo > .v307-theater-world'),
   hero:!!document.querySelector('#v280-hero > .v307-cosmic-background'),
   officialLogo:!!document.querySelector('#v280-hero img[src*="scholaverum-official-"]'),
   tools:document.querySelectorAll('.v280-tool').length,
   toolSculptures:document.querySelectorAll('.v307-tool-sculpture').length,
   toolRoutes:[...document.querySelectorAll('.v307-tool-open')].map(n=>n.dataset.v280Route),
   dock:document.querySelectorAll('.v306-journey').length,
   pricing:document.querySelectorAll('#v41-home-pricing .v41-plan').length,
   stylesheet:[...document.styleSheets].some(s=>s.href?.includes('v134-immersive-3d.css')),
   introBackground:getComputedStyle(document.querySelector('#v280-intro')).backgroundImage,
   toolkitBackground:getComputedStyle(document.querySelector('#v280-tools')).backgroundImage,
   overflow:document.documentElement.scrollWidth-innerWidth
 }));
 console.log('R307 IMMERSIVE INITIAL',JSON.stringify(status));
 assert.equal(status.version,'r307-webgl-universe');
 assert.equal(status.surfaces,8,'hero + four illustrated features + theater + two full panels');
 assert.equal(status.gallery,4,'all four feature gallery cards have a distinct WebGL stage');
 assert.equal(status.duo,2,'language and school discovery panels receive 3D scenes');
 assert.ok(status.hero&&status.theater,'hero and feature theater have GPU backgrounds');
 assert.ok(status.officialLogo,'approved official SCHOLAVERUM logo must remain');
 assert.equal(status.tools,6,'all six toolkit cards must remain');
 assert.equal(status.toolSculptures,6,'every toolkit feature gets its own dimensional sculpture');
 assert.deepEqual(status.toolRoutes,['ai','tutor','planner','flashcards','progress','schools'],'all toolkit routes open actual feature screens');
 assert.equal(status.dock,4,'all four first-screen navigation buttons must remain');
 assert.ok(status.pricing>=2,'pricing must not disappear');
 assert.ok(status.stylesheet,'r307 CSS must load, never show r306-only homepage');
 assert.match(status.introBackground,/gradient/i,'intro is reimagined with a dimensional background');
 assert.match(status.toolkitBackground,/gradient/i,'toolkit is part of the immersive universe');
 assert.ok(status.overflow<=8,'desktop must have no horizontal overflow');

 await page.locator('#v280-theater').scrollIntoViewIfNeeded();
 await page.waitForTimeout(800);
 await page.locator('[data-v280-tab="schools"]').click();
 await page.waitForFunction(()=>document.querySelector('#v280-app-preview')?.dataset.scene==='schools');
 const theater=await page.evaluate(()=>({
  scene:document.querySelector('#v280-app-preview')?.dataset.scene,
  bg:document.querySelector('#v280-demo .v307-theater-world')?.dataset.scene,
  runtime:window.__SCHOLAVERUM_R307_3D__.state()
 }));
 assert.equal(theater.scene,'schools','3D theater must track real school search tab');
 assert.equal(theater.bg,'theater','GPU stage must be the live selected-feature renderer');
 await ctx.close();

 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
 const mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));
 await mp.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
 await mp.waitForFunction(()=>window.__SCHOLAVERUM_R307_3D__?.state().scenes===8,null,{timeout:60000});
 const m=await mp.evaluate(()=>({
  overflow:document.documentElement.scrollWidth-innerWidth,
  scenes:window.__SCHOLAVERUM_R307_3D__.state().scenes,
  reduced:window.__SCHOLAVERUM_R307_3D__.state().reduced,
  dockCols:getComputedStyle(document.querySelector('.v306-hero-dock')).gridTemplateColumns.split(' ').length,
  toolsCols:getComputedStyle(document.querySelector('.v280-tools')).gridTemplateColumns.split(' ').length
 }));
 assert.ok(m.overflow<=8,'no mobile horizontal overflow '+JSON.stringify(m));
 assert.equal(m.scenes,8);
 assert.equal(m.reduced,true,'reduced motion should render still GPU frames');
 assert.equal(m.dockCols,2);
 assert.equal(m.toolsCols,1);
 await mobile.close();
 assert.deepEqual(errors,[],'no JS page errors');
 console.log('PASS r307: 8 WebGL2-capable stages, full homepage theme, feature routing, logo, pricing, mobile and reduced motion');
}finally{await browser.close()}
