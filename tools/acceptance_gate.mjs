/** Fase 10.4: acceptance is evidence-based. Automated approval never means playable approval. */
import {existsSync,readFileSync,readdirSync,statSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const site=join(root,'_site');
const version=JSON.parse(readFileSync(join(root,'package.json'),'utf8')).version;
const checks=[];
const add=(name,pass,note='')=>checks.push({name,pass:Boolean(pass),note});
const required=['index.html','src/main.js','styles/main.css','.nojekyll',...['blaze','comet','falcon','nova','racer-04','viper'].map(x=>`assets/models/${x}.glb`)];
add('Staging generated',existsSync(site)&&statSync(site).isDirectory(),'Run npm run site:prepare first');
if(existsSync(site)){
  for(const file of required)add(`Resource ${file}`,existsSync(join(site,file)));
  const entries=readdirSync(site);
  add('Publish allowlist',entries.every(e=>['index.html','.nojekyll','assets','src','styles'].includes(e)));
  add('No development files',!['tests','tools','package.json','README.md','.github'].some(x=>entries.includes(x)));
  add('Staged index matches source',readFileSync(join(site,'index.html')).equals(readFileSync(join(root,'index.html'))));
}
add('Version in README',readFileSync(join(root,'README.md'),'utf8').includes(version));
add('LICENSE exists',existsSync(join(root,'LICENSE')));
add('Manual QA checklist available',existsSync(join(root,'ACEPTACION_MANUAL.md')));
add('Manual-only deployment',readFileSync(join(root,'.github/workflows/deploy-pages.yml'),'utf8').includes('workflow_dispatch'));
const passed=checks.every(c=>c.pass);
const manual=['Campaña: misiones 1–15 completadas en una partida real','Final A: salvar al hermano y terminar misión 15','Final B: recuperar pruebas y terminar misión 15','Conducción, caminar, diálogos y 47 botones probados en navegador','Windows y Linux Mint: arranque y sonido probados','Móvil: controles táctiles, legibilidad y orientación','FPS y memoria medidos en una sesión larga'];
const report={project:'CHASE 404',version,technicalStatus:passed?'PASS':'FAIL',releaseStatus:'PENDING_MANUAL_ACCEPTANCE',checks,manualPending:manual};
writeFileSync(join(root,'ACEPTACION_TECNICA.json'),JSON.stringify(report,null,2)+'\n');
console.log(`ACCEPTANCE GATE: ${report.technicalStatus} · ${checks.filter(c=>c.pass).length}/${checks.length} · ${report.releaseStatus}`);
for(const c of checks.filter(c=>!c.pass)) console.error('FAIL:',c.name,c.note);
if(!passed)process.exitCode=1;
if(process.argv.includes('--require-manual')){console.error('Final release NOT certified: human-play evidence is not supplied.');process.exitCode=1;}
