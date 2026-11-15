# QA · CHASE 404 v0.23.0 ALPHA

## Diagnóstico en v0.22.0

- En Chromium con WebGL 1 y SwiftShader se observó una silueta flotante sobre Gràcia, un semáforo dentro de la calzada en la salida del Carmel, cruces con manchas de asfalto sobre la acera, fachadas ciegas y el botón de pausa recortado a 1366 × 900.
- Al pausar con el ratón, el foco del botón impedía reanudar con P. La prueba repetida incluye pausa con ratón y vuelta con teclado.
- El Chrome compartido mostró «Tu navegador no proporciona WebGL». El Chromium del sistema falló con `socket() failed: Operation not permitted (1)`. Un Chromium headless alternativo con SwiftShader permitió ejecutar las dos versiones.

## Cambios y controles

- La comparación usa resolución de 1366 × 900, atardecer y poses de cámara controladas equivalentes en el Carmel, Gràcia, Guinardó y una calle de ladera con cámara amplia. Las capturas proceden del juego servido bajo /CHASE-404/.
- La malla pasa de 374.409 a 365.532 vértices. Los 124 colisionadores previos coinciden por ID y coordenadas, con tres nuevos en Gràcia. Los ejes de la red vial se conservan. Las cuatro calles locales de Gràcia tienen nuevas anchuras.
- Las nuevas pruebas cubren normales del terreno y la calle, anchura del asfalto, accesos peatonales, colisión de las nuevas fachadas, semáforos en aceras y foco al pausar. Se retiraron mínimos de vértices que rechazaban una reducción de geometría aunque la escena siguiera presente.
- Línea base: 427 pruebas correctas. Candidata: 434 pruebas correctas, auditoría, 6/6 GLB, puerta de publicación, preparación de Pages, 7/7 checks HTTP y aceptación técnica 18/18.

## Interacción en navegador

- Se verificaron aceleración, frenado, marcha atrás y reanudación por teclado. A 1366 × 900 se comprobó que el botón de pausa queda dentro de la barra y se puede pulsar. El menú de ajustes se abrió y cerró sin bloquear el juego.
- El encargo de la radio se inició con U, avanzó con posiciones de control y guardó las 75 pesetas. La patrulla se activó con calor controlado y el HUD mostró la búsqueda y se confirmó la notificación «HAS PERDIDO A LA PATRULLA». Esta secuencia no mide lo divertida que es una persecución completa conducida a mano.
- Una campaña nueva llegó al taller acelerando con el teclado desde la posición de inicio. Se mostró la escena de la cinta y el objetivo pasó de 1/3 a 2/3.
- Las dos versiones renderizaron WebGL sin errores en la consola durante la prueba de conducción básica.

## Pendientes

Campaña completa y ambos finales por conducción real, variedad de coches en una partida larga, mando y móvil físicos, mezcla de audio, y perfiles de FPS y RAM en hardware objetivo. El renderizado por CPU sirve para validar la escena y la interacción básica. Sus FPS no representan el rendimiento en GPU. La aceptación manual sigue pendiente.
