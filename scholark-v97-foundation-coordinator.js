(() => {
  if(window.__SCHOLARK_V97_FOUNDATION__)return;
  window.__SCHOLARK_V97_FOUNDATION__=true;
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const route=()=>String(location.hash||'#home').toLowerCase().replace(/^#/,'').split('-')[0]||'home';
  let repairing=false,schoolWheelBound=false;

  function bindSchoolWheel(){
    const overlay=$('#v50-school');
    if(!overlay||overlay.dataset.v97Wheel==='1')return;
    overlay.dataset.v97Wheel='1';
    overlay.addEventListener('wheel',e=>{
      if(!document.body.classList.contains('v51-schools'))return;
      const max=overlay.scrollHeight-overlay.clientHeight;
      if(max<=2)return;
      const before=overlay.scrollTop;
      overlay.scrollTop=Math.max(0,Math.min(max,before+e.deltaY));
      if(overlay.scrollTop!==before)e.preventDefault();
    },{passive:false});
  }

  function duplicateIds(){
    const seen=new Set(),dupes=[];
    $$('[id]').forEach(el=>{if(seen.has(el.id))dupes.push(el.id);else seen.add(el.id)});
    return [...new Set(dupes)];
  }

  function repair(){
    if(repairing)return;
    repairing=true;
    try{
      const r=route();
      if(r==='schools'){
        const overlay=$('#v50-school');
        if(overlay){
          overlay.style.setProperty('inset','0 0 0 var(--v51-side)','important');
          overlay.style.setProperty('height','100dvh','important');
          overlay.style.setProperty('max-height','100dvh','important');
          overlay.style.setProperty('overflow-y','scroll','important');
          overlay.style.setProperty('overflow-x','hidden','important');
          overlay.style.setProperty('touch-action','pan-y','important');
          bindSchoolWheel();
        }
      }
      if(r==='project'&&window.__SCHOLARK_V64_PROJECTS__?.open&&!$('#v51-fallback .v64-projects')){
        setTimeout(()=>{if(route()==='project')window.__SCHOLARK_V64_PROJECTS__?.open?.()},0);
      }
      if(r==='book'&&window.__SCHOLARK_V65_BOOK__?.open&&!$('#v51-fallback .v65-book')){
        setTimeout(()=>{if(route()==='book')window.__SCHOLARK_V65_BOOK__?.open?.()},0);
      }
      if(r==='home'){
        $$('[data-v55-suppressed="1"]').forEach(el=>{
          if(getComputedStyle(el).display!=='none')el.style.setProperty('display','none','important');
        });
      }
    }finally{repairing=false}
  }

  function health(){
    const r=route(),school=$('#v50-school');
    const report={
      ok:true,
      release:'r112',
      route:r,
      runtimeErrors:window.__SCHOLARK_RUNTIME__?.errors?.()||[],
      duplicateIds:duplicateIds(),
      projectApi:!!window.__SCHOLARK_V64_PROJECTS__,
      bookApi:!!window.__SCHOLARK_V65_BOOK__,
      schoolApi:!!window.__SCHOLARK_V50_SCHOOL_FINDER__,
      schoolScrollable:r!=='schools'||!!school&&(school.scrollHeight>school.clientHeight?getComputedStyle(school).overflowY!=='hidden':true)
    };
    report.ok=report.runtimeErrors.length===0&&report.duplicateIds.length===0&&report.schoolScrollable;
    try{sessionStorage.setItem('scholark_foundation_r112',JSON.stringify(report))}catch{}
    console[report.ok?'log':'warn']('[SCHOLARK] Foundation R112 '+(report.ok?'PASS':'WARN'),report);
    return report;
  }

  addEventListener('hashchange',()=>{setTimeout(repair,35);setTimeout(health,500)});
  addEventListener('popstate',()=>setTimeout(repair,35));
  addEventListener('scholark-runtime-ready',()=>{setTimeout(repair,60);setTimeout(health,800)});
  addEventListener('resize',()=>setTimeout(repair,120),{passive:true});
  [120,500,1400].forEach(ms=>setTimeout(repair,ms));
  setTimeout(health,2200);
  window.__SCHOLARK_FOUNDATION__={repair,health,release:'r112'};
})();
