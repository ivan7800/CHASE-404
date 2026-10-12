import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_SETTINGS,DEFAULT_BINDINGS,normalizeSettings,saveSettings,readSettings,validateBindings,actionForKey,AutoQuality,qualityScale} from '../src/settings.js';
test('missing/bad settings recover valid defaults',()=>{
 assert.deepEqual(normalizeSettings(null).bindings,DEFAULT_BINDINGS);
 assert.deepEqual(normalizeSettings({quality:'ULTRA',hudScale:10000,bindings:{left:'KeyA'}}),DEFAULT_SETTINGS);
 assert.deepEqual(normalizeSettings({quality:'eco',hudScale:120,contrast:true,reducedMotion:true}).quality,'eco');
});
test('settings persist locally and malformed JSON is safe',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 assert.equal(saveSettings(storage,{quality:'medium',hudScale:110,contrast:true,bindings:DEFAULT_BINDINGS}),true);
 assert.equal(readSettings(storage).quality,'medium');assert.equal(readSettings(storage).contrast,true);
 storage.setItem('chase404.settings.v7','{BROKEN');assert.equal(readSettings(storage).quality,'auto');
 assert.equal(saveSettings({setItem(){throw Error('blocked')}},{}),false);
});
test('duplicate/remapped invalid key bindings are rejected',()=>{
 assert.equal(validateBindings({...DEFAULT_BINDINGS,right:'KeyA'}),false);
 assert.equal(validateBindings({...DEFAULT_BINDINGS,right:'KeyP'}),false);
 assert.equal(validateBindings({...DEFAULT_BINDINGS,right:'KeyL'}),true);
});
test('action dispatch prioritizes customized bindings and preserves arrows',()=>{
 assert.equal(actionForKey('KeyW',DEFAULT_BINDINGS),'throttle');
 assert.equal(actionForKey('ArrowUp',DEFAULT_BINDINGS),'throttle');
 assert.equal(actionForKey('KeyL',{...DEFAULT_BINDINGS,right:'KeyL'}),'right');
 assert.equal(actionForKey('KeyD',{...DEFAULT_BINDINGS,right:'KeyL'}),null);
 assert.equal(actionForKey('KeyP',DEFAULT_BINDINGS),null);
});
test('quality scale is bounded to supported settings',()=>{
 assert.equal(qualityScale('high'),1);assert.equal(qualityScale('medium'),.78);assert.equal(qualityScale('eco'),.55);assert.equal(qualityScale('auto'),1);
});
test('auto quality downshifts only with sustained low FPS and cooldown',()=>{
 const q=new AutoQuality();for(let i=0;i<15;i++)q.observe(38,.25);assert.equal(q.scale,.78);
 for(let i=0;i<32;i++)q.observe(35,.25);assert.equal(q.scale,.78);
 for(let i=0;i<20;i++)q.observe(30,.25);assert.equal(q.scale,.55);
});
test('auto quality recovers after sustained high FPS',()=>{
 const q=new AutoQuality();q.scale=.55;for(let i=0;i<56;i++)q.observe(60,.25);assert.equal(q.scale,.78);
 for(let i=0;i<36;i++)q.observe(60,.25);assert.equal(q.scale,.78);
 for(let i=0;i<56;i++)q.observe(60,.25);assert.equal(q.scale,1);
});
test('invalid performance data cannot alter render scale',()=>{
 const q=new AutoQuality();for(const value of [0,NaN,Infinity,-30])q.observe(value,1);
 assert.equal(q.scale,1);assert.equal(q.observe(20,-1),1);assert.equal(q.observe(10,.1,false),1);
});

test('steering sensitivity is bounded to three safe presets',()=>{
 assert.equal(normalizeSettings({steeringSensitivity:75}).steeringSensitivity,75);
 assert.equal(normalizeSettings({steeringSensitivity:125}).steeringSensitivity,125);
 assert.equal(normalizeSettings({steeringSensitivity:1000}).steeringSensitivity,100);
});
