# CHASE 404 · QA Fase 4.11 / v0.7.0

## Alcance implementado
- Misión 11 «El precio del rescate»: ir al almacén, rescatar a pie durante 7 segundos sin alejarse y conducir a un refugio, manteniendo a las patrullas a 65 m durante 4 segundos.
- Las dos patrullas se activan tras completar la interacción de rescate.
- La progresión de la campaña permite acceder desde la misión 10 a la 11.
- No hay personaje rescatado renderizado, traslado real de NPC ni pasajero visible; el rescate es una interacción contextual, no una secuencia cinematográfica.

## Pruebas ejecutadas
- `npm run check`: PASS (exit code 0).
- `npm test`: PASS (149/149 pruebas, exit code 0). Incluye cuatro pruebas nuevas de rescate/extracción/tiempo.
- `npm run assets:validate`: PASS (6/6 GLB, exit code 0).
- `unzip -t` sobre paquete: comprobación previa a entrega.

## Pendientes y limitaciones
- Sin validación visual interactiva en navegador real, sin medición de FPS y sin pruebas físicas en Windows/Linux.
- IA de patrullas simplificada y contacto/rescate sin NPC completo.
- No confundir pruebas unitarias con misión completada manualmente.
- Release gate: **ALPHA / PENDING**.
