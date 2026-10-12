import test from 'node:test';
import assert from 'node:assert/strict';
import {STORY_ACTORS,visibleStoryActors,storyActorPose} from '../src/story-actors.js';
import {cityElevation} from '../src/city.js';
test('final act has distinct finite locations at mission objectives',()=>{
 assert.equal(Object.keys(STORY_ACTORS).length,2);
 for(const actor of Object.values(STORY_ACTORS))assert.ok(Number.isFinite(cityElevation(actor.x,actor.z)));
 assert.deepEqual(visibleStoryActors(14,1,'active',null).map(a=>a.id),['brother']);
});
test('brother appears only when his rescue is pending in chapter 15',()=>{
 assert.deepEqual(visibleStoryActors(15,0,'active','RECUPERAR LAS PRUEBAS').map(a=>a.id),['brother']);
 assert.deepEqual(visibleStoryActors(15,0,'active','RESCATAR A MI HERMANO'),[]);
 assert.deepEqual(visibleStoryActors(15,1,'active','RECUPERAR LAS PRUEBAS'),[]);
});
test('Salvat appears only in final encounter and never in side activities',()=>{
 assert.deepEqual(visibleStoryActors(15,2,'active','RECUPERAR LAS PRUEBAS').map(a=>a.id),['salvat']);
 assert.deepEqual(visibleStoryActors(15,2,'won','RECUPERAR LAS PRUEBAS'),[]);
 assert.deepEqual(visibleStoryActors(5,2,'active',null),[]);
});
test('reduced motion produces stable figure',()=>{
 assert.deepEqual(storyActorPose(20,'salvat',true),storyActorPose(0,'brother',true));
 assert.notDeepEqual(storyActorPose(0,'brother'),storyActorPose(1,'brother'));
});
