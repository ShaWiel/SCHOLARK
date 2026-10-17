import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const SB='https://yhafbwdnnpvuedycdkll.supabase.co';
const UID='11111111-1111-4111-8111-111111111111';
const BID='22222222-2222-4222-8222-222222222222';
const rows=[
 {id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',user_id:UID,field:'Economics',country:'Suriname',target_school:'',data:{result:{title:'Economics study plan',overview:'Economic systems',skills:['Analysis']},horizon:'6 months'},updated_at:'2026-10-17T08:00:00Z'},
 {id:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',user_id:UID,field:'Hospitality',country:'Suriname',target_school:'',data:{result:{title:'Hospitality study plan',overview:'Operations',skills:['Service']},horizon:'3 months'},updated_at:'2026-10-17T08:10:00Z'},
 {id:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',user_id:BID,field:'Private studies',country:'Guyana',target_school:'',data:{result:{title:'Other user',overview:'Never visible'}},updated_at:'2026-10-17T08:20:00Z'}
];
const calls=[],browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:970},reducedMotion:'reduce'});
await context.addInitScript(uid=>{
 localStorage.setItem('scholark_ui_language','en');
 localStorage.setItem('scholark_country','Suriname');
 localStorage.setItem('scholark_supabase_session_v2',JSON.stringify({access_token:'r286-test-token',refresh_token:'r286-refresh-token',expires_at:Math.floor(Date.now()/1000)+3600,token_type:'bearer',user:{id:uid,email:'student@example.test'}}));
},UID);
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.route(SB+'/rest/v1/**',async route=>{
 const req=route.request(),url=new URL(req.url()),method=req.method();
 if(url.pathname.endsWith('/study_ahead')){
  const filter=String(url.searchParams.get('user_id')||'');
  const uid=filter.startsWith('eq.')?filter.slice(3):'';
  calls.push({method,uid,id:url.searchParams.get('id')||''});
  if(method==='GET')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows.filter(x=>x.user_id===uid))});
  if(method==='DELETE'){
   const criterion=url.searchParams.get('id')||'';
   const matched=rows.filter(x=>x.user_id===uid&&(criterion==='not.is.null'||criterion==='eq.'+x.id));
   for(const row of matched)rows.splice(rows.indexOf(row),1);
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(matched.map(x=>({id:x.id})))});
  }
  return route.fulfill({status:201,contentType:'application/json',body:'[]'});
 }
 return route.fulfill({status:200,contentType:'application/json',body:'[]'});
});
try{
 await page.goto(base+'/#dashboard',{waitUntil:'domcontentloaded',timeout:40000});
 await page.waitForSelector('[data-workspace-layout="r285"]',{state:'visible',timeout:30000});
 await page.locator('.v284-level-picker>summary').click();
 const full=await page.evaluate(()=>{
  const root=document.querySelector('[data-workspace-layout="r285"]'),picker=root.querySelector('.v284-level-picker'),levels=picker.querySelector('.v51-levels'),main=document.querySelector('#v51-main'),r=picker.getBoundingClientRect(),mr=main.getBoundingClientRect();
  return {open:picker.open,levelCount:levels.querySelectorAll('[data-level]').length,groupCount:levels.querySelectorAll('.v51-level-cluster').length,display:getComputedStyle(levels).display,columns:getComputedStyle(levels).gridTemplateColumns.split(' ').length,width:r.width,mainWidth:mr.width,scroll:levels.scrollWidth,client:levels.clientWidth,allVisible:[...levels.querySelectorAll('[data-level]')].every(el=>{const b=el.getBoundingClientRect(),p=picker.getBoundingClientRect();return b.width>70&&b.height>70&&b.left>=p.left-2&&b.right<=p.right+2})};
 });
 assert.equal(full.open,true);assert.equal(full.levelCount,9);assert.equal(full.groupCount,4);
 assert.equal(full.display,'grid','levels use a real full-width grid, not a carousel');
 assert.ok(full.width/full.mainWidth>.72,'expanded education selection must take main column width');
 assert.equal(full.scroll<=full.client+2,true,'no horizontally clipped levels');
 assert.equal(full.allVisible,true,'every level card must fit in the expanded picker');
 await page.locator('[data-level="vwo"]').click();
 assert.equal(await page.evaluate(()=>localStorage.getItem('scholark_education_track')),'vwo');
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(150);
 const mobile=await page.evaluate(()=>{const picker=document.querySelector('.v284-level-picker'),levels=picker.querySelector('.v51-levels');return {width:levels.getBoundingClientRect().width,client:levels.clientWidth,scroll:levels.scrollWidth,page:document.querySelector('#v51-main').scrollWidth,main:document.querySelector('#v51-main').clientWidth,count:levels.querySelectorAll('[data-level]').length}});
 assert.equal(mobile.count,9);assert.ok(mobile.width>250&&mobile.scroll<=mobile.client+2&&mobile.page<=mobile.main+2,'mobile shows the levels without horizontal clipping');
 await page.setViewportSize({width:1440,height:970});
 await page.evaluate(()=>{
  const stale=document.createElement('div');stale.id='v48-dashboard';stale.textContent='RETIRED WORKSPACE';document.body.append(stale);
  const staleHome=document.querySelector('#v29-home-layer');if(staleHome){staleHome.hidden=false;staleHome.removeAttribute('aria-hidden')}
  document.body.classList.add('v55-public-home');document.documentElement.classList.add('v55-public-home');
  window.__SCHOLAVERUM_WORKSPACE_GUARD__?.audit?.();
 });
 assert.equal(await page.evaluate(()=>{const el=document.querySelector('#v48-dashboard');return !el||getComputedStyle(el).display==='none'}),true,'retired Workspace cannot overlay the current one');
 assert.ok(await page.evaluate(()=>document.querySelector('#v29-home-layer')?.hidden),'reopened retired Home is re-quarantined');
 assert.equal(await page.locator('#v51-main').count(),1);
 await page.locator('#v51-sidebar [data-v51-tool="study"]').click();
 await page.waitForFunction(()=>location.hash==='#study'&&document.querySelectorAll('#v83-saved [data-v83-saved]').length===2,null,{timeout:30000});
 assert.equal(await page.locator('#v83-saved [data-v83-remove]').count(),2);
 await page.locator('#v83-saved [data-v83-saved]').first().click();
 await page.waitForSelector('#v62-study-results .v62-answer-card',{state:'visible',timeout:10000});
 await page.locator('#v83-saved [data-v83-remove]').first().click();
 await page.waitForFunction(()=>document.querySelectorAll('#v83-saved [data-v83-saved]').length===1,null,{timeout:8000});
 assert.equal(await page.locator('#v62-study-results .v62-answer-card').count(),0,'removing the viewed study closes its cached results');
 assert.ok(rows.some(x=>x.user_id===UID)&&rows.some(x=>x.user_id===BID),'single removal must not clear other saved tracks or accounts');
 page.once('dialog',d=>d.accept());
 await page.locator('[data-v83-remove-all]').click();
 await page.waitForFunction(()=>document.querySelectorAll('#v83-saved [data-v83-saved]').length===0&&document.querySelector('#v83-saved')?.textContent.includes('All saved'),null,{timeout:8000});
 assert.equal(rows.filter(x=>x.user_id===UID).length,0);assert.equal(rows.filter(x=>x.user_id===BID).length,1,'bulk removal is scoped to signed-in user');
 assert.ok(calls.some(c=>c.method==='DELETE'&&c.uid===UID&&c.id==='not.is.null'),'remove-all must delete cloud entries, not only hide them');
 assert.ok(calls.every(c=>!c.uid||[UID,BID].includes(c.uid)),'queries must be user scoped');
 assert.deepEqual(errors,[],'expanded levels, route quarantine and study removal have no browser exceptions');
 console.log('PASS r286: complete desktop/mobile education grid, retired Home/Workspace quarantine, single removal, delete all, and user-scoped cloud state');
}finally{await browser.close()}
