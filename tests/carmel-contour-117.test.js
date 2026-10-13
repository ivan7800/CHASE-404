import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,cityElevation,nearestStreet,streetProfile,terrainHeightForFootprint} from '../src/city.js';

test('first Carmel streets use smaller profiles while other districts keep their existing widths',()=>{
 assert.deepEqual(streetProfile(0),{roadHalf:5.8,sidewalkHalf:8.1});
 assert.deepEqual(streetProfile(4),{roadHalf:4.6,sidewalkHalf:6.6});
 assert.deepEqual(streetProfile(19),{roadHalf:10.2,sidewalkHalf:14.2});
 assert.deepEqual({roadHalf:nearestStreet(5,132).roadHalf,sidewalkHalf:nearestStreet(5,132).sidewalkHalf},
  {roadHalf:5.8,sidewalkHalf:8.1});
});

test('sloped house bases clear the sampled terrain and retaining stone stays within mesh budget',()=>{
 for(const [x,z,w,d] of [[-200,-200,28,31],[-120,120,23,25],[100,200,28,31]]){
  const base=terrainHeightForFootprint(x,z,w,d);
  for(let i=0;i<=8;i++)for(const [px,pz] of [
   [x-w/2+i*w/8,z-d/2],[x-w/2+i*w/8,z+d/2],
   [x-w/2,z-d/2+i*d/8],[x+w/2,z-d/2+i*d/8]
  ])assert.ok(base>=cityElevation(px,pz)+.075);
 }
 const city=buildCity();
 let stoneVertices=0;
 for(let i=0;i<city.colors.length;i+=3)if(city.colors[i]===133&&city.colors[i+1]===119&&city.colors[i+2]===99)stoneVertices++;
 assert.ok(stoneVertices>0,'visible retaining walls should be included in the city mesh');
 assert.ok(city.count<400000,`geometry budget ${city.count}`);
});
