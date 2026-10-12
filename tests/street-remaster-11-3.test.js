import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,nearestStreet,STREET_REMASTER_113,STREET_REMASTER_113_ANCHORS,streetArt113Position} from '../src/city.js';
test('fase 11.3 añade muros, pasos y señales sin salir del presupuesto geométrico',()=>{
 assert.deepEqual(STREET_REMASTER_113,{retainingWalls:10,stairFlights:4,streetSigns:8});
 const mesh=buildCity(); assert.ok(mesh.count>337257 && mesh.count<400000,`vértices ${mesh.count}`);
 assert.ok(mesh.positions.every(Number.isFinite)); assert.equal(mesh.normals.length,mesh.count*3);
});
test('anclajes mantienen los accesorios fuera de la calzada original',()=>{
 for(const a of STREET_REMASTER_113_ANCHORS){
  const {x,z,near:n}=streetArt113Position(a); assert.ok(n);
  assert.ok(nearestStreet(x,z).distance>CITY.roadHalf+1,`obstáculo cerca de vía: ${a.x},${a.z}`);
 }
 assert.equal(CITY.streets.length,39);
});
