# Fase 3 — El Carmel, Barcelona, 1984

## Dirección

Escenario ficticio inspirado en la topografía y transformación urbana de El Carmel. El año de juego es 1984. El mapa es una interpretación para conducción y no una reconstrucción literal del barrio.

## Implementación

- Terreno procedural elevado con dos laderas y diferencias de altura legibles.
- Once trazados de calle sinuosos, conectores y cruces, con calzada, aceras y bordillos que siguen la elevación.
- Muros de contención, escaleras, barandillas y farolas para dar escala de barrio de montaña.
- Viviendas de distintas alturas, balcones, pequeños elementos de calle y algunas casas de autoconstrucción como detalle histórico interpretativo.
- Mirador inspirado en la antigua batería antiaérea del Turó de la Rovira y silueta urbana al fondo.
- Minimapa con la red vial y posición del vehículo, rotulado EL CARMEL · 1984.
- Cámara y orientación visual del coche adaptadas a la inclinación local. Se conservan las tres pistas originales.

## Pruebas

- `npm run check`: sintaxis de los módulos principales.
- `npm test`: cobertura automatizada de la geometría de ciudad, cotas, posición de salida, manejo urbano, colisiones y regresiones heredadas.
- El render WebGL no se ha validado visualmente en navegador ni en GPU en este entorno.

## Alcance actual

Es exploración libre, todavía sin misiones, tráfico, peatones, semáforos funcionales, policía, navegación GPS ni daños. La física urbana continúa en plano; las cuestas afectan a la representación de terreno, cámara y coche, no a la fuerza de aceleración o frenado. Los coches presentes aún son modelos heredados y no la flota final de décadas.

## Referencias de ambientación

La elección de una ladera, calles pronunciadas y el Turó de la Rovira se basa en fuentes históricas y patrimoniales públicas. La representación concreta de edificios, calles y detalles es original y simplificada.
