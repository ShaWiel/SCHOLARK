(() => {
  if (window.__SCHOLARK_V58_ARTIFACT_SUITE__) return;
  window.__SCHOLARK_V58_ARTIFACT_SUITE__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const uid=()=>Math.random().toString(36).slice(2,9);
  const MODES=['webpage','document','social','graphic'];
  const state={mode:null,artifact:null,index:0,theme:'midnight'};

  const THEMES={
    midnight:{label:'Midnight Lime',bg:'#10131c',panel:'#171b27',ink:'#ffffff',muted:'#b8becc',accent:'#c9ff6a',accent2:'#7667ff'},
    editorial:{label:'Editorial',bg:'#f5f1e8',panel:'#fffdf8',ink:'#17191f',muted:'#746f6a',accent:'#6d5dfc',accent2:'#c9ff6a'},
    cobalt:{label:'Cobalt',bg:'#0a1f44',panel:'#102c5f',ink:'#ffffff',muted:'#c0d0ea',accent:'#8be8ff',accent2:'#c9ff6a'},
    plum:{label:'Plum',bg:'#24152f',panel:'#352044',ink:'#ffffff',muted:'#d8c4df',accent:'#ffb4db',accent2:'#c9ff6a'},
    paper:{label:'Paper',bg:'#f7f7f4',panel:'#ffffff',ink:'#17191f',muted:'#6d6974',accent:'#17191f',accent2:'#6d5dfc'}
  };

  const css=document.createElement('style');
  css.id='scholark-v58-style';
  css.textContent=`
    #v58-suite{position:fixed;z-index:2147483290;left:var(--v51-side,258px);top:0;right:0;bottom:0;background:#e9eaee;color:#17191f;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:none;grid-template-rows:58px 1fr;transition:left .16s ease}#v58-suite.open{display:grid}#v58-suite *{box-sizing:border-box}
    .v58-top{height:58px;background:#12151d;color:#fff;display:flex;align-items:center;gap:9px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.08)}.v58-top button{border:1px solid rgba(255,255,255,.12);background:#1d2230;color:#fff;border-radius:10px;padding:9px 11px;font:800 9px Inter;cursor:pointer}.v58-top button:hover{background:#292f40}.v58-top .primary{background:#c9ff6a;color:#14171e;border-color:#c9ff6a}.v58-name{flex:1;min-width:150px;max-width:360px;border:0;background:transparent;color:#fff;font:900 12px Inter;outline:0;padding:8px}.v58-mode-pill{padding:7px 9px;border-radius:999px;background:#272d3a;color:#c9ff6a;font:900 8px Inter;text-transform:uppercase}.v58-top select{border:1px solid rgba(255,255,255,.12);background:#1d2230;color:#fff;border-radius:10px;padding:9px 10px;font:800 9px Inter;outline:0}.v58-saved{font:750 8px Inter;color:#9da4b3;min-width:44px}
    .v58-work{min-height:0;display:grid;grid-template-columns:210px minmax(0,1fr) 245px}.v58-nav{background:#171b24;color:#fff;overflow:auto;padding:10px 8px;border-right:1px solid rgba(255,255,255,.07)}.v58-nav-title{padding:6px 8px 8px;color:#8f96a5;font:900 7.5px Inter;letter-spacing:.14em}.v58-nav-item{width:100%;border:0;background:transparent;color:#dfe3ec;text-align:left;border-radius:10px;padding:9px 9px;cursor:pointer;margin-bottom:4px}.v58-nav-item.active{background:rgba(201,255,106,.12);outline:1px solid rgba(201,255,106,.28)}.v58-nav-item small{display:block;color:#858d9d;font:750 7px Inter;margin-bottom:3px}.v58-nav-item b{display:block;font:850 9px/1.25 Inter;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v58-add{width:100%;border:1px dashed rgba(255,255,255,.2);background:transparent;color:#e1e4eb;border-radius:9px;padding:10px;font:850 8px Inter;cursor:pointer;margin-top:5px}
    .v58-stage{min-width:0;overflow:auto;padding:24px;background:radial-gradient(circle at 50% 18%,#fafafa,#e4e5e9)}.v58-panel{background:#fff;border-left:1px solid #d9dbe1;padding:12px;overflow:auto}.v58-panel h3{font:950 12px Inter;margin:4px 0 12px}.v58-field{margin-bottom:10px}.v58-field label{display:block;font:850 8px Inter;color:#6f6b76;margin-bottom:5px}.v58-field select,.v58-field input,.v58-field textarea{width:100%;border:1px solid #d9dbe1;background:#fafafa;border-radius:9px;padding:9px;font:750 9px Inter;outline:0}.v58-field textarea{min-height:70px;resize:vertical}.v58-pair{display:grid;grid-template-columns:1fr 1fr;gap:6px}.v58-panel button{width:100%;border:1px solid #d9dbe1;background:#fff;color:#17191f;border-radius:9px;padding:9px;font:850 8.5px Inter;cursor:pointer;margin-bottom:6px}.v58-panel button:hover{background:#f1f0f5}.v58-panel button.danger{color:#9a2e2e}.v58-help{padding:9px;border-radius:10px;background:#f3f1ff;color:#5b5275;font:650 8px/1.4 Inter;margin-top:7px}

    .v58-web{--bg:#10131c;--panel:#171b27;--ink:#fff;--muted:#b8becc;--accent:#c9ff6a;--accent2:#7667ff;width:min(1120px,100%);margin:0 auto;background:var(--bg);color:var(--ink);border-radius:13px;overflow:hidden;box-shadow:0 28px 70px rgba(18,20,30,.18)}.v58-webnav{height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 5%;border-bottom:1px solid color-mix(in srgb,var(--ink) 10%,transparent)}.v58-brand{font:950 15px Inter}.v58-brand span{color:var(--accent)}.v58-links{display:flex;gap:18px;font:750 8px Inter;color:var(--muted)}.v58-web-section{position:relative;padding:7% 6%;border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent)}.v58-web-section.selected{outline:3px solid color-mix(in srgb,var(--accent) 62%,transparent);outline-offset:-3px}.v58-web-kicker{font:900 8px Inter;letter-spacing:.15em;color:var(--accent);text-transform:uppercase}.v58-web h1,.v58-web h2{font:950 clamp(30px,5vw,68px)/.95 Inter;letter-spacing:-.055em;margin:10px 0 13px;max-width:820px}.v58-web h2{font-size:clamp(25px,3.6vw,49px)}.v58-web p{font:600 clamp(10px,1.2vw,15px)/1.55 Inter;color:var(--muted);max-width:760px}.v58-web-hero{min-height:520px;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(260px,.85fr);gap:5%;align-items:center;background:radial-gradient(circle at 82% 18%,color-mix(in srgb,var(--accent2) 24%,transparent),transparent 38%)}.v58-web-copy{position:relative;z-index:2}.v58-web-art{min-height:330px;position:relative;border-radius:30px;overflow:hidden;background:linear-gradient(145deg,color-mix(in srgb,var(--panel) 82%,var(--accent2)),var(--panel));border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);box-shadow:inset 0 1px rgba(255,255,255,.05)}.v58-web-art:before{content:'';position:absolute;width:78%;aspect-ratio:1;border-radius:34% 66% 60% 40%;right:-18%;top:-16%;background:linear-gradient(135deg,var(--accent),var(--accent2));transform:rotate(22deg);opacity:.95}.v58-web-art:after{content:'';position:absolute;width:46%;aspect-ratio:1;border-radius:50%;left:10%;bottom:8%;border:1px solid color-mix(in srgb,var(--ink) 22%,transparent);background:color-mix(in srgb,var(--bg) 42%,transparent);backdrop-filter:blur(9px)}.v58-web-split{display:grid;grid-template-columns:1fr 1fr;gap:5%;align-items:center}.v58-web-side{background:var(--panel);border:1px solid color-mix(in srgb,var(--ink) 9%,transparent);border-radius:22px;padding:24px;display:grid;gap:10px}.v58-web-side-row{padding:12px 0;border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent)}.v58-web-side-row:last-child{border-bottom:0}.v58-web-side-row b{font:900 13px Inter;display:block}.v58-web-side-row span{font:600 9.5px/1.45 Inter;color:var(--muted);display:block;margin-top:5px}.v58-web-quote{font:950 clamp(34px,5vw,66px)/1 Inter;letter-spacing:-.05em;max-width:900px}.v58-web-quote:before{content:'“';color:var(--accent)}.v58-web-actions{display:flex;gap:9px;margin-top:24px}.v58-web-actions span{padding:11px 15px;border-radius:11px;background:var(--accent);color:#151821;font:900 9px Inter}.v58-web-actions span.alt{background:var(--panel);color:var(--ink);border:1px solid color-mix(in srgb,var(--ink) 10%,transparent)}.v58-web-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:28px}.v58-web-card{background:var(--panel);border:1px solid color-mix(in srgb,var(--ink) 9%,transparent);border-radius:18px;padding:22px}.v58-web-card b{display:block;font:900 15px Inter;margin-bottom:8px}.v58-web-card span{font:600 9.5px/1.45 Inter;color:var(--muted)}.v58-web-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:26px}.v58-web-stat{padding:18px;border-radius:16px;background:var(--panel)}.v58-web-stat strong{display:block;color:var(--accent);font:950 32px Inter}.v58-web-stat b{display:block;font:900 12px/1.2 Inter;margin:8px 0 5px}.v58-web-stat span{display:block;font:650 8.5px/1.4 Inter;color:var(--muted)}.v58-web-cta{border-radius:22px;background:linear-gradient(135deg,var(--accent2),color-mix(in srgb,var(--accent) 48%,var(--accent2)));padding:6%;color:#fff}.v58-web-cta p{color:rgba(255,255,255,.78)}

    .v58-doc{width:min(880px,100%);margin:0 auto;background:#fff;min-height:1100px;padding:72px 82px;box-shadow:0 20px 60px rgba(25,27,34,.12);font-family:Georgia,'Times New Roman',serif;color:#242323}.v58-doc-cover{padding-bottom:46px;margin-bottom:34px;border-bottom:1px solid #ddd}.v58-doc-cover small{font:700 10px Inter;letter-spacing:.15em;color:#6d5dfc}.v58-doc-cover h1{font:800 44px/1.05 Georgia;margin:12px 0 16px;letter-spacing:-.035em}.v58-doc-cover p{font:400 16px/1.6 Georgia;color:#555}.v58-doc-section{padding:20px 0 26px;border-bottom:1px solid #eee}.v58-doc-section.selected{outline:2px solid #8c7cff;outline-offset:10px;border-radius:5px}.v58-doc-section h2{font:800 26px/1.15 Georgia;margin:0 0 13px}.v58-doc-section p{font:400 15px/1.7 Georgia;color:#393737;margin:0 0 12px}.v58-doc-callout{border-left:4px solid #6d5dfc;background:#f5f3ff;padding:14px 16px;margin:16px 0;font:600 13px/1.55 Inter;color:#514a66}.v58-doc-note{font:650 10px/1.5 Inter;color:#777;margin-top:26px}

    .v58-social-wrap{width:min(1020px,100%);margin:0 auto;display:grid;grid-template-columns:minmax(0,620px) minmax(220px,1fr);gap:18px;align-items:start}.v58-social-card{--bg:#10131c;--panel:#171b27;--ink:#fff;--muted:#b8becc;--accent:#c9ff6a;--accent2:#7667ff;aspect-ratio:4/5;background:var(--bg);color:var(--ink);border-radius:18px;box-shadow:0 22px 60px rgba(18,20,30,.17);padding:9%;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}.v58-social-card:before{content:'';position:absolute;width:56%;aspect-ratio:1;border-radius:50%;right:-19%;top:-14%;background:radial-gradient(circle,var(--accent2),transparent 68%);opacity:.75}.v58-social-card>*{position:relative;z-index:1}.v58-social-card small{font:900 8px Inter;letter-spacing:.16em;color:var(--accent)}.v58-social-card h2{font:950 clamp(31px,5vw,60px)/.94 Inter;letter-spacing:-.055em;margin:14px 0;max-width:94%}.v58-social-card p{font:650 clamp(10px,1.3vw,15px)/1.5 Inter;color:var(--muted);max-width:86%}.v58-social-footer{display:flex;justify-content:space-between;align-items:end;font:800 8px Inter;color:var(--muted)}.v58-social-footer b{color:var(--accent)}.v58-caption{background:#fff;border-radius:16px;padding:18px;box-shadow:0 14px 40px rgba(25,27,34,.08)}.v58-caption small{font:900 7px Inter;letter-spacing:.12em;color:#6d5dfc}.v58-caption h3{font:950 16px Inter;margin:8px 0}.v58-caption p{font:600 10px/1.55 Inter;color:#56515d;white-space:pre-wrap}.v58-caption .tags{color:#6d5dfc;font:800 9px/1.5 Inter;margin-top:14px}

    .v58-graphic-wrap{width:min(980px,100%);margin:0 auto;display:grid;place-items:center}.v58-graphic{--bg:#10131c;--panel:#171b27;--ink:#fff;--muted:#b8becc;--accent:#c9ff6a;--accent2:#7667ff;width:min(700px,100%);aspect-ratio:4/5;background:var(--bg);color:var(--ink);border-radius:12px;box-shadow:0 22px 60px rgba(18,20,30,.18);padding:9%;display:grid;align-content:space-between;position:relative;overflow:hidden}.v58-graphic:before{content:'';position:absolute;inset:auto -18% -20% auto;width:70%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,var(--accent2),transparent 68%)}.v58-graphic:after{content:'';position:absolute;left:-13%;top:-10%;width:42%;aspect-ratio:1;border-radius:32% 68% 64% 36%;background:var(--accent);opacity:.12;transform:rotate(28deg)}.v58-graphic>*{position:relative;z-index:1}.v58-graphic small{font:900 8px Inter;letter-spacing:.16em;color:var(--accent)}.v58-graphic h2{font:950 clamp(38px,6vw,76px)/.9 Inter;letter-spacing:-.06em;margin:18px 0;max-width:96%}.v58-graphic p{font:650 clamp(10px,1.4vw,16px)/1.48 Inter;color:var(--muted);max-width:84%}.v58-graphic-mid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:7% 0}.v58-graphic-block{padding:17px;border-radius:16px;background:var(--panel);border:1px solid color-mix(in srgb,var(--ink) 9%,transparent)}.v58-graphic-block b{display:block;font:950 20px Inter;color:var(--accent);margin-bottom:6px}.v58-graphic-block span{font:650 9px/1.4 Inter;color:var(--muted)}.v58-graphic-cta{display:inline-flex;align-items:center;gap:8px;padding:11px 14px;border-radius:999px;background:var(--accent);color:#151821;font:950 9px Inter;width:max-content}

    [contenteditable="true"]{outline:none}[contenteditable="true"]:focus{box-shadow:0 0 0 2px color-mix(in srgb,var(--accent,#6d5dfc) 55%,transparent);border-radius:4px}
    @media(max-width:1000px){.v58-work{grid-template-columns:150px minmax(0,1fr)}.v58-panel{display:none}.v58-stage{padding:15px}.v58-social-wrap{grid-template-columns:1fr}.v58-caption{max-width:620px;margin:0 auto;width:100%}}@media(max-width:700px){.v58-web-hero,.v58-web-split{grid-template-columns:1fr}.v58-web-art{min-height:230px}#v58-suite{left:0}.v58-work{grid-template-columns:1fr}.v58-nav{display:none}.v58-stage{padding:8px}.v58-top select,.v58-saved{display:none}.v58-doc{padding:35px 24px}.v58-web-cards,.v58-web-stats{grid-template-columns:1fr}.v58-webnav .v58-links{display:none}}
    @media print{body>*:not(#v58-suite){display:none!important}#v58-suite{position:static!important;display:block!important;background:#fff!important}#v58-suite .v58-top,#v58-suite .v58-nav,#v58-suite .v58-panel{display:none!important}.v58-work,.v58-stage{display:block!important;padding:0!important;background:#fff!important}.v58-doc,.v58-graphic{box-shadow:none!important;margin:0 auto!important}.v58-web{box-shadow:none!important;border-radius:0!important}}
  `;
  document.head.appendChild(css);

  const root=document.createElement('section');
  root.id='v58-suite';
  root.innerHTML=`<div class="v58-top"><button class="v58-back">← Studio</button><span class="v58-mode-pill">Creator</span><input class="v58-name" aria-label="Project name"><span class="v58-saved">Saved</span><select class="v58-theme">${Object.entries(THEMES).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select><button class="v58-preview">Preview</button><button class="v58-export">Export</button><button class="primary v58-save">Save project</button></div><div class="v58-work"><aside class="v58-nav"><div class="v58-nav-title">STRUCTURE</div><div class="v58-nav-list"></div><button class="v58-add">+ Add</button></aside><main class="v58-stage"></main><aside class="v58-panel"><h3>Creator controls</h3><div class="v58-field"><label>Current item type</label><select class="v58-type"></select></div><div class="v58-pair"><button class="v58-up">↑ Move</button><button class="v58-down">↓ Move</button></div><div class="v58-pair"><button class="v58-dup">Duplicate</button><button class="v58-new">New</button></div><button class="v58-regenerate">Regenerate design</button><button class="danger v58-del">Delete</button><div class="v58-help"><b>Direct editing:</b> click text inside the canvas and type. Changes are saved automatically.</div></aside></div>`;
  document.body.appendChild(root);

  const currentMode=()=>$('.v41-mode.active')?.dataset.mode||'presentation';
  const selectedOutline=()=>$$('.v45-outline-input',$('#v41-studio-workspace')).map(x=>clean(x.value)).filter(Boolean);
  const prompt=()=>clean($('#v41-prompt')?.value||'');
  const projectName=()=>clean($('#v41-project-name')?.value||'Untitled project');
  const count=()=>Math.max(1,parseInt($('#v41-count')?.value,10)||6);
  const topicFromPrompt=raw=>{
    let x=clean(raw).split(/[.!?\n]/)[0]||'SCHOLARK project';
    x=x.replace(/^(create|make|build|write|design|maak|schrijf|bouw|ontwerp)\s+(an?\s+)?/i,'').trim();
    return x.length>86?x.slice(0,83)+'…':x;
  };
  const sentenceBits=raw=>clean(raw).split(/[.!?]+/).map(clean).filter(x=>x.length>12).slice(0,8);
  const defaultOutline=(mode,topic,n)=>{
    if(mode==='webpage')return ['Hero / opening','Why it matters','Core benefits','How it works','Proof / key points','FAQ','Primary CTA','Footer'].slice(0,Math.max(4,Math.min(8,n)));
    if(mode==='document')return ['Executive summary','Introduction','Background / context','Main analysis','Evidence and discussion','Recommendations','Conclusion','Sources / notes'].slice(0,Math.max(4,Math.min(8,n)));
    if(mode==='social')return Array.from({length:Math.max(3,Math.min(12,n))},(_,i)=>['Hook','Insight','Problem','Proof','Takeaway','CTA'][i%6]+' — '+topic);
    return ['Primary message','Supporting insight','Evidence / detail','Call to action'];
  };
  const copyFor=(title,topic,raw,i)=>{
    const bits=sentenceBits(raw);
    const source=bits[i%Math.max(1,bits.length)]||'';
    if(source&&source.toLowerCase()!==topic.toLowerCase())return source;
    const lead=[`Make ${topic} easy to understand and act on.`,`A focused look at ${topic}, built around clarity, hierarchy and a strong next step.`,`The key idea behind ${topic}, translated into a useful visual story.`,`A concise explanation of what matters most about ${topic}.`][i%4];
    return lead;
  };

  function themeVars(){const t=THEMES[state.theme]||THEMES.midnight;return `--bg:${t.bg};--panel:${t.panel};--ink:${t.ink};--muted:${t.muted};--accent:${t.accent};--accent2:${t.accent2}`}
  function save(){
    if(!state.artifact)return;
    state.artifact.name=$('.v58-name').value||state.artifact.name;
    state.artifact.theme=state.theme;
    state.artifact.updated=Date.now();
    try{
      localStorage.setItem('scholark_v58_'+state.mode,JSON.stringify(state.artifact));
      localStorage.setItem('scholark_v58_last',JSON.stringify(state.artifact));
      localStorage.setItem('scholark_v58_artifact_'+state.artifact.id,JSON.stringify(state.artifact));
      let hist=JSON.parse(localStorage.getItem('scholark_v45_history')||'[]');
      const brief={artifactId:state.artifact.id,project:state.artifact.name,mode:state.mode,rawPrompt:state.artifact.prompt,prompt:state.artifact.prompt,at:state.artifact.updated,createdAt:new Date(state.artifact.updated).toISOString()};
      hist=[brief,...hist.filter(x=>x.artifactId!==state.artifact.id&&!(x.mode===state.mode&&(x.rawPrompt||x.prompt)===state.artifact.prompt&&(x.project||'')===state.artifact.name))].slice(0,40);
      localStorage.setItem('scholark_v45_history',JSON.stringify(hist));
    }catch{}
    $('.v58-saved').textContent='Saved';
  }
  function dirty(){ $('.v58-saved').textContent='Saving…'; clearTimeout(window.__v58save); window.__v58save=setTimeout(save,160); }

  function createArtifact(mode){
    const raw=prompt(),topic=topicFromPrompt(raw),outline=selectedOutline();
    const lines=outline.length?outline:defaultOutline(mode,topic,count());
    const base={id:uid(),mode,name:projectName()||topic,prompt:raw,topic,theme:state.theme,created:Date.now(),updated:Date.now()};
    if(mode==='webpage'){
      const types=['hero','cards','split','stats','cards','faq','cta','footer'];
      base.items=lines.map((x,i)=>({id:uid(),type:types[i%types.length],title:x.replace(/\s*[—:-].*$/,'')||x,body:copyFor(x,topic,raw,i),items:[`Key idea ${i+1}`,`Useful detail ${i+1}`,`Next step ${i+1}`]}));
      if(base.items[0])base.items[0].type='hero';
      if(base.items.at(-1))base.items.at(-1).type='cta';
    }else if(mode==='document'){
      base.items=lines.map((x,i)=>({id:uid(),type:i===0?'summary':'section',title:x,body:[copyFor(x,topic,raw,i),`This section develops ${x.toLowerCase()} in relation to ${topic}. Use the editor to refine the argument, add verified evidence and tailor the depth to the assignment.`]}));
    }else if(mode==='social'){
      base.items=lines.slice(0,Math.max(3,Math.min(20,count()))).map((x,i)=>({id:uid(),type:i===0?'hook':i===lines.length-1?'cta':'insight',title:x,body:copyFor(x,topic,raw,i),caption:`${x}\n\n${copyFor(x,topic,raw,i)}\n\nSave this, share it, or use the idea in your next step.`,tags:'#SCHOLARK #AI #Learning'}));
    }else{
      base.items=[{id:uid(),type:'poster',title:topic,body:copyFor(topic,topic,raw,0),blocks:[['01','Core message'],['02','Key detail']],cta:'Take the next step'}];
    }
    return base;
  }

  function item(){return state.artifact?.items?.[state.index]||null}
  function typeOptions(){
    const sets={webpage:['hero','cards','split','stats','faq','cta','footer'],document:['summary','section','analysis','recommendation','conclusion'],social:['hook','insight','proof','takeaway','cta'],graphic:['poster','infographic','announcement','diagram']};
    return (sets[state.mode]||[]).map(x=>`<option value="${x}">${x}</option>`).join('');
  }
  function renderNav(){
    const list=$('.v58-nav-list');if(!list||!state.artifact)return;
    list.innerHTML=state.artifact.items.map((x,i)=>`<button class="v58-nav-item ${i===state.index?'active':''}" data-i="${i}"><small>${state.mode==='social'?'CARD':state.mode==='document'?'SECTION':state.mode==='graphic'?'CANVAS':'SECTION'} ${i+1}</small><b>${esc(x.title||x.type||'Untitled')}</b></button>`).join('');
    $$('[data-i]',list).forEach(b=>b.onclick=()=>{syncFromCanvas();state.index=+b.dataset.i;render()});
  }
  function syncFromCanvas(){
    const x=item();if(!x)return;
    const stage=$('.v58-stage');
    if(state.mode==='webpage'){
      const s=$('.v58-web-section.selected',stage);if(s){x.title=clean($('[data-field="title"]',s)?.innerText||x.title);x.body=clean($('[data-field="body"]',s)?.innerText||x.body);const nodes=$('[data-v58-web-item]',s);if(nodes.length)x.items=nodes.map(el=>({title:clean($('[data-field="item-title"]',el)?.innerText||''),detail:clean($('[data-field="item-detail"]',el)?.innerText||''),value:clean($('[data-field="item-value"]',el)?.innerText||'')})).filter(v=>v.title||v.detail||v.value)}
    }else if(state.mode==='document'){
      const s=$('.v58-doc-section.selected',stage);if(s){x.title=clean($('[data-field="title"]',s)?.innerText||x.title);x.body=$$('[data-field="body"]',s).map(el=>clean(el.innerText)).filter(Boolean)}
    }else if(state.mode==='social'){
      const c=$('.v58-social-card',stage);if(c){x.title=clean($('[data-field="title"]',c)?.innerText||x.title);x.body=clean($('[data-field="body"]',c)?.innerText||x.body);const cap=$('[data-field="caption"]',stage);if(cap)x.caption=cap.innerText;const tags=$('[data-field="tags"]',stage);if(tags)x.tags=clean(tags.innerText)}
    }else{
      const g=$('.v58-graphic',stage);if(g){x.title=clean($('[data-field="title"]',g)?.innerText||x.title);x.body=clean($('[data-field="body"]',g)?.innerText||x.body);x.cta=clean($('[data-field="cta"]',g)?.innerText||x.cta);x.blocks=$$('.v58-graphic-block',g).map(el=>[clean($('b',el)?.innerText),clean($('span',el)?.innerText)])}
    }
  }

  function webItem(v){return v&&typeof v==='object'?{title:clean(v.title||v.heading||v.detail),detail:clean(v.detail),value:clean(v.value)}:{title:clean(v),detail:'',value:''}}

  function webpageMarkup(){
    const a=state.artifact;
    const sections=a.items.map((x,i)=>{
      const selected=i===state.index?' selected':'';
      const common=`<div class="v58-web-kicker">${esc(x.type)}</div><h2 data-field="title" contenteditable="true">${esc(x.title)}</h2><p data-field="body" contenteditable="true">${esc(x.body)}</p>`;
      if(x.type==='hero')return `<section class="v58-web-section v58-web-hero${selected}" data-index="${i}"><div class="v58-web-copy"><div class="v58-web-kicker">WELCOME</div><h1 data-field="title" contenteditable="true">${esc(x.title)}</h1><p data-field="body" contenteditable="true">${esc(x.body)}</p><div class="v58-web-actions"><span>${esc(a.cta||'Get started')}</span><span class="alt">Explore</span></div></div><div class="v58-web-art" aria-hidden="true"></div></section>`;
      if(x.type==='cards'||x.type==='faq')return `<section class="v58-web-section${selected}" data-index="${i}">${common}<div class="v58-web-cards">${(x.items||[]).map((raw,j)=>{const v=webItem(raw);return `<div class="v58-web-card" data-v58-web-item><b data-field="item-title" contenteditable="true">${esc(v.title||('Point '+(j+1)))}</b>${v.detail?`<span data-field="item-detail" contenteditable="true">${esc(v.detail)}</span>`:''}</div>`}).join('')}</div></section>`;
      if(x.type==='stats')return `<section class="v58-web-section${selected}" data-index="${i}">${common}<div class="v58-web-stats">${(x.items||[]).map((raw,j)=>{const v=webItem(raw);return `<div class="v58-web-stat" data-v58-web-item><strong data-field="item-value" contenteditable="true">${esc(v.value||String(j+1).padStart(2,'0'))}</strong><b data-field="item-title" contenteditable="true">${esc(v.title)}</b>${v.detail?`<span data-field="item-detail" contenteditable="true">${esc(v.detail)}</span>`:''}</div>`}).join('')}</div></section>`;
      if(x.type==='split')return `<section class="v58-web-section${selected}" data-index="${i}"><div class="v58-web-split"><div>${common}</div><div class="v58-web-side">${(x.items||[]).map((raw,j)=>{const v=webItem(raw);return `<div class="v58-web-side-row" data-v58-web-item><b data-field="item-title" contenteditable="true">${esc(v.title||('Point '+(j+1)))}</b><span data-field="item-detail" contenteditable="true">${esc(v.detail||v.value||'')}</span></div>`}).join('')}</div></div></section>`;
      if(x.type==='quote')return `<section class="v58-web-section${selected}" data-index="${i}"><div class="v58-web-kicker">${esc(x.type)}</div><div class="v58-web-quote" data-field="title" contenteditable="true">${esc(x.title)}</div><p data-field="body" contenteditable="true">${esc(x.body)}</p></section>`;
      if(x.type==='cta')return `<section class="v58-web-section${selected}" data-index="${i}"><div class="v58-web-cta">${common}<div class="v58-web-actions"><span>${esc(a.cta||'Take action')} →</span></div></div></section>`;
      return `<section class="v58-web-section${selected}" data-index="${i}">${common}</section>`;
    }).join('');
    return `<div class="v58-web" style="${themeVars()}"><nav class="v58-webnav"><div class="v58-brand">${esc(a.name)}<span>.</span></div><div class="v58-links"><span>About</span><span>Explore</span><span>Contact</span></div></nav>${sections}</div>`;
  }
  function documentMarkup(){
    const a=state.artifact;
    return `<article class="v58-doc"><div class="v58-doc-cover"><small>SCHOLARK DOCUMENT</small><h1 contenteditable="true" data-doc-title>${esc(a.name)}</h1><p>${esc(a.topic)}</p></div>${a.items.map((x,i)=>`<section class="v58-doc-section ${i===state.index?'selected':''}" data-index="${i}"><h2 data-field="title" contenteditable="true">${esc(x.title)}</h2>${(x.body||[]).map(p=>`<p data-field="body" contenteditable="true">${esc(p)}</p>`).join('')}${x.type==='analysis'?'<div class="v58-doc-callout">Add verified evidence, source notes or data here before final submission.</div>':''}</section>`).join('')}<div class="v58-doc-note">Generated and edited in SCHOLARK. Verify factual claims and citations before submission.</div></article>`;
  }
  function socialMarkup(){
    const x=item(),a=state.artifact;
    return `<div class="v58-social-wrap"><article class="v58-social-card" style="${themeVars()}"><div><small>${esc(x.type)} · ${state.index+1}/${a.items.length}</small><h2 data-field="title" contenteditable="true">${esc(x.title)}</h2><p data-field="body" contenteditable="true">${esc(x.body)}</p></div><div class="v58-social-footer"><span>${esc(a.name)}</span><b>SWIPE →</b></div></article><aside class="v58-caption"><small>CAPTION</small><h3>${esc(x.title)}</h3><p data-field="caption" contenteditable="true">${esc(x.caption)}</p><div class="tags" data-field="tags" contenteditable="true">${esc(x.tags)}</div></aside></div>`;
  }
  function graphicMarkup(){
    const x=item(),a=state.artifact;
    return `<div class="v58-graphic-wrap"><article class="v58-graphic" style="${themeVars()}"><div><small>${esc(x.type)} · SCHOLARK GRAPHIC</small><h2 data-field="title" contenteditable="true">${esc(x.title)}</h2><p data-field="body" contenteditable="true">${esc(x.body)}</p></div><div class="v58-graphic-mid">${(x.blocks||[]).map(v=>`<div class="v58-graphic-block"><b contenteditable="true">${esc(v[0])}</b><span contenteditable="true">${esc(v[1])}</span></div>`).join('')}</div><div class="v58-graphic-cta" data-field="cta" contenteditable="true">${esc(x.cta)} →</div></article></div>`;
  }

  function renderStage(){
    const stage=$('.v58-stage');if(!stage||!state.artifact)return;
    stage.innerHTML=state.mode==='webpage'?webpageMarkup():state.mode==='document'?documentMarkup():state.mode==='social'?socialMarkup():graphicMarkup();
    stage.querySelectorAll('[contenteditable="true"]').forEach(el=>el.addEventListener('input',dirty));
    if(state.mode==='webpage'||state.mode==='document')stage.querySelectorAll('[data-index]').forEach(el=>el.onclick=e=>{if(e.target.closest('[contenteditable="true"]'))return;syncFromCanvas();state.index=+el.dataset.index;render()});
  }
  function renderPanel(){
    const x=item(),type=$('.v58-type');if(!x||!type)return;
    type.innerHTML=typeOptions();type.value=x.type||type.options[0]?.value||'';
    type.onchange=()=>{x.type=type.value;render()};
  }
  function render(){
    if(!state.artifact)return;
    state.index=Math.max(0,Math.min(state.index,state.artifact.items.length-1));
    root.classList.add('open');
    $('.v58-mode-pill').textContent=state.mode;
    $('.v58-name').value=state.artifact.name;
    $('.v58-theme').value=state.theme;
    renderNav();renderStage();renderPanel();
    requestAnimationFrame(()=>{root.style.setProperty('left',getComputedStyle(document.documentElement).getPropertyValue('--v51-side')||'258px')});
  }

  function open(mode){
    if(!MODES.includes(mode))return;
    state.mode=mode;state.index=0;
    try{state.artifact=JSON.parse(localStorage.getItem('scholark_v58_'+mode)||'null')}catch{state.artifact=null}
    const raw=prompt();if(!state.artifact||state.artifact.prompt!==raw)state.artifact=createArtifact(mode);
    state.theme=state.artifact.theme||'midnight';
    $('#v41-studio-workspace')?.setAttribute('hidden','');document.body.classList.remove('v41-studio-open');
    render();save();
  }
  function loadArtifact(artifact){
    if(!artifact||!MODES.includes(artifact.mode))return;
    state.mode=artifact.mode;state.index=0;state.artifact=JSON.parse(JSON.stringify(artifact));state.theme=state.artifact.theme||'midnight';
    $('#v41-studio-workspace')?.setAttribute('hidden','');document.body.classList.remove('v41-studio-open');
    render();save();
  }
  function close(){syncFromCanvas();save();root.classList.remove('open');const s=$('#v41-studio-workspace');if(s){s.hidden=false;document.body.classList.add('v41-studio-open')}}

  function addItem(){
    syncFromCanvas();const t=state.artifact.topic;
    if(state.mode==='webpage')state.artifact.items.splice(state.index+1,0,{id:uid(),type:'cards',title:'New section',body:`Add a focused section about ${t}.`,items:['Key point','Supporting point','Next step']});
    else if(state.mode==='document')state.artifact.items.splice(state.index+1,0,{id:uid(),type:'section',title:'New section',body:[`Develop this section in relation to ${t}.`]});
    else if(state.mode==='social')state.artifact.items.splice(state.index+1,0,{id:uid(),type:'insight',title:'New social card',body:`Add a clear insight about ${t}.`,caption:`New post about ${t}.`,tags:'#SCHOLARK'});
    else state.artifact.items.push({id:uid(),type:'poster',title:t,body:`A clear visual message about ${t}.`,blocks:[['01','Key point'],['02','Detail']],cta:'Take action'});
    state.index=Math.min(state.index+1,state.artifact.items.length-1);render();dirty();
  }
  function duplicate(){syncFromCanvas();const x=item();if(!x)return;const y=JSON.parse(JSON.stringify(x));y.id=uid();state.artifact.items.splice(state.index+1,0,y);state.index++;render();dirty()}
  function remove(){if(!state.artifact||state.artifact.items.length<=1)return;state.artifact.items.splice(state.index,1);state.index=Math.max(0,state.index-1);render();dirty()}
  function move(d){syncFromCanvas();const n=state.index+d;if(n<0||n>=state.artifact.items.length)return;const a=state.artifact.items;[a[state.index],a[n]]=[a[n],a[state.index]];state.index=n;render();dirty()}
  function regenerate(){const x=item();if(!x)return;if(state.mode==='webpage'){const opts=['cards','split','stats','faq','cta'];x.type=opts[Math.floor(Math.random()*opts.length)]}else if(state.mode==='social'){const opts=['hook','insight','proof','takeaway','cta'];x.type=opts[Math.floor(Math.random()*opts.length)]}else if(state.mode==='graphic'){const opts=['poster','infographic','announcement','diagram'];x.type=opts[Math.floor(Math.random()*opts.length)]}render();dirty()}

  function standaloneWeb(){
    syncFromCanvas();const a=state.artifact,t=THEMES[state.theme]||THEMES.midnight;
    const body=webpageMarkup().replace(/ contenteditable="true"/g,'').replace(/ selected/g,'');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(a.name)}</title><style>body{margin:0;background:${t.bg};font-family:Inter,Arial,sans-serif}.v58-web{--bg:${t.bg};--panel:${t.panel};--ink:${t.ink};--muted:${t.muted};--accent:${t.accent};--accent2:${t.accent2};max-width:none!important;width:100%!important;border-radius:0!important}.v58-webnav{height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 5%;border-bottom:1px solid rgba(255,255,255,.1);color:var(--ink)}.v58-brand{font-weight:900}.v58-brand span{color:var(--accent)}.v58-links{display:flex;gap:18px;color:var(--muted)}.v58-web-section{padding:7% 6%;color:var(--ink)}.v58-web-kicker{color:var(--accent);font-weight:900;text-transform:uppercase}.v58-web h1,.v58-web h2{font-size:clamp(36px,6vw,76px);line-height:.95;letter-spacing:-.05em;margin:12px 0}.v58-web h2{font-size:clamp(28px,4vw,52px)}.v58-web p{color:var(--muted);line-height:1.6;max-width:760px}.v58-web-actions{display:flex;gap:9px;margin-top:24px}.v58-web-actions span{padding:11px 15px;border-radius:11px;background:var(--accent);color:#151821;font-weight:900}.v58-web-actions .alt{background:var(--panel);color:var(--ink)}.v58-web-cards,.v58-web-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:28px}.v58-web-card,.v58-web-stat{background:var(--panel);padding:22px;border-radius:18px;color:var(--ink)}.v58-web-card span,.v58-web-stat span{color:var(--muted)}.v58-web-stat strong{display:block;color:var(--accent);font-size:32px}.v58-web-cta{border-radius:22px;background:linear-gradient(135deg,var(--accent2),var(--accent));padding:6%;color:#fff}@media(max-width:700px){.v58-web-cards,.v58-web-stats{grid-template-columns:1fr}.v58-links{display:none}}</style></head><body>${body}</body></html>`;
  }
  function download(name,data,type='text/plain'){const b=new Blob([data],{type}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),500)}
  function exportArtifact(){
    syncFromCanvas();save();const base=(state.artifact.name||'scholark').replace(/[^a-z0-9-_]+/gi,'-').replace(/^-+|-+$/g,'').toLowerCase()||'scholark';
    if(state.mode==='webpage')return download(base+'.html',standaloneWeb(),'text/html');
    if(state.mode==='document'){
      const html=`<html><head><meta charset="utf-8"><title>${esc(state.artifact.name)}</title></head><body>${documentMarkup().replace(/ contenteditable="true"/g,'').replace(/ selected/g,'')}</body></html>`;return download(base+'.doc',html,'application/msword');
    }
    if(state.mode==='social'||state.mode==='graphic'){
      const x=item(),t=THEMES[state.theme]||THEMES.midnight,w=1080,h=state.mode==='social'?1350:1350;
      const title=esc(x.title),body=esc(x.body),cta=esc(x.cta||'');
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="${t.bg}"/><circle cx="930" cy="170" r="300" fill="${t.accent2}" opacity=".42"/><text x="90" y="150" fill="${t.accent}" font-family="Arial" font-size="30" font-weight="700">SCHOLARK</text><foreignObject x="90" y="220" width="900" height="750"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial;color:${t.ink};font-size:76px;font-weight:900;line-height:.95">${title}<div style="font-size:28px;font-weight:500;line-height:1.45;color:${t.muted};margin-top:40px;max-width:780px">${body}</div></div></foreignObject>${cta?`<rect x="90" y="1120" rx="32" width="360" height="88" fill="${t.accent}"/><text x="125" y="1177" fill="#151821" font-family="Arial" font-size="28" font-weight="700">${cta}</text>`:''}</svg>`;return download(base+'-'+(state.index+1)+'.svg',svg,'image/svg+xml');
    }
  }
  function preview(){
    syncFromCanvas();
    if(state.mode==='webpage'){const b=new Blob([standaloneWeb()],{type:'text/html'});window.open(URL.createObjectURL(b),'_blank');return}
    if(state.mode==='document'){window.print();return}
    const stage=$('.v58-stage');if(stage){stage.requestFullscreen?.().catch(()=>{});}
  }

  $('.v58-back').onclick=close;
  $('.v58-add').onclick=addItem;
  $('.v58-new').onclick=addItem;
  $('.v58-dup').onclick=duplicate;
  $('.v58-del').onclick=remove;
  $('.v58-up').onclick=()=>move(-1);
  $('.v58-down').onclick=()=>move(1);
  $('.v58-regenerate').onclick=regenerate;
  $('.v58-save').onclick=()=>{syncFromCanvas();save()};
  $('.v58-export').onclick=exportArtifact;
  $('.v58-preview').onclick=preview;
  $('.v58-name').addEventListener('input',dirty);
  $('.v58-theme').onchange=e=>{state.theme=e.target.value;render();dirty()};

  document.addEventListener('click',e=>{
    const g=e.target.closest('#v41-studio-workspace .v41-generate');if(!g)return;
    const mode=currentMode();if(!MODES.includes(mode))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    if(!prompt()){const p=$('#v41-prompt');p?.focus();const s=$('#v41-status');if(s)s.textContent='Describe what you want SCHOLARK to create first.';return}
    const status=$('#v41-status');if(status)status.textContent='Building the complete '+mode+'…';
    open(mode);
  },true);

  addEventListener('hashchange',()=>{if(!/studio|webpage|document|social|graphic/.test(String(location.hash).toLowerCase()))root.classList.remove('open')});
  function selectItem(index){if(!state.artifact)return;syncFromCanvas();state.index=Math.max(0,Math.min(state.artifact.items.length-1,Number(index)||0));render()}
  function updateItem(index,patch){if(!state.artifact)return null;syncFromCanvas();const i=Math.max(0,Math.min(state.artifact.items.length-1,Number(index)||0));Object.assign(state.artifact.items[i],patch||{});state.index=i;render();save();return state.artifact.items[i]}
  window.__SCHOLARK_V58_ARTIFACTS__={open,openArtifact:loadArtifact,close,get:()=>state.artifact,getIndex:()=>state.index,getMode:()=>state.mode,getTheme:()=>state.theme,selectItem,updateItem,save,render};
})();