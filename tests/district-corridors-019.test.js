import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCity,CITY_BUILDING_COLLIDERS,DISTRICT_CORRIDORS_019} from '../src/city.js';

test('district corridors preserve building collisions and geometry headroom',()=>{
 assert.equal(DISTRICT_CORRIDORS_019.gracia.length,3);
 assert.equal(DISTRICT_CORRIDORS_019.guinardo.length,3);
 assert.equal(CITY_BUILDING_COLLIDERS.length,124);
 const city=buildCity();
 assert.ok(city.count<385000,`city geometry budget: ${city.count}`);
 assert.ok(city.positions.every(Number.isFinite));
 const near=(x,z,color)=>{
  let n=0;
  for(let i=0;i<city.count;i++){
   const k=i*3;
   if(Math.abs(city.positions[k]-x)<20&&Math.abs(city.positions[k+2]-z)<.3
    &&color.every((v,j)=>city.colors[k+j]===v))n++;
  }
  return n;
 };
 assert.ok(near(-346,17.22,[137,110,89])>=36,'Gràcia tiled frontage missing');
 assert.ok(near(-110,339.19,[116,96,82])>=36,'Guinardó workshop frontage missing');
 const glazed=(z,normal)=>{
  let n=0;
  for(let i=0;i<city.count;i++){
   const k=i*3;
   if(Math.abs(city.positions[k]+660)<20&&Math.abs(city.positions[k+2]-z)<.001
    &&city.colors[k]===58&&city.colors[k+1]===75&&city.colors[k+2]===80
    &&city.normals[k+2]*normal>.99)n++;
  }
  return n;
 };
 assert.ok(glazed(-59.91,1)>=90,'front glass normal points outwards');
 assert.ok(glazed(-98.09,-1)>=90,'rear glass normal points outwards');
 console.log(`city vertices: ${city.count}`);
});
