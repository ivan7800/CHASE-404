# CHASE 404 · QA Fase 6.4 — Audio procedural

**Versión:** 0.9.3 ALPHA · 12/10/2026 · **Publicación bloqueada**

## Alcance implementado

- Audio Web API **opt-in** mediante botón AUDIO o tecla M. AudioContext y nodos solo se crean después de una acción explícita, sin recursos externos ni micrófono.
- Seis perfiles acústicos por coordenadas de la versión condensada de Barcelona 1984 y perfil neutro de circuito arcade.
- Motor/velocidad, derrapes, viento, ruido de tráfico por proximidad, ambiente de barrio, textura industrial de puerto y sirenas con atenuación por distancia. No contiene grabaciones históricas ni diálogo inteligible.
- Sombra sonora de noche: capas de tráfico/voces sintetizadas menos intensas.
- Volumen de 0–100 % en ajustes, guardado con versión existente y lectura tolerante de valores antiguos o inválidos.
- Mute al pausar/ocultar juego/abrir panel; las pistas no se reproducen al abrir el sitio, aunque existiera una preferencia guardada.

## Comprobaciones automatizadas

| Prueba | Resultado |
|---|---|
| `npm run check` | PASS, sintaxis de los 34 módulos JS |
| `npm test` | **247/247 PASS** (antes 239) |
| `npm run assets:validate` | **6/6 GLB** válidos |
| `node tools/audit_project.mjs` | PASS, 163 IDs únicos, 41 botones con referencia estática, 73 puntos geométricamente accesibles |
| Mapa, 6 perfiles y modo arcade | PASS, pruebas deterministas |
| Cálculo de mezclas día/noche, peatón, sirena por distancia | PASS |
| Inicio voluntario, nodos, silencio en pausa, volumen y compatibilidad del guardado | PASS con AudioContext simulado |
| Integración del botón M, UI de volumen y señales policiales | PASS revisión de fuente, no clic real |
| Integridad del paquete ZIP | Se comprueba durante el empaquetado |

## Pruebas no realizadas / bloqueo

Se ha intentado abrir la página con Chromium headless desde el contenedor. La conexión HTTP local respondió `HTTP 000` y Chromium terminó por tiempo límite. **No se ha escuchado salida de audio, ni se ha medido el nivel en dB, latencia, distorsión, consumo CPU o FPS en equipos reales**. Las pruebas con AudioContext simulado verifican flujo de llamadas y valores, no calidad sonora. Requiere la lista manual adjunta.

## Riesgos abiertos

1. Ambientes sintéticos de ruido y osciladores: pueden sonar repetitivos; los filtros no sustituyen a muestras grabadas y licenciadas.
2. Diferentes navegadores/teléfonos pueden limitar o suspender Web Audio. El sonido se habilita solo con un gesto y la app se debe poder jugar en silencio.
3. No hay mezcla espacial HRTF, radio de época ni voces inteligibles, y no se debe insinuar que existen.
4. Se recomienda probar distintos niveles de volumen sin auriculares a alto nivel de salida. La sirena es sintetizada; no se han añadido bocinas.

**Resultado:** integración a nivel de código superada. Validación auditiva y jugable real PENDIENTE. No se declara release candidate ni se publica en GitHub.
