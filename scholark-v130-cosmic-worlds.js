(() => {
'use strict';
if(window.__SCHOLAVERUM_R300_COSMOS__)return;
const VERSION='r300-cosmic-cinematics';
const REDUCE=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const HOME=()=>document.body?.classList.contains('v280-home-rebuild')&&document.querySelector('#v280-editorial-home');
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sceneList=['vision','workspace','arki','tutor','language','focus','schools','final'];
const worlds=[
 {seed:231,purple:'#7d36e6',lime:'#ccff82',nebula:'#9741d7',light:'#f2cdff',angle:-.5,planet:.78,halo:1.3},
 {seed:117,purple:'#7951ec',lime:'#c4f78b',nebula:'#4f63b9',light:'#e3ebff',angle:.35,planet:.48,halo:.7},
 {seed:488,purple:'#9947f3',lime:'#c8ff75',nebula:'#733acc',light:'#e7d8ff',angle:-.25,planet:.62,halo:1.1},
 {seed:357,purple:'#776ce1',lime:'#c8efab',nebula:'#4365ae',light:'#dce8ff',angle:.5,planet:.39,halo:.65},
 {seed:763,purple:'#7134df',lime:'#adff8f',nebula:'#387b99',light:'#c2ffdf',angle:-.7,planet:.47,halo:.9},
 {seed:982,purple:'#8559df',lime:'#c5ff73',nebula:'#4d408b',light:'#f5e8ff',angle:.12,planet:.66,halo:.32},
 {seed:433,purple:'#8651dc',lime:'#bafe7b',nebula:'#5b748e',light:'#e6ffe5',angle:-.53,planet:.46,halo:.8},
 {seed:814,purple:'#8d38ef',lime:'#c9ff6a',nebula:'#ae4ab7',light:'#fff0dc',angle:-.15,planet:.83,halo:1.6}
];
const RAND=seed=>()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
let hero=null,heroCanvas=null,heroCtx=null,heroResize=null,view=null,raf=0,last=0,frames=0,pointerX=0,pointerY=0,visible=false,heroTexture=null,lastStillSize='';
const textures=new Map(),ctxCache=new Map();
function ellipse(c,x,y,rX,rY,angle=0){c.beginPath();c.ellipse(x,y,rX,rY,angle,0,TAU)}
function blurred(c,x,y,r,color,opacity){
 if(opacity<=0)return;
 const grad=c.createRadialGradient(x,y,0,x,y,Math.max(r,2));
 grad.addColorStop(0,color);
 grad.addColorStop(.21,color);
 grad.addColorStop(1,'transparent');
 c.save();c.globalAlpha=opacity;c.fillStyle=grad;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();
}
function nebula(seed,purple,lime,light,variant=0){
 const key=seed+'-'+variant;if(textures.has(key))return textures.get(key);
 const surface=document.createElement('canvas'),w=1024,h=660;
 surface.width=w;surface.height=h;const c=surface.getContext('2d',{alpha:false}),rnd=RAND(seed);
 c.fillStyle='#070814';c.fillRect(0,0,w,h);
 // Hundreds of translucent volume layers, baked once, give the nebula natural depth.
 for(let band=0;band<5;band++){
  let anchorX=w*(.1+rnd()*.88),anchorY=h*(.03+rnd()*.9),angle=-.55+rnd()*1.3;
  for(let j=0;j<95;j++){
   const drift=j/95,spread=band===0?.26:.18;
   const x=anchorX+Math.cos(angle)*drift*w*.4+(rnd()-.5)*w*spread;
   const y=anchorY+Math.sin(angle)*drift*h*.56+(rnd()-.5)*h*spread;
   const radius=20+rnd()*140;
   blurred(c,x,y,radius,[purple,light,lime,'#7562c5','#843ec9'][band],.028+rnd()*.054);
  }
 }
 // Filamentary turbulent arc structure and deep space dust.
 c.save();c.globalCompositeOperation='screen';
 for(let k=0;k<115;k++){
  c.beginPath();const sx=rnd()*w,sy=rnd()*h;
  c.moveTo(sx,sy);
  c.bezierCurveTo(sx+(-.5+rnd())*210,sy+(-.5+rnd())*150,sx+(-.5+rnd())*270,sy+(-.5+rnd())*200,sx+(-.5+rnd())*380,sy+(-.5+rnd())*250);
  c.strokeStyle=k%5===0?lime:k%3===0?light:purple;c.globalAlpha=.025+rnd()*.065;c.lineWidth=.3+rnd()*3.2;c.stroke();
 }
 c.restore();
 for(let i=0;i<920;i++){
  const x=rnd()*w,y=rnd()*h,r=rnd()>.97?1.55:rnd()*.75+.15;
  c.fillStyle=i%13===0?lime:i%4===0?'#d9c1ff':'#f7f5ff';
  c.globalAlpha=.1+rnd()*.8;ellipse(c,x,y,r,r);c.fill();
  if(i%63===0){c.globalAlpha=.18;c.strokeStyle='#eee6ff';c.lineWidth=.7;c.beginPath();c.moveTo(x-r*4,y);c.lineTo(x+r*4,y);c.moveTo(x,y-r*4);c.lineTo(x,y+r*4);c.stroke()}
 }
 c.globalAlpha=1;textures.set(key,surface);return surface;
}
function smoothPlanet(c,x,y,r,world,sec=0,opacity=.78){
 if(r<=1)return;c.save();c.globalAlpha=opacity;
 blurred(c,x-r*.25,y-r*.22,r*2,world.purple,.16);
 const bg=c.createRadialGradient(x-r*.65,y-r*.65,r*.07,x+r*.25,y+r*.15,r*1.45);
 bg.addColorStop(0,'#546393');bg.addColorStop(.17,world.purple);bg.addColorStop(.32,'#2c225a');bg.addColorStop(.64,'#181b35');bg.addColorStop(1,'#050716');
 c.fillStyle=bg;ellipse(c,x,y,r,r);c.fill();
 c.save();ellipse(c,x,y,r,r);c.clip();
 const rnd=RAND(world.seed+19);
 for(let j=0;j<72;j++){
  const a=j*.3+sec*.007,u=(rnd()-.5)*2,v=(rnd()-.5)*2,px=x+u*r*1.1,py=y+v*r*1.1;
  c.strokeStyle=j%3?world.purple:world.lime;c.globalAlpha=.05+(j%9)*.007;c.lineWidth=(j%7===0?2.5:.9)*Math.max(.6,r/250);
  ellipse(c,px,py,r*(.13+rnd()*.24),r*(.014+rnd()*.045),a);c.stroke();
 }
 const terminator=c.createLinearGradient(x-r,y-r*.2,x+r,y+r*.35);
 terminator.addColorStop(0,'rgba(9,8,26,0)');terminator.addColorStop(.6,'rgba(3,3,15,.29)');terminator.addColorStop(1,'rgba(0,1,7,.92)');
 c.globalAlpha=1;c.fillStyle=terminator;c.fillRect(x-r,y-r,r*2,r*2);c.restore();
 c.strokeStyle=world.light;c.lineWidth=Math.max(1,r*.008);c.globalAlpha=.66;ellipse(c,x,y,r,r);c.stroke();
 c.restore();
}
function asteroid(c,x,y,s,shade,phase=0){
 c.save();c.translate(x,y);c.rotate(phase);c.shadowColor='#02010b';c.shadowBlur=s*.8;
 const g=c.createLinearGradient(-s,-s,s,s);g.addColorStop(0,shade);g.addColorStop(.35,'#313047');g.addColorStop(1,'#080a15');
 c.fillStyle=g;c.beginPath();
 for(let i=0;i<11;i++){const a=TAU*i/11,R=s*(.70+.2*Math.sin(i*8.22+phase));i?c.lineTo(Math.cos(a)*R,Math.sin(a)*R):c.moveTo(Math.cos(a)*R,Math.sin(a)*R)}
 c.closePath();c.fill();c.shadowBlur=0;c.globalAlpha=.32;c.strokeStyle='#a798d0';c.lineWidth=1;c.stroke();c.restore();
}
function arcBand(c,x,y,r,angle,bright=.45,purple='#9b8aef',lime='#c9ff6a',phase=0){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(1,.4);c.lineCap='round';
 for(let i=0;i<3;i++){c.beginPath();c.ellipse(0,0,r*(1+.15*i),r*(1+.15*i),0,.07+phase*.004+i*.24,TAU*.85+phase*.002);
  c.strokeStyle=i%2===0?lime:purple;c.globalAlpha=bright*(.7-i*.17);c.lineWidth=i===0?2.2:1.1;c.stroke();}
 c.restore();
}
// Small spacecraft and dynamic space details live in the BACKGROUND, never above the hero text.
function meteor(c,x,y,len,color,alpha=.85){
 if(alpha<=.01)return;
 const dx=-len*.94,dy=len*.33;
 c.save();c.globalCompositeOperation='screen';c.lineCap='round';
 const g=c.createLinearGradient(x,y,x+dx,y+dy);
 g.addColorStop(0,'rgba(255,255,255,0)');
 g.addColorStop(.35,color);g.addColorStop(.87,'#ece7ff');g.addColorStop(1,'#fff');
 c.globalAlpha=alpha;c.strokeStyle=g;c.lineWidth=Math.max(1,len*.023);
 c.beginPath();c.moveTo(x+dx,y+dy);c.lineTo(x,y);c.stroke();
 blurred(c,x,y,Math.max(7,len*.11),color,.50*alpha);
 c.restore();
}
function rocket(c,x,y,unit,t,world){
 if(unit<.3)return;c.save();c.translate(x,y);c.rotate(-.58);c.scale(unit,unit);
 const hull=c.createLinearGradient(-4,0,4,0);
 hull.addColorStop(0,'#343752');hull.addColorStop(.30,'#f0f0fc');hull.addColorStop(.53,'#9c9dca');hull.addColorStop(1,'#3c365d');
 c.fillStyle=hull;c.beginPath();c.moveTo(0,-16);c.bezierCurveTo(5,-12,6,8,4,12);c.lineTo(-4,12);c.bezierCurveTo(-6,8,-5,-12,0,-16);c.fill();
 c.fillStyle=world.purple;c.beginPath();c.moveTo(-4,3);c.lineTo(-10,15);c.lineTo(-3,11);c.lineTo(3,11);c.lineTo(10,15);c.lineTo(4,3);c.fill();
 c.fillStyle='#1c1845';ellipse(c,0,-5,2.4,4);c.fill();
 c.fillStyle='#b3f3ff';ellipse(c,-.8,-6,1.2,1.6);c.fill();
 c.globalAlpha=.6+.25*Math.sin(t*.6);
 const flame=c.createLinearGradient(0,11,0,24);flame.addColorStop(0,world.lime);flame.addColorStop(1,'rgba(145,113,255,0)');
 c.fillStyle=flame;c.beginPath();c.moveTo(-2,11);c.lineTo(0,22);c.lineTo(2,11);c.fill();
 c.restore();
}
function satellite(c,x,y,unit,t,world){
 c.save();c.translate(x,y);c.rotate(.12+Math.sin(t*.15+x*.001)*.045);c.scale(unit,unit);
 for(const side of [-1,1]){
  const x=side*11;
  const panel=c.createLinearGradient(x-10,-6,x+9,8);panel.addColorStop(0,'#28345d');panel.addColorStop(.5,'#5570ae');panel.addColorStop(1,'#0c193d');
  c.fillStyle=panel;c.fillRect(x-9,-7,18,14);c.strokeStyle='#a6abd1';c.lineWidth=.9;c.strokeRect(x-9,-7,18,14);
  c.strokeStyle='rgba(196,216,255,.35)';c.lineWidth=.55;
  for(let n=-4;n<=4;n+=4){c.beginPath();c.moveTo(x+n,-6);c.lineTo(x+n,6);c.stroke()}
  c.beginPath();c.moveTo(x-8,0);c.lineTo(x+8,0);c.stroke();
 }
 const core=c.createLinearGradient(-6,-8,6,8);core.addColorStop(0,'#f0edff');core.addColorStop(.38,'#7e7aa3');core.addColorStop(1,'#26263d');
 c.fillStyle=core;c.fillRect(-5,-7,10,14);c.strokeStyle=world.lime;c.lineWidth=1;c.strokeRect(-5,-7,10,14);
 c.strokeStyle='#cbdcff';c.lineWidth=1;c.beginPath();c.moveTo(0,-7);c.lineTo(3,-17);c.stroke();
 c.fillStyle=world.lime;ellipse(c,3,-17,2,2);c.fill();
 c.restore();
}
function spaceDetails(c,w,h,index,time,kind,world){
 const small=Math.min(w,h),t=REDUCE()?0:time/1000,view=kind==='hero';
 const seed=index*.53;
 smoothPlanet(c,w*(.92-.04*Math.sin(seed)),h*(.18+.05*Math.cos(seed)),small*(view?.084:.075),world,t,.58);
 smoothPlanet(c,w*(.61+.025*Math.cos(seed)),h*(.79-.045*Math.sin(seed)),small*(view?.067:.052),world,t,.52);
 if(index===0||index===6||index===7)smoothPlanet(c,w*.98,h*.82,small*.031,world,t,.41);
 if(index!==5){
  satellite(c,w*(view?.69:.88),h*(index===4?.19:.21),clamp(small*.00117,.48,1.15),t,world);
  if(view||index===1||index===6||index===7)satellite(c,w*.88,h*.77,clamp(small*.00074,.35,.8),-t*.3,world);
 }
 if(view||index===1||index===6){
  const flight=REDUCE()?0:Math.sin(t*.10+index*.3);
  rocket(c,w*(.73+flight*.025),h*(.12+flight*.013),clamp(small*.0010,.4,1.0),t,world);
 }
 if(REDUCE())return;
 const colors=[world.light,world.lime,world.purple,'#f5e5ff'];
 for(let i=0;i<(view?4:3);i++){
  const period=12+i*3,cycle=((t+i*5.8+index*.9)%period+period)%period;
  const active=cycle<1.65?Math.sin(Math.PI*cycle/1.65):0;
  if(active<.025)continue;
  const right=.58+.1*(i%4),top=.10+.20*((i+index)%3);
  meteor(c,w*(right-cycle*.08),h*(top+cycle*.049),small*(.10+i*.033),colors[i],active*(i===0?.88:.56));
 }
}
function screen(c,w,h,index,time,kind){
 const world=worlds[index]||worlds[0],tex=nebula(world.seed,world.purple,world.lime,world.light,index);
 const zoom=1.08+(REDUCE()?0:.018*Math.sin(time*.00008+index)),pan=REDUCE()?0:Math.sin(time*.00012+index)*w*.012;
 c.save();c.clearRect(0,0,w,h);
 const dw=w*zoom,dh=h*zoom;c.drawImage(tex,-(dw-w)/2+pan,-(dh-h)/2,dw,dh);
 // Saturated depth and luminous color spanning the full cinematic field.
 blurred(c,w*.68,h*.27,Math.min(w,h)*.65,world.purple,index===5?.075:.23);
 blurred(c,w*.92,h*.62,Math.min(w,h)*.55,world.lime,index===5?.025:.12);
 blurred(c,w*.46,h*.11,Math.min(w,h)*.43,world.nebula,index===5?.04:.12);
 // Side planets and the galaxy halo create actual depth layers behind the copy/UI.
 const size=Math.min(w,h),px=w*(kind==='hero'?.77:.79),py=h*(index===5?.78:.60);
 if(index===0||index===7){
  blurred(c,w*.69,h*.28,size*.55,world.purple,.21);
  blurred(c,w*.88,h*.52,size*.41,world.lime,.10);
 }
 if(index===5){smoothPlanet(c,w*.89,h*.77,size*.42,world,time*.001,.48)}
 else if(index===4){smoothPlanet(c,w*.94,h*.69,size*.39,world,time*.001,.40)}
 else if(index===6){smoothPlanet(c,w*.87,h*.67,size*.31,world,time*.001,.56)}
 else if(index===2){smoothPlanet(c,w*.90,h*.77,size*.23,world,time*.001,.40)}
 else if(index===7){smoothPlanet(c,w*.87,h*.56,size*.30,world,time*.001,.45)}
 else if(index===0){smoothPlanet(c,w*.91,h*.65,size*.27,world,time*.001,.52)}
 const r=size*(kind==='hero'?.57:.40);
 arcBand(c,px,py,r,-.30,kind==='hero'?.35:.22,world.purple,world.lime,time*.0003);
 const rng=RAND(world.seed+285);
 for(let a=0;a<(kind==='hero'?30:20);a++){
  const theta=rng()*TAU,d=size*(.17+rng()*1.04),ax=w*.68+Math.cos(theta)*d,ay=h*.46+Math.sin(theta)*d*.54,sz=2+rng()*(kind==='hero'?16:11);
  asteroid(c,ax,ay,sz,a%3?'#695b8c':'#b1a3d5',theta+(REDUCE()?0:time*.000028*(a%3)));
 }
 spaceDetails(c,w,h,index,time,kind,world);
 // Screen-space illuminated foreground dust and vignette for readability.
 const veil=c.createLinearGradient(0,0,w,0);
 veil.addColorStop(0,'rgba(5,6,15,.91)');veil.addColorStop(.32,'rgba(5,6,15,.73)');
 veil.addColorStop(.54,'rgba(5,6,15,.26)');veil.addColorStop(1,'rgba(4,5,13,.05)');
 c.fillStyle=veil;c.fillRect(0,0,w,h);
 const bottom=c.createLinearGradient(0,0,0,h);
 bottom.addColorStop(0,'rgba(4,5,13,.23)');bottom.addColorStop(.6,'rgba(6,7,15,.04)');bottom.addColorStop(1,'rgba(4,5,15,.7)');
 c.fillStyle=bottom;c.fillRect(0,0,w,h);
 c.restore();
}
function resizeCanvas(c,limit=2600){
 const box=c.getBoundingClientRect();if(box.width<2||box.height<2)return null;
 const dpr=clamp(Math.min(window.devicePixelRatio||1,innerWidth<700?1.2:1.55,limit/box.width,1800/box.height),.5,2);
 const ww=Math.round(box.width*dpr),hh=Math.round(box.height*dpr);
 if(c.width!==ww||c.height!==hh){c.width=ww;c.height=hh}
 const context=c.getContext('2d',{alpha:false});context.setTransform(dpr,0,0,dpr,0,0);
 return [context,box.width,box.height];
}
function heroFrame(now){
 raf=0;if(!visible||document.hidden||!HOME()||!heroCanvas?.isConnected)return;
 if(now-last<42&&!REDUCE()){raf=requestAnimationFrame(heroFrame);return}
 last=now;const target=resizeCanvas(heroCanvas,2400);
 if(target){const [ctx,w,h]=target,still=REDUCE(),key=heroCanvas.width+'x'+heroCanvas.height;
  if(!still||key!==lastStillSize){screen(ctx,w,h,0,now,'hero');frames++;lastStillSize=still?key:''}
 }
 if(!REDUCE())raf=requestAnimationFrame(heroFrame);
}
function setVisible(on){
 visible=!!on&&!document.hidden&&HOME();
 if(!visible){if(raf)cancelAnimationFrame(raf);raf=0;return}
 if(REDUCE()){heroFrame(performance.now());return}
 if(!raf)raf=requestAnimationFrame(heroFrame);
}
function mountHero(){
 if(!HOME())return;const host=document.querySelector('#v280-hero');
 if(!host)return;
 const old=document.querySelector('#v300-cosmos-field');
 if(old?.parentElement!==host){old?.remove();hero=null;heroCanvas=null}
 if(!hero){
  lastStillSize='';
  hero=document.createElement('div');hero.id='v300-cosmos-field';hero.setAttribute('aria-hidden','true');
  hero.innerHTML='<canvas id="v300-cosmos-canvas"></canvas>';
  host.insertBefore(hero,host.firstChild);heroCanvas=hero.querySelector('canvas');
  heroResize?.disconnect();heroResize=null;
  if('ResizeObserver' in window){heroResize=new ResizeObserver(()=>{if(REDUCE()&&visible)heroFrame(performance.now())});heroResize.observe(host)}
  view?.disconnect();if('IntersectionObserver'in window){view=new IntersectionObserver(entries=>entries.forEach(e=>setVisible(e.isIntersecting)),{rootMargin:'75px',threshold:0});view.observe(host)}
 }
 const r=host.getBoundingClientRect();
 if(r.bottom>0&&r.top<innerHeight)setVisible(true);
}
function renderPresentation(now,index,storyOpen){
 if(!storyOpen)return;const host=document.querySelector('#v298-cinema');
 if(!host||host.hidden)return;
 let c=document.getElementById('v300-story-world');
 if(!c){c=document.createElement('canvas');c.id='v300-story-world';c.setAttribute('aria-hidden','true');
  const a=host.querySelector('.v298-story-canvas');a?.insertAdjacentElement('afterend',c);}
 if(!c)return;
 const target=resizeCanvas(c,3840);if(!target)return;
 const [ctx,w,h]=target;screen(ctx,w,h,index,now,'story');host.dataset.cosmicScene=sceneList[index]||'vision';
}
window.addEventListener('hashchange',()=>{if(!HOME())setVisible(false);setTimeout(mountHero,85)});
document.addEventListener('visibilitychange',()=>setVisible(!document.hidden));
window.addEventListener('pagehide',()=>setVisible(false));
window.addEventListener('pageshow',()=>setTimeout(mountHero,65));
window.matchMedia?.('(prefers-reduced-motion: reduce)')?.addEventListener?.('change',()=>{if(REDUCE()){if(raf)cancelAnimationFrame(raf);raf=0;setVisible(true)}else setVisible(true)});
['scholaverum:editorial-home-mounted','scholark-return-home','scholark-runtime-ready'].forEach(evt=>window.addEventListener(evt,()=>setTimeout(mountHero,90)));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mountHero,100),{once:true});
else setTimeout(mountHero,100);
if(!document.getElementById('scholaverum-r300-style')){
 const l=document.createElement('link');l.id='scholaverum-r300-style';l.rel='stylesheet';l.href='scholark-v130-cosmic-worlds.css?v=20261020-r300';document.head.appendChild(l);
}
window.__SCHOLAVERUM_R300_COSMOS__={version:VERSION,paintStory:renderPresentation,mount:mountHero,state:()=>({mounted:!!hero?.isConnected,fullscreen:!!document.getElementById('v300-story-world'),textures:textures.size,frames,scenes:sceneList.length,visible,cosmicDetails:{distantPlanets:2,meteors:4,rocket:1,satellites:2}})};
})();