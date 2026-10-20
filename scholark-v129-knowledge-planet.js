(() => {
'use strict';
if (window.__SCHOLAVERUM_R299_PLANET__) return;
const VERSION='r299-knowledge-planet-eclipse';
const $=(s,r=document)=>r.querySelector(s);
const home=()=>!!document.body?.classList.contains('v280-home-rebuild')&&!!$('#v280-editorial-home');
const reduced=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const mobile=()=>innerWidth<700;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const mix=(a,b,t)=>a+(b-a)*t;
const TAU=Math.PI*2;
const hues=['#c9ff6a','#ae96ef','#d6fba8','#aaa2d3'];
const moons=[
 {name:'ARKI',mark:'✳',color:'#c9ff6a',r:1.23,tilt:-.52,seed:-1.1,speed:.075,size:1.19},
 {name:'AI TUTOR',mark:'∑',color:'#b5a3fa',r:1.07,tilt:.45,seed:.6,speed:-.071,size:1},
 {name:'LANGUAGES',mark:'文',color:'#c9ff6a',r:1.41,tilt:.64,seed:-3.3,speed:.059,size:.94},
 {name:'FOCUS',mark:'◷',color:'#b9abf5',r:1.18,tilt:-.21,seed:2.25,speed:-.047,size:.9},
 {name:'SCHOOLS',mark:'⌖',color:'#bcefa4',r:1.55,tilt:.25,seed:1.1,speed:.041,size:.91}
];
const rings=[
 {radius:1.37,tilt:-.31,depth:.42,color:'#c9ff6a',speed:.12,line:1.65},
 {radius:1.21,tilt:.52,depth:.35,color:'#a895ee',speed:-.17,line:1.65},
 {radius:1.65,tilt:.15,depth:.29,color:'#dbf7be',speed:.08,line:1},
 {radius:1.84,tilt:-.66,depth:.26,color:'#9a8ed0',speed:-.025,line:.72}
];
let stage=null,canvas=null,ctx=null,observer=null,resizeObserver=null,raf=0,prevFrame=0;
let inView=false,mouse=[0,0],started=0,progress=0,introMs=12000,quality=1,seq=0,elapsedPause=0;
let renderedFrames=0,dimension=[0,0],lastPhase='',lastWidth=0,lastHeight=0;
function circle(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU)}
function glow(c,x,y,r,color,alpha){
 const g=c.createRadialGradient(x,y,1,x,y,Math.max(2,r));
 g.addColorStop(0,color);g.addColorStop(1,'transparent');
 c.save();c.globalAlpha=alpha;c.fillStyle=g;circle(c,x,y,r);c.fill();c.restore();
}
function starfield(c,w,h,seconds,opacity){
 const count=mobile()?34:74;
 c.save();
 for(let i=0;i<count;i++){
  const n=Math.sin(i*127.1+93.31)*43758.5453,fract=n-Math.floor(n);
  const m=Math.sin(i*59.71+47.17)*33213.76,fy=m-Math.floor(m);
  const x=w*(.04+fract*.94),y=h*(.04+fy*.92);
  const twinkle=reduced()?1:.75+.25*Math.sin(seconds*.33+i*2.39);
  c.globalAlpha=opacity*twinkle*(.2+(i%6)*.10);
  c.fillStyle=i%4===0?'#c9ff6a':'#d1c9f9';
  circle(c,x,y,i%14===0?1.35:.65);c.fill();
 }c.restore();
}
function ringPoint(center,R,theta,spec){
 const x=Math.cos(theta)*R,y=Math.sin(theta)*R*spec.depth,z=Math.sin(theta)*Math.cos(spec.tilt);
 const co=Math.cos(spec.tilt),si=Math.sin(spec.tilt);
 return [center.x+x*co-y*si,center.y+x*si+y*co,z];
}
function drawRings(c,center,R,t,fade,front){
 if(fade<=0)return;
 rings.forEach((ring,i)=>{
  const radius=R*ring.radius,steps=128;
  c.save();c.globalCompositeOperation='screen';c.lineCap='round';
  for(let j=0;j<steps;j++){
   const theta=j/steps*TAU,next=(j+1)/steps*TAU;
   const p=ringPoint(center,radius,theta,ring),q=ringPoint(center,radius,next,ring);
   const z=(p[2]+q[2])/2;
   if((z>=0)!==front)continue;
   const facing=(z+1)*.5;
   c.globalAlpha=fade*(front?.32+facing*.29:.11+facing*.12)*(i===3?.49:1);
   c.strokeStyle=ring.color;c.lineWidth=ring.line*(front?1.1:.85);
   c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();
   if((j+i*17)%29===0&&front){c.globalAlpha=fade*.14;c.lineWidth=ring.line*3.5;c.stroke()}
  }
  // Moving data packets are small restrained accents, not thick neon tubes.
  for(let packet=0;packet<3;packet++){
   const phase=ring.speed*t+packet*TAU/3+i*.64;
   const p=ringPoint(center,radius,phase,ring);
   if((p[2]>=0)!==front)continue;
   glow(c,p[0],p[1],(i===0?12:8)*quality,ring.color,fade*(front?.30:.12));
   c.globalAlpha=fade*(front?.82:.37);c.fillStyle=ring.color;
   circle(c,p[0],p[1],i===3?1.1:2);c.fill();
  }
  c.restore();
 });
}
function planet(c,center,R,t,reveal){
 if(reveal<=0)return;
 const x=center.x,y=center.y;
 c.save();c.globalAlpha=reveal;
 glow(c,x+R*.17,y+R*.04,R*1.62,'#8577b6',.10);
 glow(c,x-R*.24,y-R*.39,R*1.18,'#c9ff6a',.065);
 const base=c.createRadialGradient(x-R*.48,y-R*.57,R*.06,x+R*.17,y+R*.22,R*1.32);
 base.addColorStop(0,'#586078');base.addColorStop(.19,'#343b55');base.addColorStop(.52,'#1a2037');base.addColorStop(.77,'#101526');base.addColorStop(1,'#030712');
 c.fillStyle=base;circle(c,x,y,R);c.fill();
 c.save();circle(c,x,y,R-1);c.clip();
 // Arc-based procedural topography, drifting with the planet's axial rotation.
 for(let k=0;k<29;k++){
  const phi=k*.47+t*.015,lat=Math.sin(k*2.58+1.13)*.91;
  const vx=Math.sin(phi*1.2+k*.13),vy=Math.sin(lat+k*.72);
  const ax=x+R*vx*.82,ay=y+R*vy*.76;
  c.strokeStyle=k%4===0?'#b8a8f3':k%3===0?'#c9ff6a':'#777e9f';
  c.globalAlpha=(k%3===0?.19:.095)*(.4+.6*reveal);
  c.lineWidth=k%6===0?4:1.4;
  c.beginPath();c.ellipse(ax,ay,R*(.09+k%5*.053),R*(.017+k%4*.009),phi*.42,0,TAU*.77);c.stroke();
 }
 // Horizontal longitudinal traces suggest a rotating intelligent planet without Earth continents.
 for(let i=0;i<14;i++){
  const lat=-.86+i*.13,theta=t*.017+i*.71;
  const xx=x+Math.sin(theta)*R*.28,yy=y+lat*R*.84;
  c.globalAlpha=.035+(i%3)*.015;c.strokeStyle=i%3===0?'#c9ff6a':'#d0c7f4';c.lineWidth=1;
  c.beginPath();c.ellipse(xx,yy,R*Math.sqrt(Math.max(.06,1-lat*lat))*.86,R*.038,-.11,0,Math.PI);c.stroke();
 }
 c.globalAlpha=1;
 const shade=c.createLinearGradient(x-R,y-R*.3,x+R,y+R*.55);
 shade.addColorStop(0,'rgba(0,0,0,0)');shade.addColorStop(.35,'rgba(0,0,0,.13)');
 shade.addColorStop(.71,'rgba(0,0,0,.35)');shade.addColorStop(1,'rgba(1,3,13,.84)');
 c.fillStyle=shade;c.fillRect(x-R,y-R,R*2,R*2);
 const terminator=c.createRadialGradient(x-R*.27,y-R*.4,R*.22,x+R*.29,y+R*.05,R*1.25);
 terminator.addColorStop(0,'rgba(164,173,237,.11)');terminator.addColorStop(.58,'rgba(30,35,65,0)');terminator.addColorStop(1,'rgba(4,6,20,.52)');
 c.fillStyle=terminator;c.fillRect(x-R,y-R,R*2,R*2);
 c.restore();
 c.save();c.globalAlpha=reveal;c.lineWidth=2.1;
 const rim=c.createLinearGradient(x-R,y-R,x+R,y+R);
 rim.addColorStop(0,'rgba(239,240,255,.77)');rim.addColorStop(.25,'rgba(181,167,250,.44)');
 rim.addColorStop(.56,'rgba(201,255,106,.24)');rim.addColorStop(1,'rgba(123,104,194,.08)');
 c.strokeStyle=rim;circle(c,x,y,R);c.stroke();c.restore();
 c.restore();
}
function eclipse(c,center,R,t){
 const leaving=smooth((t-.8)/2.55);
 const x=center.x+mix(-R*.28,-R*2.55,leaving),y=center.y+mix(-R*.03,-R*.49,leaving);
 const radius=R*1.08;
 const opacity=1-smooth((t-2.75)/1.5);
 if(opacity<=.01)return;
 c.save();c.globalAlpha=opacity;
 glow(c,center.x+R*.14,center.y-R*.13,R*1.48,'#efebfc',.14);
 glow(c,x+R*.28,y-R*.12,R*1.18,'#a899f3',.15);
 const shell=c.createRadialGradient(x-radius*.4,y-radius*.48,6,x,y,radius*1.16);
 shell.addColorStop(0,'#161b2e');shell.addColorStop(.75,'#090d1c');shell.addColorStop(1,'#01040a');
 c.fillStyle=shell;circle(c,x,y,radius);c.fill();
 c.strokeStyle='rgba(223,219,255,.20)';c.lineWidth=2;circle(c,x,y,radius);c.stroke();
 c.restore();
}
function moon(c,center,R,kind,t,intro,opacity){
 if(opacity<.01)return;
 const spec=moons[kind];
 if(mobile()&&kind>=3)return;
 const theta=t*spec.speed+spec.seed;
 const tilt=spec.tilt;
 const r=R*spec.r,depth=Math.sin(theta)*.32;
 const x=center.x+Math.cos(theta)*r*Math.cos(tilt)-Math.sin(theta)*r*.33*Math.sin(tilt);
 const y=center.y+Math.cos(theta)*r*Math.sin(tilt)+Math.sin(theta)*r*.33*Math.cos(tilt);
 const size=R*(mobile()?.079:.095)*spec.size*(1+depth*.16);
 c.save();c.globalAlpha=opacity;
 glow(c,x,y,size*2.6,spec.color,.16);
 const fill=c.createRadialGradient(x-size*.35,y-size*.34,1,x,y,size*1.3);
 fill.addColorStop(0,'#4d5167');fill.addColorStop(.48,'#252b42');fill.addColorStop(1,'#0b0e1b');
 c.fillStyle=fill;circle(c,x,y,size);c.fill();
 c.lineWidth=1.2;c.strokeStyle=spec.color;circle(c,x,y,size);c.stroke();
 c.fillStyle=spec.color;c.textAlign='center';c.textBaseline='middle';c.font='600 '+Math.max(11,size*.70)+'px Inter,Arial,sans-serif';c.fillText(spec.mark,x,y-1);
 if(!mobile()){
  c.globalAlpha=opacity*.86;c.font='700 '+Math.max(8,Math.min(12,R*.052))+'px Inter,Arial,sans-serif';
  c.letterSpacing='1px';c.fillStyle='#e7e7ed';
  c.fillText(spec.name,x,y+size+17);
 }
 c.restore();
}
function phaseFor(t){
 if(reduced())return 'idle';
 if(t<.8)return 'space';
 if(t<3.2)return 'eclipse';
 if(t<5.2)return 'planet';
 if(t<7.3)return 'rings';
 if(t<10.2)return 'moons';
 if(t<12)return 'settle';
 return 'idle';
}
function size(){
 if(!canvas)return;
 const b=canvas.getBoundingClientRect();if(b.width<1||b.height<1)return;
 const width=b.width,height=b.height;
 const cap=mobile()?1.45:Math.min(window.devicePixelRatio||1,2);
 const dpr=Math.min(cap,2200/width,2200/height);
 const dw=Math.max(1,Math.round(width*dpr)),dh=Math.max(1,Math.round(height*dpr));
 if(canvas.width!==dw||canvas.height!==dh){canvas.width=dw;canvas.height=dh}
 if(!ctx)ctx=canvas.getContext('2d',{alpha:true});
 if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
 quality=mobile()?.78:1;dimension=[width,height];
}
function paint(seconds){
 if(!ctx)return;
 const [w,h]=dimension;ctx.clearRect(0,0,w,h);
 const t=reduced()?16:seconds;
 const tiny=Math.min(w,h),R=tiny*(mobile()?.265:.275),cx=w*(mobile()?.49:.50),cy=h*(mobile()?.50:.52);
 const camera=smooth((t-.5)/5.5),scale=mix(.91,1,camera);
 const center={x:cx+mouse[0]*4*camera,y:cy+mouse[1]*3*camera};
 const radius=R*scale;
 glow(ctx,center.x,center.y,radius*2.5,'#3d345c',.14);
 glow(ctx,center.x-radius*.48,center.y-radius*.6,radius*1.45,'#6b568f',.085);
 starfield(ctx,w,h,t,smooth((t-.0)/1.4));
 const reveal=reduced()?1:smooth((t-1.85)/2.2);
 const ringFade=reduced()?1:smooth((t-4.6)/2.85);
 const moonFade=reduced()?1:smooth((t-6.8)/3.15);
 drawRings(ctx,center,radius,t,ringFade,false);
 planet(ctx,center,radius,t,reveal);
 drawRings(ctx,center,radius,t,ringFade,true);
 for(let i=0;i<moons.length;i++){
  const appear=reduced()?1:smooth((t-(7.25+i*.48))/.78);
  moon(ctx,center,radius,i,t,moonFade*appear,moonFade*appear);
 }
 eclipse(ctx,center,radius,t);
 // Cinematic star glint on the limb during the planet reveal.
 if(t>=2.2&&t<=5.4&&!reduced()){
  const glint=Math.sin(smooth((t-2.2)/3.2)*Math.PI)*.47;
  glow(ctx,center.x-radius*.66,center.y-radius*.73,radius*.38,'#efebff',glint);
 }
 if(stage){
  stage.style.setProperty('--v299-logo-alpha',String(reveal*smooth((t-3.1)/1.6)*.93));
  stage.dataset.phase=phaseFor(t);lastPhase=stage.dataset.phase;
  stage.dataset.intro=String(t<12&&!reduced());
  const skip=$('.v299-skip',stage);
  if(skip)skip.hidden=t>=12||reduced();
 }
}
function loop(now){
 raf=0;
 if(!inView||!home()||document.hidden||!stage?.isConnected)return;
 if(now-prevFrame<32&&!reduced()){raf=requestAnimationFrame(loop);return}
 prevFrame=now;
 size();
 progress=reduced()?16:Math.min(16,((now-started)/1000)*(12000/introMs));
 if(progress>=12&&!elapsedPause){elapsedPause=1;try{sessionStorage.setItem('scholaverum_eclipse_seen','yes')}catch{}}
 paint(progress>=12?(12+(now-started-introMs)/1000):progress);
 renderedFrames++;
 if(!reduced())raf=requestAnimationFrame(loop);
}
function playback(on){
 inView=!!on&&home()&&!document.hidden;
 if(!inView){if(raf)cancelAnimationFrame(raf);raf=0;return}
 if(!raf)raf=requestAnimationFrame(loop);
}
function skipIntro(){
 introMs=12000;started=performance.now()-12000;
 try{sessionStorage.setItem('scholaverum_eclipse_seen','yes')}catch{}
 if(stage){const btn=$('.v299-skip',stage);if(btn)btn.hidden=true}
 if(inView){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
}
function clean(){
 playback(false);observer?.disconnect();observer=null;resizeObserver?.disconnect();resizeObserver=null;
 if(stage?.isConnected)stage.remove();stage=null;canvas=null;ctx=null;
}
function mount(){
 if(!home())return;
 const host=$('#v280-editorial-home .v280-hero-art');if(!host)return;
 if(stage?.isConnected&&stage.parentElement!==host)clean();
 if(!stage?.isConnected){
  host.querySelectorAll('.v298-engine,.v296-atom,.v292-sphere-stage,.v299-universe').forEach(n=>n.remove());
  stage=document.createElement('div');stage.className='v299-universe';
  stage.setAttribute('aria-label','SCHOLAVERUM knowledge planet cinematic');stage.setAttribute('role','img');
  stage.innerHTML='<canvas class="v299-planet-canvas" aria-hidden="true"></canvas><img class="v299-logo" src="scholaverum-official-icon-r290.png" alt="" aria-hidden="true" decoding="async"><button class="v299-skip" type="button" aria-label="Skip cinematic introduction">Skip intro →</button>';
  host.prepend(stage);canvas=$('.v299-planet-canvas',stage);
  $('.v299-skip',stage).addEventListener('click',skipIntro);
  let seen=false;try{seen=sessionStorage.getItem('scholaverum_eclipse_seen')==='yes'}catch{}
  introMs=seen?3000:(mobile()?8000:12000);
  started=performance.now()-(seen?9000:0)*(introMs/12000);
  elapsedPause=0;progress=0;renderedFrames=0;prevFrame=0;
  size();
  observer?.disconnect();observer=null;
  if('IntersectionObserver' in window){
   observer=new IntersectionObserver(entries=>entries.forEach(entry=>playback(entry.isIntersecting)),{rootMargin:'90px 0px',threshold:0});
   observer.observe(host);
  }
  resizeObserver?.disconnect();resizeObserver=null;
  if('ResizeObserver' in window){resizeObserver=new ResizeObserver(()=>{size();if(reduced())paint(16)});resizeObserver.observe(canvas)}
 }
 const bounds=host.getBoundingClientRect();
 if(bounds.bottom>0&&bounds.top<innerHeight)playback(true);
 if(reduced()){size();paint(16)}
}
if(!document.getElementById('scholaverum-planet-style')){
 const link=document.createElement('link');link.id='scholaverum-planet-style';link.rel='stylesheet';link.href='scholark-v129-knowledge-planet.css?v=20261020-r299';document.head.appendChild(link);
}
document.addEventListener('visibilitychange',()=>playback(!document.hidden));
window.addEventListener('hashchange',()=>{if(!home())playback(false);setTimeout(mount,65)});
window.addEventListener('pagehide',()=>playback(false));
window.addEventListener('pageshow',()=>setTimeout(mount,60));
window.addEventListener('resize',()=>{if(stage?.isConnected){size();if(reduced())paint(16)}},{passive:true});
const motion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
motion?.addEventListener?.('change',()=>{if(!stage?.isConnected)return;if(reduced()){playback(false);size();paint(16)}else{started=performance.now()-12000;playback(true)}});
['scholaverum:editorial-home-mounted','scholark:topbar-ready','scholark-runtime-ready','scholark-return-home'].forEach(e=>window.addEventListener(e,()=>setTimeout(mount,55)));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,70),{once:true});else setTimeout(mount,70);
window.__SCHOLAVERUM_R299_PLANET__={
 version:VERSION,mount,skip:skipIntro,
 state:()=>({mounted:!!stage?.isConnected,phase:lastPhase,progress:progress,introMs,renderedFrames,
  canvas:canvas?[canvas.width,canvas.height]:null,moons:5,rings:4,paused:!inView,reduced:reduced()})
};
})();