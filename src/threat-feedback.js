/** Fase 8.3 — bounded, deterministic feedback; no gameplay physics changed. */
import {PURSUIT_TRIGGER,SEARCH_DURATION} from './police.js';
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
export function pursuitThreat(states,player){
 const active=(states||[]).filter(s=>s?.active&&s.agent&&Number.isFinite(s.agent.x)&&Number.isFinite(s.agent.z));
 if(!active.length)return {level:'none',distance:Infinity,proximity:0,label:'SIN PERSECUCIÓN'};
 const x=Number(player?.x)||0,z=Number(player?.z)||0;
 const distance=Math.min(...active.map(s=>Math.hypot(s.agent.x-x,s.agent.z-z)));
 if(active.every(p=>p.searching)){
  const seconds=Math.max(1,Math.ceil(SEARCH_DURATION-Math.min(...active.map(p=>p.calm))));
  return {level:'approaching',distance,proximity:0,label:'BUSCÁNDOTE · FUERA DE VISTA '+seconds+' s'};
 }
 const proximity=clamp((120-distance)/110,0,1);
 return {level:distance<18?'critical':distance<55?'high':'approaching',distance,proximity,
  label:distance<18?'PATRULLA ENCIMA · EVITA DETENERTE':distance<55?'PATRULLA MUY CERCA':'PATRULLAS EN APROXIMACIÓN'};
}
export function damageFeedback(car){
 const damage=clamp(Number(car?.damage)||0,0,100),health=Math.round(100-damage);
 return {health,level:health<=25?'critical':health<=55?'high':health<=80?'worn':'good',
  label:health<=25?'MECÁNICA CRÍTICA · BUSCA UN TALLER':health<=55?'VEHÍCULO DAÑADO · CONDUCE CON CUIDADO':health<=80?'DAÑOS LEVES':'VEHÍCULO EN BUEN ESTADO'};
}

export function speedWarning(heat){
 if(!Number.isFinite(heat)||heat<.7)return null;
 const fill=clamp(heat/PURSUIT_TRIGGER,0,1);
 return {label:Math.ceil(fill*100)+'% · EXCESO DE VELOCIDAD',fill};
}
