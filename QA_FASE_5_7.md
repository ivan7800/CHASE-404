# CHASE 404 — Fase 5.7 · Auditoría integral

**Versión:** 0.8.6 ALPHA  
**Fecha:** 12/10/2026  
**Origen auditado:** ZIP v0.8.5, Fase 5.6 «Voces de Barcelona»  
**Decisión de release:** **NO APTO PARA RELEASE FINAL**; no publicar en GitHub sin autorización expresa.

## Qué se ha revisado y corregido

1. **Conflicto de controles (corregido):** v0.8.5 admitía `E`, `I`, `J` y `X` en las teclas de conducción, a pesar de ser comandos de vehículo, archivo, diario e investigación. Ya no se pueden asignar; ajustes previos que las utilicen se normalizan de forma segura a WASD + Espacio. Se mantienen K, L, Q, Z, flechas y Shift para remapeos.
2. **Recompensa de desafíos (corregido):** anteriormente, `awardSideRun` marcaba la partida como cobrada en memoria antes de confirmar `localStorage`. Ahora la pantalla de resultados calcula sobre una copia del estado del desafío y solo marca la recompensa como reclamada tras guardar correctamente. Si falla el almacenamiento, se informa sin acreditar saldo ni alterar el estado original de la partida.
3. **Auditoría transversal automatizada (nuevo):** `tools/audit_project.mjs` comprueba IDs HTML únicos, referencias desde JS, presencia de recursos HTML/importaciones locales, botones con listeners estáticos y acceso geométrico a los puntos de misión, desafío, secretismo, contactos, taller y garaje. También valida la cantidad de misiones y contenidos.
4. **Pruebas de integración (nuevo):** las quince misiones se recorren mediante el simulador puro de objetivos por las dos rutas de misión 8 y las dos elecciones de misión 14. Además se comprueban desafíos → dinero → mejoras → reparaciones → ocho pistas → tres contactos → persistencia, garaje y decisiones de campaña.
5. **Documentación (actualizada):** nueva referencia de QA, instrucciones de auditoría y checklist de pruebas manuales; el historial de QA heredado de DAYTONA se conserva en `docs/QA_HEREDADO_DAYTONA.md`.

## Evidencia automatizada

| Comprobación | Estado | Resultado / límite |
| --- | --- | --- |
| `npm run check` | **PASS** | Sintaxis JavaScript de los módulos incluidos en el script |
| `npm test` | **PASS** | **222/222** tests; 8 tests de integración añadidos, se mantienen 214 anteriores |
| `npm run assets:validate` | **PASS** | Seis archivos `.glb` y estructura geométrica validada |
| `node tools/audit_project.mjs` | **PASS** | 158 IDs únicos; 40 botones con registros de acción estáticos; 149 refs HTML; 3 recursos HTML; 31 módulos JS; 73 posiciones cerca de calles |
| `npm run audit` | **PASS** | Ejecuta todos los controles anteriores de manera consecutiva |
| HTTP local `127.0.0.1` | **PASS** | **40/40 recursos HTTP 200**: HTML, CSS, SVG, 31 módulos JS, seis GLB; no demuestra WebGL |
| Chromium real | **BLOQUEADO** | Playwright/Chromium devuelve `net::ERR_BLOCKED_BY_ADMINISTRATOR` para la URL local, incluso con servidor HTTP 200 |
| Clicks y render WebGL | **NO VERIFICADO** | Sin sesión de navegador reproducible |
| Windows / Linux Mint / iPhone / FPS | **NO EJECUTADO** | Sin acceso a esos dispositivos/hardware |

### Interpretación de las pruebas

- «40 botones conectados» significa exclusivamente que tienen *registros de manejador* reconocibles en el código, **no** que se hayan clicado en navegador.
- «73 posiciones accesibles» comprueba distancias a ejes de carretera en el mapa matemático, **no** que se puedan visitar sin obstáculos de tráfico, colisiones visuales o problemas de cámara.
- La simulación de las quince misiones valida transiciones de objetivos y finales, **no** trayectos completos a velocidad humana dentro de los tiempos límite.
- Estas verificaciones no sustituyen a una prueba de interfaz real ni certifican la calidad del juego.

## Bloqueos y limitaciones pendientes

- **BLOQUEANTE:** jugar al menos una vuelta en carrera, una misión de cada mecánica y las rutas alternativas de la 8, 14 y 15 con WebGL real; observar consola sin errores.
- **BLOQUEANTE:** recorrer en el juego las interacciones de los tres personajes, ocho placas, garaje, taller y tres desafíos; probar salvaguardas y reinicios.
- **BLOQUEANTE:** medir estabilidad, cámara, colisiones, controles táctiles y FPS en al menos un navegador de escritorio y uno móvil.
- **CALIDAD:** animación de PNJ y presencia espacial de decisiones son todavía simples; secuencias de diálogo y finales siguen siendo principalmente textuales.
- **CALIDAD:** economía no equilibrada mediante sesiones jugadas, tráfico e IA policial experimentales, fidelidad histórica de Barcelona deliberadamente ficticia.

El checklist reproducible está en `MANUAL_QA_FASE_5_7.md`. El estado continúa en **ALPHA**. No se ha subido a GitHub.
