# CHASE 404 — QA Fase 9.2 (v0.11.2)

## Alcance
Auditoría de los atajos de teclado, botones y navegación sobre v0.11.1. No se han modificado física, dirección, movimiento peatonal ni misiones.

## Incidencias corregidas
- Con Ayuda abierta, varias teclas globales (`R`, `E`, `C`, `M`, etc.) todavía podían ejecutar acciones de juego. Ahora únicamente `H`, `Escape` y `P` pueden cerrar el panel.
- Durante la pausa y antes de iniciar, ciertas teclas seguían intentando ejecutar acciones globales como reiniciar. Se restringen a `Escape`, `P`, `O` y `H`.
- Cuando un botón recibía el foco por teclado, sus pulsaciones podían alcanzar el manejador global; ahora se deja actuar al botón sin interpretar la misma pulsación como comando del juego.
- Ayuda no se abre por encima de los paneles narrativos, ajustes, archivo, taller o garaje.

## Evidencia reproducible
`npm run audit`: **314/314 pruebas**; JS `--check` correcto; **6/6 GLB** válidos; auditoría estática correcta (**178 IDs**, **43 botones con registro de acción identificable**, **15 misiones**, **3 desafíos**). Tests añadidos: `tests/navigation-guard.test.js` (cuatro casos).

## Límites
La detección estática de listeners no certifica clics funcionales. No se ha podido probar una sesión WebGL interactiva ni navegación táctil en dispositivo real. Repetir en Windows, Linux Mint y móvil, con las dos rutas finales y guardados existentes.

## Checklist manual
1. En conducción activa, comprobar WASD y C; no deberían haber cambiado.
2. Abrir Ayuda con H; pulsar R, E, M y C: no deben modificar el juego. Cerrar con H, P o Escape.
3. Pausar con P y pulsar R/E/Y/T/C: no deben activarse. Continuar con P.
4. En pausa, abrir Ajustes con O y cerrar con Escape. Cambiar foco mediante Tab y activar botones con Intro o Espacio; no se deben ejecutar acciones globales a la vez.
5. Abrir taller, garaje, archivo, diálogo y escenas; comprobar que Escape cierra uno solo y devuelve el control.
6. Comprobar controles táctiles, cambio de coche y los dos desenlaces de la campaña.
