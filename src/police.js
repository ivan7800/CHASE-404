/** CHASE 404 — first pursuit prototype, deterministic, no external dependencies.
 * Patrol activates after sustained speeding. Contact causes capture only at low speed.
 */
import {CITY,nearestStreet} from './city.js';
import {resolveCityBuildingMove} from './urban-buildings.js';
import {roadPath} from './road-network.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export const PURSUIT_TRIGGER=3;
export const SEARCH_DURATION=6;
const PATROL_GAP=44;

function spawnAlongStreet(road,direction){
 const points=CITY.streets[road.street];
 let x=road.x,z=road.z,left=PATROL_GAP;
 let yaw=Math.atan2(-direction*road.tx,-direction*road.tz);
 for(let i=road.segment+(direction>0?1:0);i>=0&&i<points.length;i+=direction){
  const [px,pz]=points[i],dx=px-x,dz=pz-z,meters=Math.hypot(dx,dz);
  if(meters<1e-6)continue;
  yaw=Math.atan2(-dx,-dz);
  if(meters>=left)return {x:x+dx*left/meters,z:z+dz*left/meters,yaw};
  x=px;z=pz;left-=meters;
 }
 return {x,z,yaw};
}

export function createPolice(){return {active:false,heat:0,calm:0,arrest:0,escaped:false,captured:false,
  agent:{index:5,x:0,z:0,yaw:0,wheel:0,speed:0},route:[],routeTimer:0,lastSeen:null,searching:false,visible:false,cooldown:0};}
export function stepPolice(state,dt,player){
 if(!Number.isFinite(dt)||dt<=0||!player)return state;
 const step=Math.min(dt,.1),kmh=Math.max(0,Number(player.kmh)||0);
 if(!state.active){
  state.cooldown=Math.max(0,state.cooldown-step);
  if(state.cooldown>0)return state;
  state.heat=clamp(state.heat+(kmh>85?step:-step*.8),0,8);
  if(state.heat>=PURSUIT_TRIGGER){
   const road=nearestStreet(player.x,player.z);
   const backward=Number.isFinite(player.yaw)&&Math.sin(player.yaw)*road.tx+Math.cos(player.yaw)*road.tz<0?1:-1;
   let spawn=spawnAlongStreet(road,backward);
   const gap=pose=>Math.hypot(pose.x-player.x,pose.z-player.z);
   if(gap(spawn)<25)spawn=spawnAlongStreet(road,-backward);
   if(gap(spawn)<25)return state;
   Object.assign(state,{active:true,escaped:false,captured:false,arrest:0,calm:0,
    lastSeen:{x:road.x,z:road.z},searching:false,visible:false,route:[],routeTimer:0});
   Object.assign(state.agent,spawn,{speed:0});
  }
  return state;
 }
 const a=state.agent,dist=Math.hypot(player.x-a.x,player.z-a.z);
 // Check sight separately from route updates. Close contact must never arrest
 // through a facade, even during the interval between route recalculations.
 if(dist<8)state.visible=!resolveCityBuildingMove(a.x,a.z,player.x,player.z,{radius:.25}).hit;
 state.routeTimer-=step;
 if(state.routeTimer<=0){
  state.visible=dist<=110&&!resolveCityBuildingMove(a.x,a.z,player.x,player.z,{radius:.25}).hit;
  if(state.visible)state.lastSeen={x:player.x,z:player.z};
  state.searching=!state.visible;
  const target=state.lastSeen??a;
  state.route=roadPath(a.x,a.z,target.x,target.z);
  state.routeTimer=.35;
 }

 // Keep the upcoming junction in the route until the car is nearly on it.
 while(state.route.length>1&&Math.hypot(state.route[0].x-a.x,state.route[0].z-a.z)<4)state.route.shift();
 const goal=state.route[0]||(state.lastSeen?nearestStreet(state.lastSeen.x,state.lastSeen.z):a);
 const goalDistance=Math.hypot(goal.x-a.x,goal.z-a.z);
 const desired=Math.atan2(goal.x-a.x,goal.z-a.z);
 const headingError=wrap(desired-a.yaw);
 const following=state.route[1];
 const corner=following?Math.abs(wrap(Math.atan2(following.x-goal.x,following.z-goal.z)-desired)):0;
 const cornerLimit=corner>.55?8+goalDistance*.65:24;
 const turnLimit=24/(1+Math.abs(headingError)*1.8);
 const remainingContact=state.searching?Math.hypot((state.lastSeen??a).x-a.x,(state.lastSeen??a).z-a.z):dist;
 const approach=state.searching&&state.route.length<=1?goalDistance*1.3:Math.max(8,remainingContact*.28);
 const targetSpeed=(state.searching?goalDistance>.8:dist>7)?Math.min(24,cornerLimit,turnLimit,approach):0;
 a.yaw+=clamp(headingError,-step*2.8,step*2.8);
 a.speed+=clamp(targetSpeed-a.speed,-step*20,step*12);
 const nx=a.x+Math.sin(a.yaw)*a.speed*step,nz=a.z+Math.cos(a.yaw)*a.speed*step;
 const road=nearestStreet(nx,nz);
 const motion=resolveCityBuildingMove(a.x,a.z,road.distance>road.roadHalf?road.x:nx,road.distance>road.roadHalf?road.z:nz,{radius:1.35});
 a.x=motion.x;a.z=motion.z;
 if(motion.hit)a.speed=Math.min(a.speed,4);
 a.wheel+=a.speed*step*.3;
 state.arrest=state.visible&&dist<7&&kmh<12?state.arrest+step:Math.max(0,state.arrest-step*2);
 if(state.arrest>2.7){state.captured=true;state.active=false;state.heat=0;}
 state.calm=state.searching?state.calm+step:Math.max(0,state.calm-step*2);
 if(state.calm>=SEARCH_DURATION){state.escaped=true;state.active=false;state.heat=0;state.cooldown=10;}
 return state;
}
