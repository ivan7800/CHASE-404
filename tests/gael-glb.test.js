import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {buildGaelMeshes} from '../src/gael-model.js';
import {decodeGLB} from '../src/glb.js';
import {GAEL_PART_NAMES,encodePartGLB} from '../tools/build_gael_glb.mjs';
const root=resolve(import.meta.dirname,'..');
test('six local Gael GLB rig segments match source meshes',()=>{
 const original=buildGaelMeshes();
 for(const name of GAEL_PART_NAMES){
  const bytes=readFileSync(resolve(root,'assets/models/gael',name+'.glb'));
  const ab=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
  const decoded=decodeGLB(ab),part=original[name];
  assert.equal(decoded.count,part.count,`triangle count ${name}`);
  assert.deepEqual(Array.from(decoded.positions),Array.from(part.positions),`positions ${name}`);
  assert.deepEqual(Array.from(decoded.colors),Array.from(part.colors),`colors ${name}`);
  assert.ok(decoded.normals.every(Number.isFinite),`normals ${name}`);
  assert.deepEqual(Buffer.from(encodePartGLB(part,name)),bytes,`reproducible ${name}`);
 }
});
test('renderer loads all six pieces before changing protagonist source',()=>{
 const source=readFileSync(resolve(root,'src/renderer.js'),'utf8');
 assert.match(source,/Promise\.all\(names\.map\(name=>loadGLB/);
 assert.match(source,/this\.gaelSource='GLB'/);
 assert.match(source,/this\.gaelAssetError/);
 assert.match(source,/usando figura procedural/);
});
