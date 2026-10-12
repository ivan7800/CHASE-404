import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {decodeGLB} from '../src/glb.js';
const file=new URL('../assets/models/racer-04.glb', import.meta.url);
test('local GLB has valid geometry and paint color',()=>{
 const raw=fs.readFileSync(file);const buffer=raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength);
 const model=decodeGLB(buffer);
 assert.ok(model.count>300);
 assert.equal(model.positions.length,model.count*3);
 assert.ok(model.positions.every(Number.isFinite));
 assert.ok(model.normals.every(Number.isFinite));
 const y=[];const z=[];for(let i=0;i<model.positions.length;i+=3){y.push(model.positions[i+1]);z.push(model.positions[i+2]);}
 assert.ok(Math.max(...y)>2.4&&Math.min(...y)>.1);
 assert.ok(Math.max(...z)>3.7&&Math.min(...z)<-3.7);
 assert.ok(model.colors.some(c=>c>180));
});
test('GLB loader refuses invalid files',()=>{
 assert.throws(()=>decodeGLB(new ArrayBuffer(24)),/GLB/);
});
