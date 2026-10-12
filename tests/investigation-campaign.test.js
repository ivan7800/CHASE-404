import test from 'node:test';
import assert from 'node:assert/strict';
import {missionChapter,newMission,startMission,stepMission,missionTarget} from '../src/mission.js';

test('chapter 12 defines witness, archive and port stages',()=>{
 const points=missionChapter(12).points;
 assert.equal(points.length,3);
 assert.equal(points[1].kind,'investigate');
 assert.equal(missionChapter(12).limit,420);
});
test('archive investigation needs Gael on foot for full duration',()=>{
 const m=newMission(12);startMission(m);
 assert.equal(stepMission(m,{...missionTarget(m),onFoot:true},6),'checkpoint');
 const point=missionTarget(m);
 assert.equal(stepMission(m,{...point,onFoot:false},9),null);
 assert.equal(m.index,1);
 assert.equal(stepMission(m,{...point,onFoot:true},4),null);
 assert.equal(stepMission(m,{x:0,z:0,onFoot:true},0.1),null);
 assert.equal(m.holdProgress,0);
 assert.equal(stepMission(m,{...point,onFoot:true},9),'checkpoint');
 assert.equal(m.index,2);
});
test('chapter 12 can be completed and times out',()=>{
 const m=newMission(12);startMission(m);
 stepMission(m,{...missionTarget(m),onFoot:true},6);
 stepMission(m,{...missionTarget(m),onFoot:true},9);
 assert.equal(stepMission(m,{...missionTarget(m),onFoot:false},1),'won');
 assert.equal(m.completed,true);
 const failed=newMission(12);startMission(failed);
 assert.equal(stepMission(failed,{x:999,z:999,onFoot:false},421),'lost');
});
