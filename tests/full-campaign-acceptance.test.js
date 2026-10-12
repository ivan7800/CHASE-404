import test from 'node:test';
import assert from 'node:assert/strict';
import {newMission,startMission,missionTarget,stepMission} from '../src/mission.js';
import {rememberFinalChoice,finalChoiceForNextMission} from '../src/campaign-session.js';

// Deterministic campaign traversal: validates progression rules, not live driving or visual QA.
for(const ambushRoute of ['AVENIDA OESTE','CALLE DE SERVICIO']){
 for(const finalRoute of ['RESCATAR A MI HERMANO','RECUPERAR LAS PRUEBAS']){
  test(`15 consecutive chapters: ${ambushRoute} / ${finalRoute}`,()=>{
   let savedRoute=null;let savedFinal=null;let sessionFinal=null;
   const outcomes=[];
   for(let chapter=1;chapter<=15;chapter++){
    const m=newMission(chapter,savedRoute,finalChoiceForNextMission(sessionFinal,savedFinal));
    assert.equal(startMission(m),true);
    let iterations=0;
    while(m.phase==='active'){
     assert.ok(++iterations<12,`mission ${chapter}: progression stalled`);
     const t=missionTarget(m);
     assert.ok(t,`mission ${chapter}: missing target`);
     let point={x:t.x,z:t.z,onFoot:false,kmh:0,patrolDistance:200,suspectDistance:60};
     if(t.kind==='branch'){
      const option=t.alternatives.find(p=>p.name===(chapter===8?ambushRoute:finalRoute));
      assert.ok(option);point={...point,x:option.x,z:option.z};
     }
     if(['contact','rescue','investigate','decision'].includes(t.kind))point.onFoot=true;
     if(t.kind==='precision-drive')point.kmh=30;
     const dt=Math.max(0.1,t.hold??0.1);
     const result=stepMission(m,point,dt);
     assert.ok(['checkpoint','won'].includes(result),`mission ${chapter} stage ${m.index}: ${result}`);
    }
    assert.equal(m.completed,true);
    assert.equal(m.phase,'won');
    outcomes.push(m.chapter);
    if(chapter===8)savedRoute=m.routeChoice;
    if(chapter===14){sessionFinal=rememberFinalChoice(sessionFinal,m);savedFinal=m.finalChoice;}
    if(chapter===15){assert.equal(m.finalChoice,finalRoute);}
   }
   assert.deepEqual(outcomes,Array.from({length:15},(_,i)=>i+1));
  });
 }
}
