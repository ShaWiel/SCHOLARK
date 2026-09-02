(() => {
  if(window.__SCHOLARK_V99_HOME_FOUNDATION__)return;
  window.__SCHOLARK_V99_HOME_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const home=()=>{const h=String(location.hash||'').toLowerCase();return (location.pathname==='/'||location.pathname==='')&&(h===''||h==='#home'||h==='#pricing')};
  let queued=false;
  const UI_LANGUAGE_OPTIONS=[['nl','Dutch'],['en','English'],['es','Spanish'],['fr','French'],['de','Deutch'],['pt','Portugues'],['it','Italian']];
  const languageSelectorExact=sel=>{
    if(!sel)return false;
    const rows=[...sel.options].map(o=>[String(o.value||''),String(o.textContent||'').trim()]);
    return rows.length===UI_LANGUAGE_OPTIONS.length&&UI_LANGUAGE_OPTIONS.every(([v,n],i)=>rows[i]?.[0]===v&&rows[i]?.[1]===n);
  };

  function activeMode(){
    return window.__SCHOLARK_V29_HOME__?.getMode?.()
      ||$('#v29-home-layer .v29-type.active[data-mode]')?.dataset.mode
      ||$('#v29-home-layer .v29-tab.active[data-mode]')?.dataset.mode
      ||'presentation';
  }

  function repair(){
    queued=false;if(!home())return;
    window.__SCHOLARK_V55_TOPBAR__?.sync?.();
    window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.();
    const api=window.__SCHOLARK_V29_HOME__;
    api?.sync?.();
    const mode=activeMode();
    const stageTitle=$('#v29-stage-title'),stageDesc=$('#v29-stage-desc'),stageList=$('#v29-stage-list');
    if(!stageTitle?.textContent?.trim()||!stageDesc?.textContent?.trim()||!stageList?.children?.length)api?.setMode?.(mode);
    const preview=$('#v29-home-layer .v32-preview-shell');
    if(!preview||preview.dataset.v32Mode!==mode)window.__SCHOLARK_V32_PREVIEW__?.sync?.();
    const topLang=$('#v55-language');
    if(!topLang||topLang.options.length!==7)window.__SCHOLARK_V55_TOPBAR__?.ensureLanguageSelector?.();
    if(!$('.v30-school-live')||!$('.v30-ahead-live'))window.__SCHOLARK_V30_DEMO__?.sync?.();
    if(!$('#v29-prompt')?.value?.trim())window.__SCHOLARK_V30_DEMO__?.sync?.();
    if(window.__SCHOLARK_V30_DEMO__?.isRunning?.()===false)window.__SCHOLARK_V30_DEMO__?.start?.();
  }

  function schedule(delay=0){
    if(queued)return;queued=true;
    setTimeout(()=>requestAnimationFrame(repair),delay);
  }

  function health(){
    const mode=activeMode(),previewMode=$('#v29-home-layer .v32-preview-shell')?.dataset.v32Mode||'';
    const bars=$$('.v29-master .v29-line i');
    const report={
      ok:true,
      release:'r126',
      home:home(),
      activeMode:mode,
      previewMode,
      stageReady:!home()||!!$('#v29-stage-title')?.textContent?.trim()&&!!$('#v29-stage-desc')?.textContent?.trim()&&($('#v29-stage-list')?.children?.length||0)>0,
      promptReady:!home()||!!$('#v29-prompt')?.value?.trim(),
      promptMultiline:!home()||$('#v29-prompt')?.tagName==='TEXTAREA'&&($('#v29-prompt')?.getAttribute('wrap')||'').toLowerCase()==='soft',
      topbarLanguage:!home()||languageSelectorExact($('#v55-language'))&&getComputedStyle($('#v55-language')).display!=='none',
      presentersRemoved:!$('#v29-presenter-language')&&!$('#v29-speak')&&!$('.v29-hosts'),
      futureSchoolLive:!home()||!!$('.v30-school-live .v30-radar')&&$('.v30-school-live .v30-pin')!==null,
      futureStudyLive:!home()||!!$('.v30-ahead-live .v30-ahead-line i')&&$('.v30-ahead-dots span').length===4,
      masteryBars:bars.length,
      masteryAnimated:!home()||bars.length===3&&bars.every(b=>getComputedStyle(b).animationName!=='none'),
      languageSwitchSettled:!document.documentElement.classList.contains('scholark-language-switching'),
      cinematicRunning:!home()||window.__SCHOLARK_V30_DEMO__?.isRunning?.()===true,
      runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[]
    };
    report.ok=!report.home||(report.activeMode===report.previewMode&&report.stageReady&&report.promptReady&&report.promptMultiline&&report.topbarLanguage&&report.presentersRemoved&&report.futureSchoolLive&&report.futureStudyLive&&report.masteryBars===3&&report.masteryAnimated&&report.languageSwitchSettled&&report.cinematicRunning&&report.runtimeErrors.length===0);
    try{sessionStorage.setItem('scholark_home_foundation_r126',JSON.stringify(report))}catch{}
    console[report.ok?'log':'warn']('[SCHOLARK] Home foundation R126 '+(report.ok?'PASS':'WARN'),report);
    if(!report.ok)schedule(30);
    return report;
  }

  addEventListener('scholark-home-mode-change',()=>schedule(0));
  addEventListener('scholark-language-ready',()=>{schedule(40);setTimeout(health,260)});
  addEventListener('scholark-language-complete',()=>{schedule(20);setTimeout(health,140)});
  addEventListener('scholark-runtime-ready',()=>{schedule(80);setTimeout(health,900)});
  addEventListener('hashchange',()=>{schedule(60);setTimeout(health,650)});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(60)});
  [100,500,1600].forEach(ms=>setTimeout(()=>schedule(0),ms));
  setTimeout(health,2400);

  window.__SCHOLARK_HOME_FOUNDATION__={repair:schedule,health,release:'r126'};
})();
