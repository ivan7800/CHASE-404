import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPAIGN_PROGRESS_KEY,freshCampaign,readCampaign,writeCampaign,advanceCampaign} from '../src/campaign-progress.js';
import {activateUrbanRun} from '../src/run-lifecycle.js';
import {newMission,missionTarget,stepMission} from '../src/mission.js';
import {newSideRun,sideTarget,stepSideRun} from '../src/side-activities.js';

function store(){const entries=new Map();return {getItem:k=>entries.get(k)??null,setItem:(k,v)=>entries.set(k,v),removeItem:k=>entries.delete(k)};}
test('reiniciar una misión activa vuelve a aceptar el primer objetivo y el reloj avanza',()=>{
 let run=newMission(1);activateUrbanRun({urbanMode:true,sideMode:false,explorationMode:false,mission:run});
 run=newMission(1); // initRace() crea la misión de sustitución tras R.
 assert.equal(activateUrbanRun({urbanMode:true,sideMode:false,explorationMode:false,mission:run}),true);
 const target=missionTarget(run);
 stepMission(run,{x:target.x+100,z:target.z+100,onFoot:false,kmh:20},.5);
 assert.equal(run.phase,'active');assert.equal(run.elapsed,.5);
});
test('reiniciar un encargo activo vuelve a activar su objetivo',()=>{
 let run=newSideRun('delivery-01');activateUrbanRun({urbanMode:true,sideMode:true,explorationMode:false,sideRun:run,damageEvents:0});
 run=newSideRun('delivery-01');
 assert.equal(activateUrbanRun({urbanMode:true,sideMode:true,explorationMode:false,sideRun:run,damageEvents:0}),true);
 const target=sideTarget(run);
 assert.equal(stepSideRun(run,{x:target.x,z:target.z,onFoot:false,damageEvents:0},.1),'checkpoint');
});
test('pausa y circuitos no reinician una misión activa',()=>{
 const run=newMission(1);const context={urbanMode:true,sideMode:false,explorationMode:false,mission:run};
 assert.equal(activateUrbanRun(context),true);
 assert.equal(activateUrbanRun(context),false);
 assert.equal(activateUrbanRun({...context,urbanMode:false}),false);
 assert.equal(run.phase,'active');
});
test('campaña guarda solo victorias, reanuda capítulo y conserva el último al terminar',()=>{
 const storage=store();let progress=freshCampaign();
 assert.deepEqual(advanceCampaign(progress,2),progress); // No saltarse un capítulo.
 progress=advanceCampaign(progress,1);assert.equal(writeCampaign(storage,progress),true);
 assert.equal(readCampaign(storage).nextChapter,2);
 progress=advanceCampaign(readCampaign(storage),2);writeCampaign(storage,progress);
 assert.equal(readCampaign(storage).nextChapter,3);
 assert.deepEqual(advanceCampaign(progress,1),progress); // No retroceder.
 for(let chapter=3;chapter<=15;chapter++)progress=advanceCampaign(progress,chapter);
 assert.deepEqual(progress,{version:1,nextChapter:15,completed:true});
});
test('datos dañados, versión desconocida y almacenamiento bloqueado son seguros',()=>{
 const storage=store();
 for(const value of ['{',JSON.stringify({version:1,nextChapter:99,completed:true}),JSON.stringify({version:2,nextChapter:3,completed:false})]){
  storage.setItem(CAMPAIGN_PROGRESS_KEY,value);assert.deepEqual(readCampaign(storage),freshCampaign());
 }
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.deepEqual(readCampaign(blocked),freshCampaign());assert.equal(writeCampaign(blocked,advanceCampaign(freshCampaign(),1)),false);
});
