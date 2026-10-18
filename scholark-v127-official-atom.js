/* SCHOLAVERUM v296 — approved purple/lime atom, isolated to public Home.
   Real UV-mapped spherical logo, separate orbit tracks and moving satellites.
   Preview branch: never deploy until owner signs off. */
(()=>{'use strict';
if(window.__SCHOLAVERUM_ATOM_V296__)return;
const TAU=Math.PI*2,LOGO='/scholaverum-official-logo-r290.webp',COLORS=[
 {color:'#BAF500',shine:'#f0ffa7',tilt:-.56,speed:7000,phase:-1},
 {color:'#812CF0',shine:'#cca8ff',tilt:.69,speed:9400,phase:1.25}
];
const css=[
 '#v280-editorial-home .v296-atom{position:absolute;right:35%;bottom:17%;width:76%;aspect-ratio:1;isolation:isolate;z-index:1;pointer-events:none}',
 '#v280-editorial-home .v296-orbit-canvas{position:absolute;left:-50%;top:-50%;width:200%;height:200%;pointer-events:none}',
 '#v280-editorial-home .v296-back{z-index:1}',
 '#v280-editorial-home .v296-ball{position:absolute;inset:0;width:100%;height:100%;z-index:2;border-radius:50%;filter:drop-shadow(0 24px 40px rgba(0,0,0,.36));animation:v296Hover 9s ease-in-out infinite alternate}',
 '#v280-editorial-home .v296-front{z-index:3}',
 '#v280-editorial-home .v296-fallback{position:absolute;inset:0;width:100%;height:100%;border-radius:50%;object-fit:contain;display:none;z-index:2}',
 '#v280-editorial-home .v296-atom[data-status="fallback"] .v296-ball{display:none}',
 '#v280-editorial-home .v296-atom[data-status="fallback"] .v296-fallback{display:block}',
 '@keyframes v296Hover{from{transform:translateY(3px) scale(.994)}to{transform:translateY(-6px) scale(1.018)}}',
 '@media(max-width:1160px){#v280-editorial-home .v296-atom{right:36%}}',
 '@media(max-width:950px){#v280-editorial-home .v296-atom{right:32%}}',
 '@media(max-width:680px){#v280-editorial-home .v296-atom{right:20%;bottom:12%;width:65%}}',
 '@media(prefers-reduced-motion:reduce){#v280-editorial-home .v296-ball{animation:none!important;transform:none!important}}'
].join('\n');
const $=(q,r=document)=>r.querySelector(q);
const home=()=>!!$('#v280-editorial-home #v280-hero')&&!!document.body?.classList.contains('v280-home-rebuild');
const reduced=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
function prepareTexture(image,width,height){
 const src=document.createElement('canvas');src.width=image.naturalWidth;src.height=image.naturalHeight;
 const ctx=src.getContext('2d',{willReadFrequently:true});if(!ctx)return null;
 ctx.drawImage(image,0,0);
 const data=ctx.getImageData(0,0,src.width,src.height),px=data.data,w=src.width,h=src.height;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=(y*w+x)*4,r=px[i]/255,g=px[i+1]/255,b=px[i+2]/255;
  const hi=Math.max(r,g,b),lo=Math.min(r,g,b),d=hi-lo,s=hi?d/hi:0;
  let hue=0;if(d){if(hi===r)hue=60*((g-b)/d%6);else if(hi===g)hue=60*((b-r)/d+2);else hue=60*((r-g)/d+4)}
  if(hue<0)hue+=360;
  const inside=x/w>.29&&x/w<.71&&y/h>.28&&y/h<.686;
  const mark=(hue>258&&hue<329&&s>.28)||(hue>36&&hue<105&&s>.34);
  px[i+3]=inside&&mark?Math.round(Math.max(0,Math.min(1,(s-.24)*5))*255):0;
 }
 ctx.putImageData(data,0,0);
 const tex=document.createElement('canvas');tex.width=width;tex.height=height;
 const t=tex.getContext('2d',{willReadFrequently:true});if(!t)return null;
 const cw=width*.377, ch=height*.496;
 for(const cx of [0,width/2,width]){
  t.drawImage(src,w*.298,h*.28,w*.404,h*.406,cx-cw/2,(height-ch)/2,cw,ch);
 }
 return tex;
}
function webgl(canvas,image){
 let gl;try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'low-power'})}catch{}
 if(!gl)return null;
 const compile=(type,source)=>{const a=gl.createShader(type);gl.shaderSource(a,source);gl.compileShader(a);return gl.getShaderParameter(a,gl.COMPILE_STATUS)?a:null};
 const vs=compile(gl.VERTEX_SHADER,'attribute vec2 p;varying vec2 uv;void main(){uv=p;gl_Position=vec4(p,0.,1.);}');
 const fs=compile(gl.FRAGMENT_SHADER,[
  'precision mediump float;varying vec2 uv;uniform sampler2D brand;uniform float yaw;',
  'void main(){float r=dot(uv,uv);if(r>=1.0)discard;',
  'float z=sqrt(max(0.,1.-r));vec3 n=vec3(uv.x,uv.y,z);',
  'float lon=atan(n.x,n.z)+yaw;',
  'vec2 coord=vec2(fract(.5+lon/6.2831853),.5-asin(clamp(n.y,-1.,1.))/3.14159265);',
  'vec4 mark=texture2D(brand,coord);',
  'vec3 blue=mix(vec3(.015,.053,.12),vec3(.095,.31,.58),clamp(.56+n.y*.17,0.,1.));',
  'vec3 light=normalize(vec3(-.43,.63,.87));float diffuse=max(0.,dot(n,light));',
  'float spec=pow(max(0.,dot(reflect(-light,n),vec3(0.,0.,1.))),42.);',
  'vec3 color=mix(blue,mark.rgb,mark.a*.99);',
  'color=color*(.59+.43*diffuse)+vec3(.43,.60,.89)*spec*.25+vec3(.075,.18,.34)*pow(1.-z,2.7)*.52;',
  'gl_FragColor=vec4(color,1.-smoothstep(.984,1.,r));}'
 ].join('\n'));
 if(!vs||!fs)return null;
 const prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);
 if(!gl.getProgramParameter(prog,gl.LINK_STATUS))return null;
 gl.useProgram(prog);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const at=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(at);gl.vertexAttribPointer(at,2,gl.FLOAT,false,0,0);
 const map=prepareTexture(image,2048,1024);if(!map)return null;
 const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,map);
 const yaw=gl.getUniformLocation(prog,'yaw'),sampler=gl.getUniformLocation(prog,'brand');
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();canvas.closest('.v296-atom').dataset.status='fallback'},{once:true});
 return function(angle){
  const w=canvas.getBoundingClientRect().width;
  const size=Math.min(780,Math.max(120,Math.round(w*Math.min(1.6,devicePixelRatio||1))));
  if(canvas.width!==size||canvas.height!==size){canvas.width=size;canvas.height=size}
  gl.viewport(0,0,size,size);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(prog);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.uniform1i(sampler,0);gl.uniform1f(yaw,angle);gl.drawArrays(gl.TRIANGLES,0,6);
  canvas.dataset.yaw=angle.toFixed(3);
 };
}
function cpu(canvas,image){
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return null;
 const tex=prepareTexture(image,1024,512);if(!tex)return null;
 const pixels=tex.getContext('2d',{willReadFrequently:true}).getImageData(0,0,1024,512).data;
 const n=340,half=n/2,out=ctx.createImageData(n,n),project=[];
 canvas.width=n;canvas.height=n;
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const a=(x+.5-half)/half,b=(half-y-.5)/half,r=a*a+b*b;
  if(r>=1){project.push(null);continue}
  const z=Math.sqrt(1-r),u=.5+Math.atan2(a,z)/TAU,v=Math.min(511,Math.max(0,Math.floor((.5-Math.asin(b)/Math.PI)*512)));
  const f=Math.max(0,Math.min(1,.56+b*.17)),light=Math.max(0,a*(-.43)+b*.63+z*.87);
  project.push([u,v,.59+.43*light,4*(1-f)+24*f,14*(1-f)+79*f,31*(1-f)+148*f,Math.min(1,(1-r)/.016)]);
 }
 return function(angle){
  const dst=out.data;
  for(let i=0;i<project.length;i++){
   const p=project[i],j=i*4;if(!p){dst[j+3]=0;continue}
   const tx=(p[0]+angle/TAU)%1,src=(p[1]*1024+Math.floor(tx*1024))*4,alpha=pixels[src+3]/255;
   dst[j]=(p[3]*(1-alpha)+pixels[src]*alpha)*p[2];
   dst[j+1]=(p[4]*(1-alpha)+pixels[src+1]*alpha)*p[2];
   dst[j+2]=(p[5]*(1-alpha)+pixels[src+2]*alpha)*p[2];
   dst[j+3]=p[6]*255;
  }
  ctx.putImageData(out,0,0);canvas.dataset.yaw=angle.toFixed(3);
 };
}
function at(orbit,a,sphere,elapsed){
 const tilt=orbit.tilt+Math.sin(elapsed/24000+orbit.tilt)*.10;
 const x=sphere*.94*Math.cos(a),y=sphere*.50*Math.sin(a),z=sphere*.43*Math.sin(a);
 return {x:x*Math.cos(tilt)-y*Math.sin(tilt),y:x*Math.sin(tilt)+y*Math.cos(tilt),z};
}
function orbitPath(ctx,o,base,time,front){
 ctx.beginPath();let connected=false;
 for(let i=0;i<=240;i++){
  const p=at(o,i/240*TAU,base,time),on=(p.z>=0)===front;
  if(!on){connected=false;continue}
  if(connected)ctx.lineTo(p.x,p.y);else{ctx.moveTo(p.x,p.y);connected=true}
 }
 ctx.lineCap='round';ctx.strokeStyle=o.color;ctx.lineWidth=Math.max(1.4,base*.007);ctx.stroke();
 ctx.globalAlpha=.22;ctx.strokeStyle=o.shine;ctx.lineWidth=Math.max(.5,base*.0017);ctx.stroke();ctx.globalAlpha=1;
}
function satellite(ctx,p,size,o){
 const r=size*.047*(1+.08*p.z/size);
 const g=ctx.createRadialGradient(p.x-r*.34,p.y-r*.42,0,p.x,p.y,r);
 g.addColorStop(0,'#ffffff');g.addColorStop(.24,o.shine);g.addColorStop(.7,o.color);g.addColorStop(1,o.color);
 ctx.beginPath();ctx.arc(p.x,p.y,r,0,TAU);ctx.fillStyle=g;ctx.fill();
}
function mount(){
 if(!home())return;
 const host=$('#v280-editorial-home .v280-hero-art');if(!host)return;
 if($('.v296-atom',host))return;
 if(!$('#v296-atom-css')){const style=document.createElement('style');style.id='v296-atom-css';style.textContent=css;document.head.appendChild(style)}
 // Remove ONLY the outdated 24+24 flattened logo strips and keep both AI cards.
 $('.v292-sphere-stage',host)?.remove();
 const stage=document.createElement('div');stage.className='v296-atom';stage.setAttribute('aria-hidden','true');
 stage.innerHTML='<canvas class="v296-orbit-canvas v296-back"></canvas><canvas class="v296-ball"></canvas><img class="v296-fallback" alt=""><canvas class="v296-orbit-canvas v296-front"></canvas>';
 host.prepend(stage);
 const image=new Image();image.decoding='async';
 image.onload=()=>{
  if(!stage.isConnected)return;
  const ball=$('.v296-ball',stage),back=$('.v296-back',stage),front=$('.v296-front',stage);
  let draw=null;try{draw=webgl(ball,image)}catch(e){console.warn('SCHOLAVERUM GPU globe unavailable',e)}
  if(!draw){try{draw=cpu(ball,image)}catch(e){console.warn('SCHOLAVERUM CPU globe unavailable',e)}}
  stage.dataset.status=draw?'ready':'fallback';
  if(!draw){const fallback=$('.v296-fallback',stage);fallback.src=LOGO;fallback.style.transform='scale(1.35)'}
  const behind=back.getContext('2d'),ahead=front.getContext('2d');if(!behind||!ahead)return;
  let last=0,painted=0,clock=0,size=0,raf=0;
  function animate(now){
   if(!stage.isConnected){cancelAnimationFrame(raf);return}
   raf=requestAnimationFrame(animate);
   if(document.hidden||!home()){last=now;return}
   const rect=stage.getBoundingClientRect();if(rect.bottom<=0||rect.top>=innerHeight){last=now;return}
   if(now-painted<34)return;
   const dt=Math.max(0,Math.min(80,now-(last||now)));last=now;painted=now;
   if(!reduced())clock+=dt;
   const dpr=Math.min(1.6,devicePixelRatio||1),base=rect.width*dpr,n=Math.max(150,Math.round(base*2));
   if(size!==n){size=n;back.width=back.height=front.width=front.height=n}
   behind.clearRect(0,0,n,n);ahead.clearRect(0,0,n,n);
   [[false,behind],[true,ahead]].forEach(([frontLayer,ctx])=>{
    ctx.save();ctx.translate(n/2,n/2);
    COLORS.forEach(o=>orbitPath(ctx,o,base,clock,frontLayer));
    COLORS.forEach(o=>{const p=at(o,o.phase+clock/o.speed*TAU,base,clock);if((p.z>=0)===frontLayer)satellite(ctx,p,base,o)});
    ctx.restore();
   });
   draw?.(clock/22000*TAU);
  }
  raf=requestAnimationFrame(animate);
 };
 image.onerror=()=>{stage.dataset.status='fallback';$('.v296-fallback',stage).src=LOGO};
 image.src=LOGO;
}
function sync(){if(home())mount()}
window.__SCHOLAVERUM_ATOM_V296__={mount:sync,version:'r296-review-only'};
['scholaverum:editorial-home-mounted','scholark-runtime-ready','scholark-return-home','hashchange','pageshow'].forEach(event=>window.addEventListener(event,()=>setTimeout(sync,60)));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
const root=$('#v29-home-layer');if(root){const observer=new MutationObserver(()=>{if(!$('.v296-atom',root))sync()});observer.observe(root,{childList:true})}
})();
