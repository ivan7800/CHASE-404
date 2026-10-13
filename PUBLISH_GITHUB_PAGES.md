# CHASE 404 en GitHub Pages

**Repositorio:** [ivan7800/CHASE-404](https://github.com/ivan7800/CHASE-404/)  
**Juego publicado:** [ivan7800.github.io/CHASE-404](https://ivan7800.github.io/CHASE-404/)

La app se sirve bajo `/CHASE-404/`. Usa rutas relativas para HTML, módulos y modelos. Sigue en **ALPHA**: el despliegue comprueba que se publica el sitio, pero las partidas completas y el rendimiento requieren la [aceptación manual](ACEPTACION_MANUAL.md).

## Publicar una actualización

1. Integra en `main` el cambio tras pasar `Static QA`. Este flujo ejecuta `npm run audit`, una prueba de arranque HTTP y `npm run acceptance:gate`.
2. Consulta **Actions** y confirma que `pages build and deployment` termina correctamente para el commit de `main`. GitHub ha iniciado ese despliegue del sitio al actualizar `main`.
3. Si no aparece el despliegue, ejecuta **Actions → Deploy GitHub Pages → Run workflow** en `main`. El flujo `.github/workflows/deploy-pages.yml` conserva el disparador manual `workflow_dispatch`.
4. Abre el enlace público, confirma la versión del HUD y prueba carga de modelos, arranque, conducción, caminar, menús y progreso tras refrescar.

Para una preparación local, ejecuta `npm run audit`, `python3 tools/first_run_check.py` y `npm run acceptance:gate` con Node 22+ y Python 3. `npm run site:prepare` genera `_site/` con los recursos publicables; esa carpeta se regenera y no debe subirse al repositorio.

La prueba estática y GitHub Pages no sustituyen WebGL, sonido, controles táctiles, FPS ni una partida completa con ambos finales.
