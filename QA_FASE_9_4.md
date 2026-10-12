# CHASE 404 — QA Fase 9.4 · v0.11.4

## Alcance
Compatibilidad estática y de controles de Windows, Linux Mint y dispositivos táctiles. Sin alteración de físicas, controles del coche, movimiento a pie, campañas ni guardados.

## Implementado
- Tres botones táctiles en Barcelona: HABLAR (contactInteract), PISTA (collectNearbyDiscovery) y DIARIO (contactJournal).
- Ocultación de estos controles fuera de Barcelona, con disposición adaptable a 740/390 px.
- Se mantienen los controles de volante, freno, acelerador y cambio coche/pie ya existentes.
- Cuatro tests de regresión de controles táctiles, viewport y lanzadores.

## Evidencia de auditoría
- `npm run audit`: 321/321 pruebas; seis GLB válidos; auditoría estática correcta.
- `python3 -m py_compile local_server.py`: correcto.
- `bash -n INICIAR_LINUX.sh`: correcto.
- 181 identificadores HTML únicos; 46 botones vinculados por análisis estático.
- Archivo con resultados: `QA_AUTOMATIZADA_FASE_9_4.log`.

## Limitaciones importantes
- No ha sido posible ejecutar aquí una prueba visual/táctil fiable en navegador móvil, Safari iOS, Chrome Android, Windows ni Linux Mint. Las pruebas estáticas **no** acreditan respuesta táctil real, área útil en dispositivos pequeños, FPS, sonido ni jugabilidad completa.
- El BAT no se ha ejecutado en Windows. Su revisión es estática.
- Los botones táctiles siguen dependiendo de los permisos de interacción y proximidad del juego; no eluden los objetivos de misión.

## Prueba manual sugerida
1. Arrancar Windows con `INICIAR_WINDOWS.bat` y Linux Mint con `./INICIAR_LINUX.sh`; comprobar carga de modelos y consola.
2. En navegador móvil, entrar a BCN > Exploración libre, iniciar, detener el coche y pulsar E · COCHE; verificar volante/pedales, HABLAR, PISTA y DIARIO.
3. Comprobar que los controles de exploración no aparecen en los circuitos arcade y que los paneles abren y cierran sin bloquear el juego.
4. Probar 390 px de ancho, orientación horizontal y vertical, recarga de página, y navegación por botones con teclado.
5. Jugar las misiones 14 y 15 en ambas ramas, comprobar el guardado y capturar posibles errores de consola.
