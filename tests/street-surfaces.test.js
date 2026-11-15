import test from 'node:test';
import assert from 'node:assert/strict';
import {Builder} from '../src/geometry.js';
import {buildCity,buildStreetSurfaces,cityElevation,nearestStreet,STREET_SPACES,GRACIA_ROW} from '../src/city.js';
import {cityBuildingAt} from '../src/urban-buildings.js';

test('asphalt, sidewalks, curbs and paint receive light from above on both sides of the road',()=>{
 const builder=new Builder();
 buildStreetSurfaces(builder);
 const mesh=builder.finish();
 assert.ok(mesh.count>1000);
 for(let i=1;i<mesh.normals.length;i+=3)assert.ok(mesh.normals[i]>.7);
});

test('street junction mesh contains no widening beyond the road envelope',()=>{
 const builder=new Builder();
 buildStreetSurfaces(builder);
 const mesh=builder.finish();
 for(let i=0;i<mesh.positions.length;i+=3){
  if(mesh.colors[i]!==54||mesh.colors[i+1]!==57||mesh.colors[i+2]!==59)continue;
  const x=mesh.positions[i],z=mesh.positions[i+2],street=nearestStreet(x,z);
  // At a connection between widths, a vertex can belong to the wider road
  // even when its nearest centerline belongs to the narrower one.
  assert.ok(street.distance<=10.201,`asphalt outside maximum carriageway at ${x}, ${z}`);
  assert.ok(Math.abs(mesh.positions[i+1]-cityElevation(x,z)-.32)<.001);
 }
});

test('expanded pedestrian space connects to pavements clear of carriageways and buildings',()=>{
 for(const {minX,maxX,minZ,maxZ} of STREET_SPACES){
  for(const x of [minX,maxX])for(const z of [minZ,(minZ+maxZ)/2,maxZ]){
   const street=nearestStreet(x,z);
   assert.ok(street.distance>street.roadHalf);
   assert.ok(street.distance<=16.2);
   assert.equal(cityBuildingAt(x,z,.5),null);
  }
  const mid=nearestStreet(maxX,(minZ+maxZ)/2);
  assert.ok(mid.distance<=mid.sidewalkHalf);
 }
});

test('the hillside mesh faces the sky and retains the terrain elevation',()=>{
 const mesh=buildCity();
 let checks=0;
 for(let i=0;i<mesh.positions.length;i+=3){
  const terrain=(mesh.colors[i]===88&&mesh.colors[i+1]===104&&mesh.colors[i+2]===76)
    ||(mesh.colors[i]===127&&mesh.colors[i+1]===119&&mesh.colors[i+2]===100);
  if(!terrain)continue;
  const [x,y,z]=mesh.positions.subarray(i,i+3);
  if(Math.abs(y-cityElevation(x,z)+.32)>.001)continue;
  assert.ok(mesh.normals[i+1]>.7);
  checks++;
 }
 assert.ok(checks>1000);
});

test('new Gràcia plots are solid while the adjacent travel lane and sidewalk remain clear',()=>{
 for(const {x,z} of GRACIA_ROW){
  assert.ok(cityBuildingAt(x,z));
  for(const dx of [-3,0,3,7.2]){
   const roadX=-410+dx;
   assert.equal(cityBuildingAt(roadX,z,.7),null);
  }
 }
});
