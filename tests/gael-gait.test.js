import test from 'node:test';
import assert from 'node:assert/strict';
import {gaelGaitPose,GAEL_RIG} from '../src/gael-model.js';
test('standing pose is neutral',()=>{const p=gaelGaitPose();assert.deepEqual(p.legs,[0,0]);assert.deepEqual(p.arms,[0,0]);assert.equal(p.bounce,0)});
test('limb swing is alternating and counter-phase',()=>{const p=gaelGaitPose({moving:true,phase:Math.PI/2});assert.ok(p.legs[0]<0&&p.legs[1]>0);assert.ok(p.arms[0]>0&&p.arms[1]<0)});
test('running strides exceed walking strides',()=>{const a=gaelGaitPose({moving:true,phase:Math.PI/2}),b=gaelGaitPose({moving:true,running:true,phase:Math.PI/2});assert.ok(Math.abs(b.legs[0])>Math.abs(a.legs[0]));assert.ok(b.lean<a.lean)});
test('nonfinite phase never reaches transforms',()=>{assert.equal(gaelGaitPose({moving:true,phase:Infinity}).bounce,0)});
test('rig positions are unchanged',()=>{assert.equal(GAEL_RIG.hipY,.57);assert.equal(GAEL_RIG.shoulderY,1.43)});
