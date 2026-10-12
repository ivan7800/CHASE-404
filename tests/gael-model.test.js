import test from 'node:test';
import assert from 'node:assert/strict';
import {buildGaelMeshes,GAEL_RIG} from '../src/gael-model.js';
test('Gael rig stays compatible with foot animation pivots',()=>{assert.equal(GAEL_RIG.hipY,.57);assert.equal(GAEL_RIG.shoulderY,1.43)});
test('procedural hero has four finite meshes with consistent attributes',()=>{
 const m=buildGaelMeshes();for(const part of ['body','detail','leg','shin','arm','forearm']){const mesh=m[part];assert.ok(mesh.count>100,part);assert.equal(mesh.positions.length,mesh.count*3);assert.equal(mesh.normals.length,mesh.positions.length);assert.equal(mesh.colors.length,mesh.positions.length);assert.ok(mesh.positions.every(Number.isFinite),part);}
});
test('hero silhouette respects ground and head height',()=>{const m=buildGaelMeshes();const bodyY=Array.from(m.body.positions).filter((_,i)=>i%3===1);assert.ok(Math.max(...bodyY)>2.1);const legsY=Array.from(m.leg.positions).filter((_,i)=>i%3===1);const shinY=Array.from(m.shin.positions).filter((_,i)=>i%3===1);assert.ok(Math.min(...legsY)<-.30);assert.ok(Math.min(...shinY)<-.4);assert.ok(GAEL_RIG.hipY-.32+Math.min(...shinY)<-.14);});

test('remastered silhouette uses multi-facet head and articulated rounded limbs',()=>{
 const m=buildGaelMeshes();
 // The body and moving limbs have substantially more than box-only faces.
 assert.ok(m.body.count>360);
 assert.ok(m.leg.count+m.shin.count>200);
 assert.ok(m.arm.count+m.forearm.count>150);
 const bodyY=Array.from(m.body.positions).filter((_,i)=>i%3===1);
 assert.ok(bodyY.some(y=>y>2.11&&y<2.14),'hair crown');
});
test('faceted loft rejects malformed cross sections',async()=>{
 const {facetedLoft}=await import('../src/gael-model.js');
 assert.throws(()=>facetedLoft({},[[0,.2,.2],[1,.2,.2]],4,[1,2,3]),/Invalid/);
});
