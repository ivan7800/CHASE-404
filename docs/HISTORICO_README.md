# Archivo histórico del README hasta v0.11.6

# CHASE 404 — Barcelona 1984

**Versión de este paquete: 0.11.6 ALPHA (Fase 9.6).** Auditoría de candidato de lanzamiento; consulta `QA_FASE_9_6.md`. La prueba jugable completa sigue pendiente. 

**Versión 0.10.7 ALPHA · Fase 8.3, avisos de daños y amenaza.** Hay 15 misiones programadas con dos finales, 3 desafíos urbanos, garaje para 6 modelos, taller, 8 secretos y 3 historias secundarias. **No es una versión final validada**: las pruebas automáticas pasan pero falta jugar y verificar el WebGL, los controles y FPS en Windows, Linux y móvil.

**Fase 8.2 — persecución táctica:** en la misión 8, avenida oeste exige despistar patrullas a 90 m durante 4 segundos; calle de servicio permite 65 m pero requiere 7 segundos. Es necesario permanecer en el coche. Las 293 pruebas de código pasan; la jugabilidad real sigue pendiente.

**Fase 6.6 — auditoría integral:** 258 pruebas automatizadas, seis GLB locales validados y matriz de 54 combinaciones de renderizador simuladas. Corregidas las pulsaciones simultáneas de AUDIO y el caso de audio que terminaba de activarse con un panel abierto. `npm run audit` es también el control de calidad configurado en GitHub Actions (solo QA, sin publicación). Los resultados de navegador WebGL, sonido y FPS reales siguen **PENDIENTES**: consultar `QA_FASE_6_6.md` y `MANUAL_QA_FASE_6_6.md`.

**Fase 6.5 — optimización (nuevo):** los modos gráficos **ALTO / MEDIO / ECO / AUTO** ahora ajustan tanto la resolución como los detalles distantes de los coches de tráfico; las ruedas y sombras se preservan a corta distancia. En pantallas de alta densidad, el buffer WebGL tiene un presupuesto máximo de **2,5 Mpx en ALTO**, **1,2 Mpx en MEDIO** y **0,75 Mpx en ECO**. AUTO baja o sube según los FPS, como antes. Se ahorran cambios de búfer entre ruedas consecutivas, se omiten semáforos muy lejanos de la vista (sin afectar la física) y el audio envía parámetros como máximo 30 veces por segundo mientras está activo. **La resolución interna ECO es inferior por diseño; no se reduce la geometría urbana.** Consultar `QA_FASE_6_5.md` y `MANUAL_QA_FASE_6_5.md` antes de afirmar rendimiento real.

**Fase 6.4 — paisaje sonoro (nuevo):** pulsar **M / AUDIO OFF** para activar el sonido después de un gesto del jugador. **O / AJUSTES → VOLUMEN AUDIO** permite elegir de 0 a 100 %; se guarda en `chase404.settings.v7`, compatible con datos anteriores. Al pausar, abrir un panel o cambiar de pestaña, se silencia. No inicia audio automáticamente, ni solicita permisos, ni descarga pistas.

- Sonidos sintetizados en Web Audio: motor según velocidad, ruido de neumáticos y derrapes, impactos, tráfico cercano, tonos de ambiente por **El Carmel, Guinardó, Gràcia, Eixample, Puerto y Montjuïc**; mezcla distinta de día y noche.
- Las persecuciones policiales incorporan una **sirena sintética** que disminuye con la distancia, y señales breves de inicio o evasión. En circuitos arcade se conserva la prioridad del motor; la mezcla urbana está desactivada.
- La etiqueta superior indica el barrio aproximado. Los sonidos son sintetizados y estilizados: **no son grabaciones fieles de la Barcelona de 1984 ni contienen voces comprensibles**. El mundo permanece ficticio/condensado.
- **QA**: `npm run audit` y `QA_FASE_6_4.md`. Falta escuchar y verificar el sonido en navegadores reales, distintos altavoces y móvil; leer `MANUAL_QA_FASE_6_4.md`.

**Fase 6.3:** cámaras CHASE/WIDE/BONNET refinadas con seguimiento amortiguado, apertura del encuadre al ganar velocidad, pequeña respuesta lateral al derrape y pulsos breves por impactos reales. Los efectos están limitados y se desactivan con FX OFF o Reducir movimiento. Las físicas y los guardados no cambian. Ver `QA_FASE_6_3.md` y `MANUAL_QA_FASE_6_3.md`.

