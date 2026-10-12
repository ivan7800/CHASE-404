import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {CARS} from '../src/garage.js';
import {buildCar} from '../src/geometry.js';
import {buildVerenneV8} from '../src/hero-car.js';

const shader=fs.readFileSync(new URL('../src/renderer.js',import.meta.url),'utf8');
const countColor=(mesh,rgb)=>{let n=0;for(let i=0;i<mesh.colors.length;i+=3)if(mesh.colors[i]===rgb[0]&&mesh.colors[i+1]===rgb[1]&&mesh.colors[i+2]===rgb[2])n++;return n;};

test('Fase 11.11: shader separates chrome, glass and painted surfaces on vehicle-only pass',()=>{
 assert.match(shader,/if\(uMaterialType>0\.5\)/);
 assert.match(shader,/float chromeMask=/);
 assert.match(shader,/float glassMask=/);
 assert.match(shader,/float glassFresnel=/);
 assert.match(shader,/col=mix\(col,col\*\.70/);
 assert.match(shader,/pow\(ndoth,74\.0\)/);
});
test('Fase 11.11: all six cars contain the chrome palette used by shader',()=>{
 for(const c of CARS){
  const mesh=c.id==='blaze'?buildVerenneV8():buildCar(c);
  assert.ok(countColor(mesh,[205,199,176])>0,`${c.id} missing chrome`);
 }
});
test('Fase 11.11: lighting uniforms retain existing atmosphere and fog',()=>{
 for(const uniform of ['uSky','uSun','uSunDirection','uFogStart','uFogEnd','uLamps','uCameraPos'])assert.ok(shader.includes(uniform));
});
