import http from 'node:http';

const originalEmit = http.Server.prototype.emit;
console.log('[SCHOLARK] Export route ready');

const THEMES={
  midnight:{bg:'10131C',panel:'171B27',ink:'FFFFFF',muted:'B7BCC9',accent:'C9FF6A',accent2:'7667FF'},
  editorial:{bg:'F5F1E8',panel:'FFFDF8',ink:'17191F',muted:'77706A',accent:'6D5DFC',accent2:'C9FF6A'},
  cobalt:{bg:'0A1F44',panel:'102C5F',ink:'FFFFFF',muted:'BFD0EB',accent:'8BE8FF',accent2:'C9FF6A'},
  plum:{bg:'24152F',panel:'352044',ink:'FFFFFF',muted:'D8C4DF',accent:'FFB4DB',accent2:'C9FF6A'},
  paper:{bg:'F7F7F4',panel:'FFFFFF',ink:'17191F',muted:'6D6974',accent:'17191F',accent2:'6D5DFC'}
};

function theme(name){return THEMES[name]||THEMES.midnight}
function clean(v){return String(v??'').replace(/\s+/g,' ').trim()}
function safeName(v,fallback='scholark'){return (clean(v)||fallback).replace(/[^a-z0-9._-]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,120)||fallback}
function json(res,status,obj){if(res.headersSent)return;res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(obj))}
function sendBuffer(res,buffer,type,name){
  if(res.headersSent)return;
  res.writeHead(200,{'content-type':type,'content-length':String(buffer.length),'content-disposition':`attachment; filename="${safeName(name)}"`,'cache-control':'no-store'});
  res.end(buffer);
}
function readBody(req,limit=20*1024*1024){
  return new Promise((resolve,reject)=>{
    let raw='',size=0;req.setEncoding('utf8');
    req.on('data',chunk=>{size+=Buffer.byteLength(chunk);if(size>limit){reject(Object.assign(new Error('Export payload too large'),{code:'PAYLOAD_TOO_LARGE'}));req.destroy();return}raw+=chunk});
    req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{reject(Object.assign(new Error('Invalid JSON'),{code:'INVALID_JSON'}))}});
    req.on('error',reject);
  });
}
function safeImageData(data){
  const s=String(data||'');if(s.length>3*1024*1024)return'';
  const m=s.match(/^data:image\/(jpeg|jpg|png);base64,([A-Za-z0-9+/=]+)$/i);if(!m)return'';
  let b;try{b=Buffer.from(m[2],'base64')}catch{return''}if(!b.length||b.length>2.2*1024*1024)return'';
  const jpeg=b[0]===0xff&&b[1]===0xd8&&b[2]===0xff,png=b.length>8&&b[0]===0x89&&b[1]===0x50&&b[2]===0x4e&&b[3]===0x47&&b[4]===0x0d&&b[5]===0x0a&&b[6]===0x1a&&b[7]===0x0a;
  return jpeg||png?s:'';
}
function dataBuffer(data){const safe=safeImageData(data);if(!safe)return null;try{return Buffer.from(safe.slice(safe.indexOf(',')+1),'base64')}catch{return null}}
function itemRows(s){return Array.isArray(s?.items)?s.items.slice(0,4).map((x,i)=>Array.isArray(x)?[clean(x[0])||String(i+1),clean(x[1]),clean(x[2])]:[String(i+1),clean(x?.title||x?.heading),clean(x?.detail)]):[]}

