# QA — Fase 10.3, versión 0.11.9

## Alcance
Se comprueba la distribución estática para GitHub Pages, sin cambiar la conducción ni los datos guardados. El comando `npm run site:prepare` genera `_site/` con la lista cerrada `index.html`, `.nojekyll`, `assets/`, `src/` y `styles/`. Comprueba entradas esenciales, las referencias de recursos de la portada y los imports relativos de módulos del juego. El workflow manual utiliza el mismo script.

## Criterios de aceptación
- Auditoría JS, assets, interfaz y puerta de release: `npm run audit`.
- Verificación de primer arranque HTTP: `python3 tools/first_run_check.py`.
- El ZIP distribuye el proyecto completo, no `_site/` generado.
- Publicación solo por `workflow_dispatch`, no push automático.

## Limitaciones abiertas
No se han certificado partidas completas ni los dos finales en navegador real. Faltan validación WebGL, sonido, controles táctiles y mediciones de FPS/RAM en Windows, Linux Mint y móvil. El estado sigue siendo ALPHA; no declarar 1.0.
