/** Manual QA registry. Records user-supplied observations; never manufactures evidence. */
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const criteria=Object.freeze([
['A01','Arranque Windows'],['A02','Arranque Linux Mint'],['A03','Conducción y movimiento a pie'],['A04','Campaña completa 15 misiones'],['A05','Final familia'],['A06','Final pruebas'],['A07','Sistemas secundarios y guardados'],['A08','Pausa, ayuda, diálogos y botones'],['A09','Iluminación, cámaras y sonido'],['A10','Móvil y rotación'],['A11','Sesión 30 min: FPS y RAM'],['A12','GitHub Pages bajo subruta']]);
const allowed=new Set(['pending','passed','failed','blocked']);
export function makeBlank(){return {project:'CHASE 404',note:'Los resultados solo pueden basarse en pruebas observadas por una persona.',checks:criteria.map(([id,label])=>({id,label,status:'pending',date:'',environment:'',evidence:''}))};}
export function updateReport(report,{id,status,date,environment,evidence}){
 if(!criteria.some(([key])=>key===id))throw Error('ID desconocido');
 if(!allowed.has(status))throw Error('Estado inválido: pending, passed, failed, blocked');
 if(status!=='pending'){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||!Number.isFinite(Date.parse(date)))throw Error('Fecha requerida (AAAA-MM-DD)');
  if(!environment||environment.trim().length<3)throw Error('Indica equipo, sistema y navegador');
  if(!evidence||evidence.trim().length<12)throw Error('Describe el resultado y la evidencia observada (mínimo 12 caracteres)');
 }
 const next=structuredClone(report);
 const row=next.checks?.find(r=>r.id===id);if(!row)throw Error('Falta criterio en el acta');
 Object.assign(row,{status,date:status==='pending'?'':date,environment:status==='pending'?'':environment,evidence:status==='pending'?'':evidence});return next;
}
export function summarize(report){const counts={passed:0,failed:0,blocked:0,pending:0};for(const [id] of criteria){const row=report.checks?.find(r=>r.id===id);counts[allowed.has(row?.status)?row.status:'pending']++;}return counts;}
function usage(){return 'Uso: node tools/manual_qa_registry.mjs init|list|record [--id A03 --status passed|failed|blocked|pending --date AAAA-MM-DD --environment "Windows 11, Chrome" --evidence "Descripción de prueba real"] [--file ruta.json]';}
export function run(argv){const [cmd,...opts]=argv;const flags={};for(let i=0;i<opts.length;i++){if(opts[i].startsWith('--'))flags[opts[i].slice(2)]=opts[++i];}
 const file=resolve(root,flags.file||'ACEPTACION_EVIDENCIAS.json');
 if(cmd==='init'){if(existsSync(file))throw Error('El acta ya existe: no se sobrescribe');writeFileSync(file,JSON.stringify(makeBlank(),null,2)+'\n');return `Acta creada: ${file} (12 pendientes)`;}
 if(!existsSync(file))throw Error('No hay acta. Primero ejecuta: npm run qa:manual -- init');
 const report=JSON.parse(readFileSync(file,'utf8'));
 if(cmd==='list'){const rows=criteria.map(([id,label])=>{const r=report.checks.find(x=>x.id===id);return `${id}  ${(r?.status||'pending').padEnd(7)} ${label}`;});const s=summarize(report);return rows.join('\n')+`\nAprobadas ${s.passed}/12 · Fallidas ${s.failed} · Bloqueadas ${s.blocked} · Pendientes ${s.pending}`;}
 if(cmd==='record'){const next=updateReport(report,flags);writeFileSync(file,JSON.stringify(next,null,2)+'\n');return `Guardado ${flags.id}: ${flags.status}. No implica aceptación final.`;}
 throw Error(usage());
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{console.log(run(process.argv.slice(2)));}catch(e){console.error(e.message+'\n'+usage());process.exitCode=1;}}
