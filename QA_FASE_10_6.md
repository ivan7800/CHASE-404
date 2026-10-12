# Fase 10.6 — Cierre del candidato técnico · v0.12.2

El candidato **no está certificado como versión 1.0**. La campaña se ha recorrido en simulaciones de lógica, no en un navegador real durante una partida completa.

## Novedad verificable

Se añade una puerta de aceptación jugable independiente (`npm run acceptance:play`) con doce criterios A01–A12. Por defecto falla si no existe `ACEPTACION_EVIDENCIAS.json`; también falla si hay algún criterio pendiente, faltan evidencias, fecha o entorno, o existen identificadores duplicados. Su plantilla (`ACEPTACION_EVIDENCIAS_EJEMPLO.json`) está expresamente marcada como pendiente. Esta puerta no aprueba por sí sola la autenticidad de las evidencias: exige que una persona real las recopile y revise.

## Requisitos de salida

1. `npm run audit`, `npm run first-run:check`, `npm run acceptance:gate`: auditoría técnica.
2. Copiar plantilla a `ACEPTACION_EVIDENCIAS.json` y registrar hechos observados, fecha, dispositivo/navegador y archivo o ubicación verificable de cada evidencia.
3. Ejecutar `npm run acceptance:play`, **solo tras realizar las pruebas reales**. No se incluye ni se genera un acta ficticia aprobada.
4. Revisar manualmente A01–A12, incluyendo ambas rutas finales y GitHub Pages, antes de llamar al proyecto versión 1.0.

No se ha publicado nada en GitHub y no se han cambiado controles ni físicas.
