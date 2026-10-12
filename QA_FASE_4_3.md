# CHASE 404 — QA fase 4.3

Se añade corredor del Eixample condensado, manzanas originales de época y misión 03. No es una reconstrucción geográfica exacta.

## Validación

- `npm test`: PASS, 118/118 pruebas.
- `npm run check`: PASS (exit code 0).
- `npm run assets:validate`: PASS, 6/6 GLB (exit code 0).
- Prueba interactiva de navegador, FPS y recorrido completo: pendiente hasta ejecución verificada.

## Riesgos

La malla ampliada incrementa coste de geometría y demanda de memoria. El corredor requiere evaluación visual en Windows/Linux. La patrulla y tráfico urbano necesitan seguir evolucionando.
