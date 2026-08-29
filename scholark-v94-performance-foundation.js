(() => {
  if(window.__SCHOLARK_V94_PERFORMANCE__)return;
  window.__SCHOLARK_V94_PERFORMANCE__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const state={routeChanges:0,longTasks:0,lastRoute:String(location.hash||'#home'),lastLayout:0,safeMode:false};

  const css=document.createElement('style');css.id='scholark-v94-style';css.textContent=`
    html{scroll-behavior:smooth}body{overflow-x:hidden}
    #v29-home-layer section,#v41-home-pricing{content-visibility:auto;contain-intrinsic-size:1px 700px}
    #v29-home-layer button,#v51-main button,#v51-sidebar button,#v55-topbar button{white-space:normal;overflow-wrap:anywhere}
    .v29-hero-grid>*,.v29-stage>*,.v29-bento>*,.v29-future-grid>*,.v29-future-cards>*,.v51-grid>*,.v51-levels>*,.v91-quick>*,.v41-price-grid>*{min-width:0}
    .v51-nav{min-height:42px;align-items:center}.v51-nav span{min-width:0;line-height:1.3;overflow-wrap:anywhere}.v51-nav em{flex:0 0 auto}
    .v94-route-fade #v51-main,.v94-route-fade #v29-home-layer,.v94-route-fade #v41-studio-workspace{opacity:.985;transition:opacity .12s ease}
    .v94-compact-text{font-size:.92em!important;letter-spacing:-.01em!important}
    @media(max-width:760px){#v29-home-layer section,#v41-home-pricing{contain-intrinsic-size:1px 520px}.v51-nav{min-height:46px}}
    html.scholark-performance-safe .v29-glow,html.scholark-performance-safe .v29-device,html.scholark-performance-safe .v29-float,html.scholark-performance-safe .v41-most{animation:none!important}
    html.scholark-performance-safe #v55-topbar,html.scholark-performance-safe .v29-future-card{backdrop-filter:none!important}
    html.scholark-performance-safe{scroll-behavior:auto}
    html.scholark-language-switching *{animation-play-state:paused!important;transition:none!important}
    html.scholark-language-switching{scroll-behavior:auto!important}
    @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.v29-glow,.v29-device,.v29-float,.v41-most{animation:none!important}.v94-route-fade #v51-main,.v94-route-fade #v29-home-layer{transition:none!important}}
  `;document.head.appendChild(css);

  function preconnect(href){
    if($('link[data-v94="'+href+'"]'))return;const l=document.createElement('link');l.rel='preconnect';l.href=href;l.crossOrigin='anonymous';l.dataset.v94=href;document.head.appendChild(l);
  }
  preconnect('https://yhafbwdnnpvuedycdkll.supabase.co');

  const activeRoot=()=>document.querySelector('#v58-suite.open,#v57-deck.open,.v41-studio-workspace:not([hidden]),#v51-main,#v29-home-layer:not([hidden])')||document.body;
  function tuneImages(root=activeRoot()){
    $('img',root).forEach(img=>{if(!img.decoding)img.decoding='async';if(!img.loading)img.loading='lazy'});
  }
  function fitText(root=activeRoot()){
    state.lastLayout=Date.now();
    const candidates=$('.v51-nav,.v51-level,.v91-quick button,.v29-tab,.v29-future-card button,.v55-entry strong,.v41-plan button',root);
    for(const el of candidates){
      el.classList.remove('v94-compact-text');
      const r=el.getBoundingClientRect();
      if(r.width>0&&(el.scrollWidth>r.width+3||el.scrollHeight>Math.max(r.height+4,90)))el.classList.add('v94-compact-text');
    }
  }
  function routeTransition(){
    state.routeChanges++;state.lastRoute=String(location.hash||'#home');document.documentElement.classList.add('v94-route-fade');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{fitText();tuneImages();setTimeout(()=>document.documentElement.classList.remove('v94-route-fade'),120)}));
  }
  let raf=0;function scheduleLayout(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{fitText();tuneImages()})}

  addEventListener('hashchange',routeTransition);addEventListener('popstate',routeTransition);addEventListener('resize',scheduleLayout,{passive:true});

  const lowPower=(Number(navigator.hardwareConcurrency)||8)<=4||(Number(navigator.deviceMemory)||8)<=4;
  if(lowPower){state.safeMode=true;document.documentElement.classList.add('scholark-performance-safe')}

  if('PerformanceObserver'in window){
    try{
      const recent=[];
      const po=new PerformanceObserver(list=>{
        const now=performance.now();
        for(const e of list.getEntries())if(e.duration>100){state.longTasks++;recent.push(now)}
        while(recent.length&&now-recent[0]>12000)recent.shift();
        if(recent.length>=3&&!state.safeMode){
          state.safeMode=true;document.documentElement.classList.add('scholark-performance-safe');
          window.__SCHOLARK_V30_DEMO__?.stop?.();
          console.warn('[SCHOLARK] Performance safe mode enabled after repeated long tasks.');
        }
      });
      po.observe({type:'longtask',buffered:true});
    }catch{}
  }

  const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,600));
  idle(()=>{tuneImages();fitText()});
  setTimeout(routeTransition,350);

  window.__SCHOLARK_PERF__={state,fitText,routeTransition};
})();