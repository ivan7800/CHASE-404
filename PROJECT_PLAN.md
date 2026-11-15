# CHASE 404 — Plan vigente

**Versión:** 0.23.0 ALPHA · **Destino:** [GitHub Pages](https://ivan7800.github.io/CHASE-404/) · **Código:** [ivan7800/CHASE-404](https://github.com/ivan7800/CHASE-404)

## Fase actual: arquitectura y lectura de la ciudad

Cruces y pavimentos, fachadas delanteras y traseras, silueta asentada en el terreno y espacios públicos en Gràcia y Guinardó. Los ejes de calle se conservan y la geometría nueva de los tres edificios de Gràcia tiene colisión. El juego sigue en ALPHA. Consulta [QA v0.23.0](QA_v0.23.0.md).

## Alcance de 0.21.0

Continuidad de la historia, progresión persistente y dos desenlaces con consecuencias distintas. Ver [diseño narrativo](CAMPAÑA.md) y [QA](QA_v0.21.0.md).

## Alcance de 0.20.0

Navegación de misiones, conducción y cámara, arranque con almacenamiento bloqueado, controles táctiles y mando estándar. Consulta [el informe de validación](QA_v0.20.0.md).

## Alcance anterior de 0.19.0

- [x] Sustituir caras ocultas de cristales lejanos y fachadas por planos con normales hacia la calle.
- [x] Dar tratamiento propio a tres fachadas de Gràcia y tres del Guinardó sin añadir edificios ni colisionadores.
- [x] Actualizar README, estado QA, plan y guía de publicación.
- [x] CI en la rama: 413/413 pruebas, 6/6 GLB, auditoría estática, arranque HTTP 7/7 y aceptación técnica 18/18. [Evidencia](https://github.com/ivan7800/CHASE-404/actions/runs/38431318992).
- [ ] Comprobar la nueva escena con WebGL real, a pie y conduciendo; medir FPS en escritorio y móvil.

**Presupuesto medido en la malla de ciudad:** 374.409 vértices; límite de regresión: 400.000. La cifra no representa FPS: hay que medirlos en hardware real.

## Próximos hitos

1. **QA manual:** arranque Windows y Linux, 15 misiones, ambos finales, controles, sonido, guardado tras recarga, móvil y sesión de 30 minutos. Registrar fecha, navegador, hardware, pasos y resultado en [ACEPTACION_MANUAL.md](ACEPTACION_MANUAL.md).
2. **Ciudad por sectores:** ampliar elementos propios del Carmel, Gràcia, Guinardó, Eixample y puerto en lotes pequeños, manteniendo rutas y colisiones, y midiendo geometría y FPS en cada lote.
3. **Cierre de jugabilidad:** corregir los problemas observados en sesiones completas antes de plantear una versión estable.

## Verificación y puertas

| Control | Estado |
| --- | --- |
| CI: sintaxis, 413 pruebas, seis GLB, auditoría estática y preparación de Pages | PASS en [Static QA](https://github.com/ivan7800/CHASE-404/actions/runs/38431318992) |
| Aceptación técnica | PASS 18/18; aceptación jugable PENDIENTE |
| Publicación | Sitio de GitHub Pages existente; confirmar la versión visible después del despliegue |
| Aceptación manual de juego | Pendiente; sigue ALPHA |

Informes: [QA.md](QA.md) y [QA_v0.19.0.md](QA_v0.19.0.md). La versión anterior se documenta en [QA_v0.18.0.md](QA_v0.18.0.md). El plan anterior se conserva como [histórico](docs/HISTORICO_PROJECT_PLAN_v0.9.6.md).
