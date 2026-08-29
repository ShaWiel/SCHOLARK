(() => {
  if(window.__SCHOLARK_V77_WEBPAGE_PRO__)return;
  window.__SCHOLARK_V77_WEBPAGE_PRO__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const api=()=>window.__SCHOLARK_V58_ARTIFACTS__;
  const THEMES={
    midnight:{bg:'#10131c',panel:'#171b27',ink:'#ffffff',muted:'#b8becc',accent:'#c9ff6a',accent2:'#7667ff',font:'Inter,Arial,sans-serif'},
    editorial:{bg:'#f5f1e8',panel:'#fffdf8',ink:'#17191f',muted:'#746f6a',accent:'#6d5dfc',accent2:'#c9ff6a',font:'Georgia,serif'},
    cobalt:{bg:'#0a1f44',panel:'#102c5f',ink:'#ffffff',muted:'#c0d0ea',accent:'#8be8ff',accent2:'#c9ff6a',font:'Inter,Arial,sans-serif'},
    plum:{bg:'#24152f',panel:'#352044',ink:'#ffffff',muted:'#d8c4df',accent:'#ffb4db',accent2:'#c9ff6a',font:'Inter,Arial,sans-serif'},
    paper:{bg:'#f7f7f4',panel:'#ffffff',ink:'#17191f',muted:'#6d6974',accent:'#17191f',accent2:'#6d5dfc',font:'Inter,Arial,sans-serif'},
    academic:{bg:'#f4f0e6',panel:'#fffdfa',ink:'#18221d',muted:'#6d756f',accent:'#1f6b50',accent2:'#b28b46',font:'Georgia,serif'},
    luxury:{bg:'#0b0b0d',panel:'#171619',ink:'#f8f4ea',muted:'#b8b0a3',accent:'#d8b56b',accent2:'#7b6650',font:'Georgia,serif'},
    aurora:{bg:'#10152a',panel:'#171f39',ink:'#f5f8ff',muted:'#bcc8df',accent:'#74f3cf',accent2:'#a278ff',font:'Inter,Arial,sans-serif'},
    forest:{bg:'#10251d',panel:'#183429',ink:'#f5fbf6',muted:'#b8d0c1',accent:'#b7e86d',accent2:'#4ca982',font:'Inter,Arial,sans-serif'},
    terracotta:{bg:'#f4e7dc',panel:'#fff9f4',ink:'#35221d',muted:'#866f66',accent:'#c85e3d',accent2:'#e3a24d',font:'Georgia,serif'},
    mono:{bg:'#f4f4f4',panel:'#ffffff',ink:'#111111',muted:'#666666',accent:'#111111',accent2:'#a5a5a5',font:'Arial,sans-serif'}
  };
  let busy=false;
  const css=document.createElement('style');css.id='scholark-v77-style';css.textContent=`
    .v77-tools{margin-top:12px;padding-top:12px;border-top:1px solid #e3e4e8;display:grid;gap:7px}.v77-tools>label,.v77-group>label{font:900 8px Inter;color:#6e6975}.v77-devices{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.v77-device{border:0!important;border-radius:8px!important;background:#f0eff4!important;color:#56505d!important;padding:8px 4px!important;font:850 7px Inter!important}.v77-device.active{background:#17191f!important;color:#c9ff6a!important}.v77-group{display:grid;gap:5px}.v77-tools input,.v77-tools textarea{width:100%;box-sizing:border-box;border:1px solid #d9dbe1;background:#fafafa;border-radius:9px;padding:8px;font:650 8px/1.4 Inter;outline:0}.v77-tools textarea{resize:vertical;min-height:62px}.v77-pair{display:grid;grid-template-columns:1fr 1fr;gap:5px}.v77-btn{border:0!important;border-radius:9px!important;background:#17191f!important;color:#fff!important;padding:9px 7px!important;font:850 8px Inter!important;cursor:pointer}.v77-btn.alt{background:#eeecff!important;color:#5548c8!important}.v77-btn.warn{background:#fff4dd!important;color:#785100!important}.v77-btn:disabled{opacity:.5}.v77-status{min-height:12px;font:750 7.2px/1.4 Inter;color:#5d50d8}.v77-note{font:650 7px/1.35 Inter;color:#8b8591}.v77-preview-tablet .v58-web{width:768px!important;max-width:none!important}.v77-preview-mobile .v58-web{width:390px!important;max-width:none!important}.v77-preview-tablet .v58-web-cards,.v77-preview-tablet .v58-web-stats{grid-template-columns:repeat(2,1fr)!important}.v77-preview-mobile .v58-web-hero,.v77-preview-mobile .v58-web-split{grid-template-columns:1fr!important}.v77-preview-mobile .v58-web-cards,.v77-preview-mobile .v58-web-stats{grid-template-columns:1fr!important}.v77-preview-mobile .v58-webnav .v58-links{display:none!important}.v77-preview-mobile .v58-web-section{padding:12% 7%!important}.v77-preview-mobile .v58-web h1{font-size:42px!important}.v77-preview-mobile .v58-web h2{font-size:34px!important}.v77-preview-mobile .v58-web-art{min-height:220px!important}.v77-web-image{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;z-index:2!important}.v58-web-art.v77-image:before,.v58-web-art.v77-image:after{display:none!important}.v77-split-image{width:100%;aspect-ratio:4/3;border-radius:18px;object-fit:cover;display:block;margin-bottom:12px}.v77-web-link{color:inherit;text-decoration:none}.v77-web-link:hover{text-decoration:underline}.v77-editor-cta{cursor:default!important}.v77-image-badge{position:absolute;right:12px;top:12px;z-index:4;padding:5px 7px;border-radius:999px;background:rgba(0,0,0,.58);color:#fff;font:800 7px Inter;backdrop-filter:blur(8px)}
  `;document.head.appendChild(css);

  function artifact(){return api()?.get?.()||null}
  function isWeb(){return api()?.getMode?.()==='webpage'&&!!artifact()}
  function idx(){return Number(api()?.getIndex?.()||0)}
  function item(){return artifact()?.items?.[idx()]||null}
  function defaultNav(a){return (a?.items||[]).slice(0,3).map((x,i)=>({label:clean(x.title).slice(0,24)||('Section '+(i+1)),href:'#section-'+x.id}))}
  function settings(){
    const a=artifact();if(!a)return{};
    a.webSettings=a.webSettings||{};const s=a.webSettings;
    if(!s.seoTitle)s.seoTitle=a.name||'SCHOLARK webpage';
    if(!s.seoDescription)s.seoDescription=clean(a.summary||a.topic||a.prompt).slice(0,160);
    if(!Array.isArray(s.navLinks)||!s.navLinks.length)s.navLinks=defaultNav(a);
    if(!s.primaryCta)s.primaryCta={label:a.cta||'Get started',href:'#contact'};
    if(!s.secondaryCta)s.secondaryCta={label:'Explore',href:'#section-'+(a.items?.[1]?.id||a.items?.[0]?.id||'top')};
    if(!s.preview)s.preview='desktop';
    return s;
  }
  function safeHref(v){const x=clean(v);if(/^#[A-Za-z0-9_-]+$/.test(x))return x;if(/^https?:\/\//i.test(x)||/^mailto:/i.test(x)||/^tel:/i.test(x))return x;return'#'}
  function save(){api()?.save?.()}
  function setStatus(t,err=false){const e=$('#v77-tools .v77-status');if(e){e.textContent=t||'';e.style.color=err?'#a33b3b':'#5d50d8'}}
  function setBusy(on){busy=on;$$('#v77-tools button').forEach(b=>b.disabled=on)}

  function ensure(){
    const panel=$('#v58-suite.open .v58-panel');if(!panel)return;let box=$('#v77-tools',panel);
    if(!isWeb()){box?.remove();document.querySelector('#v58-suite')?.classList.remove('v77-preview-tablet','v77-preview-mobile');return}
    const s=settings();
    if(box){syncControls();return}
    box=document.createElement('div');box.id='v77-tools';box.className='v77-tools';
    box.innerHTML='<label>Webpage Pro</label><div class="v77-devices"><button class="v77-device" data-v77-device="desktop">Desktop</button><button class="v77-device" data-v77-device="tablet">Tablet</button><button class="v77-device" data-v77-device="mobile">Mobile</button></div><div class="v77-group"><label>SEO title</label><input class="v77-seo-title" maxlength="70"><label>Meta description</label><textarea class="v77-seo-desc" maxlength="180"></textarea></div><div class="v77-group"><label>Navigation · one per line: Label | URL/#section</label><textarea class="v77-nav"></textarea></div><div class="v77-group"><label>Primary CTA</label><div class="v77-pair"><input class="v77-cta-label" placeholder="Button label"><input class="v77-cta-href" placeholder="#contact or https://…"></div></div><div class="v77-group"><label>AI edit selected section</label><textarea class="v77-ai-prompt" placeholder="e.g. Make this section more persuasive, simplify it, turn it into stats, or add stronger evidence"></textarea><button class="v77-btn v77-ai">Apply AI to section</button></div><div class="v77-pair"><button class="v77-btn alt v77-gen-img">Generate image</button><button class="v77-btn alt v77-upload-img">Upload image</button></div><button class="v77-btn warn v77-remove-img">Remove section image</button><div class="v77-note">Image generation uses provider credits only when you click Generate image.</div><div class="v77-status"></div>';
    panel.appendChild(box);
    $$('[data-v77-device]',box).forEach(b=>b.onclick=()=>{settings().preview=b.dataset.v77Device;applyPreview();save();syncControls()});
    $('.v77-seo-title',box).addEventListener('input',e=>{settings().seoTitle=clean(e.target.value).slice(0,70);debouncedSave()});
    $('.v77-seo-desc',box).addEventListener('input',e=>{settings().seoDescription=String(e.target.value||'').trim().slice(0,180);debouncedSave()});
    $('.v77-nav',box).addEventListener('input',e=>{settings().navLinks=String(e.target.value||'').split(/\n+/).map(line=>{const p=line.split('|');return{label:clean(p[0]).slice(0,28),href:safeHref(p.slice(1).join('|'))}}).filter(x=>x.label).slice(0,6);debouncedSave();decorate()});
    $('.v77-cta-label',box).addEventListener('input',e=>{settings().primaryCta.label=clean(e.target.value).slice(0,32);debouncedSave();decorate()});
    $('.v77-cta-href',box).addEventListener('input',e=>{settings().primaryCta.href=safeHref(e.target.value);debouncedSave()});
    $('.v77-ai',box).onclick=editSectionAI;$('.v77-gen-img',box).onclick=generateImage;$('.v77-upload-img',box).onclick=uploadImage;$('.v77-remove-img',box).onclick=removeImage;
    syncControls();
  }
  function debouncedSave(){clearTimeout(window.__v77save);window.__v77save=setTimeout(save,260)}
  function syncControls(){
    if(!isWeb())return;const s=settings(),box=$('#v77-tools');if(!box)return;
    $$('.v77-device',box).forEach(b=>b.classList.toggle('active',b.dataset.v77Device===s.preview));
    const vals=[['.v77-seo-title',s.seoTitle],['.v77-seo-desc',s.seoDescription],['.v77-nav',(s.navLinks||[]).map(x=>x.label+' | '+x.href).join('\n')],['.v77-cta-label',s.primaryCta?.label||''],['.v77-cta-href',s.primaryCta?.href||'']];
    vals.forEach(([sel,val])=>{const el=$(sel,box);if(el&&document.activeElement!==el)el.value=val||''});applyPreview();
  }
  function applyPreview(){const root=$('#v58-suite');if(!root)return;const p=settings().preview;root.classList.toggle('v77-preview-tablet',p==='tablet');root.classList.toggle('v77-preview-mobile',p==='mobile')}

  function decorate(){
    if(!isWeb())return;const a=artifact(),s=settings(),web=$('#v58-suite .v58-web');if(!web)return;
    const links=$('.v58-links',web);if(links)links.innerHTML=(s.navLinks||[]).map(n=>'<a class="v77-web-link" href="'+esc(safeHref(n.href))+'">'+esc(n.label)+'</a>').join('');
    const actions=$$('.v58-web-actions',web);if(actions[0]){const spans=$$('span',actions[0]);if(spans[0]){spans[0].textContent=s.primaryCta?.label||'Get started';spans[0].classList.add('v77-editor-cta')}if(spans[1]){spans[1].textContent=s.secondaryCta?.label||'Explore';spans[1].classList.add('v77-editor-cta')}}
    (a.items||[]).forEach((x,i)=>{const sec=$('.v58-web-section[data-index="'+i+'"]',web);if(!sec)return;sec.id='section-'+x.id;sec.querySelectorAll('.v77-web-image,.v77-split-image,.v77-image-badge').forEach(n=>n.remove());const art=$('.v58-web-art',sec);if(art)art.classList.remove('v77-image');if(!x.webImageData)return;if(art){const im=document.createElement('img');im.className='v77-web-image';im.src=x.webImageData;im.alt=x.webImageAlt||x.title||'';art.classList.add('v77-image');art.appendChild(im);const badge=document.createElement('span');badge.className='v77-image-badge';badge.textContent='Section image';art.appendChild(badge)}else if(x.type==='split'){const side=$('.v58-web-side',sec);if(side){const im=document.createElement('img');im.className='v77-split-image';im.src=x.webImageData;im.alt=x.webImageAlt||x.title||'';side.prepend(im)}}});
  }

  function mapSection(sec,current){
    const layout=clean(sec?.layoutHint).toLowerCase();let type=current?.type||'cards';
    for(const k of ['hero','split','stats','quote','faq','cta','cards'])if(layout.includes(k))type=k;
    const points=Array.isArray(sec?.points)?sec.points:[];const items=points.length?points.slice(0,4).map(p=>({title:clean(p?.heading||p?.detail),detail:clean(p?.detail),value:clean(p?.value)})):(sec?.bullets||[]).slice(0,4).map(b=>({title:clean(b),detail:'',value:''}));
    return {...current,type,title:clean(sec?.title)||current?.title||'',body:clean(sec?.body||sec?.subtitle)||current?.body||'',items,visualType:clean(sec?.visualType),visualBrief:clean(sec?.visualBrief),sourceRefs:Array.isArray(sec?.sourceRefs)?sec.sourceRefs.filter(Boolean):(current?.sourceRefs||[])};
  }
  async function editSectionAI(){
    if(busy)return;const a=artifact(),x=item(),instruction=clean($('#v77-tools .v77-ai-prompt')?.value);if(!a||!x)return;if(!instruction){$('#v77-tools .v77-ai-prompt')?.focus();return}setBusy(true);setStatus('SCHOLARK is rewriting this section…');
    try{const p='EDIT REQUEST: '+instruction+'\nPAGE: '+clean(a.name)+'\nCURRENT SECTION: '+JSON.stringify({type:x.type,title:x.title,body:x.body,items:x.items,visualType:x.visualType,visualBrief:x.visualBrief,sourceRefs:x.sourceRefs})+'\nReturn the finished replacement section only.';const r=await fetch('/api/studio/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'webpage_section_edit',prompt:p,count:1,settings:{strict:true,visuals:true}})});const d=await r.json().catch(()=>({}));if(!r.ok||!d?.ok||!d?.artifact?.sections?.[0])throw new Error(d?.error||'Section AI edit failed');api()?.updateItem?.(idx(),mapSection(d.artifact.sections[0],x));const q=$('#v77-tools .v77-ai-prompt');if(q)q.value='';setStatus('Section updated with AI.');setTimeout(sync,60)}catch(e){setStatus('AI edit failed: '+clean(e?.message||e),true)}finally{setBusy(false)}
  }

  async function imageToData(blob){
    const bmp=await createImageBitmap(blob),maxW=1200,maxH=800,scale=Math.min(1,maxW/bmp.width,maxH/bmp.height),w=Math.max(1,Math.round(bmp.width*scale)),h=Math.max(1,Math.round(bmp.height*scale)),c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.drawImage(bmp,0,0,w,h);bmp.close?.();let q=.82,data=c.toDataURL('image/jpeg',q);while(data.length>620000&&q>.55){q-=.08;data=c.toDataURL('image/jpeg',q)}return data;
  }
  async function generateImage(){
    if(busy)return;const a=artifact(),x=item();if(!a||!x)return;setBusy(true);setStatus('Generating section image…');
    try{const prompt=['Premium editorial website image.','Website: '+clean(a.name)+'.','Section: '+clean(x.title)+'.','Context: '+clean(x.body)+'.','Visual direction: '+clean(x.visualBrief||x.visualType||'professional relevant visual')+'.','No text, no logo, no watermark, no UI screenshot.','Strong focal composition with useful negative space.','Landscape 3:2 composition.'].join(' ');const r=await fetch('/api/studio/image',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt,width:1200,height:800})});if(!r.ok){let d={};try{d=await r.json()}catch{}throw new Error(d?.error||('Image generation failed ('+r.status+')'))}const data=await imageToData(await r.blob());api()?.updateItem?.(idx(),{webImageData:data,webImageAlt:clean(x.visualBrief||x.title),webImageModel:r.headers.get('x-scholark-image-model')||'image-ai'});setStatus('Section image generated.');setTimeout(sync,60)}catch(e){setStatus('Image failed: '+clean(e?.message||e),true)}finally{setBusy(false)}
  }
  function uploadImage(){const inp=document.createElement('input');inp.type='file';inp.accept='image/png,image/jpeg,image/webp';inp.onchange=async()=>{const f=inp.files?.[0];if(!f)return;if(f.size>5*1024*1024){setStatus('Use an image smaller than 5 MB.',true);return}setBusy(true);try{const data=await imageToData(f);api()?.updateItem?.(idx(),{webImageData:data,webImageAlt:clean(item()?.title),webImageModel:'upload'});setStatus('Image uploaded and optimized.');setTimeout(sync,60)}catch(e){setStatus('Could not read image: '+clean(e?.message||e),true)}finally{setBusy(false)}};inp.click()}
  function removeImage(){const x=item();if(!x?.webImageData){setStatus('This section has no image.');return}api()?.updateItem?.(idx(),{webImageData:'',webImageAlt:'',webImageModel:''});setStatus('Section image removed.');setTimeout(sync,50)}

  function webItems(x){return (x.items||[]).map(v=>v&&typeof v==='object'?{title:clean(v.title||v.heading||v.detail),detail:clean(v.detail),value:clean(v.value)}:{title:clean(v),detail:'',value:''})}
  function sectionHTML(x,i,a,s){
    const id='section-'+esc(x.id||String(i+1)),k='<div class="kicker">'+esc(x.type||'section')+'</div>',title='<h2>'+esc(x.title)+'</h2>',body='<p>'+esc(x.body)+'</p>',img=x.webImageData?'<img class="section-image" src="'+esc(x.webImageData)+'" alt="'+esc(x.webImageAlt||x.title)+'" loading="lazy">':'';
    if(x.type==='hero')return '<section class="section hero" id="'+id+'"><div><div class="kicker">WELCOME</div><h1>'+esc(x.title)+'</h1><p>'+esc(x.body)+'</p><div class="actions"><a class="primary" href="'+esc(safeHref(s.primaryCta?.href))+'">'+esc(s.primaryCta?.label||'Get started')+'</a><a href="'+esc(safeHref(s.secondaryCta?.href))+'">'+esc(s.secondaryCta?.label||'Explore')+'</a></div></div><div class="hero-art '+(x.webImageData?'has-image':'')+'">'+(x.webImageData?'<img src="'+esc(x.webImageData)+'" alt="'+esc(x.webImageAlt||x.title)+'">':'')+'</div></section>';
    if(x.type==='cards'||x.type==='faq'){const cards=webItems(x).map(v=>'<article class="card"><b>'+esc(v.title)+'</b>'+(v.detail?'<span>'+esc(v.detail)+'</span>':'')+'</article>').join('');return '<section class="section" id="'+id+'">'+k+title+body+'<div class="cards">'+cards+'</div></section>'}
    if(x.type==='stats'){const stats=webItems(x).map((v,j)=>'<article class="stat"><strong>'+esc(v.value||String(j+1).padStart(2,'0'))+'</strong><b>'+esc(v.title)+'</b>'+(v.detail?'<span>'+esc(v.detail)+'</span>':'')+'</article>').join('');return '<section class="section" id="'+id+'">'+k+title+body+'<div class="stats">'+stats+'</div></section>'}
    if(x.type==='split'){const rows=webItems(x).map(v=>'<div class="side-row"><b>'+esc(v.title)+'</b><span>'+esc(v.detail||v.value)+'</span></div>').join('');return '<section class="section" id="'+id+'"><div class="split"><div>'+k+title+body+'</div><aside class="side">'+img+rows+'</aside></div></section>'}
    if(x.type==='quote')return '<section class="section quote" id="'+id+'">“'+esc(x.title)+'”'+(x.body?'<p>'+esc(x.body)+'</p>':'')+'</section>';
    if(x.type==='cta')return '<section class="section" id="'+id+'"><div class="cta">'+k+title+body+'<div class="actions"><a class="primary" href="'+esc(safeHref(s.primaryCta?.href))+'">'+esc(s.primaryCta?.label||'Take action')+' →</a></div></div></section>';
    return '<section class="section" id="'+id+'">'+k+title+body+img+'</section>';
  }
  function standaloneHTML(){
    const a=artifact();if(!a)return'';const s=settings(),t=THEMES[a.theme]||THEMES.midnight,nav=(s.navLinks||[]).map(n=>'<a href="'+esc(safeHref(n.href))+'">'+esc(n.label)+'</a>').join(''),sections=(a.items||[]).map((x,i)=>sectionHTML(x,i,a,s)).join('');
    const title=esc(s.seoTitle||a.name),desc=esc(s.seoDescription||a.topic||'');
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title><meta name="description" content="'+desc+'"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+desc+'"><meta property="og:type" content="website"><style>:root{--bg:'+t.bg+';--panel:'+t.panel+';--ink:'+t.ink+';--muted:'+t.muted+';--accent:'+t.accent+';--accent2:'+t.accent2+'}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:'+t.font+'}.site{max-width:1440px;margin:0 auto}.nav{height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 6%;border-bottom:1px solid color-mix(in srgb,var(--ink) 10%,transparent);position:sticky;top:0;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(14px);z-index:20}.brand{font-weight:950;font-size:17px}.brand i{color:var(--accent);font-style:normal}.links{display:flex;gap:22px}.links a{color:var(--muted);text-decoration:none;font-size:13px;font-weight:750}.links a:hover{color:var(--ink)}.section{padding:7% 6%;border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent)}.kicker{font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:900;color:var(--accent)}h1,h2{font-size:clamp(40px,6vw,82px);line-height:.94;letter-spacing:-.055em;margin:12px 0 16px;max-width:950px}h2{font-size:clamp(30px,4.2vw,58px)}p{font-size:clamp(15px,1.4vw,19px);line-height:1.65;color:var(--muted);max-width:780px}.hero{min-height:72vh;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:6%;align-items:center}.hero-art{min-height:420px;border-radius:32px;overflow:hidden;position:relative;background:linear-gradient(145deg,color-mix(in srgb,var(--panel) 82%,var(--accent2)),var(--panel));box-shadow:0 25px 70px rgba(0,0,0,.16)}.hero-art:before{content:"";position:absolute;width:80%;aspect-ratio:1;border-radius:34% 66% 60% 40%;right:-20%;top:-15%;background:linear-gradient(135deg,var(--accent),var(--accent2));transform:rotate(22deg)}.hero-art.has-image:before{display:none}.hero-art img,.section-image{width:100%;height:100%;object-fit:cover;display:block}.section-image{aspect-ratio:4/3;border-radius:20px;margin:12px 0}.actions{display:flex;gap:10px;margin-top:28px;flex-wrap:wrap}.actions a{padding:12px 16px;border-radius:11px;background:var(--panel);color:var(--ink);text-decoration:none;font-weight:900}.actions .primary{background:var(--accent);color:#151821}.cards,.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:30px}.card,.stat,.side{background:var(--panel);border:1px solid color-mix(in srgb,var(--ink) 9%,transparent);border-radius:20px;padding:24px}.card b,.stat b,.side-row b{display:block;font-size:18px}.card span,.stat span,.side-row span{display:block;color:var(--muted);font-size:14px;line-height:1.5;margin-top:7px}.stat strong{display:block;color:var(--accent);font-size:42px}.split{display:grid;grid-template-columns:1fr 1fr;gap:6%;align-items:center}.side-row{padding:14px 0;border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent)}.side-row:last-child{border-bottom:0}.quote{font-size:clamp(40px,6vw,80px);font-weight:950;letter-spacing:-.05em;line-height:1}.quote p{font-size:16px;letter-spacing:0}.cta{padding:6%;border-radius:28px;background:linear-gradient(135deg,var(--accent2),color-mix(in srgb,var(--accent) 50%,var(--accent2)));color:#fff}.cta p{color:rgba(255,255,255,.82)}@media(max-width:800px){.hero,.split{grid-template-columns:1fr}.hero{min-height:auto}.hero-art{min-height:300px}.cards,.stats{grid-template-columns:1fr 1fr}.section{padding:10% 6%}}@media(max-width:560px){.links{display:none}.cards,.stats{grid-template-columns:1fr}.section{padding:14% 7%}h1{font-size:44px}h2{font-size:36px}.hero-art{min-height:230px}}</style></head><body><main class="site"><nav class="nav"><div class="brand">'+esc(a.name)+'<i>.</i></div><div class="links">'+nav+'</div></nav>'+sections+'</main></body></html>';
  }

  function installAPI(){const a=api();if(!a)return;a.getStandaloneHTML=()=>isWeb()?standaloneHTML():'';a.getWebSettings=()=>isWeb()?settings():null}
  function sync(){if(!$('#v58-suite.open'))return;installAPI();ensure();if(isWeb()){applyPreview();decorate()}}
  document.addEventListener('click',e=>{if(e.target.closest?.('#v58-suite'))setTimeout(sync,45)},true);
  addEventListener('hashchange',()=>setTimeout(sync,150));[360,950].forEach(ms=>setTimeout(sync,ms));
})();