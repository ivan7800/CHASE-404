# QA — Fase 4.6 / v0.6.5

## Implementación
- Misión 06: «El hombre del mirador» con vigilancia de 8 s, ruta de escape y entrega.
- La vigilancia exige vehículo detenido (velocidad <= 3 km/h), reinicia la observación si se abandona el lugar o se camina.
- HUD indica progreso de vigilancia y selección secuencial de misión 06.

## Limitaciones
- Vigilancia basada en posición/velocidad, todavía sin NPC animado ni escena dialogada.
- No se ha demostrado la jugabilidad visual ni medido FPS en Windows/Linux.
- La fase 4 y la campaña completa no están terminadas.

## Pruebas
Ejecutar `npm run check`, `npm test`, `npm run assets:validate`.
