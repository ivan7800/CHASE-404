# CHASE 404 v0.8.6 · Checklist jugable (pendiente de ejecución)

Este checklist es para probar el ZIP **sin borrar los datos existentes**. Todas las casillas figuran inicialmente sin completar: ningún test de dispositivo se ha ejecutado durante la fase 5.7.

## Preparación

- [ ] Descomprimir en una carpeta nueva y arrancar mediante `INICIAR_WINDOWS.bat` o `bash INICIAR_LINUX.sh` (requiere Python 3). No abrir con `file://`.
- [ ] Abrir F12/Consola y comprobar que no hay errores JavaScript ni cargas fallidas (`404`). Comprobar WebGL y que los seis modelos de vehículos se representan correctamente.
- [ ] Anotar navegador, versión, sistema operativo, resolución, dispositivo y FPS aproximados. Probar recarga del navegador.

## Controles y menús

- [ ] Jugar con WASD y flechas; comprobar izquierda/derecha y freno de mano. Usar los controles táctiles si procede.
- [ ] En **AJUSTES**, confirmar que E/I/J/X no aparecen en la selección de teclas y que duplicar asignaciones sigue mostrando un error. Guardar un remapeo válido (por ejemplo K/L) y recargar.
- [ ] En coche detenido pulsar E; caminar, volver a entrar y comprobar el cambio de coche. Pulsar P/Esc, R, C y O. No debe haber botones mudos ni superposiciones que impidan interacción.
- [ ] Abrir/cerrar MODALES (ARCHIVO, VOCES, GARAJE, TALLER) y confirmar que el reloj se detiene y se recupera el foco.

## Campaña y persecuciones

- [ ] Jugar la misión 1 y comprobar recorrido, HUD, victoria, botón «MISIÓN 02» y reinicio por derrota.
- [ ] Jugar al menos una misión de **vigilancia**, **seguimiento**, **contacto a pie**, **investigación** y **extracción con policía**.
- [ ] Completar misión 8 por ambas salidas y confirmar continuidad diferenciada en misión 9.
- [ ] Completar misión 14 por rescate y pruebas en dos sesiones; misión 15 debe presentar el objetivo y epílogo correspondiente en cada caso.
- [ ] Provocar arresto, choque, pérdida de contacto, tiempo agotado y reinicio. No deben dejar el juego bloqueado ni activar un final anticipado.

## Sistemas de Fase 5

- [ ] El recado del taller, la contrarreloj y la carga delicada: completar, fallar, repetir y verificar premios y récords independientes.
- [ ] Taller del Carmel: reparación con daños, saldo insuficiente, dos niveles de mejora y persistencia tras recargar.
- [ ] Garaje Verenne: guardar dos modelos, cambiar entre ellos, conservar daños y mejoras, y recuperar la colección tras recargar.
- [ ] Exploración libre: recoger ocho placas a pie, abrir ARCHIVO, comprobar ocho historias y que no se duplican premios.
- [ ] Manel, Clara y Núria: aceptar encargo, recoger prueba, decidir entregar/copiar, abrir VOCES, recargar y comprobar decisión y saldo.
- [ ] Pasar de un modo a otro (carrera/Barcelona/campaña/desafío/exploración) y comprobar que ningún guardado pisa otro.

## Accesibilidad, rendimiento y aceptación

- [ ] Probar escritorio 1920×1080 y portátil 1366×768: verificar legibilidad, solapamientos, enfoque y scroll de menús.
- [ ] Probar móvil iPhone/Android en vertical y horizontal: conducción táctil, E para bajar, N/X, modalidades, botones, modales y scroll.
- [ ] Comprobar modo contraste, movimiento reducido, calidad automática y funcionamiento con sonido apagado.
- [ ] Medir FPS aproximados y anotar caídas bruscas, tirones, fugas de memoria, fallos WebGL y tiempos de carga.
- [ ] Registrar cada fallo con pasos, expectativa, resultado real, captura, consola y versión; repetir tras corrección.

**Criterio de cierre:** ninguna casilla de bloqueo funcional pendiente, regresiones automatizadas correctas y evidencia jugable en navegador/escritorio/móvil. Hasta entonces, **no es release final**.
