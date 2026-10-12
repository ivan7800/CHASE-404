import test from 'node:test';
import assert from 'node:assert/strict';
import {newMission,startMission,missionTarget,stepMission,NINTH_WEST_POINT,NINTH_EAST_POINT} from '../src/mission.js';
import {readRoute,writeRoute,ROUTE_KEY} from '../src/campaign-choice.js';
const memory=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)}};
test('west route changes the second chapter 9 objective and can be completed',()=>{
 const m=newMission(9,'AVENIDA OESTE');startMission(m);
 assert.equal(stepMission(m,missionTarget(m),1),'checkpoint');
 assert.equal(missionTarget(m).name,NINTH_WEST_POINT.name);
 assert.equal(stepMission(m,missionTarget(m),1),'checkpoint');
 assert.equal(stepMission(m,missionTarget(m),1),'won');
});
test('service route leads to a different second objective',()=>{
 const m=newMission(9,'CALLE DE SERVICIO');startMission(m);stepMission(m,missionTarget(m),1);
 assert.equal(missionTarget(m).name,NINTH_EAST_POINT.name);
});
test('invalid or unavailable stored choice falls back safely',()=>{
 const db=memory();assert.equal(readRoute(db),null);
 assert.equal(writeRoute(db,'untrusted'),false);
 db.setItem(ROUTE_KEY,'{"version":1,"route":"unexpected"}');assert.equal(readRoute(db),null);
 db.setItem(ROUTE_KEY,'not-json');assert.equal(readRoute(db),null);
 const m=newMission(9,'untrusted');startMission(m);stepMission(m,missionTarget(m),1);
 assert.equal(missionTarget(m).name,NINTH_WEST_POINT.name);
});
test('choice persists with a versioned record',()=>{
 const db=memory();assert.equal(writeRoute(db,'CALLE DE SERVICIO'),true);
 assert.equal(readRoute(db),'CALLE DE SERVICIO');
});
test('failed storage operations do not crash campaign',()=>{
 const db={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.equal(readRoute(db),null);assert.equal(writeRoute(db,'AVENIDA OESTE'),false);
});
