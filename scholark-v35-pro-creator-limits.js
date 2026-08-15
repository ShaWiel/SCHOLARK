(() => {
  if (window.__SCHOLARK_V35_PRO_CREATOR_LIMITS__) return;
  window.__SCHOLARK_V35_PRO_CREATOR_LIMITS__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const style=document.createElement('style');
  style.id='scholark-v35-style';
  style.textContent=`
    .v35-pro-note{margin:2px 0 12px;padding:10px 12px;border-radius:13px;background:#f0efff;border:1px solid rgba(109,93,252,.16);font:700 11px/1.45 Inter;color:#514b70}
    .v35-pro-note b{color:#17191f}.v35-pro-note strong{color:#5b47e7}
    .v35-book-settings{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}
    .v35-field{background:#fff;border:1px solid rgba(23,25,31,.12);border-radius:15px;padding:11px}
    .v35-field label{display:block;font:850 10px Inter;margin-bottom:6px;color:#4f4b58}
    .v35-field select,.v35-field input{width:100%;box-sizing:border-box;border:1px solid rgba(23,25,31,.13);border-radius:10px;padding:9px 10px;background:#fafafa;font:650 12px Inter;outline:none}
    .v35-field input:focus,.v35-field select:focus{border-color:#6d5dfc;box-shadow:0 0 0 2px rgba(109,93,252,.12)}
    .v35-book-limit{grid-column:1/-1;background:#17191f;color:#fff;border-radius:14px;padding:11px 12px;font:650 11px/1.45 Inter}
    .v35-book-limit strong{color:#c9ff6a}
    .v35-book-save{grid-column:1/-1;border:0;border-radius:13px;background:#6d5dfc;color:#fff;padding:11px 13px;font:850 11px Inter;cursor:pointer}
    .v35-book-save.saved{background:#17191f;color:#c9ff6a}
    @media(max-width:700px){.v35-book-settings{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function replaceOptions(select,items){
    if(!select)return;
    const current=select.value;
    select.innerHTML=items.map(x=>`<option value="${x.value}">${x.label}</option>`).join('');
    if(items.some(x=>x.value===current))select.value=current;
  }

  const presentationCounts=[5,10,15,20,30,40,50,60,75,100].map(n=>({value:String(n),label:n===100?'100 dia’s — PRO max':`${n} dia’s`}));
  const documentCounts=[1,2,3,5,10,15,20,30,40,50,75,100].map(n=>({value:String(n),label:n===100?'100 pagina’s — PRO max':`${n} pagina’s`}));

  function enhanceStudio(){
    const ov=$('#sv24-overlay');if(!ov)return;
    const active=$('.sv24-mode.active',ov)?.dataset.mode;
    const count=$('#sv24-count',ov);
    const body=$('.sv24-body',ov);
    if(!active||!count||!body)return;

    let note=$('#v35-studio-note',ov);
    if(!note){note=document.createElement('div');note.id='v35-studio-note';note.className='v35-pro-note';const controls=$('.sv24-controls',ov);controls?.insertAdjacentElement('afterend',note);}

    if(active==='presentation'){
      if(count.dataset.v35mode!=='presentation'){replaceOptions(count,presentationCounts);count.dataset.v35mode='presentation';}
      note.innerHTML='<b>PRO:</b> presentaties kunnen tot <strong>100 dia’s</strong> bevatten. Grote decks worden in secties opgebouwd en daarna als één consistente presentatie samengevoegd.';
      note.style.display='block';
    }else if(active==='document'){
      if(count.dataset.v35mode!=='document'){replaceOptions(count,documentCounts);count.dataset.v35mode='document';}
      note.innerHTML='<b>PRO:</b> documenten en verslagen kunnen tot <strong>100 pagina’s</strong> bevatten. SCHOLARK bewaakt hoofdstukken, bronnen en samenhang door het hele document.';
      note.style.display='block';
    }else{
      if(count.dataset.v35mode){delete count.dataset.v35mode;setTimeout(()=>{const btn=$(`.sv24-mode[data-mode="${active}"]`,ov);btn?.click();},0);}
      note.style.display='none';
    }
  }

  const genres=[
    'Literary Fiction','Romance','Contemporary Romance','Historical Romance','Romantic Comedy','Romantasy','Fantasy','Epic Fantasy','Dark Fantasy','Urban Fantasy','High Fantasy','Low Fantasy','Sword & Sorcery','Science Fiction','Hard Science Fiction','Space Opera','Cyberpunk','Dystopian','Utopian','Horror','Psychological Horror','Gothic','Thriller','Psychological Thriller','Mystery','Crime','Detective','Suspense','Action','Adventure','Historical Fiction','Alternate History','Western','Magical Realism','Paranormal','Supernatural','Young Adult','Middle Grade','Children’s','Coming-of-age','Drama','Humor','Satire','Short Stories','Poetry','Graphic Novel / Comic','Fanfiction','Biography','Autobiography','Memoir','History','True Crime','Self-help','Personal Development','Business','Entrepreneurship','Finance','Science','Technology','Philosophy','Religion / Spirituality','Psychology','Sociology','Politics','Law','Education','Travel','Cookbook / Food','Health / Fitness','Sports','Art / Design','Essays','Journalism','Custom / Genre blend'
  ];

  function enhanceBook(){
    const d=$('#v25-book');if(!d)return;
    const content=$('.v25-content',d);if(!content||!content.children.length||$('#v35-book-settings',d))return;

    const settings=document.createElement('div');settings.id='v35-book-settings';settings.className='v35-book-settings';
    settings.innerHTML=`
      <div class="v35-field"><label>Genre / verhaaltype</label><select id="v35-book-genre">${genres.map(g=>`<option>${g}</option>`).join('')}</select></div>
      <div class="v35-field"><label>Doellengte in woorden</label><input id="v35-book-words" type="number" min="1000" max="900000" step="1000" value="80000"></div>
      <div class="v35-field" id="v35-custom-genre-wrap" style="display:none"><label>Custom genre of combinatie</label><input id="v35-custom-genre" placeholder="Bijv. Afro-futuristische legal thriller + romance"></div>
      <div class="v35-book-limit"><strong>PRO maximum: 900.000 woorden.</strong> Lange boeken worden hoofdstuk-voor-hoofdstuk gebouwd met een vaste story bible voor personages, wereldregels, tijdlijn, stijl, plot en continuity.</div>
      <button class="v35-book-save" type="button">Gebruik deze Book Studio-instellingen</button>`;
    const textarea=$('.v25-input',content);textarea?.insertAdjacentElement('afterend',settings);

    const sel=$('#v35-book-genre',settings),customWrap=$('#v35-custom-genre-wrap',settings),custom=$('#v35-custom-genre',settings),words=$('#v35-book-words',settings),save=$('.v35-book-save',settings);
    sel.onchange=()=>customWrap.style.display=sel.value==='Custom / Genre blend'?'block':'none';
    words.oninput=()=>{let n=Number(words.value||0);if(n>900000)words.value='900000';if(n<1000&&words.value)words.value='1000';};
    save.onclick=()=>{
      const genre=sel.value==='Custom / Genre blend'?(custom.value.trim()||'Custom / Genre blend'):sel.value;
      const targetWords=Math.max(1000,Math.min(900000,Number(words.value)||80000));
      let old={};try{old=JSON.parse(localStorage.getItem('scholark_book_studio_settings')||'{}')}catch{}
      localStorage.setItem('scholark_book_studio_settings',JSON.stringify({...old,genre,targetWords,updatedAt:Date.now()}));
      save.textContent=`✓ ${genre} • ${targetWords.toLocaleString()} woorden`;save.classList.add('saved');
    };

    const hint=$('.v25-bookhint',content);
    if(hint)hint.innerHTML='<strong>Book Studio Pro:</strong> alle genres, subgenres en genrecombinaties; tot 900.000 woorden; Idea Architect, Length Coach, Chapter Builder, story-bible/continuity controle en Writing Teacher die uitlegt wat logisch kan volgen na een alinea, scène of hoofdstuk.';
  }

  function updatePricing(){
    const pro=$('#v25-pricing .v25-plan.pro');if(!pro)return;
    const ul=$('ul',pro);if(!ul||ul.dataset.v35)return;ul.dataset.v35='1';
    ['Presentaties tot 100 dia’s','Documenten & verslagen tot 100 pagina’s','Book Studio tot 900.000 woorden','Alle boek- en verhaalgenres + custom genre blends'].forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li);});
  }

  function sync(){enhanceStudio();enhanceBook();updatePricing();}
  document.addEventListener('click',e=>{
    if(e.target.closest('.sv24-mode'))setTimeout(enhanceStudio,30);
    if(e.target.closest('[data-tool="book"]'))setTimeout(enhanceBook,30);
  },true);
  new MutationObserver(()=>{clearTimeout(window.__v35t);window.__v35t=setTimeout(sync,70)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,40));
  setInterval(sync,700);setTimeout(sync,60);
})();