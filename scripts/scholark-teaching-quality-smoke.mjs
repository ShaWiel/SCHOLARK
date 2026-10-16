import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const route=readFileSync('scholark-learning-route.mjs','utf8');
const tutor=readFileSync('scholark-v62-learning-ai.js','utf8');
const arki=readFileSync('scholark-v107-general-ai.js','utf8');
const welcome=readFileSync('scholark-v82-tutor-cloud.js','utf8');
for(const token of [
  'const TEACHING_DEPTH_STYLE=',
  'For educational questions in ANY school subject',
  'explain WHY every non-obvious transition is valid',
  'mnemonic / ezelsbruggetje',
  'chemistry -> balance atoms/charges',
  'history claim -> evidence',
  'programming -> example input',
  'Dutch SOH-CAH-TOA',
  'x=cos(α), y=sin(α)',
  'never claim tan(90°) exists',
  '√(a²)',
  "required:['answer','summary','steps','examples','rules','memoryAids'",
  "rules:{type:'array',items:{type:'string'}}",
  "memoryAids:{type:'array',items:{type:'string'}}",
  'Fill rules with the exact applicable formula',
  'Fill memoryAids with accurate subject-specific ezelsbruggetjes'
]) assert.ok(route.includes(token),'Teaching contract missing: '+token);
for(const token of [
  'const ARKI_CONVERSATION_STYLE=',
  'React to the SPECIFIC last message and relevant conversation history',
  'Match the user\'s language, register, informality and level of detail',
  'A simple greeting, thank-you, short follow-up or casual question deserves a short',
  'not as a scripted customer-service bot',
  'Do not fake memories, experiences, tool access or a human identity',
  'Leave suggestedFollowUps empty unless',
  '${ARKI_CONVERSATION_STYLE} ${TEACHING_DEPTH_STYLE} ${MATH_SOLUTION_STYLE}',
  'for a short question, explain naturally instead of enforcing a worksheet template'
]) assert.ok(route.includes(token),'ARKI natural response contract missing: '+token);
const shared='$'+'{TEACHING_DEPTH_STYLE} $'+'{MATH_SOLUTION_STYLE}';
assert.ok(route.split(shared).length===3,'Both ARKI and Tutor must receive teaching instructions');
assert.ok(arki.includes('Explain a school problem with every step, rules and a memory aid'),'ARKI example prompt missing');

const richStart=arki.indexOf('  function rich(s){'),richEnd=arki.indexOf('  function attachmentTags(',richStart);
assert.ok(richStart>=0&&richEnd>richStart,'ARKI safe response display renderer missing');
const htmlEscape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const richResponse=vm.runInNewContext(arki.slice(richStart,richEnd)+'\nrich',{esc:htmlEscape});
const humanHtml=richResponse('Ja, dat klopt. **Zo werkt het:**\n\nEerst kies je de formule.\n\nDaarna reken je verder.');
assert.ok(humanHtml.includes('<p>Ja, dat klopt. <strong>Zo werkt het:</strong></p>'),'Plain language and emphasis must render like a conversation');
assert.ok(humanHtml.includes('</p><p>Daarna reken je verder.</p>'),'Natural paragraphs must not collapse into a wall of text');
assert.ok(richResponse('- Stap één\n- Stap twee').includes('<li>Stap twee</li>'),'List formatting must stay readable for real instructions');
assert.ok(richResponse('1. Kies formule\n2. Werk uit').includes('<ol>'),'Numbered educational steps must be preserved');
assert.ok(richResponse('Antwoord: <img src=x onerror=alert(1)>').includes('&lt;img')&&!richResponse('Antwoord: <img src=x onerror=alert(1)>').includes('<img'),'AI output must remain HTML-escaped');
const codeHtml=richResponse('Probeer dit:\n\n```html\n<h1>Voorbeeld</h1>\n```');
assert.ok(codeHtml.includes('<pre><code>&lt;h1&gt;Voorbeeld&lt;/h1&gt;'),'In-chat HTML preview code must stay escaped in reply renderer');

