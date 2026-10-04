(() => {
  if(window.__SCHOLARK_V116_LAUNCH_FOUNDATION__)return;
  window.__SCHOLARK_V116_LAUNCH_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=(v,max=2000)=>String(v??'').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  const session=()=>cloud()?.currentSession?.()||null;
  const token=()=>session()?.access_token||'';
  const uid=()=>session()?.user?.id||'';
  const RELEASE=()=>window.__SCHOLARK_RUNTIME_LOADER__?String(document.querySelector('script[src*="scholark-runtime-loader"]')?.src||'').match(/[?&]v=([^&]+)/)?.[1]||'runtime':'runtime';
  const route=()=>String(location.hash||'#home');
  const locale=()=>String(document.documentElement.lang||localStorage.getItem('scholark_ui_language')||'en').slice(0,20);
  const onboardingKey='scholark_launch_onboarding_v1';
  const telemetryKey='scholark_launch_telemetry_v1';
  let launchHealth=null,sourceAbort=null,sourceRequestCountry='',sourceRequestPromise=null,errorCount=0,dialogReturn=null,dialogEpoch=0,dialogFocusTimer=0;
  const sourceCache=new Map();

  const style=document.createElement('style');style.id='scholark-v116-style';style.textContent=`
    :where(button,a,input,select,textarea,[tabindex]):focus-visible{outline:3px solid #6d5dfc!important;outline-offset:3px!important}
    .sch-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
    .v116-source{display:inline-flex;align-items:center;gap:5px;margin-top:6px;font:750 7.5px/1.3 Inter;color:#5e55b9;text-decoration:none}.v116-source:hover{text-decoration:underline}
    .v116-onboarding{margin:0 0 16px;padding:16px;border-radius:18px;background:#17191f;color:#fff;box-shadow:0 14px 38px rgba(23,25,31,.08)}.v116-onboarding-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}.v116-onboarding h3{font:950 18px/1.1 Inter;margin:0}.v116-onboarding p{font:650 9px/1.5 Inter;color:#bcb7c3;margin:5px 0 0}.v116-close{border:0;background:rgba(255,255,255,.08);color:#fff;width:34px;height:34px;border-radius:50%;cursor:pointer;font:900 16px Inter}.v116-steps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px;margin-top:13px}.v116-step{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.055);color:#fff;border-radius:12px;padding:10px;text-align:left;cursor:pointer;min-width:0}.v116-step b{display:block;font:900 8px/1.3 Inter;color:#c9ff6a}.v116-step span{display:block;margin-top:4px;font:650 7.3px/1.35 Inter;color:#c7c3cc}.v116-step.done{opacity:.58}.v116-step.done b:before{content:'✓ ';color:#c9ff6a}
    .v116-workspace-help{position:relative;display:inline-flex}.v116-help-menu{position:absolute;z-index:2147483600;top:46px;left:0;width:220px;padding:8px;background:#fff;border:1px solid rgba(23,25,31,.10);border-radius:15px;box-shadow:0 22px 65px rgba(31,27,63,.18);display:none}.v116-workspace-help.open .v116-help-menu{display:block}.v116-help-menu button{width:100%;border:0;background:transparent;color:#292631;border-radius:10px;padding:10px;text-align:left;font:850 8.5px Inter;cursor:pointer}.v116-help-menu button:hover{background:#f3f1fa}.v116-help-menu small{display:block;padding:6px 10px 7px;color:#8a8490;font:800 6.8px Inter;letter-spacing:.1em}.v116-public-actions{display:flex;align-items:center;gap:5px}.v116-public-actions button{border:0;background:transparent;color:inherit;padding:7px 8px;border-radius:8px;font:800 7px Inter;cursor:pointer}.v116-public-actions button:hover{background:rgba(255,255,255,.06)}
    #v116-dialog{position:fixed;inset:0;z-index:2147483647;background:rgba(11,12,16,.72);backdrop-filter:blur(10px);display:none;align-items:center;justify-content:center;padding:18px;font-family:Inter,system-ui}#v116-dialog.open{display:flex}.v116-dialog-card{width:min(760px,96vw);max-height:90vh;overflow:auto;background:#f7f6f3;border-radius:24px;color:#17191f;padding:22px;box-shadow:0 30px 100px rgba(0,0,0,.32)}.v116-dialog-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.v116-dialog-top small{font:900 7px Inter;letter-spacing:.14em;color:#6d5dfc}.v116-dialog-top h2{font:950 30px/1 Inter;margin:6px 0 6px;letter-spacing:-.04em}.v116-dialog-top p{font:650 9px/1.5 Inter;color:#777;margin:0}.v116-x{border:0;width:36px;height:36px;border-radius:50%;background:#fff;cursor:pointer;font-size:20px}.v116-panel{margin-top:12px;padding:14px;background:#fff;border:1px solid rgba(23,25,31,.08);border-radius:15px}.v116-panel h3{font:900 11px Inter;margin:0 0 7px}.v116-panel p,.v116-panel li{font:650 8.5px/1.5 Inter;color:#625d66}.v116-panel ul{margin:7px 0;padding-left:18px}.v116-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.v116-btn{border:0;border-radius:10px;background:#17191f;color:#fff;padding:9px 11px;font:900 8px Inter;cursor:pointer}.v116-btn.alt{background:#ece9ff;color:#574bd1}.v116-btn.danger{background:#8b302d}.v116-btn:disabled{opacity:.55;cursor:wait}.v116-status{min-height:18px;margin-top:8px;font:750 8px/1.4 Inter;color:#5f54bd}.v116-danger-confirm{display:flex;gap:7px;margin-top:8px}.v116-danger-confirm input{flex:1;border:1px solid rgba(23,25,31,.13);border-radius:10px;padding:9px 10px;font:700 9px Inter}.v116-feedback textarea{width:100%;min-height:120px;box-sizing:border-box;resize:vertical;border:1px solid rgba(23,25,31,.13);border-radius:12px;padding:11px;font:650 10px/1.45 Inter}.v116-feedback select{width:100%;margin-bottom:8px;border:1px solid rgba(23,25,31,.13);border-radius:10px;padding:9px;background:#fff;font:700 9px Inter}
    @media(max-width:900px){.v116-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:520px){.v116-steps{grid-template-columns:1fr}.v116-dialog-card{padding:17px;border-radius:18px}.v116-dialog-top h2{font-size:26px}.v116-danger-confirm{flex-direction:column}}
    @media(pointer:coarse){:where(button,a,input,select,textarea){min-height:44px}.v116-step{min-height:64px}}
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
  `;document.head.appendChild(style);

  const dialog=document.createElement('div');dialog.id='v116-dialog';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-hidden','true');dialog.innerHTML='<div class="v116-dialog-card"><div id="v116-dialog-body"></div></div>';document.body.appendChild(dialog);
  function closeDialog(){
    dialogEpoch++;clearTimeout(dialogFocusTimer);dialogFocusTimer=0;
    dialog.classList.remove('open');dialog.setAttribute('aria-hidden','true');dialog.style.pointerEvents='none';
    const r=dialogReturn;dialogReturn=null;
    requestAnimationFrame(()=>{if(!dialog.classList.contains('open'))dialog.style.removeProperty('pointer-events');r?.focus?.()});
  }
  function openDialog(html,returnEl=document.activeElement){
    const epoch=++dialogEpoch;clearTimeout(dialogFocusTimer);
    dialogReturn=returnEl;$('#v116-dialog-body').innerHTML=html;dialog.style.removeProperty('pointer-events');dialog.classList.add('open');dialog.setAttribute('aria-hidden','false');
    dialogFocusTimer=setTimeout(()=>{if(epoch!==dialogEpoch||!dialog.classList.contains('open'))return;$('#v116-dialog-body button,#v116-dialog-body input,#v116-dialog-body textarea,#v116-dialog-body select')?.focus()},20);
  }
  dialog.addEventListener('click',e=>{if(e.target===dialog||e.target.closest('[data-v116-close]'))closeDialog()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.classList.contains('open')){e.preventDefault();e.stopPropagation();closeDialog()}},true);
  dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeDialog();return}if(e.key!=='Tab')return;const focus=$$('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',dialog).filter(x=>x.offsetParent!==null);if(!focus.length)return;const first=focus[0],last=focus[focus.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});

  async function api(path,opt={}){
    const headers={'content-type':'application/json',...(opt.headers||{})};if(token())headers.authorization='Bearer '+token();
    const r=await fetch(path,{...opt,headers}),d=await r.json().catch(()=>({}));
    if(!r.ok)throw Object.assign(new Error(d?.error||d?.code||('Request failed ('+r.status+')')),{code:d?.code,status:r.status,data:d});
    return d;
  }
  async function health(force=false){if(launchHealth&&!force)return launchHealth;launchHealth=await api('/api/launch/health',{method:'GET'}).catch(()=>null);return launchHealth}
  async function sources(country){
    const key=clean(country,120)||'';
    if(sourceCache.has(key))return sourceCache.get(key);
    if(sourceRequestPromise&&sourceRequestCountry===key)return sourceRequestPromise;
    sourceAbort?.abort?.();sourceAbort=new AbortController();sourceRequestCountry=key;
    const controller=sourceAbort;
    sourceRequestPromise=(async()=>{
      const r=await fetch('/api/launch/sources?country='+encodeURIComponent(key),{cache:'no-store',signal:controller.signal}),d=await r.json().catch(()=>({}));
      const out=r.ok&&d?.ok?d:null;
      if(out)sourceCache.set(key,out);
      return out;
    })().finally(()=>{
      if(sourceAbort===controller){sourceAbort=null;sourceRequestCountry='';sourceRequestPromise=null}
    });
    return sourceRequestPromise;
  }
  function routeTo(hash){if(location.hash!==hash)location.hash=hash;else dispatchEvent(new HashChangeEvent('hashchange'))}
  function readOnboarding(){try{return JSON.parse(localStorage.getItem(onboardingKey)||'{}')}catch{return{}}}
  function writeOnboarding(x){try{localStorage.setItem(onboardingKey,JSON.stringify(x))}catch{}}
  async function markOnboardingDone(){
    const row={...readOnboarding(),dismissed:true,completedAt:Date.now()};writeOnboarding(row);renderOnboarding();
    const s=session();if(s?.user?.id&&cloud()?.request)try{await cloud().request('/rest/v1/profiles?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:s.user.id,onboarding_completed:true,updated_at:new Date().toISOString()})})}catch{}
  }
  function renderOnboarding(){
    const shell=$('#v51-main [data-v51-page="dashboard"] .v51-shell');if(!shell)return;
    const boxes=[...shell.querySelectorAll('#v116-onboarding')];boxes.slice(0,-1).forEach(x=>x.remove());
    let box=boxes.at(-1)||null;const state=readOnboarding();
    if(state.dismissed){box?.remove();return}
    if(!box){box=document.createElement('section');box.id='v116-onboarding';box.className='v116-onboarding';const anchor=$('.v51-head',shell);anchor?.insertAdjacentElement('afterend',box)}
    const country=localStorage.getItem('scholark_country')||'',level=localStorage.getItem('scholark_learning_level')||'',signed=!!token();
    const steps=[
      ['profile','1 · Country & level','Set the education system SCHOLARK should use.',!!country&&!!level],
      ['account','2 · Account','Keep projects and learning progress across devices.',signed],
      ['ai','3 · ARKI','Ask general questions or use Workspace context.',false],
      ['study','4 · Study Ahead','Prepare for a field, branch or specialization.',false],
      ['schools','5 · Schools','Find institutions using country-aware public sources.',false]
    ];
    box.innerHTML='<div class="v116-onboarding-head"><div><h3>Finish setting up SCHOLARK.</h3><p>Five quick steps make the Workspace more useful. Studio AI and Book Studio stay Coming Soon.</p></div><button class="v116-close" type="button" aria-label="Dismiss setup" data-v116-dismiss>×</button></div><div class="v116-steps">'+steps.map(x=>'<button type="button" class="v116-step '+(x[3]?'done':'')+'" data-v116-step="'+x[0]+'"><b>'+esc(x[1])+'</b><span>'+esc(x[2])+'</span></button>').join('')+'</div>';
    $('[data-v116-dismiss]',box).onclick=markOnboardingDone;
    $$('[data-v116-step]',box).forEach(b=>b.onclick=()=>{
      const k=b.dataset.v116Step;
      if(k==='profile'){const country=$('#v96-country');country?.scrollIntoView({behavior:'smooth',block:'center'});country?.focus();return}
      if(k==='account'){if(token())window.__SCHOLARK_V89_ACCOUNT__?.open?.();else cloud()?.openAuth?.('signin');return}
      routeTo('#'+k);
    });
  }

  function workspaceHelpActions(){
    $('.v116-side-actions').forEach(x=>x.remove());
    const top=$('#v51-top-actions'),button=$('#v51-help',top);if(!top||!button)return;
    const boxes=[...top.querySelectorAll('#v116-workspace-help')];boxes.slice(0,-1).forEach(x=>x.remove());
    let box=boxes.at(-1)||null;
    if(!box){
      box=document.createElement('div');box.id='v116-workspace-help';box.className='v116-workspace-help';
      button.insertAdjacentElement('beforebegin',box);box.appendChild(button);
      const menu=document.createElement('div');menu.className='v116-help-menu';menu.setAttribute('role','menu');menu.innerHTML='<small>HELP & SUPPORT</small><button type="button" role="menuitem" data-v116-help-action="support">Support</button><button type="button" role="menuitem" data-v116-help-action="feedback">Feedback</button><button type="button" role="menuitem" data-v116-help-action="privacy">Privacy & Terms</button><button type="button" role="menuitem" data-v116-help-action="service">Service status</button>';box.appendChild(menu);
      menu.addEventListener('click',e=>{const item=e.target.closest('[data-v116-help-action]');if(!item)return;box.classList.remove('open');button.setAttribute('aria-expanded','false');const action=item.dataset.v116HelpAction;if(action==='support')openSupport(item);else if(action==='feedback')openFeedback(item);else if(action==='privacy')openPrivacy(item);else if(action==='service')openService(item)});
    }
    button.onclick=e=>{e.stopPropagation();const open=!box.classList.contains('open');$('.v116-workspace-help.open').forEach(x=>x!==box&&x.classList.remove('open'));box.classList.toggle('open',open);button.setAttribute('aria-expanded',open?'true':'false')};
  }
  function toggleWorkspaceHelp(returnEl){
    workspaceHelpActions();const box=$('#v116-workspace-help'),button=$('#v51-help');if(!box||!button)return false;
    const open=!box.classList.contains('open');box.classList.toggle('open',open);button.setAttribute('aria-expanded',open?'true':'false');return true;
  }
  function removeStandaloneWorkspaceSignOut(){
    if(!document.body.classList.contains('v51-workspace'))return 0;
    const words=/^(sign\s*out|log\s*out|logout|uitloggen|cerrar sesión|se déconnecter|abmelden|sair|esci)$/i;let removed=0;
    $('button,a,[role="button"]').forEach(el=>{
      if(el.closest('#v89-account,#v72-modal,#v116-workspace-help,#v51-sidebar,#v51-main'))return;
      const mark=[el.id,el.className,el.getAttribute('data-action'),el.getAttribute('data-testid')].filter(Boolean).join(' ').toLowerCase();
      if(words.test(clean(el.textContent,80))||/(^|[-_\s])(signout|sign-out|logout|log-out)([-_\s]|$)/i.test(mark)){el.remove();removed++}
    });
    return removed;
  }

  function publicActions(){
    const actions=$('#v55-topbar .v55-actions');if(!actions)return;
    const boxes=[...actions.querySelectorAll('.v116-public-actions')];boxes.slice(0,-1).forEach(x=>x.remove());
    let box=boxes.at(-1)||null;
    const inStore=document.documentElement.classList.contains('v117-credit-store-route')||String(location.hash||'').toLowerCase().replace(/^#/,'').split(/[?&]/)[0]==='credit-store';
    const onHome=!document.body.classList.contains('v51-workspace')&&!inStore;
    if(!onHome){box?.remove();return}
    if(!box){
      box=document.createElement('div');box.className='v116-public-actions';
      box.innerHTML='<button type="button" data-v116-public-support>Support</button><button type="button" data-v116-public-feedback>Feedback</button><button type="button" data-v116-public-privacy>Privacy & terms</button>';
      const auth=$('#v55-auth',actions)||$('.v55-account-wrap',actions);if(auth)actions.insertBefore(box,auth);else actions.appendChild(box);
      $('[data-v116-public-support]',box).onclick=e=>openSupport(e.currentTarget);
      $('[data-v116-public-feedback]',box).onclick=e=>openFeedback(e.currentTarget);
      $('[data-v116-public-privacy]',box).onclick=e=>openPrivacy(e.currentTarget);
    }
  }

  async function sourceBadge(){
    const wrap=$('#v96-country-context');if(!wrap)return;
    let a=$('.v116-source',wrap);if(!a){a=document.createElement('a');a.className='v116-source';a.target='_blank';a.rel='noopener';a.textContent='Education source basis ↗';$('.v96-country-copy',wrap)?.appendChild(a)}
    const country=localStorage.getItem('scholark_country')||'Suriname';
    const paint=(best,verification)=>{
      if(!best?.url)return false;
      const national=verification==='national-official';
      a.href=best.url;
      a.textContent=(national?'National education source':'ISCED framework basis')+' ↗';
      a.title=(national?'National official source: ':'International framework fallback: ')+best.name;
      a.dataset.sourceVerification=national?'national-official':'framework-only';
      return true;
    };
    // Paint the already-validated country provenance immediately so repeated
    // MutationObserver syncs cannot temporarily downgrade or clear the badge.
    const local=window.__SCHOLARK_COUNTRY__?.sourceBasis?.(country);
    const localPainted=paint(local,local?.verification);
    const d=await sources(country).catch(()=>null);
    if((localStorage.getItem('scholark_country')||'Suriname')!==country||!a.isConnected)return;
    const best=d?.sources?.find(x=>x.type==='national-documents')||d?.sources?.find(x=>x.type==='national-ministry')||d?.sources?.[0];
    if(paint(best,d?.verification))return;
    if(!localPainted){a.removeAttribute('href');a.textContent='Education source basis';a.title='Source information unavailable';delete a.dataset.sourceVerification}
  }

  function privacyHtml(){
    const s=session(),signed=!!s?.access_token,billingEnv=clean(launchHealth?.billing?.environment||'sandbox',30),support=clean(launchHealth?.legal?.supportEmail||'',240),sandbox=billingEnv!=='production',reviewed=!!launchHealth?.legal?.legalReviewValidated;
    const supportCopy=support?'<p><b>Support email:</b> '+esc(support)+'</p>':'<p><b>Support:</b> use the in-app Support form. Add an email address there only if you want a reply outside SCHOLARK.</p>';
    return '<div class="v116-dialog-top"><div><small>SCHOLARK · PRIVACY NOTICE & PRODUCT TERMS · 3 OCT 2026</small><h2>Your data stays under your control.</h2><p>Plain-language privacy, account, billing and product terms for SCHOLARK.</p></div><button class="v116-x" type="button" aria-label="Close" data-v116-close>×</button></div>'+
      '<section class="v116-panel"><h3>Privacy notice</h3><p>SCHOLARK uses information you provide to run your account, personalize learning tools, save projects and progress, operate credits and billing, answer support requests, secure the service and improve reliability.</p><ul><li>Account/profile details you choose to save.</li><li>Learning content, Planner/Goals, Study Ahead, ARKI chats and projects when you use those features or cloud sync.</li><li>Credit/subscription state, transaction references and billing-event records needed to operate paid features and prevent duplicate fulfillment.</li><li>Limited technical error/performance data. Text typed into learning fields is not intentionally copied into telemetry.</li></ul></section>'+
      '<section class="v116-panel"><h3>Service providers & AI</h3><p>SCHOLARK uses service providers to operate the product, including Supabase for account/data infrastructure and Paddle for checkout and subscription billing. When you use AI features, the prompt and necessary Workspace context may be sent to configured AI providers so they can generate the requested response. Do not enter passwords, payment secrets, government IDs or unnecessary sensitive personal information into prompts.</p></section>'+
      '<section class="v116-panel"><h3>Schools & changing information</h3><p>AI output is guidance. Admissions, tuition, deadlines, eligibility and other changing education facts should be checked against the current official institution or education-authority source. School and institution names are preserved rather than translated. Public school-search sources can include OpenStreetMap and official or verified sources where available.</p></section>'+
      '<section class="v116-panel"><h3>Retention, export & deletion</h3><p>Data is kept while it is needed to provide SCHOLARK, secure the service, maintain billing integrity or meet legitimate recordkeeping needs. Signed-in users can export their SCHOLARK account data and request deletion from this screen. Paddle may separately retain payment records under its own legal and operational requirements.</p></section>'+
      '<section class="v116-panel"><h3>Billing</h3><p>'+(sandbox?'Paddle sandbox is currently active. Test checkout does not create a real commercial subscription or real charge.':'Paid checkout and subscription management are handled securely through Paddle. The current price, trial and renewal terms are shown before checkout. Subscription changes use Paddle’s customer portal.')+'</p><div class="v116-actions"><button class="v116-btn alt" type="button" data-v116-manage '+(!signed?'disabled':'')+'>Manage subscription</button></div></section>'+
      '<section class="v116-panel"><h3>Product terms</h3><ul><li>SCHOLARK is a learning and productivity tool. AI-generated content can be incomplete or wrong and should be checked when decisions matter.</li><li>Use SCHOLARK lawfully and respect academic-integrity, copyright, privacy and safety rules that apply to you.</li><li>You are responsible for keeping your account credentials secure and for activity under your account.</li><li>Credits and paid features are provided according to the plan or top-up shown at checkout. One-time credit top-ups are separate from recurring subscriptions.</li><li>If local law requires parental, guardian or school consent for a minor, the responsible adult or institution must provide it before the learner uses the relevant service.</li><li>SCHOLARK may change features to improve reliability, safety or product quality; material commercial changes should be communicated before they take effect.</li></ul>'+supportCopy+'<p><b>Legal review status:</b> '+(reviewed?'Reviewed for commercial launch.':'Pre-launch text is technically ready but still requires final human legal review before commercial launch.')+'</p><div class="v116-actions"><button class="v116-btn alt" type="button" data-v116-open-support>Contact support</button></div></section>'+
      '<section class="v116-panel"><h3>Export or delete</h3><p>Account deletion is blocked while an active, trialing or past-due subscription still exists so you cannot accidentally keep being billed after the SCHOLARK account disappears.</p><div class="v116-actions"><button class="v116-btn" type="button" data-v116-export '+(!signed?'disabled':'')+'>Export my data</button></div><div class="v116-danger-confirm"><input type="text" autocomplete="off" placeholder="Type DELETE to confirm" aria-label="Type DELETE to confirm account deletion" '+(!signed?'disabled':'')+'><button class="v116-btn danger" type="button" data-v116-delete '+(!signed?'disabled':'')+'>Delete account</button></div><div class="v116-status" data-v116-status>'+(signed?'':'Sign in first to manage account data.')+'</div></section>';
  }
  function serviceHtml(){
    const release=esc(RELEASE()),billing=esc(launchHealth?.billing?.environment||'sandbox'),ready=launchHealth?.ok!==false;
    return '<div class="v116-dialog-top"><div><small>SCHOLARK · SERVICE STATUS</small><h2>'+(ready?'SCHOLARK is operational.':'SCHOLARK service status')+'</h2><p>Current product-service information for this session.</p></div><button class="v116-x" type="button" aria-label="Close" data-v116-close>×</button></div><section class="v116-panel"><h3>Core service</h3><p>Workspace, learning, account, support and guarded billing routes are available on release <b>'+release+'</b>.</p></section><section class="v116-panel"><h3>Billing environment</h3><p>Current environment: <b>'+billing+'</b>. Checkout remains protected by server-side billing and webhook validation.</p></section><section class="v116-panel"><h3>Need help?</h3><p>If something is not working as expected, use Support or Feedback from Help & Support.</p></section>';
  }
  function openService(returnEl){openDialog(serviceHtml(),returnEl)}
  function openPrivacy(returnEl){
    openDialog(privacyHtml(),returnEl);const body=$('#v116-dialog-body'),st=$('[data-v116-status]',body),confirm=$('.v116-danger-confirm input',body);
    $('[data-v116-manage]',body)?.addEventListener('click',async e=>{const b=e.currentTarget;b.disabled=true;st.textContent='Opening secure Paddle subscription management…';try{await window.__SCHOLARK_BILLING__?.manage?.('overview')}catch(err){st.textContent=clean(err?.message||err)}finally{b.disabled=false}});
    $('[data-v116-export]',body)?.addEventListener('click',async e=>{const b=e.currentTarget;b.disabled=true;st.textContent='Preparing your SCHOLARK data export…';try{const r=await fetch('/api/account/export',{headers:{authorization:'Bearer '+token()},cache:'no-store'}),txt=await r.text();if(!r.ok){let d={};try{d=JSON.parse(txt)}catch{}throw new Error(d?.error||d?.code||'Export failed')}const blob=new Blob([txt],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='scholark-data-export-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);st.textContent='Your export has been prepared.'}catch(err){st.textContent=clean(err?.message||err)}finally{b.disabled=false}});
    $('[data-v116-open-support]',body)?.addEventListener('click',()=>openSupport(returnEl));
    $('[data-v116-delete]',body)?.addEventListener('click',async e=>{const b=e.currentTarget;if(clean(confirm?.value,20)!=='DELETE'){st.textContent='Type DELETE exactly before deleting the account.';confirm?.focus();return}b.disabled=true;st.textContent='Deleting your SCHOLARK account…';try{await api('/api/account',{method:'DELETE',body:JSON.stringify({confirm:'DELETE'})});try{await cloud()?.signOut?.()}catch{}localStorage.removeItem('scholark_supabase_session_v2');closeDialog();location.hash='home';setTimeout(()=>location.reload(),80)}catch(err){if(err?.data?.manageBilling)st.textContent='Your subscription is still active. Manage/cancel it first, then return here after Paddle marks it canceled.';else st.textContent=clean(err?.message||err)}finally{b.disabled=false}});
  }

  function supportHtml(){
    return '<div class="v116-dialog-top"><div><small>SCHOLARK · SUPPORT</small><h2>How can we help?</h2><p>Send a support request directly from SCHOLARK. An email address is optional and only needed if you want a reply outside the app.</p></div><button class="v116-x" type="button" aria-label="Close" data-v116-close>×</button></div><section class="v116-panel v116-feedback"><input type="email" autocomplete="email" maxlength="240" placeholder="Email for a reply (optional)" aria-label="Reply email (optional)" style="width:100%;box-sizing:border-box;margin-bottom:8px;border:1px solid rgba(23,25,31,.13);border-radius:10px;padding:9px;font:700 9px Inter"><textarea maxlength="2000" placeholder="Describe what you need help with."></textarea><div class="v116-actions"><button class="v116-btn" type="button" data-v116-support-submit>Send support request</button></div><div class="v116-status" data-v116-status></div></section>';
  }
  function openSupport(returnEl){
    openDialog(supportHtml(),returnEl);const body=$('#v116-dialog-body'),st=$('[data-v116-status]',body),email=$('input[type="email"]',body),ta=$('textarea',body),btn=$('[data-v116-support-submit]',body);
    btn.onclick=async()=>{const message=clean(ta.value,2000),replyEmail=clean(email.value,240);if(message.length<3){st.textContent='Tell us what you need help with first.';ta.focus();return}if(replyEmail&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(replyEmail)){st.textContent='Enter a valid email address or leave it blank.';email.focus();return}btn.disabled=true;st.textContent='Sending…';try{await api('/api/feedback',{method:'POST',body:JSON.stringify({category:'support',message,route:route(),release:RELEASE(),locale:locale(),metadata:{replyEmail:replyEmail||null,viewport:innerWidth+'x'+innerHeight,online:navigator.onLine,platform:navigator.platform||''}})});st.textContent='Your support request was received.';ta.value='';setTimeout(closeDialog,900)}catch(err){st.textContent=clean(err?.message||err)}finally{btn.disabled=false}};
  }

  function feedbackHtml(){
    return '<div class="v116-dialog-top"><div><small>SCHOLARK · FEEDBACK</small><h2>Tell us what needs attention.</h2><p>Bug reports include only technical route/release context unless you type something yourself.</p></div><button class="v116-x" type="button" aria-label="Close" data-v116-close>×</button></div><section class="v116-panel v116-feedback"><select aria-label="Feedback category"><option value="general">General feedback</option><option value="bug">Bug / glitch</option><option value="billing">Billing</option><option value="schools">Schools / education system</option><option value="language">Language / translation</option><option value="accessibility">Accessibility</option><option value="privacy">Privacy / account</option><option value="other">Other</option></select><textarea maxlength="2000" placeholder="What happened, what did you expect, or what should SCHOLARK improve?"></textarea><div class="v116-actions"><button class="v116-btn" type="button" data-v116-submit>Send feedback</button></div><div class="v116-status" data-v116-status></div></section>';
  }
  function openFeedback(returnEl){
    openDialog(feedbackHtml(),returnEl);const body=$('#v116-dialog-body'),st=$('[data-v116-status]',body),sel=$('select',body),ta=$('textarea',body),btn=$('[data-v116-submit]',body);
    btn.onclick=async()=>{const message=clean(ta.value,2000);if(message.length<3){st.textContent='Add a little more detail first.';ta.focus();return}btn.disabled=true;st.textContent='Sending…';try{const payload={category:sel.value,message,route:route(),release:RELEASE(),locale:locale(),metadata:{viewport:innerWidth+'x'+innerHeight,online:navigator.onLine,connection:navigator.connection?.effectiveType||'',platform:navigator.platform||''}};await api('/api/feedback',{method:'POST',body:JSON.stringify(payload)});st.textContent='Thank you — your feedback was received.';ta.value='';setTimeout(closeDialog,700)}catch(err){st.textContent=clean(err?.message||err)}finally{btn.disabled=false}};
  }

  function decorateAccessibility(root=document){
    $$('button',root).forEach(b=>{if(!b.getAttribute('aria-label')&&!clean(b.textContent,120)){const label=clean(b.title||b.dataset?.tooltip||b.dataset?.action||b.className,80);if(label)b.setAttribute('aria-label',label)}});
    $$('[role="dialog"]',root).forEach(x=>{if(!x.getAttribute('aria-modal'))x.setAttribute('aria-modal','true')});
    $$('img',root).forEach(img=>{if(!img.hasAttribute('alt'))img.alt=''});
  }

  function telemetryPayload(kind,extra={}){
    return {route:route(),release:RELEASE(),locale:locale(),viewport:innerWidth+'x'+innerHeight,online:navigator.onLine,kind,...extra};
  }
  async function reportError(err,kind='error'){
    if(errorCount>=5||!uid()||!cloud()?.request)return;errorCount++;
    const message=clean(err?.message||String(err)||'Client error',500),stack=clean(err?.stack||'',1800);
    try{await cloud().request('/rest/v1/client_errors',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({user_id:uid(),message,stack,route:route(),user_agent:clean(navigator.userAgent,500),severity:'error',context:telemetryPayload(kind)})})}catch{}
  }
  function installObservability(){
    addEventListener('error',e=>reportError(e.error||new Error(clean(e.message,500)),'window-error'));
    addEventListener('unhandledrejection',e=>reportError(e.reason instanceof Error?e.reason:new Error(clean(e.reason,500)),'unhandled-rejection'));
    const idle=window.requestIdleCallback||(fn=>setTimeout(fn,900));
    idle(async()=>{
      if(!uid()||!cloud()?.request||sessionStorage.getItem(telemetryKey))return;
      sessionStorage.setItem(telemetryKey,'1');
      try{
        const nav=performance.getEntriesByType?.('navigation')?.[0],duration=Math.round(Number(nav?.loadEventEnd||nav?.duration||0));
        await cloud().request('/rest/v1/usage_events',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({user_id:uid(),feature:'foundation',event:'client_performance',duration_ms:Math.max(0,Math.min(120000,duration)),success:true,credits:0,meta:telemetryPayload('performance',{navigationType:clean(nav?.type,40)})})});
      }catch{}
    },{timeout:2000});
  }

  function sync(){
    decorateAccessibility();
    publicActions();
    if(document.body.classList.contains('v51-workspace')){workspaceHelpActions();removeStandaloneWorkspaceSignOut();renderOnboarding();sourceBadge()}else{$('.v116-workspace-help').forEach(x=>x.remove())}
  }
  const launchMutationRelevant=muts=>muts.some(m=>[...m.addedNodes,...m.removedNodes].some(node=>{
    if(node?.nodeType!==1)return false;
    const el=node;
    if(el.matches?.('#v55-topbar,#v51-main,#v51-sidebar,#v51-top-actions,#v29-home-layer,#v116-onboarding,#v116-workspace-help,.v116-public-actions,button,input,select,textarea,a[href]'))return true;
    return !!el.querySelector?.('#v55-topbar,#v51-main,#v51-sidebar,#v51-top-actions,#v29-home-layer,button,input,select,textarea,a[href]');
  }));
  const mo=new MutationObserver(muts=>{if(!launchMutationRelevant(muts))return;clearTimeout(window.__v116Sync);window.__v116Sync=setTimeout(sync,110)});if(document.body)mo.observe(document.body,{childList:true,subtree:true});else addEventListener('DOMContentLoaded',()=>mo.observe(document.body,{childList:true,subtree:true}),{once:true});
  addEventListener('hashchange',()=>setTimeout(sync,80));addEventListener('scholark-country-change',()=>setTimeout(sourceBadge,80));addEventListener('scholark-language-ready',()=>setTimeout(sync,80));addEventListener('scholark-workspace-entry-ready',()=>setTimeout(sync,40));addEventListener('scholark:topbar-ready',()=>sync());addEventListener('pageshow',()=>setTimeout(sync,80));
  document.addEventListener('click',e=>{if(!e.target.closest?.('#v116-workspace-help')){$('.v116-workspace-help.open').forEach(x=>x.classList.remove('open'));$('#v51-help')?.setAttribute('aria-expanded','false')}});document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('.v116-workspace-help.open').forEach(x=>x.classList.remove('open'));$('#v51-help')?.setAttribute('aria-expanded','false')}});
  installObservability();[120,600,1400].forEach(ms=>setTimeout(sync,ms));
  window.__SCHOLARK_LAUNCH__={health,sources,help:toggleWorkspaceHelp,support:openSupport,feedback:openFeedback,privacy:openPrivacy,service:openService,sync,release:'r208'};
})();