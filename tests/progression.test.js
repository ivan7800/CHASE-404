import test from 'node:test';
import assert from 'node:assert/strict';
import {MODES,THEMES,PROFILE_KEY,newProfile,parseProfile,readProfile,writeProfile,recordStart,awardFinish,bestTotal,beginCup,cupTrack,cupTable,completeCupRound,unlockedThemes,changeTheme} from '../src/progression.js';
import {makeRace,stepRace,standings} from '../src/race.js';
import {createCar} from '../src/physics.js';
import {selectTrack} from '../src/track.js';
const r=(id,mode='arcade',position=3,extra={})=>({id,mode,track:'sunset',car:'racer',position,time:120,validBest:true,...extra});
test('four modes: rules for opponents, finite goals and unlimited free run',()=>{
 assert.deepEqual(MODES.map(x=>x.id),['arcade','time','free','championship']);
 for(const m of MODES){const race=makeRace(m);const car=createCar();assert.equal(race.rivals.length,m.rivals);assert.equal(race.laps,m.laps);
   assert.equal(standings(race,car).length,m.rivals+1);}
 const free=makeRace(MODES[2]),car=createCar();car.completed=100;stepRace(free,car,1/120);assert.equal(free.finished,false);
 const time=makeRace(MODES[1]);car.completed=3;stepRace(time,car,1/120);assert.equal(time.finished,true);assert.equal(time.finalResults.length,1);
});
test('cup: sequential tracks and exact points, then a new cup is possible',()=>{
 const p=newProfile();beginCup(p,'viper');assert.equal(cupTrack(p),'sunset');
 const a=completeCupRound(p,1,150);assert.equal(a.points,10);assert.equal(a.next,'pacific');
 const b=completeCupRound(p,4,160);assert.equal(b.points,15);assert.equal(cupTrack(p),'ridge');
 const c=completeCupRound(p,2,170);assert.equal(c.points,23);assert.equal(c.next,null);assert.equal(p.cup,null);assert.equal(p.cups,1);assert.equal(p.xp,80);
 beginCup(p,'falcon');assert.equal(cupTrack(p),'sunset');assert.equal(cupTable(p.cup).points,0);
});
test('profile: no duplicate rewards; qualified time-attack; themed HUD rewards',()=>{
 const p=newProfile();recordStart(p);assert.equal(p.starts,1);
 const a=awardFinish(p,r('one','arcade',1));assert.equal(a.xp,100);assert.equal(p.wins,1);assert.equal(p.medals.sunset,'oro');assert.equal(p.xp,100);
 const duplicate=awardFinish(p,r('one','arcade',1));assert.equal(duplicate.duplicate,true);assert.equal(p.xp,100);assert.equal(p.finishes,1);
 assert.equal(changeTheme(p,'neon'),false);
 awardFinish(p,r('two','arcade',2));assert.ok(unlockedThemes(p).some(t=>t.id==='neon'));assert.equal(changeTheme(p,'neon'),true);
 const valid=awardFinish(p,r('three','time',1,{time:88,track:'ridge'}));assert.equal(valid.newBest,true);
 const bad=awardFinish(p,r('four','time',1,{time:70,track:'ridge',validBest:false}));assert.equal(bad.newBest,false);
 assert.equal(bestTotal(p,'time','ridge','racer'),88);
 for(let i=0;i<6;i++)awardFinish(p,r('extra-'+i,'arcade',1));
 assert.ok(unlockedThemes(p).some(t=>t.id==='gold'));assert.equal(changeTheme(p,'gold'),true);assert.equal(p.theme,'gold');
 assert.ok(THEMES.every(t=>t.xp>=0));
});
test('save/load: version, totals, medals, cup resume and invalid data tolerance',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 const p=newProfile();p.xp=175;p.theme='neon';p.medals.pacific='plata';beginCup(p,'blaze');completeCupRound(p,5,120);
 awardFinish(p,r('save-record','time',1,{track:'ridge',time:84}));
 assert.equal(writeProfile(storage,p),true);assert.ok(data.has(PROFILE_KEY));
 const saved=readProfile(storage);assert.equal(saved.cup.car,'blaze');assert.equal(cupTrack(saved),'pacific');
 assert.equal(saved.bestTotals['time.ridge.racer'],84);assert.equal(saved.theme,'neon');assert.equal(saved.medals.pacific,'plata');
 assert.equal(parseProfile('not JSON').version,5);assert.deepEqual(parseProfile('{"version":999}'),newProfile());
 assert.equal(writeProfile({setItem:()=>{throw Error('quota');}},p),false);
 assert.deepEqual(readProfile({getItem:()=>{throw Error('blocked');}}),newProfile());
});
test('untrusted save cannot promote locked themes or invalid cup results',()=>{
 const raw={...newProfile(),xp:0,theme:'gold',cup:{car:'falcon',results:[{position:1,points:999,time:1}]},bestTotals:{'../../':1,'arcade.sunset.racer':100, 'time.ridge.blaze':-4}};
 const parsed=parseProfile(raw);assert.equal(parsed.theme,'classic');assert.equal(parsed.cup,null);
 assert.equal(parsed.bestTotals['arcade.sunset.racer'],100);assert.equal(parsed.bestTotals['../../'],undefined);
});
test('race mode configuration rejects malformed opponents and laps',()=>{
 for(const c of [{laps:0,rivals:7},{laps:3,rivals:8},{laps:3,rivals:-1},{laps:NaN,rivals:0},{laps:Infinity,rivals:7.5}])assert.throws(()=>makeRace(c),RangeError);
 selectTrack('sunset');
});
