# Fase 1 — Base técnica independiente

## Hecho
- Copia separada llamada CHASE-404; el ZIP fuente no se modifica.
- Paquete renombrado a `chase-404`.
- Claves localStorage migradas al espacio `chase404.*` para aislar perfiles, ajustes, efectos, selección de coche/circuito y récords.
- Marca visible principal actualizada a CHASE 404.
- README reescrito para declarar el estado real y el alcance urbano previsto.
- Concepto, mapa, garaje inicial y bucle de misión documentados.

## Heredado
WebGL 1 nativo, renderer, GLB, física arcade, controles, audio procedural, FX, ajustes, HUD y persistencia. Circuitos, vueltas, rivales y campeonatos siguen siendo de carreras y no se consideran sistemas urbanos terminados.

## Criterios de salida
- Tests existentes pasan tras el cambio de marca y almacenamiento.
- `npm run check` pasa.
- La aplicación conserva sus recursos locales y arranque HTTP.
- La documentación no afirma que ciudad, tráfico o policía ya estén implementados.

## Riesgos y decisión para fase 2
Los circuitos actuales se parametrizan como una trayectoria cerrada. La ciudad requiere calles, nodos, cruces y navegación. Fase 2 añadirá una capa urbana y conservará la pista como escena de regresión hasta verificar la conducción urbana.
