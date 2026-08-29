(() => {
  if (window.__SCHOLARK_V36_WORKSPACE_I18N__) return;
  window.__SCHOLARK_V36_WORKSPACE_I18N__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').trim();

  const style=document.createElement('style');
  style.id='scholark-v36-workspace-i18n-style';
  style.textContent=`
    /* Dashboard/workspace always beats the public-home scripts. */
    body.v36-workspace #v29-home-layer{display:none!important;visibility:hidden!important;pointer-events:none!important}
    body.v36-workspace [data-v30-legacy-home="1"]{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    body.v36-workspace main[data-v30-legacy-home="1"],
    body.v36-workspace [role="main"][data-v30-legacy-home="1"]{min-height:calc(100vh - 74px)!important}
    body.v36-workspace #v34-dashboard-entry{display:none!important}

    #v36-shell-home{border:1px solid rgba(255,255,255,.16);background:#232630;color:#fff;border-radius:999px;padding:9px 12px;font:850 10px/1 Inter,system-ui;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
    #v36-shell-home:hover{background:#303441;transform:translateY(-1px)}
    #v36-language{border:1px solid rgba(255,255,255,.14);background:#22252e;color:#fff;border-radius:999px;padding:8px 30px 8px 11px;font:800 10px/1 Inter,system-ui;outline:none;cursor:pointer;max-width:155px}
    #v36-language option{background:#fff;color:#17191f}
    .v36-shell-controls{display:inline-flex;align-items:center;gap:8px;margin-right:6px}
    [data-v36-hidden-language="1"]{display:none!important}
    @media(max-width:680px){#v36-language{max-width:118px}.v36-shell-controls{gap:5px}#v36-shell-home{padding:8px 10px}}
  `;
  document.head.appendChild(style);

  const langs=[['nl','Nederlands'],['en','English'],['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],['it','Italiano']];

  const labels={
    nl:{home:'Home',dashboard:'Dashboard',education:'Educatie & Leren',projects:'Mijn projecten',tutor:'AI Tutor',studio:'Studio AI',planner:'Planner',progress:'Voortgang',goals:'Doelen',logout:'Uitloggen',focus:'Focusmodus',reset:'Demo resetten'},
    en:{home:'Home',dashboard:'Dashboard',education:'Education & Learning',projects:'My Projects',tutor:'AI Tutor',studio:'Studio AI',planner:'Planner',progress:'Progress',goals:'Goals',logout:'Log out',focus:'Focus mode',reset:'Reset demo'},
    es:{home:'Inicio',dashboard:'Panel',education:'Educación y aprendizaje',projects:'Mis proyectos',tutor:'Tutor IA',studio:'Studio IA',planner:'Planificador',progress:'Progreso',goals:'Metas',logout:'Cerrar sesión',focus:'Modo enfoque',reset:'Reiniciar demo'},
    fr:{home:'Accueil',dashboard:'Tableau de bord',education:'Éducation et apprentissage',projects:'Mes projets',tutor:'Tuteur IA',studio:'Studio IA',planner:'Planificateur',progress:'Progression',goals:'Objectifs',logout:'Déconnexion',focus:'Mode concentration',reset:'Réinitialiser la démo'},
    de:{home:'Start',dashboard:'Dashboard',education:'Bildung & Lernen',projects:'Meine Projekte',tutor:'KI-Tutor',studio:'KI Studio',planner:'Planer',progress:'Fortschritt',goals:'Ziele',logout:'Abmelden',focus:'Fokusmodus',reset:'Demo zurücksetzen'},
    pt:{home:'Início',dashboard:'Painel',education:'Educação e aprendizagem',projects:'Meus projetos',tutor:'Tutor de IA',studio:'Studio IA',planner:'Planejador',progress:'Progresso',goals:'Metas',logout:'Sair',focus:'Modo foco',reset:'Redefinir demo'},
    it:{home:'Home',dashboard:'Dashboard',education:'Istruzione e apprendimento',projects:'I miei progetti',tutor:'Tutor IA',studio:'Studio IA',planner:'Pianificatore',progress:'Progresso',goals:'Obiettivi',logout:'Esci',focus:'Modalità focus',reset:'Reimposta demo'},
    ar:{home:'الرئيسية',dashboard:'لوحة التحكم',education:'التعليم والتعلم',projects:'مشاريعي',tutor:'مدرس الذكاء الاصطناعي',studio:'استوديو الذكاء الاصطناعي',planner:'المخطط',progress:'التقدم',goals:'الأهداف',logout:'تسجيل الخروج',focus:'وضع التركيز',reset:'إعادة ضبط العرض'},
    hi:{home:'होम',dashboard:'डैशबोर्ड',education:'शिक्षा और सीखना',projects:'मेरे प्रोजेक्ट',tutor:'AI ट्यूटर',studio:'AI स्टूडियो',planner:'प्लानर',progress:'प्रगति',goals:'लक्ष्य',logout:'लॉग आउट',focus:'फोकस मोड',reset:'डेमो रीसेट'},
    zh:{home:'首页',dashboard:'仪表板',education:'教育与学习',projects:'我的项目',tutor:'AI 导师',studio:'AI 工作室',planner:'计划',progress:'进度',goals:'目标',logout:'退出',focus:'专注模式',reset:'重置演示'},
    ja:{home:'ホーム',dashboard:'ダッシュボード',education:'教育と学習',projects:'マイプロジェクト',tutor:'AIチューター',studio:'AIスタジオ',planner:'プランナー',progress:'進捗',goals:'目標',logout:'ログアウト',focus:'集中モード',reset:'デモをリセット'},
    ko:{home:'홈',dashboard:'대시보드',education:'교육 및 학습',projects:'내 프로젝트',tutor:'AI 튜터',studio:'AI 스튜디오',planner:'플래너',progress:'진행 상황',goals:'목표',logout:'로그아웃',focus:'집중 모드',reset:'데모 재설정'},
    id:{home:'Beranda',dashboard:'Dasbor',education:'Pendidikan & Pembelajaran',projects:'Proyek Saya',tutor:'Tutor AI',studio:'Studio AI',planner:'Perencana',progress:'Kemajuan',goals:'Tujuan',logout:'Keluar',focus:'Mode fokus',reset:'Atur ulang demo'},
    tr:{home:'Ana Sayfa',dashboard:'Kontrol Paneli',education:'Eğitim ve Öğrenme',projects:'Projelerim',tutor:'AI Eğitmeni',studio:'AI Stüdyosu',planner:'Planlayıcı',progress:'İlerleme',goals:'Hedefler',logout:'Çıkış',focus:'Odak modu',reset:'Demoyu sıfırla'},
    pl:{home:'Strona główna',dashboard:'Panel',education:'Edukacja i nauka',projects:'Moje projekty',tutor:'Tutor AI',studio:'Studio AI',planner:'Planer',progress:'Postęp',goals:'Cele',logout:'Wyloguj',focus:'Tryb skupienia',reset:'Resetuj demo'},
    sw:{home:'Nyumbani',dashboard:'Dashibodi',education:'Elimu na Kujifunza',projects:'Miradi yangu',tutor:'Mkufunzi wa AI',studio:'Studio AI',planner:'Mpangaji',progress:'Maendeleo',goals:'Malengo',logout:'Toka',focus:'Hali ya umakini',reset:'Weka upya demo'}
  };

  function isWorkspace(){
    const h=(location.hash||'').toLowerCase();
    return h.includes('dashboard')||h.includes('studio')||h.includes('presentation')||h.includes('report')||h.includes('document')||h.includes('poster')||h.includes('tutor')||h.includes('planner')||h.includes('progress')||h.includes('goal')||h.includes('project')||h.includes('education')||h.includes('language')||h.includes('files')||h.includes('schools')||h.includes('study')||h.includes('book')||h.includes('webpage')||h.includes('graphic')||h.includes('social');
  }

  function forceWorkspace(){
    const workspace=isWorkspace();
    document.body?.classList.toggle('v36-workspace',workspace);
    if(!workspace)return;

    const layer=$('#v29-home-layer');
    if(layer){layer.hidden=true;layer.style.setProperty('display','none','important');}

    const legacy=$('[data-v30-legacy-home="1"]');
    if(legacy){
      legacy.hidden=false;
      legacy.style.setProperty('display','block','important');
      legacy.style.setProperty('visibility','visible','important');
      legacy.style.setProperty('opacity','1','important');
    }
  }

  function findLanguageAnchor(){
    const names=langs.map(x=>x[1].toLowerCase());
    return $$('button,span,div,select').find(el=>{
      if(el.closest('#v29-home-layer')||el.id==='v36-language')return false;
      const t=text(el).toLowerCase();
      if(!names.includes(t))return false;
      const r=el.getBoundingClientRect();
      return r.top<120&&r.right>innerWidth*.45&&r.width>25&&r.height>15;
    })||null;
  }

  function selectedLang(){
    return localStorage.getItem('scholark_ui_language')||'nl';
  }

  function applyLanguage(code){
    if(!langs.some(x=>x[0]===code))code='en';
    localStorage.setItem('scholark_ui_language',code);
    document.documentElement.lang=code;
    document.documentElement.dir=['ar','ur','fa','he','ps'].includes(code)?'rtl':'ltr';
    if(window.__SCHOLARK_I18N__){
      const sel=$('#v36-language');if(sel&&[...sel.options].some(o=>o.value===code))sel.value=code;
      return;
    }

    const d=labels[code]||labels.en;
    const exactMap={
      'Dashboard':d.dashboard,'Education & Learning':d.education,'Educatie & Leren':d.education,
      'My Projects':d.projects,'Mijn projecten':d.projects,'AI Tutor':d.tutor,'Studio AI':d.studio,
      'Planner':d.planner,'Progress':d.progress,'Voortgang':d.progress,'Goals':d.goals,'Doelen':d.goals,
      'Uitloggen':d.logout,'Log out':d.logout,'Focus mode':d.focus,'Focusmodus':d.focus,
      'Reset demo':d.reset,'Demo resetten':d.reset
    };
    $$('button,a,span,div').forEach(el=>{
      if(el.children.length>0||el.closest('#v29-home-layer'))return;
      const t=text(el);if(exactMap[t])el.textContent=exactMap[t];
    });

    const home=$('#v36-shell-home');if(home)home.innerHTML=`⌂ <span>${d.home}</span>`;
    const sel=$('#v36-language');if(sel&&sel.value!==code)sel.value=code;

    // Keep Studio generation language in sync and expand the options there too.
    const studioSel=$('#sv24-lang');
    if(studioSel){
      langs.forEach(([v,n])=>{if(![...studioSel.options].some(o=>o.value===n||o.textContent===n)){const o=document.createElement('option');o.value=n;o.textContent=n;studioSel.appendChild(o);}});
      const name=langs.find(x=>x[0]===code)?.[1];
      if(name){studioSel.value=name;studioSel.dispatchEvent(new Event('change',{bubbles:true}));}
    }
    window.dispatchEvent(new CustomEvent('scholark-language-change',{detail:{code}}));
  }

  function buildShellControls(){
    if(!isWorkspace())return;
    const anchor=findLanguageAnchor();
    if(!anchor)return;
    let wrap=$('.v36-shell-controls');
    if(!wrap){
      wrap=document.createElement('div');wrap.className='v36-shell-controls';
      const home=document.createElement('button');home.id='v36-shell-home';home.type='button';home.onclick=()=>{location.hash='';setTimeout(()=>{document.body?.classList.remove('v36-workspace');const layer=$('#v29-home-layer');if(layer){layer.hidden=false;layer.style.removeProperty('display');}},20)};
      const sel=document.createElement('select');sel.id='v36-language';sel.setAttribute('aria-label','SCHOLARK language');sel.innerHTML=langs.map(([v,n])=>`<option value="${v}">${n}</option>`).join('');sel.onchange=()=>applyLanguage(sel.value);
      wrap.append(home,sel);
      anchor.parentElement?.insertBefore(wrap,anchor);
    }
    anchor.dataset.v36HiddenLanguage='1';
    applyLanguage(selectedLang());
  }

  function sync(){
    forceWorkspace();
    if(isWorkspace())buildShellControls();
    else document.querySelector('.v36-shell-controls')?.remove();
  }

  new MutationObserver(()=>{clearTimeout(window.__v36t);window.__v36t=setTimeout(sync,80)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,20));
  addEventListener('popstate',()=>setTimeout(sync,20));
  addEventListener('focus',()=>setTimeout(sync,20)); document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(sync,20)});
  setTimeout(sync,40);
})();