# Fase 11.22 — Auditoría de coherencia visual (v0.14.6)

## Cambios implementados
- Doce entradas del Eixample reforzadas con jambas, dinteles, umbrales y marcos a nivel de calle.
- Siete fachadas portuarias enriquecidas con nervaduras de portones y elementos metálicos.
- Todos los elementos decorativos están fijados a las fachadas existentes: no cambian física, navegación, mapas ni colisiones.
- Presupuesto de geometría actual: **382.173 vértices**, frente a 373.425 de la fase anterior (+8.748, ~2,34 %). Los seis límites heredados en tests se ajustaron al presupuesto explícito <400.000, sin modificar jugabilidad.

## Comprobaciones realizadas
- `npm test`: 398/398, sin fallos.
- `npm run check`: sintaxis JS correcta.
- `npm run assets:validate`: 6/6 GLB de coches correctos.
- `npm run release:gate`: OK.
- `npm run site:prepare`: OK; 64 archivos publicables.
- `npm run acceptance:gate`: 18/18 técnicos, aceptación manual PENDIENTE.

## Límites y pendientes
- No se certifican calidad visual, aspecto de los materiales en GPU real ni FPS.
- Siguen pendientes la campaña jugada de principio a fin y ambos desenlaces en navegador real.
- La arquitectura es procedural; esta entrega **no** incorpora modelos fotogramétricos ni sustituye los edificios completos.
