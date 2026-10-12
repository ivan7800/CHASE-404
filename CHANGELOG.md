## v0.14.5 — Fase 11.21 · Identidad de barrios
- Remates arquitectónicos en 12 edificios del Eixample, 7 cubiertas industriales del puerto y 8 almenas de Montjuïc.
- Nuevos elementos solo sobre estructuras existentes, sin modificar carreteras, colisiones o conducción.
- Añadidas pruebas de geometría y presencia de decoración. Validación visual y FPS reales pendientes.

## v0.14.3 — Fase 11.19 · Siluetas de Barcelona

- Nuevas chimeneas, antenas y depósitos de tejado en 9 fachadas de Gràcia y 8 viviendas del Carmel.
- Geometría exclusivamente sobre cubiertas existentes; sin cambios de físicas, controles, objetivos o colisiones.
- Pruebas de distribución espacial y regresión automatizada. Inspección visual y FPS reales pendientes.

## v0.14.2 — Fase 11.18 · Rostro, manos y calzado de Gael

- Refinado facial por volúmenes, palmas facetadas con dedos y perfil diferenciado de zapatos.
- Regenerados seis GLB modulares sin cambiar pivotes, controles ni físicas.
- Nuevas pruebas de consistencia del personaje; pendiente inspección visual real.

## v0.14.1 — Fase 11.17 · Silueta y ropa de Gael
- Torso de chaqueta remodelado como volumen facetado con cintura, pecho y hombros diferenciados.
- Paneles de tela, cuello, hombros y costuras; exportadas de nuevo las seis piezas GLB del personaje.
- Sin cambios en el rig, la conducción ni los controles. No es un modelo humano esquelético de Blender.
- Validación visual real y campaña completa aún pendientes.

## v0.13.9 — Fase 11.15 — transiciones de animación a pie

- Interpolación temporal de pose entre reposo, caminar y correr, con suavizado independiente del FPS.
- Se reinicia la interpolación al entrar en coche para evitar arrastrar poses previas.
- Cuatro tests nuevos de transición y regresión estática; sin cambios de controles ni físicas.
- El render de WebGL real y la batería global siguen pendientes de certificación.

## v0.13.7 — Fase 11.13 · Animación procedural de Gael

- Alternancia explícita de brazos y piernas, zancada mayor al correr y rebote controlado.
- Pose neutra garantizada al detenerse; pivotes y controles conservados.
- Cinco pruebas específicas nuevas. Sin esqueleto GLB ni captura visual certificada.

## v0.13.6 — Fase 11.12 · Silueta de Gael

- Reconstrucción facial mediante secciones elípticas facetadas (mandíbula, mejillas, coronilla y peinado) en lugar de apilar cubos.
- Brazos y piernas con secciones poligonales de ocho caras y pliegues discretos; sin alterar pivotes, físicas ni controles.
- Revisión de coherencia entre materiales, ropa y orientación de normales de la malla.
- Pruebas de geometría y regresión; inspección visual de WebGL y FPS aún pendientes.

## v0.13.5 — Fase 11.11 · Materiales de vehículos
- Superficies de vidrio y cromados reciben reflejos específicos según cámara y cielo, sin texturas externas ni cambios de geometría.
- Pruebas de regresión de paletas y uniformes del renderizador; pendiente validación WebGL real.
- Física, conducción, controles, misiones y guardados conservados.

## v0.13.4 — Fase 11.10: remasterización de vehículos

- Seis modelos GLB regenerados localmente con parrillas, faros, cromados, espejos, paragolpes y detalles propios de cada carrocería de inspiración setentera y ochentera.
- Código artístico compartido en `src/vehicle-detail.js`, sin alterar física, colisiones, controles ni economía.
- Siete verificaciones nuevas de coherencia GLB frente a las mallas de origen y diferenciación entre modelos.
- Pendiente: inspección artística en navegador real, FPS y aceptación jugable integral.

## v0.13.4 — Fase 11.9: entorno inmediato

- Diez puntos de mobiliario de calle: marquesinas, armarios de servicio y jardineras 3D, sin texturas externas.
- Las piezas se sitúan fuera de los carriles y no alteran las colisiones, las físicas ni los recorridos de misión.
- Se conservan los seis coches GLB y la conducción. La apariencia y los FPS siguen pendientes de comprobar en navegador real.

## v0.13.1 — Fase 11.7: siluetas arquitectónicas 3D

- Galerías con volumen y cornisas superiores en nueve fachadas de Gràcia.
- Remates de cubierta inclinados y canalones en ocho casas del Carmel.
- Las decoraciones permanecen asociadas a sus edificios; no cambian física, calles, tráfico ni colisiones.
- Presupuesto de vértices revalidado; pendientes capturas visuales y FPS reales.

## v0.13.0 — Fase 11.6: relieve arquitectónico y revisión visual
- Portales y cornisas con profundidad en nueve fachadas de Gràcia.
- Entradas más legibles en ocho casas del Carmel.
- Se mantienen la red vial, físicas y controles.
- Validación visual real pendiente (Chromium headless bloqueado).

## 0.12.9 — Fase 11.5 · Coherencia artística
- Módulo `src/art-direction.js` con escala arquitectónica y materiales coordinados para Carmel y Gràcia.
- Puertas del remaster de ambos distritos ajustadas a altura y anchura común respecto al personaje; marcos y zócalos comparten paleta.
- Pruebas de escala, paleta y mallas; sin cambios de físicas, colisiones, controles ni recorridos.
- Validación artística en navegador y rendimiento real aún pendientes.

## v0.12.6 — Fase 11.2 · Carmel y Gràcia
- Detalles volumétricos de balcones, barandillas, persianas, toldos, zócalos y portales en nueve edificios existentes de Gràcia.
- Ocho casas bajas del Carmel con terrazas, aberturas, depósitos y jardineras estilizadas.
- Seis puntos de mobiliario urbano sin cambios de calles, controles o colisiones.
- Pasada determinista sin descargas externas; +29.448 vértices (~9,6 %).
- Validación visual real y FPS pendientes en equipo del usuario.

## v0.12.5 — Fase 11.1 — remaster visual de Gael

- Silueta del protagonista renovada con chaqueta entallada, geometría de rostro facetada, peinado, ropa y calzado diferenciados.
- Mallas de extremidades articuladas conservan el rig y controles previos.
- Pruebas específicas de geometría, integridad de mallas y articulaciones.
- Sin modificaciones en conducción, objetivos o guardados.
- Validación visual y rendimiento WebGL reales pendientes.

## v0.12.4 — Fase 10.8 · Triaje de incidencias de aceptación
- Nuevo `npm run qa:triage` de solo lectura, que resume pruebas fallidas, bloqueadas y pendientes sin imprimir datos privados.
- Los registros sin evidencia suficiente no se consideran aprobados.
- `.gitignore` excluye el acta personal y la carpeta `_site` generada.
- No se modifican la física, los controles, las misiones ni los guardados.
- Pendiente completar las 12 pruebas reales antes de autorizar una versión 1.0.

## v0.12.3 — Fase 10.7: kit de aceptación jugable

- Herramienta local `qa:manual` para iniciar, consultar y registrar los 12 criterios con evidencias aportadas por quien juega.
- Pruebas de integridad del acta y rechazo de aprobaciones sin evidencia.
- Guía para Windows/Linux y distinción entre QA automático y pruebas reales.
- No se modifican controles, físicas, campaña ni lógica de guardado.
- **Sigue pendiente la aceptación jugable y el despliegue real.**

## v0.12.1 — Fase 10.5: aceptación de recorridos simulados

- Cuatro recorridos completos de las 15 misiones con todas las combinaciones de decisiones de las misiones 8 y 14.
- Verificaciones de estados finales, objetivos y propagación de elecciones entre capítulos.
- Puerta de aceptación adaptada a la versión leída del paquete (evita referencias fijas a 0.12.0).
- **No constituye una validación real de jugabilidad, FPS, audio o controles.**

## v0.12.0 — Fase 10.4: aceptación técnica provisional

- Puerta de aceptación y reporte JSON; checklist manual de doce criterios.
- Verificación del staging de GitHub Pages, versiones y recursos esenciales.
- Sin modificaciones a controles, conducción ni misiones.
- Estado de release final: bloqueado hasta validación jugable real.

## v0.11.9 — Fase 10.3 (auditoría de publicación)
- Preparación determinista del sitio GitHub Pages mediante `tools/prepare_site.mjs`.
- Verificación de lista permitida, recursos, imports relativos y exclusión de archivos de desarrollo.
- GitHub Actions publica el directorio verificado `_site/`; desplegar sigue siendo manual.
- Se conservan conducción, campaña y guardados; validación jugable real pendiente.

