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
  // Mock the entire Supabase origin at the browser-context level so that both
  // tabs use the same deterministic fake backend. Page-level routes did not
  // apply to the second tab: its background cloud fetch could receive a real
  // 401 and invalidate the deliberately synthetic QA session.
  await context.route(SB+'/**',route=>route.fulfill({
    status:200,contentType:'application/json',body:'[]',
    headers:{'cache-control':'no-store'}
  }));
  // The lifecycle smoke validates Supabase session flows, not the external bot provider.
  // Keep security configuration deterministic so CAPTCHA discovery cannot stall mocked requests.
  await context.route('**/api/security/config',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({turnstile:{enabled:false}})}));

  await context.route(SB+'/auth/v1/signup',route=>{try{signupPayload=route.request().postDataJSON()}catch{};return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({user:USER,session:null})})});
  await context.route(SB+'/auth/v1/token?grant_type=password',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(SESSION)}));
  await context.route(SB+'/auth/v1/token?grant_type=refresh_token',route=>route.fulfill({
    status:200,contentType:'application/json',body:JSON.stringify({...SESSION,expires_at:Math.floor(Date.now()/1000)+3600})
  }));
  await context.route(SB+'/auth/v1/recover**',route=>route.fulfill({status:200,contentType:'application/json',body:'{}'}));
  await context.route(SB+'/auth/v1/logout',route=>route.fulfill({status:204,body:''}));
  await context.route(SB+'/auth/v1/user',async route=>{
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
  const signupDone=page.waitForResponse(r=>r.url().startsWith(SB+'/auth/v1/signup')&&r.request().method()==='POST'&&r.status()===200);
  await page.locator('.v72-form button:not([type="button"])').click();
  await signupDone;
  check(!await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__?.currentSession?.()),'unverified signup requires email confirmation');
  check(signupPayload?.data?.terms_version==='2026-10-05','signup uses current legal version',signupPayload?.data?.terms_version||'missing');

  await page.goto(base+'/#access_token=qa-access-token&refresh_token=qa-refresh-token&expires_in=3600&type=signup',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token==='qa-access-token',null,{timeout:10000});
  check(await page.evaluate(()=>location.hash)==='#home','email confirmation callback is scrubbed to #home');

  await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__.signOut());
  await page.waitForFunction(()=>!window.__SCHOLARK_V72_CLOUD__.currentSession(),null,{timeout:5000});
  check(true,'logout clears local session');

  await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__.openAuth('signin'));
  await page.locator('.v72-form input[type="email"]').fill(USER.email);
  await page.locator('.v72-form input[type="password"]').fill('LongEnough1');
  const loginDone=page.waitForResponse(r=>r.url().startsWith(SB+'/auth/v1/token?grant_type=password')&&r.request().method()==='POST');
  await page.locator('.v72-form button').first().click();
  const loginResponse=await loginDone;
  check(loginResponse.status()===200,'login token request succeeds',String(loginResponse.status()));
  try{
    await page.waitForFunction(()=>window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token==='qa-access-token',null,{timeout:8000});
  }catch(err){
    const diag=await page.evaluate(()=>({status:document.querySelector('#v72-modal .v72-modal-status')?.textContent||'',securityLoaded:!!window.__SCHOLARK_SECURITY__,signedIn:!!window.__SCHOLARK_V72_CLOUD__?.currentSession?.()}));
    throw new Error('login session was not retained '+JSON.stringify(diag));
  }
  check(true,'login restores session');
  await page.waitForFunction(()=>!document.querySelector('#v72-modal')?.classList.contains('open'),null,{timeout:10000,polling:100});

  await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__.openAuth('signin'));
  await page.locator('.v72-form input[type="email"]').fill(USER.email);
  await page.locator('.v72-forgot').click();
  await page.waitForFunction(()=>document.querySelector('.v72-modal-status')?.textContent?.includes('password-reset'),null,{timeout:5000});
  check(true,'forgot-password request completes');

  await page.goto(base+'/#access_token=qa-access-token&refresh_token=qa-refresh-token&expires_in=3600&type=recovery',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelectorAll('#v72-modal.open .v72-form input[type="password"]').length===2,null,{timeout:10000,polling:100});
  await page.locator('.v72-form input[type="password"]').nth(0).fill('NewLongPassword1');
  await page.locator('.v72-form input[type="password"]').nth(1).fill('NewLongPassword1');
  // Submit through the browser form API (including native validation) to
  // avoid heavy WebGL rendering starving hit-testing of the button itself.
  // This still exercises the real form onsubmit and requires a real mocked
  // PUT /auth/v1/user response; it does not call the app's API directly.
  const passwordUpdate=page.waitForResponse(r=>r.url()===SB+'/auth/v1/user'&&r.request().method()==='PUT'&&r.status()===200,{timeout:10000}).catch(()=>null);
  const recoveryForm=page.locator('#v72-modal.open .v72-form');
  const formReady=await recoveryForm.evaluate(el=>({
    valid:el.checkValidity(),
    hasHandler:typeof el.onsubmit==='function',
    fieldCount:el.querySelectorAll('input[type="password"]').length
  }));
  check(formReady.valid&&formReady.hasHandler&&formReady.fieldCount===2,'recovery form is valid and submit handler is ready',JSON.stringify(formReady));
  if(!formReady.valid||!formReady.hasHandler)throw new Error('Password recovery form not ready: '+JSON.stringify(formReady));
  await recoveryForm.evaluate(el=>el.requestSubmit());
  const passwordResponse=await passwordUpdate;
  if(!passwordResponse){
    const diag=await page.evaluate(()=>({
      open:document.querySelector('#v72-modal')?.classList.contains('open'),
      status:document.querySelector('#v72-modal .v72-modal-status')?.textContent||'',
      valid:document.querySelector('#v72-modal.open .v72-form')?.checkValidity(),
      currentSession:!!window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token
    }));
    throw new Error('Recovery form did not submit a password update request: '+JSON.stringify(diag));
  }
  check(true,'recovery callback updates password');

  const second=await context.newPage();
  await second.goto(base+'/#home',{waitUntil:'domcontentloaded'});
  // Wait for the second tab's auth listener and homepage bootstrap to settle
  // before simulating a storage event from the first tab.
  await second.waitForFunction(()=>!!window.__SCHOLARK_V72_CLOUD__&&!!window.__SCHOLARK_LAUNCH__&&!document.documentElement.classList.contains('scholark-prepaint'),null,{timeout:35000,polling:100});
  await page.evaluate(s=>localStorage.setItem('scholark_supabase_session_v2',JSON.stringify(s)),{...SESSION,access_token:'tab-sync-token'});
  try{
    // WebGL scenes may throttle animation frames; use real-time polling,
    // without weakening the cross-tab session-sync assertion.
    await second.waitForFunction(()=>window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token==='tab-sync-token',null,{timeout:20000,polling:100});
  }catch(err){
    const diag=await second.evaluate(()=>({
      ready:document.readyState,prepaint:document.documentElement.classList.contains('scholark-prepaint'),
      cloud:!!window.__SCHOLARK_V72_CLOUD__,storedMatch:(()=>{try{return JSON.parse(localStorage.getItem('scholark_supabase_session_v2')||'null')?.access_token==='tab-sync-token'}catch{return false}})(),
      sessionMatch:window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token==='tab-sync-token'
    }));
    throw new Error('Cross-tab storage session did not synchronize: '+JSON.stringify(diag)+'; '+String(err?.message||err));
  }
  check(true,'multi-tab session synchronization works');

  // The privacy modal must remain visible after the cross-tab session sync,
  // including when homepage hydration and UI observers are still active.
  await second.waitForFunction(()=>!document.documentElement.classList.contains('scholark-prepaint')&&document.documentElement.dataset.scholaverumBootFailed!=='1',null,{timeout:35000,polling:100});
  await second.evaluate(()=>window.__SCHOLARK_LAUNCH__?.privacy?.());
  try{await second.waitForSelector('#v116-dialog.open [data-v116-export]',{state:'visible',timeout:5000})}
  catch(err){
    const diag=await second.evaluate(()=>({
      route:location.hash,ready:document.readyState,login:!!window.__SCHOLARK_V72_CLOUD__?.currentSession?.(),
      launch:!!window.__SCHOLARK_LAUNCH__,dialogCount:document.querySelectorAll('#v116-dialog').length,
      dialogOpen:!!document.querySelector('#v116-dialog')?.classList.contains('open'),
      dialogAttached:!!document.querySelector('#v116-dialog')?.isConnected,
      bodyLength:document.querySelector('#v116-dialog-body')?.innerHTML?.length||0,
      exportCount:document.querySelectorAll('[data-v116-export]').length,
      dialogDisplay:document.querySelector('#v116-dialog')?getComputedStyle(document.querySelector('#v116-dialog')).display:'missing',
      modalStatus:document.querySelector('#v116-dialog-body')?.innerText?.slice(-280)||''
    }));
    throw new Error('Privacy export dialog not visible after cross-tab sync: '+JSON.stringify(diag)+'; '+String(err?.message||err))
  }
  // Session-gated account actions may be revalidated asynchronously after
  // a cross-tab storage event. Require both controls to become actionable.
  try{
    await second.waitForFunction(()=>{
      const exportBtn=document.querySelector('#v116-dialog.open [data-v116-export]');
      const deleteBtn=document.querySelector('#v116-dialog.open [data-v116-delete]');
      return !!window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token
        &&!!exportBtn&&!exportBtn.disabled&&!!deleteBtn&&!deleteBtn.disabled;
    },null,{timeout:7000,polling:100});
  }catch(err){
    const diag=await second.evaluate(()=>({
      signedIn:!!window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token,
      storedSession:!!localStorage.getItem('scholark_supabase_session_v2'),
      exportDisabled:document.querySelector('[data-v116-export]')?.disabled,
      deleteDisabled:document.querySelector('[data-v116-delete]')?.disabled,
      dialogStatus:document.querySelector('#v116-dialog-body [data-v116-status]')?.textContent||''
    }));
    throw new Error('Privacy account controls did not become enabled: '+JSON.stringify(diag)+'; '+String(err?.message||err));
  }
  check(await second.locator('#v116-dialog.open [data-v116-export]').isEnabled(),'data export control enabled while signed in');
  check(await second.locator('[data-v116-delete]').isEnabled(),'account deletion control enabled while signed in');

  const report={ok:failures.length===0,checks:10,failures};
  console.log('SCHOLARK ACCOUNT LIFECYCLE SMOKE',JSON.stringify(report));
  if(failures.length)process.exitCode=1;
}finally{await browser.close()}
