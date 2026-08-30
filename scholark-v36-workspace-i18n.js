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

  const langs=[['nl','Dutch'],['en','English'],['es','Spanish'],['fr','French'],['de','Deutch'],['pt','Portugues'],['it','Italian']];

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
    return $('header select,nav select,header button,nav button').find(el=>{
      if(el.closest('#v29-home-layer')||el.id==='v36-language')return false;
      return names.includes(text(el).toLowerCase())||[...el.options||[]].some(o=>names.includes(text(o).toLowerCase()));
    })||null;
  }

  function selectedLang(){
    return localStorage.getItem('scholark_ui_language')||'nl';
  }

  function applyLanguage(code){
    if(!langs.some(x=>x[0]===code))code='en';
    const sel=$('#v36-language');if(sel&&sel.value!==code)sel.value=code;
    if(window.__SCHOLARK_I18N__?.changeLanguage){
      window.__SCHOLARK_I18N__.changeLanguage(code);
      return;
    }
    localStorage.setItem('scholark_ui_language',code);
    document.documentElement.lang=code;
  }

  function buildShellControls(){
    if(!isWorkspace())return;
    // V51/V90 own the modern workspace navigation and language selector.
    if($('#v51-sidebar')){$('.v36-shell-controls')?.remove();return}
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
    const current=selectedLang();if(sel&&sel.value!==current)sel.value=current;
  }

  function sync(){
    forceWorkspace();
    if(isWorkspace())buildShellControls();
    else document.querySelector('.v36-shell-controls')?.remove();
  }

  addEventListener('hashchange',()=>{setTimeout(sync,30);setTimeout(sync,220)});
  addEventListener('popstate',()=>{setTimeout(sync,30);setTimeout(sync,220)});
  addEventListener('scholark-language-ready',()=>{const sel=$('#v36-language');const current=selectedLang();if(sel&&sel.value!==current)sel.value=current});
  [40,220,700,1500].forEach(ms=>setTimeout(sync,ms));
})();