## v0.11.8 — Fase 10.2 · Primera ejecución y distribución
- Prueba HTTP real de primer arranque (HTML, JS, CSS, GLB y 404); aislada en loopback y sin navegador.
- Guía de resolución de problemas en Windows, Linux Mint y GitHub Pages.
- Informe QA con límites explícitos de validación.
- Sin cambios en físicas, controles, campaña ni progreso.

## v0.11.7 — Fase 10.1 · Preparación de GitHub Pages
- Documentación actualizada y archivo histórico preservado.
- Licencia MIT, `.nojekyll` y guía de publicación.
- GitHub Actions: despliegue de Pages solo manual, condicionado a `npm run audit`.
- Release gate ampliada con archivos de publicación y licencia.
- Sin cambios de física, controles, campaña ni persistencia.
- Validación jugable y despliegue remoto: pendientes.

## 0.11.6 — Fase 9.6 · Auditoría integral y puerta de distribución (2026-10-12)
- Añadida `npm run release:gate` integrada en la auditoría automática; comprueba versiones, recursos, lanzadores y distribución.
- Corregidas versiones visibles obsoletas en portada y ajustes.
- Candidato técnico provisional: faltan pruebas reales de navegador, campaña, audio y rendimiento.

## 0.11.5 — Fase 9.5 · Rendimiento y memoria (2026-10-12)
- Eliminadas listas temporales en las búsquedas de tráfico y patrullas cercanas realizadas durante la mezcla de audio.
- Nuevo helper `nearestEntityDistance` con tests de entidades inválidas, patrullas inactivas y ausencia de entidades.
- 324/324 pruebas automáticas correctas y 6/6 GLB válidos. Sin cambios de físicas, controles o progresión.
- FPS, consumo de memoria, audio y compatibilidad real pendientes de medir en dispositivos.

## 0.11.2 — Fase 9.2 · Controles y navegación (2026-10-12)
- Atajos globales bloqueados cuando Ayuda está visible o la partida está en pausa; se mantienen los accesos de cierre, ajustes y reanudación.
- La navegación mediante un botón enfocado no propaga su tecla al manejador global de juego.
- Ayuda evita superponerse a los diálogos, archivo, garaje, taller o ajustes.
- 314/314 pruebas y auditoría estática correctas; validación visual/manual pendiente.
- Sin cambios de conducción, movimiento a pie ni guardados.

## 0.10.7 — Fase 8.3 · Señales de daños y amenaza (2026-10-12)
- HUD contextual para daños y proximidad policial, con severidades discretas y diseño sin destellos.
- Cuatro pruebas nuevas de lógica; audit global sin regresiones.
- Controles, colisiones, IA y temporizadores sin cambios.
- Validación visual y jugable real pendiente.

## 0.10.6 — Fase 8.2 · Evasión táctica (2026-10-12)

- La misión 8 ofrece dos formas diferentes de eludir a las patrullas: avenida oeste (90 m durante 4 s) o calle de servicio (65 m durante 7 s).
- La elección se refleja inmediatamente en el objetivo y contador de progreso, sin modificar los puntos físicos del mapa, la conducción ni las 15 misiones.
- El objetivo de evasión de la misión 8 exige continuar en el coche; los criterios de otras misiones no cambian.
- 293 pruebas automatizadas y auditoría estática correctas; pendiente jugar ambas rutas en navegador real.

## 0.10.1 — Fase 7.3 · Secundarios animados (2026-10-12)

- Manel, Clara y Núria dejan de estar fusionados con la malla de ciudad. Se dibujan con cuerpo, cabeza y brazos independientes.
- Añadida animación ambiental ligera y determinista, con opción de reducir movimiento.
- Preservados accesorios, señales y pruebas de sus encargos. Sin cambios en conducción, control a pie ni guardados.
- Validación visual con navegador real pendiente.

## 0.9.9 — Fase 7.1 · Remaster de personajes (2026-10-12)

- Gael: detalles de vestuario y rostro sobre la silueta articulada existente.
- Contactos secundarios con prendas, colores y accesorios diferenciados (Manel, Clara, Núria).
- Pruebas de coherencia geométrica y regresión del rig.
- No cambian las físicas, los controles ni los sistemas de guardado. La validación visual WebGL permanece pendiente.

## 0.9.7 — Pulido de cámara peatonal (2026-10-12)

- Con Gael a pie, C recentra la cámara detrás de su orientación corporal; en vehículo, C conserva los tres modos de cámara.
- Seguimiento de cámara peatonal más ágil, sin modificar el motor de conducción ni el mapeo WASD reparado en v0.9.6.
- Ayuda actualizada y tres pruebas de regresión nuevas para recentrado, dirección y seguimiento.
- 266/266 pruebas automatizadas y auditoría estática correctas; pruebas WebGL reales pendientes.

## 0.9.6 — Corrección de movimiento a pie (2026-10-12)

### Diagnóstico y reparación
- Hallazgo reproducido: `src/on-foot.js` interpretaba W/A/S/D contra ejes absolutos X/Z de la ciudad, mientras que `src/camera-rig.js` rotaba la cámara hacia la dirección del cuerpo del personaje. Después de girar o salir de un coche orientado en otra dirección, avanzar o desplazarse lateralmente dejaba de corresponder con la pantalla.
- `src/on-foot.js`: caminar y correr ahora utilizan los vectores adelante/izquierda de una **orientación de cámara estable (`viewYaw`)**, fijada al salir del vehículo. El cuerpo de Gael sí gira para mirar hacia donde se mueve; la cámara no orbita por pulsar A/D o S.
- `src/camera-rig.js`: cuando Gael está a pie, el encuadre usa `viewYaw` en lugar de `yaw` del cuerpo. No se han modificado las cámaras ni los controles durante la conducción.
- Corregida también la tolerancia de aparición al bajar: el umbral del punto de salida coincide con el límite de circulación peatonal, evitando que Gael aparezca fuera del corredor transitable.
- Ayuda del juego y README actualizados para describir controles relativos a cámara y Espacio para correr.

### Pruebas y limitaciones
- Nuevas pruebas: W/A/S/D desde cinco orientaciones (20 direcciones), invariancia de cámara tras giro de personaje, diagonales, entrada/salida y aparición válida junto al borde de la calle. Ejecución general de `npm run audit` incluida.
- La prueba de conducción del usuario en la versión anterior fue positiva, por lo que no se modificó su física, sensibilidad ni mapeo.
- Sigue pendiente comprobar visualmente el caminar y todos los botones en un navegador WebGL real, además del rendimiento en Windows/Linux/móvil. No se ha subido a GitHub.

## 0.9.5 — Fase 6.6 · Auditoría audiovisual integral (2026-10-12)

### Correcciones
- `src/audio.js`: las activaciones simultáneas de Web Audio comparten el resultado de la promesa pendiente, evitando que pulsaciones rápidas de M/AUDIO dejen la etiqueta en OFF cuando realmente se activó el motor de sonido.
- `src/main.js`: si la activación asíncrona de audio termina después de abrir Ajustes u otro panel, suena solo cuando ningún panel ni pausa lo impide.
- Manual del piloto: documentado el atajo **B** para los tres ambientes visuales; etiqueta de versión 0.9.5.

