import test from 'node:test';
import assert from 'node:assert/strict';
import {DrivingEffects,makeDustMesh} from '../src/vfx.js';
import {createCar} from '../src/physics.js';

test('dust mesh has valid vertices and colors',()=>{
 const mesh=makeDustMesh();assert.equal(mesh.count,24);
 assert.equal(mesh.positions.length,mesh.count*3);
 assert.equal(mesh.colors.length,mesh.count*3);
 assert.ok(mesh.positions.every(Number.isFinite));
});
test('effects stay idle at low speed, spawn on drift and retire deterministically',()=>{
 const fx=new DrivingEffects(8),car=createCar();
 car.speed=8;for(let i=0;i<20;i++)fx.update(car,1/60,true);assert.equal(fx.items.length,0);
 car.speed=45;fx.update(car,.07,true);assert.equal(fx.items.length,2);
 const p=fx.items[0];assert.ok(p.total>.35&&p.x!==undefined);
 for(let i=0;i<6;i++)fx.update(car,.07,true);assert.ok(fx.items.length<=8);
 car.speed=0;for(let i=0;i<50;i++)fx.update(car,.04,false);assert.equal(fx.items.length,0);
});
test('effects control disables work and reenables emission',()=>{
 const fx=new DrivingEffects();const car=createCar();car.speed=70;
 fx.update(car,.08,true);assert.equal(fx.items.length,2);
 fx.setEnabled(false);assert.equal(fx.items.length,0);fx.update(car,.08,true);assert.equal(fx.items.length,0);
 fx.setEnabled(true);fx.update(car,.08,true);assert.equal(fx.items.length,2);
 fx.clear();assert.equal(fx.items.length,0);
});
