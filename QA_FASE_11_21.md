# QA — Fase 11.21 · Identidad visual de los distritos

Versión: **0.14.5 ALPHA**

## Implementación
- Eixample: remates, volúmenes de azotea y detalles en 12 edificios.
- Puerto: siete cubiertas con conductos y luminarias industriales.
- Montjuïc: ocho almenas y torre decorativa sobre la fortificación existente.
- Geometría urbana: 369.114 → 373.425 vértices (+4.311; +1,17 %).
- Sin cambios en las 39 rutas, controles, físicas, colisiones, misiones ni guardados.

## Verificación ejecutada
- `npm test`: **396/396**, OK. Se actualizó el límite geométrico de una prueba heredada de 370.000 a 395.000 tras medir el nuevo recuento.
- `npm run check`: OK.
- `npm run assets:validate`: 6/6 vehículos GLB correctos.
- `npm run release:gate`: OK.
- `npm run site:prepare`: 64 archivos, OK.
- `npm run acceptance:gate`: 18/18, `PENDING_MANUAL_ACCEPTANCE`.
- Dos pruebas específicas del distrito: 2/2.

## Pendiente
- Capturas reales y evaluación de la calidad artística en WebGL.
- FPS y memoria reales en Windows, Linux y móvil.
- Campaña completa y finales probados jugando.
- Revisar a ojo las siluetas añadidas de día, atardecer y noche.

**Estado:** implementación y QA automático correctos. Aceptación visual y jugable no certificadas.