### Auditoría y límites
- Nueva suite `tests/audiovisual-integral.test.js`: 54 combinaciones de iluminación (3) × cámaras (3) × calidad gráfica (3) × efectos (2) con un WebGL *simulado*; audio de seis distritos en tres ambientes; pausa y doble activación con Web Audio simulado; escalado a móvil/alta resolución y referencias de controles.
- `npm run audit`: **258/258 pruebas**, sintaxis correcta, **6/6 modelos GLB**, 163 identificadores HTML sin duplicados, 41 botones con conexiones rastreadas *estáticamente*, 73 posiciones geométricas y 15 misiones detectadas.
- CI GitHub Actions solo de control de calidad (sin publicación) ejecuta ahora la auditoría completa en lugar de únicamente tests y sintaxis.
- Chromium bloquea **incluso una página HTML de prueba con data URL** mediante `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Por tanto, ninguna prueba de shader o aspecto gráfico real, sonido perceptual, flujo clic-a-clic ni medición FPS se puede dar por superada.
- Documentos `QA_FASE_6_6.md` y `MANUAL_QA_FASE_6_6.md` con matriz, gate y pasos para verificar en el ordenador del jugador.
- Estado: **ALPHA · NO APTO PARA RELEASE** hasta QA real. El ZIP contiene el proyecto completo, no ha sido publicado en GitHub.

## 0.9.4 — Fase 6.5 · Optimización gráfica y de audio (2026-10-12)

### Implementado
- `src/performance.js`: decisiones puras y verificables para el nivel de detalle de los coches lejanos, presupuestos de píxeles WebGL y cadencia de audio.
- Renderizador: caché del último conjunto de búferes de geometría para evitar tres re-enlaces innecesarios por cada rueda consecutiva, con invalidación segura al liberar una malla. Se mantiene la carrocería del rival con detalle reducido en MEDIO/ECO: se omiten sus cuatro ruedas y sombra si está lejos; de cerca se dibujan completas.
- Pantallas de alta resolución: máximo de 2,5 millones de píxeles internos en ALTO, 1,2 millones en MEDIO y 750.000 en ECO. Se preservan proporciones y controles. Semáforos fuera de 950 m no se dibujan, pero siguen participando en reglas del tráfico.
- Web Audio: actualización de parámetros limitada a 30 Hz mediante `AudioContext.currentTime` con interpolaciones existentes; las distancias de tráfico/patrullas se calculan solo cuando se necesita actualizar el audio. Reactivar audio fuerza actualización inmediata; los efectos de eventos no se limitan.
- Nuevos tests de políticas, framebuffer, renderizador y contexto de audio; `npm run check` incluye el nuevo módulo.

### QA y límites
- `npm run audit`: 253/253 pruebas, 6/6 GLB, estructura de UI/misiones e interacciones estáticas correcta.
- Prueba instrumental con GL simulado: un rival lejano pasa de 6 a 1 draw calls en ECO; tres dibujos consecutivos de la misma malla requieren solo 3 bindBuffer en vez de 9. **No son FPS reales**.
- No se cambian físicas, colisiones, localStorage, campaña, economía ni activos GLB.
- Falta comprobar el aspecto y medir FPS, CPU/GPU, consumo y audio en Windows, Linux Mint y móvil. Estado ALPHA, no publicado en GitHub.

## 0.9.3 — Fase 6.4 · Paisaje sonoro de Barcelona (2026-10-12)

- Nuevo `src/soundscape.js`: cálculo determinista de mezcla según barrio, hora visual, proximidad al tráfico, velocidad, deslizamiento, estado a pie y distancia de la patrulla.
- `src/audio.js` remasterizado: Web Audio opcional tras interacción, motor y derrapes, cuatro capas de ruido urbano con filtros, sirena atenuada por distancia y avisos de persecución. Sin pistas externas, temporizadores ni reproducción automática.
- Control de volumen en Ajustes (0, 25, 50, 60, 75, 100 %), persistente en la misma clave `chase404.settings.v7`. El modo AUDIO ON/OFF no se reactiva automáticamente al recargar.
- Las pausas, paneles y pérdida de foco silencian inmediatamente el bus maestro mediante fundido corto. En el modo arcade siguen disponibles los sonidos anteriores sin ambiente urbano.
- Etiqueta del barrio en la cabecera, actualizada según las coordenadas del jugador en el mapa condensado.
- **QA:** 247/247 tests, 6/6 GLB, audit estática completa. Se intentó la verificación con Chromium local, pero el contenedor bloqueó las conexiones HTTP y Chromium agotó el tiempo; no hay confirmación perceptual ni FPS/salidas reales.
- ALPHA, sin publicación en GitHub. Cambios de audio solo, ningún cambio de misiones, coches, economía o keys de campaña.

## 0.9.2 — Fase 6.3 · Cámara cinematográfica e impactos (2026-10-12)

- Nuevo módulo `src/camera-rig.js`: control de cámara determinista con interpolación dependiente del tiempo, mirada adelantada, ligera separación al ganar velocidad, FOV progresivo y respuesta a deslizamiento lateral real. Todas las amplitudes y ángulos están acotados.
- `Renderer` ahora integra el rig con sus tres modos CHASE/WIDE/BONNET, la altura del terreno en Barcelona, y lo reinicia al cambiar cámara, pista o modo. Sigue usando el WebGL y los seis GLB locales existentes.
- Colisiones urbanas con tráfico/barreras y primer contacto arcade activan pulso cinematográfico y flash de impacto, por evento real sin bucle infinito en barrera. Conserva polvo de neumáticos, efecto de velocidad y físicas de la versión anterior.
- `FX OFF` / `Reducir movimiento` impiden vibración, inclinación y zoom dinámico y desactivan el flash visual, sin alterar objetivos de juego ni controles.
- Nuevas pruebas de límites numéricos, amortiguación, derrapes, pendientes, choques, modo a pie y accesibilidad. `npm run check` incluye el módulo de cámara.
- QA automatizada: 239/239 pruebas; 6/6 GLB; auditoría de enlaces/controladores y geometría estática correcta. Prueba jugable real pendiente: Chromium local no generó captura.
- **Estado:** ALPHA, no publicado en GitHub.

## 0.9.1 — Fase 6.2 · Fachadas, carreteras y materiales (2026-10-12)

### Added
- Malla urbana: tratamiento de asfalto con zonas reparadas, juntas de pavimento y cinco pasos de peatones sobre la red existente.
- Fachadas de 29 edificios existentes: cornisas, pilastras, marcos, dinteles, persianas, portales y zócalos de piedra.
- Reflejo especular económico dependiente de la cámara para modelos de carrocería GLB y procedurales; ruedas con aspecto material distinto y nueva banda del neumático.
- Cuatro pruebas de regresión de materiales/geometría, presupuesto de vértices, posiciones de marcas e integración del shader.

### QA y límites
- `npm run audit`: **230/230 pruebas**, 6/6 GLB, estática de controles sin regresiones.
- Malla urbana: 273.729 → 308.619 vértices (+12,75 %), sin nuevas llamadas de render de escenario.
- Servidor HTTP local: 200; Chromium en contenedor no produjo screenshot y terminó por tiempo límite. No se ha podido certificar shader en GPU, calidad visual ni FPS reales.
- ALPHA, ninguna publicación en GitHub autorizada. Ver `QA_FASE_6_2.md`.

## 0.9.0 — Fase 6.1 · Remasterización visual: luz y atmósfera (2026-10-12)

### Added
- Tres looks seleccionables en Barcelona: **DÍA**, **ATARDECER** y **NOCHE** con dirección e intensidad luminosa, luz ambiente hemisférica, exposición, color de cielo y niebla WebGL propios.
- Shader con iluminaciones cálidas nocturnas específicas para farolas y ventanas marcadas en la geometría; un solo pase opaco (sin texturas, servidores ni dependencias).
- Botón de iluminación de la barra superior y tecla **B**; etiqueta legible e iluminación restaurada desde `chase404.lighting.v1`, con alternativa segura si localStorage está bloqueado.
- Graduación ambiental CSS que no captura los eventos táctiles; desactivada con contraste alto.
- Compatibilidad con los circuitos arcade: su iluminación original se conserva y el selector urbano se oculta fuera de BCN.
- `src/atmosphere.js` y pruebas nuevas de presets, persistencia, uniforms WebGL y conexión de controles.

### QA / alcance
- 226/226 tests automatizados; `npm run audit` correcto; 6/6 GLB; 161 IDs únicos y 41 botones con manejadores estáticos.
- HTTP del servidor local responde 200; Chromium rechaza incluso la URL 127.0.0.1 con `ERR_BLOCKED_BY_ADMINISTRATOR`: **no se ha realizado prueba visual/WebGL real**.
- Fase 6.1 exclusivamente visual: aún quedan mejoras de geometría, materiales detallados, cámara, audio y FPS medidos en dispositivos reales. Sigue en ALPHA. Sin subir a GitHub.

## 0.8.6 — Fase 5.7 · Auditoría integral (2026-10-12)

### Fixed
- Resueltas colisiones entre teclas de conducir y acciones globales E/I/J/X; ajustes antiguos con asignaciones conflictivas se restauran a controles seguros.
- La recompensa de un desafío solo se marca como reclamada en la partida después de guardar el saldo correctamente.
- Corregido texto de ayuda heredado sobre reasignación de la cámara.

### Added / QA
- Nuevo auditor `tools/audit_project.mjs`, agregado a `npm run audit` (sintaxis, pruebas, GLB, UI estática, acceso geométrico).
- 8 pruebas transversales nuevas: 15 misiones × cuatro ramificaciones, flujo conjunto de economía/actividades/secretos/contactos, garaje y persistencia segura, teclas reservadas.
- Pruebas Node **222/222 PASS**, 6/6 GLB, 158 IDs únicos, 40 botones con registro estático y 73 ubicaciones junto a calles.
- Nuevo informe `QA_FASE_5_7.md` y checklist de comprobación jugable `MANUAL_QA_FASE_5_7.md`; `QA.md` actualizado y QA original de DAYTONA archivada.
- Chromium real sigue bloqueado `ERR_BLOCKED_BY_ADMINISTRATOR`; no se certifica WebGL, clicks, FPS, Windows/Linux o móviles. Estado **ALPHA / gate bloqueado**. Sin subir a GitHub.

## 0.8.5 — Fase 5.6 · Voces de Barcelona (2026-10-12)

### Added
- Manel Roca, Clara Vidal y Núria Soler: contactos narrativos con posiciones diferenciadas y figuras low-poly en acera.
- Tres investigaciones secundarias a pie: conversación inicial, recuperación de prueba, regreso y elección entre entregar original o conservar copia.
- Reacciones narrativas y premios diferentes según la decisión, registrados en un nuevo diario consultable con J / VOCES.
- Minimap con marcadores verdes de personajes y ámbar de pruebas activas; N / INTERACTUAR contextual y modal con soporte táctil.

### Compatibility / Security
- Historial de contactos validado dentro de `chase404.side.v1`, sin nuevas claves ni acceso de red.
- Transacciones inmutables y persist-first: bloqueo de escritura no registra misión ni paga premios; ningún encargo se cobra dos veces.
- Conserva los récords, mejoras, garaje, secretos y la campaña anterior.
- Conversaciones y entradas del diario renderizadas usando `textContent`, no HTML inyectado.

### Tests & limitations
- 214/214 pruebas automatizadas, comprobación de sintaxis JS, 6/6 GLB, posiciones cercanas a calles y referencias HTML.
- Servidor HTTP local responde; Chromium sin sesión visual WebGL fiable en este entorno. Falta validar interacciones y FPS en dispositivos reales.
- PNJ geométricos sin animación ni voces; no altera la historia principal. ALPHA, publicación GitHub no autorizada.
- Ver `QA_FASE_5_6.md`.

## 0.8.4 — Fase 5.5 · Secretos de Barcelona (2026-10-12)

### Added
- Ocho archivos originales de misterio urbano (El Carmel, Turó, Guinardó, Gràcia, Eixample x2, puerto y Montjuïc), placas procedimentales 3D y marcadores diferenciados en el minimapa.
- Modo **EXPLORACIÓN LIBRE** sin objetivo ni límite de campaña para recorrer los barrios y descubrir las pistas a pie.
- **ARCHIVO DE LA CIUDAD** con relatos, pista para localizar lugares, porcentaje registrado y premios.
- Recogida contextual con X y botón táctil; botón E táctil para salir del coche y volver a subir.
- Recompensas: 45 ₧ por pista y 180 ₧ extra por ocho pistas, solo una vez por hallazgo.

### Compatibility / Fixed
- Almacenamiento atómico con `chase404.side.v1` compartido por mejoras, saldo, récords y colección de hallazgos; lectura compatible con v0.8.3.
- Un punto de Montjuïc fuera del vial detectado por los tests se trasladó a un acceso transitable según la malla de carreteras.
- Desplazamiento vertical del menú en pantallas pequeñas para que la nueva opción siga accesible.
- La detención policial en exploración libre devuelve a Gael al inicio, sin registrar derrota de campaña.

### Tests & limitations
- 204/204 tests Node, sintaxis JavaScript, 6/6 GLB, IDs HTML y conexiones estáticas de interfaz.
- No verificado visualmente en WebGL ni en Windows/Linux; no hay documentos reales y los relatos son ficción original.
- QA gate pendiente; **ALPHA**, sin publicación en GitHub. Ver `QA_FASE_5_5.md`.

## 0.8.3 — Fase 5.4 · Actividades urbanas (2026-10-12)

### Added
- Selector de actividades secundarias desde el menú BCN; mantiene la campaña de 15 capítulos y la actividad original.
- Contrarreloj «La ronda de los miradores»: cuatro controles, 310 segundos, 180 ₧.
- Transporte delicado «La cinta de cristal»: tres controles, 410 segundos, 235 ₧, máximo un impacto mecánico registrado tras iniciar el encargo.
- Pantalla de resultados de desafío con tiempo, controles y recompensa o causa de derrota.
- Mejor tiempo y completados independientes para cada actividad; el saldo se comparte con el taller y las mejoras.

### Changed / Fixed
- Mismo `chase404.side.v1` para conservar el guardado de v0.8.2 sin migraciones destructivas.
- El contador global no aumenta erróneamente el historial de «El recado del taller» al jugar otros desafíos.
- El segundo impacto del transporte delicado termina el encargo aunque ocurra en el primer frame simulado.
- Premios de una ejecución no se pueden reclamar dos veces; la pantalla indica si no pudo guardarse el premio.
- Los puntos están situados sobre carreteras de la malla urbana existente.

### Validation / Limitations
- Node: comprobación de sintaxis, tests automatizados, seis GLB y estructura estática de la UI.
- Faltan navegador/WebGL interactivo, prueba jugable completa, equilibrado con volante/teclado y FPS Windows/Linux.
- Chromium de este entorno rechaza incluso `file:///` con `ERR_BLOCKED_BY_ADMINISTRATOR`; el servidor local tampoco ha sido accesible.
- El transporte delicado registra impactos mecánicos; no incluye paquete físico visible, animaciones ni interfaz de mecánico.
- **Estado: ALPHA. Sin publicar en GitHub.**

