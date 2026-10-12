# QA · CHASE 404 v0.8.1 — Fase 5.2

## Implementado
- Taller del Carmel visible por geometría procedimental, localización 106/132; acceso T o botón, solo en modo urbano, cerca y parado/a pie, sin persecución policial.
- Diálogo accesible con acciones de reparación y mejoras, pausa temporal de simulación y bloqueo de interacción de conducción.
- Coste de reparación por daño y mejoras por modelo (motor, dirección y frenos; máximo dos niveles).
- Transacciones persistidas antes de aplicar efectos: evita cobrar en memoria si el guardado falla.
- Migración no destructiva: `chase404.side.v1` conserva completados/mejor tiempo/saldo y añade `workshop` opcional; no toca datos de campaña.

## Evidencia
- `npm run check` -> exit 0, sin errores de sintaxis.
- `npm test` -> exit 0, 175/175 pruebas PASS. Incluye 7 pruebas nuevas de negocio del taller.
- `npm run assets:validate` -> exit 0, 6/6 GLB válidos.
- Servidor HTTP local: arranca, pero la conexión desde el propio contenedor es rechazada (`ConnectionRefusedError`). No se registra como PASS.
- Inspección estática HTML: 116 IDs únicos y sin referencias ausentes en selectores `$()` de `src/main.js`.

## Pendiente / limitaciones
- Chromium con servidor HTTP local: **NO EJECUTABLE**, `net::ERR_BLOCKED_BY_ADMINISTRATOR` al visitar `127.0.0.1`. No se declara prueba WebGL ni interacción real superada.
- No se han medido FPS en Windows/Linux; escena del taller no inspeccionada visualmente en GPU real.
- Taller exterior simplificado; no NPC mecánico, interiores ni animaciones de reparación.
- Colisiones del edificio están sujetas a la física arcade general del juego (no nuevas colisiones específicas de fachadas).

## QA gate
PENDING, no apto aún para declarar release estable. Revisión manual: iniciar BCN, llegar a 106/132, detener vehículo, pulsar T, verificar reparación y dos niveles, jugar un recado, recargar para comprobar persistencia, repetir en circuitos y con policía persiguiendo.