async function presentationPptx(body){
  const mod=await import('pptxgenjs'),PptxGenJS=mod.default||mod;
  const pptx=new PptxGenJS();pptx.layout='LAYOUT_WIDE';pptx.author='SCHOLARK';pptx.company='SCHOLARK';pptx.subject=clean(body?.deck?.prompt);pptx.title=clean(body?.deck?.name)||'SCHOLARK Presentation';pptx.lang='en-US';
  const deck=body?.deck||{},media=body?.media||{},t=theme(deck.theme);
  const ST=pptx.ShapeType||{};
  const rect=ST.rect||'rect',round=ST.roundRect||'roundRect',line=ST.line||'line',ellipse=ST.ellipse||'ellipse';
  const addText=(sl,text,opts={})=>{if(clean(text))sl.addText(String(text),{fontFace:'Aptos',margin:0,breakLine:false,fit:'shrink',valign:'mid',...opts})};
  for(let i=0;i<(deck.slides||[]).length;i++){
    const s=deck.slides[i]||{},items=itemRows(s),sl=pptx.addSlide();sl.background={color:t.bg};
    const img=safeImageData(media[s.id]);
    addText(sl,clean(s.kicker)||'SCHOLARK',{x:.72,y:.42,w:2.2,h:.3,fontSize:9,bold:true,color:t.accent,charSpacing:1.8});
    const layout=clean(s.layout)||'cards';
    if(layout==='hero'){
      if(img){sl.addImage({data:img,x:8.45,y:.7,w:4.25,h:6.05});sl.addShape(round,{x:8.45,y:.7,w:4.25,h:6.05,line:{color:t.ink,transparency:82},fill:{color:t.bg,transparency:100},radius:.18})}
      else{sl.addShape(ellipse,{x:9.2,y:.85,w:3.1,h:3.1,line:{color:t.accent2,transparency:100},fill:{color:t.accent2,transparency:16}});sl.addShape(ellipse,{x:10.25,y:2.2,w:2.1,h:2.1,line:{color:t.accent,transparency:100},fill:{color:t.accent,transparency:22}})}
      addText(sl,s.title,{x:.72,y:1.55,w:img?7.0:11.1,h:1.6,fontSize:40,bold:true,color:t.ink,breakLine:false});
      addText(sl,s.subtitle,{x:.75,y:3.35,w:img?6.45:8.8,h:1.05,fontSize:18,color:t.muted,valign:'top'});
    }else if(layout==='split'){
      addText(sl,s.title,{x:.72,y:1.15,w:6.0,h:1.25,fontSize:32,bold:true,color:t.ink});
      addText(sl,s.subtitle,{x:.75,y:2.55,w:5.7,h:1.2,fontSize:17,color:t.muted,valign:'top'});
      sl.addShape(round,{x:7.25,y:1.0,w:5.35,h:5.55,line:{color:t.ink,transparency:86},fill:{color:t.panel}});
      if(img)sl.addImage({data:img,x:7.35,y:1.1,w:5.15,h:5.35});
      else{addText(sl,items[0]?.[1]||clean(s.visualType)||'Key visual',{x:7.7,y:2.35,w:4.4,h:.7,fontSize:24,bold:true,color:t.ink,align:'center'});addText(sl,items[0]?.[2]||clean(s.visualBrief),{x:7.75,y:3.2,w:4.3,h:1.25,fontSize:14,color:t.muted,align:'center',valign:'top'})}
    }else if(layout==='quote'||layout==='statement'){
      addText(sl,'“'+clean(s.title)+'”',{x:1.05,y:1.65,w:11.2,h:2.75,fontSize:34,bold:true,color:t.ink,align:'center',valign:'mid'});
      addText(sl,s.subtitle,{x:3.1,y:4.75,w:7.2,h:.55,fontSize:15,color:t.accent,align:'center'});
    }else if(layout==='compare'){
      addText(sl,s.title,{x:.72,y:.92,w:11.8,h:.7,fontSize:29,bold:true,color:t.ink});
      addText(sl,s.subtitle,{x:.75,y:1.65,w:11.4,h:.55,fontSize:14,color:t.muted});
      [0,1].forEach(j=>{const x=j?6.85:.72,entry=items[j]||[];sl.addShape(round,{x,y:2.45,w:5.75,h:3.55,line:{color:t.ink,transparency:88},fill:{color:t.panel}});addText(sl,entry[1]||(j?'Perspective B':'Perspective A'),{x:x+.35,y:2.82,w:5.05,h:.65,fontSize:22,bold:true,color:j?t.accent2:t.accent});addText(sl,entry[2],{x:x+.35,y:3.7,w:5.0,h:1.65,fontSize:15,color:t.muted,valign:'top'})});
      addText(sl,'VS',{x:6.25,y:3.65,w:.45,h:.45,fontSize:10,bold:true,color:t.accent,align:'center'});
    }else if(layout==='stats'){
      addText(sl,s.title,{x:.72,y:.88,w:11.8,h:.72,fontSize:29,bold:true,color:t.ink});addText(sl,s.subtitle,{x:.75,y:1.63,w:11.5,h:.55,fontSize:14,color:t.muted});
      const cols=Math.max(1,Math.min(4,items.length||1)),w=(11.85-(cols-1)*.22)/cols;
      (items.length?items:[['—','Key figure','']]).forEach((it,j)=>{const x=.72+j*(w+.22);sl.addShape(round,{x,y:2.45,w,h:3.2,line:{color:t.ink,transparency:88},fill:{color:t.panel}});addText(sl,it[0],{x:x+.28,y:2.82,w:w-.56,h:.75,fontSize:31,bold:true,color:t.accent});addText(sl,it[1],{x:x+.28,y:3.75,w:w-.56,h:.5,fontSize:14,bold:true,color:t.ink});addText(sl,it[2],{x:x+.28,y:4.4,w:w-.56,h:.75,fontSize:11,color:t.muted,valign:'top'})});
    }else if(layout==='timeline'){
      addText(sl,s.title,{x:.72,y:.86,w:11.8,h:.72,fontSize:29,bold:true,color:t.ink});addText(sl,s.subtitle,{x:.75,y:1.62,w:11.5,h:.55,fontSize:14,color:t.muted});
      const n=Math.max(1,items.length),start=.95,end=12.25,step=n>1?(end-start)/(n-1):0;sl.addShape(line,{x:start,y:3.65,w:end-start,h:0,line:{color:t.accent2,width:2}});
      items.forEach((it,j)=>{const x=start+j*step;sl.addShape(ellipse,{x:x-.12,y:3.53,w:.24,h:.24,line:{color:t.accent,transparency:100},fill:{color:t.accent}});addText(sl,it[0],{x:x-.55,y:2.72,w:1.1,h:.4,fontSize:10,bold:true,color:t.accent,align:'center'});addText(sl,it[1],{x:x-.95,y:4.05,w:1.9,h:.55,fontSize:12,bold:true,color:t.ink,align:'center'});addText(sl,it[2],{x:x-1.0,y:4.62,w:2.0,h:.85,fontSize:9,color:t.muted,align:'center',valign:'top'})});
    }else{
      addText(sl,s.title,{x:.72,y:.86,w:11.8,h:.72,fontSize:29,bold:true,color:t.ink});addText(sl,s.subtitle,{x:.75,y:1.62,w:11.5,h:.55,fontSize:14,color:t.muted});
      const rows=items.length||1,cols=rows<=2?rows:rows<=4?2:2,w=cols===1?11.7:5.72,h=rows<=2?3.35:1.62;
      (items.length?items:[['01','Key idea','']]).forEach((it,j)=>{const col=j%cols,row=Math.floor(j/cols),x=.72+col*(w+.28),y=2.35+row*(h+.18);sl.addShape(round,{x,y,w,h,line:{color:t.ink,transparency:88},fill:{color:t.panel}});addText(sl,it[0],{x:x+.25,y:y+.25,w:.65,h:.28,fontSize:8,bold:true,color:t.accent});addText(sl,it[1],{x:x+.25,y:y+.72,w:w-.5,h:.5,fontSize:15,bold:true,color:t.ink});addText(sl,it[2],{x:x+.25,y:y+1.3,w:w-.5,h:Math.max(.42,h-1.55),fontSize:10.5,color:t.muted,valign:'top'})});
    }
    const refs=(s.sourceRefs||[]).filter(Boolean).slice(0,4);if(refs.length)addText(sl,'Sources: '+refs.join(' · '),{x:.75,y:7.12,w:11.8,h:.22,fontSize:6.5,color:t.muted});
    if(clean(s.speakerNotes))sl.addNotes(clean(s.speakerNotes));
    addText(sl,String(i+1).padStart(2,'0'),{x:12.35,y:.35,w:.35,h:.22,fontSize:7,color:t.muted,align:'right'});
  }
  const out=await pptx.write({outputType:'nodebuffer',compression:true});
  return Buffer.isBuffer(out)?out:Buffer.from(out);
}

