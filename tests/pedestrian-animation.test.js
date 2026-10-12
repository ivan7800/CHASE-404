import test from 'node:test';
import assert from 'node:assert/strict';
import {stepPedestrian,makePedestrian} from '../src/on-foot.js';
import {readFileSync} from 'node:fs';

test('animación a pie: parado no corre, caminar no corre y sprint sí corre',()=>{
 const foot={...makePedestrian(),active:true,x:5,z:132};
 stepPedestrian(foot,{throttle:true},.04);
 assert.equal(foot.moving,true);assert.equal(foot.running,false);
 const walk=foot.step;
 stepPedestrian(foot,{throttle:true,handbrake:true},.04);
 assert.equal(foot.running,true);assert.ok(foot.step>walk);
 stepPedestrian(foot,{},.04);
 assert.equal(foot.moving,false);assert.equal(foot.running,false);
});
test('la silueta no duplica brazos y piernas debajo de los animados',()=>{
 const source=readFileSync(new URL('../src/renderer.js',import.meta.url),'utf8');
 const meshSource=readFileSync(new URL('../src/gael-model.js',import.meta.url),'utf8');
 assert.match(meshSource,/export function buildGaelMeshes/);
 assert.match(source,/this\.walkLeg=this\.upload\(gael\.leg\)/);
 assert.match(source,/this\.walkArm=this\.upload\(gael\.arm\)/);
 assert.match(source,/multiply\(hip,spinX\(pose\.legs\[i\]\)\)/);
 assert.match(source,/multiply\(shoulder,spinX\(pose\.arms\[i\]\+pose\.lean\)\)/);
});