## Novedades visuales de la Fase 6.2

- **Carreteras:** reasfaltados, juntas de acera y cinco pasos de peatones procedimentales. No cambia la red viaria ni su física.
- **Arquitectura:** relieve de fachada en 29 edificios ya presentes en Eixample, Gràcia y Guinardó: dinteles, marcos, cornisas, portales y persianas.
- **Vehículos:** tratamiento de brillo especular sobre las carrocerías GLB y procedimentales, diferenciación de ruedas y nueva banda lateral de neumáticos, sin descargas externas.
- **Geometría:** escena urbana pasa de 273.729 a 308.619 vértices (+12,75 %); se mantiene una única malla de ciudad para evitar más llamadas de dibujo.
- **Compatibilidad:** no hay cambios de controles, misiones, coches disponibles, economía ni claves de guardado.

La escena todavía requiere inspección visual y pruebas de FPS en equipos reales. Los uniformes del shader se han validado mediante simulación WebGL, no con compilación comprobada en GPU. Ver `QA_FASE_6_2.md`.

## Ejecutar el juego

Descomprime el ZIP y abre `INICIAR_WINDOWS.bat` en Windows 10/11 o ejecuta `bash INICIAR_LINUX.sh` en Linux Mint. Necesitas **Python 3** para el servidor local (y un navegador moderno con WebGL). No abras `index.html` con `file://`. En el menú elige BCN para Barcelona, EXPLORACIÓN LIBRE para pistas y contactos, o un DESAFÍO para los encargos; los circuitos arcade siguen disponibles.

En Barcelona, **E** entra y sale del coche; **T** abre el taller junto a su edificio; **Y** abre el garaje; **X** investiga placas; **I** abre el archivo; **N** interactúa con personas y pruebas; **J** abre el diario de contactos en Exploración libre. Los atajos de interacción no pueden reasignarse como controles de conducción.

## Auditoría reproducible

Desde la raíz del proyecto con Node.js 22+: `npm run audit` ejecuta comprobación de sintaxis, test suite, seis GLB y verificación de conexiones estáticas y lugares del mapa. Lee `QA_FASE_5_7.md` y `MANUAL_QA_FASE_5_7.md`. **La comprobación de listeners estáticos no significa que hayamos pulsado los botones en un navegador real.** No se ha subido a GitHub.

---

## Histórico técnico (conservado desde los primeros prototipos)

> Nota histórica v0.5.0: ALPHA de Fase 3. Cierre artístico de Fase 2 pendiente de pruebas visuales. Consultar `QA_FASE_2_Y_FASE_3.md`.

# CHASE 404 — Base técnica independiente

**Versión 0.3.0 · Fase 3: El Carmel, Barcelona, 1984**

CHASE 404 es un juego original de conducción arcade y persecuciones urbanas, con vehículos ficticios inspirados en coches americanos de los años 70, 80 y 90.

## Estado de esta entrega

Se puede recorrer libremente una interpretación jugable de El Carmel en 1984. El mapa incluye una ladera elevada, calles sinuosas conectadas, aceras, muros de contención, viviendas de distinta escala, escaleras, farolas y un mirador inspirado en el Turó de la Rovira. Las tres pistas heredadas siguen disponibles para regresión. Es un prototipo de escenario: todavía no incluye tráfico, policía ni misiones.

La época se usa como dirección artística y narrativa; el mapa es ficticio y no reconstruye calle por calle el barrio histórico. El garaje y los modelos de coche actuales proceden del prototipo de carreras y todavía no son la selección final de vehículos de época.

Las claves de guardado local están separadas de DAYTONA-404. El proyecto original no se modifica.

## Inicio

Descomprime el ZIP y ejecuta `INICIAR_WINDOWS.bat` en Windows 10/11 o `bash INICIAR_LINUX.sh` en Linux Mint. Hace falta Python 3. No abras `index.html` con `file://`.

Para revisar la base: Node.js 22+ y los comandos `npm run check` y `npm test`. Node no es necesario para jugar.

## Dirección del juego

