/** Pedestrian state for Gael Verenne. No vehicle may be entered while moving. */
import {nearestStreet,CITY} from './city.js';
import {cityBuildingAt} from './urban-buildings.js';
import {getCar} from './garage.js';
import {initDamage} from './damage.js';
export const INTERACT_RADIUS=8;
export function makePedestrian(){return {active:false,x:0,z:0,yaw:0,viewYaw:0,step:0,moving:false,running:false};}
export function exitVehicle(foot,car,obstacles=[]){
 if(foot.active||Math.abs(car.speed)>.8)return false;
 // Try the driver's side, then the opposite side; never spawn inside another car.
 for(const side of [1,-1]){
  const x=car.x+Math.cos(car.yaw)*3.9*side,z=car.z-Math.sin(car.yaw)*3.9*side;
  if(!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>=CITY.bounds||Math.abs(z)>=CITY.bounds)continue;
  if(nearestStreet(x,z).distance>CITY.sidewalkHalf+2)continue;
  if(cityBuildingAt(x,z,.55))continue;
  if(obstacles.some(v=>v&&Number.isFinite(v.x)&&Number.isFinite(v.z)&&Math.hypot(x-v.x,z-v.z)<2.6))continue;
  Object.assign(foot,{active:true,x,z,yaw:car.yaw,viewYaw:car.yaw,step:0,moving:false,running:false});return true;
 }
 return false;
}
/** Fixed-step walking: swept collision checks avoid skipping parked vehicles at low FPS. */
export function stepPedestrian(foot,input,dt,obstacles=[]){
 if(!foot.active||!Number.isFinite(dt)||dt<=0)return foot;
 const f=Number(Boolean(input.throttle))-Number(Boolean(input.brake));
 const s=Number(Boolean(input.left))-Number(Boolean(input.right));
 const mag=Math.hypot(f,s);
 if(!mag){foot.moving=false;foot.running=false;return foot;}
 // Movement is relative to the stable walking camera, not world X/Z axes.
 // The renderer looks from behind viewYaw: W walks away from the camera,
 // A goes screen-left, D screen-right, independent of the parked car's heading.
 // Turning Gael's body must NOT rotate the camera in response to every keypress.
 const viewYaw=Number.isFinite(foot.viewYaw)?foot.viewYaw:(Number.isFinite(foot.yaw)?foot.yaw:0);
 const pace=input.handbrake?6.1:4.4;
 const vx=(f*Math.sin(viewYaw)+s*Math.cos(viewYaw))/mag*pace;
 const vz=(f*Math.cos(viewYaw)-s*Math.sin(viewYaw))/mag*pace;
 const collision=(x,z)=>{
  if(Math.abs(x)>=CITY.bounds||Math.abs(z)>=CITY.bounds||nearestStreet(x,z).distance>CITY.sidewalkHalf+2||cityBuildingAt(x,z,.5))return true;
  return obstacles.some((v,i)=>v&&Number.isFinite(v.x)&&Number.isFinite(v.z)&&Math.hypot(x-v.x,z-v.z)<(i===0?2.4:2.1));
 };
 // Subdivide long frame intervals to prevent tunnelling and allow wall sliding.
 const subdivisions=Math.max(1,Math.ceil(Math.hypot(vx,vz)*Math.min(dt,.25)/.65));
 const dx=vx*Math.min(dt,.25)/subdivisions,dz=vz*Math.min(dt,.25)/subdivisions;
 let moved=false;
 for(let n=0;n<subdivisions;n++){
  if(!collision(foot.x+dx,foot.z+dz)){foot.x+=dx;foot.z+=dz;moved=true;}
  else if(!collision(foot.x+dx,foot.z)){foot.x+=dx;moved=true;}
  else if(!collision(foot.x,foot.z+dz)){foot.z+=dz;moved=true;}
 }
 foot.moving=moved;foot.running=moved&&Boolean(input.handbrake);
 if(moved){foot.yaw=Math.atan2(vx,vz);foot.step+=Math.min(dt,.25)*(input.handbrake?12:9);}
 return foot;
}
export function closestVehicle(foot,car,traffic){if(!foot.active)return null;const choices=[{vehicle:car,type:'player'},...traffic.map(v=>({vehicle:v,type:'traffic'}))];return choices.map(c=>({...c,distance:Math.hypot(foot.x-c.vehicle.x,foot.z-c.vehicle.z)})).filter(c=>c.distance<=INTERACT_RADIUS).sort((a,b)=>a.distance-b.distance)[0]||null;}
export function enterVehicle(foot,car,traffic){const near=closestVehicle(foot,car,traffic);if(!near)return null;if(near.type==='traffic'&&near.vehicle.currentSpeed>.5)return null;if(near.type==='traffic') {const abandoned={index:1000+traffic.length,vehicleId:car.vehicleId||'racer',x:car.x,z:car.z,yaw:car.yaw,wheel:car.wheel||0,speed:0,currentSpeed:0,braking:true,parked:true};const v=near.vehicle;const id=getCar(v.vehicleId).id;Object.assign(car,{x:v.x,z:v.z,yaw:v.yaw,speed:0,vx:0,vz:0,steer:0,wheel:0,kmh:0,vehicleId:id,tune:{...getCar(id).tune},wall:false,offroad:false});initDamage(car);traffic.splice(traffic.indexOf(v),1);traffic.push(abandoned);}foot.active=false;foot.moving=false;return near.type;}

/** Recenter the walking camera behind Gael without changing his position or controls. */
export function recenterPedestrianCamera(foot){
 if(!foot?.active||!Number.isFinite(foot.yaw))return false;
 foot.viewYaw=foot.yaw;
 return true;
}
