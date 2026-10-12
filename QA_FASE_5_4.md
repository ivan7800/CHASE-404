# CHASE 404 — QA Fase 5.4 · v0.8.3 ALPHA

**Fecha:** 2026-10-12  
**Alcance:** nuevos encargos, contrarreloj, transporte delicado, progresión y HUD, compatibilidad con v0.8.2.

## Pruebas realizadas en esta entrega

| Comprobación | Resultado | Alcance |
|---|---|---|
| `npm test` | PASS · 195/195 | Pruebas Node de lógica del motor y desafíos; 13 pruebas adicionales frente a v0.8.2 |
| `npm run check` | PASS | Validación de sintaxis de módulos JavaScript |
| `npm run assets:validate` | PASS · 6/6 | Seis modelos GLB locales |
| Inspección estática del HTML | PASS | 130 identificadores, 130 únicos; 122 referencias de IDs JS comprobadas, ninguna ausente |
| Puntos del desafío | PASS | Proximidad de puntos de control a ejes viales de la ciudad, test automatizado |
| Recompensas y récords | PASS (lógica) | Premio diferente por actividad, récord separado, bloqueo de cobro duplicado |
| Datos guardados antiguos | PASS (lógica) | Se preservan saldo, tiempo del encargo original y mejoras de taller al cargar un v1 antiguo |
| Transporte delicado | PASS (lógica) | Referencia inicial de impactos, primer golpe tolerado, segundo golpe falla |
| Captura policial | PASS (revisión de integración) | Abre pantalla de resultados de desafío sin recompensa |
| Integridad ZIP final | PASS | `unzip -t` sin errores tras el empaquetado |

## Pruebas bloqueadas o pendientes

- **Chromium/WebGL interactivo:** no realizado. `Page.goto` rechaza incluso una URL `file:///` con `net::ERR_BLOCKED_BY_ADMINISTRATOR`. El servidor local de pruebas tampoco acepta conexiones desde el entorno. No se ha simulado que los botones funcionen en un navegador real.
- **Windows y Linux:** no se ha ejecutado una partida completa, no se han medido FPS ni latencias de entrada.
- **Equilibrio:** los tiempos límites y recompensas son objetivos de diseño preliminares y requieren recorrido real para verificar dificultad y accesibilidad.
- **Componentes visuales:** los paquetes no son objetos 3D visibles; los checkpoints funcionan como señalización contextual. No hay efectos de colisión de la carga ni actores dedicados.

## Pasos de aceptación manual pendientes

1. Abrir con `INICIAR_WINDOWS.bat` o `INICIAR_LINUX.sh`, entrar en BCN, comprobar que se muestra el selector de tres actividades y que los circuitos arcade lo ocultan.
2. Seleccionar y activar cada actividad; comprobar controles sucesivos en minimapa y HUD. Verificar que llegar a un punto posterior **no** salta el control activo.
3. Completar las tres rutas; comprobar pantalla final, recompensa en pesetas, mejor tiempo específico y posibilidad de repetir o cambiar de desafío.
4. En «La cinta de cristal», impactar dos veces lo suficiente para generar eventos de daño y verificar la derrota. Un choque leve sin daño no cuenta.
5. Comprar una mejora con las pesetas y reiniciar el juego: saldo, récord, mejora, historial y colección del garaje deben conservarse.
6. Cambiar a campaña: comprobar que inicia en misión 01 y que sus decisiones y finales no se alteran.
7. Comprobar los controles con teclado y táctil; medir FPS en equipo Windows y Linux, verificar que no hay errores de consola ni capas que bloqueen botones.

**Conclusión:** implementación estática y lógica verificada en pruebas automatizadas; fase NO certificada en jugabilidad real. Estado ALPHA. GitHub: sin publicar.
