# QA — Fase 11.9 · v0.13.3 ALPHA

## Cambios
Diez elementos de calle en malla urbana (marquesinas estilizadas, armarios de servicio y jardineras), colocados mediante comprobación de distancia a toda la red vial. No cambia física, carreteras, controles ni lógica de misiones. Los seis vehículos GLB no han sido modificados.

## Comprobaciones
- Pruebas específicas `node --test tests/street-detail-11-9.test.js`: 2/2 correctas.
- `npm run check`: correcto.
- `npm run assets:validate`: 6/6 GLB correctos.
- Batería completa `npm test`: no completada en el tiempo disponible, **no certificada**.
- WebGL visual, FPS y jugabilidad real: **pendientes**.

## Nota
Los elementos son visuales y no tienen nueva colisión física; el paso al lado de una marquesina no produce obstáculo físico adicional. No se certifica apariencia real ni fidelidad histórica exacta.
