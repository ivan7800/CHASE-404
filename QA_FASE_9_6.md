# QA — Fase 9.6 · Candidato de lanzamiento (v0.11.6 ALPHA)

## Alcance y hallazgos
- Verificado el proyecto completo heredado de v0.11.5 con `npm run audit`.
- Detectadas tres referencias de versiones desactualizadas en la portada y la pantalla de ajustes (`0.9.4` y `0.10.0`); corregidas a `0.11.6`.
- Incorporada una puerta de distribución `npm run release:gate`, integrada en `npm run audit`: exige archivos esenciales, coherencia de versión, recursos locales, seis modelos GLB, lanzadores Windows/Linux y servidor ligado a `127.0.0.1`.
- Se conservan las 15 misiones, los controles a pie y la física de conducción.

## Criterios para promocionar a RC
**NO SUPERADOS todavía:** sesión jugable real completa, las dos rutas finales, comprobación de botones por interacción real, FPS/memoria en Windows y Linux Mint, móvil, evaluación visual WebGL y mezcla auditiva.

## Revisión manual recomendada
1. Extraer en una ruta sin espacios y otra con espacios; arrancar con `INICIAR_WINDOWS.bat` y `INICIAR_LINUX.sh` respectivamente. Anotar navegador, sistema operativo y mensajes de consola.
2. Comprobar conducción en todas las cámaras, Gael a pie, E para subir/bajar, diálogos, taller, garaje y sonido tras pausar.
3. Completar las 15 misiones en dos partidas (decisión alternativa en 14) y confirmar los dos finales. Verificar persistencia al cerrar y reabrir el navegador.
4. Probar 20 minutos con tráfico y policía en calidades ALTO/MEDIO/ECO y registrar FPS, consumo de RAM y fallos.
5. En móvil, comprobar pantalla estrecha, botones táctiles, orientación, audio voluntario y ausencia de paneles inaccesibles.
6. Antes de GitHub Pages, verificar que los recursos relativos funcionan en la ruta `/CHASE-404/`.

## Estado
**Candidato técnico provisional, NO release certificada.** Las pruebas automáticas y estáticas no reemplazan la validación real. No se publicó en GitHub.
