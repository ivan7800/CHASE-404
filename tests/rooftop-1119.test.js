import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,ROOFTOP_SILHOUETTES_1119,ROOFTOP_SILHOUETTE_SITES_1119,nearestStreet} from '../src/city.js';

test('rooftop pass covers distinct Carmel and Gracia buildings',()=>{
 assert.deepEqual(ROOFTOP_SILHOUETTES_1119,{gracia:9,carmel:8});
 for(const [zone,count] of Object.entries(ROOFTOP_SILHOUETTES_1119)){
  const sites=ROOFTOP_SILHOUETTE_SITES_1119[zone];
  assert.equal(sites.length,count);
  assert.equal(new Set(sites.map(p=>p.join(','))).size,count);
  for(const [x,z] of sites) assert.ok(Number.isFinite(nearestStreet(x,z).distance));
 }
});
test('city includes consistent finite geometry after silhouette pass',()=>{
 const mesh=buildCity();
 assert.equal(mesh.positions.length,mesh.normals.length);
 assert.equal(mesh.positions.length,mesh.colors.length);
 assert.equal(mesh.count*3,mesh.positions.length);
 assert.ok(mesh.count>350000&&mesh.count<400000,`Unexpected urban mesh: ${mesh.count}`);
 for(const v of mesh.positions)assert.ok(Number.isFinite(v));
});
test('rooftop additions do not alter city navigation contract',()=>{
 assert.equal(CITY.roadHalf,10.2);
 assert.equal(CITY.sidewalkHalf,14.2);
 assert.equal(CITY.streets.length,39);
});
