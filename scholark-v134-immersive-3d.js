/* SCHOLAVERUM r307 — real WebGL2 feature cinematics. No external engine or CDN. */
(()=>{'use strict';
const VERSION='r307-webgl-universe';
const ROOT=()=>document.querySelector('#v280-editorial-home');
const HOME=()=>!!document.body?.classList.contains('v280-home-rebuild')&&!!ROOT();
const REDUCED=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const vertex='#version 300 es\nin vec2 position;out vec2 uv;void main(){uv=position;gl_Position=vec4(position,0.,1.);}';
const fragment=(function(){/*
#version 300 es
precision highp float;
in vec2 uv;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
uniform int scene;
out vec4 pixel;
#define PI 3.141592653589793
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int k=0;k<4;k++){v+=a*noise(p);p=p*2.03+vec2(8.2,4.7);a*=.5;}return v;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec2 join2(vec2 a,vec2 b){return a.x<b.x?a:b;}
float sphere(vec3 p,float r){return length(p)-r;}
float box3(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float roundBox(vec3 p,vec3 b,float r){return box3(p,b)-r;}
float ring(vec3 p,float r,float tube){return length(vec2(length(p.xy)-r,p.z))-tube;}
float cylinder(vec3 p,float r,float h){vec2 d=abs(vec2(length(p.xy),p.z))-vec2(r,h);return min(max(d.x,d.y),0.)+length(max(d,0.));}
vec3 spin(vec3 p,float x,float y){p.xz=rot(y)*p.xz;p.yz=rot(x)*p.yz;return p;}
vec2 map(vec3 p){
 float t=time*.22;
 vec2 d=vec2(1e3,0.);
 if(scene==0){
  vec3 q=spin(p, .12+sin(t*.40)*.13,t*.65);
  d=join2(d,vec2(roundBox(q,vec3(.62,.65,.62),.19),1.));
  d=join2(d,vec2(sphere(q,.51),2.));
  for(int i=0;i<3;i++){float a=float(i)*1.047+t*.35;
   vec3 r=spin(p,a*.5,a);
   d=join2(d,vec2(ring(r,1.12,.026),3.));
  }
  for(int i=0;i<9;i++){float a=float(i)*2.399963+t*(i%2==0?.6:-.5);
   vec3 n=vec3(cos(a)*1.38,sin(a*1.7)*.64,sin(a)*.77);
   d=join2(d,vec2(sphere(p-n,.072+float(i%3)*.015),i%3==0?4.:3.));
  }
 }
 if(scene==1){
  vec3 q=p;q.yz=rot(-.30)*q.yz;
  vec3 l=q-vec3(-.62,-.10,0.);
  l.xy=rot(-.16)*l.xy;l.yz=rot(.23)*l.yz;
  vec3 r=q-vec3(.62,-.10,0.);
  r.xy=rot(.16)*r.xy;r.yz=rot(-.23)*r.yz;
  d=join2(d,vec2(roundBox(l,vec3(.67,.82,.075),.055),2.));
  d=join2(d,vec2(roundBox(r,vec3(.67,.82,.075),.055),2.));
  d=join2(d,vec2(roundBox(l+vec3(0.,0.,-.10),vec3(.63,.78,.018),.015),5.));
  d=join2(d,vec2(roundBox(r+vec3(0.,0.,-.10),vec3(.63,.78,.018),.015),5.));
  d=join2(d,vec2(cylinder(q-vec3(0.,-.12,.10),.085,.72),4.));
  for(int i=0;i<5;i++){
   float a=float(i)*1.2566+t*.23;
   vec3 n=vec3(cos(a)*1.7,sin(a)*1.12,-.35+sin(a*2.)*.32);
   d=join2(d,vec2(roundBox(spin(p-n,.2,a),vec3(.12,.16,.045),.015),i%2==0?3.:4.));
  }
 }
 if(scene==2){
  vec3 q=spin(p,.11,t*.34);
  d=join2(d,vec2(sphere(q,1.02),6.));
  d=join2(d,vec2(ring(spin(p,.7,t*.26),1.34,.022),4.));
  d=join2(d,vec2(ring(spin(p,-.68,t*.16),1.53,.018),3.));
  for(int i=0;i<4;i++){
   float a=float(i)*1.57+t*.30;
   vec3 n=vec3(cos(a)*1.78,sin(a)*.86,sin(a)*.65);
   d=join2(d,vec2(roundBox(spin(p-n,0.,-.35),vec3(.20,.28,.038),.035),i%2==0?5.:4.));
  }
 }
 if(scene==3){
  vec3 q=p;q.yz=rot(-.14)*q.yz;q.xz=rot(.22+sin(t*.18)*.06)*q.xz;
  d=join2(d,vec2(cylinder(q,.97,.15),1.));
  d=join2(d,vec2(ring(q-vec3(0.,0.,.15),.95,.08),4.));
  d=join2(d,vec2(cylinder(q-vec3(0.,0.,.165),.81,.018),2.));
  for(int i=0;i<12;i++){
   float a=float(i)*.523599;
   vec3 m=q-vec3(sin(a)*.72,cos(a)*.72,.25);
   m.xy=rot(-a)*m.xy;
   d=join2(d,vec2(roundBox(m,vec3(.019,.095,.022),.009),5.));
  }
  vec3 sec=q-vec3(0.,.22,.26);sec.xy=rot(-t*1.1)*sec.xy;
  d=join2(d,vec2(roundBox(sec,vec3(.03,.45,.027),.017),4.));
  vec3 minute=q-vec3(0.,.17,.28);minute.xy=rot(-t*.15)*minute.xy;
  d=join2(d,vec2(roundBox(minute,vec3(.053,.32,.023),.018),5.));
  d=join2(d,vec2(sphere(q-vec3(0.,0.,.31),.09),3.));
 }
 if(scene==4){
  vec3 q=p;q.yz=rot(-.24)*q.yz;
  d=join2(d,vec2(cylinder(q-vec3(0.,-.68,0.),1.23,.10),1.));
  d=join2(d,vec2(ring(spin(p-vec3(0.,-.50,0.),.77,t*.1),1.23,.021),4.));
  for(int i=0;i<7;i++){
   float a=float(i)*2.40,rr=.3+float(i%3)*.31;
   vec3 c=vec3(cos(a)*rr,-.30+float(i%3)*.04,sin(a)*rr*.55);
   vec3 b=p-c;b.yz=rot(-.24)*b.yz;
   d=join2(d,vec2(roundBox(b,vec3(.10+float(i%2)*.04,.30+float(i%3)*.12,.11),.025),i%2==0?5.:2.));
   d=join2(d,vec2(sphere(p-(c+vec3(0.,.36+float(i%3)*.12,0.)),.07),4.));
  }
  d=join2(d,vec2(ring(spin(p-vec3(0.,-.24,0.),.62,t*.42),1.67,.018),3.));
 }
 return d;
}
vec3 normalAt(vec3 p){vec2 e=vec2(.003,0.);return normalize(vec3(map(p+e.xyy).x-map(p-e.xyy).x,map(p+e.yxy).x-map(p-e.yxy).x,map(p+e.yyx).x-map(p-e.yyx).x));}
float shadow(vec3 ro,vec3 rd){float t=.025,s=1.;for(int i=0;i<11;i++){float h=map(ro+rd*t).x;s=min(s,11.*h/t);t+=clamp(h,.045,.35);if(h<.003||t>4.4)break;}return clamp(s,.25,1.);}
vec3 atmosphere(vec2 p){
 vec2 sky=p*vec2(1.5,1.0);
 float neb=fbm(sky*2.1+vec2(time*.007,-time*.004));
 float fil=pow(fbm(sky*5.3+vec2(.6,2.0)),2.2);
 vec3 col=mix(vec3(.009,.010,.034),vec3(.024,.010,.078),clamp(p.y*.5+.5,0.,1.));
 col+=vec3(.18,.062,.32)*pow(max(0.,neb-.43),2.)*2.0;
 col+=vec3(.085,.15,.11)*pow(max(0.,fil-.52),2.)*.8;
 vec2 starGrid=floor((p+vec2(2.7))*vec2(148.,98.));
 float star=step(.987,hash(starGrid)),flicker=.8+.2*sin(time*.4+hash(starGrid)*9.);
 col+=vec3(.82,.79,1.)*star*flicker*.52;
 float haze=exp(-dot(p-vec2(.31,.12),p-vec2(.31,.12))*4.4);
 col+=vec3(.075,.028,.155)*haze;
 return col;
}
vec3 material(float id,vec3 p){
 if(id<1.5)return vec3(.17,.11,.34);
 if(id<2.5)return vec3(.28,.24,.45);
 if(id<3.5)return vec3(.38,.28,.65);
 if(id<4.5)return vec3(.67,.96,.38);
 if(id<5.5)return vec3(.79,.82,.89);
 return vec3(.23,.40,.68);
}
void main(){
 vec2 p=(uv*2.-1.);p.x*=resolution.x/max(resolution.y,1.);
 vec2 look=(pointer-.5)*vec2(.19,.12);
 vec3 ro=vec3(look.x,look.y,5.45),rd=normalize(vec3(p*.95,-3.0));
 vec3 bg=atmosphere(p);
 if(scene==5){
  float aurora=pow(max(0.,fbm(p*vec2(1.3,2.2)+vec2(time*.01,.4))-.51),2.)*1.75;
  bg+=vec3(.15,.046,.25)*aurora;
  float beam=pow(max(0.,1.-abs(p.x*.65-p.y*.23-.46)),9.);
  bg+=vec3(.08,.13,.11)*beam*.22;
  pixel=vec4(pow(bg,vec3(.9)),1.);return;
 }
 float distance=0.,id=-1.,stepD=0.;
 vec3 hit=ro;
 for(int i=0;i<64;i++){
  hit=ro+rd*distance;
  vec2 ds=map(hit);
  stepD=ds.x;id=ds.y;
  if(stepD<.0035||distance>13.)break;
  distance+=max(stepD*.85,.01);
 }
 if(distance<13.&&stepD<.008){
  vec3 n=normalAt(hit);
  vec3 lightDir=normalize(vec3(-.62,.83,1.26));
  float diff=max(0.,dot(n,lightDir));
  float rim=pow(1.-max(dot(n,-rd),0.),3.);
  float sh=shadow(hit+n*.018,lightDir);
  float ao=1.;
  for(int j=1;j<=4;j++){float h=float(j)*.11;ao-=max(0.,h-map(hit+n*h).x)*(.25/h);}
  ao=clamp(ao,.55,1.);
  vec3 base=material(id,hit);
  if(scene==2 && id>5.5){vec3 s=normalize(spin(hit,.11,time*.22));float land=fbm(vec2(atan(s.z,s.x)*2.9,asin(s.y)*4.3));base=mix(vec3(.075,.19,.48),vec3(.36,.62,.39),smoothstep(.48,.57,land));}
  float metallic=id<1.5?.76:(id>3.5&&id<4.5?.22:.54);
  vec3 halfVec=normalize(lightDir-rd);
  float spec=pow(max(0.,dot(n,halfVec)),26.+metallic*55.);
  vec3 lighting=base*(.26+diff*sh*.94)*ao;
  lighting+=vec3(.72,.68,1.)*spec*(.18+metallic*.7)*sh;
  lighting+=mix(vec3(.23,.11,.48),vec3(.52,.84,.29),step(3.4,id))*rim*.35;
  if(id>3.5&&id<4.5)lighting+=vec3(.24,.38,.09)*(.42+rim);
  float fog=1.-exp(-.017*distance*distance);
  bg=mix(lighting,bg,clamp(fog,0.,.45));
 }
 float vignette=1.-.32*pow(length(uv-.5)*1.35,2.);
 pixel=vec4(pow(max(bg*vignette,0.),vec3(.87)),1.);
}
*/}).toString().split('/*')[1].split('*/')[0].trimStart();
const stages=new Map();
let watcher=null,raf=0,previous=0,mountedRoot=null,resizeHandler=null;
const SCENES={arki:0,tutor:1,language:2,focus:3,schools:4,cosmos:5};
function makeShader(gl,type,source){
 const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);
 if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){console.warn('[SCHOLAVERUM] WebGL shader fallback:',gl.getShaderInfoLog(sh));gl.deleteShader(sh);return null}return sh;
}
function init(node,key){
 let gl;try{gl=node.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power',preserveDrawingBuffer:false})}catch{}
 if(!gl)return null;
 const v=makeShader(gl,gl.VERTEX_SHADER,vertex),f=makeShader(gl,gl.FRAGMENT_SHADER,fragment);
 if(!v||!f){if(v)gl.deleteShader(v);if(f)gl.deleteShader(f);gl.getExtension('WEBGL_lose_context')?.loseContext();return null;}
 const program=gl.createProgram();gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);
 gl.deleteShader(v);gl.deleteShader(f);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){console.warn('[SCHOLAVERUM] WebGL linking fallback:',gl.getProgramInfoLog(program));gl.deleteProgram(program);gl.getExtension('WEBGL_lose_context')?.loseContext();return null}
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 gl.useProgram(program);const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
 const obj={node,gl,program,buffer,key,visible:false,ready:false,lastSize:'',lastFrame:0,uniforms:{}};
 ['resolution','pointer','time','scene'].forEach(k=>{obj.uniforms[k]=gl.getUniformLocation(program,k)});
 return obj;
}
function draw(obj,stamp,force){
 const {node,gl,uniforms}=obj,host=node.parentElement;
 if(!host||!HOME()||document.hidden)return;
 const rect=host.getBoundingClientRect();
 if(rect.width<12||rect.height<12)return;
 const small=innerWidth<760,hero=obj.key==='cosmos',limit=hero?(small?640:1050):(small?440:660);
 const scale=Math.min(window.devicePixelRatio||1,small?.72:.9,limit/rect.width,limit/rect.height);
 const w=Math.max(2,Math.round(rect.width*scale)),h=Math.max(2,Math.round(rect.height*scale));
 if(node.width!==w||node.height!==h){node.width=w;node.height=h;gl.viewport(0,0,w,h);force=true}
 const key=obj.key==='theater'?(document.querySelector('#v280-app-preview')?.dataset.scene||'arki'):obj.key;
 const scene=SCENES[key]??0,t=REDUCED()?0:stamp*.001;
 if(!force&&REDUCED()&&obj.lastSize===w+'x'+h+'-'+scene)return;
 gl.useProgram(obj.program);
 gl.uniform2f(uniforms.resolution,w,h);
 gl.uniform2f(uniforms.pointer,obj.key==='cosmos'?.5+.5*(window.__scholaverumPointerX||0):.5,.5);
 gl.uniform1f(uniforms.time,t);
 gl.uniform1i(uniforms.scene,scene);
 gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
 const err=gl.getError();
 if(err!==gl.NO_ERROR)return;
 if(!obj.ready){obj.ready=true;host.classList.add('v307-has-gpu');host.dataset.v307Gpu='1';}
 obj.lastSize=w+'x'+h+'-'+scene;obj.lastFrame=stamp;
}
function clear(){
 if(raf)cancelAnimationFrame(raf);raf=0;
 watcher?.disconnect();watcher=null;
 for(const obj of stages.values()){
  obj.node.parentElement?.classList.remove('v307-has-gpu');
  if(obj.node.parentElement)delete obj.node.parentElement.dataset.v307Gpu;
  try{obj.gl?.deleteBuffer(obj.buffer);obj.gl?.deleteProgram(obj.program);obj.gl?.getExtension('WEBGL_lose_context')?.loseContext()}catch{}
  obj.node.remove();
 }
 stages.clear();mountedRoot=null;
}
function tick(now){
 raf=0;if(!HOME()||!mountedRoot?.isConnected||document.hidden)return;
 const interval=innerWidth<760?115:58;
 if(now-previous<interval&&!REDUCED()){raf=requestAnimationFrame(tick);return}
 previous=now;
 let active=0;
 for(const obj of stages.values()){
  if(!obj.visible)continue;
  active++;try{draw(obj,now,false)}catch(e){console.warn('[SCHOLAVERUM] GPU scene using fallback',e);obj.visible=false;obj.node.parentElement?.classList.remove('v307-has-gpu');}
 }
 if(active&&!REDUCED())raf=requestAnimationFrame(tick);
}
function wake(){if(!HOME()||document.hidden)return;if(!raf)raf=requestAnimationFrame(tick)}
/* Compile GPU programs only when a feature enters the viewport. Eight eager contexts
   were slowing down cold starts, language switching and low-memory mobile browsers. */
