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

// SCHOLAVERUM r309 / HERO-ONLY: layered exoplanet, spatial rings, volcanic
// cratered moons, textured secondary world and physically inspired eclipse.
// Analytic intersections instead of full-frame ray marching keep fallback practical.
uniform float introProgress;
uniform float quality;
float hitOrb(vec3 ro,vec3 rd,vec3 centre,float r){
 vec3 v=ro-centre;
 float b=dot(v,rd),h=b*b-dot(v,v)+r*r;
 return h<0.?-1.:-b-sqrt(max(h,0.));
}
float triplanar(vec3 n,float scale){
 vec3 w=pow(abs(n),vec3(6.));
 w/=max(w.x+w.y+w.z,.0001);
 return fbm(n.yz*scale+vec2(3.1,7.2))*w.x
       +fbm(n.xz*scale+vec2(9.3,2.7))*w.y
       +fbm(n.xy*scale+vec2(5.6,4.1))*w.z;
}
vec3 worldNormal(vec3 n){
 vec3 north=normalize(vec3(n.z+.001,.0002,-n.x+.001));
 vec3 east=normalize(cross(n,north));
 float nx=triplanar(normalize(n+north*.014),8.8)-triplanar(normalize(n-north*.014),8.8);
 float ny=triplanar(normalize(n+east*.014),8.8)-triplanar(normalize(n-east*.014),8.8);
 return normalize(n-(north*nx+east*ny)*1.65);
}
float craterField(vec3 n,float scale){
 vec3 c=floor(n*scale),f=fract(n*scale)-.5;
 float v=.0;
 for(int i=0;i<3;i++){
  vec3 o=vec3(float(i==1),float(i==2),float(i==0))*.49-.16;
  float r=length(f-o),ring=smoothstep(.22,.18,abs(r-.22));
  v+=ring*.44+(.18-smoothstep(.06,.22,r)*.18);
 }
 return v;
}
vec3 moonSurface(vec3 n,float which){
 float rock=triplanar(n+vec3(which*2.7),9.5);
 float fracture=triplanar(n+vec3(2.1,which,7.9),32.);
 float pits=craterField(n+vec3(which*.03),10.+which*2.);
 vec3 dark=which<.5?vec3(.10,.10,.16):(which<1.5?vec3(.22,.15,.12):vec3(.13,.17,.21));
 vec3 bright=which<.5?vec3(.66,.50,.77):(which<1.5?vec3(.83,.55,.32):vec3(.58,.82,.78));
 return mix(dark,bright,smoothstep(.28,.76,rock*.78+fracture*.16+pits*.2));
}
vec3 nightPalette(vec3 n,float land,float light,float roads){
 float cities=step(.80,noise(n.xz*163.+n.y*5.));
 float clusters=smoothstep(.48,.69,triplanar(n,25.));
 return vec3(1.0,.60,.29)*cities*clusters*roads*pow(1.-light,2.)*land*.65;
}
vec3 heroSpace(vec2 p){
 vec2 sky=p*vec2(1.4,1.0);
 float wide=fbm(sky*2.6+vec2(time*.006,1.3));
 float wisps=fbm(sky*7.2+vec2(-time*.007,2.5));
 vec3 col=mix(vec3(.002,.004,.028),vec3(.029,.013,.11),smoothstep(-.7,.8,p.y));
 col+=vec3(.38,.055,.71)*pow(max(0.,wide-.41),2.)*2.6;
 col+=vec3(.045,.35,.39)*pow(max(0.,wisps-.57),2.)*1.9;
 float band=exp(-pow(p.y*.83-p.x*.25+.07,2.)*16.);
 col+=vec3(.045,.023,.12)*band*(.3+.7*wisps);
 vec2 starId=floor((p+3.5)*vec2(243.,142.));
 vec2 starCell=fract((p+3.5)*vec2(243.,142.))-.5;
 float seed=hash(starId);
 float star=(1.-smoothstep(.02,.11,length(starCell)));
 float size=step(.987,seed);
 float bright=step(.998,seed);
 vec3 starlight=mix(vec3(.61,.78,1.0),vec3(.92,.77,1.),hash(starId+9.));
 col+=starlight*star*(size*.48+bright*1.16)*(.83+.17*sin(time*.48+seed*8.));
 float glitter=exp(-dot(p-vec2(.61,.37),p-vec2(.61,.37))*11.);
 col+=vec3(.13,.045,.22)*glitter;
 return col;
}
vec3 heroWorld(vec3 ro,vec3 rd,vec2 p,vec3 backdrop){
 float aspect=resolution.x/max(1.,resolution.y);
 float compact=1.-smoothstep(.75,1.28,aspect);
 vec3 c=vec3(mix(1.30,.30,compact)+sin(time*.038)*.048,mix(-.02,-.50,compact)+cos(time*.026)*.028,0.);
 float r=mix(1.09,.78,compact);
 vec3 sun=normalize(vec3(-.56,.71,1.18));
 vec3 violet=vec3(.48,.22,.81),lime=vec3(.69,1.,.35);
 float body=hitOrb(ro,rd,c,r);
 vec3 shortest=ro+rd*max(.0,dot(c-ro,rd));
 float atmosphereDist=length(shortest-c)-r;
 float halo=exp(-max(0.,atmosphereDist)*7.5);
 float sunSide=smoothstep(-.55,.6,dot(normalize(shortest-c),sun));
 backdrop+=mix(violet,vec3(.06,.50,.79),sunSide)*halo*.13;
 // A distant gas giant is a SECOND actual ray-intersected spherical world.
 vec3 farC=c+vec3(-3.3+compact*1.6,1.54,-3.9);
 float farT=hitOrb(ro,rd,farC,.89);
 if(farT>0.){
  vec3 fn=normalize(ro+rd*farT-farC);
  vec3 tilted=spin(fn,.31,time*.017);
  float bands=sin(tilted.y*41.+sin(tilted.x*8.+time*.024)*2.1);
  float storms=fbm(tilted.xz*12.+vec2(time*.013,tilted.y*9.));
  vec3 gas=mix(vec3(.14,.10,.28),vec3(.72,.28,.66),.5+.5*bands);
  gas=mix(gas,vec3(.83,.69,.44),smoothstep(.53,.77,storms)*.44);
  float lit=.12+.88*max(0.,dot(fn,sun));
  float rim=pow(1.-max(dot(fn,-rd),0.),2.);
  backdrop=gas*lit+violet*rim*.20;
 }
 // Tipped particle disk with split lanes, radial dust and realistic occlusion.
 vec3 ringN=normalize(vec3(.25,.80,.48));
 float denom=dot(rd,ringN);
 float rt=-1.,ringA=0.,ringRadius=0.;
 vec3 ringCol=vec3(0.);
 if(abs(denom)>.0005)rt=dot(c-ro,ringN)/denom;
 if(rt>0.){
  vec3 rp=ro+rd*rt-c;
  ringRadius=length(rp)/r;
  float interior=smoothstep(1.10,1.17,ringRadius);
  float exterior=1.-smoothstep(1.99,2.05,ringRadius);
  float lane=sin(ringRadius*125.+sin(ringRadius*38.)*2.1);
  float fine=sin(ringRadius*610.)*.13;
  float gap=1.-.78*(1.-smoothstep(.02,.045,abs(ringRadius-1.42)));
  gap*=1.-.73*(1.-smoothstep(.018,.038,abs(ringRadius-1.69)));
  float dust=hash(floor(rp.xz*45.));
  ringA=interior*exterior*gap*(.30+.26*lane+.10*fine+.08*dust);
  ringA*=smoothstep(.0,.12,ringRadius-1.09);
  ringCol=mix(vec3(.39,.23,.63),vec3(.82,1.0,.52),smoothstep(-.7,.8,lane));
  ringCol*=.62+.45*pow(max(0.,dot(ringN,sun)),.45);
 }
 // Back ring renders before the surface; foreground ring renders after.
 if(ringA>0.&&(body<0.||rt>body))
  backdrop=mix(backdrop,ringCol,clamp(ringA,0.,.65));
 if(body>0.){
  vec3 normal=normalize(ro+rd*body-c);
  vec3 spun=spin(normal,.18,time*.043);
  float continent=triplanar(spun,3.5);
  float regional=triplanar(spun+vec3(1.5,4.2,2.1),8.8);
  float elevation=triplanar(spun,22.);
  float ridges=1.-abs(2.*regional-1.);
  float coastV=continent*.78+regional*.19+(elevation-.5)*.09;
  float land=smoothstep(.455,.535,coastV);
  float sand=(smoothstep(.445,.475,coastV)-smoothstep(.485,.55,coastV))*.9;
  float peaks=pow(ridges,4.)*elevation;
  float alpine=smoothstep(.40,.69,peaks+regional*.40);
  float polar=smoothstep(.69,.92,abs(spun.y)+regional*.22);
  float shallow=smoothstep(.37,.49,coastV);
  vec3 deepSea=mix(vec3(.005,.045,.21),vec3(.023,.23,.50),shallow*.85);
  deepSea=mix(deepSea,vec3(.08,.45,.59),sand*.6);
  vec3 forest=mix(vec3(.015,.22,.17),vec3(.21,.58,.25),smoothstep(.23,.70,elevation));
  vec3 desert=mix(vec3(.49,.31,.20),vec3(.81,.65,.38),regional);
  float dry=smoothstep(.20,.83,abs(spun.y)+regional*.58);
  vec3 ground=mix(forest,desert,dry*.72);
  ground=mix(ground,vec3(.47,.43,.50),alpine*.64);
  ground=mix(ground,vec3(.86,.93,.99),polar*.94);
  vec3 albedo=mix(deepSea,ground,land);
  albedo=mix(albedo,vec3(.78,.69,.44),sand*land*.45);
  vec3 N=normal;
  if(quality>.65&&land>.20)N=normalize(mix(normal,worldNormal(spun),.34*land));
  float shade=max(0.,dot(N,sun));
  float diffuse=.055+.96*pow(shade,.83);
  // Two distinct semi-translucent cloud heights and their offset shadows.
  vec3 cloudsN=spin(normal,.18,time*.052);
  float high=triplanar(cloudsN+vec3(.01,time*.001,0.),16.);
  float low=triplanar(cloudsN+vec3(time*.002,.01,0.),27.);
  float storm=triplanar(cloudsN+vec3(.3,-.2,.6),6.);
  float cloudCover=smoothstep(.49,.70,high*.67+low*.21+storm*.20);
  float cirrus=smoothstep(.59,.79,low);
  float cloudShadow=smoothstep(.48,.70,high*.68+low*.20)*land*.28;
  float ocean=1.-land;
  float sparkle=pow(max(0.,dot(reflect(-sun,N),-rd)),84.);
  vec3 lit=albedo*(diffuse-cloudShadow*shade)+vec3(.54,.91,1.)*sparkle*ocean*.62;
  lit=mix(lit,vec3(.86,.92,1.)*(.12+.85*shade),cloudCover*.83);
  lit+=vec3(.76,.88,.98)*cirrus*.11*shade;
  // Thin blue-cyan limb with sunlight scattering and electric violet dusk.
  float limb=pow(1.-max(dot(normal,-rd),0.),3.0);
  float day=max(0.,dot(normal,sun));
  vec3 air=mix(vec3(.30,.09,.63),vec3(.05,.53,.96),smoothstep(.1,.85,day));
  lit+=air*limb*(.35+.60*day);
  lit+=vec3(.18,.55,.99)*pow(limb,5.)*.30;
  // Night side city clusters are restrained by topography, not a grid.
  float towns=step(.81,noise(spun.xz*171.+spun.y*9.));
  float urban=smoothstep(.44,.68,triplanar(spun+vec3(1.2),18.));
  lit+=vec3(1.0,.62,.28)*towns*urban*land*pow(1.-shade,3.)*.37;
  // Aurora around high-latitude magnetic bands.
  float polarArc=smoothstep(.68,.94,abs(spun.y));
  float waves=.5+.5*sin(spun.x*46.+time*.2+spun.z*27.);
  lit+=mix(lime,vec3(.18,.84,1.),waves)*polarArc*waves*day*.12;
  backdrop=max(lit,vec3(.005));
 }
 if(ringA>0.&&rt>0.&&body>0.&&rt<body)
  backdrop=mix(backdrop,ringCol*1.14,clamp(ringA*.90,0.,.70));
 // Small physical moons. Each has individual crater fields, terrain and light.
 for(int i=0;i<4;i++){
  float k=float(i),direction=i==1||i==3?-1.:1.;
  float a=time*direction*(.115+.017*k)+k*2.399;
  vec3 m=c+vec3(cos(a)*(1.92+k*.19)*r,
                sin(a*.78+k*1.8)*(.77+.10*k)*r,
                sin(a)*(1.02+k*.18)*r);
  float size=r*(.10+.016*k);
  float moonT=hitOrb(ro,rd,m,size);
  if(moonT>0.&&(body<0.||moonT<body)&&(farT<0.||moonT<farT)&&(rt<0.||moonT<rt||ringA<.1)){
   vec3 n=normalize(ro+rd*moonT-m);
   float base=triplanar(n+vec3(k*1.7),8.7);
   float pits=craterField(n,8.+k*1.5);
   float elevation=smoothstep(.3,.72,base+pits*.23);
   vec3 marble=moonSurface(n,k);
   marble=mix(marble,vec3(.05,.06,.10),(.18+.3*pits)*(1.-elevation));
   float lit=.09+.91*max(0.,dot(n,sun));
   float rim=pow(1.-max(dot(n,-rd),0.),2.4);
   backdrop=marble*lit+mix(vec3(.31,.13,.58),vec3(.54,.94,.45),step(1.5,k))*rim*.17;
  }
 }
 // Volumetric-looking penumbra: a physically positioned near-field moon
 // eclipses the hero world during the existing 12s intro, never in idle.
 float eclipseVisibility=smoothstep(.15,.83,introProgress)*(1.-smoothstep(3.2,3.95,introProgress));
 if(eclipseVisibility>.001){
  float withdrawal=smoothstep(.83,3.22,introProgress);
  vec3 moonC=c+vec3(-r*1.93*withdrawal,
                         r*(.065+.11*withdrawal),r*1.42);
  float eclipsingRadius=r*.96;
  float ecT=hitOrb(ro,rd,moonC,eclipsingRadius);
  vec3 point=ro+rd*max(.0,dot(moonC-ro,rd));
  float clearance=length(point-moonC)-eclipsingRadius;
  float grazing=exp(-max(0.,clearance)*25.);
  float lens=exp(-max(0.,clearance)*5.5);
  float coronaTurbulence=.76+.24*noise(p*29.+vec2(time*.11,3.1));
  vec3 haloCol=mix(vec3(.82,.52,1.),vec3(.70,1.,.59),.5+.5*sin(introProgress*1.7));
  backdrop+=haloCol*grazing*.40*eclipseVisibility*coronaTurbulence;
  backdrop+=haloCol*lens*.08*eclipseVisibility;
  if(ecT>0.&&(body<0.||ecT<body)){
   vec3 n=normalize(ro+rd*ecT-moonC);
   float rubble=triplanar(n,9.6);
   float chips=craterField(n,13.);
   vec3 stone=mix(vec3(.012,.016,.031),vec3(.075,.068,.103),rubble*.62+chips*.10);
   float rim=pow(1.-max(dot(n,-rd),0.),4.);
   float faint=max(0.,dot(n,sun))*.08;
   vec3 silhouette=stone*(.16+faint)+haloCol*rim*.28;
   backdrop=mix(backdrop,silhouette,eclipseVisibility);
  }
 }
 // Sparse near-field orbital dust flares (not large duplicate silhouettes).
 float orbitArc=abs(length((p-vec2(mix(.65,.14,compact),-.10))*vec2(1.,1.27))-1.14);
 backdrop+=mix(violet,lime,.5+.5*sin(time*.13))*exp(-orbitArc*155.)*.105;
 return backdrop;
}
void main(){
 vec2 p=(uv*2.-1.);p.x*=resolution.x/max(resolution.y,1.);
 vec2 look=(pointer-.5)*vec2(.19,.12);
 vec3 ro=vec3(look.x,look.y,5.45),rd=normalize(vec3(p*.95,-3.0));
 vec3 bg=atmosphere(p);
 if(scene==5){
  bg=heroWorld(ro,rd,p,heroSpace(p));
  float frame=1.-.20*pow(length(uv-.5)*1.28,2.);
  // Filmic shoulder with a gentle lifted toe keeps purple/lime vivid,
  // but prevents solar rim and cloud detail from burning out.
  bg=max(bg*frame,vec3(0.));
  bg=bg*(2.15*bg+.045)/(bg*(1.70*bg+.55)+.13);
  bg=pow(clamp(bg,vec3(0.),vec3(1.)),vec3(.88));
  pixel=vec4(bg,1.);return;
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
 ['resolution','pointer','time','scene','introProgress','quality'].forEach(k=>{obj.uniforms[k]=gl.getUniformLocation(program,k)});
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
 gl.uniform1f(uniforms.introProgress,hero&&!REDUCED()?(window.__SCHOLAVERUM_R299_PLANET__?.state?.().progress??12):12);
 gl.uniform1f(uniforms.quality,small?.55:.94);
 gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
 const err=gl.getError();
 if(err!==gl.NO_ERROR)return;
 if(!obj.ready){obj.ready=true;host.classList.add('v307-has-gpu');host.dataset.v307Gpu='1';if(obj.key==='cosmos'){host.dataset.v308Planet='celestial-homeworld';host.dataset.v309Hero='photoreal-eclipse';}}
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
 link.href='scholark-v134-immersive-3d.css?v=20261108-r309';document.head.appendChild(link);
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
window.__SCHOLAVERUM_R307_3D__={version:VERSION,mount,state:()=>({scenes:stages.size,gpu:[...stages.values()].filter(o=>o.ready).length,active:[...stages.values()].filter(o=>o.visible).length,reduced:REDUCED(),planet:document.querySelector('#v280-hero')?.dataset.v308Planet||'fallback',heroVersion:document.querySelector('#v280-hero')?.dataset.v309Hero||'fallback',eclipse:window.__SCHOLAVERUM_R299_PLANET__?.state?.().phase||'unknown'})};
})();