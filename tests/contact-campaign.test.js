import test from 'node:test';
import assert from 'node:assert/strict';
import {newMission,startMission,stepMission,missionTarget,missionChapter} from '../src/mission.js';
test('chapter 10 is a separate three-stage encounter',()=>{assert.equal(missionChapter(10).points.length,3);assert.equal(missionChapter(10).title,'LA VOZ DE CLARA');});
test('contact requires Gael to leave the vehicle',()=>{const m=newMission(10);startMission(m);const at=missionTarget(m);assert.equal(stepMission(m,{...at,onFoot:false},6),null);assert.equal(m.index,0);assert.equal(m.holdProgress,0);});
test('contact requires uninterrupted conversation near Clara',()=>{const m=newMission(10);startMission(m);const at=missionTarget(m);stepMission(m,{...at,onFoot:true},3);stepMission(m,{x:1000,z:1000,onFoot:true},1);assert.equal(m.holdProgress,0);assert.equal(stepMission(m,{...at,onFoot:true},5),'checkpoint');});
test('chapter 10 can be completed after contacting Clara',()=>{const m=newMission(10);startMission(m);assert.equal(stepMission(m,{...missionTarget(m),onFoot:true},5),'checkpoint');assert.equal(stepMission(m,{...missionTarget(m),onFoot:false},1),'checkpoint');assert.equal(stepMission(m,{...missionTarget(m),onFoot:false},1),'won');});
