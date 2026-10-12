# CHASE 404 · Fase 6.5 · Auditoría de optimización · v0.9.4 ALPHA

Fecha: 12 de octubre de 2026. Base: v0.9.3. Alcance limitado a render WebGL, parámetros Web Audio y buffers de alta densidad. No se han tocado la simulación física, la IA, la economía ni las claves de guardado.

## Cambios verificables

1. **Caché de atributos GPU:** `Renderer.draw` compara la malla actual con la anterior. Si es la misma, no vuelve a invocar `bindBuffer`, `enableVertexAttribArray` ni `vertexAttribPointer`. La caché se invalida al eliminar la malla. Las cuatro ruedas consecutivas siguen recibiendo sus matrices y se renderizan individualmente.
2. **Nivel de detalle de rivales:** ALTO conserva las ruedas y sombras. En MEDIO, a más de 210 m, y en ECO, a más de 110 m, se representa únicamente la carrocería. Los rivales se siguen simulando siempre; el modo BONNET y las misiones mantienen las mismas reglas. Los semáforos lejanos (>950 m) se omiten de la imagen, no de las reglas de preferencia.
3. **Resolución interna controlada:** techo de 2.500.000 píxeles (ALTO), 1.200.000 (MEDIO), 750.000 (ECO), preservando la relación de aspecto. A 960×540 en ALTO no hay reducción.
4. **Audio:** `EngineAudio.needsFrame()` y `shouldUpdateAudio` limitan la automatización continua a 30 Hz cuando el AudioContext avanza; los tonos de evento siguen siendo inmediatos, y un reinicio de audio provoca una nueva actualización sin esperar el intervalo. La consulta de distancias del mundo se hace únicamente cuando el audio precisa actualizarse.

## Pruebas

- `npm run check`: correcto, incluido `src/performance.js`.
- `npm test`: **253/253 correctas**, de las cuales seis son nuevas de Fase 6.5.
- `npm run assets:validate`: **6/6 GLB correctos**.
- `node tools/audit_project.mjs`: **163 IDs HTML únicos, 41 botones con referencias de manejadores, 73 posiciones verificadas geométricamente, 15 misiones, 3 desafíos, 8 secretos, 3 contactos**.
- Prueba mediante WebGL simulado: un coche lejano en ECO necesita una llamada de dibujo para la carrocería en vez de seis para carrocería, sombra y cuatro ruedas (**5 llamadas menos, −83,3 % por ese coche**). Para tres dibujos consecutivos de la misma malla, el caché reduce 9 enlaces de buffer a 3 (**−66,7 % en ese caso**). **No equivale a ahorro de FPS medido.**
- Test de AudioContext simulado: las escrituras de parámetros no se repiten entre dos actualizaciones separadas por menos de 1/30 s; después de una reactivación, la actualización es inmediata.

## Límites de certificación

Los tests de WebGL y AudioContext usan dobles/simulaciones. Falta probar compilación de shaders y aspecto visual real de noche/día, suavidad de las transiciones, continuidad auditiva, móviles de alta densidad, memoria gráfica, temperaturas y FPS con hardware real. El contador de FPS del juego es una métrica aproximada del ciclo de render, **no una medida aislada de GPU ni de FPS percentil 1**. La experiencia sigue en **ALPHA / NOT READY FOR RELEASE**.

No se ha publicado ni cambiado el repositorio remoto de GitHub.

### Intento de validación interactiva en este entorno

Se inició `python -m http.server 8765 --bind 127.0.0.1`; el acceso HTTP por `curl` devolvió `HTTP 000` / *connection refused*. Se invocó Chromium headless con límite de 10 segundos y terminó por **timeout (124)** sin captura. Por tanto, **no hubo sesión jugable ni medición de FPS reales**. Estas restricciones no demuestran un fallo del juego en un equipo normal.
