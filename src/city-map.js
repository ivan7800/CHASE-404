import {CITY} from './city.js';

const points=CITY.streets.flat();
const minX=Math.min(...points.map(p=>p[0]))-28,maxX=Math.max(...points.map(p=>p[0]))+28;
const minZ=Math.min(...points.map(p=>p[1]))-28,maxZ=Math.max(...points.map(p=>p[1]))+28;

export function cityMapView(width,height,actor,overview=false){
 const pad=15;
 const scale=overview
  ?Math.min((width-pad*2)/(maxX-minX),(height-pad*2)/(maxZ-minZ))
  :Math.min(width,height)/290;
 const cx=overview?(minX+maxX)/2:actor.x,cz=overview?(minZ+maxZ)/2:actor.z;
 return {
  scale,
  locate:([x,z])=>[width/2+(x-cx)*scale,height/2+(z-cz)*scale]
 };
}

// Intersect the ray from the map center with the inner frame.
export function cityMapTarget([x,y],width,height){
 const margin=13;
 if(x>=margin&&x<=width-margin&&y>=margin&&y<=height-margin)return {x,y,outside:false};
 const dx=x-width/2,dy=y-height/2;
 const t=Math.min((width/2-margin)/Math.abs(dx),(height/2-margin)/Math.abs(dy));
 return {x:width/2+dx*t,y:height/2+dy*t,outside:true,angle:Math.atan2(dy,dx)};
}
