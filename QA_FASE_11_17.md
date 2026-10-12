# QA Fase 11.17 — Gael, ropa y silueta

Se cambió `src/gael-model.js` y se regeneraron los seis GLB con `npm run gael:build`. Se conservaron los pivotes de hombros y caderas y las funciones de animación. Comprobación de igualdad exacta entre mallas fuente y GLB exportados.

La validación WebGL visual, los FPS y las partidas completas siguen pendientes. No equivale a un personaje con skinning/animaciones glTF nativas.

## Resultados automatizados
- npm test: 387/387 OK.
- npm run check: OK.
- npm run assets:validate: 6/6 GLB vehículos OK.
- tests/gael-glb.test.js: coincidencia exacta de 6/6 GLB de Gael.
- npm run release:gate: OK.
- npm run acceptance:gate: 18/18 técnicos; manual pendiente.
