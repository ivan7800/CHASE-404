import test from 'node:test';
import assert from 'node:assert/strict';
import {CITY,nearestStreet,buildCity} from '../src/city.js';
import {roadPath} from '../src/road-network.js';
import {newMission,startMission,missionTarget,stepMission,SECOND_MISSION_POINTS} from '../src/mission.js';
test('La conexión a Gràcia mantiene una ruta circulable desde el Carmel',()=>{
 const route=roadPath(-250,48,-535,115);
 assert.ok(route.length>=4);
 for(const p of route)assert.ok(nearestStreet(p.x,p.z).distance<1);
});
test('La misión 02 es jugable en orden y respeta su propio límite',()=>{
 const m=newMission(2);assert.equal(m.remaining,215);startMission(m);
 assert.equal(missionTarget(m).name,SECOND_MISSION_POINTS[0].name);
 assert.equal(stepMission(m,SECOND_MISSION_POINTS[2],1),null);
 assert.equal(stepMission(m,SECOND_MISSION_POINTS[0],1),'checkpoint');
 assert.equal(stepMission(m,SECOND_MISSION_POINTS[1],1),'checkpoint');
 assert.equal(stepMission(m,SECOND_MISSION_POINTS[2],1),'won');
});
test('La ciudad de Gràcia se integra en geometría y límites',()=>{
 assert.ok(CITY.bounds>=550);
 assert.ok(CITY.streets.some(s=>s.some(([x])=>x<=-535)));
 const mesh=buildCity();assert.ok(mesh.positions.every(Number.isFinite));
});
