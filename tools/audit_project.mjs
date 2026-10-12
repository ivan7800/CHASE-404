/** CHASE 404 · auditoría estática reproducible de la distribución local.
 * No reemplaza a las pruebas reales en un navegador WebGL.
 */
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {CITY,nearestStreet} from '../src/city.js';
import {MISSION_CHAPTERS} from '../src/mission.js';
import {SIDE_ACTIVITIES} from '../src/side-activities.js';
import {DISCOVERIES} from '../src/discoveries.js';
import {CONTACTS} from '../src/contacts.js';
import {CARMEL_GARAGE} from '../src/vehicle-collection.js';
import {WORKSHOP} from '../src/workshop.js';
import {BINDABLE_CODES,DEFAULT_BINDINGS,validateBindings} from '../src/settings.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const html=readFileSync(join(root,'index.html'),'utf8');
const sourceDir=join(root,'src');
const sourceFiles=readdirSync(sourceDir).filter(f=>f.endsWith('.js'));
const sources=sourceFiles.map(file=>({file,text:readFileSync(join(sourceDir,file),'utf8')}));
const failures=[];const assert=(condition,description)=>{if(!condition)failures.push(description);};
const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
const idSet=new Set(ids);
assert(idSet.size===ids.length,`IDs HTML duplicados: ${ids.length-idSet.size}`);
const refs=new Set(sources.flatMap(s=>[...s.text.matchAll(/\$\(['"]([^'"]+)['"]\)/g)].map(m=>m[1])));
for(const id of refs)assert(idSet.has(id),`ID HTML no encontrado: ${id}`);
const staticButtons=[...html.matchAll(/<button\b[^>]*\bid=["']([^"']+)["'][^>]*>/g)].map(m=>m[1]);
const main=sources.find(s=>s.file==='main.js').text;
const noListener=[];
for(const id of staticButtons){
 // Acciones por teclado/touch, eventos directos o ui.start están contemplados.
 const match=main.includes(`$('${id}').addEventListener(`)||
  (id==='startBtn'&&main.includes('ui.start.addEventListener('))||
  /^(touchLeft|touchRight|touchBrake|touchGas)$/.test(id)&&main.includes(`'${id}'`);
 if(!match)noListener.push(id);
}
assert(!noListener.length,`Botones HTML sin registro visible de acción: ${noListener.join(', ')}`);
for(const s of sources){
 for(const m of s.text.matchAll(/\bfrom\s*['"](\.[^'"]+)['"]/g)){
  assert(existsSync(resolve(sourceDir,m[1])),`Módulo ausente: ${s.file} → ${m[1]}`);
 }
}
let htmlAssets=0;
for(const m of html.matchAll(/\b(?:src|href)=["'](\.[^"']+)["']/g)){
 htmlAssets++;assert(existsSync(resolve(root,m[1])),`Asset HTML ausente: ${m[1]}`);
}
const roadPoints=[];
for(const [ch,data] of Object.entries(MISSION_CHAPTERS)){
 assert(data.points.length>=2,`Misión ${ch} sin objetivos suficientes`);
 assert(Number.isFinite(data.limit)&&data.limit>0,`Misión ${ch} con límite inválido`);
 for(const p of data.points){
  if(p.kind==='branch')for(const option of p.alternatives)roadPoints.push([`Misión ${ch} / ${option.name}`,option]);
  else if(p.kind!=='branch')roadPoints.push([`Misión ${ch} / ${p.name}`,p]);
 }
}
for(const act of SIDE_ACTIVITIES)for(const point of act.points)roadPoints.push([`Desafío ${act.id} / ${point.name}`,point]);
for(const secret of DISCOVERIES)roadPoints.push([`Secreto ${secret.id}`,secret]);
for(const contact of CONTACTS){roadPoints.push([`Contacto ${contact.id}`,contact]);roadPoints.push([`Prueba ${contact.id}`,contact.location]);}
roadPoints.push(['Taller',WORKSHOP],['Garaje',CARMEL_GARAGE]);
let worst=0;
for(const [name,p] of roadPoints){
 const d=nearestStreet(p.x,p.z).distance;worst=Math.max(worst,d);
 assert(Number.isFinite(d)&&d<=CITY.sidewalkHalf+3,`${name} fuera de acceso peatonal (${d.toFixed(1)})`);
}
assert(Object.keys(MISSION_CHAPTERS).length===15,'La campaña no contiene 15 misiones');
assert(SIDE_ACTIVITIES.length===3,'Los desafíos disponibles han cambiado');
assert(DISCOVERIES.length===8,'El catálogo de secretos ha cambiado');
assert(CONTACTS.length===3,'El catálogo de personajes ha cambiado');
for(const code of ['KeyE','KeyI','KeyJ','KeyX'])assert(!BINDABLE_CODES.includes(code),`Tecla de interacción reservada: ${code}`);
assert(validateBindings(DEFAULT_BINDINGS),'Controles predeterminados inválidos');
if(failures.length){console.error('AUDITORÍA ESTÁTICA: FALLO\n'+failures.map(s=>'  ✗ '+s).join('\n'));process.exitCode=1;}
else console.log(`AUDITORÍA ESTÁTICA: CORRECTA · ${idSet.size} IDs únicos · ${staticButtons.length} botones conectados · ${refs.size} referencias HTML · ${htmlAssets} recursos HTML · ${sourceFiles.length} módulos · ${roadPoints.length} puntos accesibles (máx ${worst.toFixed(1)} m) · 15 misiones · 3 desafíos · 8 secretos · 3 personajes`);
