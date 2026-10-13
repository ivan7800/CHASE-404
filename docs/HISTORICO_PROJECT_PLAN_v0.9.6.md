> **Actualización v0.9.6 (2026-10-12):** corrección de movimiento peatonal a ejes relativos a cámara y rumbo peatonal estable; la conducción no cambia. QA automatizada ampliada; prueba jugable en equipo real pendiente.

# CHASE 404 — Estado del proyecto

**Estado vigente: v0.9.5 ALPHA · Fase 6.6.** Campaña principal con 15 misiones programadas y dos desenlaces, tres desafíos, ocho secretos, tres contactos, garaje y taller. No equivale a juego final validado.

- Fase 2: assets y motor 3D básico; revisión real reproducible de rendimiento pendiente.
- Fase 3: conducción, peatón, tráfico y policía implementados; QA interactivo integral pendiente.
- Fase 4: 15 misiones codificadas; carecen de cinemáticas, PNJ narrativos completos y certificación jugable en navegador.
- Fase 5.1: entrega original con dinero, mejor tiempo y guardado.
- Fase 5.2: taller mecánico, reparaciones, tres mejoras de dos niveles por modelo.
- Fase 5.3: garaje de hasta seis modelos con estado y selección.
- Fase 5.4: tres actividades elegibles (entrega, contrarreloj y carga delicada), premios y récords por actividad.
- Fase 5.5: ocho pistas urbanas con archivo, modo exploración libre, recompensas y guardado.
- **Fase 5.6:** tres personajes estáticos, tres investigaciones a pie, conversaciones con elecciones, recompensas y diario persistente.
- **Fase 5.7:** auditoría transversal implementada: corrección de teclas de interacción reasignables, seguridad de la reclamación de premios, 222 tests, auditoría estática de UI/ubicaciones; WebGL interactivo pendiente.
- **Fase 6.1:** 3 ambientes de Barcelona (día/tarde/noche), luces cálidas, cielo/niebla coherentes, botón B y guardado local; 226 tests automatizados.
- **Fase 6.2:** detalles de fachadas, calzada y materiales de coches implementados. QA visual real pendiente.
- **Fase 6.3:** cámara dinámica, impactos, efectos de conducción y accesibilidad. QA visual real pendiente.
- **Fase 6.4:** ambientación sonora por seis distritos, motor/derrapes/tráfico, sirenas, volumen persistente y reproducción opt-in. 247 pruebas y 6/6 GLB. Pruebas auditivas reales pendientes.
- **Fase 6.5:** caché de búferes GL, LOD cosmético de coches lejanos en MEDIO/ECO, presupuesto de píxeles por calidad y actualizaciones de Web Audio a 30 Hz. 253 tests; medidas de FPS reales pendientes.
- **Fase 6.6:** regresión audiovisual transversal (258 tests), corrección de carrera asíncrona al activar Web Audio, CI `npm run audit` y checklist manual. Chromium bloqueado, pruebas visuales y FPS reales pendientes.
- **Siguiente:** validación en un navegador real del usuario antes de aprobar el cierre de la Fase 6 y abordar el pulido/release.
- Release gate: **NOT READY**. Publicación en GitHub no autorizada.

## QA 0.6.8

- npm test: 141/141 PASS.
- npm run check: PASS.
- npm run assets:validate: 6/6 PASS.
- Validación interactiva WebGL/Windows/Linux: PENDIENTE.

## Historial de hitos anteriores (archivado)

## Fase 4.10 · v0.6.9
- Misión 10 «La voz de Clara»: contacto a pie y pistas del inspector.
- Pendiente: QA interactivo, PNJ 3D y conversaciones ramificadas.

