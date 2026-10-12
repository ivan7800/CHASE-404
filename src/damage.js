/** CHASE 404 - deterministic arcade vehicle condition (urban mode only). */
export const MAX_DAMAGE=100;
export function initDamage(car){car.damage=0;car.damageCooldown=0;car.damageEvents=0;return car;}
export function damageCondition(car){const d=Math.min(MAX_DAMAGE,Math.max(0,Number(car?.damage)||0));return {health:Math.round(100-d),engine:Math.max(.45,1-d*.0055),steering:Math.max(.68,1-d*.0032),brakes:Math.max(.62,1-d*.0038),disabled:d>=100};}
/** Every impact is finite and subject to a cooldown, preventing double counting. */
export function applyImpact(car,impact,kind='vehicle'){
 if(!car||!car.urban||!Number.isFinite(impact)||impact<=0||car.damageCooldown>0)return 0;
 const multiplier=kind==='barrier'?.65:1;
 const points=Math.min(35,Math.max(0,(impact-3)*.7*multiplier));
 if(points<.25)return 0;
 car.damage=Math.min(MAX_DAMAGE,(car.damage||0)+points);car.damageCooldown=kind==='barrier'?.85:.65;car.damageEvents=(car.damageEvents||0)+1;
 return points;
}
export function tickDamage(car,dt){if(car&&Number.isFinite(dt)&&dt>0)car.damageCooldown=Math.max(0,(car.damageCooldown||0)-dt);}
