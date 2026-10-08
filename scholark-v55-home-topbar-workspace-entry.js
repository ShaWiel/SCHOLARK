(() => {
  if (window.__SCHOLARK_V55_HOME_TOPBAR__) return;
  window.__SCHOLARK_V55_HOME_TOPBAR__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const publicHome=()=>window.__SCHOLARK_ROUTES__?.isHome?.()??(()=>{const p=String(location.pathname||'/').replace(/\/+$/,'')||'/',h=String(location.hash||'').toLowerCase().replace(/^#/,'').split(/[?&]/)[0].replace(/\/+$/,'');return (p==='/'||p==='/index.html')&&['','home','pricing','start','credit-store'].includes(h)})();
  const workspace=()=>!publicHome();
  const publicTopbarRoute=()=>{const h=String(location.hash||'').toLowerCase().replace(/^#/,'').split(/[?&]/)[0].replace(/\/+$/,'');return h==='credit-store'||publicHome()};

  const FALLBACK_LANGS=[['nl','Dutch'],['en','English'],['es','Spanish'],['fr','French'],['de','Deutsch'],['pt','Português'],['it','Italiano']];
  const languageRows=()=>window.__SCHOLARK_I18N__?.langs?.length?window.__SCHOLARK_I18N__.langs:FALLBACK_LANGS;
  const TOPBAR_COPY={
    nl:{account:'Account',signin:'Inloggen',signout:'Uitloggen',signedIn:'Ingelogd',signedOut:'Niet ingelogd',manage:'Account beheren',plans:'Abonnementen en facturering'},
    en:{account:'Account',signin:'Sign in',signout:'Sign out',signedIn:'Signed in',signedOut:'Not signed in',manage:'Manage account',plans:'Plans & billing'},
    es:{account:'Cuenta',signin:'Iniciar sesión',signout:'Cerrar sesión',signedIn:'Sesión iniciada',signedOut:'Sesión no iniciada',manage:'Administrar cuenta',plans:'Planes y facturación'},
    fr:{account:'Compte',signin:'Se connecter',signout:'Se déconnecter',signedIn:'Connecté',signedOut:'Non connecté',manage:'Gérer le compte',plans:'Plans et facturation'},
    de:{account:'Konto',signin:'Anmelden',signout:'Abmelden',signedIn:'Angemeldet',signedOut:'Nicht angemeldet',manage:'Konto verwalten',plans:'Tarife & Abrechnung'},
    pt:{account:'Conta',signin:'Entrar',signout:'Sair',signedIn:'Sessão iniciada',signedOut:'Não conectado',manage:'Gerenciar conta',plans:'Planos e faturamento'},
    it:{account:'Account',signin:'Accedi',signout:'Esci',signedIn:'Accesso effettuato',signedOut:'Non connesso',manage:'Gestisci account',plans:'Piani e fatturazione'}
  };
  const TOPBAR_SOURCE={account:'Account',signin:'Sign in',signout:'Sign out',signedIn:'Signed in',signedOut:'Not signed in',manage:'Manage account',plans:'Plans & billing',settings:'Account settings',plan:'Plan',language:'Language'};
  const dynamicTopbarCopy=new Map();
  const topbarCode=()=>localStorage.getItem('scholark_ui_language')||'nl';
  const topbarCopy=()=>TOPBAR_COPY[topbarCode()]||dynamicTopbarCopy.get(topbarCode())||TOPBAR_COPY.en;
  async function localizeTopbar(target=topbarCode()){
    if(TOPBAR_COPY[target]||target==='en'){syncTopbarCopy();return topbarCopy()}
    const api=window.__SCHOLARK_I18N__;if(!api?.translateStrings){syncTopbarCopy();return topbarCopy()}
    try{
      const source=Object.values(TOPBAR_SOURCE),translated=await api.translateStrings(target,source,'topbar_ui');
      const out={};for(const [k,v] of Object.entries(TOPBAR_SOURCE))out[k]=translated?.[v]||v;
      dynamicTopbarCopy.set(target,out);
      if(topbarCode()===target)syncTopbarCopy();
      return out;
    }catch{syncTopbarCopy();return topbarCopy()}
  }

  const style=document.createElement('style');
  style.id='scholark-v55-style';
  style.textContent=`
    #v41-dashboard-entry{display:none!important;visibility:hidden!important;pointer-events:none!important}
    #v55-topbar{position:fixed;z-index:2147483500;left:0;right:0;top:0;min-height:66px;background:linear-gradient(180deg,rgba(9,18,30,.98),rgba(15,28,44,.98));backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.08);display:none;align-items:center;justify-content:space-between;gap:14px;padding:10px 26px;box-sizing:border-box;font-family:Inter,system-ui,sans-serif;color:#fff;box-shadow:0 10px 30px rgba(4,10,18,.16)}
    body.v55-public-home #v55-topbar,html.v55-public-home #v55-topbar{display:flex}body.v51-workspace #v55-topbar,html.v51-workspace-root #v55-topbar{display:none!important;visibility:hidden!important;pointer-events:none!important}
    body.v55-public-home #v55-language,html.v55-public-home #v55-language{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    body.v55-public-home #v29-home-layer,html.v55-public-home #v29-home-layer{top:66px!important;padding-top:0!important}
    .v55-brand{display:flex;align-items:center;gap:10px;font:950 14px/1 Inter;letter-spacing:-.02em;color:#fff}.v55-brand-logo{display:block;width:42px;height:42px;object-fit:contain;flex:0 0 42px}.v55-brand small{display:block;font:800 7px/1 Inter;color:#a9b1bd;letter-spacing:.12em;margin-top:4px}
    .v55-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-width:0;flex-wrap:wrap}#v117-store-return-home,#v117-store-return-workspace{display:none}.v55-select,.v55-btn{height:38px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#fff;border-radius:12px;padding:0 12px;font:850 9.5px Inter;cursor:pointer;outline:0}.v55-select option{background:#fff;color:#17191f}.v55-select{padding-right:30px;min-width:150px;max-width:220px}.v55-btn.dark{background:#c9ff6a;color:#17191f;border-color:#c9ff6a}.v55-btn.dark b{color:#17191f}#v55-auth[hidden]{display:none!important}.v55-account-wrap{position:relative}.v55-menu{position:absolute;right:0;top:46px;width:245px;background:#fff;border:1px solid rgba(23,25,31,.1);border-radius:18px;padding:10px;box-shadow:0 24px 70px rgba(25,20,55,.16);display:none}.v55-account-wrap.open .v55-menu{display:block}.v55-menu-head{padding:9px 10px 12px;border-bottom:1px solid rgba(23,25,31,.08);margin-bottom:7px}.v55-menu-head b{font:900 11px Inter}.v55-menu-head span{display:block;margin-top:4px;font:650 8.5px Inter;color:#777}.v55-menu button{width:100%;border:0;background:transparent;text-align:left;border-radius:10px;padding:10px;font:800 9px Inter;cursor:pointer;color:#292631}.v55-menu button:hover{background:#f3f1fa}.v55-menu button.danger{color:#8b342d}
    #v55-workspace-cta{max-width:1240px;margin:24px auto 88px;padding:0 28px;box-sizing:border-box}.v55-entry{width:100%;border:0;border-radius:28px;padding:28px 30px;background:linear-gradient(118deg,#17191f,#2a2450 62%,#4939a5);color:#fff;display:flex;align-items:center;justify-content:space-between;gap:24px;text-align:left;cursor:pointer;box-shadow:0 26px 80px rgba(42,32,104,.18);transition:transform .22s ease,box-shadow .22s ease}.v55-entry:hover{transform:translateY(-3px);box-shadow:0 34px 95px rgba(42,32,104,.27)}.v55-entry small{display:block;color:#c9ff6a;font:950 8px/1 Inter;letter-spacing:.15em;margin-bottom:8px}.v55-entry strong{display:block;font:950 clamp(28px,4vw,46px)/.95 Inter;letter-spacing:-.045em}.v55-entry>div{min-width:0}.v55-entry p{margin:9px 0 0;color:#d2cfda;font:650 10.5px/1.5 Inter;max-width:900px}.v55-entry-arrow{width:58px;height:58px;border-radius:18px;background:#c9ff6a;color:#17191f;display:grid;place-items:center;flex:0 0 58px;font:950 28px/1 Inter}

    .v55-profile-trigger{width:40px;height:40px;padding:0!important;border-radius:50%!important;display:grid;place-items:center;overflow:hidden;background:rgba(255,255,255,.07)!important}
    .v55-profile-avatar,.v55-menu-avatar{display:grid;place-items:center;border-radius:50%;overflow:hidden;background:linear-gradient(145deg,#c9ff6a,#8fdc48);color:#172016;font:950 13px/1 Inter;letter-spacing:-.03em}.v55-profile-avatar{width:32px;height:32px}.v55-profile-avatar img,.v55-menu-avatar img{width:100%;height:100%;object-fit:cover;display:block}.v55-account-label{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
    .v55-menu{width:min(330px,calc(100vw - 24px))!important;color:#292631}.v55-profile-card{display:grid;grid-template-columns:44px minmax(0,1fr);gap:10px;align-items:center;padding:11px;border-radius:15px;background:#f7f6f8;border:1px solid rgba(23,25,31,.06);margin-bottom:7px}.v55-menu-avatar{width:44px;height:44px}.v55-profile-meta{min-width:0}.v55-profile-meta b{display:block;font:900 11px/1.2 Inter;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v55-profile-meta span{display:block;margin-top:4px;font:650 8px/1.25 Inter;color:#777;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.v55-menu-head{padding:9px 10px 7px!important;margin:3px 0 0!important;border-bottom:0!important}.v55-menu-head b{font:900 7px/1 Inter!important;letter-spacing:.12em;text-transform:uppercase;color:#8a8590}.v55-profile-row{display:flex!important;align-items:center;gap:9px}.v55-row-badge{width:26px;height:26px;flex:0 0 26px;border-radius:50%;display:grid;place-items:center;background:#ece9f4;font:900 8px Inter}.v55-row-copy{min-width:0;display:block}.v55-row-copy strong{display:block;font:850 8.5px Inter;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v55-row-copy small{display:block;margin-top:2px;font:650 7px Inter;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v55-profile-empty{padding:8px 10px;font:650 8px/1.4 Inter;color:#888}
    @media(max-width:900px){#v55-topbar{min-height:62px;padding:9px 12px;align-items:flex-start}.v55-brand small{display:none}.v55-actions{gap:5px;max-width:70%}.v55-select{min-width:125px;max-width:170px}.v55-btn{padding:0 9px}.v55-account-label{display:none}body.v55-public-home #v29-home-layer,html.v55-public-home #v29-home-layer{top:62px!important;padding-top:0!important}#v55-workspace-cta{padding:0 12px;margin-bottom:64px}.v55-entry{padding:22px 20px;border-radius:22px;align-items:flex-start}.v55-entry strong{font-size:clamp(26px,7vw,40px)}.v55-entry-arrow{width:48px;height:48px;flex-basis:48px}}@media(max-width:560px){#v55-topbar{flex-wrap:wrap}body.v55-public-home #v29-home-layer,html.v55-public-home #v29-home-layer{top:108px!important}.v55-brand{width:100%}.v55-actions{width:100%;max-width:none;justify-content:stretch}.v55-select{flex:1;max-width:none}.v55-entry{display:grid;grid-template-columns:minmax(0,1fr) auto}.v55-entry p{font-size:9.5px}}
  `;
  document.head.appendChild(style);

  let topbar=null,accountWrap=null,authButton=null;

  function findNative(regex){
    return $$('button,a,[role="button"],[tabindex],div,span').filter(el=>!el.closest('#v55-topbar,#v29-home-layer,#v51-sidebar,#v51-main,#v53-emergency')&&text(el).length>0&&text(el).length<70).map(el=>({el,t:lower(el),n:el.querySelectorAll('*').length})).filter(o=>regex.test(o.t)).sort((a,b)=>{const aa=['BUTTON','A'].includes(a.el.tagName)||a.el.getAttribute('role')==='button'?0:1,bb=['BUTTON','A'].includes(b.el.tagName)||b.el.getAttribute('role')==='button'?0:1;return aa-bb||a.n-b.n})[0]?.el||null;
  }
  function clickNative(regex){const el=findNative(regex);if(!el)return false;const hit=el.closest('button,a,[role="button"],[tabindex]')||el;try{hit.click();return true}catch{return false}}
  function openAuth(tab='signin'){const a=window.__SCHOLARK_V72_CLOUD__;if(a?.openAuth){a.openAuth(tab);return true}return clickNative(/^(sign in|log in|login|inloggen|aanmelden)$/i)}
  function doSignOut(){const a=window.__SCHOLARK_V72_CLOUD__;if(a?.signOut){Promise.resolve(a.signOut()).finally(()=>setTimeout(syncAuth,40));return true}return clickNative(/^(uitloggen|log out|sign out|logout)$/i)}
  function signedIn(){
    try{
      if(window.__SCHOLARK_V72_CLOUD__?.currentSession?.()?.access_token)return true;
      const s=JSON.parse(localStorage.getItem('scholark_supabase_session_v2')||'null');
      return !!s?.access_token;
    }catch{return false}
  }

  function applyLanguage(code){
    if(!languageRows().some(x=>x[0]===code))code='nl';
    localStorage.setItem('scholark_ui_language',code);
    document.documentElement.lang=code;
    document.documentElement.dir=['ar','ur','fa','he','ps'].includes(code)?'rtl':'ltr';
    const name=languageRows().find(x=>x[0]===code)?.[1];
    const nativeSelect=$$('select').find(s=>s.id!=='v55-language'&&!s.closest('#v29-home-layer')&&[...s.options].some(o=>String(o.value||o.textContent).toLowerCase()===String(code).toLowerCase()||String(o.textContent).trim()===name));
    if(nativeSelect){const opt=[...nativeSelect.options].find(o=>String(o.value).toLowerCase()===code||String(o.textContent).trim()===name);if(opt){nativeSelect.value=opt.value;nativeSelect.dispatchEvent(new Event('change',{bubbles:true}))}}
    window.dispatchEvent(new CustomEvent('scholark-language-change',{detail:{code}}));
  }

  const escAccount=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const accountInitials=(name,email)=>{const p=String(name||'').trim().split(/\s+/).filter(Boolean);return ((p[0]?.[0]||String(email||'S')[0]||'S')+(p.length>1?(p.at(-1)?.[0]||''):'')).toUpperCase().slice(0,2)};
  let v55AvatarUrl='',v55Identity={id:'',email:'',name:'',avatarPath:''},v55HydrateEpoch=0;
  function accountSnapshot(){
    const c=window.__SCHOLARK_V72_CLOUD__,s=c?.currentSession?.(),u=s?.user||{},rows=c?.rememberedAccounts?.()||[],email=String(u.email||'').toLowerCase(),cur=rows.find(x=>x.id===u.id||x.email===email)||{};
    return {id:String(u.id||cur.id||''),email:String(u.email||cur.email||''),name:String(cur.displayName||u.user_metadata?.full_name||u.email?.split('@')[0]||'SCHOLARK'),avatarPath:String(cur.avatarPath||'')};
  }
  function renderProfileAvatar(el,identity=v55Identity){if(!el)return;el.innerHTML='<span>'+escAccount(accountInitials(identity.name,identity.email))+'</span>';el.title=identity.email||identity.name||'SCHOLARK profile'}
  async function hydrateAccountIdentity(){
    if(!topbar?.isConnected)return;const epoch=++v55HydrateEpoch,c=window.__SCHOLARK_V72_CLOUD__;let identity=accountSnapshot();
    if(identity.id&&c?.request){try{const r=await c.request('/rest/v1/profiles?select=display_name,avatar_path&user_id=eq.'+encodeURIComponent(identity.id)+'&limit=1',{method:'GET'}),d=await r.json().catch(()=>[]),p=Array.isArray(d)?d[0]:d;if(p){identity.name=String(p.display_name||identity.name||'');identity.avatarPath=String(p.avatar_path||identity.avatarPath||'');c.updateRememberedAccount?.({displayName:identity.name,avatarPath:identity.avatarPath})}}catch{}}
    if(epoch!==v55HydrateEpoch||!topbar?.isConnected)return;v55Identity=identity;
    const avatar=$('#v55-profile-avatar',topbar),menuAvatar=$('#v55-menu-avatar',topbar);renderProfileAvatar(avatar,identity);renderProfileAvatar(menuAvatar,identity);
    if(identity.avatarPath&&c?.profilePhotoUrl){try{const url=await c.profilePhotoUrl(identity.avatarPath);if(epoch!==v55HydrateEpoch||!url)return;if(v55AvatarUrl&&v55AvatarUrl!==url)try{URL.revokeObjectURL(v55AvatarUrl)}catch{}v55AvatarUrl=url;for(const el of [avatar,menuAvatar].filter(Boolean))el.innerHTML='<img src="'+escAccount(url)+'" alt="Profile photo">' }catch{}}
    const name=$('#v55-menu-name',topbar),email=$('#v55-menu-email',topbar);if(name)name.textContent=identity.name||'SCHOLARK';if(email)email.textContent=identity.email||'';
  }
  function accountMenu(){
    const c=window.__SCHOLARK_V72_CLOUD__,plan=(window.__SCHOLARK_BILLING__?.plan?.()||'free').toUpperCase(),t=topbarCopy(),on=signedIn(),identity=accountSnapshot(),rows=(c?.rememberedAccounts?.()||[]).filter(x=>x.id!==identity.id&&x.email!==identity.email).slice(0,6);
    const others=rows.length?rows.map(a=>'<button class="v55-profile-row" data-v55-account="switch" data-v55-key="'+escAccount(a.id||a.email)+'"><span class="v55-row-badge">'+escAccount(accountInitials(a.displayName,a.email))+'</span><span class="v55-row-copy"><strong>'+escAccount(a.displayName||a.email)+'</strong><small>'+escAccount(a.email)+'</small></span></button>').join(''):'<div class="v55-profile-empty">No other SCHOLARK profiles saved on this device yet.</div>';
    return '<div class="v55-profile-card"><span class="v55-menu-avatar" id="v55-menu-avatar">'+escAccount(accountInitials(identity.name,identity.email))+'</span><span class="v55-profile-meta"><b id="v55-menu-name">'+escAccount(identity.name||'SCHOLARK')+'</b><span id="v55-menu-email">'+escAccount(identity.email||(!on?t.signedOut:''))+'</span><span>'+escAccount(plan)+' plan</span></span></div>'+
      '<button data-v55-account="manage">Customize profile</button><button data-v55-account="manage">Manage account</button><button data-v55-account="plans">'+t.plans+'</button>'+
      '<div class="v55-menu-head"><b>Other SCHOLARK profiles</b></div>'+others+
      '<button data-v55-account="add-profile">＋ Add SCHOLARK profile</button><button data-v55-account="manage">Manage SCHOLARK profiles</button>'+
      (on?'<button class="danger" data-v55-account="signout">'+t.signout+'</button>':'<button data-v55-account="signin">'+t.signin+'</button>');
  }

  function pruneTopbarDuplicates(){
    const bars=[...document.querySelectorAll('#v55-topbar')];
    let keep=topbar?.isConnected?topbar:(bars[0]||null);
    for(const bar of bars){if(bar!==keep)bar.remove()}
    if(keep&&keep.isConnected)topbar=keep;
    return keep;
  }
  function removePublicTopbar(){
    document.querySelectorAll('#v55-topbar').forEach(el=>el.remove());
    document.querySelectorAll('.v116-public-actions').forEach(el=>el.remove());
    topbar=accountWrap=authButton=null;
  }
  function buildTopbar(){
    if(!publicTopbarRoute()){removePublicTopbar();return null}
    pruneTopbarDuplicates();
    if(topbar?.isConnected)return;
    topbar=$('#v55-topbar');
    if(topbar?.isConnected){accountWrap=$('.v55-account-wrap',topbar);authButton=$('#v55-auth',topbar);return}
    topbar=document.createElement('header');topbar.id='v55-topbar';topbar.dataset.v55Owned='1';topbar.innerHTML=`<div class="v55-brand"><img class="v55-brand-logo" src="/scholark-logo.png" alt="SCHOLARK logo"><div>SCHOLARK<small>AI LEARNING + CREATION OS</small></div></div><div class="v55-actions"><select id="v55-language" class="v55-select" aria-label="Language">${languageRows().map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}</select><button type="button" class="v117-store-return" id="v117-store-return-home" aria-label="Return to Homepage"><span class="v117-return-prefix">← </span><span class="v117-store-return-label">Return to Homepage</span></button><button type="button" class="v117-store-return primary" id="v117-store-return-workspace" aria-label="Return to Workspace"><span class="v117-return-prefix">← </span><span class="v117-store-return-label">Return to Workspace</span></button><div class="v55-account-wrap"><button class="v55-btn v55-profile-trigger" id="v55-account" data-sch-i18n-owned="1" aria-haspopup="menu" aria-expanded="false" title="SCHOLARK profile"><span class="v55-profile-avatar" id="v55-profile-avatar"><span>S</span></span><span class="v55-account-label"></span></button><div class="v55-menu" role="menu" data-sch-i18n-owned="1"></div></div><button class="v55-btn dark" id="v55-auth" data-sch-i18n-owned="1"></button></div>`;
    document.body.appendChild(topbar);pruneTopbarDuplicates();
    queueMicrotask(()=>window.dispatchEvent(new CustomEvent('scholark:topbar-ready')));
    const lang=$('#v55-language',topbar);const saved=localStorage.getItem('scholark_ui_language')||'nl';lang.value=languageRows().some(x=>x[0]===saved)?saved:'nl';lang.onchange=()=>window.__SCHOLARK_I18N__?.changeLanguage?.(lang.value)||applyLanguage(lang.value);
    accountWrap=$('.v55-account-wrap',topbar);
    $('#v55-account',topbar).onclick=e=>{e.stopPropagation();const open=!accountWrap.classList.contains('open');accountWrap.classList.toggle('open',open);e.currentTarget.setAttribute('aria-expanded',open?'true':'false');if(open){$('.v55-menu',topbar).innerHTML=accountMenu();hydrateAccountIdentity()}};
    $('.v55-menu',topbar).addEventListener('click',e=>{
      const b=e.target.closest('[data-v55-account]');if(!b)return;const a=b.dataset.v55Account;
      if(a==='switch'){accountWrap.classList.remove('open');$('#v55-account',topbar)?.setAttribute('aria-expanded','false');window.__SCHOLARK_V72_CLOUD__?.switchAccount?.(b.dataset.v55Key);return}
      if(a==='add-profile'){accountWrap.classList.remove('open');$('#v55-account',topbar)?.setAttribute('aria-expanded','false');window.__SCHOLARK_V72_CLOUD__?.openAuth?.('signup');return}
      if(a==='manage'){accountWrap.classList.remove('open');$('#v55-account',topbar)?.setAttribute('aria-expanded','false');if(window.__SCHOLARK_V89_ACCOUNT__?.open){window.__SCHOLARK_V89_ACCOUNT__.open();return}if(!clickNative(/^(account|my account|profile|profiel|settings|instellingen|account settings)$/i)){setTimeout(()=>window.__SCHOLARK_V89_ACCOUNT__?.open?.(),120)}}
      else if(a==='plans'){accountWrap.classList.remove('open');$('#v55-account',topbar)?.setAttribute('aria-expanded','false');$('#v41-home-pricing')?.scrollIntoView({behavior:'smooth',block:'start'})}
      else if(a==='signin'){accountWrap.classList.remove('open');$('#v55-account',topbar)?.setAttribute('aria-expanded','false');openAuth('signin')}
      else if(a==='signout'){accountWrap.classList.remove('open');$('#v55-account',topbar)?.setAttribute('aria-expanded','false');doSignOut();setTimeout(syncAuth,80)}
    });
    hydrateAccountIdentity();
    authButton=$('#v55-auth',topbar);authButton.onclick=()=>{if(!signedIn())openAuth('signin');setTimeout(syncAuth,80)};
    if(!window.__SCHOLARK_V55_DOC_CLICK_BOUND__){
      window.__SCHOLARK_V55_DOC_CLICK_BOUND__=true;
      document.addEventListener('click',e=>{if(accountWrap&&!accountWrap.contains(e.target))accountWrap.classList.remove('open')});
    }
    syncTopbarCopy();
  }

  function wireLanguageSelector(sel){
    if(!sel)return null;
    const saved=localStorage.getItem('scholark_ui_language')||'nl';
    const html=languageRows().map(([v,n])=>`<option value="${v}">${n}</option>`).join('');
    if(sel.options.length!==languageRows().length||!languageRows().every(([v])=>[...sel.options].some(o=>o.value===v)))sel.innerHTML=html;
    sel.value=languageRows().some(([v])=>v===saved)?saved:'nl';
    sel.onchange=()=>window.__SCHOLARK_I18N__?.changeLanguage?.(sel.value)||applyLanguage(sel.value);
    if(sel.hasAttribute('hidden'))sel.removeAttribute('hidden');
    if(sel.getAttribute('aria-label')!=='Language')sel.setAttribute('aria-label','Language');
    for(const p of ['display','visibility','opacity','pointer-events'])if(sel.style.getPropertyValue(p))sel.style.removeProperty(p);
    return sel;
  }

  function ensureLanguageSelector(){
    if(!publicTopbarRoute()){removePublicTopbar();return null}
    buildTopbar();
    if(!topbar?.isConnected)return null;
    const actions=$('.v55-actions',topbar);if(!actions)return null;
    let sel=$('#v55-language',topbar);
    if(!sel){
      sel=document.createElement('select');
      sel.id='v55-language';sel.className='v55-select';
      const before=$('.v55-account-wrap',actions)||$('#v55-auth',actions)||actions.firstChild;
      if(before)actions.insertBefore(sel,before);else actions.prepend(sel);
    }
    return wireLanguageSelector(sel);
  }

  let topbarRepairTimer=null;
  function scheduleTopbarRepair(delay=40){
    clearTimeout(topbarRepairTimer);
    topbarRepairTimer=setTimeout(()=>{
      if(!publicTopbarRoute()){removePublicTopbar();return}
      buildTopbar();ensureLanguageSelector();bindCopyObserver();pruneTopbarDuplicates();
      const bar=$('#v55-topbar');if(bar){if(bar.style.visibility)bar.style.removeProperty('visibility');if(bar.style.opacity)bar.style.removeProperty('opacity')}
    },delay);
  }

  function suppressLegacyHeader(){
    const home=publicHome();
    $$('[data-v55-suppressed="1"]').forEach(el=>{
      if(home)return;
      el.style.removeProperty('display');el.style.removeProperty('visibility');el.style.removeProperty('pointer-events');delete el.dataset.v55Suppressed;
    });
    if(!home)return;
    const candidates=Array.from(document.querySelectorAll('header,nav,[class*="header"],[class*="topbar"],[class*="nav"]')).filter(el=>{
      if(el===topbar||el.closest('#v55-topbar,#v29-home-layer,#v51-sidebar,#v51-main,.v85-topbar-wallet-panel'))return false;
      const r=el.getBoundingClientRect(),cs=getComputedStyle(el),t=text(el);
      return r.width>Math.min(480,innerWidth*.65)&&r.height>=38&&r.height<170&&r.top<125&&cs.display!=='none'&&cs.visibility!=='hidden'&&(/scholark/i.test(t)||/account|sign in|login|inloggen|aanmelden/i.test(t));
    });
    candidates.forEach(el=>{
      el.dataset.v55Suppressed='1';
      el.style.setProperty('display','none','important');
      el.style.setProperty('visibility','hidden','important');
      el.style.setProperty('pointer-events','none','important');
    });
  }

  function syncTopbarCopy(){
    if(!topbar?.isConnected)return;
    const t=topbarCopy(),on=signedIn(),accountLabel=$('.v55-account-label',topbar),state=(on?'in:':'out:')+(localStorage.getItem('scholark_ui_language')||'nl');
    if(accountLabel&&accountLabel.textContent!==t.account)accountLabel.textContent=t.account;
    const expectedAuth=t.signin;
    if(authButton){
      if(authButton.hidden!==on)authButton.hidden=on;
      const ariaHidden=on?'true':'false';if(authButton.getAttribute('aria-hidden')!==ariaHidden)authButton.setAttribute('aria-hidden',ariaHidden);
      if(!on&&(authButton.dataset.v55State!==state||text(authButton)!==expectedAuth)){
        authButton.dataset.v55State=state;
        authButton.innerHTML='<b>'+t.signin+'</b>';
        authButton.title=expectedAuth+' · SCHOLARK';
      }
    }
    if(accountWrap?.classList.contains('open')){
      const menu=$('.v55-menu',topbar),html=accountMenu();if(menu&&menu.innerHTML!==html)menu.innerHTML=html;
    }
  }
  function syncAuth(){syncTopbarCopy();hydrateAccountIdentity()}

  function openWorkspace(){
    const ws=window.__SCHOLARK_WORKSPACE__;
    // V51 is the single transaction owner. openTool() is Home-safe and owns
    // the route change, entry epoch, public-state cleanup and canonical render.
    // Do not pre-call prepareEntry or mutate #dashboard here: doing both made
    // repeated Home -> Workspace CTA cycles start overlapping entry epochs.
    if(ws?.openTool){ws.openTool('dashboard');return}
    // First-ever entry: changing the hash is enough. The runtime loader will
    // load V51 and the Workspace shell will own the mount once it is ready.
    if(location.hash!=='#dashboard')location.hash='dashboard';
    else window.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  function ensureWorkspaceCTA(){
    const home=$('#v29-home-layer');if(!home||$('#v55-workspace-cta'))return;
    let final=$('.v29-final,.v29-final-cta,[class*="final-cta"]',home);
    if(!final){final=$$('section,div',home).filter(el=>/je volgende voorsprong kan vandaag beginnen|your next advantage can start today/i.test(text(el))).sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0]||null}
    if(!final)return;
    const wrap=document.createElement('section');wrap.id='v55-workspace-cta';wrap.innerHTML=`<button class="v55-entry" type="button"><div><small>SCHOLARK WORKSPACE</small><strong>Go to Workspace</strong><p>Open your dashboard, ARKI, AI Tutor, learning tools, planning, goals and Pro tools.</p></div><span class="v55-entry-arrow">→</span></button>`;$('.v55-entry',wrap).onclick=openWorkspace;final.insertAdjacentElement('afterend',wrap);window.__SCHOLARK_I18N__?.apply?.(wrap);setTimeout(()=>window.__SCHOLARK_I18N__?.translateMissing?.(),40);
  }

  function sync(){
    const home=publicHome();
    document.body.classList.toggle('v55-public-home',home);document.documentElement.classList.toggle('v55-public-home',home);
    $('#v41-dashboard-entry')?.remove();
    if(!home){
      accountWrap?.classList.remove('open');
      removePublicTopbar();
      suppressLegacyHeader();
      return;
    }
    document.querySelectorAll('#v51-top-actions,#v116-workspace-help').forEach(el=>el.remove());
    buildTopbar();
    ensureLanguageSelector();
    const store=String(location.hash||'').toLowerCase().replace(/^#/,'').split(/[?&]/)[0]==='credit-store';
    if(!store)ensureWorkspaceCTA();
    suppressLegacyHeader();syncTopbarCopy();pruneTopbarDuplicates();
  }

  function prepareWorkspaceRoute(reason){
    if(!workspace())return;
    window.__SCHOLARK_WORKSPACE__?.prepareEntry?.(reason);
    document.body.classList.remove('v55-public-home','v81-home');document.documentElement.classList.remove('v55-public-home');
  }
  addEventListener('hashchange',()=>{prepareWorkspaceRoute('hashchange');setTimeout(sync,20);setTimeout(sync,140);scheduleTopbarRepair(320)});
  addEventListener('popstate',()=>{prepareWorkspaceRoute('popstate');setTimeout(sync,20);setTimeout(sync,140);scheduleTopbarRepair(320)});
  addEventListener('pageshow',()=>{prepareWorkspaceRoute('pageshow');setTimeout(sync,20);scheduleTopbarRepair(80)});
  addEventListener('scholark:auth-changed',()=>{setTimeout(syncAuth,20);window.__SCHOLARK_CREDITS__?.load?.()});
  addEventListener('scholark:billing-changed',()=>syncTopbarCopy());
  addEventListener('scholark-language-applied',e=>{const lang=ensureLanguageSelector(),current=localStorage.getItem('scholark_ui_language')||'nl';if(lang&&lang.value!==current)lang.value=current;syncTopbarCopy();localizeTopbar(e.detail?.code||current);scheduleTopbarRepair(20)});
  addEventListener('scholark-language-ready',e=>{const lang=ensureLanguageSelector(),current=localStorage.getItem('scholark_ui_language')||'nl';if(lang&&lang.value!==current)lang.value=current;localizeTopbar(e.detail?.code||current);scheduleTopbarRepair(120)});
  addEventListener('scholark-return-home',()=>{sync();ensureLanguageSelector();[60,220,700,1500].forEach(ms=>setTimeout(()=>{sync();ensureLanguageSelector()},ms))});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleTopbarRepair(80)});
  const topbarObserver=new MutationObserver(muts=>{
    if(!publicHome())return;
    for(const m of muts){
      const touched=[...m.removedNodes,...m.addedNodes].some(n=>n?.nodeType===1&&(n.id==='v55-topbar'||n.id==='v55-language'||n.matches?.('.v55-actions')||n.querySelector?.('#v55-language,.v55-actions')));
      if(touched){scheduleTopbarRepair(35);break}
    }
  });
  topbarObserver.observe(document.body||document.documentElement,{subtree:true,childList:true});
  let topbarCopyQueued=false;
  const topbarCopyObserver=new MutationObserver(muts=>{
    if(!publicHome()||!topbar?.isConnected||topbarCopyQueued)return;
    const relevant=muts.some(m=>m.target?.nodeType===3?m.target.parentElement?.closest?.('#v55-account,#v55-auth'):m.target?.closest?.('#v55-account,#v55-auth'));
    if(!relevant)return;
    topbarCopyQueued=true;queueMicrotask(()=>{topbarCopyQueued=false;syncTopbarCopy()});
  });
  const bindCopyObserver=()=>{if(topbar?.isConnected){topbarCopyObserver.disconnect();topbarCopyObserver.observe(topbar,{subtree:true,childList:true,characterData:true})}};
  if(document.body){sync();bindCopyObserver()}else addEventListener('DOMContentLoaded',()=>{sync();bindCopyObserver()},{once:true});
  [160,650].forEach(ms=>setTimeout(sync,ms));
  window.__SCHOLARK_V55_TOPBAR__={sync,ensureLanguageSelector,buildTopbar,scheduleRepair:scheduleTopbarRepair,publicHome,syncTopbarCopy,localize:localizeTopbar};
})();