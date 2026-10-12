/** Adapted from the local WebGL approach in EIFFEL-404; original camera, shaders and assets. */
import {buildTrack,buildCar,buildWheel,buildCarShadow,Builder} from './geometry.js';
import {loadGLB} from './glb.js';
import {getTrack} from './track.js';
import {getCar,CARS} from './garage.js';
import {DrivingEffects,makeDustMesh} from './vfx.js';
import {buildCity,contactPlacement,CONTACT_VISUAL_PROFILES} from './city.js';
import {CONTACTS} from './contacts.js';
import {contactPose} from './contact-animation.js';
import {buildGaelMeshes,GAEL_RIG,gaelGaitPose,blendGaelPose} from './gael-model.js';
import {STORY_ACTORS,storyActorPose} from './story-actors.js';
import {cityElevation} from './city.js';
import {SIGNALS,signalState} from './signals.js';
import {DEFAULT_LIGHTING,getLighting,normalizeLighting} from './atmosphere.js';
import {makeCameraRig,resetCameraRig,queueCameraImpact,advanceCameraRig} from './camera-rig.js';
import {rivalDrawPlan,renderResolution} from './performance.js';
const VS=`attribute vec3 aPos; attribute vec3 aNormal; attribute vec3 aColor;
uniform mat4 uMVP; uniform mat4 uModel; varying vec3 vColor; varying vec3 vNormal; varying vec3 vWorldPosition; varying float vDistance;
void main(){vec4 clip=uMVP*vec4(aPos,1.0);gl_Position=clip;vDistance=clamp(clip.w,0.0,2200.0);vColor=aColor;vNormal=mat3(uModel)*aNormal;vWorldPosition=(uModel*vec4(aPos,1.0)).xyz;}`;
const FS=`precision mediump float;
varying vec3 vColor;varying vec3 vNormal;varying vec3 vWorldPosition;varying float vDistance;
uniform vec3 uSky;uniform vec3 uSun;uniform vec3 uSunDirection;
uniform vec3 uAmbientLow;uniform vec3 uAmbientHigh;
uniform float uExposure;uniform float uSunPower;
uniform float uFogStart;uniform float uFogEnd;uniform float uFogStrength;uniform float uWarmth;uniform float uLamps;
uniform float uMaterialType;uniform vec3 uCameraPos;
void main(){
 vec3 N=normalize(vNormal);
 float sunlight=max(dot(N,normalize(uSunDirection)),0.0);
 float hemi=clamp(N.y*.5+.5,0.0,1.0);
 vec3 ambient=mix(uAmbientLow,uAmbientHigh,hemi);
 vec3 direct=uSun*(sunlight*uSunPower);
 vec3 col=vColor*(ambient+direct)*uExposure;
 float edge=pow(1.0-abs(dot(N,normalize(vec3(.3,.35,.88)))),3.0)*.047;
 col+=uSun*edge;
 col+=vec3(.12,.045,.006)*max(N.y,0.0)*uWarmth;
 // Material 1 = vehicle paint/glass, 2 = rubber/chrome wheel. Keep the environment matte.
 // A broad clearcoat highlight catches late sun on GLB and procedural cars alike.
 if(uMaterialType>0.5){
   vec3 V=normalize(uCameraPos-vWorldPosition);
   vec3 H=normalize(V+normalize(uSunDirection));
   float ndoth=max(dot(N,H),0.0);
   float gloss=pow(ndoth,uMaterialType<1.5?31.0:52.0);
   float rim=pow(1.0-max(dot(N,V),0.0),4.0);
   float specularPower=uMaterialType<1.5?.32:.15;
   // Era chrome and glass are classified only for vehicles; city materials stay matte.
   // Palette-based treatment works on all six local GLB meshes without new assets.
   vec3 chromeA=vec3(205.0,199.0,176.0)/255.0;
   vec3 chromeB=vec3(232.0,224.0,195.0)/255.0;
   vec3 glassA=vec3(104.0,156.0,168.0)/255.0;
   vec3 glassB=vec3(59.0,105.0,120.0)/255.0;
   float chromeMask=max(1.0-step(.032,distance(vColor,chromeA)),1.0-step(.032,distance(vColor,chromeB)));
   float glassMask=max(1.0-step(.034,distance(vColor,glassA)),1.0-step(.034,distance(vColor,glassB)));
   float nDotV=max(dot(N,V),0.0);
   float glassFresnel=pow(1.0-nDotV,3.5);
   // Glass carries a subtle sky reflection, most visible at grazing angles.
   vec3 skyReflection=mix(uSky,vec3(.42,.55,.60),.18);
   col=mix(col,col*.70+skyReflection*(.36+glassFresnel*.62),glassMask*.73);
   // Chrome reflects sky and sun more sharply than paint; never affects rubber.
   col=mix(col,col*.64+skyReflection*.52+uSun*pow(ndoth,74.0)*.66*uSunPower,chromeMask*.82);
   col+=uSun*(gloss*specularPower+rim*.042)*uSunPower*uExposure;
 }
 // Low-pressure street lamps and warm-lit windows are identified using the
 // exact authored vertex palette, avoiding a separate texture or light pass.
 float lampA=1.0-step(.013,length(vColor-vec3(224.0,173.0,98.0)/255.0));
 float lampB=1.0-step(.013,length(vColor-vec3(230.0,196.0,121.0)/255.0));
 float windows=1.0-step(.013,length(vColor-vec3(207.0,166.0,92.0)/255.0));
 col+=vec3(1.0,.57,.22)*uLamps*min(1.0,lampA+lampB+windows*.58);
 float fog=smoothstep(uFogStart,uFogEnd,vDistance)*uFogStrength;
 col=mix(col,uSky,fog);
 gl_FragColor=vec4(pow(max(col,vec3(0.0)),vec3(.96)),1.0);
}`;
function shader(gl,type,text){const sh=gl.createShader(type);gl.shaderSource(sh,text);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh;}
function multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let k=0;for(let j=0;j<4;j++)k+=a[j*4+r]*b[c*4+j];o[c*4+r]=k;}return o;}
function normalize(a){let n=Math.hypot(...a)||1;return a.map(x=>x/n);}
function lookAt(eye,target,roll=0){const z=normalize(eye.map((v,i)=>v-target[i]));let x=normalize([z[2],0,-z[0]]);let y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];if(roll){const a=Math.cos(roll),b=Math.sin(roll),ox=x;x=ox.map((v,i)=>v*a+y[i]*b);y=y.map((v,i)=>v*a-ox[i]*b);}return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x.reduce((s,v,i)=>s+v*eye[i],0),-y.reduce((s,v,i)=>s+v*eye[i],0),-z.reduce((s,v,i)=>s+v*eye[i],0),1]);}
function projection(aspect,fov=58){const f=1/Math.tan(fov*Math.PI/360),near=.18,far=1700;return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0]);}
function transform(x=0,y=0,z=0,yaw=0){const c=Math.cos(yaw),s=Math.sin(yaw);return new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,x,y,z,1]);}
function transformVehicle(x,y,z,yaw,pitch=0){const c=Math.cos(yaw),s=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);return new Float32Array([c,0,-s,0,-s*sp,cp,-c*sp,0,s*cp,sp,c*cp,0,x,y,z,1]);}
function coloredCar(mesh,color){
 const colors=new Uint8Array(mesh.colors);
 for(let i=0;i<colors.length;i+=3){
  if(colors[i]===235&&colors[i+1]===63&&colors[i+2]===63){colors.set(color,i);}
  else if(colors[i]===161&&colors[i+1]===42&&colors[i+2]===46){colors.set(color.map(v=>Math.round(v*.66)),i);}
 }
 return {...mesh,colors};
}
function spinX(angle){const c=Math.cos(angle),s=Math.sin(angle);return new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]);}
export class Renderer{
 constructor(canvas){
  this.canvas=canvas;this.gl=canvas.getContext('webgl',{alpha:false,antialias:true,powerPreference:'high-performance'}) ||canvas.getContext('experimental-webgl');
  if(!this.gl)throw Error('Tu navegador no proporciona WebGL. Activa la aceleración por hardware.');
  const gl=this.gl,prog=gl.createProgram();gl.attachShader(prog,shader(gl,gl.VERTEX_SHADER,VS));gl.attachShader(prog,shader(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(prog));gl.useProgram(prog);
  this.program=prog;this.boundMesh=null;this.drawCalls=0;
  this.attrs=['aPos','aNormal','aColor'].map(x=>gl.getAttribLocation(prog,x));
  this.mvp=gl.getUniformLocation(prog,'uMVP');this.model=gl.getUniformLocation(prog,'uModel');this.sky=gl.getUniformLocation(prog,'uSky');this.exposure=gl.getUniformLocation(prog,'uExposure');this.sun=gl.getUniformLocation(prog,'uSun');this.sunDirection=gl.getUniformLocation(prog,'uSunDirection');this.ambientLow=gl.getUniformLocation(prog,'uAmbientLow');this.ambientHigh=gl.getUniformLocation(prog,'uAmbientHigh');this.sunPower=gl.getUniformLocation(prog,'uSunPower');this.fogStart=gl.getUniformLocation(prog,'uFogStart');this.fogEnd=gl.getUniformLocation(prog,'uFogEnd');this.fogStrength=gl.getUniformLocation(prog,'uFogStrength');this.warmth=gl.getUniformLocation(prog,'uWarmth');this.lamps=gl.getUniformLocation(prog,'uLamps');this.materialType=gl.getUniformLocation(prog,'uMaterialType');this.cameraPos=gl.getUniformLocation(prog,'uCameraPos');
  this.track=this.upload(buildTrack());this.city=this.upload(buildCity());this.urban=false;this.vehicle=getCar('racer');this.car=this.upload(buildCar(this.vehicle));this.imported=null;this.vehicleMeshes=new Map();this.vehicleLoads=new Map();
  // Distinctive low-poly protagonist, split into independently articulated pieces.
  const gael=buildGaelMeshes();
  this.gaelSmoothedPose=null;
  this.pedestrian=this.upload(gael.body);
  this.pedestrianDetails=this.upload(gael.detail);
  this.walkLeg=this.upload(gael.leg);
  this.walkArm=this.upload(gael.arm);
  this.walkShin=this.upload(gael.shin);
  this.walkForearm=this.upload(gael.forearm);
  // The same segmented rig can be supplied as local GLB assets. Continue rendering
  // procedural pieces until every GLB loads; no partially assembled characters.
  this.gaelSource='procedural';this.gaelAssetError=null;
  this.gaelAssetPromise=this.loadGaelParts();
  // Secondary characters are individual articulated meshes, not baked city geometry.
  this.contactActors=CONTACTS.map((c,i)=>{
   const v=CONTACT_VISUAL_PROFILES[i],body=new Builder(),arm=new Builder(),head=new Builder();
   body.taperedBox(0,.96,0,[.9,.65],[.75,.52],2.5,v.coat);
   body.box(0,2.48,0,.93,.18,.66,v.coat);
   for(const side of [-1,1]){
    body.box(side*.23,.54,0,.34,1.04,.47,v.trousers);
    body.box(side*.23,.12,-.1,.42,.24,.69,[37,37,39]);
   }
   arm.box(0,-.52,0,.28,1.08,.42,v.coat);
   head.box(0,.16,0,.64,.68,.55,[205,161,124]);
   head.box(0,.55,.035,.72,.19,.63,v.hair);
   for(const side of [-1,1])head.box(side*.19,.22,-.285,.065,.055,.028,[55,47,40]);
   if(v.accessory==='toolbox'){
    body.box(.93,.92,0,.7,.48,.47,[97,111,112]);
    body.box(.93,1.24,0,.36,.12,.12,[184,186,175]);
   }else if(v.accessory==='satchel'){
    body.box(-.7,1.22,0,.53,.71,.25,[100,70,54]);
    body.box(-.7,1.46,-.15,.34,.12,.08,[183,147,102]);
   }else{
    body.box(.71,1.55,-.31,.56,.42,.43,[44,48,54]);
    body.cylinder(.71,1.52,-.58,.13,.2,8,[135,138,144]);
   }
   return {id:c.id,position:contactPlacement(c),body:this.upload(body.finish()),arm:this.upload(arm.finish()),head:this.upload(head.finish())};
  });
  // Figures dedicated to the final act, separate from the static city mesh.
  this.storyActorMeshes=Object.fromEntries(Object.values(STORY_ACTORS).map(actor=>{
   const coat=actor.id==='salvat'?[44,47,58]:[93,89,79];
   const trousers=actor.id==='salvat'?[28,30,38]:[65,66,63];
   const body=new Builder(),head=new Builder(),arm=new Builder();
   body.taperedBox(0,1.17,0,[.92,.64],[.72,.52],2.20,coat);
   body.box(0,2.32,-.28,.42,.20,.08,actor.id==='salvat'?[172,48,46]:[211,188,148]);
   for(const side of [-1,1]){
    body.box(side*.24,.57,0,.32,1.11,.45,trousers);
    body.box(side*.24,.11,-.12,.39,.21,.59,[33,34,37]);
   }
   arm.box(0,-.43,0,.29,.84,.36,coat);
   head.box(0,.18,0,.59,.72,.54,actor.id==='salvat'?[191,139,105]:[202,155,121]);
   head.box(0,.53,.02,.65,.16,.59,actor.id==='salvat'?[49,50,55]:[58,44,33]);
   return [actor.id,{body:this.upload(body.finish()),arm:this.upload(arm.finish()),head:this.upload(head.finish())}];
  }));
  this.storyActors=[];
  this.signalMeshes={};for(const [name,color] of Object.entries({green:[71,220,120],amber:[250,180,55],red:[245,72,58]})){const g=new Builder();g.box(0,2.65,0,.36,5.3,.36,[84,91,91]);g.box(0,5.2,0,.96,1.65,.7,[32,38,41]);for(const [i,c] of [[0,[245,72,58]],[1,[250,180,55]],[2,[71,220,120]]])g.box(0,5.72-i*.53,.4,.49,.38,.12,i===({red:0,amber:1,green:2}[name])?color:[52,55,56]);this.signalMeshes[name]=this.upload(g.finish());}
  this.shadow=this.upload(buildCarShadow());this.wheel=this.upload(buildWheel());this.dust=this.upload(makeDustMesh());this.effects=new DrivingEffects();
  const base=buildCar();this.rivalModels=[
   [56,153,240],[252,179,55],[110,229,166],[220,112,233],
   [243,108,79],[211,215,223],[92,224,224]
  ].map(color=>this.upload(coloredCar(base,color)));
  this.modelSource='procedural';this.modelError=null;
  this.assetPromise=this.loadVehicle('racer');
  this.lighting=DEFAULT_LIGHTING;this.cam={x:96,y:13,z:-62};this.look={x:82,y:0,z:-70};this.cameraMode=0;this.quality=1;this.frames=0;this.lastFpsAt=0;this.fps=0;this.startCam=true;this.cameraRig=makeCameraRig();this.effectsEnabled=true;
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.clearColor(.58,.73,.82,1);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.contextLost=true;window.dispatchEvent(new CustomEvent('chase-context-lost'));});
 }
 upload(mesh){const gl=this.gl;const b=[];for(const data of [mesh.positions,mesh.normals,mesh.colors]){const buff=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buff);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);b.push(buff);}return {b,count:mesh.count};}
 deleteMesh(mesh){if(mesh){if(this.boundMesh===mesh)this.boundMesh=null;for(const b of mesh.b)this.gl.deleteBuffer(b);}}
 draw(mesh,model,viewProjection,material=0){const gl=this.gl;gl.uniform1f(this.materialType,material);gl.uniformMatrix4fv(this.mvp,false,multiply(viewProjection,model));gl.uniformMatrix4fv(this.model,false,model);
  if(this.boundMesh!==mesh){const types=[gl.FLOAT,gl.FLOAT,gl.UNSIGNED_BYTE];for(let i=0;i<3;i++){gl.bindBuffer(gl.ARRAY_BUFFER,mesh.b[i]);gl.enableVertexAttribArray(this.attrs[i]);gl.vertexAttribPointer(this.attrs[i],3,types[i],i===2,0,0);}this.boundMesh=mesh;}gl.drawArrays(gl.TRIANGLES,0,mesh.count);this.drawCalls++;}
 changeTrack(){
  const refreshed=this.upload(buildTrack());this.deleteMesh(this.track);this.track=refreshed;this.startCam=true;resetCameraRig(this.cameraRig);this.effects.clear();
 }
 setUrbanMode(value){this.urban=Boolean(value);this.startCam=true;resetCameraRig(this.cameraRig);this.effects.clear();}
 setLighting(value){this.lighting=normalizeLighting(value);return getLighting(this.lighting);}
 emitDrivingEffects(car,dt,handbrake=false){this.effects.update(car,dt,handbrake);}
 setEffectsEnabled(value){this.effectsEnabled=Boolean(value);this.effects.setEnabled(value);if(!value)this.cameraRig.impact=0;}
 notifyImpact(strength){if(this.effectsEnabled)queueCameraImpact(this.cameraRig,strength);}
 async loadGaelParts(){
  const names=['body','detail','leg','arm','shin','forearm'];
  const keys=['pedestrian','pedestrianDetails','walkLeg','walkArm','walkShin','walkForearm'];
  const staged=[];
  try{
   const parts=await Promise.all(names.map(name=>loadGLB('./assets/models/gael/'+name+'.glb')));
   if(this.contextLost)return false;
   for(const part of parts)staged.push(this.upload(part));
   if(this.contextLost){for(const m of staged)this.deleteMesh(m);return false;}
   const previous=keys.map(key=>this[key]);
   for(let i=0;i<keys.length;i++)this[keys[i]]=staged[i];
   for(const m of previous)this.deleteMesh(m);
   this.gaelSource='GLB';return true;
  }catch(error){
   for(const mesh of staged)this.deleteMesh(mesh);
   this.gaelAssetError=String(error?.message||error);
   console.warn('[CHASE 404] Gael GLB no disponible; usando figura procedural:',error);
   return false;
  }
 }
 loadVehicle(id){
  if(this.vehicleLoads.has(id))return this.vehicleLoads.get(id);
  const path=id==='racer'?'racer-04':id;
  const promise=loadGLB('./assets/models/'+path+'.glb').then(mesh=>{
   if(this.contextLost)return false;
   const gpu=this.upload(mesh);this.vehicleMeshes.set(id,gpu);
   if(id==='racer')this.imported=gpu;
   if(this.vehicle.id===id){
    if(this.car!==gpu&&!Array.from(this.vehicleMeshes.values()).includes(this.car))this.deleteMesh(this.car);
    this.car=gpu;this.modelSource='GLB';
   }
   return true;
  }).catch(e=>{
   this.modelError=String(e?.message||e);
   console.warn('[CHASE 404] GLB local no disponible; se mantiene el coche procedural:',e);
   return false;
  });
  this.vehicleLoads.set(id,promise);return promise;
 }
 changeVehicle(id){
  const spec=getCar(id),cached=this.vehicleMeshes.get(spec.id);
  const next=cached||this.upload(buildCar(spec));
  if(this.car!==next&&!Array.from(this.vehicleMeshes.values()).includes(this.car))this.deleteMesh(this.car);
  this.car=next;this.vehicle=spec;this.modelSource=cached?'GLB':'procedural';
  this.assetPromise=this.loadVehicle(spec.id);
 }
 setQuality(value){this.quality=Math.min(1,Math.max(.5,Number(value)||1));this.width=0;}
 nextCamera(){this.cameraMode=(this.cameraMode+1)%3;this.startCam=true;resetCameraRig(this.cameraRig);return ['CHASE','WIDE','BONNET'][this.cameraMode];}
 render(car,dt,rivals=[],foot=null){if(this.contextLost)return;
  const c=this.canvas,gl=this.gl,rect=c.getBoundingClientRect();if(rect.width<=0||rect.height<=0)return;
  const {width:w,height:h}=renderResolution(rect.width,rect.height,window.devicePixelRatio||1,this.quality);if(c.width!==w||c.height!==h){c.width=w;c.height=h;gl.viewport(0,0,w,h);}this.drawCalls=0;const preset=this.urban?getLighting(this.lighting):null;gl.clearColor(...(preset?.sky||getTrack().sky),1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const f=[Math.sin(car.yaw),Math.cos(car.yaw)],mode=foot?.active?0:this.cameraMode,carY=this.urban?cityElevation(car.x,car.z):0;
  if(this.startCam){resetCameraRig(this.cameraRig);this.startCam=false;}
  const shot=advanceCameraRig(this.cameraRig,car,{dt,mode:this.cameraMode,urban:this.urban,foot,elevation:cityElevation,motion:this.effectsEnabled});
  this.cam=shot.eye;this.look=shot.target;
  const view=lookAt([shot.eye.x,shot.eye.y,shot.eye.z],[shot.target.x,shot.target.y,shot.target.z],shot.roll);
  const proj=projection(w/h,shot.fov),vp=multiply(proj,view);
  gl.useProgram(this.program);
  // Re-use the original circuit looks; Barcelona has its own period lighting presets.
  const look=preset||{sky:getTrack().sky,sun:[1,.83,.64],direction:[-.52,.83,.28],ambientLow:[.29,.39,.48],ambientHigh:[.59,.63,.62],sunPower:.64,exposure:getTrack().id==='ridge'?1.01:1.08,fogStart:290,fogEnd:1050,fogStrength:.88,warmth:getTrack().id==='sunset'?1:getTrack().id==='pacific'?.45:.12,lamps:0};
  gl.uniform3f(this.sky,...look.sky);gl.uniform3f(this.sun,...look.sun);gl.uniform3f(this.sunDirection,...look.direction);
  gl.uniform3f(this.ambientLow,...look.ambientLow);gl.uniform3f(this.ambientHigh,...look.ambientHigh);
  gl.uniform1f(this.sunPower,look.sunPower);gl.uniform1f(this.exposure,look.exposure);
  gl.uniform1f(this.fogStart,look.fogStart);gl.uniform1f(this.fogEnd,look.fogEnd);
  gl.uniform1f(this.fogStrength,look.fogStrength);gl.uniform1f(this.warmth,look.warmth);gl.uniform1f(this.lamps,look.lamps);gl.uniform3f(this.cameraPos,this.cam.x,this.cam.y,this.cam.z);
  this.draw(this.urban?this.city:this.track,transform(),vp);
  if(this.urban){
   for(const [i,actor] of this.contactActors.entries()){
    const {x,y,z}=actor.position;
    if((x-car.x)**2+(z-car.z)**2>260*260)continue;
    const pose=contactPose(this.urbanTime||0,i,!this.effectsEnabled||this.reducedMotion);
    const base=transform(x,y+pose.bob,z,pose.yaw);
    this.draw(actor.body,base,vp);
    this.draw(actor.head,multiply(base,multiply(transform(0,2.78,0),spinX(pose.head))),vp);
    for(const side of [-1,1]){
     const shoulder=multiply(base,transform(side*.61,2.38,0));
     this.draw(actor.arm,multiply(shoulder,spinX(side<0?pose.leftArm:pose.rightArm)),vp);
    }
   }
  }
  if(this.urban)for(const actor of this.storyActors||[]){
   const pieces=this.storyActorMeshes[actor.id];if(!pieces)continue;
   if((actor.x-car.x)**2+(actor.z-car.z)**2>260*260)continue;
   const pose=storyActorPose(this.urbanTime||0,actor.id,!this.effectsEnabled||this.reducedMotion);
   const base=transform(actor.x,cityElevation(actor.x,actor.z)+pose.bob,actor.z,actor.id==='salvat'?.6:-.4);
   this.draw(pieces.body,base,vp);
   this.draw(pieces.head,multiply(base,multiply(transform(0,2.6,0),spinX(pose.head))),vp);
   for(const side of [-1,1])this.draw(pieces.arm,multiply(base,multiply(transform(side*.62,2.24,0),spinX(side<0?pose.leftArm:pose.rightArm))),vp);
  }
  if(this.urban)for(const signal of SIGNALS){if((signal.x-car.x)**2+(signal.z-car.z)**2>950*950)continue;const phase=signalState(signal,this.urbanTime||0);this.draw(this.signalMeshes[phase],transform(signal.x+3,cityElevation(signal.x+3,signal.z)+.2,signal.z+3),vp);}
  if(mode!==2){
   this.draw(this.shadow,transform(car.x,carY+.042,car.z,car.yaw),vp);
   const slopeAhead=this.urban?cityElevation(car.x+f[0]*2.4,car.z+f[1]*2.4):carY,slopeBack=this.urban?cityElevation(car.x-f[0]*2.4,car.z-f[1]*2.4):carY;
   const pitch=this.urban?Math.atan2(slopeAhead-slopeBack,4.8):0;
   const pose=transformVehicle(car.x,carY+.14,car.z,car.yaw,pitch);
   this.draw(this.car,pose,vp,1);
   for(const x of [-1.66,1.66])for(const z of [-2.42,2.35]){
     const wheelLocal=multiply(transform(x,.75,z,z>0?car.steer*.31:0),spinX(car.wheel));
     this.draw(this.wheel,multiply(pose,wheelLocal),vp,2);
   }
  }
  if(!foot?.active)this.gaelSmoothedPose=null;
  if(foot?.active){
   const target=gaelGaitPose({moving:foot.moving,running:foot.running,phase:foot.step||0});
   // Frame-rate-independent easing: responsive starts, controlled landings and stops.
   const alpha=1-Math.exp(-Math.max(0,Math.min(dt||0,.1))*13);
   const pose=this.gaelSmoothedPose=blendGaelPose(this.gaelSmoothedPose,target,alpha);
   const base=transform(foot.x,cityElevation(foot.x,foot.z)+.14+pose.bounce,foot.z,foot.yaw);
   // Preserve stable player yaw/camera and the original shoulder/hip pivot locations.
   this.draw(this.pedestrian,base,vp);
   this.draw(this.pedestrianDetails,base,vp);
   for(let i=0;i<2;i++){
    const side=i===0?-1:1;
    const hip=multiply(base,transform(side*GAEL_RIG.hipX,GAEL_RIG.hipY,0));
    const shoulder=multiply(base,transform(side*GAEL_RIG.shoulderX,GAEL_RIG.shoulderY,0));
    const thighPose=multiply(hip,spinX(pose.legs[i]));
    const upperArmPose=multiply(shoulder,spinX(pose.arms[i]+pose.lean));
    this.draw(this.walkLeg,thighPose,vp);
    this.draw(this.walkShin,multiply(multiply(thighPose,transform(0,-.32,0)),spinX(pose.knees[i])),vp);
    this.draw(this.walkArm,upperArmPose,vp);
    this.draw(this.walkForearm,multiply(multiply(upperArmPose,transform(0,-.31,0)),spinX(pose.elbows[i])),vp);
   }
  }
  // Opponent meshes are unique colored liveries; share shadows and wheel buffers.
  for(const r of rivals){
   // Beyond the fog end, rivals are not perceptible: skip their ten draw calls.
   const dx=r.x-car.x,dz=r.z-car.z;
   const lod=rivalDrawPlan(dx*dx+dz*dz,this.quality);
   if(lod==='hidden')continue;
   const rivalY=this.urban?cityElevation(r.x,r.z):0;
   if(lod==='full')this.draw(this.shadow,transform(r.x,rivalY+.042,r.z,r.yaw),vp);
   const pose=transform(r.x,rivalY+.14,r.z,r.yaw);
   this.draw(this.rivalModels[r.index%this.rivalModels.length],pose,vp,1);
   if(lod==='full')for(const x of [-1.66,1.66])for(const z of [-2.42,2.35]){
     const wheelLocal=multiply(transform(x,.75,z),spinX(r.wheel));
     this.draw(this.wheel,multiply(pose,wheelLocal),vp,2);
   }
  }
  for(const puff of this.effects.items){
   const f=puff.life/puff.total,scale=puff.scale*(1.35-.45*f);
   // Scaling the mesh on the GPU is avoided by mapping its world transform.
   const m=transform(puff.x,puff.y,puff.z,puff.life*2);
   for(const index of [0,1,2])m[index]*=scale;for(const index of [4,5,6])m[index]*=scale;for(const index of [8,9,10])m[index]*=scale;
   this.draw(this.dust,m,vp);
  }
  this.frames++;const now=performance.now();if(!this.lastFpsAt)this.lastFpsAt=now;if(now-this.lastFpsAt>=950){this.fps=Math.round(this.frames*1000/(now-this.lastFpsAt));this.frames=0;this.lastFpsAt=now;}
 }
}
