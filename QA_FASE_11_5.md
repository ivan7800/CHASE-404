# Fase 11.5 — Coherencia artística · v0.12.9

## Cambios
- Se añade `src/art-direction.js`: escala de puertas de 3,05 m, anchura 1,95 m, referencia humana 2,10 m y paleta mineral/cerámica/herrería compartida.
- Se ajustan las puertas decorativas de El Carmel y Gràcia a la misma escala, con zócalos y marcos cromáticamente coherentes. Cada barrio conserva su arquitectura diferenciada.
- No se alteran colisiones, controles, carreteras, físicas, misiones ni archivos de guardado.

## Pruebas realmente ejecutadas
- Sintaxis `npm run check`: superada.
- `node --test tests/art-coherence-11-5.test.js`: 2/2.
- `npm run assets:validate`: 6/6 GLB.
- `npm run release:gate`: superada.
- `npm run site:prepare`: 57 ficheros publicables.
- Batería global: iniciada, pero agotó el tiempo del entorno antes de completarse. **No se certifica como aprobada en esta entrega.**

## Pendiente
- Ejecución completa de todos los tests sin limitación temporal.
- Comprobar visualmente proporciones, accesos, cámara y rendimiento real en Windows/Linux.
- Aceptación jugable y ambos finales.
