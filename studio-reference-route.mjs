import http from 'node:http';

const originalEmit=http.Server.prototype.emit;
console.log('[SCHOLARK] Reference extraction route ready');

function json(res,status,obj){if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(obj))}
function clean(v){return String(v??'').replace(/\u0000/g,'').trim()}
function readBody(req,limit=15*1024*1024){return new Promise((resolve,reject)=>{let raw='',size=0;req.setEncoding('utf8');req.on('data',c=>{size+=Buffer.byteLength(c);if(size>limit){reject(Object.assign(new Error('Reference upload is too large'),{code:'PAYLOAD_TOO_LARGE'}));req.destroy();return}raw+=c});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{reject(Object.assign(new Error('Invalid JSON'),{code:'INVALID_JSON'}))}});req.on('error',reject)})}
function decode(body){
  const name=String(body?.name||'reference').slice(0,220),ext=(name.split('.').pop()||'').toLowerCase(),raw=String(body?.data||'');
  if(!/^[A-Za-z0-9+/=]+$/.test(raw)||raw.length>14*1024*1024){const e=new Error('Invalid or oversized reference data');e.code='INVALID_FILE';throw e}
  const buffer=Buffer.from(raw,'base64');if(!buffer.length||buffer.length>10*1024*1024){const e=new Error('Reference file must be 10 MB or smaller');e.code='FILE_TOO_LARGE';throw e}
  return {name,ext,buffer};
}
function xmlDecode(s){return String(s||'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)))}
async function safeZip(buffer){
  const mod=await import('jszip'),JSZip=mod.default||mod,zip=await JSZip.loadAsync(buffer,{checkCRC32:false});
  let total=0,count=0;
  for(const f of Object.values(zip.files)){if(f.dir)continue;count++;const n=Number(f?._data?.uncompressedSize||0);total+=Number.isFinite(n)?n:0;if(count>2500||total>45*1024*1024){const e=new Error('Compressed document expands beyond safe limits');e.code='ZIP_LIMIT';throw e}}
  return zip;
}
async function extractPdf(buffer){
  if(buffer.slice(0,5).toString()!=='%PDF-'){const e=new Error('File does not look like a valid PDF');e.code='INVALID_PDF';throw e}
  const mod=await import('@cedrugs/pdf-parse'),pdf=mod.default||mod;const out=await pdf(buffer);return {text:clean(out?.text),pages:Number(out?.numpages||0)||undefined};
}
async function extractDocx(buffer){
  if(buffer[0]!==0x50||buffer[1]!==0x4b){const e=new Error('File does not look like a valid DOCX');e.code='INVALID_DOCX';throw e}
  await safeZip(buffer);const mod=await import('mammoth'),mammoth=mod.default||mod;const out=await mammoth.extractRawText({buffer});return {text:clean(out?.value),warnings:(out?.messages||[]).slice(0,8).map(x=>String(x?.message||x))};
}
async function extractPptx(buffer){
  if(buffer[0]!==0x50||buffer[1]!==0x4b){const e=new Error('File does not look like a valid PPTX');e.code='INVALID_PPTX';throw e}
  const zip=await safeZip(buffer),names=Object.keys(zip.files).filter(n=>/^ppt\/slides\/slide\d+\.xml$/i.test(n)).sort((a,b)=>(Number(a.match(/slide(\d+)/i)?.[1])||0)-(Number(b.match(/slide(\d+)/i)?.[1])||0));
  const slides=[];
  for(const name of names.slice(0,180)){const xml=await zip.file(name)?.async('string');if(!xml)continue;const parts=[...xml.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/gi)].map(m=>xmlDecode(m[1])).map(clean).filter(Boolean);if(parts.length)slides.push('Slide '+(slides.length+1)+': '+parts.join(' | '))}
  return {text:slides.join('\n\n'),slides:slides.length};
}
async function extract(body){
  const {name,ext,buffer}=decode(body);let result;
  const timeout=new Promise((_,reject)=>setTimeout(()=>reject(Object.assign(new Error('Reference extraction timed out'),{code:'EXTRACT_TIMEOUT'})),35000));
  if(ext==='pdf')result=await Promise.race([extractPdf(buffer),timeout]);
  else if(ext==='docx')result=await Promise.race([extractDocx(buffer),timeout]);
  else if(ext==='pptx')result=await Promise.race([extractPptx(buffer),timeout]);
  else{const e=new Error('Supported binary references are PDF, DOCX and PPTX');e.code='UNSUPPORTED_REFERENCE';throw e}
  const text=clean(result?.text).slice(0,60000);if(!text){const e=new Error('No readable text was found in this file');e.code='NO_TEXT';throw e}
  return {ok:true,name,type:ext,text,chars:text.length,pages:result?.pages,slides:result?.slides,warnings:result?.warnings||[]};
}

async function referenceSelftest(){
  const [{Document,Packer,Paragraph},pdfkitMod,zipMod]=await Promise.all([import('docx'),import('pdfkit'),import('jszip')]);
  const PDFDocument=pdfkitMod.default||pdfkitMod,JSZip=zipMod.default||zipMod;
  const docxBuffer=await Packer.toBuffer(new Document({sections:[{children:[new Paragraph('SCHOLARK DOCX reference self-test text')]}]}));
  const pdfBuffer=await new Promise((resolve,reject)=>{const d=new PDFDocument({size:'A4'}),chunks=[];d.on('data',x=>chunks.push(x));d.on('end',()=>resolve(Buffer.concat(chunks)));d.on('error',reject);d.fontSize(16).text('SCHOLARK PDF reference self-test text');d.end()});
  const zip=new JSZip();zip.file('ppt/slides/slide1.xml','<?xml version="1.0"?><p:sld xmlns:p="p" xmlns:a="a"><p:cSld><a:t>SCHOLARK PPTX reference self-test text</a:t></p:cSld></p:sld>');
  const pptxBuffer=await zip.generateAsync({type:'nodebuffer'});
  const [pdf,docx,pptx]=await Promise.all([extractPdf(pdfBuffer),extractDocx(docxBuffer),extractPptx(pptxBuffer)]);
  const ok=/SCHOLARK/i.test(pdf.text||'')&&/SCHOLARK/i.test(docx.text||'')&&/SCHOLARK/i.test(pptx.text||'');
  return {ok,pdfChars:clean(pdf.text).length,docxChars:clean(docx.text).length,pptxChars:clean(pptx.text).length,pdfPages:pdf.pages,pptxSlides:pptx.slides};
}

setTimeout(()=>{referenceSelftest().then(x=>console.log('[SCHOLARK] Reference self-test '+(x.ok?'PASS':'FAIL')+' pdf='+x.pdfChars+' docx='+x.docxChars+' pptx='+x.pptxChars)).catch(e=>console.error('[SCHOLARK] Reference self-test FAIL '+String(e?.message||e)))},350);

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return originalEmit.call(this,type,...args);const [req,res]=args;
  try{
    const url=new URL(req.url||'/','http://localhost');
    if(req.method==='GET'&&url.pathname==='/api/studio/reference/health'){json(res,200,{ok:true,formats:['pdf','docx','pptx'],maxFileMB:10});return true}
    if(req.method==='GET'&&url.pathname==='/api/studio/reference/selftest'){referenceSelftest().then(x=>json(res,x.ok?200:500,x)).catch(e=>json(res,500,{ok:false,code:'REFERENCE_SELFTEST_FAILED',error:String(e?.message||e)}));return true}
    if(req.method==='POST'&&url.pathname==='/api/studio/reference/extract'){readBody(req).then(extract).then(x=>json(res,200,x)).catch(e=>{const code=e?.code||'REFERENCE_EXTRACT_FAILED',status=code==='PAYLOAD_TOO_LARGE'||code==='FILE_TOO_LARGE'?413:code==='UNSUPPORTED_REFERENCE'||code==='INVALID_FILE'||code.startsWith('INVALID_')?400:code==='EXTRACT_TIMEOUT'?504:422;json(res,status,{ok:false,code,error:String(e?.message||e)})});return true}
  }catch(e){json(res,500,{ok:false,code:'REFERENCE_ROUTE_ERROR',error:String(e?.message||e)});return true}
  return originalEmit.call(this,type,...args);
};
