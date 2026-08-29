(() => {
  if (window.__SCHOLARK_V27_VOICE__) return;
  window.__SCHOLARK_V27_VOICE__=true;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const visible=e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden';};
  const txt=e=>(e?.textContent||'').trim();
  function currentLang(){
    const nodes=$$('button,a,span,div').filter(visible);
    const current=nodes.find(e=>/^(English|Engels|Nederlands|Dutch)$/i.test(txt(e)));
    if(current){const t=txt(current).toLowerCase();if(t.includes('neder')||t==='dutch')return'nl';if(t.includes('english')||t==='engels')return'en';}
    const body=txt(document.body);
    if(/\bUitloggen\b|\bFocusmodus\b|\bMijn projecten\b/i.test(body))return'nl';
    return'en';
  }
  const copy={
    nl:{future:[['Maya','Je toekomst begint niet pas wanneer je bent ingeschreven. Met Study Ahead ontdek je nu al wat je toekomstige studie vraagt en wat je alvast kunt leren.'],['Noah','Met Schools Near Me vind je scholen rondom jouw locatie zodat je sneller ziet welke mogelijkheden dichtbij zijn.']],studio:[['Maya','In SCHOLARK Studio begin je nooit met een leeg scherm. Beschrijf wat je wilt maken en SCHOLARK bouwt een complete eerste versie.'],['Noah','Maak presentaties, webpagina’s, documenten, social content en graphics. Met Pro krijg je ook Book Studio en de hoogste AI-kwaliteit.']],play:'▶ Laat de AI-presenters uitleggen'},
    en:{future:[['Maya','Your future does not start only after you enroll. Study Ahead helps you understand what your future degree may require and what you can start learning now.'],['Noah','Schools Near Me helps you discover schools around your current location so you can compare nearby options much faster.']],studio:[['Maya','In SCHOLARK Studio you never have to start from a blank screen. Describe what you want to create and SCHOLARK builds a complete first version.'],['Noah','Create presentations, webpages, documents, social content and graphics. With Pro, you also unlock Book Studio and the highest AI quality.']],play:'▶ Let the AI presenters explain'}
  };
  function voicesFor(lang){
    const all=speechSynthesis.getVoices();
    const locales=lang==='nl'?['nl-NL','nl-BE','nl']:['en-US','en-GB','en-AU','en'];
    let list=all.filter(v=>locales.some(l=>(v.lang||'').toLowerCase().startsWith(l.toLowerCase())));
    const preferred=lang==='nl'?['fenna','colette','maarten','xander','natural','neural','online','google','microsoft']:['jenny','aria','sonia','libby','ryan','guy','samantha','daniel','natural','neural','online','google','microsoft'];
    const score=v=>preferred.reduce((n,k)=>n+((v.name||'').toLowerCase().includes(k)?5:0),0)+(v.localService?0:2);
    return list.sort((a,b)=>score(b)-score(a));
  }
  function talk(section,kind){
    if(!('speechSynthesis'in window))return;
    const lang=currentLang(), locale=lang==='nl'?'nl-NL':'en-US', lines=copy[lang][kind];
    speechSynthesis.cancel();
    let i=0;
    const run=()=>{
      if(i>=lines.length){$$('.v25-person',section).forEach(x=>x.classList.remove('talking'));return;}
      const [name,text]=lines[i],host=$(`[data-host="${name}"]`,section);$$('.v25-person',section).forEach(x=>x.classList.remove('talking'));host?.classList.add('talking');
      const available=voicesFor(lang),u=new SpeechSynthesisUtterance(text);u.lang=locale;u.rate=lang==='nl'?.92:.95;u.pitch=i===0?1.03:.94;u.volume=1;if(available.length)u.voice=available[Math.min(i,available.length-1)];
      u.onend=()=>{host?.classList.remove('talking');i++;setTimeout(run,120)};u.onerror=()=>{host?.classList.remove('talking');i++;run()};speechSynthesis.speak(u);
    };
    if(!speechSynthesis.getVoices().length){let fired=false;const start=()=>{if(fired)return;fired=true;run()};speechSynthesis.addEventListener?.('voiceschanged',start,{once:true});setTimeout(start,900)}else run();
  }
  function bind(){
    const lang=currentLang();
    ['future','studio'].forEach(kind=>{
      const sec=$('#v25-ad-'+kind);if(!sec)return;const lines=copy[lang][kind];$$('.v25-person',sec).forEach((p,i)=>{const c=$('.v25-caption',p);if(c&&lines[i])c.innerHTML=`<b>${lines[i][0]}</b>${lines[i][1]}`;});
      let b=$('.v25-play',sec);if(!b)return;if(b.dataset.v27==='1'){b.firstChild&&(b.firstChild.textContent=copy[lang].play+' ');return;}const n=b.cloneNode(false);n.className=b.className;n.dataset.v27='1';n.textContent=copy[lang].play;n.onclick=()=>talk(sec,kind);b.replaceWith(n);
    });
  }
  addEventListener('scholark-language-ready',()=>setTimeout(bind,80));
  [150,700].forEach(ms=>setTimeout(bind,ms));
})();