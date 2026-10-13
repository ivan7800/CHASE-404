# QA v0.17.0 — Calles y viviendas en pendiente del Carmel

## Cambios

- Las tres primeras vías del Carmel usan calzadas con semiancho de 5,8 m y aceras hasta 8,1 m; ocho calles locales usan 4,6 m y 6,6 m. Los demás barrios conservan el perfil anterior.
- La vivienda ahora se apoya en la elevación más alta de los bordes de su parcela. Donde el terreno cae más de 0,75 m se generan tramos de zócalo de piedra para cubrir la diferencia.
- El coche y Gael a pie reconocen los nuevos anchos y mantienen un margen de acceso a las fachadas.

## Evidencia automatizada

- `npm test`: 97 archivos de pruebas correctos.
- `npm run audit`: incluye sintaxis, regresiones, validación de los seis modelos GLB, auditoría estática, puerta de release y preparación de GitHub Pages.
- `tests/carmel-contour-117.test.js` comprueba perfiles locales y arteriales, conservación del ancho en barrios lejanos, apoyo sobre cotas del perímetro, presencia de piedra y límite de 400.000 vértices.
- `tests/building-collisions.test.js`, `tests/physics.test.js`, `tests/on-foot.test.js`, `tests/traffic.test.js` y `tests/urban-navigation.test.js` cubren colisiones y recorridos automatizados.

## Pendiente de navegador

1. Con WebGL, conducir por las vías estrechas del Carmel, rozar esquinas y comprobar que coche y tráfico no se montan en aceras.
2. Bajar a pie por las calles en pendiente, dar una vuelta alrededor de fachadas y comprobar los accesos a objetivos.
3. Inspeccionar desde la cámara las uniones entre zócalos, terreno, aceras y edificios; revisar sombras y FPS en un equipo modesto y en móvil.

Las pruebas automatizadas validan geometría y reglas de movimiento, pero no sustituyen la comprobación visual ni una partida real. La sesión de navegador disponible no pudo inicializar WebGL, así que este cambio queda como candidato para revisión manual.
