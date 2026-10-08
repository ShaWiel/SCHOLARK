(() => {
  if(window.__SCHOLARK_V93_LANGUAGE_LEARNER__)return;
  window.__SCHOLARK_V93_LANGUAGE_LEARNER__=true;

  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const STORE='scholark_v93_language_progress',HISTORY='scholark_v93_language_lessons';
  const REVIEW_EVERY=4,REVIEW_QUESTIONS=12,REVIEW_HISTORY_LIMIT=12;
  const cloud=()=>window.__SCHOLARK_V72_CLOUD__;
  let current=null,busy=false,buildEpoch=0;

  const css=document.createElement('style');css.id='scholark-v93-style';css.textContent=`
    .v93{max-width:1500px;margin:0 auto;padding:12px 30px 72px;box-sizing:border-box;font-family:Inter,system-ui;color:#17191f;background:radial-gradient(circle at 85% 2%,rgba(109,93,252,.11),transparent 28%),radial-gradient(circle at 9% 24%,rgba(201,255,106,.12),transparent 24%)}
    .v93-hero{display:grid;grid-template-columns:minmax(0,1.18fr) minmax(340px,.82fr);gap:18px;align-items:stretch}
    .v93-card,.v93-section{background:rgba(255,255,255,.94);border:1px solid rgba(23,25,31,.08);border-radius:26px;box-shadow:0 22px 70px rgba(31,27,63,.07);min-width:0}
    .v93-card{padding:24px}.v93-section{padding:22px}
    .v93-intro{background:linear-gradient(145deg,#151821 0%,#28224b 58%,#3b2e71 100%);color:#fff;position:relative;overflow:hidden;isolation:isolate;min-height:355px;display:flex;flex-direction:column;justify-content:space-between}
    .v93-intro:before,.v93-intro:after{content:'';position:absolute;border-radius:50%;z-index:-1;filter:blur(2px)}
    .v93-intro:before{width:340px;height:340px;background:rgba(201,255,106,.12);right:-110px;top:-145px}
    .v93-intro:after{width:250px;height:250px;background:rgba(109,93,252,.25);left:-95px;bottom:-135px}
    .v93-intro{background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(145deg,#151821 0%,#28224b 58%,#3b2e71 100%);background-size:34px 34px,34px 34px,auto}
    .v93-language-orb{position:absolute;right:22px;top:22px;width:128px;height:128px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.22),rgba(201,255,106,.13) 36%,rgba(109,93,252,.34) 100%);border:1px solid rgba(255,255,255,.14);box-shadow:0 22px 60px rgba(0,0,0,.22),inset 0 0 34px rgba(255,255,255,.05);backdrop-filter:blur(8px)}
    .v93-language-orb small{font:900 6px/1 Inter;letter-spacing:.16em;color:#bdb8c7}.v93-language-orb b{display:block;max-width:104px;margin:7px 0 5px;font:950 15px/1.05 Inter;color:#fff;overflow-wrap:anywhere}.v93-language-orb span{display:inline-flex;align-items:center;justify-content:center;min-width:35px;height:24px;padding:0 7px;border-radius:999px;background:#c9ff6a;color:#17191f;font:950 7px Inter}
    .v93-kicker{font:950 8px/1 Inter;letter-spacing:.16em;color:#6d5dfc}.v93-intro .v93-kicker{color:#c9ff6a}
    .v93 h1{font:950 clamp(42px,5.4vw,72px)/.91 Inter;margin:12px 0 14px;letter-spacing:-.062em;max-width:830px}.v93-intro p{max-width:760px;color:#d7d2df;font:650 11px/1.68 Inter;margin:0}
    .v93-flow{display:flex;gap:7px;flex-wrap:wrap;margin:22px 0 2px}.v93-flow span{display:inline-flex;align-items:center;gap:7px;padding:8px 10px;border:1px solid rgba(255,255,255,.1);border-radius:999px;background:rgba(255,255,255,.065);font:850 7px Inter;color:#eeeaf2}.v93-flow span b{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#c9ff6a;color:#17191f;font:950 7px Inter}
    .v93-skill-strip{display:flex;gap:7px;flex-wrap:wrap;margin-top:13px}.v93-skill-strip span{display:inline-flex;align-items:center;gap:6px;padding:7px 9px;border-radius:10px;background:rgba(0,0,0,.17);border:1px solid rgba(255,255,255,.07);font:750 6.8px Inter;color:#d8d4df}.v93-skill-strip span:before{content:'';width:6px;height:6px;border-radius:50%;background:#c9ff6a;box-shadow:0 0 0 3px rgba(201,255,106,.09)}
    .v93-progress-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:22px}.v93-stat{background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.08);border-radius:17px;padding:13px;backdrop-filter:blur(6px)}.v93-stat b{display:block;font:950 22px/1 Inter;color:#c9ff6a}.v93-stat span{display:block;margin-top:6px;font:700 7px/1.35 Inter;color:#c9c5d0}
    .v93-setup{position:relative;overflow:hidden}.v93-setup:before{content:'';position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,#6d5dfc,#c9ff6a)}
    .v93-setup-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin:4px 0 18px}.v93-setup-head h2{margin:4px 0 5px;font:950 25px/1 Inter;letter-spacing:-.04em}.v93-setup-head p{margin:0;font:650 8.5px/1.45 Inter;color:#77717e}.v93-setup-badge{border-radius:999px;background:#efedff;color:#594dcc;padding:8px 10px;font:900 7px Inter;white-space:nowrap}
    .v93-form{display:grid;gap:12px}.v93-form:before{content:'YOUR LESSON, YOUR PACE';font:950 6.5px Inter;letter-spacing:.14em;color:#9a94a0;margin-bottom:-3px}.v93-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v93-field{min-width:0}.v93-field label{display:flex;align-items:center;justify-content:space-between;font:900 7.5px/1 Inter;letter-spacing:.08em;color:#77717e;margin:0 0 7px}.v93 input,.v93 select,.v93 textarea{width:100%;min-width:0;box-sizing:border-box;border:1px solid rgba(23,25,31,.11);background:#f8f7f4;border-radius:14px;padding:12px 13px;font:750 9px/1.35 Inter;color:#17191f;outline:0;transition:.18s ease}.v93 select{min-height:46px}.v93 textarea{min-height:92px;resize:vertical}.v93 input:focus,.v93 select:focus,.v93 textarea:focus{border-color:#6d5dfc;background:#fff;box-shadow:0 0 0 4px rgba(109,93,252,.09)}
    .v93-intro-copy{padding-top:112px}
    .v93-language-row{position:relative;grid-template-columns:minmax(0,1fr) 44px minmax(0,1fr);align-items:end;gap:8px}.v93-swap{position:static;align-self:end;width:44px;height:46px;border-radius:14px;border:1px solid rgba(109,93,252,.16);background:linear-gradient(180deg,#fbfaff,#efedff);color:#594dcc;display:grid;place-items:center;cursor:pointer;font:950 15px Inter;box-shadow:0 8px 20px rgba(89,77,204,.10);transition:transform .16s ease,box-shadow .16s ease,background .16s ease}.v93-swap:hover{transform:translateY(-1px);background:#e9e5ff;box-shadow:0 11px 24px rgba(89,77,204,.14)}.v93-swap:focus-visible{outline:0;box-shadow:0 0 0 4px rgba(109,93,252,.13)}
    .v93-quick{padding:11px 12px;border-radius:15px;background:linear-gradient(135deg,#f6f4ff,#f6f7f0);border:1px solid rgba(109,93,252,.08)}.v93-quick>span{display:block;margin-bottom:8px;font:900 6.8px Inter;letter-spacing:.12em;color:#7c7585}.v93-quick-list{display:flex;gap:7px;flex-wrap:wrap}.v93-preset{border:1px solid rgba(23,25,31,.08);background:#fff;color:#4f4957;border-radius:999px;padding:8px 10px;font:850 7.2px Inter;cursor:pointer;transition:.15s ease}.v93-preset:hover{background:#17191f;color:#c9ff6a;border-color:#17191f;transform:translateY(-1px)}
    .v93-btn{border:0;border-radius:13px;background:#17191f;color:#fff;padding:12px 14px;font:900 8.5px Inter;cursor:pointer;transition:transform .16s ease,box-shadow .16s ease}.v93-btn:hover{transform:translateY(-1px)}.v93-btn.primary{min-height:48px;background:linear-gradient(135deg,#6d5dfc,#4a3ac8);box-shadow:0 12px 28px rgba(109,93,252,.22)}.v93-btn.lime{background:#c9ff6a;color:#17191f}.v93-btn.ghost{background:#efedff;color:#594dcc}.v93-btn:disabled{opacity:.5;cursor:wait;transform:none}
    .v93-status{min-height:17px;margin-top:2px;font:750 8px/1.4 Inter;color:#6257c6}.v93-results{display:grid;gap:14px;margin-top:18px}.v93-section{position:relative;overflow:hidden}.v93-section:before{content:'';position:absolute;left:0;top:22px;bottom:22px;width:3px;border-radius:99px;background:linear-gradient(#6d5dfc,#c9ff6a);opacity:.8}.v93-section h2,.v93-section h3{margin:0 0 10px;font:950 23px/1 Inter;letter-spacing:-.038em}.v93-section p{font:650 9.5px/1.65 Inter;color:#5f5a66}.v93-objectives{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;margin-top:14px}.v93-chip{padding:11px 12px;border-radius:13px;background:linear-gradient(135deg,#f2efff,#f8f7ff);border:1px solid rgba(109,93,252,.08);font:750 8px/1.45 Inter;color:#5148a9}
    .v93-vocab{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:10px}.v93-word{border:1px solid rgba(23,25,31,.075);border-radius:18px;padding:15px;background:linear-gradient(145deg,#fff,#f9f8f4);box-shadow:0 8px 24px rgba(31,27,63,.04);transition:.16s ease}.v93-word:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(31,27,63,.075)}.v93-word strong{display:block;font:950 18px/1.15 Inter}.v93-word .v93-native{display:block;margin-top:5px;font:800 9px Inter;color:#6558c8}.v93-word small{display:block;margin-top:6px;color:#7a7580;font:700 7.5px/1.4 Inter}.v93-word p{margin:9px 0 0}.v93-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.v93-mini{border:0;border-radius:10px;background:#17191f;color:#fff;padding:8px 10px;font:850 7px Inter;cursor:pointer}.v93-mini.alt{background:#eae7ff;color:#5448c5}
    .v93-grammar{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px}.v93-grammar-card{border:1px solid rgba(23,25,31,.06);border-radius:18px;background:#f6f4ef;padding:16px}.v93-grammar-card b{font:950 11px Inter}.v93-examples{margin:8px 0 0;padding-left:17px}.v93-examples li{font:700 8px/1.5 Inter;margin:4px 0}
    .v93-dialogue{display:grid;gap:8px}.v93-line{display:grid;grid-template-columns:86px minmax(0,1fr) auto;gap:11px;align-items:start;padding:12px 13px;border-radius:15px;background:#f7f6f3;border:1px solid rgba(23,25,31,.05)}.v93-line b{font:900 8px Inter;color:#6d5dfc}.v93-line strong{display:block;font:850 10px/1.45 Inter}.v93-line span{display:block;margin-top:4px;font:650 8px/1.4 Inter;color:#777}
    .v93-exercise{border-top:1px solid #ece9e4;padding:15px 0}.v93-exercise:first-child{border-top:0}.v93-exercise b{font:900 9px/1.45 Inter}.v93-choices{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.v93-choice{padding:8px 10px;border-radius:10px;background:#f0eff7;font:750 7.5px Inter}.v93-answer{display:none;margin-top:10px;padding:11px;border-radius:11px;background:#ecffe1;font:700 8px/1.5 Inter}.v93-answer.open{display:block}
    .v93-review-head{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:start}.v93-review-pill{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:#17191f;color:#c9ff6a;padding:9px 12px;font:900 7px Inter;white-space:nowrap}.v93-review-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.v93-review-meta span{border:1px solid rgba(109,93,252,.10);background:#f5f3ff;color:#594dcc;border-radius:999px;padding:7px 9px;font:850 7px Inter}.v93-review-question{padding:16px 0;border-top:1px solid #ece9e4}.v93-review-question:first-child{border-top:0}.v93-review-question>strong{display:block;font:900 9.5px/1.5 Inter}.v93-review-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.v93-review-choice{border:1px solid rgba(23,25,31,.09);background:#f7f6fb;color:#2c2935;border-radius:12px;padding:10px 11px;text-align:left;font:780 8px/1.4 Inter;cursor:pointer;transition:.15s ease}.v93-review-choice:hover:not(:disabled){transform:translateY(-1px);border-color:rgba(109,93,252,.28);background:#f0edff}.v93-review-choice:disabled{cursor:default}.v93-review-choice.correct{background:#e9ffd9;border-color:#73b743;color:#285c16}.v93-review-choice.incorrect{background:#fff0f0;border-color:#e57c7c;color:#9b3030}.v93-review-feedback{min-height:18px;margin-top:8px;font:800 8px/1.45 Inter;color:#6257c6}.v93-review-progress{height:7px;background:#eceaf0;border-radius:999px;overflow:hidden;margin-top:12px}.v93-review-progress>i{display:block;height:100%;width:0;background:linear-gradient(90deg,#6d5dfc,#c9ff6a);transition:width .2s ease}.v93-grade{margin-top:14px;padding:17px;border-radius:18px;background:linear-gradient(135deg,#17191f,#28224b);color:#fff;display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:center}.v93-grade b{font:950 30px/1 Inter;color:#c9ff6a}.v93-grade span{font:750 8px/1.55 Inter;color:#ddd7e6}
    .v93-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.v93-footer-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.v93-footer-actions .v93-btn{min-width:112px}.v93-history-wrap{margin-top:18px}.v93-history-head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:13px}.v93-history-head p{margin:0;max-width:560px}.v93-history{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:9px}.v93-history button{border:1px solid rgba(23,25,31,.07);background:linear-gradient(145deg,#fff,#f8f7f3);border-radius:16px;padding:13px;text-align:left;cursor:pointer;transition:.16s ease}.v93-history button:hover{transform:translateY(-2px);border-color:rgba(109,93,252,.2)}.v93-history b{display:block;font:900 9px Inter}.v93-history span{display:block;margin-top:5px;font:650 7.5px/1.45 Inter;color:#777}.v93-pronounce{margin-top:8px;font:750 8px/1.4 Inter;color:#5e52c1}
    @media(max-width:1050px){.v93{padding:26px 18px 60px}.v93-hero{grid-template-columns:1fr}.v93-row{grid-template-columns:1fr 1fr}.v93-intro{min-height:auto}.v93-intro-copy{padding-top:112px}}@media(max-width:620px){.v93{padding:24px 11px 50px}.v93-row,.v93-language-row{grid-template-columns:1fr}.v93-progress-grid{grid-template-columns:1fr 1fr}.v93-line{grid-template-columns:1fr}.v93-line .v93-mini{justify-self:start}.v93-language-row .v93-swap{margin:-2px auto 0;width:52px;height:38px}.v93-language-row .v93-swap:hover{transform:translateY(-1px)}.v93-language-orb{position:static;width:auto;height:auto;border-radius:16px;display:grid;grid-template-columns:auto 1fr auto;gap:8px;text-align:left;justify-content:stretch;margin:14px 0;padding:10px 12px}.v93-language-orb b{margin:0;max-width:none}.v93-intro-copy{padding-top:0}.v93 h1{font-size:42px;padding-right:0}.v93-review-head{grid-template-columns:1fr}.v93-review-options{grid-template-columns:1fr}.v93-grade{grid-template-columns:1fr}.v93-card,.v93-section{border-radius:21px;padding:18px}}
  `;document.head.appendChild(css);

  function langs(){return window.__SCHOLARK_I18N__?.langs||[['en','English'],['nl','Nederlands'],['es','Español'],['fr','Français']]}
  function langName(code){return window.__SCHOLARK_I18N__?.languageName?.(code)||langs().find(x=>x[0]===code)?.[1]||code}
  function uiCode(){return window.__SCHOLARK_I18N__?.code?.()||localStorage.getItem('scholark_ui_language')||'en'}
  function options(selected){return langs().map(([v,n])=>'<option value="'+esc(v)+'" '+(v===selected?'selected':'')+'>'+esc(n)+'</option>').join('')}
  function loadProgress(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}}
  function saveProgress(p){try{localStorage.setItem(STORE,JSON.stringify(p))}catch{}}
  function lessonHistory(){try{return JSON.parse(localStorage.getItem(HISTORY)||'[]')||[]}catch{return[]}}
  function saveHistory(row){let h=lessonHistory();h=[row,...h.filter(x=>x.id!==row.id)].slice(0,20);try{localStorage.setItem(HISTORY,JSON.stringify(h))}catch{}}

  async function ctx(){const c=cloud(),s=await c?.session?.();return c&&s?.user?.id?{c,s,uid:s.user.id}:null}
  function compactReviews(rows){
    const seen=new Set();
    return (Array.isArray(rows)?rows:[]).filter(x=>x&&typeof x==='object').sort((a,b)=>(Number(b.at)||0)-(Number(a.at)||0)).filter(x=>{const id=String(x.id||x.at||'');if(!id||seen.has(id))return false;seen.add(id);return true}).slice(0,REVIEW_HISTORY_LIMIT);
  }
  function compactTopics(rows){
    const seen=new Set();
    return (Array.isArray(rows)?rows:[]).filter(x=>x&&typeof x==='object').sort((a,b)=>(Number(b.at)||0)-(Number(a.at)||0)).filter(x=>{const k=clean(x.topic||x.title).toLowerCase();if(!k||seen.has(k))return false;seen.add(k);return true}).slice(0,10);
  }
  async function loadCloudProgress(code){
    try{
      const x=await ctx();if(!x)return;
      const r=await x.c.request('/rest/v1/language_learning_progress?select=language_code,level,xp,streak,lessons_completed,last_topic,data,updated_at&user_id=eq.'+encodeURIComponent(x.uid)+'&language_code=eq.'+encodeURIComponent(code)+'&limit=1',{method:'GET'});
      const d=await r.json().catch(()=>[]),row=Array.isArray(d)?d[0]:d;if(!r.ok||!row)return;
      const p=loadProgress(),local=p[code]||{},data=row.data&&typeof row.data==='object'?row.data:{},remoteAt=Date.parse(row.updated_at||'')||0,localAt=Number(local.updatedAt)||0,remoteIsNewer=remoteAt>=localAt;
      p[code]={
        ...local,
        xp:Math.max(Number(local.xp)||0,Number(row.xp)||0),
        streak:remoteIsNewer?(Number(row.streak)||0):(Number(local.streak)||0),
        lessons:Math.max(Number(local.lessons)||0,Number(row.lessons_completed)||0),
        level:remoteIsNewer?(row.level||local.level||'A1'):(local.level||row.level||'A1'),
        lastTopic:remoteIsNewer?(row.last_topic||local.lastTopic||''):(local.lastTopic||row.last_topic||''),
        lastDay:remoteIsNewer?(data.lastDay||local.lastDay||''):(local.lastDay||data.lastDay||''),
        attempts:Math.max(Number(local.attempts)||0,Number(data.attempts)||0),
        correct:Math.max(Number(local.correct)||0,Number(data.correct)||0),
        incorrect:Math.max(Number(local.incorrect)||0,Number(data.incorrect)||0),
        lastWeakTopic:(remoteIsNewer?data.lastWeakTopic:local.lastWeakTopic)||data.lastWeakTopic||local.lastWeakTopic||'',
        lastCompletedLesson:(remoteIsNewer?data.lastCompletedLesson:local.lastCompletedLesson)||data.lastCompletedLesson||local.lastCompletedLesson||'',
        lastReviewLessonCount:Math.max(Number(local.lastReviewLessonCount)||0,Number(data.lastReviewLessonCount)||0),
        reviewsCompleted:Math.max(Number(local.reviewsCompleted)||0,Number(data.reviewsCompleted)||0),
        lastReviewScore:remoteIsNewer?(Number(data.lastReviewScore)||0):(Number(local.lastReviewScore)||0),
        lastReviewPercent:remoteIsNewer?(Number(data.lastReviewPercent)||0):(Number(local.lastReviewPercent)||0),
        reviews:compactReviews([...(Array.isArray(local.reviews)?local.reviews:[]),...(Array.isArray(data.reviews)?data.reviews:[])]),
        recentTopics:compactTopics([...(Array.isArray(local.recentTopics)?local.recentTopics:[]),...(Array.isArray(data.recentTopics)?data.recentTopics:[])]),
        updatedAt:Math.max(localAt,remoteAt)
      };
      saveProgress(p);renderStats(code);
    }catch{}
  }
  async function pushCloudProgress(code){
    try{
      const x=await ctx();if(!x)return;const all=loadProgress(),p=all[code]||{},now=Date.now();p.updatedAt=now;all[code]=p;saveProgress(all);
      await x.c.request('/rest/v1/language_learning_progress?on_conflict=user_id,language_code',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({
        user_id:x.uid,language_code:code,level:p.level||'A1',xp:Number(p.xp)||0,streak:Number(p.streak)||0,lessons_completed:Number(p.lessons)||0,last_topic:p.lastTopic||null,
        data:{schema:2,lastDay:p.lastDay||'',attempts:Number(p.attempts)||0,correct:Number(p.correct)||0,incorrect:Number(p.incorrect)||0,lastWeakTopic:p.lastWeakTopic||'',lastCompletedLesson:p.lastCompletedLesson||'',lastReviewLessonCount:Number(p.lastReviewLessonCount)||0,reviewsCompleted:Number(p.reviewsCompleted)||0,lastReviewScore:Number(p.lastReviewScore)||0,lastReviewPercent:Number(p.lastReviewPercent)||0,reviews:compactReviews(p.reviews),recentTopics:compactTopics(p.recentTopics)},
        updated_at:new Date(now).toISOString()
      })});
    }catch{}
  }

  function dayKey(d=new Date()){return d.toISOString().slice(0,10)}
  function daysBetween(a,b){if(!a||!b)return 99;return Math.round((new Date(b+'T00:00:00Z')-new Date(a+'T00:00:00Z'))/86400000)}
  function normalizedAnswer(v){return clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
  function stableScore(v){let h=2166136261;for(const ch of String(v||'')){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}return h>>>0}
  function stableOrder(rows,seed){return [...rows].map((x,i)=>({x,i,n:stableScore(seed+'|'+i+'|'+JSON.stringify(x))})).sort((a,b)=>a.n-b.n||a.i-b.i).map(v=>v.x)}
  function reviewDue(code){const p=loadProgress()[code]||{},done=Number(p.lessons)||0,last=Number(p.lastReviewLessonCount)||0;return done>=REVIEW_EVERY&&done-last>=REVIEW_EVERY}
  function reviewSources(code){return lessonHistory().filter(x=>x&&x.targetCode===code&&x.kind!=='review'&&x.result).sort((a,b)=>(Number(b.completedAt)||Number(b.at)||0)-(Number(a.completedAt)||Number(a.at)||0)).slice(0,6)}
  function makeReview(source){
    const code=source.targetCode,rows=reviewSources(code),pairs=[],pairSeen=new Set(),questions=[],promptSeen=new Set();
    for(const row of rows){
      for(const v of (row.result?.vocabulary||[])){
        const term=clean(v?.term),translation=clean(v?.translation),k=normalizedAnswer(term)+'|'+normalizedAnswer(translation);
        if(term&&translation&&!pairSeen.has(k)){pairSeen.add(k);pairs.push({term,translation,topic:row.topic||row.result?.title||''})}
      }
    }
    const add=q=>{const k=normalizedAnswer(q.prompt);if(!k||promptSeen.has(k)||!Array.isArray(q.choices)||q.choices.length<3)return;const unique=[];const seen=new Set();for(const choice of q.choices){const ck=normalizedAnswer(choice);if(ck&&!seen.has(ck)){seen.add(ck);unique.push(clean(choice))}}if(unique.length<3||!unique.some(x=>normalizedAnswer(x)===normalizedAnswer(q.answer)))return;promptSeen.add(k);questions.push({...q,choices:stableOrder(unique,'choices-'+k)})};
    for(const row of rows){
      for(const ex of (row.result?.exercises||[])){
        if(questions.length>=5)break;
        if(Array.isArray(ex?.choices)&&ex.choices.length>=3)add({prompt:clean(ex.prompt),choices:ex.choices,answer:clean(ex.answer),explanation:clean(ex.explanation)||'Review the rule or phrase from the earlier lesson.',topic:row.topic||''});
      }
      if(questions.length>=5)break;
    }
    const translationPool=[...new Set(pairs.map(x=>x.translation).filter(Boolean))],termPool=[...new Set(pairs.map(x=>x.term).filter(Boolean))];
    for(const pair of stableOrder(pairs,'review-'+code+'-'+String(Number(loadProgress()[code]?.lessons)||0))){
      if(questions.length>=REVIEW_QUESTIONS)break;
      const d=stableOrder(translationPool.filter(x=>normalizedAnswer(x)!==normalizedAnswer(pair.translation)),'to-native-'+pair.term).slice(0,3);
      if(d.length===3)add({prompt:'Choose the best meaning of “'+pair.term+'”.',choices:[pair.translation,...d],answer:pair.translation,explanation:'This checks whether you can recall the meaning without seeing the original lesson.',topic:pair.topic});
      if(questions.length>=REVIEW_QUESTIONS)break;
      const r=stableOrder(termPool.filter(x=>normalizedAnswer(x)!==normalizedAnswer(pair.term)),'to-target-'+pair.translation).slice(0,3);
      if(r.length===3)add({prompt:'Which '+langName(code)+' word or phrase best matches “'+pair.translation+'”?',choices:[pair.term,...r],answer:pair.term,explanation:'This reverse-recall question is deliberately harder than recognition alone.',topic:pair.topic});
    }
    if(questions.length<8)return null;
    const selected=stableOrder(questions,'review-final-'+code+'-'+String(Number(loadProgress()[code]?.lessons)||0)).slice(0,REVIEW_QUESTIONS).map((q,i)=>({...q,id:'rq-'+String(i+1)}));
    const p=loadProgress()[code]||{},reviewNumber=(Number(p.reviewsCompleted)||0)+1,nextStep=clean(source.result?.nextStep)||'Continue with the next practical lesson';
    return {id:'review-'+Date.now().toString(36),kind:'review',targetCode:source.targetCode,supportCode:source.supportCode,level:source.level,goal:source.goal,topic:'Spaced repetition checkpoint',at:Date.now(),sourceLessonIds:rows.map(x=>x.id).slice(0,6),reviewAnswers:{},result:{title:'Review checkpoint '+reviewNumber,overview:'A cumulative review of your recent lessons. The questions mix recognition, reverse recall and earlier lesson exercises, so guessing alone should not be enough.',objectives:['Recall recent vocabulary without prompts','Apply earlier lesson knowledge under mixed conditions','Identify what needs another pass before moving on'],exercises:selected,nextStep}};
  }
  function reviewResultCopy(percent){return percent>=90?'Excellent retention. You are ready to move forward with a higher challenge.':percent>=75?'Strong result. Continue, while keeping the missed items in your next practice cycle.':percent>=55?'Pass. SCHOLARK will keep the weaker material active in upcoming lessons.':'This checkpoint exposed gaps. Your next lessons will reinforce these areas before difficulty increases.'}
  function isCompleted(row=current){
    if(!row)return false;
    if(row.kind==='review')return !!row.reviewResult;
    return !!row.completedAt||loadProgress()[row.targetCode]?.lastCompletedLesson===row.id;
  }
  function complete(){
    if(!current||current.kind==='review')return;
    const code=current.targetCode,p=loadProgress(),x=p[code]||{xp:0,streak:0,lessons:0,level:current.level||'A1'},today=dayKey(),gap=daysBetween(x.lastDay,today);
    if(isCompleted(current)){const b=$('#v93-complete');if(b){b.disabled=true;b.textContent='✓ Lesson complete'}return}
    x.xp=(Number(x.xp)||0)+100;x.lessons=(Number(x.lessons)||0)+1;x.streak=x.lastDay===today?(Number(x.streak)||1):gap===1?(Number(x.streak)||0)+1:1;x.lastDay=today;x.lastTopic=current.topic||'';x.level=current.level||x.level||'A1';x.lastCompletedLesson=current.id;x.recentTopics=compactTopics([{id:current.id,topic:current.topic||'',title:current.result?.title||'',level:current.level||'',at:Date.now()},...(Array.isArray(x.recentTopics)?x.recentTopics:[])]);x.updatedAt=Date.now();p[code]=x;current.completedAt=Date.now();saveHistory(current);saveProgress(p);renderStats(code);pushCloudProgress(code);
    const due=reviewDue(code),st=$('#v93-status');if(st)st.textContent=due?'Lesson complete · +100 XP. Review checkpoint unlocked.':'Lesson complete · +100 XP. Your progress has been saved.';const b=$('#v93-complete');if(b){b.disabled=true;b.textContent='✓ Lesson complete'}const n=$('#v93-next');if(n&&due)n.textContent='Start review';
  }
  function renderReview(row){
    current=row;const r=row.result||{},out=$('#v93-results');if(!out)return;const qs=Array.isArray(r.exercises)?r.exercises:[],saved=row.reviewResult,answered=Object.keys(row.reviewAnswers||{}).length,percent=qs.length?Math.round(answered/qs.length*100):0;
    out.innerHTML='<section class="v93-section"><div class="v93-review-head"><div><div class="v93-kicker">SPACED REPETITION · '+esc(row.level||'A1')+'</div><h2>'+esc(r.title||'Review checkpoint')+'</h2><p>'+esc(r.overview||'')+'</p><div class="v93-review-meta"><span>Every '+REVIEW_EVERY+' lessons</span><span>'+qs.length+' questions</span><span>Saved to your progress</span></div></div><span class="v93-review-pill">'+(saved?'COMPLETED':'CHECKPOINT')+'</span></div><div class="v93-review-progress"><i id="v93-review-bar" style="width:'+(saved?100:percent)+'%"></i></div></section>'+
      '<section class="v93-section"><h3>Review questions</h3><div>'+qs.map((q,i)=>'<div class="v93-review-question" data-v93-review-q="'+i+'"><strong>'+(i+1)+'. '+esc(q.prompt||'')+'</strong><div class="v93-review-options">'+(q.choices||[]).map((choice,j)=>'<button type="button" class="v93-review-choice" data-v93-review-choice="'+i+':'+j+'" '+(saved?'disabled':'')+'>'+esc(choice)+'</button>').join('')+'</div><div class="v93-review-feedback" data-v93-review-feedback="'+i+'"></div></div>').join('')+'</div><div id="v93-review-grade">'+(saved?'<div class="v93-grade"><b>'+Number(saved.grade||0).toFixed(1)+'/10</b><span>'+Number(saved.percent||0)+'% · '+esc(reviewResultCopy(Number(saved.percent)||0))+'</span></div>':'')+'</div></section>'+
      '<section class="v93-section"><div class="v93-footer"><span class="v93-kicker" id="v93-review-count">'+(saved?qs.length:answered)+' / '+qs.length+' answered</span><div class="v93-footer-actions"><button class="v93-btn lime" id="v93-review-submit" '+((!saved&&answered===qs.length)?'':'disabled')+'>'+(saved?'Review saved':'Finish review')+'</button><button class="v93-btn ghost" id="v93-next" '+(saved?'':'disabled')+'>Continue to next lesson</button></div></div></section>';
    if(saved){
      qs.forEach((q,i)=>{const root=$('[data-v93-review-q="'+i+'"]',out);root?.querySelectorAll('.v93-review-choice').forEach((b,j)=>{if(normalizedAnswer(q.choices?.[j])===normalizedAnswer(q.answer))b.classList.add('correct')})});
    }else{
      $$('[data-v93-review-choice]',out).forEach(b=>b.onclick=()=>{const [qi,ci]=String(b.dataset.v93ReviewChoice||'').split(':').map(Number);answerReview(qi,ci,b)});
      const submit=$('#v93-review-submit',out);if(submit)submit.onclick=finishReview;
    }
    const next=$('#v93-next',out);if(next)next.onclick=nextLesson;
    out.scrollIntoView({behavior:'smooth',block:'start'});window.__SCHOLARK_I18N__?.apply?.(out);
    window.dispatchEvent(new CustomEvent('scholark-language-review-rendered',{detail:{id:row.id,targetCode:row.targetCode,questions:qs.length,completed:!!saved}}));
  }
  function answerReview(questionIndex,choiceIndex,button){
    if(!current||current.kind!=='review'||current.reviewResult)return;const q=current.result?.exercises?.[questionIndex];if(!q)return;current.reviewAnswers=current.reviewAnswers||{};if(current.reviewAnswers[questionIndex])return;
    const choice=clean(q.choices?.[choiceIndex]),right=normalizedAnswer(choice)===normalizedAnswer(q.answer),root=button?.closest?.('[data-v93-review-q]'),feedback=root?.querySelector?.('[data-v93-review-feedback]');
    current.reviewAnswers[questionIndex]={choiceIndex,choice,correct:right,at:Date.now()};
    root?.querySelectorAll('.v93-review-choice').forEach((b,j)=>{b.disabled=true;if(normalizedAnswer(q.choices?.[j])===normalizedAnswer(q.answer))b.classList.add('correct');else if(j===choiceIndex)b.classList.add('incorrect')});
    if(feedback)feedback.textContent=right?'Correct · '+clean(q.explanation||''):'Not correct. The right answer is “'+clean(q.answer)+'”. '+clean(q.explanation||'');
    const total=current.result.exercises.length,done=Object.keys(current.reviewAnswers).length,bar=$('#v93-review-bar'),count=$('#v93-review-count'),submit=$('#v93-review-submit');if(bar)bar.style.width=Math.round(done/total*100)+'%';if(count)count.textContent=done+' / '+total+' answered';if(submit)submit.disabled=done!==total;
    saveHistory(current);window.dispatchEvent(new CustomEvent('scholark:language-choice',{detail:{correct:right,choice,answer:q.answer,review:true,questionIndex,at:Date.now()}}));
  }
  function finishReview(){
    if(!current||current.kind!=='review'||current.reviewResult)return;const qs=current.result?.exercises||[],answers=current.reviewAnswers||{},total=qs.length,done=Object.keys(answers).length;if(!total||done<total)return;
    const correct=Object.values(answers).filter(x=>x?.correct).length,percent=Math.round(correct/total*100),grade=Math.round((correct/total*10)*10)/10,result={id:current.id,score:correct,total,percent,grade,at:Date.now(),sourceLessonIds:current.sourceLessonIds||[]};
    const missedTopics=[...new Set(Object.entries(answers).filter(([,a])=>!a?.correct).map(([i])=>clean(qs[Number(i)]?.topic)).filter(Boolean))],code=current.targetCode,p=loadProgress(),x=p[code]||{level:current.level||'A1'};x.reviews=compactReviews([result,...(Array.isArray(x.reviews)?x.reviews:[])]);x.reviewsCompleted=(Number(x.reviewsCompleted)||0)+1;x.lastReviewLessonCount=Number(x.lessons)||0;x.lastReviewScore=grade;x.lastReviewPercent=percent;x.updatedAt=Date.now();if(missedTopics.length)x.lastWeakTopic=missedTopics[0];p[code]=x;current.reviewResult=result;current.completedAt=result.at;saveProgress(p);saveHistory(current);renderStats(code);pushCloudProgress(code);
    const gradeHost=$('#v93-review-grade');if(gradeHost)gradeHost.innerHTML='<div class="v93-grade"><b>'+grade.toFixed(1)+'/10</b><span>'+percent+'% · '+esc(reviewResultCopy(percent))+'</span></div>';const submit=$('#v93-review-submit');if(submit){submit.disabled=true;submit.textContent='Review saved'}const next=$('#v93-next');if(next)next.disabled=false;const count=$('#v93-review-count');if(count)count.textContent=total+' / '+total+' answered · grade '+grade.toFixed(1)+'/10';const st=$('#v93-status');if(st)st.textContent='Review completed and saved · '+grade.toFixed(1)+'/10 ('+percent+'%).';
    window.dispatchEvent(new CustomEvent('scholark-language-review-completed',{detail:result}));
  }
  async function nextLesson(){
    if(busy||!current)return null;
    const source=current,status=$('#v93-status');
    if(source.kind==='review'&&!isCompleted(source)){if(status)status.textContent='Finish the review first so SCHOLARK can save your grade and adapt the next lesson.';return null}
    if(source.kind!=='review'&&!isCompleted(source))complete();
    if(source.kind!=='review'&&reviewDue(source.targetCode)){
      const review=makeReview(source);
      if(review){current=review;saveHistory(review);renderReview(review);if(status)status.textContent='Review checkpoint ready. Complete it before the next lesson.';return review}
    }
    const next=clean(source.result?.nextStep)||'Continue with the next practical lesson',target=$('#v93-target'),support=$('#v93-support'),level=$('#v93-level'),goal=$('#v93-goal'),topic=$('#v93-topic'),button=$('#v93-next');
    if(target&&[...target.options].some(o=>o.value===source.targetCode))target.value=source.targetCode;if(support&&[...support.options].some(o=>o.value===source.supportCode))support.value=source.supportCode;if(level&&[...level.options].some(o=>o.value===source.level))level.value=source.level;if(goal&&[...goal.options].some(o=>o.value===source.goal))goal.value=source.goal;if(topic){topic.value=next;topic.dispatchEvent(new Event('input',{bubbles:true}))}
    if(button){button.disabled=true;button.textContent='Building next lesson…'}if(status)status.textContent='Preparing a deeper next lesson from your progress…';
    const built=await buildLesson({continuation:true,source});if(button?.isConnected){button.disabled=false;button.textContent='Next lesson'}return built;
  }

  function renderStats(code){
    const p=loadProgress()[code]||{},host=$('#v93-stats');if(!host)return;
    const attempts=Number(p.attempts)||0,accuracy=attempts?Math.round((Number(p.correct)||0)/attempts*100):0;
    host.innerHTML='<div class="v93-stat"><b>'+(Number(p.lessons)||0)+'</b><span>Lessons completed</span></div><div class="v93-stat"><b>'+(Number(p.streak)||0)+'</b><span>Current streak</span></div><div class="v93-stat"><b>'+(Number(p.xp)||0)+'</b><span>XP</span></div><div class="v93-stat"><b>'+(attempts?accuracy+'%':'—')+'</b><span>Exercise accuracy</span></div>';
    window.__SCHOLARK_I18N__?.apply?.(host);
  }
  function syncHeroLanguage(){
    const target=$('#v93-target'),level=$('#v93-level'),name=$('#v93-hero-language'),badge=$('#v93-hero-level');
    if(name&&target)name.textContent=langName(target.value);
    if(badge&&level)badge.textContent=level.value||'A1';
  }

  function shell(){
    document.body.classList.add('v51-workspace');document.body.classList.remove('v51-native','v51-studio','v51-pro','v51-schools','v51-study','v51-book','v41-studio-open');
    $$('#v51-sidebar [data-v51-tool]').forEach(b=>b.classList.toggle('active',b.dataset.v51Tool==='language'));
    history.replaceState(null,'',location.pathname+location.search+'#language');
    const main=$('#v51-main');if(!main)return null;main.style.setProperty('display','block','important');$$('.v51-page',main).forEach(p=>{p.classList.remove('active');p.style.display='none'});
    let page=$('[data-v51-page="fallback"]',main);if(!page){page=document.createElement('section');page.className='v51-page';page.dataset.v51Page='fallback';main.appendChild(page)}page.classList.add('active');page.style.display='block';page.style.padding='0';
    let host=$('#v51-fallback',page);if(!host){host=document.createElement('div');host.id='v51-fallback';page.appendChild(host)}return host;
  }

  function open(force=false){
    const host=shell();if(!host)return;
    if(!force&&location.hash.toLowerCase()==='#language'&&$('.v93',host)){
      window.dispatchEvent(new CustomEvent('scholark-tool-mounted',{detail:{tool:'language',source:'v93',reused:true}}));
      return
    }
    const support=uiCode(),p=loadProgress(),lastTarget=localStorage.getItem('scholark_v93_target')||'es',level=p[lastTarget]?.level||'A1';
    host.innerHTML='<div class="v93"><div class="v93-hero"><section class="v93-card v93-intro"><div class="v93-language-orb" aria-live="polite"><small>NOW LEARNING</small><b id="v93-hero-language">'+esc(langName(lastTarget))+'</b><span id="v93-hero-level">'+esc(level)+'</span></div><div class="v93-intro-copy"><div class="v93-kicker">SCHOLARK · LANGUAGE LEARNER</div><h1>Speak more. Understand more.</h1><p>Build adaptive lessons around real situations. Learn the words, hear the language, understand the grammar, practise speaking and keep moving at your own level.</p><div class="v93-skill-strip"><span>Listening</span><span>Speaking</span><span>Vocabulary</span><span>Grammar</span></div><div class="v93-flow"><span><b>1</b>Choose</span><span><b>2</b>Learn</span><span><b>3</b>Practise</span><span><b>4</b>Progress</span></div></div><div class="v93-progress-grid" id="v93-stats"></div></section><section class="v93-card v93-setup"><div class="v93-setup-head"><div><div class="v93-kicker">BUILD YOUR NEXT LESSON</div><h2>What do you want to practise?</h2><p>Choose your languages, level and goal. SCHOLARK builds the lesson around you.</p></div><span class="v93-setup-badge">ADAPTIVE</span></div><div class="v93-form"><div class="v93-row v93-language-row"><div class="v93-field"><label>Target language</label><select id="v93-target">'+options(lastTarget)+'</select></div><button class="v93-swap" id="v93-swap" type="button" aria-label="Swap target and support languages" title="Swap languages">⇄</button><div class="v93-field"><label>Support language</label><select id="v93-support">'+options(support)+'</select></div></div><div class="v93-row"><div class="v93-field"><label>Current level</label><select id="v93-level"><option value="A0">A0 · Beginner from zero</option><option value="A1">A1 · Beginner</option><option value="A2">A2 · Elementary</option><option value="B1">B1 · Intermediate</option><option value="B2">B2 · Upper intermediate</option><option value="C1">C1 · Advanced</option><option value="C2">C2 · Near-native</option></select></div><div class="v93-field"><label>Learning goal</label><select id="v93-goal"><option>Conversation</option><option>Travel</option><option>School</option><option>Work</option><option>Grammar</option><option>Vocabulary</option><option>Pronunciation</option><option>Exam preparation</option></select></div></div><div class="v93-quick"><span>QUICK LESSON IDEAS</span><div class="v93-quick-list"><button type="button" class="v93-preset" data-v93-preset="Introducing myself">Introductions</button><button type="button" class="v93-preset" data-v93-preset="Ordering food at a restaurant">Food & dining</button><button type="button" class="v93-preset" data-v93-preset="Travel, directions and getting around">Travel</button><button type="button" class="v93-preset" data-v93-preset="School and classroom vocabulary">School</button><button type="button" class="v93-preset" data-v93-preset="Job interview and workplace conversation">Work</button></div></div><div class="v93-field"><label>Topic or situation</label><textarea id="v93-topic" placeholder="Example: ordering food, introducing myself, school vocabulary, job interview, past tense…"></textarea></div><button class="v93-btn primary" id="v93-build">Build my lesson →</button><div class="v93-status" id="v93-status"></div></div></section></div><div class="v93-results" id="v93-results"></div><section class="v93-section v93-history-wrap"><div class="v93-history-head"><div><div class="v93-kicker">CONTINUE LEARNING</div><h3>Recent language lessons</h3></div><p>Open a previous lesson and continue practising without starting over.</p></div><div class="v93-history" id="v93-history"></div></section></div>';
    const ls=$('#v93-level');if(ls&&[...ls.options].some(o=>o.value===level))ls.value=level;
    $('#v93-target').onchange=()=>{const code=$('#v93-target').value;localStorage.setItem('scholark_v93_target',code);syncHeroLanguage();renderStats(code);loadCloudProgress(code)};
    $('#v93-level').onchange=syncHeroLanguage;
    $$('[data-v93-preset]').forEach(b=>b.onclick=()=>{const topic=$('#v93-topic');if(!topic)return;topic.value=b.dataset.v93Preset||'';topic.focus();topic.dispatchEvent(new Event('input',{bubbles:true}))});
    $('#v93-swap').onclick=()=>{const target=$('#v93-target'),supportSel=$('#v93-support'),a=target.value,b=supportSel.value;if([...target.options].some(o=>o.value===b)&&[...supportSel.options].some(o=>o.value===a)){target.value=b;supportSel.value=a;target.dispatchEvent(new Event('change',{bubbles:true}))}};
    $('#v93-build').onclick=buildLesson;syncHeroLanguage();renderStats(lastTarget);loadCloudProgress(lastTarget);renderHistory();
    window.__SCHOLARK_I18N__?.apply?.(host);setTimeout(()=>window.__SCHOLARK_I18N__?.translateMissing?.(),60);
    window.dispatchEvent(new CustomEvent('scholark-tool-mounted',{detail:{tool:'language',source:'v93'}}));
  }

  async function call(payload){
    const request=window.__SCHOLARK_WORKSPACE_CORE__?.ai?.request;
    if(!request)throw new Error('SCHOLARK AI foundation is not ready yet.');
    return request('language_learning',payload,{timeoutMs:70000});
  }

  async function buildLesson(options={}){
    if(busy)return null;const target=$('#v93-target'),support=$('#v93-support'),levelSel=$('#v93-level'),goalSel=$('#v93-goal'),topicInput=$('#v93-topic');if(!target||!support||!levelSel||!goalSel||!topicInput)return null;
    const targetCode=target.value,supportCode=support.value,level=levelSel.value||'A1',goal=goalSel.value||'Conversation',topic=clean(topicInput.value)||'practical everyday conversation',btn=$('#v93-build'),st=$('#v93-status'),epoch=++buildEpoch;busy=true;if(btn)btn.disabled=true;if(st)st.textContent='Building a complete '+langName(targetCode)+' lesson at '+level+' level…';
    try{
      const prior=loadProgress()[targetCode]||{},attempts=Number(prior.attempts)||0,accuracy=attempts?Math.round((Number(prior.correct)||0)/attempts*100):null,recent=compactTopics(prior.recentTopics).slice(0,5),source=options?.continuation===true?options.source:null;
      const adaptive=accuracy==null?'This is the learner’s first measured practice.':accuracy<65?'Recent exercise accuracy is '+accuracy+'%. Reinforce weak points with guided examples, then test them again without hints.':accuracy>=85?'Recent exercise accuracy is '+accuracy+'%. Increase challenge, reduce scaffolding and require more independent production.':'Recent exercise accuracy is '+accuracy+'%. Keep the level steady while mixing recall and application.';
      const continuity=source?'This is a direct continuation after “'+clean(source.result?.title||source.topic||'the previous lesson')+'”. The prior next-step recommendation was “'+clean(source.result?.nextStep||topic)+'”. Do not simply repeat the previous lesson; build on it, recycle a few important items through spaced recall, then introduce the next layer of skill.':'Build the lesson as a self-contained starting point for this topic.';
      const recentContext=recent.length?'Recent completed topics: '+recent.map(x=>clean(x.title||x.topic)).filter(Boolean).join(' | ')+'. Avoid unnecessary duplication and connect the new material to this history.':'';
      const reviewContext=Number.isFinite(Number(prior.lastReviewPercent))&&Number(prior.reviewsCompleted)>0?'Most recent review score: '+Number(prior.lastReviewPercent)+'%. '+(Number(prior.lastReviewPercent)<75?'Prioritize retrieval practice and the weaker material before adding too much new content.':'The learner retained the material well, so increase complexity slightly.'):'';
      const depth='Make this lesson substantive but quick to generate: aim for 6–10 useful vocabulary items or phrases, 2–3 clear grammar points where relevant, a realistic concise dialogue, and 6–8 varied exercises across recall, translation, fill-in and application. Keep difficulty appropriate to '+level+' and avoid unnecessary repetition.';
      const data=await call({targetLanguage:langName(targetCode),targetLanguageCode:targetCode,nativeLanguage:langName(supportCode),supportLanguageCode:supportCode,language:langName(supportCode),proficiency:level,learningGoal:goal,prompt:'Teach this topic or situation: '+topic+'. Include practical phrases, pronunciation, grammar, a realistic dialogue and exercises. '+adaptive+' '+continuity+' '+recentContext+' '+reviewContext+' '+depth,level:localStorage.getItem('scholark_learning_level')||'student'});
      if(epoch!==buildEpoch)return null;const result=data?.result;if(!result||!Array.isArray(result.exercises)||!result.exercises.length)throw new Error('SCHOLARK could not build a complete lesson. Please try again.');
      current={id:'lang-'+Date.now().toString(36),kind:'lesson',targetCode,supportCode,level,goal,topic,result,provider:data.provider||'',model:data.model||'',at:Date.now(),sequence:(Number(prior.lessons)||0)+1};saveHistory(current);renderLesson(current);renderHistory();localStorage.setItem('scholark_v93_target',targetCode);const p=loadProgress();p[targetCode]={...(p[targetCode]||{}),level,lastTopic:topic,updatedAt:Date.now()};saveProgress(p);renderStats(targetCode);pushCloudProgress(targetCode);if(st)st.textContent='Lesson ready. Work through it, mark it complete, then SCHOLARK will build the next step from your progress.';return current;
    }catch(e){if(st)st.textContent=clean(e?.message||e);return null}finally{busy=false;if(btn)btn.disabled=false}
  }

  function ai(s){return '<span class="v93-ai">'+esc(s||'')+'</span>'}
  function list(items){return (items||[]).map(x=>'<div class="v93-chip">'+ai(x)+'</div>').join('')}
  function renderLesson(row){
    if(row?.kind==='review'){renderReview(row);return}
    current=row;const r=row.result||{},out=$('#v93-results');if(!out)return;
    out.innerHTML='<section class="v93-section"><div class="v93-kicker">ADAPTIVE LESSON · '+esc(row.level||'A1')+'</div><h2>'+ai(r.title||'Language lesson')+'</h2><p>'+ai(r.overview||'')+'</p><div class="v93-objectives">'+list(r.objectives)+'</div></section>'+
      '<section class="v93-section"><h3>Vocabulary & phrases</h3><div class="v93-vocab">'+(r.vocabulary||[]).map((v,i)=>'<article class="v93-word"><strong class="v93-ai v93-target">'+esc(v.term||'')+'</strong><span class="v93-ai v93-native">'+esc(v.translation||'')+'</span><small class="v93-ai">Pronunciation: '+esc(v.pronunciation||'')+'</small><p><span class="v93-ai v93-target">'+esc(v.example||'')+'</span><br><span class="v93-ai v93-native">'+esc(v.exampleTranslation||'')+'</span></p><div class="v93-actions"><button class="v93-mini" data-v93-listen="'+i+'">Listen</button><button class="v93-mini alt" data-v93-practice="'+i+'">Practice speaking</button></div><div class="v93-pronounce" data-v93-feedback="'+i+'"></div></article>').join('')+'</div></section>'+
      '<section class="v93-section"><h3>Grammar made clear</h3><div class="v93-grammar">'+(r.grammar||[]).map(g=>'<article class="v93-grammar-card"><b>'+ai(g.point||'')+'</b><p>'+ai(g.explanation||'')+'</p><ul class="v93-examples">'+(g.examples||[]).map(x=>'<li>'+ai(x)+'</li>').join('')+'</ul></article>').join('')+'</div></section>'+
      '<section class="v93-section"><h3>Practice dialogue</h3><div class="v93-dialogue">'+(r.dialogue||[]).map((d,i)=>'<div class="v93-line"><b>'+ai(d.speaker||('Speaker '+(i+1)))+'</b><div><strong class="v93-ai v93-target">'+esc(d.target||'')+'</strong><span class="v93-ai v93-native">'+esc(d.native||'')+'</span></div><button class="v93-mini" data-v93-dialogue="'+i+'">Listen</button></div>').join('')+'</div></section>'+
      '<section class="v93-section"><h3>Exercises</h3><div>'+(r.exercises||[]).map((e,i)=>'<div class="v93-exercise"><b>'+String(i+1)+'. '+ai(e.prompt||'')+'</b>'+(e.choices?.length?'<div class="v93-choices">'+e.choices.map(x=>'<span class="v93-choice">'+ai(x)+'</span>').join('')+'</div>':'')+'<div class="v93-actions"><button class="v93-mini alt" data-v93-answer="'+i+'">Show answer</button></div><div class="v93-answer" data-v93-answer-box="'+i+'"><b>Answer:</b> '+ai(e.answer||'')+'<br><b>Why:</b> '+ai(e.explanation||'')+'</div></div>').join('')+'</div></section>'+
      '<section class="v93-section"><div class="v93-row"><div><h3>Culture tip</h3><p>'+ai(r.cultureTip||'')+'</p></div><div><h3>Next lesson</h3><p>'+ai(r.nextStep||'')+'</p></div></div><div class="v93-footer"><span class="v93-kicker">'+esc(row.provider||'AI')+' · '+esc(row.model||'')+'</span><div class="v93-footer-actions"><button class="v93-btn lime" id="v93-complete">Lesson complete</button><button class="v93-btn ghost" id="v93-next">Next lesson</button></div></div></section>';
    $$('[data-v93-listen]',out).forEach(b=>b.onclick=()=>speak((r.vocabulary||[])[+b.dataset.v93Listen]?.term||'',row.targetCode));
    $$('[data-v93-practice]',out).forEach(b=>b.onclick=()=>practice((r.vocabulary||[])[+b.dataset.v93Practice]?.term||'',row.targetCode,$('[data-v93-feedback="'+b.dataset.v93Practice+'"]',out)));
    $$('[data-v93-dialogue]',out).forEach(b=>b.onclick=()=>speak((r.dialogue||[])[+b.dataset.v93Dialogue]?.target||'',row.targetCode));
    $$('[data-v93-answer]',out).forEach(b=>b.onclick=()=>{const box=$('[data-v93-answer-box="'+b.dataset.v93Answer+'"]',out),open=box.classList.toggle('open');b.textContent=open?'Hide answer':'Show answer'});
    const completeButton=$('#v93-complete',out),nextButton=$('#v93-next',out);
    if(completeButton){completeButton.onclick=complete;if(isCompleted(row)){completeButton.disabled=true;completeButton.textContent='✓ Lesson complete'}}
    if(nextButton)nextButton.onclick=nextLesson;
    out.scrollIntoView({behavior:'smooth',block:'start'});window.__SCHOLARK_I18N__?.apply?.(out);
    window.dispatchEvent(new CustomEvent('scholark-language-lesson-rendered',{detail:{id:row.id,targetCode:row.targetCode,level:row.level}}));
  }

  function speak(text,code){
    if(!text||!('speechSynthesis'in window))return;const voices=speechSynthesis.getVoices(),voice=voices.find(v=>(v.lang||'').toLowerCase().startsWith(String(code||'').toLowerCase()));speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=voice?.lang||code||'en';u.rate=.9;if(voice)u.voice=voice;speechSynthesis.speak(u);
  }

  function similarity(a,b){
    a=clean(a).toLowerCase();b=clean(b).toLowerCase();if(!a||!b)return 0;const m=a.length,n=b.length,d=Array.from({length:m+1},()=>Array(n+1).fill(0));for(let i=0;i<=m;i++)d[i][0]=i;for(let j=0;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return Math.max(0,Math.round((1-d[m][n]/Math.max(m,n))*100))
  }
  function practice(expected,code,host){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){if(host)host.textContent='Speech recognition is not supported in this browser. You can still use Listen and repeat aloud.';return}
    const rec=new SR();rec.lang=code||'en';rec.interimResults=false;rec.maxAlternatives=1;if(host)host.textContent='Listening… say: '+expected;
    rec.onresult=e=>{const heard=e.results?.[0]?.[0]?.transcript||'',score=similarity(expected,heard);if(host)host.textContent='Heard: “'+heard+'” · similarity '+score+'%'+(score>=85?' · excellent':score>=65?' · close, try once more':' · listen again and retry')};
    rec.onerror=()=>{if(host)host.textContent='Could not capture speech. Try again or use Listen first.'};try{rec.start()}catch{}
  }

  function renderHistory(){
    const host=$('#v93-history');if(!host)return;const h=lessonHistory();host.innerHTML=h.length?h.map((x,i)=>{const review=x.kind==='review',score=x.reviewResult?(' · '+Number(x.reviewResult.grade||0).toFixed(1)+'/10'):'';return '<button type="button" data-v93-old="'+i+'"><b>'+esc(review?'Review checkpoint':langName(x.targetCode)+' · '+(x.level||'A1'))+'</b><span>'+esc(review?('Spaced repetition'+score):(x.topic||x.result?.title||'Language lesson'))+' · '+new Date(x.at||Date.now()).toLocaleDateString()+'</span></button>'}).join(''):'<div class="v93-chip">Your generated lessons and reviews will appear here.</div>';
    $$('[data-v93-old]',host).forEach(b=>b.onclick=()=>renderLesson(h[+b.dataset.v93Old]));window.__SCHOLARK_I18N__?.apply?.(host);
  }

  addEventListener('scholark:language-choice',e=>{
    if(!current)return;const p=loadProgress(),code=current.targetCode,x=p[code]||{level:current.level||'A1'};x.attempts=(Number(x.attempts)||0)+1;if(e.detail?.correct)x.correct=(Number(x.correct)||0)+1;else{x.incorrect=(Number(x.incorrect)||0)+1;x.lastWeakTopic=current.topic||x.lastWeakTopic||''}p[code]=x;saveProgress(p);renderStats(code);pushCloudProgress(code);
  });
  addEventListener('hashchange',()=>{if(location.hash.toLowerCase()==='#language')setTimeout(()=>open(false),40)});
  setTimeout(()=>{if(location.hash.toLowerCase()==='#language')open(false)},260);
  function selftest(){
    const rows=langs(),codes=rows.map(x=>x[0]),cadence=[4,8,12].every(n=>n%REVIEW_EVERY===0),ok=rows.length===74&&new Set(codes).size===74&&!codes.includes('srn')&&cadence&&REVIEW_QUESTIONS>=10;
    return {ok,count:rows.length,unique:new Set(codes).size,noSranan:!codes.includes('srn'),reviewEvery:REVIEW_EVERY,reviewQuestions:REVIEW_QUESTIONS,cadence};
  }
  window.__SCHOLARK_V93_LANGUAGE__={open:()=>open(false),refresh:()=>open(true),buildLesson,nextLesson,completeLesson:complete,reviewDue,finishReview,getCurrent:()=>current,selftest,supportedCount:()=>langs().length};
})();