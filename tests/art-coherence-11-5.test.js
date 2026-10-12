import test from 'node:test';
import assert from 'node:assert/strict';
import {ART_SCALE,ART_PALETTE,architecturalScaleValid} from '../src/art-direction.js';
import {buildCity,CITY} from '../src/city.js';
import {GAEL_RIG,buildGaelMeshes} from '../src/gael-model.js';

test('las puertas de Carmel y Gràcia emplean proporciones compartidas con Gael',()=>{
 assert.ok(architecturalScaleValid(ART_SCALE.doorHeight,ART_SCALE.doorWidth));
 assert.ok(ART_SCALE.doorHeight>ART_SCALE.humanHeight);
 assert.ok(GAEL_RIG.shoulderY<ART_SCALE.doorHeight);
 for(const [height,width] of [[1.6,1],[4.8,2],[3,4],[NaN,2]])assert.equal(architecturalScaleValid(height,width),false);
});
test('paleta de materiales estable y mallas coherentes',()=>{
 for(const value of Object.values(ART_PALETTE)){
  assert.equal(value.length,3);assert.ok(value.every(x=>Number.isInteger(x)&&x>=0&&x<=255));
  assert.ok(Object.isFrozen(value));
 }
 const body=buildGaelMeshes();assert.ok(body.body.count>0);
 const city=buildCity();assert.ok(city.count>340000&&city.count<400000);
 assert.ok(city.positions.every(Number.isFinite));assert.equal(CITY.streets.length,39);
});
