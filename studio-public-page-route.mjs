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
  const r=await fetch(u,{headers:{apikey:KEY,accept:'application/json','x-scholark-page-slug':slug}});
  if(!r.ok)throw new Error('Public page lookup failed');
  const rows=await r.json();return Array.isArray(rows)?rows[0]:null;
}

function sanitizeStyleAttr(style){
  return String(style||'').replace(/\u0000/g,'').replace(/\\/g,'').split(';').map(part=>{
    const i=part.indexOf(':');if(i<1)return '';
    const prop=part.slice(0,i).trim(),val=part.slice(i+1).trim();
    if(!/^--[a-z0-9_-]+$|^-?[a-z][a-z0-9-]*$/i.test(prop)||!val)return '';
    if(/url\s*\(|expression\s*\(|javascript\s*:|vbscript\s*:|behavior\s*:|-moz-binding|@import|<\/?style/i.test(val))return '';
    return prop+':'+val;
  }).filter(Boolean).join(';');
}
function sanitizeCss(css){
  let s=String(css||'').replace(/\u0000/g,'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\\/g,'');
  s=s.replace(/<\/?style\b[^>]*>/gi,'');
  s=s.replace(/@(?:import|charset|namespace)\b[^;{}]*;?/gi,'');
  s=s.replace(/@font-face\b\s*{[\s\S]*?}/gi,'');
  s=s.replace(/url\s*\([^)]*\)/gi,'none');
  s=s.replace(/([\w-]+)\s*:\s*([^;{}]*)(;?)/g,(m,prop,val,semi)=>{
    if(/expression\s*\(|javascript\s*:|vbscript\s*:|behavior\s*:|-moz-binding|@import|<\/?style/i.test(val))return '';
    return prop+':'+val+(semi||'');
  });
  return s.slice(0,120000);
}
async function sanitize(html){
  const mod=await import('sanitize-html'),sanitizeHtml=mod.default||mod,styles=[];
  let staged=String(html||'').replace(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi,(_,css)=>{const safeCss=sanitizeCss(css);if(safeCss)styles.push(safeCss);return ''}).replace(/<style\b[^>]*\/?\s*>/gi,'');
  const safe=sanitizeHtml(staged,{
    allowedTags:['html','head','meta','title','body','main','section','nav','header','footer','article','aside','div','span','p','h1','h2','h3','h4','h5','h6','small','strong','b','em','i','u','ul','ol','li','a','img','figure','figcaption','br','hr','button','table','thead','tbody','tr','th','td'],
    allowedAttributes:{html:['lang'],meta:['charset','name','property','content'],a:['href','target','rel'],img:['src','alt','loading','width','height'],button:['type'], '*':['class','id','style','role','aria-label','aria-hidden','data-index']},
    allowedSchemes:['http','https','mailto','tel','data'],allowedSchemesByTag:{img:['http','https','data'],a:['http','https','mailto','tel']},allowProtocolRelative:false,
    nonTextTags:['script','textarea','option','noscript','iframe','object','embed','form'],
    transformTags:{'*':(tag,attrs)=>{
      const out={...attrs};if(out.style){out.style=sanitizeStyleAttr(out.style);if(!out.style)delete out.style}
      if(tag==='a'){out.rel='noopener noreferrer';if(out.target!=='_blank')delete out.target}
      return {tagName:tag,attribs:out};
    }}
  });
  const css=styles.join('\n').slice(0,120000);
  if(!css)return safe;
  if(/<\/head\s*>/i.test(safe))return safe.replace(/<\/head\s*>/i,'<style>'+css+'</style></head>');
  return '<style>'+css+'</style>'+safe;
}

setTimeout(()=>{sanitize('<!doctype html><html><head><meta property="og:title" content="SCHOLARK"><style>.x{color:red}.bad{background:url(javascript:alert(1));width:expression(alert(1))}@import url(https://evil.test/x.css)</style></head><body><a href="tel:+597123456">Call</a><div class="x" style="color:blue;background:url(javascript:alert(2))" onclick="alert(1)">safe<script>alert(1)</script><iframe src="https://evil.test"></iframe></div></body></html>').then(s=>{const flags={scriptGone:!/<script/i.test(s),handlerGone:!/onclick\s*=/i.test(s),iframeGone:!/<iframe/i.test(s),styleKept:/color\s*:\s*red/i.test(s),openGraphKept:/property="og:title"/i.test(s),telKept:/href="tel:\+597123456"/i.test(s),dangerousCssGone:!/javascript\s*:|expression\s*\(|@import|evil\.test/i.test(s),inlineStyleClean:/style="color:blue"/i.test(s)};const ok=Object.values(flags).every(Boolean);console.log('[SCHOLARK] Public page sanitizer self-test '+(ok?'PASS':'FAIL')+' '+JSON.stringify(flags))}).catch(e=>console.error('[SCHOLARK] Public page sanitizer self-test FAIL '+String(e?.message||e)))},450);

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
