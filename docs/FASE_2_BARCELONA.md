# Fase 2 — Primera conducción urbana (v0.2.0, etapa sustituida)

## Implementación
- Añadido un escenario urbano independiente de las tres pistas originales.
- Malla procedural local de manzanas, fachadas con ventanas, cubiertas, almacenes portuarios, plaza, arbolado, farolas y pasos de peatones.
- Red ortogonal de siete calles por eje, con cruces transitables y aceras elevadas.
- Modo de conducción libre limitado a 126 km/h, con desaceleración fuera de calzada y corrección al alcanzar edificios/bordes.
- Cámara de persecución reutilizada y minimapa con la cuadrícula de Barcelona y posición del coche.
- En ciudad se ocultan indicadores de carrera y se bloquean los modos competitivos; las pistas siguen disponibles para regresión.
- Se conserva un selector para volver a Sunset Speedway, Pacific Coast y Midnight Ridge.

## Pruebas
- 69 pruebas Node: ciudad finita y acotada, siete ejes, cruces conectados, avance del coche y colisión con límite urbano.
- `npm run check` valida sintaxis del módulo urbano y del proyecto.
- No hay navegador con Playwright/Chromium disponible en este entorno. No se ha validado la imagen WebGL ni el rendimiento GPU.

## Alcance
La primera versión urbana fue una cuadrícula compacta de ficción basada en Barcelona; quedó sustituida como mapa principal por El Carmel de 1984 en la Fase 3. Todavía no contiene tráfico, peatones, semáforos funcionales, navegación por GPS, daños, policía ni misiones. Los vehículos existentes son modelos heredados del prototipo de carreras y aún no representan de forma final las décadas 70/80/90.
