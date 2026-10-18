import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:950},reducedMotion:'reduce'});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>localStorage.setItem('scholark_ui_language','en'));
try{
 await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForSelector('#v280-pricing-slot #v41-home-pricing .v41-price-grid',{state:'visible',timeout:45000});
 const d=await page.evaluate(()=>{
  const root=document.querySelector('#v280-editorial-home');
  const pricing=root.querySelector('#v41-home-pricing'),slot=pricing.parentElement;
  const cards=[...pricing.querySelectorAll('.v41-plan')];
  const nav=[...document.querySelectorAll('#v280-header-links [data-v280-scroll]')];
  const old=document.querySelector('#v29-home-layer>.v29-shell');
  return {home:document.body.classList.contains('v280-home-rebuild'),
   slot:slot.id,pricingCount:document.querySelectorAll('#v41-home-pricing').length,
   oldHidden:old?getComputedStyle(old).display==='none':true,
   heading:pricing.querySelector('.v41-price-head h2')?.innerText,
   cards:cards.map(x=>({name:x.querySelector('h3')?.textContent,
      cost:x.querySelector('.v41-price')?.innerText,
      credits:x.querySelector('ul')?.innerText.match(/[\d,]+ included AI credits\/month/i)?.[0]||'',
      button:x.querySelector('[data-plan]')?.dataset.plan,
      width:x.getBoundingClientRect().width,
      background:getComputedStyle(x).backgroundColor,
      color:getComputedStyle(x).color})),
   grid:getComputedStyle(pricing.querySelector('.v41-price-grid')).gridTemplateColumns,
   nav:nav.find(x=>x.dataset.v280Scroll==='v280-pricing-slot')?.textContent,
   ctaOrder:[...root.children].map(x=>x.id||x.className),
   paidButtons:pricing.querySelectorAll('[data-plan="plus"],[data-plan="pro"]').length};
 });
 assert.equal(d.home,true,'new editorial homepage remains authoritative');
 assert.equal(d.slot,'v280-pricing-slot','original checkout cards live inside editorial homepage');
 assert.equal(d.pricingCount,1,'legacy pricing must not be duplicated');
 assert.equal(d.oldHidden,true,'legacy homepage never returns');
 assert.match(d.heading,/MORE SPACE/);
 assert.equal(d.cards.length,3,'retain Free Plus Pro');
 assert.deepEqual(d.cards.map(x=>x.button),['free','plus','pro'],'billing data-plan hooks unchanged');
 assert.deepEqual(d.cards.map(x=>x.cost.replace(/\s+/g,' ').trim()),['$0 / month','$14.99 / month','$19.99 / month'],'subscription amounts are unchanged');
 assert.deepEqual(d.cards.map(x=>x.credits),['30 included AI credits/month','750 included AI credits/month','2,500 included AI credits/month']);
 assert.ok(d.cards.every(x=>x.width>280),'pricing cards remain legible on desktop');
 assert.notEqual(d.cards[0].background,d.cards[1].background,'editorial pricing has differentiated dark/cream cards');
 assert.ok(d.nav?.includes('pricing'),'homepage navigation opens the integrated price section');
 assert.equal(d.paidButtons,2,'Paddle checkout plan ownership remains present');
 assert.ok(d.ctaOrder.indexOf('v280-pricing-slot')<d.ctaOrder.indexOf('v280-final'),'pricing appears before homepage final call to action');
 await page.goto(base+'/#pricing',{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForSelector('#v280-pricing-slot #v41-home-pricing .v41-price-grid',{state:'visible',timeout:40000});
 assert.equal(await page.evaluate(()=>document.body.classList.contains('v280-home-rebuild')),true,'direct #pricing route must not show the old homepage');
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(170);
 const mobile=await page.evaluate(()=>{
  const grid=document.querySelector('#v41-home-pricing .v41-price-grid');
  const cards=[...document.querySelectorAll('#v41-home-pricing .v41-plan')];
  return {columns:getComputedStyle(grid).gridTemplateColumns.split(' ').length,
   cardWidths:cards.map(x=>x.getBoundingClientRect().width),
   documentOverflow:document.documentElement.scrollWidth-innerWidth,
   buttons:cards.map(x=>({width:x.querySelector('button').getBoundingClientRect().width,disabled:x.querySelector('button').disabled})),
   displayed:getComputedStyle(document.querySelector('#v41-home-pricing')).display};
 });
 assert.equal(mobile.columns,1,'mobile shows one spacious plan per row');
 assert.ok(mobile.cardWidths.every(w=>w>300&&w<=390),'cards fit mobile viewport');
 assert.ok(mobile.buttons.every(b=>b.width>220&&!b.disabled),'plan selection buttons stay accessible');
 assert.ok(mobile.documentOverflow<=8,'no horizontal page overflow from pricing');
 assert.notEqual(mobile.displayed,'none','pricing remains visible on mobile');
 await page.locator('#v41-home-pricing [data-plan="plus"]').click();
 await page.waitForFunction(()=>sessionStorage.getItem('scholark_pending_plan')==='plus',null,{timeout:14000});
 assert.equal(await page.evaluate(()=>sessionStorage.getItem('scholark_pending_plan')),'plus','Plus retains the existing authentication-first Paddle flow');
 assert.deepEqual(errors,[],'pricing, route and checkout links must not cause unhandled browser errors');
 console.log('PASS r293 editorial pricing: existing Free/Plus/Pro prices, credit allocation, billing ownership, #pricing route and mobile layout');
}finally{await browser.close()}
