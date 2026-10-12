import test from 'node:test';
import assert from 'node:assert/strict';
import {DELIVERY,SPRINT,FRAGILE,SIDE_ACTIVITIES,getSideActivity,newSideRun,startSideRun,stepSideRun,sideTarget,cleanSideStats,sideRecord,awardSideRun,readSideStats,saveSideStats} from '../src/side-activities.js';
import {CITY,nearestStreet} from '../src/city.js';

const complete=(activity,opts={})=>{
 const run=newSideRun(activity.id);assert.equal(startSideRun(run),true);
 for(const p of activity.points){assert.deepEqual(sideTarget(run),p);stepSideRun(run,{...p,onFoot:false,damageEvents:opts.damageEvents??0},.1);}
 assert.equal(run.phase,'won');return run;
};
test('catálogo de tres desafíos únicos, en carreteras existentes y con recompensas',()=>{
 assert.deepEqual(SIDE_ACTIVITIES.map(a=>a.id),['delivery-01','sprint-01','fragile-01']);
 assert.notEqual(SPRINT.reward,DELIVERY.reward);assert.notEqual(FRAGILE.reward,SPRINT.reward);
 for(const activity of SIDE_ACTIVITIES){assert.ok(activity.limit>0&&activity.reward>0);assert.ok(activity.points.length>=3);for(const p of activity.points){assert.ok(nearestStreet(p.x,p.z).distance<=2,`${activity.id}: ${p.name} está fuera de la calzada`);}}
 assert.ok(CITY.streets.length>20);
 assert.equal(getSideActivity('malformed'),DELIVERY);
});
test('sprint de cuatro sectores: victoria, récord individual y premio propio',()=>{
 const run=complete(SPRINT);const stats=cleanSideStats(null);
 assert.equal(awardSideRun(stats,run),true);assert.equal(stats.credits,180);assert.equal(stats.completed,1);
 assert.deepEqual(sideRecord(stats,SPRINT.id),{completed:1,best:run.elapsed});
 assert.equal(sideRecord(stats,DELIVERY.id).completed,0);
 assert.equal(awardSideRun(stats,run),false,'sin cobros duplicados del mismo intento');
 assert.equal(stats.credits,180);
});
test('transporte delicado permite un impacto, el segundo invalida el recorrido',()=>{
 const run=newSideRun(FRAGILE.id);startSideRun(run);
 assert.equal(stepSideRun(run,{x:0,z:0,damageEvents:4,onFoot:false},.1),'active');
 assert.equal(stepSideRun(run,{x:0,z:0,damageEvents:5,onFoot:false},.1),'active');
 assert.equal(run.impacts,1);
 assert.equal(stepSideRun(run,{x:0,z:0,damageEvents:6,onFoot:false},.1),'lost');
 assert.equal(run.phase,'lost');assert.equal(sideTarget(run),null);
 assert.equal(awardSideRun(cleanSideStats(null),run),false);
});
test('transporte delicado admite daño previo y otorga recompensa si no se supera el límite',()=>{
 const run=newSideRun(FRAGILE.id);startSideRun(run);
 for(const p of FRAGILE.points)stepSideRun(run,{...p,damageEvents:10,onFoot:false},.1);
 assert.equal(run.phase,'won');assert.equal(run.impacts,0);
 const stats=cleanSideStats(null);assert.equal(awardSideRun(stats,run),true);assert.equal(stats.credits,235);
});
test('ninguna actividad permite completar controles a pie',()=>{
 for(const a of SIDE_ACTIVITIES){const run=newSideRun(a.id);startSideRun(run);const p=a.points[0];stepSideRun(run,{...p,onFoot:true,damageEvents:0},.1);assert.equal(run.index,0);}
});
test('orden, caducidad y validación de intervalo temporal en desafío nuevo',()=>{
 const r=newSideRun(SPRINT.id);startSideRun(r);
 assert.equal(stepSideRun(r,{...SPRINT.points[1],onFoot:false},.1),'active');assert.equal(r.index,0);
 assert.throws(()=>stepSideRun(r,{x:0,z:0},.4),RangeError);
 for(let i=0;i<SPRINT.limit*10;i++)stepSideRun(r,{x:0,z:0},.1);
 assert.equal(r.phase,'lost');assert.equal(r.index,0);
});
test('guardados 0.8.2 conservan saldo, historial, mejoras y sus mejores tiempos',()=>{
 const old={version:1,completed:3,best:155,credits:400,workshop:{falcon:{engine:1,steering:0,brakes:0}}};
 const stats=cleanSideStats(old);
 assert.deepEqual(stats,old);assert.deepEqual(sideRecord(stats,DELIVERY.id),{completed:3,best:155});
 const run=complete(SPRINT);assert.equal(awardSideRun(stats,run),true);
 assert.equal(stats.credits,580);assert.equal(stats.completed,4);assert.equal(stats.best,155);
 assert.deepEqual(stats.workshop,old.workshop);assert.equal(sideRecord(stats,DELIVERY.id).completed,3,'el registro histórico no crece al completar otro desafío');
});
test('cada actividad mantiene mejor tiempo separado y se puede recuperar del almacenamiento',()=>{
 const map=new Map(),store={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 const stats=cleanSideStats(null);
 const d=complete(DELIVERY),s=complete(SPRINT),f=complete(FRAGILE);
 awardSideRun(stats,d);awardSideRun(stats,s);awardSideRun(stats,f);
 assert.equal(stats.credits,125+180+235);assert.equal(stats.completed,3);
 assert.equal(saveSideStats(store,stats),true);
 const back=readSideStats(store);assert.deepEqual(back,stats);
 for(const [run,a] of [[d,DELIVERY],[s,SPRINT],[f,FRAGILE]])assert.equal(sideRecord(back,a.id).best,run.elapsed);
});
test('datos de récord adulterados se sanean, pero no se borran las compras válidas',()=>{
 const raw={version:1,completed:0,best:null,credits:200,records:{'sprint-01':{completed:-200,best:NaN},'fragile-01':{completed:2,best:9000},__proto__:{completed:99}},workshop:{nova:{engine:2,steering:1,brakes:0}}};
 const stats=cleanSideStats(raw);assert.equal(stats.credits,200);assert.equal(stats.records['fragile-01'].completed,2);assert.equal(stats.records['fragile-01'].best,null);assert.equal(stats.records['sprint-01'],undefined);assert.equal(stats.workshop.nova.engine,2);
});
test('bloqueo de escritura se comunica y no se conceden valores almacenados falsos',()=>{
 const store={getItem:()=>null,setItem:()=>{throw Error('QuotaExceededError')}};
 const stats=cleanSideStats(null);assert.equal(saveSideStats(store,stats),false);
 assert.equal(readSideStats({getItem:()=>{throw Error('Blocked')}}).credits,0);
});

test('impacto en primer frame se cuenta gracias a la referencia al iniciar el encargo',()=>{
 const run=newSideRun(FRAGILE.id);assert.equal(startSideRun(run,0),true);
 stepSideRun(run,{x:0,z:0,damageEvents:1,onFoot:false},.1);
 assert.equal(run.impacts,1);
 stepSideRun(run,{x:0,z:0,damageEvents:2,onFoot:false},.1);
 assert.equal(run.phase,'lost');
});
