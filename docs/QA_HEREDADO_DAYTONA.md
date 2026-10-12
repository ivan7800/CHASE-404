# QA — DAYTONA 404 v0.7.3 · Sentido de dirección

**Estado: PROTOTIPO CORREGIDO · PENDIENTE DE VALIDACIÓN DE CONDUCCIÓN REAL EN WINDOWS/LINUX**

| Comprobación | Resultado | Evidencia |
|---|---|---|
| Sintaxis de módulos JavaScript | PASS | `npm run check` |
| Pruebas de física, entrada, progresión y demás regresiones | **65/65 PASS** | `npm test`, `test-results.txt` |
| UI y teclado/puntero con Renderer simulado | **91/91 PASS** | `tools/ui_mock_qa_f7.py`, `QA_UI_RESULT.json` |
| Archivos HTML/CSS/JS y seis GLB por HTTP local | **22/22 PASS** | `QA_HTTP_CONTROLES_v071.json` |
| Ejecución con WebGL/GPU real | NO EJECUTADA | Bloqueada en el navegador de entorno |
| Sensación de manejo, mando físico, Windows y Linux Mint | PENDIENTE | Requiere juego manual y equipo físico |

### Diagnóstico y correcciones
0. La estabilización automática contrarrestaba la dirección mientras se mantenía pulsada, lo que debilitaba el giro. Ahora solo realinea la orientación al soltarla. También se invirtió el signo de giro en la física para compensar la convención de cámara: A/← vira visualmente a la izquierda y D/→ a la derecha.
1. Anteriormente, el giro modificaba `yaw` directamente mientras las velocidades X/Z mantenían un retraso demasiado grande; con freno de mano se agravaba y el coche podía deslizarse sin control. La revisión normaliza el giro según velocidad y agarre lateral, suaviza las teclas digitales y limita el resbalamiento extremo.
2. Anteriormente las teclas/punteros escribían booleanos directamente; soltar un dispositivo liberaba una acción que otro seguía manteniendo. El nuevo controlador agrupa todas las fuentes y permite combinaciones.
3. Antes la detección de circuito proyectaba cada tick contra 2048 segmentos. Ahora usa una ventana próxima cuando existe referencia válida, con búsqueda completa para reposiciones y teletransportes.
4. Los choques corregían posición y velocidad, pero la aceleración seguía apuntando al muro; ahora se amortigua y reorienta.
5. La frenada y el acelerador se restaban incluso si ambos estaban pulsados; ahora frenar tiene prioridad.

### Limitaciones
Las pruebas UI utilizan un Renderer simulado; no demuestran suavidad visual ni FPS reales. Las mediciones de conducción son pruebas reproducibles del modelo matemático, no sustituyen la valoración jugable. En esta entrega no se modifican perfiles existentes ni archivos GLB.

---

## Histórico de QA de Fase 7

# QA — DAYTONA 404 v0.7.0 / Fase 7

**Estado: PROTOTIPO EN PRUEBAS — PRUEBA WEBGL REAL Y RENDIMIENTO PENDIENTES · 2026-10-11**

| Prueba | Resultado | Evidencia / alcance |
|---|---|---|
| Sintaxis JavaScript | PASS | `npm run check`, todos los módulos |
| Unitarias y regresión (física, carreras, audio, GLB, controles) | **50/50 PASS** | `npm test`, `test-results.txt` |
| Preferencias: validación de teclas, almacenamiento, AUTO calidad | PASS | `tests/settings.test.js`, 8 pruebas |
| Interfaz y flujos: modos, campeonato, configuración, teclado | **83/83 PASS** | `tools/ui_mock_qa_f7.py`, `QA_UI_RESULT.json` |
| Servidor local: carga de HTML, CSS, JS, GLB, icono | PASS | 21/21 recursos HTTP 200, `QA_HTTP_F7.json` |
| Chromium con código y WebGL reales | **BLOQUEADO** | `tools/browser_actual_qa.py` -> `net::ERR_BLOCKED_BY_ADMINISTRATOR`; `QA_BROWSER_F7.json` |
| Windows 10/11, Linux Mint, móviles físicos, GPU y medición FPS | NO EJECUTADO | Requiere prueba con equipos del usuario |
| Blender ejecutado y exportación GLB desde Blender | NO EJECUTADO | Blender no instalado en el entorno |
| Audio escuchado en altavoces y ajuste de mezcla | NO EJECUTADO | Requiere hardware real |
| Publicación GitHub Pages | NO EJECUTADO | Publicación pendiente de autorización |

## Qué está probado y qué no

- Las 83 comprobaciones de interfaz se realizan en Chromium **con un Renderer simulado**; no son evidencia de que las imágenes 3D, sombras o GPU funcionen.
- El algoritmo adaptativo se ha probado con secuencias de FPS de laboratorio. No garantiza 60 FPS ni evita todas las caídas de rendimiento en equipos reales.
- Los tests de WebGL de Node emplean un contexto gráfico simulado. La compatibilidad real de drivers, WebGL 1 y exportaciones de Blender permanece pendiente.
- La reducción de movimiento desactiva el polvo 3D y los FX; el coche, la cámara y las animaciones esenciales de gameplay siguen moviéndose.
- No se ha comprobado exhaustivamente con lector de pantalla ni se puede garantizar accesibilidad WCAG plena. Los tamaños de HUD altos pueden reducir el espacio útil en pantallas pequeñas.

## Prueba manual recomendada en Windows o Linux Mint

1. Descomprimir y abrir con el lanzador correspondiente. Confirmar que no aparece ERROR DEL MOTOR 3D.
2. Ejecutar una carrera con rivales y otra en Time Attack; verificar cámaras, minimapa, colisiones, fin de carrera y récords.
3. Abrir AJUSTES con O durante una carrera: el reloj debe detenerse, el teclado no debe acelerar mientras esté abierto y al cerrarlo debe continuar la carrera.
4. Cambiar las teclas a I/J/K/L y Shift Izq.; verificar que funcionan, que W/A/S/D ya no hacen lo anterior y que las flechas todavía responden.
5. Intentar asignar dos acciones a la misma tecla: debe aparecer un error y no guardar.
6. Activar contraste y movimiento reducido; comprobar legibilidad y ausencia de partículas de polvo.
7. Probar AUTO/ALTA/MEDIA/ECO. Comparar FPS y fluidez con y sin rivales; observar que AUTO reacciona solo tras varios segundos.
8. Recargar el navegador y confirmar ajustes persistentes. Borrar datos del sitio **solo si se acepta perder récords y progresión**.
9. Abrir en modo móvil/tamaño reducido y probar botones táctiles y el scroll del panel de ajustes.
10. Anotar consola del navegador (F12), FPS aproximados y capturas de cualquier fallo.

**Pendiente para Fase 8:** prueba visual 3D y rendimiento en hardware real, contraste bajo diversos escenarios, navegación completa con teclado y manejo de WebGL context loss.
