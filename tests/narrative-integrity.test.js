import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MISSION_CHAPTERS} from '../src/mission.js';
import {STORY_BEATS,storyBeat} from '../src/story-scenes.js';
import {STORY_ACTORS,visibleStoryActors} from '../src/story-actors.js';

// Audita correspondencia entre interludios, avance de misión y presencias finales.
test('cada escena está ligada a un checkpoint real y nunca al final consumado',()=>{
 for(const key of Object.keys(STORY_BEATS)){
  const [chapter,index]=key.split(':').map(Number);
  const points=MISSION_CHAPTERS[chapter]?.points;
  assert.ok(points,`Capítulo ${chapter} inexistente`);
  assert.ok(index>=0&&index<points.length-1,`Interludio ${key} después del final`);
  assert.equal(storyBeat(chapter,index),STORY_BEATS[key]);
 }
});
test('actores narrativos no aparecen antes del rescate ni tras completar la misión',()=>{
 for(let chapter=1;chapter<=15;chapter++){
  assert.deepEqual(visibleStoryActors(chapter,0,'won',null),[]);
  assert.deepEqual(visibleStoryActors(chapter,0,'lost',null),[]);
 }
 assert.deepEqual(visibleStoryActors(15,0,'active','RESCATAR A MI HERMANO'),[]);
 assert.deepEqual(visibleStoryActors(15,0,'active','RECUPERAR LAS PRUEBAS').map(actor=>actor.id),['brother']);
 assert.equal(visibleStoryActors(15,2,'active','RECUPERAR LAS PRUEBAS')[0],STORY_ACTORS.salvat);
});
test('abrir interludio corta inmediatamente el bucle físico y elimina el tiempo acumulado',()=>{
 const src=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(src,/if\(!sideMode\(\)&&!explorationMode\(\)&&showStoryBeat\(storyBeat\(selectedChapter,completedBefore\)\)\)\{acc=0;break;\}/);
 assert.match(src,/storyOpen=false;\$\('storyOverlay'\)\.hidden=true;acc=0;/);
});
