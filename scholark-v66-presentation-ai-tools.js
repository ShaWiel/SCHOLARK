(() => {
  if (window.__SCHOLARK_V66_PRESENTATION_AI_TOOLS__) return;
  window.__SCHOLARK_V66_PRESENTATION_AI_TOOLS__ = true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const api=()=>window.__SCHOLARK_V57_PRESENTATIONS__;
  const mem=new Map(), urls=new Map();
  let dbPromise=null, batchBusy=false;

  const css=document.createElement('style');css.id='scholark-v66-style';css.textContent=`
    .v66-tools{margin-top:12px;padding-top:12px;border-top:1px solid #e3e4e8;display:grid;gap:8px}.v66-tools>label{font:900 8px Inter;color:#6e6975}.v66-tools textarea{width:100%;box-sizing:border-box;border:1px solid #d9dbe1;background:#fafafa;border-radius:9px;padding:9px;font:650 8.5px/1.45 Inter;color:#34313a;outline:0;resize:vertical}.v66-tools textarea:focus{border-color:#7869ee;box-shadow:0 0 0 2px rgba(120,105,238,.12)}.v66-btns{display:grid;grid-template-columns:1fr 1fr;gap:6px}.v66-btn{border:0;border-radius:9px;padding:9px 8px;background:#17191f;color:#fff;font:850 8px Inter;cursor:pointer}.v66-btn.alt{background:#eeecff;color:#5548c8}.v66-btn.warn{background:#fff4dd;color:#785100}.v66-btn:disabled{opacity:.5;cursor:wait}.v66-state{min-height:16px;font:700 7.5px/1.4 Inter;color:#7a7480}.v66-source-edit{min-height:70px!important}.v66-media-wrap{position:absolute;overflow:hidden;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,.18);border:1px solid color-mix(in srgb,var(--sink) 10%,transparent);z-index:2}.v66-media-wrap img{width:100%;height:100%;display:block;object-fit:cover}.v57-slide.v66-has-media>.v57-title,.v57-slide.v66-has-media>.v57-sub{max-width:52%!important}.v57-slide.v66-has-media>.v63-hero-visual{display:none!important}.v57-slide.v66-has-media>.v66-media-wrap{right:5.5%;top:10%;bottom:10%;width:36%}.v57-visual.v66-media-host{padding:0!important;overflow:hidden!important;background:#000!important}.v57-visual.v66-media-host img{width:100%;height:100%;object-fit:cover;display:block}.v66-credit-note{font:650 7px/1.35 Inter;color:#8b8591}.v66-batch-progress{font-weight:850;color:#5d50d8}@media(max-width:760px){.v57-slide.v66-has-media>.v66-media-wrap{display:none}.v57-slide.v66-has-media>.v57-title,.v57-slide.v66-has-media>.v57-sub{max-width:92%!important}.v66-btns{grid-template-columns:1fr}}
  `;document.head.appendChild(css);

  function deck(){return api()?.getDeck?.()||null}
  function index(){return Number(api()?.getIndex?.()||0)}
  function slide(){return deck()?.slides?.[index()]||null}

  function openDB(){
    if(dbPromise)return dbPromise;
    if(!('indexedDB' in window))return Promise.resolve(null);
    dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('scholark_media_v1',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('assets'))r.result.createObjectStore('assets',{keyPath:'key'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
    return dbPromise;
  }
  async function putAsset(key,blob,meta={}){mem.set(key,{key,blob,...meta});try{const db=await openDB();if(!db)return;await new Promise((resolve,reject)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').put({key,blob,...meta,updated:Date.now()});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}catch{}}
  async function getAsset(key){if(mem.has(key))return mem.get(key);try{const db=await openDB();if(!db)return null;const out=await new Promise((resolve,reject)=>{const tx=db.transaction('assets','readonly');const q=tx.objectStore('assets').get(key);q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>reject(q.error)});if(out)mem.set(key,out);return out}catch{return null}}
  async function delAsset(key){mem.delete(key);if(urls.has(key)){URL.revokeObjectURL(urls.get(key));urls.delete(key)}try{const db=await openDB();if(!db)return;await new Promise((resolve,reject)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').delete(key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}catch{}}
  async function assetURL(key){if(urls.has(key))return urls.get(key);const a=await getAsset(key);if(!a?.blob)return'';const u=URL.createObjectURL(a.blob);urls.set(key,u);return u}

  function ensurePanel(){
    const panel=$('#v57-deck .v57-panel');if(!panel||$('#v66-slide-ai',panel))return;
    const box=document.createElement('div');box.id='v66-slide-ai';box.className='v66-tools';box.innerHTML='<label>AI edit this slide</label><textarea class="v66-instruction" rows="3" placeholder="e.g. Make this more persuasive, turn it into a timeline, shorten the copy, or simplify for younger students"></textarea><div class="v66-btns"><button class="v66-btn v66-apply">Apply with AI</button><button class="v66-btn alt v66-image">Generate visual</button></div><div class="v66-btns"><button class="v66-btn alt v66-all">Generate deck visuals</button><button class="v66-btn warn v66-remove">Remove visual</button></div><div class="v66-credit-note">Image generation uses your configured provider credits only when you click Generate visual(s).</div><label>Editable slide sources</label><textarea class="v66-source-edit" placeholder="One source URL or reference per line"></textarea><div class="v66-state"></div>';
    panel.appendChild(box);
    $('.v66-apply',box).onclick=editSlideAI;$('.v66-image',box).onclick=()=>generateVisual(index());$('.v66-all',box).onclick=generateAllVisuals;$('.v66-remove',box).onclick=removeVisual;
    $('.v66-source-edit',box).addEventListener('input',e=>{const s=slide();if(!s)return;s.sourceRefs=String(e.target.value||'').split(/\n+/).map(clean).filter(Boolean);clearTimeout(window.__v66sourceSave);window.__v66sourceSave=setTimeout(()=>api()?.save?.(),220)});
  }
  function setState(msg,kind=''){const el=$('#v66-slide-ai .v66-state');if(el){el.textContent=msg||'';el.className='v66-state'+(kind?' '+kind:'')}}
  function busy(on){$$('#v66-slide-ai button').forEach(b=>b.disabled=!!on)}

  function layoutFrom(raw,current='split'){const v=clean(raw).toLowerCase();for(const k of ['hero','split','cards','timeline','compare','stats','quote','statement','grid','closing'])if(v.includes(k))return k;return current}
  function sectionToSlide(sec,current){
    const points=Array.isArray(sec?.points)?sec.points:[];let items=points.map((p,i)=>[clean(p?.value)||String(i+1).padStart(2,'0'),clean(p?.heading),clean(p?.detail)]);
    if(!items.length)items=(sec?.bullets||[]).filter(Boolean).slice(0,4).map((x,i)=>[String(i+1).padStart(2,'0'),clean(x),'']);
    const layout=layoutFrom(sec?.layoutHint,current?.layout||'split');
    return {...current,layout,title:clean(sec?.title)||current?.title||'',subtitle:clean(sec?.subtitle||sec?.body)||current?.subtitle||'',kicker:clean(sec?.label)||current?.kicker||'',items,speakerNotes:clean(sec?.speakerNotes)||current?.speakerNotes||'',visualType:clean(sec?.visualType),visualBrief:clean(sec?.visualBrief),sourceRefs:Array.isArray(sec?.sourceRefs)?sec.sourceRefs.filter(Boolean):(current?.sourceRefs||[])};
  }
  async function editSlideAI(){
    const d=deck(),s=slide(),instruction=clean($('#v66-slide-ai .v66-instruction')?.value);if(!d||!s)return;if(!instruction){$('#v66-slide-ai .v66-instruction')?.focus();return}
    busy(true);setState('SCHOLARK is redesigning this slide…');
    try{
      const neighbors=d.slides.slice(Math.max(0,index()-2),Math.min(d.slides.length,index()+3)).map((x,i)=>clean(x.title)).join(' → ');
      const prompt='EDIT REQUEST: '+instruction+'\nCURRENT SLIDE JSON: '+JSON.stringify({title:s.title,subtitle:s.subtitle,layout:s.layout,items:s.items,speakerNotes:s.speakerNotes,visualType:s.visualType,visualBrief:s.visualBrief,sourceRefs:s.sourceRefs})+'\nDECK CONTEXT: '+d.name+' | Nearby slide flow: '+neighbors+'\nReturn the finished replacement slide only.';
      const r=await fetch('/api/studio/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'presentation_slide_edit',prompt,count:1,settings:{strict:true,visuals:true,autopolish:true}})});
      const data=await r.json().catch(()=>({}));if(!r.ok||!data?.ok||!data?.artifact?.sections?.[0])throw new Error(data?.error||'Slide AI edit failed');
      const next=sectionToSlide(data.artifact.sections[0],s);
      if(/visual|image|photo|illustration|picture|background/i.test(instruction)&&s.mediaKey){next.mediaKey='';next.mediaPrompt='';next.mediaModel=''}
      api()?.replaceSlide?.(index(),next);$('#v66-slide-ai .v66-instruction').value='';setState('Slide updated with AI.');setTimeout(sync,50);
    }catch(e){setState('AI edit failed: '+clean(e?.message||e),'v66-error')}finally{busy(false)}
  }

  function imagePrompt(d,s){
    const brief=clean(s.visualBrief)||clean(s.visualType)||clean(s.subtitle)||clean(s.title);
    return ['Presentation-ready editorial visual for a professional slide deck.','Deck topic: '+clean(d.name||d.prompt)+'.','Slide: '+clean(s.title)+'.','Visual direction: '+brief+'.','Create one strong coherent image with intentional composition, realistic lighting or high-end illustration depending on topic.','No typography, no readable words, no captions, no logos, no UI mockups, no watermark.','Leave useful negative space for presentation text.','16:9 landscape composition.'].join(' ');
  }
  async function generateVisual(i,{quiet=false}={}){
    const d=deck(),s=d?.slides?.[i];if(!d||!s)return false;
    if(!quiet){busy(true);setState('Generating a real visual for this slide…')}
    try{
      const prompt=imagePrompt(d,s);
      const r=await fetch('/api/studio/image',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt,width:1280,height:720})});
      if(!r.ok){let e={};try{e=await r.json()}catch{}throw new Error(e?.error||('Image generation failed ('+r.status+')'))}
      const blob=await r.blob(),model=r.headers.get('x-scholark-image-model')||'image-ai',seed=r.headers.get('x-scholark-image-seed')||'';
      const key='deck:'+d.id+':slide:'+s.id+':'+Date.now();await putAsset(key,blob,{model,seed,prompt,type:blob.type});
      if(s.mediaKey)await delAsset(s.mediaKey);s.mediaKey=key;s.mediaPrompt=prompt;s.mediaModel=model;s.mediaAlt=clean(s.visualBrief||s.title);
      if(!['hero','split'].includes(s.layout))s.layout='split';
      api()?.updateSlide?.(i,{mediaKey:s.mediaKey,mediaPrompt:s.mediaPrompt,mediaModel:s.mediaModel,mediaAlt:s.mediaAlt,layout:s.layout});
      if(!quiet)setState('Visual generated with '+model+'.');setTimeout(sync,35);return true;
    }catch(e){if(!quiet)setState('Visual generation failed: '+clean(e?.message||e));throw e}finally{if(!quiet)busy(false)}
  }
  async function generateAllVisuals(){
    if(batchBusy)return;const d=deck();if(!d)return;const eligible=d.slides.map((s,i)=>({s,i})).filter(x=>!['quote','statement','closing'].includes(x.s.layout)&&clean(x.s.visualBrief||x.s.visualType||x.s.title));if(!eligible.length){setState('No slides currently need generated visuals.');return}
    batchBusy=true;busy(true);let done=0;
    try{for(const x of eligible){setState('Generating deck visuals '+(done+1)+' / '+eligible.length+'…','v66-batch-progress');try{await generateVisual(x.i,{quiet:true});done++}catch(e){if(/balance|quota|credit|402/i.test(clean(e?.message))){setState('Stopped after '+done+' visuals because the image provider balance is unavailable.');break}}}if(done===eligible.length)setState('Generated visuals for '+done+' slides.')}finally{batchBusy=false;busy(false);api()?.selectSlide?.(index());setTimeout(sync,60)}
  }
  async function removeVisual(){const s=slide();if(!s?.mediaKey){setState('This slide has no generated visual.');return}const key=s.mediaKey;await delAsset(key);s.mediaKey='';s.mediaPrompt='';s.mediaModel='';s.mediaAlt='';api()?.updateSlide?.(index(),{mediaKey:'',mediaPrompt:'',mediaModel:'',mediaAlt:''});setState('Visual removed.');setTimeout(sync,50)}

  async function decorateCanvas(canvas,s){
    if(!canvas||!s)return;const key=s.mediaKey||'';
    if(canvas.dataset.v66Key===key&&(!key||canvas.querySelector('.v66-media-wrap,.v66-media-host img')))return;
    canvas.dataset.v66Key=key;canvas.classList.remove('v66-has-media');canvas.querySelectorAll('.v66-media-wrap').forEach(x=>x.remove());
    const host=$('.v57-visual',canvas);if(host){host.classList.remove('v66-media-host')}
    if(!key)return;const u=await assetURL(key);if(!u)return;
    if(s.layout==='split'&&host){host.innerHTML='<img alt="'+esc(s.mediaAlt||s.title||'Generated slide visual')+'">';host.classList.add('v66-media-host');$('img',host).src=u;return}
    if(s.layout==='hero'){canvas.classList.add('v66-has-media');const wrap=document.createElement('div');wrap.className='v66-media-wrap';const img=document.createElement('img');img.src=u;img.alt=s.mediaAlt||s.title||'Generated slide visual';wrap.appendChild(img);canvas.appendChild(wrap)}
  }
  async function sync(){
    const d=deck();if(!d||!$('#v57-deck.open'))return;ensurePanel();const s=slide();if(!s)return;
    const src=$('#v66-slide-ai .v66-source-edit');if(src&&document.activeElement!==src)src.value=(s.sourceRefs||[]).join('\n');
    $$('#v57-deck .v57-slide').forEach(c=>decorateCanvas(c,s));const p=$('#v57-present.open .v57-slide');if(p)decorateCanvas(p,s);
  }
  async function rawDataURL(blob){return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=()=>reject(r.error);r.readAsDataURL(blob)})}
  async function assetDataURL(key){
    const a=await getAsset(key);if(!a?.blob)return'';
    try{
      if(a.blob.size<650000)return await rawDataURL(a.blob);
      const bmp=await createImageBitmap(a.blob),maxW=1280,maxH=720,scale=Math.min(1,maxW/bmp.width,maxH/bmp.height),w=Math.max(1,Math.round(bmp.width*scale)),h=Math.max(1,Math.round(bmp.height*scale));
      const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.drawImage(bmp,0,0,w,h);bmp.close?.();return canvas.toDataURL('image/jpeg',.84);
    }catch{return await rawDataURL(a.blob)}
  }
  async function collectDeckMedia(d=deck()){const out={};if(!d)return out;for(const s of d.slides||[]){if(s.mediaKey){const data=await assetDataURL(s.mediaKey);if(data)out[s.id]=data}}return out}
  window.__SCHOLARK_V66_MEDIA__={getDataURL:assetDataURL,collectDeckMedia,remove:delAsset};

  const obs=new MutationObserver(()=>{clearTimeout(window.__v66sync);window.__v66sync=setTimeout(sync,55)});obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  document.addEventListener('click',e=>{if(e.target.closest?.('#v57-deck,#v57-present'))setTimeout(sync,25)},true);
  addEventListener('keydown',()=>setTimeout(sync,20));setTimeout(sync,300);
})();