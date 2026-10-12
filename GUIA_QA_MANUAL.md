# CHASE 404 · Registro de aceptación jugable

La auditoría automática **no sustituye** a jugar realmente. Esta herramienta recoge los resultados observados, sin aprobarlos automáticamente.

## Pasos (Windows y Linux Mint)

Necesitas Node.js solo para **registrar las pruebas**; el juego local sigue arrancando con Python 3.

1. Descomprime el ZIP y entra en la carpeta `CHASE-404`.
2. Ejecuta `npm run qa:manual -- init` para crear `ACEPTACION_EVIDENCIAS.json` con **12 criterios pendientes**. No sobrescribe un acta existente.
3. Lanza el juego con `INICIAR_WINDOWS.bat` o `INICIAR_LINUX.sh` y prueba los criterios de `ACEPTACION_MANUAL.md`.
4. Para registrar un resultado real, ejecuta por ejemplo:

```bash
npm run qa:manual -- record --id A03 --status passed --date 2026-10-12 --environment "Windows 11, Chrome" --evidence "WASD, E y C probadas a pie en tres orientaciones del coche, sin inversión"
```

Si encuentras un error, utiliza `--status failed` y describe los pasos para reproducirlo. Si no has podido probar algo, déjalo `pending`; `blocked` sirve para bloqueos externos demostrados. Puedes corregir cualquier registro ejecutando `record` de nuevo.

5. Consulta el resumen: `npm run qa:manual -- list`.
6. Comprueba la aceptación jugable: `npm run acceptance:play`. **Debe fallar mientras haya criterios no aprobados o sin evidencias.**

Guarda capturas y vídeos localmente: el programa solo almacena **tu descripción**, fecha y entorno. No captura pantallas ni mide FPS por sí solo. **No incluyas datos privados en evidencias destinadas a GitHub.** El archivo `ACEPTACION_EVIDENCIAS.json` es local y no debe publicarse.

## Orden aconsejado

Primero A01/A02 (arranque), A03 (controles), A08/A09 (interfaz y ambiente), A07 (contenido secundario), A04–A06 (campaña y finales), A10–A11 (móvil y rendimiento). A12 requiere que decidas publicar o disponer de un despliegue de prueba; permanecerá pendiente hasta entonces. Una validación completa exige repetir la ruta para ambos finales.

## Resumen de bloqueos para la release

Ejecuta `npm run qa:triage` para ver solamente los criterios pendientes, fallidos o bloqueados. El comando **no modifica el acta** y no reproduce las descripciones de evidencias privadas. Devuelve código de error mientras la aceptación no esté completa. Para revisar los resultados usa también `npm run qa:manual -- list`.
