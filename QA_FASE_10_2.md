# Fase 10.2 — Distribución y primera ejecución

**Versión:** 0.11.8 ALPHA. **Criterio:** candidato técnico, no release final certificada.

## Cambio funcional

Se incluye `tools/first_run_check.py`, una prueba HTTP de extremo a extremo del servidor local sin depender de Chromium. Comprueba `/`, `index.html`, módulo principal JS, CSS, dos modelos GLB y error HTTP 404. Usa puerto efímero y solo loopback (`127.0.0.1`), y cierra el servidor al finalizar.

La documentación `PRIMER_ARRANQUE.md` explica el lanzamiento en Windows/Linux Mint y los síntomas de página en blanco, botón inactivo, `file://` y errores 404 en GitHub Pages. El flujo de QA y el despliegue manual ejecutan la prueba HTTP; la puerta de distribución comprueba la documentación y la herramienta.

## Auditoría

- Ejecutar `npm run audit` (pruebas, sintaxis, GLB, estructura UI y distribución).
- Ejecutar `python3 tools/first_run_check.py` (siete comprobaciones HTTP).
- Comprobar archivo ZIP y ejecución de ambos comandos una vez extraído.
- **Pendiente:** abrir y jugar en navegadores Windows/Linux/móvil; medir FPS, memoria, sonido y ambas ramas completas de campaña.

**No hubo cambios** en físicas, cámaras, movimiento a pie, diálogos, economía, decisiones o contenidos de misión.
