import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CONTACT_VISUAL_PROFILES,buildCity} from '../src/city.js';
import {CONTACTS} from '../src/contacts.js';
const render=readFileSync(new URL('../src/renderer.js',import.meta.url),'utf8');
test('los tres contactos mantienen identidad y vestuario propios',()=>{
 assert.deepEqual(CONTACT_VISUAL_PROFILES.map(x=>x.id),CONTACTS.map(x=>x.id));
 assert.equal(new Set(CONTACT_VISUAL_PROFILES.map(x=>x.accessory)).size,3);
 assert.equal(new Set(CONTACT_VISUAL_PROFILES.map(x=>x.coat.join(','))).size,3);
});
test('Gael conserva el rig articulado con una segunda malla de detalles',()=>{
 assert.match(render,/this\.pedestrianDetails=this\.upload\(gael\.detail\)/);
 assert.match(render,/this\.draw\(this\.pedestrianDetails,base,vp\)/);
 assert.match(render,/this\.draw\(this\.walkLeg,thighPose,vp\)/);
 assert.match(render,/this\.draw\(this\.walkShin/);
 assert.match(render,/this\.draw\(this\.walkArm,upperArmPose,vp\)/);
 assert.match(render,/this\.draw\(this\.walkForearm/);
});
test('remaster de ciudad conserva geometría finita y coherente',()=>{
 const mesh=buildCity();assert.ok(mesh.count>0);
 assert.equal(mesh.positions.length,mesh.count*3);
 assert.equal(mesh.normals.length,mesh.positions.length);
 assert.equal(mesh.colors.length,mesh.positions.length);
 assert.ok(mesh.positions.every(Number.isFinite));
});
