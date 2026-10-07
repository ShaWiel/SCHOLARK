import { chromium } from 'playwright';

const base=(process.argv[2]||'http://127.0.0.1:10000').replace(/\/$/,'');
const SB='https://yhafbwdnnpvuedycdkll.supabase.co';
const A={id:'11111111-1111-4111-8111-111111111111',email:'alpha-account@example.test',user_metadata:{full_name:'Alpha Student'},factors:[]};
const B={id:'22222222-2222-4222-8222-222222222222',email:'beta-account@example.test',user_metadata:{full_name:'Beta Student'},factors:[]};
const sessions={
  [A.email]:{access_token:'qa-token-alpha',refresh_token:'qa-refresh-alpha',expires_in:3600,token_type:'bearer',user:A},
  [B.email]:{access_token:'qa-token-beta',refresh_token:'qa-refresh-beta',expires_in:3600,token_type:'bearer',user:B}
};
const failures=[],profileWrites=[],uploads=[],deletes=[];
const check=(ok,msg)=>{if(!ok)failures.push(msg)};
const browser=await chromium.launch({headless:true});
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64');

try{
  const context=await browser.newContext({viewport:{width:1280,height:900}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e?.message||e)));

  await page.route(SB+'/auth/v1/token?grant_type=password',async route=>{
    const body=route.request().postDataJSON();
    const session=sessions[String(body?.email||'').toLowerCase()];
    if(!session)return route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({error:'invalid_grant'})});
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(session)});
  });
  await page.route(SB+'/auth/v1/logout',route=>route.fulfill({status:204,body:''}));
  await page.route(SB+'/auth/v1/user',route=>{
    const auth=String(route.request().headers()['authorization']||'');
    const user=auth.includes('qa-token-beta')?B:A;
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(user)});
  });
  await page.route(SB+'/rest/v1/**',async route=>{
    const req=route.request(),url=req.url(),method=req.method();
    if(url.includes('/profiles?')&&method==='GET'){
      const isB=url.includes(encodeURIComponent(B.id))||url.includes(B.id);
      const user=isB?B:A;
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([{
        user_id:user.id,display_name:user.user_metadata.full_name,role:'student',country:'Suriname',city:'Paramaribo',
        school_name:'',study_field:'',education_level:'student',language:'en',preferences:{subjects:['Mathematics']},
        onboarding_completed:true,avatar_path:null
      }])});
    }
    if(url.includes('/profiles?')&&method==='POST'){
      const body=req.postDataJSON();profileWrites.push(body);
      return route.fulfill({status:201,contentType:'application/json',body:'{}'});
    }
    return route.fulfill({status:200,contentType:'application/json',body:'[]'});
  });
  await page.route(SB+'/storage/v1/object/project-media/**',async route=>{
    const req=route.request();
    if(req.method()==='POST'){uploads.push(req.url());return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({Key:'ok'})})}
    return route.fulfill({status:200,contentType:'image/png',body:png});
  });
  await page.route(SB+'/storage/v1/object/project-media',async route=>{
    if(route.request().method()==='DELETE'){deletes.push(route.request().postDataJSON());return route.fulfill({status:200,contentType:'application/json',body:'[]'})}
    return route.fulfill({status:200,contentType:'application/json',body:'[]'});
  });

  await page.goto(base+'/#home',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>!!window.__SCHOLARK_V72_CLOUD__,null,{timeout:15000});

  async function login(email){
    await page.evaluate(e=>window.__SCHOLARK_V72_CLOUD__.openAuth('signin',{email:e}),email);
    await page.waitForSelector('#v72-modal.open .v72-form',{state:'visible',timeout:5000});
    await page.locator('#v72-modal.open input[type="password"]').fill('SafePassword123!');
    await page.locator('#v72-modal.open .v72-form button').first().click();
    await page.waitForFunction(e=>window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.user?.email===e,email,{timeout:8000});
  }

  await login(A.email);
  let remembered=await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__.rememberedAccounts());
  check(remembered.length===1&&remembered[0].email===A.email,'first account was not remembered safely');

  await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__.signOut());
  await page.waitForFunction(()=>!window.__SCHOLARK_V72_CLOUD__.currentSession(),null,{timeout:5000});
  await login(B.email);

  remembered=await page.evaluate(()=>window.__SCHOLARK_V72_CLOUD__.rememberedAccounts());
  check(remembered.length===2,'two accounts were not retained in the account chooser');
  check(new Set(remembered.map(x=>x.id)).size===2,'remembered accounts were not isolated by user id');

  const storageAudit=await page.evaluate(()=>({
    remembered:localStorage.getItem('scholark_remembered_accounts_v1')||'',
    session:localStorage.getItem('scholark_supabase_session_v2')||''
  }));
  check(!/access_token|refresh_token|qa-token|qa-refresh|SafePassword123/i.test(storageAudit.remembered),'remembered account list contains a token or password');
  check(/qa-token-beta/.test(storageAudit.session),'active session was unexpectedly removed');

  await page.evaluate(()=>{location.hash='dashboard'});
  await page.waitForFunction(()=>!!window.__SCHOLARK_V89_ACCOUNT__&&document.body.classList.contains('v51-workspace'),null,{timeout:15000});
  await page.evaluate(()=>window.__SCHOLARK_V89_ACCOUNT__.open());
  await page.waitForSelector('#v89-account.open #v89-account-list',{state:'visible',timeout:5000});
  check(await page.locator('#v89-add-account').count()===1,'Add account control is missing');
  check(await page.locator('#v89-account-list .v89-account-row').count()===2,'Account settings does not show both remembered accounts');
  const switchA=page.locator('[data-v89-switch="'+A.id+'"]');
  check(await switchA.count()===1,'Switch control for the other account is missing');
  await switchA.click();

  await page.waitForSelector('#v72-modal.open',{state:'visible',timeout:5000});
  check(await page.locator('#v72-modal.open input[type="email"]').inputValue()===A.email,'Switch account did not prefill the selected email');
  check(!(await page.evaluate(()=>!!window.__SCHOLARK_V72_CLOUD__.currentSession())),'Switch account did not clear the previous active session before reauthentication');
  await page.locator('#v72-modal.open input[type="password"]').fill('SafePassword123!');
  await page.locator('#v72-modal.open .v72-form button').first().click();
  await page.waitForFunction(e=>window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.user?.email===e,A.email,{timeout:8000});

  await page.evaluate(()=>window.__SCHOLARK_V89_ACCOUNT__.open());
  await page.waitForSelector('#v89-account.open #v89-avatar-file',{state:'attached',timeout:5000});
  await page.locator('#v89-avatar-file').setInputFiles({name:'avatar.png',mimeType:'image/png',buffer:png});
  await page.waitForFunction(()=>document.querySelector('#v89-status')?.textContent?.includes('Profile photo updated'),null,{timeout:8000});
  check(uploads.some(u=>u.includes('/'+A.id+'/profile/avatar.jpg')),'Profile photo was not uploaded into the active user private folder');
  check(profileWrites.some(x=>x?.user_id===A.id&&x?.avatar_path===A.id+'/profile/avatar.jpg'),'Profile avatar path was not saved on the active profile');

  const safeAfterAvatar=await page.evaluate(()=>localStorage.getItem('scholark_remembered_accounts_v1')||'');
  check(!/access_token|refresh_token|qa-token|qa-refresh|SafePassword123/i.test(safeAfterAvatar),'Account chooser leaked credentials after profile update');

  await page.locator('#v89-avatar-remove').click();
  await page.waitForFunction(()=>document.querySelector('#v89-status')?.textContent?.includes('Profile photo removed'),null,{timeout:8000});
  check(deletes.some(x=>Array.isArray(x?.prefixes)&&x.prefixes.includes(A.id+'/profile/avatar.jpg')),'Profile photo removal did not delete the active user avatar');
  check(profileWrites.some(x=>x?.user_id===A.id&&x?.avatar_path===null),'Profile avatar removal was not saved');

  check(errors.filter(x=>/TypeError|ReferenceError|SyntaxError|Assignment to constant variable/i.test(x)).length===0,'Browser errors: '+errors.join(' | '));
  console.log('SCHOLARK ACCOUNT SWITCHER/AVATAR SMOKE',JSON.stringify({ok:failures.length===0,remembered:remembered.length,uploads:uploads.length,deletes:deletes.length}));
} finally {
  await browser.close();
}
if(failures.length){failures.forEach(x=>console.error(' - '+x));process.exit(1)}
