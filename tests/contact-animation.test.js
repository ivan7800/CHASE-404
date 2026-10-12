import test from 'node:test';
import assert from 'node:assert/strict';
import {contactPose} from '../src/contact-animation.js';
import {CONTACTS} from '../src/contacts.js';
import {CONTACT_VISUAL_PROFILES,contactPlacement,buildCity} from '../src/city.js';
test('three distinct characters have independent validated placements',()=>{
 assert.equal(CONTACTS.length,3);assert.equal(CONTACT_VISUAL_PROFILES.length,3);
 for(const c of CONTACTS){const p=contactPlacement(c);assert.ok(Object.values(p).every(Number.isFinite));}
 assert.equal(new Set(CONTACT_VISUAL_PROFILES.map(p=>p.accessory)).size,3);
});
test('idle gestures animate without displacing actor root or changing game progress',()=>{
 const a=contactPose(0,0),b=contactPose(1,0),c=contactPose(1,1);
 assert.notDeepEqual(a,b);assert.notDeepEqual(b,c);
 for(const p of [a,b,c]){assert.ok(Math.abs(p.bob)<=.026);assert.ok(Math.abs(p.yaw)<=.061);assert.ok(Math.abs(p.rightArm)<.29);}
});
test('reduced motion yields stable pose',()=>{
 assert.deepEqual(contactPose(5,2,true),contactPose(0,0,true));
});
test('city geometry remains buildable after dynamic NPC extraction',()=>{
 const mesh=buildCity();assert.ok(mesh.count>0);assert.equal(mesh.positions.length,mesh.count*3);
});
