import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {decodeGLB} from '../src/glb.js';
import {buildVerenneV8} from '../src/hero-car.js';
const mesh=buildVerenneV8();
test('Verenne V8 has substantial detailed geometry, with valid color buffers',()=>{
 assert.ok(mesh.count>2200);
 assert.equal(mesh.count%3,0);
 assert.equal(mesh.colors.length,mesh.count*3);
 assert.ok(mesh.positions.every(Number.isFinite));
});
test('Verenne V8 stays within chase-game body proportions',()=>{
 const xs=[],ys=[],zs=[];
 for(let i=0;i<mesh.positions.length;i+=3){xs.push(mesh.positions[i]);ys.push(mesh.positions[i+1]);zs.push(mesh.positions[i+2]);}
 assert.ok(Math.max(...xs)<=2.0&&Math.min(...xs)>=-2.0);
 assert.ok(Math.max(...zs)<=4.25&&Math.min(...zs)>=-4.25);
 assert.ok(Math.min(...ys)>=0&&Math.max(...ys)<2.9);
});
test('Remastered BLAZE GLB decodes through exact engine importer',()=>{
 const buf=readFileSync(new URL('../assets/models/blaze.glb',import.meta.url));
 const decoded=decodeGLB(buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength));
 assert.equal(decoded.count,mesh.count);
});
