# CHASE 404 · Fase 11.13 — QA

Versión: 0.13.7 ALPHA.

## Alcance

Se sustituye el cálculo local de oscilación de extremidades en renderer.js por la función pura `gaelGaitPose` en gael-model.js. En reposo adopta pose neutra; caminar y correr usan amplitudes distintas, brazos en contrafase y leve rebote. Se conservan pivotes, control del personaje, cámara, conducción y mallas de vehículos.

## Límites de aceptación

Estas animaciones son procedurales sobre cuatro mallas, NO una armadura esquelética importada ni animaciones profesionales capturadas. Se necesita verificación visual jugando y pruebas de FPS para valorar el resultado artístico. La campaña jugada de principio a fin también queda pendiente.
