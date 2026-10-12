# QA v0.14.7 · Correcciones para revisión en GitHub

**Estado:** alpha técnicamente verificable; no es release candidate jugable. Basada en la auditoría independiente de v0.14.6. Este documento registra resultados de pruebas ejecutadas en el entorno de preparación; la partida gráfica completa no se certifica.

## Ejecución del 12 de octubre de 2026

- `npm run audit`: sintaxis, tests aislados (94 ficheros), seis GLB, auditoría estática y distribución aprobados; staging de 66 archivos.
- `node --test --test-isolation=none tests/*.test.js`: **403/403 casos** aprobados.
- `python3 tools/first_run_check.py`: **7/7** peticiones HTTP correctas.
- `npm run acceptance:gate`: **18/18** técnicos, `PENDING_MANUAL_ACCEPTANCE`.
- `npm run acceptance:gate -- --require-manual`: termina con código 1 de forma deliberada; ninguna partida manual está certificada.

## Defectos abordados

| ID | Cambio | Comprobación reproducible | Límite |
|---|---|---|---|
| H01 | `reset()` activa la nueva misión o encargo solo cuando el juego ya estaba en marcha | `tests/campaign-resume.test.js`: sustitución de run, avance de reloj y primer objetivo; `npm run audit` | Falta pulsar R/botón en navegador con WebGL y observar HUD |
| H02 | Se guarda el siguiente capítulo al ganar; se lee al arrancar; nueva campaña explícita | Tests de capítulos 1→15, recarga simulada, datos dañados y escritura bloqueada | Falta completar misiones en navegador, cerrar y continuar |
| H03 | `_site/` no entra en el ZIP final | Inspección del paquete | La acción generará `_site/` de nuevo |
| H04 | Versión en HUD y número de ficheros documentado | `release:gate`, `site:prepare`, inspección | Sin revisión visual de la pantalla |

## Aceptación pendiente

Seguir `ACEPTACION_MANUAL.md` A01–A12. En especial: partida real con R en campaña y desafío, salida/entrada en coche, pausa, dos finales, recarga desde una misión posterior, almacenamiento bloqueado, 30 minutos de FPS/memoria y prueba de la URL real de GitHub Pages. El despliegue se mantiene manual.
