# QA histórica — CHASE 404 v0.2.0 · Fase 2 (reemplazada por Fase 3)

**En su entrega: 69/69 PASS. Esta hoja corresponde a la versión anterior del mapa; consulta `QA_FASE_3.md` para el estado actual.**

| Comprobación | Resultado | Evidencia |
|---|---:|---|
| Sintaxis módulos JS | PASS | `npm run check`, incluye `src/city.js` |
| Pruebas completas | 69/69 PASS | `npm test` |
| Malla urbana finita y acotada | PASS | `tests/city.test.js` |
| Siete calles conectadas por eje e intersecciones | PASS | `nearestStreet`, `tests/city.test.js` |
| Movimiento y velocidad urbana | PASS | `createUrbanCar` + tick físico fijo |
| Colisión/corrección en edificios | PASS | Regresión de límite de calzada |
| Renderer WebGL 1 real / imagen final | PENDIENTE | Chromium/Playwright no disponibles aquí |
| FPS, GPU y prueba Windows/Linux del usuario | PENDIENTE | Requiere abrir el ZIP en equipo real |

La malla se valida por geometría y límites; esa prueba no acredita que el aspecto visual sea excelente en todos los equipos. Tampoco demuestra rendimiento sostenido ni compatibilidad de GPU.
