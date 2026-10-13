import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CARMEL_VISUAL_PASS_1123,CITY,cityStartPose} from '../src/city.js';

test('Fase 11.23 añade identidad de fachada a ocho viviendas del Carmel sin superar presupuesto',()=>{
 assert.deepEqual({...CARMEL_VISUAL_PASS_1123},{houses:8,shopSigns:3,street:'El Carmel · 1984'});
 const city=buildCity();
 assert.ok(city.count>365000,`fachadas presentes y terreno distante optimizado: ${city.count}`);
 assert.ok(city.count<400000,`presupuesto existente: ${city.count}`);
 assert.ok(city.positions.every(Number.isFinite));
 assert.ok(city.colors.every(Number.isFinite));
});

test('Fase 11.23 conserva la red vial y la posición de salida urbana',()=>{
 assert.equal(CITY.streets.length,39);
 assert.equal(CITY.roadHalf,10.2);
 assert.deepEqual(cityStartPose(),{x:5,z:132,yaw:Math.PI/2});
});
