import test from 'node:test';
import assert from 'node:assert/strict';
import {roadPath,roadDistance,graphStats} from '../src/road-network.js';
import {stepUrbanContacts} from '../src/urban-collisions.js';
import {createPolice,stepPolice} from '../src/police.js';
test('street graph creates deterministic connected routes',()=>{
 const a=roadPath(5,132,96,-22);assert.ok(a.length>=2);assert.deepEqual(a,roadPath(5,132,96,-22));assert.ok(graphStats().nodes>20);
});
test('patrol stays on streets during chase',()=>{
 const p=createPolice(),driver={x:5,z:132,kmh:100};for(let i=0;i<240;i++)stepPolice(p,1/60,driver);
 driver.x=96;driver.z=-22;for(let i=0;i<900;i++){stepPolice(p,1/60,driver);assert.ok(roadDistance(p.agent.x,p.agent.z)<10,`off-road ${i}`);}
});
test('urban collision dampens speed and has a cooldown',()=>{
 const p={x:0,z:0,speed:20,vx:20,vz:0,yaw:0};const npc=[{x:1,z:0}];const a=stepUrbanContacts(p,npc,1/60);
 assert.equal(a.contacts,1);assert.ok(p.speed<20);assert.equal(stepUrbanContacts(p,npc,1/60).contacts,0);
});
test('no contact at safe separation',()=>{assert.equal(stepUrbanContacts({x:0,z:0,speed:10},[{x:30,z:30}],1/60).contacts,0);});