## Fase 4.11 · v0.7.0 (2026-10-12)
- [x] Misión 11 con acceso, interacción de rescate a pie y extracción al volante.
- [x] Dos patrullas aparecen después de resolver el rescate.
- [x] Progresión 10 → 11, resultado narrativo y HUD.
- [x] Pruebas Node, comprobación sintáctica y seis GLB validados.
- [ ] Inspección real WebGL, jugabilidad completa y FPS en Windows/Linux.
- Estado: ALPHA. Fase 4 en desarrollo, lanzamiento bloqueado hasta QA interactiva.

## Fase 4.12 · v0.7.1
- [x] Misión 12 e interacción de investigación en el Eixample.
- [x] Progresión desde la misión 11 y desenlace narrativo.
- [ ] Validación interactiva WebGL y prueba de campaña completa.

## Fase 4.13 · v0.7.2
- [x] Misión 13 y progresión 12 → 13.
- [x] Revelación del responsable e interacción final con condición de victoria.
- [ ] QA interactivo, validación de rutas y rendimiento real.
- Fase 4 sigue abierta: misiones 14 y 15 pendientes.

## Fase 4.14 · v0.7.3
- [x] Misión 14 con elección de rescate o pruebas y dos objetivos finales diferenciados.
- [x] Persistencia validada de la decisión mediante clave específica versionada.
- [x] Progresión 13 → 14 y textos de desenlace diferenciados.
- [x] Pruebas unitarias, sintaxis JS y seis assets GLB.
- [ ] Probar en navegador real, trayecto completo y FPS en Windows/Linux.
- [ ] Misión 15 conectada a la decisión (Fase 4.15).
- Estado: ALPHA, publicación no autorizada.

## Fase 4.15 · v0.7.4
- [x] Misión 15 con dos rutas y dos epílogos condicionados por decisión 14.
- [x] Progresión 14 → 15, persecución y encuentro final contextual.
- [x] Corrección de finalización prematura de evasión; tests 165/165, sintaxis y GLB.
- [ ] QA en navegador, campaña íntegra, actuaciones de NPC y FPS.
- Estado: ALPHA; contenido de campaña codificado, gate de cierre de Fase 4 pendiente de pruebas jugables.

## Fase 5.1 — 0.8.0
Actividad secundaria del taller implementada y separada del avance de campaña; pesos y pruebas pendientes según QA_FASE_5_1.md.


## Fase 5.2 — v0.8.1
- [x] Edificio de taller en El Carmel, acceso contextual con T y HUD/minimapa.
- [x] Reparación mecánica y compras de mejoras por vehículo con cobro en pesetas.
- [x] Guardado retrocompatible y validado `chase404.side.v1`; evita cargos sin persistencia.
- [x] Unit tests 175/175, sintaxis y seis archivos GLB verificados.
- [ ] Chromium jugable/WebGL: bloqueo `ERR_BLOCKED_BY_ADMINISTRATOR` al conectar con 127.0.0.1.
- [ ] FPS Windows/Linux Mint, recorrido íntegro de campaña y economía balanceada.
- **QA gate:** PENDING. Estado ALPHA. No publicado en GitHub.
- **Siguiente:** Fase 5.3 — garajes y colección de vehículos.


## Fase 5.3 — v0.8.2
- [x] Garaje Verenne en El Carmel con fachada 3D, icono en el minimapa y botón contextual `Y`.
- [x] Hasta seis modelos únicos guardados con condición de daños y recuperación sin coste.
- [x] Intercambio de coches persistido antes de cambiar el vehículo activo; preservación de daños y de mejoras por tipo.
- [x] Almacenamiento local aislado de créditos, récords y campaña; 182/182 pruebas Node, sintaxis y seis GLB correctos.
- [ ] QA en navegador real: Chromium rechaza URL del servidor local por política de administración.
- [ ] FPS y controles en Windows / Linux Mint, garaje interior, representación de plazas ocupadas.
- **Estado:** ALPHA, QA gate PENDING. No publicar en GitHub sin autorización.
- **Siguiente:** Fase 5.4 — nuevos encargos y desafíos de conducción.

