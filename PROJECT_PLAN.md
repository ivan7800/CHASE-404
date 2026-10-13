# CHASE 404 — Plan vigente

**Versión:** 0.19.0 ALPHA · **Destino:** [GitHub Pages](https://ivan7800.github.io/CHASE-404/) · **Código:** [ivan7800/CHASE-404](https://github.com/ivan7800/CHASE-404)

## Fase actual: ciudad legible y validación jugable

La campaña de 15 misiones, dos desenlaces, tres encargos y exploración están implementados. Esta fase reduce la geometría estática y extiende la identidad de calle desde el Carmel a Gràcia y el Guinardó. El juego sigue en ALPHA: existen comprobaciones automáticas, pero no evidencias completas de partidas con WebGL, sonido y rendimiento real.

## Alcance de 0.19.0

- [x] Sustituir caras ocultas de cristales lejanos y fachadas por planos con normales hacia la calle.
- [x] Dar tratamiento propio a tres fachadas de Gràcia y tres del Guinardó sin añadir edificios ni colisionadores.
- [x] Actualizar README, estado QA, plan y guía de publicación.
- [ ] Confirmar `npm run audit`, `python3 tools/first_run_check.py` y `npm run acceptance:gate` en la CI de la rama.
- [ ] Comprobar la nueva escena con WebGL real, a pie y conduciendo; medir FPS en escritorio y móvil.

**Presupuesto medido en la malla de ciudad:** 374.409 vértices; límite de regresión: 400.000. La cifra no representa FPS: hay que medirlos en hardware real.

## Próximos hitos

1. **QA manual:** arranque Windows y Linux, 15 misiones, ambos finales, controles, sonido, guardado tras recarga, móvil y sesión de 30 minutos. Registrar fecha, navegador, hardware, pasos y resultado en [ACEPTACION_MANUAL.md](ACEPTACION_MANUAL.md).
2. **Ciudad por sectores:** ampliar elementos propios del Carmel, Gràcia, Guinardó, Eixample y puerto en lotes pequeños, manteniendo rutas y colisiones, y midiendo geometría y FPS en cada lote.
3. **Cierre de jugabilidad:** corregir los problemas observados en sesiones completas antes de plantear una versión estable.

## Verificación y puertas

| Control | Estado |
| --- | --- |
| CI: sintaxis, pruebas, seis GLB, auditoría estática, release y Pages | Pendiente del flujo de 0.19.0; revisar [Actions](https://github.com/ivan7800/CHASE-404/actions) |
| Aceptación técnica | Ejecutar `npm run audit && npm run acceptance:gate` para 0.19.0 |
| Publicación | Sitio de GitHub Pages existente; confirmar la versión visible después del despliegue |
| Aceptación manual de juego | Pendiente; sigue ALPHA |

Informes: [QA.md](QA.md) y [QA_v0.19.0.md](QA_v0.19.0.md). La versión anterior se documenta en [QA_v0.18.0.md](QA_v0.18.0.md). El plan anterior se conserva como [histórico](docs/HISTORICO_PROJECT_PLAN_v0.9.6.md).
