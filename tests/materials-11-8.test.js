import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,FACADE_MATERIAL_PASS_118,FACADE_MATERIALS_118} from '../src/city.js';
test('11.8 surface details cover defined homes without touching the road graph',()=>{
 assert.deepEqual(FACADE_MATERIAL_PASS_118,{gracia:9,carmel:8,nightWindows:18});
 assert.equal(CITY.streets.length,39);
 const mesh=buildCity();assert.ok(mesh.count>355713 && mesh.count<400000,`geometry budget ${mesh.count}`);
 assert.equal(mesh.count*3,mesh.positions.length);
 assert.ok(mesh.positions.every(Number.isFinite));
});
test('11.8 glazing uses night-emissive renderer palette',()=>{
 assert.deepEqual(FACADE_MATERIALS_118.litGlass,[207,166,92]);
 assert.ok(FACADE_MATERIALS_118.plaster.length>=3);
});
