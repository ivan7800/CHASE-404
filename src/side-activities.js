import {cleanContacts} from './contacts.js';
import {cleanWorkshop} from './workshop.js';
import {cleanDiscoveries} from './discoveries.js';
/** CHASE 404 · Encargos urbanos v2. Repetibles, sin backend y separados de la campaña. */
export const SIDE_KEY='chase404.side.v1'; // Clave estable para conservar saldo y mejoras v0.8.x.
const point=(x,z,name)=>Object.freeze({x,z,name});
export const DELIVERY=Object.freeze({id:'delivery-01',title:'EL RECADO DEL TALLER',type:'delivery',limit:210,reward:125,points:Object.freeze([
 point(106,132,'TALLER DEL CARMEL'),point(-250,48,'ENLACE DEL GUINARDÓ'),point(-535,115,'DESTINO DE GRÀCIA')])});
export const SPRINT=Object.freeze({id:'sprint-01',title:'LA RONDA DE LOS MIRADORES',type:'sprint',limit:310,reward:180,points:Object.freeze([
 point(232,96,'SALIDA DEL CARMEL'),point(-150,375,'ALTO DEL GUINARDÓ'),point(-410,165,'CURVA DE GRÀCIA'),point(-700,115,'META DEL EIXAMPLE')])});
export const FRAGILE=Object.freeze({id:'fragile-01',title:'LA CINTA DE CRISTAL',type:'fragile',limit:410,reward:235,maxImpacts:1,points:Object.freeze([
 point(106,132,'RECOGIDA EN EL TALLER'),point(-535,-5,'CONTROL DEL EIXAMPLE'),point(-785,-340,'ENTREGA EN EL PUERTO')])});
export const SIDE_ACTIVITIES=Object.freeze([DELIVERY,SPRINT,FRAGILE]);
export function getSideActivity(id){return SIDE_ACTIVITIES.find(a=>a.id===id)||DELIVERY;}
const validBest=(v,limit)=>Number.isFinite(v)&&v>0&&v<=limit?v:null;
const validCount=v=>Number.isSafeInteger(v)&&v>=0&&v<=100000?v:0;
export function newSideRun(id=DELIVERY.id){const activity=getSideActivity(id);return {id:activity.id,phase:'ready',index:0,remaining:activity.limit,elapsed:0,impacts:0,baseDamageEvents:null,claimed:false};}
export function startSideRun(r,initialDamageEvents=null){if(r.phase!=='ready')return false;if(Number.isSafeInteger(initialDamageEvents)&&initialDamageEvents>=0)r.baseDamageEvents=initialDamageEvents;r.phase='active';return true;}
export function stepSideRun(r,pos,dt){
 if(r.phase!=='active')return r.phase;
 if(!Number.isFinite(dt)||dt<0||dt>.25)throw RangeError('dt inválido');
 const activity=getSideActivity(r.id);
 r.remaining=Math.max(0,r.remaining-dt);r.elapsed+=dt;
 if(r.remaining<=0){r.phase='lost';return 'lost';}
 if(activity.type==='fragile'){
  const events=Number.isSafeInteger(pos.damageEvents)&&pos.damageEvents>=0?pos.damageEvents:0;
  if(r.baseDamageEvents===null)r.baseDamageEvents=events;
  r.impacts=Math.max(r.impacts,Math.max(0,events-r.baseDamageEvents));
  if(r.impacts>activity.maxImpacts){r.phase='lost';return 'lost';}
 }
 const target=activity.points[r.index];
 if(target&&!pos.onFoot&&Math.hypot(pos.x-target.x,pos.z-target.z)<=17){
  r.index++;
  if(r.index===activity.points.length){r.phase='won';return 'won';}
  return 'checkpoint';
 }
 return 'active';
}
export function sideTarget(r){return r?.phase==='active'?getSideActivity(r.id).points[r.index]||null:null;}
export function cleanSideStats(raw){
 let v;try{v=typeof raw==='string'?JSON.parse(raw):raw;}catch{v=null;}
 const base={version:1,completed:0,best:null,credits:0};
 if(!v||typeof v!=='object'||Array.isArray(v)||v.version!==1)return base;
 const safe={...base,completed:validCount(v.completed),best:validBest(v.best,DELIVERY.limit),credits:Number.isSafeInteger(v.credits)&&v.credits>=0&&v.credits<=10000000?v.credits:0};
 const workshop=cleanWorkshop(v.workshop);if(Object.keys(workshop).length)safe.workshop=workshop;
 const discoveries=cleanDiscoveries(v.discoveries);if(discoveries.length)safe.discoveries=discoveries;
 const contacts=cleanContacts(v.contacts);if(Object.keys(contacts).length)safe.contacts=contacts;
 const records={};
 if(v.records&&typeof v.records==='object'&&!Array.isArray(v.records))for(const a of SIDE_ACTIVITIES){
  const candidate=v.records[a.id];
  if(candidate&&typeof candidate==='object'&&!Array.isArray(candidate)){
   const completed=validCount(candidate.completed),best=validBest(candidate.best,a.limit);
   if(completed||best!==null)records[a.id]={completed,best};
  }
 }
 // El histórico antiguo se consulta por sideRecord sin alterar su estructura original.
 if(Object.keys(records).length)safe.records=records;
 return safe;
}
export function sideRecord(stats,id){const activity=getSideActivity(id),record=stats?.records?.[activity.id];return record&&typeof record==='object'?{completed:validCount(record.completed),best:validBest(record.best,activity.limit)}:{completed:activity.id===DELIVERY.id&&!stats?.records?validCount(stats?.completed):0,best:activity.id===DELIVERY.id&&!stats?.records?validBest(stats?.best,DELIVERY.limit):null};}
export function awardSideRun(stats,run){
 if(run.phase!=='won'||run.claimed)return false;
 const activity=getSideActivity(run.id);
 if(!Number.isSafeInteger(stats?.credits)||stats.credits<0||stats.credits>10000000-activity.reward||!Number.isSafeInteger(stats.completed)||stats.completed>=100000)return false;
 const previous=sideRecord(stats,activity.id);
 const best=previous.best===null?run.elapsed:Math.min(previous.best,run.elapsed);
 stats.completed++;
 stats.credits+=activity.reward;
 const records={...(stats.records||{})};
 if(activity.id!==DELIVERY.id&&!stats.records&&stats.completed>1)records[DELIVERY.id]={completed:stats.completed-1,best:stats.best};
 stats.records={...records,[activity.id]:{completed:previous.completed+1,best}};
 if(activity.id===DELIVERY.id)stats.best=best;
 run.claimed=true;
 return true;
}
export function readSideStats(store){try{return cleanSideStats(store.getItem(SIDE_KEY));}catch{return cleanSideStats(null);}}
export function saveSideStats(store,stats){try{store.setItem(SIDE_KEY,JSON.stringify(stats));return true;}catch{return false;}}
