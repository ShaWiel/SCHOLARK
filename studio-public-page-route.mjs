import http from 'node:http';

const originalEmit=http.Server.prototype.emit;
console.log('[SCHOLARK] Public webpage route ready');
const SB=String(process.env.SUPABASE_URL||'https://yhafbwdnnpvuedycdkll.supabase.co').replace(/\/$/,'');
const KEY=String(process.env.SUPABASE_PUBLISHABLE_KEY||'').trim();
const slugOk=s=>/^[a-z0-9][a-z0-9-]{2,79}$/.test(String(s||''));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fallback(res,status,title,body){if(res.headersSent)return;res.writeHead(status,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer'});res.end('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#f6f5f1;color:#17191f;font-family:Inter,Arial,sans-serif}.c{max-width:620px;padding:40px}.k{font-weight:900;color:#6d5dfc;font-size:11px;letter-spacing:.12em}.c h1{font-size:44px;letter-spacing:-.05em;margin:10px 0}.c p{color:#706c77;line-height:1.6}</style><div class="c"><div class="k">SCHOLARK</div><h1>'+esc(title)+'</h1><p>'+esc(body)+'</p></div>')}
async function getPage(slug){
  if(!KEY)throw new Error('SUPABASE_PUBLISHABLE_KEY is not configured');
  const u=SB+'/rest/v1/published_webpages?select=title,html,updated_at&status=eq.published&slug=eq.'+encodeURIComponent(slug)+'&limit=1';
  const r=await fetch(u,{headers:{apikey:KEY,accept:'application/json'}});
  if(!r.ok)throw new Error('Public page lookup failed');
  const rows=await r.json();return Array.isArray(rows)?rows[0]:null;
}
async function sanitize(html){
  const mod=await import('sanitize-html'),sanitizeHtml=mod.default||mod;
  return sanitizeHtml(String(html||''),{
    allowedTags:['html','head','meta','title','style','body','main','section','nav','header','footer','article','aside','div','span','p','h1','h2','h3','h4','h5','h6','small','strong','b','em','i','u','ul','ol','li','a','img','figure','figcaption','br','hr','button','table','thead','tbody','tr','th','td'],
    allowedAttributes:{html:['lang'],meta:['charset','name','property','content'],a:['href','target','rel'],img:['src','alt','loading','width','height'],button:['type'], '*':['class','id','style','role','aria-label','aria-hidden','data-index']},
    allowedSchemes:['http','https','mailto','tel','data'],allowedSchemesByTag:{img:['http','https','data'],a:['http','https','mailto','tel']},allowProtocolRelative:false,
    nonTextTags:['script','textarea','option','noscript','iframe','object','embed','form'],
    transformTags:{a:(tag,attrs)=>({tagName:'a',attribs:{...attrs,rel:'noopener noreferrer',target:attrs.target==='_blank'?'_blank':attrs.target}})}
  });
}

setTimeout(()=>{sanitize('<!doctype html><html><head><style>.x{color:red}</style></head><body><div class="x" onclick="alert(1)">safe<script>alert(1)</script><iframe src="https://evil.test"></iframe></div></body></html>').then(s=>{const flags={scriptGone:!/<script/i.test(s),handlerGone:!/onclick\s*=/i.test(s),iframeGone:!/<iframe/i.test(s),styleKept:/color\s*:\s*red/i.test(s)};const ok=Object.values(flags).every(Boolean);console.log('[SCHOLARK] Public page sanitizer self-test '+(ok?'PASS':'FAIL')+' '+JSON.stringify(flags))}).catch(e=>console.error('[SCHOLARK] Public page sanitizer self-test FAIL '+String(e?.message||e)))},450);

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return originalEmit.call(this,type,...args);
  const [req,res]=args;
  try{
    const u=new URL(req.url||'/','http://localhost'),m=u.pathname.match(/^\/p\/([a-z0-9][a-z0-9-]{2,79})\/?$/);
    if((req.method==='GET'||req.method==='HEAD')&&m){
      const slug=m[1];if(!slugOk(slug)){fallback(res,404,'Page not found','This SCHOLARK page does not exist.');return true}
      getPage(slug).then(async row=>{
        if(!row){fallback(res,404,'Page not found','This SCHOLARK page is unpublished or does not exist.');return}
        const safe=await sanitize(row.html);
        const headers={'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=120, stale-while-revalidate=300','content-security-policy':"default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; font-src https: data:; script-src 'none'; connect-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'",'x-content-type-options':'nosniff','referrer-policy':'no-referrer','permissions-policy':'camera=(), microphone=(), geolocation=(), payment=()'};
        res.writeHead(200,headers);if(req.method==='HEAD')res.end();else res.end(safe);
      }).catch(e=>fallback(res,503,'Page temporarily unavailable',String(e?.message||'Try again later.')));
      return true;
    }
  }catch(e){fallback(res,500,'Page error','SCHOLARK could not open this page.');return true}
  return originalEmit.call(this,type,...args);
};