- **Conducción:** arcade, accesible y configurable.
- **Coches:** vehículos originales inspirados en muscle cars, coupés y berlinas americanas de los 70, 80 y 90.
- **Barcelona:** distritos compactos con siluetas, iluminación y conducción propias; reinterpretaciones para jugar, no copias calle por calle.
- **Misiones:** persecuciones, seguimientos, escapes y contrarrelojes.
- **Policía y tráfico:** búsqueda, contacto visual, bloqueos y circulación civil.
- **Presentación:** briefings, minimapa, HUD, sonido y progresión local.

## Base técnica

El prototipo usa WebGL nativo, modelos GLB locales, física arcade, cámara, controles, audio procedural, efectos visuales, ajustes y guardado local. Esta fase añade geometría urbana procedural y adapta la cámara y la inclinación visual del vehículo a la ladera. El movimiento sigue siendo arcade sobre un plano: aún no simula físicamente la pendiente.

## Fases

1. Base independiente y aislamiento del proyecto original.
2. Primer sistema de conducción urbana y cámara.
3. **El Carmel en 1984:** escenario de ladera con mirador y red vial propia (esta entrega).
4. Primera misión completa, con objetivos, éxito, fracaso y reinicio.
5. Tráfico y comportamiento básico en cruces.
6. Búsqueda policial, persecuciones y bloqueos.
7. Campaña, nuevos barrios y garaje original.
8. Pulido visual, sonido, accesibilidad, rendimiento y auditoría.

## QA y límites

La suite automatizada valida sintaxis, lógica de conducción y ciudad, geometría finita, guardado, controles y sistemas heredados. No se ha podido validar visualmente el render WebGL ni el rendimiento GPU en un navegador en este entorno. La pendiente se refleja visualmente, pero no cambia la aceleración o el frenado como lo haría una física completa.

Consulta `docs/CONCEPTO.md`, `docs/FASE_1_BASE_TECNICA.md`, `docs/FASE_2_BARCELONA.md`, `docs/FASE_3_CARMEL_1984.md` y `QA_FASE_2.md` para el detalle.


## Campaña · Fase 1 (v0.4.0)
Selecciona **BCN · EL CARMEL — 1984** y pulsa **INICIAR MOTOR**. Como **Gael Verenne** deberás completar **La cinta del Turó**, tres destinos señalados en el minimapa, antes de 155 segundos. Teclas W/S/A/D o flechas, R para reiniciar y P/Esc para pausar. Los otros circuitos siguen disponibles.


## Fase 3.2 — Prototipo de tráfico y policía

En **BCN · El Carmel — 1984**, circulan coches civiles. Una patrulla entra en persecución si Gael permanece más de tres segundos por encima de 85 km/h; si se aproxima lo suficiente y Gael está casi detenido puede arrestarlo. Alejarse y reducir la velocidad durante varios segundos permite escapar. La IA sigue siendo experimental (sin planificación viaria policial). Ver `QA_FASE_3_2.md`.

## Fase 3.5 — Gael a pie (v0.5.4)

En El Carmel, detén el coche completamente y pulsa **E** para salir. A pie usa **WASD** o flechas **en relación con la cámara**: **W/↑** avanza en pantalla, **S/↓** retrocede, **A/←** desplaza a Gael a la izquierda y **D/→** a la derecha. **Espacio** corre. La cámara a pie conserva el rumbo que tenía el coche al bajarte, mientras Gael gira hacia la dirección de movimiento; esto evita inversiones al pulsar A/D. Acércate a un vehículo detenido y pulsa **E** para entrar. El coche original sigue aparcado; si entras en un vehículo del tráfico éste sale de la simulación y pasa a ser el coche controlado por Gael, usando temporalmente las físicas del vehículo seleccionado. Los vehículos en marcha no se pueden abordar. **R** reinicia la misión y devuelve a Gael al vehículo inicial. No disponible en los circuitos arcade.

Limitaciones actuales: personaje low-poly provisional, no hay animaciones esqueléticas, puerta animada, peatones autónomos ni interiores. Policía y misiones mantienen su lógica prototipo.

## Fase 3.6 — Vehículos con identidad (v0.5.5)
Cada vehículo civil tiene un identificador de modelo estable. Al abordar un coche estacionado con **E**, Gael utiliza la ficha de aceleración, agarre y frenado de ese modelo; el renderizador carga su GLB local y el HUD muestra su nombre. El vehículo recién adquirido empieza sin daños previos. Se añade un balanceo sencillo al caminar. No hay todavía animación esquelética ni puertas animadas.


