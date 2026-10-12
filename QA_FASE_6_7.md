# CHASE 404 — Pulido del personaje a pie · v0.9.8

## Implementación
- Silueta de Gael reconstruida: torso, cuello/hombros, cabeza, pelo y cintura sin extremidades fijas superpuestas.
- Piernas y brazos dibujados mediante segmentos independientes con giro sobre caderas y hombros.
- Zancada más amplia al correr y balanceo corporal suave al caminar; reposo sin oscilación.
- `running` refleja la acción de correr para la animación, sin modificar velocidad ni colisiones.
- Se preserva la cámara corregida en v0.9.7 y la conducción.

## Auditoría
Ejecutar `npm run audit` desde la carpeta CHASE-404. El paquete incluye pruebas automatizadas nuevas para estado de carrera y geometría de extremidades.

## Pendientes de comprobar manualmente
1. En BCN > Exploración libre, E para salir del vehículo; W/A/S/D para caminar.
2. Espacio para correr; confirmar que la zancada es más amplia y no aparecen extremidades duplicadas.
3. Soltar controles; el personaje debe quedarse quieto.
4. Girar y pulsar C; cámara y animación deben permanecer coherentes.
5. Entrar en coche y comprobar que dirección, aceleración y cámaras originales se mantienen.
6. Comparar en Windows, Linux Mint y móvil; medir FPS.

**Alcance**: animación procedimental estilizada de baja poligonización, NO captura de movimiento ni rig 3D profesional. No se ha certificado prueba visual real en Chromium.
