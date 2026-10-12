# CHASE 404 — QA Fase 5.5 · v0.8.4 ALPHA

**Fecha:** 2026-10-12
**Alcance:** secretos, exploración libre, recompensas, archivo, compatibilidad con Fase 5.4, controles táctiles y contenido 3D.

## Comprobaciones ejecutadas

| Comprobación | Resultado | Alcance |
|---|---|---|
| `npm test` | **PASS · 204/204** | Motor, misiones, desafíos, taller, garaje y nueve pruebas nuevas de descubrimientos/integración UI |
| `npm run check` | **PASS** | Sintaxis JavaScript en todos los módulos existentes y `src/discoveries.js` |
| `npm run assets:validate` | **PASS · 6/6** | GLB locales (coches) |
| Marcadores y vías | **PASS · lógica** | Ocho localizaciones a menos de 14,5 unidades de la red vial; Montjuïc recolocado tras detectar punto inaccesible |
| Sistema económico | **PASS · lógica** | 45 ₧ por pista, +180 ₧ al registrar la octava; cobro único y bloqueado tras descubrimiento |
| Persistencia | **PASS · lógica** | Las pistas, premios, récords y mejoras comparten `chase404.side.v1`; compatibilidad con v0.8.3 |
| Guardado bloqueado | **PASS · lógica** | Si `localStorage.setItem` falla, la propuesta no modifica el saldo ni se marca la pista como conseguida |
| Datos corruptos | **PASS · lógica** | IDs falsos, repetidos o con tipos inválidos se descartan al cargar |
| UI / controles | **PASS · análisis estático** | Referencias JavaScript a IDs existentes, sin IDs HTML repetidos, conexión declarada de botones Archivo, Explorar, Examinar y E táctil |
| Modos de juego | **PASS · código e inspección** | Exploración libre no llama a `stepMission` y muestra tiempo transcurrido; campaña y desafíos conservan sus funciones |
| Integridad ZIP | **PASS** | `unzip -t` sobre el paquete final, sin entradas corruptas |

## Advertencias y pruebas no ejecutadas

- **No hay prueba real en un navegador con WebGL.** Intentos anteriores con Chromium en este entorno fallaron con `ERR_BLOCKED_BY_ADMINISTRATOR`. Los controles, superposiciones, hit-testing, punteros y animaciones requieren validación visual manual.
- **No se ha ejecutado una partida completa en Windows ni Linux Mint**, ni se han medido FPS o consumo de memoria. El motor 3D crea ocho placas procedimentales estáticas: su visibilidad a distintas horas/cámaras no está certificada.
- El plano de Barcelona sigue siendo **una interpretación ficticia y condensada de 1984**. Los ocho relatos son ficción original, no documentos históricos verificables.
- Los puntos se validan geométricamente contra el grafo vial; no hay una prueba navegable end-to-end que garantice que cada uno esté libre de edificios o barreras.
- Los marcadores permanecen en el escenario tras descubrirse; el minimapa y el archivo muestran el estado obtenido. No son NPC animados ni objetos físicamente recogidos.
- El modo libre sigue permitiendo patrullas policiales y daños. Al ser detenido, Gael reaparece en el inicio sin perder los descubrimientos guardados.

## Plan de aceptación manual

1. Abrir `INICIAR_WINDOWS.bat` / `INICIAR_LINUX.sh`. Seleccionar **BCN**, pulsar **EXPLORACIÓN LIBRE** y **INICIAR MOTOR**. El cronómetro debe avanzar sin agotar una misión.
2. Localizar un punto dorado del minimapa, detener el vehículo, bajar con **E** o botón táctil, acercarse a la placa y pulsar **X** / **EXAMINAR PISTA**.
3. Verificar que se abre el archivo, aparece el relato y se ingresan **45 ₧**. Cerrar con **Esc**, **I** o **VOLVER A BARCELONA**. Volver a la misma placa: no se debe cobrar otra vez.
4. Registrar las ocho pistas; comprobar saldo y **180 ₧** extra por completar la colección. Salir y recargar: el archivo debe mantener el **8/8**.
5. Comprar una mejora en el taller y completar un desafío; comprobar que las nuevas transacciones mantienen el progreso del archivo.
6. Cambiar al modo campaña y completar una misión: verificar que sus marcadores y finales siguen funcionando, y que la exploración libre no adelantó el capítulo.
7. En móvil, verificar el botón **↕ E · COCHE**, los botones de dirección, **EXAMINAR** y la pantalla del archivo con scroll y cierre.
8. Comprobar superposiciones, consola JavaScript y estabilidad de WebGL. Medir FPS en Windows y Linux Mint. 

**Gate:** código y lógica automatizada correctos; **NO CERTIFICADO** para publicación final por ausencia de validación de navegador real. Estado ALPHA. GitHub no publicado.