## v0.5.6 ALPHA — Fase 3.7
Se ha incorporado lógica preliminar de semáforos, vehículos aparcados persistentes durante una misión y seguimiento policial de Gael a pie. **No es el cierre definitivo de la Fase 3**: quedan señalización visual, pruebas de navegador y pulido de sistemas. Consulta `QA_FASE_3_7.md`.


### Actualización v0.5.7
Semáforos visibles y colisión radial inicial a pie. Ver `QA_FASE_3_8.md` para pruebas y limitaciones; la Fase 3 todavía no está cerrada.

### Fase 3.9 — A pie
Gael puede caminar con WASD/flechas relativos a la orientación de la cámara, correr manteniendo la acción de freno de mano (normalmente Espacio), y entrar o salir con E cuando el coche está detenido. Las colisiones son aproximadas y la animación continúa siendo provisional. Informe: `QA_FASE_3_9.md`.

## Fase 3.10 — Auditoría de interacciones (v0.5.9)
Al pulsar E para salir del coche, Gael busca una salida sin vehículos ocupando el espacio. Si los dos lados están bloqueados, permanece dentro. Consulta `QA_FASE_3_10.md` para resultados y límites de validación.

## Fase 4.1 — Primer corredor Guinardó (v0.6.0 ALPHA)

El mundo se amplía mediante cuatro nuevos trazados hacia un sector **ficticio inspirado en Guinardó**, conectados a la red del Carmel. Se incorpora una pequeña biblioteca de fachadas, balcones y taller, se extiende la malla del terreno y se ajusta el minimapa. No representa todavía todo el barrio, ni incluye misión 02. El resto de sistemas sigue disponible.

Para verificar: `npm test`, `npm run check` y `npm run assets:validate`. Pruebas reales de navegador, FPS y experiencia con mando permanecen pendientes. Consulta `QA_FASE_4_1.md`.

## Fase 4.2 — El contacto de Gràcia (v0.6.1)
Completa «La cinta del Turó» y utiliza el botón **MISIÓN 02 · GRÀCIA** en la pantalla de resultado para comenzar el segundo encargo. La ampliación es una interpretación ficticia y permanece en ALPHA.


## Fase 4.15 — Final de campaña (v0.7.4 ALPHA)
La misión 15 «Barcelona no perdona» se desbloquea tras la 14. Usa la decisión guardada del capítulo 14: rescataste a tu hermano o recuperaste las pruebas. La primera etapa y el epílogo cambian según esa decisión. Después hay una huida con patrullas hasta Gràcia y un encuentro final a pie. El desenlace se presenta en la pantalla de misión superada. Los personajes de la historia y las cinemáticas siguen pendientes de producción.


## Fase 5.2 · Taller del Carmel (v0.8.1)

En el modo **BCN · El Carmel**, conduce hasta el taller (marcado con un cuadrado verde agua en el minimapa, coordenadas aproximadas 106, 132). Detén el coche completamente —o acércate caminando— y pulsa **T**, o el botón **TALLER** en la barra superior. No se permite entrar si la policía está persiguiendo a Gael. El tiempo de juego se pausa mientras eliges un servicio. **Esc** o **VOLVER A BARCELONA** cierra el taller.

Puedes pagar reparaciones que recuperan el 100 % del estado mecánico; el precio depende del daño (mínimo 20 ₧, 1,7 ₧ por punto). También puedes comprar hasta **dos niveles por modelo** de potencia, dirección o frenos: **125 ₧** y **250 ₧**. Cada nivel aumenta respectivamente la potencia un 6,5 %, la dirección un 5,5 % y los frenos un 8 % sobre los valores originales. Las mejoras se aplican en el modo urbano, no en los circuitos arcade.

El dinero se consigue con **EL RECADO DEL TALLER** (125 ₧ por entrega). El saldo y las mejoras se guardan en `localStorage` bajo `chase404.side.v1`; la estructura es retrocompatible con el guardado v0.8.0 y conserva los récords del encargo. Si el guardado falla, no se descuenta ni se aplica la compra. Los daños del vehículo son de sesión y no se conservan entre reinicios.

