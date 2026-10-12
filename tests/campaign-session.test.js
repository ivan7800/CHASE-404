import test from 'node:test';
import assert from 'node:assert/strict';
import {finalChoiceForNextMission,rememberFinalChoice} from '../src/campaign-session.js';
import {newMission,startMission,stepMission,missionTarget} from '../src/mission.js';
import {readFinalChoice} from '../src/final-choice.js';
const brokenStorage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
for(const choice of ['RESCATAR A MI HERMANO','RECUPERAR LAS PRUEBAS']){
 test(`mission 14 → 15 preserves ${choice} even with blocked storage`,()=>{
  const m=newMission(14);startMission(m);
  let target=missionTarget(m);
  assert.equal(stepMission(m,{x:target.x,z:target.z,onFoot:true},target.hold),'checkpoint');
  target=missionTarget(m);const alternative=target.alternatives.find(p=>p.name===choice);
  assert.equal(stepMission(m,{x:alternative.x,z:alternative.z,onFoot:false},0.1),'checkpoint');
  target=missionTarget(m);assert.equal(stepMission(m,{x:target.x,z:target.z,onFoot:true},target.hold),'won');
  assert.equal(readFinalChoice(brokenStorage),null);
  const session=rememberFinalChoice(null,m);
  const next=newMission(15,null,finalChoiceForNextMission(session,readFinalChoice(brokenStorage)));
  assert.equal(next.finalChoice,choice);startMission(next);
  assert.equal(missionTarget(next).name,choice==='RECUPERAR LAS PRUEBAS'?'LIBERAR AL HERMANO':'RECUPERAR EL DOSSIER');
 });
}
test('only a completed mission 14 may overwrite the current session choice',()=>{
 const m=newMission(14);m.finalChoice='RECUPERAR LAS PRUEBAS';
 assert.equal(rememberFinalChoice('RESCATAR A MI HERMANO',m),'RESCATAR A MI HERMANO');
 m.phase='won';assert.equal(rememberFinalChoice(null,m),'RECUPERAR LAS PRUEBAS');
 assert.equal(finalChoiceForNextMission(null,'RESCATAR A MI HERMANO'),'RESCATAR A MI HERMANO');
 assert.equal(finalChoiceForNextMission('INVALID','INVALID'),null);
});
