(() => {
  if(window.__SCHOLARK_V52_WORKSPACE_QA__)return;
  window.__SCHOLARK_V52_WORKSPACE_QA__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const text=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
  const lower=e=>text(e).toLowerCase();
  const nativeIds=['tutor','education','planner','progress','goal','project'];
  const aliases={tutor:['ai tutor','tutor ai','tutor'],education:['education & learning','educatie & leren','onderwijs & leren','education'],planner:['planner'],progress:['progress','voortgang'],goal:['goals','doelen','goal'],project:['my projects','mijn projecten','projects','projecten']};
  let currentHost=null,timer=null;

  const css=document.createElement('style');
  css.id='scholark-v52-style';
  css.textContent=`
    #v49-sidebar-toggle{display:none!important;visibility:hidden!important;pointer-events:none!important}
    body.v51-schools #v50-school,body.v51-study #v25-study,body.v51-book #v25-book{
      inset:0 0 0 var(--v51-side)!important;top:0!important;left:var(--v51-side)!important;right:0!important;bottom:0!important;
    }
    body.v51-collapsed.v51-schools #v50-school,body.v51-collapsed.v51-study #v25-study,body.v51-collapsed.v51-book #v25-book{inset:0!important;left:0!important}
    body.v51-collapsed .v51-native-host,body.v51-collapsed.v51-studio #v41-studio-workspace{left:0!important}
    #v51-sidebar .v51-logo>.v52-cloned-brand{width:42px!important;height:42px!important;max-width:42px!important;max-height:42px!important;display:grid!important;place-items:center!important;overflow:hidden!important}
    #v51-sidebar .v51-logo>.v52-cloned-brand img,#v51-sidebar .v51-logo>.v52-cloned-brand svg,#v51-sidebar .v51-logo>.v52-cloned-brand picture{max-width:100%!important;max-height:100%!important;width:auto!important;height:auto!important;display:block!important}
  `;
  document.head.appendChild(css);

  function workspace(){return document.body.classList.contains('v51-workspace')}
  function copyComputedBrand(src,clone){
    try{const cs=getComputedStyle(src);['background','backgroundImage','backgroundColor','borderRadius','color','fontSize','fontWeight','display','placeItems','alignItems','justifyContent'].forEach(k=>{const v=cs[k];if(v&&v!=='none'&&v!=='normal')clone.style[k]=v})}catch{}
  }
  function upgradeLogo(){
    const host=$('#v51-sidebar .v51-logo');if(!host||host.dataset.v52Official==='1')return;
    const bad=el=>el?.closest?.('#v51-sidebar,#v48-sidebar,#v29-home-layer,#v41-studio-workspace');
    let mark=$$('img,svg,picture').find(el=>!bad(el)&&/scholark|logo/i.test((el.getAttribute('alt')||'')+' '+(el.getAttribute('src')||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.className?.baseVal||el.className||'')));
    if(!mark){
      const labels=$$('b,strong,span,div').filter(el=>!bad(el)&&/^scholark$/i.test(text(el)));
      for(const label of labels){
        let row=label.parentElement;
        for(let i=0;row&&row!==document.body&&i<4;i++,row=row.parentElement){
          mark=row.querySelector?.('img,svg,picture,[class*="logo" i],[class*="brand" i]');
          if(mark&&mark!==label&&!bad(mark))break;
          const prev=label.previousElementSibling||row.firstElementChild;
          if(prev&&prev!==label&&text(prev).length<25){mark=prev;break}
          mark=null;
        }
        if(mark)break;
      }
    }
    if(!mark)return;
    const wrap=document.createElement('div');wrap.className='v52-cloned-brand';const clone=mark.cloneNode(true);copyComputedBrand(mark,clone);wrap.appendChild(clone);host.innerHTML='';host.appendChild(wrap);host.dataset.v52Official='1';
  }

  function findLegacySidebar(){
    const keys=['dashboard','studio ai','ai tutor','planner','progress','goals','my projects'];
    return $$('aside,nav,section,div').filter(el=>!el.closest('#v51-sidebar,#v48-sidebar,#v51-main,#v29-home-layer,#v41-studio-workspace,#v50-school,#v25-study,#v25-book')).map(el=>({el,h:keys.reduce((n,k)=>n+(lower(el).includes(k)?1:0),0),len:text(el).length,n:el.querySelectorAll('*').length,r:el.getBoundingClientRect()})).filter(o=>o.h>=5&&o.len<16000).sort((a,b)=>b.h-a.h||a.n-b.n||a.len-b.len)[0]?.el||null;
  }
  function findItem(side,id){
    const aa=aliases[id]||[id];
    const all=$$('*',side).filter(el=>text(el).length>0&&text(el).length<100).map(el=>({el,t:lower(el),n:el.querySelectorAll('*').length})).filter(o=>aa.some(a=>o.t===a||o.t===a+'s'||o.t.startsWith(a+' '))).sort((a,b)=>{const ae=aa.includes(a.t)?0:1,be=aa.includes(b.t)?0:1;const ac=['BUTTON','A'].includes(a.el.tagName)||a.el.getAttribute('role')==='button'||a.el.hasAttribute('tabindex')?0:1,bc=['BUTTON','A'].includes(b.el.tagName)||b.el.getAttribute('role')==='button'||b.el.hasAttribute('tabindex')?0:1;return ae-be||ac-bc||a.n-b.n});
    return all[0]?.el||null;
  }
  function contentSibling(side){
    let node=side;
    for(let depth=0;node?.parentElement&&node.parentElement!==document.body&&depth<6;depth++){
      const p=node.parentElement;
      const siblings=[...p.children].filter(x=>x!==node&&!x.closest?.('#v51-sidebar,#v51-main,#v29-home-layer,#v41-studio-workspace,#v50-school,#v25-study,#v25-book'));
      const c=siblings.map(el=>({el,r:el.getBoundingClientRect(),main:el.matches('main,[role="main"]')||!!el.querySelector('main,[role="main"]'),len:text(el).length})).filter(o=>o.main||o.r.width>320||o.len>180).sort((a,b)=>(b.main?1:0)-(a.main?1:0)||(b.r.width*b.r.height)-(a.r.width*a.r.height))[0]?.el;
      if(c)return c;
      node=p;
    }
    return $$('main,[role="main"],[data-v30-legacy-home="1"]').filter(el=>!el.closest('#v51-main,#v29-home-layer,#v41-studio-workspace,#v50-school,#v25-study,#v25-book')).map(el=>({el,r:el.getBoundingClientRect(),len:text(el).length})).filter(o=>o.len>100).sort((a,b)=>(b.r.width*b.r.height)-(a.r.width*a.r.height))[0]?.el||null;
  }
  function unhide(el){if(!el)return;delete el.dataset.v30LegacyHome;el.hidden=false;el.removeAttribute('aria-hidden');['display','visibility','opacity','pointer-events','transform','width','height','max-width','max-height','margin','marginLeft'].forEach(k=>el.style.removeProperty(k));let p=el.parentElement,c=0;while(p&&p!==document.body&&c<3){p.hidden=false;p.removeAttribute('aria-hidden');['display','visibility','opacity','pointer-events'].forEach(k=>p.style.removeProperty(k));p=p.parentElement;c++}}
  function clickChain(el){
    const chain=[];let n=el;for(let i=0;n&&i<5;i++,n=n.parentElement){chain.push(n);if(['BUTTON','A'].includes(n.tagName)||n.getAttribute('role')==='button'||n.hasAttribute('tabindex'))break}
    chain.forEach((x,i)=>setTimeout(()=>{try{x.click()}catch{}},i*35));
  }
  function mount(id){
    const side=findLegacySidebar();if(!side)return false;const item=findItem(side,id);if(!item)return false;const before=contentSibling(side);clickChain(item);history.replaceState(null,'',location.pathname+location.search+'#'+id);document.body.classList.add('v51-workspace','v51-native');document.body.classList.remove('v51-studio','v51-pro','v51-schools','v51-study','v51-book');$('#v51-main')?.style.setProperty('display','none','important');
    if(currentHost){currentHost.classList.remove('v51-native-host');currentHost=null}clearInterval(timer);let tries=0;timer=setInterval(()=>{tries++;const host=contentSibling(side)||before;unhide(host);if(host){currentHost=host;host.classList.add('v51-native-host')}if(host&&tries>=10){clearInterval(timer);timer=null}else if(tries>=30){clearInterval(timer);timer=null}},70);return true;
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-v51-tool]');if(!b)return;const id=b.dataset.v51Tool;if(!nativeIds.includes(id))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const ok=mount(id);if(!ok){setTimeout(()=>{const again=mount(id);if(!again){history.replaceState(null,'',location.pathname+location.search+'#'+id);document.body.classList.add('v51-workspace');$('#v51-main')?.style.removeProperty('display');const fb=$('[data-v51-page="fallback"]');$$('.v51-page',$('#v51-main')).forEach(p=>p.classList.toggle('active',p===fb));const h=$('#v51-fallback');if(h)h.innerHTML=`<div class="v51-fallback"><div class="v51-fallback-card"><h2>${text(b)}</h2><p>The original SCHOLARK tool view could not be mounted yet. The route now stays inside the workspace instead of returning to Dashboard.</p></div></div>`}},180)}
  },true);

  function qa(){
    upgradeLogo();
    $('#v49-sidebar-toggle')?.setAttribute('hidden','');
    if(!workspace()){$('#v51-side-toggle')?.setAttribute('hidden','');return}else $('#v51-side-toggle')?.removeAttribute('hidden');
    $$('#v41-studio-workspace .v41-mode[data-mode="book"],#v29-home-layer .v29-type[data-mode="book"],#v29-home-layer .v29-tab[data-mode="book"]').forEach(x=>x.remove());
  }
  addEventListener('hashchange',()=>setTimeout(qa,20));addEventListener('resize',()=>setTimeout(qa,20));
  new MutationObserver(()=>{clearTimeout(window.__v52q);window.__v52q=setTimeout(qa,90)}).observe(document.documentElement,{subtree:true,childList:true});
  setInterval(qa,850);setTimeout(qa,80);
})();