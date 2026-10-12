# QA · Fase 7.1 — Personajes y vestuario (v0.9.9)

- Gael: capa de detalles en malla independiente (solapas, bolsillos, cuello, cinturón, rostro, cabello); rig de brazos y piernas de v0.9.8 conservado.
- Manel, Clara y Núria: tres siluetas y paletas distintas, con herramientas, bolso y cámara respectivamente. Continúan siendo figuras ambientales estáticas, no personajes con animación facial ni diálogos hablados.
- No se cambian físicas, conducción, control a pie, lógica de misiones ni persistencia.
- QA automatizada: ejecutar `npm run audit` y comprobar los resultados del registro.
- Pendiente: comprobar encuadres y siluetas en WebGL real, interacción desde varios ángulos, FPS en Windows/Linux/móvil.

## Resultados en este entorno

- `npm run audit`: **271/271 pruebas**, 6/6 GLB; auditoría estática satisfactoria.
- La validación visual, auditiva y de FPS no se ha realizado: requiere navegador WebGL real.
- Este cambio no supone una certificación de experiencia jugable.
