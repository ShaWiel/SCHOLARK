(() => {
  if(window.__SCHOLARK_V118_SECURITY__)return;
  window.__SCHOLARK_V118_SECURITY__=true;
  const SB='https://yhafbwdnnpvuedycdkll.supabase.co';
  const KEY='sb_publishable_1f1KQE-QMOM8rR3RqvQlsw__79lCn6A';
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=(v,n=300)=>String(v??'').replace(/\s+/g,' ').trim().slice(0,n);
  const proofCache=new Map();
  let modal=null;

  function authHeaders(token){return {apikey:KEY,authorization:'Bearer '+token,'content-type':'application/json','accept':'application/json'}}
  function current(){return cloud()?.currentSession?.()||null}
  function parseJwt(token){try{return JSON.parse(atob(String(token||'').split('.')[1].replace(/-/g,'+').replace(/_/g,'/')))}catch{return{}}}
  function aal(){return clean(parseJwt(current()?.access_token)?.aal||'aal1',16)||'aal1'}
  function factors(){const u=current()?.user;return Array.isArray(u?.factors)?u.factors:[]}
  function verifiedTotp(){return factors().filter(f=>String(f?.status||'').toLowerCase()==='verified'&&String(f?.factor_type||f?.type||'').toLowerCase()==='totp')}
  function securityScore(){
    const s=current(),u=s?.user,verified=!!(u?.email_confirmed_at||u?.confirmed_at),mfa=verifiedTotp().length>0,level=aal();
    let score=0;if(verified)score+=35;if(mfa)score+=45;if(level==='aal2')score+=20;
    const label=score>=85?'Strong':score>=55?'Good':'Weak';
    return {score,label,emailVerified:verified,mfaEnabled:mfa,aal:level};
  }
  async function refreshUser(session=current()){
    if(!session?.access_token)return null;
    const r=await fetch(SB+'/auth/v1/user',{headers:authHeaders(session.access_token),cache:'no-store'}),u=await r.json().catch(()=>null);
    if(r.ok&&u?.id){session.user=u;cloud()?.saveSession?.(session);return u}
    return null;
  }
  async function authFetch(path,opts={}){
    let s=await cloud()?.session?.();if(!s?.access_token)throw new Error('Sign in first.');
    let r=await fetch(SB+path,{...opts,headers:{...authHeaders(s.access_token),...(opts.headers||{})},cache:'no-store'});
    if(r.status===401&&await cloud()?.refreshSession?.()){s=current();r=await fetch(SB+path,{...opts,headers:{...authHeaders(s.access_token),...(opts.headers||{})},cache:'no-store'})}
    return r;
  }
  async function enrollTotp(name='SCHOLARK Authenticator'){
    const r=await authFetch('/auth/v1/factors',{method:'POST',body:JSON.stringify({factor_type:'totp',friendly_name:clean(name,80)||'SCHOLARK Authenticator'})});
    const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.msg||d?.message||d?.error_description||'Could not start MFA setup.');
    return d;
  }
  async function challenge(factorId){
    const r=await authFetch('/auth/v1/factors/'+encodeURIComponent(factorId)+'/challenge',{method:'POST',body:'{}'}),d=await r.json().catch(()=>({}));
    if(!r.ok||!d?.id)throw new Error(d?.msg||d?.message||'Could not create MFA challenge.');
    return d;
  }
  async function verify(factorId,challengeId,code){
    const r=await authFetch('/auth/v1/factors/'+encodeURIComponent(factorId)+'/verify',{method:'POST',body:JSON.stringify({challenge_id:challengeId,code:clean(code,12)})});
    const d=await r.json().catch(()=>({}));if(!r.ok||!d?.access_token)throw new Error(d?.msg||d?.message||'That authenticator code could not be verified.');
    d.expires_at=d.expires_at||Math.floor(Date.now()/1000)+(d.expires_in||3600);
    cloud()?.saveSession?.(d);
    await refreshUser(d).catch(()=>{});
    return d;
  }
  async function unenroll(factorId){
    const r=await authFetch('/auth/v1/factors/'+encodeURIComponent(factorId),{method:'DELETE'}),d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d?.msg||d?.message||'Could not remove this authenticator.');
    await refreshUser().catch(()=>{});
    return true;
  }
  async function verifyExistingMfa(){
    await refreshUser().catch(()=>{});
    const factor=verifiedTotp()[0];if(!factor)return false;
    const ch=await challenge(factor.id),code=prompt('Enter the 6-digit code from your authenticator app.');
    if(!code)throw new Error('Verification canceled.');
    await verify(factor.id,ch.id,code);return true;
  }
  async function passwordReauth(){
    const s=current(),email=clean(s?.user?.email,240);if(!email)throw new Error('No account email is available.');
    const password=prompt('For security, enter your current SCHOLARK password again.');
    if(!password)throw new Error('Verification canceled.');
    const r=await fetch(SB+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:KEY,'content-type':'application/json'},body:JSON.stringify({email,password})});
    const d=await r.json().catch(()=>({}));if(!r.ok||!d?.access_token)throw new Error('Identity verification failed.');
    d.expires_at=d.expires_at||Math.floor(Date.now()/1000)+(d.expires_in||3600);cloud()?.saveSession?.(d);return true;
  }
  async function requestProof(action,force=false){
    const cached=proofCache.get(action);if(!force&&cached&&cached.expiresAt>Date.now()+15000)return cached.proof;
    await refreshUser().catch(()=>{});
    if(verifiedTotp().length){if(aal()!=='aal2')await verifyExistingMfa()}
    else await passwordReauth();
    const token=current()?.access_token;if(!token)throw new Error('Your secure session could not be refreshed.');
    let r=await fetch('/api/security/step-up',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify({action}),cache:'no-store'});
    let d=await r.json().catch(()=>({}));
    if(r.status===428&&d?.code==='MFA_REQUIRED'){await verifyExistingMfa();const t=current()?.access_token;r=await fetch('/api/security/step-up',{method:'POST',headers:{authorization:'Bearer '+t,'content-type':'application/json'},body:JSON.stringify({action}),cache:'no-store'});d=await r.json().catch(()=>({}))}
    if(!r.ok||!d?.proof)throw new Error(d?.code==='RECENT_AUTH_REQUIRED'?'Verify your identity again before continuing.':d?.error||d?.code||'Security verification failed.');
    proofCache.set(action,{proof:d.proof,expiresAt:Number(d.expiresAt)||Date.now()+5*60*1000});return d.proof;
  }
  async function signOutOthers(){
    await requestProof('sessions');
    const s=current();if(!s?.access_token)throw new Error('Sign in first.');
    const r=await fetch(SB+'/auth/v1/logout?scope=others',{method:'POST',headers:authHeaders(s.access_token)});if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d?.msg||d?.message||'Could not log out other devices.')}
    return true;
  }
  function scoreMarkup(){
    const s=securityScore();
    return '<div class="v118-score '+s.label.toLowerCase()+'"><b>'+s.label+' · '+s.score+'/100</b><span>Email '+(s.emailVerified?'verified':'not verified')+' · MFA '+(s.mfaEnabled?'enabled':'not enabled')+' · Session '+s.aal.toUpperCase()+'</span></div>';
  }
  function ensureModal(){
    if(modal)return modal;
    const style=document.createElement('style');style.id='scholark-v118-style';style.textContent=
      '#v118-security{position:fixed;inset:0;z-index:2147483647;background:rgba(12,13,17,.72);backdrop-filter:blur(10px);display:none;place-items:center;padding:20px;font-family:Inter,system-ui}#v118-security.open{display:grid}'+
      '.v118-card{width:min(680px,96vw);max-height:90vh;overflow:auto;background:#f7f6f3;border-radius:24px;padding:22px;color:#17191f}.v118-top{display:flex;justify-content:space-between;gap:14px}.v118-top h2{margin:4px 0 6px;font:950 28px/1 Inter}.v118-top small{font:900 7px Inter;letter-spacing:.13em;color:#6d5dfc}.v118-top p{font:650 9px/1.45 Inter;color:#777;margin:0}.v118-x{border:0;width:35px;height:35px;border-radius:50%;background:#fff;font-size:19px;cursor:pointer}'+
      '.v118-score{margin:14px 0;padding:12px;border-radius:13px;background:#fff}.v118-score b{display:block;font:900 10px Inter}.v118-score span{display:block;margin-top:4px;font:650 8px/1.4 Inter;color:#6f6976}.v118-section{background:#fff;border-radius:14px;padding:14px;margin-top:9px}.v118-section h3{margin:0 0 6px;font:900 12px Inter}.v118-section p{margin:0 0 9px;font:650 8px/1.45 Inter;color:#777}.v118-actions{display:flex;gap:7px;flex-wrap:wrap}.v118-btn{border:0;border-radius:10px;background:#17191f;color:#fff;padding:9px 11px;font:850 8px Inter;cursor:pointer}.v118-btn.alt{background:#ece9ff;color:#574bd1}.v118-btn.danger{background:#8b302d}.v118-status{min-height:18px;margin-top:9px;font:750 8px/1.4 Inter;color:#6558c8}.v118-qr{max-width:220px;width:100%;background:#fff;border-radius:12px;padding:8px}.v118-secret{word-break:break-all;font:700 8px/1.4 ui-monospace,monospace;background:#f1eff3;padding:8px;border-radius:8px}';
    document.head.appendChild(style);
    modal=document.createElement('div');modal.id='v118-security';modal.innerHTML='<div class="v118-card"></div>';document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal)close()});return modal;
  }
  function close(){modal?.classList.remove('open')}
  async function open(){
    const s=await cloud()?.session?.();if(!s?.access_token)return cloud()?.openAuth?.('signin');
    await refreshUser().catch(()=>{});
    const root=ensureModal(),card=$('.v118-card',root),mfa=verifiedTotp();
    card.innerHTML='<div class="v118-top"><div><small>SCHOLARK ACCOUNT SECURITY</small><h2>Security Center</h2><p>Manage MFA, session security and stronger verification for sensitive account actions.</p></div><button class="v118-x" aria-label="Close">×</button></div>'+scoreMarkup()+
      '<section class="v118-section"><h3>Authenticator app (2FA/MFA)</h3><p>'+(mfa.length?'MFA is enabled. Sensitive SCHOLARK actions require the stronger AAL2 session when this factor is enrolled.':'Add a TOTP authenticator such as Google Authenticator or Microsoft Authenticator.')+'</p><div class="v118-actions">'+(mfa.length?'<button class="v118-btn alt" data-v118-verify>Verify MFA now</button><button class="v118-btn danger" data-v118-remove>Remove authenticator</button>':'<button class="v118-btn" data-v118-enroll>Set up authenticator</button>')+'</div></section>'+
      '<section class="v118-section"><h3>Sessions</h3><p>Revoke refresh tokens for every other SCHOLARK session while keeping this device signed in.</p><div class="v118-actions"><button class="v118-btn alt" data-v118-others>Log out all other devices</button></div></section>'+
      '<section class="v118-section"><h3>Step-up protection</h3><p>Data export, account deletion, session revocation and other sensitive operations require recent identity verification. Short-lived proof tokens stay in memory only.</p></section><div class="v118-status"></div>';
    root.classList.add('open');$('.v118-x',root).onclick=close;const st=$('.v118-status',root);
    $('[data-v118-verify]',root)?.addEventListener('click',async e=>{e.currentTarget.disabled=true;st.textContent='Verifying authenticator…';try{await verifyExistingMfa();st.textContent='MFA verified. Your session is now AAL2.';setTimeout(open,450)}catch(err){st.textContent=clean(err?.message||err)}finally{e.currentTarget.disabled=false}});
    $('[data-v118-remove]',root)?.addEventListener('click',async e=>{if(!confirm('Remove your SCHOLARK authenticator factor?'))return;e.currentTarget.disabled=true;st.textContent='Verifying before removal…';try{if(aal()!=='aal2')await verifyExistingMfa();await unenroll(mfa[0].id);st.textContent='Authenticator removed.';setTimeout(open,450)}catch(err){st.textContent=clean(err?.message||err)}finally{e.currentTarget.disabled=false}});
    $('[data-v118-others]',root)?.addEventListener('click',async e=>{e.currentTarget.disabled=true;st.textContent='Revoking other sessions…';try{await signOutOthers();st.textContent='Other devices have been signed out. Their existing short-lived access tokens can remain valid until expiry.'}catch(err){st.textContent=clean(err?.message||err)}finally{e.currentTarget.disabled=false}});
    $('[data-v118-enroll]',root)?.addEventListener('click',async e=>{
      e.currentTarget.disabled=true;st.textContent='Starting authenticator setup…';
      try{
        const d=await enrollTotp(),factorId=d?.id,totp=d?.totp||{};if(!factorId)throw new Error('MFA enrollment did not return a factor.');
        const qr=clean(totp?.qr_code,12000),secret=clean(totp?.secret,500);
        const section=e.currentTarget.closest('.v118-section');section.innerHTML='<h3>Scan this code</h3><p>Scan the QR code in your authenticator app, then enter the 6-digit code it generates.</p>'+(qr?'<img class="v118-qr" alt="Authenticator QR code" src="'+qr.replace(/"/g,'&quot;')+'">':'')+(secret?'<div class="v118-secret">'+secret.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</div>':'')+'<div class="v118-actions" style="margin-top:9px"><input data-v118-code inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="6-digit code"><button class="v118-btn" data-v118-confirm>Enable MFA</button></div>';
        $('[data-v118-confirm]',section).onclick=async ev=>{const b=ev.currentTarget,code=clean($('[data-v118-code]',section)?.value,12);b.disabled=true;st.textContent='Verifying code…';try{const ch=await challenge(factorId);await verify(factorId,ch.id,code);st.textContent='MFA enabled.';setTimeout(open,500)}catch(err){st.textContent=clean(err?.message||err);b.disabled=false}};
      }catch(err){st.textContent=clean(err?.message||err);e.currentTarget.disabled=false}
    });
  }
  async function completeMfaIfRequired(session){
    if(!session?.user?.factors)await refreshUser(session).catch(()=>{});
    if(verifiedTotp().length&&aal()!=='aal2')await verifyExistingMfa();
    return current();
  }
  function injectSettingsButton(){
    const account=$('#v89-account.open #v89-body');if(!account||$('#v89-security',account))return;
    const actions=$('.v89-actions',account);if(!actions)return;
    const b=document.createElement('button');b.className='v89-btn alt';b.id='v89-security';b.textContent='Security';b.onclick=()=>{document.querySelector('#v89-account')?.classList.remove('open');open()};actions.insertBefore(b,actions.firstChild);
  }
  const mo=new MutationObserver(()=>injectSettingsButton());mo.observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('scholark:auth-changed',()=>{proofCache.clear();setTimeout(()=>refreshUser().catch(()=>{}),50)});
  [300,900,1800].forEach(ms=>setTimeout(injectSettingsButton,ms));
  window.__SCHOLARK_SECURITY__={open,score:securityScore,stepUp:requestProof,signOutOthers,completeMfaIfRequired,refreshUser,verifiedFactors:verifiedTotp,release:'r217'};
})();