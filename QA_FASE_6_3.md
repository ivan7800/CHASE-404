# CHASE 404 · QA de Fase 6.3 — Cámara cinematográfica

**Versión:** 0.9.2 ALPHA · **Fecha:** 2026-10-12 · **Base:** ZIP íntegro v0.9.1.  
**Puerta de publicación:** **NO READY**, por pruebas visuales de navegador y FPS pendientes. No subir a GitHub.

## Entrega implementada

- `src/camera-rig.js` (nuevo) calcula el seguimiento de CHASE/WIDE/BONNET y cámara a pie: cámara adelantada en dirección de marcha, elevación según calle, distancia/FOV reactivos a velocidad, desplazamiento y giro sutil en derrapes. La geometría, vehículos, físicas y misiones no cambian.
- Suavizado exponencial dependiente del delta de render (limitado a 50 ms), FOV acotado a 50°–80°, balanceo máximo de 0,04 rad y vibración máxima de ±0,3 metros tras impacto.
- `src/renderer.js` utiliza el nuevo rig para formar la matriz de cámara de WebGL y permite notificar impactos físicos; reinicia el rig al cambiar pista, modo o punto de vista.
- `src/main.js` conecta contactos con tráfico, golpes contra barreras y comienzo de contacto en arcade a una señal de impacto cinematográfico. El destello de impacto se produce una vez por evento y no se reactiva continuamente por permanecer junto a una pared.
- Efectos off/reducidos bloquean vibración/roll y zoom dinámico y eliminan destellos. Se mantienen las partículas anteriores, la HUD, las teclas y los seis modelos.

## Comprobaciones automáticas

1. `npm run check`: correcto (incluido `camera-rig.js`).
2. `npm test`: **239/239** pruebas Node aprobadas (230 previas + 9 nuevas de cámara, límites, accesibilidad y conexión de eventos).
3. `npm run assets:validate`: **6/6 GLB**, todos válidos.
4. `node tools/audit_project.mjs`: correcto (161 IDs únicos, 41 botones registrados, 73 puntos de mapa accesibles).
5. Servidor local Python `http.server`: `HEAD /index.html` respondió **HTTP 200**.
6. Chromium headless: terminó en timeout tras ~14 s, **sin captura**. **No se ha certificado compilación real de shaders, visibilidad de cámara ni FPS**. El análisis estático y los mocks no sustituyen a jugar.

## Riesgos y límites restantes

- Cámara puede atravesar geometría de fachadas en puntos muy estrechos; no existe colisión de cámara contra edificios. Requiere recorrido manual antes de decidir si se añade oclusión.
- Aunque la vibración es pequeña y breve, hay que probar confort en pantallas pequeñas y sensibilidad al mareo en usuarios reales.
- Los 15 capítulos, desafíos, garaje, taller y contactos no han sido repetidos manualmente en esta sesión; las pruebas existentes de su lógica sí han pasado.
- Sin mediciones FPS en Windows, Linux Mint o móvil; no atribuir mejoras de rendimiento que no se hayan medido.

**Resultado:** Fase 6.3 implementada, QA automatizada correcta, **validación final bloqueada**.
