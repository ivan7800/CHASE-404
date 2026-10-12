/** Prepara y valida el sitio estático que se publicará en GitHub Pages. */
import {cpSync, mkdirSync, rmSync, readdirSync, readFileSync, existsSync, statSync} from 'node:fs';
import {join, resolve, relative, extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const site=resolve(root,'_site');
const allowed=['index.html','.nojekyll','assets','src','styles'];
const bad=[];
if (site===root || !site.startsWith(root+'/')) throw new Error('Ruta de destino insegura');
rmSync(site,{recursive:true,force:true}); mkdirSync(site);
for(const name of allowed){if(!existsSync(join(root,name)))bad.push(`Falta entrada obligatoria: ${name}`);else cpSync(join(root,name),join(site,name),{recursive:true});}
const walk=(dir)=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const full=join(dir,entry.name);return entry.isDirectory()?walk(full):[relative(site,full).replaceAll('\\','/')];});
const files=walk(site);
for(const name of files){const first=name.split('/')[0];if(!allowed.includes(first))bad.push(`Archivo no permitido: ${name}`);if(/(^|\/)(?:node_modules|tests|tools|\.git|__pycache__)(?:\/|$)/.test(name))bad.push(`Contenido de desarrollo: ${name}`);}
for(const required of ['index.html','.nojekyll','styles/main.css','src/main.js',...['blaze','comet','falcon','nova','racer-04','viper'].map(n=>`assets/models/${n}.glb`)])if(!files.includes(required))bad.push(`Recurso publicado ausente: ${required}`);
const html=readFileSync(join(root,'index.html'),'utf8');
const refs=[...html.matchAll(/(?:src|href)=["'](\.?\/?[^"'#?]+)["']/g)].map(m=>m[1]);
for (const ref of refs){const clean=ref.replace(/^\.\//,'');if(!files.includes(clean))bad.push(`Referencia HTML fuera del sitio: ${ref}`);}
for (const name of files.filter(x=>x.endsWith('.js') && x.startsWith('src/'))){const source=readFileSync(join(site,name),'utf8');for(const match of source.matchAll(/(?:import\s*(?:[^'";]*?\sfrom\s*)?|import\s*\(|export\s*[^'";]*?\sfrom\s*)['"](\.{1,2}\/[^'"]+)['"]/g)){const target=resolve(dirname(join(site,name)),match[1]);if(!target.startsWith(site+'/')||!existsSync(target))bad.push(`Import no resuelto: ${name} -> ${match[1]}`);}}
if(bad.length){console.error('SITE GATE: FALLÓ\n'+bad.map(x=>' - '+x).join('\n'));process.exitCode=1;}else console.log(`SITE GATE: OK · ${files.length} archivos · lista permitida · recursos · imports locales`);