## Fase 5.5 — v0.8.4 · Secretos de Barcelona
- [x] Ocho pistas ficticias repartidas por seis zonas de Barcelona, con relato individual.
- [x] Placas procedimentales de latón junto a las calles, puntos y estado de exploración en minimapa.
- [x] Archivo interactivo con registro de hallazgos, pistas por encontrar y recompensas.
- [x] Exploración libre sin reloj de misión, separada de campaña y desafíos.
- [x] Interacción a pie mediante X / botón y archivo mediante I / botón; entrada y salida del coche táctil.
- [x] Bonificación 45 ₧ por pista + 180 ₧ por colección completa, guardado en `chase404.side.v1`, sin duplicados.
- [x] Pruebas automáticas de motor, economía, compatibilidad, rutas y conexiones estáticas de UI (204/204).
- [ ] QA real en WebGL, pruebas móviles, recorrido de las ocho placas, FPS Windows/Linux Mint.
- **Estado:** ALPHA; puerta de calidad jugable pendiente. **Sin publicación en GitHub.**
- **Siguiente:** Fase 5.6 — personajes secundarios y conversaciones/interacciones con consecuencias verificables.


## Fase 5.6 — v0.8.5 · Voces de Barcelona
- [x] Tres contactos diferenciados por personaje, diálogo, ubicación, objetivo y dos desenlaces propios.
- [x] Manel Roca (Carmel), Clara Vidal (Gràcia) y Núria Soler (Eixample) con figuras low-poly estáticas.
- [x] Tres microencargos con aceptación, prueba física en otro distrito, regreso y decisión original/copia.
- [x] Diario narrativo con localización de pistas pendientes, historial de elecciones y reacciones.
- [x] HUD, minimapa, tecla N / botón contextual y J / VOCES para el diario.
- [x] Persistencia compatible y atómica en `chase404.side.v1`, sin alterar progreso de campaña ni economía anterior.
- [x] Pruebas lógicas y de conexiones UI: 214/214, sintaxis JavaScript y 6/6 GLB.
- [ ] QA visual/jugable WebGL, móviles y Windows/Linux Mint; figures sin animación/doblaje.
- **Estado:** ALPHA; puerta de calidad jugable pendiente. Sin publicación en GitHub.
- **Siguiente:** Fase 5.7 — auditoría transversal de interacciones, regresión de campaña, guardados y controles.


## Fase 5.7 — v0.8.6 · Auditoría integral
- [x] Suite de regresión cruzada de las 15 misiones, dos rutas, dos finales, tres desafíos, tres contactos, ocho pistas, taller, garaje y persistencia.
- [x] Controles E/I/J/X protegidos contra reasignación en perfiles nuevos/anteriores.
- [x] Marcado transaccional de recompensa secundaria tras éxito del guardado.
- [x] Script `npm run audit` y 222 tests Node; auditoría geométrica y estática de interfaz y assets.
- [ ] Prueba de todos los botones y flujos en navegador WebGL real; Chromium bloqueado por política administrativa en entorno de automatización.
- [ ] Pruebas de FPS, móviles, periféricos y Windows/Linux; checklist `MANUAL_QA_FASE_5_7.md`.
- **Gate:** ALPHA / NO READY. Sin publicación en GitHub.

## Fase 6 — Hoja de ruta del remaster audiovisual
- [x] **6.1** Iluminación por ambientes, niebla atmosférica, emisivos puntuales y accesibilidad.
- [x] **6.2** Fachadas, calzada, automóviles y tratamiento de materiales: detalles procedimentales, brillo especular y presupuesto medido (230 tests); validación visual pendiente.
- [x] **6.3** Cámara de persecución y feedback visual de velocidad/impactos (v0.9.2: seguimiento con amortiguación, FOV y derrapes, impacto y accesibilidad; 239 tests, QA visual pendiente).
- [x] **6.4** Sonido del tráfico, capas ambientales por distrito y avisos de persecución.
- [x] **6.5** Presupuesto de píxeles, caché de buffers, LOD cosmético, cadencia de audio (FPS reales aún pendientes).
- [x] **6.6** Auditoría automática transversal y documentación de QA; pendiente gate interactivo en equipos reales.

