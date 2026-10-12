import test from 'node:test';
import assert from 'node:assert/strict';
import {createCar,step,FIXED_STEP,resetCar} from '../src/physics.js';
import {selectTrack,START_S,sample,project,ROAD_HALF,SHOULDER,LENGTH} from '../src/track.js';
import {Controls} from '../src/controls.js';
import {actionForKey,DEFAULT_BINDINGS} from '../src/settings.js';
const keys={throttle:false,brake:false,left:false,right:false,handbrake:false};
function simulate(car,input,seconds){for(let i=0;i<Math.round(seconds/FIXED_STEP);i++)step(car,{...keys,...input},FIXED_STEP);}
test('steering left/right at speed produces predictable opposite heading and road offsets',()=>{
 selectTrack('sunset');const a=createCar(),b=createCar();simulate(a,{throttle:true},2);simulate(b,{throttle:true},2);
 simulate(a,{left:true},.5);simulate(b,{right:true},.5);
 assert.ok(a.yaw>.3,'left input must rotate toward screen-left');assert.ok(b.yaw<-.3,'right input must rotate toward screen-right');
 assert.ok(a.offset>1.2&&b.offset<-1.2,'lateral movement follows the visible turn direction');
 assert.ok(Math.abs(a.offset)<ROAD_HALF&&Math.abs(b.offset)<ROAD_HALF,'half-second input should not teleport to barrier');
});
test('default D binding reaches the visible right turn without being cancelled',()=>{
 selectTrack('sunset');const controls=new Controls(code=>actionForKey(code,DEFAULT_BINDINGS));
 const car=createCar();simulate(car,{throttle:true},2);controls.keyDown('KeyD');
 for(let i=0;i<60;i++)step(car,{...keys,...controls.snapshot()},FIXED_STEP);
 assert.ok(controls.snapshot().right,'D must map to right');
 assert.ok(car.yaw<-.3&&car.offset<-1.2,'holding D must visibly turn right');
});
test('steering recenters when input released, yaw remains stable',()=>{
 selectTrack('sunset');const car=createCar();simulate(car,{throttle:true},2);simulate(car,{left:true},.2);
 simulate(car,{},.5);assert.ok(Math.abs(car.steer)<.02);
});
test('handbrake produces larger slip yet remains finite',()=>{
 selectTrack('sunset');const standard=createCar(),drift=createCar();
 simulate(standard,{throttle:true},2);simulate(drift,{throttle:true},2);
 simulate(standard,{left:true},.25);simulate(drift,{left:true,handbrake:true},.25);
 assert.ok(drift.slide>standard.slide);assert.ok(Number.isFinite(drift.x)&&Number.isFinite(drift.yaw));
});
test('after hitting barrier speed and outward velocity are reduced and car can rejoin',()=>{
 selectTrack('sunset');const car=createCar();car.x+=ROAD_HALF+SHOULDER+2;car.vx=20;car.speed=48;
 simulate(car,{},FIXED_STEP);assert.equal(car.wall,true);assert.ok(car.speed<48);
 assert.ok(Number.isFinite(car.x)&&Number.isFinite(car.vx));
});
test('projection hint stays accurate relative to global search on all circuits',()=>{
 for(const name of ['sunset','pacific','ridge']){
  selectTrack(name);let hint=null;
  for(let s=START_S;s<START_S+LENGTH/3;s+=.65){const p=sample(s);const hinted=project(p.x+1.5*p.nx,p.z+1.5*p.nz,hint);const global=project(p.x+1.5*p.nx,p.z+1.5*p.nz);hint=hinted.index;
   assert.ok(Math.abs(hinted.s-global.s)<.5,`${name} at ${s}: ${hinted.s} vs ${global.s}`);
   assert.ok(Math.abs(hinted.offset-global.offset)<.1);
  }
 }
});
test('vehicle tuning survives reset',()=>{const car=createCar();car.tune.grip=.77;resetCar(car);assert.equal(car.tune.grip,.77);});

test('brake takes priority if accelerator and brake are pressed together',()=>{
 selectTrack('sunset');const car=createCar();simulate(car,{throttle:true},2);const before=car.speed;simulate(car,{throttle:true,brake:true},.4);assert.ok(car.speed<before);
});

test('steering sensitivity changes yaw response predictably',()=>{
 selectTrack('sunset');const low=createCar(),high=createCar();
 simulate(low,{throttle:true},2);simulate(high,{throttle:true},2);
 simulate(low,{left:true,steeringSensitivity:.75},.35);
 simulate(high,{left:true,steeringSensitivity:1.25},.35);
 assert.ok(Math.abs(high.yaw)>Math.abs(low.yaw));
});
