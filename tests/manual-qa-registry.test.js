import test from 'node:test';import assert from 'node:assert/strict';
import {makeBlank,updateReport,summarize} from '../tools/manual_qa_registry.mjs';
import {checkEvidence} from '../tools/manual_evidence_gate.mjs';
test('plantilla de aceptación no inventa aprobaciones',()=>{const r=makeBlank();assert.equal(r.checks.length,12);assert.equal(summarize(r).pending,12);assert.equal(checkEvidence(r).passed,false);});
test('no acepta una aprobación sin evidencia real descrita',()=>{const r=makeBlank();assert.throws(()=>updateReport(r,{id:'A01',status:'passed',date:'2026-10-12',environment:'Windows',evidence:'ok'}));assert.equal(r.checks[0].status,'pending');});
test('anota el resultado sin alterar el acta original',()=>{const r=makeBlank();const n=updateReport(r,{id:'A03',status:'failed',date:'2026-10-12',environment:'Windows 11 Chrome',evidence:'La tecla D desplaza el personaje a la izquierda'});assert.equal(r.checks[2].status,'pending');assert.equal(n.checks[2].status,'failed');assert.equal(summarize(n).failed,1);assert.equal(checkEvidence(n).passed,false);});
test('no puede borrar un registro desconocido ni forzar estado arbitrario',()=>{assert.throws(()=>updateReport(makeBlank(),{id:'A99',status:'passed'}));assert.throws(()=>updateReport(makeBlank(),{id:'A01',status:'approved'}));});
