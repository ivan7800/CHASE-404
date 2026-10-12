import test from 'node:test';
import assert from 'node:assert/strict';
import {gaelGaitPose,blendGaelPose} from '../src/gael-model.js';
import {readFileSync} from 'node:fs';

test('blend correctly interpolates all six pose components',()=>{
 const neutral=gaelGaitPose();
 const run=gaelGaitPose({moving:true,running:true,phase:Math.PI/2});
 const midway=blendGaelPose(neutral,run,.5);
 for(const key of ['legs','arms','knees','elbows'])for(let i=0;i<2;i++)assert.ok(Math.abs(midway[key][i]-(neutral[key][i]+run[key][i])/2)<1e-9,key);
 assert.ok(Math.abs(midway.lean-(neutral.lean+run.lean)/2)<1e-9);
});
test('blend clamps invalid and excessive alpha',()=>{
 const a=gaelGaitPose();const b=gaelGaitPose({moving:true,phase:1});
 assert.deepEqual(blendGaelPose(a,b,-3),a);
 assert.deepEqual(blendGaelPose(a,b,NaN),a);
 assert.deepEqual(blendGaelPose(a,b,3),b);
 assert.equal(blendGaelPose(null,b,.2),b);
});
test('stopping eases back toward neutral without an abrupt reset',()=>{
 const neutral=gaelGaitPose();const running=gaelGaitPose({moving:true,running:true,phase:Math.PI/2});
 const slowing=blendGaelPose(running,neutral,.25);
 assert.ok(Math.abs(slowing.legs[0])<Math.abs(running.legs[0]));
 assert.ok(Math.abs(slowing.legs[0])>0);
});
test('renderer applies per-frame smoothing and clears it when Gael exits',()=>{
 const s=readFileSync(new URL('../src/renderer.js',import.meta.url),'utf8');
 assert.match(s,/Math\.exp\(-Math\.max\(0,Math\.min\(dt\|\|0,\.1\)\)\*13\)/);
 assert.match(s,/blendGaelPose\(this\.gaelSmoothedPose,target,alpha\)/);
 assert.match(s,/if\(!foot\?\.active\)this\.gaelSmoothedPose=null/);
});
