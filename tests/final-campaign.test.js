import test from 'node:test';
import assert from 'node:assert/strict';
import {newMission,startMission,missionTarget,stepMission,missionChapter,fifteenthMissionPoints} from '../src/mission.js';
import {readFinalChoice,writeFinalChoice} from '../src/final-choice.js';
const at=(t,extras={})=>({x:t.x,z:t.z,onFoot:true,patrolDistance:100,...extras});
for(const choice of ['RESCATAR A MI HERMANO','RECUPERAR LAS PRUEBAS']){
 test(`mission 15 has complete ${choice} ending`,()=>{
  const m=newMission(15,null,choice);assert.equal(m.finalChoice,choice);assert.equal(missionChapter(15).title,'BARCELONA NO PERDONA');startMission(m);
  const first=missionTarget(m);assert.equal(first.name,choice==='RECUPERAR LAS PRUEBAS'?'LIBERAR AL HERMANO':'RECUPERAR EL DOSSIER');
  assert.equal(stepMission(m,at(first,{onFoot:false}),first.hold),null);
  assert.equal(stepMission(m,at(first),first.hold),'checkpoint');
  const second=missionTarget(m);assert.equal(second.kind,'evade');
  assert.equal(stepMission(m,at(second,{patrolDistance:20}),5),null);
  assert.equal(stepMission(m,at(second,{patrolDistance:100}),5),'checkpoint');
  const last=missionTarget(m);assert.equal(last.kind,'contact');
  assert.equal(stepMission(m,at(last),last.hold),'won');assert.equal(m.completed,true);
 });
}
test('invalid final-choice save is safely rejected and fallback is deterministic',()=>{
 const store=new Map();const storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};
 assert.equal(writeFinalChoice(storage,'RECUPERAR LAS PRUEBAS'),true);
 assert.equal(readFinalChoice(storage),'RECUPERAR LAS PRUEBAS');
 assert.equal(newMission(15,null,readFinalChoice(storage)).finalChoice,'RECUPERAR LAS PRUEBAS');
 assert.equal(newMission(15,null,'INVALID').finalChoice,null);
 assert.equal(fifteenthMissionPoints(null)[0].name,'RECUPERAR EL DOSSIER');
});
test('mission 15 times out correctly',()=>{const m=newMission(15);startMission(m);assert.equal(stepMission(m,{x:20000,z:20000},561),'lost');});
