/** Physical footprints shared by driving, walking and spawn checks. */
import {CITY_BUILDING_COLLIDERS} from './city.js';

const CELL=64,EPS=.015,grid=new Map();
const key=(x,z)=>`${x},${z}`;
for(const box of CITY_BUILDING_COLLIDERS){
 for(let x=Math.floor(box.minX/CELL);x<=Math.floor(box.maxX/CELL);x++)
  for(let z=Math.floor(box.minZ/CELL);z<=Math.floor(box.maxZ/CELL);z++){
   const k=key(x,z);if(!grid.has(k))grid.set(k,[]);
   grid.get(k).push(box);
  }
}
function nearby(minX,minZ,maxX,maxZ){
 const result=new Set();
 for(let x=Math.floor(minX/CELL);x<=Math.floor(maxX/CELL);x++)
  for(let z=Math.floor(minZ/CELL);z<=Math.floor(maxZ/CELL);z++)
   for(const box of grid.get(key(x,z))||[])result.add(box);
 return result;
}
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function cityBuildingAt(x,z,radius=.4){
 if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(radius)||radius<0)return null;
 for(const box of nearby(x-radius,z-radius,x+radius,z+radius)){
  const nx=clamp(x,box.minX,box.maxX),nz=clamp(z,box.minZ,box.maxZ);
  if((x-nx)**2+(z-nz)**2<radius*radius)return box;
 }
 return null;
}

// A point moving against an expanded rectangle is a conservative swept circle.
// Sampling front, middle and rear gives the long car a capsule-sized footprint.
function sweep(px,pz,dx,dz,box,radius){
 const minX=box.minX-radius,maxX=box.maxX+radius;
 const minZ=box.minZ-radius,maxZ=box.maxZ+radius;
 if(px>minX&&px<maxX&&pz>minZ&&pz<maxZ){
  const faces=[
   {distance:px-minX,nx:-1,nz:0},{distance:maxX-px,nx:1,nz:0},
   {distance:pz-minZ,nx:0,nz:-1},{distance:maxZ-pz,nx:0,nz:1}
  ].sort((a,b)=>a.distance-b.distance);
  const outward=faces[0];
  return dx*outward.nx+dz*outward.nz<0?{t:0,...outward,box}:null;
 }
 let enter=0,leave=1,nx=0,nz=0;
 for(const [p,d,min,max,axis] of [[px,dx,minX,maxX,'x'],[pz,dz,minZ,maxZ,'z']]){
  if(Math.abs(d)<1e-10){if(p<=min||p>=max)return null;continue;}
  const a=(min-p)/d,b=(max-p)/d,near=Math.min(a,b),far=Math.max(a,b);
  if(near>=enter){enter=near;nx=axis==='x'?(d>0?-1:1):0;nz=axis==='z'?(d>0?-1:1):0;}
  leave=Math.min(leave,far);
  if(enter>leave)return null;
 }
 return enter>=0&&enter<=1&&leave>=0&&nx*dx+nz*dz<0?{t:enter,nx,nz,box}:null;
}

export function resolveCityBuildingMove(fromX,fromZ,toX,toZ,{radius=.4,along=[0],yaw=0}={}){
 if(![fromX,fromZ,toX,toZ,radius,yaw].every(Number.isFinite)||radius<0)return {x:fromX,z:fromZ,hit:null};
 const forwardX=Math.sin(yaw),forwardZ=Math.cos(yaw);
 const spread=Math.max(0,...along.map(Math.abs))+radius+EPS;
 const candidates=nearby(Math.min(fromX,toX)-spread,Math.min(fromZ,toZ)-spread,
  Math.max(fromX,toX)+spread,Math.max(fromZ,toZ)+spread);
 let x=fromX,z=fromZ,dx=toX-fromX,dz=toZ-fromZ,hit=null;
 // Let an already overlapping actor leave an old position. New movement still
 // cannot go further into its building, and spawns are checked separately.
 for(let pass=0;pass<3;pass++){
  let first=null;
  for(const box of candidates)for(const offset of along){
   const contact=sweep(x+forwardX*offset,z+forwardZ*offset,dx,dz,box,radius);
   if(contact&&(!first||contact.t<first.t))first=contact;
  }
  if(!first){x+=dx;z+=dz;break;}
  hit??={box:first.box,nx:first.nx,nz:first.nz};
  const t=Math.max(0,first.t-0.0001);
  x+=dx*t+first.nx*EPS;z+=dz*t+first.nz*EPS;
  dx*=1-t;dz*=1-t;
  const into=dx*first.nx+dz*first.nz;
  if(into<0){dx-=first.nx*into;dz-=first.nz*into;}
  if(Math.hypot(dx,dz)<1e-6)break;
 }
 return {x,z,hit};
}
