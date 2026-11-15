import {nearestStreet} from '../src/city.js';
import {cityBuildingAt} from '../src/urban-buildings.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {SIGNALS,SIGNAL_POLES,signalState,mustYieldSignal} from '../src/signals.js';
import {createTraffic,stepTraffic} from '../src/traffic.js';
test('señales con ciclo determinista y fases',()=>{const s=SIGNALS[0];assert.equal(signalState(s,0),'green');assert.equal(signalState(s,11),'amber');assert.equal(signalState(s,15),'red');assert.equal(signalState(s,22),'green');});
test('el semáforo obliga a ceder al aproximarse',()=>{const s=SIGNALS[0];const v={x:s.x-7,z:s.z,yaw:Math.PI/2,route:{}};assert.equal(mustYieldSignal(v,15),true);assert.equal(mustYieldSignal(v,0),false);});
test('un vehículo aparcado no avanza con el tráfico',()=>{const cars=createTraffic(2);cars[0].parked=true;const {x,z}=cars[0];stepTraffic(cars,1/60,null,15);assert.equal(cars[0].x,x);assert.equal(cars[0].z,z);});


test('visible traffic signals stand on sidewalks and face their approach',()=>{
 assert.equal(SIGNAL_POLES.length,SIGNALS.length);
 for(const pole of SIGNAL_POLES){
  assert.ok(pole);
  const street=nearestStreet(pole.x,pole.z);
  assert.ok(street.distance>street.roadHalf+.35&&street.distance<=street.sidewalkHalf);
  assert.equal(cityBuildingAt(pole.x,pole.z,.7),null);
  assert.ok(Number.isFinite(pole.yaw));
 }
});
