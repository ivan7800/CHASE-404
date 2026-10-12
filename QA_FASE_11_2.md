# CHASE 404 — QA Fase 11.2 — v0.12.6

## Alcance
Remaster visual determinista de El Carmel y Gràcia: nueve fachadas existentes con barandillas finas, toldos de tejido, jardineras y portales; ocho volúmenes de viviendas bajas del Carmel con terrazas, persianas y depósitos; seis pequeñas escenas de acera.

## Verificado automáticamente
- `npm run check`: correcto.
- `npm test`: 345/345 correctas (dos nuevas).
- `npm run assets:validate`: 6/6 GLB válidos.
- `npm run release:gate`: correcto; versión 0.12.6.
- `npm run site:prepare`: correcto; 56 archivos web.
- `npm run acceptance:gate`: 18/18, **aceptación manual pendiente**.
- Vértices de ciudad: 307.809 → 337.257 (+29.448; +9,57 %).
- No se alteran rutas de CITY, físicas, colisiones ni lógica de misiones.

## Pruebas pendientes en navegador real
Comprobar fachadas y balcones desde ambas direcciones de la calle, posibles solapamientos por el desnivel, z-fighting de toldos/barandillas, espacios de paso y FPS en ALTO/MEDIO/ECO. Validar El Carmel y Gràcia de día, tarde y noche. No se ha certificado ningún resultado visual ni tasa de FPS.

## Limitación artística
El estilo sigue siendo low-poly/procedural y los volúmenes añadidos son decoración, no edificios históricos fotogramétricos ni modelos detallados de Blender. La ciudad ficticia está inspirada en Barcelona 1984, no es una reproducción exacta.
