(() => {
'use strict';
if(window.__SCHOLAVERUM_R303_WORLDS__)return;
const VERSION='r304-cinematic-depth-stability';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
const pi=Math.PI,TWO=2*pi;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const reduce=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const home=()=>!!document.body?.classList.contains('v280-home-rebuild')&&!!$('#v280-editorial-home');
const mobile=()=>innerWidth<760;
const cfg={
 arki:{name:'Intelligence Core',shade:'#9b65f8',light:'#c9ff6a',base:'#09081c',accent:'#e6b9ff',stars:101},
 tutor:{name:'Knowledge Galaxy',shade:'#537bc9',light:'#c9ff6a',base:'#071621',accent:'#d7eaff',stars:119},
 language:{name:'Global Connection',shade:'#9b67eb',light:'#aaffb0',base:'#130c2c',accent:'#f6d0ff',stars:137},
 focus:{name:'Time Observatory',shade:'#547bbb',light:'#adc7f9',base:'#0a1228',accent:'#b8ffdf',stars:151},
 schools:{name:'Discovery Planet',shade:'#735bd7',light:'#c9ff6a',base:'#091529',accent:'#c6eaf9',stars:163}
};
const cards=['arki','tutor','language','focus'];
const state={mounts:0,frames:0,visible:false,active:'arki',theater:'arki',reduced:reduce(),parallax:[0,0],last:0};
const contexts=new Map(),stars=new Map();
let raf=0,cardSection=null,theaterSection=null,cardInView=false,theaterInView=false,observer=null,lastMotion=0;
const seedRand=(seed)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const hexRGBA=(color,a)=>{const h=color.replace('#','');const n=parseInt(h,16);return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')'};
function circ(c,x,y,r){c.beginPath();c.arc(x,y,Math.max(.01,r),0,TWO)}
function glow(c,x,y,r,color,opacity=1){
 if(r<1||opacity<=0)return;
 const gradient=c.createRadialGradient(x,y,0,x,y,r);
 gradient.addColorStop(0,hexRGBA(color,opacity));gradient.addColorStop(.25,hexRGBA(color,opacity*.38));
 gradient.addColorStop(1,hexRGBA(color,0));
 c.fillStyle=gradient;circ(c,x,y,r);c.fill();
}
function ellipse(c,x,y,rx,ry,tilt){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),tilt,0,TWO)}
function starTexture(key){
 if(stars.has(key))return stars.get(key);
 const c=document.createElement('canvas');c.width=640;c.height=400;
 const g=c.getContext('2d'),rand=seedRand(cfg[key].stars);
 for(let i=0;i<185;i++){
  const x=rand()*c.width,y=rand()*c.height,r=.25+rand()*1.4;
  g.globalAlpha=.10+rand()*.72;
  g.fillStyle=i%11===0?cfg[key].light:i%4===0?'#bbb4fc':'#dbe9ff';
  circ(g,x,y,r);g.fill();
  if(i%27===0){g.globalAlpha=.19;g.strokeStyle='#d5d3ed';g.lineWidth=.6;g.beginPath();g.moveTo(x-5,y);g.lineTo(x+5,y);g.moveTo(x,y-5);g.lineTo(x,y+5);g.stroke()}
 }
 stars.set(key,c);return c;
}
function frame(c,w,h,theme,t,camera,intense){
 const world=cfg[theme]||cfg.arki;
 const grad=c.createLinearGradient(0,0,w,h);
 grad.addColorStop(0,world.base);grad.addColorStop(.60,'#18132c');grad.addColorStop(1,'#060819');
 c.fillStyle=grad;c.fillRect(0,0,w,h);
 const m=Math.min(w,h),move=reduce()?0:Math.sin(t*.11)*.025*m;
 glow(c,w*.23-camera[0]*.2,h*.24-camera[1]*.15,m*.83,world.shade,intense?.22:.16);
 glow(c,w*.83+move,h*.74,m*.62,world.light,intense?.15:.10);
 glow(c,w*.57,h*.40,m*.54,world.accent,.08);
 const sheet=starTexture(theme);
 c.save();c.globalAlpha=.65;c.drawImage(sheet,-w*.04-camera[0]*.6,-h*.04-camera[1]*.6,w*1.08,h*1.08);c.restore();
 for(let i=0;i<22;i++){
  const rand=seedRand(world.stars+i*19);const x=rand()*w,y=rand()*h;
  c.fillStyle=world.light;c.globalAlpha=.03+(i%3)*.012;circ(c,x,y,m*(.008+(i%4)*.008));c.fill();
 }c.globalAlpha=1;
}
function arc(c,x,y,rx,ry,rot,color,alpha=.6,width=1.7,start=0,end=TWO){
 c.save();c.translate(x,y);c.rotate(rot);c.globalAlpha=alpha;c.strokeStyle=color;c.lineWidth=width;
 c.beginPath();c.ellipse(0,0,Math.max(1,rx),Math.max(1,ry),0,start,end);c.stroke();c.restore();
}
function sphere(c,x,y,r,world,t,opt={}){
 c.save();
 glow(c,x,y,r*1.8,world.shade,opt.glow??.25);
 const fill=c.createRadialGradient(x-r*.42,y-r*.51,r*.06,x+r*.15,y+r*.23,r*1.22);
 fill.addColorStop(0,opt.pale||world.accent);fill.addColorStop(.15,world.shade);
 fill.addColorStop(.51,opt.middle||'#262651');fill.addColorStop(.80,'#101428');fill.addColorStop(1,'#030610');
 c.fillStyle=fill;circ(c,x,y,r);c.fill();
 c.save();circ(c,x,y,r);c.clip();
 const edge=c.createLinearGradient(x-r*.7,y-r*.5,x+r,y+r*.8);
 edge.addColorStop(0,'rgba(255,255,255,.09)');edge.addColorStop(.56,'rgba(1,3,11,.06)');edge.addColorStop(1,'rgba(0,0,9,.77)');
 c.fillStyle=edge;c.fillRect(x-r,y-r,2*r,2*r);
 for(let k=0;k<14;k++){const a=k*2.29+t*.1,px=x+Math.sin(a)*r*.71,py=y+Math.cos(a*.66)*r*.75;
  arc(c,px,py,r*.13,r*.029,a*.48,k%3===0?world.light:world.accent,.13,1.1);
 }
 c.restore();
 arc(c,x,y,r,r,0,world.accent,.50,Math.max(.7,r*.015),2.45,6.1);
 c.restore();
}
function polyline(c,pts,color,opacity,width){
 c.save();c.strokeStyle=color;c.lineWidth=width;c.globalAlpha=opacity;c.lineJoin='round';
 c.beginPath();pts.forEach(([x,y],i)=>i===0?c.moveTo(x,y):c.lineTo(x,y));c.stroke();c.restore();
}
function arki(c,w,h,t,world,camera,hero){
 const scale=Math.min(w,h),cx=w*.54+camera[0]*.20,cy=h*.53+camera[1]*.14,r=scale*.20;
 const spin=t*.12,connections=[];
 // Front and rear neural nodes are projected from a rotating 3D field.
 for(let i=0;i<26;i++){
  const angle=i*2.399+spin,lat=Math.asin(-1+2*(i+.5)/26);
  const rot=angle+Math.cos(t*.1)*.22;
  const z=Math.cos(rot)*Math.cos(lat),size=1.07+.2*z;
  const x=cx+Math.sin(rot)*Math.cos(lat)*scale*.42;
  const y=cy+Math.sin(lat)*scale*.37;
  connections.push({x,y,z,size});
 }
 connections.forEach((p,i)=>{
  if(p.z<-.26)return;
  for(let j=i+1;j<connections.length;j++){
   const q=connections[j],d=Math.hypot(p.x-q.x,p.y-q.y);
   if(q.z<-.26||d>scale*.32)continue;
   polyline(c,[[p.x,p.y],[q.x,q.y]],world.accent,.12+(p.z+q.z)*.07,.7);
  }
 });
 arc(c,cx,cy,r*1.85,r*.73,-.52,world.light,.48,1.3);
 arc(c,cx,cy,r*1.65,r*.92,.40,world.accent,.42,1.0);
 sphere(c,cx,cy,r,world,t,{pale:'#d9c9ff',glow:.39});
 // Intelligence glyph, brand-color processing pulse.
 c.textAlign='center';c.textBaseline='middle';c.font='700 '+Math.round(r*.93)+'px Inter,system-ui,sans-serif';
 c.fillStyle='#e7e2ff';c.shadowColor=world.shade;c.shadowBlur=13;c.fillText('✳',cx,cy);c.shadowBlur=0;
 connections.filter(p=>p.z>-.3).forEach((p,i)=>{
  glow(c,p.x,p.y,(3+p.z*4)*p.size,world.light,.26);
  c.fillStyle=i%4===0?world.light:world.accent;
  c.globalAlpha=.46+p.z*.28;circ(c,p.x,p.y,1.5+p.size);c.fill();c.globalAlpha=1;
 });
 const pulse=(t*.20)%TWO;
 arc(c,cx,cy,r*1.31,r*1.31,0,world.light,.25,1.4,pulse,pulse+.67);
}
function tutor(c,w,h,t,world,camera){
 const s=Math.min(w,h),x=w*.50+camera[0]*.2,y=h*.51+camera[1]*.13;
 // An illuminated knowledge galaxy: book-like pages around a scholarly nucleus.
 glow(c,x,y,s*.50,world.shade,.22);
 arc(c,x,y,s*.38,s*.15,.20,world.light,.55,1.9);
 arc(c,x,y,s*.45,s*.18,-.48,world.accent,.4,1.0);
 sphere(c,x,y,s*.14,world,t,{pale:'#d5e8ff',glow:.2});
 for(let i=0;i<7;i++){
  const angle=i*TWO/7+t*.085,radius=s*.36,z=Math.sin(angle),px=x+Math.cos(angle)*radius,py=y+Math.sin(angle)*radius*.38;
  const ww=s*.12*(.75+.3*z),hh=s*.085*(.75+.25*z);
  c.save();c.translate(px,py);c.rotate(angle*.2);
  c.fillStyle=z>.2?'#e7efff':'#8ca6d5';c.globalAlpha=.84;
  c.fillRect(-ww,-hh,ww*.91,hh*1.8);c.fillStyle='#bed7d7';c.fillRect(ww*.01,-hh,ww*.91,hh*1.8);
  c.strokeStyle=world.light;c.lineWidth=1.1;c.strokeRect(-ww,-hh,ww*1.92,hh*1.8);
  c.globalAlpha=.32;for(let line=0;line<3;line++){
   c.fillStyle='#284364';c.fillRect(-ww*.8,-hh*.6+line*hh*.4,ww*.65,1.1);
   c.fillRect(ww*.17,-hh*.6+line*hh*.4,ww*.65,1.1);
  }c.restore();
 }
 c.font='600 '+Math.round(s*.13)+'px Inter,system-ui,sans-serif';
 c.textAlign='center';c.textBaseline='middle';c.fillStyle='#f3f7ff';c.fillText('∑',x,y);
 const coords=[[.17,.21,'x²'],[.81,.24,'π'],[.20,.75,'√'],[.78,.76,'f(x)']];
 coords.forEach(([fx,fy,txt],i)=>{
  c.font='600 '+Math.round(s*.036)+'px Inter,system-ui';c.fillStyle=world.light;
  c.globalAlpha=.48+.17*Math.sin(t*.5+i);c.fillText(txt,w*fx,h*fy);c.globalAlpha=1;
 });
}
function languages(c,w,h,t,world,camera){
 const s=Math.min(w,h),x=w*.51+camera[0]*.17,y=h*.51+camera[1]*.11,r=s*.265;
 glow(c,x,y,s*.58,world.shade,.23);
 sphere(c,x,y,r,world,t,{pale:'#d6caff',middle:'#1b295b',glow:.25});
 const turn=t*.12;
 c.save();circ(c,x,y,r*.985);c.clip();
 // Curved latitude lines and rotating longitude meridians keep the globe dimensional.
 for(let i=-3;i<=3;i++){
  const yy=y+i*r*.23;
  const rr=Math.sqrt(Math.max(0,r*r-(i*r*.23)**2));
  arc(c,x,yy,rr,rr*.23,0,world.accent,.27,1);
 }
 for(let i=0;i<7;i++){const longitude=i*pi/7+turn;
  arc(c,x,y,Math.max(2,Math.abs(Math.sin(longitude))*r),r,0,world.light,.17,1);
 }
 c.restore();
 const pairs=[[.15,.21,.82,.30],[.22,.73,.77,.18],[.72,.72,.20,.40]];
 pairs.forEach(([a,b,d,e],i)=>{
  c.save();c.strokeStyle=i%2?world.light:world.accent;c.globalAlpha=.56;c.lineWidth=1.7;
  c.beginPath();c.moveTo(w*a,h*b);c.quadraticCurveTo(w*.53,h*(i===1?.02:.42),w*d,h*e);c.stroke();
  [ [a,b],[d,e] ].forEach(([xx,yy])=>{glow(c,w*xx,h*yy,10,world.light,.25);circ(c,w*xx,h*yy,3);c.fillStyle=world.light;c.fill()});
  c.restore();
 });
 const words=[['Hola',.17,.17],['你好',.82,.14],['Hello',.16,.84],['Bonjour',.79,.83]];
 words.forEach(([word,fx,fy],i)=>{c.fillStyle='#e9e0ff';c.globalAlpha=.78;c.textAlign='center';
  c.font='700 '+Math.max(9,s*.045)+'px Inter,system-ui';
  c.fillText(word,w*fx,h*fy+(reduce()?0:Math.sin(t*.28+i)*3));c.globalAlpha=1;
 });
}
function focus(c,w,h,t,world,camera){
 const s=Math.min(w,h),cx=w*.51+camera[0]*.16,cy=h*.53+camera[1]*.10,r=s*.26;
 glow(c,cx,cy,r*1.8,world.shade,.21);
 sphere(c,cx,cy,r*1.06,world,t,{pale:'#b6d9f9',middle:'#15334f',glow:.23});
 for(let i=0;i<5;i++){const angle=i*.41;
  arc(c,cx,cy,r*(1.12+i*.18),r*(.43+i*.065),angle,world.accent,i===0?.49:.13,1.1);
 }
 c.save();c.translate(cx,cy);
 c.strokeStyle=world.light;c.globalAlpha=.75;c.lineCap='round';
 for(let n=0;n<60;n+=5){
  const a=n*TWO/60-pi/2,p1=r*.68,p2=n%15===0?r*.89:r*.81;
  c.lineWidth=n%15===0?2:1.1;c.beginPath();c.moveTo(Math.cos(a)*p1,Math.sin(a)*p1);
  c.lineTo(Math.cos(a)*p2,Math.sin(a)*p2);c.stroke();
 }
 const secondAngle=t*.25-pi/2,minuteAngle=t*.036-pi/2;
 c.lineWidth=2.5;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(secondAngle)*r*.72,Math.sin(secondAngle)*r*.72);c.stroke();
 c.strokeStyle='#ebf9ff';c.lineWidth=3.5;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(minuteAngle)*r*.47,Math.sin(minuteAngle)*r*.47);c.stroke();
 c.fillStyle=world.light;circ(c,0,0,4);c.fill();c.restore();
 c.font='750 '+Math.max(10,s*.048)+'px Inter,system-ui';
 c.fillStyle='#dfe8ff';c.textAlign='center';c.fillText('25:00',cx,cy+r*1.28);
}
function schools(c,w,h,t,world,camera){
 languages(c,w,h,t,world,camera);
 // Discovery pins make this separate from language, but reuse our dimensional globe.
 const r=Math.min(w,h),spots=[[.63,.27],[.29,.47],[.69,.69]];
 spots.forEach(([a,b],i)=>{glow(c,w*a,h*b,14,world.light,.24);c.fillStyle=world.light;circ(c,w*a,h*b,2.5);c.fill()});
 arc(c,w*.51,h*.51,r*.47,r*.18,-.35,world.light,.45,1.3);
}
function paintWorld(ctx,w,h,key,now,camera,large=false){
 const world=cfg[key]||cfg.arki,t=reduce()?2:now*.001,focusTime=large;
 frame(ctx,w,h,key,t,camera,focusTime);
 const draw=key==='arki'?arki:key==='tutor'?tutor:key==='language'?languages:key==='focus'?focus:schools;
 draw(ctx,w,h,t,world,camera,large);
 const fade=ctx.createLinearGradient(0,0,0,h);
 fade.addColorStop(0,'rgba(6,7,19,.08)');fade.addColorStop(.77,'rgba(6,7,19,0)');fade.addColorStop(1,'rgba(5,7,20,.21)');
 ctx.fillStyle=fade;ctx.fillRect(0,0,w,h);
}
function prepare(canvas,limit=820){
 const rect=canvas.getBoundingClientRect();
 if(rect.width<5||rect.height<5)return null;
 const dpr=Math.min(mobile()?1:1.5,window.devicePixelRatio||1,limit/rect.width,limit/rect.height);
 const width=Math.round(rect.width*dpr),height=Math.round(rect.height*dpr);
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}
 let ctx=contexts.get(canvas);
 if(!ctx){ctx=canvas.getContext('2d',{alpha:false});contexts.set(canvas,ctx)}
 if(!ctx)return null;ctx.setTransform(dpr,0,0,dpr,0,0);
 return {ctx,w:rect.width,h:rect.height};
}
function draw(card,now){
 const canvas=$('canvas.v303-world-canvas',card);if(!canvas)return;
 const p=prepare(canvas,card.classList.contains('is-active')?720:440);if(!p)return;
 const key=card.dataset.v303World||'arki';
 const tilt=[state.parallax[0]*.28,state.parallax[1]*.28];
 paintWorld(p.ctx,p.w,p.h,key,now,tilt);
}
function drawTheater(now){
 const root=$('#v280-demo'),preview=$('#v280-app-preview',root);
 const canvas=$('#v303-theater-world',root);if(!canvas||!preview)return;
 const key=preview.dataset.scene||'arki';
 const p=prepare(canvas,1100);if(!p)return;
 const tilt=[state.parallax[0]*.9,state.parallax[1]*.7];
 paintWorld(p.ctx,p.w,p.h,key,now,tilt,true);state.theater=key;
 root.dataset.v303World=key;
}
function activeCards(){
 const section=$('#v298-feature-gallery');
 if(!section)return[];
 return $$('.v298-feature',section);
}
function renderOnce(now){
 const elements=activeCards();
 const current=elements.find(el=>el.classList.contains('is-active'))||elements[0];
 elements.forEach(card=>{
  if(card===current){if(cardInView||card.dataset.v303Painted!=='1'){draw(card,now);card.dataset.v303Painted='1'}}
  else if(card.dataset.v303Painted!=='1'){draw(card,2e3+cards.indexOf(card.dataset.v303World)*400);card.dataset.v303Painted='1'}
 });
 if(theaterInView)drawTheater(now);
 state.active=current?.dataset.v303World||'arki';state.frames++;
}
function loop(now){
 raf=0;if(document.hidden||!home()){state.visible=false;return}
 const inView=cardInView||theaterInView;state.visible=inView;
 if(!inView)return;
 const minInterval=mobile()?90:42;
 if(now-lastMotion>=minInterval){lastMotion=now;renderOnce(now)}
 if(!reduce())raf=requestAnimationFrame(loop);
}
function wake(){
 if(!home()||document.hidden)return;
 if(reduce()){renderOnce(2000);return}
 if(!raf)raf=requestAnimationFrame(loop);
}
function detach(){
 if(raf)cancelAnimationFrame(raf);raf=0;observer?.disconnect();observer=null;
 cardSection=null;theaterSection=null;cardInView=false;theaterInView=false;state.visible=false;
}
function mount(){
 if(!home()){detach();return}
 const cardsNow=activeCards(),section=$('#v298-discover'),theater=$('#v280-demo');
 if(!cardsNow.length||!section||!theater)return;
 if(cardSection===section&&theaterSection===theater&&cardsNow.every(card=>!!$('canvas.v303-world-canvas',card)))return;
 detach();state.mounts++;lastMotion=0;
 cardSection=section;theaterSection=theater;
 cardsNow.forEach((card,i)=>{
  const key=cards[i];card.dataset.v303World=key;
  const graphic=$('.v298-feature-graphic',card);if(!graphic)return;
  if(!$('canvas.v303-world-canvas',graphic)){
   const canvas=document.createElement('canvas');canvas.className='v303-world-canvas';
   canvas.setAttribute('aria-hidden','true');canvas.dataset.world=key;graphic.prepend(canvas);
  }
  card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',key+' cinematic preview');
  if(card.dataset.v303Bound==='1')return;
  card.dataset.v303Bound='1';
  const activate=()=>{
   cardsNow.forEach(el=>{el.classList.toggle('is-active',el===card);el.setAttribute('aria-current',String(el===card))});
   state.active=key;wake();
  };
  card.addEventListener('pointerenter',activate);
  card.addEventListener('focus',activate);
  card.addEventListener('click',activate);
  card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate()}});
 });
 const screen=$('#v280-demo');
 if(!$('#v303-theater-world',screen)){
  const canvas=document.createElement('canvas');canvas.id='v303-theater-world';
  canvas.setAttribute('aria-hidden','true');screen.prepend(canvas);
 }
 if(screen.dataset.v303Bound!=='1'){
  screen.dataset.v303Bound='1';
  screen.addEventListener('pointermove',e=>{if(reduce()||mobile())return;
  const b=screen.getBoundingClientRect();
  state.parallax=[((e.clientX-b.left)/b.width-.5)*30,((e.clientY-b.top)/b.height-.5)*20];
 },{passive:true});
 screen.addEventListener('pointerleave',()=>{state.parallax=[0,0]},{passive:true});
 }
 if('IntersectionObserver'in window){
  observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.target===section)cardInView=entry.isIntersecting;
    if(entry.target===screen)theaterInView=entry.isIntersecting;
   }if(!cardInView&&!theaterInView){if(raf)cancelAnimationFrame(raf);raf=0;state.visible=false}
   else wake();
  },{rootMargin:'100px 0px',threshold:0});
  observer.observe(section);observer.observe(screen);
 }else{cardInView=true;theaterInView=true}
 // Static image immediately so all cards show a world even before the observer fires.
 renderOnce(performance.now());wake();
}
if(!document.getElementById('scholaverum-r303-worlds-css')){
 const l=document.createElement('link');l.id='scholaverum-r303-worlds-css';l.rel='stylesheet';
 l.href='scholark-v133-cinematic-worlds.css?v=20261030-r304';document.head.appendChild(l);
}
window.addEventListener('hashchange',()=>{if(!home())detach();setTimeout(mount,85)});
window.addEventListener('pageshow',()=>setTimeout(mount,80));
window.addEventListener('pagehide',detach);
let resizeQueued=false;
window.addEventListener('resize',()=>{
 if(resizeQueued)return;resizeQueued=true;
 requestAnimationFrame(()=>{
  resizeQueued=false;if(!home())return;
  activeCards().forEach(card=>{delete card.dataset.v303Painted});
  renderOnce(performance.now());wake();
 });
},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0}else wake()});
window.matchMedia?.('(prefers-reduced-motion: reduce)')?.addEventListener?.('change',()=>{state.reduced=reduce();wake()});
['scholaverum:editorial-home-mounted','scholark-runtime-ready','scholark-language-applied','scholark-language-change','scholark-return-home'].forEach(name=>window.addEventListener(name,()=>{setTimeout(mount,120);setTimeout(mount,550)}));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,150),{once:true});
else setTimeout(mount,150);
window.__SCHOLAVERUM_R303_WORLDS__={version:VERSION,mount,state:()=>({...state,canvases:$$('.v303-world-canvas').length,theaterCanvas:!!$('#v303-theater-world'),cachedWorlds:stars.size})};
})();