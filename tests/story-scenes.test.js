import test from 'node:test';
import assert from 'node:assert/strict';
import {storyBeat,STORY_BEATS} from '../src/story-scenes.js';
test('viñetas de Clara, testigo y Salvat aparecen en los puntos previstos',()=>{for(const id of ['10:0','11:1','14:0','14:1','15:0','15:1']){const [ch,at]=id.split(':').map(Number);assert.ok(storyBeat(ch,at)?.text.length>25);}});
test('otros objetivos no interrumpen la campaña',()=>{assert.equal(storyBeat(1,0),null);assert.equal(storyBeat(15,2),null);assert.equal(Object.keys(STORY_BEATS).length,6);});
test('viñetas contienen los campos accesibles necesarios',()=>{for(const item of Object.values(STORY_BEATS))for(const field of ['speaker','place','title','text'])assert.ok(item[field]);});
