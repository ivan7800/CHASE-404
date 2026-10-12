# QA · CHASE 404 v0.8.2 — Fase 5.3

## Alcance implementado
- Garaje privado exterior junto a `(-22,168)` en El Carmel. Entrada junto a la vía, fachada con persiana y marcador ámbar en el minimapa.
- Botón «GARAJE» y tecla Y; únicamente coche detenido dentro del radio de 22 m, sin persecución policial.
- Interfaz accesible: cerrar con Esc o botón, foco inicial al cerrar, tabulación cíclica, estado y nombre de cada coche.
- Colección persistida `chase404.collection.v1`: máximo seis modelos únicos y daño por modelo, saneamiento contra datos alterados.
- Guardar un modelo por primera vez, actualizar su estado y recuperar otro. El cambio primero persiste los daños del coche activo y después aplica el modelo/daño/tuning seleccionado.
- Se conservan `chase404.side.v1`, las decisiones de la campaña, los récords y los modelos arcade.

## Evidencia automatizada
- `npm run check`: **PASS** (incluye el módulo `src/vehicle-collection.js`).
- `npm test`: **182/182 PASS**, siete casos nuevos para disponibilidad, guardado, actualización, límite, datos corruptos, errores de almacenamiento, mejoras y cambio atómico.
- `npm run assets:validate`: **6/6 GLB PASS**.
- Análisis de ids HTML: **127 únicos**, ninguna referencia `$()` de `src/main.js` apunta a un id inexistente.

## Evidencia no conseguida
- `playwright` + `/usr/bin/chromium` + `http.server 127.0.0.1:8764`: `net::ERR_BLOCKED_BY_ADMINISTRATOR`. **BLOQUEADO**, no cuenta como PASS de navegador.
- No se ha navegado físicamente con GPU a la fachada ni probado intercambio mediante clicks en un navegador operativo. No se midieron FPS en Windows ni Linux Mint.
- No se ha realizado una pasada manual integral de las quince misiones con la nueva colección.

## Prueba manual requerida antes de publicación
1. Abrir versión con `INICIAR_WINDOWS.bat` o `INICIAR_LINUX.sh` y entrar a Barcelona.
2. Ir al cuadrado ámbar (-22,168), detener coche y pulsar Y; validar también botón GARAJE.
3. Guardar el vehículo, cerrar (Escape), volver a abrir y confirmar que aparece una sola vez.
4. Conducir otro de los seis modelos hasta el garaje y guardarlo; recuperar el primero y verificar nombre/renderizado, velocidad y daños.
5. Repetir tras recibir daños y con mejoras compradas, recargar navegador y comprobar persistencia.
6. Intentar abrir a pie, en movimiento, en modo circuito y con policía persiguiendo: debe negarse.
7. Probar Esc/Tab en overlay, resolución móvil y controles táctiles; comprobar fps y consola.

**QA gate: PENDING.** No etiquetar como release estable o '9.5/10' sin prueba visual/jugable real.