## 0.8.2 — Fase 5.3 · Garaje Verenne (2026-10-12)

### Added
- Garaje del Carmel con edificio procedimental, marcador ámbar en minimapa y acceso contextual Y / botón.
- Colección local de hasta seis coches diferentes, saneamiento de datos y recuperaciones gratuitas.
- Modal dedicado, estado de condición por vehículo y niveles de mejoras asociados a cada modelo.
- Intercambio atómico: guarda los daños del coche que dejas antes de activar el vehículo elegido.
- Archivo `QA_FASE_5_3.md` y 7 pruebas adicionales de economía/colección/persistencia.

### Verified
- Node.js 182/182 pruebas automáticas, comprobación de sintaxis, seis GLB y 127 IDs HTML únicos.

### Known limitations
- Navegador Chromium bloqueado por política de administración al visitar servidor local; el QA jugable y métricas de FPS quedan pendientes.
- Sin interior de garaje, compra/venta de coches ni visualización física de todos los vehículos aparcados.

## 0.8.1 — Fase 5.2 · Taller del Carmel (2026-10-12)

### Added
- Taller 3D reconocible en El Carmel, acceso contextual con T/botón y minimapa.
- Reparación integral por coste variable y tres mejoras (motor, dirección, frenos) de hasta dos niveles por modelo.
- Menú interactivo con saldo, estado, precios, limitaciones y mensajes de compra.
- Extensión saneada del guardado `chase404.side.v1` preservando progreso v0.8.0; mejoras permanentes por coche urbano.
- Pruebas de saldo, daños, compra máxima, fallos de guardado, migración y física arcade.

### Fixed
- Los ingresos del encargo secundario no se mantienen en memoria si falla el guardado local.

### Known limitations
- Pruebas de navegador real bloqueadas por la política del entorno; FPS y jugabilidad completa en Windows/Linux pendientes.
- Taller simplificado, sin interior 3D ni mecánicos animados.

## 0.8.0 — Fase 5.1 (2026-10-12)

- Added: encargo secundario del taller en El Carmel, tres entregas y límite.
- Added: saldo ficticio, mejor tiempo y estadísticas locales versionadas independientes de la campaña.
- Added: pruebas de vencimiento, finalización y saneamiento de estadísticas.
- Known: comprobación jugable visual pendiente.

## 0.7.4 — Fase 4.15 · Barcelona no perdona

### Added
- Misión 15, dos rutas según la decisión guardada de la misión 14 y dos epílogos diferentes.
- Persecución final con patrullas, rescate/recuperación a pie y encuentro con Salvat.
- Pruebas automatizadas de ambos desenlaces, validación del guardado y límite de tiempo.

### Fixed
- Los objetivos de evasión y extracción intermedios avanzan de etapa sin terminar prematuramente la misión.
- Botón de continuar disponible de la misión 14 a la 15.

### Known limitations
- Interacciones narrativas sin personajes 3D ni cinemáticas; QA visual y rendimiento pendientes.

## 0.7.0 — Fase 4.11 · El precio del rescate

### Added
- Misión 11: acceso al almacén, rescate a pie cronometrado y huida hasta un refugio.
- Dos patrullas aparecen tras rescatar al testigo.
- Objetivo de extracción que exige conducir y perder la proximidad policial.
- Pruebas de rescate, extracción, derrota y progresión.

### Known limitations
- El testigo todavía se representa mediante el objetivo interactivo; no existe NPC 3D ni traslado físico de pasajero.
- Prueba visual de navegador y FPS en Windows/Linux pendientes.

## 0.6.9 — Fase 4.10 · La voz de Clara
- Added: misión 10 con encuentro a pie y 5 segundos de contacto.
- Added: cuatro pruebas de la interacción y finalización.
- Changed: progresión y desenlace de la campaña hasta el capítulo 10.
- Known: diálogo representado por HUD y relato, sin personaje 3D independiente.

