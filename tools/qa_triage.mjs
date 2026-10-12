/** Read-only release triage from observations supplied by the tester. */
import {readFileSync, existsSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {criteria} from './manual_qa_registry.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function triage(report){
 const checks=Array.isArray(report?.checks)?report.checks:[];
 const entries=criteria.map(([id,label])=>{
  const matches=checks.filter(x=>x?.id===id);
  const row=matches.length===1?matches[0]:null;
  const status=['passed','failed','blocked','pending'].includes(row?.status)?row.status:'pending';
  const validEvidence=typeof row?.evidence==='string'&&row.evidence.trim().length>=12&&typeof row?.environment==='string'&&row.environment.trim().length>=3&&/^\d{4}-\d{2}-\d{2}$/.test(row?.date||'')&&!Number.isNaN(Date.parse(row.date));
  const accepted=status==='passed'&&validEvidence&&matches.length===1;
  return {id,label,status:accepted?'passed':(status==='passed'?'incomplete':status),validEvidence};
 });
 const counts={passed:0,failed:0,blocked:0,pending:0,incomplete:0};
 for(const entry of entries)counts[entry.status]++;
 const unknown=checks.filter(x=>!criteria.some(([id])=>id===x?.id));
 return {entries,counts,unknown:unknown.length,ready:counts.passed===criteria.length&&unknown.length===0};
}
export function formatTriage(result){
 const lines=[`CHASE 404 · TRIAGE DE ACEPTACIÓN: ${result.ready?'12/12 declaradas aprobadas':'NO APROBADO'}`,
  `Aprobadas ${result.counts.passed}/12 · Fallidas ${result.counts.failed} · Bloqueadas ${result.counts.blocked} · Pendientes ${result.counts.pending} · Evidencia incompleta ${result.counts.incomplete}`];
 for(const entry of result.entries.filter(x=>x.status!=='passed'))lines.push(`${entry.id} [${entry.status.toUpperCase()}] ${entry.label}`);
 if(result.unknown)lines.push(`ADVERTENCIA: ${result.unknown} registros no reconocidos`);
 lines.push('Este resumen no comprueba por sí mismo que las observaciones sean auténticas. No incluye descripciones privadas de evidencias.');
 return lines.join('\n');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const path=resolve(root,process.argv[2]||'ACEPTACION_EVIDENCIAS.json');
 try{
  if(!existsSync(path)){console.log(formatTriage(triage({checks:[]})));process.exitCode=1;}
  else {const summary=triage(JSON.parse(readFileSync(path,'utf8')));console.log(formatTriage(summary));if(!summary.ready)process.exitCode=1;}
 }catch(e){console.error(`No se puede leer el acta: ${e.message}`);process.exitCode=1;}
}
