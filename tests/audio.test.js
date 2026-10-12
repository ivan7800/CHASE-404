import test from 'node:test';
import assert from 'node:assert/strict';
import {EngineAudio} from '../src/audio.js';

function fakeCtx(){
 const changes=[];
 const param=()=>({value:0,setTargetAtTime(...args){changes.push(['target',...args]);},setValueAtTime(){},exponentialRampToValueAtTime(){}});
 const node=()=>({connect(x){return x;},start(){},stop(){},gain:param(),frequency:param(),Q:param(),threshold:param(),ratio:param(),buffer:null,loop:false});
 class AudioContext{
  constructor(){this.destination=node();this.currentTime=1;this.sampleRate=8000;}
  createGain(){return node();}createOscillator(){return node();}createBiquadFilter(){return node();}createDynamicsCompressor(){return node();}
  createBuffer(c,n,r){return {getChannelData:()=>new Float32Array(n)};}createBufferSource(){return node();}async resume(){return true;}
 }
 return {AudioContext,changes};
}
test('audio is opt-in and creates no nodes before activation',async()=>{
 const a=new EngineAudio();assert.equal(a.ctx,null);assert.equal(a.on,false);
 assert.doesNotThrow(()=>a.update(36));assert.doesNotThrow(()=>a.cue('lap'));
 const mock=fakeCtx();globalThis.window={AudioContext:mock.AudioContext};
 assert.equal(await a.toggle(),true);assert.equal(a.engine.length,3);
 assert.ok(a.wind&&a.tires);a.pause(false);a.update(42,{slide:.2,offroad:true,steer:.5});a.cue('lap');
 assert.ok(mock.changes.length>=7);assert.equal(await a.toggle(),false);
 a.setVolume(.9);assert.equal(a.volume,.9);
});
test('audio disables gracefully without browser audio API',async()=>{
 delete globalThis.window;
 await assert.rejects(new EngineAudio().toggle(),/Web Audio/);
});
