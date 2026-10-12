import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,FACADE_DEPTH_116} from '../src/city.js';
import {architecturalScaleValid,ART_SCALE} from '../src/art-direction.js';
test('11.6 conserva los nueve portales, ocho entradas y proporción de puertas',()=>{
 assert.deepEqual(FACADE_DEPTH_116,{graciaPortals:9,carmelEntrances:8,graciaRoofEdges:9});
 assert.equal(architecturalScaleValid(ART_SCALE.doorHeight,ART_SCALE.doorWidth),true);
 assert.equal(CITY.streets.length,39);
});
test('11.6 geometría urbana generada con relieve dentro del presupuesto ampliado',()=>{
 const mesh=buildCity();assert.ok(mesh.count>350199,'must add real geometry');
 assert.ok(mesh.count<400000,'keep bounded');
 assert.ok(mesh.positions.every(Number.isFinite));
});
