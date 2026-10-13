# QA v0.19.0 — Geometría y corredores urbanos

## Cambio inspeccionado

- Ventanas de la fachada del Eixample, Gràcia y Guinardó: cristales planos con normales hacia el exterior de cada edificio.
- Casas residenciales a más de 42 m de una calle: cristales planos. Las cercanas mantienen la profundidad anterior.
- Tres frentes de Gràcia reciben zócalos cerámicos, contraventanas y un comercio; tres frentes del Guinardó reciben zócalos de taller, paneles y un portón.
- El detalle se fija a muros existentes; no cambia rutas, carreteras ni edificios físicos.

## Evidencia del código

- Malla completa: **374.409 vértices** frente a **396.975** en v0.18.0; ahorro de **22.566** y margen de **25.591** bajo el límite de 400.000.
- Se comprobó la geometría generada por `Builder`: posiciones finitas, 36 vértices del nuevo color de zócalo junto al primer frente de cada distrito y 96 vértices de cristal con normal exterior en cada cara del edificio de muestra del Eixample.
- Antes y después, los **124 colisionadores** de edificios son idénticos en datos y orden.
- `tests/district-corridors-019.test.js` comprueba el presupuesto, ambos distritos y normales hacia ambos lados.

## Por comprobar

- CI de rama: `npm run audit`, `python3 tools/first_run_check.py`, `npm run acceptance:gate`.
- Aspecto de las fachadas y zócalos en un navegador con WebGL, colisiones al acercarse y FPS en escritorio y móvil.
- Campaña completa, ambos finales y sesión prolongada.

**Estado:** ALPHA. Ninguna medición de vértices equivale a una medida de rendimiento real.
