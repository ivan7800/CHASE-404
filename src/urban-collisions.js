/** Bounded arcade contacts, isolated from race physics and from NPC pathing. */
export function stepUrbanContacts(player,vehicles,dt){
 if(!player||!Array.isArray(vehicles)||!Number.isFinite(dt)||dt<=0)return {contacts:0};
 player.urbanContactCooldown=Math.max(0,(player.urbanContactCooldown||0)-dt);
 if(player.urbanContactCooldown>0)return {contacts:0};
 let nearest=null,range=Infinity;
 for(const vehicle of vehicles){if(!vehicle||!Number.isFinite(vehicle.x)||!Number.isFinite(vehicle.z))continue;
  const d=Math.hypot(player.x-vehicle.x,player.z-vehicle.z);
  if(d<5.2&&d<range){nearest=vehicle;range=d;}
 }
 if(!nearest)return {contacts:0};
 const dx=player.x-nearest.x,dz=player.z-nearest.z,d=Math.max(.01,Math.hypot(dx,dz));
 const nx=d>.1?dx/d:Math.sin(player.yaw||0),nz=d>.1?dz/d:Math.cos(player.yaw||0);
 const push=Math.min(3.5,5.2-d);player.x+=nx*push;player.z+=nz*push;
 const impact=Math.abs(player.speed||0);
 player.speed*=impact>5?.52:.8;player.vx=(player.vx||0)*.45;player.vz=(player.vz||0)*.45;
 player.urbanContactCooldown=.65;player.wall=true;player.cityWallTime=Math.max(player.cityWallTime||0,.15);
 return {contacts:1,impact};
}
