import test from 'node:test';
import assert from 'node:assert/strict';
import {nearestEntityDistance} from '../src/performance.js';
import {readFileSync} from 'node:fs';

test('9.5: nearest traffic distance matches reference without temporary map/filter arrays',()=>{
 const fleet=[{x:12,z:0},{x:3,z:4},{x:0,z:15},null,{x:NaN,z:1}];
 assert.equal(nearestEntityDistance(fleet,0,0),5);
 assert.equal(nearestEntityDistance([],0,0),Infinity);
 assert.equal(nearestEntityDistance([null,{x:Infinity,z:0}],0,0),Infinity);
});
test('9.5: only active patrol agents contribute, including reinforcements',()=>{
 const units=[{active:false,agent:{x:1,z:0}},{active:true,agent:{x:30,z:40}},{active:true,agent:{x:6,z:8}}];
 assert.equal(nearestEntityDistance(units,0,0,{police:true}),10);
 assert.equal(nearestEntityDistance(units.map(x=>({...x,active:false})),0,0,{police:true}),Infinity);
});
test('9.5: hot audio listener uses zero allocation nearest-distance scan',()=>{
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(source,/nearestEntityDistance\(streetTraffic,listener\.x,listener\.z\)/);
 assert.doesNotMatch(source,/streetTraffic\.map\(t=>Math\.hypot/);
 assert.doesNotMatch(source,/\[police,\.\.\.ambushPatrols\]\.filter/);
});
