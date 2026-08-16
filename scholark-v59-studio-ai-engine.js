(() => {
  if (window.__SCHOLARK_V59_STUDIO_AI__) return;
  window.__SCHOLARK_V59_STUDIO_AI__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const uid=()=>Math.random().toString(36).slice(2,9);
  const MODES=['presentation','webpage','document','social','graphic'];

  const style=document.createElement('style');
  style.id='scholark-v59-quality-style';
  style.textContent=`
    .v41-quality,.v51-quality,.v52-pill{display:none!important}
    #v59-generating{position:fixed;z-index:2147483646;inset:0;background:rgba(12,14,20,.82);backdrop-filter:blur(11px);display:none;place-items:center;font-family:Inter,system-ui,sans-serif}
    #v59-generating.open{display:grid}.v59-box{width:min(460px,88vw);border-radius:24px;background:#171a23;color:#fff;padding:28px;box-shadow:0 30px 90px rgba(0,0,0,.4)}.v59-box small{font:900 8px Inter;letter-spacing:.16em;color:#c9ff6a}.v59-box h3{font:950 25px/1 Inter;margin:8px 0 9px;letter-spacing:-.035em}.v59-box p{font:600 10px/1.5 Inter;color:#b9bdc7;margin:0}.v59-bar{height:5px;background:#292e3b;border-radius:99px;overflow:hidden;margin-top:18px}.v59-bar:after{content:'';display:block;height:100%;width:44%;background:#c9ff6a;border-radius:99px;animation:v59move 1.05s ease-in-out infinite alternate}@keyframes v59move{from{transform:translateX(-15%)}to{transform:translateX(150%)}}
  `;
  document.head.appendChild(style);

  const loader=document.createElement('div');loader.id='v59-generating';loader.innerHTML='<div class="v59-box"><small>SCHOLARK STUDIO AI</small><h3>Building your first draft…</h3><p>Researching, reasoning, writing and structuring the output before it enters the editor.</p><div class="v59-bar"></div></div>';document.body.appendChild(loader);

  function studio(){return $('#v41-studio-workspace')}
  function mode(){return $('.v41-mode.active',studio())?.dataset.mode||'presentation'}
  function val(id){return $('#'+id,studio())?.value||''}
  function checked(id){const x=$('#'+id,studio());return x?!!x.checked:true}
  function outline(){return $$('.v45-outline-input',studio()).map(x=>clean(x.value)).filter(Boolean)}

  function forceQuality(){
    try{
      localStorage.setItem('scholark_ai_quality','highest');
      localStorage.setItem('scholark_default_ai_quality','highest');
      localStorage.setItem('scholark_workspace_quality','highest');
    }catch{}
    const q=$('#v41-quality',studio());if(q&&[...q.options].some(o=>o.value==='highest'))q.value='highest';
    const depth=$('#v45-depth',studio());if(depth&&[...depth.options].some(o=>o.value==='expert'))depth.value='expert';
    ['v45-strict','v45-research','v45-factcheck','v45-visuals','v45-autopolish','v41-citations','v41-sources'].forEach(id=>{const e=$('#'+id,studio());if(e&&'checked'in e)e.checked=true});
    const qualityField=q?.closest('.v41-field');if(qualityField)qualityField.style.display='none';
  }

  function payload(m){
    return {
      mode:m,
      prompt:clean($('#v41-prompt',studio())?.value),
      count:parseInt(val('v41-count'),10)||undefined,
      level:localStorage.getItem('scholark_learning_level')||'student',
      language:val('v41-language')||'auto',
      audience:val('v41-audience'),
      style:val('v41-style')||'modern',
      purpose:val('v45-purpose'),
      outline:outline(),
      research:true,
      factCheck:true,
      visualReasoning:true,
      finalPolish:true,
      references:[...($('#v41-files',studio())?.files||[])].map(f=>({name:f.name,type:f.type,size:f.size})),
      settings:{
        ratio:val('v41-ratio'),webType:val('v41-webtype'),documentType:val('v41-doctype'),citationStyle:val('v41-cite'),platform:val('v41-platform'),socialFormat:val('v41-socialformat'),graphicType:val('v41-graphictype'),seo:checked('v41-seo'),cta:checked('v41-cta')
      }
    };
  }

  async function askEngine(m){
    const r=await fetch('/api/studio/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload(m))});
    const data=await r.json().catch(()=>({}));
    if(!r.ok||!data?.ok||!data?.artifact){const e=new Error(data?.error||'Studio AI engine unavailable');e.code=data?.code;e.status=r.status;throw e}
    return data;
  }

  function slideFrom(sec,i,total){
    let layout=sec.layoutHint||'cards';if(!['hero','split','cards','timeline','compare','stats','quote','statement','grid','closing'].includes(layout))layout='cards';
    if(i===0)layout='hero';if(i===total-1&&layout==='section')layout='closing';
    const bullets=(sec.bullets||[]).filter(Boolean);
    let items=bullets.slice(0,layout==='timeline'?4:layout==='compare'?2:layout==='stats'?3:4).map((b,j)=>[String(j+1).padStart(2,'0'),clean(b).slice(0,80),clean(sec.body).slice(0,180)]);
    if(layout==='stats')items=(bullets.length?bullets:['Key metric','Evidence','Impact']).slice(0,3).map((b,j)=>[j===0&&sec.stat?sec.stat:'—',clean(b).slice(0,70),clean(sec.label||'Verified evidence')]);
    if(layout==='compare'&&items.length<2)items=[['A','Perspective A',clean(sec.body)],['B','Perspective B',clean(bullets[0]||sec.body)]];
    return {id:uid(),layout,kicker:clean(sec.label||'SCHOLARK'),title:clean(sec.title),subtitle:clean(sec.body),items};
  }

  function openPresentation(ai){
    const a=ai.artifact,sections=(a.sections||[]).filter(x=>x?.title);
    const slides=sections.map((s,i)=>slideFrom(s,i,sections.length));
    if(!slides.length)return window.__SCHOLARK_V57_PRESENTATIONS__?.generate?.();
    const deck={id:uid(),name:clean(val('v41-project-name')||a.title)||'Untitled presentation',prompt:payload('presentation').prompt,theme:'midnight',createdAt:Date.now(),updatedAt:Date.now(),slides,sources:a.sources||[],ai:{provider:ai.provider,model:ai.model}};
    window.__SCHOLARK_V57_PRESENTATIONS__?.open?.(deck);
  }

  function mapItems(m,a){
    const sections=(a.sections||[]).filter(x=>x?.title);
    if(m==='webpage')return sections.map((s,i)=>({id:uid(),type:i===0?'hero':i===sections.length-1?'cta':s.layoutHint==='stats'?'stats':s.layoutHint==='split'?'split':'cards',title:clean(s.title),body:clean(s.body),items:(s.bullets||[]).slice(0,4).map(clean)}));
    if(m==='document')return sections.map(s=>({id:uid(),type:'section',title:clean(s.title),body:[clean(s.body),...(s.bullets||[]).map(x=>clean(x)).filter(Boolean)]}));
    if(m==='social')return sections.map((s,i)=>({id:uid(),type:i===0?'hook':i===sections.length-1?'cta':s.layoutHint==='stats'?'proof':'insight',title:clean(s.title),body:clean(s.body),caption:clean(a.caption||s.body),tags:(a.hashtags||[]).map(x=>String(x).startsWith('#')?x:'#'+String(x).replace(/\s+/g,'')).join(' ')}));
    return sections.length?sections.map((s,i)=>({id:uid(),type:val('v41-graphictype')||'poster',title:clean(s.title),body:clean(s.body),blocks:(s.bullets||[]).slice(0,4).map((x,j)=>[String(j+1).padStart(2,'0'),clean(x)]),cta:clean(a.cta||'Learn more')})):[{id:uid(),type:'poster',title:clean(a.title),body:clean(a.summary),blocks:[],cta:clean(a.cta)}];
  }

  function openArtifact(m,ai){
    const api=window.__SCHOLARK_V58_ARTIFACTS__;if(!api?.open)return;
    api.open(m);
    requestAnimationFrame(()=>{
      const x=api.get?.();if(!x)return;
      const a=ai.artifact;
      x.name=clean(val('v41-project-name')||a.title)||x.name;
      x.topic=clean(a.title)||x.topic;
      x.prompt=payload(m).prompt;
      x.items=mapItems(m,a);
      x.sources=a.sources||[];
      x.ai={provider:ai.provider,model:ai.model};
      const theme=$('.v58-theme');if(theme){theme.dispatchEvent(new Event('change',{bubbles:true}))}
    });
  }

  function localFallback(m,status){
    if(status)status.textContent='AI engine is not configured on the server; opening the local draft editor instead.';
    if(m==='presentation')window.__SCHOLARK_V57_PRESENTATIONS__?.generate?.();
    else window.__SCHOLARK_V58_ARTIFACTS__?.open?.(m);
  }

  async function generate(m){
    const p=clean($('#v41-prompt',studio())?.value);if(!p){$('#v41-prompt',studio())?.focus();return}
    forceQuality();
    const status=$('#v41-status',studio());if(status)status.textContent='Researching and building the complete output…';
    loader.classList.add('open');
    try{
      const ai=await askEngine(m);
      if(m==='presentation')openPresentation(ai);else openArtifact(m,ai);
      if(status)status.textContent='Generated and opened in the editor.';
    }catch(err){
      console.error('[SCHOLARK Studio AI]',err);
      localFallback(m,status);
    }finally{loader.classList.remove('open')}
  }

  window.addEventListener('click',e=>{
    const btn=e.target.closest?.('#v41-studio-workspace .v41-generate');if(!btn)return;
    const m=mode();if(!MODES.includes(m))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    generate(m);
  },true);

  const sync=()=>{forceQuality();$$('.v41-badge,.v51-badge').forEach(el=>{if(/highest ai quality|ai quality\s*[·:]?\s*max|deep quality pipeline/i.test(el.textContent||''))el.style.display='none'})};
  new MutationObserver(()=>{clearTimeout(window.__v59sync);window.__v59sync=setTimeout(sync,80)}).observe(document.documentElement,{subtree:true,childList:true});
  setTimeout(sync,80);
  window.__SCHOLARK_V59_STUDIO_AI__={generate,health:()=>fetch('/api/studio/health').then(r=>r.json())};
})();