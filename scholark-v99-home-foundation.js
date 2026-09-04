(() => {
  if(window.__SCHOLARK_V99_HOME_FOUNDATION__)return;
  window.__SCHOLARK_V99_HOME_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const LANGS=[['nl','Dutch'],['en','English'],['es','Spanish'],['fr','French'],['de','Deutch'],['pt','Portugues'],['it','Italian']];
  const home=()=>{const h=String(location.hash||'').toLowerCase();return (location.pathname==='/'||location.pathname==='')&&(h===''||h==='#home'||h==='#pricing')};
  const route=()=>String(location.hash||'#home').toLowerCase();
  const language=()=>{const x=localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'nl';return LANGS.some(([v])=>v===x)?x:'nl'};
  let queued=false,repairTimer=null;

  const STATIC={
    'LEARNING OS':{nl:'LEER-OS',en:'LEARNING OS',es:'SISTEMA DE APRENDIZAJE',fr:'SYSTÈME D’APPRENTISSAGE',de:'LERNSYSTEM',pt:'SISTEMA DE APRENDIZAGEM',it:'SISTEMA DI APPRENDIMENTO'},
    'Landing pages':{nl:'Landingspagina’s',en:'Landing pages',es:'Páginas de destino',fr:'Pages d’atterrissage',de:'Landingpages',pt:'Páginas de destino',it:'Landing page'},
    'Portfolios':{nl:'Portfolio’s',en:'Portfolios',es:'Portafolios',fr:'Portfolios',de:'Portfolios',pt:'Portfólios',it:'Portfolio'},
    'Project pages':{nl:'Projectpagina’s',en:'Project pages',es:'Páginas de proyecto',fr:'Pages de projet',de:'Projektseiten',pt:'Páginas de projeto',it:'Pagine di progetto'},
    'Responsive layouts':{nl:'Responsieve layouts',en:'Responsive layouts',es:'Diseños responsivos',fr:'Mises en page responsives',de:'Responsive Layouts',pt:'Layouts responsivos',it:'Layout responsive'},
    'Responsive structure • real copy • design direction':{nl:'Responsieve structuur • echte copy • designrichting',en:'Responsive structure • real copy • design direction',es:'Estructura responsiva • texto real • dirección de diseño',fr:'Structure responsive • vrai contenu • direction visuelle',de:'Responsive Struktur • echter Text • Designrichtung',pt:'Estrutura responsiva • texto real • direção de design',it:'Struttura responsive • testo reale • direzione visiva'},
    'Structure':{nl:'Structuur',en:'Structure',es:'Estructura',fr:'Structure',de:'Struktur',pt:'Estrutura',it:'Struttura'},
    'AI plans the logic first.':{nl:'AI plant eerst de logica.',en:'AI plans the logic first.',es:'La IA planifica primero la lógica.',fr:'L’IA planifie d’abord la logique.',de:'Die KI plant zuerst die Logik.',pt:'A IA planeja primeiro a lógica.',it:'L’IA pianifica prima la logica.'},
    'Draft':{nl:'Eerste versie',en:'Draft',es:'Borrador',fr:'Brouillon',de:'Entwurf',pt:'Rascunho',it:'Bozza'},
    'Content and design arrive together.':{nl:'Inhoud en design komen samen.',en:'Content and design arrive together.',es:'El contenido y el diseño se crean juntos.',fr:'Le contenu et le design sont créés ensemble.',de:'Inhalt und Design entstehen zusammen.',pt:'Conteúdo e design são criados juntos.',it:'Contenuto e design vengono creati insieme.'},
    'Improve':{nl:'Verbeter',en:'Improve',es:'Mejorar',fr:'Améliorer',de:'Verbessern',pt:'Melhorar',it:'Migliora'},
    'Regenerate only what needs work.':{nl:'Genereer alleen opnieuw wat beter moet.',en:'Regenerate only what needs work.',es:'Regenera solo lo que necesita mejorar.',fr:'Régénérez uniquement ce qui doit être amélioré.',de:'Nur das neu generieren, was verbessert werden muss.',pt:'Gere novamente apenas o que precisa melhorar.',it:'Rigenera solo ciò che deve essere migliorato.'},
    'Export':{nl:'Exporteer',en:'Export',es:'Exportar',fr:'Exporter',de:'Exportieren',pt:'Exportar',it:'Esporta'},
    'Use the result outside SCHOLARK.':{nl:'Gebruik het resultaat buiten SCHOLARK.',en:'Use the result outside SCHOLARK.',es:'Usa el resultado fuera de SCHOLARK.',fr:'Utilisez le résultat en dehors de SCHOLARK.',de:'Nutze das Ergebnis außerhalb von SCHOLARK.',pt:'Use o resultado fora do SCHOLARK.',it:'Usa il risultato fuori da SCHOLARK.'},
    'Responsive structure · real copy · design direction':{nl:'Responsieve structuur · echte copy · designrichting',en:'Responsive structure · real copy · design direction',es:'Estructura responsiva · texto real · dirección de diseño',fr:'Structure responsive · vrai contenu · direction visuelle',de:'Responsive Struktur · echter Text · Designrichtung',pt:'Estrutura responsiva · texto real · direção de design',it:'Struttura responsive · testo reale · direzione visiva'}
  };
  const variantMap=new Map();
  for(const [source,translations] of Object.entries(STATIC)){
    variantMap.set(source,source);
    for(const value of Object.values(translations))variantMap.set(value,source);
  }

  const style=document.createElement('style');style.id='scholark-r121-foundation-style';style.textContent=`
    #v51-sidebar [data-v51-tool="language"] i.v121-language-icon{font-size:0!important;line-height:1!important;overflow:hidden!important;white-space:nowrap!important}
    #v51-sidebar [data-v51-tool="language"] i.v121-language-icon::before{content:'Aa';font:900 10px/1 Inter,system-ui;font-size:10px}
    body.v51-workspace:not(.v51-collapsed) #v51-sidebar{visibility:visible!important;pointer-events:auto!important}
    body.v51-workspace #v90-language{max-width:100%!important;min-width:0!important}
  `;document.head.appendChild(style);

  function activeMode(){
    return window.__SCHOLARK_V29_HOME__?.getMode?.()
      ||$('#v29-home-layer .v29-type.active[data-mode]')?.dataset.mode
      ||$('#v29-home-layer .v29-tab.active[data-mode]')?.dataset.mode
      ||'presentation';
  }

  function normalizeSelector(sel){
    if(!sel)return;
    const current=language();
    const html=LANGS.map(([v,n])=>`<option value="${v}">${n}</option>`).join('');
    if(sel.options.length!==7||!LANGS.every(([v])=>[...sel.options].some(o=>o.value===v)))sel.innerHTML=html;
    if([...sel.options].some(o=>o.value===current))sel.value=current;
    sel.removeAttribute('hidden');
    ['display','visibility','opacity','pointer-events'].forEach(p=>sel.style.removeProperty(p));
  }

  function repairSelectors(){
    window.__SCHOLARK_V55_TOPBAR__?.buildTopbar?.();
    const top=window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.()||$('#v55-language');
    normalizeSelector(top);
    normalizeSelector($('#v90-language'));
    if(home()){
      document.body.classList.add('v55-public-home');
      if(top){top.style.setProperty('display','block','important');top.style.setProperty('visibility','visible','important');top.style.setProperty('opacity','1','important');top.style.setProperty('pointer-events','auto','important')}
    }
  }

  function repairLanguageIcon(){
    const nav=$('#v51-sidebar [data-v51-tool="language"]');if(!nav)return;
    const icon=$('i',nav);if(!icon)return;
    icon.textContent='';icon.classList.add('v121-language-icon');
  }

  function applyStaticText(root){
    if(!root?.isConnected)return;
    const target=language();
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let n;while((n=walker.nextNode())){
      if(n.parentElement?.closest?.('script,style,textarea,input,[contenteditable="true"],.v65-prose,.v57-slide,.v58-canvas,.v75-doc-editor,.v76-canvas,.v77-page-preview'))continue;
      const raw=String(n.nodeValue||''),trim=raw.replace(/\s+/g,' ').trim();if(!trim)continue;
      const source=variantMap.get(trim);if(!source)continue;
      const next=STATIC[source]?.[target]||source;if(trim===next)continue;
      const lead=raw.match(/^\s*/)?.[0]||'',tail=raw.match(/\s*$/)?.[0]||'';n.nodeValue=lead+next+tail;
    }
  }

  function repairPlanNames(){
    const plans=$$('#v41-home-pricing .v41-plan');
    const names=['SCHOLARK Free','SCHOLARK Plus','SCHOLARK Pro'];
    plans.slice(0,3).forEach((plan,i)=>{const h3=$('h3',plan);if(h3&&h3.textContent.trim()!==names[i])h3.textContent=names[i]});
  }

  function visibleI18nRoots(){
    return [$('#v55-topbar'),$('#v29-home-layer'),$('#v41-home-pricing'),$('#v51-sidebar'),$('#v51-main'),$('#v41-studio-workspace:not([hidden])'),$('#v50-school.open'),$('#v25-study.open'),$('#v51-fallback')].filter(Boolean);
  }

  function repairLocalization(){
    repairSelectors();repairLanguageIcon();repairPlanNames();
    const i18n=window.__SCHOLARK_I18N__;
    for(const root of visibleI18nRoots()){i18n?.apply?.(root);applyStaticText(root)}
    repairLanguageIcon();repairPlanNames();
  }

  function clearToolSurfaces(except=''){
    const surfaces={studio:'#v41-studio-workspace',schools:'#v50-school',study:'#v25-study',book:'#v25-book'};
    for(const [name,sel] of Object.entries(surfaces)){
      if(name===except)continue;const el=$(sel);if(!el)continue;
      if(name==='studio')el.setAttribute('hidden','');else el.classList.remove('open');
    }
    $('#sv24-overlay')?.classList.remove('open');
    const native=$('.v51-native-host');if(native)native.classList.remove('v51-native-host');
  }

  function repairProject(){
    if(!route().startsWith('#project'))return;
    clearToolSurfaces('project');
    document.body.classList.add('v51-workspace');
    document.body.classList.remove('v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    try{localStorage.setItem('scholark_sidebar_closed','0')}catch{}
    const main=$('#v51-main');if(main){main.style.setProperty('display','block','important');main.style.removeProperty('visibility')}
    $$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='project'));
    const mounted=$('#v51-fallback .v64-projects');if(!mounted)window.__SCHOLARK_V64_PROJECTS__?.open?.();
    repairLocalization();
  }

  function repairStudio(){
    if(!route().startsWith('#studio'))return;
    clearToolSurfaces('studio');
    document.body.classList.add('v51-workspace','v51-studio','v41-studio-open');
    document.body.classList.remove('v51-collapsed','v51-native','v51-pro','v51-schools','v51-study','v51-book');
    const studio=$('#v41-studio-workspace');if(studio){studio.hidden=false;studio.removeAttribute('aria-hidden')}
    window.__SCHOLARK_STUDIO_WORKSPACE__?.open?.(null,{route:false});
    repairLocalization();
  }

  function prewarmStudio(){
    window.__SCHOLARK_RUNTIME__?.prewarmStudio?.();
    const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,650));
    idle(()=>window.__SCHOLARK_RUNTIME__?.prefetchStudio?.(),{timeout:1800});
    window.__SCHOLARK_STUDIO_WORKSPACE__?.prewarm?.();
  }

  function repairHome(){
    if(!home())return;
    document.body.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    window.__SCHOLARK_V55_TOPBAR__?.sync?.();repairSelectors();
    const api=window.__SCHOLARK_V29_HOME__;api?.sync?.();
    const mode=activeMode(),stageTitle=$('#v29-stage-title'),stageDesc=$('#v29-stage-desc'),stageList=$('#v29-stage-list');
    if(!stageTitle?.textContent?.trim()||!stageDesc?.textContent?.trim()||!stageList?.children?.length)api?.setMode?.(mode);
    const preview=$('#v29-home-layer .v32-preview-shell'),previewHealthy=window.__SCHOLARK_V32_PREVIEW__?.healthy?.();
    if(!preview||preview.dataset.v32Mode!==mode||previewHealthy===false)window.__SCHOLARK_V32_PREVIEW__?.render?.();
    const select=$('#v29-presenter-language');if(select&&select.options.length!==7)api?.syncPresenterLanguage?.();
    const button=$('#v29-speak');if(button&&typeof button.onclick!=='function'&&api?.speak)button.onclick=api.speak;
    if(!$('#v29-prompt')?.value?.trim())window.__SCHOLARK_V30_DEMO__?.sync?.();
    repairLocalization();
  }

  function repair(){
    queued=false;clearTimeout(repairTimer);
    repairHome();
    if(route().startsWith('#project'))repairProject();
    if(route().startsWith('#studio'))repairStudio();
    repairLocalization();
  }

  function schedule(delay=0){
    clearTimeout(repairTimer);repairTimer=setTimeout(()=>requestAnimationFrame(repair),delay);
  }

  function health(){
    const mode=activeMode(),previewMode=$('#v29-home-layer .v32-preview-shell')?.dataset.v32Mode||'',bars=$$('.v29-master .v29-line i');
    const top=$('#v55-language'),side=$('#v90-language'),projectRoute=route().startsWith('#project'),studioRoute=route().startsWith('#studio');
    const langIcon=$('#v51-sidebar [data-v51-tool="language"] i');
    const report={
      ok:true,release:'r121',home:home(),route:route(),activeMode:mode,previewMode,
      previewComplete:!home()||window.__SCHOLARK_V32_PREVIEW__?.healthy?.()===true,
      stageReady:!home()||!!$('#v29-stage-title')?.textContent?.trim()&&!!$('#v29-stage-desc')?.textContent?.trim()&&($('#v29-stage-list')?.children?.length||0)>0,
      promptReady:!home()||!!$('#v29-prompt')?.value?.trim(),
      promptMultiline:!home()||$('#v29-prompt')?.tagName==='TEXTAREA'&&($('#v29-prompt')?.getAttribute('wrap')||'').toLowerCase()==='soft',
      topbarLanguage:!home()||!!top&&top.options.length===7&&getComputedStyle(top).display!=='none',
      workspaceLanguage:home()||!side||side.options.length===7&&side.value===language(),
      languageIconClean:!langIcon||langIcon.classList.contains('v121-language-icon'),
      presenterReady:!home()||($('#v29-presenter-language')?.options?.length||0)===7&&!!$('#v29-speak'),
      masteryBars:bars.length,masteryAnimated:!home()||bars.length===3&&bars.every(b=>getComputedStyle(b).animationName!=='none'),
      projectMounted:!projectRoute||!!$('#v51-fallback .v64-projects'),
      projectSidebar:!projectRoute||!document.body.classList.contains('v51-collapsed')&&getComputedStyle($('#v51-sidebar')).visibility!=='hidden',
      studioMounted:!studioRoute||!!$('#v41-studio-workspace:not([hidden])'),
      runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[]
    };
    report.ok=report.runtimeErrors.length===0&&report.workspaceLanguage&&report.languageIconClean&&report.projectMounted&&report.projectSidebar&&report.studioMounted&&(!report.home||(report.activeMode===report.previewMode&&report.previewComplete&&report.stageReady&&report.promptReady&&report.promptMultiline&&report.topbarLanguage&&report.presenterReady&&report.masteryBars===3&&report.masteryAnimated));
    try{sessionStorage.setItem('scholark_foundation_r121',JSON.stringify(report))}catch{}
    console[report.ok?'log':'warn']('[SCHOLARK] Foundation R121 '+(report.ok?'PASS':'WARN'),report);
    if(!report.ok)schedule(80);
    return report;
  }

  document.addEventListener('click',e=>{
    const tool=e.target.closest?.('[data-v51-tool]')?.dataset?.v51Tool;
    if(tool==='project'){setTimeout(repairProject,0);setTimeout(repairProject,80);setTimeout(repairProject,240)}
    if(tool==='studio'){prewarmStudio();setTimeout(repairStudio,0);setTimeout(repairStudio,70)}
  },false);
  document.addEventListener('pointerover',e=>{if(e.target.closest?.('[data-v51-tool="studio"],.v51-card[data-v51-tool="studio"]'))prewarmStudio()},{passive:true});
  addEventListener('scholark-home-mode-change',()=>schedule(0));
  addEventListener('scholark-language-applied',()=>schedule(20));
  addEventListener('scholark-language-ready',()=>{schedule(20);setTimeout(repairLocalization,120)});
  addEventListener('scholark-runtime-ready',()=>{prewarmStudio();schedule(60);setTimeout(health,1000)});
  addEventListener('scholark-return-home',()=>{schedule(0);setTimeout(repairHome,70);setTimeout(repairSelectors,260)});
  addEventListener('hashchange',()=>{schedule(20);setTimeout(()=>{repairProject();repairStudio();repairLocalization()},120);setTimeout(health,700)});
  addEventListener('popstate',()=>schedule(30));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(50)});
  const obs=new MutationObserver(()=>schedule(90));obs.observe(document.body||document.documentElement,{childList:true,subtree:true});
  [80,300,900,1800].forEach(ms=>setTimeout(()=>schedule(0),ms));
  setTimeout(health,2600);

  window.__SCHOLARK_HOME_FOUNDATION__={repair:schedule,health,repairLocalization,repairProject,repairStudio,prewarmStudio,release:'r121'};
})();
