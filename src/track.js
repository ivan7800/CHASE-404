/** Deterministic closed circuits. Distances in metres, +Z forward at the first starting straight.
 * Track selection refreshes the arc-length lookup and projection samples without page reload.
 */
export const RADIUS=82;
export const STRAIGHT_HALF=100;
export const ROAD_HALF=11;
export const SHOULDER=3.5;
export const START_S=38;
export const TRACKS=Object.freeze([
 {id:'sunset',name:'SUNSET SPEEDWAY',subtitle:'Óvalo · velocidad pura',region:'Stadium',difficulty:'FÁCIL',color:'#f9b95a',sky:[.64,.75,.78]},
 {id:'pacific',name:'PACIFIC COAST',subtitle:'Costa · curvas fluidas',region:'Coastal',difficulty:'MEDIA',color:'#49e0c1',sky:[.47,.77,.83]},
 {id:'ridge',name:'MIDNIGHT RIDGE',subtitle:'Montaña · trazada técnica',region:'Highlands',difficulty:'DIFÍCIL',color:'#b69bff',sky:[.34,.41,.62]}
]);
export let LENGTH=4*STRAIGHT_HALF+2*Math.PI*RADIUS;
let current='sunset';
let arcTable=[];
let checkpoints=[];
let points=[];
const TAU=Math.PI*2;
const wrapTheta=t=>((t%TAU)+TAU)%TAU;
const clampTrack=(x,a,b)=>Math.max(a,Math.min(b,x));
export function getTrack(){return TRACKS.find(t=>t.id===current);}
export function wrap(s){return ((s%LENGTH)+LENGTH)%LENGTH;}
function oval(s){
 s=wrap(s);const straight=2*STRAIGHT_HALF,arc=Math.PI*RADIUS;
 if(s<straight)return {x:RADIUS,z:-STRAIGHT_HALF+s,tx:0,tz:1,nx:1,nz:0};
 s-=straight;
 if(s<arc){const a=s/RADIUS;return {x:RADIUS*Math.cos(a),z:STRAIGHT_HALF+RADIUS*Math.sin(a),tx:-Math.sin(a),tz:Math.cos(a),nx:Math.cos(a),nz:Math.sin(a)};}
 s-=arc;
 if(s<straight)return {x:-RADIUS,z:STRAIGHT_HALF-s,tx:0,tz:-1,nx:-1,nz:0};
 s-=straight;const a=Math.PI+s/RADIUS;
 return {x:RADIUS*Math.cos(a),z:-STRAIGHT_HALF+RADIUS*Math.sin(a),tx:-Math.sin(a),tz:Math.cos(a),nx:Math.cos(a),nz:Math.sin(a)};
}
/** Smooth analytic roads: different shapes, not swapped scenery over identical asphalt. */
function curve(theta){
 const t=wrapTheta(theta);
 if(current==='pacific')return {x:156*Math.cos(t)+26*Math.cos(2*t)-12*Math.sin(3*t),z:184*Math.sin(t)+22*Math.sin(2*t)+11*Math.cos(3*t)};
 return {x:164*Math.cos(t)+27*Math.cos(3*t)-10*Math.sin(2*t),z:169*Math.sin(t)-23*Math.sin(3*t)+12*Math.cos(2*t)};
}
function curvedSample(s){
 const distance=wrap(s),N=arcTable.length-1;
 let lo=0,hi=N;
 while(lo<hi){const mid=(lo+hi)>>1;if(arcTable[mid].s<distance)lo=mid+1;else hi=mid;}
 const b=clampTrack(lo,1,N),a=b-1,left=arcTable[a],right=arcTable[b];
 const t=left.t+(right.t-left.t)*(distance-left.s)/Math.max(.00001,right.s-left.s);
 const p=curve(t),d=.00005,f=curve(t+d),back=curve(t-d);
 const nxD=f.x-back.x,nzD=f.z-back.z,len=Math.hypot(nxD,nzD);
 const tx=nxD/len,tz=nzD/len;
 return {x:p.x,z:p.z,tx,tz,nx:tz,nz:-tx};
}
export function sample(s){return current==='sunset'?oval(s):curvedSample(s);}
export function localPosition(s,offset=0){const p=sample(s);return {x:p.x+p.nx*offset,z:p.z+p.nz*offset};}
function rebuild(){
 if(current==='sunset')LENGTH=4*STRAIGHT_HALF+2*Math.PI*RADIUS;
 else{
  arcTable=[{s:0,t:0}];let total=0,prior=curve(0);
  const res=4096;
  for(let i=1;i<=res;i++){const t=TAU*i/res,p=curve(t);total+=Math.hypot(p.x-prior.x,p.z-prior.z);arcTable.push({s:total,t});prior=p;}
  LENGTH=total;
 }
 points=Array.from({length:2048},(_,i)=>({s:LENGTH*i/2048,...sample(LENGTH*i/2048)}));
 checkpoints=[LENGTH*.25,LENGTH*.5,LENGTH*.75];
}
export function selectTrack(id){if(!TRACKS.some(t=>t.id===id))throw RangeError('Circuito desconocido: '+id);current=id;rebuild();return getTrack();}
export function getCheckpoints(){return checkpoints;}
/** Projection onto the nearest polyline segment, with bounded signed lateral distance. */
export function project(x,z,hint=null){
 let best=Infinity,result=null;
 const count=points.length;
 const inspect=i=>{
  i=(i+count)%count;
  const a=points[i],b=points[(i+1)%count],dx=b.x-a.x,dz=b.z-a.z;
  const t=clampTrack(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz),0,1);
  const px=a.x+t*dx,pz=a.z+t*dz,d2=(x-px)**2+(z-pz)**2;
  if(d2<best){best=d2;const s=wrap(a.s+t*LENGTH/count),ref=sample(s);result={s,distance:Math.sqrt(d2),offset:(x-px)*ref.nx+(z-pz)*ref.nz,px,pz,ref,index:i};}
 };
 // A car moves less than two metres between fixed steps. Searching neighbouring
 // segments avoids 2048 full projections per step, improving input latency.
 if(Number.isInteger(hint)&&hint>=0&&hint<count){
  for(let d=-14;d<=14;d++)inspect(hint+d);
  if(best<12*12)return result;
  best=Infinity;result=null;
 }
 for(let i=0;i<count;i++)inspect(i);
 return result;
}
export function startPose(){const p=sample(START_S);return {x:p.x,z:p.z,yaw:Math.atan2(p.tx,p.tz)};}
rebuild();
