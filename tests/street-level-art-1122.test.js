import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,STREET_LEVEL_ART_1122} from '../src/city.js';
test('Fase 11.22 añade portales Eixample y portones industriales a nivel de calle',()=>{
 assert.deepEqual({...STREET_LEVEL_ART_1122},{eixampleEntrances:12,portBays:7});
 const {count,positions,colors}=buildCity();
 assert.ok(count>373425,`vertices ${count}`);
 assert.ok(count<400000,`presupuesto ${count}`);
 assert.equal(positions.length,count*3);
 assert.equal(colors.length,count*3);
});
test('Fase 11.22 no modifica red vial ni punto de aparición',()=>{
 assert.equal(CITY.streets.length,39);
 assert.equal(CITY.roadHalf,10.2);
});
