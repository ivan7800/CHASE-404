import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CARS} from '../src/garage.js';
import {buildCar} from '../src/geometry.js';
import {buildVerenneV8} from '../src/hero-car.js';
import {decodeGLB} from '../src/glb.js';
const arrays=[];
for(const car of CARS){
 test(`Fase 11.10: ${car.id} GLB coincide con el modelo procedimental`,()=>{
  const expected=car.id==='blaze'?buildVerenneV8():buildCar(car);
  const file=new URL(`../assets/models/${car.id==='racer'?'racer-04':car.id}.glb`,import.meta.url);
  const raw=fs.readFileSync(file);const actual=decodeGLB(raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength));
  assert.equal(actual.count,expected.count);
  assert.deepEqual(actual.positions,expected.positions);
  assert.deepEqual(actual.colors,expected.colors);
  assert.ok(actual.count>2700);
  arrays.push(`${car.id}:${actual.count}`);
 });
}
test('Fase 11.10: las seis siluetas no comparten el mismo tamaño de malla',()=>{
 const counts=CARS.map(c=>c.id==='blaze'?buildVerenneV8().count:buildCar(c).count);
 assert.equal(new Set(counts).size,6);
});
