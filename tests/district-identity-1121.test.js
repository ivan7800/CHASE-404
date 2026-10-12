import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,DISTRICT_IDENTITY_1121,CITY} from '../src/city.js';
test('Fase 11.21 incorpora cubiertas decoradas en tres distritos',()=>{
 assert.deepEqual({...DISTRICT_IDENTITY_1121},{eixample:12,port:7,montjuic:8});
 const mesh=buildCity();
 assert.ok(mesh.count>369114,`vértices: ${mesh.count}`);
 assert.ok(mesh.count<395000,`presupuesto geométrico: ${mesh.count}`);
});
test('Fase 11.21 conserva las 39 rutas de calles y el punto inicial',()=>{
 assert.equal(CITY.streets.length,39);
 assert.equal(CITY.roadHalf,10.2);
});
