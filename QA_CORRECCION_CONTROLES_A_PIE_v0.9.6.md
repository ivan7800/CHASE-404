# CHASE 404 — Auditoría del movimiento a pie · v0.9.6

**Fecha:** 12 de octubre de 2026 · **Base:** v0.9.5 ALPHA · **Entrega:** v0.9.6 ALPHA

## Incidencia comunicada
El jugador confirma que conducir funciona bien pero caminar tras pulsar **E** se siente invertido o responde de forma inconsistente.

## Causa raíz verificada mediante revisión del código
1. `src/on-foot.js` calculaba el avance `vz=f*pace` y el lateral `vx=s*pace`: movimientos absolutos en el mundo, independientemente de cómo estuviera orientada la cámara después de aparcar.
2. `src/camera-rig.js` alineaba la cámara al `yaw` del cuerpo al caminar; como el cuerpo giraba con cada tecla, la orientación de la cámara cambiaba a la vez. El resultado aparente variaba al avanzar, retroceder o desplazarse a izquierda/derecha.
3. El límite para elegir un punto de salida del coche admitía hasta `CITY.sidewalkHalf+3`, pero caminar requería `CITY.sidewalkHalf+2`. En el borde de la calle podía aparecer en terreno que el siguiente paso consideraría bloqueado.

## Corrección implementada
- Nuevo `viewYaw` para el rumbo visual a pie; se fija con `car.yaw` al bajarse.
- Vectores peatonales relativos a `viewYaw`, con avance `(+sin θ,+cos θ)` e izquierda `(+cos θ,-sin θ)`; se normaliza la diagonal. A y D siempre equivalen a izquierda/derecha de la pantalla, aunque Gael se gire corporalmente.
- Cámara a pie sigue `viewYaw`, no la orientación del cuerpo; al conducir se utiliza el sistema de cámara existente sin cambios.
- Punto de aparición dentro de la misma zona transitable que usa la colisión peatonal.
- Cambios de interfaz y documentación de controles.

## QA automatizada
Ejecutar `npm run audit` desde la raíz del proyecto. Incluye: sintaxis, suite Node, validación de los 6 GLB, auditoría estática de botones y rutas.

**Nuevas verificaciones específicas:**
- Salir del vehículo mirando hacia +X y caminar lateralmente sin rotar el rumbo de cámara.
- Movimientos W/A/S/D en cinco orientaciones de cámara, con signos correctos en proyecciones frontal y lateral.
- Giro corporal y diagonal sin alterar `viewYaw`.
- Cámara a pie estable con giro independiente de Gael.
- Salida del coche en el límite del corredor sin quedar atrapado.
- Pruebas anteriores de entrar/subir a vehículos y cámara cinematográfica, sin modificar física de automóviles.

## Límites
Las pruebas automáticas ejecutan la matemática de movimiento y renderizado de cámara, pero no simulan las sensaciones de teclado/joystick ni confirman el aspecto WebGL. Se requiere validación manual según `MANUAL_QA_CONTROLES_A_PIE_v0.9.6.md`. Estado ALPHA. No publicado en GitHub.
