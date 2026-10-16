import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const src=readFileSync('scholark-v99-home-foundation.js','utf8');
const a=src.indexOf('  function reloadPatchedLanguageMap(){');
const b=src.indexOf('\n  function repairHome(){',a);
assert.ok(a>=0 && b>a,'Home foundation bootstrap language callback missing');
const codeUnderTest=src.slice(a,b);

function runCase(initial,latest,ready='') {
  let current=initial,calls=[],timers=[];
  const context={
    code:()=>current,
    setTimeout:callback=>{timers.push(callback);return timers.length},
    window:{__SCHOLARK_I18N__:{changeLanguage:locale=>calls.push(locale)}},
    document:{documentElement:{dataset:{scholarkI18nReady:ready}}}
  };
  const boot=vm.runInNewContext('let cacheReloaded=false;\n'+codeUnderTest+'\nreloadPatchedLanguageMap',context);
  boot();
  current=latest;
  for(const callback of timers)callback();
  boot(); // the bootstrap must remain idempotent
  return {calls,timers:timers.length};
}
assert.equal(runCase('de','nl').calls.length,0,'An old German bootstrap timer must not overwrite newer Dutch');
assert.equal(runCase('de','ar').calls.length,0,'Old bootstrap must not overwrite Arabic');
assert.deepEqual(runCase('de','de').calls,['de'],'A still-current locale may be primed once');
assert.equal(runCase('de','de','de').calls.length,0,'Already-ready locale must not need a second switch');
assert.equal(runCase('en','en').timers,0,'English bootstrap does not schedule a switch');
console.log('SCHOLAVERUM r274 BOOTSTRAP RACE PASS: stale deferred locale blocked, current locale primed once');
