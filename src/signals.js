/** Deterministic district junction priority signals; no wall clock dependency. */
import {CITY,nearestStreet,streetProfile} from './city.js';
import {cityBuildingAt} from './urban-buildings.js';
const PERIOD=22;
export const SIGNALS=Object.freeze(CITY.streets.slice(0,6).map((road,id)=>({id,x:road[Math.floor(road.length/2)][0],z:road[Math.floor(road.length/2)][1],offset:id*5.5})));
// The trigger stays on the lane. Only the visible pole moves to the curb.
export const SIGNAL_POLES=Object.freeze(SIGNALS.map(signal=>{
 const road=CITY.streets[signal.id],index=Math.floor(road.length/2);
 const {roadHalf,sidewalkHalf}=streetProfile(signal.id);
 for(const [start,end] of [[road[index-1],road[index]],[road[index+1],road[index]]]){
  const dx=end[0]-start[0],dz=end[1]-start[1],length=Math.hypot(dx,dz);
  if(length<1)continue;
  const tx=dx/length,tz=dz/length;
  for(const setback of [5,8,11,15,20])for(const side of [1,-1]){
   if(setback>=length)continue;
   const offset=side*(roadHalf+sidewalkHalf)/2;
   const x=end[0]-tx*setback+tz*offset,z=end[1]-tz*setback-tx*offset;
   const nearest=nearestStreet(x,z);
   if(nearest.distance<nearest.roadHalf+.4||nearest.distance>nearest.sidewalkHalf||cityBuildingAt(x,z,.7))continue;
   return Object.freeze({x,z,yaw:Math.atan2(-tx,-tz)});
  }
 }
 return null;
}));
export function signalState(signal,elapsed){const t=((elapsed+signal.offset)%PERIOD+PERIOD)%PERIOD;return t<10?'green':t<13?'amber':'red';}
export function mustYieldSignal(vehicle,elapsed){if(!vehicle||vehicle.parked)return false;if(!vehicle.route)return false;
 return SIGNALS.some(s=>{if(signalState(s,elapsed)==='green')return false;const dx=s.x-vehicle.x,dz=s.z-vehicle.z,dist=Math.hypot(dx,dz);if(dist>15||dist<3)return false;return Math.sin(vehicle.yaw)*dx+Math.cos(vehicle.yaw)*dz>1;});}
