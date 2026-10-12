# QA v0.15.0 — Fachadas piloto de El Carmel

**Clasificación:** alpha visual para revisión local. No se certifica como release candidate ni como versión final.

## Alcance

Se incorporó la fase 11.23: detalle geométrico en ocho viviendas de El Carmel, tres rótulos comerciales ficticios y una prueba para la red vial, la salida urbana y el presupuesto de geometría. No se modificaron física, colisiones, controles, misiones o persistencia.

## Comprobaciones ejecutadas

| Comprobación | Resultado | Evidencia |
|---|---|---|
| Sintaxis JavaScript | Superada | `npm run check` dentro de `npm run audit` |
| Pruebas automatizadas | Superada: 95/95 | `npm test` |
| GLB del juego | Superada: 6/6 | `npm run assets:validate` |
| Auditoría estática | Superada | `node tools/audit_project.mjs` |
| Gate de publicación y rutas | Superado | `npm run release:gate`; `npm run site:prepare`, 66 archivos |
| Aceptación técnica | Superada: 18/18; aceptación manual pendiente | `npm run acceptance:gate` |
| Arranque por HTTP local | Bloqueado por el entorno | `python3 tools/first_run_check.py` no pudo abrir un socket: `PermissionError: [Errno 1] Operation not permitted` |
| Render WebGL y lectura visual desde el coche | Pendiente | La escena nueva no se ha comprobado visualmente; requiere navegador/GPU con WebGL |
| FPS y memoria en equipo real | Pendiente | No medidos |

## Geometría

- Base v0.14.7: 382.173 vértices.
- v0.15.0: 399.165 vértices.
- Variación: +16.992 (+4,45 %).
- Límite de las pruebas actuales: menos de 400.000.

Este límite comprueba el tamaño de la malla; no sustituye una medición real de rendimiento.

## Limitaciones y cierre

La ciudad mantiene su render low-poly por color de vértice; esta fase no incorpora atlas de texturas ni modelos Blender. No se afirma que la ciudad completa esté remasterizada. Antes de publicar esta versión en Pages, comprobar en navegador WebGL que los rótulos se leen desde la cámara, que los balcones y marquesinas no estorban la conducción y que el rendimiento es aceptable. La campaña completa y la aceptación jugable siguen pendientes.
