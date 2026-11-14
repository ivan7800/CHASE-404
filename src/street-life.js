import { CITY, nearestStreet } from './city.js';
import { cityBuildingAt } from './urban-buildings.js';

export const STREET_JOBS = [
 {id:'radio',title:'UNA RADIO PARA EL TURÓ',start:{x:76,z:132},stops:[{x:132,z:96,name:'Recoge la radio en la calle Alta'},{x:-22,z:168,name:'Entrega la radio en el Turó'}],reward:75,limit:90},
 {id:'prints',title:'EL REVELADO DE GRÀCIA',start:{x:-410,z:80},stops:[{x:-480,z:165,name:'Recoge el carrete en la tienda'},{x:-335,z:210,name:'Lleva las fotos al quiosco'}],reward:110,limit:105,maxImpacts:0},
 {id:'shift',title:'EL CAMBIO DE TURNO',start:{x:-785,z:-340},stops:[{x:-785,z:-450,name:'Recoge al mecánico en el muelle'},{x:-875,z:-555,name:'Deja al mecánico en la otra dársena'}],reward:95,limit:null,maxSpeed:55}
];

export function nearbyStreetJob(pos) {
 return STREET_JOBS.find(job=>Math.hypot(pos.x-job.start.x,pos.z-job.start.z)<=17)||null;
}

export function stepStreetJob(run,pos,dt) {
 if(run.phase!=='active')return run.phase;
 run.elapsed+=dt;
 const {job}=run;
 const impactLimit=job.maxImpacts ?? Infinity;
 if(job.limit!==null&&run.elapsed>=job.limit){run.phase='lost';return 'Se acabó el tiempo.';}
 if(pos.damageEvents-run.impacts>impactLimit){run.phase='lost';return 'El golpe ha dañado el carrete.';}
 if(job.maxSpeed&&run.index>0&&pos.onFoot){run.phase='lost';return 'El pasajero ha dado por terminado el viaje.';}
 if(job.maxSpeed&&run.index>0&&pos.kmh>job.maxSpeed){
  run.speeding+=dt;
  if(run.speeding>=2){run.phase='lost';return 'El pasajero ha pedido terminar el viaje.';}
 }else run.speeding=Math.max(0,run.speeding-dt*2);
 const target=job.stops[run.index];
 if(pos.onFoot||Math.hypot(pos.x-target.x,pos.z-target.z)>16||(job.id==='shift'&&pos.kmh>8))return 'active';
 run.index++;
 return run.index>=job.stops.length?(run.phase='won'):'checkpoint';
}

export function startStreetJob(job,impacts) {
 return {job,impacts,index:0,elapsed:0,speeding:0,phase:'active'};
}

// Fixed sidewalk walks. Validate candidate pavements against the real geometry once at startup.
const walkLines=[[0,4],[0,6],[1,2],[4,2],[7,0],[11,2],[15,2],[18,0],[20,2],[25,1],[28,1],[30,1]];
const walks=walkLines.flatMap(([road,index],i)=>{
 const [a,b]=CITY.streets[road].slice(index,index+2);
 if(!b)return [];
 const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
 if(length<25)return [];
 const pavement=nearestStreet((a[0]+b[0])/2,(a[1]+b[1])/2).roadHalf+1.1;
 for(const side of [1,-1]){
  const x=a[0]+dx*.25+dz/length*pavement*side,z=a[1]+dz*.25-dx/length*pavement*side;
  const span=Math.min(length*.5,28);
  if(Array.from({length:13},(_,n)=>n/12).some(t=>{
   const px=x+dx/length*span*t,pz=z+dz/length*span*t,street=nearestStreet(px,pz);
   return street.distance<street.roadHalf+.35||cityBuildingAt(px,pz,.65);
  }))continue;
  return [{x,z,dx:dx/length,dz:dz/length,span,phase:i*11,variant:i%3}];
 }
 return [];
});

export function streetPedestrians(time,viewer) {
 return walks.flatMap(walk=>{
  if(Math.hypot(viewer.x-walk.x,viewer.z-walk.z)>145)return [];
  const cycle=(time*(1.15+walk.variant*.2)+walk.phase)%(walk.span*2);
  const outward=cycle<walk.span,distance=outward?cycle:walk.span*2-cycle;
  return [{id:'resident',x:walk.x+walk.dx*distance,z:walk.z+walk.dz*distance,
   yaw:Math.atan2(walk.dx,walk.dz)+(outward?0:Math.PI),variant:walk.variant}];
 });
}
