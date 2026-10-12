# Fase 11.6 — Auditoría visual y relieve arquitectónico (v0.13.0)

## Alcance
- 9 portales y cornisas de Gràcia con relieve adicional.
- 8 entradas de El Carmel con jambas, marquesina y umbral.
- Sin cambios en red de calles, físicas, colisiones, controles ni misión.

## Limitación de validación
Chromium no completó siquiera la captura headless de `about:blank` en este entorno (timeout); **no se certifica apariencia visual ni FPS reales**. La calidad estética debe inspeccionarse jugando, preferentemente en día y noche.

## QA recomendado
1. En El Carmel, examinar puertas y terrazas caminando y conduciendo; descartar solapes.
2. En Gràcia, comprobar marcos, profundidad de portales y cornisas desde la calle.
3. Repetir noche/atardecer y comparar legibilidad de materiales.
4. Recorrer misiones 3, 8, 14 y 15 y medir FPS en el ordenador real.
5. Verificar controles a pie y conducción, sin regresiones.
