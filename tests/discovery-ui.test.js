import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {activateUrbanRun} from '../src/run-lifecycle.js';
import {newMission} from '../src/mission.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
test('UI estática: referencias a IDs existentes sin duplicados',()=>{
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size);
 const references=[...js.matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1]);
 for(const id of references)assert.ok(ids.includes(id),`${id} debe existir en index.html`);
});
test('selector, archivo, E táctil y marcador contextual tienen controles conectados',()=>{
 for(const id of ['exploreBtn','archiveBtn','archiveClose','archiveContinue','discoveryCollect','touchVehicle']){
  assert.ok(html.includes(`id="${id}"`));assert.ok(js.includes(`$('${id}').addEventListener('click'`),`${id} debe responder al clic`);
 }
 assert.ok(js.includes("if(code==='KeyX')collectNearbyDiscovery()"));
 assert.ok(js.includes("if(code==='KeyI')showArchive()"));
 assert.ok(js.includes("if(code==='KeyE')toggleVehicle()"));
});
test('la exploración libre no avanza el temporizador ni activa una misión',()=>{
 const mission=newMission(1);
 assert.equal(activateUrbanRun({urbanMode:true,sideMode:false,explorationMode:true,mission}),false);
 assert.equal(mission.phase,'ready');
 assert.ok(js.includes("const state=explorationMode()?'active':sideMode()?stepSideRun"));
 assert.ok(js.includes("formatTime(explorationMode()?urbanElapsed:sideMode()?sideRun.remaining:mission.remaining)"));
});
