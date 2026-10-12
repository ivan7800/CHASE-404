# Fase 10.1 — Preparación para GitHub Pages

Versión 0.11.7 ALPHA; candidato técnico, **no release final certificada**.

## Cambios
- README actual y conciso; histórico anterior preservado en `docs/HISTORICO_README.md`.
- Archivo `.nojekyll`, licencia MIT y pasos de publicación manual.
- Flujo `deploy-pages.yml` exclusivamente manual: ejecuta auditoría, prepara `_site` con `index.html`, `.nojekyll`, `src`, `assets` y `styles`, y despliega en Pages.
- Puerta de distribución ampliada y versión visible sincronizada.
- Sin alteraciones en conducción, física, controles a pie, misiones ni guardados.

## Comprobaciones
- `npm run audit`: pendiente de registrar al generar este archivo.
- `npm run release:gate`: asegura presencia de documentación y despliegue manual.
- Pendiente: validación de despliegue en GitHub real y partidas completas, WebGL/FPS/móvil reales.
