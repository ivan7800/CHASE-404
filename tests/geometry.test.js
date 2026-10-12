import test from 'node:test';import assert from 'node:assert/strict';
import {buildTrack,buildCar,buildWheels} from '../src/geometry.js';
test('geometry buffers contain finite vertices and normals',()=>{
 for(const [name,fn] of [['track',buildTrack],['car',buildCar],['wheels',buildWheels]]){
  const geo=fn();assert.ok(geo.count>300,name+' has mesh');assert.equal(geo.positions.length,geo.count*3);assert.equal(geo.normals.length,geo.count*3);assert.equal(geo.colors.length,geo.count*3);assert.ok(geo.positions.every(Number.isFinite),name+' positions');assert.ok(geo.normals.every(Number.isFinite),name+' normals');
 }
});
