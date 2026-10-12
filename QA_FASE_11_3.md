# QA Fase 11.3 — Calles, desniveles y señalización

Versión 0.12.7 ALPHA. Ampliación decorativa del escenario con diez muros de contención segmentados, cuatro escaleras con pasamanos y ocho señales urbanas sin marcas comerciales. Las piezas junto a los cruces se ubican evaluando su distancia a toda la red de calles; no se modifican la física, la navegación, las colisiones ni las misiones.

## Verificación realizada
- 347/347 tests automáticos (`node --test --test-concurrency=4 tests/*.test.js`).
- 6/6 modelos GLB válidos.
- Sintaxis JavaScript verificada (`npm run check`).
- Dos tests de esta fase: presupuesto geométrico, posiciones y preservación de calles.

## Pendiente
- Inspección visual de escaleras y muros en navegador WebGL.
- Medición de FPS en Windows, Linux Mint y teléfono.
- Comprobación de que no hay intersecciones visuales con las fachadas existentes desde todos los ángulos.
