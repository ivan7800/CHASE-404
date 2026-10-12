import test from 'node:test';
import assert from 'node:assert/strict';
import {makePedestrian,recenterPedestrianCamera,stepPedestrian} from '../src/on-foot.js';
import {advanceCameraRig,makeCameraRig} from '../src/camera-rig.js';

test('C recentra la cámara de Gael solo cuando está a pie',()=>{
 const f=makePedestrian(); f.yaw=1.25;f.viewYaw=-.5;
 assert.equal(recenterPedestrianCamera(f),false);
 assert.equal(f.viewYaw,-.5);
 f.active=true;assert.equal(recenterPedestrianCamera(f),true);assert.equal(f.viewYaw,1.25);
});
test('W tras recentrar continúa avanzando según la nueva cámara',()=>{
 const f={active:true,x:5,z:132,yaw:Math.PI/2,viewYaw:0,step:0,moving:false};
 recenterPedestrianCamera(f);stepPedestrian(f,{throttle:true},.1);
 assert.ok(f.x>5);assert.ok(Math.abs(f.z-132)<1e-6);
});
test('la cámara a pie responde con más agilidad que la cámara de coche',()=>{
 const car={x:0,z:0,yaw:0,speed:0};const foot={active:true,x:0,z:0,yaw:0,viewYaw:0};
 const a=makeCameraRig(),b=makeCameraRig();
 advanceCameraRig(a,car,{dt:1/60,foot,elevation:()=>0});
 advanceCameraRig(b,car,{dt:1/60,elevation:()=>0});
 foot.x=5;car.x=5;
 const fa=advanceCameraRig(a,car,{dt:1/60,foot,elevation:()=>0});
 const fb=advanceCameraRig(b,car,{dt:1/60,elevation:()=>0});
 assert.ok(fa.eye.x>fb.eye.x);
});
