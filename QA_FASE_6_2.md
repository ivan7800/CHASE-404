# CHASE 404 — QA Fase 6.2 · Remasterización de geometría y materiales

**Versión:** 0.9.1 ALPHA · **Fecha:** 2026-10-12
**Base:** CHASE 404 v0.9.0, ZIP íntegro de Fase 6.1.
**Release gate:** NO READY; QA visual e integración real de WebGL pendientes. Sin publicación GitHub.

## Cambios auditados
1. `src/city.js`: `buildRoadFinishes` agrega parches de asfalto, juntas de pavimento y cinco franjas peatonales. No edita los puntos de calle, la lógica de colisiones ni el minimapa. Coordenadas comprobadas sobre el eje de viales.
2. `src/city.js`: `buildFacadeFinishes` enriquece **29 fachadas ya existentes** en Eixample (12), Gràcia (9) y Guinardó (8). Son volúmenes sin colisionador nuevo y no suponen interiores ni edificios adicionales.
3. `src/renderer.js`: nuevo material uniforme para superficie normal (0), carrocería (1), rueda (2). Reflejos de pintura orientados según cámara y sol, conservando el cielo y niebla de los tres ambientes. El mismo shader procesa GLB y coche de reserva.
4. `src/geometry.js`: neumático con relieve superficial lateral, compartido por coches de jugador y rivales. Cambios visuales, no de agarre ni físicas.

## Verificaciones ejecutadas
- `npm run check`: **PASS**.
- `npm test`: **230/230 PASS**, incluidas 4 pruebas nuevas de malla, geometría acotada, marcas sobre vial y señal de material enviada al renderizador.
- `npm run assets:validate`: **6/6 GLB PASS**; los binarios no se modificaron.
- `node tools/audit_project.mjs`: **PASS**; 161 identificadores HTML únicos, 41 botones con registro estático y 73 posiciones accesibles según el modelo de calles.
- `buildCity()` medido mediante Node: **273.729 → 308.619 vértices**, incremento 34.890 vértices (+12,75 %). Sigue siendo un solo mesh de ciudad sin draw calls extra para calles o fachadas.
- Servidor HTTP local con Python: **200** en `index.html`.
- Chromium headless: no produjo captura tras un intento de 16 segundos; se cerró por timeout. **No hay prueba visual válida ni compilación de shaders demostrada en GPU.**

## Lista de aceptación manual (bloquea la publicación)
1. Arrancar `INICIAR_WINDOWS.bat` o `INICIAR_LINUX.sh`, BCN → Exploración libre; recorrer Carmel, Guinardó, Gràcia, Eixample, Puerto y Montjuïc; buscar solapes, manchas que floten sobre el asfalto y señales tapadas.
2. En al menos dos cruces, inspeccionar las marcas peatonales; no deben cruzar edificios ni quedar ocultas bajo la superficie.
3. Comparar fachadas desde cerca y con cámara CHASE/WIDE para detectar relieves suspendidos o intersecciones con balcones originales.
4. Cambiar DÍA / ATARDECER / NOCHE; revisar reflejos del coche bajo diferentes direcciones de luz, y que no afecten al terreno o señales.
5. Probar los seis GLB del garaje, tráfico y policía; hacer giros, frenadas e impactos; comprobar ruedas sin artefactos ni «brillos plásticos».
6. Confirmar arcade y campaña (misión 1, 14, 15) intactos; comprobar talleres, secretos y contactos tras cambiar ambiente.
7. Medir FPS estable en Windows, Linux Mint y móvil (antes/después) y ausencia de WebGL context loss. Si hay regresión, rebajar detalles antes de continuar.

**Límite honesto:** las pruebas del renderizador utilizan mocks; solo detectan el envío de uniforms y llamadas. No garantizan la compilación GLSL, ausencia de flicker ni calidad visual. La mejora se considera **implementada, no certificada visualmente**.
