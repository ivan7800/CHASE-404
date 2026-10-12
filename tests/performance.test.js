import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {rivalDrawPlan,renderResolution,shouldUpdateAudio,AUDIO_UPDATE_INTERVAL} from '../src/performance.js';
import {Renderer} from '../src/renderer.js';
import {EngineAudio} from '../src/audio.js';
import {createCar} from '../src/physics.js';

test('6.5: LOD keeps near cars complete and removes only distant cosmetics in MEDIUM/ECO',()=>{
 for(const q of [1,.78,.55])assert.equal(rivalDrawPlan(40**2,q),'full');
 assert.equal(rivalDrawPlan(290**2,1),'full');
 assert.equal(rivalDrawPlan(290**2,.78),'body');
 assert.equal(rivalDrawPlan(130**2,.55),'body');
 assert.equal(rivalDrawPlan(130**2,.78),'full');
 assert.equal(rivalDrawPlan(1101**2,1),'hidden');
 for(const input of [-1,NaN,Infinity])assert.equal(rivalDrawPlan(input,.78),'hidden');
});
test('6.5: high-DPI framebuffer budget limits expensive pixels, with aspect ratio preserved',()=>{
 const small=renderResolution(960,540,1,1);assert.deepEqual(small,{width:960,height:540});
 const high=renderResolution(3440,1440,2,1);assert.ok(high.width*high.height<=2500000);assert.ok(Math.abs(high.width/high.height-3440/1440)<.01);
 const medium=renderResolution(2560,1440,3,.78),eco=renderResolution(2560,1440,3,.55);
 assert.ok(medium.width*medium.height<=1200000);
 assert.ok(eco.width*eco.height<=750000);
 assert.ok(eco.width<medium.width);assert.ok(medium.width<high.width);
});
test('6.5: audio clock gate is deterministic, handles rollback and never triggers on NaN',()=>{
 assert.equal(AUDIO_UPDATE_INTERVAL,1/30);
 assert.equal(shouldUpdateAudio(-Infinity,0),true);
 assert.equal(shouldUpdateAudio(1,1.015),false);
 assert.equal(shouldUpdateAudio(1,1.04),true);
 assert.equal(shouldUpdateAudio(9,2),true);
 assert.equal(shouldUpdateAudio(1,NaN),false);
});
test('6.5: GL mesh attribute binding is cached until the mesh changes',()=>{
 const metrics={bindings:0,draws:0,attributes:0};
 const gl={FLOAT:5126,UNSIGNED_BYTE:5121,ARRAY_BUFFER:34962,TRIANGLES:4,
  uniform1f(){},uniformMatrix4fv(){},bindBuffer(){metrics.bindings++;},enableVertexAttribArray(){metrics.attributes++;},vertexAttribPointer(){},drawArrays(){metrics.draws++;}};
 const fake={gl,attrs:[0,1,2],materialType:1,mvp:2,model:3,boundMesh:null,drawCalls:0};
 const identity=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
 const mesh={b:[1,2,3],count:3},different={b:[4,5,6],count:3};
 Renderer.prototype.draw.call(fake,mesh,identity,identity);
 Renderer.prototype.draw.call(fake,mesh,identity,identity);
 Renderer.prototype.draw.call(fake,mesh,identity,identity);
 assert.equal(metrics.draws,3);assert.equal(metrics.bindings,3,'three wheel draws need one 3-buffer binding');
 Renderer.prototype.draw.call(fake,different,identity,identity);
 assert.equal(metrics.bindings,6);assert.equal(fake.drawCalls,4);
});
function renderStub(){const state={draws:[],bindingCount:0};const gl={
 VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,UNSIGNED_BYTE:5121,TRIANGLES:4,DEPTH_TEST:2929,LEQUAL:515,CULL_FACE:2884,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,
 createProgram:()=>({}),createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>true,attachShader(){},linkProgram(){},getProgramParameter:()=>true,useProgram(){},getAttribLocation:()=>0,getUniformLocation:()=>({}),createBuffer:()=>({}),deleteBuffer(){},bindBuffer(){state.bindingCount++;},bufferData(){},enable(){},depthFunc(){},disable(){},clearColor(){},uniformMatrix4fv(){},uniform3f(){},uniform1f(){},enableVertexAttribArray(){},vertexAttribPointer(){},viewport(){},clear(){},drawArrays(mode,start,count){state.draws.push(count);}
 };return {state,gl};}
test('6.5: actual renderer removes 5 draw calls from distant opponent in ECO but never near one',async()=>{
 const {state,gl}=renderStub();const canvas={width:1,height:1,getContext:()=>gl,getBoundingClientRect:()=>({width:960,height:540}),addEventListener(){}};
 globalThis.window={devicePixelRatio:1,dispatchEvent(){}};
 const buf=await readFile(new URL('../assets/models/racer-04.glb',import.meta.url));
 globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength)});
 const renderer=new Renderer(canvas);await renderer.assetPromise;
 const car=createCar(),rival={index:2,x:car.x+300,z:car.z,yaw:0,wheel:0};
 renderer.render(car,1/60,[rival]);const full=renderer.drawCalls;
 renderer.setQuality(.55);renderer.render(car,1/60,[rival]);
 assert.equal(renderer.drawCalls,full-5,'4 distant wheels and 1 shadow saved');
 rival.x=car.x+20;renderer.render(car,1/60,[rival]);
 assert.equal(renderer.drawCalls,full,'near car remains complete in ECO');
});
function audioStub(){const state={targets:0};const param=()=>({value:0,setTargetAtTime(){state.targets++;},setValueAtTime(){},exponentialRampToValueAtTime(){}});
 const node=()=>({connect(x){return x;},start(){},stop(){},gain:param(),frequency:param(),Q:param(),threshold:param(),ratio:param(),buffer:null,loop:false});
 class AudioContext {constructor(){this.destination=node();this.currentTime=1;this.sampleRate=8000;}createGain(){return node();}createOscillator(){return node();}createBiquadFilter(){return node();}createDynamicsCompressor(){return node();}createBuffer(c,n,r){return {getChannelData:()=>new Float32Array(n)};}createBufferSource(){return node();}async resume(){return true;}}
 return {AudioContext,state};}
test('6.5: audio limits parameter writes to 30 Hz, but resumes immediately after reactivation',async()=>{
 const {AudioContext,state}=audioStub();globalThis.window={AudioContext};
 const a=new EngineAudio();await a.toggle();a.pause(false);const before=state.targets;
 assert.equal(a.needsFrame(),true);a.update(45,{slide:.3},{urban:true});
 assert.equal(a.updateCount,1);const targets=state.targets;assert.ok(targets>before);
 a.ctx.currentTime+=.015;assert.equal(a.needsFrame(),false);a.update(45);assert.equal(state.targets,targets);
 a.ctx.currentTime+=.04;assert.equal(a.needsFrame(),true);a.update(45);assert.equal(a.updateCount,2);
 a.pause(true);assert.equal(a.needsFrame(),false);
 await a.toggle();await a.toggle();a.pause(false);
 assert.equal(a.needsFrame(),true,'reactivation must force fresh audio frame');
 a.update(45);assert.equal(a.updateCount,3);
});
