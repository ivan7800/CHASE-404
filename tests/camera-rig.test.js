import test from 'node:test';
import assert from 'node:assert/strict';
import {makeCameraRig,resetCameraRig,queueCameraImpact,advanceCameraRig} from '../src/camera-rig.js';
const makeCar=(properties={})=>({x:0,z:0,yaw:0,speed:0,steer:0,vx:0,vz:0,...properties});
const render=(rig,car,options={})=>advanceCameraRig(rig,car,{dt:1/60,elevation:()=>0,...options});
const finite=shot=>[...Object.values(shot.eye),...Object.values(shot.target),shot.fov,shot.roll].every(Number.isFinite);

test('6.3: la cámara de seguimiento arranca detrás del coche con horizonte estable',()=>{
 const rig=makeCameraRig(),shot=render(rig,makeCar());
 assert.ok(Math.abs(shot.eye.z+11)<1e-8);assert.equal(shot.eye.y,6.7);
 assert.equal(shot.target.z,13);assert.equal(shot.fov,58);assert.ok(Math.abs(shot.roll)<1e-9);assert.ok(finite(shot));
});

test('6.3: velocidad elevada amplía el plano, aumenta el campo de visión sin superar límites',()=>{
 const idle=render(makeCameraRig(),makeCar());
 const speed=render(makeCameraRig(),makeCar({speed:68,vz:68}));
 assert.ok(speed.eye.z<idle.eye.z-2);assert.ok(speed.eye.y>idle.eye.y);
 assert.ok(speed.fov>idle.fov+11);assert.ok(speed.fov<=80);assert.ok(finite(speed));
});

test('6.3: derrape real desplaza lateralmente la cámara y orienta el plano',()=>{
 const neutral=render(makeCameraRig(),makeCar({speed:35,vz:35}));
 const drift=render(makeCameraRig(),makeCar({speed:35,vx:10,vz:28,steer:.65}));
 assert.ok(Math.abs(drift.eye.x-neutral.eye.x)>.15);
 assert.ok(Math.abs(drift.target.x-neutral.target.x)>.2);
 assert.ok(drift.roll<0&&Math.abs(drift.roll)<.04);
});

test('6.3: FX OFF y reducir movimiento eliminan zoom dinámico, inclinación y sacudidas',()=>{
 const rig=makeCameraRig(),car=makeCar({speed:55,vx:12,vz:50,steer:.9});
 queueCameraImpact(rig,1);
 const shot=render(rig,car,{motion:false});
 assert.equal(shot.fov,58);assert.equal(shot.roll,0);
 assert.equal(shot.eye.x,0);assert.equal(shot.eye.z,-11);
 assert.equal(shot.eye.y,6.7);assert.ok(finite(shot));
});

test('6.3: impactos simultáneos quedan acotados, decaen y no afectan con actor a pie',()=>{
 const rig=makeCameraRig();for(let n=0;n<100;n++)queueCameraImpact(rig,30);
 assert.equal(rig.impact,1,'sin acumulación infinita');
 const car=makeCar({speed:35,vz:35});const before=render(rig,car);
 assert.ok(before.impact>0&&before.impact<1);
 for(let n=0;n<125;n++)render(rig,car);
 assert.ok(rig.impact<.01,'decaimiento temporal');
 resetCameraRig(rig);queueCameraImpact(rig,1);
 const walking=render(rig,car,{foot:{active:true,x:5,z:7,yaw:0}});
 assert.equal(walking.eye.x,5);assert.equal(walking.eye.z,0);
});

test('6.3: los cambios bruscos de dirección no teletransportan la cámara y reset elimina estado anterior',()=>{
 const rig=makeCameraRig(),car=makeCar({speed:25,vz:25});
 const before=render(rig,car);const after=render(rig,makeCar({x:10,z:4,yaw:Math.PI,speed:25,vz:-25}));
 assert.ok(Math.hypot(after.eye.x-before.eye.x,after.eye.z-before.eye.z)<8);
 resetCameraRig(rig);
 const fresh=render(rig,makeCar({x:10,z:4,yaw:Math.PI}));
 assert.ok(Math.abs(fresh.eye.z-15)<1e-8);assert.equal(rig.impact,0);
});

test('6.3: pendiente urbana determina la altura de la cámara y modo BONNET no dibuja desplazamiento de derrape',()=>{
 const car=makeCar({x:20,z:35,yaw:.8,speed:32,vx:10,vz:23});
 const height=()=>5;
 const shot=render(makeCameraRig(),car,{mode:2,urban:true,elevation:height});
 assert.ok(shot.eye.y>7&&shot.eye.y<9);assert.equal(shot.fov,63);assert.equal(shot.roll,0);
 assert.ok(finite(shot));
});

test('6.3: la integración visual conecta impactos reales y respeta la preferencia de movimiento',async()=>{
 const {readFileSync}=await import('node:fs');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const rendererSource=readFileSync(new URL('../src/renderer.js',import.meta.url),'utf8');
 assert.match(main,/cinematicImpact\(Math\.min\(1,\.24\+severity\/24\)\)/,'colisión vehicular');
 assert.match(main,/cinematicImpact\(Math\.min\(1,\.2\+severity\/24\)\)/,'barrera');
 assert.match(main,/if\(!urbanMode&&result\.contact&&!previousRaceContact\)cinematicImpact\(\.42\)/,'choque inicial en circuito');
 assert.match(main,/reduced\|\|!effectsEnabled/,'desactivación de flash de impacto');
 assert.match(rendererSource,/motion:this\.effectsEnabled/,'desactivar efectos también afecta al movimiento de cámara');
 assert.match(rendererSource,/advanceCameraRig\(this\.cameraRig/,'cámara integrada en WebGL');
});


test('6.3: desactivar efectos en marcha anula zoom, giro e impacto inmediatamente',()=>{
 const rig=makeCameraRig(),car=makeCar({speed:58,vx:12,vz:52,steer:.9});
 render(rig,car);queueCameraImpact(rig,.9);render(rig,car);
 assert.ok(rig.fov>60);assert.ok(Math.abs(rig.roll)>0);
 const off=render(rig,car,{motion:false});
 assert.equal(off.fov,58);assert.equal(off.roll,0);assert.equal(off.impact,0);
});


test('la cámara a pie permanece alineada con la vista, aunque Gael gire al caminar',()=>{
 const car={x:5,z:132,yaw:Math.PI/2,speed:0,steer:0};
 const foot={active:true,x:5,z:132,yaw:Math.PI/2,viewYaw:Math.PI/2};
 const getShot=()=>advanceCameraRig(makeCameraRig(),car,{dt:1/60,urban:true,foot,elevation:()=>0});
 const before=getShot();
 foot.yaw=0; // Gael gira a izquierda/derecha en respuesta al movimiento.
 const after=getShot();
 for(const axis of ['x','y','z']){
  assert.ok(Math.abs(before.eye[axis]-after.eye[axis])<1e-10,`posición de cámara ${axis}`);
  assert.ok(Math.abs(before.target[axis]-after.target[axis])<1e-10,`objetivo de cámara ${axis}`);
 }
 assert.ok(after.eye.x<foot.x,'al mirar hacia +X, cámara colocada por detrás');
});