**Limitaciones:** el taller es un edificio geométrico con señalización básica, no un interior 3D explorable. No existe aún compra de coches, coleccionables ni animaciones de mecánicos. El entorno Chromium de auditoría bloquea la apertura de `127.0.0.1`; el flujo de usuario en WebGL está pendiente de prueba interactiva. No se ha publicado en GitHub.


## Fase 5.3 · Garaje Verenne (v0.8.2)

En **BCN · El Carmel**, busca el **cuadrado ámbar del minimapa** (punto de entrada aproximado `x=-22, z=168`, junto a un edificio con persiana y marquesina). Llega con un coche, detente y pulsa **Y**, o el botón **GARAJE** de la barra superior. No se permite el acceso si Gael camina, el coche circula o la policía lo persigue. El tiempo de misión se detiene durante el menú. **Esc** cierra el garaje.

- **Guardar coche:** registra el modelo activo, su condición mecánica y actualiza esa misma plaza si ya estaba guardado. Puedes tener hasta **seis modelos diferentes**, uno por tipo; no se duplican entradas.
- **Recuperar coche:** cambia al coche guardado elegido, sin pagar pesetas. Al cambiar, se guarda primero el estado de daños del modelo que estabas conduciendo, para no convertir el cambio en una reparación gratuita. Si falla el guardado, no se ejecuta el cambio.
- **Mejoras:** las mejoras compradas en el taller siguen vinculadas a cada modelo mediante `chase404.side.v1`. No se convierten en mejoras globales ni afectan a los circuitos arcade.
- **Persistencia:** la colección se guarda de forma independiente en `localStorage` con clave versionada `chase404.collection.v1`. No reemplaza el historial de misiones, récords ni saldo del taller. Se valida y sanea al cargar.

**Limitaciones de esta fase:** garaje exterior contextual, no interior explorable ni modelos de coche aparcados físicamente. El juego sigue permitiendo elegir un coche para empezar una sesión: el garaje no es aún un sistema de compra o desbloqueo de vehículos. Las operaciones del garaje se han probado mediante tests de lógica y análisis estático, pero falta jugarlas en Chromium, Windows o Linux con WebGL real. La recopilación de 6 vehículos no equivale a tener 6 vehículos renderizados simultáneamente en el local.


## Fase 5.4 — Actividades de Barcelona (v0.8.3 ALPHA)

En la pantalla inicial, elige **BCN · El Carmel — 1984**. Bajo la selección del coche aparece **DESAFÍOS DE BARCELONA**: elige la actividad, pulsa **ACTIVAR DESAFÍO** y después **INICIAR MOTOR**. Para volver a las 15 misiones principales, pulsa **VOLVER A CAMPAÑA**. Al completar o perder un encargo aparece una pantalla de resultados que permite repetirlo o elegir otra actividad.

| Actividad | Controles | Tiempo límite | Recompensa | Condición especial |
| --- | ---: | ---: | ---: | --- |
| El recado del taller | 3 | 210 s | 125 ₧ | Entregar cada encargo en coche |
| La ronda de los miradores | 4 | 310 s | 180 ₧ | Contrarreloj Carmel → Guinardó → Gràcia → Eixample |
| La cinta de cristal | 3 | 410 s | 235 ₧ | Máximo un impacto mecánico durante el encargo; el segundo significa derrota |

Solo se avanza sobre el control **actual**, en el orden indicado; hay que pasar en coche a menos de 17 metros. El minimapa señala el siguiente control. Las distancias son aproximadas y los recorridos son ficticios, inspirados en Barcelona de 1984. Al completar se suman las pesetas al saldo del taller. Cada desafío guarda su mejor tiempo y su número de completados; el total global también se conserva. El archivo local sigue siendo `chase404.side.v1`, compatible con el historial y las mejoras guardadas en v0.8.2.

Los desafíos se reinician al volver a elegir o reiniciar; no hay guardado a mitad de ruta. Si el almacenamiento local está bloqueado, el resultado de la carrera aparece, pero la recompensa **no** se considera persistida. El transporte delicado utiliza eventos de daño, no colisiones menores sin daño.

**QA:** ejecutar `npm test`, `npm run check` y `npm run assets:validate`. La auditoría interactiva real permanece pendiente en este entorno por restricciones de navegador/servidor HTTP. Consulta `QA_FASE_5_4.md`. No se ha publicado en GitHub.

## Fase 5.5 — Secretos de Barcelona · v0.8.4 ALPHA

