# CHASE 404 — Fase 9.1, v0.11.1: estabilidad en tiempo de ejecución

## Objetivo
Proteger el bucle de animación ante errores JavaScript y pérdida del contexto WebGL, evitando cascadas de excepciones y dejando visible el diagnóstico de error. No se modifican la conducción, los controles a pie, las misiones ni la economía.

## Cambios realizados
- Nuevo módulo `src/runtime-guard.js`: el primer fallo detiene permanentemente la ejecución de fotogramas; los siguientes se ignoran sin repetir avisos.
- `src/main.js`: se encapsula el trabajo por fotograma en un guardián; los errores se registran en consola y aparecen en el panel de error. Se detienen audio y controles.
- La pérdida de contexto WebGL y los errores de arranque pasan por el mismo control de fallos. La recuperación exige recargar la página para recrear los recursos WebGL.
- Cuatro pruebas automatizadas de ejecución correcta, fallo en render, fallo explícito y validación del manejador.

## Validación
- `npm run audit`: **310/310 pruebas**, sintaxis JS y auditoría estática correctas.
- `npm run assets:validate`: **6/6 GLB** correctos.
- Auditoría estática: **178 IDs**, **43 botones**, **15 misiones**, **3 desafíos**, **8 secretos**, **3 contactos**.
- **No certificado**: ejecución y reproducción real de pérdida de WebGL en Windows, Linux Mint, iOS/Android; campaña jugada de principio a fin y FPS reales.

## Prueba manual recomendada
1. Descomprimir y arrancar con el lanzador correspondiente.
2. Entrar en Barcelona -> Exploración libre; salir del coche y caminar; volver al coche y conducir.
3. Probar una misión, un desafío, el taller y los paneles de contactos; comprobar que no hay errores de consola.
4. Cambiar de pestaña en mitad de una misión y regresar: la pausa debe mantener los controles en reposo.
5. Si aparece `ERROR` en pantalla, copiar el mensaje y los errores de consola; no continuar jugando en ese estado.

Esta fase es una mejora de resistencia a fallos, **no constituye certificación de compatibilidad ni de jugabilidad completa**.
