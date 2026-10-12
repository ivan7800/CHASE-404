# Fase 8.2 — Evasión táctica · v0.10.6

## Alcance
La misión 8 mantiene sus tres objetivos, pero la salida escogida tiene consecuencias jugables explícitas. Oeste: al menos 90 metros de distancia a patrullas durante 4 segundos. Este: al menos 65 metros durante 7 segundos. El refugio está en las mismas coordenadas; no se han construido nuevos caminos ni se ha cambiado la IA policial.

## Verificación automática
- `npm test`: **293/293** correctas.
- `npm run check`: correcto.
- `npm run assets:validate`: **6/6** modelos GLB correctos.
- `node tools/audit_project.mjs`: sin incidencias; 42 botones registrados y 15 misiones.
- Pruebas nuevas: requisitos distintos por ruta, proximidad policial y exigencia de seguir en el vehículo.

## Validación manual pendiente
1. Iniciar BCN y elegir la misión 8.
2. Huir por **AVENIDA OESTE** y comprobar que la evasión solo cuenta por encima de 90 m de las patrullas y requiere 4 segundos.
3. Repetir por **CALLE DE SERVICIO**: debe admitir desde 65 m y requerir 7 segundos.
4. Comprobar que bajar del coche cancela el avance de evasión de la misión 8.
5. Revisar si la dificultad de cada ruta es divertida, si la policía permite mantener las distancias y si los mensajes HUD se leen bien.
6. Jugar misiones 11 y 15 para comprobar que las reglas de evasión anteriores se conservan.

La validación gráfica, el equilibrio de persecución y los FPS **no están certificados** en un navegador real.
