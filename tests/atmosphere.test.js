import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LIGHTING_PRESETS,DEFAULT_LIGHTING,LIGHTING_KEY,normalizeLighting,nextLighting,getLighting,readLighting,saveLighting} from '../src/atmosphere.js';
import {Renderer} from '../src/renderer.js';
import {createUrbanCar} from '../src/physics.js';

test('tres looks de Barcelona con niebla y luz físicamente acotadas',()=>{
 assert.deepEqual(LIGHTING_PRESETS.map(x=>x.id),['day','dusk','night']);
 assert.equal(new Set(LIGHTING_PRESETS.map(x=>x.label)).size,3);
 for(const look of LIGHTING_PRESETS){
  for(const key of ['sky','sun','ambientLow','ambientHigh'])assert.equal(look[key].length,3);
  for(const key of ['sky','sun','ambientLow','ambientHigh','direction'])assert.ok(look[key].every(Number.isFinite));
  assert.ok(look.fogStart>=0&&look.fogStart<look.fogEnd&&look.fogEnd<=1700);
  assert.ok(look.sunPower>=0&&look.sunPower<=1&&look.exposure>0);
  assert.ok(look.fogStrength>=0&&look.fogStrength<=1);assert.ok(look.lamps>=0&&look.lamps<=1);
 }
 assert.notDeepEqual(getLighting('day').sky,getLighting('night').sky);
 assert.notDeepEqual(getLighting('dusk').sun,getLighting('night').sun);
 assert.equal(DEFAULT_LIGHTING,'dusk');
});

test('ciclo de iluminación seguro, sin mutar los controles ni el guardado de campaña',()=>{
 assert.equal(nextLighting('day'),'dusk');assert.equal(nextLighting('dusk'),'night');assert.equal(nextLighting('night'),'day');
 assert.equal(normalizeLighting('intrusion'),DEFAULT_LIGHTING);assert.equal(nextLighting('invalid'),'night');
 const map=new Map();const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
 assert.equal(readLighting(storage),DEFAULT_LIGHTING);
 assert.equal(saveLighting(storage,'night'),true);assert.equal(readLighting(storage),'night');
 assert.deepEqual([...map.keys()],[LIGHTING_KEY]);
 assert.equal(saveLighting(storage,'invalid'),true);assert.equal(readLighting(storage),DEFAULT_LIGHTING);
 assert.equal(readLighting({getItem(){throw Error('denied');}}),DEFAULT_LIGHTING);
 assert.equal(saveLighting({setItem(){throw Error('quota');}},'day'),false);
});

test('iluminación dinámica modifica los uniforms y el color real de borrado WebGL',()=>{
 const clears=[],uniforms=[];
 const gl={VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,UNSIGNED_BYTE:5121,TRIANGLES:4,DEPTH_TEST:2929,LEQUAL:515,CULL_FACE:2884,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,
 createProgram:()=>({}),createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>true,attachShader(){},linkProgram(){},getProgramParameter:()=>true,useProgram(){},getAttribLocation:()=>0,getUniformLocation:(_,name)=>name,createBuffer:()=>({}),deleteBuffer(){},bindBuffer(){},bufferData(){},enable(){},depthFunc(){},disable(){},clearColor:(...args)=>clears.push(args),uniformMatrix4fv(){},uniform3f:(name,...args)=>uniforms.push([name,...args]),uniform1f:(name,value)=>uniforms.push([name,value]),enableVertexAttribArray(){},vertexAttribPointer(){},viewport(){},clear(){},drawArrays(){}
 };
 globalThis.window={devicePixelRatio:1,dispatchEvent(){}};
 globalThis.fetch=async()=>({ok:false,status:404});
 const canvas={width:1,height:1,getContext:()=>gl,getBoundingClientRect:()=>({width:800,height:500}),addEventListener(){}};
 const renderer=new Renderer(canvas);renderer.setUrbanMode(true);
 for(const name of ['day','dusk','night']){
  const chosen=renderer.setLighting(name);assert.equal(chosen.id,name);
  renderer.render(createUrbanCar(),1/60);
  assert.deepEqual(clears.at(-1),[...chosen.sky,1]);
  assert.ok(uniforms.some(([key,...values])=>key==='uFogStart'&&values[0]===chosen.fogStart));
  assert.ok(uniforms.some(([key,...values])=>key==='uSun'&&values.join(',')===chosen.sun.join(',')));
  assert.ok(uniforms.some(([key,...values])=>key==='uLamps'&&values[0]===chosen.lamps));
 }
 assert.equal(renderer.setLighting('corrupt').id,DEFAULT_LIGHTING);
 renderer.setUrbanMode(false);renderer.render(createUrbanCar(),1/60);
 assert.notDeepEqual(clears.at(-1),[...getLighting('dusk').sky,1],'los circuitos no adoptan el cielo urbano');
});

test('la interfaz conecta botón y teclado B, marca look activo y conserva la accesibilidad',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const js=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../styles/main.css',import.meta.url),'utf8');
 assert.match(html,/id="lightingBtn"/);assert.match(html,/id="lightingLabel"/);
 assert.match(html,/id="cinematicGrade"[^>]+aria-hidden="true"/);
 assert.match(js,/lightingBtn'\)\.addEventListener\('click',cycleLighting\)/);
 assert.match(js,/code==='KeyB'\)cycleLighting\(\)/);
 assert.match(js,/function updateSelectionUI\(\)[\s\S]*?applyLighting\(\);updateSideMenu/);
 assert.match(css,/\.cinematic-grade\{[^}]*pointer-events:none/);
 assert.match(css,/data-contrast="true"\] \.cinematic-grade\{display:none/);
});
