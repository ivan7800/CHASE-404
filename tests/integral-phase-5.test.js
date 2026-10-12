/** Fase 5.7: escenarios completos de campaña y regresión cruzada de economía. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {MISSION_CHAPTERS,newMission,startMission,missionTarget,stepMission} from '../src/mission.js';
import {SIDE_ACTIVITIES,newSideRun,startSideRun,stepSideRun,awardSideRun,readSideStats,saveSideStats,sideRecord} from '../src/side-activities.js';
import {DISCOVERIES,claimDiscovery,discoveryProgress} from '../src/discoveries.js';
import {CONTACTS,acceptContact,collectContactEvidence,finishContact,contactProgress,contactStage} from '../src/contacts.js';
import {purchaseUpgrade,upgradeLevels,purchaseRepair} from '../src/workshop.js';
import {parkVehicle,swapParkedVehicle,readCollection,saveCollection} from '../src/vehicle-collection.js';
import {readFinalChoice,writeFinalChoice} from '../src/final-choice.js';
import {readRoute,writeRoute} from '../src/campaign-choice.js';
import {DEFAULT_BINDINGS,BINDABLE_CODES,normalizeSettings,validateBindings,actionForKey} from '../src/settings.js';

const makeStorage=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k),values};};
const feet={onFoot:true,policeActive:false};
function simulateMission(chapter,west=false,evidence=false){
 const route=west?'AVENIDA OESTE':'CALLE DE SERVICIO';
 const final=evidence?'RECUPERAR LAS PRUEBAS':'RESCATAR A MI HERMANO';
 const m=newMission(chapter,route,final);
 assert.equal(startMission(m),true);
 let steps=0;
 while(m.phase==='active'&&steps++<8){
  const target=missionTarget(m);
  assert.ok(target,`Sin objetivo en misión ${chapter}, etapa ${m.index}`);
  const branch=target.kind==='branch'?target.alternatives[chapter===14&&evidence?1:chapter===8&& !west?1:0]:target;
  const onFoot=['contact','rescue','investigate','decision'].includes(target.kind);
  const pos={x:branch.x,z:branch.z,onFoot,kmh:target.kind==='precision-drive'?25:0,patrolDistance:1000,suspectDistance:55};
  const result=stepMission(m,pos,target.hold||.1);
  assert.notEqual(result,'lost',`Derrota en misión ${chapter} etapa ${m.index}`);
 }
 assert.equal(m.phase,'won',`Misión ${chapter} no termina`);
 assert.equal(m.completed,true);
 if(chapter===14)assert.equal(m.finalChoice,final);
 if(chapter===8)assert.equal(m.routeChoice,route);
 return m;
}
for(const west of [false,true])for(const evidence of [false,true]){
 test(`regresión de las 15 misiones · ${west?'oeste':'servicio'} · ${evidence?'pruebas':'rescate'}`,()=>{
  assert.equal(Object.keys(MISSION_CHAPTERS).length,15);
  for(let chapter=1;chapter<=15;chapter++)simulateMission(chapter,west,evidence);
 });
}
test('economía transversal: desafíos → mejoras → pistas → contactos → guardado',()=>{
 const store=makeStorage();let stats=readSideStats(store);let earned=0;
 for(const activity of SIDE_ACTIVITIES){
  const run=newSideRun(activity.id);assert.equal(startSideRun(run),true);
  for(const p of activity.points)stepSideRun(run,{...p,onFoot:false,damageEvents:0},.1);
  assert.equal(run.phase,'won');assert.equal(awardSideRun(stats,run),true);
  earned+=activity.reward;assert.equal(sideRecord(stats,activity.id).completed,1);
  assert.equal(saveSideStats(store,stats),true);stats=readSideStats(store);
 }
 assert.equal(stats.credits,earned);
 let result=purchaseUpgrade(stats,'blaze','engine');assert.equal(result.ok,true);stats=result.next;
 result=purchaseUpgrade(stats,'falcon','brakes');assert.equal(result.ok,true);stats=result.next;
 assert.equal(upgradeLevels(stats,'blaze').engine,1);
 assert.equal(upgradeLevels(stats,'falcon').engine,0);
 const damaged={urban:true,damage:20};result=purchaseRepair(stats,damaged);assert.equal(result.ok,true);stats=result.next;
 for(const secret of DISCOVERIES){
  result=claimDiscovery(stats,secret.id,{x:secret.x,z:secret.z},feet);
  assert.equal(result.ok,true);stats=result.next;
  assert.equal(claimDiscovery(stats,secret.id,{x:secret.x,z:secret.z},feet).ok,false);
 }
 assert.equal(discoveryProgress(stats).complete,true);
 for(const contact of CONTACTS){
  result=acceptContact(stats,contact.id,contact,feet);assert.equal(result.ok,true);stats=result.next;
  result=collectContactEvidence(stats,contact.id,contact.location,feet);assert.equal(result.ok,true);stats=result.next;
  result=finishContact(stats,contact.id,'copiar',contact,feet);assert.equal(result.ok,true);stats=result.next;
  assert.equal(finishContact(stats,contact.id,'copiar',contact,feet).ok,false);
 }
 assert.equal(contactProgress(stats).done,3);
 assert.equal(saveSideStats(store,stats),true);
 const restored=readSideStats(store);
 assert.deepEqual(restored,stats);
 assert.equal(restored.records['fragile-01'].completed,1);
 assert.equal(restored.discoveries.length,8);
 assert.equal(contactStage(restored,'clara'),'done');
 assert.equal(upgradeLevels(restored,'blaze').engine,1);
 assert.ok(restored.credits>0);
});
test('intercambios de garaje conservan daños y no modifican decisiones ni saldo',()=>{
 const store=makeStorage();
 assert.equal(writeRoute(store,'CALLE DE SERVICIO'),true);
 assert.equal(writeFinalChoice(store,'RECUPERAR LAS PRUEBAS'),true);
 const original={urban:true,vehicleId:'blaze',damage:48};
 const parked=parkVehicle(readCollection(store),original);assert.equal(parked.ok,true);
 assert.equal(saveCollection(store,parked.next),true);
 const current={urban:true,vehicleId:'falcon',damage:76};
 const swap=swapParkedVehicle(readCollection(store),current,'blaze');assert.equal(swap.ok,true);
 assert.equal(swap.vehicle.damage,48);
 assert.equal(saveCollection(store,swap.next),true);
 assert.equal(readCollection(store).vehicles.find(v=>v.id==='falcon').damage,76);
 assert.equal(readRoute(store),'CALLE DE SERVICIO');
 assert.equal(readFinalChoice(store),'RECUPERAR LAS PRUEBAS');
 assert.equal(readSideStats(store).credits,0);
});
test('perfiles antiguos con teclas de interacción se reparan sin inutilizar los atajos',()=>{
 for(const key of ['KeyE','KeyI','KeyJ','KeyX']){
  const candidate={...DEFAULT_BINDINGS,left:key};
  assert.equal(validateBindings(candidate),false);
  assert.deepEqual(normalizeSettings({bindings:candidate,quality:'eco'}).bindings,DEFAULT_BINDINGS);
  assert.equal(BINDABLE_CODES.includes(key),false);
  assert.equal(actionForKey(key,DEFAULT_BINDINGS),null);
 }
 assert.equal(validateBindings({...DEFAULT_BINDINGS,left:'KeyK'}),true);
});
test('guardado rechazado no altera economía, colección ni decisiones existentes',()=>{
 const store=makeStorage();const stats=readSideStats(store);
 assert.equal(writeRoute(store,'AVENIDA OESTE'),true);
 const stale=JSON.stringify([...store.values]);
 const blocked={...store,setItem(){throw Error('quota exceeded');}};
 const next=claimDiscovery(stats,DISCOVERIES[0].id,DISCOVERIES[0],feet);
 assert.equal(next.ok,true);
 assert.equal(saveSideStats(blocked,next.next),false);
 assert.equal(saveCollection(blocked,{version:1,vehicles:[]}),false);
 assert.equal(writeFinalChoice(blocked,'RECUPERAR LAS PRUEBAS'),false);
 assert.equal(readSideStats(store).credits,0);
 assert.equal(readRoute(store),'AVENIDA OESTE');
 assert.equal(JSON.stringify([...store.values]),stale);
});
