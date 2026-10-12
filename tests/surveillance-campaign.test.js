import test from 'node:test';
import assert from 'node:assert/strict';
import {newMission,startMission,stepMission,missionTarget,missionChapter,SIXTH_MISSION_POINTS} from '../src/mission.js';
test('sixth chapter defines a surveillance objective, followed by escape and delivery',()=>{
 const m=newMission(6);assert.equal(m.remaining,320);assert.equal(missionChapter(6).points.length,3);startMission(m);
 const target=SIXTH_MISSION_POINTS[0];assert.equal(target.kind,'stakeout');
 assert.equal(stepMission(m,{...target,kmh:40},2),null);assert.equal(m.holdProgress,0);
 assert.equal(stepMission(m,{...target,kmh:0,onFoot:true},3),null);assert.equal(m.holdProgress,0);
 assert.equal(stepMission(m,{...target,kmh:0},5),null);assert.equal(m.holdProgress,5);
 assert.equal(stepMission(m,{x:0,z:0,kmh:0},1),null);assert.equal(m.holdProgress,0);
 assert.equal(stepMission(m,{...target,kmh:0},7),null);assert.equal(m.index,0);
 assert.equal(stepMission(m,{...target,kmh:0},1),'checkpoint');assert.equal(m.index,1);
 assert.equal(missionTarget(m).name,SIXTH_MISSION_POINTS[1].name);
 assert.equal(stepMission(m,SIXTH_MISSION_POINTS[1],1),'checkpoint');
 assert.equal(stepMission(m,SIXTH_MISSION_POINTS[2],1),'won');assert.equal(m.phase,'won');
});
test('stakeout timer expires without holding checkpoint',()=>{const m=newMission(6);startMission(m);assert.equal(stepMission(m,{...SIXTH_MISSION_POINTS[0],kmh:60},321),'lost');});
