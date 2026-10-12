import test from 'node:test';
import assert from 'node:assert/strict';
import {CITY,nearestStreet,cityElevation,buildCity} from '../src/city.js';
import {roadPath} from '../src/road-network.js';

test('El Guinardó está conectado físicamente al Carmel',()=>{
 const path=roadPath(-205,210,100,420);
 assert.ok(path.length>5,'debe haber un recorrido conectado');
 for(const point of path)assert.ok(nearestStreet(point.x,point.z).distance<1,'ruta sobre calzada');
});
test('Las calles nuevas se mantienen dentro del terreno',()=>{
 const newLines=CITY.streets.filter(street=>street.some(([,z])=>z>260));
 assert.ok(newLines.length>=3);
 for(const path of newLines)for(const [x,z] of path){assert.ok(Math.abs(x)<CITY.bounds&&Math.abs(z)<CITY.bounds);assert.ok(Number.isFinite(cityElevation(x,z)));}
});
test('La malla ampliada se genera con geometría válida',()=>{
 const mesh=buildCity();assert.ok(mesh);assert.ok(Object.keys(mesh).length>0);
});
