import test from 'node:test';
import assert from 'node:assert/strict';
import {CITY,CITY_BUILDING_COLLIDERS,cityStartPose} from '../src/city.js';
import {cityBuildingAt,resolveCityBuildingMove} from '../src/urban-buildings.js';
import {createUrbanCar,step,FIXED_STEP} from '../src/physics.js';
import {makePedestrian,stepPedestrian,exitVehicle} from '../src/on-foot.js';

test('built structures have colliders and no street centerline runs through one',()=>{
 assert.ok(CITY_BUILDING_COLLIDERS.length>110);
 assert.equal(cityBuildingAt(cityStartPose().x,cityStartPose().z,1.65),null);
 for(const path of CITY.streets)for(let i=1;i<path.length;i++){
  const [ax,az]=path[i-1],[bx,bz]=path[i];
  const n=Math.ceil(Math.hypot(bx-ax,bz-az)/2);
  for(let j=0;j<=n;j++){
   const t=j/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t;
   assert.equal(cityBuildingAt(x,z,1.65),null,`road blocked near ${x}, ${z}`);
  }
 }
});

test('swept vehicle footprint stops at a facade, slides along it and never tunnels through',()=>{
 const b=CITY_BUILDING_COLLIDERS.find(v=>v.id==='building-3');
 assert.ok(b);
 const x=b.x,startZ=b.maxZ+11,yaw=Math.PI;
 const impact=resolveCityBuildingMove(x,startZ,x,b.minZ-10,{radius:1.65,along:[-2.25,0,2.25],yaw});
 assert.equal(impact.hit?.box,b);
 assert.ok(impact.z>=b.maxZ+1.65+2.25-.03);
 const glide=resolveCityBuildingMove(x,startZ,x+25,b.minZ-10,{radius:1.65,along:[-2.25,0,2.25],yaw});
 assert.ok(glide.hit&&glide.x>x+8,'tangential movement should remain possible');
 assert.equal(cityBuildingAt(glide.x,glide.z,1.65),null);
});

test('driving into a Carmel house stops without a centerline teleport',()=>{
 const car=createUrbanCar();Object.assign(car,{x:-196,z:-112,yaw:Math.PI,speed:0,vx:0,vz:0});
 let maxStep=0,contact=false;
 for(let i=0;i<600;i++){
  const previousZ=car.z;
  step(car,{throttle:true},FIXED_STEP);
  maxStep=Math.max(maxStep,Math.abs(car.z-previousZ));contact ||=car.wall;
 }
 assert.ok(contact);
 assert.ok(car.z>-124,`front bumper before the facade: ${car.z}`);
 assert.ok(maxStep<.3,`unexpected jump: ${maxStep}`);
 assert.equal(cityBuildingAt(car.x,car.z,1.65),null);
});

test('walking and car exits respect the same house footprint',()=>{
 const foot=makePedestrian();Object.assign(foot,{active:true,x:-196,z:-112,yaw:Math.PI,viewYaw:Math.PI});
 for(let i=0;i<220;i++)stepPedestrian(foot,{throttle:true},1/60);
 assert.ok(foot.z>-125.3&&foot.z<-122,`walker stopped at wall: ${foot.z}`);
 assert.equal(cityBuildingAt(foot.x,foot.z,.5),null);
 const car=createUrbanCar();Object.assign(car,{x:-196,z:-119,yaw:0,speed:0});
 const bothSides=[{x:car.x+3.9,z:car.z},{x:car.x-3.9,z:car.z}];
 const other=makePedestrian();assert.equal(exitVehicle(other,car,bothSides),false);
});
