# Fase 10.8 — triaje de incidencias y aceptación · v0.12.4

## Objetivo
Facilitar el cierre de incidencias de aceptación sin inventar resultados de pruebas reales.

## Cambios
- `tools/qa_triage.mjs`: lee `ACEPTACION_EVIDENCIAS.json` sin modificarlo, resume fallos, bloqueos, pendientes y evidencias incompletas; no muestra descripciones privadas.
- `npm run qa:triage`: diagnóstico con código de salida distinto de cero mientras no se declaren aprobados los doce criterios.
- Cuatro pruebas automatizadas sobre estados, privacidad de la salida, evidencia insuficiente y entradas desconocidas.
- `.gitignore`: excluye el acta personal y `_site/`.
- No cambia la jugabilidad, los controles ni el sistema de misiones.

## Resultados
- Pruebas automáticas: 340/340.
- Aceptación técnica: 18/18; resultado: `PENDING_MANUAL_ACCEPTANCE`.
- Diagnóstico HTTP: 7/7.
- Staging GitHub Pages: 55 archivos.
- Faltan pruebas reales de las 15 misiones, ambos finales, controles, Windows/Linux, móviles, audio y FPS. El triaje no las realiza ni las certifica.

## Flujo de usuario
1. Ejecutar el juego en el equipo real y seguir `ACEPTACION_MANUAL.md`.
2. Inicializar el acta: `npm run qa:manual -- init`.
3. Registrar solamente observaciones efectivas con `npm run qa:manual -- record ...`.
4. Consultar bloqueos: `npm run qa:triage`; un código de error mientras haya pendientes es lo esperado.
5. Verificar el cierre: `npm run acceptance:play`.

No se ha subido nada a GitHub ni se ha autorizado una versión 1.0.
