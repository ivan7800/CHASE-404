/** Generate self-contained GLB preview assets from exactly the meshes used in-game.
 * Run: node tools/build_fleet_glb.mjs — no npm install, no CDN.
 * Blender-editable equivalent: blender/generar_flota.py (requires Blender).
 */
import {writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {CARS} from '../src/garage.js';
import {buildVerenneV8} from '../src/hero-car.js';
import {buildCar} from '../src/geometry.js';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const DIR=resolve(ROOT,'assets/models');mkdirSync(DIR,{recursive:true});
export function buildGLB(mesh){
 const vertices=mesh.count,accessors=[],views=[],chunks=[];let offset=0;
 function add(typed,type,componentType,normalized=false){
  const data=Buffer.from(typed.buffer,typed.byteOffset,typed.byteLength);
  const padding=(4-data.length%4)%4,viewIndex=views.length,accessorIndex=accessors.length;
  views.push({buffer:0,byteOffset:offset,byteLength:data.length,target:34962});
  accessors.push({bufferView:viewIndex,componentType,count:vertices,type, ...(normalized?{normalized:true}:{})});
  chunks.push(data,Buffer.alloc(padding));offset+=data.length+padding;
  return accessorIndex;
 }
 const pos=add(mesh.positions,'VEC3',5126),normal=add(mesh.normals,'VEC3',5126),color=add(mesh.colors,'VEC3',5121,true);
 const gltf={asset:{version:'2.0',generator:'CHASE 404 offline garage exporter'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:{POSITION:pos,NORMAL:normal,COLOR_0:color},mode:4}]}],buffers:[{byteLength:offset}],bufferViews:views,accessors};
 const jsonRaw=Buffer.from(JSON.stringify(gltf)),jsonPad=(4-jsonRaw.length%4)%4,json=Buffer.concat([jsonRaw,Buffer.alloc(jsonPad,32)]);
 const bin=Buffer.concat(chunks),out=Buffer.alloc(12+8+json.length+8+bin.length);
 let k=0;out.writeUInt32LE(0x46546c67,k);k+=4;out.writeUInt32LE(2,k);k+=4;out.writeUInt32LE(out.length,k);k+=4;
 out.writeUInt32LE(json.length,k);k+=4;out.writeUInt32LE(0x4e4f534a,k);k+=4;json.copy(out,k);k+=json.length;
 out.writeUInt32LE(bin.length,k);k+=4;out.writeUInt32LE(0x004e4942,k);k+=4;bin.copy(out,k);
 return out;
}
for(const spec of CARS){
 const mesh=spec.id==='blaze'?buildVerenneV8():buildCar(spec),out=buildGLB(mesh),dest=resolve(DIR,(spec.id==='racer'?'racer-04':spec.id)+'.glb');
 writeFileSync(dest,out);console.log(`${spec.name.padEnd(12)} ${mesh.count} vertices -> ${out.length} bytes`);
}
