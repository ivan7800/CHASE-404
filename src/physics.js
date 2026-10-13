import {ROAD_HALF, SHOULDER, LENGTH, START_S, project, startPose, wrap, getCheckpoints} from './track.js';
import {cityStartPose,nearestStreet,CITY} from './city.js';
import {resolveCityBuildingMove} from './urban-buildings.js';
import {initDamage,damageCondition} from './damage.js';
export const FIXED_STEP=1/120;
export function createCar(){return {tune:{power:1,topSpeed:1,grip:1,steer:1,brakes:1}, ...startPose(),speed:0,steer:0,headingSpeed:0,kmh:0,offset:0,offroad:false,wall:false,travel:START_S,lap:1,completed:0, lapTime:0, elapsed:0,best:null,gate:0, valid:true,slide:0, wheel:0,hitCooldown:0,invalidLaps:0 };}
export function createUrbanCar(){return initDamage({...createCar(),...cityStartPose(),urban:true,travel:0});}
export function resetCar(car){const tune=car.tune;Object.assign(car,createCar());if(tune)car.tune=tune;}
export function step(car,input,dt){
 const throttle=input.throttle?1:0,brake=input.brake?1:0;
 const condition=car.urban?damageCondition(car):{engine:1,steering:1,brakes:1,disabled:false};
 // In the game's +Z-forward view, positive yaw moves the road toward screen-left.
 // Keep the player's conventional mapping: left input => screen-left, right => screen-right.
 const turn=(input.left?1:0)-(input.right?1:0);
 const v=Math.abs(car.speed);
 // No acceleration through walls. Speed units m/s; 68 m/s = 245 km/h.
 const draft=Math.max(0,Math.min(1,input.slipstream||0));
 const tune=car.tune||{power:1,topSpeed:1,grip:1,steer:1,brakes:1};
 const drive=(throttle&&!brake?1:0)*(22.8*(tune.power||1)*condition.engine*Math.max(.24,1-v/(102*(tune.topSpeed||1)))+draft*6.5);
 const reverse=brake?(car.speed>1?36*(tune.brakes||1)*condition.brakes:car.speed>=-.4?16*(tune.brakes||1)*condition.brakes:11*condition.brakes):0;
 const resist=(2.15+.0035*v*v)*(car.speed>=0?1:-1)*(1-.22*draft);
 const accel=drive-reverse-resist;
 car.speed=Math.max(-12,Math.min((car.urban?35:73)*(tune.topSpeed||1)+4*draft,car.speed+accel*dt));
 if(car.urban&&condition.disabled)car.speed=Math.min(car.speed,5);
 if(!throttle&&!brake&&Math.abs(car.speed)<.2)car.speed=0;
 // Steering is speed-aware and filtered; digital keys must not produce an
 // instantaneous full-lock rotation. Countersteer and grip restore stability.
 const response=turn===0?11:7;
 car.steer+=(turn-car.steer)*Math.min(1,dt*response);
 const velocityFactor=v/(v+12);
 const sensitivity=[.75,1,1.25].includes(input.steeringSensitivity)?input.steeringSensitivity:1;
 const steerPower=(1.45-.20*Math.min(1,v/70))*velocityFactor*(tune.steer||1)*condition.steering*sensitivity;
 const drift=input.handbrake&&v>5;
 car.yaw+=car.steer*steerPower*Math.sign(car.speed||1)*(drift?1.15:1)*dt;
 if(drift)car.speed*=Math.max(0,1-2.6*dt/Math.max(v,1));
 const desiredX=Math.sin(car.yaw)*car.speed,desiredZ=Math.cos(car.yaw)*car.speed;
 const grip=(drift?3.2:11.5)*(tune.grip||1);
 car.vx??=0;car.vz??=0;
 const easing=1-Math.exp(-grip*dt);
 car.vx+=(desiredX-car.vx)*easing;
 car.vz+=(desiredZ-car.vz)*easing;
 // Prevent unbounded side-sliding after a sharp key press or impact.
 const forward=car.vx*Math.sin(car.yaw)+car.vz*Math.cos(car.yaw);
 const lateral=car.vx*Math.cos(car.yaw)-car.vz*Math.sin(car.yaw);
 const maxLateral=Math.abs(car.speed)*(drift?.5:.28);
 const limited=Math.max(-maxLateral,Math.min(maxLateral,lateral));
 car.vx=forward*Math.sin(car.yaw)+limited*Math.cos(car.yaw);
 car.vz=forward*Math.cos(car.yaw)-limited*Math.sin(car.yaw);
 // Restore heading only after the driver releases the steering. Applying this
 // while a key is held cancels the turn and makes right/left feel unresponsive.
 if(turn===0&&!drift&&v>4&&Math.hypot(car.vx,car.vz)>2){
  const velAngle=Math.atan2(car.vx,car.vz);
  const difference=Math.atan2(Math.sin(velAngle-car.yaw),Math.cos(velAngle-car.yaw));
  car.yaw+=difference*Math.min(1,dt*1.8);
 }
 const previousX=car.x,previousZ=car.z;
 car.x+=car.vx*dt;car.z+=car.vz*dt;
 if(car.urban){
  const building=resolveCityBuildingMove(previousX,previousZ,car.x,car.z,
   {radius:1.65,along:[-2.25,0,2.25],yaw:car.yaw});
  car.x=building.x;car.z=building.z;
  if(building.hit){
   const {nx,nz}=building.hit,normal=car.vx*nx+car.vz*nz;
   if(normal<0){car.vx-=normal*nx;car.vz-=normal*nz;}
   car.vx*=.78;car.vz*=.78;car.speed*=.55;
  }
  const street=nearestStreet(car.x,car.z);car.offset=street.distance;
  car.offroad=street.distance>CITY.roadHalf;car.cityWallTime=Math.max(0,(car.cityWallTime||0)-dt);
  car.wall=Boolean(building.hit)||car.cityWallTime>0;
  if(car.offroad){car.speed*=1-.9*dt;car.vx*=1-.65*dt;car.vz*=1-.65*dt;}
  const maxDistance=CITY.sidewalkHalf+2;
  if(street.distance>maxDistance){
   const nx=(car.x-street.x)/street.distance,nz=(car.z-street.z)/street.distance;
   car.x=street.x+nx*maxDistance;car.z=street.z+nz*maxDistance;
   const outward=car.vx*nx+car.vz*nz;
   if(outward>0){car.vx-=nx*outward;car.vz-=nz*outward;}
   car.speed*=.72;car.wall=true;
  }
  if(car.wall)car.cityWallTime=.18;
  car.elapsed+=dt;car.lapTime+=dt;car.kmh=Math.round(Math.abs(car.speed)*3.6);car.wheel+=car.speed*dt/.42;
  car.slide+=(Math.abs(car.steer)*Math.abs(car.speed)*(input.handbrake?.01:.001)-car.slide)*Math.min(1,dt*7);
  car.hitCooldown=Math.max(0,car.hitCooldown-dt);return car;
 }
 const proj=project(car.x,car.z,car.projectIndex);
 car.projectIndex=proj.index;
 car.offset=proj.offset;car.travel=proj.s;
 car.offroad=Math.abs(proj.offset)>ROAD_HALF+0.4;
 if(car.offroad){car.speed*=1-.65*dt;car.vx*=1-.35*dt;car.vz*=1-.35*dt;}
 const maxDist=ROAD_HALF+SHOULDER+1.3;
 car.wall=false;
 if(Math.abs(proj.offset)>maxDist){
  const sign=Math.sign(proj.offset);
  car.x=proj.px+proj.ref.nx*sign*maxDist;car.z=proj.pz+proj.ref.nz*sign*maxDist;
  const outward=car.vx*proj.ref.nx*sign+car.vz*proj.ref.nz*sign;
  if(outward>0){car.vx-=proj.ref.nx*sign*outward*1.15;car.vz-=proj.ref.nz*sign*outward*1.15;}
  // A barrier scrape should not continuously drive the player into the wall.
  car.speed*=Math.max(0,1-2.5*dt);
  car.speed=Math.max(-12,Math.min(car.speed,36));
  car.vx*=.94;car.vz*=.94;
  const tangentAngle=Math.atan2(proj.ref.tx,proj.ref.tz);
  const diff=Math.atan2(Math.sin(tangentAngle-car.yaw),Math.cos(tangentAngle-car.yaw));
  car.yaw+=diff*Math.min(1,dt*4);
  car.wall=true;car.valid=false;
  car.offset=sign*maxDist;
 }
 // Four ordered sectors (including finish line) reject backwards and shortcut laps.
 const checkpoints=getCheckpoints();
 const prev=car.prevS??START_S;
 let advance=car.travel-prev;
 if(advance<-LENGTH*.5)advance+=LENGTH;
 if(advance>LENGTH*.5)advance-=LENGTH;
 if(advance>0&&advance<10){
  if(car.gate<3&&prev<=checkpoints[car.gate]&&car.travel>=checkpoints[car.gate]) car.gate++;
  if(prev>LENGTH-6&&car.travel<6){
   if(car.gate===3&&car.lapTime>12){car.completed++;car.lastLap=car.lapTime;if(!car.valid)car.invalidLaps++; if(car.valid)car.best=car.best===null?car.lapTime:Math.min(car.best,car.lapTime); car.lap++;}
   car.lapTime=0;car.gate=0;car.valid=true;
  }
 }
 car.prevS=car.travel;
 car.elapsed+=dt;car.lapTime+=dt;car.kmh=Math.round(Math.abs(car.speed)*3.6);
 car.wheel+=car.speed*dt/0.42;
 car.slide+=(Math.abs(car.steer)*Math.abs(car.speed)*(input.handbrake?.01:.001)-car.slide)*Math.min(1,dt*7);
 car.hitCooldown=Math.max(0,car.hitCooldown-dt);
 return car;
}
export function formatTime(t){if(!Number.isFinite(t))return '--:--.---';const m=Math.floor(t/60);const s=t-m*60;return String(m).padStart(2,'0')+':'+s.toFixed(3).padStart(6,'0');}
