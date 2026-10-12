import test from 'node:test';
import assert from 'node:assert/strict';
import {objectivePresentation,objectiveTransition} from '../src/objective-presentation.js';
import {MISSION_CHAPTERS,missionChapter} from '../src/mission.js';
test('guidance available for every campaign waypoint',()=>{
 for(let chapter=1;chapter<=15;chapter++){
  const points=missionChapter(chapter).points;
  for(const [index,p] of points.entries()){
   const info=objectivePresentation(p,index,points.length);
   assert.equal(info.step,`OBJETIVO ${index+1} / ${points.length}`);
   assert.ok(info.title.length&&info.instruction.length);
  }
 }
});
test('guidance is specific to movement and interaction',()=>{
 assert.match(objectivePresentation({kind:'precision-drive',name:'Control'},0,3).instruction,/velocidad/);
 assert.match(objectivePresentation({kind:'contact',name:'Clara'},0,2).instruction,/Baja del coche/);
 assert.match(objectivePresentation({kind:'branch',name:'Ruta'},0,3).instruction,/ELIGE RUTA/);
});
test('transition announcement supports side challenges and campaign',()=>{
 assert.equal(objectiveTransition({name:'Gràcia'},false),'NUEVO OBJETIVO · Gràcia');
 assert.equal(objectiveTransition({name:'Gràcia'},true),'NUEVO CONTROL · Gràcia');
 assert.equal(objectiveTransition(null),'OBJETIVO COMPLETADO');
});
test('invalid objective indices are rejected',()=>assert.throws(()=>objectivePresentation({name:'A'},-1,3),TypeError));
