import { chromium } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const languages=['en','nl','es','fr','de','pt','zh','ja','ko','hi','ru','ar','he','fa','ur'];
const rtl=new Set(['ar','he','fa','ur']);
const failures=[],rows=[];
const browser=await chromium.launch({headless:true});
try{
  for(const viewport of [{name:'desktop',width:1365,height:820},{name:'mobile',width:390,height:844}]){
    const sample=viewport.name==='desktop'?languages:['de','pt','zh','hi','ar','he','ur'];
    const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height}});
    const page=await context.newPage();
    for(const code of sample){
      await page.goto(base+'/#home',{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>!!window.__SCHOLARK_I18N__,null,{timeout:15000});
      await page.evaluate(async c=>{await window.__SCHOLARK_I18N__.changeLanguage(c)},code);
      await page.waitForFunction(c=>document.documentElement.lang===c&&document.documentElement.dataset.scholarkI18nReady===c,code,{timeout:20000});
      const m=await page.evaluate(code=>{
        const html=document.documentElement,select=document.querySelector('#v55-language')||document.querySelector('#v90-language');
        const body=document.body,overflow=Math.max(html.scrollWidth,body?.scrollWidth||0)-innerWidth;
        const duplicateOverlays=document.querySelectorAll('#v90-language-overlay').length;
        return {dir:html.dir,lang:html.lang,overflow,optionCount:select?.options?.length||0,duplicateOverlays,title:document.title};
      },code);
      const expectedDir=rtl.has(code)?'rtl':'ltr';
      const ok=m.dir===expectedDir&&m.lang===code&&m.overflow<=6&&m.optionCount===74&&m.duplicateOverlays===1;
      rows.push({viewport:viewport.name,code,...m,ok});
      if(!ok)failures.push({viewport:viewport.name,code,...m,expectedDir});
    }
    await context.close();
  }
  console.log('SCHOLARK I18N VISUAL SMOKE',JSON.stringify({ok:failures.length===0,languages:languages.length,checks:rows.length,rows,failures}));
  if(failures.length)process.exitCode=1;
}finally{await browser.close()}
