/** Offline validation of GLB for the actual WebGL1 importer, no external deps. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeGLB } from '../src/glb.js';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dir = resolve(root, process.argv[2] || 'assets/models');
if (!dir.startsWith(root + '/') || !existsSync(dir)) {
  console.error('Directorio no válido o inexistente:', dir); process.exit(2);
}
const files = readdirSync(dir).filter(f => f.toLowerCase().endsWith('.glb'));
if (!files.length) { console.error('No hay archivos GLB para validar en', dir); process.exit(2); }
let failed = 0;
for (const file of files) {
  try {
    const raw = readFileSync(join(dir, file));
    const ab = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
    const {positions, normals, colors, count} = decodeGLB(ab);
    if (count % 3 || !count || positions.length !== count*3 || normals.length !== count*3 || colors.length !== count*3) throw Error('Atributos inválidos');
    if (!positions.every(Number.isFinite) || !normals.every(Number.isFinite)) throw Error('Coordenadas no finitas');
    console.log(`OK ${file}: ${(count / 3).toLocaleString('es-ES')} triángulos, ${(raw.length / 1024).toFixed(1)} KiB`);
  } catch (err) { failed++; console.error(`ERROR ${file}: ${err.message}`); }
}
console.log(`Validación GLB: ${files.length - failed}/${files.length} correctos`);
if (failed) process.exitCode = 1;
