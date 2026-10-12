import test from 'node:test';
import assert from 'node:assert/strict';
import {createRuntimeGuard} from '../src/runtime-guard.js';

test('a healthy frame runs without invoking error handling',()=>{
 let frames=0, errors=0;
 const guard=createRuntimeGuard(()=>errors++);
 assert.equal(guard.run(()=>frames++),true);
 assert.equal(guard.run(()=>frames++),true);
 assert.equal(frames,2);assert.equal(errors,0);assert.equal(guard.stopped,false);
});
test('a thrown WebGL/render exception stops subsequent frames and reports once',()=>{
 let errors=[],frames=0;
 const guard=createRuntimeGuard(error=>errors.push(error));
 const fault=new Error('WebGL');
 assert.equal(guard.run(()=>{throw fault;}),false);
 assert.equal(guard.run(()=>frames++),false);
 assert.equal(frames,0);assert.deepEqual(errors,[fault]);assert.equal(guard.stopped,true);
});
test('explicit context loss stops once and preserves the first error',()=>{
 let calls=0;const guard=createRuntimeGuard(()=>calls++);
 assert.equal(guard.stop(Error('context lost')),true);
 assert.equal(guard.stop(Error('another error')),false);
 assert.equal(guard.run(()=>{throw Error('should not run')}),false);
 assert.equal(calls,1);
});
test('invalid error handler is rejected',()=>assert.throws(()=>createRuntimeGuard(null),TypeError));
