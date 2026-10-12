import test from 'node:test';
import assert from 'node:assert/strict';
import {shortcutAllowed} from '../src/navigation-guard.js';

test('paused game blocks garage, reset, vehicle and camera shortcuts',()=>{
 for(const code of ['KeyY','KeyT','KeyR','KeyE','KeyC','KeyN','KeyX','KeyB','KeyM'])assert.equal(shortcutAllowed(code,{paused:true,started:true}),false,code);
 for(const code of ['Escape','KeyP','KeyO','KeyH'])assert.equal(shortcutAllowed(code,{paused:true,started:true}),true,code);
});
test('help panel consumes gameplay shortcuts but allows dismissal',()=>{
 for(const code of ['KeyR','KeyE','KeyG','KeyM','KeyY','KeyO'])assert.equal(shortcutAllowed(code,{helpOpen:true,started:true}),false,code);
 for(const code of ['KeyH','Escape','KeyP'])assert.equal(shortcutAllowed(code,{helpOpen:true,started:true}),true,code);
});
test('focused button captures keyboard activation rather than driving',()=>{
 for(const code of ['Space','Enter','KeyW','KeyE','KeyR'])assert.equal(shortcutAllowed(code,{started:true,focusedControl:true}),false,code);
});
test('normal gameplay and pause key remain usable',()=>{
 for(const code of ['KeyE','KeyW','KeyR','KeyC','Escape'])assert.equal(shortcutAllowed(code,{started:true}),true,code);
 assert.equal(shortcutAllowed('KeyE',{started:false,paused:true}),false);
});
