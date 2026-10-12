# CHASE 404 · Primera ejecución y diagnóstico (v0.11.8)

## Windows 10/11

1. Extrae **toda** la carpeta `CHASE-404` del ZIP. No ejecutes el BAT dentro del comprimido.
2. Comprueba que Python 3 está instalado: abre CMD y ejecuta `py -3 --version` o `python --version`.
3. Ejecuta `INICIAR_WINDOWS.bat` desde la carpeta extraída. Mantén abierta la ventana de consola mientras juegas.
4. Si el navegador no se abre solo, copia la dirección `http://127.0.0.1:PUERTO/` que aparece en la consola. El puerto es aleatorio.
5. No abras `index.html` con `file://`, porque los módulos ES y recursos pueden quedar bloqueados.

## Linux Mint

1. Descomprime todo. Abre una terminal en `CHASE-404` y ejecuta `bash INICIAR_LINUX.sh`.
2. Si falta Python: `sudo apt install python3` (requiere acceso a los repositorios de tu distribución).
3. Si el navegador no aparece, abre la URL `http://127.0.0.1:PUERTO/` mostrada en la terminal.
4. Detén el servidor con `Ctrl+C`.

## Diagnóstico sin navegador

- Windows: `py -3 tools\first_run_check.py`
- Linux: `python3 tools/first_run_check.py`

Este comando abre un servidor HTTP temporal, solicita siete recursos/rutas y se cierra. Verifica HTML, módulo JS, CSS, dos GLB y el código 404 de una ruta inexistente. Si falla, copia el mensaje para revisarlo. **No** prueba la imagen WebGL, el sonido, los botones ni la jugabilidad.

## Si se muestra una página vacía

- Confirma que se ha extraído el ZIP completo y que `src/`, `styles/` y `assets/` están junto a `index.html`.
- Abre las herramientas de desarrollador (`F12` → **Consola** y **Red**) y consulta la primera excepción o petición fallida.
- Comprueba WebGL/aceleración gráfica en los ajustes del navegador y actualiza el controlador de vídeo si corresponde.
- Recarga sin caché (`Ctrl+F5`) si has instalado una versión encima de otra. Prueba con un perfil limpio para descartar extensiones, pero **no borres datos del sitio** sin respaldar tu progreso local.
- El juego requiere un navegador moderno con módulos ES, Canvas y WebGL. Una página que entrega HTTP 200 no garantiza que WebGL funcione.

## Si el botón INICIAR MOTOR no responde

- Revisa la consola por si falla la carga de `src/main.js` o de uno de sus módulos.
- Cierra superposiciones como Ayuda y Ajustes; algunas acciones están bloqueadas durante los diálogos o la pausa.
- Comprueba que la página se sirve por `http://127.0.0.1` y no por `file://`.

## GitHub Pages

- Sube los **contenidos internos** de `CHASE-404/` a la raíz del repositorio.
- En Settings → Pages elige GitHub Actions y ejecuta **Deploy GitHub Pages** manualmente.
- Si recibes HTTP 404, revisa mayúsculas/minúsculas y las rutas relativas, y comprueba que el despliegue haya concluido correctamente.
- Publicar no migra el progreso desde `localhost`: el almacenamiento local es diferente para cada origen.

## Criterios de aceptación antes de la release

Una persona debe verificar en Windows y Linux el arranque, conducción, movimiento a pie, cambio de cámara, taller, garaje, sonido y reinicio. También deben jugarse las 15 misiones y los **dos finales**, y comprobarse el resultado real en móvil y GitHub Pages. Registrar errores de consola y FPS en persecuciones. Las pruebas automáticas no sustituyen esta sesión.
