import test from 'node:test';
import assert from 'node:assert/strict';
import {missionReport,missionFailureTitle} from '../src/mission-report.js';
test('victory report rewards fast careful execution without modifying campaign',()=>{
 const r=missionReport({won:true,chapter:3,elapsed:100,limit:300,damage:12,impacts:1});
 assert.equal(r.grade,'S');assert.equal(r.remaining,200);assert.equal(r.impacts,1);
 assert.equal(missionReport({won:true,chapter:3,elapsed:220,limit:300,damage:25}).grade,'A');
 assert.equal(missionReport({won:true,chapter:3,elapsed:290,limit:300,damage:61}).grade,'B');
});
test('failure never awards a grade and retains a meaningful explanation',()=>{
 const r=missionReport({won:false,chapter:8,elapsed:300,limit:400,failure:'DETENIDO POR LA POLICÍA'});
 assert.equal(r.grade,'SIN CLASIFICAR');assert.match(r.summary,/POLICÍA/);
});
test('branch summaries reflect saved narrative choice and cannot mutate it',()=>{
 assert.equal(missionReport({won:true,chapter:15,elapsed:70,limit:560,finalChoice:'RESCATAR A MI HERMANO'}).consequence,'RESCATAR A MI HERMANO');
 assert.equal(missionReport({won:true,chapter:8,elapsed:70,limit:560,routeChoice:'CALLE DE SERVICIO'}).consequence,'CALLE DE SERVICIO');
 assert.throws(()=>missionReport({won:true,chapter:16,elapsed:0,limit:90}),TypeError);
});
test('report handles invalid impact and damage values safely',()=>{
 const r=missionReport({won:true,chapter:1,elapsed:400,limit:100,damage:Infinity,impacts:-3});
 assert.equal(r.damage,0);assert.equal(r.impacts,0);assert.equal(r.remaining,0);
});

test('defeat causes are canonical and prioritized before building report',()=>{
 const cases=[
  [{captured:true,chapter:7,tailLost:9},'GAEL HA SIDO DETENIDO'],
  [{chapter:7,tailLost:9},'CONTACTO PERDIDO'],
  [{chapter:7,tailLost:8.9},'EL TIEMPO SE AGOTÓ'],
  [{chapter:4},'EL TIEMPO SE AGOTÓ'],
  [{won:true,captured:true},'MISIÓN COMPLETADA']
 ];
 for(const [state,expected] of cases){
  const title=missionFailureTitle(state);assert.equal(title,expected);
  if(!state.won){const report=missionReport({won:false,chapter:state.chapter||1,elapsed:30,limit:200,failure:title});assert.equal(report.summary,title);}
 }
});
