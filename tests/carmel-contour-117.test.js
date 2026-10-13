import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY,CARMEL_PILOT_BLOCKS,CARMEL_PILOT_IRON,CARMEL_PILOT_STAIRS,CITY_BUILDING_COLLIDERS,cityElevation,nearestStreet,streetProfile,terrainHeightForFootprint} from '../src/city.js';

test('first Carmel streets use smaller profiles while other districts keep their existing widths',()=>{
 assert.deepEqual(streetProfile(0),{roadHalf:5.8,sidewalkHalf:8.1});
 assert.deepEqual(streetProfile(4),{roadHalf:4.6,sidewalkHalf:6.6});
 assert.deepEqual(streetProfile(19),{roadHalf:10.2,sidewalkHalf:14.2});
 assert.deepEqual({roadHalf:nearestStreet(5,132).roadHalf,sidewalkHalf:nearestStreet(5,132).sidewalkHalf},
  {roadHalf:5.8,sidewalkHalf:8.1});
});

test('three pilot blocks and hillside stairs form one walkable, collision-free route',()=>{
 assert.equal(CARMEL_PILOT_BLOCKS.length,3);
 for(let i=0;i<CARMEL_PILOT_BLOCKS.length;i++){
  const block=CARMEL_PILOT_BLOCKS[i];
  assert.equal(block.minX,160);assert.equal(block.maxX,240);
  if(i)assert.equal(CARMEL_PILOT_BLOCKS[i-1].maxZ,block.minZ);
 }
 assert.equal(CARMEL_PILOT_STAIRS.length,3);
 assert.deepEqual([CARMEL_PILOT_STAIRS[0].x2,CARMEL_PILOT_STAIRS[0].z2],
  [CARMEL_PILOT_STAIRS[1].x1,CARMEL_PILOT_STAIRS[1].z1]);
 assert.deepEqual([CARMEL_PILOT_STAIRS[1].x2,CARMEL_PILOT_STAIRS[1].z2],
  [CARMEL_PILOT_STAIRS[2].x1,CARMEL_PILOT_STAIRS[2].z1]);
 for(const route of CARMEL_PILOT_STAIRS)for(let i=0;i<=40;i++){
  const t=i/40,x=route.x1+(route.x2-route.x1)*t,z=route.z1+(route.z2-route.z1)*t;
  assert.ok(nearestStreet(x,z).distance<=CITY.sidewalkHalf+2,`stair outside walk area at ${x}, ${z}`);
  assert.equal(CITY_BUILDING_COLLIDERS.find(b=>x>=b.minX-.5&&x<=b.maxX+.5&&z>=b.minZ-.5&&z<=b.maxZ+.5),undefined,
   `stair intersects a building at ${x}, ${z}`);
 }
 const city=buildCity();let ironVertices=0;
 for(let i=0;i<city.colors.length;i+=3)if(city.colors[i]===CARMEL_PILOT_IRON[0]&&city.colors[i+1]===CARMEL_PILOT_IRON[1]&&city.colors[i+2]===CARMEL_PILOT_IRON[2])ironVertices++;
 assert.ok(ironVertices>2000,'pilot balconies and handrails should appear in the mesh');
 assert.ok(city.count<400000,`geometry budget ${city.count}`);
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
