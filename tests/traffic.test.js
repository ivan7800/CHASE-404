import test from 'node:test';
import assert from 'node:assert/strict';
import {createTraffic,stepTraffic,sampleTrafficRoute} from '../src/traffic.js';
import {nearestStreet} from '../src/city.js';
test('traffic spawns as finite agents anchored to known roads',()=>{
 const traffic=createTraffic();assert.equal(traffic.length,7);
 for(const t of traffic){assert.ok(Number.isFinite(t.yaw));assert.ok(nearestStreet(t.x,t.z).distance<.01);}
});
test('traffic advances deterministically and pauses around player',()=>{
 const a=createTraffic(),b=createTraffic();
 for(let i=0;i<200;i++){stepTraffic(a,1/60);stepTraffic(b,1/60);}
 assert.deepEqual(a,b);
 const stopped=a[0],prior=stopped.distance;
 stepTraffic(a,1/60,{x:stopped.x,z:stopped.z});assert.equal(stopped.distance,prior);
});
test('route reverses at terminus and handles malformed timestep',()=>{
 const t=createTraffic(1)[0];const pos=sampleTrafficRoute(t.route,t.route.length+1);
 assert.ok(Number.isFinite(pos.x)&&Number.isFinite(pos.yaw));
 const saved=t.distance;stepTraffic([t],NaN);assert.equal(t.distance,saved);
 assert.equal(createTraffic(999).length,12);
});
