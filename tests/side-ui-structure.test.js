import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {activateUrbanRun} from '../src/run-lifecycle.js';
import {newSideRun} from '../src/side-activities.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
test('selector de tres desafíos tiene controles únicos, accesibles y enlazados',()=>{
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(ids.length,new Set(ids).size,'sin IDs repetidos');
 for(const id of ['sideSelect','sideSelectWrap','sideBtn','sideRules','sideStats','finishOverlay','finishBoard','rewardReport'])assert.ok(ids.includes(id),id);
 for(const option of ['delivery-01','sprint-01','fragile-01'])assert.ok(html.includes(`value="${option}"`));
 assert.match(html,/<label for="sideSelect">/);
 assert.match(js,/\$\('sideSelect'\)\.addEventListener\('change'/);
 assert.match(js,/\$\('sideBtn'\)\.addEventListener\('click'/);
});
test('el controlador enlaza el desafío a reinicio, HUD, minimapa, recompensas y resultados',()=>{
 for(const needle of ['newSideRun(selectedSideId)','sideTarget(sideRun)','stepSideRun(sideRun,missionPos,FIXED_STEP)','sideEnd(state)','awardSideRun(next,proposedRun)','saveSideStats(localStorage,next)','sideRecord(sideStats,activity.id)'])assert.ok(js.includes(needle),needle);
 const sideRun=newSideRun('delivery-01');
 assert.equal(activateUrbanRun({urbanMode:true,sideMode:true,explorationMode:false,sideRun,damageEvents:2}),true);
 assert.equal(sideRun.phase,'active');assert.equal(sideRun.baseDamageEvents,2);
 assert.ok(js.includes("if(sideMode()){sideRun.phase='lost';sideEnd('lost'"));
});
