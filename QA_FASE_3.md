# QA — CHASE 404 v0.3.0 · El Carmel, 1984

**Resultado automatizado: 69/69 PASS. Validación visual WebGL y GPU pendiente.**

| Comprobación | Resultado | Evidencia |
|---|---:|---|
| Sintaxis de módulos | PASS | `npm run check` |
| Suite completa | 69/69 PASS | `npm test` |
| Terreno y malla urbana finitos y acotados | PASS | `tests/city.test.js` |
| Red sinuosa, puntos de cruce y salida del coche | PASS | `nearestStreet`, `tests/city.test.js` |
| Elevación y conducción libre urbana | PASS | simulación con paso físico fijo |
| Corrección del coche en límites de calzada | PASS | regresión urbana |
| Tres circuitos heredados | PASS | regresión de geometría y vueltas |
| Imagen WebGL real y rendimiento GPU | PENDIENTE | No disponible navegador WebGL automatizado en este entorno |
| Rendimiento en equipos Windows/Linux reales | PENDIENTE | Requiere prueba de usuario |

Las pruebas garantizan propiedades geométricas y de lógica; no acreditan calidad visual en navegador ni rendimiento sostenido. El coche y la cámara siguen la pendiente visualmente; el cálculo de movimiento aún no simula las fuerzas de las cuestas.
