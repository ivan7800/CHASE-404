# QA — Fase 11.18 · Gael: rostro, manos y calzado

Versión 0.14.2 ALPHA.

## Cambios
- Nariz, pómulos, mentón y pupilas con volúmenes diferenciados.
- Manos facetadas con pulgar y tres dedos representados.
- Zapatos con perfil de talón, puntera y suela diferenciados.
- Seis piezas GLB modulares regeneradas, conservando pivotes y animaciones.
- Sin cambios de físicas, controles o red vial.

## Verificaciones ejecutadas
- `npm test`: **389/389 aprobadas**.
- `npm run check`: correcto.
- `npm run assets:validate`: correcto.
- `npm run release:gate`: correcto.
- `npm run site:prepare`: 64 archivos publicables.
- `npm run acceptance:gate`: **18/18**, aceptación manual pendiente.
- Pruebas específicas `tests/gael-detail-11-18.test.js`: 2/2.

## Pendiente
- Validar aspecto de rostro y manos en WebGL real, en diferentes distancias de cámara.
- Validar caminar/correr y entrada en coche jugando.
- FPS en Windows, Linux Mint y móvil.
- Campaña real completa y ambos finales.
