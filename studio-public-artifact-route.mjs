import http from 'node:http';

const originalEmit=http.Server.prototype.emit;
console.log('[SCHOLARK] Public artifact route ready');

const SB=String(process.env.SUPABASE_URL||'https://yhafbwdnnpvuedycdkll.supabase.co').replace(/\/$/,'');
const KEY=String(process.env.SUPABASE_PUBLISHABLE_KEY||'').trim();
const TOKEN=/^[a-f0-9]{36}$/;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
const THEMES={
  midnight:{bg:'#10131c',panel:'#171b27',ink:'#ffffff',muted:'#b7bcc9',accent:'#c9ff6a',accent2:'#7667ff',font:'Inter,Arial,sans-serif'},
  editorial:{bg:'#f5f1e8',panel:'#fffdf8',ink:'#17191f',muted:'#77706a',accent:'#6d5dfc',accent2:'#c9ff6a',font:'Georgia,serif'},
  cobalt:{bg:'#0a1f44',panel:'#102c5f',ink:'#ffffff',muted:'#bfd0eb',accent:'#8be8ff',accent2:'#c9ff6a',font:'Inter,Arial,sans-serif'},
  plum:{bg:'#24152f',panel:'#352044',ink:'#ffffff',muted:'#d8c4df',accent:'#ffb4db',accent2:'#c9ff6a',font:'Inter,Arial,sans-serif'},
  paper:{bg:'#f7f7f4',panel:'#ffffff',ink:'#17191f',muted:'#6d6974',accent:'#17191f',accent2:'#6d5dfc',font:'Inter,Arial,sans-serif'},
  academic:{bg:'#f4f0e6',panel:'#fffdfa',ink:'#18221d',muted:'#6d756f',accent:'#1f6b50',accent2:'#b28b46',font:'Georgia,serif'},
  luxury:{bg:'#0b0b0d',panel:'#171619',ink:'#f8f4ea',muted:'#b8b0a3',accent:'#d8b56b',accent2:'#7b6650',font:'Georgia,serif'},
  aurora:{bg:'#10152a',panel:'#171f39',ink:'#f5f8ff',muted:'#bcc8df',accent:'#74f3cf',accent2:'#a278ff',font:'Inter,Arial,sans-serif'},
  forest:{bg:'#10251d',panel:'#183429',ink:'#f5fbf6',muted:'#b8d0c1',accent:'#b7e86d',accent2:'#4ca982',font:'Inter,Arial,sans-serif'},
  terracotta:{bg:'#f4e7dc',panel:'#fff9f4',ink:'#35221d',muted:'#866f66',accent:'#c85e3d',accent2:'#e3a24d',font:'Georgia,serif'},
  mono:{bg:'#f4f4f4',panel:'#ffffff',ink:'#111111',muted:'#666666',accent:'#111111',accent2:'#a5a5a5',font:'Arial,sans-serif'}
};
function safeImage(v){const s=String(v||'');return /^data:image\/(?:png|jpe?g);base64,[A-Za-z0-9+/=]+$/i.test(s)&&s.length<900000?s:''}
function headers(type='text/html; charset=utf-8'){
  return {'content-type':type,'cache-control':'public, max-age=60, stale-while-revalidate=180','content-security-policy':"default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; font-src https: data:; script-src 'none'; connect-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'",'x-content-type-options':'nosniff','referrer-policy':'no-referrer','permissions-policy':'camera=(), microphone=(), geolocation=(), payment=()','x-robots-tag':'noindex, nofollow, noarchive'};
}
function fallback(res,status,title,body){
  if(res.headersSent)return;res.writeHead(status,{...headers(),'cache-control':'no-store'});
  res.end('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f5f4f0;color:#17191f;font-family:Inter,Arial,sans-serif}.x{max-width:620px;padding:42px}.k{font-size:10px;font-weight:900;letter-spacing:.12em;color:#6d5dfc}.x h1{font-size:46px;line-height:.95;letter-spacing:-.05em;margin:12px 0}.x p{color:#716c77;line-height:1.6}</style><div class="x"><div class="k">SCHOLARK SHARE</div><h1>'+esc(title)+'</h1><p>'+esc(body)+'</p></div>');
}
async function getShare(token){
  if(!KEY)throw new Error('SUPABASE_PUBLISHABLE_KEY is not configured');
  const u=SB+'/rest/v1/shared_artifacts?select=kind,title,payload,updated_at&status=eq.published&token=eq.'+encodeURIComponent(token)+'&limit=1';
  const r=await fetch(u,{headers:{apikey:KEY,accept:'application/json','x-scholark-share-token':token}});
  if(!r.ok)throw new Error('Shared artifact lookup failed');
  const rows=await r.json();return Array.isArray(rows)?rows[0]||null:null;
}
function items(s){
  return (Array.isArray(s?.items)?s.items:[]).slice(0,6).map((x,i)=>Array.isArray(x)?{value:clean(x[0])||String(i+1).padStart(2,'0'),title:clean(x[1]),detail:clean(x[2])}:{value:clean(x?.value)||String(i+1).padStart(2,'0'),title:clean(x?.title||x?.heading),detail:clean(x?.detail)});
}
function slideHTML(s,i,n,media){
  const list=items(s),layout=clean(s?.layout)||'cards',img=safeImage(media?.[s?.id]);
  const head='<div class="kicker">'+esc(s?.kicker||'SCHOLARK')+'</div><h1>'+esc(s?.title)+'</h1>'+(s?.subtitle?'<p class="sub">'+esc(s.subtitle)+'</p>':'');
  let core='';
  if(layout==='hero')core='<div class="hero-copy">'+head+'</div><div class="visual '+(img?'has-image':'')+'">'+(img?'<img src="'+esc(img)+'" alt="">':'<i></i>')+'</div>';
  else if(layout==='split')core='<div class="split-copy">'+head+'</div><div class="visual '+(img?'has-image':'')+'">'+(img?'<img src="'+esc(img)+'" alt="">':'<div class="visual-copy"><b>'+esc(list[0]?.title||s?.visualType||'Key visual')+'</b><span>'+esc(list[0]?.detail||'')+'</span></div>')+'</div>';
  else if(layout==='quote'||layout==='statement')core='<div class="quote">“'+esc(s?.title)+'”</div>'+(s?.subtitle?'<div class="quote-source">'+esc(s.subtitle)+'</div>':'');
  else if(layout==='compare'){core=head+'<div class="compare">'+[0,1].map((j)=>'<article><b>'+esc(list[j]?.title||(j?'Perspective B':'Perspective A'))+'</b><p>'+esc(list[j]?.detail||'')+'</p></article>').join('<div class="vs">VS</div>')+'</div>'}
  else if(layout==='stats'){core=head+'<div class="stats">'+list.map(x=>'<article><strong>'+esc(x.value)+'</strong><b>'+esc(x.title)+'</b><span>'+esc(x.detail)+'</span></article>').join('')+'</div>'}
  else if(layout==='timeline'){core=head+'<div class="timeline">'+list.map(x=>'<article><strong>'+esc(x.value)+'</strong><b>'+esc(x.title)+'</b><span>'+esc(x.detail)+'</span></article>').join('')+'</div>'}
  else core=head+'<div class="cards">'+list.map(x=>'<article><small>'+esc(x.value)+'</small><b>'+esc(x.title)+'</b><span>'+esc(x.detail)+'</span></article>').join('')+'</div>';
  const refs=(s?.sourceRefs||[]).filter(Boolean).slice(0,4);
  const prev=i>0?'#slide-'+i:'#slide-'+(i+1),next=i<n-1?'#slide-'+(i+2):'#slide-'+(i+1);
  return '<section class="slide '+esc(layout)+'" id="slide-'+(i+1)+'"><div class="slide-inner">'+core+(refs.length?'<div class="sources">Sources: '+refs.map(esc).join(' · ')+'</div>':'')+'<div class="pager"><a href="'+prev+'" aria-label="Previous slide">←</a><span>'+(i+1)+' / '+n+'</span><a href="'+next+'" aria-label="Next slide">→</a></div></div></section>';
}
function presentation(row){
  const payload=row.payload||{},deck=payload.deck||{},slides=Array.isArray(deck.slides)?deck.slides.slice(0,100):[],media=payload.media||{},t=THEMES[deck.theme]||THEMES.midnight;
  if(!slides.length)return null;
  const html=slides.map((s,i)=>slideHTML(s,i,slides.length,media)).join('');
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(row.title)+'</title><style>:root{--bg:'+t.bg+';--panel:'+t.panel+';--ink:'+t.ink+';--muted:'+t.muted+';--accent:'+t.accent+';--accent2:'+t.accent2+'}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#0b0d12;font-family:'+t.font+'}.slide{display:none;width:100vw;height:100vh;background:var(--bg);color:var(--ink);padding:0}.slide:target{display:grid}body:not(:has(.slide:target)) #slide-1{display:grid}.slide-inner{position:relative;width:100%;height:100%;padding:6.2%;display:grid;align-content:center;overflow:hidden}.kicker{font-size:clamp(9px,1vw,14px);font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:1.4%}h1{font-size:clamp(40px,6vw,82px);line-height:.93;letter-spacing:-.055em;margin:0;max-width:92%}.sub{font-size:clamp(14px,1.5vw,21px);line-height:1.5;color:var(--muted);max-width:74%;margin:2% 0 0}.hero,.split{grid-template-columns:minmax(0,1fr) minmax(300px,.75fr);gap:5%;align-items:center}.visual{min-height:58vh;border-radius:28px;background:linear-gradient(145deg,var(--panel),color-mix(in srgb,var(--accent2) 24%,var(--panel)));overflow:hidden;display:grid;place-items:center}.visual img{width:100%;height:100%;object-fit:cover}.visual i{width:56%;aspect-ratio:1;border-radius:38% 62% 58% 42%;background:linear-gradient(135deg,var(--accent),var(--accent2));transform:rotate(18deg)}.visual-copy{text-align:center;padding:12%}.visual-copy b{display:block;font-size:28px}.visual-copy span{display:block;color:var(--muted);margin-top:10px}.cards,.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:3%}.cards article,.stats article,.compare article{background:var(--panel);border:1px solid color-mix(in srgb,var(--ink) 9%,transparent);border-radius:20px;padding:24px}.cards small{display:block;color:var(--accent);font-weight:900}.cards b,.stats b{display:block;font-size:clamp(16px,1.6vw,24px);margin:8px 0}.cards span,.stats span{color:var(--muted);line-height:1.45}.stats{grid-template-columns:repeat(4,minmax(0,1fr))}.stats strong{display:block;color:var(--accent);font-size:clamp(28px,4vw,56px)}.compare{display:grid;grid-template-columns:1fr auto 1fr;gap:18px;align-items:center;margin-top:4%}.compare article b{font-size:28px}.compare article p{color:var(--muted);line-height:1.55}.vs{color:var(--accent);font-weight:950}.timeline{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:4%;position:relative}.timeline:before{content:"";position:absolute;left:5%;right:5%;top:22px;border-top:2px solid var(--accent2)}.timeline article{position:relative;padding-top:52px;text-align:center}.timeline strong{position:absolute;top:7px;left:50%;transform:translateX(-50%);background:var(--accent);color:#151821;border-radius:999px;padding:6px 9px;font-size:11px}.timeline b{display:block}.timeline span{display:block;color:var(--muted);font-size:13px;margin-top:7px}.quote{font-size:clamp(50px,8vw,110px);font-weight:950;line-height:.95;letter-spacing:-.06em;max-width:92%;text-align:center;margin:auto}.quote-source{text-align:center;color:var(--accent);margin-top:22px}.sources{position:absolute;left:6.2%;right:6.2%;bottom:3%;font-size:9px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pager{position:absolute;right:3%;bottom:2.3%;display:flex;align-items:center;gap:8px;background:color-mix(in srgb,var(--panel) 88%,transparent);padding:6px;border-radius:999px;z-index:5}.pager a{width:34px;height:34px;display:grid;place-items:center;border-radius:50%;text-decoration:none;color:var(--ink);background:color-mix(in srgb,var(--ink) 7%,transparent);font-weight:900}.pager span{font-size:10px;color:var(--muted);min-width:44px;text-align:center}@media(max-width:760px){.hero,.split{grid-template-columns:1fr}.visual{display:none}.stats,.timeline{grid-template-columns:repeat(2,1fr)}.cards{grid-template-columns:1fr}.compare{grid-template-columns:1fr}.vs{display:none}.sources{display:none}.slide-inner{padding:8%}.sub{max-width:92%}}</style></head><body>'+html+'</body></html>';
}
function documentView(row){
  const a=row.payload?.artifact||{},sections=Array.isArray(a.items)?a.items:[],refs=Array.isArray(a.sources)?a.sources:[];
  const toc=sections.map((s,i)=>'<a href="#sec-'+(i+1)+'">'+esc(s.title||('Section '+(i+1)))+'</a>').join('');
  const body=sections.map((s,i)=>'<section id="sec-'+(i+1)+'"><h2>'+esc(s.title||('Section '+(i+1)))+'</h2>'+(Array.isArray(s.body)?s.body:[s.body]).filter(Boolean).map(p=>'<p>'+esc(p)+'</p>').join('')+((s.sourceRefs||[]).length?'<div class="section-sources"><b>Sources</b>'+s.sourceRefs.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>':'')+'</section>').join('');
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(row.title)+'</title><style>*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f4f3ef;color:#242323;font-family:Georgia,"Times New Roman",serif}.wrap{max-width:920px;margin:0 auto;background:#fff;min-height:100vh;padding:72px 82px;box-shadow:0 20px 70px rgba(20,20,30,.08)}.k{font:800 10px Inter,Arial,sans-serif;letter-spacing:.14em;color:#6d5dfc}.cover{padding:70px 0 60px;border-bottom:1px solid #ddd}.cover h1{font-size:52px;line-height:1.04;letter-spacing:-.04em;margin:12px 0}.cover p{font-size:18px;line-height:1.6;color:#666}.toc{padding:38px 0;border-bottom:1px solid #eee}.toc h2,section h2{font-size:28px;margin:0 0 16px}.toc a{display:block;color:#534d61;text-decoration:none;padding:8px 0;border-bottom:1px dotted #ddd}section{padding:38px 0;border-bottom:1px solid #eee}section p{font-size:17px;line-height:1.78;color:#393737}.section-sources{margin-top:20px;border-left:3px solid #6d5dfc;padding:12px 16px;background:#f7f5ff;font-family:Inter,Arial,sans-serif}.section-sources b,.section-sources span{display:block;font-size:11px;line-height:1.5}.refs{padding:38px 0}.refs li{margin:9px 0;color:#555}@media(max-width:700px){.wrap{padding:38px 24px}.cover{padding:36px 0}.cover h1{font-size:40px}}</style></head><body><article class="wrap"><div class="cover"><div class="k">SCHOLARK SHARED DOCUMENT</div><h1>'+esc(row.title)+'</h1><p>'+esc(a.summary||a.topic||a.prompt||'')+'</p></div><nav class="toc"><h2>Contents</h2>'+toc+'</nav>'+body+(refs.length?'<div class="refs"><h2>References</h2><ul>'+refs.map(x=>'<li>'+esc(typeof x==='string'?x:(x?.title||x?.url||''))+'</li>').join('')+'</ul></div>':'')+'</article></body></html>';
}
function bookView(row){
  const b=row.payload?.book||{},chapters=b.plan?.sections||[],drafts=b.drafts||{};
  const toc=chapters.map((c,i)=>'<a href="#ch-'+(i+1)+'">'+(i+1)+'. '+esc(c.title||('Chapter '+(i+1)))+'</a>').join('');
  const body=chapters.map((c,i)=>{const d=drafts[i],parts=d?.sections||[];return '<section id="ch-'+(i+1)+'"><div class="num">CHAPTER '+(i+1)+'</div><h2>'+esc(c.title||('Chapter '+(i+1)))+'</h2>'+(parts.length?parts.map(p=>'<div class="part">'+(p.title?'<h3>'+esc(p.title)+'</h3>':'')+'<p>'+esc(p.body||'')+'</p></div>').join(''):'<p>'+esc(c.body||c.subtitle||'')+'</p>')+'</section>'}).join('');
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(row.title)+'</title><style>*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#eeeae3;color:#262321;font-family:Georgia,"Times New Roman",serif}.book{max-width:820px;margin:0 auto;background:#fffdf9;min-height:100vh;padding:80px 88px;box-shadow:0 20px 70px rgba(40,30,20,.09)}.cover{padding:80px 0 70px;text-align:center}.cover small,.num{font:800 10px Inter,Arial,sans-serif;letter-spacing:.16em;color:#7b63d8}.cover h1{font-size:56px;line-height:1;letter-spacing:-.04em;margin:16px 0}.cover p{font-size:18px;line-height:1.65;color:#6f6964}.toc{border-top:1px solid #ddd4c8;border-bottom:1px solid #ddd4c8;padding:32px 0}.toc h2{font-size:25px}.toc a{display:block;color:#5e5650;text-decoration:none;padding:7px 0}section{padding:70px 0;border-bottom:1px solid #e9e2d8}section h2{font-size:38px;line-height:1.1;margin:10px 0 30px}section h3{font-size:22px;margin:28px 0 10px}section p{font-size:18px;line-height:1.85;color:#383431;white-space:pre-wrap}@media(max-width:700px){.book{padding:42px 24px}.cover{padding:50px 0}.cover h1{font-size:44px}section{padding:48px 0}}</style></head><body><article class="book"><header class="cover"><small>SCHOLARK SHARED BOOK</small><h1>'+esc(row.title)+'</h1><p>'+esc(b.plan?.summary||b.concept||'')+'</p></header><nav class="toc"><h2>Contents</h2>'+toc+'</nav>'+body+'</article></body></html>';
}
function render(row){
  if(row.kind==='presentation')return presentation(row);
  if(row.kind==='document')return documentView(row);
  if(row.kind==='book')return bookView(row);
  return null;
}

setTimeout(()=>{
  const malicious={kind:'document',title:'<script>alert(1)</script>',payload:{artifact:{items:[{title:'<img src=x onerror=1>',body:['<script>x</script>']}]}}};
  const out=documentView(malicious),ok=!/<script>/i.test(out)&&!/<img src=x/i.test(out)&&/&lt;script&gt;/i.test(out);
  console.log('[SCHOLARK] Public artifact renderer self-test '+(ok?'PASS':'FAIL'));
},520);

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return originalEmit.call(this,type,...args);
  const [req,res]=args;
  try{
    const u=new URL(req.url||'/','http://localhost'),m=u.pathname.match(/^\/s\/([a-f0-9]{36})\/?$/);
    if((req.method==='GET'||req.method==='HEAD')&&m){
      const token=m[1];if(!TOKEN.test(token)){fallback(res,404,'Share not found','This SCHOLARK share link is invalid.');return true}
      getShare(token).then(row=>{
        if(!row){fallback(res,404,'Share not found','This share is unpublished or does not exist.');return}
        const html=render(row);if(!html){fallback(res,422,'Unsupported share','This artifact type cannot be displayed.');return}
        res.writeHead(200,headers());if(req.method==='HEAD')res.end();else res.end(html);
      }).catch(e=>fallback(res,503,'Share temporarily unavailable',String(e?.message||'Try again later.')));
      return true;
    }
  }catch(e){fallback(res,500,'Share error','SCHOLARK could not open this shared artifact.');return true}
  return originalEmit.call(this,type,...args);
};