assert.ok(welcome.includes('ezelsbruggetje'),'Tutor teaching affordance missing');
assert.ok(tutor.includes('Rules and why they apply')&&tutor.includes('Memory aids / Ezelsbruggetjes'),'Structured Tutor lesson sections missing');
assert.ok(route.includes("rules:['Use the actual assignment brief")&&route.includes("memoryAids:['5W+H"),'Test-mode assignment fields missing');
assert.ok(route.includes("rules:['Identify the exact rule")&&route.includes("memoryAids:['Understand → apply → check"),'Test-mode Tutor fields missing');

const start=tutor.indexOf('  function tutorList(items,ordered=false){'),end=tutor.indexOf('  function tutorOwner(){',start);
assert.ok(start>=0&&end>start,'Could not isolate Tutor lesson display functions');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const multiline=x=>String(x??'').replace(/\r\n?/g,'\n').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
const clean=x=>String(x??'').replace(/\s+/g,' ').trim();
const paragraphs=x=>multiline(x).split(/\n{2,}/).filter(Boolean).map(t=>'<p>'+esc(t).replace(/\n/g,'<br>')+'</p>').join('');
const list=(rows,numbered=false)=>'<'+(numbered?'ol':'ul')+'>'+(rows||[]).map(x=>'<li>'+esc(x)+'</li>').join('')+'</'+(numbered?'ol':'ul')+'>';
const api=vm.runInNewContext(tutor.slice(start,end)+'\n({tutorList,tutorPlain,tutorHtml})',{esc,multiline,clean,paragraphs,list});
const result={
  topic:'Trigonometrie',
  answer:'Gegeven: ∠A = 90°\nBC² = AB² + AC²\nBC = √(2a²) = a√2 (a ≥ 0)',
  summary:'Gelijkbenige rechthoekige driehoek.',
  rules:['Pythagoras: twee rechthoekszijden in het kwadraat opgeteld zijn het kwadraat van de hypotenusa.'],
  steps:['Herken de hoek van 90°.','Vul beide rechthoekszijden a in.','Bereken BC² = 2a², dus BC = a√2 voor a ≥ 0.'],
  memoryAids:['SOS-CAS-TOA: sinus = overstaand/schuin, cosinus = aanliggend/schuin, tangens = overstaand/aanliggend.'],
  examples:[{title:'45°–45°–90°',setup:'AB = AC = 4',walkthrough:'BC² = 4² + 4²\nBC² = 32\nBC = 4√2',answer:'4√2'}],
  keyPoints:['Houd wortels exact.'],commonMistakes:['Hypotenusa verwarren met rechthoekszijde.'],
  checks:['Welke zijde is de hypotenusa?'],followUp:'Probeer a = 3.'
};
const plain=api.tutorPlain(result),html=api.tutorHtml(result,{});
assert.ok(plain.includes('Rules and why they apply:')&&plain.includes('Memory aids / ezelsbruggetjes:'),'Saved history must include mnemonics and rules');
assert.ok(html.includes('<h4>Rules and why they apply</h4>')&&html.includes('<h4>Memory aids / Ezelsbruggetjes</h4>'),'Tutor cards missing');
assert.ok(html.indexOf('Rules and why they apply')<html.indexOf('Step-by-step method'),'Rules should precede method');
assert.ok(html.includes('BC² = 4² + 4²<br>BC² = 32<br>BC = 4√2'),'Calculation lines must be preserved');
assert.ok(!api.tutorHtml({...result,rules:[],memoryAids:[]},{}).includes('Ezelsbruggetjes'),'Empty mnemonics must not render');
const unsafe=api.tutorHtml({...result,rules:['<img src=x onerror=alert(1)>']},{});
assert.ok(unsafe.includes('&lt;img')&&!unsafe.includes('<img'),'Model output must be escaped');