async function presentationPdf(body){
  const mod=await import('pdfkit'),PDFDocument=mod.default||mod;
  const deck=body?.deck||{},media=body?.media||{},t=theme(deck.theme);
  return await new Promise((resolve,reject)=>{
    const doc=new PDFDocument({autoFirstPage:false,size:[960,540],margin:0,info:{Title:clean(deck.name)||'SCHOLARK Presentation',Author:'SCHOLARK'}});
    const chunks=[];doc.on('data',d=>chunks.push(d));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);
    for(const [i,s] of (deck.slides||[]).entries()){
      doc.addPage({size:[960,540],margin:0});doc.rect(0,0,960,540).fill('#'+t.bg);
      const ink='#'+t.ink,muted='#'+t.muted,accent='#'+t.accent,panel='#'+t.panel,img=dataBuffer(media[s.id]);
      doc.fillColor(accent).font('Helvetica-Bold').fontSize(8).text(clean(s.kicker)||'SCHOLARK',54,30,{width:180,characterSpacing:1.3});
      const layout=clean(s.layout)||'cards',items=itemRows(s);
      if(layout==='hero'){
        if(img){try{doc.roundedRect(610,55,300,420,18).clip().image(img,610,55,{width:300,height:420,fit:[300,420],align:'center',valign:'center'});doc.restore()}catch{}}
        doc.fillColor(ink).font('Helvetica-Bold').fontSize(34).text(clean(s.title),54,120,{width:img?500:800,height:120});
        doc.fillColor(muted).font('Helvetica').fontSize(16).text(clean(s.subtitle),54,260,{width:img?465:650,height:100});
      }else if(layout==='split'){
        doc.fillColor(ink).font('Helvetica-Bold').fontSize(29).text(clean(s.title),54,90,{width:430,height:95});doc.fillColor(muted).font('Helvetica').fontSize(15).text(clean(s.subtitle),54,205,{width:420,height:110});
        doc.roundedRect(525,75,380,385,18).fill(panel);if(img){try{doc.image(img,535,85,{width:360,height:365,fit:[360,365],align:'center',valign:'center'})}catch{}}
      }else if(layout==='quote'||layout==='statement'){
        doc.fillColor(ink).font('Helvetica-Bold').fontSize(29).text('“'+clean(s.title)+'”',110,150,{width:740,height:180,align:'center',valign:'center'});doc.fillColor(accent).font('Helvetica').fontSize(13).text(clean(s.subtitle),220,360,{width:520,align:'center'});
      }else{
        doc.fillColor(ink).font('Helvetica-Bold').fontSize(27).text(clean(s.title),54,67,{width:845,height:55});doc.fillColor(muted).font('Helvetica').fontSize(13).text(clean(s.subtitle),54,125,{width:830,height:50});
        const data=items.length?items:[['01','Key idea','']],cols=data.length<=2?data.length:2,w=cols===1?840:405,h=data.length<=2?220:105;
        data.forEach((it,j)=>{const col=j%cols,row=Math.floor(j/cols),x=54+col*(w+30),y=195+row*(h+14);doc.roundedRect(x,y,w,h,12).fill(panel);doc.fillColor(accent).font('Helvetica-Bold').fontSize(8).text(it[0],x+18,y+16,{width:50});doc.fillColor(ink).font('Helvetica-Bold').fontSize(14).text(it[1],x+18,y+44,{width:w-36,height:35});doc.fillColor(muted).font('Helvetica').fontSize(10).text(it[2],x+18,y+84,{width:w-36,height:Math.max(20,h-95)})});
      }
      const refs=(s.sourceRefs||[]).filter(Boolean).slice(0,3);if(refs.length)doc.fillColor(muted).font('Helvetica').fontSize(5.7).text('Sources: '+refs.join(' · '),54,512,{width:820,height:14});
      doc.fillColor(muted).font('Helvetica').fontSize(7).text(String(i+1).padStart(2,'0'),890,28,{width:30,align:'right'});
    }
    doc.end();
  });
}

