/** Competitive arcade racing: deterministic AI, classification and car-to-car contact.
 * Distances are metres, time is seconds. No browser globals: unit-test friendly.
 */
import {LENGTH, ROAD_HALF, START_S, RADIUS, STRAIGHT_HALF, sample, localPosition, project, wrap, getTrack} from './track.js';

export const RACE_LAPS = 3;
const AI_CONFIG = [
  {id:'R01',name:'FALCON',color:[56,153,240],start:18,lane:-3.9,speed:61.4},
  {id:'R02',name:'COMET',color:[252,179,55],start:9,lane:3.9,speed:59.8},
  {id:'R03',name:'VIPER',color:[110,229,166],start:-12,lane:-3.9,speed:60.5},
  {id:'R04',name:'NOVA',color:[220,112,233],start:-22,lane:3.9,speed:58.1},
  {id:'R05',name:'BLAZE',color:[243,108,79],start:-34,lane:-3.9,speed:62.2},
  {id:'R06',name:'GHOST',color:[211,215,223],start:-45,lane:3.9,speed:57.3},
  {id:'R07',name:'TURBO',color:[92,224,224],start:-57,lane:0,speed:59.1}
];
const smooth=(a,b,t)=>a+(b-a)*Math.min(1,Math.max(0,t));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function makeRace(config=RACE_LAPS){
 const laps=typeof config==='number'?config:config.laps;
 const rivalsCount=typeof config==='number'?7:config.rivals;
 if(!(laps===Infinity||(Number.isInteger(laps)&&laps>0&&laps<=100))||!Number.isInteger(rivalsCount)||rivalsCount<0||rivalsCount>7)throw RangeError('Configuración de carrera inválida');
 const rivals=AI_CONFIG.slice(0,rivalsCount).map((cfg,i)=>{
  const totalS=START_S+cfg.start,offset=cfg.lane;
  const pos=localPosition(totalS,offset), tangent=sample(totalS);
  return {...cfg, index:i,totalS,offset,targetOffset:offset,x:pos.x,z:pos.z,
    yaw:Math.atan2(tangent.tx,tangent.tz),cruiseSpeed:cfg.speed,speed:0,kmh:0,wheel:0,
    finished:false,finishTime:null,lastContact:0, overtakes:0};
 });
 return {laps,elapsed:0,rivals,position:3,order:[],finished:false,playerFinish:null,
    collisions:0,lastCollision:false,finalResults:null};
}
/** Ranking is based on cumulative forward distance; crossed checkpoint gates are authoritative for player. */
export function playerProgress(car){return car.completed*LENGTH+car.travel;}
export function standings(race,player){
 const entrants=[{id:'YOU',name:'TÚ',progress:playerProgress(player),finishTime:race.playerFinish}];
 for(const rival of race.rivals)entrants.push({id:rival.id,name:rival.name,progress:Math.min(rival.totalS,race.laps*LENGTH),finishTime:rival.finishTime});
 entrants.sort((a,b)=>b.progress-a.progress || (a.finishTime??Infinity)-(b.finishTime??Infinity) || a.id.localeCompare(b.id));
 return entrants.map((entrant,i)=>({...entrant,position:i+1}));
}
function locateRival(r){
 const p=sample(r.totalS),pos=localPosition(r.totalS,r.offset);
 r.x=pos.x;r.z=pos.z;r.yaw=Math.atan2(p.tx,p.tz);
}
/** Lateral lane separation + finite speeds; rivals negotiate passing without teleporting. */
function driveAI(race,dt){
 const finish=race.laps*LENGTH;
 for(const r of race.rivals){
  const p=sample(r.totalS);
  // Straights are fastest, banked bends are slightly slower.
  const location=wrap(r.totalS),bendStart=2*STRAIGHT_HALF,bendLength=Math.PI*RADIUS;
  const onBend=getTrack().id==='sunset'?
   ((location>=bendStart&&location<bendStart+bendLength)||location>=bendStart*2+bendLength):
   Math.abs((sample(r.totalS+10).tx-p.tx)) + Math.abs((sample(r.totalS+10).tz-p.tz))>.055;
  const difficulty=getTrack().id==='ridge'?.84:getTrack().id==='pacific'?.93:1;
  const targetSpeed=r.cruiseSpeed*difficulty*(onBend?.91:1)+Math.sin(r.totalS/71+r.index*1.7)*1.3;
  const accel=targetSpeed>r.kmh/3.6?13.5:19;
  const nextSpeed=smooth(r.kmh/3.6,targetSpeed,dt*accel/Math.max(targetSpeed,1));
  r.kmh=nextSpeed*3.6;
  // Only pass cars ahead in the same lane, choose a clear neighbouring lane.
  let preferred=r.lane+Math.sin(r.totalS/105+r.index)*.55;
  const traffic=race.rivals.filter(o=>o!==r&&!o.finished&&o.totalS>r.totalS&&o.totalS-r.totalS<24&&Math.abs(o.offset-r.offset)<3.9).sort((a,b)=>a.totalS-b.totalS)[0];
  if(traffic){
   const choices=[-3.9,0,3.9].filter(lane=>Math.abs(lane-traffic.offset)>3.4);
   choices.sort((a,b)=>{
    const blockage=lane=>race.rivals.some(o=>o!==r&&Math.abs(o.totalS-r.totalS)<13&&Math.abs(o.offset-lane)<3)?40:0;
    return blockage(a)+Math.abs(a-r.offset)-blockage(b)-Math.abs(b-r.offset);
   });
   if(choices.length)preferred=choices[0];
   if(Math.abs(preferred-traffic.offset)<3.4)r.kmh=Math.min(r.kmh,traffic.kmh-5);
  }
  r.targetOffset=clamp(preferred,-ROAD_HALF+3.1,ROAD_HALF-3.1);
  r.offset=smooth(r.offset,r.targetOffset,dt*.57);
  const d=Math.max(0,r.kmh/3.6*dt);
  r.totalS+=d;r.wheel+=d/.42;
  locateRival(r);
  if(!r.finished&&r.totalS>=finish){r.finished=true;r.finishTime=race.elapsed+dt;}
 }
}
/** Contact in opponent local space uses realistic car footprint instead of a large sphere. */
export function collideWithRivals(car,rivals,dt){
 let hit=false;
 for(const r of rivals){
  const p=sample(r.totalS),dx=car.x-r.x,dz=car.z-r.z;
  let lateral=dx*p.nx+dz*p.nz,forward=dx*p.tx+dz*p.tz;
  const latBound=3.38,longBound=6.35;
  if(Math.abs(lateral)>=latBound||Math.abs(forward)>=longBound)continue;
  const sidePen=latBound-Math.abs(lateral),frontPen=longBound-Math.abs(forward);
  const sign=(n,fallback)=>Math.abs(n)>.0001?Math.sign(n):fallback;
  // Cap per-tick penetration correction to prevent physics explosions.
  if(sidePen/latBound<frontPen/longBound){
    const shift=Math.min(sidePen+.015,Math.max(.15,dt*80));
    const direction=sign(lateral,(r.index%2===0)?1:-1);
    car.x+=p.nx*shift*direction;car.z+=p.nz*shift*direction;
    car.vx=(car.vx??0)*.95;car.vz=(car.vz??0)*.95;
  }else{
    const shift=Math.min(frontPen+.015,Math.max(.15,dt*80));
    const direction=sign(forward,-1);
    car.x+=p.tx*shift*direction;car.z+=p.tz*shift*direction;
    car.speed*=direction<0?.975:.99;
    car.vx=(car.vx??0)*.96;car.vz=(car.vz??0)*.96;
  }
  car.speed*=.995;
  hit=true;
 }
 if(hit){
  const q=project(car.x,car.z);
  car.offset=q.offset;car.travel=q.s;
  car.hitCooldown=Math.max(car.hitCooldown,.45);
 }
 return hit;
}
/** Invoke AFTER the car physics step with the same fixed dt. */
export function stepRace(race,car,dt){
 if(race.finished)return {contact:false,finished:true};
 race.elapsed+=dt;
 driveAI(race,dt);
 const contact=collideWithRivals(car,race.rivals,dt);
 if(contact&&!race.lastCollision)race.collisions++;
 race.lastCollision=contact;
 // A lap is counted by physics only after all gates; invalid collisions don't grant a shortcut.
 if(Number.isFinite(race.laps)&&car.completed>=race.laps){
  race.finished=true;race.playerFinish=race.elapsed;
 }
 race.order=standings(race,car);
 race.position=race.order.find(e=>e.id==='YOU').position;
 if(race.finished)race.finalResults=race.order.map(e=>({...e}));
 return {contact,finished:race.finished,position:race.position};
}
export function positionDelta(race,player){
 const ranked=standings(race,player),i=ranked.findIndex(x=>x.id==='YOU');
 if(i<=0)return null;
 return Math.max(0,ranked[i-1].progress-playerProgress(player));
}

/** Draft boost is strongest 7-25 m behind a rival on a matching line. */
export function slipstream(race,car){
 if(!race||car.speed<15||car.offroad)return 0;
 const own=playerProgress(car);let best=0;
 for(const r of race.rivals){
  const ahead=r.totalS-own;
  if(r.finished||ahead<7||ahead>35)continue;
  const p=sample(r.totalS);
  const lateral=Math.abs((car.x-r.x)*p.nx+(car.z-r.z)*p.nz);
  if(lateral>4.2)continue;
  const distanceEffect=Math.min(1,(35-ahead)/12,(ahead-7)/7);
  best=Math.max(best,Math.max(0,distanceEffect)*(1-lateral/4.2));
 }
 return best;
}
