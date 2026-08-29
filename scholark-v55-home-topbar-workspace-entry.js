(() => {
  if (window.__SCHOLARK_V55_HOME_TOPBAR__) return;
  window.__SCHOLARK_V55_HOME_TOPBAR__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const publicHome=()=>{const h=String(location.hash||'').toLowerCase();return (location.pathname==='/'||location.pathname==='')&&(h===''||h==='#home'||h==='#pricing')};
  const workspace=()=>!publicHome();

  const LANGS=[['nl','Nederlands'],['en','English'],['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],['it','Italiano'],['ar','العربية'],['hi','हिन्दी'],['zh','中文'],['ja','日本語'],['ko','한국어'],['id','Bahasa Indonesia'],['tr','Türkçe'],['pl','Polski'],['sw','Kiswahili'],['ru','Русский'],['uk','Українська'],['ro','Română'],['cs','Čeština'],['hu','Magyar'],['el','Ελληνικά'],['sv','Svenska'],['da','Dansk'],['no','Norsk'],['fi','Suomi'],['th','ไทย'],['vi','Tiếng Việt'],['ms','Bahasa Melayu'],['fil','Filipino'],['bn','বাংলা'],['ur','اردو'],['fa','فارسی'],['he','עברית'],['ta','தமிழ்'],['te','తెలుగు'],['mr','मराठी'],['af','Afrikaans'],['sq','Shqip'],['hy','Հայերեն'],['az','Azərbaycan dili'],['eu','Euskara'],['be','Беларуская'],['bs','Bosanski'],['bg','Български'],['ca','Català'],['hr','Hrvatski'],['et','Eesti'],['ka','ქართული'],['gu','ગુજરાતી'],['ht','Kreyòl ayisyen'],['ha','Hausa'],['is','Íslenska'],['ga','Gaeilge'],['jv','Basa Jawa'],['kn','ಕನ್ನಡ'],['kk','Қазақ тілі'],['km','ខ្មែរ'],['lo','ລາວ'],['lv','Latviešu'],['lt','Lietuvių'],['mk','Македонски'],['ml','മലയാളം'],['mt','Malti'],['mn','Монгол'],['ne','नेपाली'],['ps','پښتو'],['pa','ਪੰਜਾਬੀ'],['sr','Српски'],['sk','Slovenčina'],['sl','Slovenščina'],['so','Soomaali'],['su','Basa Sunda'],['yo','Yorùbá'],['zu','isiZulu'],['xh','isiXhosa'],['am','አማርኛ'],['my','မြန်မာ'],['si','සිංහල'],['uz','Oʻzbekcha'],['cy','Cymraeg'],['gl','Galego'],['ceb','Cebuano'],['eo','Esperanto'],['gd','Gàidhlig'],['ku','Kurdî'],['ky','Кыргызча']];

  const style=document.createElement('style');
  style.id='scholark-v55-style';
  style.textContent=`
    #v41-dashboard-entry{display:none!important;visibility:hidden!important;pointer-events:none!important}
    #v55-topbar{position:fixed;z-index:2147483500;left:0;right:0;top:0;min-height:66px;background:rgba(248,247,243,.94);backdrop-filter:blur(18px);border-bottom:1px solid rgba(23,25,31,.09);display:none;align-items:center;justify-content:space-between;gap:14px;padding:10px 26px;box-sizing:border-box;font-family:Inter,system-ui,sans-serif;color:#17191f}
    body.v55-public-home #v55-topbar{display:flex}
    body.v55-public-home #v29-home-layer{padding-top:66px!important}
    .v55-brand{display:flex;align-items:center;gap:9px;font:950 14px/1 Inter;letter-spacing:-.02em}.v55-brand-mark{width:30px;height:30px;border-radius:10px;background:linear-gradient(145deg,#c9ff6a,#8b73ff);display:grid;place-items:center;color:#17191f;font:950 10px Inter}.v55-brand small{display:block;font:800 7px/1 Inter;color:#7d7887;letter-spacing:.12em;margin-top:4px}
    .v55-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0;flex-wrap:wrap}.v55-select,.v55-btn{height:38px;border:1px solid rgba(23,25,31,.11);background:#fff;color:#17191f;border-radius:12px;padding:0 12px;font:850 9.5px Inter;cursor:pointer;outline:0}.v55-select{padding-right:30px;min-width:150px;max-width:220px}.v55-btn.dark{background:#17191f;color:#fff;border-color:#17191f}.v55-btn.dark b{color:#c9ff6a}.v55-account-wrap{position:relative}.v55-menu{position:absolute;right:0;top:46px;width:245px;background:#fff;border:1px solid rgba(23,25,31,.1);border-radius:18px;padding:10px;box-shadow:0 24px 70px rgba(25,20,55,.16);display:none}.v55-account-wrap.open .v55-menu{display:block}.v55-menu-head{padding:9px 10px 12px;border-bottom:1px solid rgba(23,25,31,.08);margin-bottom:7px}.v55-menu-head b{font:900 11px Inter}.v55-menu-head span{display:block;margin-top:4px;font:650 8.5px Inter;color:#777}.v55-menu button{width:100%;border:0;background:transparent;text-align:left;border-radius:10px;padding:10px;font:800 9px Inter;cursor:pointer;color:#292631}.v55-menu button:hover{background:#f3f1fa}.v55-menu button.danger{color:#8b342d}
    #v55-workspace-cta{max-width:1240px;margin:24px auto 88px;padding:0 28px;box-sizing:border-box}.v55-entry{width:100%;border:0;border-radius:28px;padding:28px 30px;background:linear-gradient(118deg,#17191f,#2a2450 62%,#4939a5);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:24px;text-align:left;cursor:pointer;box-shadow:0 26px 80px rgba(42,32,104,.18);transition:transform .22s ease,box-shadow .22s ease}.v55-entry:hover{transform:translateY(-3px);box-shadow:0 34px 95px rgba(42,32,104,.27)}.v55-entry small{display:block;color:#c9ff6a;font:950 8px/1 Inter;letter-spacing:.15em;margin-bottom:8px}.v55-entry strong{display:block;font:950 clamp(28px,4vw,46px)/.95 Inter;letter-spacing:-.045em}.v55-entry>div{min-width:0}.v55-entry p{margin:9px 0 0;color:#d2cfda;font:650 10.5px/1.5 Inter;max-width:900px}.v55-entry-arrow{width:58px;height:58px;border-radius:18px;background:#c9ff6a;color:#17191f;display:grid;place-items:center;flex:0 0 58px;font:950 28px/1 Inter}
    @media(max-width:900px){#v55-topbar{min-height:62px;padding:9px 12px;align-items:flex-start}.v55-brand small{display:none}.v55-actions{gap:5px;max-width:70%}.v55-select{min-width:125px;max-width:170px}.v55-btn{padding:0 9px}.v55-account-label{display:none}body.v55-public-home #v29-home-layer{padding-top:72px!important}#v55-workspace-cta{padding:0 12px;margin-bottom:64px}.v55-entry{padding:22px 20px;border-radius:22px;align-items:flex-start}.v55-entry strong{font-size:clamp(26px,7vw,40px)}.v55-entry-arrow{width:48px;height:48px;flex-basis:48px}}@media(max-width:560px){#v55-topbar{flex-wrap:wrap}.v55-brand{width:100%}.v55-actions{width:100%;max-width:none;justify-content:stretch}.v55-select{flex:1;max-width:none}.v55-entry{display:grid;grid-template-columns:minmax(0,1fr) auto}.v55-entry p{font-size:9.5px}}
  `;
  document.head.appendChild(style);

  let topbar=null,accountWrap=null,authButton=null;

  function findNative(regex){
    return $$('button,a,[role="button"],[tabindex],div,span').filter(el=>!el.closest('#v55-topbar,#v29-home-layer,#v51-sidebar,#v51-main,#v53-emergency')&&text(el).length>0&&text(el).length<70).map(el=>({el,t:lower(el),n:el.querySelectorAll('*').length})).filter(o=>regex.test(o.t)).sort((a,b)=>{const aa=['BUTTON','A'].includes(a.el.tagName)||a.el.getAttribute('role')==='button'?0:1,bb=['BUTTON','A'].includes(b.el.tagName)||b.el.getAttribute('role')==='button'?0:1;return aa-bb||a.n-b.n})[0]?.el||null;
  }
  function clickNative(regex){const el=findNative(regex);if(!el)return false;const hit=el.closest('button,a,[role="button"],[tabindex]')||el;try{hit.click();return true}catch{return false}}
  function signedIn(){return !!findNative(/^(uitloggen|log out|sign out|logout)$/i)}

  function applyLanguage(code){
    if(!LANGS.some(x=>x[0]===code))code='nl';
    localStorage.setItem('scholark_ui_language',code);
    document.documentElement.lang=code;
    document.documentElement.dir=['ar','ur','fa','he','ps'].includes(code)?'rtl':'ltr';
    const name=LANGS.find(x=>x[0]===code)?.[1];
    const nativeSelect=$$('select').find(s=>s.id!=='v55-language'&&!s.closest('#v29-home-layer')&&[...s.options].some(o=>String(o.value||o.textContent).toLowerCase()===String(code).toLowerCase()||String(o.textContent).trim()===name));
    if(nativeSelect){const opt=[...nativeSelect.options].find(o=>String(o.value).toLowerCase()===code||String(o.textContent).trim()===name);if(opt){nativeSelect.value=opt.value;nativeSelect.dispatchEvent(new Event('change',{bubbles:true}))}}
    window.dispatchEvent(new CustomEvent('scholark-language-change',{detail:{code}}));
  }

  function accountMenu(){
    const plan=(localStorage.getItem('scholark_selected_plan')||'free').toUpperCase();
    return `<div class="v55-menu-head"><b>SCHOLARK Account</b><span>${signedIn()?'Signed in':'Not signed in'} · ${plan} plan</span></div><button data-v55-account="manage">Manage account</button><button data-v55-account="plans">Plans & billing</button>${signedIn()?'<button class="danger" data-v55-account="signout">Sign out</button>':'<button data-v55-account="signin">Sign in</button>'}`;
  }

  function buildTopbar(){
    if(topbar)return;
    topbar=document.createElement('header');topbar.id='v55-topbar';topbar.innerHTML=`<div class="v55-brand"><div class="v55-brand-mark">S</div><div>SCHOLARK<small>AI LEARNING + CREATION OS</small></div></div><div class="v55-actions"><select id="v55-language" class="v55-select" aria-label="Language">${LANGS.map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}</select><div class="v55-account-wrap"><button class="v55-btn" id="v55-account"><span class="v55-account-label">Account</span> ▾</button><div class="v55-menu"></div></div><button class="v55-btn dark" id="v55-auth"></button></div>`;
    document.body.appendChild(topbar);
    const lang=$('#v55-language',topbar);const saved=localStorage.getItem('scholark_ui_language')||'nl';lang.value=LANGS.some(x=>x[0]===saved)?saved:'nl';lang.onchange=()=>window.__SCHOLARK_I18N__?.changeLanguage?.(lang.value)||applyLanguage(lang.value);
    accountWrap=$('.v55-account-wrap',topbar);$('#v55-account',topbar).onclick=e=>{e.stopPropagation();accountWrap.classList.toggle('open');$('.v55-menu',topbar).innerHTML=accountMenu()};
    $('.v55-menu',topbar).addEventListener('click',e=>{const b=e.target.closest('[data-v55-account]');if(!b)return;const a=b.dataset.v55Account;if(a==='manage'){if(!clickNative(/^(account|my account|profile|profiel|settings|instellingen|account settings)$/i)){$('.v55-menu',topbar).innerHTML=`<div class="v55-menu-head"><b>Account settings</b><span>Plan: ${(localStorage.getItem('scholark_selected_plan')||'free').toUpperCase()} · Language: ${LANGS.find(x=>x[0]===(localStorage.getItem('scholark_ui_language')||'nl'))?.[1]||'Nederlands'}</span></div><button data-v55-account="plans">Plans & billing</button>${signedIn()?'<button class="danger" data-v55-account="signout">Sign out</button>':'<button data-v55-account="signin">Sign in</button>'}`}}else if(a==='plans'){accountWrap.classList.remove('open');$('#v41-home-pricing')?.scrollIntoView({behavior:'smooth',block:'start'})}else if(a==='signin'){accountWrap.classList.remove('open');clickNative(/^(sign in|log in|login|inloggen|aanmelden)$/i)}else if(a==='signout'){accountWrap.classList.remove('open');clickNative(/^(uitloggen|log out|sign out|logout)$/i);setTimeout(syncAuth,250)}});
    authButton=$('#v55-auth',topbar);authButton.onclick=()=>{if(signedIn())clickNative(/^(uitloggen|log out|sign out|logout)$/i);else clickNative(/^(sign in|log in|login|inloggen|aanmelden)$/i);setTimeout(syncAuth,250)};
    document.addEventListener('click',e=>{if(accountWrap&&!accountWrap.contains(e.target))accountWrap.classList.remove('open')});
    syncAuth();
  }

  function syncAuth(){if(!authButton)return;const on=signedIn();authButton.innerHTML=on?'Sign out':'<b>Sign in</b>';authButton.title=on?'Sign out of SCHOLARK':'Sign in to SCHOLARK'}

  function openWorkspace(){
    if(location.hash!=='#dashboard') location.hash='dashboard';
    else window.dispatchEvent(new HashChangeEvent('hashchange'));
    let tries=0;const timer=setInterval(()=>{tries++;const b=$('#v51-sidebar [data-v51-tool="dashboard"],#v51-main [data-v51-tool="dashboard"]');if(b){try{b.click()}catch{}clearInterval(timer)}else if(tries>=20)clearInterval(timer)},60);
  }

  function ensureWorkspaceCTA(){
    const home=$('#v29-home-layer');if(!home||$('#v55-workspace-cta'))return;
    let final=$('.v29-final,.v29-final-cta,[class*="final-cta"]',home);
    if(!final){final=$$('section,div',home).filter(el=>/je volgende voorsprong kan vandaag beginnen|your next advantage can start today/i.test(text(el))).sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0]||null}
    if(!final)return;
    const wrap=document.createElement('section');wrap.id='v55-workspace-cta';wrap.innerHTML=`<button class="v55-entry" type="button"><div><small>SCHOLARK WORKSPACE</small><strong>Go to Workspace</strong><p>Open your dashboard, Studio AI, Tutor, learning tools, planning, goals and Pro tools.</p></div><span class="v55-entry-arrow">→</span></button>`;$('.v55-entry',wrap).onclick=openWorkspace;final.insertAdjacentElement('afterend',wrap);window.__SCHOLARK_I18N__?.apply?.(wrap);setTimeout(()=>window.__SCHOLARK_I18N__?.translateMissing?.(),40);
  }

  function sync(){
    buildTopbar();
    $('#v41-dashboard-entry')?.remove();
    const home=publicHome();document.body.classList.toggle('v55-public-home',home);
    if(home){ensureWorkspaceCTA();syncAuth()}else accountWrap?.classList.remove('open');
  }

  addEventListener('hashchange',()=>setTimeout(sync,10));addEventListener('popstate',()=>setTimeout(sync,10));
  new MutationObserver(()=>{clearTimeout(window.__v55sync);window.__v55sync=setTimeout(sync,80)}).observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('focus',()=>setTimeout(sync,20));setTimeout(sync,40);
})();