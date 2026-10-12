import test from 'node:test';
import assert from 'node:assert/strict';
import {ROAD_HALF,LENGTH,START_S,sample,project,startPose,wrap,localPosition} from '../src/track.js';
import {createCar,resetCar,step,FIXED_STEP,formatTime} from '../src/physics.js';
const input={throttle:false,brake:false,left:false,right:false,handbrake:false};
test('track loops continuously and normals are unit length',()=>{
 for(let s=0;s<LENGTH;s+=2.5){let a=sample(s),b=sample(s+LENGTH);assert.ok(Math.hypot(a.x-b.x,a.z-b.z)<1e-7);assert.ok(Math.abs(Math.hypot(a.nx,a.nz)-1)<.00001);}
});
test('center line position projects back to itself',()=>{
 for(let s=2;s<LENGTH-2;s+=7){const p=sample(s),proj=project(p.x,p.z);assert.ok(Math.abs(proj.offset)<.05);assert.ok(Math.abs(proj.s-s)<1.2);}
});
test('outward offset creates positive road distance',()=>{
 const p=localPosition(START_S,5),q=project(p.x,p.z);assert.ok(q.offset>4.9);assert.ok(q.offset<5.1);
});
test('car accelerates on asphalt to arcade speed',()=>{
 const car=createCar();for(let i=0;i<120;i++)step(car,{...input,throttle:true},FIXED_STEP);
 assert.ok(car.speed>12&&car.speed<25,'one second acceleration');assert.ok(Number.isFinite(car.x));
});
test('brakes slow vehicle, reverse is capped',()=>{
 const car=createCar();for(let i=0;i<280;i++)step(car,{...input,throttle:true},FIXED_STEP);
 const v=car.speed;for(let i=0;i<70;i++)step(car,{...input,brake:true},FIXED_STEP);assert.ok(car.speed<v);
 for(let i=0;i<400;i++)step(car,{...input,brake:true},FIXED_STEP);assert.ok(car.speed>=-12);
});
test('barriers bound the vehicle and reduce speed',()=>{
 const car=createCar();car.x+=40;car.speed=50;car.vx=20;
 step(car,input,FIXED_STEP);assert.ok(car.wall);assert.ok(Math.abs(car.offset)>ROAD_HALF);assert.ok(car.speed<50);assert.equal(car.valid,false);
});
test('reset clears movement and returns to starting line',()=>{
 const car=createCar();car.x=0;car.speed=200;resetCar(car);assert.deepEqual([car.x,car.z,car.speed],[startPose().x,startPose().z,0]);
});
test('time formatter is stable and invalid is signalled',()=>{
 assert.equal(formatTime(63.125),'01:03.125');assert.equal(formatTime(null),'--:--.---');assert.equal(formatTime(Infinity),'--:--.---');
});
test('full ordered lap crosses sectors and records a valid time',()=>{
 const car=createCar();for(let d=START_S;d<LENGTH+START_S+2;d+=.8){const p=sample(d);car.x=p.x;car.z=p.z;car.vx=0;car.vz=0;step(car,input,.035);}
 assert.equal(car.completed,1,'one completed lap');assert.equal(car.lap,2);assert.ok(car.lastLap>12);assert.ok(car.best>12);
});
test('jumping across sectors without gates does not count a valid lap',()=>{
 const car=createCar();car.prevS=LENGTH-2;const p=sample(1);car.x=p.x;car.z=p.z;step(car,input,.04);
 assert.equal(car.completed,0);assert.equal(car.gate,0);
});
