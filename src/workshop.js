/** CHASE 404 · Taller del Carmel. Pure economy and vehicle upgrade calculations. */
import {CARS,getCar} from './garage.js';

export const WORKSHOP=Object.freeze({x:106,z:132,radius:23,title:'TALLER DEL CARMEL'});
export const UPGRADE_TYPES=Object.freeze([
 Object.freeze({id:'engine',name:'POTENCIA',field:'power',step:.065,prices:Object.freeze([125,250])}),
 Object.freeze({id:'steering',name:'DIRECCIÓN',field:'steer',step:.055,prices:Object.freeze([125,250])}),
 Object.freeze({id:'brakes',name:'FRENOS',field:'brakes',step:.08,prices:Object.freeze([125,250])})
]);
const validLevel=v=>Number.isInteger(v)&&v>=0&&v<=2?v:0;
const validId=id=>CARS.some(car=>car.id===id);
export function cleanWorkshop(raw){
 const result={};
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return result;
 for(const [id,levels] of Object.entries(raw)){
  if(!validId(id)||!levels||typeof levels!=='object'||Array.isArray(levels))continue;
  const state={engine:validLevel(levels.engine),steering:validLevel(levels.steering),brakes:validLevel(levels.brakes)};
  if(Object.values(state).some(Boolean))result[id]=state;
 }
 return result;
}
export function upgradeLevels(stats,carId){const levels=cleanWorkshop(stats?.workshop)?.[carId];return levels||{engine:0,steering:0,brakes:0};}
export function tuneWithUpgrades(carId,stats){const base=getCar(carId).tune,lvl=upgradeLevels(stats,carId);return {...base,...Object.fromEntries(UPGRADE_TYPES.map(t=>[t.field,base[t.field]*(1+t.step*lvl[t.id])]))};}
export function repairPrice(car){if(!car?.urban||!Number.isFinite(car.damage)||car.damage<=0)return 0;return Math.max(20,Math.ceil(Math.min(100,car.damage)*1.7));}
export function canUseWorkshop({urban,onFoot,x,z,speed,policeActive,vehicleX,vehicleZ}){
 return Boolean(urban)&&Number.isFinite(x)&&Number.isFinite(z)&&Math.hypot(x-WORKSHOP.x,z-WORKSHOP.z)<=WORKSHOP.radius&&(onFoot?(Number.isFinite(vehicleX)&&Number.isFinite(vehicleZ)&&Math.hypot(vehicleX-WORKSHOP.x,vehicleZ-WORKSHOP.z)<=30):Math.abs(speed||0)<=.8)&&!policeActive;
}
function validStats(stats){return Number.isSafeInteger(stats?.credits)&&stats.credits>=0&&stats.credits<=10000000;}
export function purchaseRepair(stats,car){
 if(!validStats(stats))return {ok:false,reason:'Saldo inválido'};
 const cost=repairPrice(car);
 if(!cost)return {ok:false,reason:'El vehículo no necesita reparación'};
 if(stats.credits<cost)return {ok:false,reason:'Pesetas insuficientes'};
 return {ok:true,cost,next:{...stats,credits:stats.credits-cost},damage:0};
}
export function purchaseUpgrade(stats,carId,kind){
 if(!validStats(stats)||!validId(carId))return {ok:false,reason:'Datos de vehículo o saldo inválidos'};
 const type=UPGRADE_TYPES.find(t=>t.id===kind);
 if(!type)return {ok:false,reason:'Mejora desconocida'};
 const workshop=cleanWorkshop(stats.workshop),levels=upgradeLevels(stats,carId),level=levels[kind];
 if(level>=2)return {ok:false,reason:'Mejora al máximo'};
 const cost=type.prices[level];
 if(stats.credits<cost)return {ok:false,reason:'Pesetas insuficientes'};
 workshop[carId]={...levels,[kind]:level+1};
 return {ok:true,cost,next:{...stats,credits:stats.credits-cost,workshop},level:level+1};
}
