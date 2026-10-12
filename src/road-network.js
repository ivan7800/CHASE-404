/** Road navigation graph for the fictional Carmel network. No external libraries. */
import {CITY,nearestStreet} from './city.js';
const key=(x,z)=>`${x.toFixed(2)},${z.toFixed(2)}`;
const nodes=[],ids=new Map();
function add(x,z){const k=key(x,z);if(ids.has(k))return ids.get(k);const id=nodes.length;ids.set(k,id);nodes.push({x,z,edges:[]});return id;}
function connect(a,b){if(a===b)return;const d=Math.hypot(nodes[a].x-nodes[b].x,nodes[a].z-nodes[b].z);if(!nodes[a].edges.some(e=>e.id===b))nodes[a].edges.push({id:b,cost:d});if(!nodes[b].edges.some(e=>e.id===a))nodes[b].edges.push({id:a,cost:d});}
for(const line of CITY.streets){for(let i=0;i<line.length;i++){const a=add(...line[i]);if(i)connect(a,add(...line[i-1]));}}
// Join closely spaced named street junctions without generating shortcuts through buildings.
for(let a=0;a<nodes.length;a++)for(let b=a+1;b<nodes.length;b++){
 const d=Math.hypot(nodes[a].x-nodes[b].x,nodes[a].z-nodes[b].z);
 if(d<=15)connect(a,b);
}
function nearestNode(x,z){let id=0,dist=Infinity;for(let i=0;i<nodes.length;i++){const d=Math.hypot(nodes[i].x-x,nodes[i].z-z);if(d<dist){dist=d;id=i;}}return id;}
export function roadPath(fromX,fromZ,toX,toZ){
 const start=nearestNode(fromX,fromZ),end=nearestNode(toX,toZ);
 const costs=Array(nodes.length).fill(Infinity),prev=Array(nodes.length).fill(-1),pending=new Set([start]);costs[start]=0;
 while(pending.size){let current=-1;for(const n of pending)if(current<0||costs[n]<costs[current])current=n;pending.delete(current);if(current===end)break;
  for(const edge of nodes[current].edges){const next=costs[current]+edge.cost;if(next<costs[edge.id]){costs[edge.id]=next;prev[edge.id]=current;pending.add(edge.id);}}
 }
 if(!Number.isFinite(costs[end]))return [];
 const path=[];for(let n=end;n!==-1;n=prev[n])path.push({x:nodes[n].x,z:nodes[n].z});path.reverse();
 const startRoad=nearestStreet(fromX,fromZ),endRoad=nearestStreet(toX,toZ);
 // Target projections are only included if close to graph; the car stays on road.
 if(Math.hypot(path[0].x-startRoad.x,path[0].z-startRoad.z)>2)path.unshift({x:startRoad.x,z:startRoad.z});
 if(Math.hypot(path.at(-1).x-endRoad.x,path.at(-1).z-endRoad.z)>2)path.push({x:endRoad.x,z:endRoad.z});
 return path;
}
export function roadDistance(x,z){return nearestStreet(x,z).distance;}
export function graphStats(){return {nodes:nodes.length,edges:nodes.reduce((s,n)=>s+n.edges.length,0)/2};}
