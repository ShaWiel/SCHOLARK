(() => {
  if (window.__SCHOLARK_V37_WORKSPACE_PRO_SUITE__) return;
  window.__SCHOLARK_V37_WORKSPACE_PRO_SUITE__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const txt=e=>(e?.textContent||'').trim();

  const css=document.createElement('style');
  css.id='scholark-v37-workspace-pro-style';
  css.textContent=`
    #v37-sidebar-pro{margin:17px 10px 10px;padding-top:13px;border-top:1px solid rgba(255,255,255,.08)}
    #v37-sidebar-pro .v37-side-title{padding:0 10px 8px;color:#8d8997;font:900 8px/1 Inter,system-ui;letter-spacing:.14em;text-transform:uppercase}
    .v37-side-btn{width:100%;border:0;background:transparent;color:#dedbe5;border-radius:10px;padding:9px 10px;margin:2px 0;display:flex;align-items:center;gap:9px;text-align:left;cursor:pointer;font:750 10.5px/1.2 Inter,system-ui}
    .v37-side-btn:hover{background:rgba(201,255,106,.09);color:#fff}.v37-side-btn i{width:20px;height:20px;border-radius:7px;background:rgba(201,255,106,.12);display:grid;place-items:center;color:#c9ff6a;font-style:normal;font-size:11px}.v37-side-btn em{margin-left:auto;font:900 7px/1 Inter;background:#c9ff6a;color:#17191f;border-radius:999px;padding:4px 5px;font-style:normal}
  `;
  document.head.appendChild(css);

  function isWorkspace(){
    const h=(location.hash||'').toLowerCase();
    return h.includes('dashboard')||h.includes('studio')||h.includes('presentation')||h.includes('document')||h.includes('report')||h.includes('poster')||h.includes('tutor')||h.includes('planner')||h.includes('progress')||h.includes('goal')||h.includes('project')||h.includes('education');
  }

  function findSidebar(){
    return $$('aside,nav,section,div').filter(el=>!el.closest('#v29-home-layer')).map(el=>({el,r:el.getBoundingClientRect(),t:txt(el)})).filter(o=>o.r.width>=150&&o.r.width<=380&&o.r.height>=350&&o.t.includes('Dashboard')&&(o.t.includes('Studio AI')||o.t.includes('AI Tutor'))).sort((a,b)=>a.r.width-b.r.width)[0]?.el||null;
  }

  function openProTool(tool){
    const trigger=$(`[data-tool="${tool}"]`);
    if(trigger){trigger.click();return;}
    const overlay=$('#sv24-overlay');
    if(overlay){
      overlay.classList.add('open');
      setTimeout(()=>document.querySelector(`[data-tool="${tool}"]`)?.click(),80);
      return;
    }
    const studio=$$('button,a,[role="button"],div').find(el=>/^Studio AI$/i.test(txt(el)));
    studio?.click();
    setTimeout(()=>{
      const ov=$('#sv24-overlay');ov?.classList.add('open');
      setTimeout(()=>document.querySelector(`[data-tool="${tool}"]`)?.click(),80);
    },220);
  }

  function injectSidebar(){
    if(!isWorkspace())return;
    const sidebar=findSidebar();if(!sidebar||$('#v37-sidebar-pro',sidebar))return;
    const box=document.createElement('div');box.id='v37-sidebar-pro';
    box.innerHTML=`<div class="v37-side-title">PRO TOOLS</div>
      <button class="v37-side-btn" data-v37="book"><i>📚</i><span>Book Studio</span><em>PRO</em></button>
      <button class="v37-side-btn" data-v37="schools"><i>⌖</i><span>Schools Near Me</span><em>PRO</em></button>
      <button class="v37-side-btn" data-v37="study"><i>↗</i><span>Study Ahead</span><em>PRO</em></button>`;
    sidebar.appendChild(box);
    $('[data-v37="book"]',box).onclick=()=>openProTool('book');
    $('[data-v37="schools"]',box).onclick=()=>openProTool('schools');
    $('[data-v37="study"]',box).onclick=()=>openProTool('study');
  }

  function cleanupOldSuite(){
    $('#v37-pro-suite')?.remove();
  }

  function sync(){cleanupOldSuite();injectSidebar();}
  new MutationObserver(()=>{clearTimeout(window.__v37ws);window.__v37ws=setTimeout(sync,80)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,30));
  setInterval(sync,650);setTimeout(sync,60);
})();