# QA · Fase 9.3 — Campaña, rutas y finales

**Versión:** 0.11.3 ALPHA · **Fecha:** 2026-10-12.

## Alcance
- Revisión del motor de progresión de 15 capítulos y las pruebas existentes de objetivos con temporizador, persecuciones y finales alternativos.
- Regresión de decisiones de los capítulos 14→15 con almacenamiento local bloqueado.
- Revisión estática de botones, recursos y marcadores urbanos.

## Incidencia corregida
**QA-9.3-01 — Pérdida de la elección final al avanzar sin persistencia local.** `nextCupRound()` iniciaba el capítulo 15 leyendo solamente `localStorage`. En navegadores que bloquean el guardado se podía completar el capítulo 14 y perder la elección antes del siguiente capítulo. Se incorpora `src/campaign-session.js` y una copia temporal en memoria que se captura al avanzar desde el capítulo 14; se prefiere al almacenamiento persistido para iniciar el capítulo 15. Al volver al menú principal se descarta esta copia. Se conserva un aviso en pantalla si falla la escritura persistente: **el estado en memoria no sobrevive a una recarga de página**.

## Resultados automatizados
- `npm run audit`: **317/317 tests**, comprobación sintáctica correcta, **6/6 GLB válidos** y auditoría estática correcta.
- Auditoría estática: 178 identificadores únicos, 43 botones enlazados según el código, 15 misiones, 3 desafíos, 8 secretos y 3 secundarios.
- Tres pruebas nuevas verifican ambas decisiones al avanzar de la misión 14 a la 15, el caso de almacenamiento bloqueado y que ninguna misión incompleta sobrescriba la decisión previa.

## Riesgos y pruebas abiertas
- No se ha realizado un recorrido jugable humano de las quince misiones; las pruebas de lógica y simulación **no sustituyen** los desplazamientos reales, las colisiones y el equilibrio de tiempos.
- Probar en navegador real ambas rutas de la misión 14, avanzar con «SIGUIENTE», jugar la 15 y comprobar el resultado. Repetir tras recargar para confirmar persistencia cuando esté habilitada.
- Comprobar derrota por captura, pérdida de contacto y tiempo en partidas reales; confirmar la recuperación con «REPETIR».
- WebGL, FPS, sonido y comportamiento móvil siguen pendientes de certificación en dispositivos reales.

**Decisión de QA:** fase auditada automáticamente; **no certificada como campaña íntegramente jugada ni apta para release final**.