function documentSections(body){
  if(body?.kind==='book'){
    const b=body.book||{},plan=b.plan||{},chapters=plan.sections||[];
    return {title:b.name||plan.title||'Untitled book',summary:plan.summary||b.concept||'',sections:chapters.map((ch,i)=>{const d=b.drafts?.[i];return {title:'Chapter '+(i+1)+': '+clean(ch.title),paragraphs:d?(d.sections||[]).flatMap(x=>[clean(x.title),String(x.body||'').trim()]):[clean(ch.body||ch.subtitle)]}}),sources:[]};
  }
  const a=body?.artifact||{},items=a.items||[];
  return {title:a.name||a.title||'SCHOLARK Document',summary:a.summary||a.prompt||'',sections:items.map(x=>({title:clean(x.title),paragraphs:Array.isArray(x.body)?x.body.map(v=>String(v||'').trim()).filter(Boolean):[String(x.body||'').trim()].filter(Boolean),sources:x.sourceRefs||[]})),sources:a.sources||[]};
}

async function documentDocx(body){
  const d=await import('docx');
  const {Document,Packer,Paragraph,TextRun,HeadingLevel,PageBreak,AlignmentType,Header,Footer,PageNumber,NumberFormat,TableOfContents,BorderStyle}=d;
  const x=documentSections(body),children=[],isBook=body?.kind==='book';
  const allRefs=[...(x.sources||[])];

  // Cover page
  children.push(new Paragraph({spacing:{before:1800,after:220},alignment:AlignmentType.CENTER,children:[new TextRun({text:x.title,bold:true,size:42,color:'17191F'})]}));
  children.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:320},children:[new TextRun({text:isBook?'SCHOLARK BOOK MANUSCRIPT':'SCHOLARK DOCUMENT',bold:true,size:18,color:'6D5DFC',characterSpacing:80})]}));
  if(x.summary)children.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:180,after:300},children:[new TextRun({text:x.summary,italics:true,size:22,color:'666666'})]}));
  children.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:620},children:[new TextRun({text:'Created in SCHOLARK',size:18,color:'888888'})]}));
  children.push(new Paragraph({children:[new PageBreak()]}));

  // Word-native table of contents. Word updates the fields when the file is opened.
  children.push(new Paragraph({text:'Contents',heading:HeadingLevel.HEADING_1,spacing:{after:180}}));
  children.push(new TableOfContents('Contents',{hyperlink:true,headingStyleRange:'1-3'}));
  children.push(new Paragraph({children:[new PageBreak()]}));

  x.sections.forEach((s,i)=>{
    if(i>0&&isBook)children.push(new Paragraph({children:[new PageBreak()]}));
    children.push(new Paragraph({
      text:s.title||('Section '+(i+1)),
      heading:HeadingLevel.HEADING_1,
      spacing:{before:220,after:130},
      keepNext:true
    }));
    (s.paragraphs||[]).filter(Boolean).forEach((p,j)=>{
      const raw=String(p).trim();
      const looksSubheading=j>0&&raw.length<90&&!/[.!?]$/.test(raw)&&raw.split(/\s+/).length<=12;
      if(looksSubheading){
        children.push(new Paragraph({text:raw,heading:HeadingLevel.HEADING_2,spacing:{before:180,after:90},keepNext:true}));
      }else{
        children.push(new Paragraph({
          children:[new TextRun({text:raw,size:22,color:'2E2E33'})],
          spacing:{after:150,line:320},
          widowControl:true
        }));
      }
    });
    const refs=(s.sources||[]).filter(Boolean);
    if(refs.length){
      children.push(new Paragraph({text:'Sources',heading:HeadingLevel.HEADING_2,spacing:{before:160,after:80}}));
      refs.forEach(r=>{
        allRefs.push(r);
        children.push(new Paragraph({children:[new TextRun({text:String(r),size:18,color:'55555F'})],bullet:{level:0},spacing:{after:65}}));
      });
    }
  });

  const uniqueRefs=[...new Set(allRefs.map(r=>typeof r==='string'?r:clean(r?.title||r?.url||JSON.stringify(r))).map(clean).filter(Boolean))];
  if(uniqueRefs.length){
    children.push(new Paragraph({children:[new PageBreak()]}));
    children.push(new Paragraph({text:'References',heading:HeadingLevel.HEADING_1,spacing:{after:150}}));
    uniqueRefs.forEach(r=>children.push(new Paragraph({children:[new TextRun({text:r,size:19,color:'44444C'})],bullet:{level:0},spacing:{after:80}})));
  }

  const header=new Header({children:[new Paragraph({
    border:{bottom:{color:'D9D9E3',space:5,style:BorderStyle.SINGLE,size:4}},
    children:[new TextRun({text:x.title,bold:true,size:16,color:'68646F'})],
    spacing:{after:80}
  })]});
  const footer=new Footer({children:[new Paragraph({
    alignment:AlignmentType.CENTER,
    border:{top:{color:'E2E0E8',space:5,style:BorderStyle.SINGLE,size:3}},
    children:[new TextRun({text:'SCHOLARK  ·  Page ',size:16,color:'77727D'}),new TextRun({children:[PageNumber.CURRENT],size:16,color:'77727D'}),new TextRun({text:' of ',size:16,color:'77727D'}),new TextRun({children:[PageNumber.TOTAL_PAGES],size:16,color:'77727D'})]
  })]});

  const doc=new Document({
    creator:'SCHOLARK',
    title:x.title,
    description:x.summary,
    features:{updateFields:true},
    styles:{
      default:{document:{run:{font:'Aptos',size:22,color:'2E2E33'},paragraph:{spacing:{line:320}}}},
      paragraphStyles:[
        {id:'Title',name:'Title',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Aptos Display',size:42,bold:true,color:'17191F'}},
        {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Aptos Display',size:30,bold:true,color:'17191F'},paragraph:{spacing:{before:240,after:120},outlineLevel:0}},
        {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{font:'Aptos Display',size:24,bold:true,color:'4D4756'},paragraph:{spacing:{before:180,after:90},outlineLevel:1}}
      ]
    },
    sections:[{
      properties:{page:{margin:{top:900,right:900,bottom:900,left:900},pageNumbers:{start:1,formatType:NumberFormat.DECIMAL}}},
      headers:{default:header},
      footers:{default:footer},
      children
    }]
  });
  return await Packer.toBuffer(doc);
}

async function documentPdf(body){
  const mod=await import('pdfkit'),PDFDocument=mod.default||mod,x=documentSections(body);
  return await new Promise((resolve,reject)=>{
    const doc=new PDFDocument({size:'A4',margin:58,info:{Title:x.title,Author:'SCHOLARK'}}),chunks=[];doc.on('data',d=>chunks.push(d));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);
    doc.font('Helvetica-Bold').fontSize(24).fillColor('#17191F').text(x.title,{align:'left'});if(x.summary){doc.moveDown(.6);doc.font('Helvetica-Oblique').fontSize(11).fillColor('#666666').text(x.summary,{lineGap:3})}
    x.sections.forEach((s,i)=>{if(body?.kind==='book'&&i>0)doc.addPage();else doc.moveDown(1);doc.font('Helvetica-Bold').fontSize(17).fillColor('#17191F').text(s.title||('Section '+(i+1)));doc.moveDown(.45);(s.paragraphs||[]).filter(Boolean).forEach(p=>{doc.font('Helvetica').fontSize(10.5).fillColor('#333333').text(String(p),{lineGap:3});doc.moveDown(.55)});const refs=(s.sources||[]).filter(Boolean);if(refs.length){doc.font('Helvetica-Bold').fontSize(9).text('Sources');refs.forEach(r=>doc.font('Helvetica').fontSize(8).fillColor('#666666').text('• '+r))}});
    if((x.sources||[]).length){doc.addPage();doc.font('Helvetica-Bold').fontSize(17).fillColor('#17191F').text('References');doc.moveDown();x.sources.forEach(r=>doc.font('Helvetica').fontSize(9).fillColor('#444444').text('• '+(typeof r==='string'?r:clean(r?.title||r?.url||JSON.stringify(r))),{lineGap:2}))}
    doc.end();
  });
}

