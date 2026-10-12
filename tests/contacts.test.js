import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CONTACTS,CONTACT_RADIUS,nearestContactAction,acceptContact,collectContactEvidence,finishContact,contactStage,contactProgress,cleanContacts,contactOutcome} from '../src/contacts.js';
import {cleanSideStats,saveSideStats,readSideStats} from '../src/side-activities.js';
import {nearestStreet,buildCity} from '../src/city.js';
import {claimDiscovery,DISCOVERIES} from '../src/discoveries.js';
import {purchaseUpgrade} from '../src/workshop.js';
const initial=()=>cleanSideStats({version:1,completed:2,best:145,credits:200,workshop:{falcon:{engine:1,steering:0,brakes:0}},discoveries:['gracia-photo']});
const conditions={onFoot:true,policeActive:false};
const proceed=(c,s=initial(),choice='entregar')=>{
 const a=acceptContact(s,c.id,c,conditions);assert.equal(a.ok,true);const b=collectContactEvidence(a.next,c.id,c.location,conditions);assert.equal(b.ok,true);
 const d=finishContact(b.next,c.id,choice,c,conditions);assert.equal(d.ok,true);
 return {accepted:a.next,found:b.next,finished:d.next,reward:d.reward};
};
test('tres contactos originales, con pista separada del personaje y conectados a calles',()=>{
 assert.equal(CONTACTS.length,3);assert.equal(new Set(CONTACTS.map(c=>c.id)).size,3);
 for(const c of CONTACTS){assert.ok(c.lead.length>55&&c.evidence.length>70&&c.finish.length>50);assert.ok(c.reward>=100);
  for(const p of [c,c.location])assert.ok(nearestStreet(p.x,p.z).distance<=1,`${c.id}: localización fuera de la calle`);
  assert.ok(Math.hypot(c.x-c.location.x,c.z-c.location.z)>CONTACT_RADIUS*3);
 }
 assert.ok(buildCity().count>5000);
});
test('encargo de Manel completo: aceptar, buscar prueba y elegir entregar',()=>{
 const c=CONTACTS[0],st=initial();assert.equal(contactStage(st,c.id),'new');
 const {accepted,found,finished,reward}=proceed(c,st);assert.equal(reward,c.reward);
 assert.equal(contactStage(accepted,c.id),'active');assert.equal(contactStage(found,c.id),'found');assert.equal(contactStage(finished,c.id),'done');
 assert.equal(finished.contacts[c.id].choice,'entregar');assert.equal(finished.credits,st.credits+c.reward);
 assert.equal(st.credits,200,'las transacciones no mutan el objeto original');
 assert.equal(finishContact(finished,c.id,'entregar',c,conditions).ok,false,'nunca se repite la recompensa');
 assert.deepEqual(finished.workshop,st.workshop);assert.deepEqual(finished.discoveries,st.discoveries);assert.equal(finished.completed,2);
});
test('ambas decisiones generan consecuencias y premios distintos sin alterar campaña',()=>{
 for(const c of CONTACTS){const delivered=proceed(c,initial(),'entregar'),copied=proceed(c,initial(),'copiar');
  assert.equal(delivered.reward,c.reward);assert.equal(copied.reward,c.reward-20);
  assert.equal(delivered.finished.contacts[c.id].choice,'entregar');assert.equal(copied.finished.contacts[c.id].choice,'copiar');
  assert.equal(copied.finished.credits,200+c.reward-20);
  assert.notEqual(contactOutcome(c.id,'entregar'),contactOutcome(c.id,'copiar'));
 }
});
test('se requieren estado y localización correctos en cada etapa',()=>{
 const c=CONTACTS[1],st=initial();
 assert.equal(collectContactEvidence(st,c.id,c.location,conditions).ok,false);
 assert.equal(finishContact(st,c.id,'copiar',c,conditions).ok,false);
 const a=acceptContact(st,c.id,c,conditions);
 assert.equal(acceptContact(a.next,c.id,c,conditions).ok,false);
 assert.equal(finishContact(a.next,c.id,'entregar',c,conditions).ok,false);
 assert.equal(collectContactEvidence(a.next,c.id,c,conditions).ok,false);
 assert.equal(collectContactEvidence(a.next,c.id,c.location,conditions).ok,true);
 const b=collectContactEvidence(a.next,c.id,c.location,conditions).next;
 assert.equal(collectContactEvidence(b,c.id,c.location,conditions).ok,false);
 assert.equal(finishContact(b,c.id,'falsa',c,conditions).ok,false);
 assert.equal(finishContact(b,c.id,'entregar',c,conditions).ok,true);
});
test('no se permite hablar desde el coche, desde lejos ni con persecución',()=>{
 const c=CONTACTS[2],st=initial();
 assert.equal(acceptContact(st,c.id,c,{onFoot:false}).ok,false);
 assert.equal(acceptContact(st,c.id,c,{onFoot:true,policeActive:true}).ok,false);
 assert.equal(acceptContact(st,c.id,{x:c.x+20,z:c.z},conditions).ok,false);
 assert.equal(acceptContact(st,c.id,{x:NaN,z:c.z},conditions).ok,false);
 assert.equal(acceptContact(st,'desconocido',c,conditions).ok,false);
 assert.equal(nearestContactAction(c,st).contact.id,c.id);
 assert.equal(nearestContactAction(c,st).kind,'person');
 assert.equal(nearestContactAction(c.location,st),null,'prueba inactiva todavía no aparece');
 const a=acceptContact(st,c.id,c,conditions).next;
 assert.equal(nearestContactAction(c.location,a).kind,'evidence');
 assert.equal(nearestContactAction({x:Infinity,z:0},a),null);
 assert.equal(nearestContactAction({x:9999,z:9999},a),null);
});
test('sanitización: solo IDs y etapas válidos, sin contaminación de prototipos',()=>{
 const raw=Object.create(null);raw.manel={stage:'done',choice:'copiar'};raw.clara={stage:'done',choice:'falsa'};raw.nuria={stage:'found',choice:'entregar'};
 raw['__proto__']={stage:'done',choice:'copiar'};
 const cleaned=cleanContacts(raw);
 assert.deepEqual(cleaned,{manel:{stage:'done',choice:'copiar'},nuria:{stage:'found',choice:null}});
 assert.deepEqual(cleanContacts([]),{});assert.deepEqual(cleanContacts('not-json'),{});
 assert.deepEqual(cleanContacts({manel:{stage:'bogus',choice:'entregar'}}),{});
});
test('tres historias independientes, progreso 3/3 y persistencia sin perder récords',()=>{
 let st=initial();for(const [i,c] of CONTACTS.entries()){st=proceed(c,st,i===1?'copiar':'entregar').finished;
  assert.deepEqual(contactProgress(st),{done:i+1,total:3});
 }
 const values=new Map(),store={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 assert.equal(saveSideStats(store,st),true);const reloaded=readSideStats(store);assert.deepEqual(reloaded,st);
 assert.equal(reloaded.completed,2);assert.equal(reloaded.best,145);assert.equal(reloaded.credits,200+100+95+130);
});
test('guardado bloqueado no cobra ni marca misiones como terminadas',()=>{
 const st=initial(),c=CONTACTS[0];const proposal=acceptContact(st,c.id,c,conditions);
 const store={getItem:()=>null,setItem:()=>{throw Error('Quota exceeded')}};
 assert.equal(saveSideStats(store,proposal.next),false);
 assert.equal(contactStage(st,c.id),'new');assert.equal(contactStage(readSideStats(store),c.id),'new');
 const copied=proceed(c,st,'copiar');assert.equal(saveSideStats(store,copied.finished),false);assert.equal(st.credits,200);
});
test('taller y hallazgos mantienen la progresión de contactos',()=>{
 const c=CONTACTS[0],st=proceed(c).finished;
 const found=claimDiscovery(st,DISCOVERIES[0].id,DISCOVERIES[0],conditions);assert.equal(found.ok,true);
 const upgraded=purchaseUpgrade(found.next,'falcon','steering');assert.equal(upgraded.ok,true);
 assert.deepEqual(cleanSideStats(upgraded.next).contacts,st.contacts);
 assert.equal(cleanSideStats(upgraded.next).credits,st.credits+45-125);
});
test('UI: controles, diálogos y pistas vinculados; sin IDs duplicados',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');const js=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 for(const id of ['contactOverlay','contactTitle','contactActions','contactEntries','contactHint','contactJournalBtn','contactInteract','contactClose','contactContinue']){
  assert.ok(html.includes(`id="${id}"`));assert.ok(js.includes(`$('${id}')`),`${id} referenciado`);
 }
 assert.ok(js.includes("$('contactJournalBtn').addEventListener('click',contactJournal)"));
 assert.ok(js.includes("$('contactInteract').addEventListener('click',contactInteract)"));
 assert.ok(js.includes("if(code==='KeyN')contactInteract()"));
 assert.ok(js.includes("if(code==='KeyJ')contactJournal()"));
 assert.match(js,/!contactOpen(?:&&!storyOpen)?\)\{acc\+=delta/);
});
