/** Evidence gate for final release. Never assumes that automated QA implies real play testing. */
import {readFileSync, existsSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const ids=Array.from({length:12},(_,i)=>`A${String(i+1).padStart(2,'0')}`);
export function checkEvidence(report){
  const rows=Array.isArray(report?.checks)?report.checks:[];
  const problems=[];
  for(const id of ids){
    const matching=rows.filter(row=>row&&row.id===id);
    if(matching.length!==1){problems.push(`${id}: se requiere un único registro`);continue;}
    const row=matching[0];
    if(row.status!=='passed')problems.push(`${id}: pendiente o no aprobado`);
    if(typeof row.evidence!=='string'||row.evidence.trim().length<12)problems.push(`${id}: falta evidencia descriptiva`);
    if(typeof row.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(row.date)||Number.isNaN(Date.parse(row.date)))problems.push(`${id}: fecha no válida`);
    if(typeof row.environment!=='string'||row.environment.trim().length<3)problems.push(`${id}: falta entorno de prueba`);
  }
  if(rows.some(row=>!ids.includes(row?.id)))problems.push('Registro de aceptación desconocido');
  return {passed:problems.length===0,problems,approved:ids.filter(id=>rows.some(row=>row?.id===id&&row.status==='passed')).length,total:ids.length};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const path=resolve(root,process.argv[2]||'ACEPTACION_EVIDENCIAS.json');
  if(!existsSync(path)){console.error('ACCEPTANCE PLAY GATE: PENDIENTE — no existe acta con pruebas reales.');process.exitCode=1;}
  else{
    try{const result=checkEvidence(JSON.parse(readFileSync(path,'utf8')));console.log(`ACCEPTANCE PLAY GATE: ${result.passed?'PASS':'PENDING'} · ${result.approved}/${result.total} criterios declarados aprobados`);for(const problem of result.problems)console.error(' -',problem);if(!result.passed)process.exitCode=1;}
    catch(error){console.error(`ACCEPTANCE PLAY GATE: acta ilegible — ${error.message}`);process.exitCode=1;}
  }
}
