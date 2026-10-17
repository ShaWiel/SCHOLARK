import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const results=[];
try{
  for(const viewport of [{width:1280,height:850,name:'desktop'},{width:390,height:844,name:'mobile'}]){
    const ctx=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
    await ctx.addInitScript(()=>{try{localStorage.setItem('scholark_ui_language','en')}catch{}});
    const page=await ctx.newPage();
    let translatedRequests=0;
    await page.route('**/api/learning/generate',async route=>{
      let d={};try{d=route.request().postDataJSON()}catch{}
      if(d?.mode==='translate_ui'){
        translatedRequests++;
        const translations=(d.strings||[]).map(source=>({source,translated:'SW: '+source}));
        await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,result:{translations}})});
      }else await route.continue().catch(()=>{});
    });
    await page.goto(base+'/#home',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>!!window.__SCHOLARK_I18N__&&!!document.querySelector('#v29-home-layer'),null,{timeout:20000});
    const createFixture=async root=>{
      await page.evaluate(root=>{
        document.getElementById('r278-i18n-fixture')?.remove();
        const fixture=document.createElement('section');fixture.id='r278-i18n-fixture';
        fixture.innerHTML='<span id="r278-label">Sign in</span><input id="r278-placeholder" placeholder="Sign in"><button id="r278-aria" aria-label="Sign in" title="Sign in">Sign in</button><img id="r278-image" alt="Sign in" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="><pre id="r278-code">Sign in</pre><input id="r278-secret" type="password" placeholder="Sign in"><span id="r278-remote">Explain my study plan</span>';
        (document.querySelector(root)||document.body).appendChild(fixture);
      },root);
    };
    const snapshot=()=>page.evaluate(()=>{
      const el=id=>document.getElementById(id);
      return {text:el('r278-label')?.textContent,placeholder:el('r278-placeholder')?.placeholder,aria:el('r278-aria')?.getAttribute('aria-label'),title:el('r278-aria')?.title,alt:el('r278-image')?.alt,button:el('r278-aria')?.textContent,code:el('r278-code')?.textContent,secret:el('r278-secret')?.placeholder,remote:el('r278-remote')?.textContent,lang:document.documentElement.lang,dir:document.documentElement.dir,ready:document.documentElement.dataset.scholarkI18nReady};
    });
    await createFixture('#v29-home-layer');
    await page.evaluate(()=>window.__SCHOLARK_I18N__.changeLanguage('nl'));
    await page.waitForFunction(()=>document.getElementById('r278-label')?.textContent==='Inloggen'&&document.getElementById('r278-image')?.alt==='Inloggen',{timeout:6500});
    let snap=await snapshot();
    for(const prop of ['text','placeholder','aria','title','alt','button'])assert.equal(snap[prop],'Inloggen',viewport.name+' home '+prop+' untranslated');
    assert.equal(snap.code,'Sign in','Code/pre content must not be translated');
    assert.equal(snap.secret,'Sign in','Password placeholders must not be translated');
    // Update nodes and accessibility attributes *in place*, without inserting a new element.
    await page.evaluate(()=>{
      document.getElementById('r278-label').firstChild.nodeValue='Sign out';
      document.getElementById('r278-placeholder').setAttribute('placeholder','Sign out');
      document.getElementById('r278-aria').setAttribute('aria-label','Sign out');
      document.getElementById('r278-aria').setAttribute('title','Sign out');
      document.getElementById('r278-image').setAttribute('alt','Sign out');
    });
    await page.waitForFunction(()=>document.getElementById('r278-label')?.textContent==='Uitloggen'&&document.getElementById('r278-image')?.alt==='Uitloggen'&&document.getElementById('r278-placeholder')?.placeholder==='Uitloggen',null,{timeout:7000});
    snap=await snapshot();
    for(const prop of ['text','placeholder','aria','title','alt'])assert.equal(snap[prop],'Uitloggen',viewport.name+' live update '+prop);
    await page.evaluate(()=>window.__SCHOLARK_I18N__.changeLanguage('fr'));
    await page.waitForFunction(()=>document.getElementById('r278-label')?.textContent==='Se déconnecter',null,{timeout:5000});
    snap=await snapshot();
    assert.equal(snap.alt,'Se déconnecter',viewport.name+' French image alternative');
    await page.evaluate(()=>window.__SCHOLARK_I18N__.changeLanguage('en'));
    await page.waitForFunction(()=>document.getElementById('r278-label')?.textContent==='Sign out'&&document.getElementById('r278-image')?.alt==='Sign out',null,{timeout:6000});
    snap=await snapshot();assert.equal(snap.placeholder,'Sign out');assert.equal(snap.aria,'Sign out');
    // Workspace labels share the same engine; changing routes cannot strand an earlier locale.
    await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>!!window.__SCHOLARK_I18N__&&!!document.getElementById('v51-main'),null,{timeout:20000});
    await createFixture('#v51-main');
    await page.evaluate(()=>window.__SCHOLARK_I18N__.changeLanguage('es'));
    await page.waitForFunction(()=>document.getElementById('r278-label')?.textContent==='Iniciar sesión',null,{timeout:7000});
    snap=await snapshot();assert.equal(snap.placeholder,'Iniciar sesión');assert.equal(snap.alt,'Iniciar sesión');
    // One of 68 provider-backed languages must translate fresh workspace copy.
    await page.evaluate(()=>window.__SCHOLARK_I18N__.changeLanguage('sw'));
    await page.waitForFunction(()=>document.getElementById('r278-remote')?.textContent==='SW: Explain my study plan',null,{timeout:13000});
    assert.ok(translatedRequests>0,viewport.name+' Swahili must exercise provider translation, not just cached copy');
    await page.evaluate(()=>window.__SCHOLARK_I18N__.changeLanguage('ar'));
    await page.waitForFunction(()=>document.documentElement.dir==='rtl',null,{timeout:4500});
    await page.evaluate(()=>window.__SCHOLARK_I18N__.changeLanguage('en'));
    await page.waitForFunction(()=>document.documentElement.lang==='en'&&document.documentElement.dir==='ltr'&&document.getElementById('r278-remote')?.textContent==='Explain my study plan',null,{timeout:7500});
    snap=await snapshot();assert.equal(snap.alt,'Sign in');assert.equal(snap.code,'Sign in');assert.equal(snap.secret,'Sign in');
    results.push({viewport:viewport.name,coreLocales:['nl','fr','es','en'],provider:'sw',rtl:'ar',dynamicAttrs:true,liveText:true,restoredEnglish:true,providerCalls:translatedRequests});
    await ctx.close();
  }
  console.log('SCHOLAVERUM r278 LIVE I18N PASS '+JSON.stringify(results));
}finally{await browser.close()}
