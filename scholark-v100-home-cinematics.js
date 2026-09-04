(() => {
  if(window.__SCHOLARK_V100_HOME_CINEMATICS__)return;
  window.__SCHOLARK_V100_HOME_CINEMATICS__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const isHome=()=>{const h=String(location.hash||'').toLowerCase();return (location.pathname==='/'||location.pathname==='')&&(h===''||h==='#home'||h==='#pricing')};
  let timer=null,lastMode='',lastRepair=0;

  const style=document.createElement('style');
  style.id='scholark-v100-cinematic-style';
  style.textContent=`
    #v29-home-layer .v29-device,#v29-home-layer .v29-float,#v29-home-layer .v30-live-badge i,#v29-home-layer .v30-radar,#v29-home-layer .v29-master .v29-line i,#v29-home-layer .v32-chart i,#v29-home-layer .v32-webart:after{animation-play-state:running!important}
    #v29-home-layer .v29-preview{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important}
    #v29-home-layer .v29-preview>.v32-preview-shell{display:flex!important;visibility:visible!important;opacity:1!important;min-height:100%!important;height:100%!important;position:relative!important;z-index:1!important}
    #v29-home-layer .v29-preview .v32-pane{display:flex;visibility:visible!important;opacity:1!important;flex:1 1 auto!important;min-height:0!important}
    #v29-home-layer .v29-preview .v32-deck{display:grid!important}#v29-home-layer .v29-preview .v32-web{display:flex!important}#v29-home-layer .v29-preview .v32-doc{display:grid!important}#v29-home-layer .v29-preview .v32-social{display:grid!important}#v29-home-layer .v29-preview .v32-graphic{display:grid!important}#v29-home-layer .v29-preview .v32-book{display:grid!important}
  `;
  document.head.appendChild(style);

  function mode(){return window.__SCHOLARK_V29_HOME__?.getMode?.()||$('#v29-home-layer .v29-type.active[data-mode]')?.dataset.mode||$('#v29-home-layer .v29-tab.active[data-mode]')?.dataset.mode||'presentation'}
  function previewHealthy(){
    const host=$('#v29-home-layer .v29-preview'),shell=host?.querySelector('.v32-preview-shell'),pane=shell?.querySelector('.v32-pane');
    if(!host||!shell||!pane)return false;
    const r=host.getBoundingClientRect(),sr=shell.getBoundingClientRect(),pr=pane.getBoundingClientRect();
    const cs=getComputedStyle(shell),pc=getComputedStyle(pane);
    return shell.dataset.v32Mode===mode()&&r.width>120&&r.height>120&&sr.width>80&&sr.height>80&&pr.width>60&&pr.height>45&&cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>.05&&pc.display!=='none'&&pc.visibility!=='hidden';
  }
  function resumeAnimations(){
    $$('#v29-home-layer [class*="v29"],#v29-home-layer [class*="v30"],#v29-home-layer [class*="v32"]').forEach(el=>{
      const cs=getComputedStyle(el);if(cs.animationName&&cs.animationName!=='none'&&cs.animationPlayState==='paused')el.style.setProperty('animation-play-state','running','important');
    });
  }
  function repair(force=false){
    if(!isHome())return;
    const layer=$('#v29-home-layer');if(!layer||layer.hidden)return;
    resumeAnimations();
    const current=mode(),changed=current!==lastMode;lastMode=current;
    const now=Date.now();
    if(force||changed||!previewHealthy()){
      if(now-lastRepair>120){lastRepair=now;window.__SCHOLARK_V32_PREVIEW__?.render?.();setTimeout(()=>window.__SCHOLARK_V32_PREVIEW__?.ensure?.(),40);}
    }
    if(window.__SCHOLARK_V30_DEMO__?.isRunning?.()===false)window.__SCHOLARK_V30_DEMO__?.start?.();
  }
  function start(){clearInterval(timer);repair(true);timer=setInterval(()=>repair(false),650)}
  function stop(){clearInterval(timer);timer=null}
  addEventListener('hashchange',()=>setTimeout(()=>isHome()?start():stop(),30));
  addEventListener('pageshow',()=>setTimeout(start,30));
  addEventListener('focus',()=>setTimeout(()=>repair(true),30));
  addEventListener('resize',()=>setTimeout(()=>repair(true),90),{passive:true});
  addEventListener('scholark-home-mode-change',()=>setTimeout(()=>repair(true),0));
  addEventListener('scholark-language-complete',()=>setTimeout(()=>repair(true),35));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(isHome())start()});
  const mo=new MutationObserver(()=>{if(isHome())repair(false)});
  mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});
  [0,100,400,1000,2200].forEach(ms=>setTimeout(()=>{if(isHome())repair(true)},ms));
  if(isHome())start();
  window.__SCHOLARK_HOME_CINEMATICS__={repair:()=>repair(true),healthy:previewHealthy,start,stop,release:'r131'};
})();