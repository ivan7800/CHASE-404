# CHASE 404 · v0.19.0 · Acta de aceptación manual

**Estado: PENDIENTE.** Este documento no certifica una versión final. Completarlo con fecha, sistema, navegador, resultados y evidencias reales de cada sesión.

| ID | Criterio de aceptación | Estado inicial | Evidencia requerida |
|---|---|---|---|
| A01 | Arranque Windows con `INICIAR_WINDOWS.bat` | Pendiente | Versión Windows, navegador, captura de portada y escena WebGL |
| A02 | Arranque Linux Mint con `INICIAR_LINUX.sh` | Pendiente | Distribución, navegador, captura de escena |
| A03 | Controles a pie W/A/S/D, E, C y conducción, sin inversión | Pendiente | Prueba aparcando en distintas orientaciones |
| A04 | 15 misiones completadas de principio a fin | Pendiente | Registro por misión, fallos y tiempo aproximado |
| A05 | Final familia: decisión 14 y misión 15 | Pendiente | Resultado y escena final |
| A06 | Final pruebas: decisión 14 y misión 15 | Pendiente | Resultado y escena final |
| A07 | Taller, garaje, tres desafíos, secretos y tres contactos | Pendiente | Capturas de guardado y recompensas |
| A08 | Pausa, ayuda, ajustes, diálogos y 47 botones | Pendiente | Lista de interacciones y resultado |
| A09 | Tres iluminaciones, tres cámaras y sonido | Pendiente | Observación visual y auditiva, sin bloqueos |
| A10 | Móvil: controles, escala, giros de orientación | Pendiente | Modelo y navegador, capturas |
| A11 | 30 minutos de sesión: FPS y RAM | Pendiente | Medidas en equipo real y circunstancias |
| A12 | Sitio publicado en GitHub Pages bajo subruta | Pendiente | URL verificada y pruebas de carga sin 404 |

**Criterio de salida:** todas las filas aprobadas o cada excepción explícitamente documentada y aceptada, sin bloqueantes. Ejecutar `npm run audit`, `python3 tools/first_run_check.py`, `npm run acceptance:gate`. Ninguna prueba automática sustituye las pruebas jugables de A01–A12.

**Incidencias abiertas:** prueba gráfica y auditiva real, dos finales y rendimiento en equipos reales. GitHub Pages está publicado; falta completar la prueba jugable A12 con la versión actual.
