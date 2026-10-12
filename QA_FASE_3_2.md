# CHASE 404 — QA Fase 3.2 (v0.5.1 ALPHA)

## Cambios integrados
- Tráfico con aceleración/frenada progresiva, detección de ocupación en ruta y cesión simple en extremos de ruta.
- Primera patrulla policial urbana: activación tras 3 s de velocidad superior a 85 km/h, aproximación al conductor, detención condicionada a baja velocidad y escape si se mantiene distancia.
- Avisos de persecución en panel de misión; patrulla representada mediante el vehículo rival existente.

## Verificaciones ejecutadas
- `npm run check` — exit 0.
- `npm test` — exit 0 — 82/82 pruebas PASS.
- `npm run assets:validate` — exit 0 — 6/6 GLB válidos.
- `unzip -t` — verificar tras empaquetado.

## Limitaciones conocidas
- La patrulla todavía persigue mediante dirección directa, no navegación por calles ni respeto de obstáculos; puede atravesar edificios o espacios no transitables.
- Tráfico todavía sin malla de intersecciones ni semáforos modelados; la prioridad es una aproximación en extremos de calle y necesita afinado visual.
- Los vehículos todavía no tienen colisiones físicas mutuas.
- Patrulla usa el modelo genérico de rivales, sin sirena, rotativos ni librea policial definitiva.
- Inspección visual WebGL, rendimiento y pruebas en Windows/Linux Mint siguen pendientes; no afirmar que funcionan sin prueba real.
- Fase 2 sigue pendiente de validación visual y de FPS. Fase 3 NO terminada.

## Siguiente bloque
- Navegación policial sobre carreteras, semáforos y cruces, colisiones urbanas, vehículos estacionados, cambios de coche y más misiones.
