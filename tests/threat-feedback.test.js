import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {pursuitThreat,damageFeedback} from '../src/threat-feedback.js';
test('pursuit disabled when no patrol is active',()=>{assert.equal(pursuitThreat([{active:false,agent:{x:0,z:0}}],{x:0,z:0}).level,'none')});
test('pursuit warnings distinguish distance and nearest active patrol',()=>{const p=d=>({active:true,agent:{x:d,z:0}});assert.equal(pursuitThreat([p(90)],{x:0,z:0}).level,'approaching');assert.equal(pursuitThreat([p(90),p(35)],{x:0,z:0}).level,'high');assert.equal(pursuitThreat([p(10)],{x:0,z:0}).level,'critical')});
test('damage warning thresholds and bounds',()=>{assert.equal(damageFeedback({damage:0}).level,'good');assert.equal(damageFeedback({damage:30}).level,'worn');assert.equal(damageFeedback({damage:60}).level,'high');assert.equal(damageFeedback({damage:95}).level,'critical');assert.equal(damageFeedback({damage:300}).health,0)});
test('invalid patrol positions do not create false warnings',()=>assert.equal(pursuitThreat([{active:true,agent:{x:NaN,z:0}}],{x:0,z:0}).level,'none'));
