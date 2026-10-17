import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:10000';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
try {
  await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.querySelector('#v123-story')&&document.querySelectorAll('.v123-story-card').length===3,{timeout:60000});
  const desktop = await page.evaluate(()=>{
    const hero=document.querySelector('#v29-home-layer .v29-hero');
    const story=document.querySelector('#v123-story');
    const nav=document.querySelector('#v123-home-nav');
    const cta=document.querySelector('#v123-hero-cta button');
    return {hero:!!hero,story:!!story,nav:nav?.querySelectorAll('button').length||0,cta:!!cta,
      sections:document.querySelectorAll('#v29-home-layer #v29-studio, #v123-story, #v123-discover').length,
      homeClass:document.body.classList.contains('v123-cinematic-home')};
  });
  assert.equal(desktop.hero,true,'original interactive hero should be preserved');
  assert.equal(desktop.story,true,'new editorial journey should mount');
  assert.equal(desktop.nav,4,'desktop section navigation should provide four functional destinations');
  assert.equal(desktop.cta,true,'hero exploration action should be present');
  assert.equal(desktop.sections,3,'learning preview, journey and discover sections should exist');
  assert.equal(desktop.homeClass,true,'cinematic design must apply only to public home');

  await page.locator('#v123-hero-cta [data-v123-scroll="experience"]').click();
  await page.waitForFunction(()=>window.scrollY>80,{timeout:10000});

  await page.locator('#v55-language').selectOption('nl');
  await page.waitForFunction(()=>document.querySelector('#v123-story-title')?.textContent?.includes('potentieel'),{timeout:20000});
  await page.locator('#v55-language').selectOption('en');
  await page.waitForFunction(()=>document.querySelector('#v123-story-title')?.textContent?.includes('potential'),{timeout:20000});

  await page.setViewportSize({width:390,height:844});
  const mobile = await page.evaluate(()=>{
    const cards=[...document.querySelectorAll('.v123-story-card')];
    const nav=document.querySelector('#v123-home-nav');
    return {overflow:document.documentElement.scrollWidth-innerWidth,
      cards:cards.map(card=>{const r=card.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width}}),
      navHidden:nav?getComputedStyle(nav).display==='none':true,
      motion:getComputedStyle(document.querySelector('#v29-home-layer .v29-device')).animationName};
  });
  assert.ok(mobile.overflow<=8,'mobile homepage should not create page-wide horizontal overflow: '+mobile.overflow);
  assert.ok(mobile.cards.every(card=>card.left>=-3&&card.right<=393),'journey cards should fit a 390px device');
  assert.equal(mobile.navHidden,true,'compact mobile topbar should not be crowded by extra navigation');
  assert.equal(mobile.motion,'none','respect reduced motion setting');

  await page.evaluate(()=>location.hash='#ai');
  await page.waitForFunction(()=>!document.body.classList.contains('v123-cinematic-home'),{timeout:20000});
  assert.equal(await page.evaluate(()=>document.querySelector('#v123-progress')?.hidden),true,'progress must not cover the workspace');
  await page.evaluate(()=>location.hash='#home');
  await page.waitForFunction(()=>document.body.classList.contains('v123-cinematic-home'),{timeout:20000});
  assert.equal(await page.locator('#v123-story').count(),1,'returning home should not duplicate the story');
  assert.equal(await page.locator('#v123-home-nav').count(),1,'returning home should not duplicate navigation');
  assert.deepEqual(errors,[],'page should not emit uncaught JavaScript exceptions');
  console.log('PASS r279 cinematic homepage: desktop, navigation, i18n, mobile, reduced motion, workspace isolation, return home');
} finally {
  await browser.close();
}