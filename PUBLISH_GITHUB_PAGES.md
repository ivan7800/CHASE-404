# Publicar CHASE 404 en GitHub Pages (manual)

**No se ha publicado desde esta entrega.** La automatización de despliegue solamente se inicia manualmente desde GitHub Actions.

**Estado 0.14.7:** alpha para pruebas. Las correcciones de progreso pasan pruebas automatizadas, pero falta validar en navegador real la campaña, los dos finales, WebGL, rendimiento y controles. El workflow técnico no certifica esas pruebas jugables.

1. Crea un repositorio público, por ejemplo `CHASE-404`, o utiliza uno propio.
2. Sube **los contenidos de `CHASE-404/` a la raíz** (no subas una segunda carpeta `CHASE-404` anidada). Comprueba que `index.html`, `src/`, `styles/`, `assets/`, `.github/` y `.nojekyll` estén en la raíz.
3. Ve a **Settings → Pages → Build and deployment** y elige **GitHub Actions** como origen.
4. Espera a que termine la acción `Static QA` y verifica que pasa.
5. Ve a **Actions → Deploy GitHub Pages → Run workflow** en la rama principal y ejecuta manualmente.
6. Comprueba `https://<usuario>.github.io/<nombre-repo>/`. Una publicación bajo subdirectorio usa rutas relativas.
7. Realiza una prueba de humo: carga de modelos, arranque, conducción, bajar del coche, menús, sonido voluntario y progreso tras refrescar.

**Límites:** QA automatizada no sustituye una sesión completa jugando. No se habilita un trigger `push` para desplegar. Si se cambia el nombre de la rama principal, selecciona esa rama al ejecutar el flujo.

Para jugar sin publicarlo, ejecuta los lanzadores locales que usan Python 3.

## Comprobación previa a la publicación (10.3)

Ejecuta `npm run audit` y `python3 tools/first_run_check.py`. `npm run site:prepare` crea `_site/` exclusivamente con `index.html`, `.nojekyll`, `assets/`, `src/` y `styles/`; si faltan dependencias locales, el proceso falla. El workflow utiliza exactamente esa carpeta. `_site/` se genera de nuevo y no debe incorporarse al ZIP del proyecto ni al repositorio.

Esta comprobación **no** sustituye las partidas completas, pruebas visuales, móviles, FPS ni ambas rutas finales.
