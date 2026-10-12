# QA — Fase 8.3 · Información de daños y amenaza

Versión 0.10.7 ALPHA · 2026-10-12.

## Cambios
- Indicador contextual de patrullas: aproximación, cerca (<55 m), crítico (<18 m). Usa la patrulla activa más próxima al jugador, sea en coche o a pie.
- Estado de daños con avisos de mantenimiento, riesgo y avería crítica.
- Avisos informativos sin destellos ni movimiento, integrados en el HUD urbano. Se ocultan si no hay peligro y el vehículo está sano.
- No se han alterado física, controles, velocidad, IA policial, rutas ni requisitos de misiones.

## Evidencia automatizada
- `npm run audit`: 297/297 pruebas; validación GLB 6/6; auditoría estática correcta.
- Pruebas nuevas: distancias policiales, patrulla inactiva, entradas inválidas, límites de daño.
- Validación visual y auditiva real: **pendiente**. Estas pruebas no certifican legibilidad y colocación en pantallas pequeñas.

## QA manual requerido
1. Iniciar Barcelona en exploración libre y comprobar que no aparezca alerta con coche sano y sin policía.
2. Dañar el coche y comprobar los mensajes con distintos niveles de salud; entrar al taller y reparar para ocultar la advertencia.
3. Activar una persecución y comprobar que la indicación evoluciona al acercarse y alejarse una patrulla.
4. Probar con reducir movimiento y en móvil: sin destellos, texto legible y sin tapar minimapa o controles.
5. Completar una misión de evasión y confirmar que las reglas originales se mantienen.
