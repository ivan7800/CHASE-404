# QA — Fase 5.6 · CHASE 404 v0.8.5

**Fecha:** 2026-10-12. **Estado:** ALPHA · pendientes pruebas de navegador y hardware. **Publicación:** NO AUTORIZADA.

## Alcance implementado

- Seis modelos GLB heredados, quince capítulos de campaña, desafíos, garaje, taller y archivo conservados.
- Módulo `src/contacts.js` con tres contactos, ubicaciones en calles, tres ciclos de encargo (`new → active → found → done`) y dos consecuencias persistidas por contacto.
- Manel Roca en El Carmel; Clara Vidal en Gràcia; Núria Soler en el Eixample. Las pruebas están en Guinardó, Eixample y puerto.
- Tres NPC construidos con geometría low-poly estática en `src/city.js`, con señales cercanas a carretera. Los modelos de personajes son elementos procedimentales, no GLB nuevos.
- Modal de diálogos con decisiones, diario de contactos, minimapa, HUD contextual, soporte teclado N/J y botones con foco gestionado.
- Se permite interactuar únicamente a pie, en modo Exploración libre, a menos de 18 unidades de la localización y sin persecución policial.
- Persistencia compartida en `chase404.side.v1`, con recompensas únicas, saneamiento de datos y cobro posterior a la escritura exitosa. No se altera la campaña ni se añade backend.

## Comprobaciones ejecutadas

| Verificación | Resultado | Alcance |
| --- | --- | --- |
| `npm test` | **214/214 PASS** | 10 pruebas nuevas, regresión de 204 anteriores |
| `npm run check` | **PASS** | Validación sintáctica JS incluyendo `contacts.js` |
| `npm run assets:validate` | **6/6 PASS** | Mallas GLB sin cambios |
| Coordenadas frente a red de calles | **PASS** | Personajes y evidencias en vías representadas |
| Identificadores HTML y referencias estáticas | **PASS** | Sin duplicados y con referencias en `main.js` |
| Local HTTP 127.0.0.1 | **200 OK** | Respuesta a `curl -I` para `index.html` |
| Chromium WebGL + clicks reales | **NO VERIFICADO** | Chromium no llegó a renderizar una sesión verificable desde este entorno |
| Windows 10/11 y Linux Mint + móvil | **PENDIENTE** | No ejecutados sobre esos dispositivos |
| FPS, visibilidad, colisiones con NPCs, accesibilidad real | **PENDIENTE** | Requiere juego manual / navegador |

## Casos cubiertos por pruebas automáticas

1. Catálogo de tres contactos, identidades, relatos, objetivos y proximidad geométrica de carreteras.
2. Aceptar → buscar → entregar original con cobro único.
3. Guardar copia: recompensa diferenciada y reacción narrativa por contacto.
4. Bloqueo de interacción en coche, en persecución, fuera de rango y estados inválidos.
5. Dos elecciones y estados terminados sin cobros repetidos.
6. Saneamiento de datos externos corruptos, IDs desconocidos y registros sin decisión.
7. Persistencia local completa con histórico antiguo, récords, taller y descubrimientos.
8. Simulación de almacenamiento denegado: no se consolida ninguna transacción.
9. Flujo de interacciones conectado a botones/teclas y referencias HTML.
10. Regresión previa de física, campaña, tráfico, guardado, controles y modelos.

## Limitaciones y riesgos antes de llamarlo terminado

- Los personajes son figuras geométricas fijas sin animaciones, voz, escenas de diálogo dentro del mundo o reacciones espaciales.
- Las consecuencias afectan a la historia secundaria y a las pesetas; no cambian los desenlaces principales de Gael.
- El diario solo puede abrirse durante Exploración libre; los contactos se bloquean durante misiones y carreras para evitar alterar sus temporizadores.
- `J` puede estar reasignada por un perfil previo de controles. El botón **VOCES** sigue siendo la alternativa accesible; esta colisión de teclas debe resolverse en la fase 5.7.
- Las coordenadas son una Barcelona ficticia y condensada, no una reconstrucción verificada de 1984.
- Debe validarse en pantalla que las figuras y los marcadores realmente se ven, que los botones táctiles son cómodos y que el jugador puede completar las tres búsquedas sin obstáculos de navegación.

**Gate de release: BLOQUEADO** hasta QA visual/jugable y de rendimiento. No subir a GitHub sin orden expresa del usuario.
