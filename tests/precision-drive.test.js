import test from 'node:test';
import assert from 'node:assert/strict';
import {newMission,startMission,stepMission,missionTarget,THIRD_MISSION_POINTS} from '../src/mission.js';
const P=THIRD_MISSION_POINTS;
function setup(){const m=newMission(3);startMission(m);assert.equal(stepMission(m,{...P[0],kmh:30,onFoot:false},.1),'checkpoint');return m;}
test('precision driving objective is part of chapter 3',()=>{const m=setup();assert.equal(missionTarget(m).kind,'precision-drive');assert.equal(missionTarget(m).hold,3);});
test('precise pass must maintain speed within range continuously',()=>{
 const m=setup();
 for(let i=0;i<2;i++)assert.equal(stepMission(m,{...P[1],kmh:25,onFoot:false},1),null);
 assert.equal(m.holdProgress,2);
 assert.equal(stepMission(m,{...P[1],kmh:80,onFoot:false},.5),null);
 assert.equal(m.holdProgress,0);
 assert.equal(stepMission(m,{...P[1],kmh:25,onFoot:false},1),null);
 assert.equal(stepMission(m,{...P[1],kmh:25,onFoot:false},1),null);
 assert.equal(stepMission(m,{...P[1],kmh:25,onFoot:false},1),'checkpoint');
 assert.equal(stepMission(m,{...P[2],kmh:0,onFoot:false},1),'won');
});
test('walking, idling, and being too far away do not progress controlled driving',()=>{
 const m=setup();
 for(const p of [{...P[1],kmh:25,onFoot:true},{...P[1],kmh:0,onFoot:false},{...P[1],kmh:50,onFoot:false},{...P[1],x:P[1].x+65,kmh:25,onFoot:false}]){
  assert.equal(stepMission(m,p,.5),null);assert.equal(m.holdProgress,0);
 }
});
test('time expiry still fails controlled driving',()=>{
 const m=setup();assert.equal(stepMission(m,{...P[1],kmh:0,onFoot:false},300),'lost');
});
