import test from 'node:test';
import assert from 'node:assert/strict';
import {buildGaelMeshes,gaelGaitPose} from '../src/gael-model.js';
import {readFileSync} from 'node:fs';

test('rodillas y codos: las mallas inferiores tienen geometría independiente',()=>{
 const m=buildGaelMeshes();
 for(const part of ['leg','shin','arm','forearm'])assert.ok(m[part].positions.length>0,part);
});
test('en reposo la postura es neutra, sin flexión de rodilla',()=>{
 const pose=gaelGaitPose();assert.deepEqual(pose.knees,[0,0]);assert.deepEqual(pose.legs,[0,0]);
});
test('la flexión se alterna y nunca hiperextiende la rodilla',()=>{
 for(const phase of [-3,-2,-1,0,1,2,3]){
  const p=gaelGaitPose({moving:true,phase});
  assert.ok(p.knees.every(v=>v>=0&&v<=.58));
  assert.ok(p.elbows.every(v=>v>=0&&v<=.44));
 }
});
test('la carrera aumenta la flexión de recuperación',()=>{
 const walk=gaelGaitPose({moving:true,phase:Math.PI/2});
 const run=gaelGaitPose({moving:true,running:true,phase:Math.PI/2});
 assert.ok(run.knees[0]>walk.knees[0]);
 assert.ok(run.bounce>walk.bounce);
});
test('el renderizador une cada malla inferior a su articulación',()=>{
 const src=readFileSync(new URL('../src/renderer.js',import.meta.url),'utf8');
 assert.match(src,/this\.walkShin/);assert.match(src,/this\.walkForearm/);
 assert.match(src,/spinX\(pose\.knees\[i\]\)/);assert.match(src,/spinX\(pose\.elbows\[i\]\)/);
});
