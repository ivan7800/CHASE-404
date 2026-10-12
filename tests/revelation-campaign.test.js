import test from 'node:test';
import assert from 'node:assert/strict';
import {missionChapter,newMission,startMission,missionTarget,stepMission} from '../src/mission.js';
test('mission 13 follows the archive and reveals the leader with mixed objectives',()=>{
 const c=missionChapter(13);
 assert.equal(c.points.length,3);assert.equal(c.limit,480);
 assert.deepEqual(c.points.map(p=>p.kind),['contact','stakeout','investigate']);
 assert.equal(missionChapter(12).title,'EL ARCHIVO DE LOS AUSENTES');
});
test('mission 13 requires Gael on foot, stationary surveillance and investigation',()=>{
 const m=newMission(13);startMission(m);
 const p1=missionTarget(m);assert.equal(stepMission(m,{...p1,onFoot:false},6),null);
 assert.equal(stepMission(m,{...p1,onFoot:true},6),'checkpoint');
 const p2=missionTarget(m);assert.equal(stepMission(m,{...p2,onFoot:false,kmh:15},10),null);
 assert.equal(stepMission(m,{...p2,onFoot:false,kmh:0},10),'checkpoint');
 const p3=missionTarget(m);assert.equal(stepMission(m,{...p3,onFoot:false},8),null);
 assert.equal(stepMission(m,{...p3,onFoot:true},8),'won');
 assert.equal(m.phase,'won');
});
test('mission 13 must finish when final timed interaction is completed',()=>{
 const m=newMission(13);startMission(m);
 for(const foot of [true,false,true]){const t=missionTarget(m);stepMission(m,{...t,onFoot:foot,kmh:0},t.hold);}
 assert.equal(m.phase,'won');assert.equal(m.completed,true);
});
test('mission 13 times out',()=>{
 const m=newMission(13);startMission(m);
 assert.equal(stepMission(m,{x:9999,z:9999,onFoot:false},481),'lost');
});
