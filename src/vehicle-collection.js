/** CHASE 404 · Fase 5.3 · Garaje del Carmel. Separate, validated local collection. */
import {CARS} from './garage.js';
import {CITY} from './city.js';
export const COLLECTION_KEY='chase404.collection.v1';
export const CARMEL_GARAGE=Object.freeze({x:-22,z:168,radius:22,title:'GARAJE VERENNE'});
export const GARAGE_CAPACITY=CARS.length;
const knownId=id=>CARS.some(c=>c.id===id);
const damage=v=>Number.isFinite(v)?Math.max(0,Math.min(100,Math.round(v*10)/10)):0;
export function cleanCollection(value){
 let data=value;try{if(typeof data==='string')data=JSON.parse(data);}catch{return {version:1,vehicles:[]};}
 const out={version:1,vehicles:[]};
 if(!data||typeof data!=='object'||Array.isArray(data)||data.version!==1||!Array.isArray(data.vehicles))return out;
 for(const row of data.vehicles){
  if(!row||typeof row!=='object'||Array.isArray(row)||!knownId(row.id)||out.vehicles.some(v=>v.id===row.id))continue;
  out.vehicles.push({id:row.id,damage:damage(row.damage)});
  if(out.vehicles.length===GARAGE_CAPACITY)break;
 }
 return out;
}
export function garageAvailable({urban,onFoot,x,z,speed,policeActive}){
 return Boolean(urban)&&!onFoot&&!policeActive&&Number.isFinite(x)&&Number.isFinite(z)&&Number.isFinite(speed)&&Math.abs(speed)<=.8&&Math.abs(x)<CITY.bounds&&Math.abs(z)<CITY.bounds&&Math.hypot(x-CARMEL_GARAGE.x,z-CARMEL_GARAGE.z)<=CARMEL_GARAGE.radius;
}
export function parkVehicle(state,vehicle){
 const current=cleanCollection(state),id=vehicle?.vehicleId;
 if(!knownId(id)||!vehicle?.urban)return {ok:false,reason:'Coche no válido para el garaje'};
 const existing=current.vehicles.findIndex(v=>v.id===id);
 if(existing<0&&current.vehicles.length>=GARAGE_CAPACITY)return {ok:false,reason:'Garaje completo'};
 const stored={id,damage:damage(vehicle.damage)};
 if(existing>=0)current.vehicles[existing]=stored;else current.vehicles.push(stored);
 return {ok:true,next:current,vehicle:stored,updated:existing>=0};
}
export function takeVehicle(state,id){
 const current=cleanCollection(state),stored=current.vehicles.find(v=>v.id===id);
 if(!stored)return {ok:false,reason:'Vehículo no guardado'};
 return {ok:true,vehicle:{...stored}};
}
/** Atomic swap proposal: the driven model returns to the garage with its latest damage.
 * The requested parked model is restored from its saved state; persisted before use.
 */
export function swapParkedVehicle(state,currentVehicle,targetId){
 const parked=takeVehicle(state,targetId);
 if(!parked.ok)return parked;
 if(!knownId(currentVehicle?.vehicleId)||!currentVehicle?.urban)return {ok:false,reason:'Vehículo actual inválido'};
 if(currentVehicle.vehicleId===targetId)return {ok:false,reason:'Este vehículo ya está en uso'};
 const storedCurrent=parkVehicle(state,currentVehicle);
 if(!storedCurrent.ok)return storedCurrent;
 return {ok:true,next:storedCurrent.next,vehicle:parked.vehicle};
}
export function readCollection(storage){try{return cleanCollection(storage.getItem(COLLECTION_KEY));}catch{return cleanCollection(null);}}
export function saveCollection(storage,state){try{storage.setItem(COLLECTION_KEY,JSON.stringify(cleanCollection(state)));return true;}catch{return false;}}