## 0.6.8 — Fase 4.9 — Los testigos de la noche (2026-10-12)

### Added
- Misión 09 con objetivo intermedio distinto para AVENIDA OESTE y CALLE DE SERVICIO.
- Persistencia local versionada de la elección tomada al completar la misión 08.
- Validación y fallback ante guardados corruptos o almacenamiento bloqueado.
- Cinco nuevas pruebas para ramificación, finalización y persistencia.

### Changed
- Botón de continuación de la campaña disponible hasta la misión 09.
- Mensaje narrativo de misión 09 y eliminación de duplicación en el final de misión 08.

### Known limitations
- Las consecuencias consisten en objetivos y texto distintos; todavía no hay NPC ni escenas animadas.
- Campaña desbloqueada en la sesión actual; no se implementa aún un selector de capítulos persistente.
- Pendientes prueba visual WebGL, FPS y ejecución Windows/Linux.

## 0.6.7 — Fase 4.8 — La emboscada (2026-10-12)

### Added
- Misión 08 «La emboscada», con dos patrullas de evento y rutas alternativas por avenida oeste y calle de servicio.
- Objetivo de evasión: llegar al refugio y mantener al menos 75 metros de separación durante cinco segundos.
- Indicadores de objetivos para bifurcación y progreso de evasión.
- Cuatro pruebas nuevas de misión y rutas.

### Changed
- Progresión de campaña y botones de continuación extendidos hasta misión 08.

### Known limitations
- Las patrullas reutilizan IA básica; no existe comportamiento táctico coordinado ni señalización de elección de ruta más allá del minimapa.
- Pruebas interactivas visuales, FPS y ejecución Windows/Linux pendientes.

## 0.6.4 — Fase 4.5 — Montjuïc y misión 05 (2026-10-11)

### Added
- Acceso ficticio desde los muelles a Montjuïc con carreteras serpenteantes, desnivel, mirador, arbolado y fortificación simplificada.
- Misión 05 «La última curva» con tres destinos, tiempo límite de 340 segundos y nuevo avance narrativo.
- Pruebas de rutas, terreno, misión 05 y compatibilidad con el capítulo 04.

### Changed
- Expansión de terreno y límites de ciudad; actualización del test de extensiones para no fijar los límites anteriores.
- Progresión del botón de siguiente misión hasta el capítulo 05.

### Known limitations
- Distrito estilizado y ficticio, no réplica histórica.
- Sin test interactivo completo de navegador ni mediciones FPS en Windows/Linux.

## 0.5.4 — Fase 3.5 (ALPHA)
- Added: estado a pie para Gael Verenne, desplazamiento por el barrio y control E para salir/entrar en vehículos detenidos.
- Added: avatar 3D low-poly local y seguimiento de cámara.
- Added: cuatro tests de transiciones y seguridad de interacción.
- Changed: HUD y minimapa permiten representar a Gael caminando.
- Known: modelo provisional, sin animación de puertas o cambio de física según coche tomado; QA visual pendiente.

## 0.5.3 — 2026-10-11 (ALPHA, Fase 3.4)

### Added
- Daños mecánicos acumulativos en El Carmel, límites, cooldown y HUD de condición.
- Impactos contra vehículos y barreras afectan aceleración, dirección y frenada.
- Pruebas unitarias de daño, reparación por reinicio y aislamiento respecto a circuitos.

### Limitations
- Sin deformación visual ni taller; revisión interactiva real pendiente.

## 0.5.1 — 2026-10-11 (ALPHA, Fase 3.2)

### Added
- Primera persecución policial al circular a velocidad excesiva durante varios segundos.
- Mecánica básica de detención/escape y avisos de policía durante misión urbana.
- Pruebas automatizadas de IA policial.

### Changed
- Tráfico con aceleración y frenada progresivas, evaluación de proximidad sin depender del orden y cesión simplificada en extremos de vía.
- Suite de pruebas ampliada a 82.

### Limitations
- Sin navegación policial por calles, semáforos reales o colisiones entre vehículos.
- Inspección visual de Fase 2 pendiente. No es release estable.

## 0.5.0 — 2026-10-11 (ALPHA, primera iteración de Fase 3)

### Added
- Tráfico determinista de siete vehículos en El Carmel, con rutas bidireccionales y pausa cercana al jugador.
- Tres pruebas automatizadas de tráfico y documento QA de transición.

### Changed
- Render de vehículos urbanos ajustado a la elevación del terreno.
- Conservados los circuitos y modos anteriores.

### Limitations
- La Fase 2 continúa pendiente de validación visual y de rendimiento.
- No hay todavía física de colisiones del tráfico, semáforos ni IA policial.

## v0.4.0 — Fase 1 · 2026-10-11
- Protagonista rebautizado a Gael Verenne.
- Nueva misión urbana jugable `La cinta del Turó`: tres destinos en orden, cuenta atrás, victoria, derrota y reinicio.
- Señalización del objetivo activo en minimapa y panel de misión.
- Preservados los circuitos y los seis modelos GLB de la base v0.3.0.
- Nuevas pruebas unitarias para el estado de misión.

## v0.7.3 — 2026-10-11 · Sentido visual de los controles
- Corregido el sentido de giro para que A/← vaya a la izquierda y D/→ a la derecha en pantalla.
- Añadida comprobación de integración del giro derecho con la asignación predeterminada.
- 65/65 pruebas Node PASS.

## v0.7.2 — 2026-10-11 · Respuesta de dirección
- Corregido el contravolante automático que reducía la respuesta mientras el jugador mantenía una tecla de giro.
- Aumentada moderadamente la autoridad de dirección; se conserva la estabilización al soltar el control.
- Prueba reforzada para confirmar que D y la entrada `right` giran el coche hacia la derecha con desplazamiento visible.
- 65 pruebas Node; conducción WebGL/GPU real aún pendiente de validación manual.

## v0.7.1 — 2026-10-11 · Hotfix de controles y conducción
- Ajustado comportamiento arcade de dirección y derrape para prevenir virajes excesivamente bruscos y deslizamientos persistentes.
- Mejora de recuperación tras impactos contra barreras; prioridad de frenada frente a aceleración simultánea.
- Nuevo módulo `src/controls.js` con estados independientes por tecla y puntero, sin liberaciones prematuras cuando varias entradas activan la misma acción.
- Selector de sensibilidad (75/100/125 %) en el menú de ajustes, con guardado local y valor predeterminado 100 %.
- Proyección a pista acelerada mediante segmentos próximos y respaldo global; iteraciones físicas más tolerantes a FPS bajos.
- Nuevas pruebas de control, física y geometría. 64/64 pruebas Node, 91/91 UI simulada, 22/22 HTTP.
- Sin validación de conducción WebGL real, GPU ni equipos físicos; no publicado en GitHub.

## v0.7.0 — 2026-10-11 · Fase 7 / Rendimiento y accesibilidad
- Nuevo panel de AJUSTES, accesible con botón o tecla O. Se detiene la simulación sin descartar la carrera.
- Reasignación validada y persistente de teclas principales; flechas como alternativa, controles táctiles conservados.
- Contraste reforzado, tamaños de HUD 90–120% y movimiento reducido (partículas 3D y capas FX desactivadas).
- Calidad AUTO predeterminada con bajada y recuperación escalonada de resolución según FPS y periodos de espera para impedir cambios constantes.
- Evita dibujar coches muy lejanos situados detrás de la niebla; física, IA y clasificación no cambian.
- Preferencias normalizadas y almacenadas localmente, con recuperación segura si el perfil está corrupto.
- 50 pruebas Node y 83 comprobaciones de interfaz simulada; intento de Chromium WebGL real documentado como bloqueado.
- Conservados seis coches GLB, tres circuitos, cuatro modos, sonidos, progresión, récords y lanzadores.
- No publicado en GitHub. FPS y compatibilidad real Windows/Linux siguen sin verificarse.

## v0.6.0 — 2026-10-11 · Fase 6: Arcade Remix (build de prueba)

### Implementado
- Remasterización de los seis GLB locales: faldones, grille, luces, detalles aerodinámicos y colores de equipo; generador reproducible sin librerías externas.
- Identidad visual compartida en las tres pistas: puestos de comisarios, grandes mástiles, señales, monumentos y nubes 3D geométricas.
- Cielo de color específico por pista, contraste del sol ajustado en el shader de WebGL y detalles ambientales.
- Nueva capa de efectos físicos: polvo de derrape de geometría reutilizada, con límite de partículas y limpieza al cambiar de circuito.
- Efectos periféricos de velocidad e impacto, opción FX (botón y tecla F), persistencia local y respeto a `prefers-reduced-motion` para efectos de pantalla.
- Audio procedural Web Audio con motor multicapa, viento, neumáticos, señales de salida/vuelta/récord/colisión/meta; audio explícitamente opt-in, sin archivos de terceros.
- Estudio opcional de Blender para importar cualquier GLB, configurar luces/cámara y guardar un proyecto editable.
- Solucionada permanencia del sonido al volver al garaje; optimizado audio en estado de pausa.
- Pruebas nuevas de audio, efectos y dibujo de partículas; ampliado smoke test de botones FX.

