import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildCity,ROAD_REMASTER_CROSSINGS,FACADE_REMASTER_COUNT,nearestStreet} from '../src/city.js';
import {Renderer} from '../src/renderer.js';
import {createUrbanCar} from '../src/physics.js';
import {buildWheel} from '../src/geometry.js';

test('fase 6.2 introduce pasos pintados, asfaltados y relieves de fachada sin exceder presupuesto',()=>{
 const city=buildCity();
 assert.ok(city.count>303000,`malla enriquecida: ${city.count}`);
 assert.ok(city.count<400000,`presupuesto de geometría: ${city.count}`);
 assert.ok(city.positions.every(Number.isFinite));
 assert.equal(FACADE_REMASTER_COUNT,29);
 const colors=new Set();
 for(let i=0;i<city.colors.length;i+=3)colors.add(`${city.colors[i]},${city.colors[i+1]},${city.colors[i+2]}`);
 for(const col of ['201,195,172','44,47,49','184,171,146','196,184,146'])assert.ok(colors.has(col),`paleta urbana presente ${col}`);
});

test('pasos de peatones remasterizados conectados a las calles, sin mover la red original',()=>{
 assert.equal(ROAD_REMASTER_CROSSINGS.length,5);
 for(const crossing of ROAD_REMASTER_CROSSINGS){
  assert.ok(nearestStreet(crossing.x,crossing.z).distance<.1,`en vial ${crossing.x},${crossing.z}`);
 }
});

test('ruedas compartidas por GLB y coches procedurales conservan normales y banda lateral',()=>{
 const wheel=buildWheel();
 assert.ok(wheel.count>900);
 assert.ok(wheel.positions.every(Number.isFinite));
 const colors=new Set();for(let i=0;i<wheel.colors.length;i+=3)colors.add(`${wheel.colors[i]},${wheel.colors[i+1]},${wheel.colors[i+2]}`);
 assert.ok(colors.has('77,83,79'));
});

test('shader aplica material 1 a carrocería y material 2 a ruedas, deja ciudad en 0',()=>{
 const drawn=[],uniforms=[];
 const gl={VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,LINK_STATUS:35714,ARRAY_BUFFER:34962,STATIC_DRAW:35044,FLOAT:5126,UNSIGNED_BYTE:5121,TRIANGLES:4,DEPTH_TEST:2929,LEQUAL:515,CULL_FACE:2884,COLOR_BUFFER_BIT:16384,DEPTH_BUFFER_BIT:256,
 createProgram:()=>({}),createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>true,attachShader(){},linkProgram(){},getProgramParameter:()=>true,useProgram(){},getAttribLocation:()=>0,getUniformLocation:(_,name)=>name,createBuffer:()=>({}),deleteBuffer(){},bindBuffer(){},bufferData(){},enable(){},depthFunc(){},disable(){},clearColor(){},uniformMatrix4fv(){},uniform3f:(name,...values)=>{if(name==='uCameraPos')uniforms.push([name,...values]);},uniform1f:(name,value)=>{if(name==='uMaterialType')uniforms.push([name,value]);},enableVertexAttribArray(){},vertexAttribPointer(){},viewport(){},clear(){},drawArrays(){drawn.push(uniforms.filter(([name])=>name==='uMaterialType').at(-1)?.[1]);}};
 globalThis.window={devicePixelRatio:1,dispatchEvent(){}};
 globalThis.fetch=async()=>({ok:false,status:404});
 const canvas={width:1,height:1,getContext:()=>gl,getBoundingClientRect:()=>({width:900,height:540}),addEventListener(){}};
 const renderer=new Renderer(canvas);renderer.setUrbanMode(true);renderer.render(createUrbanCar(),1/60);
 assert.equal(drawn[0],0,'escenario mate');const carIndex=drawn.indexOf(1);
 assert.ok(carIndex>1,'carrocería reflectante, tras escenario y semáforos');
 assert.deepEqual(drawn.slice(carIndex+1,carIndex+5),[2,2,2,2]);
 assert.ok(drawn.slice(0,carIndex).every(type=>type===0),'escenario, semáforos y sombra mates');
 assert.ok(uniforms.some(([name,...values])=>name==='uCameraPos'&&values.length===3&&values.every(Number.isFinite)));
 const shader=readFileSync(new URL('../src/renderer.js',import.meta.url),'utf8');
 assert.match(shader,/varying vec3 vWorldPosition/);assert.match(shader,/gloss\*specularPower/);
});