En el menú **BCN · El Carmel — 1984**, pulsa **EXPLORACIÓN LIBRE · SIN RELOJ** y después **INICIAR MOTOR**. Esta modalidad no inicia ninguna misión ni desafío: el cronómetro indica tiempo transcurrido y permite recorrer la ciudad sin límite. Conserva tráfico, policía, daños, taller y garaje.

Existen **ocho hallazgos** distribuidos por El Carmel, Turó de la Rovira, Guinardó, Gràcia, Eixample (dos), puerto y Montjuïc. Las placas de latón están junto a las calles y aparecen como puntos dorados en el minimapa; al documentarlas cambian a verde grisáceo.

1. Conduce cerca de una placa y **detén el coche**.
2. Pulsa **E** para bajar y aproxímate andando a la placa (a 15 unidades o menos). En pantallas táctiles utiliza **↕ E · COCHE**.
3. Pulsa **X** o el botón contextual **EXAMINAR PISTA**. No se puede investigar durante una persecución policial.
4. Se abre el **ARCHIVO DE LA CIUDAD**, con la historia asociada. También puedes consultar el registro pulsando **I** o **ARCHIVO** mientras juegas; ciérralo con **Esc** o **VOLVER A BARCELONA**.

Cada primer descubrimiento otorga **45 ₧**. Al completar las ocho pistas se añade una **bonificación única de 180 ₧**: máximo **540 ₧** por toda la colección. El registro, saldo y mejoras se guardan **en una sola clave existente** `chase404.side.v1`: no se crea otra economía ni se pierde el progreso de las fases 5.1–5.4. Los hallazgos no se pueden cobrar dos veces. Si el navegador impide guardar, no se cobra ni registra.

**Nota de autenticidad:** el mapa de la ciudad, los objetos y los ocho relatos son ficticios y forman parte del universo narrativo de Gael Verenne; no deben interpretarse como reconstrucciones históricas documentales de Barcelona en 1984.

**Pendiente:** prueba de exploración completa en navegador WebGL, visibilidad de las ocho placas, FPS y test real de controles táctiles. Informe: `QA_FASE_5_5.md`. No subir a GitHub hasta autorización.


## Fase 5.6 — Voces de Barcelona · v0.8.5 ALPHA

**Cómo jugar:** en el menú selecciona **BCN → EXPLORACIÓN LIBRE · SIN RELOJ → INICIAR MOTOR**. Los tres personajes se ven como figuras low-poly fijas con señalización verde en el minimapa. Aparca, baja con **E**, acércate andando y pulsa **N** (o el botón **INTERACTUAR** del HUD) para hablar. No se permite interactuar durante una persecución. Abre **VOCES** en la barra superior o pulsa **J** para ver el diario de contactos (salvo que J esté reasignada a una función de conducción). Cierra el diálogo con **Esc** o el botón **VOLVER A BARCELONA**.

| Personaje | Lugar de encuentro | Pista a recuperar | Recompensa |
| --- | --- | --- | --- |
| **Manel Roca**, mecánico | El Carmel, junto al taller (106, 132) | Cobertizo del Guinardó (-150, 300) | 100 ₧ original / 80 ₧ copia |
| **Clara Vidal**, informante | Gràcia (-410, 165) | Cabina del Eixample (-625, -125) | 115 ₧ original / 95 ₧ copia |
| **Núria Soler**, periodista | Eixample (-700, -5) | Pasillo del puerto (-785, -450) | 130 ₧ original / 110 ₧ copia |

**Flujo de cada encargo:** (1) conversación inicial y aceptar, (2) buscar una prueba física señalada en ámbar, acercarse a pie y pulsar **N** para recuperarla, (3) regresar al personaje y elegir entre **ENTREGAR ORIGINAL** o **GUARDAR COPIA**. Cada alternativa proporciona una reacción textual distinta, una recompensa diferente y queda registrada en el diario tras cerrar y reabrir el juego. La recompensa solo se otorga una vez. No altera las decisiones ni los desenlaces de las 15 misiones principales.

**Guardado:** los contactos comparten transacción atómica con el saldo, récords, taller y secretos en `chase404.side.v1`; así no se registra la decisión ni se paga si el navegador bloquea el guardado. Los datos de ediciones previas son compatibles y las entradas corruptas se filtran. No se añade backend ni cuentas. Las coordenadas son del **mapa ficticio condensado** del juego, no direcciones reales.