### Limitaciones conocidas
- El navegador de Chromium del entorno bloquea localhost; render WebGL real y audio real escuchado pendientes de comprobación de usuario.
- Blender no está instalado aquí; el script se validó sintácticamente, no ejecutado dentro de Blender.
- No hay música compuesta por pistas, reflejos reales ni partículas transparentes; diseño deliberadamente low-poly.
- No publicado en GitHub.

# CHANGELOG — DAYTONA 404

## [0.5.0] — 2026-10-11 · Fase 5: World Cup y progresión

### Incorporado
- Cuatro modos: Arcade Race, Time Attack, Free Run y World Cup.
- World Cup de tres circuitos consecutivos con puntuación 10/8/6/5/4/3/2/1, resumen por ronda, continuación y copa nueva.
- Perfil local versión 5 con experiencia, medallas, victorias, podios, copas y récord de tiempo total por modo/circuito/coche.
- Desbloqueo de dos temas HUD: Neón con 120 XP y Oro con 350 XP; los seis coches y tres circuitos se mantienen accesibles.
- Recuperación de copa entre sesiones después de cada ronda y confirmación antes de reiniciarla.
- Selección de modo, panel de perfil, progreso de campeonato y recompensas en pantalla de resultados.
- Validación estricta de datos guardados, control de recompensas duplicadas, gestión de almacenamiento bloqueado y récords de vuelta por modo.
- Seis nuevos tests de progresión y veinte nuevas verificaciones de interfaz simulada.

### Correcciones
- Reiniciar una carrera conserva los parámetros físicos del vehículo seleccionado.
- Al finalizar una copa y volver al garaje, el inicio crea una nueva copa correctamente.
- Protección frente a la doble aplicación del evento de meta.

### Compatibilidad y límites
- Se conservan las claves de mejor vuelta Arcade v4; otros récords de vuelta se separan por modo.
- La simulación gráfica real y los scripts de Blender continúan pendientes de prueba en hardware y software reales.
- Sin publicación en GitHub. **Build de prueba, no release candidate.**

---

## [0.4.0] — 2026-10-11 · Fase 4: World Tour

### Nuevo
- Tres circuitos originales con centro de pista, longitud, entornos y minimapa distintos: Sunset Speedway, Pacific Coast y Midnight Ridge.
- Seis vehículos seleccionables con física, decoraciones y complementos de carrocería diferenciados.
- GLB locales para los seis coches, con carga diferida y representación procedural de respaldo.
- Selector de pista y garaje en menú inicial y pausa. Cambiar de contenido reinicia la clasificación para impedir estados inconsistentes.
- Botón para regresar al garaje después de terminar una carrera.
- Récords locales indexados por circuito y vehículo.
- Script Blender opcional para producir cinco modelos editables y exportaciones GLB; requiere prueba real en Blender.
- Generador Node.js reproducible de los cinco GLB nuevos.
- Pruebas de cambio de pista, tiempos de carrera, geometría de coches y carga de modelos.

### Conservado
- Física arcade, IA de siete rivales, contactos, rebufo, tres vueltas, HUD, audio, controles táctiles y lanzadores Windows/Linux.

### Limitaciones abiertas
- WebGL real, Blender real, Windows/Linux físicos y GitHub Pages todavía no validados desde este entorno.
- Circuitos sin pendiente física ni peraltes físicos; rivales comparten estructura visual simplificada.
- Sin campeonato, guardado de progresión ni variedad musical final (programados para fases posteriores).

---

# CHANGELOG — DAYTONA 404

## v0.3.0 — 2026-10-11 · Fase 3: Motor de carreras (build de prueba)

### Añadido
- Siete rivales controlados por IA determinista, vehículos con decoraciones de vértice distintas y ruedas animadas.
- Tráfico competitivo, cambios de carril, velocidades de crucero diferenciadas y adaptación básica a curvas.
- Clasificación en directo para ocho pilotos, posición, tiempos, reloj, vuelta actual y distancia al competidor anterior.
- Colisiones entre jugador y rivales, con corrección de penetración y penalización de velocidad.
- Rebufo con detección de estela y pequeño impulso de aceleración/resistencia en `physics.js`.
- Carreras de tres vueltas, pantalla de resultados, tiempos de meta IA y opción de nueva carrera.
- Minimapa con siete puntos de los rivales y estado REBUFO en el HUD.
- Nuevas pruebas Node y ampliación del test Chromium con renderizador simulado.

### Corregido
- La velocidad deseada de la IA quedaba sobrescrita a cero al construir los rivales; corregido y cubierto por pruebas.
- Las vueltas de carrera con choque de barrera ahora cuentan si cruzan sectores correctamente, pero no generan récords válidos.
- Los rivales que llegan a meta continúan circulando visualmente para evitar bloquear la línea de llegada, manteniendo clasificación y tiempo oficiales.
- R reinicia carrera y rivales juntos, en lugar de permitir reiniciar solo el coche mientras la IA sigue compitiendo.

### Conservado
- Motor 3D sin dependencias de red, GLB principal, pista, cámaras, audio, pausa, calidad gráfica, ayuda, lanzadores y récord local.

### Pendiente
- Prueba WebGL real y compatibilidad con GPU física, pruebas manuales de Windows/Linux, ajustes finos de IA y colisiones, sonido y arte definitivo, nuevos modos y circuitos.
- No publicado en GitHub.

## v0.2.0 — 2026-10-11 · Fase 2: Visual slice (build de prueba)

### Añadido
- Recurso local GLB 2.0 `assets/models/racer-04.glb`, carrocería original y decoración 04.
- Nuevo lector/validador GLB WebGL1 (`src/glb.js`) y fallback de la carrocería procedural.
- Script Blender remodelado con conversión de ejes correcta, salvado `.blend` y export GLB.
- Generador reproducible de GLB de previsualización en `tools/build_stockcar_glb.py`.
- Cuatro ruedas dibujadas independientemente con rotación y giro de dirección.
- Sombra simple bajo el vehículo y shader con sol cálido, iluminación hemisférica y niebla.
- Garajes de boxes, pista auxiliar de paddock, torre de control, pasarelas, torre de tiempos, banderas y vegetación.
- Botón y atajo G para ALTA/MEDIA/ECO; estado del asset visible en HUD.
- Nuevos tests de GLB y renderizador simulado, revisión de sintaxis, pruebas de interfaz con adaptador gráfico simulado y protocolo de QA de navegador.

### Conservado
- Pista ovalada, conducción arcade, barreras, sectores, récord local, audio, HUD, ayuda, cámaras, pausa, reset y lanzadores Windows/Linux.

### Conocido / pendiente
- El ejecutable Blender no está instalado en el entorno; el GLB incluido fue generado con la herramienta de vista previa Python.
- Chromium impide navegación HTTP por política del entorno; prueba WebGL real pendiente.
- Sin rivales ni campeonato, sin sonidos definitivos, sin render PBR y sin texturas GLB.
- No publicado en GitHub; build para validación del usuario.

## v0.1.0 — 2026-10-11 · Fase 1
- Prototipo arcade 3D WebGL nativo, física, circuito, controles, cámara, HUD, récord local, audio opcional, QA y lanzadores.

# CHASE 404 — Fase 2 · Barcelona Distrito 01 (v0.2.0)

- Añadida escena urbana procedural con siete calles por eje, cruces conectados, manzanas de edificios, ventanas, plaza, pasos de peatones y franja portuaria.
- Añadida conducción libre urbana independiente de la proyección por circuito, con velocidad máxima de 126 km/h, desaceleración al salir de calzada y corrección en bordes.
- Cámara de persecución y minimapa adaptados al distrito. La interfaz oculta información de vueltas y clasificación durante la exploración.
- Añadidas cuatro pruebas de regresión del distrito y la física urbana.
- Aún no se implementan tráfico, policía, misiones, daño ni los nuevos modelos americanos de época.


# CHASE 404 — Fase 3 · El Carmel, Barcelona, 1984 (v0.3.0)

- Sustituido el primer mapa urbano por un barrio ficticio de ladera inspirado en El Carmel.
- Añadidos terreno elevado, calles sinuosas, aceras, muros, escaleras, viviendas y mirador inspirado en el Turó de la Rovira.
- Adaptados minimapa, HUD y textos de inicio a 1984.
- Añadida orientación visual del coche y cámara sensible a la elevación local.
- Se mantienen disponibles las tres pistas heredadas.
- Añadidas pruebas de geometría, calles, salida y manejo urbano.

