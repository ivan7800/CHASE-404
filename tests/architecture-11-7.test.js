import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,ARCHITECTURAL_PASS_117, CITY,nearestStreet} from '../src/city.js';
test('arquitectura 11.7 incorpora volumen real dentro del presupuesto',()=>{
 assert.deepEqual(ARCHITECTURAL_PASS_117,{graciaGalleries:9,carmelRooflines:8});
 const mesh=buildCity();assert.ok(mesh.count>353619 && mesh.count<400000,`vértices ${mesh.count}`);
 assert.equal(mesh.positions.length,mesh.count*3);assert.ok(mesh.positions.every(Number.isFinite));
});
test('el remaster no altera las 39 calles ni sus posiciones',()=>{
 assert.equal(CITY.streets.length,39);
 for(const [x,z] of [[-410,165],[-22,168],[-785,-340]])assert.ok(nearestStreet(x,z).distance<.001);
});
