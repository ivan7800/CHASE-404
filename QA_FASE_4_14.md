# QA — FASE 4.14 · CHASE 404 v0.7.3

## Alcance
Misión 14 «La última decisión», dos alternativas exclusivas, persistencia local versionada y continuidad de campaña.

## Comprobaciones ejecutadas
- `npm test`: 161/161 PASS.
- `npm run check`: PASS (exit code 0).
- `npm run assets:validate`: PASS (6/6 GLB).
- ZIP: comprobación de integridad previa a entrega.

## Pendiente de ejecución
- Prueba visual y funcional de la misión 14 en navegador real.
- Ruta completa navegando físicamente por las calles y rendimiento FPS.
- Prueba cruzada real en Windows 10/11 y Linux Mint.

## Riesgos conocidos
- Animaciones y personaje del hermano sin representación 3D.
- La elección final se persiste, pero su consecuencia para la misión 15 está pendiente de esa fase.
- Las pruebas unitarias no prueban por sí solas la jugabilidad real.

## Estado
ALPHA · QA funcional parcial · release bloqueada hasta validación interactiva.
