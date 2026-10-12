# CHASE 404 — QA Fase 4.9

## Cambios
- Se introduce misión 09 «Los testigos de la noche» con ruta distinta según la decisión en «La emboscada».
- Se conserva la decisión al ganar misión 08 en localStorage bajo `chase404.campaign.choice.v1`; se comprueba versión y valores permitidos.
- Si el almacenamiento falla o se abre directamente misión 09 sin decisión válida, se utiliza la variante AVENIDA OESTE sin bloquear la partida.
- Sin publicación en GitHub.

## Verificado por ejecución
- `npm test`: 141 pruebas superadas, 0 fallidas.
- `npm run check`: exit code 0.
- `npm run assets:validate`: seis vehículos GLB aceptados por el validador existente.
- Pruebas nuevas: bifurcación oeste y este, guardado versionado, rechazo de datos corruptos, almacenamiento fallido.

## Pendiente — no ejecutado
- Recorrido interactivo completo 08 → 09, visibilidad de hitos y precisión del cronómetro con WebGL real.
- Pruebas de FPS, Windows, Linux Mint y GitHub Pages.
- Comparación histórica visual de los barrios.

## Release gate
**ALPHA / NO APTO PARA PUBLICACIÓN FINAL**: las pruebas automatizadas no constituyen QA jugable.
