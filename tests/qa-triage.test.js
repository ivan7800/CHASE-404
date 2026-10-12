import test from 'node:test';
import assert from 'node:assert/strict';
import {makeBlank} from '../tools/manual_qa_registry.mjs';
import {triage,formatTriage} from '../tools/qa_triage.mjs';
test('ninguna prueba empieza aprobada',()=>{const s=triage(makeBlank());assert.equal(s.counts.pending,12);assert.equal(s.ready,false)});
test('fallos y bloqueos permanecen visibles sin evidencias privadas',()=>{const r=makeBlank();r.checks[0]={...r.checks[0],status:'failed',date:'2026-10-12',environment:'Windows Chrome',evidence:'contraseña privada temporal'};r.checks[1].status='blocked';const out=formatTriage(triage(r));assert.match(out,/A01 \[FAILED\]/);assert.match(out,/A02 \[BLOCKED\]/);assert.doesNotMatch(out,/contraseña privada/)});
test('aprobación sin evidencia no vale',()=>{const r=makeBlank();r.checks[0].status='passed';assert.equal(triage(r).counts.incomplete,1)});
test('doce registros documentados generan estado declarativo, no certificación automática',()=>{const r=makeBlank();for(const item of r.checks)Object.assign(item,{status:'passed',date:'2026-10-12',environment:'Windows 11 Chrome',evidence:'Resultado observado en una sesión real'});assert.equal(triage(r).ready,true);r.checks.push({id:'A99',status:'passed'});assert.equal(triage(r).ready,false)});