## 0.4.1 — Fase 2.1, preparación del pipeline 3D
- Añadido generador paramétrico de arquitectura y mobiliario de El Carmel en Blender (`blender/chase_asset_library.py`).
- Exportación GLB aislada en `assets/staging/`, sin sobrescribir los coches publicados.
- Añadido validador independiente que usa el importador real del motor WebGL.
- Documentado contrato de materiales, límites GLB y comprobaciones pendientes.
- Sin cambios intencionados en conducción, misiones o lógica de juego.

## v0.4.2 — Fase 2.2: primer vehículo remasterizado
- Nueva geometría Verenne V8 1984 original para el BLAZE V12; conserva el identificador existente.
- Se integran faros cuádruples, parrilla y parachoques cromados, cristales, techo coupé, espejos, tiradores, molduras y detalles del capó.
- Exportación offline GLB determinista y archivo fuente Blender editable mediante script.
- Pruebas específicas de malla, proporciones y decodificación con importador del videojuego.

## v0.4.3 — Fase 2: paquete de ampliación visual
- El Carmel: nueva colección de farolas, jardineras, arbolado, escaparates, cabinas y antenas.
- Verenne V8: detalles de molduras, matrícula y carrocería; GLB reconstruido.
- Test de ciudad corregido para geometrías grandes.
- 76/76 tests; navegador real bloqueado por políticas del entorno.

## 0.5.2 — Fase 3.3 (2026-10-11)
- Added: `src/road-network.js`, red de puntos y trayectorias por calles del Carmel.
- Changed: policía usa navegación por calles en lugar de orientar directamente hacia el jugador.
- Added: `src/urban-collisions.js`, colisiones arcade con tráfico y patrulla.
- Added: `tests/urban-navigation.test.js`, cuatro pruebas nuevas.
- Verified: 86/86 pruebas de Node, GLB y comprobación sintáctica.
- Known limitations: revisión en navegador, FPS y ruta policial avanzada pendientes.

## v0.5.5 — Fase 3.6
- Cada coche del tráfico posee una identidad de vehículo persistente durante su circulación.
- Cambiar de coche aplica su ficha técnica original, modelo GLB y nombre en el HUD.
- Inicialización segura de daños al abordar el nuevo vehículo.
- Leve balanceo visual al caminar.
- Pruebas unitarias de cambio de identidad, físicas y valores desconocidos.

## v0.5.6 — Fase 3.7 (2026-10-11)
- Added: ciclo determinista de semáforos de prioridad para tráfico ambiental (`src/signals.js`).
- Changed: coches de Gael abandonados permanecen aparcados mientras dure la misión.
- Changed: policía recibe la posición de Gael cuando está a pie.
- Added: tres pruebas de señales, detenciones y automóviles aparcados.
- Verified: 100/100 pruebas automáticas, sintaxis y seis GLB válidos.
- Pending: señalización visual, reglas completas en intersecciones, colisiones peatonales y validación en navegador real.

## 0.5.7 — Fase 3.8 (2026-10-11)
### Added
- Semáforos tridimensionales de estados rojo/ámbar/verde sincronizados con el simulador urbano.
- Prevención básica de atravesar coches cuando Gael camina.
- Tres pruebas de integración de interacciones urbanas.
### Known limitations
- Colisión a pie radial y señalización visual simplificada; pendiente prueba interactiva real.

## 0.5.8 — Fase 3.9: movimiento de Gael

### Added
- Carrera a pie usando el botón de freno de mano.
- Animación procedural de brazos y piernas al caminar.
- Tres pruebas de interacción a pie.

### Fixed
- Avances largos entre frames ya no saltan por encima de vehículos estacionados.
- Movimiento en contacto con un coche permite deslizamiento por el eje libre.

### QA
- `npm test` 106/106, `npm run check` y `npm run assets:validate` PASS.
- Prueba visual interactiva y compatibilidad real aún pendientes.

## 0.5.9 — Auditoría de Fase 3 (2026-10-11)
- Corrección de aparición de Gael al abandonar el coche cuando otro vehículo ocupa la puerta habitual.
- Añadidas dos pruebas de seguridad de descenso y actualización del informe de QA.
- Se mantiene la Fase 3 sin cerrar por pruebas interactivas no ejecutables en este entorno.

## 0.6.0 — Fase 4.1
- Added: corredor Guinardó, malla urbana y arquitectura de transición.
- Changed: minimapa ajustado a la extensión del escenario.
- Tests: conectividad, límites y geometría.

## 0.6.1 — Fase 4.2
- Ruta ficticia conectada a Gràcia con arquitectura y pequeña plaza.
- Misión 02 «El contacto de Gràcia» desbloqueada al completar la primera.
- Minimap recalibrado para incluir ambos barrios.

## 0.6.2 — Fase 4.3 · Eixample (2026-10-11)
- Added: corredor de avenidas ficticias inspirado en el Eixample y manzanas con balcones, comercios y arbolado.
- Added: misión 03 «Las avenidas no olvidan», con tres destinos y límite de 245 segundos.
- Changed: minimapa extendido y capítulos parametrizados en `mission.js`.
- Preserved: misiones 01 y 02, conducción y modos arcade existentes.
- QA: ver `QA_FASE_4_3.md`.

## 0.6.3 — Fase 4.4
- Added: puerto industrial ficticio, almacenes, contenedores y grúas.
- Added: misión 04 «Sombras del puerto».
- Fixed: avance de capítulos 02→03 y 03→04.
- Fixed: minimapa escalable a todos los distritos.

## 0.6.5 — Fase 4.6
- Añadida misión 06 con mecánica de vigilancia estacionaria y regreso al puerto.
- HUD de observación y transición secuencial desde misión 05.
- Añadidas pruebas de vigilancia, velocidad y abandono de la zona.

## 0.6.6 — Fase 4.7 · seguimiento del convoy
- Added: capítulo 07 «La sombra del convoy» y vehículo sospechoso con movimiento determinista por vías portuarias.
- Added: seguimiento durante 14 segundos a 22–95 metros; perder contacto 9 segundos provoca fracaso.
- Changed: progresión, HUD y resultado para la séptima misión.
- Tests: cuatro pruebas nuevas de ruta, seguimiento, fallo y acceso al capítulo.
- Known limitation: no hay NPC conductor ni escenas cinemáticas; falta prueba interactiva de navegador y medir FPS.

## 0.7.1 — Fase 4.12
- Añadida misión 12 «El archivo de los ausentes» con testigo, investigación a pie y entrega del código en el puerto.
- Progresión 11 → 12, texto narrativo y HUD para investigación.
- Tres pruebas de regresión de investigación, victoria y tiempo límite.

## 0.7.2 — Fase 4.13
- Misión 13 «El nombre en la cinta»: contacto, vigilancia estacionaria e investigación final a pie.
- Se revela al inspector corrupto Víctor Salvat; desbloqueo de 12 → 13.
- Corregido el final de una misión cuando su último objetivo es una interacción temporizada.
- Cuatro pruebas específicas añadidas. QA interactivo pendiente.

## 0.7.3 — Fase 4.14 · 2026-10-12
### Added
- Misión 14 «La última decisión»: encuentro a pie, elección espacial explícita y dos desenlaces jugables distintos.
- Guardado local versionado y validado de la decisión final (`chase404.campaign.final-choice.v1`).
- Pruebas de ambas rutas, recuperación de decisión, datos corruptos y derrota por tiempo.
### Changed
- Progresión de campaña ampliada de 13 a 14 misiones.
### Known limitations
- Todavía no hay PNJ 3D del hermano de Gael ni cinemáticas del rescate.
- La decisión de la misión 14 queda preparada para afectar a la misión 15, que aún no está implementada.
- Pruebas visuales reales de juego y FPS en Windows/Linux pendientes.

## v0.9.8 — Pulido del personaje a pie
- Rehecha la figura de Gael sin extremidades superpuestas.
- Brazos y piernas articulados por pivotes con zancada distinta al correr.
- Nuevo control de regresión de animación; conducción y cámara sin cambios.

## v0.10.0 — Fase 7.2 · Retratos y presentación cinematográfica de conversaciones
- Retratos estilizados diferenciados para Manel, Clara y Núria, sin dependencias ni activos remotos.
- Nueva cabecera visual de conversación, rótulos por estado narrativo y animación de entrada opcional.
- Accesibilidad: `prefers-reduced-motion` suprime las transiciones.
- Tres pruebas nuevas de presentación; audit completo 274/274; física y controles conservados.
- Pendiente validar visualmente en navegador real; los PNJ del entorno siguen siendo estáticos.

