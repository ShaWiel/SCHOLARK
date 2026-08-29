(() => {
  if (window.__SCHOLARK_V60_PRESENTATION_READY__) return;
  window.__SCHOLARK_V60_PRESENTATION_READY__ = true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const css=document.createElement('style');css.id='scholark-v60-style';css.textContent=`
    #v57-deck.v60-ai-deck .v57-orb{display:none!important}
    #v57-deck.v60-ai-deck .v57-slide:after{opacity:.35!important}
    #v57-deck.v60-ai-deck .v57-title{overflow-wrap:anywhere;text-wrap:balance}
    #v57-deck.v60-ai-deck .v57-sub{overflow-wrap:anywhere;text-wrap:pretty}
    #v57-deck.v60-ai-deck .v57-visual{background:linear-gradient(145deg,var(--spanel),color-mix(in srgb,var(--saccent2) 18%,var(--spanel)))}
    .v60-source-strip{position:absolute!important;left:6.2%;right:6.2%;bottom:3.2%;z-index:4!important;font:650 clamp(5.5px,.62vw,8px)/1.25 Inter;color:color-mix(in srgb,var(--smuted) 82%,transparent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .v60-editor-block{margin-top:12px;padding-top:12px;border-top:1px solid #e3e4e8}.v60-editor-block label{display:block;font:900 8px Inter;color:#6e6975;margin:0 0 5px}.v60-editor-block textarea{width:100%;min-height:105px;resize:vertical;border:1px solid #d9dbe1;background:#fafafa;border-radius:9px;padding:9px;font:650 8.5px/1.45 Inter;color:#34313a;outline:0}.v60-editor-block textarea:focus{border-color:#7869ee;box-shadow:0 0 0 2px rgba(120,105,238,.12)}.v60-visual-note{padding:9px;border-radius:9px;background:#f4f3ff;font:650 8px/1.42 Inter;color:#59516d;margin-bottom:8px}.v60-visual-note b{display:block;font:900 8px Inter;color:#5b4ddd;margin-bottom:3px}.v60-sources{font:650 7.5px/1.45 Inter;color:#777;word-break:break-word}.v60-sources b{display:block;font:900 8px Inter;color:#555;margin-bottom:4px}
    #v57-present .v60-source-strip{bottom:2.2%;font-size:min(.7vw,10px)}
  `;document.head.appendChild(css);

  function api(){return window.__SCHOLARK_V57_PRESENTATIONS__}
  function deck(){return api()?.getDeck?.()||null}
  function index(){const a=$('#v57-deck .v57-thumb.active');return a?Number(a.dataset.i||0):0}
  function slide(){const d=deck();return d?.slides?.[index()]||null}
  function domain(u){try{return new URL(u).hostname.replace(/^www\./,'')}catch{return clean(u).slice(0,45)}}
  function ensurePanel(){
    const panel=$('#v57-deck .v57-panel');if(!panel||$('#v60-presenter-tools',panel))return;
    const box=document.createElement('div');box.id='v60-presenter-tools';box.className='v60-editor-block';box.innerHTML='<label>Speaker notes</label><textarea class="v60-notes" placeholder="Presenter notes for this slide"></textarea><div class="v60-visual-note"><b>Visual direction</b><span class="v60-visual-copy">No special visual direction.</span></div><div class="v60-sources"><b>Slide sources</b><span class="v60-source-copy">No slide-specific sources.</span></div>';
    panel.appendChild(box);
    $('.v60-notes',box).addEventListener('input',e=>{const s=slide();if(!s)return;s.speakerNotes=e.target.value;clearTimeout(window.__v60save);window.__v60save=setTimeout(()=>$('#v57-deck .v57-save-btn')?.click(),260)});
  }
  function fitTitle(canvas,s){
    const t=$('.v57-title,.v57-quote',canvas);if(!t)return;
    const n=clean(s?.title).length;
    if(n>72)t.style.fontSize='clamp(22px,3.5vw,50px)';
    else if(n>52)t.style.fontSize='clamp(24px,4.2vw,58px)';
    else t.style.fontSize='';
  }
  function addSources(canvas,s){
    canvas.querySelector('.v60-source-strip')?.remove();
    const refs=(s?.sourceRefs||[]).filter(Boolean);if(!refs.length)return;
    const line=document.createElement('div');line.className='v60-source-strip';line.textContent='Sources: '+refs.slice(0,4).map(domain).join(' · ');canvas.appendChild(line);
  }
  function sync(){
    const root=$('#v57-deck');const d=deck();if(!root||!d)return;
    root.classList.toggle('v60-ai-deck',!!d.ai);
    ensurePanel();
    const s=slide();if(!s)return;
    $$('.v57-slide',root).forEach(c=>{fitTitle(c,s);addSources(c,s)});
    const p=$('#v57-present .v57-slide');if(p&&$('#v57-present')?.classList.contains('open')){fitTitle(p,s);addSources(p,s)}
    const notes=$('#v60-presenter-tools .v60-notes');if(notes&&document.activeElement!==notes)notes.value=s.speakerNotes||'';
    const visual=$('#v60-presenter-tools .v60-visual-copy');if(visual)visual.textContent=s.visualBrief?`${s.visualType?clean(s.visualType)+': ':''}${clean(s.visualBrief)}`:'No special visual direction.';
    const src=$('#v60-presenter-tools .v60-source-copy');if(src)src.innerHTML=(s.sourceRefs||[]).length?(s.sourceRefs||[]).slice(0,6).map(x=>esc(x)).join('<br>'):'No slide-specific sources.';
  }
  addEventListener('click',e=>{if(e.target.closest?.('#v57-deck,#v57-present'))setTimeout(sync,30)},true);
  addEventListener('hashchange',()=>setTimeout(sync,120));
  [250,700].forEach(ms=>setTimeout(sync,ms));
})();
