import test from 'node:test';
import assert from 'node:assert/strict';
import {createCar,createUrbanCar,step} from '../src/physics.js';
import {applyImpact,tickDamage,damageCondition} from '../src/damage.js';
test('urban cars start undamaged; reset creates repaired car',()=>{const a=createUrbanCar();assert.equal(damageCondition(a).health,100);applyImpact(a,30);assert.ok(damageCondition(a).health<100);assert.equal(damageCondition(createUrbanCar()).health,100);});
test('impact cooldown prevents repetitive damage',()=>{const c=createUrbanCar();const d=applyImpact(c,30);assert.ok(d>0);assert.equal(applyImpact(c,30),0);tickDamage(c,.7);assert.ok(applyImpact(c,30)>0);});
test('invalid or low speed impacts do not damage',()=>{const c=createUrbanCar();assert.equal(applyImpact(c,NaN),0);assert.equal(applyImpact(c,2),0);assert.equal(applyImpact(createCar(),30),0);});
test('damage is bounded and weakens propulsion without affecting circuits',()=>{const a=createUrbanCar();a.damage=99;assert.ok(damageCondition(a).engine<.5);applyImpact(a,1000);assert.equal(damageCondition(a).health,0);const b=createCar();assert.equal(damageCondition(b).health,100);step(b,{throttle:true},1/120);assert.ok(b.speed>0);});
test('damaged urban cars have reduced acceleration',()=>{const fresh=createUrbanCar(),old=createUrbanCar();old.damage=80;for(let i=0;i<100;i++){step(fresh,{throttle:true},1/120);step(old,{throttle:true},1/120);}assert.ok(fresh.speed>old.speed);});