async function mediaZip(body){
  const mod=await import('jszip'),JSZip=mod.default||mod,zip=new JSZip();let count=0;
  for(const f of (body?.files||[]).slice(0,60)){const data=safeImageData(f?.data);if(!data)continue;const b=dataBuffer(data);if(!b)continue;const ext=data.startsWith('data:image/png')?'png':'jpg';zip.file(safeName(f?.name||('asset-'+(count+1)))+'.'+ext,b);count++}
  if(!count){const e=new Error('No safe images supplied for ZIP export');e.code='NO_MEDIA';throw e}
  return await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}});
}
async function mediaPdf(body){
  const mod=await import('pdfkit'),PDFDocument=mod.default||mod,files=(body?.files||[]).slice(0,60).map(f=>({name:safeName(f?.name||'asset'),buffer:dataBuffer(f?.data)})).filter(x=>x.buffer);
  if(!files.length){const e=new Error('No safe images supplied for PDF export');e.code='NO_MEDIA';throw e}
  return await new Promise((resolve,reject)=>{const doc=new PDFDocument({autoFirstPage:false,margin:0}),chunks=[];doc.on('data',d=>chunks.push(d));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);for(const f of files){doc.addPage({size:[810,1012.5],margin:0});try{doc.image(f.buffer,0,0,{width:810,height:1012.5,fit:[810,1012.5],align:'center',valign:'center'})}catch{}}doc.end()});
}

