import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1360,height:850},reducedMotion:'reduce'});
const open=async name=>{
  const button=page.locator('#v51-sidebar [data-v51-tool="'+name+'"]');
  await button.waitFor({state:'visible',timeout:12000});
  await button.click();
  await page.waitForFunction(name=>location.hash==='#'+name,name,{timeout:12000});
};
const wait=async selector=>page.waitForSelector(selector,{state:'visible',timeout:30000});
try{
 await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForFunction(()=>window.__SCHOLARK_WORKSPACE__?.openTool && document.body.classList.contains('v51-workspace'),null,{timeout:30000});
 await page.waitForFunction(()=>[...document.querySelectorAll('link[rel="stylesheet"]')].some(x=>x.href.includes('scholark-v126-workspace-integrity.css?v=20261017-r283-premium')),null,{timeout:20000});
 await open('ai');await wait('#v107-ai .v107-main');
 const arki=await page.evaluate(()=>{
  const root=document.getElementById('v107-ai'),header=root.querySelector('.v107-head h1'),input=root.querySelector('.v107-compose textarea'),panel=root.querySelector('.v107-main');
  return {heading:parseFloat(getComputedStyle(header).fontSize),input:parseFloat(getComputedStyle(input).fontSize),
   surface:getComputedStyle(panel).backgroundColor,radius:parseFloat(getComputedStyle(panel).borderTopLeftRadius),
   count:document.querySelectorAll('#v107-ai').length};
 });
 assert.equal(arki.count,1,'ARKI must mount once');
 assert.ok(arki.heading>=30&&arki.heading<=60,'ARKI heading should follow premium typography');
 assert.ok(arki.input>=13,'ARKI input must be legible');
 assert.ok(arki.radius>=18,'ARKI surface should use shared rounding');
 await open('tutor');await wait('#v51-fallback .v52-tool');
 const tutor=await page.evaluate(()=>{
  const t=document.querySelector('.v52-tool[data-v52-tool="tutor"]');
  const heading=t?.querySelector('.v52-head h1');
  return {count:document.querySelectorAll('.v52-tool[data-v52-tool="tutor"]').length,
   heading:heading?parseFloat(getComputedStyle(heading).fontSize):0};
 });
 assert.equal(tutor.count,1,'AI Tutor must mount once');
 assert.ok(tutor.heading>=30,'AI Tutor heading should match the new typography');
 await open('language');await wait('.v93-hero');
 const language=await page.evaluate(()=>{
   const r=document.querySelector('.v93'),p=r?.querySelector('.v93-card');
   return {font:parseFloat(getComputedStyle(r.querySelector('select')).fontSize),cardRadius:parseFloat(getComputedStyle(p).borderTopLeftRadius)};
 });
 assert.ok(language.font>=12,'Language Learner inputs must be legible');
 assert.ok(language.cardRadius>=19,'Language Learner should use premium card shape');
 await open('dashboard');await wait('#v51-main [data-v51-page="dashboard"].active .v51-grid');
 const aligned=await page.evaluate(()=>{
  const root=document.querySelector('#v51-main [data-v51-page="dashboard"].active');
  const a=root.querySelector('.v51-levels').getBoundingClientRect(),b=root.querySelector('.v51-head').getBoundingClientRect(),c=root.querySelector('.v51-grid').getBoundingClientRect();
  return a.bottom<=b.top+15&&b.bottom<=c.top+15;
 });
 assert.ok(aligned,'Workspace levels, headline and cards must not overlap after tool switches');
 await page.setViewportSize({width:390,height:780});
 await open('ai');await wait('#v107-ai .v107-layout');
 const mobile=await page.evaluate(()=>{
  const r=document.querySelector('#v107-ai .v107-layout');
  return {columns:getComputedStyle(r).gridTemplateColumns,visible:r.getBoundingClientRect().width>0};
 });
 assert.ok(mobile.visible,'ARKI must remain visible on mobile');
 assert.equal(mobile.columns.trim().split(/\s+/).length,1,'ARKI needs a single mobile column');
 console.log('PASS r283 premium Workspace: ARKI, AI Tutor, Language Learner typography, route isolation and mobile layout');
}finally{await browser.close()}
