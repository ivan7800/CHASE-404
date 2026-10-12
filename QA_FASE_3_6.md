# CHASE 404 — QA Fase 3.6, v0.5.5

## Alcance
Identidad de vehículos de tráfico; cambio de coche con características propias, carga del GLB correspondiente, nombre en HUD; ligero movimiento visual al caminar.

## Evidencia de verificaciones realizadas
- `npm test`: salida 0; 97 pruebas superadas, 0 fallidas.
- `npm run check`: salida 0; módulos verificados sintácticamente.
- `npm run assets:validate`: salida 0; seis GLB decodificados correctamente.
- Archivo ZIP comprobado con `unzip -t`.

## Pendiente
- Prueba real en navegador con seguimiento del jugador y cambios repetidos de vehículo.
- FPS en Windows y Linux; comportamiento en GitHub Pages.
- Los coches del tráfico usan aún carrocerías simplificadas (colores); cuando Gael se sube se carga el modelo GLB seleccionado.
- El cambio de coche reutiliza el mismo objeto dinámico para el vehículo del jugador: el vehículo abandonado no persiste como objeto aparcado independiente.
- La animación a pie es balanceo del cuerpo, no animación de piernas.

## Gate
ALPHA — implementación y pruebas lógicas correctas; pruebas de jugabilidad visual pendientes.
