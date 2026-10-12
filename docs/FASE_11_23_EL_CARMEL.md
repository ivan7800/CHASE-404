# Fase 11.23 — fachadas piloto de El Carmel

## Objetivo

Dar una identidad de barrio más legible a ocho viviendas de ladera y tres bajos comerciales de la zona del Carmel, antes de extender la intervención a otros distritos.

## Cambios

- Volúmenes de ventana, marcos, contraventanas, zócalos y balcones pequeños.
- Variación de materiales para yeso, piedra, madera y hierro, usando la paleta de vértices que admite el renderer actual.
- Tres rótulos ficticios de 1984: BAR, TALLER y QUEVIURES. No se usan marcas ni imágenes externas.
- Canalones, antenas, depósitos y ropa tendida en algunos tejados y fachadas.
- No se cambian carreteras, colisiones, navegación, misiones, controles ni guardado.

## Límites

- La ciudad continúa usando geometría low-poly con color por vértice; todavía no tiene atlas de texturas ni modelos de fachada creados en Blender.
- El total pasa de 382.173 a 399.165 vértices y permanece debajo del gate de 400.000. Este dato no sustituye una medición de FPS en un equipo real.
- Revisión visual de la escena y conducción por las ocho fachadas: pendiente de navegador/GPU con WebGL operativo.

## Criterio para cerrar

Confirmar en Chrome o Firefox con WebGL que los rótulos se leen desde la cámara del coche, que las nuevas piezas no invaden la calzada ni crean colisiones falsas, y que no hay una caída perceptible de rendimiento. Después, decidir si se amplía el kit modular a Gràcia o si se reemplaza el sistema de color plano por materiales/atlas.
