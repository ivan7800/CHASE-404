import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,cityElevation,cityStartPose,nearestStreet} from '../src/city.js';
import {createUrbanCar,step,FIXED_STEP} from '../src/physics.js';

test('El Carmel 1984 terrain and district mesh are finite',()=>{
 const mesh=buildCity();assert.ok(mesh.count>50000);assert.ok(mesh.positions.every(Number.isFinite));
 const xs=mesh.positions.filter((_,i)=>i%3===0),zs=mesh.positions.filter((_,i)=>i%3===2);
 const limits=a=>a.reduce(([lo,hi],v)=>[Math.min(lo,v),Math.max(hi,v)],[Infinity,-Infinity]);
 const [minX,maxX]=limits(xs),[minZ,maxZ]=limits(zs);
 const streetXs=CITY.streets.flat().map(p=>p[0]),streetZs=CITY.streets.flat().map(p=>p[1]);
 assert.ok(minX<=Math.min(...streetXs)&&maxX>=Math.max(...streetXs));
 assert.ok(minZ<=Math.min(...streetZs)&&maxZ>=Math.max(...streetZs));
 assert.ok(minX>=-1800&&maxX<=400&&minZ>=-1000&&maxZ<=550);
 assert.ok(cityElevation(...CITY.viewpoint)>cityElevation(-240,210)+20);
});

test('winding neighborhood roads include connected junctions and a valid spawn',()=>{
 assert.equal(CITY.year,1984);assert.ok(CITY.streets.length>=10);
 for(const p of [[216,-120],[-42,12],[-176,-64],[96,-22]])assert.ok(nearestStreet(...p).distance<2);
 const start=cityStartPose();assert.ok(nearestStreet(start.x,start.z).distance<1);
});

test('urban handling climbs the Carmel streets without lap projection',()=>{
 const car=createUrbanCar();for(let i=0;i<240;i++)step(car,{throttle:true},FIXED_STEP);
 assert.equal(car.urban,true);assert.ok(car.x>5);assert.ok(car.kmh>0);assert.equal(car.completed,0);
});

test('building edges correct the car to the nearest street',()=>{
 const car=createUrbanCar();car.x=20;car.z=20;car.speed=25;car.vx=0;car.vz=25;
 for(let i=0;i<4;i++)step(car,{throttle:true},FIXED_STEP);
 assert.equal(car.wall,true);assert.ok(nearestStreet(car.x,car.z).distance<=16.2);assert.ok(Number.isFinite(car.speed));
});
