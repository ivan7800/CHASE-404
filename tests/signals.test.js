import test from 'node:test';
import assert from 'node:assert/strict';
import {SIGNALS,signalState,mustYieldSignal} from '../src/signals.js';
import {createTraffic,stepTraffic} from '../src/traffic.js';
test('señales con ciclo determinista y fases',()=>{const s=SIGNALS[0];assert.equal(signalState(s,0),'green');assert.equal(signalState(s,11),'amber');assert.equal(signalState(s,15),'red');assert.equal(signalState(s,22),'green');});
test('el semáforo obliga a ceder al aproximarse',()=>{const s=SIGNALS[0];const v={x:s.x-7,z:s.z,yaw:Math.PI/2,route:{}};assert.equal(mustYieldSignal(v,15),true);assert.equal(mustYieldSignal(v,0),false);});
test('un vehículo aparcado no avanza con el tráfico',()=>{const cars=createTraffic(2);cars[0].parked=true;const {x,z}=cars[0];stepTraffic(cars,1/60,null,15);assert.equal(cars[0].x,x);assert.equal(cars[0].z,z);});
