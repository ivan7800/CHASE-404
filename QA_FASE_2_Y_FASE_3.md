# CHASE 404 — Informe de transición Fase 2 → Fase 3 (v0.5.0)

## Fase 2: estado BLOCKED para cierre artístico
El ZIP v0.4.3 integra acabados del coche y decoraciones de El Carmel. No hay evidencia visual suficiente para dar por aprobada la Fase 2: Chromium devuelve `net::ERR_BLOCKED_BY_ADMINISTRATOR` incluso en `127.0.0.1`; falta prueba visual real y valoración de rendimiento. Blender no está instalado aquí. El gate artístico sigue abierto. No equivale a que la Fase 2 esté validada.

## Fase 3: incremento 3.1 implementado (ALPHA)
Se ha añadido `src/traffic.js`, tráfico de siete agentes deterministas sobre polilíneas existentes, desplazamiento bidireccional y pausa al acercarse al protagonista. Se integra en `src/main.js` en la simulación de tiempo fijo y en el render de `src/renderer.js`, situando los modelos rivales a la cota del terreno.

**Limitaciones:** el tráfico aún no planifica rutas en cruces, no frena entre vehículos, no colisiona físicamente con el jugador, carece de semáforos, peatones y policía. No debe describirse como tráfico urbano completo ni IA avanzada. Los vehículos usan los modelos procedurales de rivales. Se conserva la modalidad circuito.

## Verificaciones realizadas
- `npm run check` → exit 0, sintaxis correcta.
- `npm test` → exit 0, 79/79 (incluye 3 pruebas nuevas de tráfico).
- `npm run assets:validate` → exit 0, 6/6 GLB válidos.
- `python tools/qa_mission_browser.py` → no ejecutable correctamente en esta infraestructura: Chromium bloquea la navegación HTTP local con `ERR_BLOCKED_BY_ADMINISTRATOR`. No es una prueba de navegador superada.
- Windows 10/11, Linux Mint y GitHub Pages: pruebas manuales pendientes.

## Prioridad siguiente
1. Ejecutar y documentar prueba visual en navegador real; corregir defectos y cerrar Fase 2.
2. Integrar semáforos y prevención de colisión entre coches.
3. Añadir persecución policial por contacto visual, alerta y búsqueda.
4. Daños, interacción y cambio de vehículo, con tests E2E y regresión.

## Release gate
ALPHA / QA ARTÍSTICA BLOCKED. No es RC, ni STABLE, ni apto para publicar sin validaciones esenciales. No publicar automáticamente.
