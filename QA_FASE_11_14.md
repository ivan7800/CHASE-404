# QA Fase 11.14 — Articulaciones Gael (v0.13.8)

## Implementación
- Brazos divididos en brazo superior y antebrazo con pivote en codo.
- Piernas divididas en muslo y pantorrilla con pivote en rodilla.
- Flexión procedural de rodillas en la fase de recuperación y codos durante la marcha; amplitud mayor al correr.
- Reposo sin flexión de rodilla; conserva pivotes principales, colisiones, física y controles.
- Sin motor de esqueleto externo ni animaciones Blender: sigue siendo procedural.

## Validación automática
- `npm test`: 381/381 pruebas aprobadas.
- `npm run check`: sintaxis correcta.
- `npm run assets:validate`: 6/6 GLB correctos.
- `npm run release:gate`: aprobada.
- 5 pruebas nuevas dedicadas a piezas, reposo, flexión, carrera y renderizado.
- 3 pruebas antiguas ajustadas a las dos nuevas mallas sin debilitar controles geométricos.

## No validado
- Animaciones vistas en WebGL real, posibles penetraciones entre piezas, estética del gesto, FPS y compatibilidad móvil.
- Aceptación jugable completa y ambos desenlaces siguen pendientes.
