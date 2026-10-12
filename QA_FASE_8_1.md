# CHASE 404 — Fase 8.1 · Conducción de precisión

Versión: 0.10.5 ALPHA. Fecha: 2026-10-12.

## Implementación

- Misión 03, segundo objetivo (Avenida del Eixample): nuevo tramo de conducción controlada.
- Completar requiere conducir sin bajar del coche a 15–45 km/h, dentro de 55 m del punto, durante 3 segundos continuos.
- Si se excede o reduce la velocidad, se baja del coche o se sale de la zona, el contador vuelve a cero.
- HUD muestra progreso del tramo, sin alterar las físicas de conducción ni el movimiento a pie.
- Sin cambios en los guardados de campaña, vehículos, economía o personajes.

## Verificación automática

- `npm run audit`: 292/292 pruebas correctas.
- Se añadieron 4 pruebas del nuevo tipo de objetivo, incluyendo continuidad, rangos de velocidad, distancia, andar y derrota por tiempo.
- Se adaptaron 2 simulaciones antiguas a la nueva exigencia: misión 03 y regresión de campaña (cuatro rutas).
- 6/6 modelos GLB válidos. Auditoría estática correcta: 172 IDs únicos, 42 botones enlazados, 15 misiones.

## Validación manual PENDIENTE

1. Iniciar campaña, misión 03. Superar el primer punto.
2. Llegar a la Avenida del Eixample y mantener 15–45 km/h durante 3 segundos sin salir del círculo de 55 m.
3. Confirmar avance al tercer objetivo.
4. Probar pasar a más de 45 km/h, detenerse, bajar del coche o salir del área: contador debe reiniciarse.
5. Verificar que W/A/S/D de conducción, E para salir y cámara funcionan como antes.
6. Comprobar sensación de dificultad y posición de la zona de velocidad en navegador real.

**No se ha ejecutado una sesión jugable real con WebGL en esta fase; no se certifica sensación de conducción ni FPS.**
