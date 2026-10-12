# QA — Fase 8.4 · Indicaciones de objetivos · v0.10.8

## Cambios
- Tarjeta compacta de nuevo objetivo en Barcelona, con número de etapa, nombre y acción contextual según el tipo de misión.
- Compatible con los tres desafíos secundarios, sin cambiar sus reglas, economía o cronómetros.
- Botón para ocultar el aviso; se anuncia un objetivo nuevo al avanzar de etapa.
- Mensajes de transición con nombre del nuevo destino, en lugar de un aviso genérico.
- Se oculta al pausar, terminar misión o reiniciar. No se modifica la física, la conducción ni los controles a pie.

## Verificado automáticamente
- `npm run audit`: 301/301 pruebas correctas, 6/6 modelos GLB, auditoría estática correcta.
- Pruebas específicas de tipos de objetivo, avance y entradas inválidas.
- Archivo ZIP e integridad verificados al empaquetar.

## Pendiente
- Confirmar en Chrome/Edge/Firefox real que la tarjeta no se solapa con controles en desktop/móvil.
- Probar manualmente el ritmo de transición y ambos finales completos.
- Medir FPS reales en Windows, Linux y móvil. No se afirma certificación visual.