const multilineExample={
  ...result,
  rules:['Pythagoras geldt voor rechthoekige driehoeken:\na² + b² = c²'],
  steps:['Gegeven: AB = AC = a\nBC² = a² + a²\nBC² = 2a²\nBC = a√2'],
  memoryAids:['SOS-CAS-TOA:\nSin = overstaand / schuin\nCos = aanliggend / schuin\nTan = overstaand / aanliggend']
};
const formatted=api.tutorHtml(multilineExample,{});
assert.ok(formatted.includes('a² + b² = c²'),'Multiline formula missing');
assert.ok(formatted.includes('BC² = a² + a²<br>BC² = 2a²<br>BC = a√2'),'Tutor must render each intermediate calculation on a separate line');
assert.ok(formatted.includes('SOS-CAS-TOA:<br>Sin = overstaand / schuin<br>Cos = aanliggend / schuin'),'Mnemonic definitions must keep their line breaks');
assert.ok(formatted.includes('<ol class="v62-tutor-list">'),'Tutor must keep method steps numbered');
const injection=api.tutorList(['x² < 9\n<img src=x onerror=alert(1)>'],true);
assert.ok(injection.includes('x² &lt; 9<br>&lt;img')&&!injection.includes('<img'),'Equation list rendering must escape AI-generated HTML');

// Verified gold-standard examples transcribed from the user's trig / root notes.
// These check the mathematical references and boundary cases; they do not
// claim to measure a real hosted model's responses.
const root2=Math.sqrt(2),root3=Math.sqrt(3),near=(a,b)=>Math.abs(a-b)<1e-12;
const deg=n=>n*Math.PI/180;
for(const [angle,sine,cosine] of [
  [0,0,1],[30,1/2,root3/2],[45,root2/2,root2/2],
  [60,root3/2,1/2],[90,1,0],
  [180,0,-1],[210,-1/2,-root3/2],[270,-1,0],
  [300,-root3/2,1/2],[360,0,1],
  [-90,-1,0],[-135,-root2/2,-root2/2],[-540,0,-1]
]){
  assert.ok(near(Math.sin(deg(angle)),sine),`sin(${angle}°) must equal the reference`);
  assert.ok(near(Math.cos(deg(angle)),cosine),`cos(${angle}°) must equal the reference`);
}
assert.ok(near(Math.sqrt(4**2+4**2),4*root2),'45-45-90 triangle a=4: hypotenuse 4√2');
assert.ok(near(Math.sqrt(1-(1/2)**2),root3/2),'30-60-90 triangle height √3/2');
assert.ok(near(4*Math.cos(deg(30))+9*Math.tan(deg(30)),5*root3),'Notebook example: 4cos30° + 9tan30° = 5√3');
assert.ok(near(3*Math.sin(deg(30))-root2*Math.sin(deg(45)),1/2),'Notebook example: 3sin30° - √2sin45° = 1/2');
assert.ok(near(Math.tan(deg(60)),root3)&&near(Math.tan(deg(30)),root3/3),'Exact tan(60°) and tan(30°)');
assert.ok(near(Math.sqrt((-7)**2),7)&&Math.sqrt((-7)**2)!==-7,'√(a²)=|a|, not a for negative a');
const exactTangent=(sin,cos)=>cos===0?null:sin/cos;
assert.equal(exactTangent(1,0),null,'tan(90°) is undefined because exact cosine is zero');
assert.equal(exactTangent(-1,0),null,'tan(270°) is undefined because exact cosine is zero');

assert.ok(near(Math.sin(Math.PI/6),1/2),'sin 30°');
assert.ok(near(Math.cos(Math.PI/6),Math.sqrt(3)/2),'cos 30°');
assert.ok(near(Math.sin(Math.PI/4),Math.SQRT1_2),'sin 45°');
assert.ok(near(Math.sqrt(4*4+4*4),4*Math.SQRT2),'Pythagoras 45° triangle');
assert.ok(near(Math.sin(Math.PI/3),Math.sqrt(3)/2),'sin 60°');
assert.ok(near(Math.cos(Math.PI/2),0),'cos 90°');
assert.equal(Math.sqrt((-3)**2),3,'sqrt(a²) is absolute value');
console.log('SCHOLAVERUM TEACHING QUALITY SMOKE PASS: prompt, schema, output, saved history, safety, math examples');
