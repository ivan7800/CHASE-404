# CHASE 404 — QA fase 3.8 (v0.5.7)

## Cambios verificados a nivel de código
- Semáforos 3D integrados en el renderer con fases sincronizadas a `urbanElapsed` y los mismos estados que controla `mustYieldSignal`.
- Movimiento de Gael a pie: rechazo de desplazamiento hacia coches próximos (coche de Gael, tráfico y patrulla activa).
- El alcance de las misiones y el motor de conducción existentes se conservan.

## Verificaciones ejecutadas
- `npm test` → exit 0 → **103/103**.
- `npm run check` → exit 0.
- `npm run assets:validate` → exit 0 → **6/6 GLB**.
- Estructura ZIP comprobada durante empaquetado.

## Limitaciones conocidas
- La detección a pie es una colisión radial básica con coches; no es un motor de colisiones con fachadas, bordillos y peatones.
- Los semáforos 3D son prototipos geométricos y sus posiciones están asociadas a la primera red de calles, no a un mapa urbano definitivo de cruces.
- El avatar tiene animación procedural mínima; no incorpora rigging ni caminar esquelético.
- Las misiones a pie siguen siendo la misión inicial y no constituyen una campaña.
- Validación visual manual de semáforos y colisiones en navegador real: pendiente.
- Rendimiento y compatibilidad efectiva Windows/Linux: pendientes de prueba de usuario.

## Estado
Fase 3 **aún abierta**. QA lógico PASS; QA jugable pendiente. Sin autorización de publicación.
