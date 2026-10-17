(() => {
'use strict';
if(window.__SCHOLAVERUM_R282_WORKSPACE_GUARD__)return;
window.__SCHOLAVERUM_R282_WORKSPACE_GUARD__=true;
const $=(s,r=document)=>r?.querySelector?.(s)||null;
const $$=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const dashboard=()=>String(location.hash||'').replace(/^#/,'').split(/[?&]/)[0].toLowerCase()==='dashboard';
const workspace=()=>document.body?.classList.contains('v51-workspace');
if(!document.getElementById('scholaverum-workspace-style')){const sheet=document.createElement('link');sheet.id='scholaverum-workspace-style';sheet.rel='stylesheet';sheet.href='scholark-v126-workspace-integrity.css?v=20261017-r284';document.head.appendChild(sheet)}
let timer=0,repairing=false,checks=0,repairs=0;
function audit(){
 timer=0;if(!workspace()||!dashboard()||repairing)return;
 const main=$('#v51-main'),side=$('#v51-sidebar');if(!main||!side)return;
 const broken=$$('#v51-main').length!==1||$$('#v51-sidebar').length!==1||
 $$(':scope > [data-v51-page="dashboard"]',main).length!==1||
 $$(':scope > .v51-page.active',main).length!==1||
 $$('.v51-head',main.querySelector('[data-v51-page="dashboard"]')).length!==1||
 $$('.v51-grid',main.querySelector('[data-v51-page="dashboard"]')).length!==1;
 if(broken){
  repairing=true;try{window.__SCHOLARK_WORKSPACE__?.sanitize?.('r282-canonical-layout');repairs++}finally{repairing=false}
 }
 const shell=$('#v51-main [data-v51-page="dashboard"].active .v51-shell');if(!shell)return;
 const head=$('.v51-head',shell),levels=$('.v51-levels',shell),grid=$('.v51-grid',shell);if(!head||!levels||!grid)return;
 [head,head.firstElementChild,head.querySelector('h1'),grid].filter(Boolean).forEach(el=>{
  for(const k of ['transform','position','top','left','bottom','right','translate','scale','animation'])
   if(el.style?.getPropertyValue(k))el.style.removeProperty(k);
 });
 const overlaps=!shell.dataset.workspaceOwner&&(levels.getBoundingClientRect().bottom>head.getBoundingClientRect().top+10||
 head.getBoundingClientRect().bottom>grid.getBoundingClientRect().top+10);
 if(overlaps){
  shell.classList.add('v282-layout-repaired');
  levels.style.removeProperty('height');head.style.removeProperty('height');grid.style.removeProperty('margin-top');
  repairs++;
 }
 checks++;
}
function schedule(){if(!timer)timer=setTimeout(audit,130)}
window.addEventListener('hashchange',schedule);window.addEventListener('resize',schedule,{passive:true});
['scholark-workspace-entry-ready','scholark-route-painted','scholark-language-applied','scholark-country-change'].forEach(n=>window.addEventListener(n,schedule));
const mo=new MutationObserver(muts=>{
 if(!workspace()||!dashboard())return;
 if(muts.some(m=>Array.from(m.addedNodes).concat(Array.from(m.removedNodes)).some(n=>n.nodeType===1&&(n.id==='v51-main'||n.id==='v51-sidebar'||n.matches?.('.v51-shell,.v51-head,.v51-grid,.v51-levels,[data-v51-page]')||n.querySelector?.('.v51-shell,.v51-head,.v51-grid,.v51-levels,[data-v51-page]')))))schedule();
});
function init(){if(document.body)mo.observe(document.body,{childList:true,subtree:true});schedule()}
if(document.body)init();else document.addEventListener('DOMContentLoaded',init,{once:true});
window.__SCHOLAVERUM_WORKSPACE_GUARD__={audit,stats:()=>({checks,repairs}),version:'r284'};
})();
