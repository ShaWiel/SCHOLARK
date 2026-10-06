import { chromium } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const SB='https://yhafbwdnnpvuedycdkll.supabase.co';
const USER={id:'11111111-1111-4111-8111-111111111111',email:'scholark-lifecycle@example.test',email_confirmed_at:new Date().toISOString()};
const SESSION={access_token:'qa-access-token',refresh_token:'qa-refresh-token',expires_in:3600,token_type:'bearer',user:USER};
const failures=[];
let signupPayload=null;
const check=(ok,label,detail='')=>{if(!ok)failures.push({label,detail})};

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:1280,height:800}});
  const page=await context.newPage();

  await page.route(SB+'/auth/v1/signup',route=>{try{signupPayload=route.request().postDataJSON()}catch{};return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({user:USER,session:null})})});
  await page.route(SB+'/auth/v1/token?grant_type=password',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(SESSION)}));
  await page.route(SB+'/auth/v1/recover**',route=>route.fulfill({status:200,contentType:'application/json',body:'{}'}));
  await page.route(SB+'/auth/v1/logout',route=>route.fulfill({status:204,body:''}));
  await page.route(SB+'/auth/v1/user',async route=>{
    if(route.request().method()==='PUT')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(USER)});
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(USER)});
  });

  await page.goto(base+'/#home',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.__SCHOLARK_V72_CLOUD__,null,{timeout:15000});

  await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__.openAuth('signup'));
  check(await page.locator('.v72-form input[type="password"]').getAttribute('minlength')==='10','signup password minimum is 10');
  check(await page.locator('[data-v72-terms]').count()===1,'signup shows legal consent control');
  await page.locator('.v72-form input[type="email"]').fill(USER.email);
  await page.locator('.v72-form input[type="password"]').fill('LongEnough1');
  await page.locator('[data-v72-terms]').check();
  await page.locator('.v72-form button').filter({hasText:'Create account'}).click();
  await page.waitForFunction(()=>document.querySelector('.v72-modal-status')?.textContent?.includes('Check your email'),null,{timeout:5000});
  check(signupPayload?.data?.terms_version==='2026-10-05','signup uses current legal version',signupPayload?.data?.terms_version||'missing');
  check(true,'unverified signup requires email confirmation');

  await page.goto(base+'/#access_token=qa-access-token&refresh_token=qa-refresh-token&expires_in=3600&type=signup',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token==='qa-access-token',null,{timeout:10000});
  check(await page.evaluate(()=>location.hash)==='#home','email confirmation callback is scrubbed to #home');

  await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__.signOut());
  await page.waitForFunction(()=>!window.__SCHOLARK_V72_CLOUD__.currentSession(),null,{timeout:5000});
  check(true,'logout clears local session');

  await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__.openAuth('signin'));
  await page.locator('.v72-form input[type="email"]').fill(USER.email);
  await page.locator('.v72-form input[type="password"]').fill('LongEnough1');
  await page.locator('.v72-form button').first().click();
  await page.waitForFunction(()=>window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token==='qa-access-token',null,{timeout:5000});
  check(true,'login restores session');

  await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__.openAuth('signin'));
  await page.locator('.v72-form input[type="email"]').fill(USER.email);
  await page.locator('.v72-forgot').click();
  await page.waitForFunction(()=>document.querySelector('.v72-modal-status')?.textContent?.includes('password-reset'),null,{timeout:5000});
  check(true,'forgot-password request completes');

  await page.goto(base+'/#access_token=qa-access-token&refresh_token=qa-refresh-token&expires_in=3600&type=recovery',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('.v72-modal-top h2')?.textContent==='Set a new password',null,{timeout:10000});
  await page.locator('.v72-form input[type="password"]').nth(0).fill('NewLongPassword1');
  await page.locator('.v72-form input[type="password"]').nth(1).fill('NewLongPassword1');
  await page.locator('.v72-form button').click();
  await page.waitForFunction(()=>document.querySelector('.v72-modal-status')?.textContent?.includes('Password updated'),null,{timeout:5000});
  check(true,'recovery callback updates password');

  const second=await context.newPage();
  await second.goto(base+'/#home',{waitUntil:'domcontentloaded'});
  await second.waitForFunction(()=>!!window.__SCHOLARK_V72_CLOUD__&&!!window.__SCHOLARK_LAUNCH__,null,{timeout:15000});
  await page.evaluate(s=>localStorage.setItem('scholark_supabase_session_v2',JSON.stringify(s)),{...SESSION,access_token:'tab-sync-token'});
  await second.waitForFunction(()=>window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token==='tab-sync-token',null,{timeout:15000});
  check(true,'multi-tab session synchronization works');

  await second.evaluate(()=>window.__SCHOLARK_LAUNCH__?.privacy?.());
  await second.waitForSelector('[data-v116-export]',{timeout:5000});
  check(await second.locator('[data-v116-export]').isEnabled(),'data export control enabled while signed in');
  check(await second.locator('[data-v116-delete]').isEnabled(),'account deletion control enabled while signed in');

  const report={ok:failures.length===0,checks:10,failures};
  console.log('SCHOLARK ACCOUNT LIFECYCLE SMOKE',JSON.stringify(report));
  if(failures.length)process.exitCode=1;
}finally{await browser.close()}
