# CHASE 404 — Barcelona 1984

**Versión 0.16.0 ALPHA · Ciudad jugable.** Los edificios principales tienen colisión para coche y peatón, las parcelas residenciales dejan libres las calles y unas cincuenta casas reciben fachadas orientadas hacia el vial. El terreno distante usa menos geometría. La revisión visual en WebGL y los FPS siguen pendientes de prueba manual.

Videojuego original de conducción arcade ambientado en una Barcelona ficticia y condensada de 1984. Incluye 15 misiones principales, dos desenlaces, tres encargos secundarios, exploración libre, seis modelos de coches, taller, garaje, secretos y personajes con historias secundarias. Se ejecuta en el navegador con WebGL y archivos locales; no requiere cuenta, servidor remoto ni servicios externos.

## Jugar en Windows o Linux

1. Descomprime el paquete.
2. En Windows, ejecuta `INICIAR_WINDOWS.bat`; en Linux Mint, ejecuta `bash INICIAR_LINUX.sh`.
3. Necesitas **Python 3** instalado. Se abre un servidor solo en `127.0.0.1` y el navegador predeterminado. **No abras** `index.html` mediante `file://`.
4. En la pantalla de inicio, selecciona `BCN · EL CARMEL — 1984`; elige campaña, exploración o un desafío.

La campaña guarda el **siguiente capítulo desbloqueado** al completar una misión. Al volver a abrir el juego, la portada ofrece continuar ese capítulo. `NUEVA CAMPAÑA` reinicia solo el avance narrativo y sus decisiones; conserva coches, créditos y registros de los demás modos. Una misión a medias comienza de nuevo al recargar. Si el navegador bloquea `localStorage`, el juego avisa y el avance no sobrevivirá al cierre.

Node.js **no es necesario para jugar**. Para ejecutar QA se necesita Node 22+: `npm run audit`.

## Controles esenciales

| Acción | Tecla |
| --- | --- |
| Acelerar/frenar y dirección | W/S/A/D o flechas |
| Entrar o salir del coche | E |
| Correr a pie | Espacio |
| Cambiar/recentrar cámara | C |
| Taller / garaje | T / Y |
| Investigar / archivo | X / I |
| Conversar / diario de contactos | N / J |
| Cambiar iluminación / audio | B / M |
| Ajustes / pausar | O / P |

También hay botones táctiles. La conducción y el desplazamiento a pie tienen esquemas diferentes adaptados a la cámara.

## Publicación en GitHub Pages

Consulta **[PUBLISH_GITHUB_PAGES.md](PUBLISH_GITHUB_PAGES.md)**. La publicación está configurada como **manual** (`workflow_dispatch`); no se activa al subir archivos. Debes crear el repositorio, colocar los contenidos de esta carpeta en su raíz, activar GitHub Pages con origen **GitHub Actions** y ejecutar el flujo «Deploy GitHub Pages» desde Actions. Para un repositorio `CHASE-404`, la ruta sería `https://<usuario>.github.io/CHASE-404/`. Las rutas del proyecto son relativas, compatibles con ese subdirectorio.

## Seguridad, datos y límites

Los ajustes y avances se almacenan en `localStorage` del navegador. Borrar datos del sitio puede eliminar el progreso. No hay sincronización en la nube. El juego usa representaciones ficticias de vehículos, lugares y personajes; no es una reconstrucción histórica exacta.

## Verificación y estado

Las colisiones y el remate urbano de esta versión se documentan en [QA_v0.16.0.md](QA_v0.16.0.md). La fase visual anterior se describe en [docs/FASE_11_23_EL_CARMEL.md](docs/FASE_11_23_EL_CARMEL.md).

- `npm run audit`: sintaxis, tests, assets, conexiones estáticas de UI y puerta de distribución.
- `npm run release:gate`: presencia de recursos, consistencia de versión y archivos de publicación.
- `npm run site:prepare`: genera `_site/` y verifica rutas, imports y ausencia de herramientas de desarrollo.
- Los controles marcados como «conectados» en el auditor estático no equivalen a botones pulsados con navegador real.
- **Pendiente:** campaña completa con ambas ramas, juego móvil, WebGL y sonido reales, FPS y sesiones prolongadas.

Para solucionar incidencias de inicio, consulta **[PRIMER_ARRANQUE.md](PRIMER_ARRANQUE.md)**. La prueba HTTP local se ejecuta con `python3 tools/first_run_check.py` (Windows: `py -3 tools\first_run_check.py`). No valida WebGL ni clics reales.

Consulta [QA_FASE_10_3.md](QA_FASE_10_3.md), [QA_FASE_10_2.md](QA_FASE_10_2.md) y [QA_FASE_10_1.md](QA_FASE_10_1.md), los informes anteriores y [docs/HISTORICO_README.md](docs/HISTORICO_README.md) para el historial técnico. La licencia MIT se incluye en [LICENSE](LICENSE).

## Aceptación del candidato

Ejecuta `npm run audit && npm run acceptance:gate`. La segunda orden genera `ACEPTACION_TECNICA.json`, que distingue controles automatizados de las pruebas manuales pendientes. Consulta `ACEPTACION_MANUAL.md`. La opción `npm run acceptance:gate -- --require-manual` **bloquea expresamente la certificación final**, porque todavía no existen evidencias de partidas completas.

## Aceptación jugable antes de versión 1.0

Consulta `ACEPTACION_MANUAL.md` y `QA_FASE_10_6.md`. La plantilla `ACEPTACION_EVIDENCIAS_EJEMPLO.json` mantiene los doce criterios pendientes; tras probar de verdad, registra las observaciones en `ACEPTACION_EVIDENCIAS.json` y ejecuta `npm run acceptance:play`. Esta comprobación no convierte automáticamente las evidencias declaradas en una certificación independiente.

## Registro de aceptación real

Consulta `GUIA_QA_MANUAL.md` y utiliza `npm run qa:manual -- init` para crear un acta local de 12 pruebas pendientes. El juego puede seguir ejecutándose sin Node.js; Node.js se necesita para ejecutar las herramientas de QA.