function prime(slot){
 if(!slot||!slot.node?.isConnected)return null;
 if(slot.gl)return slot;
 const active=init(slot.node,slot.key);
 if(!active){slot.visible=false;return null}
 active.visible=slot.visible;stages.set(slot.node,active);
 return active;
}
function attach(host,key,role){
 if(!host||host.querySelector(':scope > canvas.v307-gpu'))return;
 const node=document.createElement('canvas');node.className='v307-gpu '+role;node.setAttribute('aria-hidden','true');node.dataset.scene=key;
 host.prepend(node);
 const slot={node,key,gl:null,visible:false,ready:false,lastSize:''};stages.set(node,slot);
 node.addEventListener('webglcontextlost',e=>{
  e.preventDefault();const current=stages.get(node);
  if(current){current.visible=false;current.ready=false}
  host.classList.remove('v307-has-gpu');delete host.dataset.v307Gpu;
 },{passive:false});
 node.addEventListener('webglcontextrestored',()=>{stages.delete(node);node.remove();attach(host,key,role);wake()});
 if(watcher)watcher.observe(host);
 else{slot.visible=true;const active=prime(slot);if(active)draw(active,performance.now(),true)}
}
function decorateTools(root){
 const keys=['arki','tutor','planner','flashcards','progress','schools'];
 const routes=['ai','tutor','planner','flashcards','progress','schools'];
 const cards=[...root.querySelectorAll('.v280-tool')];
 cards.forEach((card,i)=>{
  if(i>=keys.length||card.dataset.v307Tool)return;
  card.dataset.v307Tool=keys[i];
  const scene=document.createElement('div');scene.className='v307-tool-sculpture';
  scene.setAttribute('aria-hidden','true');
  scene.innerHTML='<div class="v307-sculpt-body"><i></i><i></i><i></i><i></i><span></span></div>';
  const icon=card.querySelector('.v280-symbol');
  if(icon)icon.insertAdjacentElement('afterend',scene);else card.prepend(scene);
  const link=document.createElement('button');link.className='v307-tool-open';link.type='button';link.dataset.v280Route=routes[i];
  link.innerHTML='<span class="v307-tool-open-copy"></span><span aria-hidden="true">↗</span>';
  link.setAttribute('aria-label','Open '+(card.querySelector('h3')?.textContent||keys[i]));
  card.append(link);
 });
 updateToolLabels(root);
}
function updateToolLabels(root){
 let dutch=(document.documentElement.lang||'').toLowerCase().startsWith('nl');
 try{dutch=(localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'').toLowerCase().startsWith('nl')}catch{}
 root.querySelectorAll('.v307-tool-open-copy').forEach(el=>{el.textContent=dutch?'Open deze functie':'Explore this feature'});
}
function mount(){
 const root=ROOT();if(!HOME()||!root){if(mountedRoot)clear();return}
 if(mountedRoot===root&&stages.size){
  const hosts=[root.querySelector('#v280-hero'),...root.querySelectorAll('.v298-feature-graphic'),root.querySelector('#v280-demo'),...root.querySelectorAll('.v280-panel-graphic')];
  if(hosts.length===8 && hosts.every(host=>!!host?.querySelector(':scope > canvas.v307-gpu')) &&
   [...stages.values()].every(o=>o.node.isConnected)){updateToolLabels(root);return}
  // Language-switch and route integrations replace some sections in place.
  // Recreate disconnected WebGL canvases instead of leaving stale contexts alive.
 }
 clear();mountedRoot=root;root.classList.add('v307-universe');
 decorateTools(root);
 if('IntersectionObserver'in window){
  watcher=new IntersectionObserver(entries=>{for(const e of entries){
   for(const slot of stages.values())if(slot.node.parentElement===e.target){
    slot.visible=e.isIntersecting;
    if(slot.visible){const active=prime(slot);if(active){active.visible=true;draw(active,performance.now(),true)}}
   }
  }wake();},{rootMargin:'80px 0px',threshold:0});
 }
 attach(root.querySelector('#v280-hero'),'cosmos','v307-cosmic-background');
 [...root.querySelectorAll('.v298-feature-graphic')].slice(0,4).forEach((el,i)=>attach(el,['arki','tutor','language','focus'][i],'v307-feature-world'));
 attach(root.querySelector('#v280-demo'),'theater','v307-theater-world');
 const duo=root.querySelectorAll('.v280-panel-graphic');
 if(duo[0])attach(duo[0],'language','v307-duo-world');
 if(duo[1])attach(duo[1],'schools','v307-duo-world');
 const hero=root.querySelector('#v280-hero');
 if(hero&&hero.dataset.v307Pointer!=='1'){
  hero.dataset.v307Pointer='1';
  hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();window.__scholaverumPointerX=(e.clientX-r.left)/r.width*2-1;}, {passive:true});
  hero.addEventListener('pointerleave',()=>{window.__scholaverumPointerX=0},{passive:true});
 }
 wake();
}
if(!document.querySelector('#scholaverum-r307-3d-style')){
 const link=document.createElement('link');link.id='scholaverum-r307-3d-style';link.rel='stylesheet';
 link.href='scholark-v134-immersive-3d.css?v=20261031-r307';document.head.appendChild(link);
}
for(const name of ['scholaverum:editorial-home-mounted','scholark-runtime-ready','scholark-return-home','scholark-language-applied','scholark-language-change','pageshow']){
 window.addEventListener(name,()=>{setTimeout(mount,85);setTimeout(()=>{const root=ROOT();if(root)updateToolLabels(root)},130)});
}
window.addEventListener('hashchange',()=>{if(!HOME())clear();setTimeout(mount,110)});
window.addEventListener('pagehide',()=>{if(raf)cancelAnimationFrame(raf);raf=0});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake()});
window.addEventListener('resize',()=>{for(const o of stages.values())o.lastSize='';wake()},{passive:true});
window.matchMedia?.('(prefers-reduced-motion: reduce)')?.addEventListener?.('change',()=>{for(const o of stages.values())o.lastSize='';wake()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,160),{once:true});
else setTimeout(mount,150);
window.__SCHOLAVERUM_R307_3D__={version:VERSION,mount,state:()=>({scenes:stages.size,gpu:[...stages.values()].filter(o=>o.ready).length,active:[...stages.values()].filter(o=>o.visible).length,reduced:REDUCED()})};
})();