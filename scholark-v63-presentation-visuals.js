(() => {
  if(window.__SCHOLARK_V63_PRESENTATION_VISUALS__)return;
  window.__SCHOLARK_V63_PRESENTATION_VISUALS__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const css=document.createElement('style');css.id='scholark-v63-style';css.textContent=`
    #v57-deck.v60-ai-deck .v57-orb,#v57-present .v57-orb{display:none!important}
    .v57-slide.v63-long-title .v57-title{font-size:clamp(24px,4.25vw,58px)!important;line-height:.98!important}
    .v57-slide.v63-xlong-title .v57-title{font-size:clamp(22px,3.7vw,50px)!important;line-height:1!important}
    .v63-hero-visual{position:absolute!important;right:5.8%;top:13%;bottom:13%;width:29%;display:grid!important;align-content:center;gap:9px;z-index:2!important}
    .v63-hero-chip{border:1px solid color-mix(in srgb,var(--sink) 13%,transparent);background:color-mix(in srgb,var(--spanel) 86%,transparent);border-radius:14px;padding:12px 14px;font:850 clamp(7px,.9vw,11px)/1.25 Inter;color:var(--sink);backdrop-filter:blur(8px)}
    .v63-hero-chip:nth-child(2){transform:translateX(-9%)}.v63-hero-chip:nth-child(3){transform:translateX(5%)}
    .v57-slide:has(.v63-hero-visual)>.v57-title,.v57-slide:has(.v63-hero-visual)>.v57-sub{max-width:58%!important}
    .v63-native{height:100%;display:grid;align-content:center;gap:10px;position:relative}
    .v63-bars{display:grid;gap:10px}.v63-bar{display:grid;grid-template-columns:minmax(70px,.7fr) 1fr;gap:10px;align-items:center}.v63-bar b{font:850 clamp(7px,.9vw,11px)/1.2 Inter!important;letter-spacing:0!important}.v63-track{height:9px;background:color-mix(in srgb,var(--sink) 10%,transparent);border-radius:999px;overflow:hidden}.v63-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--saccent),var(--saccent2))}
    .v63-process{display:grid;gap:8px}.v63-step{display:grid;grid-template-columns:30px 1fr;gap:9px;align-items:center}.v63-num{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--saccent);color:#13161d;font:950 8px Inter}.v63-step b{font:900 clamp(8px,1vw,12px)/1.15 Inter!important;letter-spacing:0!important}.v63-step span{font:650 clamp(6px,.8vw,9px)/1.25 Inter!important;margin:2px 0 0!important}
    .v63-signal{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v63-signal-card{padding:11px;border-radius:12px;background:color-mix(in srgb,var(--sink) 5%,var(--spanel));border:1px solid color-mix(in srgb,var(--sink) 9%,transparent)}.v63-signal-card small{display:block;color:var(--saccent);font:900 7px Inter;margin-bottom:5px}.v63-signal-card b{display:block;font:900 clamp(8px,1vw,12px)/1.1 Inter!important;letter-spacing:0!important}.v63-signal-card span{display:block;font:650 clamp(6px,.75vw,9px)/1.3 Inter!important;margin-top:5px!important;color:var(--smuted)!important}
    @media(max-width:760px){.v63-hero-visual{display:none!important}.v57-slide:has(.v63-hero-visual)>.v57-title,.v57-slide:has(.v63-hero-visual)>.v57-sub{max-width:92%!important}}
  `;document.head.appendChild(css);

  function words(slide){
    const raw=[slide?.visualBrief,slide?.title,slide?.subtitle].filter(Boolean).join(' ');
    const stop=new Set(['with','from','that','this','your','into','about','over','under','voor','met','van','het','een','the','and','for','are','was','were','have','will','should']);
    const out=[];for(const w of raw.match(/[\p{L}\p{N}][\p{L}\p{N}-]{3,}/gu)||[]){const k=w.toLowerCase();if(stop.has(k)||out.some(x=>x.toLowerCase()===k))continue;out.push(w);if(out.length===3)break}return out;
  }
  function slideFor(canvas){
    const deck=window.__SCHOLARK_V57_PRESENTATIONS__?.getDeck?.();if(!deck?.slides?.length)return null;
    const title=clean($('.v57-title,.v57-quote',canvas)?.textContent);if(title){const m=deck.slides.find(s=>clean(s.title)===title);if(m)return m}
    const i=Number($('.v57-thumb.active')?.dataset.i);return deck.slides[Number.isFinite(i)?i:0]||deck.slides[0];
  }
  function pct(v,i,total){const m=String(v||'').match(/-?\d+(?:\.\d+)?/);if(m){const n=Math.abs(Number(m[0]));return Math.max(18,Math.min(100,n>100?100:n))}return Math.max(28,92-i*(50/Math.max(1,total-1)));}
  function visualMarkup(slide){
    const it=(slide.items||[]).slice(0,4),type=clean(slide.visualType).toLowerCase();
    const numeric=it.filter(x=>/-?\d+(?:\.\d+)?/.test(String(x?.[0]||''))).length>=2;
    if(numeric||/bar|chart|data|stat/.test(type))return '<div class="v63-native v63-bars">'+it.slice(0,3).map((x,i)=>'<div class="v63-bar"><b>'+esc(x?.[1]||x?.[0]||('Point '+(i+1)))+'</b><div class="v63-track"><div class="v63-fill" style="width:'+pct(x?.[0],i,it.length)+'%"></div></div></div>').join('')+'</div>';
    if(/timeline|process|flow|journey|steps|roadmap/.test(type))return '<div class="v63-native v63-process">'+it.map((x,i)=>'<div class="v63-step"><i class="v63-num">'+(i+1)+'</i><div><b>'+esc(x?.[1]||('Step '+(i+1)))+'</b><span>'+esc(x?.[2]||'')+'</span></div></div>').join('')+'</div>';
    if(it.length)return '<div class="v63-native v63-signal">'+it.map((x,i)=>'<div class="v63-signal-card"><small>'+esc(x?.[0]||String(i+1).padStart(2,'0'))+'</small><b>'+esc(x?.[1]||'Key idea')+'</b><span>'+esc(x?.[2]||'')+'</span></div>').join('')+'</div>';
    const ks=words(slide);return '<div class="v63-native v63-signal">'+ks.map((x,i)=>'<div class="v63-signal-card"><small>0'+(i+1)+'</small><b>'+esc(x)+'</b></div>').join('')+'</div>';
  }
  function decorate(canvas){
    if(!canvas||canvas.dataset.v63Busy==='1')return;const slide=slideFor(canvas);if(!slide)return;canvas.dataset.v63Busy='1';
    try{
      const t=clean(slide.title);canvas.classList.toggle('v63-long-title',t.length>46);canvas.classList.toggle('v63-xlong-title',t.length>58);
      const sig=[slide.id||'',slide.layout||'',slide.visualType||'',slide.title||'',JSON.stringify(slide.items||[])].join('|');if(canvas.dataset.v63Sig===sig)return;canvas.dataset.v63Sig=sig;
      $('.v63-hero-visual',canvas).forEach(x=>x.remove());
      if(slide.layout==='hero'){const ks=words(slide);if(ks.length){const v=document.createElement('div');v.className='v63-hero-visual';v.innerHTML=ks.map(x=>'<div class="v63-hero-chip">'+esc(x)+'</div>').join('');canvas.appendChild(v)}}
      if(slide.layout==='split'){const host=$('.v57-visual',canvas);if(host){host.innerHTML=visualMarkup(slide);host.classList.add('v63-enhanced')}}
    }finally{delete canvas.dataset.v63Busy}
  }
  function sync(){
    $$('#v57-deck.open .v57-slide,#v57-present.open .v57-slide').forEach(decorate);
  }
  new MutationObserver(()=>{clearTimeout(window.__v63sync);window.__v63sync=setTimeout(sync,20)}).observe(document.documentElement,{subtree:true,childList:true,characterData:false});
  addEventListener('keydown',()=>setTimeout(sync,0));document.addEventListener('click',()=>setTimeout(sync,0),true);setTimeout(sync,100);
})();