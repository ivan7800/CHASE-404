import test from 'node:test';
import assert from 'node:assert/strict';
import {CITY,buildCity,nearestStreet,CARMEL_PANORAMA_1120} from '../src/city.js';
test('Carmel panorama lies outside driveable street envelope',()=>{
 const {x,z,terraces,arches,lamps}=CARMEL_PANORAMA_1120;
 assert.ok(nearestStreet(x,z).distance>CITY.sidewalkHalf+6);
 assert.equal(terraces,3);assert.equal(arches,4);assert.equal(lamps,3);
});
test('panorama preserves finite and bounded city geometry',()=>{
 const m=buildCity();
 assert.equal(m.positions.length,m.normals.length);
 assert.equal(m.positions.length,m.colors.length);
 assert.ok(m.count>367341&&m.count<390000,`city vertices ${m.count}`);
 for(const n of m.positions)assert.ok(Number.isFinite(n));
});
