import test from 'node:test';import assert from 'node:assert/strict';
import {makePedestrian,stepPedestrian} from '../src/on-foot.js';
import {SIGNALS,signalState} from '../src/signals.js';
import {nearestStreet} from '../src/city.js';
test('Gael no atraviesa un coche estacionado',()=>{const f=makePedestrian();f.active=true;f.x=5;f.z=132;const obstacle={x:5,z:132.2};stepPedestrian(f,{throttle:true},.1,[obstacle]);assert.equal(f.z,132);});
test('sin obstáculos Gael puede avanzar',()=>{const f=makePedestrian();f.active=true;f.x=5;f.z=132;stepPedestrian(f,{throttle:true},.1,[]);assert.ok(f.z>132);});
test('los semáforos visibles poseen ubicaciones finitas sobre el trazado',()=>{for(const s of SIGNALS){assert.ok(Number.isFinite(s.x)&&Number.isFinite(s.z));assert.ok(nearestStreet(s.x,s.z).distance<.01);assert.ok(['green','amber','red'].includes(signalState(s,5)));}});

test('Gael no atraviesa vehículos aunque el intervalo de simulación sea grande',()=>{const f=makePedestrian();Object.assign(f,{active:true,x:5,z:132});stepPedestrian(f,{throttle:true},1,[{x:5,z:135}]);assert.ok(f.z<133);});
test('Gael deja de animar sus pasos cuando está quieto',()=>{const f=makePedestrian();Object.assign(f,{active:true,x:5,z:132});stepPedestrian(f,{throttle:true},.1,[]);assert.equal(f.moving,true);const previous=f.step;stepPedestrian(f,{},.1,[]);assert.equal(f.moving,false);assert.equal(f.step,previous);});
test('correr acelera el movimiento a pie sin alterar los controles de conducción',()=>{const a=makePedestrian(),b=makePedestrian();Object.assign(a,{active:true,x:5,z:132});Object.assign(b,{active:true,x:5,z:132});stepPedestrian(a,{throttle:true},.1,[]);stepPedestrian(b,{throttle:true,handbrake:true},.1,[]);assert.ok(b.z>a.z);});
