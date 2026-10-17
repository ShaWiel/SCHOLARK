(() => {
'use strict';
if(window.__SCHOLAVERUM_R280_REBUILD__)return;
window.__SCHOLAVERUM_R280_REBUILD__=true;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const home=()=>{const p=(location.pathname||'/').replace(/\/+$/,'')||'/';const h=(location.hash||'').replace(/^#/,'').split(/[?&]/)[0].toLowerCase();return(p==='/'||p==='/index.html')&&(h===''||h==='home'||h==='start')};
const reduced=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const lang=()=>{try{return localStorage.getItem('scholark_ui_language')||document.documentElement.lang||'en'}catch{return document.documentElement.lang||'en'}};
const EN={
'nav.how':'The idea','nav.demo':'Explore','nav.future':'Go further','nav.tools':'Everything inside',
'hero.eyebrow':'THE FUTURE OF LEARNING, REIMAGINED','hero.1':'LEARN','hero.2':'WITHOUT','hero.3':'LIMITS.',
'hero.pitch':'One beautiful space to ask bigger questions, understand the hard stuff and build what comes next. Meet SCHOLAVERUM.',
'hero.start':'Start with ARKI','hero.see':'Explore the experience','hero.note':'One workspace. More possibilities. Built around you.','hero.scroll':'Scroll to explore',
'tape.1':'ONE PLATFORM','tape.2':'INFINITE CURIOSITY','tape.3':'AI THAT HELPS YOU GROW',
'intro.over':'THE WAY FORWARD','intro.1':'NOT MORE','intro.2':'TOOLS.','intro.3':'MORE','intro.4':'POSSIBILITY.',
'intro.copy':'Your questions, your lessons, your plans and your progress belong together. SCHOLAVERUM connects them into a learning experience that moves with you.',
'intro.note':'CREATED FOR STUDENTS, DREAMERS AND EVERYONE STILL LEARNING',
'theater.over':'MEET YOUR NEW WORKSPACE','theater.title':'One place. Countless ways to grow.','theater.sub':'See how the tools work together, then open the workspace and make them yours.',
'theater.foot':'From your first question to your next achievement, every tool is within reach.','theater.open':'Open this tool',
'tabs.arki':'ARKI','tabs.tutor':'AI Tutor','tabs.language':'Languages','tabs.schools':'Find schools',
'demo.arki.title':'What will you discover today?','demo.arki.user':'Explain the difference between speed and velocity.',
'demo.arki.ai':'Speed tells you how fast something moves. Velocity adds direction. Let us make that click with a simple example.',
'demo.tutor.title':'Your next lesson, made clearer.','demo.tutor.q':'Which part of a plant absorbs sunlight?',
'demo.tutor.a':'A. Roots','demo.tutor.b':'B. Leaves ✓','demo.tutor.c':'C. Stem',
'demo.language.title':'A whole world of words.','demo.language.caption':'Build confidence through real-world language practice.',
'demo.schools.title':'Discover your next school.','demo.schools.map':'Nearby learning opportunities',
'duo.lang.over':'LEARN BEYOND BORDERS','duo.lang.head':'THE WORLD SPEAKS. YOU CAN TOO.',
'duo.lang.body':'Explore new languages with guided practice, lessons and review made for your pace.','duo.lang.btn':'Explore Language Learner',
'duo.schools.over':'FIND YOUR NEXT STEP','duo.schools.head':'YOUR NEXT CHAPTER STARTS HERE.',
'duo.schools.body':'Explore schools around you and get a clearer view of the educational path ahead.','duo.schools.btn':'Find schools near me',
'tools.over':'EVERYTHING CONNECTS','tools.title':'All your learning tools. Finally together.',
'tool.1.name':'Ask ARKI','tool.1.desc':'Write, code, brainstorm, explain and solve with a general-purpose assistant.',
'tool.2.name':'AI Tutor','tool.2.desc':'Work through difficult topics with explanations, questions and feedback.',
'tool.3.name':'Study planning','tool.3.desc':'Turn deadlines and goals into a manageable learning routine.',
'tool.4.name':'Flashcards','tool.4.desc':'Learn actively and revisit ideas when you need them.',
'tool.5.name':'Progress','tool.5.desc':'Understand where you are improving and where to focus next.',
'tool.6.name':'Schools Near Me','tool.6.desc':'Discover and compare nearby options for your educational future.',
'final.over':'WELCOME TO WHAT IS NEXT','final.head':'MAKE YOUR NEXT MOVE.','final.sub':'Your best ideas start with a question. Your next chapter starts here.',
'final.button':'Enter the workspace','footer.copy':'Built for curiosity. Designed for what comes next.'
};
const NL={
'nav.how':'Het idee','nav.demo':'Ontdekken','nav.future':'Verder groeien','nav.tools':'Alle functies',
'hero.eyebrow':'DE TOEKOMST VAN LEREN, OPNIEUW BEDACHT','hero.1':'LEER','hero.2':'ZONDER','hero.3':'GRENZEN.',
'hero.pitch':'Eén prachtige plek om grotere vragen te stellen, moeilijke onderwerpen te begrijpen en je toekomst vorm te geven. Ontdek SCHOLAVERUM.',
'hero.start':'Begin met ARKI','hero.see':'Ontdek de ervaring','hero.note':'Eén werkruimte. Meer mogelijkheden. Speciaal voor jou.','hero.scroll':'Scroll om te ontdekken',
'tape.1':'ÉÉN PLATFORM','tape.2':'ONEINDIGE NIEUWSGIERIGHEID','tape.3':'AI DIE JE HELPT GROEIEN',
'intro.over':'DE WEG VOORUIT','intro.1':'NIET MEER','intro.2':'TOOLS.','intro.3':'MAAR MEER','intro.4':'KANSEN.',
'intro.copy':'Je vragen, lessen, planning en voortgang horen bij elkaar. SCHOLAVERUM brengt ze samen in één leerervaring die met je meegroeit.',
'intro.note':'VOOR STUDENTEN, DROMERS EN IEDEREEN DIE BLIJFT LEREN',
'theater.over':'ONTDEK JE NIEUWE WERKRUIMTE','theater.title':'Eén plek. Eindeloos veel mogelijkheden.',
'theater.sub':'Ontdek hoe de functies samenwerken en open daarna je werkruimte om zelf aan de slag te gaan.',
'theater.foot':'Van je eerste vraag tot je volgende prestatie: alles is binnen handbereik.','theater.open':'Open deze functie',
'tabs.arki':'ARKI','tabs.tutor':'AI Tutor','tabs.language':'Talen','tabs.schools':'Scholen zoeken',
'demo.arki.title':'Wat ga jij vandaag ontdekken?','demo.arki.user':'Leg het verschil uit tussen snelheid en velocity.',
'demo.arki.ai':'Snelheid vertelt hoe snel iets beweegt. Velocity voegt de richting toe. Laten we dit verduidelijken met een voorbeeld.',
'demo.tutor.title':'Je volgende les, beter uitgelegd.','demo.tutor.q':'Welk deel van een plant neemt zonlicht op?',
'demo.tutor.a':'A. Wortels','demo.tutor.b':'B. Bladeren ✓','demo.tutor.c':'C. Stengel',
'demo.language.title':'Een wereld vol woorden.','demo.language.caption':'Leer met praktische oefeningen en bouw zelfvertrouwen op.',
'demo.schools.title':'Ontdek je volgende school.','demo.schools.map':'Onderwijsmogelijkheden in je omgeving',
'duo.lang.over':'LEER OVER GRENZEN HEEN','duo.lang.head':'DE WERELD SPREEKT. JIJ OOK.',
'duo.lang.body':'Ontdek nieuwe talen met lessen en oefeningen in jouw eigen tempo.','duo.lang.btn':'Ontdek Language Learner',
'duo.schools.over':'VIND JE VOLGENDE STAP','duo.schools.head':'JE VOLGENDE HOOFDSTUK BEGINT HIER.',
'duo.schools.body':'Ontdek scholen in de buurt en maak een beter geïnformeerde studiekeuze.','duo.schools.btn':'Zoek scholen in de buurt',
'tools.over':'ALLES WERKT SAMEN','tools.title':'Al je studietools. Eindelijk samen.',
'tool.1.name':'Vraag ARKI','tool.1.desc':'Schrijf, programmeer, bedenk, analyseer en los problemen op met AI.',
'tool.2.name':'AI Tutor','tool.2.desc':'Begrijp moeilijke onderwerpen met uitleg, vragen en feedback.',
'tool.3.name':'Studieplanning','tool.3.desc':'Zet deadlines en doelen om in een haalbaar leerplan.',
'tool.4.name':'Flashcards','tool.4.desc':'Oefen actief en herhaal wat belangrijk is.',
'tool.5.name':'Voortgang','tool.5.desc':'Ontdek wat beter gaat en waar je nog aandacht aan kunt besteden.',
'tool.6.name':'Schools Near Me','tool.6.desc':'Vind en vergelijk scholen voor je toekomst.',
'final.over':'WELKOM BIJ DE TOEKOMST','final.head':'ZET JE VOLGENDE STAP.','final.sub':'Een mooi idee begint met een vraag. Jouw volgende hoofdstuk begint hier.',
'final.button':'Open de werkruimte','footer.copy':'Gebouwd voor nieuwsgierigheid. Ontworpen voor wat komt.'
};
const dicts=new Map([['en',EN],['nl',NL]]),pending=new Map();let translationEpoch=0;
const t=key=>(dicts.get(lang())||EN)[key]||EN[key]||key;
const k=(key,tag='span')=>'<'+tag+' data-v280-copy="'+key+'">'+esc(t(key))+'</'+tag+'>';
const cta=(key,route,cls='acid')=>'<button type="button" class="v280-cta '+cls+'" data-v280-route="'+route+'">'+k(key)+' <span aria-hidden="true">↗</span></button>';
const over=key=>'<div class="v280-overline">'+k(key)+'</div>';
function markup(){
 const tapeWords='<span>'+k('tape.1')+'</span><b>✳</b><span>'+k('tape.2')+'</span><b>✳</b><span>'+k('tape.3')+'</span><b>✳</b>';
 const tabs=['arki','tutor','language','schools'].map((id,i)=>'<button type="button" class="v280-choice" role="tab" id="v280-tab-'+id+'" aria-selected="'+(i===0)+'" aria-controls="v280-demo" tabindex="'+(i===0?0:-1)+'" data-v280-tab="'+id+'"><span>'+k('tabs.'+id)+'</span><span aria-hidden="true">↗</span></button>').join('');
 const tools=['✺','✧','▦','▤','↗','◎'].map((icon,i)=>'<article class="v280-tool" data-v280-reveal><div class="v280-symbol" aria-hidden="true">'+icon+'</div><h3>'+k('tool.'+(i+1)+'.name')+'</h3><p>'+k('tool.'+(i+1)+'.desc')+'</p></article>').join('');
 return [
 '<section class="v280-hero" id="v280-hero" aria-labelledby="v280-headline"><div class="v280-grid-lines"></div><div class="v280-max">',
 '<div class="v280-hero-copy"><div class="v280-overline"><i class="v280-dot"></i>'+k('hero.eyebrow')+'</div>',
 '<h1 id="v280-headline">'+k('hero.1','span')+'<span class="v280-shift">'+k('hero.2')+'</span><span class="v280-outlined">'+k('hero.3')+'</span></h1>',
 '<p class="v280-hero-pitch">'+k('hero.pitch')+'</p><div class="v280-hero-actions">'+cta('hero.start','ai')+
 '<button type="button" class="v280-cta ghost" data-v280-scroll="v280-intro">'+k('hero.see')+' <span aria-hidden="true">↓</span></button></div>',
 '<p class="v280-hero-under">'+k('hero.note')+'</p></div>',
 '<div class="v280-hero-art" aria-hidden="true"><div class="v280-orbit"></div><div class="v280-orbit two"></div><div class="v280-planet"></div>',
 '<div class="v280-floating top"><span>AI TUTOR</span><strong>Understand more.</strong><div class="v280-mini-lines"><i></i><i></i><i></i><i></i></div></div>',
 '<div class="v280-floating bottom"><span>ARKI · AI COMPANION</span><strong>Ready for your next idea.</strong><small>✳ Thought → action</small></div></div>',
 '<div class="v280-scroll-prompt">'+k('hero.scroll')+'<b aria-hidden="true">↓</b></div></div></section>',
 '<div class="v280-tape" aria-hidden="true"><div class="v280-tape-inner">'+tapeWords+tapeWords+'</div></div>',
 '<section class="v280-intro" id="v280-intro" aria-labelledby="v280-intro-title"><div class="v280-max">',
 '<div data-v280-reveal>'+over('intro.over')+'</div><h2 id="v280-intro-title" data-v280-reveal>'+k('intro.1')+'<br>'+k('intro.2')+'<br><em>'+k('intro.3')+'<br>'+k('intro.4')+'</em></h2>',
 '<div class="v280-intro-bottom" data-v280-reveal><p>'+k('intro.copy')+'</p><div class="v280-small">'+k('intro.note')+'</div></div></div></section>',
 '<section class="v280-feature-theater" id="v280-theater" aria-labelledby="v280-theater-title"><div class="v280-max">',
 '<div class="v280-section-head" data-v280-reveal><div><div class="v280-overline v280-acid">'+k('theater.over')+'</div><h2 id="v280-theater-title">'+k('theater.title')+'</h2></div><p>'+k('theater.sub')+'</p></div>',
 '<div class="v280-showcase" data-v280-reveal><div class="v280-selector"><div class="v280-selector-tabs" role="tablist" aria-label="Workspace feature previews">'+tabs+'</div><small>'+k('theater.foot')+'</small></div>',
 '<div class="v280-screen" id="v280-demo" role="tabpanel" aria-labelledby="v280-tab-arki" tabindex="0"><div class="v280-app" id="v280-app-preview"></div></div></div>',
 '<div class="v280-showcase-bottom" data-v280-reveal><p>'+k('theater.foot')+'</p><button type="button" class="v280-cta acid" data-v280-open-feature>'+k('theater.open')+' <span aria-hidden="true">↗</span></button></div></div></section>',
 '<div class="v280-duo" id="v280-future"><section class="v280-panel lime" aria-labelledby="v280-lang-head">',
 over('duo.lang.over')+'<h2 id="v280-lang-head" data-v280-reveal>'+k('duo.lang.head')+'</h2><p data-v280-reveal>'+k('duo.lang.body')+'</p>'+cta('duo.lang.btn','language','ink'),
 '<div class="v280-panel-graphic" aria-hidden="true"><div class="v280-languages"><div>HOLA</div><div>你好</div><div>HELLO</div></div></div></section>',
 '<section class="v280-panel purple" aria-labelledby="v280-school-head">'+over('duo.schools.over')+
 '<h2 id="v280-school-head" data-v280-reveal>'+k('duo.schools.head')+'</h2><p data-v280-reveal>'+k('duo.schools.body')+'</p>'+cta('duo.schools.btn','schools','ink'),
 '<div class="v280-panel-graphic" aria-hidden="true"><div class="v280-navigator"></div></div></section></div>',
 '<section class="v280-toolkit" id="v280-tools" aria-labelledby="v280-tools-title"><div class="v280-max"><div data-v280-reveal>'+over('tools.over')+'</div><h2 id="v280-tools-title" data-v280-reveal>'+k('tools.title')+'</h2><div class="v280-tools">'+tools+'</div></div></section>',
 '<section class="v280-final" id="v280-start" aria-labelledby="v280-start-title"><div class="v280-overline v280-acid" data-v280-reveal>'+k('final.over')+'</div><h2 id="v280-start-title" data-v280-reveal>'+k('final.head')+'</h2><p>'+k('final.sub')+'</p>'+cta('final.button','dashboard')+'</section>',
 '<footer class="v280-footer"><strong>SCHOLAVERUM</strong><span>'+k('footer.copy')+'</span><a href="#home" data-v280-scroll="v280-hero">↑ Back to top</a></footer>'
 ].join('');
}
let chosen='arki';
function scene(id){
 const frame='<div class="v280-app-top"><b>SCHOLAVERUM</b><span>● ● ●</span></div>';
 const label=(key,tag='p',cls='')=>'<'+tag+(cls?' class="'+cls+'"':'')+' data-v280-copy="'+key+'">'+esc(t(key))+'</'+tag+'>';
 if(id==='arki')return frame+'<div class="v280-app-inner">'+label('demo.arki.title','h3')+label('demo.arki.user','div','v280-message user')+label('demo.arki.ai','div','v280-message ai')+'<div class="v280-chart"><i style="--v280-height:37%"></i><i style="--v280-height:68%"></i><i style="--v280-height:50%"></i><i style="--v280-height:90%"></i><i style="--v280-height:75%"></i></div></div>';
 if(id==='tutor')return frame+'<div class="v280-app-inner">'+label('demo.tutor.title','h3')+label('demo.tutor.q')+label('demo.tutor.a','div','v280-quiz-option')+label('demo.tutor.b','div','v280-quiz-option good')+label('demo.tutor.c','div','v280-quiz-option')+'</div>';
 if(id==='language')return frame+'<div class="v280-app-inner">'+label('demo.language.title','h3')+label('demo.language.caption')+'<div class="v280-words"><div class="v280-word">Hola</div><div class="v280-word">Bonjour</div><div class="v280-word">你好</div></div></div>';
 return frame+'<div class="v280-app-inner">'+label('demo.schools.title','h3')+'<div class="v280-map"><i class="v280-pin one"></i><i class="v280-pin two"></i><i class="v280-pin three"></i>'+label('demo.schools.map','span','v280-map-label')+'</div></div>';
}
function choose(id){
 if(!['arki','tutor','language','schools'].includes(id))id='arki';chosen=id;
 $$('#v280-editorial-home [data-v280-tab]').forEach(btn=>{const selected=btn.dataset.v280Tab===id;btn.setAttribute('aria-selected',String(selected));btn.tabIndex=selected?0:-1});
 $('#v280-demo')?.setAttribute('aria-labelledby','v280-tab-'+id);
 const preview=$('#v280-app-preview');if(preview&&preview.dataset.scene!==id){preview.innerHTML=scene(id);preview.dataset.scene=id;}
}
function mount(){
 const layer=$('#v29-home-layer');if(!layer)return;
 if($('#v280-editorial-home',layer))return;
 const root=document.createElement('div');root.id='v280-editorial-home';root.setAttribute('data-sch-i18n-owned','1');root.innerHTML=markup();layer.appendChild(root);choose(chosen);
}
function bridgeWorkspaceCTA(){
 const existing=$('#v55-workspace-cta'),actions=$('#v280-hero .v280-hero-actions');
 if(existing&&actions&&existing.parentElement!==actions)actions.appendChild(existing);
}
function nav(){
 const bar=$('#v55-topbar');if(!bar||$('#v280-header-links',bar))return;
 const n=document.createElement('nav');n.id='v280-header-links';n.setAttribute('aria-label','Homepage navigation');
 n.innerHTML=[['how','v280-intro'],['demo','v280-theater'],['future','v280-future'],['tools','v280-tools']].map(([key,id])=>'<button type="button" data-v280-scroll="'+id+'" data-v280-copy="nav.'+key+'">'+esc(t('nav.'+key))+'</button>').join('');
 const actions=$('.v55-actions',bar);if(actions)bar.insertBefore(n,actions);else bar.appendChild(n);
}
function renderCopy(dict){
 const root=$('#v280-editorial-home'),menu=$('#v280-header-links');
 [root,menu].filter(Boolean).forEach(node=>$$('[data-v280-copy]',node).forEach(el=>{const key=el.dataset.v280Copy;if(dict[key])el.textContent=dict[key]}));
}
async function translate(){
 const code=lang(),tick=++translationEpoch;renderCopy(dicts.get(code)||EN);
 if(dicts.has(code))return;
 const api=window.__SCHOLARK_I18N__;if(!api||typeof api.translateStrings!=='function')return;
 try{
   if(!pending.has(code)){const promise=Promise.resolve(api.translateStrings(code,Object.values(EN),'r280_home'));pending.set(code,promise);promise.finally(()=>{if(pending.get(code)===promise)pending.delete(code)}).catch(()=>{})}
   const result=await pending.get(code);if(tick!==translationEpoch||code!==lang())return;
   const out={};for(const [key,value] of Object.entries(EN))out[key]=result?.[value]||value;
   dicts.set(code,out);renderCopy(out);
 }catch{}
}
let observer=null,mousemoveBound=false,scrollFrame=0;
function animate(){
 const root=$('#v280-editorial-home');if(!root||observer||reduced()||!('IntersectionObserver' in window))return;
 observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('v280-shown');observer.unobserve(e.target)}}},{threshold:.04,rootMargin:'0px 0px 80px 0px'});
 $$('[data-v280-reveal]',root).forEach(e=>observer.observe(e));document.documentElement.classList.add('v280-motion');
}
function pointer(){
 if(mousemoveBound||reduced()||!matchMedia?.('(pointer:fine)').matches)return;
 const hero=$('#v280-hero'),art=$('.v280-hero-art',hero||document);if(!hero||!art)return;mousemoveBound=true;let frame=0;
 hero.addEventListener('pointermove',ev=>{const box=hero.getBoundingClientRect(),x=((ev.clientX-box.left)/box.width-.5)*25,y=((ev.clientY-box.top)/box.height-.5)*25;
  if(!frame)frame=requestAnimationFrame(()=>{frame=0;art.style.setProperty('--v280-x',x.toFixed(1)+'px');art.style.setProperty('--v280-y',y.toFixed(1)+'px');hero.style.setProperty('--v281-pointer-x',((ev.clientX-box.left)/box.width*100).toFixed(1)+'%');hero.style.setProperty('--v281-pointer-y',((ev.clientY-box.top)/box.height*100).toFixed(1)+'%')})},{passive:true});
 hero.addEventListener('pointerleave',()=>{art.style.setProperty('--v280-x','0px');art.style.setProperty('--v280-y','0px')},{passive:true});
}
/* r281 motion lifecycle. Observers pause offscreen animation and release it on return. */
let v281StageObserver=null,v281Targets=[],v281Listeners=false;
const v281Moving=el=>{
 const r=el.getBoundingClientRect();
 return r.height>0&&r.bottom>-120&&r.top<innerHeight+120;
};
function v281Toggle(el,on){
 el.classList.toggle('v281-inview',on);
 if(el.classList.contains('v280-panel-graphic'))el.classList.toggle('v281-on-screen',on);
}
function v281Refresh(){
 const enabled=home()&&!document.hidden&&!reduced();
 document.body?.classList.toggle('v281-motion-paused',!enabled);
 for(const el of v281Targets)v281Toggle(el,enabled&&v281Moving(el));
}
function v281Setup(){
 const root=$('#v280-editorial-home');
 if(!root)return;
 // These illustrations get the same one-time scroll reveal as the editorial copy.
 $$('.v280-panel-graphic',root).forEach(node=>node.setAttribute('data-v280-reveal',''));
 if(v281StageObserver){v281Refresh();return}
 v281Targets=$$('.v280-hero,.v280-tape,.v280-screen,.v280-panel-graphic',root);
 if('IntersectionObserver' in window){
  v281StageObserver=new IntersectionObserver(entries=>{
   const enabled=home()&&!document.hidden&&!reduced();
   for(const e of entries)v281Toggle(e.target,enabled&&e.isIntersecting);
  },{threshold:0,rootMargin:'120px 0px 120px 0px'});
  v281Targets.forEach(el=>v281StageObserver.observe(el));
 }else v281StageObserver={disconnect(){}};
 if(!v281Listeners){
  v281Listeners=true;
  document.addEventListener('visibilitychange',v281Refresh);
  window.addEventListener('pagehide',()=>document.body?.classList.add('v281-motion-paused'));
  window.addEventListener('focus',v281Refresh);
  window.addEventListener('resize',v281Refresh,{passive:true});
  const mq=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if(mq?.addEventListener)mq.addEventListener('change',v281Refresh);
 }
 v281Refresh();
}
function v281Parallax(){
 if(!home()||reduced()||window.matchMedia?.('(max-width:780px)').matches)return;
 const hero=$('#v280-hero');if(!hero)return;
 const rect=hero.getBoundingClientRect();
 if(rect.bottom<0||rect.top>innerHeight)return;
 const amount=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height)));
 hero.style.setProperty('--v281-parallax',(-65*amount).toFixed(1)+'px');
}

