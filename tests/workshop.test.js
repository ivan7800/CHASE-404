import test from 'node:test';
import assert from 'node:assert/strict';
import {WORKSHOP,UPGRADE_TYPES,cleanWorkshop,upgradeLevels,tuneWithUpgrades,canUseWorkshop,repairPrice,purchaseRepair,purchaseUpgrade} from '../src/workshop.js';
import {cleanSideStats,readSideStats,saveSideStats,awardSideRun,newSideRun} from '../src/side-activities.js';
import {createUrbanCar,createCar,step,FIXED_STEP} from '../src/physics.js';

const earned=(n=125)=>({version:1,completed:1,best:180,credits:n});
const broken=(points=40)=>Object.assign(createUrbanCar(),{damage:points,vehicleId:'blaze'});

test('el taller requiere proximidad, vehículo parado y ausencia de policía',()=>{
 const b={urban:true,onFoot:false,x:WORKSHOP.x,z:WORKSHOP.z,speed:0,policeActive:false};
 assert.equal(canUseWorkshop(b),true);
 for(const changed of [{urban:false},{x:500},{z:900},{speed:1.4},{policeActive:true}])assert.equal(canUseWorkshop({...b,...changed}),false);
 assert.equal(canUseWorkshop({...b,onFoot:true,speed:100,vehicleX:WORKSHOP.x,vehicleZ:WORKSHOP.z}),true);
 assert.equal(canUseWorkshop({...b,onFoot:true,speed:0,vehicleX:WORKSHOP.x+90,vehicleZ:WORKSHOP.z}),false);
 assert.equal(canUseWorkshop({...b,x:NaN}),false);
});

test('reparación: coste, débito, sin daño, saldo insuficiente y sin mutación accidental',()=>{
 const stats=earned(125),car=broken(40),prev=structuredClone(stats);
 const proposal=purchaseRepair(stats,car);
 assert.equal(repairPrice(car),68);assert.equal(proposal.ok,true);
 assert.equal(proposal.next.credits,57);assert.equal(proposal.damage,0);
 assert.deepEqual(stats,prev);assert.equal(car.damage,40);
 assert.equal(purchaseRepair(earned(10),car).ok,false);
 assert.equal(purchaseRepair(stats,broken(0)).ok,false);
 assert.equal(purchaseRepair(stats,createCar()).ok,false);
});

test('mejoras exclusivas por modelo con máximo de dos niveles y costes progresivos',()=>{
 let st=earned(600);
 let r=purchaseUpgrade(st,'blaze','engine');assert.equal(r.ok,true);assert.equal(r.cost,125);st=r.next;
 assert.equal(st.credits,475);assert.equal(upgradeLevels(st,'blaze').engine,1);
 assert.equal(upgradeLevels(st,'falcon').engine,0);
 const base=tuneWithUpgrades('falcon',st),boost=tuneWithUpgrades('blaze',st);
 assert.ok(boost.power>1.11);assert.equal(base.power,1.18);
 r=purchaseUpgrade(st,'blaze','engine');assert.equal(r.cost,250);st=r.next;
 assert.equal(st.credits,225);assert.equal(upgradeLevels(st,'blaze').engine,2);
 assert.equal(purchaseUpgrade(st,'blaze','engine').ok,false);
 assert.equal(purchaseUpgrade(st,'noexiste','engine').ok,false);
 assert.equal(purchaseUpgrade(st,'blaze','unknown').ok,false);
 assert.ok(UPGRADE_TYPES.every(t=>t.prices.length===2));
});

test('guardado antiguo v1 migrable y niveles manipulados saneados',()=>{
 const old=earned();assert.deepEqual(cleanSideStats(old),old);
 const stats=cleanSideStats({...old,workshop:{blaze:{engine:2,steering:-1,brakes:99},unknown:{engine:2},__nothing:{brakes:1}}});
 assert.deepEqual(stats.workshop,{blaze:{engine:2,steering:0,brakes:0}});
 assert.deepEqual(cleanWorkshop({blaze:{engine:'2',steering:2.1,brakes:1}}),{blaze:{engine:0,steering:0,brakes:1}});
 assert.deepEqual(cleanSideStats('{mal json'),{version:1,completed:0,best:null,credits:0});
});

test('compra persistida sin pérdida de progreso previo y error de almacenamiento controlable',()=>{
 const map=new Map([['chase404.side.v1',JSON.stringify(earned(450))]]);
 const storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 let current=readSideStats(storage);let r=purchaseUpgrade(current,'nova','brakes');
 assert.equal(saveSideStats(storage,r.next),true);current=r.next;
 const recovered=readSideStats(storage);assert.equal(recovered.credits,325);
 assert.equal(recovered.best,180);assert.equal(recovered.completed,1);assert.equal(recovered.workshop.nova.brakes,1);
 r=purchaseUpgrade(current,'nova','brakes');assert.equal(r.cost,250);
 const failing={setItem(){throw Error('full')}};
 assert.equal(saveSideStats(failing,r.next),false); // commit does not happen: no side effects to current
 assert.equal(current.credits,325);assert.equal(readSideStats(storage).credits,325);
});

test('sin modificaciones en las físicas de los circuitos arcade',()=>{
 const car=createCar();const upgraded=earned(1000);upgraded.workshop={blaze:{engine:2,steering:2,brakes:2}};
 assert.ok(tuneWithUpgrades('blaze',upgraded).power>1.11);
 assert.equal(car.urban,undefined);step(car,{throttle:true},FIXED_STEP);
 assert.ok(car.speed>0);assert.equal(car.damage,undefined);
});

test('compras rechazan saldo adulterado sin generar crédito',()=>{
 for(const amount of [-100,NaN,'500',Infinity,1e12]){
  assert.equal(purchaseRepair({...earned(),credits:amount},broken(50)).ok,false);
  assert.equal(purchaseUpgrade({...earned(),credits:amount},'blaze','steering').ok,false);
 }
});
