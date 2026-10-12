import test from 'node:test';
import assert from 'node:assert/strict';
import {missionChapter,newMission,startMission,missionTarget,stepMission} from '../src/mission.js';
import {readFinalChoice,writeFinalChoice} from '../src/final-choice.js';
const at=(target,onFoot=false)=>({...target,onFoot,kmh:0});
function advanceToBranch(){const m=newMission(14);startMission(m);assert.equal(stepMission(m,at(missionTarget(m),true),6),'checkpoint');return m;}
test('mission 14 follows 13 and introduces an explicit choice',()=>{assert.equal(missionChapter(14).points.length,3);assert.equal(missionChapter(13).title,'EL NOMBRE EN LA CINTA');});
test('rescue choice produces a distinct final objective and win',()=>{const m=advanceToBranch();const b=missionTarget(m);assert.equal(stepMission(m,at(b.alternatives[0]),.2),'checkpoint');assert.equal(m.finalChoice,'RESCATAR A MI HERMANO');const t=missionTarget(m);assert.equal(t.name,'RESCATE DEL HERMANO');assert.equal(stepMission(m,at(t,false),8),null);assert.equal(stepMission(m,at(t,true),8),'won');});
test('evidence choice produces a distinct final objective and win',()=>{const m=advanceToBranch();const b=missionTarget(m);assert.equal(stepMission(m,at(b.alternatives[1]),.2),'checkpoint');assert.equal(m.finalChoice,'RECUPERAR LAS PRUEBAS');const t=missionTarget(m);assert.equal(t.name,'PRUEBAS CONTRA SALVAT');assert.equal(stepMission(m,at(t,true),8),'won');});
test('final choice persists with validation and corrupt data falls back',()=>{const map=new Map(),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};assert.equal(writeFinalChoice(storage,'RESCATAR A MI HERMANO'),true);assert.equal(readFinalChoice(storage),'RESCATAR A MI HERMANO');assert.equal(writeFinalChoice(storage,'INVALID'),false);map.set('chase404.campaign.final-choice.v1','{broken');assert.equal(readFinalChoice(storage),null);});
test('mission 14 times out when Gael does not arrive',()=>{const m=newMission(14);startMission(m);assert.equal(stepMission(m,{x:9999,z:9999},491),'lost');});
