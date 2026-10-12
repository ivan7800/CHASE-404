import test from 'node:test';
import assert from 'node:assert/strict';
import {DISCOVERIES,DISCOVERY_REWARD,DISCOVERY_COMPLETION_BONUS,cleanDiscoveries,nearestDiscovery,claimDiscovery,discoveryProgress} from '../src/discoveries.js';
import {cleanSideStats,readSideStats,saveSideStats} from '../src/side-activities.js';
import {nearestStreet,CITY,buildCity} from '../src/city.js';

const initial=()=>cleanSideStats({version:1,completed:3,best:105.5,credits:275,workshop:{falcon:{engine:1,steering:2,brakes:0}},records:{'delivery-01':{completed:3,best:105.5}}});
test('ocho hallazgos con identificadores, relato y regiones propios, accesibles desde una calle',()=>{
 assert.equal(DISCOVERIES.length,8);assert.equal(new Set(DISCOVERIES.map(x=>x.id)).size,8);
 assert.ok(new Set(DISCOVERIES.map(x=>x.district)).size>=6);
 for(const s of DISCOVERIES){assert.ok(s.title.length>7&&s.story.length>60&&s.clue.length>12);assert.equal(s.reward,45);
  const q=nearestStreet(s.x,s.z);assert.ok(q.distance<=14.5,`${s.id} a ${q.distance.toFixed(2)} m de calle`);}
 assert.ok(CITY.streets.length>25);assert.ok(buildCity().count>5000);
});
test('cobro único, estado persistente y bonificación por completar el archivo',()=>{
 let stats=initial();const original={...stats};let total=0;
 for(const [i,secret] of DISCOVERIES.entries()){
  const beforeCredits=stats.credits;const claim=claimDiscovery(stats,secret.id,secret,{onFoot:true});assert.equal(claim.ok,true);
  const prize=DISCOVERY_REWARD+(i===DISCOVERIES.length-1?DISCOVERY_COMPLETION_BONUS:0);
  assert.equal(claim.reward,prize);total+=prize;
  assert.equal(stats.credits,beforeCredits,'proposal must not mutate original');
  assert.equal(claimDiscovery(claim.next,secret.id,secret,{onFoot:true}).ok,false,'never double reward');
  stats=cleanSideStats(claim.next);
  assert.equal(discoveryProgress(stats).count,i+1);
 }
 assert.equal(stats.credits,275+total);assert.equal(stats.completed,3);assert.equal(stats.best,105.5);
 assert.deepEqual(stats.workshop,original.workshop);assert.deepEqual(stats.records,original.records);
 assert.deepEqual(discoveryProgress(stats),{count:8,total:8,complete:true});
});
test('interacción solo andando, muy cerca y fuera de persecución',()=>{
 const s=DISCOVERIES[0],st=initial();
 assert.equal(claimDiscovery(st,s.id,s,{onFoot:false}).ok,false);
 assert.equal(claimDiscovery(st,s.id,{x:s.x+16,z:s.z},{onFoot:true}).ok,false);
 assert.equal(claimDiscovery(st,s.id,s,{onFoot:true,policeActive:true}).ok,false);
 assert.equal(claimDiscovery(st,'fake-id',s,{onFoot:true}).ok,false);
 assert.equal(claimDiscovery(st,s.id,{x:NaN,z:s.z},{onFoot:true}).ok,false);
 assert.equal(nearestDiscovery(s).secret.id,s.id);
 assert.equal(nearestDiscovery({x:Infinity,z:s.z}),null);
 assert.equal(nearestDiscovery(s,[s.id]),null);
 assert.equal(nearestDiscovery({x:9999,z:9999}),null);
});
test('saneamiento de datos y compatibilidad con partida anterior',()=>{
 const ids=DISCOVERIES.map(s=>s.id);
 assert.deepEqual(cleanDiscoveries([ids[1],ids[1],'no-existe',{},null,ids[0]]),[ids[0],ids[1]]);
 assert.deepEqual(cleanDiscoveries('not-an-array'),[]);
 const legacy=initial(),parsed=cleanSideStats(JSON.stringify(legacy));assert.deepEqual(parsed,legacy);
 const st=cleanSideStats({...legacy,discoveries:[ids[1],ids[1],'fake',ids[0]]});assert.deepEqual(st.discoveries,[ids[0],ids[1]]);
 assert.equal(claimDiscovery({...st,credits:10000000},ids[2],DISCOVERIES[2],{onFoot:true}).ok,false);
});
test('persistencia atómica: guardado rechazado no modifica saldo ni descubrimientos',()=>{
 const storage={getItem(){return null},setItem(){throw Error('blocked')}};
 const st=initial(),proposal=claimDiscovery(st,DISCOVERIES[0].id,DISCOVERIES[0],{onFoot:true});
 assert.equal(proposal.ok,true);assert.equal(saveSideStats(storage,proposal.next),false);
 assert.deepEqual(st,initial());assert.deepEqual(readSideStats(storage),cleanSideStats(null));
 const values=new Map(),works={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 assert.equal(saveSideStats(works,proposal.next),true);
 assert.equal(readSideStats(works).credits,320);assert.deepEqual(readSideStats(works).discoveries,[DISCOVERIES[0].id]);
});

test('taller y encargos preservan los hallazgos al modificar el mismo saldo',async()=>{
 const {purchaseUpgrade}=await import('../src/workshop.js');
 const {newSideRun,startSideRun,stepSideRun,DELIVERY,awardSideRun}=await import('../src/side-activities.js');
 const starting=initial(),first=claimDiscovery(starting,DISCOVERIES[0].id,DISCOVERIES[0],{onFoot:true});
 const upgraded=purchaseUpgrade(first.next,'falcon','brakes');assert.equal(upgraded.ok,true);
 assert.deepEqual(upgraded.next.discoveries,[DISCOVERIES[0].id]);
 const run=newSideRun();startSideRun(run);for(const point of DELIVERY.points)stepSideRun(run,{...point,onFoot:false},.1);
 const stats=cleanSideStats(upgraded.next);assert.equal(awardSideRun(stats,run),true);
 assert.deepEqual(cleanSideStats(stats).discoveries,[DISCOVERIES[0].id]);
 assert.equal(cleanSideStats(stats).credits,275+45-125+125);
});
