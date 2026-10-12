# CHASE 404 — QA fase 3.9, v0.5.8

## Implementado
- Movimiento a pie con comprobación interpolada de colisiones para limitar atravesar coches entre ticks.
- Deslizamiento por ejes en caso de colisión, para evitar quedarse bloqueado al rozar un vehículo.
- Carrera a pie manteniendo la acción `handbrake` (Shift/Espacio según configuración actual).
- Avatar con movimiento procedural de extremidades independiente del modelo corporal existente.
- Tres casos de prueba adicionales sobre colisión barrida, animación en reposo y velocidad.

## Pruebas ejecutadas (2026-10-11)
- `npm test`: EXIT 0, **106 pruebas superadas**.
- `npm run check`: EXIT 0, comprobación de sintaxis de scripts.
- `npm run assets:validate`: EXIT 0, **6/6 GLB válidos**.
- Integridad del ZIP: verificada al empaquetar.

## Límites
- No se ha validado en una sesión interactiva WebGL; la calidad de las animaciones no está certificada visualmente.
- La silueta corporal previa sigue presente debajo de las extremidades móviles; animación provisional, sin rigging.
- Colisiones a pie limitadas a áreas transitables cerca de las vías y volúmenes simplificados de vehículos; sin colisiones detalladas con fachadas ni escaleras.
- Policía a pie y misiones completas pendientes de refinamiento; la campaña de cuatro actos aún no existe.
- Rendimiento en Windows/Linux y carga real de GitHub Pages no comprobados aquí.

## Gate de fase 3
**PENDING**: lógica básica verificada, aceptación jugable y comportamiento visual por verificar. No declarar Fase 3 completa.
