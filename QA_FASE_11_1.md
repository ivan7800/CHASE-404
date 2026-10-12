# CHASE 404 — QA Fase 11.1 (v0.12.5)

## Cambios verificados
- Nueva geometría procedural de Gael en `src/gael-model.js`: torso entallado, solapas, cuello, rostro facetado, peinado lateral, pantalón y calzado.
- Rig independiente de cuatro extremidades conserva los pivotes existentes. Física de conducción y locomoción sin cambios.
- Pruebas anteriores que dependían de la implementación antigua de cinco cajas actualizadas para verificar el contrato de mallas y las articulaciones.

## Comprobaciones ejecutadas
- `npm run check`: correcto.
- `npm test`: 343/343 correctas.
- `npm run assets:validate`: 6/6 GLB correctos.
- `npm run release:gate`: correcto.
- `npm run site:prepare`: 56 archivos publicables, correcto.
- Integridad ZIP: validada tras empaquetar.

## Pendiente
- Comprobación visual de la silueta, facciones y animaciones en WebGL real.
- FPS en Windows, Linux Mint y móvil.
- Aceptación jugable de las 15 misiones y ambos desenlaces.

## Prueba manual sugerida
Iniciar Barcelona → Exploración libre. Bajar del coche con E, girar sobre sí mismo, caminar y correr. Comprobar hombros, articulaciones, pies, escala respecto al coche y que la ropa no atraviese los miembros. Probar con luces de día y noche.
