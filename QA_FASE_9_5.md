# QA — Fase 9.5 · Rendimiento y memoria (v0.11.5)

## Cambios verificados
- El cálculo de distancia del tráfico más próximo y las patrullas, usado para el audio, ahora recorre directamente las entidades sin crear matrices temporales con `map`, `filter` o `spread` en cada actualización.
- Se conserva exactamente la distancia euclidiana de la entidad válida más cercana; una lista sin entidades devuelve `Infinity`.
- Las patrullas inactivas no producen alerta sonora.
- Se mantienen el comportamiento de conducción, los controles, los objetivos, el guardado y el renderizador.

## Evidencia automática
- `npm run audit`: 324/324 pruebas correctas.
- Validación GLB: 6/6.
- Auditoría estática: 46 botones, 15 misiones, 3 desafíos, 8 secretos, 3 personajes.
- 3 pruebas nuevas: distancia de tráfico, patrullas activas y verificación del camino de audio de baja asignación.

## Lo que NO se ha verificado
- FPS, pausas de GC ni consumo de RAM reales en Windows, Linux Mint, iOS o Android.
- Prueba visual y auditiva completa en navegador real.
- Esta optimización elimina asignaciones temporales en un punto específico; NO implica una mejora determinada de FPS.

## Comprobación manual recomendada
1. Conservar copia de datos del navegador si tienen importancia.
2. Jugar en Barcelona con audio activado, tráfico y persecución; comprobar motor, sirenas y proximidad.
3. Cambiar entre calidades ALTO, MEDIO, ECO y AUTO y anotar FPS en ciudad y persecución.
4. Probar 20 minutos de exploración y comparar fluidez, temperatura y memoria con v0.11.4.
5. Verificar Windows, Linux Mint y móvil antes de cerrar Fase 9.

**Estado:** auditoría automática superada; validación empírica de rendimiento pendiente. No certifica la release.
