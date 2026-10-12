/** Deterministic district junction priority signals; no wall clock dependency. */
import {CITY} from './city.js';
const PERIOD=22;
export const SIGNALS=Object.freeze(CITY.streets.slice(0,6).map((road,id)=>({id,x:road[Math.floor(road.length/2)][0],z:road[Math.floor(road.length/2)][1],offset:id*5.5})));
export function signalState(signal,elapsed){const t=((elapsed+signal.offset)%PERIOD+PERIOD)%PERIOD;return t<10?'green':t<13?'amber':'red';}
export function mustYieldSignal(vehicle,elapsed){if(!vehicle||vehicle.parked)return false;if(!vehicle.route)return false;
 return SIGNALS.some(s=>{if(signalState(s,elapsed)==='green')return false;const dx=s.x-vehicle.x,dz=s.z-vehicle.z,dist=Math.hypot(dx,dz);if(dist>15||dist<3)return false;return Math.sin(vehicle.yaw)*dx+Math.cos(vehicle.yaw)*dz>1;});}
