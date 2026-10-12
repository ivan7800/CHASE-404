/** Mission 07: deterministic target vehicle, route entirely on the industrial roads. */
import {sampleTrafficRoute} from './traffic.js';
const POINTS=[[-785,-555],[-785,-450],[-785,-340],[-875,-340]];
const segments=[];let length=0;
for(let i=1;i<POINTS.length;i++){
 const [ax,az]=POINTS[i-1], [bx,bz]=POINTS[i];const segmentLength=Math.hypot(bx-ax,bz-az);
 segments.push({ax,az,bx,bz,start:length,length:segmentLength});length+=segmentLength;
}
export const SUSPECT_ROUTE=Object.freeze({segments,length});
export function createSuspect(){return {index:99,vehicleId:'falcon',route:SUSPECT_ROUTE,distance:0,speed:9,currentSpeed:9,braking:false,wheel:0,active:false,...sampleTrafficRoute(SUSPECT_ROUTE,0)};}
export function stepSuspect(s,dt){if(!s.active||!Number.isFinite(dt)||dt<=0)return s;s.distance+=s.speed*Math.min(dt,.1);s.wheel+=s.speed*Math.min(dt,.1)*.3;Object.assign(s,sampleTrafficRoute(s.route,s.distance));return s;}
