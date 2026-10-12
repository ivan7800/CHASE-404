# QA · Fase 7.5 — Personajes del desenlace · v0.10.3

## Implementación
- Dos figuras low-poly nuevas y separadas de la malla urbana: hermano de Gael junto al rescate del muelle y Víctor Salvat en el encuentro del Carmel.
- Aparición contextual según capítulo, índice de objetivo, estado de misión y decisión guardada de la misión 14.
- Animación ambiental ligera (respiración, cabeza y brazos); reducción de movimiento respetada.
- No se alteraron física, colisiones, controles, cronómetro ni economía; las figuras son elementos visuales, no NPC con navegación o IA.

## Comprobaciones automáticas
- `npm run audit`: correcto (incluye `npm run check`, `npm test`, validación de 6 GLB y verificador estático).
- Nuevas pruebas de visibilidad de ambos actores, ramas del rescate y reducción de movimiento.

## Pendiente de validar en navegador real
- Comprobar que las figuras no floten ni queden hundidas en el muelle/Carmel, que sus articulaciones sean coherentes y que no oculten el objetivo.
- Jugar las misiones 14 y 15 completas en las dos rutas; medir FPS de los actores y verificar accesibilidad móvil.
- Esta auditoría no demuestra la calidad artística ni la jugabilidad real.
