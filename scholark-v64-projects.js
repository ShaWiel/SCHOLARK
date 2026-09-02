(() => {
  if(window.__SCHOLARK_V64_PROJECTS__?.ready)return;
  window.__SCHOLARK_V64_PROJECTS__={booting:true};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const css=document.createElement('style');css.id='scholark-v64-style';css.textContent=`
    .v64-projects{max-width:1280px;margin:0 auto;padding:32px;font-family:Inter,system-ui;color:#17191f}.v64-projects h1{font:950 clamp(38px,5vw,60px)/.95 Inter;letter-spacing:-.05em;margin:8px 0 9px}.v64-projects>p{font:600 11px/1.55 Inter;color:#706c77;max-width:760px}.v64-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:20px}.v64-card{position:relative;border:1px solid rgba(23,25,31,.09);background:#fff;border-radius:18px;padding:17px;text-align:left;cursor:pointer;box-shadow:0 14px 38px rgba(31,27,63,.035)}.v64-card:hover{border-color:#6d5dfc}.v64-card small{display:block;font:850 7.5px Inter;color:#6d5dfc;text-transform:uppercase;letter-spacing:.09em}.v64-card h3{font:900 15px/1.1 Inter;margin:7px 34px 6px 0}.v64-card p{font:600 9.5px/1.45 Inter;color:#706c77;margin:0}.v64-del{position:absolute;right:10px;top:10px;width:28px;height:28px;border:0;border-radius:9px;background:#f4f2f2;color:#8c3d3d;cursor:pointer;font:900 14px Inter}.v64-empty{margin-top:20px;border:1px dashed rgba(23,25,31,.16);border-radius:18px;padding:24px;color:#706c77;font:650 10px Inter}@media(max-width:700px){.v64-grid{grid-template-columns:1fr}.v64-projects{padding:22px 13px}}
  `;document.head.appendChild(css);
  function projectHistory(){try{return JSON.parse(localStorage.getItem('scholark_v45_history')||'[]')}catch{return[]}}
  function key(x){return x.deckId?'deck:'+x.deckId:x.artifactId?'artifact:'+x.artifactId:x.bookId?'book:'+x.bookId:[x.mode||'',x.project||'',x.rawPrompt||x.prompt||''].join('|')}
  function dedupe(a=projectHistory()){const seen=new Set(),out=[];for(const x of a){const k=key(x);if(seen.has(k))continue;seen.add(k);out.push(x)}try{localStorage.setItem('scholark_v45_history',JSON.stringify(out.slice(0,40)))}catch{}return out.slice(0,40)}
  function host(){
    localStorage.setItem('scholark_v51_collapsed','0');
    window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);
    document.body.classList.remove('v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');document.body.classList.add('v51-workspace');
    // My Projects must own a clean workspace surface. Clear every tool overlay
    // that can otherwise remain fixed above #v51-main.
    $('#v41-studio-workspace')?.setAttribute('hidden','');
    $('#sv24-overlay')?.classList.remove('open');
    $('#v50-school')?.classList.remove('open');
    $('#v25-study')?.classList.remove('open');
    $('#v25-book')?.classList.remove('open');
    $('#v58-suite')?.classList.remove('open');$('#v57-deck')?.classList.remove('open');$('#v57-present')?.classList.remove('open');
    const native=$('.v51-native-host');if(native)native.classList.remove('v51-native-host');
    Array.from(document.querySelectorAll('#v51-sidebar [data-v51-tool]')).forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='project'));
    if(String(location.hash||'').toLowerCase()!=='#project')window.history.replaceState(null,'',location.pathname+location.search+'#project');
    const main=$('#v51-main');if(!main)return null;main.classList.add('v52-fast-main');main.style.setProperty('display','block','important');Array.from(main.querySelectorAll('.v51-page')).forEach(p=>{p.classList.remove('active');p.style.display='none'});
    let p=$('[data-v51-page="fallback"]',main);if(!p){p=document.createElement('section');p.className='v51-page';p.dataset.v51Page='fallback';main.appendChild(p)}p.classList.add('active');p.style.display='block';p.style.padding='0';
    let h=$('#v51-fallback',p);if(!h){h=document.createElement('div');h.id='v51-fallback';p.appendChild(h)}return h;
  }
  function label(m){return ({presentation:'Presentation',webpage:'Webpage',document:'Document',social:'Social',graphic:'Graphic'}[m]||m||'Project')}
  function render(){
    const h=host();if(!h)return;const a=dedupe();
    h.innerHTML='<div class="v64-projects"><div class="v52-kicker">SCHOLARK WORKSPACE</div><h1>My Projects</h1><p>Open saved Studio work directly. Autosaves are deduplicated, so one project no longer appears over and over.</p>'+(a.length?'<div class="v64-grid">'+a.map((x,i)=>'<article class="v64-card" data-v64-open="'+i+'"><button class="v64-del" data-v64-del="'+i+'" title="Delete project">×</button><small>'+esc(label(x.mode))+'</small><h3>'+esc(x.project||'Untitled project')+'</h3><p>'+esc(clean(x.rawPrompt||x.prompt||'Saved SCHOLARK creation').slice(0,180))+'</p></article>').join('')+'</div>':'<div class="v64-empty">No saved projects yet. Create something in Studio AI and save it; it will appear here.</div>')+'</div>';
    window.__SCHOLARK_I18N__?.apply?.(h);window.__SCHOLARK_WORKSPACE__?.syncLanguage?.(h);
    requestAnimationFrame(()=>{if(String(location.hash||'').toLowerCase()==='#project'){window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);document.body.classList.remove('v51-collapsed');const main=$('#v51-main');if(main)main.style.setProperty('display','block','important');Array.from(document.querySelectorAll('#v51-sidebar [data-v51-tool]')).forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='project'))}});
  }
  function openItem(i){const a=dedupe(),x=a[i];if(!x)return;
    if(x.deckId){try{const d=JSON.parse(localStorage.getItem('scholark_v57_deck_'+x.deckId)||'null');if(d)return window.__SCHOLARK_V57_PRESENTATIONS__?.open?.(d)}catch{}}
    if(x.artifactId){try{const d=JSON.parse(localStorage.getItem('scholark_v58_artifact_'+x.artifactId)||'null');if(d)return window.__SCHOLARK_V58_ARTIFACTS__?.openArtifact?.(d)}catch{}}
    if(x.bookId){try{const d=JSON.parse(localStorage.getItem('scholark_v65_book')||'null');if(d&&d.id===x.bookId)return window.__SCHOLARK_V65_BOOK__?.openSaved?.(d)}catch{}}
    if(x.mode==='presentation'){try{const d=JSON.parse(localStorage.getItem('scholark_v57_last_deck')||'null');if(d)return window.__SCHOLARK_V57_PRESENTATIONS__?.open?.(d)}catch{}}
    if(['webpage','document','social','graphic'].includes(x.mode)){try{const d=JSON.parse(localStorage.getItem('scholark_v58_'+x.mode)||'null');if(d)return window.__SCHOLARK_V58_ARTIFACTS__?.openArtifact?.(d)}catch{}}
  }
  function removeItem(i){const a=dedupe(),x=a[i];if(!x)return;a.splice(i,1);try{localStorage.setItem('scholark_v45_history',JSON.stringify(a));if(x.artifactId)localStorage.removeItem('scholark_v58_artifact_'+x.artifactId);if(x.deckId)localStorage.removeItem('scholark_v57_deck_'+x.deckId);if(x.bookId)localStorage.removeItem('scholark_v65_book')}catch{}render()}
  window.addEventListener('click',e=>{const d=e.target.closest?.('[data-v64-del]');if(d){e.preventDefault();e.stopPropagation();removeItem(+d.dataset.v64Del);return}const o=e.target.closest?.('[data-v64-open]');if(o){e.preventDefault();openItem(+o.dataset.v64Open)}},false);
  window.__SCHOLARK_V64_PROJECTS__={ready:true,open:render,refresh:render,openItem,removeItem,list:()=>dedupe()};
  dedupe();if(String(location.hash).toLowerCase()==='#project')setTimeout(render,60);
})();