import fs from 'node:fs';
import assert from 'node:assert/strict';
import { chromium, firefox, webkit, devices } from 'playwright';

// Browser engine tests on emulated profiles; not physical phones.
const script=fs.readFileSync(new URL('../scholark-v122-connect.js',import.meta.url),'utf8');
const anchor='  window.__SCHOLARK_CONNECT__={';
assert.ok(script.includes(anchor));
const instrumented=script.replace(anchor,'  window.__CONNECT_BROWSER_QA__={state,wireDeviceContactDiscovery,clearDeviceContacts};\n'+anchor);
const markup='<main id="v51-fallback">' +
'<div id="v122-status"></div>'+
'<label><input id="v122-contacts-visible" type="checkbox">Opt in</label>'+
'<button id="v122-pick">Select contacts</button>'+
'<button id="v122-import">Import</button>'+
'<input id="v122-file" type="file" accept=".vcf,.csv">'+
'<input id="v122-phone-prefix" value="+597">'+
'<input id="v122-contact-filter">'+
'<div id="v122-contact-candidates"></div>'+
'<div id="v122-contact-matches"></div>'+
'<button id="v122-clear-contacts">Clear</button>'+
'<button id="v122-search-contacts">Search</button>'+
'</main>';
const vcard='BEGIN:VCARD\r\nVERSION:3.0\r\nFN:Example iPhone\r\nEMAIL:iphone@example.test\r\nTEL;TYPE=CELL:+5978110013\r\nEND:VCARD\r\n';
const csv='Full Name,Email Address,Mobile Phone\r\n"Example, Desktop",desktop@example.test,+5978110014\r\n';
const cases=[
  {name:'Chromium Android profile',browser:chromium,device:devices['Pixel 7'],kind:'picker'},
  {name:'WebKit iPhone profile',browser:webkit,device:devices['iPhone 13'],kind:'vcf'},
  {name:'Firefox desktop profile',browser:firefox,device:{viewport:{width:1440,height:900}},kind:'csv'}
];
for(const scenario of cases){
  const browser=await scenario.browser.launch({headless:true});
  try{
    const context=await browser.newContext(scenario.device);
    const page=await context.newPage();
    page.on('dialog',d=>d.accept());
    await page.setContent(markup);
    await page.evaluate(()=>{
      window.__SCHOLARK_TEST_MODE__=true;
      window.__SCHOLARK_V72_CLOUD__={currentSession:()=>({access_token:'MOCKED_TEST_JWT',user:{id:'00000000-0000-4000-8000-000000000001'}})};
      window.__CALL_LOOKUP__=[];
      window.fetch=async(url,opts)=>{
        window.__CALL_LOOKUP__.push({url:String(url),body:opts?.body||''});
        return new Response(JSON.stringify([{user_id:'00000000-0000-4000-8000-000000000013',handle:'test13',display_name:'Test Thirteen'}]),
          {status:200,headers:{'content-type':'application/json'}});
      };
    });
    await page.addScriptTag({content:instrumented});
    await page.evaluate(()=>{window.__CONNECT_BROWSER_QA__.state.profile={contact_discovery_enabled:false};window.__CONNECT_BROWSER_QA__.wireDeviceContactDiscovery()});
    assert.equal(await page.locator('#v122-contacts-visible').isChecked(),false,scenario.name+' must default OFF');
    if(scenario.kind==='picker'){
      await page.evaluate(()=>Object.defineProperty(navigator,'contacts',{configurable:true,value:{
        select:async(fields,opts)=>{
          if(!fields.includes('email')||!opts.multiple)throw Error('Contact picker options invalid');
          return[{name:['Android Example'],email:['android@example.test'],tel:['+5978110015']}];
        }
      }}));
      await page.locator('#v122-pick').click();
    }else{
      await page.locator('#v122-pick').click();
      assert.match(await page.locator('#v122-status').innerText(),/import.*\.vcf|browser/i);
      await page.locator('#v122-file').setInputFiles({
        name:scenario.kind==='vcf'?'contacts.vcf':'contacts.csv',
        mimeType:scenario.kind==='vcf'?'text/vcard':'text/csv',
        buffer:Buffer.from(scenario.kind==='vcf'?vcard:csv)
      });
    }
    await page.waitForFunction(()=>window.__CONNECT_BROWSER_QA__.state.contacts.length===1);
    assert.equal(await page.locator('input[data-contact="0"]').count(),1,scenario.name+' import selector');
    assert.equal(await page.locator('input[data-contact="0"]').isChecked(),false,scenario.name+' must not auto-select');
    await page.locator('input[data-contact="0"]').check();
    await page.locator('#v122-search-contacts').click();
    await page.waitForFunction(()=>window.__CONNECT_BROWSER_QA__.state.contactMatches.length===1);
    const data=await page.evaluate(()=>{
      const r=window.__CALL_LOOKUP__.find(c=>c.url.endsWith('/rpc/connect_find_contacts'));
      return {json:JSON.parse(r.body),remaining:window.__CONNECT_BROWSER_QA__.state.contacts.length,
        matches:window.__CONNECT_BROWSER_QA__.state.contactMatches.length}
    });
    assert.equal(data.remaining,0,scenario.name+' raw contacts were not cleared');
    assert.equal(data.matches,1,scenario.name+' contact results');
    assert.equal(data.json.p_emails.length,1);
    assert.equal(data.json.p_phones.length,1);
    assert.ok(!JSON.stringify(data).includes('Example iPhone')&&!JSON.stringify(data).includes('Android Example'),'Names should not be uploaded');
    console.log('PASS '+scenario.name+': import/picker selection, consent, E.164 lookup, in-memory cleanup');
    await context.close();
  }finally{await browser.close()}
}