async function exportSelftest(){
  const deck={id:'selftest',name:'SCHOLARK Export Self-Test',theme:'editorial',prompt:'Verify export engines',slides:[
    {id:'s1',layout:'hero',kicker:'SCHOLARK',title:'Export engine ready',subtitle:'This file is generated entirely in memory.',items:[],speakerNotes:'Self-test speaker note.',sourceRefs:[]},
    {id:'s2',layout:'cards',kicker:'QA',title:'Structured output',subtitle:'PPTX, PDF and DOCX should all produce non-empty buffers.',items:[['01','PowerPoint','Editable deck'],['02','PDF','Portable output']],speakerNotes:'Second self-test note.',sourceRefs:[]}
  ]};
  const artifact={id:'doc-selftest',mode:'document',name:'SCHOLARK Document Self-Test',summary:'Verifies Word export structure.',prompt:'Self test',items:[{id:'a1',title:'Introduction',body:['This paragraph verifies the document body.','Quality controls'],sourceRefs:[]},{id:'a2',title:'Conclusion',body:['The export engine produced a real document structure.'],sourceRefs:[]}]};
  const [pptx,pdf,docx]=await Promise.all([presentationPptx({deck,media:{}}),presentationPdf({deck,media:{}}),documentDocx({kind:'document',artifact})]);
  const ok=pptx.length>3000&&pdf.length>1000&&docx.length>3000;
  return {ok,pptxBytes:pptx.length,pdfBytes:pdf.length,docxBytes:docx.length};
}

