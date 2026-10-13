# QA v0.18.0 — Recorrido piloto del Carmel

## Cambios

- Tres manzanas contiguas del Carmel muestran balcones de hierro, zócalos y una planta baja comercial con toldo y rótulo.
- Tres tramos enlazados de escaleras siguen una bajada de terreno y añaden barandillas.
- Las escaleras se mantienen dentro de la franja peatonal y no atraviesan las cajas de colisión de edificios en los puntos muestreados.

## Evidencia automatizada

- `tests/carmel-contour-117.test.js`: continuidad de las tres manzanas y los tres tramos, distancia a calles, colisiones, presencia de hierro y límite de geometría.
- `tests/building-collisions.test.js`, `tests/on-foot.test.js` y `tests/urban-navigation.test.js`: regresiones de colisión y movilidad.
- Ciudad completa: **396.975 vértices** de un máximo de 400.000.
- La validación automatizada no acredita apariencia en WebGL ni FPS reales.

## Pendiente de navegador

1. Recorrer en WebGL la escalera y las calles desde arriba y abajo; observar uniones, barandillas, rótulo y toldo.
2. Probar a pie y en coche alrededor de las tres manzanas, con tráfico activo.
3. Medir FPS en escritorio modesto y móvil.

La build sigue en ALPHA hasta completar estas comprobaciones manuales.
