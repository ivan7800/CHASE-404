/** Fase 6.6 — matriz de regresiones, sin fingir compilación en GPU real. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Renderer} from '../src/renderer.js';
import {createUrbanCar} from '../src/physics.js';
import {getLighting,LIGHTING_PRESETS} from '../src/atmosphere.js';
import {renderResolution,rivalDrawPlan} from '../src/performance.js';
import {soundFrame,SOUND_DISTRICTS} from '../src/soundscape.js';
import {EngineAudio} from '../src/audio.js';

function mockRenderer(){
 const state={uniforms:new Map(),draws:0,viewport:[]};
 const gl={VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,
  ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,UNSIGNED_BYTE:5121,TRIANGLES:4,DEPTH_TEST:2929,LEQUAL:515,CULL_FACE:2884,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,
  createProgram:()=>({}),createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>true,attachShader(){},linkProgram(){},getProgramParameter:()=>true,useProgram(){},getAttribLocation:()=>0,getUniformLocation:(_,id)=>id,createBuffer:()=>({}),deleteBuffer(){},bindBuffer(){},bufferData(){},enable(){},depthFunc(){},disable(){},clearColor(...c){state.clear=c;},uniformMatrix4fv(_,__,values){assert.ok(values.every(Number.isFinite),'finite camera/model matrices');},uniform3f(id,...v){state.uniforms.set(id,v);},uniform1f(id,n){state.uniforms.set(id,n);},enableVertexAttribArray(){},vertexAttribPointer(){},viewport(...a){state.viewport=a;},clear(){},drawArrays(){state.draws++;}};
 const canvas={width:1,height:1,getContext:()=>gl,getBoundingClientRect:()=>({width:1440,height:900}),addEventListener(){}};
 return {canvas,state};
}

test('6.6: three city light looks × three cameras × three quality budgets × FX ON/OFF remain renderable in WebGL stub',async()=>{
 const {canvas,state}=mockRenderer();
 globalThis.window={devicePixelRatio:2,dispatchEvent(){}};
 // Load the real local asset through a deterministic mocked response.
 const asset=readFileSync(new URL('../assets/models/racer-04.glb',import.meta.url));
 globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>asset.buffer.slice(asset.byteOffset,asset.byteOffset+asset.byteLength)});
 const renderer=new Renderer(canvas);renderer.setUrbanMode(true);
 const car=createUrbanCar();car.speed=42;car.vz=42;
 for(const look of LIGHTING_PRESETS){
  renderer.setLighting(look.id);
  for(const quality of [1,.78,.55]){
   renderer.setQuality(quality);
   for(let cam=0;cam<3;cam++){
    for(const fx of [true,false]){
     renderer.cameraMode=cam;renderer.startCam=true;renderer.setEffectsEnabled(fx);
     state.draws=0;
     renderer.render(car,1/60,[{x:car.x+150,z:car.z+100,yaw:0,index:0,wheel:0}]);
     assert.deepEqual(state.clear,[...getLighting(look.id).sky,1]);
     assert.equal(state.uniforms.get('uFogStart'),look.fogStart);
     assert.equal(state.uniforms.get('uLamps'),look.lamps);
     assert.ok(state.draws>0);
     assert.equal(renderer.quality,quality);
     assert.equal(renderer.cameraMode,cam);
     if(!fx)assert.equal(renderer.cameraRig.impact,0);
    }
   }
  }
 }
 assert.ok(renderer.frames>0);
});

test('6.6: audio district envelopes are finite/quiet on foot and siren obeys pursuit',()=>{
 const samples=[[-50,140,'carmel'],[-190,330,'guinardo'],[-370,80,'gracia'],[-600,30,'eixample'],[-770,-350,'port'],[-1280,-390,'montjuic']];
 for(const [x,z,district] of samples){
  for(const lighting of ['day','dusk','night']){
   const driving=soundFrame({urban:true,x,z,lighting,speed:52,policeActive:true,policeDistance:40,trafficDistance:25});
   const walking=soundFrame({urban:true,x,z,lighting,onFoot:true,policeActive:false});
   assert.equal(driving.district,district);
   for(const [key,value] of Object.entries(driving))if(key!=='district')assert.ok(Number.isFinite(value)&&value>=0&&value<=1,`bounded ${key} ${district}`);
   assert.ok(driving.siren>0,`pursuit siren ${district}`);
   assert.equal(walking.engine,0);assert.equal(walking.siren,0);
  }
 }
 assert.equal(Object.keys(SOUND_DISTRICTS).length,7);
 assert.equal(soundFrame({urban:false}).district,'arcade');
});

test('6.6: reactivation, pause and double activation while AudioContext.resume is pending stay consistent',async()=>{
 let releaseResume;
 const resumeGate=new Promise(resolve=>{releaseResume=resolve;});
 const param=()=>({value:0,setTargetAtTime(){},setValueAtTime(){},exponentialRampToValueAtTime(){}});
 const node=()=>({connect(x){return x;},start(){},stop(){},gain:param(),frequency:param(),Q:param(),threshold:param(),ratio:param(),buffer:null,loop:false});
 class AudioContext{constructor(){this.destination=node();this.sampleRate=8000;this.currentTime=1;}createGain(){return node();}createOscillator(){return node();}createBiquadFilter(){return node();}createDynamicsCompressor(){return node();}createBuffer(_,n){return {getChannelData:()=>new Float32Array(n)};}createBufferSource(){return node();}resume(){return resumeGate;}}
 globalThis.window={AudioContext};
 const a=new EngineAudio();const first=a.toggle(),second=a.toggle();
 assert.equal(a.pending,true);assert.equal(a.on,false);
 releaseResume();
 assert.deepEqual(await Promise.all([first,second]),[true,true]);
 assert.equal(a.on,true);assert.equal(a.pending,false);assert.equal(a.pendingPromise,null);
 a.pause(false);assert.equal(a.needsFrame(),true);
 a.pause(true);assert.equal(a.needsFrame(),false);
 a.pause(false);a.ctx.currentTime+=.05;assert.equal(a.needsFrame(),true);
 assert.equal(await a.toggle(),false);assert.equal(a.on,false);assert.equal(a.needsFrame(),false);
});

test('6.6: high/medium/eco keep camera/display aspects and distances in finite ranges',()=>{
 for(const [w,h,dpr] of [[375,812,3],[1280,720,1],[2560,1440,2],[3440,1440,2]]){
  for(const q of [1,.78,.55]){
   const r=renderResolution(w,h,dpr,q);
   assert.ok(r.width>=1&&r.height>=1);assert.ok(Math.abs(r.width/r.height-w/h)<.025);
   assert.ok(r.width*r.height<=Math.ceil(q===1?2500000:q===.78?1200000:750000));
  }
 }
 assert.equal(rivalDrawPlan(250*250,1),'full');assert.equal(rivalDrawPlan(250*250,.55),'body');
});

test('6.6: release metadata and help instructions stay in sync with implemented controls',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const src=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 for(const id of ['lightingBtn','graphicsBtn','soundBtn','fxBtn','cameraBtn','pauseBtn','settingsBtn','helpBtn']){
  assert.match(html,new RegExp(`id="${id}"`));assert.match(src,new RegExp(`\\$\\('${id}'\\)\\.addEventListener\\('click'`));
 }
 assert.match(html,/id="startBtn"/);assert.match(src,/ui\.start\.addEventListener\('click',unpause\)/);
 assert.match(src,/document\.addEventListener\('visibilitychange'/);
 assert.match(src,/window\.addEventListener\('blur'/);
 assert.match(src,/audio\.pause\(paused\)/);
 assert.match(src,/audio\.pause\(paused\|\|helpOpen\|\|settingsOpen\|\|archiveOpen\|\|contactOpen\|\|collectionOpen\|\|workshopOpen\)/,'do not resume sound while panel remains open');
 assert.match(html,/<span>B<\/span><b>Ambiente de Barcelona/);
 assert.match(html,/id="settingMotion"/);
});
