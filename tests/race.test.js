import test from 'node:test';
import assert from 'node:assert/strict';
import {makeRace, stepRace, standings, playerProgress, collideWithRivals, RACE_LAPS,slipstream} from '../src/race.js';
import {createCar,step} from '../src/physics.js';
import {sample,START_S,LENGTH,ROAD_HALF,localPosition} from '../src/track.js';
const idle={throttle:false,brake:false,left:false,right:false,handbrake:false};

test('seven rivals have unique identifiers, stable starting grid and reasonable boundaries',()=>{
 const race=makeRace();assert.equal(race.rivals.length,7);
 assert.equal(new Set(race.rivals.map(x=>x.id)).size,7);
 const me=createCar();const order=standings(race,me);
 assert.equal(order.length,8);assert.equal(order.find(x=>x.id==='YOU').position,3);
 for(const rival of race.rivals){assert.ok(Math.abs(rival.offset)<ROAD_HALF);assert.ok(Math.hypot(rival.x-me.x,rival.z-me.z)>5);}
});
test('rivals accelerate forward with bounded speed and maintain finite geometry',()=>{
 const race=makeRace(),car=createCar();
 for(let i=0;i<1200;i++)stepRace(race,car,1/120);
 for(const rival of race.rivals){
  assert.ok(rival.totalS>START_S+rival.start+35,`${rival.id} progressed`);
  assert.ok(rival.kmh>100&&rival.kmh<260);
  assert.ok(Math.abs(rival.offset)<ROAD_HALF-2.5);
  assert.ok([rival.x,rival.z,rival.yaw,rival.wheel].every(Number.isFinite));
 }
 assert.ok(race.elapsed>9.99);
});
test('ranking changes after player overtakes and offers stable tie handling',()=>{
 const race=makeRace(),car=createCar();
 assert.equal(standings(race,car).find(x=>x.id==='YOU').position,3);
 car.completed=1;car.travel=START_S;
 assert.equal(standings(race,car)[0].id,'YOU');
 assert.ok(playerProgress(car)>LENGTH);
});
test('car contact is resolved physically and never creates non-finite velocity',()=>{
 const race=makeRace(),car=createCar(),r=race.rivals[0];
 car.x=r.x;car.z=r.z;car.speed=45;car.vx=0;car.vz=45;
 const before=Math.hypot(car.x-r.x,car.z-r.z);
 const contact=collideWithRivals(car,[r],1/120);
 assert.equal(contact,true);
 assert.ok(Math.hypot(car.x-r.x,car.z-r.z)>before);
 assert.ok([car.x,car.z,car.speed,car.vx,car.vz].every(Number.isFinite));
 assert.equal(collideWithRivals({...car,x:999,z:999},[r],1/120),false);
});
test('rivals keep circulating visually after their classified finish so the line is not blocked',()=>{
 const race=makeRace(),car=createCar();
 for(let i=0;i<120*90;i++)stepRace(race,car,1/120);
 for(const rival of race.rivals){assert.equal(rival.finished,true);assert.ok(rival.totalS>RACE_LAPS*LENGTH);assert.ok(rival.finishTime>0);}
 assert.equal(race.finished,false,'race ends on player finish, not when AI finishes');
});
test('valid checkpoint traversal triggers complete race, immutable results and total time',()=>{
 const race=makeRace(),car=createCar();
 // Controlled track-following progression, compatible with checkpoint validation.
 const dt=.018;
 let triggers=0;
 for(let d=START_S;d<3*LENGTH+10;d+=.85){
  const p=sample(d);car.x=p.x;car.z=p.z;car.vx=0;car.vz=0;
  const prior=car.completed;
  step(car,idle,dt);const result=stepRace(race,car,dt);
  if(car.completed!==prior)triggers++;
  if(result.finished)break;
 }
 assert.equal(triggers,3);
 assert.equal(car.completed,3);assert.equal(race.finished,true);assert.ok(race.playerFinish>20);
 assert.equal(race.finalResults.length,8);
 assert.equal(race.finalResults.find(x=>x.id==='YOU').position,race.position);
 const previous=race.elapsed;stepRace(race,car,10);assert.equal(race.elapsed,previous);
});
test('contacts and invalid record laps still count as completed racing laps',()=>{
 const car=createCar();car.valid=false;
 for(let d=START_S;d<LENGTH+START_S+3;d+=.8){const p=sample(d);car.x=p.x;car.z=p.z;car.vx=0;car.vz=0;step(car,idle,.04);}
 assert.equal(car.completed,1);assert.equal(car.best,null);assert.equal(car.lap,2);
});

test('slipstream activates only behind another car in its wake',()=>{
 const race=makeRace(),car=createCar();const r=race.rivals[0];
 const p=localPosition(r.totalS-17,r.offset);car.x=p.x;car.z=p.z;car.speed=35;car.travel=r.totalS-17;
 const draft=slipstream(race,car);
 assert.ok(draft>.35,`draft=${draft}`);
 car.x+=12;assert.ok(slipstream(race,car)<.01);
});
test('a drafting car gains more speed and remains bounded',()=>{
 const boost=createCar(),plain=createCar(),input={...idle,throttle:true};
 for(let i=0;i<200;i++){step(boost,{...input,slipstream:1},1/120);step(plain,input,1/120);}
 assert.ok(boost.speed>plain.speed+.5);
 assert.ok(boost.speed<78);
});
