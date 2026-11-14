# CHASE 404 v0.20.0 — Jugabilidad en el Carmel

Base de trabajo: `cd04e4e`. Auditoría inicial: 413/413 pruebas, arranque HTTP 7/7 y aceptación técnica 18/18.

Se reprodujo un fallo de arranque cuando el navegador impide acceder a `localStorage`. Las regresiones cubren marcha atrás, aviso de barrera, acceso a un coche detenido, rutas y cruces, posición inicial de campaña, evasión sin patrullas activas y entradas de mando estándar.

Pendientes de aceptación final: partidas completas por las dos ramas con controles de jugador, Windows y Linux Mint con lanzadores, móvil y mando físicos, escucha y medidas de rendimiento de una sesión larga. Las pruebas de campaña alimentan el motor de misiones con posiciones controladas.

## Validación de la candidata

- Auditoría completa: 420/420 pruebas, 6/6 modelos GLB, 48 botones enlazados en el auditor estático y 69 archivos en la distribución web.
- Arranque HTTP: 7/7. Puerta de aceptación técnica: 18/18, con aceptación manual pendiente.
- Chromium en Linux con WebGL por SwiftShader, sirviendo la distribución desde `/CHASE-404/`: portada, objetivo inicial, pausa y vuelta, conducción, caminar, cámara, ajustes, activación de Web Audio y arranque con almacenamiento bloqueado. Sin errores JavaScript ni recursos fallidos en este recorrido.
- Chromium con mando estándar emulado: reanudación de capítulo guardado, arranque, aceleración, pausa, vuelta, desconexión y regreso al teclado.
- Chromium con emulación táctil: arranque, entrada y salida del coche, controles visibles tras pasar de vertical a horizontal (844 × 390) y aceleración táctil. Se corrigió la altura mínima de 540 px que dejaba los controles fuera de pantalla.