http.Server.prototype.emit=function(type,...args){
  if(type!=='request')return originalEmit.call(this,type,...args);
  const [req,res]=args;
  try{
    const url=new URL(req.url||'/','http://localhost');
    if(req.method==='GET'&&url.pathname==='/api/export/health'){json(res,200,{ok:true,pptx:true,pdf:true,docx:true});return true}
    if(req.method==='GET'&&url.pathname==='/api/export/selftest'){exportSelftest().then(x=>json(res,x.ok?200:500,x)).catch(e=>json(res,500,{ok:false,code:'EXPORT_SELFTEST_FAILED',error:String(e?.message||e)}));return true}
    const routes={
      '/api/export/presentation/pptx':async b=>({buffer:await presentationPptx(b),type:'application/vnd.openxmlformats-officedocument.presentationml.presentation',name:safeName(b?.deck?.name,'scholark-presentation')+'.pptx'}),
      '/api/export/presentation/pdf':async b=>({buffer:await presentationPdf(b),type:'application/pdf',name:safeName(b?.deck?.name,'scholark-presentation')+'.pdf'}),
      '/api/export/document/docx':async b=>({buffer:await documentDocx(b),type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',name:safeName(b?.artifact?.name||b?.book?.name,'scholark-document')+'.docx'}),
      '/api/export/document/pdf':async b=>({buffer:await documentPdf(b),type:'application/pdf',name:safeName(b?.artifact?.name||b?.book?.name,'scholark-document')+'.pdf'}),
      '/api/export/media/zip':async b=>({buffer:await mediaZip(b),type:'application/zip',name:safeName(b?.name,'scholark-visuals')+'.zip'}),
      '/api/export/media/pdf':async b=>({buffer:await mediaPdf(b),type:'application/pdf',name:safeName(b?.name,'scholark-visuals')+'.pdf'})
    };
    if(req.method==='POST'&&routes[url.pathname]){
      readBody(req).then(routes[url.pathname]).then(out=>sendBuffer(res,out.buffer,out.type,out.name)).catch(error=>{const code=error?.code||'EXPORT_FAILED';json(res,code==='PAYLOAD_TOO_LARGE'?413:code==='INVALID_JSON'?400:500,{ok:false,code,error:String(error?.message||error)})});return true;
    }
  }catch(error){json(res,500,{ok:false,code:'EXPORT_ROUTE_ERROR',error:String(error?.message||error)});return true}
  return originalEmit.call(this,type,...args);
};
