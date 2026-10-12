import test from 'node:test';
import assert from 'node:assert/strict';
import {checkEvidence} from '../tools/manual_evidence_gate.mjs';
const complete=()=>({checks:Array.from({length:12},(_,i)=>({id:`A${String(i+1).padStart(2,'0')}`,status:'passed',date:'2026-10-12',environment:'Windows 11 + Chrome',evidence:'Probado en sesión real; archivo capturado y conservado'}))});
test('all documented evidence passes',()=>assert.equal(checkEvidence(complete()).passed,true));
test('incomplete evidence is rejected',()=>{const v=complete();v.checks[4].evidence='';assert.equal(checkEvidence(v).passed,false);});
test('missing and duplicate acceptance rows are rejected',()=>{const v=complete();v.checks.push({...v.checks[0]});v.checks.splice(2,1);assert.equal(checkEvidence(v).passed,false);});
test('pending and invalid date cannot pass',()=>{const v=complete();v.checks[0].status='pending';v.checks[1].date='unknown';assert.equal(checkEvidence(v).passed,false);});
