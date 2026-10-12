# CHASE 404 · Auditoría integral audiovisual · Fase 6.6 · v0.9.5 ALPHA

**Fecha:** 12 de octubre de 2026. **Base:** v0.9.4. **Dictamen:** ALPHA / NO READY FOR RELEASE.

## Alcance revisado

- **Gráficos:** 3 ambientes × 3 cámaras × 3 niveles de calidad × FX ON/OFF = 54 combinaciones de render verificadas con WebGL simulado, matrices finitas, iluminación enviada, política de resolución y LOD.
- **Audio:** seis distritos × tres ambientes, motor parado/a pie, patrullas, pausa, activación explícita y reactivación de contexto simulado.
- **Integridad:** referencias HTML, listeners registrados por inspección de código, 15 misiones, 3 desafíos, 8 descubrimientos, 3 personajes, posiciones geométricas y GLB. El resto de la suite ya prueba campaña, economía y persistencia.
- **Compatibilidad:** claves de guardado intactas. Sin cambios en físicas, rutas o recompensas.

## Defectos encontrados y corregidos

| ID | Severidad | Reproducción | Resolución | Prueba |
|---|---|---|---|---|
| AUD-01 | Media | Dos acciones AUDIO antes de que termine `AudioContext.resume()` podían obtener respuestas distintas (`false` y luego `true`), dejando etiqueta y estado real desincronizados. | Se comparte la promesa pendiente entre ambas acciones. | `audiovisual-integral.test.js`, caso de activación doble y pausa. |
| AUD-02 | Media | Si la activación asíncrona terminaba después de abrir Ajustes, el manejador podía reanudar el sonido aunque Ajustes estuviera abierto. | El control comprueba todos los paneles bloqueantes antes de dar paso al audio. | Revisión de condición de UI y nuevo test de integración estática. |
| AUD-03 | Baja | El manual de ayuda omitía el atajo B de iluminación. | Manual actualizado. | Regresión de controles/referencias. |
| AUD-04 | Mejora QA | CI solo validaba sintaxis y unit tests; no GLB ni conexiones estáticas. | GitHub Actions ahora usa `npm run audit`, con permisos de solo lectura. | Ejecución local del mismo comando. |

## Resultados automatizados

- `npm run audit`: **PASS — 258/258 pruebas**, `npm run check` PASS, `npm run assets:validate` **6/6** GLB.
- `tools/audit_project.mjs`: **163 IDs** únicos, **41 botones** con manejador encontrado estáticamente, **153 referencias HTML**, **73 puntos** geométricamente coherentes, 15 misiones, 3 desafíos, 8 secretos, 3 personajes.
- Matriz de render: **54/54 combinaciones sin fallo del renderizador simulado**. No supone éxito de compilación de shaders por un controlador de GPU.
- Instrumentación y pruebas de Web Audio: contextos simulados. No supone sonido agradable, equilibrado, ni compatible con Safari real.
- El flujo de campaña se prueba con simulaciones lógicas: **no** se ha jugado de principio a fin.
- Los archivos ZIP y su suma de integridad se verifican al crear la entrega.

## Bloqueos y riesgos abiertos (impiden certificación final)

1. **Navegador/GPU:** Chromium devuelve `net::ERR_BLOCKED_BY_ADMINISTRATOR` incluso para una página HTML mínima en una URL `data:`. No se ha obtenido captura, validación de shader real, clics completos ni sesión interactiva.
2. **Percepción audiovisual:** iluminación nocturna, brillo de coches, tipografía y legibilidad, comodidad de la cámara, equilibrio del motor frente a sirenas y ambiente requieren ojos/oídos humanos.
3. **Rendimiento:** medir FPS y fluctuaciones en Chrome/Edge Windows, Chrome/Firefox Linux Mint y móvil; especialmente ciudad nocturna + patrullas + tráfico + audio.
4. **Experiencia narrativa:** 15 misiones implementadas, pero muchos objetivos se resuelven mediante marcadores/temporizadores, personajes secundarios estáticos y desenlaces textuales, sin cinemáticas. Es una limitación de producción, no un test aprobado.
5. **Completar campaña y secundarios:** recorrer las 15 misiones, ambas elecciones de la misión 14 y finales de la 15, las 3 actividades, taller, garaje, 8 pistas y contactos; verificar que las decisiones siguen al reiniciar el navegador.
6. **Audio y WebGL opcionales:** validar que AUDIO OFF nunca emite sonido y que el juego es utilizable cuando AudioContext no esté disponible. Confirmar manejo de pérdida de contexto WebGL y recuperación mediante recarga.

## Criterios de salida de ALPHA

No declarar release apta hasta registrar pruebas manuales reproducibles: ningún error de consola, HUD y elementos clicables probados individualmente, lectura nocturna aceptable, tres modos gráficos, tres cámaras, FX OFF y movimiento reducido, audio y silenciado, campaña y secundarios, guardado/recarga, al menos una medida real de FPS en Windows y Linux y verificación móvil. Usar la matriz `MANUAL_QA_FASE_6_6.md`.

**Publicación:** ninguna. No se ha autorizado subir esta versión a GitHub.
