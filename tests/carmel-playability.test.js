import test from 'node:test';
import assert from 'node:assert/strict';
import { roadPath } from '../src/road-network.js';
import { nearestStreet } from '../src/city.js';
import { cityBuildingAt } from '../src/urban-buildings.js';
import { campaignStartPose } from '../src/campaign-start.js';
import { createUrbanCar, step, FIXED_STEP } from '../src/physics.js';
import { makePedestrian, exitVehicle, enterVehicle } from '../src/on-foot.js';
import { missionChapter, newMission, startMission, missionTarget, stepMission } from '../src/mission.js';
import { readGamepad } from '../src/gamepad.js';

test('GPS takes the mid-street junction and avoids backtracking on the same segment', () => {
  assert.deepEqual(roadPath(30,132,44,132), [{x:30,z:132},{x:44,z:132}]);
  const route=roadPath(-176,85,-210,48);
  assert.ok(route.some(p=>p.x===-176&&p.z===48));
  for(let i=1;i<route.length;i++) {
    const a=route[i-1],b=route[i];
    const road=nearestStreet((a.x+b.x)/2,(a.z+b.z)/2);
    assert.ok(road.distance<=road.roadHalf);
  }
});

test('campaign resumes on the road close to each first objective', () => {
  for(let chapter=2;chapter<=15;chapter++) {
    const pose=campaignStartPose(chapter), target=missionChapter(chapter).points[0];
    assert.ok(nearestStreet(pose.x,pose.z).distance<.01);
    assert.equal(cityBuildingAt(pose.x,pose.z,2),null);
    const distance=Math.hypot(pose.x-target.x,pose.z-target.z);
    assert.ok(distance>30&&distance<70);
  }
});

test('a released barrier clears without fresh contact', () => {
  const car=createUrbanCar();
  Object.assign(car,{wall:true,cityWallTime:.18});
  for(let i=0;i<30;i++)step(car,{},FIXED_STEP);
  assert.equal(car.barrierContact,false);
  assert.equal(car.wall,false);
});

test('coasting in reverse retains the orientation of the car', () => {
  const car=createUrbanCar();
  Object.assign(car,{x:50,speed:-8,vx:-8,vz:0});
  const yaw=car.yaw;
  for(let i=0;i<55;i++)step(car,{},FIXED_STEP);
  assert.ok(Math.abs(car.yaw-yaw)<.01);
  assert.ok(car.x<48);
});

test('moving traffic does not block entry into a stopped car in reach', () => {
  const car=createUrbanCar(),foot=makePedestrian();
  exitVehicle(foot,car);
  assert.equal(enterVehicle(foot,car,[{x:foot.x,z:foot.z,currentSpeed:5}]),'player');
});

test('losing all patrols can finish evade and extraction objectives', () => {
  for(const [chapter,kind] of [[8,'evade'],[11,'extract'],[15,'evade']]) {
    const mission=newMission(chapter);
    startMission(mission);
    while(missionTarget(mission)?.kind!==kind&&missionTarget(mission))mission.index++;
    const target=missionTarget(mission);
    assert.ok(target);
    const point={x:target.x,z:target.z,onFoot:false,patrolDistance:Infinity};
    assert.ok(['checkpoint','won'].includes(stepMission(mission,point,target.hold)));
  }
});

test('standard pad ignores stick drift and maps triggers, controls on foot and pause', () => {
  const pad={connected:true,mapping:'standard',axes:[.12,-.54],buttons:[]};
  pad.buttons[7]={value:.8};
  pad.buttons[9]={pressed:true};
  const state=readGamepad([null,pad]);
  assert.equal(state.driving.throttle,true);
  assert.equal(state.walking.throttle,true);
  assert.equal(state.walking.right,false);
  assert.equal(state.actions.pause,true);
  assert.equal(readGamepad([{...pad,connected:false}]),null);
});

test('holding throttle from the Carmel spawn reaches the marked bend without a phantom impact', () => {
  const car=createUrbanCar();
  let reachedEdge=false;
  for(let i=0;i<750;i++){
    step(car,{throttle:true},FIXED_STEP);
    const road=nearestStreet(car.x,car.z);
    assert.ok(road.distance<=road.sidewalkHalf+2+1e-6);
    assert.equal(car.barrierContact,false);
    reachedEdge||=car.atStreetEdge;
  }
  assert.ok(reachedEdge);
  assert.ok(car.x>116&&car.x<123);
  const x=car.x;
  for(let i=0;i<190;i++)step(car,{brake:true},FIXED_STEP);
  assert.ok(car.x<x-4,'the player can reverse away from the shoulder');
});

test('the workshop checkpoint waits until the player slows down', () => {
  const mission=newMission(1),car=createUrbanCar();
  startMission(mission);
  while(car.x<103){
    step(car,{throttle:true},FIXED_STEP);
    assert.equal(stepMission(mission,car,FIXED_STEP),null);
  }
  assert.ok(car.kmh>85);
  assert.equal(mission.index,0);
  assert.equal(stepMission(mission,{...car,kmh:4},FIXED_STEP),null);
  assert.equal(stepMission(mission,{...car,kmh:3},FIXED_STEP),'checkpoint');
  assert.equal(mission.index,1);
  assert.equal(stepMission(mission,{...car,kmh:0},FIXED_STEP),null);
});
