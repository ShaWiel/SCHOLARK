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
const shared='$'+'{TEACHING_DEPTH_STYLE} $'+'{MATH_SOLUTION_STYLE}';
assert.ok(route.split(shared).length===3,'Both ARKI and Tutor must receive teaching instructions');
assert.ok(arki.includes('Explain a school problem with every step, rules and a memory aid'),'ARKI example prompt missing');
assert.ok(welcome.includes('ezelsbruggetje'),'Tutor teaching affordance missing');
assert.ok(tutor.includes('Rules and why they apply')&&tutor.includes('Memory aids / Ezelsbruggetjes'),'Structured Tutor lesson sections missing');
assert.ok(route.includes("rules:['Use the actual assignment brief")&&route.includes("memoryAids:['5W+H"),'Test-mode assignment fields missing');
assert.ok(route.includes("rules:['Identify the exact rule")&&route.includes("memoryAids:['Understand → apply → check"),'Test-mode Tutor fields missing');

const start=tutor.indexOf('  function tutorPlain(r){'),end=tutor.indexOf('  function readTutorHistory()',start);
assert.ok(start>=0&&end>start,'Could not isolate Tutor lesson display functions');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const multiline=x=>String(x??'').replace(/\r\n?/g,'\n').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
const clean=x=>String(x??'').replace(/\s+/g,' ').trim();
const paragraphs=x=>multiline(x).split(/\n{2,}/).filter(Boolean).map(t=>'<p>'+esc(t).replace(/\n/g,'<br>')+'</p>').join('');
const list=(rows,numbered=false)=>'<'+(numbered?'ol':'ul')+'>'+(rows||[]).map(x=>'<li>'+esc(x)+'</li>').join('')+'</'+(numbered?'ol':'ul')+'>';
const api=vm.runInNewContext(tutor.slice(start,end)+'\n({tutorPlain,tutorHtml})',{esc,multiline,clean,paragraphs,list});
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
const near=(a,b)=>Math.abs(a-b)<1e-12;
assert.ok(near(Math.sin(Math.PI/6),1/2),'sin 30°');
assert.ok(near(Math.cos(Math.PI/6),Math.sqrt(3)/2),'cos 30°');
assert.ok(near(Math.sin(Math.PI/4),Math.SQRT1_2),'sin 45°');
assert.ok(near(Math.sqrt(4*4+4*4),4*Math.SQRT2),'Pythagoras 45° triangle');
assert.ok(near(Math.sin(Math.PI/3),Math.sqrt(3)/2),'sin 60°');
assert.ok(near(Math.cos(Math.PI/2),0),'cos 90°');
assert.equal(Math.sqrt((-3)**2),3,'sqrt(a²) is absolute value');
console.log('SCHOLAVERUM TEACHING QUALITY SMOKE PASS: prompt, schema, output, saved history, safety, math examples');
