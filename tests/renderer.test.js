import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {Renderer} from '../src/renderer.js';
import {createCar} from '../src/physics.js';
import {makeRace} from '../src/race.js';

function glStub(){const state={draws:[],uploads:0};const gl={
 VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,UNSIGNED_BYTE:5121,TRIANGLES:4,
 DEPTH_TEST:2929,LEQUAL:515,CULL_FACE:2884,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,
 createProgram:()=>({}),createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>true,attachShader(){},linkProgram(){},getProgramParameter:()=>true,useProgram(){},getAttribLocation:()=>0,getUniformLocation:()=>({}),createBuffer:()=>({}),deleteBuffer(){},bindBuffer(){},bufferData(target,data){state.uploads++;assert.ok(data.byteLength>0);},enable(){},depthFunc(){},disable(){},clearColor(){},uniformMatrix4fv(loc,transpose,arr){assert.equal(arr.length,16);assert.equal(transpose,false);assert.ok(arr.every(Number.isFinite));},uniform3f(){},uniform1f(){},enableVertexAttribArray(){},vertexAttribPointer(){},viewport(){},clear(){},drawArrays(mode,start,count){state.draws.push(count);}
 };return {state,gl};}

test('renderer imports local GLB and preserves driving model/wheels',async()=>{
 const {state,gl}=glStub();const canvas={width:1,height:1,getContext:()=>gl,getBoundingClientRect:()=>({width:960,height:540}),addEventListener(){}};
 globalThis.window={devicePixelRatio:1,dispatchEvent(){}};
 const read=await fs.readFile(new URL('../assets/models/racer-04.glb',import.meta.url));
 globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>read.buffer.slice(read.byteOffset,read.byteOffset+read.byteLength)});
 const renderer=new Renderer(canvas);assert.equal(renderer.modelSource,'procedural');assert.equal(await renderer.assetPromise,true);
 assert.equal(renderer.modelSource,'GLB');assert.ok(renderer.car.count>1752,'remastered GLB has richer geometry');
 renderer.render(createCar(),1/60);
 assert.equal(state.draws.length,7,'environment, shadow, GLB, 4 spinning wheels');
 assert.ok(state.draws.every(x=>x>0));
 renderer.nextCamera();renderer.nextCamera();state.draws.length=0;
 renderer.render(createCar(),1/60);
 assert.equal(state.draws.length,1,'bonnet view only draws environment');
});

test('renderer draws all seven distinct opponent liveries including when player uses bonnet camera',async()=>{
 const {state,gl}=glStub();const canvas={width:1,height:1,getContext:()=>gl,getBoundingClientRect:()=>({width:960,height:540}),addEventListener(){}};
 globalThis.window={devicePixelRatio:1,dispatchEvent(){}};
 const read=await fs.readFile(new URL('../assets/models/racer-04.glb',import.meta.url));
 globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>read.buffer.slice(read.byteOffset,read.byteOffset+read.byteLength)});
 const renderer=new Renderer(canvas);await renderer.assetPromise;
 const race=makeRace();
 assert.equal(renderer.rivalModels.length,7);
 assert.equal(new Set(renderer.rivalModels.map(m=>m.b[2])).size,7,'unique color GPU buffers');
 renderer.render(createCar(),1/60,race.rivals);
 assert.equal(state.draws.length,49,'track + player 6 meshes + 7 rivals × 6 meshes');
 renderer.nextCamera();renderer.nextCamera();state.draws.length=0;
 renderer.render(createCar(),1/60,race.rivals);
 assert.equal(state.draws.length,43,'bonnet camera hides only player car');
});

test('track swapping rebuilds GPU scenery and five local GLBs load on demand',async()=>{
 const {gl,state}=glStub();
 const canvas={width:1,height:1,getContext:()=>gl,getBoundingClientRect:()=>({width:1024,height:768}),addEventListener(){}};
 globalThis.window={devicePixelRatio:1,dispatchEvent(){}};
 globalThis.fetch=async path=>{
  const file=new URL('../assets/models/'+path.split('/').pop(),import.meta.url);
  const buf=await fs.readFile(file);
  return {ok:true,arrayBuffer:async()=>buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength)};
 };
 const {TRACKS,selectTrack}=await import('../src/track.js');
 const {CARS}=await import('../src/garage.js');
 const instance=new Renderer(canvas);
 await instance.assetPromise;
 assert.equal(instance.modelSource,'GLB');
 const original=instance.track;
 for(const t of TRACKS){
  selectTrack(t.id);instance.changeTrack();
  assert.ok(instance.track.count>40000,`${t.id} track mesh`);
  assert.notEqual(instance.track,original,`${t.id} track was uploaded anew`);
  instance.render(createCar(),1/60,[]);
 }
 const unique=[];
 for(const spec of CARS){
  instance.changeVehicle(spec.id);
  assert.equal(await instance.assetPromise,true,`${spec.id} asset loaded`);
  assert.equal(instance.modelSource,'GLB',`${spec.id} GLB active`);
  unique.push(instance.car.count);
  const car=createCar();car.tune=spec.tune;
  instance.render(car,1/60,[]);
 }
 assert.equal(instance.vehicleMeshes.size,6);
 assert.ok(new Set(unique).size>=4,'body kits differ in vertex count');
 assert.ok(state.uploads>30,'assets were sent to GPU mock');
 selectTrack('sunset');
});

test('renderer draws bounded tire-dust particles when drifting and removes them when disabled',async()=>{
 const {state,gl}=glStub();
 const canvas={width:1,height:1,getContext:()=>gl,getBoundingClientRect:()=>({width:960,height:540}),addEventListener(){}};
 globalThis.window={devicePixelRatio:1,dispatchEvent(){}};
 const read=await fs.readFile(new URL('../assets/models/racer-04.glb',import.meta.url));
 globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>read.buffer.slice(read.byteOffset,read.byteOffset+read.byteLength)});
 const renderer=new Renderer(canvas);await renderer.assetPromise;
 const car=createCar();car.speed=48;
 renderer.emitDrivingEffects(car,.08,true);
 assert.equal(renderer.effects.items.length,2);
 renderer.render(car,1/60,[]);
 assert.equal(state.draws.length,9,'track, shadow, car, four wheels, two dust puffs');
 renderer.setEffectsEnabled(false);assert.equal(renderer.effects.items.length,0);
 state.draws.length=0;renderer.render(car,1/60,[]);assert.equal(state.draws.length,7);
});
