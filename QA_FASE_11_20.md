# QA Fase 11.20 — Mirador escénico del Carmel · v0.14.4

## Implementado
- Nueva composición artística original sobre la ladera exterior de El Carmel: tres terrazas, pabellón con cuatro vanos, escalinata, farolas y jardineras.
- Añadido `CARMEL_PANORAMA_1120` y la nueva pasada a la malla urbana, con incremento medido de 367.341 a 369.114 vértices (+1.773, +0,48 %).
- No se han cambiado calles, colisiones, vehículos, física, controles, misiones ni guardados.

## Validación realizada
- `npm run check`: PASS.
- `npm test`: **394/394 PASS** (incluidas dos pruebas específicas nuevas).
- `npm run assets:validate`: PASS.
- `npm run release:gate`: PASS.
- `npm run site:prepare`: PASS.
- `npm run acceptance:gate`: **18/18 PASS**; aceptación manual pendiente.

## Limitaciones
- No se ha realizado una inspección WebGL reproducible ni se han medido FPS reales en esta versión.
- La decoración no incluye nuevas colisiones ni crea una ruta peatonal funcional hasta el mirador; es un punto de interés visual exterior.
- Las quince misiones y ambos finales siguen pendientes de aceptación jugable manual.

## Comprobación manual recomendada
En Barcelona / Exploración libre, circular hacia la curva oriental del Carmel y examinar el nuevo mirador de día y al atardecer; comprobar si sus escaleras y pabellón parecen integrados y que el rendimiento no empeora notablemente. Repetir pruebas de conducción y paseo a pie.
