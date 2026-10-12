# CHASE 404 — Fase 6.1 · Iluminación de Barcelona

**Versión:** v0.9.0 ALPHA · **Fecha:** 2026-10-12
**Origen:** CHASE 404 v0.8.6 Fase 5.7 (ZIP completo verificado).
**Release gate:** NO READY; falta validación visual/jugable, FPS Windows/Linux y móvil. No se ha publicado en GitHub.

## Implementación verificable
- `src/atmosphere.js`: 3 perfiles con dirección solar, irradiación, hemisferio, exposición, color de cielo, niebla y energía de farolas. Lectura/escritura local y validación de datos antiguos/corruptos.
- `src/renderer.js`: fragment shader WebGL 1 con uniforms realmente diferenciados; iluminación del escenario, cielo coincidente con el fondo renderizado, fluorescencia cálida en las paletas específicas de farolas/ventanas. Circuitos originales sin alteración del aspecto por el selector.
- `src/main.js` y `index.html`: botón ☼, tecla B (no asignable a conducción), etiqueta de ambiente, sincronización al entrar/salir de BCN, guardado separado `chase404.lighting.v1`. Sin cambios en físicas, IA, misiones, economía o progreso.
- `styles/main.css`: gradación no interactiva, varios ambientes, compatibilidad con alto contraste y móvil.

## Pruebas automáticas
- `npm run check`: PASS (incluye `src/atmosphere.js`).
- `npm test`: **226/226 PASS**; cuatro pruebas nuevas para parámetros de escena, orden de ambientes, persistencia y fallo de almacenamiento, uniforms WebGL y conexiones de interfaz.
- `npm run assets:validate`: **6/6 GLB PASS**.
- `node tools/audit_project.mjs`: PASS, **161 IDs HTML únicos**, **41 botones con handler reconocible estáticamente**, 32 módulos JS y 73 posiciones geométricas alcanzables desde vías en el modelo matemático.
- HTTP local de `index.html`: **200**.
- Chromium con servidor `http://127.0.0.1`: **BLOQUEADO**, `Page.goto: net::ERR_BLOCKED_BY_ADMINISTRATOR`. No hubo sesión visual de WebGL ni clics reales.

## Checklist manual obligatorio
1. Ejecutar `INICIAR_WINDOWS.bat` / `INICIAR_LINUX.sh`, elegir BCN, entrar en la partida y cambiar DÍA / ATARDECER / NOCHE con B y el botón ☼. Comprobar cielo, luz sobre coches y edificios, farolas y niebla sin parpadeos.
2. Recargar: comprobar restauración del aspecto seleccionado. Simular localStorage bloqueado: la interfaz debe avisar y seguir funcionando en sesión.
3. Salir de BCN a un circuito: botón ☼ oculto, iluminación y conducción originales. Volver a BCN: apariencia guardada.
4. Verificar con contraste alto y preferencia de movimiento reducido, pantallas táctiles y cabecera estrecha.
5. Recorrer los seis distritos durante día, tarde y noche; comprobar silueta del coche y legibilidad de vías y señales.
6. Medir FPS con el HUD y navegador de desarrollo en Windows y Linux Mint; registrar caídas, errores de WebGL y pérdida de contexto.
7. Repetir al menos una misión, encargo, secreto, conversación, compra de taller y operación de garaje para asegurar no regresión.

**Alcance**: los uniforms se prueban con mock de WebGL. No se ha demostrado compilación del fragment shader en una GPU real ni la calidad estética de los tres modos. Las ventanas iluminadas y farolas son un efecto de color sobre geometría existente, no luces puntuales físicas proyectadas sobre objetos.
