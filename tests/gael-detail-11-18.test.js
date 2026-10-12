import test from 'node:test';
import assert from 'node:assert/strict';
import {buildGaelMeshes,gaelGaitPose} from '../src/gael-model.js';

test('remodelled face, hand and footwear remain valid and non-empty',()=>{
 const m=buildGaelMeshes();
 for(const part of ['body','detail','leg','arm','shin','forearm']){
  assert.ok(m[part].count>100,part);
  assert.ok(m[part].positions.every(Number.isFinite),part);
 }
 assert.ok(m.detail.count>m.arm.count,'facial and jacket details should be developed');
 assert.ok(m.forearm.count>m.arm.count,'forearm includes a modelled palm and fingers');
});
test('gait remains neutral when stopped and articulated when running',()=>{
 const idle=gaelGaitPose();const run=gaelGaitPose({moving:true,running:true,phase:Math.PI/2});
 assert.deepEqual(idle.knees,[0,0]);assert.ok(run.knees.some(x=>x>0));
});
