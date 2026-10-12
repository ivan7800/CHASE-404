# Fase 2.2 — Verenne V8 · carrocería americana de 1984

El primer coche remasterizado corresponde al **BLAZE V12**, que utiliza una nueva carrocería original denominada **Verenne V8 1984**. Se conserva el ID `blaze` para no romper garaje, ajustes, guardados o controles existentes. Las físicas, las ruedas dinámicas y la cámara son las actuales.

## Producción y edición

- Fuente procedural versionada: `src/hero-car.js` (malla modificable sin Blender).
- `npm run assets:build` regenera los seis modelos GLB, incluido `assets/models/blaze.glb`.
- `npm run assets:validate` utiliza el importador real del navegador.
- Con Blender 4.x instalado: `blender -b --python blender/editar_verenne_v8.py` importa el GLB y genera `blender/VERENNE_V8_1984.blend` editable. Este paso **no ha sido ejecutado** aquí, por no disponer de Blender.
- Si se edita el `.blend` y se desea exportar al motor, usar glTF Binary (.glb), **geometría de triángulos y colores planos compatibles**. El importador no maneja texturas, skinning ni animaciones glTF; validar el archivo antes de reemplazarlo.

## Límites conocidos

El modelo se ha generado y validado técnicamente, no revisado visualmente en GPU real. La iluminación no reproduce materiales PBR o transparencias auténticas: la apariencia cromada y el cristal se simulan con colores de vértice. Las ruedas procedurales existentes se conservan y siguen renderizándose por separado. No es una réplica licenciada de ningún automóvil real. El nombre de la selección sigue siendo BLAZE V12 hasta rediseñar el catálogo de vehículos en una fase posterior.
