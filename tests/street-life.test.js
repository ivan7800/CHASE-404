import test from 'node:test';
import assert from 'node:assert/strict';
import { STREET_JOBS, nearbyStreetJob, startStreetJob, stepStreetJob, streetPedestrians } from '../src/street-life.js';
import { createPolice, stepPolice } from '../src/police.js';
import { nearestStreet } from '../src/city.js';
import { cityBuildingAt } from '../src/urban-buildings.js';

test('street jobs can start and finish in their district only while driving',()=>{
 for(const job of STREET_JOBS){
  assert.equal(nearbyStreetJob(job.start),job);
  const run=startStreetJob(job,0);
  assert.equal(stepStreetJob(run,{...job.stops[0],kmh:0,onFoot:true,damageEvents:0},.1),'active');
  assert.equal(stepStreetJob(run,{...job.stops[0],kmh:0,damageEvents:0},.1),'checkpoint');
  assert.equal(stepStreetJob(run,{...job.stops[1],kmh:0,damageEvents:0},.1),'won');
 }
});
test('fragile cargo and passenger speed rules affect outcomes',()=>{
 const print=startStreetJob(STREET_JOBS[1],2);
 assert.match(stepStreetJob(print,{x:0,z:0,kmh:0,damageEvents:3},.1),/carrete/);
 const trip=startStreetJob(STREET_JOBS[2],0);
 const pickup={...trip.job.stops[0],damageEvents:0};
 assert.equal(stepStreetJob(trip,{...pickup,kmh:15},.1),'active');
 assert.equal(stepStreetJob(trip,{...pickup,kmh:0},.1),'checkpoint');
 assert.match(stepStreetJob(trip,{...pickup,kmh:65},2),/pasajero/);
});
test('street pedestrians move outside the carriageway and building footprints',()=>{
 for(const job of STREET_JOBS){
  assert.notDeepEqual(streetPedestrians(0,job.start),streetPedestrians(2,job.start));
  for(let t=0;t<60;t+=.5)for(const resident of streetPedestrians(t,job.start)){
   const road=nearestStreet(resident.x,resident.z);
   assert.ok(road.distance>road.roadHalf);
   assert.equal(cityBuildingAt(resident.x,resident.z,.35),null);
  }
 }
});
test('patrol keeps last known position and gives up after losing sight',()=>{
 const patrol=createPolice();
 Object.assign(patrol,{active:true,lastSeen:{x:5,z:132}});
 Object.assign(patrol.agent,{x:5,z:132});
 const driver={x:-875,z:-340,kmh:100};
 for(let i=0;i<65;i++)stepPolice(patrol,.1,driver);
 assert.deepEqual(patrol.lastSeen,{x:5,z:132});
 assert.equal(patrol.active,false);
 assert.equal(patrol.escaped,true);
});