## 0.10.2 — Fase 7.4
- Seis interludios narrativos en misiones clave con pausa de simulación, controles accesibles y estilo cinematográfico.
- No cambia conducción ni movimiento a pie.

## v0.10.3 — Fase 7.5 · Actores del desenlace
- Figura contextual del hermano de Gael en el muelle y de Víctor Salvat en la confrontación final.
- Actores articulados sencillos fuera de la malla estática, con animación ambiental y opción de reducción de movimiento.
- Visibilidad vinculada al capítulo, la etapa y la decisión anterior; no altera objetivos, colisiones ni conducción.
- Nuevas pruebas de regresión de presencia y accesibilidad; inspección visual de WebGL pendiente.

## v0.10.4 — Fase 7.6 · Auditoría de escenas y personajes
- Corrección de transición: la apertura de una escena narrativa interrumpe inmediatamente las actualizaciones físicas del fotograma y elimina tiempo acumulado.
- Cierre de escenas más robusto con restauración de foco condicionada a presencia en DOM.
- Auditoría narrativa adicional: puntos de interludio, apariciones según elección y estados de misión.
- 288/288 pruebas automáticas y 6/6 modelos GLB; jugabilidad visual completa pendiente.

## v0.10.5 — Fase 8.1 · Conducción de precisión
- La misión 03 incluye un control discreto de velocidad en Eixample (15–45 km/h durante 3 s en una zona de 55 m).
- Nuevo tipo de objetivo `precision-drive`, con reinicio al salir de zona, velocidad o vehículo.
- Indicador de progreso compatible con HUD existente; física del coche y movimiento a pie intactos.
- 4 pruebas nuevas y actualización de regresiones de campaña: auditoría 292/292, 6 GLB válidos.
- Validación real de WebGL/jugabilidad pendiente.

## v0.10.8 — Fase 8.4 · Presentación de objetivos
- Nuevas indicaciones de objetivo con descripción contextual y cierre manual.
- Transiciones que nombran el siguiente objetivo, sin alterar las reglas ni la economía.
- Pruebas unitarias de indicaciones y auditoría integral: 301/301.
- Validación visual y jugable real todavía pendiente.

## v0.10.9 — Fase 8.5: Resultados de misión
- Resumen de misión con evaluación S/A/B, tiempo disponible, estado del vehículo e impactos.
- Registro visible de la elección narrativa en misiones con bifurcación.
- Resultados de derrota sin evaluación positiva.
- Módulo de presentación independiente `src/mission-report.js` y 4 pruebas nuevas.
- No se alteran física, controles, persistencia ni pagos.

## v0.11.0 — Fase 8.6 · Auditoría transversal de jugabilidad
- Corregida incoherencia de resultados cuando la policía detenía al protagonista: título y resumen ahora comparten causa de derrota.
- Regresión de captura, contacto perdido, tiempo agotado y victoria; 306/306 tests.
- Conservados sin cambios controles a pie, físicas de conducción y economía.
- QA y guía de pruebas manuales en `QA_FASE_8_6.md`; revisión WebGL real pendiente.

## v0.11.1 — Fase 9.1 · Estabilidad del bucle de ejecución
- Guardián de errores para el bucle de animación: el primer fallo detiene nuevos fotogramas y presenta un diagnóstico sin generar cascadas.
- La pérdida de WebGL y los fallos de arranque comparten un único mecanismo de parada.
- Audio y controles quedan desactivados tras un error fatal; recarga necesaria para restablecer WebGL.
- Cuatro pruebas nuevas; 310/310 pruebas automatizadas y seis GLB validados. Validación real pendiente.

## v0.11.3 — Fase 9.3 · Auditoría de campaña y elecciones finales
- Corregida pérdida de decisión narrativa entre misiones 14 y 15 cuando el almacenamiento del navegador falla: respaldo de sesión en memoria.
- La elección en memoria prevalece al avanzar a la misión 15; al volver al menú se elimina el respaldo temporal.
- Tres nuevas pruebas de regresión para ambos finales, guardado bloqueado y misiones incompletas.
- Auditoría total: 317/317 pruebas; 6/6 modelos GLB; auditoría estática correcta.
- Sigue pendiente jugar la campaña entera y validar rendimiento/visual en navegadores reales.

## v0.11.4 — Fase 9.4 · Compatibilidad de lanzadores y móvil
- Nuevas acciones táctiles de exploración: HABLAR, PISTA y DIARIO, ocultas fuera de Barcelona.
- Ajustes CSS para las acciones táctiles en pantallas estrechas, conservando pedales y botón de coche.
- Cuatro pruebas nuevas de compatibilidad estática: auditoría global 321/321.
- Sintaxis Python y Bash comprobada; funcionamiento real en Windows/Linux/iOS/Android pendiente.

## v0.12.2 — Fase 10.6 · Aceptación de juego basada en evidencias
- Puerta `npm run acceptance:play` con 12 criterios que **no se autocompletan** con las pruebas técnicas.
- Plantilla de registro pendiente y cuatro pruebas automatizadas del validador de evidencia.
- Candidato técnico todavía ALPHA hasta validar en sesiones reales Windows/Linux/móvil, campaña completa, finales y GitHub Pages.
- Ningún cambio en conducción, controles, misiones o guardados.

## 0.12.7 — Fase 11.3
- Elementos decorativos de ladera: diez muros de contención, cuatro tramos de escaleras y ocho señales urbanas.
- Selección del lado libre junto a los cruces teniendo en cuenta toda la red vial.
- Dos pruebas nuevas de geometría y distancia; controles y físicas sin cambios.

## 0.12.8 — Fase 11.4 · Atmósfera y vida urbana
- Seis rincones de El Carmel con bancos, jardineras y tablones vecinales.
- Seis rincones comerciales de Gràcia con persianas, mesas y luminarias.
- Dieciocho acentos de ventanas cálidas en fachadas de Gràcia, reconocidos por el shader nocturno existente.
- Distancia a toda la red de calles validada para evitar invasión de la calzada.
- Presupuesto geométrico explícito actualizado tras la ampliación; queda por medir rendimiento real.
- Sin cambios en físicas, controles, colisiones, misiones o persistencia.

## 0.13.2 — Fase 11.8
- Materiales y ventanas con relieve y cristal cálido/oscuro en El Carmel y Gràcia.
- Dos pruebas automatizadas de geometría y paletas.
- Física y controles sin modificaciones.

## v0.13.8 — Fase 11.14: articulación de codos y rodillas
- Gael dispone de antebrazos y pantorrillas independientes.
- Flexión en las fases de avance y recuperación, con mayor amplitud al correr.
- Cinco nuevas pruebas de rig y transición; ajustadas tres aserciones antiguas al nuevo rig.
- Conducción y controles intactos.

## v0.14.0 — Fase 11.16 · Gael GLB modular
- Se exportan seis piezas articuladas de Gael a GLB 2.0 local (`assets/models/gael/`).
- El motor carga las seis piezas en conjunto y conserva el modelo procedural si falla cualquier recurso.
- Se mantiene la animación procedural por articulaciones: el importador NO admite `skins` ni `animations` de glTF; no es una animación esquelética nativa.
- Pruebas de fidelidad de vértices, colores y exportación reproducible. Conducción y controles sin cambios.

## v0.14.4 — Fase 11.20 · Mirador escénico del Carmel
- Nuevo conjunto escénico original con terrazas, pabellón, farolas y jardineras en una zona exterior de la ladera.
- Geometría urbana de 367.341 a 369.114 vértices (+0,48 %).
- Dos pruebas nuevas; 394/394 pruebas automatizadas superadas.
- Sin cambios en conducción, controles, colisiones o campaña. Validación visual pendiente.

## v0.14.6 — Fase 11.22 · Coherencia visual a nivel de calle
- Remaster focalizado de 12 portales en el Eixample y 7 fachadas industriales en el puerto.
- Relieve y detalles de metal y piedra pegados a edificios preexistentes; sin cambios de física ni colisiones.
- Pruebas nuevas de geometría y preservación de la red vial; aceptación visual real pendiente.
## v0.14.7 — Correcciones de campaña auditadas

- `R`/Reiniciar vuelve a activar una misión o un encargo recién creado mientras el juego sigue en marcha; conservar pausa, exploración y carreras.
- Nuevo guardado versionado del capítulo desbloqueado al completar una misión. `Continuar` retoma ese capítulo después de recargar; `Nueva campaña` reinicia solo la historia y sus decisiones.
- Datos de campaña dañados se descartan de forma segura; el guardado bloqueado comunica que el avance solo durará la sesión actual.
- Corregidos la versión visible del HUD y el recuento del staging en README; el ZIP final omite `_site/` generado.
- Tests del ciclo de reinicio, reanudación y guardado. La aceptación jugable, FPS y ambos finales siguen pendientes de una sesión en navegador real.

