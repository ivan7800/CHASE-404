# QA Fase 11.8 — Materiales y ventanas

Versión 0.13.2 ALPHA. Se añaden marcos en relieve, vidrio oscuro/cálido, zócalos cerámicos y bandas de revoco a nueve fachadas de Gràcia y ocho casas del Carmel. Materiales mediante colores de vértice, sin texturas externas. Las ventanas iluminadas reutilizan la paleta de emisión nocturna existente. No se modifica la física, navegación, conducción, malla vial ni campañas.

Las pruebas de código y geometría no certifican el resultado visual. Deben revisarse colisiones visuales, solapes y FPS a día/atardecer/noche en un navegador real.

## Resultados en este entorno
- Pruebas focalizadas 11.7 + 11.8: 4/4 aprobadas.
- `npm run check`: correcto.
- `npm run assets:validate`: correcto.
- `npm run release:gate`: correcto, 20 recursos críticos y seis GLB.
- `npm run site:prepare`: correcto, 57 archivos publicables.
- Batería `npm test` completa: ejecución interrumpida por límite de tiempo; no certificada.
- Capturas WebGL, jugabilidad, iluminación y FPS reales: pendientes.
