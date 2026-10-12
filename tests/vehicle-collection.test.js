import test from 'node:test';
import assert from 'node:assert/strict';
import {CARS} from '../src/garage.js';
import {CARMEL_GARAGE,GARAGE_CAPACITY,COLLECTION_KEY,cleanCollection,garageAvailable,parkVehicle,takeVehicle,swapParkedVehicle,readCollection,saveCollection} from '../src/vehicle-collection.js';
import {nearestStreet} from '../src/city.js';
import {createUrbanCar} from '../src/physics.js';
import {purchaseUpgrade,tuneWithUpgrades} from '../src/workshop.js';
const mock=()=>{const map=new Map();return {getItem:key=>map.get(key)??null,setItem:(key,value)=>{map.set(key,value);},map};};
const car=(id,damage=17)=>Object.assign(createUrbanCar(),{vehicleId:id,damage});

test('garaje accesible solo en ciudad, inmóvil y sin alerta policial',()=>{
 const base={urban:true,onFoot:false,x:CARMEL_GARAGE.x,z:CARMEL_GARAGE.z,speed:0,policeActive:false};
 assert.ok(nearestStreet(base.x,base.z).distance<1);
 assert.equal(garageAvailable(base),true);
 for(const mod of [{onFoot:true},{speed:2},{urban:false},{policeActive:true},{x:99},{x:NaN},{speed:NaN}])assert.equal(garageAvailable({...base,...mod}),false);
});

test('guardar un coche conserva daños y permite actualizar la misma plaza',()=>{
 const initial=cleanCollection(null),before=structuredClone(initial),c=car('nova',46.46);
 const proposal=parkVehicle(initial,c);assert.equal(proposal.ok,true);assert.equal(proposal.updated,false);
 assert.deepEqual(proposal.next.vehicles,[{id:'nova',damage:46.5}]);assert.deepEqual(initial,before);
 c.damage=21;const update=parkVehicle(proposal.next,c);
 assert.equal(update.ok,true);assert.equal(update.updated,true);assert.equal(update.next.vehicles.length,1);
 assert.deepEqual(update.next.vehicles[0],{id:'nova',damage:21});
 assert.equal(takeVehicle(update.next,'nova').vehicle.damage,21);
 assert.equal(takeVehicle(initial,'nova').ok,false);
});

test('seis modelos distintos como máximo y rechazo de ids falsos',()=>{
 let state=cleanCollection(null);
 for(const spec of CARS){const res=parkVehicle(state,car(spec.id));assert.equal(res.ok,true);state=res.next;}
 assert.equal(state.vehicles.length,GARAGE_CAPACITY);
 assert.equal(parkVehicle(state,car('nova',35)).ok,true);
 assert.equal(parkVehicle(state,{vehicleId:'unknown',urban:true}).ok,false);
 assert.equal(parkVehicle(state,{vehicleId:'nova',urban:false}).ok,false);
 assert.equal(takeVehicle(state,'unknown').ok,false);
});

test('guardado malformado y manipulado se sanea y no daña a campaña o economía',()=>{
 const dirty={version:1,vehicles:[{id:'racer',damage:110},{id:'racer',damage:1},{id:'comet',damage:-4},{id:'__proto__',damage:0},null,{},...CARS.map(v=>({id:v.id,damage:'NaN'}))]};
 const clean=cleanCollection(dirty);assert.deepEqual(clean.vehicles.slice(0,2),[{id:'racer',damage:100},{id:'comet',damage:0}]);
 assert.equal(clean.vehicles.length,GARAGE_CAPACITY);
 assert.deepEqual(cleanCollection('{'),{version:1,vehicles:[]});
 assert.deepEqual(cleanCollection({version:2,vehicles:[]}),{version:1,vehicles:[]});
 const s=mock();s.setItem('chase404.side.v1',JSON.stringify({version:1,credits:900,completed:2}));s.setItem('chase404.campaign-choice.v1','x');
 assert.equal(saveCollection(s,clean),true);assert.equal(readCollection(s).vehicles.length,6);
 assert.equal(JSON.parse(s.getItem('chase404.side.v1')).credits,900);
 assert.equal(s.getItem('chase404.campaign-choice.v1'),'x');
 assert.ok(s.getItem(COLLECTION_KEY));
});

test('almacenamiento bloqueado no altera el estado, el coche ni los créditos',()=>{
 const initial=cleanCollection(null);const current=car('falcon',37);
 const proposal=parkVehicle(initial,current);
 assert.equal(saveCollection({setItem(){throw Error('quota');}},proposal.next),false);
 assert.deepEqual(initial.vehicles,[]);assert.equal(current.damage,37);
 assert.deepEqual(readCollection({getItem(){throw Error('disabled');}}).vehicles,[]);
});

test('recuperar mantiene mejoras mecánicas por modelo pero no inventa reparaciones',()=>{
 const storage=mock();let state=parkVehicle(cleanCollection(null),car('blaze',43)).next;
 assert.equal(saveCollection(storage,state),true);state=readCollection(storage);
 let stats={version:1,credits:300,completed:3,best:181};stats=purchaseUpgrade(stats,'blaze','engine').next;
 const r=takeVehicle(state,'blaze');assert.equal(r.vehicle.damage,43);
 assert.ok(tuneWithUpgrades('blaze',stats).power>1.11);
 assert.equal(tuneWithUpgrades('nova',stats).power,1.05);
 assert.deepEqual(r.vehicle,{id:'blaze',damage:43});
});


test('intercambio atómico conserva daños del coche dejado y no permite recuperar el activo',()=>{
 let state=cleanCollection(null);
 state=parkVehicle(state,car('falcon',7)).next;
 state=parkVehicle(state,car('comet',18)).next;
 const current=car('falcon',64);
 const proposal=swapParkedVehicle(state,current,'comet');
 assert.equal(proposal.ok,true);
 assert.equal(proposal.vehicle.damage,18);
 assert.equal(takeVehicle(proposal.next,'falcon').vehicle.damage,64);
 assert.equal(takeVehicle(state,'falcon').vehicle.damage,7); // immutable proposal
 assert.equal(swapParkedVehicle(state,current,'falcon').ok,false);
 assert.equal(swapParkedVehicle(state,current,'nope').ok,false);
});
