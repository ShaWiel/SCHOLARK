import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const origin=process.argv[2]||'http://127.0.0.1:10000';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const errors=[];
await page.addInitScript(()=>localStorage.setItem('scholark_ui_language','en'));
page.on('pageerror',error=>errors.push(error.message));
try{
  await page.goto(origin+'/#home',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>{
    const root=document.querySelector('#v280-editorial-home');
    return !!root&&!!document.querySelector('#v280-editorial-home .v280-hero')&&document.querySelectorAll('#v280-editorial-home .v280-tool').length===6&&!!document.querySelector('#v280-header-links');
  },null,{timeout:60000});
  const desktop=await page.evaluate(()=>{
    const root=document.querySelector('#v280-editorial-home'),old=document.querySelector('#v29-home-layer>.v29-shell');
    const style=getComputedStyle(old),head=document.querySelector('#v280-hero'),bar=document.querySelector('#v55-topbar');
    return {sections:root.querySelectorAll('section').length,oldHidden:style.display==='none',header:!!bar,
      heroVisible:head.getBoundingClientRect().height>500,
      tabs:root.querySelectorAll('[role="tab"]').length,
      stories:root.querySelectorAll('.v280-duo .v280-panel').length,
      tools:root.querySelectorAll('.v280-tool').length,
      title:root.querySelector('h1')?.textContent?.trim(),
      cssLoaded:[...document.styleSheets].some(s=>s.href?.includes('scholark-v124-editorial-home.css'))
    };
  });
  assert.ok(desktop.oldHidden,'Old home must actually be hidden, not merely restyled');
  assert.ok(desktop.cssLoaded,'r280 stylesheet must be served by Docker');
  assert.ok(desktop.header&&desktop.heroVisible,'full-bleed cinematic hero must appear');
  assert.equal(desktop.tabs,4,'four interactive demo tabs');
  assert.equal(desktop.stories,2,'two immersive language/schools panels');
  assert.equal(desktop.tools,6,'six complete feature descriptions');
  assert.ok(desktop.sections>=6&&desktop.title?.includes('LEARN'),'new editorial narrative must replace old landing');
  await page.waitForSelector('#v55-workspace-cta .v55-entry',{state:'visible',timeout:8000});
  assert.equal(await page.locator('#v280-hero #v55-workspace-cta .v55-entry').count(),1,'Canonical Workspace CTA must be visible within new hero');
  await page.locator('#v280-tab-tutor').click();
  assert.equal(await page.locator('#v280-tab-tutor').getAttribute('aria-selected'),'true');
  assert.match(await page.locator('#v280-app-preview').innerText(),/plant|sunlight/i);
  await page.locator('#v280-tab-language').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#v280-tab-schools').getAttribute('aria-selected'),'true');
  assert.ok(await page.locator('#v280-app-preview .v280-map').count()===1,'school product visualization must switch');
  await page.locator('#v280-header-links [data-v280-scroll="v280-tools"]').click();
  await page.waitForFunction(()=>scrollY>200,null,{timeout:10000});
  await page.locator('#v55-language').selectOption('nl');
  await page.waitForFunction(()=>document.querySelector('#v280-headline')?.textContent?.includes('ZONDER'),null,{timeout:20000});
  await page.locator('#v55-language').selectOption('en');
  await page.waitForFunction(()=>document.querySelector('#v280-headline')?.textContent?.includes('WITHOUT'),null,{timeout:20000});
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>scrollTo(0,0));
  const mobile=await page.evaluate(()=>{
    const main=document.querySelector('#v280-editorial-home');
    const hero=document.querySelector('#v280-hero'),cards=[...main.querySelectorAll('.v280-tool')];
    return {
      overflow:document.documentElement.scrollWidth-innerWidth,heroWidth:hero.getBoundingClientRect().width,
      sections:main.querySelectorAll('.v280-panel').length,
      cardsFit:cards.every(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.left>=-2&&r.right<=innerWidth+2}),
      motion:getComputedStyle(main.querySelector('.v280-tape-inner')).animationName,
      mobileMenu:getComputedStyle(document.querySelector('#v280-header-links')).display
    };
  });
  assert.ok(mobile.overflow<=8,'mobile horizontal overflow '+mobile.overflow);
  assert.ok(mobile.heroWidth<=392,'mobile hero overflows viewport');
  assert.ok(mobile.cardsFit,'feature cards must be inside mobile viewport');
  assert.equal(mobile.motion,'none','reduced-motion preference must stop marquee');
  assert.equal(mobile.mobileMenu,'none','mobile topbar must stay uncluttered');
  await page.locator('#v280-hero [data-v280-route="ai"]').click();
  await page.waitForFunction(()=>location.hash==='#ai'&&!document.body.classList.contains('v280-home-rebuild'),null,{timeout:20000});
  await page.evaluate(()=>location.hash='#home');
  await page.waitForFunction(()=>document.body.classList.contains('v280-home-rebuild')&&!!document.querySelector('#v280-editorial-home'),null,{timeout:20000});
  assert.equal(await page.locator('#v280-editorial-home').count(),1,'return home must reuse same editorial root');
  assert.equal(await page.locator('#v280-header-links').count(),1,'return home must not duplicate navigation');
  assert.deepEqual(errors,[],'no uncaught browser JavaScript exceptions');
  console.log('PASS r280 homepage rebuild: complete replacement, CSS, CTA, tabs, keyboard, translation, mobile, reduced motion, workspace isolation');
}finally{await browser.close()}
