(() => {
  if(window.__SCHOLARK_V69_REFERENCE_READER__)return;
  window.__SCHOLARK_V69_REFERENCE_READER__=true;
  const $=(s,r=document)=>r.querySelector(s);
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const done=new Set();
  const css=document.createElement('style');css.id='scholark-v69-style';css.textContent='.v69-ref-detail{display:block;margin-top:5px;font:700 7.5px/1.4 Inter;color:#6d5dfc}.v69-ref-detail.err{color:#a04343}';document.head.appendChild(css);
  function key(f){return [f.name,f.size,f.lastModified].join(':')}
  function ext(f){return String(f?.name||'').split('.').pop().toLowerCase()}
  function status(msg,err=false){const root=$('#v41-studio-workspace');if(!root)return;let x=$('.v69-ref-detail',root);if(!x){x=document.createElement('span');x.className='v69-ref-detail';$('#v41-file-names',root)?.insertAdjacentElement('afterend',x)}x.textContent=msg||'';x.classList.toggle('err',err)}
  async function base64(file){return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>{const s=String(r.result||''),i=s.indexOf(',');resolve(i>=0?s.slice(i+1):'')};r.onerror=()=>reject(r.error);r.readAsDataURL(file)})}
  async function extract(file){
    const fingerprint=key(file);if(done.has(fingerprint))return true;const e=ext(file);if(!['pdf','docx','pptx'].includes(e))return false;
    if(file.size>10*1024*1024){status(file.name+' is over the 10 MB reference limit.',true);return false}
    status('Reading '+file.name+'…');
    try{const data=await base64(file),r=await fetch('/api/studio/reference/extract',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:file.name,type:file.type,size:file.size,data})});const out=await r.json().catch(()=>({}));if(!r.ok||!out?.ok||!out?.text)throw new Error(out?.error||'Could not extract reference');window.__SCHOLARK_V45_BRIEF__?.mergeReference?.({name:file.name,text:out.text});done.add(fingerprint);const detail=out.pages?out.pages+' pages':out.slides?out.slides+' slides':out.chars+' characters';status(file.name+' ready for AI · '+detail);return true}catch(err){status(file.name+': '+clean(err?.message||err),true);return false}
  }
  async function processInput(input){const files=[...(input?.files||[])],binary=files.filter(f=>['pdf','docx','pptx'].includes(ext(f)));if(!binary.length)return;let ok=0;for(const f of binary){if(await extract(f))ok++}if(ok)status(ok+' binary reference'+(ok===1?'':'s')+' fully readable by Studio AI.')}
  function bind(){const input=$('#v41-files');if(!input||input.dataset.v69bound)return;input.dataset.v69bound='1';const prior=input.getAttribute('accept')||'';const add=['.pdf','.docx','.pptx','.txt','.md','.markdown','.csv','.json','.html','.htm','.xml','image/*'];input.setAttribute('accept',[...new Set(prior.split(',').map(x=>x.trim()).filter(Boolean).concat(add))].join(','));input.addEventListener('change',()=>processInput(input))}
  addEventListener('hashchange',()=>{setTimeout(bind,100);setTimeout(bind,300)});[180,700].forEach(ms=>setTimeout(bind,ms));
  window.__SCHOLARK_V69_REFERENCES__={extract};
})();