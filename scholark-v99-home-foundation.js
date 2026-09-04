(() => {
  if(window.__SCHOLARK_V99_HOME_FOUNDATION__)return;
  window.__SCHOLARK_V99_HOME_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const home=()=>{const h=String(location.hash||'').toLowerCase();return (location.pathname==='/'||location.pathname==='')&&(h===''||h==='#home'||h==='#pricing')};
  const route=()=>String(location.hash||'#home').toLowerCase();
  const UI_LANGUAGE_OPTIONS=[['nl','Dutch'],['en','English'],['es','Spanish'],['fr','French'],['de','Deutch'],['pt','Portugues'],['it','Italian']];
  const code=()=>{const v=localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'nl';return UI_LANGUAGE_OPTIONS.some(([x])=>x===v)?v:'nl'};
  let queued=false,repairTimer=null,cacheReloaded=false;

  const FIXED={
    'SCHOLARK WORKSPACE':{nl:'SCHOLARK WERKRUIMTE',en:'SCHOLARK WORKSPACE',es:'ESPACIO DE TRABAJO SCHOLARK',fr:'ESPACE DE TRAVAIL SCHOLARK',de:'SCHOLARK ARBEITSBEREICH',pt:'ESPAÇO DE TRABALHO SCHOLARK',it:'AREA DI LAVORO SCHOLARK'},
    'LEARNING OS':{nl:'LEER-OS',en:'LEARNING OS',es:'SISTEMA DE APRENDIZAJE',fr:'SYSTÈME D’APPRENTISSAGE',de:'LERNSYSTEM',pt:'SISTEMA DE APRENDIZAGEM',it:'SISTEMA DI APPRENDIMENTO'},
    'Landing pages':{nl:'Landingspagina’s',en:'Landing pages',es:'Páginas de destino',fr:'Pages d’atterrissage',de:'Landingpages',pt:'Páginas de destino',it:'Landing page'},
    'Portfolios':{nl:'Portfolio’s',en:'Portfolios',es:'Portafolios',fr:'Portfolios',de:'Portfolios',pt:'Portfólios',it:'Portfolio'},
    'Project pages':{nl:'Projectpagina’s',en:'Project pages',es:'Páginas de proyecto',fr:'Pages de projet',de:'Projektseiten',pt:'Páginas de projeto',it:'Pagine di progetto'},
    'Responsive layouts':{nl:'Responsieve layouts',en:'Responsive layouts',es:'Diseños responsivos',fr:'Mises en page responsives',de:'Responsive Layouts',pt:'Layouts responsivos',it:'Layout responsive'},
    'Responsive structure • real copy • design direction':{nl:'Responsieve structuur • echte copy • designrichting',en:'Responsive structure • real copy • design direction',es:'Estructura responsiva • texto real • dirección de diseño',fr:'Structure responsive • vrai contenu • direction visuelle',de:'Responsive Struktur • echter Text • Designrichtung',pt:'Estrutura responsiva • texto real • direção de design',it:'Struttura responsive • testo reale • direzione visiva'},
    'Responsive structure · real copy · design direction':{nl:'Responsieve structuur · echte copy · designrichting',en:'Responsive structure · real copy · design direction',es:'Estructura responsiva · texto real · dirección de diseño',fr:'Structure responsive · vrai contenu · direction visuelle',de:'Responsive Struktur · echter Text · Designrichtung',pt:'Estrutura responsiva · texto real · direção de design',it:'Struttura responsive · testo reale · direzione visiva'},
    'Structure':{nl:'Structuur',en:'Structure',es:'Estructura',fr:'Structure',de:'Struktur',pt:'Estrutura',it:'Struttura'},
    'AI plans the logic first.':{nl:'AI plant eerst de logica.',en:'AI plans the logic first.',es:'La IA planifica primero la lógica.',fr:'L’IA planifie d’abord la logique.',de:'Die KI plant zuerst die Logik.',pt:'A IA planeja primeiro a lógica.',it:'L’IA pianifica prima la logica.'},
    'Draft':{nl:'Eerste versie',en:'Draft',es:'Borrador',fr:'Brouillon',de:'Entwurf',pt:'Rascunho',it:'Bozza'},
    'Content and design arrive together.':{nl:'Inhoud en design komen samen.',en:'Content and design arrive together.',es:'El contenido y el diseño se crean juntos.',fr:'Le contenu et le design sont créés ensemble.',de:'Inhalt und Design entstehen zusammen.',pt:'Conteúdo e design são criados juntos.',it:'Contenuto e design vengono creati insieme.'},
    'Improve':{nl:'Verbeter',en:'Improve',es:'Mejorar',fr:'Améliorer',de:'Verbessern',pt:'Melhorar',it:'Migliora'},
    'Regenerate only what needs work.':{nl:'Genereer alleen opnieuw wat beter moet.',en:'Regenerate only what needs work.',es:'Regenera solo lo que necesita mejorar.',fr:'Régénérez uniquement ce qui doit être amélioré.',de:'Nur das neu generieren, was verbessert werden muss.',pt:'Gere novamente apenas o que precisa melhorar.',it:'Rigenera solo ciò che deve essere migliorato.'},
    'Export':{nl:'Exporteer',en:'Export',es:'Exportar',fr:'Exporter',de:'Exportieren',pt:'Exportar',it:'Esporta'},
    'Use the result outside SCHOLARK.':{nl:'Gebruik het resultaat buiten SCHOLARK.',en:'Use the result outside SCHOLARK.',es:'Usa el resultado fuera de SCHOLARK.',fr:'Utilisez le résultat en dehors de SCHOLARK.',de:'Nutze das Ergebnis außerhalb von SCHOLARK.',pt:'Use o resultado fora do SCHOLARK.',it:'Usa il risultato fuori da SCHOLARK.'}
  };
  const variants=new Map();
  Object.entries(FIXED).forEach(([source,rows])=>{variants.set(source,source);Object.values(rows).forEach(v=>variants.set(v,source))});

  const style=document.createElement('style');style.id='scholark-v129-foundation-style';style.textContent=`
    #v51-sidebar [data-v51-tool="language"] i.v129-aa{font-size:0!important;line-height:1!important;overflow:hidden!important;white-space:nowrap!important}
    #v51-sidebar [data-v51-tool="language"] i.v129-aa::before{content:'Aa';font:900 10px/1 Inter,system-ui;font-size:10px}
    body.v51-workspace:not(.v51-collapsed) #v51-sidebar{visibility:visible!important;opacity:1!important;pointer-events:auto!important}
    body.v55-public-home #v55-language{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}
  `;document.head.appendChild(style);

  const languageSelectorExact=sel=>{
    if(!sel)return false;
    const rows=[...sel.options].map(o=>[String(o.value||''),String(o.textContent||'').trim()]);
    return rows.length===UI_LANGUAGE_OPTIONS.length&&UI_LANGUAGE_OPTIONS.every(([v,n],i)=>rows[i]?.[0]===v&&rows[i]?.[1]===n);
  };
  function normalizeSelector(sel){
    if(!sel)return null;
    if(!languageSelectorExact(sel))sel.innerHTML=UI_LANGUAGE_OPTIONS.map(([v,n])=>`<option value="${v}">${n}</option>`).join('');
    const current=code();if([...sel.options].some(o=>o.value===current))sel.value=current;
    sel.removeAttribute('hidden');['display','visibility','opacity','pointer-events'].forEach(p=>sel.style.removeProperty(p));
    return sel;
  }
  function patchTranslationCaches(){
    for(const [lc] of UI_LANGUAGE_OPTIONS){
      if(lc==='en')continue;
      const key='scholark_v90_i18n_v3-seven-ui_'+lc;let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
      for(const [source,rows] of Object.entries(FIXED))saved[source]=rows[lc]||source;
      saved['SCHOLARK Free']='SCHOLARK Free';saved['SCHOLARK Plus']='SCHOLARK Plus';saved['SCHOLARK Pro']='SCHOLARK Pro';
      try{localStorage.setItem(key,JSON.stringify(saved))}catch{}
    }
  }
  patchTranslationCaches();

  function activeMode(){
    return window.__SCHOLARK_V29_HOME__?.getMode?.()
      ||$('#v29-home-layer .v29-type.active[data-mode]')?.dataset.mode
      ||$('#v29-home-layer .v29-tab.active[data-mode]')?.dataset.mode
      ||'presentation';
  }
  function repairLanguageIcon(){
    const icon=$('#v51-sidebar [data-v51-tool="language"] i');if(!icon)return;
    if(icon.textContent!=='')icon.textContent='';icon.classList.add('v129-aa');
  }
  function replaceKnown(root){
    if(!root?.isConnected)return;
    const target=code(),walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
    while((n=walker.nextNode())){
      if(n.parentElement?.closest?.('script,style,textarea,input,[contenteditable="true"],.v65-prose,.v57-slide,.v58-canvas,.v75-doc-editor,.v76-canvas,.v77-page-preview'))continue;
      const raw=String(n.nodeValue||''),clean=raw.replace(/\s+/g,' ').trim(),source=variants.get(clean);if(!source)continue;
      const next=FIXED[source]?.[target]||source;if(clean===next)continue;
      const lead=raw.match(/^\s*/)?.[0]||'',tail=raw.match(/\s*$/)?.[0]||'';n.nodeValue=lead+next+tail;
    }
  }
  function repairPlanNames(){
    const plans=$$('#v41-home-pricing .v41-plan');['SCHOLARK Free','SCHOLARK Plus','SCHOLARK Pro'].forEach((name,i)=>{const h3=plans[i]?.querySelector('h3');if(h3&&h3.textContent.trim()!==name)h3.textContent=name});
  }
  function visibleRoots(){return [$('#v55-topbar'),$('#v29-home-layer'),$('#v41-home-pricing'),$('#v51-sidebar'),$('#v51-main'),$('#v41-studio-workspace:not([hidden])'),$('#v50-school.open'),$('#v25-study.open'),$('#v51-fallback .v64-projects'),$('#v51-fallback .v65-book')].filter(Boolean)}
  function repairLocalization(){
    window.__SCHOLARK_V55_TOPBAR__?.buildTopbar?.();normalizeSelector(window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.()||$('#v55-language'));normalizeSelector($('#v90-language'));
    const i18n=window.__SCHOLARK_I18N__;visibleRoots().forEach(root=>{i18n?.apply?.(root);replaceKnown(root)});
    repairLanguageIcon();repairPlanNames();
  }
  function reloadPatchedLanguageMap(){
    if(cacheReloaded)return;cacheReloaded=true;const current=code();if(current==='en')return;
    setTimeout(()=>window.__SCHOLARK_I18N__?.changeLanguage?.(current),20);
  }

  function repairHome(){
    if(!home())return;
    document.body.classList.remove('v51-workspace','v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    document.body.classList.add('v55-public-home');
    window.__SCHOLARK_V55_TOPBAR__?.sync?.();normalizeSelector(window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.()||$('#v55-language'));
    const api=window.__SCHOLARK_V29_HOME__;api?.sync?.();const mode=activeMode();
    const stageTitle=$('#v29-stage-title'),stageDesc=$('#v29-stage-desc'),stageList=$('#v29-stage-list');if(!stageTitle?.textContent?.trim()||!stageDesc?.textContent?.trim()||!stageList?.children?.length)api?.setMode?.(mode);
    const preview=$('#v29-home-layer .v32-preview-shell'),previewHealthy=window.__SCHOLARK_V32_PREVIEW__?.healthy?.();if(!preview||preview.dataset.v32Mode!==mode||previewHealthy===false)window.__SCHOLARK_V32_PREVIEW__?.render?.();
    if(!$('.v30-school-live')||!$('.v30-ahead-live'))window.__SCHOLARK_V30_DEMO__?.sync?.();
    if(!$('#v29-prompt')?.value?.trim())window.__SCHOLARK_V30_DEMO__?.sync?.();
    if(window.__SCHOLARK_V30_DEMO__?.isRunning?.()===false)window.__SCHOLARK_V30_DEMO__?.start?.();
    repairLocalization();
  }
  function repairProject(){
    if(route()!=='#project')return;
    window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);document.body.classList.remove('v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');document.body.classList.add('v51-workspace');
    $('#v41-studio-workspace')?.setAttribute('hidden','');$('#sv24-overlay')?.classList.remove('open');$('#v50-school')?.classList.remove('open');$('#v25-study')?.classList.remove('open');$('#v25-book')?.classList.remove('open');$('#v58-suite')?.classList.remove('open');$('#v57-deck')?.classList.remove('open');$('#v57-present')?.classList.remove('open');
    const native=$('.v51-native-host');native?.classList.remove('v51-native-host');const main=$('#v51-main');if(main)main.style.setProperty('display','block','important');
    $$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='project'));
    if(!$('#v51-fallback .v64-projects'))window.__SCHOLARK_V64_PROJECTS__?.open?.();repairLocalization();
  }
  function repairStudio(){
    if(route()!=='#studio')return;
    window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);document.body.classList.remove('v51-collapsed');
    const studio=$('#v41-studio-workspace');if(studio?.hidden)window.__SCHOLARK_STUDIO_WORKSPACE__?.open?.(null,{route:false,fast:true});repairLocalization();
  }
  function prewarmStudio(){
    window.__SCHOLARK_RUNTIME__?.prewarmStudio?.();window.__SCHOLARK_STUDIO_WORKSPACE__?.prewarm?.();
    const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,400));idle(()=>window.__SCHOLARK_RUNTIME__?.prefetchStudio?.(),{timeout:1000});
  }
  function repair(){queued=false;clearTimeout(repairTimer);repairHome();repairProject();repairStudio();repairLocalization()}
  function schedule(delay=0){clearTimeout(repairTimer);repairTimer=setTimeout(()=>requestAnimationFrame(repair),delay)}

  function health(){
    const mode=activeMode(),previewMode=$('#v29-home-layer .v32-preview-shell')?.dataset.v32Mode||'',bars=$$('.v29-master .v29-line i'),projectRoute=route()==='#project',studioRoute=route()==='#studio',sidebar=$('#v51-sidebar');
    const report={
      ok:true,release:'r129',home:home(),route:route(),activeMode:mode,previewMode,
      previewComplete:!home()||window.__SCHOLARK_V32_PREVIEW__?.healthy?.()===true,
      stageReady:!home()||!!$('#v29-stage-title')?.textContent?.trim()&&!!$('#v29-stage-desc')?.textContent?.trim()&&($('#v29-stage-list')?.children?.length||0)>0,
      promptReady:!home()||!!$('#v29-prompt')?.value?.trim(),promptMultiline:!home()||$('#v29-prompt')?.tagName==='TEXTAREA'&&($('#v29-prompt')?.getAttribute('wrap')||'').toLowerCase()==='soft',
      topbarLanguage:!home()||languageSelectorExact($('#v55-language'))&&getComputedStyle($('#v55-language')).display!=='none',workspaceLanguage:home()||!$('#v90-language')||languageSelectorExact($('#v90-language'))&&$('#v90-language').value===code(),
      languageIconClean:!$('#v51-sidebar [data-v51-tool="language"] i')||$('#v51-sidebar [data-v51-tool="language"] i').classList.contains('v129-aa'),
      presentersRemoved:!$('#v29-presenter-language')&&!$('#v29-speak')&&!$('.v29-hosts'),futureSchoolLive:!home()||!!$('.v30-school-live .v30-radar')&&$('.v30-school-live .v30-pin')!==null,futureStudyLive:!home()||!!$('.v30-ahead-live .v30-ahead-line i')&&$('.v30-ahead-dots span').length===4,
      masteryBars:bars.length,masteryAnimated:!home()||bars.length===3&&bars.every(b=>getComputedStyle(b).animationName!=='none'),languageSwitchSettled:!document.documentElement.classList.contains('scholark-language-switching'),cinematicRunning:!home()||window.__SCHOLARK_V30_DEMO__?.isRunning?.()===true,
      projectMounted:!projectRoute||!!$('#v51-fallback .v64-projects'),projectSidebar:!projectRoute||!!sidebar&&!document.body.classList.contains('v51-collapsed')&&getComputedStyle(sidebar).visibility!=='hidden',studioMounted:!studioRoute||!!$('#v41-studio-workspace:not([hidden])'),runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[]
    };
    report.ok=report.runtimeErrors.length===0&&report.workspaceLanguage&&report.languageIconClean&&report.projectMounted&&report.projectSidebar&&report.studioMounted&&(!report.home||(report.activeMode===report.previewMode&&report.previewComplete&&report.stageReady&&report.promptReady&&report.promptMultiline&&report.topbarLanguage&&report.presentersRemoved&&report.futureSchoolLive&&report.futureStudyLive&&report.masteryBars===3&&report.masteryAnimated&&report.languageSwitchSettled&&report.cinematicRunning));
    try{sessionStorage.setItem('scholark_foundation_r129',JSON.stringify(report))}catch{}
    console[report.ok?'log':'warn']('[SCHOLARK] Foundation R129 '+(report.ok?'PASS':'WARN'),report);if(!report.ok)schedule(60);return report;
  }

  document.addEventListener('click',e=>{const tool=e.target.closest?.('[data-v51-tool]')?.dataset?.v51Tool;if(tool==='project'){setTimeout(repairProject,0);setTimeout(repairProject,70);setTimeout(repairProject,200)}if(tool==='studio'){prewarmStudio();setTimeout(repairStudio,0);setTimeout(repairStudio,60)}},false);
  document.addEventListener('pointerover',e=>{if(e.target.closest?.('[data-v51-tool="studio"],.v51-card[data-v51-tool="studio"]'))prewarmStudio()},{passive:true});
  addEventListener('scholark-home-mode-change',()=>schedule(0));addEventListener('scholark-language-applied',()=>schedule(10));addEventListener('scholark-language-ready',()=>{schedule(20);setTimeout(repairLocalization,100)});addEventListener('scholark-language-complete',()=>{schedule(10);setTimeout(repairLocalization,80)});
  addEventListener('scholark-runtime-ready',()=>{reloadPatchedLanguageMap();prewarmStudio();schedule(60);setTimeout(health,900)});addEventListener('scholark-return-home',()=>{schedule(0);setTimeout(repairHome,60);setTimeout(repairLocalization,220)});addEventListener('hashchange',()=>{schedule(25);setTimeout(()=>{repairProject();repairStudio();repairLocalization()},110);setTimeout(health,650)});addEventListener('popstate',()=>schedule(30));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(50)});const obs=new MutationObserver(()=>schedule(90));obs.observe(document.body||document.documentElement,{childList:true,subtree:true});[80,300,900,1700].forEach(ms=>setTimeout(()=>schedule(0),ms));setTimeout(health,2400);

  window.__SCHOLARK_HOME_FOUNDATION__={repair:schedule,health,repairLocalization,repairProject,repairStudio,prewarmStudio,release:'r129'};
})();
