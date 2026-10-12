import test from 'node:test';
import assert from 'node:assert/strict';
import {SOUND_DISTRICTS,soundDistrictAt,soundFrame} from '../src/soundscape.js';
import {EngineAudio} from '../src/audio.js';
import {readSettings,saveSettings,normalizeSettings,SETTINGS_KEY} from '../src/settings.js';

const near=(a,b,epsilon=1e-8)=>Math.abs(a-b)<epsilon;
test('6.4: seis barrios de Barcelona y circuito se clasifican según el mapa',()=>{
 const positions=[['carmel',5,132],['guinardo',45,375],['gracia',-410,165],['eixample',-700,5],['port',-785,-450],['montjuic',-1300,-620]];
 for(const [key,x,z] of positions){assert.equal(soundDistrictAt(x,z),key);assert.ok(SOUND_DISTRICTS[key]);}
 assert.equal(soundDistrictAt(-1300,-620,false),'arcade');
});
test('6.4: audio por barrio es distinto, sin archivos ni pseudoaleatoriedad en la mezcla',()=>{
 const base={urban:true,speed:20,lighting:'day'};
 const p=soundFrame({...base,x:-785,z:-450}),c=soundFrame({...base,x:5,z:132}),e=soundFrame({...base,x:-700,z:5});
 assert.ok(p.industrial>.35&&c.industrial===0&&e.industrial===0);
 assert.ok(e.traffic>c.traffic);assert.ok(c.hills>e.hills);
 assert.deepEqual(p,soundFrame({...base,x:-785,z:-450}));
});
test('6.4: nocturnidad modifica tráfico y voces sin alterar posiciones',()=>{
 const day=soundFrame({urban:true,x:-410,z:165,lighting:'day'}),night=soundFrame({urban:true,x:-410,z:165,lighting:'night'});
 assert.equal(day.district,night.district);assert.ok(night.voices<day.voices);assert.ok(night.traffic<day.traffic);
});
test('6.4: a pie sin motor, el derrape, viento y sirena quedan limitados',()=>{
 const moving=soundFrame({urban:true,x:5,z:132,speed:90,slide:1,offroad:true,policeActive:true,trafficDistance:0});
 const foot=soundFrame({urban:true,x:5,z:132,speed:90,onFoot:true,policeActive:true});
 assert.equal(foot.engine,0);assert.equal(foot.tires,0);assert.ok(moving.siren>0&&foot.siren>0);
 for(const val of Object.values(moving))if(typeof val==='number')assert.ok(val>=0&&val<=1);
 assert.equal(soundFrame({urban:false,policeActive:true}).siren,0);
 assert.equal(soundFrame({urban:true,policeActive:true,policeDistance:500}).siren,0);
 assert.ok(soundFrame({urban:true,policeActive:true,policeDistance:20}).siren>soundFrame({urban:true,policeActive:true,policeDistance:200}).siren);
});
test('6.4: valores malformados no producen ganancias NaN ni Infinity',()=>{
 const f=soundFrame({urban:true,speed:Infinity,slide:NaN,steer:-Infinity,offroad:true,trafficDistance:NaN});
 for(const v of Object.values(f))if(typeof v==='number')assert.ok(Number.isFinite(v),v);
});
test('6.4: volumen persistente y guardados anteriores son compatibles',()=>{
 const data=new Map();const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 assert.equal(normalizeSettings({}).audioVolume,60);
 assert.equal(normalizeSettings({audioVolume:150}).audioVolume,60);
 assert.equal(normalizeSettings({audioVolume:0}).audioVolume,0);
 assert.equal(saveSettings(storage,{audioVolume:25}),true);
 assert.equal(readSettings(storage).audioVolume,25);
 assert.equal(SETTINGS_KEY,'chase404.settings.v7');
});
test('6.4: sonido solo nace al activar, permanece mudo en pausa y mezcla sirena durante persecución',async()=>{
 const oldWindow=globalThis.window;const changes=[];let nodeCount=0;
 const param=()=>({value:0,setTargetAtTime(value){changes.push(value);},setValueAtTime(){},exponentialRampToValueAtTime(){}});
 const node=()=>{nodeCount++;return {connect(x){return x;},start(){},stop(){},gain:param(),frequency:param(),threshold:param(),ratio:param(),Q:param()};};
 class MockContext{constructor(){this.destination=node();this.currentTime=1;this.sampleRate=8000;}createGain(){return node();}createOscillator(){return node();}createBiquadFilter(){return node();}createDynamicsCompressor(){return node();}createBufferSource(){return node();}createBuffer(_c,n){return {getChannelData:()=>new Float32Array(n)};}async resume(){}}
 try{
  const a=new EngineAudio();a.update(40,{},{});assert.equal(nodeCount,0);assert.equal(a.ctx,null);
  globalThis.window={AudioContext:MockContext};assert.equal(await a.toggle(),true);
  assert.equal(Object.keys(a.ambience).length,4);assert.equal(a.siren.length,2);
  a.pause(false);a.update(45,{slide:.5},{urban:true,x:-785,z:-450,policeActive:true,trafficDistance:7});
  assert.ok(a.lastFrame.industrial>.3&&a.lastFrame.siren>0);
  a.pause(true);const mutedChanges=changes.length;a.update(55,{},{});assert.equal(changes.length,mutedChanges);
  a.setVolume(0);assert.equal(a.volume,0);a.setVolume(99);assert.equal(a.volume,1);
  a.pause(false);assert.equal(await a.toggle(),false);assert.equal(a.on,false);
 }finally{globalThis.window=oldWindow;}
});
test('6.4: integración en interfaz, controles, Web Audio y guardado de audio',async()=>{
 const {readFileSync}=await import('node:fs');
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(main,/audio\.update\(settingsOpen\?0:car\.speed,car,\{urban:urbanMode/);
 assert.match(main,/policeActive:police\.active\|\|ambushPatrols\.some/);
 assert.match(main,/audio\.setVolume\(settings\.audioVolume\/100\)/);
 assert.match(main,/audio\.cue\('pursuit'\)/);
 assert.match(main,/audio\.cue\('escape'\)/);
 assert.match(html,/id="settingVolume"/);assert.match(html,/id="districtLabel"/);
});
