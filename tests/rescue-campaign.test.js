import test from 'node:test';
import assert from 'node:assert/strict';
import {missionChapter,newMission,startMission,stepMission,missionTarget} from '../src/mission.js';

test('mission eleven includes three distinct stages',()=>{
 const c=missionChapter(11);assert.equal(c.points.length,3);assert.equal(c.points[1].kind,'rescue');assert.equal(c.points[2].kind,'extract');
});
test('Gael must disembark and stay beside rescue target',()=>{
 const m=newMission(11);startMission(m);
 assert.equal(stepMission(m,{...missionTarget(m),onFoot:false},1),'checkpoint');
 const point=missionTarget(m);
 assert.equal(stepMission(m,{...point,onFoot:false},8),null);
 assert.equal(m.index,1);
 stepMission(m,{...point,onFoot:true},4);
 stepMission(m,{x:1000,z:1000,onFoot:true},.2);
 assert.equal(m.holdProgress,0);
 assert.equal(stepMission(m,{...point,onFoot:true},7),'checkpoint');
});
test('extraction requires a vehicle and police sufficiently far',()=>{
 const m=newMission(11);startMission(m);stepMission(m,missionTarget(m),1);stepMission(m,{...missionTarget(m),onFoot:true},7);
 const p=missionTarget(m);
 assert.equal(stepMission(m,{...p,onFoot:true,patrolDistance:100},5),null);
 assert.equal(stepMission(m,{...p,onFoot:false,patrolDistance:20},5),null);
 assert.equal(stepMission(m,{...p,onFoot:false,patrolDistance:90},4),'won');
 assert.equal(m.completed,true);
});
test('rescue mission times out if no extraction is reached',()=>{
 const m=newMission(11);startMission(m);assert.equal(stepMission(m,{x:0,z:0},441),'lost');
});
