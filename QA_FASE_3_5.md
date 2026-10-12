# QA FASE 3.5 · v0.5.4 ALPHA

Comprobación automatizada: `npm run check` y `npm test` (95/95 PASS); `npm run assets:validate` (6/6 GLB). La lógica de peatón se comprueba en `tests/on-foot.test.js`: prohíbe bajarse en marcha, entrar en coche en marcha, permite bajar/caminar/entrar y apropiarse de tráfico parado. No se ha certificado comportamiento visual, FPS, E2E en Windows/Linux ni una partida completa en navegador. La ausencia de esas pruebas NO debe interpretarse como aprobación total.

Riesgos conocidos: avatar esquemático sin animaciones; entrar en coches de tráfico usa física/modelo seleccionado previamente; la patrulla persigue la posición del vehículo aun cuando Gael está caminando; peatones no tienen colisión con el tráfico. La fase 3 permanece abierta.