## Fase 6.2 — v0.9.1 · Fachadas, carretera y coches
- [x] Reasfaltado, juntas, pasos de peatones y paleta envejecida sin alterar la red de navegación.
- [x] Relieves y materiales de 29 fachadas existentes en Eixample, Gràcia y Guinardó.
- [x] Carrocerías GLB/procedurales con especular controlado por uniform WebGL 1; material diferenciado en neumáticos.
- [x] +12,75 % de vértices urbanos con una sola llamada de dibujo de la ciudad; 230/230 pruebas Node y 6/6 GLB válidos.
- [ ] Compilar shaders y probar la interacción en una GPU/navegador reales (Chromium del contenedor no produjo screenshot).
- [ ] Validación visual de franjas/superficies y FPS Windows, Linux Mint y dispositivos móviles.
- **Gate:** ALPHA, calidad visual y rendimiento NO certificados. Sin publicación GitHub.
- **Siguiente:** Fase 6.3, cámara de persecución, velocidad e impactos.

## Fase 6.3 — v0.9.2 · Cámara e impactos
- [x] Módulo `camera-rig.js` aislado y determinista, con cámaras CHASE / WIDE / BONNET, interpolación por `dt` y adaptación a desniveles.
- [x] Respuesta a velocidad y deslizamiento lateral sin modificar las físicas ni los controles.
- [x] Cámara y destello reaccionan a impactos reales: contactos con tráfico, barreras y choques arcade, con amplitud acotada y decaimiento.
- [x] FX OFF y Reducir movimiento suprimen sacudidas, inclinación y zoom dinámico; modo a pie no hereda movimiento brusco.
- [x] Regresión Node 239/239, sintaxis, 6 GLB y auditoría estática superadas.
- [ ] QA WebGL visual en Windows/Linux Mint/móvil (Chromium no entregó captura válida), revisión de recortes de cámara, confort, FPS y rendimiento.
- **Estado:** ALPHA · NO READY; no publicado. **Siguiente:** 6.4 — sonido urbano, tráfico y persecución.

## Pulido 0.9.7 — Cámara a pie
- [x] Recentrado a pie con C (sin cambiar la cámara de conducción).
- [x] Seguimiento peatonal más rápido y controles relativos a la orientación existente.
- [x] Tres pruebas nuevas y auditoría automática 266/266.
- [ ] Confirmación de comodidad y ausencia de problemas visuales en navegador real.

## Fase 7.6 · revisión narrativa (v0.10.4)
Auditoría automática completada; faltan sesiones jugables reales de campaña y ambos finales. Próxima Fase 8: profundidad jugable y presentación, tras validar estas transiciones en navegador.

## Fase 8.1 — Implementada, validación manual pendiente
- Nuevo objetivo de conducción de precisión en la misión 03; se conserva toda la campaña.
- Próxima mejora: enriquecer interacciones y persecuciones sin sacrificar controles.

## Fase 8.6 — v0.11.0
- [x] Auditoría automática global `npm run audit`: 306/306, 6 GLB y estructura estática correcta.
- [x] Arreglado título/informe contradictorio al producirse detención policial.
- [ ] Validación integral real en navegador: campaña y ambos finales, controles, audio, gráficos y FPS.
- Estado ALPHA / NO READY. Próxima etapa: Fase 9, QA interactivo y estabilidad. Sin autorización para publicar en GitHub.


## Fase 11.21 — Homogeneización de distritos (v0.14.5)
Detalles en Eixample, puerto y Montjuïc. QA automático 396/396; validación visual pendiente.
