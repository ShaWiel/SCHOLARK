(() => {
  if(window.__SCHOLARK_V72_CLOUD_PROJECTS__)return;
  window.__SCHOLARK_V72_CLOUD_PROJECTS__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const SB='https://yhafbwdnnpvuedycdkll.supabase.co';
  const KEY='sb_publishable_1f1KQE-QMOM8rR3RqvQlsw__79lCn6A';
  const SESSION='scholark_supabase_session_v2';
  const state={session:null,cloud:[],busy:false,enhanced:false,currentProject:null,authNotice:''};
  let authModalCloseTimer=0;
  const cancelAuthModalClose=()=>{if(authModalCloseTimer){clearTimeout(authModalCloseTimer);authModalCloseTimer=0}};
  const PASSWORD_MIN=10;
  const timers=new Map();
  let authFailures=0,authBlockedUntil=0,captchaConfigPromise=null,turnstileLoadPromise=null;
  function authCooldownSeconds(){return Math.max(0,Math.ceil((authBlockedUntil-Date.now())/1000))}
  function noteAuthFailure(){authFailures=Math.min(8,authFailures+1);if(authFailures>=3)authBlockedUntil=Date.now()+Math.min(30000,1000*(2**(authFailures-2)))}
  function noteAuthSuccess(){authFailures=0;authBlockedUntil=0}
  async function securityConfig(){
    if(!captchaConfigPromise)captchaConfigPromise=fetch('/api/security/config',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
    return captchaConfigPromise;
  }
  async function loadTurnstile(){
    if(window.turnstile?.render)return window.turnstile;
    if(turnstileLoadPromise)return turnstileLoadPromise;
    turnstileLoadPromise=new Promise((resolve,reject)=>{
      const old=document.querySelector('script[data-scholark-turnstile]');
      if(old){old.addEventListener('load',()=>resolve(window.turnstile),{once:true});old.addEventListener('error',reject,{once:true});return}
      const x=document.createElement('script');x.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';x.async=true;x.defer=true;x.dataset.scholarkTurnstile='1';x.onload=()=>resolve(window.turnstile);x.onerror=()=>reject(new Error('Bot verification could not load.'));document.head.appendChild(x);
    });
    return turnstileLoadPromise;
  }
  async function captchaToken(host=modal){
    const cfg=await securityConfig();if(!cfg?.turnstile?.enabled||!cfg?.turnstile?.siteKey)return '';
    const api=await loadTurnstile();if(!api?.render)throw new Error('Bot verification is unavailable.');
    let holder=host?.querySelector?.('.v72-captcha');
    if(!holder){holder=document.createElement('div');holder.className='v72-captcha';holder.style.cssText='min-height:66px;display:grid;place-items:center;margin:4px 0';const form=host?.querySelector?.('.v72-form')||host;form?.appendChild?.(holder)}
    if(holder.dataset.token)return holder.dataset.token;
    if(holder.dataset.pending==='1')return new Promise((resolve,reject)=>{holder.addEventListener('scholark:captcha',e=>e.detail?.token?resolve(e.detail.token):reject(new Error('Bot verification expired.')),{once:true})});
    holder.dataset.pending='1';
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{delete holder.dataset.pending;reject(new Error('Complete the bot verification and try again.'))},120000);
      const done=token=>{clearTimeout(timer);holder.dataset.token=token||'';delete holder.dataset.pending;holder.dispatchEvent(new CustomEvent('scholark:captcha',{detail:{token}}));token?resolve(token):reject(new Error('Bot verification failed.'))};
      try{const widgetId=api.render(holder,{sitekey:cfg.turnstile.siteKey,theme:'auto',callback:done,'expired-callback':()=>done(''),'error-callback':()=>done('')});holder.dataset.widgetId=String(widgetId)}catch(e){clearTimeout(timer);delete holder.dataset.pending;reject(e)}
    });
  }
  async function authBody(body,host=modal){const token=await captchaToken(host);const holder=host?.querySelector?.('.v72-captcha');if(holder&&token){delete holder.dataset.token;try{if(window.turnstile?.reset&&holder.dataset.widgetId)window.turnstile.reset(holder.dataset.widgetId)}catch{}}return token?{...body,gotrue_meta_security:{captcha_token:token}}:body}
  async function digestText(value){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(value||'')));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch{return ''}}

  const css=document.createElement('style');css.id='scholark-v72-style';css.textContent=`
    .v72-cloud{margin-top:22px;border-top:1px solid #ece9ef;padding-top:20px}.v72-cloud-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.v72-cloud-head h2{font:950 23px/1 Inter;margin:5px 0 7px;letter-spacing:-.03em}.v72-cloud-head p{font:600 9.5px/1.5 Inter;color:#706c77;margin:0;max-width:720px}.v72-actions{display:flex;gap:7px;flex-wrap:wrap}.v72-btn{border:0;border-radius:10px;background:#17191f;color:#fff;padding:9px 11px;font:850 8px Inter;cursor:pointer}.v72-btn.alt{background:#eeecff;color:#5549ca}.v72-btn.ghost{background:#f4f3f6;color:#615d67}.v72-btn.danger{background:#fff0f0;color:#9a3d3d}.v72-btn:disabled{opacity:.5;cursor:wait}.v72-account{margin-top:13px;padding:14px;border:1px solid #ebe8ee;border-radius:15px;background:#fafafa;display:flex;align-items:center;justify-content:space-between;gap:10px}.v72-account b{font:900 9px Inter}.v72-account span{display:block;margin-top:3px;font:650 8px Inter;color:#7c7682}.v72-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:12px}.v72-card{position:relative;border:1px solid #e8e5ec;border-radius:15px;background:#fff;padding:14px}.v72-card small{display:block;color:#6d5dfc;font:850 7px Inter;text-transform:uppercase;letter-spacing:.08em}.v72-card h3{font:900 13px/1.15 Inter;margin:6px 62px 5px 0}.v72-card p{font:600 8.5px/1.4 Inter;color:#77717c;margin:0 0 10px}.v72-card-actions{display:flex;gap:5px;flex-wrap:wrap}.v72-mini{border:0;border-radius:8px;background:#f1eff5;color:#4f4a55;padding:7px 8px;font:800 7px Inter;cursor:pointer}.v72-mini.primary{background:#17191f;color:#fff}.v72-mini.danger{background:#fff0f0;color:#954242}.v72-time{position:absolute;right:12px;top:12px;font:750 6.5px Inter;color:#99939e}.v72-empty{margin-top:12px;padding:18px;border:1px dashed #d6d2dc;border-radius:14px;font:650 9px/1.45 Inter;color:#7b7581}.v72-status{margin-top:8px;min-height:13px;font:750 7.5px/1.4 Inter;color:#5c50cb}
    #v72-modal{position:fixed;inset:0;z-index:2147483647;background:rgba(14,15,21,.62);display:none;place-items:center;padding:20px;font-family:Inter,system-ui}#v72-modal.open{display:grid}.v72-modal-card{width:min(560px,96vw);max-height:86vh;overflow:auto;background:#fff;border-radius:22px;padding:20px;box-shadow:0 28px 90px rgba(0,0,0,.3)}.v72-modal-top{display:flex;justify-content:space-between;gap:12px}.v72-modal-top h2{font:950 22px Inter;margin:0}.v72-x{width:32px;height:32px;border:0;border-radius:10px;background:#f1eff3;font:900 14px Inter;cursor:pointer}.v72-tabs{display:flex;gap:6px;margin-top:15px}.v72-tab{flex:1;border:0;border-radius:10px;padding:9px;background:#f1eff3;font:850 8px Inter;cursor:pointer}.v72-tab.active{background:#17191f;color:#fff}.v72-form{display:grid;gap:8px;margin-top:12px}.v72-form input{width:100%;box-sizing:border-box;border:1px solid #dad6df;border-radius:11px;padding:11px;font:650 9px Inter}.v72-form button{border:0;border-radius:11px;background:#c9ff6a;color:#17191f;padding:11px;font:900 9px Inter;cursor:pointer}.v72-modal-status{margin-top:8px;font:750 8px/1.4 Inter;color:#6559c9}.v72-version{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:11px 0;border-bottom:1px solid #eee}.v72-version b{font:850 9px Inter}.v72-version span{display:block;margin-top:3px;font:650 7.5px Inter;color:#85808a}.v72-restore{border:0;border-radius:9px;background:#eeecff;color:#5549ca;padding:8px 9px;font:850 7.5px Inter;cursor:pointer}
    @media(max-width:720px){.v72-cloud-head,.v72-account{display:block}.v72-actions{margin-top:10px}.v72-grid{grid-template-columns:1fr}.v72-account .v72-actions{margin-top:9px}}
  `;document.head.appendChild(css);
  const modal=document.createElement('div');modal.id='v72-modal';document.body.appendChild(modal);

  function loadSession(){try{const s=JSON.parse(localStorage.getItem(SESSION)||'null');state.session=s&&s.access_token?s:null}catch{state.session=null}return state.session}
  function saveSession(s){const before=state.session?.access_token||'';state.session=s&&s.access_token?s:null;try{if(state.session)localStorage.setItem(SESSION,JSON.stringify(state.session));else localStorage.removeItem(SESSION)}catch{}const after=state.session?.access_token||'';if(before!==after)queueMicrotask(()=>window.dispatchEvent(new CustomEvent('scholark:auth-changed',{detail:{signedIn:!!after,user:state.session?.user||null}})))}
  function authHeaders(token=state.session?.access_token){return {'apikey':KEY,'authorization':'Bearer '+token,'content-type':'application/json','accept':'application/json'}}
  async function refresh(){const s=loadSession();if(!s?.refresh_token)return null;try{const r=await fetch(SB+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'apikey':KEY,'content-type':'application/json'},body:JSON.stringify({refresh_token:s.refresh_token})});const d=await r.json();if(!r.ok||!d?.access_token)throw 0;d.expires_at=d.expires_at||Math.floor(Date.now()/1000)+(d.expires_in||3600);saveSession(d);return d}catch{saveSession(null);return null}}
  async function session(){let s=loadSession();if(!s)return null;const exp=Number(s.expires_at||0);if(exp&&exp<Math.floor(Date.now()/1000)+60)s=await refresh();return s}
  async function apiFetch(path,opts={}){let s=await session();if(!s){const e=new Error('Sign in to use SCHOLARK Cloud');e.code='AUTH_REQUIRED';throw e}let r=await fetch(SB+path,{...opts,headers:{...authHeaders(s.access_token),...(opts.headers||{})}});if(r.status===401&&await refresh()){s=state.session;r=await fetch(SB+path,{...opts,headers:{...authHeaders(s.access_token),...(opts.headers||{})}})}return r}
  async function publicFetch(path,opts={}){return fetch(SB+path,{...opts,headers:{'apikey':KEY,'content-type':'application/json','accept':'application/json',...(opts.headers||{})}})}
  function userEmail(){return clean(state.session?.user?.email||state.session?.email||'')}
  function time(v){try{return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(v))}catch{return clean(v)}}
  function label(k){return ({presentation:'Presentation',webpage:'Webpage',document:'Document',social:'Social',graphic:'Graphic',book:'Book'}[k]||k||'Project')}
  function host(){return $('.v64-projects')}
  function status(t,err=false){const x=$('.v72-status');if(x){x.textContent=t||'';x.style.color=err?'#a13d3d':'#5c50cb'}}
  function validPassword(pass){return String(pass||'').length>=PASSWORD_MIN}
  async function updatePassword(password,accessToken=''){
    if(!validPassword(password))throw new Error('Use at least '+PASSWORD_MIN+' characters for your new password.');
    const s=accessToken?null:await session(),token=accessToken||s?.access_token;
    if(!token)throw new Error('Your recovery session has expired. Request a new password-reset email.');
    const r=await fetch(SB+'/auth/v1/user',{method:'PUT',headers:authHeaders(token),body:JSON.stringify({password})});
    const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error_description||d?.msg||d?.message||'Could not update password');
    if(d?.id&&state.session){state.session.user=d;saveSession(state.session)}
    return d;
  }
  async function consumeAuthCallback(){
    const callbackKey='scholark_auth_callback_hash_v1';
    let raw=String(location.hash||'');
    if(!raw.startsWith('#')||!/(^|&)access_token=/.test(raw.slice(1))){try{raw=sessionStorage.getItem(callbackKey)||''}catch{raw=''}}
    if(!raw.startsWith('#')||!/(^|&)access_token=/.test(raw.slice(1)))return false;
    try{sessionStorage.removeItem(callbackKey)}catch{}
    const p=new URLSearchParams(raw.slice(1)),access_token=p.get('access_token')||'',refresh_token=p.get('refresh_token')||'',type=p.get('type')||'';
    if(!access_token)return false;
    if(type==='recovery'){
      const fp=await digestText(raw),used=fp?sessionStorage.getItem('scholark_recovery_used_v1')||'':'';
      if(fp&&used===fp){try{history.replaceState(null,'',location.pathname+location.search+'#home')}catch{};state.authNotice='This recovery link has already been used. Request a new password-reset email.';return false}
      if(fp)try{sessionStorage.setItem('scholark_recovery_used_v1',fp)}catch{}
    }
    const expires_in=Math.max(60,Number(p.get('expires_in'))||3600),s={access_token,refresh_token,token_type:p.get('token_type')||'bearer',expires_in,expires_at:Math.floor(Date.now()/1000)+expires_in,user:null};
    try{const r=await fetch(SB+'/auth/v1/user',{headers:authHeaders(access_token)}),u=await r.json().catch(()=>null);if(r.ok&&u?.id)s.user=u}catch{}
    saveSession(s);
    try{history.replaceState(null,'',location.pathname+location.search+'#home')}catch{location.hash='home'}
    if(type==='recovery')setTimeout(()=>openPasswordRecovery(),60);
    else if(type==='signup'||type==='email_change')state.authNotice='Email confirmed. Your SCHOLARK account is signed in.';
    return true;
  }
  function openPasswordRecovery(){
    cancelAuthModalClose();
    modal.innerHTML='<div class="v72-modal-card"><div class="v72-modal-top"><h2>Set a new password</h2><button class="v72-x" aria-label="Close">×</button></div><form class="v72-form"><input type="password" autocomplete="new-password" placeholder="New password · '+PASSWORD_MIN+'+ characters" minlength="'+PASSWORD_MIN+'" required><input type="password" autocomplete="new-password" placeholder="Confirm new password" minlength="'+PASSWORD_MIN+'" required><button>Update password</button></form><div class="v72-modal-status">Choose a new password for your SCHOLARK account.</div></div>';
    modal.classList.add('open');$('.v72-x',modal).onclick=closeModal;
    const form=$('.v72-form',modal),st=$('.v72-modal-status',modal),inputs=$$('input[type="password"]',form);
    form.onsubmit=async e=>{e.preventDefault();const pass=inputs[0]?.value||'',confirm=inputs[1]?.value||'';if(pass!==confirm){st.textContent='Passwords do not match.';st.style.color='#a13d3d';return}if(!validPassword(pass)){st.textContent='Use at least '+PASSWORD_MIN+' characters.';st.style.color='#a13d3d';return}st.textContent='Updating password…';st.style.color='#6559c9';try{await updatePassword(pass);st.textContent='Password updated. Your account is ready.';authModalCloseTimer=setTimeout(()=>{authModalCloseTimer=0;closeModal();enhance(true)},650)}catch(err){st.textContent=clean(err?.message||err);st.style.color='#a13d3d'}};
  }

  async function signIn(email,password){
    const wait=authCooldownSeconds();if(wait)throw new Error('Too many sign-in attempts. Try again in '+wait+' seconds.');
    const body=await authBody({email,password});
    const r=await fetch(SB+'/auth/v1/token?grant_type=password',{method:'POST',headers:{'apikey':KEY,'content-type':'application/json'},body:JSON.stringify(body)}),d=await r.json().catch(()=>({}));
    if(!r.ok||!d?.access_token){noteAuthFailure();throw new Error('Sign-in failed. Check your credentials or use password recovery.')}
    d.expires_at=d.expires_at||Math.floor(Date.now()/1000)+(d.expires_in||3600);saveSession(d);
    try{if(window.__SCHOLARK_SECURITY__?.completeMfaIfRequired)d=await window.__SCHOLARK_SECURITY__.completeMfaIfRequired(d)||d}catch(err){saveSession(null);throw err}
    noteAuthSuccess();return d;
  }
  async function signUp(email,password){if(!validPassword(password))throw new Error('Use at least '+PASSWORD_MIN+' characters for your password.');const body=await authBody({email,password,data:{terms_version:'2026-10-05',terms_accepted_at:new Date().toISOString()}}),r=await fetch(SB+'/auth/v1/signup',{method:'POST',headers:{'apikey':KEY,'content-type':'application/json'},body:JSON.stringify(body)}),d=await r.json().catch(()=>({}));if(!r.ok)throw new Error('Account creation could not be completed. Check the details and try again.');if(d?.access_token){d.expires_at=d.expires_at||Math.floor(Date.now()/1000)+(d.expires_in||3600);saveSession(d)}return d}
  async function resetPassword(email){const body=await authBody({email}),r=await fetch(SB+'/auth/v1/recover?redirect_to='+encodeURIComponent(location.origin+location.pathname),{method:'POST',headers:{'apikey':KEY,'content-type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw new Error('If this account can receive recovery mail, use the recovery flow and try again.');return true}
  async function signOut(){const s=loadSession(),token=s?.access_token||'';saveSession(null);state.cloud=[];enhance(true);if(token)try{await fetch(SB+'/auth/v1/logout',{method:'POST',headers:authHeaders(token),cache:'no-store'})}catch{}}

  function openAuth(tab='signin'){
    cancelAuthModalClose();
    const signingIn=tab==='signin';
    modal.innerHTML='<div class="v72-modal-card"><div class="v72-modal-top"><h2>SCHOLARK Cloud</h2><button class="v72-x">×</button></div><div class="v72-tabs"><button class="v72-tab '+(signingIn?'active':'')+'" data-tab="signin">Sign in</button><button class="v72-tab '+(!signingIn?'active':'')+'" data-tab="signup">Create account</button></div><form class="v72-form"><input type="email" autocomplete="email" placeholder="Email address" required><input type="password" autocomplete="'+(signingIn?'current-password':'new-password')+'" placeholder="Password · '+PASSWORD_MIN+'+ characters" minlength="'+PASSWORD_MIN+'" required>'+(!signingIn?'<label class="v72-terms" style="display:flex;gap:8px;align-items:flex-start;font:650 8px/1.45 Inter;color:#655f6b;text-align:left"><input type="checkbox" data-v72-terms required style="width:16px;height:16px;margin:1px 0 0;flex:0 0 auto"> <span>I agree to the SCHOLARK Privacy Notice, Terms, Refund/Cancellation and Subscription Terms (5 Oct 2026).</span></label><button type="button" class="v72-view-terms" style="background:#ece9ff;color:#574bd1">View Privacy & Terms</button>':'')+'<button>'+(signingIn?'Sign in':'Create account')+'</button>'+(signingIn?'<button type="button" class="v72-forgot" style="background:#f3f1f7;color:#514b5d">Forgot your password?</button>':'')+'</form><div class="v72-modal-status"></div></div>';
    modal.classList.add('open');
    window.__SCHOLARK_I18N__?.apply?.(modal);
    setTimeout(()=>window.__SCHOLARK_I18N__?.translateMissing?.(),60);
    $('.v72-x',modal).onclick=closeModal;
    $$('[data-tab]',modal).forEach(b=>{b.type='button';b.onclick=()=>openAuth(b.dataset.tab)});
    const form=$('.v72-form',modal),emailInput=$('input[type="email"]',form),st=$('.v72-modal-status',modal);securityConfig().then(c=>{if(c?.turnstile?.enabled)captchaToken(modal).catch(()=>{})}).catch(()=>{});
    $('.v72-view-terms',modal)?.addEventListener('click',e=>window.__SCHOLARK_LAUNCH__?.privacy?.(e.currentTarget));
    $('.v72-forgot',modal)?.addEventListener('click',async()=>{
      const email=clean(emailInput?.value);
      if(!email){st.textContent='Enter your email address first.';st.style.color='#a13d3d';emailInput?.focus();return}
      st.textContent='Sending password reset email…';st.style.color='#6559c9';
      try{await resetPassword(email);st.textContent='If a SCHOLARK account exists for this email, a password-reset message has been sent.';st.style.color='#6559c9'}catch(err){st.textContent=clean(err?.message||err);st.style.color='#a13d3d'}
    });
    form.onsubmit=async e=>{
      e.preventDefault();
      const inputs=$$('input',form),email=clean(inputs[0]?.value),pass=inputs[1]?.value||'',mode=tab,terms=$('[data-v72-terms]',form);
      if(!validPassword(pass)){st.textContent='Use at least '+PASSWORD_MIN+' characters for your password.';st.style.color='#a13d3d';return}
      if(mode==='signup'&&!terms?.checked){st.textContent='Agree to the Privacy Notice, Terms, Refund/Cancellation and Subscription Terms before creating an account.';st.style.color='#a13d3d';terms?.focus();return}
      st.textContent=mode==='signin'?'Signing in…':'Creating account…';st.style.color='#6559c9';
      try{
        const d=mode==='signin'?await signIn(email,pass):await signUp(email,pass);
        if(mode==='signup'&&!d?.access_token){st.textContent='Account created. Check your email to confirm it, then sign in.';return}
        st.textContent='Connected to SCHOLARK Cloud.';
        authModalCloseTimer=setTimeout(()=>{
          authModalCloseTimer=0;
          closeModal();
          window.__SCHOLARK_CREDITS__?.load?.();
          const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,250));
          idle(async()=>{try{await loadCloud()}catch{}enhance(true)},{timeout:1200});
        },220);
      }catch(err){st.textContent=clean(err?.message||err);st.style.color='#a13d3d'}
    };
  }
  function closeModal(){cancelAuthModalClose();modal.classList.remove('open');state.currentProject=null}

  const media=()=>window.__SCHOLARK_V66_MEDIA__;
  const MEDIA_MAP='scholark_v72_cloud_media_map_v1';
  function mediaMap(){try{return JSON.parse(localStorage.getItem(MEDIA_MAP)||'{}')}catch{return{}}}
  function saveMediaMap(x){try{localStorage.setItem(MEDIA_MAP,JSON.stringify(x))}catch{}}
  function mediaNodes(data,kind){if(kind==='presentation')return Array.isArray(data?.slides)?data.slides:[];if(kind==='social')return Array.isArray(data?.items)?data.items:[];if(kind==='graphic'){const items=Array.isArray(data?.items)?data.items:[];return items.flatMap(x=>[x,...(Array.isArray(x?.canvasLayers)?x.canvasLayers:[])])}return[]}
  function cloneData(data){try{return JSON.parse(JSON.stringify(data))}catch{return data}}
  function storagePath(path){return String(path||'').split('/').filter(Boolean).map(encodeURIComponent).join('/')}
  function mediaExt(type){return /png/i.test(type)?'png':/webp/i.test(type)?'webp':'jpg'}
  async function compactBlob(blob){
    if(!blob)return null;
    if(blob.size<=4.4*1024*1024&&/image\/(jpeg|png|webp)/i.test(blob.type||''))return blob;
    try{
      const bmp=await createImageBitmap(blob),max=1800,scale=Math.min(1,max/bmp.width,max/bmp.height),w=Math.max(1,Math.round(bmp.width*scale)),h=Math.max(1,Math.round(bmp.height*scale)),canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(bmp,0,0,w,h);bmp.close?.();const out=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.84));return out&&out.size<=5*1024*1024?out:null;
    }catch{return blob.size<=5*1024*1024?blob:null}
  }
  async function uploadMediaBlob(path,blob){
    const s=await session();if(!s?.access_token)throw new Error('Sign in to sync project media');
    const r=await fetch(SB+'/storage/v1/object/project-media/'+storagePath(path),{method:'POST',headers:{apikey:KEY,authorization:'Bearer '+s.access_token,'x-upsert':'true','content-type':blob.type||'image/jpeg'},body:blob});
    if(!r.ok){const d=await r.json().catch(()=>({}));throw new Error(d?.message||d?.error||'Media upload failed')}
    return path;
  }
  async function downloadMediaBlob(path){
    const s=await session();if(!s?.access_token)return null;
    const r=await fetch(SB+'/storage/v1/object/authenticated/project-media/'+storagePath(path),{headers:{apikey:KEY,authorization:'Bearer '+s.access_token}});
    if(!r.ok)return null;return await r.blob();
  }
  async function prepareCloudData(p){
    const copy=cloneData(p.data),src=mediaNodes(p.data,p.kind),dst=mediaNodes(copy,p.kind),m=mediaMap(),uid=(await session())?.user?.id;
    if(!uid||!src.length||!media()?.get)return copy;
    for(let i=0;i<src.length;i++){
      const original=src[i],target=dst[i];if(!original||!target)continue;
      let path=original.cloudMediaPath||m[original.mediaKey||'']||'';
      if(original.mediaKey&&!path){
        const asset=await media().get(original.mediaKey);if(asset?.blob){const blob=await compactBlob(asset.blob);if(blob){path=uid+'/'+p.kind+'/'+p.sourceId+'/'+clean(original.id||String(i+1)).replace(/[^a-z0-9_-]/gi,'-')+'.'+mediaExt(blob.type);await uploadMediaBlob(path,blob);m[original.mediaKey]=path}}
      }else if(original.mediaKey&&path&&original.cloudMediaPath!==path){
        const asset=await media().get(original.mediaKey);if(asset?.blob&&!m[original.mediaKey]){const blob=await compactBlob(asset.blob);if(blob){await uploadMediaBlob(path,blob);m[original.mediaKey]=path}}
      }
      if(path){target.cloudMediaPath=path;target.cloudMediaType=original.cloudMediaType||''}
    }
    saveMediaMap(m);return copy;
  }
  async function hydrateCloudData(kind,payload){
    const copy=cloneData(payload),nodes=mediaNodes(copy,kind),m=mediaMap();if(!nodes.length||!media()?.put)return copy;
    for(const node of nodes){
      const path=node?.cloudMediaPath;if(!path)continue;
      if(node.mediaKey){const existing=await media().get?.(node.mediaKey);if(existing?.blob)continue}
      const blob=await downloadMediaBlob(path);if(!blob)continue;const localKey='cloud:'+path;await media().put(localKey,blob,{type:blob.type,cloudPath:path});node.mediaKey=localKey;m[localKey]=path;
    }
    saveMediaMap(m);return copy;
  }
  async function deleteCloudMedia(project){
    try{
      const s=await session(),uid=s?.user?.id;if(!uid||!project?.source_id)return;
      const prefix=uid+'/'+project.kind+'/'+project.source_id;
      const list=await fetch(SB+'/storage/v1/object/list/project-media',{method:'POST',headers:{apikey:KEY,authorization:'Bearer '+s.access_token,'content-type':'application/json'},body:JSON.stringify({prefix,limit:100,offset:0,sortBy:{column:'name',order:'asc'}})});
      const rows=await list.json().catch(()=>[]);if(!list.ok||!Array.isArray(rows)||!rows.length)return;
      const prefixes=rows.filter(x=>x?.name).map(x=>prefix+'/'+x.name);if(!prefixes.length)return;
      await fetch(SB+'/storage/v1/object/project-media',{method:'DELETE',headers:{apikey:KEY,authorization:'Bearer '+s.access_token,'content-type':'application/json'},body:JSON.stringify({prefixes})});
    }catch{}
  }

  async function saveCloud(p,makeVersion=true){if(!p?.sourceId||!p?.kind||!p?.data)return null;const prepared=await prepareCloudData(p);const r=await apiFetch('/rest/v1/rpc/save_cloud_project',{method:'POST',body:JSON.stringify({p_kind:p.kind,p_title:p.title||'Untitled project',p_prompt:p.prompt||'',p_source_id:String(p.sourceId),p_data:{schema:2,payload:prepared},p_make_version:!!makeVersion})});const d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.message||d?.error||'Cloud save failed');return d}
  function scheduleSave(p){if(!loadSession())return;const k=p.kind+':'+p.sourceId;clearTimeout(timers.get(k));timers.set(k,setTimeout(async()=>{try{await saveCloud(p,true);status('Saved to SCHOLARK Cloud · '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}));loadCloud().then(()=>enhance(true)).catch(()=>{})}catch(e){status('Cloud save failed: '+clean(e?.message||e),true)}},1200))}
  window.addEventListener('scholark:project-saved',e=>scheduleSave(e.detail||{}));

  function localProjects(){const out=[],seen=new Set();let h=[];try{h=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]')}catch{}for(const x of h){let data=null,sourceId='',kind=x.mode;if(x.deckId){sourceId=x.deckId;try{data=JSON.parse(localStorage.getItem('scholark_v57_deck_'+x.deckId)||'null')}catch{}}else if(x.artifactId){sourceId=x.artifactId;try{data=JSON.parse(localStorage.getItem('scholark_v58_artifact_'+x.artifactId)||'null')}catch{}}else if(x.bookId){sourceId=x.bookId;try{data=JSON.parse(localStorage.getItem('scholark_v65_book')||'null')}catch{}}if(!data||!sourceId||seen.has(kind+':'+sourceId))continue;seen.add(kind+':'+sourceId);out.push({kind,sourceId,title:x.project||data.name||data.title||'Untitled project',prompt:x.rawPrompt||x.prompt||data.prompt||data.concept||'',data})}try{const b=JSON.parse(localStorage.getItem('scholark_v65_book')||'null');if(b?.id&&!seen.has('book:'+b.id))out.push({kind:'book',sourceId:b.id,title:b.name||'Untitled book',prompt:b.concept||'',data:b})}catch{}return out.slice(0,50)}
  async function syncAllLocal(){if(!await session())return openAuth();const list=localProjects();status('Syncing '+list.length+' local project'+(list.length===1?'':'s')+'…');let n=0;for(const p of list){try{await saveCloud(p,true);n++}catch(e){status('Stopped at '+n+' projects: '+clean(e?.message||e),true);break}}status('Synced '+n+' project'+(n===1?'':'s')+' to SCHOLARK Cloud.');await loadCloud();enhance(true)}
  async function loadCloud(){if(!await session()){state.cloud=[];return[]}const r=await apiFetch('/rest/v1/projects?select=id,kind,title,prompt,data,source_id,created_at,updated_at&order=updated_at.desc',{method:'GET'});const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d?.message||'Could not load cloud projects');state.cloud=Array.isArray(d)?d:[];return state.cloud}

  function putHistory(kind,sourceId,title,prompt){let h=[];try{h=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]')}catch{}const base={mode:kind,project:title,rawPrompt:prompt||'',prompt:prompt||'',at:Date.now()};if(kind==='presentation')base.deckId=sourceId;else if(kind==='book')base.bookId=sourceId;else base.artifactId=sourceId;const key=x=>x.deckId?'d:'+x.deckId:x.bookId?'b:'+x.bookId:x.artifactId?'a:'+x.artifactId:'';h=[base,...h.filter(x=>key(x)!==key(base))].slice(0,40);localStorage.setItem('scholark_v45_history',JSON.stringify(h))}
  function openPayload(kind,payload,sourceId,title,promptText){if(!payload)return;payload.id=payload.id||sourceId;putHistory(kind,sourceId,title||payload.name,promptText||payload.prompt||payload.concept);if(kind==='presentation'){localStorage.setItem('scholark_v57_deck_'+sourceId,JSON.stringify(payload));localStorage.setItem('scholark_v57_last_deck',JSON.stringify(payload));return window.__SCHOLARK_V57_PRESENTATIONS__?.open?.(payload)}if(kind==='book'){localStorage.setItem('scholark_v65_book',JSON.stringify(payload));return window.__SCHOLARK_V65_BOOK__?.openSaved?.(payload)}if(['webpage','document','social','graphic'].includes(kind)){localStorage.setItem('scholark_v58_artifact_'+sourceId,JSON.stringify(payload));localStorage.setItem('scholark_v58_'+kind,JSON.stringify(payload));return window.__SCHOLARK_V58_ARTIFACTS__?.openArtifact?.(payload)}}
  async function openCloud(id){const x=state.cloud.find(p=>p.id===id);if(!x)return;status('Opening cloud project…');const raw=x.data?.payload||x.data,payload=await hydrateCloudData(x.kind,raw);openPayload(x.kind,payload,x.source_id,x.title,x.prompt)}
  async function deleteCloud(id){if(!confirm('Delete this cloud project and its version history? Your local copy is not deleted.'))return;const project=state.cloud.find(x=>x.id===id);const r=await apiFetch('/rest/v1/projects?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:{Prefer:'return=minimal'}});if(!r.ok)throw new Error('Could not delete cloud project');await deleteCloudMedia(project);state.cloud=state.cloud.filter(x=>x.id!==id);enhance(true)}
  async function versions(id){const p=state.cloud.find(x=>x.id===id);if(!p)return;state.currentProject=p;modal.innerHTML='<div class="v72-modal-card"><div class="v72-modal-top"><div><h2>Version history</h2><div style="font:650 8px Inter;color:#777;margin-top:4px">'+esc(p.title)+'</div></div><button class="v72-x">×</button></div><div class="v72-modal-status">Loading versions…</div><div class="v72-version-list"></div></div>';modal.classList.add('open');$('.v72-x',modal).onclick=closeModal;try{const r=await apiFetch('/rest/v1/project_versions?select=version_no,title,kind,data,created_at&project_id=eq.'+encodeURIComponent(id)+'&order=version_no.desc&limit=30',{method:'GET'}),d=await r.json();if(!r.ok)throw new Error(d?.message||'Could not load versions');$('.v72-modal-status',modal).textContent=(d.length||0)+' saved version'+(d.length===1?'':'s');$('.v72-version-list',modal).innerHTML=d.map((v,i)=>'<div class="v72-version"><div><b>Version '+v.version_no+'</b><span>'+esc(time(v.created_at))+'</span></div><button class="v72-restore" data-v72-restore="'+i+'">Restore</button></div>').join('')||'<div class="v72-empty">No version snapshots yet.</div>';$$('[data-v72-restore]',modal).forEach(b=>b.onclick=()=>restoreVersion(p,d[+b.dataset.v72Restore]))}catch(e){$('.v72-modal-status',modal).textContent=clean(e?.message||e)}}
  async function restoreVersion(project,v){const raw=v?.data?.payload||v?.data;if(!raw)return;const payload=await hydrateCloudData(project.kind,raw);openPayload(project.kind,payload,project.source_id,project.title,project.prompt);closeModal();try{await saveCloud({kind:project.kind,sourceId:project.source_id,title:project.title,prompt:project.prompt,data:payload},true);status('Version '+v.version_no+' restored and saved as the current project.');await loadCloud()}catch(e){status('Restored locally; cloud save failed: '+clean(e?.message||e),true)}}

  function enhance(force=false){const h=host();if(!h)return;if(force)h.querySelector('.v72-cloud')?.remove();if(h.querySelector('.v72-cloud'))return;const signed=!!loadSession(),section=document.createElement('section');section.className='v72-cloud';section.innerHTML='<div class="v72-cloud-head"><div><div class="v52-kicker">SCHOLARK CLOUD</div><h2>Cloud Projects</h2><p>Keep your Studio work across devices and restore earlier versions without losing the local autosave.</p></div><div class="v72-actions">'+(signed?'<button class="v72-btn v72-sync">Sync local projects</button><button class="v72-btn ghost v72-reload">Refresh</button>':'<button class="v72-btn v72-connect">Sign in / Create account</button>')+'</div></div><div class="v72-account">'+(signed?'<div><b>'+esc(userEmail()||'Connected account')+'</b><span>Cloud autosave and version history are active.</span></div><div class="v72-actions"><button class="v72-btn ghost v72-signout">Sign out</button></div>':'<div><b>Local-only right now</b><span>Connect an account to sync projects between devices.</span></div>')+'</div><div class="v72-status"></div>'+(signed?(state.cloud.length?'<div class="v72-grid">'+state.cloud.map(p=>'<article class="v72-card"><span class="v72-time">'+esc(time(p.updated_at))+'</span><small>'+esc(label(p.kind))+'</small><h3>'+esc(p.title||'Untitled project')+'</h3><p>'+esc(clean(p.prompt||'Cloud-saved SCHOLARK project').slice(0,150))+'</p><div class="v72-card-actions"><button class="v72-mini primary" data-v72-open="'+p.id+'">Open</button><button class="v72-mini" data-v72-versions="'+p.id+'">Versions</button><button class="v72-mini danger" data-v72-delete="'+p.id+'">Delete cloud</button></div></article>').join('')+'</div>':'<div class="v72-empty">No cloud projects yet. Click “Sync local projects” or save a Studio project while signed in.</div>'):'');h.appendChild(section);$('.v72-connect',section)?.addEventListener('click',()=>openAuth());$('.v72-sync',section)?.addEventListener('click',syncAllLocal);$('.v72-reload',section)?.addEventListener('click',async()=>{status('Refreshing…');try{await loadCloud();enhance(true)}catch(e){status(clean(e?.message||e),true)}});$('.v72-signout',section)?.addEventListener('click',signOut);$$('[data-v72-open]',section).forEach(b=>b.onclick=()=>openCloud(b.dataset.v72Open));$$('[data-v72-versions]',section).forEach(b=>b.onclick=()=>versions(b.dataset.v72Versions));$$('[data-v72-delete]',section).forEach(b=>b.onclick=async()=>{try{await deleteCloud(b.dataset.v72Delete)}catch(e){status(clean(e?.message||e),true)}})}

  addEventListener('hashchange',()=>{consumeAuthCallback().catch(()=>{}).finally(()=>{setTimeout(()=>enhance(true),120);setTimeout(()=>enhance(true),350)})});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-v51-tool="project"]'))setTimeout(()=>enhance(),140)},true);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  loadSession();
  addEventListener('storage',e=>{if(e.key!==SESSION)return;const before=state.session?.access_token||'';loadSession();state.cloud=[];if((state.session?.access_token||'')!==before)window.dispatchEvent(new CustomEvent('scholark:auth-changed',{detail:{signedIn:!!state.session?.access_token,user:state.session?.user||null,source:'storage'}}));setTimeout(()=>enhance(true),30)});
  consumeAuthCallback().catch(()=>{}).finally(()=>setTimeout(async()=>{if(await session())try{await loadCloud()}catch{}enhance(true);if(state.authNotice){status(state.authNotice);state.authNotice=''}},350));
  window.__SCHOLARK_V72_CLOUD__={session,refreshSession:refresh,saveSession,loadCloud,syncAllLocal,openAuth,signOut,resetPassword,updatePassword,captchaToken,items:()=>state.cloud,saveProject:saveCloud,request:apiFetch,publicRequest:publicFetch,currentSession:()=>state.session,release:'r218'};
})();