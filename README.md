# CHASE 404 — Barcelona 1984

**Versión 0.23.0 ALPHA · A pie de calle.** Cruces redondeados, viviendas con fachadas orientadas a las calles del Carmel, una fila de comercios y una placeta en Gràcia, y un paseo arbolado en el Guinardó. El modo libre incluye encargos, peatones y búsqueda policial. [Diseño de campaña](CAMPAÑA.md).

Videojuego original de conducción arcade ambientado en una Barcelona ficticia y condensada de 1984. Incluye 15 misiones principales, dos desenlaces, tres encargos secundarios, exploración libre, seis modelos de coches, taller, garaje, secretos y personajes con historias secundarias. Se ejecuta en el navegador con WebGL y archivos locales; no requiere cuenta, servidor remoto ni servicios externos.

## Jugar en Windows o Linux

1. Descomprime el paquete.
2. En Windows, ejecuta `INICIAR_WINDOWS.bat`; en Linux Mint, ejecuta `bash INICIAR_LINUX.sh`.
3. Necesitas **Python 3** instalado. Se abre un servidor solo en `127.0.0.1` y el navegador predeterminado. **No abras** `index.html` mediante `file://`.
4. En la pantalla de inicio, selecciona `BCN · EL CARMEL — 1984`; elige campaña, exploración o un desafío.

En exploración libre, busca los cuadrados azules del minimapa y acércate en coche a 12 km/h o menos. Los encargos pagan pesetas para el taller. Durante una persecución, gira para perder la línea de visión y mantente lejos de las patrullas hasta que termine la búsqueda.

La campaña guarda el **siguiente capítulo desbloqueado** al completar una misión. Al volver a abrir el juego, la portada ofrece continuar ese capítulo. `NUEVA CAMPAÑA` reinicia solo el avance narrativo y sus decisiones; conserva coches, créditos y registros de los demás modos. Una misión a medias comienza de nuevo al recargar. Si el navegador bloquea `localStorage`, el juego avisa y el avance no sobrevivirá al cierre.

Node.js **no es necesario para jugar**. Para ejecutar QA se necesita Node 22+: `npm run audit`.

## Controles esenciales

| Acción | Tecla |
| --- | --- |
| Acelerar/frenar y dirección | W/S/A/D o flechas |
| Entrar o salir del coche | E |
| Tomar o cancelar un encargo en exploración | U o botón del HUD |
| Correr a pie | Espacio |
| Cambiar/recentrar cámara | C |
| Taller / garaje | T / Y |
| Investigar / archivo | X / I |
| Conversar / diario de contactos | N / J |
| Cambiar iluminación / audio | B / M |
| Ajustes / pausar | O / P |

En pantallas táctiles hay controles para conducir, caminar, derrapar y correr. Con un mando de mapeo estándar, usa el stick izquierdo o la cruceta, RT/LT para acelerar/frenar, A para derrapar/correr, X para subir o bajar, Y para la cámara y Start para pausa/continuar. A también inicia desde la portada y avanza escenas. Los ajustes y otros menús se manejan con teclado, ratón o pantalla táctil. El mando se ha comprobado con entradas emuladas; queda pendiente un mando físico.

## Publicación en GitHub Pages

El juego está publicado en **[GitHub Pages](https://ivan7800.github.io/CHASE-404/)**. Para comprobar una actualización de `main`, el despliegue y la versión visible, consulta **[PUBLISH_GITHUB_PAGES.md](PUBLISH_GITHUB_PAGES.md)**. Las rutas relativas son compatibles con `/CHASE-404/`.

## Seguridad, datos y límites

Los ajustes y avances se almacenan en `localStorage` del navegador. Borrar datos del sitio puede eliminar el progreso. No hay sincronización en la nube. El juego usa representaciones ficticias de vehículos, lugares y personajes; no es una reconstrucción histórica exacta.

## Verificación y estado

Consulta [QA v0.23.0](QA_v0.23.0.md) para la comparación visual y la validación de esta versión.

Consulta [QA_v0.20.0.md](QA_v0.20.0.md) para la validación de esta versión. La geometría y los nuevos corredores urbanos se documentan en [QA_v0.19.0.md](QA_v0.19.0.md). La muestra anterior del Carmel está en [QA_v0.18.0.md](QA_v0.18.0.md). La fase anterior se documenta en [QA_v0.17.0.md](QA_v0.17.0.md). Las colisiones y el remate urbano anterior se describen en [QA_v0.16.0.md](QA_v0.16.0.md).

- `npm run audit`: sintaxis, tests, assets, conexiones estáticas de UI y puerta de distribución.
- `npm run release:gate`: presencia de recursos, consistencia de versión y archivos de publicación.
- `npm run site:prepare`: genera `_site/` y verifica rutas, imports y ausencia de herramientas de desarrollo.
- Los controles marcados como «conectados» en el auditor estático no equivalen a botones pulsados con navegador real.
- **Pendiente:** campaña completa con ambas ramas, juego en móvil físico, escucha en hardware real, FPS en GPU física y sesiones prolongadas.

Para solucionar incidencias de inicio, consulta **[PRIMER_ARRANQUE.md](PRIMER_ARRANQUE.md)**. La prueba HTTP local se ejecuta con `python3 tools/first_run_check.py` (Windows: `py -3 tools\first_run_check.py`). No valida WebGL ni clics reales.

Consulta [QA_FASE_10_3.md](QA_FASE_10_3.md), [QA_FASE_10_2.md](QA_FASE_10_2.md) y [QA_FASE_10_1.md](QA_FASE_10_1.md), los informes anteriores y [docs/HISTORICO_README.md](docs/HISTORICO_README.md) para el historial técnico. La licencia MIT se incluye en [LICENSE](LICENSE).

## Aceptación del candidato

Ejecuta `npm run audit && npm run acceptance:gate`. La segunda orden genera `ACEPTACION_TECNICA.json`, que distingue controles automatizados de las pruebas manuales pendientes. Consulta `ACEPTACION_MANUAL.md`. La opción `npm run acceptance:gate -- --require-manual` **bloquea expresamente la certificación final**, porque todavía no existen evidencias de partidas completas.

## Aceptación jugable antes de versión 1.0

Consulta `ACEPTACION_MANUAL.md` y `QA_FASE_10_6.md`. La plantilla `ACEPTACION_EVIDENCIAS_EJEMPLO.json` mantiene los doce criterios pendientes; tras probar de verdad, registra las observaciones en `ACEPTACION_EVIDENCIAS.json` y ejecuta `npm run acceptance:play`. Esta comprobación no convierte automáticamente las evidencias declaradas en una certificación independiente.

## Registro de aceptación real

Consulta `GUIA_QA_MANUAL.md` y utiliza `npm run qa:manual -- init` para crear un acta local de 12 pruebas pendientes. El juego puede seguir ejecutándose sin Node.js; Node.js se necesita para ejecutar las herramientas de QA.
