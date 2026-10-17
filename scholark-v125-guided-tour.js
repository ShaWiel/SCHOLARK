(() => {
'use strict';
if(window.__SCHOLAVERUM_TOUR__)return;
const $=(s,r=document)=>r.querySelector(s);
const home=()=>['','home'].includes(String(location.hash||'').slice(1).split(/[?&]/)[0].toLowerCase());
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
let running=false,paused=false,step=0,timer=null,focusBefore=null;
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
 clear();if(!running||paused||reduce()||document.hidden)return;
 timer=setTimeout(()=>{if(!running||paused)return;if(step===6){paused=true;paint()}else show(step+1)},step===0?5500:6500);
}
function show(n){
 if(!running)return;step=Math.min(6,Math.max(0,n));
 const row=copy()[step];if(row[3])window.__SCHOLAVERUM_R280_HOME__?.choose?.(row[3]);
 document.getElementById(row[2])?.scrollIntoView({behavior:reduce()?'instant':'smooth',block:'start'});
 paint();schedule();
}
function start(){
 if(!home())return;focusBefore=document.activeElement;running=true;paused=false;root().hidden=false;step=0;
 document.body.classList.add('v282-tour-playing');show(0);
}
function stop(){
 clear();running=false;paused=false;root().hidden=true;
 document.body.classList.remove('v282-tour-playing');
 if(focusBefore?.isConnected)focusBefore.focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 const btn=event.target.closest?.('#v280-hero [data-v280-scroll="v280-intro"]');
 if(!btn||!home())return;event.preventDefault();event.stopImmediatePropagation();start();
},true);
document.addEventListener('keydown',e=>{if(running&&e.key==='Escape'){e.preventDefault();stop()}});
window.addEventListener('wheel',()=>{if(running&&!paused){paused=true;clear();paint()}},{passive:true});
window.addEventListener('touchstart',e=>{if(running&&!paused&&!e.target.closest?.('#v282-tour')){paused=true;clear();paint()}},{passive:true});
window.addEventListener('hashchange',()=>{if(!home()&&running)stop()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();else schedule()});
['scholark-language-applied','scholark-language-change'].forEach(name=>window.addEventListener(name,()=>{if(running)paint()}));
window.__SCHOLAVERUM_TOUR__={start,stop,state:()=>({running,paused,step}),version:'r282'};
})();