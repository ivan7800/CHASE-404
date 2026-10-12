# CHASE 404 — QA Fase 8.6 · v0.11.0

## Alcance
Auditoría automatizada transversal tras las fases 8.1–8.5: campaña de 15 misiones, elecciones, desafíos, economía, interfaces, assets y transiciones.

## Corrección real
La captura policial se notificaba en `ui.finishTitle` después de generar `renderMissionReport`, de modo que el resumen de derrota podía decir «EL TIEMPO SE AGOTÓ» a pesar de la detención. Se creó `missionFailureTitle` para establecer una causa canónica antes de renderizar título y resumen, con prioridad de detención y pérdida de seguimiento frente a tiempo agotado. Nueva prueba de regresión con cinco casos.

## Ejecución en este entorno
- `npm run audit`: **306/306 pruebas PASS**, JS syntax PASS, **6/6 GLB PASS**, auditoría estática PASS.
- Auditoría estática: 178 IDs únicos, 43 botones registrados, 73 puntos geométricamente accesibles, 15 misiones, 3 desafíos, 8 secretos y 3 personajes.
- Archivo ZIP: comprobación de integridad mediante `unzip -t`.

## Limitaciones y cierre
- No se ha completado una sesión de navegador WebGL con clics, jugabilidad ni sonido real.
- No hay medidas verificadas de FPS en Windows, Linux o móviles.
- Las pruebas de lógica no certifican equilibrio, ausencia de bloqueos físicos ni capacidad real de completar los dos desenlaces jugando.
- **Gate de fase 8: implementación auditada automáticamente; certificación jugable PENDIENTE. Estado ALPHA / NO READY.**

## Pruebas manuales prioritarias
1. Jugar la misión 3 y comprobar que el control de velocidad no frustra la conducción.
2. Jugar las dos rutas de la misión 8 y evaluar tiempo/distancias.
3. Forzar una detención policial: título y resumen deben coincidir.
4. Fallar el seguimiento en la misión 7: informar CONTACTO PERDIDO.
5. Dejar que se agote una misión: informar EL TIEMPO SE AGOTÓ.
6. Completar misiones 14 y 15 por las dos decisiones y revisar transiciones, resultados y finales.
7. Jugar los tres desafíos y revisar economía, taller, garaje, secretos y contactos tras reiniciar el navegador.
8. Probar pantalla y control táctil y medir FPS en equipos reales.
