import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,VISUAL_REMASTER_112,nearestStreet} from '../src/city.js';

test('fase 11.2 diferencia edificios del Carmel y Gràcia y conserva presupuesto geométrico',()=>{
 assert.deepEqual(VISUAL_REMASTER_112,{carmelHouses:8,graciaFacades:9,streetCorners:6});
 const mesh=buildCity();
 assert.ok(mesh.count>330000 && mesh.count<400000,`vértices: ${mesh.count}`);
 assert.ok(mesh.positions.every(Number.isFinite));
 assert.equal(mesh.count*3,mesh.normals.length);
 assert.equal(mesh.count*3,mesh.colors.length);
 const palette=new Set();for(let i=0;i<mesh.colors.length;i+=3)palette.add(`${mesh.colors[i]},${mesh.colors[i+1]},${mesh.colors[i+2]}`);
 for(const rgb of ['74,117,115','137,78,59','197,169,108','92,103,108'])assert.ok(palette.has(rgb),`falta material ${rgb}`);
});
test('la pasada artística no modifica calles, geometría de navegación ni su eje principal',()=>{
 assert.equal(CITY.streets.length,39);
 for(const [x,z] of [[-410,165],[-335,48],[-22,168],[106,132]]){
  const street=nearestStreet(x,z);assert.ok(street && street.distance<.001,`calle conservada ${x},${z}`);
 }
});
