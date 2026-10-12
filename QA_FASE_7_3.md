# QA — Fase 7.3 · Personajes secundarios animados

Se extrajeron los cuerpos estáticos de Manel, Clara y Núria de la malla urbana. Se representan ahora como mallas WebGL independientes con respiración discreta, giro de cabeza, gestos de brazos y ligeras variaciones de orientación. Se conservan las señales de localización, las pruebas de las historias y los accesorios únicos.

La animación es ambiental, no labial ni captura de movimiento. La opción FX OFF/reducir movimiento usa postura estática. El contacto sigue utilizando el sistema narrativo existente.

Ejecutar `npm run audit` antes de publicar. Es imprescindible validar visualmente las posiciones y encuadres en un navegador WebGL real, así como comprobar NPCs con día, noche, calidad ECO, pausas y conversaciones. No se publica en GitHub.