function progress(){scrollFrame=0;if(!home())return;const bar=$('#v280-progress');if(!bar)return;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);bar.style.transform='scaleX('+Math.max(0,Math.min(1,scrollY/max))+')';v281Parallax()}
const queueProgress=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(progress)};
function sync(){
 if(!document.body)return;
 const active=home();document.body.classList.toggle('v280-home-rebuild',active);
 const bar=$('#v280-progress')||(()=>{const el=document.createElement('div');el.id='v280-progress';el.setAttribute('aria-hidden','true');document.body.appendChild(el);return el})();
 bar.hidden=!active;if(!active){v281Refresh();return;}
 mount();bridgeWorkspaceCTA();nav();v281Setup();animate();pointer();translate();queueProgress();
}
document.addEventListener('click',ev=>{
 const hit=ev.target.closest?.('[data-v280-route],[data-v280-scroll],[data-v280-tab],[data-v280-open-feature]');if(!hit||!home())return;
 if(hit.dataset.v280Tab){choose(hit.dataset.v280Tab);return}
 if(hit.hasAttribute('data-v280-route')){ev.preventDefault();location.hash='#'+hit.dataset.v280Route;return}
 if(hit.hasAttribute('data-v280-open-feature')){ev.preventDefault();location.hash='#'+(chosen==='arki'?'ai':chosen);return}
 if(hit.hasAttribute('data-v280-scroll')){ev.preventDefault();document.getElementById(hit.dataset.v280Scroll)?.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'})}
});
document.addEventListener('keydown',ev=>{
 const btn=ev.target.closest?.('[data-v280-tab]');if(!btn||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(ev.key))return;
 const ids=['arki','tutor','language','schools'];let at=ids.indexOf(btn.dataset.v280Tab);
 if(ev.key==='Home')at=0;else if(ev.key==='End')at=3;else at=(at+(['ArrowRight','ArrowDown'].includes(ev.key)?1:-1)+ids.length)%ids.length;
 ev.preventDefault();choose(ids[at]);$('#v280-tab-'+ids[at])?.focus();
});
window.addEventListener('scroll',queueProgress,{passive:true});window.addEventListener('resize',queueProgress,{passive:true});
window.addEventListener('hashchange',()=>setTimeout(sync,60));window.addEventListener('pageshow',()=>setTimeout(sync,40));
['scholark:topbar-ready','scholark-runtime-ready','scholark-return-home','scholark-route-painted'].forEach(event=>window.addEventListener(event,()=>setTimeout(sync,50)));
['scholark-language-ready','scholark-language-applied','scholark-language-change'].forEach(event=>window.addEventListener(event,()=>setTimeout(translate,100)));
if(!document.getElementById('scholaverum-home-style')){const css=document.createElement('link');css.id='scholaverum-home-style';css.rel='stylesheet';css.href='scholark-v124-editorial-home.css?v=20261017-r285';document.head.appendChild(css)}
[0,160,500,1300].forEach(ms=>setTimeout(sync,ms));
window.__SCHOLAVERUM_R280_HOME__={sync,choose,home,version:'r281-motion-home'};
})();