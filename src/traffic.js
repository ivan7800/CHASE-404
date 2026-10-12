/** CHASE 404 — deterministic ambient traffic on El Carmel street polylines.
 * Prototype Fase 3: circulation only; collision avoidance and police are separate gates.
 */
import {CITY} from './city.js';
import {CARS} from './garage.js';
import {mustYieldSignal} from './signals.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function makeRoute(index){
 const points=CITY.streets[index % CITY.streets.length];
 const segments=[];let length=0;
 for(let i=1;i<points.length;i++){
  const [ax,az]=points[i-1], [bx,bz]=points[i];
  const d=Math.hypot(bx-ax,bz-az);
  if(d>0){segments.push({ax,az,bx,bz,start:length,length:d});length+=d;}
 }
 return {segments,length};
}
export function sampleTrafficRoute(route,distance){
 if(!route.segments.length)return {x:0,z:0,yaw:0};
 const cycle=route.length*2;
 const t=((distance%cycle)+cycle)%cycle;
 const backwards=t>route.length;
 const d=backwards?cycle-t:t;
 const segment=route.segments.find(s=>d<=s.start+s.length)||route.segments.at(-1);
 const fraction=clamp((d-segment.start)/segment.length,0,1);
 const x=segment.ax+(segment.bx-segment.ax)*fraction;
 const z=segment.az+(segment.bz-segment.az)*fraction;
 const yaw=Math.atan2((backwards?-1:1)*(segment.bx-segment.ax),(backwards?-1:1)*(segment.bz-segment.az));
 return {x,z,yaw};
}
export function createTraffic(count=7){
 return Array.from({length:Math.max(0,Math.min(12,Math.floor(count)))},(_,index)=>{
  const route=makeRoute((index*3+1)%CITY.streets.length);
  return {index,vehicleId:CARS[(index+1)%CARS.length].id,route,distance:(index*.173*route.length)%Math.max(1,route.length*2),speed:8+(index%4)*1.4,currentSpeed:0,braking:false,wheel:0,...sampleTrafficRoute(route,index*.173*route.length)};
 });
}
export function stepTraffic(vehicles,dt,player,elapsed=0){
 if(!Number.isFinite(dt)||dt<=0)return vehicles;
 const delta=Math.min(dt,.1);
 // Evaluate the previous snapshot for stable, order-independent decisions.
 const snapshot=vehicles.map((v,i)=>({x:v.x,z:v.z,index:i}));
 for(const [i,v] of vehicles.entries()){
  if(v.parked){v.currentSpeed=0;v.braking=true;continue;}
  const look=sampleTrafficRoute(v.route,v.distance+Math.max(7,v.speed*1.1));
  const nearPlayer=player&&(Math.hypot(look.x-player.x,look.z-player.z)<10||Math.hypot(v.x-player.x,v.z-player.z)<9);
  const nearCar=snapshot.some(other=>other.index!==i&&Math.hypot(look.x-other.x,look.z-other.z)<9);
  // At route ends, odd-index vehicles yield momentarily to opposing flows.
  const routeDistance=((v.distance%(v.route.length*2))+(v.route.length*2))%(v.route.length*2);
  const atJunction=Math.min(routeDistance,Math.abs(routeDistance-v.route.length),v.route.length*2-routeDistance)<5;
  const yielding=atJunction&&v.index%3===1;
  v.braking=Boolean(nearPlayer||nearCar||yielding||mustYieldSignal(v,elapsed));
  const target=v.braking?0:v.speed;
  v.currentSpeed=nearPlayer?0:clamp(v.currentSpeed+clamp(target-v.currentSpeed,-delta*24,delta*12),0,v.speed);
  v.distance+=v.currentSpeed*delta;v.wheel+=v.currentSpeed*delta*.3;
  Object.assign(v,sampleTrafficRoute(v.route,v.distance));
 }
 return vehicles;
}
