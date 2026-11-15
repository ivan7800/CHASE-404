# QA · CHASE 404 v0.24.0 ALPHA

## Cambios comprobados

- En v0.23.0 el semáforo ocultaba el coche desde la cámara inicial. La comparación WebGL con la misma pose muestra la salida despejada y el paseo nuevo del Carmel. También se renderizaron Gràcia, Guinardó y la ladera con cámara amplia. La malla crece de 365.532 a 367.914 vértices y conserva sus 127 colisionadores.
- Un giro controlado desde 29 km/h en el Eixample deja el coche orientado a la calle transversal con el nuevo ajuste. La prueba automatizada compara la orientación, la salida del cruce y el contacto con bordes. El empuje de otro vehículo se recorta si hay una fachada.
- La patrulla no obtiene la posición del jugador a través de una fachada porque una patrulla quede cerca. Las regresiones cubren aparición, visibilidad, detención bloqueada por esquina, última posición conocida y búsqueda.
- El mapa cercano sigue al jugador, indica objetivos lejanos y ofrece una vista de toda Barcelona. Ambas vistas respetan la ubicación de los objetivos.
- En Node, 24.000 puntos produjeron el mismo tramo y distancia (tolerancia 1e-8) antes y después de precalcular los segmentos. En una pasada de 120.000 consultas en este entorno el tiempo pasó de 1.494 a 127 ms. Es una medición de CPU de esta función, no de FPS. Los 127 colisionadores se compararon completos y son idénticos.

## Pruebas

- Base 0.23.0: 434 pruebas correctas. 0.24.0: 442 pruebas correctas, 6/6 GLB, auditoría, publicación, preparación del sitio, HTTP 7/7 y aceptación técnica 18/18.
- Chromium headless con WebGL 1 y SwiftShader: aceleración, frenado, marcha atrás, giro con teclado desde una posición controlada, pausa y ajustes, mapa cercano y general, tres modos de luz y control de sonido. Sin errores de consola en el recorrido de verificación.
- Campaña nueva: conducción desde el inicio hasta el taller, escena de la cinta y avance del primer al segundo objetivo. Exploración: encargo de la radio, 75 pesetas guardadas y aviso de escape tras búsqueda con posiciones y calor controlados.
- Emulación táctil de Chromium: los seis controles quedan dentro de pantalla a 390 × 844 y 844 × 390. Se entró y salió del coche con el control táctil.

Sigue pendiente la aceptación manual, incluida la campaña entera por ambas rutas, la prueba en mando y móvil físicos, la escucha en altavoces y el rendimiento prolongado en GPU. Los FPS de SwiftShader a 800 × 540 se usan como comprobación auxiliar; no representan un equipo real.
