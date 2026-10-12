import test from 'node:test';
import assert from 'node:assert/strict';
import {CITY,nearestStreet,buildCity} from '../src/city.js';
import {roadPath} from '../src/road-network.js';
import {newMission,startMission,stepMission,missionTarget,THIRD_MISSION_POINTS,missionChapter} from '../src/mission.js';
test('Eixample conectado por avenidas a Gràcia',()=>{
 const route=roadPath(-535,115,-875,-125);
 assert.ok(route.length>=5);
 for(const p of route)assert.ok(nearestStreet(p.x,p.z).distance<1);
 assert.ok(CITY.streets.some(s=>s.some(p=>p[0]===-875)));
});
test('La misión 03 tiene destinos ordenados y victoria al tercero',()=>{
 const m=newMission(3);assert.equal(m.remaining,245);assert.equal(missionChapter(3).points.length,3);
 assert.equal(startMission(m),true);
 assert.equal(stepMission(m,THIRD_MISSION_POINTS[2],.1),null);
 for(let i=0;i<3;i++)assert.equal(stepMission(m,{...THIRD_MISSION_POINTS[i],kmh:25,onFoot:false},i===1?3:1),i===2?'won':'checkpoint');
 assert.equal(missionTarget(m),null);
});
test('La misión 03 pierde al superar el límite',()=>{
 const m=newMission(3);startMission(m);assert.equal(stepMission(m,{x:0,z:0},246),'lost');
});
test('Los edificios del Eixample y sus coordenadas son finitos',()=>{
 const city=buildCity();assert.ok(city.count>50000);
 assert.ok(city.positions.every(Number.isFinite));
 assert.ok(CITY.bounds>900);
});
