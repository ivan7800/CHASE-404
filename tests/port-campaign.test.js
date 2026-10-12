import test from 'node:test';
import assert from 'node:assert/strict';
import {CITY,nearestStreet,buildCity} from '../src/city.js';
import {roadPath} from '../src/road-network.js';
import {newMission,startMission,stepMission,missionChapter,FOURTH_MISSION_POINTS} from '../src/mission.js';
test('Puerto conectado a las avenidas del Eixample',()=>{
 const path=roadPath(-875,-125,-785,-555);
 assert.ok(path.length>=5);
 for(const point of path)assert.ok(nearestStreet(point.x,point.z).distance<1);
 assert.ok(CITY.streets.some(line=>line.some(p=>p[1]===-555)));
});
test('Misión 04 con tres puntos y desenlace',()=>{
 const m=newMission(4);assert.equal(m.remaining,300);assert.equal(missionChapter(4).points.length,3);
 assert.ok(startMission(m));
 FOURTH_MISSION_POINTS.forEach((point,i)=>assert.equal(stepMission(m,point,1),i===2?'won':'checkpoint'));
 assert.equal(m.completed,true);
});
test('Misión 04 expira al superar el tiempo',()=>{
 const m=newMission(4);startMission(m);assert.equal(stepMission(m,{x:0,z:0},301),'lost');
});
test('Geometría portuaria válida',()=>{
 const geometry=buildCity();assert.ok(geometry.count>50000);
 assert.ok(geometry.positions.every(Number.isFinite));
 assert.ok(CITY.bounds>1000);
});
