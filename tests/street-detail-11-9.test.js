import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,nearestStreet,STREET_DETAIL_119,streetDetailPlacement} from '../src/city.js';
test('11.9 decorative fixtures stay outside driving lanes',()=>{
 assert.equal(STREET_DETAIL_119.length,10);
 for(const entry of STREET_DETAIL_119){
  const p=streetDetailPlacement(entry);
  assert.ok([p.x,p.y,p.z].every(Number.isFinite));
  assert.ok(nearestStreet(p.x,p.z).distance>=CITY.roadHalf+2,JSON.stringify(entry));
 }
});
test('11.9 urban mesh includes the new fixtures without changing streets',()=>{
 assert.equal(CITY.streets.length,39);
 const mesh=buildCity();
 assert.ok(mesh.count>355713&&mesh.count<400000,`vertices ${mesh.count}`);
 assert.equal(mesh.positions.length,mesh.count*3);
});
