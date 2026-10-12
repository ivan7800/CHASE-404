# CHASE 404 — Fase 10.5 · Validación de campaña simulada

Esta fase añade cuatro pruebas de integración deterministas: 15 misiones consecutivas para cada combinación de AVENIDA OESTE/CALLE DE SERVICIO y RESCATAR A MI HERMANO/RECUPERAR LAS PRUEBAS. Comprueba que cada objetivo avanza, que los capítulos terminan en victoria y que la elección final se propaga. **La simulación coloca al jugador en los objetivos y no conduce realmente, no mide FPS, no reproduce interludios y no prueba el navegador.**

Se ha eliminado la dependencia de la cadena de versión fija en `tools/acceptance_gate.mjs`; la puerta ahora compara el README con `package.json`.

## Condiciones pendientes de aceptación real

Los doce puntos de `ACEPTACION_MANUAL.md` siguen PENDIENTES: arranque Windows y Linux, controles, las 15 misiones jugando, ambas rutas finales, actividades, accesibilidad, sonido, móvil, FPS/RAM y GitHub Pages. No autorizar publicación ni etiquetar 1.0 sin evidencias.
