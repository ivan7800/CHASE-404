import test from 'node:test';import assert from 'node:assert/strict';
import {makePedestrian,exitVehicle,stepPedestrian,enterVehicle,closestVehicle} from '../src/on-foot.js';
import {createUrbanCar} from '../src/physics.js';
import {CITY,nearestStreet} from '../src/city.js';
test('no se puede bajar de un vehículo en marcha',()=>{const c=createUrbanCar(),f=makePedestrian();c.speed=9;assert.equal(exitVehicle(f,c),false);assert.equal(f.active,false);});
test('Gael baja, camina y vuelve al vehículo',()=>{const c=createUrbanCar(),f=makePedestrian();assert.equal(exitVehicle(f,c),true);assert.equal(f.active,true);const z=f.z;stepPedestrian(f,{throttle:true},.1);assert.ok(f.z>=z);assert.equal(closestVehicle(f,c,[])?.type,'player');assert.equal(enterVehicle(f,c,[]),'player');assert.equal(f.active,false);});
test('cambiar a un coche de tráfico parado retira ese vehículo',()=>{const c=createUrbanCar(),f=makePedestrian();assert.equal(exitVehicle(f,c),true);const v={x:f.x+2,z:f.z,yaw:1,currentSpeed:0};const cars=[v];assert.equal(enterVehicle(f,c,cars),'traffic');assert.equal(c.x,v.x);assert.equal(c.speed,0);assert.equal(cars.length,1);assert.equal(cars[0].parked,true);});
test('no se permite entrar en coches que circulan',()=>{const c=createUrbanCar(),f=makePedestrian();exitVehicle(f,c);c.x+=100;c.z+=100;const v={x:f.x,z:f.z,yaw:0,currentSpeed:5};assert.equal(enterVehicle(f,c,[v]),null);assert.equal(f.active,true);});

test('cambiar de coche aplica modelo, ficha técnica y daño nuevo',()=>{const car=createUrbanCar(),foot=makePedestrian();car.vehicleId='racer';car.damage=75;exitVehicle(foot,car);car.x+=100;car.z+=100;const v={x:foot.x,z:foot.z,yaw:.4,currentSpeed:0,vehicleId:'blaze'};const traffic=[v];assert.equal(enterVehicle(foot,car,traffic),'traffic');assert.equal(car.vehicleId,'blaze');assert.equal(car.tune.power,1.11);assert.equal(car.damage,0);assert.equal(traffic.length,1);assert.equal(traffic[0].parked,true);});
test('los vehículos no identificados reciben ficha segura por defecto',()=>{const car=createUrbanCar(),foot=makePedestrian();exitVehicle(foot,car);car.x+=100;car.z+=100;const traffic=[{x:foot.x,z:foot.z,yaw:0,currentSpeed:0}];assert.equal(enterVehicle(foot,car,traffic),'traffic');assert.equal(car.vehicleId,'racer');});

test('Gael utiliza la puerta alternativa si hay un coche bloqueando la salida habitual',()=>{
 const car=createUrbanCar(),foot=makePedestrian();const x=car.x+Math.cos(car.yaw)*3.9,z=car.z-Math.sin(car.yaw)*3.9;
 assert.equal(exitVehicle(foot,car,[{x,z}]),true);assert.ok(Math.hypot(foot.x-x,foot.z-z)>3);
});
test('no se permite bajar cuando ambas salidas están ocupadas',()=>{
 const car=createUrbanCar(),foot=makePedestrian();const dx=Math.cos(car.yaw)*3.9,dz=-Math.sin(car.yaw)*3.9;
 assert.equal(exitVehicle(foot,car,[{x:car.x+dx,z:car.z+dz},{x:car.x-dx,z:car.z-dz}]),false);
 assert.equal(foot.active,false);
});


test('al bajar del coche se conserva la orientación inicial de cámara a pie',()=>{
 const car=createUrbanCar(),foot=makePedestrian();
 car.yaw=Math.PI/2;
 assert.equal(exitVehicle(foot,car),true);
 assert.equal(foot.viewYaw,Math.PI/2);
 const oldCameraYaw=foot.viewYaw;
 stepPedestrian(foot,{left:true},.1);
 assert.ok(foot.moving);
 assert.equal(foot.viewYaw,oldCameraYaw,'el cuerpo gira pero la cámara no debe hacerlo');
 assert.ok(Math.abs(foot.yaw-oldCameraYaw)>1,'Gael cambia la dirección del cuerpo');
});

test('WASD a pie mantiene adelante, atrás, izquierda y derecha respecto a cámara desde cualquier orientación',()=>{
 const combinations=[
  [{throttle:true},1,0,'W'],[{brake:true},-1,0,'S'],
  [{left:true},0,1,'A'],[{right:true},0,-1,'D']
 ];
 for(const heading of [0,Math.PI/2,Math.PI,-Math.PI/2,.79]){
  for(const [input,expectedForward,expectedLeft,key] of combinations){
   // Start on a public road center, with no traffic, to isolate steering math.
   const foot={active:true,x:5,z:132,yaw:heading,viewYaw:heading,step:0,moving:false};
   stepPedestrian(foot,input,.08);
   assert.equal(foot.moving,true,`no movement with ${key} at heading ${heading}`);
   const dx=foot.x-5,dz=foot.z-132;
   const forward=dx*Math.sin(heading)+dz*Math.cos(heading);
   const left=dx*Math.cos(heading)-dz*Math.sin(heading);
   const length=Math.hypot(dx,dz);
   assert.ok(Math.abs(forward/length-expectedForward)<1e-8,`${key} forward projection at ${heading}`);
   assert.ok(Math.abs(left/length-expectedLeft)<1e-8,`${key} lateral projection at ${heading}`);
  }
 }
});

test('cambiar de dirección y caminar en diagonal no altera el rumbo de la cámara',()=>{
 const foot={active:true,x:5,z:132,yaw:0,viewYaw:Math.PI/2,step:0,moving:false};
 stepPedestrian(foot,{throttle:true},.08);
 const x=foot.x,z=foot.z;
 stepPedestrian(foot,{right:true},.08);
 assert.ok(foot.z>z,'D debe mover a la derecha de la cámara al mirar hacia +X');
 stepPedestrian(foot,{throttle:true,left:true},.08);
 assert.equal(foot.viewYaw,Math.PI/2);
 assert.ok(foot.x>x,'la diagonal incluye avance');
 assert.ok(foot.moving);
});


test('la salida del coche nunca deja a Gael fuera del corredor transitable',()=>{
 const car=createUrbanCar(),foot=makePedestrian();
 Object.assign(car,{x:5,z:144.9,yaw:-Math.PI/2,speed:0});
 assert.equal(exitVehicle(foot,car),true);
 assert.ok(nearestStreet(foot.x,foot.z).distance<=CITY.sidewalkHalf+2,
   'Gael no debe aparecer en un punto que el motor de caminar bloquea');
 stepPedestrian(foot,{throttle:true},.05);
 assert.ok(foot.moving,'puede caminar desde donde bajó del coche');
});
