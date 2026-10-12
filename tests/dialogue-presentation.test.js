import test from 'node:test';
import assert from 'node:assert/strict';
import {dialoguePresentation} from '../src/dialogue-presentation.js';
test('three distinguishable accessible portraits',()=>{
 const results=['manel','clara','nuria'].map(id=>dialoguePresentation(id));
 assert.equal(new Set(results.map(r=>r.initials)).size,3);
 for(const result of results)assert.match(result.portraitLabel,/Retrato ilustrado/);
});
test('dialogue presentation differentiates evidence, decisions and resolved stories',()=>{
 assert.equal(dialoguePresentation('clara','evidence').mood,'evidence');
 assert.equal(dialoguePresentation('clara','person','found').mood,'decision');
 assert.equal(dialoguePresentation('clara','person','done').mood,'resolved');
});
test('unrecognized records and journal produce a safe neutral portrait',()=>{
 assert.equal(dialoguePresentation('__proto__').character,'journal');
 assert.equal(dialoguePresentation('manel','journal').character,'journal');
});
