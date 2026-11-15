import test from 'node:test';
import assert from 'node:assert/strict';
import {CITY,CITY_BUILDING_COLLIDERS,CARMEL_PROMENADE,nearestStreet} from '../src/city.js';
import {cityBuildingAt,resolveCityBuildingMove} from '../src/urban-buildings.js';
import {cityMapView,cityMapTarget} from '../src/city-map.js';
import {createPolice,stepPolice} from '../src/police.js';
import {createUrbanCar,FIXED_STEP,step} from '../src/physics.js';
import {stepUrbanContacts} from '../src/urban-collisions.js';
import {soundFrame} from '../src/soundscape.js';
import {speedWarning} from '../src/threat-feedback.js';

test('local map follows the player, overview frames all streets and remote objectives show direction',()=>{
 const place={x:5,z:132},w=230,h=200;
 const near=cityMapView(w,h,place),general=cityMapView(w,h,place,true);
 assert.deepEqual(near.locate([5,132]),[115,100]);
 assert.ok(near.scale>general.scale*4);
 for(const [x,y] of CITY.streets.flat().map(general.locate))assert.ok(x>0&&x<w&&y>0&&y<h);
 assert.deepEqual(cityMapTarget(near.locate([-875,132]),w,h),{x:13,y:100,outside:true,angle:Math.PI});
});

test('a low speed right turn points down the cross street without hitting a building',()=>{
 const car=createUrbanCar();
 Object.assign(car,{x:-710,z:-5,yaw:Math.PI/2,speed:8,vx:8,vz:0});
 for(let i=0;i<190;i++)step(car,{right:true},FIXED_STEP);
 assert.ok(Math.abs(car.yaw)<.22);
 assert.ok(car.z>-2&&!car.wall&&!car.offroad);
});

test('a nudge from another car cannot put the player inside a facade',()=>{
 const lot=CITY_BUILDING_COLLIDERS[0];
 const car={x:lot.maxX+1.8,z:lot.z,yaw:0,speed:8,vx:0,vz:8};
 assert.equal(stepUrbanContacts(car,[{x:car.x+1.3,z:car.z}],1/60).contacts,1);
 assert.equal(cityBuildingAt(car.x,car.z,1.65),null);
});

test('a corner blocks arrest and does not reveal a hidden driver to a fresh patrol',()=>{
 const lot=CITY_BUILDING_COLLIDERS[0];
 const player={x:lot.maxX-3.5,z:lot.maxZ+1,kmh:0};
 const patrol=createPolice();
 Object.assign(patrol,{active:true});
 Object.assign(patrol.agent,{x:lot.maxX+.85,z:lot.maxZ-3.8});
 assert.ok(Math.hypot(patrol.agent.x-player.x,patrol.agent.z-player.z)<7);
 assert.ok(resolveCityBuildingMove(patrol.agent.x,patrol.agent.z,player.x,player.z,{radius:.25}).hit);
 for(let i=0;i<32;i++)stepPolice(patrol,.1,player);
 assert.equal(patrol.captured,false);
 assert.equal(patrol.arrest,0);
 assert.equal(patrol.searching,true);
 assert.equal(patrol.lastSeen,null);
});

test('an automatic patrol stays back at a bend and heat is displayed before it arrives',()=>{
 const driver={x:106,z:132,yaw:Math.PI/2,kmh:90};
 const patrol=createPolice();patrol.heat=1.5;
 assert.equal(speedWarning(patrol.heat).fill,.5);
 for(let i=0;i<16;i++)stepPolice(patrol,.1,driver);
 assert.ok(patrol.active);
 assert.ok(Math.hypot(driver.x-patrol.agent.x,driver.z-patrol.agent.z)>=25);
 assert.deepEqual(patrol.lastSeen,{x:106,z:132});
});

test('the siren recedes during the search at the same distance',()=>{
 const approach={urban:true,policeActive:true,policeDistance:25};
 assert.ok(soundFrame({...approach,policeSearching:true}).siren<soundFrame(approach).siren*.6);
});

test('Carmel promenade connects to the sidewalk without changing the lane or blocking the walking strip',()=>{
 const {fromX,toX,minZ,maxZ}=CARMEL_PROMENADE;
 for(let x=fromX;x<=toX;x+=2){
  const edge=nearestStreet(x,minZ),end=nearestStreet(x,maxZ);
  assert.ok(edge.distance>edge.roadHalf&&edge.distance<=edge.sidewalkHalf);
  assert.ok(end.distance<=16.2);
  assert.equal(cityBuildingAt(x,(minZ+maxZ)/2,.6),null);
 }
});
