import test from 'node:test';
import assert from 'node:assert/strict';
import {Controls} from '../src/controls.js';
import {actionForKey,DEFAULT_BINDINGS} from '../src/settings.js';
const make=()=>new Controls(code=>actionForKey(code,DEFAULT_BINDINGS));
test('key state supports WASD and arrow keys simultaneously without prematurely releasing throttle',()=>{
 const controls=make();controls.keyDown('KeyW');controls.keyDown('ArrowUp');
 assert.equal(controls.snapshot().throttle,true);
 controls.keyUp('KeyW');assert.equal(controls.snapshot().throttle,true);
 controls.keyUp('ArrowUp');assert.equal(controls.snapshot().throttle,false);
});
test('touch and keyboard can hold the same action independently',()=>{
 const controls=make();controls.keyDown('KeyA');controls.pointerDown(42,'left');
 controls.keyUp('KeyA');assert.equal(controls.snapshot().left,true);
 controls.pointerUp(42);assert.equal(controls.snapshot().left,false);
});
test('clearing focus stops keys and pointers, even before keyup',()=>{
 const controls=make();controls.keyDown('KeyD');controls.pointerDown(9,'throttle');controls.clear();
 assert.deepEqual(controls.snapshot(),{throttle:false,brake:false,left:false,right:false,handbrake:false});
});
test('remapping is resolved at snapshot time and unknown keys ignored',()=>{
 const keys={...DEFAULT_BINDINGS,left:'KeyK'};
 const controls=new Controls(code=>actionForKey(code,keys));
 controls.keyDown('KeyK');controls.keyDown('KeyZ');
 assert.equal(controls.snapshot().left,true);
 keys.left='KeyA';assert.equal(controls.snapshot().left,false);
});
test('concurrent opposite steering keys remain independent',()=>{
 const controls=make();controls.keyDown('KeyA');controls.keyDown('KeyD');
 assert.equal(controls.snapshot().left,true);assert.equal(controls.snapshot().right,true);
 controls.keyUp('KeyA');assert.equal(controls.snapshot().right,true);
});
