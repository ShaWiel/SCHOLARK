(() => {
  if (window.__SCHOLARK_V59_STUDIO_AI__) return;
  window.__SCHOLARK_V59_STUDIO_AI__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const cut=(s,n)=>{s=clean(s);return s.length>n?s.slice(0,n-1).trimEnd()+'…':s};
  const uid=()=>Math.random().toString(36).slice(2,9);
  const MODES=['presentation','webpage','document','social','graphic'];
  const META=/^(core argument|evidence( and analysis)?|comparison\s*\/\s*counterargument|supporting insight|what to notice|verified figure|section\s*\d+|use this slide)/i;

  const style=document.createElement('style');
  style.id='scholark-v59-quality-style';
  style.textContent=`
    .v41-quality,.v51-quality,.v52-pill{display:none!important}
    #v59-generating{position:fixed;z-index:2147483646;inset:0;background:rgba(12,14,20,.84);backdrop-filter:blur(11px);display:none;place-items:center;font-family:Inter,system-ui,sans-serif;padding:20px}
    #v59-generating.open{display:grid}.v59-box{width:min(500px,92vw);border-radius:24px;background:#171a23;color:#fff;padding:28px;box-shadow:0 30px 90px rgba(0,0,0,.4)}.v59-box small{font:900 8px Inter;letter-spacing:.16em;color:#c9ff6a}.v59-box h3{font:950 25px/1 Inter;margin:8px 0 9px;letter-spacing:-.035em}.v59-box p{font:600 10px/1.55 Inter;color:#b9bdc7;margin:0}.v59-bar{height:5px;background:#292e3b;border-radius:99px;overflow:hidden;margin-top:18px}.v59-bar:after{content:'';display:block;height:100%;width:44%;background:#c9ff6a;border-radius:99px;animation:v59move 1.05s ease-in-out infinite alternate}@keyframes v59move{from{transform:translateX(-15%)}to{transform:translateX(150%)}}
    #v59-generating.error .v59-bar{display:none}#v59-generating.error .v59-box small{color:#ffb4b4}#v59-generating.error .v59-box h3{font-size:22px}.v59-close{display:none;margin-top:18px;border:0;border-radius:11px;background:#c9ff6a;color:#151821;padding:10px 14px;font:900 9px Inter;cursor:pointer}#v59-generating.error .v59-close{display:inline-block}
  `;
  document.head.appendChild(style);

  const loader=document.createElement('div');loader.id='v59-generating';loader.innerHTML='<div class="v59-box"><small>SCHOLARK STUDIO AI</small><h3>Building the finished output…</h3><p class="v59-message">Researching, reasoning, fact-checking, writing and structuring the final first draft before it enters the editor.</p><div class="v59-bar"></div><button class="v59-close" type="button">Back to Studio</button></div>';document.body.appendChild(loader);
  $('.v59-close',loader).onclick=()=>{loader.classList.remove('open','error')};

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
      research:checked('v41-citations')||checked('v41-sources'),
      factCheck:true,
      visualReasoning:true,
      finalPolish:true,
      references:[...($('#v41-files',studio())?.files||[])].map(f=>({name:f.name,type:f.type,size:f.size})),
      referenceText:(window.__SCHOLARK_V45_BRIEF__?.getReferences?.()||[]).slice(0,6).map(r=>({name:r.name,text:String(r.text||'').slice(0,40000)})),
      settings:{
        ratio:val('v41-ratio'),webType:val('v41-webtype'),documentType:val('v41-doctype'),citationStyle:val('v41-cite'),platform:val('v41-platform'),socialFormat:val('v41-socialformat'),graphicType:val('v41-graphictype'),seo:checked('v41-seo'),cta:checked('v41-cta')
      }
    };
  }

  function creditFeature(m){
    const count=Math.max(1,Number(val('v41-count'))||10),research=checked('v41-citations')||checked('v41-sources');
    if(m==='presentation')return count>30||research?'premium_presentation':'presentation';
    if(m==='document')return count>25?'long_report':'document';
    return ({webpage:'webpage',social:'social',graphic:'graphic'}[m]||'document');
  }
  async function askEngine(m){
    const r=await fetch('/api/studio/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload(m))});
    const data=await r.json().catch(()=>({}));
    if(!r.ok||!data?.ok||!data?.artifact){const e=new Error(data?.error||'Studio AI engine unavailable');e.code=data?.code;e.status=r.status;throw e}
    return data;
  }

  function pointItems(sec,limit){
    const pts=Array.isArray(sec.points)?sec.points.filter(x=>x&&(x.heading||x.detail||x.value)):[];
    if(pts.length)return pts.slice(0,limit).map((p,j)=>[clean(p.value)||String(j+1).padStart(2,'0'),cut(p.heading||`Point ${j+1}`,70),cut(p.detail||'',150)]);
    return (sec.bullets||[]).filter(Boolean).slice(0,limit).map((b,j)=>[String(j+1).padStart(2,'0'),cut(b,72),'']);
  }

  function safeTitle(sec,i){
    let t=cut(sec.title,64);
    if(!t||META.test(t))t=cut(sec.subtitle||sec.body||`Slide ${i+1}`,64);
    return t||`Slide ${i+1}`;
  }

  function slideFrom(sec,i,total){
    let layout=sec.layoutHint||'cards';
    if(!['hero','split','cards','timeline','compare','stats','quote','statement','grid','closing'].includes(layout))layout='cards';
    if(i===0)layout='hero';
    if(i===total-1&&!['quote','statement'].includes(layout))layout='closing';
    const limit=layout==='timeline'?4:layout==='compare'?2:layout==='stats'?3:layout==='grid'?4:3;
    let items=pointItems(sec,limit);
    if(layout==='compare'&&items.length<2){const b=(sec.bullets||[]).filter(Boolean);items=[['A',cut(b[0]||'Perspective A',60),cut(sec.body,140)],['B',cut(b[1]||'Perspective B',60),cut(sec.subtitle||sec.body,140)]]}
    if(layout==='stats'){items=items.map((x,j)=>[x[0]&&x[0]!=='0'+(j+1)?cut(x[0],18):'—',cut(x[1],58),cut(x[2],95)])}
    if(layout==='hero')items=[];
    return {
      id:uid(),layout,
      kicker:cut(sec.label||'',28),
      title:safeTitle(sec,i),
      subtitle:cut(sec.subtitle||sec.body,185),
      items,
      speakerNotes:clean(sec.speakerNotes),
      visualType:clean(sec.visualType),
      visualBrief:clean(sec.visualBrief),
      sourceRefs:Array.isArray(sec.sourceRefs)?sec.sourceRefs.filter(Boolean):[]
    };
  }

  function openPresentation(ai){
    const a=ai.artifact,sections=(a.sections||[]).filter(x=>x?.title||x?.body);
    if(!sections.length)throw new Error('AI engine returned no presentation slides');
    const slides=sections.map((s,i)=>slideFrom(s,i,sections.length));
    const deck={id:uid(),name:cut(val('v41-project-name')||a.title||'Untitled presentation',80),prompt:payload('presentation').prompt,theme:'midnight',createdAt:Date.now(),updatedAt:Date.now(),slides,sources:a.sources||[],ai:{provider:ai.provider,model:ai.model}};
    window.__SCHOLARK_V57_PRESENTATIONS__?.open?.(deck);
  }

  function mapItems(m,a){
    const sections=(a.sections||[]).filter(x=>x?.title||x?.body);
    if(m==='webpage')return sections.map((s,i)=>({id:uid(),type:i===0?'hero':i===sections.length-1?'cta':s.layoutHint==='stats'?'stats':s.layoutHint==='split'?'split':s.layoutHint==='quote'?'quote':'cards',title:cut(s.title,90),body:clean(s.body||s.subtitle),items:(s.points?.length?s.points.map(p=>({title:clean(p.heading||p.detail),detail:clean(p.detail),value:clean(p.value)})):(s.bullets||[]).map(b=>({title:clean(b),detail:'',value:''}))).slice(0,4),visualType:clean(s.visualType),visualBrief:clean(s.visualBrief),sourceRefs:s.sourceRefs||[]}));
    if(m==='document')return sections.map(s=>({id:uid(),type:'section',title:cut(s.title,100),body:[clean(s.body),...(s.bullets||[]).map(x=>clean(x)).filter(Boolean)],sourceRefs:s.sourceRefs||[]}));
    if(m==='social')return sections.map((s,i)=>({id:uid(),type:i===0?'hook':i===sections.length-1?'cta':s.layoutHint==='stats'?'proof':'insight',title:cut(s.title,90),body:clean(s.body||s.subtitle),caption:clean(a.caption||s.body),tags:(a.hashtags||[]).map(x=>String(x).startsWith('#')?x:'#'+String(x).replace(/\s+/g,'')).join(' '),visualBrief:clean(s.visualBrief)}));
    return sections.length?sections.map(s=>({id:uid(),type:val('v41-graphictype')||'poster',title:cut(s.title,90),body:clean(s.body||s.subtitle),blocks:(s.points?.length?s.points.map(p=>[cut(p.value||p.heading,24),cut(p.detail||p.heading,100)]):(s.bullets||[]).map((x,j)=>[String(j+1).padStart(2,'0'),clean(x)])).slice(0,4),cta:clean(a.cta||'Learn more'),visualBrief:clean(s.visualBrief)})):[{id:uid(),type:'poster',title:cut(a.title,90),body:clean(a.summary),blocks:[],cta:clean(a.cta)}];
  }

  function openArtifact(m,ai){
    const api=window.__SCHOLARK_V58_ARTIFACTS__;if(!api?.open)throw new Error('Studio editor is unavailable');
    api.open(m);
    requestAnimationFrame(()=>{
      const x=api.get?.();if(!x)return;
      const a=ai.artifact;
      x.name=cut(val('v41-project-name')||a.title||x.name,90);
      x.topic=clean(a.title)||x.topic;
      x.prompt=payload(m).prompt;
      x.items=mapItems(m,a);
      x.sources=a.sources||[];
      x.cta=clean(a.cta);
      x.caption=clean(a.caption);
      x.hashtags=Array.isArray(a.hashtags)?a.hashtags.map(clean).filter(Boolean):[];
      x.summary=clean(a.summary);
      x.settings={...(x.settings||{}),...(payload(m).settings||{})};
      x.ai={provider:ai.provider,model:ai.model};
      const theme=$('.v58-theme');if(theme)theme.dispatchEvent(new Event('change',{bubbles:true}));
    });
  }

  function showError(err,status){
    const msg=err?.code==='AI_ENGINE_NOT_CONFIGURED'||err?.status===503
      ? 'The real Studio AI engine is not connected yet. Add a valid OPENAI_API_KEY in Render, save the environment variables and redeploy. SCHOLARK will not create a low-quality placeholder output instead.'
      : `Studio AI could not finish a presentation-ready result. ${clean(err?.message||'Please try again.')}`;
    if(status)status.textContent=msg;
    loader.classList.add('open','error');
    $('.v59-box h3',loader).textContent='Generation stopped — no fake fallback';
    $('.v59-message',loader).textContent=msg;
  }

  async function generate(m){
    const p=clean($('#v41-prompt',studio())?.value);if(!p){$('#v41-prompt',studio())?.focus();return}
    forceQuality();
    const status=$('#v41-status',studio());if(status)status.textContent='Researching and building the finished output…';
    loader.classList.remove('error');loader.classList.add('open');
    $('.v59-box h3',loader).textContent='Building the finished output…';
    $('.v59-message',loader).textContent='Researching, reasoning, fact-checking, writing and structuring the final first draft before it enters the editor.';
    try{
      const feature=creditFeature(m);await window.__SCHOLARK_CREDITS__?.authorize?.(feature);
      const ai=await askEngine(m);
      await window.__SCHOLARK_CREDITS__?.consume?.(feature,{mode:m,tier:ai.tier||'',provider:ai.provider||'',model:ai.model||''});
      if(m==='presentation')openPresentation(ai);else openArtifact(m,ai);
      if(status)status.textContent='Finished output generated · '+(ai.tier||'routed')+' tier · '+(ai.model||ai.provider||'AI')+'.';
      loader.classList.remove('open','error');
    }catch(err){
      console.error('[SCHOLARK Studio AI]',err);
      showError(err,status);
    }
  }

  window.addEventListener('click',e=>{
    const btn=e.target.closest?.('#v41-studio-workspace .v41-generate');if(!btn)return;
    const m=mode();if(!MODES.includes(m))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    generate(m);
  },true);

  const sync=()=>{forceQuality();$$('.v41-badge,.v51-badge').forEach(el=>{if(/highest ai quality|ai quality\s*[·:]?\s*max|deep quality pipeline/i.test(el.textContent||''))el.style.display='none'})};
  const v59root=document.getElementById('v41-studio-workspace');
  if(v59root)new MutationObserver(()=>{clearTimeout(window.__v59sync);window.__v59sync=setTimeout(sync,120)}).observe(v59root,{subtree:true,childList:true});
  setTimeout(sync,120);
  window.__SCHOLARK_V59_STUDIO_AI__={generate,health:()=>fetch('/api/studio/health').then(r=>r.json())};
})();
