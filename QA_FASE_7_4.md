# Fase 7.4 — viñetas narrativas (v0.10.2)

Se incorporan seis escenas de diálogo en la campaña principal, tras completar puntos concretos de las misiones 10, 11, 14 y 15. Se detiene el cronómetro durante la lectura; controles Entrar/Esc y botón accesible. No se modifican la física, las coordenadas de misiones ni las decisiones guardadas.

**Alcance real:** son interludios narrativos estilizados sobre el renderizado existente, **no** cinemáticas 3D con movimientos de cámara, personajes nuevos o doblaje. Tampoco se muestra una secuencia tras terminar la misión: el informe de victoria existente sigue activo.

**Prueba manual pendiente:** reproducir las misiones 10, 11, 14 y 15 en navegador para comprobar encuadre, pausa, teclado, móvil, contraste y compatibilidad con distintos navegadores; medir FPS reales.

## Pruebas automáticas
- `npm run audit`: 281/281 pruebas; 6/6 GLB; auditoría estática correcta.
- Chromium/WebGL real: no verificado.
