import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await context.addInitScript(()=>{
 localStorage.setItem('scholark_ui_language','en');
 localStorage.setItem('scholark_v51_planner',JSON.stringify([{id:'r285-done',text:'Completed study session',status:'done',completedAt:new Date().toISOString()},{id:'r285-next',text:'Prepare for next week',status:'todo',date:'2099-01-01'}]));
 localStorage.setItem('scholark_v51_goals',JSON.stringify([{id:'r285-goal-a',text:'Understand economics',status:'active',progress:20},{id:'r285-goal-b',text:'Learn Spanish',status:'active',progress:10}]));
 localStorage.setItem('scholark_v106_focus_history',JSON.stringify([{id:'r285-focus',minutes:25,endedAt:Date.now()}]));
});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
let releaseFoundation;
const foundationGate=new Promise(resolve=>{releaseFoundation=resolve});
await page.route('**/scholark-v114-workspace-orchestrator.js?*',async route=>{await foundationGate;await route.continue()});
const dashboard=async()=>{
 await page.locator('#v51-sidebar [data-v51-tool="dashboard"]').click();
 await page.waitForSelector('[data-workspace-layout="r285"] #v284-title',{state:'visible',timeout:25000});
};
async function capture(name){if(!process.env.SCHOLAVERUM_QA_DIR)return;mkdirSync(process.env.SCHOLAVERUM_QA_DIR,{recursive:true});await page.screenshot({path:process.env.SCHOLAVERUM_QA_DIR+'/'+name+'.png'})}
try{
 await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForSelector('#v284-prompt',{state:'visible',timeout:25000});
 await page.locator('[data-v284-mode="tutor"]').click();
 await page.locator('#v284-prompt').fill('Keep my first question while the Workspace connects.');
 await page.locator('#v284-compose').evaluate(el=>el.requestSubmit());
 await page.waitForFunction(()=>document.querySelector('#v284-compose')?.getAttribute('aria-busy')==='true');
 assert.equal(await page.locator('#v284-prompt').inputValue(),'Keep my first question while the Workspace connects.');
 releaseFoundation();
 await page.waitForFunction(()=>location.hash==='#tutor'&&document.querySelector('#v52-tutor-q')?.value==='Keep my first question while the Workspace connects.',null,{timeout:30000});
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('scholark_v108_arki_prompt')),null,'an early Tutor request must not leak into an ARKI draft');
 await dashboard();
 await page.waitForFunction(()=>document.querySelector('[data-v285-stat="completed"]')?.textContent==='1'&&document.querySelector('[data-v285-stat="focus"]')?.textContent==='25'&&document.querySelector('[data-v285-stat="goals"]')?.textContent==='2',null,{timeout:15000});
 const brand=await page.evaluate(()=>{
  const root=document.querySelector('[data-workspace-layout="r285"]'),h=root.querySelector('h1'),ask=root.querySelector('.v285-ask').getBoundingClientRect(),next=root.querySelector('.v284-today').getBoundingClientRect();
  return {font:getComputedStyle(h).fontFamily,weight:Number(getComputedStyle(h).fontWeight),background:getComputedStyle(document.querySelector('#v51-main')).backgroundColor,rail:getComputedStyle(document.querySelector('#v51-sidebar')).backgroundColor,action:getComputedStyle(root.querySelector('.v284-today')).backgroundColor,sideBySide:ask.right<=next.left+2,marks:root.querySelectorAll('.v285-orbit img[src="/scholaverum-official-logo-r290.webp"]').length,icons:root.querySelectorAll('.v51-card .icon svg').length,oldSpark:root.querySelectorAll('.v284-spark').length,main:document.querySelectorAll('#v51-main').length};
 });
 assert.match(brand.font,/Inter|system-ui/);assert.doesNotMatch(brand.font,/Georgia|Times/);assert.ok(brand.weight>=800);
 assert.equal(brand.background,'rgb(17, 24, 39)');assert.equal(brand.rail,'rgb(11, 17, 30)');assert.equal(brand.action,'rgb(201, 255, 106)');
 assert.equal(brand.main,1);assert.equal(brand.marks,1);assert.equal(brand.oldSpark,0);assert.equal(brand.icons,18);assert.ok(brand.sideBySide,'desktop has a workbench and next-step column');
 await capture('workspace-r285-desktop');
 await page.locator('#v285-tool-search').fill('planner');
 assert.equal(await page.locator('.v51-card:visible').count(),1,'search filters the real tool directory');
 assert.equal(await page.locator('.v51-card:visible').getAttribute('data-v51-tool'),'planner');
 await page.locator('#v284-prompt').fill('A draft worth keeping.');
 await page.evaluate(()=>{const root=document.querySelector('[data-workspace-layout="r285"]');root.appendChild(root.querySelector('.v51-head').cloneNode(true))});
 await page.waitForFunction(()=>document.querySelectorAll('[data-workspace-layout="r285"] .v51-head').length===1,null,{timeout:10000});
 assert.equal(await page.locator('#v284-prompt').inputValue(),'A draft worth keeping.');
 assert.equal(await page.locator('#v285-tool-search').inputValue(),'planner');
 assert.equal(await page.locator('.v51-card:visible').count(),1);
 await page.locator('#v285-tool-search').fill('a tool that does not exist');
 assert.equal(await page.locator('.v51-card:visible').count(),0);assert.ok(await page.locator('.v285-no-tools').isVisible());
 await page.locator('#v285-tool-search').fill('');assert.equal(await page.locator('.v51-card:visible').count(),18);
 await page.locator('[data-v285-library]').click();await capture('workspace-r285-tools');
 await page.evaluate(()=>localStorage.setItem('scholark_v51_goals',JSON.stringify([{id:'r285-goal-a',text:'Understand economics',status:'active',progress:30}])));
 await page.waitForFunction(()=>document.querySelector('[data-v285-stat="goals"]')?.textContent==='1',null,{timeout:10000});
 await page.evaluate(()=>window.__SCHOLARK_I18N__.changeLanguage('nl'));
 await page.waitForFunction(()=>document.querySelector('#v284-title')?.textContent==='Jouw volgende doorbraak begint hier.',null,{timeout:15000});
 assert.equal(await page.locator('#v285-tool-search').getAttribute('placeholder'),'Zoek een tool');
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>document.querySelector('#v51-main').scrollTo(0,0));
 const mobile=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth,main:document.querySelector('#v51-main').scrollWidth,client:document.querySelector('#v51-main').clientWidth,prompt:document.querySelector('#v284-prompt').getBoundingClientRect().width}));
 assert.ok(mobile.document<=mobile.viewport+2&&mobile.main<=mobile.client+2,'the brand layout must not overflow mobile');assert.ok(mobile.prompt>=250,'mobile question composer remains usable');
 await capture('workspace-r285-mobile');
 assert.deepEqual(errors,[],'brand, filter, repair and handoff flows have no browser exceptions');
 console.log('PASS r285 SCHOLAVERUM identity: native brand, workbench layout, honest reactive metrics, tool search, draft-safe repair, early Tutor handoff, Dutch copy and mobile layout');
}finally{releaseFoundation();await browser.close()}
