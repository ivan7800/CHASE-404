import test from 'node:test';
import assert from 'node:assert/strict';
import {newMission,startMission,stepMission,missionTarget,missionChapter,EIGHTH_MISSION_POINTS,eighthMissionPoints,missionDistance} from '../src/mission.js';
import {nearestStreet} from '../src/city.js';
test('mission eight is available and branches remain on roads',()=>{
 assert.equal(missionChapter(8).points.length,3);
 for(const alt of EIGHTH_MISSION_POINTS[1].alternatives)assert.ok(nearestStreet(alt.x,alt.z).distance<.01);
});
test('west escape route can finish only with safe distance',()=>{
 const m=newMission(8);startMission(m);
 assert.equal(stepMission(m,EIGHTH_MISSION_POINTS[0],.2),'checkpoint');
 assert.equal(missionTarget(m).kind,'branch');
 assert.equal(stepMission(m,{x:-785,z:-230},1),null);
 assert.equal(stepMission(m,{x:-875,z:-230},1),'checkpoint');
 assert.equal(m.routeChoice,'AVENIDA OESTE');
 assert.equal(missionTarget(m).safeDistance,90);
 for(let i=0;i<3;i++)assert.equal(stepMission(m,{x:-535,z:-5,patrolDistance:89},1),null);
 assert.equal(m.holdProgress,0);
 for(let i=0;i<3;i++)assert.equal(stepMission(m,{x:-535,z:-5,patrolDistance:95,onFoot:false},1),null);
 assert.equal(stepMission(m,{x:-535,z:-5,patrolDistance:95,onFoot:false},1),'won');
});
test('east route available and patrol proximity resets escape',()=>{
 const m=newMission(8);startMission(m);stepMission(m,EIGHTH_MISSION_POINTS[0],.5);
 assert.equal(stepMission(m,{x:-700,z:-230},.5),'checkpoint');
 assert.equal(m.routeChoice,'CALLE DE SERVICIO');
 assert.equal(missionTarget(m).safeDistance,65);
 assert.equal(missionTarget(m).hold,7);
 stepMission(m,{x:-535,z:-5,patrolDistance:120,onFoot:false},4);
 assert.equal(m.holdProgress,4);
 stepMission(m,{x:-535,z:-5,patrolDistance:15},.2);
 assert.equal(m.holdProgress,0);
 assert.ok(missionDistance(newMission(8),{x:0,z:0})>=0);
});
test('ambush times out',()=>{const m=newMission(8);startMission(m);assert.equal(stepMission(m,{x:0,z:0},361),'lost');});

test('escape routes have distinct tactical tradeoffs and require staying in vehicle',()=>{
 assert.equal(eighthMissionPoints('AVENIDA OESTE')[2].hold,4);
 assert.equal(eighthMissionPoints('CALLE DE SERVICIO')[2].hold,7);
 const m=newMission(8);startMission(m);
 stepMission(m,EIGHTH_MISSION_POINTS[0],.2);
 stepMission(m,{x:-700,z:-230},.2);
 assert.equal(stepMission(m,{x:-535,z:-5,patrolDistance:99,onFoot:true},7),null);
 assert.equal(m.holdProgress,0);
 assert.equal(stepMission(m,{x:-535,z:-5,patrolDistance:70,onFoot:false},7),'won');
});
