(() => {
  if(window.__SCHOLARK_V67_PRO_EXPORTS__)return;
  window.__SCHOLARK_V67_PRO_EXPORTS__=true;
  const $=(s,r=document)=>r.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const css=document.createElement('style');css.id='scholark-v67-style';css.textContent=`
    #v67-export-menu{position:fixed;z-index:2147483646;width:260px;background:#12151d;color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:8px;box-shadow:0 24px 70px rgba(0,0,0,.35);display:none;font-family:Inter,system-ui}#v67-export-menu.open{display:block}.v67-head{padding:7px 8px 9px}.v67-head b{display:block;font:900 10px Inter}.v67-head span{font:650 7.5px/1.35 Inter;color:#9ba1af}.v67-opt{width:100%;display:grid;grid-template-columns:34px 1fr;gap:8px;align-items:center;border:0;background:transparent;color:#fff;border-radius:10px;padding:9px;text-align:left;cursor:pointer}.v67-opt:hover{background:#202634}.v67-icon{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;background:#c9ff6a;color:#151821;font:950 8px Inter}.v67-opt b{display:block;font:850 9px Inter}.v67-opt span{display:block;font:650 7.5px/1.35 Inter;color:#9da4b2;margin-top:2px}.v67-status{padding:7px 8px;font:700 7.5px/1.4 Inter;color:#c9ff6a;min-height:12px}.v67-status.err{color:#ffb9b9}.v67-busy{pointer-events:none;opacity:.62}
  `;document.head.appendChild(css);
  const menu=document.createElement('div');menu.id='v67-export-menu';document.body.appendChild(menu);let current=null,busy=false;

  function filenameFrom(r,fallback){const d=r.headers.get('content-disposition')||'';const m=d.match(/filename="?([^";]+)"?/i);return m?.[1]||fallback}
  function downloadBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),800)}
  async function request(endpoint,body,fallback,statusText){
    if(busy)return;busy=true;menu.classList.add('v67-busy');setStatus(statusText||'Building export…');
    try{const r=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});if(!r.ok){let x={};try{x=await r.json()}catch{}throw new Error(x?.error||('Export failed ('+r.status+')'))}const blob=await r.blob();downloadBlob(blob,filenameFrom(r,fallback));setStatus('Export ready. Download started.');setTimeout(close,850)}
    catch(e){setStatus('Export failed: '+clean(e?.message||e),true)}finally{busy=false;menu.classList.remove('v67-busy')}
  }
  function setStatus(t,err=false){const s=$('.v67-status',menu);if(s){s.textContent=t||'';s.classList.toggle('err',err)}}
  function position(anchor){const r=anchor?.getBoundingClientRect?.();if(!r)return;const w=260,left=Math.max(8,Math.min(innerWidth-w-8,r.right-w)),top=Math.min(innerHeight-260,r.bottom+7);menu.style.left=left+'px';menu.style.top=Math.max(8,top)+'px'}
  function open(anchor,type){current={anchor,type};let opts='';
    if(type==='presentation')opts='<button class="v67-opt" data-v67="pptx"><i class="v67-icon">PPTX</i><span><b>PowerPoint presentation</b><span>Editable .pptx with slide layouts, notes, sources and generated visuals</span></span></button><button class="v67-opt" data-v67="pres-pdf"><i class="v67-icon">PDF</i><span><b>Presentation PDF</b><span>Real PDF file with one designed slide per page</span></span></button>';
    if(type==='document')opts='<button class="v67-opt" data-v67="docx"><i class="v67-icon">DOCX</i><span><b>Microsoft Word</b><span>Real editable .docx with headings, sections and references</span></span></button><button class="v67-opt" data-v67="doc-pdf"><i class="v67-icon">PDF</i><span><b>Document PDF</b><span>Portable formatted report/document</span></span></button>';
    if(type==='book')opts='<button class="v67-opt" data-v67="book-docx"><i class="v67-icon">DOCX</i><span><b>Book manuscript</b><span>Editable Word manuscript with chapters and generated drafts</span></span></button><button class="v67-opt" data-v67="book-pdf"><i class="v67-icon">PDF</i><span><b>Book PDF</b><span>Reading copy with chapter page breaks</span></span></button>';
    menu.innerHTML='<div class="v67-head"><b>Professional export</b><span>SCHOLARK builds a real file instead of renaming HTML.</span></div>'+opts+'<div class="v67-status"></div>';position(anchor);menu.classList.add('open')
  }
  function close(){if(busy)return;menu.classList.remove('open');current=null}
  async function exportPresentation(kind){
    const deck=window.__SCHOLARK_V57_PRESENTATIONS__?.getDeck?.();if(!deck)return setStatus('No presentation deck is open.',true);
    setStatus('Collecting slide visuals…');const media=await window.__SCHOLARK_V66_MEDIA__?.collectDeckMedia?.(deck)||{};
    if(kind==='pptx')return request('/api/export/presentation/pptx',{deck,media},(deck.name||'scholark-presentation')+'.pptx','Building editable PowerPoint…');
    return request('/api/export/presentation/pdf',{deck,media},(deck.name||'scholark-presentation')+'.pdf','Rendering presentation PDF…');
  }
  function exportDocument(kind){const artifact=window.__SCHOLARK_V58_ARTIFACTS__?.get?.();if(!artifact)return setStatus('No document is open.',true);return request(kind==='docx'?'/api/export/document/docx':'/api/export/document/pdf',{kind:'document',artifact},(artifact.name||'scholark-document')+(kind==='docx'?'.docx':'.pdf'),kind==='docx'?'Building real Word document…':'Rendering document PDF…')}
  function exportBook(kind){const book=window.__SCHOLARK_V65_BOOK__?.get?.();if(!book)return setStatus('No book project is open.',true);return request(kind==='docx'?'/api/export/document/docx':'/api/export/document/pdf',{kind:'book',book},(book.name||'scholark-book')+(kind==='docx'?'.docx':'.pdf'),kind==='docx'?'Building Word manuscript…':'Rendering book PDF…')}

  document.addEventListener('click',e=>{
    const p=e.target.closest?.('#v57-deck .v57-export');if(p){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();p.textContent='Export';open(p,'presentation');return}
    const d=e.target.closest?.('#v58-suite .v58-export');if(d){const a=window.__SCHOLARK_V58_ARTIFACTS__?.get?.();if(a?.mode==='document'){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(d,'document');return}}
    const b=e.target.closest?.('#v65-export');if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(b,'book');return}
    const o=e.target.closest?.('[data-v67]');if(o){e.preventDefault();const k=o.dataset.v67;if(k==='pptx'||k==='pres-pdf')exportPresentation(k);else if(k==='docx'||k==='doc-pdf')exportDocument(k==='docx'?'docx':'pdf');else exportBook(k==='book-docx'?'docx':'pdf');return}
    if(menu.classList.contains('open')&&!e.target.closest?.('#v67-export-menu'))close();
  },true);
  addEventListener('resize',()=>{if(current?.anchor&&menu.classList.contains('open'))position(current.anchor)});
  const syncLabel=()=>{const b=$('#v57-deck .v57-export');if(b&&b.textContent!=='Export')b.textContent='Export'};document.addEventListener('click',e=>{if(e.target.closest?.('#v57-deck'))setTimeout(syncLabel,60)},true);addEventListener('hashchange',()=>setTimeout(syncLabel,150));setTimeout(syncLabel,180);
})();