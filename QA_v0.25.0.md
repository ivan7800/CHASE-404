# QA · CHASE 404 v0.25.0 ALPHA

## Reproducción desde partida nueva

- Chromium con WebGL 1 y SwiftShader. En exploración libre, mantener W desde (5, 132), sin girar. La calle gira hacia (132, 96) después del taller. En v0.24.0, cerca de (118.68, 131.70), la limitación a 10,1 m del eje entraba por el mismo circuito que un choque de fachada. El coche pasó de 126 a 30 km/h entre muestras consecutivas, perdió 13 puntos de condición y acabó a 1 km/h. La policía estaba inactiva.
- En campaña, la misma pulsación abrió la escena del casete en (90.16, 132) a 126 km/h y cambió el índice de objetivo de 0 a 1. La escena detuvo la simulación antes de llegar al borde. No hubo contacto físico en ese punto.

## Cambios

- Señales de curva tras el taller. El arcén introduce resistencia hacia fuera, conserva el movimiento tangente y mantiene la protección física de las fachadas. El borde figura en el HUD y deja de causar daño, sonido y sacudida de impacto.
- El casete se recoge a 3 km/h o menos o a pie. Los avisos narrativos que lleguen mientras se conduce por encima de esa velocidad o hay una persecución se mantienen como texto en el HUD hasta el siguiente objetivo.
- Captura en modo libre con pantalla de resultado y retorno explícito. Reiniciar limpia las entradas y el acumulador de tiempo. Una pulsación mantenida del teclado no rearma un control que se haya limpiado al abrir un menú.
- Entrar o salir del coche conserva la interpolación de la cámara. Los intentos fallidos muestran la causa y conservan el encuadre.

## Puertas

Base v0.24.0: 442 pruebas correctas. Candidata v0.25.0: 444 pruebas. Las puertas incluyen 6/6 GLB, auditoría estática, directorio de publicación, arranque HTTP 7/7 y aceptación técnica 18/18. La aceptación manual sigue pendiente, incluida la campaña completa, ambos finales, dispositivos físicos, audio y sesiones prolongadas.

## Repetición en Chromium con WebGL 1

- En exploración, W desde la salida hasta (119.05, 131.18). Borde detectado a 6 km/h, sin choque ni daño. S permitió retroceder y recuperar la calle.
- En campaña, W pasó por el taller a 126 km/h sin abrir la escena ni avanzar el objetivo. S activó la escena a 3 km/h y Enter devolvió el control en el mismo lugar. También se comprobó pausa, continuación y mapa general.
- Para comprobar la pantalla de detención se activó la bandera de captura de forma controlada en el navegador. La posición se conservó hasta pulsar «Volver al Carmel». Esta prueba verifica el flujo de recuperación.
