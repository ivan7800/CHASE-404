/** Bounded deterministic skid-dust particle pool for the native WebGL renderer. */
import {Builder} from './geometry.js';
import {cityElevation} from './city.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function makeDustMesh(){
 const b=new Builder();const white=[218,212,191],tan=[176,154,124];
 // Low-poly octahedron: visible from all camera angles, no transparent sorting.
 for(const [ax,az] of [[1,0],[0,1],[-1,0],[0,-1]]){
  const i=[[ax*.55,0,az*.55],[az*.55,0,-ax*.55]];
  b.tri([0,.68,0],i[0],i[1],white);b.tri([0,-.27,0],i[1],i[0],tan);
 }
 return b.finish();
}
export class DrivingEffects{
 constructor(max=20){this.max=max;this.items=[];this.elapsed=0;this.sequence=0;this.enabled=true;}
 clear(){this.items.length=0;this.elapsed=0;}
 setEnabled(v){this.enabled=Boolean(v);if(!v)this.clear();}
 update(car,dt,handbrake=false){
  if(!this.enabled)return;
  for(const p of this.items){p.life-=dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=p.vy*dt;}
  this.items=this.items.filter(p=>p.life>0);
  const intensity=clamp((Math.abs(car.speed)-10)/38,0,1);
  const drifting=handbrake||Math.abs(car.slide)>1.0||Boolean(car.offroad);
  if(!drifting||intensity<=0)return;
  this.elapsed+=dt;if(this.elapsed<.065)return;this.elapsed=0;
  for(const side of [-1,1]){
   const fx=Math.sin(car.yaw),fz=Math.cos(car.yaw),sx=Math.cos(car.yaw),sz=-Math.sin(car.yaw);
   const variance=Math.sin(this.sequence++*2.39);
   const life=.38+intensity*.29;
   const x=car.x-fx*2.4+sx*side*1.55,z=car.z-fz*2.4+sz*side*1.55;
   const p={x,y:car.urban?cityElevation(x,z)+.56:.56,z,
    vx:(side*sx-fx*1.6)*(.8+variance*.28),vy:1.05+variance*.3,vz:(side*sz-fz*1.6)*(.8+variance*.28),life,total:life,scale:.45+intensity*.45};
   if(this.items.length>=this.max)this.items.shift();this.items.push(p);
  }
 }
}
