import test from 'node:test';
import assert from 'node:assert/strict';
import {TRACKS,selectTrack,getTrack,LENGTH,START_S,sample,project,localPosition} from '../src/track.js';
import {CARS,getCar} from '../src/garage.js';
import {createCar,step,FIXED_STEP} from '../src/physics.js';
import {makeRace,stepRace} from '../src/race.js';
import {buildTrack,buildCar} from '../src/geometry.js';

const idle={throttle:false,brake:false,left:false,right:false,handbrake:false};
test('three original circuits are continuous, project correctly and differ in geometry',()=>{
 const lengths=[],reference=[];
 for(const track of TRACKS){
  selectTrack(track.id);lengths.push(LENGTH);reference.push(sample(LENGTH*.32));
  assert.ok(LENGTH>650&&LENGTH<1500,`track length ${track.id}: ${LENGTH}`);
  for(let i=0;i<200;i++){
   const s=LENGTH*i/200,p=sample(s),back=sample(s+LENGTH),proj=project(p.x,p.z);
   assert.ok(Math.hypot(p.x-back.x,p.z-back.z)<.001,`${track.id} closed`);
   assert.ok(Math.abs(proj.offset)<.03,`${track.id} on track`);
   assert.ok(Math.abs(proj.s-s)<1,`${track.id} projection s`);
   assert.ok(Math.abs(Math.hypot(p.tx,p.tz)-1)<.001,`${track.id} tangent norm`);
   const lane=localPosition(s,6),pp=project(lane.x,lane.z);
   assert.ok(pp.offset>5.5&&pp.offset<6.5,`${track.id} lane offset`);
  }
  assert.ok(buildTrack().count>45000,`${track.id} geometry generated`);
 }
 assert.ok(new Set(lengths.map(Math.round)).size===3,'distinct track lengths');
 assert.ok(Math.hypot(reference[1].x-reference[2].x,reference[1].z-reference[2].z)>10,'distinct bends');
 selectTrack('sunset');
});
test('every circuit can count three checkpoint-validated laps with a finish',()=>{
 for(const track of TRACKS){
  selectTrack(track.id);
  const car=createCar(),race=makeRace();let stop=false;
  for(let d=START_S;d<3*LENGTH+START_S+10;d+=1.8){
   const p=sample(d);car.x=p.x;car.z=p.z;car.vx=0;car.vz=0;
   step(car,idle,.025);const res=stepRace(race,car,.025);
   if(res.finished){stop=true;break;}
  }
  assert.ok(stop,`${track.id} finish triggers`);
  assert.equal(car.completed,3,`${track.id} three valid laps`);
  assert.equal(race.finalResults.length,8,`${track.id} results`);
 }
 selectTrack('sunset');
});
test('six cars have unique names, legitimate tuning and distinct body geometry',()=>{
 assert.equal(CARS.length,6);assert.equal(new Set(CARS.map(c=>c.id)).size,6);
 const vertexCounts=[];
 for(const cfg of CARS){
  assert.equal(getCar(cfg.id),cfg);
  for(const value of Object.values(cfg.tune))assert.ok(value>=.75&&value<=1.3);
  const mesh=buildCar(cfg);vertexCounts.push(mesh.count);
  assert.ok(mesh.count>100&&mesh.colors.length===mesh.count*3);
  assert.ok(mesh.positions.every(Number.isFinite));
 }
 assert.ok(new Set(vertexCounts).size>=4,`distinct body kits ${vertexCounts}`);
});
test('handling and power tuning change actual forward acceleration',()=>{
 selectTrack('sunset');
 function acceleration(carId){const car=createCar();car.tune=getCar(carId).tune;for(let i=0;i<140;i++)step(car,{...idle,throttle:true},FIXED_STEP);return car.speed;}
 assert.ok(acceleration('falcon')>acceleration('comet')+.8,'different actual engine curves');
});
test('unknown track IDs fail without altering the selected scene',()=>{
 selectTrack('ridge');assert.throws(()=>selectTrack('missing'),RangeError);assert.equal(getTrack().id,'ridge');selectTrack('sunset');
});
