import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

class Storage{
 constructor(){this.values=new Map()}
 getItem(k){return this.values.get(String(k))??null}
 setItem(k,v){this.values.set(String(k),String(v))}
 removeItem(k){this.values.delete(String(k))}
}
const localStorage=new Storage();
const sandbox={localStorage,Storage,console,Date,Map,Set,JSON,Math,Number,String,Array,Object,Promise,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},addEventListener(){},dispatchEvent(){},queueMicrotask(){},setTimeout(){return 1},clearTimeout(){},location:{hash:'#dashboard'}};
sandbox.window=sandbox;
vm.runInNewContext(fs.readFileSync(new URL('../scholark-v110-workspace-core.js',import.meta.url),'utf8'),sandbox);
const api=sandbox.__SCHOLARK_WORKSPACE_CORE__;
localStorage.setItem(api.keys.planner,JSON.stringify([null,42,'Review economics',{text:'Read chapter 2',status:'done'},{id:'dated',text:'Finished today',status:'done',completedAt:new Date().toISOString()}]));
localStorage.setItem(api.keys.goals,JSON.stringify([null,'Pass the exam',{text:'Read more'}]));
for(const key of ['mastery','assignments','flashcards','learningProjects','activity','focusHistory'])localStorage.setItem(api.keys[key],JSON.stringify([null,42,[],{id:'valid',text:'Saved record',topic:'Economics',title:'Chapter',front:'Q',back:'A',at:Date.now()}]));
const raw=localStorage.getItem(api.keys.planner);
const first=api.data.planner(),second=api.data.planner();
assert.equal(first.length,3,'invalid saved rows are ignored safely');
assert.equal(first[0].text,'Review economics','legacy text tasks retain their content');
assert.equal(first[0].id,second[0].id,'reading legacy tasks must not generate a different identity');
assert.equal(first[1].id,second[1].id,'missing object IDs remain stable across reads');
assert.equal(localStorage.getItem(api.keys.planner),raw,'reading does not rewrite saved data');
assert.equal(api.data.goals().length,2,'legacy text goals remain available');
const result=api.compute();
assert.equal(result.planner.completed7d,1,'undated completions must not count as work completed this week');
assert.equal(result.flashcards.all.length,1,'invalid card rows cannot crash context computation');
assert.equal(api.actions.completePlan(first[0].id,true)?.status,'done','a recovered task remains editable through its stable ID');
assert.equal(api.data.planner()[0].text,'Review economics','editing preserves the recovered task');
localStorage.setItem(api.keys.planner,JSON.stringify([null,'Legacy task',{text:'Another task'},{id:'legacy-plan-1',text:'Existing task'}]));
const recovered=api.data.planner();
assert.equal(new Set(recovered.map(x=>x.id)).size,recovered.length,'invalid rows and old IDs must not create identity collisions');
assert.equal(JSON.stringify(recovered.map(x=>x.id)),JSON.stringify(api.data.planner().map(x=>x.id)),'collision recovery is deterministic');
console.log('PASS r284 data integrity: malformed saved rows, stable legacy task IDs, non-mutating reads and honest completion metrics');
