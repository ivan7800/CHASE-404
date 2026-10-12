# CHASE 404 · Protocolo de pruebas reales · Fase 6.5

Estas verificaciones requieren un navegador WebGL real en Windows, Linux Mint o teléfono. Las pruebas automáticas no las sustituyen.

1. Descomprime la versión 0.9.4 y ejecuta `INICIAR_WINDOWS.bat` o `bash INICIAR_LINUX.sh` (Python 3 instalado). Abre la URL local mostrada por el lanzador. No utilices `file://`.
2. Abre las herramientas del navegador (Consola y Rendimiento). Registra dispositivo, GPU, navegador, tamaño/escala de pantalla, modo de calidad, barrio, iluminación y velocidad aproximada del vehículo.
3. Durante **60 segundos** en El Carmel y otros 60 en el puerto, con tráfico, repite la ruta en **ALTO**, **MEDIO**, **ECO** y **AUTO**. Tras 10 s de calentamiento registra FPS promedio visible y mínimo observado del HUD; anota caídas evidentes, temperaturas y consumo si es posible. No extrapoles cifras si no se midieron.
4. Comprueba que MEDIO/ECO dibujan completos los coches cercanos, que los rivales lejanos mantienen carrocería sin ruedas/sombras, y que siguen colisionando y circulando independientemente de su nivel visual. Verifica semáforos al acercarte.
5. En pantalla de alta densidad y móvil, revisa calidad de calzada, legibilidad de HUD, márgenes, botones táctiles, cambios de orientación y respuesta de acelerador/freno. Prueba los modos de cámara CHASE, WIDE y BONNET.
6. Activa AUDIO con **M** y conduce del Carmel al puerto: comprueba transiciones de ambiente, motor, derrapes, sirena, avisos de choque y volumen. Repite tras **M** para desactivar/activar; no debe haber reproducción antes de consentimiento ni silencio permanente tras activarla.
7. Cambia día/atardecer/noche y FX OFF. Comprueba que el brillo de los vehículos y el aspecto de las farolas se mantienen correctos, sin parpadeo. Asegúrate de que la pausa y cambiar de pestaña silencian el audio.
8. Comprueba una misión (incluida la persecución final si hay avance), un desafío remunerado, un secreto, un contacto, reparación de taller y recuperación de coche del garaje. Cierra y reabre: persisten el saldo y las decisiones.
9. Revisa consola: sin errores WebGL/shader, rechazos de Web Audio, `TypeError`, rutas rotas o eventos sin manejador. En móvil, comprueba cierres por memoria al jugar al menos 10 minutos.
10. Marca cada resultado como **APROBADO / FALLO / NO PROBADO** y conserva capturas y registro de consola. No publicar hasta completar esta lista y la auditoría global de la Fase 6.6.
