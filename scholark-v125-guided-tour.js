(() => {
'use strict';
if(window.__SCHOLAVERUM_TOUR__)return;
const $=(s,r=document)=>r.querySelector(s);
const home=()=>['','home','start'].includes(String(location.hash||'').slice(1).split(/[?&]/)[0].toLowerCase());
const reduce=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||false;
const nl=()=>{try{return (localStorage.getItem('scholark_ui_language')||'en').startsWith('nl')}catch{return false}};
const en=[
['Welcome to SCHOLAVERUM','One connected learning environment for your questions, plans and creations.','v280-intro',''],
['Meet ARKI','Ask questions, write, code, research and work through new ideas with ARKI.','v280-theater','arki'],
['Your AI Tutor','Get subject explanations, practice questions and learning guidance.','v280-theater','tutor'],
['Language Learner','Practise languages, save lessons and revisit exams and reviews.','v280-theater','language'],
['Schools Near Me','Discover education opportunities and save the schools that interest you.','v280-theater','schools'],
['Everything in one Workspace','Bring your chat, learning tools, Planner, files and progress together.','v280-tools',''],
['Start your next chapter','Your personal learning experience is ready. Open the Workspace to begin.','v280-start','']
];
const dutch=[
['Welkom bij SCHOLAVERUM','Eén verbonden leeromgeving voor al je vragen, plannen en ideeën.','v280-intro',''],
['Ontmoet ARKI','Stel vragen, schrijf, programmeer, onderzoek en werk nieuwe ideeën uit met ARKI.','v280-theater','arki'],
['Jouw AI Tutor','Krijg uitleg, oefenvragen en begeleiding bij je schoolvakken.','v280-theater','tutor'],
['Language Learner','Oefen talen, bewaar lessen en herhaal examens en oefeningen.','v280-theater','language'],
['Schools Near Me','Ontdek onderwijsopties en bewaar scholen die je interesseren.','v280-theater','schools'],
['Alles in één Workspace','Breng je chat, studietools, planning, bestanden en voortgang samen.','v280-tools',''],
['Begin je volgende hoofdstuk','Je persoonlijke leeromgeving staat klaar. Open de Workspace en begin.','v280-start','']
];
const css=document.createElement('style');css.id='v282-tour-style';
css.textContent='#v282-tour{position:fixed;z-index:2147483550;right:clamp(12px,3vw,45px);bottom:clamp(12px,3vw,45px);width:min(410px,calc(100vw - 24px));box-sizing:border-box;padding:23px;border:1px solid rgba(201,255,106,.35);border-radius:22px;color:#f6f9ef;background:linear-gradient(135deg,#0e1724,#252440);box-shadow:0 25px 85px rgba(0,0,0,.4);font:550 13px/1.6 Inter,system-ui}#v282-tour[hidden]{display:none!important}#v282-tour *{box-sizing:border-box}#v282-tour h3{font:900 30px/1.02 Inter,system-ui;letter-spacing:-.05em;margin:17px 0 12px}#v282-tour p{color:#d1d6e0;margin:0 0 18px;min-height:66px}#v282-tour .v282-top,#v282-tour .v282-controls{display:flex;align-items:center;justify-content:space-between;gap:8px}#v282-tour .v282-top{font-size:10px;letter-spacing:.13em;font-weight:900;color:#c9ff6a}#v282-tour button{border:1px solid rgba(255,255,255,.23);border-radius:99px;padding:10px 12px;background:rgba(255,255,255,.06);color:#fff;font:800 11px Inter,system-ui;cursor:pointer}#v282-tour button:focus-visible{outline:2px solid #c9ff6a;outline-offset:2px}#v282-tour button:disabled{opacity:.3;cursor:not-allowed}#v282-tour [data-tour=next],#v282-tour [data-tour=workspace]{background:#c9ff6a;color:#151b24;border-color:#c9ff6a}#v282-tour .v282-meter{background:rgba(255,255,255,.15);height:5px;border-radius:20px;overflow:hidden;margin:20px 0 8px}#v282-tour .v282-meter i{display:block;height:100%;background:#c9ff6a;transition:width .25s}#v282-tour [data-tour=workspace]{width:100%;margin-top:10px}#v282-tour [data-tour=close]{padding:5px 11px;font-size:17px}#v282-tour .v282-controls{margin-top:14px;flex-wrap:wrap}@media(max-width:560px){#v282-tour{width:calc(100vw - 20px);right:10px;bottom:10px;padding:15px}#v282-tour h3{font-size:24px;margin:12px 0}#v282-tour p{min-height:0;margin-bottom:10px}}@media(prefers-reduced-motion:reduce){#v282-tour .v282-meter i{transition:none}}';
document.head.appendChild(css);
let running=false,paused=false,step=0,timer=null,focusBefore=null,sceneEpoch=0,cameraFrame=0,cameraResolve=null,transitioning=false;
const animations=new Set();
const motion=document.createElement('style');motion.id='v284-tour-motion';
motion.textContent='body.v282-tour-playing #v280-editorial-home{scroll-behavior:auto}body.v282-tour-playing #v280-theater{position:relative}body.v282-tour-playing #v280-theater::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,transparent 45%,rgba(6,10,20,.22));opacity:.8}body.v282-tour-playing #v280-editorial-home [data-v280-reveal]{opacity:1!important;transform:none!important}#v282-tour{transition:border-color .6s,box-shadow .6s}body.v284-tour-transition #v282-tour{border-color:rgba(201,255,106,.6);box-shadow:0 22px 95px rgba(8,13,30,.5)}#v282-tour [data-tour=pause]{min-width:80px}@media(prefers-reduced-motion:reduce){#v282-tour{transition:none}}';
document.head.appendChild(motion);
const copy=()=>nl()?dutch:en;
const clear=()=>{clearTimeout(timer);timer=null};
function root(){
 let el=$('#v282-tour');if(el)return el;
 el=document.createElement('section');el.id='v282-tour';el.setAttribute('role','region');el.setAttribute('aria-label','SCHOLAVERUM guided tour');el.hidden=true;
 el.innerHTML='<div class="v282-top"><span>SCHOLAVERUM · PRODUCT TOUR</span><button type="button" data-tour="close" aria-label="Close tour">×</button></div><div class="v282-meter"><i></i></div><small id="v282-number"></small><h3 id="v282-heading" aria-live="polite"></h3><p id="v282-body"></p><div class="v282-controls"><button type="button" data-tour="back"></button><button type="button" data-tour="pause"></button><button type="button" data-tour="next"></button></div><button type="button" data-tour="workspace"></button>';
 document.body.appendChild(el);
 el.addEventListener('click',e=>{const action=e.target.closest('[data-tour]')?.dataset.tour;
 if(action==='close')stop();else if(action==='workspace'){stop();location.hash='#dashboard'}
 else if(action==='back')show(step-1);else if(action==='next'){if(step===6)stop();else show(step+1)}
 else if(action==='pause'){paused=!paused;clear();paint();schedule()}
 });
 return el;
}
function paint(){
 const el=root(),data=copy();
 $('#v282-heading',el).textContent=data[step][0];$('#v282-body',el).textContent=data[step][1];
 $('#v282-number',el).textContent=(step+1)+' / 7';
 $('.v282-meter i',el).style.width=((step+1)/7*100)+'%';
 $('[data-tour=back]',el).textContent=nl()?'← Vorige':'← Previous';
 $('[data-tour=back]',el).disabled=step===0;
 $('[data-tour=pause]',el).textContent=paused?(nl()?'Hervatten':'Resume'):(nl()?'Pauzeren':'Pause');
 $('[data-tour=next]',el).textContent=step===6?(nl()?'Afronden':'Finish'):(nl()?'Volgende →':'Next →');
 $('[data-tour=workspace]',el).textContent=nl()?'Open Workspace ↗':'Open Workspace ↗';
 $('[data-tour=close]',el).setAttribute('aria-label',nl()?'Sluit presentatie':'Close tour');
 $('[data-tour=workspace]',el).hidden=step!==6;
}
function schedule(){
 clear();if(!running||paused||transitioning||reduce()||document.hidden)return;
 timer=setTimeout(()=>{if(!running||paused)return;if(step===6){paused=true;paint()}else show(step+1)},step===0?5500:6500);
}
function cancelMotion(){
 sceneEpoch++;cancelAnimationFrame(cameraFrame);cameraFrame=0;
 if(cameraResolve){cameraResolve();cameraResolve=null}
 animations.forEach(a=>a.cancel());animations.clear();transitioning=false;
 document.body.classList.remove('v284-tour-transition');
}
async function animate(el,frames,options){
 if(!el?.animate)return;const a=el.animate(frames,options);animations.add(a);
 try{await a.finished}catch{}finally{animations.delete(a);a.cancel()}
}
function camera(target,epoch){
 if(!target)return Promise.resolve();
 const start=scrollY,top=Math.max(0,Math.min(target.getBoundingClientRect().top+scrollY-70,document.documentElement.scrollHeight-innerHeight));
 if(Math.abs(top-start)<8)return Promise.resolve();
 const began=performance.now(),duration=Math.min(1150,650+Math.abs(top-start)*.07);
 return new Promise(resolve=>{
  cameraResolve=resolve;
  function tick(now){
   if(epoch!==sceneEpoch||!running){cameraResolve=null;resolve();return}
   const t=Math.min(1,(now-began)/duration),e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
   window.scrollTo({top:start+(top-start)*e,behavior:'instant'});
   if(t<1)cameraFrame=requestAnimationFrame(tick);else{cameraFrame=0;cameraResolve=null;resolve()}
  }
  cameraFrame=requestAnimationFrame(tick);
 });
}
async function show(n){
 if(!running)return;clear();cancelMotion();step=Math.min(6,Math.max(0,n));
 const epoch=sceneEpoch,row=copy()[step],target=document.getElementById(row[3]?'v280-demo':row[2]);
 const commit=()=>{if(row[3])window.__SCHOLAVERUM_R280_HOME__?.choose?.(row[3]);paint()};
 if(reduce()){commit();target?.scrollIntoView({behavior:'instant',block:'start'});schedule();return}
 transitioning=true;document.body.classList.add('v284-tour-transition');
 const preview=$('#v280-app-preview'),heading=$('#v282-heading'),body=$('#v282-body');
 await Promise.all([
  animate(heading,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-8px)'}],{duration:210,easing:'ease-in',fill:'forwards'}),
  animate(body,[{opacity:1},{opacity:0}],{duration:180,fill:'forwards'}),
  row[3]?animate(preview,[{opacity:1,transform:'scale(1)'},{opacity:.12,transform:'scale(.975) translateY(8px)',filter:'blur(4px)'}],{duration:300,easing:'ease-in',fill:'forwards'}):Promise.resolve()
 ]);
 if(epoch!==sceneEpoch||!running)return;
 commit();
 const feature=row[3]?$('#v280-app-preview'):target;
 const inner=feature?.querySelector('.v280-scene')||feature;
 await Promise.all([
  camera(target,epoch),
  animate(inner,[{opacity:.15,transform:'translateY(25px) scale(.975)',filter:'blur(5px)'},{opacity:1,transform:'translateY(0) scale(1)',filter:'blur(0)'}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}),
  animate(heading,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:560,delay:80,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}),
  animate(body,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:140,easing:'ease-out',fill:'both'})
 ]);
 if(epoch!==sceneEpoch||!running)return;
 transitioning=false;document.body.classList.remove('v284-tour-transition');schedule();
}
function start(){
 if(!home())return;if(running){show(0);return}focusBefore=document.activeElement;running=true;paused=false;root().hidden=false;step=0;
 document.body.classList.add('v282-tour-playing');show(0);
}
function stop(){
 clear();cancelMotion();running=false;paused=false;root().hidden=true;
 document.body.classList.remove('v282-tour-playing');
 if(focusBefore?.isConnected)focusBefore.focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 const btn=event.target.closest?.('#v280-hero [data-v280-scroll="v280-intro"]');
 if(!btn||!home())return;event.preventDefault();event.stopImmediatePropagation();start();
},true);
document.addEventListener('keydown',e=>{if(running&&e.key==='Escape'){e.preventDefault();stop()}});
window.addEventListener('wheel',()=>{if(running&&!paused){paused=true;clear();cancelMotion();paint()}},{passive:true});
window.addEventListener('touchstart',e=>{if(running&&!paused&&!e.target.closest?.('#v282-tour')){paused=true;clear();cancelMotion();paint()}},{passive:true});
window.addEventListener('hashchange',()=>{if(!home()&&running)stop()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clear();cancelMotion()}else schedule()});
const motionPreference=window.matchMedia?.('(prefers-reduced-motion: reduce)');
motionPreference?.addEventListener?.('change',()=>{if(running)show(step)});
['scholark-language-applied','scholark-language-change'].forEach(name=>window.addEventListener(name,()=>{if(running)paint()}));
window.__SCHOLAVERUM_TOUR__={start,stop,state:()=>({running,paused,step,transitioning}),version:'r284'};
})();
