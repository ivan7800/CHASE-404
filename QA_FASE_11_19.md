# QA Fase 11.19 — Siluetas urbanas · v0.14.3

## Alcance
- En `src/city.js`, nueva pasada de cubiertas para nueve fachadas de Gràcia y ocho casas de El Carmel.
- Chimeneas, antenas, depósitos y remates con geometría sobre edificios ya existentes.
- No se alteraron rutas, colisiones, controles, vehículos, misiones ni persistencia.

## Resultados en entorno de desarrollo
- `node --test tests/*.test.js`: **392/392 PASS**.
- `npm run check`: PASS.
- `npm run assets:validate`: PASS, 12 GLB (seis coches y seis piezas de Gael).
- `npm run release:gate`: PASS.
- `npm run site:prepare`: PASS.
- `npm run acceptance:gate`: 18/18 PASS; aceptación manual pendiente.
- Geometría urbana `buildCity().count`: **367341 vértices**.

## Límites
- No se ha certificado el resultado en una sesión WebGL real ni el rendimiento por FPS.
- No se ha completado manualmente la campaña y los dos finales en esta versión.
- El proyecto permanece ALPHA, sin publicación en GitHub.

## Inspección manual recomendada
1. Recorrer El Carmel y Gràcia con luz de día y de atardecer.
2. Comparar perfiles de cubiertas vistos desde la cámara CHASE y desde calles en pendiente.
3. Confirmar que no haya chimeneas flotando o superpuestas en los tejados.
4. Medir FPS en ALTO y ECO cerca de las calles remasterizadas.
5. Verificar que salir del coche y caminar conservan el comportamiento previo.
