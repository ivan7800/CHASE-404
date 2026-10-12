# CHASE 404 — QA Fase 3.7, v0.5.6 ALPHA

## Implementado
- Primer sistema determinista de semáforos lógicos en seis puntos del Carmel, con ciclos verde/ámbar/rojo. Los conductores ambientales frenan al acercarse a una señal restrictiva.
- El vehículo que Gael abandona para abordar otro se conserva en la simulación como automóvil aparcado; los automóviles aparcados dejan de circular.
- Durante una persecución, la policía toma las coordenadas del personaje a pie como objetivo, en lugar de perseguir exclusivamente su automóvil.

## Verificado en esta entrega
- `npm test` -> exit code 0, 100/100 PASS.
- `npm run check` -> exit code 0, sintaxis PASS.
- `npm run assets:validate` -> exit code 0, seis GLB PASS.

## Limitaciones y gate
- Semáforos: lógica de detención implementada; aún sin señalización visual sincronizada con el mundo 3D, ni control de todos los cruces.
- La navegación policial a pie no cuenta todavía con animaciones, detención peatonal especializada ni patrullas adicionales.
- Los coches aparcados se mantienen durante la sesión de misión, pero no se guardan entre sesiones.
- Falta validar juego, interacción, FPS y apariencia en navegador real Windows/Linux. QA de Fase 3: PENDING. No es una versión STABLE.
- Blender no ejecutado. No publicado en GitHub.
