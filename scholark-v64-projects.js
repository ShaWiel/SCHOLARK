(() => {
  if(window.__SCHOLARK_V64_PROJECTS__?.ready)return;
  window.__SCHOLARK_V64_PROJECTS__={booting:true};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const HISTORY='scholark_v45_history',BACKUP='scholark_v64_history_backup',TRASH='scholark_v64_last_deleted';
  const css=document.createElement('style');css.id='scholark-v64-style';css.textContent=`
    .v64-projects{max-width:1280px;margin:0 auto;padding:32px;font-family:Inter,system-ui;color:#17191f}.v64-projects h1{font:950 clamp(38px,5vw,60px)/.95 Inter;letter-spacing:-.05em;margin:8px 0 9px}.v64-projects>p{font:600 11px/1.55 Inter;color:#706c77;max-width:760px}.v64-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:20px}.v64-card{position:relative;border:1px solid rgba(23,25,31,.09);background:#fff;border-radius:18px;padding:17px;text-align:left;cursor:pointer;box-shadow:0 14px 38px rgba(31,27,63,.035)}.v64-card:hover{border-color:#6d5dfc}.v64-card small{display:block;font:850 7.5px Inter;color:#6d5dfc;text-transform:uppercase;letter-spacing:.09em}.v64-card h3{font:900 15px/1.1 Inter;margin:7px 34px 6px 0}.v64-card p{font:600 9.5px/1.45 Inter;color:#706c77;margin:0}.v64-del{position:absolute;right:10px;top:10px;width:28px;height:28px;border:0;border-radius:9px;background:#f4f2f2;color:#8c3d3d;cursor:pointer;font:900 14px Inter}.v64-empty{margin-top:20px;border:1px dashed rgba(23,25,31,.16);border-radius:18px;padding:24px;color:#706c77;font:650 10px Inter}.v64-notice{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:16px 0 0;padding:12px 14px;border-radius:13px;background:#17191f;color:#fff;font:700 9px/1.45 Inter}.v64-notice button{border:0;border-radius:9px;background:#c9ff6a;color:#17191f;padding:8px 11px;font:900 8px Inter;cursor:pointer}.v64-recover{margin-top:8px;color:#8a8490;font:650 8px Inter}@media(max-width:700px){.v64-grid{grid-template-columns:1fr}.v64-projects{padding:22px 13px}}
  `;document.head.appendChild(css);

  function parseArray(raw){try{const x=JSON.parse(raw||'[]');return Array.isArray(x)?x:null}catch{return null}}
  function projectHistory(){
    const raw=localStorage.getItem(HISTORY),current=parseArray(raw);
    if(current)return current;
    const recovered=parseArray(localStorage.getItem(BACKUP));
    if(recovered){try{localStorage.setItem(HISTORY,JSON.stringify(recovered))}catch{}return recovered}
    return [];
  }
  function writeHistory(next){
    const safe=Array.isArray(next)?next.slice(0,80):[];
    try{
      const current=localStorage.getItem(HISTORY),parsed=parseArray(current);
      if(parsed)localStorage.setItem(BACKUP,JSON.stringify(parsed.slice(0,80)));
      localStorage.setItem(HISTORY,JSON.stringify(safe));
    }catch(e){console.warn('[SCHOLARK] Could not persist project history',e)}
    return safe;
  }
  function key(x){return x?.deckId?'deck:'+x.deckId:x?.artifactId?'artifact:'+x.artifactId:x?.bookId?'book:'+x.bookId:[x?.mode||'',x?.project||'',x?.rawPrompt||x?.prompt||''].join('|')}
  function dedupe(a=projectHistory()){
    const seen=new Set(),out=[];
    for(const x of a){if(!x||typeof x!=='object')continue;const k=key(x);if(seen.has(k))continue;seen.add(k);out.push(x)}
    return writeHistory(out.slice(0,40));
  }
  function host(){
    try{localStorage.setItem('scholark_v51_collapsed','0')}catch{}
    window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);
    document.body.classList.remove('v51-collapsed','v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');document.body.classList.add('v51-workspace');
    $('#v41-studio-workspace')?.setAttribute('hidden','');
    $('#sv24-overlay')?.classList.remove('open');$('#v50-school')?.classList.remove('open');$('#v25-study')?.classList.remove('open');$('#v25-book')?.classList.remove('open');
    $('#v58-suite')?.classList.remove('open');$('#v57-deck')?.classList.remove('open');$('#v57-present')?.classList.remove('open');
    const native=$('.v51-native-host');if(native)native.classList.remove('v51-native-host');
    $$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='project'));
    if(String(location.hash||'').toLowerCase()!=='#project')window.history.replaceState(null,'',location.pathname+location.search+'#project');
    const main=$('#v51-main');if(!main)return null;main.classList.add('v52-fast-main');main.style.setProperty('display','block','important');$$('.v51-page',main).forEach(p=>{p.classList.remove('active');p.style.display='none'});
    let p=$('[data-v51-page="fallback"]',main);if(!p){p=document.createElement('section');p.className='v51-page';p.dataset.v51Page='fallback';main.appendChild(p)}p.classList.add('active');p.style.display='block';p.style.padding='0';
    let h=$('#v51-fallback',p);if(!h){h=document.createElement('div');h.id='v51-fallback';p.appendChild(h)}return h;
  }
  function label(m){return ({presentation:'Presentation',webpage:'Webpage',document:'Document',social:'Social',graphic:'Graphic',book:'Book'}[m]||m||'Project')}
  function lastTrash(){try{return JSON.parse(localStorage.getItem(TRASH)||'null')}catch{return null}}
  function render(){
    const h=host();if(!h)return;const a=dedupe(),trash=lastTrash();
    const notice=trash?.item?'<div class="v64-notice"><span>Project deleted. SCHOLARK kept a recovery copy.</span><button type="button" data-v64-undo>Undo delete</button></div>':'';
    h.innerHTML='<div class="v64-projects"><div class="v52-kicker">SCHOLARK WORKSPACE</div><h1>My Projects</h1><p>Open saved Studio work directly. SCHOLARK keeps a backup of your project list and can recover the last deleted project.</p>'+notice+(a.length?'<div class="v64-grid">'+a.map((x,i)=>'<article class="v64-card" data-v64-open="'+i+'"><button class="v64-del" data-v64-del="'+i+'" title="Delete project">×</button><small>'+esc(label(x.mode))+'</small><h3>'+esc(x.project||'Untitled project')+'</h3><p>'+esc(clean(x.rawPrompt||x.prompt||'Saved SCHOLARK creation').slice(0,180))+'</p></article>').join('')+'</div>':'<div class="v64-empty">No saved projects yet. Saved creations will appear here. Studio AI is currently coming soon.</div>')+'</div>';
    window.__SCHOLARK_I18N__?.apply?.(h);window.__SCHOLARK_WORKSPACE__?.syncLanguage?.(h);
    requestAnimationFrame(()=>{if(String(location.hash||'').toLowerCase()==='#project'){window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);document.body.classList.remove('v51-collapsed');const main=$('#v51-main');if(main)main.style.setProperty('display','block','important');$$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='project'))}});
  }
  function storageSnapshot(x){
    const keys=[];
    if(x?.deckId)keys.push('scholark_v57_deck_'+x.deckId);
    if(x?.artifactId)keys.push('scholark_v58_artifact_'+x.artifactId);
    if(x?.bookId)keys.push('scholark_v65_book');
    if(x?.mode==='presentation')keys.push('scholark_v57_last_deck');
    if(['webpage','document','social','graphic'].includes(x?.mode))keys.push('scholark_v58_'+x.mode);
    const data={};for(const k of keys){const v=localStorage.getItem(k);if(v!=null)data[k]=v}return data;
  }
  async function recoverInStudio(x){
    if(window.__SCHOLARK_FEATURE_FLAGS__?.studio===false){window.__SCHOLARK_WORKSPACE__?.openTool?.('studio');return false}
    try{
      await window.__SCHOLARK_RUNTIME__?.ensure?.('studio');
      window.__SCHOLARK_WORKSPACE__?.setCollapsed?.(false,true);
      window.__SCHOLARK_STUDIO_WORKSPACE__?.open?.(null,{route:true,fast:true});
      setTimeout(()=>{
        const m=x?.mode||'presentation';$('.v41-mode[data-mode="'+CSS.escape(m)+'"]')?.click?.();
        const prompt=$('#v41-prompt');if(prompt&&!prompt.value)prompt.value=x?.rawPrompt||x?.prompt||'';
        const name=$('#v41-project-name');if(name&&!name.value)name.value=x?.project||'';
        prompt?.dispatchEvent(new Event('input',{bubbles:true}));
      },100);
      return true;
    }catch(e){console.warn('[SCHOLARK] Project recovery failed',e);return false}
  }
  async function openItem(i){const a=dedupe(),x=a[i];if(!x)return;
    if(x.bookId&&window.__SCHOLARK_FEATURE_FLAGS__?.book===false){window.__SCHOLARK_WORKSPACE__?.openTool?.('book');return}
    if(x.deckId){try{const d=JSON.parse(localStorage.getItem('scholark_v57_deck_'+x.deckId)||'null');if(d&&window.__SCHOLARK_V57_PRESENTATIONS__?.open)return window.__SCHOLARK_V57_PRESENTATIONS__.open(d)}catch{}}
    if(x.artifactId){try{const d=JSON.parse(localStorage.getItem('scholark_v58_artifact_'+x.artifactId)||'null');if(d&&window.__SCHOLARK_V58_ARTIFACTS__?.openArtifact)return window.__SCHOLARK_V58_ARTIFACTS__.openArtifact(d)}catch{}}
    if(x.bookId){try{const d=JSON.parse(localStorage.getItem('scholark_v65_book')||'null');if(d&&d.id===x.bookId&&window.__SCHOLARK_V65_BOOK__?.openSaved)return window.__SCHOLARK_V65_BOOK__.openSaved(d)}catch{}}
    if(x.mode==='presentation'){try{const d=JSON.parse(localStorage.getItem('scholark_v57_last_deck')||'null');if(d&&window.__SCHOLARK_V57_PRESENTATIONS__?.open)return window.__SCHOLARK_V57_PRESENTATIONS__.open(d)}catch{}}
    if(['webpage','document','social','graphic'].includes(x.mode)){try{const d=JSON.parse(localStorage.getItem('scholark_v58_'+x.mode)||'null');if(d&&window.__SCHOLARK_V58_ARTIFACTS__?.openArtifact)return window.__SCHOLARK_V58_ARTIFACTS__.openArtifact(d)}catch{}}
    await recoverInStudio(x);
  }
  function removeItem(i){
    const a=dedupe(),x=a[i];if(!x)return;
    try{localStorage.setItem(TRASH,JSON.stringify({at:Date.now(),item:x,storage:storageSnapshot(x)}))}catch{}
    a.splice(i,1);writeHistory(a);
    try{if(x.artifactId)localStorage.removeItem('scholark_v58_artifact_'+x.artifactId);if(x.deckId)localStorage.removeItem('scholark_v57_deck_'+x.deckId);if(x.bookId)localStorage.removeItem('scholark_v65_book')}catch{}
    render();
  }
  function undoDelete(){
    const t=lastTrash();if(!t?.item)return false;
    try{for(const [k,v] of Object.entries(t.storage||{}))localStorage.setItem(k,v);const a=dedupe();writeHistory([t.item,...a.filter(x=>key(x)!==key(t.item))]);localStorage.removeItem(TRASH)}catch(e){console.warn('[SCHOLARK] Undo delete failed',e);return false}
    render();return true;
  }
  window.addEventListener('click',e=>{const u=e.target.closest?.('[data-v64-undo]');if(u){e.preventDefault();undoDelete();return}const d=e.target.closest?.('[data-v64-del]');if(d){e.preventDefault();e.stopPropagation();removeItem(+d.dataset.v64Del);return}const o=e.target.closest?.('[data-v64-open]');if(o){e.preventDefault();openItem(+o.dataset.v64Open)}},false);
  window.addEventListener('storage',e=>{if(e.key===HISTORY&&String(location.hash||'').toLowerCase()==='#project')render()});
  window.__SCHOLARK_V64_PROJECTS__={ready:true,open:render,refresh:render,openItem,removeItem,undoDelete,list:()=>dedupe(),recover:()=>{const b=parseArray(localStorage.getItem(BACKUP));if(!b)return false;writeHistory(b);render();return true}};
  dedupe();if(String(location.hash).toLowerCase()==='#project')setTimeout(render,60);
})();
