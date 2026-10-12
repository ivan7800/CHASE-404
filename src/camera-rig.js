/** CHASE 404 — phase 6.3: bounded, deterministic camera dynamics.
 * All coordinates and velocities are world units/metres/second. This module
 * contains no browser or WebGL calls, so motion can be regression tested.
 */
const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number.isFinite(n)?n:0));
const blend=(dt,rate)=>1-Math.exp(-clamp(dt,0,.05)*rate);
const point=(p)=>({x:p.x,y:p.y,z:p.z});
export function makeCameraRig(){return {eye:null,target:null,fov:58,roll:0,impact:0,phase:0,initialized:false};}
export function resetCameraRig(rig){Object.assign(rig,makeCameraRig());return rig;}
/** One pulse per actual contact; impact is a 0..1 visual strength, not health damage. */
export function queueCameraImpact(rig,strength){
 const value=clamp(strength,0,1);
 rig.impact=Math.min(1,Math.max(rig.impact,value));
 return rig.impact;
}
export function advanceCameraRig(rig,car,{dt=1/60,mode=0,urban=false,foot=null,elevation=()=>0,motion=true}={}){
 const step=clamp(dt,0,.05),walking=Boolean(foot?.active),actor=walking?foot:car;
 // A pedestrian faces the movement vector, but the camera heading must remain
 // fixed when pressing A/D/S. Otherwise each direction change rotates the view
 // and makes the very same key feel reversed on the next frame.
 const facing=walking&&Number.isFinite(foot.viewYaw)?foot.viewYaw:actor.yaw;
 const yaw=Number.isFinite(facing)?facing:0;
 const fx=Math.sin(yaw),fz=Math.cos(yaw),rx=fz,rz=-fx;
 const speed=walking?0:clamp(Math.abs(car.speed||0),0,85);
 const dynamic=motion&&!walking;
 const speedFactor=dynamic?clamp((speed-10)/55,0,1):0;
 // Velocity projected onto the car's right-hand side: actual slip, not steering input.
 const lateral=dynamic?clamp(((car.vx||0)*rx+(car.vz||0)*rz)/19,-1,1):0;
 const lean=dynamic?clamp(lateral*.67+(car.steer||0)*speed/120,-.75,.75):0;
 const cameraMode=walking?0:mode;
 const baseline=cameraMode===1?19:cameraMode===2?-.8:walking?7:11;
 const behind=baseline+(cameraMode===2?0:speedFactor*(cameraMode===1?1.4:2.4));
 const side=dynamic&&cameraMode!==2?lean*1.12:0;
 const eye={x:actor.x-fx*behind+rx*side,z:actor.z-fz*behind+rz*side};
 eye.y=(urban?elevation(eye.x,eye.z):0)+(cameraMode===2?2.42:cameraMode===1?12:6.7)+(dynamic&&cameraMode!==2?speedFactor*.48:0);
 const forward=walking?5:cameraMode===2?34:13;
 const target={x:actor.x+fx*forward+(dynamic?rx*lean*2.0:0),z:actor.z+fz*forward+(dynamic?rz*lean*2.0:0)};
 target.y=(urban?elevation(target.x,target.z):0)+(cameraMode===2?1.8:2);
 const desiredFov=cameraMode===2?63:58+(dynamic?speed*.18+speedFactor*2.3:0);
 const desiredRoll=dynamic&&cameraMode!==2?clamp(-lean*.032,-.032,.032):0;
 if(!rig.initialized){rig.eye=point(eye);rig.target=point(target);rig.fov=desiredFov;rig.roll=desiredRoll;rig.initialized=true;}
 else{
  // Fast enough to follow sharp turns, slow enough to avoid keyboard jitter.
  const eyeT=blend(step,walking?12.5:cameraMode===2?12:7.8),aimT=blend(step,walking?14:10.8),zoomT=blend(step,3.4);
  for(const ax of ['x','y','z']){rig.eye[ax]+=(eye[ax]-rig.eye[ax])*eyeT;rig.target[ax]+=(target[ax]-rig.target[ax])*aimT;}
  rig.fov+=(desiredFov-rig.fov)*zoomT;rig.roll+=(desiredRoll-rig.roll)*blend(step,5.7);
 }
 if(!motion){rig.roll=0;rig.fov=desiredFov;rig.impact=0;}
 rig.phase+=step;
 // Decay using elapsed seconds; the pulse is deterministic and cannot accumulate indefinitely.
 rig.impact*=Math.exp(-step*8.5);
 if(rig.impact<.001)rig.impact=0;
 const amplitude=dynamic?rig.impact*.30:0;
 const resultEye=point(rig.eye),resultTarget=point(rig.target);
 if(amplitude>0){
  const a=Math.sin(rig.phase*61)*amplitude,b=Math.sin(rig.phase*47+1.2)*amplitude*.65;
  resultEye.x+=rx*a;resultEye.z+=rz*a;resultEye.y+=b;
  resultTarget.y+=b*.35;
 }
 const fov=clamp(rig.fov,50,80),roll=clamp(rig.roll,-.04,.04);
 return {eye:resultEye,target:resultTarget,fov,roll,speedFactor,slip:lateral,impact:rig.impact};
}
