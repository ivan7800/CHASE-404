# QA · Fase 7.6 — Integridad narrativa (v0.10.4)

## Objetivo
Verificar la coherencia entre interludios, personajes contextuales y progresión de la campaña de 15 misiones, sin alterar la conducción ni el movimiento a pie.

## Corrección aplicada
- Al abrir un interludio tras completar un punto, el bucle físico se interrumpe en ese mismo fotograma y se descarta el acumulador de tiempo. Antes podía procesar pasos adicionales hasta acabar el fotograma.
- Al cerrar el interludio se reinicia el acumulador, se recupera el foco solo si el elemento todavía pertenece al DOM y se limpia la referencia de foco.

## Pruebas
- `npm run audit`: 288/288 tests, sintaxis correcta, 6/6 GLB, auditoría estática correcta.
- Tres nuevas pruebas verifican que todos los interludios apuntan a puntos de control existentes, que los actores finales siguen la elección y el estado de misión, y que la transición detiene el bucle físico. Esta última es una verificación estática del flujo, no una prueba visual.
- 15 capítulos, 3 desafíos, 8 secretos y 3 contactos presentes en auditoría.

## Límites de verificación
- No se han podido certificar visualmente las animaciones 3D, el comportamiento de foco con lector de pantalla ni los dos desenlaces completos jugando en navegador real.
- La auditoría estática de botones confirma manejadores, no clics reproducidos en navegador.
- Quedan pendientes pruebas manuales Windows/Linux/móvil: misiones 10, 11, 14 y 15, diálogos repetidos, reset durante diálogo, navegación con teclado y opciones de accesibilidad.
