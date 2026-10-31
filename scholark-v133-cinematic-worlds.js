(() => {
'use strict';
if(window.__SCHOLAVERUM_R303_WORLDS__)return;
const VERSION='r305-cinematic-worlds-reimagined';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
const pi=Math.PI,TWO=2*pi;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const reduce=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const home=()=>!!document.body?.classList.contains('v280-home-rebuild')&&!!$('#v280-editorial-home');
const mobile=()=>innerWidth<760;
const cfg={
 arki:{name:'Intelligence Core',shade:'#9b65f8',light:'#c9ff6a',base:'#09081c',mid:'#27163f',accent:'#e6b9ff',stars:101},
 tutor:{name:'Knowledge Galaxy',shade:'#537bc9',light:'#c9ff6a',base:'#071621',mid:'#19344b',accent:'#d7eaff',stars:119},
 language:{name:'Global Connection',shade:'#9b67eb',light:'#aaffb0',base:'#130c2c',mid:'#342052',accent:'#f6d0ff',stars:137},
 focus:{name:'Time Observatory',shade:'#547bbb',light:'#adc7f9',base:'#0a1228',mid:'#17334e',accent:'#b8ffdf',stars:151},
 schools:{name:'Discovery Planet',shade:'#735bd7',light:'#c9ff6a',base:'#091529',mid:'#182e51',accent:'#c6eaf9',stars:163}
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
 grad.addColorStop(0,world.base);grad.addColorStop(.56,world.mid);grad.addColorStop(1,'#050715');
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

/* Restrained background depth: slow star current and an occasional comet. */
function atmosphere(c,w,h,key,t){
 const world=cfg[key],s=Math.min(w,h),rand=seedRand(world.stars*57+19);
 c.save();
 for(let i=0;i<18;i++){
  const px=rand(),py=rand(),speed=.0015+rand()*.0045;
  const x=(((px+t*speed)%1)+1)%1*w,y=(py+Math.sin(t*.08+i)*.008)*h;
  c.globalAlpha=.16+(i%4)*.075;c.fillStyle=i%5===0?world.light:'#edf0ff';
  circ(c,x,y,.5+(i%5)*.19);c.fill();
 }
 c.globalAlpha=1;
 arc(c,w*.48,h*.52,s*.62,s*.19,-.32,world.shade,.17,1.15,-.32,2.70);
 arc(c,w*.59,h*.55,s*.52,s*.12,.37,world.light,.10,.9,pi,5.8);
 if(!reduce()){
  const phase=((t+world.stars*.093)%19+19)%19;
  if(phase<1.85){
   const fade=Math.sin(pi*phase/1.85),headX=w*(.89-phase*.15),headY=h*(.10+phase*.12),len=s*.12;
   const streak=c.createLinearGradient(headX-len,headY-len*.54,headX,headY);
   streak.addColorStop(0,hexRGBA(world.accent,0));streak.addColorStop(1,hexRGBA(world.light,.74));
   c.strokeStyle=streak;c.lineWidth=Math.max(.7,s*.004);c.globalAlpha=fade*.65;
   c.beginPath();c.moveTo(headX-len,headY-len*.54);c.lineTo(headX,headY);c.stroke();
   c.globalAlpha=1;glow(c,headX,headY,s*.025,world.light,fade*.17);
  }
 }
 c.restore();
}
function foregroundDust(c,w,h,key,t){
 const world=cfg[key],s=Math.min(w,h),rand=seedRand(world.stars*19+7);c.save();
 for(let i=0;i<8;i++){
  const a=rand(),b=rand(),x=w*a+(reduce()?0:Math.sin(t*.12+i)*s*.012),y=h*b;
  c.globalAlpha=.11+(i%3)*.055;c.fillStyle=i%3===0?world.light:world.accent;
  circ(c,x,y,.7+(i%4)*.36);c.fill();
 }
 c.restore();
}


/* r305 — Five deliberately different visual languages, not five recoloured planets. */
function shape(c,points,fill,stroke,sw=1,opacity=1){
 c.save();c.globalAlpha=opacity;c.beginPath();
 points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();
 if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.lineWidth=sw;c.strokeStyle=stroke;c.stroke()}c.restore();
}
function hex(c,x,y,r,angle=0){
 c.beginPath();
 for(let i=0;i<6;i++){const a=angle+pi/6+i*TWO/6;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?c.lineTo(px,py):c.moveTo(px,py)}
 c.closePath();
}
function roundPanel(c,x,y,w,h,r,fill,stroke){
 c.beginPath();const rad=Math.max(0,Math.min(r,w/2,h/2));
 c.moveTo(x+rad,y);c.lineTo(x+w-rad,y);c.quadraticCurveTo(x+w,y,x+w,y+rad);
 c.lineTo(x+w,y+h-rad);c.quadraticCurveTo(x+w,y+h,x+w-rad,y+h);
 c.lineTo(x+rad,y+h);c.quadraticCurveTo(x,y+h,x,y+h-rad);
 c.lineTo(x,y+rad);c.quadraticCurveTo(x,y,x+rad,y);c.closePath();
 if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}
}
function label(c,txt,x,y,size,color,align='center',weight=650){
 c.save();c.textAlign=align;c.textBaseline='middle';
 c.font=weight+' '+Math.max(8,Math.round(size))+'px Inter,system-ui,sans-serif';
 c.fillStyle=color;c.fillText(txt,x,y);c.restore();
}
function electric(c,a,b,color,width=1,alpha=.65){
 c.save();c.strokeStyle=color;c.lineWidth=width;c.globalAlpha=alpha;c.beginPath();
 c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();c.restore();
}
function arki(c,w,h,t,world,camera,hero){
 const s=Math.min(w,h),cx=w*.52+camera[0]*.18,cy=h*.52+camera[1]*.13,r=s*.232;
 const phase=reduce()?1.25:t*.28;
 glow(c,cx,cy,r*2.5,'#8447d0',.41);
 // Intelligence is now a crystalline neural engine with circuit corridors,
 // an energy vortex and four orbiting modules—not the old generic globe.
 c.save();
 for(let i=-4;i<=4;i++){
  const yy=cy+i*r*.31;
  const near=Math.sqrt(Math.max(0,1-Math.pow(i/6,2)));
  electric(c,[w*.07,yy-r*.08],[cx-r*1.25*near,yy],i%2?'#8a65ce':'#c9ff6a',.75,.10);
  electric(c,[cx+r*1.25*near,yy],[w*.94,yy+r*.10],i%2?'#c7a3f7':'#c9ff6a',.75,.10);
 }
 for(let i=0;i<17;i++){
  const a=i*TWO/17+phase*.15;
  const orbitR=r*(1.58+.06*Math.sin(i*2.4));
  const x=cx+Math.cos(a)*orbitR,y=cy+Math.sin(a)*orbitR*.78;
  if(i%2===0){electric(c,[x,y],[cx+Math.cos(a+.4)*r*.96,cy+Math.sin(a+.4)*r*.85],world.accent,.8,.22)}
  glow(c,x,y,r*.12,i%3===0?world.light:world.accent,.24);
  c.fillStyle=i%3===0?world.light:'#d9c9ff';circ(c,x,y,Math.max(1,r*.029));c.fill();
 }
 c.restore();
 arc(c,cx,cy,r*1.60,r*1.18,-.23,'#ab79fc',.48,Math.max(1.2,s*.005),.26,5.8);
 arc(c,cx,cy,r*1.79,r*1.36,.37,world.light,.50,Math.max(1,s*.004),-1.1,2.18);
 for(let i=0;i<3;i++){
  const a=phase*(i%2?-1:1)+i*TWO/3;
  const x=cx+Math.cos(a)*r*1.68,y=cy+Math.sin(a)*r*1.24;
  glow(c,x,y,r*.29,i%2?world.light:world.accent,.39);
  hex(c,x,y,r*.085,a);c.fillStyle=i%2?world.light:'#e0beff';c.fill();
 }
 const ring=reduce()?0:t*.10;
 for(let k=3;k>=0;k--){
  hex(c,cx,cy,r*(1.02+k*.18),ring*(k%2?-.6:.7)+k*.13);
  c.strokeStyle=k%2?world.light:'#b994ff';c.globalAlpha=.16+k*.08;c.lineWidth=1+k*.28;c.stroke();
 }c.globalAlpha=1;
 const facet=c.createLinearGradient(cx-r,cy-r,cx+r,cy+r);
 facet.addColorStop(0,'#eee1ff');facet.addColorStop(.19,'#b17aff');
 facet.addColorStop(.55,'#351c78');facet.addColorStop(1,'#111133');
 hex(c,cx,cy,r*.94,pi/6);
 c.fillStyle=facet;c.fill();c.lineWidth=Math.max(1.4,r*.04);c.strokeStyle='#dfb8ff';c.stroke();
 hex(c,cx,cy,r*.75,-pi/6);c.strokeStyle=world.light;c.globalAlpha=.66;c.lineWidth=Math.max(1,r*.019);c.stroke();c.globalAlpha=1;
 // Faceted crystal center with bright brand-colour edges.
 for(let i=0;i<6;i++){
  const a=i*TWO/6+pi/6,px=cx+Math.cos(a)*r*.84,py=cy+Math.sin(a)*r*.84;
  shape(c,[[cx,cy-r*.28],[px,py],[cx,cy+r*.28]],i%2?'#693cb9':'#442589',null,1,.32);
 }
 glow(c,cx,cy,r*.71,'#c9ff6a',.34);
 label(c,'ARKI',cx,cy-s*.015,s*.125,'#f6e9ff','center',800);
 label(c,'INTELLIGENCE ONLINE',cx,cy+s*.105,s*.037,'#c9ff6a','center',760);
 // Energy can be seen moving through the external intelligence conduits.
 for(let i=0;i<4;i++){
  const a=i*pi/2+phase*.32,p=.5+.5*Math.sin(phase+i*.8);
  const x=cx+Math.cos(a)*r*(1.18+p*.4),y=cy+Math.sin(a)*r*(1.10+p*.25);
  glow(c,x,y,r*.24,world.light,.27);c.fillStyle=world.light;circ(c,x,y,Math.max(1.7,r*.045));c.fill();
 }
}
function tutor(c,w,h,t,world,camera){
 const s=Math.min(w,h),cx=w*.50+camera[0]*.18,cy=h*.58+camera[1]*.12,bob=reduce()?0:Math.sin(t*.53)*s*.012;
 const y=cy+bob,r=s*.30;
 glow(c,cx,cy,s*.68,'#376aa4',.29);
 // Towering rays emanating from a real floating holographic open book.
 for(let i=0;i<10;i++){
  const a=-pi*.89+i*pi*.087,power=.14+(i%3)*.045;
  const endX=cx+Math.cos(a)*s*.66,endY=cy+Math.sin(a)*s*.78;
  electric(c,[cx,y-r*.35],[endX,endY],i%2?world.light:'#8ad5f6',i%3?.7:1.25,power);
 }
 const lines=[['E = mc²',.13,.21],['∫ f(x) dx',.79,.22],['x² + y²',.18,.75],['∑',.83,.76],['π',.54,.13]];
 lines.forEach(([word,fx,fy],i)=>{
  const x=w*fx,y=h*fy+(reduce()?0:Math.sin(t*.35+i)*s*.012);
  glow(c,x,y,s*.10,i%2?world.light:world.accent,.09);
  label(c,word,x,y,s*(word.length>5?.045:.062),i%2?'#bafce0':'#e1f4ff');
 });
 // The book has two sculpted pages, a spine, shadows and turning paper.
 c.save();c.translate(cx,y);c.rotate(reduce()?-0.06:-.06+Math.sin(t*.13)*.013);
 const left=[[-r*.95,-r*.37],[-r*.10,-r*.50],[-r*.05,r*.35],[-r*1.10,r*.24]];
 const right=[[r*.08,-r*.50],[r*1.03,-r*.40],[r*1.10,r*.27],[r*.07,r*.35]];
 glow(c,0,0,r*1.85,'#b5dcf8',.22);
 shape(c,left,'#e3e9f7','#b3f5e8',Math.max(1,s*.008));
 shape(c,right,'#f4f7ff','#b3f5e8',Math.max(1,s*.008));
 shape(c,[[-r*.06,-r*.5],[r*.075,-r*.50],[r*.07,r*.35],[-r*.05,r*.35]],'#35587b','#a9fce7',1);
 for(let i=0;i<4;i++){
  const yy=-r*.27+i*r*.17;
  electric(c,[-r*.84,yy],[-r*.25,yy-r*.09],'#708baa',Math.max(1,r*.018),.67);
  electric(c,[r*.26,yy-r*.07],[r*.84,yy],'#597da7',Math.max(1,r*.018),.64);
 }
 const turn=reduce()?0:Math.max(0,Math.sin(t*.30));
 shape(c,[[-r*.04,-r*.43],[r*.05,-r*.48],[r*(.32+turn*.45),-r*(.58+turn*.20)],[r*.09,r*.31]],'#c7d8ed','#e9fff6',1,.65);
 c.restore();
 // Three tangible knowledge modules levitate above the open pages.
 for(let i=0;i<3;i++){
  const a=t*.18+i*2.09,px=cx+(i-1)*r*.64+Math.sin(a)*r*.13;
  const py=cy-r*(1.28+(.16*Math.sin(a+.4)));
  const size=r*(i===1?.24:.19);
  glow(c,px,py,size*1.6,i===1?world.light:'#92cafa',.19);
  c.save();c.translate(px,py);c.rotate(Math.sin(a)*.09);
  shape(c,[[-size,-size*.80],[size,-size*.8],[size,size*.8],[-size,size*.8]],'#13283f',i===1?world.light:'#a5d9f9',1.1);
  label(c,i===0?'π':i===1?'✓':'∑',0,0,size*1.24,i===1?world.light:'#d9e8ff');c.restore();
 }
 label(c,'LEARN · PRACTISE · MASTER',cx,h*.91,s*.034,'#b9f5da','center',760);
}
function languages(c,w,h,t,world,camera){
 const s=Math.min(w,h),cx=w*.51+camera[0]*.17,cy=h*.53+camera[1]*.10,r=s*.278;
 glow(c,cx,cy,r*2.10,'#935be5',.34);
 arc(c,cx,cy,r*1.36,r*.39,-.34,'#e6c1ff',.42,1.5);
 arc(c,cx,cy,r*1.55,r*.62,.46,world.light,.25,1.2);
 // An unmistakable world globe—rotating grid, illuminated continents, routes and translation cards.
 sphere(c,cx,cy,r,world,t,{pale:'#d1b7fc',middle:'#223773',glow:.30});
 c.save();circ(c,cx,cy,r*.98);c.clip();
 const meridian=reduce()?0:Math.sin(t*.13)*.20;
 for(let lat=-3;lat<=3;lat++){
  const dy=lat*r*.23,span=Math.sqrt(Math.max(0,r*r-dy*dy));
  arc(c,cx,cy+dy,span,Math.max(1,span*.22),0,'#d6cbff',.27,1.1);
 }
 for(let i=0;i<8;i++){
  const lon=(i/8)*TWO+t*.12;
  arc(c,cx,cy,Math.max(1,Math.abs(Math.sin(lon))*r),r,0,world.light,.14,1);
 }
 // Stylised continental landmasses move inside the circular clipping region.
 const continentPaths=[
  [[-.57,-.49],[-.32,-.70],[-.04,-.51],[-.15,-.29],[-.36,-.20],[-.25,.07],[-.48,.14],[-.59,-.22]],
  [[.05,-.50],[.41,-.60],[.68,-.33],[.49,-.03],[.62,.19],[.34,.36],[.12,.14],[-.02,-.09]],
  [[-.26,.20],[-.06,.17],[.06,.47],[-.17,.77],[-.32,.48]],
  [[.51,.45],[.73,.48],[.79,.71],[.58,.71]]
 ];
 continentPaths.forEach((poly,i)=>{
  const drift=meridian+(i%2?.05:-.03);
  const coords=poly.map(([dx,dy])=>[cx+(dx+drift)*r,cy+dy*r]);
  shape(c,coords,i%2?'#7cceb5':'#8c97e6',null,0,.50);
  polyline(c,coords,world.light,.38,.8);
 });
 c.restore();
 const translations=[{x:.13,y:.18,txt:'HELLO',col:'#d9c4ff'},{x:.84,y:.20,txt:'HOLA',col:'#c9ff6a'},{x:.15,y:.82,txt:'BONJOUR',col:'#e8cbff'},{x:.84,y:.79,txt:'你好',col:'#c9ff6a'}];
 translations.forEach((p,i)=>{
  const x=w*p.x,y=h*p.y+(reduce()?0:Math.sin(t*.42+i)*s*.015),ww=s*(p.txt.length>6?.32:.25),hh=s*.14;
  glow(c,x,y,s*.13,p.col,.11);
  roundPanel(c,x-ww*.5,y-hh*.5,ww,hh,s*.024,'rgba(16,13,48,.83)',p.col);
  label(c,p.txt,x,y,s*.047,p.col,'center',770);
  const endX=cx+Math.cos(i*pi*.5+.3)*r*.80,endY=cy+Math.sin(i*pi*.5+.3)*r*.73;
  c.save();c.strokeStyle=p.col;c.globalAlpha=.42;c.lineWidth=1.3;
  c.beginPath();c.moveTo(x,y);c.quadraticCurveTo((x+endX)*.5,cy-s*.10,endX,endY);c.stroke();c.restore();
  const q=(t*.19+i*.24)%1,inv=1-q,px=inv*inv*x+2*inv*q*(x+endX)*.5+q*q*endX;
  const py=inv*inv*y+2*inv*q*(cy-s*.10)+q*q*endY;
  glow(c,px,py,s*.04,p.col,.33);c.fillStyle=p.col;circ(c,px,py,Math.max(1.5,s*.008));c.fill();
 });
}
function focus(c,w,h,t,world,camera){
 const s=Math.min(w,h),cx=w*.51+camera[0]*.15,cy=h*.52+camera[1]*.09,r=s*.31;
 glow(c,cx,cy,r*2.05,'#3c5fba',.27);
 // Mission-control chronograph, not another generic space sphere.
 for(let i=0;i<3;i++)arc(c,cx,cy,r*(1.10+i*.17),r*(1.10+i*.17),0,i%2?world.light:'#7ca4f9',.12+i*.05,Math.max(1,s*.005),-.8,4.6);
 c.save();c.translate(cx,cy);
 const face=c.createRadialGradient(-r*.45,-r*.45,0,0,0,r*1.18);
 face.addColorStop(0,'#27466c');face.addColorStop(.40,'#12243e');face.addColorStop(.9,'#080f24');face.addColorStop(1,'#080b1a');
 c.fillStyle=face;circ(c,0,0,r);c.fill();c.strokeStyle='#acc7ee';c.lineWidth=Math.max(1.5,s*.008);c.stroke();
 c.lineCap='round';
 for(let i=0;i<60;i++){
  const a=i*TWO/60-pi/2,major=i%5===0,rad1=r*(major?.79:.89),rad2=r*.97;
  c.strokeStyle=major?world.light:'#b2c7e8';c.globalAlpha=major?.87:.36;c.lineWidth=major?2.2:1;
  c.beginPath();c.moveTo(Math.cos(a)*rad1,Math.sin(a)*rad1);c.lineTo(Math.cos(a)*rad2,Math.sin(a)*rad2);c.stroke();
 }
 c.globalAlpha=1;
 const sweep=reduce()?-pi/2:t*.20-pi/2;
 c.strokeStyle=world.light;c.lineWidth=Math.max(3,s*.020);
 c.beginPath();c.arc(0,0,r*.73,-pi/2,sweep);c.stroke();
 glow(c,Math.cos(sweep)*r*.73,Math.sin(sweep)*r*.73,r*.20,world.light,.45);
 label(c,'24:59',0,-r*.06,s*.19,'#f2f9ff','center',770);
 label(c,'FOCUS MODE',0,r*.29,s*.053,'#bcefd9','center',780);
 c.restore();
 label(c,'DEEP WORK',w*.14,h*.15,s*.036,'#d4e7ff','left');
 label(c,'+ 25 MIN',w*.85,h*.85,s*.034,world.light,'right');
 const q=reduce()?1:t*.10;
 for(let i=0;i<4;i++){
  const a=q+i*pi*.5,px=cx+Math.cos(a)*r*1.38,py=cy+Math.sin(a)*r*1.38;
  c.fillStyle=i%2?'#b3b9fc':world.light;circ(c,px,py,Math.max(1.4,s*.012));c.fill();
 }
}
function schools(c,w,h,t,world,camera){
 const s=Math.min(w,h),cx=w*.51+camera[0]*.14,cy=h*.53+camera[1]*.11,r=s*.32;
 glow(c,cx,cy,r*1.85,'#517ab7',.22);
 // Global discovery is a living navigator's atlas: topographic terrain,
 // latitude grid, scan beam, anchored campuses and connection routes.
 const inset=s*.13,angle=reduce()?-.35:Math.sin(t*.13)*.045-.35;
 c.save();c.translate(cx,cy);c.rotate(angle);
 c.fillStyle='#0d233b';ellipse(c,0,0,r*1.23,r*.73,0);c.fill();
 c.strokeStyle='#94b9dd';c.lineWidth=Math.max(1,s*.005);c.stroke();
 c.save();ellipse(c,0,0,r*1.20,r*.72,0);c.clip();
 for(let i=-5;i<=5;i++){
  const off=i*r*.22;
  electric(c,[-r*1.4,off],[r*1.4,off],world.light,.8,.13);
  electric(c,[off,-r],[off,r],world.accent,.8,.14);
 }
 const islands=[
  [[-.84,-.35],[-.55,-.53],[-.21,-.25],[-.33,-.06],[-.60,.06],[-.85,-.14]],
  [[-.15,-.49],[.40,-.48],[.76,-.25],[.56,.15],[.11,.12],[-.11,-.15]],
  [[-.36,.10],[-.03,.14],[.13,.48],[-.16,.66],[-.42,.38]],
  [[.44,.31],[.88,.32],[.77,.58],[.55,.54]]
 ];
 islands.forEach((pts,i)=>{
  const coords=pts.map(([x,y])=>[x*r,y*r*.83]);
  shape(c,coords,i%2?'#3c607a':'#295b74','#82c5be',.7,.67);
 });
 // Scan cone sweeps over real map silhouettes.
 const sweep=reduce()?-.3:t*.20;
 c.save();c.rotate(sweep);c.beginPath();c.moveTo(0,0);c.arc(0,0,r*1.25,-.24,.24);c.closePath();
 c.fillStyle='rgba(201,255,106,.13)';c.fill();c.restore();
 c.restore();
 const points=[[-.62,-.26],[.27,-.33],[.63,.12],[-.18,.32]];
 points.forEach(([x,y],i)=>{
  if(i)polyline(c,[[points[i-1][0]*r,points[i-1][1]*r*.83],[x*r,y*r*.83]],world.light,.68,Math.max(1,s*.006));
  const px=x*r,py=y*r*.83;glow(c,px,py,r*.18,world.light,.34);
  c.fillStyle=world.light;circ(c,px,py,Math.max(2,r*.035));c.fill();
  c.strokeStyle='#edffe4';c.lineWidth=1.2;circ(c,px,py,r*.075);c.stroke();
 });
 c.restore();
 // GPS range and a destination card outside the atlas.
 arc(c,cx,cy,r*1.39,r*.88,-.36,world.light,.35,1.4,-.8,2.8);
 label(c,'WORLDWIDE SEARCH',cx,cy-r*1.30,s*.047,'#e5efff','center',760);
 roundPanel(c,w*.60,h*.78,s*.36,s*.13,s*.02,'rgba(11,24,48,.92)','#9ee8ba');
 label(c,'4 CAMPUSES',w*.60+s*.18,h*.78+s*.065,s*.043,world.light,'center',760);
}
function paintWorld(ctx,w,h,key,now,camera,large=false){
 const world=cfg[key]||cfg.arki,t=reduce()?2:now*.001,focusTime=large;
 frame(ctx,w,h,key,t,camera,focusTime);
 atmosphere(ctx,w,h,key,t);
 const draw=key==='arki'?arki:key==='tutor'?tutor:key==='language'?languages:key==='focus'?focus:schools;
 draw(ctx,w,h,t,world,camera,large);
 foregroundDust(ctx,w,h,key,t);
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
 l.href='scholark-v133-cinematic-worlds.css?v=20261030-r305';document.head.appendChild(l);
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