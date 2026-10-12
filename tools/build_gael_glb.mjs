/** Export the six independent Gael rig parts to locally hosted glTF 2.0 GLBs.
 * This is a segmented articulated rig, NOT a glTF skin or skeletal animation.
 */
import {writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {buildGaelMeshes} from '../src/gael-model.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const GAEL_PART_NAMES=Object.freeze(['body','detail','leg','arm','shin','forearm']);
function pad4(buffer,pad=0){const end=(buffer.length+3)&~3;return end===buffer.length?buffer:Buffer.concat([buffer,Buffer.alloc(end-buffer.length,pad)]);}
export function encodePartGLB(part,name){
 const positions=Buffer.from(part.positions.buffer,part.positions.byteOffset,part.positions.byteLength);
 const normals=Buffer.from(part.normals.buffer,part.normals.byteOffset,part.normals.byteLength);
 const colors=Buffer.from(part.colors.buffer,part.colors.byteOffset,part.colors.byteLength);
 const sections=[positions,normals,colors];let offset=0;
 const views=sections.map((section)=>{const entry={buffer:0,byteOffset:offset,byteLength:section.length};offset+=(section.length+3)&~3;return entry;});
 const bin=Buffer.concat(sections.map(s=>pad4(s)));
 const gltf={asset:{version:'2.0',generator:'CHASE 404 Gael parts exporter'},scene:0,scenes:[{nodes:[0]}],nodes:[{name,mesh:0}],meshes:[{name,primitives:[{attributes:{POSITION:0,NORMAL:1,COLOR_0:2},mode:4}]}],buffers:[{byteLength:bin.length}],bufferViews:views,accessors:[{bufferView:0,componentType:5126,count:part.count,type:'VEC3'},{bufferView:1,componentType:5126,count:part.count,type:'VEC3'},{bufferView:2,componentType:5121,count:part.count,type:'VEC3',normalized:true}]};
 const json=pad4(Buffer.from(JSON.stringify(gltf)),32);const out=Buffer.alloc(12+8+json.length+8+bin.length);
 out.writeUInt32LE(0x46546c67,0);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);
 out.writeUInt32LE(json.length,12);out.writeUInt32LE(0x4e4f534a,16);json.copy(out,20);
 const p=20+json.length;out.writeUInt32LE(bin.length,p);out.writeUInt32LE(0x004e4942,p+4);bin.copy(out,p+8);return out;
}
export function buildGaelAssets(target=resolve(root,'assets/models/gael')){mkdirSync(target,{recursive:true});const pieces=buildGaelMeshes();for(const name of GAEL_PART_NAMES){writeFileSync(resolve(target,name+'.glb'),encodePartGLB(pieces[name],name));}return GAEL_PART_NAMES.length;}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){console.log('Gael GLB pieces exported:',buildGaelAssets());}
