# QA — Fase 11.12 · Gael: silueta de personaje (v0.13.6)

## Cambio implementado
- Cabeza de Gael reconstruida con secciones elípticas facetadas (mandíbula, mejillas, cráneo, pelo) para eliminar la silueta cúbica de versiones anteriores.
- Brazos y piernas ahora usan secciones de 8 lados, mantienen los pivotes originales de marcha y carrera y conservan las botas y los detalles de tejido.
- Normales de los nuevos volúmenes orientadas hacia fuera. No se modificaron movimiento, conducción, colisiones, mapa ni misiones.

## Comprobaciones ejecutadas
- Pruebas focalizadas: **14/14 PASS** (modelo de Gael, personajes, renderizador y coherencia artística).
- npm run check: **PASS**.
- npm run assets:validate: **6/6 GLB PASS**.
- npm run release:gate: **PASS**.
- npm run site:prepare: **PASS** (58 archivos publicados).
- npm run acceptance:gate: **18/18 PASS**, aceptación manual pendiente.
- npm test, batería global: **no completada dentro del tiempo de ejecución**. No se considera PASS.

## Aceptación pendiente
- Vista frontal, lateral y posterior de Gael en WebGL de día y de noche; comprobar normales, sombras y cara.
- Caminar, correr, girar, pulsar C, subir y bajar del coche y animaciones de NPC en Windows y Linux.
- FPS y suavidad en móvil. Completar ambas rutas de la campaña realmente jugando.

**Estado**: ALPHA, entrega técnica para revisión visual, no release final.
