import test from 'node:test';
import assert from 'node:assert/strict';
import {createSuspect,stepSuspect} from '../src/suspect.js';
import {nearestStreet} from '../src/city.js';
import {newMission,startMission,stepMission,missionChapter,missionTarget,SEVENTH_MISSION_POINTS} from '../src/mission.js';
test('suspect follows the drivable road network without leaving it',()=>{
 const car=createSuspect();car.active=true;
 for(let i=0;i<3000;i++){stepSuspect(car,.04);assert.ok(nearestStreet(car.x,car.z).distance<.001);}
});
test('chapter 07 requires a sustained safe following distance',()=>{
 const m=newMission(7);startMission(m);assert.equal(stepMission(m,SEVENTH_MISSION_POINTS[0],.2),'checkpoint');
 assert.equal(missionTarget(m).kind,'tail');
 for(let i=0;i<13;i++)assert.equal(stepMission(m,{suspectDistance:50,onFoot:false},1),null);
 assert.equal(stepMission(m,{suspectDistance:50,onFoot:false},1),'checkpoint');
 assert.equal(stepMission(m,SEVENTH_MISSION_POINTS[2],1),'won');
});
test('tail fails after extended loss and close driving cancels progress',()=>{
 const m=newMission(7);startMission(m);stepMission(m,SEVENTH_MISSION_POINTS[0],1);
 stepMission(m,{suspectDistance:40},5);assert.equal(m.holdProgress,5);
 stepMission(m,{suspectDistance:8},2);assert.ok(m.holdProgress<5);
 assert.equal(stepMission(m,{suspectDistance:190},9),'lost');
});
test('chapter 07 campaign configuration is reachable',()=>{assert.equal(missionChapter(7).points.length,3);assert.equal(newMission(7).chapter,7);});
