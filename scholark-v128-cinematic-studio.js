(() => {
'use strict';
if (window.__SCHOLAVERUM_R298_CINEMA__) return;
const R='r298-cinematic-universe';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const home=()=>!!document.body?.classList.contains('v280-home-rebuild')&&!!$('#v280-editorial-home');
const reduce=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const lang=()=>{try{return (localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'en').toLowerCase().startsWith('nl')?'nl':'en'}catch{return 'en'}};
const tr=(en,nl)=>lang()==='nl'?nl:en;
const logo='scholaverum-official-icon-r290.png';
if(!document.getElementById('scholaverum-cinema-style')){const link=document.createElement('link');link.id='scholaverum-cinema-style';link.rel='stylesheet';link.href='scholark-v128-cinematic-studio.css?v=20261020-r298';document.head.appendChild(link)}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=t=>1-Math.pow(1-t,3);
const scenes=[
 {id:'vision',tag:'01 / THE VISION',title:'Learning should feel limitless.',nl:'Leren zonder grenzen.',copy:'Meet a calmer, more connected way to learn, create and grow.',nlcopy:'Ontdek een rustigere, verbonden manier om te leren, creëren en groeien.',feature:'SCHOLAVERUM',stat:'ONE CONNECTED WORLD'},
 {id:'workspace',tag:'02 / YOUR WORKSPACE',title:'Everything begins in one place.',nl:'Alles begint op één plek.',copy:'Your tools, learning plans and ideas live together in one powerful workspace.',nlcopy:'Je tools, studieplanning en ideeën komen samen in één krachtige workspace.',feature:'WORKSPACE',stat:'ONE HOME FOR YOUR IDEAS'},
 {id:'arki',tag:'03 / MEET ARKI',title:'Ask bigger questions.',nl:'Stel grotere vragen.',copy:'Explore ideas, get explanations and move from a question to your next breakthrough.',nlcopy:'Ontdek ideeën, krijg uitleg en zet vragen om in nieuwe inzichten.',feature:'ARKI',stat:'THINK · EXPLORE · CREATE'},
 {id:'tutor',tag:'04 / AI TUTOR',title:'Hard topics. Clearer answers.',nl:'Moeilijke stof. Heldere uitleg.',copy:'Practise subjects with explanations, useful feedback and questions that help you learn.',nlcopy:'Oefen vakken met uitleg, feedback en vragen die je echt verder helpen.',feature:'AI TUTOR',stat:'LEARN AT YOUR PACE'},
 {id:'language',tag:'05 / LANGUAGE LEARNER',title:'The world is yours to speak.',nl:'De wereld wacht op jouw woorden.',copy:'Build fluency with lessons, real practice and reviews at your own pace.',nlcopy:'Vergroot je taalvaardigheid met lessen, praktijkoefeningen en herhaling.',feature:'LANGUAGE LEARNER',stat:'NEW WORDS · NEW WORLDS'},
 {id:'focus',tag:'06 / FOCUS & STUDY',title:'Find your flow.',nl:'Vind jouw studieritme.',copy:'Plan, focus, revisit your notes and keep making progress, one session at a time.',nlcopy:'Plan, concentreer je, herhaal notities en boek vooruitgang per studiesessie.',feature:'FOCUS SESSIONS',stat:'MAKE EACH MOMENT COUNT'},
 {id:'schools',tag:'07 / SCHOOLS NEAR ME',title:'Your next chapter is out there.',nl:'Jouw volgende hoofdstuk wacht.',copy:'Explore schools and new possibilities beyond your current classroom.',nlcopy:'Ontdek scholen en nieuwe mogelijkheden buiten je huidige klaslokaal.',feature:'SCHOOLS NEAR ME',stat:'YOUR FUTURE · IN VIEW'},
 {id:'final',tag:'08 / START HERE',title:'Your future starts with curiosity.',nl:'Jouw toekomst begint met nieuwsgierigheid.',copy:'One learning universe. Built around the way you grow.',nlcopy:'Eén leeromgeving. Ontworpen voor jouw groei.',feature:'SCHOLAVERUM',stat:'WELCOME TO WHAT IS NEXT'}
];
const gallery=[
 {key:'arki',name:'ARKI',type:'AI ASSISTANT',body:'From a spark of curiosity to something extraordinary.',nl:'Van nieuwsgierigheid naar nieuwe inzichten.'},
 {key:'tutor',name:'AI Tutor',type:'PERSONAL LEARNING',body:'A clearer way through the most difficult lessons.',nl:'Meer grip op de moeilijkste lessen.'},
 {key:'language',name:'Language Learner',type:'GLOBAL LANGUAGES',body:'Learn to understand, speak and connect.',nl:'Leer begrijpen, spreken en verbinden.'},
 {key:'focus',name:'Focus Sessions',type:'STUDY FLOW',body:'Build your momentum, one focused session at a time.',nl:'Bouw je ritme op, studiesessie voor studiesessie.'}
];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lastHeroFrame=0,lastStoryFrame=0,galleryTimer=0,galleryIndex=0,storyTimer=0,storyStarted=0,storyRemaining=7500,storyIndex=0,storyPlaying=false,storyOpen=false,storyRaf=0,heroRaf=0,heroClock=0,storyClock=0,storyFocus=null,storyPreviousOverflow='',mounted=false,heroCanvas=null,storyCanvas=null,heroObserver=null,activeHero=false,resizeObserver=null,screenW=0,screenH=0,screenDpr=1,heroW=0,heroH=0,heroDpr=1;
function sizeCanvas(canvas,maximumWidth=3840,maximumHeight=2160){
 if(!canvas)return [0,0,1];
 const rect=canvas.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height);
 const dpr=Math.min(window.devicePixelRatio||1,window.innerWidth<700?1.5:2.25,maximumWidth/w,maximumHeight/h);
 const pxw=Math.max(1,Math.round(w*dpr)),pxh=Math.max(1,Math.round(h*dpr));
 if(canvas.width!==pxw||canvas.height!==pxh){canvas.width=pxw;canvas.height=pxh}
 const c=canvas.getContext('2d',{alpha:true});if(c)c.setTransform(dpr,0,0,dpr,0,0);
 return [w,h,dpr];
}
function line(ctx,pts,color,thick=1,opacity=1){
 ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));
 ctx.lineWidth=thick;ctx.strokeStyle=color;ctx.globalAlpha=opacity;ctx.stroke();ctx.globalAlpha=1;
}
function orbit(ctx,cx,cy,radius,phase,tilt,speed,w,h,bright){
 const points=[];for(let i=0;i<=180;i++){const a=i/180*Math.PI*2;const x=Math.cos(a)*radius,z=Math.sin(a)*radius,y=Math.sin(a*1.3)*radius*.075;points.push([cx+x*Math.cos(tilt)-y*Math.sin(tilt),cy+(x*Math.sin(tilt)+y*Math.cos(tilt))*.45+z*.45,z])}
 for(let i=1;i<points.length;i++){const o=(points[i][2]/radius+1)/2;line(ctx,[points[i-1],points[i]],bright?'#c9ff6a':'#ad9af5',.9+o*.6,.09+o*.35)}
 const angle=phase*speed,ox=Math.cos(angle)*radius,oz=Math.sin(angle)*radius;
 const x=cx+ox*Math.cos(tilt),y=cy+ox*Math.sin(tilt)*.45+oz*.45;
 const rad=clamp(radius*.023*(1+oz/radius*.22),3,9);
 const glow=ctx.createRadialGradient(x-rad*.3,y-rad*.3,0,x,y,rad*3);
 glow.addColorStop(0,'#fff');glow.addColorStop(.25,bright?'#dcffa7':'#c9beff');glow.addColorStop(1,'rgba(0,0,0,0)');
 ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,rad*3,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=bright?'#c9ff6a':'#a994f8';ctx.beginPath();ctx.arc(x,y,rad*.65,0,Math.PI*2);ctx.fill();
}
function renderHero(now){
 heroRaf=0;if(!activeHero||!home()||!heroCanvas||document.hidden)return;
 if(!reduce()&&now-lastHeroFrame<33){heroRaf=requestAnimationFrame(renderHero);return}lastHeroFrame=now;
 const [w,h,dpr]=sizeCanvas(heroCanvas,2200,2200);heroW=w;heroH=h;heroDpr=dpr;
 const ctx=heroCanvas.getContext('2d');if(!ctx)return;
 ctx.clearRect(0,0,w,h);
 const time=reduce()?0:now/1000;
 const cx=w*.50,cy=h*.50,rad=Math.min(w,h)*.32;
 const halo=ctx.createRadialGradient(cx,cy,rad*.07,cx,cy,rad*1.7);
 halo.addColorStop(0,'rgba(167,146,251,.13)');halo.addColorStop(.45,'rgba(166,153,236,.055)');halo.addColorStop(1,'rgba(8,15,28,0)');
 ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
 for(let i=0;i<76;i++){
  const a=i*2.39996+time*.032*(i%3+1),r=rad*(.86+(i%11)*.104),x=cx+Math.sin(a)*r,y=cy+Math.cos(a*1.31)*r*.79;
  ctx.globalAlpha=.10+(i%7)*.055;ctx.fillStyle=i%3?'#bfb2ef':'#d4ffa5';ctx.beginPath();ctx.arc(x,y,clamp(w*.0018,0.5,1.6),0,Math.PI*2);ctx.fill();
 }ctx.globalAlpha=1;
 for(let i=0;i<7;i++){const a=i*Math.PI/3.5+time*.025;line(ctx,[[cx+Math.cos(a)*rad*.90,cy+Math.sin(a)*rad*.75],[cx+Math.cos(a+.12)*rad*1.45,cy+Math.sin(a+.12)*rad*1.03]],'#b7a8f0',.6,.16)}
 orbit(ctx,cx,cy,rad*.96,time*.56,-.48,1,w,h,true);
 orbit(ctx,cx,cy,rad*1.17,time*-.41,.63,1,w,h,false);
 const halo2=ctx.createRadialGradient(cx-rad*.24,cy-rad*.30,rad*.08,cx,cy,rad*.78);
 halo2.addColorStop(0,'rgba(255,255,255,.10)');halo2.addColorStop(.7,'rgba(120,105,185,.09)');halo2.addColorStop(1,'rgba(12,15,27,.02)');
 ctx.fillStyle=halo2;ctx.beginPath();ctx.arc(cx,cy,rad*.72,0,Math.PI*2);ctx.fill();
 if(!reduce()){heroRaf=requestAnimationFrame(renderHero)}
}
function heroState(value){
 activeHero=!!value&&!document.hidden&&home();
 if(!activeHero){if(heroRaf)cancelAnimationFrame(heroRaf);heroRaf=0;return}
 if(!heroRaf)heroRaf=requestAnimationFrame(renderHero);
}
function makeHero(){
 const host=$('#v280-editorial-home .v280-hero-art');
 if(!host)return;
 if($('.v298-engine',host)){
  // Resuming Home from Workspace must reactivate a previously paused canvas.
  const r=host.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)heroState(true);
  return;
 }
 // The r296 globe and the r292 fallback must never render underneath the new engine.
 $('.v296-atom',host)?.remove();$('.v292-sphere-stage',host)?.remove();
 const stage=document.createElement('div');stage.className='v298-engine';
 stage.setAttribute('aria-hidden','true');
 stage.innerHTML='<canvas class="v298-engine-canvas"></canvas><div class="v298-core-halo"></div><div class="v298-core"><img alt="" decoding="async" src="'+logo+'"></div><span class="v298-particle a"></span><span class="v298-particle b"></span>';
 host.prepend(stage);heroCanvas=$('.v298-engine-canvas',stage);
 if('IntersectionObserver' in window){heroObserver=new IntersectionObserver(entries=>entries.forEach(e=>heroState(e.isIntersecting)),{threshold:0,rootMargin:'110px 0px'});heroObserver.observe(host)}
 const view=host.getBoundingClientRect();if(view.bottom>0&&view.top<innerHeight)heroState(true);
}
function galleryMarkup(g,i){
 return '<article class="v298-feature '+(i===galleryIndex?'is-active':'')+'" data-v298-gallery="'+i+'"><div class="v298-feature-meta">'+esc(g.type)+' <span>0'+(i+1)+'</span></div><div class="v298-feature-graphic '+esc(g.key)+'" aria-hidden="true"><span class="v298-glass-window"><i></i><i></i><i></i></span><div class="v298-graphic-main">'+(g.key==='arki'?'✳':g.key==='tutor'?'∑':g.key==='language'?'あ':'◉')+'</div><div class="v298-feature-wave"></div></div><div class="v298-feature-bottom"><div><strong>'+esc(g.name)+'</strong><p>'+esc(lang()==='nl'?g.nl:g.body)+'</p></div><span aria-hidden="true">↗</span></div></article>';
}
function gallerySync(){
 const el=$('#v298-feature-gallery');if(!el)return;
 el.innerHTML=gallery.map(galleryMarkup).join('');
 $$('.v298-feature',el).forEach((card,i)=>card.setAttribute('aria-current',String(i===galleryIndex)));
}
function galleryMount(){
 if($('#v298-feature-gallery'))return;
 const intro=$('#v280-intro');if(!intro)return;
 const section=document.createElement('section');section.id='v298-discover';section.className='v298-discover';
 section.innerHTML='<div class="v298-discover-top"><div><small>SCHOLAVERUM / THE EXPERIENCE</small><h2>'+tr('A world of possibilities.','Een wereld vol mogelijkheden.')+'</h2></div><button type="button" data-v298-action="open" class="v298-discover-cta">'+tr('Watch the cinematic presentation','Bekijk de cinematic presentatie')+' <span aria-hidden="true">↗</span></button></div><div id="v298-feature-gallery" class="v298-feature-gallery" aria-label="SCHOLAVERUM Workspace highlights"></div><p class="v298-discover-note">'+tr('A closer look at the tools that move with you.','Ontdek de tools die met je meegroeien.')+'</p>';
 intro.insertAdjacentElement('afterend',section);gallerySync();
 if(!galleryTimer)galleryTimer=setInterval(()=>{
  if(!home()||document.hidden||reduce()||storyOpen||window.__SCHOLAVERUM_TOUR__?.state?.()?.running)return;
  const currentSection=$('#v298-discover');if(!currentSection?.isConnected)return;
  const rect=currentSection.getBoundingClientRect();
  if(rect.bottom<0||rect.top>innerHeight)return;
  galleryIndex=(galleryIndex+1)%gallery.length;gallerySync();
 },5800);
}
function nav(){
 const bar=$('#v55-topbar');if(!bar||$('#v298-nav-what',bar))return;
 const btn=document.createElement('button');btn.id='v298-nav-what';btn.type='button';btn.dataset.v298Action='open';btn.textContent=tr('What is SCHOLAVERUM','Wat is SCHOLAVERUM');
 btn.setAttribute('aria-haspopup','dialog');btn.setAttribute('aria-controls','v298-cinema');
 const links=$('#v280-header-links',bar),actions=$('.v55-actions',bar);
 if(actions)actions.prepend(btn);else if(links)bar.insertBefore(btn,links);else bar.appendChild(btn);
}
function previewMarkup(s){
 if(s.id==='vision'||s.id==='final')return '<div class="v298-vision-emblem"><img src="'+logo+'" alt=""></div><div class="v298-ui-caption">SCHOLAVERUM / THE FUTURE OF LEARNING</div>';
 const header='<div class="v298-ui-header"><span class="v298-ui-dot"></span><strong>SCHOLAVERUM / '+esc(s.feature)+'</strong><span>● ● ●</span></div>';
 if(s.id==='workspace')return header+'<div class="v298-ui-workspace"><div class="v298-ui-sidebar"><b>WORKSPACE</b><span>◈ &nbsp; ARKI</span><span>✧ &nbsp; AI Tutor</span><span>▥ &nbsp; Language Learner</span><span>◷ &nbsp; Focus Sessions</span><span>◎ &nbsp; Schools Near Me</span></div><div class="v298-ui-main"><small>YOUR DASHBOARD</small><h3>Everything is connected.</h3><div class="v298-ui-tiles"><i>MY PROGRESS <b>78%</b></i><i>FOCUS TIME <b>42 min</b></i></div><div class="v298-ui-line"></div><div class="v298-ui-line short"></div></div></div>';
 if(s.id==='arki')return header+'<div class="v298-ui-chat"><h3>Meet ARKI <em>✳</em></h3><div class="v298-ui-message q">How do I make this idea clearer?</div><div class="v298-ui-message a">Let’s explore it together. Here is a simple way to begin…<div class="v298-ui-line"></div><div class="v298-ui-line short"></div></div><div class="v298-ui-prompt">Ask anything <span>↗</span></div></div>';
 if(s.id==='tutor')return header+'<div class="v298-ui-learning"><small>SCIENCE · PRACTICE</small><h3>Let’s solve it together.</h3><p>Which part of a plant absorbs sunlight?</p><div class="v298-ui-answer">A. Roots</div><div class="v298-ui-answer good">B. Leaves <b>✓</b></div><div class="v298-ui-answer">C. Stem</div></div>';
 if(s.id==='language')return header+'<div class="v298-ui-language"><small>LANGUAGE PRACTICE</small><h3>Every word opens a door.</h3><div class="v298-ui-words"><span>HELLO</span><span>HOLA</span><span>你好</span><span>BONJOUR</span></div><div class="v298-ui-line"></div><div class="v298-ui-line short"></div></div>';
 if(s.id==='focus')return header+'<div class="v298-ui-focus"><div class="v298-focus-dial"><span>24:36</span><small>FOCUS MODE</small></div><h3>Make room for your best work.</h3><div class="v298-ui-line"></div></div>';
 return header+'<div class="v298-ui-schools"><small>EXPLORE EDUCATION</small><h3>Find your next school.</h3><div class="v298-ui-map"><i></i><i></i><i></i><span>GLOBAL SCHOOL DISCOVERY</span></div></div>';
}
function storyNode(){
 let node=$('#v298-cinema');if(node)return node;
 node=document.createElement('section');node.id='v298-cinema';node.className='v298-cinema';node.hidden=true;node.tabIndex=-1;
 node.setAttribute('role','dialog');node.setAttribute('aria-modal','true');node.setAttribute('aria-label','Wat is SCHOLAVERUM — cinematic presentation');
 node.innerHTML='<canvas class="v298-story-canvas" aria-hidden="true"></canvas><div class="v298-story-grain" aria-hidden="true"></div><header class="v298-story-top"><div class="v298-story-brand"><img src="'+logo+'" alt=""><span>SCHOLAVERUM <small>THE EXPERIENCE</small></span></div><div class="v298-story-actions"><span class="v298-story-quality">CINEMATIC · DISPLAY-RESOLUTION</span><button type="button" data-v298-action="play" aria-label="Pause slideshow">Ⅱ Pause</button><button type="button" data-v298-action="close" aria-label="Close presentation">✕ Close</button></div></header><div class="v298-story-center"><div class="v298-story-copy"><div class="v298-story-tag"></div><h2 class="v298-story-title"></h2><p class="v298-story-copytext"></p><div class="v298-story-stat"></div><button type="button" class="v298-story-enter" data-v298-action="workspace">Enter Workspace ↗</button></div><div class="v298-story-screen" aria-label="Illustrated workspace feature preview"><div class="v298-story-preview"></div></div></div><footer class="v298-story-bottom"><div class="v298-story-dots"></div><div class="v298-story-progress"><i></i></div><div class="v298-story-steppers"><button type="button" data-v298-action="prev" aria-label="Previous scene">←</button><span class="v298-story-counter"></span><button type="button" data-v298-action="next" aria-label="Next scene">→</button></div></footer>';
 document.body.appendChild(node);return node;
}
function displayScene(index,transition=true){
 storyIndex=(index+scenes.length)%scenes.length;
 const node=storyNode(),s=scenes[storyIndex],pane=$('.v298-story-center',node);
 if(transition&&!reduce()){pane.classList.remove('v298-scene-in');void pane.offsetWidth;pane.classList.add('v298-scene-in')}
 $('.v298-story-tag',node).textContent=s.tag;
 $('.v298-story-title',node).textContent=lang()==='nl'?s.nl:s.title;
 $('.v298-story-copytext',node).textContent=lang()==='nl'?s.nlcopy:s.copy;
 $('.v298-story-stat',node).textContent=s.stat;
 $('.v298-story-preview',node).innerHTML=previewMarkup(s);
 $('.v298-story-screen',node).dataset.scene=s.id;
 $('.v298-story-counter',node).textContent=String(storyIndex+1).padStart(2,'0')+' / '+String(scenes.length).padStart(2,'0');
 $('.v298-story-dots',node).innerHTML=scenes.map((v,i)=>'<button type="button" class="'+(i===storyIndex?'active':'')+'" data-v298-jump="'+i+'" aria-label="Scene '+(i+1)+'" aria-current="'+(i===storyIndex)+'"></button>').join('');
 $('.v298-story-enter',node).hidden=s.id!=='final';
 storyRemaining=7500;storyStarted=performance.now();updatePlay();
}
function updatePlay(){
 const node=$('#v298-cinema');if(!node)return;
 const b=$('[data-v298-action="play"]',node);
 b.textContent=storyPlaying?'Ⅱ '+tr('Pause','Pauzeren'):'▶ '+tr('Play','Afspelen');
 b.setAttribute('aria-label',storyPlaying?'Pause presentation':'Play presentation');
}
function storyBackground(now){
 storyRaf=0;if(!storyOpen||document.hidden)return;
 const c=storyCanvas;if(!c)return;
 if(!reduce()&&now-lastStoryFrame<33){storyRaf=requestAnimationFrame(storyBackground);return}lastStoryFrame=now;
 const [w,h,dpr]=sizeCanvas(c,3840,2160);screenW=w;screenH=h;screenDpr=dpr;
 const ctx=c.getContext('2d');if(!ctx)return;ctx.clearRect(0,0,w,h);
 const time=reduce()?1:now/1000;const cx=w*(.53+Math.sin(time*.085)*.06),cy=h*(.47+Math.cos(time*.07)*.04);
 const g=ctx.createRadialGradient(cx,cy,20,cx,cy,Math.max(w,h)*.74);
 g.addColorStop(0,'rgba(116,98,190,.29)');g.addColorStop(.37,'rgba(35,43,81,.15)');g.addColorStop(1,'rgba(5,10,19,0)');
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 const s=scenes[storyIndex],purple=s.id==='vision'||s.id==='final';
 for(let layer=0;layer<3;layer++){
  ctx.beginPath();
  for(let j=0;j<=80;j++){const x=w*j/80,y=h*(.59+layer*.11)+Math.sin(j*.105+time*(.16+layer*.055)+layer*2)*h*(.07+layer*.025)+Math.sin(j*.041-time*.12)*h*.045;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
  ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();
  const fill=ctx.createLinearGradient(0,h*.25,0,h);
  fill.addColorStop(0,purple?'rgba(165,147,238,.07)':'rgba(195,255,111,.07)');
  fill.addColorStop(1,'rgba(7,12,25,0)');ctx.fillStyle=fill;ctx.fill();
 }
 for(let i=0;i<90;i++){const seed=i*19.17,px=((Math.sin(seed*2.4)*.5+.5)*w+time*(3+i%8))%w,py=(Math.cos(seed*1.2)*.5+.5)*h;
 ctx.globalAlpha=.09+(i%9)*.025;ctx.fillStyle=i%3?'#c5b8f9':'#d2ff92';ctx.beginPath();ctx.arc(px,py,Math.max(.45,Math.min(w*.0009,1.5)),0,Math.PI*2);ctx.fill()}
 ctx.globalAlpha=1;
 window.__SCHOLAVERUM_R300_COSMOS__?.paintStory?.(now,storyIndex,storyOpen);
 if(storyPlaying&&!reduce()){
  const elapsed=now-storyStarted;const fraction=clamp(1-(storyRemaining-elapsed)/7500,0,1);$('.v298-story-progress i')?.style.setProperty('transform','scaleX('+fraction+')');
  if(elapsed>=storyRemaining){displayScene(storyIndex+1);storyStarted=now}
 }
 if(!reduce())storyRaf=requestAnimationFrame(storyBackground);
}
function stopStory(){
 if(!storyOpen)return;storyOpen=false;storyPlaying=false;clearTimeout(storyTimer);storyTimer=0;if(storyRaf)cancelAnimationFrame(storyRaf);storyRaf=0;
 const n=$('#v298-cinema');if(n)n.hidden=true;
 document.documentElement.classList.remove('v298-story-open');document.body.classList.remove('v298-story-open');
 document.body.style.overflow=storyPreviousOverflow;
 if(storyFocus?.isConnected)storyFocus.focus({preventScroll:true});
}
function startStory(){
 if(!home())return;
 window.__SCHOLAVERUM_TOUR__?.stop?.();
 const n=storyNode();if(storyOpen){displayScene(0);return}
 storyFocus=document.activeElement;storyOpen=true;storyPlaying=!reduce();storyPreviousOverflow=document.body.style.overflow;
 document.body.classList.add('v298-story-open');document.documentElement.classList.add('v298-story-open');document.body.style.overflow='hidden';
 n.hidden=false;storyCanvas=$('.v298-story-canvas',n);displayScene(0,false);
 n.focus({preventScroll:true});if(!storyRaf)storyRaf=requestAnimationFrame(storyBackground);
}
function togglePlay(){
 if(!storyOpen)return;storyPlaying=!storyPlaying;
 if(storyPlaying){storyStarted=performance.now();if(!storyRaf)storyRaf=requestAnimationFrame(storyBackground)}
 else {storyRemaining=Math.max(200,storyRemaining-(performance.now()-storyStarted));if(storyRaf)cancelAnimationFrame(storyRaf);storyRaf=0;storyBackground(performance.now())}
 updatePlay();
}
function step(n){if(!storyOpen)return;displayScene(storyIndex+n);if(!storyRaf)storyBackground(performance.now())}
function mount(){
 if(!home())return;
 window.__SCHOLAVERUM_R299_PLANET__?.mount?.();galleryMount();nav();
 if(mounted)return;mounted=true;
 if('ResizeObserver' in window){resizeObserver=new ResizeObserver(()=>{if(activeHero&&!heroRaf)renderHero(performance.now());if(storyOpen&&!storyRaf)storyBackground(performance.now())});if(heroCanvas)resizeObserver.observe(heroCanvas)}
}
document.addEventListener('click',event=>{
 const btn=event.target.closest?.('[data-v298-action],[data-v298-jump],[data-v298-gallery]');if(!btn)return;
 if(btn.hasAttribute('data-v298-gallery')){galleryIndex=Number(btn.dataset.v298Gallery)||0;gallerySync();return}
 if(btn.hasAttribute('data-v298-jump')){if(storyOpen){displayScene(Number(btn.dataset.v298Jump)||0);if(!storyRaf)storyBackground(performance.now())}return}
 const action=btn.dataset.v298Action;if(action==='open'){event.preventDefault();startStory()}
 else if(action==='close')stopStory();
 else if(action==='play')togglePlay();
 else if(action==='prev')step(-1);
 else if(action==='next')step(1);
 else if(action==='workspace'){stopStory();location.hash='#dashboard'}
});
document.addEventListener('keydown',event=>{
 if(!storyOpen)return;
 if(event.key==='Escape'){event.preventDefault();stopStory()}
 else if(['ArrowRight','ArrowLeft'].includes(event.key)){event.preventDefault();step(event.key==='ArrowRight'?1:-1)}
 else if(event.key===' '&&event.target.tagName!=='BUTTON'){event.preventDefault();togglePlay()}
 else if(event.key==='Tab'){const controls=$$('#v298-cinema button:not([hidden])').filter(b=>b.getClientRects().length);if(!controls.length)return;const first=controls[0],last=controls[controls.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
});
window.addEventListener('hashchange',()=>{if(!home())stopStory();setTimeout(mount,70)});
document.addEventListener('visibilitychange',()=>{if(document.hidden){heroState(false);if(storyRaf)cancelAnimationFrame(storyRaf);storyRaf=0}else{if(heroCanvas)heroState(true);if(storyOpen&&!storyRaf)storyRaf=requestAnimationFrame(storyBackground)}});
window.addEventListener('pagehide',()=>{heroState(false);if(storyRaf)cancelAnimationFrame(storyRaf);storyRaf=0});
window.addEventListener('pageshow',()=>setTimeout(mount,50));
window.addEventListener('resize',()=>{if(storyOpen&&!storyRaf)storyBackground(performance.now())},{passive:true});
const mq=window.matchMedia?.('(prefers-reduced-motion: reduce)');mq?.addEventListener?.('change',()=>{heroState(!reduce());if(storyOpen){storyPlaying=!reduce();updatePlay();if(!storyRaf)storyRaf=requestAnimationFrame(storyBackground)}});
['scholaverum:editorial-home-mounted','scholark:topbar-ready','scholark-runtime-ready','scholark-return-home'].forEach(e=>window.addEventListener(e,()=>setTimeout(mount,60)));
['scholark-language-applied','scholark-language-change'].forEach(e=>window.addEventListener(e,()=>{if($('#v298-nav-what'))$('#v298-nav-what').textContent=tr('What is SCHOLAVERUM','Wat is SCHOLAVERUM');if($('#v298-discover')){$('#v298-discover').remove();galleryMount()}if(storyOpen)displayScene(storyIndex,false)}));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,80),{once:true});else setTimeout(mount,80);
window.__SCHOLAVERUM_R298_CINEMA__={open:startStory,close:stopStory,step,version:R,state:()=>({open:storyOpen,playing:storyPlaying,index:storyIndex,scenes:scenes.length,canvas:storyCanvas?[storyCanvas.width,storyCanvas.height]:null})};
})();