# Fase 10.4 — Candidato de aceptación técnica

- Se incorpora una puerta de aceptación verificable (`tools/acceptance_gate.mjs`) y un informe JSON reproducible.
- Verifica los diez recursos esenciales (incluidos los seis GLB), staging, lista blanca de archivos, coincidencia del HTML publicado, documentación y despliegue manual.
- Los resultados automáticos no certifican la experiencia real; la bandera `--require-manual` devuelve fallo deliberadamente hasta contar con evidencia externa.
- Se incorpora `ACEPTACION_MANUAL.md` con doce condiciones y sus evidencias exigidas.
- No se modifica la conducción, movimiento a pie, sistema de misiones ni persistencia.
