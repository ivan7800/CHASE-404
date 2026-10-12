# CHASE 404 — Checklist de prueba jugable y audiovisual · v0.9.5

Este informe se rellena **en un navegador real**; no equivale a la auditoría automática. Extraer todo el ZIP. En Windows ejecutar `INICIAR_WINDOWS.bat` y en Linux Mint `bash INICIAR_LINUX.sh`. Abrir la dirección local indicada por el lanzador; no usar `file://`. No activar extensiones que modifiquen la página.

## Ficha de prueba

- **Equipo/SO:**
- **Navegador y versión:**
- **CPU / GPU / RAM:**
- **Resolución / escala del sistema:**
- **Fecha / versión:**
- **Errores de consola (F12):**
- **Captura de pantalla / vídeo:**

## Matriz obligatoria (marcar PASS / FAIL / N/A y adjuntar observaciones)

| # | Prueba | Resultado | Evidencia/observación |
|---|---|---|---|
| 01 | Inicio desde lanzador, sin error de carga ni pantalla negra, coche visible | | |
| 02 | Coche responde a W/S/A/D, volante coherente y sin deriva de controles | | |
| 03 | Cambiar DÍA → ATARDECER → NOCHE con B y botón; fondo, niebla y edificio se actualizan | | |
| 04 | Cerrar/recargar página; ambiente visual restaurado en Barcelona | | |
| 05 | Alta/Media/Eco/Auto: imagen representada, sin cuadrante negro ni glitcheo | | |
| 06 | Cámara CHASE/WIDE/BONNET con C, sin atravesar suelo ni saltos bruscos | | |
| 07 | Derrape + choque: movimiento y feedback coherentes; sin flashes persistentes | | |
| 08 | FX OFF + Reducir movimiento: sin sacudidas, inclinación ni zoom involuntario | | |
| 09 | Activar AUDIO con clic voluntario; motor audible, sin empezar automáticamente | | |
| 10 | Ajustar volumen 0/25/50/75/100; AUDIO OFF y pausa silencian completamente | | |
| 11 | Repetir pulsación M rápidamente y cambiar a Ajustes durante activación; estado sincronizado | | |
| 12 | Ambiente y etiqueta del barrio cambian entre Carmel, Guinardó, Gràcia, Eixample, Puerto y Montjuïc | | |
| 13 | Persecución: sirena depende de distancia, no se oye fuera de persecución | | |
| 14 | Entrar/salir coche con E y explorar a pie sin sonido de motor propio | | |
| 15 | Cambiar a los tres circuitos arcade; iluminación y tráfico de circuito sin regresiones | | |
| 16 | Misión 01 y avance; repetir misiones representativas 06, 08, 11, 14, 15 | | |
| 17 | Rutas de decisión 14: rescatar primero / obtener pruebas, comprobar los dos finales 15 | | |
| 18 | Desafíos: entrega, contrarreloj, carga delicada; récord y saldo tras recargar | | |
| 19 | Taller: reparar y mejorar; garaje: guardar/intercambiar sin sanar daños gratis | | |
| 20 | Ocho secretos, archivo (I), tres contactos, elecciones y diario (J); guardar/recargar | | |
| 21 | Todos los botones del HUD: clic individual, resultado esperado, sin capas que intercepten | | |
| 22 | Redimensionar ventana, móvil vertical/horizontal: HUD, ayuda y modal no desbordan | | |
| 23 | Ocultar pestaña/perder foco durante conducción: pausa y silencio automáticos | | |
| 24 | Abrir consola F12: sin excepciones JS ni 404 de recursos locales | | |

## Rendimiento (mínimo)

Registrar FPS visibles (aproximación, no percentil 1), duración de la sesión y problemas de tirones:

| Configuración | FPS mínimo observado | FPS habitual | Notas |
|---|---|---|---|
| El Carmel, día, ALTO | | | |
| Puerto, noche, ALTO | | | |
| Puerto, noche, MEDIO | | | |
| Puerto, noche, ECO | | | |
| Persecución con tráfico, noche + AUDIO ON | | | |
| Móvil, ECO, tráfico y paneles | | | |

**Criterio de bloqueo:** cualquier 404 de modelos/scripts, botón principal sin respuesta, error persistente de consola, estado de audio desincronizado, corrupción de guardado, imposibilidad de completar objetivos, pantalla negra, controles invertidos o pérdida de FPS que impida conducir. Registrar pasos reproducibles antes de declarar la incidencia corregida.

**Dictamen final de QA manual:** PENDIENTE. No rellenar PASS sin ejecutar realmente la prueba.
