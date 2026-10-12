/** CHASE 404 - puerta de distribución, reproducible sin red ni dependencias. */
import {readFileSync, existsSync, statSync} from 'node:fs';
import {join, resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(join(root,p),'utf8');
const pkg=JSON.parse(read('package.json'));
const html=read('index.html');
const errors=[];
const check=(yes,message)=>{if(!yes)errors.push(message);};
const mandatory=['index.html','styles/main.css','src/main.js','local_server.py','INICIAR_WINDOWS.bat','INICIAR_LINUX.sh','README.md','CHANGELOG.md','QA_FASE_9_6.md','QA_FASE_10_1.md','QA_FASE_10_2.md','QA_FASE_10_3.md','tools/prepare_site.mjs','PRIMER_ARRANQUE.md','tools/first_run_check.py','LICENSE','.nojekyll','PUBLISH_GITHUB_PAGES.md','.github/workflows/quality.yml','.github/workflows/deploy-pages.yml'];
for(const file of mandatory)check(existsSync(join(root,file))&&statSync(join(root,file)).isFile(),`Archivo obligatorio ausente: ${file}`);
check(/^\d+\.\d+\.\d+$/.test(pkg.version),'Versión semántica inválida');
check(html.includes(`v${pkg.version}`),'La versión visible de portada no coincide con package.json');
for(const label of html.matchAll(/\bv(\d+\.\d+\.\d+)\b/g))check(label[1]===pkg.version,`Versión obsoleta en index.html: v${label[1]}`);
check(/type=["']module["']\s+src=["']\.\/src\/main\.js["']/.test(html)||/src=["']\.\/src\/main\.js["']\s+type=["']module["']/.test(html),'Falta carga del módulo principal');
check(!/\b(?:src|href)=["']https?:\/\//i.test(html),'La página principal depende de recursos externos');
for(const m of html.matchAll(/(?:src|href)=["'](\.\/[^"']+)["']/g))check(existsSync(join(root,m[1])),`Recurso HTML no existe: ${m[1]}`);
check(read('INICIAR_WINDOWS.bat').includes('local_server.py'),'Lanzador Windows no llama al servidor local');
check(read('INICIAR_LINUX.sh').includes('local_server.py'),'Lanzador Linux no llama al servidor local');
check(read('.github/workflows/deploy-pages.yml').includes('workflow_dispatch') && !/\n  push:/.test(read('.github/workflows/deploy-pages.yml')),'Deploy no es exclusivamente manual');
check(read('local_server.py').includes('127.0.0.1'),'Servidor local no está limitado a loopback');
for(const name of ['blaze','comet','falcon','nova','racer-04','viper'])check(existsSync(join(root,`assets/models/${name}.glb`)),`GLB ausente: ${name}`);
if(errors.length){console.error('RELEASE GATE: FALLÓ\n'+errors.map(x=>' - '+x).join('\n'));process.exitCode=1;}
else console.log(`RELEASE GATE: OK · versión ${pkg.version} · ${mandatory.length} ficheros críticos · 6 GLB · recursos locales · lanzadores presentes`);
