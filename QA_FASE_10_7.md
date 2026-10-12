# Fase 10.7 — Registro de pruebas jugables · v0.12.3

## Implementado
- Registro de aceptación desde terminal: `npm run qa:manual -- init|list|record`.
- Crea los doce criterios **pendientes** por defecto y nunca sobrescribe un registro existente.
- Para resultados no pendientes exige fecha, entorno y evidencia descriptiva; admite `passed`, `failed`, `blocked` y `pending`.
- Conserva la puerta de aceptación final, que sigue bloqueada sin doce verificaciones reales aprobadas.
- No se modifican físicas, conducción, personajes, campaña ni guardados.

## Resultados comprobados
- `npm test`: 336/336 pruebas automáticas aprobadas.
- `npm run check`: sintaxis correcta.
- `npm run assets:validate`: 6/6 GLB.
- `node tools/release_gate.mjs`: correcta.
- `npm run site:prepare`: 55 recursos permitidos.
- `npm run acceptance:gate`: 18/18 con estado PENDING_MANUAL_ACCEPTANCE.

## Pendiente / no certificado
- Prueba visual, auditiva y de conducción real; 15 misiones y ambos desenlaces jugados.
- FPS y memoria reales; compatibilidad física con Windows, Linux y móvil; despliegue en GitHub Pages.
- No se ha ejecutado ni autorizado una publicación.
