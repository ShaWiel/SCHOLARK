(() => {
  if(window.__SCHOLARK_V112_VISUAL_SYSTEM__) return;
  window.__SCHOLARK_V112_VISUAL_SYSTEM__ = true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const clean=s=>String(s??"").replace(/\s+/g," ").trim();
  const route=()=>String(location.hash||"#dashboard").replace(/^#/,"").split(/[?&]/)[0].toLowerCase();
  const core=()=>window.__SCHOLARK_WORKSPACE_CORE__;
  const workspaceRoutes=new Set(["ai","tutor","education","planner","focus","flashcards","assignments","progress","goal","language","files","project","schools","study"]);
  const meta={
    ai:["✦","ARKI","One assistant. Connected context.","violet"],
    tutor:["✧","AI Tutor","Explain. Check. Practise. Adapt.","violet"],
    education:["◎","Education & Learning","Diagnostics → mastery → review.","lime"],
    planner:["▦","Planner","Turn priorities into time.","violet"],
    focus:["◴","Focus Sessions","Protect attention. Finish work.","lime"],
    flashcards:["▤","Flashcards","Recall now. Remember later.","violet"],
    assignments:["✓","Assignments","Deadlines into progress.","lime"],
    progress:["↗","Progress","See momentum and weak spots.","violet"],
    goal:["●","Goals","Make ambition measurable.","lime"],
    language:["Aa","Language Learner","Vocabulary + real practice.","violet"],
    files:["▣","Files & Notes","Turn material into action.","lime"],
    project:["▧","My Projects","Keep learning work moving.","violet"],
    schools:["✦","Schools Near Me","Compare options with context.","lime"],
    study:["↗","Study Ahead","Build the route to what is next.","violet"]
  };
  const css=[
    ":root{--v112-ink:#151821;--v112-lime:#c9ff6a;--v112-violet:#6d5dfc;--v112-line:rgba(23,25,31,.08)}",
    "body.v51-workspace{background:radial-gradient(circle at 78% 10%,rgba(109,93,252,.07),transparent 28%),linear-gradient(180deg,#f8f7f2,#efede7)!important}",
    "body.v51-workspace #v51-main{background:transparent!important}",
    ".v111-live.v112-live{position:relative;overflow:hidden;border:0!important;border-radius:30px!important;padding:22px!important;background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(247,245,255,.96))!important;box-shadow:0 28px 85px rgba(31,27,63,.11)!important;isolation:isolate}",
    ".v111-live.v112-live:before{content:'';position:absolute;width:390px;height:390px;border-radius:50%;right:-190px;top:-210px;background:var(--v112-accent,#6d5dfc);opacity:.09;pointer-events:none;z-index:-1}",
    ".v111-live.v112-live[data-v112-tone=lime]{--v112-accent:#9fdc38}.v111-live.v112-live[data-v112-tone=violet]{--v112-accent:#6d5dfc}",
    ".v111-live.v112-live .v111-top>div:first-child{display:grid;grid-template-columns:auto 1fr;column-gap:11px;align-items:center}.v112-mark{grid-row:1/4;width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:#151821;color:#c9ff6a;font:950 16px Inter;box-shadow:0 14px 30px rgba(23,25,31,.18)}",
    ".v111-live.v112-live .v111-top h2{font-size:clamp(23px,2.5vw,34px)!important;letter-spacing:-.04em!important}.v111-live.v112-live .v111-top p{font-size:9px!important;max-width:830px!important}.v111-live.v112-live .v111-pill{background:rgba(23,25,31,.06)!important;color:#524b5d!important;border:1px solid rgba(23,25,31,.06);box-shadow:none!important}",
    ".v111-live.v112-live .v111-kpi{border-radius:16px!important;padding:12px!important;box-shadow:0 9px 24px rgba(31,27,63,.04);transition:.18s ease}.v111-live.v112-live .v111-kpi:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(31,27,63,.08)}.v111-live.v112-live .v111-card{border-radius:18px!important;padding:14px!important;box-shadow:0 10px 30px rgba(31,27,63,.045)}",
    "body.v51-workspace .v52-tool,body.v51-workspace #v107-ai,body.v51-workspace .v62-study,body.v51-workspace .v93,body.v51-workspace .v86,body.v51-workspace .v64-projects{max-width:1440px!important}body.v51-workspace .v52-card,body.v51-workspace .v52-form,body.v51-workspace .v107-history,body.v51-workspace .v107-main,body.v51-workspace .v86-card{border-color:rgba(23,25,31,.065)!important;box-shadow:0 16px 46px rgba(31,27,63,.055)!important}body.v51-workspace .v52-form,body.v51-workspace .v52-card,body.v51-workspace .v86-card,body.v51-workspace .v64-card{content-visibility:auto;contain-intrinsic-size:240px}",
    "body[data-v112-tool=education] .v52-action-grid{gap:14px!important}body[data-v112-tool=education] .v52-action{min-height:150px!important;padding:22px!important;position:relative;overflow:hidden;box-shadow:0 18px 42px rgba(31,27,63,.065)}body[data-v112-tool=education] .v52-action:before{display:grid;place-items:center;width:34px;height:34px;border-radius:11px;margin-bottom:16px;background:#efedff;color:#6d5dfc;font:950 14px Inter}body[data-v112-tool=education] .v52-action[data-edu=curriculum]:before{content:'▦'}body[data-v112-tool=education] .v52-action[data-edu=mastery]:before{content:'◎'}body[data-v112-tool=education] .v52-action[data-edu=exam]:before{content:'✓'}body[data-v112-tool=education] .v52-action[data-edu=diagnostic]:before{content:'↗'}body[data-v112-tool=education] .v52-action[data-edu=review]:before{content:'◴'}body[data-v112-tool=education] .v52-action[data-edu=methods]:before{content:'✦'}body[data-v112-tool=education] .v52-action:nth-child(1),body[data-v112-tool=education] .v52-action:nth-child(4){background:linear-gradient(145deg,#17191f,#29233f)!important;color:#fff!important;border-color:transparent!important}body[data-v112-tool=education] .v52-action:nth-child(1) span,body[data-v112-tool=education] .v52-action:nth-child(4) span{color:#d8d4df!important}body[data-v112-tool=education] .v52-action:nth-child(2),body[data-v112-tool=education] .v52-action:nth-child(5){background:linear-gradient(145deg,#d9ff91,#c4fb64)!important;border-color:transparent!important}body[data-v112-tool=education] .v52-action:nth-child(2):before,body[data-v112-tool=education] .v52-action:nth-child(5):before{background:#17191f;color:#c9ff6a}body[data-v112-tool=education] .v52-action b{font-size:16px!important}body[data-v112-tool=education] .v52-action span{font-size:9px!important}",
    "body[data-v112-tool=planner] .v52-summary .v52-mini-card:nth-child(1),body[data-v112-tool=progress] .v52-summary .v52-mini-card:nth-child(1){background:#17191f!important;color:#fff!important}body[data-v112-tool=planner] .v52-summary .v52-mini-card:nth-child(1) span,body[data-v112-tool=progress] .v52-summary .v52-mini-card:nth-child(1) span{color:#cfccd7!important}body[data-v112-tool=planner] .v52-summary .v52-mini-card:nth-child(2),body[data-v112-tool=progress] .v52-summary .v52-mini-card:nth-child(2){background:#c9ff6a!important}body[data-v112-tool=planner] .v52-form,body[data-v112-tool=goal] .v52-form{background:linear-gradient(145deg,#fff,#faf9ff)!important}",
    "body[data-v112-tool=focus] .v106-timer{box-shadow:0 22px 60px rgba(31,27,63,.18)!important}body[data-v112-tool=flashcards] .v106-flash-stage{box-shadow:0 24px 60px rgba(31,27,63,.16)!important;border-radius:24px!important}body[data-v112-tool=assignments] .v106-item{border-left:4px solid #6d5dfc!important}body[data-v112-tool=assignments] .v106-item:has(.v106-badge.warn){border-left-color:#ff8878!important}",
    "body[data-v112-tool=language] .v93-intro{background:linear-gradient(145deg,#17191f,#28223f)!important;color:#fff!important}body[data-v112-tool=language] .v93-intro p{color:#d5d2dc!important}body[data-v112-tool=files] .v86-drop{background:linear-gradient(145deg,#efffcf,#f8fff0)!important;border:1px dashed rgba(60,90,16,.28)!important}body[data-v112-tool=files] .v86-output{background:linear-gradient(145deg,#fff,#f6f3ff)!important}body[data-v112-tool=project] .v64-card{border-radius:20px!important;box-shadow:0 16px 40px rgba(31,27,63,.07)!important}body[data-v112-tool=schools] .v50-box{box-shadow:0 28px 90px rgba(31,27,63,.12)!important}",
    ".v112-feature-shell{position:relative;max-width:1440px!important;margin:0 auto 22px!important;padding:0 18px 18px!important;border:1px solid rgba(23,25,31,.075)!important;border-radius:30px!important;background:rgba(255,255,255,.94)!important;box-shadow:0 24px 72px rgba(31,27,63,.09)!important;overflow:clip}.v112-feature-shell>.v111-live.v112-live{margin:0 -18px 16px!important;padding:18px 18px 13px!important;border:0!important;border-bottom:1px solid rgba(23,25,31,.065)!important;border-radius:30px 30px 0 0!important;background:linear-gradient(145deg,rgba(250,249,245,.98),rgba(246,243,255,.98))!important;box-shadow:none!important;overflow:visible!important}.v112-feature-shell>.v111-live.v112-live:before{display:none!important}.v112-feature-shell>.v111-live.v112-live .v111-top h2{font-size:clamp(23px,2.5vw,34px)!important}.v112-feature-shell>.v111-live.v112-live .v111-top p{font-size:8px!important}.v112-feature-shell .v112-showcase{display:none!important}.v112-feature-shell>.v111-live .v111-insights{margin-top:8px}.v112-feature-shell>.v111-live .v111-kpis{margin-top:9px}",
    "body.v51-workspace input:focus,body.v51-workspace textarea:focus,body.v51-workspace select:focus{border-color:#6d5dfc!important;box-shadow:0 0 0 3px rgba(109,93,252,.09)!important}body.v51-workspace button:focus-visible,body.v51-workspace a:focus-visible,body.v51-workspace input:focus-visible,body.v51-workspace textarea:focus-visible,body.v51-workspace select:focus-visible{outline:3px solid rgba(109,93,252,.28)!important;outline-offset:2px!important}",
    "html.v112-background body.v51-workspace *{animation-play-state:paused!important}@media(prefers-reduced-motion:reduce){.v112-bars i{animation:none!important}body.v51-workspace *{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important}}",
  ].join("");
  const style=document.createElement("style");style.id="scholark-v112-style";style.textContent=css;document.head.appendChild(style);

  function scrub(root=document){
    $(".v52-pill,.v107-pill,[data-ai-quality],[data-quality-badge],.ai-quality-max",root).forEach(el=>{
      const t=clean(el.textContent).toUpperCase().replace(/[·•]/g," ").replace(/\s+/g," ");
      if(t==="AI QUALITY MAX"||t==="QUALITY MAX"||t==="PRIORITY MAX")el.remove();
    });
  }
  function decorate(){
    const tool=route();scrub();
    $$(".v112-feature-shell").forEach(el=>el.classList.remove("v112-feature-shell"));
    if(!workspaceRoutes.has(tool)){document.body.removeAttribute("data-v112-tool");return}
    document.body.dataset.v112Tool=tool;
    const live=$("#v51-main .v111-live")||$(".v111-live");if(!live)return;
    const m=meta[tool]||meta.ai,root=live.parentElement;
    if(root)root.classList.add("v112-feature-shell");
    live.classList.add("v112-live");live.dataset.v112Tone=m[3];live.dataset.v112Tool=tool;
    const top=$(".v111-top",live),first=top?.firstElementChild;
    if(first&&!$(".v112-mark",first))first.insertAdjacentHTML("afterbegin",'<span class="v112-mark" aria-hidden="true">'+esc(m[0])+"</span>");
    $$(".v112-showcase",live).forEach(x=>x.remove());scrub(live);
    window.dispatchEvent(new CustomEvent("scholark-visual-ready",{detail:{release:"r176",tool,unified:true}}));
  }
  let raf=0,timer=0;
  const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(decorate)};
  const mo=new MutationObserver(m=>{if(!document.body.classList.contains("v51-workspace"))return;if(!m.some(x=>x.addedNodes.length||x.removedNodes.length))return;clearTimeout(timer);timer=setTimeout(schedule,120)});
  const observeRoot=$("#v51-main")||document.body;mo.observe(observeRoot,{subtree:true,childList:true});
  addEventListener("hashchange",()=>setTimeout(schedule,45));addEventListener("scholark-workspace-change",()=>setTimeout(schedule,35));addEventListener("scholark-runtime-ready",()=>setTimeout(schedule,40));addEventListener("scholark-country-change",()=>setTimeout(schedule,40));
  document.addEventListener("visibilitychange",()=>document.documentElement.classList.toggle("v112-background",document.hidden));
  setTimeout(schedule,30);setTimeout(schedule,220);
  window.__SCHOLARK_V112_VISUAL__={version:"20260921-r176",decorate,verify(){const tool=route(),w=workspaceRoutes.has(tool),live=$("#v51-main .v111-live")||$(".v111-live"),root=live?.parentElement,bad=$(".v52-pill,.v107-pill,[data-ai-quality],[data-quality-badge],.ai-quality-max").some(x=>/QUALITY\s*[·•]?\s*MAX/i.test(clean(x.textContent))),showcases=live?$(".v112-showcase",live).length:0,unified=!w||!!(live?.classList.contains("v112-live")&&root?.classList.contains("v112-feature-shell")&&showcases===0);return{ok:unified&&!bad,tool,workspace:w,unified,showcases,qualityBadge:bad}}};
})();