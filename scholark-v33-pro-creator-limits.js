(() => {
  if (window.__SCHOLARK_V33_PRO_CREATOR_LIMITS__) return;
  window.__SCHOLARK_V33_PRO_CREATOR_LIMITS__ = true;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const style=document.createElement('style');
  style.id='scholark-v33-style';
  style.textContent=`
    #v33-dashboard{position:fixed;top:16px;right:20px;z-index:2147483595;border:0;border-radius:999px;padding:10px 15px;background:#17191f;color:#fff;font:850 12px Inter,system-ui;box-shadow:0 12px 32px rgba(0,0,0,.22);cursor:pointer;display:none;align-items:center;gap:8px}
    #v33-dashboard:hover{transform:translateY(-1px)}
    body.v31-public-home #v33-dashboard{display:flex}
    .v33-pro-note{margin:2px 0 12px;padding:10px 12px;border-radius:13px;background:#f0efff;border:1px solid rgba(109,93,252,.16);font:700 11px/1.45 Inter;color:#514b70}
    .v33-pro-note b{color:#17191f}
    .v33-book-settings{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}
    .v33-field{background:#fff;border:1px solid rgba(23,25,31,.12);border-radius:15px;padding:11px}
    .v33-field label{display:block;font:850 10px Inter;margin-bottom:6px;color:#4f4b58}
    .v33-field select,.v33-field input{width:100%;box-sizing:border-box;border:1px solid rgba(23,25,31,.13);border-radius:10px;padding:9px 10px;background:#fafafa;font:650 12px Inter;outline:none}
    .v33-field input:focus,.v33-field select:focus{border-color:#6d5dfc;box-shadow:0 0 0 2px rgba(109,93,252,.12)}
    .v33-book-limit{grid-column:1/-1;background:#17191f;color:#fff;border-radius:14px;padding:11px 12px;font:650 11px/1.45 Inter}
    .v33-book-limit strong{color:#c9ff6a}
    @media(max-width:700px){.v33-book-settings{grid-template-columns:1fr}#v33-dashboard{top:10px;right:10px}}
  `;
  document.head.appendChild(style);

  function isPublicHome(){return document.body?.classList.contains('v31-public-home')||!!document.querySelector('#v29-home-layer.v30-native-home:not([hidden])');}
  function ensureDashboard(){
    let b=$('#v33-dashboard');
    if(!b){b=document.createElement('button');b.id='v33-dashboard';b.innerHTML='▦ <span>Dashboard</span>';document.body.appendChild(b);b.onclick=()=>{
      const candidate=$$('button,a,[role="button"]').find(x=>x!==b&&!x.closest('#v29-home-layer')&&/^dashboard$/i.test((x.textContent||'').trim()));
      if(candidate){candidate.click();return;}
      location.hash='dashboard';
    };}
    b.style.display=isPublicHome()?'flex':'none';
  }

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

    let note=$('#v33-studio-note',ov);
    if(!note){note=document.createElement('div');note.id='v33-studio-note';note.className='v33-pro-note';const controls=$('.sv24-controls',ov);controls?.insertAdjacentElement('afterend',note);}

    if(active==='presentation'){
      if(count.dataset.v33mode!=='presentation'){replaceOptions(count,presentationCounts);count.dataset.v33mode='presentation';}
      note.innerHTML='<b>PRO:</b> presentaties kunnen tot <strong>100 dia’s</strong> bevatten. Grote decks worden in secties opgebouwd en daarna als één consistente presentatie samengevoegd.';
      note.style.display='block';
    }else if(active==='document'){
      if(count.dataset.v33mode!=='document'){replaceOptions(count,documentCounts);count.dataset.v33mode='document';}
      note.innerHTML='<b>PRO:</b> documenten en verslagen kunnen tot <strong>100 pagina’s</strong> bevatten. SCHOLARK bewaakt structuur, hoofdstukken, bronnen en samenhang over het hele document.';
      note.style.display='block';
    }else{
      // Let V24 restore its own values whenever a normal mode is clicked again.
      if(count.dataset.v33mode){delete count.dataset.v33mode;setTimeout(()=>{const btn=$(`.sv24-mode[data-mode="${active}"]`,ov);btn?.click();},0);}
      note.style.display='none';
    }
  }

  const genres=[
    'Literary Fiction','Romance','Contemporary Romance','Historical Romance','Romantic Comedy','Romantasy','Fantasy','Epic Fantasy','Dark Fantasy','Urban Fantasy','High Fantasy','Low Fantasy','Sword & Sorcery','Science Fiction','Hard Science Fiction','Space Opera','Cyberpunk','Dystopian','Utopian','Horror','Psychological Horror','Gothic','Thriller','Psychological Thriller','Mystery','Crime','Detective','Suspense','Action','Adventure','Historical Fiction','Alternate History','Western','Magical Realism','Paranormal','Supernatural','Young Adult','Middle Grade','Children’s','Coming-of-age','Drama','Humor','Satire','Short Stories','Poetry','Graphic Novel / Comic','Fanfiction','Biography','Autobiography','Memoir','History','True Crime','Self-help','Personal Development','Business','Entrepreneurship','Finance','Science','Technology','Philosophy','Religion / Spirituality','Psychology','Sociology','Politics','Law','Education','Travel','Cookbook / Food','Health / Fitness','Sports','Art / Design','Essays','Journalism','Custom / Genre blend'
  ];

  function enhanceBook(){
    const d=$('#v25-book');if(!d)return;
    const content=$('.v25-content',d);if(!content)return;
    if(!content.children.length)return;
    if($('#v33-book-settings',d))return;
    const settings=document.createElement('div');settings.id='v33-book-settings';settings.className='v33-book-settings';
    settings.innerHTML=`
      <div class="v33-field"><label>Genre / verhaaltype</label><select id="v33-book-genre">${genres.map(g=>`<option>${g}</option>`).join('')}</select></div>
      <div class="v33-field"><label>Doellengte in woorden</label><input id="v33-book-words" type="number" min="1000" max="900000" step="1000" value="80000"></div>
      <div class="v33-field" id="v33-custom-genre-wrap" style="display:none"><label>Custom genre of combinatie</label><input id="v33-custom-genre" placeholder="Bijv. Afro-futuristische legal thriller + romance"></div>
      <div class="v33-book-limit"><strong>PRO maximum: 900.000 woorden.</strong> Voor zeer lange boeken genereert SCHOLARK niet blind alles in één keer: het bewaart een story bible, personages, tijdlijn, stijlregels en hoofdstukdoelen en schrijft daarna gecontroleerd hoofdstuk voor hoofdstuk.</div>`;
    const textarea=$('.v25-input',content);textarea?.insertAdjacentElement('afterend',settings);
    const sel=$('#v33-book-genre',settings),custom=$('#v33-custom-genre-wrap',settings);
    sel.onchange=()=>custom.style.display=sel.value==='Custom / Genre blend'?'block':'none';
    const hint=$('.v25-bookhint',content);if(hint)hint.innerHTML='<strong>Book Studio Pro:</strong> alle genres en genrecombinaties, tot 900.000 woorden, met Idea Architect, Length Coach, Chapter Builder, continuity/story-bible controle en Writing Teacher die uitlegt wat logisch kan volgen na een alinea, scène of hoofdstuk.';
  }

  function updatePricing(){
    const pro=$('#v25-pricing .v25-plan.pro');if(!pro)return;
    const ul=$('ul',pro);if(!ul||ul.dataset.v33)return;ul.dataset.v33='1';
    const items=['Presentaties tot 100 dia’s','Documenten & verslagen tot 100 pagina’s','Book Studio tot 900.000 woorden','Alle boek- en verhaalgenres + custom genre blends'];
    items.forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li);});
  }

  function sync(){ensureDashboard();enhanceStudio();enhanceBook();updatePricing();}
  document.addEventListener('click',e=>{
    if(e.target.closest('.sv24-mode'))setTimeout(enhanceStudio,30);
    if(e.target.closest('[data-tool="book"]'))setTimeout(enhanceBook,30);
  },true);
  new MutationObserver(()=>{clearTimeout(window.__v33t);window.__v33t=setTimeout(sync,70)}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','hidden']});
  addEventListener('hashchange',()=>setTimeout(sync,40));
  setInterval(sync,700);setTimeout(sync,60);
})();