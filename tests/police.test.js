import test from 'node:test';
import assert from 'node:assert/strict';
import {createPolice,stepPolice} from '../src/police.js';
test('police activates after sustained dangerous driving',()=>{
 const p=createPolice(),driver={x:5,z:132,kmh:120};for(let n=0;n<190;n++)stepPolice(p,1/60,driver);
 assert.equal(p.active,true);assert.ok(Number.isFinite(p.agent.x));
});
test('police does not spawn for ordinary urban driving',()=>{
 const p=createPolice(),driver={x:5,z:132,kmh:45};for(let n=0;n<300;n++)stepPolice(p,1/60,driver);
 assert.equal(p.active,false);
});
test('capture requires low speed and sustained proximity',()=>{
 const p=createPolice(),driver={x:5,z:132,kmh:120};for(let n=0;n<200;n++)stepPolice(p,1/60,driver);
 driver.x=p.agent.x;driver.z=p.agent.z;driver.kmh=0;
 for(let n=0;n<250;n++){driver.x=p.agent.x;driver.z=p.agent.z;stepPolice(p,1/60,driver);}
 assert.equal(p.captured,true);
});
