# QA — Fase 4.15 · v0.7.4 ALPHA

## Implementado
- Misión 15 «Barcelona no perdona» con recorrido condicionado por decisión de misión 14.
- Camino rescate previo: recuperar dossier de Salvat; camino pruebas previas: liberar al hermano a pie.
- Escape en Gràcia con patrullas y objetivo de distancia segura; confrontación final a pie y dos epílogos en pantalla de resultado.
- Progresión misión 14 → 15 con lectura de decisión persistida y alternativa determinista cuando falta.
- Corrección: completar un objetivo de evasión intermedio ya no finaliza prematuramente la misión.

## Evidencia ejecutada
- `npm test`: PASS 165/165, exit 0.
- `npm run check`: PASS, exit 0.
- `npm run assets:validate`: PASS 6/6 GLB, exit 0.
- Validación de extracción ZIP pendiente de comprobación en empaquetado.

## Limitaciones
- No existe cinemática de Salvat ni NPC detallado del hermano; confrontación y rescate son eventos contextuales.
- No se ha demostrado navegación completa de la misión 15 en navegador real; FPS de Windows y Linux pendientes.
- La historia tiene finales textuales distintos, no cinemáticas ni créditos interactivos.
- Fase 4 integrada a nivel de lógica de 15 misiones. Gate de cierre jugable: PENDIENTE.
