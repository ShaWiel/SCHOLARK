(() => {
  if(window.__SCHOLARK_V99_HOME_FOUNDATION__)return;
  window.__SCHOLARK_V99_HOME_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const home=()=>{const h=String(location.hash||'').toLowerCase();return (location.pathname==='/'||location.pathname==='')&&(h===''||h==='#home'||h==='#pricing')};
  let queued=false;

  function activeMode(){
    return window.__SCHOLARK_V29_HOME__?.getMode?.()
      ||$('#v29-home-layer .v29-type.active[data-mode]')?.dataset.mode
      ||$('#v29-home-layer .v29-tab.active[data-mode]')?.dataset.mode
      ||'presentation';
  }

  function repair(){
    queued=false;if(!home())return;
    const api=window.__SCHOLARK_V29_HOME__;
    api?.sync?.();
    const mode=activeMode();
    const stageTitle=$('#v29-stage-title'),stageDesc=$('#v29-stage-desc'),stageList=$('#v29-stage-list');
    if(!stageTitle?.textContent?.trim()||!stageDesc?.textContent?.trim()||!stageList?.children?.length)api?.setMode?.(mode);
    const preview=$('#v29-home-layer .v32-preview-shell');
    if(!preview||preview.dataset.v32Mode!==mode)window.__SCHOLARK_V32_PREVIEW__?.sync?.();
    const select=$('#v29-presenter-language');
    if(select&&select.options.length!==7)api?.syncPresenterLanguage?.();
    const button=$('#v29-speak');
    if(button&&typeof button.onclick!=='function'&&api?.speak)button.onclick=api.speak;
    if(!$('#v29-prompt')?.value?.trim())window.__SCHOLARK_V30_DEMO__?.sync?.();
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
      release:'r115',
      home:home(),
      activeMode:mode,
      previewMode,
      stageReady:!home()||!!$('#v29-stage-title')?.textContent?.trim()&&!!$('#v29-stage-desc')?.textContent?.trim()&&($('#v29-stage-list')?.children?.length||0)>0,
      promptReady:!home()||!!$('#v29-prompt')?.value?.trim(),
      presenterLanguages:$('#v29-presenter-language')?.options?.length||0,
      presenterReady:!home()||($('#v29-presenter-language')?.options?.length||0)===7&&!!$('#v29-speak'),
      masteryBars:bars.length,
      masteryAnimated:!home()||bars.length===3&&bars.every(b=>getComputedStyle(b).animationName!=='none'),
      runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[]
    };
    report.ok=!report.home||(report.activeMode===report.previewMode&&report.stageReady&&report.promptReady&&report.presenterReady&&report.masteryBars===3&&report.runtimeErrors.length===0);
    try{sessionStorage.setItem('scholark_home_foundation_r115',JSON.stringify(report))}catch{}
    console[report.ok?'log':'warn']('[SCHOLARK] Home foundation R115 '+(report.ok?'PASS':'WARN'),report);
    if(!report.ok)schedule(30);
    return report;
  }

  addEventListener('scholark-home-mode-change',()=>schedule(0));
  addEventListener('scholark-language-ready',()=>schedule(50));
  addEventListener('scholark-runtime-ready',()=>{schedule(80);setTimeout(health,900)});
  addEventListener('hashchange',()=>{schedule(60);setTimeout(health,650)});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(60)});
  [100,500,1600].forEach(ms=>setTimeout(()=>schedule(0),ms));
  setTimeout(health,2400);

  window.__SCHOLARK_HOME_FOUNDATION__={repair:schedule,health,release:'r115'};
})();
