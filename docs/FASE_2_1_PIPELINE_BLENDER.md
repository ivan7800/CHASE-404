# CHASE 404 — Fase 2.1: pipeline Blender → GLB → WebGL

## Estado

Se conserva íntegra la jugabilidad de la v0.4.0. **No es una remasterización visual todavía.** Esta entrega establece herramientas para crear y validar modelos nuevos sin sobrescribir los seis coches actuales.

## Qué se ha añadido

- `blender/chase_asset_library.py`: generador editable de 6 prototipos: tres fachadas de El Carmel (con variantes de tienda y plantas), muro de contención, farola y cabina/mueble telefónico ficticio de época. Los modelos se construyen en Blender desde geometría y materiales propios.
- `tools/validate_assets.mjs`: validador que utiliza **el mismo decodificador GLB del juego** (`src/glb.js`). Revisa el formato, los triángulos, los atributos y los números finitos.
- Comandos npm `assets:validate` y `assets:validate:staging`.

## Generación desde Blender

Requiere Blender 3.6+ o 4.x con exportador glTF incluido. Desde la raíz:

```bash
blender --background --python blender/chase_asset_library.py
npm run assets:validate:staging
```

El comando Blender crea `assets/staging/*.glb` y `assets/staging/catalog.json`. No mueve, renombra ni elimina modelos de `assets/models`.

Antes de publicar modelos en el juego, inspeccionarlos en Blender y navegador, medir rendimiento, verificar escala (1 unidad = 1 metro), origen y orientación y aprobar sus siluetas. No copiar geometría de terceros sin licencia verificable.

## Contrato técnico actual

- Formato GLB 2.0, buffer binario embebido, mallas trianguladas y materiales con color base.
- El importador admite `POSITION`, `NORMAL`, `COLOR_0`, índices y transformaciones de nodos.
- **No admite** texturas PBR, skins, animaciones glTF, buffers externos ni primitivas que no sean triángulos. Usar materiales con color plano hasta ampliar el motor.
- Referencias de coste: fachadas < 12 000 triángulos, props < 2 000, modelos héroe < 15 000 (límites de diseño a contrastar con FPS medidos).
- No sobrescribir `assets/models` hasta superar la validación y el QA visual.

## Próximo paso (2.2)

Construir un primer coche americano original con silueta reconocible, carrocería, ruedas y acabados específicos; exportarlo y verificarlo visualmente en el motor. La generación Blender todavía no está probada aquí, porque no hay ejecutable Blender instalado.
