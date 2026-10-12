import test from 'node:test';
import assert from 'node:assert/strict';
import {CITY,nearestStreet,buildCity,cityElevation} from '../src/city.js';
import {roadPath} from '../src/road-network.js';
import {newMission,startMission,stepMission,missionChapter,FIFTH_MISSION_POINTS} from '../src/mission.js';
test('Montjuïc conectado al puerto mediante vías transitables',()=>{
 const path=roadPath(-875,-555,-1390,-305);
 assert.ok(path.length>=5);
 for(const p of path)assert.ok(nearestStreet(p.x,p.z).distance<1);
 assert.ok(CITY.bounds>1500);
});
test('Desnivel de montaña y geometría finita',()=>{
 assert.ok(cityElevation(-1390,-305)>cityElevation(-875,-555)+15);
 const g=buildCity();assert.ok(g.count>50000);assert.ok(g.positions.every(Number.isFinite));
});
test('Misión 05 se completa en secuencia y desbloquea el siguiente paso narrativo',()=>{
 const m=newMission(5);assert.equal(m.remaining,340);assert.equal(missionChapter(5).points.length,3);
 assert.equal(startMission(m),true);
 for(let i=0;i<3;i++)assert.equal(stepMission(m,FIFTH_MISSION_POINTS[i],1),i===2?'won':'checkpoint');
 assert.equal(m.completed,true);
});
test('Misión 05 expira y capítulos previos permanecen',()=>{
 assert.equal(missionChapter(4).title,'SOMBRAS DEL PUERTO');
 const m=newMission(5);startMission(m);assert.equal(stepMission(m,{x:0,z:0},341),'lost');
});
