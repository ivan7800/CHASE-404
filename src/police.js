/** CHASE 404 — first pursuit prototype, deterministic, no external dependencies.
 * Patrol activates after sustained speeding. Contact causes capture only at low speed.
 */
import {nearestStreet} from './city.js';
import {roadPath} from './road-network.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export function createPolice(){return {active:false,heat:0,calm:0,arrest:0,escaped:false,captured:false,
  agent:{index:5,x:0,z:0,yaw:0,wheel:0,speed:0},route:[],routeTimer:0};}
export function stepPolice(state,dt,player){
 if(!Number.isFinite(dt)||dt<=0||!player)return state;
 const step=Math.min(dt,.1),kmh=Math.max(0,Number(player.kmh)||0);
 if(!state.active){
  state.heat=clamp(state.heat+(kmh>85?step:-step*.8),0,8);
  if(state.heat>=3){const road=nearestStreet(player.x,player.z);state.active=true;state.escaped=false;state.captured=false;state.arrest=0;state.calm=0;
   const a=state.agent;a.x=road.x-road.tx*35;a.z=road.z-road.tz*35;a.yaw=Math.atan2(road.tx,road.tz);a.speed=0;state.route=[];state.routeTimer=0;}
  return state;
 }
 const a=state.agent,dx=player.x-a.x,dz=player.z-a.z,dist=Math.hypot(dx,dz);
 state.routeTimer-=step;
 if(state.routeTimer<=0||!state.route.length){state.route=roadPath(a.x,a.z,player.x,player.z);state.routeTimer=0.8;}
 // Follow successive road waypoints instead of steering through buildings.
 while(state.route.length>1&&Math.hypot(state.route[0].x-a.x,state.route[0].z-a.z)<8)state.route.shift();
 const goal=state.route[0]||nearestStreet(player.x,player.z);
 const desired=Math.atan2(goal.x-a.x,goal.z-a.z);
 a.yaw+=clamp(wrap(desired-a.yaw),-step*2.9,step*2.9);
 const targetSpeed=dist>7?Math.min(24,Math.max(8,dist*.28)):0;
 a.speed+=clamp(targetSpeed-a.speed,-step*15,step*12);
 const nx=a.x+Math.sin(a.yaw)*a.speed*step,nz=a.z+Math.cos(a.yaw)*a.speed*step;
 const road=nearestStreet(nx,nz);
 if(road.distance>9){a.x=road.x;a.z=road.z;a.speed=Math.min(a.speed,9);}else{a.x=nx;a.z=nz;}
 a.wheel+=a.speed*step*.3;
 state.arrest=dist<7&&kmh<12?state.arrest+step:Math.max(0,state.arrest-step*2);
 if(state.arrest>2.7){state.captured=true;state.active=false;state.heat=0;}
 state.calm=dist>170&&kmh<55?state.calm+step:Math.max(0,state.calm-step);
 if(state.calm>8){state.escaped=true;state.active=false;state.heat=0;}
 return state;
}
