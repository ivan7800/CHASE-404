import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,ATMOSPHERE_114,ATMOSPHERE_114_ANCHORS,ambient114Placement,nearestStreet} from '../src/city.js';
test('11.4: mobiliario propio de cada barrio fuera de la calzada',()=>{
 assert.deepEqual(ATMOSPHERE_114,{carmelCorners:6,graciaShops:6,litWindows:18});
 assert.equal(ATMOSPHERE_114_ANCHORS.length,12);
 for(const anchor of ATMOSPHERE_114_ANCHORS){
  const pos=ambient114Placement(anchor);
  assert.ok(Number.isFinite(pos.x)&&Number.isFinite(pos.z));
  assert.ok(nearestStreet(pos.x,pos.z).distance>CITY.sidewalkHalf+2,`decoración sobre carretera ${JSON.stringify(anchor)}`);
 }
});
test('11.4: colores y malla urbana preparados para iluminación nocturna',()=>{
 const mesh=buildCity();
 assert.ok(mesh.count>337257&&mesh.count<400000,`vértices: ${mesh.count}`);
 assert.ok(mesh.positions.every(Number.isFinite));
 assert.ok(mesh.colors.some((v,i)=>i%3===0&&v===207&&mesh.colors[i+1]===166&&mesh.colors[i+2]===92));
});