**Límites:** las figuras low-poly están estáticas y no tienen animación ni doblaje. Son diálogos y decisiones narrativos con tres búsquedas a pie, no misiones cinemáticas. No están verificados visualmente en una sesión WebGL/Windows/Linux. Los atajos táctiles existen mediante los botones del HUD y la barra superior; la ergonomía móvil queda pendiente de pruebas manuales. La fase 5.7 cubrirá una auditoría de regresión e integración completa antes de pasar al pulido del juego.

## Fase 6.1 — Iluminación cinematográfica · v0.9.0 ALPHA

En el menú elige **BCN · EL CARMEL — 1984**. Ya dentro, pulsa el botón **☼ ATARDECER** de la barra superior o la tecla **B** para alternar:

- **DÍA:** cielo claro, luz solar elevada y mayor distancia de niebla.
- **ATARDECER** (predeterminado): luz naranja rasante, sombras volumétricas estilizadas por las normales y calima cálida.
- **NOCHE:** ambiente azul oscuro, farolas y ciertas ventanas cálidas, niebla más próxima y exposición reducida.

El sistema afecta a la iluminación de mallas WebGL y al color de borrado del cielo; no es únicamente un filtro CSS. El filtro ambiental adicional no intercepta clics, y desaparece si activas **contraste alto**. El estado se guarda aparte en `chase404.lighting.v1`. Si el navegador bloquea el almacenamiento, el cambio sigue funcionando en la sesión y se advierte al usuario. Las misiones **no** cambian de hora automáticamente: cada ambiente es una opción visual, no modifica temporizadores ni IA. Fuera del modo Barcelona no aparece el selector; los tres circuitos mantienen sus colores originales.

**Verificación:** `npm run audit` (sintaxis, tests, GLB, estructura). **Pendiente:** inspeccionar día/tarde/noche en Windows y Linux Mint, WebGL/móviles, farolas y legibilidad nocturna, caídas de FPS. La navegación de Chromium está bloqueada en este entorno (`ERR_BLOCKED_BY_ADMINISTRATOR`); los tests mock del shader no constituyen prueba visual real. Consulta `QA_FASE_6_1.md`. No publicar en GitHub sin autorización.

### v0.9.9 — Gael a pie
Silueta y animación procedimental de brazos y piernas mejoradas; WASD, Espacio y C conservados. Consulta `QA_FASE_6_7.md`.


### Novedad v0.10.3 · Fase 7.5
En las misiones 14 y 15 aparecen figuras 3D contextuales del hermano de Gael y Víctor Salvat. Son representaciones estilizadas con gestos ambientales, no cinemáticas actuadas ni personajes con IA. Revisa `QA_FASE_7_5.md` para las verificaciones pendientes.


### Novedad v0.10.5 — Fase 8.1
En la misión 03, el control del Eixample requiere mantener de 15 a 45 km/h durante tres segundos dentro de su zona. Más detalles y pruebas en `QA_FASE_8_1.md`.

### Fase 8.3 — Riesgos visibles

En Barcelona el HUD ahora muestra proximidad de patrullas y advertencias del estado mecánico, sin alterar las reglas de juego. La legibilidad móvil y el resultado visual siguen pendientes de prueba manual.


### Fase 8.4 — Indicaciones de objetivos
Al iniciar un objetivo de Barcelona aparece una tarjeta con su nombre y una ayuda según la mecánica (conducción, vigilancia, investigación, rescate o evasión). Puedes cerrarla con ×; el siguiente objetivo vuelve a anunciarse. No cambia la conducción.


### Auditoría Fase 9.3 (v0.11.3)
Se ha reforzado la continuidad de la elección del capítulo 14 al 15 aun cuando falle el guardado local. Consulta `QA_FASE_9_3.md`. El respaldo temporal no persiste tras cerrar o recargar el navegador.


### Fase 9.4 — Controles móviles
En Barcelona, los botones táctiles HABLAR, PISTA y DIARIO permiten interactuar con los personajes y consultar las pistas sin teclado. Para iniciar en Windows usa `INICIAR_WINDOWS.bat`; en Linux Mint `./INICIAR_LINUX.sh` (necesitan Python 3). La compatibilidad móvil real debe comprobarse en dispositivos físicos.
